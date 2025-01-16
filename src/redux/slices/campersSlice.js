import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://66b1f8e71ca8ad33d4f5f63e.mockapi.io';

export const fetchCampers = createAsyncThunk(
  'campers/fetchCampers',
  async (params = {}) => {
    try {
      console.log('Fetching campers with params:', params);
      const response = await axios.get(`${BASE_URL}/campers`, { params });
      console.log('API Response:', response.data);
      // Повертаємо тільки масив items з відповіді
      return response.data.items || [];
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  }
);

export const fetchCamperById = createAsyncThunk(
  'campers/fetchCamperById',
  async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/campers/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response || error);
      throw error;
    }
  }
);

const initialState = {
  items: [],
  selectedCamper: null,
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  total: 0
};

const campersSlice = createSlice({
  name: 'campers',
  initialState,
  reducers: {
    clearCampers: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCampers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        
        const newItems = Array.isArray(action.payload) ? action.payload : [];
        console.log('Received items:', newItems);
        
        if (state.page === 1) {
          state.items = newItems;
        } else {
          state.items = [...state.items, ...newItems];
        }
        
        // Оновлюємо hasMore базуючись на кількості отриманих елементів
        state.hasMore = newItems.length === 8;
        state.page += 1;
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        console.error('Redux Error:', action.error);
      })
      .addCase(fetchCamperById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCamperById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCamper = action.payload;
      })
      .addCase(fetchCamperById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCampers } = campersSlice.actions;
export const campersReducer = campersSlice.reducer;
