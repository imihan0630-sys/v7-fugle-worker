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


## PR-033 — PriorityScore allocation can amplify conservative planned-stop-risk concentration (2026-09-27)

A Class-A read-only extension of the existing Portfolio Risk journal audit compared the current Formal allocation with two outcome-independent diagnostics while keeping the same total planned deployment:
- equal capital;
- unconstrained equal planned-stop-risk using the conservative buyHigh stop-risk percentage.

No return, MFE, MAE, fill, realized P/L or future outcome field was read. Production was not written.

### Production witness

Portfolio Risk Tier-A Research run `36314784619`, job `108607322138`, read only `/api/journal?days=730`.

The only fully reconstructable multi-name plan date is 2026-09-18:
- total planned deployment = NT$168,000;
- all 3 plans are B-channel;
- current projected-risk HHI = 0.377238;
- equal-capital projected-risk HHI = 0.355859;
- equal-planned-stop-risk projected-risk HHI = 0.333333;
- current max/min projected-risk contribution ratio = 2.4472x;
- equal-capital ratio = 1.9119x;
- equal-planned-stop-risk ratio = 1.0000x.

Plan-level conservative buyHigh geometry:
- 2006: PriorityScore 69.9; planned stop-risk 2.6167%; current allocation NT$50,000; projected risk NT$1,308.35.
- 3105: PriorityScore 89.4; planned stop-risk 5.0028%; current allocation NT$64,000; projected risk NT$3,201.79.
- 6133: PriorityScore 74.9; planned stop-risk 3.6542%; current allocation NT$54,000; projected risk NT$1,973.27.

The current allocator therefore gave the largest capital weight to the same plan that had the widest conservative stop distance. Capital weighting and stop geometry compounded rather than offsetting each other on this date.

Equal-capital would use NT$56,000 each and reduce projected-risk concentration, but would still leave different risk contributions because stop distances differ.

The unconstrained equal-planned-stop-risk diagnostic would allocate approximately:
- 2006: NT$75,029.23;
- 3105: NT$39,243.82;
- 6133: NT$53,726.94;
producing approximately NT$1,963.29 projected risk per name.

This is deliberately **not executable evidence**: 2006 would receive about 37.51% of total capital, above the current 35% per-name cap. It also ignores actual fills, lot/rounding effects and future outcomes.

2026-09-21 has only one A-channel plan (3006), so current/equal-capital/equal-risk are mechanically identical and provide no cross-name allocation test.

### Falsification result

Rejected structural proposition:
`PriorityScore-weighted capital is mechanically risk-neutral with respect to planned stop geometry.`

Observed counterexample:
on 2026-09-18, the highest-score name also had the widest planned stop and therefore absorbed the largest projected stop-risk contribution.

This does **not** prove PriorityScore sizing is economically harmful, nor that equal-risk sizing is superior. It establishes only that current conviction weighting can amplify plan-risk concentration when score and stop distance align.

### Required future economic test

Once enough independent fully reconstructable plan dates and clean outcomes exist, compare current allocation against frozen counterfactuals using:
- D1/D3/D5 and MFE/MAE;
- stop-first / downside clustering;
- date-cluster and leave-one-date-out inference;
- A/B channel, volatility, market regime and PriorityScore controls;
- transaction/slippage feasibility;
- a cap-constrained executable equal-risk comparator separately from the current unconstrained diagnostic.

Do not tune a heat threshold or sizing formula from the 2026-09-18 witness.

Durable receipt:
`research/portfolio_risk_tier_a_history_v0_3_receipt_20260927.json`.

Status:
`FALSIFICATION_IN_PROGRESS / STRUCTURAL_RISK_CONCENTRATION_CONFIRMED / OUTCOME_MATERIALITY_UNKNOWN / NOT_OPTIMIZATION_READY`.

No Formal allocation, PriorityScore, stop, BUY/ADD/REDUCE/SELL, monitoring or push rule changed.


## PR-034 — 35% cap does not explain the observed score × stop-risk concentration (2026-09-27)

PR-033 established that the 2026-09-18 current allocation concentrated conservative planned stop-risk more than equal capital. A stronger counterfactual was required because the unconstrained equal-risk diagnostic allocated 37.51% of total capital to 2006 and therefore violated the current 35% per-name cap.

A new Class-A comparator now keeps:
- the same NT$168,000 planned deployment;
- the same NT$200,000 total capital;
- the current 35% / NT$70,000 per-name cap;
- the same conservative buyHigh planned-stop-risk definition.

It does not read outcomes and does not change Formal allocation.

### Deterministic replay of the current allocator

For 2026-09-18:
- PriorityScores = 69.9 / 89.4 / 74.9;
- score total = 234.2;
- 3 selected names imply the current 85% nominal deploy target = NT$170,000;
- score-proportional continuous allocations are approximately NT$50,738.68 / NT$64,893.25 / NT$54,368.06;
- all are below the NT$70,000 per-name cap;
- flooring each to NT$1,000 reproduces the immutable journal exactly: NT$50,000 / NT$64,000 / NT$54,000;
- the remaining NT$2,000 is the previously identified allocation implementation shortfall.

Therefore the current 2026-09-18 allocation did **not** have a binding 35% cap. The observed concentration is mechanically attributable to PriorityScore proportional weighting plus heterogeneous stop distance, with only a small flooring residue.

### Cap-constrained equal-risk counterfactual

Continuous same-deployment solution under the current 35% cap:
- 2006 = NT$70,000, cap binding;
- 3105 = NT$41,366.71;
- 6133 = NT$56,633.29.

