import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

function ProductlistItem({ type, product }) {
  const [quantities, setQuantities] = useState({}); // To manage quantities for each product

  // Function to handle increment
  const handleIncrement = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 1) + 1,
    }));
  };

  // Function to handle decrement
  const handleDecrement = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max((prevQuantities[id] || 1) - 1, 1),
    }));
  };

  // Function to handle manual input
  const handleInputChange = (id, value) => {
    if (/^\d*$/.test(value)) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [id]: value === "" ? 1 : parseInt(value, 10),
      }));
    }
  };

  return (
    <div
      key={product.id}
      className="product-list-item border rounded-xl shadow-md border-gray-400 hover:border-blue-800 transition ease-in-out p-2 font-Poppins mx-auto"
    >
      <div className="product-img bg-gray-100 rounded-lg mb-1 relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-[200px] h-[200px] object-cover mx-auto w-full rounded-sm"
        />
        <div className="wishlist-sec w-[30px] h-[30px] group absolute top-0 right-0 rounded-full flex items-center justify-center border-[1.5px] border-red-600 bg-white hover:bg-red-600">
          <i className="ri-heart-line text-red-600 group-hover:text-white"></i>
        </div>
      </div>
      <Link to={`/product/${product.id}`} className="no-underline text-black">
        <h5
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1, // Limits to 1 line
            WebkitBoxOrient: "vertical", // Required for -webkit-line-clamp to work
          }}
          className="product-title font-quicksand text-sm leading-4 font-semibold mt-1 hover:text-blue-500"
        >
          {product.title}
        </h5>
      </Link>
      <div className="product-price text-sm font-bold">Rs {product.price}</div>
      <div className="product-rating text-xs font-medium">
        ⭐ {product.rating?.rate || "N/A"}
      </div>
      <div className="product-cart flex flex-row">
        <div className="product-cart-qtysec flex flex-row w-[75%] md:w-[50%]">
          <button
            className="w-1/3"
            onClick={() => handleIncrement(product.id)}
          >
            +
          </button>
          <input
            className="w-1/3 appearance-none p-0 text-center"
            type="text"
            value={quantities[product.id] || 1}
            onChange={(e) => handleInputChange(product.id, e.target.value)}
          />
          <button
            className="w-1/3"
            onClick={() => handleDecrement(product.id)}
          >
            -
          </button>
        </div>
        <div className="cart-btn w-[25%] md:w-[50%]">
          <button className="hidden md:block text-xs w-[90%] float-right py-2 px-1 text-center bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-colors">
            Add to Cart
          </button>
          <div className="w-[30px] sm:w-[50px] md:hidden mx-auto flex justify-center bg-blue-400 p-2 px-4 rounded-md">
            <i className="text-white text-center ri-shopping-cart-2-line"></i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductlistItem;