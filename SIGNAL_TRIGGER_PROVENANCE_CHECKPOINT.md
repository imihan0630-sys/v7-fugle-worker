# Signal Trigger Provenance Checkpoint

## PR-047 — V8 BUY signal provenance

Status:
`POSITIVE_BUY_SIGNAL_PRICE_DURABLE / V8_EXECUTION_CONTEXT_PARTIAL / NO_BUY_DENOMINATOR_UNCERTIFIED / FILL_EVIDENCE_SEPARATE`

### Positive BUY evidence
V8.5 patch-chain creates `v8_trade_journal_signals` and writes a signal row before push delivery.

A persisted BUY row with event identity, symbol, trade date, `occurred_at` and `market_price` is strong positive evidence that the Formal BUY signal occurred at that signal price/time.

The price is a Formal SIGNAL price, not a broker fill.

### Absence is not NO-BUY
Signal-journal persistence is fail-open: journal failure logs a warning while Formal signal/push processing can continue.

Therefore:
`missing BUY row != proven NO_BUY`.

Missing remains UNKNOWN unless independent plan-level monitor/recorder completeness is positively proven.

### Shares
Journal `signal_shares` comes from the signal/plan quantity.
Live BUY push later recomputes `suggestedShares = sharesFor(signal.amount,currentPrice)`.

Do not reuse journal signal_shares as the exact live counterfactual order quantity.

### V8.8 execution Shadow
V8.8 records milestone contexts only:
- OPEN_BASELINE
- FIRST_10M_COMPLETE
- FIRST_15M_COMPLETE
- FIRST_30M_COMPLETE
- FORMAL_SIGNAL_OBSERVED

It records only `result.ok`, fails open, has no EOD NO_BUY terminal event, and the reader is newest-first LIMIT 500 with only recent 80 exposed.

Thus it provides execution context but cannot certify a complete no-BUY session.

### Bulk reader limits
`/api/journal` signal read is LIMIT 6000 with no truncation flag.
Do not infer historical absence/completeness from a bounded response.

### Required continuation
Reuse the already frozen B-145 Class-B recorder-completeness contract rather than inventing another coverage definition:
- exact trade-date equality
- pre-pagination totalRows
- deterministic pagination/cursor
- explicit hasMore/truncated
- per-event/per-symbol exact-date counts
- COMPLETE/INCOMPLETE/UNKNOWN with named missingReason
- persisted post-recorder run receipt with expected event types/symbols, attempted/stored/skipped, failOpen/error class

Until such coverage is positively observable:
- BUY row present = positive BUY signal evidence
- BUY row absent = UNKNOWN
- actual fill remains a separate Confirmed Fill Ledger problem

Formal Core unchanged. No FORMAL_OPTIMIZATION_CANDIDATE.


## PR-048 — positive BUY signal can reconstruct live suggestedShares exactly (2026-09-27)

PR-047 established that a persisted V8.5 BUY signal row is strong positive evidence of the formal BUY signal's `market_price` and `occurred_at`.

PR-048 closes the next signal-side quantity question.

Current runtime:
`buildPushPayload` recomputes BUY `suggestedShares` as:

`sharesFor(signal.amount, result.currentPrice) = floor(signal.amount / currentPrice)`.

V8.5 signal journal persists, from that same signal occurrence:
- `signal_amount = signal.amount`;
- `market_price = result.currentPrice`.

Therefore, for a complete positive BUY row:

`live suggestedShares = floor(signal_amount / market_price)`

is exactly reconstructable after the fact.

This is stronger than the stored `signal_shares`, which is the plan/signal quantity and must not be treated as the live recomputed quantity.

### Evidence boundary

Certified:
- positive formal BUY event identity;
- signal timestamp;
- signal market price;
- signal amount;
- exact live signal-side suggestedShares;
- whether the suggested quantity is at least one share.

Still not certified:
- broker order acknowledgement;
- actual fill;
- fill price;
- fill probability;
- partial fill;
- fees;
- slippage;
- complete NO-BUY denominator.

Thus the execution evidence ladder is now:

`selected plan -> formal BUY trigger -> exact signal price -> exact signal amount -> exact suggestedShares -> [broker fill gap]`.

Executable reconstruction:
`research/buy_signal_quantity_reconstruction_v0_1.mjs`.

Contract:
`research/buy_signal_quantity_reconstruction_contract_v0_1.json`.

Status:
`POSITIVE_BUY_SIGNAL_QUANTITY_RECONSTRUCTABLE / FILL_EVIDENCE_STILL_SEPARATE`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.
