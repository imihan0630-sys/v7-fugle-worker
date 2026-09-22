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

## Exact next continuation point
1. Re-read latest main checkpoint + latest research commit; merge any newer A/B progress before work.
2. Treat B-21's broad "no append-only signal journal" statement as superseded by B-24. Do not repeat that audit unless schema/code materially changes.
3. Continue USER PRIORITY OVERRIDE by obtaining **safe aggregate Production evidence** for `v8_trade_journal_plans` vs first BUY rows by `plan_scan_date` for 2026-09-16 through 2026-09-22. Desired fields only: scanDate, selectedPlans, buyObservedPlans, buyObservedRate; no symbols/plan prices/secrets required.
4. First inspect whether an already-authorized GitHub workflow/artifact can emit that aggregate without changing shared deployment/runtime. If yes, use it. If no, design the smallest isolated Class A research-only aggregate read surface; do not modify the deployment workflow itself without Class B approval.
5. Preserve four layers from now on: (a) THEORETICAL allocator ceiling, (b) PLAN/intended tranches, (c) SIGNAL-OBSERVED BUY/ADD/REDUCE, (d) EXECUTED confirmed fills/actual shares. Never collapse them.
6. Once aggregate BUY-observed coverage is available, compare conversion by independent scan date only; do not treat multiple symbols on one date as independent evidence. Keep confirmed-fill conversion UNKNOWN until a genuine fill source exists.
7. Continue restoration concepts Shadow-only/untuned. Any formal A/B, liquidity, RR, 15m, allocator, trim, restoration or fill assumption change remains Class B/C and must not be promoted autonomously.