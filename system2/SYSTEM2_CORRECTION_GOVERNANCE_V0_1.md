# System 2 Correction Governance V0.1

Updated: 2026-10-04 Asia/Taipei
Status: ACTIVE
Scope: System 2 independent correction / audit governance
Formal Core impact: NONE
Production trading impact: NONE

## Purpose

Create a durable, auditable correction loop for System 2 so design drift, false completion, missing validation, abandoned work, cross-module disconnects and implementation defects cannot disappear in chat history.

GitHub main remains canonical. Chat memory is contextual only.

This governance does not authorize any change to System 1 Formal Core, System 2 live selection authority, capital, order, production notification, or other protected behavior.

## Roles

### SYSTEM2_BUILD_CONTROL_ROOM
The System 2 build/control room implements approved architecture, data, research, engineering and integration work.

It may:
- acknowledge correction directives;
- investigate;
- implement fixes within existing authority;
- attach evidence;
- mark a directive `FIX_IMPLEMENTED`.

It may not independently close a CRITICAL or HIGH directive.

### SYSTEM2_HISTORICAL_DATA_ROOM
Historical-data engineering owner for System 2.

Responsibilities:
- execute DATA_LANE corrections and planned historical-data work;
- preserve source/PIT/coverage/storage evidence;
- maintain `system2/SYSTEM2_HISTORICAL_DATA_CHECKPOINT.md`;
- avoid strategy/ranking/final-selection scope.

### SYSTEM2_REMEDIATION_ROOM
Focused remediation/SWAT owner.

Responsibilities:
- execute corrections routed to REMEDIATION_LANE;
- repair cross-module, recurrent, orphaned or false-completion defects;
- minimize touched conflict units;
- maintain `system2/SYSTEM2_REMEDIATION_CHECKPOINT.md`;
- not absorb every ordinary local bug.

### SYSTEM2_INDEPENDENT_CORRECTION_AUDITOR
Independent correction / troubleshooting / question-answering role.

Responsibilities:
- compare implementation against the owner North Star and canonical System 2 contracts;
- detect drift, false completion, orphaned work, missing evidence and contradictory design;
- issue correction directives;
- verify submitted fixes independently;
- close CRITICAL/HIGH directives only after evidence review.

### OWNER
The owner retains authority over major strategy direction, Class B/Class C production decisions, System 1 Formal Core changes, capital/risk changes and other protected decisions.

When a correction requires such a decision, the directive status must be `OWNER_DECISION_REQUIRED`.

## What counts as a correction issue

A directive should be created when any of the following is materially true:

1. **Goal drift** — implementation no longer serves the owner North Star.
2. **Design contradiction** — two canonical rules conflict or implementation violates a frozen contract.
3. **False completion** — a document/test/sample passes but the stated completion claim exceeds what was actually proven.
4. **Silent abandonment** — work was started or preregistered and then disappears without an explicit disposition.
5. **Validation gap** — positive-path evidence exists but counterexample, PIT, OOS, UNKNOWN, cost, regime, date-cluster or other required validation is missing.
6. **Integration gap** — a research/factor/module is marked complete but is not correctly routed into its intended downstream layer.
7. **Data/provenance defect** — source, version, first-known/availableAt, revision, lineage or replay semantics are wrong or ambiguous.
8. **Authority leak** — research/shadow behavior reaches production/formal behavior without required approval.
9. **Over-constraint drift** — accumulated gates/checklists create opportunity starvation contrary to contextual decision synthesis without evidence that the restriction is beneficial.
10. **Audit incompleteness** — acceptance/verification omits a required dimension or fails to distinguish UNKNOWN from PASS.
11. **Operational discontinuity** — implementation stopped for a recoverable reason and no durable continuation point was recorded.
12. **Documentation/runtime divergence** — canonical documentation claims behavior or readiness that runtime/code/evidence does not support.

## Severity

