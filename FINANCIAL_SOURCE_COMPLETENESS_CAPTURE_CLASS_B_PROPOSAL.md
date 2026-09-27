# FINANCIAL_SOURCE_COMPLETENESS — Prospective Dual-State Capture Proposal

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-B PROPOSAL ONLY / NOT IMPLEMENTED  
Formal Core: LOCKED

## Why this proposal exists

The current research now separates two different objects:

1. **canonical source completeness** — same-generation FINANCIAL/VALUATION symbol membership plus scan-global ANNOUNCEMENTS verification;
2. **Formal merged-field completeness** — the exact fields that `scoreCandidate()` sees after enrichment and quality overlays.

Because arbitrary pre-quality enrichment fields may remain when an official per-symbol overlay is absent, those two states are not guaranteed to be identical.

No historical reconstruction is authorized.

## Minimum prospective receipt

Unit:

`scanDate x decisionGeneration x symbol x pricePool`

Parent linkage:
- immutable parent generation id;
- parent feature-universe fingerprint;
- exact pre-gate Formal-reach state;
- observer/version ids.

Pre-quality state:
- presence bitmap for quarterRevenue / financialBasis / revenueQoQ / revenueQuarterYoY;
- presence bitmap for valuationObserved / priceBookRatio;
- provenance class if already known; otherwise UNKNOWN;
- never infer source from value equality.

Canonical quality-source state:
- FINANCIAL snapshot id/asOf/year/quarter/hash;
- FINANCIAL symbol-entry present flag;
- VALUATION snapshot id/asOf/hash;
- VALUATION symbol-entry present flag;
- ANNOUNCEMENTS snapshot id/asOf/hash;
- sourcesVerified;
- per-symbol event-row presence/count.

Post-overlay Formal state:
- exact seven gate inputs as observed by `scoreCandidate()`;
- exact bundled gate PASS/FAIL;
- source-vs-merged alignment class:
  - ALIGNED_COMPLETE;
  - FORMAL_FIELD_PASS_WITH_CANONICAL_SOURCE_GAP;
  - BOTH_INCOMPLETE;
  - INVARIANT_VIOLATION_SOURCE_COMPLETE_FIELD_FAIL.

Quality requirements:
- positive reconciliation to the same parent generation;
- no silent omission-as-zero;
- UNKNOWN for unavailable provenance;
- append-only / immutable first-known receipt;
- no future outcomes in the parent receipt.

## Engineering boundary

The receipt can reuse already-loaded enrichment and quality objects and should add **zero market/source calls**.

However, wiring it into shared after-market runtime or D1 persistence is Class B and requires owner approval.

This proposal does not:
- clear alternate/custom fields;
- change merge precedence;
- change the FINANCIAL_SOURCE_COMPLETENESS gate;
- alter thresholds, ranking, quota, capital, signal, push or deployment behavior.

Any such decision change is Class C.

## Acceptance tests before implementation

1. zero additional source/network calls;
2. exact equality between captured post-overlay inputs and the fields passed to Formal;
3. no Formal decision diff with capture enabled versus disabled;
4. same-generation parent reconciliation;
5. duplicate/partial receipt fails closed;
6. missing provenance remains UNKNOWN;
7. source-complete + merged-field-fail is raised as an invariant violation, not silently counted.

## Outcome boundary

D1/D3/D5/D10/D20/MFE/MAE joins stay closed until enough CLEAN prospective dates exist and the dual-state receipt passes coverage/integrity review.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists from this proposal.
