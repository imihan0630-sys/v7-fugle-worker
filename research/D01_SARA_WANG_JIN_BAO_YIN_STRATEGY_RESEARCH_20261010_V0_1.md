# 01｜莎拉型態學 — 金包銀策略：研究假說登錄 v0.1

Recorded: 2026-10-10 Asia/Taipei
Owner: 01｜K線與型態研究室 / D01
Status: KNOWLEDGE_CAPTURED / RESEARCH_HYPOTHESIS_REGISTERED / FUTURE_VALIDATION_PENDING
Scope: Class-A research documentation only. NO Formal/Worker/D1/production, no capital/signal/rank/Top6 change, no trade order.
Original practitioner: Sara Wang（莎拉）/ 新式型態學（public primary authored examples）.
User priority as of 2026-10-10: 金包銀「勝率可能在個股原有上升趨勢中的拉回再攻時更高」— a **high-priority falsifiable user hypothesis**, NOT yet an author-verified universal rule, and NOT a proven hit rate.

## 1. Evidence tiers (author's statements vs user hypothesis vs research extensions)

### A. Public practitioner descriptions (primary authored examples)
- The reference chart is a **60-minute candlestick interval**, not the daily 60-day moving average.
- Overhead 120MA or 240MA often slopes downward and acts as pressure; rising/turning-up 60MA is the lower dynamic "life line" / support; 5MA, 10MA, 20MA oscillate in the interval.
- Described favorable transition: the 5/10/20MA short averages finish a consolidation/washout and form a bullish ordering; the price may then test/break overhead resistance.
- Often discussed when the **broad market** is bullish and funds rotate into lower-position or beaten-down issues.
- Author examples expressly include bottom-turn candidates; therefore **an already rising individual-stock daily trend is NOT established as a compulsory original-definition predicate**.
- Public trade examples can mention entry near rising 60m 60MA support and management at 120/240MA or using moving averages after a breakout. This is example guidance, not a fully disclosed universal deterministic implementation.
- Statements of an 80–90% win rate or highlighted winners are promotional/practitioner claims unless full population, losing signals, cutoff, outcome horizon, trade prices, fees and independent replay are supplied. Not established as D01 alpha.

### B. Owner priority hypothesis (2026-10-10)
**H-SARA-01: Continuing-uptrend pullbacks that regain 60m support and restart may have better net risk-adjusted success than bottoming/reversal gold-wrapped-silver signals, when tested on comparable opportunities.**

Priority = HIGH to falsify; status = NOT_VALIDATED.
Clarification of time scales: "prior uptrend" refers to a *separately frozen higher-timeframe prior advance* as of the first pullback, while the 60m intermediate 120MA/240MA may still point down locally. No condition may use future highs/lows or trend labels confirmed after the decision.
Why potentially useful: trend persistence + lower-risk retest + reduced distance to invalidation, whereas bottom-catch versions face downtrend continuation. Why it could fail: selection of already winning issues, regime confounding, later pullback identity, survivorship, self-overlap with existing MA/trend factors, worse reward-to-resistance after advanced runs, momentum crowding and costs. Results UNKNOWN.

### C. Separate cohorts — never mix in claimed win rate
- **T / TREND_PULLBACK_REACCELERATION (priority comparison):** eligible stock with pre-pullback bullish higher-timeframe structure, prior advance observable before pullback, bounded correction toward rising 60m 60MA, no proven structural failure at signal time, and contemporaneous short-MA recovery / potential reacceleration. Original 60m gold-wrapped-silver geometry must be confirmed separately. A trend-pullback alone is NOT equivalent to a gold-wrapped-silver signal.
- **B / BOTTOM_REVERSAL_EMERGENCE (control):** prior individual-stock declining/sideways context, initially depressed price, 60m 60MA turning upward inside downward 120/240 overhead structure and short-MA recovery. Must keep all failure cases.
- **N / NO_OR_AMBIGUOUS_TREND:** insufficient lookback, mixed trend, corporate-action discontinuity, high/low overlap, unknown session clock or unverified lifecycle — retain in denominator as UNKNOWN, not silently dropped.
- **M / MARKET_BULL_ONLY:** same gold-wrapped-silver geometry and broad-market uptrend, but no certified pre-pullback individual-stock uptrend. Separate broad market trend from stock trend to avoid confusing the two.

Classification is causal and non-overlapping on an explicitly preregistered opportunity-date scope; contradictory context => UNKNOWN. Repeated 60m signals from the same structural parent are one episode, not independent wins.

## 2. Deterministic research-only feature freeze proposals (not author-specific numerical thresholds)

Source 60m bar series:
- open/high/low/close/volume, session calendar, time-zone, provider id/source revision, native 60m bar bucket edges, partial final bar semantics, knownAt/availableAt, raw vs adjusted continuity and corporate-action provenance.
- MA5/10/20/60/120/240 calculated on **completed** 60m bars using an explicitly frozen algorithm, warmup coverage and missing-bar rules. 240MA requires sufficient physically observed 60m history, not 240 daily bars. Do not assume a 60m bar count per TWSE/TPEx day without observing the data provider's session/bucket contract.
- above/below and distance-to 60MA support; slope/turning of 60MA measured only on t-known bars; 120/240MA overhead pressure presence, proximity and slope; short-average containment and ordering; attempted resistance break, failed break and retest episode lifecycle.
- Higher-timeframe *prior* trend: completed daily bars, causal prior higher-high/higher-low or preregistered positive trend alternatives; freeze the trend state before the pullback begins. "Uptrend" must be defined ex ante in several limited comparator families, never fitted ex post on winners.
- Pullback episode: parent advance identity, pullback start firstObservableAt, max pullback observed AS OF signal, support test status, reversal/reacceleration firstObservableAt, failure/expiry and next-opportunity episode namespace.
- Environment / comparators: market regime independently known at cutoff (D18 owner), sector context PIT (D09 owner), liquidity/spread and cost coverage (D05/D15 owner), corporate action/lifecycle eligibility (existing D01 owner interfaces); do not invent positive values when sources missing.
- An optional author's proprietary 心動指標 is NOT assumed reproducible or reverse-engineered from descriptions. Absent vendor computation => NOT_AVAILABLE, not neutral score.

