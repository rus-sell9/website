function Footer() {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">

        <div className="row">

          <div className="col-md-6">
            <h4 className="fw-bold">
              SL CLEANING SERVICES
            </h4>

            <p className="text-white-50">
              Professional cleaning services throughout
              Los Angeles and Orange County.
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <p className="mb-1">
              Los Angeles County
            </p>

            <p>
              Orange County
            </p>
          </div>

        </div>

        <hr />

        <p className="text-center text-white-50 mb-0">
          © {new Date().getFullYear()} SL CLEANING SERVICES. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;