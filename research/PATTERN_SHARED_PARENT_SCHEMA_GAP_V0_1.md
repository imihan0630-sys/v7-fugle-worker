# D01 DL-011 — Pattern Observer Shared-Parent Schema Gap Audit V0.1

Updated: 2026-10-02 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / SCHEMA_GAP_FROZEN / NO_RUNTIME_WIRING / FORMAL_CORE_LOCKED

## 1. Why this audit exists

The older Pattern observer persistence contract was designed on 2026-09-26 around scan_date, symbol, parent_snapshot_hash, and the legacy trade_research_shadow_candidates parent population.

That design was appropriate for isolated detector/observer QA. Since then, cross-lane research governance has frozen a stronger promotion-grade architecture:

SCAN POPULATION RECEIPT -> IMMUTABLE DECISION-STATE PARENT -> GENERIC EVIDENCE CHILD -> MEMBERSHIP / QUALITY OVERLAYS -> OBSERVER RUN RECEIPT.

Required shared lineage now includes captureGeneration, parentDecisionReceiptId, parentScopeId, certified parentKeysetHash, decisionSetHash, one ROOT attempt per parent, and zero/many deterministic Pattern episode children.

Therefore the old Pattern contract must not be wired unchanged.

## 2. Status of the old contract

research/PATTERN_OBSERVER_PERSISTENCE_V0_1.md is retained as LEGACY_PROTOTYPE_COMPATIBLE, but it is not accepted as PROMOTION_GRADE_PARENT_AUTHORITY.

Still reusable: detectorVersion; semantic-contract versioning; immutable payload hashes; replay/prefix QA; explicit BLOCKED reasons; structural episode de-dup; major-zone lifecycle descriptors; no historical mutation rule.

Superseded parent assumption: existing mutable/bounded Shadow archive as inference-authoritative parent universe.

## 3. Canonical future parent identity

Pattern must inherit the shared immutable parent contract.

Required linkage: parentDecisionReceiptId; captureGeneration; parentScopeId; scanDate; symbol; decisionCutoffAt; parent semanticFingerprint; certified expected parentKeysetHash at run level.

Pattern must not recompute Formal state, reconstruct a historical generation, attach by nearest scanDate/symbol, use current code to rebuild an old parent, or treat legacy parent_snapshot_hash as equivalent to parentDecisionReceiptId.

Legacy parent_snapshot_hash can remain diagnostic lineage for old QA rows.

## 4. ROOT attempt vs episode child

Pattern is a multi-object observer. For every expected parent in one observer run, exactly one evidence_item_key = ROOT attempt row is required.

ROOT answers: Did Pattern attempt this exact parent under this exact generation/scope/version?

ROOT status vocabulary: VALID / CONSTRAINED / BLOCKED / UNKNOWN / NOT_EVALUABLE / QA_FAIL.

Then zero or more deterministic episode rows may exist. Episode child key must derive only from causal structural identity such as pattern family/latent family, scale, immutable confirmed anchor IDs, initial confirmedAt, and detector/semantic version where identity requires it.

Daily maturity evolution does not create a new episode key.

## 5. DL-008 multi-scale fields: schema gap

The old Pattern snapshot JSON does not freeze these as explicit promotion-grade identity/provenance fields:

timeframe; effectiveClockHorizon; barCompletionState; sourceBarsThrough; sessionRule; sessionCalendarVersion; overlapClass; sharedEventIds; rawInformationClass; representationClass; parent/child scale relation type; higher-timeframe confirmedAt; relation definition/version; multipleTestingFamilyKey.

These are Pattern payload fields. They do not change the generic parent identity. Predictive incrementality is NOT stored as a decision-time feature claim; it remains later analysis output.

## 6. DL-009/010 RG2 fields: schema gap

Required Pattern episode payload:

localBoundaryId; localBoundaryVersion; localLower; localUpper; localConfirmedAt; localFamily; localFirstBreakAt; parentZoneId; parentZoneVersion; parentLower; parentUpper; parentCenter; parentConfirmedAt; parentScale; parentSourceWindowStart/End; parentZoneAgeEligibleSessions; availableAirToParentLowerPct; distanceLocalToParentCenterPct; availableAirToParentLowerATR; geometryRelationState; compoundLifecycleState.

Required comparator provenance: priorHigh20; priorHigh60; simple260SessionHigh; MA60/MA120 availability; ret20/ret60 availability; roundPriceProximity control version; D02 acceptance receipt reference where available; regime receipt reference where available.

