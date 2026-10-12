import time
import logging
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi import status

logger = logging.getLogger(__name__)


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    In-memory Sliding Window Rate Limiter.
    Limits requests per client IP address to prevent API key exhaustion & DDoS.
    """

    def __init__(self, app, max_requests: int = 10, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        # Stores timestamps of requests for each client IP
        self.request_history = defaultdict(list)

    def _clean_old_requests(self, ip: str, now: float):
        """Removes timestamps older than the time window."""
        cutoff = now - self.window_seconds
        self.request_history[ip] = [
            ts for ts in self.request_history[ip] if ts > cutoff
        ]

    async def dispatch(self, request: Request, call_next):
        # Only rate limit POST requests to API endpoints
        if request.method == "POST" and request.url.path.startswith("/api/"):
            client_ip = request.client.host if request.client else "127.0.0.1"
            now = time.time()

            self._clean_old_requests(client_ip, now)

            # Check if IP has exceeded limit
            if len(self.request_history[client_ip]) >= self.max_requests:
                logger.warning(f"Rate limit exceeded for IP: {client_ip}")
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "detail": f"Rate limit exceeded. Maximum {self.max_requests} requests per minute allowed."
                    },
                    headers={"Retry-After": str(self.window_seconds)},
                )

            # Record request timestamp
            self.request_history[client_ip].append(now)

        return await call_next(request)