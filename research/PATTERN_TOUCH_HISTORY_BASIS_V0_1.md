# D01 DL-036 — Touch History Minimal Path Basis V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ANTI_DOUBLE_COUNTING / FORMAL_CORE_LOCKED

## 1. Purpose

DL-035 legalizes priorTouchCountThroughAsOf but shows that touch count requires risk-set conditioning.

DL-036 asks:
what information inside touch history is not captured by count alone?

Freeze a minimal semantic basis without assigning bullish/bearish direction.

## 2. TH1 — Count

Primitive:
- priorTouchCountThroughAsOf.

Count answers:
how many canonical interactions occurred through asOf?

It does not encode:
- when they occurred;
- how clustered they were;
- how long price remained near the zone;
- how rejection geometry changed.

## 3. TH2 — Spacing

Primitive representation:
eligible-session ordinal gaps between consecutive touches.

For n touches:
number of inter-touch gaps = max(n-1, 0).

Continuous descriptors may include:
- latest gap;
- full gap vector;
- first-to-last touch span.

Derived:
- mean gap;
- median gap;
- touch frequency per unit exposure.

Do not count gap summaries as independent source votes beside the underlying touch-time sequence.

## 4. TH3 — Recency

Primitive:
- lastTouchAtThroughAsOf;
- lastTouchAgeEligibleSessions.

Recency is not the same as count.

Two zones can have equal count but one was last tested yesterday and one six months ago.

If exact eligible-session ordinals exist:
lastTouchAge is derived from lastTouchAt + asOf.

## 5. TH4 — Dwell / Occupancy

Question:
how much observable time did price spend interacting with / near the frozen zone?

Canonical basis should prefer exact canonical zone-interaction states rather than a new arbitrary proximity threshold.

Potential descriptors:
- observable sessions inside zone;
- observable sessions intersecting zone under the frozen touch rule;
- occupancy run lengths;
- time inside after entry before exit.

Derived:
dwellRatio =
observableZoneInteractionSessions / observableExposureSessions.

No new "sticky zone" threshold is frozen.

## 6. TH5 — Response Progression

Already owned by Pattern continuous progression:
- rejection distance;
- low-to-resistance / close-to-resistance slope;
- rejection compression;
- pairwise improvement;
- first/last rejection distance.

Same touch count can have opposite progression.

Touch progression remains unsigned.

## 7. Deterministic dependencies

D1:
if n touch timestamps are complete,
interTouchGapCount = max(n-1,0).

D2:
firstToLastTouchSpan =
sum(interTouchEligibleSessionGaps)
under certified ordinal semantics.

D3:
lastTouchAge =
ordinal(asOf) - ordinal(lastTouchAt).

D4:
touchRate =
priorTouchCount / observableExposure
is derived.

D5:
meanInterTouchGap =
sum(gaps)/gapCount
is derived.

D6:
dwellRatio =
dwellSessions / observableExposure
is derived.

D7:
count + rate + exposure are not three independent dimensions.

D8:
touch count + eventual response label are not decision-time confluence.

## 8. Counterexamples

Same count / different spacing:
four touches evenly spread vs four touches clustered in six sessions.

Same count + spacing / different dwell:
same interaction dates, but one path remains inside the zone longer.

Same count + recency / different progression:
same number and last-touch age, but rejection magnitude compresses in one and expands in another.

Therefore count is an insufficient path summary.

## 9. Future representation ladder

H0:
count only.

H1:
count + exposure.

H2:
H1 + spacing / recency.

H3:
H2 + dwell / occupancy.

H4:
H3 + continuous rejection progression.

H5:
derived categorical touch-history labels, only if later preregistered.

Any future category must beat flexible H4.

## 10. Factor-zoo firewall

Rejected:
- count + touchRate as two votes;
- count + meanGap + frequency as three votes;
- arbitrary "rapid retest" threshold;
- arbitrary "old level" age cutoff;
- "sticky zone" bucket;
- post-outcome best spacing window.

All share one touch-history root.

## 11. Current decision

TOUCH_COUNT = INCOMPLETE_PATH_SUMMARY.

SPACING_RECENCY_DWELL = DISTINCT_PATH_REPRESENTATIONS_RELATIVE_TO_COUNT.

SOURCE_NOVELTY = NONE.

TOUCH_HISTORY_VOTE_COUNTING = REJECTED.

DIRECTIONAL_SIGN = UNKNOWN.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 12. Exact next continuation

1. Encode TH1-TH5 and dependencies machine-readably.
2. Build pure touch-history summarizer with certified eligible-session ordinals.
3. Add same-count/different-spacing/dwell synthetic cases.
4. Hand H0-H4 ladder to D16.
5. Next science: competing mechanisms for repeated tests — salience reinforcement vs liquidity/supply-demand depletion — without assigning touch count a universal sign.
6. No outcome join / no Formal change.
