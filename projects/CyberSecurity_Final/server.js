// server.js - Express backend for the Secure Authentication System
// Implements registration and login with hashing, salt, and pepper

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");
const rateLimit = require("express-rate-limit");

const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

// PEPPER: secret value stored only server-side (in .env), NEVER in the database
// This adds an extra layer of security even if the database is compromised
const PEPPER = process.env.PEPPER || "Cy8r$3cur1ty_P3pp3r!2026_D3f@ult";

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve the compiled React frontend from client/dist
app.use(express.static(path.join(__dirname, "client", "dist")));

// Rate limiter: max 10 requests per minute per IP on auth routes (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  validate: { xForwardedForHeader: false }, // avoids proxy header conflict in local/dev environments
  message: { error: "Too many attempts. Please wait a minute and try again." },
});

// ─── Hashing Utilities ────────────────────────────────────────────────────────

/**
 * Generates a cryptographically random salt (64 hex chars = 32 bytes).
 * A unique salt is generated for EACH user at registration time.
 */
function generateSalt() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hashes a password using PBKDF2-SHA512.
 *
 * Process:
 *   1. Concatenate: password + salt + PEPPER  (the combined "secret input")
 *   2. Feed into PBKDF2 with 100,000 iterations (slow by design, resists brute force)
 *   3. Output: 128-character hex string (64 bytes)
 *
 * @param {string} password - The plain-text password
 * @param {string} salt     - The per-user random salt (stored in DB)
 * @returns {string}        - Hexadecimal hash string
 */
function hashPassword(password, salt) {
  // Step 1: Combine password + salt + pepper into a single input string
  const combined = password + salt + PEPPER;

  // Step 2: Derive the final hash with PBKDF2-SHA512 (100 000 iterations, 64-byte output)
  return crypto
    .pbkdf2Sync(combined, salt, 100000, 64, "sha512")
    .toString("hex");
}

// ─── API Routes ───────────────────────────────────────────────────────────────

// POST /api/register - Register a new user
app.post("/api/register", authLimiter, (req, res) => {
  const { username, password } = req.body;

  // Basic input validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  if (username.trim().length < 3) {
    return res
      .status(400)
      .json({ error: "Username must be at least 3 characters." });
  }

  // Check if username is already taken
  const existing = db.findUser(username.trim());

  if (existing) {
    return res.status(409).json({ error: "Username already exists." });
  }

  // Generate a unique random salt for this user
  const salt = generateSalt();

  // Hash the password: PBKDF2(password + salt + pepper, salt, 100000 iterations, sha512)
  const hash = hashPassword(password, salt);

  // Store only the username, hash, and salt — NEVER the plain password or pepper
  db.insertUser(username.trim(), hash, salt);

  res.status(201).json({ message: "Registration successful! You can now log in." });
});

// POST /api/login - Authenticate an existing user
app.post("/api/login", authLimiter, (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  // Retrieve the stored salt and hash for this username
  const user = db.findUser(username.trim());

  // Always return the same error message for both wrong username and wrong password
  // (prevents username enumeration attacks)
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  // Recompute the hash using the stored salt + pepper, then compare
  const inputHash = hashPassword(password, user.salt);

  if (inputHash === user.password_hash) {
    // Credentials match - login successful
    res.json({ message: `Login successful! Welcome back, ${user.username}.` });
  } else {
    // Hashes don't match - wrong password
    res.status(401).json({ error: "Invalid username or password." });
  }
});

// GET /api/profile - Return public profile info for the dashboard
app.get("/api/profile", (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Username required." });

  const user = db.findUser(username.trim());
  if (!user) return res.status(404).json({ error: "User not found." });

  // Only return non-sensitive fields — never expose hash, salt, or pepper
  res.json({
    username:   user.username,
    created_at: user.created_at,
  });
});

// POST /api/change-password - Update a user's password
app.post("/api/change-password", authLimiter, (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Retrieve user record
  const user = db.findUser(username.trim());
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  // Verify the current password before allowing the change
  const currentHash = hashPassword(currentPassword, user.salt);
  if (currentHash !== user.password_hash) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }

  // Generate a fresh salt for the new password (best practice)
  const newSalt = generateSalt();
  const newHash = hashPassword(newPassword, newSalt);

  // Persist the updated hash and salt
  db.updatePassword(username.trim(), newHash, newSalt);

  res.json({ message: "Password updated successfully!" });
});

// Fallback: send the React app for all non-API routes (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[SecureAuth] Server running on http://localhost:${PORT}`);
  console.log(`[SecureAuth] Pepper loaded: ${PEPPER !== "" ? "YES" : "NO (warning!)"}`);
});
