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


## PR-049 — journalTradeStats is signal-path return, not realized P&L (2026-09-27)

A source-level semantics audit of `journalTradeStats()` confirms:

- entry = first persisted BUY signal `market_price`;
- exit = first persisted SELL or STOP_LOSS signal `market_price` after that BUY;
- return = signal-price percentage change;
- OPEN episodes are excluded from completed win/loss/flat statistics;
- ADD/REDUCE/PROFIT_CHECK remain recorded but do not alter the main return formula;
- allocation amount/shares do not enter the return calculation;
- broker fills, partial fills, fees and slippage do not enter.

Therefore the correct name is:

`SIGNAL_PATH_ROUND_TRIP_RETURN`.

It must not be interpreted as:
- realized broker return;
- execution P&L;
- allocation/sizing P&L;
- unbiased all-plan win probability.

### Censoring

The reported winRate and averageReturnPct are conditional on episodes that already produced both:
1. a positive durable BUY signal row; and
2. a later qualifying SELL/STOP_LOSS signal row.

OPEN episodes are right-censored and excluded. The metric can therefore change simply because open episodes later terminate.

### Portfolio Risk implication

This metric cannot validate PriorityScore sizing because:
- the main return is unweighted by allocation;
- amount/shares are absent;
- fill evidence is absent;
- costs are absent.

It remains useful as a signal-lifecycle diagnostic and as descriptive positive-event path evidence, provided the terminology and coverage limits are explicit.

Artifact:
`research/signal_path_return_semantics_v0_1.json`.

Test:
`tests/test_signal_path_return_semantics_v0_1.mjs`.

Status:
`SIGNAL_PATH_METRIC_ONLY / REALIZED_PNL_NOT_PROVEN / SIZING_VALIDATION_FORBIDDEN`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-048 — positive BUY signal can reconstruct live suggestedShares exactly (2026-09-27)

PR-047 established that a persisted V8.5 BUY signal row is strong positive evidence of the formal BUY signal's `market_price` and `occurred_at`.

Current runtime `buildPushPayload` recomputes BUY `suggestedShares` as:
`floor(signal.amount / result.currentPrice)`.

V8.5 signal journal persists from that same event:
- `signal_amount = signal.amount`;
- `market_price = result.currentPrice`.

Therefore a complete positive BUY row exactly reconstructs:
`live suggestedShares = floor(signal_amount / market_price)`.

This is signal-side quantity only, not broker execution.

Certified:
event identity, timestamp, signal price, signal amount, exact signal-side suggestedShares and one-share orderability.

Not certified:
broker order acknowledgement, actual fill, fill price/probability, partial fill, fees, slippage, or NO-BUY absence.

Artifacts:
`research/buy_signal_quantity_reconstruction_v0_1.mjs`;
`research/buy_signal_quantity_reconstruction_contract_v0_1.json`.

Status:
`POSITIVE_BUY_SIGNAL_QUANTITY_RECONSTRUCTABLE / FILL_EVIDENCE_STILL_SEPARATE`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


## PR-050 — Production positive-signal audit: one BUY, no sizing identification yet (2026-09-27)

Read-only Production audit run:
- workflow run: `36329306700`;
- job: `108648065662`;
- endpoint: `/api/journal?days=365`;
- no Production writes.

Observed durable signal rows:
- total signals = 1;
- BUY = 1;
- terminal SELL/STOP_LOSS = 0.

The positive BUY is:
- symbol: 3006;
- plan scan date: 2026-09-21;
- trade date: 2026-09-22;
- signal time: 2026-09-22 11:31:33 Taipei;
- signal market price: 282.5;
- signal amount: NT$42,000;
- exact reconstructed live suggestedShares: 148;
- plan linkage: positive;
- selected-count on the plan date: 1.

### What this real row establishes

It validates the PR-047/048 positive-event evidence chain against Production:
`selected plan -> BUY signal event -> exact signal price -> exact amount -> exact suggestedShares`.

### What it cannot establish

The 2026-09-21 plan date contains only one selected name.
Therefore current / equal-capital / equal-risk allocation comparisons are identical and this row is **non-identifying for sizing**.

There is no terminal SELL/STOP_LOSS signal row yet, so no completed signal-path round trip exists.

There is still no broker-confirmed fill ledger, so no realized P&L exists in the research evidence.

The signal reader remains bounded at LIMIT 6000 with no truncation flag; missing BUY rows remain UNKNOWN rather than NO-BUY.

Durable receipt:
`research/positive_signal_production_audit_receipt_20260927.json`.

Status:
`ONE_POSITIVE_BUY_CONFIRMED / SINGLE_NAME_NONIDENTIFYING_FOR_SIZING / NO_TERMINAL_SIGNAL / REALIZED_PNL_BLOCKED`.

No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.


### PR-050 addendum — Production plan-preview vs live suggested-share drift

For the same 3006 BUY:
- plan buyHigh = 287.08;
- stored plan firstShares = 146;
- recomputing NT$42,000 / 287.08 also gives 146;
- live BUY trigger price = 282.5;
- live suggestedShares = 148.

So the observed Production row confirms the designed semantic split:
`plan firstShares = preview at plan price`,
while
`live suggestedShares = recomputed at observed trigger price`.

The +2 shares are not a fill claim. They prove only that plan preview quantity must not substitute for live signal-side quantity in execution research.
