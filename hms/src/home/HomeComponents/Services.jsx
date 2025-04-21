import React from "react";
import '../../css/services.css';

import Navbar from "./Nav";
import Footer from "../Footer";
const Services = () => {
  return (
    <>
    <Navbar />
    <section className="srvs-services">
      <div className="srvs-container">
        <h2 className="srvs-section-title">Our Services</h2>
        <div className="srvs-service-cards">
          <div className="srvs-service-card">
            <img
              src="https://www.leadsquared.com/wp-content/uploads/2022/06/patient-management-system-features-and-benefits-1.png"
              alt="Patient Management"
              className="srvs-card-image"
            />
            <h3 className="srvs-card-title">Patient Management</h3>
            <p className="srvs-card-description">
              Efficiently manage patient records, appointments, and billing with
              our comprehensive Patient Management system. Our HMS ensures that
              patient information is securely stored and easily accessible,
              facilitating smoother interactions between patients and healthcare
              providers.
            </p>
            <p className="srvs-card-description">
              <strong>Pros:</strong> Improved patient data accuracy, enhanced
              patient engagement, streamlined appointment scheduling.
            </p>
            <p className="srvs-card-description">
              <strong>Cons:</strong> Requires initial setup and training,
              potential data privacy concerns.
            </p>
          </div>
          <div className="srvs-service-card">
            <img
              src="https://mobisoftinfotech.com/resources/wp-content/uploads/2018/07/Banner-1.png"
              alt="Doctor Scheduling"
              className="srvs-card-image"
            />
            <h3 className="srvs-card-title">Doctor Scheduling</h3>
            <p className="srvs-card-description">
              Simplify scheduling for doctors and staff with our advanced Doctor
              Scheduling module. Coordinate shifts, manage appointments, and
              handle on-call duties with ease, ensuring optimal resource
              allocation and reducing scheduling conflicts.
            </p>
            <p className="srvs-card-description">
              <strong>Pros:</strong> Reduced scheduling conflicts, increased
              operational efficiency, easier management of doctor shifts.
            </p>
            <p className="srvs-card-description">
              <strong>Cons:</strong> Complexity in integrating with existing
              systems, potential resistance to change from staff.
            </p>
          </div>
          <div className="srvs-service-card">
            <img
              src="https://www.simplilearn.com/ice9/free_resources_article_thumb/What_Is_Inventory_Management.jpg"
              alt="Inventory Management"
              className="srvs-card-image"
            />
            <h3 className="srvs-card-title">Inventory Management</h3>
            <p className="srvs-card-description">
              Keep track of medical supplies, equipment, and pharmaceuticals
              with our integrated Inventory Management system. Ensure that your
              hospital is always stocked with essential items and minimize waste
              with real-time inventory monitoring and reporting.
            </p>
            <p className="srvs-card-description">
              <strong>Pros:</strong> Improved inventory accuracy, reduced
              stockouts and overstocking, efficient resource management.
            </p>
            <p className="srvs-card-description">
              <strong>Cons:</strong> Initial setup cost, ongoing maintenance
              required, potential system integration issues.
            </p>
          </div>
          <div className="srvs-service-card">
            <img
              src="https://www.kauveryhospital.com/wp-content/uploads/2023/06/billing.jpg"
              alt="Billing and Insurance"
              className="srvs-card-image"
            />
            <h3 className="srvs-card-title">Billing and Insurance</h3>
            <p className="srvs-card-description">
              Streamline the billing process with our HMS Billing and Insurance
              module. Manage patient bills, insurance claims, and payments
              efficiently, reducing errors and improving financial efficiency.
              Our system supports a variety of payment methods and integrates
              seamlessly with insurance providers.
            </p>
            <p className="srvs-card-description">
              <strong>Pros:</strong> Faster claim processing, reduced billing
              errors, better financial oversight.
            </p>
            <p className="srvs-card-description">
              <strong>Cons:</strong> Requires regular updates to keep up with
              insurance changes, initial training for staff.
            </p>
          </div>
          <div className="srvs-service-card">
            <img
              src="https://devabit.com/uploads/the-future-of-telemedicine-cover-devabit.webp"
              alt="Telemedicine"
              className="srvs-card-image"
            />
            <h3 className="srvs-card-title">Telemedicine</h3>
            <p className="srvs-card-description">
              Expand your reach with our Telemedicine services. Offer remote
              consultations, follow-ups, and more through a secure, integrated
              platform. Enhance patient access to care, especially for those in
              remote areas, and reduce the need for in-person visits.
            </p>
            <p className="srvs-card-description">
              <strong>Pros:</strong> Increased patient access, reduced need for
              physical visits, convenience for both patients and providers.
            </p>
            <p className="srvs-card-description">
              <strong>Cons:</strong> Requires reliable internet connectivity,
              potential challenges with virtual consultations.
            </p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Services;
