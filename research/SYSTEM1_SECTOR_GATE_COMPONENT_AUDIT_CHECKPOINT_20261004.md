# System 1 sector-gate component audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_PENDING / FORMAL_CORE_LOCKED

## Purpose

Decompose the current composite SECTOR_GATE into its three frozen components over the complete immutable V8.17+ C1 population:

- SECTOR_BREADTH: breadth >= 40;
- SECTOR_RETURN: avgChange >= -1;
- SECTOR_AMOUNT: amountVs20DayAverage >= 0.5.

The current Formal gate rejects when the composite observer state is FAIL. This audit measures which component patterns drive that state, how much overlap exists, and how much sector failure is hidden behind earlier production firstFailure reasons.

It does not alter the sector gate or claim any threshold is economically wrong.

## Existing authority reused

- `research/formal_gate_overlap_observer_v0_1.mjs`
- `shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`
- `MARKET_BREADTH_ROTATION_RESEARCH.md`
- `MARKET_BREADTH_ROTATION_CHECKPOINT.md`
- `research/sector_rs_priority_structural_falsification_v0_1.json`
- `research/SYSTEM1_FIRST_FAILURE_MASKING_CHECKPOINT_20261004.md`

V8.14 already preserved sector gate inputs in bounded Shadow evidence. V8.17 now provides the full immutable C1 denominator. This audit reuses the full C1 population rather than creating another bounded cohort.

## Implementation

Pure Class-A analyzer:

`research/system1_sector_gate_component_audit_v0_1.mjs`

Inputs:
- immutable adapted C1 rows;
- same-generation C1 gate-overlap diagnosis;
- optional same-date firstFailure masking audit.

No Formal gate is recomputed as a new decision authority.

## Combined-state parity

The analyzer independently reconstructs the observer's combined state from the three component states using the same semantics:

1. if any component is UNKNOWN -> combined expected UNKNOWN;
2. otherwise if any component is FAIL -> combined expected FAIL;
3. otherwise all three PASS -> combined expected PASS.

This UNKNOWN precedence is intentional and matches the frozen gate observer: missing sector input is not converted into bearish evidence merely because another known component is weak.

Any disagreement between the stored combined SECTOR_GATE and the three component states increments:

`combinedComponentMismatchN`

and changes:

`evidenceTrust = DATA_QUALITY_BLOCKED`.

## Component-pattern outputs

The audit records:

- PASS_ALL;
- single-component FAIL;
- multi-component FAIL combinations;
- single/multi UNKNOWN patterns;
- mixed known-FAIL + UNKNOWN patterns.

It reports:

- combinedFailN;
- combinedUnknownN;
- per-component PASS / FAIL / UNKNOWN;
- per-component evaluable fail rate;
- singleComponentFailN;
- multiComponentFailN;
- uniqueFailCounts for breadth / return / amount;
- patternCounts.

A "unique component fail" only means the other two sector components were observed PASS on that row. It does **not** mean removing that threshold would recover a Formal selection.

## Threshold-margin summaries

Using the same immutable C1 sector inputs, the audit reports signed distance from the current frozen thresholds:

- breadth - 40;
- avgChange - (-1);
- amountVs20DayAverage - 0.5.

Summaries are reported for:
- all observed rows;
- combined sector-gate passers;
- combined sector-gate failures.

These are descriptive distributions only.

They are **not**:
- an alternative cutoff search;
- an invitation to optimize 40 / -1 / 0.5;
- an outcome-conditioned sweep.

## firstFailure masking link

When the same-date `firstFailureMasking` object is available, the sector audit records:

- sectorFirstFailureN;
- sectorObservedFailN;
- hiddenBehindEarlierFirstFailureN.

This directly separates:

production execution-path attribution

from

same-session full gate-overlap incidence.

A hidden sector fail is descriptive overlap only, not marginal causal contribution.

## Daily collection

The existing verified C1/C2 evidence collector now appends:

`sectorGateComponents`

to the same daily artifact.

No:
- new endpoint;
- new HTTP/provider call;
- new scheduler;
- D1 schema;
- Worker runtime hook;
- Production deployment

is introduced.

## Interpretation guardrails

This audit does not prove:
- sector breadth 40 is too strict;
- avgChange -1 is too strict;
- amountVs20DayAverage 0.5 is too strict;
- one component should be removed;
- SECTOR_GATE should become supportive;
- a unique component fail would otherwise be selected;
- a higher candidate count is economically better.

Permitted future use:
- identify which component/pattern actually drives sector-gate scarcity;
- quantify how often sector failure is hidden by earlier fail-fast ordering;
- pre-register matched prospective outcome comparisons by exact component pattern;
- compare sector-gate protection versus opportunity cost after sufficient independent dates and controls.

## Formal boundary

No Formal sector threshold, sector score, comparator, A/B, liquidity, RR, grade, 3+3/Top6, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the existing daily C1 workflow emit the first genuine V8.17+ sector component-pattern receipt.
3. Accumulate independent trading dates before judging practical component burden.
4. Join future outcomes by exact sector component pattern only after outcome maturity and date-cluster controls exist.
5. Any sector threshold/role/score/comparator change is Class-C and requires explicit owner approval.
