# Market Microstructure Research｜市場微結構／訂單流／流動性

Started: 2026-09-25 Asia/Taipei
Status: ACTIVE RESEARCH LANE
Scope: Research-only / Shadow. Formal Core unchanged.

## Purpose

建立一條目前系統尚未正式深挖的研究主線，補足 K 線、價量、Residual RS、ATR/波動、Regime、突破品質之外的「交易如何在委託簿中形成價格」知識。

核心問題：
1. 相同 K 線與成交量，為什麼有些突破能延續、有些立即失敗？
2. 15 分 K BUY 前，買賣價差、五檔深度、供需失衡是否能辨識追價成本與假突破風險？
3. 成交量能否被更接近真正供需壓力的 order-flow / depth features 補強？
4. 哪些微結構資訊只能前瞻擷取，不能用 OHLCV 回填？

## MS-001 — Bid-Ask Spread is information + cost, not noise

### Evidence
Glosten & Milgrom (1985) shows that asymmetric information alone can generate a positive bid-ask spread even for a risk-neutral zero-profit market maker. A spread therefore contains adverse-selection information and also creates a gap between observed and realizable returns.

Source:
- Journal of Financial Economics, Glosten & Milgrom (1985)
- https://doi.org/10.1016/0304-405X(85)90044-3

### Constructive interpretation
- Tight spread can indicate abundant liquidity and lower immediate execution friction.
- If price breaks out while spread remains controlled, the move may be easier to execute without giving away much edge to transaction cost.
- A research-only spread guard may be useful around 15m confirmation / maxChase / execution-quality analysis.

### Opposing interpretation
- Tight spread is not bullish; it only says liquidity/friction is favorable.
- Spread can widen because of genuine information arrival, volatility or inventory risk, not necessarily because the setup is bad.
- High-priced Taiwan stocks have different tick-size/spread mechanics; raw dollar spread is not comparable across price tiers.

### Candidate research fields
- quotedSpreadBps = (ask1-bid1)/mid * 10000
- effectiveSpread proxy only if reliable trade direction exists
- spreadPercentileOwnHistory
- spreadVsSameSlotBaseline
- spreadShock = current spread / same-slot historical median

Status: WORTH_SHADOW_RESEARCH, not standalone alpha.

---

## MS-002 — Order Flow Imbalance (OFI) carries information beyond raw volume

### Evidence
Cont, Kukanov & Stoikov (2014) find that short-horizon price changes are strongly related to order-flow imbalance at the best bid/ask, and that the price-impact slope is inversely related to market depth. Their OFI relation is more robust than raw trade-volume/price-change relations.

Source:
- Journal of Financial Econometrics 12(1), 47-88
- https://doi.org/10.1093/jjfinec/nbt003

Chordia, Roll & Subrahmanyam (2002) also show aggregate order imbalance affects market returns and liquidity even after controlling for volume.

Source:
- Journal of Financial Economics 65(1), 111-130
- https://doi.org/10.1016/S0304-405X(02)00136-8

### Constructive interpretation
A breakout with:
- positive price progress,
- positive OFI,
- stable/tight spread,
- adequate depth,
may be qualitatively different from a breakout created by thin liquidity and one-sided sweeping.

### Opposing interpretation
- OFI is horizon-sensitive and can reverse quickly.
- A large positive imbalance can represent late aggressive chasing near exhaustion.
- Visible book imbalance can be canceled; displayed depth is not guaranteed executable supply/demand.
- OHLCV cannot reconstruct true limit-order additions/cancellations.

### Key distinction from current price-volume research
Raw volume asks “how much traded?”
OFI asks “which side consumed/replenished liquidity at the touch?”
These are related but not equivalent.

### Candidate research fields
Only if quote/order-book data are available prospectively:
- ofiTop1
- ofiTop5
- depthImbalanceTop1 = (bidQty1-askQty1)/(bidQty1+askQty1)
- depthImbalanceTop5
- deltaDepthImbalance
- ofiPersistence_1m / 5m / 15m
- priceImpactPerOFI

Status: HIGH-VALUE SHADOW CANDIDATE, but data-quality dependent.

---

## MS-003 — Market depth changes the meaning of the same imbalance

### Evidence
Cont et al. show the OFI-to-price-change slope is inversely related to depth: the same imbalance moves price more in a thin book than a deep book.

Kyle (1985) formalizes market depth / price impact as a central liquidity concept: informed trading and noise trading jointly determine how order flow becomes price movement.

Source:
- Econometrica 53(6), 1315-1335
- https://www.econometricsociety.org/publications/econometrica/browse/1985/11/01/continuous-auctions-and-insider-trading

### Constructive interpretation
- Positive imbalance + deep replenishing bid side can indicate demand with execution capacity.
- A move that survives despite meaningful opposing depth can indicate stronger acceptance than a thin-book jump.

### Opposing interpretation
- Thin-book moves can look strong in candles but require little actual demand.
- Deep displayed bids can disappear before execution.
- Large-cap and thousand-dollar stocks need separate normalization; absolute depth is not comparable.

### Candidate normalization
- depthNTD rather than shares alone
- own-history percentile
- same-slot baseline
- price-tier / liquidity cohort
- top1 versus top5 decomposition

Status: WORTH_SHADOW_RESEARCH.

---

## MS-004 — Order imbalance can persist, but persistence is not permanent trend

### Evidence
Chordia & Subrahmanyam's individual-stock work links autocorrelated imbalances to order splitting: large traders can spread orders through time, creating continuing price pressure. However, after controlling for current imbalance, the sign relation can reverse.

Source:
- Order Imbalance and Individual Stock Returns / Price Formation with Autocorrelated Order Flow
- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=354122
- https://papers.ssrn.com/sol3/Delivery.cfm/SSRN_ID336060_code2026.pdf?abstractid=336060

### Constructive interpretation
Persistent buy-side pressure may explain why some intraday moves continue beyond the first volume burst.

### Opposing interpretation
Do not hard-code “more imbalance = more bullish.”
Possible states include:
1. fresh continuation,
2. mature/chasing continuation,
3. absorption,
4. exhaustion,
5. reversal after inventory/liquidity pressure normalizes.

### Preferred representation
Use a state machine instead of one score:
- BALANCED
- BUY_PRESSURE_FRESH
- BUY_PRESSURE_PERSISTENT
- BUY_PRESSURE_WITH_WIDENING_SPREAD
- BUY_PRESSURE_NO_PRICE_PROGRESS
- SELL_PRESSURE analogs
- ABSORPTION_CANDIDATE
- LIQUIDITY_STRESS

