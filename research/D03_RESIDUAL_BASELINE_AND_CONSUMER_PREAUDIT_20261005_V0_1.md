# D03 Residual Baseline and Consumer Pre-Audit V0.1

Updated: 2026-10-05 Asia/Taipei
Room: 03｜技術指標與趨勢動能研究室
Classification: Class A research / Shadow-only semantic pre-audit
Tickets: SDA-001, SDA-004
Formal Core impact: NONE / LOCKED
Outcome access: CLOSED

## Purpose

This artifact extends the frozen D03 lineage contract without changing any representation family, parameter family, Formal rule or maturity. Its job is to define the strongest same-root baselines and anti-stacking conditions that downstream System 1/System 2 consumers and D16 must respect.

The central falsification rule is stronger than simple correlation control:

> A D03 transform may show residual predictive value and still remain inside the same effective evidence family. Residual value does not automatically create a second independent vote.

Any split of an existing redundancy group requires a separately versioned research decision, D16 common-support/OOS evidence, and 00 cross-domain closure. Engineering must not infer a group split from a positive coefficient, lower-than-one correlation, or a local backtest.

## TI-709 — consumer reachability pre-audit

At observed main `5d0cb81bf85e8a10ffdbdde29545aef97802b0eb`, GitHub code search for the exact registry filename `d03_indicator_lineage_registry_20261005_v0_1` returned zero indexed consumer references.

Interpretation:
- this is evidence that downstream consumption is not yet demonstrated;
- it is not proof that no unindexed, generated or external consumer exists;
- therefore the current safe state is `NO_INDEXED_CONSUMER_REFERENCE_OBSERVED`, not `NO_CONSUMER_EXISTS`;
- until a deterministic implementation receipt exists, raw-vs-deduplicated Shadow behavior remains unverified.

This preserves fail-closed semantics for SDA-001/SDA-004.

## TI-710 — strongest-baseline matrix

| Lane | Candidate residual information | Mandatory strongest baseline / parent controls | Effective evidence rule |
|---|---|---|---|
| D03-01 MA alignment/slope | weighted trend geometry | D03-02 ret5/20/60, direct price-vs-MA geometry, D01 breakout/pattern controls | stays inside `RG_D03_PRICE_TREND` unless separately reclassified |
| D03-02 ret5/20/60 | endpoint return by horizon | same-horizon aliases, adjacent return horizons, market/sector exposure where tested | ret5/20/60 are one direct-return family; aliases never add votes |
| D03-03 path persistence | path consistency beyond endpoint return | D03-02, path efficiency, zero-return ratio, tick/liquidity state, volatility/Regime | one persistence residual candidate; zero-return/tick effects are confounders |
| D03-04 continuation | post-decision relation | frozen parent state before D5/D10/D20 and exact future outcome clock | never a contemporaneous selector vote |
| D03-05 pullback/reversal | episode path/confirmation geometry | D01 price geometry, D03-01 trend state, D02 participation only if actually consumed | one episode state; causal origin remains optional/UNKNOWN |
| D03-06 KD | rolling H/L/C range location | D03-07 RSI, D03-02 returns, range/volatility, D01 price geometry | oscillator-family candidate only |
| D03-07 RSI | signed gain/loss balance | D03-06 KD, D03-02 returns, trend/range state | oscillator-family candidate only |
| D03-08 MACD | EMA-spread transition geometry | D03-01 EMA/MA slope-alignment, D03-02 returns, D03-03 persistence | stays inside `RG_D03_PRICE_TREND` absent explicit split evidence |
| D03-09 ADX | H/L/C directional-range trend quality | direct returns/trend, D04 volatility/ATR/TR state, tick/liquidity and Regime | directional-range residual candidate; no high-ADX bullish assumption |
| D03-10 Bollinger | location and dispersion interaction | position component vs MA-distance/close location; width component vs D04 volatility/ATR/range compression/VCP | position + width may be decomposed for inference but together contribute at most one family vote |
| D03-12 divergence | relation between confirmed price pivot and base-indicator state | confirmed price-pivot/reversal episode + exact base-indicator version/level/slope | child-parent co-voting forbidden |
| D03-13 multi-timeframe conflict | interaction across nested horizons | Weekly/Daily/M15 component states, exact finality/coverage clocks | one conflict/interacting state; never one vote per timeframe |

