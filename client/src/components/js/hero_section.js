import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/hero_section.css";

const Hero = ({ tryAIHelpLink = "/ai-tools" }) => {
  const navigate = useNavigate();

  const handleTryAIHelp = () => {
    navigate(tryAIHelpLink);
  };

  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">Ace Your Next Interview</h1>
        <p className="hero-subtitle">
          Practice with AI, get real interview questions, and boost your confidence.
        </p>

        <div className="search-bar">
          <input type="text" placeholder="Ask AI for interview tips..." />
          <button onClick={handleTryAIHelp}>Try AI Help</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
