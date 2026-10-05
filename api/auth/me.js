import { requireAdmin, sendJson } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, { error: "Method not allowed" }, 405);
  }
  const auth = await requireAdmin(req);
  if (!auth.ok) return sendJson(res, { authenticated: false }, 200);
  return sendJson(res, { authenticated: true, name: auth.session.name });
}
