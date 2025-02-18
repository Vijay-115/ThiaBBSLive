import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductlistItem from "./ProductlistItem";
import { ProductService } from "../../services/ProductService";

// Custom Previous Arrow
const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="custom-prev absolute -top-12 right-16 rounded z-10"
      onClick={onClick}
    >
      <i className="ri-arrow-left-circle-fill text-blue-400 text-3xl lg:text-4xl"></i>
    </button>
  );
};

// Custom Next Arrow
const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      className="custom-next absolute -top-12 right-5 rounded z-10"
      onClick={onClick}
    >
      <i className="ri-arrow-right-circle-fill text-blue-400 text-3xl lg:text-4xl"></i>
    </button>
  );
};

function ProductList({ heading,type,category,filter  }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Fetch products from API
  useEffect(() => {
    // let skip = category === 'womens-jewellery' ? 0 : 5;
    const fetchProducts = async () => {
      try {
        // const response = await fetch(
        //   `https://dummyjson.com/products/category/${category}?limit=10&skip=${skip}`
        // );
        const data = await ProductService.getProducts();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  // Slider Settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1124,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 880,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
    className: "custom-slider-spacing",
  };

  return (
    <>
        <div className="pb-6 md:pb-12 mt-10 md:mt-5 relative">
            <h3 className="font-quicksand font-bold text-lg md:text-2xl absolute -top-[45px] left-[15px] capitalize">{heading}</h3>
            {type === "Slider" ? (
                <Slider {...settings}>
                {products.map((product) => (
                    <ProductlistItem key={product._id} product={product} />
                ))}
                </Slider>
            ) : (
                <div className={`grid grid-cols-2 ${filter ? 'md:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-3 w-881:grid-cols-4 w-1125:grid-cols-5'} gap-2 sm:gap-5 px-4`}>
                {products.map((product) => (
                <ProductlistItem key={product._id} product={product} />
                ))}
                </div>
            )}
        </div>
    </>
  );
}

export default ProductList;