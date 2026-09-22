# Research Checkpoint

Checkpoint sequence: B-21.
Updated: 2026-09-22 21:12 Asia/Taipei.

> Canonical cursor for both A/B research schedules. B-20 and earlier evidence remains durable in Git history; do not re-run completed work.

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

### Retained B-17/B-20 findings
- 9/16: 1,873 scanned -> 3 selected. 9/17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 primary liquidity rejects; 335 no A/B formation.
- Frozen allocator caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ names; first tranches about 21% / 36% / 51% before caps/rounding.
- Tiny 9/16-9/17 cohorts had meaningful MFE but weak endpoint advantage vs TAIEX; selection quality, execution and position management remain separate hypotheses.
- 4763 vs 1301 on 9/18 remains evidence against blanket BUY loosening.
- Production B is stricter confirmed-breakout quality than the owner's intended pre-breakout/catch-up concept; redesign would be Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; this is an evidence-coverage gap, not proof the gate is wrong.
- Exact 8046 reduction recommendation/fill timestamp, price and reduced shares remain UNKNOWN.
- Current REDUCE = profit-zone distribution: existing position + currentPrice>=reduceAt + bearish completed 15m + volumeRatio>=1.3. Generic downside exits are separate STOP_LOSS/SELL mechanisms.
- Exact 9/16 plan identities/zones/stops/targets remain unjoinable from current durable repo evidence and therefore UNKNOWN.
- Restoration concepts STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY remain untuned Shadow concepts only.
- B-20 established `v7_signal_delivery_state` is current delivery/dedup state, not an append-only execution journal; push acceptance is not brokerage execution.

## NEW B-21 — complete append-only signal/event schema audit
### Research question
Does the repository contain any append-only signal/event/journal source, separate from `v7_signal_delivery_state`, that can safely recover historical BUY/ADD/REDUCE/STOP_LOSS/SELL instances or confirmed fills for 9/16-9/22?

### Evidence audited
- Re-read latest main governance, worklist and checkpoint first; latest main research commit before this write was `2ad2ef637448e04ecc733af4792fef7dc4da6e2d` (`research: checkpoint B-20 signal persistence semantics`).
- Inspected repository tree and `research/` contents on main for migrations, schema files, signal/event/journal artifacts and research recorders.
- Inspected `Worker.js` D1 `ensureD1Schema()` definitions and nearby read/write helpers.
- Re-read checkpoint immediately before write; blob SHA remained `db12b8894fdde75247eed3f17b38992cf1f43b94`, so no concurrent A/B checkpoint update was overwritten.

### Finding 1 — current main D1 schema has no append-only operation-signal/event table
`ensureD1Schema()` defines the operational tables visible in current main:
- `v7_live_state` — one current snapshot row (`id=1`);
- `v7_cron_runs` — append-only cron execution audit, but no per-symbol trading signal/fill semantics;
- `v7_history_cache` — per-symbol history cache;
- `v7_history_seed_state` — one seed-progress state row;
- `v7_institution_snapshots` — per-date institution snapshot;
- `v7_quality_snapshots` — per dataset/date quality snapshot;
- `v7_signal_delivery_state` — current per-state-key delivery/dedup snapshot.
No append-only BUY/ADD/REDUCE/STOP_LOSS/SELL event table is defined there.

### Finding 2 — repository tree does not expose a separate migration/schema artifact that closes the gap
The main tree contains Worker.js, research modules, workflow files, data snapshots and encrypted external mirror files, but no standalone D1 migration directory/schema file or clearly named append-only signal journal artifact was found in this audit. Research modules are experiment/evidence/counterfactual/readiness tooling; none identified here provides historical formal operation-signal event rows for 9/16-9/22.

### Finding 3 — `v7_cron_runs` is append-only but is not the missing execution evidence
Cron rows contain scheduling/job status, skip state, Fugle-call count, detail and error. They can prove a scheduled job ran or failed, but cannot prove that symbol 8046 (or any symbol) emitted REDUCE, that a push was accepted, or that shares were actually reduced. Treating cron success as signal/fill evidence would create false provenance.

