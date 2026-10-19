# HAVEN

> An AI-powered rental property marketplace for renters and property managers,  
> initially focused on Indian cities such as Bhopal and Shahdol.

**Stack:** React + Vite + TypeScript · Node + Express + TypeScript · MongoDB · Tailwind CSS · shadcn/ui

---

## Repository layout

```
HAVEN/
├── client/          # React (Vite + TypeScript) frontend
│   └── src/
├── server/          # Express (TypeScript) backend
│   └── src/
├── .env.example     # Environment variable template – copy to .env
├── .gitignore
├── README.md
└── HAVEN_project.md # Full specification and chunked build plan
```

---

## Quick start

### Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 20 LTS |
| npm | 10 |
| MongoDB | 7 (local) or a MongoDB Atlas cluster |
| Git | any recent version |

### 1 – Clone and enter the repo

```bash
git clone <your-remote-url>
cd HAVEN
```

### 2 – Configure environment variables

```bash
# Copy the example and fill in your values
cp .env.example .env
```

Open `.env` and set at minimum:
- `MONGODB_URI` – your MongoDB connection string
- `JWT_SECRET` – a long random secret (generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)

Optional integrations (leave empty to skip):
- `AI_PROVIDER_API_KEY` + `AI_MODEL` – required for AI features (Chunks 11–13)
- `EMAIL_*` – required for OTP email delivery (Chunk 4); falls back to console logging
- `VITE_MAPBOX_TOKEN` – required for the property map (Chunk 5)

### 3 – Install dependencies

```bash
# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 4 – Start development servers

Open two terminals:

```bash
# Terminal 1 – backend (http://localhost:8080)
cd server
npm run dev

# Terminal 2 – frontend (http://localhost:5173)
cd client
npm run dev
```

Verify the backend is running:

```bash
curl http://localhost:8080/api/health
# → { "status": "ok", "timestamp": "..." }
```

---

## Available scripts

### Backend (`server/`)

| Command | Description |
|---|---|
| `npm run dev` | Start with ts-node-dev (hot reload) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled `dist/server.js` |

### Frontend (`client/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (HMR) |
| `npm run build` | Production bundle → `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Environment variables

See [`.env.example`](.env.example) for the full list with descriptions. A summary:

| Variable | Side | Required | Purpose |
|---|---|---|---|
| `PORT` | Server | No (default 8080) | HTTP port |
| `NODE_ENV` | Server | No (default development) | Runtime mode |
| `MONGODB_URI` | Server | **Yes** | Database connection |
| `JWT_SECRET` | Server | **Yes** | Token signing |
| `CLIENT_URL` | Server | No | CORS allowed origin |
| `AI_PROVIDER_API_KEY` | Server | Only for AI features | LLM provider access |
| `EMAIL_*` | Server | Only for OTP email | Transactional email |
| `STORAGE_PROVIDER` | Server | No (default `local`) | File storage backend |
| `VITE_API_BASE_URL` | Client | No | Backend API base URL |
| `VITE_MAPBOX_TOKEN` | Client | Only for maps | Mapbox public token |

> **Security:** Never put `JWT_SECRET`, `MONGODB_URI`, `EMAIL_PASSWORD`, or `AI_PROVIDER_API_KEY`  
> in any `VITE_*` variable — those are bundled into the browser build.

---

## Chunked build plan

Development follows the **Magic Door** approach from `HAVEN_project.md`:

| Chunk | Topic |
|---|---|
| 0 | Inspect and plan ← *current* |
| 1 | Foundation (Vite scaffold, Express, MongoDB connection, health check) |
| 2 | Design system and public pages |
| 3 | Models and property API |
| 4 | Authentication, email OTP, and roles |
| 5 | Property search and Mapbox |
| 6 | Favorites and renter dashboard |
| 7 | Manager dashboard and image uploads |
| 8 | Applications |
| 9 | Leases and payment records |
| 10 | Admin dashboard and moderation |
| 11–13 | AI features |
| 14 | Real-time messaging |
| 15 | CI and deployment preparation |
| 16 | Optional n8n workflows |

Each chunk is implemented only after the previous chunk is reviewed and approved.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `MongoServerError: connect ECONNREFUSED` | Start MongoDB locally (`mongod`) or check your Atlas URI |
| `Error: JWT_SECRET is not set` | Copy `.env.example` → `.env` and set the value |
| `CORS error in browser` | Ensure `CLIENT_URL` in `.env` matches the Vite dev server URL |
| Vite `VITE_API_BASE_URL` not working | Restart the Vite dev server after changing `.env` |

---

## Contributing

See `HAVEN_project.md` for the full specification, operating rules, and definition of done.  
Work only on the currently approved chunk. Open a PR with a clear description of changes.
