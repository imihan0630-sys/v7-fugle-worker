# Research Checkpoint

Checkpoint sequence: B-20.
Updated: 2026-09-22 20:43 Asia/Taipei.

> Canonical cursor for both A/B research schedules. B-19 and earlier evidence remains durable in Git history; do not re-run completed work.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.

## Production/research baseline retained
- Previously verified research infrastructure: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- Execution-shadow D1 persistence/read coverage remains UNKNOWN from safe public reads. Workflow/cron success is not persistence evidence.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless a newer safe durable read proves otherwise.
- B-13/B-16 provenance engineering remains DEFERRED, not cancelled.

## USER PRIORITY OVERRIDE — capital utilization / selection / execution / re-entry
Primary root question remains:
`universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY -> confirmed fill -> ADD/FULL -> REDUCE -> confirmed reduced shares -> restoration`.
Do not optimize cash utilization alone and do not alter Formal Core from small retrospective samples.

### Retained B-17/B-19 findings
- 9/16: 1,873 scanned -> 3 selected. 9/17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 primary liquidity rejects; 335 no A/B formation.
- Frozen allocator caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ names; first tranches about 21% / 36% / 51% before caps/rounding.
- Tiny 9/16-9/17 cohorts had meaningful MFE but weak endpoint advantage vs TAIEX; selection quality, execution and position management remain separate hypotheses.
- 4763 vs 1301 on 9/18 remains evidence against blanket BUY loosening.
- Production B is stricter confirmed-breakout quality than the owner's intended pre-breakout/catch-up concept; redesign would be Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; this is an evidence-coverage gap, not proof the gate is wrong.
- Exact 8046 reduction recommendation/fill timestamp, price and reduced shares remain UNKNOWN.
- B-19 source audit established current REDUCE = profit-zone distribution: existing position + currentPrice>=reduceAt + bearish completed 15m + volumeRatio>=1.3. Generic downside exits are separate STOP_LOSS/SELL mechanisms.
- Exact 9/16 plan identities/zones/stops/targets remain unjoinable from current durable repo evidence and therefore UNKNOWN.
- Restoration concepts STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY remain untuned Shadow concepts only.

## NEW B-20 — signal-state persistence semantics audit
### Research question
What durable evidence does `processSignalState` actually preserve for BUY/ADD/REDUCE/STOP_LOSS/SELL, and can it prove a signal instance or confirmed execution without secrets?

### Evidence audited
- Re-read latest main governance/worklist/checkpoint before work.
- `Worker.js` `runBackgroundMonitor`, `processSignalState`, `acquireSignalStateLease`, `persistSignalStateLease`, `processSignalStateCore`, `buildPushPayload`, `shouldPhonePushSignal`.
- Safe GitHub Actions run history for 2026-09-16..2026-09-22; no secret-bearing runtime call used.
- Re-read checkpoint immediately before write; blob SHA remained `a87ac8df3cb8c3ab1098f06a6b6a72e52f2fc452`, so no concurrent A/B checkpoint update was overwritten.

### Finding 1 — D1 signal state is delivery-state evidence, not an execution journal
`v7_signal_delivery_state.snapshot_json` persists state keyed by `V7_SIGNAL_STATE:<symbol>`. The snapshot contains only:
- tradeDate / testMode;
- active signal types;
- fired keys of the form `<positionStage>:<signalType>`;
- current `positionStage`;
- per-fired-key `episodes` counters;
- `pendingDeliveries` with signalId/episode/status/reservedAt and, on failure, httpStatus/checkedAt;
- `lastEntrySignalBarTime` for sent BUY/ADD;
- updatedAt.
It does **not** persist a durable per-event row containing symbol + signal type + trigger price + reason + suggested shares + exact emittedAt + execution/fill fields.

