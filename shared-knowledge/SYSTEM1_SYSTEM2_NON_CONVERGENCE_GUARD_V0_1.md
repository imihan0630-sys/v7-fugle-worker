# System 1 / System 2 Non-Convergence Guard V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CANONICAL_CROSS_SYSTEM_ARCHITECTURE_GUARD
Owner: 00｜研究總控／稽核
Formal Core impact: NONE
Scope: System 1 + System 2 across all related ChatGPT projects/rooms that use this repository/shared bootstrap

## Problem

System 1 and System 2 may legitimately share:
- market data;
- D01-D22 research knowledge;
- PIT/source-vintage/provenance;
- factor lineage;
- anti-double-count rules;
- D16 validation infrastructure;
- common source adapters/receipts when semantically identical.

They must NOT silently converge into the same selection policy while being presented as two independent systems.

False independence occurs when two systems:
- use nearly identical candidate-generation gates;
- rank with the same effective information families;
- inherit the same hard filters and thresholds;
- select from the same upstream list without independent discovery;
- produce the same decisions because one is effectively a wrapper around the other;
- are then treated as independent confirmation/diversification.

## Current canonical distinction

### System 1
Protected V8/Formal architecture:
- A/B logic;
- Top6;
- 3+3 pool semantics;
- locked Formal ranking/gates;
- 15-minute Formal confirmation semantics;
- protected capital and BUY/ADD/REDUCE/SELL/STOP lifecycle;
- Production selection/push behavior.

System 1 research work may build Shadow challengers, but Formal behavior changes require owner approval.

### System 2
Separate multi-strategy decision platform:
- no requirement to use System1 A/B;
- no requirement to use Top6/3+3;
- global candidate/watch pool max 12 unique symbols;
- per-strategy active-monitor max 3;
- no forced filling;
- persistent candidate lifecycle;
- strategy-local ranking;
- no universal cross-strategy numeric score by default;
- multiple strategy memberships remain separate;
- SHORT_MOMENTUM baseline uses TECHNICAL_STRUCTURE + PRICE_VOLUME + RISK_FRICTION;
- SWING_GROWTH baseline uses FUNDAMENTAL_QUALITY + INDUSTRY_THESIS;
- Regime, entry-readiness, confluence and displacement are separate preregistered challengers rather than automatic universal weights.

System2 may select independently from a full market or an explicitly authorized candidate universe. It must not depend on System1 Top6/rank output as its only discovery path unless the owner explicitly changes the architecture.

## Allowed sharing

The following sharing does NOT make the systems the same:
- same raw TWSE/TPEx/Fugle/issuer source receipt;
- same D01-D22 semantic contracts;
- same factor primitive with different strategy-specific use;
- same PIT/vintage/UNKNOWN semantics;
- same SDA lineage and holdout-consumption authority;
- same D16 validation logic;
- same risk warning when the underlying fact is genuinely the same.

Shared truth is preferred over duplicated truth.

## Forbidden silent convergence

Without explicit owner approval, System2 must not adopt as prerequisites:
- System1 A/B eligibility;
- System1 Top6/3+3;
- System1 ranking tuple/order;
- System1 capital allocation;
- System1 BUY/ADD/REDUCE/SELL/STOP state machine;
- System1 15-minute Formal confirmation as a universal System2 strategy gate.

Likewise System1 must not silently adopt as Formal rules:
- System2 multi-strategy local rankings;
- System2 max-12/max-3 candidate-capacity mechanics;
- System2 Regime priority;
- System2 confluence/resonance;
- System2 candidate persistence/displacement logic.

Cross-promotion requires separate evidence and owner approval.

## Independence is mechanism, not forced disagreement

The systems are NOT required to choose different stocks.

If both independently select the same stock for valid reasons, that is legitimate convergence.

Therefore:
- low output overlap is not automatically good;
- high output overlap is not automatically bad;
- the audit question is whether the decision pathways are independently specified and whether one system adds incremental decision value beyond the other.

Never force System2 to choose inferior names merely to look different.

## Mandatory cross-system observability

For every comparable decision date, research/audit should be able to report:

1. Universe relationship
- System1 eligible universe;
- System2 strategy universe(s);
- whether System2 discovery depended on System1 output;
- independently discovered System2 names.

2. Policy lineage
- System1 policy/version;
- System2 strategyId/strategyVersion;
- hard-gate lineage;
- ranking-policy lineage;
- information-root sets;
- shared primitive receipts.

