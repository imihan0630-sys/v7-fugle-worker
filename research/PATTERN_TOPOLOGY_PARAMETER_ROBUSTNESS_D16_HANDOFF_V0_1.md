# D01 DL-037 — D16 Parameter-Family Robustness / Data-Snooping Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED / SDA_001_SDA_002_REMEDIATION

## 1. Purpose

D01 freezes:
- parameter-family registry semantics;
- exact alias / same-root variation / conflict states;
- robustness denominators;
- no-lookahead variant eligibility;
- one PRICE_OHLC effective evidence family by default.

D16 owns future familywise inference and residual testing.

## 2. Full family must be accounted

Never evaluate only the successful detector variants.

Report:
- total frozen variants;
- eligible variants;
- no-structure variants;
- data-blocked variants;
- post-hoc variants;
- exact aliases;
- same-root variations;
- identity conflicts.

The denominator is the preregistered family, subject only to explicit eligibility/data rules frozen before outcomes.

## 3. Canonical detector vs family

Preserve:
P0 CANONICAL_ONLY;
P1 FAMILY_DIAGNOSTIC;
P2 VARIANT_ENSEMBLE_RAW;
P3 VARIANT_ENSEMBLE_DEDUP.

P2 vs P3 exposes false confidence from correlated variant multiplicity.

## 4. Multiple-testing / data-snooping

The complete parameter family is one technical-rule search family.

D16 must account for:
- number of variants;
- variant dependence;
- repeated dates;
- any family revisions;
- holdout consumption.

No best-variant selection after outcomes.

## 5. Same information root

All price-only D01 variants remain:
informationRoot = PRICE_OHLC;
representationFamily = D01_PRICE_GEOMETRY;
redundancyGroup = D01_PRICE_GEOMETRY_PARAMETER_FAMILY.

Default effectiveIndependentEvidenceCount = 1.

A high sameRootSupportRate is detector robustness, not independent evidence.

## 6. No-lookahead

Each variant independently needs:
- firstObservableAt;
- confirmedAt;
- latestAnchorAt;
- predictorFreezeAt;
- futureBarRequired=false;
- replaySafe=true.

A consensus cannot launder a future-looking variant.

## 7. Residual question

A robustness descriptor itself may be another transform of the same PRICE_OHLC geometry.

Future D16 must test whether:
- emissionRate;
- sameRootSupportRate;
- conflictRate;
- noStructureRate

add residual information beyond the canonical root state.

Until then:
residualIncrementalityStatus = NOT_VALIDATED.

## 8. Audit boundary

SDA-001 remains REMEDIATION_IN_PROGRESS.
SDA-002 remains REMEDIATION_IN_PROGRESS.

This handoff does not close them.

Closure still requires system guards, executed deterministic tests where routed, D16 evidence and independent 00 readback.

## 9. Promotion boundary

No robustness statistic changes Formal eligibility, ranking, Top6, weights, capital or runtime.

Formal Core remains LOCKED.
