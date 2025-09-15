import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import '../css/auth.css'; // Make sure this path matches your CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill out both fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {  // Updated to correct endpoint
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);  // Store token in localStorage
      navigate('/dashboard');  // Redirect to the dashboard
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <Navbar />
      <section className="auth-section">
        <div className="auth-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
            {error && <p className="error">{error}</p>}

            <p className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </p>

            <p className="register-link">
              Don't have an account? <a href="/Signup">Register</a>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
