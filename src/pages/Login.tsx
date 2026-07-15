import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyPassword, PASSWORD_KEY } from "../utils/auth";
import { useExpenseStore } from "@/store/useExpenseStore";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { containerOpacity } = useExpenseStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const storedHash = localStorage.getItem(PASSWORD_KEY);
    if (!storedHash) {
      navigate("/setup-password");
      return;
    }

    const isValid = await verifyPassword(password, storedHash);
    if (isValid) {
      onLogin();
      navigate("/", { replace: true });
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div 
        style={{ backgroundColor: containerOpacity > 0 ? `rgba(15,23,42,${containerOpacity})` : 'transparent' }}
        className="max-w-md w-full backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8"
      >
        <h1 className="text-3xl font-bold text-center text-slate-100 drop-shadow-md mb-8">
          Spend Tracker
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-200 font-medium mb-2">
              Enter Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/20 text-slate-100 placeholder-slate-300"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm font-medium text-center drop-shadow-md">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-teal-500/70 hover:bg-teal-500/90 text-white font-semibold py-3 rounded-xl transition-colors backdrop-blur-md border border-teal-300/30"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
