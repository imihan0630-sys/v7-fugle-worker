# D01 DL-048 — Transaction-Weighted Reference vs Time-at-Price / Dwell-Time and Participant Inventory V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / OCCUPANCY_FLOW_INVENTORY_FIREWALL / FORMAL_CORE_LOCKED

## Purpose

DL-047 separated VWAP-style transaction-weighted reference prices from live order-book liquidity.

DL-048 separates three additional concepts:
1. time-at-price / price occupancy;
2. traded-volume / transaction-weighted reference;
3. actual participant inventory / ownership cost.

They may correlate but are not interchangeable.

## Evidence boundary

Microstructure research models trade duration and trading volume as separate state variables. Time between trades, trading intensity and volume can carry different information.

Therefore:
TIME_AT_PRICE != TRADED_VOLUME.
TIME_AT_PRICE != VWAP.
VWAP != PARTICIPANT_INVENTORY_COST.

Direct evidence that a TPO / Market-Profile style time histogram is an independent support/resistance alpha is limited. D01 treats it as PRICE_OCCUPANCY_CONTEXT, not proven memory.

## Occupancy family

O0 BAR_VISIT_OCCUPANCY_PROXY

For each completed bar and price bin:
visited = barHigh >= binLower && barLow <= binUpper.

One completed bar contributes at most one visit per intersected bin.

This is a discretized visit proxy.
It does NOT mean price spent the whole bar duration at every crossed bin.

O1 TRADE_EVENT_OCCUPANCY

Requires timestamped transaction sequence and a frozen rule for how state persists between trades.

O2 QUOTE_MID_DWELL_TIME

Requires timestamped quote/mid-price sequence and a frozen state-duration rule.

O1/O2 are unavailable unless owner-quality event data exist.

## Candle/TPO overclaim firewall

From OHLC bars, D01 may compute:
- visitedBarCount;
- eligibleBarCount;
- visitedBarShare;
- consecutiveVisitedBars;
- firstVisitedAt;
- lastVisitedAt.

D01 may NOT claim:
- exact seconds at price;
- exact dwell duration;
- trade count at price;
- queue time;
- participant attention duration.

Wide-range bars can intersect many bins despite brief traversal.

Therefore BAR_VISIT_OCCUPANCY_PROXY is not exact TPO dwell time.

## Bin and interval family

Occupancy depends on:
- bar interval;
- price-bin width;
- legal tick grid;
- semantic price space;
- session mechanism.

No post-outcome choice of:
- 1m vs 5m vs 15m;
- bin width;
- tick grouping;
- session segment;
- smoothing.

Any evaluated family must be frozen before outcomes and preserved as one parameter/search family.

## Point-in-time clock

Only completed bars / completed event intervals available by predictorFreezeAt may enter occupancy.

Partial current bars require a separate snapshot identity.

Future bar high/low cannot backfill prior occupancy.

Corporate-action continuity and historical tick rules remain mandatory.

## Time vs volume matrix

D01 preserves continuous time/volume descriptors and may later derive preregistered strata.

Conceptual states:
- high occupancy / high volume;
- high occupancy / low volume;
- low occupancy / high volume;
- low occupancy / low volume.

No hard threshold is frozen in v0.1.

This matrix is intended to distinguish:
- time acceptance;
- trading intensity;
- rapid high-volume traversal;
- slow low-volume stagnation.

## Intensity descriptors

Where legal:
- executedVolumeInZone;
- visitedBarCount;
- visitedBarShare;
- volumePerVisitedBar;
- executedValuePerVisitedBar;
- tradeCountPerOccupiedTime if exact trade-count data exist;
- medianIntertradeDuration if exact event data exist.

Missing exact event data remain UNKNOWN.

Do not infer trade intensity from candle count alone.

## VWAP relation

VWAP is a transaction-weighted mean.
Occupancy is a time/visit distribution.

A price area can have:
- long occupancy but low executed volume;
- short occupancy but very high executed volume;
- VWAP inside a zone without high occupancy;
- high occupancy around a zone while VWAP lies elsewhere.

Therefore occupancy, VWAP and volume profile remain separate context families.

## Participant inventory boundary

Actual participant inventory requires point-in-time ownership/position observables.

Examples of potentially relevant but distinct owner data:
- disclosed institutional holdings;
- insider holdings;
- broker/participant position records where legally available;
- securities lending / short balances;
- fund holdings vintages.