### CRITICAL
Use when there is risk of:
- unauthorized production/formal behavior;
- look-ahead/PIT contamination;
- corrupted or misleading historical truth;
- capital/order/push impact outside authorization;
- System 1 Formal Core contamination;
- a defect that invalidates a major System 2 evidence foundation.

Default effect:
- block affected lane immediately;
- block dependent promotion claims;
- require independent verification before closure.

### HIGH
Use for:
- material North-Star drift;
- false-complete milestone;
- missing mandatory validation that affects readiness;
- orphaned critical path;
- major cross-module disconnect;
- a design likely to produce materially wrong stock-selection conclusions.

Default effect:
- block the affected milestone/lane;
- non-conflicting unrelated work may continue;
- builder may implement but may not self-close.

### MEDIUM
Use for:
- incomplete robustness work;
- non-critical observability/documentation gaps;
- missing secondary tests;
- maintainability issues that can become future correctness risks.

Default effect:
- correction must be scheduled and tracked;
- does not automatically block unrelated progress.

### LOW
Use for:
- clarity, ergonomics, naming, documentation polish, low-risk cleanup.

Default effect:
- track when useful; no milestone block unless later evidence raises severity.

## Directive lifecycle

Allowed statuses:

- `OPEN`
- `ACKNOWLEDGED`
- `FIX_IN_PROGRESS`
- `FIX_IMPLEMENTED`
- `VERIFYING`
- `VERIFIED_CLOSED`
- `OWNER_DECISION_REQUIRED`
- `REJECTED_WITH_EVIDENCE`

Rules:

1. `OPEN` means the auditor has created a correction with evidence and acceptance criteria.
2. `ACKNOWLEDGED` means the build/control room has read it and recorded the intended response.
3. `FIX_IN_PROGRESS` means actual corrective work has started.
4. `FIX_IMPLEMENTED` means the builder has durable implementation evidence, but the issue is not yet independently closed.
5. `VERIFYING` means the independent auditor is checking the fix against the acceptance criteria.
6. `VERIFIED_CLOSED` requires explicit independent verification evidence.
7. `OWNER_DECISION_REQUIRED` pauses only the decision-dependent portion. Safe diagnostic work may continue.
8. `REJECTED_WITH_EVIDENCE` is allowed only when the original directive is disproven by stronger evidence. The original record must remain preserved.

CRITICAL and HIGH directives cannot move directly from `FIX_IMPLEMENTED` to `VERIFIED_CLOSED` by the same implementation role.

## Execution routing

