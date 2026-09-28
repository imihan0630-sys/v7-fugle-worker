# D16 + D18 Regime Policy Promotion Gate V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH-ONLY / PROMOTION-GATE SPEC / FORMAL_CORE_LOCKED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Define when a Market Regime × Strategy result is allowed to move from:
- descriptive theory,
- to PIT/replay feasibility,
- to prospective/OOS evidence,
- to robustness,
- and finally to a FORMAL_OPTIMIZATION_CANDIDATE proposal.

This gate is intentionally harder than a normal single-factor descriptive study because regime policies add:
- state taxonomy choice;
- transition/persistence choice;
- strategy pairing choice;
- policy action choice;
- exposure/weight choice;
- repeated model selection over one market history.

## 1. Evidence unit: dates are not enough

Primary inference is date/path paired, but regime persistence creates an additional dependence layer.

Track both:
- independent official decision dates;
- independent **regime episodes**.

A regime episode is one contiguous run of the same action-driving state across official trading sessions. Gaps with UNKNOWN session continuity terminate the episode.

Why:
100 consecutive RISK_OFF dates may represent one historical shock, not 100 independent demonstrations that a policy works.

Required reporting:
- date count by state;
- episode count by state;
- median/max episode length;
- transition count;
- policy-action count;
- exposure-weighted occupancy;
- UNKNOWN count/share.

A state represented by only one episode is descriptive-only regardless of how many dates it contains.

More than one episode is necessary but not sufficient for promotion.

## 2. Do not use a universal fixed-N promotion rule

Existing registry thresholds such as 15 usable dates or 20 paired dates are **descriptive-readiness floors**, not proof of adequate statistical power.

Promotion sample sufficiency must instead be tied to:
- preregistered Minimum Detectable / Economically Meaningful Effect (MDE);
- date/episode variability;
- serial dependence;
- regime occupancy;
- action frequency;
- multiple-testing family size;
- cost/slippage uncertainty.

Do not stop accumulating evidence merely because a p-value first crosses a threshold.

Promotion analysis should occur at preregistered evidence checkpoints. Repeated peeking between checkpoints is descriptive only unless a sequentially valid method was preregistered.

## 3. Primary policy estimand

For each eligible decision date t:

Delta_t = NetOutcome(REGIME_POLICY_CHALLENGER)_t - NetOutcome(STATIC_BASELINE)_t

Both arms must share:
- source session;
- universe;
- strategy version;
- pre-policy candidate/ranking stream;
- capital model;
- execution simulator;
- fee/tax/slippage model;
- outcome horizon.

Secondary estimand:

DeltaExposure_t = NetOutcome(REGIME_POLICY_CHALLENGER)_t - NetOutcome(EXPOSURE_MATCHED_CONTROL)_t

A drawdown reduction without positive/defensible DeltaExposure is de-risking evidence, not regime-timing evidence.

## 4. Policy scope must be explicit

Do not pool different interventions under one "regime policy".

Separate experiment classes:
1. ENTRY_GATE_ONLY
   - affects only new entries.
2. ENTRY_SIZE_SCALE
   - changes new-entry exposure only.
3. ADD_READD_GATE
   - affects add/re-add decisions.
4. EXISTING_POSITION_DERISK
   - reduces/exits already-open positions.
5. STRATEGY_WEIGHT_REALLOCATION
   - changes capital across strategy sleeves.

Each class has a different counterfactual, turnover and opportunity-cost path.

A policy that changes class creates a new experiment version.

## 5. Action timing

After-close regime evidence may affect no earlier than the next official tradable session.

Required:
- regimeDecisionTimestamp;
- actionEffectiveSession;
- nextTradableSession proof;
- holiday/suspension continuity;
- execution-price semantics.

Do not use an after-close state to erase or alter the same session's realized path.

For existing-position de-risking, execution must model next-session gap/open/limit constraints and cannot assume close-price liquidation.

## 6. Walk-forward / nested validation

Outer loop:
- chronological untouched holdout;
- no outcome retuning;
- prediction/evaluation intervals stored.

Inner loop:
- only if a parameter truly requires tuning;
- training-only;
- same purging/overlap rules.

Purging:
remove any training row whose outcome/label interval overlaps an outer/inner test interval.

