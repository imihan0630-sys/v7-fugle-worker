# Portfolio & Risk Construction Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: PR-001 through PR-024 complete.
Next: open Trading Frictions, Turnover & Rebalancing lane.

## Durable conclusions

- Current Formal allocation controls capital concentration but has no explicit portfolio correlation/covariance/risk-contribution layer in main source.
- Equal capital != equal risk.
- Portfolio variance depends on covariance; single-stock 35% cap cannot prevent thematic/cluster concentration.
- Marginal/component risk contribution is useful descriptively but inherits covariance-estimation error.
- Correlations/downside dependence are state-dependent; stress correlation should be separate from ordinary correlation.
- “Diversification fails in crises” is too absolute; quantify remaining benefit.
- Official sector labels do not fully represent economic/common-factor risk clusters.
- Downside correlation/joint stop hits matter for a stop-based strategy.
- Covariance/expected-return estimates are noisy; prefer robust descriptive/shrinkage/cluster diagnostics before full optimization.
- Volatility scaling has mixed academic evidence; not a universal sizing rule.
- Planned stop risk differs even at equal capital and is not a guaranteed maximum loss because of gaps/limits/liquidity.
- FIRST/ADD/FULL changes portfolio risk dynamically; future research can calculate projected marginal risk, but no Formal ADD change is approved.
- First counterfactual allocation protocol is frozen.
- Formal Core remains LOCKED.

## Exact next continuation

PR-016 covariance shrinkage/small samples.
PR-017 hierarchical clustering/stability.
PR-018 effective bets/concentration.
PR-019 tail risk/expected shortfall.
PR-020 portfolio heat.
PR-021 cash as risk allocation.
PR-022 conviction vs concentration.
PR-023 3+3+3 capital interaction.
PR-024 concept convergence/readiness.


## PR-016 through PR-024 durable update

- Shrinkage covariance is the first robust covariance alternative; sample correlation remains the transparent baseline. Missing synchronized history => UNKNOWN.
- Hierarchical clustering is diagnostic-first. HRP allocation is not assumed superior and remains unapproved.
- Separate capital concentration from independent-risk concentration. Keep naming discipline around Meucci Effective Number of Bets.
- Expected Shortfall is conceptually useful but statistically weak on 20d/60d windows; gap/limit/stop stress is more actionable first.
- Planned/projected portfolio heat is a high-priority Shadow metric; it is not a guaranteed maximum loss and no folklore threshold is accepted.
- Cash must be attributed to structural reserve, no opportunity, pending entry, post-reduction, data/signal block or UNKNOWN before judging utilization.
- Formal priorityScore is not yet a calibrated expected-return/conviction measure; score-to-forward-outcome monotonicity requires independent-date validation.
- Risk must be viewed both within each ring-fenced pool and across consolidated genuinely-live Formal positions. Hybrid Shadow remains outside actual-live risk.
- Portfolio-risk concept lane is now CONCEPT_COMPLETE / EVIDENCE_PENDING. No Formal Core change.

## Exact next continuation

Start durable lane: Trading Frictions, Turnover & Rebalancing.


## D15-EB-001 — inverse HHI is not Effective Bets (2026-09-28)

A semantic falsification was completed for D15-06.

Existing Portfolio Risk research exposes `effectiveCapitalNames = 1 / HHI`. That quantity is useful, but its safe meaning is only:

`CONCENTRATION_EFFECTIVE_NAMES`.

It answers:
“How many equally weighted names would produce the same concentration HHI?”

It does **not** answer:
“How many statistically independent risk bets does this portfolio contain?”

For the 2026-09-18 projected-stop-risk witness:
- current projected-risk HHI = 0.377238;
- inverse HHI ≈ 2.65 concentration-equivalent names.

That number must not be called 2.65 independent bets.

A true Effective Bets study requires, at minimum:
- PIT-aligned synchronized return history;
- a validated covariance/dependence model;
- a frozen factor/risk decomposition;
- factor risk contributions with provenance.

Current Portfolio Risk read-only surfaces do not expose an already-authorized synchronized history series suitable for this purpose. Sector labels are not accepted as a substitute for correlation.

Therefore D15-06 remains L2 rather than being falsely promoted.

Artifacts:
`research/effective_bets_semantic_firewall_v0_1.mjs`;
`research/effective_bets_semantic_firewall_spec_v0_1.json`;
`tests/test_effective_bets_semantic_firewall_v0_1.mjs`.

