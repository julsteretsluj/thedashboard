# MUN Dashboard

An interactive, modern dashboard for **MUN Chairs** and **Delegates** — run committee sessions and prepare for conferences.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

**Important:** Use `npm run dev` to run the app locally. Do not open `index.html` in the browser directly (e.g. via `file://`) or serve the project root with a plain static server — that causes a “MIME type text/plain” error because `.tsx` files are served incorrectly. For deployment, build with `npm run build` and serve the **contents of `dist/`** so the server sends JavaScript with the correct `Content-Type`.

## Chair Room

- **Digital Room View** — See all delegates in the room
- **Delegates** — Add/remove delegates; traditional allocation or custom
- **Motions & Points** — Record and star motions/points; log and vote
- **Voting** — Active voting with individual delegate votes (Yes/No/Abstain)
- **Committee & Topic** — Set committee and topic (also in Settings)
- **Score** — Count of passed/failed/tabled motions and points
- **Roll Call** — Track presence; mark roll call complete
- **Session** — Start/stop committee session
- **Speakers** — Mod speakers list, active speaker (timed), add/remove
- **Crisis** — Slides, speakers, facts, pathways
- **Archive** — Position papers, chair reports, slides, speeches, prep docs

## Delegate Dashboard

Per conference:

- **Country & stance** — Conference name, country assignment, brief stance overview
- **Committee matrix** — First names only by committee
- **Prep template** — Topic research, country stance, opening speech, mod speeches
- **Trusted & nation sources** — Add trusted and nation-specific sources
- **Chair report & resources** — Upload/link handbook, pos paper guidelines, etc.
- **Checklist** — Position paper, research (topic & country), opening speech, mod speeches
- **Conference countdown** — Set start date/time; live countdown

## Tech

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS 4** (dark theme, DM Sans + Instrument Serif)
- **React Router** for navigation
- In-memory state (Chair + Delegate contexts); no backend required to run

## Build

```bash
npm run build
npm run preview
```

Build output is in `dist/`.
