# D01 Sara Wang 金包銀 — causally frozen 60-minute research proxy and D16 future-validation freeze (2026-10-10)

Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / PROXY_ORACLE_FROZEN / NOT_FORMAL / NOT_L4
Room: 01｜K線與型態研究室
This follows the durable intake in research/D01_SARA_WANG_JIN_BAO_YIN_STRATEGY_RESEARCH_20261010_V0_1.md, and is an outcome-blind experiment design, not proof of trading efficacy.
The owner's highest-priority claim to challenge is that **already rising individual-stock trend + pullback + reacceleration** improves win rate relative to bottoming/reversal cases.
No proprietary Sara indicator or unpublished original thresholds were obtained. The strict pattern proxy here is our preregistered **research approximation**, not a statement of the author's full canonical source code.

## 1. Frozen exposure classes before outcome access

### Pre-pullback frozen individual-stock trend
Use the **last completed daily session strictly before pullbackStart**, NOT the signal bar or after the recovery:
- 65 completed pre-start daily bars, source vintage available by pullbackStart;
- daily 20-MA > daily 60-MA, daily 20-MA > its value five eligible sessions before, and positive 20-session trailing return => PRIOR_UPTREND;
- the full reverse signs => PRIOR_DOWNTREND;
- all other observable states => MIXED; incompleteness => UNKNOWN_BLOCKED.
These are *new fixed proxy research parameters*, not author-specified parameters. They are not independent confirmation votes over the same OHLC parent.
A causal pullback-witness receipt is required for T; an already rising moving average alone does not establish a pullback.
Trend state is fixed at pullback start and cannot be rewritten by the rebound's later bars.

### 60-minute ("60m") strict gold-wrapped-silver proxy
The required physical inputs are native provider 60-minute closed bars, provider bucket/partial-bar semantics and exchange symbol-session coverage:
- >=245 *observed completed 60m buckets* for SMA240 and five-bucket slope; never approximate by 245 calendar hours or 245 daily bars;
- mathematically reproducible simple average of closed bars, period set: 5/10/20/60/120/240;
- 60-bar line rising compared to five 60m bars before;
- 120/240 above 60 and both not rising (down/flat overhead); short order 5>10>20>=60, 5 below nearer 120/240 overhead;
- last closed-bar price in (MA60, min(MA120, MA240));
- any of prior five fully observed bar ranges comes within *illustrative fixed 2% of the current MA60*.

This last proximity parameter is a bounded research proxy, NOT a source-verified author rule. A historical dynamic support-distance path would be more faithful; the frozen version tests reproducibility but is not allowed to claim original-strategy parity. Explicitly compare a strictly frozen pattern to an ordinary rising-60m-MA pullback and to a separate broader pattern family, not blend parameter families after observing winners.

Unresolved calendar bucket / 240-bar warmup / OHLC price-space continuity / corporate-action factor vintage / symbol lifecycle / missing intra-day bars => UNKNOWN_BLOCKED, not negative signal or successful nonentry.
Prediction cutoff is the **completed and available** last 60m bar; do not use partial closing bar or later-known bar rewrite.

### Non-overlapping cohorts and unit of counting
T_TREND_PULLBACK (owner priority): strict 60m proxy + frozen prior daily uptrend + verified pullback.
B_BOTTOM_REVERSAL: strict 60m proxy + frozen prior daily downtrend.
M_MARKET_BULL_ONLY: strict 60m proxy + observable neutral/mixed individual-stock prior trend, plus independent pre-cutoff market bullish receipt.
N_UNKNOWN: unverified trend, mixed stock with unproven market status, unknown pivot parent, missing source, invalid price continuity, etc. No automatic upgrade from UNKNOWN to B/M.
Separate NOT_GOLD_WRAPPED_SILVER_PROXY denominator; do not treat non-signal as a trade.
A signal episode identity depends on immutable securityIdentity, structuralRootId, pullbackStart. Multiple 60m signals in the same episode are **one independent opportunity**, and must not be counted as 4 winning trades. Cross-security group/circular sector overlap handled by upstream D01/D09 and D16 cluster logic.

## 2. Causal no-lookahead adversarial oracle

Research-only source:
- research/d01_sara_jinbaoyin_causal_oracle_v0_1.mjs
- research/test_d01_sara_jinbaoyin_causal_oracle_v0_1.mjs

46 synthetic adversarial cases freeze:
- real 60m bar period semantics and 245-bar warmup;
- knownAt/completedAt cutoff and future prefix invariance;
- bars from partially observed or unknown owner coverage blocked;
- raw vs adjusted price-space factor-version certification;
- malformed OHLC, duplicate/out-of-order bars blocked;
- short- and long-average geometry incl. support retest, proxy-not-author warning;
- causal daily up/down/neutral state frozen *before* pullback start;
- late revised prior bars and post-signal daily future excluded;
- T/B/M/UNKNOWN classification, real pullback-witness rule, stable parent episode ID;
- duplicates and missing signals accounted in denominator, without access to trading outcomes.

Test execution receipt: the ChatGPT JavaScript V8-isolate evaluator read both repository source files and performed **46/46 PASS**. This is isolated logic execution, NOT native Node execution, not repository CI, not physical market-data validation, and not a combined test with previously accepted D01 suites. Container raw GitHub retrieval was unavailable due to DNS/tool restriction; no claim of native run is made.

This oracle exercises API contracts and adversarial behaviors, not the real-world accuracy of the practitioner's strategy description. Without complete 60m rows and the author's proprietary indicator, exact historical author signal-reproduction remains NOT_VERIFIED.

