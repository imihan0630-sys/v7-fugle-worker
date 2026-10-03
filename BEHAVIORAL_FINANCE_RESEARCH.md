# Behavioral Finance / Investor Attention Research

Updated: 2026-10-02 Asia/Taipei
Scope: D20
Status: RESEARCH LANE INITIALIZED / NO EVIDENCE YET

This lane studies attention, sentiment, under/overreaction, anchoring, disposition, overconfidence and herding while preserving a strict firewall against anthropomorphizing price action or claiming actor intent without evidence.

## 2026-10-02｜Foundation cluster: reference dependence, disposition and attention

### D20-01 Prospect Theory / Loss Aversion
- Foundational mechanism: outcomes are evaluated relative to a reference point rather than only final wealth; the classic model combines reference dependence, diminishing sensitivity and probability weighting.
- Research boundary: prospect theory is a descriptive decision model, not a direct stock-return signal. A stock being down, volatile or heavily traded does not identify loss aversion.
- Critical falsification: later theoretical work shows that a simple annual gain/loss implementation of prospect theory can fail to predict the disposition effect or can predict the reverse pattern. Reference-point definition, updating and realization utility matter.
- Additional caution: the universality/strength of loss aversion is debated; context and reference-point construction can change the asymmetry.
- D20 implication: every market hypothesis must pre-register the reference point, evaluation horizon, aggregation rule and observable proxy before testing.

Key references:
- Kahneman & Tversky (1979), Econometrica, Prospect Theory: An Analysis of Decision under Risk.
- Barberis & Xiong (2009), Journal of Finance, What Drives the Disposition Effect?
- Gal (2018), Journal of Consumer Psychology, critical review of loss aversion.
- Reference-Dependent Preferences review, Handbook of Behavioral Economics (2018).

### D20-02 Disposition Effect
- Definition: a higher propensity to realize gains than losses, often summarized as selling winners too readily and holding losers too long.
- U.S. evidence: Odean (1998) used 10,000 brokerage accounts and found stronger realization of gains; rebalancing and low-price transaction-cost stories did not explain the full pattern, and sold winners subsequently outperformed retained losers.
- Taiwan evidence 1: a brokerage dataset covering 53,680 individual accounts and 10,883,473 transactions from 1998-01 to 2001-09 reported PGR≈0.35 and PLR≈0.14, with a gain/loss realization ratio around 2.5.
- Taiwan evidence 2: all TWSE trading activity over the five years ending in 1999 showed aggregate investors were about twice as likely to sell when holding a gain; 84% of investors sold winners faster than losers. Mutual funds and foreign investors were notable exceptions.
- Falsification / competing explanations: tax-loss incentives, rebalancing, liquidity, transaction costs, expected mean reversion, information-based selling, investor-type heterogeneity, margin constraints and price-limit mechanics.
- Important theory check: disposition behavior should not be labeled “loss aversion” automatically because prospect-theory implementations can generate different predictions.
- Research-only candidate: aggregate unrealized capital-gain proxies may help explain momentum-like underreaction, but they require PIT-valid holdings/reference-price reconstruction and redundancy tests versus direct momentum.

Key references:
- Shefrin & Statman (1985), Journal of Finance.
- Odean (1998), Journal of Finance.
- Barber, Lee, Liu & Odean (2007), European Financial Management, Taiwan complete-market evidence.
- Grinblatt & Han (2005), Journal of Financial Economics.

### D20-04 Anchoring / Reference Dependence
- Mechanism: market participants may evaluate prices relative to salient reference points such as purchase price, expected price, recent high or historically salient levels.
- Taiwan evidence: a 2023 Taiwan-market study reports that the lottery-like-stock anomaly is concentrated among stocks farther from their 52-week highs and that investor attention conditions the anchoring relation.
- Strong redundancy warning: distance to a 52-week high is mechanically related to trend, momentum, breakout state and price position. It cannot be counted as independent behavioral alpha until residualized against D01/D03 price-family variables and D04 volatility.
- Falsification: if the apparent anchor effect disappears after controls for momentum, volatility, liquidity, sector and attention, the behavioral interpretation should be rejected or downgraded.

### D20-07 Investor Attention / Salience
- Core mechanism: bounded search means attention can change the consideration set before preferences determine the final purchase.
- General evidence: individual investors are net buyers of attention-grabbing stocks such as names in the news, abnormal-volume stocks and extreme one-day movers.
- Taiwan evidence: 2005-2009 TWSE transaction data show extreme returns attract both individuals and institutions; volume acts as a conditional attention trigger especially for individuals, and the effect weakens during the 2007 financial-crisis regime.
- More recent Taiwan evidence: Google-search-based attention proxies have been associated with higher future crash risk, especially in OTC firms and firms with higher natural-person ownership.
- Falsification: search/news/volume spikes may be responses to information, liquidity shocks, manipulation or already-moving prices. Therefore external attention proxies and endogenous market proxies must be separated.
- Incremental-value gate: abnormal volume and extreme return are already D02/D03 families; they cannot be reintroduced as a second “behavioral vote”. A D20 attention feature must add out-of-family information after controls.

