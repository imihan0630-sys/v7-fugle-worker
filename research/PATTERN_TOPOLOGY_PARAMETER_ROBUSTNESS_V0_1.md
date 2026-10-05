# D01 DL-037 — Topology Identity Robustness Across Detector Parameterizations V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / PARAMETER_FAMILY_FIREWALL / SDA_001_SDA_002_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-036 separated structural lineage from information lineage and prevented co-located roots from becoming automatic duplicate votes.

DL-037 addresses detector-family instability:

> If multiple detector parameterizations produce the same apparent structure, is that evidence of robust topology, or merely many correlated views of the same PRICE_OHLC history?

The answer must not depend on which parameterization later produced better outcomes.

No future outcome is opened in this tranche.

## 2. Evidence context

Lo, Mamaysky and Wang (2000) show technical patterns can be encoded with systematic automatic algorithms, reducing purely visual subjectivity.

Sullivan, Timmermann and White (1999) show technical-rule evaluation is vulnerable to data-snooping when many rules/variants are searched.

Therefore:
- algorithmic detection is necessary but not sufficient;
- parameter families must be frozen before outcome inspection;
- variant multiplicity must not multiply independent evidence.

## 3. Parameter-family registry

Every detector family exports a frozen registry before outcome inspection:

- detectorFamilyId;
- detectorVersion;
- parameterFamilyId;
- parameterGridHash;
- registryFrozenAt;
- variantId;
- parameterVector;
- semanticSpace;
- timeframe;
- source/version receipts.

Examples of parameter dimensions may include:
- pivot lookback;
- smoothing bandwidth;
- local-extremum neighborhood;
- anchor clustering tolerance;
- minimum anchor count;
- zone construction rule;
- maximum age/lookback;
- topology simplification rule.

D01 does not choose outcome-optimal values.

## 4. Three different concepts

### A. VARIANT_IDENTITY

One exact parameter vector and detector version.

### B. STRUCTURAL_TOPOLOGY_IDENTITY

Canonical causal object identity:
- root anchor lineage;
- orientation;
- semantic space;
- timeframe;
- causal boundary/version lineage.

### C. INFORMATION_IDENTITY

All price-only variants remain:
informationRoot = PRICE_OHLC.

Variant identity != structural identity != independent information identity.

## 5. Exact aliases

If two variants produce:
- same structuralRootId;
- same structuralVersionId;
- same ordered anchor IDs;
- same lifecycle state;
- same asOf / predictor freeze;
- same boundary hash;

then:
EXACT_VARIANT_ALIAS.

They are one structural observation and one effective price evidence family.

rawVariantCount may increase.
effectiveIndependentEvidenceCount does not.

## 6. Same-root geometry variation

If variants preserve the same structural root but differ in:
- legal boundary version;
- minor anchor extension;
- topology simplification;
- causal version state;

classify:
SAME_ROOT_PARAMETER_VARIATION.

This is sensitivity evidence, not a new root vote.

## 7. Cross-root conflict

If variants on the same parent/freeze produce different root identities and no canonical causal relation resolves them:

PARAMETER_IDENTITY_CONFLICT.

Do not use majority vote to declare the most common root true.

Do not select the variant with the best later return.

Conflict is a robustness finding.

## 8. Unconfirmed / missing output

For each frozen variant preserve:
- ROOT_EMITTED;
- SAME_ROOT_VARIATION;
- NO_STRUCTURE;
- UNKNOWN_DATA_BLOCKED;
- POST_HOC_NOT_ELIGIBLE;
- PARAMETER_IDENTITY_CONFLICT.

Do not drop variants that fail to detect a structure.

A robustness rate computed only among successful variants is prohibited.

## 9. Family robustness descriptors

Allowed descriptive counts:

eligibleVariantCount;
rootEmittedCount;
exactAliasCount;
sameRootVariationCount;
noStructureCount;
dataBlockedCount;
postHocCount;
identityConflictCount.

Allowed descriptive rates:

emissionRate = rootEmittedCount / eligibleVariantCount;
sameRootSupportRate = variants supporting canonical root lineage / eligibleVariantCount;
conflictRate = identityConflictCount / eligibleVariantCount;
noStructureRate = noStructureCount / eligibleVariantCount.

These are robustness descriptors.

They are NOT alpha scores.
They are NOT independent vote counts.

## 10. Canonical root choice

DL-037 does not define the canonical root by majority vote.

Canonical root must come from:
- the pre-existing canonical detector contract, or
- a preregistered deterministic root-selection rule frozen before outcomes.

If no canonical rule exists:
CANONICAL_ROOT_UNRESOLVED.

Do not infer canonical truth from variant popularity.

## 11. No best-parameter rescue

Prohibited after outcome inspection:
- selecting the best lookback;
- selecting the best smoothing bandwidth;
- selecting the best zone tolerance;
- excluding variants with poor performance;
- shrinking the parameter family after observing results;
- redefining topology equivalence to improve returns.

If the family changes:
new parameterFamilyId + new registryFrozenAt + new experiment family.

## 12. Familywise research accounting

Every evaluated parameter family must be handed to D16 as one technical-rule search family.

