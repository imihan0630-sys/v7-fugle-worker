# D01 DL-023 — Repeated-Cycle Path Memory and Exposure Contract V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_CORE_LOCKED

## 1. Research question

DL-022 proves that first-event order is reconstructible from certified first clocks + source-event groups.

But first-event clocks stop at the first:
- reentry;
- failure;
- reclaim.

Two relation episodes can therefore share the same complete first-event bundle and still differ later:

Episode A:
first break -> first reentry -> first reclaim -> stable above.

Episode B:
first break -> first reentry -> first reclaim
-> second reentry -> second reclaim
-> third reentry still open at asOf.

Repeated cycles contain additional longitudinal path memory relative to the first-event bundle.

They remain derived from the same PRICE_OHLC / continuity source.

## 2. Recurrent-event dependence

Repeated reentry/reclaim events within one relationEpisodeKey are not independent observations.

One long-lived episode may generate many events.

Therefore:
- event count != sample count;
- repeated cycles do not multiply independent N;
- relationEpisodeKey remains the within-episode dependence identity;
- scanDate and symbol dependence remain relevant for later inference.

## 3. Exposure-time confounding

Raw repeated-cycle count is confounded by time at risk.

An episode observed for 60 eligible sessions has more opportunity to accumulate cycles than one observed for 5 sessions.

Required exposure primitives:
- repeatRiskStartAt;
- observableEligibleSessionsAtRisk;
- constrainedEligibleSessionsAtRisk;
- sourceBarsThrough;
- lifecyclePathCompletenessState.

Derived:
cycleRatePerObservableSession =
recurrentSourceEventGroupCount / observableEligibleSessionsAtRisk.

This rate is a derived diagnostic, not an independent vote.

No annualization / arbitrary scaling is promoted.

## 4. What starts repeated-cycle risk

V0.1 repeated-cycle analysis begins only after the first reclaim is certified.

Why:
before first reclaim, the first reentry/failure/reclaim chronology belongs to the first-event bundle.

After first reclaim:
the episode has completed its first return-and-recovery loop and becomes at risk for additional reentry/reclaim cycles.

repeatRiskStartAt =
parentFirstReclaimAt.

If first reclaim has not occurred by asOf:
REPEATED_CYCLE_NOT_YET_AT_RISK.

Do not coerce that to zero recurrence risk.

## 5. Canonical repeated source events

After repeatRiskStartAt, retain source-event groups rather than label counts.

RETURN_GROUP:
a source group containing PARENT_REENTRY and optionally PARENT_FAILURE.

RECLAIM_GROUP:
a later source group containing PARENT_RECLAIM.

Failure is severity metadata on RETURN_GROUP.
It is not a second event count.

A repeated completed cycle is:
RETURN_GROUP -> later RECLAIM_GROUP.

An open cycle at asOf is:
RETURN_GROUP observed
with no later reclaim yet.

## 6. Minimal repeated-cycle primitives

RC1 — recurrentReturnGroupCount
number of distinct RETURN_GROUP source groups after first reclaim.

RC2 — recurrentFailureGroupCount
subset of RETURN_GROUP groups carrying PARENT_FAILURE.

RC3 — recurrentReclaimGroupCount
number of distinct later RECLAIM_GROUP groups.

RC4 — completedRepeatedCycleCount
number of causally paired RETURN -> RECLAIM cycles.

RC5 — openRepeatedCycle
0/1 at asOf.

RC6 — observableEligibleSessionsAtRisk
exposure denominator.

RC7 — repeatGapEligibleSessions
eligible-session gaps between successive recurrent source groups.

RC8 — lastRepeatTransitionAgeEligibleSessions
time since the latest recurrent source group to asOf.

These are path-memory descriptors.
None receive independent-vote status.

## 7. Pairing rule

Process source groups in causal order after repeatRiskStartAt.

State:
READY_FOR_RETURN
-> when RETURN_GROUP occurs: OPEN_RETURN
-> next RECLAIM_GROUP closes one completed repeated cycle and returns READY_FOR_RETURN.

Rules:
- two RETURN groups without an intervening reclaim do not create two completed cycles;
- later worsening from reentry to failure on a different day before reclaim is severity progression inside the same open return episode unless a future version preregisters otherwise;
- one source group with reentry + failure is one RETURN_GROUP;
- reclaim cannot precede its paired return;
- a return still open at asOf remains right-censored / open, not a failed completed cycle count.

## 8. Exact session exposure

Exposure and gap durations require certified eligible-session dates.

Count-only path completeness is insufficient.

Required:
- exact eligible date-set commitment;
- continuity date-set commitment;
- zero unresolved missing sessions;
- no duplicate dates;
- TECHNICAL_CONTINUITY semantics.

If exposure path is uncertified:
repeated-cycle rate/gap descriptors = UNKNOWN / DATA_BLOCKED,
not zero.

## 9. Predictor-time vs future recurrent outcome

At a parent/asOf:
only repeated events occurred and available through asOf may enter predictor state.

Future second/third cycles are prohibited predictors.

Later research may treat future recurrence as:
- recurrent time-to-event outcome;
- counting-process outcome;
- multi-state outcome.

Method choice belongs to D16.

D01 freezes only causal semantics.

## 10. Repeated-cycle information hierarchy

R0:
first-event clock bundle only.

R1:
R0 + repeated source-event counts + exposure.

R2:
R1 + recurrent event gap times / last-event age.

R3:
R2 + full recurrent source-group sequence.

R4:
derived repeated-cycle labels / churn categories.

Future representation question:
does R2/R3 add stable value beyond R0/R1?

Do not jump directly to churn buckets.

## 11. Factor-zoo firewall

Rejected by default:
- high churn / low churn thresholds;
- 2+ failures as a magic cutoff;
- repeated-break score;
- cycle-count majority votes;
- separate vote for reentry count + failure count + reclaim count;
- post-outcome choice of recurrence window.

A failure count is nested within return-group count.
A cycle rate is derived from count + exposure.
A churn label is derived from recurrent path.

## 12. External statistical interpretation

Recurrent-event methodology emphasizes that:
- later events within the same subject/episode are correlated;
- analysis based only on first event discards later-event information;
- simple counts discard timing/exposure information;
- method choice depends on recurrence dependence and the scientific question.

D01 translation:
repeated cycles can contain path memory beyond first clocks,
but their event count is neither independent N nor self-normalizing evidence.

## 13. Current decision

REPEATED_CYCLE_SOURCE_NOVELTY = NONE.

REPEATED_CYCLE_PATH_MEMORY_VS_FIRST_EVENT_BUNDLE =
YES_BY_CONSTRUCTION.

RAW_RECURRENCE_COUNT_AS_FACTOR =
REJECTED.

EXPOSURE_AND_CENSORING_CONTROL =
REQUIRED.

REPEATED_CYCLE_PREDICTIVE_INCREMENTALITY =
UNKNOWN.

REPEATED_CYCLE_OUTCOME_ANALYSIS =
D16_METHOD_OWNER / NOT_OPENED.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 14. Exact next continuation

1. Build outcome-blind repeated-cycle summarizer over source-event groups.
2. Add synthetic same-first-clocks / different-later-cycles counterexamples.
3. Freeze open-cycle/right-censoring semantics.
4. Hand recurrent-event dependence/exposure requirements to D16.
5. Next science: test whether repeated-cycle full sequence contains information beyond counts + exposure + gap-time summaries before any sequence category.
6. No outcome join / no Formal change.
