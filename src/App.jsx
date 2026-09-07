import { useState } from "react";
import "./App.css";

const services = [
  {
    number: "01",
    title: "Residential Cleaning",
    description:
      "A dependable clean for kitchens, bathrooms, bedrooms, living spaces, and the details that make your home feel fresh.",
    icon: "home",
  },
  {
    number: "02",
    title: "Deep Cleaning",
    description:
      "A more detailed clean for homes that need extra attention, including hard-to-reach areas and built-up dirt.",
    icon: "sparkles",
  },
  {
    number: "03",
    title: "Move-In / Move-Out",
    description:
      "Get your space ready for the next chapter with a thorough clean before moving in or handing over the keys.",
    icon: "box",
  },
  {
    number: "04",
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

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    caption: "Kitchen Deep Clean",
  },
  {
    src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    caption: "Living Room Refresh",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    caption: "Bathroom Detail Clean",
  },
  {
    src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    caption: "Bedroom Tidy & Clean",
  },
  {
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    caption: "Move-Out Cleaning",
  },
  {
    src: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80",
    caption: "Office Cleaning",
  },
];

function Icon({ name, size = 24 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v11h14V9" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );

    case "sparkles":
      return (
        <svg {...common}>
          <path d="m12 3-1.2 4.1L7 8.3l3.8 1.2L12 14l1.2-4.5L17 8.3l-3.8-1.2L12 3Z" />
          <path d="m19 14-.7 2.3-2.3.7 2.3.7.7 2.3.7-2.3 2.3-.7-2.3-.7L19 14Z" />
          <path d="m5 14-.5 1.5L3 16l1.5.5L5 18l.5-1.5L7 16l-1.5-.5L5 14Z" />
        </svg>
      );

    case "box":
      return (
        <svg {...common}>
          <path d="m21 8-9 5-9-5 9-5 9 5Z" />
          <path d="M3 8v8l9 5 9-5V8" />
          <path d="M12 13v8" />
        </svg>
      );

    case "building":
      return (
        <svg {...common}>
          <path d="M4 21V5l8-3v19" />
          <path d="M12 9h8v12" />
          <path d="M7 7h2M7 11h2M7 15h2M15 13h2M15 17h2" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h13" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "phone":
      return (
        <svg {...common}>
          <path d="M5 4h3l2 5-2 1.5a14 14 0 0 0 5.5 5.5L15 14l5 2v3c0 1.1-.9 2-2 2C10.3 21 3 13.7 3 5c0-1.1.9-2 2-2Z" />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    default:
      return null;
  }
}

function App() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollTo = (id) => {
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
            aria-label="SL Cleaning Services home"
          >
            <span className="brand-mark">
              <Icon name="sparkles" size={21} />
            </span>

            <span className="brand-text">
              <strong>SL</strong>
              <span>Cleaning Services</span>
            </span>
          </button>

          <nav className="desktop-nav" aria-label="Main navigation">
            <button onClick={() => scrollTo("services")}>
              Services
            </button>

            <button onClick={() => scrollTo("about")}>
              About
            </button>

            <button onClick={() => scrollTo("process")}>
              How It Works
            </button>

            <button onClick={() => scrollTo("contact")}>
              Contact
            </button>
          </nav>

          <div className="nav-actions">
            <a className="nav-phone" href="tel:+10000000000">
              <Icon name="phone" size={17} />
              <span>Call Us</span>
            </a>

            <button
              className="button button-small"
              onClick={() => scrollTo("contact")}
            >
              Get a Quote
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main id="top">
        <section className="hero">
          <div className="hero-background" />

          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                Professional Cleaning Services
              </div>

              <h1>
                A cleaner space.
                <br />
                <span>More time for you.</span>
              </h1>

              <p className="hero-description">
                Reliable residential and commercial cleaning services designed
                to give your space the care and attention it deserves.
              </p>

              <div className="hero-buttons">
                <button
                  className="button button-primary"
                  onClick={() => scrollTo("contact")}
                >
                  Get a Free Quote
                  <Icon name="arrow" size={19} />
                </button>

                <a
                  className="button button-outline"
                  href="tel:+10000000000"
                >
                  <Icon name="phone" size={18} />
                  Call Us
                </a>
              </div>

              <div className="trust-row">
                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Professional service</span>
                </div>

                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Flexible scheduling</span>
                </div>

                <div className="trust-item">
                  <span className="trust-icon">✓</span>
                  <span>Free estimates</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-card">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85"
                  alt="Professional cleaner cleaning a home"
                />

                <div className="hero-floating-card">
                  <div className="floating-icon">
                    <Icon name="sparkles" size={20} />
                  </div>

                  <div>
                    <strong>Fresh. Clean. Ready.</strong>
                    <span>That's the SL standard.</span>
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
              <span className="trust-bar-number">01</span>
              <span>Professional Care</span>
            </div>

            <div>
              <span className="trust-bar-number">02</span>
              <span>Attention to Detail</span>
            </div>

            <div>
              <span className="trust-bar-number">03</span>
              <span>Easy Communication</span>
            </div>

            <div>
              <span className="trust-bar-number">04</span>
              <span>Customer Focused</span>
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
                  OUR SERVICES
                </span>

                <h2>
                  Cleaning that fits your needs.
                </h2>
              </div>

              <p>
                From routine home cleaning to detailed deep cleans, we provide
                dependable service for spaces that deserve to feel their best.
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

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <button
                    className="text-link"
                    onClick={() => scrollTo("contact")}
                  >
                    Get a quote
                    <Icon name="arrow" size={17} />
                  </button>
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
                src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1000&q=85"
                alt="Clean and bright home interior"
              />

              <div className="about-badge">
                <strong>SL</strong>
                <span>Cleaning Services</span>
              </div>
            </div>

            <div className="about-content">
              <span className="section-label">
                WHY SL CLEANING
              </span>

              <h2>
                We don't just clean.
                <br />
                <span>
                  We care about the result.
                </span>
              </h2>

              <p className="lead">
                A professional cleaning service should make your life easier.
                That's why our approach is centered around dependable service,
                clear communication, and attention to the details.
              </p>

              <div className="benefits">
                {benefits.map((benefit) => (
                  <div
                    className="benefit"
                    key={benefit.title}
                  >
                    <div className="benefit-icon">
                      <Icon
                        name={benefit.icon}
                        size={20}
                      />
                    </div>

                    <div>
                      <h3>{benefit.title}</h3>
                      <p>{benefit.description}</p>
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
                HOW IT WORKS
              </span>

              <h2>
                Simple from start to finish.
              </h2>

              <p>
                Getting professional cleaning shouldn't be complicated.
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
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>

                  {index !== steps.length - 1 && (
                    <div className="step-line" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY / OUR WORK */}
        <section
          className="section gallery-section"
          id="work"
        >
          <div className="container">
            <div className="center-heading">
              <span className="section-label">
                OUR WORK
              </span>

              <h2>
                See the difference for yourself.
              </h2>

              <p>
                A look at some of the homes and spaces we've recently
                cleaned.
              </p>
            </div>

            <div className="gallery-grid">
              {gallery.map((item) => (
                <div
                  className="gallery-item"
                  key={item.caption}
                >
                  <img
                    src={item.src}
                    alt={item.caption}
                  />

                  <div className="gallery-caption">
                    <span>{item.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="testimonial-section">
          <div className="container">
            <div className="testimonial-card">
              <div className="quote-mark">“</div>

              <div className="testimonial-content">
                <div className="stars">
                  ★★★★★
                </div>

                <blockquote>
                  Your real customer reviews should go here. Replace this
                  placeholder with an authentic Google or customer testimonial.
                </blockquote>

                <div className="testimonial-author">
                  <div className="author-avatar">
                    SL
                  </div>

                  <div>
                    <strong>Customer Name</strong>
                    <span>Verified Customer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE AREA */}
        <section className="service-area">
          <div className="container service-area-inner">
            <div>
              <span className="section-label light">
                SERVICE AREA
              </span>

              <h2>
                Proudly serving your local community.
              </h2>

              <p>
                We currently provide cleaning services throughout all of Los
                Angeles County and all of Orange County. Outside these areas?
                Reach out anyway — we're happy to see if we can make it work
                for your location.
              </p>
            </div>

            <div className="area-list">
              <span>All of LA County</span>
              <span>All of Orange County</span>
              <button onClick={() => scrollTo("contact")}>
                Outside these areas? Contact us
              </button>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          className="section contact-section"
          id="contact"
        >
          <div className="container contact-grid">

            <div className="contact-copy">
              <span className="section-label">
                GET STARTED
              </span>

              <h2>
                Ready for a cleaner space?
              </h2>

              <p>
                Tell us what you need and we'll get back to you with the next
                steps.
              </p>

              <div className="contact-details">

                <a href="tel:+10000000000">
                  <span className="contact-icon">
                    <Icon name="phone" size={20} />
                  </span>

                  <span>
                    <small>Call us</small>
                    <strong>
                      (000) 000-0000
                    </strong>
                  </span>
                </a>

                <a href="mailto:hello@slcleaningservices.online">
                  <span className="contact-icon">
                    <Icon name="mail" size={20} />
                  </span>

                  <span>
                    <small>Email us</small>
                    <strong>
                      hello@slcleaningservices.online
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
                <span>FREE QUOTE</span>

                <h3>
                  Tell us about your cleaning needs.
                </h3>
              </div>

              <div className="form-grid">

                <label>
                  <span>Your name</span>

                  <input
                    type="text"
                    name="name"
                    placeholder="John Smith"
                    autoComplete="name"
                    required
                  />
                </label>

                <label>
                  <span>Phone</span>

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
                  <span>Email</span>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label>
                  <span>Service</span>

                  <select
                    name="service"
                    defaultValue=""
                    required
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select a service
                    </option>

                    <option value="Residential Cleaning">
                      Residential Cleaning
                    </option>

                    <option value="Deep Cleaning">
                      Deep Cleaning
                    </option>

                    <option value="Move-In / Move-Out">
                      Move-In / Move-Out
                    </option>

                    <option value="Commercial Cleaning">
                      Commercial Cleaning
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </label>

                <label className="full">
                  <span>Tell us more</span>

                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Tell us about your space and what you need cleaned..."
                  />
                </label>

              </div>

              <button
                className="button button-primary form-button"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Request My Free Quote"}

                {!loading && (
                  <Icon
                    name="arrow"
                    size={18}
                  />
                )}
              </button>

              <p className="form-note">
                No obligation. We'll contact you to discuss your cleaning needs.
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
                  {status}
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
                Professional cleaning services focused on quality, reliability,
                and making your space feel its best.
              </p>

            </div>

            <div className="footer-column">
              <h4>Navigation</h4>

              <button
                onClick={() => scrollTo("services")}
              >
                Services
              </button>

              <button
                onClick={() => scrollTo("about")}
              >
                About
              </button>

              <button
                onClick={() => scrollTo("process")}
              >
                How It Works
              </button>

              <button
                onClick={() => scrollTo("contact")}
              >
                Contact
              </button>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>

              <a href="tel:+10000000000">
                (000) 000-0000
              </a>

              <a href="mailto:hello@slcleaningservices.online">
                hello@slcleaningservices.online
              </a>

              <span>Service Area</span>
            </div>

          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} SL Cleaning Services.
              All rights reserved.
            </span>

            <span>
              Professional cleaning. Personal care.
            </span>
          </div>

        </div>
      </footer>

      {/* MOBILE CTA */}
      <div className="mobile-bottom-bar">

        <a href="tel:+10000000000">
          <Icon name="phone" size={18} />
          Call
        </a>

        <button
          onClick={() => scrollTo("contact")}
        >
          Get Free Quote
          <Icon name="arrow" size={17} />
        </button>

      </div>
    </div>
  );
}

export default App;
