# Market-Cap Admission Research

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## MCAP-001 — Current Formal floor

Current Formal rejects:
`marketCapYi < 10 -> 市值低於10億 / basePassed=false`.

At 10–30bn it immediately applies an additional special-reason gate:
- avgVolume20Lots >=1.5*price-tier minLots;
- institutionalScore >=70.

Thus 10bn is a hard boundary, not a continuous risk adjustment.

## MCAP-002 — Literature does not justify either automatic inclusion or automatic exclusion

Taiwan evidence is two-sided.

A 2026 Pacific-Basin Finance Journal study reports that Taiwan's size premium is time-varying and that illiquidity plus limit-hit/limits-to-arbitrage explain important variation in the size effect.

A 2023 Jegadeesh-Titman momentum review reports that Taiwan momentum is detectable when small-cap and low-priced stocks are excluded.

Taiwan OTC liquidity research also reports stronger common-liquidity sensitivity among small firms.

Research implication:
the right question is not “small stocks have higher returns.”
It is whether **market capitalization itself** adds incremental path/execution risk after direct liquidity, price-limit, volatility and information-quality controls.

## MCAP-003 — structural discontinuity

Fixed outcome-free witness:
- candidate A marketCapYi=9.99 -> rejected immediately;
- identical candidate B marketCapYi=10.00, assuming it satisfies the 10–30bn 1.5x-volume + institutionalScore>=70 special rule -> may proceed.

This proves a hard threshold discontinuity.
It does not prove harm.

## MCAP-004 — current Shadow is insufficient for threshold-distance research

REJECTED_AFTER_BASE cannot contain this gate because it returns basePassed=false.

BROAD_CONTROL can incidentally sample <10bn names if they satisfy:
- >=60-day history;
- price>=10;
- primary minLots.

But:
- sample is capped at six per price pool;
- it is not market-cap stratified;
- current research snapshot does not serialize marketCapYi or market-cap source/basis.

Therefore existing rows may reveal some `市值低於10億` exclusions but cannot estimate:
- prevalence;
- distance to the 10bn threshold;
- a continuous size-risk relation;
- explicit market-cap versus sharesOutstanding*close-derived provenance.

## MCAP-005 — history coverage correction

The ad-hoc `chooseHistoryWarmupTargets()` path requires marketCapYi>=10.
However the main `runHistorySeed()/buildHistorySeedQueue()` full-history seed does not impose a market-cap floor and can populate histories for sub-10bn names.

Therefore:
`SUB10BN_HISTORY = NOT_ASSUMED_ABSENT`.

Do not confuse the ad-hoc warmup filter with the main history seed.

## MCAP-006 — prospective falsification

Machine spec:
`research/market_cap_floor_falsification_v0_1.json`.

First evidence must preserve exact current marketCapYi and provenance.

Primary matched comparison:
liquid/executable <10bn names versus 10–30bn names on common support for:
- price/liquidity;
- sector/date/regime;
- ATR;
- ret20/ret60/Residual RS;
- institutional context;
- fundamental/valuation availability;
- exact limit-hit/extreme-move state where available.

Outcomes:
D1/D3/D5/D10/D20, MFE/MAE, no-follow-through, later A/B setup incidence, execution-cost/liquidity.

Do not threshold-sweep alternative market caps.

## MCAP-007 — optimization bridge

Current:
`NOT_FORMAL_OPTIMIZATION_CANDIDATE`.

Potential future:
`MARKET_CAP_ADMISSION_REFORMULATION`.

Promotion requires evidence that:
- liquid sub-10bn names retain stable OOS opportunity after direct liquidity/limit/cost controls;
- size itself adds little residual downside;
- admitting them does not worsen MAE, execution, no-follow-through or zero-pick/capital behavior.

If small size remains independently hazardous or apparent premium is confined to illiquid/high-limit-hit names, retain the floor.

No Formal change.
