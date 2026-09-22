# Research Checkpoint

Checkpoint sequence: B-44.
Updated: 2026-09-23 07:40 Asia/Taipei.

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
- Pre-B44 branch helper/tests commit retained: `46c0ba15f58f432944e477b1b3d16fbf6403705f`; targeted + observational tests previously achieved **LOCAL_EXACT_SOURCE_PASS**, CI NOT_RUN.

## Primary research lane retained
Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Frozen allocator caps planned deployment at 35% / 60% / 85% for 1 / 2 / 3+ names; first tranches about 21% / 36% / 51% before caps/rounding.
- Production B is stricter confirmed-breakout quality than owner's intended pre-breakout/catch-up concept; redesign is Class C.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; this is an evidence-coverage gap, not proof the gate is wrong.
- `v8_trade_journal_signals` establishes formal BUY/ADD/REDUCE observations when durably readable; it is not a brokerage fill journal. Confirmed fills remain UNKNOWN absent trusted reconciliation.
- 09/17 selected pair 4763/1301 through 09/22: endpoint about +0.37%, average MFE +7.55%, MAE -0.57%; near-miss 12 endpoint about -0.77%, MFE +1.12%, MAE -1.46%. One independent date only; no filter change.
- 8046 restoration remains Shadow concept only; no production re-entry rule.
- `HUMAN_MOMENTUM_SHADOW` remains research-only: test bounded price acceptance against FOMO/exhaustion/fake-breakout/gap-chasing, MAE, stop-first chronology, costs and whipsaw. Keep formal SELECTED execution-alpha separate from near-miss selection rescue.
- 09/22 scheduled health positively verified selectedCount=0, planCount=0, signalCount=0. Preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.

## Provenance lane retained through B-43
- Current counterfactual path can collapse malformed snapshot/history, missing history, and valid-but-insufficient observed history into legacy null horizons. Legacy `coverage.dN` cannot explain the cause.
- Conservative diagnostics: snapshot parse state; baseline state; history row/parse/empty/OK; historyLastDate; postScanValidBars; OUTCOME_AVAILABLE vs provenance failure/OBSERVED_HISTORY_INSUFFICIENT; calendar maturity UNKNOWN without trusted calendar evidence.
- Safest design is parallel/additive diagnostics. Do not alter `researchShadowOutcomeForRow()`, `researchOutcomeCohortSummary()`, `researchPairedSelectionAlpha()` or legacy `coverage.dN` semantics.
- Provenance observability is data-quality evidence, not alpha. Missing/malformed prevalence remains UNKNOWN until measured prospectively.

## NEW B-44 — production-shaped exact-path synthetic fixture added
### Continuity / concurrency check
- Re-read latest governance, worklist and B-43 checkpoint before work.
- Main SHA at implementation start and immediately before checkpoint write: `797848725755980b07d908bb625656960c43bac5`; no newer A/B checkpoint appeared during this cycle.
- Branch comparison before change showed `research/b13-shadow-provenance` diverged from main: ahead 3 / behind 8; only the three provenance helper/test files were branch-only at that point. No force-update/rebase was attempted because that could overwrite branch history.

### Engineering change
- Class A, isolated research-only test artifact. No runtime, storage, workflow, production endpoint, Formal Core, monitoring, push or trading behavior changed.
- Added `research/shadow_provenance_exact_path_v8_8_2.test.mjs` on isolated branch.
- Branch commit: `4f2c3fcabd8e689a880844b276e87b000a6ae7c0`.
- Fixture is explicitly labelled synthetic and production-shaped; it does **not** claim to be reconstructed historical production evidence.
- It freezes the current parser/outcome/legacy coverage behavior for seven deterministic states: valid mature D1; valid observed history insufficient for later horizon; missing history row; malformed history JSON; empty history array; malformed snapshot JSON; missing baseline close.
- It asserts provenance diagnostics remain additive, `calendarMaturity=UNKNOWN`, and legacy outcome + `coverage.dN` remain deep-equivalent before/after diagnostics.

### Test status / interruption boundary
- New exact-path fixture status is **TEST_WRITTEN_NOT_EXECUTED** in this cycle. Do not call it PASS.
- Reason: available GitHub connector can write/read branch sources but exposes no already-authorized safe branch runner in this cycle; modifying shared Actions workflow merely to run it would be Class B and is not justified.
- Previously existing helper targeted + observational tests retain `LOCAL_EXACT_SOURCE_PASS`; CI remains NOT_RUN.
- No merge, deployment or Production readback was attempted because integration gate has not been satisfied.

### Falsification / bias / redundancy / UNKNOWN checks
- The fixture cannot establish that missing/malformed history is frequent; prevalence remains UNKNOWN.
- It cannot establish calendar maturity; `OBSERVED_HISTORY_INSUFFICIENT` stays distinct from `CALENDAR_MATURITY=UNKNOWN`.
- It adds no factor, cohort, threshold, rank, market source, historical Shadow backfill or trading rule, so no new selection-bias/look-ahead/data-snooping/Factor-Zoo mechanism is introduced.
- It is intentionally redundant with the smaller observational invariant test only at the invariant level; added value is exercising the parser/call-path state matrix requested by B-43.
- R01-R08/I01-I07 definitions, evidence maturity and Formal Core remain unchanged.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals, then add same-date `HUMAN_MOMENTUM_SHADOW` observations only on formal SELECTED names.
3. Otherwise continue provenance lane. Fetch branch commit `4f2c3fcabd8e689a880844b276e87b000a6ae7c0` exact helper + all three tests and execute the new exact-path fixture using an already-authorized safe local/CI runner if one is available **without changing shared workflow**. Record exact command/source SHA/output. If no runner exists, keep TEST_WRITTEN_NOT_EXECUTED; do not fake PASS.
4. Before integration, reconcile branch divergence safely with current main (no force overwrite); re-read exact counterfactual path after reconciliation because main is eight commits ahead of the old branch merge-base.
5. Only after exact-path fixture passes may additive provenance integration be implemented on the isolated branch. Diagnostics must remain parallel and research-only; no legacy outcome/coverage rewrite.
6. After integration run targeted + observational invariant + exact-path fixture + existing counterfactual regression tests from exact reconciled branch sources. CI remains NOT_RUN unless an already-authorized safe runner is available.
7. If integration requires shared schema/runtime/storage/workflow changes, reclassify Class B before change and do not promote Production.
8. Do NOT revisit 09/18 execution or infer 09/22 Shadow without new trusted evidence. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
