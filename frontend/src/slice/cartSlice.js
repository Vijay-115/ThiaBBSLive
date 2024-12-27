import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {}, // { [productId]: { quantity, product } }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
        console.log("Action Payload:", action.payload); // Debugging
        const { product, quantity } = action.payload;
        if (!state.items[product.id]) {
            state.items[product.id] = { product, quantity }; // Add new product
        }
        console.log("Cart Items After Add:", JSON.parse(JSON.stringify(state.items))); // Log plain object
    },          
    updateQuantity: (state, action) => {
        const { productId, quantity } = action.payload;
        if (state.items[productId]) {
          state.items[productId].quantity = quantity;
        }
    },      
    removeFromCart: (state, action) => {
        console.log("Action Payload:", action.payload); // Debugging
        const productId = String(action.payload); // Ensure consistent type
        if (state.items[productId]) {
          delete state.items[productId];
          console.log(`Product ID ${productId} removed.`);
        } else {
          console.log(`Product ID ${productId} not found.`);
        }
        console.log("Cart Items After Remove:", JSON.parse(JSON.stringify(state.items))); // Log plain object
    },            
  },
});

export const { addToCart, updateQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;