# D01 DL-029 — Boundary Identity and Detector-Version Perturbation Robustness V0.1

Updated: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ROBUSTNESS_FALSIFICATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-028 froze the M0/M1/M2 mechanism ladder:
- M0 non-anchor horizontal controls;
- M1 same-detector salience controls;
- M2 confirmed structural zones.

DL-029 asks a stricter question before any outcome join:

> If a future M2 confirmation-specific representation appears, is it robust to small outcome-blind changes in boundary identity and detector implementation, or is it an artifact of one exact line/zone definition?

A support/resistance claim that exists only at one exact numerical boundary or one exact detector build is a fragile representation candidate.

DL-029 does not test returns. It freezes the perturbation semantics that future D16 analysis must use.

## 2. Evidence and counterevidence

External evidence motivates this firewall:

- Lo, Mamaysky and Wang (2000) emphasize that technical-pattern recognition is subjective unless converted into systematic algorithms.
- Osler (2001/2003) provides a microstructure mechanism for support/resistance behavior through clustered stop-loss and take-profit orders near round numbers. This means a level can appear meaningful because of price-grid/order clustering rather than latent structural memory.
- Chen, Huang and Lai (2009) show that data snooping, non-synchronous trading and transaction costs materially alter conclusions for technical trading rules across Asian equity markets, including Taiwan.
- Henderson, Jacka, Liu and Maeda (2026) formalize support/resistance as a path-dependent state process, but explicitly use fixed levels in a tractable model and note that real support/resistance can be more complex and dynamic.

Therefore robustness to reasonable predeclared boundary/detector alternatives is required before interpreting an effect as structural rather than definition-specific.

## 3. Perturbation families

### P0 — CANONICAL

The frozen canonical structural zone from the current D01 detector.

This is the reference object, not a privileged winner after outcomes.

### P1 — LEGAL_TICK_NEIGHBOR PERTURBATIONS

Use the as-of-date Taiwan legal price-grid neighbors supplied by the canonical market-microstructure owner.

Do not assume a constant tick.

Given canonical [lower, upper] and legal adjacent prices:
- lowerPrev;
- lowerNext;
- upperPrev;
- upperNext.

Generate, when valid:

1. SHIFT_DOWN_ONE_GRID_STEP
   [lowerPrev, upperPrev]

2. SHIFT_UP_ONE_GRID_STEP
   [lowerNext, upperNext]

3. EXPAND_ONE_GRID_STEP
   [lowerPrev, upperNext]

4. CONTRACT_ONE_GRID_STEP
   [lowerNext, upperPrev]

If contraction inverts/collapses the zone, preserve an explicit INVALID_CONTRACTION result.

The grid receipt must include:
- tickRuleVersion;
- tickRuleAsOf;
- market/board;
- source/provenance receipt.

A future tick table cannot be backfilled into the old landmark.

### P2 — LEAVE_ONE_ANCHOR_OUT

If the structural zone has multiple causal anchors, recompute the same detector once for each anchor omitted.

All anchor jackknife variants are retained:
- zone survives with new boundary;
- zone survives but identity materially changes;
- zone disappears.

Zone disappearance is evidence of identity fragility, not a reason to discard the variant.

The family is NOT_EVALUABLE when a zone has insufficient anchor multiplicity for a meaningful leave-one-anchor-out exercise.

### P3 — SEMANTICALLY_EQUIVALENT DETECTOR VERSION

A detector version declared semantically equivalent to the canonical version must reproduce the same as-of candidate/zone manifest.

Any unexplained difference in:
- candidate identity;
- source anchors;
- confirmation timestamp;
- boundary;
- lifecycle state;
- provenance

is SEMANTIC_REGRESSION.

It is not counted as "robustness diversity."

### P4 — PREDECLARED ALTERNATIVE DETECTOR

A detector variant with intentionally different mechanics may be used only if:
- its specification and parameter manifest were frozen before outcomes;
- it consumes the same point-in-time semantic space;
- it has explicit version/hash provenance;
- no parameter was selected because it produced better returns.

Earlier D01 governance already treats PIP/kernel-style detectors as independent robustness checks and keeps DTW exploratory / ML deferred. DL-029 preserves that architecture boundary.

Alternative detectors are robustness challengers, not extra votes.

## 4. Structural identity classes

Every perturbation must be classified before outcomes:

### I0 — SAME_IDENTITY_SAME_ANCHORS
Same structural lineage and same source-anchor set; only boundary coordinates change.

### I1 — SAME_IDENTITY_REDUCED_ANCHORS
Leave-one-anchor-out still resolves to the same causal structural lineage.

### I2 — IDENTITY_CHANGED
Perturbation resolves to a materially different anchor lineage/structure.

### I3 — IDENTITY_DISAPPEARED
No valid structure remains.

