import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
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
    <nav className="bg-white shadow-md w-full">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 text-2xl font-semibold text-gray-800"
        >
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span>Interview Prep</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-gray-700 items-center">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/mock-interview" className="hover:text-blue-600">Mock Interviews</Link>
          <Link to="/ai-tools" className="hover:text-blue-600">AI Tools</Link>
          <Link to="/testimonial" className="hover:text-blue-600">Testimonial</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>

          {!token ? (
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 text-gray-800 font-medium hover:text-blue-600 focus:outline-none"
              >
                {user?.name || "Profile"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform transition-transform ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md py-2">
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Dashboard</Link>
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col p-4 space-y-3 text-gray-700">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/about" className="hover:text-blue-600">About</Link>
            <Link to="/mock-interview" className="hover:text-blue-600">Mock Interviews</Link>
            <Link to="/ai-tools" className="hover:text-blue-600">AI Tools</Link>
            <Link to="/testimonial" className="hover:text-blue-600">Testimonial</Link>
            <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>

            {!token ? (
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
            ) : (
              <>
                <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
                <Link to="/profile" className="hover:text-blue-600">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
