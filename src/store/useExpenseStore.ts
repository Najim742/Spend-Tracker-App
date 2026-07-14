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
  currentVideo: string;
  containerOpacity: number;
  backgroundOverlayOpacity: number;
  addExpense: (expense: Omit<Expense, "id">) => void;
  editExpense: (id: string, expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  addGroup: (group: Omit<Group, "id">) => void;
  deleteGroup: (id: string) => void;
  setCurrentVideo: (video: string) => void;
  setContainerOpacity: (opacity: number) => void;
  setBackgroundOverlayOpacity: (opacity: number) => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: [],
      groups: [],
      currentVideo: '/background.mp4',
      containerOpacity: 0.05,
      backgroundOverlayOpacity: 0.2,
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
      setCurrentVideo: (video) => set({ currentVideo: video }),
      setContainerOpacity: (opacity) => set({ containerOpacity: opacity }),
      setBackgroundOverlayOpacity: (opacity) => set({ backgroundOverlayOpacity: opacity }),
    }),
    {
      name: "expense-storage",
    }
  )
);
