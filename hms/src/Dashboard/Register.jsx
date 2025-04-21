import React, { useState } from "react";
import axios from "axios";
import "../css/register.css";
import HMS from '../media/HMS.png';
import OtpVerification from "../home/HomeComponents/OTP";
import { useNavigate } from "react-router-dom";
import Footer from "../home/Footer";
import Navbar from "../home/HomeComponents/Nav";
import { FaRegHospital, FaRegUser } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlinePhone } from "react-icons/md";
import { BiCategoryAlt } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { API_URL } from "../API";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    // lastname: "",
    hospitalname: "",
    email: "",
    phonenumber: "",
    password: "",
    repetepassword: "",
    address: "",
    hospitalType: "",
    referredBy: "",
    other: ""
  });

  const [otpVerify, setOtpVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [errorMsg,setErrorMsg] = useState('')

  // Registration handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.repetepassword) {
      alert("Passwords do not match");
      return;
  }


  try {
      setLoading(true);
      const response = await axios.post(`http://127.0.0.1:8000/api/users/register/`, formData);
      setLoading(false);
      setOtpVerify(true); // OTP verification step
      console.log("Registration successful:", response.data);
  } catch (error) {
      console.error("Error registering:", error);
      setLoading(false);
      if (error.response) {
        // If there is a response with an error (status 400)
        const errorData = error.response.data;
        setErrorMsg(errorData);
      } else {
        console.error('Unexpected error', error);
      }
  }
};

// OTP Verification Function
const handleOtpSubmit = async (otp) => {
  try {
      const response = await axios.post(`${API_URL}/api/verify-otp/`, { email: formData.email, otp });
      alert("OTP verified successfully!");
      navigate("/login"); 
  } catch (error) {
      alert("Invalid OTP!");
  }
};


  return (
    <>
      <Navbar />
      <div className="flex-center">
        <form className="form_container" onSubmit={handleSubmit}>
          <div className="flexCenter">
            <div className="logo_container">
              <img src={HMS} alt="hms"/>
            </div>
          </div>
          <div className="title_container">
            <p className="title">Create a New Account</p>
            <span className="subtitle">Fill out the details below to register.</span>
          </div>
          <div>
          
          </div>
          <br />

          <div className="input_container">
            <label className="input_label">Full Name</label>
            <FaRegUser className="icon"/>
            <input
              placeholder="Enter Your FUll Name"
              name="username"
              type="text"
              className="input_field"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* <div className="input_container">
            <label className="input_label">Last Name</label>
            <FaRegUser className="icon"/>
            <input
              placeholder="Last Name"
              name="lastname"
              type="text"
              className="input_field"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div> */}

          <div className="input_container">
            <label className="input_label">Hospital Name</label>
            <FaRegHospital className="icon"/>
            <input
              placeholder="Hospital Name"
              name="hospitalname"
              type="text"
              className="input_field"
              value={formData.hospitalname}
              onChange={handleChange}
            />
          </div>

          <div className="input_container">
            <label className="input_label">Email</label>
            <input
              placeholder="name@mail.com"
              name="email"
              type="email"
              className="input_field"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input_container">
            <label className="input_label">Address (city, zipcode, street)</label>
            <IoLocationOutline className="icon"/>
            <input
              placeholder="Address"
              name="address"
              type="text"
              className="input_field"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="input_container">
            <label className="input_label">Phone No.</label>
            <MdOutlinePhone className="icon"/>
            <input
              placeholder="+91 00000 00000"
              name="phonenumber"
              type="tel"
              className="input_field"
              value={formData.phonenumber}
              onChange={handleChange}
            />
          </div>

          <div className="input_container">
            <label className="input_label">Password</label>
            <input
              placeholder="Password"
              name="password"
              type="password"
              className="input_field"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="input_container">
            <label className="input_label">Confirm Password</label>
            <input
              placeholder="Confirm Password"
              name="repetepassword"
              type="password"
              className="input_field"
              value={formData.repetepassword}
              onChange={handleChange}
            />
          </div>

          {/* <div className="input_container">
            <label className="input_label">Hospital Type</label>
            <BiCategoryAlt className="icon"/>
            <select
              name="hospitalType"
              className="input_field"
              value={formData.hospitalType}
              onChange={handleChange}
            >
              <option value="">Select Hospital Type</option>
              <option value="General">General</option>
              <option value="Specialized">Specialized</option>
              <option value="Clinic">Clinic</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {formData.hospitalType === "Other" && (
            <input
              placeholder="Enter Hospital Type"
              name="other"
              type="text"
              className="input_field"
              value={formData.other}
              onChange={handleChange}
            />
          )}

          <div className="input_container">
            <label className="input_label">Referred By</label>
            <FiUsers className="icon"/>
            <input
              placeholder="Referred By"
              name="referredBy"
              type="text"
              className="input_field"
              value={formData.referredBy}
              onChange={handleChange}
            />
          </div> */}

          <button type="submit" className="sign-in_btn">
            {loading ? <div className="centerLoading">Loading...</div> : "Register"}
          </button>

          <br />
          <center>
            <p style={{color:'red', fontSize:'18px'}}>
              
              {errorMsg.email && <p>{errorMsg.email[0]}</p>}
              {errorMsg.phonenumber && <p>{errorMsg.phonenumber[0]}</p>}
              
            </p>
          </center>
          
          <p className="note">Terms of use & Conditions</p>
          <div className="signup_container">
            <p className="signup_text">
              Already Have An Account? <a href="/Login" className="signup_link">Login</a>
            </p>
          </div>
        </form>

          

        <div className={otpVerify ? "active-otp-form" : "PopUp-OTP"}>
          <OtpVerification {...formData} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
