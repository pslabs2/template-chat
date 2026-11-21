# Backend

FastAPI service managed with [uv](https://docs.astral.sh/uv/).

```bash
uv sync
uv run uvicorn app.main:app --reload   # http://localhost:8000/docs
uv run pytest
uv run ruff check . && uv run ruff format .
```

## API

- `GET /api/health` – health check
- `POST /api/chat` – body `{"messages": [{"role": "user", "content": "..."}]}`; streams
  Server-Sent Events: `token` (`{"content": "..."}`), `done`, `error` (`{"message": "..."}`).

## Plugging in an LLM

`src/app/llm.py` ships an `EchoProvider` placeholder. Implement a class with an async
`stream(messages)` generator yielding text chunks and return it from `get_provider()`.
