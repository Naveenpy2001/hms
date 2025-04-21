import React, { useState, useEffect } from "react";
import axios from "axios";

const DoctorView = () => {
  // Patient state
  const [patientId, setPatientId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    disease: "",
    age: "",
  });
  const [patientsList, setPatientsList] = useState([]);
  const [completedPatients, setCompletedPatients] = useState([]);
  
  // Treatment state
  const [tablets, setTablets] = useState([]);
  const [injectionRequired, setInjectionRequired] = useState(false);
  const [injectionDetails, setInjectionDetails] = useState({
    name: "",
    size: "",
    dosage: "",
  });
  const [ointmentRequired, setOintmentRequired] = useState(false);
  const [ointmentDetails, setOintmentDetails] = useState({
    name: "",
    dosage: "",
  });
  const [tonicRequired, setTonicRequired] = useState(false);
  const [tonicDetails, setTonicDetails] = useState({
    name: "",
    dosage: "",
  });
  
  // Test state
  const [selectedTest, setSelectedTest] = useState("");
  const [customTest, setCustomTest] = useState("");
  const [doctorAdvice, setDoctorAdvice] = useState("");
  
  // UI state
  const [activeTab, setActiveTab] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 7;

  // Options state
  const [medicineOptions] = useState(['citrizen', 'dolo', "Other"]);
  const [testOptions, setTestOptions] = useState([]);
  const [injectionOptions, setInjectionOptions] = useState([]);
  const [ointmentOptions, setOintmentOptions] = useState([]);
  const [tonicOptions, setTonicOptions] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchPatients();
    fetchOptions();
    fetchCompleted();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/pending/`);
      setPatientsList(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchCompleted = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/patients/today_completed/");
      setCompletedPatients(res.data);
    } catch (error) {
      console.error('Error fetching completed patients:', error);
    }
  };

  const fetchOptions = async () => {
    try {
      const [testRes, injectionRes, ointmentRes, tonicRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/tests`),
        axios.get(`http://localhost:8080/api/injections`),
        axios.get(`http://localhost:8080/api/ointments`),
        axios.get(`http://localhost:8080/api/tonics`),
      ]);
      setTestOptions(testRes.data);
      setInjectionOptions(injectionRes.data);
      setOintmentOptions(ointmentRes.data);
      setTonicOptions(tonicRes.data);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const fetchPatientDetails = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/patients/${id}/`);
      const data = response.data;

      if (data) {
        setPatientDetails({
          name: `${data.first_name} ${data.last_name}`,
          disease: data.disease,
          age: data.age,
        });
        setPatientId(id);
        setActiveTab(2);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  const handleTabChange = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleTabletCountChange = (count) => {
    const tabletCount = parseInt(count) || 0;
    const updatedTablets = Array.from({ length: tabletCount }, () => ({
      name: "",
      count: "",
      dosage: "",
      customMedicine: "",
    }));
    setTablets(updatedTablets);
  };

  const handleTabletChange = (index, field, value) => {
    const updatedTablets = [...tablets];
    updatedTablets[index][field] = value;
    setTablets(updatedTablets);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Format injection details correctly
    const formattedInjectionDetails = injectionRequired ? {
      name: injectionDetails.name === "Other" ? injectionDetails.customName : injectionDetails.name,
      size: injectionDetails.size,
      dosage: injectionDetails.dosage
    } : null;
  
    // Format ointment details correctly
    const formattedOintmentDetails = ointmentRequired ? {
      name: ointmentDetails.name === "Other" ? ointmentDetails.customName : ointmentDetails.name,
      dosage: ointmentDetails.dosage
    } : null;
  
    // Format tonic details correctly
    const formattedTonicDetails = tonicRequired ? {
      name: tonicDetails.name === "Other" ? tonicDetails.customName : tonicDetails.name,
      dosage: tonicDetails.dosage
    } : null;
  
    const formData = {
      patientId,
      disease: patientDetails.disease,
      tablets: tablets.map((t) => ({
        name: t.name === "Other" ? t.customMedicine : t.name,
        count: t.count,
        dosage: t.dosage
      })),
      injectionRequired: injectionRequired, // Ensure boolean
      injectionDetails: injectionRequired ? {
        name: injectionDetails.name === "Other" ? injectionDetails.customName : injectionDetails.name,
        size: injectionDetails.size,
        dosage: injectionDetails.dosage } : null,
      ointmentRequired: Boolean(ointmentRequired), // Ensure boolean
      ointmentDetails: formattedOintmentDetails,
      tonicRequired: Boolean(tonicRequired), // Ensure boolean
      tonicDetails: formattedTonicDetails,
      selectedTest: selectedTest === "Other" ? customTest : selectedTest,
      doctorAdvice,
      status: "Completed",
    };
  
    console.log("Form Data to be sent:", formData);
  
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/patients/${patientId}/`,
        formData
      );
      
      // Reset form after successful submission
      setTablets([]);
      setInjectionRequired(false);
      setInjectionDetails({ name: "", size: "", dosage: "", customName: "" });
      setOintmentRequired(false);
      setOintmentDetails({ name: "", dosage: "", customName: "" });
      setTonicRequired(false);
      setTonicDetails({ name: "", dosage: "", customName: "" });
      setSelectedTest("");
      setCustomTest("");
      setDoctorAdvice("");
      
      // Refresh data
      fetchPatients();
      fetchCompleted();
      setActiveTab(3);
      
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patientsList.slice(indexOfFirstPatient, indexOfLastPatient);

  const nextPage = () => {
    if (currentPage < Math.ceil(patientsList.length / patientsPerPage)) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const downloadPdf = async (patientId) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/patient/pdf/${patientId}/`, {
      responseType: 'blob', // 👈 Tells axios to treat the response as binary data
    });

    const file = new Blob([response.data], { type: 'application/pdf' });

    // Create a temporary download link
    const fileURL = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', `patient_${patientId}_report.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert("Failed to download the PDF.");
  }
};

  return (
    <div className="dct-view">
      <h1 className="dct-heading">Doctor View</h1>

      <div className="billing-navigation">
        <button
          className={`dct-tab-button ${activeTab === 1 ? "active" : ""}`}
          onClick={() => handleTabChange(1)}
        >
          Patients List
        </button>
        <button
          className={`dct-tab-button ${activeTab === 2 ? "active" : ""}`}
          onClick={() => handleTabChange(2)}
        >
          View/Update Patient Details
        </button>
        <button
          className={`dct-tab-button ${activeTab === 3 ? "active" : ""}`}
          onClick={() => handleTabChange(3)}
        >
          Completed Patients
        </button>
      </div>

      {activeTab === 1 && (
        <div className="dct-tab-content">
          <h2 className="dct-subheading">Today's Patients List</h2>
          <table className="dct-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient Name</th>
                <th>Age</th>
                <th>Disease</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{`${patient.first_name} ${patient.last_name}`}</td>
                  <td>{patient.age}</td>
                  <td>{patient.disease}</td>
                  <td>{patient.status}</td>
                  <td>
                    <button
                      className="dct-view-button"
                      style={{ backgroundColor: patient.status === 'Pending' ? 'red' : 'green' }}
                      onClick={() => fetchPatientDetails(patient.id)}
                    >
                      {patient.status === 'Pending' ? 'Treat' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-controls">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button 
              onClick={nextPage} 
              disabled={indexOfLastPatient >= patientsList.length}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <form onSubmit={handleSubmit} className="dct-form">
          <h2 className="dct-subheading">Patient Treatment</h2>

          <div className="dct-form-group">
            <label className="dct-label">Patient ID:</label>
            <input
              type="text"
              className="dct-input"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter patient ID"
            />
            <button
              type="button"
              onClick={() => fetchPatientDetails(patientId)}
              className="dct-fetch-button"
            >
              Fetch Patient
            </button>
          </div>

          <div className="dct-form-group">
            <label className="dct-label">Patient Name:</label>
            <input
              type="text"
              className="dct-input"
              value={patientDetails.name}
              readOnly
            />
          </div>
          
          <div className="dct-form-group">
            <label className="dct-label">Disease:</label>
            <input
              type="text"
              className="dct-input"
              value={patientDetails.disease}
              readOnly
            />
          </div>
          
          <div className="dct-form-group">
            <label className="dct-label">Age:</label>
            <input
              type="text"
              className="dct-input"
              value={patientDetails.age}
              readOnly
            />
          </div>

          <div className="dct-form-group">
            <label className="dct-label">Number of Tablets:</label>
            <input
              type="number"
              className="dct-input"
              onChange={(e) => handleTabletCountChange(e.target.value)}
              min="0"
            />
          </div>

          {tablets.map((tablet, index) => (
            <div key={index} className="dct-form-group tablet-row">
              <select
                value={tablet.name}
                onChange={(e) => handleTabletChange(index, "name", e.target.value)}
                className="dct-input"
              >
                <option value="">Select Medicine</option>
                {medicineOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              
              <input
                type="number"
                placeholder="Count"
                value={tablet.count}
                onChange={(e) => handleTabletChange(index, "count", e.target.value)}
                className="dct-input"
                min="1"
              />
              
              <select
                value={tablet.dosage}
                onChange={(e) => handleTabletChange(index, "dosage", e.target.value)}
                className="dct-input"
              >
                <option value="">Dosage (MG)</option>
                <option value="100">100 MG</option>
                <option value="250">250 MG</option>
                <option value="500">500 MG</option>
                <option value="1000">1000 MG</option>
              </select>
              
              {tablet.name === "Other" && (
                <input
                  type="text"
                  placeholder="Enter Medicine Name"
                  className="dct-input"
                  value={tablet.customMedicine || ""}
                  onChange={(e) =>
                    handleTabletChange(index, "customMedicine", e.target.value)
                  }
                />
              )}
            </div>
          ))}

          <div className="dct-form-group">
            <label>Injection Required:</label>
            <label className="radio-label">
              <input
                type="radio"
                name="injectionRequired"
                checked={!injectionRequired}
                onChange={() => setInjectionRequired(false)}
              />
              No
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="injectionRequired"
                checked={injectionRequired}
                onChange={() => setInjectionRequired(true)}
              />
              Yes
            </label>
          </div>

          {injectionRequired && (
            <div className="injection-details">
              <div className="dct-form-group">
                <label>Injection Name:</label>
                <select
                  className="dct-input"
                  value={injectionDetails.name}
                  onChange={(e) => setInjectionDetails({
                    ...injectionDetails,
                    name: e.target.value
                  })}
                >
                  <option value="">Select Injection</option>
                  {injectionOptions.map((injection) => (
                    <option key={injection.id} value={injection.name}>
                      {injection.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              {injectionDetails.name === "Other" && (
                <div className="dct-form-group">
                  <label>Custom Injection Name:</label>
                  <input
                    type="text"
                    className="dct-input"
                    value={injectionDetails.customName || ""}
                    onChange={(e) => setInjectionDetails({
                      ...injectionDetails,
                      customName: e.target.value
                    })}
                  />
                </div>
              )}

              <div className="dct-form-group">
                <label>Size:</label>
                <select
                  value={injectionDetails.size}
                  onChange={(e) => setInjectionDetails({
                    ...injectionDetails,
                    size: e.target.value
                  })}
                  className="dct-input"
                >
                  <option value="">Select Size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="dct-form-group">
                <label>Dosage:</label>
                <input
                  type="text"
                  className="dct-input"
                  value={injectionDetails.dosage}
                  onChange={(e) => setInjectionDetails({
                    ...injectionDetails,
                    dosage: e.target.value
                  })}
                  placeholder="e.g., 1mg daily"
                />
              </div>
            </div>
          )}

          <div className="dct-form-group">
            <label>Ointment Required:</label>
            <label className="radio-label">
              <input
                type="radio"
                name="ointmentRequired"
                checked={!ointmentRequired}
                onChange={() => setOintmentRequired(false)}
              />
              No
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="ointmentRequired"
                checked={ointmentRequired}
                onChange={() => setOintmentRequired(true)}
              />
              Yes
            </label>
          </div>

          {ointmentRequired && (
            <div className="ointment-details">
              <div className="dct-form-group">
                <label>Ointment Name:</label>
                <select
                  className="dct-input"
                  value={ointmentDetails.name}
                  onChange={(e) => setOintmentDetails({
                    ...ointmentDetails,
                    name: e.target.value
                  })}
                >
                  <option value="">Select Ointment</option>
                  {ointmentOptions.map((ointment) => (
                    <option key={ointment.id} value={ointment.name}>
                      {ointment.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              {ointmentDetails.name === "Other" && (
                <div className="dct-form-group">
                  <label>Custom Ointment Name:</label>
                  <input
                    type="text"
                    className="dct-input"
                    value={ointmentDetails.customName || ""}
                    onChange={(e) => setOintmentDetails({
                      ...ointmentDetails,
                      customName: e.target.value
                    })}
                  />
                </div>
              )}

              <div className="dct-form-group">
                <label>Dosage:</label>
                <input
                  type="text"
                  className="dct-input"
                  value={ointmentDetails.dosage}
                  onChange={(e) => setOintmentDetails({
                    ...ointmentDetails,
                    dosage: e.target.value
                  })}
                  placeholder="e.g., Apply twice daily"
                />
              </div>
            </div>
          )}

          <div className="dct-form-group">
            <label>Tonic (Syrup) Required:</label>
            <label className="radio-label">
              <input
                type="radio"
                name="tonicRequired"
                checked={!tonicRequired}
                onChange={() => setTonicRequired(false)}
              />
              No
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="tonicRequired"
                checked={tonicRequired}
                onChange={() => setTonicRequired(true)}
              />
              Yes
            </label>
          </div>

          {tonicRequired && (
            <div className="tonic-details">
              <div className="dct-form-group">
                <label>Tonic Name:</label>
                <select
                  className="dct-input"
                  value={tonicDetails.name}
                  onChange={(e) => setTonicDetails({
                    ...tonicDetails,
                    name: e.target.value
                  })}
                >
                  <option value="">Select Tonic</option>
                  {tonicOptions.map((tonic) => (
                    <option key={tonic.id} value={tonic.name}>
                      {tonic.name}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </div>

              {tonicDetails.name === "Other" && (
                <div className="dct-form-group">
                  <label>Custom Tonic Name:</label>
                  <input
                    type="text"
                    className="dct-input"
                    value={tonicDetails.customName || ""}
                    onChange={(e) => setTonicDetails({
                      ...tonicDetails,
                      customName: e.target.value
                    })}
                  />
                </div>
              )}

              <div className="dct-form-group">
                <label>Dosage:</label>
                <input
                  type="text"
                  className="dct-input"
                  value={tonicDetails.dosage}
                  onChange={(e) => setTonicDetails({
                    ...tonicDetails,
                    dosage: e.target.value
                  })}
                  placeholder="e.g., 10ml twice daily"
                />
              </div>
            </div>
          )}

          <div className="dct-form-group">
            <label>Lab Test Required:</label>
            <label className="radio-label">
              <input
                type="radio"
                name="labTestRequired"
                checked={!selectedTest}
                onChange={() => setSelectedTest("")}
              />
              No
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="labTestRequired"
                checked={!!selectedTest}
                onChange={() => setSelectedTest(testOptions[0]?.name || "Other")}
              />
              Yes
            </label>
          </div>

          {selectedTest && (
            <div className="dct-form-group">
              <label>Select Test:</label>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="dct-input"
              >
                <option value="">Select Test</option>
                {testOptions.map((test) => (
                  <option key={test.id} value={test.name}>
                    {test.name}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>

              {selectedTest === "Other" && (
                <div className="dct-form-group">
                  <label>Custom Test Name:</label>
                  <input
                    type="text"
                    className="dct-input"
                    value={customTest}
                    onChange={(e) => setCustomTest(e.target.value)}
                    placeholder="Enter test name"
                  />
                </div>
              )}
            </div>
          )}

          <div className="dct-form-group">
            <label>Doctor's Advice:</label>
            <textarea
              className="dct-input"
              value={doctorAdvice}
              onChange={(e) => setDoctorAdvice(e.target.value)}
              rows="4"
              placeholder="Enter any additional advice for the patient..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="dct-cancel-button" onClick={() => setActiveTab(1)}>
              Cancel
            </button>
            <button type="submit" className="dct-submit-button">
              Save Prescription
            </button>
          </div>
        </form>
      )}

{activeTab === 3 && (
  <div className="dct-tab-content">
    {!selectedPatient ? (
      <>
        <h2 className="dct-subheading">Completed Patients Today</h2>
        <table className="dct-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Disease</th>
              <th>Status</th>
              <th>Action</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {completedPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{`${patient.first_name} ${patient.last_name}`}</td>
                <td>{patient.age}</td>
                <td>{patient.disease}</td>
                <td>{patient.status}</td>
                <td>
                  <button
                    className="dct-view-button"
                    onClick={() => {
                      setSelectedPatient(patient);    
                    }}
                  >
                    View Details
                  </button>
                </td>
                <td>
                <button onClick={() => downloadPdf(patient.id)} className="dct-view-button down2">download</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ) : (
      <div className="dct-patient-details">
        <h2 className="dct-subheading">Patient Details</h2>
        <p><strong>Name:</strong> {selectedPatient.first_name} {selectedPatient.last_name}</p>
        <p><strong>Age:</strong> {selectedPatient.age}</p>
        <p><strong>Disease:</strong> {selectedPatient.disease}</p>
        <p><strong>Status:</strong> {selectedPatient.status}</p>

        {/* Include dynamic data below if fetched separately */}
        <p><strong>Prescribed Tests:</strong> {selectedPatient.tests?.join(', ') || "N/A"}</p>
        <p><strong>Tablets:</strong> {
  selectedPatient.tablets && selectedPatient.tablets.length > 0
    ? selectedPatient.tablets.map(t => t.name).join(', ')
    : 'N/A'
}</p>

        <p><strong>Ointments:</strong> {selectedPatient.ointments?.join(', ') || "N/A"}</p>

        <button
          className="dct-view-button"
          onClick={() => setSelectedPatient(null)}
        >
          Back to Patient List
        </button>
      </div>
    )}
  </div>
)}

    </div>
  );
};

export default DoctorView;