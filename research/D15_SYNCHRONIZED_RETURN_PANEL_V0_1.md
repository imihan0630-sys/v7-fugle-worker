# D15 Synchronized Return Panel Contract v0.1

Date: 2026-09-30 Asia/Taipei  
Status: RESEARCH_ONLY / CONTRACT_READY / REAL_PANEL_NOT_READY  
Owners: D15-03 Correlation, D15-04 Covariance Shrinkage, D15-05 Hierarchical Clustering, D15-06 Effective Bets  
Formal Core: LOCKED

## Question

Does the newly validated TWSE/TPEx official OHLC capability remove the D15 synchronized-history blocker?

**No — not yet.**

It materially improves source feasibility, but the evidence needed for covariance and independent-risk inference is stricter than “historical OHLC can be fetched.”

## Positive evidence

The D03 official-source pilot shows:
- official TWSE/TPEx OHLC payloads can be captured;
- same-date cross-contract economic values have strong parity;
- short-window and after-hours replay is materially stable;
- a fixed-cadence hash ledger now exists.

System1 V8.12 also has:
- raw daily-history source/freshness revalidation;
- fail-closed handling of missing official traded bars versus verified no-trade gaps.

These are genuine improvements.

## Falsification: source availability is not synchronized-return readiness

The shortcut

`official OHLC exists -> D15 correlation/covariance is ready`

is rejected.

Current blockers:

1. **D03 fixed-cadence observer does not persist per-symbol rows.**  
   Raw multi-megabyte payloads are transient; the durable artifact stores object hashes/metadata, so D15 cannot later reconstruct a 60-return panel from that ledger.

2. **System1 D1 history is RAW / adjusted=false.**  
   Source admission and freshness do not certify comparable economic returns across a corporate-action boundary.

3. **RAW_HISTORY_ADMISSION != continuity certification.**  
   The shared technical-continuity contract explicitly keeps corporate-action continuity and symbol-session certification separate.

4. **Shared continuity runtime is still BLOCKED and symbol-session runtime completeness is PARTIAL.**

5. **There is no already-authorized D15 read surface exposing an immutable per-symbol PRICE_INDEX_COMPARABLE panel with row-level as-of provenance.**

Therefore D15-03/04/05/06 remain L2.

## Why RAW_EXECUTION is prohibited for the primary covariance panel

A mechanical 2:1 price reset can create an observed raw price move near -50% even when the economic path is flat.

If two securities experience unrelated mechanical resets and the raw moves are treated as economic returns, covariance/correlation can be materially distorted.

D15 must not solve this by inventing a second adjustment engine.

Primary research space:
`PRICE_INDEX_COMPARABLE`.

A separate:
`TOTAL_RETURN_COMPARABLE`
panel may be studied later, but the two spaces cannot be mixed.

## Exact common support

Primary policy:
`EXACT_LISTWISE_COMMON_SUPPORT`.

Every symbol must use the same ordered session vector.

Prohibited:
- pairwise deletion;
- zero-return imputation for suspension/missing bars;
- pseudo-bars;
- silent forward fill.

Pairwise deletion is especially dangerous because AB correlation, AC correlation and BC correlation could each use different dates, producing a matrix that no longer represents one common state of the world.

## PIT identity

A valid panel binds:
- parentDecisionReceiptId;
- exact parent selected set;
- asOf;
- panel version and return space;
- exact common sessions;
- per-symbol sourceReceiptId/sourceHistoryHash;
- continuityReceiptId;
- symbol-session contract;
- corporate-action registry version;
- row source hashes and availableAt clocks.

Rows known after asOf fail closed.

## First transparent diagnostic

Once a real panel passes:
- use log close-to-close returns;
- 61 comparable closes -> 60 synchronized returns;
- compute sample covariance/correlation as the transparent baseline.

Do not immediately optimize weights.

Ledoit-Wolf-style shrinkage, clustering, downside dependence, eigen risk dimension and Meucci Effective Bets remain separate preregistered studies.

## Price-limit constrained rows

A price-limit-constrained row is not deleted.

If any are present:
`VALID_CONSTRAINED`.

That panel belongs to a separate robustness stratum because daily observed prices may reflect constrained price discovery.

## Current maturity decision

- D15-03 Correlation: L2/40 unchanged.
- D15-04 Covariance Shrinkage: L2/40 unchanged.
- D15-05 Hierarchical Clustering: L2/40 unchanged.
- D15-06 Effective Bets: L2/40 unchanged.

A schema, public-source capability and synthetic test do not constitute a real Taiwan PIT synchronized panel.

## Cross-lane dependency

D15 consumes canonical source/session/corporate-action receipts.

It must not:
- build its own corporate-action adjustment engine;
- add duplicate provider calls solely for D15;
- relabel D03 whole-payload hashes as per-symbol return evidence.

## Exact next continuation

1. Shared source/continuity owner exposes an immutable per-symbol comparable-price panel receipt.
2. Bind it to the exact D15 parent selected set and asOf.
3. First real read-only D15 audit uses 60 synchronized returns with exact listwise support.
4. Report constrained price-limit panels separately.
5. Only after independent dates accumulate test shrinkage, cluster stability and independent-risk dimension.
6. Effective Bets remains blocked until a validated covariance/factor decomposition exists.
7. No Formal optimization candidate.
