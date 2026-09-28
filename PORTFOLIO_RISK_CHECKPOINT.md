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
