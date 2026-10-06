# D01 DL-048 — D16 Time-at-Price / Inventory Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOMES_CLOSED

## Required separation

D16 future validation must keep separate:
- D01 structural geometry;
- bar-visit occupancy proxy;
- exact event/quote dwell time where available;
- D02 traded-volume / VWAP context;
- point-in-time participant position data where available.

## No proxy substitution

BAR_VISIT_OCCUPANCY_PROXY is not exact dwell seconds.
TRADED_VOLUME is not time occupancy.
VWAP is not participant inventory cost.
Net flow is not inventory.
Observed holding quantity is not acquisition cost.

## Future comparison

T0 structural baseline.
T1 occupancy context.
T2 traded-volume / weighted-reference context.
T3 structure + occupancy.
T4 structure + volume + occupancy.
T5 participant-inventory observable context.
T6 not evaluable.

## Common support

Control:
- bar interval / price-bin family;
- legal tick grid;
- session mechanism;
- structural age/path;
- volatility/liquidity;
- traded-volume context;
- data coverage;
- participant-data vintage.

## Multiple-testing

Bar interval and price-bin construction form a frozen research family.
No best interval / bin choice after outcomes.

## Information lineage

Possible roots:
PRICE_OHLC, TRADE_TIME, TRADED_VOLUME, QUOTE_TIME, PARTICIPANT_POSITION.

Raw-root multiplicity does not automatically create independent evidence.
Default effectiveIndependentEvidenceCount = 1 until residual contribution is validated.

SDA-001 / SDA-002 remain REMEDIATION_IN_PROGRESS.
Formal Core remains LOCKED.
