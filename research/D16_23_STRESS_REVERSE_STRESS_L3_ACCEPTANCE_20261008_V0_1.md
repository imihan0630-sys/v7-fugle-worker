# D16-23 Stress / Scenario / Reverse-Stress L3 Acceptance — 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Scope

D16-23 advances from L2/40 to L3/60 at executable Taiwan-PIT validation-feasibility maturity.

No stress scenario is claimed to be a forecast and no Alpha / Formal decision effect is authorized.

## Executable implementation

- `research/d16_stress_harness_l3_v0_1.mjs`
- `tests/test_d16_stress_harness_l3_v0_1.mjs`
- workflow `Research D16 Stress Harness L3 Readonly`

Accepted exact head:
`0d3e10cda9106c876c742168bae4f3e71a607b2f`.

Evidence:
- workflow run `37741826603`: SUCCESS;
- 17/17 targeted stress/reverse-stress falsification tests PASS;
- research-only isolation PASS;
- same-head V8 Regression run `37741826762`: SUCCESS.

## PIT snapshot firewall

The harness requires:
- market=TW;
- exact marketDate/decisionTimestamp;
- immutable snapshotHash/sourceCutHash/universeVersion;
- pointInTimeEligible=true;
- unique position identities;
- source receipt hash per exposure;
- KNOWN weight/beta/sector/liquidity/gap sensitivity;
- total invested weight <= 1.

UNKNOWN exposure does not become zero.

## Scenario firewall

Stress scenarios require:
- immutable id/version/hash;
- PREREGISTERED_RESEARCH state;
- registeredAt/availableAt no later than decision time;
- outcomeSelected=false;
- deterministic parameter hash;
- adverse shock sign semantics.

A changed shock without a matching preregistered hash is rejected.

## Reverse-stress firewall

Reverse stress additionally requires a preregistered:
- lossLimit;
- shockScaleGrid;
- base scenario parameter hash.

The grid may not be changed after the decision cut.

The result reports first breach scale if present, but:
- thresholdTuningPerformed=false;
- currentOrFutureOutcomeAccessed=false.

## Falsification

Tests cover:
- deterministic replay / input-order invariance;
- non-Taiwan rejection;
- non-PIT snapshot rejection;
- UNKNOWN exposure rejection;
- duplicate exposure rejection;
- over-investment rejection;
- post-decision scenario rejection;
- outcome-selected scenario rejection;
- parameter mutation rejection;
- favorable-shock sign rejection;
- reverse-grid preregistration;
- late reverse registration;
- outcome-selected grid;
- grid/loss-limit mutation;
- future scenario template.

## Maturity decision

D16-23 = L3/60.

This is executable methodology/data-feasibility maturity only.

L4 remains blocked until genuine prospective/OOS Taiwan stress diagnostics are accumulated and compared against realized later outcomes without outcome-tuned scenario selection.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
