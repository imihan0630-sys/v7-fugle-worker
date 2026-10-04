# System 2 MOPSOV Multi-Control Month-Shard Reconciliation V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY_MULTI_CONTROL_RECONCILIATION
System 1 Formal Core: LOCKED

## Purpose

Expand the physically verified MOPSOV month-shard reconciliation from one high-volume company control to every company represented in the frozen MOPS Revision Control Matrix V0.2.

The goal is to test whether the official company-year history query and bounded month shards preserve the same date/time/sequence keyset across correction and cancellation control companies.

This remains a source-contract gate, not a revision-completeness certificate.

## Frozen controls

The probe derives its company set directly from:
`MOPS_REVISION_CONTROLS_V0_2`

Covered companies / control families:

- 2467 / dividend ex-date correction;
- 1459 / capital-reduction schedule correction;
- 2321 / capital-reduction decision correction;
- 1342 / cash-capital-increase correction and cancellation.

All controls use ROC year 115.

Query window:
- `month=all` company-year response;
- bounded month shards 1 through 9;
- cutoff 2026-09-30.

Identity key:
`date | time | seqNo`.

## Acceptance

Every company must satisfy:

- only-full-query keys = 0;
- only-month-shard keys = 0;
- duplicate keys across month shards = 0;
- exactKeysetReconciliation=true.

All five frozen V0.2 control IDs must be covered by the four company/year groups.

## What a PASS means

A PASS means that the official MOPSOV query shape was internally consistent across the frozen four-company sample for the frozen period.

It does not prove:
- whole-market coverage;
- boundedIntervalCoverageComplete;
- actionFamilyCoverageComplete;
- cancellationHistoryComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- noEventMayBeClaimed;
- technicalContinuityCertified.

## Next gate after PASS

1. characterize empty company-month semantics;
2. stress higher-row-count / pagination or truncation behavior beyond the frozen sample;
3. validate source-reported date/time/sequence semantics as historical knownAt candidates;
4. add exchange-side official document cancellation/revocation evidence;
5. only after all supplemental revision-history requirements are complete may revisionCoverageComplete be reconsidered.

## Authority firewall

Read-only only. No D1/R2 mutation, strategy evaluation, capacity, selection, push, capital, orders or System 1 runtime use.


## 2026-10-04 physical acceptance

PR #448 physically verified the frozen four-company / five-control MOPSOV reconciliation gate.

- Merge commit: `8c1f9746ffe0593797403a5bc45c1cfbd68e0a35`.
- Multi Control Reconciliation Readonly run `37168654471`: PASS.
- System2 Research CI `37168654454`: PASS.
- V8 Regression `37168654514`: PASS.
- `companyCount=4`.
- `controlCount=5`.
- `allControlsCovered=true`.
- `passCompanyCount=4`.
- `exactKeysetReconciliation=true`.
- Every company had:
  - `onlyAllCount=0`;
  - `onlyMonthShardCount=0`;
  - `duplicateMonthKeyCount=0`.
- Read-only boundary PASS.

Observed company/year controls covered:
- 2467 / dividend correction;
- 1459 / capital-reduction schedule correction;
- 2321 / capital-reduction decision correction;
- 1342 / cash-capital-increase correction + cancellation.

This materially reduces query-shape / shard-fragmentation uncertainty for the frozen correction/cancellation sample, but it does not certify the supplemental revision-history channel.

Still false:
- `boundedIntervalCoverageComplete=false`;
- `actionFamilyCoverageComplete=false`;
- `cancellationHistoryComplete=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`;
- `technicalContinuityCertified=false`;
- `selectionAuthority=false`.

Next: certify empty company-month semantics, stress higher-row-count pagination/truncation, validate historical knownAt semantics, then add exchange-side cancellation/revocation evidence.
