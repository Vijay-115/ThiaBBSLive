import React, { useState } from "react";
import "../../RangeSlider.css";

const PriceRangeSlider = ({ min = 0, max = 1000, step = 10 }) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const handleMinChange = (event) => {
    const value = Math.min(Number(event.target.value), maxValue - step);
    setMinValue(value);
  };

  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minValue + step);
    setMaxValue(value);
  };

  const getPercentage = (value) => ((value - min) / (max - min)) * 100;

  return (
    <>
      <div className="relative bg-white rounded-sm p-2 text-center m-2">
        <div className="flex font-quicksand text-lg font-semibold flex-row justify-center">
          <div className="" style={{ left: `${getPercentage(minValue)}%` }}>
            ₹{minValue}
          </div>
          <span className="inline-block mx-2"> - </span>  
          <div className="" style={{ left: `${getPercentage(maxValue)}%` }}>
            ₹{maxValue}
          </div>
        </div>
      </div>
      <div className="price-range-slider">
        <div className="slider-track">
          <div
            className="slider-range"
            style={{
              left: `${getPercentage(minValue)}%`,
              right: `${100 - getPercentage(maxValue)}%`,
            }}
          ></div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="slider-thumb"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="slider-thumb"
        />
      </div>
    </>
  );
};

export default PriceRangeSlider;
