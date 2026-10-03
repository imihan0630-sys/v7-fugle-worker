# D01 -> D16 Handoff — Lifecycle Redundancy Inference Requirements V0.1

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_CLOSED / METHOD_OWNER_HANDOFF

## D01 semantic question

Does categorical Pattern lifecycle add predictive representation value beyond the complete continuous path/clock basis?

D01 does not ask whether lifecycle beats current geometry only.
That comparison is expected to favor lifecycle because lifecycle contains path memory.

## Required model ladder

C0_GEOMETRY_ONLY
C1_CONTINUOUS_PATH
C2_CLOCK_COMPLETE_PATH
C3_CATEGORICAL_LIFECYCLE

Promotion-grade comparison:
C3 vs FLEXIBLE(C2).

C3 vs LINEAR(C2) is diagnostic only.

## Why flexible C2 is required

Lifecycle categories are thresholded/nonlinear functions of:
- position relative to zone;
- event-clock existence/order;
- failure/reentry/reclaim chronology.

A one-hot state can outperform a weak additive linear model merely by encoding nonlinear interactions.

Therefore D16 must use at least one preregistered flexible continuous comparator capable of nonlinear response / interactions without using future outcomes to choose lifecycle cut-points.

D01 does not prescribe the exact estimator.

## Dependence / validation requirements inherited from DL-015/016

- common-support same-parent B0/B1 comparison;
- equal scan-date weighting;
- scanDate + symbol dependence handling;
- chronological OOS / purged holdout;
- episode-first and episode-holdout sensitivity;
- non-overlapping-date sensitivity for D5/D10 overlap;
- multiple-testing family includes lifecycle representation variants.

## Interpretation

If C3 beats C0 but not flexible C2:
PATH_MEMORY_SUMMARY_ONLY / NO_INCREMENTAL_CATEGORY_VALUE.

If C3 beats linear C2 but not flexible C2:
REPRESENTATION_NONLINEARITY / MODEL_SPECIFICATION_EFFECT.

If C3 stably improves flexible C2 under OOS/episode/date robustness:
REPRESENTATION_INCREMENTALITY_CANDIDATE,
not new source information.

Any Formal implication still requires all global maturity and owner-review gates.

No outcomes are opened by this handoff.
