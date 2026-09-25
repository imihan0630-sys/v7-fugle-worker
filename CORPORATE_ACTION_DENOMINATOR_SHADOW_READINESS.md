# Corporate Action Denominator / Lifecycle Shadow Readiness

Updated: 2026-09-25 Asia/Taipei  
Status: RESEARCH_ONLY / CA-110 EVIDENCE CHECKPOINT  
Formal Core: LOCKED / UNCHANGED

## Purpose

Decide whether CA-106 through CA-109 evidence is mature enough to justify **only** a future Class-A Shadow proposal.

This document does **not** authorize:
- Worker.js wiring;
- Formal A/B, ranking, threshold, RR, capital, entry/add/reduce/sell/stop changes;
- production monitoring or push changes;
- merge of draft PR #101;
- production deployment.

## Evidence completed

### CA-106 — Daily denominator source contract

Materialized:
`research/corporate_action_denominator_source_receipt_v0_1.json`.

Positive evidence:
- TWSE official BFT51U is a daily denominator backbone and documents both issued and listed share-base fields.
- TPEx official Daily Stock Quotes expose a daily `發行股數` field and historical public tables.
- TPEx official statistics explicitly state that capital and turnover are calculated using issued shares.
- Cross-exchange denominator semantics can therefore be modeled explicitly rather than inferred from a generic `turnoverRate`.

Negative evidence retained:
- TWSE BFT51U exact raw-unit normalization is still UNKNOWN because the official sample/format artifact was not successfully retrieved by the research client.
- TWSE Chinese and English product pages disagree on the documented start date.
- TPEx public historical artifacts are strong, but a stable long-run machine/API contract is not yet frozen.
- Payment-certificate/private-placement treatment is unresolved for an exact exchange-listed/tradable denominator in the 2465 witness.
- A complete bounded historical denominator archive has not yet been captured.

Conclusion:
source semantics are sufficiently specified for further research infrastructure, but the full archive data gate is **NO_GO**.

### CA-107 — Pre-registered four-family denominator disagreement sample

Materialized:
`research/corporate_action_volume_semantic_family_sample_v0_1.json`.

Pre-registered family set:
- 8454 stock-dividend supply change;
- 2465 cash increase/payment-certificate supply;
- 3593 loss-reduction unit scale;
- 8422 par-value-change unit scale.

Positive and counter evidence:
- 3593 proves a verified share-unit change can flip both current low-volume and breakout-volume Boolean interpretation.
- 8454 proves a supply-base normalization can materially change a ratio without changing either Boolean.
- 8422 proves a very large numeric distortion need not flip a Boolean when both values remain on the same side of the boundary.
- 2465 proves denominator choice itself can create or remove a disagreement: strict then-registered shares produce no low-volume flip; the unresolved public-tradable sensitivity produces one.

Conclusion:
corporate-action volume semantics are materially relevant, but there is no universal correction rule and no pooled alpha inference is valid.

### CA-108 — Downstream denominator replay mechanics

Materialized:
`research/corporate_action_downstream_denominator_replay_v0_1.json`.

Findings:
- current raw institutional net-share counts remain factual through a pure supply change;
- normalized institutional flow changes mechanically with denominator choice;
- historical derived capitalization changes with share vintage even when the historical close is unchanged;
- using a later/current share snapshot with an old historical price creates a future-vintage error;
- registered-issued, listed/tradable, free-float and EPS weighted-average shares remain separate semantic objects.

Conclusion:
a point-in-time denominator firewall is required before any normalized-flow or fallback historical-cap research.

### CA-109 — Executable revision/cancellation lifecycle semantics

Draft PR #101 research branch:
`research/class-b-corporate-action-history-semantics-20260925`

New research-only files:
- `research/corporate_action_lifecycle_state_machine_prototype.mjs`;
- `tests/test_corporate_action_lifecycle_state_machine_prototype.mjs`.

Executable cases:
1. revision before original effective date;
2. late correction with no retrospective leakage;
3. cancellation before effective date;
4. post-effective cancellation negative control;
5. same-session UNIT_SCALE + SUPPLY_CHANGE deterministic ordering;
6. unreconciled active semantic conflict fails closed;
7. exact duplicate idempotence;
8. NO_EVENT only when event-source coverage is complete.

Trusted GitHub Actions evidence on commit:
`0c18332013a79faf5f184858b046e9d75d4d11c6`

Runs:
- Research Corporate Action Prototype `36148491289`: SUCCESS;
- V8 Regression Tests `36148491397`: SUCCESS;
- V8 Repair CI `36148491185`: SUCCESS.

Research job `108115507007` explicitly passed:
- corporate action continuity tests;
- symbol suspension calendar tests;
- corporate action integration falsification matrix;
- share denominator vintage tests;
- corporate action lifecycle revision and cancellation tests.

No Worker.js behavior was changed to obtain these results.

## CA-110 readiness decision

### What is mature enough

The following are mature enough for a **proposal-only** Class-A Shadow design:
- explicit denominator semantic spaces;
- dual-clock `knownAt` / `effectiveFromSession` replay gates;
- fail-closed conflict and missing-coverage states;
- raw-volume vs normalized-turnover separation;
- deterministic corporate-action lifecycle ordering;
- revision/cancellation replay semantics;
- executable negative controls;
- isolation from Formal decision logic.

### What is not mature enough

The following block implementation or any production-like dependency:
1. `TWSE_BFT51U_UNIT_NORMALIZATION_CONTRACT=UNKNOWN`;
2. no complete bounded daily TWSE denominator archive;
3. TPEx stable long-run machine/API ingestion contract not frozen;
4. exact 2465 payment-certificate/private-placement tradable denominator unresolved;
5. full revision/completeness receipts have not been produced for a real bounded dual-exchange archive;
6. no prospective denominator collector has demonstrated immutable vintage retention over live market days.

### Evidence-gated result

`CLASS_A_SHADOW_PROPOSAL_READINESS = PROPOSAL_ONLY / DATA_GATES_NOT_READY_FOR_IMPLEMENTATION`

A design document may be drafted later without decision impact.
No implementation, merge, deployment, Formal dependency or owner option is selected by this checkpoint.

## Exact continuation

CA-111: obtain an official TWSE BFT51U sample/format artifact through an authorized retrieval path and pin raw units; retain the Chinese/English start-date discrepancy unless officially reconciled.

CA-112: freeze a stable TPEx historical daily denominator ingestion contract (machine endpoint or immutable official CSV-artifact workflow), with parser/version receipts.

CA-113: execute a bounded dual-exchange daily denominator archive pilot and produce per-date/per-symbol completeness receipts, including revision and missing-date controls.

CA-114: resolve payment-certificate/private-placement treatment using daily exchange denominator artifacts around the 2465 event and at least one independent witness.

CA-115: re-evaluate Class-A Shadow implementation readiness only after CA-111 through CA-114 pass. Formal Core remains locked.
