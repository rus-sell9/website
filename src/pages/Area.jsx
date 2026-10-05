import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../Icon";
import Controls from "../components/Controls";
import { business, cities } from "../config";
import { T, tl, useLang } from "../i18n";
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
  const { t, lang } = useLang();
  const city = cities.find((c) => c.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = city
      ? t("House & Commercial Cleaning in {city} | {name}", { city: city.name, name: business.name })
      : t("Page not found | {name}", { name: business.name });
    const meta = document.querySelector('meta[name="description"]');
    if (city && meta) {
      meta.setAttribute(
        "content",
        t("{name} provides residential, deep, move-out and commercial cleaning in {city}, {county}. Get a free quote.", {
          name: business.name,
          city: city.name,
          county: t(city.county),
        })
      );
    }
  }, [city, lang, t]);

  return (
    <div className="site area-page">
      <header className="area-header">
        <div className="container area-header-inner">
          <Link to="/" className="area-brand">{business.name}</Link>
          <div className="area-header-actions">
            <Controls />
            <a className="button button-small" href={`tel:${business.phoneHref}`}>
              <T k="Call {phone}" vars={{ phone: business.phone }} />
            </a>
          </div>
        </div>
      </header>

      <main className="container area-main">
        {city ? (
          <>
            <h1><T k="Cleaning services in {city}" vars={{ city: city.name }} /></h1>
            <p className="area-lead">
              <T
                k="{name} provides residential and commercial cleaning in {city} and throughout {county}. Tell us what you need and we'll get back to you with next steps."
                vars={(l) => ({ name: business.name, city: city.name, county: tl(l, city.county) })}
              />
            </p>

            <div className="area-actions">
              <a className="button button-primary" href="/#contact"><T k="Get a Free Quote" /> <Icon name="arrow" size={18} /></a>
              <a className="button button-outline" href={`tel:${business.phoneHref}`}><Icon name="phone" size={18} /> <T k="Call" /></a>
              <a className="button button-outline" href={`sms:${business.phoneHref}`}><Icon name="message" size={18} /> <T k="Text" /></a>
            </div>

            <h2><T k="What we clean in {city}" vars={{ city: city.name }} /></h2>
            <ul className="area-services">
              {SERVICES.map(([title, desc]) => (
                <li key={title}><strong><T k={title} /></strong><span><T k={desc} /></span></li>
              ))}
            </ul>

            <h2><T k="Other areas we serve" /></h2>
            <p className="area-others">
              {cities.filter((c) => c.slug !== city.slug).map((c) => (
                <Link key={c.slug} to={`/cleaning/${c.slug}`}>{c.name}</Link>
              ))}
            </p>
          </>
        ) : (
          <>
            <h1><T k="Page not found" /></h1>
            <p className="area-lead"><T k="We couldn't find that page." /></p>
            <Link className="button button-primary" to="/"><T k="Back to home" /></Link>
          </>
        )}
      </main>
    </div>
  );
}
