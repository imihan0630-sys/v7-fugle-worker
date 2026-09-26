# Portfolio Risk Tier-A Evidence Audit

Updated: 2026-09-26
Status: FALSIFICATION_IN_PROGRESS / RESEARCH_ONLY
Formal Core: LOCKED

## Why this lane is next

Among currently EVIDENCE_PENDING lanes, Portfolio Risk has a subset that can be evaluated from plan-time fields without new market-data calls or changing selection:
- projected planned-stop risk / portfolio heat;
- deployment ratio and structural reserve;
- effectiveCapitalNames;
- name and sector capital concentration;
- counterfactual current-vs-equal-capital-vs-equal-planned-stop-risk.

Correlation, empirical clustering and covariance are not treated the same way. They require synchronized point-in-time history and may not be reconstructed from mutable current history and called historical evidence.

## Exact semantics frozen

For an unfilled plan, there is no actual entry price. Therefore stop risk is a range:
- lower end uses buyLow;
- upper end uses buyHigh;
- the upper entry is also the conservative reference for equal-planned-stop-risk counterfactuals.

This is projected risk, not realized or guaranteed maximum loss.

A stop at or above the plan's buyLow is a semantic conflict and returns UNKNOWN/invalid rather than a negative risk number.

Portfolio heat:
- projectedHeatLow = sum(projectedRiskNTDLow) / totalCapital;
- projectedHeatHigh = sum(projectedRiskNTDHigh) / totalCapital.

No hard safe/unsafe heat threshold is introduced.

Effective capital names:
- normalize only across planned deployed capital;
- compute 1 / sum(w_i^2);
- report deployment ratio separately, so cash is not mistaken for another stock.

Sector capital share:
- descriptive only;
- UNKNOWN sector remains explicit;
- sector grouping is not called an empirical correlation cluster.

Cash-state rule:
- COMPLETE scan + zero selected => NO_ELIGIBLE_OPPORTUNITY;
- incomplete scan/data => DATA_OR_SIGNAL_BLOCKED, never "no opportunity";
- selected plans not yet executed => PENDING_ENTRY plus structural reserve amount.

## Counterfactuals

A. Current Formal allocation is the control.
B. Equal capital uses the same total planned deployment.
C. Equal planned-stop-risk uses inverse projected stop-risk percentage and the same total planned deployment.

The first Tier-A prototype deliberately leaves the equal-risk counterfactual unconstrained by the 35% cap. It is a diagnostic allocator, not an executable portfolio. If later evidence justifies executable comparison, cap/rounding rules must be frozen prospectively before outcomes.

## Historical/PIT firewall

Plan-time totalAllocation, buy range and stop stored in the trade journal can support projected-risk reconstruction for those exact plans.

However:
- old synchronized 20d/60d pairwise histories are not proven immutable PIT artifacts;
- current mutable history must not be used to invent old correlation or cluster states;
- corporate-action/raw-price continuity still matters.

Therefore:
- projected heat/effectiveCapitalNames/name concentration can be reconstructed when original plan fields are intact;
- correlation20/60 and empirical clusters remain PIT_HISTORY_REQUIRED unless exact decision-time history provenance is available.

## Falsification targets before any Formal use

The future study must test whether high projected heat or concentration actually predicts:
- worse portfolio MAE/drawdown;
- simultaneous stop hits;
- worse downside-conditioned returns;
- reduced opportunity retention;
- or merely higher expected return with tolerable downside.

It must also test the opposite:
- risk metrics may be descriptive but not incrementally useful after sector, market regime, volatility and PriorityScore;
- simple effectiveCapitalNames/sector share may outperform unstable covariance diagnostics;
- equal-risk allocation may sacrifice too much opportunity.

No Formal capital rule, ADD gate, cluster cap or heat threshold is authorized.

## Prototype

- `research/portfolio_risk_tier_a_v0_1.mjs`
- `tests/test_portfolio_risk_tier_a_v0_1.mjs`

The prototype is pure research code. It does not import or modify Worker.js.
