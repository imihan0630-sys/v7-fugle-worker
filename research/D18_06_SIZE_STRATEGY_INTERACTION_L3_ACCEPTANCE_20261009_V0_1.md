# D18-06 Large/Small Leadership × Strategy L3 Acceptance — 2026-10-09 V0.1

Updated: 2026-10-09 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Producer: D09-08 Large-cap vs Small-cap Leadership
Formal Core impact: NONE
System2 live-policy impact: NONE

## Scope

D18-06 advances from L2/40 to L3/60 at Taiwan PIT data-feasibility maturity.

This acceptance does NOT construct a second market-cap/share-denominator authority.

Instead, D18-06 consumes the already-L3 D09-08 official Taiwan size-leadership producer and validates a deterministic strategy-interaction frame.

Producer-consumer separation:
- D09-08 owns official Taiwan size-leadership state;
- D18-06 owns strategy interaction with that frozen state;
- D11/corporate-action research remains owner of constituent-level effective-share denominator vintage;
- D18-06 does not rebuild historical constituents or effective market cap.

## Real producer evidence

The executable test consumes:
`research/br037_size_leadership_receipt_20261001_v0_1.json`.

That receipt is:
- official TWSE;
- outcome blind;
- common total-return-index basis across Taiwan 50 / Mid-Cap 100 / Small-Cap 300;
- captured with explicit timestamp;
- future stock outcomes closed;
- Formal Core unchanged.

A second independent common-complete official TRI date exists:
`research/BR078_D09_08_SECOND_COMMON_COMPLETE_SIZE_TRI_DATE_20261008_V0_1.md`.

Independent-date N remains small and is not used to claim policy value.

## Executable consumer

Implementation:
`research/d18_06_size_strategy_interaction_l3_v0_1.mjs`.

Test:
`tests/test_d18_06_size_strategy_interaction_l3_v0_1.mjs`.

Workflow:
`Research D18-06 Size Strategy L3 Readonly`.

Accepted head:
`c28d77f8786e4597cb3c4f622d124f207de47051`.

Targeted workflow:
- run `37909652966`: SUCCESS;
- 14/14 targeted tests PASS;
- research-only isolation PASS.

Same-head V8 Regression:
- run `37909653031`: SUCCESS.

## Frozen interaction semantics

The consumer requires:
- Taiwan strategy-day identity;
- D09-08 receipt identity/version;
- official TWSE source authority;
- capturedAt <= strategy decision timestamp;
- producer trade date <= strategy market date;
- all three large/mid/small TRI legs;
- frozen horizon among D1/D5/D20/D60;
- outcome-blind producer state;
- no future stock outcomes opened.

It freezes:
- producer content hash;
- producer blob identity when supplied;
- strategy identity/hash;
- horizon-specific size state;
- total-return-index common basis.

Changing producer values or strategy identity changes the interaction frame hash.

## Critical counterevidence preserved

D1 and D5 can show different size leadership on the same producer date.

Therefore:
`SIZE_STATE != UNIVERSAL_RISK_ON_OFF_STATE`.

The consumer explicitly freezes:
- permanentRiskOnLabelAssigned=false;
- policyActionApplied=false;
- policyValueEvaluated=false.

Missing/late/non-comparable producer evidence becomes DATA_UNKNOWN or rejection.
No price-index splice, missing-leg carry-forward, or zero fill is allowed.

## L3 promotion gate

1. executable/tested data builder: PASS;
2. source/version/availableAt provenance: PASS through the official D09-08 producer receipt;
3. deterministic replay: PASS;
4. UNKNOWN/failure fail-closed: PASS;
5. no current-data historical backfill: PASS;
6. source coverage audited at producer scope: PASS.

## Why S0/S1 market-cap work remains useful

Earlier D18-06 S0/S1 contracts are not discarded.

They remain the correct future path for:
- constituent-level size attribution;
- security-level market-cap membership;
- effective share-denominator analysis;
- liquidity/sector composition controls.

They are no longer required merely to establish L3 feasibility of a market-level size-state × strategy interaction when an official D09-08 producer already exists.

## Why not L4

No strategy-value claim exists.

L4 still requires:
- preregistered size-state policy/interaction;
- prospective or untouched chronological outcomes;
- multiple independent dates and size-state episodes;
- sector/liquidity/price-limit/breadth/concentration controls;
- same strategy/cost/execution semantics;
- static baseline and appropriate exposure-matched control;
- no single episode/date dominance.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core remains LOCKED.
