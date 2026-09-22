# Research Checkpoint

Checkpoint sequence: B-31.
Updated: 2026-09-23 02:11 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified research infrastructure baseline: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; V8.8.0 rollback baseline.
- Latest main before B-31 research read: `d892c95a0ee78dbe656fc85c9eb72456abbefd2f` (B-30 checkpoint).
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless a newer trusted read proves otherwise.
- B-13/B-16 provenance engineering remains DEFERRED, not cancelled.

## Primary research lane — capital utilization / selection / execution / re-entry
Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
Cash utilization is diagnostic, not an optimization target.

### Retained findings
- 2026-09-16 scan: 1,873 scanned -> 3 selected.
- 2026-09-17 scan: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; primary rejects included 1,124 liquidity, 335 no A/B formation, 71 RR<2.
- Frozen allocator caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ names; first tranches about 21% / 36% / 51% before caps/rounding.
- Production B is stricter confirmed-breakout quality than the owner's intended pre-breakout/catch-up concept; redesign is Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof the gate is wrong.
- `v8_trade_journal_signals` can establish formal BUY/ADD/REDUCE observations when rows are durably readable; it is not a brokerage fill journal. Confirmed fills remain UNKNOWN absent trusted execution reconciliation.
- 2026-09-17 selected cohort: 4763 材料*-KY and 1301 台塑. Through 09/22 selected pair equal-weight endpoint about +0.37%, average MFE +7.55%, MAE -0.57%; near-miss 12 endpoint about -0.77%, MFE +1.12%, MAE -1.46%. One independent date only; no filter change.
- 8046 南電: user-confirmed 2026-09-04 trim 100/200 shares near local trough. Sector-aware restoration remains Shadow concept only; no production re-entry rule.

## 2026-09-17 trading-day entry scarcity retained
- Formal plans: 6706 惠特, 3006 晶豪科, 6505 台塑化.
- 09:27 and 13:19 Taipei: monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0.
- Through 09/22 trio equal-weight endpoint about +2.93%; exact historical zones unavailable, so symbol-level blocking clause remains UNKNOWN.

## 2026-09-18 plan/path evidence retained
- Contemporaneous source commit `f3c163c8e79e3c15525b5045eef9c6bd35860aa3`.
- Plans: 4763 PULLBACK 47.16-48.25 stop 46.45; 1301 PULLBACK 63.88-65.36 stop 62.92; 3491 MOMENTUM breakout 1510, buy 1490-1515, maxChase 1550, stop 1440; 3665 MOMENTUM breakout 2055, buy 2030-2065, maxChase 2100, stop 1960; 3017 MOMENTUM reclaim 3230 then breakout 3285, buy 3230-3285, maxChase 3350, stop 3170.
- 4763 and 1301 daily ranges touched pullback zones; 15m confirmation UNKNOWN.
- 3491 daily range crossed breakout/zone and maxChase; chronology UNKNOWN.
- 3665 was 2210 limit-up by 11:02, above breakout/maxChase; pre-11:02 eligible sequence UNKNOWN.
- 3017 daily low 3290 stayed above buyHigh 3285 => NO_ZONE_TOUCH.
- B-29 Actions audit found no export proving complete 09/18 signal-journal coverage. `JOURNAL_COVERAGE_UNKNOWN` remains; workflow success/negative repo search cannot be interpreted as zero signals.

## B-30 retained — authorized runtime aggregate path
- `.github/workflows/v7-cloudflare.yml` has an authorized post-deploy `Verify research-only counterfactual readback` using repository secret `V7_ADMIN_TOKEN` against `/api/research/dashboard?days=90`.
- Logged aggregate includes `execution.selectedPlans` and `execution.buyTriggeredPlans`, but no covered signal time boundaries, per-date breakdown or symbol/action identity.
- Therefore aggregate runtime authorization exists, but B-29 `JOURNAL_COVERAGE_UNKNOWN` for 09/18 remained unresolved.

## NEW B-31 — execution-recorder semantics bound the recoverable history; 09/18 reconstruction is impossible from this recorder
### Research question
Can the already-deployed `/api/research/execution-recorder` provide trustworthy date-bounded evidence for 2026-09-18 without modifying production/deploy workflows?

