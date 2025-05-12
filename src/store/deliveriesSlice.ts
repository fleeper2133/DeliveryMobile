// src/store/deliveriesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDeliveries, createDelivery, completeDelivery, fetchDelivery, updateDelivery } from '@/services/api';

export const getDeliveries = createAsyncThunk(
  'deliveries/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
        console.log('Перед вызовом fetchDeliveries');
      return await fetchDeliveries();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// deliveriesSlice.ts
export const createDeliveryStore = createAsyncThunk(
  'deliveries/create',
  async (deliveryData, { rejectWithValue }) => {
    try {
      const response = await createDelivery(deliveryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeDeliveryStore = createAsyncThunk(
  'deliveries/complete',
  async (deliveryId, { rejectWithValue }) => {
    try {
      return await completeDelivery(deliveryId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDeliveryDetails = createAsyncThunk(
  'deliveries/fetchDetail',
  async (deliveryId, { rejectWithValue }) => {
    try {
      return await fetchDelivery(deliveryId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDeliveryStore = createAsyncThunk(
  'deliveries/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('Перед вызовом updateDelivery', id, data);
      return await updateDelivery(id, data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(completeDeliveryStore.fulfilled, (state, action) => {
        const index = state.items.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
  },
});

export default deliveriesSlice.reducer;