// SL Cleaning Services — Cloudflare Worker
// Serves the website files, the /api/* backend, and photos stored in R2.
// Replaces the Vercel functions in /api (those stay in the repo while Vercel is live).
import { SignJWT, jwtVerify } from "jose";

const SERVICES = ["residential", "deep-cleaning", "move-in-move-out", "commercial"];
const COOKIE = "sl_admin_session";
const SESSION_TTL_SEC = 30 * 60;
const MAX_FAILS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const META_KEY = "photos-meta.json";
const ATTEMPTS_KEY = "admin-auth-attempts.json";
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const enc = new TextEncoder();

/* ---------- small helpers ---------- */

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...extra },
  });
}

function hostOf(request) {
  return new URL(request.url).hostname.toLowerCase();
}

function isAdminHost(request, env) {
  const h = hostOf(request);
  if (h.startsWith("admin.")) return true;
  return env.ALLOW_WORKERS_DEV_ADMIN === "1" && h.endsWith(".workers.dev");
}

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function readJson(request) {
  try {
    return (await request.json()) || {};
  } catch {
    return {};
  }
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const m = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

/* ---------- access code (PBKDF2) and authenticator code (TOTP) ---------- */

// Stored format: pbkdf2$<iterations>$<salt base64>$<hash base64>
async function verifyAccessCode(code, stored) {
  if (!stored || !stored.startsWith("pbkdf2$")) return false;
  const parts = stored.split("$");
  if (parts.length !== 4) return false;
  const iterations = parseInt(parts[1], 10);
  if (!iterations || iterations < 1000) return false;
  const salt = b64ToBytes(parts[2]);
  const expected = b64ToBytes(parts[3]);
  const key = await crypto.subtle.importKey("raw", enc.encode(code), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    expected.length * 8
  );
  return constantTimeEqual(new Uint8Array(bits), expected);
}

function base32Decode(str) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = str.replace(/=+$/, "").replace(/\s/g, "").toUpperCase();
  let bits = 0, value = 0;
  const out = [];
  for (const ch of clean) {
    const idx = alphabet.indexOf(ch);
    if (idx === -1) throw new Error("bad base32");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(out);
}

async function totpAt(secretBytes, counter) {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(0, Math.floor(counter / 2 ** 32));
  view.setUint32(4, counter >>> 0);
  const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const h = new Uint8Array(await crypto.subtle.sign("HMAC", key, buf));
  const off = h[h.length - 1] & 0x0f;
  const bin =
    ((h[off] & 0x7f) << 24) | (h[off + 1] << 16) | (h[off + 2] << 8) | h[off + 3];
  return String(bin % 1_000_000).padStart(6, "0");
}

async function verifyTotp(token, env) {
  if (!env.TOTP_SECRET) return false;
  const t = String(token || "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(t)) return false;
  try {
    const secret = base32Decode(env.TOTP_SECRET);
    const now = Math.floor(Date.now() / 30000);
    let ok = false;
    for (const delta of [-1, 0, 1]) {
      if ((await totpAt(secret, now + delta)) === t) ok = true;
    }
    return ok;
  } catch {
    return false;
  }
}

/* ---------- session cookie ---------- */

function secretKey(env) {
  if (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32) {
    throw new Error("SESSION_SECRET must be set (min 32 chars)");
  }
  return enc.encode(env.SESSION_SECRET);
}

async function createSessionToken(name, env) {
  return new SignJWT({ name, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SEC}s`)
    .sign(secretKey(env));
}

async function requireAdmin(request, env) {
  const token = getCookie(request, COOKIE);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(env), { algorithms: ["HS256"] });
    return payload.role === "admin" ? payload : null;
  } catch {
    return null;
  }
}

const sessionCookie = (token) =>
  `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SEC}`;
const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

/* ---------- login attempts (kept private in R2) ---------- */

async function loadJson(env, key, fallback) {
  try {
    const obj = await env.PHOTOS.get(key);
    if (!obj) return fallback;
    return await obj.json();
  } catch {
    return fallback;
  }
}

async function saveJson(env, key, data) {
  await env.PHOTOS.put(key, JSON.stringify(data), {
    httpMetadata: { contentType: "application/json" },
  });
}

async function ipKey(ip, env) {
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(String(ip) + (env.SESSION_SECRET || "")));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 24);
}

async function checkRateLimit(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = await ipKey(ip, env);
  const now = Date.now();
  const data = await loadJson(env, ATTEMPTS_KEY, {});
  const entry = data[key] || { fails: 0, lockedUntil: 0 };
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const mins = Math.ceil((entry.lockedUntil - now) / 60000);
    return { ok: false, error: `Too many attempts. Try again in ${mins} minute(s).`, ip };
  }
  if (entry.lockedUntil && entry.lockedUntil <= now) {
    entry.fails = 0;
    entry.lockedUntil = 0;
  }
  return { ok: true, ip, key, entry, data };
}

async function recordFailedAttempt(rate, env) {
  const { key, entry, data } = rate;
  entry.fails = (entry.fails || 0) + 1;
  if (entry.fails >= MAX_FAILS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    entry.fails = 0;
  }
  data[key] = entry;
  try { await saveJson(env, ATTEMPTS_KEY, data); } catch { /* best effort */ }
}

async function clearFailedAttempts(rate, env) {
  if (!rate?.key) return;
  const data = rate.data || {};
  if (!(rate.key in data)) return;
  delete data[rate.key];
  try { await saveJson(env, ATTEMPTS_KEY, data); } catch { /* best effort */ }
}

async function notifyTelegram(env, { name, success, ip, detail }) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;
  let location = "unknown";
  try {
    if (ip && ip !== "unknown") {
      const geo = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
        signal: AbortSignal.timeout(2500),
      });
      if (geo.ok) {
        const g = await geo.json();
        location = [g.city, g.region, g.country_name].filter(Boolean).join(", ") || "unknown";
      }
    }
  } catch { /* ignore */ }
  const text = [
    "SL Cleaning Admin Login",
    success ? "✅ SUCCESS" : "❌ FAILED",
    `Name: ${name || "(empty)"}`,
    `Time: ${new Date().toISOString()}`,
    `IP: ${ip}`,
    `Location: ${location}`,
    detail ? `Detail: ${detail}` : null,
  ].filter(Boolean).join("\n");
  try {
    await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
      signal: AbortSignal.timeout(4000),
    });
  } catch { /* never block login */ }
}

/* ---------- photo list (a JSON file in R2) and image files ---------- */

const emptyMeta = () => Object.fromEntries(SERVICES.map((s) => [s, []]));

async function loadMeta(env) {
  const data = await loadJson(env, META_KEY, {});
  const meta = emptyMeta();
  for (const s of SERVICES) {
    if (Array.isArray(data[s])) meta[s] = data[s].filter((p) => p && (p.before || p.after));
  }
  return meta;
}

async function saveMeta(env, meta) {
  for (const s of SERVICES) {
    if (!Array.isArray(meta[s])) meta[s] = [];
    meta[s] = meta[s].filter((p) => p && (p.before || p.after));
    meta[s].forEach((item, i) => { item.order = i; });
  }
  await saveJson(env, META_KEY, meta);
  return meta;
}

const newPhotoId = () =>
  `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

async function deleteImageByUrl(env, url) {
  if (typeof url !== "string" || !url.startsWith("/img/work/")) return;
  try { await env.PHOTOS.delete(decodeURIComponent(url.slice(5))); } catch { /* ignore */ }
}

async function serveImage(request, env, key) {
  if (!key.startsWith("work/")) return new Response("Not found", { status: 404 });
  const obj = await env.PHOTOS.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("ETag", obj.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(obj.body, { headers });
}

/* ---------- API routes ---------- */

async function login(request, env, ctx) {
  const body = await readJson(request);
  const name = String(body.name || "").trim().slice(0, 80);
  const accessCode = String(body.accessCode || "");
  const totp = String(body.totp || "").replace(/\s/g, "");

  const rate = await checkRateLimit(request, env);
  if (!rate.ok) {
    ctx.waitUntil(notifyTelegram(env, { name, success: false, ip: rate.ip, detail: "Rate limited / locked out" }));
    return json({ error: rate.error }, 429);
  }
  if (!env.ACCESS_CODE_HASH || !env.TOTP_SECRET || !env.SESSION_SECRET) {
    return json({ error: "Server auth is not configured" }, 500);
  }

  const codeOk = await verifyAccessCode(accessCode, env.ACCESS_CODE_HASH);
  const totpOk = await verifyTotp(totp, env);

  if (!name || !codeOk || !totpOk) {
    await recordFailedAttempt(rate, env);
    const detail = !name ? "Missing name"
      : !codeOk && !totpOk ? "Bad access code and TOTP"
      : !codeOk ? "Bad access code" : "Bad TOTP";
    ctx.waitUntil(notifyTelegram(env, { name, success: false, ip: rate.ip, detail }));
    return json({ error: "Invalid credentials" }, 401);
  }

  await clearFailedAttempts(rate, env);
  const token = await createSessionToken(name, env);
  ctx.waitUntil(notifyTelegram(env, { name, success: true, ip: rate.ip, detail: "Logged in" }));
  return json(
    { ok: true, name, expiresAt: Date.now() + SESSION_TTL_SEC * 1000 },
    200,
    { "Set-Cookie": sessionCookie(token) }
  );
}

async function me(request, env) {
  const s = await requireAdmin(request, env);
  if (!s) return json({ authenticated: false });
  return json({
    authenticated: true,
    name: s.name,
    expiresAt: typeof s.exp === "number" ? s.exp * 1000 : null,
  });
}

async function photosList(request, env) {
  const service = new URL(request.url).searchParams.get("service");
  const meta = await loadMeta(env);
  const sorted = (arr) => (arr || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  if (service) {
    if (!SERVICES.includes(service)) return json({ error: "Unknown service" }, 400);
    return json({ service, items: sorted(meta[service]) });
  }
  const out = {};
  for (const s of SERVICES) out[s] = sorted(meta[s]);
  return json({ services: out });
}

async function photosUpload(request, env) {
  const body = await readJson(request);
  const service = String(body.service || "");
  const role = String(body.role || "").toLowerCase();
  const caption = String(body.caption || "").slice(0, 200);
  const captionEs = String(body.captionEs || "").slice(0, 200);
  const dataUrl = String(body.dataUrl || body.image || "");
  const pairWithId = body.pairWithId ? String(body.pairWithId) : null;

  if (!SERVICES.includes(service)) return json({ error: `Invalid service: ${service || "(empty)"}` }, 400);
  if (role !== "before" && role !== "after") return json({ error: 'role must be "before" or "after"' }, 400);

  const m = dataUrl.match(/^data:(image\/(?:webp|jpeg|png));base64,(.+)$/s);
  if (!m) return json({ error: "Missing or unsupported image data (use WebP, JPEG or PNG)." }, 400);
  const contentType = m[1];
  if (m[2].length > MAX_IMAGE_BYTES * 1.4) return json({ error: "Image too large. Max ~4 MB." }, 400);

  let bytes;
  try { bytes = b64ToBytes(m[2]); } catch { return json({ error: "Invalid base64 image" }, 400); }
  if (bytes.length < 100) return json({ error: "Image too small" }, 400);
  if (bytes.length > MAX_IMAGE_BYTES) {
    return json({ error: `Image too large (${Math.round(bytes.length / 1024)} KB). Max ~4 MB.` }, 400);
  }
  const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[8] === 0x57; // RIFF....WEBP
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8;
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
  if (!(isWebp || isJpeg || isPng)) return json({ error: "File is not a valid image." }, 400);

  const ext = contentType === "image/jpeg" ? "jpg" : contentType === "image/png" ? "png" : "webp";
  const key = `work/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${service}-${role}.${ext}`;
  await env.PHOTOS.put(key, bytes, { httpMetadata: { contentType } });
  const url = `/img/${key}`;

  const meta = await loadMeta(env);
  const list = meta[service];

  if (pairWithId) {
    const existing = list.find((p) => p.id === pairWithId);
    if (!existing) return json({ error: "Pair target not found" }, 404);
    if (role === "before") {
      if (existing.before) await deleteImageByUrl(env, existing.before);
      existing.before = url;
    } else {
      if (existing.after) await deleteImageByUrl(env, existing.after);
      existing.after = url;
    }
    if (caption) existing.caption = caption;
    if (captionEs) existing.captionEs = captionEs;
    await saveMeta(env, meta);
    return json({ ok: true, item: existing, items: meta[service] });
  }

  const item = {
    id: newPhotoId(),
    before: role === "before" ? url : null,
    after: role === "after" ? url : null,
    caption,
    captionEs,
    order: list.length,
  };
  list.push(item);
  await saveMeta(env, meta);
  return json({ ok: true, item, items: meta[service] });
}

async function photosDelete(request, env) {
  const body = await readJson(request);
  const service = String(body.service || "");
  const id = String(body.id || "");
  const side = String(body.side || "all").toLowerCase();
  if (!SERVICES.includes(service) || !id) return json({ error: "service and id required" }, 400);

  const meta = await loadMeta(env);
  const list = meta[service];
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return json({ error: "Not found" }, 404);
  const item = list[idx];

  if (side === "before" || side === "all") {
    if (item.before) await deleteImageByUrl(env, item.before);
    item.before = null;
  }
  if (side === "after" || side === "all") {
    if (item.after) await deleteImageByUrl(env, item.after);
    item.after = null;
  }
  if (side === "all" || (!item.before && !item.after)) list.splice(idx, 1);

  await saveMeta(env, meta);
  return json({ ok: true });
}

async function photosUpdate(request, env) {
  const body = await readJson(request);
  const service = String(body.service || "");
  const id = String(body.id || "");
  if (!SERVICES.includes(service) || !id) return json({ error: "service and id required" }, 400);

  const meta = await loadMeta(env);
  const list = meta[service];
  const item = list.find((p) => p.id === id);
  if (!item) return json({ error: "Not found" }, 404);

  if (typeof body.caption === "string") item.caption = body.caption.slice(0, 200);
  if (typeof body.captionEs === "string") item.captionEs = body.captionEs.slice(0, 200);

  if (body.pairBeforeFromId) {
    const src = list.find((p) => p.id === String(body.pairBeforeFromId));
    if (!src) return json({ error: "Source item not found" }, 404);
    if (src.before) {
      if (item.before) await deleteImageByUrl(env, item.before);
      item.before = src.before;
      src.before = null;
    } else if (src.after && !item.before) {
      item.before = src.after;
      src.after = null;
    }
  }
  await saveMeta(env, meta);
  return json({ ok: true, item, items: meta[service] });
}

async function photosReorder(request, env) {
  const body = await readJson(request);
  const service = String(body.service || "");
  const order = body.order;
  if (!SERVICES.includes(service) || !Array.isArray(order)) {
    return json({ error: "service and order[] required" }, 400);
  }
  const meta = await loadMeta(env);
  const byId = Object.fromEntries(meta[service].map((p) => [p.id, p]));
  const next = [];
  for (const id of order) {
    if (byId[id]) { next.push(byId[id]); delete byId[id]; }
  }
  for (const leftover of Object.values(byId)) next.push(leftover);
  meta[service] = next;
  await saveMeta(env, meta);
  return json({ ok: true, items: meta[service] });
}

// path -> { method(s), handler, admin: needs admin host, auth: needs login }
const ROUTES = {
  "/api/auth/login": { methods: ["POST"], handler: login, admin: true },
  "/api/auth/logout": {
    methods: ["POST"], admin: true,
    handler: async () => json({ ok: true }, 200, { "Set-Cookie": clearCookie() }),
  },
  "/api/auth/me": { methods: ["GET"], handler: me, admin: true },
  "/api/photos/list": { methods: ["GET"], handler: photosList },
  "/api/photos/upload": { methods: ["POST"], handler: photosUpload, admin: true, auth: true },
  "/api/photos/delete": { methods: ["POST", "DELETE"], handler: photosDelete, admin: true, auth: true },
  "/api/photos/update": { methods: ["POST"], handler: photosUpdate, admin: true, auth: true },
  "/api/photos/reorder": { methods: ["POST"], handler: photosReorder, admin: true, auth: true },
};

async function handleApi(request, env, ctx) {
  const url = new URL(request.url);
  const route = ROUTES[url.pathname];
  if (!route) return json({ error: "Not found" }, 404);
  if (route.admin && !isAdminHost(request, env)) return json({ error: "Not found" }, 404);
  if (!route.methods.includes(request.method)) return json({ error: "Method not allowed" }, 405);

  if (request.method !== "GET") {
    // Block cross-site requests: the browser's Origin must match this site.
    const origin = request.headers.get("Origin");
    if (origin && new URL(origin).host !== url.host) return json({ error: "Forbidden" }, 403);
  }
  if (route.auth) {
    const s = await requireAdmin(request, env);
    if (!s) return json({ error: "Unauthorized" }, 401);
  }
  try {
    return await route.handler(request, env, ctx);
  } catch (err) {
    console.error("api error:", url.pathname, err);
    return json({ error: "Server error", detail: String(err?.message || err) }, 500);
  }
}

/* ---------- main entry ---------- */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) return handleApi(request, env, ctx);

    if (url.pathname.startsWith("/img/")) {
      return serveImage(request, env, decodeURIComponent(url.pathname.slice(5)));
    }

    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);

    // Keep the admin site and the temporary test site out of Google.
    const host = hostOf(request);
    if (host.startsWith("admin.") || host.endsWith(".workers.dev")) {
      out.headers.set("X-Robots-Tag", "noindex, nofollow");
    }
    return out;
  },
};
