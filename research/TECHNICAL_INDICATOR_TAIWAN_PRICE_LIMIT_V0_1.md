# Technical Indicator Taiwan Price-Limit / Constrained-Session Semantics V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / MARKET-MECHANICS_CONTRACT_FROZEN
Formal Core: LOCKED

## Purpose

Define how Taiwan daily price-limit mechanics affect technical-indicator interpretation.

This is not a trading strategy.
It does not assign bullish/bearish value to limit-up/down events.

The key distinction is:

PRICE_LIMIT_REGIME_PRESENT
does not automatically mean
PRICE_DISCOVERY_CONSTRAINED.

A limit is a potential boundary.
It becomes a censoring problem when observed trading reaches/binds the boundary.

## TI-351 — Current Taiwan ordinary-stock regime

TWSE current Operating Rules Article 63:
- stock price fluctuation limit is generally 10% above/below the auction reference price at market opening;
- newly TWSE-listed common stocks, except specified transfer cases, have no price fluctuation limit for the first 5 trading days.

TPEx official materials likewise reference ordinary-stock price limits at +/-10% of the daily reference price and distinguish an initial-listing no-limit period with specified exceptions.

Therefore price-limit provenance is date/security/regime specific.

Do not hard-code:
priorClose * 1.10 / 0.90
as a universal legal boundary.

## TI-352 — Auction reference price is first-order provenance

For ordinary sessions, the legal price boundary is tied to the day's auction reference price.

For ex-right/ex-dividend or other special sessions:
- the reference price may be mechanically adjusted;
- official TWSE data products explicitly expose ex-right/ex-dividend reference price, Limit Up, Limit Down, opening reference price and auction reference price.

Therefore:
limitUp/limitDown should be consumed from an official/verified session contract where available.

Do not reconstruct special-day limits from raw prior close alone.

This is separate from TECHNICAL_CONTINUITY:
- continuity tells the technical/economic price path;
- exchange reference/limit tells the executable boundary for that session.

Both may be needed on the same day.

## TI-353 — Frozen price-limit regime states

Per symbol/session:

STANDARD_LIMIT_REGIME
- an ordinary daily price boundary applies.

NO_LIMIT_INITIAL_LISTING
- no ordinary price fluctuation limit applies under the applicable initial-listing rule.

SPECIAL_REFERENCE_LIMIT_REGIME
- a price boundary applies, but its legal reference price comes from a special event/reference-price rule.

OTHER_OFFICIAL_LIMIT_REGIME
- an officially verified nonstandard regime exists.

UNKNOWN_LIMIT_REGIME
- legal/session boundary provenance is incomplete.

These are market-mechanics states, not alpha labels.

## TI-354 — Frozen observed-boundary states

For a session with verified upper/lower limits:

NOT_TOUCHED
- High < upperLimit and Low > lowerLimit.

UPPER_TOUCHED
- High == upperLimit within official tick/rounding semantics.

LOWER_TOUCHED
- Low == lowerLimit.

CLOSE_AT_UPPER
- Close == upperLimit.

CLOSE_AT_LOWER
- Close == lowerLimit.

BOTH_BOUNDARIES_TOUCHED
- both upper and lower boundaries observed in the same session.

ONE_PRICE_AT_BOUNDARY
- O/H/L/C all equal the same verified limit price.

UNKNOWN_BOUNDARY_RELATION
- limit prices or OHLC provenance insufficient.

Important:
CLOSE_AT_UPPER is NOT equivalent to LIMIT_LOCKED.
OHLC does not reveal unfilled order-book demand.

ONE_PRICE_AT_BOUNDARY is still not sufficient to claim persistent queue lock without book/event data.

The label LIMIT_LOCKED is prohibited from daily OHLC alone.

## TI-355 — Binding/censoring interpretation

NOT_TOUCHED:
ordinary daily technical geometry is not mechanically truncated by the legal price boundary.

UPPER_TOUCHED / CLOSE_AT_UPPER:
the observed upper tail is right-censored by the exchange boundary.
The unconstrained latent clearing/high price is unknown.

LOWER_TOUCHED / CLOSE_AT_LOWER:
the observed lower tail is left-censored.

NO_LIMIT_INITIAL_LISTING:
not price-limit censored by the ordinary +/-10% mechanism, but remains a SPECIAL_SESSION because:
- distribution/price discovery can be unusually wide;
- technical history may be short;
- ordinary historical normalization may be inappropriate.

UNKNOWN_LIMIT_REGIME:
fails closed for any analysis requiring censoring status.

## TI-356 — Indicator-specific effects

### KD / range location
If High touches upper limit:
- rolling High may be censored;
- RSV/K near 100 can reflect both strong demand and the legal ceiling.

If Low touches lower limit:
- analogous lower-tail censoring.

Do not interpret 100/0 range location as unconstrained extremity without the boundary state.

