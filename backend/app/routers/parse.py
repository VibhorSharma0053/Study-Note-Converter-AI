from fastapi import APIRouter, HTTPException, status

from app.models.requests import ParseRequest
from app.models.responses import ParseResponse
from app.services.ai_service import AIServiceError
from app.services.mock_ai_service import MockAIService

router = APIRouter(prefix="/api", tags=["Parse"])

# Temporary dependency choice.
# In Phase 6, a provider factory will return GeminiService, OpenAIService,
# OllamaService, or MockAIService based on configuration.
ai_service = MockAIService()


@router.post(
    "/parse",
    response_model=ParseResponse,
    status_code=status.HTTP_200_OK,
)
async def parse_transcript(request: ParseRequest) -> ParseResponse:
    """
    Convert a user-provided transcript into structured study notes.

    The current implementation uses MockAIService.
    A real LLM provider is connected in Phase 6.
    """
    transcript = request.transcript.strip()

    if not transcript:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcript cannot be empty or contain only whitespace.",
        )

    if len(transcript.split()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Transcript is too short to contain meaningful study material. "
                "Please provide a longer AI learning conversation."
            ),
        )

    try:
        return await ai_service.parse_transcript(transcript)

    except AIServiceError as error:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI parsing service is temporarily unavailable. Please try again.",
        ) from error