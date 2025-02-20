import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const BASE_URL = "/orders"; // No need for full URL since `api.js` sets `baseURL`

// Async action to place an order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL, orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("API Response:", response.data); // 🔍 Debugging
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to place order.");
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default orderSlice.reducer;