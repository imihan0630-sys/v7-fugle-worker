# SDA-016 / SDA-017｜Room 11 Specialist Return — 2026-10-05 V0.1

Status: SPECIALIST_VALIDATION_DELTA_FROZEN / NOT_CLOSED
Owner: 11｜統計驗證與策略市場狀態研究室
Independent closure owner: 00｜研究總控室
Formal Core impact: NONE

## SDA-016

Canonical research contract:
`research/SDA016_HOLDOUT_CONSUMPTION_VALIDATION_CONTRACT_20261005_V0_1.md`

Current implementation validation:
`research/SDA016_SYSTEM1_HOLDOUT_GUARD_VALIDATION_20261005_V0_1.md`

State:
`RESEARCH_OWNER_CONTRACT_COMPLETE / SYSTEM1_CLASS_A_PARTIAL_PASS / CROSS_SYSTEM_CONSUMPTION_AUTHORITY_PENDING / 00_CLOSURE_PENDING`

Accepted now:
- immutable experiment version;
- target/benchmark mutation rejection;
- exact-dataset holdout rename cannot reset OOS;
- repeated inspection => development-consumed;
- single outcome lock;
- negative/null/failed result preservation;
- append-only local ledger integrity;
- conservative fixed-inspection default;
- protected Formal outputs unchanged.

Remaining:
1. partial-overlap independent-date lineage and overlap accounting;
2. shared/canonical System 1 + System 2 consumption authority;
3. machine-visible complete outcome-lock identity;
4. no sequential-valid exception until a new D16 contract explicitly freezes it;
5. independent 00 readback.

## SDA-017

Canonical research contract:
`research/SDA017_REGIME_SUPPORT_EPISODE_VALIDATION_CONTRACT_20261005_V0_1.md`

Current implementation validation:
`research/SDA017_EXISTING_D18_MACHINE_VALIDATION_20261005_V0_1.md`

State:
`RESEARCH_OWNER_CONTRACT_COMPLETE / EXISTING_D18_EX_ANTE_MACHINE_PARTIAL_PASS / EPISODE_SUPPORT_ENGINE_PENDING / PROSPECTIVE_MULTI_EPISODE_EVIDENCE_PENDING / 00_CLOSURE_PENDING`

Accepted now:
- decision-time vector clock;
- PIT fail-closed prerequisites;
- UNKNOWN / CONTEXT_RAW preservation;
- no scalar composite hindsight score;
- deterministic vector replay;
- preregistered activation mapping;
- UNKNOWN policy input => DATA_UNKNOWN;
- NATURAL_ZERO_PICK distinct from POLICY_DISABLED;
- identical baseline/challenger cost contract;
- mutated parent accounting rejection.

Remaining:
1. immutable episode identity and official-session adjacency;
2. UNKNOWN gap / vector-version / source-semantic episode breaks;
3. machine support states with effective dates + episodes + occupancy + transitions + paired support;
4. known-but-thin state cannot become promotion-eligible policy evidence;
5. Regime family mutation linked to SDA-016 holdout consumption;
6. genuine prospective multi-episode matured outcomes;
7. independent 00 readback.

## Cross-ticket firewall

Any D18 Regime target/state/threshold/policy/horizon change made after outcome inspection is simultaneously:
- SDA-017 family expansion;
- SDA-016 adaptive holdout consumption.

The old holdout becomes development evidence for the new regime hypothesis and cannot be called untouched OOS.

## Maturity

No curriculum maturity promotion is granted by this specialist return.

D16 remains 60%.
D18 remains 52%.
D16-19 / D16-25 remain L2/40.
D18 L3 modules remain at their current levels; no L4 claim.

FORMAL_OPTIMIZATION_CANDIDATE: NONE
Formal Core: LOCKED

## Exact next

Engineering:
- System 1/System 2 converge SDA-016 consumption authority without redoing passed guards.
- System 2 BUILD_LANE adds SDA-017 episode/support observer under existing D18 semantics.

Room 11:
- validate only the new deltas with adversarial tests;
- do not redo passed semantics;
- do not self-close either ticket.

