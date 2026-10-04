# D01 DL-034 — Structural Persistence vs Role Reversal / Polarity Flip V0.1

Updated: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ROLE_REVERSAL_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-030..DL-033 established structural-object identity, aging, scale migration and excursion-path semantics.

DL-034 addresses a different lifecycle question:

> When a confirmed resistance is broken upward and later revisited from above, or a confirmed support is broken downward and later revisited from below, is the same structural object expressing an opposite role, or are we merely observing generic breakout/retest mechanics?

Role reversal must not be assumed from a crossing alone.

No future return or retest outcome is opened in this tranche.

## 2. Evidence context

External evidence supports support/resistance structure but does not by itself establish an incremental polarity-memory effect.

- Osler (2000) finds published support/resistance levels predict intraday trend interruptions.
- Osler (2003) explains reversals and acceleration through technical levels using clustered take-profit and stop-loss orders around salient prices.
- Zapranis and Tsinaslanidis (2012) find horizontal support/resistance can predict trend interruption, while excess-return superiority over buy-and-hold is not established.
- Chung and Bellotti (2021) find repeated bounce history and elapsed time affect later bounce probability.
- Henderson, Jacka, Liu and Maeda (2026) explicitly model a fixed level whose support/resistance role changes with path-dependent regime transitions. Their role reversal is part of the model structure motivated by technical-analysis practice, not direct empirical proof that polarity memory has incremental alpha.

Therefore the research question is incremental:

Does prior opposite-role history add information beyond generic confirmed breakout/retest behavior?

## 3. Same root, new role episode

The default identity rule is:

- same persisted boundary;
- same structural root lineage;
- same semantic price space;
- same timeframe;
- causal confirmed crossing under the existing breakout lifecycle;

=> keep the same STRUCTURAL_OBJECT_ROOT.

Do NOT create a new structural root merely because orientation changes.

Instead create a new ROLE_EPISODE lineage.

Root age continues.
Structural-version age continues unless geometry actually changes under the existing version rules.
Role-episode age begins at the causal confirmed crossing timestamp.

## 4. Polarity mapping

Only two directional mappings are valid:

A. RESISTANCE_TO_SUPPORT_CANDIDATE
- originalRole = RESISTANCE;
- canonical confirmed upward breakout through the frozen zone;
- future first valid revisit must approach from above.

B. SUPPORT_TO_RESISTANCE_CANDIDATE
- originalRole = SUPPORT;
- canonical confirmed downward breakdown through the frozen zone;
- future first valid revisit must approach from below.

Any other direction is ROLE_REVERSAL_NOT_ELIGIBLE.

## 5. Crossing ownership

D01-05 owns breakout / false-breakout lifecycle semantics.

DL-034 consumes:
- breakoutEventId;
- breakoutDirection;
- breakoutConfirmedAt;
- lifecycle state;
- acceptance/persistence receipts where already required;
- D01-09 gap/price-limit constraints.

DL-034 does not invent:
- a new breakout close threshold;
- a new volume threshold;
- a new acceptance threshold;
- a new number of bars required to confirm crossing.

A wick-only or unconfirmed crossing is insufficient.

## 6. Outcome-leakage firewall

The first opposite-side retest cannot be used both to define the role flip and to evaluate it.

Frozen causal sequence:

R0 ORIGINAL_ROLE_ACTIVE

R1 CROSS_CONFIRMED_FLIP_ELIGIBLE
- created at the canonical confirmed crossing;
- candidateRole is assigned as the opposite polarity;
- no claim that the role flip has worked.

R2 FIRST_FLIP_TEST_OPPORTUNITY
- first causally valid revisit from the opposite side;
- predictor state frozen immediately before the interaction;
- outcome remains unopened in D01.

Only after that future outcome is observed may an analysis classify:
- FLIP_OBSERVED;
- FLIP_FAILED;
- AMBIGUOUS / CONSTRAINED.

For any first-retest efficacy study, R1 eligibility is the predictor state.
The first retest outcome must not be part of eligibility.

## 7. Candidate cancellation before first test

A flip candidate can lose eligibility before a valid opposite-side retest.

Examples:
- canonical breakout lifecycle is reclassified as failed/reclaimed under D01-05 before a valid retest;
- structural root is explicitly market-invalidated;
- semantic continuity breaks;
- corporate-action or session provenance becomes unresolved.

State:
FLIP_CANDIDATE_CANCELLED_BEFORE_TEST.

Cancellation is not a failed retest because no valid test opportunity occurred.

## 8. Generic breakout/retest control

This is the central falsification.

A retest may hold because:
- the breakout had momentum;
- D02 acceptance/persistence was strong;
- volatility/liquidity conditions favored continuation;
- orders clustered near a salient breakout boundary;
- trend/regime context favored continuation.

Therefore former-role history must be tested incrementally against a generic breakout/retest baseline.

Future comparison:

G0 GENERIC_BREAKOUT_RETEST
- same breakout direction/lifecycle;
- similar opportunity geometry;
- same context controls;
- boundary does not carry certified prior opposite-role structural history.

G1 FORMER_ROLE_POLARITY_CANDIDATE
- same conditions;
- boundary belongs to a certified prior support/resistance root with opposite original role.

If G1 does not improve on G0, role reversal is not an incremental structural-memory explanation.

## 9. First retest vs later retests

The first valid opposite-side retest is a distinct event.

If it succeeds:
- later opposite-side interactions belong to the same role episode;
- they do not create new independent role-flip events.

