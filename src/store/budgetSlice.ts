import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface CategoryLimit {
  limit: number;
  currentSpending: number;
  warning: boolean;
}

interface BudgetState {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  transactions: Transaction[];
  categoryLimits: Record<string, CategoryLimit>;
}

export const loadStateFromLocalStorage = <T>(): T | undefined => {
  try {
    const serializedState = localStorage.getItem("budgetState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return undefined;
  }
};

export const saveStateToLocalStorage = <T>(state: T) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("budgetState", serializedState);
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
};

const initialState: BudgetState = loadStateFromLocalStorage() || {
  totalIncome: 0,
  totalExpense: 0,
  totalBalance: 0,
  transactions: [],
  categoryLimits: {},
};

const budgetSlice = createSlice({
  name: "budget",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      const transaction = action.payload;
      state.transactions.push(transaction);

      if (transaction.type === "income") {
        state.totalIncome += transaction.amount;
      } else {
        state.totalExpense += transaction.amount;

        const category = transaction.category;
        if (!state.categoryLimits[category]) {
          state.categoryLimits[category] = {
            limit: Infinity,
            currentSpending: 0,
            warning: false,
          };
        }

        state.categoryLimits[category].currentSpending += transaction.amount;
        if (
          state.categoryLimits[category].currentSpending >=
          state.categoryLimits[category].limit * 0.8
        ) {
          state.categoryLimits[category].warning = true;
        }
      }

      state.totalBalance = state.totalIncome - state.totalExpense;
    },
    setCategoryLimit: (
      state,
      action: PayloadAction<{ category: string; limit: number }>
    ) => {
      const { category, limit } = action.payload;
      if (!state.categoryLimits[category]) {
        state.categoryLimits[category] = {
          limit,
          currentSpending: 0,
          warning: false,
        };
      } else {
        state.categoryLimits[category].limit = limit;
        state.categoryLimits[category].warning =
          state.categoryLimits[category].currentSpending >= limit * 0.8;
      }
    },
  },
});

export const { addTransaction, setCategoryLimit } = budgetSlice.actions;

export default budgetSlice.reducer;

