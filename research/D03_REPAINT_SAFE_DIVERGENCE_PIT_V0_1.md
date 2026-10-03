# D03 Repaint-Safe Divergence PIT Feasibility V0.1

Updated: 2026-10-03 Asia/Taipei  
Lane: D03-12｜指標背離／repaint-safe（防重繪）確認  
Classification: Class A（研究專用）  
Formal Core（正式核心）impact: NONE / LOCKED

## Purpose（目的）

This tranche upgrades the existing frozen divergence concept into a PIT（Point-in-Time，時點一致性）and replay-feasibility contract without inspecting outcomes.

Primary questions:

1. When does a divergence become **knowable**, not merely visible retrospectively on a chart?
2. How are price-pivot confirmation and indicator-state lineage joined without future leakage?
3. How is pivot-pair cherry-picking prevented?
4. Can the current Taiwan data/Pattern/indicator infrastructure replay the state causally?

No BUY/SELL（買進／賣出）, ranking, threshold, capital, monitoring or Formal Core behavior changes.

## TI-482 — divergence has two clocks: pivot anchor vs first observable signal

For a confirmed price pivot:

- `pivotAt` = date of the local price extreme;
- `confirmedAt` = later date when the Pattern swing rule has enough causal evidence to confirm the pivot.

A divergence may draw a retrospective line anchored at `pivotAt`, but its first legal decision-time availability is never earlier than `confirmedAt`.

For a pair of price pivots P1 then P2:

```
divergenceFirstObservableAt =
  max(
    P1.confirmedAt,
    P2.confirmedAt,
    indicatorStateAvailabilityAt(P1.pivotAt),
    indicatorStateAvailabilityAt(P2.pivotAt),
    requiredContinuityAndParentReceipts
  )
```

In ordinary causal indicator formulas, P2.confirmedAt normally dominates because the indicator value at the historical pivot is already computable from the price prefix. But provenance remains explicit.

### Synthetic witness

- L1 pivotAt D10, confirmedAt D12, price 100, RSI 30.
- L2 pivotAt D20, confirmedAt D23, price 95, RSI 36.

Geometry is classical bullish divergence:
- price lower low = -5%;
- RSI higher low = +6.

But:
- as of D22, only L1 is confirmed -> **no legal divergence exists**;
- as of D23, L1+L2 are confirmed -> divergence first becomes observable.

Therefore a backtest that timestamps the signal at D20 is look-ahead.

## TI-483 — confirmation delay is an explicit economic cost

A repaint-safe detector can still look unrealistically good if the chart anchors the signal to the pivot and ignores the move that occurred during confirmation.

Required future descriptive fields:

- `pivotAt`;
- `confirmedAt`;
- `confirmationLagEligibleBars`;
- `priceAtPivot`;
- `priceAtConfirmation`;
- `priceMovePivotToConfirmationPct`;
- `priceMovePivotToConfirmationATR` where ATR provenance is valid.

Synthetic witness:
- L2 price at pivot = 95;
- price at confirmation = 99;
- confirmation lag = 3 bars;
- move already elapsed before observability ≈ +4.2105%.

That 4.21% cannot be credited as post-signal performance.

No confirmation method is “better” without charging lag/opportunity cost.

## TI-484 — frozen primary pivot-pair selection prevents cherry-picking

The v0.1 primary detector is tightened to:

> use the **two most recent consecutive confirmed price pivots of the same type and same Pattern swing scale** that are available as of the parent timestamp.

For bullish divergence:
- two most recent consecutive confirmed lows.

For bearish divergence:
- two most recent consecutive confirmed highs.

Primary v0.1 explicitly forbids:
- skipping an inconvenient intervening confirmed pivot;
- searching all historical pivot pairs;
- choosing the pair with strongest indicator divergence;
- choosing a pair after viewing outcomes;
- independently optimizing a matching window between price and indicator pivots.

Longer/non-consecutive divergence may later exist only as a separately preregistered robustness comparator.

Hidden divergence is outside the primary v0.1 family and is not silently added.

