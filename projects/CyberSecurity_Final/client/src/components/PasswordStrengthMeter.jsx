// PasswordStrengthMeter.jsx
// Validates password complexity and displays a strength indicator.
//
// Requirements checked:
//   ✔ At least one lowercase letter
//   ✔ At least one uppercase letter
//   ✔ At least one digit
//   ✔ At least one special character (symbol)
//   ✔ Minimum 12 characters
//
// Strength levels:
//   Weak   → 0–2 criteria met
//   Medium → 3–4 criteria met
//   Strong → all 5 criteria met

import { CheckCircle, XCircle } from "lucide-react";

/**
 * Evaluates the password and returns criteria results + strength label.
 * @param {string} password
 * @returns {{ checks: object, strength: string, score: number }}
 */
export function evaluatePassword(password) {
  const checks = {
    hasLower:     /[a-z]/.test(password),
    hasUpper:     /[A-Z]/.test(password),
    hasDigit:     /[0-9]/.test(password),
    hasSymbol:    /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?`~]/.test(password),
    hasMinLength: password.length >= 12,
  };

  // Count how many checks pass
  const score = Object.values(checks).filter(Boolean).length;

  // Determine strength label based on score
  let strength = "Weak";
  if (score === 5) {
    strength = "Strong";
  } else if (score >= 3) {
    strength = "Medium";
  }

  return { checks, strength, score };
}

// Labels and descriptions for each requirement row
const REQUIREMENT_LABELS = [
  { key: "hasLower",     label: "Lowercase letter",   desc: "a–z" },
  { key: "hasUpper",     label: "Uppercase letter",   desc: "A–Z" },
  { key: "hasDigit",     label: "Number",             desc: "0–9" },
  { key: "hasSymbol",    label: "Special character",  desc: "!@#$..." },
  { key: "hasMinLength", label: "Minimum 12 chars",   desc: "length ≥ 12" },
];

// Strength-level styling config
const STRENGTH_CONFIG = {
  Weak:   { color: "bg-red-500",    text: "text-red-400",    barWidth: "w-1/3",  glow: "glow-red" },
  Medium: { color: "bg-yellow-400", text: "text-yellow-300", barWidth: "w-2/3",  glow: "" },
  Strong: { color: "bg-green-500",  text: "text-green-400",  barWidth: "w-full", glow: "glow-green" },
};

/**
 * PasswordStrengthMeter component
 * @param {{ password: string }} props
 */
export default function PasswordStrengthMeter({ password }) {
  // Don't render anything if the password field is empty
  if (!password) return null;

  const { checks, strength, score } = evaluatePassword(password);
  const config = STRENGTH_CONFIG[strength];

  return (
    <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10 animate-fade-in space-y-3">
      {/* ── Strength Bar ── */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400 font-medium">Password Strength</span>
          <span className={`text-xs font-bold tracking-wide ${config.text}`}>
            {strength}
          </span>
        </div>
        {/* Background track */}
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          {/* Animated fill bar */}
          <div
            className={`h-full rounded-full strength-bar ${config.color} ${config.barWidth}`}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{score}/5 requirements met</p>
      </div>

      {/* ── Requirements Checklist ── */}
      <ul className="space-y-1.5">
        {REQUIREMENT_LABELS.map(({ key, label, desc }) => {
          const passed = checks[key];
          return (
            <li key={key} className="flex items-center gap-2 text-xs">
              {passed ? (
                <CheckCircle size={14} className="text-green-400 shrink-0" />
              ) : (
                <XCircle size={14} className="text-gray-600 shrink-0" />
              )}
              <span className={passed ? "text-green-300" : "text-gray-500"}>
                {label}
                <span className="ml-1 opacity-50">({desc})</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
