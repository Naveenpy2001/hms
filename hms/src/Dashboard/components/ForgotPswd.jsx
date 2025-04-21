import React, { useState } from 'react';
import axios from 'axios';
import '../../css/forgot.css';
import { useNavigate } from "react-router-dom";


import { API_URL } from '../../API';

const ForgotPswd = ({setForgot}) => {
    const [step, setStep] = useState(1); // Track form step
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    // Handle email submission
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/forgot-password/`, { email });   
            setStep(2); // Move to OTP verification step
            console.log(response.data);
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again.');
        }
    };

    // Handle OTP verification
    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/verify-otp/`, {  email, otp });
            setStep(3); // Move to password reset step
            console.log(response.data);
            
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Invalid OTP. Please try again.');
        }
    };

    // Handle password reset
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            await axios.post(`${API_URL}/api/reset-password/`, {  email, password });
            alert('Password reset successfully!');
            // Optionally, redirect to login or another page
           navigate('/Login')
           setForgot(false)
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className='flex-center'>
            <div className="form-container">
                <div className="logo-container">
                    Forgot Password
                </div>

                {step === 1 && (
                    <form className="form" onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button className="form-submit-btn" type="submit">Send OTP</button>
                    </form>
                )}

                {step === 2 && (
                    <form className="form" onSubmit={handleOtpSubmit}>
                        <div className="form-group">
                            <label htmlFor="otp">Enter OTP</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                placeholder="Enter the OTP"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>

                        <button className="form-submit-btn" type="submit">Verify OTP</button>
                    </form>
                )}

                {step === 3 && (
                    <form className="form" onSubmit={handlePasswordReset}>
                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter new password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button className="form-submit-btn" type="submit">Reset Password</button>
                    </form>
                )}

                <p className="signup-link">
                    Don't have an account?
                    <a href="/Register" className="signup-link link"> Sign up now</a>
                </p>
            </div>
        </div>
    );
};

export default ForgotPswd;
