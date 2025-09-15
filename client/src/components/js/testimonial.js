import React from "react";
import "../css/testimonial.css";
import testimonial1 from "../images/testimonial1.png";
import testimonial2 from "../images/testimonial2.png";
import testimonial3 from "../images/testimonial3.png";

const testimonials = [
  {
    name: "Aryan Mehta",
    role: "Software Engineer at Google",
    story: "This platform gave me the confidence to crack my Google interview with mock sessions and AI-driven feedback!",
    image: testimonial1,
  },
  {
    name: "Sneha Kapoor",
    role: "Data Analyst at Amazon",
    story: "The AI Resume Analyzer helped me improve my CV, and I landed my dream role at Amazon!",
    image: testimonial2,
  },
  {
    name: "Rahul Singh",
    role: "Backend Developer at Microsoft",
    story: "Practicing with AI-generated questions made me fully prepared for my technical rounds.",
    image: testimonial3,
  },
];

const Testimonial = () => {
  return (
    <section className="testimonials-section">
      <h2 className="section-title">Success Stories</h2>
      <p className="section-subtitle">
        Real stories from students who cracked their dream jobs!
      </p>
      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-inner">
              {/* Front Side */}
              <div className="testimonial-front">
                <img src={testimonial.image} alt={testimonial.name} className="testimonial-img" />
                <h3 className="testimonial-name">{testimonial.name}</h3>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
              {/* Back Side */}
              <div className="testimonial-back">
                <p className="testimonial-story">“{testimonial.story}”</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
