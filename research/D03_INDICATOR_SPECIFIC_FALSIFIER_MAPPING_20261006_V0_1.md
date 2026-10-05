# D03 Indicator-Specific Falsifier Mapping V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent: TI-853~888
Status: RESEARCH_ONLY / OUTCOME_CLOSED / FALSIFIER_MAPPING_FROZEN
Formal Core: LOCKED

## Purpose

Map the generic falsification oracle to actual D03 interaction families without opening economic outcomes.

## TI-889 — Bollinger location × width is a same-root path-coupled interaction

Bollinger location (%B / standardized MA distance) and band width are both deterministic descendants of the same rolling close path.

Therefore:
`BOLLINGER_COMPONENTWISE_FIELD_SHUFFLE = INVALID_PRIMARY_FALSIFIER`.

Shuffling %B while freezing width, or width while freezing %B, can create combinations inconsistent with any actual 20-session close path.

## TI-890 — Bollinger primary falsifier must preserve a valid close-path null

Admissible future primary-method classes include:
- D16-approved path-level close surrogate with exact continuity/formula recomputation; or
- dependence-aware residualized interaction inference that does not require an impossible component permutation.

No particular surrogate algorithm is pre-approved here.

Required Bollinger recomputation:
- SMA20;
- population sigma20;
- upper/lower bands;
- BBW;
- %B;
- touch/outside/re-entry states;
- squeeze/expansion states where registered.

All are recalculated from the surrogate close path.

## TI-891 — Bollinger ATR/VCP controls remain preserved nuisance structure

A falsifier for location×width must not gain artificial ease by erasing the comparator structure it is supposed to beat.

The D16 null method must preserve/model the registered controls from TI-796:
- direct return / price-vs-SMA;
- volatility/ATR/range-compression;
- VCP/pattern context;
- regime/liquidity/continuity.

If the null breaks those controls as well, it does not isolate the claimed Bollinger interaction.

## TI-892 — Bollinger squeeze labels do not receive separate null families

Touch, outside, re-entry, squeeze percentile, squeeze duration and expansion are descendants/aliases of the same center/dispersion system.

They may have distinct test statistics, but:
- search genealogy remains linked;
- the primary null family remains bound to the same parent interaction mechanism unless a genuinely distinct preregistered mechanism exists;
- no null-method reset by relabeling the state.

## TI-893 — ADX direction × range is also same-root path-coupled

+DM/-DM and TR all depend on the same H/L/C path and previous close.

Therefore:
`ADX_COMPONENTWISE_DM_TR_SHUFFLE = INVALID_PRIMARY_FALSIFIER`.

Arbitrarily pairing +DM from one history with TR from another can violate DMI geometry.

## TI-894 — ADX falsification requires full DMI/ADX recomputation from a valid path or a residualized test

Admissible future primary classes:
- D16-approved H/L/C path surrogate preserving market-mechanics constraints and continuity; or
- dependence-aware residualized interaction inference using exact DMI/ADX lineage.

Any path surrogate must recompute:
- TR;
- +DM/-DM;
- Wilder smoothed TR/DM;
- +DI/-DI;
- DX;
- ADX;
- registered slope/threshold state.

No direct shuffle of final ADX values is primary promotion evidence.

## TI-895 — ADX path null must preserve directionless-strength semantics

A negative control must not silently reinterpret high ADX as bullish.

Direction and strength remain distinct throughout observed and null pipelines.

Any directional interaction claim binds:
- exact +DI/-DI or directional path component;
- exact range/strength component;
- exact main-effect controls.

## TI-896 — ADX FULL_REPLAY requirement also applies to null descendants

If the observed ADX arm requires canonical FULL_REPLAY, the null arm cannot use:
- warm-started hidden state;
- a shorter reconstructed history;
- an incompatible initialization.

Observed/null state construction must be semantically symmetric.

## TI-897 — mixed-root price × volume has a more natural conditional-root falsifier

For PRICE_OHLC × VOLUME_TURNOVER:
- keep price/root lineage fixed;
- condition volume resampling on preregistered date/sector/regime/liquidity/price-state controls;
- resample/permute volume at a root-consistent layer;
- recompute volume-derived fields and interaction.

This aims to preserve volume's dependence on nuisance context while breaking residual price×volume coupling.

## TI-898 — price × volume conditional model must preserve market constraints

Generated/resampled volume/turnover must preserve:
- nonnegative support;
- zero-volume/suspension semantics;
- board/session identity;
- symbol liquidity scale where part of the conditioning design;
- split/corporate-action compatible units;
- source/version lineage.

Cross-symbol volume reassignment without unit/liquidity/context controls is not a valid default.

## TI-899 — price × volume conditioning cannot include the interaction's descendant

The conditioning set may include legitimate main-effect/context controls, but must not condition on:
- the target interaction itself;
- post-interaction derived acceptance state;
- future outcome-dependent labels;
- post-decision survivor states.

Otherwise the null may condition away the very relation being tested or introduce post-treatment/collider structure.

## TI-900 — nested-timeframe interactions preserve bar ancestry and clock finality

For Daily × M15 or Weekly × Daily interactions:
- do not independently permute final timeframe indicators if they share primitive bars or calendar ancestry;
- preserve timeframe finality;
- no closing-M15 imputation;
- no weekly state before week completion;
- recompute descendants from valid per-timeframe primitive inputs.

A null cannot gain access to a later-completed timeframe than the observed arm.

## TI-901 — oscillator × trend interactions remain same-price-root by default

KD/RSI/MACD/trend combinations all primarily descend from PRICE_OHLC.

A naive shuffle of one derived oscillator against another price-derived trend measure can create off-manifold combinations.

Primary falsification requires:
- a lineage-consistent price-path/null method; or
- a conditional/residualized test that respects shared price ancestry.

Formula difference does not make component permutation legal.

## TI-902 — divergence interactions are pivot-clock coupled

Price-indicator divergence depends on:
- confirmed price pivot identity;
- indicator state at the appropriate confirmed/observable clock;
- pivot-scale matching.

Permuting divergence labels destroys repaint-safe pivot lineage and is not a primary falsifier.

A valid null must recompute divergence from the surrogate/allowed primitive path with the same pivot-confirmation rules.

## TI-903 — volume root is not independent of price-state nuisance by default

For mixed-root tests, D03 explicitly rejects the simplistic null:
`shuffle(volume)`.

The relevant null is closer to:
`break residual interaction after preserving registered volume-price-context dependence`.

This is why conditional-model validity belongs to D16.

## TI-904 — indicator mapping decision

Frozen:
- Bollinger location×width -> SAME_ROOT_PATH_COUPLED;
- ADX direction×range -> SAME_ROOT_PATH_COUPLED;
- price×volume -> MIXED_ROOT_CONDITIONAL_RESAMPLING_CANDIDATE;
- nested-timeframe -> SHARED_ANCESTRY_CLOCK_COUPLED;
- oscillator×trend -> SAME_PRICE_ROOT;
- divergence -> PIVOT_CLOCK_LINEAGE_COUPLED.

No method is promoted solely by this mapping.
It identifies which falsifier classes are invalid or methodologically plausible.

No maturity change and no outcome access.

## Exact next continuation point

1. Build machine mapping and adversarial cases that reject componentwise shuffles for Bollinger/ADX and raw volume shuffle for mixed-root claims.
2. Freeze full-pipeline max/winner null replay so candidate-search advantage is mirrored under the null.
3. Add null-generator validation diagnostics for preserved-vs-broken structures.
