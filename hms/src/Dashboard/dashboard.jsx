import React, { useState, useEffect } from "react";
import "../css/dashboard.css";
import { FaBars } from "react-icons/fa";
import Dashboard from "./components/Dashboard";
import PatientRegistration from "./components/PatientRegistration";
import DoctorView from "./components/DoctorView";
import MedicalTests from "./components/MedicalTests";
import MedicalPrescription from "./components/MedicalPrescription";
import Billing from "./components/Billing";
import HospitalData from "./components/HospitalData";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Lab from "./components/Lab";
import Pharmacy from "./components/Pharmacy";

import HMS from "../media/HMS-Transparent.png";

import { API_URL } from "../API";

import { MdArrowDropDown } from "react-icons/md";

function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userData, setUserData] = useState({});
  const [isPaid, setIsPaid] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [isLabEnabled, setIsLabEnabled] = useState(true);
  const [isPharmacyEnabled, setIsPharmacyEnabled] = useState(true);

  const navigate = useNavigate();



  const UserDataFetch = async () => {
    try {
      const token = localStorage.getItem("access_token"); // Get the token from localStorage or wherever it's stored
      console.log(token);
      
     /* if (!token) {
        navigate("/login"); // Redirect to login if no token found
        return;
      }*/
      
      const response = await axios.get("http://127.0.0.1:8000/api/user/details/", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      console.log(response.data);
      setUserData(response.data);

      setIsPaid(false);
      setIsLabEnabled(true);
      setIsPharmacyEnabled(true);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    UserDataFetch();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("access_token");
    try {
      await axios.post(`${API_URL}/reactlogout`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      alert("If you want to logout, click OK.");
      console.log("Logout successful");
      navigate("/login");
    } catch (error) {
      alert("Error logging out:", error);
      console.error("Error logging out:", error);
    }
  };

  const handlePayment = () => {
    const options = {
      key: "rzp_live_oRtGw5y3RbD9MH",
      amount: userData.dueAmount * 100,
      currency: "INR",
      name: "Hospital Payment",
      description: "Test Transaction",
      handler: async function (response) {
        try {
          await axios.post(`${API_URL}/api/payment/verify`, {
            paymentId: response.razorpay_payment_id,
          });
          alert("Payment successful!");
          setIsPaid(true);
        } catch (error) {
          console.error("Error verifying payment:", error);
          alert("Error processing payment");
        }
      },
      prefill: {
        name: userData.firstname,
        email: userData.email,
        contact: userData.contact,
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const renderContent = () => {
    if (isPaid) {
      return (
        <div className="ntpd-payment-prompt">
          <h2 className="ntpd-heading">
            Please pay the bill amount to <br /> access Your Account.
          </h2>
          <p className="ntpd-amount-due">Amount Due: {userData.dueAmount}</p>
          <button className="ntpd-pay-button" onClick={handlePayment}>
            Click to Pay with Razorpay
          </button>
          <p className="ntpd-contact-us">
            If you need assistance, please{" "}
            <a href="ContactUs" className="ntpd-contact-link">
              contact us
            </a>
            .
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "Dashboard":
        return <Dashboard setActiveTab={setActiveTab} />;
      case "PatientRegistration":
        return <PatientRegistration />;
      case "DoctorView":
        return <DoctorView />;
      case "MedicalTests":
        return <MedicalTests />;
      case "MedicalPrescription":
        return <MedicalPrescription />;
      case "Billing":
        return <Billing />;
      case "HospitalData":
        return <HospitalData />;
      // case "Support":
      //   return <Support />;
      case "Lab":
        return <Lab />;
      case "Pharmacy":
        return <Pharmacy />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
        <div
          className="logo-details"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <div className="logoContainer">
            <img src={HMS} alt="HMS" width={20} />
            <span className="logo_name">TSAR-IT-HMS</span>
          </div>
        </div>
        <ul className="nav-links">
          <li>
            <button
              className={activeTab === "Dashboard" ? "active" : ""}
              onClick={() => setActiveTab("Dashboard")}
            >
              <i className="bx bx-grid-alt"></i>
              <span className="links_name">Dashboard</span>
            </button>
          </li>
          <li>
            <button
              className={activeTab === "PatientRegistration" ? "active" : ""}
              onClick={() => setActiveTab("PatientRegistration")}
            >
              <i className="bx bx-box"></i>
              <span className="links_name">Patient Registration</span>
            </button>
          </li>
          <li>
            <button
              className={activeTab === "DoctorView" ? "active" : ""}
              onClick={() => setActiveTab("DoctorView")}
            >
              <i className="bx bx-list-ul"></i>
              <span className="links_name">Doctor View</span>
            </button>
          </li>
          {isLabEnabled ? (
            <li>
              <button
                className={activeTab === "Lab" ? "active" : ""}
                onClick={() => setActiveTab("Lab")}
              >
                <i className="bx bx-test-tube"></i>
                <span className="links_name">Lab</span>
              </button>
            </li>
          ) : null}
          {isPharmacyEnabled ? (
            <li>
              <button
                className={activeTab === "Pharmacy" ? "active" : ""}
                onClick={() => setActiveTab("Pharmacy")}
              >
                <i className="bx bx-capsule"></i>
                <span className="links_name">Pharmacy</span>
              </button>
            </li>
          ) : null}
          <li>
            <button
              className={activeTab === "MedicalTests" ? "active" : ""}
              onClick={() => setActiveTab("MedicalTests")}
            >
              <i className="bx bx-pie-chart-alt-2"></i>
              <span className="links_name">Patients Tracking</span>
            </button>
          </li>
          {/* <li>
            <button
              className={activeTab === "MedicalPrescription" ? "active" : ""}
              onClick={() => setActiveTab("MedicalPrescription")}
            >
              <i className="bx bx-coin-stack"></i>
              <span className="links_name">Appointments</span>
            </button>
          </li> */}
          <li>
            <button
              className={activeTab === "Billing" ? "active" : ""}
              onClick={() => setActiveTab("Billing")}
            >
              <i className="bx bx-book-alt"></i>
              <span className="links_name">Accounts</span>
            </button>
          </li>
          {/* <li>
            <button
              className={activeTab === "HospitalData" ? "active" : ""}
              onClick={() => setActiveTab("HospitalData")}
            >
              <i className="bx bx-user"></i>
              <span className="links_name">Profile</span>
            </button>
          </li>
          { <li>
            <button
              className={activeTab === "Support" ? "active" : ""}
              onClick={() => setActiveTab("Support")}
            >
              <i className="bx bx-support"></i>
              <span className="links_name">Support</span>
            </button>
          </li> */} 
          <li className="log_out">
            <button onClick={handleLogout}>
              <i className="bx bx-log-out"></i>
              <span className="links_name">Log out</span>
            </button>
          </li>
        </ul>
      </div>
      <section className="home-section">
        <nav>
          <div className="sidebar-button">
            <div className="flexHeaderCol">
              <span className="dashboard fullWidth">
               <center > Welcome To Amma Hospital </center> <strong style={{fontWeight:'600'}}>{userData.hospitalname}</strong> 

              </span>
              <span className="dashboard smallText">

              
              </span>
            </div>

          </div>
        </nav>
        <div className="home-content">{renderContent()}</div>
      </section>
    </div>
  );
}

export default App;
