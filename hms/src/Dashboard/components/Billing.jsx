import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Razorpay from 'razorpay';

import { API_URL } from '../../API';

const Billing = () => {
  const [todaysPayments, setTodaysPayments] = useState([]);
  const [monthlyTotalPayments, setMonthlyTotalPayments] = useState({ monthWise: [], yearWise: [] });
  const [totalPatients, setTotalPatients] = useState(0);
  const [currentTab, setCurrentTab] = useState('todaysPayments');



  const [data,setData] = useState([])
  console.log(data)

  const totalAmount = (data || []).reduce(
    (sum, patient) => sum + parseFloat(patient.amount || 0),
    0
  );
  

  const fetchData = async () => {
    const response = await axios.get('http://127.0.0.1:8000/api/today-patients/');
    setData(response.data)
  }

  // Fetch payments data
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/patient-stats/`)
      .then(response => {
        setTotalPatients(response.data.total_patients);
      })
      .catch(error => console.error('Error fetching today\'s payments:', error));

      fetchData();
  }, []);

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
  };

  const handleBankDetailChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  const fetchPatientStats = () => {
    axios.get(`http://127.0.0.1:8000/payment-stats/`)
      .then(response => {
        console.log(response.data)
        setTotalPatients(response.data.total_patients);
        setTotalAmount(response.data.total_amount);
        setLastPaymentDate(response.data.last_payment_date);
      })
      .catch(error => console.error('Error fetching patient stats:', error));
  };



  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert('Failed to load Razorpay SDK.');
      return;
    }

    const options = {
      key: 'rzp_live_oRtGw5y3RbD9MH', // Replace with your Razorpay Key ID
      amount: totalAmount * 100, // Convert to paise
      currency: 'INR',
      name: 'Doctor Payment',
      description: 'Commission Payment',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);

        // Reset count after payment
        axios.post(`http://127.0.0.1:8000/payment-stats/reset_payment/`)
          .then(() => {
            setTotalPatients(0);
            setTotalAmount(0);
            fetchPatientStats();
          })
          .catch(error => console.error('Error resetting payment:', error));
      },
      prefill: {
        name: 'Doctor',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleRazorpayPayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert('Failed to load Razorpay SDK.');
      return;
    }

    const options = {
      key: 'rzp_live_oRtGw5y3RbD9MH', // Replace with your Razorpay Key ID
      amount: totalCommission * 100, // Amount in paise (1 INR = 100 paise)
      currency: 'INR',
      name: 'Doctor Payment',
      description: 'Commission Payment',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        // Here, you can send the payment details to your server to update the status
      },
      prefill: {
        name: 'Doctor',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };


  const commissionRate = 20;
  const totalCommission = totalPatients * commissionRate;

  return (
    <div className="billing">
      <h1 className="billing-heading">Accounts Information</h1>

      {/* Navigation for tabs */}
      <div className="billing-navigation">
        <button onClick={() => handleTabClick('todaysPayments')}>Today's Payments</button>
        <button onClick={() => handleTabClick('totalPayments')}>Total Payments</button>
        <button onClick={() => handleTabClick('wallet')}>Wallet Amount</button>
        {/* <button onClick={() => handleTabClick('bankDetails')}>Bank Details</button> */}
      </div>

      {/* Today's Payments Tab */}
      {currentTab === 'todaysPayments' && (
        <section className="billing-section">
          <h2 className="billing-subheading">Today's Payments</h2>
          <table className="billing-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Total Fee</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((payment, index) => (
                 <>
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{payment.first_name} {payment.last_name}</td>
                    <td>{payment.phone}</td>
                    <td>{payment.amount}</td>
                  </tr>
                 </>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              )}
              <tr>
                <td></td>
                <td> </td>
                <td><b>total :</b></td>
                <td> ₹{totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {/* Total Payments Tab */}
      {currentTab === 'totalPayments' && (
        <section className="billing-section">
          <h2 className="billing-subheading">Total Payments</h2>
          <div className="billing-summary">
            <div className="billing-summary-item">
              <h3>Month-wise</h3>
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyTotalPayments.monthWise.length > 0 ? (
                    monthlyTotalPayments.monthWise.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.month}</td>
                        <td>{payment.totalAmount} INR</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="billing-summary-item">
              <h3>Year-wise</h3>
              <table className="billing-table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyTotalPayments.yearWise.length > 0 ? (
                    monthlyTotalPayments.yearWise.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.year}</td>
                        <td>{payment.amount} INR</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Wallet Amount Tab */}
      {currentTab === 'wallet' && (
        <section className="billing-section">
          <h2 className="billing-subheading">Your Wallet Amount</h2>
          <p>Total Patients: {totalPatients}</p>
          <p>Total Commission: {totalCommission} INR (20 INR per patient)</p>
          <button className="payCommission" onClick={handleRazorpayPayment}>Click to Pay</button>
          <hr />
          {/* <p>Doctor's Wallet Amount (after commission): {walletAmount - totalCommission} INR</p> */}
        </section>
      )}

      
    </div>
  );
};

export default Billing;
