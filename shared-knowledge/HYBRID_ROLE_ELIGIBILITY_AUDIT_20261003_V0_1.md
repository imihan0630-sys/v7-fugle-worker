# Hybrid Role Eligibility Audit 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: GOVERNANCE_ROLE_AUDIT_COMPLETE / ROLE_ELIGIBILITY_OVERLAY_FROZEN
Scope: 22 domains / 354 curriculum modules
Formal Core impact: NONE

## Purpose

Implement the governance side of Hybrid role consistency without pretending that every research module is an independent stock-selection vote.

The five canonical decision roles remain:
1. HARD_INVALIDATION（硬否決）
2. PRIMARY_ALPHA（主要超額報酬證據）
3. SUPPORTIVE（輔助證據）
4. CONTEXT_ONLY（僅情境）
5. CONFIDENCE／UNCERTAINTY（信心／不確定性）

This audit adds a separate concept:

**Role Eligibility（角色資格） != Actual Strategy Role（實際策略角色）**

Role eligibility says what a module is allowed to become after specialist validation.
It does not activate that role, change production behavior, or replace the System 1 A2 gate-role inventory.

## Global firewalls

- New knowledge remains RESEARCH_ONLY until strategy/horizon-specific validation.
- A useful predictor is not automatically a HARD_INVALIDATION rule.
- A data-quality/provenance module is not PRIMARY_ALPHA merely because it improves reliability.
- Execution, sizing and portfolio-risk modules do not create a second stock thesis.
- Macro/Regime evidence is CONTEXT_ONLY by default unless an explicit strategy validates primary use.
- Behavioral/governance narratives require independent observables; price/flow/accounting symptoms do not identify motive.
- One primitive evidence receipt cannot become multiple independent votes through downstream transformations.
- UNKNOWN != FAIL and UNKNOWN != 0.
- Formal Core remains unchanged.

## Domain default eligibility

