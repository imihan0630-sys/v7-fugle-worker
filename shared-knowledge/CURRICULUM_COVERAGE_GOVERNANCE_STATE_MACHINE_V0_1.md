# Curriculum Coverage Governance State Machine V0.1

Updated: 2026-10-03 22:51 Asia/Taipei
Status: GOVERNANCE_STATE_MACHINE_FROZEN
Scope: COV curriculum-coverage candidates only.
Canonical curriculum impact: NONE.
Formal Core impact: NONE.
System1 impact: NONE.

## Purpose

This contract defines the only legal governance transitions for COV candidates.

It prevents:
- partial evidence from being treated as a curriculum decision;
- a specialist recommendation from bypassing 00-room intake;
- structural changes from bypassing Dependency Audit, overlap recheck, anti-orphan review or owner approval;
- direct module-count or maturity edits from a specialist room.

## Canonical candidate states

1. `PENDING_SPECIALIST_RETURN`
2. `PARTIAL_EVIDENCE_RECEIVED`
3. `RETURN_ACCEPTED_FOR_INTAKE`
4. `COUNTERPART_OR_DEPENDENCY_REQUIRED`
5. `DEPENDENCY_AUDIT_PENDING`
6. `OWNER_APPROVAL_REQUIRED`
7. `TERMINAL_DECISION_READY`
8. `CANONICAL_UPDATE_COMPLETE`
9. `CLOSED_NO_STRUCTURAL_CHANGE`

## State semantics

### PENDING_SPECIALIST_RETURN

Meaning:
- task packet exists;
- no sufficient specialist evidence has been accepted;
- adjacent research may exist but has not crossed the partial-evidence threshold.

Allowed next:
- `PARTIAL_EVIDENCE_RECEIVED`
- `RETURN_ACCEPTED_FOR_INTAKE` only when a complete formal return arrives directly.

Forbidden:
- any terminal recommendation becoming canonical;
- module addition;
- maturity promotion;
- domain-count change.

### PARTIAL_EVIDENCE_RECEIVED

Meaning:
- useful existing or new evidence overlaps the COV contract;
- the fixed 10-field return contract is not yet complete.

Allowed next:
- remain `PARTIAL_EVIDENCE_RECEIVED` while more evidence accumulates;
- `RETURN_ACCEPTED_FOR_INTAKE` after the formal return passes the intake template/schema.

Forbidden:
- treating partial evidence as owner approval;
- structural curriculum change;
- terminal recommendation adoption.

### RETURN_ACCEPTED_FOR_INTAKE

Meaning:
- all fixed 10 return fields are present;
- exactly one allowed terminal recommendation is supplied;
- PIT/replay, Taiwan data feasibility, overlap and anti-double-count semantics are explicit;
- the return is accepted as an intake artifact, not as a curriculum decision.

Allowed next:
- `COUNTERPART_OR_DEPENDENCY_REQUIRED`
- `DEPENDENCY_AUDIT_PENDING`

### COUNTERPART_OR_DEPENDENCY_REQUIRED

Meaning:
- another room or dependency must supply evidence before the 00-room can complete the dependency/overlap decision.

Allowed next:
- remain in this state while the counterpart is absent;
- `DEPENDENCY_AUDIT_PENDING` once the required counterpart/dependency evidence is present.

Forbidden:
- silent promotion based on one side only.

### DEPENDENCY_AUDIT_PENDING

Meaning:
00｜研究總控室 must complete:
- dependency map;
- overlap recheck;
- anti-double-count recheck;
- anti-orphan review;
- owner-boundary validation.

Allowed next:
- `OWNER_APPROVAL_REQUIRED` for structural recommendations;
- `TERMINAL_DECISION_READY` for non-structural outcomes that require no structural owner action.

### OWNER_APPROVAL_REQUIRED

Meaning:
a structural recommendation exists:
- `ADD_MODULE`
- `EXTEND_EXISTING_SCOPE`
- `MERGE_INTO_EXISTING`

and the designated owner has not yet approved the structural action.

Allowed next:
- `TERMINAL_DECISION_READY` after owner approval;
- remain here if approval is withheld or clarification is required.

Forbidden:
- canonical tracker/map/router mutation before approval.

### TERMINAL_DECISION_READY

Meaning:
the 00-room governance process has a complete decision package.

