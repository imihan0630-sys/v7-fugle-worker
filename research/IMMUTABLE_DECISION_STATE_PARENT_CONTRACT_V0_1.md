# Immutable Decision-State Parent Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / DESIGN_FROZEN / CLASS_B_NOT_IMPLEMENTED
Formal Core: LOCKED

## Purpose

Define the canonical immutable per-symbol parent receipt that future research evidence children attach to.

The parent must record what the production selector actually knew and did in that exact scan generation.

It must NOT be a later research-side re-score.

## TI-422 — Parent population

Per-symbol parent scope:

all history-admitted feature rows actually evaluated by the same-scan Formal decision path.

Upstream rows blocked before feature evaluation remain represented in the date-level scan population receipt.

Therefore the parent population includes:
- early base failures;
- downstream first failures;
- fully qualified rows not selected by quota/rank;
- selected rows.

Selected-only parentage is prohibited for generic factor-promotion research.

## TI-423 — Identity

Required immutable identity inputs:

- scanDate;
- symbol;
- captureGeneration;
- decisionCutoffAt;
- formalWorkerVersion;
- selectionRuleVersion;
- rankComparatorVersion;
- parentSchemaVersion.

parentDecisionReceiptId is a deterministic hash of the identity tuple ONLY.

semanticFingerprint is computed separately from the immutable decision payload.

Rules:
- same parentDecisionReceiptId + same semanticFingerprint = idempotent;
- same parentDecisionReceiptId + different semanticFingerprint = PROVENANCE_CONFLICT;
- same scanDate/symbol with a new captureGeneration produces a different parentDecisionReceiptId and is a new generation, never an overwrite.

Do not include semanticFingerprint inside parentDecisionReceiptId; otherwise conflicting payloads can evade same-identity collision detection by receiving different IDs.

## TI-424 — Minimum parent fields

Identity / timing:
- parentDecisionReceiptId;
- parentSchemaVersion;
- scanDate;
- symbol;
- canonicalMarket;
- pool;
- captureGeneration;
- decisionCutoffAt;
- capturedAt;
- createdAt.

Production lineage:
- formalWorkerVersion;
- selectionRuleVersion;
- rankComparatorVersion;
- priorityScoreDefinitionVersion.

Source/admission lineage:
- historyAdmissionState;
- historyAdmissionReceiptId/hash;
- sourceQualityState;
- sourceSemanticFingerprint.

Actual Formal decision state:
- formalState;
- firstFailureReason;
- basePassed;
- rrPassed;
- formalOk;
- channel;
- signalLevel.

Qualified-row ranking state, when applicable:
- postConsensusPriorityScore;
- rewardPerRisk;
- rewardRisk;
- marketConsensusScore;
- marketConsensusSources;
- marketConsensusBonus;
- setupQuality;
- sectorFlow;
- relativeStrength;
- preSortOrdinal;
- observedPoolRank;
- poolQuota;
- selectedFlag;
- cutlineRelation.

Integrity:
- formalInputHash;
- formalResultHash;
- rankingTupleHash;
- semanticFingerprint.

## TI-425 — Actual Production comparator is frozen as provenance, not reimplemented

Current deployed comparator lineage from V7.5.30+ / V8.13 provenance:

1. post-consensus priorityScore;
2. raw rewardPerRisk;
3. marketConsensusScore;
4. setupQuality;
5. sectorFlow;
6. relativeStrength.

The parent stores:
- the comparator version label;
- the actual tuple values used for that qualified row;
- the observed pool rank;
- the pre-sort ordinal.

Research children never need to recreate the comparator to discover the original rank.

A future comparator version is a new lineage.
Do not apply today's comparator to old parents.

## TI-426 — Formal state vocabulary

Suggested parent formalState:

FIRST_FAILURE_BASE_FALSE
- first failure occurred before/within the early base-admission portion and basePassed=false.

FIRST_FAILURE_BASE_TRUE
- basePassed=true but a downstream Formal gate failed.

QUALIFIED_NOT_SELECTED
- result.ok=true but the row is below the final per-pool cutline.

SELECTED
- exact final Formal selection after the deployed 3+3 pool/quota logic.

DECISION_ERROR
- the row entered parent scope but actual decision evaluation could not be certified.

UNKNOWN
- lineage/provenance insufficient.

firstFailureReason remains the exact production first-failure label.
It is not marginal gate contribution.

## TI-427 — Do not recompute parent state in research children

Prohibited:
- re-run current scoreCandidate and overwrite formalState;
- infer old rank from current comparator;
- rebuild old post-consensus priority from today's source state;
- infer missing firstFailure from later gate-overlap results.

Allowed:
- research child may compare the frozen Formal state with its own independent observer state;
- later quality overlays may mark the parent unusable/contaminated;
- never rewrite the original decision fact.

## TI-428 — Why formalInputHash is still needed

The parent does not need to duplicate the entire feature-row payload.

But it needs a deterministic formalInputHash over the exact same-scan input object/state used by the Formal decision path.

Purpose:
- prove child computations received the intended generation;
- detect accidental reattachment to a different feature row;
- support replay/debug without copying large histories into every parent.

If future audit requires full raw input reconstruction:
that belongs to referenced source/history receipts, not the compact parent row.

## TI-429 — Qualified ranking tuple must be post-consensus

V8.13 research established that the stored/ranked priorityScore is after the market-consensus bonus.

