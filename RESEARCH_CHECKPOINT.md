# Research Checkpoint

Checkpoint sequence: B-32.
Updated: 2026-09-23 02:42 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified research infrastructure baseline: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; V8.8.0 rollback baseline.
- Latest main before B-32 research read: `53d9a2ef5980b65d5cdae3b07869fd90bfd80627` (B-31 checkpoint).
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

## 2026-09-17 / 09-18 retained historical evidence
- 09/17 formal plans: 6706 惠特, 3006 晶豪科, 6505 台塑化. 09:27 and 13:19 monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0. Exact historical zones unavailable; symbol-level blocking clause UNKNOWN.
- 09/18 contemporaneous plans: 4763, 1301, 3491, 3665, 3017. 3017 daily low 3290 > buyHigh 3285 => NO_ZONE_TOUCH. Others retain 15m/chronology UNKNOWN where contemporaneous bars are unavailable.
- V8.8.x execution recorder was deployed only after 09/18; it cannot reconstruct 09/18 prospectively. Do not revisit that lane.

## NEW B-32 — 2026-09-22 formal zero-selection is now positively verified; execution-recorder completeness remains separate
### Research question
Can 2026-09-22, the first plausible full trading day after V8.8.x recorder deployment, be interpreted safely without coercing missing recorder rows?

### Evidence / findings
- Scheduled health run `35751075627` (`V7 Scheduled Health Verification`) completed successfully after market on 2026-09-22 and checked out main SHA `895d07a2f076ae911ea27d3c6982dd536277247b`.
- Its authorized `scheduled_health.mjs --after-market` runtime read returned `actualAfterMarketHealth.date=2026-09-22`, `selectedCount=0`, `newFullPayloadAccepted=true`, `externalReadbackVerified=true`, and `noNewSelection=true`.
- The same trusted runtime read returned `tradeJournal.verified=true`, `selectedCount=0`, `planCount=0`, `signalCount=0`, plus `noPlanChanges=true`, `noPush=true`, `noTrade=true`.
- This is stronger than a negative repository search: for the formal 2026-09-22 after-market state, the system positively verified zero selected names, zero plans and zero signals. Therefore the formal funnel terminates at SELECTED=0 for this date; there is no valid denominator for a BUY-trigger rate and no evidence of an entry-rule bottleneck on 09/22.
- This does **not** prove `/api/research/execution-recorder` row-window completeness or its 500-row truncation boundary. Recorder coverage health remains a distinct question; however, a missing BUY on 09/22 must not be interpreted as execution failure because there were no formal selections/plans to execute.
- It also does not prove whether a 2026-09-22 prospective Shadow archive scan exists. Formal `selectedCount=0` and Shadow archive coverage are separate; Shadow independent-date count remains one until a trusted Shadow read proves otherwise.

### Research interpretation / falsification
- 09/22 is a **selection-zero date**, not evidence that 15m confirmation, maxChase, push, or execution logic suppressed entries.
- Cash utilization on 09/22 is structurally zero from the formal selection layer. It must not be scored as Execution Alpha failure or BUY conversion failure.
- This adds a real zero-pick observation to the capital-utilization lane, but one date is not enough to infer excessive selectivity. It increases the importance of measuring zero-pick rate across independent formal scan dates rather than only studying selected cohorts.
- No later return, missing signal, or recorder absence was used to infer a failed entry.
- Confirmed brokerage fills remain outside this evidence; `noTrade=true` is system-side verification, not a brokerage reconciliation ledger.

### Bias / UNKNOWN controls
- Selection bias: preserve zero-selection dates in denominator diagnostics; do not drop them merely because no trade followed.
- Look-ahead/data snooping: none; evidence is contemporaneous authorized after-market readback.
- Coverage: execution-recorder exact row coverage/truncation remains UNKNOWN; Shadow 09/22 scan existence remains UNKNOWN.
- Market-source bias/redundancy/Factor Zoo: no new factor or experiment introduced; R01-R08/I01-I07 unchanged.
- Overfit/date clustering: one zero-pick date is descriptive only, not a threshold-change argument.

### Engineering classification
- Evidence-only Class A research checkpoint. No code/runtime/schema/workflow/deployment changes.
- Formal Core invariants unchanged.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. Do **not** treat 09/22 as an execution failure: formal SELECTED=0 / plan=0 / signal=0 is positively verified. Add 09/22 to zero-pick/coverage diagnostics, not BUY-conversion failure.
3. Next priority: establish whether a 2026-09-22 prospective Shadow archive scan exists using an existing trusted research readback. If it exists, update independent Shadow scan-date count and cohort coverage; if absent/unclear, keep UNKNOWN and distinguish `NO_FORMAL_SELECTION` from `NO_SHADOW_SCAN`.
4. Separately verify `/api/research/execution-recorder` coverage on the next date that has at least one formal plan. Required proof before interpreting absent signals: successful protected query + explicit target-date rows/coverage + evidence target date is not truncated by the 500-row cap. Do not spend recorder-analysis effort on zero-plan dates.
5. Continue funnel by independent date: selected/planned -> price-path contact -> 15m-confirm eligible -> BUY observed -> confirmed fill. Signal != fill. Preserve zero-pick dates in selection-rate diagnostics.
6. Only trustworthy 15m OHLCV may test frozen 15m clauses; never approximate missing bars.
7. TTL research remains `EXPIRE_AS_IS` vs `REVALIDATED_RESELECT`; blind carry-forward is falsification comparator only.
8. REDUCE/re-entry requires trusted actual reduced shares before `REDUCED_CONFIRMED`; otherwise recommendation-only.
