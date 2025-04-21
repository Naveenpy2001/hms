import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoMdDownload } from "react-icons/io";
import FileUpload from "./fileUpload";
import "../../css/Lab.css";
import { API_URL } from "../../API";

const Lab = () => {
  // State management
  const [patientId, setPatientId] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);
  const [labTests, setLabTests] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableTests, setAvailableTests] = useState([]);
  const [newTest, setNewTest] = useState({
    testName: "",
    testDate: "",
    status: "pending",
    price: "",
  });

  // Derived state
  const filteredLabTests = labTests.filter(test => 
    test.patientId?.toString().includes(searchTerm) || 
    test.phone?.toString().includes(searchTerm)
  );

  // Data fetching
  useEffect(() => {
    fetchAvailableTests();
  }, []);

  useEffect(() => {
    if (patientDetails?.id) {
      fetchLabTests(patientDetails.id);
    }
  }, [patientDetails]);

  const fetchAvailableTests = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAvailableTests`);
      setAvailableTests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching available tests:", error);
    }
  };

  const fetchPatientData = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/${id}/`);
      setPatientDetails(response.data || null);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching patient data:", error);
      alert("Failed to fetch patient data. Please try again.");
    }
  };

  const fetchLabTests = async (patientId) => {
    try {
      const response = await axios.get(`${API_URL}/labTests?patientId=${patientId}`);
      setLabTests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching lab tests:", error);
    }
  };

  // Event handlers
  const handleTabChange = (tabIndex) => setActiveTab(tabIndex);

  const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase());

  const handleNewTestChange = (e) => {
    const { name, value } = e.target;
    setNewTest(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status) => {
    setNewTest(prev => ({ ...prev, status }));
  };

  const handleSubmitNewTest = async (e) => {
    e.preventDefault();
    if (!patientDetails) {
      alert("Please fetch patient details first");
      return;
    }

    try {
      await axios.post(`${API_URL}/labTests`, {
        ...newTest,
        patientId: patientDetails.id,
      });
      alert("Lab test added successfully!");
      setNewTest({ testName: "", testDate: "", status: "pending", price: "" });
      fetchLabTests(patientDetails.id);
    } catch (error) {
      console.error("Error adding lab test:", error);
      alert("Failed to add lab test. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (patientId) {
      await fetchPatientData(patientId);
    } else {
      alert("Please enter a valid Patient ID.");
    }
  };

  const handleDownloadPDF = async (patientId = patientDetails?.id) => {
    if (!patientId) return;
    
    try {
      const response = await axios.get(`${API_URL}/labTests/pdf/${patientId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `lab_tests_${patientId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div className="lab-container">
      <div className="lab-navigation">
        {[1, 2, 3].map(tab => (
          <button
            key={tab}
            className={`lab-tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabChange(tab)}
          >
            {["Lab Test Form", "View Lab Tests", "Submit Lab Reports"][tab - 1]}
          </button>
        ))}
      </div>

      {activeTab === 1 && (
        <form className="lab-form" onSubmit={handleSubmit}>
          <h1 className="lab-title">Lab Test Form</h1>
          
          <div className="lab-form-group">
            <label className="lab-label">Patient ID:</label>
            <input
              type="text"
              className="lab-input"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            />
            <button type="submit" className="lab-fetch-button">
              Fetch Patient
            </button>
          </div>

          {patientDetails && (
            <div className="patient-details">
              <h2 className="lab-details-title">Patient Details</h2>
              <p><strong>Name:</strong> {patientDetails.first_name} {patientDetails.last_name}</p>
              <p><strong>Phone:</strong> {patientDetails.phone}</p>
              <p><strong>Disease:</strong> {patientDetails.disease}</p>
              <p><strong>Test Required:</strong> {patientDetails.selectedTest === "" ? 'Not Required' : patientDetails.selectedTest}</p>
            </div>
          )}

          <h2 className="lab-add-title">Lab Test Results</h2>

          <div className="lab-form-group">
            <label className="lab-label">Test Date:</label>
            <input
              type="date"
              className="lab-input"
              name="testDate"
              value={newTest.testDate}
              onChange={handleNewTestChange}
              
            />
          </div>

          <div className="lab-form-group">
            <label className="lab-label">Status:</label>
            <div className="status-options">
              {["pending", "completed"].map(status => (
                <label key={status}>
                  <input
                    type="radio"
                    name="status"
                    checked={newTest.status === status}
                    onChange={() => handleStatusChange(status)}
                  />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="lab-form-group">
            <label className="lab-label">Price:</label>
            <input
              type="number"
              className="lab-input"
              name="price"
              value={newTest.price}
              onChange={handleNewTestChange}
              min="0"
              step="0.01"
              
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="lab-submit-button" onClick={handleSubmitNewTest}>
              Submit Lab Test
            </button>
            {patientDetails && (
              <button type="button" className="lab-download-button" onClick={handleDownloadPDF}>
                <IoMdDownload /> Download Lab Test
              </button>
            )}
          </div>
        </form>
      )}

      {activeTab === 2 && (
        <div className="lab-results-container">
          <h2 className="lab-results-title">Lab Test Results</h2>
          
          <div className="lab-filter-container">
            <input
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by Patient ID or Phone"
              className="lab-search-input"
            />
            <button onClick={() => setSearchTerm("")} className="lab-clear-filters-button">
              Clear Filters
            </button>
          </div>

          <table className="lab-table">
            <thead>
              <tr>
                {["Test Name", "Patient ID", "Test Date", "Status", "Price", "Actions"].map(header => (
                  <th key={header} className="lab-th">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLabTests.map(test => (
                <tr key={test.id}>
                  <td className="lab-td">{test.testName}</td>
                  <td className="lab-td">{test.patientId}</td>
                  <td className="lab-td">{new Date(test.testDate).toLocaleDateString()}</td>
                  <td className="lab-td">
                    <span className={`status-badge ${test.status}`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="lab-td">${parseFloat(test.price).toFixed(2)}</td>
                  <td className="lab-td">
                    <button 
                      className="lab-download-button"
                      onClick={() => handleDownloadPDF(test.patientId)}
                    >
                      <IoMdDownload /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 3 && (
        <div className="lab-upload-container">
          <h1>Upload Lab Reports</h1>
          <FileUpload />
        </div>
      )}
    </div>
  );
};

export default Lab;