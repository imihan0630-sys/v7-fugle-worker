# D01 DL-061 — Structural Response vs Index-Weight / Passive-Flow / Constituent-Arbitrage Effects V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / INDEX_MECHANICS_ATTRIBUTION_FIREWALL / SDA_001_SDA_002_OPEN / FORMAL_CORE_LOCKED

## 1. Purpose

DL-060 separated stock-specific structural response from market/sector/leader/common-price-discovery propagation.

DL-061 adds a stricter attribution firewall:

> A stock may appear to react at a support/resistance zone because index weighting, passive rebalancing, ETF creation/redemption, futures/ETF arbitrage, mega-cap concentration, or constituent synchronization mechanically transmits price pressure around the same time.

This is especially dangerous for large index constituents because the "market return" used as a control can contain the stock itself.

No return outcome is opened in this tranche.

## 2. External evidence context

The literature establishes multiple non-structural channels:

- Hasbrouck (2003) finds substantial equity-index price discovery can occur in E-mini futures and ETFs rather than only in constituent stocks.
- Ben-David, Franzoni and Moussawi (2018) find ETF ownership can propagate liquidity shocks and raise underlying-stock volatility through the ETF arbitrage channel.
- Index-effect literature including Harris/Gurel and Chen/Noronha/Singal documents price effects around index changes consistent with price pressure / demand shifts.
- Recent index-rebalancing work explicitly models value-weighted index funds as mechanically trading constituents when composition changes.
- Recent comovement research documents excess index-member comovement that need not be explained by firm fundamentals.

These mechanisms are alternative explanations.
They do not prove or disprove D01 structural memory by themselves.

## 3. Owner boundaries

D01 consumes canonical owner receipts and does not redefine:

### D06-11
ETF / index passive flows and rebalancing.

### D06-16
ETF creation/redemption, AP mechanics, premium/discount, basket exposure and liquidity.

### D11-14
Index-adjustment event clocks and passive-flow event identity.

### D19-15
Index / benchmark methodology, composition and weight vintage.

### D12 owner family
Futures / derivative basis and price-discovery context where a canonical receipt exists.

### D18-06 / D18 owner family
Large-cap leadership / regime context.

Missing owner evidence remains UNKNOWN.

## 4. Self-inclusion / mechanical benchmark contamination

A constituent stock contributes mechanically to a capitalization-weighted index.

Therefore:

RAW_INDEX_RETURN_IS_EXOGENOUS_CONTROL =
FALSE whenever the target stock is itself a constituent.

For any benchmark/sector control, preserve:

- benchmarkId;
- methodologyVersion;
- constituentMembershipAsOf;
- targetIncluded;
- targetWeightAsOf;
- weightKnownAt;
- selfExcludedBenchmarkAvailable;
- selfExcludedBenchmarkReceiptId.

If targetIncluded = true and no valid self-excluded / mechanically decontaminated benchmark receipt exists:

BENCHMARK_CONTROL_STATE =
SELF_INCLUDED_ENDOGENOUS.

Do not claim that the index independently led the stock.

## 5. No ad-hoc self-excluded return construction

D01 does not approximate an ex-self index by simply subtracting:

targetWeight × targetReturn

unless a canonical benchmark owner certifies that this transformation matches the benchmark methodology and timing.

Reasons include:
- float-adjusted weights;
- divisor mechanics;
- intraday weight drift;
- corporate actions;
- constituent changes;
- price-return vs total-return definitions;
- opening/closing auction conventions.

Without a canonical receipt:
SELF_EXCLUDED_BENCHMARK =
UNKNOWN.

## 6. Index-weight context states

Freeze:

I0 TARGET_NOT_IN_BENCHMARK

I1 TARGET_INCLUDED_WEIGHT_KNOWN

I2 TARGET_INCLUDED_WEIGHT_UNKNOWN

I3 SELF_EXCLUDED_BENCHMARK_VERIFIED

I4 SELF_INCLUDED_BENCHMARK_ONLY

I5 INDEX_METHODOLOGY_OR_VINTAGE_UNKNOWN

I6 INDEX_RECONSTITUTION_ACTIVE

I7 WEIGHT_CHANGE_ACTIVE

These states are descriptive context, not trading signals.

## 7. Mega-cap mechanical contribution

A large constituent can make the index move partly because the constituent itself moved.

Therefore:
"market moved in same direction" can be circular.

Preserve:
- target benchmark weight;
- top-k concentration context if owner-certified;
- target rank by benchmark weight;
- cap-weight vs equal-weight divergence receipt;
- breadth / participation context;
- self-excluded benchmark if available.

