# Curriculum H01-H04 Consolidation Acceptance Contract 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: OWNER_APPROVED_CONTINUATION / CONSOLIDATION_ACCEPTANCE_CONTRACT_FROZEN
Scope: Third-round hidden-overlap clusters H01-H04
Formal Core impact: NONE
Curriculum count impact: NONE

## Purpose

Freeze the acceptance criteria for the four strongest consolidation candidates before specialist validation returns.

Covered clusters:
- H01: D09-13 <-> D09-14
- H02: D14-03 + D14-04 <-> D14-17
- H03: D15-13 <-> D15-24
- H04: D12-14 <-> D12-15

This contract does not execute any merge or retirement.

Allowed terminal classifications:
- `MERGE_ELIGIBLE`
- `KEEP_SEPARATE`
- `SCOPE_DEDUP_ONLY`
- `EVIDENCE_INSUFFICIENT`

Any actual merge still requires:
1. specialist evidence packet;
2. Dependency Audit（依賴審查）;
3. anti-orphan capability verification;
4. latest-main re-read;
5. explicit owner approval.

## Global consolidation gates

### C1 Strict semantic subsumption
The proposed survivor must explicitly preserve every material theory, observable, formula, failure mode, counterexample and decision use of the retired module.

### C2 Observable/source contract
No unique source family, first-known clock, universe, unit of analysis or replay contract may disappear.

### C3 Decision-role contract
The retiring module must not own a distinct action, state, constraint, confidence channel or policy decision that the survivor cannot represent.

### C4 Incremental-evidence test
If two modules are derived from substantially the same parent observations, the second representation must prove incremental information after redundancy controls or be treated as a child metric rather than an independent vote.

### C5 Falsification preservation
A merge may not erase the ability to distinguish competing mechanisms.

### C6 Capability preservation
Research artifacts, schemas, code, reports, UI explanations, APIs and replay utilities remain addressable under a named surviving owner.

### C7 No hidden Formal change
No merge may alter live selection, ranking, capital, entry/exit, execution, monitoring, signal or notification behavior by itself.

### C8 Routing and naming
The survivor title/scope must accurately cover the absorbed semantics and all specialist routing must be updated atomically.

### C9 Maturity Transfer Firewall
Maturity is **not inherited by max(), average(), or simple carry-forward**.

After an approved merge:
- evidence is mapped to the merged semantic sub-scopes;
- unsupported new semantics remain explicitly immature/UNKNOWN;
- the merged module maturity is recomputed under the normal maturity gate;
- mature child evidence is preserved in the ledger even if the merged umbrella maturity must be lower;
- no L3/L4 claim can be created merely by combining lower-scope evidence.

---

# H01 — D09-13 vs D09-14

## Current state
- D09-13 Industry Structure／Porter Five Forces: L0 / 0%.
- D09-14 Market Share／Entry Barrier／Substitution／Competitive Strategy: L0 / 0%.
- Current learning scopes are materially overlapping.

## Frozen ownership hypothesis
Likely survivor:
**D09-13 Industry Structure／Competitive Dynamics／Porter Five Forces（產業結構／競爭動態／波特五力）**

Proposed child semantics under the survivor:
- rivalry / competition intensity;
- market share and share change;
- entry barriers;
- substitution threat;
- supplier/customer bargaining power;
- industry capacity/price/margin structure;
- competitive strategy evidence only where it is observable at industry/firm interaction level.

## MERGE_ELIGIBLE
H01 becomes merge-eligible if room 07 shows:
1. D09-14 uses the same or strictly subsumed observable families as D09-13.
2. Market share, entry barriers and substitution are already constituent dimensions of the D09-13 industry-structure contract.
3. "Competitive Strategy" does not own a separate firm-level strategic-action state with distinct data and falsification.
4. No runtime, replay or UI capability depends on a standalone D09-14 identity.
5. A single anti-double-count contract can cover industry structure and competitive dynamics.