Status: RESEARCH HYPOTHESIS; no Formal rule.

---

## MS-005 — Taiwan market mechanics must be built into interpretation

### Current TWSE mechanics relevant to research
TWSE regular trading uses continuous matching intraday with call auctions at open and close, price-time priority, multiple order types during continuous trading, and public best-five bid/ask information. The regular trading daily price limit is generally +/-10% of the reference price. TWSE also operates an intraday volatility interruption mechanism when a potential execution price deviates beyond the specified range from the five-minute weighted-average reference, leading to a temporary matching pause/call-auction process.

Sources:
- TWSE Trading Mechanism Introduction
- https://www.twse.com.tw/en/products/system/trading.html
- TWSE Guide to Investing in Taiwan
- https://www.twse.com.tw/en/about/company/guide.html

### Research consequence
US microstructure evidence cannot be copied mechanically into Taiwan:
- daily price limits censor price discovery;
- opening/closing call auctions differ from continuous trading;
- tick size changes with price;
- five-level public depth is only partial book visibility;
- intraday volatility interruption changes order-flow dynamics;
- odd-lot trading has a different matching mechanism.

### Required Taiwan guards
- regular-lot vs odd-lot separation
- continuous session vs opening/closing auction separation
- volatility-interruption flag
- price-limit proximity flag
- price-tier/tick normalization
- same-slot time-of-day normalization

Status: MANDATORY CONTROL LAYER for any future microstructure test.

---

## MS-006 — What this may add to the existing V7/V8 funnel

This lane should not duplicate K-line or price-volume features. Its possible incremental role is execution-quality and false-breakout diagnostics:

### After-market selection
Microstructure is generally unavailable for historical full-market reconstruction unless prospectively captured. Therefore do not use it to fake past selection signals.

### 15m BUY confirmation
Potential research questions:
- Does BUY confirmation have better follow-through when spread is tight relative to same-slot history?
- Does positive price progress + positive OFI outperform positive price progress + neutral/negative OFI?
- Does a breakout with thin ask-side depth but no replenishment fail more often?
- Does widening spread during chase predict worse immediate MAE/slippage?
- Does buy pressure without price progress identify absorption/exhaustion?

### Execution Alpha
Potential outcomes:
- next 10m / 15m / 30m return
- MFE / MAE
- slippage vs mid
- first retrace depth
- false-breakout rate
- fill-quality proxy if available

### Re-add / recovery
Microstructure may eventually help distinguish genuine recovery from low-liquidity bounce, but this remains later-stage research.

---

## Data truth / anti-fabrication boundary

1. OHLCV does NOT contain the sequence of limit-order additions, cancellations and executions.
2. True OFI must not be backfilled from candle direction or up/down volume proxies.
3. Best-five snapshots are not full-depth order books.
4. Displayed depth can be canceled and should not be equated with committed demand.
5. Trade direction needs an explicit, validated classification method if aggressor side is not directly supplied.
6. Missing quote/order-book history = UNKNOWN.
7. Any microstructure capture must be prospective and timestamped.
8. No result may alter Formal selection, BUY, maxChase, stop, capital or push without owner-approved Class C promotion.

---

## First synthesis

The main conceptual upgrade is:

> Volume alone measures activity. Microstructure measures how that activity interacts with available liquidity.

For our system this suggests a new latent layer:
1. Liquidity Cost — spread
2. Available Depth — bid/ask depth
3. Pressure — OFI / depth imbalance
4. Price Response — price move per unit pressure
5. Persistence — whether imbalance/replenishment persists
6. Constraint — Taiwan auction/limit/volatility-interruption/tick regime

The research target is not “find one magic order-book indicator.” The target is to determine whether microstructure explains incremental variation in follow-through, false breakout and execution quality after current K-line, price-volume, Residual RS, ATR, overheat, sector and regime features are controlled.

## Exact next continuation

MS-007: Queue/depth imbalance and microprice literature; distinguish predictive signal from spoofable displayed liquidity.
MS-008: Trade-sign inference (Lee-Ready style and alternatives) and error modes; determine whether Taiwan/Fugle data provide aggressor side directly.
MS-009: Slippage / implementation shortfall / effective spread research and relation to maxChase.
MS-010: Intraday seasonality of spread/depth/OFI in Taiwan; same-slot normalization design.
MS-011: Data-availability audit in current Fugle/Worker pipeline; identify which fields can be captured prospectively without touching Formal Core.
MS-012: Pre-register a minimal Shadow microstructure feature set and falsification criteria before outcome inspection.


---

## MS-007 — Queue imbalance and microprice: useful at very short horizons, but easy to over-interpret

### Evidence
Gould & Bonart (2015) test 10 liquid Nasdaq stocks and find best-bid / best-ask queue imbalance has statistically significant power for predicting the direction of the **next mid-price move**. The improvement is stronger for large-tick than small-tick stocks.

Source:
- https://arxiv.org/abs/1512.03492

Stoikov's Micro-Price work treats the ordinary midprice as incomplete because the current spread and order-book imbalance shift the short-horizon fair-price estimate.

Source:
- https://papers.ssrn.com/sol3/papers.cfm?abstract_id=2970694

### Constructive interpretation
A simple best-level imbalance:
`QI1=(bidQty1-askQty1)/(bidQty1+askQty1)`
can carry useful information about the next very-short-horizon price move.

A weighted-mid proxy can also be logged:
`weightedMidProxy=(ask1*bidQty1 + bid1*askQty1)/(bidQty1+askQty1)`
This is only a proxy; it must NOT be called the fitted Stoikov microprice.

### Opposing interpretation
- The documented horizon is essentially one tick / next mid-price change, not a 15m or D1 alpha guarantee.
- Effect strength depends on tick regime and market structure.
- Displayed queues can be canceled, so visible size is not committed demand/supply.
- A large queue can be passive liquidity or a wall that attracts/fades flow; sign alone is insufficient.
- Taiwan transfer requires tick-size, price-tier and session controls.

### Research implication
Use queue imbalance as an execution-state feature, not a standalone BUY trigger.

Status: WORTH_SHADOW_RESEARCH.

---

## MS-008 — Trade direction must be inferred carefully; inferred side is not ground truth

### Evidence
Lee & Ready (1991) show two important classification problems:
1. quote timestamps can be out of sync with the trade that caused the quote change;
2. trades inside the quoted spread are difficult to classify.
They propose quote / midpoint / tick-based inference procedures.

