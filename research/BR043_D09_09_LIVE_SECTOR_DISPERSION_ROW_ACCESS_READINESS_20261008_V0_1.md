# BR-043 — D09-09 Live Sector-Dispersion Row-Access Readiness V0.1

Status: RESEARCH_ONLY / LIVE_A1_PERSISTED / B5_CURRENT_CLASSIFICATION_FEASIBLE / ROW_EXPORT_BLOCKED / KEEP_L3 / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-09
Date: 2026-10-08 Asia/Taipei
Observed main before write: dbf2586299183718b5d2166038da0019e1a30868

## Objective

Freeze the exact remaining blocker for the first live/source-only Taiwan sector-dispersion receipt.

## A1 current-day market data — READY

System2 Daily Shadow Diagnostic physical run 37609474459 proved 2026-10-07 same-day all-market A1 persistence and readback:
- artifact id 11476921489;
- artifact digest sha256:fcce5882ba1a49a9c50e1523d65ed351c5dd5c850db4e292dd2de6cde126fa91;
- prospectiveHistory state = PROSPECTIVE_HISTORY_READBACK_VERIFIED;
- rowCount = 1,973;
- availabilityBasis = PROSPECTIVE_OBSERVATION;
- firstKnownSemantics = FIRST_SAVED_OBSERVATION_UPPER_BOUND;
- TWSE = 1,086 rows, allBarsAccounted=true, readbackVerified=true;
- TPEx = 887 rows, allBarsAccounted=true, readbackVerified=true.

Current-day official source lineage is therefore not the blocker.

## B5 current classification — FEASIBLE

`system2/runtime/current_listing_metadata_v0_1.mjs` provides current prospective listing metadata from official TWSE/MOPS and TPEx/MOPS sources and preserves:
- market;
- symbol;
- companyName;
- industry;
- listingDate;
- source identity;
- metadataHash.

The canonical source audit explicitly allows prospective current classification use while prohibiting historical backfill.

Therefore the 2026-10-07 live receipt may use a same-observation current B5 classification vintage, with classification timestamp/hash frozen.

## Remaining blocker

The Daily Shadow diagnostic artifact contains aggregate persistence/readback receipts but not the 1,973 row-level payloads.

The rows are physically present in `s2_historical_a1_bars`, and repository code already demonstrates read-only SQL against that table. However Room07 has no accepted existing workflow/artifact that exports all 2026-10-07 rows for research consumption.

Therefore current state:
`DATA_EXISTS_AND_READBACK_VERIFIED / RESEARCH_ROW_PAYLOAD_NOT_EXPOSED`.

This is not:
- SOURCE_MISSING;
- MARKET_DATA_NOT_READY;
- INDUSTRY_CLASSIFICATION_NOT_FEASIBLE;
- ZERO_ROWS.

## Frozen BR-043 computation once rows are exported

Same member set per industry, outcome-blind:
- CSSD;
- CSAD;
- IQR with one frozen quantile convention;
- MAD;
- upside/downside descriptive dispersion;
- top-1 and top-3 removal by PRE-EXISTING TRADE VALUE only.

Forbidden:
- removing names because realized return is extreme;
- selected-only universe;
- current classification backfilled to older dates;
- dropping UNKNOWN classifications silently.

## Maturity

D09-09 remains L3 / 60%.

No L4 credit until the first live receipt is actually computed and independent dates accumulate.

## Exact next

DATA_LANE returns one read-only 2026-10-07 row export from `s2_historical_a1_bars` with immutable query/hash provenance, plus a same-observation current B5 classification receipt/hash. Room07 then computes BR-043 locally without any D1 mutation.

Formal Core unchanged.
