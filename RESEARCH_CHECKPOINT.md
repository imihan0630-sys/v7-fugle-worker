# Research Checkpoint

Checkpoint sequence: B-39.
Updated: 2026-09-23 05:18 Asia/Taipei.

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

## NEW B-38 — bounded human-momentum discretion hypothesis (research-only)
### Owner hypothesis
A purely defensive rule stack may systematically under-model a useful human behavior: when a stock is rising with genuine market acceptance, an experienced trader may deliberately buy strength before every conservative confirmation has completed. The target is **追漲而非追高**: pay for evidence of continuation, not for emotional FOMO.

### Positive thesis to test
- Strong price acceptance, relative-strength persistence, sector/breadth confirmation, expanding participation, and orderly higher-low structure may contain information that is lost when the engine waits for every pullback/retest/15m clause.
- A bounded momentum entry could improve execution alpha, reduce idle cash caused by confirmation latency, and capture moves that never provide the ideal pullback.
- The useful behavior may apply both to execution of formal SELECTED names and, separately, as a research-only rescue tag for high-quality near-miss names. These must be evaluated independently to avoid mixing selection alpha with execution alpha.

### Falsification / human-bias thesis
- The same behavior can be FOMO, late-cycle chasing, exhaustion, gap-chasing, or fake-breakout buying.
- Human discretion can also create inconsistency, hindsight rationalization, and regime-dependent overconfidence; therefore no narrative override is allowed.
- Any candidate optimization must be compared against false-breakout rate, stop-first chronology, MAE, spread/slippage/turnover cost, gap/exhaustion risk, and whipsaw across independent dates/regimes.

### Shadow design candidate — no Formal Core change
Evaluate an additive research tag such as `HUMAN_MOMENTUM_SHADOW`, never a production A/B grade and never an automatic override. For each eligible observation, record:
- whether the stock is already formal SELECTED or only near-miss;
- price location versus breakout/buyHigh/maxChase and normalized distance using ATR/volatility, not only fixed percent;
- intraday acceptance: closes holding above breakout/VWAP/reference level, higher lows, failure-recovery behavior, and whether pullbacks are shallow/orderly;
- participation: volume/turnover expansion without one-bar blowoff concentration;
- relative strength versus sector/market and whether the sector is confirming;
- trend age / prior run-up / gap size / upper-wick or parabolic-exhaustion flags;
- hypothetical early-strength entry price, current formal BUY time/price if any, stop, MFE/MAE, stop-first vs target-first chronology, D1/D3/D5, and transaction-cost-adjusted result.

### Required comparisons
1. Current formal execution vs `HUMAN_MOMENTUM_SHADOW` on the **same formally selected names**. This isolates execution alpha.
2. Current SELECTED vs near-miss + human-momentum rescue tag. This is a separate selection-alpha experiment; do not pool it with #1.
3. Split by market regime and sector confirmation.
4. Specifically measure cases where Shadow enters earlier and wins, enters earlier and stops, formal waits and later buys higher, formal never buys but thesis succeeds, and Shadow buys a blowoff/fake breakout.
5. No threshold optimization from a single date. Independent scan/signal date remains the primary evidence unit.

### Governance
- Formal Core remains LOCKED. No change to A/B, BUY, maxChase, stop, capital, or deployment.
- This is a hypothesis registration, not evidence that human-like aggression is superior.
- Any future production proposal requires positive + negative evidence, costs, cross-date/regime robustness, and explicit owner approval.

## NEW B-39 — zero-selection notification delivery incident
### Owner requirement
- A completed after-market scan must notify the owner even when `selectedCount=0`. Zero selection is a valid decision result, not a reason to suppress the daily notification.

### Verified evidence
- Current code path builds a `DAILY_SELECTION:<scanDate>` payload even for zero names, with title `V7盤後：今日 0 檔，維持現金`, and calls the daily-report push path regardless of `stocks.length`.
- 2026-09-22 scheduled health run `35751075627` completed successfully. Its after-market verifier requires the daily report to have `sent=true`, `simulated=false`, a durable `DAILY_SELECTION:<date>` signal id, and an outbox row with `delivery_state=ACCEPTED`.
- The same verifier explicitly returns `handsetReceiptVerified:false`; webhook acceptance therefore does **not** prove the owner's handset received the message.
- Owner reports no after-market notification was received. Treat this as a delivery-semantics/reliability gap, not as proof the zero-selection branch was skipped.

