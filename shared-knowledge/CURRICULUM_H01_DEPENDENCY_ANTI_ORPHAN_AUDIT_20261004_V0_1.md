# H01 Dependency / Anti-orphan / Scope-Dedup Audit 2026-10-04 V0.1

Status: OWNER_APPROVAL_REQUIRED
Cluster: H01
Modules: D09-13 <-> D09-14
Specialist room: 07｜產業與供應鏈研究室
Specialist terminal classification: KEEP_SEPARATE
00-room governance disposition: KEEP_SEPARATE + SCOPE_DEDUP_ONLY
Formal Core impact: NONE
Curriculum count impact: NONE
Maturity impact: NONE

## Audit basis

00｜研究總控室 re-read latest main and the current canonical tracker before this audit.

Primary inputs:
- `shared-knowledge/CURRICULUM_H01_H04_CONSOLIDATION_ACCEPTANCE_CONTRACT_20261003_V0_1.md`
- `research/h01_d09_13_d09_14_specialist_validation_20261003_v0_1.json`
- `research/br051_taiwan_foundry_industry_structure_pit_v0_1.json`
- `research/br052_issuer_competitive_action_pit_v0_1.json`
- `research/br053_taiwan_steel_industry_structure_control_v0_1.json`
- `research/br054_cross_industry_competitive_action_failure_control_v0_1.json`
- `research/br055_taiwan_pcb_industry_structure_control_v0_1.json`
- `research/br056_strategic_action_native_outcome_contract_v0_1.json`
- `research/br057_pcb_abf_issuer_exposure_denominator_firewall_v0_1.json`
- `research/br058_prospective_strategic_action_cohort_v0_1.json`
- `research/stock_market_learning_tracker_v0_1.json`

Current canonical maturity:
- D09-13 = L3 / 60%
- D09-14 = L3 / 60%

This audit does not alter either maturity.

## 1. Acceptance-contract result

Result: **KEEP_SEPARATE PASSES**

D09-14 proved a distinct contract that would be lost by merging it into D09-13.

The decisive separation is unit-of-analysis and clock identity:

- D09-13 = **industry × explicit product/geographic market definition × vintage**.
- D09-14 = **issuer × observable strategic action × implementation stage × vintage**.

D09-14 has unique action-lifecycle observables:
- actionType;
- announcementAt;
- commitment / boardApprovalAt when observable;
- implementationStage;
- target product / technology / geography;
- counterparty / partner / acquisition target;
- competitorResponseAt;
- post-action share / capacity / product-position change with a separate clock.

Three valid divergent-state families are preserved:
1. attractive industry / weak firm execution;
2. unattractive industry / strong firm execution;
3. stable industry structure / changing firm strategic action.

Therefore strict semantic subsumption fails and merge/retirement is rejected.

## 2. Dependency Audit

Result: **PASS**

### D09-13 industry-structure owner

Owns:
- rivalry / competition intensity;
- market-share level / distribution;
- entry barriers;
- substitution threat;
- supplier/customer bargaining power;
- industry capacity / price / margin structure;
- effective-dated market definition.

Primary source families:
- industry association / regulator statistics;
- effective-dated market definitions;
- industry capacity/output/pricing data;
- issuer disclosures only as constituent evidence, not sole industry truth.

### D09-14 firm-strategic-action owner

Owns:
- issuer-specific strategic action identity;
- implementation lifecycle;
- capacity preemption;
- product / technology-node positioning;
- alliance / M&A / partnership actions;
- vertical integration;
- competitor response;
- attributable post-action firm-position change.

Primary source families:
- issuer filings / annual reports / releases;
- MOPS material disclosures;
- transaction / alliance / capacity implementation receipts;
- industry data only as post-action context.

### D10 dependency

D10 owns physical supply-chain, capacity and bottleneck transmission.
D09-14 may consume D10 receipts but cannot recast the same physical capacity observation as a second independent Alpha vote.

### D11 / D17 dependency

D11 / D17 own dated event/news identity and transmission clocks.
D09-14 owns the issuer strategic-action lifecycle built from those events.
The event receipt is referenced, not duplicated.

### D07 dependency

