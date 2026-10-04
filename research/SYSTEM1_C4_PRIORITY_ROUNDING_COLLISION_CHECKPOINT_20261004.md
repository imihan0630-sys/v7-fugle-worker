# System 1 C4 PriorityScore rounding collision audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_PENDING / FORMAL_CORE_LOCKED

## Purpose

Measure how often Formal's one-decimal PriorityScore storage/ranking precision creates ties that would not exist under the exact same component formula at full precision, and whether later comparator fields then confirm or reverse the full-precision ordering.

This isolates score precision only. No weight, gate, bonus, comparator sequence or outcome is changed.

## Frozen runtime semantics

Current Formal path:

1. Build base PriorityScore from:
   - setupQuality * 0.28
   - sector.score * 0.14
   - institutionalScore * 0.16
   - fundamentalScore * 0.14
   - RS component * 0.14
   - RR component * 0.14
2. clamp to 0..100.
3. round base PriorityScore to one decimal inside `scoreCandidate()`.
4. add the existing market-consensus bonus.
5. clamp and round post-consensus PriorityScore to one decimal.
6. use deployed lexicographic ranking:
   - post-consensus priorityScore
   - rewardPerRisk
   - marketConsensusScore
   - setupQuality
   - sectorFlow
   - relativeStrength
   - deterministic preSortOrdinal fallback.

Because the bonus is integer-valued, the economically relevant precision loss occurs primarily at the pre-consensus one-decimal rounding stage.

## Implementation

Pure analyzer:
`research/system1_c4_priority_rounding_collision_v0_1.mjs`.

The analyzer consumes the same immutable V8.17+ C1 generation already validated by the C4 ranking audit.

It reconstructs the full-precision pre-consensus component sum, verifies that:
`round(fullPrecisionPre,1) === stored preConsensusPriorityScore`,
then applies the same consensus bonus and clamp.

## Precision collision definition

A precision collision requires:
- same price pool;
- same deployed post-consensus PriorityScore;
- deployed score < 100, so clamp-to-100 compression is excluded;
- different full-precision post-consensus PriorityScore.

Rows already compressed by the 100-point cap are reported separately, because cap compression is a different mechanism from decimal rounding.

## Pairwise outputs

For each rounding-collision pair:
- identify the first later Formal comparator that breaks the deployed tie;
- determine whether that later comparator:
  - agrees with the higher full-precision PriorityScore, or
  - reverses it.

Outputs:
- collisionGroupN;
- collisionPairN;
- laterComparatorAgreementN;
- laterComparatorReversalN;
- exactFullPrecisionTieN;
- collision counts by deciding comparator.

A reversal means only:
Formal rounded PriorityScore tied, then a later comparator ranked the lower full-precision composite ahead.

It does NOT prove worse realized performance.

## Top3 cutline outputs

For GENERAL and THOUSAND separately, the actual Formal cutline records:
- whether the selected-vs-next pair is a rounding-induced PriorityScore tie;
- both full-precision priorities;
- whether full precision would:
  - confirm the deployed selected name;
  - reverse the deployed selected name;
  - be not applicable.

## Full-precision research comparator

A research-only comparator is also computed:

`full-precision same formula + same bonus + same clamp -> existing later comparator order`

Everything else remains fixed:
- same eligible names;
- same GENERAL/THOUSAND pools;
- same max 3 per pool;
- no cross-fill;
- same later comparator fields;
- same deterministic ordinal fallback.

It reports:
- selected membership changes;
- selected order changes;
- per-pool deployed vs full-precision Top3.

This is an outcome-blind structural sensitivity test, not a candidate optimization.

## Daily collection

The existing:
`research/system1_c4_ranking_collection_v0_1.mjs`

now appends:
`priorityRoundingCollision`

to the same C4 evidence object.

No extra endpoint, provider call, scheduler, D1 schema, Worker hook or Production deployment is introduced.

## Interpretation guardrails

Forbidden conclusions from this audit alone:
- one-decimal rounding is harmful;
- full precision is economically superior;
- later comparator fields should be deleted;
- PriorityScore precision should be changed in Formal;
- a membership change is an improvement.

Permitted conclusions:
- non-zero collision incidence proves later comparator activation can be caused by deployed score precision;
- reversal incidence quantifies how often later comparator order disagrees with the exact same composite formula before rounding;
- repeated prospective cutline reversals establish practical ranking materiality, not economic superiority.

Any Formal precision/comparator change is Class-C and requires explicit owner approval after prospective/OOS outcome evidence.

## Formal boundary

No Formal A/B, gate, threshold, weight, comparator, 3+3/Top6, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the existing daily C1/C4 collector emit first genuine rounding-collision evidence.
3. Accumulate independent dates before interpreting practical materiality.
4. If cutline reversal is materially non-zero, join future outcomes under the existing validation maturity gates.
5. Only then may score precision become a Class-C optimization candidate.
