# Research Master Map — 台股交易決策監控系統

Updated: 2026-09-27 05:15 Asia/Taipei
Status: CANONICAL_RESEARCH_INDEX / RESEARCH_ONLY
Formal Core: LOCKED

## Purpose

This file is the cross-chatroom canonical research map. Chat memory is never authoritative for research completion. Any A/B or specialist research chat must read this map together with RESEARCH_ENGINEERING_GOVERNANCE.md, RESEARCH_WORKLIST.md and RESEARCH_CHECKPOINT.md when it needs global research status.

RESEARCH_CHECKPOINT.md remains the canonical continuation cursor. This Master Map is the canonical inventory/maturity dashboard. Dedicated research files remain the detailed evidence source.

## Maturity scale

- L0 = UNSTUDIED (0)
- L1 = THEORY_UNDERSTOOD (0.20)
- L2 = MECHANISM_AND_FALSIFICATION_DEFINED (0.40)
- L3 = TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED (0.60)
- L4 = PROSPECTIVE_SHADOW_OR_OOS_EVIDENCE (0.80)
- L5 = ROBUSTNESS_COST_REDUNDANCY_MULTI_REGIME_VALIDATED (1.00)

A module may not be promoted merely because a document exists. Missing evidence remains UNKNOWN.

## Global dashboard rules

Tracked metrics:
- domainCount
- moduleCount
- maturityWeightedPct
- countsByLevel L0..L5
- DATA_QUALITY_BLOCKED
- DATA_SOURCE_BLOCKED
- WAITING_PROSPECTIVE
- REDUNDANT
- FALSIFIED
- independentDates
- prospectiveSamples
- researchDebtUnits

researchDebtUnits = sum(1 - maturityWeight) across registered modules, plus separately reported blocked/waiting counts. Do not double-count blocked status as extra maturity debt.

No percentage is published until module inventory has been reconciled against dedicated research files and checkpoints. Estimated chat percentages are non-canonical.

## Canonical domains

1. Price / K-line / chart-pattern topology
2. Price-volume relationship
3. Trend / momentum / reversal
4. Volatility / volatility regime
5. Market microstructure / order-book / execution mechanics
6. Positioning / institutions / margin / SBL / crowding
7. Fundamentals / financial statements / monthly revenue / information dynamics
8. Industry / Sector / Residual RS / breadth
9. Supply-chain lead-lag
10. Corporate actions / event risk / material information
11. Derivatives / futures / options / Taiwan VIX
12. Macro / cross-market / regime transmission
13. Execution Alpha / trading frictions / slippage / opportunity cost
14. Portfolio / capital utilization / REDUCE / RE-ADD
15. Statistical validation / PIT / Shadow / OOS / Factor Zoo / overfit

## Current known lane anchors

