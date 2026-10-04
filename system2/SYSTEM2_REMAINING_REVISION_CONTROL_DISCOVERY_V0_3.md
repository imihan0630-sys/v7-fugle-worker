# System 2 Remaining Revision Control Discovery V0.3

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / READ_ONLY BOUNDED CONTINUATION
System 1 Formal Core: LOCKED

## Purpose

Continue representative-control discovery after the physically verified 4/6 milestone.

Remaining lanes:
- TWSE par-value change;
- TPEx ex-right/dividend.

The acceptance rule is unchanged. No threshold is relaxed because only two lanes remain.

## Search plan

### TWSE par-value change
Expand official final-result history backward to 2010-2019.

All official symbol-year candidates in that interval are eligible, up to a safety cap of 200. Stop after the first true revision-chain positive.

### TPEx ex-right/dividend
Continue the same deterministic 2026 official candidate ordering used in V0.2.

V0.2 queried the first 24 candidates after the same exclusion set.

V0.3 therefore:
- starts at candidate offset 24;
- queries at most the next 96 candidates;
- stops after the first true revision-chain positive.

This preserves deterministic non-overlapping search coverage.

## Revision-chain acceptance

A candidate must have:
- correct action-family language;
- no contamination from capital reduction / share exchange / par-value change in the ex-right/dividend lane;
- at least one original row;
- a later correction/cancellation-hint row;
- distinct date/time/seqNo;
- exact normalized subject stem or conservative containment >=72%.

A positive remains discovery-only until the exact exchange operational event is joined and physically verified.

## Negative-result semantics

If a lane remains negative:
- do not weaken subject/action-family rules;
- preserve the searched interval/offset as durable negative evidence;
- continue only with another preregistered bounded interval or a different official authority source.

## Authority boundary

Always false:
- representativeControlsFrozen;
- exact knownAt certification;
- bounded authority revision completeness;
- bounded revision-history completeness;
- global revisionCoverageComplete;
- NO_EVENT;
- technical continuity;
- all trading authority.
