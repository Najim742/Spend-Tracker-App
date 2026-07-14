import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Expense {
  id: string;
  details: string;
  cost: number;
  date: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
}

interface ExpenseStore {
  expenses: Expense[];
  groups: Group[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  editExpense: (id: string, expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  addGroup: (group: Omit<Group, "id">) => void;
  deleteGroup: (id: string) => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      groups: [],
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, id: crypto.randomUUID() },
          ],
        })),
      editExpense: (id, expense) =>
        set((state) => ({
          expenses: state.expenses.map((e) => e.id === id ? { ...expense, id } : e),
        })),
      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),
      addGroup: (group) =>
        set((state) => ({
          groups: [...state.groups, { ...group, id: crypto.randomUUID() }],
        })),
      deleteGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== id),
          expenses: state.expenses.filter((e) => e.groupId !== id),
        })),
    }),
    {
      name: "expense-storage",
    }
  )
);
