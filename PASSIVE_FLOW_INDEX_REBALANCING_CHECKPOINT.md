# Passive Flow & Index Rebalancing Checkpoint

Updated: 2026-09-28 Asia/Taipei
Current cursor: PF-001 through PF-036 complete.
Status: CONCEPT_COMPLETE / SOURCE_MAP_COMPLETE / BOUNDED_MSCI_MEMBERSHIP_CONTRACT_VALIDATED / SOURCE_LICENSE_GATE / OUTCOME_DATA_GATED.
Next: seek an authorized/licensed prospective membership-event source contract; separately improve weight-change/non-MSCI/AUM/close-auction coverage before outcome testing.

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

## PF-025 through PF-034 durable update
- MSCI official historical review archive supports deterministic announcement/effective event clocks; four-cycle sample validated for Nov-2025, Feb-2026, May-2026 and Aug-2026.
- TWSE ETF current benchmark mapping/current AUM is strong; monthly AUM is available on product pages, but exact historical daily AUM for every event date is not yet verified.
- Dedup hierarchy frozen: one underlying benchmark event, tracker exposure aggregated by benchmark, cross-index overlaps retained separately. Leveraged/inverse/active funds are not added blindly.
- Current major tracker map confirms 0050 and 006208 share Taiwan 50; 0057 and 006203 share MSCI Taiwan. Current AUM must never be backfilled to historical event dates.
- Existing V8.8 recorder cannot isolate 13:25–13:30 closing-auction distortion; late-session 15m bars are only coarse proxies.
- Exact passive-flow NTD is not inferable from current data.

## PF-035 through PF-036 durable update
- Re-audit materially narrows the earlier PF-031 blocker: for the bounded universe `MSCI | GLOBAL_STANDARD | TAIWAN | PERIODIC_REVIEW | MEMBERSHIP_ADD_DELETE`, official public-list artifacts were validated across four consecutive cycles (Nov-2025, Feb/May/Aug-2026).
- Each cycle has a Taiwan summary count and an `MSCI TAIWAN INDEX` country section; summary added/deleted counts reconcile exactly to the country-section rows.
- A narrow negative-evidence state is methodologically valid: `NO_MSCI_STANDARD_MEMBERSHIP_ADD_DELETE_VERIFIED`, only when the official artifact, publication/effective clocks and count invariant pass.
- This state does NOT prove `NO_INDEX_EVENT`, `NO_WEIGHT_CHANGE`, `NO_PASSIVE_FLOW` or active institutional conviction. Broader `ORDINARY_FLOW_CONTEXT_VERIFIED` remains unavailable.
- PIT guard: if exact publication timestamp is not auditable, do not make event information usable before the next Taiwan trading session after provider publication date.
- New source-use guard: public accessibility does not establish a right to build an automated persistent database/analytics feed. MSCI public-list materials contain use restrictions; persistent ingestion requires an authorized/licensed source or permission determination.
- Research receipt: `research/msci_standard_taiwan_membership_negative_evidence_contract_v0_1.json`.
- Outcome testing remains CLOSED/DATA-GATED; no Formal score, veto, ranking or runtime change.

## Exact next continuation
1. Audit an authorized/licensed source path that can prospectively reproduce the bounded MSCI membership-event receipt with first-known/PIT metadata.
2. Continue independent source contracts for weight-only changes and non-MSCI index families; absence from the add/delete list is not broad passive-flow absence.
3. Keep ETF AUM as exposure context only until event-date historical AUM is verified.
4. Keep effective-close auction attribution blocked until suitable close-auction data exist.
5. Institutional-flow lane may consume the bounded membership state as a contamination control only; it must retain UNKNOWN for broader passive context.
6. Do not start PF outcome tests until the intended event universe and authorization/source-quality gates are satisfied.
