# System 2 MOPSOV Source-Reported Version Clock V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / SOURCE_REPORTED_CLOCK_SEMANTICS
System 1 Formal Core: LOCKED

## Purpose

Determine whether the historical MOPSOV row fields can safely represent a **source-reported disclosure clock** for original/correction/cancellation versions.

This gate intentionally separates two concepts:

1. `sourceReportedAt`: the date/time that MOPS itself associates with the company disclosure row;
2. `availableAt / firstKnownAt`: the timestamp at which the information was independently observed as publicly retrievable.

The first may be historically recoverable. The second requires independent availability evidence and must not be fabricated from a historical display field.

## Official semantic basis

TWSE's material-information procedures require listed companies to enter material information into the exchange-designated internet reporting system. MOPS presents material-information records with the columns `發言日期` and `發言時間`.

Official references:
- TWSE material-information procedure, Article 6:
  https://twse-regulation.twse.com.tw/TW/law/DOC01_print.aspx?FLCODE=FL007111&FLNO=6
- MOPS material-information interface:
  https://mops.twse.com.tw/

These sources support interpreting the displayed clock as a source-reported company disclosure/input clock. They do not, by themselves, prove zero-latency public availability to every investor.

## Frozen controls

Use all five MOPS Revision Control Matrix V0.2 controls:
- 2467 dividend original + correction;
- 1459 capital-reduction schedule original + correction;
- 2321 capital-reduction decision original + correction;
- 1342 cash-capital-increase original + correction;
- 1342 cash-capital-increase cancellation.

## Row-level checks

For every matched version row:
- hidden `spoke_date` must be a valid YYYYMMDD;
- hidden `spoke_time` must be a valid HHMMSS;
- visible date must exactly equal hidden `spoke_date`;
- visible time must exactly equal hidden `spoke_time`;
- `seq_no` must be a positive integer;
- `date|time|seqNo` must be unique within the control chain.

For original + correction controls:
- at least one original and one correction row must exist;
- correction source-reported time must be strictly later than the earliest original source-reported time.

For cancellation:
- the row must contain 撤銷 or 取消 and have a consistent source-reported clock.

## Certification semantics

If all five frozen controls pass:
- `sourceReportedVersionClockSemanticsCertified=true`;
- `historicalKnownAtCandidateClockAvailable=true`.

But the following remain false:
- `publicAvailabilityLatencyCertified=false`;
- `knownAtVersionClockCertified=false`;
- `pitReplayUseAsAvailableAtAuthorized=false`.

This prevents a historical MOPS display timestamp from being silently promoted into exact PIT availability.

## Why knownAt remains blocked

A historical page can prove what timestamp MOPS associates with a record, but cannot retrospectively prove the exact second the row became publicly retrievable. A prospective capture lane is required to observe source-reported time versus actual capture/availability latency.

Until that evidence exists, System 2 may archive `sourceReportedAt` but may not use it as exact `availableAt` for PIT replay.

## Authority firewall

This gate is read-only and does not change:
- revisionCoverageComplete;
- noEventMayBeClaimed;
- technicalContinuityCertified;
- selection/push/capital/order authority;
- System 1 runtime.
