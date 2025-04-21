import React from "react";
import ImagesContain from "./imagesContain";
import { AboutUs, Services } from "./HomeComponents/AboutUs";
import ContactForm from "./HomeComponents/ContactUs";
import Newsletter from "./HomeComponents/NewsLetter";
import Navbar from "../home/HomeComponents/Nav";
import Pricing from "./HomeComponents/Pricing";
import Footer from "./Footer";



const IndexPage = () => {


  return (
    <>
      <Navbar />
      <br />
      <div className="hms-imgs-slider">
        <ImagesContain />
      </div>
      <div className="abousUs">
        <AboutUs />
      </div>
      <div className="servicesHMS">
        <Services />
        <div className="pricingRates">
          <Pricing />
        </div>
        <div className="contactF">
          <ContactForm />
        </div>
      </div>
      <div className="newsLetter">
        <Newsletter />
      </div>
      <Footer />
    </>
  );
};

export default IndexPage;
