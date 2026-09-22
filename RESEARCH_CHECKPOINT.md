# Research Checkpoint

Checkpoint sequence: B-40.
Updated: 2026-09-23 05:44 Asia/Taipei.

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

## B-38 retained — bounded human-momentum discretion hypothesis (research-only)
- Hypothesis: experienced `追漲而非追高` behavior may capture genuine price acceptance before every conservative confirmation completes.
- Must be falsified against FOMO/exhaustion/fake-breakout/gap-chasing, MAE, stop-first chronology, costs and whipsaw.
- Keep execution-alpha experiment on the same formal SELECTED names separate from any near-miss selection-alpha rescue experiment.
- Candidate tag remains `HUMAN_MOMENTUM_SHADOW`, research-only; no Formal Core change.

## B-39 retained — zero-selection notification delivery incident
- Owner requires a daily result notification even when selectedCount=0.
- Current code creates a zero-name DAILY_SELECTION payload and upstream verifier can prove webhook/outbox ACCEPTED, but cannot prove handset receipt (`handsetReceiptVerified:false`).
- Owner reported no after-market notification. Treat as delivery-semantics/reliability gap, not proof zero-selection branch was skipped.
- Any push/notification behavior change is Class C. No production change deployed.

## Historical execution evidence retained
- 09/17 formal plans: 6706 惠特, 3006 晶豪科, 6505 台塑化. 09:27 and 13:19 monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0. Exact historical zones unavailable; symbol-level blocking clause UNKNOWN.
- 09/18 contemporaneous plans: 4763, 1301, 3491, 3665, 3017. 3017 daily low 3290 > buyHigh 3285 => NO_ZONE_TOUCH. Others retain 15m/chronology UNKNOWN where contemporaneous bars are unavailable.
- V8.8.x execution recorder was deployed only after 09/18; it cannot reconstruct 09/18 prospectively. Do not revisit that lane.
- 09/22 scheduled health run `35751075627` positively verified formal selectedCount=0, planCount=0, signalCount=0. Preserve 09/22 as a formal zero-pick date, not an Execution Alpha failure.
- `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`; no trusted per-date Shadow count exists. Do not infer it from aggregate totals.

## B-36/B-37 retained — provenance semantics + isolated scaffold
- Existing counterfactual research can collapse malformed snapshot/history and missing history into ordinary empty structures; existing `coverage.dN` cannot distinguish these provenance failures.
- Conservative semantics remain frozen: snapshot parse state; baseline close state; history row/parse/empty/OK; historyLastDate; postScanValidBars; OUTCOME_AVAILABLE vs provenance failure/OBSERVED_HISTORY_INSUFFICIENT; calendar maturity UNKNOWN without trusted calendar evidence.
- Isolated branch `research/b13-shadow-provenance` contains `research/shadow_provenance_v8_8_2.js` and `research/shadow_provenance_v8_8_2.test.mjs` at branch commit `78228598587800b8c24112d706078208fcdce7b4`.
- Helper is not imported by production/runtime; existing outcome and coverage behavior remain untouched. Tests were authored but not yet executed.

## NEW B-40 — authorized CI path audit for provenance tests
### Research / engineering question
Can the isolated Class A provenance targeted test be executed through an already-authorized repository CI path without modifying deployment/runtime or falsely claiming an unexecuted test PASS?

### Evidence
- Re-read governance, worklist and latest canonical checkpoint first; checkpoint blob before this write was `36b9ad223efbf0e710808a5273d93c46d86b27ff`.
- Re-read the branch test and helper. The targeted test source covers malformed snapshot, malformed/missing/empty history, observed-history insufficiency, finite D1 outcome precedence and UNKNOWN-preserving parse semantics.
- Audited `.github/workflows` on `research/b13-shadow-provenance`. Existing `v7-regression.yml` has `workflow_dispatch`, but its automatic push trigger is limited to `main` and `repair/v7-30-rules-20260916`; it does not automatically execute this research branch.
- Existing regression workflow also does not invoke `research/shadow_provenance_v8_8_2.test.mjs` in the inspected workflow section. Therefore an existing successful production regression run cannot be repurposed as evidence that the new targeted test passed.
- Connected GitHub tooling in this run exposes read/re-run operations for existing workflow runs/jobs but no safe generic workflow-dispatch action for starting a new branch run. A GET-style GitHub fetch cannot POST a workflow dispatch. No test execution was fabricated.

### Falsification / bias / safety
- Test source assertions are not execution evidence. Status remains TEST_WRITTEN_NOT_EXECUTED.
- No attempt was made to merge the helper into main merely to obtain CI, because that would reverse the required safety order (tests/invariants before integration).
- No new factor, threshold, window, cohort, R01-R08/I01-I07 definition, historical Shadow or market evidence was created.
- Formal outputs, existing `coverage.dN`, selection, capital, monitoring and push behavior remain unchanged.

### Engineering classification / deployment
- Class A research-only audit; no runtime/deployment change.
- Branch code unchanged this cycle; main receives checkpoint only.
- Production deployment: none. Rollback baseline remains V8.8.0; verified production research baseline remains V8.8.1.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, then verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals. Add same-date research-only HUMAN_MOMENTUM_SHADOW observations on formal SELECTED names first; do not mix near-miss rescue with execution alpha.
3. Otherwise continue `research/b13-shadow-provenance` without integrating into runtime: add an explicit standalone regression test artifact that freezes representative old `researchShadowOutcomeForRow()` / `coverage.dN` outputs and demonstrates the provenance helper is observational-only. Keep it executable with plain Node and no secrets/network.
4. Search for an already-authorized CI mechanism that can execute branch research tests without changing shared deployment workflow. If none exists, record the limitation; do not modify shared workflow solely to run this test without reclassification (workflow/pipeline change is Class B).
5. Only after targeted tests + old-output regression/invariant tests have actually executed and passed may provenance integration be considered. Integration must remain additive; no outcome/coverage redefinition. If isolation cannot be guaranteed, reclassify Class B and stop before promotion.
6. Keep `OBSERVED_HISTORY_INSUFFICIENT` distinct from calendar maturity; `CALENDAR_MATURITY=UNKNOWN` unless trusted calendar evidence exists.
7. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
