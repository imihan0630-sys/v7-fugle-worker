# V8.15 Valuation provenance Shadow — Class A implementation plan

Status: RESEARCH-ONLY / BRANCH ONLY / NOT PROMOTED
Formal Core: LOCKED

## Audit finding
Existing prospective research snapshots preserve stock PE/PB and growth inputs, and Shadow rows preserve exact exclusionReason/basePassed/rrPassed. They do NOT preserve:
- sectorMedianPe used by the Formal relative-PE veto;
- positive-PE peer count / denominator composition identity;
- the exact relative PE ratio and growth-exception pass state;
- an explicit valuation-gate audit state;
- a dedicated exact valuation-rejected cohort.

Therefore pre-V8.15 Shadow cannot cleanly classify the exact veto counterfactual. Historical recomputation from current code/current fundamentals is prohibited.

## Frozen receipt contract
For each prospective Shadow candidate at scan time:
- stockPe, stockPb;
- valuationObserved, valuationDate, valuationSource;
- sectorMedianPe;
- positivePePeerCount;
- relativePe = stockPe / sectorMedianPe only when both are positive;
- revenueQuarterYoY, epsYoY;
- growthException = revenueQuarterYoY > 25 OR epsYoY > 25;
- gateEvaluable;
- wouldRejectCurrentRule = relativePe > 2.5 AND !growthException;
- exactThresholds: relativePe 2.5, growth 25%;
- sourceCompleteness / capturedAtSelection;
- upstream exclusionReason/basePassed/rrPassed;
- fullFormalCounterfactual=false for rows rejected before downstream Formal checks.

Missing PE or median stays UNKNOWN. PB never substitutes for PE.

## Cohort contract
Add a bounded research-only VALUATION_REJECTED cohort sampled from rows whose exact current valuation reject reason fires. Keep it separate from generic REJECTED_AFTER_BASE. This cohort is not a complete rejected-universe count and cannot estimate market-wide opportunity loss.

## Tests
Synthetic tests must prove:
1. 2.51x relative PE + growth <=25 => reject audit true.
2. 2.51x + either growth >25 => exception true / reject false.
3. PE missing => UNKNOWN, not cheap/pass.
4. sector median missing or <3 positive peers => UNKNOWN, not pass.
5. PB present with PE missing remains PE UNKNOWN.
6. valuation cohort never changes Formal candidates/rank/capital/signals/push.
7. no historical backfill/recomputation.

## Classification
Class A only if implemented by copying already-computed scan-time fields into research snapshot/cohort and never changing scoreCandidate inputs/order. Any shared source-fetch/storage semantic change is Class B. Any 2.5/25 threshold or Formal behavior change is Class C.

Current optimization status: NOT_OPTIMIZATION_READY.
