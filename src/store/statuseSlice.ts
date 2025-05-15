import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStatuses } from '../services/api';

export const getStatuses = createAsyncThunk(
  'statuses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchStatuses();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const statuseSlice = createSlice({
  name: 'statuses',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStatuses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getStatuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default statuseSlice.reducer;