Net flow is not inventory.
Turnover is not inventory.
VWAP is not inventory.
Volume-at-price is not inventory.

If participant inventory data are unavailable:
PARTICIPANT_INVENTORY_STATE = UNKNOWN.

## Inventory cost boundary

Even if point-in-time holdings exist, exact acquisition cost is not implied unless the source directly reports it or a causal transaction ledger reconstructs it.

Therefore:
HOLDING_QUANTITY != COST_BASIS.
NET_BUY_FLOW != COST_BASIS.
INSTITUTIONAL_HOLDING != INSTITUTIONAL_BREAKEVEN.

Behavioral claims remain outside D01 unless separate owner evidence exists.

## Information lineage

Possible raw roots:
- PRICE_OHLC for bar-visit occupancy;
- TRADE_TIME for event-duration occupancy;
- TRADED_VOLUME for volume/VWAP;
- QUOTE_TIME for quote dwell;
- PARTICIPANT_POSITION for actual inventory where available.

These are different primitives but may be causally dependent.

Default:
independentVoteAllowed=false;
effectiveIndependentEvidenceCount=1;
residualIncrementalityStatus=NOT_VALIDATED.

## Comparison classes

T0 STRUCTURAL_ONLY
T1 OCCUPANCY_NONSTRUCTURAL
T2 VOLUME_REFERENCE_NONSTRUCTURAL
T3 STRUCTURE_OCCUPANCY_COINCIDENT
T4 STRUCTURE_VOLUME_OCCUPANCY_COINCIDENT
T5 INVENTORY_OBSERVABLE_CONTEXT
T6 CONTEXT_NOT_EVALUABLE

Context class is not alpha.

## Future D16 questions

Q1 Does structural history add beyond occupancy/time-at-price?
Q2 Does volume/VWAP add beyond occupancy?
Q3 Does occupancy add beyond volume/VWAP?
Q4 Does any apparent high-volume-node effect disappear after occupancy control?
Q5 Does actual participant inventory add beyond transaction-flow proxies?
Q6 Does any cost-reference story survive after removing unsupported cost-basis labels?
Q7 Do results survive alternate preregistered occupancy bin/interval families under familywise correction?

## Required fields

parentDecisionId;
symbol;
timeframe;
semanticSpace;
predictorFreezeAt;
structuralRootId;
structuralVersionId;
occupancyKind;
barInterval;
priceBinRuleId;
tickRuleReceipt;
sessionMechanism;
eligibleBarCount;
visitedBarCount;
visitedBarShare;
consecutiveVisitedBars;
firstVisitedAt;
lastVisitedAt;
executedVolumeInZone;
executedValueInZone;
volumePerVisitedBar;
exactDwellSeconds;
tradeCount;
medianIntertradeDuration;
vwapReceipt;
volumeProfileReceipt;
participantInventoryReceipt;
participantInventoryState;
inventoryCostObserved;
informationRoots;
representationFamilies;
effectiveIndependentEvidenceCount;
residualIncrementalityStatus;
manifestVersion/hash.

Unsupported fields remain null/UNKNOWN, never zero-filled.

## Current decision

BAR_VISIT_PROXY_EQUALS_EXACT_DWELL_TIME=FALSE.
TIME_AT_PRICE_EQUALS_TRADED_VOLUME=FALSE.
TIME_AT_PRICE_EQUALS_VWAP=FALSE.
VWAP_EQUALS_PARTICIPANT_INVENTORY_COST=FALSE.
NET_FLOW_EQUALS_INVENTORY=FALSE.
HOLDING_QUANTITY_EQUALS_COST_BASIS=FALSE.
OUTCOME_TUNED_OCCUPANCY_BINS=PROHIBITED.
DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT=1.
OUTCOME_JOIN=CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE=NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Build deterministic bar-visit occupancy helper, exact-dwell eligibility guard and inventory-observability guard.
2. Add adversarial cases for wide-bar false dwell, incomplete bar, tick-grid change, occupancy/volume divergence and cost-basis overclaim.
3. Hand T0-T6 and Q1-Q7 residual/common-support inference to D16.
4. Preserve full occupancy parameter family and negative/data-blocked states.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate time/volume acceptance from price-path entropy / directional churn so repeated visits caused by noisy oscillation are not mistaken for stable acceptance.
7. No runtime wiring / no Formal change.