Do not copy large cross-lane payloads into Pattern. Reference canonical receipt IDs/hashes.

## 7. Shared-source / cross-lane receipt references

Pattern child should reference rather than duplicate continuityReceiptId/hash, symbolSessionReceiptId/hash, corporateActionSemanticReceiptId/hash, Price-Volume child/receipt reference where used later, Regime source receipt reference, Round-price control version/receipt, and Target-RR comparator receipt only when a later analysis actually needs it.

No downstream child may rewrite the shared source fact.

## 8. Timing fields

Generic child timing must distinguish as_of (what the evidence describes), available_at (earliest legitimate decision availability), captured_at (when observer captured/froze it), and created_at (persistence time).

For Pattern geometry derived from completed decision-time history, available_at <= parent decisionCutoffAt is mandatory. A later weekly confirmation cannot be attached as if available at an earlier parent decision. A next-session 15m acceptance cannot backfill the prior after-market parent.

## 9. Run completeness upgrade

Old count-only Pattern receipt expected_parent_count == attempted_parent_count is insufficient.

Promotion-grade run requires: one ROOT row per expected parent; no duplicate ROOT parent IDs; attempted ROOT count == expected count; attemptedParentKeysetHash == expectedParentKeysetHash; captureGeneration exact match; parentScopeId exact match; missingCount == 0; provenanceConflictCount == 0; observer QA failures == 0; replay/prefix QA pass for executed checks.

Blocked / constrained / unknown ROOT rows still count as attempted. Episode row count is never the coverage denominator.

## 10. Parent scope

The old Pattern contract used the bounded Shadow archive. That is acceptable only for legacy prototype QA if explicitly labeled.

For promotion-grade factor/admission/ranking inference, Pattern should attach to the same immutable decision-state parent scope used by other cross-lane observers: all history-admitted feature rows actually evaluated by the same-scan Formal decision path, subject to the final approved parentScopeId.

No selected-only or convenience-sampled Pattern population may support Formal-factor promotion.

## 11. Storage / Class-B boundary

This document does NOT authorize new D1 tables, Worker.js changes, observer scheduling, provider fetches, runtime persistence, or scan latency changes.

Those remain Class B proposal-first because they touch shared runtime/storage. Current action: schema reconciliation only.

## 12. Migration map

Legacy Pattern field -> future shared architecture:

scan_date -> parent.scanDate + child as_of semantics
symbol -> parent.symbol via parentDecisionReceiptId
parent_snapshot_hash -> legacy diagnostic only; future authority = parentDecisionReceiptId + semanticFingerprint + captureGeneration
detector_version -> observer_version
as_of_date -> as_of plus available_at/captured_at
status / blocked_reason -> generic child status + status_reason_code
snapshot_json -> family-specific Pattern payload JSON
run expected/attempted counts -> retained plus certified ROOT parent keyset hash
episode identity -> evidence_item_key for episode rows

## 13. Kill rules

Do not open Pattern outcome inference if parent generation cannot be certified; only legacy mutable Shadow linkage exists; ROOT attempt keyset is incomplete; episode children exist without a ROOT attempt; Pattern scale/timeframe provenance is missing; RG2 parent-zone version/provenance is missing; a cross-lane comparator is copied from a later vintage; or current-code reconstruction substitutes for decision-time capture.

## 14. Current decision

PATTERN_LEGACY_OBSERVER_CONTRACT = LEGACY_QA_COMPATIBLE / PROMOTION_GRADE_PARENTAGE_SUPERSEDED.

PATTERN_SHARED_PARENT_SCHEMA = DESIGN_RECONCILED / RUNTIME_NOT_IMPLEMENTED.

DL008_MULTISCALE_FIELDS = SCHEMA_REQUIRED_FOR_FUTURE_PROSPECTIVE_CAPTURE.

RG2_RELATION_FIELDS = SCHEMA_REQUIRED_FOR_FUTURE_PROSPECTIVE_CAPTURE.

OUTCOME_JOIN = CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 15. Exact next continuation

1. Freeze a machine-readable Pattern shared-parent child contract.
2. Define deterministic ROOT and relation/episode item-key rules without runtime persistence.
3. Audit whether existing Pattern payload hashes can include DL-008/DL-009 fields without mutability ambiguity.
4. Freeze equal-horizon / bar-boundary placebo identity before outcome work.
5. Do not ask for Class-B runtime approval until immutable parent runtime, TECHNICAL_CONTINUITY runtime, symbol-session provenance, and write/latency/cost sizing are all ready.