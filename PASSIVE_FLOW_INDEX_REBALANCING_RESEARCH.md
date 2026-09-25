# Passive Flow & Index Rebalancing Research

Status: RESEARCH_ONLY / CONCEPT_BUILD / Formal Core LOCKED
Updated: 2026-09-25 Asia/Taipei

## Scope

This lane studies non-fundamental demand/supply created by:
- index constituent additions/deletions;
- index weight changes;
- passive index-fund / ETF benchmark rebalancing;
- closing-auction benchmark execution;
- index-review announcement/effective windows;
- passive-flow interaction with foreign institutional trades;
- temporary price pressure versus persistent information/liquidity effects.

It is distinct from:
- Market Breadth / Sector Rotation;
- Institutional cash-flow signals;
- Price-Volume acceptance;
- Market Microstructure;
- Derivatives expiry;
- Fundamental information.

No field in this lane changes Formal selection/ranking/BUY/ADD/REDUCE/SELL/stop/capital/push without explicit owner approval.

---

## PF-001 — Index event and company information are different causal channels

A stock can move because:
1. new information changes expected cash flows;
2. an index rule mechanically changes benchmark demand;
3. both happen together.

Index addition/deletion is therefore not automatically fundamental information.

Research must separate:
- FUNDAMENTAL_EVENT
- INDEX_MEMBERSHIP_EVENT
- INDEX_WEIGHT_EVENT
- PASSIVE_FLOW_EVENT
- MULTIPLE_EVENT
- UNKNOWN.

Status: CAUSAL-CHANNEL DISTINCTION FROZEN.

---

## PF-002 — Announcement day and effective day are separate event clocks

Index reviews usually create at least:
- announcement/review-result date;
- implementation/effective date;
- sometimes close-of-effective-date execution.

Taiwan MSCI literature documents material activity in both windows.

Sources:
- Hung & Shiu (2016), Journal of Multinational Financial Management 36, 49–63.
- Tseng & Pan (2024), International Review of Economics & Finance 92, 563–580.

### Rule
Do not use:
`indexEventDate`
as one undifferentiated timestamp.

Store:
- announcedAt
- effectiveAt
- effectiveCloseFlag
- firstKnownAt
- eventVersion.

Status: TWO-CLOCK EVENT MODEL FROZEN.

---

## PF-003 — Taiwan evidence directly supports benchmark-driven foreign trading

Tseng & Pan (2024) use TWSE order-submission data and classify foreign investors as:
- indexers;
- quasi-indexers;
- non-indexers.

They find:
- foreign investors buy additions and sell deletions more than individuals during the event period;
- indexers cluster rebalancing around the effective day;
- non-indexers spread activity earlier;
- additions receive aggressive buy orders from indexers and non-indexers;
- indexers aggressively sell deletions near the effective window.

### System implication
“Foreign buying” around an index addition may reflect benchmark tracking, speculation ahead of benchmark tracking, or both.

It should not automatically be interpreted as independent institutional fundamental conviction.

Status: INDEX-CONDITIONED FOREIGN-FLOW SEMANTICS REQUIRED.

---

## PF-004 — Price/volume effects can be large but are not necessarily permanent

Hung & Shiu (2016), using MSCI Taiwan changes from 1999–2013, report:
- additions had positive abnormal returns around announcement/implementation;
- deletions had negative abnormal returns;
- excess trading volume rose materially around event dates;
- deletion prices later showed substantial reversal over longer horizons.

### Competing mechanisms
- temporary price pressure from forced demand/supply;
- improved awareness;
- liquidity changes;
- information/certification effects;
- anticipation/speculation.

### Rule
No universal:
`INDEX_ADDED = BULLISH`
or
`INDEX_DELETED = BEARISH`.

Status: TEMPORARY/PERSISTENT EFFECT MUST BE EMPIRICALLY SEPARATED.

---

## PF-005 — Closing-auction concentration is especially relevant in Taiwan

Current TWSE regular trading:
- continuous matching through 13:25;
- closing call auction 13:25–13:30.

Index funds tracking closing benchmark prices may concentrate execution near the close/effective auction.

Source:
- TWSE trading mechanism:
  https://www.twse.com.tw/en/products/system/trading.html

### Research fields
- preCloseVolumeShare
- closingAuctionVolumeShare
- closePriceDisplacement
- closeToNextOpenReturn
- nextSessionReversal
- effectiveDateFlag.

