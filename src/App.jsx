import { useEffect, useState } from "react";
import { T, useLang } from "./i18n";
import Controls from "./components/Controls";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import Testimonials from "./components/Testimonials";
import Faq from "./components/Faq";
import { business, images, cities } from "./config";
import "./App.css";

const services = [
  {
    number: "01",
    slug: "residential",
    title: "Residential Cleaning",
    description:
      "A dependable clean for kitchens, bathrooms, bedrooms, living spaces, and the details that make your home feel fresh.",
    icon: "home",
  },
  {
    number: "02",
    slug: "deep-cleaning",
    title: "Deep Cleaning",
    description:
      "A more detailed clean for homes that need extra attention, including hard-to-reach areas and built-up dirt.",
    icon: "sparkles",
  },
  {
    number: "03",
    slug: "move-in-move-out",
    title: "Move-In / Move-Out",
    description:
      "Get your space ready for the next chapter with a thorough clean before moving in or handing over the keys.",
    icon: "box",
  },
  {
    number: "04",
    slug: "commercial",
    title: "Commercial Cleaning",
    description:
      "Professional cleaning support for offices and other commercial spaces that need a clean, presentable environment.",
    icon: "building",
  },
];

const benefits = [
  {
    title: "Reliable Service",
    description:
      "We believe showing up on time and communicating clearly should be part of every professional cleaning experience.",
    icon: "check",
  },
  {
    title: "Attention to Detail",
    description:
      "We focus on the areas that are easy to overlook so your space feels genuinely clean—not just quickly cleaned.",
    icon: "sparkles",
  },
  {
    title: "Flexible Cleaning",
    description:
      "Choose the type of cleaning that fits your home, schedule, and specific needs.",
    icon: "calendar",
  },
];

const steps = [
  {
    number: "01",
    title: "Request a Quote",
    description:
      "Tell us a little about your space and the cleaning service you need.",
  },
  {
    number: "02",
    title: "Choose Your Service",
    description:
      "We'll help you determine the right cleaning option for your needs.",
  },
  {
    number: "03",
    title: "We Clean",
    description:
      "Our team arrives ready to leave your space looking fresh and cared for.",
  },
];

function App() {
  const { t, lang } = useLang();

  useEffect(() => {
    document.title = t("SL Cleaning Services | Residential & Commercial Cleaning in LA & Orange County");
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        t("Professional residential and commercial cleaning services throughout all of LA County and Orange County. Reliable, detail-focused, and easy to book. Get a free quote today.")
      );
    }
  }, [lang, t]);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleQuoteSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setStatus("Sending...");

    const form = event.target;
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);

    object.access_key = import.meta.env.VITE_WEB3FORMS_KEY;
    object.subject = "New Quote Request - SL CLEANING SERVICES";
    object.from_name = "SL CLEANING SERVICES Website";

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(object),
        }
      );

      const data = await response.json();

      console.log("Web3Forms response:", data);

      if (response.ok && data.success) {
        setStatus(
          "Thank you! Your quote request has been sent successfully."
        );

        form.reset();
      } else {
        setStatus(
          data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Form error:", error);

      setStatus(
        "Unable to send your request. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="site">
      {/* NAVIGATION */}
      <header className="navbar">
        <div className="container navbar-inner">
          <button
            className="brand"
            onClick={() => scrollTo("top")}
            aria-label={t("SL Cleaning Services home")}
          >
            <span className="brand-mark">
              <Icon name="sparkles" size={21} />
            </span>

            <span className="brand-text">
              <strong>SL</strong>
              <span>Cleaning Services</span>
            </span>
          </button>

          <nav className="desktop-nav" aria-label={t("Main navigation")}>
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }}>
<T k="Services" />
</a>

            <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>
<T k="About" />
</a>

            <a href="#process" onClick={(e) => { e.preventDefault(); scrollTo("process"); }}>
<T k="How It Works" />
</a>

            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
<T k="Contact" />
</a>

            <Link to="/survey">
              <T k="Leave a Review" />
            </Link>
          </nav>

          <div className="nav-actions">
            <Controls />

            <a className="nav-phone" href={`tel:${business.phoneHref}`}>
              <Icon name="phone" size={17} />
              <span><T k="Call Us" /></span>
            </a>

            <button
              className="button button-small"
              onClick={() => scrollTo("contact")}
            >
              <T k="Get a Quote" />
            </button>

            <button
              className="mobile-menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? t("Close menu") : t("Open menu")}
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            className="mobile-menu"
            aria-label={t("Mobile navigation")}
          >
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }}>
<T k="Services" />
</a>

            <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>
<T k="About" />
</a>

            <a href="#process" onClick={(e) => { e.preventDefault(); scrollTo("process"); }}>
