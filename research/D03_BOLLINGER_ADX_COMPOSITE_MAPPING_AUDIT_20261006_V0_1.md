# D03 Bollinger / ADX Composite Mapping Audit V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent rules: TI-759~794
Status: RESEARCH_ONLY / OUTCOME_CLOSED / MAPPING_FROZEN
Formal Core: LOCKED

## Purpose

Audit D03-10 Bollinger and D03-09 ADX without changing formulas. The audit identifies main effects, composite/interaction representations, required baselines and fail-closed anti-stacking treatment.

## TI-795 — current registry is parent-level, not component proof

The current registry correctly marks:
- D03-09 as DIRECTIONAL_MOVEMENT_TRUE_RANGE / RG_D03_DIRECTIONAL_RANGE / PARTIAL_OVERLAP;
- D03-10 as MOVING_LOCATION_DISPERSION_ENVELOPE / RG_D03_VOLATILITY_ENVELOPE / PARTIAL_OVERLAP.

Those parent records preserve conservative deduplication. They do not prove that any child component is independently incremental.

## TI-796 — Bollinger component map

Frozen decomposition:
- center SMA20 and close-to-center location: PRICE_OHLC main-effect representation;
- rolling close dispersion / band width: PRICE_OHLC dispersion with D04 volatility-state dependency;
- normalized band position, touch/break and location×width state: composite/conditional interaction representation;
- squeeze/re-expansion lifecycle: path/state child of the same center/dispersion parents.

Required main-effect baselines:
- direct return and price-vs-SMA/MA-distance controls;
- exact SMA20 center state;
- D04 realized volatility/ATR/range-compression and applicable VCP context;
- market Regime, tick/liquidity and continuity controls.

Current disposition: all D03-10 children remain inside RG_D03_VOLATILITY_ENVELOPE with no extra effective unit.

## TI-797 — Bollinger anti-stacking rule

Center/location, width/dispersion, envelope/touch and squeeze labels may remain separately observable for diagnosis. They cannot each vote.

Future accounting:
- unproven parent/component states: at most the existing deduplicated family;
- separately proven price-location and dispersion residual families: at most two;
- one fully proven canonical location×dispersion interaction: at most +1;
- parent envelope and duplicate touch/squeeze aliases: +0.

No current receipt satisfies these future proofs.

## TI-798 — ADX component map

Frozen decomposition:
- +DM/-DM: directional-movement main-effect representation from high/low paths;
- TR/ATR denominator: range/volatility main-effect representation from high/low/close;
- +DI/-DI: direction normalized by range, therefore a direction×range composite;
- DX: nonlinear contrast of normalized directional components;
- ADX: Wilder smoothing of DX, a persistence/strength child;
- ADX threshold/crossover/slope labels: aliases/state transforms of the ADX parent.

ADX is direction-agnostic strength. High ADX is not a bullish direction vote.

## TI-799 — ADX required baselines

Required controls:
- direct return/trend, MA slope/alignment and directional price-path controls;
- D04 TR/ATR/realized-volatility and range-state controls;
- exact +DM/-DM, TR, DI, DX and Wilder-state lineage;
- market Regime, tick/liquidity, limit/suspension/corporate-action continuity;
- canonical FULL_REPLAY or replay-certified trusted state.

An ADX uplift against a price-only baseline cannot isolate a direction×range interaction if range controls are omitted.

## TI-800 — ADX anti-stacking rule

+DM/-DM direction, TR/ATR range, DI/DX composite, ADX strength and threshold/slope labels remain one conservative parent family until component-specific D16 receipts exist.

Future two-main-effect plus interaction accounting follows TI-777~794, but ADX smoothing and threshold aliases cannot create additional units beyond the canonical direction×range interaction family.

## TI-801 — shared failure states and falsifiers

Both indicators fail closed on missing component lineage, mismatched support, future-clock state, incomplete continuity, source/version drift or missing D04 controls.

Mandatory falsifiers include:
- direct-price or volatility controls absorb the effect;
- sparse joint cells or one-date/regime concentration;
- parameter/threshold search;
- sign instability across walk-forward folds;
- cost/fillability deterioration;
- limit, suspension or corporate-action contamination;
- parent + component + interaction alias inflation.

Missing evidence remains UNKNOWN.

## TI-802 — deterministic disposition

The executable fixture covers twelve positive/adversarial accounting cases and enforces:
- current Bollinger effective count <= 1;
- current ADX effective count <= 1;
- future two proven components without interaction <= 2;
- one proven canonical interaction <= 3;
- parent/alias duplication cannot exceed the cap;
- weak-baseline, missing D04, missing FULL_REPLAY and clock/support failures grant no increment.

This audit changes no formula, factor weight, threshold or Formal behavior. It proves no Alpha and authorizes no promotion.

Current:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- outcomes remain CLOSED;
- FORMAL_OPTIMIZATION_CANDIDATE = NONE;
- Formal Core remains LOCKED.

## Exact next continuation point

1. System 1 and System 2 expose componentRole, parentCompositeRef and interactionFamilyId for these mappings without changing ranking.
2. D16 future receipts use the exact Bollinger and ADX baseline/control sets above.
3. D03 next independent path is a sparse-cell/date-cluster estimability oracle for interaction receipts.
4. Protected PR #600 and genuine Bollinger/ADX session evidence remain separate owner-gated paths.