These are navigation anchors, not final maturity scores:
- K-line/pattern: dedicated pattern research/checkpoints; prospective observer work exists, outcome maturity still evidence-dependent.
- Trend / momentum / reversal: dedicated lane initialized in `TREND_MOMENTUM_REVERSAL_RESEARCH.md` / checkpoint. Regime-transition lifecycle is FALSIFICATION_IN_PROGRESS; Momentum Gap is Taiwan-negative/rejected; Extreme Absolute Strength has high redundancy with existing lateStage/overheat. Current R06 transition counting is not yet candidate-outcome evidence and adjacent observed research dates are not automatically consecutive official sessions.
- Price-volume: PV/PVE program is actively advancing on main; latest status must be read from its dedicated checkpoint, never inferred from this summary.
- Volatility-regime: level/change/shock and market×stock-vol interaction falsification are frozen; realized-vol evidence is gated by continuity-proven PIT history and implied-vol by separate TAIFEX provenance.
- Microstructure: concept/evidence work exists; recorder completeness and historical observability constraints remain relevant.
- Fundamentals: information-dynamics research exists; PIT vintage semantics remain mandatory.
- Supply-chain: SC-036 adds two independent monthly Taiwan EAF steel-chain vintages and proves replayable upstream/intermediate/downstream asymmetric transmission states, moving D10-09 to L3. SC-039 uses dated NDC/CIER Taiwan PMI industry data to separate new orders, unfinished orders, supplier delivery, inventory, customer inventory, input prices and outlook; the electronics counterexample shows longer delivery can coexist with slowing order momentum/high inventory, moving D10-07 to L3. SC-077 promotes D10-01 to L3 on bounded Taiwan PIT topology-source/replay feasibility using cross-issuer named nodes/edges, qualification constraints, effective-dated append-only graph semantics, UNKNOWN firewalls and a current official TWSE read-only source observer; complete tier-2/tier-3 topology and SDA-010 closure remain later debt. SC-078 promotes D10-02 to L3 because the prefrozen 1M/2M/3M replay contract, six steel vintages, physical copper-foil→CCL→PCB chain, deterministic MOEA native replay and release-frontier timing establish PIT data feasibility even though no universal fixed lag is validated. D10-04's former capacity/utilization denominator blocker was superseded by SC-052, which established a bounded cross-industry issuer-native capacity contract and promoted D10-04 to L3; official utilization remains partially UNKNOWN and is not synthesized.
- Corporate actions: extensive CA program exists; denominator/vintage provenance gates remain authoritative.
- Derivatives: concept research exists; source/session/contract/tenor/DTE provenance required before outcome claims.
- Trading frictions: explicit/implicit cost decomposition exists; missing decision/fill/quote context remains UNKNOWN.
- Execution Alpha: coverage-aware accounting exists; exact-date recorder completeness remains a Class-B gate and 2026-09-24 remains UNKNOWN.
- Portfolio/Re-add: Portfolio Risk Tier-A v0.2 now separates deployment, within-deployed concentration, total-account risky-name HHI, stop-risk intensity, A/B channel geometry and nominal reserve versus cap/rounding shortfall using immutable plan-time journal data. Only two non-zero plan dates are reconstructable; actual-live heat still requires complete BUY/ADD/REDUCE/SELL event coverage. REDUCED_CONFIRMED -> recovery/re-add research remains separate and Formal promotion stays locked.
- Macro/Cross-market: PIT clocks/residualization/falsification are frozen; repository audit did not prove historical durable global receipts with sessionDate/knownAtTaipei/firstEligibleTaiwanDecision, so outcome testing is DATA_QUALITY_BLOCKED pending prospective receipts.
- Breadth / rotation: BR-035 live System1 selection-cohort work remains lineage-blocked, but independent official-source research advanced materially. BR-044 establishes Taiwan PIT/source feasibility for continuous official TWSE industry total-return rank transitions and moves D09-06 to L3; BR-046 proves formal-industry and ABF/IC-substrate theme exposure are many-to-many across 8046 南亞電路板 (電子零組件業) and 3189 景碩 (半導體業), moving D09-11 to bounded L3 PIT feasibility. Existing size/breadth/dispersion receipts remain source-only. No sector threshold, ranking, score or Formal behavior changed.
- Validation: R01-R08/I01-I07, purged holdout, date clustering, redundancy, costs, zero-pick and prospective Shadow controls are cross-cutting requirements.
- PriorityScore calibration: Production patch-chain audit corrected the comparator to post-consensus PriorityScore first, RR second, marketConsensusScore third, then setup/sector/RS. V8.13 now prospectively preserves the full ranking provenance. Status WAITING_PROSPECTIVE; historical selected-only calibration is prohibited.

- Liquidity admission: current 1000/300-lot and size-conditioned early gates are not yet cleanly falsifiable with standard Shadow. BROAD_CONTROL systematically excludes primary below-minLots rejects, while some size-conditioned rejects can appear only incidentally in its bounded 6-per-pool sample; REJECTED_AFTER_BASE excludes all early basePassed=false liquidity rejects. `LIQUIDITY_ADMISSION_RESEARCH.md` and `research/liquidity_gate_rejected_control_spec_v0_1.json` freeze the prospective control design. Formal spread/depth exception inputs have no repository-side producer found; external enrichment injection is feasible, so live coverage remains UNKNOWN. No threshold relaxation is authorized.

## Cross-chatroom protocol

Every research chat may read this file. Only GitHub main is canonical.

When a research cycle materially changes a module:
1. update the dedicated research evidence/checkpoint;
2. update RESEARCH_CHECKPOINT.md exact continuation;
3. update the machine-readable research/research_master_map.json entry when maturity/status materially changes;
4. update this dashboard when aggregate counts change.

