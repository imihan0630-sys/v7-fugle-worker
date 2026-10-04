# COV-03 Intake / Dependency / Overlap / Anti-orphan Audit 2026-10-04 V0.1

Status: OWNER_APPROVAL_REQUIRED
Candidate: COV-03
Domain: D06
Specialist room: 05｜法人與籌碼研究室
Structural recommendation: ADD_MODULE
Proposed new module: D06-19 Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）
Formal Core impact: NONE
System1 / System2 Formal impact: NONE
Canonical curriculum mutation in this audit: NONE

## Audit basis

00｜研究總控室 re-read latest main and the current canonical tracker before this audit.

Primary inputs:
- `research/COV03_D06_SPECIALIST_RETURN_V0_1.md`
- `research/cov03_retail_individual_investor_flow_specialist_return_v0_1.md`
- `research/cov03_retail_individual_investor_flow_specialist_return_v0_1.json`
- `shared-knowledge/CURRICULUM_COVERAGE_B_SPECIALIST_VALIDATION_PACKETS_20261003_V0_1.md`
- `shared-knowledge/CURRICULUM_COVERAGE_GOVERNANCE_STATE_MACHINE_V0_1.md`
- `research/stock_market_learning_tracker_v0_1.json`
- `shared-knowledge/CURRICULUM_RETIREMENT_AND_CAPABILITY_LEDGER_V0_1.md`

Audit-time canonical tracker:
- domains: 22
- active modules: 355
- D06 modules: 17
- D06 maturity: 48.2%
- overall weighted maturity observed before this audit: 43.5%

This audit does not claim that those percentages remain fixed after concurrent rooms continue.

## 1. Intake contract result

Result: **RETURN_ACCEPTED_FOR_INTAKE**

The canonical Markdown return contains:
1. exact knowledge definition;
2. overlap matrix;
3. current-scope insufficiency;
4. Taiwan data feasibility;
5. PIT/replay implication;
6. decision role;
7. anti-double-count rule;
8. proposed owner;
9. maturity starting point;
10. exactly one terminal recommendation: `ADD_MODULE`.

It also includes source, overlap and counterevidence tables and preserves UNKNOWN when stock-level domestic-natural-person direction is not observed.

### Maturity conflict normalization

A supporting JSON and an earlier supporting Markdown propose L1/20%, while the canonical return `research/COV03_D06_SPECIALIST_RETURN_V0_1.md` explicitly proposes **L0/0%**.

Governance rule: a new module normally starts at L0 unless separately justified and owner-approved.

Therefore this audit resolves the conflict fail-closed:
- proposed canonical starting maturity = **L0 / 0%**;
- the L1/20% supporting value is treated as stale/non-authoritative for structural execution;
- no maturity is inherited from D06-07/10/13/14;
- no maturity change occurs before owner approval and atomic canonical update.

This normalization is sufficient for Intake and does not require rewriting the specialist evidence artifact.

## 2. Dependency Audit

Result: **PASS**

Required dependencies and their boundaries:

### D06-07 融資
Owns leverage / financing stock-flow.
Does not identify all natural persons and cannot own direct retail identity.

### D06-10 TDCC 集保股權分散
Owns holding-size distribution and TDCC vintage semantics.
Does not infer investor identity or directional flow from size brackets.

### D06-13 券商分點
Owns broker/branch execution routing and concentration.
Branch identity is not beneficial-owner identity.

### D06-14 當沖
Owns intraday turnover / day-trade participation.
High day-trade activity is not direct natural-person identity or direction.

### D06-01～04 institutional flow
Own institutional investor-class primitives.
`total - institutions` is forbidden as a substitute for direct retail flow.

### D20 behavioral modules
May consume direct-retail receipts for herding, attention, disposition or other behavioral transforms.
D20 does not own the underlying investor-class market-data primitive and may not duplicate it as an independent vote.

No missing prerequisite requires a counterpart return before the curriculum owner can be established. The missing stock×date domestic-natural-person directional feed is a future research/data gate, not a prerequisite to owning the knowledge family at L0.

