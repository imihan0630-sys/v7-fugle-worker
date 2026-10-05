# SDA-022 Acceptance Oracle V0.1

Updated: 2026-10-06 Asia/Taipei
Status: PRE_OUTCOME_BLOCKING_ORACLE_FROZEN
Owner: 00｜研究總控／稽核
Scope: System 1 / System 2 cross-system policy independence
Formal Core impact: NONE
Outcomes: CLOSED

Parent authorities:
- shared-knowledge/SYSTEM1_SYSTEM2_NON_CONVERGENCE_GUARD_V0_1.md
- shared-knowledge/CROSS_SYSTEM_POLICY_FINGERPRINT_CONTRACT_V0_1.md
- shared-knowledge/SYSTEM1_SYSTEM2_POLICY_FINGERPRINT_BASELINE_20261006_V0_1.md
- shared-knowledge/SDA022_D16_VALIDATION_REQUEST_V0_1.md

## Purpose

Freeze a deterministic blocking oracle before runtime fingerprints, NC-T01 and cross-system outcomes exist.

Passing this oracle means:
- the independence audit is observable enough to begin prospective comparison.

It does NOT mean:
- System1 and System2 are economically independent;
- System2 adds incremental Alpha;
- overlap is diversification;
- Formal integration is authorized.

## Section A — System1 fingerprint integrity

### S22-T01
A System1 fingerprint receipt exists and has:
- systemId = SYSTEM1;
- policyId / policyVersion;
- decision clock;
- source artifacts and immutable digests.

Fail if missing.

### S22-T02
System1 fingerprint records:
- candidateUniverseMode;
- hard-gate identities/families;
- ranking policy;
- capacity policy;
- entry-confirmation policy;
- lifecycle policy.

Fail if represented only by a free-text description.

### S22-T03
System1 fingerprint explicitly states whether System2 candidates/ranks are required.

Expected under current architecture:
- requiresSystem2Candidates = false;
- requiresSystem2Rank = false.

Any true value is an architecture mutation requiring explicit owner review.

### S22-T04
System1 effective ranking identity matches the current effective Formal comparator source/version.

A stale raw Worker expression cannot silently override the guarded effective comparator.

### S22-T05
System1 fingerprint generation is observability-only:
- no A/B mutation;
- no Top6/3+3 mutation;
- no 15m mutation;
- no capital/lifecycle mutation.

## Section B — System2 fingerprint integrity

### S22-T06
Each audited System2 strategy has its own:
- strategyId;
- strategyVersion;
- policy fingerprint hash;
- horizon;
- evidence-family roles;
- ranking identity;
- candidate-universe dependency state.

### S22-T07
SHORT_MOMENTUM and SWING_GROWTH remain separate fingerprints.

Fail if both collapse into one universal cross-strategy score without an explicitly versioned, owner-reviewed architecture mutation.

### S22-T08
System2 capacity fingerprint preserves:
- global max 12;
- per-strategy active-monitor max 3;
- no forced fill;
- no implicit global universal score.

### S22-T09
System2 fingerprint explicitly states whether System1 Top6/candidates/rank are required.

Architecture baseline expectation:
- System1 Top6/rank are not prerequisites.

### S22-T10
If System2 runtime cannot prove its candidate source, state is NOT_PHYSICALLY_PROVEN / UNKNOWN.

Do not promote design text into physical independence.

## Section C — NC-T01 physical independence

### S22-T11
NC-T01 fixture/run removes System1 Top6 and System1 rank inputs.

Shared raw source receipts may remain.

### S22-T12
No hidden fallback may reconstruct System1 Top6/rank through:
- cached API response;
- persisted System1 selected list;
- alias table;
- cross-project handoff;
- stale shared state.

### S22-T13
At least one System2 strategy candidate-generation path remains executable when its own required inputs are READY.

Pass does not require a non-empty pick on every date.

### S22-T14
A legitimate zero-pick result is distinguishable from:
- missing upstream data;
- System1 dependency;
- runtime failure;
- capacity unresolved state.

