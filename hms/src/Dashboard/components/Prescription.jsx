import React, { forwardRef, useState, useEffect } from "react";
import axios from "axios";
import "../../css/Prescription.css";

const Prescription = forwardRef(({ patientId }, ref) => {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/patients/${patientId}/`)
      .then(response => setPatient(response.data))
      .catch(error => console.error("Error fetching patient data:", error));
  }, [patientId]);

  if (!patient) return null;

  const formattedTablets = JSON.parse(patient.tablets)
    .map(med => med.customMedicine ? `${med.customMedicine} (${med.count})` : `${med.name} (${med.count})`)
    .join(", ");

  return (
    <div ref={ref} className="prescription-card">
      <header>
        <img src="/logo.png" alt="Hospital Logo" className="logo" />
        <div className="hospital-details">
          <h1>City Hospital</h1>
          <p>Dr. John Doe | Contact: +91 98765 43210</p>
        </div>
        <img src="/logo.png" alt="Hospital Logo" className="logo" />
      </header>

      <hr />

      <section className="patient-info">
        <p><strong>Patient Name:</strong> {patient.first_name} {patient.last_name}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Disease:</strong> {patient.disease}</p>
      </section>

      <section className="medicine-section">
        <h3>Prescribed Medicines</h3>
        <p>{formattedTablets}</p>
      </section>

      <footer>
        <p>123, Main Street, Your City, Country - 123456</p>
        <p>Thank you for choosing City Hospital!</p>
      </footer>
    </div>
  );
});

export default Prescription;
