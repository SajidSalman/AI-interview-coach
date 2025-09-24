import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user")); // get logged-in user info

  if (!user) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "120px 20px 20px 20px", textAlign: "center" }}>
          <h2>Please login to view your profile.</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "120px 20px 20px 20px" }}>
        <h1>Your Profile</h1>
        <div style={styles.profileCard}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.id}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  profileCard: {
    marginTop: "20px",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f4f4f4",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    maxWidth: "400px",
  },
};

export default Profile;
