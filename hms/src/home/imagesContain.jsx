// App.js
import React, { useState, useEffect } from "react";
import "./ImageSlider.css";
// import ImageSlider from "./imagesSlide";
import slide3 from "../media/slide3.jpg";
import slide2 from "../media/slide2.png";
import slide1 from "../media/slide1.png";

const ImagesContain = () => {
  const images = [slide3, slide2, slide1];
  
  return (
    <div>
      <ImageSlider images={images} />
    </div>
  );
};

export default ImagesContain;

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    const intervalId = setInterval(nextSlide, 3000); // Change the interval as needed (in milliseconds)

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div className="image-slider">
      <img
        className="slider-image"
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
      />

      <button className="prev-button" onClick={prevSlide}>
        &lt;
      </button>
      <button className="next-button" onClick={nextSlide}>
        &gt;
      </button>
    </div>
  );
};
