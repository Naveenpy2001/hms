import React, { useState } from 'react';
import axios from 'axios';

import { API_URL } from '../../API';


const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    day: '',
    month: '',
    year: '',
    time: '',
    period: 'AM',
    reason: '',
    email:''

  });
  const [isSuccess, setIsSuccess] = useState(null); 
  const [showPopup, setShowPopup] = useState(false); 

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() + i).toString());
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { patientName, day, month, year, time, period, reason } = formData;
    
    if (patientName && day && month && year && time && reason) {
      try {
        const response = await axios.post(`${API_URL}/api/appointments`, formData); // Replace with your actual API endpoint
        if (response.status === 200) {
          setIsSuccess(true);
       
        } else {
          setIsSuccess(false);
        }
        console.log(formData);
           
           setFormData(
            {
                patientName:'',
                email:'',
                day:'',
                period:'',
                time:'',
                month:'',
                reason:'',
                year:''
                
            }
        )
        
      } catch (error) {
        setIsSuccess(false);
      }
      setShowPopup(true);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setIsSuccess(null);
  };

  return (
    <>
    <div className="conatinerAppointmentForm">
    <div className="hsp-appointment-form">
      <h2 className="hsp-form-title">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="hsp-form">
        <div className="hsp-form-group">
          <label htmlFor="patientName" className="hsp-label">Patient Name :</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            className="hsp-select"
            placeholder="Enter patient name"
            required
          />
        </div>

        <div className="hsp-form-group">
          <label htmlFor="patientName" className="hsp-label">Email :</label>
          <input
            type="email"
            id="patientName"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="hsp-select"
            placeholder="Enter patient name"
            required
          />
        </div>
        

        <div className="hsp-form-group">
          <label htmlFor="date" className="hsp-label">Date :</label>
          <div className="hsp-date-dropdowns">
            <select name="day" value={formData.day} onChange={handleChange} className="hsp-select" required>
              <option value="">Day</option>
              {days.map((day, index) => (
                <option key={index} value={day}>{day}</option>
              ))}
            </select>

            <select name="month" value={formData.month} onChange={handleChange} className="hsp-select" required>
              <option value="">Month</option>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>

            <select name="year" value={formData.year} onChange={handleChange} className="hsp-select" required>
              <option value="">Year</option>
              {years.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="hsp-form-group">
          <label htmlFor="time" className="hsp-label">Time :</label>
          <div className="hsp-time-dropdowns">
            <select name="time" value={formData.time} onChange={handleChange} className="hsp-select" required>
              <option value="">Hour</option>
              {hours.map((hour, index) => (
                <option key={index} value={hour}>{hour}</option>
              ))}
            </select>

            <select name="minute" value={formData.minute} onChange={handleChange} className="hsp-select" required>
              <option value="">Minutes</option>
              {minutes.map((minute, index) => (
                <option key={index} value={minute}>{minute}</option>
              ))}
            </select>

            <select name="period" value={formData.period} onChange={handleChange} className="hsp-select" required>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>

        <div className="hsp-form-group">
          <label htmlFor="reason" className="hsp-label">Reason for Visit :</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="hsp-textarea"
            placeholder="Enter reason for visit"
            required
          />
        </div>

        <button type="submit" className="hsp-submit-btn">Submit Appointment</button>
      </form>

      {/* Popup for success or failure */}
      {showPopup && (
        <div className="hsp-popup">
          <div className="hsp-popup-content">
            {isSuccess ? (
              <div >
                <p className="hsp-popup-message success"> Appointment submitted successfully!</p>
                <p className='capitalize emailSendMsg'>
                    Confirmation mail via send to you email.!
                </p>

              </div>
            ) : (
              <div className="hsp-popup-message error">Failed to submit appointment. Please try again.</div>
            )}
            <button onClick={closePopup} className="hsp-close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default AppointmentForm;
