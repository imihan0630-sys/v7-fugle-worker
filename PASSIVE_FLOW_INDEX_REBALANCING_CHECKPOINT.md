# Passive Flow & Index Rebalancing Checkpoint

Updated: 2026-09-28 Asia/Taipei
Current cursor: PF-001 through PF-042 complete.
Status: CONCEPT_COMPLETE / SOURCE_MAP_COMPLETE / BOUNDED_MSCI_MEMBERSHIP_CONTRACT_VALIDATED / ETF_NET_UNITS_PROSPECTIVE_CONTRACT_READY / SOURCE_LICENSE_AND_HISTORY_GATES / OUTCOME_DATA_GATED.
Next: validate prospective ETF units-delta + PCF timestamp/corporate-action semantics on a bounded domestic in-kind sample; seek authorized/licensed membership-event sources; separately improve weight-change/non-MSCI/historical-PIT/close-auction coverage before outcome testing.

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

## PF-037 through PF-038 durable update
- TWSE issuer integration contract exposes outstanding ETF units plus day-over-day unit difference with data date/time; this is a cleaner net fund-size-flow observable than AUM delta.
- AUM delta is confounded by NAV/market-value movement because AUM = Units × NAV.
- Daily PCF provides the in-kind creation/redemption basket context; only provenance-complete in-kind products may support a MODELED_PRIMARY_BASKET_EXPOSURE.
- Net units delta is not gross creations/redemptions and is not actual stock execution. Zero net units can hide offsetting gross creation/redemption.
- Cash creation/redemption, cash substitution, AP inventory/hedging and execution timing prevent exact stock-level trade inference.
- ETF split/reverse-split can mechanically change unit counts; corporate-action guard is mandatory.
- Current interface proves prospective PIT feasibility, not a complete historical first-known archive. Historical units/PCF backfill remains UNKNOWN until immutable provider vintages are verified.
- Benchmark rebalance, ETF fund-size creation/redemption and secondary-market ETF trading are separate causal channels.
- Machine receipt: `research/passive_flow_etf_units_pcf_contract_v0_1.json`.
- No outcome test and no Formal change.

## Exact next continuation after PF-038
1. Validate a bounded prospective sample of domestic Taiwan-equity in-kind ETFs: units delta, timestamps, creation unit, PCF use-date and cash-substitution state.
2. Freeze split/reverse-split and other unit-changing corporate-action handling.
3. Keep historical first-known units/PCF archive status UNKNOWN until authoritative immutable vintages are proven.
4. Keep modeled basket exposure separate from actual passive stock trading.
5. Do not start outcomes until clean prospective receipts and passive-event universe coverage pass.

## PF-039 durable update
- TWSE 115 年 ETF 申贖流程證明 ISSUES-DIFF 不是單純 same-day net creation/redemption（當日淨申贖）：它還包含 T-2 複審失敗回沖與雙幣 ETF 單位轉換。
- 因此 units delta 仍比 AUM delta 更接近基金規模變化，但安全語意收窄為 `REPORTED_OUTSTANDING_UNIT_CHANGE_WITH_OPERATIONAL_ADJUSTMENTS`。
- PCF 可於 T 日更新／重傳，必須保存版本、use-date、capturedAt、firstKnownAt 與標準雜湊；後下載版本不得回填較早決策時點。
- 0050 2026-10-01 units delta = 0 是負控制：不能證明 gross creation/redemption 都是 0。
- 0056 2026-10-01 units delta = +27.5m、creation unit = 0.5m，只能稱 55 個 creation-unit-equivalent（申贖基數等值），不得稱實際 55 筆申購或實際個股買盤。
- D06-16 ETF Mechanics（ETF運作機制）已建立完整機制＋反證＋PIT＋防重複計票契約，可升 L2；L3 仍等待多日期 prospective receipt（前瞻憑證）。
- Research artifact: `research/d06_etf_mechanics_pf039_v0_1.md`。
- H14 防重複計票：D11-14 擁有 index event（指數事件）；D06-11 擁有 realized passive flow（已實現被動流量）；D06-16 擁有 creation/redemption / AP / premium-discount / tracking / liquidity（申贖／參與券商／溢折價／追蹤／流動性）機制。共享 receipt 只能計一次。
- Outcomes remain CLOSED. Formal Core unchanged.

