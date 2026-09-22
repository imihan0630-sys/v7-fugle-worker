# Research Checkpoint

Checkpoint sequence: B-42.
Updated: 2026-09-23 06:44 Asia/Taipei.

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
- Isolated branch `research/b13-shadow-provenance` contains `research/shadow_provenance_v8_8_2.js`, targeted test, and observational invariant fixture at branch commit `46c0ba15f58f432944e477b1b3d16fbf6403705f`; helper is not imported by production/runtime.

## NEW B-42 — both isolated plain-Node provenance tests executed successfully
### Engineering progress / evidence
- Re-read governance/worklist/checkpoint and latest main before work. Main at cycle start: `0388ea48a7d9d1ba0a29d869adc8fa099b826c2f`; provenance branch: `46c0ba15f58f432944e477b1b3d16fbf6403705f`.
- No newer trusted formal scan with >=1 plan was found in available GitHub Actions evidence; latest visible scheduled health evidence remains 09/22 zero-pick, so provenance continuation retained priority.
- Connected GitHub tooling still exposes no safe branch workflow-dispatch action. Instead, the exact UTF-8 contents of the branch helper and both tests were fetched through the connected GitHub tool, materialized into an isolated local temporary directory, and executed with the installed Node runtime. No secret, network access, Cloudflare binding, workflow edit, or production runtime was used.
- `node shadow_provenance_v8_8_2.test.mjs` => PASS.
- `node shadow_provenance_observational_regression_v8_8_2.test.mjs` => PASS.
- Targeted cases therefore executed successfully for malformed snapshot/history, missing/empty history, observed-history insufficiency, finite-outcome precedence, and UNKNOWN-preserving semantics.
- Observational invariant fixture executed successfully: representative frozen legacy `outcome.horizons` and `coverage.dN` objects remained deep-equal before/after diagnostics; D1 finite outcome stayed `OUTCOME_AVAILABLE`; later insufficient observed bars stayed `OBSERVED_HISTORY_INSUFFICIENT`; calendar maturity stayed UNKNOWN.

### Falsification / limitations / data quality
- This is local execution of the exact fetched branch sources, not GitHub Actions CI and not Production execution. Do not label it CI PASS or deployment verification.
- The observational fixture is representative, not exact equivalence proof for every production `researchShadowOutcomeForRow()` path. Production function integration has not occurred and no production fixture was invented.
- First attempt to fetch raw GitHub directly from the local container failed because that runtime has no DNS/network access; no conclusion was drawn from the transient environment limitation. Exact sources were then obtained from the authorized GitHub connector before execution.
- No new factor/threshold/window/cohort, no historical Shadow backfill, no BAD/0 coercion. Selection bias/look-ahead/market-source/Factor-Zoo exposure unchanged because this artifact only diagnoses provenance.

### R01-R08 / I01-I07 impact
- Definitions unchanged. Potential benefit is data-quality observability only: future experiment readiness can distinguish missing/malformed evidence from genuine immature/absent outcomes instead of silently collapsing them.
- No maturity/readiness status is upgraded solely from these test passes; prospective independent-date requirements remain unchanged.

### Engineering classification / deployment / rollback
- Class A isolated research-only validation.
- Branch code unchanged this cycle; no merge, no runtime import, no deployment. Formal Core and production outputs unchanged.
- Test status advances from TEST_WRITTEN_NOT_EXECUTED to **LOCAL_EXACT_SOURCE_PASS** for both plain-Node tests. CI status remains NOT_RUN.
- Rollback baseline remains V8.8.0; verified production research baseline remains V8.8.1. Branch rollback point remains parent `78228598587800b8c24112d706078208fcdce7b4` if the provenance artifacts are later abandoned.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise provenance lane may now advance one gate: inspect the exact production `researchShadowOutcomeForRow()` and surrounding counterfactual call path to design an **additive, research-only integration proposal** that cannot mutate existing outcome/coverage semantics. Do not integrate merely because local tests passed.
4. Prefer extracting a durable production-shaped fixture for exact-equivalence regression before integration. If extraction requires shared runtime/workflow/storage modification, reclassify Class B and stop before promotion.
5. If integration can remain a separate observational diagnostic path with no shared formal behavior, keep Class A; after code change run targeted + invariant + existing regression tests and compare Formal Core invariants before any merge/deploy.
6. `OBSERVED_HISTORY_INSUFFICIENT` remains distinct from calendar maturity; `CALENDAR_MATURITY=UNKNOWN` unless trusted calendar evidence exists.
7. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
