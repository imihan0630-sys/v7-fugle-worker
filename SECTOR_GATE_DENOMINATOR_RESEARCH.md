# SECTOR_GATE — Denominator / Self-Inclusion Semantics

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-A STRUCTURAL FALSIFICATION / OUTCOMES CLOSED  
Formal Core: LOCKED

## SG-001 — Scope

The broader Market Breadth / Rotation lane remains the conceptual owner. This continuation only audits the exact current System 1 gate:

- breadth >= 40;
- avgChange >= -1;
- amountVs20DayAverage >= 0.5.

No threshold change is authorized.

## SG-002 — The three inputs use different effective universes

Current `buildTodaySectorStats(todayRows, featureRows)` computes:

**Breadth**
- denominator: every `todayRows` stock in the industry;
- numerator: `(changePercent || 0) > 0`;
- missing/nonfinite change is therefore a non-advance in the denominator.

**Average change**
- only finite `changePercent` values enter the average;
- missing change rows are excluded from this denominator.

**Amount activity**
- only rows with a matched feature having `historyDays>=20` enter;
- current covered trade value is divided by the sum of those rows' `avgAmount20`;
- history readiness alone defines membership; missing `avgAmount20` contributes zero to the baseline sum.

Therefore the three thresholds are a composite of three different sample definitions.

## SG-003 — Fixed missingness counterexample

Rows:
- +1%;
- -1%;
- missing;
- missing.

Deployed breadth = 1/4 = 25%.

Observed-only breadth = 1/2 = 50%.

Deployed avgChange = 0% from only the two finite rows.

Thus missing change data pushes breadth downward while not entering avgChange.

This is a denominator semantic, not evidence that the 40% threshold is wrong.

## SG-004 — Candidate self-inclusion

Unlike the earlier `sectorReturn20` calculation, which subtracts the candidate's own ret20 from the peer sum, the sector gate is computed once from the inclusive industry group and reused for every candidate.

Fixed example:
- candidate +4%;
- peer +0.1%;
- peer -2%;
- peer -2%;
- equal activity ratios.

Inclusive deployed state:
- breadth = 50%;
- avgChange = 0.025%;
- gate passes.

Remove the candidate only for research:
- breadth = 33.3%;
- avgChange = -1.3%;
- gate fails.

So candidate self-contribution can alter the gate near boundaries.

Leave-one-out is **not** current Formal truth and must never replace the deployed inclusive values without Class-C approval.

## SG-005 — Activity denominator readiness

`ready` requires `historyDays>=20`, not a separately observed positive `avgAmount20`.

A history-ready row with missing `avgAmount20` can therefore:
- add current `tradeValue` to coveredAmount;
- add zero to avgAmount20;
- mechanically lift `amountVs20DayAverage`.

Future evidence must preserve:
- activityReadyCount;
- avgAmount20 observed count;
- avgAmount20 positive count;
- tradeValue observed count.

## SG-006 — Existing PR #111 limitation

PR #111 was useful for freezing the final PIT sector values and a bounded rejected cohort, but it does not preserve:
- the three distinct denominators;
- missing change composition;
- baseline-amount missingness;
- candidate self-contribution.

Therefore it is not enough for causal/opportunity-cost inference.

Machine artifacts:
- `research/sector_gate_denominator_observer_v0_1.mjs`;
- `research/sector_gate_denominator_falsification_v0_1.json`;
- `tests/test_sector_gate_denominator_observer_v0_1.mjs`.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists.
