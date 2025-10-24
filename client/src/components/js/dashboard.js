import React from "react";
import { Link } from "react-router-dom";
// Navbar and Footer should be rendered globally by App.js
// import Navbar from "./navbar";
// import Footer from "./footer";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user info

  // Message for non-logged-in users
  if (!user) {
    return (
      <div style={styles.container}> {/* Use consistent container style */}
        <h2 style={{ textAlign: 'center' }}>Please login to access your dashboard.</h2>
        {/* Optional: Link to login */}
        {/* <Link to="/login" style={styles.loginLink}>Go to Login</Link> */}
      </div>
    );
  }

  // Dashboard for logged-in users
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Welcome, {user.name}!</h1>
      <p style={styles.subHeader}>Manage your interview preparation resources here.</p>

      <div style={styles.grid}> {/* Use a grid for layout */}

        {/* Profile Summary Card */}
        <div style={styles.card}>
          <h2 style={styles.cardHeader}>Profile Summary</h2>
          <div style={styles.detailItem}>
            <span style={styles.label}>Name:</span>
            <span style={styles.value}>{user.name || "N/A"}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{user.email || "N/A"}</span>
          </div>
          <div style={styles.actions}>
            <Link to="/profile" style={{ ...styles.actionButton, ...styles.viewButton }}>
              View Full Profile
            </Link>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div style={styles.card}>
          <h2 style={styles.cardHeader}>Quick Actions</h2>
          <div style={styles.actions}>
            {/* <Link to="/upload-resume" style={styles.actionButton}>Upload/Update Resume</Link> */}
            <Link to="/mock-interview" style={{ ...styles.actionButton, ...styles.primaryButton }}>
              Start New Mock Interview
            </Link>
             {/* <Link to="/history" style={styles.actionButton}>View Interview History</Link> */}
          </div>
        </div>

        {/* Placeholder for Future Sections (e.g., Recent Activity, Stats) */}
        {/*
        <div style={styles.card}>
          <h2 style={styles.cardHeader}>Recent Activity</h2>
          <p>Your recent mock interview results will appear here.</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardHeader}>Performance Stats</h2>
          <p>Graphs and statistics about your progress will appear here.</p>
        </div>
        */}

      </div> {/* End Grid */}
    </div>
  );
};

// Enhanced Styles
const styles = {
  container: {
    padding: "100px 20px 40px 20px",
    minHeight: "calc(100vh - 120px)", // Approx height minus header/footer
    maxWidth: "1200px", // Limit overall width
    margin: "0 auto", // Center the container
  },
  header: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#333",
  },
  subHeader: {
    textAlign: "center",
    marginBottom: "40px",
    color: "#666",
    fontSize: "1.1em",
  },
  grid: { // Simple grid layout for cards
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", // Responsive columns
    gap: "30px", // Space between cards
  },
  card: {
    padding: "25px", // Slightly reduced padding
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)", // More subtle shadow
    display: 'flex', // Use flexbox for vertical layout
    flexDirection: 'column',
  },
  cardHeader: {
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee", // Separator line for header
    fontSize: "1.2em",
    color: "#444",
  },
  detailItem: {
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  label: {
    fontWeight: "600",
    color: "#555",
    marginRight: "10px",
  },
  value: {
    color: "#333",
    wordBreak: "break-word",
    textAlign: 'right',
  },
  actions: {
    marginTop: "auto", // Push actions to the bottom of the card
    paddingTop: "20px", // Space above actions
    display: "flex",
    flexDirection: "column", // Stack buttons vertically initially
    gap: "10px",
  },
  actionButton: {
    display: 'block', // Make links block level
    padding: "12px 15px",
    backgroundColor: "#6c757d", // Default gray color
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "500",
    textAlign: "center",
    transition: "background-color 0.2s ease, transform 0.1s ease",
    cursor: "pointer",
    border: 'none',
  },
  // Specific button styles for visual hierarchy
  primaryButton: {
    backgroundColor: "#007bff", // Blue for primary action
  },
  viewButton: {
     backgroundColor: "#17a2b8", // Teal for view action
  },
  loginLink: { // Style for the login link if user is not logged in
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
  },
  // Basic hover effect (add directly or via CSS classes)
  // actionButton:hover: {
  //   opacity: 0.9,
  //   transform: 'scale(1.02)',
  // }
};


export default Dashboard;