Source:
- https://doi.org/10.1111/j.1540-6261.1991.tb02683.x

Later validation literature shows these algorithms can still misclassify a material share of trades, so the inferred aggressor side must be treated as a proxy rather than truth.

### Fugle data semantics
Current Fugle stock `intraday/trades` returns, when available for a trade:
- bid
- ask
- price
- size
- time
- serial

This is enough to research quote-relative trade classification, but the schema does not itself label an explicit buyer-initiated / seller-initiated aggressor field.

Fugle also exposes provider-computed inside/outside-volume style fields through `intraday/volumes` and quote/aggregate data. Those should be named as provider-side trade-pressure proxies, not true OFI.

### Opposing interpretation
- If a trade prints at the bid/ask, the quote could already have changed around it.
- Midpoint trades remain ambiguous.
- Vendor inside/outside volume and true order-book event OFI are different objects.
- Do not combine an inferred trade-sign proxy and book OFI under one name.

### Required naming discipline
- `tradePressureProxy` for Fugle/provider inside-outside style measures.
- `inferredAggressorSide` only when an explicit inference algorithm is applied.
- `ofi` reserved for a defined order-book-event imbalance that includes quote-size changes / executions according to a frozen method.

Status: DATA-SEMANTICS GUARD ADOPTED.

---

## MS-009 — Execution cost must be separated from signal quality

### Core distinction
A good signal can still be a bad trade if spread/slippage consumes the edge.

For our system:
- selection alpha = was the stock idea good?
- execution alpha = did the timing / entry improve or destroy that idea?
- realized fill quality = what price was actually obtained?

Signal observation is NOT brokerage fill.

### Candidate research measurements
When a real fill exists:
- arrivalMid = (bid1+ask1)/2 at decision timestamp
- fillVsArrivalBps
- fillVsAsk1Bps for buys
- quotedSpreadBps
- spreadPaidFraction
- 10m / 30m post-fill markout
- implementation-shortfall style realized cost relative to a frozen decision benchmark

When no real fill exists:
- do NOT report implementation shortfall.
- report only executable-friction proxies such as quoted spread, plan-price distance, quote-mid distance and subsequent markout.

### Positive hypothesis
Widening normalized spread and thin ask-side depth during a chase should worsen execution alpha even if the directional signal remains correct.

### Counter-hypothesis
A spread can widen because high-value information is arriving; avoiding every wide-spread event can systematically miss the strongest moves.

Status: HIGH PRIORITY FOR EXECUTION-ALPHA RESEARCH.

---

## MS-010 — Intraday seasonality means raw spread/depth thresholds are structurally weak

### Evidence
Taiwan-market-quality literature has documented systematic intraday patterns in spread, activity, volatility and depth. More generally, limit-order markets often show time-of-day patterns in liquidity.

### Research implication
Do NOT compare 09:05 spread/depth directly with 11:30 using one raw threshold.

Preferred baseline:
- same symbol,
- same clock-time slot,
- prior independent sessions only,
- median / robust percentile rather than outcome-tuned cutoffs.

Candidate fields:
- spreadVsSameSlotMedian20
- depth1VsSameSlotMedian20
- depth5VsSameSlotMedian20
- tradePressureVsSameSlotMedian20
- transactionRateVsSameSlotMedian20

### Required session separation
- opening call auction / immediate post-open
- normal continuous trading
- volatility interruption / delayed matching
- closing call auction / pre-close
- intraday odd lot

### Counter-evidence / risks
- Same-slot baselines may need too much history for newly listed / illiquid names.
- Structural changes in tick size or liquidity regime can stale the baseline.
- Cross-stock normalization may still be needed when own-history coverage is poor.

Status: SAME-SLOT NORMALIZATION IS THE DEFAULT RESEARCH DESIGN, not yet a Formal rule.

---

## MS-011 — Fugle / current Worker data-availability audit

### What Fugle currently exposes
Current official Fugle docs show:
- REST `intraday/quote`: best-five bid/ask related quote data, last trade, limit/halt/trial/continuous flags, cumulative market state fields.
- REST `intraday/trades`: bid, ask, trade price, size, time, serial.
- REST `intraday/volumes`: price-level volume plus `volumeAtBid` / `volumeAtAsk`; Fugle explicitly notes opening-auction first volume is excluded from inside/outside calculation because the opening call auction may not reflect supply/demand in the same way.
- WebSocket `books`: latest best-five bid/ask price/size and `isContinuous` / `isTrial`.
- WebSocket `trades`: trade-by-trade bid/ask/price/size/time.
- WebSocket supports trades / candles / books / aggregates / indices channels.

### Current main-source audit
Current repository `Worker.js` source:
- calls Fugle `intraday/candles`;
- calls Fugle `intraday/quote`;
- `quotePrice()` currently extracts only closePrice / lastPrice / price;
- source audit found no direct consumption of `intraday/trades`, `intraday/volumes`, bids/asks, `tradeVolumeAtBid`, or `tradeVolumeAtAsk`.

Important boundary:
plain main `Worker.js` is a source artifact and deploy-time guarded patches may make Production differ. Therefore this is a **source-availability finding**, not a claim that every deployed runtime path lacks these fields.

### Consequence
We do NOT need a new market-data vendor to begin microstructure Shadow research. Fugle already exposes enough prospective data for:
1. quoted spread,
2. top-5 depth imbalance,
3. provider trade-pressure proxy,
4. trial/continuous/limit/halt guards,
5. transaction/trade-event rate,
6. quote-to-trade state.

True event-level OFI still requires a frozen event reconstruction method and prospective quote/book stream capture; it cannot be manufactured from historical candles.

Status: DATA SOURCE FEASIBLE; IMPLEMENTATION NOT YET PROMOTED.

---

## MS-012 — Pre-registered minimal Shadow feature set

Before looking at outcomes, freeze a minimum feature set to prevent Factor-Zoo expansion.

### Minimal V1 feature set
1. `msQuotedSpreadBps`
2. `msDepthImbalance1`
3. `msDepthImbalance5Notional`
4. `msTradePressureProxy` = provider inside/outside pressure, explicitly NOT true OFI
5. `msWeightedMidProxyBps` = weighted-mid proxy minus ordinary mid in bps
6. `msTransactionRate`
7. `msSessionState` = CONTINUOUS / TRIAL_OR_AUCTION / HALT_OR_INTERRUPTION / UNKNOWN
8. `msPriceLimitState`
9. same-slot-normalized versions of spread/depth/pressure where sufficient prior coverage exists
10. provenance: capturedAt, source, pointInTimeEligible, coverage/UNKNOWN flags

