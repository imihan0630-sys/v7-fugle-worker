# System 2 Source Arrival Measurement Verification V0.1

Updated: 2026-09-27 Asia/Taipei
Status: REPOSITORY VERIFIED / GITHUB CI PENDING
Formal/System 1 impact: NONE

## Implemented

- machine-readable source-arrival receipt contract;
- official GET-only probe adapters for A1/A2/A3/A6 daily/current sources;
- same-Taipei-date prospective evidence guard;
- market-close finality guard;
- source-error vs not-ready separation;
- minimum coverage and schema validation;
- latency lower/upper interval calculation;
- preregistered 10-date provisional / 20-date freeze-eligibility assessment;
- explicit A5/B2 dependency blockers;
- manual read-only GitHub Actions workflow with no schedule;
- artifact-only report output, no System 2 D1 writes;
- static no-mutation/no-System1 workflow guard tests.

## Protected invariants

- `SYSTEM2_CAPTURE_ENABLED` remains false;
- Worker Cron remains 0;
- no Worker deploy occurs;
- no D1/KV mutation occurs;
- no System 1/V8 runtime endpoint is used;
- exact decision clock remains unfrozen;
- no strategy rank, threshold, score, selection, monitoring or notification behavior changes.

## Local verification result

- 32 System 2 test files: PASS.
- 36 runtime/deploy/script modules syntax check: PASS.
- SQLite schema V0.5: PASS; 26 `s2_` tables.
- production-isolation guard across runtime/scripts/SQL/contracts: PASS.
- `git diff --check`: PASS.
- non-trading-day read-only smoke on 2026-09-27: PASS as an operational check;
  `dailyGateComplete=false`, `decisionClockStatus=BLOCKED_DEPENDENCIES`, no
  Worker/D1 mutation, no capture-arm request and no Cron mutation.
- latest available official-data schema/coverage check for 2026-09-24: all
  seven V0.1 adapters returned the target date and passed minimum coverage:
  TWSE close 1085, TPEx close 890, TAIEX 1, TWSE institutions 1067, TPEx
  institutions 775, TWSE valuation 1081, TPEx valuation 889. This was a
  retrospective schema check only and is explicitly ineligible as latency evidence.

GitHub Actions run/job IDs remain to be recorded after push.

## Interpretation limit

Passing tests proves contract behavior and no-mutation guards. It does not prove any source's future publication time, does not freeze a decision clock, and does not authorize Cron.
