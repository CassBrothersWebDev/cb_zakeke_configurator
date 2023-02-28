import React from "react";
import './circles.css'

interface CircleProps {
  isActive: boolean;
}

const Circle = ({ isActive }: CircleProps) => {
  const circleClasses = `circle ${isActive ? "active" : ""}`;
  return <div className={circleClasses} />;
};

interface CirclesProps {
  currentOption: number;
  optionsCount: number;
}

const Circles = ({ currentOption, optionsCount }: CirclesProps) => {
  const circles = Array.from({ length: optionsCount }, (_, i) => i + 1);


  return (
    <div className="circles-container">
      {circles.map((option) => (
        <Circle key={option} isActive={option === currentOption} />
      ))}
    </div>
  );
};

export default Circles;