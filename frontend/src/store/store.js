import { configureStore } from "@reduxjs/toolkit";
import cartReducer  from "../slice/cartSlice";
import wishlistReducer from "../slice/wishlistSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
