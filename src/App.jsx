import { useState } from "react";
import "./App.css";

const services = [
  {
    number: "01",
    title: "Residential Cleaning",
    description:
      "Keep your home fresh, comfortable, and spotless with dependable residential cleaning tailored to your needs.",
    icon: "home",
  },
  {
    number: "02",
    title: "Building Cleaning",
    description:
      "Professional cleaning for buildings and commercial spaces that deserve a clean, welcoming environment.",
    icon: "building",
  },
  {
    number: "03",
    title: "Weekly Cleaning",
    description:
      "Enjoy a consistently clean space with convenient weekly cleaning service you can depend on.",
    icon: "calendar",
  },
  {
    number: "04",
    title: "Bi-Weekly Cleaning",
    description:
      "A practical cleaning schedule that keeps your home looking fresh without the commitment of weekly service.",
    icon: "sparkles",
  },
];

const benefits = [
  {
    title: "Reliable Service",
    description:
      "We value your time and strive to provide dependable, professional service every visit.",
    icon: "check",
  },
  {
    title: "Attention to Detail",
    description:
      "We take care of the details that make the difference between clean and truly spotless.",
    icon: "sparkles",
  },
  {
    title: "Flexible Scheduling",
    description:
      "Choose a cleaning schedule that works for your home, business, and lifestyle.",
    icon: "calendar",
  },
];

const steps = [
  {
    number: "01",
    title: "Request a Quote",
    description:
      "Tell us what you need cleaned and a little about your space.",
  },
  {
    number: "02",
    title: "Choose Your Service",
    description:
      "We'll help you find the cleaning option and schedule that fits you.",
  },
  {
    number: "03",
    title: "We Clean",
    description:
      "Sit back and relax while we take care of your space.",
  },
];

function Icon({ name, size = 24 }) {
  const props = {
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
        <svg {...props}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v11h14V9" />
          <path d="M9 20v-6h6v6" />
          <path d="M10 11h4M12 9v4" />
        </svg>
      );

    case "building":
      return (
        <svg {...props}>
          <path d="M4 21V5l8-3v19" />
          <path d="M12 9h8v12" />
          <path d="M7 7h2M7 11h2M7 15h2M15 13h2M15 17h2" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
        </svg>
      );

    case "sparkles":
      return (
        <svg {...props}>
          <path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5L12 3Z" />
          <path d="m19 16-.7 2.3L16 19l2.3.7L19 22l.7-2.3L22 19l-2.3-.7L19 16Z" />
          <path d="m5 3-.5 1.5L3 5l1.5.5L5 7l.5-1.5L7 5l-1.5-.5L5 3Z" />
        </svg>
      );

    case "check":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...props}>
          <path d="M5 12h13" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "phone":
      return (
        <svg {...props}>
          <path d="M5 4h3l2 5-2 1.5a14 14 0 0 0 5.5 5.5L15 14l5 2v3c0 1.1-.9 2-2 2C10.3 21 3 13.7 3 5c0-1.1.9-2 2-2Z" />
        </svg>
      );

    case "mail":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "globe":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z" />
        </svg>
      );

    default:
      return null;
  }
}