## KEEP_SEPARATE
Keep D09-14 only if it proves a distinct contract such as:
- longitudinal firm-specific competitive moves rather than static industry structure;
- distinct strategic-action observables;
- a different unit of analysis or decision output;
- a falsification boundary that would be lost inside D09-13.

## Required evidence packet — room 07
- exact concept matrix;
- shared vs unique observable table;
- industry-level vs firm-level unit map;
- static structure vs dynamic strategy examples;
- divergent-state examples;
- proposed survivor wording;
- capability inventory;
- merge/no-merge recommendation.

---

# H02 — D14-03 + D14-04 vs D14-17

## Current state
- D14-03 Signal Price vs Fill Price: L3 / 60%.
- D14-04 Slippage: L2 / 40%.
- D14-17 Implementation Shortfall／Market-impact Cost: L0 / 0%.

## Frozen conceptual hierarchy
- D14-03 = **measurement identity / benchmark anchor**.
- D14-04 = **derived slippage metric family**.
- D14-17 = **broader implementation-shortfall / impact-cost decomposition family**.

These may be one execution-cost ontology rather than three independent curriculum votes.

## Preferred survivor hypothesis
If full consolidation is validated:
**D14-17 Signal-to-Fill／Slippage／Implementation Shortfall／Market-impact Cost（訊號到成交、滑價、執行落差與市場衝擊成本）**

D14-03 and D14-04 survive as named child metrics/capabilities, not deleted knowledge.

## MERGE_ELIGIBLE
Full consolidation is eligible only if room 10 demonstrates:
1. D14-03 has no policy role beyond defining the benchmark/reference identity consumed by cost decomposition.
2. D14-04 is mathematically/operationally a child metric of the D14-17 implementation-cost framework.
3. D14-17 can represent decision price, arrival/signal price, fill price, partial fill, delay cost, explicit cost, spread/slippage, market impact and opportunity cost without semantic loss.
4. Existing D14-03/D14-04 replay and PIT evidence can be preserved as child evidence.
5. D14-12 Execution Alpha attribution remains a downstream consumer and does not become duplicated by the consolidation.

## KEEP_SEPARATE
Keep D14-03 or D14-04 standalone only if either owns:
- a distinct data/replay contract needed independently of implementation shortfall;
- a distinct decision gate or execution state;
- a materially different benchmark definition whose failure must be diagnosed separately.

## Maturity rule specific to H02
If merged:
- D14-17 **does not jump to L3/60%** because D14-03 is L3.
- Mature D14-03 evidence remains tagged to the signal/fill identity child scope.
- D14-04 evidence remains tagged to slippage child scope.
- The broader merged umbrella is promoted only after D14-17-specific implementation-shortfall/impact semantics satisfy the maturity gates.

## Required evidence packet — room 10
- signal-to-fill accounting identity;
- benchmark-price taxonomy;
- cost decomposition equation/tree;
- slippage vs impact vs delay/opportunity-cost separation;
- replay/schema ownership;
- D14-12 downstream interface;
- merged-scope maturity mapping.

---

# H03 — D15-13 vs D15-24

## Current state
- D15-13 Expected Shortfall／Tail Risk: L2 / 40%.
- D15-24 VaR／Parametric-Historical VaR: L0 / 0%.

## Frozen ownership hypothesis
Likely survivor:
**D15-13 VaR／Expected Shortfall／Tail Risk Measures（VaR／期望損失／尾端風險量測）**

Rationale:
VaR and Expected Shortfall are risk-measure methods inside one portfolio tail-risk measurement family; a separate module is justified only if VaR owns a distinct policy/runtime contract.

## MERGE_ELIGIBLE
H03 becomes merge-eligible if room 10 shows:
1. VaR and ES share portfolio, horizon, confidence-level, return/P&L distribution and decision-clock identities.
2. VaR is not used as a standalone risk policy engine distinct from the broader tail-risk module.
3. Parametric and historical VaR can be represented as child methods alongside ES.
4. VaR-specific weaknesses remain explicit: non-subadditivity in some settings, tail blindness beyond the quantile and model/distribution sensitivity.
5. ES-specific semantics remain explicit and are not reduced to "another VaR".
6. Stress testing remains separate under D16-23 and is not falsely absorbed into the tail-risk measure family.

