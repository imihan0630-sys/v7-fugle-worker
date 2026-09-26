# Pattern Volume Semantic Firewall v0.1

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / SOURCE_SEMANTICS_FROZEN
Formal Core: LOCKED

## Purpose

Prevent Pattern/VCP/Platform volume features from silently mixing:
- raw lot counts;
- exact executed share counts;
- corporate-action-adjusted price series;
- raw share-volume series;
- denominator-normalized turnover.

Price continuity and volume continuity are separate semantic problems.

## Real Fugle source witness

### FCNT000002
Research audit confirms:
- OHLC = raw quoted/traded candidate fields;
- volume = lots, not exact shares;
- odd-lot/sub-lot shares are not recoverable by blind volumeLots * 1000.

Selected same-session comparisons against FCNT000154 exact share volume:

- 8454 2025-08-25:
  - FCNT000002 volumeLots = 122
  - FCNT000154 volumeShares = 122,810
  - 122 * 1000 misses 810 shares
  - relative omission about 0.660% of exact share volume

- 8454 2025-08-18:
  - 188 lots vs 188,234 shares
  - 234-share remainder
  - relative omission about 0.124%

- 5314 2025-03-19:
  - 214 lots vs 214,223 shares
  - 223-share remainder
  - relative omission about 0.104%

- 2412 2026-07-08:
  - 25,356 lots vs 25,356,630 shares
  - 630-share remainder
  - relative omission about 0.0025%

Conclusion:
Lot truncation/rounding is usually small in high-volume names but can be materially larger in low-volume names, exactly where Pattern tight-base / dead-liquidity diagnostics are most sensitive.

Therefore:
FCNT000002.volume is RAW_LOT_VOLUME, not RAW_SHARE_VOLUME.

## FCNT000154 mixed semantic witness

Connected FCNT000154 currently returns:
- adjusted=true even when adjusted=false is requested;
- adjusted/back-adjusted OHLC;
- volume in exact shares.

This is a mixed semantic payload, not one homogeneous "adjusted bar."

### 5314 2025-03-19 -> 2025-03-31 witness

Raw FCNT000002:
- 2025-03-19 close 1390, volume 214 lots
- verified par-value/unit reset and suspension
- 2025-03-31 raw open 69, high 76.4, close 75.8, volume 5,538 lots

FCNT000154 adjusted output:
- 2025-03-19 close 16.66, volume 214,223 shares
- 2025-03-31 open 16.54, high 18.31, close 18.17, volume 5,538,778 shares

The adjusted historical price scale is therefore not the contemporaneous raw quote scale.
Volume remains an exact executed-share count rather than being multiplied/divided to mimic the adjusted-price factor.

This means:
- adjusted price morphology may be usable for scale-invariant geometry if point-in-time/vintage rules are satisfied;
- absolute price/tick/round-number/price-limit features cannot use the adjusted price as if it were the then-traded nominal quote;
- raw share-volume ratios across a UNIT_SCALE event still require explicit share-unit comparability;
- an adjusted-price series does not automatically solve volume continuity.

## Future-vintage / replay hazard

A provider's current back-adjusted historical price can incorporate actions that occurred after an old as-of date.

Even if a future corporate action applies a uniform multiplicative factor to an entire old prefix and therefore preserves some ratio-based geometry, the absolute historical values and payload hashes can change across source vintages.

Consequences:
- current back-adjusted history is not automatically a point-in-time immutable historical snapshot;
- old replay must preserve source vintage / payload hash;
- absolute tick/round/price-limit logic must use contemporaneous RAW_EXECUTION semantics;
- Pattern must never infer that replay exactness is proven merely because today's adjusted series is internally smooth.

## Frozen volume semantic spaces

Reuse Corporate Actions lane semantics:

### RAW_LOT_VOLUME
- factual source lot count;
- may omit odd-lot/sub-lot residual shares;
- unsuitable for claims of exact executed-share volume.

### RAW_SHARE_VOLUME
- exact executed share count when source contract is verified;
- preserves factual activity;
- UNIT_SCALE comparability still requires explicit share-unit semantics.

### REGISTERED_ISSUED_SHARE_TURNOVER
- share volume / point-in-time registered issued shares.

### EXCHANGE_LISTED_SHARE_TURNOVER
- share volume / point-in-time exchange-listed common shares.

### FREE_FLOAT_TURNOVER
- separate denominator and separate research question.

Do not merge these spaces into one generic "volume."

## Pattern feature implications

### Swing / pure price topology
Does not require volume semantics.

### W / Cup pure geometry
May be computed from verified TECHNICAL_CONTINUITY price geometry without volume.

### VCP / compression maturity
Volume fields are optional evidence only when the requested volume semantic space is ready.

If volume semantics are not ready:
- geometry can remain VALID;
- volumeContext = UNKNOWN;
- full volume-confirmed maturity must not be asserted.

### Platform / Flag volume contraction
Same rule:
price geometry can remain valid while volume confirmation is UNKNOWN.

### Dead-liquidity tight-base diagnostic
Must preserve:
- price range;
- range in ticks;
- exact volume semantic space;
- source precision.

A low lot count from FCNT000002 cannot be silently relabeled exact shares.

## Research-only readiness fields

A future source envelope should preserve at minimum:
- volumeSemanticSpace;
- volumeRawUnit;
- volumePrecisionClass;
- shareUnitComparable;
- rawShareVolumeReady;
- denominatorType if normalized;
- denominatorKnownAt;
- supplyBreakPresent;
- unitScaleBreakPresent;
- sourceId;
- payloadHash.

Suggested precision classes:
- EXACT_SHARES
- LOT_COUNT_WITH_UNKNOWN_SUBLOT_REMAINDER
- UNKNOWN

Missing = UNKNOWN, never inferred exact.

## Negative validation

Before any volume-dependent Pattern result:
1. compare exact-share source vs lot source on common support;
2. report lot-remainder error distribution by liquidity bucket;
3. separately test UNIT_SCALE and SUPPLY_CHANGE windows;
4. control existing Formal/PV volume variables;
5. do not choose the volume space that gives the best forward return.

If Pattern geometry works only under one retrospectively selected volume normalization:
OVERFIT / FAIL.

## Governance

This specification does not change Formal raw-volume rules.
It does not say current Formal volume is wrong.

It says Pattern research must be explicit about what "volume" means before claiming an incremental Pattern effect.

No Worker.js wiring.
No runtime migration.
No Formal A/B/ranking/threshold change.
No R09.
