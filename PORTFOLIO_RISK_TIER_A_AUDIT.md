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


### PR-027A — live channel counterexample

The 2026-09-27 read-only audit adds an important counterexample to simplistic channel interpretation:
- 2026-09-18 was B-only (3 plans) with high-end stop-risk intensity 3.8592% of deployed capital.
- 2026-09-21 was A-only (1 plan) with high-end stop-risk intensity 3.7342%.

Thus the deterministic A floor > B floor does not imply actual A plans always carry larger stop distance. The B ATR branch can produce larger realized plan geometry.

Research rule: channel must be controlled, but no ordinal risk label A>B or B>A is allowed from formula floors.

### PR-028A — live reserve decomposition

The same read-only audit confirms:
- 2026-09-18: nominal target 85%, actual 84%, nominal reserve 15%, additional implementation shortfall 1% = NT$2,000.
- 2026-09-21: nominal target 35%, actual 35%, nominal reserve 65%, implementation shortfall 0.

Therefore cash-utilization research must not aggregate all cash into one "unused" bucket.


## PR-029 — Actual-live lifecycle is not historically reconstructable from current receipts (2026-09-27)

This result combines source-contract audit with a Production read-only check. No outcome fields were used and no Production state was written.

### Source-contract result
The current trade-journal signal ledger stores monitor/action events such as:
- signal type;
- signal observation price;
- suggested amount/shares;
- position stage;
- episode and reason.

These are not broker-confirmed execution receipts. In particular, current journal rows do not carry an append-only execution contract with:
- confirmed fill id;
- confirmed fill timestamp;
- confirmed fill price;
- confirmed filled shares;
- shares before/after;
- average cost after;
- reconciliation provenance.

The current `/api/positions` path is a mutable reconciliation snapshot. It can describe current holdings when manually supplied, but it does not preserve an append-only sequence of historical fills or position transitions.

### Production read-only witness
Workflow run `36282609086`, job `108517212915` read only:
- `/api/journal?days=365`;
- `/api/positions`.

Observed:
- 4 recorded journal days;
- 4 Formal plan rows;
- 1 signal row, type BUY;
- that BUY row has suggested shares and a market observation price;
- 0 explicit confirmed-fill fields in the journal response contract;
- 2 current position rows, 0 current holdings, 0 complete holding snapshots.

Therefore:
- `actualLiveLifecycleHistorical = false`;
- `actualLiveHeatHistorical = false`.

### Falsification rule
Never reconstruct historical actual holdings by:
- treating `signal_shares` as filled shares;
- treating signal `market_price` as execution price;
- rolling current `actualShares` backward through time;
- inferring ADD/REDUCE quantities from plan shares when no confirmed execution exists.

Any such reconstruction is fabricated and must be rejected.

### What remains valid
Plan-time Tier-A metrics remain valid where immutable plan fields are complete:
- projected heat;
- deployment ratio;
- concentration decomposition;
- projected stop-risk intensity;
- reserve decomposition.

Current actual-position snapshots may describe **now** only when `actualShares + averageCost + firstEntryConfirmedAt` are complete. They still do not prove the historical path that produced the snapshot.

### Engineering boundary
A future append-only confirmed-fill ledger would be an evidence/infrastructure improvement, not an automatic trading-rule change. It must remain separate from signal generation and cannot silently reinterpret historical suggestions as executions.

Durable artifacts:
- `research/portfolio_risk_live_lifecycle_contract_v0_1.json`;
- `tests/portfolio_risk_live_lifecycle_readonly_audit.mjs`;
- `research/portfolio_risk_live_lifecycle_production_readonly_receipt_20260927.json`.

Lane status remains:
`PORTFOLIO_RISK = FALSIFICATION_IN_PROGRESS / PLAN_TIME_TIER_A_RECONSTRUCTABLE / ACTUAL_LIVE_HISTORY_BLOCKED`.

No Formal allocation, ADD/REDUCE, stop, monitoring, push or execution behavior changed.

