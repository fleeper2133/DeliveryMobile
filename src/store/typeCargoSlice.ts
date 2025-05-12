import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTypeCargo } from '@/services/api';

export const getTypeCargo = createAsyncThunk(
  'type-cargo/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log("response fetchTypeCargo");
      return await fetchTypeCargo();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const typeCargoSlice = createSlice({
  name: 'types-cargo',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTypeCargo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTypeCargo.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getTypeCargo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default typeCargoSlice.reducer;