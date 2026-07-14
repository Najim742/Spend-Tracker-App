import { Trash2, Edit3 } from "lucide-react";
import { Expense, useExpenseStore } from "../store/useExpenseStore";

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
  const { containerOpacity } = useExpenseStore();
  return (
    <div 
      style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
      className="backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 flex justify-between items-center"
    >
      <div className="flex-1">
        <p className="text-slate-100 font-medium drop-shadow-md">{expense.details}</p>
        <p className="text-slate-200 text-sm drop-shadow-md">{formatDate(expense.date)}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className="text-xl font-semibold text-teal-300 drop-shadow-md">৳{expense.cost.toFixed(2)}</p>
        <button
          onClick={() => onEdit(expense)}
          className="text-slate-300 hover:text-slate-100 transition-colors"
        >
          <Edit3 size={20} />
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="text-red-300 hover:text-red-100 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
