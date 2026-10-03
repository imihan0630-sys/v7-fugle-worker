# System 2 Recent A1 Hot-History Warmup V0.1

Updated: 2026-10-03 Asia/Taipei  
Status: REPOSITORY IMPLEMENTATION / PHYSICAL WARMUP PENDING  
Scope: S2-07 recent prior-session A1 history coverage only  
System 1 / V8 impact: NONE

## Goal

Provide the 60 prior trading sessions needed by the daily Shadow history reader without pretending that corporate-action continuity has been solved.

The lane is intentionally bounded and prospective:
- derive the prior 60 official trading sessions before the current Asia/Taipei anchor date;
- inspect isolated `system2-research` D1 first;
- fetch at most five missing trading dates per invocation;
- use only official exact-date TWSE / TPEx daily-close sources with exact source-date validation;
- fill only canonical symbol/date keys that do not already exist;
- write immutable rows and completion receipts through the existing historical persistence engine;
- preserve `continuity_state=UNVERIFIED`.

## PIT semantics

Historical source pages are being **observed now** to warm future prospective runs.

Therefore each newly inserted bar uses:
- `availability_basis=PROSPECTIVE_OBSERVATION`;
- `available_at = observed_at = actual warmup observation time`;
- `pit_availability_class=OBSERVED_AVAILABLE_UPPER_BOUND`.

The lane does not relabel a historical exchange close time as a proven historical publication time. New rows may support future decision clocks only after their actual warmup observation.

## Existing-row firewall

The warmup never inserts a second row for an existing market/symbol/date merely to improve PIT eligibility.

- Existing revision ambiguity blocks that date/market.
- A date/market whose existing symbol coverage is already large but not PIT-eligible is reported as `EXISTING_NON_PIT_HISTORY_BLOCKS_COVERAGE`; it is not overwritten.
- Partial coverage may be filled only for symbols whose canonical keys are absent.
- Changed official source content creates a new immutable revision only where no canonical key already exists in this lane; pre-existing canonical keys are not rewritten.

This avoids manufacturing replay ambiguity as a side effect of warmup.

## Boundaries

V0.1 does **not**:
- promote continuity to `CLEAR_NO_ACTION` or `ADJUSTED_CONTINUITY`;
- define corporate-action semantics;
- define strategy assessor thresholds;
- run strategy evaluation/ranking;
- produce `s2_capacity_runs`;
- claim zero-pick days;
- enable final selection, live push, capital or orders;
- use Fugle;
- use or modify System 1/V8 runtime.

## Schedule and resource bound

GitHub Actions workflow:
`.github/workflows/system2-recent-a1-hot-history-warmup.yml`

- one run per day at 16:30 Asia/Taipei plus manual dispatch;
- a main-branch push touching this lane also runs one physical warmup;
- maximum five trading dates per run;
- target window 60 prior sessions;
- shared `system2-isolated-d1-writer` concurrency preserves isolated D1 serialization;
- no Cloudflare Cron slot is added.

The daily schedule may run on weekends because it fetches finalized historical dates only.

## Acceptance ladder

1. Repository tests prove trading-calendar planning, five-date cap, missing/partial/ambiguous handling and continuity firewall.
2. First physical main run must persist/read back at least one missing exact-date market batch or truthfully report why it cannot.
3. Repeated runs progressively increase PIT-eligible recent-history coverage.
4. `historyCoverage` may be promoted only from actual D1 readback.
5. `continuityCoverage` remains a separate unresolved gate until corporate-action/adjustment evidence is implemented and verified.
6. Strategy assessor and Regime/fundamental/industry gates remain independent even after 60-session history coverage is complete.
