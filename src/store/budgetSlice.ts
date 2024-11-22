import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
}

interface BudgetState {
  transactions: Transaction[];
  categoryLimits: Record<string, number>;
}

const initialState: BudgetState = {
  transactions: [],
  categoryLimits: {},
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.push(action.payload);
    },
    setCategoryLimit: (
      state,
      action: PayloadAction<{ category: string; limit: number }>
    ) => {
      state.categoryLimits[action.payload.category] = action.payload.limit;
    },
  },
});

export const { addTransaction, setCategoryLimit } = budgetSlice.actions;
export default budgetSlice.reducer;