Conservative projected stop-risk contribution:
- 2006 = NT$1,831.69;
- 3105 = NT$2,069.49;
- 6133 = NT$2,069.49.

Structural comparison:
- current projected-risk HHI = 0.377238;
- cap-constrained equal-risk HHI = 0.334391;
- reduction = 11.36%;
- current max/min projected-risk ratio = 2.4472x;
- cap-constrained comparator = 1.1298x;
- reduction = 53.83%;
- current high-end projected risk = NT$6,483.41 / 3.2417% of total capital;
- cap-constrained comparator = NT$5,970.67 / 2.9853%;
- difference = -NT$512.74 / -0.2564 percentage points, or about -7.91%.

### Falsification result

Two simpler explanations are rejected for this observed date:
1. the current concentration was mainly caused by the 35% cap;
2. the concentration advantage of equal-risk disappears once the 35% cap is enforced.

Neither is supported by the deterministic replay.

The surviving structural mechanism is:
`PriorityScore proportional sizing × heterogeneous planned stop distance`.

On 2026-09-18, 3105 simultaneously had the highest PriorityScore and the widest conservative planned stop distance, so it received the largest capital allocation and an even larger share of projected stop-risk.

### Counterevidence and limits

This is still **not** an economic optimization result:
- there is only one reconstructable multi-name date;
- the capped comparator is continuous and does not yet impose the Formal NT$1,000 flooring;
- no returns, MFE, MAE, stop-first, fills, costs or realized drawdowns were read;
- lower risk concentration can reduce exposure to the best opportunity if PriorityScore contains genuine alpha;
- current score weights therefore must be tested against outcome-aware but pre-registered counterfactuals before any capital rule can change.

Durable receipt:
`research/portfolio_risk_cap_constrained_equal_risk_receipt_20260927.json`.

Status:
`STRUCTURAL_MECHANISM_CONFIRMED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core remains unchanged.


## PR-035 — risk concentration has ex-ante reward-space counterevidence (2026-09-27)

PR-033/034 proved that 2026-09-18 PriorityScore-proportional sizing concentrated conservative planned stop-risk and that the effect was not caused by the 35% cap. PR-035 tests the required opposite explanation before considering any sizing change:

`Does the additional planned risk buy any additional plan-time reward geometry?`

The read-only Tier-A audit now computes a deliberately narrow proxy:
`plannedRewardProxyNTD = conservative buyHigh projectedStopRiskNTD × immutable plan-time rewardRisk`.

This is **not expected return and not realized return**. It only measures the reward-space implied by the frozen plan geometry.

### 2026-09-18 comparison

Current PriorityScore allocation:
- projected risk = NT$6,483.41;
- RR-based planned reward proxy = NT$23,532.04;
- proxy reward / projected risk = 3.6296.

Equal capital:
- projected risk = NT$6,313.27;
- planned reward proxy = NT$22,808.80;
- proxy reward / projected risk = 3.6128.

Same-deployment 35%-cap constrained equal planned-stop-risk:
- projected risk = NT$5,970.67;
- planned reward proxy = NT$21,296.49;
- proxy reward / projected risk = 3.5669.

Current minus equal capital:
- +NT$170.14 projected risk;
- +NT$723.24 reward-space proxy;
- marginal proxy reward/risk = 4.2509.

Current minus capped equal-risk:
- +NT$512.74 projected risk;
- +NT$2,235.55 reward-space proxy;
- marginal proxy reward/risk = 4.36.

Therefore a stronger one-sided claim is falsified:
`current PriorityScore sizing only adds planned risk and receives no plan-time reward-space compensation`.

The 2026-09-18 plan geometry shows compensation in the RR-based proxy.

### Important counterevidence against overinterpreting this result

This does not validate current sizing economically.

6133 has the highest raw RR at 3.89, versus 3105 at 3.71 and 2006 at 3.04, yet 3105 receives the highest PriorityScore and largest current allocation. Current sizing is therefore not simply maximizing raw RR. PriorityScore is intentionally combining other setup/sector/RS/consensus/fundamental dimensions, and the realized incremental value of those dimensions is exactly what the prospective PriorityScore calibration lane still has to prove.

The correct state is now a two-sided tradeoff:
- current sizing has a confirmed planned-risk concentration cost;
- current sizing also has confirmed plan-time RR reward-space counterevidence;
- realized economic dominance of current vs equal-capital vs capped equal-risk remains UNKNOWN.

Only independent prospective outcomes can resolve the tradeoff. Required future comparison remains D1/D3/D5, MFE/MAE, stop-first/downside clustering, costs, A/B/channel/regime controls, date clustering and LODO.

Durable receipt:
`research/portfolio_risk_ex_ante_reward_proxy_receipt_20260927.json`.

Status:
`TWO_SIDED_STRUCTURAL_TRADEOFF_CONFIRMED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-036 — correction: PR-035 RR proxy is endogenous, not independent alpha evidence (2026-09-27)

A redundancy/circularity audit was run immediately after PR-035.

Current Formal already uses RR in three layers:
1. hard eligibility: RR >= 2;
2. PriorityScore: `clamp(RR*20,0,100)*0.14`;
3. later raw rewardPerRisk comparator after post-consensus PriorityScore.

Therefore the PR-035 diagnostic `projectedStopRisk × RR` is **not statistically independent of the allocation rule being evaluated**, because allocation is proportional to a PriorityScore that already contains RR.

For the 2026-09-18 plans, the RR contribution to PriorityScore is:
- 2006: RR 3.04 -> 8.512 score points;
- 3105: RR 3.71 -> 10.388;
- 6133: RR 3.89 -> 10.892.

