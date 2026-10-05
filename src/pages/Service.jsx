import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import Controls from "../components/Controls";
import Pair from "../components/Pair";
import { business, servicePages, work } from "../config";
import { T, useLang } from "../i18n";
import "../App.css";
import "./Area.css";
import "./Service.css";

export default function Service({ slug }) {
  const { t, lang } = useLang();
  const service = servicePages.find((s) => s.slug === slug);
  const fallback = work[slug] || [];
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${t(service.title)} | ${business.name}`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t(service.description));
  }, [service, lang, t]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/photos/list?service=${encodeURIComponent(slug)}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("api");
        const data = await res.json();
        const list = Array.isArray(data.items) ? data.items : [];
        // Only use API data when it has at least one photo; otherwise keep static fallback
        if (!cancelled) {
          setItems(list.length ? list : fallback);
        }
      } catch {
        if (!cancelled) setItems(fallback);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

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

      <main className="container service-main">
        <a className="service-back" href="/#services">← <T k="All services" /></a>
        <span className="section-label"><T k="OUR SERVICES" /></span>
        <h1><T k={service.title} /></h1>
        <p className="area-lead"><T k={service.description} /></p>

        <div className="area-actions">
          <a className="button button-primary" href="/#contact"><T k="Get a Free Quote" /> <Icon name="arrow" size={18} /></a>
          <a className="button button-outline" href={`tel:${business.phoneHref}`}><Icon name="phone" size={18} /> <T k="Call" /></a>
          <a className="button button-outline" href={`sms:${business.phoneHref}`}><Icon name="message" size={18} /> <T k="Text" /></a>
        </div>

        <h2><T k="Our work" /></h2>
        {items.length ? (
          <>
            <p className="service-hint"><T k="Drag the slider to see the difference." /></p>
            <div className="ba-grid">
              {items.map((p, i) => (
                <Pair key={p.id || p.after || i} {...p} />
              ))}
            </div>
          </>
        ) : (
          <p className="service-hint"><T k="New photos for this service are coming soon." /></p>
        )}

        <h2><T k="Other services" /></h2>
        <p className="area-others">
          {servicePages.filter((s) => s.slug !== slug).map((s) => (
            <Link key={s.slug} to={`/${s.slug}`}><T k={s.title} /></Link>
          ))}
        </p>
      </main>
    </div>
  );
}