## TI-485 — historical divergence records are immutable episodes

Future pivots may create a new current divergence relationship, but may not rewrite an earlier first-observed relationship.

Synthetic sequence:
- L1-L2 becomes bullish divergence at D23.
- Later L3 confirms at D33.
- current most-recent pair becomes L2-L3.
- the prior L1-L2 episode remains historically true as an observation first known at D23.

A new future pivot cannot:
- delete the old episode;
- change its firstObservableAt;
- relabel its indicator values using a later formula version;
- backfill a later continuity correction into the original decision state.

Recommended identity:

```
symbol
+ semanticSpaceId
+ patternSwingSpecVersion
+ swingScale
+ pivot1Id/version
+ pivot2Id/version
+ indicatorFamily
+ indicatorFormulaVersion
+ indicatorStateLineageId
+ initialFirstObservableAt
```

Observation snapshots may append later context, but the episode identity is immutable.

## TI-486 — indicator sampling at pivotAt is causal only with lineage

The primary spec samples the indicator value on each **price pivot date**, not at a later indicator-selected extremum.

This reduces hidden degrees of freedom but creates a lineage requirement.

For recursive indicators (RSI/KD/MACD state):
- the value at pivotAt must come from canonical replay or a trusted prior state;
- formulaVersion must remain fixed within the episode;
- technical price continuity must be valid for the relevant history;
- later corrections discovered after the original parent cutoff do not mutate the old state.

If the underlying source/history lineage changes for a later decision timestamp:
- preserve the old first-observed episode;
- create a new versioned observation for the later timestamp;
- do not rewrite history.

## TI-487 — Pattern and indicator evidence are one interaction, not two votes

Divergence consumes:
- Pattern-owned price pivot geometry;
- D03-owned indicator progression.

It belongs to an interaction layer.

Therefore these cannot be counted as independent evidence simultaneously without explicit interaction accounting:

```
price lower-low
+ RSI bullish divergence
+ "Pattern pivot confirmation"
```

The first and third are already structural inputs to the divergence object.

Likewise:
- RSI divergence + KD divergence on the same price pivots are not two independent votes by default;
- MACD divergence remains price-filter-family evidence and requires normalized magnitude for cross-sectional comparison.

Future incremental tests must control:
- raw price swing progression;
- ret5/10/20;
- MA slope / persistence;
- support/resistance / reversal lifecycle;
- volatility;
- Price-Volume acceptance/rejection.

## TI-488 — constrained and special sessions must not be silently ordinary

A mathematically valid divergence may still be interpretation-blocked when:
- pivot belongs to a price-limit-constrained session;
- session is suspended/no-trade or pseudo-bar contaminated;
- corporate-action continuity is unresolved;
- indicator warm-up/lineage is unresolved;
- Pattern pivot provenance is incomplete.

State taxonomy:

- `VALID_OBSERVABLE`;
- `VALID_BUT_CONSTRAINED`;
- `WARMUP_INCOMPLETE`;
- `DATA_BLOCKED`;
- `UNKNOWN_PROVENANCE`.

Only explicit preregistered strata may be analyzed together. UNKNOWN never becomes false/no-divergence.

## TI-489 — Taiwan PIT feasibility is now validated

D03-12 can reuse two already-validated causal layers.

### Pattern side

The Pattern lane already provides:
- repaint-safe confirmed swings;
- `pivotAt` and `confirmedAt`;
- prefix/replay tests;
- ATR-frozen MICRO/BASE/MAJOR scale semantics;
- RAW_EXECUTION / TECHNICAL_CONTINUITY provenance firewall;
- immutable parent identity and conflict detection.

### Indicator side

D03 already provides:
- frozen KD/RSI/MACD formula versions;
- isolated deterministic replay/prefix invariance;
- Taiwan daily OHLC source feasibility;
- indicator snapshot parent identity;
- formula/state-lineage and continuity guards.

### Join

A divergence observation can therefore be constructed without a new market-data family by joining:
- one immutable Pattern confirmed-swing receipt;
- indicator value lineage at the two pivot dates;
- exact parent/asOf/capture generation;
- continuity/session/constraint provenance.

