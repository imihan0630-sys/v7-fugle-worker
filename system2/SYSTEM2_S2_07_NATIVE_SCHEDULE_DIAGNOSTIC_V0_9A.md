# System 2 S2-07 Corporate-Action Native Schedule Diagnostic V0.9a

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / BUILD_LANE / DIAGNOSTIC
Formal Core: LOCKED
Trading authority: NONE

## Purpose

Inspect the already verified official capital-reduction / par-value-change reference lanes for
corporate-action-native stop/resume schedule evidence after generic exchange halt/resumption
matching produced 0/17 exact matches in V0.8.

This diagnostic does not infer a suspension interval from date proximity.

## Frozen universe

The same 17 corporate-action events evaluated in V0.7/V0.8.

For each event preserve:
- sourceId;
- market;
- symbol;
- action family;
- effective/resume date from the source's canonical `恢復買賣日期` field;
- eventVersionId;
- sourceRowHash;
- raw `詳細資料`;
- normalized date tokens extracted from that detail.

## Fail-closed rule

A pre-resume detail date is only a chronology candidate until source-native semantics
identify it as a suspension/stop-trading boundary.

Do not promote:
- nearest prior date -> stop date;
- missing generic halt row -> NO_SUSPENSION;
- one detail date -> certified interval;
- event linkage -> technical continuity.

## Output

The readonly physical probe exists only to determine whether a V0.9 schedule parser can be
frozen without guessing. It performs no D1/R2 writes, Worker deploy, strategy evaluation,
selection, push, capital/order, or System1 runtime mutation.
