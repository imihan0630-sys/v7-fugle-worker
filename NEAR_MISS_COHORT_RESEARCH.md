# Near-Miss Cohort Research

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## NM-001 — What NEAR_MISS actually means

Current `NEAR_MISS` is not a general near-selection cohort.

A stock enters diagnostics.nearMisses only when its **first Formal rejection reason** is:
`A拉回承接/B突破後承接皆未形成候選`.

Therefore it has already passed all earlier ordered gates through sector admission.

It says nothing about:
- liquidity near misses;
- valuation near misses;
- RR near misses;
- signal-grade near misses.

Those belong to different ordered-funnel populations.

## NM-002 — nearScore is mathematically redundant

Both channels have six checks.

Current:
- `missingCount=min(failedA,failedB)`;
- `nearScore=max(6-failedA,6-failedB)`.

Therefore exactly:
`nearScore = 6 - missingCount`.

The second sort key carries zero new ordering information.

This is a research-cohort design issue, not a Formal selection bug.

## NM-003 — check-count distance is not threshold distance

Example with all other B checks passing:
- volume ratio 1.29 vs threshold 1.30;
- volume ratio 0.10 vs threshold 1.30.

Both have:
- failedBCount=1;
- missingCount=1;
- nearScore=5.

One misses by 0.01; the other by 1.20.

Thus current NEAR_MISS is Hamming distance across heterogeneous booleans, not geometric/economic closeness.

Do not infer that equal missingCount means equal setup maturity.

## NM-004 — global top-12 truncation precedes per-pool sampling

Formal diagnostics first:
1. collect setup-first-fail rows;
2. sort by missingCount / redundant nearScore;
3. keep only global first 12.

Only later does the Shadow archive:
- map those 12 symbols back to features;
- keep up to six per GENERAL / THOUSAND pool.

Therefore a pool/channel can be starved before per-pool sampling begins.

The per-pool cap does not undo the global top-12 truncation.

## NM-005 — research repair order

Do not change A/B thresholds.

First preserve prospective denominator/context:
- exact setup-first-failure count by pool;
- A/B check bitmasks;
- failed A/B counts;
- nearest channel or tie;
- raw continuous margins to the existing thresholds;
- check-pattern counts;
- sampling fraction.

If bounded storage is required:
stratify first by `pool × nearestChannel × failed-check-pattern`, then deterministic hash.

Do not invent a single normalized distance score yet.
Heterogeneous margins require preregistered scale/normalization and redundancy testing.

Machine artifact:
`research/near_miss_cohort_falsification_v0_1.json`.

## NM-006 — optimization bridge

No A/B optimization candidate exists from this finding alone.

Only after clean prospective cohort coverage may we ask:
- do one-check setup failures outperform farther setup failures?
- which exact missing check has stable opportunity cost/protection value?
- does continuous margin add information beyond check identity?
- do results survive date/regime/sector/liquidity/ATR controls?

Any A/B threshold change remains Class C.

No Formal behavior changed.


## NM-007 — raw setup-margin observer closes the Class-A observability gap

A pure Class-A observer now freezes the exact current A/B check shape without changing Formal:
`research/ab_setup_margin_observer_v0_1.mjs`.

It emits:
- A/B six-bit check masks;
- failed A/B counts;
- nearest channel or tie based only on failed-check count;
- raw margins to the current thresholds;
- separate sub-margins for OR/composite checks;
- source-semantics warnings instead of silently converting missing/zero values.

Two structural details are now explicit.

First, A volume is an OR gate:
`volumeTodayVsPrev5 <= 1.05 OR volumeContraction5to20 <= 0.95`.
A single normalized volume distance would destroy that logic, so none is introduced.

Second, under the current `buildMarketFeatures` definition
`lateStage = ret20 > 35 OR maDistance20Pct > 25`,
B additionally requires `ret20 <= 30`.
Therefore the ret20>35 arm is non-binding inside B notLate; with coherent raw features B notLate reduces to ret20<=30 plus maDistance20Pct<=25. This is a structural redundancy observation only, not threshold evidence.

