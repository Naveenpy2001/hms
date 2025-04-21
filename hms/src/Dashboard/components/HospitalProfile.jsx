import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import '../../css/HospitalProfile.css'

import AppointmentForm from "./AppointmentForm";

// const API_URL = "https://hms.tsaritservices.com/get/api/"; // Replace with your actual API URL

import { API_URL } from "../../API";

const HospitalProfile = () => {
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the hospital data from API
    axios
      .get(`${API_URL}/get/api/`)
      .then((response) => {
        setHospitalData(response.data);
        setLoading(false);
        console.log(response.data);
        
      })
      .catch((error) => {
        console.error("Error fetching hospital data:", error);
        setError("Failed to fetch hospital data.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="hsp-loading">Loading...</p>;
  }

  if (error) {
    return <p className="hsp-error">{error}</p>;
  }

  // Safeguard for missing data or hospitalImages
  const hospitalImages = hospitalData?.hospitalImages ?? [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="hsp-profile">
      <h1 className="hsp-title">{hospitalData?.hospitalname || "Hospital Name"}</h1> 

      {/* Image Slider */}
      {hospitalImages.length > 0 ? (
        <Slider {...settings} className="hsp-slider">
          {hospitalImages.map((image, index) => (
            <div key={index} className="hsp-slide">
              <img
                src={image}
                alt={`Hospital Image ${index + 1}`}
                className="hsp-image"
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p className="hsp-no-images">No images available</p>
      )}
        <br />
      {/* Hospital Information */}
      <div className="hsp-info">
        <h2 className="hsp-subtitle">About the Hospital</h2>
        <p className="hsp-about">{hospitalData?.aboutHospital || "No information available"}</p>

        <h2 className="hsp-subtitle">Contact Information</h2>
        <p className="hsp-email">Email: <strong>{hospitalData?.emailid || "No email available"}</strong></p>
        <p className="hsp-phone">Phone: <strong>{hospitalData?.phonenumber || "No phone available"}</strong></p>
        <p className="hsp-address">Address: {hospitalData?.address || "No address available"}</p>
      </div>
      <AppointmentForm />
      {/* Highlighted Section */}
      <div className="hsp-highlight">
        <h3 className="hsp-highlight-title">Why Choose Us?</h3>
        <p className="hsp-highlight-content">
          We are committed to providing the best healthcare experience with our dedicated medical professionals, state-of-the-art facilities, and patient-centered care.
        </p>
      </div>
    </div>
  );
};

export default HospitalProfile;