### S22-T15
NC-T01 receipt binds:
- exact source generation/version;
- strategy contract/version;
- decision timestamp;
- candidate-universe provenance;
- result hash.

### S22-T16
NC-T01 cannot be satisfied by synthetic strategy output alone if the claim is physical production/shadow independence.

Synthetic fixtures may test contracts but cannot upgrade physicalIndependentDiscovery.

## Section D — same-pick / divergence semantics

### S22-T17
Same symbol selected by both systems is labeled OVERLAP, not TWO_INDEPENDENT_CONFIRMATIONS by default.

### S22-T18
Different symbol sets are labeled DIVERGENCE, not DIVERSIFICATION by default.

### S22-T19
Every divergence reason uses a frozen taxonomy:
- DIFFERENT_OBJECTIVE;
- DIFFERENT_HORIZON;
- DIFFERENT_UNIVERSE;
- DIFFERENT_HARD_GATE;
- DIFFERENT_EVIDENCE_FAMILY;
- DIFFERENT_REGIME_OR_ENTRY_STATE;
- UNKNOWN_OR_MISSINGNESS;
- CAPACITY_OR_LIFECYCLE;
- OTHER_VERSIONED_REASON.

### S22-T20
Forced disagreement is prohibited.

No strategy may reject an otherwise valid candidate solely to lower overlap.

## Section E — overlap observability

### S22-T21
Comparable-date receipt preserves:
- both fingerprint hashes;
- universe sizes;
- selected sets;
- UNKNOWN/missing denominators;
- shared information roots;
- shared hard-gate families.

### S22-T22
selectedSetJaccard is only computed when both selected-set denominators are semantically comparable.

### S22-T23
Rank correlation is only computed on true common support and only when rank semantics are meaningfully comparable.

System1 Formal comparator vs an unranked System2 strategy cannot receive a fabricated correlation.

### S22-T24
Shared-information-root ratio does not treat aliases/derived deterministic transforms as independent roots.

SDA-001/004 lineage governs the root count.

## Section F — D16 preregistration boundary

### S22-T25
Before economic outcomes are opened, D16 preregistration exists for:
- target/horizon;
- common support;
- dependence handling;
- multiple comparisons;
- missingness/admission;
- overlap/System1-only/System2-only groups.

### S22-T26
System2 strategies are analyzed separately unless D16 preregisters a justified combined estimand.

### S22-T27
SHORT_MOMENTUM receives an explicit dependence analysis vs System1 because it is the highest frozen structural-overlap surface.

### S22-T28
No diversification / double-confirmation / incremental-value claim is allowed before D16 outcome analysis and 00 readback.

## Oracle result states

Allowed:
- PASS_PRE_OUTCOME_OBSERVABILITY
- PARTIAL_PASS
- BLOCKED_MISSING_SYSTEM1_FINGERPRINT
- BLOCKED_MISSING_SYSTEM2_FINGERPRINT
- BLOCKED_NC_T01_NOT_PHYSICAL
- BLOCKED_HIDDEN_CROSS_SYSTEM_DEPENDENCY
- BLOCKED_COMMON_SUPPORT
- BLOCKED_D16_PREREGISTRATION
- ARCHITECTURE_MUTATION_OWNER_REVIEW_REQUIRED
- EVIDENCE_NOT_YET_AVAILABLE

## Current expected state

At oracle freeze time:
- System1 runtime/research fingerprint receipt: PENDING;
- System2 per-strategy runtime/research fingerprints: PENDING;
- NC-T01 physical receipt: PENDING;
- D16 preregistration: REQUESTED / NOT YET RETURNED;
- outcomes: CLOSED.

Therefore current expected oracle result:
EVIDENCE_NOT_YET_AVAILABLE.

## Closure boundary

Passing S22-T01~T28 does not close SDA-022.

It only opens the legitimate prospective evidence phase.

SDA-022 closure still requires:
- prospective overlap/divergence receipts;
- D16 dependence/incrementality result;
- independent 00 readback.

No Formal behavior change is authorized by this oracle.