## 3. Overlap recheck

Result: **ADD_MODULE SURVIVES**

The candidate cannot be cleanly absorbed without damaging existing semantics:

- Extending D06-07 would incorrectly make a leverage module responsible for non-leveraged natural-person participation/ownership/flow.
- Extending D06-10 would mix holding-size distribution with legal investor-class identity and transaction direction.
- Extending D06-13 would conflate execution intermediary with beneficial owner.
- Extending D06-14 would conflate turnover channel with investor identity.
- Absorbing into D20 would move a market-data primitive into a behavioral-mechanism domain and encourage motive inference from proxy data.

A separate D06 owner is therefore justified, but its initial scope must be conservative:
- directly identified natural-person participation;
- directly identified natural-person ownership;
- channel-specific natural-person activity;
- direct directional flow only when the source truly provides it;
- explicit source-gap / UNKNOWN for domestic stock×date direction.

The module is not a directional Alpha signal by existence alone.

## 4. Anti-double-count result

Result: **PASS WITH HARD FIREWALL**

One underlying observation can be represented once as a primitive investor-class receipt.

Forbidden duplicate votes:
- margin financing relabeled as retail flow;
- day-trading rate relabeled as retail flow;
- odd-lot activity relabeled as whole-market retail flow;
- broker branch relabeled as retail/large-investor identity;
- total-market minus institution arithmetic relabeled as retail;
- the same direct-retail receipt counted once in D06 and again independently in D20.

Allowed downstream use:
- D20 behavioral transform linked to the same primitive receipt;
- D06 crowding / liquidity context consuming the receipt as a dependency;
- proxy-validation studies comparing margin/day-trade/branch/odd-lot measures against direct investor-class data.

## 5. Anti-orphan review

Result: **PASS**

Adding the new owner does not orphan or obsolete existing capabilities:
- D06-07 remains leverage owner;
- D06-10 remains holding-size distribution owner;
- D06-13 remains broker/branch execution owner;
- D06-14 remains day-trade/turnover owner;
- D20 remains behavioral interpretation owner.

No current Formal/runtime/API/UI capability is identified as depending on a future COV-03 module ID.

The retired identifier D06-17 is not reusable. It was absorbed into D06-16 and remains part of the retirement/capability history.

Proposed new identifier if approved: **D06-19**.
Repository search at audit time found no current D06-19 collision.

## 6. Taiwan data / evidence boundary

The specialist evidence supports:
- direct natural-person observability at market level;
- direct natural-person observability in selected transaction channels;
- direct natural-person ownership statistics.

It does **not** establish:
- broad domestic natural-person stock×date buy/sell/net direction;
- full historical firstKnownAt for every source;
- prospective OOS/Shadow stock-selection value.

Therefore the new module, if approved:
- starts L0/0;
- primary role initially = context / validation / supportive;
- direct stock-level direction remains UNKNOWN until a true source contract exists;
- no strategy evidence or Formal promotion follows from module creation.

## 7. Structural recommendation

COV-03 survives formal Intake, Dependency Audit, overlap recheck, anti-double-count review and anti-orphan review.

Decision state:
**OWNER_APPROVAL_REQUIRED**

Proposed atomic action if the owner approves:
1. create D06-19 `Retail / Individual Investor Participation & Flow（散戶／自然人參與與流向）`;
2. start at L0 / 0%;
3. encode the proxy-identity firewall and UNKNOWN stock-direction semantics in learningScope;
4. update tracker, Shared Master, Router and Coverage registries atomically;
5. recompute aggregate / D06 maturity from the expanded denominator;
6. keep Formal Core and System1/System2 Formal behavior unchanged.

No structural change is executed by this audit.

## Exact next action

Wait for explicit owner approval of **COV-03 ADD_MODULE as D06-19 at L0/0**.

If approved, perform the atomic canonical update and verify all cross-files against latest main before and after write.

COV-12 remains pending without a formal specialist return and must not be inferred or advanced from this audit.
