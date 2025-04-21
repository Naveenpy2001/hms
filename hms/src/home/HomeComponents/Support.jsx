import React, { useState } from "react";
import axios from "axios";
import "../../css/Support.css"; 

import Navbar from "./Nav";
import Footer from "../Footer";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/support", {
        name,
        email,
        message,
      });
      setResponseMessage("Your request has been sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setResponseMessage("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <section className="nl-support">
      <div className="container">
        <div className="nl-support-intro">
          <h1 className="nl-support-heading">
            About Hospital Management System (HMS)
          </h1>
          <p className="nl-support-intro-text">
            Our Hospital Management System (HMS) is designed to streamline
            hospital operations and improve patient care. It provides features
            for managing patient records, scheduling appointments, handling
            billing, and more. With HMS, hospitals can enhance their efficiency
            and deliver high-quality care to their patients.
          </p>
          <p className="nl-support-intro-text">
            If you need assistance with using the system, have questions, or
            face any issues, please reach out to our support team by filling out
            the form below. We are here to help and ensure that you get the most
            out of our HMS.
          </p>
        </div>

        <h2 className="nl-support-form-heading">Support Request Form</h2>
        <form onSubmit={handleSubmit} className="nl-support-form">
          <input
            type="text"
            required
            placeholder="Your Name"
            className="nl-support-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Your Email"
            className="nl-support-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            required
            placeholder="Your Message"
            className="nl-support-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="nl-support-button"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Request"}
          </button>
        </form>
        {responseMessage && (
          <p className="nl-support-response">{responseMessage}</p>
        )}
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Support;
