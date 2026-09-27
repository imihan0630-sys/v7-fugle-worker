# Shared Evidence Child Cross-Lane Compatibility V0.2

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / CROSS-LANE_DESIGN_RECONCILED
Formal Core: LOCKED

## Purpose

Extend the generic evidence-child falsification from:
- Technical Indicator;
- Pattern;
- Target/RR

to:
- per-symbol external evidence;
- Formal gate-overlap evidence.

The goal is to find semantic loss before any Class-B persistence implementation.

## TI-413 — as_of alone is insufficient

One field cannot safely represent all evidence timing.

Example:
monthly revenue can describe August,
become publicly available on a September announcement date,
and be captured by the system later that day.

Therefore generic child timing is frozen as:

as_of:
what time/date the evidence describes.

available_at:
earliest decision timestamp at which the evidence was legitimately usable.

captured_at:
when the system actually observed/froze it.

created_at:
when the database row was written.

These are not interchangeable.

PIT eligibility requires available_at <= parent decision cutoff.

created_at cannot substitute for source availability.

## TI-414 — External evidence with different clocks must not be bundled carelessly

Current external evidence families include sources with different publication/availability clocks.

If one parent row stores several source families in one payload while only one row-level available_at exists, PIT meaning becomes ambiguous.

Preferred rule:
one evidence source family/item per child row when clocks differ.

Examples:
- MONTHLY_REVENUE;
- MARGIN;
- SBL;
- ATTENTION;
- DISPOSITION.

evidence_item_key may identify the source family/item.

A higher-level combined context can be derived later from PIT-valid child rows.

Do not freeze a single bundled available_at as a shortcut.

## TI-415 — Shared market/sector facts are not parent-child rows

Some evidence is identical for many symbols on the same date:
- market regime;
- exchange calendar;
- sector-wide state;
- corporate-action registry version;
- official limit-rule set.

Duplicating the full payload into every symbol child:
- wastes storage;
- increases drift risk;
- complicates revision lineage.

Therefore:
shared upstream facts live once in immutable source receipts.

Per-symbol child stores only:
- source receipt ID/hash;
- family-specific per-symbol result where needed.

The generic child is not a universal data warehouse.

## TI-416 — Later source revision must not rewrite decision-time evidence

Suppose a source later corrects a historical record.

Do not UPDATE the old decision-time child.

Preserve:
- original first-known child;
- revised source receipt/version;
- append-only quality/revision relationship.

Historical PIT analysis keeps the evidence actually available at the decision time.

Later corrected truth may be used for source-quality analysis but cannot masquerade as earlier-known evidence.

## TI-417 — External-evidence parent linkage fits the generic model

The existing external-evidence falsification already requires:
- immutable parentDecisionReceiptId or exact parent hash + generation;
- exact complete parent keyset;
- expected/actual evidence counts;
- idempotent same-fingerprint behavior;
- explicit missing reason.

Mapping:
- parentDecisionReceiptId -> generic parent link;
- evidence source family -> evidence_family/evidence_item_key;
- source clocks -> as_of/available_at/captured_at;
- provider/source hashes -> source_receipt_refs_json;
- missingJoinReason -> status_reason_code.

Result:
PER_SYMBOL_EXTERNAL_EVIDENCE = DESIGN_COMPATIBLE after PIT-clock repair.

## TI-418 — Gate-overlap evidence also fits

Gate-overlap observer already has:
PASS / FAIL / UNKNOWN / NOT_EVALUABLE per gate.

One parent can store one ROOT child payload containing:
- gate states;
- observed margins;
- source-quality flags;
- original Formal first failure.

Generic row status may be VALID if the observer executed correctly,
while individual gate states remain inside the payload.

If upstream evidence is missing:
row may be UNKNOWN/BLOCKED with reason.

Result:
FORMAL_GATE_OVERLAP = DESIGN_COMPATIBLE.

## TI-419 — Generic status and payload status must remain separate

Generic row status answers:
"Can this evidence object be trusted/interpreted?"

Payload state answers:
"What did the observer see?"

Example:
a gate-overlap child can be generic VALID,
while one internal gate field is UNKNOWN because that gate is not evaluable from the frozen input.

Likewise:
a Technical child can be generic CONSTRAINED,
while RSI/MACD numeric values are still present.

Do not collapse observer validity and domain state.

## TI-420 — Cross-lane compatibility after v0.3

Compatible evidence families now tested:
- Technical Indicator;
- Pattern;
- Target/RR;
- per-symbol External Evidence;
- Formal Gate Overlap.

Required generic repairs accumulated:
1. evidence_item_key;
2. NOT_EVALUABLE;
3. parent_scope_id;
4. flexible status/reason/QA counts;
5. available_at;
6. captured_at;
7. point_in_time_state;
8. shared-source receipt boundary.

No material schema contradiction remains across these five families.

But:
runtime implementation remains premature.

## TI-421 — Parent/child architecture boundary

The shared architecture is now:

SCAN POPULATION RECEIPT
-> IMMUTABLE DECISION-STATE PARENT
   -> GENERIC PER-PARENT EVIDENCE CHILD
   -> MEMBERSHIP OVERLAYS
   -> QUALITY OVERLAYS
   -> OBSERVER RUN RECEIPTS

Separate upstream:
IMMUTABLE SHARED SOURCE RECEIPTS
- market;
- sector;
- corporate actions;
- calendar;
- limit rules;
- source vintages.

Children reference shared source receipts.
They do not duplicate them.

## Current decision

SHARED_EVIDENCE_CHILD_SCHEMA = DESIGN_COMPATIBLE_V0_3
CROSS_LANE_TESTED_FAMILIES = 5
RUNTIME_IMPLEMENTATION = NO_GO_YET
OWNER_APPROVAL_REQUEST = NOT_YET
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Exact next continuation

1. Freeze the v0.3 machine-readable contract.
2. Next research target:
   design the immutable decision-state parent itself precisely enough that child evidence cannot re-score/reconstruct a different Formal state.
3. Compare required parent fields across:
   Technical Indicator,
   Pattern,
   Target/RR,
   gate overlap,
   external evidence.
4. Separate "what the production selector actually knew/did" from later research memberships.
5. Do not implement D1 tables yet.
