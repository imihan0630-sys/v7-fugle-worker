# D03 first physical import: storage versus replay eligibility — 2026-10-12

Status: RESEARCH_ONLY / PHYSICAL_STORAGE_PROGRESS / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED.

## New canonical evidence

Independent audit commit `62db94a99df83d76bc599ddef936c0a96aadb160` accepts the first actual source-to-destination A1 raw-history copy within a narrow G4 storage scope:

- Original writer Run 38220900855 / Job 114716648346 / Artifact 11734734141 succeeded.
- Destination physically inserted 11,785 A1 bars and 129 ingest-batch rows: 11,914 logical rows total.
- Provider-metered billed rows written were 71,226, below the owner's 80,000 UTC-day operational ceiling.
- Independent final readback Run 38224405077 / Job 114728251732 / Artifact 11734969638 observed exactly 11,785 A1 bars and 129 batch rows, zero Frozen decisions and an 11,350,016-byte destination file; readback itself wrote zero rows.
- Source remains 84,688 A1 bars and 113,222 all-table rows. Remaining A1 bars are 72,903; remaining all-table logical rows are 101,308.
- Source System2 Cron remains expected zero; destination Worker/Cron activation is zero; System1 V8 mutations are zero.

## First real billed-write calibration

The observed total exactly satisfies:

`11,785 bars * 6 billed writes + 129 batch rows * 4 billed writes = 71,226`.

This is the first physical calibration supporting the earlier engineering estimate of six billed writes per A1 bar under the present schema/index configuration. It is not a universal provider constant: schema/index changes, retries, conflict handling and different tables can change amplification.

If the remaining 72,903 A1 bars continue to cost six writes each and the 129 batch metadata rows need no rewrite, the optimistic lower-bound remaining cost is 437,418 billed writes. At an 80,000 daily operational ceiling, that requires at least six additional UTC quota days. This is planning arithmetic only, not authorization or a completion forecast, because other writers and retries remain unresolved.

## Three orthogonal readiness axes

### Axis A — storage presence

- A1 storage coverage: 11,785 / 84,688 = 13.9158%.
- Batch metadata storage coverage: 129 / 129 = 100%.
- All logical-row coverage: 11,914 / 113,222 ≈ 10.5228%.

### Axis B — content parity and dependency closure

- Aggregate destination counts match the writer's final receipt.
- Independent per-bar and per-batch source-to-destination content-hash parity is still not certified.
- All 129 batch metadata rows exist while only 13.9158% of bars exist. Therefore batch-row presence cannot certify that the referenced batch payload is complete.
- Source R2 bytes were not copied and destination R2 is not entitled; R2-referencing manifests are not usable historical payload evidence.

### Axis C — causal replay eligibility

- Source A1 has no `firstKnownAt` column.
- Independent PIT-certified bars are 0 / 84,688.
- The 81,086 prospective-upper-bound and 3,602 conservative-finality classifications are not independent provider publication clocks.
- Destination persistence time cannot become historical `availableAt`.
- Transported bars remain `RAW_ARCHIVE_ONLY`, not historical PIT replay inputs.

Indicator readiness requires all three axes, not the maximum of them. Current destination data is physically useful for storage migration and later reconciliation, but D03 indicator-ready rows remain zero.

## Batch completeness firewall

For each `batchId`, destination completeness requires all of:

1. source expected bar count;
2. destination observed unique key count;
3. exact key-set equality;
4. value/version/content-hash equality;
5. no duplicate/conflicting versions;
6. referenced object closure;
7. causal clock status preserved as verified or explicit UNKNOWN;
8. immutable copy-run and readback identity.

The presence of one ingest-batch row is metadata presence only. It must never set `batchComplete=true` without the above reconciliation. Similarly, 129/129 batch metadata does not mean 129/129 batch payloads are complete.

## D03 module implications

- D03-10 Bollinger: no exact clean 20-session parent window is proven. Aggregate 11,785 rows cannot establish any symbol's exact expected-session suffix.
- D03-09 ADX: no canonical full replay or replay-certified state is proven; partial storage cannot seed the recursive state.
- ret5/20/60, MA, KD, RSI, MACD, persistence, divergence and multi-timeframe modules receive storage availability only, not PIT factor evidence.
- A destination query returning rows must expose storage status, content-parity status and causal status separately; one `ready` boolean is insufficient.

## Support, counterevidence, alternatives and failure conditions

Support:

- Genuine destination writes and independent destination readback now exist.
- Actual billed-write amplification is measured rather than estimated.
- Writer stayed below the operational ceiling and did not modify source/System1 or activate Worker/Cron.

Counterevidence:

- 72,903 A1 bars and 101,308 all-table logical rows remain uncopied.
- Per-row content parity is pending.
- PIT-certified rows remain zero.
- Frozen historical anchors and R2 object completeness remain unresolved.
- Daily user-facing selection/runtime is not restored by raw storage.

Alternative explanations:

- Aggregate count equality may coexist with wrong keys or values.
- Batch metadata may describe source batches whose payload is only partly present at destination.
- Exact six-write amplification may change after importer optimization or different conflict/retry paths.
- A symbol may accidentally have 20 rows in the partial destination while still lacking the exact eligible 20-session set or causal lineage.

Hard failures:

- treating 11,785 copied rows as 11,785 PIT-ready observations;
- treating 129/129 batch metadata as full batch payload coverage;
- using the writer's end time as historical availability;
- using aggregate counts instead of exact key/value/version parity;
- deriving Bollinger or ADX readiness from cross-sectional row totals;
- presenting six-day lower-bound arithmetic as a guaranteed completion date;
- claiming selection resumed from raw archive storage.

## Bias and robustness

- PIT/look-ahead: 0 independently certified publication clocks; no historical replay promotion.
- Selection bias: unknown symbol/date composition of copied rows can create complete-case bias.
- Date clustering: destination coverage by date/regime is UNKNOWN until exact census.
- OOS/walk-forward: migration progress is not an economic validation sample.
- Multiple testing/overfitting: no thresholds or outcomes are inspected.
- Redundancy: storage copies add no independent information root.
- Cost: 71,226 is a real operational migration cost, not trade cost; future importer/retry amplification remains conditional.
- Fillability, limits, halts, ex-rights, regime and alpha remain UNKNOWN.

## Disposition and exact next

No maturity promotion, outcome join, FORMAL_OPTIMIZATION_CANDIDATE, or Formal Core change.

Next:

1. Preserve the same-day single-writer stop after 71,226 metered writes.
2. On future quota days, continue resumable raw copy without rewriting already accepted rows and record actual amplification.
3. Independently reconcile per-batch and per-bar source/destination key, value, version and content hashes; derive true complete-batch count rather than metadata-row count.
4. Keep all transported bars in RAW/PIT-quarantined state until original publication clocks or an accepted causal alternative exists.
5. Only after exact symbol-session coverage, dependency closure and causal lineage may D03 evaluate Bollinger exact-20 and ADX full replay.

D03 remains 56.7%; 12 active modules = 10 L3 + 2 L2; D03-09 and D03-10 remain L2/40; outcomes closed; Formal Core locked.
