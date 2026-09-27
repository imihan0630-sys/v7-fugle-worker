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