### Proposed production behavior (Class C — NOT deployed)
1. Every successful after-market scan, including 0 selections, must create exactly one daily result notification.
2. Do not equate upstream HTTP/webhook `ACCEPTED` with owner-visible delivery.
3. Daily-selection completion should expose separate states such as `WEBHOOK_ACCEPTED`, `HANDSET_RECEIPT_CONFIRMED`, and `DELIVERY_UNCONFIRMED` where technically supported.
4. If handset receipt is supported but absent after a bounded interval, raise an explicit delivery warning and/or perform a bounded idempotent retry; never duplicate trading signals uncontrollably.
5. Preserve the distinction between `0 selections successfully completed` and `scan/push failed`.
6. No selection, ranking, BUY, capital, stop, or other Formal Core rule changes are part of this proposal.

### Governance
- Push/notification behavior is Class C under `RESEARCH_ENGINEERING_GOVERNANCE.md`.
- This checkpoint records the owner requirement and incident evidence only. No production push behavior was changed or deployed in this step.

## Historical execution evidence retained
- 09/17 formal plans: 6706 惠特, 3006 晶豪科, 6505 台塑化. 09:27 and 13:19 monitoredCount=3, formal15Ready=3, waitingForFreshData=0, notificationCount=0. Exact historical zones unavailable; symbol-level blocking clause UNKNOWN.
- 09/18 contemporaneous plans: 4763, 1301, 3491, 3665, 3017. 3017 daily low 3290 > buyHigh 3285 => NO_ZONE_TOUCH. Others retain 15m/chronology UNKNOWN where contemporaneous bars are unavailable.
- V8.8.x execution recorder was deployed only after 09/18; it cannot reconstruct 09/18 prospectively. Do not revisit that lane.
- 09/22 scheduled health run `35751075627` positively verified formal selectedCount=0, planCount=0, signalCount=0. Preserve 09/22 as a formal zero-pick date, not an Execution Alpha failure.
- `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`; no trusted per-date Shadow count exists. Do not infer it from aggregate totals.

## B-36 retained — provenance semantics refinement
- Existing `readShadowCounterfactualResearch()` silently maps malformed `snapshot_json` to `{}`, malformed history JSON to `[]`, and a missing history row also reaches outcome enrichment as `[]`; existing `coverage.dN` cannot distinguish these from ordinary incomplete horizons.
- Falsified the too-simple rule `fewer than h cached post-scan bars => not yet mature`. Cache insufficiency and calendar maturity are different dimensions.
- Frozen conservative semantics: snapshot parse state; baseline close state; history row/parse/empty/OK state; `historyLastDate`; `postScanValidBars`; horizon `OUTCOME_AVAILABLE` vs provenance failure/`OBSERVED_HISTORY_INSUFFICIENT`; calendar maturity remains UNKNOWN unless a trustworthy trading-calendar source is explicitly available at the research boundary.
- No evidence yet proves malformed/stale prospective rows actually occur; occurrence rate remains UNKNOWN.

## NEW B-37 — isolated provenance implementation scaffold
### Research question
Can the refined B-36 provenance semantics be implemented in an isolated, testable Class A artifact without touching the existing counterfactual outcome calculations or Formal Core?

