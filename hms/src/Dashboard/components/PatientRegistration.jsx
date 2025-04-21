import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/patientRegister.css";

import { API_URL } from "../../API";

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    aadhar: "",
    address: "",
    gender: "",
    disease: "",
    other_disease: "",
    temparature : '',
    day: "",
    month: "",
    year: "",
    age: "",
    patientType: "",
    paymentType: "",
    amount: "",
    bed_assign : "no",
    weight:'',
    bp:''
  });


  const [loading, setLoading] = useState(false); // Loading state
  const [successData, setSuccessData] = useState(null); // Success state to hold user details

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (["day", "month", "year"].includes(name)) {
      calculateAge({ ...formData, [name]: value });
    }
  };

  const calculateAge = (data) => {
    const { day, month, year } = data;
    if (day && month && year) {
      const birthDate = new Date(year, month - 1, day);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
      setFormData((prevState) => ({
        ...prevState,
        age: calculatedAge,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      const response = await axios.post(
       ' http://127.0.0.1:8000/api/patients/',
        formData,
      );
      
      const savedUserData = response.data;
      console.log("Saved User Data:", savedUserData);
      setSuccessData({
        id: savedUserData.id,
        name: `${formData.first_name} ${formData.last_name}`,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
      });
      console.log("Form submitted successfully!",formData);
      alert("Form submitted successfully!");
    setLoading(false);
    } catch (error) {
    setLoading(false);

      alert("There was an error submitting the form!");
      console.error("There was an error submitting the form!", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };



const fetchPatientData = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/patients/`);
        console.log('data of patients : ', response.data)
    } catch (error) {
        console.error("Error fetching patient data:", error);
       
    }
};

useEffect(() => {
  fetchPatientData()
},[])

  return (
    <div className="pr-forms">
      <h1>Patient Registration Form</h1>
      {loading && <div className="loading-spinner">Submitting...</div>}

      {!successData ? (
        <form onSubmit={handleSubmit}>
          {/* Form fields for patient details */}
          <label>First name:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            className="pr-input"
          />
          <br />
          <label>Last name:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            className="pr-input"
          />
          <br />
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="pr-input"
          />
          <br />
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="pr-input"
          />
          <br />
          <label>Aadhar Number:</label>
          <input
            type="text"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleInputChange}
            className="pr-input"
          />
          <br />
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="pr-textarea"
          />
          <br />
          <label>Gender :</label> <br />
          <div className="flexStart gender">
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleInputChange}
              className="pr-radio"
            />{" "}
            Male
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleInputChange}
              className="pr-radio"
            />{" "}
            Female{" "}
            <input
              type="radio"
              name="gender"
              value="Others"
              onChange={handleInputChange}
              className="pr-radio"
            />{" "}
            Others
          </div>
          <br />
          <br />
          <label>Disease:</label>
          <select
            name="disease"
            value={formData.disease}
            onChange={handleInputChange}
            className="pr-select"
          >
            <option selected>select</option>
            <option value="Fever">Fever</option>
            <option value="Headache">Headache</option>
            <option value="Cold">Cold</option>
            <option value="Rashes">Rashes</option>
            <option value="Others">Others</option>
          </select>
          {formData.disease === "Others" && (
            <input
              type="text"
              name="other_disease"
              value={formData.other_disease}
              onChange={handleInputChange}
              className="pr-input"
              placeholder="Enter other disease"
            />
          )}
          <br />
          <label>Date of Birth:</label>
          <div className="flexCenter">
            <select
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              className="pr-select"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="pr-select"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="pr-select"
            >
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => (
                <option key={i + 1980} value={i + 1980}>
                  {i + 1980}
                </option>
              ))}
            </select>
          </div>
          <br />
          {formData.age && (
            <div>
              <label>Age:</label>
              <input
                type="text"
                value={formData.age}
                className="pr-input"
                readOnly
              />
              <br />
            </div>
          )}
          <label>Weight:</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            className="pr-input"
          />
          <br />
          <label>Blood Pressure:</label>
          <input
            type="text"
            name="bp"
            value={formData.bp}
            onChange={handleInputChange}
            className="pr-input"
          />
          <br />
          <label htmlFor="temparature">Temparature : </label>
          <input type="text" className="pr-input" name="temparature" id="temparature" value={formData.temparature} onChange={handleInputChange} />
          <br />
          <label>Mode of Patient:</label>
          <select
            name="patientType"
            value={formData.patientType}
            onChange={handleInputChange}
            className="pr-select"
          >
            <option value="" selected>Select Mode</option>
            <option value="OPD">OPD</option>
            <option value="IPD">IPD</option>
            <option value="Emergency">Emergency</option>
          </select>
          <br />
          <label>Bed Assigned:</label>
          <input
            type="radio"
            name="bed_assign"
            value="Yes"
            onChange={handleInputChange}
            className="pr-radio"
          />{" "}
          Yes
          <input
            type="radio"
            name="bed_assign"
            value="No"
            onChange={handleInputChange}
            className="pr-radio"
            checked
          />{" "}
          No
          <br />
          {formData.bed_assign === "Yes" && (
            <div>
              <label>Select Bed:</label>
              <input
                type="text"
                name="bedDetails"
                value={formData.bedDetails}
                onChange={handleInputChange}
                className="pr-input"
                placeholder="Bed details"
              />
              <br />
              <label>Bed No:</label>
              <input
                type="text"
                name="bedNo"
                value={formData.bedNo}
                onChange={handleInputChange}
                className="pr-input"
              />
              <br />
              <label>How Many Days:</label>
              <input
                type="text"
                name="bedDays"
                value={formData.bedDays}
                onChange={handleInputChange}
                className="pr-input"
                placeholder="Number of days"
              />
            </div>
          )}
          <br />
          <br />
          <label>Select Payment Type:</label>
          
            <div>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
                className="pr-select"
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="NetBanking">Net Banking</option>
                <option value="Account">Account</option>
                <option value="Reference">Reference</option>
                <option value="Insurance">Insurance</option>
                <option value="Others">Others</option>
              </select>
              <br />
              {formData.paymentType === "Cash" && (
                <div>
                  <label>Amount:</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                </div>
              )}

              {formData.paymentType === "UPI" && (
                <div>
                  <label>Amount:</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                  <br />
                  <label>UPI Transaction No:</label>
                  <input
                    type="text"
                    name="upiTransactionNo"
                    value={formData.upiTransactionNo}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                </div>
              )}

              {formData.paymentType === "NetBanking" && (
                <div>
                  <label>Amount:</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                  <br />
                  <label>Transaction ID:</label>
                  <input
                    type="text"
                    name="netBankingTransactionId"
                    value={formData.netBankingTransactionId}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                  <br />
                  <label>Screenshot:</label>
                  <input
                    type="file"
                    name="netBankingScreenshot"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        netBankingScreenshot: e.target.files[0],
                      })
                    }
                    className="pr-file"
                  />
                </div>
              )}

              {formData.paymentType === "Account" && (
                <div>
                  <label>Amount:</label>
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                  <br />
                  <label>Transaction ID:</label>
                  <input
                    type="text"
                    name="accountTransactionId"
                    value={formData.accountTransactionId}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                  <br />
                  <label>Document:</label>
                  <input
                    type="file"
                    name="accountDocument"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountDocument: e.target.files[0],
                      })
                    }
                    className="pr-file"
                  />
                </div>
              )}

              {formData.paymentType === "Reference" && (
                <div>
                  <label>Reference:</label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                </div>
              )}

              {formData.paymentType === "Insurance" && (
                <div>
                  <label>Insurance Details:</label>
                  <input
                    type="text"
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                </div>
              )}

              {formData.paymentType === "Others" && (
                <div>
                  <label>Other Payment Details:</label>
                  <input
                    type="text"
                    name="otherPayment"
                    value={formData.otherPayment}
                    onChange={handleInputChange}
                    className="pr-input"
                  />
                </div>
              )}
            </div>
          
          <br />
          <button type="submit" className="pr-button">
            Submit
          </button>
        </form>
      ) : (
        <div className="success-message">
          <h2>Registration Successful!</h2>
          <p>
            <strong>User ID:</strong> {successData.id}
          </p>
          <p>
            <strong>Name:</strong> {successData.name}
          </p>
          <p>
            <strong>Email:</strong> {successData.email}
          </p>
          <p>
            <strong>Phone:</strong> {successData.phone}
          </p>
          <p>
            <strong>Age:</strong> {successData.age}
          </p>
          <button onClick={() => setSuccessData(null)} className="pr-button">
            Register Another Patient
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientRegistration;
