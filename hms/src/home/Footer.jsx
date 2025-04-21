import React from "react";
import HMS from '../media/HMS-Transparent.png'
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={HMS} alt="hms" />
        </div>
        <div className="footer-links">
          <a href="/about" className="footer-link">
            About Us
          </a>
          <a href="/services" className="footer-link">
            Services
          </a>
          <a href="/contact" className="footer-link">
            Contact Us
          </a>
          <a href="/privacy" className="footer-link">
            Privacy Policy
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 HMS. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
