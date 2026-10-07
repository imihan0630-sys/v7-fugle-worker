# D16 + D18 Selection-Aware Validation Chain 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / SELECTION_AWARE_VALIDATION_CONTRACT_FROZEN
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE
Production/runtime impact: NONE
Primary audit mapping: SDA-016 / SDA-017 / SDA-022

## Purpose

Freeze one end-to-end validation chain for model/strategy/regime research after many alternatives have been searched.

The core risk is the compound selection process:
1. search many transforms / factors / models / regimes / thresholds / policies;
2. select a winner using finite historical evidence;
3. evaluate the selected winner as if it had been specified ex ante;
4. repeatedly reuse the same holdout when the result disappoints;
5. report stock-row N while effective evidence is only a few independent decision dates or regime episodes.

This contract separates search-space accounting, chronological nested selection, family-level data-snooping diagnostics, post-selection performance diagnostics and untouched prospective/OOS policy-value evidence.

No single statistical correction replaces the whole chain.

## 1. Selection Family Receipt

Before outcome interpretation, every research family must freeze a SelectionFamilyReceipt containing at least:

- familyId;
- ownerDomain;
- targetId / horizon;
- benchmarkId;
- candidateSetVersion;
- strategyVersion / policyVersion / regimeVersion;
- featureSourceFamilyIds;
- testedModelFamilies;
- testedThresholds;
- testedWindows;
- testedStateCounts;
- testedHysteresisRules;
- testedWeightMaps;
- testedCostAssumptions if used for selection;
- testedRefitCadences;
- trialCountObserved;
- duplicateOrNearDuplicatePolicy;
- outerOosPolicy;
- stoppingRule;
- evidenceOpenState.

Failed or abandoned variants remain in the family ledger. Renaming a failed idea does not reset the family.

## 2. Primary evidence hierarchy

Authority order:

1. GENUINE_PROSPECTIVE_RECEIPT
   - frozen before outcome;
   - decision-time inputs proven;
   - no retrospective synthesis.

2. UNTOUCHED_CHRONOLOGICAL_OOS
   - outer block never used for model/policy/calibrator/threshold selection;
   - overlapping outcome windows purged;
   - preprocessing fit only in training data.

3. NESTED_WALK_FORWARD_SELECTION
   - inner selection only;
   - outer evidence untouched.

4. FAMILY_LEVEL_POST_SELECTION_DIAGNOSTICS
   - White Reality Check / Hansen SPA / PBO-style diagnostics / Deflated Sharpe Ratio where assumptions and sample size permit.

5. IN_SAMPLE / DESCRIPTIVE
   - mechanism discovery only.

Lower levels cannot override a failed higher-authority level.

## 3. Method role separation

### White Reality Check

Question:
Given a searched family relative to a benchmark, is the best observed alternative still superior after accounting for data snooping?

Role:
family-level benchmark-relative diagnostic.

Requirements:
- preserve serial dependence with an appropriate resampling design;
- family definition includes materially searched alternatives;
- failed trials remain represented.

A pass cannot rescue look-ahead, bad PIT lineage, contaminated outer OOS, or outcome-selected cohorts.

### Hansen SPA

Question:
Does at least one alternative have superior predictive ability relative to the benchmark, with improved treatment of poor/irrelevant alternatives?

Role:
family-level predictive-superiority diagnostic.

Studentization and a sample-dependent null may improve power versus the original Reality Check. They do not erase search-history requirements.

### Probability of Backtest Overfitting

Question:
How often does the in-sample-selected winner rank poorly out of sample across repeated train/test partitions of the searched family?

Role:
selection-process fragility diagnostic.

Finance adaptation:
standard symmetric partitioning is not primary evidence for path-dependent Taiwan trading research. Chronology, overlapping D+N outcomes, persistent regime episodes and policy carry create dependence.

Therefore:
- chronological prospective/OOS evidence remains primary;
- any PBO-style implementation must preserve temporal/dependence semantics as far as possible;
- never randomly shuffle stock rows;
- report PBO_STYLE unless canonical assumptions are genuinely met;
- combinatorial split count is not independent market N.

### Deflated Sharpe Ratio

Question:
Is an observed Sharpe-like statistic still impressive after accounting for selection across trials, finite sample and non-normal returns?

Role:
post-selection performance-ratio diagnostic.

The effective number/dispersion of searched trials must be honestly represented. Hidden search history makes deflation too weak.

DSR cannot replace policy counterfactuals, date/episode dependence, common-support checks, exposure-matched controls or prospective evidence.

## 4. Nested chronological validation contract

OUTER:
- chronological untouched block;
- no selection decision may depend on outer outcomes;
- record first-open timestamp of outer outcomes;
- purge training rows whose outcome interval overlaps outer test interval.

INNER:
- feature selection;
- preprocessing;
- regularization;
- hyperparameter search;
- calibrator choice;
- state-count selection;
- threshold / hysteresis / weight-map selection;
- refit cadence selection.

All transformations are fitted inside the inner training boundary.

After the inner winner is frozen, evaluate once on the outer block.

If outer performance is inspected and a design choice changes, that outer block becomes consumed evidence and cannot be called untouched again.

## 5. Dependence-aware evidence units

Report separately:
- rowN;
- symbolN;
- independentDecisionDateN;
- regimeEpisodeN;
- transitionN;
- policyActionN;
- effectiveOuterBlockN.

Same-date stock rows are clustered market observations, not independent market replications.
Persistent regimes create episode dependence.
Overlapping D+N outcomes create temporal dependence.
Position carry can link consecutive policy dates.

Naive iid row bootstrap is not primary inference.

