import json
import logging
import httpx

from app.config import settings
from app.models.responses import ParseResponse
from app.services.ai_service import AIService, AIServiceError
from app.services.prompt_builder import SYSTEM_INSTRUCTIONS, build_parse_prompt

logger = logging.getLogger(__name__)


class OllamaService(AIService):
    """
    Service for parsing transcripts using a local Ollama server.
    Completely free and runs locally on your machine.
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
            "format": "json",  # Enforce JSON mode in Ollama
            "stream": False,
            "options": {
                "temperature": 0.1
            }
        }

        try:
            async with httpx.AsyncClient(timeout=settings.REQUEST_TIMEOUT_SECONDS) as client:
                response = await client.post(endpoint, json=payload)
                response.raise_for_status()

                data = response.json()
                raw_response_text = data.get("response", "")

                if not raw_response_text:
                    raise AIServiceError("Ollama returned an empty response.")

                raw_json = json.loads(raw_response_text)
                return ParseResponse(**raw_json)

        except httpx.HTTPError as e:
            logger.error(f"Ollama connection error: {e}")
            raise AIServiceError(
                f"Could not connect to local Ollama server at {self.base_url}. "
                "Ensure Ollama is running (`ollama serve`)."
            ) from e
        except json.JSONDecodeError as e:
            logger.error(f"Ollama response was not valid JSON: {e}")
            raise AIServiceError("Failed to parse Ollama output as JSON.") from e