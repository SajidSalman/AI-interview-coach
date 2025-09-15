import React from "react";
import "../css/contact.css";

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-form-container">
        <h2 className="contact-title">Get in Touch</h2>
        <p className="contact-subtitle">
          Have a question? We’d love to hear from you!
        </p>
        <form className="contact-form">
          <div className="input-group">
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="input-group">
            <input type="email" placeholder="Your Email" required />
          </div>
          <div className="input-group">
            <textarea placeholder="Your Message" required></textarea>
          </div>
          <button type="submit" className="contact-btn">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
