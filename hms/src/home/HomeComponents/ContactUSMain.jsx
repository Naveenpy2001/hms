import React, { useState } from "react";
import axios from "axios";
import "../../css/Contact.css"; 

import Navbar from "./Nav";
import Footer from "../Footer";

import { IoIosCall } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";

import { API_URL } from "../../API";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/api/contact`, formData)
      .then((response) => {
        alert("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      })
      .catch((error) => {
        alert("Failed to send message. Please try again later.");
      });
  };

  return (
    <>
    <Navbar />
      <section className="contact_us">
        <div className="container">
          <div className="row2">
            <div className="col-md-10 offset-md-1">
              <div className="contact_inner">
                <div className="row">
                  <div className="col-md-10">
                    <div className="contact_form_inner">
                      <form onSubmit={handleSubmit} className="nl-form">
                        <div className="contact_field">
                          <h3>Contact Us</h3>
                          <p>
                            Feel free to contact us any time. We will get back
                            to you as soon as we can!
                          </p>
                          <div className="flexFields">
                            <input
                              type="text"
                              name="name"
                              className="form-control form-group"
                              placeholder="Name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                            <input
                              type="email"
                              name="email"
                              className="form-control form-group"
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                            <input
                              type="text"
                              name="phone"
                              className="form-control form-group"
                              placeholder="Phone Number"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                            />
                            <textarea
                              name="message"
                              className="form-control form-group"
                              placeholder="Message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                            ></textarea>
                            <button
                              type="submit"
                              className="contact_form_submit"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="right_conatct_social_icon d-flex align-items-end">
                      <div className="socil_item_inner d-flex">
                        <li>
                          <a href="#!">
                            <i className="fab fa-facebook-square">fb</i>
                          </a>
                        </li>
                        <li>
                          <a href="#!">
                            <i className="fab fa-instagram">ins</i>
                          </a>
                        </li>
                        <li>
                          <a href="#!">
                            <i className="fab fa-twitter"></i>
                          </a>
                        </li>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="contact_info_sec">
                  <h4>Contact Info</h4>
                  <div className="d-flex info_single align-items-center">
                    <i className="fas fa-headset"></i>
                    <span> <IoIosCall className="iconPhone" /> +91 94913 01258</span> <br />
                    <span> <IoIosCall className="iconPhone" /> +91 81426 16767</span>
                  </div>
                  <div className="d-flex info_single align-items-center">
                    <i className="fas fa-envelope-open-text"></i>
                     <span> <HiOutlineMail className="iconPhone" /> info@tsaritservices.com</span>
                  </div>
                  <div className="d-flex info_single align-items-center">
                    <i className="fas fa-map-marked-alt"></i>
                    <span>
                     Visit Our Website : <a href="https://tsaritservices.com" style={{color:'#fff'}}>www.tsaritservices.com</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ContactUs;
