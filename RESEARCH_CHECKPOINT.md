# Research Checkpoint

Checkpoint sequence: B-27.
Updated: 2026-09-23 00:15 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified research infrastructure baseline: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; V8.8.0 rollback baseline.
- Main immediately before B-27 research write: latest observed main `895d07a2f076ae911ea27d3c6982dd536277247b` (plan mirror), with B-26 checkpoint commit `b06ca19feec11136fa0d35c3b79a4591fd1b88f5` in ancestry.
- Execution-shadow D1 persistence/read coverage remains UNKNOWN from safe public reads. Workflow/cron success is not persistence evidence.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless a newer safe durable read proves otherwise.
- B-13/B-16 provenance engineering remains DEFERRED, not cancelled.

## Primary research lane — capital utilization / selection / execution / re-entry
Root funnel:
`universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
Cash utilization is diagnostic, not an optimization target.

### Retained funnel findings
- 2026-09-16 scan: 1,873 scanned -> 3 selected.
- 2026-09-17 scan: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; primary rejects included 1,124 liquidity, 335 no A/B formation, 71 RR<2.
- Frozen allocator caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ names; first tranches about 21% / 36% / 51% before caps/rounding.
- Production B is stricter confirmed-breakout quality than the owner's intended pre-breakout/catch-up concept; redesign is Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof the gate is wrong.
- `v8_trade_journal_signals` can establish formal BUY/ADD/REDUCE/etc observations when rows are durably readable; it is not a brokerage fill journal. Current Execution Alpha is BUY-signal timing alpha, not confirmed-fill alpha.
- Brokerage/manual fills remain UNKNOWN unless separately confirmed.

## Selection-layer evidence retained
### 2026-09-17 formal scan paired cohort
- Final selected: 4763 材料*-KY, 1301 台塑.
- Through 2026-09-22, selected pair equal-weight endpoint about +0.37%, average MFE about +7.55%, average MAE about -0.57%.
- Near-miss 12 equal-weight endpoint about -0.77%, average MFE about +1.12%, average MAE about -1.46%.
- One independent date only: neither loosen nor tighten downstream filters from this cohort.

## Position-management evidence retained
### 8046 南電 / ABF falsification case
- 2026-09-04 user-confirmed trim of 100/200 shares occurred near a local trough after a sharp ABF shock.
- 8046, 3037, 3189 subsequently rebounded; study sector-aware restoration eligibility rather than treating 8046 as isolated.
- Ex-post opportunity cost was large but does not prove ex-ante trim irrational. No single-episode recovery threshold is allowed.
- Candidate Shadow concept: `REDUCED_CONFIRMED -> RECOVERY_WATCH -> RE-ADD_ELIGIBLE`, only with trusted actual reduced shares, stock/sector recovery and acceptable RR; compare with STAY_REDUCED after costs/whipsaw.
- No production re-entry rule approved.

## 2026-09-17 trading-day entry scarcity retained
- Formal plans: 6706 惠特, 3006 晶豪科, 6505 台塑化.
- 09:27 Taipei: monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0.
- 13:19 Taipei: monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0.
- Through 2026-09-22: 6706 endpoint about +1.36%, MFE +14.29%, MAE -4.42%; 3006 endpoint -0.89%, MFE +5.52%, MAE -1.60%; 6505 endpoint +8.32%, MFE +11.55%, MAE about +0.12%; trio equal-weight endpoint about +2.93%.
- B-25 conclusion retained: on this date the proximal observable bottleneck was downstream of selection/allocation and upstream of BUY-observed. This is not a brokerage-fill statement and does not identify the blocking clause.
- B-26: historical exact zones for these three names remain unavailable from safe durable evidence, so symbol-level failure clause remains UNKNOWN.

## 2026-09-18 contemporaneous five-plan payload retained
- Durable source commit `f3c163c8e79e3c15525b5045eef9c6bd35860aa3`, generated from the 2026-09-17 scan and used for the 2026-09-18 plan/config.
- Plans: 4763 材料*-KY PULLBACK 47.16-48.25 stop 46.45; 1301 台塑 PULLBACK 63.88-65.36 stop 62.92; 3491 昇達科 MOMENTUM breakout 1510, buy 1490-1515, maxChase 1550, stop 1440; 3665 貿聯-KY MOMENTUM breakout 2055, buy 2030-2065, maxChase 2100, stop 1960; 3017 奇鋐 MOMENTUM reclaim 3230 then breakout 3285, buy 3230-3285, maxChase 3350, stop 3170.
- Corresponding workflow verified config/pool provenance but had zero workflow artifacts; this is not signal/fill evidence.

## NEW B-27 — 2026-09-18 daily-path falsification / eligibility bounds
### Research question
Using the recovered contemporaneous plan and independently sourced 2026-09-18 OHLC/trading-range evidence, which entry-path facts can be proven without pretending daily bars reveal 15m confirmation or intraday ordering?

### Evidence / findings
- 4763 材料*-KY: 2026-09-18 O/H/L/C = 48.00 / 50.50 / 47.45 / 50.50. The 47.16-48.25 pullback zone was definitely traded; stop 46.45 was not reached. Therefore `ZONE_TOUCHED = PROVEN`, `STOP_BEFORE_UPSIDE = FALSE at daily-range level`; 15m volume-contraction/stop-falling/next-bar-strength confirmation remains **UNKNOWN**.
- 1301 台塑: O/H/L/C = 65.40 / 65.60 / 64.20 / 65.00. The 63.88-65.36 zone was definitely traded; stop 62.92 was not reached. Therefore `ZONE_TOUCHED = PROVEN`, while the required 15m confirmation remains **UNKNOWN**.
- 3491 昇達科: O/H/L/C = 1515 / 1565 / 1475 / 1565. Prices traded both above breakout 1510 and through the 1490-1515 buy zone; maxChase 1550 was exceeded later within the day; stop 1440 was not reached. Daily OHLC cannot prove the required sequence `effective breakout -> pullback holds -> complete 15m confirmation`, so BUY eligibility/confirmation remains **UNKNOWN**, not PASS/FAIL.
- 3665 貿聯-KY: O/H/L/C = 2060 / 2210 / 2045 / 2210. Prices traded above breakout 2055 and inside the 2030-2065 buy zone; maxChase 2100 was exceeded later; stop 1960 was not reached. Again daily OHLC cannot establish whether the valid breakout occurred before a qualifying pullback/15m confirmation. Classification remains `PRICE_PREREQUISITES_OBSERVED; CONFIRMATION/ORDER UNKNOWN`.
- 3017 奇鋐: O/H/L/C = 3345 / 3450 / 3290 / 3430. The entire day stayed above the formal buyHigh 3285 (daily low 3290), while maxChase 3350 was exceeded. This safely proves **NO_ZONE_TOUCH on 2026-09-18** under the contemporaneous 3230-3285 buy zone. It does not prove what a different rule should have done.
- Thus the second independent plan date provides a useful falsification split: at least 4/5 names had plan-price contact/prerequisite overlap at daily-range resolution, while 3017 definitely did not touch its entry zone. This does **not** establish 4 missed BUYs because all four require 15m confirmation and momentum names require chronological breakout/pullback semantics.
- Default-branch GitHub search found no safe plaintext 2026-09-18 `v8_trade_journal_signals` identity/coverage rows for these five names. Absence from code search is not proven zero-signal coverage; journal state for this date remains `JOURNAL_COVERAGE_UNKNOWN`.

### Date-level comparison / interpretation
- 2026-09-17 remains a proven 3-plan, full-day, 15m-ready, zero-notification date but exact per-symbol blocking clauses are UNKNOWN.
- 2026-09-18 now proves that simple `price never reached plan` cannot explain all five plans: four names traded through relevant plan-price regions/prerequisites at daily resolution. However, without 15m chronological evidence or proven journal coverage, the stronger claim `confirmation layer blocked them` is still not proven.
- Therefore the current capital-utilization hypothesis narrows from generic entry scarcity to a testable fork: **price-path miss vs confirmation/ordering/journal observation**. Evidence is still only two independent trading dates and is insufficient for threshold changes.

### Reverse evidence / bias controls
- Daily OHLC is not substituted for 15m bars; no intraday ordering is inferred from high/low alone.
- A later strong close in 4763/3491/3665/3017 is not used to label the formal rule wrong. 3017's NO_ZONE_TOUCH is a contemporaneous-plan fact, not a recommendation to chase above 3285.
- `maxChase exceeded sometime during day` does not imply it was exceeded before a valid entry opportunity.
- Search failure for journal rows is `JOURNAL_COVERAGE_UNKNOWN`, not `NO_SIGNAL_ROW`.
- Five symbols on one plan date remain one independent date for inference; no pseudo-replication.
- No parameter/window was selected from winners; no new factor, R09/I08, or historical Shadow was created.

### R01-R08 / I01-I07 impact
- No definition/status change. Evidence only refines execution-path falsification and capital-funnel attribution.

### Engineering / deployment
- Evidence-only checkpoint update; Class A documentation/provenance.
- No Worker, schema, workflow, runtime, factor, threshold, selection, allocation, monitoring, signal or push change. No deployment.

## Exact next continuation point
1. Re-read governance, worklist, latest checkpoint and latest main commit first; re-check checkpoint SHA immediately before any write.
2. Continue 2026-09-18 at higher temporal resolution only from safe contemporaneous/durable evidence: seek 15m/intraday ordering for 4763/1301/3491/3665/3017. Specifically test whether 4763/1301 achieved `zone -> no-new-low/volume contraction -> next-bar strength`, and whether 3491/3665 achieved `breakout -> pullback into zone -> hold -> next-bar strength` before maxChase. Keep UNKNOWN where bars/volume are unavailable.
3. Recover formal signal-journal coverage/identity for 2026-09-18 from a source that proves coverage, not code-search absence. Distinguish `NO_SIGNAL_ROW_WITH_PROVEN_COVERAGE` from `JOURNAL_COVERAGE_UNKNOWN`.
4. At date level, compare 2026-09-17 vs 2026-09-18 entry-path attrition: selected/planned count -> price-path eligible/contact -> 15m-confirm eligible -> BUY observed -> confirmed fill. Never infer confirmed fill from signal.
5. Continue selection layer with another independent formal scan date and SELECTED vs NEAR_MISS/REJECTED_AFTER_BASE D1/D3/D5, MFE/MAE when evidence exists.
6. Quantify capital funnel separately by date: selectedCount -> allocator cap -> first tranche -> BUY observed -> confirmed fill -> ADD/full. Confirmed fill remains UNKNOWN absent trusted execution reconciliation.
7. TTL research remains `EXPIRE_AS_IS` vs `REVALIDATED_RESELECT`; blind carry-forward is falsification comparator only.
8. REDUCE/re-entry requires trusted actual reduced shares before `REDUCED_CONFIRMED`; otherwise recommendation-only. Keep B-13/B-16 parked unless directly blocking this lane.