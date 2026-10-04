# D18-08 Strategy Activation / Deactivation L3 Acceptance — 2026-10-04 V0.1

Updated: 2026-10-04 14:40 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System 2 live-policy impact: NONE

## Scope

This packet evaluates D18-08 strategy activation/deactivation only.

L3 is accepted because an executable research-only strategy-date comparison frame now binds:
1. a frozen Shadow strategy-day accounting receipt;
2. its immutable run fingerprint;
3. a PIT-safe D18 observable regime vector;
4. a preregistered binary activation/deactivation challenger;
5. one identical cost contract for static baseline and challenger.

The frame separates:
- NATURAL_ZERO_PICK;
- POLICY_DISABLED;
- DATA_UNKNOWN;
- POLICY_ENABLED.

No performance advantage is claimed.

## First preregistered challenger

Canonical preregistration:
`research/d18_08_activation_prereg_v0_1.json`

Frozen strategy:
- strategyId = SHORT_MOMENTUM;
- strategyVersion = V0.1-CONTRACT.

Frozen regime input:
- regimeDimension = trendContext.

Frozen challenger:
- DOWN_TREND_CONTEXT -> disable strategy for the date;
- any other KNOWN trend context -> keep the same static strategy;
- UNKNOWN / non-discrete context -> DATA_UNKNOWN.

This mapping was preregistered before any challenger outcome evaluation.
It was selected from the strategy mechanism, not from realized return optimization.

## Mechanism support

SHORT_MOMENTUM's canonical contract already treats MARKET_REGIME as a primary evidence family and states that broad risk-off / disorder may reduce strategy priority.

A simple known-downtrend disable challenger is therefore economically interpretable:
- continuation/reacceleration can be less favorable when broad trend context is adverse;
- suppressing the strategy may reduce adverse exposure.

This is only a mechanism hypothesis.

## Falsification / failure conditions

Reject or retain as non-incremental if any of the following occurs:
- no after-cost improvement versus the exact same frozen static strategy;
- missed rebound / opportunity cost offsets avoided losses;
- apparent benefit is concentrated in one date, sector or regime episode;
- UNKNOWN / blocked dates are selectively omitted;
- advantage disappears under exposure-matched control;
- turnover/churn/reactivation delay consumes the gross effect;
- the regime state duplicates stock-level trend/volatility factors and adds no incremental value;
- policy performance is unstable across chronological OOS/prospective folds.

## Executable implementation

Implementation:
`system2/runtime/d18_strategy_activation_frame_v0_1.mjs`

Targeted test:
`system2/tests/d18_strategy_activation_frame_v0_1.test.mjs`

## Immutable baseline identity

The frame verifies:
- shadow run marketDate;
- decisionTimestamp;
- strategyId / strategyVersion;
- shadowSpecId;
- universeVersion;
- runFingerprintHash;
- shadowAccountingHash.

The shadowAccountingHash is recomputed from the supplied Shadow run receipt and must exactly equal the immutable run fingerprint.

A mutated Shadow receipt cannot silently enter the same comparison frame.

## Baseline opportunity semantics

A completed strategy-day run with:
- SELECTED > 0; or
- QUALIFIED_NOT_SELECTED > 0

is BASELINE_OPPORTUNITY_PRESENT.

If the run is incomplete, the fingerprint is incomplete, or no known opportunity exists while SOURCE_BLOCKED / SESSION_INVALID / ERROR / INCOMPLETE rows remain:
DATA_UNKNOWN.

If the complete run has no known opportunity and no blocking state:
NATURAL_ZERO_PICK.

Therefore a natural zero-pick date cannot be relabeled POLICY_DISABLED.

## Challenger semantics

When the baseline has a known opportunity:
- disabled preregistered regime value -> POLICY_DISABLED;
- known non-disabled regime value -> POLICY_ENABLED;
- unknown regime dimension -> DATA_UNKNOWN.

When baseline is NATURAL_ZERO_PICK:
- challenger remains NATURAL_ZERO_PICK;
- policyDisabledCounterfactualEligible=false.

Only POLICY_DISABLED requires later opportunity-cost outcome accounting.

## Cost parity

The cost contract must:
- have version identity;
- have availableAt <= decisionTimestamp;
- provide a non-negative round-trip cost rate.

The frame binds the exact same costHash to:
- static baseline;
- activation challenger.

No cheaper challenger cost assumption is permitted.

## PIT / preregistration guards

Required:
- registration.state = PREREGISTERED_SHADOW;
- policyClass = BINARY_ACTIVATION_DEACTIVATION;
- exact strategyId/version match;
- parameterHash replay match;
- registration.registeredAt <= decisionTimestamp;
- registration.availableAt <= decisionTimestamp;
- regime vector marketDate/decisionTimestamp exact match;
- regime vector version exact match.

Post-decision policy registration is rejected.

## Test evidence

Validated head:
- System2 Research CI run 37183405942 / #633: SUCCESS.
  - D18 strategy activation frame tests: PASS.
  - 154 System2 test files executed.
  - Production isolation guard: PASS.
- V8 Repair CI run 37183405955 / #956: SUCCESS.
- V8 Regression Tests run 37183405929 / #1744: SUCCESS.

Targeted falsification covers:
- down-trend known opportunity -> POLICY_DISABLED;
- up-trend known opportunity -> POLICY_ENABLED;
- natural zero-pick remains NATURAL_ZERO_PICK;
- blocked zero-pick -> DATA_UNKNOWN;
- unknown regime -> DATA_UNKNOWN;
- incomplete run/fingerprint -> DATA_UNKNOWN;
- post-decision registration -> reject;
- parameter-hash mismatch -> reject;
- mutated Shadow accounting -> reject;
- post-decision cost contract -> reject;
- identical inputs -> identical frameHash.

## L3 promotion-gate review

Per `research/D16_D18_PROMOTION_GATE_V0_1.md`:

1. executable/tested data frame: PASS.
2. source/version/availableAt provenance: PASS through run fingerprint + regime vector + preregistration + cost contract.
3. replay test: PASS.
4. UNKNOWN fail-closed: PASS.
5. no current-data historical backfill: PASS.
6. source coverage audited: PASS through complete/incomplete Shadow accounting and explicit regime state.

## Why not L4

No prospective/OOS policy-value result exists yet.

L4 still requires:
- prospective strategy-date activation frames;
- frozen strategy/regime/policy versions;
- complete later outcome joins;
- more than one relevant regime episode;
- identical costs;
- opportunity-cost accounting for POLICY_DISABLED dates;
- natural-zero / policy-disabled / data-unknown separation in the realized panel;
- static baseline paired comparison;
- exposure-matched negative control where applicable;
- no single date/episode domination.

D18-08 therefore stops at L3.

## System 1 / System 2 meaning

System 1:
- no selection, A/B, ranking, BUY/ADD/REDUCE/SELL/STOP or monitoring change.

System 2:
- research-only paired policy feasibility exists;
- no live strategy activation authority;
- no weight/capital/push authority.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.

## Exact next

1. Persist prospective D18-08 strategy-date frames without attaching outcome at decision time.
2. Join outcomes only after maturity.
3. Measure POLICY_DISABLED opportunity cost and NATURAL_ZERO_PICK / DATA_UNKNOWN coverage separately.
4. Accumulate multiple independent dates and regime episodes.
5. Only then open L4 paired static-vs-challenger evaluation.
6. D18-09 dynamic weighting remains a stronger policy intervention and must not inherit D18-08 evidence automatically.
