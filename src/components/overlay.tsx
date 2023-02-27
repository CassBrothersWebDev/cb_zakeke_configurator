import React, { useState } from 'react';
import './overlay.css'; // import the CSS file for styling

interface OverlayProps {}

const Overlay: React.FC<OverlayProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

  const handlePrevClick = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNextClick = () => {
    if (currentSlide < 3) { // assuming there are 3 slides
      setCurrentSlide(currentSlide + 1);
    }
  };

  const onClose = () => {
    setIsOpen(false);
  }

  return (
    <div className={`overlay ${isOpen ? 'open' : ''}`}>
      <div className="slides-container">
        <div className={`slide ${currentSlide === 0 ? 'active' : ''}`}>
          {/* content for first slide */}
          <h1>FIRST SLIDE</h1>
        </div>
        <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
          {/* content for second slide */}
          <h1>SECOND SLIDE</h1>
        </div>
        <div className={`slide ${currentSlide === 2 ? 'active' : ''}`}>
          {/* content for third slide */}
          <h1>THIRD SLIDE</h1>
        </div>
        <div className={`slide ${currentSlide === 3 ? 'active' : ''}`}>
          {/* content for third slide */}
          <h1>FOURTH SLIDE</h1>
        </div>
      </div>
      <button className="prev-btn" onClick={handlePrevClick}>
        Previous
      </button>
      <button className="next-btn" onClick={handleNextClick}>
        Next
      </button>
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
};

export default Overlay;
