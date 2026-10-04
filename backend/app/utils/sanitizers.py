import re
import logging

logger = logging.getLogger(__name__)


def extract_json_payload(text: str) -> str:
    """
    Extracts a JSON string from raw text that may contain Markdown code fences
    or conversational text.

    Examples handled:
    - ```json\n{"title": "Demo"}\n```  -->  {"title": "Demo"}
    - ```\n{"title": "Demo"}\n```      -->  {"title": "Demo"}
    - Here is your JSON: {"a": 1}      -->  {"a": 1}
    """
    if not text or not text.strip():
        return ""

    cleaned = text.strip()

    # Pattern 1: Strip ```json ... ``` or ``` ... ``` Markdown fences
    markdown_pattern = r"```(?:json)?\s*([\s\S]*?)\s*```"
    match = re.search(markdown_pattern, cleaned, re.IGNORECASE)
    if match:
        cleaned = match.group(1).strip()

    # Pattern 2: Locate first '{' and last '}'
    start_idx = cleaned.find("{")
    end_idx = cleaned.rfind("}")

    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        cleaned = cleaned[start_idx : end_idx + 1]

    return cleaned


def sanitize_string(val: str) -> str:
    """Strips leading/trailing whitespace and removes control characters."""
    if not isinstance(val, str):
        return str(val) if val is not None else ""
    
    # Strip whitespace and replace null bytes or unusual control characters
    cleaned = val.strip().replace("\x00", "")
    return cleaned