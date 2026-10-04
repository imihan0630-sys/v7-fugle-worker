# D02 L4 Wave-2 Evidence Admission Validation V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / EXECUTABLE_ADMISSION_PASS
Evidence cursor: PVE-239
Formal Core: LOCKED
D02 maturity impact: NONE

## Scope

Wave-2 covers:
- D02-04 volume dry-up;
- D02-05 extreme/climax participation;
- D02-07 signed-volume / OBV-family comparator;
- D02-08 provider trade-pressure proxy;
- D02-09 typed price-volume divergence;
- D02-10 volume-state x trend interaction;
- D02-11 liquidity volume threshold/exception counterfactual lane;
- D02-12 intraday time-curve / price-by-volume profile.

## Artifacts

- research/d02_l4_wave2_admission_evaluator_v0_1.mjs
- tests/test_d02_l4_wave2_admission_evaluator_v0_1.mjs

Independent local runtime:
- Node.js v22.16.0
- 32/32 tests PASS

## Important boundary

This evaluator answers only:
"Is this observation structurally admissible as future L4 evidence?"

It does NOT answer:
- whether sample size is sufficient;
- whether the effect is positive;
- whether a module is L4;
- whether Formal may change.

Therefore:
maturityPromotionAuthorized=false;
l4SampleAdequacyAuthorized=false;
formalCoreChangeAuthorized=false.

## Module-specific admission boundaries

D02-04:
- frozen LOW_PARTICIPATION_CANDIDATE only;
- price consolidation, volatility contraction and liquidity controls must already be known;
- later demand re-expansion cannot leak backward into the feature label.

D02-05:
- EXTREME participation only;
- response + volatility + event + liquidity contexts must be known;
- distribution/absorption/smart-money motive labels are forbidden.

D02-07:
- signedVolumeBalance20 only after daily-volume continuity pass;
- direct price, direct volume and response/persistence controls required;
- raw OBV cannot receive an independent duplicate vote;
- unfrozen OBV slope is excluded.

D02-08:
- providerTradePressureProxy and classificationCoverage must be valid;
- unclassified volume remains explicit;
- spread/depth/liquidity controls must be PIT-valid;
- true OFI / dynamic absorption / participant intent flags must remain false.

D02-09:
- only PIVOT_SIGNED_VOLUME or PARTICIPATION_TRAJECTORY;
- generic divergence boolean, visual pivot selection, all-pair scan and best-window search are forbidden;
- pivot family requires repaint-safe confirmation clock plus price/volume continuity.

D02-10:
- D03 owns the trend parent;
- direct trend + direct participation + explicit interaction must be present on identical support;
- interaction firstKnownAt cannot precede any consumed parent;
- 09:00 cumulative-pace interaction is blocked as structural redundancy;
- no triple vote.

D02-11:
- threshold optimization is not the research question;
- cohort role and rejection reason must be explicit;
- reason stratification, execution-cost evidence, spread/depth evidence and frozen threshold version required;
- threshold sweep forbidden;
- dataset does not become source-admission-ready until both admitted and reason-stratified rejected-control lanes exist.

D02-12:
- TIME_OF_DAY_VOLUME_CURVE is bounded to current 09:00~13:00 observable window;
- full-session completeness claim is forbidden;
- PRICE_BY_VOLUME_PROFILE must be prospectively captured;
- historical backfill is forbidden;
- closing-auction completeness cannot be claimed without proven coverage.

## Test coverage

The 32-test execution includes:
- valid rows for all eight modules and both D02-09 / D02-12 families;
- feature-known-after-cutoff rejection;
- dry-up hindsight leak;
- forbidden climax/distribution motive;
- raw-OBV double counting;
- true-OFI overclaim;
- invalid classification coverage;
- late pivot confirmation;
- generic divergence boolean;
- too-early trend-volume interaction clock;
- 09:00 cumulative-pacing redundancy;
- liquidity threshold sweep;
- time-curve outside 13:00;
- historical price-profile backfill;
- unsupported closing-auction completeness;
- censored outcome;
- non-future outcome;
- duplicate event IDs;
- D02-11 rejected-control incompleteness;
- D02-11 counterfactual-lane readiness when both roles exist;
- preservation of both typed D02-09 and D02-12 families;
- permanent no-maturity / no-sample-adequacy / no-Formal authorization.

## Current conclusion

Wave-2 structural admission design is executable.
Real prospective/OOS evidence remains absent.

D02 remains 60.0%.
Clean prospective date count remains 0.
PVE-240 remains the next formal evidence hinge.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
