# System 2 Official Continuity Revision Coverage V0.1

Status: RESEARCH_ONLY / FAIL_CLOSED_REVISION_GATE
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Prevent the six official historical corporate-action actual-result lanes from being mistaken for complete revision/correction history.

The actual-result ranges are valuable final-state evidence, but final state is not the same thing as an immutable historical version chain.

## Required historical lanes

The gate covers six exchange/action-family contracts:

- TWSE ex-right/ex-dividend actual;
- TWSE capital reduction;
- TWSE par-value change;
- TPEx ex-right/ex-dividend actual;
- TPEx capital reduction;
- TPEx par-value change.

## Final-result evidence class

A source may be FINAL_RESULT_RANGE_ONLY when:

- its requested range is verified;
- its parser is complete;
- official rows are readable.

That state still keeps:

- historicalVersionArchiveComplete=false;
- correctionHistoryComplete=false;
- cancellationHistoryComplete=false;
- knownAtVersionClockCovered=false;
- revisionCoverageComplete=false.

A field name containing words such as correction, revision, cancellation or update is descriptive evidence only. It cannot by itself prove complete historical version coverage.

## Supplemental revision channel contract

A required lane can become revision-complete only when a supplemental official channel for the same exchange/action family and exact interval proves all of:

- channelType=REVISION_CORRECTION_CANCELLATION_HISTORY;
- coverageState=COMPLETE;
- exact range identity;
- parser completeness;
- immutable historical versions preserved;
- version knownAt clock covered;
- correction history complete;
- cancellation history complete;
- no missing source dates.

The receipt requires this for all six lanes.

## Current expected physical result

The current physical probe intentionally supplies no supplemental revision channels.

Therefore the expected accepted state is:

- finalResultReadyCount=6;
- supplementalRevisionReadyCount=0;
- revisionCoverageComplete=false;
- noEventMayBeClaimed=false;
- technicalContinuityCertified=false.

This is a negative acceptance gate, not a failure of the build. It proves that final-result pages cannot silently unlock revision completeness.

## Next engineering gate

Discover and physically validate supplemental official correction/cancellation/version-history sources, with MOPS and exchange official-document channels as candidates already identified by Shared research.

No D1 migration, Worker deploy, System1 runtime, strategy evaluation, push, capital or order behavior is authorized by this gate.


## 2026-10-03 physical negative acceptance

PR #409 physically verified the fail-closed revision gate against all six official historical actual-result lanes.

- Official Continuity Revision Coverage Readonly run `37134550069`: PASS_NEGATIVE_GATE.
- System2 Research CI run `37134550025`: PASS.
- V8 Regression run `37134549987`: PASS.
- Frozen interval: 2026-04-05 through 2026-10-02.
- requiredLaneCount=6.
- finalResultReadyCount=6.
- supplementalRevisionReadyCount=0.
- revisionCoverageComplete=false.

Every lane was physically readable with exact requested range and parser completeness, but every lane remained classified as `FINAL_RESULT_RANGE_ONLY`.

The physical source schemas exposed no field that proves a complete immutable correction/cancellation/version history. All six lanes therefore carry the blocker:

`SUPPLEMENTAL_REVISION_HISTORY_CHANNEL_INCOMPLETE`

This is the accepted result. It prevents a complete current/final result page from being relabeled as complete historical revision evidence.

Independent gates remain closed:

- noEventMayBeClaimed=false;
- suspensionCoverageComplete=false;
- symbolSessionCompletenessCertified=false;
- technicalContinuityCertified=false;
- selectionAuthority=false;
- finalSelectionEnabled=false;
- livePushEnabled=false;
- capitalImpact=false;
- orderImpact=false;
- system1RuntimeUsed=false.

Next: physically discover and validate supplemental official revision/correction/cancellation history channels. MOPS first-known/correction filings and exchange official-document announcements are source candidates from Shared research; no endpoint is accepted until its transport, schema, bounded-range coverage and version clocks are verified.
