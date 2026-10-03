from pydantic import BaseModel, Field


class ParseRequest(BaseModel):
    """
    The data we expect to receive from the frontend.
    
    Pydantic will automatically:
    1. Check that 'transcript' exists in the request body
    2. Check that 'transcript' is a string
    3. Check that it's at least 50 characters long
    4. Check that it's at most 100,000 characters long
    5. Strip leading/trailing whitespace (via the validator below)
    
    If any check fails, FastAPI returns a 422 error with details.
    """
    
    transcript: str = Field(
        ...,  # The '...' (Ellipsis) means this field is REQUIRED
        min_length=50,
        max_length=100_000,
        description="The raw AI chat transcript to parse",
        examples=[
            "User: Explain Python decorators in detail.\n"
            "Assistant: A decorator is a function that takes another function..."
        ],
    )
    
    class Config:
        """Pydantic model configuration."""
        # This makes the auto-generated API docs cleaner
        json_schema_extra = {
            "example": {
                "transcript": "User: What is a closure in Python?\nAssistant: A closure is..."
            }
        }