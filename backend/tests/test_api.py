from fastapi.testclient import TestClient

from app.llm import EchoProvider, get_provider
from app.main import app

app.dependency_overrides[get_provider] = lambda: EchoProvider(delay=0)
client = TestClient(app)


def test_health() -> None:
    assert client.get("/api/health").json() == {"status": "ok"}


def test_chat_streams_tokens() -> None:
    res = client.post("/api/chat", json={"messages": [{"role": "user", "content": "hi"}]})
    assert res.status_code == 200
    assert res.headers["content-type"].startswith("text/event-stream")
    assert "event: token" in res.text
    assert res.text.rstrip().endswith("event: done\ndata: {}")


def test_chat_rejects_empty_messages() -> None:
    assert client.post("/api/chat", json={"messages": []}).status_code == 422