Embargo:
may be added only for a documented contamination/serial-dependence mechanism. It is not a magic fixed percentage and must not be tuned to improve returns.

Every learned preprocessing transform must fit inside the training boundary:
- normalization mean/std;
- quantile cutoffs;
- PCA;
- state mapping;
- HMM parameters;
- feature selection;
- regime threshold calibration.

Full-sample transforms invalidate the fold even if the trading model itself is trained chronologically.

## 7. Regime episode robustness

For every action-driving state:
- report effect by episode;
- run leave-one-episode-out analysis when episode count permits;
- report whether sign/conclusion reverses after removing the largest-contribution episode;
- report contribution concentration.

Promotion is blocked when the claimed edge is effectively one-event-dependent.

Do not manufacture independence by splitting one long episode into arbitrary calendar blocks.

## 8. Dependence-aware uncertainty

Daily policy differentials are serially dependent because of:
- persistent regime states;
- overlapping holding horizons;
- position carry;
- volatility clustering;
- common market shocks.

Therefore naive iid standard errors / iid bootstrap are not primary inference.

Candidate tools:
- stationary bootstrap;
- moving/block bootstrap;
- HAC-style inference where assumptions and missing-date semantics are appropriate.

White's Reality Check itself uses dependence-aware resampling ideas; Politis-Romano stationary bootstrap was designed for weakly dependent stationary observations.

Block length / bandwidth is itself an inference parameter:
- document it;
- sensitivity test reasonable alternatives;
- do not choose it for the best significance result.

## 9. Multiple testing / model search

The experiment family includes all materially tested:
- regime taxonomies;
- component combinations;
- thresholds;
- state counts;
- hysteresis/persistence values;
- model families;
- strategy pairings;
- action classes;
- exposure maps;
- holding horizons;
- cost assumptions used for selection;
- refit frequencies.

Failed variants remain registered.

Diagnostics:
- White Reality Check: benchmark-relative superiority across searched alternatives.
- Hansen SPA: similar family-wise predictive-superiority problem with improved power / less sensitivity to irrelevant alternatives.
- PBO/CSCV: selection-process overfit diagnostic.
- DSR: Sharpe evidence adjusted for selection bias and non-normality.

These are supplementary.
None can rescue:
- PIT failure;
- same-session look-ahead;
- contaminated folds;
- missing counterfactual;
- unrepresentative Shadow cohorts.

PBO/SPA/DSR should not be mechanically applied to a tiny early sample; insufficient evidence remains INSUFFICIENT_EVIDENCE.

## 10. Regime occupancy and sparse-cell firewall

Do not build a full crossed cube from many regime dimensions at the start.

Research order:
1. single observable regime dimension × one strategy;
2. same dimension across strategies;
3. second dimension as incremental context;
4. pairwise interactions after both marginals mature;
5. composite / latent regime models last.

For every tested policy:
- list number/share of dates in each state;
- number/share of actual policy actions in each state;
- episode counts;
- UNKNOWN share;
- no-action share.

A state that rarely occurs can look spectacular from a tiny cell. Sparse cells are displayed but not promoted.

## 11. Zero-pick semantics

Preserve three separate states:
- NATURAL_ZERO_PICK: static frozen strategy had no eligible action.
- POLICY_DISABLED: baseline had an action but regime policy suppressed/reduced it.
- DATA_UNKNOWN: source/provenance/integrity prevented a valid decision.

Only POLICY_DISABLED has a regime-policy opportunity-cost counterfactual.

DATA_UNKNOWN is excluded from net-alpha claims and reported as coverage loss, never converted to 0/BAD.

## 12. Cost and execution stress

Promotion metrics must be net of the same baseline/challenger execution assumptions.

Report:
- fees;
- tax;
- slippage;
- incremental turnover;
- next-session gap;
- limit-up/down feasibility;
- missed fills;
- missed upside from disabled trades;
- idle-capital days.

Stress:
- base cost;
- higher slippage/cost scenario;
- transition-day stress.

If the edge disappears under a modest plausible stress, mark COST_FRAGILE.

## 13. Minimum economically meaningful effect

