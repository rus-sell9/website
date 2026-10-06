import { requireAdmin, sendJson } from "../lib/auth.js";
import {
  loadMeta,
  saveMeta,
  newPhotoId,
  uploadImageBuffer,
  deleteBlobByUrl,
  SERVICES,
} from "../lib/photos.js";

export const maxDuration = 30;

async function readBody(req) {
  if (req.body != null) {
    if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body || "{}");
      } catch {
        return {};
      }
    }
    if (Buffer.isBuffer(req.body)) {
      try {
        return JSON.parse(req.body.toString("utf8") || "{}");
      } catch {
        return {};
      }
    }
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON body");
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, { error: "Method not allowed" }, 405);
  }

  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) return sendJson(res, { error: auth.error || "Unauthorized" }, auth.status || 401);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return sendJson(
        res,
        {
          error:
            "BLOB_READ_WRITE_TOKEN missing on this deployment. Connect Blob to the project and redeploy.",
        },
        500
      );
    }

    let body;
    try {
      body = await readBody(req);
    } catch (e) {
      return sendJson(res, { error: String(e.message || e) }, 400);
    }

    const service = String(body.service || "");
    const role = String(body.role || "").toLowerCase();
    const caption = String(body.caption || "").slice(0, 200);
    const captionEs = String(body.captionEs || "").slice(0, 200);
    const dataUrl = String(body.dataUrl || body.image || "");
    const pairWithId = body.pairWithId ? String(body.pairWithId) : null;

    if (!SERVICES.includes(service)) {
      return sendJson(res, { error: `Invalid service: ${service || "(empty)"}` }, 400);
    }
    if (role !== "before" && role !== "after") {
      return sendJson(res, { error: 'role must be "before" or "after"' }, 400);
    }
    if (!dataUrl) {
      return sendJson(
        res,
        {
          error:
            "Missing image data (empty body). Request may be too large for the server (max ~4.5MB). Try a smaller photo.",
        },
        400
      );
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
    if (buffer.length > 4 * 1024 * 1024) {
      return sendJson(
        res,
        { error: `Image too large (${Math.round(buffer.length / 1024)} KB). Max ~4 MB compressed.` },
        400
      );
    }

    const url = await uploadImageBuffer(buffer, `${service}-${role}.webp`);
    const meta = await loadMeta();
    const list = meta[service] || [];

    if (pairWithId) {
      const existing = list.find((p) => p.id === pairWithId);
      if (!existing) return sendJson(res, { error: "Pair target not found" }, 404);
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
      return sendJson(res, { ok: true, item: existing, items: meta[service] });
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
    return sendJson(res, { ok: true, item, items: meta[service] });
  } catch (err) {
    console.error("upload error:", err);
    return sendJson(
      res,
      {
        error: String(err?.message || err || "Upload failed"),
        detail: String(err?.stack || err?.message || err),
      },
      500
    );
  }
}
