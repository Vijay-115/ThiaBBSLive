import { configureStore } from "@reduxjs/toolkit";
import cartReducer  from "../slice/cartSlice";
import wishlistReducer from "../slice/wishlistSlice";
import orderReducer from "../slice/orderSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  },
});

export default store;
