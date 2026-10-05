import { business, testimonials } from "../config";

export default function Testimonials() {
  if (!testimonials.length && !business.googleReviewUrl) return null;

  return (
    <section className="section reviews-section" id="reviews">
      <div className="container">
        <div className="center-heading">
          <span className="section-label">REVIEWS</span>
          <h2>What our customers say.</h2>
        </div>

        {testimonials.length > 0 && (
          <div className="reviews-grid">
            {testimonials.map((t) => (
              <figure className="review-card" key={t.name + t.text}>
                <blockquote>{t.text}</blockquote>
                <figcaption>
                  <strong>{t.name}</strong>
                  {t.area && <span>{t.area}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {business.googleReviewUrl && (
          <p className="reviews-cta">
            <a
              className="button button-outline"
              href={business.googleReviewUrl}
              target="_blank"
              rel="noreferrer"
            >
              Review us on Google
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
