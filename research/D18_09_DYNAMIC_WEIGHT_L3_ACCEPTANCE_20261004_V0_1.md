# D18-09 Dynamic Strategy Weighting L3 Acceptance — 2026-10-04 V0.1

Updated: 2026-10-04 14:48 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 2 live capital impact: NONE

## Scope

This packet evaluates D18-09 dynamic strategy weighting only.

L3 is accepted because an executable research-only strategy-date weight frame now binds:
1. immutable Shadow strategy-day accounting;
2. run fingerprint identity;
3. PIT-safe D18 regime vector;
4. a tiny preregistered non-levered discrete exposure map;
5. adjacent official-session prior weight identity;
6. an explicit policy-turnover cost contract.

No optimized weight or performance improvement is claimed.

## First preregistered challenger

Canonical preregistration:
`research/d18_09_weight_prereg_v0_1.json`

Frozen strategy:
- SHORT_MOMENTUM / V0.1-CONTRACT.

Frozen regime dimension:
- trendContext.

Frozen map:
- UP_TREND_CONTEXT -> 1.0;
- RANGE_OR_MIXED -> 1.0;
- DOWN_TREND_CONTEXT -> 0.5;
- UNKNOWN / unmapped -> DATA_UNKNOWN.

Static research baseline:
- weight = 1.0.

Constraints:
- maxResearchWeight = 1.0;
- leverageAllowed = false;
- no continuous optimizer;
- no threshold sweep;
- no capital amount or position size assignment.

The 0.5 value is a single preregistered falsification challenger, not an estimated optimum.
A failed result cannot be rescued by searching nearby weights without opening a new registered experiment/version.

## Mechanism support

A known adverse broad trend can plausibly reduce short-momentum continuation quality.

A partial exposure challenger tests a weaker intervention than full strategy disable:
- keep the same strategy and candidate semantics;
- reduce only research exposure in the preregistered adverse context;
- compare later against the static 1.0 baseline.

This is a mechanism hypothesis only.

## Falsification

Reject or retain as non-incremental if:
- after-cost policy value does not beat static weight 1.0;
- incremental policy turnover consumes the gross benefit;
- missed rebound upside dominates avoided downside;
- the result is concentrated in one date/sector/regime episode;
- UNKNOWN/natural-zero dates create selective coverage;
- the map adds no incremental value beyond stock-level trend/volatility;
- a different nearby weight is required to rescue the conclusion;
- multiple chronological OOS/prospective folds do not preserve direction.

## Executable implementation

Implementation:
`system2/runtime/d18_strategy_weight_frame_v0_1.mjs`

Targeted test:
`system2/tests/d18_strategy_weight_frame_v0_1.test.mjs`

## Immutable identity

The frame requires exact agreement across:
- marketDate;
- decisionTimestamp;
- strategyId/version;
- shadowSpecId;
- universeVersion;
- runFingerprintHash;
- recomputed shadowAccountingHash;
- regimeVectorHash/version;
- registration parameterHash.

A mutated Shadow receipt cannot enter the same frame.

## Baseline / missingness semantics

BASELINE_OPPORTUNITY_PRESENT:
- completed run and fingerprint;
- at least one SELECTED or QUALIFIED_NOT_SELECTED row.

NATURAL_ZERO_PICK:
- completed run;
- no known opportunity;
- no blocking SOURCE_BLOCKED / SESSION_INVALID / ERROR / INCOMPLETE rows.

DATA_UNKNOWN:
- incomplete run/fingerprint;
- blocking source/session/error state with no known opportunity;
- unknown/unmapped regime dimension.

No missing or unknown state is converted to zero exposure benefit.

## Weight semantics

WEIGHT_ASSIGNED occurs only when:
- baseline opportunity is known;
- regime vector is PIT eligible;
- the preregistered regime dimension is KNOWN;
- the dimension value exists in the frozen discrete map.

The output records researchWeight and exposureDeltaVsStatic only.

It does NOT assign:
- cash capital;
- shares;
- live position size;
- order size.

## Turnover semantics

Policy turnover uses only adjacent official-session prior weight frames.

If no prior frame exists:
WARMUP_NO_PRIOR_FRAME.

If prior weight state is unknown:
DATA_UNKNOWN.

If the prior frame is not the immediately previous official session:
reject.

When both prior and current research weights are known:
policyTurnoverUnits = abs(currentResearchWeight - priorResearchWeight).

Incremental policy-turnover cost:
policyTurnoverUnits × oneWayTurnoverCostRate.

This is policy-induced turnover only.
Underlying strategy trading turnover is explicitly not included at this stage.

## Cost timing

The turnover cost contract:
- has an immutable version/hash;
- must be available by the decision timestamp;
- has a non-negative one-way turnover-cost rate.

Post-decision cost contracts are rejected.

## Test history

Initial System2 Research CI #638 failed before target execution because the test fixture used await inside a non-async arrow function.

That was a test-code syntax defect, not a research pass.
The fixture was corrected before acceptance.

Final validated head:
- System2 Research CI run 37183844832 / #640: SUCCESS.
  - D18 strategy weight frame tests: PASS.
  - 155 System2 test files executed.
  - Production isolation guard: PASS.
- V8 Repair CI run 37183844868 / #961: SUCCESS.
- V8 Regression Tests run 37183844915 / #1750: SUCCESS.

Targeted falsification verifies:
- prior 1.0 -> current 0.5 creates 0.5 policy-turnover units;
- incremental turnover cost is charged;
- no prior weight -> WARMUP rather than zero cost;
- range context restores 1.0 with transition turnover;
- natural zero remains NATURAL_ZERO_PICK;
- unknown regime -> DATA_UNKNOWN;
- non-adjacent prior frame -> reject;
- prior policy-parameter mismatch -> reject;
- post-decision registration -> reject;
- post-decision cost contract -> reject;
- leverage / >1.0 research weight -> reject;
- identical inputs -> identical frameHash.

## L3 promotion-gate review

Per `research/D16_D18_PROMOTION_GATE_V0_1.md`:

1. executable/tested data frame: PASS.
2. source/version/availableAt provenance: PASS.
3. replay test: PASS.
4. UNKNOWN fail-closed: PASS.
5. no current-data historical backfill: PASS.
6. source coverage audited: PASS through Shadow-run completeness + regime state + adjacent-session weight lineage.

## Why not L4

No real prospective/OOS policy-value sample has been evaluated.

L4 still requires:
- prospective strategy-date weight frames;
- frozen strategy/regime/map/cost versions;
- complete matured outcomes;
- identical underlying baseline/challenger cost assumptions;
- incremental policy-turnover costs;
- multiple independent dates and regime episodes;
- static 1.0 paired baseline;
- no single episode/date domination;
- parameter-neighborhood falsification without post-hoc rescue.

D18-09 therefore stops at L3.

## System 1 / System 2 meaning

System 1:
- no Formal factor/rank/A-B/Top6/3+3/capital/BUY/ADD/REDUCE/SELL/STOP change.

System 2:
- research-only exposure multiplier feasibility exists;
- no live capital, shares, order or monitoring authority.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next

1. Accumulate prospective D18-09 weight frames across real strategy dates.
2. Join mature outcomes only after their horizon is known.
3. Charge incremental policy turnover separately from underlying strategy turnover.
4. Compare against static 1.0 and exposure-matched controls.
5. Do not search alternative weights to rescue the preregistered map.
6. D18-12 drawdown-aware de-risking still requires a valid strategy-level equity/drawdown path and does not inherit D18-09 maturity.
