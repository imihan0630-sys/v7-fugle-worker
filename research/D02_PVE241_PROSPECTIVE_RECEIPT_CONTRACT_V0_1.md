> Reconciliation notice — 2026-10-05
> Status: HISTORICAL_FLAT_INTERFACE_ONLY / SUPERSEDED_AS_CONTRACT.
> The authoritative frozen receipt contract is research/d02_prospective_pv_provenance_receipt_schema_v0_1.json.
> The flat guard remains historical implementation evidence only. Canonical executable validation is research/d02_pve241_canonical_guard_v0_2.mjs and tests/test_d02_pve241_canonical_guard_v0_2.mjs.
> Do not use this document as a second receipt schema.

# D02 PVE-241 Prospective Receipt Contract V0.1

Updated: 2026-10-05 Asia/Taipei
Status: OUTCOME_BLIND / EXECUTABLE_RECEIPT_SCHEMA / NO_MATURITY_CHANGE
Evidence cursor: PVE-241
Formal Core: LOCKED

## Purpose

Freeze the executable provenance and semantic receipt required before D02 minute/daily price-volume observations may enter future prospective or OOS evidence.

This contract does not inspect economic outcomes and does not authorize L4 promotion.

## Required families

### Decision-time source clocks
Every receipt binds source provider, endpoint, source role, sourceAvailableAt, sourceRetrievedAt, featureFirstKnownAt and decisionCutoffAt.
Historical replay may support replay and provenance but cannot prove original decision-time observability.

### Volume unit normalization
Regular-lot MINUTE volume is LOTS.
DAILY volume is SHARES.
All normalized comparison values use SHARES.
LOTS to SHARES uses factor 1000.
Cross-timeframe joins require explicit unitNormalizationPass.

### Corporate-action contamination
Every receipt binds corporateActionClass and known status.
UNKNOWN cannot be ELIGIBLE.
EX_RIGHT_DIVIDEND requires mechanical reference-price control and cannot be treated as ordinary price discovery.
UNIT_SCALE and SUPPLY_CHANGE require explicit continuity/comparability controls.

### Same-root anti-double-count
priceInformationRoot must remain PRICE_OHLC.
volumeInformationRoot must remain VOLUME_TURNOVER.
Price-derived transforms cannot create a second independent price vote.
Residual incrementality and identical common support remain mandatory for future promotion claims.

### Participation-intent firewall
DIRECT_VOLUME, TURNOVER, RVOL, BID_ASK_SIDE_VOLUME, PROVIDER_TRADE_PRESSURE and PRICE_VOLUME_RESPONSE are participation/proxy observables.
Intent is not identified unless a separate independent source is present and known by the decision cutoff.
BID_ASK_SIDE_VOLUME and PROVIDER_TRADE_PRESSURE are not TRUE_OFI and cannot claim complete-volume identity.
Opening-auction completeness cannot be claimed for BID_ASK_SIDE_VOLUME under the documented provider semantics.

## Permanent authorization limits

The guard always returns:
- outcomeAccessAuthorized=false;
- numericalTargetAuthorized=false;
- d16MethodSelectionAuthorized=false;
- maturityPromotionAuthorized=false;
- formalCoreChangeAuthorized=false.

## Validation

Independent local Node execution:
33/33 tests PASS.

Artifacts:
- research/d02_pve241_prospective_receipt_guard_v0_1.mjs
- tests/test_d02_pve241_prospective_receipt_guard_v0_1.mjs

## Consequence

PVE-241 freezes the receipt schema only.
It does not create a clean prospective selection date.
D02 remains 60.0%.
CLEAN_DATE_ZERO remains.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.

Exact next continuation point:
PVE-242 — bind the frozen PVE-241 receipt schema to the existing D02 L4 admission lanes, especially D02-02/H001, D02-03/H20, D02-06/H003 and D02-08 proxy classification, and prove that no admitted row can bypass source-clock, unit, corporate-action, lineage or intent checks. Stay outcome-blind.
