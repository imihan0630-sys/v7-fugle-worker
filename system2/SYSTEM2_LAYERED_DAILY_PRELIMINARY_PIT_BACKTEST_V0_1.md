# System2 layered daily preliminary selection / PIT / backtest separation V0.1

Date: 2026-10-14 Taipei. Status: OWNER-APPROVED_LAYERED_RESEARCH_IMPLEMENTATION.
Class A research-only; System1 V8 / System2 existing final SHORT_MOMENTUM V0.1-CONTRACT unchanged.

## Explicit independent gates

A — PRELIMINARY DAILY PRICE/VOLUME WATCH:
- Requires a newly observed same-session TWSE+TPEx 61-session source with exact 122/122 pairs, independent original-body verification, market-date clocks and hash-bound source ledger.
- For the current physical observation ONLY (not historical replay), uses raw close > last 20 official-session close arithmetic mean, strictly positive 5-session price change and nonzero same-date share volume and turnover. These are **transparent descriptive observations**, not optimized alpha weights, final strategy scoring, issuer-specific recommendations, validated performance or official ranks.
- Reject incomplete 61-bar source; quarantine raw adjacent close jump >20% as a potential corporate-action/price-space hazard **without claiming any cause**. All output names are tagged `UNKNOWN_NOT_CLEARED` for corporate-action PIT and uncertified Regime. Never creates `CLEAR_NO_ACTION`, adjusted OHLC or formal historical first-known.
- Maximum displayed research observations 30, sorted by **reported 5-session raw return only**, never S2 final rank or buy priority. Preserve total matched and all-universe denominators. Always retain `selectedCount=null`, `zeroPickDay=null`, no triggers/stop/targets/Frozen. This lane may offer useful daily observation even when original historical correction versions remain unknown.

B — FORMAL SYSTEM2 SHADOW:
- Existing strategy-specific `SHORT_MOMENTUM V0.1-CONTRACT` Stage1 remains independent and unchanged. Per-symbol actual PIT and CA continuity, complete original-day provenance, necessary factors/RR, eligible regime, rank/capacity and daily append-only D1 Frozen independent readback are still gates.
- Missing facts remain UNKNOWN. Observational A must not implicitly be promoted into B. Empty watchlist is not certified zero-pick.

C — HISTORICAL RESEARCH / PERFORMANCE:
- Incomplete PIT vintage may be used ONLY to diagnose missing fields/causal leaks, not to certify annualized returns, win rate, risk-adjusted or after-cost alpha.
- Only date/symbol/factor slices proven by firstKnownAt/availableAt, corrections/retractions vintage, corporate-action source versions, costs/slippage, OOS/forward and date/regime representativeness may become certified backtest outcomes. Partial coverage must be disclosed and not extrapolated.
- Forward decisions accumulate genuine decision-time receipts prospectively, never backdate frozen decisions.

This policy is distinct from first system V8 and cannot silently update its Formal Core, funds, signals or Cloudflare runtime. Any change to System2 selected-rank criteria must version and pass proper evaluation.
