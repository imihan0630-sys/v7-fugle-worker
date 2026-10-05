# D01 DL-040 — Pattern Generalization vs Sector / Industry Composition V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / SECTOR_COMPOSITION_FIREWALL / SDA_001_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-039 froze cross-sectional selection against liquidity, size, listing-age and survivorship bias.

DL-040 addresses another source of false generalization:

> A Pattern result can look broad across many stocks while actually being concentrated in one sector, one industry cycle or one sector-wide momentum episode.

D01 must therefore distinguish generic price-structure representation from sector/industry composition.

No economic outcome is opened in D01.

## 2. Evidence context

Industry effects are large enough that they cannot be treated as background noise.

- Moskowitz and Grinblatt show industry momentum explains a substantial share of individual-stock momentum profitability.
- Hou and Robinson show industry concentration is related to average stock returns even after standard controls.
- Later evidence shows industry-classification granularity itself can affect measured industry-return relations.
- Taiwan technical-rule evidence shows technical profitability varies across firm characteristics and states, reinforcing the need to separate stock-level Pattern from cross-sectional composition.

These findings do not prove Pattern is sector-driven.
They require an explicit sector-composition falsification.

## 3. Ownership boundary

D09 owns:
- industry / sector classification context;
- sector return / relative strength;
- breadth / leadership / concentration / rotation;
- point-in-time sector membership semantics.

D01 consumes D09 receipts.

D01 does not:
- create a second sector taxonomy;
- redefine sector-return formulas;
- create a new sector score;
- change the existing Formal sector-strength gate.

D10 remains owner of supply-chain / physical-cycle / issuer-exposure transmission.

A sector label is taxonomy context, not proof of economic supply-chain exposure.

## 4. Classification vintage

Every sector/industry receipt must carry:
- sectorTaxonomyId;
- classificationLevel;
- classificationVersion;
- effectiveFrom / effectiveTo where available;
- knownAt / capturedAt;
- symbol;
- sectorId / industryId;
- classificationState.

Allowed states:
- CLASSIFIED;
- UNCLASSIFIED_UNKNOWN;
- CLASSIFICATION_DATA_BLOCKED.

Current classification may not be backfilled historically unless the owner contract certifies that historical effective membership.

## 5. Classification-level firewall

Sector results can depend on whether the taxonomy is:
- broad sector;
- industry group;
- detailed industry.

Therefore classificationLevel is frozen before outcomes.

Prohibited:
- trying several taxonomies after outcomes and reporting the favorable one;
- merging/splitting industries to rescue a Pattern result;
- moving ambiguous names into a favorable group after inspection.

If taxonomy version/level is unfrozen:
SECTOR_COMPOSITION_NOT_EVALUABLE.

## 6. Sector composition is a denominator problem

For every D01 target-universe symbol/date from DL-039 preserve:
- sector classification state;
- detector/history/opportunity stage;
- structural root state.

Future reports must show by sector:
- targetEligibleCount;
- detectorEvaluableCount;
- structureEmittedCount;
- opportunityReadyCount;
- noStructureCount;
- dataBlockedCount;
- unclassifiedCount.

A sector with more symbols or better coverage must not mechanically dominate the Pattern evidence without disclosure.

## 7. Pattern prevalence vs Pattern effect

Two distinct future questions:

A. PATTERN_PREVALENCE_BY_SECTOR
Does the detector emit the structure more often in some sectors?

B. PATTERN_INCREMENT_WITHIN_SECTOR
Conditional on comparable sector context, does the Pattern add representation beyond peers / controls?

High prevalence in one sector is not proof of generic Pattern value.

## 8. Sector concentration descriptors

Allowed descriptive fields:
- uniqueSectorCount;
- opportunityCount;
- rootsBySector;
- opportunitiesBySector;
- top1SectorOpportunityShare;
- top3SectorOpportunityShare;
- sectorOpportunityHHI;
- unclassifiedShare.

No concentration threshold is frozen in D01.

