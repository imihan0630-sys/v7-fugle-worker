# D16 + D18 Regime Policy Validation Research V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH-ONLY / PREREGISTRATION ARCHITECTURE / FORMAL_CORE_LOCKED
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Research question

The target is not to prove that market regimes exist descriptively. The target is to determine whether a regime-conditioned policy adds reproducible net value versus the same frozen strategy operated without regime switching.

This creates a strict separation:

- **Attribution**: conditional historical performance by PIT-safe regime.
- **Policy**: incremental outcome caused by activation/deactivation, exposure scaling or weighting based on the regime information available at the decision clock.

Attribution is necessary context but is never sufficient evidence for a policy change.

## 1. Evidence hierarchy

A regime-policy claim must pass the following order. A later stage cannot repair failure at an earlier stage.

1. PIT / replay validity.
2. Frozen strategy, regime taxonomy, decision clock and execution assumptions.
3. Honest experiment-family registration.
4. Purged walk-forward / untouched OOS comparison.
5. Negative controls and redundancy checks.
6. Prospective Shadow parallel-arm comparison.
7. Cost/slippage/exposure/opportunity-cost stress.
8. Cross-regime, cross-period and independent-date robustness.
9. Only then may an optimization proposal be considered.

No p-value, Sharpe ratio or attractive chart can compensate for PIT failure.

## 2. Real-time regime rule: filtered, not smoothed

For latent-state methods such as HMM / Markov switching:

- trading and OOS decisions may use only **filtered** or one-step predicted state information constructed from data available through the decision clock;
- **smoothed** state probabilities use the full sample, including observations after time t, and are therefore retrospective diagnostics only;
- any historical state path produced after seeing later observations must be marked EX_POST and is not admissible as a trading-state replay;
- model fitting itself must also respect the rolling training boundary. Re-estimating parameters on the full history and then calling the historical filtered state "PIT" is still contaminated.

Preferred first implementation is not an HMM. Start with coarse observable states already supported by System 2 PIT contracts. Latent-state models are challenger models because they add state-count, distribution, transition and fitting degrees of freedom.

## 3. Experiment family, not isolated winner

The multiplicity family includes every materially distinct:

- regime taxonomy;
- state count;
- threshold;
- persistence / hysteresis length;
- transition rule;
- strategy × regime pairing;
- horizon;
- activation map;
- exposure map;
- dynamic-weight map;
- cost assumption used for selection;
- model family;
- hyperparameter configuration.

A failed variant remains in the experiment ledger. Renaming or slightly modifying it does not reset the trial count.

Interpretation:
- White Reality Check / Hansen SPA can test predictive superiority while accounting for a family of alternatives;
- Probability of Backtest Overfitting (PBO) / CSCV can diagnose whether the search process repeatedly selects in-sample winners that degrade out of sample;
- Deflated Sharpe Ratio (DSR) can be a supplementary summary for selection bias and non-normality;
- none of these replaces untouched chronological OOS or prospective Shadow evidence.

## 4. Frozen parallel-arm design

The first causal-style regime-policy experiment should use two simultaneous research arms generated from the same immutable daily inputs.

### Arm A — STATIC_BASELINE
- same frozen strategy version;
- regime recorded only as context;
- no regime-based activation, ranking, weighting or exposure change.

### Arm B — REGIME_POLICY_CHALLENGER
- same strategy outputs and execution simulator;
- one preregistered regime overlay only;
- may ENABLE / REDUCE / DISABLE or use a tiny discrete exposure map;
- no simultaneous ranking/factor-definition modification.

Both arms must share:
- source-session receipt;
- universe version;
- strategy version;
- candidate stream;
- decision timestamp;
- execution assumptions;
- fees/tax/slippage model;
- capital and sizing conventions.

The only allowed difference is the regime policy under test.

This isolates policy value from selection-alpha changes.

## 5. Counterfactual preservation

A gate that disables a strategy must still preserve what the static baseline would have done. Otherwise missed opportunities are unobservable.

Required per-date policy receipt:
- baseline decision IDs/hash;
- challenger decision IDs/hash;
- regime snapshot ID/version;
- policy version;
- baseline exposure;
- challenger exposure;
- policy action and reason;
- skipped baseline opportunities;
- incremental turnover;
- identical execution-model version;
- outcome-join eligibility.

System 2 daily Shadow runtime already demonstrates full eligible-universe accounting and fails closed when accounting is incomplete. This establishes feasibility for preserving the baseline counterfactual at the data-contract level, but scheduled prospective capture remains disabled as of this research date.

## 6. Exposure-matched negative control

A regime gate can appear safer simply because it invests less.

Therefore the challenger must be compared not only with the full static baseline, but also with an **exposure-matched control** that has approximately the same average gross exposure / invested fraction but does not use the regime signal.

Examples allowed only when preregistered:
- constant reduced exposure;
- deterministic schedule independent of market outcomes;
- block-permuted regime actions preserving action frequency where appropriate.

