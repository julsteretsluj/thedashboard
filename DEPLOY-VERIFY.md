# Verify the live site has the latest build

**If the new committees (AL, EU, IOPC, UKPC, PC, HCC) and allocations don’t appear on https://thedashboard.seamuns.site:**

## 1. Check which build is running

- Open the site and scroll to the **footer**.
- If you see **"Build: committees+allocations"**, the latest bundle is deployed (committees and allocation dropdowns are in this build).
- If you **don’t** see that line, the server is still serving an older build.

---

## Manual deploy (if Git / auto-deploy never updates the site)

Use this when the live site never gets the new build (e.g. Hostinger Git pulls the wrong branch or webhook doesn’t run).

1. **Download the built site**
   - Open the repo on GitHub → **Actions**.
   - Click the latest **“Build and push to Hostinger branch”** run (must be green).
   - Scroll to **Artifacts** at the bottom.
   - Download **site-build** (zip).

2. **Unzip**  
   You should get a folder with: `index.html`, `favicon.svg`, `.htaccess`, and an `assets/` folder (with one `.js` and one `.css` file).

3. **Upload to your web root**
   - Log in to your host (e.g. Hostinger hPanel → File Manager).
   - Go to the **document root** for thedashboard.seamuns.site (e.g. `public_html` for that domain).
   - **Upload** the contents of the unzipped folder into that directory, **overwriting** existing files (especially `index.html` and everything in `assets/`).

4. **Check the site**
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R).
   - Footer should show **“Build: committees+allocations”**.
   - Chair Room → Committee & topic: dropdown should start with **AL — Arab League**, **EU — European Union**, etc.

## 2. Where is thedashboard.seamuns.site hosted?

### If it’s on **Hostinger** (Git deploy)

- The workflow **Build and push to Hostinger branch** pushes the **built** site (the `dist/` folder) to the branch **`hostinger-build`**.
- In **Hostinger** (hPanel → your site → **Git**):
  - **Branch** must be **`hostinger-build`** (not `main`).  
    If it’s set to `main`, you’re pulling source code, not the built app.
  - After each push to `main`, wait for the GitHub Action to finish, then in Hostinger click **Deploy** or **Pull** so it pulls the latest `hostinger-build`.

### If it’s on **GitHub Pages**

- The workflow **Deploy to GitHub Pages** builds and deploys automatically on push to `main`.
- In the repo go to **Actions** and confirm the latest **“Deploy to GitHub Pages”** run is **green**.
- Then do a **hard refresh** (Ctrl+Shift+R or Cmd+Shift+R) or open the site in an incognito window.

## 3. Confirm GitHub Actions succeeded

- Repo → **Actions**.
- For the latest commit, both workflows should be green:
  - **Deploy to GitHub Pages**
  - **Build and push to Hostinger branch**
- If **Build and push to Hostinger branch** failed, open the run and check the failing step (often `npm run build`). Fix the error, push again, then pull on Hostinger once the run succeeds.

## 4. Cache

- Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac).
- Or open the site in a **private/incognito** window.

## 5. View Page Source (sanity check)

- On the live site: right‑click → **View Page Source**.
- You should see a script like:  
  `<script type="module" ... src="/assets/index-XXXXX.js">`  
  (with a hash in the filename).
- If you see `src="/src/main.tsx"` instead, the server is serving the **source** repo (e.g. wrong branch on Hostinger), not the built app.
