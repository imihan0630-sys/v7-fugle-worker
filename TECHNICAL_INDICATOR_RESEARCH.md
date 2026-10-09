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


## TI-014 — Existing-history source readiness and zero-extra-call boundary

A direct repository audit materially narrows the data requirement for KD / RSI / MACD.

### Current System 1 history facts

- Current V8.12 history-source revalidation uses fetchHistoricalDaily and explicitly requests daily adjusted=false historical candles.
- The current Formal history path already retains the high / low / close fields needed by KD and the close field needed by RSI / MACD.
- The ordinary live cache horizon of about 65 bars is sufficient for the frozen first-pass baselines:
  - KD9 requires 9 bars;
  - RSI14 requires 15 closes for the first Wilder value;
  - MACD12/26/9 uses a 34-bar conservative warm-up under the frozen research implementation.
- Therefore the three first-pass indicators do not justify extra ordinary market-data calls merely to obtain more history.

### What is still not ready

The existing Formal history is a RAW price path. The shared Corporate Actions lane has separately frozen TECHNICAL_CONTINUITY semantics, but production/runtime TECHNICAL_CONTINUITY remains blocked.

Therefore:

- raw Formal history can support formula mechanics;
- it cannot be silently treated as corporate-action-neutral technical history across an unresolved event boundary;
- FCNT000154 adjusted=true may be used for isolated descriptive research only when its semantic space is declared;
- adjusted=true research values must not be mixed with raw Formal price features as though they were identical observations;
- the connected FCNT000154 adjusted=false path remains unsuitable as proof of RAW parity because prior audits observed requested false but returned metadata true.

### Indicator-specific blocker decomposition

KD:
- needs high / low / close;
- does not need OPEN;
- does not need volume;
- history length is already adequate;
- corporate-action continuity and symbol-session validity remain the semantic blockers.

RSI:
- needs close only;
- does not need OPEN or volume;
- history length is already adequate;
- corporate-action continuity and symbol-session validity remain the semantic blockers.

MACD:
- needs close only;
- does not need OPEN or volume;
- history length is already adequate;
- corporate-action continuity and cross-price-scale interpretation remain blockers.

This yields the source-readiness state:

ZERO_EXTRA_MARKET_CALL_FEASIBLE_CONDITIONALLY / RAW_HISTORY_AVAILABLE / TECHNICAL_CONTINUITY_RUNTIME_BLOCKED

No Worker wiring is authorized by this finding.

## TI-015 — Affine/scaling invariance map and cross-sectional comparability

A useful way to separate genuine indicator information from price-unit artifacts is to ask how each indicator changes under a uniform positive affine transform:

P'_t = a * P_t + b, with a > 0 and the same a,b over the complete lookback.

This is a mathematical invariance exercise, not an alpha test.

### KD / Stochastic

RSV uses (C-L)/(H-L).

Under the same positive affine transform:
- numerator becomes a(C-L);
- denominator becomes a(H-L);
- the ratio is unchanged.

Therefore RSV, K and D are invariant to a uniform positive affine transform.

Important limitation:
A corporate action creates a piecewise transformation around the event boundary, not one uniform transform over the full rolling window. Raw event jumps can therefore still contaminate KD.

### RSI

Close-to-close differences transform as:

Delta P' = a * Delta P

The additive b cancels. Average gains and average losses both scale by a, so their ratio is unchanged.

Therefore Wilder RSI is invariant to a uniform positive affine transform.

Again, a piecewise corporate-action discontinuity violates the assumption and can create artificial gain/loss observations.

### MACD

EMA is linear under a uniform affine transform:

