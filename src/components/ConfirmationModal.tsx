import { X } from "lucide-react";
import { useExpenseStore } from "@/store/useExpenseStore";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmationModalProps) {
  const { containerOpacity } = useExpenseStore();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
        className="backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl border border-white/20"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-100 drop-shadow-md">{title}</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-100">
            <X size={24} />
          </button>
        </div>
        <p className="text-slate-200 mb-6 drop-shadow-md">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-500/40 hover:bg-slate-500/60 text-slate-100 font-medium py-2 px-4 rounded-xl transition-all backdrop-blur-md border border-slate-300/30"
          >
            No
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-red-500/70 hover:bg-red-500/90 text-white font-medium py-2 px-4 rounded-xl transition-all backdrop-blur-md border border-red-300/30"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
