# Technical Indicator Research

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FALSIFICATION_IN_PROGRESS
Formal Core: LOCKED

## Purpose

This lane studies traditional technical indicators as measurable transforms of price/volume, not as folklore BUY/SELL rules.

Primary scope:
- KD / Stochastic Oscillator
- RSI
- MACD
- MA / EMA derived trend state
- ATR
- DMI / ADX
- Bollinger Bands
- ROC / Momentum
- OBV only as a Price-Volume auxiliary comparator

The lane is intentionally separate from K-line / Pattern research. Pattern topology/lifecycle asks whether a multi-stage geometric structure exists. Technical-indicator research asks whether transformed price/volume features add information beyond the raw trend, returns, volatility, support/resistance, Pattern and Price-Volume states already present in the system.

## Governance

- Formal Core remains LOCKED.
- No indicator may be promoted because it is popular or visually intuitive.
- Missing or semantically invalid evidence = UNKNOWN, never BAD/0.
- No historical Shadow fabrication.
- No outcome-driven parameter search before preregistration.
- Correlated indicators are not independent votes.
- A single indicator cannot rescue a structurally invalid setup.
- Any future Formal change requires positive evidence + counterevidence + PIT/OOS/Shadow + independent-date + regime + redundancy + cost + overfit gates and explicit owner approval.

## TI-001 — Indicator information decomposition

Traditional indicators are deterministic transforms of the same OHLCV path and therefore start with a high prior probability of redundancy.

### KD / Stochastic

For the Taiwan-common 9,3,3 convention:

RSV_t = 100 * (C_t - L_n) / (H_n - L_n)

K_t = (2/3) K_(t-1) + (1/3) RSV_t

D_t = (2/3) D_(t-1) + (1/3) K_t

Interpretation:
- RSV is a normalized close-location statistic within the recent high-low envelope.
- K and D are recursively smoothed versions of that location.
- KD therefore primarily describes where the current close sits inside a recent range plus short memory.
- It is not an independent source of information from price structure.

Important implementation guard:
Different charting systems can use different lookbacks, smoothing, initialization and Stochastic variants. Formula/version/initial-state fingerprint must be stored before any cross-platform comparison.

### RSI

Wilder-style RSI is a bounded transform of smoothed positive versus negative close-to-close changes.

Its information family is therefore:
- sign balance of recent returns;
- magnitude-weighted gain/loss asymmetry;
- short-horizon momentum / exhaustion state.

RSI is not algebraically identical to KD:
- RSI ignores the intraperiod high-low envelope and focuses on close-to-close change decomposition.
- KD explicitly uses rolling high/low location.

However, both are bounded short-horizon price-state oscillators. High empirical correlation and overlapping threshold events are expected and must be measured rather than assumed away.

### MACD

Standard MACD is derived from fast and slow EMAs, with a further EMA signal line.

Primary information family:
- smoothed trend difference;
- smoothed momentum / change in trend;
- filtered transition state.

MACD is structurally downstream of moving averages and therefore has a strong redundancy prior against:
- MA5/10/20/60 alignment;
- MA slopes;
- trend persistence;
- direct multi-horizon returns;
- existing momentum/late-stage controls.

A recent operator-analysis treatment also characterizes MACD as a smoothed derivative / band-pass-like transform. This reinforces the redundancy concern: MACD may re-express filtered price change rather than introduce new economic information.

## TI-002 — Sign firewall: overbought/oversold is not directional truth

The following folklore mappings are explicitly rejected as assumptions:

- low KD => BUY
- high KD => SELL
- RSI oversold => BUY
- RSI overbought => SELL
- upper Bollinger touch => SELL
- lower Bollinger touch => BUY
- MACD golden cross => BUY
- MACD death cross => SELL

These may be hypotheses only after conditioning on market state.

Reason:
A bounded oscillator can remain extreme during persistent trend. The same high reading can represent:
1. late-stage exhaustion;
2. healthy trend persistence;
3. breakout acceptance;
4. short-covering / squeeze;
5. limit-constrained unresolved state.

A low reading can similarly represent:
1. panic exhaustion;
2. structural breakdown;
3. persistent downtrend;
4. value-reversion setup;
5. liquidity vacuum.

The sign must therefore be conditional on prior trend, structural location, volatility, price-volume acceptance and market regime.

## TI-003 — Taiwan evidence: technical-rule efficacy is time-varying

