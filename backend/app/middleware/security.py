import logging
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi import status

logger = logging.getLogger(__name__)

# Maximum allowed payload size in bytes (2 MB)
MAX_REQUEST_SIZE_BYTES = 2 * 1024 * 1024  


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware that attaches protective security headers to every HTTP response.
    Defends against Clickjacking, MIME sniffing, and XSS.
    """

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Prevent site from being embedded in iframes (Clickjacking defense)
        response.headers["X-Frame-Options"] = "DENY"

        # Prevent browser from MIME-sniffing response types
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Enable browser XSS filtering
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Control referrer information leakage
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        return response


class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    """
    Middleware that rejects HTTP requests if the body size exceeds MAX_REQUEST_SIZE_BYTES.
    Prevents Out-Of-Memory (OOM) attacks from oversized payloads.
    """

    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")

        if content_length:
            try:
                length = int(content_length)
                if length > MAX_REQUEST_SIZE_BYTES:
                    logger.warning(
                        f"Rejected oversized request ({length} bytes) from IP {request.client.host}"
                    )
                    return JSONResponse(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content={
                            "detail": "Request payload is too large. Maximum allowed size is 2MB."
                        },
                    )
            except ValueError:
                pass

        return await call_next(request)