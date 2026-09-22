# Research Checkpoint

Checkpoint sequence: B-24.
Updated: 2026-09-22 22:43 Asia/Taipei.

> Canonical cursor for both A/B research schedules. B-23 and earlier evidence remains durable in Git history; do not re-run completed work.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.

## Production/research baseline retained
- Previously verified research infrastructure: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- Latest main before this run: `442e2150c59d8132a817ac1fd4bd41abfff01b70` (B-23).
- Production readback was attempted this run but the available web/container network could not resolve/access the Worker host; therefore no newer runtime claim is made. This is a tool-network limitation, not evidence of production failure.
- Execution-shadow D1 persistence/read coverage remains UNKNOWN from safe public reads. Workflow/cron success is not persistence evidence.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless a newer safe durable read proves otherwise.
- B-13/B-16 provenance engineering remains DEFERRED, not cancelled.

## USER PRIORITY OVERRIDE — capital utilization / selection / execution / re-entry
Primary root question remains:
`universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
Do not optimize cash utilization alone and do not alter Formal Core from small retrospective samples.

## Retained findings through B-23
- 9/16: 1,873 scanned -> 3 selected. 9/17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 primary liquidity rejects; 335 no A/B formation.
- Frozen allocator caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ names; first tranches about 21% / 36% / 51% before caps/rounding.
- Tiny 9/16-9/17 cohorts had meaningful MFE but weak endpoint advantage vs TAIEX; selection quality, execution and position management remain separate hypotheses.
- 4763 vs 1301 on 9/18 remains evidence against blanket BUY loosening.
- Production B is stricter confirmed-breakout quality than the owner's intended pre-breakout/catch-up concept; redesign would be Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; this is an evidence-coverage gap, not proof the gate is wrong.
- Exact 8046 reduction fill timestamp, price and reduced shares remain UNKNOWN.
- Current REDUCE = profit-zone distribution; generic downside exits are separate STOP_LOSS/SELL mechanisms.
- Exact 9/16 plan identities/zones/stops/targets remain unjoinable from inspected plaintext repo evidence and therefore UNKNOWN.
- Restoration concepts STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY remain untuned Shadow concepts only.
- `v7_signal_delivery_state` is current delivery/dedup state, not an append-only execution journal; push acceptance is not brokerage execution.
- Encrypted V8 plan mirror archives exact plan payloads, but safe GitHub reads expose ciphertext/hash only. Existing mirror is plan-only and cannot recover signal/fill history.
- B-23 theoretical capital attribution remains valid: selected-count/allocator math can bound planned exposure but cannot establish executed utilization.

## NEW B-24 — correction: append-only formal signal journal exists; fills still do not
### Research question
Can safe durable code evidence distinguish SELECTED -> BUY-observed from SELECTED -> confirmed fill for 9/16-9/22, and did earlier research incorrectly conclude that no append-only operation-signal journal exists?

### Evidence audited
- Re-read governance, worklist and latest checkpoint first; checkpoint was B-23.
- Verified latest main commit `442e2150c59d8132a817ac1fd4bd41abfff01b70` before research.
- Inspected `research/counterfactual_v8_7_4.js`, `scripts/apply_v8_7_4.py`, `scripts/apply_v8_5_0.py`, `tests/test_v8_5_0_trade_journal.mjs`, `scripts/apply_v8_8_0.py`, `scripts/apply_v8_8_1.py`, and deployment workflow.
- Re-read checkpoint immediately before write; blob SHA remained `e41e6f893b9ee8cdc0fee19871b9965d1f5ffa59`, so no concurrent A/B checkpoint update is overwritten.

### Finding 1 — B-21 wording was materially too broad and is corrected
`v8_trade_journal_signals` is an append-only/idempotent-by-event-id formal **signal-observation journal**. Schema fields include `event_id`, `trade_date`, `plan_scan_date`, `occurred_at`, `symbol`, `signal_type`, `position_stage`, `market_price`, `signal_amount`, `signal_shares`, `episode`, reason/instruction and push eligibility. `recordTradeJournalSignal()` uses `INSERT OR IGNORE` keyed by `event_id`, and the V8.5.0 regression explicitly asserts `signalTimestampHistory:true`.
Therefore the prior statement "no separate append-only per-symbol operation-signal/fill journal was found" must be split:
- operation-signal journal: **EXISTS** (`v8_trade_journal_signals`);
- brokerage execution/fill journal: **NOT FOUND / UNKNOWN**.
This correction does not retroactively prove that rows for 9/16-9/22 exist in Production D1; persistence coverage still requires read evidence.

### Finding 2 — existing Execution Alpha already defines BUY-observed conversion, but it is not fill conversion
`researchExecutionAlphaFromRows(plans,signals)` takes the first `signal_type='BUY'` row with finite `market_price` for each `plan_scan_date|symbol`, reports `selectedPlans`, `buyTriggeredPlans`, and `buyTriggerRate`, and labels entry price/time from the formal BUY signal row. `readExecutionAlphaResearch()` reads `v8_trade_journal_plans` plus `v8_trade_journal_signals`.
Thus the system already has a research definition for **SELECTED -> BUY-observed**. It must not be renamed or interpreted as confirmed brokerage fill. `market_price` is the market price observed when the formal signal event was journaled, not proof of order acceptance/execution.

### Finding 3 — aggregate BUY-observed counts exist in the protected research dashboard, not in a safe public read
V8.7.4 wires `executionAlpha` into `/api/research/dashboard`, including `buyTriggeredPlans / selectedPlans`. However `/api/research/dashboard` requires `ADMIN_TOKEN`. The V8.8 execution-recorder endpoint also requires `ADMIN_TOKEN`.
No existing safe plaintext GitHub artifact/public endpoint was found that exposes per-scan-date BUY-observed aggregate counts for 9/16-9/22. Therefore actual conversion counts for those dates remain **UNKNOWN from currently connected safe reads**, not zero.

### Finding 4 — prospective execution recorder is complementary, not a fill source
V8.8.0 `trade_research_execution_snapshots` records OPEN/10m/15m/30m and `FORMAL_SIGNAL_OBSERVED` research snapshots after formal signal/push/live-state processing, fail-open. It improves PIT execution-context evidence but still does not record brokerage fills. V8.8.1 adds quote-derived opening gap/session average/spread/depth/market-state provenance without changing formal decisions.

### Supporting evidence / falsification / alternatives
- Supporting: V8.5.0 schema + recorder + regression test explicitly establish signal timestamp history; V8.7.4 explicitly consumes BUY rows for Execution Alpha.
- Falsification: existence of the schema/code does not prove historical D1 row coverage for every date; no safe Production D1 read was available this run.
- Alternative: `v7_signal_delivery_state` remains delivery/dedup state and should not be used when the append-only signal journal is available.
- Brokerage/manual fills remain a separate evidence layer and cannot be inferred from BUY/ADD/REDUCE signal rows.

### Bias / data-quality checks
- No signal absence was converted to no-BUY; unreadable coverage remains UNKNOWN.
- No BUY signal was converted to confirmed fill.
- No later holdings were used to backfill historical fills.
- No secret requested or exposed.
- No threshold/factor tuning; no new experiment; no date-level performance inference.
- Transaction-cost/executed-turnover attribution remains UNKNOWN until confirmed fills or an explicit simulated-execution convention is defined.

### R01-R08 / I01-I07 impact
- No definition/status change; no R09/I08.
- Execution Alpha observability is clarified: current metric is BUY-signal timing alpha, not brokerage execution alpha in the strict fill sense.

### Engineering classification / tests / deployment
- Evidence correction only; no code/schema/workflow/runtime change.
- Formal Core unchanged by construction.
- A new public aggregate-only research endpoint could be Class A in principle under governance, but adding it to the production build requires careful isolation/regression and must not be confused with a deployment-pipeline modification. No implementation in this run.

## PRIORITY OVERRIDE — user-directed trading-decision bottleneck research (2026-09-22)

Until this priority question is materially resolved, A/B schedules must treat the following as the main research lane. Data-quality engineering such as B-13/B-16 is secondary unless it directly blocks these conclusions.

User question:
- Why are there daily candidates but very few actual BUY opportunities?
- Is capital staying idle because selection is too narrow, entry confirmation is too strict, one-day plan TTL is too short, tranche logic is too conservative, or because the strictness is actually protecting capital?
- After partial reduction, is there a missing evidence-based route to restore exposure?
- Do not change rules merely because the latest example rallied; all proposals require positive + reverse falsification.

### New one-date paired evidence from 2026-09-17 formal scan
Existing CI logs identify final formal selections on 2026-09-17 as 4763 材料*-KY and 1301 台塑. The same diagnostics expose the top 12 near-miss names:
1102, 1210, 1216, 1304, 1305, 1326, 1477, 1503, 1514, 1519, 1609, 1708.

Using Fugle daily OHLC from the 2026-09-17 selection close through 2026-09-22:
- Final SELECTED pair equal-weight close-to-close return: approximately +0.37%.
- Near-miss 12-name equal-weight close-to-close return: approximately -0.77%.
- SELECTED average MFE over subsequent sessions: approximately +7.55%; average MAE approximately -0.57%.
- Near-miss average MFE: approximately +1.12%; average MAE approximately -1.46%.

Interpretation:
1. This single observed date does **not** support the claim that final downstream filters were obviously too strict. On this date the selected pair had better endpoint return, much larger upside excursion, and smaller downside excursion than the first 12 near misses.
2. Reverse caution: n=1 scan date, selected n=2, and 4763 contributed a large share of selected MFE. This result is highly date/name sensitive and must not be generalized or used to tighten filters.
3. Therefore selection scarcity and entry scarcity remain separate hypotheses. The next useful evidence is multi-date SELECTED vs NEAR_MISS/REJECTED path, and BUY-triggered vs no-BUY SELECTED path.
4. Do not loosen selection rules just to increase daily count. A high candidate count is not an objective.

### Current formal funnel evidence retained
- 2026-09-16: 1,873 ordinary stocks scanned, 3 selected.
- 2026-09-17: 1,875 scanned, 2 selected; baseEligible 513; rrEligible 9.
- 2026-09-17 primary exclusions included 1,124 liquidity, 335 no A/B setup, 71 RR<2, plus other quality/risk gates.
- Current journal aggregate available from existing deployment verification showed 4 SELECTED plans and 1 observed formal BUY signal (25% observed conversion in that incomplete journal sample). This is not a month-long denominator.

### Revised exact research sequence
1. Selection layer: accumulate same-date SELECTED vs NEAR_MISS vs REJECTED_AFTER_BASE outcomes across independent scan dates, including endpoint return, MFE, MAE and invalidation-before-upside ordering.
2. Entry layer: for every SELECTED plan, classify BUY_OBSERVED vs NO_BUY without imputing missing signals. Compare future path, zone-touch, stop-before-upside, and whether the name remained valid after plan expiry.
3. Capital layer: decompose planned utilization into selectedCount, allocation cap, first-tranche, second-tranche/ADD conversion, and confirmed fill. Cash utilization itself is diagnostic, not a target.
4. TTL layer: compare EXPIRE_AS_IS vs REVALIDATED_RESELECT; do not use blind carry-forward as the default.
5. Position-management layer: REDUCE is only a recommendation until actual reduced shares are confirmed. Study REDUCED_CONFIRMED -> RE-ADD_ELIGIBLE only with trusted execution state; compare against STAY_REDUCED after costs/whipsaw.
6. ABF 3037/8046/3189 is a falsification case-study cohort only. Do not tune a re-entry rule around 8046's later rally.
7. Any proposed rule change must improve total-capital opportunity-cost-adjusted outcome without materially worsening MAE/drawdown/false-break/transaction-cost/date-regime robustness.
8. Formal Core remains LOCKED; no production change from this research without explicit owner approval.


## ABF trim/re-entry case audit — 8046 南電 episode (2026-09-22)

Prior decision history recovered from the project conversation:
- 2026-09-01: user held 8046 南電 200 shares, cost about 916.30, close 1,225.
- 2026-09-03: close 1,080 after a sharp sector selloff.
- 2026-09-04 intraday around 1,020: recommendation was to reduce 50% (sell 100 shares) because of a second day of weakness plus Broadcom/TOPPAN capacity-share risk; user confirmed selling 100.
- Remaining 100 shares were subsequently judged HOLD / no add. A recovery around 1,050 had been discussed as a strength-recovery condition, while 1,000–1,020 was the downside-defense area.

Fugle daily OHLC confirms the post-trim path:
- 9/04 close 1,055; day low 1,010.
- 9/07 close 1,050.
- 9/08 close 1,025, low 1,015.
- 9/09 close 1,110.
- 9/22 close 1,165, limit-up day.
From a hypothetical 1,020 trim execution, the sold tranche's maximum additional downside after the decision was tiny relative to the later upside: the subsequent low was around 1,010–1,015 (roughly -0.5% to -1.0%), while 9/22 close was about +14.2% above 1,020.

### Positive interpretation of the trim
- The recommendation occurred after a very large two-day ABF shock and amid unresolved supply-share risk.
- Partial reduction, not full exit, preserved half the upside while reducing exposure to a possible continuation crash.
- A single later rally does not prove the trim was ex-ante irrational.

### Reverse evidence against the management logic
- Ex post, the trim occurred very near the local trough. The avoided downside after the trim was small, while the opportunity cost on the sold tranche became large.
- More importantly, the earlier decision logic already had a recovery concept around 1,050, and 8046 reclaimed/closed around that level on 9/07 and then closed 1,110 on 9/09, yet the decision process remained "續抱、不加碼" for the remaining position.
- This supports an **asymmetry diagnosis**: de-risking had explicit actionability; recovery evidence did not have a symmetric, tranche-specific restoration action.

### Sector-level reverse check: not just one winner
Fugle daily data from 9/04 close to 9/22 close:
- 8046 南電: 1,055 -> 1,165, about +10.4%.
- 3037 欣興: 902 -> 1,120, about +24.2%.
- 3189 景碩: 819 -> 909, about +11.0%.
All three ABF names participated in the rebound. This weakens the explanation that 8046's recovery was purely idiosyncratic and strengthens the hypothesis that sector re-strength should have been part of restoration eligibility.

### But a naive re-add rule is not validated
Example:
- Re-adding merely on 8046 reclaiming ~1,050 on 9/07 would have captured later upside, but the stock still revisited ~1,015–1,025 afterward.
- Waiting for a stronger 1,100-area close (9/09 close 1,110) reduces false recovery risk but creates a worse entry and still experienced a later low around 1,025.
Therefore "reclaim X -> automatically add back" can whipsaw or chase. Threshold tuning from this one episode is prohibited.

### Research implication
The candidate logic is a state restoration framework, not a fixed price rule:
REDUCED_CONFIRMED -> RECOVERY_WATCH -> RE-ADD_ELIGIBLE only when:
1. original downside thesis is no longer strengthening,
2. stock-specific price/volume recovery is confirmed,
3. sector/peer recovery is present,
4. re-add price still has acceptable risk/reward,
5. the sold tranche amount is known from trusted actual-share state.
Compare against STAY_REDUCED using opportunity return, MAE, transaction cost, whipsaw frequency and date/sector robustness.

No production re-entry rule is approved or changed from this case.

## Exact next continuation point
1. Re-read latest checkpoint and main commit before work; this user-directed trading-decision bottleneck lane has priority over generic observability engineering unless observability blocks the answer.
2. Recover additional independent formal scan dates and compare SELECTED vs NEAR_MISS / REJECTED_AFTER_BASE with D1/D3/D5 path, MFE, MAE, and invalidation-before-upside ordering. Do not pool names across dates without preserving scan-date clustering.
3. Recover individual formal BUY signal identity/timing from safe durable logs/journal when available; never infer no-BUY identity from aggregate counts.
4. For SELECTED with no observed BUY, distinguish: no zone touch, zone touch but failed confirmation, invalidation/stop first, plan expiry, and UNKNOWN. If clause-level evidence is unavailable, keep UNKNOWN.
5. Quantify capital funnel separately: selectedCount -> planned allocation -> first tranche -> BUY observed -> confirmed fill -> ADD/full. Do not optimize utilization.
6. Continue 3006 TTL case into EXPIRE_AS_IS vs REVALIDATED_RESELECT evidence on additional names/dates; blind carry-forward remains a falsification comparator, not a candidate rule.
7. For REDUCE/re-entry, search durable historical recommendation events and confirmed share-state evidence. Without confirmed reduced shares, do not label an event REDUCED_CONFIRMED.
8. Keep B-13/B-16 provenance branch parked unless needed to unblock the above outcomes. No deployment or Formal Core change.
