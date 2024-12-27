import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: {}, // { [productId]: { quantity, product } }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
        console.log("Action Payload:", action.payload); // Debugging
    
        const { product } = action.payload;
        // If the product doesn't exist, add it to the wishlist
        state.items[product.id] = { product };
    
        console.log("Wishlist Items After Add:", JSON.parse(JSON.stringify(state.items))); // Log plain object
    },    
    removeFromWishlist: (state, action) => {
        console.log("Action Payload:", action.payload); // Debugging
        const productId = String(action.payload.productId); // Access productId from the payload
        console.log('productId - ', JSON.stringify(productId));

        if (state.items[productId]) {
            delete state.items[productId];
            console.log(`Product ID ${productId} removed.`);
        } else {
            console.log(`Product ID ${productId} not found.`);
        }
        console.log("Wishlist Items After Remove:", JSON.parse(JSON.stringify(state.items))); // Log plain object
    }
  }
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;