### Do NOT include initially
- dozens of depth levels / horizons,
- fitted machine-learning microprice,
- arbitrary thresholds optimized to D5,
- reconstructed historical OFI,
- retrospective labels based on later breakout success.

### Pre-registered positive hypotheses
H1. Tight same-slot spread + positive pressure + positive price progress has better 10m/30m follow-through than price progress alone.
H2. Buy pressure with no price progress has worse follow-through / larger MAE than buy pressure with proportional price response.
H3. Widening spread during maxChase-like conditions worsens execution alpha.
H4. Queue/depth imbalance adds incremental information after current price-volume, ATR/liquidity, Residual RS, overheat, sector and regime controls.

### Pre-registered falsification
Reject / downgrade the feature family if:
- incremental effect disappears after existing controls;
- result exists only in one stock, one price tier or opening minutes;
- date-cluster leave-one-date-out direction is unstable;
- transaction-cost / spread adjustment removes the effect;
- signal requires outcome-tuned thresholds;
- data coverage is too sparse or session state is ambiguous;
- apparent effect is explained by price-limit / volatility-interruption mechanics.

### Evaluation horizons
Microstructure is primarily intraday:
- next 1 / 5 / 10 / 15 / 30 minutes,
- 15m BUY follow-through,
- MFE / MAE,
- false-breakout / retest failure,
- executable spread / fill slippage when genuine fills exist.

D1/D3/D5 may be recorded, but should not be the primary horizon for a book-state feature without evidence.

### Governance
Initial implementation can only be Class A if isolated to research logging / Shadow diagnostics with decisionImpact=false.
Any use in Formal selection, BUY gating, maxChase, stop, capital, monitoring or notification is Class C and requires owner approval.

Status: PRE-REGISTERED RESEARCH SPECIFICATION.

---

## Second synthesis — what we learned after the first deepening

The strongest new insight is that our existing 15m logic has been looking mostly at **price/volume outcomes**, while microstructure can add **execution-state causes**:

- candle says price moved;
- volume says activity occurred;
- spread says immediate trading friction;
- depth says how much visible liquidity stood in the way;
- pressure says which side was consuming/replenishing liquidity;
- price response says whether that pressure actually moved price;
- persistence says whether the state continued or exhausted;
- Taiwan session flags say whether normal continuous-market interpretation is even valid.

This does not justify adding a BUY condition today. It does justify a prospective Shadow capture design because the required Fugle data already exist.

## Exact next continuation after MS-012

MS-013: Study absorption / replenishment: strong buy pressure with weak price response versus genuine continuation.
MS-014: Study liquidity vacuum / thin-book breakout versus depth-supported breakout.
MS-015: Study spread/depth behavior immediately before and after failed breakouts.
MS-016: Taiwan-specific order-imbalance evidence and investor-class findings; separate historical institutional evidence from current actionable features.
MS-017: Compare microstructure candidate fields to existing V8.8.1 recorder spread/depth fields to eliminate duplicates before proposing any code.
MS-018: Decide whether a fully isolated Class-A prospective capture can reuse existing execution recorder without changing Formal runtime semantics.


---

## MS-013 — Absorption is a dynamic process, not a single-book snapshot

### Evidence
Limit-order-book resiliency literature treats liquidity as dynamic: after a liquidity shock, spread/depth can deteriorate and then replenish as new limit orders arrive. Empirical work finds replenishment can occur quickly, but the speed and reliability differ by stock/liquidity class.

Sources:
- Lo & Hall (2015), Resiliency of the limit order book, Journal of Economic Dynamics and Control.
- Cont, Kukanov & Stoikov (2014), order-book event price impact.

### Research definition
Do not call one large ask queue “absorption.”

A buy-side absorption candidate requires an as-of sequence such as:
1. aggressive/buy-pressure proxy remains positive,
2. ask-side displayed liquidity is repeatedly consumed,
3. ask liquidity repeatedly replenishes at or near the same prices,
4. price progress per unit pressure weakens,
5. spread does not resolve into a clean upward repricing.

A continuation candidate is the opposite pattern:
- ask depth consumed,
- weak replenishment,
- best ask/mid reprices upward,
- price progress remains proportional to pressure.

### Positive use
This can explain two visually similar high-volume candles:
- genuine demand removing supply,
- heavy demand being absorbed by replenishing sellers.

### Counter-interpretation
- Replenishment is not automatically bearish: market makers may replenish while price trends.
- Snapshot frequency can manufacture false “replenishment” if updates between snapshots are missed.
- Hidden/iceberg liquidity cannot be observed directly from top-five snapshots.
- Intent such as spoofing cannot be inferred merely because size disappears.

### Candidate dynamic fields
- askDepthReplenishmentRate
- bidDepthReplenishmentRate
- pressureToPriceResponse
- consecutivePressureNoProgress
- spreadRecoverySeconds / snapshots
- depthRecoverySeconds / snapshots

Status: HIGH-VALUE, requires denser prospective sampling than the current sparse recorder.

---

## MS-014 — Liquidity-vacuum breakout versus depth-supported breakout

### Mechanism
The same +1% price move can require very different order-flow pressure depending on available depth. Cont et al. find price impact is inversely related to market depth.

This creates two competing breakout stories:

A. DEPTH-SUPPORTED / ACCEPTED
- meaningful pressure,
- opposing depth is consumed,
- price reprices,
- spread remains controlled or recovers,
- depth replenishes behind the move.

B. LIQUIDITY-VACUUM
- little visible opposing depth,
- modest pressure produces a large price jump,
- spread/depth quality deteriorates,
- follow-through may be fragile once liquidity returns.

### Positive interpretation
A vacuum can create rapid upside and may precede genuine discovery if new information is strong.

### Negative interpretation
A fast candle in a thin book can exaggerate apparent strength and worsen chase/slippage. “Moves easily” is not the same as “has strong demand.”

### Candidate research metric
Use a normalized response ratio rather than raw move:
- priceResponseBps / normalizedPressure
- interpreted jointly with depth percentile and spread state

Do not freeze a threshold until prospective data exist.

Status: WORTH_SHADOW_RESEARCH.

---

## MS-015 — Failed breakout microstructure signature

### Pre-registered hypothesis
A failed breakout may be preceded or accompanied by one or more of:
- spread widening relative to same-slot baseline,
- weakening depth support,
- pressure-price divergence (buy pressure persists but price stops progressing),
- ask-side replenishment,
- depth imbalance flipping after breakout,
- quote mechanism / limit / interruption state making the apparent breakout non-comparable.

