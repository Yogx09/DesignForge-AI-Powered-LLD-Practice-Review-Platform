# DesignLab: Cloud Deployment & Hosting Guide

This guide details how to take the **DesignLab LLD Practice Platform** to production on public cloud providers (Render, Vercel, Railway, Fly.io, or Docker) with a hosted PostgreSQL database.

---

## ⚡ Option 1: 1-Click Deployment on Render (Recommended)

The repository includes a ready-to-use [`render.yaml`](./render.yaml) blueprint that sets up:
1. A **Web Service** running the unified Node.js production server.
2. A **Managed PostgreSQL Database** instance (`cipher_lld_db`).

### Steps to Deploy on Render:
1. Push your repository to **GitHub / GitLab**.
2. Go to [Render Dashboard](https://dashboard.render.com/) and click **"New" $\to$ "Blueprint"**.
3. Connect your GitHub repository.
4. Render will automatically detect `render.yaml` and configure:
   - **Build Command**: `npm install && npm --prefix backend install && npm --prefix frontend install && npm run build`
   - **Start Command**: `node backend/dist/server.js`
   - **Database**: Automatically links `DATABASE_URL` from the PostgreSQL instance.
5. Click **"Apply"**. Within 2 minutes, your live public URL (e.g. `https://cipher-lld-studio.onrender.com`) will be active!

---

## 🚀 Option 2: Docker Container Deployment (Railway / Fly.io / AWS / GCP)

The repository includes a production multi-stage [`Dockerfile`](./Dockerfile).

### Build & Run Docker Locally or in Cloud:
```bash
# 1. Build the production Docker image
docker build -t designlab-lld .

# 2. Run container (with optional PostgreSQL connection)
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://user:password@your-db-host:5432/dbname" \
  -e GEMINI_API_KEY="your-optional-key" \
  designlab-lld
```

### Deploy to Railway:
1. In [Railway.app](https://railway.app/), click **"New Project" $\to$ "Deploy from GitHub repo"**.
2. Add a **PostgreSQL Database** plugin in your Railway canvas.
3. Railway automatically binds `DATABASE_URL` and starts the container!

### Deploy to Fly.io:
```bash
fly launch
fly postgres create
fly postgres attach
fly deploy
```

---

## ⚡ Option 3: Vercel / Netlify + Hosted PostgreSQL (Neon / Supabase)

1. Provision a free PostgreSQL database on [Neon.tech](https://neon.tech/) or [Supabase.com](https://supabase.com/).
2. Copy your connection string: `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require`.
3. In your Vercel project settings, set:
   - `DATABASE_URL` = `your_neon_or_supabase_url`
   - `NODE_ENV` = `production`
4. Deploy with `vercel --prod`.

---

## 📦 Single-Command Production Runner (Self-Hosted / VPS)

To run the unified production build on any Linux/Windows server:
```bash
# 1. Build both frontend and backend
npm run build

# 2. Start production server (serves API on /api and React SPA on root /)
npm start
```
By default, the server listens on `http://localhost:4000` (or the port defined in `$PORT`).

---

## 🛡️ Zero-Config Fallback Guarantees
- **No Database?** If `DATABASE_URL` is omitted, the platform automatically switches to a durable in-memory store.
- **No AI Key?** If `GEMINI_API_KEY` is omitted, the platform automatically uses the rule-based Heuristic Engine.
- **Zero Login Friction**: Reviewers and candidates can immediately evaluate solutions without signing up.