No fixed threshold defines "mega-cap" inside D01.
D18 owner taxonomy controls any large-cap leadership label.

## 8. Passive / rebalancing event states

Consume D06-11 / D11-14 event clocks.

Freeze separate states:

P0 NO_KNOWN_PASSIVE_EVENT

P1 INDEX_ANNOUNCEMENT_KNOWN

P2 INDEX_EFFECTIVE_SESSION_KNOWN

P3 TARGET_ADD_DELETE_TRANSFER_KNOWN

P4 TARGET_WEIGHT_CHANGE_KNOWN

P5 PASSIVE_FLOW_MODELED_ONLY

P6 ACTUAL_PASSIVE_EXECUTION_VERIFIED

P7 ACTUAL_PASSIVE_EXECUTION_UNKNOWN

P8 PASSIVE_EVENT_DATA_BLOCKED

Announcement and effective-session clocks must remain separate.

Do not backfill event-time AUM, units or weights from current values.

## 9. ETF primary-market vs secondary-market mechanics

D06-16 currently separates modeled basket exposure from actual AP/constituent execution.

DL-061 preserves that distinction.

Allowed:

ETF_MODELED_PRIMARY_BASKET_EXPOSURE

ETF_PREMIUM_DISCOUNT_STATE

ETF_PCF_KNOWN

ETF_CREATION_REDEMPTION_UNITS_KNOWN if owner-certified

Not automatically allowed:

ACTUAL_AP_EXECUTION

ACTUAL_CONSTITUENT_EXECUTION

Those remain UNKNOWN unless directly evidenced.

A modeled basket exposure cannot be described as an observed mechanical trade.

## 10. ETF / futures price-discovery channels

A structural response can coincide with:
- ETF price adjustment;
- futures price discovery;
- basis convergence;
- creation/redemption arbitrage;
- index-arbitrage basket trading.

Freeze channel states:

A0 NO_CERTIFIED_ARBITRAGE_CONTEXT

A1 ETF_PRICE_DISCOVERY_PRIOR_MOVE

A2 FUTURES_PRICE_DISCOVERY_PRIOR_MOVE

A3 ETF_NAV_OR_BASIS_DISLOCATION_PRESENT

A4 MODELED_BASKET_ARBITRAGE_CONTEXT

A5 VERIFIED_CONSTITUENT_ARBITRAGE_EXECUTION

A6 MULTIPLE_ARBITRAGE_CHANNELS

A7 ARBITRAGE_DIRECTION_UNKNOWN

A8 ARBITRAGE_DATA_BLOCKED

Only states known before predictorFreezeAt are baseline eligible.

## 11. Hard clock

For every mechanical context:

receiptKnownAt <= predictorFreezeAt < endpointWindowStart

If a weight, passive event, ETF basket, basis state or arbitrage relation becomes known after predictor freeze:

POST_OPPORTUNITY_MECHANICAL_CONTEXT.

It cannot explain the predictor state ex ante.

## 12. Constituent-comovement firewall

Index membership / ETF ownership can increase comovement.

Therefore same-direction movement of:
- target stock;
- index;
- sector ETF;
- benchmark ETF;
- futures

does not by itself establish external confirmation.

Preserve:
- raw co-movement;
- self-inclusion state;
- passive-event state;
- ETF/futures price-discovery state;
- target liquidity;
- target stale-price state;
- index/ETF ownership where owner-certified.

Comovement is context, not an independent vote.

## 13. Generic mechanical comparator

Primary comparator family:

G0 MECHANICAL_EVENT_AWAY_FROM_ZONE

G1 MECHANICAL_EVENT_AT_ZONE

Examples of mechanical events:
- scheduled index add/delete/transfer/weight change;
- verified passive rebalance event;
- ETF premium/discount dislocation with modeled basket exposure;
- futures/ETF prior price-discovery event.

If G1 adds no residual representation beyond G0 after common-support controls:
MECHANICAL_CONTEXT_SUFFICIENT.

## 14. Zone-specific structural comparison

Complementary comparison:

Z0 ZONE_NO_MECHANICAL_CONTEXT

Z1 ZONE_SELF_INCLUDED_INDEX_MOVE_ONLY

Z2 ZONE_SELF_EXCLUDED_MARKET_MOVE_PRESENT

Z3 ZONE_PASSIVE_EVENT_PRESENT

Z4 ZONE_ETF_ARBITRAGE_CONTEXT_PRESENT

Z5 ZONE_FUTURES_PRICE_DISCOVERY_PRESENT

Z6 ZONE_MULTI_MECHANICAL_CHANNEL

