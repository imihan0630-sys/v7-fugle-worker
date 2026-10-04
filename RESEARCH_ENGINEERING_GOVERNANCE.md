# Research Engineering Governance

Updated: 2026-10-04

## Purpose

This document is the durable permission boundary for automated research engineering in the Taiwan stock trading decision monitoring system.

The system may continuously research and may autonomously implement **research-only / Shadow** improvements when they cannot change formal selection or trading behavior. Changes that can affect the Formal Core require an explicit human strategy decision before promotion.

GitHub/runtime evidence overrides remembered chat state.

## Fixed continuity

- Repository: `imihan0630-sys/v7-fugle-worker`
- Cloudflare Worker: `fugle-test`
- Production monitor: `https://fugle-test.imihan0630.workers.dev/`
- Before any change, read `REQUIREMENTS_30.md`, `AGENTS.md`, `PROJECT_HISTORY.md`, `VERSIONING.md`, and `RESEARCH_WORKLIST.md`.
- For any research cycle or research-status question, also read `RESEARCH_MASTER_MAP.md`; its machine-readable companion is `research/research_master_map.json`. `RESEARCH_CHECKPOINT.md` remains the continuation cursor, while the Master Map is the cross-chat canonical inventory/maturity dashboard.
- Always verify the actual production version/readback before deciding the current baseline. Do not assume a version from chat memory.

## Classification gate

Every proposed engineering change must be classified **before code is changed**.

### Class A — Research-only / Shadow: autonomous implementation allowed

Allowed examples:

- TPEx/TWSE research evidence parity and source coverage.
- Research-only external evidence ingestion.
- Point-in-time metadata: sourceDate, capturedAt, availableAt/verifiedAt, pointInTimeEligible.
- Evidence provenance and UNKNOWN/data-quality semantics.
- Shadow Candidate Archive fields and research-only cohorts.
- Research experiment ledger, readiness matrix, maturity diagnostics.
- Redundancy, transaction-cost, overfit, date-cluster and falsification diagnostics.
- Research-only APIs, reports and observability that cannot alter formal outputs.

Class A must satisfy **all** of these:

1. No change to A/B selection definitions, ranking, score, weight or threshold.
2. No change to Top6 or 3+3 pool/quota behavior.
3. No change to capital allocation, entry/add/reduce/sell/stop rules.
4. No change to formal monitoring, notification eligibility or push behavior.
5. No research evidence may be silently substituted into production selection.
6. Missing data remains UNKNOWN and cannot become BAD/0 merely to pass a gate.
7. No look-ahead or historical backfill using information unavailable at the historical decision timestamp.
8. The change is reversible and regression-tested.

### Class B — Shared runtime / indirect formal-risk: proposal first

Examples:

- Shared data structures or fetch paths used by both research and formal selection.
- Runtime scheduling, storage schema or performance changes that could indirectly affect production scans.
- Changes to shared APIs, caching, date resolution or market-source routing.
- Deployment-pipeline changes.

For Class B:

- A branch/PR and regression evidence may be prepared automatically.
- Do not promote/merge/deploy to production until the owner has reviewed the risk and explicitly approved the material production change.
- If the change can be redesigned as isolated Class A, prefer isolation.

### Class C — Formal Core: human decision mandatory

Always Class C:

- A/B line definitions.
- Any formal factor, weight, score, threshold or ranking change.
- Top6, thousand/non-thousand 3+3 quotas or cross-pool behavior.
- Capital allocation.
- Formal entry/add/reduce/sell/stop logic.
- Formal 15-minute/10-minute confirmation semantics.
- Monitoring eligibility, signal semantics, push/notification behavior.
- Any change that can alter which stock is formally selected, traded, sized or notified.

Research may produce a proposal and evidence for Class C, but **must never automatically promote or deploy it**. Passing Shadow/OOS/holdout gates only makes a proposal eligible for human strategy review.

## Autonomous Class A workflow

For a Class A change, the agent should carry the work through instead of asking the owner to copy/paste code:

1. Recover context from repository documents and actual runtime readback.
2. State internally why the change is Class A and identify protected formal outputs.
3. Create a rollback point / dedicated branch.
4. Implement the smallest isolated research-only change.
5. Run existing regression tests plus targeted tests for the new research behavior.
6. Compare protected formal outputs and verify no formal behavior changed.
7. Check for look-ahead, UNKNOWN coercion, selection bias, market-source bias, redundancy and overfit risks.
8. Use the repository's existing deployment path when it is already authorized and appropriate.
9. Verify GitHub Actions/workflow result, production version/readback, health and relevant research endpoint.
10. Record commit/version, tests, deployment/readback and rollback information.
11. Report the completed engineering result to the owner.

