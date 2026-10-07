# D01 DL-092 — Exact-Window R1-R7 Positive-Control Bundle Audit V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / INTERFACE_COMPOSABILITY_AUDIT / FORMAL_CORE_LOCKED

## Purpose

Search current repository evidence for at least one real TWSE symbol/window whose R1-R7 predictor/context receipts can all be physically satisfied under the DL-091 interface without opening any future return.

This is an interface-composability test only.
It is not a pattern-performance test and does not inspect forward outcomes.

## Candidate selection

Use existing real mechanics witnesses because they already have unusually rich point-in-time continuity evidence:
- 8422, target 2025-11-17, par-value change / unit conversion;
- 3593, target 2025-12-22, loss-reduction / unit conversion;
- 8103, target 2025-12-08, cash-refund reduction / unit conversion.

These candidates are not selected by future returns.

## Evidence already present

For 8422 / 3593 / 8103, the existing corporate-action feature-window manifest reports:
- pointInTimeReady = true;
- technicalPriceReady = true;
- technicalVolumeReady = true;
- eligibleForMechanicsDelta = true;
- eligibleForOutcomeInference = false;
- eventCoverageComplete = UNKNOWN.

The corporate-action registry has explicit event versions and effective dates, but the convenience-selected registry is not a complete market-wide event denominator.

This is enough to prove mechanics and continuity examples.
It is not enough to certify R4 CLEAR_NO_ACTION/complete-event coverage for inference.

## R1 — Point-in-time membership

Current System2 historical-universe infrastructure can provide date-effective TWSE membership for accepted historical years.

However, the three strongest corporate-action candidates are in 2025, while the canonical annual A1 market-year coverage matrix currently leaves 2025 TWSE PENDING.

Therefore this audit does not claim one exact R1+R2 annual-history bundle for those 2025 witnesses from the canonical accepted annual lane.

State:
R1 = PLAUSIBLE_SOURCE_EXISTS / EXACT_BUNDLE_NOT_CERTIFIED.

## R2 — Raw A1 observation

The mechanics artifacts contain real raw-market bars/price inputs sufficient for continuity tests.

But DL-091 R2 requires the exact canonical raw A1 sourceRowHash/canonicalBarHash/availability lineage for the same selected window.

The current convenience mechanics artifact is not itself the canonical R2 receipt.

State:
R2 = PRICE_WITNESS_EXISTS / DL091_CANONICAL_RECEIPT_NOT_BOUND.

## R3 — Symbol-session lifecycle

Corporate-action research contains verified suspension/resumption mechanics for some witnesses and has a symbol-session contract.

But eventCoverageComplete remains UNKNOWN in the feature-window manifest, and the current all-history symbol-session lifecycle completeness is not certified.

State:
R3 = POSITIVE_EVENT_MECHANICS_EXIST / WINDOW_COMPLETENESS_NOT_CERTIFIED.

## R4 — Corporate-action continuity

For all three candidates:
- point-in-time mechanics are usable;
- technical price/volume continuity is demonstrable;
- inferenceReady = false;
- eventCoverageComplete = UNKNOWN.

Because R4 requires exact-window complete event coverage, a positive known event does not prove no other relevant event is missing.

State:
R4 = VERIFIED_MECHANICS / INFERENCE_COMPLETENESS_BLOCKED.

## R5 — Price-limit / reference-price state

Repository search confirms specifications and official source feasibility for legal reference/limit price states.

No artifact was found that binds a DL-091-complete R5 receipt to the exact 8422, 3593, or 8103 target window with:
- ruleVersion;
- referencePrice;
- upperLimitPrice;
- lowerLimitPrice;
- specialReferenceState;
- firstObservableAt;
- source hash.

State:
R5 = SOURCE_FEASIBLE / EXACT_WINDOW_RECEIPT_NOT_FOUND.

Absence of a found R5 receipt is not evidence that the session had unknown legal limits in reality; it is evidence that the required repository receipt is not currently composable.

## R6 — Disposition / matching-regime state

Repository search found the D01 disposition periodic-matching specification requiring:
- dispositionEventId;
- matchingCadenceSeconds;
- changedTradingMethodFlag;
- prepayment/margin state;
- complete source coverage.

No repository artifact was found using the DL-091 acceptance state CERTIFIED_NORMAL_MATCHING for the exact candidates.
No exact verified disposition receipt was found either.

State:
R6 = MECHANISM_CONTRACT_EXISTS / EXACT_WINDOW NORMAL_OR_DISPOSITION_RECEIPT_NOT_FOUND.

Source non-match cannot certify ordinary continuous matching.

## R7 — Pattern observability

D01 owns R7 and has deterministic replay-safe feature contracts for the first-wave pattern families.

R7 can be generated after R1-R6 are bound to the exact source window.

State:
R7 = CONTRACT_READY / UPSTREAM_BUNDLE_BLOCKED.

## Bundle result

No candidate currently satisfies a physically certified exact-window R1-R7 bundle under DL-091.

Strongest candidates:
- 8422: known corporate-action mechanics but event coverage incomplete; R5/R6 exact receipts missing.
- 3593: same core blockers.
- 8103: same core blockers.

Therefore:

R1_R7_POSITIVE_CONTROL_FOUND = FALSE.
INTERFACE_COMPOSABILITY = PARTIAL.
OUTCOME_JOIN = CLOSED.
OOS_EXECUTION_READY = FALSE.
NO_L4_PROMOTION = TRUE.

## Falsification value

This negative result is useful.

It falsifies the tempting shortcut:
"because technical continuity has a real mechanics witness, the historical pattern window is inference-ready."

It is not.

The missing evidence is not mostly another pattern formula.
The remaining gap is exact-window provenance/completeness across independently owned context families.

## Smallest next unlock

Do not seek a more complicated pattern.

The shortest truthful path is:
1. select one accepted TWSE historical market-year/window;
2. bind canonical R1 membership and R2 raw A1;
3. obtain physical exact-window R3 lifecycle completeness;
4. obtain R4 certified complete action/clear state;
5. materialize R5 legal reference/limit receipt;
6. materialize R6 disposition normal/disposition receipt with complete source scope;
7. only then generate R7 and declare PREDICTOR_CONTEXT_READY.

No return is needed for this unlock.

## Current decision

POSITIVE_MECHANICS_WITNESS_EQUALS_INFERENCE_READY = FALSE.
KNOWN_CORPORATE_ACTION_EQUALS_COMPLETE_EVENT_COVERAGE = FALSE.
MISSING_DISPOSITION_MATCH_EQUALS_NORMAL_MATCHING = FALSE.
MISSING_PRICE_LIMIT_RECEIPT_EQUALS_ORDINARY_LIMIT_STATE = FALSE.
R1_R7_POSITIVE_CONTROL = NOT_YET_AVAILABLE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. DL-093: define one exact-window pre-outcome witness request for data owners using an already accepted TWSE historical year, preferably a simple no-action ordinary session.
2. Freeze symbol/date/window only after verifying it was not selected by future outcome.
3. Ask only for R1-R6 physical provenance; D01 generates R7.
4. Do not require the witness to contain a successful pattern.
5. Once one R1-R7 bundle passes, hand interface-composability PASS to D16; this still does not promote any module to L4.