00:
- independent closure readback after engineering + Room11 revalidation.


## 2026-10-05 second-round validation extension

Additional canonical validation files:
- `research/SDA016_INFORMATION_FOOTPRINT_VALIDATION_ADDENDUM_20261005_V0_1.md`;
- `research/SDA017_EPISODE_HORIZON_DEPENDENCE_VALIDATION_ADDENDUM_20261005_V0_1.md`.

### SDA-016 additional blocker

Exact decision-date overlap is necessary but not sufficient.

A new holdout can have disjoint decision dates while sharing the same underlying future market sessions through overlapping D+N outcomes. Therefore closure must also machine-track target-specific outcome information footprint overlap.

New required acceptance:
- decision-date overlap + outcome-information-footprint overlap are separate diagnostics;
- different logical holdout IDs / consumers / systems cannot reset a consumed physical outcome footprint;
- unknown footprint lineage fails closed;
- purge/embargo is frozen before outcomes and follows the full path dependency of the target;
- footprint de-duplication does not replace D16-06 dependence-aware inference.

SDA-016 remaining blocker is now explicitly:
`PARTIAL_DATE_OVERLAP + OUTCOME_INFORMATION_FOOTPRINT_OVERLAP + SHARED_CROSS_SYSTEM_CONSUMPTION_AUTHORITY`.

### SDA-017 additional blocker

Episode identity is a structural support unit, not an inferential independent-sample count.

Primary prospective policy estimand is frozen as:
`DECISION_STATE_CONDITIONAL`.

Future regime persistence may not be used to delete decisions whose later horizon crosses a regime transition. A persistence-conditioned analysis is a separate ex-post estimand/family and, if added after outcome inspection, consumes the original holdout under SDA-016.

New required acceptance:
- prospective episode continuation uses only current/prior official-session receipts;
- decision receipt cannot contain future episode end/length;
- structuralEpisodeN, maturedOutcomeEpisodeN, completedEpisodeN and effectiveIndependentDateN are distinct;
- transition-crossing D+N outcomes stay in the primary decision-state analysis and are flagged, not dropped;
- future Regime UNKNOWN does not delete an otherwise valid price outcome from the decision-state primary estimand;
- episode support cannot be promotion-eligible while D16 dependence / SDA-016 footprint state is unresolved.

SDA-017 remaining blocker is now explicitly:
`EPISODE_LINEAGE + SUPPORT_ENGINE + EPISODE_DEPENDENCE + HORIZON_ATTRIBUTION + SDA016_CONSUMPTION_LINK + PROSPECTIVE_MULTI_EPISODE_EVIDENCE`.

No maturity change.
Formal Core remains LOCKED.

Exact next:
- System 1 / System 2 shared SDA-016 authority must pass original tests 1–12 plus addendum tests 13–22;
- System 2 SDA-017 episode/support observer must pass original tests 1–15 plus addendum tests 16–30;
- Room11 performs adversarial revalidation only after those engineering deltas land;
- 00 remains the only independent closure authority.


## 2026-10-05 machine-readable validation oracles

Canonical executable acceptance oracles:
- `research/SDA016_VALIDATION_ORACLE_20261005_V0_1.json`;
- `research/SDA017_VALIDATION_ORACLE_20261005_V0_1.json`.

These freeze the research-owner expected disposition for all currently required adversarial tests:
- SDA-016: 22 blocking tests;
- SDA-017: 30 blocking tests.

They are not runtime code and do not self-close either ticket.

### SDA-016 oracle emphasis

The oracle separates:
- logical holdout identity;
- independent decision-date overlap;
- target-specific outcome information footprint overlap;
- cross-System physical consumption;
- purge/embargo eligibility;
- D16-06 statistical dependence.

A no-overlap holdout verdict does not imply statistical independence. The D16-06 inference gate remains separate.

External methodology anchors remain consistent with this guard:
- adaptive reuse can overfit a holdout itself;
- overlapping multi-horizon outcomes induce serial dependence for ordinary mean-style inference;
- trading-rule/model searches require accounting over the full searched family rather than reporting only the best rule.