External Taiwan evidence does not support a timeless universal technical rule.

### Older positive evidence
Chang, Metghalchi & Chan (2006) tested prevalent moving-average technical rules in Taiwan and reported predictive ability versus buy-and-hold in their sample, including cross-national US information.

This supports researchability, not portability to the current market.

### Efficiency / decay counterevidence
Later Taiwan-related literature summarized by Kung/Wong evidence indicates technical-rule predictive power was materially stronger in earlier periods and weakened as the Taiwan market became more efficient.

Implication:
- historical profitability cannot be assumed stationary;
- market microstructure reforms, investor composition, dissemination speed and trading technology can erode old edges.

### Behavioral / liquidity mechanism evidence
Lai, Chen & Huang (2010) found Taiwan technical-signal-related trading activity associated with disposition, information-cascade and anchoring effects.

Implication:
Technical signals may interact with behavioral/liquidity mechanisms rather than encode a stable mechanical law. This supports conditional-state research and warns against one-sign indicator scores.

### Modern-market portability guard
Taiwan evidence predating:
- 2015 widening of daily price limits to ±10%;
- 2020 continuous intraday trading;

must not be treated as directly representative of current effect sizes.

Pre-2020 studies remain mechanism evidence and stress-test priors, not production coefficients.

## TI-004 — Bollinger Bands provide a concrete sign-inversion warning

Ni, Day, Huang & Yu (2020), using Taiwan 50 constituent stocks, report:
- positive abnormal returns after prices reached the lower Bollinger Band in their design;
- upper-band contact did not support a simple sell/short interpretation;
- long/momentum interpretation at upper-band conditions could outperform the conventional reversal interpretation.

This is important because it directly falsifies the naive universal rule:
"lower band = buy, upper band = sell."

Research implication:
Bollinger state must be decomposed into:
- band width / compression;
- price location;
- breakout versus mean-reversion context;
- prior trend;
- volatility regime;
- acceptance / rejection;
- distance from structural support/resistance.

The band touch itself is not a directional score.

## TI-005 — KD versus RSI preregistered redundancy test

Primary question:
Does KD add incremental information after controlling RSI and direct price-state variables, and vice versa?

### Frozen baseline features
KD family:
- RSV9
- K9
- D9
- K-D spread
- K/D cross state
- persistence above/below extreme zones

RSI family:
- RSI14
- RSI slope
- RSI zone
- RSI change

Direct controls:
- ret5 / ret10 / ret20
- close location
- priorHigh20 / priorLow20 proximity
- ATR%
- MA alignment / slope
- Pattern lifecycle state
- Price-Volume acceptance state
- regime / sector / liquidity / price tier

### Primary comparisons
1. KD-only residual information after controls.
2. RSI-only residual information after controls.
3. KD+RSI versus best single family.
4. Cross-family disagreement states:
   - KD extreme / RSI neutral;
   - RSI extreme / KD neutral;
   - opposite slope;
   - both extreme but trend-persistent.

### Required outputs
- same-date cross-sectional correlation;
- event overlap rate;
- conditional mutual information or equivalent non-linear dependency diagnostic where sample permits;
- incremental outcome separation after residualization;
- stability across independent dates and regimes.

### Falsification
If KD and RSI produce little incremental separation after direct-price controls, scoring duplication is rejected. One may remain UI/explanation-only.

## TI-006 — MACD versus direct trend preregistered redundancy test

Primary question:
Does MACD add information beyond the trend quantities already present?

Frozen MACD baseline:
- EMA12 - EMA26 (DIF)
- 9-period EMA signal
- histogram
- zero-line state
- DIF slope
- histogram slope / expansion-contraction
- crossover event

Direct controls:
- MA5/10/20/60 alignment
- MA20/60 slopes
- ret5/10/20/60
- trendPersistence
- distance to MA20/60
- structural extension / lateStage
- Pattern breakout lifecycle
- Price-Volume acceptance

Primary hypotheses:
A. raw MACD level/crossover will be highly redundant with MA/trend state.
B. histogram change may retain transition-timing information after controlling trend level.
C. any apparent improvement may disappear after transaction costs or 15m execution timing.
D. zero-line and crossover interactions may be regime-dependent rather than universally directional.

Falsification:
If no incremental value survives direct-trend controls, MACD remains explanation/UI only.

## TI-007 — Parameter and divergence overfit firewall

