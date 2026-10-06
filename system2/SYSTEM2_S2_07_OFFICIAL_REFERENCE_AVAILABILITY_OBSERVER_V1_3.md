# System 2 S2-07 Official Reference Availability Observer V1.3

Updated: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE / shared TECHNICAL_CONTINUITY owner candidate  
Status: RESEARCH_ONLY / PROSPECTIVE_EVIDENCE_ADAPTER  
Formal Core: LOCKED  
Scheduler: NOT ADDED  
Trading authority: NONE

## Why V1.3 exists

V1.2 closed the historical ambiguity for the bounded 4806 / TPEX / CAPITAL_REDUCTION / 2026-10-02 reference row:

- the exact source row is mechanically useful;
- historical public availability cannot be reconstructed from current pages or MOPS source-reported clocks;
- the PIT replay gate therefore remains blocked.

The correct continuation is to stop backdating attempts and start preserving genuine first-observed evidence prospectively.

V1.3 implements that missing adapter for official continuity reference rows. It is a source-evidence component for the shared continuity owner's future cutoff-safe market-wide/full-eligible source cut. It is not a new indicator engine and it does not itself create a source-cut schedule.

## Stable identity

Cross-capture exact identity is:

- exchange;
- symbol;
- action family;
- effective date;
- `semanticHash`;
- `sourceRowHash`.

`eventVersionId` remains an immutable observation/capture receipt. It intentionally may change across later observations of the unchanged official row, so it is never the cross-capture stable key.

## Observation modes

### PROSPECTIVE_POLL

When an exact official row is actually fetched now:

- `firstObservedAt` is a conservative public-availability upper bound;
- `availableAt = firstObservedAt`;
- evidence class is `PROSPECTIVE_EXACT_VERSION_OBSERVER`;
- a later repeated observation of the same stable identity preserves the earlier first-observed clock;
- a different stable identity cannot inherit the prior clock.

A prior `NOT_OBSERVED` within five minutes may set `precisionEligible=true`, but that precision is not required merely to prove availability by a later parent cutoff.

### RETROSPECTIVE_READBACK

Historical readback never creates:

- `firstObservedAt`;
- `availableAt`;
- prospective availability authority.

## Cutoff semantics

`evaluateOfficialReferenceAvailabilityByCutoffV1_3` asks only:

> Was this exact stable official row genuinely prospectively observed no later than this cutoff?

It does not claim the exact publication instant and does not certify the global knownAt/version clock.

This matches the shared D03 handoff:

- first-observed availability by cutoff is enough for causal availability;
- selected-only post-parent lookup is invalid;
- high-frequency polling is not intrinsically required;
- shared owner must still build a market-wide/exchange-wide or full-eligible-universe cut before the parent.

## V1.2 interoperability

V1.3's prospective evidence shape is intentionally consumable by the V1.2 exact-reference gate.

Tests prove both directions:

1. an observation made after the 2026-10-02 cutoff **cannot** unlock 4806 historical replay;
2. a genuinely prospective exact-row observation made before a cutoff would satisfy only this bounded reference-availability gate.

Even the second case does not certify:

- global revision completeness;
- noRevisionGapThroughCut;
- symbol-session completeness;
- TECHNICAL_CONTINUITY;
- strategy/ranking/candidate authority;
- push/capital/order authority.

## Physical probe

`system2/scripts/probe_s2_07_official_reference_availability_observer_readonly_v1_3.mjs`

The probe re-fetches the exact official 4806 TPEx reference row and records a genuine **current** prospective observation. Because that observation occurs after 2026-10-02, the physical probe must also prove that the historical 4806 cutoff remains blocked.

This is deliberate: the first physical V1.3 sample validates the architecture without rewriting history.

## No scheduler in V1.3

V1.3 adds no Cron and no production polling budget.

The next shared-owner step is to bind this adapter into the already-frozen event-driven pre-parent source-cut architecture. Any future schedule or production persistence requires its own governed runtime decision and must account for complete source scope, append-only identity, truncation, budget, and no-revision-gap reconciliation.