EMA(P') = a * EMA(P) + b

The additive b cancels when fast and slow EMAs are subtracted:

DIF' = a * DIF

The signal line and histogram likewise scale by a.

Consequences:
- sign / zero-line / crossover state is invariant to a uniform positive scale factor;
- raw DIF and raw histogram magnitudes are NOT cross-sectionally comparable across different stock price scales;
- a NT$2 absolute DIF does not represent the same economic distance for a NT$20 stock and a NT$2,000 stock.

Frozen first cross-sectional research normalization:
- macdDifPct = 100 * DIF / close;
- macdHistogramPct = 100 * histogram / close.

ATR-normalized MACD may be examined later only as a robustness comparator because it introduces an additional volatility transform and may simply duplicate ATR/trend information.

### Related indicators

ROC:
- invariant to a uniform multiplicative scale;
- not generally invariant to an additive translation;
- contaminated by a piecewise corporate-action jump.

ATR:
- absolute ATR scales with price units;
- ATR% is invariant to a uniform multiplicative scale;
- raw corporate-action discontinuities can create false true-range shocks.

Bollinger Bands:
- percent-B style location is invariant to a uniform positive affine transform;
- absolute band width is price-unit dependent;
- relative bandwidth is scale-safe under uniform multiplication but still requires continuity across event boundaries.

DMI / ADX:
- dimensionless directional ratios are largely scale-free under a uniform multiplicative transform;
- raw corporate-action jumps can still create false directional movement and true-range spikes.

### Research consequence

The indicator lane must separate:
1. dimensionless state;
2. price-unit-dependent magnitude;
3. continuity-boundary contamination.

This is another reason not to pool raw indicator values into one cross-sectional score.

## TI-016 — Evidence conflict: indicator stacking is not automatically stronger

Additional Taiwan and cross-market evidence strengthens the anti-voting rule.

### Taiwan evidence conflict

Taiwan thesis evidence is mixed:
- a 2009-2014 all-listed/OTC study reported stronger sample-period results for RSI and MACD while KD was weakest;
- a 2007-2017 random-stock study reported significant RSI excess-return evidence and meaningful industry heterogeneity;
- a Taiwan index study using long historical data through 2010 found that some optimized MACD/RSI rules could beat buy-and-hold in subsets, but overall the strategies did not significantly dominate buy-and-hold;
- a Taiwan Mid-Cap 100 study testing KD/MACD/Bollinger combinations reported that combining indicators did not automatically improve performance.

These are mostly graduate-thesis-level or older-period results. They are useful as conflicting evidence, not current production coefficients.

### Cross-market evidence

Peer-reviewed cross-market MACD/RSI evidence also varies by market, supporting market-specific rather than universal profitability.

A 2020 stochastic-oscillator study on DJ30 / FTSE100 / SSE50 found that persistent overbought states could behave more like momentum over longer horizons while oversold states could support short-horizon contrarian behavior. It is not Taiwan evidence, but it independently contradicts the universal mapping overbought = sell.

### Frozen implication

- Do not count KD + RSI + MACD agreement as three independent bullish/bearish votes.
- First aggregate or residualize within the price-derived indicator family.
- Require incremental value beyond raw returns, trend, Pattern, Price-Volume and regime context.
- Conflicting valid indicators should create a diagnostic state, not a forced score.
- Historical positive studies remain hypotheses under the post-2015 / post-2020 Taiwan market structure.

No FORMAL_OPTIMIZATION_CANDIDATE is created by this evidence.


## TI-017 — Repaint-safe indicator divergence specification v0.1

Indicator divergence is a high-overfit concept because visual definitions can change the pivot pair after future bars arrive.

The primary specification therefore reuses the existing Pattern lane confirmed swing chronology instead of inventing a second indicator-specific pivot engine.

### Primary pivot rule

For the first-pass divergence detector:
- price pivots come from the already-frozen confirmed Pattern swing engine;
- every pivot retains pivotAt and confirmedAt;
- a divergence state at date t may use a pivot only when confirmedAt <= t;
- indicator values are sampled at the price-pivot dates;
- no future bar may change a previously confirmed as-of divergence record.

This is intentionally stricter than visually picking the two prettiest indicator lows/highs.

### Bullish divergence candidate

Using two confirmed price lows L1 then L2:
- price(L2) < price(L1) is the classical lower-low geometry;
- indicator(L2) > indicator(L1) is the classical higher-low indicator geometry.

The detector stores continuous quantities rather than immediately returning bullish=true:
- priceProgressionPct;
- indicatorProgression;
- barsBetweenPivots;
- indicator family/version;
- pivot scale;
- structural location;
- priorTrendContext;
- priceLimitConstraintState;
- continuity/dataQuality state.

### Bearish divergence candidate

Using two confirmed price highs H1 then H2:
- price(H2) > price(H1);
- indicator(H2) < indicator(H1).

The same continuous descriptor rules apply.

### Why price pivots are primary

Allowing independent price pivots and independent indicator pivots creates extra degrees of freedom:
- pivot algorithm;
- pivot tolerance;
- matching window;
- minimum separation;
- which indicator extremum is selected;
- confirmation timing.

Those degrees of freedom create a large hidden multiple-testing problem.

Independent indicator pivots may later be a robustness comparator, but not the primary specification.

### Required guards

Divergence is BLOCKED or CONSTRAINED when:
- technical continuity is unresolved;
- symbol-session provenance is unresolved;
- either pivot is generated from a pseudo/no-trade bar;
- indicator warm-up is incomplete;
- price-limit-constrained price discovery makes the pivot ordinary interpretation unresolved;
- the indicator formula version changed within the episode.

### Redundancy firewall

Even a repaint-safe divergence is not automatically incremental information.

Required future controls:
- raw price swing progression;
- ret5/10/20;
- MA slope/trend persistence;
- structural support/resistance;
- Pattern reversal lifecycle;
- volatility;
- Price-Volume rejection/acceptance.

RSI divergence and KD divergence cannot be counted as two independent votes without residual evidence.

MACD divergence must use normalized MACD magnitude for cross-sectional comparisons.

### Status

DIVERGENCE_SPEC_V0_1_FROZEN / OUTCOME_UNTESTED / NO_DIRECTIONAL_AUTHORITY

## TI-018 — Prospective indicator snapshot contract v0.1

A machine-readable research-only contract is frozen in research/technical_indicator_snapshot_contract_v0_1.json.

Core principles:
- reuse the existing Shadow parent identity instead of creating a new selected cohort;
- record point-in-time asOf / availableAt provenance;
- require formulaVersion;
- preserve raw components rather than only a label;
- distinguish data quality, formula warm-up, market constraints and interpretation readiness;
- no score, rank, BUY, SELL or capital field is allowed;
- historical Shadow fabrication is prohibited;
- ordinary outcome joining waits for complete prospective parent coverage and exact replay.

This separates four states that must never be collapsed:
1. DATA_BLOCKED;
2. WARMUP_INCOMPLETE;
3. VALID_BUT_CONSTRAINED;
4. VALID_OBSERVABLE.

A valid computed number is therefore not automatically inference-ready.

### Exact parent identity

Primary future parent key:
- scanDate;
- symbol;
- parentSnapshotHash.

cohort_rank is not an identity field.

### Outcome-join rule

A future row may join outcomes only when:
- its expected parent exists exactly once;
- point-in-time source/provenance is valid;
- replay is exact;
- prefix invariance is satisfied;
- required indicator components are warm;
- blocked/constraint state is explicitly preserved.

VALID_BUT_CONSTRAINED rows may be studied only as a separate preregistered stratum; they may not be pooled into ordinary unconstrained indicator evidence.

No prospective runtime wiring is authorized by this contract.


## TI-453 through TI-459 — ADX / MA-offset algebraic redundancy and warm-up falsification (2026-10-01)

Detailed durable evidence and executable fixture:
- `research/TECHNICAL_INDICATOR_ADX_OFFSET_REDUNDANCY_V0_1.md`
- `research/test_technical_indicator_adx_offset_redundancy_v0_1.mjs`

This tranche deliberately did **not** open forward outcomes because the preregistered source/version gate is still only 2/3 completed prospective Taiwan sessions.

### TI-453 — SMA deduction price is exact directional redundancy

For an n-period SMA:

`SMA_n(t) - SMA_n(t-1) = [C_t - C_(t-n)] / n`.

Therefore the usual SMA deduction/outgoing price `C_(t-n)`, the sign of the one-step SMA slope, and the sign of the same-horizon close-to-close return are algebraically linked. They may have different magnitudes/normalizations, but they cannot be counted as independent directional votes.

A future 1/3/5-day deduction sequence is useful only as a **conditional threshold/scenario**. The outgoing closes are known, while the future incoming closes are not. It cannot be labeled a forecast of future SMA slope without an explicit future-price assumption.

### TI-454 — EMA cannot inherit SMA deduction semantics

For EMA, `EMA_t - EMA_(t-1) = alpha * [C_t - EMA_(t-1)]`. No single historical close drops out mechanically as it does in SMA. A direct SMA-style EMA deduction-price rule is therefore invalid.

The deterministic fixture verifies both the SMA and EMA identities to machine precision.

### TI-455/TI-456 — ADX is directionless strength and is path-sensitive

Synthetic Wilder-14 witnesses:
- smooth 100 -> 120 path: final ADX = 100;
- smooth 120 -> 100 path: final ADX = 100;
- choppy 100 -> 120 path with the same start/end return: final ADX ≈ 16.7353;
- flat oscillating range: final ADX ≈ 11.1728.

Thus ADX itself has no bullish/bearish authority; direction belongs to +DI/-DI or a separate direction layer. The same endpoint return can coexist with very different ADX, which establishes a plausible **path-efficiency** mechanism distinct from simple retN. This is synthetic mechanism evidence only, not Taiwan alpha evidence.

### TI-457 — ADX + Impulse MACD is not independent confluence by default

ADX and LazyBear-style Impulse MACD are not algebraically identical, but both are OHLC-derived range/trend transforms. ADX uses directional movement normalized by true range and smooths the signless DX; Impulse MACD uses a smoothed high/low envelope plus low-lag centerline and suppresses in-envelope movement.

The prior is therefore **partial/shared-family redundancy**, not independent voting. The frozen System 2 hypothesis architecture is:
direction -> location -> momentum/dead-zone -> trend-quality moderator -> price confirmation -> risk/extension.

ADX starts as a moderator/diagnostic, not an additive positive score. Any residual value must survive direct trend, ATR/regime and Impulse controls.

### TI-458 — 65-bar readiness cannot be inherited by ADX14

The earlier D03 source audit showed an ordinary ~65-bar history is sufficient for the frozen first-pass KD9 / RSI14 / MACD12-26-9 implementations. That finding is **not portable** to ADX14.

A deterministic warm-up witness using the same final price path produced:
- full-history ADX14 = 16.076280;
- 65-bar initialization = 16.905634, delta +0.829354;
- 150-bar initialization = 16.076396, delta +0.000117.

This is not a population estimate, but it is sufficient to require an explicit ADX warm-up/formulaVersion contract before prospective capture. Threshold states near conventional 20/25 levels must not be tested before initialization equivalence is controlled.

### TI-459 — frozen falsification design

Primary null: after controlling direct ret5/10/20/60, MA slope/alignment, trend persistence, ATR/realized volatility, breakout/pullback structure, Impulse MACD, liquidity/price tier and market Regime/transition, ADX adds no material incremental information for D5/D10/D20 return, MFE/MAE, false-break/no-follow-through, whipsaw frequency or stop/opportunity-cost outcomes.

Future comparisons are frozen as:
1. direct trend baseline;
2. trend + Impulse;
3. trend + ADX;
4. trend + Impulse + ADX;
5. residual ADX within the same Impulse state;
6. residual Impulse within the same ADX state.

No threshold sweep is allowed. Continuous ADX is primary; 20/25 may be retained only as preregistered descriptive robustness bins.

### Status

SMA_OFFSET_DIRECTIONAL_REDUNDANCY = EXACT_ALGEBRAIC_PASS  
EMA_SMA_STYLE_DEDUCTION = REJECTED_INVALID_SEMANTICS  
FUTURE_DEDUCTION_AS_FORECAST = REJECTED / CONDITIONAL_THRESHOLD_ONLY  
ADX_DIRECTION_AUTHORITY = NONE  
ADX_VS_RETN_MECHANISM = DISTINCT_PATH_SENSITIVITY_PROVEN_SYNTHETIC  
ADX_VS_IMPULSE_INDEPENDENCE = NOT_ESTABLISHED / REDUNDANCY_PRIOR_HIGH  
ADX_65_BAR_WARMUP = NOT_GENERALIZABLE_FROM_KD_RSI_MACD  
ADX_OUTCOME_VALUE = UNKNOWN  
FORMAL_OPTIMIZATION_CANDIDATE = NONE  
Formal Core remains LOCKED.

### Exact next continuation point

1. Preserve the existing 2/3 prospective source/version gate; do not manufacture a third date before the next Taiwan session completes.
2. After the third completed session, finish that gate and only then unlock TI-005 KD-vs-RSI and TI-006 MACD-vs-direct-trend under the existing governance path.
3. Before any ADX prospective snapshot, prove a stable long-enough history/warm-up contract and freeze +DI/-DI/DX/ADX/formulaVersion/continuity fields.
4. ADX efficacy testing follows TI-005/TI-006 and must be residualized against direct trend, ATR/regime and Impulse MACD. No additive vote and no threshold tuning.


## TI-460 through TI-467 — third-session transport audit and ROC exact redundancy (2026-10-02)

Detailed durable evidence:
- `research/TECHNICAL_INDICATOR_ROC_REDUNDANCY_V0_1.md`
- `research/test_technical_indicator_roc_redundancy_v0_1.mjs`

### TI-460 — third session is publicly present, but the frozen raw-receipt transport is not reproduced

After the completed 2026-10-02 Taiwan session, official TWSE MI_INDEX content returned `stat=OK` / `date=20261002`; official TPEx dailyQuotes returned `date=20261002` and table `totalCount=11928`. A repeated TWSE fetch again returned the same trade-date content.

The available chat fetch path exposes extracted/normalized document content rather than the origin raw response bytes required by the frozen observer. Therefore the third session is source-visible but **does not close the preregistered raw-byte receipt gate**.

Status:
- `THIRD_SESSION_SOURCE_PRESENT = PASS`
- `ORIGIN_RAW_BYTES_RECEIPT_EQUIVALENCE = NO`
- `PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_2_OF_3`

No extracted-content response is backfilled as if it were the original observer receipt.

### TI-461 — standard percent ROC equals 100 × simple return exactly

For the same lookback n and price space:

`ROC_n(t) = 100 * [C_t / C_(t-n) - 1] = 100 * retN(t)`.

Consequences:
- identical sign;
- identical zero-cross timing;
- identical cross-sectional ordering;
- identical percentile ordering;
- no independent directional information.

Standard same-horizon ROC and retN must not receive separate factor votes or score weights.

### TI-462 — common Momentum index is only a shifted ROC

For `MOM_n = 100 * C_t / C_(t-n)`:

`MOM_n = ROC_n + 100`.

This is exact affine redundancy. The 100 baseline changes display semantics only.

### TI-463 — raw price difference is nominal-price-scale confounded

`C_t - C_(t-n)` has the same sign as simple return for positive prices but magnitude depends on nominal share price.

Synthetic witness:
- 100 -> 110: +10%, raw difference +10;
- 1000 -> 1100: +10%, raw difference +100;
- 20 -> 23: +15%, raw difference +3.

Ranking raw price difference can therefore reward high nominal prices rather than stronger percentage momentum. Normalizing by lagged price collapses the measure back to ROC/retN.

### TI-464 — log return is a monotonic transformation of ROC

For positive prices:

`logReturn_n = ln(C_t / C_(t-n)) = ln(1 + ROC_n/100)`.

Same-date same-horizon rankings are preserved exactly. Log returns may improve statistical aggregation, but they are not an independent directional factor from ROC/simple return.

### TI-465 — smoothed ROC / delta-ROC remain same-family candidates

ROC moving averages, ROC slope, `ROC_t - ROC_(t-k)`, and multi-horizon stacks can differ mechanically from a single retN, but they remain transformations of overlapping price returns.

Any candidate must first residualize against:
- ret5/10/20/60;
- changes in retN / return acceleration;
- MA slope/alignment;
- trend persistence;
- ATR/volatility;
- Regime and transition state.

No smoothed/delta ROC becomes a new factor family by default.

### TI-466 — continuity and market-constraint firewall

A raw 2-for-1 split can create a false -50% ROC even when economic value is unchanged. ROC therefore requires the same raw/adjusted price-space, corporate-action ancestry, official-session continuity, suspension/no-trade and price-limit constraint semantics as other price-derived indicators.

Missing continuity evidence remains UNKNOWN.

### TI-467 — maturity and system-use decision

Taiwan momentum literature supports state dependence rather than a duplicate ROC factor:
- Lin, Ko, Feng & Yang (2016): momentum can be positive during market-state continuations and reverse during transitions.
- Chen, Hsieh & Lee (2023): persistence of winner/loser membership materially changes momentum behavior.

The research question is therefore how the existing return/momentum state behaves across Regime/persistence/structure contexts—not whether a same-horizon ROC duplicate deserves another vote.

D03-11 ROC advances from **L1 / 20%** to **L2 / 40%** because formula semantics, exact redundancy, scale artifact, continuity failure modes and future residual-test boundaries are now frozen and reproducible.

D03 aggregate advances from 46.2% to **47.7%**.

This is a redundancy/falsification maturity promotion, not alpha evidence.

### Current status

`D03_MATURITY = 47.7_PERCENT`  
`D03_11_ROC = L2_MECHANISM_AND_FALSIFICATION_DEFINED`  
`STANDARD_PERCENT_ROC_VS_RETN = EXACT_REDUNDANCY`  
`MOMENTUM_INDEX_VS_ROC = EXACT_AFFINE_REDUNDANCY`  
`LOG_RETURN_VS_ROC_RANK = EXACT_MONOTONIC_REDUNDANCY`  
`RAW_PRICE_DIFFERENCE = PRICE_SCALE_CONFOUNDED`  
`SMOOTHED_OR_DELTA_ROC = RESIDUAL_VALUE_UNKNOWN`  
`THIRD_SESSION_SOURCE_PRESENT = PASS`  
`THIRD_SESSION_RAW_RECEIPT_EQUIVALENCE = NO`  
`PROSPECTIVE_COMPLETED_SESSION_COVERAGE = ACCUMULATING_2_OF_3`  
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

### Exact next continuation point

1. Keep the raw-byte three-session gate formally open at 2/3 until the frozen observer, or a receipt-equivalent authorized transport, captures a new completed Taiwan session plus same-trade-date repeat.
2. Do not backfill 2026-10-02 raw receipts from extracted content.
3. While the gate remains open, continue mechanism/falsification on D03-13 multi-timeframe conflict and exact information overlap among multi-horizon returns, EMA16/64 and Impulse MACD.
4. Once the raw-receipt gate is genuinely closed, TI-005 KD-vs-RSI remains first efficacy inference; TI-006 MACD-vs-direct-trend remains second.
5. Formal selection/ranking/capital/monitoring/signal/push behavior remains unchanged.


## TI-468 through TI-473 — EMA16/64 effective horizon and local-reseed falsification (2026-10-02)

Durable evidence:
- `research/TECHNICAL_INDICATOR_EMA16_64_HORIZON_WARMUP_V0_1.md`
- `research/test_technical_indicator_ema16_64_horizon_warmup_v0_1.mjs`

### TI-468 — EMA period is a decay parameter, not a hard cutoff

For standard `alpha=2/(N+1)`, unrolled EMA weights decay geometrically. Useful time-horizon summaries are:
- `meanAge=(N-1)/2`;
- `halfLife=ln(0.5)/ln(1-alpha)`;
- 10%-residual age `=ln(0.1)/ln(1-alpha)`.

EMA16:
- mean age 7.5 bars;
- half-life ≈5.538;
- 10%-residual age ≈18.397.

EMA64:
- mean age 31.5 bars;
- half-life ≈22.179;
- 10%-residual age ≈73.677.

Thus EMA64 does not only consume the most recent 64 bars; old recursive state still matters.

### TI-469 — 65-bar local re-seed is not automatically equivalent for EMA64

Synthetic same-path SMA-seeded EMA witness:
- EMA16 full-history 116.2190231843 vs last-65 116.2203350853, delta ≈ +0.001312.
- EMA64 full-history 115.0611555282:
  - last-65 delta ≈ +0.333575;
  - last-80 delta ≈ -0.109072;
  - last-100 delta ≈ +0.007814;
  - last-150 delta ≈ -0.000482.

This proves a counterexample to the assumption that a 65-bar locally reseeded EMA64 is always replay-equivalent. It is not a universal error estimate.

Trusted continuous recursive state or canonical full replay is a different construction and is not condemned by this witness.

### TI-470 — EMA16/64 crossover is a filtered-price state

`EMA16-EMA64` is the difference between two low-pass filters of the same Close path. It may provide useful transition timing, but the source information remains price-derived and overlaps direct returns, MA/EMA slopes, trend persistence and MACD-family transforms.

Crossover visibility does not create an independent evidence family.

### TI-471 — EMA16/64 + Impulse MACD is partial/nested confluence

Impulse MACD is not algebraically identical because it also uses smoothed High/Low envelope location and dead-zone suppression. Nevertheless, both constructs transform the PRICE_OHLC path.

Frozen prior:
`EMA16_64_PLUS_IMPULSE = PARTIAL_REDUNDANCY_HIGH / RESIDUAL_VALUE_UNKNOWN`.

It must remain within-family confirmation until residual value survives direct trend, structure, volatility/Regime and cost controls.

### TI-472 — System 2 state-lineage guard

Any future System 2 EMA16/64 evidence must preserve formulaVersion, stateConstructionMode, initializationAnchor, continuitySpaceVersion, sourceFamilyVersion, sessionCalendarVersion, barCompletionState and stateLineageId.

A moving 65-bar local EMA64 reconstruction is QA-only unless replay parity to canonical long-history state is proven.

### TI-473 — multi-timeframe hierarchy remains authoritative

Existing D03 multi-timeframe semantics remain:
- weekly = major context;
- daily = primary selection/setup;
- 15m = transition/acceptance/execution confirmation;
- 5m = execution detail where allowed.

Dynamic same-day daily state is PROVISIONAL; completed daily state is CONFIRMED. Intraday agreement is not another independent daily-selection vote.

### Maturity decision

No new maturity promotion:
- D03-01 already L3/60;
- D03-13 remains L2/40 because the current tranche improves mechanism/implementation safeguards but does not add Taiwan PIT/OOS incremental-value evidence.

D03 remains **47.7%**.

### Current status

`EMA64_65_BAR_LOCAL_RESEED_EQUIVALENCE = REJECTED_AS_ASSUMPTION`  
`EMA16_64_CROSSOVER = FILTERED_TREND_STATE / ALPHA_UNKNOWN`  
`EMA16_64_PLUS_IMPULSE = PARTIAL_REDUNDANCY_HIGH / RESIDUAL_VALUE_UNKNOWN`  
`MULTITIMEFRAME_AGREEMENT = HIERARCHICAL_CONTEXT_NOT_VOTE_COUNT`  
`D03_MATURITY = 47.7_PERCENT`  
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

### Exact next continuation point

1. Add EMA16/64 state-lineage/warm-up parity to future System 2 resonance research before any outcome inference.
2. Do not use a 65-bar locally reseeded EMA64 as promotion-grade evidence without canonical replay equivalence.
3. Keep EMA16/64 + Impulse inside the same price-derived family until residual value survives direct-return/trend/structure/Regime controls.
4. Raw-byte third-session gate remains 2/3; once genuinely closed, resume TI-005 then TI-006 in the preregistered efficacy order.
5. Formal Core remains unchanged.


## TI-474 through TI-481 — trend persistence PIT / tick-confound audit (2026-10-03)

Durable evidence:
- `research/D03_TREND_PERSISTENCE_PIT_TICK_CONFOUND_V0_1.md`
- `research/test_d03_trend_persistence_tick_confound_v0_1.mjs`

### TI-474 — exact own-path persistence implementation

Current research implementation:

`0.35*positiveDayRatio20 + 0.25*positiveHorizonPct(ret5,10,20,60>0) + 0.20*drawdownQuality20 + 0.20*maQuality20_60`.

This is a weighted own-price-path trend-consistency heuristic, not literature-style cross-sectional winner/loser membership duration.

### TI-475 — score geometry is stepwise

Exact score changes:
- one extra positive day out of 20 = +1.75 points;
- one ret5/10/20/60 sign flip = 6.25 points;
- one MA20/MA60 state flip = 10 points;
- one additional percentage point of max drawdown = -1 point until the -20% drawdown-quality floor.

The score is not a calibrated probability and can jump at return-zero/MA boundaries.

### TI-476 — same endpoint returns, different path persistence

Synthetic paths were frozen with exactly the same ret5/ret10/ret20/ret60 endpoints, positive horizon states, MA states and no last-20 drawdown.

Smooth path:
- positiveDayRatio20 = 100%;
- persistence = 100.

Alternating rise/flat staircase:
- positiveDayRatio20 = 55%;
- persistence = 84.25.

Thus the score contains path-shape information beyond endpoint returns, but that difference is not automatically alpha.

### TI-477/TI-478 — zero-return / Taiwan tick-size confound

positiveDayRatio20 counts zero-return sessions as non-positive for that component.

A synthetic identical latent +0.08% daily trend rounded to the current TWSE stock tick grid produced materially different observed positive-day ratios and persistence scores by nominal price tier, including 80%/93 at NT$9.5 versus 20%/72 at NT$1,200.

This is mechanism evidence only, not an estimate of real-stock bias magnitude.

External evidence supports the confound prior:
- zero-return frequency is used in the liquidity/transaction-cost literature as an illiquidity proxy;
- current TWSE Operating Rules Article 62 specifies stock tick sizes by price tier.

Future persistence inference must control relative tick size / price tier, zeroReturnRatio20, liquidity and constrained/special-session state.

### TI-479 — composite and constituents remain one price family

All four components derive from the same Close path. The composite can summarize path quality but must not be counted as a cross-family vote on top of retN, MA state, drawdown and positive-day ratio without redundancy accounting.

### TI-480 — construct separation

Chen-Hsieh-Lee (2023) persistency is consecutive winner/loser portfolio membership duration. The current score is own-path trend consistency.

Repository prospective rank-persistence spec remains separate:
- same-scan ret60 rank proxy;
- complete full-universe receipts;
- consecutive official-session requirement;
- GAP_UNKNOWN across missing sessions;
- no historical rank-duration fabrication.

### TI-481 — Taiwan PIT feasibility and maturity

Existing D03 real-source audit already demonstrated 82 daily bars on Taiwan symbols 2330 / 5314 / 2006 / 4977, sufficient for the 61-close maximum ordinary requirement of the own-path score.

Future inference requires:
- exact eligible official sessions;
- raw-history admission;
- TECHNICAL_CONTINUITY or explicit BLOCKED/UNKNOWN;
- corporate-action ancestry;
- constrained/special-session provenance;
- formulaVersion;
- parent decision/capture generation.

The rank-retention comparator is prospectively feasible from same-scan ret60 ranks without inventing historical duration.

Therefore D03-03 advances:
- L2 / 40% -> **L3 / 60% TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED**.

With the current 12-module curriculum:
- D03 aggregate = **50.0%**.

No outcome, OOS, Shadow profitability or threshold claim is opened.

### Current status

`D03_03 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`  
`OWN_PATH_PERSISTENCE = DISTINCT_FROM_RET_LEVEL_BUT_SHARED_PRICE_FAMILY`  
`ZERO_RETURN_TICK_LIQUIDITY_CONFOUND = MATERIAL_MECHANISM_RISK`  
`SCORE_CONTINUITY = PIECEWISE_STEPWISE_NOT_CALIBRATED_PROBABILITY`  
`RANK_PERSISTENCY = DISTINCT_CONSTRUCT / PROSPECTIVE_ONLY / ALPHA_UNKNOWN`  
`D03_MATURITY = 50.0_PERCENT`  
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

### Exact next continuation point

1. Preserve the raw-byte source/version gate at 2/3; Saturday 2026-10-03 is not a new Taiwan completed trading session.
2. Freeze a component-level research snapshot carrying positiveDayRatio20, zeroReturnRatio20, positiveHorizonPct, drawdownQuality20, maQuality, relativeTickPct, liquidity/provenance without Formal impact.
3. When inference opens, test own-path persistence residual value conditional on ret5/10/20/60, Residual RS, pathEfficiency, price/tick/liquidity and Regime.
4. Keep rank-retention as a distinct prospective-only construct conditional on current ret60 rank.
5. Continue D03-12 repaint-safe divergence PIT feasibility; it may promote only if confirmed pivot clocks and indicator state lineage are causally replayable.


## TI-482 through TI-490 — repaint-safe divergence PIT feasibility (2026-10-03)

Durable evidence:
- `research/D03_REPAINT_SAFE_DIVERGENCE_PIT_V0_1.md`
- `research/test_d03_repaint_safe_divergence_pit_v0_1.mjs`
- `research/d03_repaint_safe_divergence_contract_v0_1.json`

### TI-482/TI-483 — pivot anchor time is not signal time

Divergence first becomes legally observable only after the second price pivot is causally confirmed and required indicator/continuity/parent provenance is available.

Synthetic witness:
- L1 pivot D10 / confirmed D12, price 100, RSI 30.
- L2 pivot D20 / confirmed D23, price 95, RSI 36.

D22: no legal divergence exists.
D23: bullish divergence first becomes observable.

If price has moved from 95 at pivot to 99 at confirmation, +4.2105% has already elapsed and cannot be credited as post-signal performance.

### TI-484 — primary pair selection is now deterministic

Primary v0.1 uses the two most recent **consecutive confirmed price pivots of the same type and same Pattern swing scale** available as of the parent timestamp.

No skipping an intervening pivot, strongest-pair search, post-outcome selection or independent indicator-pivot matching is allowed.

Hidden divergence is outside the primary v0.1 family.

### TI-485/TI-486 — historical episode immutability and indicator lineage

A future pivot creates a new current pair but cannot rewrite an earlier first-observed divergence episode.

Indicator values sampled at pivotAt are causal only when formulaVersion, stateLineageId, TECHNICAL_CONTINUITY and source/session provenance are valid for that historical state. Later corrections create later versioned observations; they do not mutate the old decision truth.

### TI-487 — divergence is Pattern × Indicator interaction evidence

Divergence consumes Pattern-owned price pivot geometry plus D03 indicator progression. The pivot geometry cannot be counted once as Pattern evidence and again as independent confirmation inside divergence.

RSI/KD divergences on the same pivots are not independent votes by default. MACD divergence requires normalized magnitude for cross-sectional work.

### TI-488 — constrained-state taxonomy

Future rows preserve:
VALID_OBSERVABLE / VALID_BUT_CONSTRAINED / WARMUP_INCOMPLETE / DATA_BLOCKED / UNKNOWN_PROVENANCE.

Price-limit, suspension/no-trade, corporate-action continuity, warm-up and pivot provenance never silently become ordinary evidence.

### TI-489 — Taiwan PIT feasibility

Pattern already provides confirmed swings with pivotAt/confirmedAt, prefix/replay discipline and immutable parent provenance. D03 already provides causal KD/RSI/MACD formula replay, Taiwan OHLC feasibility and indicator state-lineage guards.

A divergence observation can therefore join existing Pattern swing receipts and indicator state at the two pivot dates without creating a new market-data family.

Historical Shadow divergence fabrication remains prohibited.

### TI-490 — maturity decision

D03-12 advances:
- L2 / 40% -> **L3 / 60% TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED**.

Current 12-module D03 aggregate:
- prior 50.0%;
- new **51.7%**.

No predictive authority, OOS/Shadow alpha, pivot-scale optimization or Formal eligibility is claimed.

### Current status

`D03_12 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`  
`DIVERGENCE_SIGNAL_CLOCK = CONFIRMED_AT_NOT_PIVOT_AT`  
`PRIMARY_PAIRING = CONSECUTIVE_SAME_SCALE_CONFIRMED_PRICE_PIVOTS`  
`HISTORICAL_EPISODE_REPAINT = FORBIDDEN`  
`CONFIRMATION_LAG_COST = REQUIRED`  
`D03_MATURITY = 51.7_PERCENT`  
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

### Exact next continuation point

1. Raw-byte source/version gate remains 2/3 over the weekend.
2. Divergence contract is frozen research-only; no runtime wiring.
3. Future divergence outcome work comes only after TI-005 KD-vs-RSI and TI-006 MACD-vs-direct-trend once the primary source gate opens.
4. Next outcome-blind specialist target is D03-13 multi-timeframe PIT feasibility: prove weekly/daily/15m causal boundary/partial-bar clocks can be replayed without treating aggregation agreement as independent votes.


## TI-491 through TI-503 — multi-timeframe PIT feasibility / causal clock audit (2026-10-03)

Durable evidence:
- `research/D03_MULTITIMEFRAME_PIT_FEASIBILITY_V0_1.md`
- `research/d03_multitimeframe_pit_contract_v0_1.json`
- `research/test_d03_multitimeframe_pit_feasibility_v0_1.mjs`

### TI-491 — three clocks are mandatory

Every bar-derived multi-timeframe feature now distinguishes:
- barStartAt = interval identity;
- barEndAt = mathematical completion;
- featureKnownAt = first valid system knowledge time after source fetch/provenance checks.

The chart label time is not the evidence-availability time.

### TI-492/TI-493 — M15 is PIT-feasible but current coverage is bounded

Repository runtime already:
- fetches Fugle timeframe=15 candles;
- filters to completed bars only;
- persists bar_start / bar_end / scheduled_time / source_fetched_at / source_family / completed_bar.

Current configured slots are 09:00 through 13:00 start times = 17 slots.

TWSE regular trading runs 09:00–13:30, so a full equal-interval regular session has 18 15m slots, with the final bar starting 13:15.

Because current System 1 minute Cron ends 13:24, the zero-extra-call path cannot observe the 13:15-start bar after it completes at 13:30.

Frozen state:
`M15_CURRENT_RUNTIME_COVERAGE = PARTIAL_REGULAR_SESSION_17_OF_18_SLOTS`.

A completed bar is eligible only after its end and actual source-known time. sourceFetchedAt is knowledge provenance, not semantic bar identity.

### TI-494 — Daily provisional/final semantics are executable

System 2 Daily Resonance already implements:
- LIVE -> PROVISIONAL_DAILY_BAR;
- FINAL + independent official-close confirmation -> CONFIRMED_DAILY_CLOSE;
- missing current-date bar -> CURRENT_DAILY_BAR_MISSING.

15m context cannot alter the daily EMA16/EMA64/Impulse-MACD state.

### TI-495/TI-497 — Weekly completion is calendar-aware

Weekly aggregation is deterministic from eligible daily OHLC, but completion is not “five bars”.

A week becomes completed only when the versioned official exchange calendar proves there is no later session remaining in the calendar week and symbol-session/suspension state is reconciled.

This correctly handles holiday-shortened weeks and prevents borrowing a next-week observation merely to reach five bars.

Required weekly provenance includes calendarWeekId, marketSessionCalendarVersion, symbolSessionReceiptId, source daily bar IDs, completedThrough/partialAsOf and continuity state.

### TI-496 — partial weekly direction can reverse

Synthetic Monday-Wednesday aggregate:
- O=100 H=104 L=98 C=99 -> down from open.

Completed Friday aggregate:
- O=100 H=106 L=97 C=105 -> up from open.

A Wednesday partial weekly state is causally available but is not equivalent to a completed weekly state.

### TI-498/TI-499 — Daily/M15 share information and current close-slot gap is explicit

M15 contributes to the daily bar and is usually SHARED_COMPONENT / NESTED_HORIZON evidence.

Intraday can still carry path information unavailable from daily OHLC, but it is execution/acceptance context rather than another daily-selection vote.

Current zero-extra-call M15 path covers through 13:15 only. The 13:15–13:30 closing interval remains `UNOBSERVED_CURRENT_ZERO_EXTRA_CALL_PATH`; therefore no “M15 session-close state” claim is allowed from those 17 bars.

### TI-500 — alignment is state, not vote count

Cross-timeframe relation remains:
ALIGNED / MIXED / CONFLICT / UNKNOWN.

SAME_EVENT_DUPLICATE, NESTED_HORIZON and SHARED_COMPONENT do not become independent votes.

Only DISTINCT_HORIZON_CONTEXT and DISTINCT_SESSION_INFORMATION begin with a plausible incremental-information prior, still requiring residual tests.

### TI-501 — System 2 resonance already follows the correct hierarchy

Existing Daily Resonance contract:
- daily-only EMA16/EMA64/Impulse;
- provisional live daily bar;
- confirmed final daily close;
- 15m = EXECUTION_AUXILIARY_ONLY;
- intraday15mAffectsDailyResonance = false.

D03 research therefore consumes this architecture rather than redesigning it.

### TI-502/TI-503 — Taiwan PIT feasibility and maturity

Weekly:
- existing daily PIT lineage + official calendar + symbol-session provenance + deterministic aggregation.

Daily:
- existing live/final adapter and close-finality gate.

M15:
- Fugle M15 + completed-bar filter + persisted bar clocks/provenance with explicit 17/18 coverage.

M5 is not required for v0.1 maturity.

Therefore D03-13 advances:
- L2 / 40% -> **L3 / 60% TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED_WITH_BOUNDED_INTRADAY_COVERAGE**.

Current active D03 modules = 12.
Aggregate:
- 620 + 20 = 640 maturity points;
- 640 / 1200 = **53.3%**.

No alpha, timeframe optimization, full closing-M15 coverage, OOS/Shadow or Formal authority is claimed.

### Current status

`D03_13 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED_WITH_BOUNDED_INTRADAY_COVERAGE`  
`WEEKLY_COMPLETION = CALENDAR_AWARE_CAUSAL`  
`DAILY_FINALITY = PROVISIONAL_VS_CONFIRMED`  
`M15_CURRENT_RUNTIME_COVERAGE = 17_OF_18_REGULAR_SLOTS`  
`TIMEFRAME_AGREEMENT = HIERARCHICAL_CONTEXT_NOT_VOTE_COUNT`  
`D03_MATURITY = 53.3_PERCENT`  
`OUTCOME_INFERENCE = NO_GO`  
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

### Exact next continuation point

1. Keep raw-byte prospective completed-session gate at 2/3 over the weekend.
2. Do not add the missing 13:15 M15 bar from this research room; runtime extension is an engineering/governance question.
3. Future M15 inference must use exact featureKnownAt, common-support slot coverage and daily-setup conditioning.
4. Future weekly inference must beat equal-horizon daily controls and boundary-sensitivity controls.
5. Primary efficacy queue remains TI-005 then TI-006 once the raw source gate opens.
6. Next outcome-blind D03 specialist target: D03-04 momentum continuation vs D03-03 persistence and D03-02 direct-return family, focusing on construct separation and Taiwan PIT feasibility.


## TI-504 through TI-515 — momentum continuation construct / PIT feasibility (2026-10-03)

Durable evidence:
- `research/D03_MOMENTUM_CONTINUATION_CONSTRUCT_PIT_V0_1.md`
- `research/d03_momentum_continuation_contract_v0_1.json`
- `research/test_d03_momentum_continuation_construct_v0_1.mjs`

### TI-504 — ownership separation

D03-02 owns current ret5/ret20/ret60 momentum level.
D03-03 owns current own-path persistence / rank-persistency constructs.
D03-04 owns the post-decision continuation/reversal relationship conditional on frozen decision-time state.

D03-04 therefore does not create another weighted current-price score.

### TI-505 — rolling retN sign retention is mechanically overlapped

Synthetic witness:
- current ret20 = +20%;
- next D5 true forward return = -4.1667%;
- rolling ret20 at D+5 remains +9.5238%.

The future rolling ret20 reuses 15 of 20 pre-decision intervals, so a positive rolling sign can persist despite an actual post-decision loss.

`ROLLING_RETN_SIGN_RETENTION = REJECTED_AS_PRIMARY_CONTINUATION_OUTCOME`.

### TI-506/TI-507 — primary post-decision outcome contract

Primary outcomes use sessions after the parent:
- D5 forward return / MFE / MAE;
- D10 and D20 as secondary horizons.

Decision state is frozen before outcomes and includes current ret levels/rank, persistence, Residual RS, tick/liquidity, volatility, Regime/transition, constrained state and source/continuity lineage.

Future outcome never enters the parent fingerprint.

### TI-508/TI-509 — Taiwan state and return-origin confounds

Taiwan literature reports momentum continuation under market-state continuation and reversal under market-state transitions. D18 owns Regime construction; D03 consumes that causally defined state rather than building a second Regime engine.

Taiwan evidence also reports different future behavior for momentum originating from intraday versus overnight returns. D03 freezes return-origin as a potential effect modifier; no new factor is created without source-ready provenance.

### TI-510/TI-511 — persistence/rank retention != economic continuation

High own-path persistence does not logically imply positive forward return.
Winner-rank retention and economic forward return are distinct:
- a stock can keep winner rank with negative absolute return if peers fall more;
- a stock can earn positive return and lose rank if peers rise more.

Rank retention remains a relative/persistence state, not a proxy for D5/D10/D20 economic continuation.

### TI-512 — extreme-strength duplication remains rejected

Existing ret20/MA-distance late-stage/overheat/ATR controls already represent extreme strength. A new extreme-continuation factor would be redundancy-high.

### TI-513/TI-514 — Taiwan PIT outcome feasibility

Promotion-grade future outcomes require exact symbol-session and corporate-action lineage, not generic next-available-row slicing.

Required:
parent/capture generation, semantic price space, symbol-session calendar, verified suspensions, continuity version, exact future eligible session IDs, outcome source/version and explicit mature/censored/blocked/unknown states.

Existing research infrastructure already supports D5/D10/D20/MFE/MAE and current D03 source paths support the predictor state. No new market-data family is needed.

### TI-515 — maturity

D03-04 advances:
- L2/40 -> **L3/60 TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED**.

Active 12-module D03:
- prior 640/1200 = 53.3%;
- new 660/1200 = **55.0%**.

This is construct + PIT feasibility only. No continuation alpha/OOS/Shadow/threshold/Formal claim.

Current:
`D03_04 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`
`MOMENTUM_CONTINUATION = POST_DECISION_TRANSITION_OUTCOME_RELATION`
`ROLLING_RETN_SIGN_RETENTION = REJECTED_AS_PRIMARY_OUTCOME`
`REGIME_STATE = D18_OWNED_CONTEXT`
`D03_MATURITY = 55.0_PERCENT`
`OUTCOME_INFERENCE = NO_GO`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

### Exact next continuation point

1. Raw-byte source gate remains 2/3 over the weekend.
2. Keep predictors and future outcome receipts separate.
3. Once empirical work opens, use non-overlapping future outcomes with exact symbol-session provenance.
4. TI-005/TI-006 remain first efficacy tests.
5. Next outcome-blind D03 target: D03-05 Pullback/short-term reversal — separate setup-origin pullback from generic reversal and audit ownership with D01 Pattern + 15m confirmation.


## TI-516 through TI-525 — pullback / short-term reversal ownership and data gate (2026-10-03)

Durable evidence:
- `research/D03_PULLBACK_REVERSAL_OWNERSHIP_DATA_GATE_V0_1.md`
- `research/d03_pullback_origin_contract_v0_1.json`
- `research/test_d03_pullback_origin_gate_v0_1.mjs`

### TI-516/TI-517 — generic reversal score is redundant

Current A/PULLBACK daily setup already requires established trend, 2–15% pullback, support proximity, volume/structure and not-late guards. Current M15 execution adds held/volume/reversal-or-strong-close/higher-low/turn-up confirmation.

A new generic short-term reversal score would duplicate D01/D03 setup and execution architecture.

Pullback depth is not pullback cause.

### TI-518 — residual question is origin attribution

Frozen research-only origins:
STRUCTURAL_DIGESTION_NO_IDENTIFIED_SHOCK /
MARKET_OR_SECTOR_DRIVEN_PULLBACK /
EVENT_INFORMATION_PULLBACK /
LIQUIDITY_PRESSURE_CANDIDATE /
PRICE_LIMIT_OR_CONSTRAINED_DISCOVERY /
MULTIPLE_ORIGINS /
UNKNOWN_ORIGIN.

These are moderators/diagnostics, not BUY/SELL states.

### TI-519/TI-520 — liquidity origin cannot be inferred from candles

Lower shadow, high volume or later rebound cannot certify non-informational liquidity pressure.

Taiwan reversal evidence using actual trading-imbalance data supports the mechanism, but current D05 explicitly lacks promotion-grade true OFI/replenishment completeness at the required horizon.

Absent a valid D05 pressure/depth/response/persistence/capture receipt:
`LIQUIDITY_PRESSURE_ORIGIN = UNKNOWN`.

No OHLCV fallback is allowed.

### TI-521/TI-522 — owner receipts and price-limit separation

Market/sector origin consumes D09/D18.
Event origin consumes D11/D17.
Liquidity origin consumes D05.
Price-limit/session mechanism consumes D01/D05.
Structural pullback geometry remains D01/D03.

Multiple valid origins remain MULTIPLE rather than forced single-cause attribution.

Historical Taiwan price-limit continuation/reversal evidence is not portable as a current universal rule; constrained episodes remain separately tagged.

### TI-523/TI-524 — confirmation clock and future design

pullbackLowAt is not reversalConfirmedAt.
Confirmation lag and price already elapsed before reclaim/higher-low/turn-up/15m acceptance must be charged.

Future primary design compares the same A/PULLBACK setup across valid origin contexts after controlling depth/support, ret20/60, persistence, Residual RS, Regime, ATR, liquidity, Pattern lifecycle and Price-Volume state.

### TI-525 — maturity remains L2

D03-05 stays:
- **L2 / 40% MECHANISM_AND_FALSIFICATION_DEFINED**.

Reason:
the remaining independent origin-attribution question is cross-lane data-gated, especially the D05 liquidity-pressure branch.

Current:
`GENERIC_REVERSAL = REJECTED_OR_REDUNDANT`
`PULLBACK_ORIGIN = MODERATOR_DIAGNOSTIC`
`LIQUIDITY_PRESSURE_ORIGIN = DATA_GATED_BY_D05`
`D03_05 = L2_REMAINS`
`D03_MATURITY = 55.0_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.


## TI-526 through TI-533 — ADX / Bollinger L3 blocker audit (2026-10-03)

Durable analysis:
- `research/D03_ADX_BOLLINGER_L3_BLOCKER_AUDIT_V0_1.md`.

### TI-526 — Formula-ready is not PIT-ready

ADX14 and Bollinger20x2 both have frozen formula/mechanics semantics, but isolated R0 formula readiness is not R1 source/PIT readiness.

### TI-527/TI-529 — ADX remains L2

ADX is cascaded recursive state. Deeper history-fetch/cache capability exists, but promotion-grade ADX requires canonical TECHNICAL_CONTINUITY H/L/C history, formulaVersion, stateLineageId, canonical replay/trusted prior state, replay certification, source/transform hashes, immutable parent/capture generation and constrained-session provenance.

Current shared observer/runtime status still has TECHNICAL_CONTINUITY and exact prospective parent lineage blocked.

Therefore `DEEP_HISTORY_AVAILABLE != ADX_PIT_REPLAY_VALIDATED`.

A 150/200-bar local recomputation today may be useful QA but cannot establish what an earlier parent knew.

D03-09 remains **L2/40**.

### TI-528 — arbitrary warm-up is not recursive-state repair

Earlier 65-vs-150 ADX evidence proves initialization sensitivity but does not make 150 bars a universal certification threshold.

Corporate-action/source revisions require replay from canonical/trusted lineage. Waiting an arbitrary number of bars does not restore provenance.

### TI-530/TI-531 — Bollinger is finite-window but still R1 blocked

Bollinger20x2 needs only an exact certified 20 eligible-session close window and no recursive state once that window is known.

This makes L3 certification simpler than ADX.

However current runtime still lacks the required promotion-grade TECHNICAL_CONTINUITY receipt + exact prospective parent lineage + price-limit/special-session provenance.

Raw 20-bar availability is insufficient.

D03-10 remains **L2/40**.

### TI-532 — numerical observability != certified evidence

A valid number can still be PIT-ineligible:
- BBW across an unresolved corporate-action boundary;
- ADX recomputed using a later history lineage;
- technical state on a constrained price-limit path without constraint provenance;
- indicator value attached to an unfrozen parent generation.

Readiness remains hierarchical:
R0 formula QA -> R1 source -> R2 prospective coverage -> R3 descriptive -> R4 outcome join -> R5 incremental inference.

### TI-533 — no maturity inflation

D03-09 remains L2/40.
D03-10 remains L2/40.
D03 remains **55.0%**.

`D03_09 = L2_R1_SOURCE_BLOCKED`
`D03_10 = L2_R1_SOURCE_BLOCKED`
`ADX_RECURSIVE_LINEAGE = CANONICAL_REPLAY_REQUIRED`
`BOLLINGER_FINITE_WINDOW_CERTIFICATION = SIMPLER_THAN_ADX_BUT_NOT_YET_PHYSICAL`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.


## TI-534 through TI-542 — D03-05 observable pullback/reversal PIT reconciliation (2026-10-04)

Durable artifacts:
- `research/D03_PULLBACK_REVERSAL_OBSERVABLE_PIT_V0_2.md`
- `research/d03_pullback_reversal_observable_contract_v0_2.json`
- `research/test_d03_pullback_reversal_observable_pit_v0_2.mjs`

### TI-534 — H07 ownership correction

The owner-approved H07 semantic split establishes that D03-05 owns the **observable price phenomenon**:
- pullback geometry;
- short-horizon reversal;
- failed reversal;
- observable price/volume/volatility state;
- PIT-safe replay.

Liquidity/event/market/behavioral cause labels are optional owner-lane moderators. Missing cause evidence leaves `originState=UNKNOWN`; it no longer blocks recognition of a causally observable pullback/reversal episode.

This supersedes the earlier overly strict interpretation that promotion-grade causal-origin attribution was required before the observable D03-05 phenomenon itself could reach L3.

### TI-535 — frozen parent geometry

Research reuses current A/PULLBACK observable geometry without changing Formal behavior:
- trend valid;
- 2%-15% pullback from recent high;
- support distance <=4%;
- volume contraction / no heavy sell-volume condition;
- structure intact;
- non-late-stage.

Parent evidence preserves scan/plan/symbol/source/formula/support/recent-high/pullback/support-distance/checks/known-at lineage.

### TI-536/TI-538 — causal 15m state machine and signal clock

Research-only states:
`PULLBACK_PENDING -> ZONE_ENTERED_HELD -> REVERSAL_SEED_VISIBLE -> REVERSAL_CONFIRMED`,
with explicit `FAILED_ZONE_BREAK`, `FAILED_DOWN_VOLUME`, `DATA_BLOCKED` and `UNKNOWN_PROVENANCE`.

A seed bar may enter/hold the zone with local volume ratio <=0.9 and reversal morphology. Confirmation requires a later completed 15m bar with higher low and bullish turn-up.

The low/seed bar is a geometric anchor only. Legal signal time is the later confirmation-bar known time:
`reversalConfirmedAt=max(confirmBarEnd, confirmFeatureKnownAt, required prior/parent availability)`.

Pre-confirmation recovery is confirmation-lag cost, not post-signal alpha.

### TI-537 — exact-slot continuity guard

The production local previous-five volume ratio can remain numerically present if an expected 15m slot is missing because it uses the prior five available completed bars.

D03-05 research is intentionally stricter:
- all expected ordinary-session slots through confirmation must be present;
- missing slot => `DATA_BLOCKED/MISSING_EXPECTED_15M_SLOT`;
- no interpolation/zero-fill/older-bar substitution.

This prevents a valid number from masquerading as a valid clock-consistent feature.

### TI-539/TI-540 — failure and constrained states are first-class

Failed reversal is preserved, not discarded.

Corporate-action/session/price-limit constraints remain explicit:
- unresolved episode comparability => DATA_BLOCKED;
- observable but constrained market state => VALID_BUT_CONSTRAINED;
- no pseudo-bars for no-trade/suspension.

Historical episode chronology is append-only.

### TI-541 — origin is optional moderator

Optional owner receipts may describe:
- market/sector context;
- event information;
- microstructure pressure;
- behavioral context.

No owner receipt => UNKNOWN_ORIGIN.
Candle shape cannot certify liquidity-pressure origin.
Multiple valid owners remain MULTIPLE_ORIGINS.
Origin never creates direct trading authority.

### TI-542 — maturity

Existing repository infrastructure already provides:
- replayable A/PULLBACK daily geometry;
- completed Fugle 15m source semantics;
- Price-Volume Shadow immutable research snapshots/outcomes;
- deterministic A lifecycle test `A_PULLBACK_TEST -> A_INITIAL_ACCEPTANCE -> A_REACCELERATION`;
- same-session horizon and missing/late-session guards.

The new D03 v0.2 contract adds exact-slot continuity and non-backdated confirmation clocks.

Therefore D03-05 advances:
**L2/40 -> L3/60 TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED** for the observable phenomenon only.

Causal-origin attribution remains PARTIAL/UNKNOWN-allowed and no alpha/outcome/threshold/Formal claim is opened.

With 12 active D03 modules:
**D03 55.0% -> 56.7%**.

Current status:
`D03_05 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`
`OBSERVABLE_PULLBACK_REVERSAL_EPISODE = PIT_FEASIBLE`
`ORIGIN_ATTRIBUTION = OPTIONAL_MODERATOR / PARTIAL / UNKNOWN_ALLOWED`
`M15_MISSING_SLOT = DATA_BLOCKED`
`REVERSAL_SIGNAL_CLOCK = CONFIRM_BAR_KNOWN_AT_NOT_PULLBACK_LOW`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.


## TI-543 through TI-550 — primary queue outcome-closed preregistration (2026-10-04)

Durable preregistration:
- `research/D03_PRIMARY_QUEUE_INCREMENTAL_INFERENCE_PREREG_V0_1.md`
- `research/d03_primary_queue_incremental_inference_prereg_v0_1.json`

### TI-543 — raw source 3/3 is necessary, not sufficient

The source-version observer and the Technical Indicator inference observer are distinct gates.

Raw source gate:
- requires three independent completed Taiwan sessions;
- current state remains 2/3;
- the third session must use the frozen receipt-equivalent raw-byte protocol plus same-date repeat.

Even if 3/3 passes, Technical Indicator outcomes remain closed until:
- shared immutable parent generation/keyset exists;
- TECHNICAL_CONTINUITY or explicit BLOCKED/UNKNOWN state exists per parent;
- symbol-session / price-limit / special-session provenance is complete;
- observer attempts exactly reconcile to the parent keyset;
- formula/state construction/replay/prefix semantics pass;
- common-support prospective coverage is ready.

System2's 2026-10-02 daily diagnostic artifact is not substituted for the missing D03 raw receipt. Its schema/clock differs and its own receipt reports source/history not ready and continuity coverage zero.

### TI-544/TI-545 — TI-005 KD vs RSI semantic question and ladder

The primary question is not which named indicator wins.

It is whether:
- B2 rolling-range / extreme-location information; and
- B3 signed-return gain/loss balance

add incremental information beyond direct price/trend/context controls.

Frozen ladder:
- K0 BASE = ret5/10/20/60 + trend/MA/EMA + persistence + path efficiency where valid + ATR/volatility + Pattern + PV + Regime + liquidity/price tier + overheat + constrained-session state.
- K1 = K0 + one continuous B2 range-position representation.
- K2 = K0 + continuous RSI14.
- K3 = K0 + B2 + RSI14.
- K4 diagnostic = K3 + preregistered K/D smoothing residual fields.

No zone/crossover/20-80/30-70 threshold vote has primary authority.

Frozen nulls:
- H005-A: B2 adds no increment beyond K0.
- H005-B: RSI14 adds no increment beyond K0.
- H005-C: K3 adds no value beyond the better single-basis model.
- H005-D: K/D smoothing adds no residual information beyond K3.

### TI-546/TI-547 — TI-006 MACD vs direct trend question and ladder

Exact/non-independent aliases stay excluded:
- zero-line state separately from EMA12/EMA26 alignment;
- signal-line crossover separately from Histogram sign;
- raw unnormalized DIF/Histogram magnitude cross-sectionally.

Frozen ladder:
- M0 = direct returns + EMA/MA trend/alignment/slope + trend persistence + comparable acceleration + Pattern/PV/Regime/liquidity/overheat controls.
- M1 = M0 + normalized DIF%.
- M2 = M0 + DIF slope + normalized Histogram% + Histogram slope.
- M3 = M0 + all preregistered non-alias MACD residual fields.

Frozen nulls:
- H006-A: normalized DIF adds no residual value.
- H006-B: transition/curvature fields add no residual value.
- H006-C: combined MACD residuals add no value beyond the better single residual family.

If faster response is accompanied by materially worse false-transition / MAE / cost burden, classify SPEED_NOISE_TRADEOFF, not incremental alpha.

### TI-548 — outcome family is frozen before outcomes

Primary horizon = D5.

Registered co-primary family:
- D5 returnPct;
- D5 MFE;
- D5 MAE.

All three remain in the same multiplicity ledger. No favorable endpoint selection.

Registered secondary:
- D10 return/MFE/MAE;
- D20 return/MFE/MAE.

Secondary horizons cannot rescue a failed D5 primary conclusion.

Execution/fill claims need their own provenance and are not inferred from daily OHLC.

### TI-549 — dependence/inference handoff to D16

D03 freezes feature/estimand identities; D16 owns the final statistical method.

Before outcome access, a D16 method receipt must freeze one procedure with:
- exact common support;
- equal-scanDate weighting where date-level aggregation is used;
- scanDate dependence-aware inference;
- repeated-symbol/episode dependence diagnostics;
- purged chronological train/holdout;
- untouched holdout;
- leave-one-date sensitivity;
- Regime/industry/price-tier/liquidity concentration diagnostics;
- non-overlapping outcome-window sensitivity where feasible;
- no row-count pseudo-replication.

With few date clusters, naive asymptotic t-statistics alone are not sufficient.

### TI-550 — rejection / promotion firewall

Reject a representation as additive alpha if:
1. no incremental effect on preregistered common support;
2. effect disappears after direct-price/trend controls;
3. effect is carried only by deterministic child/alias fields;
4. effect exists only in selected-only coverage;
5. effect is unstable under leave-one-date/holdout/Regime sensitivity;
6. result is concentrated in one narrow date/industry/price/liquidity cell;
7. coverage/UNKNOWN/zero-pick/opportunity loss drives the appearance;
8. response-speed benefit is offset by false transitions/MAE/costs;
9. outcome-driven threshold/parameter tuning is required;
10. version/source/state-lineage incompatibility remains unresolved.

Surviving this stage means at most `PREDICTIVE_INCREMENTALITY_CANDIDATE`.
It does not automatically create a Formal Optimization Candidate.

### Frozen execution floors

Before incremental inference:
- D5 mature rows >= 60;
- prospective complete snapshots >= 30;
- independent Formal scan dates >= 15;
- >=2 market Regimes;
- purged train dates >= 10;
- untouched holdout dates >= 5;
- coverage/zero-pick/redundancy/cost/overfit gates pass.

### Current status

`TI_005_PREREGISTERED = TRUE / OUTCOME_CLOSED`  
`TI_006_PREREGISTERED = TRUE / OUTCOME_CLOSED`  
`RAW_SOURCE_VERSION_GATE = 2_OF_3`  
`TECHNICAL_OBSERVER_R1 = BLOCKED_SHARED_PARENT_CONTINUITY_RUNTIME`  
`D03_MATURITY = 56.7_PERCENT`  
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

### Exact next continuation point

1. On the next genuine Taiwan completed session, capture the third D03 raw source-version receipt and same-date repeat using receipt-equivalent transport.
2. If 3/3 passes, do not open outcomes automatically.
3. Re-audit immutable parent keyset/generation, TECHNICAL_CONTINUITY, symbol-session/limit provenance, stateConstructionMode, exact attempt accounting and replay/prefix parity.
4. The true Technical Indicator prospective observer clock starts only when T1-T3 are physically live.
5. Accumulate common-support prospective coverage to the frozen T4/T6 floors.
6. Obtain D16 method receipt before T5 outcome access.
7. Execute TI-005 first and TI-006 second; do not reorder based on descriptive results.


## TI-551 through TI-554 — D03 -> D16 method handoff (2026-10-04)

Durable handoff:
- `research/D03_PRIMARY_QUEUE_D16_METHOD_HANDOFF_V0_1.md`
- `research/d03_primary_queue_d16_method_handoff_v0_1.json`

### TI-551 — ownership boundary
D03 owns feature/alias semantics, nested K0-K4/M0-M3 comparisons, outcome family, multiple-testing family and TI-005 -> TI-006 order.
D16 owns dependence-aware estimator, finite-sample uncertainty, clustering/resampling, purging/holdout implementation and inferential method.

D16 must return METHOD_BLOCKED / POWER_INSUFFICIENT rather than change D03 formulas, periods, endpoints or experiment order after outcome inspection.

### TI-552 — dependence graph
Rows are not IID because they share scanDate shocks, repeated symbols/episodes, overlapping D5/D10/D20 outcomes, overlapping feature histories and sector shocks.
Row count is not independent N.

Required reporting includes row count, independent scanDate count, unique symbols, date cluster sizes, repeated-symbol share and outcome-window overlap.

### TI-553 — method receipt requirement
Before T5 outcomes, D16 must return a machine-readable method receipt freezing:
- identity/version hashes;
- parent/common-support population;
- BLOCKED/UNKNOWN handling;
- chronological train/purge/holdout dates;
- dependence/small-cluster treatment;
- exact estimands and weighting;
- leave-one-date/non-overlap/date-balance/concentration/repeated-symbol/coverage sensitivities;
- multiple-testing family/handling;
- terminal method state.

Allowed terminal method states include METHOD_READY, METHOD_BLOCKED, POWER_INSUFFICIENT, DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE, COMMON_SUPPORT_INSUFFICIENT, COVERAGE_BIASED and VERSION_INCOMPATIBLE.

### TI-554 — allowable research conclusions
After a valid D16 method execution, D03 accepts only frozen research labels such as NO_INCREMENTAL_VALUE, MECHANISM_PRESENT_BUT_PREDICTIVE_VALUE_INCONCLUSIVE, SPEED_NOISE_TRADEOFF, CONTEXT_PROXY_RISK, COVERAGE_BIASED, FRAGILE_DATE_DEPENDENCE, REGIME_OR_INDUSTRY_CONCENTRATED, VERSION_INCOMPATIBLE or PREDICTIVE_INCREMENTALITY_CANDIDATE.

Even PREDICTIVE_INCREMENTALITY_CANDIDATE remains research-only.

Current:
`D16_METHOD_HANDOFF = FROZEN_V0_1`
`D16_METHOD_RECEIPT = NOT_YET_RETURNED`
`OUTCOMES = CLOSED`
`RAW_SOURCE_VERSION_GATE = 2_OF_3`
`TECHNICAL_OBSERVER_R1 = BLOCKED`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

No maturity increase is assigned for preregistration/method handoff alone.


## TI-555 through TI-563 — continuity revision-source blocker reduction (2026-10-04)

Durable artifacts:
- `research/D03_CONTINUITY_REVISION_SOURCE_PROGRESS_20261004_V0_1.md`
- `research/d03_continuity_revision_source_progress_20261004_v0_1.json`

### TI-555 — transport failure separated from source truth
A physical TLS diagnostic on the modern `mops.twse.com.tw` gateway recorded an expired TWSE leaf certificate (notAfter 2026-05-31 GMT; OpenSSL verify code 10). No TLS bypass is allowed. The resulting transport failure is not negative evidence about historical MOPS content.

### TI-556 — secure direct official historical source
Direct official `mopsov.twse.com.tw/mops/web/ajax_t05st01` passed standard TLS and a 2467 read-only positive control:
- TLS valid through 2026-11-28 GMT;
- HTTP 200;
- original + correction both present;
- no D1/Production/Formal effect.

### TI-557 — physical 5/5 cross-family correction/cancellation capability
Workflow run `37167344795` physically passed all five frozen controls:
- 2467 dividend original+correction;
- 1459 capital-reduction schedule original+correction;
- 2321 capital-reduction decision original+correction;
- 1342 cash-capital-increase original+correction;
- 1342 cash-capital-increase cancellation.

Summary:
`MULTI_FAMILY_CORRECTION_AND_CANCELLATION_CAPABILITY_OBSERVED`
with correction 4/4, cancellation 1/1 and four distinct action families.

### TI-558/TI-559 — capability does not certify completeness
Still false/unproven:
- boundedIntervalCoverageComplete;
- actionFamilyCoverageComplete;
- cancellationHistoryComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified.

Next source work must prove bounded query population, no hidden pagination/truncation, immutable version clocks and cross-source reconciliation. Absence cannot be claimed from a non-certified bounded population.

### TI-560 — immutable parent has owner approval but is not yet physical
Latest main contains `research/SYSTEM1_SHADOW_COHORT_MEMBERSHIP_CLASS_B_HANDOFF_20261004.md`:
`OWNER_APPROVED_CLASS_B / IMPLEMENTATION_PENDING / FORMAL_CORE_LOCKED`.

But canonical parent/persistence status still says:
`CURRENT_PRODUCTION_IMMUTABLE_PARENT = NOT_IMPLEMENTED`,
`RUNTIME_IMPLEMENTATION = NOT_IMPLEMENTED`,
`D1_SCHEMA_IMPLEMENTATION = NOT_IMPLEMENTED`.

Approval is not a persisted/read-back generation receipt.

### TI-561/TI-562 — module decisions
Bollinger remains L2/40:
needs physical immutable parent generation + certified bounded TECHNICAL_CONTINUITY + exact 20-session window/replay/attempt accounting.

ADX remains L2/40:
needs all Bollinger-class lineage plus canonical Wilder recursive-state replay/trusted prior-state certification.

### TI-563 — anti-inflation maturity decision
D03 remains **56.7%**.

The source blocker is materially narrower, but the L3 curriculum gate has not been met for D03-09/10.

Next honest levels:
- D03-10 Bollinger L3 => **58.3%**;
- then D03-09 ADX L3 => **60.0%**.

Current:
`MOPSOV_MULTI_FAMILY_REVISION_CANCELLATION = 5_OF_5_PHYSICAL_PASS`
`BOUNDED_REVISION_COMPLETENESS = NOT_YET_PROVEN`
`IMMUTABLE_PARENT_CLASS_B = OWNER_APPROVED_IMPLEMENTATION_PENDING`
`D03_10 = L2_REMAINS`
`D03_09 = L2_REMAINS`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Raw D03 source-version gate remains independently 2/3 and TI-005/TI-006 outcomes remain closed.

## TI-564 through TI-574 — continuity source-contract advance (2026-10-04)

Durable artifacts:
- `research/D03_MOPS_VERSION_CLOCK_CONTRACT_V0_1.md`
- `research/d03_mops_version_clock_contract_v0_1.json`
- `research/D03_CONTINUITY_SOURCE_CONTRACT_ADVANCE_20261004_V0_2.md`
- `research/d03_continuity_source_contract_advance_20261004_v0_2.json`

### TI-564~566 — version-clock semantics
- MOPS `發言日期/發言時間` are preserved as `sourceReportedAt`, not silently promoted to historical `firstKnownAt`.
- `capturedAt` and append-only prospective `firstObservedAt` are separate clocks.
- historical `firstKnownAt` remains UNKNOWN unless an authoritative publication-time contract is certified.
- prospective `firstObservedAt` is a conservative no-lookahead research clock.
- ORIGINAL/CORRECTION/SUPPLEMENT/CANCELLATION are separate immutable versions; later final state never overwrites earlier chronology.

### TI-567 — empty-month source-local certification
System2 MOPSOV Empty Month Certification V0.2 physically certifies the frozen empty signature:
- empty controls 4/4 PASS;
- positive controls 3/3 PASS;
- transport/error/positive/empty states are distinguishable.
This is endpoint-specific and does not authorize global NO_EVENT.

### TI-568 — bounded month-shard reconciliation
Existing physical evidence includes:
- 2330 Jan-Sep company-year prefix = 151 rows;
- exact union of nine monthly shards = 151;
- multi-control correction/cancellation companies also reconcile exactly;
- zero only-full-query / only-month-shard / duplicate-month keys.

### TI-569 — high-row pagination/truncation stress
Physical run `37174063094` = PASS.

Top deterministic high-row controls:
- 2891 = 391 rows;
- 3711 = 383 rows;
- 2881 = 300 rows.

All three:
- full Jan-Sep prefix keyset equals monthly-shard union exactly;
- onlyAll=0;
- onlyMonths=0;
- duplicateMonthKey=0;
- no visible next-page/page-number/step=3 hints.

This materially falsifies a low fixed-row truncation concern, but universal no-truncation is not certified.

### TI-570 — completeness remains scoped
Stronger source-contract evidence now exists for:
- correction/cancellation representational capability;
- empty-month semantics;
- company-year/month-shard reconciliation;
- high-row reconciliation through 391 rows.

Still false/unproven globally:
- boundedIntervalCoverageComplete;
- actionFamilyCoverageComplete;
- revisionCoverageComplete;
- knownAtVersionClockCertified;
- technicalContinuityCertified.

### TI-571~572 — exchange-side official document lane
The official TWSE public `Official Document Announcement / 公文公告` surface visibly contains exchange-issued capital-action rows including:
- capital-reduction exchange schedules;
- suspension/resumption dates;
- new-share listing/effective dates;
- suspension of capital-reduction registration;
- revocation of such suspension.

Therefore:
`EXCHANGE_OFFICIAL_DOCUMENT_PUBLIC_CAPABILITY = OBSERVED`.

A stable machine/date-range/pagination/raw-artifact contract is not yet frozen:
`EXCHANGE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT = PARTIAL_UNKNOWN`.

Absence from this lane may not be interpreted as NO_EVENT.

### TI-573~574 — module decision
D03-10 Bollinger remains L2/40 because it still needs physical immutable parent generation/readback and a symbol-window certified TECHNICAL_CONTINUITY receipt for its exact 20 eligible sessions.

D03-09 ADX remains L2/40 because it needs all Bollinger-grade provenance plus canonical Wilder recursive replay/trusted-prior-state certification.

No maturity inflation:
`D03_MATURITY = 56.7_PERCENT`
`BOLLINGER_L3_NEXT = 58.3_PERCENT`
`ADX_L3_AFTER_THAT = 60.0_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact continuation:
1. stop repeating generic MOPSOV row-count stress unless a new falsification target appears;
2. freeze a reproducible TWSE official-document machine contract or retain PARTIAL/UNKNOWN;
3. prospectively measure `firstObservedAt - sourceReportedAt` without outcomes;
4. consume immutable parent only after the owner-approved Class-B implementation is physically merged/read back;
5. re-review Bollinger before ADX;
6. raw D03 source-version session gate remains independently 2/3 until a genuine next completed Taiwan session.

## TI-575 through TI-579 — immutable parent deployment reassessment (2026-10-04)

Durable artifacts:
- `research/D03_IMMUTABLE_PARENT_DEPLOYMENT_REASSESSMENT_20261004_V0_1.md`
- `research/d03_immutable_parent_deployment_reassessment_20261004_v0_1.json`

### TI-575
The prior D03 state `IMMUTABLE_PARENT_RUNTIME=IMPLEMENTATION_PENDING` is superseded.
System 1 V8.17.0 Shadow Cohort Membership was owner-approved, PR #454 merged and Production deployed.
Deploy run `37171810825` succeeded and runtime version readback verified `8.17.0-shadow-cohort-membership`, TEST_MODE=false, KV/D1=true, Formal Core unchanged.

### TI-576
Deployment is not a prospective market generation.
Canonical implementation status remains:
`FIRST_PROSPECTIVE_SHADOW_COHORT_READBACK=PENDING_NEXT_GENUINE_TRADING_SESSION`
`FIRST_PROSPECTIVE_C1_CHILD_READBACK=PENDING_NEXT_GENUINE_TRADING_SESSION`.

2026-10-04 is non-trading, so no synthetic/historical reconstruction may be used to manufacture a PASS.

### TI-577
The shared engineering substrate now physically exists: immutable C1 parent generation, population receipts, overlapping candidate memberships, append-only quality overlays, atomic D1 persistence, immutable conflict guards and whole-generation readback verification.

### TI-578
D03 R1/R2 still requires one genuine post-deployment normal-scan generation with exact parent/keyset/count/readback/quality-watermark verification.

Current:
`IMMUTABLE_PARENT_RUNTIME=DEPLOYED_AND_VERSION_VERIFIED`
`GENUINE_PARENT_GENERATION=NOT_YET_OBSERVED`
`TECHNICAL_OBSERVER_PARENT_READY=PENDING_GENUINE_READBACK`.

### TI-579
No maturity inflation:
`D03_10=L2_REMAINS`
`D03_09=L2_REMAINS`
`D03_MATURITY=56.7_PERCENT`

Parent deployment removes one design/engineering blocker, but Bollinger still needs genuine parent readback + certified 20-session TECHNICAL_CONTINUITY; ADX additionally needs recursive replay authority.

Next genuine Taiwan trading session:
normal scan -> existing C1 evidence workflow -> immutable parent/cohort readback -> D03 re-audits Bollinger source/continuity gate first.

## TI-580 through TI-587 — TWSE official-document bounded machine contract (2026-10-04)

Durable artifacts:
- `research/D03_TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT_V0_1.md`
- `research/d03_twse_official_document_machine_contract_v0_1.json`
- `research/d03_twse_official_document_machine_contract_v0_1.mjs`

### TI-580~581 — list machine endpoint + positive control
Official TWSE page physically resolves a machine endpoint:
`https://wwwc.twse.com.tw/rwd/zh/announcement/announcement`
with `startDate/endDate/keyword/response` and server-side paging arguments.

Frozen 2026-07-01~2026-08-10 keyword `減資` query returns stat=ok, total=3 and fields:
項次 / 發文日期 / 發文字號 / 主旨 / id.

1459 聯發 2026-07-02 capital-reduction exchange schedule is physically present.

### TI-582 — pagination reconciliation
On the same interval with keyword blank:
- total=56;
- paging=15;
- page counts 15+15+15+11;
- fetched=56;
- unique ids=56;
- duplicate ids=0;
- unpaged result also returns the same 56-id keyset.

`SERVER_SIDE_PAGINATION_RECONCILIATION=PASS`
`UNPAGED_EQUIVALENCE=PASS`.

### TI-583 — exchange-side reversal chronology
For 川飛能源:
- 2026-07-31 `臺證上一字第1151803156號` = 停止申報生效;
- 2026-08-06 `臺證上一字第1151803255號` = 解除停止申報生效.

Each has an independent row id.
`STOP_THEN_RELEASE_PAIR_OBSERVED=PASS`.

### TI-584 — detail API
Frozen detail endpoint:
`https://wwwc.twse.com.tw/rwd/zh/announcement/announcement_detail?id=<token>&response=json`

Fields:
發文機關 / 發文日期 / 發文字號 / 主旨 / 依據 / 公告事項.

Both STOP and RELEASE details reproduce their list reference/subject.
Wrong parameter aliases ID/uuid/keyword return no data.

### TI-585 — source-local empty control
A frozen impossible keyword returns total=0 and dataCount=0.
`SOURCE_LOCAL_EMPTY_SEMANTICS_OBSERVED`.

### TI-586 — frozen acceptance
Workflow run `37175322616` physically passes the frozen executable contract:
`D03_TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT_V0_1`
`BOUNDED_MACHINE_CONTRACT_PHYSICAL_PASS`.

### TI-587 — maturity / authority boundary
The old state:
`EXCHANGE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT=PARTIAL_UNKNOWN`

is superseded on TWSE by:
`TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT=BOUNDED_PHYSICAL_PASS`.

Still false/unproven:
- globalArchiveCompletenessCertified;
- crossExchangeCoverageComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- technicalContinuityCertified.

Therefore:
`D03_10=L2_REMAINS`
`D03_09=L2_REMAINS`
`D03_MATURITY=56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE=NONE`.

Exact next:
1. characterize TPEx equivalent exchange-side machine source;
2. keep TWSE/TPEx source families separate;
3. next genuine trading session -> V8.17 C1 parent/cohort readback;
4. then symbol-window TECHNICAL_CONTINUITY for Bollinger;
5. ADX only after recursive replay certification.


## TI-588 through TI-593 — TPEx halt/resumption machine-contract discovery (2026-10-04)

Durable artifacts:
- `research/D03_TPEX_HALT_RESUMPTION_MACHINE_CONTRACT_V0_1.md`
- `research/d03_tpex_halt_resumption_machine_contract_v0_1.json`

### TI-588 — official exchange surface and query dimensions physically observed
The official TPEx page `https://www.tpex.org.tw/zh-tw/announce/market/halt/historical.html` physically exposes the historical halt/resumption surface.

Observed query controls:
- year input `date`, with public UI coverage 2020 through 2026 plus ALL;
- security category `cate`;
- category values 1 mainboard stock, 2 emerging stock, 6 strategic board, 3 warrant, 4 convertible/exchangeable bond, 5 TDR;
- HTML export and CSV download controls.

This is exchange-owned evidence for symbol-session trading halts/resumptions. It is not a complete corporate-action archive.

### TI-589 — front-end action is physically visible, resolved transport is not
The page's own executable initialization physically declares:
- `action="bulletin/sprcHis"`;
- `autoLoad=true`;
- `autoChange=false`;
- sortable table;
- page size 10.

However the runtime `API_PATTERN` value was not exposed by the observable page scope. Therefore only the action/argument surface is verified; the exact stable public endpoint is not yet frozen.

### TI-590 — candidate transport falsification
A read-only candidate request using the common TPEx `/www/zh-tw/` route shape and the physically observed action/arguments returned `HTTP 520` in this research environment. The public page also rendered no result rows during the same bounded observation.

This does not prove that the official dataset is absent. It disproves promotion from front-end discovery alone to a physical machine-payload PASS.

State:
`TPEX_OFFICIAL_HALT_SURFACE=OBSERVED`
`TPEX_FRONTEND_ACTION_AND_PARAMETERS=PHYSICALLY_OBSERVED`
`TPEX_MACHINE_RESPONSE_CONTRACT=PARTIAL_UNKNOWN`.

### TI-591 — missing acceptance controls remain UNKNOWN
Not yet physically certified:
- one bounded positive response with headers/schema/row count;
- stable row key and duplicate semantics;
- pagination or unpaged equivalence;
- CSV/API equivalence;
- source-local empty semantics;
- correction/cancellation/version chronology;
- detail-row contract;
- first-known publication latency;
- all-action-family coverage.

No zero rows, NO_EVENT state, or historical continuity may be inferred from the failed response.

### TI-592 — D03 implication and falsification boundary
This evidence narrows the next TPEx task from broad discovery to transport resolution and physical response capture. It can eventually support symbol-session TECHNICAL_CONTINUITY for halt/resumption, but cannot by itself certify capital-reduction price continuity, share replacement, par-value change, ex-right/ex-dividend, delisting or cross-exchange completeness.

TWSE and TPEx remain separate source families:
`TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT=BOUNDED_PHYSICAL_PASS`
`TPEX_HALT_RESUMPTION_MACHINE_CONTRACT=PARTIAL_UNKNOWN`.

### TI-593 — maturity and exact continuation
No maturity inflation:
`D03_10=L2_REMAINS`
`D03_09=L2_REMAINS`
`D03_MATURITY=56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE=NONE`.

Exact continuation:
1. resolve `API_PATTERN` from a successful official TPEx session or archive an official CSV artifact; do not guess endpoint stability from the route shape;
2. freeze one bounded year/category positive control with raw bytes, response headers, schema, row count, stable key and checksum;
3. reconcile HTML/CSV/API keysets and page-size-10 pagination behavior;
4. add a source-local empty control without converting transport failure into empty data;
5. preserve halt/resumption separately from capital-action cause/effective-date evidence;
6. on the next genuine Taiwan trading session, prioritize the already deployed V8.17 C1 immutable parent/cohort readback; never synthesize or backfill a generation;
7. after parent readback, re-audit Bollinger against exact 20-session symbol-window TECHNICAL_CONTINUITY; ADX still additionally requires canonical Wilder recursive replay.


## TI-594 through TI-605 — TPEx machine transport and price-reset source closure (2026-10-04)

Durable artifacts:
- `research/D03_TPEX_HALT_RESUMPTION_MACHINE_CONTRACT_V0_2.md`
- `research/d03_tpex_halt_resumption_machine_contract_v0_2.json`
- `research/D03_TPEX_PRICE_RESET_MACHINE_CONTRACT_V0_1.md`
- `research/d03_tpex_price_reset_machine_contract_v0_1.json`

### TI-594 — exact TPEx machine route recovered from official executable source
Official `main.js` physically freezes `API_PATTERN=/www/{LANG}/{ACTION}`. The halt page freezes `action=bulletin/sprcHis`, so the machine route is `/www/zh-tw/bulletin/sprcHis`.

The table loader uses POST + `response=json`. The page does not enable server paging; its visible page size 10 is client presentation.

### TI-595/TI-596 — halt/resumption bounded physical population and export equivalence
Workflow run `37182021741`, frozen 2026 / 上櫃股票:
- HTTP 200 / `stat=ok`;
- JSON 30 rows / `totalCount=30`;
- JSON SHA-256 `184c07e8cfd61f20a8cbf65ab49d2ab86ddac276da450eeed3938ec08c2ffe18`;
- CSV 30 data rows;
- CSV SHA-256 `e0c325a2968ef26ffbb75af495f17949c02ffaa0109ad89c3fd26684d701e76b`;
- unique keysets exactly equal, no duplicates.

The visible 10-row page size is not backend truncation for this bounded control.

### TI-597 — halt source-local zero semantics
Three frozen controls physically returned HTTP 200, `stat=ok`, row/total 0:
- 2026 category 5;
- 2026 category 6;
- 2020 category 5.

Transport/parser failure remains distinct from source-local empty.

### TI-598 — TPEx symbol-session source advances
For the bounded contract:
`TPEX_HALT_MACHINE = BOUNDED_PHYSICAL_PASS`.
It can support verified TPEx halt/resumption chronology and reject pseudo-bar substitution.
It does not alone certify corporate-action price continuity.

### TI-599 — TPEx price-reset machine routes discovered
Official pages freeze:
- ex-right/ex-dividend actual results: `bulletin/exDailyQ`;
- ex-right/ex-dividend announcement: `bulletin/prePost`;
- capital-reduction resumption/reference: `bulletin/revivt`.

Promotion-grade actual-result probes use `exDailyQ` and `revivt`.

### TI-600 — ex-right/ex-dividend actual-result source physically passes
Workflow run `37182282950`, 2026-07-01 through 2026-10-04:
- `exDailyQ` HTTP 200 / `stat=ok`;
- 587 rows / `totalCount=587`;
- JSON SHA-256 `7fe0627f0da66c146b6cd076b72aed8a841bd37e804461602d33f9c8c2768538`;
- CSV 587 data rows;
- JSON/CSV keyset exact equivalence.

Fields include prior close, ex-right/ex-dividend reference price, rights/dividend values, limit prices, trading-base price and allocation fields.

### TI-601 — capital-reduction actual-result source physically passes
Same run, 2026-01-01 through 2026-10-04:
- `revivt` HTTP 200 / `stat=ok`;
- 11 rows / `totalCount=11`;
- JSON SHA-256 `0b0f9aaa0d0e4c3e396078f0d4ce04964bb90d3e2059326734148d0b4ddaff4d`;
- CSV 11 data rows;
- JSON first 10 non-detail columns exactly match CSV keyset.

JSON detail physically includes suspension/resumption dates, replacement shares per 1,000 old shares, cash returned per share and applicable capital-increase fields.

### TI-602 — price-reset source-local empty semantics
On the bounded 2026-10-04 single-day control:
- `exDailyQ`: HTTP 200, `stat=ok`, 0;
- `revivt`: HTTP 200, `stat=ok`, 0.

No transport failure is normalized to NO_EVENT.

### TI-603 — prospective knowledge clock can use observed capture
The shared continuity archive already supports `PROSPECTIVE_OBSERVED`:
source `fetchedAt` becomes a conservative knowledge-time upper bound and is PIT-replay eligible only if captured no later than the parent cutoff.

Therefore unknown historical publication latency does not prevent future prospective evidence, but a post-parent capture may not backfill that parent.

### TI-604 — remaining blocker is no longer endpoint discovery
For TPEx, bounded official machine capability now exists for:
- halt/resumption;
- ex-right/ex-dividend actual price resets;
- capital-reduction resumption/reference price;
- MOPSOV correction/cancellation chronology from TI-555~563.

D03-10 still requires the first genuine post-V8.17 immutable parent/capture generation plus an exact parent-cutoff-safe continuity receipt and complete parent attempts.
D03-09 adds recursive replay/state lineage.

### TI-605 — anti-inflation maturity decision
The explicit TI-531 requirement remains first promotion-grade outcome-blind prospective parent evidence.

Sunday 2026-10-04 cannot create the first genuine post-deployment trading parent.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 remains **56.7%**.

No source-discovery percentage is awarded.

Next honest transitions:
- Bollinger L3 => D03 58.3%;
- then ADX L3 => D03 60.0%.

Current:
`TPEX_HALT_MACHINE = BOUNDED_PHYSICAL_PASS`
`TPEX_EX_DAILY_Q = BOUNDED_PHYSICAL_PASS`
`TPEX_REDUCTION_REFERENCE = BOUNDED_PHYSICAL_PASS`
`TPEX_JSON_CSV_EQUIVALENCE = PASS`
`TPEX_SOURCE_LOCAL_EMPTY = PASS`
`FIRST_GENUINE_V8_17_PARENT_READBACK = PENDING`
`RAW_D03_SOURCE_VERSION_GATE = 2_OF_3`
`OUTCOMES = CLOSED`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

Exact next continuation:
1. first genuine Taiwan trading session after V8.17 deployment: read back immutable parent/captureGeneration and expected keyset;
2. bind pre-parent or parent-cutoff-safe prospective official source captures to exact parent symbols/windows;
3. attempt every expected parent and preserve VALID/BLOCKED/UNKNOWN;
4. re-review Bollinger first for an exact 20 eligible-session certified continuity window;
5. ADX only after canonical Wilder recursive replay/trusted-state certification;
6. raw 3-session source gate remains separate and TI-005/TI-006 outcomes remain closed.


## TI-606 through TI-610 — Bollinger first-genuine-parent acceptance logic (2026-10-04)

Durable artifacts:
- `research/D03_BOLLINGER_FIRST_PARENT_ACCEPTANCE_V0_1.md`
- `research/d03_bollinger_l3_acceptance_v0_1.mjs`
- `tests/test_d03_bollinger_l3_acceptance_v0_1.mjs`
- read-only workflow `.github/workflows/research-d03-bollinger-acceptance-readonly.yml`.

Physical workflow run:
- `37182674404` = SUCCESS.

### TI-606 — exact shared parent identity, no D03-specific parent

The acceptance evaluator consumes the deployed shared Shadow parent identity:
- scanDate;
- captureGeneration;
- symbol;
- parentSnapshotHash;
- parent knownAt.

D03 does not create a second parent universe.

### TI-607 — finite-window input gate is executable and fail-closed

A Bollinger L3 attempt requires:
- continuity status VALID or VALID_BUT_CONSTRAINED;
- semantic space TECHNICAL_CONTINUITY;
- formulaVersion `BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1`;
- stdDefinition POPULATION;
- continuityReceiptId;
- receipt/capture time <= parent knownAt;
- exactly 20 expected eligible symbol sessions;
- exactly 20 bars with identical date set;
- no duplicate date;
- finite positive Close;
- each bar symbolSessionVerified=true;
- technicalContinuity=true;
- corporateActionContinuityResolved=true;
- bar sourceFetchedAt <= parent knownAt;
- zero unresolved missing sessions/events.

Any missing, late or mismatched evidence fails closed.

### TI-608 — constrained sessions remain visible

A continuity-valid exact window containing price-limit-constrained sessions may be:
`VALID_BUT_CONSTRAINED`.

It remains L3 data-feasibility eligible while ordinary unconstrained interpretation remains false.

Constraint evidence is preserved rather than dropped or silently treated as ordinary.

### TI-609 — complete parent attempt accounting

A run is COMPLETE only when every expected parent has exactly one persisted attempt.

Physical deterministic fixture proves:
- two expected / one attempt => INCOMPLETE;
- two expected / two attempts including one UNKNOWN => COMPLETE;
- missing, orphan or duplicate attempts invalidate completeness.

UNKNOWN/BLOCKED are explicit evidence states, not missing rows.

### TI-610 — acceptance logic passes, maturity stays parent-gated

Read-only run `37182674404` physically passes:
- clean exact 20-session window -> VALID;
- SMA20=109.5 in the frozen fixture;
- population SD20≈5.7662812973;
- capture after parent -> DATA_BLOCKED;
- missing bar -> DATA_BLOCKED;
- duplicate date -> DATA_BLOCKED;
- constrained bar -> VALID_BUT_CONSTRAINED;
- incomplete parent attempt set -> INCOMPLETE;
- full explicit attempt set including UNKNOWN -> COMPLETE.

This closes the acceptance-logic design gap.

It does NOT provide the first genuine post-V8.17 Taiwan parent generation.

Therefore:
- D03-10 Bollinger stays L2/40;
- D03 overall stays **56.7%**.

The first genuine parent remains the promotion trigger.

Current:
`BOLLINGER_L3_ACCEPTANCE_LOGIC = PHYSICAL_TEST_PASS`
`FIRST_GENUINE_V8_17_PARENT = PENDING`
`D03_10 = L2_REMAINS`
`D03_MATURITY = 56.7_PERCENT`
`OUTCOMES = CLOSED`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next continuation:
1. On the first genuine Taiwan session after V8.17, read back immutable parent/captureGeneration and the exact expected keyset.
2. Attach a parent-cutoff-safe TECHNICAL_CONTINUITY receipt to every expected parent.
3. Execute this acceptance evaluator for all expected parents and persist VALID/BLOCKED/UNKNOWN.
4. Only a COMPLETE run may support Bollinger L3 review.
5. If D03-10 reaches L3, D03 becomes 58.3%; ADX remains separate until canonical recursive replay passes.


## TI-611 through TI-630 — ADX / Bollinger first-parent acceptance hardening (2026-10-04)

Durable artifacts:
- `research/d03_adx_l3_acceptance_v0_1.mjs`
- `tests/test_d03_adx_l3_acceptance_v0_1.mjs`
- `research/D03_ADX_FIRST_PARENT_ACCEPTANCE_V0_1.md`
- `research/d03_adx_l3_acceptance_v0_2.mjs`
- `tests/test_d03_adx_l3_acceptance_v0_2.mjs`
- `research/D03_ADX_FIRST_PARENT_ACCEPTANCE_V0_2.md`
- `research/d03_bollinger_l3_acceptance_v0_2.mjs`
- `tests/test_d03_bollinger_l3_acceptance_v0_2.mjs`
- `research/D03_BOLLINGER_FIRST_PARENT_ACCEPTANCE_V0_2.md`

### TI-611~618 — ADX full-replay acceptance logic
The first ADX acceptance layer consumes the deployed shared parent identity and the already-frozen core formula. It requires FULL_REPLAY, exact continuity/session provenance, prefix invariance and complete expected-parent attempt accounting.

Read-only workflow run `37184682026` physically passed:
- clean full replay -> VALID;
- constrained path -> VALID_BUT_CONSTRAINED;
- too-short/local-bootstrap/trusted-prior-without-certifier/late capture/missing session/unresolved event/state-hash mismatch -> blocked;
- explicit UNKNOWN plus VALID can still form a COMPLETE expected-parent run.

### TI-619 — self-falsification of ADX v0.1
V0.1 was then rejected for promotion-grade use because a caller could self-declare FULL_REPLAY and supply merely nonempty lineage/hash strings.

This violates the prior D03 rule that self-issued assertions/hashes do not authenticate source lineage.

### TI-620~624 — ADX v0.2 canonical lineage hardening
V0.2 additionally requires:
- sourceFamilyVersion;
- 64-hex sourceHistoryHash;
- rawHistoryAdmissionReceiptId;
- symbolSessionContractVersion;
- sessionCalendarVersion;
- continuityEngineVersion;
- corporateActionRegistryVersion;
- 64-hex continuityTransformHash;
- receiptVersion;
- 64-hex stateLineageId;
- cleanHistoryStartDate;
- initializationAnchorDate;
- anchorCertificationState = CANONICAL_LINEAGE_ANCHOR_CERTIFIED;
- cleanHistoryStartDate == initializationAnchorDate for FULL_REPLAY;
- first replay bar == certified anchor;
- eligibleBarsFromAnchorToAsOf == delivered bars;
- per-bar observedRawBarIdentity + 64-hex sourceBarHash.

`TRUSTED_PRIOR_STATE` is intentionally not accepted by v0.2 until a separate certifier exists.

Read-only workflow run `37184852267` physically passed. It specifically proved:
- fake full-replay lineage -> DATA_BLOCKED;
- uncertified anchor -> DATA_BLOCKED;
- shifted/arbitrary anchor -> DATA_BLOCKED;
- trusted-prior path without certifier -> DATA_BLOCKED;
- valid canonical full replay remains VALID;
- complete expected-parent accounting still accepts explicit UNKNOWN attempts.

### TI-625 — Bollinger v0.1 source-lineage gap
The earlier Bollinger acceptance logic had the same class of weakness: it could consume a self-asserted `technicalContinuity=true` object without the complete upstream continuity identity.

V0.1 therefore remains useful formula/flow QA but is superseded for promotion-grade source/PIT acceptance.

### TI-626~630 — Bollinger v0.2 lineage hardening
V0.2 requires:
- sourceFamilyVersion;
- 64-hex sourceHistoryHash;
- rawHistoryAdmissionReceiptId;
- symbolSessionContractVersion;
- sessionCalendarVersion;
- continuityEngineVersion;
- corporateActionRegistryVersion;
- 64-hex continuityTransformHash;
- receiptVersion;
- cleanHistoryStartDate;
- exact 20 expected eligible symbol sessions;
- expectedEligibleSymbolSessionCount = 20;
- observedRawBars = 20;
- continuityBars = 20;
- zero unresolved missing sessions/events;
- zero delivered pseudo bars;
- each bar binds observedRawBarIdentity + 64-hex sourceBarHash.

The evaluator now calls the frozen core `computeBollingerBands` rather than reimplementing the formula.

Read-only workflow run `37184976280` physically passed:
- valid 20-session lineage -> VALID;
- constrained path -> VALID_BUT_CONSTRAINED;
- fake source-history hash -> DATA_BLOCKED;
- missing raw-history receipt -> DATA_BLOCKED;
- late continuity capture -> DATA_BLOCKED;
- 19-session window -> DATA_BLOCKED;
- unresolved relevant event -> DATA_BLOCKED;
- sample-SD semantics -> DATA_BLOCKED;
- explicit UNKNOWN still participates in COMPLETE parent reconciliation.

### Maturity decision
These tranches close acceptance-design/source-lineage loopholes but do not create the first genuine post-V8.17 Taiwan parent generation.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 aggregate remains **56.7%**.

This is deliberate anti-inflation.

### Current status
`ADX_L3_ACCEPTANCE_V0_2 = PHYSICAL_TEST_PASS`
`ADX_FULL_REPLAY_SELF_ATTESTATION = REJECTED`
`TRUSTED_PRIOR_STATE_CERTIFIER = NOT_IMPLEMENTED`
`BOLLINGER_L3_ACCEPTANCE_V0_2 = PHYSICAL_TEST_PASS`
`BOLLINGER_SELF_ATTESTED_CONTINUITY = REJECTED`
`FIRST_GENUINE_V8_17_PARENT = PENDING`
`RAW_SOURCE_VERSION_GATE = 2_OF_3`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

### Exact next continuation
1. Keep both v0.2 evaluators as the promotion-grade research acceptance contracts; do not use v0.1 to promote.
2. On the first genuine Taiwan session after V8.17, read exact shared parent generation/keyset and parent knownAt.
3. Bind only owner-issued, cutoff-safe continuity receipts carrying the complete upstream identity fields required by v0.2.
4. Execute Bollinger v0.2 for every expected parent first; only COMPLETE reconciliation may support D03-10 L3 -> D03 58.3%.
5. Execute ADX v0.2 only with canonical-anchor FULL_REPLAY for every expected parent; only COMPLETE reconciliation may support D03-09 L3 -> D03 60.0%.
6. Do not accept TRUSTED_PRIOR_STATE until a separate replay-equivalence certifier exists.
7. Raw 3-session gate remains independently 2/3; TI-005/TI-006 outcomes remain closed.


## TI-631 through TI-635 — immutable parent × continuity binding (2026-10-04)

Durable artifacts:
- `research/d03_parent_continuity_binding_v0_1.mjs`
- `tests/test_d03_parent_continuity_binding_v0_1.mjs`
- `research/D03_PARENT_CONTINUITY_BINDING_V0_1.md`

### TI-631 — source receipt and parent remain separate immutable facts
The continuity receipt remains a shared source fact and may be reused where semantically valid. The Shadow parent remains a decision-state fact. D03 does not duplicate the whole continuity payload into each parent.

Instead, promotion-grade evidence creates one immutable binding receipt between the exact parent identity and exact continuity receipt identity.

### TI-632 — binding identity prevents cross-generation substitution
Binding identity includes:
- scanDate;
- captureGeneration;
- symbol;
- parentSnapshotHash;
- parent knownAt;
- continuityReceiptId/version;
- continuity asOf/capturedAt;
- sourceHistoryHash;
- continuityTransformHash;
- expected eligible date-set hash;
- actual continuity-bar date-set hash;
- sourceBarsThrough.

The complete payload hashes to bindingId. A different captureGeneration or parentSnapshotHash therefore produces a different binding identity even for the same symbol and continuity payload.

### TI-633 — temporal/population invariants
Binding is VALID only when:
- continuity symbol == parent symbol;
- continuity asOf == parent scanDate;
- continuity capturedAt <= parent knownAt;
- expected eligible session dates == delivered continuity-bar dates;
- sourceBarsThrough == final delivered bar date;
- final delivered bar date <= parent scanDate.

Wrong date, late receipt, date-set mismatch and future-bar contamination fail closed.

### TI-634 — bound promotion-grade wrappers
Promotion-grade research calls now use:
- `evaluateBoundBollingerL3V0_1`;
- `evaluateBoundAdxL3V0_1`.

The binding is validated before the hardened v0.2 indicator evaluator executes.

A numerically/source-valid indicator calculation attached to the wrong immutable parent is not L3 evidence.

### TI-635 — physical deterministic acceptance
Read-only workflow run `37185221432` PASS:
- cross-generation binding identity changes;
- wrong asOf -> DATA_BLOCKED;
- late continuity capture -> DATA_BLOCKED;
- expected/delivered date-set mismatch -> DATA_BLOCKED;
- future bar -> DATA_BLOCKED;
- correctly bound Bollinger v0.2 -> VALID;
- correctly bound ADX v0.2 -> VALID.

This closes the parent-receipt join-identity design gap only.

No genuine post-V8.17 Taiwan parent was created on Sunday, so D03 remains 56.7%.

Current:
`PARENT_CONTINUITY_BINDING_V0_1 = PHYSICAL_TEST_PASS`
`CROSS_GENERATION_RECEIPT_SUBSTITUTION = BLOCKED_BY_IDENTITY`
`FIRST_GENUINE_V8_17_PARENT = PENDING`
`D03_10 = L2_REMAINS`
`D03_09 = L2_REMAINS`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
1. Audit the real clock envelope for the first genuine parent: continuity source capture must be known/captured no later than parent knownAt.
2. Do not assume parent availability alone makes a continuity receipt cutoff-safe.
3. Freeze any missing pre-parent capture/scheduling requirement outcome-blind.
4. On the first genuine parent, persist bindingId with every Bollinger/ADX attempt and require complete expected-parent reconciliation.


## TI-636 through TI-643 — pre-parent continuity clock audit (2026-10-04)

Durable artifacts:
- `research/d03_pre_parent_continuity_clock_v0_1.mjs`
- `tests/test_d03_pre_parent_continuity_clock_v0_1.mjs`
- `research/D03_PRE_PARENT_CONTINUITY_CLOCK_AUDIT_V0_1.md`

### TI-636 — parent existence is not cutoff-safe continuity readiness
The deployed V8.17 immutable parent is generated by the normal 18:10 Taipei after-market scan. C1 decisionAt is actual runtime time, not an invented fixed timestamp.

A Technical child needs source/continuity evidence that was legitimately known no later than that parent decisionAt.

Therefore:
`FIRST_GENUINE_PARENT_EXISTS != CUTOFF_SAFE_CONTINUITY_RECEIPT_EXISTS`.

### TI-637 — current 16:30 scheduled history warmup is raw-only
The existing scheduled recent A1 hot-history warmup runs at 16:30 Taipei but explicitly freezes:
- historyCoverageOnly=true;
- continuityStateForNewRows=UNVERIFIED;
- continuityPromotionPerformed=false.

It cannot satisfy Technical continuity.

### TI-638 — current 18:35 diagnostic is after the parent
The existing System2 daily diagnostic at 18:35 Taipei is after the normal 18:10 System1 parent.

Newly captured source/revision evidence at 18:35 cannot be relabeled as known at 18:10.

### TI-639 — existing continuity capability workflows are not automatic pre-parent observers
Repository scan found the active continuity/MOPS/source-capability workflows are manual dispatch and/or path-push triggered. No recurring promotion-grade pre-18:10 continuity capture is currently observed.

### TI-640 — pre-parent clock acceptance
A future promotion-grade capture requires:
- same marketDate as parent scanDate;
- capturedAt <= parent knownAt;
- continuityState=CERTIFIED;
- exactVersionObserved=true;
- firstObservedAtCertified=true;
- noRevisionGapThroughParent=true;
- symbolSessionCoverageComplete=true.

### TI-641/TI-642 — shared-owner handoff
Current state:
`PRE_PARENT_CERTIFIED_CONTINUITY_CAPTURE_NOT_PRESENT`.

D03 must not fork a local corporate-action observer or silently add Formal provider calls.

The shared continuity owner must supply an immutable prospective source/version mechanism whose causal availability is established no later than the parent cutoff, or another owner-certified mechanism proving exact availability at that cutoff.

### TI-643 — physical falsification and maturity
Read-only workflow run `37185635335` PASS:
- valid source 60 seconds before parent -> VALID;
- raw-but-uncertified 16:30 history -> DATA_BLOCKED;
- 18:35 capture -> DATA_BLOCKED / SOURCE_CAPTURE_AFTER_PARENT;
- historical source clock without certified first-observed clock -> DATA_BLOCKED.

Current runtime envelope itself is therefore a real blocker.

D03 remains **56.7%**.

`BOLLINGER_FIRST_PARENT_PROMOTION_READY = FALSE`  
`ADX_FIRST_PARENT_PROMOTION_READY = FALSE`  
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
1. Investigate whether official sourceReportedAt semantics can be certified as a public disclosure clock without fabricating exact availability.
2. If not, shared owner needs prospective pre-parent version observation.
3. First genuine parent alone does not promote D03-09/10.


## TI-644 through TI-650 — official MOPS clock semantic corroboration (2026-10-04)

Durable artifacts:
- `research/d03_mops_source_clock_semantics_v0_1.mjs`
- `tests/test_d03_mops_source_clock_semantics_v0_1.mjs`
- `research/D03_MOPS_SOURCE_CLOCK_SEMANTIC_AUDIT_V0_1.md`

This tranche independently corroborates the already-frozen D03 MOPS version-clock contract and the System2 source-clock work; it does not replace or weaken them.

### TI-644 — official disclosure semantics are strong
Official TWSE material establishes that MOPS is the public disclosure platform designed for information symmetry/timeliness, its front page exposes real-time material information with spokesperson date/time columns, and listed companies must input material information into the designated internet reporting system under defined deadlines.

This strongly supports `sourceReportedAt` as an issuer disclosure/reporting-clock field rather than an arbitrary scraper timestamp.

### TI-645 — exact public availability still not proven by the field alone
Official material does not provide a frozen zero-latency or bounded-latency guarantee from issuer input/spokesperson time to public retrievability.

Therefore:
`SOURCE_REPORTED_AT != CERTIFIED_EXACT_PUBLIC_AVAILABLE_AT`.

This remains aligned with the existing System2 physical clock certification:
source-reported clock semantics are certified, but public-availability latency and exact knownAt remain uncertified.

### TI-646 — asymmetric safe use
If sourceReportedAt > parentKnownAt:
the version is safely excluded from that parent.

If sourceReportedAt <= parentKnownAt:
historical sourceReportedAt alone still cannot prove PIT availability.

Thus historical use is an asymmetric exclusion rule, not a positive availability rule.

### TI-647 — prospective exact-version observation remains the safe positive path
A certified prospective exact-version observation with firstObservedAt <= parentKnownAt can safely establish that exact version was publicly observable by the parent cutoff.

This does not require pretending sourceReportedAt == firstObservedAt.

### TI-648 — active-push service is contextual, not historical latency proof
TWSE provides a MOPS proactive data-delivery service for users needing timely information delivery. This supports MOPS as an actively distributed disclosure product but does not backfill exact free-web historical availability.

### TI-649 — physical semantic classifier test
Read-only workflow run `37185849126` PASS:
- sourceReportedAt after parent -> EXCLUDED;
- sourceReportedAt before parent without prospective observation -> HISTORICAL_REPORTED_CLOCK_ONLY;
- certified prospective firstObservedAt before parent -> VALID_OBSERVED_BY_PARENT;
- firstObservedAt after parent -> OBSERVED_AFTER_PARENT.

### TI-650 — maturity
No maturity promotion.

Existing owner work already has:
- certified source-reported clock semantics;
- implemented prospective availability observation adapter;
- prospectiveObservationCount=0;
- no automatic high-frequency schedule.

D03 consumes that owner result rather than creating a duplicate observer.

Current:
`MOPS_SOURCE_REPORTED_CLOCK_SEMANTICS = CERTIFIED_BY_OWNER / OFFICIAL_CORROBORATION`
`HISTORICAL_REPORTED_CLOCK_AS_EXACT_AVAILABLE_AT = REJECTED`
`PROSPECTIVE_FIRST_OBSERVED_PATH = IMPLEMENTED_BUT_ZERO_SAMPLES`
`PRE_PARENT_CERTIFIED_CONTINUITY_CAPTURE = ABSENT`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
the shared source owner must freeze/execute genuine prospective sampling and produce exact-version observations that are causal relative to the System1 parent cutoff. D03 does not duplicate that source observer.


## TI-651 through TI-660 — pre-parent source-cut acceptance / capacity audit (2026-10-04)

Durable artifacts:
- `research/D03_PRE_PARENT_CONTINUITY_SOURCE_CUT_HANDOFF_V0_1.md`
- `research/d03_pre_parent_source_cut_v0_1.mjs`
- `tests/test_d03_pre_parent_source_cut_v0_1.mjs`
- `research/d03_pre_parent_continuity_capacity_probe_v0_1.mjs`
- read-only workflows `.github/workflows/research-d03-pre-parent-source-cut-readonly.yml` and `.github/workflows/research-d03-pre-parent-continuity-capacity-readonly.yml`.

### TI-651 — first-observed availability is sufficient for parent cutoff causality

The shared MOPSOV owner adapter separates:
- firstObservedAt / firstObservedAvailableAt;
- precisionEligible (prior NOT_OBSERVED <=5 minutes);
- publication-latency certification.

For D03 parent causality, an exact version that was prospectively first-observed no later than parent knownAt can establish conservative availability-by-cutoff even when precisionEligible=false.

The <=5-minute prior-NOT_OBSERVED window is a latency-estimation precision requirement, not an intrinsic Bollinger/ADX parent-eligibility requirement.

No polling schedule is authorized by this conclusion.

### TI-652 — selected-only pre-parent source querying is rejected

The immutable C1 parent population is created by the normal scan. Waiting for selected/parent symbols before querying source versions would necessarily make the source capture post-parent.

Promotion-grade pre-parent evidence must therefore be market-wide/exchange-wide or full eligible-universe scoped before the parent.

Selected-only pre-parent source capture is structurally invalid.

### TI-653 — market-wide source base already exists

Existing shared-source work already exposes:
- six range-verified TWSE/TPEx actual corporate-action result lanes;
- TWSE daily material-information OpenAPI;
- TPEx daily material-information OpenAPI;
- direct official MOPSOV historical/version transport.

The daily disclosure feeds are prospective snapshots, not historical version-complete archives, and therefore require immutable capture/version semantics before promotion use.

### TI-654 — physical source-cardinality audit

Read-only workflow run `37190871367` PASS on 2026-08-15..2026-10-02.

Across the six official actual-result lanes:
- total event rows = 294;
- unique event keys = 294;
- event-bearing dates = 31;
- mean events per event-bearing date ≈9.48;
- maximum events / unique symbols on one effective date = 33.

Lane counts:
- TWSE ex-right/dividend =149;
- TWSE capital reduction =7;
- TWSE par-value change =1;
- TPEx ex-right/dividend =129;
- TPEx capital reduction =7;
- TPEx par-value change =1.

This supports event-driven owner engineering as materially smaller than full-market per-symbol revision polling. It does not certify a production request budget, completeness or knownAt.

### TI-655/TI-656 — frozen parent source-cut acceptance

A future shared-owner source cut is parent-eligible only when:
- scanDate equals the parent scanDate;
- scope is market-wide/full eligible universe;
- all required market-wide lanes are READY with payload hashes;
- range lanes verify their requested range;
- parser completeness is true;
- source cut completes no later than actual parent knownAt;
- required MOPS exact-version expected/observed keysets reconcile exactly;
- each required MOPS version is PROSPECTIVE_POLL and firstObservedAt <= parent knownAt;
- no query/budget truncation;
- no UNKNOWN required lane;
- owner certifies noRevisionGapThroughCut.

Deterministic workflow run `37191199051` PASS:
- valid pre-parent source cut -> VALID_SOURCE_CUT_FOR_PARENT;
- precisionEligible=0 does not block availability-by-cutoff;
- late cut -> blocked;
- selected-only -> blocked;
- late MOPS version -> blocked;
- retrospective readback -> blocked;
- incomplete version keyset -> blocked;
- truncated query -> blocked.

### TI-657 — current receipt clock is not silently weakened

Bollinger/ADX v0.2 currently requires an owner continuity receipt captured no later than parent knownAt.

This tranche does not reinterpret or weaken that field.

If the shared owner later wants to compute a transform after the parent using only an immutable pre-parent evidence cut, that requires a separately versioned evidenceCutoffAt/receiptCreatedAt owner contract and a new D03 review.

### TI-658 — noRevisionGapThroughCut remains the hard unsolved claim

A source snapshot proves observed state, not absence of omitted versions.

Owner certification still needs complete source-population semantics, append-only exact version identity, prospective observation and reconciliation of any later-discovered pre-parent version.

D03 does not self-certify this field.

### TI-659 — two owner architectures remain possible

Research-compatible candidates:
1. pre-parent market-wide source cut, where actual observedAt controls eligibility and a late run fails closed;
2. versioned evidence-cutoff / receipt-created split, where later transform computation consumes only immutable pre-parent facts.

D03 does not deploy or choose either shared-owner architecture.

### TI-660 — maturity decision

No maturity promotion.

The source-cut requirement is now substantially narrower and executable, but no genuine cutoff-safe owner receipt has been produced.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 aggregate remains **56.7%**.

Next honest transitions remain:
- Bollinger L3 -> D03 58.3%;
- ADX L3 after canonical FULL_REPLAY -> D03 60.0%.

Current:
`PRE_PARENT_SOURCE_CUT_POLICY = PHYSICAL_TEST_PASS`
`EVENT_DRIVEN_SOURCE_CARDINALITY = PHYSICAL_MEASURED`
`HIGH_FREQUENCY_POLLING_INTRINSICALLY_REQUIRED = FALSE`
`SELECTED_ONLY_PRE_PARENT_SOURCE_CAPTURE = REJECTED`
`NO_REVISION_GAP_THROUGH_CUT = OWNER_CERTIFICATION_PENDING`
`D03_10 = L2_REMAINS`
`D03_09 = L2_REMAINS`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
1. shared continuity owner implements/executes one versioned pre-parent architecture;
2. produce a genuine cutoff-safe market-wide/full-universe source cut and exact prospective MOPS version observations;
3. certify noRevisionGapThroughCut and symbol-session completeness under owner rules;
4. bind owner continuity receipts to the first genuine V8.17 parent keyset;
5. execute Bollinger v0.2 for every expected parent and require COMPLETE reconciliation before any 58.3% promotion;
6. ADX follows only with canonical FULL_REPLAY;
7. raw D03 3-session gate remains 2/3 and TI-005/TI-006 outcomes remain closed.


## TI-661 through TI-685 — cutoff-safe continuity architecture / effective-build clock audit (2026-10-04)

Durable artifacts:
- `research/D03_EVIDENCE_CUTOFF_RECEIPT_SPLIT_V0_1.md`
- `research/d03_evidence_cutoff_receipt_split_v0_1.mjs`
- `research/d03_evidence_cutoff_receipt_split_contract_v0_1.json`
- `research/D03_TWO_POINT_NO_REVISION_GAP_V0_1.md`
- `research/d03_two_point_no_revision_gap_v0_1.mjs`
- `research/D03_PRE_PARENT_SOURCE_CUT_V0_2.md`
- `research/d03_pre_parent_source_cut_v0_2.mjs`
- `research/D03_PARENT_CONTINUITY_BINDING_V0_2.md`
- `research/d03_parent_continuity_binding_v0_2.mjs`
- `research/D03_EFFECTIVE_WORKER_DECISION_CUTOFF_AUDIT_V0_1.md`
- `research/D03_PARENT_DECISION_CUTOFF_OWNER_HANDOFF_V0_2.md`

### TI-661/TI-666 — source availability clock is separable from transform-computation clock

The previously open architecture from TI-659 is now physically falsified as a versioned research candidate.

A continuity transform may be materialized after the immutable parent only if:
- every admitted source fact was frozen in an immutable market-wide/full-eligible evidence cut before the true Formal input cutoff;
- the derived receipt references the exact evidenceCutId and market-wide cut manifest;
- postCutSourceFactCount = 0;
- unboundSourceFactCount = 0;
- every delivered raw bar has sourceFetchedAt <= evidenceCutoffAt.

The market-wide source-cut manifest hash and the symbol-specific transform-input manifest hash are different provenance layers and must not be forced equal. The receipt instead carries an exact cut-manifest reference plus its own symbol-transform manifest and source-fact-reference set hash.

Physical workflow `37195966922` PASS under the stricter decision-cutoff semantics.

The candidate retains all existing Bollinger v0.2 and ADX v0.2 formula/source/replay guards.

No maturity promotion.

### TI-667/TI-673 — two-point noRevisionGapThroughCut candidate

A fail-closed two-point owner-certifier candidate is now executable.

Pre-cut population establishes the exact versions prospectively observed by the cutoff.

Post-parent bounded complete reconciliation asks whether:
- any pre-cut version disappeared;
- any same versionKey changed payload;
- any newly discovered row has sourceReportedAt <= the original cutoff.

A genuinely later revision with sourceReportedAt > cutoff is allowed and recorded as later information; it does not invalidate the earlier cut.

Blocking witnesses:
- LATE_DISCOVERED_PRE_CUT_VERSION;
- VERSION_PAYLOAD_MUTATION;
- PRE_VERSION_MISSING_FROM_POST;
- incomplete/truncated post population;
- pre version firstObservedAt after cutoff.

Physical workflow `37195789302` PASS.

Authority remains:
- ownerCertificationRequired = true;
- d03SelfCertificationAuthority = false.

D03 does not self-certify source completeness.

### TI-674/TI-676 — parent receipt stamp cannot substitute for Formal input cutoff

The newer source-cut work initially used parent knownAt as the upper bound. This is superseded for promotion-grade causality.

Required ordering is now:

`source fact <= evidenceCutoffAt <= decisionCutoffAt <= decisionAt/parentKnownAt`.

A later decisionAt/capturedAt receipt may not be substituted for decisionCutoffAt.

Pre-parent source-cut V0.2 reuses all V0.1 market-wide scope, exact-version, completeness, no-truncation and no-revision-gap rules under the stricter decisionCutoffAt clock.

Physical workflow `37195982487` PASS:
- valid strict cutoff -> PASS;
- missing decisionCutoffAt -> blocked;
- source fact visible after cutoff but before later receipt stamp -> blocked;
- cutoff after decisionAt -> blocked.

No maturity promotion.

### TI-677/TI-681 — parent × evidence-cut × derived continuity binding V0.2

A post-parent derived continuity receipt can bind to a parent only after the strict cutoff timing envelope passes.

Binding identity now commits to:
- scanDate / captureGeneration / symbol / parentSnapshotHash;
- decisionCutoffAt / decisionAt / parent knownAt;
- evidenceCutId / evidenceCutoffAt / source-cut manifest;
- timing identity;
- continuity receipt id/version/createdAt;
- transform-input manifest;
- source-fact-reference set;
- sourceHistoryHash / continuityTransformHash;
- exact expected and actual eligible-date-set hashes;
- sourceBarsThrough.

Changing parent generation changes bindingId.

The binding still delegates indicator validity to the hardened v0.2 Bollinger/ADX evaluators.

Physical workflow `37196089575` PASS:
- valid post-parent-derived Bollinger -> VALID;
- valid canonical FULL_REPLAY ADX -> VALID;
- missing cutoff / late cut / wrong symbol / date-set mismatch / binding-before-receipt -> blocked.

No maturity promotion because these remain synthetic/outcome-blind contract witnesses.

### TI-682 — raw-source boundary assumption was falsified by the effective build

A first effective-build audit intentionally failed the earlier recommendation "after totalCapital read".

Reason:
the V7.5.30 patch chain performs an additional Formal-affecting asynchronous input read after total capital:

`V7_MARKET_CONSENSUS` from STOCKS_KV.

Market consensus is consumed by `applyMarketConsensus` and can affect candidate priority/ranking.

Therefore stamping decisionCutoffAt before this read would exclude a true Formal input and is causally wrong.

The failure is retained as useful falsification, not hidden.

### TI-683/TI-684 — effective V8.17 final Formal input boundary is physically source-audited

The corrected read-only audit builds the effective Worker through the same patch/review chain used by the current V8.17 architecture.

Physical workflow `37196768178` PASS after the C1/C2 review reports 95/95 tests PASS.

Observed effective build:
- runtime source version = `8.17.0-shadow-cohort-membership`;
- final Formal async input = STOCKS_KV `V7_MARKET_CONSENSUS` read;
- market-consensus read occurs after total-capital input;
- async/external reads after that final input and before selector = 0;
- `selectTomorrowCandidates` is synchronous;
- selector external reads observed = false;
- C1 decisionAt exists;
- C1 decisionCutoffAt does not exist;
- C1 build is downstream of Formal-result capture;
- Production mutation performed = false.

The current effective-build candidate cutoff anchor is therefore:

> immediately after the V7_MARKET_CONSENSUS read and immediately before selectTomorrowCandidates(...).

Any newer runtime must be re-audited; this is not a forever-static line-number rule.

### TI-685 — owner handoff V0.2 / anti-inflation decision

The corrected source-audited boundary is now handed to the shared immutable-C1 parent owner in:
- `research/D03_PARENT_DECISION_CUTOFF_OWNER_HANDOFF_V0_2.md`;
- `research/d03_parent_decision_cutoff_owner_handoff_v0_2.json`.

Owner implementation must be additive provenance only:
- persist real decisionCutoffAt under exact immutable generation identity;
- no historical backfill;
- no copy of decisionAt/capturedAt;
- no new market-data call merely to stamp time;
- no selection/ranking/capital/signal/push change;
- physical genuine-session readback required after owner deployment.

D03 does not implement/deploy this Production provenance change from the research lane.

### Current maturity / next honest gates

No maturity promotion:
- D03-10 Bollinger = L2/40;
- D03-09 ADX = L2/40;
- D03 aggregate = **56.7%**.

The next genuine Bollinger L3 gate now requires all of:
1. owner-persisted decisionCutoffAt on a genuine parent;
2. market-wide evidence cut <= decisionCutoffAt;
3. owner-certified noRevisionGapThroughCut and symbol-session completeness;
4. derived receipt uses only pre-cut facts;
5. V0.2 parent/evidence-cut binding;
6. complete expected-parent attempt reconciliation;
7. Bollinger v0.2 finite-window acceptance.

Only then may D03-10 advance L3 and D03 reach 58.3%.

ADX remains one gate harder:
all of the above + canonical-anchor FULL_REPLAY / exact recursive lineage before any 60.0% transition.

Raw D03 source-version gate remains independently 2/3.
TI-005/TI-006 outcomes remain CLOSED.
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`.
Formal Core remains LOCKED.


## TI-686 through TI-692 — minimal decision-cutoff implementation surface audit (2026-10-04)

Durable artifacts:
- `research/D03_DECISION_CUTOFF_MINIMAL_IMPLEMENTATION_AUDIT_V0_1.md`
- `research/d03_decision_cutoff_minimal_implementation_audit_v0_1.json`

### TI-686 — dedicated D1 column is not semantically required
Current C1 persistence writes the entire receipt header to `trade_research_c1_generations.header_json` and current readback reparses that header. Therefore an additive `decisionCutoffAt` field can be persisted/read back through the existing immutable header path without a required D1 schema migration.

### TI-687 — existing immutable-header conflict guard protects cutoff
Same-generation writes already conflict when incoming `header_json` differs. Once cutoff is part of the header, a changed cutoff for the same generation is naturally rejected. Historical backfill remains forbidden.

### TI-688 — cutoff remains a C1 parent fact
Shadow memberships already bind to exact `captureGeneration` and parent hashes. D03 can resolve cutoff from the immutable C1 header through that generation. Duplicating cutoff into every membership row is unnecessary and would create a second timestamp authority.

### TI-689 — minimum owner patch surface
Minimum semantically complete patch:
1. stamp real cutoff after final `V7_MARKET_CONSENSUS` read and before selector;
2. pass the exact value into selector and C1 builder;
3. validate same-session and `decisionCutoffAt <= decisionAt`;
4. include cutoff in C1 receipt/header;
5. persist/read back via existing `header_json`;
6. no new provider call and no Formal behavior change.

### TI-690 — cutoff and receipt clock remain distinct
`decisionCutoffAt` is the Formal-input freeze boundary. `decisionAt` is the later C1 receipt-materialization clock. The owner may not copy one into the other or infer historical cutoff from schedule/capture time.

### TI-691 — pre-deploy acceptance requirements
Owner implementation must prove:
- exact cutoff location after final Formal external input;
- zero later external/async Formal input before selector;
- selector remains synchronous;
- exact cutoff propagation into C1;
- immutable header readback;
- same-generation changed cutoff conflicts;
- Formal selection/ranking/quota/capital/signal/push parity;
- legacy generations remain readable but cutoff-ineligible, with no backfill.

### TI-692 — shadow cohort schema need not change for D03
D03 can use the exact C1 generation as cutoff owner. The existing shadow cohort semantic fingerprint need not include cutoff merely to satisfy D03. Adding cutoff to the cohort parent itself would be a separate schema/version decision and is not required by this lane.

### Maturity
No maturity promotion:
- D03-10 remains L2/40;
- D03-09 remains L2/40;
- D03 remains 56.7%.

This tranche materially reduces implementation scope/risk but creates no genuine cutoff-bearing parent.

Current:
`DECISION_CUTOFF_MINIMAL_PERSISTENCE_PATH = HEADER_JSON_NO_D1_MIGRATION_REQUIRED`
`DECISION_CUTOFF_DUPLICATE_MEMBERSHIP_FIELD = NOT_REQUIRED`
`DECISION_CUTOFF_RUNTIME_IMPLEMENTATION = OWNER_PENDING`
`HISTORICAL_BACKFILL = FORBIDDEN`
`D03_MATURITY = 56.7_PERCENT`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Exact next:
shared System1 parent owner implements/version-controls the additive provenance patch under Production governance; re-audit effective runtime boundary; first genuine trading session after deploy must produce one cutoff-bearing immutable C1 generation; continuity owner then binds a cutoff-safe evidence cut; D03 executes Bollinger v0.2 across the complete expected parent population before any 58.3% promotion. ADX remains behind canonical FULL_REPLAY.


## TI-693 through TI-700 — V8.18 decision-cutoff provenance engineering gate (2026-10-05)

Durable engineering evidence:
- draft PR `#600`;
- exact CI head `f030f04c1a807a23fe19072b96407f1436d09da8`;
- candidate runtime label `8.18.0-decision-cutoff-provenance`;
- branch checkpoint `research/SYSTEM1_DECISION_CUTOFF_PROVENANCE_IMPLEMENTATION_20261005.md`.

### TI-693 — additive provenance implementation exists on a non-Production branch

The owner-handoff ambiguity from TI-686~692 has been reduced to executable code.

The V8.18 candidate:
1. stamps `decisionCutoffAt` immediately after the audited final Formal-affecting `V7_MARKET_CONSENSUS` KV read;
2. passes the exact timestamp into the synchronous Formal selector as research provenance only;
3. passes it into `buildC1PopulationReceipt`;
4. validates finite ordering against the later `decisionAt`;
5. persists it in the existing immutable C1 `header_json`;
6. exposes it automatically through existing C1 generation readback;
7. adds no provider call and no D1 schema column;
8. never backfills historical generations.

The candidate does not alter the Formal scoring/ranking/quota/capital/signal/push/order definitions.

### TI-694 — exact runtime placement is mechanically frozen

Dedicated V8.18 fixture verifies:

`V7_MARKET_CONSENSUS read -> decisionCutoffAt stamp -> selectTomorrowCandidates`.

Between the cutoff stamp and selector call:
- no `await`;
- no `fetch`;
- no `STOCKS_KV.get`;
- no `V7_DB` read.

The selector remains synchronous and external-read-free.

Result:
`DECISION_CUTOFF_PLACEMENT = POST_V7_MARKET_CONSENSUS_PRE_SELECTOR`.

### TI-695 — existing immutable header is sufficient

A dedicated D1 scalar column is still not required.

The candidate writes cutoff provenance into the existing C1 immutable header and reads it back through the existing protected generation reader.

Fixture:
`headerRoundTrip=true`.

Therefore:
`DECISION_CUTOFF_PERSISTENCE = EXISTING_HEADER_JSON_PATH`.

### TI-696 — same-generation cutoff mutation is physically rejected

The dedicated fixture persists one C1 generation, then attempts the same generation identity with a changed cutoff.

Observed:
`sameGenerationCutoffMutation=CONFLICT`.

The existing V8.15.1 immutable-header guard raises:
`C1_IMMUTABLE_GENERATION_CONFLICT`.

Therefore the cutoff inherits the existing generation immutability contract without a second persistence mechanism.

### TI-697 — V8 Repair CI passes

PR #600 exact head:
`f030f04c1a807a23fe19072b96407f1436d09da8`.

V8 Repair CI:
- run `37237843589`;
- conclusion: SUCCESS.

The candidate build chain applies V8.18 after V8.17 and the expected effective version is present.

### TI-698 — isolated C1/C2 repair review passes 100/100

System1 C1 C2 isolated offline repair review:
- run `37237843572`;
- conclusion: SUCCESS;
- tests: 100 / 100 PASS.

Observed V8.18 changed functions relative to V8.17:
- `runAfterMarketScanCore`;
- `buildC1PopulationReceipt`;
- `selectTomorrowCandidates`.

Frozen review fields:
- `selectorUnchangedExceptCaptureFirewall=true`;
- `runAfterMarketScanCoreUnchangedExceptCutoffStamp=true`;
- `decisionCutoffProvenanceOnly=true`;
- `formalCoreImpact=false`.

Protected function count reported by the isolated review: 451.

### TI-699 — full regression passes

V8 Regression Tests:
- run `37237843517`;
- conclusion: SUCCESS.

The dedicated V8.18 fixture executes inside the full regression chain and reports:
- `status=PASS`;
- `version=8.18.0-decision-cutoff-provenance`;
- `decisionCutoffPlacement=POST_V7_MARKET_CONSENSUS_PRE_SELECTOR`;
- `headerRoundTrip=true`;
- `sameGenerationCutoffMutation=CONFLICT`;
- `historicalBackfill=false`;
- `formalCoreImpact=false`.

No Cloudflare Production deployment was triggered by the draft PR.

### TI-700 — maturity and authority decision

This tranche is engineering evidence, not a genuine Taiwan trading-session parent receipt.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 aggregate remains **56.7%**;
- raw D03 source-version gate remains 2/3;
- TI-005/TI-006 outcomes remain CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

PR #600 remains:
- OPEN;
- DRAFT;
- MERGEABLE;
- NOT MERGED.

The next action crosses the protected Production boundary:
owner approval is required before merge/deploy of the concrete PR.

After an approved deploy, maturity still does not rise immediately.
The next genuine Taiwan trading session must produce:
1. a cutoff-bearing immutable C1 generation;
2. exact protected readback;
3. cutoff-safe owner continuity receipt/evidence cut;
4. complete expected-parent Bollinger v0.2 reconciliation.

Only then may D03-10 be considered for L3 and D03 58.3%.
ADX remains second and additionally requires canonical FULL_REPLAY.


## TI-701 through TI-708 — D03 indicator lineage / parameter-family anti-double-count contract (2026-10-05)

Canonical artifacts:
- `research/D03_INDICATOR_LINEAGE_AND_PARAMETER_FAMILY_CONTRACT_20261005_V0_1.md`;
- `research/d03_indicator_lineage_registry_20261005_v0_1.json`;
- `research/test_d03_indicator_lineage_registry_v0_1.mjs`.

### TI-701 — same root and different formulas
All active D03 modules are primarily descendants of `PRICE_OHLC`. Different formulas may support residual candidates but do not prove independence. Correlation below one, module ownership and formula names are insufficient.

### TI-702 — representation families frozen
The 12 active canonical modules are assigned to explicit representation/redundancy groups. Historical D03-11 ROC remains retired into D03-02 because same-horizon percentage ROC is exactly `100 * retN`; capability coverage remains, but no duplicate vote returns.

### TI-703 — parameter-family ledger frozen before outcomes
Return horizons remain 5/20/60 eligible sessions; existing canonical SMA/EMA/MACD/KD/RSI/ADX/Bollinger/divergence/multi-timeframe formula contracts remain authoritative. Any window, smoother, warm-up, seed, field or threshold change creates a new factorVersion inside the same parameterFamilyId and consumes one experiment-family budget.

### TI-704 — residual incrementality gate
Independent-vote status requires same-horizon aliases, direct price/trend, D01/D02 price-only, D04 volatility and D18 Regime controls where applicable; PIT, common support, purged OOS/prospective Shadow, walk-forward, date dependence, multiple testing, cost/fillability and D16/00 readback remain mandatory.

### TI-705 — support, falsifiers and failure states
Within-family grouping is supported by deterministic ancestry and exact aliases. Counterhypothesis remains open where path/range/dispersion may add residual information. Choppy markets, limits, suspension, corporate actions, tick discreteness, volatility shocks, nested timeframes and parameter search are frozen failure modes. Missing controls remain UNKNOWN.

### TI-706 — machine fail-closed rule
The registry carries the canonical lineage fields. Missing lineage, unknown representation family or unregistered version cannot increase effectiveIndependentEvidenceCount. Raw count and deduplicated family count must both be observable.

### TI-707 — deterministic fixture passes
Observed fixture result:
`status=PASS; modules=12; retiredRocOwner=D03-02; directReturnAliasFamilies=1; trendAliasFamilies=1; missingLineage=UNKNOWN; formalCoreImpact=NONE_LOCKED`.

This proves contract mechanics, not Alpha.

### TI-708 — maturity and routing decision
D03 semantic remediation for SDA-001/SDA-004 is now frozen V0.1. The tickets remain REMEDIATION_IN_PROGRESS because System1/System2 shared lineage/dedup Shadow engineering, D16 residual/multiple-testing/OOS readback and 00 closure remain outstanding.

No maturity promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- PR #600 remains owner-gated and untouched;
- raw receipt gate remains 2/3;
- outcome joins remain closed;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Exact next:
protected Production path still requires owner approval for PR #600, then a genuine cutoff-bearing Taiwan-session parent and complete Bollinger v0.2 reconciliation. Independent Class A path hands the frozen registry to System1/System2 for raw-vs-deduplicated Shadow diagnostics; D16 must preregister the parameter-family budget and validate common-support residual/OOS incrementality. ADX remains second behind Bollinger and canonical FULL_REPLAY.


## TI-709 through TI-732 — lineage consumer pre-audit, System 2 bridge and executable acceptance oracle (2026-10-05)

Canonical detailed artifacts:
- `research/D03_RESIDUAL_BASELINE_AND_CONSUMER_PREAUDIT_20261005_V0_1.md`;
- `research/D03_SYSTEM2_DAILY_RESONANCE_LINEAGE_BRIDGE_20261005_V0_1.md`;
- `research/d03_system2_daily_resonance_lineage_bridge_20261005_v0_1.json`;
- `research/D03_SYSTEM2_RESONANCE_DEDUP_ACCEPTANCE_ORACLE_20261005_V0_1.md`;
- `research/d03_system2_resonance_dedup_acceptance_cases_20261005_v0_1.json`;
- `research/test_d03_system2_resonance_dedup_acceptance_v0_1.mjs`.

### TI-709~716 — residual baseline and consumer pre-audit
Downstream indexed consumption was not demonstrated at the audited cursor, so raw-vs-deduplicated behavior remained unverified. The strongest same-root baselines are frozen for every active D03 lane. Residual success against a weak baseline does not split a redundancy group. KD/RSI require bilateral sibling controls; divergence/Bollinger/multi-timeframe child-parent stacking is forbidden; parameter variants stay inside one experiment-family budget.

### TI-717~724 — System 2 daily resonance bridge
The observed research runtime uses close-above-EMA16-and-rising, EMA16-above-EMA64 and Impulse MACD for 1/3->2/3->3/3 lifecycle states and already declares same-family independence false. All three map to `PRICE_OHLC` / `RG_D03_PRICE_TREND`. Impulse MACD uses HLC3 + SMMA34 + ZLEMA34 + SMA9 and is frozen as `PF_D03_SYSTEM2_IMPULSE_MACD_34_9_HLC3_V0_1`. Runtime dedup diagnostics remain missing.

### TI-725~732 — executable acceptance oracle
All eight Boolean combinations and four adversarial cases pass. Full resonance is exactly three raw lifecycle conditions but one deduplicated/effective price-trend family. Duplicate registration cannot inflate counts; missing lineage fails closed to UNKNOWN; redundancy-group and parameter-family drift are rejected.

Observed:
`status=PASS; truthTableCases=8; adversarialCases=4; fullResonanceRawSignalCount=3; fullResonanceDedupedEvidenceFamilyCount=1; fullResonanceEffectiveIndependentEvidenceCount=1; missingLineage=UNKNOWN_FAIL_CLOSED; formalCoreImpact=NONE_LOCKED`.

No outcome was inspected. No System 2 runtime or Formal behavior was changed. D03 remains 56.7%; D03-09 and D03-10 remain L2/40; raw gate remains 2/3; SDA-001/SDA-004 remain REMEDIATION_IN_PROGRESS; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Exact next:
System 2 implementation owner adds the required research/shadow lineage fields and returns an oracle-backed machine receipt. D03 reviews mapping drift. System 1 equivalent diagnostics, D16 sibling residual/multiplicity/OOS validation and 00 closure remain required. Protected PR #600, Bollinger and ADX paths are unchanged.


## TI-733 through TI-748 — System 1 consumer mapping readback and schema-delta oracle (2026-10-05)

Detailed artifacts:
- `research/D03_SYSTEM1_SDA_CONSUMER_MAPPING_REVIEW_20261005_V0_1.md`;
- `research/d03_system1_sda_consumer_mapping_review_20261005_v0_1.json`;
- `research/D03_SYSTEM1_DIAGNOSTIC_SCHEMA_DELTA_ACCEPTANCE_20261005_V0_1.md`;
- `research/d03_system1_diagnostic_schema_delta_cases_20261005_v0_1.json`;
- `research/test_d03_system1_diagnostic_schema_delta_acceptance_v0_1.mjs`.

### TI-733~740 — merged System 1 mapping readback
Merged PR #608 passes canonical D03 registry digest pinning, retired D03-11->D03-02 alias handling, conservative same-root/redundancy/parent-child connected dedup, parameter-family reset prevention, fail-closed lineage/PIT handling, D03-04 outcome-only exclusion and the no-independent-evidence-promotion firewall. `effectiveIndependentEvidenceCount` remains 0. Verdict is `PASS_WITH_DIAGNOSTIC_SCHEMA_GAPS` because explicit redundancy-group contributions, dominant roots and stable overlap identities are incomplete.

### TI-741~748 — schema-delta acceptance oracle
The oracle freezes exact component reconciliation, dominant-root coverage semantics and stable factorId+factorVersion+signalIndex identity. It rejects field-name-only patches, count/score mismatch, root mismatch, missing factorVersion and UNKNOWN leakage. Permuting input order may change local indices only; stable identities, roots, counts, scores, Formal references and the independent-evidence firewall remain invariant.

Observed:
`status=PASS; acceptanceCases=7; completeSchema=PASS; genericOnly=REJECT_CANONICAL_FIELDS_MISSING; permutationInvariant=true; stableOverlapIdentity=true; dominantRootReconciled=true; effectiveIndependentEvidenceCount=0; formalCoreImpact=NONE_LOCKED`.

No outcome was accessed. No System 1 implementation or Formal behavior changed. D03 remains 56.7%; D03-09 and D03-10 remain L2/40; SDA-001/SDA-004 remain REMEDIATION_IN_PROGRESS; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Exact next:
System 1 owner implements only the three Class A diagnostic schema deltas and returns an oracle-backed receipt. D03 revalidates the small schema delta, then waits for a genuine-session receipt. System 2, D16, 00 and protected Production paths remain separately pending.



## TI-777 through TI-802 — interaction accounting execution and Bollinger/ADX mapping audit (2026-10-06)

The canonical TI-777~794 fourteen-case fixture was executed and passed. It preserves two independent source roots after a proven interaction, permits at most one residual interaction increment, and blocks alias inflation. This is contract evidence only; no outcome data was used.

TI-795~802 then audited current D03-10 Bollinger and D03-09 ADX mappings without formula redesign. Bollinger was separated into price location, dispersion/volatility and their composite interaction; ADX was separated into directional movement, TR/range, DI/DX normalization and Wilder-smoothed strength. Current parent mappings remain conservative one-family evidence. Future component and interaction counts are capped at 2 and 3 only after the full TI-759~794 proof stack.

Observed mapping fixture:
`status=PASS; cases=12; currentBollingerEffectiveCount=1; currentAdxEffectiveCount=1; futureTwoComponentsNoInteraction=2; futureOneCanonicalInteraction=3; aliasInflationBlocked=true; weakBaselineBlocked=true; formalCoreImpact=NONE_LOCKED; outcomeDataUsed=false`.

No maturity or Formal change. Exact next is a sparse-cell/date-cluster estimability oracle for future interaction receipts.



## TI-971 through TI-978 — canonical falsification fixture execution (2026-10-06)

Detailed artifacts:
- `research/D03_INTERACTION_FALSIFICATION_EXECUTION_READBACK_20261006_V0_1.md`;
- `research/d03_interaction_falsification_execution_receipt_20261006_v0_1.json`.

The six canonical TI-853~970 fixtures were fetched from latest main with exact blob identities and executed without modification. All six processes exited 0 and 90/90 deterministic cases passed:
- dependence-preserving negative-control/permutation oracle: 21;
- indicator-specific falsifier mapping: 14;
- pipeline-level selected/max-statistic null replay: 15;
- null-generator validation/falsifier disagreement: 15;
- D03-to-D16 falsification-method receipt: 12;
- null-of-null held-out synthetic calibration: 13.

The execution closes the prior Node-receipt gap for contract mechanics only. It accessed no outcome data, contributes zero market-evidence units, does not replace a real D16 method/incrementality/falsification receipt, and does not justify maturity or Formal promotion.

Exact next: external machine readback first; if unchanged, causal-direction/lead-lag placebo hierarchy, maturity-neutral.



## TI-979 through TI-1000 — causal-direction / lead-lag placebo hierarchy (2026-10-06)

Detailed artifacts:
- `research/D03_CAUSAL_DIRECTION_LEAD_LAG_PLACEBO_HIERARCHY_20261006_V0_1.md`;
- `research/d03_causal_direction_lead_lag_placebo_cases_20261006_v0_1.json`;
- `research/test_d03_causal_direction_lead_lag_placebo_v0_1.mjs`;
- `research/d03_causal_direction_lead_lag_placebo_acceptance_receipt_20261006_v0_1.json`.

D03 now separates decision-time predictive information from contemporaneous association, stale persistence, reverse-time association and future-state leakage. Future indicator states are leakage sentinels only; same-close fills are rejected where the close finalized the signal; lead/lag offsets remain one preregistered multiplicity family; common support, purge, dependence, ancestry controls and multi-timeframe finality remain mandatory.

The 16-case executable oracle passes and uses no outcome data. Timing consistency supports predictive incrementality only, not structural causality. No maturity or Formal change.

Exact next: external machine readback first; otherwise freeze the consumer timing-receipt schema/mapping, maturity-neutral.

## TI-1195 through TI-1204 — System2 S2-07 bounded technical-continuity readback (2026-10-07)

System2 physical run `37498936053` proves one bounded TPEX 4806 capital-reduction event can reconcile RAW close 10.4 to official reference price 14.87 and separate residual resume open/close movement without history mutation. The evidence is materially useful for corporate-action contamination control.

Promotion is rejected because the official event knowledge clock is historical UNKNOWN: `firstKnownAt` and `availableAt` are null and PIT replay is false. One selected positive lineage case cannot establish all-history continuity, OOS, walk-forward, cost, fillability, market-state robustness or independent alpha. D03 remains 56.7%; D03-09/D03-10 remain L2/40; raw gate 2/3; outcomes CLOSED; Formal Core LOCKED.

Exact next is a prospectively timestamped official-event version before the decision cutoff, followed by genuine parent binding and complete expected-parent reconciliation.

## TI-1205 through TI-1214 — exact reference-event availability negative gate (2026-10-07)

System2 V1.2 physically pins the TPEX 4806 stable semanticHash `b6a4c97fdf3ded2bdae7048852540e4f58c1a64da4cbc012e350d5227e20d869`, stable sourceRowHash `518fcdf6b0f3d5dc8ffaafba59556c86da3cda76dd0e46c528217740c33ae92b` and eight relevant MOPS rows. The physical-receipt observation eventVersionId is `S2-CA-EVENT:82da757e780d7be2c3474f5ca505d385b55705d44b520f291dc7383f88c391ca`, but `observationVersionIdUsedAsStableIdentity=false` because eventVersionId may change across retrievals. All eight rows preserve valid source-reported chronology but are retrospective-only; independent exact-version public-availability evidence is 0, firstKnownAt/availableAt remain null and PIT replay remains false.

This is meaningful negative evidence: issuer disclosure chronology does not prove when the exact exchange reference-price row became publicly available. Historical timestamps cannot be promoted to availableAt, retrospective retrieval cannot become firstObservedAt, and a late observer cannot prove pre-cutoff availability.

Dedicated workflow and System2 Research CI pass. Repository-wide regression fails at an unrelated SDA-016 governance-sync token assertion; merged-main dedicated run `37538787809` and merged-main System2 Research CI `37538787638` pass after the physical receipt freezes stable identity. D03 accepts only the dedicated bounded evidence. D03 remains 56.7%; D03-09/D03-10 L2/40; raw gate 2/3; outcomes CLOSED; Formal Core LOCKED.

Exact next is to stop blind historical-clock promotion attempts and reopen only when independent evidence binds the stable semanticHash and sourceRowHash to a prospective observation or an authoritative publication-time contract before the replay cutoff. Observation eventVersionId must not be used as stable cross-fetch identity.


## TI-1215 through TI-1226 — S2-07 V1.6 prospective membership-drift gate (2026-10-07)

System2 V1.6 provides the first genuine prospective exact-version population layer for a frozen 23-event / 23-symbol universe. Two successful captures preserve the same stable semantic universe and common exact-version payload hashes have zero mutation. This supports stable content identity conditional on presence.

The same comparison also falsifies single-capture completeness: the first run has 159 versions, the second 161, while the second gains 9 and loses 7 identities. Symbol 4806 is among the earlier query-path divergent symbols. Therefore a missing row cannot mean the version did not exist, and one capture cannot freeze the complete expected keyset. Earliest genuine observed-at is an upper bound only and cannot be backdated to historical availability.

Dedicated workflow `37548011614`, System2 Research CI `37548011621` and V8 Regression `37548011620` pass. However expected-keyset completeness, revision-gap closure, pre-parent readiness, symbol-session completeness and technical continuity remain false. Two same-date captures are not OOS or walk-forward evidence; cost, fillability and market-state evidence remain UNKNOWN. No factor outcome was joined and no new alpha root exists.

The 2021 TPEx revision-recovery workflow is not credited before physical execution and an immutable receipt. D03 remains 56.7%; D03-09/D03-10 remain L2/40; raw gate remains 2/3; outcomes remain CLOSED; Formal Core remains LOCKED.

Exact next is repeated-capture union/stability reconciliation with earliest-observed preservation and query-path classification, followed by bounded stabilization, source-manifest/pre-parent binding and post-parent proof of `noRevisionGapThroughCut=true` before any technical-continuity promotion.


## TI-1293~1308 — SHORT_MOMENTUM strategy-clock over-gating firewall (2026-10-07)

D03 accepts the D16 and `S2-CORR-20261007-002` finding that the current global Decision Clock is not a valid substitute for SHORT_MOMENTUM strategy readiness. Frozen SHORT_MOMENTUM launch dependencies are technical structure, price-volume and risk-friction evidence plus universal PIT/session/source-integrity safeguards; B2 industry thesis and A5 fundamentals are not required. Yet the global clock includes B2 in same-session readiness and requires A5 by the candidate boundary. Prospective run `37577209442` physically observed A5 available, B2 unavailable and global requiredReady false.

This creates a D03 sampling hazard: global blocking can understate opportunity coverage, inflate apparent zero-pick rates, condition outcome samples on unrelated-source availability, contaminate capacity denominators and make System1/System2 overlap look lower for mechanical reasons. Strategy-required missingness, universal-integrity blocks, irrelevant-source missingness, policy disablement, natural zero-pick and data-unknown must remain separate states. Global requiredReady cannot replace strategyEvaluableN.

Counterevidence is preserved: the global clock remains valid for genuinely cross-strategy uses, removing an irrelevant gate does not prove any candidate or alpha, and the current physical example is one trading date only. OOS, walk-forward, cost, fillability and market-state effects remain UNKNOWN. Later B2/A5 arrival cannot backdate candidateReadyAt.

D03 owns only the inference firewall; BUILD_LANE owns correction implementation. D03 remains 56.7%; D03-09/D03-10 remain L2/40; outcomes remain CLOSED; Formal Core remains LOCKED.

Exact next remains the Layer-B physical lifecycle-event-union rehabilitation receipt. In parallel, accept the strategy-clock correction only after a genuine mixed-dependency receipt proves strategy-specific readiness while universal integrity still fails closed and pre-fix defect rows remain immutable.


## TI-1345 through TI-1360 — TWSE V0.6 physical receipt preregistered acceptance oracle (2026-10-07)

The first physical annual V0.6 receipt is still absent. D03 therefore preregisters outcome-independent acceptance before inspecting it. The 18-case executable oracle requires same TWSE market/year/schema; exact UNKNOWN and missingReasonCounts arithmetic; one unique market|symbol|date identity per reclassification; valid event/source hashes; zero unresolved conflicts and partial-source symbols; no cold OHLCV mutation; no absence-based NO_EVENT inference; and no Layer-C known-at leakage.

All 18 deterministic cases pass. A complete zero-delta annual run is accepted only as negative evidence and cannot promote Layer B or maturity. OOS, walk-forward, costs, fillability, market-state and alpha remain UNKNOWN. D03 remains 56.7%; D03-09/D03-10 remain L2/40; outcomes CLOSED; Formal Core LOCKED; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

Exact next: consume the first physical TWSE annual V0.6 receipt and validate it against this oracle. Keep TPEx parity, Layer-C known-at, exact-window continuity binding, genuine V8.20 parent, T48, S2-07, consumer dedup and D16 incrementality independent.


## TI-1475 through TI-1494 — CORR-007 suspension provenance promotion firewall (2026-10-08)

D03 accepts `S2-CORR-20261008-007` as a real W0 promotion blocker. Current code can treat `suspensionCoverageByExchange.TWSE=COMPLETE` as sufficient while sourceEvidenceRefs bind only the three corporate-action source contracts. A plain COMPLETE state, even when hashed, is not immutable proof of bounded suspension completeness.

The D03 firewall requires the exact TWSE replay interval, a first-class bounded suspension receipt digest/source/version, one matching additive sourceEvidenceRef, causal observation/availability timing, zero partial-source/conflict state, exact-session readiness and archive-hash sensitivity to the suspension digest. Missing, mismatched, late or unbound evidence remains `CONTINUITY_UNKNOWN`.

The 20-case executable oracle passes and rejects every frozen counterexample. It proves contract mechanics only: CORR-007 implementation, the real TWTAWU receipt, W0 continuity, OOS, walk-forward, costs, fillability, market states and alpha remain pending/UNKNOWN.

D03 remains 56.7%; D03-09/D03-10 remain L2/40; outcomes CLOSED; Formal Core LOCKED; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Exact next: accept merged-main CORR-007 verification and real bounded suspension evidence on the W0 track; independently wait for a future genuine V8.20 parent. Run existing D03-10 oracles only when both admissible inputs exist.


## 2026-10-08 D03 CORR-007 versioned receipt compatibility gate

Artifacts:
- `research/D03_CORR007_VERSIONED_RECEIPT_COMPATIBILITY_GATE_20261008_V0_1.md`;
- `research/d03_corr007_versioned_receipt_gate_cases_20261008_v0_1.json`;
- `research/test_d03_corr007_versioned_receipt_gate_v0_1.mjs`.

The upstream CORR-007 handoff now explicitly distinguishes evidence-bound suspension completeness from legacy status-only completeness. D03 therefore adds a machine gate: legacy `S2_CA_COMPLETENESS_RECEIPT_V0_1` cannot promote physical CLEAR_NO_ACTION even if a digest is appended or the payload is relabelled. V0.2 semantics require an exact interval, source family/version, immutable bounded digest, matching source evidence reference, causal timing, all three separate corporate-action references, exact-session readiness and zero partial/conflict state.

The 16-case executable oracle passes, including rejection of legacy-with-digest and V0.2-wrapper/V0.1-source mixtures. Changing only the bounded suspension digest changes the bound input hash.

Counterevidence remains binding: this is a contract oracle, not merged runtime implementation, independent exact-head verification, a real TWTAWU bounded receipt, physical W0 continuity, a genuine V8.20 parent or predictive evidence. OOS, walk-forward, multiple-testing, transaction cost, fillability, market-state and alpha remain UNKNOWN.

D03 remains 56.7%; 12 active modules = 10 L3 + 2 L2; D03-09 and D03-10 remain L2/40; outcomes CLOSED; Formal Core LOCKED; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.

Exact next is merged-main CORR-007 V0.2-equivalent implementation and independent verification, including legacy V0.1 fail-closed and digest/hash-chain sensitivity; then a real exact-window TWTAWU receipt bound into archive/continuity, plus the independent future genuine V8.20 parent track.


## TI-1565 through TI-1584 — indicator backtest PIT universe and denominator firewall (2026-10-08)

Artifacts:
- `research/D03_INDICATOR_BACKTEST_PIT_UNIVERSE_DENOMINATOR_FIREWALL_20261008_V0_1.md`;
- `research/d03_indicator_backtest_pit_universe_cases_20261008_v0_1.json`;
- `research/test_d03_indicator_backtest_pit_universe_v0_1.mjs`.

D03 consumes merged System2 CORR-014 as an engineering dependency and freezes its own inference rule: formula correctness does not prove historical-universe validity. Every multi-date or cross-sectional indicator claim must bind the exact decision-date market-symbol universe, registry/snapshot hashes, known exclusions, replay eligibility, decision timestamp and fully reconciled eligible/accounted/sample/state denominators.

Today's survivors cannot be replayed backward. Future delisting or membership-end facts cannot enter a prior decision receipt. Unknown membership or exclusion remains UNKNOWN.

Zero samples are split into three states: proved empty PIT universe; nonempty universe with all members excluded; or unknown universe/denominator. Only the first may complete a zero-sample date.

The immutable research plan must bind dataset, policy, evaluator code, factor definition, regime version, execution assumptions and cost model. Changed plan identity invalidates checkpoint reuse. Checkpoint, partition, rolling-digest, date-summary and sample accounting must reconcile before any date is skipped.

The 22-case oracle passes. It rejects current-survivor universes, future membership-end leakage, unknown membership/exclusions, denominator mismatch, forged checkpoints, plan drift, look-ahead factor evidence, OOS overlap, invalid walk-forward ordering and missing date-cluster audit. It accepts a genuinely empty universe only with an explicit proved-empty receipt.

This is deterministic contract evidence, not physical D03 outcome evidence. CORR-014 remains open in the correction queue pending independent verification. OOS, walk-forward performance, multiple-testing control, redundancy, cost, fillability, market-state and alpha remain UNKNOWN until real panels satisfy the gate.

D03 remains 56.7%; 12 active modules = 10 L3 + 2 L2; D03-09/D03-10 remain L2/40; outcomes CLOSED; Formal Core LOCKED; `FORMAL_OPTIMIZATION_CANDIDATE = NONE`.


## Continuation update — TI-1637 through TI-1654

- TI-1637~1641 freeze a four-level raw-source attestation taxonomy. L1 is same-endpoint repeat-capture stability; L2 is same-authority or same-producer representation parity; L3 is an independent integrity/timestamp witness or a path retaining a shared parser; only L4 is independent semantic source attestation across distinct authority, producer and parser roots for the same market, trade date, bounded scope and symbol-session semantics before the decision cutoff.
- TI-1642~1647 classify the completed third raw-session receipt without inflating evidence. Two captures of the same official endpoint are L1 only. TPEx current/history exact-row equality is at most L2 because authority/producer ancestry is shared. TWSE current/history cannot receive same-date L2 parity for 2026-10-08 because current remained on 2026-10-07. Therefore independent source attestation remains UNKNOWN.
- TI-1648~1652 add a 20-case executable falsification oracle. It rejects market/date/scope mismatch, partial responses, unknown lineage, late observation, shared backends, shared semantic parsers and missing payload identities. Semantic disagreement is CONFLICT rather than permission to choose the primary silently. L4 alone is still insufficient when certified symbol-session receipt, corporate-action ancestry or continuity-receipt hash binding is absent.
- TI-1653 fixes a canonicalization defect exposed by the first local run: top-level-only key sorting failed to bind nested attestor identity. Recursive deterministic canonicalization now makes a nested attestor raw-payload-hash mutation change the SHA-256 identity. The corrected oracle passes all 20 cases.
- TI-1654 explicitly forbids inventing a second official source. The current physical evidence supports finite repeat stability, not independent-source completeness. Revision incidence, OOS, walk-forward, multiple-testing control, cost, fillability, market-state robustness and alpha remain UNKNOWN.
- New research artifacts:
  - research/D03_RAW_SOURCE_ATTESTATION_INDEPENDENCE_FIREWALL_20261009_V0_1.md
  - research/d03_raw_source_attestation_independence_cases_20261009_v0_1.json
  - research/test_d03_raw_source_attestation_independence_v0_1.mjs
- No D03 module promotion, no outcome join and no FORMAL_OPTIMIZATION_CANDIDATE. D03 remains 56.7%; 12 modules = 10 L3 + 2 L2. Formal Core remains LOCKED.

### Updated exact next continuation point

1. W0 remains the primary physical lane: obtain the first real exact-window source-honest continuity receipt binding bounded TWTAWU negative completeness, D03_PRICE_RESET_FAMILY_SET_V0_1, same-security identity-transition disposition and exact replay/source-history/session/source hashes.
2. Parent remains the second physical lane: obtain the next ordinary-session live-quality-ready immutable C1 generation with authoritative V8.20 Formal-to-C1 binding.
3. Independent raw-source attestation remains UNKNOWN. Do not count same-endpoint recapture, same-authority endpoint parity or integrity-only timestamps as an independent semantic source.
4. If a candidate attestor is found, first bind authorityRootId, producerRootId, parserRootId, endpointId, market, trade date, bounded scope, raw payload hash, normalized symbol-session hash and observedAt; then run the 20-case oracle before any completeness credit.
5. When W0 + genuine parent exist, evaluate the Bollinger post-reset 20-session parent shortcut and canonical D03-10 admission. D03-09 still requires FULL_REPLAY or independently replay-certified trusted state.
6. Keep certified symbol-session/corporate-action lineage, immutable parent-child reconciliation, T48, S2-07, D03 dedup/redundancy and D16 incrementality as separate gates.
7. Formal Core remains unchanged.


## Continuation update — TI-1655 through TI-1672

- TI-1655~1659 consume the new physical TWSE TWTAWU positive-parity receipt without promoting its scope. GitHub Actions run 37868573025 / job 113621076062 on head 432fe6b068437c85ffa2abd924caf19577278e83 completed SUCCESS and produced artifact 11589476886 with digest sha256:9357725b1a5bbe4263dbc054f130cee836b57b9683636246272f903acc3ddca9.
- TI-1660~1663 verify the exact 2026-08-13..2026-08-14 all-listed query. Official JSON returned 457 original bytes with SHA-256 35ea58176c3e95d14b0ad8cad401b23b9bf127705775ac96d4fca7635901b64f. Official CSV returned 217 original bytes with SHA-256 61730005722e21b5f247f8d64c522461370453b077559723fb952dff453ef5de, declared MS950, and was strictly decoded through Big5. Each representation normalized to one row and reproduced the real 1218 suspension on 2026-08-13 and resumption on 2026-08-14.
- TI-1664~1666 retain the prior UTF-8 decoding failure as negative engineering evidence. Source bytes must be hashed before charset decoding; decoded/re-encoded text hashes cannot substitute for source identity. The corrected physical run closes only the positive transport/representation falsification prerequisite.
- TI-1667~1669 classify the receipt as L2 same-authority representation parity. Both representations share the TWSE authority, producer family and domain. They do not establish L4 independent semantic attestation, independent backend ancestry, exact-range exhaustiveness, no-pagination/truncation, revision/cancellation coverage or original decision-time availability.
- TI-1670 adds an 18-case executable consumer oracle. It separates positive parity, negative completeness and W0 readiness. Empty JSON + empty CSV remains UNKNOWN unless the export contract, bounded-range exhaustiveness, no truncation, revision coverage, source coverage and decision-time causality are all independently proven.
- TI-1671 requires W0 to add certified symbol sessions, corporate-action ancestry, identity-transition disposition and continuity-receipt hash binding after negative completeness. The current physical receipt passes positive parity only; negative completeness=false and W0Ready=false.
- TI-1672 freezes scientific limits. No historical PIT availability, outcome, alpha, OOS, walk-forward, multiple-testing, cost, fillability or market-state conclusion is created.
- New research artifacts:
  - research/D03_TWTAWU_PHYSICAL_PARITY_CONSUMER_20261009_V0_1.md
  - research/d03_twtawu_physical_parity_consumer_cases_20261009_v0_1.json
  - research/test_d03_twtawu_physical_parity_consumer_v0_1.mjs
- No D03 module promotion and no FORMAL_OPTIMIZATION_CANDIDATE. D03 remains 56.7%; 12 modules = 10 L3 + 2 L2. Formal Core remains LOCKED.

### Updated exact next continuation point

1. TWTAWU positive JSON/CSV row-set parity is physically accepted at L2 only. Do not rerun or relabel it as negative completeness.
2. W0 next needs an independently pinned official export/query contract, exact-range exhaustiveness, no-truncation/pagination evidence, revision/cancellation coverage and a causal exact replay-window negative witness. Then bind certified symbol-session, corporate-action, identity-transition and continuity-receipt hash lineage.
3. Parent lane remains unchanged: obtain the next ordinary-session live-quality-ready immutable C1 generation with authoritative V8.20 Formal-to-C1 binding.
4. Independent semantic source attestation remains UNKNOWN because the two TWTAWU representations share the same authority/producer family.
5. When W0 + genuine parent exist, evaluate the Bollinger post-reset 20-session parent shortcut and canonical D03-10 admission. D03-09 still requires FULL_REPLAY or independently replay-certified trusted state.
6. Keep immutable parent-child reconciliation, T48, S2-07, D03 dedup/redundancy and D16 incrementality as separate gates.
7. Formal Core remains unchanged.


## Continuation update — TI-1673 through TI-1692

- TI-1673~1677 consume the new physical October source receipt without converting it into historical PIT evidence. System2 DATA_LANE run 37878847039 / job 113653590991 on head 39ca8dce38fa675874074609fb32d9c44321e944 completed successfully and produced artifact 11593830777 with digest sha256:7b765d4b59ef5e9211f4ba03ab7f97462ba192e065140b6b6c5da3ec1b024a49.
- TI-1678~1681 accept 12 of 12 canonical official source-date receipts across TWSE and TPEx for six completed sessions from 2026-10-01 through 2026-10-08. The bounded receipt has 6,518 TWSE and 5,325 TPEx ordinary stock-date rows, 11,843 combined, with payload-date identity, primary transport, RAW price space and normalized bar hashes.
- TI-1682~1685 preserve the evidence clock exactly as POST_FACTO_SOURCE_OBSERVATION_NOT_ORIGINAL_FIRST_KNOWN. Later retrieval proves later source availability and supports outcome-blind formula/mechanism replay. It does not prove that the same bytes/version/row were known by the original decision cutoff.
- TI-1686 freezes three separate clocks: market-data date, physical observation time and decision cutoff. Market-date equality cannot collapse the other two clocks. Backdating observedAt/firstKnownAt to the bar date is a hard failure.
- TI-1687~1689 add a 20-case executable firewall with four cumulative states: POST_FACTO_SOURCE_ONLY, PIT_INPUT_READY, W0_READY and OUTCOME_JOIN_READY. The current evidence passes only POST_FACTO_SOURCE_ONLY. PITReady=false, W0Ready=false and outcomeJoinReady=false.
- TI-1690 prevents storage laundering. The unexecuted 11,843-key Hot D1 census cannot be counted as storage completeness. Even a later all-key storage match would not reconstruct original firstKnownAt. Value mismatch or RAW multiversion is STORAGE_CONFLICT, not permission to choose a favorable row.
- TI-1691 keeps parent and denominator gates separate. Outcome joins additionally require a genuine immutable parent, complete population denominator and bound cost/fillability assumptions after W0.
- TI-1692 freezes scientific limits. Six adjacent dates are date-clustered source evidence, not OOS/walk-forward evidence. Alpha, selection bias, multiple testing, cost, fillability, market-state robustness and independent incrementality remain UNKNOWN.
- New research artifacts:
  - research/D03_POST_FACTO_INDICATOR_CLOCK_FIREWALL_20261009_V0_1.md
  - research/d03_post_facto_indicator_clock_cases_20261009_v0_1.json
  - research/test_d03_post_facto_indicator_clock_v0_1.mjs
- No D03 module promotion and no FORMAL_OPTIMIZATION_CANDIDATE. D03 remains 56.7%; 12 modules = 10 L3 + 2 L2. Formal Core remains LOCKED.

### Updated exact next continuation point

1. Current October 12/12 official-source evidence is POST_FACTO_SOURCE_ONLY. It may support formula/mechanism replay diagnostics but may not open PIT admission, W0 or outcomes.
2. Await the quota-authorized read-only 36-key scout and, only with proven read headroom, the full 11,843-key Hot D1 census. Consume its discrepancies as storage evidence only; never backdate firstKnownAt or availability.
3. W0 still needs causal exact-window availability, certified exact symbol sessions, corporate-action ancestry, halt/no-event coverage, identity-transition disposition and continuity-receipt hash binding.
4. Parent remains the next ordinary-session live-quality-ready immutable C1 generation with authoritative V8.20 Formal-to-C1 binding.
5. When W0 + genuine parent exist, evaluate the Bollinger post-reset 20-session parent shortcut and canonical D03-10 admission. D03-09 still requires FULL_REPLAY or independently replay-certified trusted state.
6. Keep independent semantic source attestation, parent-child reconciliation, T48, S2-07, D03 dedup/redundancy and D16 incrementality as separate gates.
7. Formal Core remains unchanged.
