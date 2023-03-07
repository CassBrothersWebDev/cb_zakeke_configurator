import React, { useState } from "react";
import "./overlay.css"; // import the CSS file for styling

interface OverlayProps {}

const Overlay: React.FC<OverlayProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isOpen, setIsOpen] = useState(true);

  const handleNextClick = () => {
    if (currentSlide < 3) {
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
            <h1>How to build your custom vanity</h1>
            <div className="slide-inner__steps">
              <div className="step-container">
                <h3 className="step--heading">1. Choose your configuration</h3>
                <span>
                  Measure your space so you know what size vanity will fit.
                  Think about your plumbing spots, and if you want doors or
                  drawers (or both!).
                </span>
              </div>
              <div className="step-container">
                <h3 className="step--heading">2. Pick your finishes</h3>
                <span>
                  From your cabinet and benchtop finish to your handle and basin
                  options. These are the first things that you will see, and
                  where your style shines most.
                </span>
              </div>
              <div className="step-container">
                <h3 className="step--heading">3. Accessorise</h3>
                <span>
                  Enhance your bathroom experience with the addition of vanity
                  accessories. These include in-drawer power points, vanity
                  bins, drawer lighting, and more!
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={`slide ${currentSlide === 1 ? "active" : ""}`}>
          {/* content for second slide */}
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
        <div className={`slide ${currentSlide === 2 ? "active" : ""}`}>
          {/* content for third slide */}
          <div className="slide-inner">
            <div className="slide-inner__steps">
              <div className="step-container">
                <div className="img-container"></div>
              </div>
              <div className="step-container">
                <h1>Vanity Sample Pack</h1>
                <span>
                  Our vanity sample packs allow you to choose a selection of
                  cabinet finishes and benchtop finishes from leading brands
                  including ADP and Timberline.
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={`slide ${currentSlide === 3 ? "active" : ""}`}>
          {/* content for third slide */}
          <div className="slide-inner">
            <h1>Our customers designs</h1>
            <div className="slide-inner__steps">
              <div className="img-container squared"></div>
              <div className="img-container squared"></div>
              <div className="img-container squared"></div>
              <div className="img-container squared"></div>
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
