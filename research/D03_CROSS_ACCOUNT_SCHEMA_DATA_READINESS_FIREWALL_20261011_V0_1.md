# D03 Cross-Account Schema/Data Readiness Firewall

Status: RESEARCH_ONLY / PHYSICAL_SCHEMA_PASS / DATA_EMPTY
Date: 2026-10-11 Asia/Taipei
Domain: D03 trend / momentum / reversal / technical indicators
Formal Core impact: NONE / LOCKED

## New evidence consumed

Main commit `a5601d2032b87ec343b263697e31d0aa7924ceb7` seals a real one-time destination D1 schema application:

- owner-authorized Run 38069750915 / Job 114264577475 completed successfully at 2026-10-11 00:58 Taipei;
- the exact preverified 125-statement plan hash was applied once;
- authenticated post-write readback found 55/55 tables, 63/63 named indexes and schema version 1.1;
- artifact 11675494971 ZIP SHA-256 `9ab4da826f679a757a27966fda51b4a569667ce28fd409bdca4f5d3ad277117e` matched;
- source rows copied = 0, source cloud mutations = 0, Workers/Cron created = 0;
- source physical frozen backup verified = false, full migration accepted = false;
- independent post-write audit and actual quota-consumption verification remain pending.

This evidence changes destination schema state only. It does not create D03 price history, PIT lineage, factor state or outcomes.

## H1 — Physical schema readiness is necessary but not data readiness

Support: the destination can now physically store the expected table/index topology, reducing future migration failure risk caused by missing structures.

Counterevidence: all sourceRowsCopied remain zero. Empty but correctly structured tables contain no OHLCV, official sessions, corporate actions, indicator ancestry or parent populations.

Alternative explanation: successful rowless SQL and metadata readback can look operationally complete while every analytical query still returns zero rows.

Failure conditions: treating 55/55 tables, 63/63 indexes or schema 1.1 as proof of data coverage, PIT, W0, indicator input or production go-live.

## H2 — Cross-account migration adds a new clock and identity boundary

Every future migrated row must preserve separately:

1. original source-observation identity and source receipt hash;
2. original firstKnownAt/availableAt when genuinely certified, otherwise UNKNOWN;
3. migrationObservedAt;
4. destinationPersistedAt;
5. source row/value hash;
6. destination row/value hash;
7. migration batch and manifest hash.

Support: separating clocks prevents a 2026-10-11 destination write from being relabelled as availability at an earlier decision cutoff.

Counterevidence: byte-identical source/destination rows can prove storage parity but still cannot create missing original availability evidence.

Failure conditions: overwriting source clocks, using destination insertion time as historical firstKnownAt, dropping source version identity, defaulting UNKNOWN to zero, or accepting row counts without value/hash reconciliation.

## H3 — Data import requires staged D03 admission

1. `SCHEMA_PHYSICAL_READY_DATA_EMPTY`: current state.
2. `DATA_IMPORTED_STORAGE_UNVERIFIED`: rows exist but counts, values, versions or completeness are not independently reconciled.
3. `DATA_STORAGE_PARITY_VERIFIED`: source/destination identities and values match; original PIT remains separate.
4. `PIT_LINEAGE_READY`: original causal clocks, exact symbol sessions, action/halt/identity ancestry and continuity hashes pass.
5. `INDICATOR_INPUT_READY`: target-specific history length/state initialization and parent binding pass.

No state may be skipped. Storage parity cannot imply PIT; PIT cannot imply target-indicator history sufficiency; input readiness cannot imply alpha or outcome evidence.

## D03 target-specific consequences

- D03-10 Bollinger: destination schema can host history later, but current zero rows provide no 20-session parent window, reset lineage, W0 or C1 parent.
- D03-09 ADX: current zero rows provide neither full Wilder replay nor trusted recursive state.
- D03-01/02: MA/retN remain unavailable in the destination until exact-session row migration and causal clocks pass.
- D03-06/07/08/12/13: KD, RSI, MACD, divergence and multi-timeframe state remain unavailable.

## Bias and robustness audit

- PIT/look-ahead: destinationPersistedAt cannot be backdated to source firstKnownAt.
- OOS/walk-forward: schema creation is not a sample, date or outcome.
- Selection bias/date clustering: not applicable to empty schema; any later partial import must report excluded rows and dates.
- Multiple testing/overfitting: no factor parameter or threshold is tested.
- Redundancy: no new information root.
- Costs/fillability/price limits/halts/ex-rights/market regime: UNKNOWN and unchanged.
- Operational cost: actual post-apply quota consumption remains independently unverified and cannot be inferred from 125 statements.

## Current verdict

- destination physical schema: PASS, pending independent audit
- tables/indexes/version: 55/63/1.1
- destination analytical rows: 0
- historical/frozen data migration: not accepted
- D03 PIT/W0/parent/indicator inputs: not ready
- D03 maturity: 56.7%, unchanged
- outcomes: closed
- Formal Core: locked

## Exact next continuation point

Do not rerun the one-time schema apply. Await independent audit of Run 38069750915 and post-apply quota consumption. Before any data copy, require a frozen source manifest with original receipt/version/clock semantics. After copy, independently reconcile source/destination row identities, value hashes, missing/multiversion counts and batch manifest without rewriting UNKNOWN clocks. Only then resume the separate Hot D1 Scout, W0 continuity and genuine C1 parent gates. Schema readiness alone gives no D03 promotion credit.
