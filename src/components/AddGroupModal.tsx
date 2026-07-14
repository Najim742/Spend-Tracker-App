import { useState } from "react";
import { X } from "lucide-react";
import { useExpenseStore } from "@/store/useExpenseStore";

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (group: { name: string }) => void;
}

export default function AddGroupModal({ isOpen, onClose, onAdd }: AddGroupModalProps) {
  const [name, setName] = useState("");
  const { containerOpacity } = useExpenseStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim() });
    setName("");
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
          <h2 className="text-xl font-semibold text-slate-100 drop-shadow-md">Add Group</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-100">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/20 text-slate-100 placeholder-slate-300"
              placeholder="e.g. Food, Transport"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500/70 hover:bg-teal-500/90 text-white font-medium py-2 px-4 rounded-xl transition-all backdrop-blur-md border border-teal-300/30"
          >
            Add Group
          </button>
        </form>
      </div>
    </div>
  );
}
