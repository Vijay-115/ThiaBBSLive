import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SectionCategory = () => {
  const categories = [
    { id: 1, name: "Fruits", items: 485, bgColor: "#fef1f1", icon: "/img/category/1.png" },
    { id: 2, name: "Grocery", items: 291, bgColor: "#e1fcf2", icon: "/img/category/2.png" },
    { id: 3, name: "Cold Drinks", items: 49, bgColor: "#f4f1fe", icon: "/img/category/3.png" },
    { id: 4, name: "Jewellery", items: 8, bgColor: "#fbf9e4", icon: "/img/category/4.png" },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4, // Adjust based on the number of visible slides
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768, // Adjust for mobile
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024, // Adjust for tablets
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="category-carousel pb-6 md:pb-12">
      <h2 className="font-quicksand text-center text-lg md:text-xl lg:text-2xl font-bold md:mb-4">Explore Categories</h2>
      <div className="container mx-auto">
        <Slider {...settings}>
          {categories.map((category) => (
            <div key={category.id} className="p-4">
              <div
                className="category-box p-6 rounded-lg flex flex-col items-center text-center"
                style={{ backgroundColor: category.bgColor }}
              >
                <div className="category-image mb-4">
                  <img src={category.icon} alt={category.name} className="w-16 h-16" />
                </div>
                <h5 className="text-md md:text-lg font-semibold mb-2">{category.name}</h5>
                <p className="text-sm text-gray-600">{category.items} items</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SectionCategory;