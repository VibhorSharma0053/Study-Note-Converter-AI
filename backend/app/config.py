import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings:
    """Application settings loaded from environment variables."""

    # Provider selection: "gemini", "ollama", or "mock"
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini").lower()

    # Gemini Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

    # Ollama Settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "qwen2.5-coder:7b")

    # Server Limits
    MAX_TRANSCRIPT_LENGTH: int = 100_000
    MIN_TRANSCRIPT_LENGTH: int = 50
    REQUEST_TIMEOUT_SECONDS: float = 60.0


settings = Settings()