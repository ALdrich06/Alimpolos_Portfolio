// Dashboard.jsx
// User profile dashboard shown after a successful login.
//
// Features:
//   - Welcome card with avatar initials
//   - Account info (username, member since)
//   - Security badge panel (algorithm, salt, pepper, iterations)
//   - Change Password form with strength meter
//   - Logout button

import { useState, useEffect } from "react";
import {
  ShieldCheck, LogOut, User, Calendar, Lock,
  Key, RefreshCw, Eye, EyeOff, AlertCircle,
  CheckCircle2, ChevronDown, ChevronUp, Cpu, Layers
} from "lucide-react";
import PasswordStrengthMeter, { evaluatePassword } from "./PasswordStrengthMeter";

/**
 * Dashboard component
 * @param {{ username: string, onLogout: () => void }} props
 */
export default function Dashboard({ username, onLogout }) {
  // Profile data fetched from the server
  const [profile, setProfile] = useState(null);

  // Change-password form state
  const [showChangePass, setShowChangePass]   = useState(false);
  const [currentPass, setCurrentPass]         = useState("");
  const [newPass, setNewPass]                 = useState("");
  const [confirmNewPass, setConfirmNewPass]   = useState("");
  const [showCurrent, setShowCurrent]         = useState(false);
  const [showNew, setShowNew]                 = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [changeLoading, setChangeLoading]     = useState(false);
  const [changeMessage, setChangeMessage]     = useState(null);

  const { strength } = evaluatePassword(newPass);

  // Fetch user profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile?username=${encodeURIComponent(username)}`);
        if (res.ok) setProfile(await res.json());
      } catch {
        // Non-critical — UI still works without it
      }
    }
    fetchProfile();
  }, [username]);

  /** Handle change-password form submission */
  async function handleChangePassword(e) {
    e.preventDefault();
    setChangeMessage(null);

    if (strength !== "Strong") {
      setChangeMessage({ type: "error", text: "New password must be Strong (all 5 requirements met)." });
      return;
    }
    if (newPass !== confirmNewPass) {
      setChangeMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (currentPass === newPass) {
      setChangeMessage({ type: "error", text: "New password must differ from the current one." });
      return;
    }

    setChangeLoading(true);
    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, currentPassword: currentPass, newPassword: newPass }),
      });
      const data = await res.json();

      if (res.ok) {
        setChangeMessage({ type: "success", text: data.message });
        setCurrentPass("");
        setNewPass("");
        setConfirmNewPass("");
        setShowChangePass(false);
      } else {
        setChangeMessage({ type: "error", text: data.error || "Password change failed." });
      }
    } catch {
      setChangeMessage({ type: "error", text: "Could not connect to server." });
    } finally {
      setChangeLoading(false);
    }
  }

  // Format creation date
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  // Avatar: first letter of username
  const avatar = username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-2xl mx-auto space-y-5 py-8">

        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-blue-400" />
            <span className="text-white font-bold text-lg">SecureAuth</span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm
                       bg-white/5 border border-white/10 text-gray-400
                       hover:bg-red-900/30 hover:border-red-700/50 hover:text-red-400
                       transition-all duration-200"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* ── Welcome Card ── */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl
                        border border-blue-500/20 p-6 flex items-center gap-5 glow-blue">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center
                          text-white text-2xl font-bold shrink-0 shadow-lg">
            {avatar}
          </div>
          <div>
            <p className="text-blue-300 text-sm">Welcome back,</p>
            <h2 className="text-white text-2xl font-bold">{username}</h2>
            <p className="text-gray-500 text-xs mt-0.5">Your account is secured ✓</p>
          </div>
        </div>

        {/* ── Account Info Card ── */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
            <User size={14} className="text-blue-400" />
            Account Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <User size={13} className="text-gray-500" />
                <span className="text-gray-500 text-xs">Username</span>
              </div>
              <p className="text-white font-medium text-sm">{username}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={13} className="text-gray-500" />
                <span className="text-gray-500 text-xs">Member Since</span>
              </div>
              <p className="text-white font-medium text-sm">{memberSince}</p>
            </div>
          </div>
        </div>

        {/* ── Security Overview Card ── */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-5 space-y-4">
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-400" />
            Password Security Details
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Cpu size={13} className="text-blue-400" />
                <span className="text-gray-500 text-xs">Hash Algorithm</span>
              </div>
              <p className="text-blue-300 font-mono text-xs font-semibold">PBKDF2-SHA512</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw size={13} className="text-purple-400" />
                <span className="text-gray-500 text-xs">Iterations</span>
              </div>
              <p className="text-purple-300 font-mono text-xs font-semibold">100,000×</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Key size={13} className="text-yellow-400" />
                <span className="text-gray-500 text-xs">Salt</span>
              </div>
              <p className="text-yellow-300 text-xs font-semibold">Unique · 32 bytes</p>
              <p className="text-gray-600 text-xs mt-0.5">Stored in database</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Layers size={13} className="text-red-400" />
                <span className="text-gray-500 text-xs">Pepper</span>
              </div>
              <p className="text-red-300 text-xs font-semibold">Server-side only</p>
              <p className="text-gray-600 text-xs mt-0.5">NOT in database</p>
            </div>
          </div>

          {/* Hash formula */}
          <div className="bg-black/30 rounded-xl p-3 border border-white/5">
            <p className="text-gray-500 text-xs mb-2">How your password is stored:</p>
            <p className="text-green-400 font-mono text-xs leading-relaxed">
              hash = PBKDF2({" "}
              <span className="text-white">password</span>
              {" "}+{" "}
              <span className="text-yellow-400">salt</span>
              {" "}+{" "}
              <span className="text-red-400">pepper</span>
              ,{" "}
              <span className="text-yellow-400">salt</span>
              , 100000, sha512 )
            </p>
          </div>
        </div>

        {/* ── Change Password ── */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <button
            onClick={() => { setShowChangePass(!showChangePass); setChangeMessage(null); }}
            className="w-full flex items-center justify-between p-5 text-sm
                       hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2 text-white font-semibold">
              <Lock size={14} className="text-blue-400" />
              Change Password
            </div>
            {showChangePass
              ? <ChevronUp size={16} className="text-gray-500" />
              : <ChevronDown size={16} className="text-gray-500" />
            }
          </button>

          {showChangePass && (
            <form onSubmit={handleChangePassword} className="px-5 pb-5 space-y-4 animate-fade-in">
              <div className="border-t border-white/10 mb-4" />

              {/* Current Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Current Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/15 rounded-lg
                               text-white placeholder-gray-600 text-sm outline-none
                               focus:border-blue-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Enter new strong password"
                    required
                    className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/15 rounded-lg
                               text-white placeholder-gray-600 text-sm outline-none
                               focus:border-blue-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <PasswordStrengthMeter password={newPass} />
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/15 rounded-lg
                               text-white placeholder-gray-600 text-sm outline-none
                               focus:border-blue-500 transition-colors"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {confirmNewPass.length > 0 && (
                  <p className={`text-xs mt-1.5 ${newPass === confirmNewPass ? "text-green-400" : "text-red-400"}`}>
                    {newPass === confirmNewPass ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={changeLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800
                           disabled:cursor-not-allowed text-white font-semibold rounded-lg
                           transition-all text-sm flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                {changeLoading ? "Updating..." : "Update Password"}
              </button>

              {changeMessage && (
                <div className={`flex items-start gap-2 p-3 rounded-lg text-sm animate-fade-in
                  ${changeMessage.type === "success"
                    ? "bg-green-900/40 border border-green-700/50 text-green-300"
                    : "bg-red-900/40 border border-red-700/50 text-red-300"
                  }`}>
                  {changeMessage.type === "success"
                    ? <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
                    : <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  }
                  {changeMessage.text}
                </div>
              )}
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
