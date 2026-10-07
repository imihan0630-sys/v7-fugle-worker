# D01 DL-085 — Gap / Price-Limit State / Fill-Survivorship Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / D01_09_PIT_CONTRACT / FORMAL_CORE_LOCKED

## Purpose

Separate ordinary information gaps from Taiwan price-limit constraints, mechanical reference resets, suspension effects and liquidity gaps.

## Gap taxonomy

- ORDINARY_OPENING_GAP
- MARKET_WIDE_GAP
- SYMBOL_EVENT_GAP
- CORPORATE_ACTION_MECHANICAL_GAP
- SUSPENSION_RESUMPTION_GAP
- PRICE_LIMIT_DELAYED_DISCOVERY_GAP
- LIQUIDITY_GAP
- DATA_OR_VENDOR_GAP
- UNKNOWN_GAP

No single "gap" variable is allowed to pool these classes.

## Gap receipt

Preserve:
- priorEligibleClose
- currentOpen
- exchangeReferencePrice
- rawGap
- continuityAdjustedGap
- corporateActionState
- suspensionState
- priorLimitState
- currentLimitState
- marketGapContext
- sectorGapContext
- firstObservableAt
- predictorFreezeAt
- replaySafe

## Gap-fill denominator

Every eligible gap enters one append-only population:
- filled_same_session
- filled_later
- never_filled_within_horizon
- censored_by_delisting_or_data_end
- mechanically_rebased
- price_limit_constrained
- data_blocked

Do not study only gaps that eventually filled.

## Fill definition

Pre-register:
- fill threshold;
- tolerance in ticks/bps;
- horizon;
- full vs partial fill;
- adjusted vs raw price space.

A "gap fill" is an outcome, not information available at the gap-open predictor time.

## Price-limit delayed discovery

A close at limit-up/down may censor equilibrium price.
The next open/next sessions can continue price discovery.

Therefore:
LIMIT_HIT_THEN_GAP
is not automatically a chart-pattern continuation signal.

Control prior limit state, queue/liquidity context where available, and market/sector move.

## Taiwan PIT feasibility

Current TWSE market structure supplies official session/auction rules and ordinary stock daily price-limit semantics; corporate-action, suspension, disposition and price-limit receipts are separately governed by earlier D01 firewalls.

OHLC and exchange reference/limit states are point-in-time reconstructable for research.

## D16 ladder

G0 RAW_GAP_RESULT
G1 GAP_TAXONOMY_CLASSIFIED
G2 CORPORATE_ACTION_MECHANICS_REMOVED
G3 SUSPENSION_RESUMPTION_CONTROLLED
G4 PRICE_LIMIT_DELAYED_DISCOVERY_CONTROLLED
G5 MARKET_SECTOR_GAP_CONTEXT_CONTROLLED
G6 LIQUIDITY_GAP_CONTROLLED
G7 FULL_GAP_DENOMINATOR_RESTORED
G8 FILL_DEFINITION_PREREGISTERED
G9 MULTIPLE_HORIZON_TESTING_CONTROLLED
G10 OOS_GAP_INCREMENTALITY
G11 GAP_RESIDUAL_CANDIDATE

## Current decision

ALL_GAPS_SHARE_ONE_MECHANISM = FALSE.
GAP_FILL_IS_PREDICTOR_TIME_INFORMATION = FALSE.
PRICE_LIMIT_GAP_EQUALS_FREE_PRICE_DISCOVERY = FALSE.
MECHANICAL_GAP_EQUALS_INFORMATION_GAP = FALSE.
D01_09_PIT_DATA_CONTRACT = FEASIBLE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.

## Level implication

The module now has Taiwan-specific gap taxonomy, limit/suspension/corporate-action routing, full denominator and replay-safe receipts sufficient for L3 PIT-feasibility classification, subject to tracker governance.
