# D12-11 correction note

Updated: 2026-09-28 23:14 Asia/Taipei
Status: RESEARCH_ONLY

Existing D12 research already established that the TAIFEX daily TXO option chain includes best bid and best ask fields. The new D12-11 study does not revoke that result.

The unresolved boundary is intraday microstructure: a daily bid/ask observation cannot reconstruct the time path of spreads, quote continuity, displayed depth, queue changes, effective spread, or event-window liquidity stress.

The TAIFEX multidimensional time-weighted spread/depth disclosure identified in the official liquidity portal is explicitly described for Taiwan stock-index futures. It should not be treated as proof of an equivalent historical time-weighted TXO options archive.

Therefore the evidence hierarchy is:
- daily exchange-native TXO chain: prices, volume, OI, best bid/ask and contract identity;
- daily liquidity reference: OI relative to recent five-day average volume;
- intraday quote-path/depth research: WAITING_SOURCE until a genuine timestamped source and entitlement are proven.

Maturity interpretation: D12-11 has enough mechanism, counterexample, source-boundary and falsification definition for L2, but not L3. Formal Core remains unchanged.
