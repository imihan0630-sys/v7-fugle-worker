# Institutional / Crowding Research

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## IC-001 — scope
Institutional flow is not automatically informed demand. Foreign/dealer/trust activity can represent directional conviction, passive/index flow, hedging, liquidity provision, arbitrage or inventory management.

Research question: after existing price/volume/trend/sector controls, do PIT institutional/crowding states add incremental information for after-market selection quality?

## IC-002 — actor separation
Never collapse:
- foreign investors;
- investment trusts;
- dealers;
- dealer proprietary vs hedge where source semantics allow;
- margin financing;
- securities borrowing / actual SBL short sale.

A combined "institutional net buy" can cancel economically different mechanisms.

## IC-003 — flow vs stock
Separate daily FLOW from POSITION/STOCK:
- cash net buy/sell = flow;
- futures/options OI = stock/exposure;
- margin balance/SBL balance = stock;
- daily margin/SBL changes = flow.

Raw levels need normalization by liquidity/free-float/market cap where PIT denominator exists. If denominator provenance is unavailable, keep raw evidence descriptive rather than fabricate normalized history.

## IC-004 — existing data audit
The project already has an official TWSE/TPEx institution synchronization path and research evidence for TWSE margin/SBL.
Important limitations:
- TPEX SBL is currently UNKNOWN in V8.7.11 research evidence;
- one-day SBL is RAW_DAILY_ONLY_NO_CONTIGUOUS_HISTORY and must not be labeled 5/20/60-day shorting flow;
- source-date/PIT guards already exist and must be preserved;
- current monthly snapshots cannot backfill historical first-known time.

Therefore market-source parity is a first-class falsification gate.

## IC-005 — candidate mechanisms
Pre-register before outcomes:
A. persistent same-actor cash flow (requires contiguous PIT history);
B. actor divergence: foreign vs trust vs dealer;
C. price-flow divergence: price strength with institutional selling, or weakness with accumulation;
D. crowding/overownership proxy only where denominator provenance exists;
E. margin/SBL pressure and unwind;
F. cash-vs-futures foreign exposure jointly with derivatives lane.

No universal "foreign buy = bullish" threshold is authorized.

## IC-006 — redundancy order
Validation order:
1. price trend / residual sector RS;
2. volume/liquidity;
3. existing Formal institutional condition;
4. market regime/breadth;
5. candidate institutional/crowding feature.

If the candidate adds no incremental information beyond existing institutional condition or price-volume reaction, mark REDUNDANT.

## IC-007 — falsification
Mandatory negative controls:
- actor-label shuffle within date;
- date-shift placebo;
- remove index-rebalance/passive-flow dates where identifiable;
- same-day cross-sectional rank rather than raw market-wide flow;
- TWSE-only vs TPEx-covered samples separately;
- crisis/event-date removal;
- independent scan-date aggregation.

Reject/downgrade if:
- effect is entirely price momentum;
- one institution actor/date cluster drives it;
- TPEx UNKNOWNs are silently treated as zero;
- raw net shares merely proxy stock size/liquidity;
- normalization uses future share denominator;
- passive/index flow explains the result.

## IC-008 — optimization bridge
Potential after-market optimization is not "require more institutional buying".
A candidate may be proposed only if a specific actor/state improves incremental selection quality or downside control beyond the existing Formal institutional rule and survives PIT/source-parity, passive-flow, redundancy, date-cluster and cost gates.

Possible future behavior:
- evidence/context annotation;
- tie-breaker among otherwise equivalent plans;
- only later, if strong evidence, a Formal condition adjustment.

Current status: FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.


## IC-009 — persistence requires a trading-session continuity proof

"Foreign bought 3 days in a row" is not valid from three rows unless those rows are the immediately preceding official trading sessions and each source is complete.

Required receipt:
- expectedSessions;
- observedSessions;
- missingSessions;
- sourceMarket;
- sourceDate/knownAt;
- provider completeness;
- actor field schema version.

Any missing expected session => persistence UNKNOWN, not false and not zero.

## IC-010 — reaction may be more informative than flow magnitude

Institutional flow should be tested jointly with price response.

Frozen descriptive cells:
- BUY_FLOW + PRICE_UP = aligned demand;
- BUY_FLOW + PRICE_FLAT/DOWN = possible absorption/distribution disagreement;
- SELL_FLOW + PRICE_UP = possible resilient demand / passive sell absorption;
- SELL_FLOW + PRICE_DOWN = aligned risk-off.

These are hypotheses, not labels of motive. Motive remains UNKNOWN without evidence.

Incremental test should ask whether flow-response interaction adds beyond price/volume alone. If not, reject the flow feature as redundant.

## IC-011 — crowding has two-sided risk

Persistent institutional ownership/flow can support continuation but can also create crowded-exit risk. Therefore crowding cannot be encoded as monotonic bullish evidence.

Prospective targets must include:
- continuation return;
- downside MAE/drawdown;
- liquidity deterioration;
- reversal after flow cessation.

A useful crowding feature may be a risk flag rather than a rank booster.

## IC-012 — first evidence gate

Before outcome testing:
1. prove contiguous multi-session official actor-flow history for both TWSE and TPEx or explicitly stratify markets;
2. preserve source schemas and PIT clocks;
3. identify passive/index rebalance dates or mark contamination UNKNOWN;
4. verify denominator provenance before any size-normalized flow.

Until then, one-day official flows are descriptive evidence only.

Status: DATA_FEASIBILITY_PARTIAL / MULTI_SESSION_PARITY_NOT_YET_PROVEN.
