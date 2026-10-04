# COV-08 D16 Specialist Return V0.1

Updated: 2026-10-04 Asia/Taipei  
Status: SPECIALIST_RETURN_COMPLETE / TERMINAL_RECOMMENDATION_FROZEN  
Owner: D16 / Room 11  
Target owner: D16-06 Independent-Date／日期群聚推論  
Formal Core impact: NONE  
Maturity impact: NONE

## 1. Question closed

COV-08 asks whether dependence-aware resampling / block bootstrap is a genuine new curriculum module or a scope extension to D16-06.

This specialist return closes the remaining delta:
1. when cluster-robust / HAC inference is sufficient;
2. when a temporal block bootstrap is required;
3. what minimum sample / effective-sample / block-length information must be reported;
4. one terminal recommendation.

The answer is methodological, not an alpha claim. No historical outcome, Formal Core, System 1 rule, System 2 policy, rank, weight, capital, execution or notification behavior is changed.

## 2. Non-negotiable first principle

Dependence correction must follow the data-generating dependence and the estimand.

No method is promoted merely because it gives a larger standard error or a more favorable p-value.

The first inference unit remains the independent decision date / portfolio path whenever possible. Stock rows from the same market date are not independent evidence. Regime episodes are also reported separately because many consecutive dates inside one episode do not create the same amount of independent evidence as multiple episodes.

## 3. Method hierarchy

### 3.1 Cluster-robust inference is sufficient only when the cluster contract is credible

A cluster-robust variance estimator is admissible as the primary analytic method when all of the following hold:

- the clustering dimension is known before outcomes and has substantive meaning;
- arbitrary dependence is allowed within cluster;
- cross-cluster score dependence is negligible enough for the intended asymptotics;
- the estimand is a smooth / asymptotically linear statistic or regression coefficient for which the cluster-robust variance target is valid;
- cluster leverage / influence is not dominated by a few clusters;
- the effective cluster count is not severely collapsed relative to the raw cluster count;
- no separate serial dependence remains across date clusters that the chosen clustering scheme ignores.

For D16 stock-row research, clustering by decision date protects against same-date common shocks but does **not** automatically protect against serial dependence across dates or repeated-symbol dependence across dates. Where feasible, collapse to the date-level estimand first; otherwise use a justified multiway / panel dependence treatment.

Conventional cluster-robust inference is not considered standalone-reliable merely because the raw number of rows is large.

### 3.2 HAC is sufficient for smooth date-level estimands under weak short-memory dependence

Heteroskedasticity-and-autocorrelation-consistent long-run variance estimation is admissible as the primary analytic method when:

- the data have already been reduced to the intended chronological decision-date unit;
- the dependence is plausibly weak / short-memory over the evaluation window;
- the target statistic is smooth / asymptotically linear, such as a mean return difference or regression coefficient;
- kernel and bandwidth are frozen before viewing the target outcome result, or selected by a dependence-only rule;
- there is no unresolved structural break / nonstationarity that makes one long-run variance estimate incoherent across the window;
- official-session gaps are not silently treated as adjacent observations.

HAC adjusts the variance of an estimator. It does not reproduce the full path distribution of a thresholded, path-dependent trading policy.

### 3.3 Temporal block bootstrap is required when the chronological path is part of the estimand

A moving-block / circular-block / stationary bootstrap becomes a mandatory co-primary or primary inference method when the research claim depends materially on preserving temporal ordering and local dependence, including:

- drawdown or recovery-path statistics;
- turnover / churn / hysteresis costs;
- activation / deactivation sequences;
- regime-transition policy behavior;
- max / min / threshold-crossing statistics whose distribution is not adequately represented by a simple asymptotic variance;
- a nonlinear re-estimation pipeline where the complete estimator / policy must be rerun inside each resample;
- a date-level statistic with material serial dependence for which an analytic influence-function / HAC approximation is fragile or unavailable.

Resampling must move the **entire date panel / paired strategy arms together**. It is forbidden to bootstrap individual stock rows independently when the same-date common shock is part of the dependence structure.

For regime studies, contiguous blocks must respect official-session continuity. A missing-session gap classified as UNKNOWN may not be silently bridged inside a block.

### 3.4 Small / unbalanced cluster problems do not automatically imply temporal block bootstrap

If the problem is a small or highly unbalanced number of cross-sectional clusters, the relevant remedies are cluster-specific methods such as small-sample corrected cluster inference, cluster jackknife diagnostics, wild cluster bootstrap, or valid randomization inference.

A temporal block bootstrap is not a generic substitute for weak cluster asymptotics.

The effective number of clusters must therefore be reported where a clustered regression is used. When the effective cluster count is much smaller than the raw count, especially around or below 20, conventional first-order cluster inference cannot stand alone.

### 3.5 Nonstationarity is a fail-closed condition

Neither HAC nor a stationary / moving-block bootstrap magically repairs structural breaks.

If the tested window mixes materially different data-generating processes, source contracts, strategy versions, market microstructure, or unresolved regime breaks:

- segment the analysis under a frozen rule; or
- use a method explicitly designed for that nonstationarity; or
- keep the inferential result UNKNOWN.

Do not resample across known version boundaries merely to increase sample size.

## 4. Frozen reporting contract

Every D16-06 dependence-aware inference result must report the following before it can be used for maturity / promotion evidence.

### 4.1 Raw support

- number of official decision dates: T;
- number of contiguous official-session segments;
- number of UNKNOWN / missing-session gaps;
- number of regime episodes when regime-conditioned;
- number of policy-active / policy-disabled / natural-zero / data-UNKNOWN dates when policy-conditioned;
- outcome horizon and purge / overlap rule.

