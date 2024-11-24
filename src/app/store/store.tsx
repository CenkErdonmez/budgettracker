import { configureStore } from "@reduxjs/toolkit";
import budgetSlice from "./budgetSlice";

export const store = configureStore({
  reducer: {
    budget: budgetSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