### SDA-017 oracle emphasis

The oracle freezes:
- prospective episode continuation;
- decision-time-only episode identity;
- structural episode count distinct from inferential effective sample;
- `DECISION_STATE_CONDITIONAL` as the primary prospective policy estimand;
- horizon-transition crossing retained in the primary sample;
- future persistence as a separate estimand/family;
- explicit dependency on SDA-016 footprint/consumption and D16-06 dependence clearance.

### Closure rule

Room11 status can advance to `SPECIALIST_REVALIDATION_PASS` only when the corresponding engineering implementation passes every blocking oracle test applicable to that implementation.

Ticket `CLOSED` remains reserved for independent Room00 readback.

No maturity change.
Formal Core remains LOCKED.


## 2026-10-05 third-round deep falsification

New canonical addenda:
- `research/SDA016_INFORMATION_RELEASE_SELECTION_VALIDATION_ADDENDUM_20261005_V0_1.md`;
- `research/SDA017_REALTIME_FIT_FRAGMENTATION_VALIDATION_ADDENDUM_20261005_V0_1.md`.

New immutable validation oracle versions:
- `research/SDA016_VALIDATION_ORACLE_20261005_V0_2.json` — 30 blocking tests;
- `research/SDA017_VALIDATION_ORACLE_20261005_V0_2.json` — 40 blocking tests.

V0.1 oracle files remain frozen and are not rewritten.

### SDA-016 third-round finding

Holdout contamination follows information release lineage, not raw-row access or consumer identity.

Outcome-derived PASS/FAIL, sign, metric, plot, ranking, winner identity or downstream recommendation all count as information exposure under the current conservative contract.

If Room A inspects a holdout and Room B changes a hypothesis because of Room A's recommendation, the downstream hypothesis inherits the same consumption lineage even if Room B never sees raw outcomes.

Promotion-grade evidence must also report admission/maturity missingness by pre-outcome strata. Complete-case analysis cannot silently redefine the population when capture/readback/label maturity is state-dependent.

Multi-horizon inspection belongs to one multiplicity/consumption family unless a primary horizon was frozen before results.

Cross-room corroboration:
`research/D03_D16_METHOD_RECEIPT_ACCEPTANCE_ORACLE_20261005_V0_1.md` independently freezes holdoutMethodSelection=false, forward-footprint purge, common-support, coverage-bias terminal states and a non-shrinking D5/D10/D20 multiplicity family. Room11 absorbs these as compatible producer requirements rather than creating a competing D03-specific method.

### SDA-017 third-round finding

Outcome-free Regime construction is not automatically point-in-time.

Any learned/fitted threshold, scaler, PCA, clustering or latent-state model must bind an exact fit receipt whose knowledge cutoff is no later than the decision clock. Full-sample covariate fitting is look-ahead even when future outcomes are excluded.

Current D18 V0.1 trend/volatility implementation was re-read:
- future history rows are rejected;
- same decision clock is enforced;
- current trend/volatility semantics are computed from bounded trailing history;
- dimensions without a frozen authorized threshold remain CONTEXT_RAW/UNKNOWN.

Therefore the new fitted-Regime clock is a forward firewall for future learned dimensions; it does not retroactively invalidate already-accepted current fixed-semantic D18 components.

Episode accounting is now split:
- structuralEpisodeN = observable contiguous known segments;
- replicationEpisodeN = conservative recurrence support;
- mechanicalFragmentN = UNKNOWN/source/version/clock splits that cannot automatically earn independent recurrence credit.

Active episodes are right-censored, not absent. Primary DECISION_STATE_CONDITIONAL analysis cannot drop matured decisions merely because their episode remains active.

Regime-specific observability/capture coverage must be reported; known-state-only performance with state-dependent missingness cannot stand alone for promotion.

### Current closure boundary

