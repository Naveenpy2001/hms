import React from "react";
import '../../css/HMS.css'

const AboutUs = () => {
  return (
    <section className="about-us">
      <div className="container">
        <h2 className="section-title">About Us</h2>
        <p className="about-content">
          Welcome to our Hospital Management System (HMS), where technology
          meets healthcare. Our mission is to provide cutting-edge solutions for
          hospitals and healthcare providers, ensuring seamless operations,
          improved patient care, and efficient management of resources. With our
          HMS, you can focus on what matters most – delivering exceptional care
          to your patients.
        </p>
        <p className="about-content">
          Our team is dedicated to developing robust, user-friendly software
          that caters to the unique needs of the healthcare industry. We strive
          to stay ahead of the curve, constantly innovating and improving our
          services to meet the ever-changing demands of the healthcare sector.
        </p>
      </div>
    </section>
  );
};

const Services = () => {
  return (
    <section className="services">
      <div className="container">
        <h2 className="section-title">Our Services</h2>
        <div className="service-cards card">
          <a href="/Services" className="service-card card1">
            <div className="go-corner">
              <span className="go-arrow">→</span>
            </div>
            <h3>Patient Management</h3>
            <p>
              Efficiently manage patient records, appointments, and billing. Our
              system ensures all patient information is stored securely and is
              easily accessible when needed.
            </p>
          </a>
          <a href="/Services" className="service-card card1">
            <div className="go-corner">
              <span className="go-arrow">→</span>
            </div>
            <h3>Doctor Scheduling</h3>
            <p>
              Simplify scheduling for doctors and staff. Our HMS allows for easy
              coordination of shifts, appointments, and on-call duties, ensuring
              optimal use of resources.
            </p>
          </a>
          <a href="/Services" className="service-card card1">
            <div className="go-corner">
              <span className="go-arrow">→</span>
            </div>
            <h3>Inventory Management</h3>
            <p>
              Keep track of medical supplies, equipment, and pharmaceuticals
              with our integrated inventory management system. Ensure that your
              hospital is always stocked and ready to provide the best care.
            </p>
          </a>
          <a href="/Services" className="service-card card1">
            <div className="go-corner">
              <span className="go-arrow">→</span>
            </div>
            <h3>Billing and Insurance</h3>
            <p>
              Streamline the billing process with our HMS. Manage patient bills,
              insurance claims, and payments with ease, reducing errors and
              improving financial efficiency.
            </p>
          </a>
          <a href="/Services" className="service-card card1">
            <div className="go-corner">
              <span className="go-arrow">→</span>
            </div>
            <h3>Telemedicine</h3>
            <p>
              Expand your reach with our telemedicine services. Offer remote
              consultations, follow-ups, and more through a secure, integrated
              platform.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

export { AboutUs, Services };
