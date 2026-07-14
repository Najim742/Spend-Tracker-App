import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyPassword, PASSWORD_KEY } from "../utils/auth";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
          Spend Tracker
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Enter Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}
