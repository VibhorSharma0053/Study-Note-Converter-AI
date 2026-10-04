from app.services.chunker import split_transcript_into_chunks
from app.services.merger import merge_parse_responses
from app.models.responses import ParseResponse, Concept


def test_chunker_splits_large_text():
    # Generate text longer than 15,000 characters
    paragraph = "User: Explain Python functions in detail. " * 50 + "\n\n"
    large_text = paragraph * 10  # ~21,000 chars

    chunks = split_transcript_into_chunks(large_text, chunk_size=10_000)
    assert len(chunks) > 1
    assert all(len(c) <= 12_000 for c in chunks)


def test_merger_deduplicates_concepts():
    res1 = ParseResponse(
        title="Notes 1",
        concepts=[
            Concept(topic="Python", title="Decorators", definition="Wrap functions")
        ]
    )
    res2 = ParseResponse(
        title="Notes 2",
        concepts=[
            Concept(topic="Python", title="Decorators", definition="Duplicate concept"),
            Concept(topic="Python", title="Generators", definition="Yield values")
        ]
    )

    merged = merge_parse_responses([res1, res2])
    
    # Should contain 2 concepts total (Decorators deduplicated)
    assert len(merged.concepts) == 2
    assert merged.concepts[0].title == "Decorators"
    assert merged.concepts[1].title == "Generators"