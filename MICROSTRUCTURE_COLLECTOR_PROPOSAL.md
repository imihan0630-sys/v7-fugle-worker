# Microstructure Collector Proposal｜市場微結構研究擷取器提案

Status: PROPOSAL ONLY — NO CODE / NO DEPLOYMENT
Classification: Class B infrastructure proposal
Prepared: 2026-09-25 Asia/Taipei

## Objective

建立一個與正式 `fugle-test` 交易監控完全隔離的研究擷取器，前瞻收集 Fugle books/trades 微結構資料，用於驗證：
- spread / depth 的同時段標準化；
- pressure-to-price response；
- liquidity replenishment / resiliency；
- transaction intensity；
- transient vs retained price impact；
- failed breakout / execution-alpha diagnostics。

不得改變 Formal selection、A/B、3+3+3、BUY、maxChase、stop、capital、monitoring、push。

## Why a separate collector is required

Existing V8.8.1 recorder:
- already captures useful spread/depth snapshots;
- is event-sparse (open / first 10m / 15m / 30m / signal);
- current read contract cannot prove exhaustive target-date coverage;
- cannot reconstruct seconds-scale replenishment or true event-level OFI.

Adding high-frequency Fugle calls into the Formal monitoring path would create avoidable shared quota, latency, rate-limit and failure coupling.

## Data source

Preferred:
- Fugle WebSocket `books`
- Fugle WebSocket `trades`

Official current plan facts:
- Basic: 5 subscriptions / 1 connection.
- Developer: 300 subscriptions / 2 connections.
- Advanced: 2000 subscriptions / 2 connections.
- One subscription = 1 symbol x 1 channel.

The actual MarketData plan attached to the current API key is UNKNOWN and must be verified before activation.

## Pilot cohort

Do not start with the full market.

Phase P0:
- 1–2 symbols only;
- deliberately include at least one high-liquidity and, if available, one thousand-dollar / different tick-band name;
- capture books+trades;
- compare 1s / 5s / 15s aggregations from the same source events;
- choose cadence using state-reconstruction fidelity and data quality only, not return outcomes.

Phase P1:
- expand to the bounded monitored research cohort only after quota/storage measurements are known.

Do not automatically include AIDEEN_APP or all Shadow candidates; each pool expansion changes the research population and quota budget.

## Isolation contract

The collector must satisfy all:

1. Separate entrypoint/runtime from Formal monitoring.
2. Formal code never calls collector synchronously.
3. Collector never writes Formal KV keys/tables.
4. Collector failure cannot prevent monitor, signal, push or selection.
5. No Formal API reads collector state.
6. Separate health/readback for research data.
7. Separate version/schema provenance.
8. No hidden fallback from missing research data to BAD/0.
9. No historical microstructure fabrication.
10. Research data can be deleted/disabled without changing trading behavior.

## Proposed bucket contract

Identity:
- tradeDate, symbol, bucketStart, bucketEnd
- collectorVersion, schemaVersion, source

Coverage:
- expectedMs, connectedMs, coverageRatio
- bookMessageCount, tradeMessageCount
- reconnectCount
- coverageState
- firstProviderTime, lastProviderTime

Price/liquidity:
- midOpen/Close/High/Low
- spreadTicks Open/Close/Min/Max
- spreadBps Open/Close/Min/Max
- weightedMidProxy Open/Close
- bid/ask depth1 and depth5 states

Dynamics:
- bid/ask depletion proxies
- bid/ask replenishment proxies
- price-step counts
- spread widen/narrow counts
- transaction count/volume
- at-bid / at-ask / unclassified pressure proxies
- pressureToPriceResponse

Guards:
- trial/continuous
- limit up/down
- delayed/limit-halt flags
- oddLot false for V1

## Storage design

Do not assume D1 raw-event persistence.

Pilot:
- retain raw events only for short diagnostic windows if necessary;
- write aggregated buckets to isolated research storage;
- measure actual bytes/row and index overhead.

Illustrative fixed-bucket rows for 6 symbols:
- 1s: 97,200/day
- 5s: 19,440/day
- 15s: 6,480/day

Before scaling, record:
- rows/day
- bytes/day
- write operations/day
- read amplification
- missing/reconnect rate
- quota/subscription usage

## Cloudflare architecture options

### Option A — separate Worker + WebSocket client
Pros:
- strongest separation from Formal code.
Cons:
- long-lived outbound connection lifecycle/cost/reconnect behavior must be verified.

### Option B — separate Worker + Durable Object client
Pros:
- stateful coordination and reconnect bookkeeping.
Cons:
- outbound WebSocket does not use server-side hibernation; lifecycle/cost semantics need measurement.
- new binding/infrastructure makes this Class B.

### Option C — external research collector
Pros:
- completely removes high-frequency collection load from Formal Cloudflare runtime.
Cons:
- another deployment/secret/ops surface.

No option is selected yet. Choose only after API plan/quota and runtime-cost measurements.

## Fidelity pilot

From the same raw captured event stream, construct:
- 1s buckets
- 5s buckets
- 15s buckets

Compare without future returns:
- pressure-state agreement
- replenishment-state agreement
- spread-stress state agreement
- depth-imbalance sign/state agreement
- detected price-step agreement
- coverage robustness

Select the coarsest cadence that retains acceptable state classification fidelity according to a pre-set engineering criterion.

## Go / no-go gate

GO to broader Shadow data collection only if:
- actual Fugle subscription quota supports cohort;
- collector is isolated from Formal;
- reconnect/coverage metadata work;
- measured storage/write burden is acceptable;
- 5s or 15s aggregation preserves required state well enough, OR a narrowly scoped 1s mode is justified.

NO-GO if:
- Basic quota prevents needed channels and no approved upgrade exists;
- collector must share Formal critical path;
- data gaps cannot be detected;
- storage/runtime burden is disproportionate;
- top-five data cannot support stable state definitions.

## Promotion boundary

Even a successful collector and strong Shadow evidence do NOT change Formal behavior automatically.

Any future use in:
- candidate eligibility/ranking,
- 15m BUY gating,
- maxChase,
- sizing/capital,
- stop/reduce/add,
- monitoring eligibility,
- push,
is Class C and requires owner strategy approval plus regression/OOS evidence.

## Exact next engineering step if owner later approves infrastructure work

1. Verify actual Fugle MarketData plan/quota.
2. Choose isolated runtime option.
3. Create rollback point/branch.
4. Implement P0 only for 1–2 symbols.
5. Add data-quality tests before outcome tests.
6. Run fidelity pilot.
7. Report measured quota/storage/runtime burden.
8. Stop before broader scale or Formal integration unless separately approved.