Concurrent A/B writes must re-read latest SHAs before update and merge rather than overwrite.

No chat may mark L4/L5 from retrospective narrative alone. No chat may turn UNKNOWN into BAD/0. No historical Shadow may be fabricated.

## Baseline build state

MASTER_MAP_SCHEMA = V0.2
INVENTORY_RECONCILIATION = PARTIAL_BASELINE_PUBLISHED
REGISTERED_MODULES = 21
L0/L1/L2/L3/L4/L5 = 0 / 0 / 15 / 5 / 1 / 0
REGISTERED_MODULE_MATURITY = 46.7%
RESEARCH_DEBT_UNITS = 11.2
DATA_QUALITY_BLOCKED = 8
DATA_SOURCE_BLOCKED = 4
WAITING_PROSPECTIVE = 3
FORMAL_OPTIMIZATION_CANDIDATES = 1

Important: 48.2% is the maturity of the currently reconciled 17 durable modules, NOT "48.8% of all stock-market knowledge". The inventory is still expanding and module splits must be independently falsifiable.

Optimization bridge is mandatory: once a research finding passes applicable positive+counterevidence, PIT/OOS, independent-date, regime, redundancy/incremental-value, cost, coverage/zero-pick and overfit gates and could improve after-market selection, it must be surfaced as a FORMAL_OPTIMIZATION_CANDIDATE for owner review. It may not self-promote to Formal.

Next master-map task: continue reconciliation of remaining domains/submodules, especially volatility-regime, institutional/crowding and macro/cross-market; continue trend/momentum/reversal from its new dedicated lane; do not inflate counts by treating sequential checkpoint IDs as separate modules.


## Formal optimization candidates

### HISTORY_SOURCE_REVALIDATION_V2.3 — Class B
Status: FORMAL_OPTIMIZATION_CANDIDATE / OWNER APPROVED / MERGED / DEPLOYED_AWAITING_FIRST_LIVE_TRADING_DAY.

Purpose: prevent stale or source-incomplete daily history from silently entering after-market Formal feature construction while preserving legitimate symbol-specific no-trade/suspension gaps.

Evidence basis:
- B-130 real stale-history witness materially changed existing Formal technical eligibility;
- strict market-session continuity was falsified by TWSE 8422 and TPEx 5314 legal gaps;
- fresh-provider >=60-bar acceptance was falsified by an official-traded missing-bar counterexample;
- sub-NT$10 traded rows are preserved as bar-presence truth before Formal filters;
- provider/official-source ambiguity fails closed;
- reusable official gap receipts avoid repeated refetch of the same legitimate gap;
- bounded cost model exposes the current 360 provider-call/hour seed envelope and deduplicates official gap calls by exchange/date;
- dedicated Research History Source Revalidation V2, V8 Regression and V8 Repair CI are green.

Exact proposed Formal behavior change: data admission/repair only. Formal A/B definitions, ranking, quotas, thresholds, capital, BUY/ADD/REDUCE, monitoring, signals and push remain frozen.

Remaining production risks: live suspicious-symbol incidence is UNKNOWN; extreme stale blast radius can exceed the existing seed window; official gap-proof storage/read integration is shared runtime; corporate-action price-continuity remains a separate lane.

Owner approval was granted and V8.12.0 was merged/deployed on 2026-09-26. First live operational validation remains 2026-09-29; deployment success is not trading-alpha proof.


## Shared Knowledge network (2026-09-26)

Cross-system reusable research is now indexed first by `shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md` under `shared-knowledge/SHARED_KNOWLEDGE_GOVERNANCE.md`.

This System 1 Master Map remains the canonical inventory/maturity dashboard for V8 research. Existing evidence files are not relocated. Reusable findings may be referenced by System 2 through the Shared Master Map; System 2-specific strategy/performance state lives under `system2/`.

Read order for future research chats: Shared Master Map -> RESEARCH_ENGINEERING_GOVERNANCE.md -> this System 1 Master Map / RESEARCH_CHECKPOINT.md -> dedicated lane checkpoint.


