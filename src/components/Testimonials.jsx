import { business, testimonials } from "../config";
import { T } from "../i18n";

export default function Testimonials() {
  if (!testimonials.length && !business.googleReviewUrl) return null;

  return (
    <section className="section reviews-section" id="reviews">
      <div className="container">
        <div className="center-heading">
          <span className="section-label"><T k="REVIEWS" /></span>
          <h2><T k="What our customers say." /></h2>
        </div>

        {testimonials.length > 0 && (
          <div className="reviews-grid">
            {testimonials.map((r) => (
              <figure className="review-card" key={r.name + r.text}>
                <blockquote>{r.text}</blockquote>
                <figcaption>
                  <strong>{r.name}</strong>
                  {r.area && <span>{r.area}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {business.googleReviewUrl && (
          <p className="reviews-cta">
            <a className="button button-outline" href={business.googleReviewUrl} target="_blank" rel="noreferrer">
              <T k="Review us on Google" />
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
