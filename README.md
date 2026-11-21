# template-chat

A modern chatbot: FastAPI backend (`backend/`) + Vite/React frontend (`frontend/`)
with token streaming over Server-Sent Events.

## Quick start

```bash
# terminal 1
cd backend && uv sync && uv run uvicorn app.main:app --reload

# terminal 2
cd frontend && npm install && npm run dev
```

Open http://localhost:5173. The backend uses a placeholder echo provider — see
`backend/README.md` to wire up a real LLM.

## Container images

`.github/workflows/cd.yaml` builds multi-arch images on pull requests (without pushing) and
publishes them to GHCR on pushes to `main` and `v*` tags:

- `ghcr.io/<owner>/<repo>-backend` – FastAPI on port 8000
- `ghcr.io/<owner>/<repo>-frontend` – nginx on port 80 serving the static build and proxying
  `/api` to `BACKEND_URL` (default `http://backend:8000`)

```bash
docker network create chat
docker run -d --name backend --network chat ghcr.io/<owner>/<repo>-backend
docker run -d --network chat -p 8080:80 ghcr.io/<owner>/<repo>-frontend
```
