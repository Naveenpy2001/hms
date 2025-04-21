import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Assuming you store JWT token in localStorage

  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/login" />;
  }else{
    
  }
 

  // If authenticated, render the child components (protected page)
  return children;
};

export default ProtectedRoute;
