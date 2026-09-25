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


---

## PF-025 — Historical index-review source feasibility audit

### MSCI: strong official review-event feasibility
MSCI maintains official previous Index Review pages that expose review cycles such as May/August 2026 and provide:
- review announcements;
- additions/deletions files;
- announcement/effective-date schedules.

Official sources:
- https://www.msci.com/eqb/gimi/stdindex/index_review.html
- https://www.msci.com/eqb/gcc/index_review.html

Example: MSCI's May 2026 notice stated the review results would be announced May 12, 2026 and changes implemented as of the close of May 29, 2026.

Implication:
- announcedAt/effectiveAt can be sourced from official MSCI review artifacts;
- actual published review files can anchor point-in-time event truth;
- historical constituent-change event research is feasible for MSCI review cycles.

### Taiwan Index Plus / TWSE local indices: official data exists, but complete historical constituent files are not all a free open archive
TWSE Data E-Shop officially offers Full Index Constituents Files for TIP indices, including:
- constituent market value/weight;
- opening-reference-price information;
- corporate-action information;
- periodic-review constituent changes.

Source:
- https://eshop.twse.com.tw/en/category/sub/61

This is excellent official provenance, but it is a paid data product for many index files.

### Free/public local-index materials
TWSE public pages provide current index/ETF context and some historical tables/announcements, but current research has not verified a free, stable, exhaustive historical old/new-weight archive for every local index review.

### Feasibility conclusion
- MSCI historical review events: GO for source construction.
- TIP/TWSE local indices: PARTIAL GO; official complete constituent history exists, but access/cost/source contract must be resolved.
- Do not scrape news articles as the authoritative event clock when official provider artifacts exist.

Status: HISTORICAL EVENT SOURCE FEASIBILITY = MSCI STRONG / LOCAL OFFICIAL PARTIAL.

---

## PF-026 — Local passive ETF AUM / benchmark mapping feasibility

### Current cross-sectional mapping is strong
TWSE ETF e添富 publishes for listed ETFs:
- active/passive classification;
- benchmark;
- current AUM;
- issuer;
- trading value/volume;
- product details.

Official sources:
- https://www.twse.com.tw/en/ETFortune-institute/
- https://www.twse.com.tw/en/ETFortune-institute/products

Individual ETF pages explicitly show benchmark and AUM.

Example:
- 0050 benchmark = Taiwan 50 Index.
- 006208 benchmark = Taiwan 50 Index.

Official product pages:
- https://www.twse.com.tw/en/ETFortune-institute/etfInfo/0050
- https://www.twse.com.tw/en/ETFortune-institute/etfInfo/006208

### Important dedup insight
Multiple ETFs can track the same underlying benchmark.
Therefore tracker exposure must aggregate by benchmark before translating an index event to a passive-flow proxy.

### Historical AUM limitation
Individual ETF pages expose a monthly-AUM view, while the institutional dashboard exposes current daily AUM rankings.

Current audit has NOT established a stable official daily historical AUM API for every listed ETF across arbitrary past event dates.

Therefore:
- current benchmark mapping = VERIFIED;
- current AUM cross-section = VERIFIED;
- monthly historical AUM availability = VERIFIED at product-page level;
- exact daily historical event-date AUM for every ETF = NOT YET VERIFIED.

### Research use
Until daily historical AUM is verified:
- do not backfill exact trackerAUM_at_effectiveClose from today's AUM;
- a nearest-prior monthly AUM can only be a lower-frequency MODELED proxy with explicit quality label.

Status: BENCHMARK MAP GO / EVENT-DATE DAILY AUM PARTIAL.

---

## PF-027 — Overlapping-event deduplication logic

### Problem
One economic index rebalance can appear multiple times through:
- several ETFs tracking the same benchmark;
- leveraged/inverse products referencing the same family;
- duplicate provider announcements;
- multiple index families changing the same stock on the same effective close.

