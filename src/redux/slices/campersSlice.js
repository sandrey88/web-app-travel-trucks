import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { getCampers, getCamperById } from "../../services/api";

// Transform camper data for catalog display
const transformCamperForCatalog = (camper) => ({
  id: camper.id,
  name: camper.name,
  price: camper.price,
  rating: camper.rating,
  reviews: camper.reviews || [],
  location: camper.location,
  description:
    camper.description?.length > 150
      ? `${camper.description.slice(0, 150)}...`
      : camper.description || "",
  gallery: camper.gallery || [],
  features: {
    AC: camper.AC || false,
    automatic: camper.automatic || false,
    bathroom: camper.bathroom || false,
    kitchen: camper.kitchen || false,
    TV: camper.TV || false,
    radio: camper.radio || false,
    refrigerator: camper.refrigerator || false,
    microwave: camper.microwave || false,
    gas: camper.gas || false,
    water: camper.water || false,
  },
  type: camper.type || "",
  form: camper.form,
  length: camper.length,
  width: camper.width,
  height: camper.height,
  tank: camper.tank,
  consumption: camper.consumption,
});

export const fetchCampers = createAsyncThunk(
  "campers/fetchCampers",
  async ({ page = 1 } = {}, { getState }) => {
    try {
      const filters = getState().filters;
      
      // Prepare filters
      const activeFilters = {};
      
      // Add location filter if present
      if (filters.location?.trim()) {
        activeFilters.location = filters.location.trim();
      }
      
      // Add vehicle type filter if present
      if (filters.vehicleType) {
        activeFilters.type = filters.vehicleType;
      }
      
      // Add feature filters
      Object.entries(filters.features)
        .filter(([_, value]) => value)
        .forEach(([key]) => {
          activeFilters[key] = true;
        });

      // Get all campers first
      const response = await getCampers({
        page,
        limit: 8,
      });

      if (!response || !Array.isArray(response.items)) {
        throw new Error("Invalid response format from API");
      }

      // Transform and filter campers locally
      let filteredItems = response.items
        .map(transformCamperForCatalog)
        .filter(camper => {
          // Filter by location if specified
          if (activeFilters.location && 
              !camper.location?.toLowerCase().includes(activeFilters.location.toLowerCase())) {
            return false;
          }

          // Filter by vehicle type if specified
          if (activeFilters.type && camper.type !== activeFilters.type) {
            return false;
          }

          // Filter by features
          for (const [feature, isRequired] of Object.entries(activeFilters)) {
            if (isRequired && feature !== 'location' && feature !== 'type') {
              if (!camper.features[feature]) {
                return false;
              }
            }
          }

          return true;
        });

      return {
        items: filteredItems,
        total: filteredItems.length,
        page,
      };
    } catch (error) {
      console.error("API Error:", error);
      throw new Error("Failed to fetch campers. Please try again.");
    }
  }
);

export const fetchCamperById = createAsyncThunk(
  "campers/fetchCamperById",
  async (id) => {
    try {
      const data = await getCamperById(id);
      if (!data) {
        throw new Error("Camper not found");
      }
      return transformCamperForCatalog(data);
    } catch (error) {
      console.error("API Error:", error);
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
  total: 0,
};

const campersSlice = createSlice({
  name: "campers",
  initialState,
  reducers: {
    clearCampers: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
      state.total = 0;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetPagination: (state) => {
      state.page = 1;
      state.hasMore = true;
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

        const { items, total, page } = action.payload;

        if (page === 1) {
          state.items = items;
        } else {
          const existingIds = new Set(state.items.map((item) => item.id));
          const uniqueNewItems = items.filter(
            (item) => !existingIds.has(item.id)
          );
          state.items = [...state.items, ...uniqueNewItems];
        }

        state.total = total;
        state.hasMore = state.items.length < total;
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        if (state.page === 1) {
          state.items = [];
        }
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

export const { clearCampers, setPage, resetPagination } = campersSlice.actions;
export const campersReducer = campersSlice.reducer;

// Memoized selectors
const selectCampersState = (state) => state.campers;

export const selectCampers = createSelector(
  [selectCampersState],
  (campersState) => campersState.items
);

export const selectPagination = createSelector(
  [selectCampersState],
  (campersState) => ({
    page: campersState.page,
    total: campersState.total,
  })
);

export const selectHasMore = createSelector(
  [selectCampersState],
  (campersState) => campersState.hasMore
);

export const selectIsLoading = createSelector(
  [selectCampersState],
  (campersState) => campersState.isLoading
);

export const selectError = createSelector(
  [selectCampersState],
  (campersState) => campersState.error
);