Status:
`CONCENTRATION_COUNT_SEMANTICS_FROZEN / TRUE_EFFECTIVE_BETS_DATA_BLOCKED / D15_06_REMAINS_L2`.

Formal Core unchanged.


## D15-CA-001 — plan-time cash attribution separated from broker cash (2026-09-28)

D15-08 now has a falsifiable accounting taxonomy.

For each scan date, plan-time capital is decomposed into:
- planned deployment;
- designed strategic reserve from the selected-count deployment rule;
- allocation implementation shortfall;
- when exact allocator reconstruction matches the immutable plans, cap-induced reserve and NT$1,000 floor reserve.

The accounting identity is checked rather than assumed.

### Critical firewall

`planned cash != actual broker cash`.

Plan rows cannot tell whether:
- BUY/ADD triggered;
- suggested quantity was submitted;
- an order partially filled;
- REDUCE/SELL actually executed;
- cash was blocked by stale/unknown execution evidence.

Therefore actual execution-state cash remains UNKNOWN without fill/holdings/broker-balance evidence.

### Zero-selection semantics

A complete scan date with zero selected names is classified as:
`NO_ELIGIBLE_OPPORTUNITY / DESIGNED_100_PERCENT_RESERVE`.

It must not be labeled poor capital utilization merely because deployment is zero.

Artifacts:
`research/cash_attribution_v0_1.mjs`;
`research/cash_attribution_spec_v0_1.json`;
`tests/portfolio_risk_cash_attribution_readonly_audit.mjs`.

Status:
`PLAN_TIME_TAXONOMY_READY / PRODUCTION_AUDIT_PENDING`.

No Formal Core change.


## D15-CA-001 Production result — plan-time cash attribution is PIT-reconstructable

Production read-only run `36414452558` / job `108902108262` returned four recorded scan dates and four formal plan rows.

All four dates classified READY with zero accounting mismatches.

Key dates:
- 2026-09-18: NT$32,000 planned cash = NT$30,000 designed strategic reserve + NT$2,000 NT$1,000-grid implementation shortfall; cap-induced reserve = 0.
- 2026-09-21: NT$130,000 planned cash = designed one-name reserve; implementation shortfall = 0.
- 2026-09-22 and 2026-09-23: zero selected names, each correctly classified as `NO_ELIGIBLE_OPPORTUNITY / DESIGNED_100_PERCENT_RESERVE`.

No date has proven actual broker/execution cash. That field remains UNKNOWN on all 4/4 dates.

This rejects three shortcuts:
1. all unallocated plan capital is wasted cash;
2. the 2026-09-18 shortfall was caused by the 35% cap;
3. planned cash can be used as actual broker cash.

D15-08 Cash Attribution is promoted from L2/40% to **L3/60%** because Taiwan Production plan/journal evidence now supports PIT-consistent reconstruction.

Receipt:
`research/cash_attribution_production_receipt_20260928.json`.

Status:
`PLAN_TIME_CASH_ATTRIBUTION_PIT_VALIDATED / EXECUTION_CASH_UNKNOWN / D15_08_L3`.

Formal Core unchanged.


## D14-RR-001 — REDUCE exists; native RE-ADD lifecycle does not (2026-09-28)

A current-main source audit falsified a hidden assumption in D14-11 / D15-11:

`REDUCE -> RE-ADD already exists as a Formal lifecycle.`

It does not.

Current runtime:
- can emit BUY;
- can emit ADD;
- can emit REDUCE;
- can emit SELL / STOP_LOSS;
- normalizes positionStage only to NONE / FIRST / FULL;
- contains no native RE-ADD signal type;
- contains no REDUCED / RE-ADD_ELIGIBLE runtime stage.

The signal-state store manages de-duplication/delivery state. It does not prove a broker fill or mutate the actual portfolio into a REDUCED state.

Therefore:
`REDUCE signal -> realized reduction -> REDUCED state -> RE-ADD fill`
must not be reconstructed from current signal rows.

### Friction accounting boundary

For a future completed same-symbol, same-quantity cycle with positively linked actual fills:

`gross timing capture = q × (reduce fill price - re-add fill price)`.

Explicit net timing capture can then subtract positively evidenced:
- REDUCE sell commission;
- REDUCE sell tax;
- RE-ADD buy commission.

If actual fill prices are used, realized slippage is already embedded in those prices. A second generic slippage subtraction would double count execution friction.

If signal/reference prices are used instead, any slippage assumption must be explicit and the result remains MODELED rather than ACTUAL.

