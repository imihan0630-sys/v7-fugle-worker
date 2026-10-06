# System 2 S2-07 Eight-Lane Source Cut V1.5

Updated: 2026-10-07 Asia/Taipei  
Lane: BUILD_LANE / shared TECHNICAL_CONTINUITY owner  
Status: RESEARCH_ONLY / PHYSICAL_SOURCE_CUT_PREFLIGHT  
Formal Core: LOCKED  
Scheduler: NOT ADDED  
Trading authority: NONE

## Purpose

Clear the first remaining V1.4.1 blocker with a genuine prospective market-wide source capture, without pretending that MOPS exact-version completeness is already solved.

The frozen D03 owner handoff defines the base market-wide cut as:
- six range-verified TWSE/TPEx actual corporate-action result/reference lanes;
- TWSE daily material-information OpenAPI;
- TPEx daily material-information OpenAPI.

MOPS exact disclosure versions remain a separate identity/provenance layer.

## Required eight lanes

Historical range lanes:
1. TWSE_EX_RIGHT_DIVIDEND_ACTUAL
2. TWSE_CAPITAL_REDUCTION_REFERENCE
3. TWSE_PAR_VALUE_CHANGE_REFERENCE
4. TPEX_EX_RIGHT_DIVIDEND_ACTUAL
5. TPEX_CAPITAL_REDUCTION_REFERENCE
6. TPEX_PAR_VALUE_CHANGE_REFERENCE

Current disclosure snapshots:
7. TWSE_DAILY_MATERIAL_INFORMATION
8. TPEX_DAILY_MATERIAL_INFORMATION

Each required lane must be captured no later than the evidence cutoff with:
- immutable payload hash;
- parser completeness;
- query completeness;
- no truncation;
- exact response-range identity for the six historical-range lanes.

A zero-row daily disclosure snapshot is fail-closed unless source-local empty semantics are separately certified.

## Bounded interval

The physical V1.5 probe uses the D03 capacity-study lower bound 2026-08-15 through the actual Taipei scan date.

The interval is a bounded TECHNICAL_CONTINUITY source population, not an all-history completeness claim.

## Event-driven MOPS workload

The six actual/reference lanes are parsed into exact corporate-action event keys. V1.5 derives a unique symbol-month MOPS lookup population:

`symbol|YYYY-MM`

This is only the required next workload. V1.5 does not mark those disclosure versions prospectively observed and does not create an expected MOPS version keyset.

Therefore a successful V1.5 state is:

`EIGHT_LANE_SOURCE_CUT_READY_MOPS_PENDING`

not a full pre-parent manifest.

## Authority firewall

Even when all eight lanes pass:
- `mopsProspectiveExactVersionLayerReady=false`;
- `expectedMopsKeysetComplete=false`;
- `noRevisionGapThroughCut=false`;
- `preCutManifestReady=false`;
- parent binding remains pending;
- symbol-session completeness remains false;
- technical continuity remains false;
- selection/final-selection/push/capital/order remain false;
- System1 runtime is unused.

## Physical workflow

`.github/workflows/system2-s2-07-eight-lane-source-cut-v1-5-readonly.yml`

The workflow:
1. runs deterministic unit tests;
2. fetches the six official range lanes from TWSE/TPEx;
3. verifies exact interval identity and parser completeness;
4. fetches both official daily material-information datasets;
5. freezes payload hashes and capture timestamps;
6. derives the bounded corporate-action/MOPS lookup population;
7. performs no D1 write, Worker deploy, Cron change, order/push action, or System1 mutation.

## Next gate

After physical eight-lane acceptance:
1. execute the derived MOPS symbol-month workload prospectively;
2. preserve exact MOPS version identity plus exact-version content hash;
3. freeze the complete expected/observed MOPS keyset before parent cutoff;
4. after the parent, run bounded-complete MOPS reconciliation;
5. only if noRevisionGapThroughCut passes may parent binding and symbol continuity proceed.
