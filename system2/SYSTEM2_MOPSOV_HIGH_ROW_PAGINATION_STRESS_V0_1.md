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
