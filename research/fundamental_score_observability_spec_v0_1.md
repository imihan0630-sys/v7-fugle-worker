# Fundamental Score Prospective Observability Contract v0.1

Date: 2026-09-26 Asia/Taipei
Scope: Research/Shadow only. Formal Core LOCKED.

## Audit result
Current loaded candidate data already contains the nine inputs used by fundamentalScore: revenueYoY; revenueMoM with existing revenueQoQ fallback; revenueYTDYoY; eps; grossMargin; operatingMargin; epsYoY; grossMarginYoY; operatingMarginYoY. financialDataCount uses this same availability family.

Current research snapshot stores total score and many raw fundamentals but omits grossMarginYoY and operatingMarginYoY, so exact historical score-component attribution is UNKNOWN and must not be backfilled from later data.

## Frozen prospective receipt
A future zero-extra-call Shadow-only receipt should preserve the nine raw inputs as seen at scan time, explicit observed/null availability signature, preClampScore, finalScore, availableWeightMax, and revenue-slot provenance: MONTHLY_MOM / QUARTERLY_QOQ / UNKNOWN.

financialDataCount cannot replace the signature: equal counts can correspond to different component identities/weights, and the MoM/QoQ fallback changes horizon semantics.

## Falsification / safety
Null remains UNKNOWN, never zero. The receipt must exactly reproduce current final score. Frozen-input regression must prove no change to Formal candidate eligibility/order, Top6/3+3, capital, monitoring, signals, or push. Historical decomposition remains UNKNOWN; prospective-only capture; no outcome inference yet.

Classification: Class A only when isolated to Research/Shadow serialization from already-loaded values. Shared score/enrichment/storage refactor => Class B proposal-first. Any score/weight/threshold change => Class C.

Status: specification frozen; implementation pending; no Formal optimization candidate.
