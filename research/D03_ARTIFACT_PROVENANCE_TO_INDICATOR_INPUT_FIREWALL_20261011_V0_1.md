# D03 artifact provenance to indicator-input firewall — 2026-10-11

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED.

## Question

Do the new CORR-003 native GitHub artifact replays, independent quota audit, and Issue #1068 negative source-reserve run make migrated technical-indicator inputs point-in-time ready?

## New canonical evidence

- Main `5a17a0c643e0a9d58ae9f2e81614333e6c7e6e60` replays nine original GitHub Actions artifact ZIP byte streams. Native ZIP SHA-256 matches 9/9, ZIP integrity passes 9/9, eleven inner JSON documents are hashed, and nine Run/Job/Artifact associations are checked.
- This closes an artifact-provenance access gap only. The evidence itself preserves CORR-003 at HIGH/VERIFYING, supporting checks 15/38 and independently accepted physical gates 0/5.
- Main `2ce1b6a49a48b04db6a4f58ee34ec3a3a5a29eeb` independently rechecks the five physical gates. P01=3/7, P02=3/7, P03=3/8, P04=2/7 and P05=4/9; none is physically accepted.
- Main `c82bdc43504c17f5a15129e625fefbaa41b79160` freezes the migration/quota admission boundary. Destination schema-only is independently accepted 25/25, but source read/write reserves are false/null, real-time account headroom is not attested, data migration is not accepted, source PIT/Frozen/restore is not accepted, and Hot D1 Scout/Census remain unaccepted.
- Main `ce39441dd2db1adb552dd76d2f0ea4b8220f1d4e` records real Run 38108616165 / Job 114379309976. The successful workflow proves the negative fail-closed state `READ_ONLY_D1_BUDGET_EVIDENCE_DEFER`; it performs zero source D1 SQL, zero R2 byte reads and zero data copy. Success is therefore refusal verification, not source-data or PIT acceptance.

## D03 cumulative state model

The five states are cumulative and non-interchangeable:

1. `ARTIFACT_PROVENANCE_VERIFIED`: original archived evidence bytes and identities are reproducible.
2. `SOURCE_ACCESS_BUDGET_AUTHORIZED`: independently accepted read/write reserves and current same-UTC-day account headroom exist.
3. `SOURCE_PHYSICAL_DATA_ATTESTED`: applied schema, row identities/counts/value hashes, PIT revision clocks, frozen-chain prefix and restorable backup are physically read and independently accepted.
4. `DESTINATION_STORAGE_PARITY_VERIFIED`: authorized copy is complete and independent destination readback matches the source manifest.
5. `INDICATOR_INPUT_READY`: exact eligible sessions, original causal clocks, corporate-action/halt/identity ancestry, continuity hashes, target-indicator history and genuine parent binding all pass.

Current evidence reaches state 1 only. A negative quota guard is valuable safety evidence, but it does not advance state 2. Destination schema-only acceptance is orthogonal infrastructure evidence and does not advance states 3–5.

## Support, counterevidence and alternative explanations

Supporting evidence:

- Nine native archives now have byte-level replayable provenance.
- The negative reserve workflow physically proves that unsafe source reads fail closed.
- The separate destination schema has independently accepted topology.

Counterevidence:

- Both read and write reserves are false/null.
- Physical source table count, total rows, per-table hashes, applied migrations, original PIT clocks, Frozen lineage, restorable backup and R2 object bytes remain UNKNOWN.
- Hot D1 Scout is 0/36 and Census is 0/11,843.
- The two historical successful System1 days are whole-day totals, not per-operation 23:35/conditional-23:55 costs or same-generation current persistence.
- The known 2026-10-07 account total exceeded the free write ceiling; historical collision is negative evidence, not a forward no-collision pass.

Alternative explanations retained:

- Replayed ZIP consistency may reflect immutable GitHub storage without proving business truth inside every receipt.
- A successful negative workflow may reflect correct safety logic while the underlying source remains entirely unread.
- Destination schema parity may coexist with zero migrated rows.
- Source database file size may change because of page allocation, free pages or indexes; it is not a row-count estimator.

## D03 indicator consequences

- D03-10 Bollinger remains L2/40. No source physical data, no migrated rows, no W0, no genuine C1 and no exact 20 eligible parent sessions are accepted.
- D03-09 ADX remains L2/40. No canonical full Wilder replay or independently replay-certified trusted state exists.
- Ret5/20/60, moving averages, KD, RSI, MACD, divergence and multi-timeframe conflict obtain no new causal observation clock, exact history or outcome evidence from archive provenance alone.
- No artifact count, ZIP size, D1 file size, table-definition count or schema statement count may substitute for time-series depth.

## Bias and robustness disposition

- PIT/look-ahead: preserved as UNKNOWN; later archive replay cannot create original firstKnownAt/availableAt.
- OOS/walk-forward: absent; archive revalidation and negative quota refusal are not new economic samples.
- Selection/date clustering: old successful days and October source receipts are nonrandom, clustered operational evidence.
- Multiple testing/overfitting: this tranche tests evidence admission only and searches no indicator parameters.
- Redundancy: no new price-information root is added.
- Cost: whole-day counts cannot identify per-operation cost; current source-scan cost remains UNKNOWN.
- Fillability, limits, halts, ex-rights and market-state efficacy remain UNKNOWN.

## Machine falsification

`research/d03_artifact_provenance_indicator_input_cases_20261011_v0_1.json` defines 20 admission cases. `research/test_d03_artifact_provenance_indicator_input_v0_1.mjs` requires the current evidence to stop at `ARTIFACT_PROVENANCE_VERIFIED` and rejects archive, quota, source-data, storage, PIT, history, parent, OOS and cost laundering.

## Disposition and exact next

No maturity promotion, outcome join, FORMAL_OPTIMIZATION_CANDIDATE or Formal Core change.

Next:

1. Do not repeat ZIP replay or destination schema APPLY_ONCE.
2. Await independent acceptance of numeric System1 read/write reserves and current same-UTC-day account headroom.
3. Only under a separately qualified bounded budget, capture physical source applied schema, exact table rows/value hashes, original PIT clocks, Frozen prefix and independently restorable backup.
4. Run the real read-only 36-key Hot D1 Scout before any separately budgeted 11,843-key Census.
5. After an owner-authorized copy, require independent source/destination identity and value parity without rewriting UNKNOWN clocks.
6. Keep W0, genuine C1, exact sessions and indicator-specific history as separate final gates.

D03 remains 56.7%; 12 active modules = 10 L3 + 2 L2; outcomes closed; Formal Core locked.
