import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useExpenseStore } from "@/store/useExpenseStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    backgroundType,
    currentVideo,
    backgroundColor,
    setBackgroundType,
    setCurrentVideo,
    setBackgroundColor,
  } = useExpenseStore();
  const [tempColor, setTempColor] = useState(backgroundColor);

  if (!isOpen) return null;

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentVideo(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Settings</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Background Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setBackgroundType('color')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                  backgroundType === 'color'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                Solid Color
              </button>
              <button
                onClick={() => setBackgroundType('video')}
                className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
                  backgroundType === 'video'
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                Video
              </button>
            </div>
          </div>

          {backgroundType === 'color' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={tempColor}
                  onChange={(e) => {
                    setTempColor(e.target.value);
                    setBackgroundColor(e.target.value);
                  }}
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <span className="text-slate-600 font-mono">{tempColor}</span>
              </div>
              <div className="grid grid-cols-5 gap-2 mt-4">
                {['#f8fafc', '#dbeafe', '#fce7f3', '#fef3c7', '#dcfce7'].map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setTempColor(color);
                      setBackgroundColor(color);
                    }}
                    className="w-full aspect-square rounded-lg border-2 border-slate-200 hover:border-teal-500 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {backgroundType === 'video' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Video
              </label>
              <label className="flex items-center justify-center gap-2 py-4 px-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors">
                <Upload size={20} className="text-slate-500" />
                <span className="text-slate-600">Choose file</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
