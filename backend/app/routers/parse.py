import logging
from fastapi import APIRouter, HTTPException, status

from app.models.requests import ParseRequest
from app.models.responses import ParseResponse
from app.services.ai_service import AIServiceError
from app.services.factory import get_ai_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["Parse"])


@router.post(
    "/parse",
    response_model=ParseResponse,
    status_code=status.HTTP_200_OK,
)
async def parse_transcript(request: ParseRequest) -> ParseResponse:
    """
    Convert a user-provided transcript into structured study notes
    using the configured AI provider.
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
        # Obtain active AI service instance from Factory
        ai_service = get_ai_service()
        return await ai_service.parse_transcript(transcript)

    except AIServiceError as error:
        logger.error(f"AI Service failure: {error}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(error),
        ) from error
    except Exception as error:
        logger.error(f"Unexpected backend failure: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred while processing the transcript.",
        ) from error