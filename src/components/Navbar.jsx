function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          SL <span className="text-primary">CLEANING</span> SERVICES
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#home">Home</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#services">Services</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#about">About Us</a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
          </ul>

          <a href="#contact" className="btn btn-primary ms-lg-3">
            Get a Quote
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;