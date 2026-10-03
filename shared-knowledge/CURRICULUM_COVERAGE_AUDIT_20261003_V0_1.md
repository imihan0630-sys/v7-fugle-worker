# Curriculum Coverage Audit 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: FIRST_PASS_COVERAGE_GAP_REGISTRY / NO_MODULE_ADDITION_EXECUTED
Scope: 22 domains / 354 active modules
Formal Core impact: NONE

## Purpose

Return the research program to the learning-map mainline.

Previous rounds primarily asked:
- what is duplicated;
- what should merge/retire;
- who owns overlapping semantics.

This audit asks a different question:

**What important knowledge family is not explicitly owned by the current active curriculum, or is only partially owned because an existing module's scope is too narrow?**

No module is added by this V0.1 audit.

## Coverage classifications

- `ACTIVE_CURRICULUM_OWNER_GAP` — knowledge/research exists, but no active curriculum module clearly owns it.
- `TRUE_GAP_CANDIDATE` — important knowledge family appears absent and may deserve a new module after specialist validation.
- `SCOPE_EXTENSION_CANDIDATE` — knowledge is adjacent to an existing module and should probably be absorbed by scope expansion rather than module-count growth.
- `NOT_A_GAP` — already adequately owned elsewhere.
- `NEW_DOMAIN_CANDIDATE` — cannot be cleanly owned by any of the 22 domains.

## First-pass result

- High-confidence gap/extension candidates: **12**
- Immediate module additions: **0**
- Immediate new-domain additions: **0**
- Current judgment: **no 23rd domain is justified yet**.

The dominant pattern is not "the map is missing whole fields".
It is:
1. some mature research exists outside the active curriculum owner map;
2. some active modules are too narrowly named/scoped;
3. a smaller number of genuinely missing knowledge families remain.

## Candidate registry

| ID | Domain | Candidate | Class | Priority | First-pass proposal |
|---|---|---|---|---|---|
| COV-01 | D01 | Continuation / Base Pattern Family | ACTIVE_CURRICULUM_OWNER_GAP | HIGH | Evaluate a new umbrella owner or explicit expansion of D01-07/D01-05; do not create separate modules per named pattern. |
| COV-02 | D05 | Closing Auction / Auction Imbalance | SCOPE_EXTENSION_CANDIDATE | HIGH | Prefer expanding D05-06 to Opening/Closing Auction & Auction Imbalance rather than adding a new module. |
| COV-03 | D06 | Retail / Individual Investor Flow | TRUE_GAP_CANDIDATE | MEDIUM | Validate Taiwan observability first; if only residual-from-total proxy is available, keep research-only and do not infer motive. |
| COV-04 | D07 | Dividend / Payout Policy & Sustainability | TRUE_GAP_CANDIDATE | HIGH | Candidate new D07 fundamental module; event mechanics remain D11 and governance capital allocation remains D21. |
| COV-05 | D08 | Sales-based / Enterprise Multiples | SCOPE_EXTENSION_CANDIDATE | MEDIUM | Prefer broadening D08-06 or D08-02 into enterprise/sales multiples rather than a standalone module unless sector-specific evidence demands it. |
| COV-06 | D10 | Supply-chain Network Centrality / Single-point Failure / Resilience | SCOPE_EXTENSION_CANDIDATE | HIGH | Likely extend D10-01/D10-12; new module only if network topology has distinct data/decision contract. |
| COV-07 | D12 | Futures Term Structure / Calendar Spread / Roll Yield | TRUE_GAP_CANDIDATE | HIGH | Candidate new derivatives module if Taiwan futures historical curve data and replay contract are feasible. |
| COV-08 | D16 | Dependence-aware Resampling / Block Bootstrap | SCOPE_EXTENSION_CANDIDATE | MEDIUM | Absorb into D16-06 Independent-Date/Date-cluster Inference rather than create a new module. |
| COV-09 | D19 | Multi-factor Benchmark Models | SCOPE_EXTENSION_CANDIDATE | MEDIUM | Extend D19-01 and/or D19-10; avoid duplicate standalone factor-model module unless benchmark construction has distinct validation needs. |
| COV-10 | D20 | Confirmation Bias / Belief Perseverance / Conservatism | TRUE_GAP_CANDIDATE | HIGH | Prefer one umbrella belief-updating-bias module rather than separate confirmation/conservatism modules. |
| COV-11 | D21 | Shareholder Rights / Stewardship / Activism / Voting | TRUE_GAP_CANDIDATE | HIGH | Candidate governance module; keep event-specific tender/proxy mechanics outside if owned by D11. |
| COV-12 | D22 | Debt Seniority / Collateral / Recovery Waterfall | SCOPE_EXTENSION_CANDIDATE | HIGH | Prefer extending D22-12 Distress/Recovery and D22-07 Covenant/Default; add a new module only if instrument-level capital-structure data justifies it. |

