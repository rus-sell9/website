import { put, del, list } from "@vercel/blob";

export const SERVICES = ["residential", "deep-cleaning", "move-in-move-out", "commercial"];
const META_PATH = "photos-meta.json";

const emptyMeta = () =>
  Object.fromEntries(SERVICES.map((s) => [s, []]));

function requireBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is missing. In Vercel: Storage → create/connect a Blob store to this project, then redeploy."
    );
  }
}

export async function loadMeta() {
  try {
    requireBlobToken();
    const { blobs } = await list({ prefix: META_PATH, limit: 5 });
    const hit = blobs.find((b) => b.pathname === META_PATH || b.pathname.endsWith(META_PATH));
    if (hit?.url) {
      const res = await fetch(hit.url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const meta = emptyMeta();
        for (const s of SERVICES) {
          if (Array.isArray(data[s])) meta[s] = data[s];
        }
        return meta;
      }
    }
  } catch (err) {
    if (String(err?.message || "").includes("BLOB_READ_WRITE_TOKEN")) throw err;
  }
  return emptyMeta();
}

export async function saveMeta(meta) {
  requireBlobToken();
  for (const s of SERVICES) {
    if (!Array.isArray(meta[s])) meta[s] = [];
    meta[s].forEach((item, i) => {
      item.order = i;
    });
  }
  await put(META_PATH, JSON.stringify(meta, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return meta;
}

export function newPhotoId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function uploadImageBuffer(buffer, filename) {
  requireBlobToken();
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
  const path = `work/${Date.now()}-${safe}`;
  const blob = await put(path, buffer, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return blob.url;
}

export async function deleteBlobByUrl(url) {
  if (!url || typeof url !== "string") return;
  if (!url.includes("blob.vercel-storage.com") && !url.includes("public.blob.vercel-storage.com")) {
    return;
  }
  try {
    requireBlobToken();
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch {
    /* ignore missing */
  }
}
