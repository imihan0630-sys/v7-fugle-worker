# Persistent Research Checkpoint

Updated: 2026-09-21
Status: ACTIVE
Purpose: durable cross-chat handoff for scheduled research. Chat transcripts are notification surfaces, not the system of record.

## Continuity contract

At the start of each scheduled research cycle:
1. Read `RESEARCH_ENGINEERING_GOVERNANCE.md`.
2. Read `RESEARCH_WORKLIST.md`.
3. Read this checkpoint.
4. Read the current GitHub main/runtime evidence needed for the task.
5. Continue from the exact next-action state below. Do not restart completed research because a chat thread changed.

At the end of a cycle with material progress, or whenever a cycle is interrupted while work remains:
- update this checkpoint (or a dated ledger entry referenced here);
- preserve support and falsification evidence;
- preserve engineering branch/commit/test/deployment state;
- update the exact continuation point;
- send a concise human-readable notification when the reporting rules require it.

A chat transcript must never be the only copy of research progress.

## Human-visible reporting contract

The owner must still be able to see meaningful learning results in ChatGPT. GitHub persistence does **not** mean silent research.

Notify for:
- meaningful new evidence or falsification;
- research direction materially converging;
- a new redundancy/overfit/data-quality finding that changes interpretation;
- a research-only engineering change completed;
- a Class B/C proposal or decision point;
- any interrupted/incomplete cycle.

Do not spam the owner for tiny incremental observations with no material change.

## Thread rollover

There is no assumed capability to automatically create a new ordinary ChatGPT conversation when the current notification thread becomes too long.

If the notification thread becomes unreliable or needs retirement:
1. Persist the latest checkpoint here first.
2. Tell the owner that a new notification chat should be created.
3. The owner only needs to create/open the new chat and indicate it is the continuation.
4. Recover research state from GitHub; do not ask the owner to copy old chat transcripts, repo URLs, code or deployment history.
5. Rebind/update the notification automation when the product/tooling supports that operation; otherwise keep research state independent of the notification surface and clearly state the remaining product limitation.

## Protected production boundary

Formal Core remains LOCKED. See `RESEARCH_ENGINEERING_GOVERNANCE.md`.

Research-only changes may be autonomous only when they satisfy Class A isolation and regression requirements. Class B is proposal-first. Class C requires explicit human strategy decision.

## Current research state

Prospective Shadow start: 2026-09-21.

Readiness carried forward:
- R01 WAITING_DATA
- R02 WAITING_DATA
- R03 ACCUMULATING
- R04 WAITING_DATA
- R05 WAITING_DATA
- R06 ACCUMULATING
- R07 WAITING_DATA
- R08 WAITING_DATA
- Overall: ACCUMULATING
- DESCRIPTIVE_READY: 0/8

Current research priorities:
1. TPEx Evidence Parity and point-in-time provenance.
2. Fundamental Persistence.
3. Price Path Quality / Information Discreteness.
4. Negative Evidence / Falsification.
5. Supply-Chain Lead-Lag.
6. Execution Alpha.
7. Market Regime Transition.
8. Redundancy checks against existing R01-R08 / I01-I07 factors.

## Current engineering state

- Formal production baseline must always be re-read from actual GitHub/runtime before engineering; do not rely on this checkpoint for a stale version string.
- Research engineering governance is checked into main via PR #89.
- Persistent checkpoint/ledger infrastructure is being added as a Class A documentation/continuity change.
- No Formal Core strategy change is authorized by this checkpoint.

## Exact next continuation point

Continue prospective Shadow accumulation and the existing research priority queue. On any material research result, write the durable checkpoint before relying on chat notification. If a safe Class A research-only code improvement is justified, follow the autonomous implementation workflow in `RESEARCH_ENGINEERING_GOVERNANCE.md`; if the change is Class B/C, stop at proposal/evidence and notify the owner.

## Ledger format for future material updates

Append or reference dated entries containing:
- timestamp (Asia/Taipei);
- research question / experiment ID;
- new evidence;
- falsification / contradiction;
- redundancy and bias checks;
- data-quality / UNKNOWN notes;
- R01-R08 / I01-I07 impact;
- engineering classification (A/B/C);
- branch / commit / tests / deployment readback when applicable;
- unfinished work;
- exact next action.