D07 may supply company fundamentals and economic consequences.
D09-14 does not own accounting earnings/margin primitives.

No missing counterpart is required to preserve the H01 split.

## 3. Overlap recheck

Result: **KEEP_SEPARATE, BUT CURRENT WORDING IS TOO DUPLICATIVE**

The current tracker wording is materially overlapping:
- D09-13 and D09-14 both currently mention industry structure, rivalry, entry barriers, substitution and market-share change.
- That wording can falsely imply two owners and two votes for the same observation.

The specialist evidence resolves the overlap, but canonical names/scopes have not yet been cleaned up.

### Proposed D09-13 canonical wording

Proposed name:
**Industry Structure／Competitive Dynamics／Porter Five Forces（產業結構／競爭動態／波特五力）**

Scope:
- industry-level structural state;
- market-share level/distribution;
- rivalry;
- entry barriers;
- substitution;
- supplier/customer bargaining power;
- industry capacity/price/margin structure;
- explicit market-definition vintage.

### Proposed D09-14 canonical wording

Proposed name:
**Firm Competitive Strategy／Strategic Actions（公司競爭策略／策略行動）**

Scope:
- observable issuer-specific strategic actions;
- announcement → commitment → implementation → outcome-stage lifecycle;
- capacity preemption;
- product/technology/geography positioning;
- alliance/M&A/vertical integration;
- competitor responses;
- attributable post-action position/share change.

Market-share level, entry barriers and substitution remain D09-13 parent evidence.
A D09-14 post-action share change is allowed only as a linked outcome attributable to a documented firm action; it is not a second simultaneous market-share factor.

## 4. Anti-double-count result

Result: **PASS WITH SHARED-PARENT FIREWALL**

One market-share, capacity, price, margin, customer or supplier observation has one parent evidence receipt.

Rules:
- D09-13 owns structural state.
- D09-14 becomes independently informative only when actor-specific action lifecycle fields exist.
- If no firm-specific action field exists, the observation belongs only to D09-13.
- D09-14 may link a post-action change as an outcome, not cast a second vote from the same parent row.
- D10 physical-capacity evidence and D11/D17 event clocks remain single-source dependencies.

## 5. Anti-orphan review

Result: **PASS**

Specialist repository inventory found:
- no standalone Production/runtime dependency on D09-14 ID;
- no standalone API/UI/replay dependency requiring the old broad D09-14 name;
- existing BR-050/052/056/058 firm-action semantics remain addressable under D09-14;
- D09-13 BR-049/051/053/055/057 structure capabilities remain preserved.

Keeping both IDs with narrowed boundaries loses no capability and removes narrative duplication.

## 6. Maturity firewall

Result: **PASS / NO CHANGE**

- D09-13 remains L3 / 60%.
- D09-14 remains L3 / 60%.
- The H01 overlap audit itself adds no maturity.
- Scope clarification does not create new L3 evidence.
- Future L4 requires independent prospective/OOS evidence under each distinct scope.

## 7. Governance decision

H01 terminal classification:
**KEEP_SEPARATE**

Canonical action proposed:
**SCOPE_DEDUP_ONLY**

No retirement.
No module-count change.
No maturity change.
No Formal Core change.

Because the proposed canonical update changes module names/scope wording and routing semantics, 00 treats it as an owner-review action rather than silently rewriting the curriculum.

Current state:
**OWNER_APPROVAL_REQUIRED**

## Exact owner decision requested

Approve or reject the following atomic scope cleanup:

1. D09-13 rename to:
   `Industry Structure／Competitive Dynamics／Porter Five Forces（產業結構／競爭動態／波特五力）`

2. D09-14 rename to:
   `Firm Competitive Strategy／Strategic Actions（公司競爭策略／策略行動）`

3. Preserve both at L3 / 60%.

4. Canonically freeze:
   - D09-13 = industry structural owner;
   - D09-14 = issuer strategic-action lifecycle owner;
   - shared market-share/capacity/price/margin rows = one parent receipt;
   - D10 / D11 / D17 dependencies cannot become duplicate votes.

If approved, update tracker + Learning Map + Router + Shared Master + H01 registries atomically.
