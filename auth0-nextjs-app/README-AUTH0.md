# Auth0 Setup (Manual)

This app uses the Auth0 Next.js SDK. Configure Auth0 before running.

## 1. Create `.env.local`

Copy the example and fill in your values:

```bash
cp .env.local.example .env.local
```

## 2. Create an Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/dashboard/)
2. **Applications** → **Create Application** → **Regular Web Application**
3. In **Settings** for your application:
   - **Allowed Callback URLs:** `http://localhost:3000/auth/callback`
   - **Allowed Logout URLs:** `http://localhost:3000`
   - **Allowed Web Origins:** `http://localhost:3000`
4. Copy **Domain**, **Client ID**, and **Client Secret** into `.env.local`.

## 3. Set `AUTH0_SECRET`

Generate a long random secret (32+ characters) and set it in `.env.local`:

```bash
openssl rand -hex 32
```

## 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Log In** to sign in with Auth0.