Indicators with tunable lookbacks create a large hidden Factor Zoo.

Initial study must NOT sweep many parameter combinations.

Frozen first-pass references:
- KD: Taiwan-common 9,3,3 variant with formula/version fingerprint.
- RSI: Wilder RSI14.
- MACD: EMA12/26 with signal EMA9.
- Bollinger: 20-period center with conventional width only as a reference comparator, not assumed optimal.

Alternative parameters are robustness tests only after baseline evidence exists.

Divergence rules are especially high-risk because the result depends on:
- which pivots are selected;
- minimum separation;
- price versus indicator peak/trough choice;
- tolerance;
- lookback;
- confirmation timing.

No "bullish divergence" or "bearish divergence" field may be outcome-tested until a repaint-safe pivot and confirmation algorithm is frozen before outcomes.

## TI-008 — Regime-conditioned interpretation matrix

The first research matrix should separate at minimum:

Trend state:
- UPTREND
- DOWNTREND
- RANGE
- TRANSITION

Structural location:
- support
- mid-range
- resistance
- fresh breakout
- accepted breakout
- failed breakout

Volatility:
- compressed
- normal
- expanded / shock

Price-volume:
- accepted participation
- weak participation
- rejection / effort-without-result
- UNKNOWN

Indicator evidence is interpreted only inside these contexts.

Examples:
- high KD + high RSI + accepted breakout + strong trend may indicate persistence, not sell.
- high KD + high RSI + failed breakout + upper rejection may indicate exhaustion.
- low RSI + structural support + undercut/reclaim + improving price-volume may support reversal research.
- low RSI + breakdown + adverse price-volume is not a mean-reversion signal.

These are research-state examples, not trading rules.

## TI-009 — Outcome design

No standalone indicator "accuracy" metric.

Primary outcome framework reuses existing research outcomes where provenance is clean:
- D1 / D3 / D5 / D10
- MFE / MAE
- stop-first / failure timing where available
- zero-pick / coverage context
- execution/cost evidence when the hypothesis concerns timing

Inference unit:
Independent scan date, not pooled rows.

Required controls:
- market regime
- sector
- liquidity
- price tier
- existing A/B setup
- Pattern state
- direct returns/trend
- Price-Volume state
- volatility

Preferred first question:
"Does indicator state explain incremental dispersion among otherwise similar existing candidates?"

Avoid:
"Would buying every RSI<30 stock have made money historically?"

The second question has weak relevance to the actual system and high strategy-mining risk.

## TI-010 — Current conclusions

1. KD, RSI and MACD are not independent evidence families.
2. KD versus RSI retains a plausible but unproven distinction: rolling-range location versus close-to-close gain/loss balance.
3. MACD begins with a very high redundancy prior versus MA slope/alignment/trend persistence.
4. Extreme indicator levels are state descriptors, not automatic reversal signals.
5. Taiwan evidence is mixed and time-varying; older positive results cannot be directly transported into the modern ±10% / continuous-trading regime.
6. Taiwan behavioral/liquidity evidence supports contextual interpretation of technical signals.
7. Taiwan 50 Bollinger evidence provides a concrete counterexample to symmetric upper/lower-band reversal folklore.
8. The highest-value first empirical work is redundancy/incremental-value testing, not adding indicators to a score.
9. No FORMAL_OPTIMIZATION_CANDIDATE exists from this tranche.
10. Formal Core remains unchanged.

## Exact next continuation point

1. Freeze executable formula contracts for KD9-3-3, RSI14 and MACD12-26-9, including initialization and missing-bar semantics.
2. Audit whether current validated historical-data paths can generate each indicator without extra calls and without violating corporate-action / symbol-session continuity.
3. Build an outcome-blind synthetic fixture suite:
   - monotonic uptrend;
   - monotonic downtrend;
   - flat range;
   - breakout;
   - false breakout;
   - V-reversal;
   - gap / corporate-action boundary;
   - suspension/no-trade pseudo-bar;
   - price-limit constrained sequence.
4. Verify expected indicator mechanics and prefix invariance before any outcome join.
5. Design a research-only prospective snapshot object that stores raw indicator components, formulaVersion, source/provenance and data-quality state.
6. Only after clean prospective coverage, run TI-005 KD-vs-RSI and TI-006 MACD-vs-trend incremental tests using equal-date inference.
7. Then expand to ADX and Bollinger/ATR/VCP redundancy. Do not expand the indicator catalog before these gates are complete.