<T k="How It Works" />
</a>

            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
<T k="Contact" />
</a>

            <Link
              to="/survey"
              onClick={() => setMenuOpen(false)}
            >
              <T k="Leave a Review" />
            </Link>
          </nav>
        )}
      </header>

      {/* HERO */}
      <main id="top">
        <section className="hero">
          <div className="hero-background" />

          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                <T k="Professional Cleaning Services" />
              </div>

              <h1>
                <T k="A cleaner space." />
                <br />
                <span><T k="More time for you." /></span>
              </h1>

              <p className="hero-description">
                <T k="Reliable residential and commercial cleaning services designed to give your space the care and attention it deserves." />
              </p>

              <div className="hero-buttons">
                <button
                  className="button button-primary"
                  onClick={() => scrollTo("contact")}
                >
                  <T k="Get a Free Quote" />
                  <Icon name="arrow" size={19} />
                </button>

                <a
                  className="button button-outline"
                  href={`tel:${business.phoneHref}`}
                >
                  <Icon name="phone" size={18} />
                  <T k="Call Us" />
                </a>

                <a
                  className="button button-outline"
                  href={`sms:${business.phoneHref}`}
                >
                  <Icon name="message" size={18} />
                  <T k="Text Us" />
                </a>
              </div>

              <div className="trust-row">
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span><T k="Professional service" /></span>
                </div>

                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span><T k="Flexible scheduling" /></span>
                </div>

                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span><T k="Free estimates" /></span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-card">
                <img
                  src={images.hero}
                  alt={t("Living room and kitchen after a professional clean")}
                  fetchPriority="high"
                />

                <div className="hero-floating-card">
                  <div className="floating-icon">
                    <Icon name="sparkles" size={20} />
                  </div>

                  <div>
                    <strong><T k="Fresh. Clean. Ready." /></strong>
                    <span><T k="That's the SL standard." /></span>
                  </div>
                </div>
              </div>

              <div className="hero-accent" />
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="trust-bar">
          <div className="container trust-bar-inner">
            <div>
              <span className="trust-bar-number">✓</span>
              <span><T k="Professional Care" /></span>
            </div>

            <div>
              <span className="trust-bar-number">✓</span>
              <span><T k="Attention to Detail" /></span>
            </div>

            <div>
              <span className="trust-bar-number">✓</span>
              <span><T k="Easy Communication" /></span>
            </div>

            <div>
              <span className="trust-bar-number">✓</span>
              <span><T k="Customer Focused" /></span>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section
          className="section services-section"
          id="services"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">
                  <T k="OUR SERVICES" />
                </span>

                <h2>
                  <T k="Cleaning that fits your needs." />
                </h2>
              </div>

              <p>
                <T k="From routine home cleaning to detailed deep cleans, we provide dependable service for spaces that deserve to feel their best." />
              </p>
            </div>

            <div className="services-grid">
              {services.map((service) => (
                <article
                  className="service-card"
                  key={service.number}
                >
                  <div className="service-card-top">
                    <span className="service-number">
                      {service.number}
                    </span>

                    <span className="service-icon">
                      <Icon
                        name={service.icon}
                        size={25}
                      />
                    </span>
                  </div>

                  <h3><T k={service.title} /></h3>

                  <p><T k={service.description} /></p>

                  <div className="service-actions">
                    <Link
                      className="text-link"
                      to={`/${service.slug}`}
                    >
                      <T k="Look at our work" />
                      <Icon name="arrow" size={17} />
                    </Link>

                    <button
                      className="text-link text-link-quiet"
                      onClick={() => scrollTo("contact")}
                    >
                      <T k="Get a quote" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT / WHY US */}
        <section
          className="section about-section"
          id="about"
        >
          <div className="container about-grid">
            <div className="about-image">
              <img
                src={images.about}
                alt={t("Kitchen after a professional deep clean")}
                loading="lazy"
              />

              <div className="about-badge">
                <strong>SL</strong>
                <span>Cleaning Services</span>
              </div>
            </div>

            <div className="about-content">
              <span className="section-label">
                <T k="WHY SL CLEANING" />
              </span>

              <h2>
                <T k="We don't just clean." />
                <br />
                <span>
                  <T k="We care about the result." />
                </span>
              </h2>

              <p className="lead">
                <T k="A professional cleaning service should make your life easier. That's why our approach is centered around dependable service, clear communication, and attention to the details." />
              </p>

              <div className="benefits">
                {benefits.map((benefit) => (
                  <div
                    className="benefit"
                    key={t(benefit.title)}
                  >
                    <div className="benefit-icon">
                      <Icon
                        name={benefit.icon}
                        size={20}
                      />
                    </div>

                    <div>
                      <h3><T k={benefit.title} /></h3>
                      <p><T k={benefit.description} /></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section
          className="section process-section"
          id="process"
        >
          <div className="container">
            <div className="center-heading">
              <span className="section-label">
                <T k="HOW IT WORKS" />
              </span>

              <h2>
                <T k="Simple from start to finish." />
              </h2>

              <p>
                <T k="Getting professional cleaning shouldn't be complicated." />
              </p>
            </div>

            <div className="steps">
              {steps.map((step, index) => (
                <div
                  className="step"
                  key={step.number}
                >
                  <div className="step-number">
                    {step.number}
                  </div>

                  <div className="step-content">
                    <h3><T k={step.title} /></h3>
                    <p><T k={step.description} /></p>
                  </div>

                  {index !== steps.length - 1 && (
                    <div className="step-line" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />

        {/* SERVICE AREA */}
        <section className="service-area">
          <div className="container service-area-inner">
            <div>
              <span className="section-label light">
                <T k="SERVICE AREA" />
              </span>

              <h2>
                <T k="Proudly serving your local community." />
              </h2>

              <p>
                <T k="We currently provide cleaning services throughout all of Los Angeles County and all of Orange County. Outside these areas? Reach out anyway — we're happy to see if we can make it work for your location." />
              </p>

              <p className="area-cities">
                {cities.map((c) => (
                  <Link key={c.slug} to={`/cleaning/${c.slug}`}>
                    {c.name}
                  </Link>
                ))}
              </p>
            </div>

            <div className="area-list">
              <span><T k="All of LA County" /></span>
              <span><T k="All of Orange County" /></span>
              <button onClick={() => scrollTo("contact")}>
                <T k="Outside these areas? Contact us" />
              </button>
            </div>
          </div>
        </section>

        <Faq />

        {/* CONTACT */}
        <section
          className="section contact-section"
          id="contact"
        >
          <div className="container contact-grid">

            <div className="contact-copy">
              <span className="section-label">
                <T k="GET STARTED" />
              </span>

              <h2>
                <T k="Ready for a cleaner space?" />
              </h2>

              <p>
                <T k="Tell us what you need and we'll get back to you with the next steps." />
              </p>

              <div className="contact-details">

                <a href={`tel:${business.phoneHref}`}>
                  <span className="contact-icon">
                    <Icon name="phone" size={20} />
                  </span>

                  <span>
                    <small><T k="Call us" /></small>
                    <strong>
                      {business.phone}
                    </strong>
                  </span>
                </a>

                <a href={`sms:${business.phoneHref}`}>
                  <span className="contact-icon">
                    <Icon name="message" size={20} />
                  </span>

                  <span>
                    <small><T k="Text us" /></small>
                    <strong>
                      {business.phone}
                    </strong>
                  </span>
                </a>

                <a href={`mailto:${business.email}`}>
                  <span className="contact-icon">
                    <Icon name="mail" size={20} />
                  </span>

                  <span>
                    <small><T k="Email us" /></small>
                    <strong>
                      {business.email}
                    </strong>
                  </span>
                </a>

              </div>
            </div>

            {/* QUOTE FORM */}
            <form
              className="quote-form"
              onSubmit={handleQuoteSubmit}
            >

              <div className="form-header">
                <span><T k="FREE QUOTE" /></span>

                <h3>
                  <T k="Tell us about your cleaning needs." />
                </h3>
              </div>

              <div className="form-grid">

                <label>
                  <span><T k="Your name" /></span>

                  <input
                    type="text"
                    name="name"
                    placeholder={t("John Smith")}
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  <span><T k="Phone" /></span>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="(000) 000-0000"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                  />
                </label>

                <label>
                  <span><T k="Email" /></span>

                  <input
                    type="email"
                    name="email"
                    placeholder={t("you@example.com")}
                    autoComplete="email"
                    required
                  />
                </label>

                <label>
                  <span><T k="ZIP code" /></span>

                  <input
                    type="text"
                    name="zip"
                    placeholder="90802"
                    autoComplete="postal-code"
                    inputMode="numeric"
                    pattern="[0-9]{5}"
                    maxLength={5}
                    required
                  />
                </label>

                <label>
                  <span><T k="Service" /></span>

                  <select
                    name="service"
                    defaultValue=""
                    required
                  >
                    <option
                      value=""
                      disabled
                    >
                      {t("Select a service")}
                    </option>

                    <option value="Residential Cleaning">
                      {t("Residential Cleaning")}
                    </option>

                    <option value="Deep Cleaning">
                      {t("Deep Cleaning")}
                    </option>

                    <option value="Move-In / Move-Out">
                      {t("Move-In / Move-Out")}
                    </option>

                    <option value="Commercial Cleaning">
                      {t("Commercial Cleaning")}
                    </option>

                    <option value="Other">
                      {t("Other")}
                    </option>
                  </select>
                </label>

                <label>
                  <span><T k="How often?" /></span>

                  <select
                    name="frequency"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      {t("Select frequency")}
                    </option>
                    <option value="One time">{t("One time")}</option>
                    <option value="Weekly">{t("Weekly")}</option>
                    <option value="Every 2 weeks">{t("Every 2 weeks")}</option>
                    <option value="Monthly">{t("Monthly")}</option>
                    <option value="Not sure yet">{t("Not sure yet")}</option>
                  </select>
                </label>

                <label>
                  <span><T k="Bedrooms" /></span>

                  <select name="bedrooms" defaultValue="">
                    <option value="">{t("Not sure / not applicable")}</option>
                    <option value="Studio">{t("Studio")}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5+">{t("5 or more")}</option>
                  </select>
                </label>

                <label>
                  <span><T k="Bathrooms" /></span>

                  <select name="bathrooms" defaultValue="">
                    <option value="">{t("Not sure / not applicable")}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">{t("4 or more")}</option>
                  </select>
                </label>

                <label>
                  <span><T k="Preferred date" /></span>

                  <input
                    type="date"
                    name="preferred_date"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </label>

                <label className="full">
                  <span><T k="Best time of day" /></span>

                  <select name="preferred_time" defaultValue="Flexible">
                    <option value="Flexible">{t("Flexible")}</option>
                    <option value="Morning">{t("Morning")}</option>
                    <option value="Afternoon">{t("Afternoon")}</option>
                  </select>
                </label>

                <label className="full">
                  <span><T k="Tell us more" /></span>

                  <textarea
                    name="message"
                    rows="4"
                    placeholder={t("Tell us about your space and what you need cleaned...")}
                  />
                </label>

              </div>

              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                style={{ display: "none" }}
              />

              <button
                className="button button-primary form-button"
                type="submit"
                disabled={loading}
              >
                <T k={loading ? "Sending..." : "Request My Free Quote"} />

                {!loading && (
                  <Icon
                    name="arrow"
                    size={18}
                  />
                )}
              </button>

              <p className="form-note">
                <T k="No obligation. We'll contact you to discuss your cleaning needs." />
              </p>

              {status && (
                <div
                  className={`form-status ${
                    status === "Sending..."
                      ? "sending"
                      : status.includes("successfully")
                      ? "success"
                      : "error"
                  }`}
                  role="status"
                >
                  <T k={status} />
                </div>
              )}

            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">

          <div className="footer-main">

            <div className="footer-brand">

              <div className="brand footer-brand-logo">
                <span className="brand-mark">
                  <Icon name="sparkles" size={20} />
                </span>

                <span className="brand-text">
                  <strong>SL</strong>
                  <span>Cleaning Services</span>
                </span>
              </div>

              <p>
                <T k="Professional cleaning services focused on quality, reliability, and making your space feel its best." />
              </p>

            </div>

            <div className="footer-column">
              <h4><T k="Navigation" /></h4>

              <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo("services"); }}>
<T k="Services" />
</a>

              <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>
<T k="About" />
</a>

              <a href="#process" onClick={(e) => { e.preventDefault(); scrollTo("process"); }}>
<T k="How It Works" />
</a>

              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
<T k="Contact" />
</a>

              <Link to="/survey">
                <T k="Leave a Review" />
              </Link>
            </div>

            <div className="footer-column">
              <h4><T k="Contact" /></h4>

              <a href={`tel:${business.phoneHref}`}>
                {business.phone}
              </a>

              <a href={`mailto:${business.email}`}>
                {business.email}
              </a>

              <span><T k="Serving LA & Orange County" /></span>
            </div>

          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} SL Cleaning Services.{" "}
              <T k="All rights reserved." />
            </span>

            <span>
              <T k="Professional cleaning. Personal care." />
            </span>
          </div>

        </div>
      </footer>

      {/* MOBILE CTA */}
      <div className="mobile-bottom-bar">

        <a href={`tel:${business.phoneHref}`}>
          <Icon name="phone" size={18} />
          <T k="Call" />
        </a>

        <a href={`sms:${business.phoneHref}`}>
          <Icon name="message" size={18} />
          <T k="Text" />
        </a>

        <button
          onClick={() => scrollTo("contact")}
        >
          <T k="Get Free Quote" />
          <Icon name="arrow" size={17} />
        </button>

      </div>
    </div>
  );
}

export default App;
