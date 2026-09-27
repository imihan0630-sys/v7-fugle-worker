# Execution Shadow Signal Attribution Checkpoint

## PR-048

V8.8 `FORMAL_SIGNAL_OBSERVED` is triggered at the monitor-run level when **any** notification exists.

The recorder then loops that event type across every `result.ok` symbol.

For a symbol with no matching notification, its event key falls back to literal `SIGNAL`.

Therefore:

- `event_type = FORMAL_SIGNAL_OBSERVED` alone **must not** be treated as evidence that the row symbol had a signal.
- `event_key = SIGNAL` is context-only and fails closed for symbol-level signal attribution.
- Positive symbol-level attribution requires parseable signalId(s) embedded in event_key and every signalId symbol must equal the row symbol.
- V8.5 `v8_trade_journal_signals` remains the preferred positive source for formal signal occurrence and market_price.
- Neither source proves broker fill.

This is research-observability semantics only. Formal selection, A/B, signals, monitoring, push and capital are unchanged.

Status:
`CROSS_SYMBOL_CONTEXT_CONTAMINATION_CONFIRMED / FAIL_CLOSED_ATTRIBUTION_REQUIRED`.