## External evidence anchors checked in this tranche

- Chang, Y.-H., Metghalchi, M., & Chan, C.-C. (2006), "Technical trading strategies and cross-national information linkage: the case of Taiwan stock market", Applied Financial Economics 16(10), 731-743. DOI: 10.1080/09603100500426374.
- Lai, H.-W., Chen, C.-W., & Huang, C.-S. (2010), "Technical Analysis, Investment Psychology, and Liquidity Provision: Evidence from the Taiwan Stock Market", Emerging Markets Finance and Trade 46(5), 18-38.
- Ni, Y., Day, M.-Y., Huang, P., & Yu, S.-R. (2020), "The profitability of Bollinger Bands: Evidence from the constituent stocks of Taiwan 50", Physica A 551, 124144. DOI: 10.1016/j.physa.2020.124144.
- Chong, T. T.-L., Ng, W.-K., & Liew, V. K.-S. (2014), "Revisiting the Performance of MACD and RSI Oscillators", Journal of Risk and Financial Management 7(1), 1-12. Cross-market evidence only; not Taiwan-portable.
- Li, Y. (2025), "Operator Analysis of MACD", arXiv:2509.21326. Used only for mathematical interpretation, not alpha evidence.
- Taiwan-market convention check: common local KD implementation uses RSV9 with recursive 1/3 smoothing for K and D; exact platform formula remains a required provenance field.


## TI-011 — Outcome-blind synthetic mechanism fixtures

A deterministic synthetic stress pack was evaluated before any forward-return study. These fixtures test indicator mechanics only; they do not provide alpha evidence.

### Scenarios exercised

- monotonic uptrend;
- monotonic downtrend;
- oscillating range;
- clean breakout;
- false breakout;
- V reversal;
- trend with short pullback;
- gap-and-hold;
- spike-and-revert.

### Mechanistic findings

1. **Extreme oscillator values can be persistent trend states.**
   - In a monotonic uptrend, the frozen KD9-3-3 implementation can remain at or near 100 while Wilder RSI14 reaches 100.
   - In a clean breakout and strong V-reversal fixture, both KD and RSI can remain very high while price continues to advance.
   - Therefore "overbought" is not mechanically equivalent to "reversal due."

2. **Time-scale conflict is expected rather than exceptional.**
   - In the trend-with-pullback fixture, short-horizon return can turn negative while RSI/KD remain elevated and MACD remains positive because the slower filters still encode the preceding uptrend.
   - This is a useful adversarial case for any future indicator-voting design: contradictory valid signals must become a state/conflict description, not a forced majority vote.

3. **KD and RSI can disagree without either being wrong.**
   - A spike-and-revert path can leave K very high while RSI is only moderate because KD measures close location inside a rolling high-low envelope whereas RSI measures smoothed close-to-close gain/loss balance.
   - This supports studying residual information but does not prove either family adds alpha.

4. **MACD has a strong mechanical overlap with trend filters.**
   - Across synthetic trend/breakout paths, MACD and MA20-slope states move together strongly.
   - Transition windows are where disagreement appears most often, consistent with smoothing/lag rather than independent information.

### Consequence

Synthetic fixtures strengthen the redundancy and sign-firewall priors. They justify executable QA tests, not promotion or scoring.

## TI-012 — Real-source descriptive redundancy witnesses

An outcome-blind, non-random descriptive audit was run on Fugle historical daily candles using FCNT000154, adjusted=true, for 2026-06-01 through 2026-09-24.

Stress/example symbols:
- 2330
- 5314
- 2006
- 4977

Each series contained 82 returned daily bars in this audit window.

Important limitations:
- these four names are not a representative cross-section;
- the sample was selected for source/mechanism inspection, not inference;
- no D1/D3/D5/D10/MFE/MAE outcomes were joined;
- no threshold or parameter was selected from these results.

### Descriptive same-window correlations

| Symbol | corr(K9, RSI14) | corr(MACD DIF, MA20 5-day slope) |
|---|---:|---:|
| 2330 | 0.669 | 0.875 |
| 5314 | 0.771 | 0.988 |
| 2006 | 0.831 | 0.900 |
| 4977 | 0.771 | 0.976 |

