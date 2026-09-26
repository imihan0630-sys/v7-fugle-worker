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


## Production read-only evidence — 2026-09-26

Workflow run `36253794425` queried only the authorized read-only journal endpoint and did not read outcome fields.

Observed:
- 4 recorded formal journal days;
- 4 Formal plan rows;
- 58 recovered/manual rows excluded;
- 2 dates with Formal plan rows;
- both 2/2 plan dates fully reconstructable for Tier-A plan risk;
- 0 incomplete plan dates;
- 2 zero-selection days.

Reconstructed plan-time geometry:
- 2026-09-18: NT$200,000 capital, 3 plans, NT$168,000 planned deployment (84%), projected heat range 2.0221% to 3.2417%, effectiveCapitalNames 2.9672.
- 2026-09-21: NT$200,000 capital, 1 plan, NT$70,000 planned deployment (35%), projected heat range 0.5276% to 1.3070%, effectiveCapitalNames 1.0000.
- 2026-09-22 and 2026-09-23: zero selected with journal status `今日0檔，維持現金`.

This is reconstructability evidence only. It does **not** show that 3.24% heat is high, low, safe or unsafe, and it does not establish any relationship between concentration and returns.

Durable machine receipt:
`research/portfolio_risk_production_readonly_receipt_20260926.json`.


## PR-026 — Tier-A v0.2 separates deployment from concentration (2026-09-27)

Production read-only run `36271287138` used only `/api/journal?days=730`; no outcome fields were read and no Production state was written.

New descriptive quantities:
- `deployedCapitalHHI`: concentration only inside the planned risky sleeve;
- `riskyNameHHIOnTotalCapital = sum((allocation_i / totalCapital)^2)`: risky-name concentration measured against the full account, with cash excluded from the HHI sum;
- `projectedStopRiskPctOfDeployedCapital`: projected heat divided by deployment ratio, isolating stop-distance intensity from how much capital is deployed.

Observed fully reconstructable plan dates:
- 2026-09-18: deployment 84%, reserve 16%, deployed HHI 0.337018, effectiveCapitalNames 2.9672, risky-name HHI on total capital 0.2378, heat 2.0221%-3.2417%, deployed-capital stop-risk intensity 2.4073%-3.8592%.
- 2026-09-21: deployment 35%, reserve 65%, deployed HHI 1.0, effectiveCapitalNames 1.0, risky-name HHI on total capital 0.1225, heat 0.5276%-1.3070%, deployed-capital stop-risk intensity 1.5074%-3.7343%.
- 2026-09-22 and 2026-09-23: deployment 0%, reserve 100%, cash state NO_ELIGIBLE_OPPORTUNITY.

### Falsification result

The proposition "lower effectiveCapitalNames necessarily means a more concentrated total account" is falsified by the observed plan geometry.

2026-09-21 is maximally concentrated inside its deployed sleeve (one name; HHI=1) but only deploys 35% of total capital. Its risky-name HHI on total capital is 0.1225, below 2026-09-18's 0.2378 despite 2026-09-18 having almost three effective names.

Therefore `effectiveCapitalNames` may not be interpreted alone. Portfolio Risk research must report at least:
1. deployment ratio / structural reserve;
2. within-deployed concentration;
3. total-account risky-name concentration footprint.

Likewise total projected heat cannot distinguish "more capital deployed" from "more stop risk per deployed dollar". Heat should be decomposed into deployment ratio and deployed-capital stop-risk intensity before any outcome study.

### Important limit

Only two non-zero plan dates are reconstructable today. The similarity of the high-end deployed-capital stop-risk intensity (3.8592% vs 3.7343%) is descriptive only and is not evidence of a stable risk target.

No heat threshold, concentration cap, allocation rule, ADD gate or other Formal change is authorized.

Durable receipt:
`research/portfolio_risk_tier_a_history_v0_2_receipt_20260927.json`.


## PR-027 — Formal A/B stop geometry mechanically confounds heat intensity (2026-09-27)

This is a formula audit only; no forward outcomes were inspected.

Current Formal plan construction:
- A: `buyHigh = support * 1.018`; `stop = min(support*0.98, recentLow5Prev - 0.12*ATR)`.
- B: `buyHigh = breakout * 1.01`; `stop = breakout - max(0.65*ATR, 0.012*breakout)`.

Therefore, at the conservative buyHigh endpoint:
- A has a deterministic minimum projected stop-risk of `(1.018-0.98)/1.018 = 3.7328%`; actual risk can be larger when the structural-low branch sets the stop lower.
- B has a deterministic minimum projected stop-risk of `(1.01-0.988)/1.01 = 2.1782%`; actual risk can be larger when the ATR branch dominates.
- The deterministic floor difference is about 1.5546 percentage points before any realized market behavior is observed.

### Falsification implication

Portfolio heat / deployed-capital stop-risk intensity is mechanically affected by A/B channel mix. A raw cross-date comparison of heat that does not control channel can confuse plan-construction geometry with independent portfolio risk.

This does **not** prove A has worse realized downside than B and does not justify channel normalization. The correct next empirical test, once enough plan dates/outcomes exist, is:
1. channel-stratified planned stop-risk distributions;
2. within-channel heat/intensity versus realized MAE/stop outcomes;
3. cross-channel matched comparisons controlling volatility, regime and PriorityScore;
4. only then assess whether portfolio heat adds information beyond deployment ratio + channel composition.

Durable artifact:
`research/portfolio_risk_channel_stop_geometry_v0_1.json`.

No Formal entry, stop, RR, allocation, ADD/REDUCE or selection rule is changed.


## PR-028 — Cash reserve must be split into design reserve versus allocation shortfall (2026-09-27)

Formal allocation geometry is deterministic:
- 0 selected => nominal deploy target 0%;
- 1 selected => 35%;
- 2 selected => 60%;
- 3 or more selected => 85%;
- each name is capped at 35%;
- each allocation is floored to the nearest NT$1,000;
- capped/rounded residual is not redistributed.

Therefore actual cash after a plan is not one homogeneous state.

Research decomposition:
- `nominalStructuralReservePct = 100 - nominalDeployTargetPct`;
- `allocationImplementationShortfallPct = max(0, nominalDeployTargetPct - actualDeploymentPct)`;
- `actualReservePct = nominalStructuralReservePct + allocationImplementationShortfallPct` when actual deployment is not above target.

Observed witness:
- 2026-09-18 had 3 selected names, so nominal deployment target = 85%.
- Actual planned deployment = 84%.
- Therefore 15% of cash is intentional structural reserve, while 1% = NT$2,000 is additional allocation implementation shortfall.
- 2026-09-21 had 1 selected name, target = 35%, actual = 35%, so implementation shortfall = 0.

### Falsification implication

The proposition "all uninvested cash reflects lack of eligible opportunities or overly strict BUY logic" is false even before outcome analysis. Some cash can be a deterministic consequence of position caps and rounding.

Future capital-utilization studies must therefore separate:
1. no eligible plan;
2. intentional nominal structural reserve;
3. cap/rounding implementation shortfall;
4. pending-entry cash after a plan exists;
5. post-reduction / data-blocked states where applicable.

No redistribution rule or higher deployment target is proposed.

Durable artifact:
`research/portfolio_risk_deployment_geometry_v0_1.json`.
