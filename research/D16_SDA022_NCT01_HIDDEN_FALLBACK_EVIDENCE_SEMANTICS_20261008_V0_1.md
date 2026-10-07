# D16 SDA-022 NC-T01 Hidden-Fallback Evidence Semantics 2026-10-08 V0.1

Updated: 2026-10-08 Asia/Taipei
Status: RESEARCH_ONLY / CORR005_ACCEPTANCE_SEMANTICS_FROZEN / PHYSICAL_PASS_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Audit family: SDA-022
Correction: S2-CORR-20261007-005
Formal Core impact: NONE

## Purpose

Freeze the evidence standard required before System2 SHORT_MOMENTUM may be called a physically independent discovery path under NC-T01.

The central rule is:

`ABSENCE_OF_AUDIT_EVIDENCE != EVIDENCE_OF_ABSENCE`.

A missing hidden-fallback audit may not be coerced to five boolean false values.

## 1. The five forbidden selection-dependency dimensions

Physical NC-T01 must explicitly audit at least:

1. cached System1 selection fallback;
2. persisted System1 selection fallback;
3. alias/compatibility fallback that resolves to System1 selection;
4. cross-project/System1 selection import;
5. stale prior System1 selection reuse.

Each dimension is ternary:

- PROVEN_ABSENT;
- PRESENT;
- UNKNOWN.

Missing field / non-boolean / unaudited path => UNKNOWN.

Only PROVEN_ABSENT may serialize to the semantic meaning "false dependency".

## 2. Result-classification matrix

### Any PRESENT

Result:
`HIDDEN_SYSTEM1_DEPENDENCY`.

Physical independence fails.

### No PRESENT but one or more UNKNOWN

Result:
`EVIDENCE_INCOMPLETE`.

Physical independence remains unproven.

### All five PROVEN_ABSENT

Still not enough by itself.

The claim becomes eligible only when the audit evidence itself is immutable, exact-head bound and covers the transitive execution path actually used by the physical run.

## 3. Structural audit vs runtime evidence

A strong NC-T01 claim requires two distinct layers.

### A. Structural/transitive-path audit

Must prove on the exact runner head:
- entrypoint identity;
- all transitive modules in the bounded System2 execution path;
- imports/dynamic dispatch/config aliases relevant to selection retrieval;
- no reachable System1 Top6/rank/cached-selection/persisted-selection accessor;
- no compatibility alias that resolves to those forbidden sources.

Output:
`hiddenFallbackAuditDigest`.

### B. Runtime no-access evidence

The physical run should also preserve:
- exact runner head / source manifest;
- forbidden-source access counters or equivalent machine evidence;
- all counters observed zero;
- System1 Top6/rank inputs unavailable by construction;
- no environment/config override activates a forbidden path.

Static code absence and runtime no-access answer different questions.
Neither should silently substitute for the other.

## 4. Audit completeness identity

The machine audit must bind at least:

- auditVersion;
- runnerEntryPoint;
- runnerHeadSha;
- transitiveManifestHash;
- forbiddenSourceFamilyVersion;
- auditedFile/blob identities;
- dynamicResolutionPolicy;
- auditGeneratedAt;
- auditResult;
- per-dimension disposition;
- auditDigest.

If the transitive source set changes:
the previous audit cannot be reused without exact digest equivalence.

## 5. Receipt binding

Preferred minimal typed source-generation ref:

`HIDDEN_FALLBACK_AUDIT_SHA256:<digest>`.

For `PHYSICALLY_INDEPENDENT_PATH_OBSERVED`:

- the typed audit digest is mandatory;
- the digest must resolve to the exact physical-run source manifest;
- all five dimensions must be PROVEN_ABSENT;
- runtime no-access evidence must be present;
- receiptHash must depend on the audit digest.

Changing only the hidden-fallback audit digest must change the final NC-T01 receiptHash.

## 6. Shared data is allowed; selection dependence is not

SDA-022 does not require System1 and System2 to use different raw market data.

Allowed shared roots can include:
- official A1 prices;
- PIT history;
- company/exchange identity;
- common source clocks;
- shared corporate-action/continuity infrastructure;
- D01-D22 research primitives.

Forbidden dependence is decision-policy dependence such as:
- System1 Top6;
- Formal rank/order;
- Formal A/B gate result used as candidate admission;
- cached/persisted System1 selected set;
- stale System1 candidate list;
- aliases that resolve to those objects.

The audit must distinguish shared raw evidence from shared selection authority.

## 7. Output coincidence is not dependence

If both systems independently select the same symbol:

`SAME_OUTPUT != HIDDEN_DEPENDENCY`.

Conversely:

`DIFFERENT_OUTPUT != PROOF_OF_INDEPENDENCE`.

Independence is established by provenance and policy lineage, not by whether the selected names differ.

## 8. Hidden-fallback audit is necessary but not sufficient for SDA-022

Even a perfect NC-T01 physical independence receipt proves only:
System2 can execute one strategy path without System1 selection fallback.

It does not prove:
- predictive incrementality;
- low dependence of outcomes;
- diversification benefit;
- economic superiority;
- robustness across regimes.

Those later claims remain D16-SDA022-01 prospective/common-support work.

## 9. Required regressions for CORR-005

### HF-T01 missing audit object
Expected: EVIDENCE_INCOMPLETE.

### HF-T02 one missing dimension
Expected: EVIDENCE_INCOMPLETE.

### HF-T03 any dimension PRESENT
Expected: HIDDEN_SYSTEM1_DEPENDENCY.

### HF-T04 all dimensions marked absent but no audit digest
Expected: EVIDENCE_INCOMPLETE.

### HF-T05 audit digest present but transitive-manifest mismatch
Expected: EVIDENCE_INCOMPLETE.

### HF-T06 audit digest changes
Expected: final receiptHash changes.

### HF-T07 code head changes after audit
Expected: prior audit cannot satisfy exact-head physical PASS unless manifest/blob equivalence is independently proven.

### HF-T08 runtime forbidden-source access counter non-zero
Expected: HIDDEN_SYSTEM1_DEPENDENCY.

### HF-T09 static audit clean but runtime evidence missing
Expected: EVIDENCE_INCOMPLETE.

### HF-T10 runtime no-access clean but structural audit missing
Expected: EVIDENCE_INCOMPLETE.

### HF-T11 shared raw source used by both systems
Expected: allowed if no selection-authority dependency exists.

### HF-T12 same symbol selected by both systems
Expected: not a failure by itself; later dependence/incrementality analysis required.

## 10. D16 implications

### D16-11 provenance

A boolean field is not provenance.
The audit origin/version/digest must be preserved.

### D16-14 generation alignment

Physical strategy-generation identity must bind the exact System2 policy fingerprint, runner head and hidden-fallback audit.

### D16-07 redundancy / SDA-022

NC-T01 is a lineage-independence prerequisite, not a residual information test.

### D16-03 / prospective OOS

Only after physical independence exists should synchronized System1/System2 prospective outcome pairs be admitted to cross-system incrementality analysis.

## 11. Maturity impact

No maturity change from design/repair alone.

D16-14 remains L3/60.
D16 overall remains 60%.

Promotion requires physical artifact evidence, not a corrected unit-test-only runner.

## Exact next

1. Observe CORR-005 implementation on BUILD_LANE.
2. Verify all missing audit states fail closed.
3. Verify machine audit digest covers the exact physical transitive path and is bound into NC-T01 receiptHash.
4. Verify runtime no-access evidence.
5. Combine with the first real hash-bound CLEAR_NO_ACTION receipt.
6. Only then assess S22-T11~T16 physical independence.
