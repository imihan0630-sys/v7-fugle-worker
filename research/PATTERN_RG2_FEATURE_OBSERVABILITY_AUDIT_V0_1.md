# D01 DL-016 — PATTERN-RG2 Feature Observability / Canonicalization Audit V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / DESIGN_REPAIRED / RUNTIME_NO_GO / OUTCOME_CLOSED

## Finding 1 — relation helper vs shared-child field-name mismatch

Legacy research helper `research/pattern_rg2_relation_v0_1.mjs` emits:
- geometryState;
- compoundState.

Shared-child v0.3 requires:
- geometryRelationState;
- compoundLifecycleState.

Promotion-grade join using v0.1 output names would therefore be ambiguous or missing.

Repair:
- new `research/pattern_rg2_relation_v0_2.mjs` emits canonical shared-child names;
- v0.1 remains historical prototype only.

## Finding 2 — parentZoneAgeEligibleSessions missing from shared-child v0.3

RG2 nested-resistance spec has always required parentZoneAgeEligibleSessions.

DL-015 RG2_CORE_V0_1 also preregisters parentZoneAgeEligibleSessions.

But shared-child v0.3 did not include it in requiredRg2Provenance.

Repair:
`research/pattern_shared_child_contract_v0_4.json` adds:
- parentZoneAgeEligibleSessions;
- parentSourceWindowStart / End;
- complete local/parent coordinates needed to audit the structural fingerprint;
- liquidityReceiptRef_if_used for B0_FULL_CONTEXT.

## Finding 3 — v0.3 omitted auditable coordinates from the explicit RG2 payload list

Fingerprint semantics say immutable local/parent coordinates are identity-bound.

However v0.3 requiredRg2Provenance did not explicitly require localLower/localUpper/parentLower/parentUpper/parentCenter.

Relying only on a fingerprint without preserving the canonical coordinates weakens human/debug/replay auditability.

v0.4 restores explicit coordinates.

## Finding 4 — legacy alias availableAirPct remains non-canonical

Old observer design contains availableAirPct.

RG2 v0.1+ canonical geometry defines availableAirToParentLowerPct with exact numerator/denominator.

Therefore:
- availableAirPct = legacy / semantically underspecified;
- availableAirToParentLowerPct = canonical.

No automatic alias conversion is allowed unless an exact historical formula/version proves equivalence.

## RG2_CORE_V0_1 observability after design repair

availableAirToParentLowerPct:
DESIGN_CALCULABLE / V0_4_CANONICAL / RUNTIME_NOT_IMPLEMENTED.

geometryRelationState:
V0_2_HELPER_CANONICAL / V0_4_SCHEMA_CANONICAL / RUNTIME_NOT_IMPLEMENTED.

compoundLifecycleState:
V0_2_HELPER_CANONICAL / V0_4_SCHEMA_CANONICAL / RUNTIME_NOT_IMPLEMENTED.

parentZoneAgeEligibleSessions:
V0_2_PROVENANCE_REQUIRED / V0_4_SCHEMA_CANONICAL / RUNTIME_NOT_IMPLEMENTED.

Therefore:
RG2_CORE_V0_1 = DESIGN_OBSERVABLE / PROSPECTIVE_RUNTIME_BLOCKED.

## B0_FULL_CONTEXT observability

Shared-child v0.4 can reference:
- D02 price-volume receipt;
- regime receipt;
- round-price control receipt;
- liquidity receipt.

This only fixes the schema reference boundary.

It does NOT prove those canonical receipts exist for every future parent/date.

Missing referenced evidence remains UNKNOWN / common-support blocked.

## Runtime conclusion

No observer schedule, D1 table, Worker route or production persistence exists for the v0.4 Pattern child contract.

Thus:
PATTERN_RG2_OUTCOME_JOIN = CLOSED.
RG2_CORE_RUNTIME = NO_GO.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Keep relation helper v0.2 and shared-child v0.4 as research design only.
2. Add DL-015/016 findings to D01 checkpoint/research/shared handoff.
3. Open a Class-A PR and run Formal-isolation CI.
4. Do not request Class-B runtime wiring while immutable parent / continuity / session / storage sizing gates remain incomplete.
5. Research-specific Node tests remain pending unless a reproducible execution path becomes available.