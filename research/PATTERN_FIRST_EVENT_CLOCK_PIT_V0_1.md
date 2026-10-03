# D01 DL-021 — First-Event Clock Predictor / Censoring Contract V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / PIT_CLOCK_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-020 keeps first-event clocks as a distinct continuous/path-memory basis.

This tranche freezes what part of those clocks is legally usable at a decision timestamp.

Critical distinction:
- an event already observed by asOf can contribute decision-time state/age;
- an event not yet observed by asOf is right-censored through asOf;
- its future first-event date is not a predictor.

## 2. Predictor-side representation

For each event family E at parent decision cutoff:

If E occurred and was available/observed by asOf:
- E_occurred = 1;
- E_firstOccurredAt = historical clock;
- E_ageEligibleSessions = eligible-session distance from first event to asOf.

If E has not occurred by asOf:
- E_occurred = 0;
- E_firstOccurredAt = null in the decision-time feature object;
- E_ageEligibleSessions = null;
- E_censoringState = NOT_YET_OCCURRED_THROUGH_ASOF.

Do not use:
future first-event date,
future time-to-event,
future failure/reentry/reclaim distance
inside the predictor payload.

## 3. Zero is not missing / censored

Age 0 means:
the event occurred on the current eligible session.

Null age + occurred=0 means:
event has not occurred through asOf.

UNKNOWN means:
path/session provenance is insufficient to know whether it occurred.

These states are distinct.

## 4. Event families

Decision-time first-event clock families include:
- local break;
- first parent-zone entry;
- parent break;
- first ordinary observable after constrained break;
- first post-break outside close;
- parent reentry;
- parent failure;
- parent reclaim.

Not every clock is a predictive factor candidate.

Data-quality/observability clocks such as first ordinary observable remain guards/context first.

## 5. Path-memory value relative to aggregate excursion

Two paths can have identical:
- current distance;
- max favorable extension;
- max adverse excursion;
- cumulative signed distance;
- observable bar count

but different first-reentry timing/order.

Therefore first-event clocks can carry path-order memory beyond C1 aggregate path summaries.

This is representation novelty relative to C1.

It is not new PRICE_OHLC source information.

## 6. Nested-event redundancy

Parent failure is nested inside parent reentry semantics.

If failure and reentry occur on the same source close:
- retain both semantic clocks/labels;
- preserve one sourceEventGroupKey;
- do not count as two independent confirmations.

If reentry occurs earlier and failure later:
the two clocks carry distinct severity/timing information.

Reclaim remains conditional on prior reentry/failure.

## 7. Continuous age before buckets

Primary future representation:
continuous eligible-session age / ordinal difference.

Rejected as default:
- 0-2 day;
- 3-5 day;
- >5 day;
- fast/slow labels;
- any post-outcome optimized duration threshold.

If later a categorical duration is studied:
it is a derived representation and shares the same multiple-testing family.

## 8. Future event as outcome

A future event such as first failure after the parent decision may be studied as a time-to-event outcome.

Then:
- parents without the event by follow-up end are right-censored;
- event time belongs to the outcome table/analysis;
- it is never written back into the earlier decision-time child.

Exact inference method belongs to D16/statistical validation.

D01 freezes semantics only.

## 9. Landmark / as-of rule

At every parent decision timestamp:
construct features only from event history available through that cutoff.

A later parent for the same structural episode may legitimately observe:
- a previously censored event now occurred;
- age 0 at occurrence;
- increasing age in later parents.

This longitudinal update does not mutate earlier parent rows.

## 10. Clock redundancy ladder

T0:
current geometry + C1 aggregate path excursion.

T1:
T0 + occurred flags + continuous age for events already observed.

T2:
T1 + full event-order/source-group relations.

T3:
categorical lifecycle.

Future questions:
- T1 vs T0: does first-event timing/order add beyond aggregate excursion?
- T3 vs flexible T1/T2: does lifecycle compression add beyond continuous clocks?

No threshold buckets are needed for either question.

## 11. Kill rules

Block predictor use if:
- eventOccurredAt > asOf;
- eventAvailableAt > asOf;
- firstObservedAt > asOf;
- exact eligible-session path is uncertified;
- a future event date appears in decision-time feature payload;
- null event is coerced to age 0;
- UNKNOWN path status is coerced to not-occurred.

## 12. Current decision

FIRST_EVENT_CLOCKS = PATH_MEMORY_REPRESENTATION.
FUTURE_EVENT_TIME_AS_PREDICTOR = PROHIBITED.
NOT_YET_OCCURRED = RIGHT_CENSORED_THROUGH_ASOF.
CLOCK_AGE_BUCKETIZATION = REJECTED_AS_DEFAULT.
SOURCE_NOVELTY = NONE.
PREDICTIVE_INCREMENTALITY = UNKNOWN.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 13. Exact next continuation

1. Build a pure as-of clock-feature constructor with eligible-session age.
2. Add adversarial future-clock leakage / null-vs-zero / UNKNOWN cases.
3. Hand time-to-event outcome semantics to D16 without selecting an estimator in D01.
4. Keep clocks continuous; no N-bar bucket optimization.
5. Preserve runtime/outcome blockers.
