import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Import Swiper styles
import Button from "../layout/Button";

// HeroSection Component
const HeroSection = () => {
  // Slide Data
  const slides = [
    {
      id: 1,
      offer: "Flat 30% Off",
      title: "Explore Gold & Silver Jewellery",
      image: "/img/hero/girl.png",
      link: "/product/category/womens-jewellery",
    },
    {
      id: 2,
      offer: "Flat 30% Off",
      title: "Explore Organic & Fresh Vegetables",
      image: "/img/hero/family.png",
      link: "/groceries/fruits-vegetables",
    },
  ];

  return (
    <section className="hero-section section-hero mb-5 sm:mb-8">
      {/* Hero Slider */}
      <Swiper spaceBetween={50} slidesPerView={1} loop={true}>
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-content-sec flex flex-col md:flex-row md:flex-wrap items-center px-4 md:px-16">
              {/* Left Section */}
              <div className="hero-text pt-5 md:pt-0 w-[85%] md:w-[50%] lg:pl-20 order-2 md:order-1">
                <p className="offer-text font-quicksand font-bold text-sm lg:text-lg">{slide.offer}</p>
                <h1 className="hero-title font-quicksand font-bold text-xl lg:text-2xl xl:text-3xl">
                  {slide.title.split("&")[0]}{" "}
                  <span className="highlighted-text text-blue-400">
                    {slide.title.split("&")[1]}
                  </span>
                </h1>
                <Button link={slide.link} name='Shop Now'/>
              </div>

              {/* Right Section */}
              <div className="hero-image-wrapper w-[100%] md:w-[50%] order-1 md:order-2">
                <img className="max-w-[250px] md:max-w-[350px] w-[100%] mx-auto max-h-[250px] md:max-h-[450px] object-cover object-top" src={slide.image} alt={slide.title} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;