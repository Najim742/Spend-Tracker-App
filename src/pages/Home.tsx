import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import AddGroupModal from "../components/AddGroupModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useExpenseStore, Group } from "../store/useExpenseStore";

function GroupCard({
  group,
  onDeleteGroup,
}: {
  group: Group;
  onDeleteGroup: (id: string) => void;
}) {
  const navigate = useNavigate();
  const { expenses } = useExpenseStore();
  const groupExpenses = expenses.filter((e) => e.groupId === group.id);
  const groupTotal = groupExpenses.reduce((sum, e) => sum + e.cost, 0);

  const handleDeleteGroup = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteGroup(group.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={() => navigate(`/group/${group.id}`)}
        className="w-full p-4 flex justify-between items-center text-left"
      >
        <div>
          <h3 className="text-xl font-semibold text-slate-800">{group.name}</h3>
          <p className="text-teal-600 font-medium">৳{groupTotal.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteGroup}
            className="text-red-500 hover:text-red-700 p-2 rounded-lg transition-colors"
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
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const { expenses, groups, addGroup, deleteGroup } = useExpenseStore();
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

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-teal-500 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Spend Tracker</h1>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm opacity-80">Total Spent</p>
            <p className="text-4xl font-bold">৳{total.toFixed(2)}</p>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {groups.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg mb-4">No groups yet. Add your first group!</p>
              <button
                onClick={() => setIsGroupModalOpen(true)}
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setIsGroupModalOpen(true)}
          className="bg-slate-700 hover:bg-slate-800 text-white p-4 rounded-full shadow-lg transition-all"
        >
          <span className="text-2xl font-bold">+G</span>
        </button>
      </div>
      <AddGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        onAdd={addGroup}
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