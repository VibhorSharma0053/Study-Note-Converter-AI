import logging
import httpx

from app.config import settings
from app.models.responses import ParseResponse
from app.services.ai_service import AIService, AIServiceError
from app.services.prompt_builder import SYSTEM_INSTRUCTIONS, build_parse_prompt
from app.utils.validators import parse_and_validate_llm_response

logger = logging.getLogger(__name__)


class OllamaService(AIService):
    """
    Service for parsing transcripts using a local Ollama server
    with integrated output validation and sanitization pipeline.
    """

    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL.rstrip("/")
        self.model = settings.OLLAMA_MODEL

    async def parse_transcript(self, transcript: str) -> ParseResponse:
        prompt = build_parse_prompt(transcript)
        endpoint = f"{self.base_url}/api/generate"

        payload = {
            "model": self.model,
            "prompt": prompt,
            "system": SYSTEM_INSTRUCTIONS,
            "format": "json",
            "stream": False,
            "options": {"temperature": 0.1},
        }

        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.post(endpoint, json=payload)
                response.raise_for_status()

                data = response.json()
                raw_text = data.get("response", "")

                # Pass local LLM output through our validation pipeline
                return parse_and_validate_llm_response(raw_text)

        except httpx.HTTPError as e:
            logger.error(f"Ollama connection error: {e}")
            raise AIServiceError(
                f"Could not connect to local Ollama server at {self.base_url}."
            ) from e
        except AIServiceError:
            raise
        except Exception as e:
            logger.error(f"Ollama execution error: {e}")
            raise AIServiceError(f"Local AI error: {str(e)}") from e