Quantity mismatch is not simplified into the same identity; it requires inventory-aware accounting.

Artifacts:
`research/reduce_readd_friction_v0_1.mjs`;
`research/reduce_readd_friction_spec_v0_1.json`;
`tests/test_reduce_readd_friction_v0_1.mjs`.

Status:
`RUNTIME_READD_ABSENT / FRICTION_EVIDENCE_CONTRACT_READY / REALIZED_READD_ANALYSIS_BLOCKED`.

No Formal change and no FORMAL_OPTIMIZATION_CANDIDATE.


## D15-MP-001 — 3+3 pool separation is price-tier capacity, not proven diversification (2026-10-02)

D15-15 starts by falsifying a common semantic shortcut:

`GENERAL pool + THOUSAND pool = two independent portfolio risk bets`.

Current Formal source does **not** support that statement.

### Exact pool mechanism

The selector splits on the same scan-date close used in the final plan:

- GENERAL = formal close < NT$1,000;
- THOUSAND = formal close >= NT$1,000;
- each pool keeps at most 3 names;
- unused slots do not cross-fill.

The split is therefore a **price-tier capacity rule**. It is not defined from:
- sector;
- covariance;
- correlation;
- factor exposure;
- volatility cluster;
- effective independent bets.

### PIT reconstruction

The immutable trade-journal plan stores `formal_close`.

Current plan construction sets:
`formalClose = item.close`
on the same scan date, while the pool split also uses `item.close`.

Therefore historical selected-plan pool identity is PIT-safe to reconstruct from `formal_close` without using any later price.

### Research metrics

For each selected date the audit freezes:
- name count by pool;
- capital by pool;
- projected stop-risk by pool;
- aggregate name-level risk HHI;
- pool capital HHI;
- pool projected-risk HHI;
- within-pool HHI where at least two names exist.

### Anti-overclaim firewall

A date with only one represented pool is:
`CROSS_POOL_NON_IDENTIFYING`.

A date with both pools represented can describe capital/risk split across price tiers, but still cannot prove genuine diversification.

True cross-pool diversification requires PIT-synchronized return/covariance evidence under D15-03/04/05/06. Price tier, industry labels or number of pools are not substitutes.

Artifacts:
- `research/d15_multi_pool_structural_risk_v0_1.mjs`
- `research/d15_multi_pool_structural_risk_spec_v0_1.json`
- `tests/test_d15_multi_pool_structural_risk_v0_1.mjs`
- `tests/d15_multi_pool_production_readonly_audit.mjs`

Status:
`POOL_IDENTITY_SOURCE_CONTRACT_READY / PRODUCTION_AUDIT_PENDING / DIVERSIFICATION_UNPROVEN`.

Formal Core unchanged.


## D15-MP-001 Production result — pool identity is PIT-valid; cross-pool diversification has zero identifying dates

Read-only Production run `36968309192` / job `110716767898` returned four recorded scan dates.

Results:
- recorded dates = 4;
- selected dates with complete pool reconstruction = 2;
- dates with GENERAL and THOUSAND both represented = **0**;
- selected single-pool dates = 2.

2026-09-18:
- selected = 2006 / 3105 / 6133;
- GENERAL = 3;
- THOUSAND = 0;
- all NT$168,000 planned capital and NT$6,483.4292 projected stop-risk belong to GENERAL.

2026-09-21:
- selected = 3006;
- GENERAL = 1;
- THOUSAND = 0.

2026-09-22 / 2026-09-23:
- zero selected names.

### Falsification result

The evidence supports:
`selected-plan pool identity is PIT-reconstructable`.

It does **not** support:
`3+3 has demonstrated cross-pool diversification`.

The zero count of both-pools dates means:
`ABSENCE_OF_IDENTIFYING_SAMPLE`,
not:
`cross-pool diversification effect = 0`.

True diversification/effective-bets claims remain dependent on D15-03/04/05/06 PIT-synchronized return/covariance evidence.

### Maturity

D15-15 advances:
`L2 / 40% -> L3 / 60%`
for **Taiwan Production source/data feasibility only**.

No L4, OOS, alpha or diversification-effect claim.

Receipt:
`research/d15_multi_pool_production_receipt_20261002.json`.

Status:
`POOL_IDENTITY_PIT_VALIDATED / BOTH_POOLS_SAMPLE_ZERO / CROSS_POOL_DIVERSIFICATION_UNKNOWN / D15_15_L3`.

Formal Core unchanged. No `FORMAL_OPTIMIZATION_CANDIDATE`.
