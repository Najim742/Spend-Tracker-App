import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import ExpenseItem from "@/components/ExpenseItem";
import AddExpenseModal from "@/components/AddExpenseModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useExpenseStore, Expense } from "@/store/useExpenseStore";

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const { expenses, groups, addExpense, editExpense, deleteExpense, deleteGroup } = useExpenseStore();
  
  const group = groups.find(g => g.id === groupId);
  const groupExpenses = expenses.filter(e => e.groupId === groupId);
  const groupTotal = groupExpenses.reduce((sum, e) => sum + e.cost, 0);

  if (!group) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <p className="text-lg text-slate-600 mb-4">Group not found</p>
        <button
          onClick={() => navigate("/")}
          className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleDeleteGroup = () => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Group",
      message: "Are you sure you want to delete this group and all its expenses?",
      onConfirm: () => {
        deleteGroup(group.id);
        navigate("/");
      },
    });
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Expense",
      message: "Are you sure you want to delete this expense?",
      onConfirm: () => {
        deleteExpense(expenseId);
      },
    });
  };

  const handleCloseModal = () => {
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-teal-500 text-white py-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">Back</span>
          </button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <p className="text-white/80">Total: ৳{groupTotal.toFixed(2)}</p>
          </div>
          <button
            onClick={handleDeleteGroup}
            className="text-red-200 hover:text-red-100 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {groupExpenses.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg mb-4">No expenses yet in this group!</p>
            </div>
          ) : (
            groupExpenses.map((expense: Expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={handleDeleteExpense}
                onEdit={handleEditExpense}
              />
            ))
          )}
        </div>
      </main>
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => {
            setEditingExpense(null);
            setIsExpenseModalOpen(true);
          }}
          className="bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-full shadow-lg transition-all"
        >
          <Plus size={28} />
        </button>
      </div>
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={handleCloseModal}
        onAdd={addExpense}
        onEdit={editExpense}
        groupId={group.id}
        editingExpense={editingExpense}
      />
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        message={confirmationModal.message}
      />
    </div>
  );
}
