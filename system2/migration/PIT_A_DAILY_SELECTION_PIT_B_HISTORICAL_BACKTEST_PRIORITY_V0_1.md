# System 2｜PIT-A 每日選股優先 × PIT-B 歷史回測並行 V0.1

Status: **OWNER-APPROVED EXECUTION PRIORITY, Class A / NON-FORMAL / NO PIT THRESHOLD RELAXATION**  
Owner agreement: 2026-10-16 Asia/Taipei. GitHub latest main remains canonical.  
Authority: [PIT DATA/BUILD fixed ownership](../SYSTEM2_PIT_DATA_BUILD_OWNERSHIP_AND_HANDOFF_V0_1.md), [System2 Execution Lane Governance](../SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md), existing safety and research governance.  
Scope: execution **ordering** only, not a change of strategy, historical window, cutoff, qualification, source completeness, D1/Frozen permissions, or production schedules.

## Binding owner decision — two independently reported PIT lanes

**P0 / PIT-A — prospective daily stock-selection source readiness.** The immediate system recovery target is the **first genuinely independently audited, PIT-qualified symbol for a real future as-of decision cut** (initial source-native control 2330 TWSE; optionally 3287 TPEx), then expand symbol-by-symbol. It must meet the existing strategy's entire required 61 official trading-session A1 history, original authoritative common-share security-class effective windows, historical CA correction/cancellation/halt-resume and authoritative scoped NO_EVENT completeness, actual firstKnownAt/availableAt for the decision cut, and separate AUDIT_LANE acceptance. This is not a waiver from any previously required data criterion. Do **not** require every earlier research/backtest year to finish before admitting a *genuinely complete* future PIT-A symbol. Missing markets/symbols/industry exposure/complete-universe membership remain explicit UNKNOWN; a partial assessed subset is **not** all-market daily selection. A1 delayed T+1 source capture cannot backdate T's 23:45 historical decision.

**P1 / PIT-B — historical as-of replay and backtest integrity.** Continue verified backfills, effective CFI vintage history, CA supersessions/negative NO_EVENT scope, D1/R2 migration, firstKnownAt/availableAt, old-revision overlays, OOS/cost/Shadow/backtest replay. PIT-B has its own physically attested completion and sample-denominator metrics, never silently gates unrelated future PIT-A admission once every input required by that PIT-A scope is proven. It also must never use revised current source data to fabricate past-known history. Backtest may only be called certified when the actual tested historical decision instants pass their PIT checks; not from a current 2026 security class readback.

**Same PIT standard, different evidence scope.** No strategy factor/weight/selection rule changes. A future PIT-A candidate still needs its full 61-session price-history time window (if the existing Stage1 policy requires it), not only today's daily bar. Even a one-symbol audited PIT-A PASS is **research-assessor input admissibility only**, not a qualified all-market ranking, selected stock, Shadow/production result or Frozen write.

## Physical baseline at owner signoff — not hypothetical pass

| Measure | Verified baseline | How to interpret |
|---|---:|---|
| 2026-10-15 A1 official source pairs | 122/122 | SOURCE-ONLY; same-day 23:45 PIT failed cut witness |
| Original A1 price-volume bars | 118,035 | Individually rehashed source-only 61-session coverage |
| A1 source-security windows | 1,935 | Original source population; not certified ordinary-share universe |
| Current native ISIN/CFI positive ordinary-Stock observations | 2 (2330/TWSE, 3287/TPEx) | Actual 2026-10-16 17:04 Taipei observed native original, not 61-session historical CFI PIT |
| Current native negative instrument controls | 2 (9103/TDR, 0050/ETF) | Negative **instrument class**, not NO_EVENT |
| Histor­ical as-of CFI/CA independently accepted and by historical decision cut | 0 eligible / 1,935 UNKNOWN | No PIT-A qualified stock yet |
| Selection `selectedCount` and `zeroPickDay` | null / null | Incomplete data is not a zero-selection day |
| Frozen readback / S0–S5 physical Shadow | 0 / 0 of 6 | No activation from this priority decision |
| Historical SOURCE→DEST D1 A1 rows | 59,311 / 84,688 | Physical migration **70.04%**, not historical PIT progress |
| R2 target entitlement | NOT_ENTITLED | No paid-tier or credential change granted |

