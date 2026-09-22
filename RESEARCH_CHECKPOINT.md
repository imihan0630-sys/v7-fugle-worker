# Research Checkpoint

Checkpoint sequence: B-33.
Updated: 2026-09-23 03:12 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified research infrastructure baseline: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; V8.8.0 rollback baseline.
- Latest main before B-33 research read: `1adf86c36469c02ed2b374d0bd7def579d1de272` (B-32 checkpoint commit).
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

## B-32 retained — 2026-09-22 formal zero-selection positively verified
- Scheduled health run `35751075627` successfully verified the formal 2026-09-22 after-market state: selectedCount=0, journal planCount=0, signalCount=0, with external readback verified and no trade.
- 09/22 is a selection-zero date, not an Execution Alpha/BUY-conversion failure. Preserve it in zero-pick diagnostics.
- Confirmed brokerage fills remain outside this evidence.

## NEW B-33 — 09/22 Shadow archive existence remains UNKNOWN; current trusted health path does not observe Shadow
### Research question
Can the existing trusted readback used for 09/22 formal health also establish whether a prospective Shadow archive was written on 09/22?

### Evidence / findings
- `tests/scheduled_health.mjs --after-market`, the exact authorized path behind the successful 09/22 health run, reads `/api/scan/status`, `/api/journal/health?date=...`, config, cron/outbox/receipts, watchlist, storage/readback and acceptance reconciliation. It does **not** query a Shadow archive/counterfactual endpoint or count `trade_research_shadow_candidates`.
- Therefore the successful 09/22 health run positively proves formal `SELECTED=0 / plan=0 / signal=0`, but it cannot prove `NO_SHADOW_SCAN` and cannot prove that a 09/22 Shadow scan exists.
- The research implementation `readShadowCounterfactualResearch()` reads `trade_research_shadow_candidates` over a date window and returns aggregate `archivedRows`, `outcomeRows`, horizon coverage and only the last 80 outcomes. It does not expose an explicit per-scan-date archive coverage/count field.
- Consequently, even a newer aggregate readback cannot safely infer 09/22 archive existence merely from total archivedRows increasing or staying unchanged: another scan date, rerun/replacement, or the `recentOutcomes` 80-row cap can make that inference ambiguous.
- No durable trusted output located in this cycle explicitly states a 2026-09-22 Shadow row count or per-date Shadow coverage. Per governance, 09/22 Shadow status remains **UNKNOWN**, not `NO_SHADOW_SCAN`.

### Research interpretation / falsification
- Distinguish two states permanently in this lane: `NO_FORMAL_SELECTION` is verified for 09/22; `SHADOW_SCAN_STATUS=UNKNOWN` remains unresolved.
- A zero-formal-selection day may still legitimately have Shadow NEAR_MISS/REJECTED/BROAD_CONTROL rows. Therefore formal zero-pick cannot be used as a proxy for absent Shadow coverage.
- The current aggregate Shadow API shape creates an observability gap for independent-date accumulation: total rows are insufficient to prove how many prospective scan dates are represented.
- This is a data-quality/coverage observability issue only. It is not evidence that Shadow failed to write, and it is not evidence for changing formal selection thresholds.

### Bias / UNKNOWN controls
- Selection bias: retain 09/22 zero-pick in formal denominator even while Shadow status is UNKNOWN.
- Look-ahead/data snooping: no later return used to infer archive existence or selection quality.
- Coverage: prospective independent Shadow scan-date count remains one verified date until explicit per-date evidence appears.
- Factor Zoo/redundancy/market-source bias: no factor/experiment/source definition changed.
- Overfit/date clustering: no directional conclusion from one zero-pick date.

### Engineering classification
- This cycle is evidence-only Class A; no code/runtime/schema/workflow/deployment changes.
- A future isolated research-only per-scan-date Shadow coverage diagnostic would conceptually be Class A only if it cannot alter shared runtime/formal behavior; touching shared endpoint/runtime/deployment paths must be reclassified under governance before implementation. B-13/B-16 provenance work remains deferred.
- Formal Core invariants unchanged.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. Preserve 09/22 as `NO_FORMAL_SELECTION` and `SHADOW_SCAN_STATUS=UNKNOWN`; do not infer one from the other.
3. Do not re-run generic repository searches for 09/22 Shadow. Look for a **trusted existing runtime/research readback with explicit per-scan-date Shadow counts**. Only such evidence may raise verified independent Shadow dates above one.
4. If no existing per-date Shadow readback exists, document the observability gap and continue the primary funnel on the next formal date with >=1 plan rather than spending cycles trying to infer 09/22 from aggregate row totals. A diagnostic engineering proposal may be prepared later under governance, but do not alter shared runtime autonomously.
5. On the next date with >=1 formal plan, verify `/api/research/execution-recorder` coverage before interpreting absent signals: successful protected query + explicit target-date rows/coverage + proof target date is not truncated by the 500-row cap.
6. Continue funnel by independent date: selected/planned -> price-path contact -> 15m-confirm eligible -> BUY observed -> confirmed fill. Signal != fill. Preserve zero-pick dates in selection-rate diagnostics.
7. Only trustworthy 15m OHLCV may test frozen 15m clauses; never approximate missing bars.
8. TTL research remains `EXPIRE_AS_IS` vs `REVALIDATED_RESELECT`; blind carry-forward is falsification comparator only.
9. REDUCE/re-entry requires trusted actual reduced shares before `REDUCED_CONFIRMED`; otherwise recommendation-only.
