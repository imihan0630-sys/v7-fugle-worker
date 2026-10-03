# D01 DL-035 — Touch-Count Survivorship / Risk-Set Firewall V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / SURVIVORSHIP_FIREWALL / FORMAL_CORE_LOCKED

## 1. Problem

A common support/resistance claim is:
"more prior touches make a level stronger."

But a level observed at its fifth touch must have survived long enough to reach that fifth touch.

Therefore grouping zones by their eventual total number of touches creates future-conditioned survivorship.

Example:
Group A = zones that eventually have 1 touch.
Group B = zones that eventually have 5 touches.

Membership in Group B already reveals that the zone remained relevant/alive through earlier history.

This is not a legal decision-time predictor comparison.

## 2. Point-in-time touch state

At one parent/asOf only use:
- priorTouchCountThroughAsOf;
- priorBounceCountThroughAsOf;
- priorBreakCountThroughAsOf;
- lastTouchAtThroughAsOf;
- touch/bounce spacing known through asOf;
- zone age / exposure through asOf;
- current lifecycle state through asOf.

Prohibited:
- eventualTotalTouches;
- futureBounceCount;
- futureBreakCount;
- future time-to-next-touch.

## 3. Risk-set definition

For the kth touch analysis:

RiskSet(k) contains only zone episodes that:
- are causally valid and observable before the kth touch;
- have exactly the required prior history through the risk-set cutoff;
- have not already terminated under the frozen zone-lifecycle definition;
- have complete session/continuity path through the cutoff.

The kth touch itself is an event/landmark.
Its later bounce/break behavior belongs to future outcome analysis.

## 4. Survival-to-k is part of the conditioning set

A zone reaching touch k has survived / persisted to k by definition.

Therefore:
do not compare touch k zones to all touch 1 zones without conditioning on comparable risk history.

The scientific question is closer to:

Among zones alive and at risk just before the next interaction,
does prior touch/bounce history add information beyond age, exposure, salience, detector mechanics and market opportunity?

## 5. Touch count and bounce count differ

Touch:
price interacts with the frozen zone under the canonical interaction rule.

Bounce:
a later path response under a separately frozen event/outcome rule.

Do not use future bounce classification to define whether a past interaction "really counted" as a touch.

Touch count must be knowable at the interaction time.

## 6. Current count vs eventual count

Legal:
priorTouchCountThroughAsOf = 3.

Illegal:
eventualTotalTouches = 7 used as a feature on the third touch date.

Later parents may legitimately observe count 4, 5, 6...
Earlier parent rows stay unchanged.

## 7. Risk-set ladder

T0_RAW:
future response stratified by priorTouchCountThroughAsOf.

T1_EXPOSURE:
T0 + zone age / observable exposure / last-touch recency.

T2_OPPORTUNITY:
T1 + volatility / zone width / distance path / tick / liquidity / constrained sessions.

T3_SELECTION_SALIENCE:
T2 + detector Layer M + behavioral Layer S.

T4_FRONTIER_ROBUSTNESS:
T3 + detector-frontier / anchor-ablation / oracle sensitivity where available.

Only residual value after T3/T4 can support a touch-history representation candidate.

No directional sign is preregistered.

## 8. Why prior-bounce findings need careful interpretation

Published support/resistance studies report that bounce probability can rise with the number of prior bounces.

This is compatible with:
- self-reinforcing trader attention / anchoring;
- genuine persistent supply/demand;
- selection of historically salient levels;
- survivorship/risk-set conditioning;
- volatility / opportunity differences.

D01 does not reject those findings.
It narrows the future test so the system does not convert association into an unconditional "more touches = stronger" rule.

## 9. Touch-count slope/progression

Existing D01 rule remains:
touchCount is unsigned.

Continuous repeated-test progression such as:
- rejection distance compression;
- low-distance slope;
- close-distance slope

must be analyzed separately from count.

Two zones with the same touch count can have opposite progression.

Therefore touch count alone cannot replace progression geometry.

## 10. Terminal / broken zones

Once a zone is terminal under the frozen lifecycle for the specific risk-set experiment:
it exits the risk set.

It cannot later contribute "no touch" exposure as if still alive.

A later new boundary version is a new structural lineage.

Do not stitch it into the old touch history.

## 11. Censoring / missingness

End of observation window:
right-censoring.

Unknown session/continuity:
UNKNOWN / DATA_BLOCKED.

No next touch by follow-up:
censored/no-event according to future D16 outcome definition,
not automatically "strong support."

## 12. Current decision

EVENTUAL_TOTAL_TOUCH_COUNT_AS_PREDICTOR = PROHIBITED.

PRIOR_TOUCH_COUNT_THROUGH_ASOF = LEGAL_CONTEXT.

TOUCH_STRENGTH_DIRECTIONAL_SIGN = UNKNOWN.

RISK_SET_CONDITIONING = REQUIRED.

TOUCH_COUNT_INDEPENDENT_VOTE = REJECTED.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 13. Exact next continuation

1. Build a PIT touch-state constructor that rejects future totals.
2. Add risk-set membership fixtures.
3. Hand recurrent/landmark inference semantics to D16.
4. Next science: decompose prior-touch count from spacing/recency/dwell-time so count does not proxy exposure structure.
5. No outcome join / no Formal change.
