import React, { useState, useEffect } from "react";

import { API_URL } from "../../API";
import axios from "axios";


const Dashboard = ({ emailid, setActiveTab, token }) => {
  const [data, setData] = useState({
    TodaypatientCount: 0,
    TotalpatientCount: 0,
    todayAppointmentsCount: 0,
    totalAppointmentsCount: 0,
    todayPayment: 0,
    totalPayment: 0,
    patientTracking: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filterVisited, setFilterVisited] = useState("all");
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/patient-stats/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP fetching error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result)

        setData({
          TodaypatientCount: result.today_patients || 0,
          TotalpatientCount: result.total_patients || 0,
          todayPayment: result.monthly_patients || 0,
          totalPayment: result.totalPayment || 0,
          patientTracking: result.patientTracking || [],
        });
        setFilteredPatients(result.patientTracking || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = data.patientTracking.filter((patient) => {
      const matchesTerm =
        patient.name.toLowerCase().includes(term) ||
        patient.disease.toLowerCase().includes(term) ||
        patient.age.toString().includes(term);
      const matchesVisited =
        filterVisited === "all" ||
        (filterVisited === "visited" && patient.visited) ||
        (filterVisited === "not_visited" && !patient.visited);

      return matchesTerm && matchesVisited;
    });

    setFilteredPatients(filtered);
  };

  const handleFilterVisitedChange = (e) => {
    const filter = e.target.value;
    setFilterVisited(filter);

    const filtered = data.patientTracking.filter((patient) => {
      const matchesTerm =
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.disease.toLowerCase().includes(searchTerm) ||
        patient.age.toString().includes(searchTerm);
      const matchesVisited =
        filter === "all" ||
        (filter === "visited" && patient.visited) ||
        (filter === "not_visited" && !patient.visited);

      return matchesTerm && matchesVisited;
    });

    setFilteredPatients(filtered);
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-container">
        <div
          className="stats-card"
          style={{ backgroundColor: "#FFDDC1", cursor: "pointer" }}
          onClick={() => setActiveTab("MedicalTests")}
        >
          <h2>Today's Patients</h2>
          <p className="count">
            {data.TodaypatientCount}
          </p>
        </div>
        <div
          className="stats-card"
          style={{ backgroundColor: "#FFABAB", cursor: "pointer" }}
          onClick={() => setActiveTab("MedicalTests")}
        >
          <h2>Total Patients</h2>
          <p className="count">
            {data.TotalpatientCount}
          </p>
        </div>

        <div
          className="stats-card"
          style={{ backgroundColor: "#B9FBC0", cursor: "pointer" }}
          onClick={() => setActiveTab("Billing")}
        >
          <h2>Today's Payment</h2>
          <p className="count">
            ₹{data.todayPayment.toLocaleString("en-IN")} /-
          </p>
        </div>
        <div
          className="stats-card"
          style={{ backgroundColor: "#C2C2F0", cursor: "pointer" }}
          onClick={() => setActiveTab("Billing")}
        >
          <h2>Total Payment</h2>
          <p className="count">
            ₹{data.totalPayment.toLocaleString("en-IN")} /-
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
