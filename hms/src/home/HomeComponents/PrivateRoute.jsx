import React from 'react';
import { Navigate } from 'react-router-dom';

// Custom PrivateRoute component
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // If no token, redirect to login page
    if (!token) {
        return <Navigate to="/Login" replace />;
    }

    // If token exists, render the child components (i.e., the protected routes)
    return children;
};

export default PrivateRoute;
