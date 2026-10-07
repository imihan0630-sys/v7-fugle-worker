# D01 DL-099 — First-Wave Common-Parent Comparator Registry V0.1

Updated: 2026-10-07 Asia/Taipei
Status: PREREGISTERED_COMPARATOR_REGISTRY / OUTCOME_JOIN_CLOSED / FORMAL_CORE_LOCKED

## Purpose

Freeze what every first-wave named pattern must beat before D01 may claim incremental predictive value.

Classification accuracy is not predictive alpha.
A visually recognizable named pattern is not an independent signal unless it adds value over its own continuous parent geometry.

## Comparator registry

### D01-02 single-candle morphology

Child:
named candlestick alias family.

Common parent:
continuous one-bar normalized OHLC geometry:
- signed body/range;
- absolute body/range;
- upper/lower wick ratios;
- close location;
- raw range/reference relation.

Incremental claim allowed only if the alias/threshold representation improves preregistered OOS evidence over the continuous parent under the identical universe, fold, horizon and costs.

### D01-03 multi-candle combinations

Child:
named N-bar candlestick sequence.

Common parent:
the same ordered N-bar normalized OHLC/inter-bar geometry without the name.

Named sequence and parent must share:
- exact sourceBarIds;
- predictor freeze;
- session/source-history hashes;
- OOS fold;
- outcome horizon.

### D01-07 cup/base/handle

Child:
cup/base/handle label/lifecycle subtype.

Common parents:
- prior-trend geometry;
- range-compression geometry;
- generic breakout geometry.

The named shape must demonstrate residual value beyond these simpler parents.
Changing base/handle thresholds after seeing returns creates a new experiment and invalidates the frozen comparison.

### D01-09 gap / price-limit patterns

Child:
named gap subtype / price-limit-constrained pattern.

Common parents:
- raw opening gap magnitude;
- raw opening position relative to legal reference/limits;
- explicit market/event/mechanical context.

Corporate-action, suspension and legal price-limit states are controls, not optional decorations.

## Pairing requirements

Parent and child comparisons must have identical:
- point-in-time universe;
- symbol/date witness identity;
- exact session/source-history identity;
- predictor cutoff;
- censoring policy;
- 1/5/20 eligible-session outcome families;
- transaction-cost treatment;
- walk-forward fold;
- final holdout rule.

No parent/child comparison may use different survivor universes or different blocked-row policies.

## Search accounting

Every new:
- label threshold;
- geometry cutoff;
- lookback;
- scale selection;
- pattern subtype;
- aggregation weight;
- interaction;
- handle/base resize rule

is a new experiment unless it is only a numerical tolerance.

All attempts enter the D16 search registry before final holdout.

## External evidence synthesis

Recent and older technical-analysis literature is mixed:
- some candlestick/ML studies report predictive or trading value;
- large technical-rule families show strong data-snooping risk and require family-level correction;
- transaction costs can erase apparent rule profitability;
- newer controlled chart-image work reports that explicit candlestick pattern labels can add little beyond raw chart information.

Therefore the D01 scientific default is:
NAMED_PATTERN_INCREMENTALITY = UNKNOWN
until the child beats the frozen common parent OOS.

## Current decision

COMMON_PARENT_REGISTRY_FROZEN = TRUE.
CLASSIFICATION_ACCURACY_EQUALS_ALPHA = FALSE.
NAMED_LABEL_EQUALS_INDEPENDENT_SIGNAL = FALSE.
NO_WINNER_ALLOWED = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
