import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../Icon";
import { business, cities } from "../config";
import "../App.css";
import "./Area.css";

const SERVICES = [
  ["Residential cleaning", "Kitchens, bathrooms, bedrooms and living spaces."],
  ["Deep cleaning", "Extra attention for built-up dirt and hard-to-reach areas."],
  ["Move-in / move-out cleaning", "A thorough clean before you move in or hand over the keys."],
  ["Commercial cleaning", "Offices and other commercial spaces."],
];

export default function Area() {
  const { slug } = useParams();
  const city = cities.find((c) => c.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = city
      ? `House & Commercial Cleaning in ${city.name} | ${business.name}`
      : `Page not found | ${business.name}`;
    const meta = document.querySelector('meta[name="description"]');
    if (city && meta) {
      meta.setAttribute(
        "content",
        `${business.name} provides residential, deep, move-out and commercial cleaning in ${city.name}, ${city.county}. Get a free quote.`
      );
    }
  }, [city]);

  return (
    <div className="site area-page">
      <header className="area-header">
        <div className="container area-header-inner">
          <Link to="/" className="area-brand">{business.name}</Link>
          <a className="button button-small" href={`tel:${business.phoneHref}`}>Call {business.phone}</a>
        </div>
      </header>

      <main className="container area-main">
        {city ? (
          <>
            <h1>Cleaning services in {city.name}</h1>
            <p className="area-lead">
              {business.name} provides residential and commercial cleaning in {city.name} and throughout {city.county}.
              Tell us what you need and we'll get back to you with next steps.
            </p>

            <div className="area-actions">
              <a className="button button-primary" href="/#contact">Get a Free Quote <Icon name="arrow" size={18} /></a>
              <a className="button button-outline" href={`tel:${business.phoneHref}`}><Icon name="phone" size={18} /> Call</a>
              <a className="button button-outline" href={`sms:${business.phoneHref}`}><Icon name="message" size={18} /> Text</a>
            </div>

            <h2>What we clean in {city.name}</h2>
            <ul className="area-services">
              {SERVICES.map(([t, d]) => (
                <li key={t}><strong>{t}</strong><span>{d}</span></li>
              ))}
            </ul>

            <h2>Other areas we serve</h2>
            <p className="area-others">
              {cities.filter((c) => c.slug !== city.slug).map((c) => (
                <Link key={c.slug} to={`/cleaning/${c.slug}`}>{c.name}</Link>
              ))}
            </p>
          </>
        ) : (
          <>
            <h1>Page not found</h1>
            <p className="area-lead">We couldn't find that page.</p>
            <Link className="button button-primary" to="/">Back to home</Link>
          </>
        )}
      </main>
    </div>
  );
}