### RSI
RSI uses Close changes.
Close-at-limit caps the observed daily return magnitude.
Repeated limit sessions can create saturated gain/loss imbalance while the unconstrained return path is unknowable.

RSI remains numerically valid on observed prices, but ordinary magnitude interpretation is CONSTRAINED.

### MACD
EMA/DIF/Histogram consume observed Close.
A capped staircase is a valid observed price path but not proof of the latent unconstrained trend slope.

The already-executed F12 staircase shows Histogram can later turn negative while DIF remains positive as capped step-ups stop.

### ADX/DMI
Most sensitive:
- High/Low are direct inputs;
- TR uses H/L/previous Close;
- directional movement uses High/Low progression.

Boundary touch can censor:
- TR;
- +DM/-DM;
- DI magnitude;
- ADX transition.

High ADX on repeated one-sided constrained sessions cannot be interpreted as ordinary free-price-discovery trend quality.

### Bollinger
Close dispersion is computed from the legally observed path.
Repeated capped closes may understate latent dispersion or create staircase-specific dispersion.

BBW is still correctly computed on observed closes.
Its economic interpretation is constrained.

## TI-357 — CONSTRAINED is not INVALID

A boundary-touching bar is factual market data.

Therefore:

VALID_OBSERVED + CONSTRAINED
is different from
BLOCKED / INVALID.

Keep the row.

Use it for:
- descriptive mechanics;
- separate preregistered constrained strata;
- execution/event research.

Do not silently drop it, because that would create selection bias precisely on extreme market sessions.

Do not pool it into ordinary unconstrained indicator inference without a preregistered model.

## TI-358 — No-limit initial-listing sessions require a separate state

New-listing no-limit sessions are not "better unconstrained normal data."

They differ because:
- there is no ordinary +/-10% censoring;
- recent price history may not exist;
- IPO/listing price discovery is a special regime;
- indicator warm-up may be incomplete.

Therefore:
NO_LIMIT_INITIAL_LISTING
must remain a separate context state.

No backfilled synthetic pre-listing prices may be invented to warm an indicator.

## TI-359 — Required per-bar provenance

Future continuity/technical bar should preserve:

- limitRegime;
- auctionReferencePrice;
- upperLimit;
- lowerLimit;
- limitSource;
- limitRuleVersion;
- boundaryRelation;
- highAtUpperLimit;
- lowAtLowerLimit;
- closeAtUpperLimit;
- closeAtLowerLimit;
- onePriceAtBoundary;
- priceDiscoveryState =
  UNCONSTRAINED_OBSERVED |
  CONSTRAINED_UPPER |
  CONSTRAINED_LOWER |
  CONSTRAINED_BOTH |
  NO_LIMIT_SPECIAL |
  UNKNOWN.

Tick-size/rounding semantics must come from the official session contract.
Do not compare floating values to an unrounded theoretical 10% boundary.

## TI-360 — Window-level interpretation

For an indicator lookback window, retain:
- constrainedBarCount;
- upperConstrainedCount;
- lowerConstrainedCount;
- noLimitSpecialCount;
- latestConstrainedDate;
- constrainedBarsInsidePrimaryWindow.

Suggested research interpretation:
- zero constrained bars => ordinary mechanics stratum;
- one or more constrained bars => CONSTRAINED_WINDOW;
- no-limit special listing bars => SPECIAL_LISTING_WINDOW;
- unresolved regime => UNKNOWN.

No numeric count threshold is promoted to alpha or exclusion.

## Current status

TAIWAN_PRICE_LIMIT_RULE = OFFICIAL_CURRENT_RULE_VERIFIED
PRICE_LIMIT_REGIME_SCHEMA = FROZEN_V0_1
BOUNDARY_TOUCH_CENSORING = FROZEN
LIMIT_LOCKED_FROM_DAILY_OHLC = PROHIBITED
CONSTRAINED_ROWS = RETAIN_SEPARATE_STRATUM
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Add machine-readable constrained-session contract.
2. Extend continuity handoff/snapshot proposal with official boundary-state fields.
3. Do not calculate legal special-day limits from priorClose alone.
4. Preserve boundary-touching rows rather than dropping them.
5. Prospective alpha inference remains blocked until runtime continuity + parent lineage + price-limit provenance are complete.
6. Formal Core remains unchanged.

## Official evidence anchors

- TWSE Operating Rules Article 63, current 2026 rule: ordinary stocks generally +/-10% of auction reference; qualifying newly listed common stocks no limit for first five trading days.
- TWSE TWT49U ex-right/ex-dividend reference-price product: provides reference price, Limit Up, Limit Down, opening/auction reference fields.
- TPEx official materials referencing Business Rules Article 55: ordinary stock price up/down 10% from the daily reference price; initial-listing no-limit period is explicitly treated as a separate regime.
