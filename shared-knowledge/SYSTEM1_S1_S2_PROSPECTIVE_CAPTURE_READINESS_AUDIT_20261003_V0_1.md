# System1 S1-S2 Prospective Capture Readiness Audit 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: READINESS_AUDIT_COMPLETE / CLASS_A_NEXT_STEP_IDENTIFIED / CLASS_B_NOT_YET_AUTHORIZED
Formal Core impact: NONE

## Authority re-read

Latest main at audit start:
`c4aaa5a39521462eddde22eaae3f5966ed7aefa5`

Current Formal Worker SHA:
`24fd61d7b8dfd5610c40cc67a2b6807dd622bd73`

Parent governance:
- `shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`
- `shared-knowledge/SYSTEM1_P1A_MINIMAL_BLOCKING_AND_OUTCOME_CONTRACT_20261003_V0_1.md`
- `shared-knowledge/SYSTEM1_TARGET_AVAILABLE_FOUR_STATE_FALSIFICATION_CONTRACT_20261003_V0_1.md`
- `shared-knowledge/SYSTEM1_S1_S2_SHADOW_EXECUTION_REGISTRY_20261003_V0_1.md`

## Executive result

Implementation readiness and evidence readiness are not the same.

### S1 — semantic repair
**READY / IMPLEMENTED / CI GREEN**

C5 V0.2 can already compute observation-aware roles and blocking sets from a verified C1/C2 generation.

### S2 — strict P1-A deployable reach
**IMPLEMENTED BUT CURRENT PROSPECTIVE EVIDENCE BLOCKED BY SAFETY RECEIPTS**

Current C1 V0.1 deliberately persists:
- SOURCE_AUTHENTICITY = PASS;
- SESSION_CONTINUITY = PASS only when history admission is proven;
- CORPORATE_ACTION_CONTINUITY = UNKNOWN;
- EXECUTION_FEASIBILITY = UNKNOWN;
- ACCOUNT_RISK = UNKNOWN.

Therefore a strict C5 interpretation that requires all HARD safety states known can classify much of the real population as `HARD_BLOCKED`.

This is correct for deployability.
It is not sufficient for diagnosing whether P1-A data-presence gates suppress an otherwise valid stock-selection thesis.

### S2 conditional research upper bound
**FEASIBLE AS CLASS A / NOT YET IMPLEMENTED AS FULL FUNNEL**

C2 already computes:
- `short.withoutSafetyGateStatus`;
- `missingSafety[]`;
- `formalRejectedButConditionalShortGatesPassN`.

Therefore the architecture already distinguishes:
"non-safety gates appear clear, but required safety evidence remains UNKNOWN."

The next low-risk step is not Class B.
It is a Class-A **Conditional P1-A Reach Funnel** that:
- never changes safety UNKNOWN to PASS;
- never creates a candidate;
- reports how far a row could progress **conditional on unresolved safety later proving PASS**;
- keeps verified safety FAIL as a hard stop.

If the conditional F9 upper bound is negligible, expensive safety-capture work is not justified for the P1-A hypothesis.

If it is material, then targeted safety-receipt capture can be evaluated.

### S2B — target four-state semantics
**CLASSIFIER READY / REAL PROSPECTIVE FOUR-STATE EVIDENCE CAPTURE BLOCKED**

The new side-channel can classify:
- TARGET_FOUND;
- TARGET_NONE_SEARCH_COMPLETE;
- TARGET_UNKNOWN_SOURCE;
- TARGET_UNKNOWN_GEOMETRY.

But current C1 runtime persists only:
- targetState;
- target;
- rewardPerRisk;
- setupQuality;
- entryGeometry.

It does **not** persist:
- targetSearchComplete;
- targetSearchAlgorithmVersion;
- targetSearchLookbackStart / End;
- target source receipt IDs;
- target provenance/source-verified state;
- target geometry quality/verified state;
- targetKnownAt.

So the classifier is intentionally conservative:
real rows without these receipts remain UNKNOWN_SOURCE or UNKNOWN_GEOMETRY.

Legacy `NONE` cannot be promoted retrospectively to `TARGET_NONE_SEARCH_COMPLETE`.

## S1 / P1-A field readiness matrix

