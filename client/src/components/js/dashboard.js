import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user info

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "120px 20px 20px 20px", textAlign: "center" }}>
          <h2>Please login to access your dashboard.</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "120px 20px 20px 20px" }}>
        <h1>Welcome to your Dashboard, {user.name}!</h1>
        <p>This is your personal space to track and manage your interview prep.</p>

        <div style={styles.card}>
          <h2>Profile Summary</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>

          <div style={styles.actions}>
            <Link to="/profile" style={styles.actionButton}>View Profile</Link>
            <Link to="/upload-resume" style={styles.actionButton}>Upload Resume</Link>
            <Link to="/mock-interview" style={styles.actionButton}>Start Mock Interview</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  card: {
    marginTop: "20px",
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "#f4f4f4",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    maxWidth: "600px",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  actionButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
  },
};

export default Dashboard;