### Cross-module conclusions
1. Behavioral finance is useful only when translated into observable, timestamped, falsifiable variables.
2. “Psychology” is not an excuse to anthropomorphize OHLCV.
3. Reference-point specification is the central identification problem for D20-01/02/04.
4. Attention is best modeled as a choice-set/filter mechanism, not automatically a bullish/bearish signal.
5. Taiwan evidence is strong enough for theory/mechanism/falsification maturity, but not yet for L3 because our own PIT/replay data contracts are not validated.
6. Formal Core remains unchanged.

### Next research
- D20-03 Overconfidence: separate turnover/trading-frequency proxies from information arrival, volatility and wealth effects.
- Build Taiwan PIT/replay feasibility contracts for D20-01/02/04/07.
- For attention, prioritize external/search/news exposure proxies; treat price/volume-derived proxies as comparators to avoid double counting.

## 2026-10-03｜D20-06 Herding and D20-10 Investor Sentiment

### D20-06 Herding / Social Proof
Mechanism:
- Behavioral herding means synchronized action caused by imitation, social inference, leader/follower behavior or related behavioral transmission.
- Observable crowding is not sufficient. Holdings concentration, margin concentration, institutional flow persistence and common price movement can arise from shared information, mandates or mechanical flows.

Positive Taiwan evidence:
- Chang, Cheng and Khorana (2000) report significant Taiwan herding using nonlinear return-dispersion methods.
- Demirer, Kutan and Chen (2010) show method dependence: linear CSSD is weak while nonlinear CSAD and state-space methods find stronger herding, particularly during market losses.
- Hsieh (2013) uses investor-identity intraday data and finds both institutional and individual herding, but with different subsequent return patterns, implying different information/behavior mechanisms.
- Recent Taiwan studies report time-, venue-, investor-type- and microstructure-dependent herding.
- Real-time forum stance/sentiment research in Taiwan provides a possible behavior-specific data family beyond static holdings/flow concentration.

Falsification:
- Low return dispersion can result from common fundamentals, factor exposure, benchmark rebalancing, liquidity shocks or common risk constraints.
- High crowding can exist with behavioral herding UNKNOWN.
- Synchronized institutional action can be information-based rather than imitation.
- Market-design reforms can change measured synchronization.

Research contract:
- D06-06 owns static/flow crowding primitives.
- D20-06 must use independent behavior-specific evidence or a residual-herding test after D06, market, sector, factor, event/news, passive-flow and liquidity controls.
- Preferred tests: actor-level residual synchronization; leader/follower temporal ordering; independent social/network evidence; residual convergence after common-information controls.
- CSSD/CSAD are screening/measurement tools, not motive proof.

Decision:
- D20-06 -> L2.
- L3 blocked until a replayable Taiwan behavior-specific data stream is validated.
- No independent selection vote from the same crowding primitives.

### D20-10 Investor Sentiment
Mechanism:
- Investor sentiment is a non-fundamental optimism/pessimism state that may affect demand and prices when valuation is subjective and arbitrage is limited.
- Sentiment is not identical to attention, news tone, expected volatility, leverage, turnover or recent return.

Proxy taxonomy:
A. More direct/independent:
- investor surveys;
- investor/forum bullish-vs-bearish stance or textual emotion from a source distinct from news;
- account-level risk-taking/flow responses linked to independently measured sentiment.

B. Candidate indirect:
- overnight return where market-specific validation supports a sentiment interpretation;
- composite market-based sentiment measures after removing macro/fundamental/liquidity components.

C. Weak/non-identifying alone:
- VIX or option-implied volatility: expected volatility, not directional sentiment;
- margin balance: leverage/crowding context, not sentiment by itself;
- turnover/volume: attention/liquidity/information confounded;
- news sentiment: D17-08 event/news-text family, not an independent D20 vote.

Evidence and counterevidence:
- Baker and Wurgler show broad sentiment effects are stronger in difficult-to-value/difficult-to-arbitrage stocks, but this is a cross-sectional conditional effect rather than a universal timing rule.
- Taiwan research finds overnight return can behave as a sentiment proxy, including short-run persistence and long-run reversal, but cross-country studies show overnight return fails as a sentiment proxy in many non-US markets. Taiwan therefore requires its own validation rather than imported assumptions.
- Taiwan real-time public sentiment/stance data are associated with herding heterogeneously across investor classes and industries, supporting a distinct social-sentiment family.
- Meta-analysis of survey sentiment-return research finds non-negligible but smaller-than-reported effects and material publication/design heterogeneity.
- A 2024 proxy-validation study warns that news/text measures can contain information content rather than pure sentiment; a long-run price effect can signal information contamination.

