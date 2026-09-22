# Research Checkpoint

Checkpoint sequence: B-26.
Updated: 2026-09-22 23:41 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified research infrastructure baseline: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; V8.8.0 rollback baseline.
- Main immediately before B-26: `5b81a69092c41cbdef57ba35d80242a9764f3634`.
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

## NEW B-26 — symbol attribution safety + second independent plan evidence
### Research question
Can 6706/3006/6505 be assigned a specific failure clause from safe durable evidence, and can another independent plan date be recovered without inventing history?

### Evidence / findings
- Current default-branch code search does not contain the historical 6706/3006/6505 plan payload, and the inspected 2026-09-17 workflow metadata/artifact surface does not expose a plaintext artifact with their exact buy zones/stops/maxChase. Therefore their symbol-level failure attribution remains **UNKNOWN**. Zero notifications must not be relabeled as `NO_ZONE_TOUCH` or `ZONE_TOUCH_CONFIRM_FAIL` without the historical plan and intraday ordering evidence.
- A separate durable commit (`f3c163c8e79e3c15525b5045eef9c6bd35860aa3`) recovers the **2026-09-18 plan** generated from the 2026-09-17 scan and verifies the production config write/readback. It contains five plans: 4763 材料*-KY, 1301 台塑, 3491 昇達科, 3665 貿聯-KY, 3017 奇鋐.
- The recovered 2026-09-18 plan preserves exact contemporaneous plan fields. Key examples: 4763 PULLBACK buy 47.16-48.25 stop 46.45; 1301 PULLBACK buy 63.88-65.36 stop 62.92; 3491 MOMENTUM breakout 1510 buy 1490-1515 maxChase 1550 stop 1440; 3665 MOMENTUM breakout 2055 buy 2030-2065 maxChase 2100 stop 1960; 3017 MOMENTUM requires reclaim 3230 then breakout 3285, buy 3230-3285 maxChase 3350 stop 3170.
- The corresponding workflow run completed successfully and verified the configured pool split (2 non-thousand + 3 thousand), but had **zero workflow artifacts**. This proves plan/config provenance, not BUY signal occurrence or fill.
- This gives a second independent plan-date object for entry/invalidation ordering research, but not yet a second independent outcome comparison. Do not pool its five names as five independent dates.

### Reverse evidence / bias controls
- Historical plaintext absence in the safe repo surface is not proof the 9/17 plans never had zones; it is an evidence-access limitation.
- Workflow success is not signal-journal coverage and not brokerage execution evidence.
- The 9/18 plan was recovered from contemporaneous durable code/config evidence, not reconstructed from later winners; no hindsight threshold fitting was performed.
- No missing field is coded BAD/0. 6706/3006/6505 clause attribution stays UNKNOWN.
- No parameter or Formal Core change follows from one newly recovered plan date.

### R01-R08 / I01-I07 impact
- No definition/status change; no R09/I08. This is provenance and execution-falsification evidence only.

### Engineering / deployment
- Evidence-only checkpoint update; Class A documentation/provenance only.
- No Worker, schema, workflow, runtime, factor, threshold, selection, allocation, monitoring, signal or push change. No deployment.

## Exact next continuation point
1. Re-read governance, worklist, latest checkpoint and latest main commit first; re-check checkpoint SHA immediately before any write.
2. Use the recovered contemporaneous 2026-09-18 five-plan payload as the next independent plan-date experiment. Recover safe intraday/daily OHLC path for 4763/1301/3491/3665/3017 and classify only what can be proven in chronological order: zone touch, breakout prerequisite, stop/invalidation-before-upside, maxChase, expiry. Confirmation failure remains UNKNOWN without 15m confirmation evidence.
3. Recover formal signal-journal coverage/identity for 2026-09-18 if safely available. Distinguish `NO_SIGNAL_ROW_WITH_PROVEN_COVERAGE` from `JOURNAL_COVERAGE_UNKNOWN`.
4. Compare 2026-09-18 entry eligibility/invalidation ordering with the retained 2026-09-17 zero-notification day at the **date** level, not name level. Do not tune thresholds.
5. Continue selection layer with another independent formal scan date and SELECTED vs NEAR_MISS/REJECTED_AFTER_BASE D1/D3/D5, MFE/MAE when evidence exists.
6. Quantify capital funnel separately by date: selectedCount -> allocator cap -> first tranche -> BUY observed -> confirmed fill -> ADD/full. Confirmed fill remains UNKNOWN absent trusted execution reconciliation.
7. TTL research remains `EXPIRE_AS_IS` vs `REVALIDATED_RESELECT`; blind carry-forward is falsification comparator only.
8. REDUCE/re-entry requires trusted actual reduced shares before `REDUCED_CONFIRMED`; otherwise recommendation-only. Keep B-13/B-16 parked unless directly blocking this lane.