| Domain | Default eligible roles | Forbidden automatic use | Governance note |
|---|---|---|---|
| D01 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE | NO_AUTO_HARD_GATE | Price structure may support strategy-specific alpha after PIT/OOS; data/session semantics are confidence primitives. |
| D02 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE | NO_AUTO_HARD_GATE | Price-volume evidence may support alpha; proxy/intent narratives require identifiability and redundancy controls. |
| D03 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE | NO_AUTO_HARD_GATE | Trend/momentum/reversal indicators are candidate evidence, not automatic reject rules. |
| D04 | CONTEXT / SUPPORTIVE / CONFIDENCE; STRATEGY_SPECIFIC_PRIMARY_ALLOWED | NO_GENERIC_STOCK_HARD_GATE | Volatility mainly changes distribution, risk, sizing or regime; strategy-specific alpha requires separate proof. |
| D05 | EXECUTION_CONFIDENCE / CONTEXT; STRATEGY_SPECIFIC_PRIMARY_ALLOWED | HARD_ONLY_FACTUAL_NON_EXECUTABILITY | Microstructure may affect fill/risk; only factual orderability/tradability failures may become hard. |
| D06 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE / CONTEXT | NO_DIRECTIONAL_HARD_GATE_BY_DEFAULT | Flow/position data require motive/causality controls; crowding and lending are not automatically directional. |
| D07 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE / CONFIDENCE | NO_AUTO_HARD_GATE_EXCEPT_PIT_DATA_FAILURE | Fundamentals may be primary for suitable strategies; data vintage/availability are confidence/PIT safeguards. |
| D08 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE / CONTEXT / CONFIDENCE | NO_AUTO_HARD_GATE | Valuation is strategy/horizon dependent; undefined/negative denominators usually create uncertainty, not automatic rejection. |
| D09 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE / CONTEXT | NO_AUTO_HARD_GATE | Industry/breadth/rotation may be primary or context depending strategy; taxonomy is not alpha itself. |
| D10 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE / CONTEXT | NO_AUTO_HARD_GATE_EXCEPT_PIT_DATA_FAILURE | Supply-chain transmission requires issuer exposure bridge; event clocks/provenance are safeguards. |
| D11 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE / CONTEXT; HARD_SAFEGUARD_ELIGIBLE | HARD_ONLY_CONTINUITY_TRADABILITY_OR_RISK_AUTHORITY | Corporate actions/events may be alpha/context; continuity breaks, suspension/orderability and unresolved reference adjustments can be hard safeguards. |
| D12 | CONTEXT / SUPPORTIVE; STRATEGY_SPECIFIC_PRIMARY_ALLOWED / CONFIDENCE | NO_GENERIC_STOCK_HARD_GATE | Derivatives state is usually market/strategy context; derivatives-specific strategies may validate primary use. |
| D13 | CONTEXT_ONLY_DEFAULT; STRATEGY_SPECIFIC_PRIMARY_ALLOWED | NO_GENERIC_STOCK_HARD_GATE | Macro/cross-market evidence changes priors/regime by default; primary use requires an explicit macro strategy. |
| D14 | EXECUTION / CONFIDENCE / HARD_SAFEGUARD_ELIGIBLE | NOT_STOCK_SELECTION_ALPHA_BY_DEFAULT | Execution cost/orderability modules act after or around selection; hard only for factual non-executability/risk authority. |
| D15 | PORTFOLIO_RISK / SIZING / CONTEXT / CONFIDENCE | NOT_STOCK_SELECTION_ALPHA_BY_DEFAULT | Portfolio construction, sizing and risk do not create an independent stock thesis. |
| D16 | CONFIDENCE / UNCERTAINTY / VALIDATION_GOVERNANCE | NOT_PRIMARY_ALPHA | Validation/provenance/calibration determine trust and decision quality; they do not themselves create stock alpha. |
| D17 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE / CONTEXT / CONFIDENCE | NO_AUTO_HARD_GATE_EXCEPT_SOURCE_PIT_FAILURE | Event/news evidence may be primary; source quality and clocks remain separate confidence safeguards. |
| D18 | CONTEXT_ONLY / STRATEGY_ACTIVATION / CONFIDENCE | NOT_STOCK_LEVEL_PRIMARY_ALPHA_BY_DEFAULT | Regime modules condition strategy use, not individual-stock votes unless separately validated. |
| D19 | PRIMARY_ALPHA_CANDIDATE / SUPPORTIVE | NO_AUTO_HARD_GATE | Factor/anomaly families can be primary only after redundancy, PIT, OOS, cost and capacity proof. |
| D20 | RESEARCH_ONLY_DEFAULT -> SUPPORTIVE/CONTEXT_IF_IDENTIFIABLE | NO_HARD_GATE / NO_PRIMARY_ALPHA_WITHOUT_IDENTIFIABILITY | Behavioral stories require independent proxies and structural counterfactuals; observed price/flow alone is insufficient. |
| D21 | CONTEXT / CONFIDENCE / TAIL_RISK; LONG_HORIZON_PRIMARY_ONLY_IF_VALIDATED | NO_SHORT_TERM_DIRECTIONAL_HARD_GATE | Governance affects confidence/tail risk by default; stock-selection alpha requires independent long-horizon validation. |
| D22 | CONTEXT / SUPPORTIVE / CONFIDENCE; CREDIT_STRATEGY_PRIMARY_ALLOWED | HARD_ONLY_FACTUAL_CREDIT_OR_RISK_AUTHORITY_EVENT | Credit evidence may be primary in credit-sensitive strategies; generic equity rejection is not automatic. |

## High-risk exception groups

### R01_DATA_INTEGRITY_AND_PIT
Modules: D01-01, D02-01, D05-10, D07-08, D07-10, D09-01, D10-10, D11-08, D11-12, D11-13, D13-13, D16-01, D16-11, D16-13, D16-14, D16-15, D17-01, D17-02, D17-09, D17-10

Allowed eligibility:
- `CONFIDENCE_UNCERTAINTY`
- `HARD_INVALIDATION_IF_FACTUAL_PIT_SOURCE_REPLAY_FAILURE`

Forbidden automatic use:
- `PRIMARY_ALPHA_FROM_DATA_QUALITY_ITSELF`

Source/provenance/clock/replay quality controls trust. They do not earn alpha because they are complete.

### R02_EXECUTION_AND_ORDERABILITY
Modules: D05-01, D05-02, D05-03, D05-04, D05-06, D05-07, D05-08, D05-09, D05-13, D11-07, D11-11, D14-01, D14-02, D14-03, D14-04, D14-05, D14-06, D14-07, D14-08, D14-09, D14-10, D14-11, D14-14, D14-15, D14-16, D14-17, D14-18, D14-19