Future inference must account for:
- total number of variants;
- frozen parameter-family registry;
- dependence among variants;
- repeated use of the same dates;
- canonical-vs-family comparisons;
- negative/null/conflicting variants.

No best-variant result may be reported without family accounting.

## 13. SDA-001 information-root firewall

All D01 price-only detector variants export:
- informationRoot = PRICE_OHLC;
- representationFamily = D01_PRICE_GEOMETRY;
- parameterFamilyId;
- redundancyGroup = D01_PRICE_GEOMETRY_PARAMETER_FAMILY;
- rawVariantCount;
- effectiveIndependentEvidenceCount = 1 by default;
- residualIncrementalityStatus = NOT_VALIDATED.

A family of 30 parameter variants is not 30 confirmations.

## 14. SDA-002 no-lookahead firewall

Every variant independently exports:
- firstObservableAt;
- confirmedAt;
- latestAnchorAt;
- predictorFreezeAt;
- futureBarRequired;
- replaySafe.

A parameter variant that needs future bars is:
POST_HOC_NOT_ELIGIBLE.

The family cannot hide such variants inside a consensus.

## 15. Consensus is not evidence multiplication

A high sameRootSupportRate can be useful as a detector-stability diagnostic.

It does not mean:
- stronger alpha;
- two or more independent confirmations;
- more capital;
- higher rank;
- automatic promotion.

Any future use of robustness as a feature is a separate research hypothesis requiring D16 validation and owner-governed promotion.

## 16. Parameter-family stability questions

Future research may ask:

R1:
Does canonical root identity remain stable across the frozen parameter family?

R2:
Does boundary geometry remain within causal same-root versions?

R3:
How often do variants emit no structure?

R4:
How often do variants disagree on root identity?

R5:
Does apparent economic performance survive familywise inference rather than best-variant selection?

R6:
Does any robustness descriptor add residual information beyond the canonical root itself?

R6 is especially important:
robustness may simply be another transformation of the same PRICE_OHLC geometry.

## 17. Future comparison families

P0 CANONICAL_ONLY
- canonical detector/root only.

P1 FAMILY_DIAGNOSTIC
- canonical root plus frozen robustness descriptors.

P2 VARIANT_ENSEMBLE_RAW
- raw variant outputs for diagnostic comparison only.

P3 VARIANT_ENSEMBLE_DEDUP
- one effective PRICE_OHLC family after alias/root de-duplication.

Future D16 must compare P2 vs P3 to expose false confidence from variant multiplicity.

## 18. Required manifest fields

Per parent/freeze:
- parentDecisionId;
- symbol;
- semanticSpace;
- timeframe;
- detectorFamilyId;
- detectorVersion;
- parameterFamilyId;
- parameterGridHash;
- registryFrozenAt;
- canonicalRootId;
- canonicalRootSelectionRuleId;
- eligibleVariantCount;
- rootEmittedCount;
- exactAliasCount;
- sameRootVariationCount;
- noStructureCount;
- dataBlockedCount;
- postHocCount;
- identityConflictCount;
- emissionRate;
- sameRootSupportRate;
- conflictRate;
- noStructureRate;
- informationRoot;
- representationFamily;
- redundancyGroup;
- rawVariantCount;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

Per variant:
- variantId;
- parameterVectorHash;
- structuralRootId;
- structuralVersionId;
- anchorIds;
- boundaryHash;
- lifecycleState;
- firstObservableAt;
- confirmedAt;
- latestAnchorAt;
- predictorFreezeAt;
- futureBarRequired;
- replaySafe;
- variantState.

No return outcome field belongs in this manifest.

## 19. Current decision

PARAMETER_VARIANT_COUNT_EQUALS_EVIDENCE_COUNT =
FALSE.

MAJORITY_VARIANT_ROOT_EQUALS_CANONICAL_TRUTH =
FALSE.

BEST_VARIANT_AFTER_OUTCOMES =
PROHIBITED.

FAILED_TO_DETECT_VARIANTS_CAN_BE_DROPPED =
FALSE.

ROBUSTNESS_RATE_EQUALS_ALPHA =
FALSE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

INFORMATION_ROOT =
PRICE_OHLC.

RESIDUAL_INCREMENTALITY_STATUS =
NOT_VALIDATED.

SDA_001_STATUS =
REMEDIATION_IN_PROGRESS.

SDA_002_STATUS =
REMEDIATION_IN_PROGRESS.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 20. Exact next continuation

1. Build deterministic variant alias / same-root variation / conflict classifier and family robustness summary.
2. Add adversarial tests for successful-only denominator bias, majority-vote rescue, post-hoc family shrinking and future-bar variants.
3. Export parameter-family lineage diagnostics without changing Formal scoring.
4. Hand familywise inference, variant dependence and canonical-vs-family residual testing to D16.
5. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS until system guards, D16 evidence and independent 00 closure exist.
6. Next D01 science: separate detector robustness from economic robustness across symbols, dates and market regimes so parameter stability on one local geometry is not mistaken for generalizable evidence.
7. No outcome join / no runtime wiring / no Formal change.
