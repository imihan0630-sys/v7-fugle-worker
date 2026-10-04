# D02 → D16 L4 Validation Receipt Guard Validation V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / EXECUTABLE_D16_CONSUMER_GUARD_PASS
Evidence cursor: PVE-239
Formal Core: LOCKED
D02 maturity impact: NONE

## Artifacts

- research/D02_D16_L4_VALIDATION_HANDOFF_V0_1.md
- research/d02_d16_l4_validation_receipt_guard_v0_1.mjs
- tests/test_d02_d16_l4_validation_receipt_guard_v0_1.mjs

Independent local runtime:
- Node.js v22.16.0
- 24/24 tests PASS

## Main finding

D02 must not invent a universal fixed-N sample-adequacy rule for its remaining L4 work.

D16 canonical research explicitly states:
- stock-row N cannot substitute for independent dates/episodes;
- rules such as 100/200 events are descriptive unless tied to the actual estimand;
- adequacy depends on event balance, predicted/feature support, independent dates, relevant episodes, serial/cross-sectional dependence and desired precision;
- a preregistered MDE / precision target should determine whether uncertainty is decision-informative.

Therefore the D02 consumer guard accepts only a D16-owned validation receipt for sample adequacy.

## Evidence-key isolation

Frozen evidence keys cover all D02 next-level families:
- F0 semantic governance;
- F1 participation normalization / breakout / dry-up;
- F2 participation-response representation;
- F3 signed-volume / divergence;
- F4 provider pressure;
- F5 interaction / liquidity / profile.

The guard forbids:
- cross-module receipt reuse;
- cross-family sample borrowing;
- using D02-09 pivot evidence as participation-trajectory evidence;
- using D02-12 price-profile evidence as time-curve evidence;
- importing one hypothesis's adequate sample into another.

## Required D16-owned fields

The guard requires:
- D16 owner identity;
- exact evidence key;
- exact admission / experiment / outcome versions;
- common-support count;
- independent scan-date count;
- independent symbol count;
- date-dependence method;
- small-cluster treatment;
- overlapping-outcome control and purge result;
- coverage/missingness summary;
- preregistered MDE / precision / semantic-materiality target;
- sample-adequacy status;
- effective-sample report when ADEQUATE;
- multiple-testing and concentration reviews;
- cost/liquidity review for positive economic candidates.

The exact inferential method remains D16-owned.
D02 does not force cluster-robust, HAC or block-bootstrap merely to obtain a favorable result.

## Positive candidate is still not automatic L4

Even a fully valid D16 receipt can only set:
promotionReviewEligible=true.

The executable guard permanently returns:
maturityPromotionAuthorized=false;
formalCoreChangeAuthorized=false.

The final D02 L4 maturity decision remains a module-specific research readback after real prospective/OOS evidence exists.

## Test coverage

24/24 PASS covers:
- valid H001 D16 receipt;
- non-D16 owner rejection;
- evidence-key mismatch;
- H20 independent key acceptance;
- multiple-testing-family mismatch;
- experiment-version mismatch;
- missing effect/precision target;
- post-outcome target freeze rejection;
- missing independent dates;
- missing date-dependence method;
- missing overlap control;
- INSUFFICIENT sample status staying non-promotable;
- missing effective-sample report;
- failed multiple-testing review;
- failed concentration review;
- failed cost/liquidity review;
- semantic-governance positive candidate path;
- semantic/economic positive-status separation;
- D02-09 typed-family isolation;
- D02-12 typed-family isolation;
- NO_INCREMENTAL_VALUE terminal negative path;
- duplicate receipt ID fatal integrity;
- cross-evidence-key receipt reuse fatal integrity;
- permanent no cross-module borrowing / no automatic maturity / no Formal change.

## Current consequence

D02 now has:
1. executable evidence admission for all 12 modules;
2. a D16 consumer guard for promotion-grade statistical receipts;
3. an explicit owner boundary preventing D02 from self-certifying sample adequacy.

This is governance/readiness progress only.

D02 remains 60.0%.
Clean prospective date count remains 0.
PVE-240 remains next.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
