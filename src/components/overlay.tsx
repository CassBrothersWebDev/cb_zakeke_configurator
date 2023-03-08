import React, { useState } from "react";
import "./overlay.css"; // import the CSS file for styling
import VanitySampleImg from "./images/VanitySampleBoxImageFour.png";
import Vanity_1 from "./images/vanity-example-1.png";
import Vanity_2 from "./images/vanity-example-2.png";
import Vanity_3 from "./images/vanity-example-3.png";
import Vanity_4 from "./images/vanity-example-4.png";

interface OverlayProps {}

const Overlay: React.FC<OverlayProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const handleNextClick = () => {
    if (currentSlide < 2) {
      // assuming there are 3 slides
      setCurrentSlide(currentSlide + 1);
    } else {
      setIsOpen(false);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={`overlay ${isOpen ? "open" : ""}`}>
      <div className="slides-container">
        <div className={`slide ${currentSlide === 0 ? "active" : ""}`}>
          {/* content for first slide */}
          <div className="slide-inner">
            <h1>How to use our 3D vanity configurator</h1>
            <div className="slide-inner__steps">
              <div className="step-container">
                <div className="step-numberBox">
                  <span className="step-number">1</span>
                </div>
                <div className="step-square">
                  <h3 className="step--heading">Choose your options</h3>
                  <span className="step-text">
                    Choose from a variety of options to create a truly unique
                    vanity. Our configurator is designed to make the process
                    easy and intuitive, so you can see how each selection
                    affects the overall look and feel of your vanity.
                  </span>
                </div>
              </div>
              <div className="step-container">
                <div className="step-numberBox">
                  <span className="step-number">2</span>
                </div>
                <div className="step-square">
                  <h3 className="step--heading">View your new vanity in 3D</h3>
                  <span className="step-text">
                    As you select your preferred options, our configurator will
                    generate a 3D model that lets you visualise your vanity from
                    every angle. This way, you can ensure that every aspect of
                    your vanity is just the way you want it before placing your
                    order.
                  </span>
                </div>
              </div>
              <div className="step-container">
                <div className="step-numberBox">
                  <span className="step-number">3</span>
                </div>
                <div className="step-square">
                  <h3 className="step--heading">Finalise your design</h3>
                  <span className="step-text">
                    Once you've personalised your vanity to your liking using
                    our configurator and 3D visualisation tools, it's time to
                    finalise your design! At this stage, you can choose to
                    download your design as a PDF for future reference or add it
                    directly to your cart to purchase your custom vanity.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*
        <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
          // content for second slide 
          <div className="slide-inner">
            <h1>Build your dream vanity with the Visual Shopper</h1>
            <div className="slide-inner__steps">
              <div className="step-container ">
                <span>
                  Build your dream custom cabinetry with ease with our Visual
                  Shopper tool available on over 120 vanities across our range.
                  Simply scroll through the steps to customise your vanity or
                  mirror cabinet, and add to your cart.
                </span>
                <span>
                  Incorporate a made to order custom vanity design to your
                  bathroom, and truly express your style. In three easy steps,
                  you can have the perfect vanity for your dream bathroom. Made
                  with love in Australia.
                </span>
              </div>
              <div className="step-container">
                <div className="img-container"></div>
              </div>
            </div>
          </div>
        </div>
        */}
        <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
          {/* content for third slide */}
          <div className="slide-inner">
            <div className="slide-inner__steps center">
              <div className="step-container">
                <div className="img-container">
                  <img
                    src={VanitySampleImg}
                    alt="Vanity Samples"
                    className="samples-img"
                  />
                </div>
              </div>
              <div className="step-container col">
                <h1>Vanity Samples</h1>
                <span>
                  We offer sample boxes for all types of surfaces. Order yours
                  today to see and feel the quality for yourself!
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={`slide ${currentSlide === 2 ? "active" : ""}`}>
          {/* content for third slide */}
          <div className="slide-inner">
            <h1>Inspirational designs</h1>
            <div className="image-row">
              <img
                src={Vanity_1}
                alt="Vanity Example 1"
              />
              <img
                src={Vanity_2}
                alt="Vanity Example 2"
              />
              <img
                src={Vanity_3}
                alt="Vanity Example 3"
              />
              <img
                src={Vanity_4}
                alt="Vanity Example 4"
              />
            </div>
          </div>
        </div>
        <button className="next-btn" onClick={handleNextClick}>
          Next
        </button>
        <button className="close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

export default Overlay;
