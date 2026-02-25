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

### Step 2.5 — Supabase auth & data (optional)

To show **Log in with Gmail** / **Log out** and persist chair/delegate data across devices:

1. Create a project at [Supabase](https://supabase.com/).
2. Go to **Authentication** → **Providers** → enable **Google** and **Email**. Under **Auth** → **Settings**, enable **Anonymous sign-ins** so data is saved before users sign in.
3. For Google: add your OAuth client ID/secret in Supabase → Authentication → Providers → Google. Use [Google Cloud Console](https://console.cloud.google.com/) to create OAuth credentials and add `https://<your-project>.supabase.co/auth/v1/callback` as an authorized redirect URI.
4. In Supabase → **Project settings** → **API**, copy the **Project URL** and **anon public** key.
5. Copy the env example and fill in:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

- `VITE_SUPABASE_URL` — your Project URL
- `VITE_SUPABASE_ANON_KEY` — your anon public key

6. Run the database migration: Supabase → **SQL Editor** → run the contents of `supabase/migrations/001_initial.sql` to create `chair_data`, `delegate_data`, `user_config`, and `config` tables with RLS.
7. Restart the dev server (`npm run dev`). You should see **Log in with Gmail** in the header; after login, your name and **Log out** appear.

If Supabase env vars are not set, the dashboard runs without the login section and data is stored in localStorage only.

### Step 2.6 — Build for production (optional)

```bash
npm run build
npm run preview
```

Then serve the **`dist/`** folder from your host. Do not open `index.html` with `file://` or a plain static server — use `npm run dev` locally or deploy `dist/` with a proper server. For production auth, add your live domain to Supabase **Authentication** → **URL configuration** and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your build environment.

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
  In Supabase → Authentication → **URL configuration**, add your site URL and redirect URLs. For Google OAuth, ensure your redirect URI in Google Cloud Console matches Supabase's callback URL.

- **`package.json not found`**  
  Run commands from the repo root (the folder that contains `package.json`).
