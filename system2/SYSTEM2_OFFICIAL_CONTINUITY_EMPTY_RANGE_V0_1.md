# System 2 Official Continuity Empty-Range Characterization V0.1

Status: RESEARCH_ONLY / PHYSICAL_CHARACTERIZATION_PENDING
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Characterize how the six already verified TWSE / TPEx historical corporate-action result endpoints represent an exact requested interval with zero returned rows.

This step exists because zero rows are not automatically equivalent to NO_EVENT.

## Frozen test interval

Default characterization date:

- 2026-10-03

This is a non-trading Saturday and is used only as a transport/response-semantics probe. The result does not by itself prove historical symbol-level NO_EVENT.

## Required evidence per endpoint

The probe records:

- HTTP status and content type;
- raw payload hash;
- response start/end identity;
- whether the response exactly identifies the requested one-day interval;
- row count;
- bounded official status/message fields;
- top-level JSON keys and TPEx table count where present.

## Fail-closed rule

V0.1 never promotes an observed zero-row response to certified empty semantics.

Even when all six endpoints return an exact-range zero-row response:

- emptyRangeSemanticsCertified=false;
- noEventMayBeClaimed=false;
- symbolSessionCompletenessCertified=false;
- technicalContinuityCertified=false.

A follow-up acceptance step may freeze endpoint-specific empty semantics only after the physical responses are inspected and their response identity is unambiguous.

## Isolation

No secrets, D1 writes, Worker deploy, Cron, System1 runtime, strategy evaluation, capacity run, push, capital or order behavior are used.

## Next gate

After physical characterization:

1. freeze endpoint-specific accepted empty-response signatures;
2. add negative tests for missing/mismatched range identity;
3. only then allow the corporate-action completeness core to consume certified empty ranges;
4. continue to revision/correction and suspension/resumption coverage.

No selection authority is enabled by this probe.
