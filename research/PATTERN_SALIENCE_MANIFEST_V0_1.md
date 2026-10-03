# D01 DL-029 — Salience Manifest and Common-Support Governance V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / MATCHING_GOVERNANCE / FORMAL_CORE_LOCKED

## 1. Purpose

DL-028 defines O/M/S salience layers but deliberately does not choose a matching estimator.

DL-029 freezes the parent-specific evidence manifest that any later D16 matching/weighting procedure must consume.

Goal:
prevent hidden control selection, silent extrapolation, and post-outcome pruning.

## 2. Unit of control manifest

One manifest is defined for one true structural parent zone.

Identity:
- trueParentZoneId;
- trueParentZoneVersion;
- symbol;
- parentConfirmedAt;
- immutable decision parent / scope linkage;
- negativeControlContractVersion;
- detectorSalienceContractVersion.

Rows:
- exactly one TRUE_ZONE row;
- zero or more PSEUDO_ZONE rows from the frozen DL-027 pool.

No row may be created from post-confirmation data.

## 3. Required row payload

Every row stores:
- candidateId;
- candidateType = TRUE_ZONE / PSEUDO_ZONE;
- lower / upper / center / width;
- sourceDate for pseudo rows;
- preConfirmationCutoff;
- O-layer descriptor payload + availability mask;
- M-layer descriptor payload + availability mask;
- S-layer descriptor payload + availability mask;
- session/continuity/source receipt references;
- round-price/tick control reference where used;
- candidatePayloadFingerprint.

Missing descriptor:
UNKNOWN / NOT_AVAILABLE,
never neutral zero.

## 4. Pool authority

All eligible pseudo candidates from DL-027 remain in the manifest.

Forbidden:
- deleting awkward candidates because they match poorly;
- keeping only the closest candidate;
- keeping only candidates that later produce convenient outcomes;
- replacing an empty pool with a hand-picked price.

The manifest is frozen before outcomes.

## 5. Matchability layers

Per true parent:

E1_MATCHABILITY
requires complete O-layer opportunity provenance for the true row and candidate.

E2_MATCHABILITY
requires E1 + complete M-layer mechanical-selection provenance.

E3_MATCHABILITY
requires E2 + complete S-layer behavioral-salience provenance.

A row can be:
- E1_ONLY;
- E2_ONLY;
- E3_READY;
- NOT_MATCHABLE_MISSING_PROVENANCE;
- NOT_MATCHABLE_OUTSIDE_COMMON_SUPPORT;
- CONTROL_POOL_EMPTY.

No higher-layer claim is made from a lower-layer row.

## 6. Common support is not optional

A matching/weighting estimator must diagnose overlap/common support before outcomes are interpreted.

If a true zone lies outside the observed control covariate support:
do not force-match.

Status:
TRUE_PARENT_OUTSIDE_COMMON_SUPPORT.

Such parents:
- remain in coverage accounting;
- may remain in E0/E1 descriptive analysis if valid;
- are excluded from the matched E2/E3 target estimand unless a separately preregistered extrapolation estimand exists.

No extrapolation is authorized in v0.1.

## 7. Target-population shift

Matched estimates apply to the matchable structural-parent population, not automatically all structural parents.

Therefore any future report must show:
- total true parents;
- parents with non-empty control pools;
- E1 matchable parents;
- E2 matchable parents;
- E3 matchable parents;
- outside-common-support parents;
- missing-provenance parents.

Coverage loss is itself a research result.

Do not hide it.

## 8. Balance / matching ownership

D01 freezes covariates and semantics.

D16 owns the preregistered method for:
- propensity / distance / weighting / exact strata;
- caliper if any;
- common-support algorithm;
- balance metric;
- variance / finite-sample inference.

Those method choices must be frozen before outcome inspection.

D01 does not pick the method by whichever gives the best Pattern result.

## 9. Manifest fingerprint

A parent manifest must commit to:
- sorted candidate IDs;
- candidate payload fingerprints;
- salience contract versions;
- negative-control pool version;
- parent identity / cutoff.

Changing one candidate or descriptor after outcome opening:
NEW_MANIFEST_VERSION / PROVENANCE_CONFLICT,
never silent UPDATE.

## 10. Duplicate / near-duplicate pseudo controls

Two pseudo candidates can derive from different source dates but create identical zone coordinates.

They remain distinct source candidates for audit,
but a future estimator must not accidentally multiply identical geometry as independent evidence.

Required diagnostic:
geometryDuplicateGroupKey.

D01 does not decide final weight sharing.

## 11. Known-control contamination

A pseudo candidate overlapping any structural zone known by parent confirmation is excluded under DL-027.

A pseudo that later becomes a confirmed zone after the cutoff remains valid historically.

Do not retroactively remove it.

This preserves point-in-time control integrity.

## 12. Current decision

SALIENCE_MANIFEST = REQUIRED.

ALL_PSEUDO_CANDIDATES_RETAINED = REQUIRED.

FORCED_MATCH_OUTSIDE_COMMON_SUPPORT = PROHIBITED.

MATCHED_TARGET_POPULATION = MATCHABLE_PARENTS_ONLY.

COVERAGE_LOSS_REPORTING = REQUIRED.

POST_OUTCOME_CONTROL_PRUNING = PROHIBITED.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 13. Exact next continuation

1. Build a deterministic manifest constructor and duplicate-geometry diagnostic.
2. Add explicit no-common-support / empty-pool / missing-provenance fixtures.
3. Freeze a D16 handoff for E1/E2/E3 coverage and balance reporting.
4. Next science: construct a stronger detector-frontier control concept to distinguish "confirmed structural anchor" from near-threshold detector rejects, without changing k=3/260.
5. No outcome join / no Formal change.