The circularity is only partial, not total:
- 6133 has the highest RR and largest RR score contribution;
- 3105 nevertheless has the highest final PriorityScore and receives the largest current allocation.

So RR alone does not explain the allocation ordering. Other PriorityScore dimensions materially reverse the 3105-vs-6133 RR ordering.

### Corrected interpretation

PR-035 remains numerically valid as a **plan-time structural consistency diagnostic**:
current sizing has a higher RR-based reward-space proxy on this date.

It must **not** be used as independent evidence that the additional planned risk is economically compensated, because part of that relationship is designed into PriorityScore itself.

The stronger phrase “reward compensation” is therefore downgraded to:
`endogenous ex-ante reward-space alignment`.

Independent economic evidence still requires prospective realized outcomes with raw RR and market-consensus contribution controlled, frozen current/equal-capital/capped-equal-risk counterfactuals, independent dates, date clustering/LODO, channel/regime controls and costs.

This correction strengthens the governance firewall: neither PR-034's lower risk concentration nor PR-035's higher RR proxy is allowed to win by construction.

Durable receipt:
`research/portfolio_risk_rr_proxy_endogeneity_receipt_20260927.json`.

Status:
`PR035_INTERPRETATION_DOWNGRADED_TO_ENDOGENOUS_CONSISTENCY / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-050 — Production positive-signal audit: one BUY, no sizing identification yet (2026-09-27)

Read-only Production audit run:
- workflow run: `36329306700`;
- job: `108648065662`;
- endpoint: `/api/journal?days=365`;
- no Production writes.

Observed durable signal rows:
- total signals = 1;
- BUY = 1;
- terminal SELL/STOP_LOSS = 0.

The positive BUY is:
- symbol: 3006;
- plan scan date: 2026-09-21;
- trade date: 2026-09-22;
- signal time: 2026-09-22 11:31:33 Taipei;
- signal market price: 282.5;
- signal amount: NT$42,000;
- exact reconstructed live suggestedShares: 148;
- plan linkage: positive;
- selected-count on the plan date: 1.

### What this real row establishes

It validates the PR-047/048 positive-event evidence chain against Production:
`selected plan -> BUY signal event -> exact signal price -> exact amount -> exact suggestedShares`.

### What it cannot establish

The 2026-09-21 plan date contains only one selected name.
Therefore current / equal-capital / equal-risk allocation comparisons are identical and this row is **non-identifying for sizing**.

There is no terminal SELL/STOP_LOSS signal row yet, so no completed signal-path round trip exists.

There is still no broker-confirmed fill ledger, so no realized P&L exists in the research evidence.

The signal reader remains bounded at LIMIT 6000 with no truncation flag; missing BUY rows remain UNKNOWN rather than NO-BUY.

Durable receipt:
`research/positive_signal_production_audit_receipt_20260927.json`.

Status:
`ONE_POSITIVE_BUY_CONFIRMED / SINGLE_NAME_NONIDENTIFYING_FOR_SIZING / NO_TERMINAL_SIGNAL / REALIZED_PNL_BLOCKED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


### PR-050 addendum — Production plan-preview vs live suggested-share drift

For the same 3006 BUY:
- plan buyHigh = 287.08;
- stored plan firstShares = 146;
- recomputing NT$42,000 / 287.08 also gives 146;
- live BUY trigger price = 282.5;
- live suggestedShares = 148.

So the observed Production row confirms the designed semantic split:
`plan firstShares = preview at plan price`,
while
`live suggestedShares = recomputed at observed trigger price`.

The +2 shares are not a fill claim. They prove only that plan preview quantity must not substitute for live signal-side quantity in execution research.


## PR-057 Production result — share quantization does not explain away current risk concentration

Read-only Production run `36331652461` / job `108654620345` applied the frozen quantization cascade to 2026-09-18.

Current PriorityScore sizing:
- nominal deploy target = NT$170,000;
- planned allocation after NT$1,000 flooring = NT$168,000;
- plan-preview suggested notional after integer-share flooring = NT$167,471.13;
- NT$1,000-floor shortfall = NT$2,000;
- share-floor residual = NT$528.87;
- total nominal-to-preview shortfall = NT$2,528.87.

Risk concentration:
- planned projected-stop-risk HHI = 0.37723809;
- current plan-preview HHI = 0.37670778.

So integer-share flooring slightly attenuates current HHI by only 0.00053031 (~0.14% relative).

Applying the same share-floor rule to same-deployment equal capital:
- preview HHI = 0.35538974;
- current minus equal-capital HHI = +0.02131804 (~6.00% above the comparator);
- current preview projected stop-risk is NT$164.45 higher.

Applying the same share-floor rule to the continuous 35%-cap equal-risk diagnostic:
- preview HHI = 0.33428138;
- current minus comparator HHI = +0.04242640 (~12.69% above the comparator);
- current preview projected stop-risk is NT$520.70 higher.

Therefore the explanation:
`current risk concentration is mainly a share-floor / price-quantization artifact`
is rejected on the 2026-09-18 witness.

Important caveat:
the capped equal-risk comparator is still continuous at the **allocation** layer. PR-057 only adds share/tranche quantization to it. A true NT$1,000-grid same-deployment comparator remains the next structural falsification.

Durable receipt:
`research/sizing_quantization_production_receipt_20260928.json`.

