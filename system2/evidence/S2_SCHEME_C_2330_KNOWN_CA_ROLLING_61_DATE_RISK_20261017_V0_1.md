# System 2 Scheme C｜61 官方交易日視窗延續已知公司行動風險，避免次日漏標

Date: 2026-10-17 Asia/Taipei  
Status: **BUILD_LANE read-only preliminary display risk repair**; not a source original re-fetch, official full-price adjustment or PIT-A advancement. Owner-approved Scheme C three-layer architecture unaffected.

## Original defect

The read-only three-layer preview router already knew physical **2330/TWSE 2026-09-16 ex-dividend** from DATA's original 2026-10-16 21:48 Asia/Taipei observation, but its conservative hardcoded known-positive CA veto was scoped only to **`marketDate='2026-10-16'`**. The next real session may still contain 2026-09-16 within the **same rolling official 61 trading dates**, potentially allowing unadjusted raw-price data to appear in a later-day preview without this known-positive special warning. The generic CA-unknown warning remained, but the explicit actually known event could silently disappear.

This repair uses only official **session dates already in the signed physical A1 source**; it does **not** reconstruct more issuer events or infer `NO_EVENT`.

## BUILD change / backwards compatibility

- `system2/runtime/preliminary_daily_pv_watch_v0_1.mjs`: on new real 122/122 source-only preview, the signed V0.2 receipt now explicitly carries a copy of existing verified `sourceReceipt.calendar.tradingDates` as `source61TradingDates`. These 61 date strings are already available to the BUILD preview generator, and original per-date OHLC is **not** emitted into derived ZIP.
- `system2/runtime/three_layer_selection_preview_router_v0_1.mjs`: check signed exact 61-date list is chronologically ordered and ends on T. On a new `marketDate > '2026-10-16'`, this list is mandatory (SOURCE_61_OFFICIAL_SESSION_CALENDAR_REQUIRED_FOR_CURRENT_PREVIEW). Physical Oct13 old reports may still be replayed as historical, and the old **Oct16** fixture retains its single-date known-positive fallback, but cannot become a future-day proof by omission.
- If a new T's **actual source calendar contains 2026-09-16**, the already DATA-proven 2330 positive ex-dividend is flagged `KNOWN_POSITIVE_CA_SOURCE_EVENT_REVIEW_REQUIRED`, with `CA_OR_CLOCK_REVIEW_HOLD`, as-of exact physical first observation `2026-10-16T13:48:50.420Z`. If previous T is before this observation time, the event may only be `LATE_DISCOVERED_CA_EVENT_NOT_BACKDATED` (not a decision-time known fact).
- After the official 61-date window no longer includes 9/16, the **special 2330 event** is not automatically carried forever; **general unknown CA PIT stays UNKNOWN**. Actual future events will need DATA source-positive evidence with exact firstKnown/observed clocks, not invented negatives.
- `source61SessionCalendarProvided` and `known2330ExdivDateInSource61Window` diagnostics in newly emitted signed router receipt are provenance diagnostics only, not ordinary security membership or PIT-A/B admission.

## Exact scope

This only repairs an **already known documented event's risk-flag duration** in the research preview. It does **not** make original daily prices adjusted or comparable across action dates; `shortEligible=false`, no BUY/SELL/SHORT or entry/stop/targets, no scoring/ranking/weights/real orders, PIT-A/B=false, `selectedCount=null`, `zeroPickDay=null`, Frozen/Shadow/push=false.

No official source GET, new Cron, Cloudflare D1/R2/Worker production modifications or System1 V8 Formal Core change. DATA still owns issuer native originals and independent AUDIT signs PIT-A; only BUILD owns this consumption/display. Source calendars from test mock are deliberately **synthetic weekday-only test inputs**, not authority for real TWSE holidays; runtime producer sources **actual official calendar**.

## Acceptance

New tests in `system2/tests/three_layer_selection_preview_router_v0_1.test.mjs`: a forward date 2026-10-19 still overlapping known Sep16, distant future after window rolls off, missing new T calendar fails closed, malformed/duplicate/wrong-T dates, prior decision as-of clock cannot inherit 10/16 observed CA knowledge. Existing historical 10/13 pinned signed receipt replay must still pass. Full System2 Research CI, System1 V8 regression and D1 writer census needed before promotion to main. Actual new-market-day operation remains a separate open physical gate.
