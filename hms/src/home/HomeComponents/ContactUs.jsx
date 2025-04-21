import React, { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {


      const response = await axios.post("https://hms.tsaritservices.com/api/contact", formData);

      if (response.status === 200) {
        setSuccessMessage("Message sent successfully!");
        setErrorMessage(""); 
        setFormData({ name: "", email: "", message: "" }); 
      }
    } catch (error) {
      setErrorMessage("Failed to send message. Please try again.");
      setSuccessMessage(""); 
    }
  };

  return (
    <div className="ct-contact-form">
      <h2 className="ct-heading">Get in Touch</h2>
      <form className="ct-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="ct-input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="ct-input"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="ct-input ct-textarea"
          required
        ></textarea>
        <button type="submit" className="ct-submit">
          Send Message
        </button>
      </form>

      {successMessage && <p className="ct-success-message">{successMessage}</p>}
      {errorMessage && <p className="ct-error-message">{errorMessage}</p>}
    </div>
  );
};

export default ContactForm;