# D01 DL-027 — Structural-Zone Mechanism Negative-Control Boundaries V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MECHANISM_FALSIFICATION / FORMAL_CORE_LOCKED

## 1. Purpose

Repeated crossing of a MAJOR structural zone may reflect:
A. structural / behavioral memory tied to confirmed anchors;
B. generic volatility-driven crossing of any nearby horizontal level;
C. microstructure / tick / liquidity effects.

DL-026 controls opportunity covariates.

DL-027 adds an outcome-blind mechanism control:
compare the true structural zone with pre-asOf non-anchor horizontal pseudo-zones.

## 2. Not a guaranteed-null placebo

A pseudo-zone may accidentally lie near a real but undetected supply/demand area.

Therefore terminology:
MECHANISM_NEGATIVE_CONTROL_BOUNDARY.

Not:
TRUE_NULL_PLACEBO.

Interpretation is asymmetric:
- no difference weakens structural-specific mechanism;
- a difference does not by itself prove causal memory or alpha.

## 3. Parent-matched control universe

For one true parent zone:

Use the same:
- symbol;
- parent decision date/asOf;
- semantic space;
- volatility/liquidity/regime environment;
- zone width.

Candidate pseudo-zone centers come only from price observations known no later than the parent-zone confirmation cutoff.

No future price may create the control pool.

## 4. Candidate construction V0.1

Inputs:
- true parent lower/upper/confirmedAt;
- eligible TECHNICAL_CONTINUITY closes through parentConfirmedAt;
- all confirmed structural zones known by parentConfirmedAt.

For each unique historical eligible close C:
- pseudoWidth = true parent width;
- pseudoLower = C - pseudoWidth/2;
- pseudoUpper = C + pseudoWidth/2.

Exclude:
1. pseudo-zone overlaps the true parent zone;
2. pseudo-zone overlaps any other confirmed structural zone known by cutoff;
3. source close has invalid session/continuity provenance.

Retain all remaining candidates.

Do not select "the best" pseudo-zone after outcomes.

## 5. Why use all candidates

Choosing one pseudo-level can create hidden researcher degrees of freedom.

V0.1 freezes the candidate pool itself.

Future D16 analysis may:
- use all controls with parent-level weighting;
- preregister a covariate-matching procedure using only pre-outcome features.

D01 does not choose the estimator/matching algorithm.

## 6. Required pseudo-zone diagnostics

For every candidate store:
- sourceDate;
- center;
- lower/upper;
- width;
- distance from current/local boundary;
- ATR-normalized width/distance where valid;
- round-price / tick proximity;
- pre-parent crossing history if causally available;
- source/session/continuity receipt references.

These diagnostics permit opportunity adjustment.

They do not create scores.

## 7. Structural-overlap exclusion

A negative-control candidate overlapping a known confirmed structural zone is not a clean non-anchor control.

Exclude based only on structural objects known by parentConfirmedAt.

Do not use future-discovered zones to retroactively clean the pool.

## 8. Comparison logic

Future mechanism ladder:

NC0:
true MAJOR zone recurrence/path descriptors.

NC1:
simple 260-session-high comparator.

NC2:
non-anchor pseudo-zone pool, same symbol/date/width.

Interpretation:

True ~= pseudo after Q4 controls:
GENERIC_LEVEL_CROSSING explanation strengthened.

True > pseudo robustly:
STRUCTURAL_SPECIFIC_REPRESENTATION_CANDIDATE,
still not alpha proof.

True only beats pseudo before tick/vol/liquidity controls:
OPPORTUNITY/MICROSTRUCTURE_CONFOUND.

## 9. Multiple-testing firewall

Pseudo-zone pool is one preregistered control family.

Do not:
- report only the weakest pseudo-zone;
- choose offsets after outcomes;
- discard controls that cross too often/too rarely after seeing results;
- search zone widths.

Failed/awkward controls remain in the audit manifest.

## 10. Pool insufficiency

Some parents may have:
- no eligible non-overlapping pseudo-zone;
- too little pre-confirmation history;
- incomplete continuity/session provenance.

Status:
NEGATIVE_CONTROL_NOT_EVALUABLE.

Do not replace with a hand-picked level.

## 11. Current decision

STRUCTURAL_ZONE_MECHANISM_NEGATIVE_CONTROL =
FROZEN_V0_1.

TRUE_NULL_CLAIM =
REJECTED.

FUTURE_OUTCOME_SELECTION_OF_PSEUDO_ZONE =
PROHIBITED.

STRUCTURAL_MEMORY_ALPHA =
UNKNOWN.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 12. Exact next continuation

1. Build deterministic pseudo-zone pool constructor.
2. Hash/fingerprint the parent-specific pool before outcomes.
3. Hand parent-level weighting/matching inference to D16.
4. Do not runtime-wire pseudo-zones; research analysis only.
5. Next science: separate detector-selection salience from structural-zone mechanism if true zones outperform pseudo controls.
6. No outcome join / no Formal change.
