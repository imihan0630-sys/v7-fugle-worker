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
