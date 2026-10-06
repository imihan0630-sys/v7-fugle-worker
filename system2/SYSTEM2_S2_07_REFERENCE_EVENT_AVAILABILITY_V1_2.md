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

For 4806, V1.2 also reuses the frozen event-specific semantic-episode rule: older 2025 capital-reduction rows are lineage, but they are not part of the 2026-10-02 loss-offset episode. The bounded episode begins from the latest matching `CORPORATE_DECISION` semantic seed and preserves only aligned follow-on rows.

## Independent evidence classes

V1.2 can recognize a historical availability proof only when an exact event/version has one of these separately certified forms:

1. `PROSPECTIVE_EXACT_VERSION_OBSERVER`
   - exact TPEx reference semantic hash and source-row hash identity;
   - genuinely prospective public observation of that exact reference version;
   - first observation no later than the replay cutoff.

2. `AUTHORITATIVE_PUBLICATION_TIME_CONTRACT`
   - exact TPEx reference semantic hash and source-row hash identity;
   - authoritative source semantics explicitly certify the publication/public-availability timestamp;
   - certified timestamp no later than the replay cutoff.

A historical display timestamp by itself satisfies neither class. MOPS event chronology also cannot certify the availability of the exact TPEx reference-price row unless the evidence is explicitly linked to that stable reference identity.

### Observation ID is not stable source identity

`eventVersionId` is an immutable **observation-version** ID. It intentionally includes source-capture provenance such as the capture ID / fetched-at clock, so the same unchanged official row can receive a different `eventVersionId` when observed again.

V1.2 therefore must not use `eventVersionId` as the cross-capture exact-source key.

Stable exact reference identity for this gate is:

- `semanticHash`: stable normalized event semantics;
- `sourceRowHash`: stable exact official source-row content.

`eventVersionId` remains useful receipt provenance only.

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


## 2026-10-07 merged-main physical acceptance

Receipt branch base: `777b5876917774a5ad4c32eac3e563df2b3acfe5`.

Dedicated V1.2 workflow run `37538390532`, job `112525069738`: PASS.

Physical result:
- stable semantic hash: `b6a4c97fdf3ded2bdae7048852540e4f58c1a64da4cbc012e350d5227e20d869`;
- stable source-row hash: `518fcdf6b0f3d5dc8ffaafba59556c86da3cda76dd0e46c528217740c33ae92b`;
- observed receipt eventVersionId: `S2-CA-EVENT:82da757e780d7be2c3474f5ca505d385b55705d44b520f291dc7383f88c391ca`;
- 18 MOPS capital-reduction family lineage rows;
- semantic seed `2026-02-24|16:28:25|3`;
- 8 semantic-aligned 2026 rows, all source-clock eligible and all retrospective-only;
- independent exact-source historical public-availability evidence: 0;
- state `REFERENCE_EVENT_HISTORICAL_AVAILABILITY_NOT_PROVEN`;
- blocker `OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN`;
- `firstKnownAt=null`, `availableAt=null`, `pitEventReplayEligible=false`;
- System1 isolation guard PASS.

Evidence receipt:
`system2/evidence/S2_07_REFERENCE_EVENT_AVAILABILITY_V1_2_PHYSICAL_20261007.json`.
