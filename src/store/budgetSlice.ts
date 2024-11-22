import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
}
export type { Transaction };

const totalIncomeStorage =
  typeof window !== "undefined" && localStorage.getItem("totalIncome")
    ? JSON.parse(localStorage.getItem("totalIncome") as string)
    : 0;

const totalExpenseStorage =
  typeof window !== "undefined" && localStorage.getItem("totalExpense")
    ? JSON.parse(localStorage.getItem("totalExpense") as string)
    : 0;

const totalBalanceStorage =
  typeof window !== "undefined" && localStorage.getItem("totalBalance")
    ? JSON.parse(localStorage.getItem("totalBalance") as string)
    : 0;

interface BudgetState {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  transactions: Transaction[];
  categoryLimits: Record<string, number>;
}
export type { BudgetState };
const initialState: BudgetState = {
  totalIncome: totalIncomeStorage || 0,
  totalExpense: totalExpenseStorage || 0,
  totalBalance: totalBalanceStorage || 0,
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

