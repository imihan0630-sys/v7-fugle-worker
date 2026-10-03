# Curriculum Coverage Specialist Return Intake Template 2026-10-03 V0.1

Updated: 2026-10-03 22:51 Asia/Taipei
Status: FORMAL_INTAKE_TEMPLATE_READY
Scope: COV specialist returns only.
Canonical curriculum impact: NONE.
Formal Core impact: NONE.

## Purpose

This template standardizes the specialist return required before 00｜研究總控室 may begin formal Intake（收件審查）.

A specialist return is evidence, not a curriculum decision.

The specialist room must not change:
- canonical module count;
- maturity baseline;
- domain count;
- Formal Core;
- System1 / System2 Formal behavior.

## Header

- Candidate ID:
- Domain:
- Specialist room:
- Return artifact path:
- Evidence cutoff:
- Specialist room checkpoint / source artifacts:
- Current candidate class:
- Proposed terminal recommendation:

Allowed terminal recommendation — exactly one:
- `ADD_MODULE`
- `EXTEND_EXISTING_SCOPE`
- `MERGE_INTO_EXISTING`
- `NOT_A_GAP`
- `EVIDENCE_INSUFFICIENT`

## Required 10-field return contract

### 1. Exact Knowledge Definition（精確知識定義）

Define:
- what the knowledge family is;
- what it is not;
- observable unit;
- time horizon;
- decision-time meaning;
- UNKNOWN semantics.

Reject:
- labels without measurable semantics;
- motive inference from price/volume alone;
- current-state backfill into historical dates.

### 2. Existing-module Overlap Matrix（既有模組重疊矩陣）

For every nearby module, state:
- overlapping observable;
- distinct observable;
- shared data source;
- shared decision role;
- double-count risk;
- owner boundary.

Required result:
- exact owner candidate;
- whether the gap can be absorbed;
- whether a new module is necessary.

### 3. Why Current Scope Is Insufficient（現有範圍不足原因）

State the missing capability in operational terms.

Examples:
- no owner;
- owner exists but lacks this observable;
- owner exists but lacks PIT/replay;
- owner exists but combines distinct semantics;
- current capability is descriptive only while required capability is validation/explanatory/contextual.

Do not use “important topic” as sufficient justification.

### 4. Taiwan Data Feasibility（台灣資料可行性）

Required:
- source name;
- source authority;
- market coverage;
- history start if known;
- stock/market/event granularity;
- access mode;
- revision/finality semantics;
- missingness behavior;
- paid/free/access restriction;
- reproducibility limits.

If unavailable:
- state `DATA_UNAVAILABLE` or `ACCESS_BLOCKED`;
- do not synthesize a proxy unless explicitly classified as proxy.

### 5. PIT / Replay Implication（時點一致性／重播影響）

Freeze:
- knownAt;
- effectiveAt if different;
- capturedAt where relevant;
- source vintage;
- revision handling;
- corporate-action/session adjustments;
- historical replay feasibility;
- UNKNOWN behavior.

Historical evidence is not PIT-safe merely because an old date appears in a current webpage.

### 6. Decision Role（決策角色）

Choose one or more, with one primary role:
- explanatory;
- validation;
- context;
- supportive;
- strategy evidence.

State explicitly whether this knowledge:
- may only explain;
- may validate another signal;
- may become a future research feature;
- must never be an independent vote from the same underlying data.

### 7. Anti-double-count Rule（防重複計算規則）

Required:
- duplicated data family;
- duplicated economic mechanism;
- duplicated event;
- duplicated denominator;
- duplicated factor exposure;
- duplicated behavioral interpretation.

Freeze the rule that prevents the same evidence from becoming multiple independent votes.

### 8. Proposed Owner（建議主責）

Specify:
- domain;
- existing module if absorbable;
- new module only if truly necessary;
- counterpart/dependency domains;
- why ownership is not assigned elsewhere.

### 9. Maturity Starting Point（成熟度起點）

If recommending a new module:
- default starting level = L0 unless evidence proves otherwise;
- explain any proposed non-L0 start.

If extending/merging:
- do not automatically inherit maturity;
- identify the exact capability being extended;
- state whether maturity should remain unchanged pending owner audit.

### 10. Terminal Recommendation（終局建議）

Exactly one:
- `ADD_MODULE`
- `EXTEND_EXISTING_SCOPE`
- `MERGE_INTO_EXISTING`
- `NOT_A_GAP`
- `EVIDENCE_INSUFFICIENT`

Required rationale:
- one-paragraph decision;
- strongest positive evidence;
- strongest counterevidence;
- unresolved blocker;
- owner implication.

## Mandatory evidence tables

### A. Source table

| Source | Authority | Granularity | History | first-known semantics | Replay status | Limitation |
|---|---|---|---|---|---|---|

### B. Overlap table

| Existing module | Shared observable | Distinct observable | Shared source | Double-count risk | Owner boundary |
|---|---|---|---|---|---|

### C. Counterevidence table

| Claim | Countermechanism | Falsification test | Current status |
|---|---|---|---|

## 00-room Intake acceptance gates

A return may become `RETURN_ACCEPTED_FOR_INTAKE` only if:

1. all 10 fields are present;
2. terminal recommendation is exactly one allowed value;
3. Taiwan data claims are reproducible or explicitly evidence-insufficient;
4. PIT/replay semantics are explicit;
5. overlap matrix covers all obvious owners;
6. anti-double-count rule is executable;
7. UNKNOWN is not coerced to 0 / BAD / no-event;
8. no historical Shadow evidence is fabricated;
9. structural recommendation does not bypass owner approval;
10. artifact path and evidence cutoff are frozen.

Failure of any mandatory gate:
- keep as `PARTIAL_EVIDENCE_RECEIVED`, or
- return to specialist room for missing fields.

## After Intake acceptance

00｜研究總控室 proceeds:

`RETURN_CONTRACT_COMPLETE`
→ `DEPENDENCY_AUDIT`
→ `OVERLAP_RECHECK`
→ `ANTI_ORPHAN`
→ `OWNER_APPROVAL`
→ `ATOMIC_CANONICAL_UPDATE`

No module-count or maturity change occurs before the final step.

## Canonical invariants at template creation

- Domains: 22
- Active modules: 354
- Maturity baseline: 36.3%
- Formal Core: LOCKED
- System1 impact: NONE