### Evidence / findings
- `scripts/apply_v8_8_0.py` defines `/api/research/execution-recorder` as an authorized GET endpoint. It accepts only `days`, computes `fromDate`, reads `trade_research_execution_snapshots WHERE trade_date>=fromDate`, orders by trade date/observed time, caps the SQL result at 500 rows, and returns aggregate `byEvent` plus `recent: rows.slice(0,80)` containing `trade_date`, `symbol`, `event_type`, `event_key`, timestamps and parsed payload.
- The endpoint therefore has enough identity fields to client-filter a target date **only if that date was prospectively recorded and remains inside the returned row window**. It does not accept an exact `tradeDate`, `from`, `to`, cursor, or explicit coverage-boundary parameter; a zero for a target date is not automatically proof of complete target-date coverage because the 500-row cap can truncate older dates.
- More importantly, the execution recorder itself was introduced by V8.8.0 commit `e9fe3c94c826593b9f2b85e6fdfc5c09b62b4646` at 2026-09-21 20:46:38Z = 2026-09-22 04:46:38 Asia/Taipei, after the 2026-09-18 trading day. The recorder is explicitly prospective and writes only when the monitor runs after deployment.
- Therefore `/api/research/execution-recorder` **cannot contain genuine 2026-09-18 observations by construction**. Any attempt to use its absence as NO_SIGNAL for 09/18 would be fabricated historical Shadow / coverage coercion.
- This closes the 09/18 runtime-recorder lane: keep BUY-observed/15m confirmation UNKNOWN except for already-trusted contemporaneous evidence; do not spend more cycles trying to recover 09/18 from V8.8.x execution snapshots.
- Earliest plausible full trading day for this recorder is 2026-09-22, subject to actual deployment/readback and recorder coverage verification. Do not assume completeness merely from the commit timestamp.

### Reverse evidence / bias controls
- The endpoint's rolling `days` filter is not the same as complete date-bounded coverage because of the hard 500-row cap and 80-row `recent` response subset.
- Recorder rows are signal/decision observations, not brokerage fills.
- V8.8.0 commit time proves 09/18 cannot have been prospectively recorded; it does **not** prove 09/22 recorder health/completeness.
- No later price return was used to infer a missing BUY or 15m condition.
- No missing row was converted to NO_SIGNAL; 09/18 remains UNKNOWN where contemporaneous evidence is absent.
- No new factor, threshold, experiment, ranking or formal behavior introduced; R01-R08/I01-I07 unchanged.

### Engineering classification
- Evidence-only Class A research checkpoint. No runtime/code/schema/workflow/deployment change.
- Adding exact date/cursor/coverage metadata to a shared protected runtime endpoint would require classification before implementation; because it touches deployed runtime/API semantics, default to Class B proposal unless isolated safely as research-only without shared-runtime risk.
- Formal Core invariants unchanged.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. **Do not revisit 09/18 through the V8.8.x execution recorder.** Advance to the first prospectively recordable independent execution date, 2026-09-22, and determine actual recorder coverage using trusted runtime/readback evidence. Required proof before interpreting missing signals: successful protected query + explicit returned trade_date rows + evidence that the target date is not truncated by the 500-row cap; if completeness cannot be proved, mark partial coverage/UNKNOWN.
3. Prefer existing authorized read mechanisms. Do not expose secrets. Do not modify shared deploy workflow merely to obtain data; if modification is necessary, Class B proposal/branch/tests only.
4. In parallel, check whether 2026-09-22 produced a new prospective Shadow scan date after market. If trusted readback shows a second scan date, update independent-date count and maturity horizons without fabricating D1 before the next trading close. Preserve `WAITING_DATA` vs data-quality failure semantics.
5. Continue funnel: selected/planned -> price-path contact -> 15m-confirm eligible -> BUY observed -> confirmed fill. Signal != fill. Quantify allocator cap/first tranche separately from BUY observed and confirmed fill.
6. Only trustworthy historical/prospective 15m OHLCV may test frozen 15m clauses; never approximate missing bars.
7. TTL research remains `EXPIRE_AS_IS` vs `REVALIDATED_RESELECT`; blind carry-forward is falsification comparator only.
8. REDUCE/re-entry requires trusted actual reduced shares before `REDUCED_CONFIRMED`; otherwise recommendation-only.
