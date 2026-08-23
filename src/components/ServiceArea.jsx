function ServiceArea() {
  return (
    <section>
      <div className="container text-center">

        <h2 className="fw-bold mb-3">
          Our Service Area
        </h2>

        <p className="text-muted mb-5">
          Providing cleaning services throughout Southern California.
        </p>

        <div className="row justify-content-center g-4">

          <div className="col-md-4">
            <div className="p-4 rounded-4 bg-light">
              <h4 className="fw-bold">Los Angeles County</h4>
              <p className="mb-0">
                Residential & Building Services
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 rounded-4 bg-light">
              <h4 className="fw-bold">Orange County</h4>
              <p className="mb-0">
                Residential & Building Services
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ServiceArea;