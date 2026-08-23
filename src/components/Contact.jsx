
function Contact() {
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

            <form className="bg-white p-4 p-md-5 rounded-4 shadow-sm">

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your name"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="(000) 000-0000"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">
                    Service Needed
                  </label>

                  <select className="form-select">
                    <option>Select a service</option>
                    <option>Residential Cleaning</option>
                    <option>Building Cleaning</option>
                    <option>Unit Cleaning</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Message</label>

                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Tell us about the cleaning service you need..."
                  ></textarea>
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100"
                  >
                    Request Quote
                  </button>
                </div>

              </div>

            </form>

          </div>
        </div>

      </div>
    </section>
  );
}

export default Contact;