Before the first policy outcome is inspected, define an MDE in a decision-relevant unit, for example:
- net basis points per invested capital-day;
- paired date-level net return improvement;
- drawdown reduction with a maximum allowed return sacrifice;
- opportunity-cost-adjusted expectancy improvement.

Do not define MDE from the observed sample mean.

Promotion requires the uncertainty band to become informative relative to the preregistered MDE; a positive point estimate with an extremely wide interval is not mature evidence.

## 14. L-level mapping

### L2 — Mechanism + falsification
Requires:
- clear estimand;
- PIT semantics;
- counterfactual definition;
- failure modes;
- negative-control plan.

No executable data proof required.

### L3 — Taiwan PIT data feasibility
Requires:
- executable or tested data builder;
- source/version/availableAt provenance;
- replay test;
- UNKNOWN fail-closed behavior;
- no current-data historical backfill;
- source coverage audited.

A specification-only field is not L3.

### L4 — Prospective Shadow / OOS evidence
Requires:
- frozen strategy + regime + policy versions;
- paired baseline/challenger prospective or untouched chronological OOS;
- correct next-session action timing;
- complete outcome join;
- natural zero-pick/policy-disabled/data-unknown separation;
- more than one relevant regime episode;
- no obvious single-episode domination;
- identical costs;
- exposure-matched control for de-risking policies.

L4 does NOT mean ready for Formal.

### L5 — Robustness / cost / redundancy / multi-regime
Requires:
- multiple independent regime episodes;
- leave-one-episode robustness;
- cost/slippage stress;
- factor/redundancy controls;
- multiple-testing/search diagnostics appropriate to available sample;
- cross-period / cross-state evidence;
- no single sector/year/episode driving the result;
- parameter-neighborhood / version stability where relevant.

Only after L5 may a Formal Optimization Bridge proposal be considered.

## 15. Formal Optimization Candidate gate

A D18 policy may be surfaced as FORMAL_OPTIMIZATION_CANDIDATE only if all are true:

1. PIT/replay PASS.
2. Experiment registry PASS.
3. Static-baseline paired comparison PASS.
4. Exposure-matched negative control PASS where applicable.
5. Chronological OOS / prospective Shadow PASS.
6. Regime episode robustness PASS.
7. Transaction-cost/execution stress PASS.
8. UNKNOWN/coverage not outcome-selective.
9. Multiple-testing/search-risk review PASS.
10. Redundancy versus existing strategy factors/regime inputs reviewed.
11. No Formal rule was modified to generate the evidence.
12. Owner approval is still required after candidacy.

Candidate status means "worthy of formal optimization review", not deployment approval.

## 16. Literature / methodological basis

- White (2000), A Reality Check for Data Snooping, Econometrica 68(5), 1097-1126.
- Hansen (2005), A Test for Superior Predictive Ability, JBES 23(4), 365-380.
- Harvey, Liu & Zhu (2016), ... and the Cross-Section of Expected Returns, RFS 29(1), 5-68.
- Bailey et al., The Probability of Backtest Overfitting, Journal of Computational Finance.
- Bailey & López de Prado (2014), The Deflated Sharpe Ratio, Journal of Portfolio Management 40(5), 94-107.
- Politis & Romano (1994), The Stationary Bootstrap, JASA 89(428), 1303-1313.
- López de Prado (2018), Advances in Financial Machine Learning, purging/embargo and combinatorial purged CV methodology.
- Blanchard et al. (2025), Bayesian regime-switching investment strategies: false state signals can escalate transaction costs.
- Shu, Yu & Mulvey (2024), regime-switching downside-risk study with OOS, costs and trading delay; useful positive plausibility evidence, not Taiwan transfer evidence.

## 17. Current decision

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

The correct next task is not to search for a profitable regime threshold.
It is to build the PIT market-level regime feature layer and accumulate honest state occupancy before testing policy alpha.

## Exact next continuation

1. Freeze a market-level raw-feature builder plan using existing A1/A2/A3/B2 contracts with zero new market-data calls where possible.
2. Separate source-ready, derived-ready, history-dependent and blocked dimensions.
3. Implement/review research-only replay tests before L3 promotion.
4. Accumulate context-only prospective regime snapshots before any policy is armed.
5. Only after occupancy is known, choose one preregistered single-dimension strategy policy and MDE.
