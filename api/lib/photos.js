import { put, del, list } from "@vercel/blob";

export const SERVICES = ["residential", "deep-cleaning", "move-in-move-out", "commercial"];
const META_PATH = "photos-meta.json";

const emptyMeta = () =>
  Object.fromEntries(SERVICES.map((s) => [s, []]));

export async function loadMeta() {
  try {
    const { blobs } = await list({ prefix: META_PATH, limit: 5 });
    const hit = blobs.find((b) => b.pathname === META_PATH || b.pathname.endsWith(META_PATH));
    if (hit?.url) {
      const res = await fetch(hit.url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        // Ensure all service keys exist
        const meta = emptyMeta();
        for (const s of SERVICES) {
          if (Array.isArray(data[s])) meta[s] = data[s];
        }
        return meta;
      }
    }
  } catch {
    /* fall through */
  }
  return emptyMeta();
}

export async function saveMeta(meta) {
  // Normalize order fields
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
  });
  return meta;
}

export function newPhotoId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function uploadImageBuffer(buffer, filename) {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
  const path = `work/${Date.now()}-${safe}`;
  const blob = await put(path, buffer, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function deleteBlobByUrl(url) {
  if (!url || typeof url !== "string") return;
  // Only delete our blob URLs
  if (!url.includes("blob.vercel-storage.com") && !url.includes("public.blob.vercel-storage.com")) {
    return;
  }
  try {
    await del(url);
  } catch {
    /* ignore missing */
  }
}
