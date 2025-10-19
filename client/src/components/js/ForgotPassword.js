import React, { useState } from "react";
import axios from "axios";
import Navbar from "./navbar";
import Footer from "./footer";
import "../css/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(res.data.message || "Password reset link sent to your email!");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.response?.data?.error || "Unable to send reset link. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="auth-section">
        <div className="auth-container">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Enter your registered email:</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send Reset Link</button>

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ForgotPassword;
