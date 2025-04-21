import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/hms-dash.css";


import { API_URL } from "./API";
import { useNavigate } from "react-router-dom";

const DashboardHms = () => {
  const [hospitals, setHospitals] = useState([]);
 
  const [selectedOption, setSelectedOption] = useState("dashboard");
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [freezeStatus, setFreezeStatus] = useState({});
  const [contactMessages, setContactMessages] = useState([]);
  console.log(contactMessages)
  const [newsletterEmails, setNewsletterEmails] = useState([
    
  ]);
  const [tickets, setTickets] = useState([]);
  console.log(tickets);

  const [reply, setReply] = useState("");
  const [currentTicketId, setCurrentTicketId] = useState(null);

  const [currentMessage, setCurrentMessage] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [currentEmail, setCurrentEmail] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    document.title = "HMS | dashboard"; 
}, []);

  const handleLogout = () => {
    navigate('/AdminLogin')
    console.log("Logging out...");
  };

  const handleRowClick = (hospitalId) => {
    setSelectedHospital(hospitalId);
  };

  const handleFreezeAccount = (hospitalId) => {
    setFreezeStatus((prevState) => ({
      ...prevState,
      [hospitalId]: true,
    }));
  };

  const handleClearAmount = (hospitalId) => {
    setFreezeStatus((prevState) => ({
      ...prevState,
      [hospitalId]: false,
    }));
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };


  const [contactMsg,setContactMsg] = useState(null)


// const fetchMessages = async () => {
//   const response = await axios.get('http://127.0.0.1:8000/api/contact/');
//   setContactMsg(response.is_reply)
  
//   console.log(response.is_reply)
// }