## Candidate details

### COV-01 — D01 — Continuation / Base Pattern Family

**Class:** `ACTIVE_CURRICULUM_OWNER_GAP`  
**Priority:** HIGH

Evidence:
Flag/Pennant/Triangle/Wedge/Platform/High Tight Flag already appear in pattern governance/System2 research, but no active D01 module owns the family.

First-pass governance proposal:
Evaluate a new umbrella owner or explicit expansion of D01-07/D01-05; do not create separate modules per named pattern.

No curriculum change is executed in this audit.

### COV-02 — D05 — Closing Auction / Auction Imbalance

**Class:** `SCOPE_EXTENSION_CANDIDATE`  
**Priority:** HIGH

Evidence:
Microstructure research explicitly separates opening/closing auction, but active curriculum only names D05-06 opening auction.

First-pass governance proposal:
Prefer expanding D05-06 to Opening/Closing Auction & Auction Imbalance rather than adding a new module.

No curriculum change is executed in this audit.

### COV-03 — D06 — Retail / Individual Investor Flow

**Class:** `TRUE_GAP_CANDIDATE`  
**Priority:** MEDIUM

Evidence:
Institutional, margin, lending, branch and ETF flows are covered, but retail/individual investor flow or residual retail order imbalance has no explicit owner.

First-pass governance proposal:
Validate Taiwan observability first; if only residual-from-total proxy is available, keep research-only and do not infer motive.

No curriculum change is executed in this audit.

### COV-04 — D07 — Dividend / Payout Policy & Sustainability

**Class:** `TRUE_GAP_CANDIDATE`  
**Priority:** HIGH

Evidence:
Dividend event mechanics exist in D11 and capital allocation in D21, but payout ratio, dividend sustainability, payout policy and earnings/cash-flow coverage have no explicit fundamental owner.

First-pass governance proposal:
Candidate new D07 fundamental module; event mechanics remain D11 and governance capital allocation remains D21.

No curriculum change is executed in this audit.

### COV-05 — D08 — Sales-based / Enterprise Multiples

**Class:** `SCOPE_EXTENSION_CANDIDATE`  
**Priority:** MEDIUM

Evidence:
PE/PB, EV/EBITDA, FCF yield, DCF and peers exist; P/S and EV/Sales are not explicit.

First-pass governance proposal:
Prefer broadening D08-06 or D08-02 into enterprise/sales multiples rather than a standalone module unless sector-specific evidence demands it.

No curriculum change is executed in this audit.

### COV-06 — D10 — Supply-chain Network Centrality / Single-point Failure / Resilience

**Class:** `SCOPE_EXTENSION_CANDIDATE`  
**Priority:** HIGH

Evidence:
Supply-chain map, asymmetry and issuer exposure exist, but network criticality, alternate sourcing, single-point-of-failure and resilience are not explicit.

First-pass governance proposal:
Likely extend D10-01/D10-12; new module only if network topology has distinct data/decision contract.

No curriculum change is executed in this audit.

### COV-07 — D12 — Futures Term Structure / Calendar Spread / Roll Yield

**Class:** `TRUE_GAP_CANDIDATE`  
**Priority:** HIGH

Evidence:
Basis, OI, expiry and options term structure are covered, but futures curve/calendar-spread/roll-yield economics have no explicit owner.

First-pass governance proposal:
Candidate new derivatives module if Taiwan futures historical curve data and replay contract are feasible.

No curriculum change is executed in this audit.

### COV-08 — D16 — Dependence-aware Resampling / Block Bootstrap

**Class:** `SCOPE_EXTENSION_CANDIDATE`  
**Priority:** MEDIUM

Evidence:
Stationary/block bootstrap already exists in D16 promotion-gate research but has no explicit curriculum owner.

First-pass governance proposal:
Absorb into D16-06 Independent-Date/Date-cluster Inference rather than create a new module.

No curriculum change is executed in this audit.

### COV-09 — D19 — Multi-factor Benchmark Models

**Class:** `SCOPE_EXTENSION_CANDIDATE`  
**Priority:** MEDIUM

Evidence:
CAPM/Beta/Alpha and factor exposure exist, but Fama-French/Carhart/q-style multifactor benchmark construction is not explicit.

