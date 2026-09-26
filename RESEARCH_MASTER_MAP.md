# Research Master Map — 台股交易決策監控系統

Updated: 2026-09-26 10:14 Asia/Taipei
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
- Supply-chain: SC-001..SC-006A completed through source-contract feasibility; automated canonical M25 ingestion is SOURCE_ACCESS_BLOCKED; complete graph is blocked. Manual bounded official-event research remains possible.
- Corporate actions: extensive CA program exists; denominator/vintage provenance gates remain authoritative.
- Derivatives: concept research exists; source/session/contract/tenor/DTE provenance required before outcome claims.
- Trading frictions: explicit/implicit cost decomposition exists; missing decision/fill/quote context remains UNKNOWN.
- Execution Alpha: coverage-aware accounting exists; exact-date recorder completeness remains a Class-B gate and 2026-09-24 remains UNKNOWN.
- Portfolio/Re-add: REDUCED_CONFIRMED -> recovery/re-add research exists; formal promotion remains locked.
- Macro/Cross-market: PIT clocks/residualization/falsification are frozen; repository audit did not prove historical durable global receipts with sessionDate/knownAtTaipei/firstEligibleTaiwanDecision, so outcome testing is DATA_QUALITY_BLOCKED pending prospective receipts.
- Validation: R01-R08/I01-I07, purged holdout, date clustering, redundancy, costs, zero-pick and prospective Shadow controls are cross-cutting requirements.

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
REGISTERED_MODULES = 19
L0/L1/L2/L3/L4/L5 = 0 / 0 / 13 / 5 / 1 / 0
REGISTERED_MODULE_MATURITY = 47.4%
RESEARCH_DEBT_UNITS = 10.0
DATA_QUALITY_BLOCKED = 8
DATA_SOURCE_BLOCKED = 3
WAITING_PROSPECTIVE = 1
FORMAL_OPTIMIZATION_CANDIDATES = 1

Important: 48.2% is the maturity of the currently reconciled 17 durable modules, NOT "48.8% of all stock-market knowledge". The inventory is still expanding and module splits must be independently falsifiable.

Optimization bridge is mandatory: once a research finding passes applicable positive+counterevidence, PIT/OOS, independent-date, regime, redundancy/incremental-value, cost, coverage/zero-pick and overfit gates and could improve after-market selection, it must be surfaced as a FORMAL_OPTIMIZATION_CANDIDATE for owner review. It may not self-promote to Formal.

Next master-map task: continue reconciliation of remaining domains/submodules, especially volatility-regime, institutional/crowding and macro/cross-market; continue trend/momentum/reversal from its new dedicated lane; do not inflate counts by treating sequential checkpoint IDs as separate modules.


## Formal optimization candidates

### HISTORY_SOURCE_REVALIDATION_V2.3 — Class B
Status: FORMAL_OPTIMIZATION_CANDIDATE / OWNER REVIEW REQUIRED / NOT MERGED / NOT DEPLOYED.

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

Owner approval is required before any Class-B Worker/runtime integration, merge or deployment.
