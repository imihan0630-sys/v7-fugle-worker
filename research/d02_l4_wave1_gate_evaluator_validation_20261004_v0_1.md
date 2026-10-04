# D02 L4 Wave-1 Gate Evaluator Validation V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / EXECUTABLE_GATE_PASS
Evidence cursor: PVE-239
Formal Core: LOCKED
D02 maturity impact: NONE

## Artifacts

- research/d02_l4_wave1_gate_evaluator_v0_1.mjs
- tests/test_d02_l4_wave1_gate_evaluator_v0_1.mjs

Independent local runtime:
- Node.js v22.16.0
- 23/23 tests PASS

## What the evaluator does

It converts the frozen Wave-1 preregistration into a machine-enforceable evidence-admission gate for:
- H001 / D02-02;
- H20 / D02-03;
- H003 / D02-06.

It does not inspect predictive return values and does not authorize a maturity promotion.

## Frozen floor separation

DESCRIPTIVE_ONLY:
- >=20 distinct CLEAN scanDate values;
- pre-outcome integrity/common-support gates pass;
- this is not L4 evidence maturity.

L4_EVIDENCE_ELIGIBLE:
- >=30 distinct CLEAN scanDate values;
- >=100 completed eligible events;
- exact common support;
- DATA_QA_PASS;
- clean cohort provenance;
- generation alignment;
- Formal isolation pass;
- source continuity pass;
- future-only outcome clock.

Even when L4_EVIDENCE_ELIGIBLE is true:
maturityPromotionAuthorized remains false.

L4 promotion review additionally requires external evidence receipts:
- actual Prospective Shadow or genuine OOS evidence;
- D16 dependence-aware method pass;
- negative controls;
- redundancy checks;
- concentration pass.

## Test matrix

1. 19 clean dates -> OUTCOME_ACCESS_CLOSED.
2. 20 clean dates -> DESCRIPTIVE_ONLY.
3. 29 clean dates with >=100 events -> DESCRIPTIVE_ONLY.
4. 30 clean dates with 99 events -> DESCRIPTIVE_ONLY.
5. 30 clean dates with 100 events -> L4_EVIDENCE_ELIGIBLE, but no maturity authorization.
6. missing common support reduces eligible-date count and can keep access closed.
7. Gate 0-6 failure blocks the row.
8. Formal isolation failure blocks the row.
9. generation mismatch blocks the row.
10. H001 slot before 10:15 blocks the row.
11. H20 primitive event identity mismatch blocks the row.
12. H003 outcomeStartAt <= feature bar/first-known time blocks the outcome.
13. censored/UNKNOWN outcome never counts as completed.
14. duplicate event ID on the same date is fatal integrity.
15. duplicate event ID across dates is fatal integrity.
16. multiple symbols on one scanDate count as one independent date.
17. H20 event-key date mismatch blocks the row.
18. H003 PRE_EVENT_ONLY_EXPIRY is QA-only and cannot mature.
19. explicit promotion-review prerequisites can be recognized, but maturityPromotionAuthorized remains false.
20. H001 can reach its own evidence floor without making H20/H003 eligible.
21. 99 H20 events + 1 H001 event does not become 100 H20 events.
22. all-wave eligibility requires H001, H20 and H003 to each independently satisfy their own floor.
23. promotion-review receipts are hypothesis-specific; one hypothesis cannot lend review evidence to another.

## Research consequence

The main pre-PVE blocker is no longer ambiguity about how Wave-1 evidence admission will be counted.

Remaining blocker is real data:
- current clean prospective date count = 0;
- PVE-240 has not occurred;
- Gate 7 remains CLOSED.

Therefore D02 remains 60.0%.

No synthetic fixture, unit test or preregistration may be reclassified as Prospective Shadow evidence.


## Corrected governance defect — cross-hypothesis sample borrowing

The first evaluator revision aggregated eligible events and clean dates across H001, H20 and H003.
That could incorrectly make the Wave-1 program look L4-evidence-eligible when only one hypothesis had mature evidence.

This violates the module-specific L4 promotion rule.

Revision V0.1.1 therefore:
- computes dates/events separately for H001, H20 and H003;
- exposes byHypothesis receipts;
- sets crossHypothesisSampleBorrowingAllowed=false;
- makes promotionReviewEligible hypothesis-specific;
- reserves allWave1L4EvidenceEligible for the case where all three hypotheses independently satisfy the floor.

The defect was found and corrected before any genuine prospective outcome evidence existed.
No maturity, Formal or hypothesis status changed.
