# D18-12 Drawdown-Aware De-risking L3 Acceptance — 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
System2 live-policy impact: NONE

## Scope

D18-12 advances from L2/40 to L3/60 at data-feasibility maturity only.

The accepted object is an executable deterministic drawdown-policy transform that consumes only prior matured immutable strategy-attribution evidence known before the current decision time.

No claim is made that drawdown de-risking improves returns or market timing.

## Executable implementation

- `research/d18_policy_transform_l3_v0_1.mjs::buildDrawdownDeriskFrame`
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
- Taiwan strategy/date identity;
- a preregistered drawdown-to-exposure rule;
- identical cost contract known before decision time;
- complete prior-history coverage;
- zero unresolved prior decisions;
- only MATURED prior outcome rows;
- every outcomeUpdatedAt <= current decisionTimestamp;
- every prior marketDate < current marketDate;
- immutable attribution receipt hash per prior decision;
- no duplicate decision identity.

Current/future outcome access is explicitly forbidden.

Past matured outcome history is explicitly disclosed as consumed; it is not mislabeled as "no outcome access".

When history is partial or unresolved:
`DATA_UNKNOWN`,
not full exposure and not a zero-return substitution.

## Falsification

The suite verifies:
- incomplete history fails closed;
- unresolved prior decision fails closed;
- immature prior outcome rejected;
- future-updated outcome rejected;
- same-day outcome rejected;
- duplicate decision rejected;
- missing attribution lineage rejected;
- post-decision policy registration rejected;
- parameter mutation rejected;
- outcome-selected rule rejected;
- deterministic exposure mapping for deep/shallow/no drawdown;
- input order cannot change replay identity.

## Why this is L3, not L4

The executable PIT transform is feasible and reproducible.

It does not prove a de-risking edge.

L4 still requires:
- prospective/OOS path evidence;
- fixed-risk and exposure-matched controls;
- turnover/cost accounting;
- missed-rebound opportunity cost;
- multiple independent dates/episodes;
- no outcome-selected threshold.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