Status:
`SHARE_QUANTIZATION_EXPLANATION_FALSIFIED_ON_WITNESS / GRID_EQUAL_RISK_NEXT / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-058 — NT$1,000-grid equal-risk counterfactual survives full plan-preview quantization (2026-09-28)

PR-057 showed that integer-share flooring does not explain away the 2026-09-18 PriorityScore risk-concentration witness. PR-058 removes the last major structural idealization from the equal-risk comparator: continuous allocation amounts.

### Frozen grid method

Constraints:
- same three selected names;
- same NT$168,000 current planned deployment;
- same 35% per-name cap;
- NT$1,000 allocation grid;
- same buyHigh-to-stop conservative risk definition.

Starting from the continuous capped equal-risk target, each allocation is floored to the NT$1,000 grid. Residual NT$1,000 units are then assigned deterministically to the eligible name that minimizes squared projected-risk-space error to the continuous target.

On 2026-09-18 this yields:
- 2006 = NT$70,000;
- 3105 = NT$41,000;
- 6133 = NT$57,000.

No outcome is used to choose those amounts.

### Before share flooring

Grid equal-risk:
- projected stop-risk = NT$5,965.732;
- HHI = 0.33438488;
- max/min projected-risk ratio = 1.137143.

### After the same 60/40 + integer-share preview flooring

Grid equal-risk:
- preview suggested notional = NT$167,697.54;
- share-floor residual = NT$302.46;
- preview projected stop-risk = NT$5,951.36;
- preview risk HHI = 0.33434138.

Current PriorityScore sizing:
- preview suggested notional = NT$167,471.13;
- preview projected stop-risk = NT$6,459.97;
- preview risk HHI = 0.37670778.

Therefore current minus grid equal-risk is:
- +NT$508.61 projected stop-risk;
- +0.04236640 risk HHI;
- HHI is ~12.67% higher relative to the grid comparator.

Critically, the grid comparator actually carries **NT$226.41 more plan-preview suggested notional** than current, yet still has materially lower projected stop-risk and concentration.

So two counter-explanations are rejected on this witness:
1. equal-risk only looks better because its allocations were continuous/non-executable;
2. equal-risk only looks safer because it leaves more cash unused after share flooring.

This materially strengthens the structural finding, but it still does not prove equal-risk sizing has better realized returns.

Durable receipt:
`research/grid_equal_risk_production_receipt_20260928.json`.

Status:
`GRID_AND_SHARE_QUANTIZATION_COUNTEREVIDENCE_SURVIVES / STRUCTURAL_RISK_CONCENTRATION_STRENGTHENED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-059 — exhaustive grid search: exact optimum shifts after share quantization (2026-09-28)

The NT$1,000-grid structural search was upgraded from a target-following construction to **complete enumeration**.

For 2026-09-18, under:
- the same three selected names;
- the same NT$168,000 planned deployment;
- the same 35% per-name cap;
- at least one NT$1,000 unit per selected name;

there are exactly **946 feasible grid states**, and all were evaluated.

### PRE_SHARE objective

Before 60/40 tranche and integer-share flooring, the unique minimum-HHI and unique minimum-max/min allocation are both:

- 2006 = NT$70,000;
- 3105 = NT$41,000;
- 6133 = NT$57,000.

Projected risk:
- total = NT$5,965.732;
- HHI = 0.3343848759;
- max/min = 1.13714329.

This independently verifies the PR-058 70/41/57 grid allocation as the **global pre-share optimum**, not merely a heuristic near the continuous target.

### POST_SHARE objective

After applying the exact same:
- 60/40 tranche split;
- integer-share floor at buyHigh;

the unique minimum-HHI and minimum-max/min allocation both shift to:

- 2006 = NT$70,000;
- 3105 = NT$42,000;
- 6133 = NT$56,000.

Its plan-preview geometry:
- suggested notional = NT$167,227.36;
- projected stop-risk = NT$5,940.8663;
- HHI = 0.3342784042;
- max/min = 1.1265985.

Current PriorityScore sizing remains:
- 50k / 64k / 54k;
- preview projected stop-risk = NT$6,459.97;
- HHI = 0.37670778.

Thus the exact minimizing allocation is **objective/quantization-sensitive by one NT$1,000 unit**, but the conclusion that current sizing is materially more concentrated survives either semantic definition.

### Important cash-drag nuance

The post-share HHI optimum has NT$243.77 less preview suggested notional than current, so that optimum alone cannot prove its lower risk is independent of cash drag.

The separate PRE_SHARE-global optimum 70/41/57 still supplies that counterexample:
after the same share flooring it carries NT$167,697.54 preview notional, **NT$226.41 more than current**, while retaining much lower projected-risk concentration.

Therefore:
- exact comparator allocation is not invariant across structural objectives;
- the structural concentration finding is robust;
- the earlier cash-drag falsification remains supported by a distinct comparator.

Durable receipt:
`research/exhaustive_grid_risk_optima_production_receipt_20260928.json`.

Status:
`DISCRETE_OBJECTIVE_SENSITIVITY_CONFIRMED / UNIQUE_OPTIMA_BY_SEMANTIC / STRUCTURAL_CONCLUSION_ROBUST / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-060 — stop-risk entry-reference sensitivity test (2026-09-28)

The current Portfolio Risk structural result uses `buyHigh` as the conservative planned entry reference.

PR-060 tests a direct counter-hypothesis:

`The observed 2026-09-18 risk concentration is only an artifact of choosing buyHigh.`

For every reconstructable multi-name date, projected stop-risk is recomputed under three frozen references:
- BUY_LOW;
- MIDPOINT = (buyLow + buyHigh) / 2;
- BUY_HIGH.

For each reference, the audit compares:
1. current PriorityScore-proportional allocation;
2. same-deployment equal capital;
3. exhaustive NT$1,000-grid global minimum HHI under the same 35% per-name cap.

The grid search uses the same selected names and same planned deployment. No realized price/fill is assumed.

Interpretation is pre-registered:
- if current remains more concentrated than equal-capital and the global grid minimum across all three references, the structural conclusion survives reference-price falsification;
- if the gap disappears or reverses at BUY_LOW/MIDPOINT, the earlier conclusion must be downgraded as reference-sensitive.

Artifacts:
`research/entry_reference_risk_sensitivity_v0_1.mjs`;
`research/entry_reference_risk_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_entry_reference_sensitivity_readonly_audit.mjs`.

Status:
`REFERENCE_SENSITIVITY_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-060 Production result — buyHigh reference does not create the concentration finding

