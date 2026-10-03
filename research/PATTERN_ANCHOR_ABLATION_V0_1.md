# D01 DL-032 — Structural-Zone Anchor-Ablation Robustness V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / DETECTOR_ROBUSTNESS / FORMAL_CORE_LOCKED

## 1. Purpose

A confirmed structural zone can be highly dependent on one anchor.

If deleting one historical anchor while keeping the same asOf / detector version causes:
- zone disappearance;
- large center displacement;
- large width displacement;
- different structural lineage,

then future apparent zone behavior may partly reflect detector fragility.

DL-032 freezes anchor-ablation diagnostics before outcomes.

This does NOT change the official zone.

## 2. Frozen leave-one-anchor-out design

For one confirmed zone at its immutable asOf:

For each confirmed structural anchor known by asOf:
- remove exactly that anchor from the detector input;
- keep all bars / sessions / semantic space / detector parameters unchanged;
- rerun only the research detector;
- record the resulting zone geometry or explicit no-zone state.

No future anchor is added.
No new detector threshold is tuned.

## 3. Minimum-anchor edge case

If removing one anchor leaves fewer than the detector's minimum required anchor count:

status:
MINIMUM_ANCHOR_DEPENDENCE.

This is a structural design fact,
not automatically a detector failure.

Do not mix such cases with ablations where sufficient anchors remain.

## 4. Continuous influence descriptors

For every eligible ablation:
- removedAnchorId;
- ablationZoneExists;
- ablationCenter;
- ablationWidth;
- centerShiftAbs;
- centerShiftPct;
- centerShiftATR where valid;
- widthShiftAbs;
- widthShiftPct;
- anchor-set overlap/Jaccard where meaningful;
- resulting zone lineage diagnostics.

Aggregate:
- eligibleAblationCount;
- survivingAblationCount;
- zoneLossCount;
- zoneLossFraction;
- maxAbsCenterShiftATR;
- medianAbsCenterShiftATR;
- maxAbsWidthShiftPct;
- anchorInfluenceVector.

No "robust/fragile" cutoff is frozen.

## 5. Official identity is immutable

Leave-one-out reruns are diagnostics.

They do not:
- change zoneId/version;
- rewrite official anchors;
- alter parentConfirmedAt;
- alter RG2 relation identity;
- create new Pattern votes.

A diagnostic alternate zone is not a competing parent object.

## 6. Why this matters for mechanism inference

A future true-zone effect can be decomposed by detector stability.

If effect appears mainly where:
- zoneLossFraction is high;
- one anchor causes very large center shift;
- one anchor dominates geometry,

then detector-selection sensitivity is a plausible explanation.

If effect persists across the continuous anchor-influence range:
detector fragility is less able to explain it.

Neither result proves structural memory.

## 7. Anchor influence vs behavioral salience

Anchor-ablation is Layer M:
mechanical detector robustness.

It is not the same as Layer S behavioral salience.

A zone can be:
- mechanically robust but behaviorally low-salience;
- mechanically fragile but highly salient;
- both;
- neither.

Future analysis must not collapse the two.

## 8. No post-outcome stable-subset mining

Forbidden:
- choose an anchor-stability cutoff after outcomes;
- report only low-shift zones;
- discard minimum-anchor-dependent zones because they hurt results;
- tune zone construction to improve ablation robustness.

All diagnostics remain continuous / explicit.

## 9. Current decision

ANCHOR_ABLATION_ROBUSTNESS = FROZEN_V0_1.

OFFICIAL_ZONE_MUTATION_FROM_ABLATION = PROHIBITED.

ROBUSTNESS_THRESHOLD = NONE.

ANCHOR_INFLUENCE = MECHANICAL_SELECTION_DIAGNOSTIC.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 10. Exact next continuation

1. Build pure ablation-summary aggregator over research-detector outputs.
2. Add minimum-anchor / zone-loss / large-shift synthetic cases.
3. Add anchor-ablation descriptors to Layer M salience manifest.
4. Hand continuous influence sensitivity to D16; no subset threshold.
5. Next science: detector-definition uncertainty across preregistered alternative swing oracles without choosing a winner from outcomes.
6. No outcome join / no Formal change.