### Guard
Current historical OHLCV cannot reconstruct closing-auction-only volume unless an appropriate intraday/event source exists.

Status: CLOSE-AUCTION STATE REQUIRES PROSPECTIVE/INTRADAY EVIDENCE.

---

## PF-006 — Expiry effects are a confounder, not passive-rebalance evidence

Taiwan research on MSCI-TW futures expiration finds:
- high volume and volatility around expiration;
- effects concentrated in the last minutes;
- mild price reversal;
- stronger effects in high-weight stocks.

Source:
- Hsieh (2009), Journal of Futures Markets 29, 920–945.
- DOI: 10.1002/fut.20391

### Consequence
A closing-volume spike on an index-review date may be confounded by:
- futures/options expiry;
- passive benchmark rebalance;
- both.

Store:
- indexRebalanceFlag
- derivativesExpiryFlag
- overlapFlag.

Do not attribute close-auction distortion to one cause without controls.

Status: EXPIRY/REBALANCE CONFOUNDING GUARD FROZEN.

---

## PF-007 — Constituent changes and weight changes are different

Passive funds trade not only when a stock enters/exits.

Flows can be induced by:
- free-float adjustment;
- shares outstanding changes;
- foreign inclusion factor changes;
- cap/buffer methodology;
- index migration;
- stock corporate actions;
- index methodology changes.

### Research taxonomy
- ADD
- DELETE
- WEIGHT_UP
- WEIGHT_DOWN
- CORPORATE_ACTION_REWEIGHT
- METHODOLOGY_CHANGE
- UNKNOWN.

Status: MEMBERSHIP ≠ WEIGHT CHANGE.

---

## PF-008 — Estimated passive flow is uncertain

Simple conceptual estimate:
`estimatedFlowNTD ≈ trackerAUM × changeInIndexWeight`

But true flow differs because:
- not all benchmarked AUM is passive;
- tracker holdings differ;
- derivatives may be used;
- active funds may benchmark but not replicate;
- ETF creations/redemptions change AUM;
- index announcements can be front-run;
- execution can occur before/after effective close.

### Naming
Use:
`passiveFlowProxy`
not:
`actualPassiveFlow`
unless actual fund holdings/trades are known.

Status: FLOW ESTIMATE MUST CARRY UNCERTAINTY.

---

## PF-009 — ETF AUM makes local benchmark pressure economically relevant

TWSE's official ETF platform publishes:
- active/passive classification;
- benchmark;
- AUM;
- trading statistics.

Source:
- https://www.twse.com.tw/en/ETFortune-institute/products

### Potential research use
For Taiwan-listed passive equity ETFs:
- map benchmark index;
- point-in-time AUM;
- estimate benchmark-linked local flow exposure.

### Limit
ETF AUM alone misses:
- offshore MSCI/FTSE trackers;
- index mutual funds;
- derivatives;
- active benchmark-aware portfolios.

Therefore local ETF AUM is a lower-bound/context proxy, not total benchmarked capital.

Status: LOCAL ETF AUM = PARTIAL PASSIVE-CAPITAL PROXY.

---

## PF-010 — Index concentration changes impact across names

Current MSCI Taiwan Index is highly concentrated; MSCI's June 30, 2026 data show TSMC represents more than half of the index.

Source:
- MSCI Taiwan Index official page:
  https://www.msci.com/indexes/index/915800

### Implication
A weight change in a very large constituent can create much larger aggregate benchmark turnover than an equal percentage-point change in a small name.

### Guard
Do not transfer current concentration backward historically.
Use event-date index weights.

Status: EVENT-DATE WEIGHT REQUIRED.

---

## PF-011 — Rebalance-driven volume can contaminate breakout-volume interpretation

Suppose:
- price breaks a technical level;
- volume = 3× normal;
- foreign institutions buy strongly.

Normally this may support A/B breakout quality.

But if it occurs on an index addition/effective date:
- volume may be mechanically benchmark-driven;
- foreign buying may be forced;
- the next-day follow-through process can differ.

### Research integration
Price-Volume owns participation/acceptance.
Passive Flow owns:
- why participation may be benchmark-mechanical.

Potential context:
`pvParticipationState x passiveFlowEventState`

No duplicate score.

Status: REBALANCE GUARD FOR PV INTERPRETATION CANDIDATE.

---

## PF-012 — Mechanical buying can still create real price impact

Calling flow “mechanical” does not mean it is irrelevant.

