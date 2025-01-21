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
  async ({ page = 1, limit = 8 }, { getState }) => {
    try {
      const filters = getState().filters;
      const activeFilters = {
        location: filters.location || undefined,
        type: filters.vehicleType || undefined,
        ...Object.keys(filters.features)
          .filter((key) => filters.features[key])
          .reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      };

      const response = await getCampers({
        page,
        limit,
        filters: activeFilters,
      });

      // Ensure we have the expected data structure
      if (!response || !Array.isArray(response.items)) {
        throw new Error("Invalid response format from API");
      }

      return {
        items: response.items.map(transformCamperForCatalog),
        total: response.total || response.items.length,
      };
    } catch (error) {
      console.error("API Error:", error);
      throw error;
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

        const { items, total } = action.payload;
        const itemsPerPage = 8;
        const startIndex = (state.page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Get items for current page
        const pageItems = items.slice(startIndex, endIndex);

        if (state.page === 1) {
          state.items = pageItems;
        } else {
          // Filter out duplicates based on ID
          const existingIds = new Set(state.items.map((item) => item.id));
          const uniqueNewItems = pageItems.filter(
            (item) => !existingIds.has(item.id)
          );
          state.items = [...state.items, ...uniqueNewItems];
        }

        state.total = total;
        state.hasMore = endIndex < total;
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
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
