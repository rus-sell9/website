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

const tokenOpts = () => ({ token: process.env.BLOB_READ_WRITE_TOKEN });

function countPhotos(meta) {
  let n = 0;
  for (const s of SERVICES) n += (meta[s] || []).length;
  return n;
}

export async function loadMeta() {
  requireBlobToken();
  try {
    const { blobs } = await list({
      prefix: "photos-meta",
      limit: 30,
      ...tokenOpts(),
    });

    const exact = blobs.filter(
      (b) => b.pathname === META_PATH || b.pathname.endsWith("/" + META_PATH)
    );
    const candidates = exact.length
      ? exact
      : blobs.filter((b) => /photos-meta/i.test(b.pathname));

    if (!candidates.length) return emptyMeta();

    // Load ALL candidates and pick the one with the most photos (guards against wiped/empty overwrites)
    let best = emptyMeta();
    let bestCount = -1;

    for (const hit of candidates) {
      try {
        const res = await fetch(hit.url, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        const meta = emptyMeta();
        for (const s of SERVICES) {
          if (Array.isArray(data[s])) {
            meta[s] = data[s].filter((p) => p && (p.before || p.after));
          }
        }
        const c = countPhotos(meta);
        if (c > bestCount) {
          best = meta;
          bestCount = c;
        }
      } catch {
        /* try next */
      }
    }
    return best;
  } catch (err) {
    if (String(err?.message || "").includes("BLOB_READ_WRITE_TOKEN")) throw err;
    console.error("loadMeta error:", err);
    return emptyMeta();
  }
}

export async function saveMeta(meta) {
  requireBlobToken();
  for (const s of SERVICES) {
    if (!Array.isArray(meta[s])) meta[s] = [];
    meta[s] = meta[s].filter((p) => p && (p.before || p.after));
    meta[s].forEach((item, i) => {
      item.order = i;
    });
  }
  await put(META_PATH, JSON.stringify(meta, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    ...tokenOpts(),
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
    ...tokenOpts(),
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
    await del(url, tokenOpts());
  } catch {
    /* ignore missing */
  }
}
