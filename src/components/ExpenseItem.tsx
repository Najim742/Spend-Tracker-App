import { Trash2, Edit3 } from "lucide-react";
import { Expense } from "../store/useExpenseStore";

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dayNum = date.getDate();
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const monthName = date.toLocaleDateString("en-US", { month: "long" });
  const yearNum = date.getFullYear();
  return `${dayNum} ${monthName} ${weekday} ${yearNum}`;
}

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

export default function ExpenseItem({ expense, onDelete, onEdit }: ExpenseItemProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-slate-200 flex justify-between items-center">
      <div className="flex-1">
        <p className="text-slate-800 font-medium">{expense.details}</p>
        <p className="text-slate-500 text-sm">{formatDate(expense.date)}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-xl font-semibold text-teal-600">৳{expense.cost.toFixed(2)}</p>
        <button
          onClick={() => onEdit(expense)}
          className="text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Edit3 size={20} />
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
