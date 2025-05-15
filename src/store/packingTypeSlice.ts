import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPackagingTypes } from '../services/api';

export const getPackingTypes = createAsyncThunk(
  'packing-type/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPackagingTypes();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const packingTypeSlice = createSlice({
  name: 'packing-type',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPackingTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPackingTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getPackingTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default packingTypeSlice.reducer;