### Room 07 durable update — 2026-10-02
- Supply-chain: SC-040 freezes three independent 2026-07..09 NDC/CIER order/lead-time release vintages; SC-041 adds bounded 8046/3189 industry-to-issuer product-scope bridges while revenue exposure and issuer backlog remain UNKNOWN.
- SC-042 defines a dedicated shortage/supply-gap PIT event contract with explicit shortage/allocation plus operational-consequence requirements and a September mismatch/inventory negative control. D10-08 advances L2 -> L3 for Taiwan PIT/source feasibility only.
- No issuer backlog, realized margin, stock outcome, scoring weight or Formal Core behavior changed.

## Research-to-Optimization bridge gap audit — 2026-10-03

Canonical audit:
`shared-knowledge/RESEARCH_TO_OPTIMIZATION_BRIDGE_AUDIT_20261003_V0_1.md`

Machine-readable audit:
`shared-knowledge/research_to_optimization_bridge_audit_20261003_v0_1.json`

Result:
- existing canonical Formal optimization candidate lineage: 1 (HISTORY_SOURCE_REVALIDATION_V2.3; already owner-approved/merged/deployed);
- new unsurfaced EVIDENCE_READY candidates found: 0;
- explicit blocked/watchlist lanes: 13;
- L4 D16 validation modules are validation infrastructure, not stock-selection Alpha;
- System1 evidence automation / C3-C5 research evidence capture is evidence infrastructure, not a new Formal optimization candidate;
- D02-07, D02-08 and H20 remain non-candidates under current evidence.

FORMAL_OPTIMIZATION_CANDIDATES remains 1.
Formal Core remains LOCKED.



### Room 07 H01 specialist validation — 2026-10-03
- BR-051 freezes a Taiwan-headquartered foundry industry-structure PIT receipt. TSIA/ITRI 2025 foundry output is used only under its documented denominator; issuer consolidated revenue/capacity is not mislabeled as formal market share without compatibility proof.
- BR-052 freezes a distinct issuer-level competitive-action lifecycle using TSMC/UMC official action evidence.
- H01 specialist result: KEEP_SEPARATE proposed, with strict scope/evidence dedup. D09-13 owns industry structure; D09-14 owns issuer-specific competitive action/relative-position lifecycle.
- Shared market-share/capacity/price/margin evidence has one parent lineage and cannot create duplicate Alpha votes.
- No curriculum merge/retirement, no Production behavior and no Formal Core changed.


### Room 07 BR-053 through BR-056 — 2026-10-03
- BR-053 adds Taiwan steel as a cross-industry structure control: integrated BF/BOF and scrap-EAF routes have different input, product and demand structures.
- BR-054 adds non-semiconductor issuer actions and a bounded Foxconn/Lordstown failed/suspended strategic-action control.
- BR-055 adds Taiwan PCB as a third structure control: broad industry growth coexists with opposite product/application states and concentrated upstream-material power.
- BR-056 freezes native strategic-action outcome states and rejects an artificial cross-action scalar success score.
- H01 KEEP_SEPARATE specialist evidence is now submitted to the canonical intake ledger for 00 Dependency Audit / owner review.
- D09-13 and D09-14 remain L3; no L4/OOS/prospective stock-selection evidence exists.
- No Production or Formal Core behavior changed.


### Room 07 SC-045/046 + BR-057/058 — 2026-10-04
- SC-045 freezes a Taiwan-semiconductor issuer export-control PIT exposure receipt using current official rule/list/license vintages and issuer-native TSMC compliance/location evidence. D10-13 advances L2 -> L3 data feasibility only.
- SC-046 freezes TSMC Arizona industrial-policy award -> facility-milestone clocks and the firewall AWARDED_MAX != DISBURSED != SPENT != QUALIFIED_CAPACITY != HVM_OUTPUT. D10-14 advances L2 -> L3 data feasibility only.
- BR-057 freezes 8046/3189 PCB/ABF product-scope plus total-revenue denominators while leaving unavailable ABF/AI revenue numerators UNKNOWN.
- BR-058 freezes the first true prospective D09-14 issuer-action cohort before outcomes: UMC phased expansion and Foxconn/Mitsubishi Electric MOU. D09-14 remains L3 until future prospective outcomes exist.
- SC-077 promoted D10-01 to L3 on bounded Taiwan PIT topology-source/replay feasibility while full graph/SDA-010 implementation remains later debt. BR-066 promoted D09-12 to L3 on a same-date 2026-10-07 official TWSE breadth + TAIEX context receipt under one decision cutoff, with TPEx same-clock scope preserved as UNKNOWN. D09-05 remains the only Room07 L2 module pending a genuine same-generation System1 C1 parent. The prior D09-07 repeated-snapshot blocker is superseded by BR-045, and the prior D10-04 cross-company/cross-industry capacity-source blocker is superseded by SC-052.
- No Production or Formal Core behavior changed.