3. Output overlap
- selected-symbol overlap;
- Jaccard overlap on comparable candidate sets;
- rank correlation on true common support where meaningful;
- same-direction decisions vs divergent decisions.

4. Divergence attribution
When outputs differ, classify:
- different strategy objective;
- different horizon;
- different universe;
- different hard gate;
- different evidence family;
- different Regime/entry-readiness state;
- UNKNOWN/missing-data divergence;
- capacity/lifecycle difference.

5. Incremental-value test
Compare:
- System1 alone;
- System2 strategy alone;
- overlap subset;
- System1-only picks;
- System2-only picks;
- optional combined decision policy if preregistered.

No claim of diversification or confirmation without dependence-aware D16 analysis.

## Independence adversarial tests

### NC-T01 — System2 without System1 rank
Remove System1 rank/Top6 output while preserving shared raw receipts.
Expected:
System2 strategy-local candidate generation remains executable where its own required inputs are available.

If System2 cannot generate any decision without System1 output, it is not independently selecting.

### NC-T02 — System1 without System2
Remove System2 strategy/Regime/confluence outputs.
Expected:
System1 Formal selection remains unchanged unless an explicitly owner-approved integration exists.

### NC-T03 — shared primitive, different policy
Provide identical primitive evidence to both systems.
Expected:
shared evidence identity is preserved, but decision-policy identity remains system-specific.

### NC-T04 — same stock, independent path
Both systems select the same symbol.
Expected:
audit receipt can show whether the match arose from independent policy paths rather than one consuming the other's result.

### NC-T05 — output divergence is allowed
A symbol passes System1 but fails a System2 strategy, or vice versa.
Expected:
neither system auto-corrects itself to match the other.

### NC-T06 — no pseudo-confirmation
A same-symbol same-source primitive appears in both systems.
Expected:
cross-system reporting must not call this "two independent confirmations" without an incremental/dependence test.

### NC-T07 — strategy identity preservation
SHORT_MOMENTUM and SWING_GROWTH must retain distinct required evidence families and local-ranking semantics.
Expected:
no universal shared score silently replaces them.

### NC-T08 — system-role mutation
Any proposal that imports System1 Formal gates into System2 or System2 strategy gates into System1 Formal must surface as explicit architecture mutation requiring owner approval.

## Cross-system metrics

Track prospectively; do not set arbitrary pass/fail thresholds yet:
- candidateUniverseOverlap;
- selectedSetJaccard;
- commonSupportRankCorrelation;
- sharedInformationRootRatio;
- sharedHardGateRatio;
- system2IndependentDiscoveryRate;
- system1OnlyPickRate;
- system2OnlyPickRate;
- overlapPickRate;
- incrementalNetOutcomeBySourceSystem;
- disagreementOutcomeByReason;
- combinedPolicyIncrementality when preregistered.

Thresholds, if ever used, require preregistration before outcome inspection.

## Closure / promotion rule

System2 is not considered a genuinely independent second selector merely because:
- it has a separate Worker;
- it has a separate D1;
- it has different table names;
- it shows a different UI;
- it includes more factors;
- it adds Regime/resonance on top of System1 candidates.

Independence requires:
- separate decision-policy lineage;
- at least one independently executable candidate-generation path;
- strategy-specific objectives/horizons;
- no hidden dependence on System1 Formal output;
- prospective overlap/divergence receipts;
- D16 incremental/dependence analysis before claiming diversification.

## Current audit verdict

CURRENT_SYSTEMS_IDENTICAL = FALSE.

CURRENT_CONVERGENCE_RISK = MATERIAL.

Primary reason:
- current Formal architectures are meaningfully different;
- however both systems increasingly consume shared research/evidence families and shared validation controls;
- without explicit non-convergence observability, gradual policy convergence could be mistaken for independent confirmation.

No Formal behavior is changed by this guard.


## Cross-project enforcement

This guard applies regardless of which ChatGPT Project contains the build room.

If a System 1 / System 2 / equivalent primary build room restores state from this repository or shared bootstrap, it MUST consume this guard before changing candidate generation, ranking, strategy integration, Regime/confluence use, or cross-system confirmation semantics.

Project boundaries are not architecture boundaries.

Opening System 1 or System 2 in a different ChatGPT Project must not create a second policy fork or bypass SDA-022.

A completely unrelated project that does not read this repository/shared bootstrap cannot be technically forced by this file; such a project must explicitly adopt this bootstrap/governance source before automatic enforcement can be claimed.
