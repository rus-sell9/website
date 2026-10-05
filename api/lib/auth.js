import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { authenticator } from "otplib";

const SESSION_COOKIE = "sl_admin_session";
const SESSION_TTL_SEC = 30 * 60; // 30 minutes
const MAX_FAILS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const ATTEMPTS_PATHNAME = "admin-auth-attempts.json";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set (min 32 chars)");
  }
  return new TextEncoder().encode(secret);
}

export function hashAccessCode(code) {
  const salt = randomBytes(16);
  const hash = scryptSync(code, salt, 64);
  return `scrypt$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export function verifyAccessCode(code, stored) {
  if (!stored || !stored.startsWith("scrypt$")) return false;
  const parts = stored.split("$");
  if (parts.length !== 3) return false;
  const salt = Buffer.from(parts[1], "base64");
  const expected = Buffer.from(parts[2], "base64");
  const actual = scryptSync(code, salt, expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function verifyTotp(token) {
  const secret = process.env.TOTP_SECRET;
  if (!secret) return false;
  try {
    return authenticator.check(String(token || "").replace(/\s/g, ""), secret);
  } catch {
    return false;
  }
}

export async function createSessionToken(name) {
  const key = getSecretKey();
  return new SignJWT({ name, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SEC}s`)
    .sign(key);
}

export async function verifySessionToken(token) {
  if (!token) return null;
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieHeader(token) {
  const maxAge = SESSION_TTL_SEC;
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export function clearSessionCookieHeader() {
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`;
}

export function getSessionFromRequest(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function requireAdmin(req) {
  const token = getSessionFromRequest(req);
  const payload = await verifySessionToken(token);
  if (!payload) return { ok: false, status: 401, error: "Unauthorized" };
  return { ok: true, session: payload };
}

export function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

function ipKey(ip) {
  return createHash("sha256")
    .update(String(ip) + (process.env.SESSION_SECRET || ""))
    .digest("hex")
    .slice(0, 24);
}

async function loadAttempts() {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: ATTEMPTS_PATHNAME, limit: 5 });
    const hit = blobs.find((b) => b.pathname === ATTEMPTS_PATHNAME || b.pathname.endsWith(ATTEMPTS_PATHNAME));
    if (hit?.url) {
      const res = await fetch(hit.url, { cache: "no-store" });
      if (res.ok) return await res.json();
    }
  } catch { /* empty */ }
  return {};
}

async function saveAttempts(data) {
  const { put } = await import("@vercel/blob");
  await put(ATTEMPTS_PATHNAME, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function checkRateLimit(req) {
  const ip = clientIp(req);
  const key = ipKey(ip);
  const now = Date.now();
  let data = {};
  try { data = await loadAttempts(); } catch { data = {}; }
  const entry = data[key] || { fails: 0, lockedUntil: 0 };
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const mins = Math.ceil((entry.lockedUntil - now) / 60000);
    return { ok: false, status: 429, error: `Too many attempts. Try again in ${mins} minute(s).`, ip, key, entry, data };
  }
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    entry.fails = 0;
    entry.lockedUntil = 0;
  }
  return { ok: true, ip, key, entry, data };
}

export async function recordFailedAttempt(rate) {
  const { key, entry, data } = rate;
  entry.fails = (entry.fails || 0) + 1;
  if (entry.fails >= MAX_FAILS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    entry.fails = 0;
  }
  data[key] = entry;
  try { await saveAttempts(data); } catch { /* best effort */ }
}

export async function clearFailedAttempts(rate) {
  if (!rate?.key) return;
  const data = rate.data || {};
  delete data[rate.key];
  try { await saveAttempts(data); } catch { /* best effort */ }
}

export async function notifyTelegram({ name, success, ip, detail }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const when = new Date().toISOString();
  let location = "unknown";
  try {
    if (ip && ip !== "unknown" && !String(ip).startsWith("127.") && ip !== "::1") {
      const geo = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
        signal: AbortSignal.timeout(2500),
      });
      if (geo.ok) {
        const g = await geo.json();
        location = [g.city, g.region, g.country_name].filter(Boolean).join(", ") || "unknown";
      }
    }
  } catch { /* ignore */ }

  const status = success ? "✅ SUCCESS" : "❌ FAILED";
  const text = [
    "SL Cleaning Admin Login",
    status,
    `Name: ${name || "(empty)"}`,
    `Time: ${when}`,
    `IP: ${ip}`,
    `Location: ${location}`,
    detail ? `Detail: ${detail}` : null,
  ].filter(Boolean).join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(4000),
    });
  } catch { /* never block login */ }
}

export function sendJson(res, body, status = 200, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  for (const [k, v] of Object.entries(extraHeaders)) {
    res.setHeader(k, v);
  }
  res.end(JSON.stringify(body));
}

export { SESSION_COOKIE };