Required fields:

```
parentDecisionReceiptId
captureGeneration
asOf
symbol
semanticSpaceId
patternSwingSpecVersion
pivot1Id / pivot1At / pivot1ConfirmedAt
pivot2Id / pivot2At / pivot2ConfirmedAt
swingScale
indicatorFamily
indicatorFormulaVersion
indicatorStateLineageId
indicatorValue1 / indicatorValue2
priceProgressionPct
indicatorProgression
confirmationLagEligibleBars
priceMovePivotToConfirmationPct
constraintState
dataQualityState
divergenceEpisodeKey
```

Historical Shadow divergence rows must not be fabricated.

This validates Taiwan PIT data feasibility, not predictive value.

## TI-490 — maturity decision

D03-12 advances:

- L2 / 40% / MECHANISM_AND_FALSIFICATION_DEFINED

to:

- **L3 / 60% / TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED**

because:
- repaint-safe pivot/confirmation semantics are frozen;
- primary pair selection is deterministic and non-cherry-picked;
- availability time is explicitly separated from pivot anchor time;
- confirmation delay/opportunity cost is recorded;
- Pattern and indicator lineages are already technically joinable under existing PIT source contracts;
- future pivots cannot repaint historical episode identity;
- historical backfill remains prohibited.

This promotion does NOT claim:
- bullish/bearish predictive authority;
- RSI/KD/MACD divergence alpha;
- OOS / Prospective Shadow evidence;
- optimal pivot scale;
- optimal divergence threshold;
- Formal eligibility.

With the current 12-module D03 curriculum:
- prior aggregate = 50.0%;
- D03-12 +20 maturity points;
- new aggregate = **51.7%**.

## Deterministic executable evidence

File:
`research/test_d03_repaint_safe_divergence_pit_v0_1.mjs`

Fixture assertions:
1. D22 cannot observe the L1-L2 divergence because L2 is not confirmed.
2. D23 is the first legal observation.
3. The bullish geometry is -5% price progression / +6 indicator progression.
4. The 3-bar confirmation lag and +4.2105% elapsed move are explicitly charged.
5. A later L3 creates a new L2-L3 current pair but cannot mutate the old L1-L2 historical episode.
6. pair selection uses consecutive same-scale confirmed pivots only.

Equivalent in-session deterministic evaluation: PASS.
Repository CI execution: NOT_TRIGGERED / UNKNOWN until explicitly run.

## Status

`D03_12 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`

`DIVERGENCE_SIGNAL_CLOCK = CONFIRMED_AT_NOT_PIVOT_AT`

`PRIMARY_PAIRING = CONSECUTIVE_SAME_SCALE_CONFIRMED_PRICE_PIVOTS`

`HISTORICAL_EPISODE_REPAINT = FORBIDDEN`

`CONFIRMATION_LAG_COST = REQUIRED`

`PATTERN_PLUS_DIVERGENCE_DOUBLE_COUNT = FORBIDDEN_WITHOUT_INTERACTION_ACCOUNTING`

`OUTCOME_INFERENCE = NO_GO`

`D03_MATURITY = 51.7_PERCENT`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

## Exact next continuation point

1. Raw-byte source/version gate remains 2/3; weekend cannot add an independent completed Taiwan session.
2. Freeze a research-only divergence snapshot/episode machine-readable contract implementing the fields above; no runtime/production wiring.
3. First future divergence efficacy comparison must be regular bullish/bearish divergence only, one pivot scale preregistered at a time, against raw price progression + Pattern reversal controls.
4. Charge confirmation lag and zero-signal coverage; do not score retrospective pivot-to-confirmation movement as alpha.
5. TI-005 KD-vs-RSI and TI-006 MACD-vs-direct-trend still precede divergence outcome inference once the primary source gate genuinely opens.
6. Continue D03-13 multi-timeframe PIT feasibility after the divergence contract is frozen; no theory-only promotion.
