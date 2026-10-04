# System 2 MOPSOV Empty Company-Month Certification V0.2

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / ENDPOINT_SPECIFIC_CERTIFICATION
System 1 Formal Core: LOCKED

## Purpose

Certify the physically characterized official MOPSOV company-month empty-response semantics so a bounded source contract can distinguish a genuine official empty month from an unusable or drifted response.

This certification is deliberately narrow. It is not a global NO_EVENT certificate and it does not imply revision-history completeness.

## Frozen empty signature

The V0.2 classifier requires every frozen empty control to match all of:

- HTTP 200;
- content type contains `text/html`;
- parsed rowCount=0;
- payload bytes exactly 2540;
- SHA-256 exactly `9d2e63bf800085e3953d9e675f72cd95131758de64546ad898a5beee56a39e5d`;
- normalized visible text exactly `公開資訊觀測站 資料庫中查無需求資料`;
- frozen structural signature:
  - HTML/body/table/MOPS present;
  - form absent;
  - stock code absent;
- no known error/access-block phrase.

Hash/size are used as fail-closed drift guards in addition to semantic text/structure. If MOPS legitimately changes the response template, certification must fail and the source must be re-characterized rather than silently accepted.

## Frozen controls

Empty:
- 1459 / 2026-01;
- 1342 / 2026-03;
- 1342 / 2026-08;
- 1342 / 2026-09.

Same-endpoint positive controls:
- 2467 / 2026-05;
- 1459 / 2026-06;
- 1342 / 2026-07.

Positive controls must remain HTTP 200 HTML, have non-zero parsed rows, retain company form/stock-code structure, differ from the empty hash/text and contain no known error signature.

## Certification semantics

Only when all four empty controls and all three positive controls pass may:

`emptyMonthSemanticsCertified=true`

be emitted for this frozen MOPSOV source contract.

The following remain false even when V0.2 passes:
- boundedIntervalCoverageComplete;
- actionFamilyCoverageComplete;
- cancellationHistoryComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- noEventMayBeClaimed;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified;
- selectionAuthority / finalSelectionEnabled / livePushEnabled;
- capitalImpact / orderImpact / system1RuntimeUsed.

## Fail-closed tests

Synthetic tests explicitly reject:
- HTTP drift;
- payload byte/hash drift;
- no-data text drift;
- non-zero rows in an empty control;
- structure drift;
- error-page signature;
- positive control becoming empty;
- positive control colliding with the frozen empty signature.

## Next gate after physical certification

1. stress higher-row-count pagination/truncation behavior;
2. validate MOPS source date/time/sequence as historical version knownAt candidates;
3. add exchange official-document cancellation/revocation evidence;
4. only after all supplemental revision-history requirements are complete may `revisionCoverageComplete` be reconsidered.

No D1/R2 mutation or trading authority is authorized by this source-level certification.