Allowed eligibility:
- `EXECUTION_CONFIDENCE`
- `CONTEXT`
- `HARD_INVALIDATION_IF_FACTUAL_NON_EXECUTABILITY_OR_EXPLICIT_RISK_AUTHORITY`

Forbidden automatic use:
- `GENERIC_STOCK_SELECTION_ALPHA`
- `DIRECTIONAL_VOTE_FROM_COST_ALONE`

Execution affects whether/how to trade a valid thesis. It is not a separate stock thesis.

### R03_PORTFOLIO_RISK_AND_SIZING
Modules: D04-08, D04-09, D15-01, D15-02, D15-03, D15-04, D15-05, D15-06, D15-07, D15-08, D15-09, D15-10, D15-11, D15-12, D15-13, D15-14, D15-15, D15-16, D15-19, D15-21, D15-22, D15-23, D15-24

Allowed eligibility:
- `PORTFOLIO_RISK`
- `SIZING`
- `CONTEXT`
- `CONFIDENCE`
- `HARD_INVALIDATION_IF_EXPLICIT_PORTFOLIO_RISK_AUTHORITY_BREACH`

Forbidden automatic use:
- `INDEPENDENT_STOCK_ALPHA_FROM_SIZING_OR_ATTRIBUTION`

Risk/sizing/attribution governs exposure after evidence; it cannot create a second alpha vote from the same thesis.

### R04_MACRO_AND_REGIME
Modules: D13-01, D13-02, D13-03, D13-04, D13-05, D13-06, D13-07, D13-08, D13-09, D13-10, D13-11, D13-12, D13-14, D13-15, D13-16, D13-17, D13-18, D13-19, D18-01, D18-02, D18-03, D18-04, D18-05, D18-06, D18-07, D18-08, D18-09, D18-10, D18-11, D18-12, D18-13, D18-14, D18-15

Allowed eligibility:
- `CONTEXT_ONLY_DEFAULT`
- `STRATEGY_ACTIVATION`
- `CONFIDENCE`
- `PRIMARY_ALPHA_ONLY_FOR_EXPLICIT_MACRO_OR_REGIME_STRATEGY_AFTER_VALIDATION`

Forbidden automatic use:
- `GENERIC_STOCK_LEVEL_PASS_FAIL`

Macro/regime evidence changes priors and strategy effectiveness; it is not a universal stock veto.

### R05_BEHAVIORAL_AND_GOVERNANCE_IDENTIFIABILITY
Modules: D20-01, D20-02, D20-03, D20-04, D20-05, D20-06, D20-07, D20-08, D20-09, D20-10, D20-11, D20-12, D20-13, D21-01, D21-02, D21-03, D21-04, D21-05, D21-07, D21-09, D21-10, D21-11, D21-12, D21-13

Allowed eligibility:
- `RESEARCH_ONLY_DEFAULT`
- `SUPPORTIVE`
- `CONTEXT`
- `CONFIDENCE`
- `TAIL_RISK`
- `LONG_HORIZON_PRIMARY_IF_INDEPENDENTLY_VALIDATED`

Forbidden automatic use:
- `HARD_GATE_FROM_NARRATIVE_ONLY`
- `PRIMARY_ALPHA_FROM_UNIDENTIFIED_PROXY`

Behavior/governance claims need distinct observables and falsification; price/flow/accounting symptoms alone cannot identify motive.

### R06_FLOW_LENDING_AND_CROWDING
Modules: D06-05, D06-06, D06-07, D06-08, D06-09, D06-10, D06-11, D06-13, D06-14, D06-15, D06-16, D06-18, D19-11, D20-06, D20-13, D14-19

Allowed eligibility:
- `PRIMARY_ALPHA_CANDIDATE_IF_VALIDATED`
- `SUPPORTIVE`
- `CONTEXT`
- `CONFIDENCE`
- `EXECUTION_FEASIBILITY`

Forbidden automatic use:
- `DIRECTIONAL_HARD_GATE_FROM_FLOW_OR_BORROW_STATE_ALONE`
- `MULTIPLE_VOTES_FROM_ONE_POSITION_OR_LENDING_RECEIPT`

Flow/borrow/crowding may carry information, but intent and causal interpretation are not automatic.

