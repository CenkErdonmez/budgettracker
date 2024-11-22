import { configureStore } from "@reduxjs/toolkit";
import budgetReducer from "./budgetSlice";
import {
  saveStateToLocalStorage,
  loadStateFromLocalStorage,
} from "./budgetSlice";

const persistedState = loadStateFromLocalStorage();
export const store = configureStore({
  reducer: {
    budget: budgetReducer,
  },
  preloadedState: persistedState ? { budget: persistedState } : undefined,
});

store.subscribe(() => {
  saveStateToLocalStorage(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