function App() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setMobileMenu(false);
  };

  return (
    <div className="site">
      {/* NAVIGATION */}
      <header className="navbar">
        <div className="container navbar-inner">
          <button className="brand" onClick={() => scrollTo("top")}>
            <span className="brand-logo">
              <span className="brand-house">⌂</span>
              <span className="brand-sparkle">✦</span>
            </span>

            <span className="brand-name">
              <strong>SL CLEANING</strong>
              <span>SERVICES</span>
            </span>
          </button>

          <nav className="desktop-nav">
            <button onClick={() => scrollTo("services")}>Services</button>
            <button onClick={() => scrollTo("about")}>About</button>
            <button onClick={() => scrollTo("process")}>How It Works</button>
            <button onClick={() => scrollTo("contact")}>Contact</button>
          </nav>

          <div className="nav-actions">
            <a href="tel:5625072586" className="nav-phone">
              <Icon name="phone" size={16} />
              562-507-2586
            </a>

            <button
              className="button button-blue button-small"
              onClick={() => scrollTo("contact")}
            >
              Get a Quote
            </button>

            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Open menu"
            >
              {mobileMenu ? "×" : "☰"}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="mobile-menu">
            <button onClick={() => scrollTo("services")}>Services</button>
            <button onClick={() => scrollTo("about")}>About</button>
            <button onClick={() => scrollTo("process")}>How It Works</button>
            <button onClick={() => scrollTo("contact")}>Contact</button>
            <a href="tel:5625072586">Call 562-507-2586</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <main id="top">
        <section className="hero">
          <div className="hero-swoosh hero-swoosh-pink" />
          <div className="hero-swoosh hero-swoosh-blue" />

          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <span>✦</span>
                Professional Cleaning Services
                <span>✦</span>
              </div>

              <h1>
                A Clean Space.
                <br />
                <span>A Better Place.</span>
              </h1>

              <p className="hero-tagline">We clean. You relax.</p>

              <p className="hero-description">
                Professional residential and building cleaning services
                designed to leave your space fresh, comfortable, and spotless.
              </p>

              <div className="hero-buttons">
                <button
                  className="button button-blue"
                  onClick={() => scrollTo("contact")}
                >
                  Get a Free Quote
                  <Icon name="arrow" size={18} />
                </button>

                <a href="tel:5625072586" className="button button-white">
                  <Icon name="phone" size={18} />
                  Call Us
                </a>
              </div>

              <div className="hero-trust">
                <div>
                  <span>✓</span>
                  Professional
                </div>

                <div>
                  <span>✓</span>
                  Reliable
                </div>

                <div>
                  <span>✓</span>
                  Detail Focused
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-photo">
                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85"
                  alt="Professional cleaning service"
                />

                <div className="photo-card">
                  <div className="photo-card-icon">✦</div>
                  <div>
                    <strong>Spotless Results</strong>
                    <span>Every time.</span>
                  </div>
                </div>
              </div>

              <div className="hero-circle">
                <span>SL</span>
                <small>CLEANING</small>
              </div>
            </div>
          </div>
        </section>

        {/* BRAND STRIP */}
        <section className="brand-strip">
          <div className="container brand-strip-inner">
            <div>
              <span className="strip-icon blue">⌂</span>
              <span>Residential Cleaning</span>
            </div>

            <div>
              <span className="strip-icon pink">▦</span>
              <span>Building Cleaning</span>
            </div>

            <div>
              <span className="strip-icon blue">◷</span>
              <span>Weekly Cleaning</span>
            </div>

            <div>
              <span className="strip-icon pink">✓</span>
              <span>Bi-Weekly Cleaning</span>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="section services-section" id="services">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-label">OUR SERVICES</span>
                <h2>Cleaning made simple.</h2>
              </div>

              <p>
                Whether you need regular home cleaning or professional building
                cleaning, SL Cleaning Services is here to help.
              </p>
            </div>

            <div className="services-grid">
              {services.map((service, index) => (
                <article
                  className={`service-card ${
                    index % 2 === 1 ? "pink-card" : ""
                  }`}
                  key={service.number}
                >
                  <div className="service-top">
                    <span className="service-number">{service.number}</span>

                    <span className="service-icon">
                      <Icon name={service.icon} size={27} />
                    </span>
                  </div>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <button
                    className="text-link"
                    onClick={() => scrollTo("contact")}
                  >
                    Get a quote
                    <Icon name="arrow" size={16} />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section about-section" id="about">
          <div className="container about-grid">
            <div className="about-visual">
              <img
                src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1000&q=85"
                alt="Bright and clean home interior"
              />

              <div className="about-swoosh">
                <span />
                <span />
              </div>

              <div className="about-logo">
                <strong>SL</strong>
                <span>CLEANING</span>
              </div>
            </div>

            <div className="about-content">
              <span className="section-label">WHY SL CLEANING</span>

              <h2>
                We clean.
                <br />
                <span>You relax.</span>
              </h2>

              <p className="about-lead">
                Your home or business deserves more than a quick clean. We
                focus on quality, reliability, and the small details that make
                a big difference.
              </p>

              <div className="benefits">
                {benefits.map((benefit) => (
                  <div className="benefit" key={benefit.title}>
                    <div className="benefit-icon">
                      <Icon name={benefit.icon} size={19} />
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
        <section className="section process-section" id="process">
          <div className="container">
            <div className="center-heading">
              <span className="section-label">HOW IT WORKS</span>
              <h2>A cleaner space in three simple steps.</h2>
              <p>Getting started is easy.</p>
            </div>

            <div className="steps">
              {steps.map((step, index) => (
                <div className="step" key={step.number}>
                  <div className="step-number">{step.number}</div>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>

                  {index < steps.length - 1 && <div className="step-line" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="testimonial-section">
          <div className="pink-dots" />

          <div className="container">
            <div className="testimonial-card">
              <div className="testimonial-decoration">✦</div>

              <div className="stars">★★★★★</div>

              <blockquote>
                “Add a real customer review here to show future customers why
                they can trust SL Cleaning Services.”
              </blockquote>

              <div className="testimonial-name">
                <span className="avatar">SL</span>
                <span>
                  <strong>Customer Review</strong>
                  <small>SL Cleaning Services</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE AREA */}
        <section className="service-area">
          <div className="container service-area-inner">
            <div>
              <span className="section-label white-label">
                SERVICE AREA
              </span>

              <h2>Let us help keep your space spotless.</h2>

              <p>
                Contact us today to find out if SL Cleaning Services serves
                your area.
              </p>

              <button
                className="button button-pink"
                onClick={() => scrollTo("contact")}
              >
                Get Your Free Quote
                <Icon name="arrow" size={18} />
              </button>
            </div>

            <div className="service-area-decoration">
              <div className="big-sparkle">✦</div>
              <div className="small-sparkle">✦</div>
              <strong>SL</strong>
              <span>CLEANING SERVICES</span>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy">
              <span className="section-label">GET STARTED</span>

              <h2>Ready for a cleaner space?</h2>

              <p>
                Request your free quote today. Tell us what you need and we'll
                help you find the right cleaning service.
              </p>

              <div className="contact-details">
                <a href="tel:5625072586">
                  <span className="contact-icon blue-icon">
                    <Icon name="phone" size={20} />
                  </span>

                  <span>
                    <small>Call us</small>
                    <strong>562-507-2586</strong>
                  </span>
                </a>

                <a href="mailto:lscleaningservices1845@gmail.com">
                  <span className="contact-icon pink-icon">
                    <Icon name="mail" size={20} />
                  </span>

                  <span>
                    <small>Email us</small>
                    <strong>lscleaningservices1845@gmail.com</strong>
                  </span>
                </a>

                <a
                  href="https://slcleaningservices.online"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-icon blue-icon">
                    <Icon name="globe" size={20} />
                  </span>

                  <span>
                    <small>Visit us online</small>
                    <strong>slcleaningservices.online</strong>
                  </span>
                </a>
              </div>
            </div>

            <form
              className="quote-form"
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  "Thank you! Your quote request has been received."
                );
              }}
            >
              <div className="form-accent" />

              <span className="form-label">FREE QUOTE</span>

              <h3>Tell us about your cleaning needs.</h3>

              <div className="form-grid">
                <label>
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </label>

                <label>
                  <span>Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="562-507-2586"
                    required
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label>
                  <span>Service</span>
                  <select name="service" defaultValue="" required>
                    <option value="" disabled>
                      Choose a service
                    </option>
                    <option>Residential Cleaning</option>
                    <option>Building Cleaning</option>
                    <option>Weekly Cleaning</option>
                    <option>Bi-Weekly Cleaning</option>
                  </select>
                </label>

                <label className="full">
                  <span>Message</span>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Tell us about your cleaning needs..."
                  />
                </label>
              </div>

              <button
                type="submit"
                className="button button-blue form-button"
              >
                Request My Free Quote
                <Icon name="arrow" size={18} />
              </button>

              <p className="form-note">
                No obligation. We'll contact you to discuss your needs.
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-wave">
          <span className="pink-wave" />
          <span className="blue-wave" />
        </div>

        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-mark">
                  ✦
                </div>

                <div>
                  <strong>SL CLEANING</strong>
                  <span>SERVICES</span>
                </div>
              </div>

              <p>
                A clean space, a better place. Professional cleaning services
                you can count on.
              </p>

              <div className="footer-slogan">
                We clean. You relax. ♡
              </div>
            </div>

            <div className="footer-column">
              <h4>Services</h4>
              <button onClick={() => scrollTo("services")}>
                Residential Cleaning
              </button>
              <button onClick={() => scrollTo("services")}>
                Building Cleaning
              </button>
              <button onClick={() => scrollTo("services")}>
                Weekly Cleaning
              </button>
              <button onClick={() => scrollTo("services")}>
                Bi-Weekly Cleaning
              </button>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>

              <a href="tel:5625072586">
                562-507-2586
              </a>

              <a href="mailto:lscleaningservices1845@gmail.com">
                lscleaningservices1845@gmail.com
              </a>

              <a
                href="https://slcleaningservices.online"
                target="_blank"
                rel="noreferrer"
              >
                slcleaningservices.online
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} SL Cleaning Services. All rights
              reserved.
            </span>

            <span>
              A Clean Space, A Better Place.
            </span>
          </div>
        </div>
      </footer>

      {/* MOBILE CTA */}
      <div className="mobile-bottom-bar">
        <a href="tel:5625072586">
          <Icon name="phone" size={17} />
          Call
        </a>

        <button onClick={() => scrollTo("contact")}>
          Get Free Quote
          <Icon name="arrow" size={17} />
        </button>
      </div>
    </div>
  );
}

export default App;
