// database.js - JSON file database
// Stores user records in users.json (no native compilation required).
//
// Stored fields per user:
//   id            - auto-incremented integer
//   username      - unique string
//   password_hash - PBKDF2-SHA512 hex string (128 chars)
//   salt          - random hex string (64 chars)
//   created_at    - ISO 8601 timestamp
//
// NOTE: Pepper is intentionally NOT stored here — it lives in the .env file.

const fs   = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "users.json");

// ── Internal helpers ──────────────────────────────────────────────────────────

/** Load all records from disk. Creates the file if it doesn't exist. */
function load() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2), "utf8");
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

/** Persist all records back to disk. */
function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

// ── Public API ────────────────────────────────────────────────────────────────

const db = {
  /**
   * Find a user by their username (case-sensitive).
   * @param {string} username
   * @returns {object|null}
   */
  findUser(username) {
    const data = load();
    return data.users.find((u) => u.username === username) || null;
  },

  /**
   * Insert a new user record.
   * @param {string} username
   * @param {string} passwordHash - Hex-encoded PBKDF2 hash
   * @param {string} salt         - Hex-encoded random salt
   * @returns {object} The newly created user record
   */
  insertUser(username, passwordHash, salt) {
    const data = load();

    // Ensure username uniqueness
    if (data.users.find((u) => u.username === username)) {
      throw new Error("Username already exists");
    }

    const newUser = {
      id:            data.users.length + 1,
      username,
      password_hash: passwordHash,
      salt,
      created_at:    new Date().toISOString(),
    };

    data.users.push(newUser);
    save(data);
    return newUser;
  },

  /**
   * Update the password hash and salt for an existing user.
   * A fresh salt is always generated server-side before calling this.
   * @param {string} username
   * @param {string} newHash - New PBKDF2 hex hash
   * @param {string} newSalt - New random hex salt
   */
  updatePassword(username, newHash, newSalt) {
    const data = load();
    const user = data.users.find((u) => u.username === username);
    if (!user) throw new Error("User not found");
    user.password_hash = newHash;
    user.salt          = newSalt;
    save(data);
  },

  /**
   * Return all users (for admin/debug purposes — pepper is not stored here).
   * @returns {object[]}
   */
  getAllUsers() {
    return load().users;
  },
};

module.exports = db;
