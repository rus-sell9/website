import { faqs } from "../config";
import { Bi, T } from "../i18n";

export default function Faq() {
  if (!faqs.length) return null;

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="center-heading">
          <span className="section-label"><T k="QUESTIONS" /></span>
          <h2><T k="Frequently asked questions." /></h2>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary><Bi en={f.q} es={f.es ? f.es.q : f.q} /></summary>
              <p><Bi en={f.a} es={f.es ? f.es.a : f.a} /></p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
