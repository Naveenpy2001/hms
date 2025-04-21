import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import '../../css/Profile.css';

import { FaArrowRightLong } from "react-icons/fa6"; 


import { API_URL } from "../../API";

const HospitalData = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [hospitalImages, setHospitalImages] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [aboutHospital, setAboutHospital] = useState("");

  // States to toggle Lab and Pharmacy tab visibility
  const [showLabTab, setShowLabTab] = useState(true);
  const [showPharmacyTab, setShowPharmacyTab] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/get/api/`)
      .then((response) => {
        const data = response.data;
        setProfilePhoto(data.profilePhoto);
        setFirstName(data.firstname);
        setLastName(data.lastname);
        setEmail(data.emailid);
        setPhone(data.phonenumber);
        setAddress(data.address);
        setPassword(data.password);
        setConfirmPassword(data.repetepassword);
        setHospitalName(data.hospitalname);
        setAboutHospital(data.aboutHospital);
        const existingImages = Array.isArray(data.hospitalImages) ? data.hospitalImages : [];
        setHospitalImages(existingImages);
        setImageCount(existingImages.length);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "firstName") setFirstName(value);
    if (name === "lastName") setLastName(value);
    if (name === "email") setEmail(value);
    if (name === "phone") setPhone(value);
    if (name === "address") setAddress(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    if (name === "hospitalName") setHospitalName(value);
    if (name === "aboutHospital") setAboutHospital(value);
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = files.length + hospitalImages.length;

    if (totalImages > 4) {
      setErrorMessage("You can only upload up to 4 images.");
    } else {
      const newImages = files.map(file => URL.createObjectURL(file));
      setHospitalImages([...hospitalImages, ...newImages]);
      setImageCount(totalImages);
      setErrorMessage("");
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = hospitalImages.filter((_, i) => i !== index);
    setHospitalImages(updatedImages);
    setImageCount(updatedImages.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("profilePhoto", profilePhoto);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("hospitalName", hospitalName);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("aboutHospital", aboutHospital);

    hospitalImages.forEach((image, index) => {
      formData.append(`hospitalImage${index + 1}`, image);
    });

    axios
      .post(API_URL, formData)
      .then((response) => {
        console.log("Success:", response.data);
        alert("Data submitted successfully!");
      })
      .catch((error) => console.error("Error:", error));
  };




  useEffect(() => {
    // Fetch the initial values for the checkboxes from the backend
    const fetchTabSettings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tab-settings`, {
          headers: {
            
          },
        });
        setShowLabTab(response.data.showLabTab);
        setShowPharmacyTab(response.data.showPharmacyTab);
      } catch (error) {
        console.error("Error fetching tab settings:", error);
      }
    };
    fetchTabSettings();
  }, []);


  const handleTabToggle = async (tabType, value) => {
    try {
      
      const response = await axios.post(
        `${API_URL}/api/update-tab-settings`,
        {
          tabType, // 'lab' or 'pharmacy'
          value, // true or false
        },
        {
          headers: {
            
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log(`Successfully updated ${tabType} tab to ${value}`);
      }
    } catch (error) {
      console.error(`Error updating ${tabType} tab:`, error);
    }
  };

  const handleLabTabChange = () => {
    const updatedValue = !showLabTab;
    setShowLabTab(updatedValue);
    handleTabToggle("lab", updatedValue);
  };

  const handlePharmacyTabChange = () => {
    const updatedValue = !showPharmacyTab;
    setShowPharmacyTab(updatedValue);
    handleTabToggle("pharmacy", updatedValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <section className="hospital-data-section">
            <h2>Personal Information</h2>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={handleInputChange}
                className="hospital-data-input"
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={handleInputChange}
                className="hospital-data-input"
              />
            </label>
            <label>
              Hospital Name:
              <input
                type="text"
                name="hospitalName"
                value={hospitalName}
                onChange={handleInputChange}
                className="hospital-data-input"
              />
            </label>
            <label>
              About the Hospital:
              <textarea
                name="aboutHospital"
                value={aboutHospital}
                onChange={handleInputChange}
                className="hospital-data-input"
              />
            </label>
          </section>
        );
      case "contact":
        return (
          <section className="hospital-data-section">
            <h2>Contact Information</h2>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className="hospital-data-input"
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={phone}
                onChange={handleInputChange}
                className="hospital-data-input"
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={address}
                onChange={handleInputChange}
                className="hospital-data-input"
              />
            </label>
          </section>
        );
      case "password":
        return (
          <section className="hospital-data-section">
            <h2>Password</h2>
            <label>
              Password:
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                className="hospital-data-input"
              />
            </label>
            <label>
              Confirm Password:
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                className="hospital-data-input"
              />
            </label>
          </section>
        );
      case "images":
        return (
          <>
          <section className="hospital-data-section">
          <div>
          <h2>Upload Profile Photo</h2>
            <input type="file"  className="hospital-data-input"/>
          </div>
            
            <h2>Upload Images</h2>
            <input
              type="file"
              name="hospitalImages"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="hospital-data-input"
            />
            <p>{imageCount} / 4 images uploaded</p>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="hospital-data-images">
              {hospitalImages.map((img, index) => (
                <div key={index} className="hospital-data-image-container">
                  <img
                    src={img}
                    alt={`Hospital ${index}`}
                    className="hospital-data-image"
                  />
                  <button
                    type="button"
                    className="hospital-data-remove-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </section>
          </>
        );
      case "customize":
        return (
          <section className="hospital-data-section">
            <h2>Customize Tabs</h2>
            <label class="switch flex" >
              <input
                type="checkbox"
                checked={showLabTab}
                onChange={handleLabTabChange}
              />
              <span class="slider"></span>
              Show Lab Tab
            </label>
            <br />
            <label class="switch flex">
              <input
                type="checkbox"
                checked={showPharmacyTab}
                onChange={handlePharmacyTabChange}
              />
              <span class="slider"></span>
              Show Pharmacy Tab
            </label>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="hospital-data-container">
      <div className="hospital-data-tabs">
        <button onClick={() => setActiveTab("personal")}>Personal</button>
        <button onClick={() => setActiveTab("contact")}>Contact</button>
        <button onClick={() => setActiveTab("password")}>Password</button>
        <button onClick={() => setActiveTab("images")}>Images</button>
        <button onClick={() => setActiveTab("customize")}>Customize</button>
      </div>
      {renderTabContent()}

       <button className="hospital-data-button" type="submit">
         Submit
       </button>
       <center>
       <a href="/HospitalProfile" className="profileVisit">
         Hospital Profile <FaArrowRightLong />
       </a>
       </center>

    </div>
  );
};

export default HospitalData;
