import { useState } from "react";

function Contact() {
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
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

    const json = JSON.stringify(object);

    try {
      const response = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: json,
        }
      );

      const data = await response.json();

      console.log("Web3Forms response:", data);

      if (response.ok && data.success) {
        setStatus(
          "Thank you! Your quote request has been sent successfully."
        );

        setStatusType("success");

        form.reset();
      } else {
        setStatus(
          data.message ||
            "Something went wrong. Please try again."
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

  return (
    <section id="contact" className="contact-section">
      <div className="container">

        <div className="contact-heading">
          <span className="section-eyebrow">
            FREE QUOTE
          </span>

          <h2>
            Request a Quote
          </h2>

          <p>
            Tell us about your cleaning needs and we'll
            get back to you shortly.
          </p>
        </div>

        <div className="contact-wrapper">

          <div className="contact-info">

            <div className="contact-accent"></div>

            <h3>
              Let's make your space shine.
            </h3>

            <p>
              Whether you need residential cleaning,
              building cleaning, or recurring service,
              we're here to help.
            </p>

            <div className="contact-details">

              <a href="tel:5625072586">
                <span className="contact-icon blue">
                  ☎
                </span>

                <div>
                  <small>CALL US</small>
                  <strong>562-507-2586</strong>
                </div>
              </a>

              <a href="mailto:lscleaningservices1845@gmail.com">
                <span className="contact-icon pink">
                  ✉
                </span>

                <div>
                  <small>EMAIL US</small>
                  <strong>
                    lscleaningservices1845@gmail.com
                  </strong>
                </div>
              </a>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="quote-form"
          >

            <div className="form-grid">

              {/* NAME */}
              <div className="form-field">
                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </div>

              {/* PHONE */}
              <div className="form-field">
                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="(000) 000-0000"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="form-field full">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              {/* SERVICE */}
              <div className="form-field">
                <label htmlFor="service">
                  Service Needed
                </label>

                <select
                  id="service"
                  name="service"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
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
              </div>

              {/* LOCATION */}
              <div className="form-field">
                <label htmlFor="location">
                  Address / City
                </label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="City or service address"
                  autoComplete="street-address"
                  required
                />
              </div>

              {/* MESSAGE */}
              <div className="form-field full">
                <label htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell us about the cleaning service you need..."
                  required
                ></textarea>
              </div>

              {/* BUTTON */}
              <div className="form-submit full">

                <button
                  type="submit"
                  disabled={loading}
                  className="quote-submit"
                >
                  {loading
                    ? "Sending..."
                    : "Request My Free Quote"}

                  {!loading && (
                    <span>→</span>
                  )}
                </button>

                <p className="form-note">
                  No obligation. We'll contact you
                  to discuss your cleaning needs.
                </p>

              </div>

              {/* STATUS */}
              {status && (
                <div
                  className={`form-status ${statusType} full`}
                  role="status"
                >
                  {status}
                </div>
              )}

            </div>

          </form>

        </div>

      </div>
    </section>
  );
}

export default Contact;