| Evidence | Current C1 capture | Research use now | Status |
|---|---|---|---|
| marketReturn20 / sectorReturn20 | yes | RS_CONTEXT presence | READY |
| chipConcentration | yes | P1-A presence | READY |
| financialBasis | yes | source completeness | READY |
| valuationObserved | yes | source completeness | READY |
| announcementsVerified / titles | yes | source completeness / event observer | READY |
| fundamentalCount | yes, derived | component-count P1-A | READY |
| marketCapYi | yes | missing vs threshold split | READY |
| A/B setup state | yes, derived | downstream reach | READY |
| targetState / target / RR | yes, derived | legacy reach | READY |
| setupQuality | yes | grade reach | READY |
| C1 immutable generation / PIT clock | yes | parent identity | READY |
| C2 full matched denominator | yes | matched comparison | READY |
| CA continuity receipt | UNKNOWN by design | deployable strict reach | CAPTURE GAP |
| execution feasibility receipt | UNKNOWN by design | deployable strict reach | CAPTURE GAP |
| account-risk receipt | UNKNOWN / out of scope | deployable strict reach | CAPTURE GAP |

## Target four-state field readiness

| Evidence | Same-scan availability | Current C1 persistence | Status |
|---|---|---|---|
| channel | computed | yes | READY |
| entry / stop | computed | entryGeometry yes | READY |
| selected target | computed | yes | READY |
| RR | computed | yes | READY |
| priorHigh20 / priorHigh60 | available in same-scan feature state | no | CAPTURE GAP |
| dated local-pivot candidates | derivable from retained history in same scan | no | CAPTURE GAP |
| targetPrice raw | may exist in feature/enrichment | not guaranteed in C1 | CAPTURE GAP |
| targetPrice source/asOf/capturedAt/PIT eligibility | producer contract unproven | no | SOURCE CONTRACT GAP |
| searchComplete | can be explicitly generated by research instrumentation | no | CAPTURE GAP |
| search algorithm version | known in code lineage but not row receipt | no | CAPTURE GAP |
| search lookback range | derivable at runtime | no | CAPTURE GAP |
| source receipt IDs | not frozen | no | CAPTURE GAP |
| geometry verified state | can be generated by research observer | no | CAPTURE GAP |

## Important source limitation

Existing repository audit found:
- no official repository producer for `targetPrice`;
- `targetPrice` may arrive through generic custom enrichment;
- durable Production evidence does not prove whether the custom source is configured, successful, or PIT-provenanced;
- a source failure can look like field absence.

Therefore:
**targetPrice=null cannot be interpreted as a geometry fact unless custom-source state is known.**

S2B must preserve this UNKNOWN.

## Current Class boundary

### Class A — safe now
- compute C5 blocking sets from existing verified C1/C2;
- compute conditional non-safety upper bounds;
- add a conditional P1-A reach funnel to research-only diagnostics;
- analyze source/capture coverage offline;
- write deterministic tests;
- no persistence/runtime authority change.

### Class B — proposal first
- add new shared C1 fields;
- wire target source/search/provenance fields into Worker C1 receipts;
- persist new safety receipt states;
- add shared target child receipts or new D1 evidence;
- change shared source/enrichment observability;
- change scheduled capture or production research persistence.

### Class C — owner approval
- change any gate;
- change target/null semantics in Formal;
- change RR threshold or formula;
- change A/B;
- change ranking/quota/capital/signal/push/order behavior.

## Recommendation

Do **not** implement Class B safety capture yet solely for P1-A.

First implement the Class-A Conditional P1-A Reach Funnel.

Decision logic:
- if conditional P1-A F9 is immaterial -> classify P1-A funnel as likely non-material and avoid unnecessary Class-B work;
- if conditional P1-A F9 is material -> quantify which safety receipt is actually needed for promotion-grade evidence, then request the smallest Class-B capture change;
- target four-state persistence remains an independent S2B Class-B candidate because it cannot be answered from current durable C1 fields.

## Readiness states

- S1 semantic resolver: `READY_IMPLEMENTED`
- S2 strict deployable P1-A reach: `SAFETY_CAPTURE_BLOCKED`
- S2 conditional thesis reach: `CLASS_A_IMPLEMENTATION_READY`
- S2 economic conclusion: `PROSPECTIVE_OUTCOME_PENDING`
- S2B classifier: `READY_IMPLEMENTED`
- S2B genuine NONE_SEARCH_COMPLETE evidence: `TARGET_PROVENANCE_CAPTURE_BLOCKED`
- P1-B: `BLOCKED_UNTIL_P1A_ECONOMIC_CLASSIFICATION`

Formal Core remains LOCKED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
