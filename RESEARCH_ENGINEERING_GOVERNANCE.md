# Research Engineering Governance

Updated: 2026-09-21

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

## Core principle

**Research can evolve autonomously. Formal trading decisions cannot.**

The purpose of autonomous research engineering is to improve evidence quality, falsification, observability and Shadow validation without silently changing the strategy that controls real selection, monitoring or trading.
