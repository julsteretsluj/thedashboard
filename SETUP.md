# Step-by-step setup

This repo contains two apps:

1. **MUN Dashboard** (root) — Chair Room & Delegate Dashboard (Vite + React)
2. **Auth0 Next.js app** (`auth0-nextjs-app/`) — Next.js 15 + Auth0 login

Follow the steps below for the app(s) you want to run.

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

## Part 2: MUN Dashboard (Chair & Delegate)

Runs at **http://localhost:5173**. No Auth0 or backend required.

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

### Step 2.5 — Build for production (optional)

```bash
npm run build
npm run preview
```

Then serve the **`dist/`** folder from your host. Do not open `index.html` with `file://` or a plain static server — use `npm run dev` locally or deploy `dist/` with a proper server.

---

## Part 3: Auth0 Next.js app

Runs at **http://localhost:3000**. Requires an Auth0 account and app.

### Step 3.1 — Go into the Auth0 app folder

```bash
cd /path/to/thedashboard.seamuns.site/auth0-nextjs-app
```

### Step 3.2 — Install dependencies

```bash
npm install
```

(If you see peer dependency warnings, you can use `npm install --legacy-peer-deps`.)

### Step 3.3 — Create Auth0 application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/dashboard/).
2. Sign in or create an account.
3. **Applications** → **Create Application**.
4. Name it (e.g. “MUN Dashboard”), choose **Regular Web Application** → **Create**.

### Step 3.4 — Configure Auth0 URLs

In your application **Settings**:

| Setting | Value |
|--------|--------|
| **Allowed Callback URLs** | `http://localhost:3000/auth/callback` |
| **Allowed Logout URLs** | `http://localhost:3000` |
| **Allowed Web Origins** | `http://localhost:3000` |

Click **Save Changes**.

### Step 3.5 — Copy credentials

From the same **Settings** page, copy:

- **Domain** (e.g. `your-tenant.auth0.com`)
- **Client ID**
- **Client Secret** (click “Show” if needed)

### Step 3.6 — Create `.env.local`

In the `auth0-nextjs-app` folder:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set:

```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_SECRET=your-long-random-secret
APP_BASE_URL=http://localhost:3000
```

Replace `your-tenant`, `your-client-id`, and `your-client-secret` with the values from Step 3.5.

### Step 3.7 — Generate `AUTH0_SECRET`

In a terminal:

```bash
openssl rand -hex 32
```

Copy the output and paste it as `AUTH0_SECRET` in `.env.local` (replace `your-long-random-secret`).

### Step 3.8 — Start the Auth0 app

From `auth0-nextjs-app`:

```bash
npm run dev
```

### Step 3.9 — Open in browser

Open **http://localhost:3000**. Click **Log In** to sign in with Auth0.

---

## Quick reference

| App | Folder | Command | URL |
|-----|--------|---------|-----|
| MUN Dashboard | repo root | `npm run dev` | http://localhost:5173 |
| Auth0 Next.js | `auth0-nextjs-app/` | `npm run dev` | http://localhost:3000 |

---

## Troubleshooting

- **MUN Dashboard: “MIME type text/plain”**  
  Don’t open `index.html` directly. Use `npm run dev` or deploy the built `dist/` folder.

- **Auth0: “Configuration error”**  
  Check `.env.local` is in `auth0-nextjs-app/`, all variables are set, and you’ve restarted `npm run dev` after editing.

- **Auth0: “Redirect URI mismatch”**  
  In Auth0, ensure **Allowed Callback URLs** includes exactly `http://localhost:3000/auth/callback` (and **Allowed Logout URLs** / **Web Origins** as in Step 3.4).

- **`package.json not found`**  
  Run commands from the correct folder: repo root for MUN Dashboard, `auth0-nextjs-app` for the Auth0 app.
