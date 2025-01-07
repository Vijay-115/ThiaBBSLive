import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SingleProductGallery({ images }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const mainSliderRef = useRef(null);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_, next) => setCurrentImage(next),
  };

  const thumbnailsSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
    arrows: true,
    beforeChange: (_, next) => setCurrentImage(next),
  };

  const handleThumbnailClick = (index) => {
    setCurrentImage(index);
    mainSliderRef.current.slickGoTo(index); // Synchronize the main slider
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${images[currentImage]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%", // Adjust zoom level
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[900px]">
        {/* Main Image with Zoom Effect */}
        <div
          className="main-image-container mb-4 relative overflow-hidden border border-gray-200 rounded-lg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={zoomStyle}
        >
          <Slider ref={mainSliderRef} {...sliderSettings}>
            {images.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`product-${index + 1}`}
                  className="w-full h-auto max-h-[500px] object-contain"
                  style={zoomStyle.backgroundImage ? { visibility: "hidden" } : {}}
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Thumbnail Slider */}
        <Slider {...thumbnailsSettings} className="thumbnail-slider">
          {images.map((img, index) => (
            <div
              key={index}
              className={`px-2 ${
                currentImage === index ? "border rounded-md border-primary" : ""
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <img
                src={img}
                alt={`thumbnail-${index + 1}`}
                className="rounded-lg mx-auto max-h-[100px] object-contain cursor-pointer"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default SingleProductGallery;