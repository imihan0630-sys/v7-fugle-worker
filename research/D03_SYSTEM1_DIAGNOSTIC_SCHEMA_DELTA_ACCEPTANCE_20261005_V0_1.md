# D03 System 1 Diagnostic Schema Delta Acceptance V0.1

Updated: 2026-10-05 Asia/Taipei  
Room: 03｜技術指標與趨勢動能研究室  
Classification: Class A research / Shadow readback acceptance  
Tickets: SDA-001, SDA-004  
Reviewed base: merged PR #608  
Formal Core impact: NONE / LOCKED  
Outcome access: CLOSED

## Purpose

Freeze exact acceptance semantics for the three traceability deltas left open by TI-733~740:

1. explicit `redundancyGroupContributions`;
2. explicit `dominantInformationRoots`;
3. stable overlap identities containing `factorId` + `factorVersion` while retaining `signalIndex` only as a local trace aid.

This contract does not reopen already-passed registry pinning, alias handling, connected same-root deduplication, parameter-family guards, PIT fail-closed behavior or the independent-evidence promotion firewall.

## TI-741 — contribution field must be explicit, deterministic and reconcilable

`redundancyGroupContributions` must describe the same connected components used by `dedupedEvidenceFamilyCount`.

For every component it must expose:
- `componentOrdinal` — deterministic ordinal after canonical component sorting;
- `factorRefs` — stable factor references containing factorId, factorVersion and local signalIndex;
- `informationRoots` — unique sorted roots;
- `redundancyGroupIds` — unique sorted group IDs;
- `contribution` — exactly 1 in V0.1.

Required reconciliation:
- array length equals `dedupedEvidenceFamilyCount`;
- sum of `contribution` equals `dedupedShadowScore`;
- every known active signal occurs in exactly one component;
- no inactive, invalid, future-clock or outcome-only signal appears;
- generic legacy `contributions` may remain for compatibility, but it cannot be the only canonical field.

## TI-742 — dominant root semantics are frozen

`dominantInformationRoots` is not a decorative union of every possible registry root.

For each root represented by known active signals:
1. count unique stable active factor references carrying that root;
2. find the maximum active-factor count;
3. emit every root tied at that maximum, sorted lexically;
4. emit an empty array when there are no known active signals;
5. exclude invalid/UNKNOWN/future-clock/outcome-only signals.

This makes “dominant” deterministic and prevents consumer-specific storytelling.

The optional diagnostic detail `informationRootCoverage` should expose:
- `informationRoot`;
- `activeFactorCount`;
- `componentCount`.

The detail is recommended for auditability but cannot change scores.

## TI-743 — stable overlap identity and backward compatibility

Signal indices are local positions, not durable identities. Acceptance requires a stable triple:
- `factorId`;
- `factorVersion`;
- `signalIndex`.

Two compatible migration patterns are allowed:

### Additive V0.1 pattern
- preserve legacy numeric `overlappingSignalIds` for existing readers;
- add canonical `overlappingSignalRefs` containing stable triples;
- label legacy semantics explicitly as local indices.

### Versioned V0.2 pattern
- move numeric values to `overlappingSignalIndices`;
- use `overlappingSignalIds` for canonical factorId + factorVersion identities;
- retain `overlappingSignalRefs` for identity-to-local-index trace.

Either pattern passes only if reordering inputs changes local indices but does not change the set of stable factorId + factorVersion identities.

## TI-744 — permutation invariance is mandatory

Given the same factor/version signals in a different input order:
- `rawSignalCount` is unchanged;
- `dedupedEvidenceFamilyCount` is unchanged;
- `dedupedShadowScore` is unchanged;
- `effectiveIndependentEvidenceCount` remains 0;
- stable overlap identities are unchanged as a set;
- `dominantInformationRoots` is unchanged;
- only local signalIndex values may change.

This is the principal falsifier for the current index-only identity gap.

## TI-745 — missing fields and internally inconsistent aliases fail acceptance

The delta fails when:
- either explicit canonical field is absent;
- `redundancyGroupContributions` disagrees with the connected components;
- contribution sum disagrees with `dedupedShadowScore`;
- dominant roots disagree with active-factor root coverage;
- overlap references omit factorVersion;
- the same stable factor identity appears with conflicting versions;
- invalid/UNKNOWN signals leak into component/root diagnostics;
- adding the fields changes raw/dedup scores, rank, Top6, lifecycle, signal, notification, order or Formal outputs.

Presence of a field name alone is not evidence of completion.

## TI-746 — support, counterevidence and alternative explanation

Support for this delta:
- the merged implementation already computes component roots/groups internally;
- existing generic contributions already preserve most underlying information;
- stable factor/version identity already exists in registry and lineage rows;
- the delta can therefore be additive and research-only.

Counterevidence / risk:
- serializing extra fields can still introduce non-deterministic ordering;
- a misleading “dominant roots” union may pass superficial schema checks;
- keeping only indices creates false cross-receipt continuity;
- changing legacy field types without schema versioning can break consumers.

Alternative explanation:
- current receipts may still count evidence correctly despite incomplete fields.

Decision:
the current gap is traceability/readback debt, not demonstrated evidence inflation. Ticket closure nevertheless requires the debt to be removed because replay and cross-system comparison need stable identities.

## TI-747 — inference and authority boundary

This schema delta does not prove:
- economic superiority;
- independent Alpha;
- outcome validity;
- OOS or walk-forward stability;
- cost-adjusted value;
- production readiness.

The existing firewall remains authoritative:
`effectiveIndependentEvidenceCount=0` and `independentEvidenceStatus=NOT_PROVEN_NO_PROMOTION_PATH`.

Any future positive independent-evidence count requires D16 method/OOS evidence and 00 closure, not a schema patch.

## TI-748 — executable oracle and routing

Companion artifacts:
- `research/d03_system1_diagnostic_schema_delta_cases_20261005_v0_1.json`;
- `research/test_d03_system1_diagnostic_schema_delta_acceptance_v0_1.mjs`.

The oracle checks:
- current generic-only payload is rejected as incomplete;
- complete additive payload passes;
- missing factorVersion fails;
- contribution/count mismatch fails;
- dominant-root mismatch fails;
- unknown-signal leakage fails;
- input permutation preserves stable identities and root semantics;
- protected scores and Formal references remain unchanged.

This is acceptance evidence, not engineering completion.

Current:
- D03 = 56.7%;
- D03-09 = L2 / 40%;
- D03-10 = L2 / 40%;
- `SYSTEM1_DIAGNOSTIC_SCHEMA_DELTAS = SPEC_FROZEN_IMPLEMENTATION_PENDING`;
- `FIRST_GENUINE_SYSTEM1_SDA_RECEIPT = PENDING`;
- outcomes = CLOSED;
- `FORMAL_OPTIMIZATION_CANDIDATE = NONE`;
- Formal Core remains LOCKED.

## Exact next continuation point

1. System 1 Class A owner implements the three additive/versioned diagnostic fields and runs this oracle.
2. D03 revalidates only TI-738/TI-739 deltas; already-passed TI-733~737 logic must not be reworked.
3. After schema PASS, wait for the first genuine-session receipt with verified parent/lineage input.
4. System 2, D16 and 00 lanes remain independently pending.
5. Protected PR #600/Bollinger/ADX path is unchanged.

