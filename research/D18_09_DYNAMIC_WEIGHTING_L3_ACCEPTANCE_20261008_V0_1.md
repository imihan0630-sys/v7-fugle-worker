# D18-09 Dynamic Strategy Weighting L3 Acceptance — 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System2 live-policy impact: NONE

## Scope

D18-09 advances from L2/40 to L3/60 at data-feasibility maturity only.

The accepted object is an executable, deterministic, outcome-blind dynamic-weight policy transform over already-frozen Taiwan PIT strategy-day and regime identities.

No policy-return advantage, allocation superiority or Formal optimization is claimed.

## Executable implementation

- `research/d18_policy_transform_l3_v0_1.mjs::buildDynamicWeightFrame`
- `tests/test_d18_policy_transform_l3_v0_1.mjs`
- workflow `Research D18 Policy Transform L3 Readonly`

Accepted exact head:
`543974699ce848d8b791bfeeab96f7324f076905`.

Workflow:
- run `37741654512`: SUCCESS;
- targeted suite: 25 total D18-09/D18-12 tests, all PASS;
- research-only isolation: PASS.

Same-head V8 Regression:
- run `37741654539`: SUCCESS.

## Frozen feasibility semantics

The builder requires:
- frozen strategy-day identity/hash;
- PIT-eligible regime vector on the exact market date / decision timestamp;
- at least two explicit strategy identities;
- static weights summing to one;
- a tiny preregistered discrete regime-to-weight map;
- policy registration available no later than decision time;
- identical explicit cost contract available no later than decision time;
- exact parameter-hash replay.

It rejects:
- post-decision registration;
- post-decision cost;
- outcome-selected policy;
- parameter mutation;
- non-unit weights;
- strategy-set mismatch;
- regime date mismatch;
- non-PIT regime state.

UNKNOWN/unmapped regime state becomes:
`DATA_UNKNOWN`,
not an imputed dynamic weight.

## Why this is L3, not L4

This proves an executable/tested Taiwan-PIT policy-data transform with deterministic replay and fail-closed unknown handling.

It does not prove:
- better return;
- lower drawdown;
- lower turnover;
- stable regime timing;
- OOS/prospective advantage.

L4 still requires prospective paired static-vs-dynamic outcomes over multiple independent dates/episodes with identical costs, turnover and exposure controls.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
