import React from "react";
import { BsArrowRightCircle } from "react-icons/bs";
import '../../css/Pricing.css';
import Primary from '../../media/Primary.png';
import Corporate from '../../media/corporate-hospital.png';
import Multi from '../../media/multi.png';

const Pricing = () => {
  return (
    <section className="pricing" id="pricing">
      <h2 className="pricing-heading">Our Pricing Plans</h2>
      <div className="pricing-container">
        <div className="pricing-plan">
          <div className="plan-details">
            <div className="flexCenterImg">
              <img src={Primary} alt="" className="hsLogo" />
            <h1 className="plan-title">Primary Hospital</h1>
            </div>
            <p className="price-strike">
              <strike>₹35</strike>
              <span className="save"> Save 30%</span>
            </p>
            <h2 className="price">₹20.00/patient</h2>
            <p className="charge-det">We will charge</p>
          </div>
          <div className="features-col">
            <h1 className="features-title">Features</h1>
            <div className="features-list">
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Single Dashboard
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Doctor Management
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Accounts Management
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Patient Registration
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Patient Tracking
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Mail Services
              </span>
              <div className="bottom-btn">
                <a href="/login">
                  <button className="demo-btn">Register</button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pricing-plan">
          <div className="plan-details">
            <div className="flexCenterImg">
              <img src={Multi} alt="" className="hsLogo" />
            <h1 className="plan-title">Multi-Hospital</h1>
            
            </div>
            <p className="price-strike">
              <strike>₹150</strike>
              <span className="save"> Save 20%</span>
            </p>
            <h2 className="price">₹120.00/patient</h2>
            <p className="charge-det">We will charge</p>
          </div>
          <div className="features-col">
            <h1 className="features-title">Features</h1>
            <div className="features-list">
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Up to 10 Doctor Logins
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Doctors Dashboard
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Staff Dashboard
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Master Dashboard
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Account Dashboard
              </span>
              <div className="bottom-btn">
                <button className="demo-btn">Demo</button>
              </div>
            </div>
          </div>
        </div>

        <div className="pricing-plan">
          <div className="plan-details">
            <div className="flexCenterImg">
              <img src={Corporate} alt="" className="hsLogo" />
            <h1 className="plan-title">Corporate Hospital</h1>
            </div>
          </div>
          <div className="features-col" style={{ marginTop: "120px" }}>
            <h1 className="features-title">Features</h1>
            <div className="features-list">
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Unlimited Dashboards
              </span>
              <span className="feature">
                <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 0h24v24H0z" fill="none"></path>
							<path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
						</svg>  Unlimited Branches
              </span>
              <p className="more-info">
                <span className="highlight">*</span> For more information,
                please connect with us
              </p>
              <div className="bottom-btn">
                <button className="contact-btn">Contact Us</button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="pricing-plan">
          <div className="plan-details">
            <h1 className="plan-title">Pharmacy Software</h1>
            <p className="price-strike">
              <strike>₹99</strike>
              <span className="save"> Save 90%</span>
            </p>
            <h2 className="price">Price</h2>
          </div>
          <div className="features-col">
            <h1 className="features-title">Features</h1>
            <div className="features-list">
              <span className="feature">Feature 1</span>
              <span className="feature">Feature 2</span>
              <span className="feature">Feature 3</span>
              <span className="feature">Feature 4</span>
              <span className="feature">Feature 5</span>
              <div className="bottom-btn">
                <button className="demo-btn">Demo</button>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Pricing;
