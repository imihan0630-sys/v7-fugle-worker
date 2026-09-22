# Research Checkpoint

Checkpoint sequence: B-19 after main `b8ec327d5ad1990d40788762ab2e47c01ac71dbd`.
Updated: 2026-09-22 20:09 Asia/Taipei.

> Canonical current cursor for both A/B research schedules. Detailed B-18 and earlier evidence remains durable in Git history, especially `b8ec327d5ad1990d40788762ab2e47c01ac71dbd`; do not re-run completed work.

## Governance / immutable boundary
- Formal Core: **LOCKED**. No autonomous change to A/B definitions, ranking, score, thresholds, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push semantics.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow begins 2026-09-21. No fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan date remains the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.

## Production/research baseline retained
- Previously verified research infrastructure: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; merge `9283719e661e42a09b3b0d9fdfe27d54f3753d3e`; V8.8.0 rollback baseline.
- Execution-shadow D1 storage/read coverage remains **UNKNOWN** from safe public reads. Workflow/cron success is not persistence evidence.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless a newer safe durable read proves otherwise.
- B-13/B-16 provenance engineering remains DEFERRED, not cancelled; owner-priority trading-decision investigation outranks generic research engineering unless data quality directly blocks it.

## USER PRIORITY OVERRIDE — capital utilization / selection / execution / re-entry
Primary root question remains:
`universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY -> confirmed fill -> ADD/FULL -> REDUCE -> confirmed reduced shares -> restoration`.
Do not optimize cash utilization by itself and do not alter Formal Core from small retrospective samples.

### Retained findings from B-17/B-18
- 9/16: 1,873 scanned -> 3 selected.
- 9/17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 primary liquidity rejects and 335 no A/B formation.
- 9/18 durable recovery log: selectedCount=3, pipelineComplete=false; identities remain UNKNOWN.
- Frozen allocator structurally caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ selected names; first tranches are about 21% / 36% / 51% before caps/rounding. Idle cash therefore decomposes into breadth + allocator + BUY conversion + ADD/fill conversion.
- 9/16 and 9/17 selected cohorts showed meaningful MFE but weak endpoint advantage versus TAIEX in the tiny observable sample. This falsifies the simplistic claim that only entry strictness explains missed profit; selection quality, execution and position management must remain separate hypotheses.
- 4763 vs 1301 on 9/18 remains direct evidence against blanket BUY loosening: both entered plan zones without same-day stop breach, but 4763 later showed much larger opportunity while 1301 did not.
- Production B is a stricter confirmed-breakout-quality construct than the owner's intended pre-breakout/catch-up B concept; no threshold was changed and any formal B redesign is Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; liquidity-rule quality is therefore an evidence-coverage gap, not proof the gate is wrong.
- Exact 8046 reduction recommendation timestamp, confirmed reduced-share timestamp, execution price and actual trim opportunity cost remain UNKNOWN. Do not infer them from later holdings/path data.

### ABF restoration evidence retained
- 3037/8046/3189 shared a genuine breakdown around 9/3, so a partial risk reduction then could have had valid ex-ante risk-control basis.
- 9/09 and 9/16 produced recovery-looking states that did not cleanly persist; a simple immediate re-add rule can whipsaw.
- 9/18 showed broad early ABF recovery above short trend, but an 8046 early add-back could still have suffered about -4.5% adverse excursion into 9/21 before the 9/22 surge.
- 9/22 produced strong MA5/MA10/MA20 recovery, but much upside was already expressed. Therefore the architectural restoration gap is real while the optimal threshold remains unknown.
- Shadow-only concepts remain untuned and unimplemented: STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY. Do not implement without owner decision.

## NEW B-19 — source-level REDUCE semantics + recoverable-plan evidence audit
### Research questions
1. What does the current source-level REDUCE rule actually detect: generic trend breakdown, or profit-zone distribution?
2. Can repository evidence safely recover exact 9/16 plan identities/zones/stops/targets or additional 9/16–9/22 formal plan rows without inference?

### Evidence audited
- Re-read latest governance, worklist, checkpoint and latest main research commit first.
- `Worker.js` operation-signal source around `evaluateOperationSignals()`.
- `Worker.js` stop/sell/profit semantics and 15m/10m confirmation source.
- `data/v7_formal_scan_backfill.json`.
- `data/recovered_chat_selections.json` later ranges containing 2026-09 records.
- Repository code search for 9/16 plan terms and REDUCE-related durable identities returned no additional safely joinable plan evidence.

