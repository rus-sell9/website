import { useState } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQuoteSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setStatus("Sending...");
    setStatusType("sending");

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

      if (response.ok && data.success) {
        setStatus(
          "Thank you! Your quote request has been sent successfully."
        );
        setStatusType("success");
        form.reset();
      } else {
        setStatus(
          data.message || "Something went wrong. Please try again."
        );
        setStatusType("error");
      }
    } catch (error) {
      console.error("Form error:", error);

      setStatus(
        "Unable to send your request. Please try again."
      );
      setStatusType("error");
    }

    setLoading(false);
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* NAVIGATION */}
      <header className="site-header">
        <div className="container nav-container">
          <a href="#" className="logo">
            <span className="logo-sl">SL</span>
            <span className="logo-text">
              CLEANING
              <small>SERVICES</small>
            </span>
          </a>

          <nav className="desktop-nav">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#contact">Contact</a>
          </nav>

          <button
            className="button button-blue nav-quote"
            onClick={scrollToContact}
          >
            Get a Quote
          </button>
        </div>
      </header>

      {/* HERO */}
      <main>

        <section className="hero-section" id="home">
          <div className="container hero-grid">

            <div className="hero-copy">
              <span className="section-label">
                PROFESSIONAL CLEANING SERVICES
              </span>

              <h1>
                A cleaner space.
                <span> A better feeling.</span>
              </h1>

              <p>
                Reliable, professional cleaning services for
                homes, apartments, offices, and buildings.
                We make your space shine so you can focus
                on what matters.
              </p>

              <div className="hero-buttons">
                <button
                  className="button button-blue"
                  onClick={scrollToContact}
                >
                  Request a Free Quote
                  <span>→</span>
                </button>

                <a
                  href="tel:5625072586"
                  className="button button-outline"
                >
                  Call 562-507-2586
                </a>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-accent"></div>

              <span>QUALITY YOU CAN TRUST</span>

              <h2>
                We don't just clean.
                <br />
                <strong>We care.</strong>
              </h2>

              <p>
                Professional service with attention
                to every detail.
              </p>
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
              <span className="section-label">
                OUR SERVICES
              </span>

              <h2>
                Cleaning made simple.
              </h2>

              <p>
                Professional cleaning solutions designed
                around your needs.
              </p>
            </div>

            <div className="services-grid">

              <article className="service-card">
                <div className="service-icon blue-icon">
                  ✦
                </div>

                <h3>Residential Cleaning</h3>

                <p>
                  Keep your home fresh, clean, and
                  comfortable with dependable residential
                  cleaning.
                </p>
              </article>

              <article className="service-card">
                <div className="service-icon pink-icon">
                  ✦
                </div>

                <h3>Building Cleaning</h3>

                <p>
                  Professional cleaning for offices,
                  buildings, and commercial spaces.
                </p>
              </article>

              <article className="service-card">
                <div className="service-icon blue-icon">
                  ✦
                </div>

                <h3>Unit Cleaning</h3>

                <p>
                  Detailed cleaning for apartments,
                  rental units, and move-in or move-out
                  needs.
                </p>
              </article>

              <article className="service-card">
                <div className="service-icon pink-icon">
                  ✦
                </div>

                <h3>Recurring Cleaning</h3>

                <p>
                  Weekly or bi-weekly service to keep
                  your space consistently clean.
                </p>
              </article>

            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          className="section about-section"
          id="about"
        >
          <div className="container about-grid">

            <div className="about-card">
              <span className="about-number">SL</span>

              <div>
                <strong>Professional</strong>
                <small>Reliable & Detail-Oriented</small>
              </div>
            </div>

            <div className="about-copy">
              <span className="section-label">
                WHY SL CLEANING SERVICES
              </span>

              <h2>
                Your space deserves
                <span> the best.</span>
              </h2>

              <p>
                At SL Cleaning Services, we believe a
                clean environment makes a real difference.
                That's why we focus on reliable service,
                attention to detail, and treating every
                space with care.
              </p>

              <div className="about-points">

                <div>
                  <strong>01</strong>
                  <span>Reliable service</span>
                </div>

                <div>
                  <strong>02</strong>
                  <span>Attention to detail</span>
                </div>

                <div>
                  <strong>03</strong>
                  <span>Customer focused</span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          className="section process-section"
          id="how-it-works"
        >
          <div className="container">

            <div className="section-heading">
              <span className="section-label">
                HOW IT WORKS
              </span>

              <h2>
                Simple from start to finish.
              </h2>

              <p>
                Getting your space professionally cleaned
                couldn't be easier.
              </p>
            </div>

            <div className="steps">

              <div className="step">
                <div className="step-number">
                  01
                </div>

                <div>
                  <h3>Request a Quote</h3>
                  <p>
                    Tell us what you need using our quick
                    quote form.
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">
                  02
                </div>

                <div>
                  <h3>Choose Your Service</h3>
                  <p>
                    We'll help you choose the cleaning
                    service that fits your needs.
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">
                  03
                </div>

                <div>
                  <h3>We Clean</h3>
                  <p>
                    Sit back and relax while we take
                    care of the cleaning.
                  </p>
                </div>
              </div>

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
                Request your free quote today. Tell us
                what you need and we'll help you find
                the right cleaning service.
              </p>

              <div className="contact-details">

                <a href="tel:5625072586">
                  <span className="contact-icon blue-icon">
                    ☎
                  </span>

                  <span>
                    <small>Call us</small>
                    <strong>562-507-2586</strong>
                  </span>
                </a>

                <a
                  href="mailto:lscleaningservices1845@gmail.com"
                >
                  <span className="contact-icon pink-icon">
                    ✉
                  </span>

                  <span>
                    <small>Email us</small>
                    <strong>
                      lscleaningservices1845@gmail.com
                    </strong>
                  </span>
                </a>

                <a
                  href="https://slcleaningservices.online"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-icon blue-icon">
                    ◉
                  </span>

                  <span>
                    <small>Visit us online</small>
                    <strong>
                      slcleaningservices.online
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

              <div className="form-accent"></div>

              <span className="form-label">
                FREE QUOTE
              </span>

              <h3>
                Tell us about your cleaning needs.
              </h3>

              <div className="form-grid">

                <label>
                  <span>Name</span>

                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
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

                <label className="full">
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
                  <span>Service Needed</span>

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

                    <option value="Building Cleaning">
                      Building Cleaning
                    </option>

                    <option value="Unit Cleaning">
                      Unit Cleaning
                    </option>

                    <option value="Weekly Cleaning">
                      Weekly Cleaning
                    </option>

                    <option value="Bi-Weekly Cleaning">
                      Bi-Weekly Cleaning
                    </option>
                  </select>
                </label>

                <label>
                  <span>Address / City</span>

                  <input
                    type="text"
                    name="location"
                    placeholder="City or service address"
                    autoComplete="street-address"
                    required
                  />
                </label>

                <label className="full">
                  <span>Message</span>

                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Tell us about the cleaning service you need..."
                    required
                  ></textarea>
                </label>

              </div>

              <button
                type="submit"
                className="button button-blue form-button"
                disabled={loading}
              >
                {loading
                  ? "Sending..."
                  : "Request My Free Quote"}

                {!loading && (
                  <span>→</span>
                )}
              </button>

              <p className="form-note">
                No obligation. We'll contact you to
                discuss your cleaning needs.
              </p>

              {status && (
                <div
                  className={`form-status ${statusType}`}
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
      <footer className="site-footer">
        <div className="container footer-content">

          <div>
            <strong>
              SL CLEANING SERVICES
            </strong>

            <p>
              Professional cleaning services you can
              count on.
            </p>
          </div>

          <div className="footer-contact">
            <a href="tel:5625072586">
              562-507-2586
            </a>

            <a href="mailto:lscleaningservices1845@gmail.com">
              lscleaningservices1845@gmail.com
            </a>
          </div>

        </div>

        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} SL Cleaning
            Services. All rights reserved.
          </span>
        </div>
      </footer>

      {/* MOBILE BOTTOM BAR */}
      <div className="mobile-bottom-bar">

        <a href="tel:5625072586">
          ☎ Call Us
        </a>

        <button onClick={scrollToContact}>
          Get Free Quote →
        </button>

      </div>
    </>
  );
}

export default App;