Counting each ETF as an independent index event creates false sample size and double-counted flow.

### Frozen hierarchy

#### Level 1 — Underlying benchmark event
Canonical key:
provider | indexId | effectiveAt | symbol | eventType | eventVersion

One membership/weight event exists once at this level.

#### Level 2 — Tracker exposure
Aggregate all verified passive trackers for that benchmark:
benchmarkTrackerAUM = sum(pointInTimeAUM_i)

Each ETF contributes exposure, not a new independent event.

#### Level 3 — Cross-index overlap
If the same symbol is changed by genuinely different benchmarks at the same/near effective close:
- retain each benchmark event;
- create overlapGroupId;
- compute independentIndexEventCount;
- estimate flow proxy by benchmark separately then aggregate only for economic exposure.

### Leveraged/inverse guard
Leveraged/inverse ETFs do not map 1:1 from AUM to stock cash demand.
Do not add their AUM to vanilla passive equity tracker AUM without a verified replication/exposure model.

### Active ETF guard
An ETF labelled active is not mechanically tied to benchmark constituent weights.
Do not count active ETF AUM as passive tracker exposure solely because it has a reference benchmark.

### Example implication
0050 and 006208 both tracking Taiwan 50 represent two tracker exposures to one Taiwan 50 constituent-change event, not two independent event observations.

Status: THREE-LEVEL DEDUPLICATION MODEL FROZEN.

---

## PF-028 — Existing recorder cannot isolate effective-close auction distortion

### What current V8.8 recorder can provide
At its milestone snapshots it can provide:
- quote/spread/depth state;
- opening/10m/15m/30m/formal-signal research snapshots where recorded.

### What the passive-flow question requires
To measure effective-close benchmark pressure, ideal observations include:
- state shortly before 13:25;
- closing call-auction indicative/trial state if available;
- final 13:30 close;
- auction-only or 13:25–13:30 traded volume/value;
- next-session open.

### Current limitation
The recorder is not a dedicated close-auction collector.
A 15-minute candle that spans the close cannot isolate the 13:25–13:30 call auction from preceding continuous trading.

Therefore current recorder cannot faithfully estimate:
- closingAuctionVolumeShare;
- auction-only price displacement;
- exact pre-close to auction-close depth transition.

### Zero-code descriptive fallback
When existing intraday bars exist, one may describe:
- late-session 15m return/volume;
- close to next-open;
but must label these as coarse late-session proxies, not closing-auction measurements.

Status: EFFECTIVE-CLOSE AUCTION MEASUREMENT = DATA-GAP.

---

## PF-029 — Evidence-readiness and capture proposal

### Evidence that is already source-ready
1. MSCI official review announcement/effective dates.
2. MSCI additions/deletions review artifacts.
3. TWSE ETF current benchmark mapping and AUM.
4. Some monthly ETF AUM history.
5. Current stock price/volume and existing institutional-flow research context.

### Evidence still missing/partial
1. exhaustive local-index historical old/new constituent weights;
2. exact event-date daily ETF AUM for all trackers;
3. close-auction-specific stock price/volume/depth;
4. point-in-time tracker holdings/creation-redemption behavior;
5. offshore benchmarked AUM.

### Minimal future capture/archive

#### Index event table
- provider
- indexId
- eventVersion
- announcedAt
- effectiveAt
- symbol
- eventType
- oldWeight
- newWeight
- sourceUrl
- sourceCapturedAt
- provenanceQuality

#### Tracker map
- fundCode
- benchmarkIndexId
- passiveFlag
- leverageType
- aumDate
- aum
- aumQuality

#### Close-auction research record
- tradeDate
- symbol
- eventKey
- preClosePrice
- closePrice
- lateSessionVolume
- auctionVolume if directly available
- nextOpen
- expiryOverlap
- marketState
- coverageQuality

