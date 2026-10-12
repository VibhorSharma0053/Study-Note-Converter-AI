import asyncio
import json
import logging
from google import genai
from google.genai import types

from app.config import settings
from app.models.responses import ParseResponse
from app.services.ai_service import AIService, AIServiceError
from app.utils.validators import parse_and_validate_llm_response
from app.services.prompt_builder import SYSTEM_INSTRUCTIONS, build_parse_prompt

logger = logging.getLogger(__name__)

# Fallback models in order of preference if the primary model throws 503/429
FALLBACK_MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
]


class GeminiService(AIService):
    """
    Resilient Google Gemini AI Service with automatic retries,
    exponential backoff, and model fallback support for 503/429 errors.
    """

    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise AIServiceError(
                "GEMINI_API_KEY environment variable is missing or empty. "
                "Please add it to backend/.env or switch AI_PROVIDER=mock."
            )

        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.primary_model = settings.GEMINI_MODEL

    async def _execute_with_retry(self, prompt: str) -> str:
        """
        Executes generation with automatic retry and model fallback logic.
        Handles 503 (High Demand) and 429 (Rate Limit) errors gracefully.
        """
        # Create a candidate list starting with configured model, followed by fallbacks
        candidate_models = [self.primary_model] + [
            m for m in FALLBACK_MODELS if m != self.primary_model
        ]

        max_retries_per_model = 2
        last_error = None

        for model in candidate_models:
            for attempt in range(1, max_retries_per_model + 1):
                try:
                    logger.info(f"Sending request to Gemini (Model: {model}, Attempt: {attempt})...")
                    
                    # Generate content call
                    response = self.client.models.generate_content(
                        model=model,
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=SYSTEM_INSTRUCTIONS,
                            temperature=0.1,
                            response_mime_type="application/json",
                            response_schema=ParseResponse,
                            max_output_tokens=8192,
                        ),
                    )

                    if response.text:
                        return response.text
                    
                    raise AIServiceError(f"Model {model} returned an empty response.")

                except Exception as e:
                    error_msg = str(e)
                    last_error = e

                    # Check if error is temporary (503 High Demand or 429 Rate Limit)
                    is_transient = "503" in error_msg or "429" in error_msg or "UNAVAILABLE" in error_msg

                    if is_transient:
                        wait_time = attempt * 2  # 2 seconds, then 4 seconds
                        logger.warning(
                            f"Gemini {model} experienced transient error (503/429). "
                            f"Retrying in {wait_time}s... Error: {error_msg[:100]}"
                        )
                        await asyncio.sleep(wait_time)
                    else:
                        # Non-transient error (e.g. invalid API key) — don't retry this model
                        logger.error(f"Non-transient error on model {model}: {error_msg}")
                        break

            logger.warning(f"Model {model} failed after retries. Trying fallback model...")

        raise AIServiceError(
            f"All Gemini models are currently experiencing high demand at Google. "
            f"Please wait a minute and try again. Details: {str(last_error)}"
        )

    async def _parse_single_chunk(self, chunk_text: str) -> ParseResponse:
        """Parses a single chunk using our retry-enabled generator."""
        prompt = build_parse_prompt(chunk_text)
        raw_text = await self._execute_with_retry(prompt)
        return parse_and_validate_llm_response(raw_text)

    async def parse_transcript(self, transcript: str) -> ParseResponse:
        """
        Main entry point supporting chunking, retries, and fallback models.
        """
        from app.services.chunker import split_transcript_into_chunks
        from app.services.merger import merge_parse_responses

        chunks = split_transcript_into_chunks(transcript)

        if len(chunks) == 1:
            return await self._parse_single_chunk(chunks[0])

        logger.info(f"Processing {len(chunks)} chunks sequentially with resilience...")
        parsed_results = []

        for index, chunk in enumerate(chunks):
            logger.info(f"Parsing chunk {index + 1}/{len(chunks)}...")
            result = await self._parse_single_chunk(chunk)
            parsed_results.append(result)

        return merge_parse_responses(parsed_results)