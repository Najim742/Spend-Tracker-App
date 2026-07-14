import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Expense, useExpenseStore } from "../store/useExpenseStore";

function getTodayLocalDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: { details: string; cost: number; date: string; groupId: string }) => void;
  onEdit?: (id: string, expense: { details: string; cost: number; date: string; groupId: string }) => void;
  groupId: string;
  editingExpense?: Expense | null;
}

export default function AddExpenseModal({ isOpen, onClose, onAdd, onEdit, groupId, editingExpense }: AddExpenseModalProps) {
  const [details, setDetails] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState(getTodayLocalDateString());
  const { containerOpacity } = useExpenseStore();

  useEffect(() => {
    if (editingExpense) {
      setDetails(editingExpense.details);
      setCost(editingExpense.cost.toString());
      setDate(editingExpense.date);
    } else {
      setDetails("");
      setCost("");
      setDate(getTodayLocalDateString());
    }
  }, [editingExpense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details || !cost) return;
    if (editingExpense && onEdit) {
      onEdit(editingExpense.id, { details, cost: parseFloat(cost), date, groupId });
    } else {
      onAdd({ details, cost: parseFloat(cost), date, groupId });
    }
    setDetails("");
    setCost("");
    setDate(getTodayLocalDateString());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div 
        style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
        className="backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-100 drop-shadow-md">{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-100">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Details</label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/20 text-slate-100 placeholder-slate-300"
              placeholder="e.g., Coffee, Groceries"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Cost (৳)</label>
            <input
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-3 py-2 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/20 text-slate-100 placeholder-slate-300"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/20 text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500/70 hover:bg-teal-500/90 text-white font-medium py-2 px-4 rounded-xl transition-all backdrop-blur-md border border-teal-300/30"
          >
            {editingExpense ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
