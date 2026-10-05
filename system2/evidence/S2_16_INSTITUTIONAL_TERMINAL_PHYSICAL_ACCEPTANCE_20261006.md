# S2-16 Institutional Terminal V0.1 — Physical Acceptance

Date: 2026-10-06 Asia/Taipei
Lane: BUILD_LANE
Status: PHYSICALLY_VERIFIED_UI_SHELL
Formal Core impact: NONE
Trading authority: NONE

## Repository / deployment

- UI merge: `95c85a4dfea513394caa265cb13b56fcabcbcc1f` / PR #654
- D1 read-only fast-path merge: `b2ae3488309df83bf9a6399c81ec5b1321ce2be2` / PR #655
- terminal verification repair: `92b565c0effe217d0bf10188b2409728e727673c` / PR #656
- deployment run: `37389121118`
- deployment job: `112029719361`
- result: PASS
- deployed Worker version: `80b5edff-67fb-4508-bdc9-db8de4241d56`

## D1 cost / mutation boundary

The deployment used the read-only readiness fast path:
- mode: `READ_ONLY_FAST_PATH`
- schemaVersion: `1.1`
- tableCount: 46
- requiredTablesPresent: true
- schemaMutationPerformed: false
- writeReadVerification: `SKIPPED_ALREADY_READY`

This avoided unnecessary D1 row writes after the free-tier row-write ceiling had already been reached. No paid-tier change was required.

## UI surface physically deployed

Public Worker base:
`https://system2-shadow-research.imihan0630.workers.dev`

Routes:
- `/` — institutional terminal
- `/terminal` — institutional terminal
- `/resonance` — dedicated resonance monitor

Primary terminal surfaces:
- Market Command Center
- Candidate Board
- Decision Workspace
- Virtual Positions
- Resonance Center
- Strategy Center
- Performance Center
- Event / Industry
- Evidence / System

## Runtime verification

The deploy workflow verified:
- schemaVersion = 1.1
- resonanceState = BOUNDED_RESONANCE_SCHEDULED
- captureState = CAPTURE_DISABLED
- one Cron = `*/5 0-5,11 * * MON-FRI`
- resonance API reachable
- operations API reachable
- daily diagnostic API reachable
- dedicated resonance UI reachable
- institutional terminal reachable and contains the explicit actual-holdings lock
- system1RuntimeUsed = false
- System 1 production files unchanged

## Truth boundary

This acceptance proves the complete first-pass operating shell is live. It does not prove that every planned data family is populated.

Pending surfaces stay explicit UNKNOWN / LOCKED / PENDING until their read contracts are verified. In particular, actual holdings must remain locked while `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED` and `ACTUAL_POSITION_MONITOR_VERIFIED=false` remain authoritative.

No final selection, real capital, push, orders, strategy promotion or System 1 Formal Core change is authorized by this UI deployment.