### Finding 4 — historical 9/16-9/22 operation instances remain UNKNOWN
After completing the schema/tree search requested by B-20, no safe append-only source has been identified that can reconstruct per-event BUY/ADD/REDUCE/STOP_LOSS/SELL identity, trigger price/time, suggested shares, or confirmed fill/share transition for 9/16-9/22. Therefore those historical facts remain UNKNOWN; no retrospective synthetic journal will be created.

### Prospective recorder evaluation
A future append-only research recorder is conceptually useful because deterministic `signalId = tradeDate:symbol:positionStage:signalType:episode-N` already exists. However, recording at the formal signal/push path would modify shared runtime/storage behavior. Even if the new table/API is research-only, inserting writes into `processSignalState`/delivery flow creates indirect production latency/failure/storage risk. Under `RESEARCH_ENGINEERING_GOVERNANCE.md`, that implementation is **Class B unless it can be redesigned so collection is isolated from the formal signal path**. Therefore no recorder was added automatically in this run.

A safe design target for later review is an append-only research event with PIT fields such as signalId, tradeDate, symbol, positionStage, signalType, episode, triggerBarTime when available, observedCurrentPrice, reason, suggestedShares/amount, emittedAt, delivery status/time and provenance. Confirmed execution must remain a separate field/source and must never be inferred from delivery. Historical rows must not be backfilled from later holdings or price paths.

### Supporting evidence / falsification / alternative mechanisms
- Supporting: deterministic signalId would permit prospective episode-level joins without changing the formal signal definition.
- Falsification: existence of `v7_cron_runs` and successful workflows does not close the operation-event gap; they lack per-symbol signal/fill identity.
- Alternative mechanisms for historical share changes remain manual action, historical-version behavior, STOP/SELL paths, external broker execution or another non-repository source; without durable evidence each remains UNKNOWN.

### Bias / data-quality checks
- No look-ahead reconstruction from 9/22 price behavior.
- No later holdings used to infer a prior signal or fill.
- No workflow success treated as signal evidence.
- No UNKNOWN coerced to BAD/0.
- No new factor/window/threshold introduced; no Factor-Zoo or data-snooping expansion.
- Historical absence of evidence is not evidence that no signal occurred; it only means current durable repository evidence cannot prove it.

### R01-R08 / I01-I07 impact
- No experiment/factor status or definition changed; no R09/I08.
- Execution/restoration research remains provenance-blocked for historical operation instances until confirmed execution evidence exists.

### Engineering classification / branch / tests / deployment
- Class A source/schema audit only; no code/schema/runtime change.
- Prospective recorder implementation is classified **Class B as currently conceived** because it would touch the shared formal signal path/storage runtime; proposal only, no autonomous merge/deploy.
- No branch/tests/deployment needed for this evidence-only run; Formal Core unchanged by construction.

## Exact next continuation point
1. Re-read latest main checkpoint + latest research commit; if another A/B run advanced it, merge and continue from the newer cursor.
2. Keep USER PRIORITY OVERRIDE primary.
3. Do **not** repeat the append-only schema search unless main gains a new schema/migration/event artifact after B-21.
4. Continue the capital-utilization chain from the earliest point with durable evidence: inspect safe repo artifacts/data/workflow outputs for exact formal plan identities and planned capital rows for 9/16-9/22, prioritizing dates not yet recovered. Separate SELECTED/planned capital from BUY-observed/confirmed fill; do not infer fills.
5. In parallel, evaluate whether an isolated post-hoc Class A collector can observe already-produced research/live outputs without inserting writes into `processSignalState`; if not, leave the prospective event recorder as a Class B proposal requiring owner approval before production integration.
6. If exact plan rows become recoverable, quantify `SELECTED -> planned first tranche -> planned max allocation` by independent plan date and compare unused capital attributable to selection breadth versus allocator caps. Keep BUY/fill utilization UNKNOWN unless confirmed execution exists.
7. Keep restoration concepts Shadow-only/untuned; any formal restoration, liquidity, A/B, RR, 15m, allocator, trim or signal-recorder integration change that can affect production remains Class B/C and must not be promoted autonomously.
