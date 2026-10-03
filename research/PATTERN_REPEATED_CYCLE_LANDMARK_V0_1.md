# D01 DL-025 — Repeated-Cycle Landmark / Risk-Set Firewall V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / PIT_LANDMARK_FIREWALL / FORMAL_CORE_LOCKED

## 1. Problem

Repeated-cycle features are not baseline-static.

They appear only after:
- parent break;
- first reentry/failure;
- first reclaim;
- later recurrent events.

Using a later repeated-cycle state as a predictor for an earlier parent decision would leak future history.

This creates a guarantee-time / immortal-time style bias:
an episode must survive and evolve long enough to become "repeated-cycle exposed".

## 2. Frozen population distinction

BASELINE_BREAK_COHORT
- parent decisions at/near original break;
- repeated-cycle features are NOT_YET_AT_RISK or unavailable.

REPEAT_RISK_LANDMARK_COHORT
- later immutable parent/asOf rows;
- first reclaim has already occurred and is available by decision cutoff;
- exact path/session provenance is complete;
- repeated-cycle history is computed only through current asOf.

These are different estimand populations.

Do not generalize repeat-risk findings back to all original breakouts without a separately justified design.

## 3. Dynamic parent landmark

D01 does not freeze one arbitrary "5 days after break" landmark.

The natural research object is the immutable decision parent that exists at a later asOf.

At each parent:
- eligibility is evaluated using only history available through that parent;
- predictor state is frozen at that parent;
- any forward outcome begins after that parent decision cutoff.

This is a dynamic landmark / time-varying predictor problem.

Exact statistical implementation belongs to D16.

## 4. Repeat-risk eligibility

A parent is REPEAT_RISK_ELIGIBLE only when:

- parentFirstReclaimAt exists;
- parentFirstReclaimAt <= parent asOf / decision cutoff;
- event available/observed by parent cutoff;
- relationEpisodeKey is still valid under same immutable boundary lineage;
- lifecycle/session/continuity path is complete through parent asOf;
- current parent row is prospectively legitimate;
- repeated-cycle summary contains no future event.

If first reclaim has not happened:
NOT_YET_AT_REPEAT_RISK.

This is not equivalent to:
ELIGIBLE_WITH_ZERO_REPEATED_CYCLES.

## 5. Zero versus not-at-risk

At a later parent after first reclaim:
zero repeated cycles means:
eligible exposure exists, but no second return/reclaim cycle has occurred through asOf.

Before first reclaim:
repeated-cycle count is not zero.
It is not yet defined for the repeat-risk process.

Frozen distinction:
- NOT_YET_AT_RISK => counts null;
- AT_RISK_ZERO_EVENTS => counts 0;
- AT_RISK_WITH_EVENTS => counts >0;
- UNKNOWN => provenance incomplete.

Do not coerce null to zero.

## 6. Outcome clock reset

For a repeat-risk parent at date t:

predictors:
only history <= t.

future outcome:
starts strictly after t under the frozen outcome contract.

Do not use:
- outcome measured from original break date while predictor is learned later;
- event history after t;
- later relation revisions.

This aligns predictor availability and outcome start.

## 7. Immortal-time kill rules

Invalid:
1. classify original break parents by whether they eventually experience repeated cycles;
2. use eventual cycle count as a baseline feature;
3. include pre-reclaim person-time in a "repeated-cycle exposed" group;
4. define repeat-risk eligibility using future reclaim occurrence;
5. select survivors to a future landmark and interpret result as unconditional breakout alpha;
6. update an earlier parent row when a later repeated cycle occurs.

Valid:
- later parent rows may observe more accumulated history;
- earlier parent rows remain unchanged.

## 8. Landmark selection bias

Conditioning on first reclaim selects a special path population.

Therefore a repeat-risk result answers:
"among episodes that have already completed the first reclaim and remain valid/observable at this later parent, does accumulated repeated-cycle history add forward predictive information?"

It does NOT answer:
"do repeated cycles explain all initial breakouts?"

The conditioning event must be explicit in interpretation.

## 9. Time-varying update

For the same relationEpisodeKey:

parent t1 after first reclaim:
0 repeated cycles.

parent t2:
1 completed repeated cycle.

parent t3:
1 completed + one open return.

These are legitimate longitudinal predictor updates on different immutable parents.

They are not mutations of t1.

They are also not three independent structural episodes.

## 10. D16 handoff

Future analysis may use:
- dynamic landmark prediction;
- time-varying covariate framework;
- recurrent-event model;
- multi-state model.

D01 does not choose the estimator.

Required regardless of method:
- synchronized predictor cutoff and forward-outcome start;
- no future exposure classification;
- relationEpisode/symbol/date dependence handling;
- explicit conditioning population;
- common-support comparison.

## 11. External statistical interpretation

Methodological literature warns that covariates known only after follow-up begins must not be treated as baseline-fixed.
Landmark or time-dependent approaches are standard tools for avoiding guarantee-time/immortal-time bias.

D01 translation:
repeated-cycle Pattern features are legal only at parents where that history already exists.

## 12. Current decision

REPEATED_CYCLE_FEATURE_TYPE =
TIME_VARYING / LANDMARKED.

BASELINE_BACKFILL =
PROHIBITED.

NOT_YET_AT_RISK != ZERO_EVENTS.

REPEAT_RISK_ESTIMAND =
CONDITIONAL_LATER-PARENT POPULATION.

IMMORTAL_TIME_FIREWALL =
REQUIRED.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 13. Exact next continuation

1. Encode a pure landmark-eligibility constructor.
2. Test future-reclaim leakage, null-vs-zero, asOf age-zero and longitudinal parent updates.
3. Hand conditional-estimand language to D16.
4. Next science: distinguish repeated-cycle "frequency" from episode-age/volatility/liquidity opportunity to cross boundaries.
5. No outcome join / no Formal change.
