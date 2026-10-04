# D03 ADX First-Parent Acceptance V0.1

Updated: 2026-10-04 Asia/Taipei  
Lane: D03-09｜ADX 平均趨向指標  
Status: RESEARCH_ONLY / OUTCOME_BLIND / FIRST_GENUINE_PARENT_PENDING  
Formal Core: LOCKED

## Purpose

Close the ADX L3 acceptance-logic design gap before the first genuine post-V8.17 Taiwan parent arrives.

The evaluator does not create a new parent universe and does not authorize outcome inference.

## TI-611 — shared parent identity only

The evaluator consumes the deployed shared Shadow parent identity:

- scanDate;
- captureGeneration;
- symbol;
- parentSnapshotHash;
- parent knownAt.

D03 does not create a second parent population.

## TI-612 — FULL_REPLAY is the only accepted v0.1 state-construction path

ADX14 is a cascaded recursive state:

TR/+DM/-DM Wilder smoothing -> +DI/-DI -> DX -> ADX Wilder smoothing.

Therefore v0.1 accepts only:

`stateConstructionMode = FULL_REPLAY`

with:

- formulaVersion = `WILDER_ADX14_TALIB_STYLE_NO_ROUNDING_V0_1`;
- stateConstructionVersion = `ADX14_FULL_REPLAY_ACCEPTANCE_V0_1`;
- stateLineageId;
- sourceHistoryHash;
- continuityTransformHash;
- initializationAnchorDate;
- replayCertificationState = `REPLAY_EXACT`.

`TRUSTED_PRIOR_STATE` remains a theoretically allowed future architecture but is blocked in v0.1 until a separate trusted-state certifier exists.

`LOCAL_WINDOW_BOOTSTRAP` is never promotion-grade ADX evidence.

## TI-613 — replay window and source gates are executable

A promotion-grade attempt requires:

- status VALID or VALID_BUT_CONSTRAINED;
- TECHNICAL_CONTINUITY price space;
- continuity receipt captured no later than parent knownAt;
- >=29 exact eligible symbol sessions so first ADX exists and one-bar prefix invariance can be checked;
- exact expected-date/bar-date set equality;
- no duplicate/missing eligible sessions;
- valid H/L/C geometry;
- symbolSessionVerified=true;
- technicalContinuity=true;
- corporateActionContinuityResolved=true;
- each sourceFetchedAt <= parent knownAt;
- zero unresolved missing sessions/events.

The 29-bar floor is an acceptance-QA floor, not a universal warm-up sufficiency claim.

## TI-614 — canonical replay and prefix invariance

The evaluator imports the already-frozen `computeADX` implementation from `research/technical_indicator_core_v0_1.mjs`.

It does not duplicate the formula.

The full replay produces canonical:

- TR14 smoothed;
- +DM14 smoothed;
- -DM14 smoothed;
- +DI14;
- -DI14;
- DI spread;
- DX14;
- ADX14.

It also replays the same lineage ending one eligible session earlier.

The penultimate state inside the full replay must equal the final state of that shorter replay within 1e-12 for all recursive state fields.

Mismatch => DATA_BLOCKED / PREFIX_REPLAY_MISMATCH.

## TI-615 — state hash and lineage binding

The acceptance row persists:

- replayInputHash;
- canonicalStateHash;
- sourceHistoryHash;
- continuityTransformHash;
- stateLineageId;
- initializationAnchorDate;
- continuityReceiptId.

If an upstream receipt supplies an expected canonical-state hash, mismatch fails closed.

A numeric ADX value without lineage hashes is not L3 evidence.

## TI-616 — constrained sessions remain visible, not ordinary

If the continuity receipt or any replay bar is price-limit constrained:

- attempt status = VALID_BUT_CONSTRAINED;
- l3EvidenceEligible = true for source/PIT feasibility;
- ordinaryInterpretationEligible = false.

This allows data-feasibility evidence without silently treating constrained price discovery as ordinary trend-strength behavior.

## TI-617 — exact parent attempt reconciliation

Like Bollinger, the ADX run is COMPLETE only when every expected parent has exactly one persisted attempt.

Explicit UNKNOWN counts as an attempt.

Missing, duplicate or orphan attempts make the run INCOMPLETE.

This prevents promotion from a success-only subset.

## TI-618 — deterministic acceptance logic physically testable now, maturity still genuine-parent gated

The deterministic suite covers:

- clean 80-session FULL_REPLAY => VALID;
- constrained replay => VALID_BUT_CONSTRAINED;
- <29 sessions => DATA_BLOCKED;
- LOCAL_WINDOW_BOOTSTRAP => DATA_BLOCKED;
- TRUSTED_PRIOR_STATE without separate certifier => DATA_BLOCKED;
- capture after parent => DATA_BLOCKED;
- missing session => DATA_BLOCKED;
- unresolved corporate-action event => DATA_BLOCKED;
- expected canonical state-hash mismatch => DATA_BLOCKED;
- explicit UNKNOWN plus VALID can still reconcile a COMPLETE expected-parent run;
- missing/duplicate attempts => INCOMPLETE.

Passing this suite closes the ADX acceptance-logic design gap.

It does NOT provide:
- the first genuine post-V8.17 Taiwan parent;
- a parent-cutoff-safe real continuity receipt;
- a real FULL_REPLAY lineage;
- ADX predictive value.

Therefore D03-09 remains L2/40 until genuine parent evidence passes this exact contract.

## Current status

`ADX_L3_ACCEPTANCE_LOGIC = READY_FOR_PHYSICAL_TEST`

`ADX_STATE_CONSTRUCTION_V0_1 = FULL_REPLAY_ONLY`

`TRUSTED_PRIOR_STATE = FUTURE_SEPARATE_CERTIFIER_REQUIRED`

`FIRST_GENUINE_V8_17_PARENT = PENDING`

`D03_09_ADX = L2_REMAINS`

`D03_MATURITY = 56.7_PERCENT`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

## Exact next continuation

1. Physically execute the read-only deterministic ADX acceptance workflow.
2. Keep maturity unchanged on synthetic/fixture PASS alone.
3. First genuine Taiwan session after V8.17: read exact shared parent generation/keyset.
4. Bind parent-cutoff-safe TECHNICAL_CONTINUITY H/L/C replay receipts to every expected parent.
5. Execute FULL_REPLAY acceptance for every parent and persist VALID/VALID_BUT_CONSTRAINED/DATA_BLOCKED/UNKNOWN.
6. Only COMPLETE parent reconciliation may support D03-09 L3 review.
7. Bollinger remains first promotion target; ADX follows only when its recursive replay passes.
