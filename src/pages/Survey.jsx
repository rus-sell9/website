import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon";
import "../App.css";
import "./Survey.css";

function Survey() {
  const [stage, setStage] = useState("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSurveySubmit = async (event) => {
    event.preventDefault();

    if (rating === 0) {
      setErrorMessage("Please select a star rating.");
      return;
    }

    setErrorMessage("");
    setStage("submitting");

    const form = event.target;
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);

    object.rating = rating;
    object.access_key = import.meta.env.VITE_WEB3FORMS_KEY;
    object.subject = "New Service Survey - SL CLEANING SERVICES";
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
        form.reset();
        setRating(0);
        setStage("success");
      } else {
        setErrorMessage(
          data.message || "Something went wrong. Please try again."
        );
        setStage("form");
      }
    } catch (error) {
      console.error("Form error:", error);

      setErrorMessage(
        "Unable to send your survey. Please try again."
      );
      setStage("form");
    }
  };

  const handleLeave = () => {
    // Most browsers only allow a script to close a tab it opened itself,
    // so this will quietly no-op in that case — the note under the
    // button covers that fallback.
    window.close();
  };

  return (
    <div className="survey-page">
      <header className="survey-header">
        <div className="container survey-header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="SL Cleaning Services home"
          >
            <span className="brand-mark">
              <Icon name="sparkles" size={21} />
            </span>

            <span className="brand-text">
              <strong>SL</strong>
              <span>Cleaning Services</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="survey-main">
        <div className="container">
          {stage === "form" && (
            <>
              <div className="center-heading">
                <span className="section-label">
                  RATE YOUR SERVICE
                </span>

                <h2>
                  How did we do?
                </h2>

                <p>
                  We'd love your feedback on the work we completed. It
                  helps us keep our standards high and helps other clients
                  know what to expect.
                </p>
              </div>

              <form
                className="quote-form survey-form"
                onSubmit={handleSurveySubmit}
              >
                <div className="form-header">
                  <span>SERVICE SURVEY</span>

                  <h3>
                    Tell us about the work we did for you.
                  </h3>
                </div>

                <p className="disclaimer-box">
                  <strong>Disclaimer:</strong> the person filling out this
                  form must be the person who supervised how the work was
                  done (owner, manager, or on-site supervisor).
                </p>

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
                    <span>Your role on site</span>

                    <select
                      name="role"
                      defaultValue=""
                      required
                    >
                      <option
                        value=""
                        disabled
                      >
                        Select your role
                      </option>

                      <option value="Owner">
                        Owner
                      </option>

                      <option value="Manager">
                        Manager
                      </option>

                      <option value="Supervisor">
                        Supervisor
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
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
                    <span>Phone</span>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="(000) 000-0000"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                  </label>

                  <label className="full">
                    <span>Address where the work was done</span>

                    <input
                      type="text"
                      name="address"
                      placeholder="Street, City, ZIP"
                      autoComplete="street-address"
                      required
                    />
                  </label>

                  <label>
                    <span>Date of service</span>

                    <input
                      type="date"
                      name="service_date"
                    />
                  </label>

                  <label>
                    <span>Would you recommend us?</span>

                    <select
                      name="would_recommend"
                      defaultValue=""
                    >
                      <option
                        value=""
                        disabled
                      >
                        Select an answer
                      </option>

                      <option value="Yes">
                        Yes
                      </option>

                      <option value="No">
                        No
                      </option>
                    </select>
                  </label>

                  <div className="full star-field">
                    <span>Overall rating</span>

                    <div
                      className="star-rating"
                      role="radiogroup"
                      aria-label="Overall rating"
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={
                            value <= (hoverRating || rating)
                              ? "star filled"
                              : "star"
                          }
                          aria-label={`${value} star${
                            value > 1 ? "s" : ""
                          }`}
                          aria-pressed={value === rating}
                          onMouseEnter={() => setHoverRating(value)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(value)}
                        >
                          ★
                        </button>
                      ))}

                      <input
                        type="hidden"
                        name="rating"
                        value={rating}
                      />
                    </div>
                  </div>

                  <label className="full">
                    <span>Additional comments</span>

                    <textarea
                      name="comments"
                      rows="4"
                      placeholder="Anything you'd like to share about the service..."
                    />
                  </label>
                </div>

                <button
                  className="button button-primary form-button"
                  type="submit"
                >
                  Submit Survey
                  <Icon
                    name="arrow"
                    size={18}
                  />
                </button>

                <p className="form-note">
                  Your feedback goes directly to our team and is not
                  published without your permission.
                </p>

                {errorMessage && (
                  <div
                    className="form-status error"
                    role="status"
                  >
                    {errorMessage}
                  </div>
                )}
              </form>
            </>
          )}

          {stage === "submitting" && (
            <div className="survey-stage survey-stage-submitting">
              <div
                className="survey-spinner"
                aria-hidden="true"
              />

              <h2>Submitting your survey...</h2>
              <p>Please hold on a moment.</p>
            </div>
          )}

          {stage === "success" && (
            <div className="survey-stage survey-stage-success">
              <div className="survey-success-icon">
                <Icon
                  name="check"
                  size={34}
                />
              </div>

              <h2>Thanks for your survey!</h2>

              <p>
                We really appreciate you taking the time to share your
                feedback with us.
              </p>

              <div className="survey-success-actions">
                <Link
                  to="/"
                  className="button button-primary"
                >
                  <Icon
                    name="home"
                    size={18}
                  />
                  Go back home
                </Link>

                <button
                  className="button button-outline"
                  type="button"
                  onClick={handleLeave}
                >
                  <Icon
                    name="close"
                    size={18}
                  />
                  Leave the website
                </button>
              </div>

              <small className="survey-close-note">
                If "Leave the website" doesn't close this tab automatically,
                you can safely close it yourself.
              </small>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Survey;
