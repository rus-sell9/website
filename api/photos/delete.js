import { requireAdmin, sendJson } from "../lib/auth.js";
import { loadMeta, saveMeta, deleteBlobByUrl, SERVICES } from "../lib/photos.js";

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return sendJson(res, { error: "Method not allowed" }, 405);
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) return sendJson(res, { error: auth.error }, auth.status);

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const service = String(body.service || "");
  const id = String(body.id || "");
  const side = String(body.side || "all").toLowerCase();

  if (!SERVICES.includes(service) || !id) {
    return sendJson(res, { error: "service and id required" }, 400);
  }

  try {
    const meta = await loadMeta();
    const list = meta[service] || [];
    const idx = list.findIndex((p) => p.id === id);
    if (idx === -1) return sendJson(res, { error: "Not found" }, 404);
    const item = list[idx];

    if (side === "before" || side === "all") {
      if (item.before) await deleteBlobByUrl(item.before);
      item.before = null;
    }
    if (side === "after" || side === "all") {
      if (item.after) await deleteBlobByUrl(item.after);
      item.after = null;
    }

    if (side === "all" || (!item.before && !item.after)) {
      list.splice(idx, 1);
    }

    meta[service] = list;
    await saveMeta(meta);
    return sendJson(res, { ok: true });
  } catch (err) {
    return sendJson(res, { error: "Delete failed", detail: String(err?.message || err) }, 500);
  }
}
