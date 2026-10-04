import logging
from typing import List

logger = logging.getLogger(__name__)

# Target chunk size in characters (~3,000 to 4,000 words per chunk)
DEFAULT_CHUNK_SIZE = 15_000
# Overlap size to preserve context between chunk seams
DEFAULT_OVERLAP = 500


def split_transcript_into_chunks(
    transcript: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_OVERLAP,
) -> List[str]:
    """
    Splits a large transcript into smaller, boundary-aware text chunks.

    Args:
        transcript: The full raw transcript text.
        chunk_size: Max target characters per chunk.
        overlap: Character overlap between consecutive chunks.

    Returns:
        List of text chunks.
    """
    text = transcript.strip()
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size

        if end >= text_length:
            chunks.append(text[start:].strip())
            break

        # Find the best boundary near 'end' (looking backwards up to 1000 chars)
        search_zone = text[max(start, end - 1000) : end]
        
        # Priority 1: Split at double newline (paragraph / turn break)
        split_pos = search_zone.rfind("\n\n")
        
        # Priority 2: Split at single newline
        if split_pos == -1:
            split_pos = search_zone.rfind("\n")
            
        # Priority 3: Split at period + space (sentence break)
        if split_pos == -1:
            split_pos = search_zone.rfind(". ")

        if split_pos != -1:
            # Adjust split_pos relative to full text
            actual_end = max(start, end - 1000) + split_pos + 1
        else:
            actual_end = end  # Hard cutoff if no natural boundary found

        chunk_text = text[start:actual_end].strip()
        if chunk_text:
            chunks.append(chunk_text)

        # Move start forward, keeping overlap
        start = max(start + 1, actual_end - overlap)

    logger.info(f"Split transcript ({len(text)} chars) into {len(chunks)} chunks.")
    return chunks