### Exact next
Do not invent live-position history. Continue prospective evidence design for an append-only confirmed-fill/reconciliation ledger only if it can be isolated without changing Formal decisions. In parallel, continue outcome-independent plan-risk decomposition and wait for enough independent plan dates before testing whether Tier-A metrics add downside information beyond channel, volatility, PriorityScore and regime.


## PR-030 — Confirmed Fill Ledger v0.1 research contract (2026-09-27)

PR-029 proved that historical actual-live positions cannot be reconstructed from the current signal journal plus mutable position snapshot without fabricating fills.

This section freezes the **minimum evidence contract** required to solve that problem prospectively.

### Separation rule

A signal and an execution are different objects.

- `signalEventId` identifies a strategy/monitor decision event.
- `executionEventId` identifies a confirmed fill/reconciliation event.
- The two IDs may be linked, but must never be substituted for each other.

A BUY signal that was never filled remains a signal only.

### Required append-only execution evidence

Each confirmed fill requires:
- executionEventId;
- source + sourceRecordId;
- symbol;
- planScanDate;
- action BUY / ADD / REDUCE / SELL;
- occurredAt;
- confirmedAt;
- fillPrice;
- filledShares;
- sharesBefore;
- sharesAfter;
- averageCostAfter;
- reconciliationStatus.

### Position-transition invariants

- BUY/ADD: `sharesAfter = sharesBefore + filledShares`.
- REDUCE/SELL: `sharesAfter = sharesBefore - filledShares`.
- REDUCE must leave a positive position.
- SELL must close to zero.
- Across consecutive confirmed events for the same symbol, next `sharesBefore` must equal prior `sharesAfter`.

Any chain break is a data-quality failure, not an invitation to guess.

### Correction semantics

Execution history is append-only.

If a prior fill is later corrected:
- append a new `CORRECTED` event;
- point to `correctsExecutionEventId`;
- never overwrite/delete the original receipt.

This preserves the audit trail and prevents retrospective mutation of research history.

### Sources

Initial contract allows:
- BROKER_IMPORT;
- MANUAL_CONFIRMED;
- VERIFIED_EXTERNAL.

Source quality is explicit. A future broker import does not retroactively validate earlier manual/signal-only periods.

### Research firewall

The ledger may support future:
- actual-live heat;
- actual deployed capital;
- real ADD/REDUCE risk transitions;
- realized exposure before/after reduction;
- re-add lifecycle analysis.

It may **not**:
- create or modify trading signals;
- assume orders were filled;
- infer old executions from signal_shares;
- rewrite pre-ledger history;
- change Formal allocation/stops/BUY/ADD/REDUCE/SELL.

### Implementation classification

The research schema/model/tests are Class A.

Any shared Production implementation involving D1 tables, write APIs, broker import, reconciliation UI, or runtime state is **Class B proposal-first** and requires explicit owner approval before implementation/merge/deploy.

Status:
`CONFIRMED_FILL_LEDGER_V0_1 = DESIGN_READY / CLASS_B_PROPOSAL_FIRST / NOT_IMPLEMENTED`.

Durable artifacts:
- `research/confirmed_fill_ledger_v0_1.mjs`;
- `tests/test_confirmed_fill_ledger_v0_1.mjs`;
- `research/confirmed_fill_ledger_spec_v0_1.json`.

No Formal or Production behavior changed.

### Exact next

Run the research CI and falsification fixtures. If they pass, record the contract as evidence-infrastructure-ready but keep actual-live Portfolio Risk blocked until a separately approved Production fill-capture implementation exists and has prospective real receipts.


## PR-031 — Confirmed Fill Ledger v0.2 bootstrap / PIT correction semantics (2026-09-27)

Further falsification found that v0.1 was insufficient for a portfolio that already has a position when execution-ledger capture begins.

Example:
- account already holds 100 shares before ledger start;
- first new event is a 40-share REDUCE.

