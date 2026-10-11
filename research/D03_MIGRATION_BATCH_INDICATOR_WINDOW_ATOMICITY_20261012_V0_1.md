# D03 migration-batch indicator-window atomicity — 2026-10-12

Status: RESEARCH_ONLY / CORRECTION_RECORDED / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED.

## Correction to TI-1793~1812

The prior D03 observation incorrectly concluded that secure-transfer code had no physical run or receipt because commit-associated workflow lookup returned no run. Fresh canonical evidence proves otherwise:

- Run 38151167952 on exact head `a33887f44b037f3620cf5954b668d8eebcf1b2d7` completed three successful jobs: destination key generation, source rewrap, and destination verification.
- Artifact 11706559841 preserves the transfer receipts with ZIP SHA-256 `65c64f76c3bcabb5e89304af6e8d996fd134044b0be73b417e5f192a16e20eb4`.
- Artifact 11705783748 preserves the RSA-wrapped source SQL transfer with ZIP SHA-256 `68c0244edb03c3239ff7e3cb7b50b5b5abf6d7c75c47839175e45fdba0936957`.
- The destination-protected runner decrypted the archive, restored SQLite offline, performed a native destination GET, and made no destination D1 import.

Therefore `DESTINATION_TRANSFER_PHYSICAL_VERIFIED` is PASS as an independent gate. `SOURCE_BACKUP_INDEPENDENT_AUDIT_ACCEPTED`, `DESTINATION_IMPORT_PARITY_VERIFIED`, and `INDICATOR_WINDOW_PIT_READY` remain pending. The gate model is a vector, not a strictly ordered scalar: a later operational gate can pass while an earlier audit gate remains open.

## New destination and quota evidence

Run 38174567933 / Job 114574078061 / Artifact 11715650509 physically read the destination at 2026-10-12 05:00:46 Asia/Taipei:

- 55 application tables, one Cloudflare-reserved table, and 63 named indexes;
- 987,136 current database bytes;
- zero imported historical rows in all 13 populated source-data tables;
- one existing `s2_schema_meta` row;
- zero physical data writes and zero source D1 queries in the preflight.

The account-level GraphQL read was not authorized, so same-UTC-day spendable write headroom and analytics lag remain UNKNOWN. Merge `e266ae7f7b84e63c299ff50ef09cb20bfca97970` adds a separately permissioned, manual, destination-only account analytics reader, but no physical run exists at this observation cut. Even a successful future GraphQL sample is a lag-unknown lower bound, not real-time spendable quota.

## Why “80% of logical rows” is not a safe migration objective

The frozen source catalog contains 113,222 logical rows. Four-fifths is 90,578 logical rows. To reach that target, at least 62,044 bar rows are required. Each bar has a conservative named-index billed-write lower bound of four and an expected auto-primary-key plus unique-index cost of six. The catalog's minimum one-day billed-write estimate is 276,710 even before all non-bar indexed costs. This exceeds the free daily cap of 100,000.

Consequences for D03:

1. Logical row percentage is not billed-write percentage.
2. Cheap tables or arbitrary row prefixes must not be selected merely to maximize migrated row count.
3. A partial symbol history can falsely appear to have enough rows while missing exact eligible sessions.
4. Manifests without referenced objects, or bars without causal/action/continuity dependencies, are not indicator-ready.
5. Daily batches must preserve retry idempotence and measure actual billed writes; estimates do not authorize spending.

## Indicator-window atomic migration unit

A D03-ready unit is not one database row. It is a closure-bound tuple:

`market + symbol + decisionCutoff + indicatorFamily + exactExpectedSessions + selectedSourceVersions + valueHashes + causalClocks + action/halt/identity lineage + continuityHash + parentBinding`.

Admission requires:

- complete expected-versus-observed session-set equality;
- no duplicate or unexpected older-session substitution;
- all selected rows from one consistent version policy;
- original `firstKnownAt`/`availableAt`, or explicit UNKNOWN with no PIT promotion;
- corporate-action, halt/resume, symbol-identity and RAW/adjusted ancestry closure;
- referential closure for manifests and referenced payloads;
- immutable source and destination identity/value reconciliation;
- measured indexed writes and retry/dedup receipt;
- no inference from migration order or destination persistence time.

For Bollinger, a clean exact 20-session parent window may be an atomic unit only after reset/continuity and parent binding pass. For ADX, a 20-row suffix is insufficient: canonical Wilder full replay or an independently replay-certified state plus exact continuation rows is required.

## Support, counterevidence, alternatives, failures

Support:

- Physical secure transfer and offline restore prove transport feasibility.
- Physical destination readback proves schema-ready but data-empty state.
- Exact source table counts and index counts permit conservative billed-write analysis.

Counterevidence:

- Source independent PIT/Frozen audit remains pending.
- Destination account headroom is UNKNOWN.
- No destination data import, batch billing measurement, retry receipt, or source/destination data parity exists.
- Historical bars still lack proven exact per-symbol eligible-session coverage and causal lineage.

Alternative explanations:

- A high billed-write multiplier may arise from indexes rather than duplicated logical data.
- A successful transfer proves cryptographic transport, not production import.
- A low row-count batch may be more useful than a larger batch if it completes exact indicator windows and dependencies.

Hard failures:

- treating 90,578 logical rows as feasible under 100,000 billed writes;
- importing an arbitrary first N rows and calling it 80% complete;
- splitting one exact indicator window across unverified batches and promoting the partial result;
- importing bars without required lineage or referenced payload closure;
- using destination write time as historical availability;
- converting missing quota, clock, or dependency evidence into zero or PASS.

## Bias and validation

- PIT/look-ahead: migration time cannot replace original causal clocks.
- Selection bias: migration priority must not cherry-pick symbols/dates because they are cheap or complete.
- Date clustering: each admitted unit needs exact session coverage; aggregate row counts are insufficient.
- OOS/walk-forward: migration is infrastructure evidence, not an economic sample.
- Multiple testing/overfitting: no indicator thresholds or outcomes are inspected.
- Redundancy: no new information root or alpha is created.
- Cost: actual billed writes per table and retry remain UNKNOWN until bounded physical import.
- Fillability, limits, halts, ex-rights, regime and outcomes remain UNKNOWN.

## Disposition and exact next

No maturity promotion, outcome join, FORMAL_OPTIMIZATION_CANDIDATE, or Formal Core change.

Next:

1. Independently audit the original source backup, PIT clocks, and Frozen absence/presence.
2. Physically run the destination account analytics reader after least-privilege authorization, but retain UNKNOWN spendable headroom unless freshness or an equivalent write ledger is bounded.
3. Design a first bounded, idempotent import canary that cannot create a partial D03-ready window; measure actual billed writes including indexes and retries.
4. Reconcile source and destination counts, keys, values, versions and dependency closure for the canary.
5. Build exact per-symbol eligible-session and lineage coverage before any Bollinger or ADX admission.

D03 remains 56.7%; 12 active modules = 10 L3 + 2 L2; D03-09 and D03-10 remain L2/40; outcomes closed; Formal Core locked.
