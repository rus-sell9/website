import { requireAdmin, sendJson } from "../lib/auth.js";
import { loadMeta, saveMeta, SERVICES } from "../lib/photos.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, { error: "Method not allowed" }, 405);
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) return sendJson(res, { error: auth.error }, auth.status);

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const service = String(body.service || "");
  const order = body.order;

  if (!SERVICES.includes(service) || !Array.isArray(order)) {
    return sendJson(res, { error: "service and order[] required" }, 400);
  }

  try {
    const meta = await loadMeta();
    const list = meta[service] || [];
    const byId = Object.fromEntries(list.map((p) => [p.id, p]));
    const next = [];
    for (const id of order) {
      if (byId[id]) {
        next.push(byId[id]);
        delete byId[id];
      }
    }
    for (const leftover of Object.values(byId)) next.push(leftover);
    meta[service] = next;
    await saveMeta(meta);
    return sendJson(res, { ok: true, items: next });
  } catch (err) {
    return sendJson(res, { error: "Reorder failed", detail: String(err?.message || err) }, 500);
  }
}
