# Research Checkpoint

Checkpoint sequence: B-28.
Updated: 2026-09-23 00:40 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified research infrastructure baseline: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; V8.8.0 rollback baseline.
- Latest main observed immediately before B-28 write: `d5387b7e49bd49d002685fa86a83cdf214ae1cc4` (B-27 checkpoint).
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

## B-27 retained — daily-path falsification / eligibility bounds
- 4763: 09/18 O/H/L/C 48.00/50.50/47.45/50.50; pullback zone touched, stop not reached; 15m confirmation UNKNOWN.
- 1301: 65.40/65.60/64.20/65.00; zone touched, stop not reached; 15m confirmation UNKNOWN.
- 3491: 1515/1565/1475/1565; breakout/zone price regions observed and maxChase exceeded sometime during day; chronological breakout->pullback->confirmation UNKNOWN.
- 3665: 2060/2210/2045/2210; breakout/zone price regions observed and maxChase exceeded sometime during day; chronological breakout->pullback->confirmation UNKNOWN.
- 3017: 3345/3450/3290/3430; daily low 3290 stayed above buyHigh 3285, therefore NO_ZONE_TOUCH on 09/18 under contemporaneous plan.
- Four of five plans therefore cannot be explained by simple `price never reached relevant plan region`; this does not establish four missed BUYs.
- Safe repo search did not prove signal-journal coverage; state remains JOURNAL_COVERAGE_UNKNOWN.

## NEW B-28 — timestamp evidence narrows momentum chronology, but 15m remains unavailable
### Research question
Can safe public contemporaneous evidence add any intraday ordering facts for the 2026-09-18 plans without reconstructing unavailable 15m bars or using later outcomes as confirmation?

### Evidence / findings
- Fresh public search still did not surface trustworthy historical 15m OHLCV bars for 4763/1301/3491/3665/3017. Therefore the requested 15m clauses (`volume contraction`, `no-new-low`, `next-bar strength`, exact breakout->pullback->hold ordering) remain UNKNOWN. No daily-bar proxy is substituted.
- 3665 貿聯-KY has an independently timestamped contemporaneous report: at **11:02 on 2026-09-18**, price was already at the 2210 limit-up price. Against the contemporaneous plan (breakout 2055, buy zone 2030-2065, maxChase 2100), this proves that by 11:02 the stock had already progressed above breakout and above maxChase. It does **not** prove whether a valid breakout->pullback into 2030-2065->15m confirmation occurred earlier in the session. Thus classification becomes `ABOVE_MAXCHASE_BY_11:02 = PROVEN; PRE-11:02 ENTRY_SEQUENCE = UNKNOWN`.
- 3017 contemporaneous quote evidence confirms 09/18 O/H/L/C 3345/3450/3290/3430 and 14:30 close; this independently supports B-27 NO_ZONE_TOUCH because the day's low 3290 remained above buyHigh 3285. It still does not justify chasing above the zone.
- Public sources for 4763 and 3491 corroborate 09/18 close/date context, but no timestamped intraday path sufficient for formal 15m clauses was recovered. 1301 likewise remains without safe high-resolution ordering evidence in this pass.
- Therefore the date-level fork tightens only modestly: 3017 is a proven price-path miss; 3665 is proven to have become too extended by 11:02, while the existence/nonexistence of an earlier valid entry remains UNKNOWN; 4763/1301/3491 still require 15m or proven signal-journal evidence.

### Reverse evidence / bias controls
- A limit-up timestamp is not backfilled into earlier 15m bars and is not treated as proof that BUY should have fired.
- `above maxChase by 11:02` is not equivalent to `maxChase blocked the whole day`; an earlier eligible entry could have existed.
- Later strong closes are not used to loosen entry rules.
- Search failure for historical 15m bars or journal rows remains UNKNOWN, never FAIL/0.
- All five names remain one independent plan date; no pseudo-replication.
- No new parameter, factor, R09/I08, or historical Shadow introduced.

### R01-R08 / I01-I07 impact
- No definition/status change. This is execution-path falsification/provenance evidence only.

### Engineering / deployment
- Evidence-only Class A checkpoint update. No code/runtime/schema/workflow/deployment change.
- Formal Core invariants unchanged by construction.

## Exact next continuation point
1. Re-read governance, worklist, latest checkpoint and latest main commit; re-check checkpoint SHA immediately before any write.
2. Prioritize **proven signal-journal coverage/identity for 2026-09-18** over repeated generic web searches for 15m bars. Seek an authorized workflow/API/artifact or durable export that can establish whether each of 4763/1301/3491/3665/3017 has BUY/ADD/etc rows. Distinguish `NO_SIGNAL_ROW_WITH_PROVEN_COVERAGE` from `JOURNAL_COVERAGE_UNKNOWN`.
3. Only if a trustworthy historical 15m OHLCV source becomes available, test the frozen clauses exactly: 4763/1301 `zone -> no-new-low/volume contraction -> next-bar strength`; 3491/3665 `breakout -> pullback into zone -> hold -> next-bar strength`, including maxChase ordering. Do not approximate missing bars.
4. Date-level funnel for 09/17 vs 09/18 remains: selected/planned -> price-path contact -> 15m-confirm eligible -> BUY observed -> confirmed fill. Never infer confirmed fill from signal.
5. Continue selection layer with another independent formal scan date and SELECTED vs NEAR_MISS/REJECTED_AFTER_BASE D1/D3/D5, MFE/MAE when evidence exists.
6. Quantify capital funnel separately by date: selectedCount -> allocator cap -> first tranche -> BUY observed -> confirmed fill -> ADD/full. Confirmed fill remains UNKNOWN absent trusted execution reconciliation.
7. TTL research remains `EXPIRE_AS_IS` vs `REVALIDATED_RESELECT`; blind carry-forward is falsification comparator only.
8. REDUCE/re-entry requires trusted actual reduced shares before `REDUCED_CONFIRMED`; otherwise recommendation-only. Keep B-13/B-16 parked unless directly blocking this lane.