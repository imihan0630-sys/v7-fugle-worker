# Research Checkpoint

Checkpoint sequence: B-43.
Updated: 2026-09-23 07:14 Asia/Taipei.

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
- B-13/B-16 provenance engineering is active on isolated branch `research/b13-shadow-provenance`; nothing from that branch is deployed.
- Branch commit retained: `46c0ba15f58f432944e477b1b3d16fbf6403705f`; both plain-Node provenance tests have status **LOCAL_EXACT_SOURCE_PASS**, CI NOT_RUN.

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

## Human-momentum / notification retained
- `HUMAN_MOMENTUM_SHADOW`: research-only hypothesis that bounded `追漲而非追高` discretion may capture price acceptance before conservative confirmation completes. Must be falsified against FOMO/exhaustion/fake-breakout/gap-chasing, MAE, stop-first chronology, costs and whipsaw. Keep execution-alpha on formal SELECTED names separate from near-miss selection-alpha rescue.
- Zero-selection notification: owner requires a daily result even when selectedCount=0. Current code can create zero-name DAILY_SELECTION and upstream ACCEPTED evidence does not prove handset receipt. Any push behavior change is Class C.

## Historical execution evidence retained
- 09/17 formal plans: 6706 惠特, 3006 晶豪科, 6505 台塑化. 09:27 and 13:19 monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0. Exact historical zones unavailable; symbol-level blocking clause UNKNOWN.
- 09/18 contemporaneous plans: 4763, 1301, 3491, 3665, 3017. 3017 daily low 3290 > buyHigh 3285 => NO_ZONE_TOUCH. Others retain 15m/chronology UNKNOWN where contemporaneous bars are unavailable.
- V8.8.x execution recorder was deployed only after 09/18; it cannot reconstruct 09/18 prospectively. Do not revisit that lane.
- 09/22 scheduled health run `35751075627` positively verified formal selectedCount=0, planCount=0, signalCount=0. Preserve 09/22 as a formal zero-pick date, not an Execution Alpha failure.
- `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`; no trusted per-date Shadow count exists. Do not infer it from aggregate totals.

## Provenance lane retained through B-42
- Existing counterfactual research can collapse malformed snapshot/history and missing history into ordinary empty structures; existing `coverage.dN` cannot distinguish these provenance failures.
- Conservative semantics: snapshot parse state; baseline close state; history row/parse/empty/OK; historyLastDate; postScanValidBars; OUTCOME_AVAILABLE vs provenance failure/OBSERVED_HISTORY_INSUFFICIENT; calendar maturity UNKNOWN without trusted calendar evidence.
- Isolated branch helper/tests are not imported by production/runtime. Targeted and observational invariant tests passed locally from exact fetched sources. Representative frozen legacy `outcome.horizons` and `coverage.dN` stayed deep-equal before/after diagnostics. This is not CI PASS, deployment verification, or proof of every production path.

## NEW B-43 — exact counterfactual call-path audit and additive integration boundary
### Exact production research path inspected
- Re-read latest governance/worklist/checkpoint and main before work. Main at cycle start is `0d6f2e6b0bc8c7a3f4e6313007154c29994f4e9c` (B-42 checkpoint commit).
- Inspected `research/counterfactual_v8_7_4.js` exact `researchShadowOutcomeForRow(row,bars)` and `readShadowCounterfactualResearch(env,days)` call path.
- `readShadowCounterfactualResearch()` currently parses each `snapshot_json` with `try/catch`; parse failure silently becomes `{}`. It then loads `v7_history_cache`; missing rows are absent, malformed `history_json` silently becomes `[]`, and the outcome call receives `histories[symbol] || []`.
- `researchShadowOutcomeForRow()` itself normalizes `bars` to an array, filters only post-scan bars with finite close, and emits null horizons when observed bars are insufficient. Therefore three materially different states can collapse into the same legacy null outcome: no history row, malformed/empty history, or valid history with too few post-scan bars.
- Legacy `coverage.dN` is computed only by counting finite `horizons.dN.returnPct`; it cannot identify why a horizon is unavailable.

### Integration design conclusion
- The safest additive design is **not** to alter `researchShadowOutcomeForRow()` return semantics and **not** to rewrite `coverage.dN`.
- Provenance diagnostics should be computed as a parallel observational object from the raw DB row + raw snapshot parse result + raw history-row/parse state + existing legacy outcome, then exposed under a separate research-only field such as `provenanceDiagnostics` / `provenanceCoverage`.
- This keeps all existing `byCohort`, `selectionAlpha`, breakout, intraday/overnight, residual-RS, quiet-vs-attention and readiness consumers on the frozen legacy outcome object. No research result may be upgraded solely because provenance becomes observable.
- A durable production-shaped exact-equivalence fixture can be built without production/runtime mutation by freezing representative raw rows/history JSON plus the corresponding legacy outcome/coverage result from the existing pure path. It must include at least: valid mature D1, valid-but-insufficient later horizon, missing history row, malformed history JSON, empty history array, malformed snapshot JSON, and missing/invalid baseline close.

### Falsification / alternative mechanisms / bias checks
- Provenance observability does not prove missing data caused any past selection or execution failure; it only distinguishes evidence states. Treating it as alpha would be category error.
- A null horizon may legitimately mean observed-history insufficiency, not corruption and not calendar immaturity. Calendar maturity remains UNKNOWN unless trusted calendar evidence exists.
- Do not infer that malformed/missing history is common from code-path possibility alone; prevalence is UNKNOWN until measured prospectively.
- No selection-bias/look-ahead/data-snooping/market-source/Factor-Zoo exposure is added by the proposed diagnostic because it adds no factor, cohort, threshold, rank or historical Shadow reconstruction.
- Coverage semantics must remain dual: legacy outcome coverage stays frozen for backward compatibility; provenance coverage separately explains UNKNOWN/data-quality causes. Never replace one with the other.

### Engineering classification / status
- Design-only this cycle; no branch code changed, no merge/deploy, no shared runtime/storage/workflow modification.
- Parallel diagnostic integration remains potentially Class A **only if** it is isolated to research output and cannot mutate legacy outcome/coverage or Formal Core behavior. If implementation requires changing shared schema/runtime/storage/workflow, reclassify Class B before change.
- Formal Core unchanged. R01-R08/I01-I07 definitions and maturity remain unchanged.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise continue provenance lane on isolated branch: create a **production-shaped exact-equivalence regression fixture** around the frozen `researchShadowOutcomeForRow()` + legacy `coverage.dN` behavior. Do not invent production rows; use deterministic representative raw row/history shapes that exactly exercise the current parser/call path and label them synthetic fixtures.
4. The fixture must prove that adding provenance diagnostics leaves legacy outcome object and legacy `coverage.dN` byte/deep-equivalent for the same inputs, including malformed snapshot/history and valid-but-insufficient observed bars.
5. Only after exact-path fixture passes may additive provenance integration be implemented on the isolated branch. Keep diagnostics parallel; do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()`, or legacy coverage semantics.
6. After any integration code change run targeted + representative invariant + exact-path fixture + existing counterfactual regression tests locally from exact branch sources. CI remains NOT_RUN unless an already-authorized safe runner becomes available.
7. `OBSERVED_HISTORY_INSUFFICIENT` remains distinct from calendar maturity; `CALENDAR_MATURITY=UNKNOWN` unless trusted calendar evidence exists.
8. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
