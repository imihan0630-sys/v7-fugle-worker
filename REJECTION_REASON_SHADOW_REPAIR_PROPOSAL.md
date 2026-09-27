# Rejection-Reason Shadow Coverage Repair Proposal

Updated: 2026-09-27 Asia/Taipei
Status: CLASS-A DESIGN / DEFERRED UNTIL ACTIVE V8.15 LINEAGE RESOLVES
Formal Core: LOCKED

## Problem

Current generic `REJECTED_AFTER_BASE` sampling is deterministic but reason-biased:
1. collect all unselected/non-near rows whose `scoreCandidate()` result is `ok!=true && basePassed==true`;
2. sort all rows by exclusion reason, then symbol;
3. keep only the first 6 GENERAL and first 6 THOUSAND.

Therefore one lexicographically earlier/high-frequency reject reason can consume the entire pool quota and erase evidence for other downstream gates.

This is research selection bias, not a Formal selection bug.

Machine falsification:
`research/rejected_after_base_sampling_falsification_v0_1.json`.

## Minimum safe repair

After the active V8.15 valuation-provenance lineage is resolved, the preferred next research-only change should:

1. preserve the existing first rejection reason under unchanged Formal order;
2. compute **complete counts** for every exact `reason × pricePool` on each clean scan;
3. preserve a deterministic small sample per `reason × pricePool`, selected without outcome information;
4. carry totalReasonCount / sampledReasonCount / samplingFraction;
5. keep `fullFormalCounterfactual=false`;
6. never bypass a gate and call the downstream result Formal;
7. make zero new market-data calls;
8. leave selected symbols, ordering, quotas, capital, monitor/signals/push byte-for-byte invariant for frozen fixtures.

## Sampling design — outcome-free

Preferred default:
- sample up to 2 rows per exact reason × price pool;
- deterministic hash key `scanDate|reason|pool|symbol`;
- global hard safety cap per scan to protect D1/runtime;
- if cap is reached, record omittedReasonCounts explicitly rather than silently losing them.

The value “2” is a storage/coverage engineering default, not a trading threshold and must not be optimized from outcomes.

Alternative if runtime/storage review rejects added rows:
- keep exact full counts for all reasons;
- use a deterministic rotating one-row-per-reason schedule across dates;
- explicitly label coverage as sparse.

## Why not modify V8.15 PR #112 now

PR #112 is already the active `V8.15 Valuation gate provenance Shadow` lineage and touches the same Shadow archive area. Parallel edits would create avoidable merge/version risk.

Current rule:
`DEFER_IMPLEMENTATION_UNTIL_V8_15_RESOLVED`.

The valuation-specific cohort in V8.15 is still useful and should remain isolated. This proposal addresses the generic downstream-rejection evidence layer after that lineage settles.

## Tests required before promotion

Synthetic fixture must include:
- >6 rows of REASON_A;
- >6 rows of REASON_B;
- both GENERAL and THOUSAND;
- a third rare reason.

Tests must prove:
- complete reason counts are exact;
- every sampled reason has bounded deterministic coverage;
- sampling is stable for identical scan input;
- selected list/rank/allocation unchanged;
- no mutation of Formal objects;
- no new fetches;
- UNKNOWN remains UNKNOWN.

Regression:
- existing V8.12 history-source;
- V8.13 PriorityScore provenance;
- V8.14 sector gate;
- V8.15 valuation provenance after it becomes baseline;
- standard V8 Regression/Repair CI.

## Governance

Potential Class A only if implemented as isolated research serialization on already-computed data.

If D1/schema/write-volume/runtime behavior becomes material, reclassify Class B proposal-first.

No Formal optimization is contained in this proposal.


## First-failure attribution guard

The repaired counts remain counts of the **first rejection reason under the current Formal order**.

They are NOT:
- all failed gates;
- marginal gate contribution;
- unique rejection count;
- estimated selected-count increase if a gate were removed.

Outcome-free witness:
- X fails A and B;
- Y fails A only;
- Z fails B only.

Order A->B gives first-failure counts A=2/B=1.
Order B->A gives A=1/B=2.
Accepted set is unchanged.

Therefore any API/report produced by the repair must name the denominator `firstFailureCount` (or equally explicit wording), not generic `gateRejectCount`.

Machine guard:
`research/first_failure_attribution_falsification_v0_1.json`.

A future gate-overlap observer may record PASS/FAIL/UNKNOWN for independently evaluable gates on the same PIT scan row, but:
- it must preserve the original first failure;
- it must not bypass gates and call the result Formal;
- missing inputs remain UNKNOWN;
- later PASS does not imply the row would have been selected.
