import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface BudgetState {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  loading: boolean;
}

const initialState: BudgetState = {
  totalBalance: 0,
  totalIncome: 0,
  totalExpense: 0,
  loading: true,
};

export const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    setTotalBalance: (state, action: PayloadAction<number>) => {
      state.totalBalance = action.payload;
    },
    setTotalIncome: (state, action: PayloadAction<number>) => {
      state.totalIncome = action.payload;
    },
    setTotalExpense: (state, action: PayloadAction<number>) => {
      state.totalExpense = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setTotalBalance, setTotalIncome, setTotalExpense, setLoading } =
  budgetSlice.actions;
export default budgetSlice.reducer;
