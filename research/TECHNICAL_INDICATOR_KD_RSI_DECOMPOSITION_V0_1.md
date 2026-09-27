# Technical Indicator KD vs RSI Semantic Decomposition V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / PRIMARY_QUEUE_DECOMPOSITION
Formal Core: LOCKED

## Purpose

Advance the first primary technical-indicator comparison:
KD / Stochastic versus RSI.

The goal is not to decide which named indicator is "better".
The goal is to determine whether:
- B2 RANGE_LOCATION_EXTREME_RECENCY; and
- B3 SIGNED_RETURN_PATH_BALANCE

contain genuinely distinct information after separating:
1. semantic input;
2. horizon;
3. smoothing / lag-noise response;
4. source/data semantics.

No forward-return outcomes are inspected in this tranche.

## TI-211 — Formula-level non-equivalence

Current frozen Taiwan KD implementation:
- RSV9 = 100 * (Close - rollingLow9) / (rollingHigh9 - rollingLow9)
- K_t = (2/3) K_(t-1) + (1/3) RSV_t
- D_t = (2/3) D_(t-1) + (1/3) K_t
- initial K=D=50.

Frozen RSI implementation:
- close-to-close delta;
- positive/negative delta decomposition;
- Wilder RSI14 with SMA seed then alpha=1/14 recursion.

Therefore the source information differs.

KD consumes:
- Close;
- rolling High;
- rolling Low;
- prior RSV/K/D history.

RSI consumes:
- Close-to-close changes only;
- prior smoothed gain/loss state.

Consequences:
- holding the full Close series fixed leaves RSI fixed but can change KD if High/Low geometry changes;
- similar KD states can coexist with very different RSI states when rolling-range location is similar but the preceding gain/loss path differs.

KD and RSI are correlated price-derived oscillators, but they are not algebraic aliases.

## TI-212 — Synthetic witness A: identical closes / identical RSI / different KD

30-bar Close path:
[100,101,100.5,102,101.5,103,102.5,104,103.5,105,104.5,106,105.5,107,106.5,108,107.5,109,108.5,110,109.5,111,110.5,112,111.5,113,112.5,114,113.5,115]

Fixture A-TIGHT:
- every High = Close + 0.5;
- every Low = Close - 0.5.

Final:
- RSI14 = 76.5323885110
- RSV9 = 90.9090909091
- K = 87.2676239985
- D = 86.5031459720

Fixture A-WIDE:
same Close sequence, but wider/irregular High-Low envelopes are injected.

Final:
- RSI14 = 76.5323885110 exactly unchanged;
- RSV9 = 75.0
- K = 66.8435435632
- D = 64.6678574607

Interpretation:
RSI cannot observe the High/Low perturbation because its input is unchanged.
KD responds materially because B2 range geometry changed.

This proves a genuine semantic distinction:
KD can encode OHLC extreme/range information absent from close-only RSI.

It does NOT prove that the extra range information predicts returns.

## TI-213 — Synthetic witness B: almost identical K/D / radically different RSI

Two deterministic 30-bar OHLC paths were searched outcome-blind to produce similar final KD K/D but highly different RSI14.

Witness B-LOW-RSI:
- final RSV9 = 46.6666666667
- final K = 52.5086714409
- final D = 46.5149027746
- final RSI14 = 27.8519365990

Witness B-HIGH-RSI:
- final RSV9 = 78.5714285714
- final K = 53.3754329240
- final D = 47.2320948847
- final RSI14 = 70.9339681750

K difference:
~0.867

D difference:
~0.717

RSI difference:
~43.082 points.

Interpretation:
similar smoothed range-location states can coexist with radically different Wilder gain/loss path balance.

This proves B3 carries path information that a similar K/D state does not uniquely identify.

No directional conclusion is attached to either witness.

## TI-214 — Three-confound problem in naive KD9-3-3 vs RSI14 comparison

A direct comparison of conventional Taiwan KD9-3-3 against RSI14 mixes:

1. semantic difference:
   B2 range location vs B3 signed-return path balance;

2. horizon difference:
   RSV9 uses 9-bar rolling extrema while RSI uses 14 close-to-close changes;

3. response-profile difference:
   KD uses recursive 1/3 smoothing twice;
   RSI uses Wilder alpha=1/14 smoothing on gains/losses.

Therefore:
"KD beat RSI" or "RSI beat KD" cannot by itself identify which mechanism mattered.

## TI-215 — Frozen two-track comparison

### Track A — MARKET_CONVENTION
Compare the actual frozen implementations:
- Taiwan KD9-3-3;
- Wilder RSI14.

Purpose:
measure practical behavior of the conventional indicators as users actually encounter them.

Interpretation:
captures semantic + horizon + response-profile differences together.

