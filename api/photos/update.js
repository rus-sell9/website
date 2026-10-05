import { requireAdmin, sendJson } from "../lib/auth.js";
import { loadMeta, saveMeta, deleteBlobByUrl, SERVICES } from "../lib/photos.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, { error: "Method not allowed" }, 405);
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) return sendJson(res, { error: auth.error }, auth.status);

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const service = String(body.service || "");
  const id = String(body.id || "");
  if (!SERVICES.includes(service) || !id) {
    return sendJson(res, { error: "service and id required" }, 400);
  }

  try {
    const meta = await loadMeta();
    const list = meta[service] || [];
    const item = list.find((p) => p.id === id);
    if (!item) return sendJson(res, { error: "Not found" }, 404);

    if (typeof body.caption === "string") item.caption = body.caption.slice(0, 200);
    if (typeof body.captionEs === "string") item.captionEs = body.captionEs.slice(0, 200);

    if (body.pairBeforeFromId) {
      const srcId = String(body.pairBeforeFromId);
      const src = list.find((p) => p.id === srcId);
      if (!src) return sendJson(res, { error: "Source item not found" }, 404);

      if (src.before) {
        if (item.before) await deleteBlobByUrl(item.before);
        item.before = src.before;
        src.before = null;
      } else if (src.after && !item.before) {
        item.before = src.after;
        src.after = null;
      }

      meta[service] = list.filter((p) => p.before || p.after);
    }

    await saveMeta(meta);
    return sendJson(res, { ok: true, item, items: meta[service] });
  } catch (err) {
    return sendJson(res, { error: "Update failed", detail: String(err?.message || err) }, 500);
  }
}
