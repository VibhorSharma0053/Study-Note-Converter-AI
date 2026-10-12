import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_parse_transcript_success_mock():
    """Test successful POST /api/parse with a valid transcript."""
    payload = {
        "transcript": (
            "User: Explain Python List Comprehensions with examples. "
            "Assistant: A list comprehension provides a concise way to create lists. "
            "Syntax: [expression for item in iterable if condition]. "
            "For example: evens = [x for x in range(10) if x % 2 == 0]."
        )
    }

    response = client.post("/api/parse", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert "title" in data
    assert "subject" in data
    assert "summary" in data
    assert isinstance(data["concepts"], list)
    assert isinstance(data["code_snippets"], list)


def test_parse_transcript_too_short_fails():
    """Test POST /api/parse with transcript under min character count."""
    payload = {"transcript": "Hi"}

    response = client.post("/api/parse", json=payload)
    # FastAPI/Pydantic returns 422 Unprocessable Entity for schema validation failures
    assert response.status_code == 422


def test_parse_transcript_whitespace_only_fails():
    """Test POST /api/parse with whitespace-only string."""
    payload = {"transcript": "                                                    "}

    response = client.post("/api/parse", json=payload)
    assert response.status_code in [400, 422]