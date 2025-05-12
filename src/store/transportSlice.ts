import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTransports } from '@/services/api';

export const getTransports = createAsyncThunk(
  'transports/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log("response fetchTransports");
      return await fetchTransports();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const transportSlice = createSlice({
  name: 'transports',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransports.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getTransports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default transportSlice.reducer;