Passive demand can:
- consume liquidity;
- shift clearing price;
- create temporary scarcity;
- attract anticipatory traders;
- alter short-term volatility.

### Counterpoint
If liquidity providers anticipate it, much adjustment can occur before the effective close.

Research should measure:
- announcement-to-effective path;
- effective-close displacement;
- next-session reversal;
- D3/D5 retention.

Status: MECHANICAL FLOW ≠ ZERO PRICE EFFECT.

---

## PF-013 — Anticipatory trading creates a front-running/early-positioning window

Tseng & Pan (2024) find non-indexing foreign traders can spread activity ahead of indexers.

### System implication
Price/volume abnormality before effective date may reflect:
- anticipation of forced passive flow;
- not yet actual passive-fund execution.

States:
- ANNOUNCED_PRE_EFFECTIVE
- EFFECTIVE_MINUS_1
- EFFECTIVE_SESSION
- POST_EFFECTIVE
- NO_EVENT.

Status: EVENT-LIFECYCLE FROZEN.

---

## PF-014 — Addition/deletion asymmetry matters

Taiwan MSCI research shows additions and deletions do not behave as mirror images:
- volume persistence differs;
- deletion reversal can be strong after implementation;
- indexers may prioritize additions differently.

### Rule
Do not model:
`deletion = -addition`.

Separate outcomes and mechanisms.

Status: ASYMMETRIC EVENT MODEL REQUIRED.

---

## PF-015 — Index inclusion probability is dangerous look-ahead unless point-in-time rules/data are frozen

Some changes may be anticipated from:
- market cap;
- free float;
- liquidity;
- buffer rules.

But index providers use proprietary/detailed methodology and cutoff data.

### Research guard
Historical research may use:
- actual announced changes after announcedAt;
- pre-announcement prediction only if methodology, cutoff data and eligibility were genuinely available at that time.

Do not retrospectively label “obvious future additions.”

Status: NO RETROACTIVE INCLUSION-PREDICTION.

---

## PF-016 — Multiple index families can overlap

A stock can simultaneously be affected by:
- MSCI Taiwan / MSCI Global Standard;
- FTSE/TWSE Taiwan 50 or other FTSE Russell indices;
- Taiwan Index Plus / TWSE local indices;
- domestic ETF custom indices;
- sector/theme index rebalances.

### Research fields
- provider
- indexName
- eventType
- announcedAt
- effectiveAt
- oldWeight
- newWeight
- estimatedTrackerExposure
- overlapEventCount.

### Guard
Do not double-count multiple funds that track the same underlying index event as independent signals.

Status: INDEX-EVENT DEDUPLICATION REQUIRED.

---

## PF-017 — Passive ETF creation/redemption is separate from scheduled index rebalance

Even without index constituent changes, ETF net creations/redemptions can require portfolio trading.

Conceptually:
- scheduled index rebalance changes target weights;
- ETF creation/redemption changes fund size.

Both can generate stock trades.

### Data limitation
Without point-in-time ETF units/AUM and portfolio basket data, do not infer stock-level creation/redemption flow precisely.

Status: FUND-SIZE FLOW ≠ INDEX-WEIGHT FLOW.

---

## PF-018 — Closing-price return and next-open return should be separated

For an effective-close event:
- price pressure may peak at closing auction;
- next open may retain or reverse it.

Candidate outcomes:
- preClose→close displacement;
- close→nextOpen;
- nextOpen→D1 close;
- D3/D5 retention;
- MFE/MAE.

### Guard
Corporate actions and overnight news must be controlled.

Status: EFFECTIVE-CLOSE PATH DECOMPOSITION FROZEN.

---

## PF-019 — Institutional-flow lane needs event-conditioned semantics

Existing Formal logic values foreign/investment-trust/main-force continuous buying.

Research question:
Does foreign buying retain the same forward meaning during:
- ordinary sessions;
- index-addition announcement window;
- effective-date passive flow;
- deletion window?

### Hypotheses
H1:
Ordinary foreign accumulation has greater directional information than benchmark-forced foreign accumulation.

Counter:
Index flow can trigger persistence/awareness and remain predictive.

H2:
Effective-date foreign-flow extremes have higher reversal risk after controlling for price-volume acceptance.

Counter:
Strong permanent demand/liquidity improvement can sustain price.

Status: INSTITUTIONAL-FLOW INTERACTION PRE-REGISTERED CONCEPTUALLY.

---