The observer also exposes JavaScript truthiness edge cases:
- A uses `(toNumber(volumeTodayVsPrev5)||999)`, so exact zero becomes 999 on that arm;
- B upper-shadow uses `(toNumber(dailyUpperShadowRatio)||0)`, so a truly missing value would become zero/pass, although normal buildMarketFeatures should produce the field.

These are provenance/edge semantics to measure prospectively, not reasons to alter Formal.

The observer summary remains descriptive unless paired with a separately proven sequential setup-reached population. It must not be used to reinterpret the old bounded global top-12 NEAR_MISS as a complete denominator.

Status:
`RAW_SETUP_MARGIN_OBSERVABILITY_READY / NO_COMPOSITE_DISTANCE / COHORT_PERSISTENCE_NOT_IMPLEMENTED / FORMAL_UNCHANGED`.

Exact next:
pair the raw-margin observer with the existing channel-stage denominator observer on prospective same-scan evidence; measure coverage and check-pattern populations only after sequential setup reach is proven. Persistence of full populations remains Class B proposal-first.


## NM-008 — sequential-population bridge prevents raw-geometry denominator leakage

The raw-margin observer alone is deliberately insufficient for causal/scarcity interpretation.

New pure bridge:
`research/ab_setup_sequential_population_observer_v0_1.mjs`.

It requires agreement between:
1. the existing channel-stage sequential observer; and
2. the new A/B raw-margin observer.

Classification is fail-closed:
- `SETUP_FIRST_FAILURE`: all earlier ordered gates are clear, AB_SETUP is actually reached, and both A/B fail;
- `SETUP_PASS`: AB_SETUP is reached and passes, preserving B precedence on dual-pass rows;
- `PRE_SETUP_NOT_REACHED`: an earlier gate blocked the row even if raw A/B geometry looks close;
- `UNKNOWN`: key mismatch, observer disagreement or unresolved setup state.

Only `SETUP_FIRST_FAILURE` may enter the setup-reject denominator.

This directly prevents the old `conditionDistribution` problem from recurring: a row can have attractive A/B geometry in the broader early-admitted population while never having reached the setup gate under Formal fail-fast order.

No market call, persistence, outcome lookup or Formal integration is added.

Status:
`SEQUENTIAL_SETUP_POPULATION_CLASSIFIER_READY / RAW_GEOMETRY_LEAKAGE_FAIL_CLOSED / PERSISTENCE_STILL_CLASS_B / FORMAL_UNCHANGED`.

Exact next:
once CI is green, freeze the prospective sampling frame contract: full per-date population counts by pool × nearestChannel × checkPattern must be computed before any bounded sample; sample membership must be separate from semantic membership. Do not implement shared D1 persistence without owner approval.


## NM-009 — B candle-shape Hamming dimension is structurally redundant

Fresh algebraic falsification found that the current B `upperShadow` boolean is not an independent pass/fail dimension once `strongClose` passes.

Current feature definitions for positive daily range are:
- `dailyClosePosition=(close-low)/(high-low)`;
- `dailyUpperShadowRatio=(high-max(open,close))/(high-low)`.

Because `max(open,close)>=close`, it follows that:
`dailyUpperShadowRatio <= 1-dailyClosePosition`.

Therefore the existing B thresholds imply:
`dailyClosePosition>=0.65 => dailyUpperShadowRatio<=0.35`.

Consequences:
- coherent OHLC data can never produce `strongClose=true, upperShadow=false`;
- `upperShadow` can never be the only missing B check;
- 16 of the 64 raw six-bit B masks are structurally impossible;
- a weak close can fail both booleans and be counted as two Hamming misses even though they share one nested candle-close geometry.

This matters for research distance, not Formal behavior. The six-bit mask remains valuable as exact provenance, but failed-check count must not be treated as six independent dimensions.