### 4.2 Cluster support

When clustered inference is used, report:

- raw cluster count G;
- minimum / median / mean / maximum cluster size;
- cluster-size dispersion;
- leverage / partial leverage / influence diagnostics when available;
- effective cluster count G* for the coefficient / estimand of interest when computable;
- the exact clustering dimension(s).

Governance rule:
- G* below 20 => conventional cluster-robust p-values / confidence intervals are not standalone promotion evidence;
- G* at or above 20 is only an eligibility floor, not proof of reliability;
- influential-cluster or severe-imbalance warnings override the raw G count.

This is a conservative research-governance floor, not a universal mathematical theorem.

### 4.3 HAC support

When HAC is used, report:

- T;
- kernel;
- bandwidth L;
- whether prewhitening is used;
- sample autocorrelation diagnostics over the dependence range;
- lag-zero variance estimate gamma0;
- estimated long-run variance Omega;
- dependence variance-inflation ratio: VIF_dep = Omega / gamma0;
- effective-date diagnostic: T_eff = T / VIF_dep.

T_eff is a diagnostic only and is not substituted mechanically for degrees of freedom.

Governance rule:
- T_eff below 20 => no standalone asymptotic promotion claim;
- 20 to 39 => exploratory / sensitivity evidence unless corroborated by another dependence-robust method or genuine prospective/OOS replication;
- 40 or more => eligible for primary asymptotic use if the stationarity, bandwidth, leverage and episode gates also pass.

These are conservative curriculum gates, not claims that asymptotic accuracy changes discontinuously at 20 or 40.

### 4.4 Block-bootstrap support

When temporal block bootstrap is used, report:

- bootstrap family;
- chronological unit being resampled;
- block length ell;
- block-length selector and selector version;
- proof that block length was not tuned on the target outcome;
- number of bootstrap replications;
- effective non-overlapping block count: B_eff = floor(T / ell);
- sensitivity at approximately 0.5 × ell, 1 × ell and 2 × ell, bounded to valid integer lengths;
- whether the conclusion changes materially across that sensitivity set;
- whether blocks cross any known source / strategy / structural-break boundary.

Block-length choice:
- prefer a dependence-only automatic selector or a preregistered rule;
- the corrected Politis / White block-length procedure family is admissible;
- outcome-tuned block length is forbidden.

Governance rule:
- B_eff below 10 => INSUFFICIENT_BLOCK_SUPPORT for inferential promotion;
- 10 to 19 => sensitivity / exploratory only;
- 20 or more => eligible for primary block-bootstrap inference if weak-stationarity and episode-support gates pass.

Again, these are conservative governance floors rather than universal theorems.

## 5. Required sensitivity and falsification

A positive result fails promotion if any of the following holds:

1. the conclusion disappears when stock rows are collapsed to the independent date unit;
2. a few dates / clusters / episodes dominate the estimate;
3. cluster-robust, HAC and block-bootstrap methods disagree materially and the disagreement is not explained;
4. the chosen HAC bandwidth or bootstrap block length was selected after seeing the target outcome;
5. block-length sensitivity reverses the sign or changes the decision from pass to fail;
6. the apparent significance is created by treating one persistent market episode as many independent dates;
7. the result requires bridging UNKNOWN official-session gaps;
8. resampling crosses a strategy / data-source / version boundary without an explicit frozen justification;
9. the resampling method breaks the static-vs-challenger pairing or same-date common shock;
10. the method is used to replace missing prospective / OOS evidence rather than quantify uncertainty around valid evidence.

## 6. Relationship to existing D16 architecture

This scope belongs naturally inside D16-06 because D16-06 already owns:
- independent-date inference;
- date clustering;
- dependence-aware uncertainty;
- promotion evidence that must not treat stock rows as independent experiments.

Block bootstrap is a **validation method**, not an independent source of market evidence and not another evidence vote.

It must not become a separate curriculum module merely because it is a named statistical technique.

## 7. Terminal recommendation

**SCOPE_EXTENSION_ACCEPT / ABSORB_INTO_D16_06 / NO_NEW_MODULE / NO_MATURITY_CHANGE**

Rationale:

- the knowledge family is real and necessary;
- the semantic owner is already D16-06;
- a new module would split one inferential responsibility into overlapping method modules;
- the extension adds a method-selection hierarchy, not a new market object;
- D16-06 is already L4, and this specialist return does not create new prospective/OOS market evidence, so maturity does not increase.

Canonical curriculum wording should be changed only by the control-plane owner under the existing approval / anti-orphan process.

## 8. Evidence anchors

- Newey, W. K. and West, K. D. (1987), heteroskedasticity-and-autocorrelation-consistent covariance estimation: consistency of a long-run covariance estimator under general conditions.
- Künsch, H. R. (1989), block jackknife/bootstrap for stationary dependent observations: consistency framework with block length growing while block length / sample size vanishes.
- Politis, D. N. and Romano, J. P. (1994), stationary bootstrap for weakly dependent stationary observations.
- Politis, D. N. and White, H. (2004), with Patton / Politis / White correction (2009), dependence-adaptive automatic block-length selection.
- MacKinnon, Nielsen and Webb (2022/2023), cluster-robust inference: cluster independence, leverage / effective-cluster diagnostics and bootstrap sensitivity.
- Roodman, Nielsen, MacKinnon and Webb (2019), effective cluster count and wild cluster bootstrap diagnostics; conventional cluster inference can be unreliable when G* is far below G, especially near/below about 20.

## 9. No-promotion statement

No alpha, timing, calibration, portfolio or regime-policy claim is created by this return.

D16-06 remains L4 / 80%.
Formal Core remains LOCKED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