### Competing hypothesis
The same symptoms can occur during healthy price discovery under high information arrival. Therefore they must be tested against successful breakouts matched by:
- same date / regime,
- price tier,
- liquidity,
- ATR,
- sector,
- current price-volume state.

### Outcome labels
For this lane, primary labels are intraday:
- holds breakout reference for next 15m / 30m,
- returns below reference,
- MFE / MAE,
- spread-normalized slippage proxy,
- retest depth.

No retrospective pattern relabeling.

Status: PRE-REGISTERED HYPOTHESIS.

---

## MS-016 — Taiwan-specific order-imbalance evidence: valuable, but historically bounded

### Evidence
Lee, Liu, Roll & Subrahmanyam (2004) use TWSE data that identify order originators. They find marketable order imbalance persistence differs by trader type and can arise from both order splitting and herding. Importantly, they find little evidence that aggregate price pressure from this persistence lasts beyond a trading day.

Source:
- Journal of Financial and Quantitative Analysis 39(2), 327-341.
- CaltechAUTHORS record: https://authors.library.caltech.edu/records/krptp-9ny02

### Why this matters
It directly supports two research cautions:
1. persistent order pressure in Taiwan is plausible;
2. persistence does not imply multi-day permanent price impact.

### Historical-transfer warning
Do NOT transplant the paper's trader-class ranking into 2026 as current truth.

TWSE's current 2026 market-structure commentary says domestic individual investors' trading-value share fell to about 52% during Jan-Jul 2026, versus up to 86.1% around 2000, reflecting a substantially more institutionalized market.

Therefore:
- the old investor-class findings are mechanism evidence,
- not a current 2026 ranking of who is “informed.”

Status: TAIWAN MECHANISM EVIDENCE ACCEPTED; CURRENT TRADER-TYPE EFFECT MUST BE REVALIDATED.

---

## MS-017 — Existing V8.8.1 recorder already covers part of this lane

### Repository evidence
Inspection of `scripts/apply_v8_8_1.py` shows the prospective research-only execution recorder already passes through:
- previousClose
- openPrice
- avgPrice
- top-five bids
- top-five asks
- tradingHalt
- isContinuous
- isDelayedOpen / isDelayedClose
- isLimitUpHalt / isLimitDownHalt

It already derives:
- openingGapPct
- sessionAvgPrice / VWAP proxy semantics
- bestBid / bestAsk
- spreadPct
- bidDepth5
- askDepth5
- depthImbalance
- executionMarketState
- UNKNOWN reasons

This is important: several proposed microstructure fields are **not new work**.

### Redundancy decision
Do not create duplicate fields for:
- raw spread,
- total top-five bid/ask depth,
- top-five depth imbalance,
- coarse market mechanism state.

The incremental microstructure lane should instead focus on what the recorder does not yet contain:
1. same-slot normalization,
2. weighted-mid proxy,
3. provider trade-pressure proxy / inferred aggressor semantics,
4. transaction rate,
5. dynamic replenishment/resiliency,
6. pressure-to-price response,
7. persistence / flip states.

### Recorder-frequency limitation
`scripts/apply_v8_8_0.py` records only event states such as:
- OPEN_BASELINE
- FIRST_10M_COMPLETE
- FIRST_15M_COMPLETE
- FIRST_30M_COMPLETE
- FORMAL_SIGNAL_OBSERVED

That cadence is useful for execution snapshots but too sparse to reconstruct true event-level OFI or seconds-scale resiliency.

Status: REDUNDANCY REMOVED; NEED DYNAMIC DATA ONLY FOR THE TRULY NEW FEATURES.

---

## MS-018 — Safe engineering boundary for prospective microstructure capture

### Classification
Reusing fields from the existing quote already fetched by Formal monitoring and adding downstream-only research calculations can potentially remain Class A **only if**:
- decisionImpact=false,
- no additional latency/fetch dependency is added before formal decisions/push,
- failure is fail-open,
- protected formal outputs are regression-identical.

However, adding new Fugle `intraday/trades` / `intraday/volumes` calls directly inside the Formal monitor path can create shared-runtime latency/rate-limit/failure risk. That should be treated as Class B unless isolated.

### Preferred architecture
For true new data, prefer a separate research capture path:
- isolated research endpoint / scheduled capture,
- writes only research tables,
- no dependency from Formal monitor/signals/push,
- bounded symbol set,
- explicit timestamps and data-source provenance,
- fail-open relative to trading system,
- coverage / truncation metadata.

### Why not implement immediately
The current task is knowledge acquisition and pre-registration. Implementing denser capture before the exact feature/cadence/cost contract is frozen would create avoidable Factor-Zoo and infrastructure risk.

### Best next design question
Determine the minimum cadence required to distinguish:
- consumption,
- replenishment,
- persistence,
- spread recovery,
without attempting full exchange-grade tick reconstruction.

Status: ARCHITECTURE DIRECTION DEFINED; NO FORMAL/RUNTIME CHANGE APPROVED OR MADE.

---

## Third synthesis — revised candidate set after redundancy audit

Existing recorder already gives us:
- spread,
- top-five depth,
- depth imbalance,
- market mechanism flags,
- opening gap / session average proxy.

Therefore the genuinely novel research variables are now narrower:

### Priority A — likely incremental
- same-slot spread/depth normalization
- tradePressureProxy
- pressureToPriceResponse
- weightedMidProxy displacement
- transactionRate
- replenishment / resiliency
- persistence / pressure-no-progress state

### Priority B — later
- event-level true OFI
- fitted microprice
- queue survival / cancellation hazard
- hidden-liquidity inference

This is a better direction than simply adding more indicators: it explicitly removes fields V8.8.1 already has.

## Exact next continuation after MS-018

MS-019: Determine minimum prospective sampling cadence and storage burden for replenishment without affecting Formal runtime.
MS-020: Study adverse selection / post-trade markout as an execution-quality label.
MS-021: Study spread/depth normalization by Taiwan tick-size bands and thousand-dollar-stock pool.
MS-022: Study whether price-limit proximity causes nonlinear depth/pressure behavior and requires a separate cohort.
MS-023: Build a cross-lane redundancy matrix: microstructure vs price-volume vs K-line vs Residual RS vs volatility.
MS-024: Freeze a first empirical test protocol before any new capture is implemented.


---

