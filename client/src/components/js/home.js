import React from "react";
import { Link } from "react-router-dom";
import Hero from "./hero_section";
import About from "./about";
import Testimonial from "./testimonial";
import Contact from "./contact";
import Footer from "./footer";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Logged-in user info

  return (
    <>

      {/* 🌟 Personalized Welcome Section */}
      {user && (
        <section style={styles.welcomeSection}>
          <h2>
            👋 Welcome back, <span style={styles.username}>{user.name}</span>
          </h2>
          <p>Ready to sharpen your interview skills and land your dream job?</p>
        </section>
      )}

      {/* 🚀 Hero Section */}
      <Hero tryAIHelpLink="/mock-interview" />

      {/* 💼 About Section */}
      <div style={styles.gradientSection}>
        <About />
      </div>

      {/* 🤖 AI Tools Section */}
      <section style={styles.aiHelpSection}>
        <div style={styles.aiContent}>
          <h2>Supercharge Your Prep with AI</h2>
          <p>
            Use AI-driven tools to analyze your resume, generate questions,
            debug your code, and improve your speaking skills — all in one place.
          </p>
          <Link to="/ai-tools" style={styles.aiHelpButton}>
            🚀 Try AI Help
          </Link>
        </div>
      </section>

      {/* 📄 Resume Upload Section */}
      <section style={styles.resumeSection}>
        <h2>Want Tailored Interview Questions?</h2>
        <p>Upload your resume and let AI create job-specific interview questions for you.</p>
        <Link to="/upload-resume" style={styles.uploadButton}>
          📤 Upload Resume
        </Link>
      </section>

      {/* 💬 Testimonials */}
      <div style={styles.gradientSection}>
        <Testimonial />
      </div>

      {/* 📞 Contact & Footer */}
      <Contact />
      <Footer />
    </>
  );
};

// 💅 Modern Styling
const styles = {
  welcomeSection: {
    background: "linear-gradient(90deg, #007bff, #00c6ff)",
    color: "#fff",
    padding: "40px 20px",
    textAlign: "center",
    borderBottomLeftRadius: "40px",
    borderBottomRightRadius: "40px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    marginBottom: "40px",
  },
  username: {
    color: "#ffeb3b",
    fontWeight: "700",
  },
  gradientSection: {
    background: "linear-gradient(135deg, #f8f9fa, #e0f7fa)",
    padding: "40px 0",
  },
  aiHelpSection: {
    background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
    color: "white",
    textAlign: "center",
    padding: "80px 20px",
    borderRadius: "30px",
    margin: "60px 10%",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
  },
  aiContent: {
    maxWidth: "700px",
    margin: "0 auto",
  },
  aiHelpButton: {
    display: "inline-block",
    background: "white",
    color: "#2575fc",
    fontWeight: "bold",
    padding: "14px 30px",
    borderRadius: "30px",
    marginTop: "20px",
    textDecoration: "none",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
  },
  resumeSection: {
    background: "#f8f9fa",
    padding: "80px 20px",
    textAlign: "center",
    borderRadius: "30px",
    margin: "40px 10%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  uploadButton: {
    display: "inline-block",
    background: "linear-gradient(135deg, #43e97b, #38f9d7)",
    color: "#fff",
    fontWeight: "bold",
    padding: "14px 30px",
    borderRadius: "30px",
    marginTop: "20px",
    textDecoration: "none",
    fontSize: "1.1rem",
    transition: "all 0.3s ease",
  },
};

export default Home;