## Exact next continuation after PF-039
1. PF-040：累積至少第二個獨立交易日的國內實物型 ETF units-delta + PCF 同世代 receipt。
2. 保存 PCF 更新版本、現金替代與單位公司行動狀態。
3. exact stock passive flow（精確個股被動資金流）仍為 UNKNOWN；只允許 MODELED_PRIMARY_BASKET_EXPOSURE（模型化籃子曝險）。
4. 不在 receipt 成熟前開 outcome test（結果檢定）。

## PF-039A — creation-to-execution identifiability firewall
- Taiwan in-kind ETF creation does not identify same-day constituent buying. Applicants/APs may use existing holdings.
- TWSE rules allow collective in-kind creation, so up to three applicants can pool existing holdings for one creation request.
- Minimum in-kind creation can initially deliver at least 90% of required basket market value, with shortage stocks bought or borrowed by the next business day.
- Cash substitution can replace physical delivery for specific PCF constituents under allowed conditions.
- Therefore units delta + PCF supports only MODELED_PRIMARY_BASKET_EXPOSURE, not ACTUAL_STOCK_PASSIVE_FLOW or SAME_DAY_COMPONENT_EXECUTION.
- PCF remains a versioned PIT object; later T-day updates/retransmissions cannot be backfilled into an earlier first-known state.
- External ETF arbitrage literature is treated only as a mechanism/falsification prior: AP arbitrage is designed to close premium/discount gaps, but liquidity, balance-sheet capacity and execution frictions can make convergence incomplete or delayed. This is not Taiwan outcome evidence.
- Contract upgraded to `research/passive_flow_etf_units_pcf_contract_v0_2.json`.
- Detailed Taiwan execution firewall: `research/d06_16_etf_creation_execution_identifiability_firewall_v0_1.md`.
- D06-16 remains L2/40%; no new prospective independent-date receipt or OOS outcome exists.
- Formal Core unchanged.

## Exact next continuation after PF-039A
1. PF-040 remains reserved for the next genuine independent trading-day units-delta + PCF prospective receipt.
2. Preserve existing-inventory, collective-creation, minimum-basket, shortage-stock buy/borrow and cash-substitution uncertainty in every modeled basket receipt.
3. Without actual AP/market execution evidence, actual constituent execution remains UNKNOWN.
4. Do not promote D06-16 or start outcomes from mechanism completeness alone.


## PF-040 through PF-041 durable update
- PF-040 corrected the T/T-1 clock: a T decision PCF can legitimately carry prior-business-day ISSUES-DIFF; announce/use date and unit-observation date must be separate.
- The 2026-10-05 decision generation was captured twice and remained stable.
- The 2026-10-06 decision generation was prospectively captured on 2026-10-05 evening and re-read with identical hashes for 0050 and 0056.
- Cash-substitution and corporate-action states are preserved.
- D06-16 promotes L2/40 -> L3/60 for Taiwan PIT/source feasibility only.
- Actual AP/constituent execution remains UNKNOWN; modeled basket exposure is not actual stock passive flow.
- D06-11 remains L2; no outcome test; no Formal change.

## Exact next continuation after PF-041
1. Accumulate additional decision generations and append every same-generation version change.
2. Freeze L4 OOS/Shadow hypotheses before outcomes.
3. Test residual incrementality beyond institutional flow/index-event/price-volume/liquidity/regime on common support.
4. Keep actual execution UNKNOWN and preserve one-event/one-primitive anti-double-count lineage.


## PF-042 durable update
- Third independent prospective decision generation (use date 2026-10-07) captured and repeat-stable.
- 0050 hash = fnv1a64-utf8:44afa643c503c72c; unit delta +11.5m.
- 0056 hash = fnv1a64-utf8:38922665d41400f9; unit delta +19.0m.
- D06-16 remains L3/60: source/PIT feasibility is strongly replicated, but actual execution remains UNKNOWN and L4 requires OOS/Shadow incrementality.
- No Formal change.

### Exact next after PF-042
Do not promote from more source replication alone. Preserve future generations append-only and move the next maturity gate to preregistered common-support OOS/Shadow residual incrementality with passive/active anti-double-count controls.
