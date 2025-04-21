import React from "react";
import "./home.css";
import { BsArrowRightCircle } from "react-icons/bs";
import ImagesContain from "./imagesContain.jsx";

const Home = () => {
  //   gradient text css
  const heading = {
    fontSize: "34px",
    textAlign: "center",
    padding: "15px 0",
    fontWeight: "500",
    background:
      "linear-gradient(to right, #A40D91 0%, #FE34FF 50%, #A40D91 87%)",
    backgroundClip: "text",
    webkitTextFillColor: "transparent",
  };
  return (
    <section>
      <div className="home-container">
        <div className="info-text">
          <ImagesContain />
        </div>
      </div>
      <main>
        <center>
          <h1 className="header" style={heading}>
            Select Your Plan
          </h1>
        </center>
        <div className="plans-container">
          <div className="plans">
            <div className="col-1">
              <h1 className="title">primary hospital</h1>
              <p className="price-strike">
                <strike> ₹21 </strike>
                <span className="save"> save 30% </span>
              </p>
              <h2 className="price">₹15.00/patient</h2>
              <p className="charge-det">we will charge</p>
            </div>
            <div className="features-col">
              <h1 className="ft-title">Features</h1>
              <div className="flex-col">
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> single dashboard
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> doctor management
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> accounts management
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> patient registration
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> patient tracking
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> mail services
                </span>
                <div className="bottom-btn">
                  <a href="/Login">
                    <button className="demo">demo</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="plans">
            <div className="col-1">
              <h1 className="title">multi-hospital</h1>
              <p className="price-strike">
                <strike> ₹150 </strike>
                <span className="save"> save 20% </span>
              </p>
              <h2 className="price">₹120.00/patient</h2>
              <p className="charge-det">we will charge</p>
            </div>
            <div className="features-col">
              <h1 className="ft-title">Features </h1>
              <div className="flex-col">
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> upto 10 doctors logins
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> doctors dashboard
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> staff dashboard
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> master dashboard
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" /> account dashboard
                </span>
                <div className="bottom-btn">
                  <button className="demo">demo</button>
                </div>
              </div>
            </div>
          </div>
          <div className="plans">
            <div className="col-1">
              <h1 className="title">corporate hospital</h1>
            </div>
            <div className="features-col" style={{ marginTop: "120px" }}>
              <h1 className="ft-title">Features</h1>
              <div className="flex-col">
                <span className="featrues">
                  <BsArrowRightCircle className="icon" />
                  unlimited dashboards
                </span>
                <span className="featrues">
                  <BsArrowRightCircle className="icon" />
                  unlimited branches
                </span>
                <p className="for-more">
                  <span style={{ color: "red" }}>*</span>
                  for more information Please connect with us
                </p>
                <div className="bottom-btn">
                  <button className="demo">contact us</button>
                </div>
              </div>
            </div>
          </div>
          <div className="plans">
            <div className="col-1">
              <h1 className="title">pharmacy software</h1>
              <p className="price-strike">
                <strike> 99 </strike>
                <span className="save"> save 90% </span>
              </p>
              <h2 className="price">price</h2>
            </div>
            <div className="features-col">
              <h1 className="ft-title">Features</h1>
              <div className="flex-col">
                <span className="featrues">ftrs</span>
                <span className="featrues">ftrs</span>
                <span className="featrues">ftrs</span>
                <span className="featrues">ftrs</span>
                <span className="featrues">ftrs</span>
                <span className="featrues">ftrs</span>
                <div className="bottom-btn">
                  <button className="demo">Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Home;
