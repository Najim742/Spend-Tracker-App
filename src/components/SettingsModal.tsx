import { useState, useEffect } from "react";
import { X, Upload, Save } from "lucide-react";
import { useExpenseStore } from "@/store/useExpenseStore";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const {
    currentVideo: savedCurrentVideo,
    containerOpacity: savedContainerOpacity,
    backgroundOverlayOpacity: savedBackgroundOverlayOpacity,
    setCurrentVideo,
    setContainerOpacity,
    setBackgroundOverlayOpacity,
    containerOpacity,
  } = useExpenseStore();

  // Temporary state for editing before saving
  const [tempCurrentVideo, setTempCurrentVideo] = useState(savedCurrentVideo);
  const [tempContainerOpacity, setTempContainerOpacity] = useState(savedContainerOpacity);
  const [tempBackgroundOverlayOpacity, setTempBackgroundOverlayOpacity] = useState(savedBackgroundOverlayOpacity);

  // Reset temp state when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempCurrentVideo(savedCurrentVideo);
      setTempContainerOpacity(savedContainerOpacity);
      setTempBackgroundOverlayOpacity(savedBackgroundOverlayOpacity);
    }
  }, [isOpen, savedCurrentVideo, savedContainerOpacity, savedBackgroundOverlayOpacity]);

  if (!isOpen) return null;

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempCurrentVideo(url);
    }
  };

  const handleSave = () => {
    setCurrentVideo(tempCurrentVideo);
    setContainerOpacity(tempContainerOpacity);
    setBackgroundOverlayOpacity(tempBackgroundOverlayOpacity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div 
        style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
        className="backdrop-blur-xl rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-100 drop-shadow-md">Settings</h2>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-100">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Background Settings Group */}
          <div className="border border-white/20 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">Background Settings</h3>
            
            {/* Video Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Upload Background Video
              </label>
              <label className="flex items-center justify-center gap-2 py-4 px-6 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-500/20 transition-colors">
                <Upload size={20} className="text-slate-300" />
                <span className="text-slate-200">Choose file</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Container Opacity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Container Opacity: {(tempContainerOpacity * 1000).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.005"
                value={tempContainerOpacity}
                onChange={(e) => setTempContainerOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Background Overlay Opacity */}
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Background Overlay Opacity: {(tempBackgroundOverlayOpacity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={tempBackgroundOverlayOpacity}
                onChange={(e) => setTempBackgroundOverlayOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-teal-500/70 hover:bg-teal-500/90 text-white font-medium py-2 px-4 rounded-xl transition-all backdrop-blur-md border border-teal-300/30 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
