import json
import logging
from typing import Any, Dict

from app.models.responses import ParseResponse
from app.services.ai_service import AIServiceError
from app.utils.sanitizers import extract_json_payload, sanitize_string

logger = logging.getLogger(__name__)


def normalize_raw_dict(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalizes a dictionary parsed from LLM JSON output to ensure it matches
    the expectations of ParseResponse Pydantic schema.
    
    Fixes:
    - Converts None/null lists to empty lists []
    - Strips whitespace from string fields
    - Normalizes difficulty ratings to lowercase ("easy", "medium", "hard")
    """
    if not isinstance(data, dict):
        return {}

    # Ensure root string fields exist and are sanitized
    data["title"] = sanitize_string(data.get("title") or "Untitled Study Notes")
    data["subject"] = sanitize_string(data.get("subject") or "General")
    data["summary"] = sanitize_string(data.get("summary") or "")

    # Normalize list fields (prevent None/null from breaking Pydantic)
    list_fields = [
        "concepts",
        "code_snippets",
        "interview_questions",
        "practice_questions",
        "important_points",
    ]
    for field in list_fields:
        if not isinstance(data.get(field), list):
            data[field] = []

    # Normalize concepts
    normalized_concepts = []
    for item in data.get("concepts", []):
        if isinstance(item, dict):
            normalized_concepts.append({
                "topic": sanitize_string(item.get("topic") or "General"),
                "title": sanitize_string(item.get("title") or "Concept"),
                "definition": sanitize_string(item.get("definition") or ""),
                "example": sanitize_string(item.get("example") or "") or None,
            })
    data["concepts"] = normalized_concepts

    # Normalize code_snippets
    normalized_code = []
    for item in data.get("code_snippets", []):
        if isinstance(item, dict):
            code_text = item.get("code") or ""
            if code_text.strip():  # Only include if code is non-empty
                normalized_code.append({
                    "title": sanitize_string(item.get("title") or "Code Example"),
                    "language": sanitize_string(item.get("language") or "text").lower(),
                    "code": code_text.strip(),
                    "explanation": sanitize_string(item.get("explanation") or ""),
                })
    data["code_snippets"] = normalized_code

    # Normalize interview_questions
    normalized_interview = []
    for item in data.get("interview_questions", []):
        if isinstance(item, dict):
            diff = sanitize_string(item.get("difficulty") or "").lower()
            if diff not in ["easy", "medium", "hard"]:
                diff = None

            normalized_interview.append({
                "question": sanitize_string(item.get("question") or ""),
                "answer": sanitize_string(item.get("answer") or ""),
                "explanation": sanitize_string(item.get("explanation") or "") or None,
                "difficulty": diff,
            })
    data["interview_questions"] = normalized_interview

    # Normalize practice_questions
    normalized_practice = []
    for item in data.get("practice_questions", []):
        if isinstance(item, dict):
            diff = sanitize_string(item.get("difficulty") or "").lower()
            if diff not in ["easy", "medium", "hard"]:
                diff = None
                
            q_type = sanitize_string(item.get("question_type") or "open-ended").lower()

            options = item.get("options")
            if not isinstance(options, list):
                options = None
            else:
                options = [sanitize_string(opt) for opt in options if opt]

            normalized_practice.append({
                "question": sanitize_string(item.get("question") or ""),
                "answer": sanitize_string(item.get("answer") or ""),
                "question_type": q_type,
                "options": options,
                "difficulty": diff,
            })
    data["practice_questions"] = normalized_practice

    # Normalize important_points
    data["important_points"] = [
        sanitize_string(p) for p in data.get("important_points", []) if isinstance(p, str) and p.strip()
    ]

    return data


def parse_and_validate_llm_response(raw_text: str) -> ParseResponse:
    """
    Full pipeline function:
    1. Extracts clean JSON payload from raw LLM text
    2. Parses raw JSON string into a Python dictionary
    3. Normalizes structure and fixes missing/malformed fields
    4. Validates against ParseResponse Pydantic schema
    
    Raises AIServiceError if JSON parsing fails completely.
    """
    if not raw_text or not raw_text.strip():
        raise AIServiceError("LLM returned an empty response.")

    json_payload = extract_json_payload(raw_text)

    try:
        raw_dict = json.loads(json_payload)
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse LLM response as JSON. Raw text: {raw_text[:200]}...")
        raise AIServiceError(
            "The AI generated output that could not be parsed as valid JSON. "
            "Please try submitting your transcript again."
        ) from e

    # Normalize dictionary structure
    normalized_dict = normalize_raw_dict(raw_dict)

    try:
        # Pydantic v2 validation
        validated_model = ParseResponse.model_validate(normalized_dict)
        return validated_model
    except Exception as e:
        logger.error(f"Pydantic model validation failed: {e}")
        raise AIServiceError("AI response did not match expected study notes format.") from e