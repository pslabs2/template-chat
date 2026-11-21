import json
from collections.abc import AsyncIterator
from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from ..llm import ChatProvider, get_provider
from ..schemas import ChatRequest

router = APIRouter(prefix="/api", tags=["chat"])


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


@router.post("/chat")
async def chat(
    req: ChatRequest, provider: Annotated[ChatProvider, Depends(get_provider)]
) -> StreamingResponse:
    async def events() -> AsyncIterator[str]:
        try:
            async for token in provider.stream(req.messages):
                yield _sse("token", {"content": token})
            yield _sse("done", {})
        except Exception as exc:  # surface provider errors to the client
            yield _sse("error", {"message": str(exc)})

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
