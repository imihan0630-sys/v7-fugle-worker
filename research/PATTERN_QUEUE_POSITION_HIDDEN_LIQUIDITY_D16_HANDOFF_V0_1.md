# D01 DL-055 — D16 Queue Position / Hidden Liquidity Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes structural-zone / opportunity semantics.
D05 owns queue/fill/latency/hidden-liquidity primitives.
D16 owns future inference.

Question:
Does structural-zone response remain after realistic execution and hidden-liquidity explanations are separated?

## 2. Four estimands

Keep separate:
- structural directional response;
- executable price quality;
- passive fill feasibility;
- hidden-liquidity mechanism compatibility.

No estimand implies another.

## 3. Fill hierarchy

Report:
- NOT_REACHED;
- TOUCHED_NOT_ENOUGH_EVIDENCE;
- TRADED_AT_PRICE_QUEUE_UNRESOLVED;
- TRADED_THROUGH_CONSERVATIVE_FILL_CANDIDATE;
- OWN_ORDER_FILL_VERIFIED.

Never convert candle-low touch into verified fill.

## 4. Queue-position boundary

Without individual order IDs and complete event sequencing:
use QUEUE_AHEAD_PROXY only.

Exact hypothetical queue rank is not identified.

## 5. Latency

Separate:
- market-data age;
- observation-to-decision latency;
- decision-to-order latency;
- quote staleness.

Latency is execution context, not stock-selection alpha.

## 6. Hidden liquidity

Separate:
- PUBLIC_DEPTH_SUFFICIENT;
- HIDDEN_LIQUIDITY_COMPATIBLE;
- OWNER_VERIFIED_HIDDEN_LIQUIDITY;
- NOT_IDENTIFIABLE.

A repeated-fill/replenishment pattern is not confirmed iceberg evidence by itself.

## 7. Generic comparator

G0:
matched queue/fill/latency/hidden-liquidity context at non-structural or salient control locations.

G1:
same execution context at frozen structural zones.

If G1 adds no residual representation, generic execution mechanics are sufficient.

## 8. Future ladder

R0 raw zone response.
R1 DL-054 persistence controlled.
R2 executable-price controlled.
R3 queue-ahead proxy controlled.
R4 fill-feasibility separated.
R5 latency controlled.
R6 public-vs-hidden liquidity separated.
R7 generic execution advantage controlled.
R8 structural residual candidate.
R9 own-order or independent replication.

## 9. Common support

Require overlap in tick tier, matching mechanism, spread, depth, transaction intensity, queue proxy, latency, liquidity/volatility regime and prior DL-052/053/054 states.

## 10. Timing

Trades, fill verification, queue depletion and hidden-liquidity patterns learned after predictorFreezeAt are post-treatment execution evidence.

They cannot become baseline predictors.

## 11. Audit boundary

SDA-001 / SDA-002 remain open.
Multiple execution receipts do not multiply independent N.

## 12. Promotion boundary

No result changes Formal ranking, Top6, weights, capital, thresholds or runtime.

Formal Core remains LOCKED.