Read-only Production run `36350840822` / job `108709088620` tested the only reconstructable multi-name date, 2026-09-18, under three entry references.

### BUY_LOW

Current HHI = 0.4252711642.  
Equal-capital HHI = 0.3950931017.  
Exhaustive NT$1,000-grid minimum HHI = 0.3486465228.

### MIDPOINT

Current HHI = 0.3934504209.  
Equal-capital HHI = 0.3683594007.  
Exhaustive grid minimum HHI = 0.3377017368.

### BUY_HIGH

Current HHI = 0.3772380854.  
Equal-capital HHI = 0.3558588621.  
Exhaustive grid minimum HHI = 0.3343850287.

3105 is the widest stop-risk name under every reference:
- buyLow: 3.570699%;
- midpoint: 4.292115%;
- buyHigh: 5.002817%.

The key counter-hypothesis is therefore rejected:

`The structural concentration exists only because risk was measured from conservative buyHigh.`

In fact the current-minus-equal-capital HHI gap is **largest at buyLow** (0.0301780625) and **smallest at buyHigh** (0.0213792233). Conservative buyHigh does not exaggerate the witness; on this date it attenuates the relative concentration gap.

The exact risk-minimizing grid allocation moves with the reference price (70/36/62 at buyLow, 70/39/59 at midpoint, 70/41/57 at buyHigh), so the exact comparator remains model-sensitive. The direction of the structural conclusion does not.

Durable receipt:
`research/entry_reference_risk_sensitivity_production_receipt_20260928.json`.

Status:
`ENTRY_REFERENCE_ARTIFACT_FALSIFIED / STRUCTURAL_CONCLUSION_STRENGTHENED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-061 — separate stop-geometry concentration from PriorityScore sizing increment (2026-09-28)

PR-033 through PR-060 show that current PriorityScore sizing compounds with heterogeneous stop distance. PR-061 adds an important anti-overclaim decomposition.

Equal-capital is used as a **descriptive bridge**, not a causal counterfactual claim.

For a selected set of N names:

`current HHI - 1/N = (equal-capital HHI - 1/N) + (current HHI - equal-capital HHI)`.

The first term describes concentration already present when capital is neutral across names but stop distances differ.

The second term is the incremental concentration associated with the current PriorityScore capital tilt on the same names.

A second bridge uses the exhaustive feasible grid minimum:

`current HHI - global-min HHI = (equal-capital HHI - global-min HHI) + (current HHI - equal-capital HHI)`.

### Governance firewall

These components are algebraically exact but **not statistically independent and not causal factor attribution**.

Therefore future reporting must not say:
`PriorityScore causes all observed risk concentration`.

The correct statement is:
`stop geometry already creates unequal projected-risk contributions under equal capital; current PriorityScore sizing adds an additional concentration increment on the observed date.`

Executable decomposition:
`research/risk_concentration_bridge_v0_1.mjs`.

Audit:
`tests/risk_concentration_bridge_audit_v0_1.mjs`.

Status:
`GEOMETRY_AND_SIZING_COMPONENTS_SEPARATED / ECONOMIC_VALUE_UNKNOWN`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


### PR-061 Production bridge result

Using the PR-060 2026-09-18 reference sensitivity:

- BUY_LOW theoretical excess: stop-geometry bridge 67.175577%, current sizing increment 32.824423%.
- MIDPOINT theoretical excess: stop-geometry bridge 58.263081%, current sizing increment 41.736919%.
- BUY_HIGH theoretical excess: stop-geometry bridge 51.305446%, current sizing increment 48.694554%.

Relative to the exhaustive feasible grid minimum:
- BUY_LOW: equal-capital-to-min gap 60.615721%, sizing increment 39.384279%;
- MIDPOINT: 54.992623% / 45.007377%;
- BUY_HIGH: 50.110389% / 49.889611%.

These percentages are an **algebraic bridge only**. They are not causal shares and must not be interpreted as independent variance decomposition.

The result corrects any one-sided reading of earlier PRs: heterogeneous stop geometry is already a material source of concentration under neutral capital, and PriorityScore sizing adds a separate incremental concentration on top.


## PR-062 — concentration-metric sensitivity falsification (2026-09-28)

PR-033 through PR-061 rely heavily on HHI to summarize projected stop-risk concentration.

PR-062 tests the counter-hypothesis:

`The structural conclusion is an artifact of HHI itself.`

Five metrics are evaluated on the same projected-risk contribution vectors:
- HHI;
- Gini;
- coefficient of variation;
- maximum contribution share;
- max/min positive contribution ratio.

For every metric and every entry reference (buyLow, midpoint, buyHigh), the Production audit compares:
1. current PriorityScore sizing;
2. equal capital;
3. the exhaustive global minimum over all legal NT$1,000-grid states under the same deployment and 35% cap.

The exact optimal allocation is allowed to differ by metric. Agreement of exact optima is **not** required.

The falsification target is directional:
if several non-HHI metrics no longer show current as more concentrated than equal capital/global minima, the HHI-based structural claim must be downgraded.

Artifacts:
`research/risk_metric_sensitivity_v0_1.mjs`;
`research/risk_metric_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_metric_sensitivity_readonly_audit.mjs`.

Status:
`METRIC_SENSITIVITY_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-062 Production result — concentration direction survives five metrics

