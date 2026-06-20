# 🔐 SecureAuth — Cybersecurity Final Project

A secure user authentication system demonstrating hashing, salt, pepper, and password strength validation.

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React 18 + Vite + TailwindCSS |
| Backend   | Node.js + Express       |
| Database  | SQLite (better-sqlite3) |
| Hashing   | PBKDF2-SHA512 (Node `crypto`) |
| Icons     | Lucide React            |

## Security Features

| Feature              | Implementation |
|----------------------|----------------|
| Password Hashing     | PBKDF2-SHA512, 100 000 iterations |
| Salt                 | `crypto.randomBytes(32)` per user, stored in DB |
| Pepper               | Env variable `PEPPER`, concatenated server-side, never stored |
| Password Meter       | 5 criteria: lower, upper, digit, symbol, ≥12 chars |
| Brute-force Protection | `express-rate-limit` — 10 req/min per IP |
| Plain-text Storage   | ❌ Never stored |

## How to Run Locally

### Prerequisites
- Node.js ≥ 18

### Steps

```bash
# 1. Install root (server) dependencies
npm install

# 2. Install client dependencies and build React app
npm run build

# 3. Start the Express server
npm start
```

Then open [http://localhost:3000](http://localhost:3000)

### Development (hot-reload)

Open two terminals:

```bash
# Terminal 1 — Express backend
npm run dev:server

# Terminal 2 — React dev server (proxies /api to :3000)
npm run dev:client
```

React dev server: http://localhost:5173

## Deploy to Render.com (Free)

1. Push this project to a GitHub repository.
2. Go to [render.com](https://render.com) and create a free account.
3. Click **"New Web Service"** → connect your GitHub repo.
4. Render detects `render.yaml` automatically.
5. Set the **PEPPER** environment variable to a strong secret string.
6. Deploy! Your public URL will appear in the Render dashboard.

## Project Structure

```
Cibersecurity_final/
├── server.js          # Express API (register, login, static serving)
├── database.js        # SQLite setup (users table)
├── .env               # Pepper and port config (never commit!)
├── render.yaml        # One-click Render.com deployment
├── package.json
└── client/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx                          # Root component / tab switcher
        ├── main.jsx
        ├── index.css
        └── components/
            ├── Register.jsx                 # Registration form
            ├── Login.jsx                    # Login form
            └── PasswordStrengthMeter.jsx    # Password strength checker
```

## Password Strength Logic

| Criteria         | Check |
|------------------|-------|
| Lowercase letter | `/[a-z]/` |
| Uppercase letter | `/[A-Z]/` |
| Digit            | `/[0-9]/` |
| Special symbol   | `/[!@#$%^&*...]/` |
| Minimum 12 chars | `length >= 12` |

| Score | Strength |
|-------|----------|
| 0–2   | Weak     |
| 3–4   | Medium   |
| 5     | Strong   |

## Hashing Flow

```
Registration:
  salt = randomBytes(32)
  hash = PBKDF2( password + PEPPER,  salt,  100000,  64,  "sha512" )
  DB ← { username, hash, salt }   ← pepper NOT stored

Login:
  salt ← DB[username].salt
  inputHash = PBKDF2( inputPassword + PEPPER,  salt,  100000,  64,  "sha512" )
  if inputHash == DB[username].hash → Login Successful
  else                              → Invalid Username or Password
```
