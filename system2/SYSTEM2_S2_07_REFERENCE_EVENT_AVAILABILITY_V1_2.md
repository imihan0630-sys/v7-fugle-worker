# System 2 S2-07 Reference Event Historical Availability V1.2

Updated: 2026-10-07 Asia/Taipei  
Status: RESEARCH_ONLY / BUILD_LANE / NEGATIVE_GATE_CONTRACT  
Scope: 4806 / TPEX / CAPITAL_REDUCTION / resume 2026-10-02 only  
Formal Core: LOCKED  
Trading authority: NONE

## Purpose

Continue from the physically ready but PIT-blocked V1.1 technical-continuity bridge.

V1.1 proved the bounded mechanical reference-price reset for 4806, but the official reference event remained:

- `knowledgeTimeMode=HISTORICAL_UNKNOWN`;
- `firstKnownAt=null`;
- `availableAt=null`;
- `pitEventReplayEligible=false`.

V1.2 tests only whether independent historical public-availability/version-clock provenance exists for that exact reference event.

It does not change price geometry, strategy logic, ranking, candidate authority, capacity, push, orders, System 1, RAW A1 history, or adjusted history.

## Clock firewall

The existing MOPS clock contract remains authoritative:

- source-reported disclosure time is useful version chronology;
- historical source-reported time is **not** exact public `availableAt`;
- a retrospective readback cannot become `firstObservedAt`;
- present-day retrieval cannot be backdated into the 2026-10-02 replay clock.

Therefore MOPS historical rows are processed only in `RETROSPECTIVE_READBACK` mode.

## Independent evidence classes

V1.2 can recognize a historical availability proof only when an exact event/version has one of these separately certified forms:

1. `PROSPECTIVE_EXACT_VERSION_OBSERVER`
   - exact version identity;
   - genuinely prospective public observation;
   - first observation no later than the replay cutoff.

2. `AUTHORITATIVE_PUBLICATION_TIME_CONTRACT`
   - exact version identity;
   - authoritative source semantics explicitly certify the publication/public-availability timestamp;
   - certified timestamp no later than the replay cutoff.

A historical display timestamp by itself satisfies neither class.

## Expected current disposition

For the current 4806 evidence set, the expected honest state is:

`REFERENCE_EVENT_HISTORICAL_AVAILABILITY_NOT_PROVEN`

with:

- `firstKnownAt=null`;
- `availableAt=null`;
- `pitEventReplayEligible=false`;
- `pitReplayBlocker=OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN`.

This is an accepted negative gate, not an engineering failure.

## Physical probe

`system2/scripts/probe_s2_07_reference_event_availability_readonly_v1_2.mjs`

The probe:

1. fetches the same official TPEx capital-reduction reference lane used by V1.1;
2. requires exactly the 4806 / 2026-10-02 official event;
3. reads 4806 MOPS history retrospectively;
4. validates source-reported row clocks without promoting them;
5. supplies no fabricated independent historical availability evidence;
6. requires the fail-closed PIT state;
7. performs no D1 or production mutation.

## Promotion boundary

Even a future V1.2 positive availability proof would certify only this event's bounded causal availability gate. It would not by itself set:

- `knownAtVersionClockCertified=true` globally;
- `revisionCoverageComplete=true`;
- `technicalContinuityCertified=true`;
- strategy/candidate authority;
- push/capital/order authority.

## Next gate

If the physical V1.2 probe confirms the negative state, stop blind historical-clock promotion attempts for this bounded event unless new independent official evidence appears.

Continue non-conflicting BUILD_LANE work while:
- 5381 / 6241 / 3086 remain DATA_LANE RAW A1 coverage-blocked;
- 4806 remains usable only as bounded present-day research geometry, not PIT replay continuity.
