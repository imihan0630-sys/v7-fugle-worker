# PATTERN ROLE REVERSAL V0.1

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED
Owner: D01
Stage: DL-034
Date: 2026-10-04

## Question
Separate structural persistence from role reversal / polarity flip. A resistance that is causally crossed and later approached from above may be tested as support without becoming a fresh independent structural root. The symmetric case applies to support crossed downward and later approached from below.

## Frozen identity
- Structural root identity and frozen boundary remain unchanged across a polarity transition.
- Polarity is a state of the same root, not a new independent vote or sample.
- Root age continues across the transition. A flip does not reset ROOT_AGE.
- A boundary version may change only under the existing causal version rules; polarity alone never mutates geometry.

## State machine
States:
- RESISTANCE_ORIENTED
- SUPPORT_ORIENTED
- CROSSING_PENDING_RETEST
- ROLE_REVERSAL_CONFIRMED
- ROLE_REVERSAL_FAILED
- NOT_EVALUABLE
- UNKNOWN

A role-reversal opportunity requires:
1. a valid pre-cross orientation;
2. a causally valid crossing event through the frozen zone;
3. eligible-session continuity;
4. a later retest opportunity from the opposite side.

Crossing alone never confirms reversal. Confirmation is only defined at a later valid retest. No retest means no reversal outcome.

## PIT and censoring
- All pre-cross orientation, crossing timestamp, side and retest eligibility must be known as-of their event clocks.
- Future retest cannot back-label the crossing as a successful flip at crossing time.
- Missing detector output, window censoring, trading suspension or unresolved technical-continuity gaps remain UNKNOWN / NOT_EVALUABLE according to existing D01 semantics.
- Corporate-action discontinuity cannot create a crossing or flip.

## Confound firewall
Role reversal must remain separate from:
- root/version age;
- current distance and DL-033 excursion path;
- DL-032 volatility/regime migration;
- interaction count / recency;
- detector salience;
- crossing opportunity;
- D02 volume acceptance;
- D04/D05 volatility/microstructure;
- D18 market regime.

No composite polarity score is authorized.

## Adversarial cases
1. Resistance crossed upward, no later retest -> CROSSING_PENDING_RETEST, not confirmed.
2. Resistance crossed upward, retest from above holds -> eligible support-oriented reversal observation.
3. Resistance crossed upward, retest closes through below -> ROLE_REVERSAL_FAILED, not a new support root.
4. Support crossed downward, no later retest -> pending, symmetric.
5. Support crossed downward, retest from below rejects -> eligible resistance-oriented reversal observation.
6. Same root flips twice -> one root with sequential polarity states, not three roots.
7. Corporate-action jump across zone -> NOT_EVALUABLE / DATA_BLOCKED.
8. Detector gap during crossing -> UNKNOWN; no inferred crossing.
9. Window censoring before retest -> censored opportunity, not failure.
10. New independent structure forms near old zone -> identity must be resolved by canonical root rules; proximity alone cannot merge roots.
11. Same-day crossing and apparent retest without event-order evidence -> NOT_EVALUABLE.
12. Retest occurs only after long excursion -> retain DL-033 path descriptors; do not attribute response to polarity alone.
13. Flip appears only under one volatility/regime state -> regime-specific candidate, not universal reversal.
14. Multiple child labels on same flip event -> one parent transition event; no vote multiplication.

## Future D16 handoff
Nested comparison target:
- R0: age + interaction history + DL-032 scale/regime + DL-033 location/path;
- R1: R0 + pre-cross orientation and crossing state;
- R2: R1 + retest-side / polarity-transition descriptors;
- R3: R2 + owner context from D02/D04/D05/D18.

Interpretation:
- POLARITY_INCREMENT_SURVIVES
- CROSSING_STATE_EXPLAINS
- PATH_CONTEXT_EXPLAINS
- REGIME_SPECIFIC
- NOT_EVALUABLE

Common support is mandatory. Same scan date and overlapping outcome windows are not independent evidence.

## Evidence boundary
Support/resistance literature supports path dependence and repeated-level memory, but does not by itself establish role-reversal alpha. Popular role-reversal descriptions are hypothesis material only. No outcome data were inspected in DL-034.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.
