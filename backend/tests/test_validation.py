import pytest
from app.utils.sanitizers import extract_json_payload
from app.utils.validators import parse_and_validate_llm_response
from app.services.ai_service import AIServiceError


def test_extract_json_payload_from_markdown():
    raw = "```json\n{\"title\": \"Python Notes\"}\n```"
    assert extract_json_payload(raw) == '{"title": "Python Notes"}'


def test_extract_json_payload_with_conversational_text():
    raw = "Sure! Here is the JSON:\n{\"title\": \"Python Notes\"}\nHope this helps!"
    assert extract_json_payload(raw) == '{"title": "Python Notes"}'


def test_parse_and_validate_missing_fields_defaults():
    # Input missing summary, concepts, code_snippets
    raw = '{"title": "Test Title", "subject": "Test Subject"}'
    result = parse_and_validate_llm_response(raw)

    assert result.title == "Test Title"
    assert result.subject == "Test Subject"
    assert result.summary == ""
    assert result.concepts == []
    assert result.code_snippets == []
    assert result.interview_questions == []


def test_parse_and_validate_invalid_json_raises_ai_error():
    raw = "This is completely invalid non-json text"
    with pytest.raises(AIServiceError):
        parse_and_validate_llm_response(raw)