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
  backgroundType: 'video' | 'color';
  currentVideo: string;
  backgroundColor: string;
  addExpense: (expense: Omit<Expense, "id">) => void;
  editExpense: (id: string, expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  addGroup: (group: Omit<Group, "id">) => void;
  deleteGroup: (id: string) => void;
  setBackgroundType: (type: 'video' | 'color') => void;
  setCurrentVideo: (video: string) => void;
  setBackgroundColor: (color: string) => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      groups: [],
      backgroundType: 'color',
      currentVideo: '/background.mp4',
      backgroundColor: '#f8fafc',
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
      setBackgroundType: (type) => set({ backgroundType: type }),
      setCurrentVideo: (video) => set({ currentVideo: video }),
      setBackgroundColor: (color) => set({ backgroundColor: color }),
    }),
    {
      name: "expense-storage",
    }
  )
);