A second conditional overlap was also frozen: when `chooseDailySupport` selects one of its filtered candidates, the filter `support<=close*1.015` already implies `close>=support*0.98522...`, so the structure clause `close>=support*0.985` is automatically satisfied. That clause can still bind when the function falls back to unfiltered MA20. Future research therefore needs `supportSource/fallback` provenance before treating the structure margin as independent.

Machine artifact:
`research/ab_setup_redundancy_falsification_v0_1.json`.

Status:
`B_CANDLE_DIMENSION_REDUNDANCY_CONFIRMED / HAMMING_DISTANCE_INDEPENDENCE_FALSE / A_SUPPORT_SOURCE_NEEDED / FORMAL_UNCHANGED`.

Exact next:
freeze a prospective setup sampling-frame contract that counts the complete sequential `SETUP_FIRST_FAILURE` population before sampling, keeps semantic membership separate from sample membership, and preserves exact masks/raw margins without creating a new composite distance.


## NM-010 — population-before-sample contract frozen

A pure Class-A sampling-frame helper now enforces the research order that the legacy NEAR_MISS path violated:

1. classify the complete same-date sequential population;
2. count every `SETUP_FIRST_FAILURE` by `scanDate × pool × nearestChannel × exactCheckPattern`;
3. only then apply deterministic bounded sampling inside each stratum;
4. retain sample membership as a separate overlay from semantic membership.

Files:
- `research/ab_setup_sampling_frame_v0_1.mjs`;
- `research/ab_setup_sampling_frame_spec_v0_1.json`;
- `tests/test_ab_setup_sampling_frame_v0_1.mjs`.

The helper fails promotion quality closed on duplicate parent keys, incomplete strata or incomplete parent coverage. An absent stratum is a true zero only when the complete parent frame is explicitly CLEAN; otherwise it remains UNKNOWN.

The existing six-bit masks are preserved exactly for provenance even though NM-009 proved some dimensions are dependent. No corrected/composite distance is invented here.

Status:
`POPULATION_BEFORE_SAMPLE_READY / REASON_POOL_STARVATION_BLOCKED / SEMANTIC_VS_SAMPLE_MEMBERSHIP_SEPARATED / PERSISTENCE_NOT_IMPLEMENTED / FORMAL_UNCHANGED`.

Exact next:
audit which raw A/B margins are genuinely independent enough for future outcome modeling. Preserve nested/composite groups separately, especially B candle-close geometry, A support-source/fallback state, A volume OR branches and B trend OR branches. Do not fit weights or inspect outcomes.


## NM-011 — raw-margin independence taxonomy frozen

The next research layer now separates simple thresholds from composite/dependent geometry instead of treating every failed boolean as one independent unit.

Key groups:
- A trend = multi-constraint conjunction;
- A pullback = two-sided 2–15% band;
- A volume = OR-composite with two separate margins;
- A support/structure = source-conditioned geometry, now carrying `supportSources/supportMode`;
- A notLate = ret20 and MA20-distance axes;
- B trend = conjunction plus a three-way OR branch;
- B breakout and volume = simple thresholds;
- B strongClose + upperShadow = one nested candle-close geometry for research-distance purposes, while preserving both Formal bits exactly;
- B notLate = effective ret20<=30 plus MA20-distance<=25 axes.

A support-specific structural detail is now observable: when support comes from the normal filtered-candidate path, the eligibility bound `support<=close*1.015` already implies the structure clause `close>=support*0.985`. The clause can still bind on MA20 fallback, so support source cannot be discarded.

Machine artifact:
`research/ab_setup_margin_independence_taxonomy_v0_1.json`.

Status:
`RAW_MARGIN_GROUPS_FROZEN / SUPPORT_SOURCE_PROVENANCE_READY / NO_COMPOSITE_DISTANCE / FORMAL_UNCHANGED`.

Exact next:
once CI validates this tranche, freeze the minimum prospective A/B evidence receipt needed for later D1/D3/D5/D10/D20/MFE/MAE analysis: same-generation parent completeness, setup-reach state, exact Formal masks, raw grouped margins, source warnings, sample fraction and outcome-join key. Persistence remains Class B proposal-first; do not implement shared storage without approval.
