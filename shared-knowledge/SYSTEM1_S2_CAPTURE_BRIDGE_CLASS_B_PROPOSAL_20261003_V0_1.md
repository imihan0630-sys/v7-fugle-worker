# System1 S2 Capture Bridge — Class-B Proposal 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: DESIGN_ONLY / OWNER_APPROVAL_REQUIRED_BEFORE_IMPLEMENTATION / FORMAL_CORE_LOCKED

## Purpose

Define the **smallest possible** shared-runtime evidence additions that may eventually be needed after Class-A diagnostics prove they are worth capturing.

This document does not authorize implementation.

Parent readiness audit:
`shared-knowledge/SYSTEM1_S1_S2_PROSPECTIVE_CAPTURE_READINESS_AUDIT_20261003_V0_1.md`

## Principle

Do not solve every UNKNOWN just because it exists.

A Class-B capture should be implemented only when:
1. the corresponding Class-A upper-bound diagnostic is materially informative;
2. the missing receipt prevents a promotion-grade conclusion;
3. the new field can be captured prospectively without changing Formal behavior;
4. the addition has explicit provenance, immutable parent linkage and rollback.

## Lane B1 — safety receipt augmentation

### Current gap
C1 V0.1 persists:
- corporate-action continuity = UNKNOWN;
- execution feasibility = UNKNOWN;
- account risk = UNKNOWN.

### Trigger to consider implementation
Only if Conditional P1-A Reach shows a material F9 upper-bound population and the unresolved safety state materially prevents classification.

### Preferred architecture
Do **not** silently mark safety PASS.

Prefer additive per-symbol safety evidence referenced to the immutable C1 decision generation:
- parent generation ID;
- symbol;
- safety family;
- PASS / FAIL / UNKNOWN;
- source receipt;
- knownAt;
- rule/version;
- reason.

### Minimum semantics
Corporate action:
- verified no continuity-breaking action at decision time;
- verified continuity-breaking action;
- UNKNOWN.

Execution:
- factual orderability/tradability evidence;
- do not equate average volume proxy with factual executability.

Account:
- keep separate from stock economic thesis;
- only explicit account/risk-authority receipt may produce PASS/FAIL;
- do not infer from absence.

### No authorization
This proposal does not approve B1 implementation now.

## Lane B2 — target semantic provenance capture

### Current gap
The four-state classifier exists, but current C1 does not persist the evidence required to prove `TARGET_NONE_SEARCH_COMPLETE`.

### Minimal same-scan research payload
Where already available in memory, preserve:
- channel;
- entry / stop;
- priorHigh20 / priorHigh60;
- dated pivot candidates used by current search;
- targetPrice raw if present;
- selected target;
- selected source(s);
- searchComplete;
- search algorithm/rule version;
- search lookback start/end;
- source receipt IDs where available;
- target source state;
- geometry-quality state;
- knownAt / decisionAt.

### Source-state receipt
Because targetPrice may come from custom enrichment, persist secret-safe source state:
- customConfigured;
- customMode = JSON / API / NONE;
- customFetchStatus = SUCCESS / FAILED / NOT_CONFIGURED;
- customStockCount;
- targetPriceObservedCount;
- targetPricePITProvenanceCompleteCount;
- targetPricePITProvenanceUnknownCount;
- capturedAt;
- scanDate;
- non-secret error class.

Never persist:
- URL/token/credential secrets.

### Required guarantees
- zero changes to Formal target/RR computation;
- zero changes to current candidate ordering;
- no new market call unless separately approved;
- immutable generation linkage;
- insert-once/idempotent semantics;
- provenance conflict on same identity/different payload;
- old rows are not rewritten;
- legacy NONE is never backfilled as search-complete without contemporaneous evidence.

### Why Class B
Even if data are already loaded in memory, wiring them into Worker-generated C1/shared persistent evidence changes shared runtime/persistence and therefore remains proposal-first Class B.

## Acceptance gates before any implementation PR

For either lane:
- explicit owner approval;
- latest-main re-read;
- zero Formal output diff on deterministic fixture;
- no A/B/RR/Grade/ranking/quota/capital/signal/push/order change;
- immutable parent linkage;
- full Regression + Repair CI;
- rollback documented;
- research-only fields fail closed to UNKNOWN.

## Current recommendation

- B1 safety augmentation: **DEFER** until Class-A conditional P1-A funnel proves materiality.
- B2 target provenance: **DESIGN READY BUT DEFER IMPLEMENTATION** until owner chooses to prioritize the S2B target question.

Formal Core impact: NONE.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
