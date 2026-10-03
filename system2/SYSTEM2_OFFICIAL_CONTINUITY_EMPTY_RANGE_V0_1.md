# System 2 Official Continuity Empty-Range Semantics Probe V0.1

Status: RESEARCH_ONLY / READ_ONLY_CHARACTERIZATION
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Characterize how the six official TWSE / TPEx historical corporate-action result endpoints represent a requested interval containing zero events.

This is required before an empty response can ever contribute to a System2 NO_EVENT proof.

## Frozen probe interval

The physical probe requests:

`2026-10-03 .. 2026-10-03`

This is a Saturday and therefore a known non-trading day. The purpose is response-shape characterization, not a claim about an individual stock.

## States

The pure characterization core distinguishes:
- `EXACT_RANGE_ZERO_ROWS_OBSERVED`;
- `ZERO_ROWS_RANGE_IDENTITY_MISSING`;
- `EXACT_RANGE_WITHOUT_ROW_CONTAINER`;
- `EMPTY_OR_NO_DATA_RANGE_UNVERIFIED`;
- `NON_EMPTY_RANGE`;
- transport / HTTP / parse errors.

Only the first state is an empty-response **candidate**. It is still not semantic certification.

## Authority firewall

Even when an endpoint returns exact requested range + explicit zero rows:

- `emptyRangeSemanticsCertified=false`;
- `sourceCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`.

A single observed weekend response cannot prove long-window source completeness, historical revision coverage or official publication semantics.

## Physical workflow

`.github/workflows/system2-official-continuity-empty-range-readonly.yml`

The workflow:
- uses no secrets;
- writes no D1 rows;
- deploys no Worker;
- changes no Cron;
- does not call System1 runtime.

## Follow-up

After the six physical response shapes are known:
1. identify which endpoints can provide exact-range empty evidence;
2. keep endpoints with missing range identity fail-closed;
3. require separate revision/correction coverage before any bounded NO_EVENT receipt;
4. combine only with PIT-universe and suspension/resumption completeness.

No continuity transform or selection authority is enabled.