### Track B — SEMANTIC_ISOLATION
Use:
- RAW_RANGE_POSITION_14 =
  100 * (Close - rollingLow14) / (rollingHigh14 - rollingLow14);
- Wilder RSI14.

No KD smoothing in the primary semantic-isolation comparison.

Purpose:
hold the nominal 14-bar horizon closer to common support and ask whether:
B2 range location adds information beyond B3 path balance and vice versa.

A secondary decomposition may compare:
- RSV9 vs K9 vs D9
only for filter-memory mechanics, not alpha stacking.

No parameter sweep is authorized.

## TI-216 — KD itself must be decomposed into primitive and smoothing memory

KD is not one primitive.

RSV:
- B2 current rolling-range location.

K:
- smoothed RSV history.

D:
- smoothed K history.

Therefore future KD evidence must distinguish:
- semantic B2 information from RSV;
- persistence/filter information from K and D;
- K-D crossover as a transition of two nested smoothers.

If K/D adds no residual information beyond raw range position plus direct trend/path controls, the K/D lines should remain explanation/timing fields rather than extra scores.

## TI-217 — RSI itself is a compact transform, not a new primitive beyond its components

RSI14 is deterministic once its smoothed average gain and average loss are known.

Therefore:
- RSI value can be a useful compact B3 representation;
- it is not independent of Wilder avgGain/avgLoss;
- RSI slope/failure swing/divergence are additional transforms and require separate redundancy control.

The proper question is not:
"Does RSI add information beyond its own avgGain/avgLoss?"

The useful system question is:
"Does B3 signed-return path balance add information beyond endpoint returns, trend, B2 range location and other existing path descriptors?"

## TI-218 — Seed-readiness versus formula-readiness

The current research snapshot contract says:
- KD minimum bars = 9;
- RSI minimum closes = 15.

These are FIRST-CALCULABLE thresholds, not seed-convergence thresholds.

### KD seed influence
K recursion carries initial K weight:
(2/3)^m after m valid RSV updates.

D also carries its own initial state and propagated K seed.
If initial K and D are perturbed together, combined linear sensitivity is:
(2/3)^m * (1 + m/3).

This falls below ~1% after 16 valid RSV updates.
With first RSV at bar 9, that corresponds to roughly 24 bars total.

At the current 65-bar D1 cache, KD seed influence is effectively negligible.

### RSI seed influence
Wilder average-gain/loss recursion carries the initial seeded average with weight:
(13/14)^m after m post-seed updates.

For RSI14:
- first value is calculable at 15 closes;
- seed-state weight falls below 5% at about 56 total closes;
- below 2% at about 68 total closes;
- below 1% at about 78 total closes.

Current MARKET_STATE_DAYS = 65.
If RSI14 is recomputed from scratch on a rolling 65-bar cache, the local SMA seed still has about 2.46% linear weight in avgGain/avgLoss state at the final bar.

Important:
this is seed-state weight, NOT a claim that RSI numeric error is exactly 2.46%.

## TI-219 — Rolling-cache reseed hazard

If a recursive indicator is recomputed each day from a fixed rolling cache:
- the oldest bar falls out;
- a new local seed is created;
- the indicator state can shift partly because the seed origin moved.

A continuously updated indicator state does not have this same moving-reseed semantics.

Therefore future prospective technical-indicator research must choose and version one of:

A. CONTINUOUS_STATE:
persist recursive state prospectively;

B. DEEP_HISTORY_RECOMPUTE:
recompute from enough prior bars that seed influence is below a preregistered tolerance;

C. FIXED_LOCAL_WINDOW_FORMULA:
explicitly define the rolling-cache reseeded indicator as the intended formula and do not claim parity with full-history chart platforms.

No silent mixing.

## TI-220 — Snapshot state must split formula readiness from seed stability

Future contract states should distinguish:

formulaReadiness:
- WARMUP_INCOMPLETE
- FIRST_CALCULABLE
- READY

seedStability:
- UNASSESSED
- SEED_SENSITIVE
- WITHIN_TOLERANCE

Required metadata:
- inputStartDate;
- inputBarCount;
- seedMethod;
- recursiveUpdatesAfterSeed;
- seedInfluenceBound;
- seedTolerance;
- stateConstructionMode.

This is primarily a reproducibility / parity guard.

## TI-221 — Regime sign firewall remains active

External documentation itself warns:
- RSI can remain overbought/oversold during strong trends;
- Stochastic is often interpreted differently in ranges versus trends.

Taiwan evidence also shows momentum behavior is conditional on market continuation/transition.

Therefore:
KD high vs RSI high is not a stable directional sign.
The first KD/RSI study must condition on:
- UPTREND / RANGE / DOWNTREND / TRANSITION;
- Pattern lifecycle;
- overheat/lateStage;
- market/sector regime;
- price-limit constraint.

