from pydantic import BaseModel, Field
from typing import Optional


# ─── Individual Item Models ───

class Concept(BaseModel):
    """A single concept or definition extracted from the transcript."""
    topic: str = Field(description="The broader topic this concept belongs to")
    title: str = Field(description="Name of the concept")
    definition: str = Field(description="Clear definition or explanation")
    example: Optional[str] = Field(default=None, description="An example if available")


class CodeSnippet(BaseModel):
    """A code block extracted from the transcript."""
    title: str = Field(description="What this code demonstrates")
    language: str = Field(description="Programming language (e.g., python, javascript)")
    code: str = Field(description="The actual code")
    explanation: str = Field(description="What the code does")


class InterviewQuestion(BaseModel):
    """An interview-style question and answer."""
    question: str
    answer: str
    explanation: Optional[str] = Field(default=None, description="Deeper explanation")
    difficulty: Optional[str] = Field(
        default=None,
        description="easy, medium, or hard"
    )


class PracticeQuestion(BaseModel):
    """A practice or quiz question."""
    question: str
    answer: str
    question_type: str = Field(
        default="open-ended",
        description="Type: open-ended, mcq, true-false, fill-blank"
    )
    options: Optional[list[str]] = Field(
        default=None,
        description="Options for MCQ questions"
    )
    difficulty: Optional[str] = Field(default=None)


# ─── Main Response Model ───

class ParseResponse(BaseModel):
    """
    The complete structured study notes returned to the frontend.
    
    This is the shape of the JSON the frontend will receive.
    Every field has a default of an empty list/string so the
    frontend never crashes from missing data.
    """
    
    title: str = Field(
        default="Untitled Notes",
        description="Title of the study material"
    )
    subject: str = Field(
        default="General",
        description="Subject or domain (e.g., Python, Machine Learning)"
    )
    summary: str = Field(
        default="",
        description="Brief summary of the entire transcript"
    )
    
    concepts: list[Concept] = Field(
        default_factory=list,
        description="Key concepts and definitions"
    )
    code_snippets: list[CodeSnippet] = Field(
        default_factory=list,
        description="Code examples with explanations"
    )
    interview_questions: list[InterviewQuestion] = Field(
        default_factory=list,
        description="Interview preparation questions"
    )
    practice_questions: list[PracticeQuestion] = Field(
        default_factory=list,
        description="Practice and quiz questions"
    )
    important_points: list[str] = Field(
        default_factory=list,
        description="Key takeaways and important tips"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Python Decorators",
                "subject": "Python",
                "summary": "A comprehensive guide to Python decorators...",
                "concepts": [
                    {
                        "topic": "Decorators",
                        "title": "What is a Decorator?",
                        "definition": "A decorator is a function that...",
                        "example": "@my_decorator"
                    }
                ],
                "code_snippets": [],
                "interview_questions": [],
                "practice_questions": [],
                "important_points": ["Decorators are syntactic sugar for higher-order functions"]
            }
        }