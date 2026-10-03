# System 2 MOPS Revision Source Capability V0.1

Status: RESEARCH_ONLY / READ_ONLY_CAPABILITY_PROBE
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Test whether the official MOPS historical material-information channel can expose an original corporate-action disclosure and its later correction as distinct historical records.

This is a candidate supplemental revision source for the S2-07 corporate-action completeness gate. It does not prove full revision coverage by itself.

## Transport under test

Modern MOPS uses a gateway:

- POST https://mops.twse.com.tw/mops/api/redirectToOld
- apiName=ajax_t05st01
- query parameters identify company, ROC year and month
- the gateway returns a temporary official MOPS history URL
- the returned URL is fetched read-only as HTML

Only HTTPS redirects to official MOPS hosts are accepted.

## Frozen positive control

Company:

- 2467 志聖

Month:

- ROC year 115, month 5

Expected date:

- 2026-05-22

Expected subject family:

- 公告本公司除息基準日等相關事宜

Public evidence shows an original disclosure and a later correction on the same date. The physical probe tests whether the official MOPS history response retains both rows as distinguishable records.

## Capability acceptance

The control is observed only if the official history response contains:

- at least two matching subject-family rows;
- at least one original row;
- at least one correction/cancellation-hint row;
- at least two distinct version keys from date/time/sequence metadata.

## Authority firewall

Even if the positive control passes:

- boundedIntervalCoverageComplete=false;
- actionFamilyCoverageComplete=false;
- cancellationHistoryComplete=false;
- knownAtVersionClockCertified=false;
- revisionCoverageComplete=false;
- noEventMayBeClaimed=false;
- symbolSessionCompletenessCertified=false;
- technicalContinuityCertified=false;
- historyMutationPerformed=false;
- strategyEvaluationPerformed=false;
- capacityRunProduced=false;
- selectionAuthority=false;
- finalSelectionEnabled=false;
- livePushEnabled=false;
- capitalImpact=false;
- orderImpact=false;
- system1RuntimeUsed=false.

## Next gate after physical characterization

If the MOPS positive control is observed:

1. validate query completeness across a bounded month and multiple companies/action families;
2. verify how corrections and cancellations are represented;
3. verify historical source-reported date/time semantics and whether they are safe as version knownAt clocks;
4. join with exchange official-document announcements for exchange-side cancellations/revocations;
5. only then consider supplying a supplemental revision-history channel to the revision coverage receipt.


## 2026-10-03 physical capability acceptance

PR #415 physically verified the MOPS historical revision-source capability.

- MOPS Revision Source Capability Readonly run `37135200146`: PASS_CAPABILITY_OBSERVED.
- System2 Research CI run `37135200161`: PASS.
- V8 Regression run `37135200126`: PASS.
- MOPS gateway HTTP=200 / gateway code=200.
- Official redirect URL passed the official-host allowlist.
- Historical response HTTP=200 / text/html.

Frozen control 2467 志聖 / 2026-05-22:

- history rowCount=9;
- expectedDateRowCount=3;
- matchingSubjectRowCount=2;
- originalRowCount=1;
- correctionOrCancellationRowCount=1;
- distinctVersionKeyCount=2.

Observed version rows:

1. 2026-05-22 16:34:06 / seqNo=2 / original subject:
   `公告本公司除息基準日等相關事宜`
2. 2026-05-22 17:42:13 / seqNo=4 / correction subject:
   `公告本公司除息基準日等相關事宜(更正)`

This proves that the official MOPS historical channel can preserve an original disclosure and a later correction as distinct records with separate date/time/sequence metadata.

It does **not** yet prove:
- boundedIntervalCoverageComplete;
- actionFamilyCoverageComplete;
- cancellationHistoryComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete.

Next: expand from one positive control to bounded multi-company/multi-action-family coverage and add cancellation/revocation controls before the MOPS lane may satisfy the supplemental revision-history contract.