### Governance
- Building offline/provider-event archives is research-only if isolated from Formal runtime.
- Adding new live close-auction capture to shared Worker/schedules requires governance review.
- No passive-flow state can veto or promote a Formal candidate without separate owner approval.

### Lane state
PASSIVE_FLOW_INDEX_REBALANCING = CONCEPT_COMPLETE / SOURCE_MAP_COMPLETE / EVIDENCE_BUILD_PENDING.

No production change.

## Exact next continuation

PF-030: build a small offline MSCI event-source validation sample across several 2025–2026 review cycles.
PF-031: validate whether official MSCI files contain Taiwan-specific adds/deletes in machine-readable enough form for deterministic parsing.
PF-032: build current TWSE passive ETF benchmark-dedup map for major Taiwan-equity benchmarks as a research artifact.
PF-033: only after source contracts are stable, join events to price/volume outcomes without using current AUM as historical AUM.


---

## PF-030 — Four-cycle MSCI event-clock validation sample

Official MSCI sources were checked for four review cycles spanning late 2025 through August 2026.

Validated review clocks:

| Review | Result announcement | Effective implementation |
| --- | --- | --- |
| November 2025 | 2025-11-05 | close of 2025-11-24 |
| February 2026 | 2026-02-10 | close of 2026-02-27 |
| May 2026 | 2026-05-12 | close of 2026-05-29 |
| August 2026 | 2026-08-12 | close of 2026-08-31 |

Official announcement examples:
- November 2025 review: MSCI Global Standard Indexes November 2025 Index Review.
- February 2026 review: MSCI Global Standard Indexes February 2026 Index Review.
- May 2026 review: MSCI Global Standard Indexes May 2026 Index Review.
- August 2026 review: MSCI Global Standard Indexes August 2026 Index Review.

The MSCI review archive exposes review cycles over many years plus recurring additions/deletions artifacts and future review date CSV/PDF.

### Result
Announcement/effective event clocks are stable enough for deterministic event metadata.

### Important timezone rule
Store the provider timestamp exactly as published plus normalized UTC/Taipei time.
Do not collapse a late-evening UTC/European announcement into the wrong Taiwan calendar date.

Status: MSCI REVIEW EVENT CLOCK CONTRACT = VALIDATED FOR SMALL MULTI-CYCLE SAMPLE.

---

## PF-031 — Additions/deletions parser contract remains partial

The official MSCI Index Review landing page clearly exposes, for each review cycle:
- Equity Indexes review announcement;
- Global Standard additions/deletions;
- Small Cap additions/deletions;
- Micro Cap additions/deletions;
- review schedule CSV/PDF.

This verifies that provider-level constituent-change artifacts exist.

### What is not yet proven
Current source audit has not yet frozen a stable unauthenticated machine endpoint/schema for the detailed Global Standard additions/deletions file that can be deterministically parsed into:
- country;
- security;
- add/delete;
- size segment;
- event version;
for every historical cycle.

Search/index pages expose the links, and MSCI press/event announcements expose some Taiwan examples, but those are not a substitute for the complete list file.

### Example Taiwan evidence
The February 2026 MSCI Global Standard review highlights Hon Hai Precision (Taiwan) among the largest Emerging Markets additions.
The August 2026 review highlights Nanya Technology (Taiwan) among the largest Emerging Markets additions.
These confirm Taiwan rows occur in the official review event stream, but do not by themselves prove complete Taiwan constituent parsing.

### Parser GO gate
Before coding a historical parser:
1. resolve direct official file URL/type for at least four cycles;
2. verify stable fields/schema or a deterministic PDF/table parse;
3. verify Taiwan rows against the review announcement;
4. preserve provider publication timestamp and file version;
5. detect missing/revised files explicitly.

Until then:
- event clocks = GO;
- complete constituent parser = PARTIAL / NOT YET GO.

Status: PF-031 SOURCE CONTRACT PARTIAL; NO OUTCOME BACKTEST YET.

