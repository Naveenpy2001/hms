
import React, { useState, useEffect } from "react";
import axios from "axios";

function MedicalTests() {
  const [data, setData] = useState({
    TodaypatientCount: 0,
    TotalpatientCount: 0,
    patientTracking: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false); // Track API request status
  const [error, setError] = useState(""); // Store API errors

  const [patients,setPatients] = useState([])

  useEffect(() => {

    fetchPatientData();
  }, []); // Depend on token to avoid redundant calls

  const fetchPatientData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/patients/");
      setPatients(response.data)
      console.log("API Response:", response.data);

      const patients =
        response.data.patientTracking ||
        response.data.patients ||
        response.data.data ||
        [];

      console.log("Extracted Patients:", patients);

      setData({
        TodaypatientCount: response.data.TodaypatientCount || 0,
        TotalpatientCount: response.data.TotalpatientCount || 0,
        patientTracking: patients,
      });

      setFilteredPatients(patients); // Initialize filtered patients
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch patient data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterPatients(term, filterDate);
  };

  const handleDateFilterChange = (e) => {
    const date = e.target.value;
    setFilterDate(date);
    filterPatients(searchTerm, date);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilteredPatients(data.patientTracking);
  };

  const filterPatients = (term, dateFilter) => {
    const filtered = data.patientTracking.filter((patient) => {
      const matchesSearch =
        patient.id?.toString().includes(term) ||
        patient.firstName?.toLowerCase().includes(term) ||
        patient.disease?.toLowerCase().includes(term) ||
        patient.email?.toLowerCase().includes(term) ||
        patient.phoneNumber?.includes(term) ||
        patient.aadharNumber?.includes(term);

      const matchesDate = !dateFilter || patient.date === dateFilter;

      return matchesSearch && matchesDate;
    });

    setFilteredPatients(filtered);
  };

  return (
    <div>
      <h1>Patients Data</h1>

      {loading && <p>Loading data...</p>}
      {error && <p className="error">{error}</p>}

      {selectedPatient ? (
        <div className="patient-details">
          <button onClick={() => setSelectedPatient(null)} className="back-button">
            Back
          </button>
          <h2>Patient Details</h2>
          <p><strong>ID:</strong> {selectedPatient.id}</p>
          <p><strong>First Name:</strong> {selectedPatient.first_name}</p>
          <p><strong>Last Name:</strong> {selectedPatient.last_name}</p>
          <p><strong>Email:</strong> {selectedPatient.email}</p>
          <p><strong>Disease:</strong> {selectedPatient.disease}</p>
          <p><strong>Phone Number:</strong> {selectedPatient.phoneNumber}</p>
          <p><strong>Visits:</strong> {selectedPatient.visitsCount} times</p>
        </div>
      ) : (
        <>
          <div className="tracking-summary">
            <p>Today's Patients: {data.TodaypatientCount}</p>
            <p>Total Patients: {data.TotalpatientCount}</p>
          </div>

          <div className="tracking-container">
            <div className="filter-container">
              <input
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name, disease, or age..."
                className="search-input"
              />

              <input
                type="date"
                value={filterDate}
                onChange={handleDateFilterChange}
                className="search-input date"
              />

              <button onClick={handleClearFilters} className="clear-filters-button">
                Clear Filters
              </button>
            </div>

            <table className="tracking-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Aadhar Number</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>Date of Birth</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient) => (
                    <tr key={patient.id} onClick={() => setSelectedPatient(patient)} style={{ cursor: "pointer" }}>
                      <td>{patient.id}</td>
                      <td>{patient.first_name} {patient.last_name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.aadhar}</td>
                      <td>{patient.address}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.day}-{patient.month}-{patient.year}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9">No patients found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default MedicalTests;