Read-only Production run `36351672635` / job `108711424760` evaluated:
- 3 entry references: buyLow, midpoint, buyHigh;
- 5 concentration metrics: HHI, Gini, CV, maximum contribution share, max/min;
- all 946 legal NT$1,000-grid states per reference.

Directional result:
- current > equal-capital concentration: **15 / 15** metric-reference combinations;
- current > metric-specific global minimum: **15 / 15**.

The exact global optimum is objective-sensitive:
- buyLow: HHI/CV -> 70/36/62; Gini/MAX_SHARE/MAX_MIN -> 70/37/61;
- midpoint: HHI/CV -> 70/39/59; Gini/MAX_SHARE/MAX_MIN -> 70/40/58;
- buyHigh: all five metrics -> 70/41/57.

Therefore the counter-hypothesis
`the concentration result is only an HHI artifact`
is rejected on the 2026-09-18 witness.

At the same time, the optimum differences reinforce a governance constraint:
**there is no single objective-free “correct” risk-minimizing allocation.**
Exact comparator allocation depends on reference price, integer grid and concentration objective.

Durable receipt:
`research/risk_metric_sensitivity_production_receipt_20260928.json`.

Status:
`HHI_ARTIFACT_FALSIFIED / METRIC_DIRECTION_ROBUST / OPTIMUM_OBJECTIVE_SENSITIVE / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-063 — per-name cap creates a separate non-redistributed reserve channel (2026-09-28)

Source audit of `allocateAndBuildPlans()` confirms the sequence:

`rawRatio = deployRatio × scoreShare`

then

`ratio = min(35%, rawRatio)`

then each name is independently floored to NT$1,000.

There is no second redistribution pass for clipped score weight.

Therefore the selected-count deployment ratio is an **upper target**, not a guaranteed planned deployment.

Cap-binding score-share thresholds:
- 1 selected: raw ratio is exactly 35%; no extra cap reserve;
- 2 selected: one name binds above 58.333333% of selected score weight;
- 3–6 selected: one name binds above 41.176471%.

A deterministic hypothetical shows the mechanism:
scores 100/50/50 with NT$200,000 capital and 3 selected names imply an 85% nominal target (NT$170,000), but the top name is clipped from 42.5% to 35%. The clipped score weight creates NT$15,000 cap-induced reserve; NT$1,000 floors add another NT$1,000 reserve, leaving NT$154,000 planned.

This is not automatically a defect. It may be desirable risk control. The research question is whether this implicit extra cash materially contributes to under-deployment and whether the forgone exposure is economically justified.

Artifacts:
`research/score_cap_reserve_v0_1.mjs`;
`research/score_cap_reserve_spec_v0_1.json`;
`tests/portfolio_risk_score_cap_reserve_readonly_audit.mjs`.

Status:
`CAP_RESERVE_MECHANISM_PROVEN / PRODUCTION_OCCURRENCE_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-063 Production result — cap mechanism did not cause observed historical underdeployment

Read-only Production run `36352049564` / job `108712476115` checked both reconstructable plan dates.

### 2026-09-18

- selected names = 3;
- nominal deploy target = 85% × NT$200,000 = NT$170,000;
- highest score share = 3105 at 38.172502%;
- cap-binding threshold for 3+ names = 41.176471%;
- cap-binding symbols = none;
- cap-induced reserve = NT$0;
- planned allocation after NT$1,000 floors = NT$168,000;
- floor reserve = NT$2,000;
- designed strategic reserve = NT$30,000;
- remaining cash after plan = NT$32,000.

Therefore the extra NT$2,000 under the nominal 85% deployment target came entirely from NT$1,000 flooring, not the 35% cap.

### 2026-09-21

- selected names = 1;
- nominal deploy target = 35% = NT$70,000;
- raw ratio = cap = 35%;
- cap-induced reserve = NT$0;
- floor reserve = NT$0;
- remaining cash = NT$130,000, entirely the designed 65% strategic reserve.

The historical hypothesis
`current observed planned underdeployment was caused by non-redistributed cap clipping`
is rejected for the available dates.

The structural mechanism remains valid prospectively: if selected score concentration crosses the cap-binding threshold, clipped mass is not redistributed and will become extra reserve.

Durable receipt:
`research/score_cap_reserve_production_receipt_20260928.json`.

Status:
`CAP_RESERVE_MECHANISM_PROVEN / HISTORICAL_OCCURRENCE_NOT_OBSERVED / PROSPECTIVE_WATCH_ONLY / ECONOMIC_VALUE_UNKNOWN`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-064 — FIRST-tranche risk concentration test (2026-09-28)

The existing structural evidence uses the full planned allocation, but actual live exposure may stop after FIRST and never reach ADD.

PR-064 tests whether the concentration finding survives when risk is restricted to the Formal 60% FIRST tranche.

For each multi-name date:
- FIRST amount = round(totalAllocation × 0.60);
- FIRST preview shares = floor(FIRST amount / buyHigh);
- FIRST projected stop-risk = FIRST preview notional × conservative stop-risk fraction.

The audit compares:
1. current PriorityScore sizing;
2. same-deployment equal capital;
3. the exhaustive NT$1,000-grid allocation with minimum FIRST-preview risk HHI under the same 35% cap.