## TI-711 — residual success does not auto-split a redundancy group

A common false inference is:

1. indicator A adds value after a simple return control;
2. indicator B adds value after the same simple return control;
3. therefore A and B are independent confirmations.

This is invalid. A and B can both contain overlapping residual information that the simple baseline omitted.

D03 therefore freezes the stronger rule:
- candidate-versus-baseline success upgrades only that candidate's residual-evidence state;
- it does not change `redundancyGroupId`;
- a group split requires direct candidate-versus-sibling tests on common support, shared-parent controls, multiplicity correction, OOS/prospective evidence, D16 readback and 00 closure;
- until then, downstream scoring may report both raw signals but the effective evidence count must remain deduplicated at the existing group level.

## TI-712 — oscillator bilateral-control rule

KD and RSI are not algebraic aliases, but one-sided tests are insufficient.

Required order:
1. KD versus direct return/trend/range controls;
2. RSI versus the same controls;
3. KD conditional on RSI plus the shared controls;
4. RSI conditional on KD plus the shared controls;
5. compare stability across independent dates/Regimes with one preregistered oscillator-family budget.

If only steps 1-2 pass, `RG_D03_OSCILLATOR` remains one effective evidence family. No two-vote oscillator confirmation is allowed.

## TI-713 — child-parent anti-stacking rule

Derived relation features cannot vote independently alongside all parents by default.

Primary examples:
- divergence = confirmed price pivot + base indicator;
- multi-timeframe conflict = nested timeframe component states;
- Bollinger envelope = moving center + dispersion;
- pullback confirmation = trend/price episode plus confirmation clock.

A child can be studied for residual interaction value, but raw parent votes plus child vote must be deduplicated unless a versioned closure decision explicitly establishes incremental independence.

## TI-714 — component decomposition is for falsification, not vote multiplication

Bollinger and ADX contain multiple interpretable components. Component decomposition is required to identify what creates any residual effect, but the decomposition must not multiply evidence count.

Bollinger:
- position/location channel must be compared with MA distance and close-location geometry;
- width/dispersion channel must be compared with realized volatility, ATR/range and VCP/compression;
- a combined envelope effect, if real, remains one `RG_D03_VOLATILITY_ENVELOPE` family contribution unless reclassified after closure.

ADX:
- directional movement and true range must be separated during diagnosis;
- high ADX is directionless;
- any apparent residual effect must survive direct trend plus D04 volatility/range controls before it can be called trend-quality incrementality.

## TI-715 — parameter-family budget handoff guard

The frozen D03 parameter ledger already requires every changed window, smoother, seed, warm-up, price field or threshold to remain inside its original `parameterFamilyId`.

Additional handoff rule:
- downstream consumers must never choose a production-facing parameter because it looks best in the same evidence set used to compare families;
- rejected/failed parameterizations remain counted in the experiment-family history;
- renaming, sign inversion, percentile conversion, normalization or timeframe restatement does not reset the budget;
- D16 owns the formal multiplicity method and holdout accounting.

## TI-716 — maturity and routing decision

This pre-audit closes no ticket and promotes no module.

Current:
- D03 = 56.7%;
- D03-09 ADX = L2 / 40%;
- D03-10 Bollinger = L2 / 40%;
- raw receipt gate = 2/3;
- outcome joins = CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- SDA-001 / SDA-004 remain `REMEDIATION_IN_PROGRESS`.

Exact next:
1. System 1/System 2 must consume the canonical registry and expose raw-vs-deduplicated Shadow diagnostics with deterministic duplicate/alias tests.
2. D03 reviews consumer mapping drift and rejects any mapping that turns sibling/child/nested-timeframe representations into extra effective evidence without closure.
3. D16 preregisters the parameter-family experiment budget and executes common-support sibling/residual/OOS tests.
4. Protected Production path remains owner-gated at PR #600. No merge/deploy is authorized by this artifact.
5. After an approved deploy, Bollinger remains first post-deploy promotion target; ADX remains second and still requires canonical FULL_REPLAY.
