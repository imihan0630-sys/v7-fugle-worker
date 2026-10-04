# System 2 MOPSOV Month-Shard Reconciliation V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY_RECONCILIATION_GATE
System 1 Formal Core: LOCKED

## Purpose

Test whether the official MOPSOV historical material-information endpoint returns a company-year result set that can be reproduced exactly by the union of bounded month queries.

This gate exists because a visually complete HTML page is not enough to prove that a query was not truncated, paginated, or silently filtered. The result is source-contract evidence only; it is not revision-coverage completeness.

## Frozen control

- Source host: `mopsov.twse.com.tw`
- Endpoint: `/mops/web/ajax_t05st01`
- Company: 2330
- ROC year: 115
- Month shards: 1 through 9
- Comparison cutoff: 2026-09-30
- Identity key: `date | time | seqNo`

The probe compares:

1. one `month=all` company-year query;
2. the union of nine bounded monthly queries;
3. duplicate keys across monthly shards;
4. visible pagination / next-page / step hints.

## Acceptance

The control passes only when:

- `onlyAllCount=0`;
- `onlyMonthShardCount=0`;
- `duplicateMonthKeyCount=0`;
- `exactKeysetReconciliation=true`.

A PASS means only that this frozen company/year window showed exact keyset reconciliation between the full-year-style query and bounded month shards.

It does **not** prove:

- global company coverage;
- boundedIntervalCoverageComplete;
- actionFamilyCoverageComplete;
- correctionHistoryComplete;
- cancellationHistoryComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- noEventMayBeClaimed;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified.

## Why this matters

The supplemental MOPS revision-history lane can be used only if the system can distinguish:

- an actual no-record month;
- a truncated response;
- a query-shape artifact;
- a complete bounded result.

Month-shard reconciliation is one source-contract guard against silently treating incomplete transport as complete historical evidence.

## Next gate after physical PASS

1. repeat bounded reconciliation on companies with known correction/cancellation controls from the frozen V0.2 matrix;
2. characterize empty-company-month semantics;
3. validate pagination/truncation behavior under higher-row-count cases;
4. validate source date/time/sequence semantics before treating them as historical knownAt;
5. join exchange-side official document/cancellation evidence where MOPS alone is insufficient;
6. only after the full supplemental contract is satisfied may `revisionCoverageComplete` be reconsidered.

## Authority firewall

This gate is read-only. It does not mutate D1/R2, does not run strategy evaluation, does not create capacity, does not enable selection, push, capital, orders, or System 1 runtime behavior.


## 2026-10-04 physical acceptance

PR #446 physically verified the frozen MOPSOV month-shard reconciliation control.

- PR merge commit: `636305f79ecde412b27177dc677578d6116bc7d6`.
- MOPSOV Month Shard Reconciliation Readonly run `37168363208`: PASS.
- System2 Research CI run `37168363156`: PASS.
- V8 Regression run `37168363125`: PASS.
- Source: `mopsov.twse.com.tw`.
- Control: 2330 / ROC year 115 / months 1–9 / cutoff 2026-09-30.
- `month=all` total/prefix row count: 151 / 151.
- Bounded month-shard union count: 151.
- `onlyAllCount=0`.
- `onlyMonthShardCount=0`.
- `duplicateMonthKeyCount=0`.
- `exactKeysetReconciliation=true`.
- No visible next-page, page-number or step=3 pagination hints were observed in the frozen control response.
- Read-only boundary: PASS.

This narrows the source-contract risk for the frozen 2330 control. It does not certify complete MOPS revision history.

Still false:
- `boundedIntervalCoverageComplete=false`;
- `revisionCoverageComplete=false`;
- `knownAtVersionClockCertified=false`;
- `technicalContinuityCertified=false`;
- `selectionAuthority=false`.

Next: repeat bounded reconciliation on the frozen multi-company correction/cancellation controls, then characterize empty-month and higher-row-count pagination semantics before any completeness claim.