The falsification target is lifecycle-stage sensitivity:
if current FIRST risk is no longer more concentrated than equal-capital/global minimum, the earlier full-plan conclusion must be downgraded.

This remains plan-preview geometry only. It does not assert a BUY trigger, submitted order, fill or realized exposure.

Artifacts:
`research/first_tranche_risk_concentration_v0_1.mjs`;
`research/first_tranche_risk_concentration_spec_v0_1.json`;
`tests/portfolio_risk_first_tranche_readonly_audit.mjs`.

Status:
`FIRST_TRANCHE_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-064 Production result — concentration survives in FIRST-only exposure

Read-only Production run `36352649582` / job `108714150360` tested 2026-09-18 using only the Formal 60% FIRST tranche.

Current PriorityScore sizing:
- FIRST preview notional = NT$100,609.21;
- FIRST projected stop-risk = NT$3,881.77;
- FIRST HHI = 0.3769514595;
- FIRST max/min risk = 2.44266646.

Equal-capital:
- FIRST preview notional = NT$100,484.28;
- FIRST HHI = 0.3551615396.

Exhaustive 946-state FIRST-only minimum:
- allocation = 70k / 42k / 56k;
- FIRST HHI = 0.3343161104.

Thus:
- current − equal FIRST HHI = +0.0217899199;
- current − global-min FIRST HHI = +0.0426353491.

Current FIRST-only HHI is also slightly **higher** than current full-plan preview HHI:
0.3769514595 vs 0.3767077818, delta +0.0002436776.

Therefore the counter-hypothesis
`the concentration only appears when the full 60%+40% planned position is counted`
is rejected on the available multi-name witness.

This remains plan-preview geometry, not realized exposure.

Durable receipt:
`research/first_tranche_risk_production_receipt_20260928.json`.

Status:
`FIRST_TRANCHE_CONCENTRATION_SURVIVES / LIFECYCLE_STAGE_ARTIFACT_FALSIFIED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-065 — ADD-tranche risk concentration test (2026-09-28)

PR-064 showed the structural concentration survives in FIRST-only preview exposure. PR-065 tests the complementary Formal 40% ADD tranche.

For each multi-name date:
- FIRST amount = round(totalAllocation × 0.60);
- ADD amount = totalAllocation − FIRST amount;
- ADD preview shares = floor(ADD amount / buyHigh);
- ADD projected stop-risk = ADD preview notional × conservative stop-risk fraction.

The audit compares:
1. current PriorityScore sizing;
2. same-deployment equal capital;
3. exhaustive NT$1,000-grid minimum ADD-preview HHI under the same 35% cap.

This is intentionally independent of execution state. It does **not** assume FIRST was filled or that ADD ever triggered.

The counter-hypothesis is:
`the concentration direction is specific to FIRST/full-plan and reverses or disappears in the smaller ADD tranche because share quantization differs.`

Artifacts:
`research/add_tranche_risk_concentration_v0_1.mjs`;
`research/add_tranche_risk_concentration_spec_v0_1.json`;
`tests/portfolio_risk_add_tranche_readonly_audit.mjs`.

Status:
`ADD_TRANCHE_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-065 Production result — concentration also survives ADD-only preview

Read-only Production run `36352942937` / job `108714975039` tested 2026-09-18 using only the Formal ADD tranche.

Current PriorityScore sizing:
- ADD preview notional = NT$66,861.92;
- ADD projected stop-risk = NT$2,578.20;
- ADD HHI = 0.3763426432;
- ADD max/min risk = 2.43024727.

Equal-capital:
- ADD preview notional = NT$67,155.16;
- ADD HHI = 0.3557339695.

Exhaustive 946-state ADD-only minimum:
- allocation = 70k / 42k / 56k;
- ADD HHI = 0.3342266703.

Thus:
- current − equal ADD HHI = +0.0206086737;
- current − global-min ADD HHI = +0.0421159729.

ADD-only HHI is slightly below current full-plan preview HHI:
0.3763426432 vs 0.3767077818, delta -0.0003651386.

Combined with PR-064, the concentration direction now survives:
- FIRST-only;
- ADD-only;
- FULL preview.

The stage changes the exact HHI slightly but does not reverse the structural result.

Durable receipt:
`research/add_tranche_risk_production_receipt_20260928.json`.

Status:
`ADD_TRANCHE_CONCENTRATION_SURVIVES / TRANCHE_STAGE_REVERSAL_FALSIFIED / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-066 — lifecycle × concentration-metric sensitivity (2026-09-28)

PR-062 established metric robustness for full planned exposure, while PR-064/065 established HHI robustness for FIRST and ADD separately.

PR-066 crosses both dimensions:

- lifecycle stages: FIRST, ADD, FULL;
- metrics: HHI, Gini, CV, maximum contribution share, max/min.

For every stage-metric cell, Production compares:
1. current PriorityScore sizing;
2. equal capital;
3. metric-specific exhaustive NT$1,000-grid global minimum under the same deployment and 35% cap.

This creates 15 directional falsification cells.

The purpose is to prevent a compound artifact:
`the conclusion appears robust by stage only because HHI was used, or robust by metric only because FULL exposure was used.`

Exact global optima are allowed to differ. Direction is the falsification target.

Artifacts:
`research/lifecycle_metric_sensitivity_v0_1.mjs`;
`research/lifecycle_metric_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_lifecycle_metric_sensitivity_readonly_audit.mjs`.

