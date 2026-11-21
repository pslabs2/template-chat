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
