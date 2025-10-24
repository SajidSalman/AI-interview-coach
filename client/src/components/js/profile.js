import React from "react";
// Remove Navbar/Footer imports if App.js handles them globally
// import Navbar from "./navbar";
// import Footer from "./footer";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")); // get logged-in user info

  // Message for non-logged-in users
  if (!user) {
    return (
      <div style={styles.container}>
        <h2>Please login to view your profile.</h2>
        {/* Optional: Add a Link to the login page */}
        {/* <Link to="/login">Go to Login</Link> */}
      </div>
    );
  }

  // Profile display for logged-in users
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Your Profile</h1>
      <div style={styles.profileCard}>
        {/* Placeholder Avatar */}
        <div style={styles.avatar}>
          <svg // Simple user icon
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ width: '50px', height: '50px', color: '#666' }}
          >
            <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* User Details */}
        <div style={styles.details}>
          <div style={styles.detailItem}>
            <span style={styles.label}>Name:</span>
            <span style={styles.value}>{user.name || "N/A"}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{user.email || "N/A"}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.label}>User ID:</span>
            <span style={styles.value}>{user.id || "N/A"}</span>
          </div>
          {/* Add more details here if available, e.g., registration date */}
        </div>

        {/* Optional: Action Buttons */}
        {/* <div style={styles.actions}>
          <button style={styles.button}>Edit Profile</button>
          <button style={styles.button}>Change Password</button>
        </div> */}
      </div>
    </div>
  );
};

// Enhanced Styles
const styles = {
  container: {
    padding: "100px 20px 40px 20px", // Adjusted top padding
    minHeight: "calc(100vh - 120px)", // Ensure it takes height minus header/footer approx
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center content horizontally
  },
  header: {
    marginBottom: "30px",
    color: "#333",
  },
  profileCard: {
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#ffffff", // White background
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)", // Softer shadow
    maxWidth: "450px", // Slightly wider card
    width: "100%", // Take full width up to max-width
    textAlign: 'center', // Center avatar
  },
  avatar: {
    marginBottom: "20px",
    width: "80px", // Container for avatar
    height: "80px",
    borderRadius: "50%", // Make it circular
    backgroundColor: "#e0e0e0", // Placeholder background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px auto", // Center horizontally
  },
  details: {
    textAlign: 'left', // Align text to the left
    marginBottom: "20px",
  },
  detailItem: {
    marginBottom: "12px", // Space between items
    display: "flex", // Use flexbox for label/value alignment
    justifyContent: "space-between", // Space out label and value
    paddingBottom: '8px',
    borderBottom: '1px solid #eee', // Separator line
  },
  label: {
    fontWeight: "600", // Bolder label
    color: "#555",
    marginRight: "10px",
  },
  value: {
    color: "#333",
    wordBreak: "break-word", // Break long emails/IDs
  },
  actions: { // Styles for optional buttons
    marginTop: "20px",
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  button: {
    padding: '8px 15px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  }
};

export default Profile;