Status:
`LIFECYCLE_METRIC_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-066 Production result — 15/15 lifecycle × metric cells preserve the direction

Read-only Production run `36353326188` / job `108716060944` evaluated 2026-09-18 across:
- FIRST, ADD, FULL;
- HHI, Gini, CV, maximum risk share, max/min;
- all 946 legal NT$1,000 allocation states per stage.

Directional agreement:
- current > equal-capital concentration = **15/15**;
- current > metric-specific global minimum = **15/15**.

HHI summary:
- FIRST: current 0.3769514595 / equal 0.3551615396 / global min 0.3343161104;
- ADD: current 0.3763426432 / equal 0.3557339695 / global min 0.3342266703;
- FULL: current 0.3767077818 / equal 0.3553897407 / global min 0.3342785411.

Under buyHigh plan-preview semantics, all 15 stage-metric cells have the same unique global-min allocation:
`70k / 42k / 56k`.

That convergence is strong structural evidence for this witness, but it is not universal: PR-060 already shows the exact optimum moves when buyLow/midpoint are used instead of buyHigh.

Therefore both compound counter-hypotheses are rejected:
- stage robustness is not merely an HHI artifact;
- metric robustness is not merely a FULL-position artifact.

Durable receipt:
`research/lifecycle_metric_sensitivity_production_receipt_20260928.json`.

Status:
`LIFECYCLE_X_METRIC_ARTIFACT_FALSIFIED / 15_OF_15_DIRECTIONAL_AGREEMENT / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-067 — one-grid local allocation falsification (2026-09-28)

The exhaustive global searches show current sizing is not the concentration minimum. PR-067 asks a stricter and more local question:

`Is the current allocation at least a local concentration optimum on the Formal NT$1,000 grid?`

Starting from the observed current allocation, enumerate every legal directed transfer of exactly NT$1,000 from one selected name to another while preserving:
- same selected names;
- same total planned deployment;
- 35% per-name cap;
- positive per-name allocation.

Each one-step neighbor is evaluated across 15 cells:
- FIRST / ADD / FULL;
- HHI / Gini / CV / maximum risk share / max-min.

A neighbor `weakly dominates current` only if it improves at least one cell and worsens none.

This deliberately avoids relying on a distant global optimum. If a one-grid move already dominates current, the structural concentration has a local downhill direction.

Artifacts:
`research/local_grid_reallocation_v0_1.mjs`;
`research/local_grid_reallocation_spec_v0_1.json`;
`tests/portfolio_risk_local_grid_reallocation_readonly_audit.mjs`.

Status:
`LOCAL_NEIGHBORHOOD_PROTOCOL_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-067 Production result — current sizing is not a one-grid local concentration optimum

Read-only Production run `36353663428` / job `108717034051` evaluated all six legal directed NT$1,000 transfers around the 2026-09-18 current allocation:

`50k / 64k / 54k`.

Across the 15 FIRST/ADD/FULL × concentration-metric cells, two one-step moves strictly dominate current:

### 3105 -> 2006

New allocation:
`51k / 63k / 54k`.

Result:
- improved cells = 15;
- worsened cells = 0.

FULL deltas versus current:
- HHI = -0.0031753015;
- Gini = -0.0072141368;
- CV = -0.0134547140;
- max risk share = -0.0059580253;
- max/min = -0.0860813875.

### 3105 -> 6133

New allocation:
`50k / 63k / 55k`.

Result:
- improved cells = 15;
- worsened cells = 0.

FULL deltas:
- HHI = -0.0025063406;
- Gini = -0.0047377054;
- CV = -0.0105771343;
- max risk share = -0.0066849619;
- max/min = -0.0380891095.

The reverse-direction transfers into 3105 from either 2006 or 6133 worsen all 15 cells.

Therefore:
`current allocation is a Pareto local concentration optimum`
is rejected.

This is stronger than the distant-global-optimum evidence because concentration can be reduced by the smallest permitted NT$1,000 move.

### Critical limit

This is **not** an allocation recommendation.

3105 has the highest PriorityScore on the witness. A local risk-concentration improvement can still destroy expected return if that score contains genuine prospective alpha. Economic sizing dominance remains untested.

Durable receipt:
`research/local_grid_reallocation_production_receipt_20260928.json`.

Status:
`CURRENT_NOT_LOCAL_CONCENTRATION_OPTIMUM / TWO_STRICTLY_DOMINATING_ONE_GRID_MOVES / ECONOMIC_VALUE_UNKNOWN / NOT_OPTIMIZATION_READY`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-063 — FIRST/ADD tranche-ratio sensitivity sweep (2026-09-28)

FIRST-only and ADD-only audits both preserve the 2026-09-18 structural concentration. PR-063 tests a stronger counter-hypothesis:

`The concentration is a special artifact of the current 60/40 split.`

The FIRST ratio is swept from 40% to 90% in 5-point increments. At every ratio:
- FIRST amount = round(allocation × ratio);
- ADD amount = allocation - FIRST amount;
- each tranche is integer-share floored at buyHigh;
- the two tranche preview notionals are recombined.

For each ratio the audit compares:
1. current PriorityScore allocation;
2. same-deployment equal capital;
3. exhaustive NT$1,000-grid minimum HHI under the same 35% cap and the same ratio-specific share flooring.

Interpretation is frozen:
- persistent current > equal-capital > / or current > global minimum across the ratio grid rejects a 60/40-specific explanation;
- direction reversals over a material part of the grid would downgrade the structural finding as ratio-sensitive.

Artifacts:
`research/tranche_ratio_sensitivity_v0_1.mjs`;
`research/tranche_ratio_sensitivity_spec_v0_1.json`;
`tests/portfolio_risk_tranche_ratio_sensitivity_readonly_audit.mjs`.

Status:
`TRANCHE_RATIO_SENSITIVITY_READY / PRODUCTION_AUDIT_PENDING`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.