Canonical lane governance:
`system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

Routing classes:
- `LOCAL_FIX`
- `BUILD_LANE`
- `DATA_LANE`
- `REMEDIATION_LANE`
- `OWNER_DECISION_REQUIRED`

Severity does not determine routing by itself. A HIGH data-backfill defect can belong to DATA_LANE; a small local UI defect can remain LOCAL_FIX.

The build/control room must not automatically take every OPEN/HIGH correction. It executes only LOCAL_FIX/BUILD_LANE work assigned to it, while respecting blockers from other lanes.

One conflict unit may have only one active modification owner at a time.

## Mandatory directive fields

Every directive must preserve:

- directiveId;
- createdAt;
- severity;
- status;
- title;
- affectedScope;
- detectedBy;
- canonicalRequirement;
- observedProblem;
- evidence;
- riskIfUnfixed;
- requiredCorrection;
- acceptanceCriteria;
- protectedBoundaries;
- ownerDecisionRequired;
- routingClass;
- assignedLane;
- assignedRoom;
- modificationOwner;
- blockedBy;
- implementationEvidence;
- verificationEvidence;
- finalDisposition;
- updatedAt.

If a field is not known, use explicit `UNKNOWN` / empty evidence, not invented facts.

## Directive ID

Format:

`S2-CORR-YYYYMMDD-NNN`

Example:

`S2-CORR-20261004-001`

IDs are never reused.

## Build/control-room startup rule

Before substantive System 2 build continuation, the control room must read:

1. `shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md`
2. `shared-knowledge/SHARED_KNOWLEDGE_GOVERNANCE.md`
3. `RESEARCH_ENGINEERING_GOVERNANCE.md`
4. `system2/SYSTEM2_MASTER.md`
5. `system2/SYSTEM2_CHECKPOINT.md`
6. `system2/SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md`
7. `system2/SYSTEM2_CORRECTION_QUEUE.md`
8. `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`
9. task-specific evidence/checkpoint files.

The room must inspect all OPEN / ACKNOWLEDGED / FIX_IN_PROGRESS / FIX_IMPLEMENTED / VERIFYING / OWNER_DECISION_REQUIRED directives affecting the current task before declaring a milestone complete.

## Blocking semantics

- CRITICAL: blocks affected lane and dependent promotion claims.
- HIGH: blocks affected milestone/lane until `VERIFIED_CLOSED` or explicit owner override.
- MEDIUM: does not block by default, but cannot be silently dropped.
- LOW: advisory unless escalated.

A blocking directive does not automatically freeze the whole repository. Non-conflicting work may proceed if it cannot invalidate or conceal the correction.

## Acceptance rules

A correction is not complete because:
- code was written;
- a PR merged;
- a workflow passed;
- one frozen sample passed;
- a document was updated;
- the builder says it is fixed.

Closure evidence must match the original acceptance criteria and must distinguish:
- implemented;
- tested;
- physically observed;
- replay/PIT-safe where relevant;
- integrated downstream where relevant;
- protected behavior unchanged;
- remaining UNKNOWN/debt.

## Protected boundaries

Correction work must preserve existing governance.

Without owner approval, correction governance cannot authorize:
- System 1 Formal Core changes;
- System 1 A/B, Top6/3+3, capital or live signal changes;
- System 2 live selection authority;
- real capital/order impact;
- production notification eligibility changes;
- Class B/Class C production promotion;
- secrets/MFA/permission escalation.

When the safest correction requires a protected change, set `OWNER_DECISION_REQUIRED`.

## Anti-false-completion rule

Every milestone claim must answer:

1. What exactly is proven?
2. What is not proven?
3. Is the evidence documentary, unit-tested, integration-tested, physically observed, PIT-safe, OOS/Shadow, or production-authorized?
4. Does a passing sample generalize beyond its frozen scope?
5. Are downstream dependencies actually connected?
6. Are known blockers still visible?

If a claim skips these distinctions, the auditor may issue a false-completion directive.

## Anti-silent-abandonment rule

Any started correction, design item, preregistered strategy, data lane or validation lane must end in one of:

- completed and verified;
- explicitly deferred with reason and continuation condition;
- rejected/falsified with preserved evidence;
- superseded with an explicit replacement reference;
- owner decision required.

Disappearing from the current conversation or checkpoint is not a valid disposition.

## Queue authority

Human-readable queue:
`system2/SYSTEM2_CORRECTION_QUEUE.md`

Machine-readable companion:
`system2/SYSTEM2_CORRECTION_QUEUE.json`

The two must agree on directive ID, severity and status. On mismatch, treat the queue as invalid and fail closed for closure claims until reconciled.

## Independent verification contract

For CRITICAL/HIGH corrections, independent verification should include, as applicable:

- re-read latest main;
- compare against canonical requirement;
- inspect implementation diff;
- inspect targeted tests;
- inspect regression evidence;
- verify no authority boundary was crossed;
- check the original failure mode directly;
- check at least one negative/fail-closed case when meaningful;
- confirm checkpoint/master claims match the evidence.

The verifier should record both positive result and remaining limitations.

## Owner override

The owner may explicitly:
- reprioritize;
- downgrade/upgrade severity;
- accept a known residual risk;
- authorize a protected Class B/Class C change;
- close an issue by business decision.

Any override must be written into the directive record with timestamp and scope. It must not rewrite or delete the original evidence.

## Current activation

This governance becomes active when merged to main.

Initial queue starts with no open directives. Future corrections are created only when an actual issue is identified with evidence; do not manufacture issues merely to populate the queue.
