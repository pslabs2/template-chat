"""LLM provider abstraction.

Swap `EchoProvider` for a real implementation (OpenAI, Anthropic, Ollama, ...)
by implementing `stream` and returning it from `get_provider`.
"""

import asyncio
from collections.abc import AsyncIterator
from typing import Protocol

from .schemas import Message


class ChatProvider(Protocol):
    def stream(self, messages: list[Message]) -> AsyncIterator[str]: ...


class EchoProvider:
    """Placeholder provider that streams back the last user message."""

    def __init__(self, delay: float = 0.03) -> None:
        self.delay = delay

    async def stream(self, messages: list[Message]) -> AsyncIterator[str]:
        last = next((m.content for m in reversed(messages) if m.role == "user"), "")
        reply = f"You said: {last}"
        for word in reply.split(" "):
            await asyncio.sleep(self.delay)
            yield word + " "


def get_provider() -> ChatProvider:
    return EchoProvider()