---

## PF-032 — Current major Taiwan passive-ETF benchmark dedup sample

Official TWSE ETF pages/dashboard confirm that multiple listed funds may share the same underlying benchmark.

### Current verified benchmark examples

| ETF | Benchmark | Treatment |
| --- | --- | --- |
| 0050 Yuanta Taiwan Top 50 | Taiwan 50 Index | vanilla passive tracker |
| 006208 Fubon FTSE TWSE Taiwan 50 | Taiwan 50 Index | same benchmark group as 0050 |
| 00631L Yuanta Daily Taiwan 50 Bull 2X | Taiwan 50 linked leveraged product | exclude from simple vanilla-AUM aggregation |
| 0057 Fubon MSCI Taiwan ETF | MSCI Taiwan Index | MSCI Taiwan benchmark group |
| 006203 Yuanta MSCI Taiwan ETF | MSCI Taiwan Index | same benchmark group as 0057 |
| 0056 Yuanta Taiwan Dividend Plus | Taiwan Dividend+ Index | separate benchmark |
| 0052 Fubon Taiwan Technology | FTSE TWSE Taiwan Technology Index | separate benchmark |
| 00878 Cathay MSCI Taiwan ESG Sustainability High Dividend Yield | MSCI Taiwan Select ESG Sustainability High Yield Top 30 Index | separate benchmark |
| 00919 Capital Taiwan Select High Dividend | TIP Customized Taiwan Select High Dividend Index | separate benchmark |
| 009816 KGI Taiwan TOP 50 | TIP Customized Taiwan TOP 50 Index | separate benchmark |

### Current scale example, not historical event flow
TWSE institutional ETF data dated 2026-09-24 reports:
- 0050 AUM = NT$2,480,056,582,663
- 006208 AUM = NT$478,793,858,229

Current combined vanilla Taiwan-50 tracker AUM in these two funds:
NT$2,958,850,440,892.

This number is useful only as a current scale illustration.
It must NOT be copied backward to a historical review event.

### Deduplication rule confirmed
For a Taiwan 50 constituent event:
- event count = 1 underlying benchmark event;
- tracker exposure may include 0050 + 006208;
- leveraged/inverse products remain separate unless a replication model is verified.

Status: CURRENT MAJOR TRACKER DEDUP SAMPLE VALIDATED.

---

## PF-033 — First outcome join is blocked by source-quality gates

The temptation now is to join known MSCI review dates to price/volume and immediately test additions/deletions.

Do not do that yet.

### Blocking items
1. complete constituent-list parser contract not yet frozen;
2. exact historical event-date tracker AUM not established for all trackers;
3. effective-close auction-only measurement remains unavailable;
4. offshore passive AUM remains missing.

### What may proceed later
A low-ambition event study can begin once official add/delete rows are deterministic:
- announcement close to effective close path;
- effective close to next open;
- D1/D3/D5;
- volume versus own history;
- foreign flow context;
without pretending to estimate exact passive dollars.

### What may NOT proceed
Do not infer:
- actual passive flow NTD;
- closing-auction flow share;
- total benchmarked AUM;
from current AUM or coarse 15m bars.

Status: PF-033 OUTCOME JOIN = DATA-GATED / NOT STARTED.

## PF-034 — Passive-flow evidence phase checkpoint

The lane is now split into:

A. Concept:
COMPLETE.

B. Source map:
COMPLETE enough to know where authoritative data live.

C. Event clocks:
MSCI small multi-cycle validation COMPLETE.

D. Constituent rows:
PARTIAL.

E. Event-date tracker AUM:
PARTIAL.

F. Close-auction microdata:
MISSING.

G. Outcome testing:
NOT STARTED.

This is the correct stopping point for indicator invention.
Next work should improve data contracts, not add more passive-flow features.

Status: PASSIVE FLOW = EVIDENCE BUILD PENDING.