## KEEP_SEPARATE
Keep D15-24 only if VaR owns a distinct operational/regulatory/limit-management contract that cannot be represented as a child metric under D15-13.

## Maturity rule specific to H03
If D15-24 is absorbed into D15-13:
- D15-13's current L2 evidence is preserved for ES/tail-risk semantics.
- VaR sub-scope remains immature until its theory/falsification/data contract is established.
- The expanded umbrella maturity must be recomputed and may not claim VaR maturity from ES evidence.

## Required evidence packet — room 10
- common portfolio/horizon/confidence contract;
- VaR vs ES mathematical/decision-role table;
- parametric/historical simulation assumptions;
- tail-failure counterexamples;
- relationship to D16-23 stress testing;
- proposed merged maturity map.

---

# H04 — D12-14 vs D12-15

## Current state
- D12-14 IV-RV Spread: L2 / 40%.
- D12-15 Volatility Risk Premium: L2 / 40%.
- Existing derivatives research already studies both under one integrated Greeks/VRP/surface semantics framework.

## Frozen semantic hypothesis
Likely survivor:
**D12-15 Volatility Risk Premium／IV-RV Proxies（波動率風險溢酬與 IV-RV 代理）**

Proposed split inside one module:
- economic target: ex-ante variance/volatility risk premium;
- observable approximations: IV-RV spread and related realized/implied measures;
- measurement error / horizon mismatch / jump and liquidity controls.

## MERGE_ELIGIBLE
H04 becomes merge-eligible if room 09 shows:
1. D12-14 is primarily an operational proxy/estimator for the D12-15 economic premium.
2. Both use the same option-chain and realized-volatility parent observations after horizon matching.
3. D12-14 has no independent strategy/action state after controlling for VRP semantics.
4. The merged module can distinguish:
   - ex-ante premium;
   - ex-post realized proxy;
   - variance vs volatility-unit mismatch;
   - horizon/DTE mismatch;
   - jump risk;
   - liquidity/quote-quality contamination.
5. Same parent rows cannot generate two independent Alpha votes.

## KEEP_SEPARATE
Keep both only if:
- D12-14 is a distinct state variable with a unique decision contract;
- D12-15 uses a materially different expectation measure or risk-neutral/physical distribution contract;
- they can produce legitimately divergent states under the same PIT date;
- the distinction has incremental OOS value after costs.

## SCOPE_DEDUP_ONLY
If economic distinction is valid but operational evidence is mostly shared, keep two IDs only with one shared evidence receipt and explicit parent-child linkage, preventing double counting.

## Required evidence packet — room 09
- formal definitions of IV-RV and VRP;
- horizon/unit alignment table;
- risk-neutral vs physical expectation contract;
- same-parent-row lineage;
- divergent-state examples;
- incremental-value design;
- proposed survivor/child metric schema.

---

## Cross-candidate execution sequence

1. Specialist room reads this contract before research.
2. Specialist room returns the required evidence packet.
3. 00｜研究總控室 checks completeness against frozen gates.
4. Dependency Audit verifies all producers/consumers and capabilities.
5. Anti-orphan audit covers data, code, replay, UI, reports and research artifacts.
6. Candidate is classified as `MERGE_ELIGIBLE`, `KEEP_SEPARATE`, `SCOPE_DEDUP_ONLY` or `EVIDENCE_INSUFFICIENT`.
7. Owner receives the evidence-backed proposal.
8. Only explicit owner approval permits retirement/ID removal.
9. Tracker/map/router/ledger are updated atomically after approval.
10. Maturity is recomputed under C9; no automatic inheritance.

## Current state

- H01: acceptance contract frozen; specialist validation pending.
- H02: acceptance contract frozen; specialist validation pending.
- H03: acceptance contract frozen; specialist validation pending.
- H04: acceptance contract frozen; specialist validation pending.
- No retirement executed.
- Curriculum remains 22 domains / 354 modules.
- Formal Core remains LOCKED.
