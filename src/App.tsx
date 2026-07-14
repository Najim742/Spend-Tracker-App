import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import GroupDetail from "@/pages/GroupDetail";
import Login from "@/pages/Login";
import PasswordSetup from "@/pages/PasswordSetup";
import { PASSWORD_KEY } from "@/utils/auth";

export default function App() {
  const [hasPassword, setHasPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPassword = localStorage.getItem(PASSWORD_KEY);
    const authStatus = sessionStorage.getItem("spend_tracker_authenticated");

    setHasPassword(!!storedPassword);
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("spend_tracker_authenticated", "true");
  };

  const handlePasswordSet = () => {
    setHasPassword(true);
    setIsAuthenticated(true);
    sessionStorage.setItem("spend_tracker_authenticated", "true");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }
  return (
    <Router>
      <Routes>
        {!hasPassword ? (
          <>
            <Route
              path="/setup-password"
              element={<PasswordSetup onPasswordSet={handlePasswordSet} />}
            />
            <Route path="*" element={<Navigate to="/setup-password" replace />} />
          </>
        ) : !isAuthenticated ? (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/group/:groupId" element={<GroupDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
