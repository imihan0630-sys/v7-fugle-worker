# D02 PVE-285 — D14 cost-quality dependency request for D02-11

Date: 2026-10-08 Asia/Taipei
Status: CROSS_ROOM_DEPENDENCY_REQUEST / OUTCOME_BLIND / NO_FORMAL_CHANGE

Requester: 02｜價量研究室
Cost/execution owner: 10｜投組風控與交易執行研究室 / D14
Consumer: D02-11 LIQUIDITY_COUNTERFACTUAL

## Why this dependency is different

PVE-283 deliberately left D02-11 as the only EffectTarget shell still BLOCKED at the primary utility metric/horizon stage.

The D02-11 question is not merely whether rejected stocks later rise.
It asks whether liquidity admission/rejection improves a decision after execution friction and opportunity cost are respected.

Therefore D02 cannot honestly freeze a utility weight or cost threshold while commission/slippage provenance is UNKNOWN.

## Required cost-quality receipt

Return a versioned, PIT-valid receipt covering, where evidenced:
- owner/broker commission schedule provenance;
- discounts;
- minimum fee;
- rounding;
- channel differences;
- regular-lot vs odd-lot semantics;
- statutory transaction-tax rule/version;
- broker-confirmed fills/order lifecycle;
- realized slippage / implementation shortfall state;
- opportunity-cost definition;
- ACTUAL / PARTIAL_ACTUAL / MODELED / UNKNOWN quality labels;
- asOf / knownAt;
- immutable receipt hash.

## Fail-closed rule

If owner-specific commission or broker-confirmed fill/slippage evidence is absent:
return UNKNOWN_BLOCKED for that component.

Forbidden:
- UNKNOWN commission = 0;
- UNKNOWN slippage = 0;
- generic internet fee schedule treated as owner actual;
- close price treated as actual fill;
- universal fixed slippage invented by D02.

D02 will consume the receipt only to freeze the D02-11 primary utility metric/horizon and later numerical target rationale.
D14 retains execution-cost ownership.

No outcome access. No maturity promotion. Formal Core unchanged.
