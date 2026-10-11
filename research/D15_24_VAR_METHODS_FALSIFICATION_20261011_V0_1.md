# D15-24 — Portfolio VaR methods, validation and falsification (research only)
Date: 2026-10-11 Asia/Taipei
Owner: Room10 / D15-24
Formal Core: LOCKED
Status: MECHANISM_FALSIFICATION_RESEARCH_CANDIDATE / REAL_TAIWAN_PIT_AND_OOS_PENDING

## Identity and hypotheses
VaR is a specified quantile of portfolio loss, conditional on immutable portfolio snapshot, valuation clock, horizon, confidence level, currency, price vintage and distribution estimator. It is neither maximum loss nor broker-realized P/L.

H1 Parametric VaR: a preregistered covariance/distribution model can give reproducible conditional loss quantiles.
Support: complete decision-time positions and predecision covariance inputs.
Falsification: fat tails, skew, nonlinearity, regime breaks and covariance instability may miscalibrate extremes.
Alternative: apparent stability reflects smoothing or an unusually calm evaluation period.
Failure: ill-conditioned covariance, insufficient tail support, stale price/position vintage or postdecision parameter tuning.

H2 Historical VaR: frozen empirical loss quantiles preserve observed non-Gaussian distributions without a normality assumption.
Support: sufficiently long, PIT-consistent return and portfolio histories.
Falsification: unobserved crashes are not zero risk; halted/limit-locked stocks and survivorship can hide loss.
Alternative: changing estimates reflect window composition rather than true future-risk change.
Failure: insufficient effective tail sample, corporate-action revision, missing trading calendar or price source.

H3 Coverage and conditional independence: nominal exceedance frequency alone cannot prove good tail-risk forecasts.
Support: prospective untouched evaluation with frozen model and loss convention.
Falsification: equal exceedance counts can have radically different clustering; few exceedances give low power.
Alternative: position size, cash ratio and volatility regimes explain apparent calibration.
Failure: retrospective model selection, overlapping horizon treated as independent, repeated holdout reuse.

H4 Portfolio diversification: VaR need not be subadditive for arbitrary loss distributions.
Support: covariance may diversify ordinary linear exposures.
Falsification: discrete mutually exclusive extreme-loss scenarios can produce portfolio VaR exceeding sum of standalone VaRs.
Alternative: sector common factor, hidden liquidity and nonlinear contracts.
Failure: no joint tail source or portfolio valuation consistency.

## Mandatory receipt
Freeze portfolioSnapshotId, account, positionSource, asOfAt, firstKnownAt, priceVintage, corporateActionPolicy, valuationConvention, lossSignConvention, horizon, confidenceLevel, modelVersion, estimatorFreezeAt, estimationWindow, sampleCount, effectiveTailCount, forecastCreatedAt, evaluationAt, forecastValue, observedMarkToMarketLoss, exceedance, exceedanceMagnitude, sourceHash and brokerFillReferences when actual realized claims are made.
Unknown fields stay UNKNOWN, never 0 or BAD. Mark-to-market loss is not realized brokerage P/L.

## PIT/OOS/walk-forward and counterfactuals
Use only inputs known at forecastCreatedAt. Freeze estimator, window, model family, loss definition and comparison baselines before outcomes. Compare parametric vs historical methods on identical PIT portfolio dates; include a simple fixed-volatility benchmark and ES (D15-13) as a distinct tail-severity comparator, not a duplicate vote.
Keep independent-date denominator separate from rolling windows; 20 dates with five-day rolling horizons give 16 overlapping windows, not 16 independent trials. Consider nonoverlapping evaluation and dependence-aware uncertainty.
Count every tested estimator, horizon, confidence level, lookback and variant as a separate test. Preserve negative results and untouched OOS. Do not infer real execution feasibility from valuation VaR; separately model spreads, taxes, commissions, market impact, odd lots, halts and limit-down exits.

## Ownership and maturity
D15-24 owns VaR quantile methods and conditional calibration; D15-13 owns expected shortfall and tail severity; D15-23 owns derivative overlay; D16-23 owns stress/reverse stress testing. Governance result: KEEP_SEPARATE pending nonredundant independent evidence.
The mechanism and falsification research contract is an L2/40 candidate only. L3 requires Taiwan PIT data feasibility and deterministic replay; L4 requires genuine prospective/OOS evidence; L5 requires multi-regime, cost, redundancy and independent-date robustness.
No historical Shadow, no broker fill inference, no formal sizing/stop/ranking change, and no FORMAL_OPTIMIZATION_CANDIDATE.
