import React, { useState } from "react";
import axios from "axios";


const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/subscribe", { email });
      setMessage("Subscription successful!");
      setEmail("");
    } catch (error) {
      setMessage("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="nl-news-letter" id="News-letter">
      <div className="nl-news">
        <div className="container">
          <h1 className="nl-news-heading">
            Subscribe To Get The Latest <br /> News About Us
          </h1>
          <p className="nl-des nl-how-de">
            Get the latest news about HMS to your pocket. Drop
            your <br />
            email below to get daily updates about us.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              maxLength="50"
              required
              placeholder="Enter your email address"
              className="nl-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="nl-bt" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          {message && <p className="nl-message">{message}</p>}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
