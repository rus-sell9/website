import { useState } from "react";
import { Bi, T, tl, useLang } from "../i18n";

// One photo (or before/after pair). With both photos you get the drag slider;
// with only an "after" photo it shows the photo with an "After" tag.
export default function Pair({ before, after, caption, captionEs }) {
  const { t, lang } = useLang();
  const es = captionEs || tl("es", caption || "");
  const label = lang === "es" ? es : caption;
  const [pos, setPos] = useState(50);

  return (
    <figure className="ba">
      <div className="ba-frame">
        <img src={after} alt={`${label || ""} - ${t("After")}`} loading="lazy" decoding="async" />
        {before && (
          <>
            <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <img src={before} alt={`${label || ""} - ${t("Before")}`} loading="lazy" decoding="async" />
            </div>
            <span className="ba-line" style={{ left: `${pos}%` }} />
            <span className="ba-tag ba-tag-before"><T k="Before" /></span>
            <input
              type="range"
              min="0"
              max="100"
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label={`${t("Compare before and after:")} ${label || ""}`}
            />
          </>
        )}
        <span className="ba-tag ba-tag-after"><T k="After" /></span>
      </div>
      {caption && <figcaption><Bi en={caption} es={es} /></figcaption>}
    </figure>
  );
}
