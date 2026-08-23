function Services() {
  const services = [
    {
      title: "Residential Cleaning",
      description:
        "Professional cleaning services for homes, apartments, and living spaces.",
      icon: "🏠",
    },
    {
      title: "Building Cleaning",
      description:
        "Cleaning services for commercial and residential buildings.",
      icon: "🏢",
    },
    {
      title: "Unit Cleaning",
      description:
        "Detailed cleaning for individual units and properties.",
      icon: "🧹",
    },
  ];

  return (
    <section id="services">
      <div className="container">

        <div className="text-center mb-5">
          <h2 className="fw-bold">Our Services</h2>
          <p className="text-muted">
            Professional cleaning solutions for different needs.
          </p>
        </div>

        <div className="row g-4">
          {services.map((service, index) => (
            <div className="col-md-4" key={index}>
              <div className="card h-100 border-0 shadow-sm p-4 text-center">
                <div className="display-4 mb-3">
                  {service.icon}
                </div>

                <h4 className="fw-bold">
                  {service.title}
                </h4>

                <p className="text-muted">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Services;