Therefore:
postConsensusPriorityScore is the ranking field.

If a pre-consensus/base priority score is also retained for decomposition:
store it under an explicitly different name and never substitute it for the ranked value.

Current parent minimum does not require preConsensusPriorityScore because it is not needed to reproduce the observed ranking fact.

## TI-430 — Quota/cutline fields

For qualified rows preserve:
- pool = GENERAL or THOUSAND;
- poolQuota = 3 under current Formal rule;
- observedPoolRank;
- selectedFlag;
- cutlineRelation:
  ABOVE_OR_AT_CUTLINE |
  BELOW_CUTLINE |
  TIE_AMBIGUOUS |
  UNKNOWN.

Observed rank is a captured fact.
It must not be inferred later from bounded Shadow samples.

If the comparator has no explicit final tie-break:
preSortOrdinal must be preserved so the observed ordering is auditable.

## TI-431 — Parent is not a research membership row

The parent records Formal decision identity/state.

Research memberships are separate overlays.

One parent may later carry:
- INDEPENDENT_BROAD_MARKET_CONTROL;
- NEAR_MISS semantic membership;
- liquidity-reject research membership;
- sector-gate research membership;
- other overlapping research labels.

Those memberships never replace formalState.

## TI-432 — Child attachment rule

A child may attach only when:
- parentDecisionReceiptId exact match;
- captureGeneration exact match;
- parent semantic fingerprint is readable;
- child parent_scope_id includes this parent;
- child timing is causal relative to decisionCutoffAt.

If same scanDate/symbol points to another generation:
PROVENANCE_CONFLICT, never nearest-date reassociation.

## TI-433 — Same-scan compute order

Preferred future order:

1. load/normalize source data;
2. history admission;
3. build feature rows;
4. execute actual Formal decision path;
5. freeze immutable decision-state parents from actual in-memory outputs;
6. freeze Formal selected plans/journal;
7. execute research observers from the same parent keyset and same-scan inputs;
8. batch-write evidence children and run receipts;
9. any research failure is fail-open with respect to Formal behavior.

Do not:
- make Formal wait for research success;
- rerun Formal because a research child failed.

## TI-434 — Parent storage stays compact

Do not store in every parent:
- full 65-day OHLC;
- full corporate-action registry;
- full market/sector context history;
- child observer payloads.

Store compact decision facts + hashes/receipt references.

This reduces storage and prevents semantic duplication.

## TI-435 — Current readiness

PARENT_CONTRACT = DESIGN_FROZEN_V0_1
CURRENT_PRODUCTION_IMMUTABLE_PARENT = NOT_IMPLEMENTED
V8_13_SELECTED_RANK_PROVENANCE = MATERIAL_PARTIAL_BUILDING_BLOCK
PVE_156_COMPLETE_QUALIFIED_POOL_RECEIPT = DESIGNED_NOT_IMPLEMENTED
SHARED_GENERIC_CHILD = DESIGN_COMPATIBLE_V0_3

Class-B implementation remains premature until:
- parent scope size is measured prospectively;
- shared continuity runtime is ready;
- symbol-session/price-limit provenance is runtime-ready;
- storage/latency budget is measured.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze machine-readable parent contract.
2. Build an outcome-blind pure parent-receipt constructor prototype from synthetic same-scan Formal outputs only.
3. Test:
   - idempotency;
   - generation conflict;
   - selected/QNS/cutline states;
   - first-failure preservation;
   - comparator-version isolation;
   - no current-code recomputation.
4. Keep prototype zero market calls / zero D1 writes.
5. Do not implement Worker/D1 persistence.


## Identity correction note — TI-436

During executable-prototype preparation, the initial receipt-ID formula was falsified.

Rejected:
parentDecisionReceiptId = hash(identity + semanticFingerprint).

Reason:
a conflicting payload changes the semantic fingerprint and therefore changes the ID, weakening direct same-identity conflict detection.

Frozen correction:
- parentDecisionReceiptId = hash(identity tuple only);
- semanticFingerprint = hash(immutable decision payload);
- identical ID + identical fingerprint = idempotent;
- identical ID + different fingerprint = PROVENANCE_CONFLICT.

This correction occurred before any runtime persistence implementation.


## Prototype QA update — TI-437

A pure outcome-blind parent constructor now exists:
- research/immutable_decision_state_parent_v0_1.mjs
- research/test_immutable_decision_state_parent_v0_1.mjs

Validated properties:
- same identity + same decision payload => same parentDecisionReceiptId and same semanticFingerprint;
- operational capturedAt/createdAt retry timestamps do not alter semanticFingerprint;
- same parent ID + changed ranking payload => PROVENANCE_CONFLICT;
- new captureGeneration => different parent ID;
- new comparator version => different parent ID;
- Selected / QNS / base-fail / downstream-fail states preserve actual decision outputs;
- qualified rows fail closed if the ranking tuple is incomplete;
- selectedFlag with formalOk=false is rejected;
- nested ranking payload is deep-frozen in memory;
- prototype contains no market fetch, no D1 write and no scoreCandidate re-run.

Persistence implication:
the first stored capturedAt/createdAt for an exact parent ID/fingerprint is immutable.
A later exact duplicate is a no-op and must not UPDATE first-known timestamps.

The prototype's injected test hash is not a production hash decision.
Any Class-B persistence implementation must use a collision-resistant production fingerprint contract.
