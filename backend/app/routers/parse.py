from fastapi import APIRouter, HTTPException

from app.models.requests import ParseRequest
from app.models.responses import (
    ParseResponse,
    Concept,
    CodeSnippet,
    InterviewQuestion,
    PracticeQuestion,
)

# Create a router with a prefix and tags
# prefix: all routes in this router will start with /api
# tags: groups endpoints in the Swagger docs
router = APIRouter(prefix="/api", tags=["Parse"])


@router.post("/parse", response_model=ParseResponse)
async def parse_transcript(request: ParseRequest):
    """
    Parse an AI chat transcript into structured study notes.
    
    Currently returns MOCK data for development.
    Will be connected to the AI service in Phase 5-6.
    """
    
    # ─── Step 1: Basic validation beyond Pydantic ───
    # Pydantic already checked length and type, but we can add
    # business logic checks here.
    
    transcript = request.transcript.strip()
    
    if not transcript:
        raise HTTPException(
            status_code=400,
            detail="Transcript cannot be empty or whitespace only.",
        )
    
    # ─── Step 2: Check if transcript looks like a conversation ───
    # This is a simple heuristic. A real AI conversation usually
    # contains back-and-forth patterns.
    word_count = len(transcript.split())
    if word_count < 10:
        raise HTTPException(
            status_code=400,
            detail="Transcript is too short to contain meaningful content. "
                   "Please paste a longer AI conversation.",
        )
    
    # ─── Step 3: Generate structured notes ───
    # TODO: Replace this mock data with actual AI parsing (Phase 5-6)
    
    mock_response = ParseResponse(
        title="Mock Study Notes",
        subject="Development Mode",
        summary=(
            f"This is a mock response for development. "
            f"Your transcript was {len(transcript)} characters "
            f"and {word_count} words long. "
            f"The AI parsing will be connected in a later phase."
        ),
        concepts=[
            Concept(
                topic="Mock Topic",
                title="What is a Mock Response?",
                definition=(
                    "A mock response is placeholder data used during "
                    "development to test the frontend before the real "
                    "AI backend is connected."
                ),
                example="This entire response is a mock!",
            )
        ],
        code_snippets=[
            CodeSnippet(
                title="Hello World Example",
                language="python",
                code='print("Hello, World!")\nprint("This is a mock code snippet.")',
                explanation="A simple Python print statement used as placeholder data.",
            )
        ],
        interview_questions=[
            InterviewQuestion(
                question="What is the difference between a mock and a stub?",
                answer="A mock verifies behavior (was this method called?), while a stub provides canned data.",
                explanation="Both are test doubles, but they serve different purposes.",
                difficulty="medium",
            )
        ],
        practice_questions=[
            PracticeQuestion(
                question="What HTTP status code indicates a validation error?",
                answer="422 Unprocessable Entity",
                question_type="open-ended",
                difficulty="easy",
            )
        ],
        important_points=[
            "Always validate input before processing.",
            "Never trust external data — including AI output.",
            "Use mock data during development to unblock frontend work.",
        ],
    )
    
    return mock_response