If the regime policy cannot beat an exposure-matched control after costs, the apparent improvement is de-risking, not evidence of regime timing skill.

## 7. Transition / whipsaw accounting

Every regime switch has an economic and statistical cost.

Report separately:
- true/false transition frequency where a defensible reference exists;
- number of policy state changes;
- holding/exposure churn;
- delay from evidence change to actionable decision;
- incremental turnover;
- fees/tax/slippage;
- missed rebound / missed upside;
- transition-state UNKNOWN share.

Do not optimize hysteresis after seeing policy returns. Any persistence length or confirmation rule is a new experiment version.

A transition/uncertain state may be retained explicitly rather than forcing every date into bull/bear or risk-on/risk-off.

## 8. Dynamic strategy weighting benchmark

Dynamic weights introduce more estimation error than on/off gating.

First admissible benchmark set:
- static equal weights / simple fixed weights;
- tiny preregistered discrete regime mapping;
- no continuous optimizer in the first evidence phase.

The challenger must beat simple static allocation after turnover and estimation error. Literature on portfolio optimization shows sophisticated estimated weights often fail to consistently beat simple 1/N out of sample because estimation error consumes theoretical gains. Regime-dependent weighting therefore carries a high evidence burden.

## 9. Primary inference unit

The primary unit is the independent market decision date / portfolio path, not individual stock rows.

Stock-level rows from one date share:
- market state;
- source conditions;
- strategy version;
- liquidity shock;
- sector shocks.

They are clustered observations, not independent replications.

Primary policy effect:
- paired date/path-level net outcome of challenger minus static baseline under identical costs.

Secondary diagnostics:
- drawdown;
- downside tail;
- MFE/MAE;
- utilization;
- zero-pick / zero-exposure;
- turnover;
- missed upside;
- strategy correlation.

A policy cannot be promoted because one secondary metric improved while the preregistered primary outcome failed.

## 10. Walk-forward protocol

For each outer step:

1. Freeze the candidate model family and experiment ledger.
2. Use only data available before the outer holdout.
3. Purge training observations whose outcome horizon overlaps holdout.
4. If tuning is needed, tune only within the training block using an inner procedure.
5. Refit/freeze before entering the holdout.
6. Generate regime states in real time using filtered/current information only.
7. Run STATIC_BASELINE and REGIME_POLICY_CHALLENGER with identical costs.
8. Do not retune during the holdout.
9. Advance chronologically and repeat.
10. Aggregate across independent holdout dates.

The final prospective Shadow epoch remains untouched by research iteration.

## 11. Negative-control matrix

A claimed Regime × Strategy edge must survive:

- static baseline;
- exposure-matched non-regime baseline;
- block/date-permuted regime labels or actions that preserve temporal structure;
- domestic-only versus global-only versus incremental domestic+global context;
- transition-date exclusion sensitivity;
- sector-composition sensitivity;
- large/small size leadership after liquidity, volatility, limit-state and information-quality controls;
- leave-one-period / leave-one-regime / leave-one-sector diagnostics when sample supports them;
- cost/slippage stress;
- UNKNOWN/coverage stress;
- simple strategy-weight benchmark.

## 12. D18-06 size leadership status

Mechanism and falsification are now defined, so conceptual L2 is justified.

However L3 is blocked because the current market-cap source lineage is not fully PIT-preserved:
- current Formal marketCapYi may be explicit enrichment or sharesOutstanding × close fallback;
- pre-merge source identity is required;
- official/custom source dates can be lost before the merged stock reaches downstream logic;
- current shares must never be backfilled against historical prices.

The existing Class-B market-cap source-capture proposal is the correct next evidence infrastructure. No current reconstruction may substitute for it.

## 13. D18-07 domestic vs global risk status

Mechanism and falsification are defined, so conceptual L2 is justified.

Domestic Taiwan risk context is materially more feasible than global transmission because System 2 already has PIT-oriented contracts for Taiwan index, breadth, activity, institutions and volatility.

Global context remains partially blocked:
- CBC USD/TWD has a plausible prospective official source;
- prior US cash close is available before Taiwan trading but may be redundant after Taiwan has already reacted;
- DXY, SOX and broader global provider contracts are not fully frozen;
- macro releases require release-time and revision-vintage semantics.

Therefore GLOBAL_RISK_ON/OFF must remain UNKNOWN where receipt contracts are incomplete.

## 14. D16-13 Shadow cohort status

Repository implementation materially improves the assessment:
- daily Shadow orchestration enumerates the frozen base universe;
- excluded and eligible sets are explicit;
- each eligible symbol is evaluated/accounted;
- incomplete accounting causes run failure;
- tests verify COMPLETE only when every eligible symbol is represented;
- storage tests persist baseUniverseCount / excludedCount / eligibleCount / accountedCount and state counts.

This is sufficient to validate **data-contract feasibility** for full-universe membership semantics and supports L2 -> L3 for D16-13.

