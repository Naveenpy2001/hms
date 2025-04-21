import React from "react";
import { Routes,Route } from "react-router-dom";
import DashboardHMS from "./Dashboard/dashboard";
import Login from "./Dashboard/Login";
import Register from "./Dashboard/Register";
import ForgotPswd from "./Dashboard/components/ForgotPswd";

import IndexPage from "./home/IndexPage";
import Services from "./home/HomeComponents/Services";


import ContactUs from "./home/HomeComponents/ContactUSMain";
import AboutUs from "./home/HomeComponents/AboutUsMain";
import PrivateRoute from './home/HomeComponents/PrivateRoute';
import ProtectedRoute from './Dashboard/ProtectedRoute';

import DashboardHms from "./Dashboard-hms";
import LoginDashboard from "./LoginDashboard";

import HospitalProfile from "./Dashboard/components/HospitalProfile";


const App = () => {
  return (
    <>

      <Routes >
        <Route path="/" element={<IndexPage />} />
        
        <Route path="/dashboard" element={<DashboardHMS />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pswd" element={<ForgotPswd />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/AboutUs" element={<AboutUs />} />


        <Route path='/AdminLogin' element={<LoginDashboard />} />
        <Route path="/Admin" element={<DashboardHms />} />

        <Route path='/HospitalProfile' element={<HospitalProfile />} />
      </Routes>

    </>
  );
};

export default App;
