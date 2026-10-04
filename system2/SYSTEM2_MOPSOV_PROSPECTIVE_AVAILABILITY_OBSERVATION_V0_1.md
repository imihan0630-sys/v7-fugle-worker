# System 2 MOPSOV Prospective Availability Observation V0.1

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / OBSERVATION_ADAPTER_IMPLEMENTED / PROSPECTIVE EVIDENCE NOT YET COLLECTED
System 1 Formal Core: LOCKED

## Purpose

Provide the missing bridge between the already-certified MOPSOV source-reported disclosure clock and a future prospective public-availability measurement.

This contract does **not** reconstruct historical `availableAt`.

It records two different clocks without collapsing them:

- `sourceReportedAt`: the MOPS row's certified source-reported disclosure/input clock;
- `observedAt`: when System 2 actually observed the row as retrievable.

For a prospective poll, `observedAt` is only a **first-observed availability upper bound**.

## Observation modes

### RETROSPECTIVE_READBACK

Used when reading an already-existing historical MOPS row.

Allowed:
- preserve `sourceReportedAt`;
- preserve version identity;
- verify parser/source-clock semantics.

Forbidden:
- infer first public availability;
- compute a meaningful publication-latency bound;
- set `firstObservedAvailableAt`;
- certify knownAt.

State:
`RETROSPECTIVE_SOURCE_CLOCK_ONLY`.

### PROSPECTIVE_POLL

Used only when the collector is operating prospectively.

If a row is first observed at `observedAt`:
- `firstObservedAvailableAt = observedAt`;
- `latencyUpperBoundFromSourceReportedSeconds = observedAt - sourceReportedAt`;
- this remains an upper bound, not exact public availability.

If the same collector has a prior explicit `NOT_OBSERVED` observation no more than five minutes earlier, the receipt may additionally be marked `precisionEligible=true`.

Even then, V0.1 does **not** set:
- `publicAvailabilityLatencyCertified=true`;
- `knownAtVersionClockCertified=true`;
- `pitReplayUseAsAvailableAtAuthorized=true`.

Those require a separately preregistered multi-event prospective evidence policy.

## Why no high-frequency schedule is added here

MOPS material-information events are irregular. Adding a new frequent GitHub Actions poller before a sample-count / cadence / cost policy is frozen would:
- spend Actions minutes continuously;
- still not guarantee capturing useful new events;
- create a new operating cadence without evidence.

Therefore V0.1 implements the adapter and fail-closed semantics only.

No new schedule, Worker Cron, D1 writer or notification is introduced.

## Physical verification

The PR probe reads the five frozen MOPS revision controls from the official endpoint using `RETROSPECTIVE_READBACK`.

Acceptance requires every historical row to remain:
- source-clock readable;
- availability-uncertified;
- without fabricated `firstObservedAvailableAt`;
- without fabricated publication latency;
- ineligible for exact PIT availableAt use.

This proves the adapter refuses retrospective leakage. It is not prospective latency evidence.

## Next evidence gate

Before `knownAtVersionClockCertified` may be reconsidered:

1. freeze a prospective sampling policy:
   - required independent event count;
   - event-family diversity;
   - polling cadence / cost ceiling;
   - prior-NOT_OBSERVED requirement;
   - tolerated latency / clock skew policy;
2. collect genuinely prospective receipts;
3. preserve collector provenance and actual poll timestamps;
4. evaluate stability across events/dates;
5. only then submit a knownAt certification candidate.

Until then:
- `publicAvailabilityLatencyCertified=false`;
- `knownAtVersionClockCertified=false`;
- `pitReplayUseAsAvailableAtAuthorized=false`;
- `revisionCoverageComplete=false`;
- all trading authority remains false.

## 2026-10-04 physical observer implementation acceptance

PR #480 merged as `4fd9e3fa0cbb8f0cb20193d74ebb09035d58085d`.

Physical checks:
- MOPSOV Prospective Availability Observer Readonly `37180439893`: PASS.
- System2 Research CI `37180439874`: PASS.
- V8 Regression `37180439841`: PASS.
- unit fail-closed tests PASS.
- official MOPS readback covered 9 historical version rows from all five frozen revision controls.
- all 9 historical versions were classified `RETROSPECTIVE_SOURCE_CLOCK_ONLY`.
- `prospectiveObservationCount=0`.
- no historical row received fabricated `firstObservedAvailableAt`;
- no historical row received fabricated publication-latency upper bound.

Engineering status:
- prospective availability observation adapter implemented;
- a genuine prospective poll can preserve `sourceReportedAt`, actual `observedAt`, first-observed availability upper bound and an optional prior-NOT_OBSERVED <=5-minute precision window.

Evidence status remains:
- `publicAvailabilityLatencyCertified=false`;
- `knownAtVersionClockCertified=false`;
- `pitReplayUseAsAvailableAtAuthorized=false`.

No high-frequency schedule, Worker Cron, D1 writer or notification was added.
