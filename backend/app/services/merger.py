import logging
from typing import List

from app.models.responses import ParseResponse

logger = logging.getLogger(__name__)


def merge_parse_responses(responses: List[ParseResponse]) -> ParseResponse:
    """
    Merges multiple ParseResponse objects into a single unified ParseResponse.
    Deduplicates concepts, code snippets, interview questions, and practice questions.
    """
    if not responses:
        return ParseResponse()

    if len(responses) == 1:
        return responses[0]

    primary = responses[0]

    merged_title = primary.title or "Combined Study Notes"
    merged_subject = primary.subject or "General"
    
    # Combine summaries
    summaries = [r.summary for r in responses if r.summary.strip()]
    merged_summary = " ".join(summaries)

    # ─── Deduplicate Concepts ───
    seen_concept_titles = set()
    merged_concepts = []

    for r in responses:
        for concept in r.concepts:
            key = concept.title.strip().lower()
            if key and key not in seen_concept_titles:
                seen_concept_titles.add(key)
                merged_concepts.append(concept)

    # ─── Deduplicate Code Snippets ───
    seen_code_titles = set()
    merged_code = []

    for r in responses:
        for snippet in r.code_snippets:
            key = snippet.title.strip().lower()
            if key and key not in seen_code_titles:
                seen_code_titles.add(key)
                merged_code.append(snippet)

    # ─── Deduplicate Interview Questions ───
    seen_questions = set()
    merged_interview = []

    for r in responses:
        for q in r.interview_questions:
            key = q.question.strip().lower()
            if key and key not in seen_questions:
                seen_questions.add(key)
                merged_interview.append(q)

    # ─── Deduplicate Practice Questions ───
    seen_practice = set()
    merged_practice = []

    for r in responses:
        for pq in r.practice_questions:
            key = pq.question.strip().lower()
            if key and key not in seen_practice:
                seen_practice.add(key)
                merged_practice.append(pq)

    # ─── Deduplicate Important Points ───
    seen_points = set()
    merged_points = []

    for r in responses:
        for pt in r.important_points:
            key = pt.strip().lower()
            if key and key not in seen_points:
                seen_points.add(key)
                merged_points.append(pt)

    return ParseResponse(
        title=merged_title,
        subject=merged_subject,
        summary=merged_summary,
        concepts=merged_concepts,
        code_snippets=merged_code,
        interview_questions=merged_interview,
        practice_questions=merged_practice,
        important_points=merged_points,
    )