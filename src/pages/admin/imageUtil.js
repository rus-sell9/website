/**
 * Resize + compress an image file to WebP (or JPEG fallback).
 * Keeps payload under Vercel serverless ~4.5MB limit (base64 is larger than binary).
 */
export function fileToWebpDataUrl(file, { maxEdge = 1400, quality = 0.72 } = {}) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const scale = Math.min(1, maxEdge / Math.max(width, height));
      width = Math.max(1, Math.round(width * scale));
      height = Math.max(1, Math.round(height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const tryEncode = (q) => {
        let dataUrl;
        try {
          dataUrl = canvas.toDataURL("image/webp", q);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", q);
          }
        } catch {
          dataUrl = canvas.toDataURL("image/jpeg", q);
        }
        return dataUrl;
      };

      let dataUrl = tryEncode(quality);
      let q = quality;
      let guard = 0;
      while (dataUrl.length > 3.2 * 1024 * 1024 && guard < 6) {
        q = Math.max(0.4, q - 0.1);
        if (guard >= 3) {
          width = Math.round(width * 0.85);
          height = Math.round(height * 0.85);
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
        }
        dataUrl = tryEncode(q);
        guard++;
      }
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image"));
    };
    img.src = url;
  });
}