Candidate state machine: SIGNAL_UNOBSERVABLE -> PATTERN_CONTAINED -> LIFE_LINE_TESTING -> SHORT_MA_RECOVERING -> PIVOT_TESTING -> BREAKOUT / FAILED / EXPIRED / UNKNOWN.
This is a proposed research abstraction, not claimed to be the author's exact software implementation.

## 3. Falsification / D16 contract

Preregister experiment **SARA-JBY-01** as research candidate, but do NOT start outcome joins at this intake stage.
Primary research questions:
1. Under strictly matched sector/date, liquidity, initial RR and signal price structure, does T outperform B and M, on complete valid signal denominators?
2. Is T's advantage, if any, still present after controls for past returns, generic 60m MA continuation, existing Formal A/B-related price features, D03 momentum, and a simpler ordinary rising-60m-MA pullback?
3. Does a claimed high hit rate depend on outcome threshold/horizon, chosen winners, reaching a moving 120/240 target, or ignoring whipsaws and failure lifecycle?

Must freeze exact event definition, permissible price-space, bar-cutoff and confirmation timing; price entry convention and realistic latency; fixed failure trigger/stop and cost; target reference *as of signal* (avoid dynamic future target leakage); return horizons; net win definition vs MFE/MAE; same-opportunity baseline; independent dates, overlapping episode clustering, purged OOS, multiple-testing family, brokerage fees, tax, spread/slippage and nonfilled events.
Report all cohort counts (N signals; unique symbol/date; repeated signal episodes; failed, missing, excluded, halted, price-limit, not executable), not just successful chart examples.
Recommended comparisons:
- H0: T and B have no stable difference in post-cost risk-adjusted success conditional on matched support;
- P1: gold-wrapped-silver geometry versus generic 60m rising-MA retest baseline;
- P2: T vs B across bull/bear market regimes without hindsight regime labels;
- P3: strict gold-wrapped-silver geometry versus loosely named "trend pullback", to detect relabeling bias;
- P4: target 120MA/240MA and resistance geometry vs existing D01-11 nearest-real-resistance/RR, with true as-of source.
Reject false alpha from duplicate PRICE_OHLC ancestry under SDA-001; enforce signal firstObservableAt and no future pivot under SDA-002.
No "80%/90%" upgrade without full frozen outcome data, event denominator and reproducible independent comparison; no optimization proposal until D16 prospective/OOS and 00 independent readback.

## 4. Dependencies and scope discipline
- D01-04 support/resistance; D01-05 breakout/failure; D01-07 base/topology; D01-10 multi-timeframe; D01-11 target/RR.
- D03 owns general MA momentum comparator; D16 owns OOS/falsification; D18 owns market regime semantics; D05/D15 owns costs/executability; 00 owns audit closure.
- No standalone score/independent Alpha vote, no A/B policy adjustment, no production scanner, notification, Worker or D1 change.
- This ad-hoc research intake does NOT replace D01's previously established main-line exact continuation after DL-146: DL-147 (taxonomy-bridge-version boundary) and physical 1101 / 2021-06-15 R1-R6 owner-evidence gate remain pending.

## 5. Sources and provenance

Public author/practitioner sources researched 2026-10-10:
1. Sara Wang (2024-07-17), 美利達 9914: https://www.cmoney.tw/notes/note-detail.aspx?nid=849592
2. Sara Wang, 信邦 3023, lower-position early-stage case: https://www.cmoney.tw/notes/note-detail.aspx?nid=784935
3. Sara Wang, 聯亞 3081 bottom-reversal example: https://cmnews.com.tw/article/sara-583b3488-d8cb-11ef-afd7-b54e9d40f2a1
4. Sara Wang, 奇鋐 3017: https://cmnews.com.tw/article/sara-5873320f-d8cb-11ef-88c3-74729034301f
5. Sara Wang, variant / downchannel cases: https://www.cmoney.tw/forum/article/164516548
6. Sara Wang, long-rising 60m life-line / overhead 240MA description: https://www.cmoney.tw/notes/note-detail.aspx?nid=951463
7. Sara Wang, 6-pattern taxonomy: https://cmnews.com.tw/article/sara-cbac2c0b-8df2-11f0-a041-cc8e4a292e35

Source limitations: Educational articles are self-selected public examples, not complete historical vendor triggers; full indicator source code, parameter implementation and losing-signal population unavailable. Retrieval channel for this turn: native web search (Firecrawl search returned 402 insufficient credits); don't claim primary app logic reproduction.

## 6. Next targeted science (deferred until a subsequent explicit research segment)

- Capture complete source-page verbatim-definitional differences across market-trend vs stock-trend vs price-level examples (without copying protected long text).
- Draft frozen t-available trend-state and 60m signal geometry with a no-lookahead synthetic oracle.
- Request a single period of genuinely independently preserved past 60m provider data before claiming historical coverage; if not available, mark DATA_BLOCKED.
- Freeze high-priority comparison T vs B vs M vs generic rising-MA pullback, with denominators and costs, before anyone opens future returns.
- Keep D01 official DL-147 exact next continuation unchanged. No L4, no added research module, maturity remains 60.0%; Pattern Alpha UNKNOWN.
