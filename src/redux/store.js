import { configureStore } from '@reduxjs/toolkit';
import { campersReducer } from './slices/campersSlice';
import { favoritesReducer } from './slices/favoritesSlice';
import { filtersReducer } from './slices/filtersSlice';

export const store = configureStore({
  reducer: {
    campers: campersReducer,
    favorites: favoritesReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
