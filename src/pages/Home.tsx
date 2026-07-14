import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Settings } from "lucide-react";
import AddGroupModal from "../components/AddGroupModal";
import ConfirmationModal from "../components/ConfirmationModal";
import SettingsModal from "../components/SettingsModal";
import Background from "../components/Background";
import { useExpenseStore, Group } from "../store/useExpenseStore";

function GroupCard({
  group,
  onDeleteGroup,
}: {
  group: Group;
  onDeleteGroup: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { expenses, containerOpacity } = useExpenseStore();
  const groupExpenses = expenses.filter((e) => e.groupId === group.id);
  const groupTotal = groupExpenses.reduce((sum, e) => sum + e.cost, 0);

  const handleDeleteGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteGroup(group.id);
  };

  return (
    <div 
      style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
      className="backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden"
    >
      <button
        onClick={() => navigate(`/group/${group.id}`)}
        className="w-full p-4 flex justify-between items-center text-left"
      >
        <div>
          <h3 className="text-xl font-semibold text-slate-100 drop-shadow-md">{group.name}</h3>
          <p className="text-teal-300 font-medium drop-shadow-md">৳{groupTotal.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteGroup}
            className="text-red-300 hover:text-red-100 p-2 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </button>
    </div>
  );
}

export default function Home() {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const [buttonPosition, setButtonPosition] = useState({ x: 20, y: 20 }); // Position from bottom right
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { expenses, groups, addGroup, deleteGroup, containerOpacity } = useExpenseStore();
  const total = expenses.reduce((sum, expense) => sum + expense.cost, 0);

  const handleDeleteGroup = (groupId: string) => {
    setConfirmationModal({
      isOpen: true,
      title: "Delete Group",
      message: "Are you sure you want to delete this group and all its expenses?",
      onConfirm: () => {
        deleteGroup(groupId);
      },
    });
  };

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

  return (
    <div className="min-h-screen">
      <Background />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <div 
            style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
            className="backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-slate-100 drop-shadow-md">Spend Tracker</h1>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Settings 
                  size={24} 
                  className={`text-slate-100 transition-transform duration-300 ${isSettingsModalOpen ? 'rotate-90' : ''}`}
                />
              </button>
            </div>
            <div className="bg-teal-500/20 backdrop-blur-xl rounded-xl p-4 border border-teal-300/30">
              <p className="text-sm text-slate-100 drop-shadow-md">Total Spent</p>
              <p className="text-4xl font-bold text-teal-200 drop-shadow-md">৳{total.toFixed(2)}</p>
            </div>
          </div>
          {groups.length === 0 ? (
            <div 
              style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
              className="text-center py-16 text-slate-100 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg"
            >
              <p className="text-lg mb-4 drop-shadow-md">No groups yet. Add your first group!</p>
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="bg-teal-500/70 hover:bg-teal-500/90 text-white font-medium py-2 px-4 rounded-xl transition-all backdrop-blur-md border border-teal-300/30"
              >
                Add Group
              </button>
            </div>
          ) : (
            groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onDeleteGroup={handleDeleteGroup}
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
              setIsGroupModalOpen(true);
            }
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
          className="hover:bg-slate-900/90 text-white p-4 rounded-full shadow-xl transition-all backdrop-blur-xl border border-white/20"
        >
          <span className="text-2xl font-bold">+G</span>
        </button>
      </div>
      <AddGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onAdd={addGroup}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
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