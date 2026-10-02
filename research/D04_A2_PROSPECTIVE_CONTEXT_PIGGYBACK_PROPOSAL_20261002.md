# D04 A2 prospective context piggyback proposal — 2026-10-02

Status: CLASS_B_PROPOSAL / PR_ONLY / NOT_ENABLED
Owner: 04｜波動與市場微結構研究室
Formal Core: LOCKED
Production selection/notification/capital impact: NONE

## Problem confirmed from real 2026-10-02 artifacts

The scheduled `System2 Prospective Clock Evidence Read-only` run #5 completed successfully and produced immutable GitHub artifacts, but its `daily_arrival` step used `requiredDailyOnly=true`.

Therefore the source-arrival series contained:
- A1_TWSE_DAILY_CLOSE
- A1_TPEX_DAILY_CLOSE

but did not prospectively probe:
- A2_TAIEX_CLOSE

The daily evidence bundle correctly reported `sameSessionClockReady=false`, `captureEnabled=false`, and did not claim any regime source. The later 18:44 Taipei Daily Shadow Diagnostic was also explicitly `DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK` and `regime.state=UNKNOWN`.

This means the project has genuine prospective infrastructure, but D04's required A2 market context is absent from the current scheduled artifact.

## Minimal proposed change

Do NOT create another long-running GitHub job.

Instead:
1. extend the existing source-arrival runner with optional `additionalSourceIds`;
2. keep `REQUIRED_DAILY_CLOCK_SOURCES_V0_1` unchanged;
3. scheduled prospective workflow supplies exactly `A2_TAIEX_CLOSE` as an extra context source;
4. A1 daily gate and `stopWhenDailyGateReady` semantics remain unchanged;
5. if A2 is not ready before the A1 gate stops, that date simply has no usable D04 A2 context sample.

This design adds one official GET per existing polling round but no new scheduled job, no Cloudflare Cron and no extra fixed polling duration.

## A2 receipt enrichment

The existing A2 parser only recorded target date presence/count. Proposed diagnostic enrichment adds:
- `validationVersion=S2_A2_TAIEX_VALIDATION_V0_2`;
- `targetDateTaiexClose`;
- target-row duplicate/usable-close diagnostics;
- monthly row/date counts;
- `canonicalPayloadHash = SHA256(canonical JSON)`;
- explicit `payloadHashSemantics=CANONICAL_JSON_SHA256`.

This is integrity/provenance context, not a claim of raw-byte preservation.

## What this proposal deliberately does NOT solve

Even when A2 is READY:
- canonical JSON hash is not the same as raw HTTP byte hash;
- the artifact does not by itself construct the exact previous 20 official closes;
- it does not persist `regimeFactorObservations` to D1;
- it does not perform physical write/readback/replay;
- it does not link D04 factor hashes into a completed Shadow run fingerprint;
- no strategy decision clock is authorized merely because A2 arrived;
- no maturity promotion occurs.

Therefore an A2-ready artifact is a prospective **source-arrival/context observation**, not a promotion-grade Market-RV factor sample.

## Resource/cost guard

Rejected alternative:
- a separate 2.5-hour A2 polling job each weekday.

Reason:
- duplicates GitHub Actions runtime and can materially increase monthly Actions minutes.

Chosen alternative:
- piggyback the existing A1 poll loop.

The job still stops when A1 required sources satisfy the original stop gate. A2 never becomes a required Decision Clock dependency in this proposal.

If future measured A2 coverage is poor because A2 often arrives after A1, first quantify missed-date coverage. A bounded short tail poll may be proposed later; it is not pre-authorized here.

## Safety invariants

Must remain true in CI:
- A2 has `clockRole=CONTEXT_OBSERVATION`;
- `REQUIRED_DAILY_CLOCK_SOURCES_V0_1` stays exactly A1 TWSE + A1 TPEx;
- A2 failure cannot turn an otherwise complete A1 daily gate false;
- A2 success cannot turn an incomplete A1 daily gate true;
- workflow stays GET-only, contents-read, no secrets, no Worker/D1 mutation;
- `captureEnabled=false`, `cronAuthorized=false` in source-arrival measurement semantics;
- no System1 references or Formal behavior changes.

## Activation boundary

This is a Class B proposal because it changes an already scheduled shared research workflow and source-probe output shape.

Allowed now:
- branch implementation;
- tests;
- PR;
- CI/regression verification.

Not allowed without owner approval:
- merge to main, which would change the next scheduled collector run.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