## PF-020 — First non-directional state taxonomy

1. NO_INDEX_EVENT
2. INDEX_ANNOUNCED_ADD
3. INDEX_ANNOUNCED_DELETE
4. INDEX_WEIGHT_UP
5. INDEX_WEIGHT_DOWN
6. PRE_EFFECTIVE_POSITIONING
7. EFFECTIVE_REBALANCE
8. POST_EFFECTIVE_NORMALIZATION
9. MULTI_INDEX_OVERLAP
10. EXPIRY_OVERLAP
11. EVENT_DATA_INCOMPLETE
12. UNKNOWN

No state maps directly to BUY/SELL.

Status: STATE TAXONOMY FROZEN.

---

## PF-021 — First empirical protocol

### Population
All point-in-time Formal selected / Shadow controls that have verified index-event metadata, plus same-date matched non-event controls.

### Primary hypotheses
1. Effective-date abnormal volume is less informative about D1/D3 continuation than ordinary abnormal volume.
2. Effective-close price displacement has higher next-session reversal probability than non-event close displacement.
3. Foreign net buying/selling has different incremental information in index-event windows.
4. Deletions exhibit asymmetric post-effective reversal versus additions.
5. Event intensity rises with weight change / tracker-exposure proxy.
6. Multiple-index overlap creates stronger volume/liquidity distortion.

### Controls
- same market/date;
- sector;
- market cap/liquidity;
- pre-event trend;
- Price-Volume state;
- K-line maturity;
- Residual RS;
- derivatives expiry;
- corporate events;
- attention/disposition;
- overall market/sector move.

### Outcomes
- close displacement;
- next-open reversal/retention;
- D1/D3/D5/D10;
- MFE/MAE;
- false-breakout / stop-first;
- spread/depth where available.

### Anti-bias
- use only index changes known as of announcement timestamp;
- event-date weights, not current weights;
- no hindsight inclusion candidates;
- announcement/effective periods frozen before outcomes;
- separate additions/deletions;
- date-cluster inference.

Status: EMPIRICAL PROTOCOL V1 FROZEN.

---

## PF-022 — Data-source feasibility

### MSCI
Official MSCI index pages provide current constituents/weights, but robust historical review-event research needs archived review announcements/constituent histories with point-in-time dates.

### TWSE / FTSE/TWSE / local ETFs
TWSE provides:
- ETF benchmarks and AUM;
- local index information;
- market data needed for price/volume controls.

### Research data requirement
For each event:
- provider/index;
- announcement timestamp/date;
- effective date;
- constituent action;
- old/new weight if available;
- source/vintage;
- point-in-time public availability.

### Current status
Current repo contains no durable index-event archive or passive-flow event table.

Status: CONCEPT DATA SOURCES EXIST / POINT-IN-TIME EVENT ARCHIVE NOT YET BUILT.

---

## PF-023 — Minimal Shadow schema

- tradeDate
- symbol
- provider
- indexId
- eventType
- announcedAt
- effectiveAt
- eventPhase
- oldWeight
- newWeight
- weightDelta
- localEtfAumExposureProxy
- estimatedPassiveFlowProxy
- passiveFlowQuality
- closingAuctionContext
- derivativesExpiryOverlap
- multiIndexOverlapCount
- eventProvenance
- unknownReasons
- researchOnly=true
- decisionImpact=false.

Do not create a “passive score.”

Status: MINIMAL SCHEMA FROZEN.

---

## PF-024 — Concept convergence / system value

Highest likely system value is not to predict index changes.

It is to avoid misinterpreting event-driven price/volume/institutional flow as ordinary signal strength.

Potential uses after evidence:
- label abnormal volume as REBALANCE_CONTEXT;
- separate ordinary foreign accumulation from benchmark-linked flow;
- interpret effective-close spikes differently;
- improve false-breakout/no-follow-through research.

### Lane state
**PASSIVE_FLOW_INDEX_REBALANCING = CONCEPT_COMPLETE / EVIDENCE_PENDING.**

No Formal guard or veto is approved.

## Exact next continuation

PF-025: audit official historical MSCI/TWSE index-review source feasibility and point-in-time announcement availability.
PF-026: audit local passive ETF AUM/benchmark mapping feasibility.
PF-027: define event deduplication and overlapping-index logic.
PF-028: identify whether existing 15m/quote recorder can measure effective-close distortion without new live calls.
PF-029: freeze evidence-readiness / capture proposal if needed.
