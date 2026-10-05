# D02 PVE-242 — Canonical receipt guard reconciliation and admission bridge

Updated: 2026-10-05 Asia/Taipei
Status: OUTCOME_BLIND / CANONICAL_SCHEMA_RECONCILED / ADMISSION_BRIDGE_PASS / NO_MATURITY_CHANGE / FORMAL_UNCHANGED

## Why PVE-242 exists

Two concurrent PVE-241 implementations appeared:
1. the canonical nested receipt schema in research/d02_prospective_pv_provenance_receipt_schema_v0_1.json;
2. a later flat executable guard with equivalent intent but a different field interface.

The frozen canonical nested schema remains authoritative.
The flat V0.1 guard is retained as historical implementation evidence only and must not become a second receipt contract.

## PVE-242 reconciliation

New canonical guard:
- research/d02_pve241_canonical_guard_v0_2.mjs

New validation:
- tests/test_d02_pve241_canonical_guard_v0_2.mjs
- 27/27 tests PASS.

The V0.2 guard consumes the exact frozen schemaVersion:
D02_PROSPECTIVE_PV_PROVENANCE_RECEIPT_V0_1.

It validates:
- source/provider/endpoint/hash lineage;
- availableAt / firstKnownAt / decisionCutoff consistency;
- completed-bar chronology;
- 1m/5m/15m regular-lot LOTS to SHARES x1000;
- 1d SHARES identity normalization;
- unit-continuity fail-closed behavior;
- adjusted-daily semantics not leaking into intraday bars;
- corporate-action UNKNOWN and mechanical contamination;
- information-root typing;
- participation-intent firewall;
- opening-auction side-volume incompleteness;
- admission boolean consistency;
- historical provider data not self-proving original prospective decision observability.

## Admission bridge

bridgeCanonicalReceipt emits fail-closed lineage for:
- D02-02:H001;
- D02-03:H20;
- D02-06:H003;
- D02-08.

For Wave-1 keys it fixes:
- priceInformationRoot=PRICE_OHLC when price is consumed;
- volumeInformationRoot=VOLUME_TURNOVER when volume is consumed;
- commonSupportRequired=true;
- residualIncrementalityRequired=true;
- priceDerivedIndependentVote=false.

For D02-08 it fixes:
- trueOfiEligible=false;
- participantIntentEligible=false;
- dynamicAbsorptionEligible=false;
- provider opening-auction completeness remains typed.

## Authorization boundary

PVE-242 remains outcome-blind.
It creates no clean prospective date.
It does not freeze any numerical target.
It does not choose a D16 model method.
It does not authorize L4 maturity or Formal Core changes.

## Exact next continuation point

PVE-243 — capture the first genuine prospective canonical receipt using the frozen schema and V0.2 guard, without opening promotion-grade outcomes; if no decision-time-valid source is available, record BLOCKED/UNKNOWN rather than retroactively admitting historical data.
