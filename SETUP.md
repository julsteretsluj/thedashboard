# Step-by-step setup

This repo contains the **SEAMUNs Dashboard** (Vite + React) — Chair Room & Delegate Dashboard.

---

## Prerequisites

- **Node.js** 18+ and **npm** (check: `node --version` and `npm --version`)
- **Git** (to clone the repo)

---

## Part 1: Get the repo

### Step 1.1 — Clone (or download)

```bash
git clone https://github.com/julsteretsluj/thedashboard.seamuns.site.git
cd thedashboard.seamuns.site
```

If you already have the folder, just open a terminal in that folder.

---

## Part 2: SEAMUNs Dashboard (Chair & Delegate)

Runs at **http://localhost:5173**. No backend required.

### Step 2.1 — Go to project root

```bash
cd /path/to/thedashboard.seamuns.site
```

(Use your actual path; `pwd` shows where you are.)

### Step 2.2 — Install dependencies

```bash
npm install
```

### Step 2.3 — Start the dev server

```bash
npm run dev
```

### Step 2.4 — Open in browser

Open **http://localhost:5173**.

- **Chair Room** — Digital room, delegates, motions, voting, speakers, crisis, archive
- **Delegate Dashboard** — Country, matrix, prep, checklist, countdown

### Step 2.5 — Gmail login with Firebase (optional)

To show **Log in with Gmail** / **Log out** in the dashboard header:

1. In [Firebase Console](https://console.firebase.google.com/), create a project (or use an existing one).
2. Go to **Build** → **Authentication** → **Get started** → enable **Google**, **Email/Password**, and **Anonymous** sign-in providers. Anonymous lets the app save chair and delegate conference data to Firebase even before a user signs in, so data survives clearing site/localStorage; when they later sign in with Google or email, that data stays linked to their account.
3. Go to **Project settings** (gear) → **General** → **Your apps** → **Add app** → **Web** (</>).
4. Register the app with a nickname; copy the `firebaseConfig` object (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
5. In the project root, copy the env example and fill in:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set the Firebase config (use the same names as in `.env.example`):

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

6. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**, ensure `localhost` and your production domain are listed.
7. Restart the dev server (`npm run dev`). You should see **Log in with Gmail** in the header; after login, your name and **Log out** appear.

If Firebase env vars are not set, the dashboard runs without the login section.

### Step 2.6 — Build for production (optional)

```bash
npm run build
npm run preview
```

Then serve the **`dist/`** folder from your host. Do not open `index.html` with `file://` or a plain static server — use `npm run dev` locally or deploy `dist/` with a proper server. For production Gmail login, add your live domain to Firebase **Authorized domains** and set the same `VITE_FIREBASE_*` vars in your build environment.

---

## Quick reference

| App | Folder | Command | URL |
|-----|--------|---------|-----|
| SEAMUNs Dashboard | repo root | `npm run dev` | http://localhost:5173 |

---

## Troubleshooting

- **SEAMUNs Dashboard: “MIME type text/plain”**  
  Don’t open `index.html` directly. Use `npm run dev` or deploy the built `dist/` folder.

- **Firebase: “Redirect URI mismatch” or “unauthorized domain”**  
  In Firebase Console → Authentication → Settings → **Authorized domains**, add `localhost` and your production domain (e.g. `thedashboard.seamuns.site`).

- **`package.json not found`**  
  Run commands from the repo root (the folder that contains `package.json`).