Limits:
- scheduled prospective capture is still disabled;
- therefore no L4 claim;
- old bounded/reason-ordered System 1/V8 Shadow cohorts remain subject to their own historical bias and are not repaired retroactively by System 2's design.

## 15. Literature synthesis retained

- White (2000), *A Reality Check for Data Snooping*, Econometrica 68(5): specification search can make chance winners look genuine; benchmark superiority must account for the search universe.
- Hansen (2005), *A Test for Superior Predictive Ability*: SPA improves power and reduces sensitivity to poor/irrelevant alternatives relative to Reality Check.
- Harvey, Liu & Zhu (2016), *... and the Cross-Section of Expected Returns*, RFS 29(1): conventional significance thresholds are too weak in a large factor-search environment.
- Bailey, Borwein, López de Prado & Zhu (2016/2017), *The Probability of Backtest Overfitting*: investment backtests need explicit search-process overfit diagnostics; CSCV estimates PBO.
- Bailey & López de Prado (2014), *The Deflated Sharpe Ratio*: Sharpe evidence should account for selection bias and non-normality.
- DeMiguel, Garlappi & Uppal (2009), *Optimal Versus Naive Diversification*: estimated optimized portfolios did not consistently outperform 1/N out of sample across their studied datasets, illustrating the cost of estimation error.
- Wang, Lin & Mikhelson (2020), *Regime-Switching Factor Investing with Hidden Markov Models*: a positive example that regime-conditioned factor switching can work OOS in a particular US-market design; it establishes plausibility, not Taiwan transferability.
- Blanchard et al. (2025), *Data Driven Investment Strategies Using Bayesian Inference in Regime-Switching Models*: false regime signals increase trading and transaction costs; realistic implementation includes signal delay and explicit fee stress.
- statsmodels Markov-switching documentation: filtered probabilities condition only on information through t, while smoothed probabilities use the full dataset and therefore future observations relative to t.

## 16. Promotion standard

No regime policy is a FORMAL_OPTIMIZATION_CANDIDATE merely because:
- conditional returns differ by regime;
- a backtest Sharpe improves;
- an HMM produces visually convincing states;
- drawdown falls by reducing exposure;
- one OOS block is positive.

A candidate must demonstrate:
1. PIT-safe real-time state;
2. frozen experiment family;
3. net policy value versus static and exposure-matched controls;
4. chronological OOS / walk-forward stability;
5. prospective Shadow confirmation;
6. cost, turnover, UNKNOWN and missed-opportunity accounting;
7. no dominant single period/regime/sector explanation;
8. acceptable multiple-testing / overfit diagnostics.

## Current conclusion

FORMAL_OPTIMIZATION_CANDIDATE: NONE.

The research architecture is stronger, and several D18 modules have now reached mechanism+falsification maturity, but Taiwan prospective regime-policy evidence has not yet accumulated.


## 17. Repository implementation audit

Current-main code search for the planned regime raw fields/state names found them in `system2/SYSTEM2_MARKET_REGIME_V0.md`, but not in an executable regime builder. In particular the planned trend, breadth, volatility and concentration fields/state names are still specification-level.

Implication:
- D18 taxonomy remains L2, not L3.
- No existing historical System 2 regime stream should be assumed.
- This creates a clean preregistration opportunity before the first prospective regime-policy outcomes.
- The research-only proposal `research/D18_OBSERVABLE_REGIME_LABEL_CONTRACT_V0_1.md` defines a multi-dimensional observable vector without a universal risk score or policy effect.
- Wiring that proposal is a separate System 2 research-engineering decision; this room does not silently implement it.

## 18. HMM is a challenger, not the default truth

Positive literature shows regime-conditioned strategies can outperform static factor models in some OOS designs, so regime switching is a plausible hypothesis rather than an inherently invalid idea.

Counterevidence matters equally:
- false state changes can increase turnover and costs;
- state detection delay can erase apparent timing value;
- alternative persistent-regime methods can outperform HMM in some cross-market studies;
- state count / covariance / smoothing / refit choices create additional search degrees of freedom.

Therefore:
- observable PIT regime baselines first;
- HMM / latent-state model second;
- any latent model must beat the observable baseline, not merely buy-and-hold;
- filtered/current state only for decisions;
- smoothed state only for retrospective visualization;
- feature scaling, state canonicalization and refit frequency are versioned experiment parameters.

## Exact next continuation — revised

1. Audit the observable-regime proposal against source-clock contracts and identify exactly which raw features can be produced prospectively without new source calls.
2. Keep regime context capture separate from any policy; accumulate occupancy and UNKNOWN coverage first.
3. Define no composite RISK_ON/RISK_OFF score until component-level incremental value is observed OOS.
4. When executable regime states exist, freeze one single-dimension policy challenger and its exposure-matched control before outcomes.
5. Preserve the parallel-arm receipt and actionEffectiveSession = next tradable session.
6. Use White/SPA/PBO/DSR only as supplementary search/selection diagnostics after enough synchronized independent-date data exist.
