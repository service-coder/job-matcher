# Code Review Findings

## 1. "Category boost" now applies only to accessibility positions
`calculateCategoryBoost` now requires the trade code and only awards the 0.2 bonus to accessibility (`0300`) trades when the intake toggles difficult access, ensuring that other trades are not misleadingly labeled as boosted. The `MatchResult` reasoning is updated accordingly so only genuinely boosted rows display the flag. 【F:src/lib/matcher/score.ts†L5-L40】【F:src/lib/matcher/index.ts†L71-L125】

## 2. Deduplication preserves the highest-scoring duplicate
`deduplicateByPositionNumber` keeps the top-scoring `position_number` entry instead of the first catalogue occurrence, so rows listed under multiple trades no longer discard a better-scoring variant. This change happens before sorting so the final ranking reflects the strongest candidate per position. 【F:src/lib/matcher/index.ts†L49-L125】

## 3. Fuzzy matching uses lightweight Dice similarity
`getBestMatch` swapped Fuse.js (which instantiated a new index per position) for a normalized bigram Dice coefficient built on top of the existing tokenizer utilities. This reduces the per-position cost to O(n) string operations without heap-heavy index rebuilds and keeps scores in the familiar 0–1 range. 【F:src/lib/fuzzy/get-best-match.ts†L1-L38】

## 4. API route validates requests with Zod
`POST /api/match` now shares the same Zod schema used by the client and rejects malformed submissions with a `400` that contains flattened field errors, preventing untrusted payloads from reaching the matcher. 【F:app/api/match/route.ts†L1-L68】
