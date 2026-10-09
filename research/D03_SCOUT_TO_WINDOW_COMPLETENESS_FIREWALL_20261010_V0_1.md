# D03 36-key Scout-to-Window Completeness Firewall

Status: RESEARCH_ONLY / FALSIFICATION_FIRST / NO_MATURITY_PROMOTION
Date: 2026-10-10 Asia/Taipei
Domain: D03 trend / momentum / reversal / technical indicators
Formal Core impact: NONE / LOCKED

## Scope and new evidence

This tranche consumes only evidence newer than TI-1692:

- main commit `b81ed318e0b3a3a94ac2f9acd2385d1ab7d4b7bc` accepts a source-level fail-closed ordering guard: an independently accepted real 36-key Hot D1 Scout must precede any 11,843-key census.
- the accepted evidence explicitly reports physical Scout `0/36`, physical census `0/11843`, missing-key count `UNKNOWN`, System1 read/write reserves false, and physical D1 reads/writes zero.
- main commit `9c1fce52ec858dfd020ce0c89c17e31ab419164a` records the actual 2026-10-08 C1 attempt as `BLOCKED`: `C1_GENERATION_NOT_FOUND`, `UPSTREAM_ARTIFACT_MISSING`, not a genuine parent and not a zero-pick.
- main commit `db2645817cc5c68d74a0f68d4823438c8a4fb13f` independently rejects CORR-003 physical closure: zero of five physical gates accepted.

No cloud read is executed by this D03 tranche. It interprets existing immutable evidence only.

## Hypotheses, support, counterevidence, and failure conditions

### H1 — Scout-first sequencing is a useful bounded defect detector

Support: three source-matched keys for each of 12 market-date strata can cheaply expose gross query, market/date routing, missing-row, duplicate-key, multiversion, or hash-binding defects before a full census.

Counterevidence: a successful deterministic 36-key Scout cannot establish the other 11,807 keys, cannot estimate a population missing rate without a preregistered probability design, and cannot prove Hot D1 causal availability at a historical decision cutoff.

Failure conditions: code-only pass, synthetic fixture, missing immutable run/job/head/artifact identity, incomplete 12-stratum coverage, duplicate key, source mismatch, missing or multiversion D1 row, any write, exceeded read cap, or non-independent acceptance.

### H2 — Full census can prove storage equality for one frozen cut, not historical PIT

Support: if all 11,843 frozen source keys are reconciled one-to-one against Hot D1 under an immutable artifact and zero-write run, the result is strong storage-completeness evidence for that frozen observation cut.

Counterevidence: equality retrieved after the fact does not reconstruct `firstKnownAt`, `availableAt`, source revision history, or exact decision-time availability. A later row may be correct today but unavailable at the original cutoff.

Failure conditions: unmatched keys, unexpected keys, multiversion RAW rows, source semantic-hash conflict, partial market/date strata, unaudited pagination/truncation, or reuse of a later retrieval timestamp as historical availability.

### H3 — Indicator-window admission needs causal lineage beyond storage equality

Support: Bollinger and ADX require exact expected symbol-session identity, causal corporate-action and halt/no-event ancestry, identity-transition disposition, and hash-bound continuity. These requirements prevent a count-correct but session-wrong window from entering a formula.

Counterevidence: a complete frozen storage cut is still valuable for outcome-blind mechanism replay and discrepancy diagnosis. It is not useless merely because it is not PIT evidence.

Failure conditions: count-only readiness, older-session substitution, unknown halt/resume interval, unresolved price-reset family, symbol identity discontinuity, late-known event, or unbound continuity receipt.

### H4 — Non-execution is UNKNOWN, not observed absence

Support: the canonical evidence records zero physical selects and explicitly keeps missing-key count UNKNOWN.

Counterevidence: none currently. A future authenticated Scout may produce positive or negative physical evidence.

Failure condition: treating `0/36 executed` as `36/36 missing`, or treating a deferred run as a valid no-row result.

## Four-stage state machine

1. `CODE_GUARD_ONLY`: sequencing and fail-closed logic passed, no physical D1 observation.
2. `SCOUT_STORAGE_EVIDENCE`: real 36-key sample physically reconciled; population completeness and PIT remain false.
3. `CENSUS_STORAGE_EVIDENCE`: real 11,843-key frozen-cut reconciliation completed; historical PIT still false unless separately proven.
4. `INDICATOR_WINDOW_PIT_READY`: exact symbol sessions plus causal availability, action/halt/identity lineage and continuity hashes all pass for the requested decision cutoff.

Stages are cumulative and cannot be skipped. Stage 2 cannot imply stage 3; stage 3 cannot imply stage 4.

## Bias and robustness audit

- PIT / look-ahead: later observation clocks may not be backdated.
- Selection bias: 36 keys are a deterministic safety sample, not a statistical population sample unless probability selection is preregistered.
- Date clustering: six adjacent sessions across two markets do not constitute OOS or walk-forward evidence.
- Multiple testing / overfitting: this gate tests lineage and storage mechanics, not indicator efficacy; no parameter or threshold search is permitted.
- Redundancy: no new price information root is created; this is provenance evidence only.
- Costs / fillability / price limits / halts / ex-rights: remain UNKNOWN for performance inference; halt and corporate-action lineage are input-validity gates, not alpha evidence.
- Market regime: no efficacy inference is permitted from the current evidence cut.

## D03 module implications

- D03-09 ADX: remains L2. Even a complete census cannot replace canonical Wilder full replay or a separately replay-certified trusted state.
- D03-10 Bollinger: remains L2. A complete census cannot replace the exact 20 eligible parent sessions and causal reset/continuity lineage.
- D03-01 through D03-08, D03-12, D03-13: no maturity change; current evidence can support formula/mechanism replay diagnostics only.
- Outcome joins remain closed. No `FORMAL_OPTIMIZATION_CANDIDATE` is created.

## Current machine verdict

- current stage: `CODE_GUARD_ONLY`
- physical Scout: `0/36`, unexecuted
- physical census: `0/11843`, unexecuted
- missing keys: `UNKNOWN`
- C1 parent: blocked / absent
- D03 maturity: 56.7%
- Formal Core: LOCKED

## Exact next continuation point

Await independently accepted positive System1 read reserve and same-UTC-day account headroom. Then consume a real authenticated 36-key read-only Scout without converting it into population completeness or PIT. Only after independent Scout acceptance and a separate budget grant may the 11,843-key census run. Any census result remains storage evidence until exact symbol sessions, causal clocks, corporate-action/halt/identity lineage and continuity hashes pass. Parent track separately waits for the next ordinary-session genuine immutable C1 with authoritative V8.20 binding. Then evaluate D03-10 first; keep D03-09 on full-replay or replay-certified trusted-state requirements.