First-pass governance proposal:
Extend D19-01 and/or D19-10; avoid duplicate standalone factor-model module unless benchmark construction has distinct validation needs.

No curriculum change is executed in this audit.

### COV-10 — D20 — Confirmation Bias / Belief Perseverance / Conservatism

**Class:** `TRUE_GAP_CANDIDATE`  
**Priority:** HIGH

Evidence:
Prospect theory, disposition, overconfidence, anchoring, representativeness, herding and attention are covered; biased belief updating/confirmation is not.

First-pass governance proposal:
Prefer one umbrella belief-updating-bias module rather than separate confirmation/conservatism modules.

No curriculum change is executed in this audit.

### COV-11 — D21 — Shareholder Rights / Stewardship / Activism / Voting

**Class:** `TRUE_GAP_CANDIDATE`  
**Priority:** HIGH

Evidence:
Ownership, board, insiders, pledging, RPT and minority-shareholder risk are covered, but shareholder rights, proxy voting, stewardship and activism have no explicit owner.

First-pass governance proposal:
Candidate governance module; keep event-specific tender/proxy mechanics outside if owned by D11.

No curriculum change is executed in this audit.

### COV-12 — D22 — Debt Seniority / Collateral / Recovery Waterfall

**Class:** `SCOPE_EXTENSION_CANDIDATE`  
**Priority:** HIGH

Evidence:
Covenant/default, capital structure and distress/recovery exist, but security priority, collateral and recovery waterfall are not explicit.

First-pass governance proposal:
Prefer extending D22-12 Distress/Recovery and D22-07 Covenant/Default; add a new module only if instrument-level capital-structure data justifies it.

No curriculum change is executed in this audit.


## Important false-gap findings

### Named chart patterns
Flag/Pennant/Triangle/Wedge are not absent from the project knowledge base:
they already exist in named-pattern governance and System2 technical-structure research.

The gap is **active curriculum ownership**, not research absence.

Therefore the wrong fix would be to create one new module for every named pattern.
The correct validation question is whether a single continuation/base-pattern umbrella owner is needed.

### Closing auction
Closing-auction contamination is already recognized in microstructure research.
The gap is that D05-06 names only the opening auction.
This strongly favors scope extension over a new module.

### Block bootstrap
Dependence-aware resampling already exists in D16 promotion-gate research.
The gap is curriculum indexing/ownership.
This strongly favors absorption into D16-06.

## No-new-domain finding

At this first pass, every identified candidate can still be owned by one of the existing 22 domains.

A new 23rd domain should be considered only if:
- at least one coherent knowledge family cannot be naturally owned by any current domain;
- that family has multiple independent modules;
- it has distinct sources/methods/decision roles;
- placing it inside an existing domain would create repeated routing or semantic conflicts.

None of the current first-pass candidates satisfies that burden yet.

## Validation order

### Coverage-A — high priority
1. COV-01 D01 continuation/base pattern owner.
2. COV-02 D05 closing auction scope.
3. COV-04 D07 dividend/payout sustainability.
4. COV-06 D10 supply-chain resilience/network criticality.
5. COV-07 D12 futures curve/roll yield.
6. COV-10 D20 belief-updating biases.
7. COV-11 D21 shareholder rights/stewardship.
8. COV-12 D22 debt priority/collateral/recovery waterfall.

### Coverage-B — medium priority
9. COV-03 D06 retail flow observability.
10. COV-05 D08 sales-based multiples.
11. COV-08 D16 dependence-aware resampling indexing.
12. COV-09 D19 multifactor benchmark models.

## Specialist validation packet minimum

Before adding or renaming any module, the owner room must return:
1. exact knowledge definition;
2. existing-module overlap matrix;
3. why current scope is insufficient;
4. source/data feasibility in Taiwan;
5. PIT/replay implications;
6. whether the knowledge is explanatory, validation-only, context, or strategy evidence;
7. recommended action:
   - ADD_MODULE;
   - EXTEND_EXISTING_SCOPE;
   - MERGE_INTO_EXISTING;
   - NOT_A_GAP;
   - EVIDENCE_INSUFFICIENT;
8. proposed owner room;
9. anti-double-count rule;
10. maturity starting point (normally L0).

## Current mainline decision

Do not increase the 354-module count yet.

Next:
- route Coverage-A candidates to specialist rooms;
- validate scope ownership first;
- only then update the learning map atomically.

Current curriculum remains:
**22 domains / 354 active modules**.
