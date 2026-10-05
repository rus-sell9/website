import { faqs } from "../config";

export default function Faq() {
  if (!faqs.length) return null;

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="center-heading">
          <span className="section-label">QUESTIONS</span>
          <h2>Frequently asked questions.</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