Interpretation:
- KD and RSI are materially related but leave visible disagreement states.
- MACD DIF versus MA20 slope is extremely overlapping in several of these windows, strengthening the preregistered high-redundancy prior.
- These values are descriptive witnesses only. They must not be pooled or generalized into a population claim.

### Concrete disagreement witnesses

#### 2006
- 2026-07-31: K about 89 while RSI about 69.
- 2026-08-05: K about 84 while RSI about 66.
- 2026-08-11: K about 86 while RSI about 70.
- Multiple 2026-09-04 through 2026-09-16 observations had positive MACD DIF while the five-day MA20 slope was negative.

This shows that KD can enter a high zone earlier/differently than RSI, while MACD may retain a positive slow-trend state after the medium trend slope has already softened.

#### 4977
- 2026-08-11 through 2026-08-13: K remained above 80 while RSI was only about 53-57 and MACD DIF remained negative.
- 2026-08-14: MA20 slope had turned positive while MACD DIF remained negative.

This is a clean phase-lag witness: different filters can disagree around a transition without implying that one is a direct trading signal.

#### 5314
- 2026-08-11 through 2026-08-17: K was roughly 88-94 while RSI ranged only around 53-69.
- 2026-09-01 through 2026-09-10: RSI remained above 70 on several dates after K had already fallen below 80.
- 2026-09-23 and 2026-09-24: K was near 9 and MA20 slope was negative while MACD DIF was still positive.

This is especially useful because 5314 also contains a modern price-limit-constrained sequence; the disagreement is therefore a stress case, not a clean alpha example.

### Research implication

The next empirical question is not whether one indicator "looks better." It is whether a residualized indicator state explains incremental variation among comparable candidates after direct-price/trend/Pattern/Price-Volume controls.

## TI-013 — Price-limit / constrained-price-discovery firewall

The 5314 2026 stress path provides a concrete modern Taiwan witness:
- several sessions in August display flat open=high=low=close at sequentially higher levels consistent with price-limit-constrained trading;
- later sessions reverse sharply;
- oscillator values can remain extreme while ordinary two-sided price discovery is constrained.

This makes ordinary overbought/oversold interpretation unsafe during constrained price discovery.

### Frozen rule

Technical Indicator research must consume, not re-invent, canonical session/constraint semantics from Pattern / Microstructure / Corporate-Actions lanes.

Required context fields before directional interpretation:
- symbol-session validity;
- priceLimitConstrained;
- volatility-interruption / auction state where relevant;
- suspension/no-trade state;
- corporate-action continuity space;
- data-quality/provenance.

When price discovery is constrained:
- K/RSI extremes remain descriptive;
- MACD/MA lag remains descriptive;
- crossover/touch events cannot be promoted as ordinary unconstrained signals;
- acceptance remains UNRESOLVED until canonical market/session logic says the state is observable.

### New status after TI-011..TI-013

FORMULA_BASELINE_FROZEN / SYNTHETIC_MECHANISM_PRIORS_PASS / REAL_SOURCE_REDUNDANCY_PRIOR_STRENGTHENED / LIMIT_CONSTRAINT_GUARD_REQUIRED / NO_OUTCOME_INFERENCE / FORMAL_LOCKED

No FORMAL_OPTIMIZATION_CANDIDATE exists from these sections.

## Updated exact next continuation point

1. Convert KD9-3-3, RSI14 and MACD12-26-9 into an isolated executable Class-A research module with explicit formulaVersion and initialization semantics.
2. Convert the synthetic scenarios into deterministic executable fixtures with expected state assertions.
3. Add prefix-invariance and replay-exactness tests.
4. Add data-quality fixtures for suspension pseudo-bars, corporate-action discontinuity and price-limit-constrained sequences. These fixtures must fail closed or carry explicit constraint state rather than fabricate ordinary candles.
5. Freeze a research-only prospective snapshot contract containing raw indicator components, formulaVersion, source, adjusted/raw continuity space, session/constraint provenance and dataQualityState.
6. Do not join forward outcomes until prospective parent coverage is complete and the research snapshot can be reproduced exactly as-of date.
7. First inference remains TI-005 KD-vs-RSI using equal-date residualized controls.
8. Second inference remains TI-006 MACD-vs-direct-trend.
9. ADX and Bollinger/ATR/VCP redundancy remain next only after TI-005/TI-006 mechanics and prospective coverage are clean.
10. Formal Core remains unchanged.