## 3. D16 prospective & OOS trial preregistration — outcome joins still CLOSED

Experiment identifier: SARA-JBY-01 / family of 4 pre-declared research comparisons, not 4 independent alpha votes.
Primary hypothesis: T has higher *net-of-cost* probability of positive realized 10-eligible-session return (one first executable post-confirmation entry per independent episode) than B on matched and available support.
Secondary measures: mean/median net return, downside excursions MAE, upside excursions MFE, and drawdown/stop behavior; transaction costs and nonfill opportunity coverage.
Primary 10-session horizon is a **proposed frozen research horizon, not the author's stated universal holding rule** and requires D16 sign-off before outcomes.
No strategy hit rate, including marketing claims of 80%-90%, should be called proven until the primary measure, full signal count and disjoint test period have passed.

**Four families** (not tuned once outcomes are visible):
1. T vs B vs M within contemporaneous regimes, liquidity/cost support and price-state controls.
2. Strict gold-wrapped-silver proxy vs generic already-rising-60m-MA support/retest and prior-return/daily-MA controls; residual vs D03 PRICE_OHLC alias family and Formal A/B inputs.
3. T within market-bull vs market-nonbull states, separate stock trend and broad-market trend, avoid sector self-contribution and future regime labels.
4. Frozen overhead 120/240 target geometry and stop/risk controls vs the existing D01-11 structural resistance / nearest-real-RR comparator; no re-anchoring target to later MA levels after seeing the outcome.

**Trading realism prerequisites** before outcome access:
- position entry price/time must be a verified first legal/available executable quote *after* the signal bar; the next bar open is a hypothetical baseline only where a valid order/fill path is modeled.
- forbid same-bar close entry when the bar was used to compute the confirmation; knownAt and liquidity receipts must align.
- pre-freeze price limit, odd-lot/lot size, suspension/disposition matching states; no fill claimed from high/low touch alone.
- transaction cost model includes TWSE/TPEx trading tax and commissions applicable at trade date, spread/slippage, market-impact/capacity and execution failures per D05/D15 owner receipts.
- stop-loss case inspired by practitioner's 60m life-line/3%-below example is separate, not automatically the core profitability metric; handle within-bar stop-vs-target ordering as AMBIGUOUS unless lower-timeframe ordered execution evidence exists.
- horizon measured in verified eligible sessions, not calendar days; late or missing outcomes right-censored under frozen denominator policy.
- no 2024 final holdout consumption for interface debugging; sample/vintage universe excludes only preregistered inadmissible rows and preserves blocked counts.

**Denominator reporting** mandatory in each D16 readback:
raw candidate rows, source blocked, warmup short, nonpattern, T/B/M, mixed unknown, repeated episodes, unique opportunity episodes, legal executable/filled/unfilled, censoring, multiple-date/group cluster identifiers, sector/industry/taxonomy versions, opportunities with both comparator and child on the exact same available source support.
A higher hit rate that vanishes after generic trend control or disappears after realistic fees/slippage is rejected as independent Pattern alpha.
D16 owns purging/embargo, multiplicity and true prospective/OOS; D01 cannot claim statistical power/causal efficacy here.

## 4. Explicit research limitations and counterexamples

- **Structural conflict**: highly established individual-stock uptrends can have 120m/240m moving averages rising together, so the strict downward-overhead 120/240 proxy may exclude strong uptrends. This is a geometry/definition conflict, not proof that trend-pullbacks fail. Preserve a distinct generic-uptrend-pullback comparator, never silently relax strict Sara proxy ex-post.
- **Trend confirmation hindsight**: label based on price just before the signal might convert a bottoming B into successful T. Freeze at actual pullback start instead.
- **Wins-only selection**: case studies omit failures, range-bound stalls and unfillable patterns; require every eligible episode and NULL outcomes with denominator.
- **Double counting**: 5/10/20/60/120/240 moving averages, candle patterns, D03 EMA/MA and price-derived sector strength may be transformations of the same price information. One shared PRICE_OHLC root until residual is demonstrated.
- **Survivorship and revision**: all current survivors/current sector labels cannot define the historical opportunity population; corrected price bars need point-in-time revision IDs.
- **Author fidelity uncertainty**: no claim of 1:1 Sara app reproduction, and no claim of validated 80–90% win rate.

## 5. Governance and exact next

- Class A research only. No change to A/B, 3+3/Top6, selection, scoring, capital, stop, push, monitor, Worker, D1, production.
- D01-03/04/05/10/11 consume research context; no extra separate K-line module added. D01 remains 11/11 modules >= L2, all L3/60.0%; alpha UNKNOWN.
- SDA-001 and SDA-002 remain open; independent D16/00 closure required.
- Mainline DL-147 taxonomy-bridge continuation and historical 1101/2021-06-15 R1-R6 physical witness still await their existing owners; this dedicated Sara intake does not reassign them.

**Exact next for Sara track**:
1. Obtain authoritative physical 60m data/provider bucket contract and matching daily bars with knownAt and adjustment vintage for one preselected event-free ordinary stock/date chosen without outcomes. No backfilled current adjusted-only historical chart allowed without revision lineage.
2. Independently run native Node and/or GitHub CI research test; distinguish from 46/46 isolated V8 evaluation.
3. Validate coverage, prefix invariance and author-vs-proxy signal disagreement against source explanations without outcome join.
4. Lock D16 primary cutoff, entry fill and cost/horizon contract; after verified real research population, request D16 approval for prospective/OOS study. NEVER automatically push to Formal system.
