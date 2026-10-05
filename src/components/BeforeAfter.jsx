import { useState } from "react";
import { beforeAfter } from "../config";

function Pair({ before, after, caption }) {
  const [pos, setPos] = useState(50);

  return (
    <figure className="ba">
      <div className="ba-frame">
        <img src={after} alt={`${caption} after cleaning`} loading="lazy" decoding="async" />
        <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img src={before} alt={`${caption} before cleaning`} loading="lazy" decoding="async" />
        </div>
        <span className="ba-line" style={{ left: `${pos}%` }} />
        <span className="ba-tag ba-tag-before">Before</span>
        <span className="ba-tag ba-tag-after">After</span>
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare before and after: ${caption}`}
        />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default function BeforeAfter() {
  if (!beforeAfter.length) return null;

  return (
    <section className="section ba-section" id="before-after">
      <div className="container">
        <div className="center-heading">
          <span className="section-label">BEFORE &amp; AFTER</span>
          <h2>Drag to see the difference.</h2>
        </div>
        <div className="ba-grid">
          {beforeAfter.map((p) => (
            <Pair key={p.caption} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
