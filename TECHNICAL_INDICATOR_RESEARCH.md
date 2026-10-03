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
