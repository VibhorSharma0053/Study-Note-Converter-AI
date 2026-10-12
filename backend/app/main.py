import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import parse
from app.middleware.security import (
    SecurityHeadersMiddleware,
    LimitUploadSizeMiddleware,
)
from app.middleware.rate_limiter import RateLimiterMiddleware

# Suppress verbose Google SDK auto-function-calling warnings in console logs
logging.getLogger("google").setLevel(logging.WARNING)

app = FastAPI(
    title="AI Study Notes Converter API",
    description="Converts AI chat transcripts into structured study notes",
    version="1.0.0",
)

# ─── REGISTER SECURITY MIDDLEWARE (ORDER MATTERS) ───

# 1. Attach Security Headers
app.add_middleware(SecurityHeadersMiddleware)

# 2. Limit Payload Size (Max 2MB)
app.add_middleware(LimitUploadSizeMiddleware)

# 3. Rate Limiter (Max 10 requests per minute per IP)
app.add_middleware(RateLimiterMiddleware, max_requests=10, window_seconds=60)

# 4. Strict CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite local dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],  # Only allow needed HTTP methods
    allow_headers=["Content-Type", "Authorization"],
)

# ─── ROUTERS ───
app.include_router(parse.router)


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "message": "AI Study Notes Converter API is secured and running!",
        "version": "1.0.0",
    }