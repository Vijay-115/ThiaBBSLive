import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../utils/api';

const BASE_URL = "/cart"; // Update this with your backend URL

// ✅ Fetch cart items
export const fetchCartItems = createAsyncThunk("cart/fetchCartItems", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`${BASE_URL}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// ✅ Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    console.log("API:", productId);
      try {
          if (!productId) {
              throw new Error("Product ID is missing");
          }
          const response = await api.post(`${BASE_URL}/add`, { productId, quantity }, { withCredentials: true });
          console.log("API Response:", response.data);
          return response.data;
      } catch (error) {
          return rejectWithValue(error.response?.data || "Error adding product to cart");
      }
  }
);


// ✅ Update item quantity
export const updateQuantity = createAsyncThunk("cart/updateQuantity", async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${BASE_URL}/update`, { productId, quantity }, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// ✅ Remove item from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId, { rejectWithValue }) => {
    try {
        await api.delete(`${BASE_URL}/remove/${productId}`, { withCredentials: true });
        return productId;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// ✅ Clear entire cart
export const clearCart = createAsyncThunk("cart/clearCart", async (_, { rejectWithValue }) => {
    try {
        await api.delete(`${BASE_URL}/clear`, { withCredentials: true });
        return [];
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

// 🔥 Redux Cart Slice
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        status: "idle", // "idle" | "loading" | "succeeded" | "failed"
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartItems.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                const existingItem = state.items.find((item) => item.product._id === action.payload.cartItem.product);
                if (existingItem) {
                    existingItem.quantity += action.payload.cartItem.quantity;
                } else {
                    state.items.push(action.payload.cartItem);
                }
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                const item = state.items.find((item) => item.product._id === action.payload.cartItem.product);
                if (item) {
                    item.quantity = action.payload.cartItem.quantity;
                }
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.product._id !== action.payload);
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
            });
    },
});

export default cartSlice.reducer;