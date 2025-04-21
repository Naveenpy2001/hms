import React, { useState } from "react";
import axios from "axios";
import '../../css/otp.css';
import { useNavigate } from "react-router-dom";

const OtpVerification = ({ firstname, lastname, email, hospitalname, phonenumber, password, repetepassword }) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });

  const [message, setMessage] = useState('');
  
  // Handle OTP input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    const index = parseInt(id.slice(-1));

    if (/^\d?$/.test(value)) {
      // Ensure only one digit is entered
      setOtp({ ...otp, [id]: value });

      if (value) {
        // Move to the next input field when a digit is entered
        if (index < 6) {
          const nextInput = document.getElementById(`input${index + 1}`);
          nextInput && nextInput.focus();
        }
      }
    }
  };

  // Handle Backspace key press for navigating between inputs
  const handleKeyDown = (e) => {
    const { id, value } = e.target;
    const index = parseInt(id.slice(-1));

    if (e.key === "Backspace" && !value) {
      // Move to the previous input field if current field is empty
      if (index > 1) {
        const prevInput = document.getElementById(`input${index - 1}`);
        prevInput && prevInput.focus();

        setOtp((prevState) => ({
          ...prevState,
          [`input${index - 1}`]: "",
        }));
      }
    }
  };

  // Submit OTP for verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = Object.values(otp).join(""); // Join OTP inputs into one string



    // Log the OTP and email before sending request
    console.log("Sending email:", email);
    console.log("Sending OTP:", verificationCode);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/verify-otp/",
        { email, otp: verificationCode },
      );

      alert(response.data.message || "OTP verified successfully!");
      console.log(response.data);
      navigate("/login"); // Navigate to login after successful verification
    } catch (error) {
      console.error("Error verifying OTP:", error.response);
      alert(error.response?.data?.message || "Error verifying OTP!");
    }
  };

  // Resend OTP
  const handleResend = async (e) => {
    e.preventDefault();

    // Validate email is available before sending
    if (!email) {
      setMessage("Email is missing.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/resend-otp/",
        { firstname, lastname, email, hospitalname, phonenumber },
        
      );

      setMessage("OTP has been resent. Please check your email.");
      console.log('Resend OTP has been sent successfully..', email);
    } catch (error) {
      setMessage("Error resending OTP. Please try again.");
      console.error(error);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="title">OTP Verification</div>
      <p className="message">We have sent a verification code to your E-mail Address</p>
      
      <div className="inputs">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <input
            key={num}
            id={`input${num}`}
            type="text"
            maxLength="1"
            value={otp[`input${num}`]}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        ))}
      </div>

      <div className="flexBtns">
        <button className="action" type="submit">
          Verify Me
        </button>
        <button
          className="action"
          type="button"
          onClick={handleResend}
        >
          Resend OTP
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </form>
  );
};

export default OtpVerification;