Possible terminal recommendation:
- `ADD_MODULE`
- `EXTEND_EXISTING_SCOPE`
- `MERGE_INTO_EXISTING`
- `NOT_A_GAP`
- `EVIDENCE_INSUFFICIENT`

Next action:
- structural recommendation → atomic canonical update, then `CANONICAL_UPDATE_COMPLETE`;
- non-structural recommendation → record terminal rationale, then `CLOSED_NO_STRUCTURAL_CHANGE`.

### CANONICAL_UPDATE_COMPLETE

Meaning:
a structural change has been atomically applied to all required canonical artifacts and verified.

Required atomic surfaces where applicable:
- tracker;
- master map;
- router;
- human registry;
- machine registry;
- owner module mapping;
- maturity record if explicitly approved.

This state must record the commit SHA of the atomic update.

### CLOSED_NO_STRUCTURAL_CHANGE

Meaning:
the terminal decision was `NOT_A_GAP` or `EVIDENCE_INSUFFICIENT`, or another approved outcome requiring no structural curriculum mutation.

The evidence trail remains preserved.

## Allowed transitions

| From | To | Minimum gate |
|---|---|---|
| PENDING_SPECIALIST_RETURN | PARTIAL_EVIDENCE_RECEIVED | accepted partial evidence threshold |
| PENDING_SPECIALIST_RETURN | RETURN_ACCEPTED_FOR_INTAKE | complete 10-field return contract |
| PARTIAL_EVIDENCE_RECEIVED | PARTIAL_EVIDENCE_RECEIVED | additional non-terminal evidence |
| PARTIAL_EVIDENCE_RECEIVED | RETURN_ACCEPTED_FOR_INTAKE | complete 10-field return contract |
| RETURN_ACCEPTED_FOR_INTAKE | COUNTERPART_OR_DEPENDENCY_REQUIRED | missing counterpart/dependency identified |
| RETURN_ACCEPTED_FOR_INTAKE | DEPENDENCY_AUDIT_PENDING | return complete and dependency set available |
| COUNTERPART_OR_DEPENDENCY_REQUIRED | DEPENDENCY_AUDIT_PENDING | counterpart/dependency evidence complete |
| DEPENDENCY_AUDIT_PENDING | OWNER_APPROVAL_REQUIRED | structural recommendation survives audits |
| DEPENDENCY_AUDIT_PENDING | TERMINAL_DECISION_READY | non-structural terminal outcome supported |
| OWNER_APPROVAL_REQUIRED | TERMINAL_DECISION_READY | owner approval recorded |
| TERMINAL_DECISION_READY | CANONICAL_UPDATE_COMPLETE | structural atomic update committed and verified |
| TERMINAL_DECISION_READY | CLOSED_NO_STRUCTURAL_CHANGE | non-structural terminal outcome recorded |

Any transition not listed above is forbidden unless this governance contract is versioned and formally updated.

## Mandatory transition metadata

Every state change must record:
- candidateId;
- fromState;
- toState;
- changedAt;
- sourceArtifact(s);
- evidenceCutoff;
- actor/room;
- reason;
- canonicalImpact;
- commitSha when committed.

For structural transitions also record:
- owner;
- ownerApprovalArtifact;
- Dependency Audit artifact;
- overlap/anti-double-count result;
- anti-orphan result.

## Hard firewalls

1. `PARTIAL_EVIDENCE_RECEIVED` is never a curriculum decision.
2. A specialist terminal recommendation is never self-executing.
3. `UNKNOWN` may not be converted to 0, BAD, no-event or negative evidence.
4. Historical Shadow evidence may not be fabricated.
5. Module count may not change before `TERMINAL_DECISION_READY` plus owner approval where structural.
6. Maturity may not be inherited automatically through merge/extension.
7. A new module normally starts at L0 unless separately justified and approved.
8. `ADD_MODULE` may not create a new domain unless a separate domain-level governance process authorizes it.
9. Formal Core remains independent from curriculum maturity.
10. System1/System2 adoption is a separate downstream decision and is not implied by curriculum inclusion.

## Current snapshot at contract creation

- Domains: 22
- Active modules: 354
- Maturity baseline: 36.3%
- Partial evidence candidates: COV-01, COV-02, COV-06, COV-07, COV-08, COV-09, COV-10, COV-11
- Pending specialist-return candidates: COV-03, COV-04, COV-05, COV-12
- Accepted specialist returns: 0 / 12
- Formal Core: LOCKED
