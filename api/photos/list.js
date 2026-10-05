import { loadMeta, SERVICES } from "../lib/photos.js";
import { sendJson } from "../lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return sendJson(res, { error: "Method not allowed" }, 405);
  }

  const service = req.query?.service;

  try {
    const meta = await loadMeta();
    if (service) {
      if (!SERVICES.includes(service)) {
        return sendJson(res, { error: "Unknown service" }, 400);
      }
      const items = (meta[service] || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
      return sendJson(res, { service, items });
    }
    const out = {};
    for (const s of SERVICES) {
      out[s] = (meta[s] || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    return sendJson(res, { services: out });
  } catch (err) {
    return sendJson(res, { error: "Failed to load photos", detail: String(err?.message || err) }, 500);
  }
}