High concentration triggers interpretation limits, not automatic rejection.

## 9. Candidate self-inclusion firewall

A candidate stock can mechanically improve its own:
- sector return;
- sector breadth;
- sector above-MA share;
- sector new-high share;
- leader concentration;
- sector RS.

Therefore any sector context used as a Pattern control should prefer candidate leave-one-out receipts where the D09 owner supports them.

Required when available:
- sectorReturnExCandidate;
- sectorBreadthExCandidate;
- sectorAboveMAExCandidate;
- sectorNewHighShareExCandidate;
- sectorLeaderStateExCandidate.

If leave-one-out is not available:
SELF_INCLUSION_UNRESOLVED.

Do not claim sector-independent Pattern incrementality from a self-included context.

## 10. Small-sector leave-one-out

If excluding the candidate leaves no valid peers:
LOO_SECTOR_CONTEXT_UNAVAILABLE.

Do not substitute:
- zero;
- full-sector value including candidate;
- market value;
without explicit design semantics.

UNKNOWN remains UNKNOWN.

## 11. SDA-001 relation

D01 Pattern is PRICE_OHLC-derived.

Sector return/breadth also derives partly from PRICE_OHLC, although from peer symbols.

If the candidate is included in sector context, the same stock price can appear in both:
- candidate Pattern;
- sector confirmation.

This is not independent evidence.

Even after leave-one-out:
sector context is a control/context family, not an automatic extra vote.

Future independent evidence requires D16 residual validation.

## 12. Existing Formal sector gate

The current system already has sector-strength eligibility logic.

DL-040 does not:
- change thresholds;
- change weights;
- add a second sector gate;
- bypass the gate.

Future Pattern incrementality must be measured after controlling for the existing sector eligibility state / D09 context where relevant.

## 13. Raw vs sector-matched comparisons

Future D16 comparison ladder:

S0 RAW_PATTERN_COHORT
- descriptive only.

S1 SECTOR_COMPOSITION_MATCHED
- compare Pattern vs controls with sector composition aligned.

S2 LOO_SECTOR_CONTEXT_CONTROLLED
- use candidate-excluded sector return/breadth where available.

S3 WITHIN_SECTOR_INCREMENT
- test Pattern within sector/date context.

S4 CROSS_SECTOR_REPLICATION
- test whether increment survives across multiple sectors / independent sector-date clusters.

No stage may be skipped by pointing to many stock rows.

## 14. Interpretation states

C0 SECTOR_COMPOSITION_EXPLANATION
- raw Pattern difference vanishes after sector-composition matching.

C1 SECTOR_MOMENTUM_EXPLANATION
- difference vanishes after leave-one-out sector return/RS controls.

C2 SECTOR_BREADTH_EXPLANATION
- difference vanishes after leave-one-out breadth/leadership controls.

C3 WITHIN_SECTOR_PATTERN_INCREMENT
- Pattern remains within comparable sector context.

C4 SECTOR_SPECIFIC_PATTERN
- effect survives only in preregistered sector(s).

C5 CROSS_SECTOR_PATTERN_CANDIDATE
- representation survives multiple sectors / sector-date clusters.

C6 NOT_EVALUABLE
- classification, LOO, common support or coverage is inadequate.

None proves alpha.

## 15. Sector-specific is not generic failure

If Pattern works only in one sector:
- do not call it generic Pattern evidence;
- do not automatically reject it;
- classify claim scope as SECTOR_SPECIFIC.

A later sector-specific model would require separate preregistration and D16 validation.

## 16. Cross-sector common support

Cross-sector inference must preserve overlap in:
- DL-039 size/liquidity/listing age;
- price/tick tier;
- market;
- regime;
- detector history readiness;
- breakout/opportunity geometry;
- sector-return/breadth context.

If sectors occupy disjoint covariate regions:
CROSS_SECTOR_EXTRAPOLATION_PROHIBITED.

## 17. Sector-date dependence