## MS-019 — Minimum prospective cadence: dynamic questions need dynamic data

### Why current snapshots are insufficient
The current execution recorder's OPEN / 10m / 15m / 30m / signal snapshots can describe state, but cannot identify:
- whether ask depth was consumed then replenished,
- how quickly spread recovered,
- whether imbalance persisted for seconds or only appeared once,
- whether a price jump occurred through a temporary liquidity vacuum.

Resiliency literature measures recovery after liquidity shocks on seconds-to-minutes horizons, so multi-minute checkpoint snapshots are structurally too coarse.

### Preferred data architecture
For a narrow prospective research cohort:
1. event-driven `books` and `trades` is the information-preserving source;
2. if raw event storage is too costly, aggregate **outside the Formal path** into fixed short intervals;
3. retain event timestamps, first/last state, min/max spread, bid/ask depth changes, trade count/size and market-state flags.

Do not choose cadence by looking at which one produces the best return result.

### Cadence pilot
Before outcome testing, compare data fidelity at fixed candidate resolutions:
- 1 second: 16,200 time buckets per symbol in a 4.5-hour regular session;
- 5 seconds: 3,240 buckets;
- 15 seconds: 1,080 buckets.

The pilot decision criterion is **state-reconstruction fidelity / missingness / operational burden**, not profitability.

### Decision rule
If 5s aggregation preserves the same pressure/replenishment state classification as 1s for a high proportion of events, prefer 5s. If not, keep finer data only around designated research windows. This comparison must be made without using future-return outcomes.

Status: PILOT DESIGN ONLY; no capture implementation yet.

---

## MS-020 — Post-trade markout and adverse selection

### Concept
Implementation shortfall separates paper decision performance from actual execution performance. For microstructure, post-event / post-fill markout asks what the midprice does after an execution or observed trade.

Reference:
- Perold (1988), The Implementation Shortfall: Paper versus Reality.

### For our system
When a genuine BUY fill exists:
- freeze decisionTime and arrivalMid;
- record fillPrice;
- compute later midprices at +1m / +5m / +15m / +30m;
- buyer markout can be measured as `(futureMid-fillPrice)/fillPrice`;
- execution cost and directional follow-through stay separate.

When no genuine fill exists:
- do not call it fill markout;
- use `postSignalMidMove` or `postPressureMidMove`.

### Why useful
A BUY can be directionally right but badly executed:
- positive later return,
- yet large spread/slippage at entry.

Conversely, a tight execution can still be attached to a bad directional signal.

### Adverse-selection interpretation
For a liquidity provider, price moving against the side they just supplied indicates adverse selection. For our directional buyer, the same future move may be favorable. Always state whose perspective the signed markout uses.

Status: LABEL SEMANTICS FROZEN.

---

## MS-021 — Taiwan tick-size bands make raw spread comparisons invalid

### Current TWSE stock tick bands
Official TWSE rules specify stock price ticks:
- < NT$10: NT$0.01
- NT$10 to <50: NT$0.05
- NT$50 to <100: NT$0.10
- NT$100 to <500: NT$0.50
- NT$500 to <1,000: NT$1
- >= NT$1,000: NT$5

Source:
- TWSE Operating Rules Article 62.

### Consequence
For our thousand-dollar pool, even a one-tick spread is mechanically much larger in dollars and may be materially larger in bps than in lower-price names.

Therefore every spread analysis needs at least:
- spreadNTD,
- spreadTicks,
- spreadBps,
- priceTier / tickBand.

Depth should also be represented in:
- shares,
- notional NTD,
- own-history percentile.

### Research implication
Do not compare a NT$1,200 stock's raw spread/depth directly with a NT$120 stock. The existing 3+3/3+3+3 pool architecture makes this especially important.

Status: MANDATORY NORMALIZATION.

---

## MS-022 — Price-limit proximity and volatility interruption are nonlinear microstructure regimes

### Current TWSE mechanics
- Ordinary stocks are generally subject to +/-10% daily price limits versus the opening auction reference price.
- Intraday volatility interruption can delay matching for two minutes when the potential execution price exceeds the specified +/-3.5% reference band; after interruption, matching resumes with call-auction logic.
- During interruption/trial states, displayed best-five / simulated information has different interpretation from normal continuous trading.

Sources:
- TWSE Operating Rules Article 63.
- TWSE intraday price-stabilization rules.

### Consequence
Near limit-up / limit-down:
- one side of the book may become structurally thin or empty,
- spread and depth imbalance can saturate,
- ordinary linear pressure-to-price relationships can break,
- “buy pressure” at limit-up cannot produce unconstrained price progress.

Therefore define:
- distanceToUpperLimitTicks / Bps
- distanceToLowerLimitTicks / Bps
- limitFlag
- VI / delayed / trial / continuous state

and analyze limit-proximity observations as a separate cohort / guard.

### Counterpoint
Limit proximity can also signal genuine extreme information arrival. Excluding these observations entirely would throw away important regimes; the correct response is separate modeling, not automatic BAD.

Status: SEPARATE REGIME REQUIRED.

---

## MS-023 — Cross-lane redundancy matrix

Microstructure candidates must beat the question: “Does this add information beyond what we already know?”

### Candidate versus existing lanes

| Microstructure feature | Closest existing information | Expected incremental content |
|---|---|---|
| spreadBps / spreadTicks | liquidity, price tier | immediate execution friction |
| depthImbalance | current depth recorder | already present; no duplicate |
| same-slot spread/depth z/ratio | PV same-slot RVOL logic | liquidity state normalized by clock time |
| tradePressureProxy | volume / RVOL | side-of-trade pressure, though proxy |
| weightedMid displacement | price location / K-line | sub-spread short-horizon pressure |
| pressureToPriceResponse | PV effort-vs-result | true/near-book effort-response at shorter horizon |
| replenishment/resiliency | none strong | dynamic liquidity recovery |
| transactionRate | volume/activity | event intensity distinct from share volume |
| pressure persistence | PV persistence | side-specific pressure persistence |
| price-limit/VI state | existing quote mechanism flags | guard/regime, already partly captured |

### Redundancy test order
1. existing recorder fields first,
2. K-line / pattern maturity,
3. price-volume latent layers,
4. ATR/liquidity,
5. Residual RS / sector,
6. regime / overheat,
7. microstructure candidate incremental effect.

Use the project's existing same-date de-meaning / conditional-incremental / leave-one-date-out principles rather than inventing a new validation language.

### Kill rule
If a new microstructure field has high redundancy and no stable incremental relation to the primary intraday outcomes, remove it rather than adding another score.

