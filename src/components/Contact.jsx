import { useState } from "react";

function Contact() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setStatus("Sending...");

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
    <section id="contact" className="bg-light">
      <div className="container">

        <div className="text-center mb-5">
          <h2 className="fw-bold">Request a Quote</h2>

          <p className="text-muted">
            Tell us what cleaning service you need.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">

            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 p-md-5 rounded-4 shadow-sm"
            >

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="(000) 000-0000"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Service Needed
                  </label>

                  <select
                    name="service"
                    className="form-select"
                    required
                  >
                    <option value="">
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
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Address / City
                  </label>

                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="City or service address"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Message
                  </label>

                  <textarea
                    name="message"
                    className="form-control"
                    rows="5"
                    placeholder="Tell us about the cleaning service you need..."
                    required
                  ></textarea>
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading
                      ? "Sending..."
                      : "Request Quote"}
                  </button>
                </div>

                {status && (
                  <div className="col-12">
                    <div className="alert alert-info mb-0">
                      {status}
                    </div>
                  </div>
                )}

              </div>

            </form>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Contact;