Candidate diagnostics:
- date-level aggregation;
- block/bootstrap methods with documented block choice;
- leave-one-date-out;
- leave-one-regime-episode-out;
- HAC-style inference where assumptions are defensible.

Block length / bandwidth is itself a research choice and joins the sensitivity ledger.

## 6. Selection degrees-of-freedom ledger

For D18 policy research, count materially searched decisions, not only final parameters.

Examples include:
- regime taxonomies;
- volatility windows;
- breadth definitions;
- hysteresis rules;
- strategy pairings;
- exposure maps;
- horizons.

No mechanical multiplication formula is imposed because trials are dependent and often near-duplicates.

Preserve:
- raw trial count;
- unique policy fingerprints;
- source-family lineage;
- near-duplicate clusters;
- selected winner;
- discarded variants.

This is the required input for later search-adjusted diagnostics.

## 7. SDA-016 firewall — validator self-confirmation

Violation examples:
- the same outer outcomes choose a model and evaluate it;
- a failed holdout triggers target/horizon/benchmark changes and the same dates are reused;
- new variants appear after outcome inspection while family history is reset;
- selected results are reported without the search family;
- repeated looks are treated as independent confirmation.

Required states:
- OUTCOME_LOCKED;
- OUTER_UNTOUCHED;
- OUTER_CONSUMED;
- FAMILY_EXPANDED_POST_OUTCOME;
- REQUIRES_NEW_FORWARD_EVIDENCE.

D16 cannot self-close SDA-016. Independent Room00 readback remains required.

## 8. SDA-017 firewall — post-hoc Regime mining

Violation examples:
- regime definition selected to maximize historical strategy spread;
- transition persistence/hysteresis tuned after policy PnL is known;
- rare favorable states carved out after outcome inspection;
- revised macro/cycle labels backfilled into historical decisions;
- latent-state model uses smoothed future-aware states for trading decisions;
- a large regime cube is searched and only the best cell is reported.

Required progression:
1. freeze observable state and decision clock;
2. freeze one strategy and action class;
3. preregister policy/MDE;
4. accumulate prospective state occupancy before opening policy outcomes where practical;
5. evaluate static vs challenger on paired dates;
6. run family-level search diagnostics only after the family ledger is complete.

## 9. SDA-022 cross-system extension

When comparing System1 and System2:
- same selected symbol is not two independent confirmations;
- different selected symbols are not proof of diversification;
- compare policy fingerprints and effective information roots;
- freeze common-support population;
- measure incremental predictive/policy value after conditioning on the other system;
- preserve shared-source dependence and date/episode clustering.

Any cross-system family expansion after outcome inspection consumes prior outer evidence.

## 10. Negative controls

Minimum battery when sample size permits:
- static benchmark;
- simple model baseline;
- dependence-preserving regime-label perturbation;
- date-shift/placebo timing;
- exposure-matched control;
- source-family residual control;
- future-state lead test for timing contamination;
- largest-date / largest-episode exclusion;
- selected-winner vs preregistered baseline comparison;
- family-size sensitivity.

Negative controls are falsification tools, not extra Alpha votes.

## 11. Failure / abstention states

Use explicit states:
- INSUFFICIENT_EVIDENCE;
- OUTER_EVIDENCE_CONSUMED;
- SEARCH_FAMILY_INCOMPLETE;
- PIT_INVALID;
- COMMON_SUPPORT_INADEQUATE;
- DEPENDENCE_UNRESOLVED;
- EPISODE_DOMINATED;
- COST_FRAGILE;
- POST_SELECTION_FRAGILE;
- PROSPECTIVE_CONFIRMATION_REQUIRED.

A correction method must never convert PIT_INVALID or SEARCH_FAMILY_INCOMPLETE into PASS.

## 12. Module mapping

Primary D16:
D16-05, D16-06, D16-10, D16-12, D16-15, D16-16, D16-18, D16-19.

Primary D18:
D18-08, D18-09, D18-12, D18-14.

Audit:
SDA-016, SDA-017, SDA-022.

## 13. Maturity decision

This contract deepens the research/falsification layer but does not create Taiwan PIT replay or new prospective outcomes.

Therefore:
- D16 maturity unchanged;
- D18 maturity unchanged;
- no L3/L4 promotion authorized;
- no Formal optimization candidate.

The advance is methodological completeness: future model/regime research now has one explicit selection-aware chain rather than disconnected statistical tests.

## 14. External methodology anchors

- White (2000), A Reality Check for Data Snooping.
- Hansen (2005), A Test for Superior Predictive Ability.
- Bailey et al., The Probability of Backtest Overfitting.
- Bailey & López de Prado (2014), The Deflated Sharpe Ratio.
- Cawley & Talbot (2010), On Over-fitting in Model Selection and Subsequent Selection Bias in Performance Evaluation.
- Harvey, Liu & Zhu (2016), ... and the Cross-Section of Expected Returns.

These establish data-snooping / post-selection / multiple-testing risks, not Taiwan-specific Alpha.

## Exact next continuation

1. Freeze a machine-readable SelectionFamilyReceipt schema before the next new D16/D18 policy family is opened.
2. Bind SDA-016 experiment/holdout-use ledger to OUTER_UNTOUCHED vs OUTER_CONSUMED states.
3. Require D18 policy fingerprints to enumerate state taxonomy, threshold, hysteresis, action class, exposure map and horizon before outcome inspection.
4. When genuine prospective/OOS evidence arrives, apply this chain without reopening frozen design choices.
5. Keep economic outcomes CLOSED for currently preregistered streams until explicit opening gates pass.
