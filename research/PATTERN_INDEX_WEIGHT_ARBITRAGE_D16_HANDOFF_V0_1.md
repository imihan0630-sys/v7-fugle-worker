# D01 DL-061 — D16 Index-Weight / Passive / Arbitrage Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes attribution semantics.
D16 owns future residual/common-support inference.

Future structural-response evidence must distinguish:
- self-included benchmark circularity;
- index-weight mechanics;
- scheduled passive/rebalance effects;
- ETF primary-market modeled exposure;
- verified passive/AP execution;
- ETF/futures price discovery;
- constituent comovement;
- mega-cap concentration.

## 2. Self-inclusion

A raw cap-weighted market/sector index containing the target stock is partially endogenous.

Do not treat it as an independent external control unless:
- a canonical self-excluded benchmark receipt exists, or
- the benchmark owner provides an equivalent mechanically decontaminated control.

Do not create an ad-hoc ex-self return inside D01.

## 3. Owner receipts

Consume:
- D06-11 passive/rebalance;
- D06-16 ETF mechanics;
- D11-14 index-event clock;
- D19-15 benchmark methodology/weight vintage;
- D12 derivative price-discovery context;
- D18 large-cap/leadership context.

Unknown remains UNKNOWN.

## 4. Modeled vs actual

Modeled basket exposure != actual AP execution.

Report separately:
- MODELED_PRIMARY_BASKET_EXPOSURE;
- ACTUAL_PASSIVE_EXECUTION_VERIFIED;
- ACTUAL_CONSTITUENT_EXECUTION_VERIFIED;
- EXECUTION_UNKNOWN.

## 5. Future ladder

M0 raw zone response;
M1-M4 inherit DL057-DL060 controls;
M5 identify self-included benchmark;
M6 control verified self-excluded benchmark;
M7 control passive/rebalance;
M8 control ETF primary-market context;
M9 control ETF/futures arbitrage;
M10 control mega-cap concentration/breadth;
M11 generic mechanical-event comparator;
M12 structural residual candidate;
M13 multi-date/multi-symbol/multi-index replication.

## 6. Generic comparator

Compare the same mechanical event:
- away from a valid zone;
- at a valid zone.

If the zone adds no residual response after mechanical context:
MECHANICAL_CONTEXT_SUFFICIENT.

## 7. Dependence

Different instruments are not automatically independent evidence.

Index, ETF, futures and target stock can be linked by:
- common information;
- basket identity;
- passive flows;
- arbitrage;
- common PRICE_OHLC ancestry.

SDA-001 remains open.

## 8. Timing

Every receipt needs knownAt <= predictorFreezeAt.

Current composition/weights may not backfill historical dates.

SDA-002 remains open.

## 9. Promotion boundary

No ranking, gating, Top6, weight, threshold, capital or runtime change is authorized.

Formal Core remains LOCKED.
