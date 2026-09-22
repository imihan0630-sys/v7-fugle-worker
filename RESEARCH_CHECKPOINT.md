# Research Checkpoint

Checkpoint sequence: B-25.
Updated: 2026-09-22 23:11 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified research infrastructure baseline: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; V8.8.0 rollback baseline.
- Main immediately before B-25: `1bfcf26ea55e065f3ed79e5fa48698ed3579a82f`.
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
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; this is an evidence-coverage gap, not proof the gate is wrong.
- `v8_trade_journal_signals` is an append-only/idempotent formal signal-observation journal. It can establish BUY/ADD/REDUCE/etc signal observations when rows are durably readable, but it is not a brokerage fill journal.
- Current Execution Alpha is BUY-signal timing alpha, not confirmed-fill execution alpha.
- Brokerage/manual fills remain UNKNOWN unless separately confirmed.

## Selection-layer evidence retained
### 2026-09-17 formal scan paired cohort
- Final selected: 4763 材料*-KY, 1301 台塑.
- Top 12 near-miss names retained in prior checkpoint history.
- Through 2026-09-22, selected pair equal-weight endpoint return about +0.37%, average MFE about +7.55%, average MAE about -0.57%.
- Near-miss 12 equal-weight endpoint about -0.77%, average MFE about +1.12%, average MAE about -1.46%.
- Interpretation: this single scan date does **not** support blanket loosening of downstream selection filters. It is only one independent date and is name-sensitive; do not tighten from it either.

## Position-management evidence retained
### 8046 南電 / ABF falsification case
- 2026-09-04 user-confirmed trim of 100/200 shares occurred near a local trough after a sharp ABF shock.
- 8046, 3037, 3189 all subsequently participated in the rebound, supporting study of sector-aware restoration eligibility rather than treating 8046 as an isolated winner.
- Ex-post opportunity cost of the sold 8046 tranche became large while additional downside after the trim was small, but this does not prove the ex-ante trim was irrational.
- A naive fixed-price re-add is not validated; recovery thresholds from this single episode are prohibited.
- Candidate Shadow state concept remains: `REDUCED_CONFIRMED -> RECOVERY_WATCH -> RE-ADD_ELIGIBLE`, only when actual reduced shares are trusted and stock/sector recovery plus acceptable RR are present. Compare against STAY_REDUCED after costs/whipsaw.
- No production re-entry rule approved.

## Direct 2026-09-17 plan-day entry scarcity retained
Read-only scheduled-health evidence on the 2026-09-17 trading day:
- 09:27 Taipei: monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0.
- 13:19 Taipei: monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0.
- Formal plans: 6706 惠特, 3006 晶豪科, 6505 台塑化.
Thus all three plans had usable formal 15m data and none produced an operation notification by 13:19.

Observed post-selection path through 2026-09-22:
- 6706: 147 -> 149, endpoint about +1.36%; MFE about +14.29%; MAE about -4.42%.
- 3006: 281 -> 278.5, endpoint about -0.89%; MFE about +5.52%; MAE about -1.60%.
- 6505: 80.5 -> 87.2, endpoint about +8.32%; MFE about +11.55%; MAE about +0.12% relative to selection close.
- Equal-weight endpoint of trio about +2.93%.
This demonstrates a real selected-but-no-operation day, but not the clause that blocked each symbol.

## NEW B-25 — isolate the proximal capital bottleneck on the fully monitored zero-signal day
### Research question
On the 2026-09-17 trading day, was idle planned capital primarily caused by too few selected names / allocator caps, or by the post-selection entry/operation layer?

### Evidence and decomposition
- The plan day had **3 selected/monitored names**. Under the frozen allocator, 3+ names permit up to about **85%** planned deployment, with first tranches totaling about **51%** before caps/rounding.
- Both morning and late-session health checks show all 3 names had formal 15m data ready, no fresh-data wait, and **0 operation notifications**.
- Therefore selection count was sufficient to open the allocator's 3-name tier; the allocator itself would have permitted materially more deployment than occurred at the signal-observation layer.
- On this specific day, the **proximal observable bottleneck is downstream of selection/allocation and upstream of BUY-observed**. In other words, the system had names and planned capacity, but formal operation eligibility did not activate.
- This does **not** establish actual cash utilization because brokerage fills are not durably observed here. It establishes only that no formal operation signal activated the first-tranche path by 13:19.

### Positive hypothesis
Entry confirmation / zone / chase / invalidation / TTL logic may be suppressing otherwise useful opportunities. 6505 is the strongest missed-opportunity example in this tiny cohort because its subsequent path was strongly positive with essentially no daily-low drawdown below selection close.

### Reverse evidence / alternative mechanisms
- 3006 ended negative by 9/22, so a looser entry rule would not uniformly improve outcomes.
- 6706 experienced about -4.4% MAE despite large MFE; earlier entry could increase drawdown or whipsaw.
- `formal15Ready=3` proves usable completed 15m data existed; it does **not** prove that the 15m confirmation clause passed.
- Zero notification does not identify whether the block was no zone touch, failed confirmation, maxChase, stop/invalidation, stage/state, or plan expiry.
- Health evidence ends at 13:19 in the retained observations; do not silently convert that into a full brokerage-day fill statement.

### Bias / robustness checks
- This is one independent plan date; no cross-name pseudo-replication is allowed.
- No parameter was chosen from the observed winners.
- No missing clause evidence was coded BAD/0; failure attribution remains UNKNOWN.
- No later rally is used to rewrite the historical plan or fabricate Shadow.
- Transaction-cost and actual executed-capital effects remain UNKNOWN without fills.
- This finding narrows the bottleneck location for one date but does not establish a general entry-rule defect.

### R01-R08 / I01-I07 impact
- No definition/status change; no R09/I08.
- Evidence is a bottleneck diagnostic only.

### Engineering / formal impact
- Evidence-only checkpoint update. No code, schema, workflow, runtime, factor, threshold or Formal Core change.

## Exact next continuation point
1. Re-read governance, worklist, latest checkpoint and latest main commit first.
2. Prioritize **symbol-level failure attribution** for 6706 / 3006 / 6505 on the 2026-09-17 plan day. Recover exact plan zones/stops/maxChase and safe intraday evidence if durably available; classify each as `NO_ZONE_TOUCH`, `ZONE_TOUCH_CONFIRM_FAIL`, `INVALIDATED_FIRST`, `EXPIRED_VALID`, or `UNKNOWN`. Never infer a clause from zero notifications alone.
3. In parallel, recover at least one additional independent formal scan/plan date and compare SELECTED vs NEAR_MISS / REJECTED_AFTER_BASE with D1/D3/D5 path, MFE, MAE and invalidation-before-upside ordering. Preserve scan-date clustering.
4. Recover individual formal BUY signal identity/timing from safe durable logs/journal when available. Signal absence is UNKNOWN unless journal coverage for that date is established.
5. Quantify capital funnel separately by date: selectedCount -> allocator cap -> first tranche -> BUY observed -> confirmed fill -> ADD/full. Do not optimize utilization.
6. Continue TTL research as `EXPIRE_AS_IS` vs `REVALIDATED_RESELECT`; blind carry-forward remains a falsification comparator, not a candidate rule.
7. REDUCE/re-entry research requires trusted actual reduced shares before `REDUCED_CONFIRMED`; otherwise remain recommendation-only.
8. Keep B-13/B-16 provenance branch parked unless it directly blocks the priority lane. No deployment or Formal Core change.