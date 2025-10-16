import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from './footer';
import '../css/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill out both fields');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate("/");
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err.response || err);
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    }
  };

  return (
    <>
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
              Don't have an account? <a href="/signup">Register</a>
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
