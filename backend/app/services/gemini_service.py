import json
import logging
from google import genai
from google.genai import types

from app.config import settings
from app.models.responses import ParseResponse
from app.services.ai_service import AIService, AIServiceError
from app.services.prompt_builder import SYSTEM_INSTRUCTIONS, build_parse_prompt

logger = logging.getLogger(__name__)


class GeminiService(AIService):
    """
    Service for parsing transcripts using Google Gemini API.
    Uses the modern google-genai SDK with structured response schema.
    """

    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise AIServiceError(
                "GEMINI_API_KEY environment variable is missing or empty. "
                "Please add it to backend/.env or switch AI_PROVIDER=mock."
            )

        # Initialize Google GenAI client safely on the backend
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = settings.GEMINI_MODEL

    async def parse_transcript(self, transcript: str) -> ParseResponse:
        """Sends the transcript to Google Gemini and parses the structured response."""
        prompt = build_parse_prompt(transcript)

        try:
            # Configure structured output using Pydantic model directly
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTIONS,
                    temperature=0.1,  # Low temperature for precise extraction
                    response_mime_type="application/json",
                    response_schema=ParseResponse,  # Enforces Pydantic schema structure
                ),
            )

            if not response.text:
                raise AIServiceError("Gemini returned an empty response.")

            # Convert response JSON string into our validated Pydantic model
            raw_json = json.loads(response.text)
            validated_response = ParseResponse(**raw_json)
            return validated_response

        except json.JSONDecodeError as e:
            logger.error(f"Gemini output was not valid JSON: {e}")
            raise AIServiceError("Failed to parse AI output as valid JSON.") from e

        except Exception as e:
            logger.error(f"Gemini API request failed: {e}")
            raise AIServiceError(f"Gemini processing error: {str(e)}") from e