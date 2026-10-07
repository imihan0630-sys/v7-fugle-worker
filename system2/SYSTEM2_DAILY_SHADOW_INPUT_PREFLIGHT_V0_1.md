# System 2 Daily Shadow Input Preflight V0.1

Updated: 2026-10-02 Asia/Taipei  
Status: REPOSITORY IMPLEMENTED / READ-ONLY PHYSICAL PREFLIGHT PENDING  
Scope: System 2 S2-07 upstream input readiness  
System 1 / V8 impact: NONE

## Purpose

Provide a truthful bridge between the already-built System 2 daily Shadow orchestration core and the still-unfrozen strategy assessor layer.

The preflight answers three separate questions without creating picks:

1. Is the current official A1 daily market snapshot available and structurally valid?
2. Does isolated System 2 D1 have globally trustworthy PIT-history infrastructure, and which individual symbols have enough PIT-eligible prior A1 history with verified continuity?
3. Is a preregistered / owner-authorized strategy assessor policy available to convert observations into strategy family states and EntryReadiness?

A failure at any layer must remain explicit. Global source/infrastructure failures block the whole run; symbol-local history/continuity/PIT gaps remain symbol-local INCOMPLETE/BLOCKED and must not starve clean symbols. Neither case may be converted into a fake zero-pick day.

## Modules

- `runtime/daily_shadow_a1_source_v0_1.mjs`
  - read-only official TWSE / TPEx A1 fetch;
  - feeds existing `buildA1SymbolSnapshotBatch`;
  - verifies target-date coverage, OHLC consistency and observation clock;
  - no external mutation.

- `runtime/daily_shadow_history_reader_v0_1.mjs`
  - reads only isolated `s2_historical_a1_bars`;
  - requires `pit_replay_eligible=1` and `available_at <= decisionTimestamp`;
  - provides a per-symbol prior-bar loader compatible with PIT Replay;
  - fails closed on eligible revision ambiguity;
  - measures last-60-session history and continuity coverage for the current universe;
  - separates `globalIntegrityState` from per-symbol readiness diagnostics;
  - local history/continuity/revision gaps remain `INCOMPLETE` for that symbol, while source-wide/clock/universe-integrity failures remain global blockers.

- `runtime/daily_shadow_assessor_readiness_v0_1.mjs`
  - binds the separately versioned Stage-1 assessor policies;
  - SHORT_MOMENTUM and SWING_GROWTH are `READY` for authorized Shadow evaluation only;
  - System1 runtime / Top6 / rank remain explicit non-dependencies;
  - final selection, live push, capital and orders remain disabled.

- `runtime/daily_shadow_input_preflight_v0_1.mjs`
  - combines current source, global PIT-history integrity, symbol-local readiness and assessor readiness;
  - returns global `INPUTS_NOT_READY` only for global source/integrity failure; local gaps are exposed through `symbolAccounts` / `symbolLocalBlockers`;
  - once an assessor is authorized, ready symbols may continue even when other symbols remain INCOMPLETE/BLOCKED;
  - `zeroPickMayBeClaimed` additionally requires complete selection denominator coverage, so partial coverage cannot be mislabeled as clean zero-pick.

- `scripts/run_daily_shadow_input_preflight_readonly.mjs`
  - uses the isolated `system2-research` D1 through the existing remote read adapter;
  - performs no D1 mutation;
  - when no exact capture clock is supplied, labels the clock `DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK`.

## Stage-1 assessor policy boundary

The 2026-10-07 owner P0 launch directive authorizes the smallest falsifiable launch-policy freeze without arbitrary threshold invention.

The authoritative mapping is now:
`SYSTEM2_STAGE1_ASSESSOR_POLICY_FREEZE_V0_1.md`.

The parent strategy contracts still define thesis/evidence/setup identity. The assessor policy is a separate versioned layer for raw/family/readiness mapping.

SHORT_MOMENTUM uses only source-honest relational references available from PIT A1 history; it does not introduce a weighted score or outcome-tuned numeric cutoff.

SWING_GROWTH requires PIT-valid INDUSTRY_THESIS and FUNDAMENTAL_QUALITY upstream assessments. A1 timing cannot synthesize missing growth evidence, so missing required thesis inputs still resolve to INCOMPLETE/BLOCKED.

Assessor READY means **authorized Shadow evaluation only**. It does not imply final selection, live push, capital or order authority.

## Zero-pick firewall

A truthful **CLEAN_ZERO_PICK** claim is allowed only when:
- current required global sources are ready;
- global PIT-history/source integrity is ready;
- the required selection denominator is complete (no symbol-local INCOMPLETE/SOURCE_BLOCKED/SESSION_INVALID/ERROR debt for the claim);
- all required strategy assessor policies are authorized;
- all strategy runs complete accounting;
- capacity is resolvable.

Symbol-local history/continuity/provenance gaps do **not** globally block ready symbols, but they make the selection denominator partial. If no ready symbol is selected under partial coverage, the state must remain `PARTIAL_COVERAGE_NO_SELECTION` (or equivalent) with `zeroPickDay=null`, never a clean zero-pick.

No whole-market coverage percentage threshold (95%, 90%, 80%, etc.) is introduced by this rule.

If an assessor policy is missing/unregistered, the state is **BLOCKED**, never "0 stocks selected". A registered READY policy still cannot produce a clean zero-pick unless the selection denominator is complete.

## Physical diagnostic workflow

`.github/workflows/system2-daily-shadow-input-preflight-readonly.yml`

The workflow:
- reads public official market sources;
- reads only isolated System 2 D1;
- records current A1 universe count and PIT-history/continuity coverage;
- reports explicit assessor-policy blockers;
- requires D1 rowsWritten = 0;
- does not invoke System 2 Worker capture;
- does not add/change Cron;
- does not touch System 1 runtime.

The workflow is diagnostic evidence only. It cannot authorize an exact decision clock or prospective capture schedule.

## Next engineering dependency

After physical preflight readback:

1. quantify current official A1 readiness and isolated D1 history/continuity gaps;
2. repair/complete data coverage where the evidence shows an engineering/data issue;
3. use the frozen Stage-1 assessor policy to execute genuine strategy states on eligible symbols;
4. wire completed strategy runs into the already-built ranking/capacity assembler and isolated D1 persistence execution;
5. generate SDA-022 per-strategy fingerprints and physical NC-T01 independence evidence;
6. retain final-selection, push, capital and order gates until their acceptance gates pass.

No System 1 Formal behavior is changed by this work.
