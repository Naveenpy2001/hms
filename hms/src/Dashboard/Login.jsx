
import React, { useState } from "react";
import axios from "axios";
import "../css/login.css";
import HMS from "../media/HMS.png";
import { useNavigate } from "react-router-dom";
import ForgotPswd from "./components/ForgotPswd";
import Navbar from "../home/HomeComponents/Nav";
import Footer from "../home/Footer";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const navigate = useNavigate();
  const [forgot, setForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        email,
        password,
      });

      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response && err.response.data?.non_field_errors?.[0] === "User is not verified") {
        console.log("User not verified, resending OTP...");
        await resendOtp(); // Resend OTP before showing popup
        setShowOtpPopup(true);
      } else {
        setError("Invalid credentials");
      }
    }
  };

  const resendOtp = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/resend-otp/", { email });
      console.log("OTP sent successfully:", res.data);
      alert("OTP has been sent to your email.");
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError("Failed to resend OTP.");
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/users/verify-otp/", { email, otp });

      if (res.status === 200) {
        alert("OTP verified successfully. Please log in again.");
        setShowOtpPopup(false);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex-center">
        <form className="form_container" onSubmit={handleSubmit}>
          <div className="flexCenter">
            <div className="logo_container">
              <img src={HMS} alt="hms" />
            </div>
          </div>
          <div className="title_container">
            <p className="title">Login to your Account</p>
            <span className="subtitle">
              Get started with our HMS, just create an account and enjoy the experience.
            </span>
          </div>
          <br />
          <label className="input_label" htmlFor="email_field">
            Email
          </label>
          <input
            placeholder="name@mail.com"
            type="text"
            className="input_field"
            id="email_field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="input_label" htmlFor="password_field">
            Password
          </label>
          <input
            placeholder="password"
            type="password"
            className="input_field"
            id="password_field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex-row">
            <input type="checkbox" id="check" />
            <label htmlFor="check"> Remember me </label>
            <span className="span" onClick={() => setForgot(true)}>
              Forgot password?
            </span>
          </div>
          <button className="sign-in_btn" type="submit">
            Log in
          </button>

          {error && <p className="error-text">{error}</p>}
        </form>
      </div>

      {showOtpPopup && (
        <div className="otp-popup">
          <div className="otp-popup-content">
            <span className="close-btn" onClick={() => setShowOtpPopup(false)}>×</span>
            <h3>Enter OTP</h3>
            <p>An OTP has been sent to your email.</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={verifyOtp} className="verify-btn">
              Verify OTP
            </button>
          </div>
        </div>
      )}

      <div className={forgot ? "activeFOrgotForm" : "forgotForm"}>
        <div className="form-1">
          <span className="cancel" onClick={() => setForgot(false)}>×</span>
          <ForgotPswd setForgot={setForgot} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
