import {
  verifyAccessCode,
  verifyTotp,
  createSessionToken,
  sessionCookieHeader,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  notifyTelegram,
  sendJson,
} from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, { error: "Method not allowed" }, 405);
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const name = String(body.name || "").trim().slice(0, 80);
  const accessCode = String(body.accessCode || "");
  const totp = String(body.totp || "").replace(/\s/g, "");

  const rate = await checkRateLimit(req);
  if (!rate.ok) {
    await notifyTelegram({ name, success: false, ip: rate.ip, detail: "Rate limited / locked out" });
    return sendJson(res, { error: rate.error }, rate.status);
  }

  const storedHash = process.env.ACCESS_CODE_HASH;
  if (!storedHash || !process.env.TOTP_SECRET || !process.env.SESSION_SECRET) {
    return sendJson(res, { error: "Server auth is not configured" }, 500);
  }

  const codeOk = verifyAccessCode(accessCode, storedHash);
  const totpOk = verifyTotp(totp);

  if (!name || !codeOk || !totpOk) {
    await recordFailedAttempt(rate);
    const detail = !name
      ? "Missing name"
      : !codeOk && !totpOk
        ? "Bad access code and TOTP"
        : !codeOk
          ? "Bad access code"
          : "Bad TOTP";
    await notifyTelegram({ name, success: false, ip: rate.ip, detail });
    return sendJson(res, { error: "Invalid credentials" }, 401);
  }

  await clearFailedAttempts(rate);
  const token = await createSessionToken(name);
  await notifyTelegram({ name, success: true, ip: rate.ip, detail: "Logged in" });

  let expiresAt = Date.now() + 30 * 60 * 1000;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    if (payload.exp) expiresAt = payload.exp * 1000;
  } catch { /* keep default */ }
  return sendJson(res, { ok: true, name, expiresAt }, 200, { "Set-Cookie": sessionCookieHeader(token) });
}
