import { requireAdmin, sendJson } from "../lib/auth.js";
import {
  loadMeta,
  saveMeta,
  newPhotoId,
  uploadImageBuffer,
  deleteBlobByUrl,
  SERVICES,
} from "../lib/photos.js";

export const config = { api: { bodyParser: { sizeLimit: "10mb" } }, maxDuration: 30 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, { error: "Method not allowed" }, 405);
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) return sendJson(res, { error: auth.error }, auth.status);

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  const service = String(body.service || "");
  const role = String(body.role || "").toLowerCase();
  const caption = String(body.caption || "").slice(0, 200);
  const captionEs = String(body.captionEs || "").slice(0, 200);
  const dataUrl = String(body.dataUrl || body.image || "");
  const pairWithId = body.pairWithId ? String(body.pairWithId) : null;

  if (!SERVICES.includes(service)) {
    return sendJson(res, { error: "Invalid service" }, 400);
  }
  if (role !== "before" && role !== "after") {
    return sendJson(res, { error: 'role must be "before" or "after"' }, 400);
  }
  if (!dataUrl) {
    return sendJson(res, { error: "Missing image data" }, 400);
  }

  const base64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
  let buffer;
  try {
    buffer = Buffer.from(base64, "base64");
  } catch {
    return sendJson(res, { error: "Invalid base64 image" }, 400);
  }
  if (buffer.length < 100) {
    return sendJson(res, { error: "Image too small" }, 400);
  }
  if (buffer.length > 8 * 1024 * 1024) {
    return sendJson(res, { error: "Image too large (max 8MB after compression)" }, 400);
  }

  try {
    const url = await uploadImageBuffer(buffer, `${service}-${role}.webp`);
    const meta = await loadMeta();
    const list = meta[service] || [];

    if (pairWithId) {
      const existing = list.find((p) => p.id === pairWithId);
      if (!existing) {
        return sendJson(res, { error: "Pair target not found" }, 404);
      }
      if (role === "before") {
        if (existing.before) await deleteBlobByUrl(existing.before);
        existing.before = url;
      } else {
        if (existing.after) await deleteBlobByUrl(existing.after);
        existing.after = url;
      }
      if (caption) existing.caption = caption;
      if (captionEs) existing.captionEs = captionEs;
      await saveMeta(meta);
      return sendJson(res, { ok: true, item: existing });
    }

    const item = {
      id: newPhotoId(),
      before: role === "before" ? url : null,
      after: role === "after" ? url : null,
      caption: caption || "",
      captionEs: captionEs || "",
      order: list.length,
    };
    list.push(item);
    meta[service] = list;
    await saveMeta(meta);
    return sendJson(res, { ok: true, item });
  } catch (err) {
    return sendJson(res, { error: "Upload failed", detail: String(err?.message || err) }, 500);
  }
}
