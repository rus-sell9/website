import { useEffect } from "react";
import { Link } from "react-router-dom";
import Controls from "../components/Controls";
import { business } from "../config";
import { T, useLang } from "../i18n";
import "../App.css";
import "./Area.css";

export default function NotFound() {
  const { lang } = useLang();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `404 | ${business.name}`;
  }, [lang]);

  return (
    <div className="site area-page not-found-page">
      <header className="area-header">
        <div className="container area-header-inner">
          <Link to="/" className="area-brand">
            {business.name}
          </Link>
          <div className="area-header-actions">
            <Controls />
            <a className="button button-small" href={`tel:${business.phoneHref}`}>
              <T k="Call {phone}" vars={{ phone: business.phone }} />
            </a>
          </div>
        </div>
      </header>

      <main className="container service-main not-found-main">
        <p className="section-label">404</p>
        <h1>
          <T k="Page not found" />
        </h1>
        <p className="area-lead">
          <T k="That link doesn’t exist. Head back home or get a free quote." />
        </p>
        <div className="area-actions">
          <Link className="button button-primary" to="/">
            <T k="Back to home" />
          </Link>
          <a className="button button-outline" href="/#contact">
            <T k="Get a Free Quote" />
          </a>
        </div>
      </main>
    </div>
  );
}