Evidence anchor: [main-bound original handoff](evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json), [four real native CFI originals](evidence/S2_DATA_ISSUE1068_NATIVE_CFI_ORIGINAL_FOUR_CONTROL_POSITIVES_20261016_V0_1.json), [Issue #1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068#issuecomment-6212053364). The source-only CFI four-control native post-correction original source run #38877910182 / original artifact #12036321387 is the time-true control readback, not AUDIT_LANE historic PIT signoff.

## Owner-approved immediate work ordering, with accountable lanes

| Order | Owner | Smallest independently testable delivery | Stop condition / next owner |
|---|---|---|---|
| A1 | **DATA_LANE** | For a **new genuine future evaluation cut**, pin one 2330/TWSE 61-session official A1 original/archive-before-cut identity, 61-period common-stock original CFI effective versions, six CA original families and corrections/halt/authoritative negative scope, source SHA/actual clocks. Add 3287/TPEX only if cheaper to complete without widening uncertainty. | Missing one source or firstKnownAt/availableAt → that symbol UNKNOWN; publish original evidence links in **#1068** |
| A2 | **AUDIT_LANE** | Separately obtain original bodies and signed receipts, independently rehash source versions, check each past effective session and **the real new decision cut**, six CA version/negative scope, sign one-symbol audit result. | No independent accepted proof → PIT-A remains 0, source-only positive may rise |
| A3 | **BUILD_LANE** | Consume exact accepted DATA + AUDIT SHA in existing `system2/runtime/pit_first_symbol_microbatch_preflight_v0_1.mjs`; Stage1 assessor, per-symbol readiness plus full market UNKNOWN denominators, and later authorized create-only Frozen/Shadow sequence **#1132/#1234**. No duplicate DATA originals GET. | No independent positive → diagnostic readiness only; no selection/zeroPick/Frozen; Cloudflare writes need separate authorization |
| B1 | **DATA_LANE** | Continue historical effective CFI/CA version lineages, original 2021 TPEX revision overlays, 25,377 original A1 D1 rows and R2 only under existing per-day quota/permission. Produce physically rehashed PIT-B historical-day matrix. | 80,000-row source-account cap, writer interlock, NOT_ENTITLED R2 and old versions remain fail-closed |
| B2 | **AUDIT → BUILD** | Independent historical PIT and replay/OOS/cost checks. A historic PIT-B pass may be declared only by exact historical date / symbol / source revision / decision-time scope. | No use of hindsight or synthetic test success as performance evidence |

DATA and BUILD work in parallel under fixed ownership. A GitHub Issue handoff is not an automatically awakened chat. Each room resumes latest main, reads its own checkpoint, and executes only its owner scope.

## One-stock PIT-A acceptance evidence, 7 verifiable gates

1. A real **future cutoff** (calendar/session with exact marketDate, UTC time, not reconstructed), actually retained on its original observation clock.
2. The existing 61 trading sessions and full required bar originals per symbol, exact market/stock/row/response SHA and original archive-audited before that cutoff.
3. Actual native ordinary-share CFI **effective-from/to vintage** covering the 61-session dates, source version and as-of firstKnownAt/availableAt; present-day `Stocks / ESVUFR` alone insufficient.
4. Exact six CA source family originals across required scope, genuine amendments, cancellation/retraction, suspension/reinstatement; scoped authority for **NO_EVENT** (silence is not negative proof).
5. **AUDIT_LANE** separately reproduces originals/hash/availability and names exact symbol, market, dates and decision cutoff. DATA self-audit or passing a test is not this signoff.
6. BUILD read-only Stage1 per-symbol intake and assessor evaluates **only verified input**; all other source symbols retain legitimate UNKNOWN reason codes, full source denominator and no invented zero-pick.
7. Separately approved frozen create-only write, immutable readback and future Shadow; no automatic Cloudflare/Worker/cron/trading grant from prior six steps.

Track **source-positive CFI** separately from **audited historical PIT-A eligibility** and **PIT-B replay completion**. Report each with numeric denominator; if actual historic audit denominator unavailable, say UNKNOWN instead of percent. Do not proclaim `PIT-A 1/1935` merely because one class/CA mock or a current CFI observation exists.

## Actual next executable task

DATA: take the existing genuine prospective native source archive, resolve **2330 full original historical CFI effective-version + original CA negative/supersession evidence** against the future genuine decision clock; use bounded already-approved source GET and original bytes retention where source readiness allows. Deliver one exact machine-linked symbol/date bundle to **AUDIT_LANE**. Parallel PIT-B historical R2/D1 work cannot be deleted, reclassified as complete, or used to fake this first PIT-A pass. If the current source cannot supply authentic historical effective versions, report **exact provider and field gap** and test a free official alternate before considering protected budget/permissions. New schedule/time semantics need explicit owner action.
