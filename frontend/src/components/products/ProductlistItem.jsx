import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import Redux hooks
import { Link } from "react-router-dom"; // Import Link for navigation
import { addToCart, updateQuantity } from "../../slice/cartSlice";
import { toast } from 'react-toastify';

function ProductlistItem({ type, product }) {
  const [quantities, setQuantities] = useState({}); // State to manage product quantities
  const dispatch = useDispatch(); // Redux dispatch function
  const cartItems = useSelector((state) => state.cart.items); // Get cart items from Redux state

  // Handle increment
  const handleIncrement = () => {
    const newQuantity = (quantities[product.id] || 1) + 1;

    setQuantities((prev) => ({
      ...prev,
      [product.id]: newQuantity,
    }));

    dispatch(updateQuantity({ productId: product.id, quantity: newQuantity }));
  };

  // Handle decrement
  const handleDecrement = () => {
    const newQuantity = Math.max((quantities[product.id] || 1) - 1, 1);

    setQuantities((prev) => ({
      ...prev,
      [product.id]: newQuantity,
    }));

    dispatch(updateQuantity({ productId: product.id, quantity: newQuantity }));
  };

  // Handle input change
  const handleInputChange = (value) => {
    if (/^\d*$/.test(value)) {
      const newQuantity = value === "" ? 1 : parseInt(value, 10);

      setQuantities((prev) => ({
        ...prev,
        [product.id]: newQuantity,
      }));

      dispatch(updateQuantity({ productId: product.id, quantity: newQuantity }));
    }
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    const initialQuantity = quantities[product.id] || 1;

    dispatch(addToCart({ product, quantity: initialQuantity }));

    setQuantities((prev) => ({
      ...prev,
      [product.id]: initialQuantity,
    }));
    // Display toast notification
    toast.success(`${product.title} added to cart!`);
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
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
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
          <button className="w-1/3" onClick={handleIncrement}>
            +
          </button>
          <input
            className="w-1/3 appearance-none p-0 text-center"
            type="text"
            value={quantities[product.id] || 1}
            onChange={(e) => handleInputChange(e.target.value)}
          />
          <button className="w-1/3" onClick={handleDecrement}>
            -
          </button>
        </div>
        <div className="cart-btn w-[25%] md:w-[50%]">
          <button
            className="hidden md:block text-xs w-[90%] float-right py-2 px-1 text-center bg-blue-600 text-white rounded-md hover:bg-blue-800 transition-colors"
            onClick={handleAddToCart}
          >
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