Do not claim deployment success from a commit alone.

## Regression invariants

A Class A change fails the safety gate if any protected formal behavior changes unexpectedly, including:

- formal candidate eligibility or ordering;
- selected symbols or 3+3 quota behavior for the same frozen input;
- formal plan prices/risk rules caused by the research change;
- capital allocation;
- monitoring plan;
- signal state or push behavior;
- existing Cloudflare bindings, secrets, Cron or external targets unless the approved change explicitly requires them.

On failure: stop promotion, preserve evidence, report the regression and continue only in research/branch state.

## Promotion gate for research findings

Research findings remain research even when statistically promising. Follow the maturity rules in `RESEARCH_WORKLIST.md`, including prospective samples, independent scan dates, purged holdout, multiple regimes, redundancy, transaction costs, overfit diagnostics, coverage and date-cluster robustness.

No automated promotion from research to Formal Core exists.

## Mandatory research-to-optimization bridge

Research is not complete merely because knowledge was documented. When evidence identifies a potentially useful improvement to the after-market stock-selection system, the research lane MUST create and surface a `FORMAL_OPTIMIZATION_CANDIDATE` for owner review once the candidate has passed the applicable falsification/readiness gates.

A candidate may be proposed only with auditable evidence covering, where applicable: positive mechanism/evidence; explicit counterevidence and alternative mechanisms; point-in-time/no-look-ahead validity; prospective Shadow/OOS or justified holdout evidence; independent-date/date-cluster robustness; market/regime/industry concentration; factor redundancy/incremental value over existing Formal controls; transaction-cost/slippage implications; candidate coverage and zero-pick risk; data-source/UNKNOWN semantics; and overfit/Factor-Zoo/multiple-testing controls.

Candidate status vocabulary:
- `DISCOVERY`: plausible mechanism, insufficient evidence.
- `FALSIFICATION_IN_PROGRESS`: positive and negative tests active.
- `EVIDENCE_READY`: applicable research gates passed; implementation effect still not authorized.
- `FORMAL_OPTIMIZATION_CANDIDATE`: evidence-backed change worth explicit owner strategy review.
- `REJECTED_OR_REDUNDANT`: falsified, non-incremental, too costly, too fragile, or otherwise not worth proposing.

Every `FORMAL_OPTIMIZATION_CANDIDATE` must state exactly what Formal behavior would change, expected benefit, observed downside/failure modes, evidence sample/period/regimes, protected invariants, rollback plan, and whether the implementation is Class B or Class C. The agent MUST proactively notify the owner when such a candidate becomes eligible; it must not wait for the owner to ask.

This bridge does NOT weaken Formal Core LOCKED. Class B/C changes still require explicit owner approval before merge/deploy/promotion. Research findings that have not passed falsification must never be presented as optimization-ready.

## Official-source automation capability preservation

The former curriculum module `D10-11`（官方資料自動化擷取）is retired from the stock-knowledge curriculum because automated ingestion is an engineering capability rather than an independent stock-selection knowledge module.

**Capability preservation is mandatory.** Curriculum retirement does not authorize deletion, disabling or degradation of approved official-data automation.

The engineering layer must preserve, where applicable:
- TWSE / TPEx / MOPS / MOEA / TAIFEX and other approved official-source adapters and source contracts;
- automated scheduled / incremental acquisition when an authorized collector exists;
- source health / readiness checks, retries, bounded fallback behavior and explicit source failures;
- sourceDate / capturedAt / availableAt / verifiedAt / firstKnownAt / PIT eligibility semantics;
- data-generation/version provenance and immutable/replayable receipts;
- storage, APIs, workflows and tests that support those capabilities;
- UNKNOWN semantics: missing/unavailable source data must never silently become 0, BAD or PASS.

Any runtime, Cron, binding, shared fetch-path, cache, schema or deployment change that could affect production remains Class B or Class C as already defined above. Removing a curriculum module is never sufficient authority to alter such engineering behavior.

Canonical ownership/retirement record:
`shared-knowledge/CURRICULUM_RETIREMENT_AND_CAPABILITY_LEDGER_V0_1.md`.


## Human-intervention boundary

Do not ask the owner to open websites and paste code when connected tools and existing automation can complete the task.

Human action is appropriate only for genuine protected steps such as:

