import logging
from app.config import settings
from app.services.ai_service import AIService
from app.services.gemini_service import GeminiService
from app.services.mock_ai_service import MockAIService
from app.services.ollama_service import OllamaService

logger = logging.getLogger(__name__)


def get_ai_service() -> AIService:
    """
    Factory function to instantiate the active AI service.
    Controlled via AI_PROVIDER in backend/.env:
    - 'gemini': Google Gemini Cloud API (Free tier)
    - 'ollama': Local Ollama Instance
    - 'mock'  : Local instant mock service (for fast testing)
    """
    provider = settings.AI_PROVIDER.lower()

    if provider == "gemini":
        logger.info("Initializing Gemini AI Service...")
        return GeminiService()
    elif provider == "ollama":
        logger.info("Initializing Ollama Local AI Service...")
        return OllamaService()
    elif provider == "mock":
        logger.info("Initializing Mock AI Service...")
        return MockAIService()
    else:
        logger.warning(
            f"Unknown AI_PROVIDER '{provider}'. Falling back to MockAIService."
        )
        return MockAIService()
    
# Global AI service instance initialized at startup
ai_service = get_ai_service()