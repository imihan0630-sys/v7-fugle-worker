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