### Room 07 BR-045 + SC-047/048 — 2026-10-04
- BR-045 freezes five independent official TWSE close snapshots across all 34 industry total-return indices and demonstrates replayable sector-leadership persistence, churn and participation-state transitions. D09-07 advances L2 -> L3 for bounded sector-level PIT feasibility only; individual-stock leadership and predictive efficacy remain unproven.
- SC-047 appends current BIS parentage/entity-authorization policy semantics but is explicitly not labeled prospective because those vintages predate capture. D10-13 stays L3.
- SC-048 adds 6488 GlobalWafers as a second Taiwan issuer policy-to-capacity control. Final award and private capital commitment are known, while actual disbursement/current HVM remain UNKNOWN under a source-freshness conflict. D10-14 stays L3.
- No L4 claim, no Production behavior and no Formal Core change.


### Room 07 SC-052 + BR-062 — 2026-10-04
- SC-052 establishes a reusable Taiwan issuer-native capacity contract across semiconductors and steel using TSMC, China Steel and GlobalWafers controls.
- TSMC: >17m 12-inch-equivalent annual capacity and 15.0m 2025 wafer shipments are preserved as different semantics; shipment/capacity is not official utilization.
- China Steel: ~9.9m tonnes annual crude-steel capacity and 1.993m tonnes 2025Q1 crude-steel production provide a bounded nominal output/capacity proxy; annualization is synthetic and not official utilization.
- GlobalWafers remains the source-freshness/missing-denominator negative control.
- D10-04 advances L2 -> L3 for bounded Taiwan PIT/source feasibility only.
- BR-062 records that D18 dependencies are executable, but D09-12 still lacks one genuine same-clock breadth + regime receipt; historical reconstruction and test fixtures are prohibited substitutes.
- No L4 claim, no Production behavior and no Formal Core change.


## 2026-10-04 COV-02 canonical scope completion

- D05-06 canonical owner name: `Opening / Closing Auction & Auction Imbalance（開收盤集合競價與競價不平衡）`.
- COV-02 terminal action: `EXTEND_EXISTING_SCOPE`.
- L2 / 40% unchanged; no module-count or aggregate-maturity effect.
- Missing historical pre-close auction imbalance remains UNKNOWN; no final-close backfill.
- No Formal/System1/System2 behavior change.


## 2026-10-04 H09 canonical scope de-dup completion

- H09 terminal classification: `KEEP_SEPARATE / SCOPE_DEDUP_ONLY`.
- D16-19 = model/calibration producer; immutable CalibrationReceipt owner.
- D16-25 = calibrated-belief decision consumer; prior/Bayesian update, uncertainty, utility, risk-coverage, ABSTAIN.
- no second calibrator or probability authority under D16-25.
- D16-19 and D16-25 both remain L2/40%.
- names, module count, aggregate maturity and Formal behavior unchanged.


### Room 07 SC-050 / SC-054 lead-lag falsification — 2026-10-04
- SC-049 froze 1M/2M/3M lag candidates before the added vintages were inspected.
- Six consecutive Taiwan EAF-steel monthly states (2026-04..09) reduce the initially attractive 1M scrap->billet 2/2 short-window match to 3/5; 2M=2/4; 3M=1/3.
- H-beam becomes flat from July through September despite upstream/intermediate changes, reinforcing downstream price/contract stickiness.
- MOEA June-August electronics demand/production lanes provide a cross-chain falsification: export orders rise each month while component and computer/electronic/optical monthly production directions flip; common AI/HPC/cloud demand and overseas-production share confound a simple causal lag.
- D10-02 remains L2. D10-09 remains L3. No maturity is awarded for data volume alone.
- Exact next SC-055: one genuinely physical non-steel three-layer chain with compatible source clocks; otherwise reject the generic fixed-lag hypothesis if repeated controlled tests fail.
- Formal Core unchanged; no new optimization candidate.
