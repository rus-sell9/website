function Hero() {
  return (
    <section
      id="home"
      className="bg-light"
      style={{ minHeight: "85vh" }}
    >
      <div className="container h-100">
        <div className="row align-items-center min-vh-75">

          <div className="col-lg-6">
            <span className="badge bg-primary mb-3">
              Serving LA & Orange County
            </span>

            <h1 className="display-3 fw-bold text-dark">
              Professional Cleaning You Can Trust.
            </h1>

            <p className="lead mt-4">
              Reliable and professional cleaning services for homes,
              buildings, and units throughout Los Angeles and Orange County.
            </p>

            <div className="mt-4">
              <a href="#contact" className="btn btn-primary btn-lg me-2">
                Request a Quote
              </a>

              <a href="#services" className="btn btn-outline-dark btn-lg">
                Our Services
              </a>
            </div>
          </div>

          <div className="col-lg-6 mt-5 mt-lg-0">
            <div className="bg-primary rounded-4 p-5 text-white text-center">
              <h2 className="fw-bold">
                SL CLEANING SERVICES
              </h2>

              <p className="mb-0">
                Clean. Professional. Reliable.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;