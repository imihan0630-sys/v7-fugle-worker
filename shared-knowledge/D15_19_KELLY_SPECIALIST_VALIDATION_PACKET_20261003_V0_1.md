# D15-19 Kelly / Fractional Kelly Specialist Validation Packet 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: READY_FOR_ROOM10_EXECUTION
Primary room: 10｜投組風控與交易執行研究室
Formal Core impact: NONE

## Parent governance

Read first:
- `shared-knowledge/CURRICULUM_15_ITEM_DEPENDENCY_AUDIT_20261003_V0_1.md`
- `research/D16_25_D15_19_MERGE_DECISION_INPUT_V0_1.md`
- `research/D16_D18_VALIDATION_CHECKPOINT.md`
- `shared-knowledge/RESEARCH_TO_OPTIMIZATION_BRIDGE_AUDIT_20261003_V0_1.md`

D16-side state:
`D16_SIDE_SPECIALIST_COMPLETE_AT_L2 / D15_SPECIALIST_RESEARCH_REQUIRED`

D16-25 remains L2 / 40%.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.

## Objective

Determine whether D15-19 should:
A. remain a standalone Kelly / Fractional Kelly module;
B. be absorbed into D15-16 Portfolio Optimization;
C. be merged into an expanded D16-25;
D. be retired as a standalone ID with split-transfer of responsibilities.

This is curriculum ownership research, not live sizing deployment.

## Required research blocks

### K1 Log-growth objective
Define:
- single-bet Kelly;
- repeated-bet log-growth objective;
- payoff asymmetry;
- binary vs continuous return formulations;
- relation to expected return / expected utility.

Required falsification:
show conditions where expected-return-positive positions receive inappropriate Kelly sizing because probability/payoff estimates are unstable.

### K2 Full Kelly vs Fractional Kelly
Compare:
- full Kelly;
- 1/2 Kelly;
- 1/4 Kelly;
- capped Kelly;
- fixed-risk baseline.

Do not optimize the fraction ex post on outcome data.

### K3 Parameter-estimation risk
Study:
- probability estimation error;
- payoff/R multiple estimation error;
- sampling error;
- confidence intervals/posterior uncertainty;
- sensitivity of size to small edge changes.

Required principle:
uncertainty enters from D16-25; D15-19 consumes it.

### K4 Multi-position / correlated Kelly
Study:
- simultaneous positions;
- covariance/correlation;
- concentration;
- sector/industry clustering;
- effective bets;
- interaction with D15-02/D15-03/D15-06/D15-15.

A single-stock Kelly fraction cannot be naively summed across correlated positions.

### K5 Drawdown / ruin / path risk
Compare growth-optimal sizing with:
- max drawdown;
- tail loss;
- portfolio heat;
- stop-risk geometry;
- risk-authority constraints.

Theoretical asymptotic growth optimality is not sufficient for operational acceptability.

### K6 Liquidity / costs / capacity
Include:
- fees/taxes;
- slippage;
- partial fill;
- orderability;
- market impact;
- odd-lot / round-lot constraints;
- capital granularity.

### K7 Benchmark comparison
Mandatory baselines:
- equal allocation;
- fixed-risk sizing;
- current capped sizing;
- volatility scaling;
- risk budgeting/risk parity where applicable;
- D15-16 portfolio optimization family.

Kelly must prove incremental utility beyond simpler methods.

### K8 Role boundary
Freeze:
- D16-25 = calibrated belief / uncertainty / ABSTAIN / expected utility input;
- D15-19 = Kelly/log-growth sizing mechanics if retained;
- D15-16 = general portfolio optimization / risk-budget family.

No duplicate probability calibration ownership is allowed inside D15-19.

## Required outputs

1. theory/mechanism table;
2. positive mechanism;
3. counterevidence/failure modes;
4. PIT data/parameter source contract;
5. uncertainty handoff from D16-25;
6. single vs multi-position formulation;
7. cost/liquidity/capacity treatment;
8. benchmark comparison design;
9. anti-orphan capability inventory;
10. proposed terminal structure A/B/C/D;
11. maturity recommendation;
12. explicit Formal Core unchanged statement.

## Merge-decision gates

### Option A — keep separate
Allowed only if D15-19 proves a distinct ongoing log-growth/sizing contract that is not naturally owned by D15-16.

### Option B — absorb into D15-16
Preferred if Kelly is best understood as one allocation method inside the broader portfolio-optimization family while D16-25 remains upstream probability/calibration owner.

### Option C — merge into D16-25
Allowed only if D16 scope is explicitly expanded from predictive decision quality into downstream capital allocation. This is currently the least natural structure and requires owner review.

### Option D — split-transfer
Allowed if standalone D15-19 adds little governance value:
- probability/calibration/uncertainty -> D16-25;
- Kelly/Fractional-Kelly/log-growth sizing mechanics -> D15-16/D15 family.

## Maturity rule

D15-19 starts from L0 / 0%.
D16-25's L2 evidence cannot be transferred to D15-19.
D15-19 must independently establish theory/mechanism/falsification before L2.
No curriculum retirement before anti-orphan verification and explicit owner approval.

## Forbidden

- no live position sizing change;
- no Formal Core change;
- no claim that Fractional Kelly fixes bad probability calibration;
- no ex-post search for the best Kelly fraction;
- no standalone Alpha vote from a sizing formula;
- no retirement before owner approval.

## Return status

The room must return one of:
- `KEEP_SEPARATE`
- `ABSORB_INTO_D15_16`
- `MERGE_INTO_D16_25`
- `SPLIT_TRANSFER_RETIRE_STANDALONE`
- `EVIDENCE_INSUFFICIENT`