Z7 ZONE_MECHANICAL_CONTEXT_UNKNOWN

No state is alpha by itself.

## 15. Direct ancestry / SDA-001

All price-derived channels can share common ancestry.

Preserve:
- informationRoot for target stock PRICE_OHLC;
- benchmark/index PRICE_OHLC;
- ETF PRICE_OHLC;
- futures PRICE_OHLC;
- passive-flow / index-event source lineage;
- structural root lineage.

Different instruments do NOT automatically imply independent evidence.

Within one parent:
effectiveIndependentEvidenceCount = 1 by default
unless D16 validates residual/dependence structure.

SDA-001 remains open.

## 16. SDA-002 no-lookahead

Every mechanical receipt must preserve:
- firstObservableAt;
- knownAt;
- predictorFreezeAt;
- methodologyVersion;
- composition/weight vintage;
- source hash;
- replaySafe.

Current index composition/weights may not be used to backfill historical predictor dates.

Later-announced index changes are not prior context.

SDA-002 remains open.

## 17. Future D16 ladder

M0 RAW_ZONE_RESPONSE

M1 DL057_OWN_IMPACT_CONTROLLED

M2 DL058_INITIATING_INFORMATION_CONTROLLED

M3 DL059_EXTERNAL_FLOW_CONTROLLED

M4 DL060_COMMON_PRICE_DISCOVERY_CONTROLLED

M5 SELF_INCLUDED_BENCHMARK_IDENTIFIED

M6 SELF_EXCLUDED_BENCHMARK_CONTROLLED

M7 INDEX_REBALANCE_PASSIVE_FLOW_CONTROLLED

M8 ETF_PRIMARY_MARKET_CONTEXT_CONTROLLED

M9 ETF_FUTURES_ARBITRAGE_CONTROLLED

M10 MEGA_CAP_CONCENTRATION_BREADTH_CONTROLLED

M11 GENERIC_MECHANICAL_EVENT_COMPARATOR_CONTROLLED

M12 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE

M13 MULTI_DATE_MULTI_SYMBOL_MULTI_INDEX_REPLICATION

## 18. Future interpretations

Q0 SELF_INCLUDED_BENCHMARK_CIRCULARITY

Q1 INDEX_WEIGHT_MECHANICAL_EXPLANATION

Q2 PASSIVE_REBALANCE_EXPLANATION

Q3 ETF_ARBITRAGE_EXPLANATION

Q4 FUTURES_PRICE_DISCOVERY_EXPLANATION

Q5 CONSTITUENT_COMOVEMENT_EXPLANATION

Q6 MEGA_CAP_CONCENTRATION_EXPLANATION

Q7 MULTIPLE_MECHANICAL_CHANNELS

Q8 STRUCTURAL_RESPONSE_RESIDUAL

Q9 NOT_EVALUABLE

## 19. Common support

Future comparisons require overlap in:
- target index membership;
- target weight / weight-known state;
- self-excluded benchmark availability;
- passive-event state;
- ETF ownership / basket exposure where available;
- futures/ETF price-discovery state;
- liquidity;
- volatility;
- regime;
- zone geometry;
- DL057-DL060 context;
- opportunity timing.

No extrapolation outside support.

## 20. Current decision

RAW_INDEX_RETURN_AS_EXOGENOUS_CONTROL_WHEN_TARGET_INCLUDED =
PROHIBITED.

AD_HOC_SELF_EXCLUDED_INDEX_APPROXIMATION =
PROHIBITED.

CURRENT_INDEX_WEIGHT_BACKFILL =
PROHIBITED.

MODELED_ETF_BASKET_EQUALS_ACTUAL_AP_EXECUTION =
FALSE.

INDEX_MEMBERSHIP_COMOVEMENT_EQUALS_STRUCTURAL_CONFIRMATION =
FALSE.

MEGA_CAP_THRESHOLD_DEFINED_IN_D01 =
FALSE.

DIFFERENT_INSTRUMENTS_EQUAL_INDEPENDENT_VOTES =
FALSE.

OUTCOME_JOIN =
CLOSED.

SDA_001_STATUS =
OPEN.

SDA_002_STATUS =
OPEN.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic self-inclusion / passive-event / ETF-arbitrage context classifier and adversarial tests.
2. Fail closed when historical benchmark weights or self-excluded benchmark receipts are unavailable.
3. Preserve MODELED vs ACTUAL passive/ETF execution semantics.
4. Hand M0-M13 / Q0-Q9 inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural response from opening/closing-auction mechanics, closing-index replication and end-of-session liquidity concentration.
7. No outcome join / no runtime wiring / no Formal change.
