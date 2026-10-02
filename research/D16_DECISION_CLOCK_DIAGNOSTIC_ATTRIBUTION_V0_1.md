# D16 Decision Clock Diagnostic Attribution V0.1

Updated: 2026-10-02 Asia/Taipei
Status: RESEARCH-ONLY / DIAGNOSTIC-SEMANTICS CORRECTION
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
Trading behavior impact: NONE

## Purpose

Prevent upstream Decision Clock incompleteness from being mislabeled as an A5 boundary miss.

The diagnostic question is causal:
- Did same-session A1 TWSE + A1 TPEx + B2 first form a candidate timestamp?
- If yes, was A5 prospectively ready no later than that timestamp?

If no same-session candidate exists, there is no A5 candidate boundary to miss.

## 1. Observed prospective evidence through 2026-10-02

Finalized promotion-grade dates:
- 2026-09-29;
- 2026-09-30;
- 2026-10-01.

All three:
- immutable attempt-one scheduled artifacts;
- coverage promotion eligible;
- count toward independentTradingDates;
- requiredReady = false;
- sameSessionClockReady = false;
- completeTradingDates contribution = false;
- precisionEligible contribution = false;
- candidateTimestamp = null.

Aggregate through 2026-10-01:
- independentTradingDates = 3;
- completeTradingDates = 0;
- precisionEligibleDates = 0;
- collector contract fingerprint consistent;
- exactDecisionClockAuthorized = false.

2026-10-02 raw evidence is not finalized yet and must not be counted as a finalized independent date.

## 2. A1 source evidence

### 2026-10-01

TWSE A1:
- 30 attempts;
- 29 TARGET_DATE_NOT_PRESENT;
- 1 NETWORK_ERROR;
- first observation saw payloadDate 2026-09-30;
- final observation still saw payloadDate 2026-09-30;
- no READY observation.

TPEx A1:
- 30 attempts;
- 13 TARGET_DATE_NOT_PRESENT;
- 17 NON_JSON_RESPONSE with HTTP 200;
- no READY observation.

### 2026-10-02 raw / unfinalized

TWSE A1:
- 30 attempts;
- all 30 TARGET_DATE_NOT_PRESENT;
- payload remained 2026-10-01 through final observation;
- no READY observation.

TPEx A1:
- 30 attempts;
- 13 TARGET_DATE_NOT_PRESENT;
- 16 NON_JSON_RESPONSE;
- final attempt READY;
- firstReadyAt = 2026-10-02T08:08:27.888Z = 16:08:27.888 Asia/Taipei;
- last observed NOT_READY = 2026-10-02T07:58:11.726Z = 15:58:11.726 Asia/Taipei;
- latency lower bound = 148.195 minutes after 13:30 close;
- latency upper bound = 158.465 minutes;
- observation interval = 10.269 minutes;
- recordCount = 868;
- precision interval is wider than the current <=5 minute requirement.

Interpretation:
TPEx has now produced a genuine prospective arrival bracket, while TWSE still has not produced same-date READY inside the observation window.

## 3. Publication latency and transport instability are different failure modes

The TPEx source has exhibited:
- prior-date valid JSON;
- HTTP 200 non-JSON payloads;
- eventual same-date valid JSON / READY.

Therefore:
- NON_JSON_RESPONSE must not be interpreted as publication NOT_READY;
- TARGET_DATE_NOT_PRESENT must not be interpreted as transport failure;
- READY arrival timing must retain the preceding observation state;
- the source clock is a mixture of publication timing and transport reliability unless the transport contract is stabilized.

A clock selected from unstable transport can measure the collector/provider failure path rather than the exchange's publication process.

## 4. A5 diagnostic attribution bug

Current daily evidence correctly defines:

sameSessionClockReady =
- A1 TWSE daily gate ready;
- A1 TPEx daily gate ready;
- B2 prospective dependency ready.

Only after sameSessionClockReady can candidateTimestamp exist.

A5 availability is then tested against that candidate timestamp.

The finalized-date acceptance implementation already uses the correct attribution rule:
A5_NOT_AVAILABLE_BY_CANDIDATE is reachable only when
- sameSessionClockReady === true;
- a5AvailableByCandidate !== true.

However the aggregation implementation previously populated:
`a5BoundaryFailureDates`
whenever
`a5AvailableByCandidate !== true`,
even when sameSessionClockReady was false and candidateTimestamp was null.

This makes upstream A1/B2 incompleteness appear as an A5-specific failure in the owner review packet.

## 5. Required corrected diagnostic semantics

A date belongs in `a5BoundaryFailureDates` only if:

`sameSessionClockReady === true && a5AvailableByCandidate !== true`.

Cases:

1. A1/B2 incomplete; candidateTimestamp = null
   - status family: upstream/incomplete required evidence;
   - A5 boundary failure = NO.

2. A1/B2 ready; candidate exists; A5 observed after candidate
   - A5 boundary failure = YES.

3. A1/B2 ready; candidate exists; A5 observed by candidate
   - A5 boundary failure = NO.

This correction changes diagnostic attribution only.

It does NOT:
- turn an incomplete date into complete;
- increase independent/complete/precision counts;
- authorize a Decision Clock;
- change candidate timestamps;
- change any strategy rule;
- change System 1;
- change execution/capital/push behavior.

## 6. Statistical reason

Misclassified blockers create optimization bias.

If all incomplete dates are mislabeled A5:
- engineering effort can be incorrectly directed toward A5;
- the observed frequency of A5 failure is inflated;
- the apparent value of changing A5 timing is overstated;
- upstream A1/B2 source-family failures are undercounted.

This is equivalent to label contamination in an error taxonomy.

The root-cause state must therefore be preserved before any latency model or architecture choice is evaluated.

## 7. Source-clock evidence ladder

Keep distinct:

- PROSPECTIVE_ARTIFACT_VALID;
- COVERAGE_PROMOTION_ELIGIBLE;
- SAME_SESSION_CLOCK_READY;
- A5_BOUNDARY_READY;
- COMPLETE_TRADING_DATE;
- PRECISION_ELIGIBLE_DATE;
- FREEZE_ELIGIBLE_CLOCK.

A date can satisfy an earlier layer and fail every later layer.

## 8. Global clock vs strategy-specific clock

No runtime change is authorized.

Before testing a strategy-specific clock:
1. freeze strategy -> required evidence family roles;
2. map evidence family -> exact source/dependency IDs;
3. classify REQUIRED / SUPPORTIVE / CONTEXT_ONLY / NOT_APPLICABLE;
4. measure how often the global clock is delayed by a source not REQUIRED by the strategy;
5. prove that relaxing a non-required source does not introduce hidden PIT or selection leakage;
6. version the dependency graph and test fail-closed behavior.

Until then, global vs strategy-specific clock remains a research hypothesis.

## Current decision

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

The correct action is diagnostic correction + continued source-family observation, not a clock-time or strategy change.

## Exact next continuation

1. Merge the diagnostic attribution correction only after System2 Research CI and V8 regression/repair PASS.
2. Re-run/read the next readiness aggregation and confirm historical 9/29–10/01 are no longer falsely listed as A5 boundary failures when sameSessionClockReady=false.
3. Finalize 2026-10-02 only through the next-calendar-day acceptance artifact.
4. Continue TWSE source-family revalidation because four raw dates still show no same-day READY within the observation window.
5. Stabilize/characterize TPEx transport before treating its first READY bracket as exchange-publication latency truth.
6. Build a research-only strategy-source dependency graph before discussing strategy-specific clocks.
