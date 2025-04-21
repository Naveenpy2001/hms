import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../API";
import "../../css/Lab.css";

const Pharmacy = () => {
  const [searchId, setSearchId] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);
  const [givenMedicines, setGivenMedicines] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [filterId, setFilterId] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filteredGivenMedicines, setFilteredGivenMedicines] = useState([]);

  console.log("Prescribed Medicines:", prescribedMedicines);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/patients/${searchId}/`
      );
      console.log(response.data);
      const data = response.data;

      if (data) {
        setPatientDetails({
          id: data.id,
          name: `${data.first_name} ${data.last_name}`,
          phone: data.phone,
          diseases: data.disease,
        });

        // Ensure prescribedMedicines is always an array
        setPrescribedMedicines(Array.isArray(data.tablets) ? data.tablets : []);
      } else {
        alert("No patient found with this ID or phone number.");
        setPatientDetails(null);
        setPrescribedMedicines([]);
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
      alert("Failed to fetch patient data. Please try again.");
    }
  };

  const handleGiveMedicine = () => {
    if (patientDetails) {
      const givenData = {
        patientId: patientDetails.id,
        tablets: (prescribedMedicines || []).map((medicine) => ({
          name: medicine.name,
          count: medicine.count || 0, // Handle undefined count
          price: medicine.price || 0, // Handle undefined price
        })),
      };
      setGivenMedicines((prev) => [...prev, givenData]);
      alert("Medicines given successfully.");
    } else {
      alert("No patient details available. Please search for a patient first.");
    }
  };

  const fetchPDF = async (patientId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/doctorview/${patientId}/`,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bill_${patientId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error fetching PDF:", error);
      alert("Failed to fetch bill PDF. Please try again.");
    }
  };

  const handleFilter = () => {
    const filtered = givenMedicines.filter((given) => {
      const matchesIdOrPhone =
        given.patientId === filterId ||
        (given.patientDetails && given.patientDetails.phone === filterId);
      const matchesDate = filterDate
        ? new Date(given.date).toISOString().split("T")[0] === filterDate
        : true;
      return matchesIdOrPhone && matchesDate;
    });
    setFilteredGivenMedicines(filtered);
  };

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
    if (tabIndex === 2) {
      handleFilter();
    }
  };

  return (
    <div className="pharmacy-container">
      <div className="billing-navigation">
        <button
          className={`dct-tab-button ${activeTab === 1 ? "active" : ""}`}
          onClick={() => handleTabChange(1)}
        >
          Give Medicines
        </button>
        <button
          className={`dct-tab-button ${activeTab === 2 ? "active" : ""}`}
          onClick={() => handleTabChange(2)}
        >
          Given Medicines
        </button>
      </div>

      {activeTab === 1 && (
        <div>
          <h1 className="pharmacy-h1">Give Medicines</h1>
          <div className="pharmacy-form-group flex">
            <label className="pharmacy-label">
              Search by Patient ID or Phone:
            </label>
            <input
              type="text"
              className="pharmacy-input"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              type="button"
              className="pharmacy-button"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {patientDetails && (
            <div>
              <h2>Patient Details:</h2>
              <p>
                <strong>Name:</strong> {patientDetails.name}
              </p>
              <p>
                <strong>Phone:</strong> {patientDetails.phone}
              </p>
              <p>
                <strong>Diseases:</strong> {patientDetails.diseases}
              </p>

              <h2>Prescribed Medicines:</h2>
              <table className="pharmacy-table">
                <thead>
                  <tr>
                    <th>Medicine Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {prescribedMedicines?.map((medicine, index) => {
                    
                    return (<tr key={index}>
                      <td>{medicine.name}</td>
                      <td>{medicine.count || 0}</td>
                    </tr> )
})}
<div>
<label htmlFor="total">Total : </label>
<input type="text" name="" id="total" placeholder="total amount" />
</div>
                </tbody>
              </table>
              <button
                type="button"
                className="pharmacy-button"
                onClick={handleGiveMedicine}
              >
                Give Medicines
              </button>
              <button
                className="pharmacy-button"
                onClick={() => fetchPDF(patientDetails.id)}
              >
                Download Bill
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 2 && (
        <div>
          <h2 className="pharmacy-h2">Given Medicines</h2>
          <div className="pharmacy-form-group">
            <label>Search by ID or Phone No.:</label>
            <input
              type="text"
              className="pharmacy-input"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
            />
            <label>Filter by Date:</label>
            <input
              type="date"
              className="pharmacy-input"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <button
              type="button"
              className="pharmacy-button"
              onClick={handleFilter}
            >
              Search
            </button>
          </div>

          <table className="pharmacy-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Medicine Names</th>
                <th>Total Quantity</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(filterId || filterDate
                ? filteredGivenMedicines
                : givenMedicines
              )?.map((given, index) => (
                <tr key={index}>
                  <td>{given.patientId}</td>
                  <td>
                    {(given.medicines || []).map((m) => m.name).join(", ")}
                  </td>
                  <td>
                    {(given.medicines || []).reduce(
                      (sum, m) => sum + (m.count || 0),
                      0
                    )}
                  </td>
                  <td>
                    {(given.medicines || []).reduce(
                      (sum, m) => sum + (m.price || 0) * (m.count || 0),
                      0
                    )}
                  </td>
                  <td>
                    <button
                      className="pharmacy-button"
                      onClick={() => fetchPDF(given.patientId)}
                    >
                      Download Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
