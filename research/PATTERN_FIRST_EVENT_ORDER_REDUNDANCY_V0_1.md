# D01 DL-022 — First-Event Order Redundancy V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_CORE_LOCKED

## 1. Research question

DL-021 froze point-in-time first-event clocks.

The next question is whether a separate "event-order feature" adds information beyond those clocks.

Answer at the first-event layer:

If the complete certified first-event clock bundle and source-event grouping are available,
first-event order is deterministically reconstructible.

Therefore:

FIRST_EVENT_ORDER_SOURCE_NOVELTY = NONE.

A separate order label can still be a human-readable representation,
but it is not an independent factor.

## 2. Order the source-event groups, not semantic labels

Multiple labels may arise from the same source close.

Examples:
- PARENT_REENTRY + PARENT_FAILURE on one close;
- LOCAL_BREAK_CONFIRMED + PARENT_BREAK_CONFIRMED on one close;
- FIRST_ORDINARY_OBSERVABLE_AFTER_CONSTRAINED_BREAK + FIRST_POST_BREAK_OUTSIDE_CLOSE on one source observation.

Such labels share one sourceEventGroupKey.

Do NOT impose an artificial within-bar sequence such as:
REENTRY -> FAILURE
when both were produced by one close.

The correct first-event sequence object is:

ordered source-event groups,
where each group contains an unordered set of semantic event labels.

## 3. Canonical first-event order representation

For one relationEpisodeKey and asOf:

1. retain only certified events occurred/available/observed by asOf;
2. group by sourceEventGroupKey;
3. every group must have one eventOccurredAt;
4. sort groups by eventOccurredAt;
5. if two distinct source groups share one timestamp, retain a tied partial-order block rather than inventing sub-order;
6. within each group sort labels only for canonical serialization, NOT causal order.

Output:
- orderedEventGroupKeys;
- orderedEventGroupTimes;
- eventLabelsByGroup;
- tiedTimeBlockCount;
- firstEventOrderSignature.

The signature is a deterministic derived fingerprint, not a predictor family.

## 4. Complete clocks imply order

Given complete first-event clocks plus source-group membership:

event-order = sort(unique source groups by occurredAt).

Therefore:
EVENT_ORDER_SIGNATURE is a deterministic child of the clock bundle.

It must not be scored beside:
- the first clocks;
- event ages;
- lifecycle category.

Doing so would double count path history.

## 5. Incomplete clocks do not justify a standalone order label

Suppose a row stores:
"BREAK -> REENTRY -> RECLAIM"
but lacks certified first clocks or eligible-session completeness.

That sequence is not promotion-grade evidence.

It cannot substitute for:
- exact eventOccurredAt;
- eventAvailableAt;
- firstObservedAt;
- sourceEventGroupKey;
- session/continuity completeness.

Therefore:
ORDER_LABEL_WITHOUT_CERTIFIED_CLOCKS = AUDIT_ONLY / NOT_INFERENCE_ELIGIBLE.

## 6. Partial order and simultaneous events

A total order is not always semantically valid.

If:
reentryAt == failureAt
and both share sourceEventGroupKey,

the correct representation is one tied source group:
{PARENT_REENTRY, PARENT_FAILURE}.

If two distinct source groups share the same eligible-session date but arise from different observation families:
preserve a tied-time block unless intraday clocks are independently certified.

Daily OHLC cannot manufacture intraday event ordering.

## 7. First-event order vs repeated-cycle sequence

DL-022 covers only the first occurrence of frozen transition types.

It does NOT encode:
- second reentry;
- second reclaim;
- repeated oscillation count;
- dwell-time sequence after first reclaim;
- later failed/reclaimed cycles.

Therefore two paths can share identical first-event clocks/order but differ later.

That is additional longitudinal path memory relative to the first-event bundle.

It belongs to a separate repeated-cycle experiment, not to first-event order.

## 8. External interpretation

Henderson et al. (2026), Finance and Stochastics,
model support/resistance as a path-dependent regime process.
This supports the importance of path history relative to current price alone.

General multi-state/event-history methodology characterizes process history using visited states and transition times.
D01 interpretation:
when first transition times are fully observed, an additional textual order label is a representation of those times rather than a new source.

Neither literature source proves trading alpha for an event-order feature.

## 9. Factor-zoo firewall

Never count:
- first-event clocks;
- event-order signature;
- lifecycle state;
- transition labels

as independent confirmations from one PRICE_OHLC path.

Hierarchy:

clock primitives
-> grouped event order
-> lifecycle/category display
-> strategy interpretation.

Only residual predictive tests against lower layers can justify keeping a higher representation for prediction.

## 10. Outcome firewall

No return/MFE/MAE outcome inspected.
No sequence pattern selected from outcomes.
No event-order score.
No N-bar rule.
No runtime wiring.

## 11. Current decision

FIRST_EVENT_ORDER =
DETERMINISTIC_DERIVED_VIEW_OF_CERTIFIED_CLOCKS_AND_SOURCE_GROUPS.

ORDER_LABEL_WITHOUT_CLOCK_CERTIFICATION =
NOT_PROMOTION_GRADE.

SIMULTANEOUS_LABELS =
ONE_SOURCE_GROUP / NO_ARTIFICIAL_SUBORDER.

REPEATED_CYCLE_SEQUENCE =
OUTSIDE_DL022 / SEPARATE_RESEARCH_QUESTION.

PREDICTIVE_INCREMENTALITY =
UNKNOWN.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 12. Exact next continuation

1. Encode grouped first-event order as a pure reconstructability helper.
2. Add tests for same-bar nested events, tied dates, missing source groups and future-event exclusion.
3. Do not add event-order signature to a predictive basis by default.
4. Next science: repeated-cycle path memory beyond the first-event bundle, with exposure/censoring control.
5. No outcome join / no Formal change.
