import os
from dotenv import load_dotenv

# Load environment variables from .env file
# This looks for a .env file in the backend/ directory
load_dotenv()


class Settings:
    """
    Application settings loaded from environment variables.
    
    Why a class instead of just using os.getenv() everywhere?
    1. Single source of truth — all settings in one place
    2. Easy to add defaults
    3. Easy to test (you can override settings in tests)
    4. Clear documentation of what settings exist
    """
    
    # AI Provider Settings
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Server Settings
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    
    # Application Limits
    MAX_TRANSCRIPT_LENGTH: int = 100_000  # characters
    MIN_TRANSCRIPT_LENGTH: int = 50       # characters
    
    def get_api_key(self) -> str:
        """Return the API key for the currently configured provider."""
        if self.AI_PROVIDER == "gemini":
            return self.GEMINI_API_KEY
        elif self.AI_PROVIDER == "openai":
            return self.OPENAI_API_KEY
        return ""


# Create a single settings instance that the whole app can import
settings = Settings()