Semantic boundaries:
- D17-08 owns news/event-text sentiment tied to publication clocks and event half-life.
- D20-10 owns broader investor sentiment only if it uses independent proxy families and behavioral falsification.
- D20-07 owns attention; search intensity without direction is attention, not sentiment.
- D12-05 owns Taiwan VIX as expected-volatility information.
- D06 owns margin/crowding primitives.
- D02/D03 own price/volume/return families.

Decision:
- D20-10 -> L2.
- L3 blocked until a Taiwan PIT/replay sentiment source is validated with first-known timing and revision policy.
- Default system role remains RESEARCH_ONLY / CONTEXT_ONLY or SUPPORTIVE until OOS/prospective evidence demonstrates incremental value.

### Shared implication
Behavioral-finance evidence must add a genuinely new observable family or residual mechanism. Re-labeling existing price, volume, flow, leverage, news or volatility inputs with a psychological name cannot create additional evidence weight.

## 2026-10-03｜D20-08 Underreaction / Post-event Drift and D20-09 Overreaction / Reversal

### D20-08 Underreaction / Post-event Drift

Mechanism:
- Underreaction is a horizon-specific failure to incorporate information fully at the first decision-relevant price.
- A valid behavioral claim requires an identified information event, a first-known timestamp, a pre-specified surprise or information-content baseline, an initial response window, and a later drift window.
- Generic momentum is not sufficient evidence because continuation can arise from trend exposure, gradual fundamental information, risk compensation, liquidity, delayed institutional flow or market-state persistence.

Taiwan evidence:
- Lin, Ko, Chen and Chu (2016) find strong earnings momentum in Taiwan and stronger profits where information arrives more continuously; results are consistent with underreaction and attention mechanisms.
- A 2026 study of record-high Taiwan monthly-revenue announcements finds next-day intraday reversal together with significant positive buy-and-hold returns over the following 20 trading days.
- The coexistence of short-horizon reversal and medium-horizon drift around the same event shows that overreaction and underreaction labels must be tied to time horizon rather than applied to an entire price path.

Required controls:
- event first-known timestamp and after-hours publication;
- surprise definition versus simple realized growth;
- pre-event return and attention;
- institutional net flow;
- market/sector return and liquidity;
- analyst revisions and common information;
- price-limit regime;
- transaction costs and short-sale feasibility.

Research contract:
- Separate event-day, next-day, 5-day, 20-day and 60-day outcomes.
- Do not infer underreaction from generic momentum.
- L3 requires a replayable Taiwan event ledger with first-known clocks and frozen outcome windows.

Decision:
- D20-08 -> L2.
- No L3 promotion.
- Formal Core unchanged.

### D20-09 Overreaction / Reversal

Mechanism:
- Behavioral overreaction means price moves beyond what the information/economic state can justify because beliefs or demand respond excessively.
- Reversal is an observable price outcome; it is not proof of overreaction.
- D03-05 remains owner of pullback/short-term reversal as a price phenomenon. D20-09 must own an independently identifiable behavioral cause.

Positive evidence:
- De Bondt and Thaler (1985) provide classic long-horizon loser/winner reversal evidence consistent with overreaction.
- Taiwan price-limit studies document overnight continuation and subsequent intraday reversal after limit moves, interpreted as delayed overreaction/correction under the historical price-limit regime.
- Yang, Chu, Ko and Lee (2018) report Taiwan continuing-overreaction portfolios, formed using signed-volume information, show intermediate continuation followed by long-term reversal; price limits appear to restrain the measured effect.
- Taiwan intraday-versus-overnight momentum research finds opposite continuation/reversal implications across return components, reinforcing horizon and market-structure dependence.
- The 2026 record-high monthly-revenue study finds short-horizon reversal after salient announcements but medium-horizon positive drift, showing that a reversal does not characterize the entire event response.

Structural counterfactuals:
- bid-ask bounce;
- liquidity provision and temporary price impact;
- dealer/inventory effects;
- forced liquidation or margin calls;
- index/passive flow;
- event correction as new information arrives;
- volatility normalization;
- price-limit mechanics;
- stale-price/opening effects.

