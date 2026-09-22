# Research Checkpoint

Checkpoint sequence: B-30.
Updated: 2026-09-23 01:43 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified research infrastructure baseline: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; V8.8.0 rollback baseline.
- Latest main immediately before B-30: `e7ca018f7d6651c8f71c655fd9c31a2f2534438c` (B-29 checkpoint).
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

## NEW B-30 — authorized runtime aggregate path exists, but it is deployment-scoped and not historical identity proof
### Research question
Does the existing authorized deployment chain already contain a secret-safe runtime/D1-capable read path that can reduce execution-coverage UNKNOWN without asking the owner for credentials or exposing secret values?

### Evidence / findings
- Yes, partially. `.github/workflows/v7-cloudflare.yml` already has an authorized post-deploy `Verify research-only counterfactual readback` step using repository secret `V7_ADMIN_TOKEN` to call Production `/api/research/dashboard?days=90`.
- That step logs a deliberately bounded aggregate object including `execution.selectedPlans` and `execution.buyTriggeredPlans`, plus Shadow coverage/readiness/integrity diagnostics. It does not print the admin token.
- Therefore generic runtime authorization is **not** the fundamental blocker for aggregate Execution Alpha observability: the existing deploy chain can read the protected research dashboard safely.
- However this read is deployment-scoped, not a date-specific append-only journal export. The logged aggregate shown by workflow code does not include covered signal time boundaries, per-date breakdown, or symbol/action identity. Consequently it cannot by itself prove whether any of the five 2026-09-18 plans had BUY/ADD rows, nor can an aggregate zero/nonzero count be assigned specifically to 09/18 without matching historical coverage semantics.
- The current scheduled health workflow is public-health oriented; no evidence in this pass shows that it exports the protected execution aggregates.
- Conclusion: B-29's `JOURNAL_COVERAGE_UNKNOWN` for 09/18 is preserved, but the next engineering/research path is narrower: reuse the already-authorized protected research-dashboard read mechanism for **research-only aggregate/date-bounded observability**, rather than searching GitHub or asking for secrets.

### Reverse evidence / bias controls
- A deploy-time aggregate is not a historical per-date journal and cannot be back-assigned to 09/18.
- `buyTriggeredPlans` is BUY-signal observation, not confirmed brokerage fill.
- No missing row is coerced to NO_SIGNAL; UNKNOWN remains UNKNOWN until explicit coverage boundaries exist.
- No later return is used to infer entry eligibility.
- No new factor/threshold/experiment introduced; R01-R08/I01-I07 unchanged.

### Engineering classification
- Evidence-only checkpoint in this pass: Class A, no runtime/code/schema/deployment change.
- A new standalone workflow that merely reads an existing research-only endpoint could still touch deployment-pipeline/workflow governance and must be classified carefully before implementation. Prefer an isolated research-only export/read path that cannot affect production scheduling or Formal Core; if it changes shared workflow/runtime behavior, treat as Class B proposal first.
- Formal Core invariants unchanged by construction.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. Do not repeat broad 09/18 Actions/code searches. Inspect existing research endpoint semantics/tests for whether `/api/research/dashboard` or `/api/research/execution-recorder` can already return date-bounded execution coverage. Required proof: explicit covered date/time range + successful query + per-date aggregate or symbol/action rows / explicit zero rows.
3. If an existing endpoint already supports safe date-bounded read, use the existing authorized secret-bearing workflow mechanism without exposing secrets; retrieve only the minimum research evidence needed. If enabling that read requires modifying a shared production/deploy workflow, classify as Class B and prepare proposal/branch/tests only—do not promote automatically.
4. If no safe date-bounded runtime path exists, stop spending cycles on 09/18 and advance the next independent formal scan date / prospective Shadow maturity. Never fabricate historical Shadow.
5. Only trustworthy historical 15m OHLCV may test frozen 15m clauses; never approximate missing bars.
6. Funnel remains selected/planned -> price-path contact -> 15m-confirm eligible -> BUY observed -> confirmed fill. Signal != fill. Quantify allocator cap/first tranche separately from BUY observed and confirmed fill.
7. TTL research remains `EXPIRE_AS_IS` vs `REVALIDATED_RESELECT`; blind carry-forward is falsification comparator only.
8. REDUCE/re-entry requires trusted actual reduced shares before `REDUCED_CONFIRMED`; otherwise recommendation-only.
