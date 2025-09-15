import React from "react";
import "../css/about.css";
import aboutImage from "../images/about.png";

const About = () => {
  return (
    <section className="about-section">
      <div className="about-content">
        {/* Left Side - Image */}
        <div className="about-image">
          <img src={aboutImage} alt="About Us" />
        </div>

        {/* Right Side - Text */}
        <div className="about-text">
          <h2>Prepare Smarter, Succeed Faster</h2>
          <p>
            Our AI-powered platform transforms your interview preparation journey with real-time mock interviews, 
            interactive Q&A sessions, and AI-driven resume feedback.
          </p>
          <p>
            Don't just prepare—master the interview process with our intelligent tools designed to give you an edge.
          </p>
          <button className="learn-more-btn">Learn More</button>
        </div>
      </div>
    </section>
  );
};

export default About;