### Finding 2 — a fired state proves notification acceptance semantics, not brokerage execution
`buildPushPayload` constructs a signalId (`tradeDate:symbol:positionStage:signalType:episode-N`), currentPrice, reason, suggested amount/shares, stop/profitCheck and display time, but those payload fields are not copied into the durable signal-state snapshot. `fired` is added only when `sendPush(...).sent` is true; pending reservation exists to avoid blind duplicate delivery after crashes. Therefore:
- `fired`/episode can support that a signal type entered a delivered/accepted notification state for that stage/date under the running system;
- it does **not** prove an order was placed, filled, partially filled, or that position shares changed;
- `lastEntrySignalBarTime` is BUY/ADD signal-bar evidence only, not fill time;
- REDUCE/SELL/STOP_LOSS have no analogous durable trigger-bar field in this state snapshot.

### Finding 3 — current state can lose historical signal identity after reset/transition
State is scoped to the current tradeDate/mode; previous `fired` entries are filtered by current `positionStage` and whether the signal remains active. Signal release/re-entry deliberately permits a new episode. This design is correct for push deduplication but means the current snapshot is not a complete historical operation-signal journal. KV mirrors are TTL-limited and D1 stores the current snapshot per state key rather than append-only event history.

### Finding 4 — safe workflow history does not close the historical 9/16-9/22 join gap
GitHub Actions history proves scheduled workflows ran, but workflow success is not evidence that a particular operation signal existed, was delivered, or was executed. No safe durable artifact identified in this run supplied append-only BUY/ADD/REDUCE/STOP/SELL event rows for 9/16-9/22. Therefore actual historical signal instances and fills remain UNKNOWN unless a separate durable journal/artifact is discovered.

### Supporting evidence / falsification
- Supporting: signalId is deterministic per date/symbol/stage/type plus episode, so a future append-only research recorder could join signal episodes cleanly without changing formal semantics.
- Falsification: the existence of REDUCE source code cannot prove an 8046 REDUCE occurred; a current `positionStage` also cannot prove the transition was caused by the automated signal path.
- Alternative mechanisms remain manual action, historical-version behavior, STOP/SELL, or non-joinable external execution.

### Bias / data-quality / UNKNOWN checks
- Did not infer historical events from later holdings, later price paths, workflow success or source capability.
- Did not equate push acceptance with execution/fill.
- Did not reconstruct missing trigger prices/shares/times from chat memory.
- Historical 9/16-9/22 operation-signal identities/fills remain UNKNOWN where no append-only durable evidence exists.
- No threshold reverse-engineering from the 9/22 ABF rally.

### R01-R08 / I01-I07 impact
- No experiment/factor status or definition changed; no R09/I08.
- Finding strengthens execution-provenance requirements before interpreting Execution Alpha/restoration opportunity.

### Engineering classification / branch / tests / deployment
- Class A evidence/source audit only; no code/schema/runtime change.
- Branch/commit/tests/deployment: no engineering branch or deployment required this run; Formal Core unchanged by construction.
- Production readback was not used to claim signal history because the needed historical endpoint is not safely public and no secret was requested.

## Exact next continuation point
1. Re-read latest main checkpoint + latest research commit; if another A/B run advanced it, merge and continue from the newer cursor.
2. Keep USER PRIORITY OVERRIDE primary.
3. Search repository schema/migrations/research code and safe workflow artifacts specifically for any **append-only** signal/event/journal table or artifact separate from `v7_signal_delivery_state`; inspect D1 schema definitions around signal/execution tables. Do not assume absence until schema search is complete.
4. If an append-only event source exists and is safely readable, recover 9/16-9/22 BUY/ADD/REDUCE/STOP_LOSS/SELL instances and classify signal-emitted vs push-accepted vs confirmed execution. Only confirmed fills may update execution/restoration evidence.
5. If no append-only source exists, record the evidence gap explicitly and evaluate a minimal isolated Class A prospective recorder proposal; do not retrofit historical events and do not alter shared/formal runtime without reclassification.
6. Continue formal scan breadth/planned-capital sequence only when exact plan identities/rows are recoverable.
7. Keep restoration concepts Shadow-only/untuned; any formal restoration, liquidity, A/B, RR, 15m, allocator or trim change remains Class C/LOCKED.