Without a ledger-era opening-state receipt, `sharesBefore=100` has no append-only evidence source. Using the mutable current `/api/positions` snapshot as if it were a historical BUY would fabricate execution history.

### v0.2 separates two evidence kinds

**POSITION_BASELINE**
- observed account+symbol holding state at ledger start;
- contains sharesAfter and averageCostAfter;
- explicitly is **not a trade**;
- has no action/fillPrice/filledShares/sharesBefore;
- cannot contribute to return, turnover, fee or slippage attribution;
- pre-baseline execution history remains UNKNOWN.

**FILL**
- confirmed execution evidence;
- BUY / ADD / REDUCE / SELL;
- retains the v0.1 position arithmetic and append-only correction rules.

### Bootstrap rule

A FILL may start a ledger without a baseline only when:
- action = BUY;
- sharesBefore = 0.

If the first observed fill is ADD / REDUCE / SELL, a valid POSITION_BASELINE is required first.

This prevents a current holding snapshot from being silently transformed into an invented historical entry.

### Point-in-time correction semantics

v0.2 separates:
- `effectiveAt`: when the holding/fill economically occurred;
- `confirmedAt`: when the system first knew the evidence.

A later correction:
- is appended;
- references the earlier event;
- affects an as-known view only after the correction's `confirmedAt`;
- must not rewrite what the research system could have known before that time.

This preserves PIT auditability.

### Account scope

`accountKey` is mandatory. The same symbol held in separate accounts must not be silently merged before an explicit portfolio aggregation layer.

### Safe implementation conclusion

Do **not** automatically turn an existing `/api/positions` save into a FILL event.

The minimum safe Production architecture, if later approved, is:
1. keep `/api/positions` as current snapshot/read model;
2. create a separate append-only execution/baseline ledger;
3. require explicit baseline establishment for pre-existing holdings;
4. require explicit confirmed fill submissions/imports after ledger start;
5. derive current position from ledger where coverage is complete, but never backfill older fills from the snapshot;
6. preserve source/provenance and PIT confirmation time.

Automatic broker ingestion would be stronger than manual confirmation when available, but current repository audit proves no broker execution/order/fill connector in the existing scripts. Market-data/Fugle quote data is not broker execution evidence.

Status:
`CONFIRMED_FILL_LEDGER_V0_2 = DESIGN_READY / CLASS_B_PROPOSAL_FIRST / NOT_IMPLEMENTED`.

No Worker/runtime/Formal decision behavior changed.

### Exact next

Run deterministic CI. If v0.2 survives, freeze a Class-B implementation proposal with D1 schema/API/idempotency/rollback/read-model boundaries. Do not implement/merge/deploy that Production infrastructure without explicit owner approval.


## PR-032 — Confirmed Fill Ledger v0.2.1 restores plan provenance (2026-09-27)

Class-B proposal preparation found a self-falsification defect in v0.2: while separating POSITION_BASELINE from FILL, the model accidentally dropped the v0.1 requirement that each confirmed fill preserve a stable `planScanDate`.

That omission would make an execution receipt harder to attribute to the exact after-market plan/episode and could contaminate REDUCE / RE-ADD research.

v0.2.1 therefore:
- requires `planScanDate` on every FILL;
- allows POSITION_BASELINE to omit planScanDate because the holding may predate the monitored plan;
- requires `ledgerEpochId` on every event;
- materializes state by `accountKey | symbol | ledgerEpochId`;
- preserves baseline-not-fill and effectiveAt/confirmedAt PIT correction semantics.

A signal link remains optional:
- `signalEventId` can connect execution evidence to a signal;
- it never becomes execution identity.

This is a research-contract correction only. No Worker/runtime/Formal behavior changed.

Status:
`CONFIRMED_FILL_LEDGER_V0_2_1 = DESIGN_READY / CLASS_B_PROPOSAL_FIRST / NOT_IMPLEMENTED`.

Exact next: run deterministic CI, then use v0.2.1—not v0.2—as the only base for the Class-B Production implementation proposal.
