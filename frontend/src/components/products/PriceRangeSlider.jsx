import React from "react";
import "../../RangeSlider.css";

const PriceRangeSlider = ({ min, max, step, value, onChange }) => {
  const { min: minValue, max: maxValue } = value;

  const handleMinChange = (event) => {
    const newMin = Math.min(Number(event.target.value), maxValue - step);
    onChange({ min: newMin, max: maxValue });
  };

  const handleMaxChange = (event) => {
    const newMax = Math.max(Number(event.target.value), minValue + step);
    onChange({ min: minValue, max: newMax });
  };

  const getPercentage = (val) => ((val - min) / (max - min)) * 100;

  return (
    <>
      <div className="relative bg-white rounded-sm p-2 text-center m-2">
        <div className="flex font-quicksand text-lg font-semibold flex-row justify-center">
          <div style={{ left: `${getPercentage(minValue)}%` }}>
            ₹{minValue}
          </div>
          <span className="inline-block mx-2"> - </span>
          <div style={{ left: `${getPercentage(maxValue)}%` }}>
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