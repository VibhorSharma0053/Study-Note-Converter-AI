from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import parse

app = FastAPI(
    title="AI Study Notes Converter API",
    description="Converts AI chat transcripts into structured study notes",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the parse router
# All routes defined in parse.router are now part of our app
app.include_router(parse.router)


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "message": "AI Study Notes Converter API is running!",
        "version": "0.1.0",
    }