# A/B Setup Evidence Receipt — Class-B Prospective Capture Proposal

Updated: 2026-09-27 Asia/Taipei  
Status: DESIGN_READY / OWNER_APPROVAL_REQUIRED / NOT_IMPLEMENTED  
Formal Core: LOCKED

## Scope

This is **not** a second Shadow architecture.

It is the A/B-setup specialization of the already-frozen
`SHADOW_COHORT_SEMANTICS_CLASS_B_PROPOSAL.md` design:

- immutable per-symbol decision-state parent;
- immutable population receipt;
- overlapping research-membership overlay;
- append-only quality overlay;
- exact parent-key outcome linkage.

The pure computation pieces are already Class-A research artifacts. Only shared runtime capture and durable D1 persistence remain Class B.

## Why the A/B lane needs its own receipt

The current legacy `NEAR_MISS` sample cannot support promotion-grade setup research because it:

- stores only a bounded subset;
- globally truncates before pool sampling;
- ranks using a Hamming count whose `nearScore` is algebraically redundant;
- treats dependent Formal booleans as if they were independent dimensions;
- has no immutable same-generation parent receipt.

Recent falsification strengthens the last point:

- B `strongClose>=0.65` structurally implies `upperShadow<=0.35` under the current OHLC-derived feature definitions;
- A `close>=0.985*support` is automatically clear whenever support came from the normal filtered-candidate path, but may bind on MA20 fallback.

Therefore the exact six-bit Formal masks must be kept as provenance, while research distance/margin semantics must be preserved in grouped raw form rather than collapsed into a new score.

## Proposed parent/child shape

### Parent decision-state receipt

One immutable row per actual same-generation Formal-evaluated symbol.

Must preserve:

- scan date / symbol / canonical market / price pool;
- parentDecisionReceiptId / captureGeneration / parentSnapshotHash;
- Formal worker/rule/gate-order versions;
- history/market source-quality state;
- original Formal result and first failure;
- whether all pre-setup gates were positively clear;
- exact AB_SETUP reach state;
- raw A/B pass states and B-over-A precedence.

The parent is selection-time and contains **no future outcomes**.

### A/B setup evidence child

References the immutable parent and stores:

- exact A/B check booleans and bitmasks;
- failed A/B counts and exact failed-check names;
- Hamming-only nearest channel;
- grouped raw margins from `ab_setup_margin_observer_v0_1`;
- support source/mode/fallback provenance;
- source/truthiness warnings;
- observer-vs-Formal agreement state.

No composite distance or fitted weighting is persisted.

### Population receipt

Before any bounded sampling, persist the complete same-generation counts:

- setup reached;
- setup pass;
- setup first failure;
- pre-setup not reached;
- UNKNOWN;
- `pool × nearestChannel × exactCheckPattern` population counts.

An absent stratum is a true zero only when the complete frame is positively CLEAN.

### Sample membership overlay

Sampling is a separate membership layer:

`scanDate × pool × nearestChannel × exactCheckPattern` -> deterministic bounded sample.

Every sampled row carries:

- populationCount;
- sampleCount;
- samplingFraction;
- sampling-frame version;
- deterministic sample rank/hash.

Changing a sample cap may change sample membership but must never change semantic membership or population denominators.

## Outcome child — later, not at selection capture

Future D1/D3/D5/D10/D20/MFE/MAE/stop/false-break evidence joins by the immutable parent key/generation.

Promotion-grade inference is blocked unless:

- the parent population is CLEAN;
- target outcome coverage is complete or explicitly UNKNOWN;
- reader pagination/keyset completeness is proven;
- analysis is date-cluster aware;
- regime/sector/liquidity/ATR/pool/channel controls are retained;
- check identity is tested before raw-margin incremental value;
- no post-outcome threshold sweep or distance-weight fitting is performed.

## Acceptance tests before any implementation can merge

1. Observer capture on/off yields identical Formal decisions and plans.
2. Zero new market-data calls.
3. Every setup-first-failure row has all prior gates positively clear in the same generation.
4. Raw geometry from PRE_SETUP_NOT_REACHED never enters the denominator.
5. B precedence on dual pass is unchanged.
6. Formal and research A/B pass states agree, otherwise quality is UNKNOWN.
7. Population counts are frozen before sampling.
8. Sample-cap changes do not alter semantic counts.
9. Duplicate immutable identity + different fingerprint is a provenance conflict, never overwrite.
10. Historical legacy Shadow rows remain untouched.
11. Complete-reader/keyset coverage is required before promotion inference.

## Engineering boundary

- Pure observers, offline receipt builders and synthetic fixtures: **Class A**.
- Shared Worker capture, additive D1 schema, durable persistence/read APIs: **Class B — owner approval required**.
- Any A/B threshold, precedence, Formal gate, rank, quota, capital or signal change: **Class C — owner approval required**.

No Production implementation, merge or deployment is authorized by this proposal.

## Optimization status

This is evidence infrastructure only.

Status:
`AB_SETUP_EVIDENCE_RECEIPT_DESIGN_READY / CLASS_B_OWNER_APPROVAL_REQUIRED / OUTCOMES_CLOSED / FORMAL_UNCHANGED`.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists from A/B setup research yet.