- MFA or account reauthentication;
- secret creation/value entry;
- permissions/approval that the connected agent cannot grant;
- an explicit Class B/Class C production decision.

When human action is genuinely required, provide the exact destination link and the minimum required steps. Never ask the owner to paste secrets into chat.

## Interruption handoff

If research or engineering stops before completion for any reason, do not fail silently. Record/report:

- what was researched;
- what was learned or falsified;
- files/branch/commit changed, if any;
- tests completed and their results;
- what remains unfinished;
- exact interruption/blocker;
- the precise next continuation point.

A normal completed research cycle with no material new evidence may remain quiet. An interrupted unfinished cycle may not.


## Execution continuity / anti-silent-stop gate (2026-10-04)

Execution continuity is a mandatory engineering-governance requirement, not merely a chat-style preference.

Canonical detailed rules are defined in:
`shared-knowledge/ROOM_BOOTSTRAP.md` → **「八、不中斷執行與防靜默停滯（MANDATORY）」**.

All research/engineering lanes using this repository MUST follow those rules. In particular:

1. Durable each independently verifiable milestone promptly; do not keep a long chain of completed work only in chat state.
2. While work is still active, do not silently stall on CI/workflow/tool waits. Provide concise progress updates during long chains and use wait time for non-conflicting safe work where possible.
3. If the agent has said it will continue but does not actually initiate the next required action, classify the event as `ABNORMAL_INTERRUPTION`. On recovery, report the last real durable milestone, actual stop point, any uncommitted/unmerged state, and the exact next continuation point.
4. Never imply background/asynchronous work is still running when no actual tool/task execution exists.
5. When `main` advances concurrently, re-read and reconcile the delta; do not redo completed research merely because the base SHA moved.
6. Split long repository work into testable/rollbackable milestones. Large repository engineering should trigger a Codex suitability check; large cross-domain long-running analysis should trigger a Work suitability check. Before any mode handoff, durable current state and emit the required handoff.
7. Before ending an unfinished execution turn, preserve enough state to recover latest observed main SHA, last merged/finished milestone, test status, blocker, outstanding uncommitted/unmerged work, and exact next continuation point.
8. Normal tool errors, CI failures, merge drift, or recoverable workflow problems are not reasons to stop and hand work back to the owner. Continue diagnosis and safe remediation unless the Human-intervention boundary is reached.

Violation of this gate is an execution-governance failure even when no Formal Core behavior was changed.

## Core principle

**Research can evolve autonomously. Formal trading decisions cannot.**

The purpose of autonomous research engineering is to improve evidence quality, falsification, observability and Shadow validation without silently changing the strategy that controls real selection, monitoring or trading.


## Cross-system Shared Knowledge routing (2026-09-26)

The repository now contains a canonical reusable knowledge layer:
- `shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md`
- `shared-knowledge/SHARED_KNOWLEDGE_GOVERNANCE.md`

Research read order is now: Shared Master Map -> this governance -> system-specific master/checkpoint -> dedicated evidence/checkpoint.

New reusable market findings must be routed to Shared Knowledge while preserving their original detailed evidence files. System-specific implementation remains isolated. System 2 is defined under `system2/` and may consume shared evidence without changing V8 Formal behavior.

This Shared Knowledge layer is Class A documentation/research infrastructure. It does not authorize any Formal Core, runtime, selection, monitoring, capital, signal or push change.


## Mandatory Alpha lineage / anti-double-count guard (2026-10-05)

Canonical engineering contract:
`shared-knowledge/SYSTEM_ALPHA_LINEAGE_AND_DOUBLE_COUNT_GUARD_V0_1.md`.

This contract is mandatory for System 1 and System 2 work touching stock-selection scoring, confluence, resonance, ranking, factor integration, or selection diagnostics.

Key requirement: D01/D02/D03 and any other features that share deterministic or near-deterministic information ancestry MUST NOT be treated as multiple independent Alpha votes merely because they use different formulas or domain labels. Build lanes must preserve factor lineage, information roots, redundancy groups and an effective independent-evidence count.

Research/shadow lineage metadata, overlap diagnostics, raw-vs-deduped scores and deterministic tests are Class A when they cannot change Formal outputs and should be implemented proactively. Any use of de-duplicated scoring to alter Formal A/B eligibility, ranking, Top6 composition, weights or thresholds remains Class C and requires explicit owner approval.

Missing lineage fails closed to UNKNOWN for independence purposes. Different formula names, different research-room ownership, or correlation below one are not sufficient evidence of independent Alpha.
