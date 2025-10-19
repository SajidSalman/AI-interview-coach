import React, { useState } from "react";
import "../css/about.css";
import aboutImage from "../images/about.png";

const About = () => {
  const [showMore, setShowMore] = useState(false);

  const features = [
    { icon: "🚀", text: "AI-Powered Mock Interviews: Practice with real interview scenarios and get instant feedback." },
    { icon: "📄", text: "Smart Resume Analysis: Upload your resume to get insights on formatting and keywords." },
    { icon: "🎯", text: "Personalized Guidance: Tailored tips to improve your communication and confidence." },
    { icon: "💡", text: "Interactive Tools: Curated questions, exercises, and progress tracking for efficient learning." },
    { icon: "🌟", text: "360° Preparation: Practice, improve, and showcase your potential for any career stage." }
  ];

  return (
    <section className="about-section">
      <div className="about-content">
        <div className="about-image">
          <img src={aboutImage} alt="About Us" />
        </div>

        <div className="about-text">
          <h2>Prepare Smarter, Succeed Faster</h2>
          <p>
            Our AI-powered platform transforms your interview preparation journey
            with real-time mock interviews, interactive Q&A sessions, and
            AI-driven resume feedback.
          </p>
          <p>
            Don’t just prepare — master the interview process with our intelligent
            tools designed to give you an edge.
          </p>

          {/* Extra info container with slide down */}
          <div className={`extra-info-container ${showMore ? "open" : ""}`}>
            <div className="extra-info">
              {features.map((feature, index) => (
                <p
                  key={index}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  className={`feature-fade ${index % 2 === 0 ? "slide-left" : "slide-right"}`}
                >
                  <span className="feature-icon">{feature.icon}</span>
                  {feature.text}
                </p>
              ))}
            </div>
          </div>

          <button
            className="learn-more-btn"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Show Less" : "Learn More"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