Status: REDUNDANCY GATE FROZEN.

---

## MS-024 — First empirical protocol frozen before implementation

### Research question
Do microstructure states improve explanation/prediction of intraday follow-through and execution quality beyond existing K-line, price-volume and risk variables?

### Population
Prospective only.
Capture must begin before outcomes are known.
Do not capture only stocks that later BUY; include all symbols in the defined monitored research cohort so NO-BUY / no-follow-through controls remain observable.

### Primary features
Reuse existing:
- spreadPct
- bidDepth5
- askDepth5
- depthImbalance
- executionMarketState

Add only genuinely new candidates:
- spreadTicks / tickBand
- sameSlotSpreadState
- sameSlotDepthState
- weightedMidDisplacementBps
- tradePressureProxy
- transactionRate
- pressureToPriceResponse
- replenishmentState
- pressurePersistenceState
- limitDistance / mechanism guards

### Primary horizons
- +1m, +5m, +10m, +15m, +30m
- MFE / MAE over 15m and 30m
- breakout reference hold/failure
- post-signal mid move
- real-fill slippage/markout only when verified fills exist

### Primary comparisons
1. same-date matched monitored stocks;
2. successful vs failed breakout under matched liquidity/ATR/price-tier;
3. BUY vs NO-BUY with complete coverage, without treating missing recorder rows as NO-BUY;
4. pressure-with-price-response vs pressure-without-response;
5. normal continuous state vs limit/VI/trial separate cohorts.

### Statistical / bias controls
- cluster evidence by independent scan/trading date;
- use the existing minimum maturity discipline before directional claims;
- same-slot baselines use only prior sessions;
- no historical OHLCV reconstruction of microstructure;
- no outcome-driven cadence, threshold or feature proliferation;
- transaction costs / spread included for execution interpretations;
- missing / truncated coverage = UNKNOWN;
- multiple-testing ledger increments for materially new variants.

### Promotion boundary
Success here only earns “worth continued Shadow research.”
No automatic change to Formal selection, BUY, maxChase, capital, stop, monitoring or push.

Status: EMPIRICAL PROTOCOL FROZEN.

---

## Fourth synthesis — microstructure lane is now research-ready, not production-ready

The lane has progressed from a broad idea to a falsifiable protocol:
- what is already captured is known;
- what is truly new is narrowed;
- Taiwan tick/limit mechanics are explicit;
- outcomes and control groups are frozen;
- missing data semantics are defined;
- duplicate factors have been removed;
- Formal Core remains untouched.

The next step should now be **evidence collection**, not another round of indicator invention.

## Exact next continuation after MS-024

MS-025: Read the actual current execution-recorder schema/readback and quantify present coverage by event/date before any new field is added.
MS-026: Determine whether existing snapshots already support a first spread/depth outcome study with no new runtime capture.
MS-027: If coverage is adequate, pre-register and run a zero-code baseline test using only existing recorder fields.
MS-028: Only if existing coverage cannot answer the question, prepare an isolated research-capture engineering proposal with exact cadence/storage/rate-limit budget.


---

## MS-027 — Zero-code baseline remains blocked by coverage, not by lack of variables

The existing V8.8.1 recorder already contains spread/depth state, but the current read contract is rolling-window newest-first, SQL LIMIT 500 and exposes only the newest 80 rows. It has no exact-date cursor, total matching rows, truncation flag, expected event set, or per-date completeness proof.

Therefore:
- returned rows may be used for descriptive examples only;
- missing target-date rows must remain UNKNOWN;
- no BUY-vs-NO-BUY or event-frequency study can use convenience samples from the current endpoint;
- no apparent low/zero occurrence can be interpreted as a true absence.

This falsifies the idea that “we already have spread/depth, so just backtest it now.” The blocker is observational completeness, not feature availability.

Status: MS-027 DATA_QUALITY_BLOCKED.

---

## MS-028 — Isolated research collector architecture

### Principle
Dynamic microstructure collection must not become a dependency of Formal monitoring.

Preferred separation:
1. independent research collector process / Worker surface;
2. reads a bounded research symbol cohort;
3. connects to Fugle WebSocket books + trades;
4. aggregates into research-only buckets;
5. writes only research storage;
6. no code path from Formal BUY / monitoring / push waits for or reads the collector;
7. collector failure is research-data loss only, never a trading-system failure.

### Governance classification
- Documentation / offline design: Class A research work.
- A new deployed Worker / Durable Object / binding / secret / shared Fugle quota usage is infrastructure and can indirectly affect Production resource/API limits; treat deployment as Class B proposal-first unless it is proven fully isolated.
- Any use of collected features in Formal selection/BUY/maxChase/stop/monitoring/push is Class C.

### Why separate from current Formal Worker
Cloudflare Workers have platform subrequest/connection/runtime limits, and Fugle REST has plan-specific rate limits. A high-frequency research loop inserted into the Formal request path would add avoidable latency, quota and failure coupling.

Cloudflare reference:
- https://developers.cloudflare.com/workers/platform/limits/

Fugle reference:
- https://developer.fugle.tw/docs/pricing/

Status: ARCHITECTURE FROZEN; no deployment.

---

## MS-029 — Fugle quota budget: WebSocket is structurally better than REST polling for this lane

### Current official Fugle plan limits
As of 2026-09-25 official pricing docs:
- Basic: 5 WebSocket subscriptions, 1 connection, 60 intraday REST requests/minute.
- Developer: 300 subscriptions, 2 connections, 600 intraday REST requests/minute.
- Advanced: 2000 subscriptions, 2 connections, 2000 intraday REST requests/minute.
- One subscription = one symbol x one channel.

Source:
- https://developer.fugle.tw/docs/pricing/

### Subscription arithmetic
For books + trades:
- 6 symbols = 12 subscriptions.
- 9 symbols = 18 subscriptions.
- 14 symbols = 28 subscriptions.

Therefore a Basic-plan WebSocket quota cannot cover books+trades for a 6-symbol cohort. Developer/Advanced quotas can.

### REST polling arithmetic
At 5-second cadence there are 12 polls/minute per endpoint.
- 6 symbols x 1 endpoint = 72 req/min > Basic 60/min.
- 6 symbols x 2 endpoints = 144 req/min.
- 9 symbols x 2 endpoints = 216 req/min.
- 14 symbols x 2 endpoints = 336 req/min.