SDA-016 requires V0.2 tests T01-T30.
SDA-017 requires V0.2 tests T01-T40 plus genuine prospective multi-episode matured evidence.
Existing accepted System1 exact-dataset/mutation guards and D18 ex-ante/UNKNOWN guards remain accepted; only new/pending deltas are rerun.

No maturity change.
Formal Core remains LOCKED.


## 2026-10-06 fourth-round selection sensitivity and effective replication

New canonical addenda:
- `research/SDA016_ADMISSION_SELECTION_IDENTIFICATION_VALIDATION_ADDENDUM_20261006_V0_1.md`;
- `research/SDA017_EFFECTIVE_REPLICATION_UNIT_VALIDATION_ADDENDUM_20261006_V0_1.md`.

New immutable validation oracle versions:
- `research/SDA016_VALIDATION_ORACLE_20261006_V0_3.json` — 40 blocking tests;
- `research/SDA017_VALIDATION_ORACLE_20261006_V0_3.json` — 48 blocking tests.

V0.1 / V0.2 oracle files remain frozen.

### SDA-016 fourth-round finding

Admission/readback/maturity/cost completion is a selection process and must not be treated as a neutral implementation detail.

A complete-case result estimates the full preregistered target population only under defensible assumptions. Otherwise its honest identity is `OBSERVED_SUBPOPULATION_ESTIMAND`.

Promotion-grade evidence now requires a three-tier sensitivity structure:
1. raw observed-subpopulation estimate;
2. preregistered admission/censoring weighted sensitivity when a decision-time missingness model and overlap/positivity are defensible;
3. partial-identification / worst-case bounds when missingness is not credibly point-identifiable or positivity fails.

Near-zero admission probabilities are an identification warning, not a license for arbitrary extreme weights. Trimming/truncation/overlap weighting changes support and therefore must bind a changed estimand identity.

For D16-CAL-01 binary outcomes, assumption-light missing-outcome success-rate bounds are directly computable from target N, observed N and observed positive count.

Brier sensitivity is bounded. Log-loss missing-label worst-case sensitivity is finite only if a probability clipping contract is frozen before outcome interpretation; no epsilon is authorized by this research return.

Evaluation/maturity cutoff and imputation model selection must also be outcome-independent. Outcome-tuned missingness modeling is another adaptive family use under SDA-016.

### SDA-017 fourth-round finding

No single `N_eff`, episode count or cluster count can certify independent Regime recurrence.

D18 promotion now requires a multi-axis support vector spanning:
- coverage/admissibility;
- date support;
- structural/replication/mechanical episodes;
- replication clusters and leverage/influence;
- transition-path concentration;
- calendar breadth;
- SDA-016 outcome-footprint freshness;
- D16-06 dependence diagnostics.

Structural episodes separated only by UNKNOWN/source/version/clock fragmentation remain separate observational segments but do not automatically create new replication clusters.

Primary `DECISION_STATE_CONDITIONAL` aggregation remains decision-date based. Equal-episode weighting is a separate estimand and cannot replace the primary after outcome access.

A leave-one-replication-cluster-out diagnostic is required once multi-cluster support exists. If deleting one cluster flips the main direction, status becomes `REPLICATION_FRAGILE`; this is a valid research outcome but not standalone promotion evidence.

Transition-path concentration is also reported without post-hoc subsetting. If positive evidence is concentrated in one predecessor path, status includes `STATE_EFFECT_HETEROGENEITY_WARNING`; a later path-specific policy is a new family under SDA-016.

### Cross-room consistency

D03's method-receipt oracle already supports common-support, coverage-bias, chronology, multiplicity and holdout constraints. The fourth-round Room11 rules generalize those principles across D16/D18; they do not replace D03 ownership.

### Current closure boundary

- SDA-016 now requires V0.3 T01-T40.
- SDA-017 now requires V0.3 T01-T48 plus genuine prospective multi-replication-cluster matured evidence.
- previously accepted System1 exact-dataset/mutation guards remain accepted;
- previously accepted D18 fixed-semantic PIT/UNKNOWN guards remain accepted;
- only new/pending engineering deltas are rerun.

No maturity change.
Formal Core remains LOCKED.
