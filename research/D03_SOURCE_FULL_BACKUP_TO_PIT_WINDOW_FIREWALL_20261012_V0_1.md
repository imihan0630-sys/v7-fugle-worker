# D03 source-full-backup to PIT-window firewall — 2026-10-12

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED.

## Question

Does the genuine full source D1 export and 113,222-row offline restore make D03 technical-indicator history or PIT windows ready?

## New canonical evidence

- Main merge `2f02b0d9823ad4647e2ccb4dc7f3c43e9c51901e` preserves genuine source D1 native full export Run 38150147134 / Job 114501726086 / Artifact 11706652537.
- The original plaintext SQL has 316,938,975 bytes and SHA-256 `56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12`; plaintext was encrypted before artifact upload.
- Ephemeral offline restoration passes SQLite quick_check, restores 55 tables, 63 indexes, 113,222 total rows and 14 nonempty tables.
- The largest restored materials are 84,688 rows in `s2_historical_a1_bars`, 16,100 pack manifests, 9,723 segment manifests and 2,505 infrastructure checks.
- Frozen decision rows are exactly zero. Independent PIT availableAt validation is false. An independent prior decision anchor is false.
- Main merge `f232c01ee95f28251111c906654173c9f58f7fa0` proves source and destination schema parity for 118 objects, but destination imported rows remain zero.
- Main merge `a33887f44b037f3620cf5954b668d8eebcf1b2d7` adds a secure cross-environment transfer workflow and implementation. No physical workflow run or destination-transfer receipt is associated with the merged commit at this D03 observation cut, so transfer execution remains unverified.

## D03 state model

The following states are cumulative:

1. `SOURCE_FULL_BACKUP_ENGINEER_VERIFIED`: provider full export, encrypted artifact, exact plaintext hash and offline restored counts exist.
2. `SOURCE_BACKUP_INDEPENDENT_AUDIT_ACCEPTED`: an independent auditor re-downloads/decrypts/restores the original artifact and accepts the same bytes, schema and counts.
3. `DESTINATION_TRANSFER_PHYSICAL_VERIFIED`: the encrypted archive is physically rewrapped/decrypted in the destination environment with immutable receipt and no plaintext publication.
4. `DESTINATION_IMPORT_PARITY_VERIFIED`: authorized destination writes complete and independent per-table identity/value/count reconciliation passes.
5. `INDICATOR_WINDOW_PIT_READY`: exact symbol-session history, original causal clocks, action/halt/identity lineage, continuity hashes, target-indicator warm-up and genuine parent binding pass.

Current state is state 1 only.

## Why 84,688 historical-bar rows are not an indicator window

Cross-sectional row count does not reveal:

- symbol count or exact market scope;
- first and last eligible dates per symbol;
- gaps, duplicates or multiple revisions;
- official trading-session eligibility;
- RAW versus adjusted price ancestry;
- corporate-action, halt and identity-transition lineage;
- original firstKnownAt/availableAt at each historical decision cutoff;
- exact per-symbol contiguous depth for ret5/20/60, MA, KD, RSI, MACD, ADX or Bollinger;
- parent population membership or C1 binding.

Therefore 84,688 bars may establish that nonempty historical material exists, but it cannot be divided by an assumed symbol count or translated into a minimum number of sessions. File size, total rows and manifest rows are not substitutes for exact symbol-session coverage.

## Support, counterevidence, alternatives and failure conditions

Supporting evidence:

- Full provider export and exact plaintext digest exist.
- Offline reconstruction verifies schema and total rows.
- Source remained unmodified and source System2 Cron stayed at zero.

Counterevidence:

- Independent audit remains pending.
- Frozen decision population is empty.
- Historical original availability clocks are not independently verified.
- Destination imported rows are zero.
- Secure transfer implementation exists, but physical execution/receipt is not yet proven at this observation cut.

Alternative explanations:

- A valid backup may contain retrospective research history rather than causally available historical decision inputs.
- Many rows may be concentrated in a subset of symbols or dates.
- Manifests may describe packaging integrity without proving market-session completeness.
- An offline restore can be correct while destination import and production-read identity are absent.

Hard failure conditions:

- treating 84,688 bar rows as 84,688 eligible indicator observations;
- inferring sessions by dividing total rows by a guessed symbol count;
- treating encryption or offline restore as independent audit;
- treating merged transfer code as a physical transfer;
- treating destination schema parity as data parity;
- backdating migration or archive timestamps into firstKnownAt;
- filling missing Frozen/PIT evidence with zero, BAD or a current timestamp.

## Module consequences

- D03-10 Bollinger remains L2/40. The backup proves rows exist but not an exact 20-session parent window, W0, price-reset lineage or genuine C1.
- D03-09 ADX remains L2/40. No per-symbol canonical full Wilder replay or independently certified trusted state exists.
- D03-01 through D03-08, D03-12 and D03-13 receive no new PIT-ready exact window or outcome evidence.

## Bias and robustness

- PIT/look-ahead: historical clocks remain unverified; archive/export time cannot replace them.
- OOS/walk-forward: one database backup is one operational cut, not a new economic sample.
- Selection bias: unknown per-symbol/date distribution and zero Frozen decision rows prevent denominator claims.
- Date clustering: UNKNOWN until exact coverage is extracted.
- Multiple testing/overfitting: no parameters or outcomes are inspected.
- Redundancy: no independent information root is added.
- Cost: actual destination indexed write multiplier and daily write schedule remain UNKNOWN.
- Fillability, limits, halts, ex-rights and market-state efficacy remain UNKNOWN.

## Machine falsification

`research/d03_source_full_backup_pit_window_cases_20261012_v0_1.json` defines 20 cases. `research/test_d03_source_full_backup_pit_window_v0_1.mjs` requires the current state to stop at `SOURCE_FULL_BACKUP_ENGINEER_VERIFIED` and rejects backup-to-audit, row-count-to-window, code-to-transfer, schema-to-data, migration-time-to-PIT and history-only indicator promotion.

## Disposition and exact next

No maturity promotion, outcome join, FORMAL_OPTIMIZATION_CANDIDATE or Formal Core change.

Next:

1. Independently re-download, decrypt and restore Artifact 11706652537 before audit acceptance.
2. Physically execute and preserve the cross-environment transfer receipt; merged code is not execution.
3. Before destination import, extract a source manifest keyed by market/symbol/session/source version/value hash and preserve original causal clocks or explicit UNKNOWN.
4. Import in bounded batches with measured indexed writes, then independently reconcile every table/count/key/value.
5. For D03, separately build per-symbol exact eligible-session coverage and continuity/action/halt/identity ancestry.
6. Only then evaluate D03-10 exact 20-session parent windows and D03-09 full replay/trusted state.

D03 remains 56.7%; 12 active modules = 10 L3 + 2 L2; outcomes closed; Formal Core locked.