Thus 5-second multi-symbol REST polling is already incompatible with Basic for even one endpoint across 6 symbols, and although Developer can support these arithmetic examples, consuming shared REST quota is unnecessary if event-driven WebSocket data are available.

### Important account boundary
The user's actual Fugle MarketData plan is not established by repository evidence. Do not assume Developer/Advanced. Collector deployment must verify actual quota first.

Status: WEBSOCKET-FIRST DESIGN.

---

## MS-030 — Storage budget: do not retain every raw message by default

Taiwan regular trading session is about 4.5 hours = 16,200 seconds.

Fixed bucket counts:

### 6 symbols
- 1s: 97,200 rows/day; 2,138,400 rows/22 sessions.
- 5s: 19,440 rows/day; 427,680 rows/22 sessions.
- 15s: 6,480 rows/day; 142,560 rows/22 sessions.

### 9 symbols
- 1s: 145,800 rows/day; 3,207,600 rows/22 sessions.
- 5s: 29,160 rows/day; 641,520 rows/22 sessions.
- 15s: 9,720 rows/day; 213,840 rows/22 sessions.

Illustrative payload-only sizing (NOT measured D1 physical size):
- 6 symbols, 5s, 22 sessions at 300–600 bytes/row: ~128–257 MB.
- 9 symbols, 5s, 22 sessions at 300–600 bytes/row: ~192–385 MB.
- 6 symbols, 1s, 22 sessions at 300–600 bytes/row: ~642 MB–1.28 GB.

Indexes/SQLite page overhead can make actual storage larger. Current Cloudflare D1 limits list 500 MB per database on Free and 10 GB on Paid.

Source:
- https://developers.cloudflare.com/d1/platform/limits/

### Design consequence
Do not pre-commit to 1-second permanent storage.
Pilot 1s/5s/15s for state-reconstruction fidelity without looking at return outcomes, then retain the coarsest cadence that preserves the required microstructure states.

Raw trade/book event archives, if ever needed, should have short retention or a storage tier designed for bulk event data rather than silently consuming the existing trading D1.

Status: STORAGE BUDGET FROZEN AS A PILOT CONSTRAINT.

---

## MS-031 — Research bucket schema: preserve dynamics, not every message

A compact bucket should retain enough information to distinguish consumption, replenishment, spread stress and price response.

### Identity / provenance
- tradeDate
- symbol
- bucketStart / bucketEnd
- source
- schemaVersion
- capturedAt
- pointInTimeEligible
- collectorVersion

### Coverage
- connectedMs / expectedMs
- bookMessageCount
- tradeMessageCount
- reconnectCount
- coverageState = COMPLETE / PARTIAL / UNKNOWN
- firstProviderTime / lastProviderTime

### Price / spread
- midOpen / midClose
- midHigh / midLow
- spreadTicksOpen / Close / Min / Max
- spreadBpsOpen / Close / Min / Max
- weightedMidProxyOpen / Close where L1 sizes are present

### Depth
- bidDepth1Open / Close / Min / Max
- askDepth1Open / Close / Min / Max
- bidDepth5Open / Close
- askDepth5Open / Close
- depthImbalanceOpen / Close / Min / Max

### Dynamic liquidity
Computed from incoming book changes before aggregation:
- bidDepletionQtyProxy
- bidReplenishmentQtyProxy
- askDepletionQtyProxy
- askReplenishmentQtyProxy
- bidPriceStepCount
- askPriceStepCount
- spreadWidenCount
- spreadNarrowCount

Call these proxies unless event semantics prove exact cancellation/addition classification.

### Trades / pressure
- tradeCount
- tradeVolume
- tradeAtAskVolumeProxy
- tradeAtBidVolumeProxy
- midpointOrUnclassifiedVolume
- pressureProxy
- pressureToPriceResponse

### Mechanism guards
- anyTrial
- allContinuous
- anyLimitUp / anyLimitDown
- anyLimitHalt / delayed state
- oddLot = false for the initial regular-lot lane

This preserves the variables needed for MS-013–015 without storing every individual quote forever.

Status: MINIMUM AGGREGATED DATA CONTRACT FROZEN.

---

## MS-032 — Completeness is part of the feature, not housekeeping

Microstructure is unusually vulnerable to silent data gaps: losing a few seconds can turn “replenishment” into “no replenishment” or reverse an imbalance state.

Therefore every bucket/session requires explicit quality state.

### Hard rules
1. Missing connection interval is never filled by carrying forward the last book and pretending it was observed.
2. A reconnect starts a new coverage segment.
3. Provider timestamp order violations are logged; do not silently sort away evidence of delivery anomalies.
4. Fugle trade serial may be stored as diagnostics, but continuity must not be assumed without validating its semantics for the exact channel/session.
5. Book channel has no documented sequence number in the current schema; absence of an update cannot prove that the book was unchanged during a connection gap.
6. Fugle heartbeat is every 30 seconds; heartbeat/connection state can prove liveness only at that level, not every individual market event.

Source:
- https://developer.fugle.tw/docs/data/websocket-api/getting-started/

### Research inclusion
Primary inferential analyses should require COMPLETE or a pre-registered minimum coverage ratio. PARTIAL data can be used for data-quality diagnostics but must not be automatically classified as negative market states.

### Falsification
If complete-coverage samples become too small after honest quality gating, the correct result is INSUFFICIENT_DATA, not relaxing the quality definition until significance appears.

Status: COVERAGE CONTRACT FROZEN.

---

## Fifth synthesis — feasibility result

The key result from MS-025–032 is:

> The microstructure idea is technically feasible, but the correct bottleneck is prospective, complete data collection—not another formula.

We already have coarse spread/depth snapshots. The missing information is dynamic:
- consumption,
- replenishment,
- pressure persistence,
- spread recovery,
- transaction intensity,
- pressure-to-price response.

Those need a separate collector or an equally isolated prospective stream. The collector's first objective is **data fidelity**, not trading performance.

## Exact next continuation after MS-032

MS-033: Order-flow toxicity and the VPIN debate — learn why “toxic flow” can be useful conceptually but dangerous as a magic indicator.
MS-034: Hidden liquidity / iceberg / spoofing boundaries — what can and cannot be inferred from public top-five depth.
MS-035: Queue position and fill probability — distinguish signal quality from limit-order execution probability.
MS-036: Market impact decomposition — temporary vs permanent impact and implications for chasing.
MS-037: Intraday event studies around breakout/failed breakout with microstructure states.
MS-038: After the concept lane, evaluate whether a separate collector proposal should be prepared; no deployment without infrastructure/quota review.
