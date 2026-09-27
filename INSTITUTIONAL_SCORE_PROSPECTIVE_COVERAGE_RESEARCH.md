# Institutional Score Prospective Coverage Audit

Updated: 2026-09-28 Asia/Taipei  
Status: CLASS-A COVERAGE OBSERVER / OUTCOMES CLOSED  
Formal Core: LOCKED

## Finding 1 — FULL_FORMAL_SCAN can replay Formal score

The snapshot stores:
- three buy-day values;
- three current-day actor nets;
- aggregate institutional net;
- chip concentration;
- ADV20 lots;
- stored institutional score.

For the current producer lineage, current-day net signs also reproduce `institutionsAligned`.

Therefore the deployed institutionalScore can be replayed and checked against the stored score.

## Finding 2 — B-247 v0.1 research decomposition mixed two time concepts

The old research observer used streakDays>0 to infer both:
- currentBuy;
- institutionsAligned.

Current Formal instead uses current-day net signs for currentBuy, and the current feature producer sets institutionsAligned from all three current-day nets being positive.

The v0.2 observer corrects this research-only semantic error. Formal is unchanged.

## Finding 3 — snapshot-only CLEAN evidence is impossible

Research snapshot v1 writes streaks using `journalInteger(value)||0`.

A persisted zero cannot tell:
- true observed zero-day streak;
- missing streak source coerced to zero.

The snapshot also omits `institutionHistoryDays` and the institution-streak readiness receipt.

Therefore a FULL_FORMAL_SCAN row with perfect score replay is at best:
`FORMAL_REPRODUCIBLE_BUT_STREAK_PROVENANCE_UNCERTIFIED`
until same-generation streak readiness is positively supplied.

## Coverage-only policy

The new observer can report by independent scanDate:
- Formal replay coverage;
- source-incomplete rows;
- streak-provenance-uncertified rows;
- score mismatch rows;
- and, only among CLEAN rows, saturation, actor-sign divergence, negative aggregate vs positive actor conflict, and ownership contribution share.

No outcome fields are read. No historical reconstruction is allowed.

## Engineering boundary

Pure replay/classification is Class A.

Adding institutionHistoryDays/readiness/source lineage to the shared persisted snapshot is Class B proposal-first.

Any formula/weight/ranking change is Class C.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists.
