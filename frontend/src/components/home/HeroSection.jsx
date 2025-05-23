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
      image: "/img/hero/thia_banner1.JPG",
      link: "/product/category/womens-jewellery",
    },
    {
      id: 2,
      offer: "Flat 30% Off",
      title: "Explore Organic & Fresh Vegetables",
      image: "/img/hero/thia_banner2.JPG",
      link: "/groceries/fruits-vegetables",
    },
    {
      id: 3,
      offer: "Flat 30% Off",
      title: "Explore Organic & Fresh Vegetables",
      image: "/img/hero/thia_banner3.JPG",
      link: "/groceries/fruits-vegetables",
    },
    {
      id: 4,
      offer: "Flat 30% Off",
      title: "Explore Organic & Fresh Vegetables",
      image: "/img/hero/thia_banner4.JPG",
      link: "/groceries/fruits-vegetables",
    },
    {
      id: 5,
      offer: "Flat 30% Off",
      title: "Explore Organic & Fresh Vegetables",
      image: "/img/hero/grocery_banner1.JPG",
      link: "/groceries/fruits-vegetables",
    },
    {
      id: 6,
      offer: "Flat 30% Off",
      title: "Explore Organic & Fresh Vegetables",
      image: "/img/hero/grocery_banner2.JPG",
      link: "/groceries/fruits-vegetables",
    },
    {
      id: 7,
      offer: "Flat 30% Off",
      title: "Explore Organic & Fresh Vegetables",
      image: "/img/hero/grocery_banner3.JPG",
      link: "/groceries/fruits-vegetables",
    },
    {
      id: 8,
      offer: "Flat 30% Off",
      title: "Explore Organic & Fresh Vegetables",
      image: "/img/hero/grocery_banner4.JPG",
      link: "/groceries/fruits-vegetables",
    },
  ];

  return (   

    <section className="hero-section section-hero mb-5 sm:mb-8">
      {/* Hero Slider */}
      <Swiper spaceBetween={50} slidesPerView={1} loop={true}>
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="hero-content-sec flex flex-col md:flex-row md:flex-wrap items-center">
              <div className="hero-image-wrapper w-[100%] order-1 md:order-2">
                <img className="w-[100%] mx-auto object-cover object-center" style={{height: '100%'}} src={slide.image} alt={slide.title} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSection;