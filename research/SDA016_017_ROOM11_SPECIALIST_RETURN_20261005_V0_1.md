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


## 2026-10-06 fourth/fifth-round durable continuation

Additional machine receipt contracts:
- `research/D16_ADMISSION_SENSITIVITY_RECEIPT_CONTRACT_20261006_V0_1.json`;
- `research/D18_REPLICATION_SUPPORT_RECEIPT_CONTRACT_20261006_V0_1.json`;
- superseding D16 receipt contract `research/D16_ADMISSION_SENSITIVITY_RECEIPT_CONTRACT_20261006_V0_2.json`.

These contracts intentionally attach no genuine sample and default to no promotion / no maturity impact.

### Fifth-round SDA-016 finding — same-session C1 generation multiplicity

Canonical addendum:
`research/SDA016_C1_GENERATION_PARENT_SELECTION_VALIDATION_ADDENDUM_20261006_V0_1.md`.

Canonical V0.4 oracle:
`research/SDA016_VALIDATION_ORACLE_20261006_V0_4.json` — 48 blocking tests.

Research-owner validation of System1 candidate:
`research/SDA016_SYSTEM1_V819_SCAN_ORIGIN_INVENTORY_VALIDATION_20261006_V0_1.md`.

PR #644 exact accepted head at Room11 readback:
`e925a04bc630816a1dd174f4e6675798ebe1937b`.

Credited candidate checks:
- V8 Regression `37377008932` PASS;
- System1 C1/C2 isolated offline review `37377009056` PASS;
- V8 Repair CI `37377008883` PASS;
- dedicated scan-origin/inventory adversarial suite 12/12 PASS by test contract;
- immutable V8.19+ scan-origin semantics;
- legacy no-backfill;
- all-generation same-date inventory;
- corrupt modern rows remain visible/fail closed;
- Formal core protected.

Governance boundary:
- PR remains OPEN/DRAFT;
- merge not authorized;
- Production deployment not authorized;
- no genuine V8.19 generation/readback exists from this candidate;
- therefore it is not empirical D16 evidence and not an SDA-016 closure receipt.

### Existing Formal-to-C1 guard retained

Current System1 collector already pins the first-read C1 generation and verifies current Formal scan proof:
`scan.researchC1Population.generationId` must equal the collected generation, with save/readback/count/content/universe checks.

Mismatch correctly returns:
`FORMAL_C1_GENERATION_UNLINKED`.

This remains accepted and must not be weakened.

### Residual authoritative-parent gap

C1 storage allows more than one immutable generation for one scan date.
A scanDate-only C1 read currently resolves the latest created generation.

The current Formal pointer is useful for same-session verification, but `LAST_SCAN_KEY` is current/latest state with finite retention and is not an append-only historical Formal-decision ledger.

Therefore D16 promotion-grade C1 evidence now requires a durable immutable binding:
`AUTHORITATIVE_FORMAL_DECISION_RECEIPT <-> EXACT_C1_GENERATION`.

Neither:
- latest generation;
- earliest generation;
- scan-origin class;
- selected-symbol equality;
- inventory ordinal;
- selectionVerified alone

may define the research parent.

If historical exact binding is unprovable:
`PARENT_GENERATION_AMBIGUOUS` or `HISTORICAL_BINDING_NOT_PROVEN`,
and the date remains retrospective/UNKNOWN for D16-CAL-01.

If generation-inventory multiplicity is used in admission logic, a deterministic session-finalization receipt is also required because the V8.19 candidate correctly declares the inventory mutable until session completion.

### Current Room11 closure baseline

- SDA-016: V0.4 T01-T48 blocking tests.
- SDA-017: V0.3 T01-T48 blocking tests + genuine prospective multi-replication-cluster matured evidence.
- Existing accepted guards remain accepted; new oracle versions are additive deltas, not reverse revalidation.
- Room00 remains sole closure authority.
- No maturity change.
- Formal Core remains LOCKED.


## 2026-10-06 sixth-round outer research-stream / policy-survivorship validation

Canonical additions:
- `research/SDA016_OUTER_SEQUENTIAL_HYPOTHESIS_STREAM_VALIDATION_ADDENDUM_20261006_V0_1.md`;
- `research/D16_ONLINE_EXPERIMENT_STREAM_RECEIPT_CONTRACT_20261006_V0_1.json`;
- `research/SDA016_VALIDATION_ORACLE_20261006_V0_5.json`;
- `research/SDA017_POLICY_CANDIDATE_SURVIVORSHIP_VALIDATION_ADDENDUM_20261006_V0_1.md`;
- `research/D18_POLICY_CANDIDATE_UNIVERSE_RECEIPT_CONTRACT_20261006_V0_1.json`;
- `research/SDA017_VALIDATION_ORACLE_20261006_V0_4.json`.

### D16 finding — inner sequential validity is not outer research-stream multiplicity control

Existing SDA-016 T07/T08 correctly handle one experiment's fixed-N interim peeking versus preregistered sequential monitoring.

The new blind spot is the outer sequence of hypotheses:
`H1 -> outcome -> H2 -> outcome -> H3 -> ...`.

A self-evolving research program can still accumulate false discoveries if each newly created experiment receives a fresh nominal error budget, even when every experiment is individually stopping-valid.

Therefore promotion-grade research now requires:
- canonical `researchStreamId`;
- explicit stream error objective;
- method/version and dependence assumptions;
- hypothesis birth ordinal and parent/release lineage;
- immutable outer error-budget transition history;
- preservation of negative/inconclusive/retired hypotheses;
- separate inner versus outer validity states.

No specific online-testing method is authorized by this research return. The chosen method must match its dependence/adaptation assumptions.

SDA-016 V0.5 now contains T01-T58, all blocking.

### D18 finding — fixed Regime semantics do not prevent adaptive policy-universe survivorship

Even if Regime definitions are fully ex-ante, policy candidates can be adaptively created, retired and replaced.

A current champion cannot be validated by:
- deleting retired losers from the denominator;
- reusing the winner-selection period as untouched validation;
- concatenating each period's best candidate return as if one fixed strategy;
- changing the champion metric after outcome access;
- comparing candidates only on each candidate's favorable activation dates.

D18 now requires:
- policy-candidate birth/retirement ledger;
- candidate-set hash at selection;
- frozen champion-selection rule;
- candidate exposure-duration / Regime-support accounting;
- common-support identification;
- fresh post-selection champion evidence;
- cross-ledger match to SDA-016 research stream.

SDA-017 V0.4 now contains T01-T56, all blocking.

### Methodology interpretation

The sixth-round distinction follows the external methodology split between:
- within-experiment sequential monitoring / anytime-valid inference;
- online multiple testing across a continuing stream of hypotheses;
and the model/backtest-selection problem where choosing the best of many alternatives creates selection bias.

These are governance anchors only, not Taiwan-stock alpha evidence.

### Current closure boundary

- SDA-016: V0.5 T01-T58 blocking.
- SDA-017: V0.4 T01-T56 blocking plus genuine prospective multi-replication and fresh post-selection champion evidence.
- no new System1/System2 implementation was credited during this sixth-round semantic extension;
- all previously accepted guards remain accepted;
- Room00 remains sole closure authority;
- no maturity change;
- Formal Core remains LOCKED.


## 2026-10-06 existing-registry outer-stream audit

Canonical audit:
- `research/D16_EXISTING_EXPERIMENT_REGISTRY_OUTER_STREAM_AUDIT_20261006_V0_1.md`;
- `research/d16_existing_experiment_registry_outer_stream_audit_v0_1.json`.

Physical readback:
- central `research/EXPERIMENT_REGISTRY.md` has 8 base R families (R01-R08);
- 5 explicit R v1.1 subdefinitions;
- D16-CAL-01 is additionally preregistered;
- central registry contains no `researchStreamId`;
- central registry contains no `multipleTestingFamilyId`.

Local multiplicity is not absent:
- D02 L4 target registry contains 14 entries across F0-F5;
- D03 primary handoff contains 2 experiments and requires `multipleTestingFamilyId` in the future D16 method receipt.

Disposition:
`LOCAL_MULTIPLICITY_PARTIAL / CROSS_ROOM_OUTER_STREAM_NOT_MODELED`.

This is a real governance gap but does not retroactively invalidate every local experiment.
Historical inspected evidence keeps its existing descriptive/development/consumption status; no favorable historical outer-budget assignment is permitted.

D16-CAL-01 remains before first genuine C1 outcome inspection and therefore has a clean opportunity for pre-outcome outer-stream enrollment.

Required pre-outcome state for confirmatory use:
`STREAM_ENROLLMENT_REQUIRED_BEFORE_FIRST_GENUINE_OUTCOME_INSPECTION`.

No specific FWER/FDR/mFDR/online method or numeric error level is selected by this audit.
No maturity change.


## 2026-10-06 SDA-022 cross-system non-convergence D16 intake

New critical ticket:
`SDA-022 — Cross-system strategy convergence / pseudo-diversification`.

Latest queue explicitly sets:
- severity = CRITICAL;
- status = ROUTED;
- engineering owners = SYSTEM1 + SYSTEM2;
- `d16ValidationRequired=true`;
- closure authority = 00.

Canonical architecture guard:
`shared-knowledge/SYSTEM1_SYSTEM2_NON_CONVERGENCE_GUARD_V0_1.md`.

Room11/D16 canonical validation:
- `research/SDA022_D16_CROSS_SYSTEM_NON_CONVERGENCE_VALIDATION_CONTRACT_20261006_V0_1.md`;
- `research/SDA022_D16_CROSS_SYSTEM_NON_CONVERGENCE_ORACLE_20261006_V0_1.json`.

Validation oracle:
- 16 blocking adversarial tests;
- no empirical pair receipts attached yet;
- current state `WAITING_POLICY_FINGERPRINTS`;
- no arbitrary overlap/correlation threshold.

### D16 semantic split

SDA-022 must keep four ideas separate:

1. architectural executability independence;
2. information-root overlap/dependence;
3. statistical incremental information on same-target/common-support prospective evidence;
4. diversification of aligned strategy return/exposure paths.

High output overlap is not automatic failure.
Low output overlap is not automatic independence.
Shared truth/provenance is allowed and preferred.
Direct consumption of one system's decision output as the other's mandatory discovery path is a much stronger dependence state.

### Current architecture readback

System1 remains protected Formal A/B + Top6/3+3 + Formal ranking/lifecycle.

System2 remains materially distinct:
- `SHORT_MOMENTUM` RANK-01 uses TECHNICAL_STRUCTURE + PRICE_VOLUME + RISK_FRICTION;
- `SWING_GROWTH` RANK-01 uses FUNDAMENTAL_QUALITY + INDUSTRY_THESIS;
- strategy-local Pareto ranking;
- no universal cross-strategy scalar score by default;
- global candidate max 12 / per-strategy active max 3.

Therefore current state is not `SYSTEMS_IDENTICAL`.
But prospective non-convergence observability and D16 incrementality remain pending.

### Required D16 evidence

Future comparable-date pair receipts must expose:
- System1 policy fingerprint;
- per-strategy System2 fingerprint;
- discovery-path identity;
- candidate/universe relationship;
- shared information roots/hard gates;
- output overlap;
- legitimate common-support rank comparison when possible;
- System2 independent discovery;
- divergence reasons;
- SDA-016 consumption/outcome-footprint references.

Raw overlap-group returns are descriptive selection decomposition, not causal incrementality.

A diversification claim additionally requires aligned return/exposure/cost/downside dependence evidence; pick Jaccard alone is insufficient.

Room11 does not close SDA-022.
No maturity change.
Formal Core remains LOCKED.


## 2026-10-06 SDA-022 stage-4 canonical oracle convergence + D16 preregistration return

00 has frozen the canonical SDA-022 pre-outcome oracle:
- `shared-knowledge/SDA022_ACCEPTANCE_ORACLE_V0_1.md`;
- `shared-knowledge/sda022_acceptance_oracle_v0_1.json`;
- 28 blocking tests, S22-T01~T28;
- outcomes CLOSED.

Canonical machine schemas:
- `shared-knowledge/cross_system_policy_fingerprint_receipt_schema_v0_1.json`;
- `shared-knowledge/sda022_nc_t01_receipt_schema_v0_1.json`.

Room11 supplemental compatibility work:
- `research/SDA022_D16_FINGERPRINT_CONTRACT_COMPATIBILITY_AUDIT_20261006_V0_1.md`;
- `research/SDA022_D16_FINGERPRINT_COMPATIBILITY_MATRIX_20261006_V0_1.json`;
- `research/SDA022_D16_CROSS_SYSTEM_NON_CONVERGENCE_ORACLE_20261006_V0_2.json`.

The Room11 24-test oracle is now supplemental/adversarial only.
Whole-ticket closure baseline is the 00-owned 28-test oracle.

Room11 preregistered the highest-risk pair before economic outcome access:
- System1 current Formal A/B short-horizon policy;
- System2 SHORT_MOMENTUM V0.1-CONTRACT;
- primary target = exact official-session D5 common-reference-close positive-return event;
- primary metric = date-balanced Brier loss improvement;
- selected-only analysis prohibited;
- common information cutoff required;
- dependence / missingness / multiplicity / SDA-016 footprint controls frozen;
- other System2 strategies require separate experiment/version;
- D1/D3/D10 cannot rescue the D5 primary;
- diversification claim explicitly prohibited.

Canonical prereg:
- `research/SDA022_D16_S1_SHORT_MOMENTUM_D5_INCREMENTALITY_PREREG_20261006_V0_1.md`;
- `research/SDA022_D16_S1_SHORT_MOMENTUM_D5_INCREMENTALITY_PREREG_20261006_V0_1.json`.

Room11 machine validation against the 00 oracle:
- S22-T25 PASS;
- S22-T26 PASS;
- S22-T27 PASS;
- S22-T28 PASS;
- D16_BOUNDARY = 4/4 PASS.

Validation return:
- `research/SDA022_ROOM11_D16_PREREG_VALIDATION_RETURN_20261006_V0_1.md`;
- `research/SDA022_ROOM11_D16_PREREG_VALIDATION_RETURN_20261006_V0_1.json`.

Whole SDA-022 remains PARTIAL_PASS.
Repository search found schemas only, not actual System1 fingerprint, System2 per-strategy fingerprints, or physical NC-T01 receipt.

Therefore:
- S22-T01~T16 remain evidence-not-yet-available / pending;
- S22-T17~T24 cannot begin prospective accumulation until the upstream fingerprints + physical independence chain is ready;
- economic outcomes remain CLOSED;
- no maturity change;
- Formal Core remains LOCKED;
- 00 remains sole closure authority.


## 2026-10-06 SDA-022 continuation — System1 5/5 pass + outer-stream enrollment + stopping rule

New validated engineering evidence:
- System1 machine policy fingerprint receipt exists on main:
  `shared-knowledge/system1_policy_fingerprint_receipt_v0_1.json`;
- merge commit:
  `862b8c903e81e0945ba030b396b8a7d661f91f1e`;
- Room11 independent source-artifact readback = 3/3 SHA matches;
- current Formal ranking chain readback matches fingerprint;
- merge file scope contains only workflow + receipt + test, no Formal selector/ranking/capital/entry/signal/order source mutation.

Room11 validation:
- `S22-T01 = PASS`;
- `S22-T02 = PASS`;
- `S22-T03 = PASS`;
- `S22-T04 = PASS`;
- `S22-T05 = PASS`.

Durable validation:
- `research/SDA022_ROOM11_SYSTEM1_FINGERPRINT_VALIDATION_RETURN_20261006_V0_1.md`;
- `research/SDA022_ROOM11_SYSTEM1_FINGERPRINT_VALIDATION_RETURN_20261006_V0_1.json`.

Important limitation:
GitHub connector did not expose an independent workflow run / combined status for the merge commit, so this return does not claim visible CI evidence beyond code-diff/source readback.

Current verified canonical SDA-022 families:
- System1 fingerprint `S22-T01~T05 = 5/5 PASS`;
- D16 preregistration `S22-T25~T28 = 4/4 PASS`.

Still absent at latest search:
- actual System2 per-strategy fingerprint receipt;
- actual physical NC-T01 receipt.

Therefore `S22-T06~T16` remain pending.

### Outer research-stream enrollment completed before economic outcome access

New:
`research/D16_SDA022_OUTER_STREAM_ENROLLMENT_20261006_V0_1.json`.

Research stream:
`ROOM11_CROSS_SYSTEM_INCREMENTALITY_STREAM_20261006_V0_1`.

Hypothesis:
`SDA022-H01-SYSTEM1-VS-SHORT_MOMENTUM-D5`.

Experiment family:
`D16-SDA022-01`.

Current stream objective:
`EXPLORATORY_ONLY`.

This is deliberate:
no FWER/FDR/mFDR or confirmatory error-control claim is made before a valid outer method is frozen.
No outcome has been inspected.

### Single-look stopping rule frozen

New:
- `research/D16_SDA022_D5_STOPPING_RULE_20261006_V0_1.md`;
- `research/D16_SDA022_D5_STOPPING_RULE_20261006_V0_1.json`.

Rules:
- one primary inferential opening only;
- no efficacy early stopping;
- no futility early stopping from economic outcomes;
- readiness/integrity/coverage checks may continue outcome-blind;
- primary opening requires System2 fingerprint, physical NC-T01, prospective pair receipts, common cutoff, model-state encoding, ModelMethodReceipt, MDE/precision target, >=40 effective independent dates, class/replication/coverage/SDA-016 gates, and explicit outer-stream state.

### Central experiment registry updated

`research/EXPERIMENT_REGISTRY.md` now includes:
`D16-SDA022-01｜System1 vs System2 SHORT_MOMENTUM D5 增量資訊`.

No maturity change.
D16 = 60%.
D18 = 52%.
Formal Core LOCKED.
Whole SDA-022 remains PARTIAL_PASS.
Room00 remains sole closure authority.


## 2026-10-06 SDA-016 Formal→C1 binding contract-layer validation

New canonical validation artifacts:
- `research/SDA016_ROOM11_FORMAL_C1_BINDING_CONTRACT_VALIDATION_20261006_V0_1.md`;
- `research/SDA016_ROOM11_FORMAL_C1_BINDING_CONTRACT_VALIDATION_20261006_V0_1.json`.

Authoritative contract:
- `research/SDA016_SYSTEM1_FORMAL_C1_BINDING_IMPLEMENTATION_CONTRACT_20261006_V0_1.md`;
- `research/sda016_system1_formal_c1_binding_contract_v0_1.json`.

Merged:
- PR #675 `b32b266cbd4a23674f1021847944d97cd345d0df`;
- governance sync PR #678 `dba33aa3e4bb0ff529fec81aa62eab7594c86dc4`.

Contract state:
`CLASS_A_CONTRACT_FROZEN / CLASS_B_IMPLEMENTATION_PENDING`.

### Current V8.19 state corrected

Latest canonical System1 status now proves:
- PR #644 merged;
- merge SHA `b79e1e7c22b015e96ecd3780cbf56b21091fd4de`;
- Production deploy run `37382112616` success;
- post-merge regression `37382112493` success;
- runtime `8.19.0-c1-scan-origin-generation-inventory` verified;
- testMode=false;
- rollbackTriggered=false.

Still:
`PENDING_FIRST_GENUINE_POST_DEPLOY_C1_SESSION`.

### SDA016-T41~T48 interpretation

- T41: contract-covered, runtime pending;
- T42: contract-covered, runtime pending;
- T43: existing current-session `FORMAL_C1_GENERATION_UNLINKED` fail-closed guard remains accepted;
- T44: contract-covered, runtime pending;
- T45: contract-covered, runtime pending;
- T46: contract-covered, runtime pending;
- T47: contract-covered, runtime pending;
- T48: OPEN, because same-session generation-set finalization is explicitly not solved by V0.1.

No contract-layer acceptance is promoted into deployed runtime evidence.

### Class-B still required

Pending:
- append-only `trade_research_formal_c1_bindings` table;
- runtime binding writer;
- protected historical readback;
- deterministic runtime conflict behavior;
- Production deployment;
- genuine binding readback.

### Governance status

Systemwide governance audit:
`SYSTEMWIDE_AUDIT_COMPLETE_GOVERNANCE_SYNC_COMPLETE_WITH_ACTIVE_EXTERNAL_BLOCKERS`.

It has already synchronized:
- central SDA-016/SDA-017 oracle counts to 58/56;
- SDA-022 D16 prereg 4/4 state;
- PR #644 merged/deployed state.

Therefore Room11 does not overwrite central governance.

Minor residual:
the V8.19 current-status receipt text still references remaining V0.4 oracle evidence in one unresolved line; current queue / systemwide audit correctly use V0.5 / 58 tests.
Treat as stale text only, not authority.

No maturity change.
D16 = 60%.
D18 = 52%.
Formal Core LOCKED.


## 2026-10-07 SDA-016 V8.20 runtime + first scheduled prospective readback

Canonical Room11 validation:
- `research/SDA016_ROOM11_V820_RUNTIME_FIRST_SCHEDULED_READBACK_VALIDATION_20261007_V0_1.md`;
- `research/SDA016_ROOM11_V820_RUNTIME_FIRST_SCHEDULED_READBACK_VALIDATION_20261007_V0_1.json`.

### V8.20 runtime accepted at engineering layer

PR #680 merge:
`1bd9e05d730f2f7c5909a52502837eabd2bb111f`.

Runtime:
`8.20.0-formal-c1-binding-ledger`.

Exact-head CI independently read:
- `37479305244` V8 Regression = SUCCESS;
- `37479305145` V8 Repair CI = SUCCESS;
- `37479305270` System1 C1/C2 isolated review = SUCCESS;
- `37479305394` D02 PVE-250 integration CI = SUCCESS.

Merged-main Production:
- `37483896567` V8 Cloudflare Deploy = SUCCESS;
- `37483896007` V8 Regression = SUCCESS.

Production deploy explicitly applied V8.20 Formal-C1 authoritative binding and verified deployed version/configuration.
Formal Core remains unchanged.

Runtime oracle delta:
- T41 = ENGINEERING_RUNTIME_PASS;
- T42 = ENGINEERING_RUNTIME_PASS;
- T43 = PASS_PRESERVED;
- T44 = ENGINEERING_RUNTIME_PASS;
- T45 = ENGINEERING_RUNTIME_PASS;
- T46 = ENGINEERING_RUNTIME_PASS;
- T47 = ENGINEERING_RUNTIME_PASS;
- T48 = OPEN_GENERATION_SET_FINALIZATION_PENDING.

These engineering passes do not create prospective research evidence by themselves.

### First scheduled post-deploy attempt — genuine negative readiness evidence

Workflow:
`System 1 C1 Prospective Evidence`.

Scheduled run:
`37495670280`.

Job:
`112379442583`.

Result:
FAILURE at immutable C1 population receipt collection.

Artifact:
- ID `11426824056`;
- name `system1-c1-evidence-37495670280`;
- ZIP digest `sha256:29d7659e2451188a52de5c3631e4088a4eedbaa0f3a3da235fffbf9ba7ad3967`;
- only file = `system1-c1-readiness.json`.

Readiness:
- scanDate = 2026-10-06;
- category = `FORMAL_SCAN_NOT_CONFIRMED`;
- verificationFailure = `C1_GENERATION_NOT_FOUND`;
- mayCountAsZeroPick = false;
- eligibleForResearch = false;
- formalScanDate = 2026-09-29;
- formalPipelineComplete = false;
- institutionReady = true;
- qualityReady = false;
- missingQuality = FINANCIAL + QUARTER_EPS.

D16 admission:
`INELIGIBLE_PARENT_MISSING`.

This is not:
- a zero-pick;
- a negative return;
- a strategy failure;
- a valid C1 generation;
- a genuine Formal↔C1 binding sample.

No historical backfill may convert it into prospective evidence.

### PR #700 interpretation

PR #700 merged read-only collector/validator wiring.
Its merge-triggered collector also failed while regression passed.

Therefore:
`GENUINE_READBACK_COLLECTION_PIPELINE_READY`
but
`GENUINE_BINDING_RECEIPT_VERIFIED = FALSE`.

Current genuine Formal↔C1 prospective sample count remains zero.

No maturity change.
D16 = 60%.
D18 = 52%.
Formal Core LOCKED.


## 2026-10-07 D16 prospective-attempt ledger + SDA016-T48 finalization semantics

### Prospective evidence attempt-ledger firewall

New canonical artifacts:
- `research/D16_PROSPECTIVE_EVIDENCE_ATTEMPT_LEDGER_CONTRACT_20261007_V0_1.md`;
- `research/D16_PROSPECTIVE_EVIDENCE_ATTEMPT_LEDGER_CONTRACT_20261007_V0_1.json`;
- `research/D16_PROSPECTIVE_EVIDENCE_ATTEMPT_20261006_V0_1.json`;
- `research/D16_PROSPECTIVE_EVIDENCE_ATTEMPT_20261002_RETROSPECTIVE_IMPORT_V0_1.json`;
- `research/D16_PROSPECTIVE_ATTEMPT_CAUSAL_COMPARISON_20261007_V0_1.md`.

New rule:
every prospective evidence collection execution is a first-class governance event, including blocked attempts.

Operational attempt denominator is distinct from:
- research calendar-candidate denominator;
- target-population eligible denominator;
- prospective evidence N.

Fail-closed defaults for incomplete parent/lineage:
- not zero-pick;
- not negative outcome;
- not strategy failure;
- not prospective evidence.

Blocked attempts must remain in missingness/accounting history.

### Causal-attribution firewall

2026-10-02 and 2026-10-06 both surface:
`FORMAL_SCAN_NOT_CONFIRMED / C1_GENERATION_NOT_FOUND`.

But they are not causally interchangeable.

2026-10-02:
- institutionReady=true;
- qualityReady=true;
- missed ready recovery attributed to `CROSS_MIDNIGHT_TARGET_DATE_DRIFT`;
- direct original 23:35/23:55 Worker failure remains unknown;
- causal status = `PARTIAL_CAUSAL_CHAIN`.

2026-10-06:
- institutionReady=true;
- qualityReady=false;
- missingQuality = FINANCIAL + QUARTER_EPS;
- no complete chain proves these missing sources were the sole cause of absent Formal/C1;
- causal status = `OBSERVED_FACTS_ONLY`.

Therefore a shared terminal blocker code must not be treated as one homogeneous missingness mechanism without a preregistered mechanism mapping.

The 2026-10-02 record is a `RETROSPECTIVE_LEDGER_IMPORT` for governance continuity only and creates no new prospective evidence.

### SDA016-T48 finalization semantics frozen

New canonical:
- `research/SDA016_GENERATION_SET_FINALIZATION_CONTRACT_20261007_V0_1.md`;
- `research/SDA016_GENERATION_SET_FINALIZATION_CONTRACT_20261007_V0_1.json`.

Key distinction:
V8.20 Formal→C1 binding establishes authoritative parent identity.
It does NOT establish complete same-session generation-set finalization.

Finalization now requires an independent pre-outcome append-only receipt binding:
- session identity;
- producer registry/version/set hash;
- deterministic producer cutoff rule;
- all producer attempts terminal;
- no pending retry/recovery;
- non-truncated integrity-complete generation inventory;
- canonical generation-set digest;
- all explicit Formal bindings reference members of the final set.

Current observed generation-producing classes:
- AFTER_MARKET_SCAN_PIPELINE;
- STAGE_SELECTION_ROUTE;
- DIRECT_SAFE_PERSISTENCE_CALLER.

Engineering owner must define the complete Production producer registry; D16 must not infer it from currently observed rows.

Late generation after finalization:
`POST_FINALIZATION_GENERATION_VIOLATION`.

Finalization may not be silently overwritten.

Supplemental T48 cases frozen:
`T48-F01~T48-F10`.

These are semantic acceptance cases for future engineering validation and do not change the canonical SDA016 V0.5 count of 58 tests.

Current T48:
`OPEN_GENERATION_SET_FINALIZATION_PENDING`.

No maturity change:
D16 = 60%.
D18 = 52%.
Formal Core LOCKED.


## 2026-10-07 prospective opportunity coverage + scheduler provenance

New canonical D16 artifacts:
- `research/D16_PROSPECTIVE_OPPORTUNITY_LEDGER_CONTRACT_20261007_V0_1.md`;
- `research/D16_PROSPECTIVE_OPPORTUNITY_LEDGER_CONTRACT_20261007_V0_1.json`;
- superseding scheduler-provenance extension:
  - `research/D16_PROSPECTIVE_OPPORTUNITY_LEDGER_CONTRACT_20261007_V0_2.md`;
  - `research/D16_PROSPECTIVE_OPPORTUNITY_LEDGER_CONTRACT_20261007_V0_2.json`;
- canonical-test crosswalk:
  - `research/SDA016_D16_SUPPLEMENTAL_GOVERNANCE_CROSSWALK_20261007_V0_1.json`.

### New denominator distinction

Attempt ledger is insufficient for silent no-run dates.

Promotion-grade prospective accounting now separates:
- expectedTradingOpportunityN;
- operationalAttemptOneObservedN;
- prospectiveEvidenceAdmissibleN.

Expected opportunities must be generated from a preregistered market-date window plus market-session identity, independent of observed runs/artifacts.

### Current System1 schedule semantic risk

Current workflow:
`.github/workflows/system1-c1-evidence.yml`

has:
- UTC cron `10 16 * * 1-5`;
- local interpretation = 00:10 Asia/Taipei Tuesday-Saturday;
- default blank scan date = `previousTaipeiDate()`;
- `previousTaipeiDate()` is previous Taipei calendar date, not guaranteed official previous Taiwan session.