### Evidence / implementation
- Re-read governance/worklist/checkpoint and latest main first. Latest main before this cycle was B-36 commit `e4037c81200fe90f9e9d4edfb6f4c7a57a7bfc42`; checkpoint blob SHA was `ab6b5464d3e53c77c7d838d2fa3c9d7543112be4`.
- Re-read the current branch blob for `research/counterfactual_v8_7_4.js`. Existing outcome and `coverage.dN` logic was not modified.
- On isolated branch `research/b13-shadow-provenance`, added `research/shadow_provenance_v8_8_2.js` at commit `9ba76f885b1915d7073e3c42a556a837d8927b6e`.
- The helper implements only research provenance: `SNAPSHOT_PARSE_OK/ERROR`, `BASELINE_CLOSE_OK/MISSING`, `HISTORY_ROW_MISSING/PARSE_ERROR/EMPTY/OK`, `historyLastDate`, `postScanValidBars`, conservative horizon provenance, and `calendarMaturity: UNKNOWN`.
- Added targeted test artifact `research/shadow_provenance_v8_8_2.test.mjs` at branch commit `78228598587800b8c24112d706078208fcdce7b4` covering malformed snapshot + valid history, valid snapshot + malformed history, missing history row, empty history, insufficient post-scan bars, mature D1, and explicit UNKNOWN-preserving semantics.
- Important: tests are **written but not yet executed** in this cycle because the connected GitHub interface does not expose arbitrary branch command execution. Do not claim PASS from test source alone.
- The helper is not imported by production/runtime code, so this cycle cannot alter formal selection, ranking, monitoring, notification, capital, signals, existing outcomes, or existing `coverage.dN`.

### Falsification / bias / safety
- The implementation deliberately does not synthesize bars, infer missing data from current prices, backfill historical Shadow, or reinterpret missing as BAD/0.
- A parsed history with too few post-scan valid closes becomes `OBSERVED_HISTORY_INSUFFICIENT` for horizons beyond observed coverage; it is never labeled calendar-immature.
- If an existing finite outcome is supplied to the helper, provenance reports `OUTCOME_AVAILABLE`; the helper does not recompute or overwrite that outcome.
- Selection bias risk from silently missing histories becomes observable once integrated; this cycle does not assert that such missing histories actually exist.
- No factor, threshold, window, cohort definition, transaction-cost assumption, or R01-R08/I01-I07 definition changed. Factor Zoo/redundancy counts unchanged.

### Engineering classification / deployment
- Class A isolated research-only scaffold.
- Branch only: `research/b13-shadow-provenance` at `78228598587800b8c24112d706078208fcdce7b4`.
- Production deployment: none. Formal Core/runtime unchanged.
- Main receives checkpoint only; no research helper code was merged to main.
- Integration into `readShadowCounterfactualResearch()` remains pending until tests/regression/invariants can be executed and old `coverage.dN` equivalence is proven.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint and latest main SHA; re-check checkpoint SHA immediately before any write.
2. If a newer trusted formal scan with >=1 plan exists, primary funnel regains priority: establish plan date/count from Production readback, then verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals. On that same date, add research-only `HUMAN_MOMENTUM_SHADOW` observations so early-strength execution can be compared with formal BUY without changing production behavior.
3. Keep selection-alpha and execution-alpha human-discretion experiments separate: first test the same SELECTED names; only then evaluate any near-miss rescue cohort.
4. Otherwise continue on `research/b13-shadow-provenance`: execute the new targeted test artifact through an authorized repository CI/test path if available; do not treat source assertions as executed evidence.
5. Add an explicit regression test that snapshots old `researchShadowOutcomeForRow()` and old `coverage.dN` behavior against representative frozen inputs, then prove the provenance helper leaves those outputs unchanged.
6. Only after targeted tests + regression/invariant evidence pass, integrate provenance into `readShadowCounterfactualResearch()` as additive diagnostics. No outcome or `coverage.dN` redefinition. If integration touches shared runtime in a way that cannot guarantee isolation, reclassify Class B and stop before merge/deploy.
7. Do not label insufficient cached bars `NOT_YET_MATURE`; keep `OBSERVED_HISTORY_INSUFFICIENT` plus `CALENDAR_MATURITY=UNKNOWN` unless trustworthy calendar maturity evidence exists.
8. Do NOT revisit 09/18 execution or 09/22 Shadow inference without new trusted evidence. Keep 09/22 `NO_FORMAL_SELECTION=VERIFIED`, `SHADOW_SCAN_STATUS=UNKNOWN`.
9. Signal != fill. `REDUCED_CONFIRMED` requires trusted actual reduced shares.