No fixed 20/80 or 30/70 threshold gets directional authority.

## TI-222 — Frozen future incremental-value ladder

On clean common-support observations:

M0 BASE:
- current A/B setup/context;
- ret5/ret10/ret20/ret60;
- trend state / MA alignment;
- volatility;
- Pattern lifecycle;
- Price-Volume state;
- market/sector regime;
- liquidity/price tier.

M1 B2:
M0 + raw range-position / extreme-recency representation.

M2 B3:
M0 + RSI14 / signed-return path-balance representation.

M3 BOTH:
M0 + B2 + B3.

M4 INTERACTION:
M3 + one preregistered B2 x B3 interaction only if sample maturity permits.

Questions:
- Does M1 improve over M0?
- Does M2 improve over M0?
- Does M3 improve over the better single-basis model?
- Does any interaction add beyond components?

No outcome-optimized thresholds.
No majority voting.
Independent scan date / episode remains the inference unit.

## TI-223 — Disagreement states are more informative than agreement count

The high-value descriptive observations are where B2 and B3 disagree.

Examples:
- high range position / neutral-low RSI:
  price is near a recent range extreme despite weaker gain/loss history;
- high RSI / neutral range position:
  persistent positive gain/loss balance without equivalent current range-edge location;
- opposite slopes:
  range-location momentum and gain/loss balance are evolving differently.

These states are diagnostic hypotheses only.
Their future sign is UNKNOWN until evidence.

"Both high" may simply reflect one strong trend episode and is not two votes.

## TI-224 — Taiwan evidence interpretation

Taiwan empirical evidence remains mixed:
- Cheng (2015) reports stronger sample-period performance for RSI and MACD than KD across 2009-2014 listed/OTC stocks.
- Yang (2023) reports some two-indicator combinations outperforming single indicators, but notes liquidity risk and weak bear-market performance.
- A 2023 machine-learning study on Taiwan Top 50 constituents (2003-2018) reports MA/MACD/RSI often performed poorly in conventional strategies and parameter importance varied; OBV was more useful in that design.
- Lin et al. (2016) and Chen/Hsieh/Lee (2023) show Taiwan momentum depends materially on market dynamics/persistency.

These studies do not resolve B2 versus B3 incremental value in the current post-2020 market or the current selector population.

They justify conditional, modern-regime falsification rather than a universal KD/RSI winner.

## TI-225 — Current conclusion

KD and RSI are NOT algebraic duplicates.

What is established:
- KD/B2 observes rolling OHLC range geometry that close-only RSI cannot see;
- RSI/B3 observes gain/loss path balance that similar K/D states do not uniquely identify;
- naive KD9-3-3 vs RSI14 comparisons confound semantic, horizon and filter-response differences;
- first-calculable warmup is not enough to guarantee recursive seed stability;
- current 65-bar cache is ample for KD seed decay but not below a 1% RSI seed-state tolerance if recomputed locally from scratch.

What remains UNKNOWN:
- whether B2 adds predictive/path-risk information beyond B3 and direct controls;
- whether B3 adds beyond B2 and direct controls;
- whether both together add incremental value in modern Taiwan cohorts;
- the sign of disagreement states;
- whether any benefit survives costs, regime splits, PIT/OOS and date clustering.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze machine-readable KD/RSI semantic-isolation fixtures and seed-stability contract.
2. Update the research snapshot contract conceptually: formula readiness != seed stability.
3. Do not change Worker.js or MARKET_STATE_DAYS from this research finding.
4. Audit whether any existing prospective technical observer already persists enough history/state to avoid rolling-reseed ambiguity.
5. If not, keep KD/RSI outcome inference blocked until state-construction semantics are frozen.
6. Then advance to the second primary queue item: MACD vs direct trend, applying the same semantic/horizon/filter-response decomposition.
7. Formal Core remains unchanged.

## Evidence anchors

- Fidelity RSI guide: RSI measures average upward versus downward price change; strong trends may remain overbought/oversold for extended periods.
- Fidelity Fast Stochastic guide: Stochastic measures close location relative to recent High-Low range.
- Taiwan-common KD 9-3-3 formula is consistent with local academic/practitioner documentation: RSV9, K=(2/3)prevK+(1/3)RSV, D=(2/3)prevD+(1/3)K, common initial K/D=50.
- Cheng (2015), National Formosa University, Taiwan technical-indicator empirical study.
- Yang (2023), NCCU, Taiwan individual-stock technical-indicator strategy study.
- Lin et al. (2016), Pacific-Basin Finance Journal, market dynamics and Taiwan momentum.
- Chen, Hsieh & Lee (2023), Pacific-Basin Finance Journal, Taiwan momentum persistency.
