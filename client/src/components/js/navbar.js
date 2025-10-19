import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css";
import logo from "../images/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white fixed-top shadow-sm">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" className="logo me-2" />
          Interview Prep
        </Link>

        {/* Hamburger / Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mock-interview">Mock Interviews</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ai-tools">AI Tools</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/testimonial">Testimonial</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>

            {/* Conditional Login / Profile */}
            {!token ? (
              <li className="nav-item">
                <Link className="nav-link fw-bold" to="/login">Login</Link>
              </li>
            ) : (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle"
                  style={{ cursor: "pointer" }}
                  onClick={toggleDropdown}
                >
                  {user?.name || "Profile"}
                </span>
                {dropdownOpen && (
                  <ul className="dropdown-menu show" style={{ position: "absolute", right: 0 }}>
                    <li>
                      <Link className="dropdown-item" to="/dashboard" onClick={() => setDropdownOpen(false)}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={() => setDropdownOpen(false)}>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <span className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </span>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
