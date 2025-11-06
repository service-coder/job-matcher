# ADR-0001: Deterministic Scoring Algorithm (No LLM)

## Status

Accepted

## Context

We need to match client intake descriptions against a catalogue of trade positions and return a ranked list of top matches with explainable scores. The system must be:
- Fast (< 500ms response time)
- Explainable (users need to understand why positions were matched)
- Cost-effective (no external API dependencies)
- Deterministic (same input = same output)

## Decision

Use a deterministic, rule-based matching algorithm instead of LLM-based ranking.

**Algorithm components:**
1. **Keyword matching** (60% weight) - Token overlap between intake and position text
2. **Fuzzy matching** (30% weight) - Fuse.js similarity scoring
3. **Category boost** (10% weight) - Rule-based boosting (e.g., difficult access flag)

**NO LLM in ranking path** - All scoring is deterministic and explainable.

## Consequences

**Positive:**
- Fast execution (< 100ms for typical catalogue)
- Fully explainable scores (users see matched keywords, fuzzy match flag, category boost)
- No external API dependencies or costs
- Predictable results (same input always produces same output)
- Easy to debug and optimize

**Negative:**
- Limited semantic understanding (synonyms help but not perfect)
- Manual tuning required for weights and synonyms
- May miss nuanced matches that LLM could catch

**Mitigation:**
- Future: Can add embeddings-based matching (v2) while keeping explainability
- Hybrid approach: Combine deterministic scoring with embeddings, but always explainable

## Alternatives Considered

1. **LLM-based ranking** - Rejected due to:
   - Cost per request
   - Latency (API calls)
   - Lack of explainability
   - Non-deterministic results

2. **Pure keyword matching** - Rejected due to:
   - Too rigid, misses semantic similarity
   - Poor handling of synonyms and variations

3. **Embeddings only** - Rejected for v1 due to:
   - Additional infrastructure needed
   - Less explainable without hybrid approach

## Notes

This decision aligns with the requirement for explainable ranking. Future evolution (v2) may include embeddings but must maintain explainability through hybrid scoring.

