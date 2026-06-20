// Login.jsx
// Login form component.
//
// Client-side responsibilities:
//   - Collect username and password
//   - POST to /api/login
//
// Server-side (server.js) handles:
//   - Retrieving stored salt from the database
//   - Recomputing: PBKDF2(password + pepper, salt)
//   - Comparing recomputed hash with the stored hash
//   - Returning success or failure

import { useState } from "react";
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * @param {{ onLogin: (username: string) => void }} props
 */
export default function Login({ onLogin }) {
  // Form field state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [message, setMessage]   = useState(null); // { type: "success"|"error", text: "" }

  /**
   * Handle form submission.
   * Sends credentials to the server; the server computes and compares the hash.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Login successful — notify parent to switch to Dashboard
        onLogin(username.trim());
      } else {
        // Login failed - server returns a generic message to prevent user enumeration
        setMessage({ type: "error", text: data.error || "Login failed." });
      }
    } catch {
      setMessage({ type: "error", text: "Could not connect to server. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── Username Field ── */}
      <div>
        <label className="block text-sm font-medium text-blue-200 mb-1.5">
          Username
        </label>
        <div className="relative">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 rounded-lg
                       text-white placeholder-gray-600 text-sm outline-none
                       focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* ── Password Field ── */}
      <div>
        <label className="block text-sm font-medium text-blue-200 mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/15 rounded-lg
                       text-white placeholder-gray-600 text-sm outline-none
                       focus:border-blue-500 transition-colors"
          />
          {/* Toggle password visibility */}
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* ── Submit Button ── */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800
                   disabled:cursor-not-allowed text-white font-semibold rounded-lg
                   transition-all duration-200 flex items-center justify-center gap-2
                   glow-blue"
      >
        <LogIn size={18} />
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* ── Response Message ── */}
      {message && (
        <div
          className={`flex items-start gap-2 p-3 rounded-lg text-sm animate-fade-in
            ${message.type === "success"
              ? "bg-green-900/40 border border-green-700/50 text-green-300"
              : "bg-red-900/40 border border-red-700/50 text-red-300"
            }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
          )}
          {message.text}
        </div>
      )}

      {/* ── Security Notice ── */}
      <p className="text-center text-xs text-gray-600">
        Your password is hashed with PBKDF2-SHA512 + salt + pepper.
        <br />Plain-text passwords are never stored.
      </p>
    </form>
  );
}