H07 ownership firewall:
- D03-05 owns observable reversal geometry and PIT replay.
- D20-09 can remain separate only if it can detect behavioral/event-expectation evidence before or independently of the completed reversal.
- Prior extreme return + later reversal alone is a narrative relabel and cannot become a second vote.
- Shared return/volume rows are recorded once.

Decision:
- D20-09 -> L2.
- No L3 promotion until a Taiwan PIT-valid causal proxy survives structural alternatives.
- Formal Core unchanged.

### Joint implication
The same event can display:
1. an immediate attention-driven overshoot;
2. short-horizon reversal;
3. incomplete medium-horizon information incorporation;
4. later drift.

Therefore D20-08 and D20-09 must be modeled as horizon-specific hypotheses with explicit event clocks, not opposite one-word labels assigned to a whole chart.

## 2026-10-03｜D20-05 Representativeness / Recency

### Mechanism
- Representativeness is a belief-formation heuristic in which a recent pattern is treated as representative of an underlying state or type, with insufficient weighting of base rates.
- Recency/extrapolation places excessive weight on recent observations when forming expectations.
- Neither mechanism is identified by recent return strength alone.

### Integrated behavioral models
- Barberis, Shleifer and Vishny (1998) show that conservatism and representativeness can jointly generate underreaction to isolated news and overreaction after repeated similar news.
- Daniel, Hirshleifer and Subrahmanyam (1998) show that continuing overreaction can generate short-run momentum and later long-run reversal; therefore positive autocorrelation is not uniquely an underreaction signature.
- Modern extrapolation evidence shows that investor expectations often rise after past returns, while direct expectation measures can disagree sharply across investor groups.

### Taiwan evidence
- Hao, Chu, Ho and Ko (2016) compare 52-week-high anchoring and recency in Taiwan. Results are mixed: recency profitability depends materially on era and market state, while anchoring and recency can coexist.
- This evidence rejects a universal recency factor. A price-history construction can be useful as a hypothesis proxy but remains highly overlapping with momentum, anchoring, price position and regime.
- Taiwan event evidence from D20-08/D20-09 also shows that short-horizon reversal and medium-horizon continuation can coexist, making a single recent-return label inadequate.

### Direct/near-direct evidence hierarchy
Stronger:
- investor expectation surveys linked to actual behavior;
- administrative trade data linked to independently measured extrapolative forecast bias;
- repeated belief updates around controlled or well-identified information sequences.

Weaker:
- chronological ordering of past returns;
- nearness/date of the 52-week high;
- recent winner/loser status;
- raw momentum/reversal.

### Structural and overlap controls
Any D20-05 proxy must be compared with:
- D20-04 anchoring;
- D20-08 underreaction;
- D20-09 overreaction;
- D03 direct momentum/reversal;
- volatility and regime;
- valuation/fundamental changes;
- attention and news/event salience.

### Decision
- D20-05 -> L2.
- Remains OBSERVATION / RESEARCH_ONLY.
- Price-only proxies are not sufficient for L3.
- If no independent expectation/behavior observable or residual incrementality survives, prepare a merge proposal into the D20 behavior-response family rather than preserve a duplicate factor.
- Formal Core unchanged.

## H07 Room-13 evidence contribution — D03-05 vs D20-09

### Semantic ownership
- D03-05 owns observable pullback / short-term reversal geometry.
- D20-09 owns behavioral overreaction only when a causal/behavioral mechanism is independently identifiable.

### Shared observables
Past return, reversal magnitude, OHLCV, volatility and price-limit state are shared controls/phenomena, not independent votes.

### D20-09 unique evidence candidates
- event expectation gap combined with overshoot/correction;
- investor-type order-flow or behavioral response that temporally precedes reversal;
- independently measured sentiment/attention state that predicts overshoot after controlling event fundamentals;
- continuing-overreaction constructions that survive liquidity, price-limit and direct-momentum controls.

### Alternative explanations
Bid-ask bounce, inventory effects, liquidity provision, forced flow, event correction, volatility normalization, stale opening prices and price-limit mechanics.

### Divergent-state examples
1. Reversal without behavioral overreaction: temporary liquidity pressure is mechanically corrected.
2. Behavioral overreaction possible before completed reversal: identifiable event/expectation evidence plus excessive demand relative to fundamentals.
3. Continuing price movement with eventual correction: overreaction can coexist with short-run momentum.
4. Event-day overshoot followed by medium-term drift: short-horizon overreaction and longer-horizon underreaction can coexist.

### Terminal specialist view
KEEP_SEPARATE_CONDITIONAL_ON_BEHAVIOR_IDENTIFIABILITY / PHENOMENON_CAUSE_FIREWALL.
If D20-09 is operationalized only as extreme prior return plus later reversal, it should be narrowed/merged rather than receive an independent behavioral vote.
Formal Core unchanged.