### Finding 1 — REDUCE is profit-zone distribution, not a generic trend-break detector
Current source requires **all** of the following for REDUCE:
- an existing position (`positionStage !== NONE`);
- `reduceAt` exists;
- current price is **at or above `reduceAt`**;
- latest completed 15m bar is bearish;
- latest 15m volume ratio exists and is >= 1.3.
When true, the signal text is explicitly `進入獲利區後15分K放量轉弱正式確認，執行計畫減碼`, with 10m only auxiliary, and proposed amount/shares are approximately half of current held amount/shares.

This means REDUCE is structurally a **profit-zone distribution / weakening-after-profit trigger**. It is not designed to detect a generic breakdown below MA5/MA10/MA20, sector deterioration, or loss of trend. Genuine downside trend breaks are handled separately by STOP_LOSS (`15m close < stop`) or SELL (`15m close < sellBelow`) when a position exists.

### Falsification / alternative mechanism
- Therefore an ABF episode where exposure was reduced during a downside breakdown cannot automatically be attributed to this REDUCE rule. It may have come from STOP_LOSS, SELL, a different historical version, manual/user action, or another non-joinable mechanism.
- Conversely, a REDUCE signal can be a **false reduction relative to subsequent upside** even while behaving exactly as designed: price can reach profit zone, print one bearish high-volume 15m bar, trigger a half-reduction, then resume the uptrend. The current trigger has no explicit daily-trend-break requirement.
- This is a distinct restoration problem: a profit-zone distribution trim can need a re-expansion state even when the long trend never truly broke. However no restoration threshold may be tuned from the known ABF path because the exact historical 8046 signal/fill remains UNKNOWN.

### Finding 2 — exact 9/16 plan reconstruction remains unjoinable from current durable repo evidence
- `data/v7_formal_scan_backfill.json` contains exact plan fields only for scanDate 2026-09-11 / planDate 2026-09-14 (2820, 2201, 1301, 6278, 6530).
- `data/recovered_chat_selections.json` contains 9/17 monitor-pool rows for 9/18, including exact plan fields for 3017 but marks these rows SUPERSEDED; 3491/3665/4763/1301 identities are also SUPERSEDED and mostly lack exact plan fields.
- No exact 9/16 plan rows/zones/stops/targets were safely recovered in this run. Keep those fields **UNKNOWN** rather than reconstructing from later prices or chat-memory summaries.
- No additional trustworthy 9/16–9/22 sequence was found that permits extending selectedCount -> planned allocation -> BUY -> confirmed fill without mixing states.

### Bias / robustness checks
- No 9/16 identity or plan price was imputed.
- No ABF trim date was back-selected from the 9/22 rally.
- REDUCE semantics were read from source before judging the historical path; this avoids redefining the trigger after seeing outcomes.
- Profit-zone REDUCE, STOP/SELL trend-break exits, allocator staging, BUY conversion and restoration remain separate mechanisms; do not collapse them into one `cash idle` factor.
- One bearish 15m high-volume bar is a plausible microstructure/distribution signal but can also be transient noise; reverse-testing requires prospective signal instances across independent dates, not a single ABF anecdote.

### R01-R08 / I01-I07 impact
- No experiment/factor definition, threshold or status changed.
- No R09/I08 created.
- Existing research maturity and independent-date rules remain unchanged.

### Engineering classification / changes
- Evidence/source audit only; no code/schema/runtime change.
- Classification: Class A research investigation with no engineering change.
- Branch/tests/deployment: none required; Formal Core unchanged by construction.

## Exact next continuation point
1. Re-read latest main checkpoint and latest research commit first; merge any newer A/B progress before writing.
2. Keep USER PRIORITY OVERRIDE primary.
3. Audit `processSignalState` / journal persistence source to determine exactly what durable fields are recorded for REDUCE, STOP_LOSS, SELL, BUY and ADD, and whether signal identity can be joined without secrets. Separate `signal emitted` from `confirmed execution`.
4. Search safe durable workflow/artifact/history evidence for actual historical operation-signal instances around 9/16–9/22. Do not assume a REDUCE instance existed merely because source supports it.
5. If safely joinable signal instances exist, classify each by mechanism: profit-zone REDUCE vs downside STOP/SELL, then reverse-test subsequent MFE/MAE and restoration opportunity **without tuning thresholds**. Independent scan/signal date is the evidence unit.
6. Continue formal scan breadth/planned-capital sequence only when exact identities/plan rows are recoverable. 9/16 exact zones/stops/targets remain UNKNOWN until durable evidence appears.
7. Keep STAY_REDUCED / EARLY_BREADTH_RECOVERY / FULL_TREND_RECOVERY shadow-only and untuned. A formal restoration rule would be Class C.
8. No liquidity/A-B/RR/15m/allocator/trim change from small samples. Formal Core remains LOCKED.