Therefore:
cron execution count is not the research-opportunity denominator.

### Market-calendar provenance

Repo already contains a concrete unscheduled-closure counterexample:
2026-07-10 was a legitimate market closure but was absent from the preloaded 2026 planned-holiday calendar, causing historical expected-session misclassification.

Therefore opportunity rows require versioned market-session provenance and append-only correction lineage.

Do not silently rewrite trading/non-trading identity after later emergency-closure evidence arrives.

### First scheduled attempt as coverage anchor

Borrowing the already-frozen System2 coverage-integrity principle:
- first scheduled attempt for an opportunity is immutable coverage anchor;
- later rerun remains diagnostic;
- manual/push success does not repair a missing or failed scheduled anchor;
- later success cannot delete the first failure.

### Scheduler provenance

Official GitHub Actions documentation rechecked 2026-10-07:
- schedule events can be delayed under high load;
- queued scheduled jobs may be dropped under sufficiently high load;
- schedule triggers depend on workflow presence on default branch;
- scheduled run uses the latest default-branch commit.

Therefore:
`NO_SCHEDULED_ATTEMPT_OBSERVED`
is an observation, not an identified root cause.

It may still count as a coverage gap while causal state remains unknown.

### Canonical-oracle count unchanged

New supplemental controls are mapped back to existing:
- SDA016-T28;
- SDA016-T31;
- SDA016-T38;
- SDA016-T48.

Canonical SDA016 V0.5 remains exactly 58 blocking tests.
No test-count inflation.

No maturity change.
D16 = 60%.
D18 = 52%.
Formal Core LOCKED.


## 2026-10-07 first physical opportunity↔attempt reconciliation

New opportunity contract supersession:
- `research/D16_PROSPECTIVE_OPPORTUNITY_LEDGER_CONTRACT_20261007_V0_3.md`;
- `research/D16_PROSPECTIVE_OPPORTUNITY_LEDGER_CONTRACT_20261007_V0_3.json`.

V0.3 adds asymmetric market-session identity:
- direct same-day official nonzero market activity may certify a trading session;
- absence/zero/unpublished data cannot certify a non-trading day;
- non-trading identity still requires authoritative calendar/closure evidence;
- conflicting calendar/activity evidence becomes `MARKET_SESSION_IDENTITY_CONFLICT`.

### 2026-10-06 first physical reconciliation

Canonical:
- `research/D16_PROSPECTIVE_OPPORTUNITY_RECONCILIATION_20261006_V0_2.json`;
- `research/D16_PROSPECTIVE_OPPORTUNITY_RECONCILIATION_20261006_V0_2.md`.

Market session:
`VERIFIED_TRADING_SESSION`.

Direct physical witnesses:
- TPEx day-trading 843 rows / blob `e296da4d23830bc489b142f8e9bcce0417be99d1`;
- TPEx dealer split 904 rows / blob `5c57e62ef55e8b5c24c1de896e67614179423de5`;
- TWSE public dealer split 1340 rows / blob `1da2d93a80cd3387ee8182b53402f90aae683ba0`.

Session identity:
`fnv1a64-ascii:ba1e5c342d793649`.

Scheduled evidence anchor:
- run `37495670280`;
- job `112379442583`;
- event = schedule;
- run_attempt = 1;
- main head = `646a34263954e0beaf53cfcb897af2cc90c2aca4`;
- nominal 00:10 Taipei;
- actual start 00:26:06 Taipei;
- scheduler delay = 966 seconds;
- conclusion = failure.

The scheduler delay is not asserted as the cause of C1 failure.

Reconciliation:
`ATTEMPT_ONE_FAILED_BLOCKER_PRESERVED`.

For the first reconciled opportunity:
- expectedTradingOpportunityN = 1;
- operationalAttemptOneObservedN = 1;
- prospectiveEvidenceAdmissibleN = 0;
- operational attempt coverage = 100%;
- evidence admission = 0%.

This date remains:
`INELIGIBLE_PARENT_MISSING / FORMAL_SCAN_NOT_CONFIRMED / C1_GENERATION_NOT_FOUND`.

It is not:
- zero-pick;
- negative outcome;
- strategy failure;
- genuine Formal↔C1 evidence.

No historical backfill.
No maturity change.
D16 = 60%.
D18 = 52%.
Formal Core LOCKED.
