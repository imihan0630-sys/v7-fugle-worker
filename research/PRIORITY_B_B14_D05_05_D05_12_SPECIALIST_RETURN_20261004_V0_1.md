# Priority-B B14 Specialist Return — D05-05 OFI vs D05-12 Adverse Selection / Toxicity

Updated: 2026-10-04 Asia/Taipei  
Room: 04｜波動與市場微結構研究室  
Pair: B14 — D05-05 vs D05-12  
Status: SPECIALIST_RETURN_COMPLETE  
Formal Core impact: NONE

## 1. Semantic ownership table

| Dimension | D05-05 OFI | D05-12 Adverse Selection / Toxicity |
|---|---|---|
| Core object | observable signed order-flow / pressure imbalance | execution-conditional risk that fills are followed by unfavorable price movement; broader toxicity hypothesis |
| Primary unit | market/event/bucket pressure state | fill/event conditional markout or liquidity-provider loss state |
| Actor intent | NOT inferred | NOT inferred |
| Needs own fills | no, for market pressure study | yes for execution-conditional adverse-selection study |
| Can exist without toxicity | YES | n/a |
| Can toxicity exist at same OFI | YES, depending on price response/fill context | YES |
| Default role | observable microstructure input/state | latent mechanism/risk interpretation supported by additional observables |

D05-05 owns the observable primitive.
D05-12 owns the incremental mechanism/risk question conditional on more than OFI.

## 2. Source / clock / universe / unit-of-analysis table

D05-05:
- prospective books/trades or bounded snapshot-pressure proxy;
- provider/event timestamps;
- symbol-session/bucket identity;
- reconnect/coverage state;
- no requirement for own-order identity.

D05-12:
- inherits D05-05 market-pressure primitives where valid;
- additionally requires own fill side/time, passive/aggressive state, post-fill midquote path, spread, local volatility, activity, market/sector move and execution mechanism;
- toxicity labels require exact post-fill horizon clock and common support.

Historical current-page reconstruction is not promotion-grade for either lane.

## 3. Shared vs unique observables

Shared:
- trade pressure / classified signed volume where valid;
- book pressure proxy;
- spread;
- depth;
- local volatility;
- activity/event intensity;
- session/mechanism state.

Unique to D05-05:
- pressure magnitude/sign/state itself;
- pressure-to-price-response as market-state analysis;
- persistence / no-progress state without requiring an own fill.

Unique to D05-12:
- passive/aggressive fill identity;
- signed post-fill markout;
- fill-conditioned adverse movement;
- matched/no-fill or alternative controls;
- market/sector-adjusted markout;
- liquidity-provider loss interpretation.

## 4. Decision-role comparison

D05-05:
- market microstructure state;
- price-formation / breakout-path context;
- possible execution context.

D05-12:
- execution-risk / adverse-selection context;
- potential liquidity-provision quality diagnostic;
- NOT an independent order-flow direction vote.

Neither is automatically a BUY/SELL signal.

## 5. Divergent-state examples

### Same OFI, different toxicity A
Two windows show the same positive pressure proxy.
- Window 1: passive sell fills are followed by continued price rise against the seller => adverse markout high.
- Window 2: price mean-reverts after the same pressure and passive sell fills do not suffer => adverse markout low.

Same D05-05 pressure; different D05-12 outcome.

### Same OFI, different toxicity B
Identical imbalance occurs:
- once during a broad sector/news shock;
- once in an otherwise quiet market with no common-market move.
Raw OFI can match; residual adverse-selection interpretation differs after market/sector controls.

### Different OFI, similar adverse-selection outcome
A small but information-rich fill can have an adverse markout even when aggregate bucket imbalance is modest, while a large mechanical rebalance can create extreme OFI without comparable residual adverse markout.

Therefore D05-12 is not algebraically or semantically reducible to D05-05.

## 6. Identifiability / alternative mechanisms

OFI or one-sided flow can reflect:
- liquidity demand;
- inventory rebalancing;
- order splitting;
- index/ETF/passive flow;
- event/news response;
- hedging;
- mechanical closing/opening auction demand.

These are alternative mechanisms to informed-trading/toxicity stories.

VPIN-style toxicity is explicitly NOT imported as a ready factor. Activity/volatility/trade-classification confounds remain mandatory controls.

If D05-12 cannot beat:
- activity;
- local volatility;
- spread/depth;
- market/sector movement;
- execution type;
then classify the result as a liquidity/activity proxy, not toxicity.

## 7. Replay requirements

D05-05:
- exact source timestamp;
- reconnect segmentation;
- books/trades completeness semantics;
- snapshotDeltaPressureProxy label unless true event completeness is proven;
- common-support buckets.

D05-12:
- all D05-05 requirements where pressure is used;
- own-order/fill lifecycle;
- fill-side sign;
- post-fill midquote horizon;
- passive/aggressive state;
- exact mechanism state;
- market/sector control state;
- no future label in parent fingerprint.

## 8. Redundancy / anti-double-count rule

One order-flow primitive creates one evidence receipt.

Downstream D05-12 may reference that receipt but cannot add:
- OFI positive = one vote;
- "toxicity" positive derived only from the same OFI = a second vote.

D05-12 creates distinct evidence only when its residual fill-conditioned markout / adverse-selection test adds information beyond D05-05 and simpler liquidity/activity controls.

If the only implemented D05-12 observable remains OFI/volume imbalance, D05-12 must be narrowed or merged rather than preserved as a narrative duplicate.

## 9. Capability preservation

Keep D05-05 because:
- market pressure/price formation exists even without our own orders/fills;
- it supports microstructure state research.

Keep D05-12 because:
- own-fill adverse markout and liquidity-provider risk is a distinct execution question;
- it needs different clock/data/controls.

Removing either would orphan a real capability.

## 10. Terminal classification

`KEEP_SEPARATE / OBSERVABLE_INPUT_VS_LATENT_MECHANISM`

with mandatory:
`SCOPE_DEDUP_ONLY` at the shared order-flow primitive.

Merge eligibility is NOT met.

No module retirement.
No maturity transfer.
No Formal Core change.
