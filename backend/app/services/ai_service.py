from abc import ABC, abstractmethod

from app.models.responses import ParseResponse


class AIServiceError(Exception):
    """Raised when an AI provider cannot complete a parsing request."""


class AIService(ABC):
    """
    Common contract for all AI providers.

    Any provider implementation (Gemini, OpenAI, Ollama) must implement
    parse_transcript and return validated structured study notes.

    This prevents our API router from depending directly on a provider SDK.
    """

    @abstractmethod
    async def parse_transcript(self, transcript: str) -> ParseResponse:
        """
        Convert an untrusted raw transcript into structured study notes.

        Args:
            transcript: Raw chat transcript supplied by the user.

        Returns:
            A ParseResponse object.

        Raises:
            AIServiceError: If the provider request or parsing fails.
        """
        raise NotImplementedError