### I4 — NOT_EVALUABLE
Required point-in-time grid, anchor or detector provenance is incomplete.

No future outcome may alter the identity class.

## 5. Robustness interpretation ladder

Future D16 outcome analysis may classify the representation as:

R0_EXACT_ONLY:
canonical M2 is favorable but legal one-grid perturbations materially destroy the result.

Interpretation:
boundary-definition fragility / possible line-fitting.

R1_BOUNDARY_STABLE_DETECTOR_SPECIFIC:
legal-grid and anchor-jackknife sensitivity is acceptable, but the representation fails under preregistered detector alternatives.

Interpretation:
detector-specific representation; no general structural-memory claim.

R2_VERSION_STABLE_IDENTITY_FRAGILE:
aggregate result survives detector variants, but many parents change/disappear under anchor perturbation.

Interpretation:
population-level robustness with unstable object identity; causal structural interpretation remains weak.

R3_STRUCTURAL_ROBUSTNESS_CANDIDATE:
confirmation-specific representation survives M0/M1 controls, legal-grid perturbations, anchor jackknife, and preregistered detector-version challenge on common-support parents.

Interpretation:
stronger structural representation candidate, still not causal proof and not alpha proof.

R4_NOT_EVALUABLE:
insufficient provenance/common support.

## 6. No majority voting

Perturbation variants are nested within the same parent.

They do not create additional independent N.

Prohibited:
- "3 of 4 variants worked, therefore 3 wins";
- selecting the best perturbation;
- dropping failed variants;
- averaging arbitrary detector versions into a new score;
- searching perturbation magnitude after outcomes.

Future inference must preserve parent/date dependence and common support.

D16 owns estimator and uncertainty treatment.

## 7. Boundary perturbation is not parameter tuning

The minimal legal-grid family tests localization sensitivity.

It does not seek a better boundary.

If one-grid movement changes the future conclusion materially, the correct state is FRAGILE, not "optimize the line."

No N-tick search is authorized.

## 8. Detector-version firewall

Three version relations are distinct:

1. SEMANTIC_EQUIVALENT:
must reproduce canonical output; differences are regression bugs/provenance conflicts.

2. PREDECLARED_VARIANT:
different mechanics/parameters by design; used for robustness sensitivity.

3. NEW_POST_OUTCOME_VERSION:
created after outcomes are visible; prohibited from the confirmatory robustness family.

A later new detector can open a new prospective research generation but cannot retroactively rescue the old result.

## 9. Common-support rule

Cross-version comparison is permitted only where:
- same symbol;
- same decision/landmark date;
- same semantic price space;
- complete session/continuity provenance;
- both detector outputs were genuinely available/replayable under their frozen version.

Parents that exist only under one detector remain informative for identity coverage but are not silently forced into matched-effect comparison.

Coverage loss itself is reported.

## 10. Taiwan tick-grid dependency

D01 does not own the Taiwan tick table.

Legal-grid perturbations consume a point-in-time tick-grid receipt from the canonical market-microstructure owner.

If the historical tick rule cannot be certified, P1 is DATA_BLOCKED.

Do not approximate with a modern tick table or a hard-coded constant.

## 11. Required durable fields

For each parent:
- parentId / relationEpisodeKey;
- symbol;
- landmark;
- semanticSpace;
- canonicalDetectorVersion/hash;
- canonicalBoundary;
- sourceAnchorIds;
- tickGridReceipt;
- perturbationFamily;
- perturbationId;
- perturbationBoundary;
- omittedAnchorId where applicable;
- detectorVariantVersion/hash where applicable;
- identityClass;
- evaluability/reason;
- manifestVersion/hash.

No future-return field belongs in this manifest.

## 12. Machine decision

BOUNDARY_PERTURBATION_FAMILY =
LEGAL_GRID_ONE_STEP_ONLY_V0_1.

ANCHOR_PERTURBATION_FAMILY =
LEAVE_ONE_ANCHOR_OUT_ALL_VARIANTS.

SEMANTIC_EQUIVALENT_VERSION_DIFFERENCE =
SEMANTIC_REGRESSION.

POST_OUTCOME_DETECTOR_RESCUE =
PROHIBITED.

VARIANT_INDEPENDENT_SAMPLE =
FALSE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 13. Exact next continuation

1. Build deterministic legal-grid perturbation and anchor-jackknife manifest helper.
2. Preserve invalid/disappeared variants as falsification evidence.
3. Freeze detector-version relation metadata: equivalent vs predeclared alternative vs post-outcome prohibited.
4. Hand parent-nested/common-support robustness inference to D16.
5. Execute DL-022..DL-029 research Node tests when a reproducible approved execution path exists; do not treat V8 CI as those receipts.
6. Next D01 science: distinguish structural-object persistence from repeated rediscovery caused by overlapping windows / detector refresh cadence.
7. No outcome join / no runtime wiring / no Formal change.
