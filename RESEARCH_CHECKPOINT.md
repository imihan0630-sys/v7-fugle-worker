# Research Checkpoint

Checkpoint sequence: B-36.
Updated: 2026-09-23 04:43 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08.
- Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified research infrastructure baseline: V8.8.1 `8.8.1-execution-coverage`, schema `execution-shadow-v2`; V8.8.0 rollback baseline.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless a newer trusted read proves otherwise.
- B-13/B-16 provenance engineering remains DEFERRED but active as the safe fallback lane while no newer positive-plan date exists.

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

## Historical execution evidence retained
- 09/17 formal plans: 6706 惠特, 3006 晶豪科, 6505 台塑化. 09:27 and 13:19 monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0. Exact historical zones unavailable; symbol-level blocking clause UNKNOWN.
- 09/18 contemporaneous plans: 4763, 1301, 3491, 3665, 3017. 3017 daily low 3290 > buyHigh 3285 => NO_ZONE_TOUCH. Others retain 15m/chronology UNKNOWN where contemporaneous bars are unavailable.
- V8.8.x execution recorder was deployed only after 09/18; it cannot reconstruct 09/18 prospectively. Do not revisit that lane.
- 09/22 scheduled health run `35751075627` positively verified formal selectedCount=0, planCount=0, signalCount=0. Preserve 09/22 as a formal zero-pick date, not an Execution Alpha failure.
- `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`; no trusted per-date Shadow count exists. Do not infer it from aggregate totals.

## B-35 retained — no newer positive-plan date
- Latest trusted inspected scheduled health evidence remained the 09/22 zero-plan run. Encrypted plan-mirror activity is not readable plan-count/identity evidence.
- No new zero-pick observation was added and the SELECTED -> BUY bottleneck hypothesis remains under test.

## NEW B-36 — B-13 provenance design falsification/refinement
### Research question
While waiting for the next trusted positive-plan date, is the deferred B-13 Shadow provenance diagnostic itself sufficiently precise to distinguish true horizon immaturity from data-pipeline incompleteness without changing existing outcomes?

### Evidence / findings
- Re-read governance/worklist/checkpoint and latest main first. Main was B-35 commit `6d3713c7a65758b849f6490ac15b3ad02a5e9e7c`; no competing newer checkpoint was present before this write.
- The existing isolated branch `research/b13-shadow-provenance` was still at B-13. It was fast-forwarded to current main `6d3713c7a65758b849f6490ac15b3ad02a5e9e7c` as a rollback/testable isolation point; no code was changed and nothing was deployed.
- Current `readShadowCounterfactualResearch()` still silently maps malformed `snapshot_json` to `{}`; malformed history JSON to `[]`; and a missing history row also reaches outcome enrichment as `[]`. Existing `coverage.dN` therefore cannot distinguish these failure modes from ordinary immature outcomes.
- B-13's proposed `D1_NOT_YET_MATURE` rule needs one further guard: a successfully parsed but stale/incomplete `v7_history_cache` can also have fewer than the required post-scan bars. Calling that condition simply `NOT_YET_MATURE` would overstate calendar immaturity and hide cache freshness/coverage uncertainty.
- Therefore provenance must separate **calendar maturity** from **observed-history sufficiency**. A row may be calendar-mature for D1/D3/etc while the cache still lacks enough post-scan bars; that state must remain data-coverage UNKNOWN, not ordinary waiting.

### Refined diagnostic semantics (Class A design; no outcome redefinition)
For each archived Shadow row, diagnostics should preserve existing `coverage.dN` exactly and add orthogonal provenance:
1. Snapshot: `SNAPSHOT_PARSE_OK | SNAPSHOT_PARSE_ERROR`; baseline: `BASELINE_CLOSE_OK | BASELINE_CLOSE_MISSING`.
2. History source: `HISTORY_ROW_MISSING | HISTORY_PARSE_ERROR | HISTORY_EMPTY | HISTORY_OK`.
3. For `HISTORY_OK`, expose `historyLastDate` and `postScanValidBars` after the same date/finite-close filter already used by outcome enrichment.
4. Horizon status must not label missing bars as calendar immaturity solely from `postScanValidBars`. Use conservative states: `OUTCOME_AVAILABLE` when existing outcome is finite; `OBSERVED_HISTORY_INSUFFICIENT` when parsed history has fewer than h valid post-scan bars; `BASELINE_UNAVAILABLE` or history error states as applicable. Calendar maturity may be reported separately only if derived from a trustworthy trading-calendar source already available at the research boundary; otherwise `CALENDAR_MATURITY=UNKNOWN`.
5. Do not synthesize missing bars, infer them from current price, or use later web prices to repair historical Shadow. No historical Shadow backfill.
6. Aggregate counters should be by failure/provenance state and may include recent row statuses; they remain research-only observability and cannot gate formal selection/trading.

### Falsification / bias implications
- This refinement falsifies the too-simple interpretation `fewer than h cached post-scan bars => not yet mature`.
- Without the separation, stale-cache symbols/cohorts could be selectively excluded from R01-R08 and create coverage/selection bias while appearing as harmless waiting data.
- No evidence currently proves stale/malformed prospective rows actually exist; occurrence rate remains **UNKNOWN**. This is an observability defect/risk, not a corruption finding.
- No factor, threshold, experiment window or outcome definition changed; Factor Zoo, redundancy and transaction-cost counts unchanged.

### Engineering classification / branch / deployment
- Class A research-only design and branch preparation.
- Branch: `research/b13-shadow-provenance`, fast-forwarded to main B-35 before implementation.
- Code commit: none this cycle. Tests: not run because implementation was intentionally not written before the refined semantics were frozen.
- Deployment: none. Production Formal Core/runtime unchanged. Rollback/reference point: main `6d3713c7a65758b849f6490ac15b3ad02a5e9e7c`.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, then verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals.
3. Otherwise continue B-13/B-16 on `research/b13-shadow-provenance`: implement only the refined research-only snapshot/baseline/history provenance and `postScanValidBars/historyLastDate` diagnostics. Preserve all existing outcome calculations and `coverage.dN` byte/semantic behavior.
4. Targeted tests must cover malformed snapshot + valid history; valid snapshot + malformed history; missing history row; empty history; valid history with insufficient post-scan bars; mature D1; and must prove missing remains null/UNKNOWN and old coverage is unchanged.
5. Do not label insufficient cached bars `NOT_YET_MATURE` unless a trustworthy calendar maturity source is explicitly available at the research boundary; otherwise use `OBSERVED_HISTORY_INSUFFICIENT` plus `CALENDAR_MATURITY=UNKNOWN`.
6. Run regression/invariant suite and compare protected Formal Core outputs before any merge/deploy. If isolation cannot guarantee invariants, stop as Class B.
7. Do NOT revisit 09/18 execution or 09/22 Shadow inference without new trusted evidence. Keep 09/22 `NO_FORMAL_SELECTION=VERIFIED`, `SHADOW_SCAN_STATUS=UNKNOWN`.
8. Signal != fill. REDUCED_CONFIRMED requires trusted actual reduced shares.