If it fails:
- later reacquisition requires explicit lifecycle semantics;
- do not relabel a later successful touch as if the first flip had succeeded.

No best-retest selection is allowed.

## 10. Relation to root/version identity

Role reversal alone does not mutate structural geometry.

If later causal anchors modify the boundary:
- follow DL-030 structural-version rules;
- preserve the same root only if causal lineage qualifies;
- otherwise classify identity break/resegmentation.

A role episode references the exact structuralVersionId that was active at flip eligibility.

## 11. Role episode age

Freeze separately:
- ROOT_AGE;
- STRUCTURAL_VERSION_AGE;
- ROLE_EPISODE_AGE.

ROLE_EPISODE_AGE starts at breakoutConfirmedAt for the flip candidate.

It does not start at the later successful bounce, because that would use outcome information to define the clock.

## 12. Gap / price-limit / tradability firewall

A price jump may cross a zone without providing a normal tradable crossing or retest path.

D01-09 / D05 owners determine constraint receipts.

Possible states:
- FLIP_ELIGIBLE_UNCONSTRAINED;
- FLIP_ELIGIBLE_CONSTRAINED;
- FLIP_TEST_OPPORTUNITY_CONSTRAINED;
- DATA_BLOCKED.

Constrained cases remain visible and are not silently mixed with unconstrained first-retest events.

## 13. Role history strength is not a vote

Store prior-role history:
- originalRoleInteractionCount;
- originalRoleBounceCount;
- originalRoleAge;
- originalRoleLastInteractionRecency;
- detector-salience / opportunity context.

Do not turn prior-role interaction count into an automatic strength score.

DL-028 aging/salience and DL-031 interaction-history controls remain applicable.

## 14. No behavioral story as proof

A common explanation says trapped traders exit at breakeven and missed breakout traders enter on retest.

That is a plausible behavioral story, not directly identified from chart data.

D01 may store structural/order-flow-compatible observations.
It may not infer:
- trapped trader intent;
- investor psychology;
- institutional repositioning

from OHLC alone.

D20 owns behavioral-mechanism research.

## 15. Event and sample identity

The following are NOT independent votes:
- original resistance/support event;
- confirmed breakout/breakdown;
- first opposite-side retest;
- volume confirmation;
- volatility confirmation.

They are linked observations within one causal parent / structural-root / breakout lifecycle.

Future inference must preserve:
- parent identity;
- structural root;
- role episode;
- breakout event;
- retest event.

Do not multiply N.

## 16. Future nested comparison

Future D16 analysis should preserve:

F0:
generic confirmed breakout/retest controls.

F1:
F0 + indicator that the boundary had a certified prior opposite role.

F2:
F1 + original-role history / salience / age controls.

F3:
F2 + DL-031/DL-032/DL-033 age, scale, regime and path controls.

Interpretation:

P0_GENERIC_RETEST:
former-role history adds no incremental value.

P1_PRIOR_ROLE_INCREMENT:
former-role history adds representation beyond generic retest mechanics.

P2_HISTORY_STRENGTH_INCREMENT:
specific prior-role history dimensions remain incrementally informative.

P3_CONTEXT_SPECIFIC:
effect survives only in preregistered context strata.

P4_NOT_EVALUABLE:
insufficient common support / provenance.

None proves causal memory or alpha.

## 17. Required manifest fields

Per flip candidate / opportunity:
- structuralRootId;
- structuralVersionId;
- objectEpisodeId;
- roleEpisodeId;
- originalRole;
- candidateRole;
- breakoutEventId;
- breakoutDirection;
- breakoutConfirmedAt;
- roleEpisodeAgeEligibleSessions;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- semanticSpace;
- timeframe;
- firstOppositeSideRetestOpportunityAt;
- approachSide;
- breakoutLifecycleStateAsOf;
- gapLimitConstraintState;
- originalRoleInteractionCount;
- originalRoleBounceCount;
- originalRoleAgeEligibleSessions;
- originalRoleLastInteractionRecency;
- D02 acceptance/persistence receipt;
- DL-031 age receipt;
- DL-032 scale/regime receipt;
- DL-033 path receipt;
- opportunity receipt;
- cancelReason if any;
- manifestVersion/hash.

No future-return / first-retest outcome field belongs in eligibility.

## 18. Current decision

CONFIRMED_CROSSING_EQUALS_PROVEN_ROLE_FLIP =
FALSE.

FIRST_RETEST_OUTCOME_IN_ELIGIBILITY =
PROHIBITED.

ROLE_REVERSAL_CREATES_NEW_ROOT =
FALSE.

ROLE_EPISODE_START =
BREAKOUT_CONFIRMED_AT.

FORMER_ROLE_HISTORY_MUST_BEAT_GENERIC_RETEST =
TRUE.

BEHAVIORAL_INTENT_FROM_CHART =
PROHIBITED.

VARIANT_OR_RETEST_COUNT_INCREASES_N =
FALSE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 19. Exact next continuation

1. Build deterministic role-reversal eligibility / first-test opportunity helper and adversarial tests.
2. Preserve same-root role episodes and cancellation states.
3. Freeze G0 generic-breakout-retest comparator semantics before outcomes.
4. Hand F0-F3 parent/root/role-episode inference to D16.
5. Execute DL-022..DL-034 research Node tests only through a reproducible approved research-test path.
6. Next D01 science: distinguish genuine polarity memory from simple breakout displacement / momentum and from boundary salience under matched first-retest opportunity.
7. No outcome join / no runtime wiring / no Formal change.
