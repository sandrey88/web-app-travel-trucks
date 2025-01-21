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
  vehicleType: {
    panelTruck: camper.form === "panelTruck",
    fullyIntegrated: camper.form === "fullyIntegrated",
    alcove: camper.form === "alcove",
  },
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
      const state = getState();
      const filters = state.filters;
      let allTransformedItems = [];

      // Only fetch from API on first page or if we don't have items
      if (page === 1 || state.campers.allItems.length === 0) {
        const response = await getCampers({
          page: 1,
          limit: 100,
        });

        if (!response || !Array.isArray(response.items)) {
          throw new Error("Invalid response format from API");
        }

        allTransformedItems = response.items.map(transformCamperForCatalog);
      } else {
        allTransformedItems = state.campers.allItems;
      }

      // Prepare filters
      const activeFilters = {};

      if (filters.location?.trim()) {
        activeFilters.location = filters.location.trim();
      }

      if (filters.vehicleType) {
        activeFilters.vehicleType = filters.vehicleType;
      }

      Object.entries(filters.features)
        .filter(([_, value]) => value)
        .forEach(([key]) => {
          activeFilters[key] = true;
        });

      // Apply filters
      let filteredItems = allTransformedItems.filter((camper) => {
        // Filter by location if specified
        if (
          activeFilters.location &&
          !camper.location
            ?.toLowerCase()
            .includes(activeFilters.location.toLowerCase())
        ) {
          return false;
        }

        // Filter by vehicle type (form) if specified
        if (
          activeFilters.vehicleType &&
          camper.form !== activeFilters.vehicleType
        ) {
          return false;
        }

        // Filter by features
        for (const [feature, isRequired] of Object.entries(activeFilters)) {
          if (
            isRequired &&
            feature !== "location" &&
            feature !== "vehicleType"
          ) {
            if (!camper.features[feature]) {
              return false;
            }
          }
        }

        return true;
      });

      // Calculate pagination
      const itemsPerPage = 8;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedItems = filteredItems.slice(startIndex, endIndex);

      return {
        items: paginatedItems,
        total: filteredItems.length,
        page,
        allItems: filteredItems,
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
  allItems: [], // Store all fetched items
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
      state.allItems = [];
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

        const { items, total, page, allItems } = action.payload;

        if (page === 1) {
          state.items = items;
          state.allItems = allItems; // Store all items on first load
        } else {
          // Append new items to existing ones
          state.items = [...state.items, ...items];
        }

        state.total = total;
        state.hasMore = state.items.length < total;
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        if (state.page === 1) {
          state.items = [];
          state.allItems = [];
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
