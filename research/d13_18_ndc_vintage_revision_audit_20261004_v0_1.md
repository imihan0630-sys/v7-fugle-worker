# D13-18 NDC vintage revision audit

Status: SOURCE_ONLY_VINTAGE_EVIDENCE / REVISION_CONFIRMED / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED

Official release comparison:
- July 2026 release, published 2026-08-27: July trend-adjusted leading index 104.63, stated +0.72%; coincident 106.80; lagging 104.79; monitoring score 41.
- August 2026 release, published 2026-09-29: August trend-adjusted leading index 104.41, stated +0.51% and thirteenth consecutive monthly rise; coincident 106.47; lagging 105.71; monitoring score 41.

Revision falsification:
The original July value 104.63 cannot be the immutable parent of an August value 104.41 that is simultaneously reported as +0.51%. A +0.51% move ending at 104.41 implies an approximately 103.88 comparison level. This is direct source evidence that the later release uses a revised historical comparison state. The implied 103.88 is diagnostic arithmetic only, not an authorized replacement observation.

Frozen rules:
- referenceMonth and publishedAt are separate.
- release vintages are append-only objects.
- current revised history cannot replace first-known historical releases.
- month-over-month states must be computed within one vintage or explicit revision lineage.
- aggregate NDC leading/monitoring indicators contain TAIEX-related market-price content, so this audit validates vintage semantics only, not stock alpha.

Required replay fields: referenceMonth, publishedAt, capturedAt, firstEligibleTaiwanDecision, releaseVintageId, priorReleaseVintageId, componentDefinitionVersion, trendAdjustmentVersion when observable, as-published leading/coincident/lagging levels, monitoring score/light, revisionDetected. Missing comparable prior values remain UNKNOWN.

Maturity:
D13-18 remains L2 / 40%. Ex-TAIEX PIT reconstruction and OOS Taiwan incrementality are not proven. FORMAL_OPTIMIZATION_CANDIDATE = NO. Formal Core LOCKED.

Exact next continuation:
1. Preserve the next NDC release as a new vintage without overwriting prior releases.
2. Audit whether all seven leading components have first-known/revision lineage sufficient for ex-TAIEX reconstruction.
3. If any component vintage is not reconstructable, ex-TAIEX remains UNKNOWN and rotate to another D13-14..19 source-only lane.
4. Outcomes remain CLOSED.
