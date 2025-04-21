import React, { useState, useEffect } from "react";

import { API_URL } from "../../API";

function Appointments({ token }) {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/patients/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP fetching error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data);

        // Calculate and update today's appointments count
        const today = new Date().toISOString().split("T")[0];
        updateTodayAppointmentsCount(appointments, today);
        setTotalAppointmentsCount(appointments.length);

        // Optionally, send the updated counts to the backend
        await updateAppointmentCounts(today, appointments.length);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setFilteredAppointments([]);
        setTodayAppointmentsCount(0);
        setTotalAppointmentsCount(0);
      }
    };

    fetchData();
  }, [token]);

  const updateTodayAppointmentsCount = (appointments, today) => {
    const todayAppointments = appointments.filter(
      (appointment) => appointment.date === today
    );
    const count = todayAppointments.length;
    setTodayAppointmentsCount(count);
  };

  const updateAppointmentCounts = async (date, totalCount) => {
    try {
      await fetch(`${API_URL}/appointments/counts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(token)}`,
        },
        body: JSON.stringify({ date, totalCount }),
      });
    } catch (error) {
      console.error("Error updating appointment counts:", error);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterAppointments(term, filterDate, statusFilter);
  };

  const handleDateFilterChange = (e) => {
    const filter = e.target.value;
    setFilterDate(filter);
    filterAppointments(searchTerm, filter, statusFilter);
  };

  const handleStatusFilterChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterAppointments(searchTerm, filterDate, status);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setStatusFilter("");
    setFilteredAppointments(data);
  };

  const filterAppointments = (term, dateFilter, statusFilter) => {
    const filtered = data.filter((appointment) => {
      const matchesTerm =
        appointment.name.toLowerCase().includes(term) ||
        appointment.reason.toLowerCase().includes(term) ||
        appointment.age.toString().includes(term);
      const matchesDate = dateFilter === "" || appointment.date === dateFilter;
      const matchesStatus =
        statusFilter === "" || appointment.status === statusFilter;

      return matchesTerm && matchesDate && matchesStatus;
    });

    setFilteredAppointments(filtered);
    const today = new Date().toISOString().split("T")[0];
    updateTodayAppointmentsCount(filtered, today); // Update today's count after filtering
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Completed" ? "Not Completed" : "Completed";
    try {
      const response = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem(token)}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status! status: ${response.status}`);
      }

      const updatedAppointments = filteredAppointments.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status: newStatus }
          : appointment
      );
      setFilteredAppointments(updatedAppointments);
      setData(updatedAppointments); // Update the main data state as well
      const today = new Date().toISOString().split("T")[0];
      updateTodayAppointmentsCount(updatedAppointments, today); // Update today's count
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <h1>Appointments Data</h1>
      <div className="appointments-summary">
        <p>Today's Appointments: {todayAppointmentsCount}</p>
        <p>Total Appointments: {totalAppointmentsCount}</p>
      </div>
      <div className="tracking-container">
        <div className="filter-container">
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by name, reason, or age..."
            className="search-input"
          />

          <input
            type="date"
            value={filterDate}
            onChange={handleDateFilterChange}
            className="search-input date"
          />

          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="search-input date"
          >
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Not Completed">Not Completed</option>
          </select>

          <button onClick={handleClearFilters} className="clear-filters-button">
            Clear Filters
          </button>
        </div>

        <table className="tracking-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    {appointment.firstName} {appointment.lastName}
                  </td>
                  <td>{appointment.age}</td>
                  <td>{appointment.disease}</td>
                  <td>{appointment.date}</td>
                  <td>
                    <button
                      onClick={() =>
                        handleStatusChange(appointment.id, appointment.status)
                      }
                      className={`status-button ${
                        appointment.status === "Completed"
                          ? "completed"
                          : "not-completed"
                      }`}
                    >
                      {appointment.status}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No appointments found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Appointments;
