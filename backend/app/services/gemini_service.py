import logging
from google import genai
from google.genai import types

from app.config import settings
from app.models.responses import ParseResponse
from app.services.ai_service import AIService, AIServiceError
from app.services.prompt_builder import SYSTEM_INSTRUCTIONS, build_parse_prompt
from app.services.chunker import split_transcript_into_chunks
from app.services.merger import merge_parse_responses
from app.utils.validators import parse_and_validate_llm_response

logger = logging.getLogger(__name__)


class GeminiService(AIService):
    """
    Service for parsing transcripts using Google Gemini API.
    Supports automatic chunking for long transcripts.
    """

    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise AIServiceError(
                "GEMINI_API_KEY environment variable is missing or empty. "
                "Please add it to backend/.env or switch AI_PROVIDER=mock."
            )

        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = settings.GEMINI_MODEL

    async def _parse_single_chunk(self, chunk_text: str) -> ParseResponse:
        """Parses a single chunk of text via Gemini."""
        prompt = build_parse_prompt(chunk_text)

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTIONS,
                    temperature=0.1,
                    response_mime_type="application/json",
                    response_schema=ParseResponse,
                    max_output_tokens=8192,
                ),
            )

            raw_text = response.text or ""
            return parse_and_validate_llm_response(raw_text)

        except Exception as e:
            logger.error(f"Gemini chunk parsing error: {e}")
            raise AIServiceError(f"Gemini processing error: {str(e)}") from e

    async def parse_transcript(self, transcript: str) -> ParseResponse:
        """
        Main entry point: splits long transcripts into chunks if necessary,
        parses each chunk, and merges the structured results.
        """
        chunks = split_transcript_into_chunks(transcript)

        if len(chunks) == 1:
            return await self._parse_single_chunk(chunks[0])

        logger.info(f"Processing {len(chunks)} chunks sequentially...")
        parsed_results = []

        for index, chunk in enumerate(chunks):
            logger.info(f"Parsing chunk {index + 1}/{len(chunks)}...")
            result = await self._parse_single_chunk(chunk)
            parsed_results.append(result)

        # Merge all parsed chunk responses into one final response
        merged_result = merge_parse_responses(parsed_results)
        return merged_result