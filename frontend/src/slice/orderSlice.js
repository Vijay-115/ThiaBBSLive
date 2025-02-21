import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const BASE_URL = "/orders"; // No need for full URL since `api.js` sets `baseURL`

// ✅ Place Order
export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post(BASE_URL, orderData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to place order.");
    }
  }
);

// ✅ Get All Orders
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders.");
    }
  }
);

// ✅ Get Order by ID
export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch order.");
    }
  }
);

// ✅ Get Orders by Status
export const getOrdersByStatus = createAsyncThunk(
  "order/getOrdersByStatus",
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.get(`${BASE_URL}/status/${status}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders by status.");
    }
  }
);

// ✅ Update Order
export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ orderId, orderData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${BASE_URL}/${orderId}`, orderData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update order.");
    }
  }
);

// ✅ Delete Order
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${BASE_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete order.");
    }
  }
);

// 🏗️ **Redux Slice**
const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 📌 Place Order
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
      })

      // 📌 Get All Orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Get Order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Get Orders by Status
      .addCase(getOrdersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(getOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Update Order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(order => order._id !== action.meta.arg);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
