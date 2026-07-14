import { useState } from "react";
import { hashPassword, PASSWORD_KEY } from "../utils/auth";

interface PasswordSetupProps {
  onPasswordSet: () => void;
}

export default function PasswordSetup({ onPasswordSet }: PasswordSetupProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const hashedPassword = await hashPassword(password);
    localStorage.setItem(PASSWORD_KEY, hashedPassword);
    onPasswordSet();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
          Set Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Confirm new password"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}
