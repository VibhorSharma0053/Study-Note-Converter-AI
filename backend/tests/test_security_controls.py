from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_security_headers_present():
    """Verify that SecurityHeadersMiddleware attaches protective response headers."""
    response = client.get("/api/health")
    assert response.status_code == 200

    headers = response.headers
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert "X-XSS-Protection" in headers


def test_oversized_payload_rejected():
    """Verify LimitUploadSizeMiddleware rejects payloads over 2MB with 413."""
    # Simulate a header claiming 3MB content length
    headers = {"Content-Length": "3000000", "Content-Type": "application/json"}
    response = client.post("/api/parse", headers=headers, content="{}")

    assert response.status_code == 413
    assert "payload is too large" in response.json()["detail"]