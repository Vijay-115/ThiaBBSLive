import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

// Async action to place an order
export const placeOrder = createAsyncThunk('order/placeOrder', async (orderData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/place`, orderData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

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