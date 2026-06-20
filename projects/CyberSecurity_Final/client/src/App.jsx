// App.jsx
// Root component.
//
// Auth flow:
//   - loggedInUser === null  → show Login / Register tab card
//   - loggedInUser !== null  → show Dashboard for that user

import { useState } from "react";
import { ShieldCheck, Lock, UserPlus } from "lucide-react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  // null = not logged in; string = the logged-in username
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Track which auth tab is active
  const [activeTab, setActiveTab] = useState("login");

  // Called by Login on success — switches to Dashboard
  function handleLogin(username) {
    setLoggedInUser(username);
  }

  // Called by Dashboard logout button — returns to auth screen
  function handleLogout() {
    setLoggedInUser(null);
    setActiveTab("login");
  }

  // ── Logged in → show Dashboard ──────────────────────────────────────────────
  if (loggedInUser) {
    return <Dashboard username={loggedInUser} onLogout={handleLogout} />;
  }

  // ── Not logged in → show Login / Register ───────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1e]">

      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">

        {/* ── Branding ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4
                          rounded-2xl bg-blue-600/20 border border-blue-500/30 glow-blue">
            <ShieldCheck size={32} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SecureAuth</h1>
          <p className="text-blue-400/70 text-sm mt-1">
            Cybersecurity Final Project — Secure Authentication System
          </p>
        </div>

        {/* ── Card ── */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

          {/* Tab switcher */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium
                          transition-all duration-200
                          ${activeTab === "login"
                            ? "bg-blue-600/20 text-blue-300 border-b-2 border-blue-500"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                          }`}
            >
              <Lock size={14} />
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium
                          transition-all duration-200
                          ${activeTab === "register"
                            ? "bg-blue-600/20 text-blue-300 border-b-2 border-blue-500"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                          }`}
            >
              <UserPlus size={14} />
              Register
            </button>
          </div>

          {/* Active form */}
          <div className="p-7">
            {activeTab === "login"
              ? <Login onLogin={handleLogin} />
              : <Register />
            }
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-700 space-y-1">
          <p>PBKDF2-SHA512 · Random Salt · Server-side Pepper · Rate Limiting</p>
          <p>Passwords are never stored in plain text.</p>
        </div>
      </div>
    </div>
  );
}
