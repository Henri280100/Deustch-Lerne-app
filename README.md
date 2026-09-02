# Deutsch Pfad — Learn German, Beginner to Advanced

A full-stack German learning app covering all five core skills — **Grammar, Reading,
Writing, Listening, and Speaking** — across three levels (Beginner, Intermediate,
Advanced), with real user accounts and progress saved server-side.

- **Frontend:** React + Vite, plain CSS (no framework lock-in), React Router
- **Backend:** Node.js + Express + SQLite (via `better-sqlite3`), JWT auth
- **Speaking & Listening:** use the browser's built-in Web Speech APIs
  (`speechSynthesis` for audio playback, `SpeechRecognition` for pronunciation
  feedback) — no paid API keys or audio files required

```
german-app/
├── backend/     Express API + SQLite database
├── frontend/    React app (Vite)
└── docker-compose.yml
```

## 1. Run it locally (no Docker)

You'll need Node.js 18+ installed.

**Backend:**
```bash
cd backend
npm install
cp .env.example .env    # edit JWT_SECRET if you like
npm run dev              # runs on http://localhost:4000
```

**Frontend** (in a second terminal):
```bash
cd frontend
npm install
npm run dev               # runs on http://localhost:5173
```

Open `http://localhost:5173`. The Vite dev server proxies `/api` requests to the
backend automatically (see `frontend/vite.config.js`), so you don't need to
configure anything else for local development.

## 2. Run it with Docker (one command)

```bash
docker compose up --build
```

This builds and starts both services:
- Backend → `http://localhost:4000`
- Frontend → `http://localhost:5173`

The SQLite database is stored in a Docker volume (`backend-data`), so your
accounts and progress survive container restarts.

## 3. Deploying for real

The simplest free/cheap combo is **Render** (backend) + **Vercel or Netlify**
(frontend). Either works from the same repo.

### Backend → Render
1. Push this repo to GitHub.
2. On Render: **New → Web Service**, point it at the repo, set the root
   directory to `backend`.
3. Build command: `npm install` — Start command: `node server.js`.
4. Add environment variables: `JWT_SECRET` (long random string) and
   `CORS_ORIGIN` (your frontend's deployed URL, e.g. `https://your-app.vercel.app`).
5. **Important for persistence:** SQLite writes to `backend/data/data.db`.
   Render's filesystem is ephemeral on redeploy unless you attach a
   [persistent disk](https://render.com/docs/disks) mounted at `/opt/render/project/src/data`
   (or wherever your repo's `backend/data` resolves to). Without a disk,
   accounts and progress reset on every deploy — fine for a demo, not for
   production. Alternatively, swap SQLite for a managed Postgres database
   (Render offers this too); only `backend/db.js` and the SQL in the routes
   would need to change.
6. Render also supports deploying straight from `backend/Dockerfile` if you'd
   rather not use its native Node buildpack.

### Frontend → Vercel
1. On Vercel: **New Project**, point it at the repo, set the root directory
   to `frontend`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Add an environment variable: `VITE_API_URL` = your Render backend URL +
   `/api`, e.g. `https://your-api.onrender.com/api`.
4. Deploy. Vercel handles the SPA fallback routing automatically.

(Netlify works the same way — build command `npm run build`, publish
directory `dist`, same `VITE_API_URL` env var, and a `_redirects` file with
`/* /index.html 200` if you need to add SPA fallback manually.)

### Alternative: one host for everything
Railway, Fly.io, or a single VPS with Docker Compose can run both containers
from `docker-compose.yml` directly — useful if you'd rather not split frontend
and backend across two providers.

## 4. Adding more content

All lesson content lives in one file: `backend/seed/lessons.js`. Each lesson
is a plain JS object — copy an existing one for the skill you want, change the
`id`, `level`, `title`, and `content`, and it appears in the app immediately
(no migrations, no rebuild step beyond restarting the server). The file has
comments documenting the exact shape expected for each skill type.

## 5. Browser support notes

- **Listening** uses `speechSynthesis`, supported in all modern browsers.
- **Speaking** uses `SpeechRecognition` / `webkitSpeechRecognition`, which is
  well-supported in Chrome and Edge (desktop and Android) but not in Firefox
  or Safari as of this writing. The app detects support and shows a fallback
  message rather than breaking.
- Writing exercises are graded with a lightweight, local heuristic (word
  count + expected-vocabulary check) rather than true grammar checking, since
  there's no AI grading service wired in — a sample answer is shown so
  learners can self-correct.

## 6. Security notes before going live

- Set a strong, random `JWT_SECRET` in production — never reuse the example value.
- Serve the backend over HTTPS (Render does this by default).
- Consider adding rate limiting (e.g. `express-rate-limit`) to the auth routes
  if you expect public traffic.
