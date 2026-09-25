# Passive Flow & Index Rebalancing Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: PF-001 through PF-034 complete.
Status: CONCEPT_COMPLETE / SOURCE_MAP_COMPLETE / EVIDENCE_BUILD_PENDING.
Next: improve constituent/AUM/close-auction source contracts before outcome testing.

## Durable conclusions
- Index membership/weight events are a separate causal channel from company fundamentals.
- Announcement and effective dates are separate clocks.
- Taiwan research directly documents benchmark-driven foreign trading around MSCI Taiwan changes; indexers cluster activity near effective dates while non-indexers can position earlier.
- Additions/deletions show abnormal price/volume effects but are asymmetric and can reverse; no automatic bullish/bearish interpretation.
- Closing-auction benchmark execution can contaminate breakout volume and foreign-flow interpretation.
- Derivatives expiry is a separate closing-auction confounder.
- Membership changes and weight changes are distinct.
- Passive-flow estimates require uncertainty; ETF AUM is only partial tracker exposure.
- Event-date index weights are mandatory.
- Passive Flow owns the benchmark-mechanical context; Price-Volume/Institutional Flow retain their own signals.
- No hindsight prediction of future inclusion.
- Multi-index overlaps require deduplication.
- First empirical protocol and minimal Shadow schema are frozen.
- Formal Core remains LOCKED.

## Exact next continuation
PF-025 historical index-review source feasibility.
PF-026 local passive ETF AUM/benchmark mapping.
PF-027 overlapping-event deduplication.
PF-028 existing recorder support for effective-close distortion.
PF-029 evidence-readiness/capture proposal.


## PF-025 through PF-034 durable update
- MSCI official historical review archive supports deterministic announcement/effective event clocks; four-cycle sample validated for Nov-2025, Feb-2026, May-2026 and Aug-2026.
- Official review pages expose additions/deletions artifacts, but a stable deterministic unauthenticated detailed constituent-file parser contract is not yet frozen. Event clocks GO; complete constituent parser PARTIAL.
- TWSE ETF current benchmark mapping/current AUM is strong; monthly AUM is available on product pages, but exact historical daily AUM for every event date is not yet verified.
- Dedup hierarchy frozen: one underlying benchmark event, tracker exposure aggregated by benchmark, cross-index overlaps retained separately. Leveraged/inverse/active funds are not added blindly.
- Current major tracker map confirms 0050 and 006208 share Taiwan 50; 0057 and 006203 share MSCI Taiwan. Current AUM must never be backfilled to historical event dates.
- Existing V8.8 recorder cannot isolate 13:25–13:30 closing-auction distortion; late-session 15m bars are only coarse proxies.
- Outcome testing remains DATA-GATED until complete constituent rows are deterministic. Exact passive-flow NTD is not inferable from current data.
- Formal Core unchanged.