### R07_EVENT_CONTINUITY_AND_CORPORATE_ACTIONS
Modules: D11-01, D11-02, D11-03, D11-04, D11-05, D11-06, D11-07, D11-10, D11-11, D11-12, D11-14, D11-15, D11-16, D11-17, D11-18, D11-19

Allowed eligibility:
- `PRIMARY_ALPHA_CANDIDATE`
- `SUPPORTIVE`
- `CONTEXT`
- `HARD_INVALIDATION_IF_REFERENCE_CONTINUITY_TRADABILITY_OR_EXIT_FEASIBILITY_FAILS`

Forbidden automatic use:
- `HARD_GATE_FROM_EVENT_LABEL_ALONE`

The event can be informative, but only factual continuity/tradability/risk failures are eligible for hard invalidation.

### R08_VALIDATION_AND_DECISION_ARCHITECTURE
Modules: D16-02, D16-03, D16-04, D16-05, D16-06, D16-07, D16-08, D16-09, D16-10, D16-12, D16-16, D16-17, D16-18, D16-19, D16-20, D16-21, D16-22, D16-23, D16-24, D16-25

Allowed eligibility:
- `VALIDATION`
- `CONFIDENCE_UNCERTAINTY`
- `DECISION_POLICY_FOR_D16_25`

Forbidden automatic use:
- `PRIMARY_ALPHA_FROM_METHOD_COMPLEXITY`
- `HARD_GATE_FROM_MODEL_COMPLEXITY`

Statistical/model sophistication is not alpha. D16-25 combines evidence but does not manufacture independent evidence.


## Hard-invalidation burden of proof

A curriculum module is eligible for HARD_INVALIDATION only when the state is factual, strategy-relevant and safety/authority critical, such as:
- source/PIT/replay failure;
- instrument/order not executable under the strategy contract;
- unresolved corporate-action/reference-price continuity;
- factual suspension/exit impossibility;
- explicit portfolio/account risk-authority breach;
- required short position not establishable/maintainable.

The following are **not** sufficient by themselves:
- weak technical signal;
- negative macro context;
- expensive valuation;
- institutional selling;
- high borrow activity;
- bearish sentiment;
- poor governance score;
- low confidence in a supportive feature.

## Primary-alpha burden of proof

PRIMARY_ALPHA requires:
- explicit strategy and horizon;
- PIT/replay;
- OOS/prospective evidence;
- cost/fill feasibility;
- redundancy control;
- multi-Regime review;
- calibrated uncertainty where applicable;
- incremental value versus simpler baseline.

A module may be mature as knowledge while still not qualify as PRIMARY_ALPHA.

## Role conflicts identified

1. **Execution-to-alpha leakage risk** — D05/D14 evidence can accidentally become stock-selection votes even when it only explains fill/cost.
2. **Sizing-to-alpha leakage risk** — D15 sizing/risk/attribution can accidentally reward a thesis twice.
3. **Macro-to-hard-gate risk** — D13/D18 can become universal pass/fail filters and compound zero-pick.
4. **Behavioral narrative duplication** — D20 can relabel D03/D06/D17 observables as psychology without independent evidence.
5. **Governance narrative duplication** — D21 can relabel D07/D11 evidence without distinct control/governance observables.
6. **Flow/borrow directional overreach** — D06/D14/D20 shorting/crowding data can be counted repeatedly or interpreted as motive.
7. **Validation-method alpha leakage** — D16 model sophistication/calibration can be mistaken for predictive evidence.
8. **Corporate-action overblocking** — D11 event existence must not become hard rejection unless continuity/tradability/risk authority is actually affected.

## System 1 boundary

This audit does **not** classify current production gates.
System 1 Track A2 must still re-read the actual Formal gate definitions and map each current gate independently.
This curriculum overlay is a guardrail: it constrains what kinds of roles a gate/evidence source may reasonably claim during Shadow experiments.

## System 2 boundary

Each strategy must choose a small strategy-specific subset of PRIMARY_ALPHA families.
The 354-module curriculum is a knowledge universe, not 354 votes.
Modules outside the strategy's primary evidence contract remain supportive/context/confidence/research-only as appropriate.

## Current result

- 22 domain default eligibility rules frozen.
- 8 high-risk exception groups frozen.
- No module maturity changed.
- No module count changed.
- No production gate changed.
- Formal Core remains LOCKED.
