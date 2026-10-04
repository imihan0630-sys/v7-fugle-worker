# System 2 MOPSOV High-Row Pagination / Truncation Stress V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY_SOURCE_STRESS
System 1 Formal Core: LOCKED

## Purpose

Stress the official MOPSOV company-history query beyond the small correction/cancellation controls and test whether high-row-count company-year responses reconcile exactly to bounded month shards.

This gate targets silent truncation / pagination risk. It is source-contract evidence only.

## Frozen discovery universe

Before the physical run, freeze:
2330, 2317, 2303, 2454, 2382, 3711, 2881, 2882, 2891, 3231, 3008.

All use ROC year 115 and cutoff 2026-09-30.

The probe:
1. fetches `month=all` for every frozen candidate;
2. ranks by parsed rows dated on/before the cutoff;
3. selects the deterministic Top 3 highest-row controls;
4. fetches Jan-Sep month shards for each Top 3;
5. reconciles exact `date|time|seqNo` keysets;
6. records visible pagination hints.

Selection of Top 3 depends only on source row count, not price, stock performance or any trading result.

## Acceptance

- maximum frozen-candidate prefix row count >=150;
- all three selected high-row controls reconcile exactly;
- zero only-full-query keys;
- zero only-month-shard keys;
- zero duplicate month-shard keys.

Visible pagination hints are recorded but are not sufficient by themselves to prove completeness; exact month-shard reconciliation is the primary bounded integrity check.

## What PASS does not mean

Even a PASS leaves false:
- boundedIntervalCoverageComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- noEventMayBeClaimed;
- technicalContinuityCertified;
- all selection/push/capital/order authority.

## Next gate

After physical PASS:
1. validate MOPS date/time/sequence as historical version knownAt candidates;
2. add exchange-side official document cancellation/revocation evidence;
3. assemble supplemental revision-history completeness only after all required lanes are covered.

Read-only only; no D1/R2 mutation and no System 1 runtime use.

## 2026-10-04 physical high-row stress acceptance

PR #455 physically verified high-row MOPSOV query integrity against bounded month shards.

- Merge commit: `3772f6332465a5912d1ca32314c322b455685d18`.
- High Row Pagination Stress Readonly run `37169619727`: PASS.
- System2 Research CI `37169619744`: PASS.
- V8 Regression `37169619690`: PASS.
- Frozen discovery universe: 11 ordinary equities.
- Deterministic Top 3 by source row count:
  - 2891 / prefix rows 391;
  - 3711 / prefix rows 383;
  - 2881 / prefix rows 300.
- `maxPrefixRowCount=391`.
- `highRowStressObserved=true`.
- `passCount=3`.
- `exactKeysetReconciliation=true`.
- For all three controls:
  - full-query prefix row count == Jan-Sep month-shard union;
  - `onlyAllCount=0`;
  - `onlyMonthShardCount=0`;
  - `duplicateMonthKeyCount=0`.
- `anyPaginationHint=false`.
- The largest individual month observed in the Top 3 sample contained 81 rows.
- Read-only boundary PASS.

This materially narrows silent truncation/pagination risk for the frozen 2026 high-row sample. It does not prove whole-market historical revision completeness or certify historical version knownAt clocks.

Still false:
- `boundedIntervalCoverageComplete=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `technicalContinuityCertified=false`;
- all selection/push/capital/order/System1 runtime authority.