// useEffect(() => {
//   fetchMessages();
// },[])

  // const handleContactReply = async (currentMessage) => {
  //   const dataObj = {
  //     email : currentMessage.email,
  //     message : reply
  //   }
  //   const response = await axios.post('http://127.0.0.1:8000/api/contact/',dataObj)
  //   setContactMsg(response.status)
  //   if (response.status === 201){
  //   setReply("");
  //   }
  // };

  const handleNewsletterReply = (email) => {
    console.log(`Replying to newsletter email ${email}: ${reply}`);
    setReply("");
  };

  const handleTicketReply = (ticketId) => {
    console.log(`Replying to ticket ${ticketId}: ${reply}`);
    setReply("");
    setCurrentTicketId(null);
  };

  useEffect(() => {
    // Fetch data from backend
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(`${API_URL}/fetchAll-hospitals`);
        setHospitals(response.data);
        
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchMedicines();
  }, []);

  useEffect(() => {
    // Fetch data from backend
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${API_URL}/support/tickets`);
        setTickets(response.data);
    

      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    // Fetch data from backend
    const fetchTouchmessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/fetchTouchmessages`);
        setContactMessages(response.data);
        console.log(response.data)
        console.log(response)
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };
    fetchTouchmessages();
  }, []);

  const transactions = {
   
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "dashboard":
        return (
          <div>
            <h2 className="dsh-heading">Dashboard Overview</h2>
            <div className="dsh-summary">
              <div
                className="dsh-summary-card dsh-card-hospitals"
                onClick={() => setSelectedOption("hospitalList")}
              >
                <h3>Hospitals</h3>
                <p>{hospitals.length}</p>
              </div>
              <div
                className="dsh-summary-card dsh-card-tickets"
                onClick={() => setSelectedOption("ticketRise")}
              >
                <h3>Tickets</h3>
                <p>{tickets.length}</p>
              </div>
              <div
                className="dsh-summary-card dsh-card-newsletter"
                onClick={() => setSelectedOption("newsletter")}
              >
                <h3>Newsletter Emails</h3>
                <p>{newsletterEmails.length}</p>
              </div>
              <div
                className="dsh-summary-card dsh-card-contact"
                onClick={() => setSelectedOption("contactUs")}
              >
                <h3>Contact Us Messages</h3>
                <p>{contactMessages.length}</p>
              </div>
            </div>
          </div>
        );
      case "hospitalList":
      case "accountTracking":
      case "accountManage":
      case "contactUs":
      case "newsletter":
      case "ticketRise":
        return (
          <div>
            <button
              className="dsh-back-button"
              onClick={() => setSelectedOption("dashboard")}
            >
              Back to Dashboard
            </button>
            {renderSelectedTabContent()}
          </div>
        );
      default:
        return <div>Please select an option from the left.</div>;
    }
  };

  const renderSelectedTabContent = () => {
    switch (selectedOption) {
      case "hospitalList":
        return (
          <div>
            <h2 className="dsh-heading">Hospitals List</h2>
            <table className="dsh-hospital-details-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hospital Name</th>
                  <th>address</th>
                  <th>emailid</th>
                  <th>full name</th>
                  <th>phonnumber</th>

                  {/* <th>Remaining Fee</th> */}
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital) => (
                  <tr key={hospital.id}>
                    <td>{hospital.id}</td>
                    <td>{hospital.hospitalname}</td>
                    <td>{hospital.address}</td>
                    <td>{hospital.emailid}</td>
                    <td>
                      {hospital.firstname}
                      {hospital.lastname}
                    </td>
                    <td>{hospital.phonenumber}</td>

                    {/* <td>{hospital.remainingFee} INR</td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "accountTracking":
        return (
          <div>
            <h2 className="dsh-heading">Financial a/c Track</h2>
            {!selectedHospital ? (
              <table className="dsh-account-details-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Hospital Total patients</th>
                    <th>Hospital Today patients</th>
                    <th>Pending Amount</th>
                    <th>Cleared Amount</th>
                    <th>Paid/Not Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hospital) => (
                    <tr
                      key={hospital.id}
                      onClick={() => handleRowClick(hospital.id)}
                    >
                      <td>{hospital.id}</td>
                      <td>{hospital.hospitalname}</td>
                      <td>{hospital.totalpatents}</td>
                      <td>{hospital.todaypatents}</td>
                      <td>{hospital.pendingAmount} INR</td>
                      <td>{hospital.clearedAmount} INR</td>
                      <td>{hospital.paid ? "Paid" : "Not Paid"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>
                <button onClick={() => setSelectedHospital(null)} className="ac-btn-back">Back</button>
                <h3 className="dsh-subheading">
                  Transactions for Hospital ID: {selectedHospital}
                </h3>
              
                <table className="dsh-account-details-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions[selectedHospital]?.length > 0 ? (
                      transactions[selectedHospital].map(
                        (transaction, index) => (
                          <tr key={index}>
                            <td>{transaction.paymentId}</td>
                            <td>{transaction.amount} INR</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.status}</td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td colSpan="4">No transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case "accountManage":
        return (
          <div>
            <h2 className="dsh-heading">Financial a/c Track</h2>
            <table className="dsh-account-details-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Paid/Not Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hospital) => (
                  <tr key={hospital.id}>
                    <td>{hospital.id}</td>
                    <td>{hospital.hospitalname}</td>
                    <td>{hospital.paid ? "Paid" : "Not Paid"}</td>
                    <td>
                      <button
                        onClick={() => handleFreezeAccount(hospital.id)}
                        disabled={freezeStatus[hospital.id]}
                        className="ac-btn-freeze"
                      >
                        {freezeStatus[hospital.id]
                          ? "Account Frozen"
                          : "Freeze Account"}
                      </button>
                      <button onClick={() => handleClearAmount(hospital.id)} className="ac-btn-purge">
                        Clear Amount
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "contactUs":
        return (
          <div>
            <h2 className="dsh-heading">Contact Us Messages</h2>
            {currentMessage ? (
              <div>
                <p>
                  <strong>Message:</strong> {currentMessage.message}
                </p>
                <input
                  type="text"
                  value={reply}
                  onChange={handleReplyChange}
                  placeholder="Type your reply"
                  className="ac-input"
                />  <br />
                <button  className="ac-btn-reply">
                  Reply
                </button>
                <button onClick={() => setCurrentMessage(null)} className="ac-btn-back">Back</button>
              </div>
            ) : (
              <table className="dsh-contact-messages-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>name</th>
                    <th>email</th>
                    <th>Message</th>
                    <th>Replied</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.map((message) => (
                    <tr key={message.id}>
                      <td>{message.id}</td>
                      <td>{message.name}</td>
                      <td>{message.email}</td>
                      <td>{message.message}</td>
                      <td>{contactMsg && contactMsg.is_reply ? "Yes" : "No"}</td>
                      {!message.replied && (
                        <td>
                          <button onClick={() => setCurrentMessage(message)} className="ac-btn-reply">
                            Reply
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "newsletter":
        return (
          <div>
            <h2 className="dsh-heading">Newsletter Emails</h2>
            {currentEmail ? (
              <div>
                <p>
                  <strong>Email:</strong> {currentEmail}
                </p>
                <input
                  className="reply-input"
                  type="text"
                  value={reply}
                  onChange={handleReplyChange}
                  placeholder="Type your reply"
                />
                <button
                  className="ac-btn-reply"
                  onClick={() => handleNewsletterReply(currentEmail)}
                  
                >
                  Reply
                </button>
                <button
                  className="ac-btn-back"
                  onClick={() => setCurrentEmail(null)}
                >
                  Back
                </button>
              </div>
            ) : (
              <table className="dsh-newsletter-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletterEmails.map((email, index) => (
                    <tr key={index}>
                      <td>{email}</td>
                      <td>
                        <button
                          className="ac-btn-reply"
                          onClick={() => setCurrentEmail(email)}
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );

      case "ticketRise":
        return (
          <div>
            <h2 className="dsh-heading">Tickets</h2>
            {currentTicket ? (
              <div>
                <p>
                  <strong>Issue:</strong> {currentTicket.issue}
                </p>
                <p>
                  <strong>Priority:</strong> {currentTicket.priority}
                </p>
                <input
                  type="text"
                  value={reply}
                  onChange={handleReplyChange}
                  placeholder="Type your reply"
                />
                <button onClick={() => handleTicketReply(currentTicket.id)} className="ac-btn-reply">
                  Reply
                </button>
                <button onClick={() => setCurrentTicket(null)} className="ac-btn-back">Back</button>
              </div>
            ) : (
              <table className="dsh-tickets-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Issue</th>
                    <th>Email</th>
                    <th>Priority</th>
                    <th>subject</th>
                    <th>Replied</th>
                    <th>Action</th>
                    <th>status</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    
                    <tr key={ticket.id}>
                      <td>{ticket.id}</td>
                      <td>{ticket.issueDescription}</td>
                      <td>{ticket.email}</td>
                      <td>{ticket.priority}</td>
                      <td>{ticket.subject}</td>
                      <td>{ticket.replied ? "Yes" : "No"}</td>
                      {/* <td>{ticket.Action}</td> */}
                      <td>{ticket.status}</td>
                      {!ticket.replied && (
                        <td>
                          <button onClick={() => setCurrentTicket(ticket)} className="ac-btn-reply">
                            Reply
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      default:
        return <div>Please select an option from the left.</div>;
    }
  };

  return (
    <div className="dsh-dashboard">
      <div className="dsh-side-nav">
        <h2 className="dsh-heading">Dashboard</h2>
        <ul className="dsh-nav-list">
          <li
            onClick={() => setSelectedOption("dashboard")}
            className={selectedOption === "dashboard" ? "dsh-active" : ""}
          >
            Dashboard Overview
          </li>
          <li
            onClick={() => setSelectedOption("hospitalList")}
            className={selectedOption === "hospitalList" ? "dsh-active" : ""}
          >
            Hospitals List
          </li>
          <li
            onClick={() => setSelectedOption("accountTracking")}
            className={selectedOption === "accountTracking" ? "dsh-active" : ""}
          >
            Financial a/c Track
          </li>
          <li
            onClick={() => setSelectedOption("accountManage")}
            className={selectedOption === "accountManage" ? "dsh-active" : ""}
          >
            Account Manage
          </li>
          <li
            onClick={() => setSelectedOption("contactUs")}
            className={selectedOption === "contactUs" ? "dsh-active" : ""}
          >
            Contact Us
          </li>
          <li
            onClick={() => setSelectedOption("newsletter")}
            className={selectedOption === "newsletter" ? "dsh-active" : ""}
          >
            Newsletter
          </li>
          <li
            onClick={() => setSelectedOption("ticketRise")}
            className={selectedOption === "ticketRise" ? "dsh-active" : ""}
          >
            Ticket Rise
          </li>
          <br />
          <br />
          <br />
          <br />
          <br /> <br />
          <br />
          <li onClick={handleLogout} className="dsh-logout">
            Logout
          </li>
        </ul>
      </div>

      <div className="dsh-main-content">{renderContent()}</div>
    </div>
  );
};

export default DashboardHms;
