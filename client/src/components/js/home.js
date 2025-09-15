import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Navbar from "./navbar";
import Hero from "./hero_section";
import About from "./about";
import MockInterview from "./mock_interview";
import AITools from "./ai_tools";
import Testimonial from "./testimonial";
import Contact from "./contact";
import Footer from "./footer";

const Home = () => {
   return (
     <>
       <Navbar />
       <Hero />
       <About />
       <MockInterview />
       <AITools />

       {/* New Section for Resume Upload */}
       <div style={styles.resumeSection}>
         <h2 style={styles.title}>Want to Prepare Better?</h2>
         <p>Upload your resume and get tailored interview questions!</p>
         <Link to="/upload-resume" style={styles.uploadButton}>
           Upload Resume
         </Link>
       </div>

       <Testimonial />
       <Contact />
       <Footer />
     </>
   );
};

// Styling for the new section
const styles = {
  resumeSection: {
    padding: '40px',
    backgroundColor: '#f4f4f4',
    textAlign: 'center',
    marginTop: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '10px',
  },
  uploadButton: {
    display: 'inline-block',
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
};

export default Home;
