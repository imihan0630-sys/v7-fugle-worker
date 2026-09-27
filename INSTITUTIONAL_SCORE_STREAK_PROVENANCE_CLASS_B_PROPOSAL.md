# Institutional Score Streak Provenance — Minimal Class-B Capture Proposal

Updated: 2026-09-28 Asia/Taipei  
Status: PROPOSAL ONLY / OWNER APPROVAL REQUIRED  
Formal Core: LOCKED

Current FULL_FORMAL_SCAN already stores every value needed to replay the deployed institutionalScore numerically. The missing evidence is **source provenance for the three buy-day streaks**, because snapshot serialization converts missing streak values to zero.

The minimal additive selection-time receipt is:

- `institutionHistoryDays`;
- `institutionStreakReady` for the exact scan generation;
- the three expected institution snapshot dates;
- the three valid/observed institution snapshot dates;
- optional source receipt/fingerprint linking those dates to the same generation;
- raw pre-fallback `foreignBuyDays / trustBuyDays / dealerBuyDays` observation flags.

No extra market call is required: these values already exist in `readInstitutionStreakMap()` / the merged feature row before research-snapshot serialization.

This proposal does **not** require storing a separate `institutionsAligned` field because the current producer contract is exactly current-day `foreignNet>0 && trustNet>0 && dealerNet>0`, and the three current nets are already stored.

Acceptance guards:
- additive research provenance only;
- missing receipt remains UNKNOWN;
- no historical backfill from current data;
- no change to institutionalScore, PriorityScore, eligibility, ranking, quota, capital, monitoring or signals;
- duplicate generation or timestamp mismatch fails research quality closed.

Shared snapshot/runtime persistence is Class B and requires owner approval. Institutional score formula or weight changes remain Class C.
