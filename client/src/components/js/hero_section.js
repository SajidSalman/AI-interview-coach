import React from "react";
import "../css/hero_section.css";

const Hero = () => {
   return (
     <section className="hero-section">
       <div className="hero-container">
         <h1 className="hero-title">Ace Your Next Interview</h1>
         <p className="hero-subtitle">
           Practice with AI, get real interview questions, and boost your confidence.
         </p>
 
         {/* AI-Powered Search Bar */}
         <div className="search-bar">
           <input type="text" placeholder="Ask AI for interview tips..." />
           <button>Try AI Help</button>
         </div>
       </div>
     </section>
   );
 };

export default Hero;
