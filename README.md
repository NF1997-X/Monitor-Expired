# Monitor-Expired

Ringkasan singkat / Short summary:
Monitor-Expired is a full‑stack Vite + React frontend and Express backend app that tracks food items and their expiry dates. The backend uses Drizzle ORM (Postgres / Neon) and is configured to run both as a local server and as a serverless function on Vercel.

## Quick start (local)

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file at the project root with your database connection string (example shown here — do NOT commit real credentials):

```properties
DATABASE_URL='postgresql://username:password@db-host/dbname?sslmode=require'
```

3. Run the development server (frontend + backend):

```bash
npm run dev
```

The app will be served locally on http://localhost:5000 by default.

## Build and run production locally

```bash
npm run build
npm start
```

`npm run build` produces a `dist` folder which contains the compiled server and `dist/public` for the frontend assets.

## Environment variables

- `DATABASE_URL` — required. Postgres connection string (Neon/Postgres).
- When deploying to Vercel, add the same `DATABASE_URL` to Vercel project Environment Variables (Production / Preview / Development as needed).

## API (examples)

The backend exposes JSON REST endpoints under `/api`.

- Get all items

```bash
curl https://<your-host>/api/food-items
```

- Create an item (POST /api/food-items)

Request body (JSON):
- `name` (string)
- `expiryDate` (ISO string or date) — e.g. `2025-12-31T00:00:00.000Z`
- `category` (string)
- `notes` (string, optional)

Example curl:

```bash
curl -X POST https://<your-host>/api/food-items \
  -H "Content-Type: application/json" \
  -d '{"name":"Milk","expiryDate":"2025-12-31T00:00:00.000Z","category":"Dairy","notes":"2L"}'
```

The server validates input using Zod and will return 400 with details if input is invalid.

## Vercel deployment notes

This project uses a custom server and has a serverless-compatible entry in `api/index.js` and a `vercel.json` routes/functions configuration.

Steps to deploy:

1. Connect the Git repository to Vercel (or use the Vercel CLI).
2. In Vercel Dashboard for the project, set the `DATABASE_URL` environment variable under Settings → Environment Variables.
3. Deploy (via Git push or `vercel --prod`):

```bash
# from project root
vercel --prod
```

Notes:
- The server code is built during `npm run build`. The production serverless endpoints import the compiled `dist` modules.
- If you see serverless timeouts or crashes, check Vercel function logs in the project dashboard and ensure `DATABASE_URL` is correct and reachable from Vercel.

## Troubleshooting

- "DATABASE_URL must be set": create `.env` for local dev or set env variable on Vercel.
- Database connection issues: verify credentials, network access, and SSL settings for your Postgres provider (Neon has specific connection strings).
- If serverless functions time out: examine logs, increase function memory / timeout in `vercel.json` or optimize initialization so it happens quickly.

## Project structure (high level)

- `client/` — React + Vite frontend
  - `src/` — React sources and UI components
- `server/` — Express server source (TypeScript)
  - `routes.ts`, `storage.ts`, `db.ts` — API, storage layer, DB connection
- `api/` — Vercel serverless function entry that imports compiled `dist` code
- `dist/` — compiled output after running `npm run build`
- `shared/` — shared schema (Drizzle + Zod)

## Tests / Build validation

To validate the build locally:

```bash
npm run build
# then run locally
npm start
```

### Example: quickly create an item locally

1. Start dev server:

```bash
npm run dev
```

2. Use curl to create an item (local):

```bash
curl -X POST http://localhost:5000/api/food-items \
  -H "Content-Type: application/json" \
  -d '{"name":"Yoghurt","expiryDate":"2025-12-01T00:00:00.000Z","category":"Dairy"}'
```

## Want me to commit & push?
If you want, I can commit the `README.md` and push it to `main`. Say `commit & push README` and I'll do it for you.

---
If you'd like the README in Malay or want more details (CI, tests, documentation), tell me which sections to expand.
