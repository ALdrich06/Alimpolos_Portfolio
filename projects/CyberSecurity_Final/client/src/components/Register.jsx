// Register.jsx
// Registration form component.
//
// Client-side responsibilities:
//   - Validate that password meets strength requirements (Strong)
//   - Confirm that both password fields match
//   - POST credentials to /api/register
//
// Server-side (server.js) handles:
//   - Salt generation
//   - Pepper concatenation
//   - PBKDF2-SHA512 hashing
//   - Database storage (username, hash, salt)

import { useState } from "react";
import { User, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import PasswordStrengthMeter, { evaluatePassword } from "./PasswordStrengthMeter";

export default function Register() {
  // Form field state
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPass, setConfirmPass]   = useState("");

  // UI state
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState(null); // { type: "success"|"error", text: "" }

  // Evaluate password strength on every keystroke
  const { strength } = evaluatePassword(password);

  /**
   * Handle form submission.
   * Validates inputs client-side, then calls the registration API.
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    // 1. Validate username length
    if (username.trim().length < 3) {
      setMessage({ type: "error", text: "Username must be at least 3 characters." });
      return;
    }

    // 2. Require Strong password before allowing registration
    if (strength !== "Strong") {
      setMessage({
        type: "error",
        text: "Password must meet all 5 requirements (Strong) to register.",
      });
      return;
    }

    // 3. Confirm passwords match
    if (password !== confirmPass) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      // POST to the Express API - plain password is sent over HTTPS to the server
      // The server will handle salt + pepper + hashing (never stored in plain text)
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        // Clear the form on success
        setUsername("");
        setPassword("");
        setConfirmPass("");
      } else {
        setMessage({ type: "error", text: data.error || "Registration failed." });
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
            placeholder="Choose a username"
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
            placeholder="Create a strong password"
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

        {/* Password strength meter appears as the user types */}
        <PasswordStrengthMeter password={password} />
      </div>

      {/* ── Confirm Password Field ── */}
      <div>
        <label className="block text-sm font-medium text-blue-200 mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Repeat your password"
            required
            className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/15 rounded-lg
                       text-white placeholder-gray-600 text-sm outline-none
                       focus:border-blue-500 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {/* Inline match indicator */}
        {confirmPass.length > 0 && (
          <p className={`text-xs mt-1.5 ${password === confirmPass ? "text-green-400" : "text-red-400"}`}>
            {password === confirmPass ? "✓ Passwords match" : "✗ Passwords do not match"}
          </p>
        )}
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
        <ShieldCheck size={18} />
        {loading ? "Registering..." : "Create Account"}
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
    </form>
  );
}
