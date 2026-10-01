# System 2 Daily Shadow Input Preflight V0.1

Updated: 2026-10-02 Asia/Taipei  
Status: REPOSITORY IMPLEMENTED / READ-ONLY PHYSICAL PREFLIGHT PENDING  
Scope: System 2 S2-07 upstream input readiness  
System 1 / V8 impact: NONE

## Purpose

Provide a truthful bridge between the already-built System 2 daily Shadow orchestration core and the still-unfrozen strategy assessor layer.

The preflight answers three separate questions without creating picks:

1. Is the current official A1 daily market snapshot available and structurally valid?
2. Does isolated System 2 D1 contain enough PIT-eligible prior A1 history with verified continuity?
3. Is a preregistered / owner-authorized strategy assessor policy available to convert observations into strategy family states and EntryReadiness?

A failure at any layer must remain explicit. It must never be converted into a fake zero-pick day.

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
  - measures last-60-session history and continuity coverage for the current universe.

- `runtime/daily_shadow_assessor_readiness_v0_1.mjs`
  - explicit firewall against invented strategy thresholds;
  - SHORT_MOMENTUM and SWING_GROWTH are currently `ASSESSOR_POLICY_NOT_FROZEN`;
  - no default MA/volume/fundamental threshold is allowed to create SUPPORTIVE/ADVERSE or BUY_ELIGIBLE.

- `runtime/daily_shadow_input_preflight_v0_1.mjs`
  - combines current source, PIT history and assessor readiness;
  - returns `INPUTS_NOT_READY`, `ASSESSOR_POLICY_BLOCKED`, or later `READY_FOR_AUTHORIZED_SHADOW_EVALUATION`;
  - capacity writes and zero-pick claims remain unauthorized until both data and assessor policy are genuinely ready.

- `scripts/run_daily_shadow_input_preflight_readonly.mjs`
  - uses the isolated `system2-research` D1 through the existing remote read adapter;
  - performs no D1 mutation;
  - when no exact capture clock is supplied, labels the clock `DIAGNOSTIC_OBSERVATION_TIME_NOT_CAPTURE_CLOCK`.

## Why assessor policy is deliberately blocked

Existing strategy contracts define:
- strategy thesis;
- evidence families;
- source-readiness requirements;
- hard invalidation identifiers;
- setup families;
- horizon and governance.

They do **not** freeze exact setup-level numeric thresholds or a full mapping from raw observations to:
- SUPPORTIVE / NEUTRAL / ADVERSE;
- WATCH / NEAR_ENTRY / ACTIVE_ENTRY_MONITOR / BUY_ELIGIBLE.

Inventing those mappings inside engineering would silently create a strategy version without preregistration or owner review.

Therefore V0.1 treats:
- SHORT_MOMENTUM -> `ASSESSOR_POLICY_NOT_FROZEN`;
- SWING_GROWTH -> `ASSESSOR_POLICY_NOT_FROZEN`.

This is a deliberate safety state, not an engineering failure.

## Zero-pick firewall

A truthful zero-pick capacity receipt is allowed only when:
- current required sources are ready;
- PIT history / continuity requirements are ready;
- all required strategy assessor policies are authorized;
- all strategy runs complete accounting;
- capacity is resolvable.

If assessor policy is missing, the state is **BLOCKED**, never "0 stocks selected".

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
3. separately preregister the smallest falsifiable strategy assessor policy before it can emit strategy states;
4. only then wire completed strategy runs into the already-built ranking/capacity assembler and isolated D1 persistence execution;
5. retain final-selection, push, capital and order gates.

No System 1 Formal behavior is changed by this work.
