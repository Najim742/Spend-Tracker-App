import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import ExpenseItem from "@/components/ExpenseItem";
import AddExpenseModal from "@/components/AddExpenseModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import Background from "@/components/Background";
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
  const [buttonPosition, setButtonPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { expenses, groups, addExpense, editExpense, deleteExpense, deleteGroup, containerOpacity } = useExpenseStore();
  
  const group = groups.find(g => g.id === groupId);
  const groupExpenses = expenses.filter(e => e.groupId === groupId);
  const groupTotal = groupExpenses.reduce((sum, e) => sum + e.cost, 0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    });
  };

  React.useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const newX = window.innerWidth - clientX + dragOffset.x;
        const newY = window.innerHeight - clientY + dragOffset.y;
        setButtonPosition({ 
          x: Math.max(0, Math.min(window.innerWidth - 64, newX)), 
          y: Math.max(0, Math.min(window.innerHeight - 64, newY)) 
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  if (!group) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Background />
        <div 
        style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
        className="backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
      >
          <p className="text-lg text-slate-100 mb-4 drop-shadow-md">Group not found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-teal-500/70 hover:bg-teal-500/90 text-white font-medium py-2 px-4 rounded-xl transition-all backdrop-blur-md border border-teal-300/30"
          >
            Go Home
          </button>
        </div>
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
    <div className="min-h-screen">
      <Background />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <div 
          style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
          className="backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
        >
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 hover:bg-white/20 p-2 rounded-lg transition-colors text-slate-100"
              >
                <ArrowLeft size={24} />
                <span className="font-medium">Back</span>
              </button>
              <div className="text-center flex-1">
                <h1 className="text-2xl font-bold text-slate-100 drop-shadow-md">{group.name}</h1>
                <p className="text-teal-300 font-medium drop-shadow-md">Total: ৳{groupTotal.toFixed(2)}</p>
              </div>
              <button
                onClick={handleDeleteGroup}
                className="text-red-300 hover:text-red-100 hover:bg-red-500/20 p-2 rounded-lg transition-colors"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
          {groupExpenses.length === 0 ? (
            <div 
            style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
            className="text-center py-16 text-slate-100 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg"
          >
              <p className="text-lg mb-4 drop-shadow-md">No expenses yet in this group!</p>
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
      <div 
        style={{ 
          position: 'fixed', 
          right: buttonPosition.x, 
          bottom: buttonPosition.y,
          touchAction: 'none'
        }}
      >
        <button
          onClick={(e) => {
            if (!isDragging) {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
          className="hover:bg-slate-900/90 text-white p-4 rounded-full shadow-xl transition-all backdrop-blur-xl border border-white/20"
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