Ten Pattern stocks in one semiconductor rally are not ten independent sector replications.

Future D16 must distinguish:
- stock observations;
- structural roots;
- symbol count;
- sector count;
- independent sector-date clusters;
- market-date clusters.

One common sector shock remains one dependent cluster family.

## 18. Unknown classification

UNCLASSIFIED_UNKNOWN remains visible.

Prohibited:
- dropping unclassified names;
- assigning them to OTHER and treating OTHER as a coherent economic sector;
- using future classification to fill historical UNKNOWN.

Coverage reports must include classificationUnknownRate.

## 19. Diversified / cross-industry firms

A single exchange industry code can be an imperfect representation for diversified firms.

D01 treats classification as taxonomy control only.

If economic exposure matters:
- D10 company-transmission / supply-chain mapping is a separate owner dependency;
- do not infer multi-industry revenue exposure from one sector label.

## 20. Sector-neutral Pattern prevalence

Future descriptive analysis may compare:
- Pattern emission rate within each sector;
- opportunity rate within each sector;
- sector-adjusted prevalence.

This is detector/composition evidence only.

Do not infer return value from prevalence.

## 21. Required manifest fields

Per research design:
- experimentId;
- targetPopulationType;
- sectorTaxonomyId;
- classificationLevel;
- classificationVersion;
- classificationPolicyId;
- leaveOneOutPolicyId;
- existingFormalSectorGateVersion;
- sectorCommonSupportPolicyId;
- sectorClusteringPolicyId;
- outcomeJoinState;
- manifestVersion/hash.

Per symbol/date:
- parentDecisionId;
- marketDate;
- symbol;
- sectorId;
- classificationState;
- classificationKnownAt;
- classificationEffectiveFrom;
- detectorStage;
- structureStage;
- opportunityStage;
- structuralRootId;
- sectorReturnReceipt;
- sectorReturnExCandidateReceipt;
- sectorBreadthReceipt;
- sectorBreadthExCandidateReceipt;
- sectorLeadershipReceipt;
- sectorLeadershipExCandidateReceipt;
- selfInclusionState;
- DL-039 size/liquidity/listing-age receipt;
- regime receipt;
- source/provenance receipt.

No future-return field belongs in the D01 manifest.

## 22. Current decision

MANY_STOCKS_EQUALS_MANY_SECTORS =
FALSE.

SECTOR_CONCENTRATION_CAN_BE_HIDDEN =
FALSE.

CURRENT_CLASSIFICATION_CAN_BE_BACKFILLED =
FALSE.

OUTCOME_SELECTED_TAXONOMY =
PROHIBITED.

CANDIDATE_INCLUDED_SECTOR_CONTEXT_EQUALS_INDEPENDENT_CONFIRMATION =
FALSE.

SINGLE_SECTOR_EFFECT_EQUALS_GENERIC_PATTERN =
FALSE.

UNCLASSIFIED_CAN_BE_SILENTLY_DROPPED =
FALSE.

D09_OWNER_TAXONOMY_REDEFINED_BY_D01 =
FALSE.

SDA_001_STATUS =
REMEDIATION_IN_PROGRESS.

ECONOMIC_VALIDATION_OWNER =
D16.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 23. Exact next continuation

1. Build deterministic classification-vintage, sector-composition, leave-one-out and claim-scope helper plus adversarial tests.
2. Preserve Pattern prevalence and Pattern incrementality as separate questions.
3. Preserve stock N, root N, sector N and independent sector-date cluster N separately.
4. Hand S0-S4 / C0-C6 sector-matched inference to D16.
5. Consume D09 classification/breadth/rotation receipts and existing Formal sector gate without duplication.
6. Preserve SDA-001 as REMEDIATION_IN_PROGRESS until D16 residual evidence / system lineage / 00 closure.
7. Next D01 science: separate sector composition from market-wide common shocks / beta so cross-sector replication in one market surge is not mistaken for independent Pattern evidence.
8. No outcome join / no runtime wiring / no Formal change.
