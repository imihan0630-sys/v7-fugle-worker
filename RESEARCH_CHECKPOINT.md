# Research Checkpoint

Checkpoint sequence: B-237.
Updated: 2026-09-27 23:38 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-123 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-116
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified.
- 2026-09-22 and 2026-09-23 remain two adjacent observed completed Formal zero-pick dates; descriptive only. 2026-09-24 is now a completed recovered Formal outcome with 2 FORMAL_GENERAL selections, not a zero-pick date.
- V8.9.6 Production activation is durably proven: V8.9.5 at 2026-09-24T00:13:05Z and V8.9.6 at 00:13:21Z; the 16-second transition window remains UNKNOWN for observations without self-versioning.
- B-99 live research readback: Shadow total=62 across 2 archived dates; external evidence total=62, TWSE=53, TPEX=0, UNKNOWN=9; TPEx revenue available=0; shadow integrity RESEARCH_DATA_GAP; all R01-R08 readiness DATA_QUALITY_BLOCKED.
- B-100..B-104: `TPEX_ZERO_ROOT_CAUSE=UNKNOWN`; H1=no OTC candidates, H2=OTC unmatched -> UNKNOWN, H3=specific TPEx monthly-revenue research provider/path unavailable remain unresolved. Existing durable plaintext provenance search is exhausted; future row-level observability is Class B proposal-only.
- B-105..B-112: no later completed Formal scan or new durable prospective Top5 day row had become available; zero-pick denominator remained exactly 2 dates and R03/R06 remained WAITING_DATA.
- B-113/B-114: 9/24 official sync and retry failed before same-day recovery; 9/24 not counted as zero-pick. Retry run `35987921399` proved upstream market/institution/INDEX/TDCC/VALUATION/ANNOUNCEMENTS succeeded and failure occurred in financial quality stage.
- B-115 source-order inspection localized run `35987921399` to the multi-period MOPS financial fetch loop before FINANCIAL ingestion; later EPS-review/recovery stages were never reached.
- B-116 localized the outstanding timeout to the paired 2025Q2 MOPS batch after both 2026Q2 TWSE/TPEx pages parsed successfully. Exact market culprit remains UNKNOWN. The first ~45s abort despite retry intent remains a retry/exception-observability discrepancy, not proof that retries were skipped.

## B-117..B-123 — waiting-data recency checks
- Repeated repository/Actions checks through 23:11 Taipei found no official-market-data run later than `35987921399` and no trusted completed recovery/Formal scan for 2026-09-24.
- No new durable prospective Top5 day row was established.
- Therefore 2026-09-24 remained prerequisite-failed/UNKNOWN, not a zero-pick; completed Formal zero-pick denominator remained exactly 2 independent dates (9/22, 9/23).
- R03/R06 remained WAITING_DATA. Repeated scheduler observations are not independent market samples and do not increase sample size.
- `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` unchanged.
- No infrastructure failure was coerced into a negative trading signal or zero-pick observation; no duplicate-date inflation, look-ahead, historical Shadow fabrication, post-hoc factor/window/threshold/split, selection-bias or data-snooping promotion.
- Factor Zoo, overfit, coverage, transaction-cost, date-cluster and redundancy controls unchanged. R01-R08 had no new mature outcome evidence; I01-I07 had no new intervention evidence.
- Read-only repository/Actions inspection + checkpoint only; no Worker/workflow/D1/KV/source-routing/Formal/Hybrid WATCH/monitoring/notification change and no deployment.

## B-124 — 23:37 official sync changed the failure locus
- New scheduled official-market-data run `36021494403` started 2026-09-24 23:37 Taipei and failed in quality synchronization; same-day recovery was skipped.
- This run falsifies the prior assumption that the active failure still occurs in the 2025Q2 paired MOPS batch. All financial-period pages completed: 2026Q2 TWSE=1049, TPEx=884; 2025Q2 TPEx=884, TWSE=1045; 2026Q1 TPEx=882, TWSE=1046; 2025Q1 TPEx=863, TWSE=1022. FINANCIAL ingestion then succeeded with count=1882.
- The new terminal error occurred ~18.25s after FINANCIAL cache success: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`.
- Source-order inspection shows the immediate next operation after FINANCIAL ingestion is POST `/api/scan-preview` with `{dryRun:true, epsReviewOnly:true, marketDate}`, followed immediately by `await reviewResponse.json()`. No EPS-review success log appeared before the JSON parse exception.
- Therefore `OFFICIAL_QUALITY_FAILURE_ROOT_CAUSE` is revised from the older timeout locus to `POST_FINANCIAL_EPS_REVIEW_RESPONSE_NON_JSON_HTML_OR_EQUIVALENT_BEFORE_REVIEW_PARSE`; exact HTTP status/body/source of the HTML remains UNKNOWN because the script parses JSON before logging status/content-type/body context.
- This is strong evidence that the MOPS multi-period financial fetch path itself recovered on this run; it is not evidence that the overall quality sync or Formal scan completed.
- 9/24 remains prerequisite-failed/UNKNOWN and is still **not** a third zero-pick date. Completed Formal zero-pick denominator remains exactly 2 independent dates (9/22, 9/23).
- Bias controls unchanged: infrastructure/HTML response is not BAD/0 and not a negative market signal; no look-ahead, duplicate-date inflation, historical Shadow fabrication, selection-bias, market-source-bias, Factor Zoo or threshold tuning introduced.
- R01-R08: no new mature outcome evidence. R03/R06 remain WAITING_DATA. I01-I07: no new intervention evidence.
- Engineering classification: any change to shared scan-preview/runtime response handling or retry behavior is Class B proposal-first. No Worker/workflow/runtime/Formal/Hybrid WATCH/monitoring/notification change and no deployment in B-124.

## B-125 — midnight continuation / latest-main merge
- Latest main `9b6b9982d3571171e948be36fb445ffe14f803fc` adds DL-001 Information Discreteness / Gradual Price Path research only. It does not supersede this canonical cursor. DL-001 remains Shadow-only and has explicit redundancy/regime risks; no Formal change.
- No trusted official-market-data run later than `36021494403` established. That run still failed quality sync and skipped recovery, so 2026-09-24 remains prerequisite-failed/UNKNOWN, not a third zero-pick date. Denominator remains 2 (9/22, 9/23); R03/R06 WAITING_DATA.
- B-124 localization remains current: FINANCIAL ingestion recovered, then EPS-review `/api/scan-preview` returned HTML-like content that failed JSON parsing. HTTP status/content-type/source remain UNKNOWN.
- Class-B proposal only: bounded EPS-review response observability (status, content-type, endpoint/mode, attempt, body prefix) plus explicit retry outcome logging. No implementation/merge/deploy without approval.
- No BAD/0 coercion, historical Shadow fabrication, duplicate-date inflation, look-ahead, post-hoc tuning, selection-bias promotion, or Factor-Zoo promotion. No runtime/Formal/Hybrid WATCH/monitoring/notification change.

## B-126 — checkpoint write-path recovery + repeated EPS-review contract failure
- Main readback before write: checkpoint blob SHA `edf66ab04a3cef54f926652e4673bbbfc24d8eff`; latest main commit observed `672bee18f5de743fa52117727aa4d561a1795e68` (DL-001 owner-approval record). No newer A/B checkpoint had superseded B-125 at write time.
- Official market-data run `36023630085` independently repeated the B-124 pattern: all 2026Q2/2025Q2/2026Q1/2025Q1 TWSE+TPEx financial pages parsed, FINANCIAL count=1882 was written, then ~10.46s later the run failed with `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`.
- Repetition strengthens localization to the FINANCIAL -> EPS-review `/api/scan-preview` response-contract boundary and further falsifies the older 2025Q2 MOPS-timeout locus as the current active blocker. It still does **not** identify HTTP status, Content-Type, or HTML provenance; those remain UNKNOWN.
- Scheduled health run `36024190696` reported no completed analysis for 2026-09-24; latest completed Formal analysis remained 2026-09-23. Therefore 2026-09-24 remains prerequisite-failed/UNKNOWN, not a third zero-pick date. Trusted completed zero-pick denominator remains exactly 2 independent dates (9/22, 9/23); R03/R06 remain WAITING_DATA.
- Bias/data-quality controls: repeated failed workflows/health checks are not independent market observations; infrastructure HTML is not BAD/0 or a negative trading signal; no historical Shadow fabrication, duplicate-date inflation, look-ahead, post-hoc threshold/window tuning, selection-bias promotion, market-source-bias promotion, or Factor-Zoo promotion.
- R01-R08: no new mature outcome evidence; R03/R06 WAITING_DATA. I01-I07: no new intervention evidence.
- Engineering classification: EPS-review response-contract observability remains **Class B proposal-only** because `/api/scan-preview` is shared runtime. Proposed minimal fields remain endpoint/mode/attempt, HTTP status, Content-Type, bounded non-JSON body prefix, and explicit retry outcome. No implementation/merge/deploy was performed.
- Checkpoint reliability repair: prior attempts were blocked before the GitHub mutation reached the repository. This round used a single optimistic-concurrency `update_file` mutation after a fresh `fetch_file` SHA check, avoiding multi-write orchestration. This is a checkpoint-process repair only; no Worker/runtime/Formal/Hybrid WATCH/monitoring/notification behavior changed.

## B-127 — 9/24 staged recovery production verification
- GitHub history after B-126 shows the owner-approved recovery was completed rather than left staged. Production runtime is documented as `8.9.9-staged-delivery`.
- GitHub Actions evidence: Cloudflare deploy run `36073143251` succeeded; one-time recovery run `36073250379` succeeded; exact Formal-plan commit run `36073396365` succeeded; staged recovery run `36073605150` succeeded; external-plan recovery run `36073872525` succeeded. Latest-main regression run `36076588521` also succeeded.
- Live production readback from `/api/recommendations` confirms `scanDate=2026-09-24`, `resultType=CURRENT`, `selectionPersisted=true`, and `pipeline.complete=true`.
- Formal result is now trusted as completed recovery: FORMAL_GENERAL = 2 (2006 東和鋼鐵, 4977 眾達-KY); FORMAL_THOUSAND = 0; HYBRID_THOUSAND_SHADOW = 0. Therefore 2026-09-24 must not be counted as a zero-pick date.
- Live daily-push state is `dailyDeliveryState=ACCEPTED` and `dailyWebhookAccepted=true`. This proves server-side acceptance only. `phoneReceiptVerified=false` remains the correct unresolved state until human/device receipt is independently confirmed.
- External-plan state is verified without duplicate POST: historical recovery documentation records exact existing record match, `externalPostPerformed=false`, `threeMinVerified=true`.
- HYBRID WATCH remains 1 stock: 6683 雍智科技. It remains observation-only, does not occupy HYBRID_THOUSAND_SHADOW quota, and does not consume the pool's NT$200,000 capital.
- Failure-recovery design conclusion: do not depend on one long HTTP request for historical full-market recovery. The validated pattern is staged selection persistence -> delivery/readback, protected by idempotency/duplicate-send controls. Cloudflare Error 1102 is treated as an infrastructure/runtime resource failure, never as a 0-pick trading outcome.
- No Formal Core, ranking, thresholds, capital, entry/add/reduce/sell/stop, Hybrid eligibility, monitoring semantics, or signal logic changed in B-127. This checkpoint update only reconciles durable research state with already-completed production evidence.

## B-128 — 9/24 execution coverage boundary
- Continued from B-127. V8.8.0 recorder is prospective and monitor-event driven; deployed V8.9.9 build/run 36073143251 passed V8.8.0/V8.8.1 recorder coverage tests.
- The protected recorder query is rolling-window only, newest-first, SQL LIMIT 500, with only the newest 80 exposed as recent; it has no exact-date/cursor/coverage-boundary parameter. A missing target row therefore cannot prove NO-BUY without independent non-truncation evidence.
- The same deploy's authorized research readback showed execution selectedPlans=4 and buyTriggeredPlans=1, but only as aggregate values with no date/symbol attribution. They cannot be assigned to 2026-09-24.
- B-127 recovered 2006 and 4977 after market through staged selection persistence/delivery. Current evidence does not establish target-date intraday recorder coverage for those recovered names. Their 9/24 BUY/NO-BUY and Execution Alpha remain UNKNOWN; no absence-as-zero or historical reconstruction is allowed.
- Plain main Worker.js is a source template, not authoritative Production runtime by itself; deploy-time guarded patches build the effective runtime. Production/deploy readback remains authoritative.
- Bias controls: no look-ahead, no later-price BUY inference, no fabricated historical Shadow, no 500-row truncation treated as complete coverage, signal observation remains distinct from fill. R01-R08 have no new mature outcome evidence; I01-I07 unchanged.
- Engineering: evidence-only Class A. Adding exact-date/cursor/coverage metadata to the deployed protected endpoint remains Class B proposal-first. No runtime/Formal/Hybrid/monitor/push change and no deployment.

## B-129 — execution recorder observability deep-dive
- Continued from B-128 without interpreting 2006/4977 as trading recommendations. Source reconstruction from `scripts/apply_v8_8_0.py` confirms the recorder is monitor-event driven and prospective: rows are inserted only for OPEN_BASELINE, FIRST_10M_COMPLETE, FIRST_15M_COMPLETE, FIRST_30M_COMPLETE, or FORMAL_SIGNAL_OBSERVED events generated while monitor results exist.
- The protected read path is structurally non-exhaustive for a target date: it selects newest-first with `LIMIT 500`, then exposes only `recent: rows.slice(0,80)`. It accepts only a rolling `days` window; there is no trade_date filter, cursor, total row count beyond the truncated result, earliestReturnedAt, or truncation flag.
- Therefore a missing symbol/date in current readback has at least three observationally equivalent causes: (a) no recorder event existed, (b) target rows existed but are outside newest 500, or (c) target rows are inside 500 but outside exposed newest 80. Absence cannot identify NO-BUY.
- Recorder persistence uses `INSERT OR IGNORE` with primary key (trade_date,symbol,event_type,event_key). This is useful idempotency, but it also means the research layer needs explicit coverage metadata to distinguish a complete monitored session from a partially observed/recovered session.
- V8.8.1 improves feature coverage (opening gap, avg-price proxy, spread/depth, quote mechanism flags) but does not repair target-date query completeness. Its test explicitly protects UNKNOWN market-state semantics and downstream-only research passthrough; this supports keeping missing execution evidence UNKNOWN.
- New minimal Class-B proposal: add a read-only target-date/cursor coverage contract returning requestedTradeDate, totalMatchingRows, returnedRows, earliest/latest observedAt, hasMore/truncated, nextCursor, and per-event/per-symbol counts. Do not alter recorder writes, formal decisions, monitoring eligibility, signal state, push, capital, or execution rules. Proposal only; no production implementation without owner approval.
- Bias/falsification: this finding weakens any apparent low BUY-trigger rate derived from current recorder absence; it does not prove BUY occurred. No later-price reconstruction, no absence-as-zero, no historical Shadow fabrication, no threshold tuning. R01-R08: no mature outcome increment; Execution Alpha remains data-quality blocked for affected recovered dates. I01-I07 unchanged.
- Engineering classification: source/readback analysis is evidence-only Class A; the proposed shared runtime endpoint extension is Class B. No code/runtime/deploy change in B-129.



## B-130 — 2026-09-24 stale daily-history cache confirmed in Formal selection
- K-line DL-003D outcome-free sanity work discovered a production data-integrity defect in the recovered 2026-09-24 Formal scan.
- Live production research snapshot for 2006 recorded breakoutReferencePriceResearch=84, ret5=8.6633663366, ret10=8.6633663366, ret20=9.75, volumeTodayVsPrev5=1.7670162029, volumeContraction5to20=0.6384707904, atrPercent=2.3690205011.
- Complete Fugle raw and adjusted daily candles through 2026-09-24 show 2006 high=89 on 2026-09-18. Thus the true priorHigh20 on 9/24 is 89, not 84. Corporate-action adjustment does not explain the difference.
- Exact reconstruction evidence: remove 2026-09-14/15/16/17/18/21/22/23 from complete history, retain cache through 9/11, then append 9/24. Recomputed ret5/ret10/ret20/priorHigh20/volumeTodayVsPrev5/volumeContraction5to20/ATR match the production snapshot exactly for BOTH 2006 and 4977 (numeric difference zero within floating-point representation).
- Root cause localized in source: runHistorySeed rebuilds each new market-date queue but classifies a cached symbol as complete when history.length>=60 only. It does not require latest history date == marketDate or recent-session continuity. The 18:10 scan intentionally performs no emergency warmup and can therefore append current market rows to stale cached history.
- Formal impact using unchanged existing A/B formulas on complete Fugle daily bars:
  - 2006 stale history: B.pass=true. Complete history: B.breakout=false and B.volume=false, B.pass=false; A.pass=false. Therefore 2006 would NOT pass the current Formal A/B technical setup gate on complete history.
  - 4977 stale history: A.pass=true, ret20=+6.6456%. Complete history: A.pass remains true, but ret20=-1.7493% and support/ATR/volume fields materially change. Full ranking/RR/final-selection status requires a complete rerun before treating the original selection as valid.
- Research consequence: 2026-09-24 must carry DATA_QUALITY_STALE_HISTORY for rolling-history-dependent factors until repaired/revalidated. 2006 must not be used as a clean B-breakout research example. Do not infer market weakness or BAD/0 from this infrastructure defect.
- This discovery does not change the fact that the staged recovery/delivery pipeline completed mechanically; it revises confidence in the INPUT HISTORY QUALITY used by that recovered selection.
- Engineering classification: shared history freshness/continuity is Class B. Branch/PR/tests may be prepared autonomously, but no merge/deploy until owner approval because future Formal eligibility can change.
- Minimal safe direction: cached history completeness must include freshness/date integrity, not bar count alone; stale recent history should become DATA_INCOMPLETE/UNKNOWN rather than a rolling feature sequence.
- No Formal A/B threshold, factor weight, capital, execution, monitoring, or push rule has been changed in B-130.

## B-131 — stale-history freshness invariant / Class B proposal staged
- Continued from B-130 and re-read governance/worklist/checkpoint plus current main source. Source confirms the defect is structural: `runHistorySeed()` currently classifies a target symbol as complete when cached history is an array with `history.length >= 60`; no latest-session or internal-continuity proof is required. The 18:10 scan explicitly performs no emergency warmup and passes cached history through `updateMarketState()`, which filters dates < scanDate then appends scanDate.
- Positive evidence: official trading-calendar machinery already exists (`loadTradingCalendar`, `isTradingDate`, `mostRecentWeekday`), so the safe design can validate expected trading sessions rather than inventing calendar-day heuristics.
- Negative/falsification boundary: preserved all-market D1 cache snapshot for 2026-09-24 is unavailable, so prevalence/blast-radius count remains UNKNOWN. B-130's 2006/4977 witnesses prove existence, not market-wide frequency.
- Minimal invariant specified: for target marketDate, latest cached bar must equal the immediately prior official trading session; recent required session dates must be unique, ordered and gap-free on the official calendar; no bar may be >= target date; unknown calendar/proof => DATA_INCOMPLETE/UNKNOWN. Historical recovery must validate relative to target marketDate, not rerun wall-clock date.
- Class B engineering artifact prepared autonomously, not promoted: branch `research/class-b-history-freshness-20260925`, commit `2aa9c411811895a62e13d0b913ed4cb78a788486`, draft PR #100. It contains proposal/test plan only and no Worker/runtime modification. Tests specified include stale-one-session, internal-gap, weekend/holiday, duplicate/out-of-order/future date, historical target-date, exact B-130 reproduction, fresh-series invariant, Formal formula regression, and UNKNOWN-on-calendar-failure.
- Formal Core/A-B formulas/ranking/thresholds/3+3+3/capital/entry/add/reduce/sell/stop/monitor/push remain unchanged. No deployment.
- R01-R08/I01-I07: no new mature outcome evidence. R03/R06 denominator remains two independent zero-pick dates (9/22, 9/23); 9/24 remains mechanically completed but rolling-history research quality is DATA_QUALITY_STALE_HISTORY pending revalidation.
- Exact next engineering decision: owner approval is required before implementing/promoting the Class B freshness guard because it can change future Formal eligibility. Until then continue research/Shadow work and do not merge PR #100.

## B-132 - recorder coverage gate
- MS-025/MS-026 completed in MICROSTRUCTURE_CHECKPOINT.md. Current recorder read contract cannot prove exhaustive target-date coverage because it is rolling-window, capped, and exposes only a recent subset without cursor/truncation/completeness metadata.
- Missing recorder rows remain UNKNOWN. Zero-code inferential baseline is DATA_QUALITY_BLOCKED because convenience-sample outcome testing would create coverage/selection bias.
- MS-027 waits for complete-enough evidence. MS-028 may prepare isolated research capture/readout design only; any shared runtime endpoint change remains proposal-first.
- 9/24 stale-history research-quality flag and prior Formal/zero-pick boundaries are unchanged. No production behavior change.

## B-133 - owner-approved Class B history freshness implementation and local verification
- Canonical read-before-write was repeated after other research lanes advanced: latest observed main commit=`8a63178d8bfe6279e78e94ece482c31c4cc2ca92`; pre-write checkpoint blob=`c4aeb8835bdf84feda0227117a951e8fe440d7ec`. The intervening commits update independent research/checkpoint files only; `RESEARCH_ENGINEERING_GOVERNANCE.md` and `RESEARCH_WORKLIST.md` are unchanged. Draft PR #100 work was rebased cleanly onto this main before final local verification.
- Owner authorization in this round is limited to **Class B implementation plus complete testing**. Merge and Production deployment remain explicitly unauthorized. Implementation commit on branch `research/class-b-history-freshness-20260925` is `980a5ae` (`fix: guard formal history freshness`); runtime build version is `8.10.1-history-freshness-guard`; history seed schema is bumped to `full-market-v3-history-freshness` so previously resolved stale seed state cannot bypass reclassification.
- Freshness/continuity invariant: validation is relative to the requested `marketDate`, uses the official trading calendar, requires 60 unique strictly increasing prior official sessions, requires the latest prior bar to equal the immediately preceding official session, rejects internal gaps/out-of-order/duplicates/future rows, and maps unavailable/insufficient calendar proof to UNKNOWN. Stale/gapped history is DATA_INCOMPLETE and is excluded before `buildMarketFeatures()` / existing Formal setup evaluation.
- Existing warmup/fallback may contain one target-date cache row. The implementation deterministically ignores that row as prior history and replaces it with the official current scan row; it never lets the target-date cache row enter rolling prior-session features. This is a bounded compatibility refinement to the B-131 proposal, not a formula change.
- B-130 reproduction is preserved as a targeted regression: cache through 2026-09-11 plus 2026-09-24 is rejected with `STALE_LATEST_SESSION`, with expected prior official session 2026-09-23. Weekend plus the official 2026-09-25/28 holidays are accepted for target 2026-09-29. Internal gap, duplicate, out-of-order and future cases reject; unavailable 2027 calendar remains UNKNOWN; historical target-date validation does not use rerun wall-clock time.
- Local production-chain evidence: baseline V8.10.0 build passed with 52 guarded patches; candidate V8.10.1 build passed with 53 patches and syntax validation. Targeted result: `b130StaleHistoryRejected=true`, `calendarFailure=UNKNOWN`, `targetDateBarReplaced=true`, `freshFormalFormulaInvariant=true`, `formalCoreChanged=false`. The workflow-equivalent offline regression passed 44/44 after the clean rebase. `test_requirements_repair.mjs` uses official-session fixtures; two existing source-contract tests were made CRLF/LF agnostic for Windows-only portability, with no runtime-semantic change.
- Draft PR #100 branch was updated with lease safety to `980a5aea42011bbc1a3a2247d4257db5e14650c2`. GitHub Actions readback completed successfully for both required checks: V8 Regression Tests run `36113329844` job `108001537600` conclusion=success; V8 Cloudflare Deploy verify run `36113329828` job `108001537322` conclusion=success. The PR remains Draft; the main-only deploy job did not run from this PR update.
- Formal Core invariant comparison against separately built V8.10.0 baseline is byte-normalized SHA-256 identical for 14 locked functions: `buildMarketFeatures=167163442ad488c02820617b441db5cf37c728b756713b1dafef5a516e591161`, `strategySetupState=ab0aef011f584dc0f4a54774e743366bffe65bbb4d0a2135aa34f4c64b9132a5`, `scoreCandidate=cc421e5e82712ef736eebc478b388609fc7de377da35f9e4157b02f3fc4c3efe`, `enforceIndependentPoolQuota=157f03813445fff1a79f73f8519523deaf10cbaf9321ebd75d877f637ca539f5`, `allocateAndBuildPlans=7fcf12cad916b59899352fe9aabdede1c6ff0d86427d770f34738173ce9490ad`, `recalculatePlanCapital=a04d1e40fec61543085e08818a4122f3c292de61f6a5a8c6c6b00e381e811561`, `evaluatePullback=25bf809819559b930552e6ada627202ec492ddde7eead4a0a83e7a6b049ce113`, `evaluateMomentum=046d38aa8fa43242379a95499f46d3d45b5d737cfa8d7a3954d4a5dae4cd6ef1`, `evaluateOperationSignals=8538498c0709b35133e9dd327957af8c5d4e933dabdc92119f577a444a069052`, `processSignalState=0568c94af44ff6f7c00e18d206cc3ec85b6a03a2cebebd13ff8eee4701fac056`, `buildPushPayload=0763a1a6a686cf863dfd494e7b7ba401572d3209beb566e1e36c711f12f08e87`, `sendPush=b22e5b6e5fbb3a3b26b6d5c6344ba5cb79037787af78d50ee90324346bf84ff7`, `analyzeStockSmart=07201a7ae6a958ecd9a0ab35a45334e86fd5801ce769196bdf59ed36ebe4efa2`, `runBackgroundMonitor=c56e92b83dc07e2275e923de35322d0092a6b6a87dd1a8d0d12621ae2f37cc96`.
- Counter-evidence / UNKNOWN: no preserved all-market 2026-09-24 D1 cache snapshot exists, so stale-history blast radius remains UNKNOWN. The targeted witnesses do not prove what a complete whole-market rerun would finally rank/select for 4977 or other names. No Production readback exists for V8.10.1 because deployment was not performed; PR CI success is build/test evidence only and is not Production activation evidence.
- Engineering classification: Class B implementation on Draft PR #100 only. `selectTomorrowCandidates()` changes only by admitting features through the freshness gate; Formal A/B formulas, Top6, 3+3/3+3+3, ranking/thresholds, capital, buy/add/reduce/sell/stop, monitoring and push remain LOCKED and unchanged. No merge and no Production deployment.

## B-134 — post-Work handoff verification / owner merge decision pending
- Fresh-read after the separate Work session confirmed canonical B-133 is durable on main. Main commit `17680ed28bfd65f2d91e3d502cced0003aecef9f` records the Class B history-freshness verification checkpoint.
- Draft PR #100 remains OPEN + DRAFT and unmerged. Its head is `980a5aea42011bbc1a3a2247d4257db5e14650c2`; the PR contains the V8.10.1 freshness patch, targeted test, workflow integration and proposal artifact. No Production deployment is claimed.
- Independent connector readback agrees with B-133: PR commit history contains `fix: guard formal history freshness`; changed workflow applies `scripts/apply_v8_10_1.py`, checks `8.10.1-history-freshness-guard` / `full-market-v3-history-freshness`, and runs `tests/test_v8_10_1_history_freshness.mjs`.
- The Work evidence is therefore accepted as completed Class B implementation/testing, not as Production activation. Formal Core remains LOCKED. The next action on this engineering lane is an explicit owner decision whether to merge/promote PR #100; until that decision, no merge/deploy.
- Research may continue independently while the merge decision is pending. Highest-value unresolved evidence remains execution-recorder target-date completeness / 500-row non-truncation before interpreting 2026-09-24 BUY/NO-BUY. 9/24 stays DATA_QUALITY_STALE_HISTORY for rolling-history research until revalidated; zero-pick denominator stays 2 (9/22, 9/23).
- R01-R08/I01-I07: no mature-outcome increment in this verification turn. No new factor/window/threshold was introduced. Selection/look-ahead/absence-as-zero safeguards remain unchanged.
- Engineering: Class B PR #100 verified branch-only; no merge, no deployment, rollback remains close/revert PR branch.

## B-135 — execution-recorder completeness falsification
- Continued exactly from B-134 funnel priority. Source reconstruction of `scripts/apply_v8_8_0.py` confirms `readExecutionResearchRecorder(env,days)` clamps the rolling window to 1..120 days, queries newest-first with a hard `LIMIT 500`, and returns only `recent: rows.slice(0,80)`. The endpoint has no target trade-date filter, cursor/offset, total matching row count beyond the capped result, earliest-returned coverage boundary, hasMore/truncated flag, or expected-vs-observed event coverage.
- Therefore current readback cannot prove target-date completeness. A missing 2026-09-24 symbol/event is observationally compatible with at least: no event was recorded; the row exists but is older than the newest 500; or it is inside the 500-row query but outside the externally exposed newest 80. Absence cannot be interpreted as NO-BUY.
- Counter-evidence: a result with <500 queried rows can falsify LIMIT-500 truncation for that rolling query, but still cannot prove that every expected target-date recorder event existed, because recorder writes are event-driven/fail-open and there is no expected coverage manifest. Conversely, exactly 500 rows does not prove truncation, only that truncation is possible/indeterminate.
- V8.8.1 adds quote/depth/market-state research fields but does not alter the recorder read contract, so it does not resolve target-date completeness.
- Research consequence: 2026-09-24 execution BUY/NO-BUY remains `UNKNOWN / DATA_QUALITY_BLOCKED`; do not infer BUY from later price and do not infer NO-BUY from recorder absence. R03/R06 receive no outcome increment. Zero-pick denominator remains 2 independent dates (9/22, 9/23).
- Bias/falsification: this prevents absence-as-zero, look-ahead and denominator contamination. It does not claim that BUY occurred, that rows were actually truncated, or that 2006/4977 were recorder-covered intraday.
- Engineering classification: preserve the existing B-104/B-134 Class B observability proposal only. Minimal future contract remains target-date filtering plus count/pagination/truncation/coverage metadata; no implementation/merge/deploy in this turn. Formal Core, PR #100 and Production unchanged.
- Exact next research step: on the next prospective completed trading date, obtain authoritative target-date recorder coverage if/when an approved observability path exists; until then prioritize evidence that can falsify truncation/completeness without reconstructing historical Shadow. Separately, PR #100 remains awaiting owner merge/promotion decision.

## Exact next continuation point
1. For the approved Class B engineering lane, implementation and complete tests are finished on Draft PR #100. Stop here for a separate owner review/merge decision; do **not** merge PR #100 and do **not** deploy Production without a separate owner approval.
2. Treat 2026-09-24 as a completed Formal date with 2 selections, not prerequisite-failed/UNKNOWN and not a zero-pick date; retain `DATA_QUALITY_STALE_HISTORY` for rolling-history research until a complete revalidation exists.
3. Restore funnel priority on the recovered selected names: verify execution-recorder target-date coverage and 500-row non-truncation before interpreting BUY/NO-BUY outcomes.
4. Preserve same-date `HUMAN_MOMENTUM_SHADOW` as research-only on Formal SELECTED names; no look-ahead or post-hoc promotion.
5. Continue R03/R06 only with new independent completed dates. Zero-pick denominator remains exactly 2 dates (9/22, 9/23); 9/24 does not extend it.
6. For future historical recovery, use staged persistence -> delivery/readback with idempotency; do not reintroduce a single long HTTP transaction.
7. Keep phone receipt separate from server acceptance. Do not mark phone delivery verified until an independent device/user receipt signal exists.
8. If a new durable prospective Top5 day row exists, continue frequency work with valid set count, `未分類` rate and malformed/UNKNOWN count; no repair/re-sort/de-dup/tie inference.
9. Keep `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` unless genuinely new row-level provenance evidence appears.
10. Preserve B-104 Class B row-level observability proposal only; no implementation/merge/deploy without approval.
11. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.


## Parallel durable lane — Market Microstructure（市場微結構／訂單流／流動性）
- Dedicated checkpoint: `MICROSTRUCTURE_CHECKPOINT.md`
- Evidence / hypotheses: `MICROSTRUCTURE_RESEARCH.md`
- Current cursor: MS-001 through MS-032 complete; continue from MS-033.
- Durable findings: spread is both execution friction and adverse-selection/liquidity information; short-horizon price change is more directly related to order-flow imbalance than raw volume in foundational microstructure evidence; imbalance must be interpreted jointly with market depth; persistence can arise from order splitting but is not monotonically directional; OHLCV cannot reconstruct true OFI/cancellations/queue state.
- Taiwan controls are mandatory: continuous vs call-auction session, +/-10% daily price-limit context, tick-size/price tier, intraday volatility interruption, and regular-lot vs odd-lot mechanics.
- Preferred research state: Liquidity Cost / Available Depth / Pressure / Price Response / Persistence / Constraint.
- Highest-value integration target is research-only 15m BUY / Execution Alpha diagnostics for false breakout, chase/slippage and absorption; no Formal Core, monitoring, signal, capital or push change.
- Deepened through MS-018: queue imbalance/microprice horizon limits, trade-sign inference errors, execution-cost separation, same-slot normalization, Fugle data availability, absorption/replenishment, liquidity-vacuum versus depth-supported breakout, failed-breakout microstructure, Taiwan order-imbalance evidence, recorder redundancy and safe capture architecture are durable.
- Redundancy audit: V8.8.1 already captures top-five bids/asks, spreadPct, bidDepth5, askDepth5, depthImbalance and executionMarketState in research snapshots. Do not duplicate them. Truly incremental priorities are same-slot normalization, trade-pressure proxy, pressure-to-price response, weighted-mid displacement, transaction rate, replenishment/resiliency and persistence states.
- Existing recorder cadence is too sparse for true event-level OFI/resiliency. New trades/volumes fetches in the Formal monitor path may create shared-runtime risk; prefer an isolated research capture path.
- Advanced through MS-024: dynamic-cadence requirements, markout/implementation-shortfall semantics, TWSE tick-band normalization, price-limit/VI nonlinear regimes, cross-lane redundancy gate and a frozen empirical protocol are durable. Next priority is to use existing recorder evidence before adding new capture code.
- Advanced through MS-032: live recorder coverage is explicitly UNKNOWN until runtime rows are read; zero-code feasibility gate is frozen; 2025 Taiwan top-five evidence supports testing deeper levels; dual-clock resiliency, limited depth-shape tests, displayed-depth cancellation risk and an interpretable non-directional microstructure state taxonomy are now durable.
- Exact continuation: MS-033 deployment/version lineage audit; MS-034 top-five notional vs share weighting; MS-035 buy/sell asymmetry; MS-036 auction contamination windows; MS-037 cross-lane integration without double counting; MS-038 freeze smallest combined feature matrix.


## Parallel durable lane — Market Microstructure（市場微結構／訂單流／流動性） status update
- Dedicated files: `MICROSTRUCTURE_RESEARCH.md`, `MICROSTRUCTURE_CHECKPOINT.md`, `MICROSTRUCTURE_COLLECTOR_PROPOSAL.md`.
- Current cursor: MS-001 through MS-044 complete.
- Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.
- Existing V8.8.1 recorder already covers spread/top-five depth/depth imbalance/market-state snapshots. Dynamic replenishment/pressure/resiliency requires prospective complete capture.
- Separate collector is proposal-only; no code/deploy. Formal Core unchanged.

## Parallel durable lane — Market Breadth + Sector Rotation + Leadership
- Dedicated files: `MARKET_BREADTH_ROTATION_RESEARCH.md`, `MARKET_BREADTH_ROTATION_CHECKPOINT.md`.
- Current cursor: BR-001 through BR-025 complete.
- Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.
- Critical source finding: current `buildTodaySectorStats()` breadth is computed from rows already filtered by the Formal scan normalization (including close >= NT$10 and non-common-instrument exclusions), so it is eligible/scan-universe sector breadth, not whole-market breadth.
- Current production sector gate (breadth >=40%, avgChange >=-1%, amountVs20DayAverage >=0.5) remains unchanged; research will audit it prospectively without threshold sweep.
- New conceptual layers frozen: universe-separated breadth, breadth trend/acceleration, cap-vs-equal/median concentration, sector rank transition, cross-sector correlation/dispersion, leadership diffusion/concentration, stock-RS x sector-state interaction, point-in-time universe/classification controls.
- Formal Core unchanged.

## Parallel durable lane — Fundamental Information Dynamics
- Dedicated files: `FUNDAMENTAL_INFORMATION_DYNAMICS_RESEARCH.md`, `FUNDAMENTAL_INFORMATION_DYNAMICS_CHECKPOINT.md`.
- Current cursor: FD-001 through FD-028 complete.
- Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.
- Existing main Worker has realized fundamental level/change fields and `fundamentalScore()`, but no source-level `surprise`, `consensus`, `revision`, or `forecast` semantics.
- Durable distinction: LEVEL / CHANGE / SURPRISE / REVISION / PRICE REACTION are separate information layers. EPS YoY is not SUE; revenue YoY/MoM is not revenue surprise.
- Taiwan monthly revenue first-known timing/vintage, SUE expectation source, cash/accrual quality, margin dynamics, guidance, analyst disagreement, fundamental momentum, event-price reaction and peer transfer are now conceptually specified.
- Near-term priority is point-in-time official event truth; analyst consensus/revision requires a verified historical point-in-time provider.
- Formal Core unchanged.

## External-learning continuation
- Microstructure, breadth/rotation, and fundamental-dynamics concept lanes are converged. Do not create more variants until evidence accumulates.
- Next genuinely under-studied lane: Derivatives Information & Volatility Surface, with Taiwan futures/options mechanics and positive/counter mechanisms.


## Parallel durable lane — Portfolio & Risk Construction status update
- Dedicated files: `PORTFOLIO_RISK_RESEARCH.md`, `PORTFOLIO_RISK_CHECKPOINT.md`.
- Current cursor: PR-001 through PR-024 complete.
- Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.
- Durable additions: shrinkage-covariance hierarchy, diagnostic-first clustering, capital-vs-risk concentration separation, rejection of short-window ES as a sizing gate, planned/projected portfolio heat, cash-state attribution, priorityScore conviction-calibration gate, and within-pool plus consolidated-live risk views.
- Formal Core unchanged.

## Market-microstructure lineage correction
- Raw `main/Worker.js` is a pre-build base and does not itself prove deployed V8.8 recorder presence.
- Production GitHub Actions explicitly applies V8.8.0/V8.8.1 before later patches, validates the recorder table/endpoint/fail-open contract in the built Worker, then deploys the built Worker.
- Build pipeline inclusion is verified; live D1 coverage remains UNKNOWN and this turn did not independently read the protected runtime recorder.

## External-learning continuation
- Portfolio-risk concept lane is converged.
- Next genuinely under-studied lane: Trading Frictions, Turnover & Rebalancing.
- Start with Taiwan explicit taxes/commissions, implicit spread/slippage, round-trip hurdle, turnover drag, FIRST/ADD/REDUCE/RE-ADD costs, no-trade/hysteresis concepts, and cost-aware trade/no-trade decisions.


## Parallel durable lane — Trading Frictions, Turnover & Rebalancing status update
- Dedicated files: `TRADING_FRICTIONS_RESEARCH.md`, `TRADING_FRICTIONS_CHECKPOINT.md`.
- Current cursor: TF-001 through TF-020 complete.
- Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.
- Source audit: current V8.5 journal main `returnPct` is first formal BUY signal market price to first later SELL/STOP_LOSS signal market price, i.e. signal-price gross return. It is not verified fill return and not after-cost net performance.
- Existing position reconciliation supplies actualShares / averageCost / firstEntryConfirmedAt when reconciled, but audited source did not provide an exhaustive per-fill commission/tax/slippage ledger. Historical realized net-cost coverage remains NOT_ESTABLISHED.
- Durable design: ACTUAL/PARTIAL_ACTUAL/MODELED/UNKNOWN cost provenance, gross/net-explicit/net-all-in separation, cause-attributed turnover, KEEP-vs-TRADE REDUCE/RE-ADD counterfactual, fill-completeness semantics, and market-mechanism cost cohorts.
- Highest-value first evidence target remains ABF REDUCE -> RECOVERY_WATCH -> RE-ADD once actual reduced-share/fill/cost provenance is trustworthy.
- Formal Core unchanged.

## External-learning continuation
- Trading Frictions concept lane is converged.
- Next genuinely under-studied lane: Event Risk, Gap Risk & Overnight Information.


## Parallel durable lane — Event Risk, Gap Risk & Overnight Information
- Dedicated files: `EVENT_RISK_RESEARCH.md`, `EVENT_RISK_CHECKPOINT.md`, `EVENT_RISK_CAPTURE_PROPOSAL.md`.
- Current cursor: ER-001 through ER-028 complete.
- Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.
- Durable scope: overnight/intraday decomposition, scheduled-vs-unscheduled event certainty, MOPS point-in-time provenance, gap-through-stop risk, ±10% limit-constrained exits, weekend/holiday exposure, opening auction, overseas/common-factor gap controls, portfolio event clustering and event-aware stress.
- Source audit: current ANNOUNCEMENTS quality snapshots normalize official rows to date/title only, so intraday first-known timing is not preserved. V8.8.1 snapshots have previousClose/openPrice but not quote referencePrice/openTime, so corporate-action-safe gap analysis is incomplete.
- Full prospective ER-024 is not zero-code feasible with current stored evidence. A proposal-only point-in-time capture design is frozen; no implementation/deploy.
- Formal Core unchanged.


## Parallel durable lane — Leverage & Shorting（融資／融券／借券賣出／擁擠）
- Dedicated files: `LEVERAGE_SHORTING_RESEARCH.md`, `LEVERAGE_SHORTING_CHECKPOINT.md`.
- Current cursor: LS-001 through LS-040 complete.
- Status: CONCEPT_COMPLETE / DATA_BUILD_PENDING.
- Core distinction: margin purchase, margin short, securities borrowing and actual SBL short sale are separate objects; balance and flow are separate; borrowing is not short sale.
- 2026 TWSE market-structure evidence supports interpreting margin primarily as leverage/retail-crowding context rather than a monotonic bullish signal. Raw absolute margin balance must be normalized by market/stock scale and own history.
- Current V8.7.11 source audit: TWSE margin evidence stores marginBuy/marginSell/prev/today balance and margin-short cover/sale/prev/today balance; TWSE actual SBL evidence stores prior balance/sale/return/adjust/balance/next limit. TPEX remains uncaptured in V8.7.11 despite public official source availability.
- Critical data-quality finding: TWSE same-day margin “today balance” is auxiliary/preliminary; next-trading-day “previous balance” is the authoritative final value. Preliminary and finalized vintages must be preserved separately.
- Historical finalized TWSE/TPEx daily data are research-feasible, but historical backfill cannot prove first-known timing or same-night 23:35 availability.
- Historical rule-regime segmentation is mandatory; major SBL/short-sale/continuous-trading/odd-lot/limit changes are frozen in the lane.
- First pre-registered hypotheses H1-H5 cover long-leverage crowding, deleveraging stress, actual SBL-short information, squeeze candidates and two-sided disagreement/volatility. Direction and risk outcomes are separate.
- Minimal Shadow v0.1 uses ADV/daily-volume/own-history/quota normalization and remains OBSERVER-only.
- No production implementation/deploy and no Formal Core change.
- Exact continuation: LS-041 offline historical-data specification; LS-042 small multi-date source validation; LS-043 independent-date evidence only after schema validation.


## Leverage & Shorting status update
- Current cursor: LS-001 through LS-046 complete.
- Dedicated files: `LEVERAGE_SHORTING_RESEARCH.md`, `LEVERAGE_SHORTING_CHECKPOINT.md`, `LEVERAGE_SHORTING_DATA_SPEC.md`.
- Status: CONCEPT_COMPLETE / DATA_SPEC_COMPLETE / SOURCE_CONTRACT_PARTIAL.
- TWSE margin/SBL schemas and algebra validated; TPEx margin/SBL displayed schemas validated; TPEx SBL EDIS S47 machine CSV contract verified.
- Unit guard is mandatory: margin tables and SBL files use different source units. Raw values are not directly comparable.
- TPEx margin CSV availability is verified, but its stable programmatic endpoint contract remains unresolved. Cross-market automated large backfill is NO_GO until resolved or an official artifact-ingestion workflow is selected.
- No H1-H5 outcome testing has begun. Formal Core unchanged.
- Exact continuation: LS-047 parser validation after official source artifact/endpoint; LS-048 backfill pilot; LS-049 completeness/revision audit; LS-050 pre-registered evidence tests only after data gates pass.


## Passive Flow & Index Rebalancing status update
- Dedicated files: PASSIVE_FLOW_INDEX_REBALANCING_RESEARCH.md, PASSIVE_FLOW_INDEX_REBALANCING_CHECKPOINT.md.
- Current cursor: PF-001 through PF-034 complete.
- Status: CONCEPT_COMPLETE / SOURCE_MAP_COMPLETE / EVIDENCE_BUILD_PENDING.
- MSCI review event clocks validated across four 2025–2026 cycles. Complete detailed constituent parser remains PARTIAL.
- TWSE current ETF benchmark/AUM mapping is strong; exact historical daily event-date AUM remains partial. Benchmark-level deduplication is frozen.
- Current recorder cannot isolate closing-auction-only distortion. Outcome testing remains gated; no passive-flow score or Formal rule added.


## Corporate Actions & Capital Supply status update
- Files: `CORPORATE_ACTIONS_CAPITAL_SUPPLY_RESEARCH.md`, `CORPORATE_ACTIONS_CAPITAL_SUPPLY_CHECKPOINT.md`, `CORPORATE_ACTION_SHARE_DENOMINATOR_SOURCE_CONTRACT.md`, `CORPORATE_ACTION_VOLUME_DENOMINATOR_SPEC.md`, `CORPORATE_ACTION_HISTORY_SEMANTICS_PROPOSAL.md`, `CORPORATE_ACTION_REGISTRY_VALIDATION_SPEC.md`, `CORPORATE_ACTION_RS_SOURCE_CONTRACT.md`, `CORPORATE_ACTION_DISCOVERY_SOURCE_CONTRACT.md`, `CORPORATE_ACTION_ARCHIVE_SPEC.md`, `CORPORATE_ACTION_DENOMINATOR_SHADOW_READINESS.md`.
- Artifacts include registry v0.2, feature-window manifest v0.1, mechanics feature-delta v0.1, RS semantic sample v0.1, contamination-persistence v0.1, `research/corporate_action_8454_full_window_v0_1.json`, `research/corporate_action_denominator_vintage_threshold_v0_1.json`, `research/corporate_action_lifecycle_edge_matrix_v0_1.json`, `research/corporate_action_denominator_source_receipt_v0_1.json`, `research/corporate_action_volume_semantic_family_sample_v0_1.json`, and `research/corporate_action_downstream_denominator_replay_v0_1.json`.
- Current cursor: CA-001 through CA-112 complete; continue from CA-113.
- Status: MATERIALITY_CONFIRMED / RS_SEMANTICS_CONFIRMED / SUSPENSION_INTERACTION_FOUND / DENOMINATOR_SEMANTICS_HARDENED / VINTAGE_ANTI_LEAKAGE_FROZEN / LIFECYCLE_EXECUTABLE_TESTED / SOURCE_CONTRACT_WITH_BLOCKERS / CLASS_A_SHADOW_PROPOSAL_ONLY.
- Corporate-action contamination can persist through rolling windows; price, raw share volume, registered-issued turnover, exchange-listed/tradable turnover, free-float turnover and EPS weighted-average shares are separate semantic spaces.
- Replay requires both denominator `knownAt <= replayAsOf` and semantic `effectiveFromSession <= targetSession`; later ex-post corrections must not leak backward into historical decision-time truth.
- Critical CA-101/103 falsification remains: 2465 payment certificates began trading 2025-11-17, but the official registered-capital change to NT$939,460,310 is dated 2026-01-06. The old 83,946,031 -> 93,946,031-on-11/17 registered-denominator interpretation is rejected and retained only as a falsification witness.
- CA-106 confirms official daily denominator source lanes on both exchanges. CA-111 now resolves BFT51U raw-unit semantics from official BFT51U/BFI85U sample artifacts: 發行張數 is a lot/trading-unit count, 上市股數 is a raw share count in the sample, and exact-share reconstruction from 發行張數 by blind x1000 is rejected. Full historical archive readiness remains NO_GO pending CA-113/114.
- CA-107 pre-registered four-family mechanics contains both positive and counter evidence: 3593 can flip tested volume-condition booleans; 8454/8422 show numeric distortion need not flip them; 2465 disagreement is denominator-semantic dependent.
- CA-108 confirms raw institutional net-share flows remain factual while normalized flows and derived historical capitalization require explicit point-in-time denominator semantics.
- CA-109 executable lifecycle revision/cancellation tests passed on draft PR #101 branch commit `0c18332013a79faf5f184858b046e9d75d4d11c6`: Research Corporate Action Prototype `36148491289`, V8 Regression `36148491397`, and V8 Repair `36148491185` all succeeded.
- CA-110 result: `CLASS_A_SHADOW_PROPOSAL_READINESS = PROPOSAL_ONLY / DATA_GATES_NOT_READY_FOR_IMPLEMENTATION`. No implementation or owner option was selected.
- Symbol-session suspension prerequisite and B-130 stale-cache negative control remain intact. PR #101 remains research-only; no Worker.js wiring, merge or Production deployment is authorized.
- Formal Core/A-B/ranking/thresholds/3+3+3/capital/entry/add/reduce/sell/stop/monitor/push remain unchanged.
- CA-111 is COMPLETE with `research/twse_bft51u_unit_resolution_receipt_v0_2.json`. Official BFT51U and BFI85U samples prove 發行張數 is not an exact share count: 2330 leaves a 458-share sub-lot remainder and 8454 leaves 500 shares; 8422 is retained as an exact-multiple counterexample. BFI85U 00636K trade unit=100 confirms security-specific unit guards are mandatory.
- CA-112 is independently complete ahead of the contiguous cursor. `CORPORATE_ACTION_TPEX_DENOMINATOR_INGESTION_CONTRACT.md` freezes official TPEx EDIS S38 / `STKT2QUOTESN.TXT`: trade volume and issued shares are explicitly in shares. Research-only parser CI passed on branch commit `78f627d36de44e50d50f74bb387e19dec9558a7a` (Research `36149848429`, Regression `36149848439`, Repair `36149848481`).
- CA-112 remains independently complete; with CA-111 closed, the contiguous cursor advances through CA-112. Formal Core remains locked.
- Exact continuation: CA-113 bounded dual-exchange archive pilot/completeness receipts; CA-114 payment-certificate/private-placement denominator resolution with independent witness; CA-115 readiness re-evaluation.


## B-136 — CA-111 strict blocker narrowed; CA-113 bounded pilot prepared (2026-09-25 23:00 Asia/Taipei)
- Start-of-run canonical governance/worklist/checkpoint were re-read from main; Formal Core remained LOCKED.
- A/main advanced during the run; latest main observed before checkpoint write: `f5526b254651a33a8e786266c8fb11e15c87892b` (`checkpoint: continue CA-111 and prepare CA-113 pilot`). No stale parent/checkpoint overwrite was used.
- CA-111 positive evidence extended with official TWSE LT185 listed common-share/TDR count-change lane. Official public workflow preserves announcement/effective-date semantics and an independent TWSE filing-operation witness explicitly describes listed-share maintenance counts in shares, with cumulative listed shares excluding private-placement/restricted-trading shares in the illustrated workflow.
- Counterevidence retained: LT185 is event-driven, not a complete daily denominator snapshot. It does not prove BFT51U raw units; universal BFT51U x1000 remains PROHIBITED. CA-111 therefore remains IN_PROGRESS / UNKNOWN on the strict daily raw-unit contract.
- Durable receipt updated: `research/twse_bft51u_unit_resolution_receipt_v0_1.json`.
- CA-113 bounded pilot preparation materialized: `research/corporate_action_dual_exchange_archive_pilot_plan_v0_1.json`. Status PREPARED_NOT_EXECUTED. TPEx S38 bounded archive-byte pilot is allowed; TWSE event-ledger reconciliation preparation is allowed; full dual-exchange completeness is prohibited until CA-111 closes.
- CA-114 independent semantic evidence improved: TWSE listed-share maintenance excludes private-placement/restricted shares from the cumulative listed-share object in the official illustrated workflow. This strengthens the 2465 public-listed/private-placement separation, but payment certificates remain a distinct tradable stage; exact 2025-11-17 combined exchange-tradable denominator remains PARTIAL pending a date-specific daily exchange artifact.
- Bias/quality gates: no current-snapshot backfill, no future denominator leakage, no missing=0/BAD, no inferred continuity across unknown sessions, no outcome/alpha test, no historical Shadow fabrication, no Factor Zoo addition, no Formal selection/ranking/threshold/capital/monitor/push change.
- Engineering status: Class A research artifacts/checkpoints only; main writes succeeded for the CA-111 receipt, CA-113 pilot plan, and CA lane checkpoint. No Worker.js wiring, PR merge, or Production deployment.
- Exact next continuation: (1) CA-111 capture explicit official BFT51U/BFI85U daily raw-unit proof or equivalent verified daily share lane with trading-unit guard; (2) in parallel execute bounded TPEx S38 archive bytes + TWSE LT185 event-ledger reconciliation receipts for CA-113 without claiming full completeness; (3) CA-114 obtain 2465 date-specific daily exchange artifact around 2025-11-17 distinguishing ordinary listed shares, private-placement shares, and payment-certificate tradable supply; (4) CA-115 readiness only after CA-111/113/114 pass.


## B-137 — CA-111 closed; Corporate Actions cursor advances (2026-09-25 Asia/Taipei)
- Earlier Work/project handoff failure did not block the connected GitHub research path. Research continued in the current chat using the authorized GitHub/TWSE sources.
- Official BFT51U sample CSV and BFI85U sample CSV were successfully read through the browser-capable authorized path after the earlier binary-fetch failures.
- 2330 witness: BFT51U 發行張數=25,930,380 and 上市股數=25,930,380,458; BFI85U 交易單位=1,000 and 發行股數=25,930,380. Whole-lot reconstruction is 458 shares short.
- 8454 independently leaves a 500-share remainder. 8422 is retained as the exact-multiple counterexample. BFI85U 00636K has 交易單位=100, proving security-specific trade-unit guards are required.
- Result: `TWSE_BFT51U_RAW_UNIT_CONTRACT=RESOLVED`; blind universal x1000 is rejected for exact-share denominators. BFT51U 上市股數 is the preferred exact listed-share candidate lane; BFT51U 發行張數 alone is insufficient for exact registered-issued shares.
- New durable artifact: `research/twse_bft51u_unit_resolution_receipt_v0_2.json`.
- Dedicated Corporate Actions research/checkpoint were updated. CA-112 was already complete independently, so contiguous cursor is now CA-001 through CA-112 complete; continue CA-113.
- Formal Core, A/B logic, ranking, thresholds, 3+3+3, capital, entry/add/reduce/sell/stop, monitor and push remain unchanged. No Worker.js wiring, merge or Production deployment.
- Exact continuation: CA-113 bounded dual-exchange denominator archive pilot with completeness/revision receipts; CA-114 2465 payment-certificate/private-placement denominator resolution plus independent witness; CA-115 readiness re-evaluation only after CA-113/114 pass.


## B-138 — CA-113 pilot aligned; CA-114 instrument-stage semantics resolved (2026-09-25 Asia/Taipei)
- Start-of-run governance/worklist/checkpoint/main were re-read. Canonical start was B-137 / CA-113; A had advanced Price-Volume independently, which was not redone.
- CA-113 plan upgraded to v0.2 after CA-111 closure: TWSE exact listed-share candidate = BFT51U 上市股數 raw field; BFT51U 發行張數 remains lot-count only; security-specific trading-unit guard remains mandatory. Pilot is READY_FOR_BOUNDED_EXECUTION, not complete.
- CA-114 semantic-stage receipt materialized: `research/corporate_action_2465_payment_certificate_resolution_v0_1.json`.
- Positive evidence: 2465 disclosure for 2025-11-17 explicitly separates 58,946,031 original listed common shares (excluding 25,000,000 private-placement common shares) and 10,000,000 listed payment-certificate units. For a metric that explicitly combines both tradable instrument types, 68,946,031 is the derived combined tradable-unit universe.
- Counterevidence/guard: 68,946,031 must NOT be relabeled REGISTERED_ISSUED_COMMON_SHARES. The same disclosure's 93,946,031 cumulative figure includes payment certificates and likewise is not proof of 2025-11-17 registered-issued ordinary shares. Registration was approved 2026-01-06; new ordinary shares list and payment certificates terminate/convert 2026-01-16. Later ordinary-share state must not leak backward.
- CA-114 is SEMANTIC_STAGE_RESOLVED_DAILY_ARCHIVE_RECEIPT_PENDING. Bounded daily TWSE rows around 2025-11-17 are still required to reconcile BFT51U/security rows and prove coverage/revision behavior. If the daily lane cannot expose payment-certificate supply, metric-specific denominator remains UNKNOWN rather than forcing a value.
- Bias/quality checks: no outcome-driven denominator choice, no missing=0/BAD, no current-state backfill, no future leakage, no historical Shadow fabrication, no Formal change.
- Engineering: research-only artifacts/checkpoints committed on main; no Worker.js wiring, PR merge or Production deployment.
- Exact next continuation: execute CA-113 bounded TWSE/TPEx archive receipts with expected/observed/missing/revision/knownAt/UNKNOWN accounting; reconcile CA-114 2465 daily TWSE rows against frozen instrument-stage semantics; then CA-115 readiness re-evaluation only if archive/data gates pass.


## B-139 — CA-113 first bounded public-lane receipts (2026-09-25 23:33 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main and continued from B-138 / CA-113. Another research line had advanced Price-Volume through PV-190; it was not redone or overwritten.
- CA-113 first bounded official receipts captured. TPEx official daily quote output independently exposes raw issued shares, supporting the frozen S38 share-unit contract as a reconciliation lane.
- 5314 provides a strong symbol-session completeness negative control: official TPEx notice confirms par-value-change trading suspension 2025-03-20..2025-03-28 and resumption 2025-03-31. These dates are VERIFIED_SUSPENSION, not missing denominator observations. A separate official notice starts another suspension 2025-10-14, proving suspension provenance must be event/window-specific rather than inferred from one corporate-action family.
- TWSE BFT51U official contract remains daily (~14:40) with 發行張數 and 上市股數, but bounded historical BFT51U bytes are not proven accessible through the current public path. Therefore 2465 2025-11-17 denominator reconciliation remains incomplete.
- Counterevidence/UNKNOWN: TWSE public trading report can prove 2465 traded in the target period but does not expose payment-certificate/listed-share denominator composition, so it cannot close CA-114. Missing denominator rows outside VERIFIED_SUSPENSION remain UNKNOWN/MISSING_SOURCE; no no-change inference.
- CA-113 status = PARTIAL_RECEIPTS / ARCHIVE_BYTES_PENDING. CA-114 remains SEMANTIC_STAGE_RESOLVED_DAILY_ARCHIVE_RECEIPT_PENDING. No revision/knownAt completeness claim yet.
- Bias/quality: no current-snapshot backfill, no inferred continuity across missing sessions, no missing=0/BAD, no alpha/outcome test, no historical Shadow fabrication, no new factor/window/threshold. R01-R08/I01-I07 unchanged.
- Engineering: Class A research/checkpoint only; dedicated CA checkpoint commit `eb54c57b17d9e8d8ac6e3152e28875d51f5949f0`. Formal Core/Worker/Production/PR #100/#101 unchanged.
- Exact next continuation: acquire bounded historical TPEx S38 bytes and materialize expected/observed/VERIFIED_SUSPENSION/UNKNOWN/revision/knownAt counts; obtain bounded TWSE BFT51U or equivalent exact daily listed-share artifacts for witness windows, especially 2465 around 2025-11-17; only then CA-115 readiness re-evaluation.


## B-140 — CA-113 public historical lane validated; CA-114 daily issued-share semantic conflict proven (2026-09-25 Asia/Taipei)
- Fresh-read Corporate Actions and governance checkpoints were used; work continued from B-139 without restarting CA research or touching the independently advanced Price-Volume lane.
- CA-113 now has a materialized bounded receipt: `research/corporate_action_ca113_bounded_public_lane_receipt_v0_1.json`.
- Official TPEx historical daily query was validated across 2017, 2021 and 2025. It exposes exact `發行股數` shares and gives a strong 5314 par-value-change witness: 14,700,000 shares on 2025-03-18/19; checked suspension-boundary rows absent on 2025-03-20 and 2025-03-28; 294,000,000 shares on 2025-03-31 resume and 2025-04-01. A weekend query returns zero rows as a non-session negative control.
- CA-113 interpretation: symbol-session provenance works as designed. Verified suspension is not missing-source failure, and the 20x share-base switch belongs at the resume session. The public historical query is a validated official reconciliation lane, but immutable S38 bytes/hash, first-known timing and full revision history remain unproven.
- CA-114 new artifact: `research/corporate_action_2465_payment_certificate_resolution_v0_2.json`.
- TWSE MI_QFIIS 2465 daily `發行股數` is 83,946,031 on 2025-11-11 and 93,946,031 from 2025-11-12 onward; the 2025-11-12 row carries reason `2` and company-report date 2025-11-12. The jump occurs before payment certificates start trading 2025-11-17 and before MOEA registration approval 2026-01-06.
- This falsifies equivalence between MI_QFIIS `發行股數`, point-in-time registered common shares and exchange-listed/tradable supply. Similar field names are not a license to merge reporting, registration and trading clocks.
- Current statuses: CA-113 = `TPEX_BOUNDED_PUBLIC_LANE_VALIDATED / S38_BYTES_PENDING / TWSE_EXACT_LISTED_ARCHIVE_PENDING`; CA-114 = `DAILY_ISSUED_REPORT_CONFLICT_CONFIRMED / EXACT_LISTED_TRADABLE_ARCHIVE_PENDING`.
- Formal Core/A-B/ranking/thresholds/3+3+3/capital/entry/add/reduce/sell/stop/monitor/push remain unchanged. No Worker.js wiring, PR merge or Production deployment.
- Exact continuation: acquire BFT51U `上市股數` or equivalent exact historical TWSE listed-share artifacts around 2465 2025-11-11..18 and resolve payment-certificate representation; continue immutable TPEx S38 byte/hash completeness if feasible; only then consider CA-115 readiness re-evaluation.


## B-141 — CA-115 interim readiness remains NO-GO (2026-09-26 Asia/Taipei)
- Fresh canonical read continued from B-140. CA-113/114 were not restarted; independently advanced Price-Volume work was not touched.
- CA-115 interim readiness was evaluated because CA-113/114 now have materially stronger bounded evidence, but the result is NO_GO_DATA_PROVENANCE_GATES rather than implementation readiness.
- Passed: CA-111 unit semantics; CA-112 TPEx S38 field/unit parser contract; CA-113 TPEx public historical reconciliation across independent eras plus verified-suspension negative control; CA-114 2465 instrument-stage semantics and MI_QFIIS non-equivalence falsification.
- New independent counterevidence: official TWSE 2465 stock profile produced 2025-11-22 still reports paid-in capital NT$839,460,310 while its own price/volume table shows ordinary 2465 trading on 2025-11-17..21. This independently rejects interpreting MI_QFIIS 93,946,031 as contemporaneous registered common shares.
- Remaining blockers: bounded historical TWSE BFT51U 上市股數/payment-certificate representation around 2025-11-17; immutable TPEx S38 bytes/hash/revision provenance; historical first-known timing. Ex-post historical query completeness is not point-in-time vintage proof.
- Payment-certificate combined tradable denominator remains metric-specific UNKNOWN unless a contemporaneous source contract explicitly combines ordinary listed shares and certificate units.
- Bias/quality: no outcome-driven denominator choice, no current-state backfill, no missing=0/BAD, no alpha test, no historical Shadow fabrication, no Factor Zoo expansion, R01-R08/I01-I07 unchanged.
- Engineering: attempted a dedicated CA-115 JSON artifact through the normal contents API, but the mutation was blocked before commit. No claim that artifact exists. This checkpoint records the research result only if this write succeeds.
- Formal Core remains LOCKED; no Worker.js wiring, PR merge, deployment, ranking/threshold/capital/monitor/push change.
- Exact next continuation: continue CA-113 immutable TPEx archive provenance; continue CA-114 exact TWSE listed-share/payment-certificate daily representation around 2025-11-17; repeat CA-115 only after those provenance gates materially improve.


## B-142 — CA-113/115 access-vs-provenance gate hardened (2026-09-26 02:44 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical remained B-141. Continued exact CA-113/114 provenance blockers and did not redo independently advanced research.
- New official-source distinction: TPEx S38/STKT2QUOTESN is an official post-close data product (14:50/17:45 lane) and the already-validated public historical query is a reconciliation witness, but neither proves immutable delivered historical bytes/hash, revision chain, or first-known vintage. Therefore SOURCE_SEMANTICS_READY and PUBLIC_HISTORICAL_RECONCILIATION_READY must remain separate from IMMUTABLE_ARCHIVE_READY and PIT_VINTAGE_READY.
- TWSE BFT51U official product explicitly supports historical subscription/download ranges, is daily ~14:40, and contains 發行張數/上市股數. Failure to possess bounded 2025-11-17 bytes is ACCESS_GATED, not SOURCE_ABSENT and not NO_CHANGE.
- Independent counterevidence retained: official TWSE 2465 profile produced 2025-11-27 reports paid-in capital NT$839,460,310 while ordinary 2465 trading is shown in the same period. This continues to reject MI_QFIIS 93,946,031 as contemporaneous registered-common-share truth and does not resolve payment-certificate tradable denominator composition.
- Provenance discrepancy remains: BFT51U Chinese product page start date 2004-02-19 vs English 2004-03-01. Preserve UNKNOWN; do not silently choose one.
- CA-115 remains NO_GO_DATA_PROVENANCE_GATES. Access gating is itself a readiness result; evidence standards are not lowered to manufacture historical Shadow.
- Bias/quality: ACCESS_GATED != MISSING_SOURCE != NO_CHANGE != BAD != 0; no current-state backfill, no inferred continuity, no outcome-driven denominator, no alpha test, no historical Shadow fabrication, no new factor/window/threshold. R01-R08/I01-I07 unchanged.
- Engineering: Class A research/checkpoint only; no Worker.js, Formal Core, PR promotion, or Production change.
- Exact next continuation: search authorized repo/workflow/artifact history for previously delivered TPEx S38 bytes/hash and TWSE BFT51U/BFT50U bounded historical artifacts; if absent, freeze ACCESS_GATED + PIT_VINTAGE_UNKNOWN into CA-115 readiness and move to the next evidence priority rather than repeatedly searching the same public lane.


## B-143 — CA-115 authorized-history search exhausted; provenance gate frozen (2026-09-26 03:40 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical start was B-142. Continued the exact authorized repo/workflow/artifact-history search rather than repeating public-source discovery.
- Repository tree and indexed code/history were searched for `STKT2QUOTESN`, `S38`, `BFT51U`, and `BFT50U`. No delivered historical TPEx S38 raw file, immutable byte hash, or bounded historical TWSE BFT51U/BFT50U data artifact is present on main.
- The only S38 code-history commit found is `c14eb82565031d56711b4d0b10a5da076eb3b4c9`, which explicitly states the evidence is parser/semantic only and does not claim a complete historical S38 archive. The draft-PR parser CI therefore cannot be reinterpreted as archive provenance.
- Existing BFT51U repo artifacts are unit-resolution receipts/sample evidence, not bounded 2465 2025-11-17 historical daily product bytes. This independently confirms the B-142 ACCESS_GATED classification rather than SOURCE_ABSENT.
- CA-115 readiness is now frozen at `NO_GO_DATA_PROVENANCE_GATES` for historical denominator Shadow implementation until new authorized bytes/vintage provenance arrives. Repeated searching of the same public/repo lane is stopped; evidence standards are not lowered.
- Bias/quality: no current-state backfill, no ex-post query promoted to first-known vintage, no missing=0/BAD, no inferred no-change, no alpha/outcome test, no historical Shadow fabrication, no new factor/window/threshold. R01-R08/I01-I07 unchanged.
- Engineering: Class A checkpoint/research only. Formal Core/Worker/Production/PR #100/#101 unchanged; no merge or deploy.
- Exact next continuation: move from the exhausted CA provenance search to the next highest-value unresolved evidence gate already in the canonical research program: execution-recorder target-date completeness/non-truncation before BUY/NO-BUY interpretation. Preserve CA-115 NO_GO until genuinely new authorized denominator bytes/vintage evidence appears.


## B-144 — Execution recorder authoritative-history search exhausted; exact-date completeness remains blocked (2026-09-26 05:39 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical start was B-143. Continued the exact next gate: execution-recorder target-date completeness/non-truncation before BUY/NO-BUY interpretation.
- Runtime source contract reconfirmed from V8.8.0: recorder read uses `trade_date >= fromDate`, newest-first ordering and `LIMIT 500`; API returns only `recent: rows.slice(0,80)`. It has no exact-date filter, pagination, pre-limit total count, truncation flag, expected-event count, or per-date completeness metadata.
- V8.8.0 write contract records only event clocks OPEN_BASELINE/FIRST_10M_COMPLETE/FIRST_15M_COMPLETE/FIRST_30M_COMPLETE plus FORMAL_SIGNAL_OBSERVED when notifications exist. INSERT OR IGNORE protects event keys but does not prove every scheduled monitor invocation completed or every expected symbol was present.
- Authorized GitHub Actions history was searched for 2026-09-24 authoritative evidence. The successful official-market-data sync run 36021494403 has no artifacts and its data-sync/recovery steps were skipped. Scheduled health runs 35942927209 and 35959388906 succeeded on intraday-snapshot verification but expose no workflow artifacts and do not provide execution-recorder row counts.
- Therefore no GitHub workflow/artifact evidence can independently prove 2026-09-24 recorder row completeness or rescue rows hidden behind the 500-row read cap.
- Research interpretation remains DATA_QUALITY_BLOCKED: absence from the visible recorder response is UNKNOWN, not NO_BUY/BAD/0. BUY-vs-NO-BUY and Execution Alpha for the target date remain gated to prevent truncation/visible-row survivorship bias.
- Engineering classification: a future exact-date completeness read would touch the shared authenticated runtime/API and is Class B proposal-first. Safe proposal requirements are date equality filtering, count-before-page/totalRows, pagination or bounded page token, truncation flag, per-event/per-symbol counts, and explicit completeness UNKNOWN semantics. Branch/tests may be prepared, but no Production promotion is authorized.
- Bias/quality: no selection inference from visible rows, no missing=0/BAD, no historical Shadow fabrication, no new factor/window/threshold; R01-R08/I01-I07 unchanged.
- Formal Core/A-B/ranking/thresholds/3+3+3/capital/entry/add/reduce/sell/stop/monitor/push unchanged; no Worker.js or Production change this run.
- Exact next continuation: prepare a Class-B research proposal/branch test contract for exact-date recorder completeness without promotion; before writing, re-read canonical SHA and merge any concurrent checkpoint advance. Separately keep 2026-09-24 BUY/NO-BUY as UNKNOWN until authoritative exact-date completeness becomes observable.


## B-145 — Recorder completeness Class-B proposal contract frozen; branch created (2026-09-26 06:13 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical start was B-144. Continued exactly from the instruction to prepare a Class-B exact-date recorder completeness proposal without promotion.
- Source search reconfirmed the structural split: current read contract is rolling-window trade_date>=fromDate, newest-first LIMIT 500, externally exposes only recent rows.slice(0,80); current recorder hook is prospective/event-driven and fail-open after Formal signal/push/live-state paths.
- Proposal contract is frozen into two independent gates. ROW_COMPLETENESS requires exact trade-date equality, pre-pagination totalRows, deterministic pagination/cursor, explicit hasMore/truncated, per-event/per-symbol exact-date counts, and COMPLETE/INCOMPLETE/UNKNOWN plus missingReason. EXPECTED_EVENT_COMPLETENESS requires a persisted post-recorder run receipt with tradeDate, scheduledTime/runId, expected event types/symbols, attempted/stored/skipped counts, failOpen/error class and recordedAt.
- Falsification rules: zero returned rows without a complete run receipt remains UNKNOWN; monitor/Cron SUCCESS is not recorder success; fail-open receipt is INCOMPLETE/UNKNOWN; NO_EVENT is permitted only when the exact contract proves a complete run with zero expected events.
- Frozen proposal tests: date isolation; multi-page total/truncation consistency; zero-row UNKNOWN without receipt; explicit zero-expected complete receipt semantics; fail-open semantics; protected Formal selected symbols/order, A/B, 3+3+3, capital, signals and push outputs unchanged on frozen fixtures.
- Engineering: created branch research/recorder-exact-date-completeness-proposal from current main. Attempts to materialize the proposal document on that branch were blocked by the mutation safety layer before commit. No runtime code was changed; no PR was opened; no merge/deploy occurred.
- Classification remains Class B proposal-first because implementation would touch shared authenticated runtime/API and persisted run observability. Formal Core remains LOCKED.
- Bias/quality: no visible-row survivorship inference, no missing=0/BAD, no historical Shadow fabrication, no outcome-conditioned coverage definition, no new factor/window/threshold; R01-R08/I01-I07 unchanged.
- 2026-09-24 BUY/NO-BUY remains UNKNOWN / DATA_QUALITY_BLOCKED.
- Exact next continuation: if branch writes become available, materialize the frozen proposal/tests only (still no merge/deploy). Otherwise stop retrying the same blocked mutation and advance to the next unresolved canonical evidence priority that does not require Class-B production approval, while preserving this proposal contract and 2026-09-24 UNKNOWN.


## B-146 — Supply-chain lead-lag lane opened after recorder Class-B write block (2026-09-26 06:41 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical start was B-145. The recorder exact-date completeness proposal remains frozen on branch `research/recorder-exact-date-completeness-proposal`; because branch materialization was safety-blocked and the checkpoint explicitly says not to retry the same mutation indefinitely, this run advanced to the next unresolved research priority that requires no Production approval.
- Existing durable lane audit shows Fundamental Information Dynamics, Derivatives/Volatility, Portfolio Risk, Trading Frictions and Event Risk are already CONCEPT_COMPLETE/EVIDENCE_PENDING. No dedicated Supply-Chain Lead-Lag lane exists on main, despite it being a stated research priority. This is therefore the next genuinely under-studied lane rather than another factor variant.
- New research question frozen: can point-in-time upstream/downstream information from customer/supplier/peer disclosures add stable forward information beyond sector RS, price-volume/K-line, monthly revenue/fundamentalScore, attention, regime and common macro shocks?
- Positive mechanisms to test prospectively: upstream order/capacity/revenue shocks can precede downstream recognition; major-customer demand can propagate to suppliers; inventory/capex changes can transmit with economically meaningful lags.
- Counter-mechanisms/falsification frozen at lane opening: common macro/AI-theme shocks can create spurious lead-lag; price may incorporate shared information before accounting disclosures; customer/supplier mappings change over time; diversified firms break one-chain narratives; disclosed customer concentration may be stale/coarse; contemporaneous correlation is not causal lead-lag.
- PIT provenance requirement: every relationship edge needs `knownAt`, `effectiveFrom`, source, confidence and expiry/revalidation semantics. Current 2026 relationship maps must never be backfilled into earlier Shadow dates. Missing edge/data = UNKNOWN, not no-relationship/0.
- Minimal evidence architecture proposed for research only: `SUPPLY_CHAIN_EDGE_VINTAGE` + event ledger + same-date peer/common-factor controls. Candidate outcomes are D1/D3/D5/D10 residual return, MFE/MAE and revenue/fundamental response; independent scan/event dates are the inference unit.
- Redundancy order frozen before any alpha claim: existing sector/Residual RS -> market/industry regime -> price-volume/K-line -> own monthly revenue/fundamentalScore -> attention/event controls -> supply-chain candidate. Kill candidate if incremental effect disappears after these controls.
- Bias/quality gates: no hand-picked famous AI/ABF winners; include negative/control edges and non-events; no future customer/supplier map leakage; no threshold/window sweep; no historical Shadow fabrication; no missing=BAD/0; transaction costs required before any tradable interpretation; date/industry clustering and coverage/zero-pick tracked.
- Engineering classification: research concept/checkpoint only (Class A documentation); no runtime code, no new factor, no Worker/Production/PR promotion. Formal Core remains LOCKED. R01-R08/I01-I07 unchanged until evidence exists.
- Exact next continuation: materialize a dedicated `SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md` and checkpoint only if safe mutation is available; then SC-001 source/edge taxonomy, SC-002 Taiwan PIT relationship-source feasibility, SC-003 lag/falsification matrix, SC-004 minimal prospective schema. Do not perform outcome tests before PIT edge-vintage feasibility passes.


## B-147 — Supply-chain PIT source feasibility hardened (2026-09-26 07:43 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main and required continuity files; canonical start was B-146. Continued SC-001/SC-002 without reopening exhausted CA/recorder lanes.
- Dedicated `SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md` materialized on main.
- SC-001 source hierarchy frozen. Highest-value Taiwan official lanes are: MOPS/TWSE material-information events for cessation of business with a purchaser/supplier representing >=10% of prior-year parent-only sales/purchases; periodic annual/financial-report counterparty/concentration disclosures; issuer sustainability reports only as supporting evidence; listing-review customer-concentration rules as validation prior rather than historical edge feed.
- Edge taxonomy frozen: CUSTOMER_OF, SUPPLIER_OF, RELATED_PARTY_TRADE, MAJOR_COUNTERPARTY_STOP, CONCENTRATION_ONLY and MANAGEMENT_CLAIM. CONCENTRATION_ONLY may never synthesize a named relationship.
- SC-002 result = PARTIAL / EVENT-LANE FEASIBLE / COMPLETE GRAPH NOT YET FEASIBLE. The official >=10% cessation lane is timestampable and economically material but asymmetric: it captures sufficiently large relationship termination, not all starts/changes. Periodic reports are heterogeneous and may anonymize counterparties.
- PIT contract requires sourcePublishedAt/knownAt/effectiveFrom plus expiry/revalidation and identity-resolution status. A cessation disclosure proves the relationship/event threshold at disclosure time but does not prove original relationship start. Current maps may not be backfilled.
- Counterevidence: supplier-management disclosure can be policy-only; common AI/industry exposure is not a bilateral edge; annual-report relationships can go stale; unresolved aliases remain UNKNOWN. Historical market-wide graph backfill is NO_GO until coverage/identity completeness is measured.
- Bias/quality: no famous-chain hand picking, no future-edge leakage, no missing=no-edge/0, no outcome/alpha test, no historical Shadow fabrication, no window/threshold sweep, no Factor Zoo addition. R01-R08/I01-I07 unchanged.
- Engineering: Class A research documentation only; no runtime code, Worker, PR promotion, Production or Formal Core change.
- Exact next continuation: SC-003 preregister lag/falsification matrix (event clocks, negative controls, common-shock residualization, independent-date inference) without searching outcomes; SC-004 freeze minimal prospective edge/event schema plus coverage/identity diagnostics; only then decide if a Class-A prospective collector is justified.


## B-148 — Supply-chain SC-003/SC-004 preregistration complete (2026-09-26 07:55 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical start was B-147. A/main had concurrently advanced PVE and pattern research, which was not redone. Continued the exact supply-chain next point SC-003 -> SC-004.
- Durable research contract created: `SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md`.
- SC-003 frozen before any outcome search. T0 is the first market-actionable session after knownAt; knownAt and effectiveFrom are separate clocks. A later termination disclosure cannot backfill an unknown relationship start.
- Frozen outcome family only: D1/D3/D5/D10 residual return, D5/D10 MFE/MAE, plus the next PIT-eligible fundamental update. Any new horizon is a new registered experiment.
- Control order is frozen: market/regime -> industry/sector/breadth -> existing Residual RS + price-volume/K-line -> own revenue/fundamental -> attention/event risk -> supply-chain candidate. Loss of increment after controls = REDUNDANT.
- Negative controls are mandatory: same-industry/no-verified-edge, verified edge/no-new-event, concentration-only/no-resolved-counterparty, and matched unrelated controls. Theme/AI membership alone is not an edge.
- Independent inference unit = event/first-known date. Multiple suppliers exposed to one customer event are one common-shock cluster, not multiple independent discoveries. Report date/industry/source-family concentration and mark FRAGILE_* if one cluster drives results.
- SC-004 minimal PIT schemas frozen for SUPPLY_CHAIN_EDGE_VINTAGE, SUPPLY_CHAIN_EVENT_LEDGER and coverage receipts. Coverage/identity percentages may be computed only with explicit denominators; incomplete source universe cannot assert no-edge. Missing remains UNKNOWN.
- Collector gate: before any Class-A prospective collector, run an outcome-blind bounded source sample across TWSE/TPEx and multiple industries to measure event availability, named-edge resolution, source-family concentration and UNKNOWN rate. No forward returns may be inspected during this feasibility step.
- Bias/quality: no outcome-conditioned lag choice, no future-edge leakage, no famous AI/ABF hand-picking, no historical Shadow fabrication, no missing=0/BAD, no factor/threshold promotion; R01-R08/I01-I07 unchanged.
- Engineering: Class A research documentation only; no Worker.js, Production, Formal selection/ranking/capital/signal/push change.
- Exact next continuation: SC-005 execute the outcome-blind bounded source/identity coverage pilot with a predeclared cross-exchange/cross-industry sample; classify VERIFIED_NAMED_EDGE / CONCENTRATION_ONLY / MANAGEMENT_CLAIM / UNKNOWN and record identity-resolution + knownAt/effectiveFrom coverage. Only if coverage is operationally usable may SC-006 specify an isolated Class-A prospective collector; otherwise mark lane DATA_SOURCE_BLOCKED and move on.


## B-149 — SC-005 bounded source/identity pilot exposes named-edge gap (2026-09-26 08:14 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical start B-148. Concurrent A/main PVE/Pattern commits were observed and not redone.
- Continued SC-005 outcome-blind with a bounded TWSE/TPEx, cross-industry official/issuer-source sample. No forward return, MFE/MAE or price reaction was inspected.
- 2330 TSMC annual-report sample = CONCENTRATION_ONLY: customer concentration is disclosed but sampled counterparties are unnamed. Publication knownAt is recoverable; bilateral effectiveFrom/identity UNKNOWN.
- 6214 SYSTEX annual-report sample = CONCENTRATION_ONLY: major supplier is anonymized as Company A (30% of 2025 purchases); no customer exceeded 10% of sales. Identity was not guessed. knownAt recoverable; effectiveFrom/identity UNKNOWN.
- 5483 Sino-American Silicon Products TPEx issuer sample = MANAGEMENT_CLAIM/context only: sampled issuer material describes group/subsidiary exposure and customers generically but does not resolve a named external bilateral edge. publication clock recoverable; external identity/effectiveFrom UNKNOWN.
- Tiny descriptive result: VERIFIED_NAMED_EDGE 0/3, CONCENTRATION_ONLY 2/3, MANAGEMENT_CLAIM 1/3. This is not a population estimate and does not mean no relationships exist; it falsifies sufficiency of the sampled periodic/issuer lane for a named historical graph.
- Bias/quality: retained cross-exchange/cross-industry zero-yield; no famous-chain substitution, current-map backfill, anonymized identity inference, missing=no-edge/0, outcome conditioning or historical Shadow fabrication. R01-R08/I01-I07 unchanged.
- Engineering: dedicated receipt/research-file writes were safety-blocked; no runtime/Production/Formal change.
- Exact next continuation: SC-005B separately sample timestamped material-information >=10% counterparty cessation/event disclosures for named identity, knownAt and event/effective-clock completeness. If materially better, SC-006 may scope an isolated Class-A prospective event collector; otherwise mark Supply-Chain Lead-Lag DATA_SOURCE_BLOCKED and move on.


## B-150 — SC-005B material-information event lane resolves named identity but remains asymmetric (2026-09-26 09:14 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical start B-149. Concurrent Pattern commits were observed and not redone. Continued exact next point SC-005B; no forward return/MFE/MAE was inspected.
- Outcome-blind event-lane search found multiple Article-25-style major-counterparty cessation disclosures whose structured fields directly expose counterparty identity, disclosure timestamp, prior-year sales/purchase concentration and cessation/effective timing.
- Positive witnesses: 6270 Mirle? correction: 6270 is EDOM Technology (倍微), 2026-09-18 disclosure names Garmin Taiwan as buyer, prior-year individual sales share 19.96%, effective direct-service change 2026-10-01; 1264 Gourmet Master? correction: 1264 is Tehmag Foods (德麥), 2026-05-29 disclosure names WESTLAND DAIRY COMPANY LIMITED, individual purchase share 19.47%, cessation at end-2026-09; 6123 GrandTech names Adobe Systems Software Ireland Limited, 94% of HK subsidiary purchases / 20% consolidated, effective 2024-12-31; 6270 2024-03-06 names Synaptics, 16.96% consolidated purchases, planned stop 2024-03-31; 2019 WT Microelectronics disclosure names Texas Instruments and states ~20% purchase concentration with later termination plan.
- Counterexample: 9934 Globe Union subsidiary disclosure reports a 17% revenue customer but identifies it only as 'retail customer'; therefore Article-25/event-lane does not guarantee resolved identity. Identity must remain UNKNOWN when issuer withholds the name.
- Strong semantic advantage over periodic-report SC-005 sample: when named, event lane supplies a first-known publication clock and usually a distinct future cessation/effective date, allowing information-arrival vs economic-effective clocks to remain separate. It can therefore support prospective MAJOR_COUNTERPARTY_STOP events without inventing relationship start dates.
- Critical limitation: this is an event-triggered, thresholded and asymmetric source. It preferentially observes large relationship cessations/changes, not ordinary continuing edges, new relationship starts, sub-10% relationships, or the complete supplier/customer graph. It cannot establish a market-wide no-edge denominator.
- Feasibility decision: event lane = OPERATIONALLY_USABLE_FOR_BOUNDED_EVENT_RESEARCH, complete graph = DATA_SOURCE_BLOCKED. Do not build a general supply-chain graph or run graph-wide alpha from this source.
- Bias/quality: search was outcome-blind; zero-yield/anonymized counterexample retained; no current-map backfill, no missing=no-edge/0, no historical Shadow fabrication, no price-conditioned sampling, no lag/window change. Event-date/source-family clustering remains mandatory; transaction costs remain required before tradable interpretation. R01-R08/I01-I07 unchanged.
- Engineering: research/source feasibility only; no Worker/Production/Formal changes.
- Exact next continuation: SC-006 specify an isolated Class-A prospective MAJOR_COUNTERPARTY_STOP collector limited to official timestamped cessation/change disclosures, with raw-source receipt, named/anonymous identity state, knownAt, effectiveAt, concentration basis/percentage and coverage diagnostics. It must not claim complete graph coverage and must not affect Formal selection/ranking/monitor/push. Before implementation, verify whether an official machine-readable TWSE/TPEx/MOPS source can be isolated; if only brittle third-party search is available, keep collector proposal-only and mark SOURCE_ACCESS_BLOCKED.


## B-151 — SC-006 official-source collector gate frozen (2026-09-26 09:17 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical start B-150. Continued exact SC-006 point without reopening SC-001..005 or exhausted CA/recorder evidence lanes.
- Official-source verification: TWSE first-party documentation identifies MOPS ezSearch as a cross-market announcement search surface with market/category/date filtering and announcement-time ordering, and explicitly identifies M25 as the major-customer/supplier business-cessation category. TPEx first-party material independently confirms the >=10% principal purchaser/supplier cessation semantics.
- Positive conclusion: a first-party discoverable source universe exists for the narrow MAJOR_COUNTERPARTY_STOP event class. This materially improves over third-party search and supports a bounded prospective event-lane design.
- Counterevidence/access finding: the documented ezSearch deep link redirects to the MOPS error surface under direct non-browser retrieval in the research environment, and no documented first-party JSON/CSV/API contract for M25 was verified this run. Official discoverability therefore does NOT equal stable machine ingestion.
- SC-006 decision = PROPOSAL_READY / MACHINE_INTERFACE_UNVERIFIED. Do not implement brittle UI scraping and do not use third-party search as canonical ingestion.
- Frozen isolated Class-A collector contract, conditional on stable first-party interface: official M25/equivalent events only; raw receipt/hash where permitted; issuer market/symbol; source id/url/category; publishedAt/knownAt; effectiveAt; raw counterparty; identityResolution; concentration pct/basis; capturedAt; PIT eligibility; append-only revision/supersession; anonymous identity=UNKNOWN. Coverage percentage only with reproducible official denominator.
- Implementation gate: verify stable first-party machine-readable query/download + pagination/time semantics -> prove TWSE/TPEx coverage/reproducible denominator -> targeted named/anonymous/revision/malformed provenance tests -> only then isolated prospective Class-A implementation. Failure at interface gate => SOURCE_ACCESS_BLOCKED and move on, not UI scraping.
- Bias/quality: no outcome lookup, no historical Shadow fabrication, no current-map backfill, no missing=no-edge/0, no entity guessing, no new lag/window/threshold/factor; R01-R08/I01-I07 unchanged.
- Engineering: Class A documentation only. Dedicated research commit e2b68557b69219a7cf7e1e40c2f222c78d2cf59d. No Worker/Production/Formal/monitor/push change.
- Exact next continuation: SC-006A perform one bounded interface-discovery pass against first-party TWSE/TPEx/MOPS assets/code/history for a stable machine-readable M25/equivalent query/download contract. If verified, implement only the isolated prospective research collector with targeted+regression/invariant checks; if not verified after the bounded pass, mark SOURCE_ACCESS_BLOCKED, preserve proposal, and advance to the next unresolved canonical research priority.


## B-152 — SC-006A bounded machine-interface discovery closed SOURCE_ACCESS_BLOCKED (2026-09-26 09:17 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main; canonical start B-151. Concurrent Pattern commit aa5bdf5... was observed and not redone. Continued exact SC-006A only.
- Bounded first-party discovery checked TWSE/TPEx/MOPS public materials plus repository evidence-ingestion paths. TWSE documents ezSearch as a free cross-market announcement search surface with category/date filters and announcement-time ordering; TPEx confirms item-25 >=10% major purchaser/supplier cessation semantics.
- No stable documented first-party M25 JSON/CSV/OpenAPI contract with pagination and reproducible denominator semantics was verified. Direct human search availability is not treated as an API contract. TWSE separately documents historical/custom information-service products, increasing the risk of treating UI internals as a supported archival feed.
- Repository falsification: the codebase already uses explicit supported first-party machine endpoints for TWSE monthly revenue/attention/disposition, TPEx monthly revenue, and TWSE RWD margin/SBL. No MOPS M25 machine fetch path or archived M25 contract exists to reuse. Therefore this is source-contract absence, not generic inability to ingest official APIs.
- Decision: MAJOR_COUNTERPARTY_STOP_SOURCE_ACCESS = SOURCE_ACCESS_BLOCKED_FOR_AUTOMATED_CANONICAL_INGESTION. Preserve the frozen collector proposal but do not implement HTML scraping, hidden-endpoint coupling, or third-party canonical ingestion.
- Supply-Chain lane status = EVENT_LANE_SEMANTICALLY_FEASIBLE / AUTOMATED_SOURCE_BLOCKED / COMPLETE_GRAPH_BLOCKED. Manual bounded official-event research remains possible with provenance, but absence cannot prove a complete denominator/no-event universe.
- Bias/quality: no outcome/return/MFE/MAE lookup, no historical Shadow fabrication, no missing=no-edge/0, no current-map backfill, no entity guessing, no threshold/window/factor change. R01-R08/I01-I07 unchanged.
- Engineering: Class A research documentation only. Dedicated commit 794b990ee4a85f352170343b532a22832481cb3f. No collector/runtime/Worker/Production/Formal/monitor/push change.
- Exact next continuation: close Supply-Chain automated-source work until a documented official machine contract becomes available; advance to the next unresolved canonical priority, Execution Alpha. First re-read the latest recorder proposal/branch and current Production/readback evidence; do not infer BUY/NO-BUY from missing recorder rows. If exact-date completeness remains unresolved and Class-B implementation is still blocked/unapproved, research the next Execution Alpha evidence question that can be answered without changing shared runtime, preserving 2026-09-24 UNKNOWN.


## B-153 — Execution Alpha coverage/accounting tranche completed (2026-09-26 Asia/Taipei)
- Canonical start was B-152: Supply-Chain automated-source work was closed and Execution Alpha was next. Latest recorder/readback evidence was re-read first; 2026-09-24 BUY/NO-BUY remains UNKNOWN because exact-date completeness is still not observable and the Class-B recorder proposal is not promoted.
- Live Production was independently read back before engineering: `8.11.0-pv-shadow-v0.1-log-only`, TEST_MODE=false, KV/D1 present. No Production change followed.
- External execution literature reinforces the correct decomposition: waiting trades price improvement against execution probability/time, non-execution opportunity cost and adverse-selection risk. Taiwan TWSE order-choice/execution-quality studies likewise show aggressiveness varies with volatility/depth/investor type and relates to fill/duration/price movement.
- Therefore existing R02 BUY-only entryTimingPct remains a conditional price-improvement diagnostic, not unconditional Execution Alpha.
- Fresh Class-A branch `research/execution-alpha-coverage-v0-1-20260926` and Draft PR #104 implement pure coverage-aware accounting only. No Worker/network/storage/signal/selection/ranking/capital/push dependency.
- Frozen states preserved: BUY_OBSERVED_COMPLETE_COVERAGE, NO_BUY_OBSERVED_COMPLETE_COVERAGE, named UNKNOWN reasons, NOT_YET_MATURE. Missing recorder/monitor evidence never becomes NO_BUY.
- Diagnostics keep five dimensions separate: complete-coverage participation, conditional BUY entry improvement, BUY post-entry path, complete NO-BUY missed/avoided path, idle-capital exposure. `unconditionalExecutionAlpha` is deliberately null; no optimized composite score is authorized.
- Synthetic falsification includes a cheaper observed BUY, a missed winner, an avoided loser, an UNKNOWN recorder case and an immature plan. This prevents one-sign NO-BUY interpretation and trigger-survivorship.
- Validated research head `c9e23b01907dbeca7a130236816d56ac8db8764b`; V8 Repair `36210097574` SUCCESS; V8 Regression `36210097500` SUCCESS.
- PR #104 remains Draft / unmerged / un-deployed. Formal Core LOCKED. R01-R08 unchanged; no new factor/window/entry threshold.
- Exact next continuation: keep exact-date recorder completeness Class-B proposal frozen/unpromoted; do not reconstruct 9/24. Until prospective complete-coverage dates exist, continue Execution Alpha research only on outcome-independent accounting, benchmark semantics, cost/slippage and opportunity-cost falsification. Do not create a composite policy score or alter 15m BUY rules. When complete coverage exists, first report the five components separately by independent scan date and frozen A/B/pool/regime/liquidity strata before any policy-value conclusion.


## B-MAP-001 — Cross-chat Research Master Map established (2026-09-26 10:14 Asia/Taipei)
- Owner approved a durable quantitative research inventory/maturity dashboard accessible to all research chatrooms; chat memory is explicitly non-canonical.
- Created `RESEARCH_MASTER_MAP.md` on main as the human-readable canonical inventory/dashboard and `research/research_master_map.json` as its machine-readable companion.
- Governance updated so every research cycle/status question reads the Master Map in addition to existing governance/worklist/checkpoint. Division of authority is explicit: RESEARCH_CHECKPOINT.md = exact continuation cursor; Master Map = global inventory/maturity dashboard; dedicated research files = evidence.
- Registered 15 top-level domains and L0-L5 evidence maturity scale (0/20/40/60/80/100%). Aggregate completion percentage remains UNKNOWN until a repository-wide module reconciliation prevents double-counting sequential checkpoint IDs and unsupported precision.
- Dashboard metrics frozen: module count, counts by L0-L5, weighted maturity %, researchDebtUnits, DATA_QUALITY_BLOCKED, DATA_SOURCE_BLOCKED, WAITING_PROSPECTIVE, REDUNDANT, FALSIFIED, independent dates and prospective samples.
- Cross-chat update protocol: material research status changes update dedicated evidence + RESEARCH_CHECKPOINT + machine map; aggregate dashboard updates when counts change. Re-read SHAs before concurrent A/B writes.
- Safety: this is Class-A research governance/documentation only. No Formal factor/threshold/ranking/capital/entry/monitor/push behavior changed. Formal Core remains LOCKED.
- Exact next master-map continuation (parallel to the active research cursor, not replacing it): enumerate dedicated research/checkpoint files; normalize durable research modules; assign evidence-backed L0-L5/blocker states; publish first auditable baseline totals and research-debt figure. Do not invent a completion percentage before reconciliation.


## B-154 — Execution Alpha lot/mechanism benchmark tranche completed (2026-09-26 Asia/Taipei)
- Continued canonical Execution Alpha priority from B-153; Pattern geometry remained frozen. Concurrent Master Map governance was observed and preserved.
- External TCA evidence strengthens implementation-shortfall semantics: delayed/partial execution and unfilled opportunity cost belong in execution quality; conditional survivor fills cannot represent the whole policy.
- Taiwan-specific mechanism audit found a material benchmark-provenance gap. Current TWSE/TPEx intraday odd-lot trading is a distinct call-auction mechanism: 1–999 shares, first match 09:10, 5-second matching since 2024-12-02, separate best-five/price path and odd-lot volatility interruption. Fugle officially supports `type=oddlot` for quote/ticker/candles/trades/volumes.
- Current V8.8.1 execution recorder calls default `/intraday/quote/{symbol}` without `type=oddlot`; its bid/ask/depth/open/avgPrice therefore cannot be treated as verified odd-lot execution benchmarks.
- This matters directly to the Formal capital engine: existing tests include `firstShares=77` (pure odd-lot) and `firstShares=1273` (1000 regular + 273 odd-lot). A mixed recommendation requires separate mechanism-aware legs for execution research.
- A 2023 NTU Taiwan study on 950 listed firms documents odd-lot/regular-lot opening-price differences and different odd-lot liquidity behavior. Its 3-minute-matching sample predates the 2024 switch to 5 seconds, so 2026 effect magnitude remains UNKNOWN; mechanism non-equivalence is the durable conclusion.
- Execution denominator semantics tightened: FIRST uses frozen `firstShares`, ADD uses its own authorized quantity; second-tranche shares are not unfilled FIRST shares. REDUCE/RE-ADD likewise require separate parent-action denominators.
- Selection close is reference-only, not assumed executable. Regular opening price is executable only when regular-lot + pre-open order eligibility is proven. Preferred executable benchmark is the first fresh observed quote matching the actual lot mechanism.
- Cross-lane Trading-Frictions firewall preserved: Formal BUY signal market price is not an ACTUAL fill. Implementation-shortfall helper accepts only explicit ACTUAL or MODELED fill evidence; unsupported signal-price-as-fill fails closed.
- Draft PR #104 Class-A branch added lot-type inference, regular/odd/mixed leg decomposition, benchmark-executability guards and implementation-shortfall decomposition retaining unfilled shares in the denominator. Latest validated head `5371e62dae80164bd0fdc5c8c10b8c0c2ce54a4e`; V8 Repair `36211167568` SUCCESS; V8 Regression `36211167625` SUCCESS.
- PR #104 remains Draft / unmerged / un-deployed and has diverged from main (20 commits behind at checkpoint read). Green CI is research-branch evidence, not merge readiness.
- Two independent Execution Alpha completeness gates now exist: (1) exact-date event/monitor completeness for BUY vs NO-BUY truth; (2) lot/mechanism benchmark completeness for executable-price truth. 2026-09-24 remains UNKNOWN.
- No Production/Worker/runtime/storage/signal/selection/ranking/capital/push change. No R09. Formal Core LOCKED.
- Exact next continuation: keep both Class-B gaps unpromoted. Continue outcome-independent Execution Alpha research on benchmark aggregation, partial-fill/cancel-replace semantics, lot-leg aggregation, cost/slippage and idle-capital opportunity-cost falsification. Do not use regular-lot quotes to score odd-lot/mixed-lot plans. When prospective complete coverage eventually exists, report the five components separately by independent scan date and frozen A/B/pool/regime/liquidity/lot-mechanism strata before any policy-value conclusion. No composite score or 15m BUY-rule change.


## B-MAP-002 — Mandatory falsified-research optimization bridge + first auditable baseline (2026-09-26 10:22 Asia/Taipei)
- Owner directive is now durable governance: research exists to improve the real after-market selection system. When a finding survives the applicable positive evidence + explicit counterevidence/alternative-mechanism, PIT/no-look-ahead, prospective Shadow/OOS/holdout, independent-date/date-cluster, regime/industry concentration, redundancy/incremental-value, transaction-cost/slippage, coverage/zero-pick and overfit/Factor-Zoo gates, and could improve Formal after-market selection, the research agent MUST proactively surface a FORMAL_OPTIMIZATION_CANDIDATE for owner review.
- This is a proposal obligation, not an auto-promotion path. Formal Core remains LOCKED; any Class-B/Class-C implementation/merge/deploy still requires explicit owner approval.
- Governance vocabulary frozen: DISCOVERY -> FALSIFICATION_IN_PROGRESS -> EVIDENCE_READY -> FORMAL_OPTIMIZATION_CANDIDATE, with REJECTED_OR_REDUNDANT for falsified/non-incremental/fragile/costly ideas.
- Every optimization candidate must state exact Formal behavior change, expected benefit, downside/failure modes, sample/period/regimes, protected invariants, rollback, and Class B/C classification.
- Master Map v0.2 first partial auditable baseline published after reconciling durable dedicated lanes rather than counting sequential checkpoint IDs as separate topics: 15 domains, 16 registered modules, L0/L1/L2/L3/L4/L5 = 0/0/10/5/1/0, registered-module maturity 48.8%, research debt 8.2 units, DATA_QUALITY_BLOCKED 6, DATA_SOURCE_BLOCKED 3, WAITING_PROSPECTIVE 1, FORMAL_OPTIMIZATION_CANDIDATES 0.
- Interpretation guard: 48.8% is maturity of the currently reconciled registered modules, NOT percent of all possible market knowledge. Inventory reconciliation remains incomplete; new independently falsifiable modules may change numerator/denominator.
- Concurrent B-154 Execution Alpha progress was re-read and preserved before this write. Execution Alpha remains data-quality gated; it is not an optimization-ready Formal candidate.
- Exact next master-map continuation (parallel governance task): reconcile remaining trend/momentum/reversal, volatility-regime, institutional/crowding, macro/cross-market and independently falsifiable submodules; avoid count inflation. Each lane must maintain optimization-candidate status under the mandatory bridge.
- Canonical active research continuation remains B-154's Execution Alpha exact-next point unless a later concurrent checkpoint supersedes it.


## B-155 — Execution Alpha lifecycle/aggregation falsification deepened (2026-09-26 11:15 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint/main and observed concurrent B-MAP-002 plus DL/PVE commits before continuing B-154 exact-next. No completed lane was restarted.
- EA-018: mixed regular/odd-lot parent actions must aggregate NTD shortfall by decision-notional weight, not equal-weight leg percentages. Parent result is valid only when every required leg has mechanism-matched benchmark provenance and complete execution/non-execution coverage; a valid regular leg cannot impute a missing odd-lot leg.
- EA-019: partial fill/cancel/replace requires parent-action lifecycle identity (INTENT -> SUBMITTED -> PARTIAL_FILL* -> CANCEL/REPLACE* -> FINAL_FILLED/FINAL_UNFILLED). Formal signal logs remain SIGNAL evidence, not broker fill evidence. Actual-fill implementation shortfall remains DATA_QUALITY_BLOCKED without order/fill lifecycle provenance.
- EA-020: idle-capital opportunity cost cannot assume zero cash return or automatic redeployment. Stock opportunity path, cash benchmark, actual portfolio capacity/redeployment and capital utilization must remain separate scenarios/evidence.
- EA-021 freezes the first falsifiable optimization bridge: do NOT jump to "loosen BUY". A Formal relaxation becomes a candidate only if complete-coverage MISSED_UPSIDE persistently exceeds AVOIDANCE_BENEFIT after costs while conditional BUY price improvement is insufficient, across independent dates/regimes and frozen A/B/pool/liquidity/lot strata. If avoidance offsets misses or effects cluster by strategy/regime, universal relaxation is rejected and interaction-specific research is required.
- Positive evidence: existing Class-A diagnostic and implementation-shortfall decomposition can represent BUY, complete NO-BUY, UNKNOWN, unfilled opportunity cost and mechanism-aware lot legs without altering Formal behavior.
- Counterevidence/limitations: exact-date BUY/NO-BUY completeness remains unobservable historically; odd-lot executable benchmark path is not recorded by current regular-lot recorder; actual broker fills/order lifecycle are absent; portfolio redeployment evidence is absent. Therefore no policy-value estimate or Formal optimization candidate is authorized yet.
- Bias/quality: explicitly guards trigger survivorship, mechanism mismatch, partial-fill denominator error, equal-weight leg bias, idle-cash assumption, date/regime/strategy clustering, costs/slippage, multiple horizons and historical Shadow fabrication. 2026-09-24 remains UNKNOWN.
- R01-R08/I01-I07: no Formal score/factor/threshold/ranking change; R02 semantics strengthened from conditional BUY timing toward coverage-aware execution policy decomposition. No new Formal factor.
- Engineering classification: Class A research documentation only this tranche. Main research commit c757f3ec4862f7ab9b57ef04da113128b9d64e94. Existing Draft PR #104 remains unmerged/un-deployed; latest validated research head remains 5371e62dae80164bd0fdc5c8c10b8c0c2ce54a4e with prior Repair/Regression success. No Worker/Production/monitor/push change.
- Optimization bridge status: Execution Alpha = FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY; FORMAL_OPTIMIZATION_CANDIDATE count unchanged.
- Exact next continuation: continue long-batch outcome-independent Execution Alpha by specifying a prospective parent-action/lot-leg coverage manifest and synthetic aggregation/cancel-replace falsification tests on the isolated Class-A branch. Then audit whether existing prospective recorder fields can satisfy any manifest fields without shared-runtime change. Any missing shared-runtime evidence becomes a bounded Class-B proposal only, not Production promotion. After that, if still data-gated, move to the next unresolved research priority rather than tuning BUY from incomplete evidence.


## B-156 — Execution Alpha manifest audit (2026-09-26 12:12 Asia/Taipei)
- Fresh-read canonical B-155; concurrent trend/R06 commits observed and not redone.
- Isolated Class-A branch research/execution-alpha-manifest-v0-1-20260926 now freezes parent-action/lot-leg prospective evidence requirements; commit 26385f2d9013eb07cf8cdf84dc155c489952f62a.
- Falsification cases cover mechanism mismatch, mixed-lot notional weighting, missing odd-lot evidence, partial fill/cancel-replace quantity closure, duplicate fills, SIGNAL-vs-ACTUAL misuse, incomplete-date zero rows, shared-cash double counting, and ACTUAL/MODELED mixing.
- Recorder audit: current V8.8 patches provide descriptive event clocks, symbol, quote freshness, formal decision context and regular-lot open/avg/bid/ask/depth. They do not provide exact-date completeness denominator, odd-lot benchmark, parent order identity, broker fill/cancel/replace lifecycle, actual costs, or portfolio redeployment/capacity.
- Counterevidence: current data cannot prove complete BUY/NO-BUY policy value, actual implementation shortfall, odd-lot execution quality, or monetary idle-capital alpha. Missing remains UNKNOWN.
- Execution Alpha stays FALSIFICATION_IN_PROGRESS / DATA_QUALITY_BLOCKED / NOT_OPTIMIZATION_READY; no Formal optimization candidate. Formal Core LOCKED.
- Direct contents writes for additional test/readiness artifacts were safety-blocked; no unsafe workaround or Production mutation used. Shared-runtime capture remains Class-B proposal-only.
- Exact next: park data-gated Execution Alpha and advance after fresh checkpoint read to the next unresolved canonical priority, preferring unreconciled Master Map domains (volatility-regime, institutional/crowding, macro/cross-market) unless superseded. Keep EA-021 as future optimization falsification gate when prospective complete coverage exists.


## B-157 — Volatility Regime lane opened and falsification protocol frozen (2026-09-26 12:20 Asia/Taipei)
- Fresh-read canonical B-156, governance/worklist/Master Map/main. Execution Alpha was correctly parked DATA_QUALITY_BLOCKED; no incomplete BUY/NO-BUY inference was resumed.
- Opened dedicated VOLATILITY_REGIME_RESEARCH.md and advanced VR-001..VR-012.
- Core decomposition: volatility LEVEL, CHANGE/acceleration, SHOCK, IMPLIED and overnight/gap clocks are distinct mechanisms. High level != rising shock; implied risk != realized risk. Do not collapse into one score.
- Redundancy gate: every candidate must add beyond existing ATR/realized-vol context, trend/residual RS, breadth/liquidity and overheat/lateStage. Monotone ATR/drawdown repackaging is REJECTED_OR_REDUNDANT.
- Targets separated: D1/D3/D5 residual return, downside/MAE/drawdown, path violence/realized range, selection count/zero-pick and later execution participation when coverage exists. Volatility can be useful for risk without directional alpha.
- Falsification frozen: date-shift placebo, within-regime shuffle, ATR-only baseline, market-return baseline, remove top crisis dates, independent-date/regime checks, TWSE/TPEx coverage asymmetry, PIT clock/source continuity. Missing/stale history remains UNKNOWN.
- Interaction hypothesis frozen before outcomes: market-vol x stock-relative-vol x trend x A/B. Universal high-vol penalty is rejected if harm is conditional; calm-market high-relative-vol may instead identify momentum leadership. This protects against over-broad vetoes.
- Crisis contamination guard requires independent dates, top-1/top-3 date contribution, with/without extremes, median+mean, A/B/market counts and UNKNOWN counts.
- TAIFEX implied-vol candidates are downstream incremental tests after realized-vol/trend/breadth/global controls; no combined regime score.
- Optimization bridge: possible future context/risk annotation or veto/throttle only if incremental downside/path evidence survives redundancy, crisis removal, PIT/OOS and independent dates. Current status FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY; no Formal candidate.
- Engineering: Class A research documentation only. Commits cee2f847b055639fe928951d306ad46ff4811bc8 and 980fa3af83581b360b10299d919614707054ba3f. No Worker/Production/Formal/monitor/push change.
- R01-R08/I01-I07: no new Formal factor; strengthens regime/redundancy/PIT controls and protects against Factor-Zoo volatility duplication.
- Exact next continuation: continue long-batch Volatility Regime with a minimal research-only feature/receipt schema and synthetic redundancy/crisis-cluster falsification harness. Audit existing history/ATR fields and stale-history guard availability before using outcomes. If trustworthy multi-date PIT history is not available, mark evidence gate DATA_QUALITY_BLOCKED and move automatically to institutional/crowding research rather than tuning thresholds.


## B-158 — Institutional/Crowding lane opened after volatility data-gate audit (2026-09-26 12:28 Asia/Taipei)
- Continued beyond B-157 without waiting for another user prompt. Existing outcome helper can compute post-scan paths, but historical D1 bar continuity remains subject to the known stale-history/session gate; therefore Volatility Regime outcome testing was not started from unproven history. No threshold tuning performed.
- Opened INSTITUTIONAL_CROWDING_RESEARCH.md and advanced IC-001..IC-012.
- Mechanism separation frozen: foreign/trust/dealer, margin, SBL and derivatives exposure are not interchangeable; FLOW vs POSITION/STOCK are separate. Motive (conviction/hedge/passive/arbitrage) remains UNKNOWN unless evidenced.
- Existing official-data audit found useful infrastructure but incomplete parity: TWSE/TPEx institutional sync exists; TWSE margin/SBL research exists; TPEx SBL remains UNKNOWN in V8.7.11; one-day SBL explicitly cannot masquerade as 5/20/60-day flow.
- Persistence guard: N-day consecutive buying/selling requires immediately preceding official trading sessions plus source completeness. Missing session => UNKNOWN, never false/0.
- Frozen candidate mechanisms: persistent same-actor flow, actor divergence, price-flow divergence, crowding/exit risk, margin/SBL pressure, and joint cash-futures exposure. No universal foreign-buy threshold.
- Redundancy order requires price trend/residual RS, volume/liquidity, existing Formal institutional condition and regime/breadth before a new institutional candidate. If flow adds nothing beyond price-volume or existing rule, reject as redundant.
- Counterevidence controls: actor shuffle, date-shift placebo, passive/index-rebalance contamination, TWSE-vs-TPEx stratification, crisis-date removal, size/liquidity normalization provenance and independent-date aggregation.
- New key hypothesis: price reaction to institutional flow may be more informative than raw flow magnitude; BUY+DOWN or SELL+UP are disagreement/resilience states, not inferred motives. Crowding is explicitly two-sided and may predict downside/reversal rather than continuation.
- Optimization bridge: no candidate yet. A future change must beat the existing Formal institutional rule incrementally and survive source parity/passive-flow/redundancy/date-cluster/cost gates. Current status FALSIFICATION_IN_PROGRESS / DATA_FEASIBILITY_PARTIAL / NOT_OPTIMIZATION_READY.
- Engineering: Class A research documentation only. Commits 201f5f18222e6e083c3dfbd07255e46247d98a53 and 3295037b999edfe59bc4090f4d6cffeef83a9c61. No Worker/Production/Formal/monitor/push change.
- Exact next continuation: perform a bounded official-data feasibility audit for contiguous TWSE+TPEx actor-flow sessions using the existing institution sync/storage contract, without outcome lookup. If parity/continuity can be proven, freeze a prospective receipt schema and synthetic missing-session tests; if not, mark the exact market/source gap UNKNOWN/DATA_QUALITY_BLOCKED and move automatically to Macro/Cross-Market regime transmission. Do not create a new institutional score.


## B-159 — Macro/Cross-Market transmission lane opened after institutional parity gate (2026-09-26 12:35 Asia/Taipei)
- Continued automatically from B-158. Institutional/crowding outcome testing is parked until contiguous official-session parity is proven; no one-day flow was promoted into a multi-day signal.
- Opened MACRO_CROSS_MARKET_RESEARCH.md and advanced MC-001..MC-011.
- Core PIT clock rule: for Taiwan after-market scan t, prior U.S./Europe close and same-day Japan/Korea close can be known; the U.S. session occurring after Taiwan close is future information and cannot enter t after-market selection. Taiwan night futures after scan are likewise later information for t selection.
- Calendar guard: foreignSessionClose -> knownAtTaipei -> firstEligibleTaiwanDecision. Foreign holidays remain STALE_NO_NEW_SESSION; Taiwan holidays require explicit accumulated-information windows, not calendar-day forward fill.
- Candidate mechanisms separated: global equity/tech relative moves, Japan/Korea, FX/DXY, oil/rates and residual Taiwan sensitivity. Sector interaction is pre-registered; no uniform global-risk score.
- Scheduled event presence, expectation, realized release and post-release market reaction are separate clocks. Realized CPI/Fed/NFP surprise cannot be used before release.
- Falsification: date-shift placebo, Taiwan-only and sector baselines, remove largest global shocks, timezone/holiday audit, raw-vs-residual global feature, independent dates, and gap-vs-open-to-close decomposition.
- Key anti-false-alpha rule: global effects must be residualized against Taiwan market/sector and existing stock RS/beta context before being interpreted as stock-selection information. Gap-only effects are execution/risk context, not necessarily ranking alpha.
- Data gate: notification/radar text is not automatically a durable research dataset. Before outcomes, audit whether Global Radar observations are stored with source/session/knownAt provenance. If absent, define prospective receipt schema; no historical web reconstruction or fabricated Shadow.
- Optimization bridge: possible context/tie-break/risk candidate only after incremental non-crisis independent-date evidence; blanket global veto is not authorized. Current status FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.
- Engineering: Class A research documentation only. Commits 81633f9eed9f1d25be4e5823b6e959b6867186f0 and c58dbcad9c8599bdf04532d706f7328706119334. No Worker/Production/Formal/monitor/push change.
- Exact next continuation: audit repository/runtime research storage for durable global-market receipts with sessionDate/knownAt provenance. If absent, freeze a prospective Class-A receipt schema and synthetic timezone/holiday tests; if shared runtime capture is required, proposal-only. Then continue to remaining Master Map reconciliation/next evidence-ready lane without waiting for another prompt. Any finding that survives falsification and can improve after-market selection must be surfaced as FORMAL_OPTIMIZATION_CANDIDATE.


## B-160 — Macro/Cross-Market provenance gate audited; prospective receipt contract frozen (2026-09-26 12:50 Asia/Taipei)
- Fresh-read canonical start B-159; governance/worklist/Master Map/main were re-read first. No reopening of parked Execution Alpha/Volatility/Institutional lanes and no duplication of A's concurrent work.
- Repository bounded audit searched Global Radar/global/DXY/NASDAQ and sessionDate/knownAt evidence. Research/notification references exist, but no durable historical global-market observation dataset was proven whose rows independently preserve sourceSessionDate + capturedAt/knownAtTaipei + firstEligibleTaiwanDecision.
- This is a provenance/data-quality conclusion, not a claim that global observations never existed outside the repo. Notification prose cannot be reverse-engineered into historical features. HISTORICAL_GLOBAL_RECEIPT = UNKNOWN / DATA_QUALITY_BLOCKED.
- MC-012..MC-015 added to MACRO_CROSS_MARKET_RESEARCH.md. Prospective receipt schema freezes sourceMarket/instrument/sourceSessionDate/sourceTimezone/value/unit/source/capturedAt/knownAtTaipei/firstEligibleTaiwanDecision/stale/revision/PIT/missing semantics.
- Synthetic falsification matrix frozen before outcomes: prior-US eligible; post-Taiwan-close US future/ineligible; same-day Japan/Korea eligible only when captured before decision; foreign holiday STALE_NO_NEW_SESSION; Taiwan-holiday multi-session accumulation explicit; post-scan macro release future; revisions retain original vintage; capture failure UNKNOWN; DST uses exchange session/timezone; source disagreement cannot be resolved ex post for convenience.
- Implementation classification: isolated research receipt capture can be Class A only if it avoids shared Formal runtime/schedule/storage paths. Shared Cron/D1/fetch-routing capture is Class B proposal-first. No implementation/deploy was performed.
- Optimization bridge: Macro/Cross-Market remains FALSIFICATION_IN_PROGRESS / DATA_QUALITY_BLOCKED / NOT_OPTIMIZATION_READY. No blanket global veto or score. Any future candidate must add beyond Taiwan market/sector/RS-beta/regime controls and survive crisis removal, independent-date and PIT/OOS gates.
- Master Map reconciled Macro/Cross-Market as an independent module: 18 registered modules; L0/L1/L2/L3/L4/L5 = 0/0/12/5/1/0; registered-module maturity 47.8%; research debt 9.4; DATA_QUALITY_BLOCKED 7. The lower percentage reflects a larger audited denominator, not loss of knowledge.
- Durable commits this tranche: af26712700d0da2d8847a938644dd82b452395dc (macro contract), 1709516c950b93458e74e14c85a98e71e1e8a6d5 (machine map), 0a1bbee1334441033ec6616778707874ecc6f4e5 (human Master Map).
- R01-R08/I01-I07: explicitly strengthens look-ahead, market-source, holiday/timezone, crisis/date-cluster, redundancy and UNKNOWN controls; no historical Shadow fabrication and no outcome lookup.
- Engineering: Class A documentation/reconciliation only. No Worker/Production/Formal selection/ranking/capital/monitor/push change. Formal Core LOCKED.
- Exact next continuation: keep Macro outcome testing parked until prospective PIT receipts exist. Continue Master Map reconciliation to the next independently falsifiable unresolved module(s), prioritizing domains not yet separately registered rather than splitting checkpoint IDs. Audit whether any evidence-ready lane can advance without new shared-runtime data; if none, define prospective research-only evidence contracts and mark precise blockers. Any finding surviving mandatory falsification and capable of improving after-market selection must be surfaced as FORMAL_OPTIMIZATION_CANDIDATE.


## B-161 — HISTORY_SOURCE_REVALIDATION_V2.1 falsification strengthened (2026-09-26 12:49 Asia/Taipei)
- Continued the owner-requested after-market optimization bridge from the B-130 stale-history defect without changing Formal Core.
- Draft research PR #105 `Research: history source revalidation v2 falsification` is Class-A research only. Branch `research/history-source-revalidation-v2-20260926`; latest research head observed `9f9eb83109cfadb865296f314b92118cc6d3bf38`.
- Initial V2 falsified PR #100's strict market-session continuity as a final admission rule: TWSE 8422 and TPEx 5314 verified suspension/no-trade gaps can be legitimate. Market-session mismatch is therefore only a suspicion/refetch trigger, not automatic rejection.
- V2 also freezes explicit Fugle historical `adjusted=false`, fail-closed provider failure, raw bar-presence semantics before Formal price/security filters, and the B-130 repair path. A sub-NT$10 traded row remains real bar presence and cannot be erased by `MIN_CLOSE_PRICE`.
- New V2.1 counterexample: a freshly fetched provider series can still contain >=60 ordered bars while silently missing one recent official traded session; naive fresh-response acceptance would shift the rolling window and can alter MA/ATR/platform/volume features.
- V2.1 adds bounded official-gap reconciliation. For market-session dates missing from the fresh provider's required rolling window, a COMPLETE official raw daily receipt is required. Official traded row present => `FRESH_PROVIDER_MISSING_OFFICIAL_BAR` / DATA_INCOMPLETE. Complete official source with no actual traded row => legitimate symbol-session gap. Missing/incomplete official source => UNKNOWN. No stale fallback.
- Operational cost direction is bounded: healthy exact-continuity caches remain zero-call fast path; suspicious symbols need one provider refetch; official gap checks can be deduplicated by (exchange,date) because each official daily endpoint is market-wide, not per-symbol. A future prospective compact raw-presence ledger could reduce repeated gap calls, but any shared runtime/storage implementation is Class B proposal-first.
- Executable evidence: Research History Source Revalidation V2 run 36219186997 SUCCESS; V8 Regression run 36219187015 SUCCESS; V8 Repair run 36219186930 SUCCESS. Dedicated falsification tests include B-130 stale repair, TWSE/TPEx legal-gap false-reject avoidance, provider failure fail-closed, explicit raw price semantics, low-price presence guard, fresh-provider missing-official-bar rejection, legitimate no-trade acceptance, and incomplete-official-proof UNKNOWN.
- Historical OPEN omission from cached warmup was separately checked and is not currently a proven Formal defect: existing Formal upper-shadow logic uses the target day's official OPEN appended by updateMarketState; rolling MA/ATR/platform/volume features do not require prior-day OPEN. Status for that proposed issue = REJECTED_OR_REDUNDANT.
- Optimization bridge status: HISTORY_SOURCE_REVALIDATION_V2.1 = FALSIFICATION_IN_PROGRESS / STRONG_ENGINEERING_EVIDENCE / NOT_YET_FORMAL_OPTIMIZATION_CANDIDATE. Remaining gates before promotion: quantify suspicious-symbol/gap-date incidence and worst-case call budget; define source-completeness receipts and rollback/observability; prove integration against the live history-seed state machine; prove clean-input Formal output invariance; keep corporate-action price-continuity semantics separate.
- Formal A/B definitions, ranking, 3+3/Top6, thresholds, capital, BUY/ADD/REDUCE, monitoring and push remain unchanged. PR #100 remains unsafe as a final market-session-only design and must not be promoted in that form. PR #105 remains Draft/unmerged/un-deployed.
- Exact next continuation for this lane: build a bounded operational-cost/coverage model from the existing history seed batch/schedule, freeze a minimal gap-receipt storage/read contract without implementation, and stress worst-case stale/gap scenarios. Promote to `EVIDENCE_READY` only if the design remains bounded and fail-closed; surface `FORMAL_OPTIMIZATION_CANDIDATE` only after all applicable gates pass.


## B-162 — First evidence-backed Formal optimization candidate registered: HISTORY_SOURCE_REVALIDATION_V2.3 (2026-09-26 12:49 Asia/Taipei)
- Continued B-161 through bounded operational-cost and repeat-gap falsification without modifying Worker/Production/Formal Core.
- V2.2 froze the existing seed envelope: 17:00-17:59, max 6 provider history fetches per minute => theoretical 360 provider calls in the one-hour seed window. Suspicious symbols must reuse the existing seed queue; no parallel emergency warmup. Overflow remains pending/UNKNOWN and may not fall back to stale history.
- Official gap verification is deduplicated by (exchange,date). One full-market official date receipt can serve all suspicious symbols on that exchange/date. A prospective raw-presence ledger can reduce covered gap-date network calls to zero, but shared runtime/storage implementation is Class B proposal-first.
- V2.3 falsified a repeated-cost failure mode in V2.1: a legitimate no-trade/suspension gap inside the rolling 60-actual-bar window would otherwise trigger provider refetch repeatedly until the gap rolled out. Reusable COMPLETE official traded=false gap receipts now permit cache fast-path validation without repeated refetch.
- Gap-ledger semantics: COMPLETE official traded=false => explained no-trade gap; COMPLETE official traded=true => CACHE_MISSING_OFFICIAL_BAR / refetch; missing/incomplete receipt => REVALIDATE/UNKNOWN; provider bar outside market-session proof => UNKNOWN source/calendar conflict.
- Synthetic cost tests retain explicit worst-case failure: 2,000 suspicious symbols exceed the one-hour provider envelope by 1,640 calls and must remain pending/UNKNOWN rather than silently enter selection.
- Executable evidence for the latest V2.3 branch head is green: Research History Source Revalidation V2 run 36219439507 SUCCESS; V8 Repair run 36219439522 SUCCESS; V8 Regression run 36219439485 SUCCESS. Earlier V2.1 green runs are retained as prior evidence.
- The research note on Draft PR #105 has been promoted to `FORMAL_OPTIMIZATION_CANDIDATE / CLASS-B IMPLEMENTATION REQUIRES OWNER APPROVAL`. PR #105 remains Draft, unmerged and un-deployed.
- Exact proposed Formal behavior change is data admission/repair only: only freshness/source-validated histories may reach after-market feature construction; suspicious histories are revalidated; unresolved evidence fails closed; verified no-trade gaps remain eligible. No A/B definition, ranking, thresholds, Top6/3+3, capital, BUY/ADD/REDUCE, monitoring, signal or push logic changes.
- Expected benefit: prevent B-130-class stale-history false eligibility while avoiding PR #100-class false rejection of legitimate TWSE/TPEx symbol gaps; improve auditability of MA/ATR/platform/volume features.
- Retained downsides/unknowns: live suspicious-symbol incidence is UNKNOWN; severe blast radius can reduce same-day coverage; official gap-proof storage/read integration is shared runtime; corporate-action price continuity remains a separate prerequisite.
- Rollback/protected invariants are frozen in the candidate note. A future Class-B implementation must prove clean-input Formal output invariance and may only change admission where data integrity differs.
- Master Map updated without adding a fake new knowledge domain/module: formalOptimizationCandidates 0 -> 1 and candidate registry now names HISTORY_SOURCE_REVALIDATION_V2_3. Human Master Map also surfaces the candidate. Durable main commits: 1a6d898f79d58ea009fac0f9bc9b9be797e9c7a3 (machine map) and 3802f6f5e473b65ec86d605aa38e187cc39dc81f (human map).
- Formal Core remains LOCKED. No merge/deploy is authorized by this promotion.
- Owner decision boundary: this candidate is now mature enough for explicit Class-B implementation/integration review. If owner approval is not given, keep PR #105 research-only and continue other research lanes; do not silently promote.


## B-163 — Volatility-regime reconciliation (2026-09-26 13:13 Asia/Taipei)
- Fresh-read start B-162.
- Registered VOLATILITY_REGIME_CONTEXT at L2 / DATA_QUALITY_BLOCKED.
- Required tests: LEVEL/CHANGE/SHOCK/IMPLIED separation; ATR/trend/breadth/liquidity redundancy; market-vol versus stock-vol interaction; crisis-date removal; independent dates; PIT close clocks; separate TAIFEX provenance.
- Counterevidence: blanket high-vol penalties can suppress calm-market momentum leaders; volatility can duplicate lateStage/overheat; crisis clusters can create false effects. No volatility optimization is ready.
- Realized-vol outcomes require continuity-proven PIT histories; missing evidence remains UNKNOWN.
- Master Map now has 19 modules; maturity 47.4%; research debt 10.0; DATA_QUALITY_BLOCKED 8; optimization candidates 1.
- Exact next: reconcile the next unresolved independent module.


## B-164 — PriorityScore calibration falsification (2026-09-26 17:13 Asia/Taipei)
- Fresh-read start B-163. Formal priorityScore weights: setup 28%, sector 14%, institutional 16%, fundamental 14%, market-relative RS 14%, RR 14%.
- Ranking uses rewardPerRisk first, then priorityScore/setup/sector/RS. Capital after selection is approximately priorityScore-proportional, subject to deployment ratios, 35% single-name cap and rounding. Score calibration therefore directly affects sizing.
- Positive hypothesis: higher PIT score within frozen scan dates should monotonically improve forward return and/or MFE/MAE/stop outcomes enough to justify larger weights.
- Countertests: non-monotone/inverted-U; date/sector/regime concentration; cap/rounding erases differences; RR dominates selection; component redundancy/double counting; high score worsens downside; benefit disappears after costs.
- Inference unit is scanDate. Require within-date ranking/de-meaning, date-cluster/LODO, purged holdout, regime/industry strata, monotonicity/downside, and preregistered sizing comparisons: current-score vs equal-capital vs equal-planned-stop-risk.
- Historical firewall: never recompute old score with current code and call it historical. Only PIT archived score with definition/version provenance is eligible; otherwise UNKNOWN.
- Current Formal plan/trade-journal paths preserve score prospectively, but complete historical Shadow preservation of score plus comparator tuple was not proven. Status FALSIFICATION_IN_PROGRESS / DATA_QUALITY_BLOCKED / NOT_OPTIMIZATION_READY.
- Optimization bridge is two-sided and Class C. Neither strengthening nor reducing score-based sizing is authorized before falsification/readiness gates pass.
- Formal Core LOCKED; no runtime behavior changed.
- Exact next: register PRIORITY_SCORE_CALIBRATION in Master Map; audit prospective archive start/version and mature independent scan dates with PIT score+allocation+outcomes; below readiness => WAITING_PROSPECTIVE.


## B-165 — HISTORY_SOURCE_REVALIDATION_V2.3 deployed (2026-09-26 17:40 Asia/Taipei)
- Owner explicitly approved this Class-B optimization.
- Production version: `8.12.0-history-source-revalidation-v2-3`; history seed schema: `full-market-v4-history-source-revalidation`.
- Scope is data admission/repair only. A/B formulas, ranking, Top6/3+3, thresholds, capital, BUY/ADD/REDUCE, monitoring, signal and push logic were preserved.
- Integration falsification found three compatibility issues before release: a stale patch anchor, an old test fixture that fabricated weekend bars, and an older Aideen test that hard-locked the runtime to V8.11. All were corrected without weakening Production history validation.
- Final Regression run 36233428044 = SUCCESS: build, syntax/offline behavior, read-only production preflight and latest after-market diagnostic all passed.
- Final Cloudflare Deploy run 36233428004 = SUCCESS: pre-deploy V8.11 Worker/Cron backup verified, version guard passed, code deploy passed, 23:35 Cron preserved, deployed version/configuration readback passed, rollback not triggered.
- Runtime readback verified `8.12.0-history-source-revalidation-v2-3`; existing KV/D1 bindings and monitoring configuration were preserved.
- V8.12 contract: Formal strategy markers frozen; source-admission guard present; missing official gap proof fails closed; raw official bar presence is evaluated before Formal filters.
- Engineering status: `DEPLOYED_AWAITING_FIRST_LIVE_TRADING_DAY`. Deployment success proves integration, not trading alpha or realized return improvement.
- First prospective live operational validation: 2026-09-29. Inspect the 17:00-17:59 history seed first, then the 23:35 after-market scan; measure usable/unusable histories, UNKNOWN reasons, verified no-trade gaps, provider refetches and any overflow. No outcome-driven threshold tuning.


## B-166 — PriorityScore Production semantics corrected; V8.13 provenance deployed (2026-09-26 18:00 Asia/Taipei)
- Continued B-164 by auditing the actual deterministic deployment patch chain rather than root `Worker.js` alone.
- Important correction to B-164: the deployed Formal comparator is NOT rewardPerRisk-first. V7.5.30 changes the runtime order to post-consensus `priorityScore` first, raw `rewardPerRisk` second, `marketConsensusScore` third, then `setupQuality`, `sectorFlow`, `relativeStrength`. Root baseline Worker had stale pre-patch ordering and is not authoritative for deployed semantics.
- V7.5.30 also overlays market consensus after hard eligibility: >=2 independent sources are required before bonus; bonus is capped at +7; the post-bonus `priorityScore` is what Formal ranking sees. Therefore future calibration must separate the base 28/14/16/14/14/14 score mechanism from the market-consensus contribution.
- PIT audit confirmed selected Formal trade-journal rows preserve score/allocation fields, but existing research snapshots dropped PriorityScore. Historical Shadow score calibration would therefore be selection-biased and is prohibited; old scores may not be recomputed with current code and relabeled as historical PIT evidence.
- V8.13.0 `8.13.0-priority-score-provenance-shadow` was implemented as Class A research-only provenance. Existing research snapshots now preserve post-consensus priorityScore, raw rewardPerRisk, rounded rewardRisk, marketConsensusScore, marketConsensusSources, marketConsensusBonus, setupQuality, sectorFlow, relativeStrength, and frozen definition/comparator identities.
- No Formal formula, comparator, threshold, quota, capital allocation, BUY/ADD/REDUCE, monitoring, signal or push behavior was changed by V8.13.
- PR #110 merged successfully. PR validation: V8 Regression run 36234321039 SUCCESS; V8 Repair CI run 36234321046 SUCCESS.
- Production main validation: V8 Regression run 36234370697 SUCCESS; Cloudflare Deploy run 36234370701 SUCCESS.
- Deploy guard evidence: V8.12 production backup verified; version guard accepted V8.12 -> V8.13; code deployment succeeded; 23:35 after-market Cron and existing configuration were preserved; deployed version readback observed `8.13.0-priority-score-provenance-shadow`; rollback was not triggered.
- Production research readback also succeeded on expected V8.13 deployment. Existing Shadow remains only 62 rows / 2 archived dates with research integrity DATA_QUALITY_BLOCKED; no historical evidence was fabricated.
- PRIORITY_SCORE_CALIBRATION is registered at L2 / WAITING_PROSPECTIVE / NOT_OPTIMIZATION_READY. It is NOT a FORMAL_OPTIMIZATION_CANDIDATE.
- First valid prospective PriorityScore provenance can begin with the first post-deploy Formal/Shadow after-market scan, expected 2026-09-29. The first descriptive calibration table still requires >=20 clean independent scan dates plus mature outcomes; this threshold is only descriptive readiness, not Formal-promotion evidence.
- Frozen future comparisons: within-date score rank vs D1/D3/D5/MFE/MAE/stop-first; current score-proportional sizing vs equal-capital vs equal-planned-stop-risk; control for raw RR and market-consensus contribution; base score vs consensus overlay; date-cluster/LODO; sector/regime strata; common-support/coverage; transaction-cost sensitivity.
- Formal Core remains LOCKED. Neither strengthening nor weakening PriorityScore weights/sizing is authorized before falsification matures.


## B-166 — V8.13 PriorityScore provenance deployed; B-164 runtime-order correction (2026-09-26 17:59 Asia/Taipei)
- Continued B-164 after fresh Production patch-chain audit. Important correction: B-164's statement that Formal ranking was `rewardPerRisk -> priorityScore -> setup/sector/RS` reflected baseline `Worker.js`, not the deployed deterministic patch chain.
- Production source of truth from `apply_v7_5_30.py`: after hard conditions pass, market consensus can add 0..7 points when at least 2 independent sources exist; the ranked `priorityScore` is the post-consensus score. Actual Formal comparator is `priorityScore -> rewardPerRisk -> marketConsensusScore -> setupQuality -> sectorFlow -> relativeStrength`.
- This correction was discovered by falsification, not by outcome fitting: the first V8.13 contract intentionally asserted the previously believed RR-first ordering and failed against the built Production Worker. The failure was investigated rather than weakened away.
- Historical PIT firewall remains: existing selected trade journal preserves score/allocation context, but pre-V8.13 Shadow snapshots did not preserve `priorityScore` plus consensus provenance. Historical calibration using only selected rows is selection-biased and prohibited; current-score recomputation is not historical PIT evidence.
- V8.13.0 research-only provenance now prospectively records inside existing research snapshots: post-consensus `priorityScore`, raw `rewardPerRisk`, rounded `rewardRisk`, `marketConsensusScore`, `marketConsensusSources`, `marketConsensusBonus`, `setupQuality`, `sectorFlow`, `relativeStrength`, plus frozen definition/comparator labels.
- No Formal formula, rank order, threshold, quota, capital, BUY/ADD/REDUCE, monitoring, signal or push behavior was changed by V8.13. The change is evidence capture only.
- PR #110 `V8.13 PriorityScore provenance shadow` merged to main at merge commit `da9209b52093885d0d2a1903c644e18fe31e7016`.
- PR validation: V8 Regression run 36234321039 SUCCESS and V8 Repair CI run 36234321046 SUCCESS. During validation an older Repair-CI inconsistency was also corrected so V8.12 compatibility rebase runs before the V8.12 patch, matching Production build order.
- Production validation: V8 Regression push run 36234370697 SUCCESS; Cloudflare Deploy run 36234370701 SUCCESS. Build, syntax, Production contract, behavioral regression, pre-deploy backup, anti-downgrade guard, deploy, 23:35 Cron preservation, deployed-version/configuration readback and research-only counterfactual readback all passed; rollback was not triggered.
- PriorityScore research module is now L2 / WAITING_PROSPECTIVE. First descriptive calibration table requires at least 20 clean independent scan dates with mature PIT provenance; that is descriptive readiness only, not optimization approval.
- Frozen comparisons: within-date score rank vs D1/D3/D5 return, MFE/MAE/stop-first; current score-proportional sizing vs equal-capital vs equal-planned-stop-risk; control for raw RR and market-consensus contribution; separate base-score components from consensus bonus; date-cluster/LODO; sector/regime strata; common support/coverage; transaction-cost sensitivity.
- Optimization bridge status: `PRIORITY_SCORE_CALIBRATION = WAITING_PROSPECTIVE / NOT_OPTIMIZATION_READY`. No Class-C change to score weights, comparator order or capital sizing is authorized.
- Exact next continuation: do not tune PriorityScore. Let V8.13 accumulate clean prospective PIT rows starting with the next valid after-market cohorts. In parallel, continue other independently falsifiable research modules; surface a new FORMAL_OPTIMIZATION_CANDIDATE only if mandatory positive+counterevidence and robustness gates are actually met.


## B-167 — V8.14 Sector-Gate provenance deployed; Breadth/Rotation evidence accumulation begins prospectively (2026-09-26 Asia/Taipei)
- Continued the Market Breadth / Sector Rotation lane from BR-025 and audited the actual research snapshots against the deployed Formal sector gate.
- Two evidence gaps were found before any outcome claim:
  1. existing `researchMarketContext.advancePct` is computed from Formal-normalized `todayRows`; it is NOT official whole-market breadth because non-common instruments and sub-NT$10 rows have already been filtered;
  2. pre-V8.14 Shadow snapshots preserved sector score/rank/return context but did not persist the three actual Formal sector-gate inputs `breadth`, `avgChange`, `amountVs20DayAverage`. Therefore the frozen 40% / -1% / 0.5 gate could not be cleanly falsified from existing Shadow history.
- A further causal limitation was preserved instead of hidden: `scoreCandidate()` short-circuits when the sector gate fails, so a sector-gate rejected row does not have a valid full Formal counterfactual RR/eligibility result. Existing `buildChannelDebug()` can safely preserve A/B technical state only. V8.14 therefore marks `fullFormalCounterfactual=false`.
- V8.14.0 `8.14.0-sector-gate-provenance-shadow` was implemented/deployed as Class A research-only evidence capture:
  - market breadth universe is now explicitly labeled `TWSE_TPEX_COMBINED_FORMAL_NORMALIZED`, with `officialWholeMarketBreadth=false`;
  - each Shadow snapshot stores `SECTOR_GATE_AUDIT_V0_1` with PIT values for breadth / avgChange / amountVs20DayAverage, each frozen pass/fail check, combined pass and exact thresholds;
  - each Shadow snapshot stores A/B technical pass/missing context without bypassing the sector gate;
  - a bounded `SECTOR_GATE_REJECTED` cohort is archived for the exact existing reject reason, max 6 per pool per scan.
- The bounded cohort is a falsification sample, NOT a complete rejected-universe receipt. It must not be used to estimate total market-wide opportunity loss or reject counts.
- Formal sector gate remains exactly: breadth >=40%, avgChange >=-1%, amountVs20DayAverage >=0.5. Formal A/B, comparator, quotas, capital, BUY/ADD/REDUCE, monitoring, signals and push behavior remain unchanged.
- PR #111 merged at `eb1ef7f1d86a8013c0fd58d97cdfaa7369f677e7`. PR Regression run 36234970884 SUCCESS; PR Repair CI run 36234970803 SUCCESS.
- Production main Regression run 36235023368 SUCCESS; Cloudflare Deploy run 36235023379 SUCCESS. Build, syntax, Production contract, behavioral regression, backup, anti-downgrade, deploy, 23:35 Cron preservation, deployed-version/configuration readback and research-only counterfactual readback all passed; rollback was not triggered.
- The first PR attempt exposed only an older V8.13 test that hard-locked the exact runtime version. It was corrected to a forward-compatible >=8.13 contract while retaining all V8.13 invariants; no Formal behavior was relaxed.
- Breadth/Rotation module status advances from `EVIDENCE_PENDING` to `WAITING_PROSPECTIVE` at the same L2 maturity. This is evidence instrumentation, not an optimization candidate.
- First eligible post-deploy sector-gate provenance cohort is expected on the next valid after-market scan (2026-09-29), conditional on V8.12 history admission and daily source completeness.
- Frozen first descriptive audit requires >=20 clean independent scan dates with mature D1/D3/D5 outcomes. Compare current frozen gate-pass rows against bounded `SECTOR_GATE_REJECTED` rows on D1/D3/D5 return, MFE, MAE and false-breakout/stop-risk where observable; stratify which gate component failed and A/B technical readiness; control within scan date for sector RS, setup, Price-Volume and market regime; use date-cluster/LODO and no threshold sweep.
- Positive hypothesis: the current sector gate removes fragile setups and improves downside/follow-through quality. Counter-hypothesis: one-day sector gate components are redundant or discard technically strong early-rotation cases. Neither is privileged.
- Optimization bridge status: `BREADTH_ROTATION / SECTOR_GATE_AUDIT = WAITING_PROSPECTIVE / NOT_OPTIMIZATION_READY`. No change to 40% / -1% / 0.5 is authorized.
- Exact next continuation: accumulate clean prospective V8.14 cohorts; do not tune thresholds. In parallel, continue an independent research lane that can advance without contaminating this holdout.


## B-168 — Valuation lane opened from existing Formal relative-PE veto (2026-09-26 19:09 Asia/Taipei)
- Fresh canonical read started from B-167 and Shared Knowledge; no Breadth/Rotation or PriorityScore retuning.
- Opened VALUATION_RESEARCH.md via canonical commit be34ef77acf2d75f1cdf1f4bddf059b0e444069a and audited actual Production semantics. Formal already consumes official TWSE/TPEx daily PE/PB and rejects positive PE/sectorMedianPE > 2.5 unless quarterly revenue YoY or EPS YoY > 25%. No threshold sweep is authorized.
- Positive mechanisms frozen: unsupported extreme relative valuation may flag expectation/crowding risk; quality/growth conditioning may distinguish expensive leadership; effect may appear in downside/MAE rather than mean return.
- Countermechanisms frozen: high PE can correctly price leadership; low PE can be a value trap; depressed earnings inflate PE; >=3-peer median can be unstable; sector labels can mix business models; growth exception may duplicate fundamentals; valuation may duplicate overheat/RS; D1/D3/D5 may be too short.
- Official semantics: missing/N/A PE remains UNKNOWN; PB cannot substitute for PE. Corporate-action timing is a denominator risk and must be provenance-controlled.
- Frozen test: CURRENT_PASS vs exact VALUATION_REJECT_ONLY vs HIGH_REL_PE_WITH_GROWTH_EXCEPTION vs PE_UNKNOWN/PB_OBSERVED_PE_UNKNOWN; D1/D3/D5, MFE/MAE, stop/false-breakout, coverage/zero-pick; independent scanDate, within-date/LODO, sector/regime, crisis removal, costs.
- Selection-bias firewall: selected rows cannot prove a veto. No historical reconstruction from today's valuation/denominator. Exact PIT rejected/pass cohort and upstream state are required.
- Redundancy gate: control A/B, Price-Volume, sector RS/breadth, residual RS/trend, fundamentals/raw growth, liquidity/size, overheat/lateStage and RR.
- Optimization bridge is symmetric: KEEP, RELAX/REMOVE or REFORMULATE. Any Formal valuation-gate change is Class C and requires owner approval after mandatory falsification/OOS/robustness gates. Current status FALSIFICATION_IN_PROGRESS / PIT_COHORT_AUDIT_REQUIRED / NOT_OPTIMIZATION_READY.
- Engineering: Class A research documentation only. No Worker/runtime/Formal selection/ranking/threshold/capital/monitor/signal/push change.
- Master Map/shared-inventory reconciliation was attempted after re-reading latest SHAs but mutation was safety-blocked; do not claim those files updated. Dedicated lane and this checkpoint are the durable source until a later safe reconciliation.
- Exact next continuation: audit current Shadow/archive schema for exact PIT valuation pass/reject cohort provenance, including PE, PB, sectorMedianPE, peer count, growth-exception inputs, reject reason and upstream-state completeness. If incomplete, mark historical cohort UNKNOWN and freeze prospective Class-A receipt/cohort capture; do not backfill or tune thresholds. Then continue the next independent lane without waiting for valuation outcomes.


## B-169 — Valuation provenance audit (2026-09-26 19:43 Asia/Taipei)
- Continued B-168 after fresh canonical read; no outcome lookup or threshold tuning.
- Audit: existing prospective snapshots preserve stock PE/PB and quarterly revenue/EPS growth; Shadow preserves exclusion reason/base/RR state. They do not preserve scan-time sector median PE, positive-PE peer denominator, explicit relative-PE/growth-exception state, or a dedicated exact valuation-reject cohort.
- Historical exact valuation-reject classification is therefore UNKNOWN; current-code/current-fundamental reconstruction is prohibited.
- Formal current rule verified: relative PE above 2.5 with neither quarterly revenue YoY nor EPS YoY above 25% rejects when stock and sector median PE are positive. PB cannot replace missing PE.
- Isolated Class-A documentation branch research/valuation-provenance-v8-15 commit 947ca1ed69fa64fb0b993a4ec4708a926346c38b freezes prospective receipt/cohort/test contract. No runtime or Production change.
- Required prospective fields: stock PE/PB and valuation provenance; sector median PE and positive-PE peer count; relative PE; raw growth inputs; growth exception; gate evaluability/current-rule result; exact thresholds; PIT completeness; upstream exclusion/base/RR state.
- Frozen countertests: 2.51x without growth rejects; either growth input above 25% excepts; missing PE or valid median remains UNKNOWN; PB does not substitute; Formal outputs invariant; no historical backfill.
- R01-R08/I01-I07: improves PIT, selection-bias, definition-drift and UNKNOWN controls; no new factor.
- Status: FALSIFICATION_IN_PROGRESS / HISTORICAL_COHORT_UNKNOWN / PROSPECTIVE_RECEIPT_SPEC_FROZEN / NOT_OPTIMIZATION_READY. No Formal optimization candidate.
- Exact next: fresh-read concurrent checkpoint; if still latest, implement receipt/cohort capture on isolated branch with synthetic tests and Formal-output invariants. If isolation requires shared runtime semantic change, stop at Class-B proposal. Do not tune 2.5/25 thresholds.


## B-170 — V8.15 valuation provenance implementation prepared; Draft PR #112 (2026-09-26 22:10 Asia/Taipei)
- Fresh-read canonical B-169 plus concurrent main commits before implementation. A later main Execution-Alpha research commit was observed; it does not supersede B-169 exact-next valuation task.
- Implemented the frozen V8.15 valuation receipt/cohort contract on isolated branch research/valuation-provenance-v8-15 without changing Formal thresholds or scoreCandidate ordering.
- Prospective Shadow snapshot now captures valuation audit fields already available at scan time: stock PE/PB, valuation provenance, sector positive-PE peer count, sector median PE, relative PE, quarterly revenue/EPS YoY, growth exception, gate evaluability/current-rule result, exact 2.5/25/3 thresholds and PB-non-substitution semantics.
- Added bounded VALUATION_REJECTED research cohort for the exact existing reject reason. It is a falsification sample, not a complete rejected-universe denominator; fullFormalCounterfactual remains constrained by upstream/downstream ordering.
- Added synthetic contract tests and wired V8.15 after V8.14 in both Regression and Repair-CI patch chains. Draft PR #112 opened at head 7dc9265441eab4b3b69fa0684a017249ee37ae6f; branch commits include 8d038ce1d26ba75a4585668adb3abc74784878cd, 287928b27c8bea48bdc5ce2d3f3a6fedd24d7912, 878e06af526b4cb14ad8f5f4a8da9a45476ab015 and 7dc9265441eab4b3b69fa0684a017249ee37ae6f.
- PR creation succeeded, but workflow runs were not yet visible at immediate readback; CI status therefore UNKNOWN, not PASS. PR remains Draft/unmerged/un-deployed. No Production/Worker/Formal/monitor/push change.
- Counterevidence/limitations preserved: historical exact valuation-reject cohort remains UNKNOWN; sector median depends on positive-PE peer composition; high PE can be justified growth leadership; low/negative PE is not cheap evidence; D1-D5 may be too short; valuation may duplicate growth/overheat/RS. No threshold tuning/outcome lookup performed.
- Optimization bridge status: VALUATION = FALSIFICATION_IN_PROGRESS / PROSPECTIVE_INSTRUMENTATION_PREPARED / NOT_OPTIMIZATION_READY. FORMAL_OPTIMIZATION_CANDIDATE count unchanged.
- R01-R08/I01-I07: improves PIT, selection-bias, UNKNOWN, definition-drift and future redundancy testing; no new Formal factor.
- Exact next continuation: re-read latest main/checkpoint and PR #112 CI when available. If CI exposes implementation errors, repair safely on branch and rerun. If green, verify Formal-output invariants and keep the Class-A evidence capture isolated until governance permits promotion; do not alter 2.5/25 thresholds. In parallel, continue the next independent research lane rather than waiting for valuation outcomes.


## B-171 — PR #112 CI failure diagnosed and repaired on branch (2026-09-26 22:14 Asia/Taipei)
- Continued B-170 immediately; fetched actual PR #112 workflow results instead of treating pending as success. Both V8 Repair CI run 36247523630 and V8 Regression run 36247523611 failed.
- Root cause localized: V8.15 patch itself applied successfully, syntax passed, and failure occurred in Behavioral regression because the older V8.14 test hard-locked the exact runtime version `8.14.0-sector-gate-provenance-shadow`. This is the same class of forward-version test fragility previously seen at V8.13->V8.14, not evidence that Formal behavior changed.
- Repaired only the stale V8.14 version assertion on branch to accept V8.14+ forward research versions while retaining all V8.14 sector-gate provenance, exact sector-gate rule and Formal ranking assertions. Repair commit 0ca163aa2860c25e4c76c59a93fdfe5c785c6981.
- Important counterevidence: CI is NOT yet green after this repair; immediate workflow lookup returned no new runs yet. Status remains CI_REPAIR_PUSHED / VERIFICATION_PENDING. PR #112 stays Draft, unmerged, undeployed. No Production/Formal/monitor/push change.
- Exact next continuation: fetch the new head workflow runs when registered; if failure remains, inspect exact failing step/log and repair only test/instrumentation defects without weakening Formal invariants. If green, verify PR diff and Formal-output invariants, then keep valuation threshold tuning frozen and continue another independent evidence-ready research lane.


## B-172 — Volatility prospective TAIEX source gate materially resolved (2026-09-26 14:17 UTC write; Asia/Taipei research date 2026-09-26)
- Fresh-read Production verified actual runtime `8.14.0-sector-gate-provenance-shadow`, TEST_MODE=false, KV/D1 ready; no assumption from repository version alone.
- Concurrent V8.15 Valuation Provenance PR #112 was detected and left isolated; volatility did not race the reserved version or overwrite the active branch.
- Official TAIEX INDEX audit materially narrows the prior volatility blocker. `validateOfficialQualityData(kind=INDEX)` accepts exact TWSE FMTQIK monthly sources, validates the official TAIEX field, rejects duplicate/future/abnormal points, requires target-date presence, and requires the recent 21 official sessions using the loaded TWSE holiday calendar through `recentWeekdays()/isTradingDate()`.
- Normal after-market scan reads same-date INDEX before selection and fails closed if absent, then passes that exact snapshot as `V7_OFFICIAL_INDEX`. Therefore prospective same-scan availability of official TAIEX close history is materially proven for successful scans.
- Remaining PIT limitation is different: D1 quality snapshots are upserted by dataset/date and do not preserve an immutable first-known vintage inside snapshot_json. Historical pre-capture first-known volatility state therefore remains UNKNOWN; no old Shadow rows may be fabricated from current snapshots.
- Frozen minimal prospective raw fields: marketRealizedVol5, marketRealizedVol20, marketVolRatio5to20, exact FMTQIK source/definition/history-through/prospective-PIT provenance. No HIGH/LOW threshold, no annualization requirement, no RV60 claim, no score.
- Cross-system de-dup: these exact primitives align with System 2's already frozen realizedVol5/realizedVol20/volRatio5to20 inputs; do not create a second volatility taxonomy.
- New falsification couples existing R05/R06 rather than creating R09: control regime level, proven consecutive-session transition, stock ATR/volatility20, Residual RS, overheat, liquidity and overnight/intraday path. A volatility effect absorbed by R06 or ATR is REDUNDANT; crisis-dependent sign is FRAGILE.
- `VOLATILITY_REGIME_CONTEXT` remains L2 / DATA_QUALITY_BLOCKED only because prospective runtime capture is not yet wired and historical vintage is unproven. Source feasibility itself is no longer the blocker.
- Durable evidence updated in `VOLATILITY_REGIME_RESEARCH.md` VR-013..VR-017 and machine Master Map. No Formal optimization candidate and no Formal/runtime behavior change.
- Exact next: after the active V8.15 valuation lineage resolves, use the next free Class-A version for zero-extra-call prospective TAIEX RV5/RV20/ratio capture, with Formal-output invariants and no historical backfill. In parallel continue the next independent under-reconciled Master-Map lane rather than waiting for outcomes.


## B-173 — InstitutionalScore structural decomposition / actor-semantic falsification (2026-09-26 Asia/Taipei)
- Fresh-read current Formal formula: `institutionalScore = clamp(8*foreignBuyDays + 10*trustBuyDays + 4*dealerBuyDays + 15*institutionsAligned + 6*currentBuy + clamp((institutionTotalNet/ADV20Shares)*25,0,25) + 0.15*chipConcentration,0,100)`.
- Formal materiality is nontrivial: institutionalScore contributes 16% inside priorityScore and participates in the 10–30bn market-cap special exception. Any formula/weight change is Class C; none was made.
- Current official streak horizon is exactly 3 sessions. For ready history, `currentBuy` and `institutionsAligned` are deterministic nonlinear interaction bonuses on actor signs already encoded by streakDays>0; they are not independent evidence.
- Structural ceiling audit: all-three 1-day positive = 43 before net/concentration; all-three 3-day positive = 87; adding 50% TDCC 400-lot-plus concentration and only 0.22 ADV aggregate net flow saturates at 100. One synchronized day + 1 ADV aggregate net buy + 50% concentration yields 75.5, above the small-cap institutional-score exception threshold.
- TDCC provenance explicitly states `chipConcentration` is 400-lot-plus ownership concentration and is NOT institutional/main-force identity, yet it contributes up to 15 points inside institutionalScore. This is a semantic hybrid, not a pure institutional-flow score.
- Negative institutionTotalNet receives zero net-intensity contribution rather than a penalty; a positive actor streak plus concentration can therefore retain a positive institutionalScore while aggregate net flow is negative.
- Official TWSE/TPEx institutional source exposes foreign dealer and dealer proprietary/hedge detail, but the current normalized parser collapses foreign-main+foreign-dealer and dealer-proprietary+dealer-hedge into `foreignNet` / `dealerNet`. Future actor-separated research needs semantic preservation, not a new data vendor.
- Cross-market aggregate 3-session persistence source parity is materially proven for successful scans: official TWSE T86 + TPEx dailyTrade, >=1500 combined rows, official expected session dates, and fail-closed missing-date behavior. The old generic "multi-session parity not proven" blocker is narrowed to >3-session history and richer actor splits.
- Existing clean prospective Shadow fields are already sufficient to reconstruct/decompose the current score exactly without any new market-data call. No alternative weights were introduced; first tests are saturation/component/redundancy diagnostics only.
- Taiwan evidence retained as counterweight to monotonic scoring: institutional herding effects vary with market pressure/state and actor concentration; dealer/foreign mechanisms are not interchangeable. Current evidence does not validate current proprietary weights.
- Durable files: `INSTITUTIONAL_CROWDING_RESEARCH.md` IC-013..IC-020 and `research/institutional_score_structural_falsification_v0_1.json`. Machine Master Map now registers `INSTITUTIONAL_CASH_FLOW_CROWDING` separately from `LEVERAGE_SHORTING`; 21 modules, registered maturity 46.7%, debt 11.2. This denominator change is an inventory reconciliation, not research regression.
- Optimization bridge: no FORMAL_OPTIMIZATION_CANDIDATE. Potential future Class-C reformulation requires clean prospective score-decomposition evidence, scanDate-clustered/OOS/regime/cost/redundancy tests and explicit owner approval.
- Exact next: wait for clean prospective Shadow coverage to measure saturation/actor-divergence/component outcome evidence; do not tune weights. Any proposal to preserve dealer proprietary/hedge or foreign-dealer subfields must be treated as shared-runtime/Class-B proposal-first. Continue another independent research question now rather than waiting.


## B-174 — Momentum rank-persistency construct reconciliation (2026-09-26 Asia/Taipei)
- Fresh Taiwan evidence audit confirms Chen, Hsieh & Lee (2023) persistency is cross-sectional duration: monthly winner/loser groups are formed from prior 3/6/9/12-month returns; top/bottom 30% membership is followed across subsequent formations. It is not a smoothness or moving-average score.
- Current V8.7.1 `persistenceScoreResearch` exact formula is 35% positiveDayRatio20 + 25% positive-horizon share across ret5/10/20/60 + 20% drawdown quality + 20% MA20/MA60 quality. It is an own-price trend-consistency heuristic.
- Construct mismatch is explicit. Existing I02 remains the frozen test of that proprietary trend-consistency heuristic beyond Residual RS; it must not be silently redefined as literature rank persistency.
- Current after-market feature universe already computes ret60 from 61 valid bars before Formal A/B/fundamental/valuation/RR gates, so same-scan 60-session cross-sectional rank can be captured prospectively with zero additional market-data calls.
- Historical full-universe ranks and membership duration were not preserved. Canonical/historical rank-duration reconstruction is PIT_CROSS_SECTIONAL_HISTORY_BLOCKED; current data must not fabricate old persistent-winner labels.
- Frozen system-native v0.1 in `research/momentum_rank_persistence_spec_v0_1.json`: continuous momentumRankPct60 + universe count/coverage first; literature top-30 state is descriptive only; retention advances only across consecutive official clean scan sessions; failed/missing scan => GAP_UNKNOWN.
- The system-native design is not canonical replication: the paper rebalances monthly and tests 3/6/9/12-month formation; our first feasible primitive uses daily after-market ret60 (~3 months). Paper return magnitudes/threshold effects are not transplanted.
- Primary falsification is conditional: after controlling current ret60 rank itself, does RETAINED winner status/rank stability add anything beyond Residual RS and the existing trend-consistency heuristic? If no, reject duration as redundant.
- Cross-literature guard: later 2023 momentum review reports Taiwan momentum can appear after excluding small/low-priced stocks. Current Formal already applies low-price, market-cap and liquidity filters, so whole-market “Taiwan has no momentum” findings are not automatically representative of the selector population; this is a population-transportability issue, not evidence for changing gates.
- No R09, no code/runtime change, no outcome inspection, no Formal optimization candidate.
- Exact next: retain prospective-only rank spec until the active V8.15 lineage is resolved; any future capture must be Class A/zero-extra-call/Shadow-only/Formal-invariant. Continue another independent research question now.


## B-175 — Generic short-term reversal rejected / A pullback-origin residual frozen (2026-09-26 Asia/Taipei)
- Taiwan/external mechanism evidence supports temporary reversal after non-informational price pressure, but also continuation after information/news-driven high-activity moves; recent negative return alone is not a causal reversal signal.
- Fresh Formal audit shows A after-market selection already requires intact MA20/MA60 trend, 2–15% pullback, <=4% support distance, non-expanding/contracting volume, intact structure and non-late-stage state.
- Formal 15m A execution then rejects buy-zone failure and bearish >=1.3x volume, and requires zone hold, <=0.9x setup volume, reversalK/strong close, higher low and subsequent bullish turn-up. This is explicitly designed to avoid catching a falling knife.
- Therefore a standalone Generic Short-Term Reversal factor is REJECTED_OR_REDUNDANT; adding one would double-count A's existing selection/execution logic.
- The genuinely residual question is pullback origin/context: structural pullback vs event shock vs liquidity-pressure candidate vs deleveraging pressure vs common-market shock. This is moderator/diagnostic only, not a new score.
- Microstructure firewall: lower shadow/high volume/rebound cannot prove liquidity/inventory reversal. Valid side pressure + depth/replenishment/price-response evidence is required; current sparse recorder cannot historically reconstruct all such states. Missing = UNKNOWN.
- Future A-line optimization evidence, if any, must compare already-qualified A setups by valid origin context and show incremental benefit in BUY coverage/D1-D10/MFE/MAE/stop/no-follow-through/entry quality after controls. Gate relaxation that only increases trades but worsens risk/cost is rejected.
- Durable Trend files updated DL-003H..DL-003J. No code/runtime/Formal change and no FORMAL_OPTIMIZATION_CANDIDATE.


## B-176 — Fundamental monthly-revenue event-clock blocker narrowed (2026-09-26 Asia/Taipei)
- Fresh publisher audit corrected the 2026 Taiwan record-high monthly revenue citation to DOI `10.1016/j.frl.2026.109911`. The paper's useful mechanism is horizon-dependent: salient record-high revenue can coexist with next-session reversal and longer post-event drift, with pre-event run-up and institutional selling as important moderators.
- Current V8.7.11 revenue evidence is not an event clock: `pointInTimeHistoryStatus=CURRENT_SNAPSHOT_ONLY`, `firstKnownAt=null`, report `dataMonth` is not proof of first market-known timestamp, and `historicalHighStatus=UNKNOWN_REQUIRES_HISTORY`.
- Therefore existing current snapshots can support contemporaneous revenue context but cannot cleanly establish announcement day, pre-announcement run-up, next-session reaction or record-high-at-the-time status. No historical event rows may be fabricated.
- Source audit materially narrows feasibility: the normal Formal after-market enrichment already fetches full-market TWSE `t187ap05_L` and TPEx `t187ap05_O` monthly-revenue payloads. A future first-observed data-month transition receipt can in principle reuse existing source calls.
- Because those payloads are consumed inside the shared Formal enrichment/parser/storage path, adding first-observed receipt persistence is Class-B proposal-first even if research output remains decisionImpact=false. No runtime change was made.
- Conservative future event-time rule: if exact filing time is unavailable, a newly observed dataMonth at the after-market scan is first eligible for event-return attribution on the next official session; missed prior clean scans => `OBSERVATION_DELAY_UNKNOWN`, not first-publication certainty.
- Record-high classification remains history/vintage gated. Current previous-month/last-year values are insufficient to prove a historical record at first publication.
- The smallest future system-native test is not “record-high revenue alpha” but `realized revenue growth state × pre-event run-up × pre-event institutional flow × immediate reaction`, with overheat, decomposed institution flow, sector/Residual RS, regime/volatility and overlapping disclosures as controls.
- Durable Fundamental lane advanced to FD-035; exact source DOI and event-clock semantics are updated. `FUNDAMENTAL_INFO_DYNAMICS` remains L2 / DATA_QUALITY_BLOCKED for event inference, not because current revenue numbers are unavailable.
- No Formal optimization candidate. Exact next high-value task is structural falsification of the current Formal `fundamentalScore` itself before proposing any new fundamental factor.


## B-177 — Formal fundamentalScore structural falsification / observability gap (2026-09-26 Asia/Taipei)
- Exact current formula audited before any outcome lookup. Nine possible components have maxima 30/10/15/15/15/15/10/5/5 = 120, then final score clamps at 100. Main Formal priority uses 14% fundamentalScore and rejects sufficiently observed candidates below 25; any formula change is Class C.
- Score is additive across available components and not normalized by observed-component count or available maximum weight. Fixed synthetic witness: same illustrative company values score 47.5 with 3 visible fields, 86.5 with 6, and pre-clamp 101.5 => 100 with all 9. Structural coverage confounding is therefore confirmed; empirical harm remains unknown.
- `scorePositive` gives half component credit at zero change. A fully observed profitable zero-growth synthetic state scores 67.5. Therefore fundamentalScore is a mixed LEVEL+CHANGE quality composite, not a growth/surprise score; interpretation is corrected rather than labeling this automatically defective.
- `revenueMoM ?? revenueQoQ` creates an availability-driven horizon switch. Frozen witness with identical other fields scores 35 when monthly MoM=-20 is present versus 45 when MoM is missing and quarterly QoQ=+50 fills the slot.
- Full max 120 creates structural score saturation/rank-compression risk. Actual saturation frequency must be measured prospectively; no alternative cap/weight is proposed.
- Existing Shadow observability is incomplete for exact decomposition: current snapshot stores the total score and many raw fundamentals but not grossMarginYoY, operatingMarginYoY, component availability signature, pre-clamp score or availableWeightMax. Historical component attribution is therefore not exact.
- Machine artifact `research/fundamental_score_structural_falsification_v0_1.json` freezes current formula and synthetic counterexamples without outcome data. Fundamental lane advanced through FD-043.
- Correct empirical order: capture exact component/provenance -> measure availability/saturation -> test grouped primitives with scanDate clustering/OOS/redundancy controls -> only then consider a Class-C reformulation. Do not tune weights first.
- A future zero-extra-call Shadow-only component-observability extension can qualify as Class A if it only serializes already-loaded values and Formal outputs remain invariant, but active V8.15 lineage is left untouched.
- No FORMAL_OPTIMIZATION_CANDIDATE yet. The finding is structurally material but outcome impact is still UNKNOWN.


## B-178 — fundamentalScore missingness / saturation falsification deepened (2026-09-26 23:14 Asia/Taipei)
- Continued from B-177 after fresh governance/worklist/checkpoint/main read. No restart and no reopening of completed A work.
- Structural finding does NOT authorize mechanically normalizing fundamentalScore by availableWeightMax. Missingness may be informative/systematic; normalization could over-reward a small favorable observed subset. Raw score, coverage signature and normalized diagnostic must remain separate research quantities.
- Missingness mechanism is now a mandatory falsification dimension: stratify by TWSE/TPEx, industry, size/liquidity, source family and scanDate; test source asymmetry, reporting-season/source-outage date clustering and whether coverage merely proxies larger/liquid firms. Existing >=3-field Formal gate means inference is conditional on surviving observability and cannot generalize to the whole market.
- Score saturation at 100 is reframed as possible information loss, not automatically a defect. Future prospective evidence must measure exact-100 frequency by independent date, pre-clamp dispersion within the 100 bucket and whether primitive states inside that bucket have stable incremental outcomes. If not, clamp may be harmless.
- Frozen grouped-primitives order before any weight search: revenue-growth state; profitability-level state; earnings-change; margin-change; coverage state. Compare incremental D1/D3/D5/D10/MFE/MAE/stop/no-follow-through among already-qualified candidates with scanDate clustering and RS/sector/overheat/liquidity/regime/valuation controls.
- Positive results must survive holdout, date removal, market/source stratification, cost/coverage implications, redundancy and Factor-Zoo accounting. No alternative weights/thresholds proposed.
- Attempted durable update to the dedicated Fundamental research file was blocked by the GitHub safety layer before mutation. This checkpoint write records the durable handoff if accepted; dedicated-file sync remains pending.
- No code/runtime/Formal change. No FORMAL_OPTIMIZATION_CANDIDATE. Exact next: fresh-read canonical; if dedicated-file write becomes available, sync FD-044..FD-047 without overwriting concurrent work. Otherwise continue the next independent research question that can be advanced with existing PIT evidence, while prospective fundamental observability waits for the active V8.15 lineage.


## B-179 — Macro/Cross-Market after-market absorption + source-clock refinement (2026-09-26 Asia/Taipei)
- Fresh runtime/patch-chain audit confirms current Formal selector has no explicit NASDAQ/S&P/Dow/SOX/Nikkei/KOSPI/DXY/USD-TWD/oil feature family. V7.5.30 marketConsensus is a per-symbol independent-source bonus mechanism, not a global market regime.
- Decision-clock correction: prior U.S. cash close is known before Taiwan opens, so by the 18:10 after-market scan Taiwan has already had its opening auction and full regular session to absorb it. Raw U.S. return is therefore first a common-beta/overnight control, not assumed fresh after-market alpha.
- The next U.S. cash session after the 18:10 scan is future information and ineligible. Any contemporaneous U.S. futures state is a separate derivatives receipt and cannot be mislabeled as cash-index return.
- TWSE closes 13:30 Taipei; JPX and KRX regular cash markets close 15:30 local = 14:30 Taipei. Same-day Nikkei/KOSPI daily close-to-close return is thus a MIXED_WINDOW variable: mostly overlapping Taiwan plus ~1h post-Taiwan-close. A clean post-close Asian lead requires an intraday anchor at Taiwan 13:30 / Japan-Korea 14:30 local.
- Highest-value research question is now cross-market absorption/divergence: conditional on the global shock and Taiwan/sector response already observed, does any residual state predict next-open gap, open-to-close continuation/reversal, D1-D5, MFE/MAE? If raw foreign return adds nothing after Taiwan market/sector controls, reject as redundant.
- Taiwan-specific evidence supports overseas/opening transmission and a stronger technology/supply-chain channel, but does not justify a universal U.S.-up => Taiwan-stock-up score.
- Source gate materially improved: Taiwan CBC publishes NT$/US$ interbank closing rate each business day around 16:00-17:00 Taipei, so CBC_NTDUSD is materially valid for prospective 18:10 capture. FRED DEXTAUS remains historical/cross-check only for this purpose because H.10 daily observations update weekly and represent New York noon rates.
- U.S. broad prior-session source is feasible but provider/terms/version contract is not frozen; U.S. tech/semiconductor source remains partial. Oil/DXY/rates remain later source-contract lanes rather than blocking Phase 1.
- Durable files: MACRO_CROSS_MARKET_RESEARCH.md MC-016..MC-025, new MACRO_CROSS_MARKET_CHECKPOINT.md, machine spec research/macro_cross_market_receipt_spec_v0_1.json, and System2 source matrix update.
- No historical backfill, no global score/veto/bonus, no Worker/runtime/Formal change. Status remains DATA_QUALITY_BLOCKED / NOT_OPTIMIZATION_READY with a materially narrower blocker.
- Exact next: continue structural/redundancy audits in another lane while global receipts remain prospective-only; any future capture must preserve sessionDate/knownAt/firstEligibleDecision and stay isolated from Formal.


## B-180 — setupQuality A/B channel-scale structural falsification (2026-09-27 Asia/Taipei)
- Fresh Formal audit targets the largest pre-consensus PriorityScore component: setupQuality weight = 28%.
- A and B use different formulas but feed one common numeric scale.
  - A qualifying envelope: theoretical setupQuality ~38 to 82.
  - B qualifying envelope: theoretical setupQuality ~69.65 to 100.
- Therefore equal-looking “0–100” values are not proven cross-channel calibrated. B's 18-point higher ceiling can contribute up to 5.04 more PriorityScore points versus A solely from score-scale capacity.
- A has a structural discontinuity: otherwise identical A candidates at volumeTodayVsPrev5 0.90 vs 0.91 receive +12 vs +4 volume contribution, an 8-point setupQuality jump = 2.24 PriorityScore points, while both can remain A-eligible.
- B post-gate volume scoring is continuous from the >=1.3x hard threshold and rises until 3.125x, so A and B also differ in within-channel ranking mechanics.
- Current channel assignment is deterministic: if B.pass then B, else if A.pass then A. No A/B quota was identified; final capacity quotas are price-pool based. Dual-pass frequency remains empirical and must be measured.
- No inference that B is “wrongly favored” is made yet. If B's higher score range is justified by consistently better forward path/risk after controls, normalization should be rejected. If the difference disappears after channel identity or raw setup controls, classify raw cross-channel score as channel-confounded.
- Crucially, no new capture is needed: existing Shadow already preserves strategy/channel, A/B check bits, pullbackPct, supportDistancePct, volumeTodayVsPrev5, volumeContraction5to20, dailyClosePosition, dailyUpperShadowRatio and setupQuality.
- Frozen machine artifact: research/setup_quality_channel_falsification_v0_1.json. PRIORITY_SCORE_CALIBRATION_RESEARCH.md updated with the exact audit.
- Prospective tests: channel score distributions; A/B/dual-pass incidence; within-channel monotonicity vs D1/D3/D5/MFE/MAE/stop/no-follow-through; raw score vs within-channel rank comparator; 0.90/0.91 cliff incidence; matched cross-channel outcome calibration.
- No alternative formula, normalization, 28% weight change or channel precedence change. Any Formal change is Class C with owner approval after OOS/date-cluster/redundancy evidence.
- No FORMAL_OPTIMIZATION_CANDIDATE yet; structural non-comparability risk is confirmed, outcome materiality UNKNOWN.


## B-181 — RR multi-layer PriorityScore structural falsification (2026-09-26 Asia/Taipei)
- Formal RR influence is now decomposed exactly: (1) hard eligibility RR>=2; (2) additive `clamp(RR*20,0,100)*0.14` inside PriorityScore; (3) raw rewardPerRisk is the second deployed comparator after rounded post-consensus PriorityScore.
- Existing additive breakpoints: RR2=5.6 PriorityScore points, RR3=8.4, RR4=11.2, RR5+=14.0. Above RR5 the additive component saturates, but raw RR can still resolve a PriorityScore tie.
- Since PriorityScore is rounded to one decimal before the deployed comparator, raw RR can decide near-equal composites. RR therefore has confirmed multi-layer influence, not merely one 14% factor.
- This is not called defective yet: gate + quality preference can be intentional. Empirical test must separate each layer and verify actual target/MFE/MAE/stop value.
- A/B channel construction differs for entry/stop, so RR distribution and calibration must be channel-stratified rather than assumed commensurate.
- Frozen tests: RR bands at existing formula breakpoints (2–3, 3–5, >5), tie-resolution incidence, target-first/MFE/MAE/stop-first, research replay removing only raw RR tie-break, and realized-MFE-versus-modeled-reward calibration.
- Existing V8.13 Shadow already preserves raw rewardPerRisk, rounded rewardRisk, PriorityScore and comparator identity; no new capture or runtime patch is needed.
- Machine artifact: research/rr_priority_structural_falsification_v0_1.json; PRIORITY_SCORE_CALIBRATION_RESEARCH.md updated.
- No RR gate/14% weight/target/stop/comparator change. Any Formal change is Class C and requires owner approval after prospective OOS/date-cluster/redundancy evidence.
- No FORMAL_OPTIMIZATION_CANDIDATE yet; structural multi-layer influence confirmed, empirical materiality UNKNOWN.


## B-182 — Portfolio Risk Tier-A PIT reconstructability validated (2026-09-27 00:02 Asia/Taipei)
- Continued the Portfolio Risk lane without changing Worker/runtime/Formal behavior.
- PR #113 `Research: Portfolio Risk Tier-A v0.1` merged to main after three green checks: Portfolio Risk Tier-A Research run 36253863310 SUCCESS, V8 Repair CI run 36253863262 SUCCESS, V8 Regression Tests run 36253863259 SUCCESS.
- Pure Class-A prototype freezes projected plan-risk semantics from immutable plan-time fields only: buyLow/buyHigh risk range, projected portfolio heat, deployment ratio, effectiveCapitalNames, name/sector capital concentration, cash-state attribution, equal-capital and equal-planned-stop-risk research counterfactuals.
- No hard heat threshold, cluster cap, allocation change or ADD/REDUCE rule is introduced.
- Historical plan-risk reconstructability is materially proven for exact system-recorded Formal rows in `v8_trade_journal_days` + `v8_trade_journal_plans`: totalCapital, selectedCount/status/diagnostics, buyLow/buyHigh, stop, allocationRatio, totalAllocation, score/RR and planned shares are persisted at plan time.
- Manual/recovered rows are excluded because they do not preserve the complete capital contract. Current mutable history is explicitly forbidden for reconstructing old correlation/cluster states.
- Production read-only audit run 36253794425 read only `/api/journal?days=730`, did not read outcomes and made no writes. It observed 4 journal days, 4 Formal plan rows, 58 recovered rows excluded, 2 plan dates, 2/2 fully reconstructable plan dates, 0 incomplete plan dates and 2 zero-selection dates.
- 2026-09-18: total capital NT$200,000; 3 plans; planned deployment NT$168,000 (84%); projected heat 2.0221%-3.2417%; effectiveCapitalNames 2.9672.
- 2026-09-21: total capital NT$200,000; 1 plan; planned deployment NT$70,000 (35%); projected heat 0.5276%-1.3070%; effectiveCapitalNames 1.0000.
- 2026-09-22 and 2026-09-23 were recorded as zero selected / cash. These observations are reconstructability evidence only, not evidence that any heat level is safe/unsafe or predictive.
- Historical pairwise correlation20/60, empirical clusters, shrinkage covariance, marginal/component risk and downside correlation remain `PIT_HISTORY_REQUIRED`; plan journal alone cannot recover them. Actual-live heat remains conditional on complete BUY/ADD/REDUCE/SELL event coverage.
- Durable artifacts: `PORTFOLIO_RISK_TIER_A_AUDIT.md`, `research/portfolio_risk_tier_a_v0_1.mjs`, `research/portfolio_risk_reconstructability_v0_1.json`, `research/portfolio_risk_production_readonly_receipt_20260926.json`, and dedicated tests/workflow.
- Machine Master Map status changed `PORTFOLIO_RISK: EVIDENCE_PENDING -> FALSIFICATION_IN_PROGRESS`; level remains L2 because the broader covariance/cluster/live-event/outcome layer is not yet PIT-validated.
- Optimization bridge: no FORMAL_OPTIMIZATION_CANDIDATE. Exact next is a descriptive, outcome-independent Tier-A history table from only fully reconstructable dates; later, once independent dates/outcomes mature, test whether heat/concentration adds downside information beyond sector/regime/volatility/PriorityScore. No outcome-based threshold search.


## B-183 — Leverage/Shorting LS-047 source blocker narrowed without endpoint guessing (2026-09-27 Asia/Taipei)
- Continued after Portfolio Risk B-182 using only official TPEx source verification; no forward returns/outcomes inspected.
- Official TPEx current/legacy margin pages verify BIG5 + UTF-8 CSV availability and historical data; legacy URL redirects to current `transactions.html`.
- Official indexed `margin_bal_result.php?...&o=htm` is machine-readable and reproduces the validated margin/short fields and lots unit for 2026-09-24.
- Browser-rendered official page extraction exposed history/SBL/navigation links but did not expose a stable CSV href/request parameter contract. Official-domain searches did not produce a verified CSV request URL. Generic direct current-page fetch can return HTTP 403.
- Therefore `TPEX_MARGIN_DATA_PRODUCT_AND_UTF8_CSV_EXISTENCE = VERIFIED` but `TPEX_MARGIN_PROGRAMMATIC_DOWNLOAD_CONTRACT = UNRESOLVED`.
- Negative evidence is durable in `research/leverage_shorting_ls047_tpex_margin_source_contract_receipt_v0_1.json`; dedicated Leverage/Shorting files advanced through LS-047.
- Safe path remains official artifact ingestion under LS-046 metadata/checksum/schema/parser contract, or later verification of a documented official endpoint. Hidden-URL guessing / access-control bypass remains prohibited.
- Machine Master Map changes LEVERAGE_SHORTING from generic EVIDENCE_PENDING to precise DATA_SOURCE_BLOCKED; maturity stays L2. This is a source-contract blocker, not absence of TPEx margin data.
- Large automated cross-market backfill remains NO_GO; no H1-H5 outcome tests and no Worker/runtime/Formal changes.
- Exact continuation: if an official TPEx UTF-8 margin CSV artifact or documented endpoint becomes available, run LS-048 finalized-history pilot without outcomes, then LS-049 completeness/revision audit; otherwise move research effort to lanes that can advance with existing PIT evidence rather than repeatedly probing the blocked source.


## B-184 — Market Consensus provenance/PIT falsification (2026-09-27 Asia/Taipei)
- Continued from canonical B-183 plus latest main Market Consensus structural commit 970e046044a5717d3bc5311e2b56373b11669524; did not redo prior work.
- Formal source audit confirms the claimed independent-source gate currently proves only distinct trimmed source-name strings inside one POST payload. It does not preserve/validate provider identity, independence group, evidence locator/hash, sourcePublishedAt or sourceAvailableAt.
- Therefore marketConsensusSources>=2 is valid as system-observed source-name count, but true information-source independence remains UNKNOWN. This does not assert actual duplication; it establishes that independence is not auditable from current provenance.
- Same-date V7_MARKET_CONSENSUS:{marketDate} is mutable for accepted recent-date POSTs. current KV state cannot be replayed as first-decision PIT truth. updatedAt is ingestion/write time, not source publication/availability time.
- V8.13 archived sourceCount/bonus can support prospective outcome tests as observed-at-scan fields, but cannot support claims about independent-source consensus without additional immutable provenance.
- Frozen alternative mechanisms/counterevidence: genuinely independent sources may still dominate in practice; sourceCount effects may instead proxy attention/coverage, syndicated reporting, sector/regime clustering, or overlap with sectorFlow/RS/news attention.
- Minimum future receipt proposal: immutable receipt/version, providerIdentity, independenceGroup, evidence locator/hash, sourcePublishedAt, sourceAvailableAt, capturedAt, firstEligibleDecisionAt and revision lineage. Missing identity/clocks remain UNKNOWN; no current-web historical backfill.
- Any shared ingestion/KV change is Class B proposal-first; bonus/source threshold/comparator/PriorityScore/sizing change is Class C. No runtime/Formal change made.
- Falsification remains scanDate-clustered and controls pre-consensus PriorityScore, RR, sector, RS, price-volume, regime, attention, costs, coverage/zero-pick and multiple testing. Fixed sourceCount bands only; no threshold search.
- Status: DATA_QUALITY_BLOCKED / FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: while provenance receipt is proposal-only, use existing V8.13 prospective archives to measure purely structural observed-sourceCount mechanics without interpreting independence: bonus application frequency, score saturation/compression, rank-change incidence, RR/consensus tie-break incidence and planned-capital sensitivity; preserve independence=UNKNOWN and do not inspect/tune thresholds from outcomes until provenance/readiness gates permit.


## B-185 — Market Consensus outcome-independent score/rank/sizing sensitivity bounds (2026-09-27 Asia/Taipei)
- Continued exact B-184 next point without using forward outcomes and without assuming source independence.
- Deterministic saturation bounds from the deployed formula are now explicit: sourceCount 2/+2 caps post-consensus PriorityScore when base>=98; 3/+4 when base>=96; 4/+6 when base>=94; 5+ /+7 when base>=93. Thus consensus can create score compression near 100 even before any outcome claim.
- Deterministic pairwise rank effect: because post-consensus PriorityScore is the first comparator, a candidate can outrank another candidate with up to 7.0 higher pre-consensus base score solely through the maximum bonus difference (subject to rounding/ties). This is a structural influence bound, not evidence of realized frequency or harm.
- SourceCount 5 and 6 have identical +7 first-comparator effect; only their consensusScore 95 vs 100 can differ at the third comparator after post-consensus PriorityScore AND raw RR tie. Therefore treating sourceCount 6 as materially stronger in ordinary ranking would be unsupported unless tie incidence is observed.
- Capital sizing sensitivity is mechanically downstream of the same post-consensus score, so any bonus-driven rank effect can also alter proportional planned allocation before the 35% single-name cap/deployment constraints. Exact realized allocation effect remains empirical because the cap and candidate-set denominator can absorb/compress score differences.
- Structural audit cannot measure application frequency from repository code alone. No durable production archive rows were found in GitHub; absence of repository rows is not evidence of zero usage. Runtime/KV history must not be inferred or fabricated.
- Frozen descriptive metrics for existing V8.13 prospective archives: per scanDate counts by observed sourceCount 0/1/2/3/4/5+; bonus application rate; base-score saturation threshold crossing; rank position delta from pre- to post-consensus score with identical candidate set; RR/consensus third-tie-break incidence; planned-allocation delta and cap-hit absorption. These are descriptive mechanics first, no D1/D3/D5 threshold tuning.
- Independence remains UNKNOWN for all sourceCount strata until immutable provenance exists. Any future outcome test must preserve B-184 controls and scanDate clustering.
- No Formal change and no FORMAL_OPTIMIZATION_CANDIDATE. Status remains DATA_QUALITY_BLOCKED / FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.
- Exact next: locate/read only already-persisted V8.13 prospective Shadow/archive rows or existing research endpoint receipts, if available, and compute the frozen descriptive mechanics above without forward outcomes. If those rows are inaccessible or lack pre-consensus base score/rank/allocation fields, mark the metric UNKNOWN and move to the next lane with existing PIT evidence; do not reconstruct from current mutable state.


## B-186 — Sector + market-RS PriorityScore structural falsification (2026-09-27 Asia/Taipei)
- Fresh Formal decomposition confirms Sector uses three layers: hard gate (breadth>=40%, avgChange>=-1%, amountVs20DayAverage>=0.5), then sector.score contributes 14% of PriorityScore, then sectorFlow remains the fifth deployed comparator.
- Sector score exact formula is `clamp(amount/maxSectorAmount*45 + breadth*0.3 + clamp(avgChange*5+15,0,25),0,100)`.
- Structural overlap is confirmed: breadth and avgChange are used in the hard gate and again in the score. Activity semantics also differ by layer: gate uses own-sector amountVs20DayAverage, while score uses absolute current sector amount divided by the day's largest sector amount.
- Fixed counterexample proves cross-sector denominator externality: own sector amount=50, breadth=60, avgChange=+1 scores 60.5 when maxSectorAmount=100 but 49.25 when an unrelated sector raises maxSectorAmount to 200, despite no change in the sector itself. This is an 11.25 sector-score / 1.575 PriorityScore-point shift.
- Therefore `sectorFlow` is an activity/participation/relative-attention composite, not literal net capital flow and not pure own-sector strength.
- Market-relative RS is `ret20 - TAIEX return20`; `clamp(50+RS*2,0,100)*0.14` enters PriorityScore and raw relativeStrength is the sixth deployed comparator. RS=0 still contributes 7 PriorityScore points; score saturates at <=-25% / >=+25%.
- This confirms RS double-layer influence and potential redundancy with existing ret20/setup/overheat/momentum state; incremental value must be proven after those controls.
- V8.14 already preserves exact sector hard-gate inputs/checks and bounded SECTOR_GATE_REJECTED cohorts; V8.13 preserves sectorFlow/relativeStrength comparator provenance. Exact candidate-level sector absolute amount/maxAmount denominator/stockCount is not fully frozen, so precise historical attribution of the 45-point amount-share component remains incomplete.
- Frozen machine artifact `research/sector_rs_priority_structural_falsification_v0_1.json`; PriorityScore research file updated. No outcome data was used to define these risks.
- Required prospective falsification: within-gate sector-score monotonicity; breadth/avgChange incremental value after gate pass; sector-size/member-count confounding; actual sectorFlow/RS tie-break incidence; RS incremental value after setup/ret20/Residual-RS/regime controls.
- No sector gate, score, RS formula, weight, denominator or comparator change. Any Formal change is Class C with owner approval.
- No FORMAL_OPTIMIZATION_CANDIDATE yet; structural risks are confirmed but empirical outcome materiality remains UNKNOWN.


## B-187 — V8.15 CI verified green + PriorityScore overlap graph frozen (2026-09-27 05:02 Asia/Taipei)
- Fresh canonical read found concurrent research had advanced through B-186; continuation merged rather than overwriting newer work.
- PR #112 repair verification completed: V8 Regression run 36247650523 SUCCESS and V8 Repair CI run 36247650539 SUCCESS at head 0ca163aa2860c25e4c76c59a93fdfe5c785c6981. The prior failures were therefore confirmed as stale V8.14 exact-version test fragility; V8.15 patch application and syntax had already passed. PR #112 remains OPEN/DRAFT/unmerged/undeployed, so no Production claim is made.
- Continued B-186 structurally rather than waiting for prospective outcomes. Built a unified PriorityScore overlap graph across setup, RR, sector, market-RS and consensus.
- Confirmed multi-layer architecture: setup has pass/grade + 28% score + 4th comparator; RR has >=2 gate +14% score + 2nd comparator; sector has hard gate +14% score + 5th comparator; market RS has 14% score + 6th comparator; consensus has source-count bonus gate/overlay + 3rd comparator. Institutional/fundamental remain partially layered but were not overclaimed.
- Key falsification result: nominal weights 28/14/16/14/14/14 are not equivalent to total decision influence because upstream truncation, score saturation, one-decimal rounding, consensus overlay and lexicographic tie-breaks alter marginal influence. Existence of a comparator does not prove materiality because later comparators act only after earlier ties.
- Frozen anti-overfit ablation order: baseline -> remove only duplicated later comparator -> remove only duplicated score contribution -> only then consider rescaling. Gate+weight+comparator may not be changed simultaneously and attributed to one factor.
- Promotion gate frozen: any simplification/reweighting must show non-trivial prospective decision incidence and improve/preserve path/return without material downside, coverage or zero-pick harm across independent dates, A/B, pools, regimes, costs, redundancy and OOS direction.
- Durable artifacts: PRIORITY_SCORE_CALIBRATION_RESEARCH.md commit 6f754c3f4a70990fc8cbdee2e555151796b56c47; machine artifact research/priority_score_overlap_graph_v0_1.json commit 6f6793d429ab5da195e7489513f80e3da357be61.
- No outcome lookup, threshold sweep, Formal change, Production deploy or new FORMAL_OPTIMIZATION_CANDIDATE. Structural overlap is confirmed; empirical materiality remains UNKNOWN.
- Exact next continuation: audit which overlap metrics are already prospectively observable from V8.13/V8.14/V8.15 snapshots without runtime changes, especially first-differing-comparator incidence and score saturation. Freeze a research-only replay spec that removes one duplicated layer at a time while preserving the identical admitted candidate set. If historical candidate-set completeness is insufficient, mark historical replay UNKNOWN and use prospective Shadow only. Continue automatically into institutional/fundamental overlap or another evidence-ready lane rather than tuning weights.


## B-188 — Signal-grade asymmetry + whole-system influence-layer map (2026-09-27 Asia/Taipei)
- Formal channel labels and signal grades are different objects despite both using A/B letters: channel A=pullback, channel B=breakout; signalLevel A/B/C is derived ONLY from setupQuality (>=80 / >=65 / otherwise C rejected).
- Signal grade ignores institutional/fundamental/sector/market-RS/RR and market-consensus inputs directly. It is therefore supported semantically only as a setup-quality grade, not an overall candidate-quality grade.
- Structural asymmetry is exact:
  - A raw qualifying setupQuality spans ~38–82, then the grade>=65 rule creates an extra effective A eligibility gate.
  - B raw qualifying setupQuality spans ~69.65–100, so a valid B setup structurally cannot become C under current formulas.
  - A-grade for channel A requires volumeTodayVsPrev5<=0.9 AND |pullbackPct-7|+supportDistancePct<=0.667; if volume>0.9, A channel cannot reach signal A because max setupQuality is 74.
- Machine artifact `research/signal_grade_channel_asymmetry_v0_1.json` freezes the above without outcome data.
- Whole-system influence map now proves nominal 28/14/16/14/14/14 PriorityScore weights are NOT total decision influence:
  - setup also controls channel existence, C rejection, later setup tie-break and capital via PriorityScore;
  - sector also has a hard gate and later sectorFlow tie-break;
  - RR also has RR>=2 hard gate and raw RR tie-break;
  - fundamentals also have data-count/quality hard gates;
  - institutions have a conditional >=70 gate for 10–30bn market-cap exception;
  - RS also has raw relativeStrength tie-break;
  - market consensus overlays +0..7 into PriorityScore and has its own later comparator.
- Post-consensus PriorityScore then acts again as first ranking key and as proportional planned-capital weight. Layer count is structural exposure, NOT a pseudo-weight or proof of harmful double-counting.
- Machine artifact `research/formal_influence_layer_map_v0_1.json` freezes the decision-path map.
- Capital-utilization cross-check prevents duplicate research: prior durable work already proves 35% per-name cap is not redistributed, but the dominant open hypotheses are BUY conversion/untriggered first tranche, second-tranche reserve and cash-state attribution. Cap redistribution alone is not promoted as a new optimization.
- Required prospective work: gate attrition by factor, within-qualified incremental value, actual tie-break incidence, score-to-capital calibration, signal-grade calibration within channel, and discordant grade-vs-PriorityScore cells.
- No threshold, grade label, gate, weight, comparator or capital rule changed. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: audit ATR/volatility multi-layer influence because current Formal applies a 1–10% ATR gate and also feeds ATR into A/B stop geometry, which can indirectly change RR and ranking.


## B-189 — ATR -> stop -> RR channel coupling structural falsification (2026-09-27 Asia/Taipei)
- Fresh Formal audit confirms ATR has multi-layer influence despite not entering PriorityScore directly: atrPercent 1–10 hard gate -> channel-specific stop -> RR hard gate -> RR 14% score -> raw RR comparator -> score-proportional capital.
- Stop semantics differ materially by channel:
  - A: stop=min(support*0.98, structureLow-0.12*ATR);
  - B: stop=breakout-max(0.65*ATR, breakout*0.012).
- Fixed outcome-free witness with B breakout=100, close=101, entry=100.3 and target=110.3: ATR 1%=RR6.67; 3%=4.41; 5%=2.79; 7%=2.04; 8%=1.80 and therefore RR<2 reject; 10%=1.46. This does NOT establish a universal ATR threshold; it proves the coupling.
- Equivalent A witnesses show much weaker or zero ATR sensitivity when support*0.98 is the binding stop, and only gradual RR decline when structureLow-0.12*ATR binds. Same ATR% therefore does not imply same effective selection penalty across A/B.
- Research implication: ATR effect, stop-binding state, RR effect and channel must be decomposed. A high-RR effect may partly be a low-volatility/narrow-stop effect; a high-ATR penalty may already be implemented indirectly through RR.
- Frozen machine artifact `research/atr_rr_channel_coupling_v0_1.json`; Volatility lane advanced VR-018 and PriorityScore research cross-linked.
- Existing Shadow preserves atrPercent/channel/RR and selected plan stop/target; exact counterfactual target/stop for all pre-plan rejects remains incomplete and must not be fabricated from mutable history.
- No ATR gate, stop formula, RR gate/weight or channel rule change. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: audit the 10–30bn small-cap exception because it labels institutionalScore>=70 as a strong special reason even though institutionalScore mixes actor flows/streaks with TDCC holder concentration.


## B-190 — Liquidity admission gate Shadow gap / rejected-control protocol (2026-09-27 Asia/Taipei)
- Fresh Formal path audit confirms liquidity admission is an early `basePassed=false` layer before quarterly/valuation/sector/A-B/RR logic:
  - close<1000 => primary minLots=1000; close>=1000 => minLots=300;
  - below minLots can pass only if avgAmount20>=NT$50m, spreadPercent is observed <=0.5%, and orderBookDepthGood=true or depthScore>=80;
  - 10–30bn market cap additionally requires avgVolume20Lots>=1.5*minLots AND institutionalScore>=70;
  - 30–100bn market cap additionally requires avgVolume20Lots>=1.2*minLots unless the low-volume exception passed.
- Major evidence-design defect is confirmed:
  - existing BROAD_CONTROL explicitly requires avgVolume20Lots>=minLots, so low-liquidity rejects are excluded by construction;
  - existing REJECTED_AFTER_BASE keeps only result.basePassed===true, while all three liquidity-admission rejection paths return basePassed=false.
  - Therefore no standard Shadow cohort currently provides an honest `LIQUIDITY_REJECTED_CONTROL`.
- This means current research cannot distinguish protection value from opportunity cost of the liquidity gate. Candidate scarcity/idle capital alone is not evidence for relaxing the gate.
- Formal low-volume exception provenance audit: exact fields `spreadPercent`, `orderBookDepthGood`, `depthScore` are read by scoreCandidate, but repository search finds no repository-side constructor/assignment for those exact fields. However `normalizeEnrichmentPayload -> mergeEnrichment(...extra) -> buildMarketFeatures(...stock)` permits arbitrary external enrichment fields to flow into Formal. Correct state is `REPO_UPSTREAM_NOT_PROVEN / EXTERNAL_INJECTION_FEASIBLE / PRODUCTION_COVERAGE_UNKNOWN`, not “dead exception.”
- V8.8.1 research microstructure fields `spreadPct/bidDepth5/askDepth5/depthImbalance` have different names/timing and cannot be silently treated as the Formal exception inputs.
- Frozen prospective cohorts:
  - LIQ_LOW_AVG_VOLUME_REJECTED;
  - LIQ_SMALLCAP_SPECIAL_REASON_REJECTED;
  - LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED;
  - LIQ_LOW_VOLUME_EXCEPTION_PASS descriptive positive control.
  Every rejected row must keep `fullFormalCounterfactual=false`; later A/B checks may be descriptive only because downstream Formal gates were never reached.
- Required evidence: exact reject reason/count, continuous avgVolume20Lots/minLots distance, avgAmount20, exception-input presence/provenance, price/size/sector/regime/ATR/RS context, D1-D20/MFE/MAE and valid execution-cost/spread/depth evidence. Bounded sampling may describe outcomes but cannot estimate total opportunity loss without sampling fractions/full coverage.
- Engineering boundary: rejected-cohort serialization can be a future Class-A candidate only if it reuses already-computed feature/result objects, makes zero new market calls and leaves Formal outputs invariant. Any shared enrichment/spread-depth source repair is Class B proposal-first. Gate reformulation is Class C.
- Optimization bridge is deliberately conditional: `LIQUIDITY_ADMISSION_REFORMULATION` is NOT yet a FORMAL_OPTIMIZATION_CANDIDATE. It may be surfaced only if prospective rejected controls show stable opportunity loss after execution-cost/depth controls, independent dates, price/size/regime strata and OOS, without worse MAE/stop/no-follow-through/zero-pick behavior. If not, retain the current gate.
- Durable files: `LIQUIDITY_ADMISSION_RESEARCH.md`, `research/liquidity_gate_rejected_control_spec_v0_1.json`, Worklist and Master Map cross-links. No Formal/runtime threshold or behavior changed.
- Exact next: continue structural audit of the pre-score admission funnel and identify whether another high-prevalence early gate lacks a counterfactual cohort; do not threshold-sweep liquidity while evidence is absent.


## B-191 — Portfolio Risk Tier-A v0.2 deployment/concentration/channel decomposition (2026-09-27 Asia/Taipei)
- Continued B-182 using only immutable plan-time journal fields and read-only Production journal access. No forward outcome fields were read; no Worker/runtime/Formal behavior changed.
- PR #115 `Portfolio Risk Tier-A v0.2 decomposition` merged to main at `186a205aec8b40bfac2453309aaba7d3d2668351` after all three checks passed: Portfolio Risk Tier-A Research run 36271728940 SUCCESS, V8 Regression run 36271728934 SUCCESS, V8 Repair CI run 36271729017 SUCCESS.
- Tier-A v0.2 separates three quantities that were previously easy to conflate:
  1. deployment ratio / structural reserve;
  2. concentration inside deployed risky capital (`deployedCapitalHHI`, `effectiveCapitalNames`);
  3. total-account risky-name footprint `sum((allocation_i/totalCapital)^2)`, with cash not treated as another stock.
- Production read-only evidence falsifies standalone `effectiveCapitalNames` interpretation. 2026-09-21 had one deployed name (effectiveCapitalNames=1) but only 35% deployment and total-capital risky-name HHI=0.1225. 2026-09-18 had effectiveCapitalNames=2.9672 but 84% deployment and higher total-capital risky-name HHI=0.2378.
- Portfolio heat is now decomposed into deployment and stop-risk intensity on deployed capital. 2026-09-18 heat=2.0221%-3.2417% with deployed-capital stop-risk intensity=2.4073%-3.8592%; 2026-09-21 heat=0.5276%-1.3070% with intensity=1.5074%-3.7343%.
- Formal A/B plan construction mechanically confounds stop-risk intensity. At the conservative buyHigh endpoint, deterministic minimum planned-risk floors are A=3.7328% and B=2.1782%, but live counterevidence prevents ordinal channel claims: 2026-09-18 B-only plans had high-end intensity 3.8592%, slightly above the 2026-09-21 A-only plan at 3.7342%. Channel must be controlled; A>B or B>A is not supported.
- Capital-utilization semantics were also split. Formal nominal deployment targets remain 0/35/60/85% for 0/1/2/3+ names, with 35% per-name cap and NT$1,000 flooring; capped/rounded residual is not redistributed. On 2026-09-18 nominal target was 85%, actual 84%: 15% was designed structural reserve and 1%=NT$2,000 was allocation implementation shortfall. On 2026-09-21 target and actual were both 35%, so shortfall was zero.
- Therefore "all cash = no opportunity / overly strict BUY logic" is structurally false. Future capital-utilization analysis must separate no eligible plan, nominal structural reserve, cap/rounding shortfall, pending-entry cash, post-reduction cash and data/signal-blocked cash.
- Durable artifacts: `research/portfolio_risk_tier_a_v0_2.mjs`, `research/portfolio_risk_tier_a_history_v0_2_receipt_20260927.json`, `research/portfolio_risk_channel_stop_geometry_v0_1.json`, `research/portfolio_risk_deployment_geometry_v0_1.json`, dedicated tests/read-only audit and updated `PORTFOLIO_RISK_TIER_A_AUDIT.md`.
- Only two non-zero plan dates are currently reconstructable. This is structural/reconstructability evidence, not a safe heat threshold, concentration cap, channel ranking or predictive result. PORTFOLIO_RISK remains L2 / FALSIFICATION_IN_PROGRESS.
- Correlation20/60, empirical clusters, shrinkage covariance, marginal/component risk and downside correlation remain PIT_HISTORY_REQUIRED. Actual-live heat remains conditional on complete BUY/ADD/REDUCE/SELL event coverage.
- No FORMAL_OPTIMIZATION_CANDIDATE. Exact next for this lane: audit trade-journal signal/event coverage read-only to determine whether actual-live position lifecycle can be reconstructed without inventing fills. If coverage is incomplete, mark actual-live heat UNKNOWN and keep plan-time Tier-A separate.


## B-192 — Formal 9.8% extreme-return gate is not exchange price-limit state (2026-09-27 Asia/Taipei)
- Current Formal early gate is `abs(changePercent || 0)>=9.8 -> 單日走勢過度異常 / basePassed=false`. It must be interpreted as an EXTREME_DAILY_RETURN_PROXY, not an official limit-up/down classifier.
- Current TWSE rules define daily stock limits from the opening-auction reference +/-10% and then legalize to the applicable tick without exceeding the boundary; some newly listed common-stock sessions have no limit. Exact state is therefore reference/tick/rule dependent.
- Outcome-free legal counterexamples prove bidirectional semantic disagreement:
  - reference 91.80 -> theoretical +10%=100.98; at price >=100 legal tick=0.50, so exact limit-up=100.50 = +9.4771%. Formal 9.8 proxy does NOT reject a true exact limit-up.
  - reference 11.45 -> theoretical -10%=10.305; legal tick=0.05, so exact limit-down=10.35 = -9.6070%. Formal proxy does NOT reject a true exact limit-down.
  - TWSE official example reference 40.60 gives exact limit-up=44.65 / limit-down=36.55. Legal non-limit closes 44.60 (+9.8522%) and 36.60 (-9.8522%) ARE rejected by the Formal 9.8 proxy.
- Therefore the proxy has both exact-limit false negatives and non-limit false positives. This does not prove it is economically inferior: it may intentionally guard near-limit/extreme-day chase and liquidity risk.
- `normalizeMarketRow` maps exchange marker X/non-comparable to change=null -> changePercent=null; this particular gate then treats `changePercent||0` as 0. Other corporate-action/history/data-quality guards may still reject; the finding is only that the 9.8 gate is not a complete abnormal-session classifier.
- Shadow coverage is incomplete but not zero: REJECTED_AFTER_BASE cannot capture this gate because basePassed=false; BROAD_CONTROL may incidentally sample high-liquidity extreme-day names but is bounded to 6/pool and not stratified by the gate.
- Existing DL-001 exact price-limit research remains the semantic owner. It already rejects approximate 9.5% heuristics as authoritative and validates TWSE TWT84U / TPEx S38 as prospective exact-state sources. No duplicate factor lane was created.
- Frozen machine artifact `research/extreme_daily_move_gate_falsification_v0_1.json`; `INFORMATION_DISCRETENESS_SHADOW_SPEC.md` now cross-links the Formal gate.
- Future evidence must cross-tab proxy reject direction with exact official CLOSE_LIMIT_UP / CLOSE_LIMIT_DOWN / NON_HIT / NO_PRICE_LIMIT / NON_COMPARABLE_X / UNKNOWN, split next-open vs open-to-close and include execution/liquidity/event/corporate-action controls. Positive and negative extreme moves may never be pooled for directional inference.
- `EXTREME_MOVE_ADMISSION_REFORMULATION` is NOT yet a FORMAL_OPTIMIZATION_CANDIDATE. Only prospective exact-state/OOS/cost/downside evidence can promote it; no 9.8 threshold or Formal behavior changed.
- Exact next: audit the entire basePassed=false admission funnel against Shadow cohort coverage to identify which pre-score exclusions are strategy hypotheses versus data-quality/universe policies and which lack counterfactual evidence.


## B-193 — Correction: liquidity Shadow coverage narrowed precisely (2026-09-27 Asia/Taipei)
- Full early-admission funnel audit found B-190 used an overbroad phrase when describing BROAD_CONTROL coverage. Durable liquidity files are corrected; no Formal behavior was involved.
- Exact corrected coverage:
  - primary `20日流動性不足`: systematically absent from BROAD_CONTROL because BROAD_CONTROL itself requires avgVolume20Lots>=minLots;
  - `10至30億市值缺少強力特殊理由`: can incidentally appear in BROAD_CONTROL when avgVolume20Lots>=minLots but 1.5x/institutional condition fails; exception-pass rows below minLots that later fail 1.5x remain absent;
  - `30至100億市值流動性要求未達`: generally occurs between 1.0x and 1.2x minLots and can therefore appear incidentally in BROAD_CONTROL;
  - all three remain absent from REJECTED_AFTER_BASE because each returns basePassed=false.
- BROAD_CONTROL remains bounded to six rows per price pool and is not rejection-reason stratified, so incidental presence cannot establish prevalence or a clean gate-level counterfactual.
- Correct research state: `PRIMARY_LOW_VOLUME_SYSTEMATIC_HOLE / SIZE_CONDITIONED_INCIDENTAL_BOUNDED_COVERAGE / DEDICATED_REASON_STRATIFIED_CONTROL_STILL_REQUIRED`.
- `research/liquidity_gate_rejected_control_spec_v0_1.json`, `LIQUIDITY_ADMISSION_RESEARCH.md`, Worklist and Master Maps were corrected. No outcome conclusion or threshold proposal changed.


## B-194 — Entire basePassed=false admission funnel mapped; reason-level denominator requirement frozen (2026-09-27 08:30 Asia/Taipei)
- Fresh-read canonical had concurrently advanced through B-193; continuation used B-192/B-193 exact next and did not overwrite newer research.
- Audited current scoreCandidate early exits in exact order. Ten basePassed=false states are now separated into UNIVERSE_POLICY (price<10, marketCap<1bn), DATA_READINESS (history<60, missing market/sector RS, missing market cap, missing chip concentration), MARKET_STATE_PROXY (abs daily change>=9.8), and EXECUTABILITY_POLICY_HYPOTHESIS (three liquidity/size-conditioned gates).
- Key semantic correction: DATA_READINESS rejects are not bad stocks and should not be evaluated as alpha vetoes. Universe-policy rejects require a deliberate universe-expansion study, not ordinary factor tuning.
- Confirmed all basePassed=false rows are absent from REJECTED_AFTER_BASE by construction. BROAD_CONTROL is not a complete reason-stratified admission ledger; B-193's exact liquidity coverage distinctions remain authoritative.
- New evidence-design requirement: a bounded rejected sample cannot estimate total opportunity loss, missed winners, zero-pick reduction or capital-utilization effect without per-scanDate reason denominators/sampling fractions. Frozen receipt fields: eligibleBeforeReasonCount, rejectedByReasonCount, archivedRejectedCount, samplingRule, samplingFraction, unknownCount.
- Priority evidence holes: EXTREME_MOVE_PROXY_REJECTED, primary low-volume reject, then size-conditioned liquidity rejects. Data-readiness rows are coverage diagnostics. PRICE_LT10/MARKETCAP_LT1BN remain universe-policy controls unless owner later chooses to study universe expansion.
- Downstream A/B/RR/fundamental states may not be imputed for an early reject that Formal never evaluated. Any such counterfactual must be separately labeled and recomputed only from immutable same-scan inputs.
- Durable artifacts: BASE_ADMISSION_FUNNEL_RESEARCH.md commit 884a8f139f99047612a16572d33a42086833b10b; research/base_admission_funnel_v0_1.json commit a69d693e660a6d9c5f4c22a35e9f2d4f028cf5dd.
- No outcomes, threshold sweep, Formal/runtime/Production change or FORMAL_OPTIMIZATION_CANDIDATE. Status COUNTERFACTUAL_COVERAGE_GAP_CONFIRMED / FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.
- Exact next continuation: audit whether current full-scan in-memory diagnostics already contain enough rows/reasons to persist per-reason counts and bounded strategy-hypothesis rejects with zero extra market calls. If yes, prepare a Class-A prospective instrumentation design/branch with Formal-output invariant tests; if serialization requires shared runtime or changes scan behavior, downgrade to Class-B proposal-first. Continue independently into the next evidence-ready admission/technical-structure lane rather than tuning thresholds.


## B-195 — Portfolio Risk actual-live lifecycle falsification (2026-09-27 08:31 Asia/Taipei)
- Continued B-191 exact next after fresh canonical read through B-194. No forward outcomes were used and no Worker/runtime/Formal state was changed.
- Source-contract audit confirmed `v8_trade_journal_signals` is a monitor/signal-event ledger. Its `signal_shares` and `market_price` are advisory/observed fields, not broker-confirmed executions. The journal response has no append-only confirmed-fill contract with fill id/price/shares/position before-after/average cost after.
- `/api/positions` is a mutable current-position reconciliation snapshot. It can describe current holdings when actualShares/averageCost/firstEntryConfirmedAt are complete, but it does not preserve the historical sequence of BUY/ADD/REDUCE/SELL fills.
- Class-A Production read-only audit PR #116 used only `/api/journal?days=365` and `/api/positions`. Workflow run 36282609086 SUCCESS; V8 Repair run 36282609096 SUCCESS; V8 Regression run 36282609109 SUCCESS.
- Production witness at 2026-09-27T00:29:03Z: 4 recorded journal days, 4 Formal plan rows, 1 signal row (BUY), 1 ownership-changing signal with suggested shares and observed market price, zero explicit confirmed-fill fields, 2 current position rows, 0 current holdings, 0 complete current holding snapshots.
- Falsification result: `actualLiveLifecycleHistorical=false` and `actualLiveHeatHistorical=false`. This is a contract-level block, not merely a small-sample warning.
- Permanent firewall: never treat signal_shares as filled shares; never treat signal market_price as execution price; never roll current actualShares backward through time; never infer ADD/REDUCE quantities from plan shares without confirmed execution.
- Plan-time Tier-A remains valid where immutable plan fields exist: projected heat, deployment ratio, concentration decomposition, projected stop-risk intensity and reserve decomposition.
- PR #116 merged at `eddd5a70e4580d3797588a5f5d0339dafe25d6f7`. Durable artifacts: `research/portfolio_risk_live_lifecycle_contract_v0_1.json`, `tests/portfolio_risk_live_lifecycle_readonly_audit.mjs`, `research/portfolio_risk_live_lifecycle_production_readonly_receipt_20260927.json`.
- Lane state: `PORTFOLIO_RISK = FALSIFICATION_IN_PROGRESS / PLAN_TIME_TIER_A_RECONSTRUCTABLE / ACTUAL_LIVE_HISTORY_BLOCKED`. L2 retained. No allocation/ADD/REDUCE/stop/monitor/push change and no FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: freeze a research-only append-only confirmed-fill ledger contract with position-transition invariants and reconciliation semantics. Any shared Production storage/API implementation is Class B proposal-first. Do not implement it into Production merely because the research schema exists.


## B-196 — REJECTED_AFTER_BASE reason-selection bias / Class-A prototype validated (2026-09-27 Asia/Taipei)
- Fresh source audit confirmed generic `REJECTED_AFTER_BASE` previously sorted all basePassed=true rejects by exclusion reason then symbol, then retained only the first 6 rows per GENERAL/THOUSAND pool. This is NOT per-reason sampling.
- Outcome-free synthetic falsification proves deterministic reason starvation: a large alphabetically earlier reason can consume all six rows and leave another real rejection reason with zero archive representation.
- V8.14's dedicated `SECTOR_GATE_REJECTED` already partially avoids this for sector-gate analysis; other fundamental/volatility/target/RR/signal-grade gates remain exposed to generic reason-selection bias.
- Frozen artifact: `research/rejected_after_base_sampling_falsification_v0_1.json`. Worklist now records the evidence-infrastructure defect.
- Class-A research-only prototype created on branch `research/reject-reason-stratified-shadow-20260927`, draft PR #117. It does NOT bump the runtime version and is NOT wired to production deployment.
- Prototype changes research evidence only:
  - deterministic exact reason × price-pool sampling, 2 rows per reason/pool where available;
  - `reasonPopulationCount / reasonSampleCount / reasonSampleRank` metadata;
  - full per-scan exact-reason population counts in the in-memory research archive/scan research summary;
  - already-used dedicated cohort symbols are excluded from generic resampling;
  - persisted summary exposes sampled exclusion-reason counts with explicit sample-only semantics.
- Synthetic test reproduces old failure (REASON_B=0 under old first-six slicing) and verifies new minority-reason preservation, exact population counts and input-order-independent deterministic sampling.
- Initial Repair CI failed because the PR workflow ran the new test without applying the prototype patch; this was diagnosed as CI wiring, not research logic. Commit `591886d2c00f89a30e0045ea5d1149799dd9a9a9` adds the missing isolated apply step.
- Final CI on that head:
  - V8 Regression Tests run 36282786022 = SUCCESS;
  - V8 Repair CI run 36282786141 = SUCCESS.
- Production remains `8.14.0-sector-gate-provenance-shadow`; no merge/deploy was performed because V8.15 is already occupied by concurrent Valuation Provenance PR #112. PR #117 intentionally remains Draft pending version-line reconciliation.
- No Formal A/B rule, score, threshold, rank, 3+3/Top6, capital, BUY/ADD/REDUCE, monitoring, signal or push behavior changed.
- Exact next: audit the `nearestRealResistance -> target -> RR` provenance chain. Current source reads optional `targetPrice` plus priorHigh20/priorHigh60/pivot highs, while repository-side production of `targetPrice` is not proven and the selected target-source identity is not preserved in Shadow.


## B-197 — Target / resistance / RR provenance and geometry falsification (2026-09-27 Asia/Taipei)
- Fresh Formal audit: `nearestRealResistance(f,entry)` pools optional `targetPrice`, priorHigh20, priorHigh60 and historical two-left/two-right local pivot highs; only levels strictly >entry*1.01 qualify; the minimum eligible price becomes target. target=null rejects before RR; then target feeds RR>=2, RR 14% PriorityScore, raw RR comparator and eventual capital.
- Repository-wide audit finds `targetPrice` read but no repository-side Formal producer/assignment. External enrichment can inject arbitrary fields through `normalizeEnrichmentPayload -> mergeEnrichment(...extra) -> buildMarketFeatures(...stock)`. Correct state: `REPO_PRODUCER_NOT_FOUND / EXTERNAL_INJECTION_FEASIBLE / PRODUCTION_COVERAGE_UNKNOWN`. No analyst-target semantics, source, asOf/knownAt or PIT safety may be assumed.
- Fixed outcome-free eligibility flips prove targetPrice is materially capable:
  - entry100/stop95, no historical level >101 => target=null reject; same technical geometry + targetPrice115 => target115, RR3.
  - historical resistance120 => RR4; add nearer targetPrice105 => target105, RR1 reject.
  - farther targetPrice130 leaves historical120 as target and does nothing.
- B-channel structural dependency is stronger: B entry=priorHigh20*1.003, so priorHigh20 can never be a target. If a breakout is also at/above prior60-session highs/pivots, all retained historical targets are <=breakout<entry*1.01. Without qualifying targetPrice, a genuine new-high B setup becomes target-null and is rejected. This is a structural tension, not evidence that new-high breakouts should be admitted.
- Local-pivot semantics are also coarse: a pivot needs only high>=two prior highs and >=two following highs; no prominence, touch count, age, volume, ATR-normalized importance, zone width or MICRO/BASE/MAJOR hierarchy is encoded.
- Opposing counterexamples prevent one-sided relaxation:
  - entry100/stop95, local pivot102 + major resistance120 => nearest target102, RR0.4 reject; a minimally-defined local pivot can dominate the major level.
  - overhead100.8 + priorHigh60=120 => <=1% overhead is ignored, target120, RR4 pass; the fixed 1% band can also make RR optimistic.
  - only 100.8/100.9 overhead => both ignored, target=null reject.
- Therefore the 1% eligibility band is neither uniformly conservative nor permissive; future study must audit both false-conservative and false-optimistic geometry.
- Current Shadow does not freeze raw targetPrice provenance, all eligible levels, selectedTargetSource, historical target date or target-null decomposition, so later outcomes cannot answer attribution cleanly.
- Pattern lane is the independent robustness comparator: it already freezes repeated-resistance progression, major-zone lifecycle and scale hierarchy, and explicitly avoids a hard available-air veto before evidence. No Pattern output was substituted into Formal.
- Durable files: `research/target_resistance_rr_provenance_falsification_v0_1.json`, `TARGET_RESISTANCE_RR_RESEARCH.md`; Shared Knowledge inventory cross-linked the reusable resistance-lifecycle semantics while keeping V8 target/RR thresholds SYSTEM1_IMPL.
- Future evidence capture should preserve targetPrice raw/source/asOf/PIT state, priorHigh20/60, dated pivots, eligible-level set, selected target/source, target-null state and RR. No historical targetPrice backfill from later-known information.
- Status: `STRUCTURAL_PROVENANCE_RISK_CONFIRMED / EVIDENCE_CAPTURE_WARRANTED / NOT_FORMAL_OPTIMIZATION_CANDIDATE`. Any target/null/RR formula change is Class C; no Formal behavior changed.
- Exact next: continue post-base gate audit with RR<2 vs target-null separated, then fundamental-quality and setup-grade gates after reason-stratified Shadow evidence is available. Do not pool target-source failure with genuine low-RR geometry.


## B-198 — Confirmed Fill Ledger v0.1 research contract validated (2026-09-27 08:37 Asia/Taipei)
- Continued B-195 exact next without changing Worker/runtime/Formal behavior.
- Confirmed Fill Ledger v0.1 freezes the minimum append-only execution-evidence contract required before historical actual-live position size/heat can be reconstructed.
- Signal and execution identities are explicitly separated: `signalEventId` may link to a fill, but may never substitute for `executionEventId`. A strategy BUY signal that was never filled remains a signal only.
- Required execution evidence: executionEventId, source, sourceRecordId, symbol, planScanDate, action, occurredAt, confirmedAt, fillPrice, filledShares, sharesBefore, sharesAfter, averageCostAfter and reconciliationStatus.
- Position invariants: BUY/ADD after=before+filled; REDUCE/SELL after=before-filled; REDUCE must leave >0 shares; SELL must close to 0; next confirmed event's sharesBefore must equal prior sharesAfter for the same symbol.
- Correction semantics are append-only: a corrected receipt appends a new CORRECTED event pointing at `correctsExecutionEventId`; prior execution evidence is never mutated/deleted.
- Sources are explicit and quality-bearing: BROKER_IMPORT, MANUAL_CONFIRMED, VERIFIED_EXTERNAL. Future better sources do not retroactively validate older signal-only periods.
- Synthetic falsification covers valid BUY->ADD->REDUCE->SELL sequence, signal/execution ID collision, invalid position arithmetic, REDUCE-to-zero, incomplete SELL, cross-event chain break and invalid correction target.
- PR #118 was superseded because concurrent checkpoint work advanced main; PR #119 rebased the identical research contract onto newer main and preserved all concurrent research.
- Final PR #119 CI: Portfolio Risk Tier-A Research run 36283027515 SUCCESS; V8 Repair CI run 36283027513 SUCCESS; V8 Regression Tests run 36283027521 SUCCESS. PR #119 merged at `50386ae7fb53f62b34892a3170c269b843b4aeb8`.
- Durable artifacts: `research/confirmed_fill_ledger_v0_1.mjs`, `tests/test_confirmed_fill_ledger_v0_1.mjs`, `research/confirmed_fill_ledger_spec_v0_1.json`.
- Status: `CONFIRMED_FILL_LEDGER_V0_1 = DESIGN_READY / CLASS_B_PROPOSAL_FIRST / NOT_IMPLEMENTED`.
- Engineering boundary: research schema/tests are Class A; any shared Production D1 table, write API, broker import, reconciliation UI or runtime wiring is Class B and requires explicit owner approval. This design does not generate signals and does not change Formal allocation/stops/BUY/ADD/REDUCE/SELL.
- Portfolio Risk remains L2 / FALSIFICATION_IN_PROGRESS / ACTUAL_LIVE_HISTORY_BLOCKED until separately approved Production fill capture exists and accumulates prospective confirmed receipts.
- No FORMAL_OPTIMIZATION_CANDIDATE is created from this evidence-infrastructure design alone.
- Exact next: audit the minimal safe Production implementation path, especially whether existing manual `/api/positions` reconciliation can append confirmed execution evidence without conflating snapshots with fills, and whether an external broker/verified source is required for trustworthy automatic capture. Proposal only; do not implement without owner approval.


## B-199 — Target-null vs low-RR semantic separation protocol frozen (2026-09-27 08:42 Asia/Taipei)
- Fresh canonical read found B-198 as latest cursor; B-197 target/resistance/RR exact-next was continued without overwriting B-198's independent Portfolio Risk lane.
- Formal source audit confirms two distinct post-plan rejection states: `target===null` rejects before RR exists; only when a target exists is `RR=(target-entry)/(entry-stop)` computed and `RR<2` evaluated.
- Therefore TARGET_NULL is not a low-RR observation. Its RR is undefined/UNKNOWN and must never be coerced to 0 or pooled into the RR<2 cohort. Pooling would confound target-source/provenance/geometry failure with genuine unfavorable reward-to-risk geometry.
- Frozen prospective cohorts: TARGET_NULL_REJECTED, LOW_RR_REJECTED and RR_PASSED_POSITIVE_CONTROL. Required receipt preserves channel, entry/stop/risk, raw targetPrice provenance/PIT state, priorHigh20/60, dated pivots, eligible resistance set, selected target/source, reward/RR and exact reason×pool denominator/sample metadata.
- Pre-registered falsification asks whether target-null and low-RR independently add path/downside information after channel, ATR/stop-binding, liquidity, sector/regime and existing-score controls; whether B new-high structures are structurally concentrated in target-null; and whether optional targetPrice or coarse pivots/1% eligibility band materially flip status.
- Anti-bias firewall: no later-known targetPrice backfill; UNKNOWN remains UNKNOWN; scanDate is clustering unit; preserve first rejection reason; no RR/1% threshold sweep before prospective maturity; transaction cost, coverage, zero-pick, redundancy and OOS gates remain mandatory.
- Engineering classification is CONDITIONAL_CLASS_A only for zero-extra-call serialization of already-computed same-scan evidence with Formal-output invariants. Shared enrichment/storage/runtime changes are Class B; any target/RR rule change is Class C.
- Durable artifact: `research/rr_target_null_separation_v0_1.json` commit `73134aa687c89357a589e4a402ab297b71ae22ba`.
- No forward outcome lookup, Formal/runtime/Production change or FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: after reason-stratified Shadow/version-line reconciliation, prospectively serialize the three separated cohorts and measure date-clustered incidence/outcomes. In parallel continue the post-base audit into fundamental-quality/setup-grade gates without tuning thresholds.


## B-200 — Confirmed Fill Ledger v0.2 bootstrap / PIT semantics validated (2026-09-27 08:45 Asia/Taipei)
- Continued B-198 exact next after preserving concurrent B-199 Target/RR research.
- Further falsification found v0.1 could not safely bootstrap positions that already existed when execution-ledger capture begins. Example: 100 shares already held, first ledger-era action REDUCE 40. Without an opening-state receipt, sharesBefore=100 has no append-only provenance.
- v0.2 separates `POSITION_BASELINE` from `FILL`. A baseline records observed account+symbol shares/cost at ledger start and is explicitly NOT a trade: it has no action, fillPrice, filledShares or sharesBefore and contributes nothing to return/turnover/slippage attribution.
- Pre-baseline execution history remains UNKNOWN. A FILL may start without baseline only for a clean zero->BUY transition with sharesBefore=0. First observed ADD/REDUCE/SELL requires a valid baseline.
- `effectiveAt` and `confirmedAt` are separate. Later corrections are append-only and affect an as-known research view only after the correction's confirmedAt; they do not rewrite earlier PIT knowledge.
- `accountKey` is mandatory so same-symbol positions across accounts are not silently mixed.
- Safe implementation conclusion: existing mutable `/api/positions` saves must NOT auto-generate historical fill events. A future Production implementation needs a separate append-only execution/baseline ledger; /api/positions may remain a current snapshot/read model.
- Repository search found no broker execution/order/fill connector in current scripts. Existing market-data/Fugle quote paths are not broker execution evidence.
- PR #120 CI all passed: Portfolio Risk Tier-A Research run 36283315443 SUCCESS; V8 Repair run 36283315415 SUCCESS; V8 Regression run 36283315425 SUCCESS. PR #120 merged at `cbf00ccd4fba6760e23cb836092ad8842e41929b`.
- Durable artifacts: `research/confirmed_fill_ledger_v0_2.mjs`, `tests/test_confirmed_fill_ledger_v0_2.mjs`, `research/confirmed_fill_ledger_spec_v0_2.json`.
- Status: `CONFIRMED_FILL_LEDGER_V0_2 = DESIGN_READY / CLASS_B_PROPOSAL_FIRST / NOT_IMPLEMENTED`. No Worker/runtime/Formal behavior changed and no FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: freeze the minimal Class-B Production proposal (additive D1 schema, append-only API, idempotency/conflict semantics, transaction/position-head checks, rollback and read-model isolation). Proposal only; implementation requires explicit owner approval.


## B-201 — Confirmed Fill Ledger v0.2.1 provenance self-correction (2026-09-27 08:49 Asia/Taipei)
- Class-B proposal preparation falsified one omission in v0.2 before Production design: when splitting POSITION_BASELINE from FILL, v0.2 accidentally dropped v0.1's stable `planScanDate` requirement for fills.
- v0.2.1 restores exact plan provenance: every FILL requires `planScanDate`; POSITION_BASELINE may omit it because a pre-existing holding can predate monitored plans.
- v0.2.1 also requires `ledgerEpochId` on every event and materializes state by `accountKey|symbol|ledgerEpochId`. This prevents a later coverage restart/baseline from being mixed with a previous ledger epoch.
- Existing protections remain: baseline is not a trade; zero->BUY may start without baseline; ADD/REDUCE/SELL need prior same-epoch state; effectiveAt and confirmedAt remain separate; correction is append-only and PIT-aware.
- This correction was made before any Production proposal or implementation. v0.2 is superseded as an implementation base; only v0.2.1 may feed a future Class-B proposal.
- PR #122 validation all passed: Portfolio Risk Tier-A Research run 36283539781 SUCCESS; V8 Repair run 36283539774 SUCCESS; V8 Regression run 36283539805 SUCCESS. PR #122 merged at `3e771a0f5e34c7716c49d13fb1beb24cfc2b7510`.
- Durable artifacts: `research/confirmed_fill_ledger_v0_2_1.mjs`, `tests/test_confirmed_fill_ledger_v0_2_1.mjs`, `research/confirmed_fill_ledger_spec_v0_2_1.json`.
- Status: `CONFIRMED_FILL_LEDGER_V0_2_1 = DESIGN_READY / CLASS_B_PROPOSAL_FIRST / NOT_IMPLEMENTED`. No Worker/runtime/Formal behavior changed.
- Exact next: build the Production proposal from v0.2.1 with additive D1 storage, no-update/no-delete application semantics, idempotent source receipts, explicit head/version checks, read-model isolation, feature flag and rollback. Do not implement without owner approval.


## B-202 — Confirmed Fill Ledger Class-B Production proposal ready; implementation intentionally stopped at approval boundary (2026-09-27 08:52 Asia/Taipei)
- Built the minimal Production proposal only after v0.2.1 survived bootstrap/PIT/provenance falsification. No Production implementation was performed.
- Proposed storage is additive: immutable evidence table `v8_confirmed_execution_events` plus rebuildable derived head cache `v8_execution_position_heads`. Existing journal/positions tables are not replaced.
- Event evidence remains append-only. Corrections insert new rows; application UPDATE/DELETE of execution evidence is prohibited. The derived head is explicitly not evidence and can be rebuilt.
- Proposed API is separate from `/api/positions`: validation-only POST, append-only event POST behind a dedicated write feature flag, read-only events GET and health GET.
- Idempotency is frozen: same event/source receipt + same canonical payload => readback/no new row; same identity + different payload => conflict, never mutation.
- Concurrency guard requires `expectedHeadEventId`; stale predecessor => conflict/refetch/reconcile. Exact D1 atomic event+head transaction semantics must be proven before deploy.
- Correction replay that breaks downstream shares-before/after sets `RECONCILIATION_REQUIRED`; downstream receipts are never silently rewritten.
- Strict isolation remains: no signal->fill conversion, no /api/positions->fill conversion, no quote/candle->execution confirmation, and no Formal read dependency in Phase A.
- Rollback design is low-risk: additive schema remains, write flag can disable capture, Worker code can roll back independently, captured evidence is not deleted, Formal selection/monitoring continues independently.
- Acceptance matrix requires baseline/reduce, zero->BUY, no-baseline rejection, planScanDate, epoch/account isolation, idempotency conflict, stale-head conflict, PIT correction, reconciliation-required, zero writes from /api/positions and signal generation, and Formal-output invariance.
- PR #123 validation all passed: Portfolio Risk Tier-A Research run 36283713896 SUCCESS; V8 Repair CI run 36283713965 SUCCESS; V8 Regression Tests run 36283713944 SUCCESS. PR #123 merged at `147566fccc0fce3327f71460b18c1c9b09c37418`.
- Durable proposal: `CONFIRMED_FILL_LEDGER_CLASS_B_PROPOSAL.md`, `research/confirmed_fill_ledger_class_b_proposal_v0_1.json`, `tests/test_confirmed_fill_ledger_class_b_proposal_v0_1.mjs`.
- Status: `CLASS_B_PRODUCTION_PROPOSAL_READY / OWNER_APPROVAL_REQUIRED / NOT_IMPLEMENTED`.
- This is evidence infrastructure, not a FORMAL_OPTIMIZATION_CANDIDATE by itself. Expected value is enabling trustworthy actual-live Portfolio Risk, Trading Frictions and REDUCE/RE-ADD studies; no claim of improved stock-selection returns is made.
- This is the intentional stop boundary for implementation: any D1/API/runtime deployment requires explicit owner approval.


## B-203 — Setup-grade no-duplicate audit + 3+3 price-pool quota falsification opened (2026-09-27 09:56 Asia/Taipei)
- Fresh-read canonical start B-202; governance/worklist/Master Map/latest main were read first. B-202 Confirmed Fill Ledger is intentionally parked at OWNER_APPROVAL_REQUIRED and was not implemented.
- Anti-duplication correction: the proposed setup-grade structural audit was already durable in canonical research assets. Existing evidence has already frozen SIGNAL_GRADE_A_MIN=80 / B_MIN=65, A qualifying setupQuality about 38–82, B about 69.65–100, A 0.90/0.91 volume discontinuity, and channel-stratified falsification. This work was not repeated.
- Outcome readiness audit: V8.13 PriorityScore/setup provenance has first clean prospective scan date 2026-09-29. As of 2026-09-27 there are no valid clean post-deployment prospective dates for channel outcome calibration. Historical Shadow must not be fabricated/recomputed. Setup-grade outcome work remains WAITING_PROSPECTIVE.
- Continued immediately to a distinct unresolved high-impact Formal structure: thousand/non-thousand independent 3+3 quota. Source audit confirms formalClose >=1000 is THOUSAND, <1000 GENERAL; each pool is capped at 3; unused slots are explicitly diagnosed and cannot cross-fill. Thus final count can be <6 even if the opposite pool has rank-4+ qualified names.
- This proves only a mechanical displacement/opportunity-cost channel, NOT that 3+3 is harmful. Counter-mechanisms include liquidity/execution cost, capital granularity, price-tier concentration and risk diversification.
- Frozen outcome-blind artifact: research/price_pool_quota_falsification_v0_1.json commit 623d10add151df9dc45a29a8f8cd8f7ad8d593c5.
- Pre-registered tests: frequency of unused-slot + opposite-pool >3-qualified dates; exact frozen Formal rank/comparator of displaced rank-4+ names; scanDate-clustered D1/D3/D5/MFE/MAE/stop/no-follow-through only after PIT maturity; liquidity/price/sector/volatility/regime/cost controls; coverage/zero-pick/concentration downside.
- Negative controls: no counterfactual on dates both pools fill 3 or opposite pool has <=3 qualified names; only same-scan actually Formal-qualified candidates may enter; never bypass gates to manufacture candidates.
- Anti-overfit firewall: no sweep of 1+5/2+4/4+2/etc before frozen 3+3 counterfactual matures; no outcome-selected dates; missing full-pool integrity = UNKNOWN; scanDate is independent inference unit; R01-R08/I01-I07, Factor-Zoo, date clustering and transaction-cost controls remain mandatory.
- Observability caveat: bounded QUALIFIED_NOT_SELECTED can support near-cutline evidence but cannot certify historical complete-pool denominators. Full quota opportunity-cost claims require an integrity-certified complete qualified list/rank receipt.
- Optimization bridge: PRICE_POOL_QUOTA_REFORMULATION is DISCOVERY/FALSIFICATION_IN_PROGRESS, NOT_OPTIMIZATION_READY. Any quota/cross-pool Formal change is Class C and requires owner approval only after prospective/OOS falsification. No FORMAL_OPTIMIZATION_CANDIDATE now.
- Engineering: Class A research documentation only. No Worker/runtime/Production/ranking/quota/capital/signal/push behavior changed. Formal Core LOCKED.
- Exact next: audit whether current V8.13+ prospective candidate archive can certify complete per-pool qualified denominators/ranks for 2026-09-29 onward without new runtime mutation. If yes, freeze a quota-opportunity receipt using existing fields; if bounded archive cannot certify it, specify the minimum isolated research receipt and classify Class A vs Class B before implementation. In parallel, do not attempt setup/priority outcome inference before clean prospective dates exist.


## B-204 — Shadow cohort semantic firewall + comparator-lineage correction (2026-09-27 Asia/Taipei)
- Continued the after-market research evidence audit without changing Formal Core.
- Liquidity admission Draft PR #121 is now fully validated on latest head `5c0842d197999eefa82f2a0b0069679a5f6ea070`:
  - Regression run 36283472807 = SUCCESS;
  - Repair run 36283472824 = SUCCESS.
  - Branch-only prototype preserves exact liquidity-reject populations, deterministic reason×pool samples, missing-vs-bad spread/depth exception coverage, and a durable per-date denominator receipt inside persisted Shadow snapshots.
  - PR remains Draft; no version bump, merge, deployment, threshold change or Formal behavior change.
- First-failure attribution is now explicitly separated from gate importance:
  - `scoreCandidate()` is fail-fast;
  - exclusion_reason is only the FIRST observed failure under current gate order;
  - synthetic gate-order reversal changes A/B reason counts while accepted set stays identical.
  - Durable artifact: `research/first_failure_attribution_falsification_v0_1.json`.
  - `REJECTION_REASON_SHADOW_REPAIR_PROPOSAL.md` now requires wording such as `firstFailureCount`; counts may not be interpreted as marginal/unique gate contribution.
- NEAR_MISS cohort semantics were structurally falsified:
  - A and B each have six checks, so `nearScore=max(6-failedA,6-failedB)=6-missingCount`; the second sort key is mathematically redundant.
  - check count ignores threshold distance: B volume 1.29x and 0.10x can both be one-check misses against 1.30x.
  - diagnostics globally truncates to 12 near misses before Shadow's per-pool 6-row cap, so pool/channel starvation is possible before archival sampling.
  - Durable files: `research/near_miss_cohort_falsification_v0_1.json`, `NEAR_MISS_COHORT_RESEARCH.md`.
- BROAD_CONTROL semantics were also falsified:
  - `used` tracks rows actually serialized in prior bounded cohorts, not semantic population membership;
  - sampled qualified/near/rejected rows are excluded from BROAD_CONTROL, while unsampled rows from the same latent populations remain eligible;
  - therefore current BROAD_CONTROL is a **quota-conditioned mixture**: neither an independent frozen broad-market control nor a clean mutually-exclusive residual control.
  - Two coherent future estimands are frozen: independent BROAD_MARKET_CONTROL with overlapping membership metadata, or mutually-exclusive RESIDUAL_CONTROL after full semantic classification.
  - Durable files: `research/broad_control_cohort_contamination_falsification_v0_1.json`, `SHADOW_COHORT_SEMANTICS_RESEARCH.md`.
- R02 Selection Alpha firewall tightened:
  - until cohort semantics/membership QA is repaired, comparisons using BROAD_CONTROL / NEAR_MISS / REJECTED_AFTER_BASE are `COHORT_QUALITY_GUARDED / DESCRIPTIVE_ONLY`;
  - they may not support Formal promotion.
  - `research/EXPERIMENT_REGISTRY.md` and `research/RESEARCH_FIREWALL.md` updated.
- QUALIFIED_NOT_SELECTED was fresh-audited but not duplicated: Price-Volume PVE-155..159 already defines it as a bounded post-cutline sample, not complete qualified-population evidence, and already freezes future ALL_QNS / CUTLINE_NEXT pool-integrity receipts.
- Cross-version comparator inconsistency corrected:
  - stale PVE-155 text described RR-first sorting;
  - deployed V7.5.30+ Formal comparator is `post-consensus priorityScore -> rewardPerRisk -> marketConsensusScore -> setupQuality -> sectorFlow -> relativeStrength`;
  - V8.13 only added prospective provenance and comparator label `PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`, it did not change ranking.
  - `PRICE_VOLUME_CHECKPOINT.md` and `PRICE_VOLUME_EVIDENCE.md` now carry an explicit versioned correction. Pre-V8.13 rows remain UNKNOWN for exact current-comparator replay.
- Draft PR #117 and #121 received dependency comments so green CI cannot be misread as complete Shadow-framework repair: #117 solves reason-starvation, #121 solves liquidity evidence capture; neither solves first-failure causal attribution or BROAD_CONTROL control-estimand ambiguity.
- Research conclusion: the next highest-value evidence improvement is not another trading factor. It is a **versioned Shadow semantic/membership repair** that freezes denominators and control estimands before Selection Alpha or gate-relaxation outcomes are interpreted.
- No FORMAL_OPTIMIZATION_CANDIDATE is created from these evidence-infrastructure findings; they are prerequisites for trustworthy falsification.


## B-205 — Shadow cohort semantics / first-failure attribution audit; R02 evidence guard tightened (2026-09-27 11:26 Asia/Taipei)
- Continued the post-base admission-funnel audit without modifying Formal Core, runtime thresholds, ranking, capital, monitoring, signals or push behavior.
- Confirmed `scoreCandidate()` is fail-fast: `exclusion_reason` records only the first observed failure under the current source order. Fixed synthetic gate-order reversal proves first-failure prevalence can change while the accepted set is unchanged. Therefore first-failure counts are not marginal gate importance, unique reject counts or selected-count gain from removing a gate.
- Frozen machine guard: `research/first_failure_attribution_falsification_v0_1.json`. Existing rejection-reason repair proposal now explicitly requires `firstFailureCount` semantics and forbids causal gate interpretation.
- Audited Formal `NEAR_MISS` construction. Because A and B each have six checks, current `nearScore=max(6-failedA,6-failedB)` is exactly `6-missingCount`; the second sort key is mathematically redundant. Current Hamming-distance ranking is also threshold-distance blind: e.g. B volume 1.29x and 0.10x can both be one-check misses against the 1.30x gate. A global top-12 truncation occurs before per-price-pool sampling and can starve a pool/channel. Frozen: `research/near_miss_cohort_falsification_v0_1.json` and `NEAR_MISS_COHORT_RESEARCH.md`.
- Audited `BROAD_CONTROL`. Its current parent frame is conditioned on the `used` set of rows that happened to be serialized into earlier bounded cohorts. Therefore it is neither a clean independent broad-market sample nor a clean mutually-exclusive residual population; it is a quota-conditioned mixture whose composition can change when only earlier Shadow sample caps change. Frozen: `research/broad_control_cohort_contamination_falsification_v0_1.json` and `SHADOW_COHORT_SEMANTICS_RESEARCH.md`.
- Refined the control estimand: two valid future designs exist — (A) independent BROAD_MARKET_CONTROL with overlapping membership stored separately, or (B) mutually-exclusive RESIDUAL_CONTROL after full semantic classification. The current hybrid is not allowed as promotion-grade evidence.
- R02 Selection Alpha governance was tightened in `research/EXPERIMENT_REGISTRY.md` and `research/RESEARCH_FIREWALL.md`: BROAD_CONTROL / NEAR_MISS / REJECTED_AFTER_BASE comparisons are `COHORT_QUALITY_GUARDED / DESCRIPTIVE_ONLY` until cohort semantics/membership QA is repaired. They cannot support a Formal promotion decision.
- Cross-version falsification found a stale research-document comparator in PVE-155. Deployed Formal ordering has been `post-consensus priorityScore -> rewardPerRisk -> marketConsensusScore -> setupQuality -> sectorFlow -> relativeStrength` since V7.5.30. V8.13 added provenance only; it did not change ordering. `PRICE_VOLUME_CHECKPOINT.md` and `PRICE_VOLUME_EVIDENCE.md` now carry an explicit versioned correction and require scan-date comparator provenance; pre-V8.13 PIT gaps remain UNKNOWN.
- Draft PR #117 remains a reason-starvation repair only; Draft PR #121 remains a liquidity-admission evidence-capture prototype only. Both now carry comments warning that they do not solve first-failure attribution or BROAD_CONTROL semantics.
- Status: `SHADOW_EVIDENCE_SEMANTICS_RISK_CONFIRMED / R02_PROMOTION_GUARDED / FORMAL_CORE_UNCHANGED`.
- Exact next: audit whether the Shadow persistence layer can overwrite same-date first-known evidence on rerun/retry and whether this can silently change cohort membership/provenance. If confirmed, design an append-only/versioned receipt or provenance overlay before using same-date replay for promotion-grade inference.


## B-205 — Shadow semantic membership repair contract frozen; evidence firewall unified (2026-09-27 11:30 Asia/Taipei)
- Fresh-read canonical had advanced through B-204; B-202 fill-ledger implementation remains parked at explicit Class-B owner-approval boundary and was not touched.
- Continued B-204 highest-value evidence issue rather than adding another factor. Source audit confirms the core defect is estimand construction: current single primary cohort + bounded sampling cannot represent semantic membership and independent control membership simultaneously.
- Frozen a versioned multi-label semantic layer before sampling: FORMAL_SELECTED, FORMAL_QUALIFIED_NOT_SELECTED, DOWNSTREAM_FIRST_FAILURE, BASE_FIRST_FAILURE, CHANNEL_NEAR_MISS, DATA_READINESS_FAILURE, UNIVERSE_POLICY_EXCLUDED, BROAD_MARKET_FRAME_ELIGIBLE, UNKNOWN_SEMANTIC_STATE.
- Two control estimands are now explicitly incompatible and must never be hybridized: BROAD_MARKET_CONTROL = independently frozen broad frame, overlap with focal Formal-state membership allowed but recorded; RESIDUAL_CONTROL = complete semantic classification first, then exclude full focal populations before sampling.
- Denominator-before-sample contract frozen per scanDate/pool: semanticPopulationCount, broadFrameCount, residualFrameCount, unknownSemanticCount, sampledCount, sampleCap, samplingRuleVersion. Missing complete classification => denominator UNKNOWN and opportunity-cost inference blocked.
- First-failure firewall strengthened: fail-fast reason is firstFailureUnderFormalOrder, never marginal/unique gate contribution. Any future one-gate ablation must record accepted-set delta AND next-failure transition from immutable same-scan inputs.
- NEAR_MISS repair requirement frozen: preserve failed A/B check IDs plus continuous threshold distances and pre-truncation pool/channel counts; missingCount alone is not distance and global top-12 cannot estimate prevalence.
- Unified the same repair with B-203 3+3 research: complete Formal-qualified per-pool list/ranks, comparatorVersion, selectedFlag and tie/preSort lineage are required before full quota opportunity-cost inference. Bounded QNS remains cutline evidence only.
- Promotion firewall: historical Selected/BROAD_CONTROL and NearMiss/BROAD_CONTROL remain DESCRIPTIVE_ONLY under current ambiguous semantics; rejected-gate opportunity cost requires certified reason denominators; 3+3 displacement requires complete pool integrity. No contaminated cohort may promote a Formal optimization.
- Engineering classification frozen: a pure post-feature/pre-outcome classifier can be Class A only if it reuses existing in-memory feature/result objects, makes zero new market calls, writes additive research storage only and has no Formal read dependency. Shared scan-flow/persistence replacement/runtime dependency => Class B proposal-first.
- Durable artifacts: SHADOW_SEMANTIC_MEMBERSHIP_REPAIR_SPEC.md commit 52753a3e612b32ea2e74b69f7a738af07fd823da; research/shadow_semantic_membership_repair_v0_1.json commit ab5b4374438d189337ffc78e1b350eb0d8a19fc7.
- No outcome lookup, threshold sweep, Worker/runtime/Production/Formal change or FORMAL_OPTIMIZATION_CANDIDATE. This is evidence infrastructure required before trustworthy gate/quota/Selection-Alpha conclusions.
- Exact next continuation: perform a bounded source-level feasibility audit of current after-market in-memory objects to determine whether complete semantic counts and complete per-pool qualified ranks can be generated after scoreCandidate without extra market calls and without changing Formal ordering. If yes, prepare isolated Class-A prototype + invariant tests; if current persistence key/schema cannot express multi-label membership without shared runtime change, split pure computation (Class A) from storage proposal (Class B) and stop only the Class-B implementation. Then continue automatically into an independent research lane while prospective clean cohorts accumulate.


## B-206 — Shadow evidence chain audit: persistence, decision-state, pool-matched R02, outcome provenance and reader completeness (2026-09-27 Asia/Taipei)
- Continued without Formal/runtime trading changes.
- Legacy Candidate Shadow persistence is not immutable/atomic evidence: writer deletes all rows for scan_date then inserts rows one-by-one; no explicit transaction/batch was found. Same-date rerun can replace first-known evidence, and a failure after DELETE can leave a partial date. Current integrity can still report HEALTHY when SELECTED count matches and BROAD_CONTROL exists even if other expected cohorts are missing. Frozen `research/shadow_archive_persistence_falsification_v0_1.json`. Class-B cohort proposal now requires immutable generation/fingerprint receipts, expected-vs-persisted counts and LEGACY_MUTABLE_ARCHIVE handling.
- Decision-state provenance mismatch confirmed: Production Formal uses `scoreCandidate -> applyMarketConsensus`; SELECTED/QNS Shadow rows reuse post-consensus items, but BROAD_CONTROL re-runs bare `scoreCandidate`. Under current quota-conditioned spillover, a true Formal-ok/QNS symbol can enter BROAD_CONTROL with pre-consensus PriorityScore and missing consensus provenance. Frozen `research/shadow_consensus_provenance_falsification_v0_1.json`. Future design must freeze one actual per-symbol decision-state receipt before research sampling.
- R02 v1.0 same-date pooled Selection Alpha is structurally price-pool confounded because Formal has independent GENERAL/THOUSAND 3+3 pools and different liquidity thresholds. Frozen pre-outcome successor R02 v1.1: same date × same pool comparison, actual selected-count weighting within date, equal-date aggregation, no cross-pool substitution. Frozen `research/r02_pool_matching_falsification_v0_1.json`; old v1.0 retained/descriptive.
- Generic counterfactual outcome reader bypasses V8.12 history-source admission and existing Corporate Action/symbol-session quality semantics: it reads raw `v7_history_cache.history_json`, uses next available bars and current history is explicitly `adjusted=false`. Unknown missing bars can stretch D1/D3/D5, and split/capital-reduction raw discontinuities can create fake returns. Frozen `research/r02_outcome_provenance_falsification_v0_1.json`. Promotion-grade outcomes require horizon-specific source/session/CA quality; missing reason remains UNKNOWN.
- Counterfactual reader has silent `LIMIT 5000` with oldest-first ordering, no pagination/count/truncation flag. As cohort families expand, newest prospective rows can be silently omitted. Frozen `research/shadow_reader_capacity_falsification_v0_1.json`; Class-B proposal now requires complete-date pagination and explicit truncation coverage.
- These are evidence-quality defects, not evidence that current Formal stock-selection rules are harmful. No threshold, score, A/B rule, 3+3 quota, capital, entry, stop, monitoring, signal or push behavior changed.
- Status: `PROMOTION_EVIDENCE_CHAIN_GUARDED / CLASS_B_EVIDENCE_REPAIR_DESIGN_EXPANDED / FORMAL_CORE_UNCHANGED`.
- Exact next: audit R04/R07/R08 and other cross-sectional research functions for date-cluster weighting. Any implementation that pools stock rows across dates despite scanDate being the declared independent unit must be downgraded to descriptive until equal-date aggregation is enforced. Continue into external-evidence keyset alignment after that.


## B-207 — Cross-sectional equal-date weighting + external-evidence generation lineage falsification (2026-09-27 11:54 Asia/Taipei)
- Fresh-read canonical start B-206; A had advanced beyond B-203, so no quota-feasibility work was repeated. B-202 Confirmed Fill Ledger remains parked at owner approval and Formal Core remains LOCKED.
- R04/R07/R08/I01-I07 source audit completed. researchDemeanByDate() correctly removes within-date means, but I01-I07 then compute partial correlation over all demeaned stock rows pooled across dates. Dates with more usable rows therefore receive more weight. Leave-one-scan-date-out diagnoses sensitivity to removing a date but does NOT make the estimator equal-date.
- R07 has the same structural distinction: its strength/attention classification is correctly defined by each scanDate's own cross-sectional medians, but final QUIET_STRENGTH / ATTENTION_STRENGTH return buckets pool stock rows across dates. A date contributing more classified rows receives more outcome weight.
- R08 core paired estimator is materially better: for each date it first computes mean(Quiet)-mean(Attention), then summarizes those date-level deltas. This is an equal-date primary estimand. However R08 byEngine pooled metrics/regime counts remain row-weighted descriptive context and must not substitute for the paired date-level result.
- R04 readiness currently checks row count plus independent-date count; that prevents claiming all rows are independent but does not itself create an equal-date outcome estimator. R04/R07 and I01-I07 pooled results are therefore promotion-grade GUARDED / DESCRIPTIVE_ONLY until a pre-registered equal-date successor is used.
- Counterfactual: if pooled and equal-date estimates later agree across mature dates/regimes, the weighting concern is reduced; if sign/magnitude disappears or reverses, the old result is a date-composition artifact. LODO stability alone cannot resolve this. No post-outcome weighting exponent/min-rows sweep is allowed.
- Frozen artifact research/cross_sectional_equal_date_weighting_falsification_v0_1.json, commit 56ffceea283245a1093b7139c803f4a9cf0bef66.
- External-evidence keyset audit then confirmed a second PIT lineage gap. Current collection consumes the current scan.shadowArchive.rows; Shadow archive can be delete/rewrite on same-date rerun, and external evidence persistence independently deletes same scan_date then upserts by (scan_date,symbol). Outcome join uses scanDate|symbol.
- scanDate|symbol prevents obvious cross-symbol/date mismatch but proves only current-key alignment, not immutable first-known generation alignment. A same-date rerun can replace cohort/decision-state and external evidence without preserving which external receipt belonged to the original decision generation.
- Required promotion-grade contract: immutable scanGenerationId/decisionReceiptId; external-evidence rows reference exact parent generation; firstKnownAt/capturedAt/sourceAvailableAt retained; reruns append new generation; reader chooses explicit as-known generation and reports orphan/mismatch counts; UNKNOWN parent generation blocks PIT promotion inference.
- Frozen artifact research/external_evidence_keyset_alignment_falsification_v0_1.json, commit 39efb972de359117519b7813d5515603d0613b29.
- These findings invalidate promotion-grade inference paths, not the current Formal stock-selection rules. No outcome lookup, factor/threshold/quota/ranking/capital/signal/push change and no FORMAL_OPTIMIZATION_CANDIDATE.
- Engineering: Class A research documentation only in this cycle. Any repair that changes shared D1 persistence/runtime remains Class B proposal-first; pure offline/equal-date research computation can be Class A if isolated and Formal-invariant.
- Exact next: audit external-evidence market identity/source-date semantics against Shadow market/pool identity (TWSE/TPEx, monthly revenue vintage, margin/SBL source coverage) and verify whether market identity can be inferred without symbol ambiguity. Then inspect readiness/maturity code so count-only DESCRIPTIVE_READY cannot override cohort-quality, outcome-provenance, generation-lineage, reader-completeness or equal-date firewalls. If the maturity composition is structurally unsafe, freeze a fail-closed readiness contract before any implementation.


## B-208 — Promotion-evidence scope audit: factor population, date weighting, factor coverage, materiality, cost/redundancy semantics (2026-09-27 Asia/Taipei)
- Continued the evidence-chain falsification without changing Formal selection/runtime.
- Confirmed `trade_research_snapshots` FULL_FORMAL_SCAN rows are persisted from Formal selected plans. Therefore current `factorStudyFromSnapshots()` is a selected-only study. V8.7.3 PURGED_FORWARD_HOLDOUT is retained as a valid overlap-leakage guard, but selected-only OOS evidence cannot be generalized to Admission-gate value or the full qualified/rejected universe.
- Frozen `research/factor_promotion_population_scope_falsification_v0_1.json`: any proposed change must declare target layer (ADMISSION_GATE / RANKING / EXECUTION / CAPITAL) and use a compatible evidence population. Current selected-only factor study may generate ranking/refinement hypotheses only.
- Frozen `research/factor_study_date_weighting_falsification_v0_1.json`: current factor thirds are globally sorted/pool-averaged across stock rows inside train/holdout, so dates with more selected rows receive more weight and date/regime factor-level shifts can contaminate the cross-sectional effect. Purged chronological split does not cure this estimand. Future ranking study needs equal-date / within-date factor ranking or complete qualified-pool receipts.
- Frozen `research/factor_specific_date_coverage_falsification_v0_1.json`: current candidateFactor row-count thresholds (train n>=20, holdout n>=10) do not require factor-specific independent-date/year/regime coverage; overall study dates can come from rows where a sparse factor is missing. Factor-specific coverage is required before any promotion interpretation.
- Frozen `research/factor_redundancy_selection_conditioning_falsification_v0_1.json`: current PAIRWISE_PEARSON_FULL_FORMAL_SCAN operates on selected snapshots. High selected-conditioned correlation can be a redundancy warning, but low selected-conditioned correlation cannot clear full-universe redundancy.
- Frozen `research/cost_stress_gate_semantics_falsification_v0_1.json`: current cost-stress governance condition is sample coverage only; >=30 SELECTED D5 rows can be DESCRIPTIVE_READY even if all modeled 30/60/100bps net scenarios are negative. Cost economics are not currently a machine promotion gate.
- Frozen `research/factor_candidate_materiality_falsification_v0_1.json`: candidateFactors require only positive train/holdout spread direction, so arbitrarily tiny positive effects can enter the candidate list. Rename interpretation to directionally persistent research factor; exact counterfactual displacement/materiality/cost/redundancy/coverage evidence is still required before FORMAL_OPTIMIZATION_CANDIDATE.
- Research firewall and Class-B evidence proposal were extended with population-scope compatibility and materiality boundaries. No existing purged holdout, multiple-testing or anti-overfit protections were weakened.
- Status: `PROMOTION_LABELS_OVERSTATE_CURRENT_ESTIMANDS / EVIDENCE_SCOPE_GUARDS_FROZEN / FORMAL_CORE_UNCHANGED`.
- Exact next: audit the Formal funnel diagnostics (`baseEligible`, `rrEligible`, condition distributions and exclusion counts) against the actual fail-fast semantics. Freeze explicit denominator/transition names so candidate-scarcity research does not treat stage counters as independent or complete gate effects.


## B-209 — Formal funnel diagnostic semantics (2026-09-27 12:10 Asia/Taipei)
- Continued from B-208. Concurrent main commits had already completed the requested funnel audit, so they were incorporated rather than repeated.
- baseEligible is the count crossing the early admission boundary through chip-data availability; it is not an independent all-base-gates pass count. rrEligible is conditional on surviving every intervening gate and RR>=2; it is not an independently evaluated RR pass count.
- conditionDistribution describes A/B technical checks inside the basePassed population, not only rows that actually reached the setup gate in Formal order.
- Top-level diagnostics include all price levels, including thousand stocks. thousandStockPool is a subset report evaluated again; the two reports are not additive. generalTop is quota-capped and is not the full GENERAL qualified denominator.
- Durable main evidence: research/formal_funnel_counter_semantics_falsification_v0_1.json at 15551e2600aee4b47ff43a3479480e2c3120a954, with semantic follow-ups 0fac925add12f4318b798139c92a787b377582af and 3859d0c03bfbd7c48919c857a599415aafeb7a92.
- Existing readiness-quality evidence was also incorporated: coverage readiness, evidence-quality eligibility and promotion eligibility must remain separate; unresolved quality is UNKNOWN and blocks only affected experiment interpretation.
- Gate-overlap successor is frozen conceptually as PASS/FAIL/UNKNOWN/NOT_EVALUABLE on same-scan data, preserving original Formal result and first failure. Missing data never becomes FAIL. Target unavailable is not RR=0; RR is not evaluable until channel, target, entry and stop are valid. Fundamental quality is not evaluable when the required component count is insufficient.
- No Formal behavior, threshold, ranking, quota, capital, monitoring, signal or push rule changed. No outcome lookup and no optimization candidate.
- Exact next: audit whether each overlap input is already present in the immutable same-scan semantic/decision receipt. Missing provenance becomes CAPTURE_GAP/UNKNOWN. If complete with zero new market calls, prepare isolated Class-A observer tests; shared persistence/runtime work remains Class-B proposal-first.


## B-210 — Class-A semantic classifier feasibility proven + Formal funnel diagnostic semantics frozen (2026-09-27 Asia/Taipei)
- Continued B-208 without Formal/runtime trading changes and without waiting on the Class-B Shadow persistence proposal.
- B-205 feasibility boundary was resolved. Current after-market selector already has enough same-scan in-memory objects to compute, with zero new market calls: complete Formal-ok per-pool ranks from the full scored list; FORMAL_SELECTED / FORMAL_QUALIFIED_NOT_SELECTED membership; overlapping research memberships; qualified denominators before sample caps; broad-frame population within already-admitted featureRows; deterministic post-population sampling; comparator/version metadata.
- Current post-feature arguments cannot fully reconstruct earlier evidence states: V8.12 DATA_READINESS_FAILURE rows blocked before featureRows; UNIVERSE_POLICY_EXCLUDED instruments removed upstream; immutable first-known generation identity; complete CHANNEL_NEAR_MISS population after legacy top-12 truncation; durable Shadow/external/outcome parent linkage. These remain Class-B/shared-runtime persistence concerns.
- Isolated Class-A prototype added: `research/shadow_semantic_classifier_v0_1.mjs`, `tests/test_shadow_semantic_classifier_v0_1.mjs`, `research/shadow_semantic_classifier_feasibility_v0_1.json`, and research-only workflow. Prototype has no Worker import, no D1 write, no market call and no Formal read dependency.
- Prototype invariants passed: complete per-pool Formal rank; overlapping membership; sample-cap changes do not alter population denominators; duplicate/empty symbol fails fast; comparator lineage = `PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`.
- CI evidence from superseded PR #125 head: Shadow Semantic Classifier Research run 36293388031 SUCCESS; V8 Repair CI run 36293388033 SUCCESS; V8 Regression Tests run 36293388036 SUCCESS. Because main was continuously advancing with non-conflicting research, the exact four CI-verified research-only files were added safely onto latest main; PR #124/#125 were closed as superseded rather than forcing a stale merge.
- Formal funnel source audit completed. `diagnostics.scanned` means Formal-normalized todayRows, not raw exchange listings. Under V8.12, `featureRows` is already history-admission gated before selector scoring.
- `baseEligible` means `basePassed=true`: passed early admission gates through chip-concentration and reached downstream precision-screen phase. It still includes rows later failing financial completeness/event/valuation/sector/A-B/fundamental/volatility/target/RR/final grade. Safe research alias = `EARLY_BASE_ADMITTED_BEFORE_DOWNSTREAM_PRECISION_GATES`.
- `rrEligible` means `rrPassed=true`: all preceding downstream gates passed, a verifiable target exists, and RR>=minimum; a row can still fail the final B-grade setup-quality gate. Safe alias = `PASSED_ALL_THROUGH_RR_BEFORE_FINAL_SIGNAL_GRADE`.
- Structural monotonicity verified from every scoreCandidate reject path: within the same evaluated featureRows, `fullyQualified <= rrEligible <= baseEligible <= featureRows`. No reject before RR sets rrPassed=true; only final C-grade rejection returns basePassed=true/rrPassed=true.
- `diagnostics.exclusions` is strictly `FIRST_FAILURE_UNDER_FORMAL_ORDER_COUNTS`. It is not an independent-failure count, marginal gate contribution or expected recovered-candidate count under gate relaxation.
- `conditionDistribution` denominator is `basePoolDiagnostics` (basePassed rows). It recomputes A/B checks even for rows Formal may already have fail-fast rejected at financial/event/valuation/sector gates. Therefore it is `EARLY_BASE_COHORT_PATTERN_DIAGNOSTIC`, not a sequential Formal funnel stage or causal gate counterfactual.
- Top-level baseEligible/rrEligible/channelCounts/exclusions already include GENERAL + THOUSAND because the first featureRows loop covers both pools; thousandStockPool diagnostics re-run the THOUSAND subset. Never add top-level + thousand counts or thousand rows are double-counted.
- Frozen machine contract: `research/formal_funnel_diagnostics_semantics_v0_1.json`. Safe stage vocabulary: FORMAL_NORMALIZED_TODAY_ROWS -> HISTORY_ADMITTED_FEATURE_ROWS -> EARLY_BASE_ADMITTED_BEFORE_DOWNSTREAM_PRECISION_GATES -> PASSED_ALL_THROUGH_RR_BEFORE_FINAL_SIGNAL_GRADE -> FULLY_QUALIFIED_PRE_QUOTA -> FORMAL_SELECTED_AFTER_3_PLUS_3.
- Earlier cross-sectional audit also froze that R01/R04/R05/R07 raw-row cross-date means are descriptive only under scanDate-as-independent-unit; R08 paired date-level estimator survives. R01/R05 equal-date successors were preregistered. Existing more-complete external-evidence parent-keyset guard remains canonical; a redundant generation-alignment receipt created during this pass was removed rather than inflating research debt.
- No outcome lookup, threshold tuning, score/quota/capital change or FORMAL_OPTIMIZATION_CANDIDATE. Formal Core unchanged.
- Exact next: audit historical/research uses of `baseEligible`, `rrEligible`, exclusion counts and conditionDistribution for semantic overreach. Any claim that treats those counters as independent gate effects or additive funnel losses must be corrected/descriptive-only. Then continue candidate-scarcity research only with explicit stage denominators and immutable semantic receipts.


## B-211 — Historical funnel-counter usage audit closed without false correction (2026-09-27 11:38 Asia/Taipei)
- Fresh canonical had already advanced through B-210 and completed the B-205 Class-A semantic-classifier feasibility/prototype with green CI; that work was incorporated and not repeated.
- Audited repository research assets for exact uses of baseEligible, rrEligible, conditionDistribution and diagnostics.exclusions. Search found executable references in Worker/legacy snapshot plus the new canonical semantic documentation; no separate current research artifact was found that treats these exact counters as additive independent gate effects or causal recovered-candidate estimates.
- Therefore no historical research file was rewritten merely to manufacture a correction. This is a negative audit result: current repository evidence does not justify claiming a live semantic-overreach defect for these exact counters beyond the risks already frozen in B-209/B-210.
- Safe aliases remain: baseEligible = EARLY_BASE_ADMITTED_BEFORE_DOWNSTREAM_PRECISION_GATES; rrEligible = PASSED_ALL_THROUGH_RR_BEFORE_FINAL_SIGNAL_GRADE; conditionDistribution = EARLY_BASE_COHORT_PATTERN_DIAGNOSTIC; exclusions = FIRST_FAILURE_UNDER_FORMAL_ORDER_COUNTS.
- Explicitly forbidden inference remains: baseEligible-rrEligible is not RR-gate loss; exclusion count is not marginal gate contribution; conditionDistribution is not the sequential setup-gate population; top-level + thousandStockPool counters are not additive because thousand is already included in top-level.
- Older chat summaries/external prose using shorthand funnel language are not silently promoted into causal evidence. Without a versioned receipt they remain descriptive-only/UNKNOWN for marginal gate effect.
- Durable machine audit: research/formal_funnel_historical_usage_audit_v0_1.json commit 989bdf9231a1760aae1449f0ff3702c2f0ff2b16.
- No outcome lookup, threshold/quota/ranking/capital change, Worker/runtime/Production change or FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next continuation: candidate-scarcity research should now use the B-210 semantic classifier plus explicit stage denominators. Audit the next structural scarcity layer that is observable pre-outcome: quantify which Formal stages can be represented as PASS/FAIL/UNKNOWN/NOT_EVALUABLE from immutable same-scan inputs without interpreting first-failure counts causally. Freeze one-gate-at-a-time replay semantics and transition accounting; do not inspect outcomes or tune thresholds. If a prospective receipt/storage dependency is required, keep computation Class A and storage Class B proposal-first.


## B-212 — Gate-overlap observer + one-gate replay validated; evidence-persistence boundary narrowed (2026-09-27 Asia/Taipei)
- Continued B-211 candidate-scarcity work without outcomes, threshold tuning or Formal/runtime trading changes.
- Durable snapshot audit found that existing research snapshots can directly support only part of a full gate-overlap study. Observable or strongly versioned context includes close, market/sector return context, primary volume/amount, chip concentration, ATR, A/B checks, post-V8.14 sector-gate provenance and post-V8.13 ranking provenance.
- Capture gaps remain for at least: explicit historyDays/history-admission reason receipt; marketCapYi; spread/depth liquidity-exception inputs; financialBasis/valuationObserved/announcementsVerified source flags; official announcement titles; sectorMedianPe; all raw components required to prove fundamentalCount; target/resistance source geometry; and rejected-row entry/stop/target/RR decision state. Missing evidence is CAPTURE_GAP/UNKNOWN, never FAIL.
- Isolated Class-A `formal_gate_overlap_observer_v0_1` was implemented and tested with four states: PASS / FAIL / UNKNOWN / NOT_EVALUABLE. It consumes frozen same-scan inputs plus already-derived Formal values where appropriate, preserves the original Formal result/first failure, adds zero market calls, performs zero D1 writes and has no Worker/Formal integration.
- Observer falsification fixtures prove: missing market-cap does not become FAIL; low-volume with missing exception inputs remains UNKNOWN; target-null makes RR/grade NOT_EVALUABLE rather than RR=0; insufficient fundamental component count makes fundamental quality NOT_EVALUABLE; unverified announcement source remains UNKNOWN; observed sector failure remains FAIL; final C-grade failure can coexist with Formal rrPassed=true; all-missing input produces no fabricated FAILs.
- PR #126 head passed Formal Gate Overlap Observer Research run 36293928991, V8 Repair run 36293928980 and V8 Regression run 36293928932. Because main advanced concurrently, the exact four CI-verified research-only files were safely added onto latest main and PR #126 was closed as superseded.
- One-gate-at-a-time replay semantics were then frozen before any outcome use. `formal_gate_replay_v0_1` distinguishes: REMOVED_GATE_NOT_OBSERVED_FAIL, EARLIER_OBSERVED_FAIL, PRIOR_STATE_UNKNOWN/NOT_EVALUABLE, NEXT_OBSERVED_FAIL, NEXT_STATE_UNKNOWN/NOT_EVALUABLE and ALL_OTHER_OBSERVED_GATES_CLEAR.
- NOT_EVALUABLE is not universally blocking. Explicit safe-not-applicable cases (e.g. cap-range gate not applicable or no positive TTM PE) may be skipped; dependency-driven NOT_EVALUABLE (e.g. no channel -> target unavailable -> RR not evaluable) cannot be skipped to manufacture a rescue.
- `ALL_OTHER_OBSERVED_GATES_CLEAR` is only a gate-state counterfactual. It is NOT a recovered Formal candidate, selectedCount, ranking result, capital allocation or expected trade. No quota/ranking/cost/outcome replay is performed.
- PR #127 `Research: Formal single-gate replay v0.1` passed Formal Gate Replay Research run 36294230463, V8 Repair run 36294230354 and V8 Regression run 36294230344; merged successfully at `356a690b9383628fbb7bb4d688fa0224cd3095d5`.
- Persistence feasibility audit confirmed the flexible legacy Shadow `snapshot_json` could technically store overlap/replay JSON without a new D1 column, but this is NOT promotion-grade repair because the legacy archive remains mutable same-date delete/rewrite, single-cohort, non-atomic, generation-less and separately persisted from external evidence.
- Preferred future evidence parent is one immutable per-symbol decision-state receipt carrying scanDate/symbol/canonical market/pool/rule+comparator versions/capture generation/Formal state/first failure/ranking tuple/history-admission/source-quality/semantic fingerprint. Semantic memberships, overlap states, replay summaries and external evidence reference that parent.
- Pure semantic computation is now validated Class A. Passing already-loaded same-scan inputs adds zero market-data calls. Shared Worker wiring, first-known capture, immutable persistence, early universe/history receipts, keyset completeness and cross-table lineage remain Class B proposal-first. Gate/order/threshold changes remain Class C owner approval.
- Durable feasibility receipt: `research/formal_gate_evidence_persistence_feasibility_v0_1.json`. Existing `SHADOW_COHORT_SEMANTICS_CLASS_B_PROPOSAL.md` was updated to reuse these validated Class-A components rather than redesigning them.
- No outcome lookup, no Formal optimization claim and no new FORMAL_OPTIMIZATION_CANDIDATE. These are evidence-infrastructure safeguards against false scarcity attribution.
- Exact next continuation: continue candidate-scarcity research at the next pre-outcome structural layer. Audit whether target/resistance availability and RR scarcity can be decomposed without outcome use into TARGET_NULL vs LOW_RR vs FINAL_GRADE and whether the currently captured provenance is sufficient to distinguish source-quality failure from genuine geometry. Preserve B-199 target-null != low-RR semantics; if exact target provenance is missing, freeze capture gaps rather than inferring them.


## B-213 — Target/RR semantic observer validated; durable persistence requires immutable parent architecture (2026-09-27 Asia/Taipei)
- Continued B-212 candidate-scarcity work without outcome lookup, threshold tuning or Formal/runtime trading changes.
- Target/RR scarcity is now explicitly decomposed into `TARGET_NULL_REJECTED`, `LOW_RR_REJECTED`, `FINAL_GRADE_REJECTED_AFTER_RR_PASS`, `RR_PASSED_FORMAL_OK` and `NOT_EVALUABLE_UNDER_FORMAL_ORDER`. TARGET_NULL remains RR=UNKNOWN and is never coerced to zero.
- Isolated Class-A `TARGET_RR_AUDIT_OBSERVER_V0_1` was implemented with zero market calls, zero D1 writes and no Worker import. It reconstructs the current channel-specific A/B entry/stop geometry, enumerates current Formal resistance candidates under the existing >1% eligibility rule, preserves targetPrice provenance state, selected target, RR state and Formal-stage consistency.
- Initial deterministic test self-falsified an invalid generic witness: a target=105 example assumed stop=95, but the actual B-channel stop for the fixture was materially tighter and RR still passed. The fixture was corrected to channel-consistent geometry rather than weakening the observer. Frozen rule: target-source materiality must be evaluated with channel-specific Formal entry/stop geometry.
- Additional attribution guard: Formal `Math.min(...levels)` retains only the selected price. When multiple eligible resistance sources share that same minimum value, research preserves all matching `selectedTargetSources` and marks `selectedSourceAmbiguous=true`; it may not invent a unique source.
- PR #130 `Research: target/RR audit observer v0.1` specialized run 36297985878 SUCCESS, V8 Repair 36297985820 SUCCESS, V8 Regression 36297985929 SUCCESS; merged at `9ce2e60883fbce7065f748bd700ea74bc7d35e0d`.
- Persistence feasibility audit then found that a simple V8.15-style append into the legacy Shadow is not safe for promotion-grade evidence. Current `trade_research_shadow_candidates` has primary key `scan_date+symbol`, one cohort column and a `used` set that enforces one saved cohort per symbol; generic REJECTED_AFTER_BASE is also bounded by pool. New Target/RR memberships could displace Near-miss/Sector-gate/Rejected samples.
- Legacy writer also remains same-date mutable (DELETE followed by row-by-row INSERT/UPSERT), generation-less and without immutable semantic-fingerprint parentage. Therefore flexible `snapshot_json` is not an acceptable shortcut.
- Durable machine receipt: `research/target_rr_persistence_feasibility_v0_1.json`. Existing `SHADOW_COHORT_SEMANTICS_CLASS_B_PROPOSAL.md` now defines Target/RR as another child of the same immutable per-symbol decision-state parent; `research/formal_gate_evidence_persistence_feasibility_v0_1.json` registers the validated observer.
- Minimum future child semantics include parent receipt/generation, channel/Formal stage/first failure, entry/stop/risk/stop binding, targetPrice raw+source/asOf/capturedAt/PIT state, prior highs, dated pivot candidates, eligible resistance candidates, selected target + all matching sources + ambiguity flag, target-null, reward/RR/threshold and stage consistency.
- Engineering boundary: pure observer = validated Class A; shared Worker wiring / immutable D1 persistence = Class B proposal-first; targetPrice shared-source repair = Class B if source/enrichment contracts change; target/null/RR/formula/comparator changes = Class C owner approval.
- No V8.15 Production implementation was made. No new FORMAL_OPTIMIZATION_CANDIDATE. Current status = `TARGET_RR_SEMANTICS_VALIDATED / PERSISTENCE_CLASS_B_BLOCKED / OUTCOME_VALUE_UNKNOWN`.
- Exact next continuation: audit Production targetPrice injection/source coverage and provenance. If no stable source contract is proven, retain source/asOf/knownAt as UNKNOWN; do not call targetPrice absent and do not backfill it historically. Continue pre-outcome scarcity research without changing target/RR rules.


## B-214 — targetPrice injection/source provenance audited; live coverage remains UNKNOWN (2026-09-27 Asia/Taipei)
- Continued B-213 without outcome lookup or Formal/runtime behavior changes.
- Repository/source audit found no official or repo-owned producer that assigns `targetPrice`. The only proven injection paths are generic custom enrichment: `V7_ENRICHMENT_JSON` and `V7_ENRICHMENT_API_URL`.
- `normalizeEnrichmentPayload()` preserves custom stock items as-is, so targetPrice can technically reach Formal when supplied externally. This proves injection feasibility only.
- Market-consensus data is not a targetPrice producer. Its human-readable `basis` can mention broker target prices, but V7.5.30 only converts source-count consensus into score bonus and never maps a price into `f.targetPrice`.
- Runtime observability is insufficient: `/api/version` does not expose custom-enrichment configured/readiness state; persisted after-market summary does not retain `customAvailable`, custom fetch error, targetPrice coverage or targetPrice PIT-provenance coverage. `enrichmentAvailable` and `enrichmentStocks` can be satisfied by official enrichment and therefore cannot prove custom-source success.
- Custom enrichment API failure is caught and converted to an empty custom payload while scan continues. If Production actually relies on custom targetPrice, source failure could change target/RR state. Because live dependency is not proven, classify this as `POTENTIAL_SOURCE_AVAILABILITY_COUPLING / NOT_YET_PRODUCTION_DEFECT`.
- Safe current states: live custom source configuration=UNKNOWN; targetPrice live coverage=UNKNOWN; source identity=UNKNOWN; asOf/knownAt=UNKNOWN. Do not convert UNKNOWN to zero/absent.
- Durable audit: `research/target_price_injection_provenance_audit_v0_1.json`. `TARGET_RESISTANCE_RR_RESEARCH.md` and `SHADOW_COHORT_SEMANTICS_CLASS_B_PROPOSAL.md` now freeze the minimum secret-safe source-state receipt required before target-null scarcity can be attributed purely to geometry.
- Shared runtime source-state capture remains Class B proposal-first; changing custom-source failure policy or target/RR rules is not authorized.
- No new FORMAL_OPTIMIZATION_CANDIDATE. Exact next: continue the remaining pre-outcome scarcity layer at FINAL_GRADE. Audit channel-specific setupQuality formulas and common A/B grade thresholds for structural asymmetry, while preserving the existing final-grade gate and using no outcomes.


## B-215 — FINAL_GRADE channel asymmetry and setup-quality multilayer influence audited (2026-09-27 13:56 Asia/Taipei)
- Continued B-214 exact-next with no outcome lookup, threshold tuning or Formal/runtime trading change.
- Existing frozen setup-quality artifacts on main were re-read and independently reconciled with current source. A/B setup formulas use different constructs and attainable scales. A.pass theoretical setupQuality range is 38..82; B.pass theoretical range is 69.65..100.
- Therefore the common FINAL_SIGNAL_GRADE B-min threshold of 65 is structurally redundant after a valid B.pass, but materially active after A.pass. A has a second effective admission gate after its setup pass; B does not. This is structural asymmetry, not evidence that the gate is harmful.
- Existing signal-grade artifact contained an over-optimistic governance claim existingShadowSufficient=true. That claim is now falsified. FINAL_GRADE rejects fall into generic REJECTED_AFTER_BASE, whose six-per-price-pool cap is shared across rejection reasons and can reason-starve later categories. Legacy Shadow is also mutable/generation-less and first-failure attribution is not independent gate contribution. Historical/live prevalence and opportunity cost of A grade rejection therefore remain UNKNOWN.
- Frozen correction artifact: research/signal_grade_shadow_sufficiency_falsification_v0_1.json, commit cd5ba396092c6e25e9ce29c005c2f28ef2e1fa56.
- Additional structural audit confirms setupQuality has multiple Formal influence layers: channel geometry determines existence; setupQuality<65 is a hard final-grade rejection; setupQuality then contributes 28% of base PriorityScore; deployed comparator later uses raw setupQuality after post-consensus priorityScore, raw RR and marketConsensusScore. This is MULTILAYER_INFLUENCE, not automatically an erroneous double-count bug.
- Because A is truncated to 65..82 after grade while B enters ranking at 69.65..100, repeated setupQuality influence can potentially amplify channel-scale non-comparability. Outcome materiality and actual rank displacement remain UNKNOWN.
- Frozen artifact: research/setup_quality_multilayer_influence_falsification_v0_1.json, commit b39e5a98f6a619153abf05bc4c90c5ff3f388fcc.
- Prospective minimum evidence is now explicit: complete immutable scanDate x pricePool x channel denominators at setup-pass, RR-pass, grade-pass and qualified-rank stages; exact setup formula/version; comparator tuple; equal-date aggregation; controls for sector/institution/fundamental/RS/RR; price-pool/regime/industry concentration. Valid B.pass followed by grade<65 is a negative-control invariant and should be structural zero.
- Counterfactual remains open: if A grade-rejected rows show worse controlled path/MAE/stop/no-follow-through across dates/regimes, asymmetry may be economically justified. If they are comparable/better and grade materially drives scarcity/zero-pick, SIGNAL_GRADE_CHANNEL_REFORMULATION may later become a Class-C FORMAL_OPTIMIZATION_CANDIDATE. No threshold sweep is authorized.
- No new FORMAL_OPTIMIZATION_CANDIDATE now. Status = FINAL_GRADE_ASYMMETRY_CONFIRMED / SHADOW_PREVALENCE_UNKNOWN / OUTCOME_MATERIALITY_UNKNOWN / FORMAL_UNCHANGED.
- Exact next: continue pre-outcome scarcity accounting by auditing whether current funnel/summary counters can distinguish A_SETUP_PASS -> RR_PASS -> FINAL_GRADE_PASS from B_SETUP_PASS -> RR_PASS -> FINAL_GRADE_PASS without bounded Shadow inference. If not, freeze the minimal channel-stage denominator receipt and test whether it can be computed from already-loaded decision states as isolated Class A; shared persistence/wiring remains Class B proposal-first. Then audit whether grade labels are used downstream for monitoring/capital/push beyond eligibility/ranking, because any hidden downstream use changes the causal influence map.


## B-216 — A/B sequential scarcity denominator and downstream signal-grade influence frozen (2026-09-27 Asia/Taipei)
- Continued B-215 exact-next without outcome lookup, threshold tuning or Formal/runtime trading changes.
- Current summary counters are insufficient for channel-specific scarcity accounting:
  - `baseEligible` is an early-admission aggregate, not A/B setup-pass;
  - `rrEligible` is aggregate across channels after all intervening gates, not A-RR/B-RR;
  - `channelCounts` counts only final `scoreCandidate.ok=true` rows after final grade;
  - `conditionDistribution` recomputes A/B checks on the broader basePassed population and includes rows that may have first-failed earlier financial/event/valuation/sector gates.
- Implemented and validated pure Class-A `research/channel_stage_denominator_observer_v0_1.mjs`. It consumes already-observed same-scan gate states only, makes zero market calls, writes nothing and has no Formal decision impact.
- Sequential receipt preserves:
  - raw A-pass / raw B-pass / dual-pass diagnostics;
  - Formal channel assignment only after every pre-setup gate is clear, with current B-over-A dual-pass precedence;
  - post-setup fundamental-count / fundamental-quality / ATR pass;
  - TARGET_PASS;
  - RR_PASS;
  - FINAL_GRADE_PASS;
  - original FORMAL_QUALIFIED and external SELECTED flag.
- Important semantic guard: `A_SETUP_PASS -> RR_PASS` is not treated as adjacent. Fundamental quality, ATR and target availability remain explicit intervening stages. UNKNOWN/dependent NOT_EVALUABLE never become PASS/FAIL.
- Negative-control invariant frozen: a valid Formal B-assigned row that reaches RR_PASS should have structural zero FINAL_GRADE_FAIL under current B setupQuality envelope and grade>=65 threshold. Nonzero incidence is a provenance/version/observer defect signal, not evidence to tune the threshold.
- Downstream whole-repo audit found one additional direct use of the Formal `signalLevel` label after selection: `compareResults()` sorts intraday monitor rows first by current live action state, then by plan signalLevel A>B>C, before priorityScore/RR/sector/RS. Since `runBackgroundMonitor()` processes sorted results sequentially, signalLevel can affect monitor/display and notification processing order when action state ties.
- No direct Formal signalLevel label gate was found in `evaluatePullback`, `evaluateMomentum`, `buildFinalDecision`, `evaluateOperationSignals`, allocation ratio, STOP/SELL/REDUCE conditions or phone-push eligibility. Underlying setupQuality still has the already-audited eligibility/score/comparator/capital influence; the label itself adds monitor-order influence.
- Formal live `monitorStatus.grade` A/B/C is a separate action-urgency object and must not be confused with selection `signalLevel`.
- Durable artifacts:
  - `research/channel_stage_denominator_observer_v0_1.mjs`
  - `research/channel_stage_denominator_spec_v0_1.json`
  - `research/signal_grade_downstream_usage_audit_v0_1.json`
  - tests + dedicated CI.
- PR #134 passed Channel Stage Denominator Research, V8 Repair CI and V8 Regression Tests and was squash-merged at `ce4354ba44f10b5f37f4a6ff160b88fc35aa9899`.
- Status: `CURRENT_SUMMARY_INSUFFICIENT / CHANNEL_STAGE_DENOMINATOR_CLASS_A_VALIDATED / SIGNAL_GRADE_MONITOR_ORDER_INFLUENCE_CONFIRMED / OUTCOME_MATERIALITY_UNKNOWN / FORMAL_UNCHANGED`.
- Persistence/runtime wiring of complete denominators remains Class B proposal-first; no such wiring was implemented.
- Exact next: separate post-grade scarcity from gate scarcity. Audit complete-qualified population vs 3+3 selected population by price pool under the deployed comparator, quantify what existing evidence can and cannot say about quota/cutline displacement, and reuse existing Price-Volume pool-integrity/quota research rather than duplicating it. Keep outcomes closed until denominator and comparator-version provenance are clean.


## B-217 — post-grade quota scarcity separated from gate scarcity; full historical displacement remains UNKNOWN (2026-09-27 14:58 Asia/Taipei)
- Continued B-216 exact-next after fresh canonical read. Reused PVE-153..159 and existing price-pool quota research; did not duplicate the full-pool receipt design and did not inspect outcomes.
- Formal semantics confirmed: scoreCandidate ok=true is the fully-qualified pre-quota population; deployed independent GENERAL/THOUSAND pools each truncate the ranked qualified list to three seats; no cross-pool backfill.
- Important diagnostic correction: finalGeneralSelected/finalThousandSelected are post-cut selected counts, not complete qualified denominators. A displayed 3/3 is right-censored for qualifiedCount: it proves qualifiedCount>=3 but cannot distinguish exactly 3 from 4, 10 or more. A displayed 0/3, 1/3 or 2/3 does identify the same-scan qualifiedCount for that pool, assuming the diagnostic derives from the complete scored list.
- Frozen scarcity taxonomy:
  - GATE_LIMITED: qualifiedCount<3; unused seat reflects insufficient fully-qualified candidates, not quota displacement.
  - EXACTLY_FILLED: qualifiedCount=3.
  - QUOTA_BINDING: qualifiedCount>3; rank4+ rows are fully qualified but quota-displaced, never gate-rejected.
  - CROSS_POOL_STRANDING: one pool qualifiedCount<3 while the opposite pool qualifiedCount>3; an unused seat coexists with at least one qualified opposite-pool displacement because cross-pool backfill is forbidden.
  - UNKNOWN_HISTORICAL: complete denominator/comparator/generation lineage unavailable.
- Current bounded QUALIFIED_NOT_SELECTED Shadow can salvage near-cutline evidence only. It cannot certify complete qualifiedCount, full rank4+ population or historical cross-pool-stranding prevalence. Pre-V8.13 exact comparator replay is additionally incomplete where post-consensus provenance is missing.
- Repository audit found no implemented immutable PVE-156 pool-integrity table/receipt. PVE-156 remains explicitly NOT_IMPLEMENTED. Therefore historical quota opportunity frequency and full displacement opportunity cost remain UNKNOWN; no current-code historical recomputation may be relabeled PIT.
- Same-scan feasibility is better than historical persistence: the after-market selector already has complete scored/Formal-ok rows and selected symbols in memory, and the research semantic classifier can rank complete Formal-ok decision states. qualifiedCount, quotaBinding, rank4+ QNS, crossPoolStranding and CUTLINE_NEXT are computable with zero new market calls.
- Pure computation/tests against already-loaded complete decision states can be Class A. Durable immutable scan/runtime/D1 persistence remains Class B proposal-first. Any quota/backfill change is Class C.
- Durable artifacts:
  - research/post_grade_quota_scarcity_accounting_v0_1.json — commit 05b765829e24fa6a8d3674314f31ba888cbac436.
  - research/quota_scarcity_observer_feasibility_v0_1.json — commit 6891482a59e9feb50ba76b73c014f5707ef637fe.
- Counterevidence remains active: independent 3+3 may be justified by liquidity, price-level/capital granularity, concentration and execution risk. Mechanical displacement alone is not evidence that cross-pool flexibility improves outcomes.
- PRICE_POOL_QUOTA_REFORMULATION remains NOT_OPTIMIZATION_READY. No FORMAL_OPTIMIZATION_CANDIDATE and no Formal/runtime behavior changed.
- Exact next: move one layer downstream from selection scarcity to actionable-opportunity scarcity. Audit whether fully selected plans can still fail to become actionable BUY because of plan construction / buy-zone / freshness / 15-minute confirmation / maxChase sequencing, and separate SELECTED_BUT_NO_BUY causes using existing prospective execution/monitor receipts. Reuse Execution Alpha and BUY funnel research; do not infer no-BUY from absence unless exact-date lifecycle completeness is proven. Preserve FIRST/ADD/REDUCE/RE-ADD state semantics and keep actual fills UNKNOWN without trusted broker lifecycle.


## B-218 — SELECTED→BUY funnel frozen; NO-BUY frequency remains unidentifiable without monitor-run completeness (2026-09-27 16:07 Asia/Taipei)
- Continued B-217 exact-next after fresh governance/worklist/checkpoint/latest-main read. A concurrent research commit 7108fe0ff2906ac257bd9c2f78128581c9334fa0 had already frozen research/selected_to_buy_causal_funnel_v0_1.json but had not advanced canonical checkpoint; reused it rather than duplicating taxonomy.
- Structural selected-plan funnel is now explicit: SELECTED_PLAN -> PLAN_FIELDS_READY -> MONITOR_OBSERVED -> quote freshness/not trial/not halted -> Formal 15m freshness -> channel entry state -> finalDecision BUY -> plan-date valid -> current quote <= maxChase -> BUY_SIGNAL_OBSERVED. Broker fill is a separate UNKNOWN layer.
- A/B cause taxonomy remains channel-specific. A distinguishes never reached zone vs zone/no-confirm; B distinguishes no valid breakout, confirmed breakout/no retest, retest failure/no reacceleration, 15m-close maxChase and operation-layer quote maxChase. EA-022/023 already owns the ~10:45 theoretical earliest A/B BUY boundary and B failed-reentry resurrection; not duplicated.
- New observability finding: current execution recorder is milestone/event sampled, not an exhaustive per-monitor-run lifecycle ledger. It writes OPEN_BASELINE, FIRST_10M_COMPLETE, FIRST_15M_COMPLETE, FIRST_30M_COMPLETE and FORMAL_SIGNAL_OBSERVED while monitor results exist. Therefore fixing the existing LIMIT500/newest80 reader alone would still NOT certify an all-session NO-BUY.
- Missing BUY is observationally equivalent to monitor not running/failing, symbol/plan missing from one or more runs, monitor complete but no BUY, BUY outside bounded read surface, or batch-level FORMAL_SIGNAL_OBSERVED not matching the symbol. INSERT OR IGNORE idempotency does not prove expected-run completeness.
- Safe states frozen: BUY_SIGNAL_OBSERVED requires positive same-symbol signal evidence; NO_BUY_COMPLETE requires expected-vs-actual monitor-run completeness + plan membership + no BUY; otherwise NO_BUY_UNKNOWN_COVERAGE. ACTUAL_FILL remains UNKNOWN without broker/order lifecycle.
- This invalidates a stronger historical interpretation of the prior aggregate selectedPlans=4 / buyTriggeredPlans=1 readback: it cannot establish a named-date/cohort 25% BUY rate or 75% policy-caused idle capital.
- Minimum future receipt must include plan/date/version identity, expected monitor runs, actual run ids/start/end/status, per-run plan membership, quote/15m freshness, final decision/action or lossless lifecycle transitions, same-symbol signal IDs, first/last observed timestamps, explicit session-complete flag, exact-date reader pagination/count/truncation, and immutable worker/generation identity.
- Durable artifact: research/selected_no_buy_observability_gap_v0_1.json, commit 88dc6ad05668e35eeb7acb1cf7f0fdbd1aeff930.
- Engineering boundary: classifier over certified existing receipts = Class A; exhaustive monitor-run receipt/shared persistence = Class B proposal-first; entry/freshness/maxChase/monitor behavior change = Class C.
- Counterevidence remains active: early-session blindness, retest waiting and maxChase may provide avoidance benefit; higher participation is not automatically better. Economic test must compare MISSED_UPSIDE vs AVOIDANCE_BENEFIT net of costs and idle-capital benchmark across independent dates/regimes/channels.
- Status: SELECTED_TO_BUY_STRUCTURE_FROZEN / NO_BUY_DENOMINATOR_DATA_QUALITY_BLOCKED / OUTCOME_MATERIALITY_UNKNOWN / NOT_OPTIMIZATION_READY / FORMAL_UNCHANGED. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: audit whether LAST_MONITOR_KEY / Cron audit / signal-state episode data can jointly provide any certified subset of complete plan-day monitor coverage without new persistence. If a strict certified subset exists, define a Class-A completeness classifier and measure coverage only (no outcomes yet). If not, freeze the minimal Class-B monitor-run receipt proposal and move to the next nonblocked scarcity layer rather than inferring NO-BUY from absence.


## B-219 — existing monitor receipts cannot certify complete plan-day NO-BUY coverage (2026-09-27 Asia/Taipei)
- Continued B-218 exact-next after fresh governance/worklist/checkpoint read and repository-wide source search. Outcomes remained closed; no Formal/runtime behavior changed.
- Audited the three candidate evidence families jointly: LAST_MONITOR_KEY, Cron audit, and per-symbol signal-state episodes/pending deliveries.
- LAST_MONITOR_KEY is only the latest monitoring snapshot. It can positively prove that one monitor observation occurred and expose its then-current results, but it is overwritten by later runs and is not an immutable plan-day run ledger. It cannot prove all expected runs occurred or that a selected symbol remained present for the full session.
- Cron audit proves scheduled job executions/status only within its retained/read surface. Generic INTRADAY_MONITOR success is batch-level evidence; it does not certify per-symbol plan membership, quote/15m freshness, finalDecision/action, or absence of a BUY for every expected run. Existing /api/cron/status exposes only latest/recent bounded runs, not a complete exact-date expected-vs-actual schedule receipt.
- Signal-state episodes/pendingDeliveries are positive signal/delivery state. Their absence cannot prove the monitor ran successfully without BUY; they are not a negative-evidence ledger. A signal episode can corroborate BUY_SIGNAL_OBSERVED when same-symbol identity is proven, but cannot certify NO_BUY_COMPLETE.
- Joint intersection does not repair the missing denominator: latest snapshot + bounded batch Cron success + no signal episode still leaves observationally equivalent monitor gaps, symbol-membership gaps, stale-data skips, and true policy no-BUY. Therefore there is no strict existing plan-day subset that can be certified as exhaustive NO_BUY solely from these three receipts.
- Existing execution-recorder milestone rows do not close the gap either: they are event/milestone sampled rather than per-run, and FORMAL_SIGNAL_OBSERVED has known batch-scope ambiguity unless independently same-symbol matched.
- Safe classification remains: positive same-symbol signal evidence => BUY_SIGNAL_OBSERVED; otherwise NO_BUY_COMPLETE is unavailable without exhaustive run/membership evidence and must remain NO_BUY_UNKNOWN_COVERAGE. ACTUAL_FILL remains UNKNOWN without trusted broker/order lifecycle.
- Minimal Class-B proposal is now frozen conceptually: immutable monitor-run receipt keyed by tradeDate/runId with scheduledAt/start/end/status/version/generation, expected-run identity, per-run selected-plan membership, symbol observation status, quote/15m freshness, finalDecision/action/maxChase block state, same-symbol signal IDs, plus explicit session-finalization comparing expected vs actual runs. Reader requires exact-date total/count/pagination/truncation metadata. No write/runtime implementation was made.
- Bias/falsification controls: no absence-as-zero, no historical intraday reconstruction, no daily-K substitution for 15m, no outcome-conditioned cause labels, no threshold tuning, no fabricated Shadow. This finding blocks causal idle-capital attribution but does not prove the current entry filters are beneficial or harmful.
- R01-R08/I01-I07: no new mature outcome/intervention evidence. Execution Alpha causal NO-BUY decomposition remains DATA_QUALITY_BLOCKED; positive BUY observations remain usable subject to their own provenance.
- Engineering classification: this audit is Class A evidence-only. Exhaustive shared monitor-run persistence is Class B proposal-first. Entry/freshness/maxChase/signal/push changes remain Class C.
- Status: EXISTING_RECEIPTS_INSUFFICIENT_FOR_EXHAUSTIVE_NO_BUY / NO_STRICT_CERTIFIED_SUBSET / CLASS_B_MONITOR_RUN_RECEIPT_REQUIRED / OUTCOMES_CLOSED / FORMAL_UNCHANGED. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: move to the next nonblocked scarcity layer without inferring NO-BUY frequency. Audit selected-plan construction validity and persistence before intraday monitoring: determine whether every SELECTED symbol receives an immutable next-session plan with buyLow/buyHigh/stop/maxChase/channel/planDate and whether plan construction/persistence failures are separately observable from monitor failures. Reuse existing plan/recommendation receipts; keep outcomes closed and actual fills UNKNOWN.


## B-220 — SELECTED plan construction is auditable; monitor-consumed plan identity is not immutable (2026-09-27 Asia/Taipei)
- Continued canonical B-219 exact-next after fresh Shared/governance/worklist/checkpoint/latest-main reconciliation. Outcomes remained closed; Formal/runtime behavior unchanged.
- Source audit confirms Formal plan construction is explicit: allocateAndBuildPlans creates next-session planDate and plan-time buyLow/buyHigh/breakout/maxChase/stop plus A/B mode semantics. Successful after-market flow saves operational plans into STOCK_CONFIG_V7; intraday monitor subsequently loads operational state through loadStockConfig(env).
- Existing v8_trade_journal_plans is a durable plan-time ledger for exact system-recorded Formal plans. Prior Tier-A audit already established that these rows preserve plan_date, strategy, buyLow/buyHigh, maxChase, stop and allocation/risk fields without future reconstruction. Therefore complete exact system-recorded journal rows can positively classify PLAN_CONSTRUCTED_COMPLETE.
- Important separation: plan construction and monitor coverage are not the same scarcity layer. A selected symbol with a complete immutable journal plan is evidence that the plan existed at scan time even if next-session monitoring coverage remains UNKNOWN.
- New provenance gap: historical journal plan and mutable operational STOCK_CONFIG_V7 do not expose a common immutable plan-instance identity/hash/generation proving that every later monitor run consumed exactly the same plan object. Current KV is operational/current state and may be overwritten/recalculated/recovered; journal is historical evidence. Value equality is corroboration, not immutable identity.
- Safe states frozen: PLAN_CONSTRUCTED_COMPLETE = exact system-recorded Formal journal row with required plan fields complete; PLAN_CONSTRUCTION_INCOMPLETE only when the selected denominator/journal-day is complete and required row/fields are missing or invalid; RUNTIME_PLAN_MATCHED requires positive shared immutable identity; otherwise RUNTIME_PLAN_UNKNOWN. Recovered/manual rows are not equivalent to exact system-recorded Formal plans.
- Required plan fields for this classifier: scanDate, planDate, symbol, strategy/channel semantic, buyLow, buyHigh, stop, maxChase. Breakout is channel-dependent and may be null for A, so null breakout is not universal plan failure.
- Counterevidence/guards: do not call runtime-plan UNKNOWN a monitor failure; do not call missing convenience readback a construction failure without complete journal-day denominator; never reconstruct historical plan from current KV; no future outcomes used.
- Durable artifact: research/selected_plan_construction_persistence_audit_v0_1.json, commit 68652f248b59b51329b02f7371f38f76d3719531.
- Engineering boundary: offline completeness classifier over immutable journal = Class A; additive immutable plan identity/hash or monitor-consumption receipt = Class B proposal-first; any plan/monitor decision behavior change = Class C.
- Status: PLAN_CONSTRUCTION_OBSERVABLE / RUNTIME_PLAN_IDENTITY_GAP / MONITOR_COVERAGE_STILL_BLOCKED / OUTCOMES_CLOSED / NOT_OPTIMIZATION_READY / FORMAL_UNCHANGED. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: use the immutable trade-journal day+plan contract to test whether plan-construction completeness can be measured on the exact system-recorded Formal denominator without outcomes. Audit journal write ordering/transactionality and selectedCount-vs-plan-row consistency: distinguish scan selected but journal persistence failed from legitimate zero-selection and recovered/manual rows. If a strict denominator is available, freeze a Class-A PLAN_CONSTRUCTION_COMPLETENESS classifier and measure only coverage; do not inspect returns or tune plan rules.


## B-221 — strict positive plan-construction completeness is classifiable, but count equality is not immutable generation identity (2026-09-27 Asia/Taipei)
- Continued canonical B-220 exact-next after fresh governance/worklist/checkpoint/latest-main read. Outcomes remained closed; Formal/runtime behavior unchanged.
- Source audit of recordTradeJournalDay confirms the exact Formal stocks list drives both v8_trade_journal_days.selected_count and one v8_trade_journal_plans row per stock. The writer then readbacks day selected_count plus COUNT(plan rows) and returns stored:true,verified:true only when both equal list.length; otherwise it returns stored:false,verified:false.
- Exact-date readTradeJournalHealth independently requires a day row and selected_count===planCount. scheduled_health further compares journal selectedCount and planCount against /api/scan/status selectedCount after market. These are positive completeness receipts, not outcome evidence.
- Recovered/manual history is stored separately and must not enter the exact system-recorded Formal denominator.
- Transactionality caveat: day upsert, same-date plan DELETE, and per-plan INSERTs are sequential statements; no explicit atomic D1 transaction is visible. A mid-write failure can therefore leave a partial same-date state. Count verification/health can detect count mismatch, but a later same-date rerun can rewrite rows.
- Provenance caveat: selected_count===planCount by itself does not prove the plan rows and scan receipt belong to the same immutable scan generation. Therefore strict COMPLETE should require positive exact-date system-recorded journal consistency plus contemporaneous scan identity/generation evidence where available; otherwise generation is UNKNOWN.
- Safe classifier frozen conceptually: PLAN_CONSTRUCTION_COMPLETE = positive exact system-recorded same-generation day/plan/scan agreement and required plan fields complete; ZERO_SELECTION_COMPLETE = positive day selected_count=0 + planCount=0 + contemporaneous scan selectedCount=0; INCOMPLETE_OBSERVED = positive same-run stored/verified false or exact-date count mismatch against contemporaneous scan; all absence, generation mismatch, reader uncertainty, or partial provenance = UNKNOWN.
- This answers the B-220 denominator question narrowly: a strict positive subset exists, but it is not safe to classify all historical dates from day/plan count equality alone. Missing rows remain UNKNOWN, never failure/0.
- Counterevidence/bias controls: no current KV historical reconstruction; no recovered/manual denominator; no absence-as-zero; no cross-generation count matching; no future outcomes; no threshold tuning. R01-R08/I01-I07 unchanged.
- Engineering boundary: classifier/spec is Class A evidence-only. Adding immutable journal generation/commit identity or atomic shared-runtime persistence is Class B proposal-first; no such implementation was made.
- Durable artifact write was attempted for research/plan_construction_completeness_contract_v0_1.json but connector safety checks blocked the write; checkpoint remains the canonical durable target for this cycle.
- Status: STRICT_POSITIVE_PLAN_COMPLETENESS_SUBSET_EXISTS / HISTORICAL_ALL_DATE_COMPLETENESS_UNKNOWN / TRANSACTIONALITY_CAVEAT / OUTCOMES_CLOSED / NOT_OPTIMIZATION_READY / FORMAL_UNCHANGED. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: audit the existing exact-date journal/read APIs and production-safe read surfaces to determine whether the strict positive subset can be counted prospectively without adding runtime persistence. Measure coverage only if same-generation identity can be proven from existing receipts; otherwise freeze the minimal Class-B journal generation/commit receipt proposal and move to selection-time structural capital utilization using only positively complete plan dates. Do not inspect returns or infer actual idle cash.


## B-222 — selected-plan same-generation witness narrows the plan provenance blocker (2026-09-27 Asia/Taipei)
- Fresh-read governance/worklist/checkpoint and reconciled newer main research commits through d0e558899a016107c10c0734b28936c9cfb42df3; did not repeat B-221 or concurrent Portfolio Risk work.
- Corrected the broad B-221 provenance blocker for SELECTED plans: recordTradeJournalDay uses one invocation-level now timestamp in one first-primary D1 session; each v8_trade_journal_plans row receives recorded_at=now and the attached selected trade_research_snapshots row receives updated_at=the same now.
- Same-date reruns strengthen a strict positive witness: plans are deleted/reinserted and selected research snapshots are upserted with the new invocation timestamp. A fully successful rerun aligns both timestamps; asymmetric/partial writes fail the strict equality guard and remain UNKNOWN.
- Strict positive selected-generation classifier requires exact scan_date + symbol, plan.recorded_at===selectedSnapshot.updated_at, FULL_FORMAL_SCAN sourceCompleteness, required V8.13 ranking provenance/definition-comparator versions, and positively verified journal-day selected_count===planCount.
- Therefore selected-only sizing/plan attribution is STRUCTURALLY_GENERATION_CERTIFIABLE_FROM_EXISTING_STORAGE; the independent non-selected Shadow archive remains generation-uncertified across stores.
- Reader limitation: the convenient /api/journal surface exposes plan recorded_at but not the selected research snapshot updated_at/raw provenance. Storage is source-ready; live/readback certification still needs a safe research reader/classifier path. Absence or timestamp mismatch remains UNKNOWN, never BAD/0.
- Bias/falsification controls: no outcome fields inspected for this correction; no historical Shadow fabricated; no cross-generation scanDate|symbol-only join; no inference from timestamp proximity (strict equality only); no change to Formal ranking, 3+3, capital, plans, monitoring, signals or push.
- R01-R08/I01-I07: no mature outcome/intervention evidence added. This improves provenance/observability for PriorityScore sizing and structural capital-utilization research only; economic value remains UNKNOWN.
- Engineering classification: this reconciliation/classifier contract is Class A evidence-only. A research-only reader that exposes the existing selected snapshot timestamp/provenance without shared runtime side effects may qualify Class A after invariant tests; any shared API/runtime/persistence modification is Class B proposal-first. Formal sizing/ranking changes remain Class C.
- Durable evidence already on main: research/portfolio_risk_selected_generation_witness_v0_1.json at commit d0e558899a016107c10c0734b28936c9cfb42df3. No FORMAL_OPTIMIZATION_CANDIDATE.
- Status: SELECTED_GENERATION_WITNESS_SOURCE_READY / READER_PATH_PENDING / NONSELECTED_SHADOW_STILL_GUARDED / FORMAL_UNCHANGED.
- Exact next: audit existing research/read APIs for a zero-new-persistence path that can expose exact-date selected trade_research_snapshots.updated_at plus FULL_FORMAL_SCAN and V8.13 provenance alongside journal plan recorded_at. If an isolated read-only path already exists, define/test a Class-A strict-positive generation classifier and measure coverage only, outcomes closed. If exposing it requires shared API/runtime changes, freeze a Class-B reader proposal and move to the next nonblocked prospective research layer; do not weaken the equality/provenance guards.

## B-223 — selected-generation storage is source-ready but current protected read surfaces cannot certify live coverage (2026-09-27 Asia/Taipei)
- Continued B-222 exact-next after fresh latest-main/source reconciliation. Outcomes remained closed; Formal/runtime behavior unchanged.
- Existing storage is sufficient in principle for a strict positive selected-generation witness: `/api/journal` exposes `v8_trade_journal_plans.recorded_at`, while internal `readResearchSnapshots()` reads `trade_research_snapshots.updated_at` plus `snapshot_json` from first-primary D1.
- The fail-closed Class-A `research/portfolio_risk_selected_generation_classifier_v0_1.mjs` already exists on main and requires exact scan_date+symbol, plan/snapshot timestamp equality, FULL_FORMAL_SCAN, required PriorityScore/comparator provenance and verified journal count completeness. This was reused rather than duplicated.
- Zero-new-persistence live coverage is nevertheless not externally measurable from current protected surfaces: `/api/research/dashboard` consumes snapshot rows internally but does not expose the raw selected snapshot `updated_at` / provenance rowset required to pair with `/api/journal` plan timestamps.
- Therefore the B-222 alternative that an existing isolated read path might already be sufficient is falsified. This is a reader observability gap, not evidence that stored selected generations are incomplete.
- Minimal fix remains Class B proposal-first: a protected research-only exact-date/keyset reader (or bounded equivalent extension) exposing the existing plan/snapshot witness plus requested/returned keyset counts and pagination/truncation completeness. It must add zero persistence and zero market-data calls and must not alter Formal/ranking/quota/capital/monitor/signal/push behavior.
- Missing row, timestamp mismatch, provenance gap, or incomplete keyset remains UNKNOWN, never BAD/0. No historical reconstruction/backfill and no outcome lookup were used.
- Durable artifact: `research/selected_generation_reader_gap_v0_1.json`, commit `36f9d423570e859fb84e0a82a6be7fb74e3228c6`.
- Engineering boundary: existing offline classifier = Class A; exposing new shared protected runtime/API fields = Class B owner approval; sizing/ranking changes = Class C.
- Status: `SELECTED_GENERATION_STORAGE_SOURCE_READY / CLASS_A_CLASSIFIER_READY / LIVE_COVERAGE_READER_BLOCKED / OUTCOMES_CLOSED / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: move to selection-time structural capital-utilization scarcity without using returns or assuming fills. On only positively complete/system-recorded plan dates, audit planned deployment as a function of selected count, pool composition and 35% single-name cap; separate intentional cash reserve from quota/gate scarcity and from unobserved intraday no-BUY. Reuse existing Portfolio Risk capital-allocation research and do not duplicate its sizing/cost studies.

## B-224 — V8.9 ring-fenced Formal pools create a post-version Portfolio Risk denominator boundary (2026-09-27 Asia/Taipei)
- Continued B-223 exact-next and reused existing Portfolio Risk PR-028 rather than repeating the already-frozen 35/60/85 deployment-reserve geometry.
- Architecture boundary verified at commit `05cc3efd889476a44685c0a07df87f2048547eee` (`Deploy V8.9.0 three-pool Hybrid Shadow`, 2026-09-23 21:54:24 Asia/Taipei). From V8.9 onward, FORMAL_GENERAL and FORMAL_THOUSAND are independently allocated by `allocateAndBuildPlans(..., STRATEGY_POOL_CAPITAL=200000)`; Hybrid has its own 200000 but remains Shadow-only.
- Legacy V8.5 trade journal still has one `v8_trade_journal_days` row per date with one `total_capital`; `v8_trade_journal_plans` has no top-level strategy_pool field. Post-V8.9 `strategyPool` is retained only inside stored `plan_json`.
- V8.9.x/V8.10 patch audit found no journal schema/writer repair. `recordTradeJournalDay(scanDate,stocks,totalCapital,...)` still receives the concatenated Formal plan list plus a compatibility `totalCapital` whose scale remains one pool's 200000.
- `/api/journal` does not SELECT `plan_json` and exposes no strategyPool. Therefore current protected journal readback cannot safely split post-V8.9 plan rows into FORMAL_GENERAL versus FORMAL_THOUSAND for Tier-A pool-aware denominators.
- Structural falsification: after V8.9, combined Formal planned capital must not be divided by the journal's single 200000. Example: one 70000 plan in each Formal pool is 35% per pool and 35% on a consolidated 400000 Formal-strategy denominator, but the legacy day denominator would report 70%. Three 170000 pools on both sides would mechanically appear as 170% if misread against 200000.
- Existing Tier-A receipts for 2026-09-18 and 2026-09-21 predate the V8.9 deployment and are NOT invalidated. This is a prospective/version-boundary evidence issue, not a retroactive error claim.
- Post-V8.9 pooled `deploymentRatioPct`, `projectedHeatPct`, and total-capital risky-name HHI are not promotion-grade unless pool identity/capital is positively recovered from plan-time evidence. Within-deployed normalization can remain algebraically computable but the estimand must state whether it is per-pool or cross-pool.
- Durable artifact: `research/portfolio_risk_pool_denominator_transition_v0_1.json`, commit `e531db3e2abf9e128291800f6034354b104ea910`.
- Engineering boundary: reader/schema exposure of plan-time pool identity/capital is Class B proposal-first. No Formal capital, allocation, quota, ranking, monitoring or signal behavior changed. No FORMAL_OPTIMIZATION_CANDIDATE.
- Status: `POST_V8_9_DENOMINATOR_INCOMPATIBILITY_CONFIRMED / PRE_V8_9_RECEIPTS_RETAINED / POST_V8_9_POOL_AWARE_READER_REQUIRED / OUTCOMES_CLOSED / FORMAL_UNCHANGED`.
- Exact next: audit whether the existing `v9_strategy_pool_plans` archive already provides an exact-date, immutable-enough, read-accessible Class-A source for post-V8.9 per-pool plan-risk denominators. Check generation/version identity, completeness, mutation/rerun semantics, reader pagination and whether its plan_json preserves the same Formal plan object. If source-ready but reader-blocked, freeze the smallest Class-B read proposal and move on; do not add persistence or recompute old pools from current code.

## B-225 — v9 strategy-pool archive is pool-source-ready but not immutable-generation-certified (2026-09-27 Asia/Taipei)
- Continued B-224 exact-next without reading outcomes. The existing `v9_strategy_pool_plans` table positively carries `scan_date + pool_id + symbol`, per-row `capital=STRATEGY_POOL_CAPITAL`, and full `plan_json`; therefore post-V8.9 pool identity and per-pool capital are source-available without new market-data persistence.
- Promotion-grade lineage is not established. `archiveStrategyPools()` DELETEs each same-date+pool population and reinserts it using a fresh timestamp; the table has no immutable scan-generation id, worker definition hash or parent decision-state id.
- The mutability concern is real rather than theoretical: V8.9.8 staged historical recovery can call `archiveStrategyPools(env,date,...)` for FORMAL_GENERAL, FORMAL_THOUSAND and Hybrid on a historical date, replacing/recreating rows under the same primary keys.
- Existing `readThreePoolSelectionPerformance()` is not an outcomes-closed provenance reader. It reads the pool archive and then joins history to calculate D1/D3/D5/latest return. Its response also lacks exact-date expected/returned counts, truncation/hasMore and generation-completeness metadata.
- Safe conclusion: pool-aware plan-time data are SOURCE_READY, but immutable generation certification and clean exact-date coverage remain NOT_READY. Positively observed rows may support descriptive plan-time geometry with explicit caveats; absence or lineage ambiguity remains UNKNOWN.
- The smallest Class-B repair is read-only, not new persistence: expose exact-date/keyset pool rows with pool capital, full plan-time plan evidence and count/truncation metadata, without history/outcome joins. This still does not erase same-date generation mutability; a strict lineage witness would need separate positive provenance.
- Durable artifact: `research/strategy_pool_archive_generation_audit_v0_1.json`, commit `047f4ca23158e87639bac9228a1c2cad417eb970`.
- Status: `POOL_ARCHIVE_SOURCE_READY / SAME_DATE_MUTABLE / GENERATION_UNCERTIFIED / OUTCOME_CLEAN_READER_ABSENT / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: build the outcome-independent per-pool capital-scarcity geometry implied by the owner-approved ring fence and B-217 quota taxonomy. Separate per-pool selected-count reserve, cross-pool stranding, cap/rounding shortfall, downstream pending-entry/no-BUY and actual-fill unknown. This is algebraic Class-A research only; do not infer that higher utilization is better and do not change capital rules.

## B-226 — per-pool capital scarcity geometry separates gate, quota, ring-fence and downstream cash (2026-09-27 Asia/Taipei)
- Continued B-225 exact-next as algebraic Class-A research only; no outcomes, no runtime change. Reused B-217 quota taxonomy and Portfolio Risk PR-028 reserve decomposition rather than creating competing definitions.
- V8.9+ Formal strategy accounting has two independent 200k pools. Per pool nominal deployment is selectedCount 0/1/2/3 => 0%/35%/60%/85%; per-name 35% cap and NT$1000 flooring can only reduce actual planned allocation below that nominal target because capped/rounded excess is not redistributed.
- Consolidated two-Formal-pool nominal deployment is the capital-weighted combination over 400k Formal strategy capital, not the sum of percentages. Deterministic matrix for GENERAL/THOUSAND selected counts 0..3 is frozen in the artifact.
- High-value counterexample: GENERAL=3, THOUSAND=0 means 85% deployment inside General but only 42.5% across the two ring-fenced Formal strategy pools. GENERAL=1, THOUSAND=1 is 35% consolidated, not 70%. GENERAL=3, THOUSAND=3 is still only 85% nominal, leaving a 15% design reserve before cap/rounding and before BUY/fill uncertainty.
- Scarcity layers are now explicitly separated: upstream qualified/gate scarcity; post-grade quota displacement; ring-fence stranding; cap/rounding implementation shortfall; plan-exists pending-entry/NO-BUY uncertainty; and broker-confirmed realized-fill cash. These layers must not be collapsed into one `idle capital` metric.
- B-217 linkage preserved: selectedCount<3 identifies qualifiedCount under a complete same-generation scored list; selectedCount=3 is right-censored (qualifiedCount>=3) and cannot distinguish EXACTLY_FILLED vs QUOTA_BINDING without the full pre-cut denominator. CROSS_POOL_STRANDING requires underfilled one side plus >3 qualified on the other, not merely asymmetric selected counts.
- First-tranche arithmetic 0/21/36/51% per pool for selectedCount 0/1/2/3 is only deploy-ratio × 60%; it is not observed exposure or fill evidence.
- Counterevidence remains active: ring-fencing, reserve and per-name caps may protect liquidity/concentration/execution risk. Higher utilization is not a stand-alone objective and no relaxation is implied.
- Durable artifact: `research/formal_pool_capital_scarcity_geometry_v0_1.json`, commit `f06651f672305c23293e5fc10980ac5822933e1a`.
- Status: `STRUCTURAL_SCARCITY_DECOMPOSITION_FROZEN / CAUSAL_GATE_VALUE_UNKNOWN / NO_BUY_STILL_DATA_BLOCKED / ACTUAL_FILL_UNKNOWN / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: return upstream to the first nonblocked scarcity cause and identify which admission/setup/RR/grade/quota states can be assigned on the same scan without first-failure bias. Reuse the existing formal gate-overlap observer and B-217 quota accounting. Freeze an outcome-independent `SCARCITY_LAYER_VECTOR` contract that can carry multiple simultaneous causes per symbol/pool, rather than one fail-fast exclusion reason. Do not persist or change runtime; first prove the classifier can be computed from existing Class-A decision-state helpers.

## B-227 — SCARCITY_LAYER_VECTOR freezes multi-cause blocker semantics without marginal-attribution leakage (2026-09-27 Asia/Taipei)
- Continued B-226 exact-next. No new gate evaluator was invented: the contract composes existing validated Class-A `formal_gate_overlap_observer_v0_1`, `formal_gate_replay_v0_1`, semantic classifier, B-217 quota accounting and B-226 capital geometry.
- Candidate scarcity is now represented as a vector rather than one reason: exact Formal firstFailure is preserved, while all same-scan observable gates retain PASS/FAIL/UNKNOWN/NOT_EVALUABLE. Derived `observedFailGates` may contain multiple blockers; UNKNOWN and dependent NOT_EVALUABLE never become FAIL.
- Critical interpretation firewall: overlap counts are not marginal gate contributions. Example X fails LIQUIDITY+AB_SETUP, Y fails LIQUIDITY, Z fails AB_SETUP. Fail-fast counts are LIQUIDITY=2, AB_SETUP=1; overlap counts are 2 and 2; neither says removing a gate adds that many Selected names.
- Single-gate replay remains bounded: `ALL_OTHER_OBSERVED_GATES_CLEAR` means only that all other currently observed states are clear under the frozen observer. It is not a recovered Formal candidate, selected rank, BUY, fill or marginal-alpha estimate. UNKNOWN/NOT_EVALUABLE states remain unresolved.
- Vector layers now separate: gate-observed blockers; unique-observed-clear single-removal state; post-grade quota; ring-fence capital mapping; plan construction; intraday NO-BUY coverage; actual fill. This prevents gate scarcity, quota scarcity and downstream cash from being collapsed into one explanation.
- Exact pool denominator rules remain B-217 authoritative: quota displacement only applies after formalOk=true; selectedCount=3 is right-censored unless full qualifiedCount is retained; CROSS_POOL_STRANDING needs an underfilled pool plus >3 qualified on the opposite side.
- Durable artifact: `research/scarcity_layer_vector_v0_1.json`, commit `14938f9eacb095b3f48a6874043ab950e789aa23`.
- Engineering: pure offline vector computation from existing observers = Class A feasible; persistence/runtime wiring = Class B proposal-first; gate/quota/capital change = Class C. No FORMAL_OPTIMIZATION_CANDIDATE.
- Status: `MULTI_CAUSE_SCARCITY_CONTRACT_FROZEN / FIRST_FAILURE_NOT_MARGINAL / NO_BUY_COVERAGE_BLOCKED / FORMAL_UNCHANGED`.
- Exact next: test the vector contract against the existing observer/replay test fixtures and formal gate dependency semantics. Identify which gates are independently observable versus prerequisite-dependent, and freeze a gate-family denominator matrix so future empirical scarcity rates never divide UNKNOWN/NOT_EVALUABLE rows into the wrong denominator. Do not add runtime wiring.

## B-228 — gate scarcity denominator matrix prevents UNKNOWN/dependency rows from contaminating fail rates (2026-09-27 Asia/Taipei)
- Continued B-227 exact-next against the existing gate observer/replay semantics and test fixtures. Outcomes closed; runtime/Formal unchanged.
- Five denominator families are now frozen: observer population (coverage only), evaluable (PASS+FAIL), applicable (semantic condition actually applies), Formal-reach (all prior gates clear and current gate evaluable/applicable), and overlap (current gate evaluable/applicable regardless of earlier observed failures).
- UNKNOWN and prerequisite-driven NOT_EVALUABLE are excluded from fail-rate denominators and reported separately. Zero denominator is UNKNOWN/NO_DENOMINATOR, never coerced to 0% fail.
- Dependency guards verified from existing tests: AB_SETUP fail makes TARGET_AVAILABLE not evaluable, which makes RR and FINAL_SIGNAL_GRADE not evaluable; fundamentalCount<3 makes FUNDAMENTAL_COMPONENT_COUNT fail while FUNDAMENTAL_QUALITY is NOT_EVALUABLE. These rows must not be double-counted as downstream failures.
- Conditional applicability is explicit: low-volume LIQUIDITY may be UNKNOWN when exception inputs are missing; SMALL_CAP/MID_CAP rules depend on market-cap bands; valuation with no positive TTM PE is a safe not-applicable skip, not valuation failure.
- Raw firstFailureCount remains order-dependent; observedFailCount is overlap only; `ALL_OTHER_OBSERVED_GATES_CLEAR` from single-removal replay is still not recovered Selected. Marginal selected effect remains UNKNOWN without same-PIT selection/ranking/quota replay.
- Minimum future report per gate now requires pass/fail/unknown/notEvaluable, evaluable coverage, applicable denominator/fail rate, Formal-reach denominator/fail rate, overlap denominator/fail rate, observer/formal-order version and complete scan-generation provenance.
- Durable artifact: `research/scarcity_gate_denominator_matrix_v0_1.json`, commit `6b94d1a5cf5e68fc8bd09a30fd9df7378879a068`.
- Status: `GATE_DENOMINATOR_SEMANTICS_FROZEN / OBSERVABILITY_NOT_CAUSALITY / FIRST_FAILURE_NOT_MARGINAL / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: audit whether the full inputs required by the gate-overlap observer are already retained on any clean same-generation full-population source. Reuse the existing gate-overlap persistence feasibility work; do not duplicate it. If full historical coverage is not source-ready, identify the smallest prospective cohort that can be evaluated without runtime writes, then return to Liquidity Admission Shadow PR #121 and quantify which liquidity fields are source-ready versus capture-only. No historical reconstruction.

## B-229 — full historical gate-overlap persistence remains unavailable; Liquidity fields split into source-ready vs capture-only (2026-09-27 Asia/Taipei)
- Continued B-228 exact-next and reused `research/formal_gate_evidence_persistence_feasibility_v0_1.json` rather than redesigning persistence. Its current verdict remains authoritative: semantic/gate/replay computation is validated Class A with zero market calls/D1 writes, while immutable same-generation full-population persistence is still Class B proposal-first.
- Legacy `trade_research_shadow_candidates` is not a promotion-grade full-population parent: same-date mutable rewrite, single cohort identity, bounded samples and no immutable decision-generation/fingerprint. Historical gate-overlap scarcity rates therefore remain UNKNOWN where full same-scan states were not captured; no backfill/re-score from current code.
- Fresh PR #121 audit at head `5c0842d197999eefa82f2a0b0069679a5f6ea070` confirms a useful field-quality split. `avgVolume20Lots` and `avgAmount20` are deterministically derived by current `buildMarketFeatures` from admitted history; `minLots` is deterministic from the price tier; institutionalScore is derived from already-loaded institutional features when present.
- In contrast, exact Formal exception fields `spreadPercent`, `orderBookDepthGood`, `depthScore` still have no proven repository-side producer. Generic external enrichment can inject them, so correct state is `CAPTURE_ONLY_IF_PRESENT / EXTERNAL_INJECTION_FEASIBLE / PRODUCTION_COVERAGE_UNKNOWN`, not dead and not proven live.
- PR #121's Class-A prototype computes exact reject-reason counts over `CURRENT_FEATURE_ROWS`, deterministic max-6 samples per exact reason x GENERAL/THOUSAND, exception-input COMPLETE/PARTIAL/ABSENT coverage, below-min missing-reason counts, exception-pass counts and per-row liquidity audit. Early rejects are explicitly `fullFormalCounterfactual=false`.
- Denominator scope guard: `CURRENT_FEATURE_ROWS` is after upstream history/data admission, not the whole exchange universe. Its exact counts must not be interpreted as exchange-wide liquidity-gate prevalence.
- PR #121 remains Draft/not deployed, so these are design/test capabilities rather than live prospective observations. The branch also sits on an older main lineage and must be reconciled before any future implementation/deploy decision; no rebase/deploy was performed here.
- Durable artifact: `research/liquidity_admission_field_readiness_v0_1.json`, commit `7b6f9e62a940a54f9ddf603d38245696a93342f7`.
- Status: `GATE_OVERLAP_FULL_HISTORY_NOT_RECONSTRUCTABLE / LIQ_HISTORY_DERIVED_FIELDS_SOURCE_READY / SPREAD_DEPTH_PRODUCTION_COVERAGE_UNKNOWN / PR121_DESIGN_ONLY / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: use PR #121's frozen denominator/missingness semantics to define the first prospective liquidity coverage acceptance gate before any return outcome joins. Specify which scan dates are CLEAN versus UNKNOWN based on parent feature-universe completeness, history freshness, exact reason counts, spread/depth presence accounting and sample fractions. Then audit whether `LIQ_LOW_VOLUME_EXCEPTION_PASS` is actually represented by the prototype denominator even though it is not a dedicated sampled cohort. Do not inspect D1+ outcomes yet.

## B-230 — prospective Liquidity parent-coverage gate frozen; exception-pass positive-control sample gap confirmed (2026-09-27 Asia/Taipei)
- Continued B-229 exact-next without outcome inspection. A CLEAN/UNKNOWN acceptance contract is now frozen before any future D1/D3/D5/D10/D20/MFE/MAE join.
- CLEAN requires a positively completed same-generation parent scan, reconciled CURRENT_FEATURE_ROWS denominator, active history/source-admission completeness, explicit exact-reason x pool population cells, exception-pass counts, below-min coverage reconciliation, deterministic sample fractions and spread/depth presence accounting. Infrastructure/recovery/generation ambiguity blocks the date as UNKNOWN.
- Important schema gap in PR #121: `populationCounts` is lazily created only when a reject reason occurs. A missing preregistered reason key is therefore not yet a promotion-grade explicit zero. Future receipt must either emit all reason x pool zero cells or version an unambiguous omission-as-zero rule.
- Frozen spec mismatch confirmed: `research/liquidity_gate_rejected_control_spec_v0_1.json` defines `LIQ_LOW_VOLUME_EXCEPTION_PASS` as a descriptive positive control, but PR #121 only records aggregate `exceptionPassCounts`. Its sampled `exactReasons` array contains only the three rejected cohorts; no dedicated per-symbol exception-pass sample exists.
- Do not repair this by blindly adding exception-pass rows to legacy Shadow. Legacy rows are mutually exclusive through `used`; such a patch could steal Formal/QNS membership or condition the positive control on whether another bounded sample already used the symbol, recreating the quota-conditioned control bias.
- Safe design if a positive control is needed: independently sample the frozen below-min + exception-pass frame with overlapping membership/sidecar semantics. Pure computation is Class A; durable shared overlapping persistence remains Class B proposal-first.
- `exceptionInputCoverage=COMPLETE` only means the fields were present; it does not prove the spread/depth source is PIT-valid, source-authentic or economically executable. Coverage quality and execution value remain separate.
- Durable artifact: `research/liquidity_prospective_coverage_acceptance_v0_1.json`, commit `83bb54720407f37832900ab095d34d88f31b8146`.
- Status: `LIQUIDITY_PARENT_ACCEPTANCE_FROZEN / EXCEPTION_PASS_CONTROL_SAMPLE_GAP_CONFIRMED / ZERO_CELL_SCHEMA_GAP_CONFIRMED / OUTCOMES_CLOSED / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: determine whether PR #121 can be strengthened in isolated Class-A research space without touching legacy mutually-exclusive Shadow membership: build a pure independent `LIQ_LOW_VOLUME_EXCEPTION_PASS` sampler and explicit zero-filled reason matrix as a standalone helper/test fixture. If validated, keep it research-only and do not wire/deploy. Then continue to the next admission-scarcity evidence hole, `EXTREME_MOVE_PROXY_REJECTED`, using the same denominator/coverage discipline.

## B-231 — EXTREME_MOVE_PROXY formal-reach denominator and official-state coverage gate frozen (2026-09-27 Asia/Taipei)
- Continued B-230 exact-next into the highest-priority remaining admission evidence hole without outcomes. Existing B-192 structural falsification remains authoritative: Formal `abs(changePercent||0)>=9.8` is an EXTREME_DAILY_RETURN_PROXY, not official exchange limit state; fixed legal counterexamples prove both false-positive and false-negative classification versus exact limit prices.
- New denominator contract separates raw feature prevalence from sequential Formal incidence. Gate-6 Formal-reach denominator requires all earlier admission states positively clear on the same generation: price>=10, history>=60, market/sector RS observed, market cap observed and >=10bn. Earlier FAIL/UNKNOWN rows are excluded from gate-incidence denominator.
- Missing-change semantic guard is now explicit: Production's `changePercent||0` means this gate does not reject a missing changePercent, but research classifies it `RESEARCH_UNKNOWN_FORMAL_COERCED_NON_REJECT`. It must never be called an observed 0% return or a true gate PASS.
- Proxy rejection is direction-split into UP >=+9.8 and DOWN <=-9.8. Future return/path inference may never pool them simply because the absolute-value gate is symmetric.
- Official-state evidence remains a separate source layer: CLOSE_LIMIT_UP, CLOSE_LIMIT_DOWN, NON_HIT, NO_PRICE_LIMIT, NON_COMPARABLE_X, OFFICIAL_LIMIT_UNKNOWN. Exact symbol-session source receipts/keyset coverage are required before semantic false-positive/false-negative outcome analysis.
- CLEAN future date requires: same-generation complete feature parent; history/source acceptance; explicit Formal-reach and finite/missing change counts; UP/DOWN proxy reject counts; sample fraction/full count; complete official requested-keyset reconciliation; no future outcomes in parent receipt. Otherwise outcome join is blocked as UNKNOWN.
- BROAD_CONTROL remains unusable as a prevalence denominator because it is bounded/incidental. REJECTED_AFTER_BASE remains structurally blind because this is basePassed=false.
- Durable artifact: `research/extreme_move_proxy_prospective_denominator_v0_1.json`, commit `8ef6b7a1d8a9a5eb1d9464e6033767271e61e216`.
- Status: `EXTREME_GATE_REACH_DENOMINATOR_FROZEN / MISSING_FORMAL_COERCION_SEPARATED / OFFICIAL_STATE_COVERAGE_REQUIRED / OUTCOMES_CLOSED / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: audit whether the TWSE/TPEx exact official limit-state source contract already has an isolated capture helper/receipt in any research lane. If not, do not duplicate web/source integration here; freeze source dependency and move to the remaining standalone strategy-universe admission gate `marketCapYi<10bn`, testing its redundancy with liquidity/execution controls without proposing universe expansion.

## B-232 — exact official limit-state source semantics already owned elsewhere; System1 blocker is same-generation lineage, not source discovery (2026-09-27 Asia/Taipei)
- Continued B-231 exact-next and audited existing DL-001 / Corporate Actions work before creating any new source lane.
- TWSE TWT84U exact limit/reference semantics and date-queryable contract are already material-pass in `research/information_discreteness_source_frequency_receipt_v0_1.json`; TWSE T97 provides a stronger archive/product path. TPEx S38 / STKT2QUOTESN exact marker semantics are also already frozen, and the Corporate Actions lane has independently validated an isolated S38 parser/test on a draft research branch.
- Therefore scarcity research must NOT duplicate TWSE/TPEx source semantics, parser discovery or whole-market frequency research. Existing DL-001 owner remains canonical.
- The unresolved object for EXTREME_MOVE is narrower: a promotion-grade same-generation join between the System1 gate-6 parent/keyset and exact official symbol-session states with requested/returned keyset coverage, source timing/hash and UNKNOWN semantics. That prospective lineage is not currently proven.
- Existing outcome-free frequency witnesses show official limit hits are sparse on many dates but not uniformly rare; whole-market cross-sectional frequency cannot be transported to the momentum/quality-conditioned System1 candidate population.
- Historical date-queryable official data can reconcile factual state but may not be used to manufacture immutable first-known System1 decision evidence.
- Durable artifact: `research/extreme_move_official_source_dependency_v0_1.json`, commit `a1788231765ec44f76aa3b1a2591d640589dd5a8`.
- Status: `SOURCE_SEMANTICS_READY / SYSTEM1_PROSPECTIVE_LINEAGE_NOT_READY / NO_DUPLICATE_INTEGRATION / OUTCOMES_CLOSED / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: move to the remaining standalone early strategy-universe gate `marketCapYi<10bn`. Audit whether its protection is structurally distinct from the later liquidity/size-conditioned rules or substantially nested/redundant. Freeze a prospective falsification contract using market-cap distance, liquidity/execution controls and explicit universe-policy semantics; do not propose lowering the 10bn floor and do not inspect outcomes yet.

## B-233 — market-cap source classification must occur pre-merge; pure Class-A replay helper frozen (2026-09-27 Asia/Taipei)
- Continued B-232 exact-next but did not duplicate the already-complete market-cap floor falsification lane (`MARKET_CAP_ADMISSION_RESEARCH.md`, `market_cap_floor_falsification_v0_1.json`, `market_cap_source_provenance_falsification_v0_1.json`).
- Fresh Worker audit confirms source identity is irrecoverably flattened by the current shared path: `fetchEnrichment()` starts from official stocks, spreads custom extra over them, and only re-protects market classification. `mergeEnrichment()` later sees only the flattened stock.
- Official source dates are available upstream but not retained in the usable per-symbol evidence: TPEx profile rows expose `Date`; TWSE/MOPS CSV fallback validates `exportDate`; current `sourceMeta` keeps ok/rowCount/error/fallback/originalError but drops the profile date identity. Custom `normalizeEnrichmentPayload()` likewise drops payload-level meta/asOf.
- Added isolated `research/market_cap_source_classifier_v0_1.mjs` (commit `25709960fa774e0fea01040c74f87bb4750712cf`) plus adversarial fixture `tests/test_market_cap_source_classifier_v0_1.mjs` (commit `499af66d2816752530c1d3f638d78ab767e6539f`). No Worker/runtime/storage/Formal path changed.
- The classifier deliberately mirrors current raw-nullish-before-numeric semantics. Structural counterexample: custom `marketCapYi='N/A'` shadows a valid lower `marketCap100m` alias; `toNumber()` then fails and current code falls through to shares x close. Likewise comma-formatted custom shares are invalid because mergeEnrichment uses `toNumber`, not `marketNumber`.
- A custom `sharesOutstanding:null` spread-overwrite may remove the official normalized shares value; research must not silently recover it from the pre-merge official object when reproducing the actual Formal input.
- Source type and source-date/PIT certification are separated. The helper can structurally classify CUSTOM_EXPLICIT, CUSTOM_SHARES_X_CLOSE or OFFICIAL_SHARES_X_CLOSE when given separate pre-merge objects, but missing source date remains UNKNOWN.
- The test fixture exists but no automatic workflow was observed for the main commit, so status is `TEST_FIXTURE_CREATED / CI_EXECUTION_NOT_YET_OBSERVED`; it is not represented as CI-PASS.
- Durable validation artifact: `research/market_cap_source_classifier_validation_v0_1.json`, commit `5cc8969f4a971a50881e524206081296a04b7204`.
- Separate note: PR #121 research-only liquidity branch head `a60cfe9133a0614cc8b7eed16e4ad964a4b1147d` passed both V8 Regression (`36324141457`) and V8 Repair (`36324141550`). It remains Draft and currently mergeable=false against the rapidly advancing main; no rebase/merge/deploy was attempted.
- Status: `MARKET_CAP_PREMERGE_SOURCE_IDENTITY_REQUIRED / CLASS_A_CLASSIFIER_FROZEN / SOURCE_DATE_LINEAGE_UNKNOWN / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: freeze the smallest Class-B prospective capture proposal for market-cap source identity/date using already-loaded official/custom objects and zero new market calls. Do not implement it without owner approval. Then leave the blocked market-cap lane and move to the next nonblocked scarcity layer: A/B setup admission, reusing the already-falsified NEAR_MISS count-only cohort and the gate-overlap observer rather than changing setup thresholds.

## B-234 — market-cap source capture parked at proposal boundary (2026-09-27 Asia/Taipei)
- Continued B-233 only far enough to freeze the blocked engineering boundary. `MARKET_CAP_SOURCE_CAPTURE_CLASS_B_PROPOSAL.md` defines a zero-extra-call additive receipt from already-loaded pre-merge official/custom objects; commit `9691fd4e5ea2122ab07998f30bccb4029e5af567`.
- Receipt preserves the exact Formal marketCapYi input plus source type/field/id/date, share source/date, close date, override flags, raw alias/numeric conversion state, alias shadowing, source-quality/PIT state, parent scan generation and completeness counts.
- Source identity never substitutes for source-date proof. Dropped official/custom dates remain UNKNOWN; no historical reconstruction.
- Proposal requires immutable/additive generation semantics, parent/capture reconciliation, zero new network calls, exact Formal-value equality checks and no-decision-diff tests before implementation.
- Shared scan/enrichment/persistence wiring is Class B owner-approval work. No implementation, merge-precedence repair or deployment was performed. Threshold/strategy changes remain Class C.
- Status: `MARKET_CAP_SOURCE_CAPTURE_CLASS_B_PROPOSAL_READY / OWNER_APPROVAL_REQUIRED / MARKET_CAP_LANE_PARKED / FORMAL_UNCHANGED`. No FORMAL_OPTIMIZATION_CANDIDATE.
- Exact next: move immediately to A/B setup scarcity. Re-read `NEAR_MISS_COHORT_RESEARCH.md`, `research/channel_stage_denominator_spec_v0_1.json`, current setup/debug semantics and setup-specific artifacts. Do not tune thresholds; determine exact AB_SETUP Formal-reach and which distance metrics are nonredundant.


## B-235 — A/B setup scarcity geometry repaired in Class-A research; prospective persistence parked at Class-B boundary (2026-09-27 Asia/Taipei)
- Continued B-234 exact-next on Draft PR #146 without outcome lookup, threshold tuning, Formal/runtime/storage change or deployment. Latest validated research head: `c98cbccdc57c4d70795cbc3326dbebfb66f960b9`.
- PR #146 CI is green at that head: A-B Setup Margin Research `36326324235` SUCCESS; V8 Repair `36326324359` SUCCESS; V8 Regression `36326324271` SUCCESS.
- Exact sequential setup population is now fail-closed: only rows with every prior Formal gate positively clear and both A/B failing become `SETUP_FIRST_FAILURE`; raw A/B geometry from `PRE_SETUP_NOT_REACHED` cannot contaminate the setup-reject denominator; dual-pass rows preserve B precedence.
- Raw-margin observer preserves exact A/B six-bit masks, failed counts, raw threshold margins, OR/composite branches and source/truthiness warnings. No normalized composite setup distance is introduced.
- New structural falsification: under current OHLC-derived definitions, `dailyUpperShadowRatio <= 1 - dailyClosePosition`. Therefore B `strongClose: closePosition>=0.65` mathematically implies `upperShadow<=0.35`. A coherent row can never have strongClose=true and upperShadow=false; 16/64 raw B bit patterns are structurally impossible. The upper-shadow boolean adds no independent B admission constraint after strongClose, although the continuous upper-shadow value still enters B setupQuality/ranking and is not globally irrelevant.
- Existing B notLate redundancy is retained: `lateStage=(ret20>35 OR maDistance20Pct>25)` plus B `ret20<=30` makes the ret20>35 lateStage arm non-binding; effective B notLate raw axes are ret20<=30 and maDistance20Pct<=25.
- New A support provenance: `supportSources/supportMode` distinguishes normal `FILTERED_CANDIDATE` from `MA20_FALLBACK`. On the filtered path, support eligibility `support<=close*1.015` already implies `close>=support*0.98522...`, so the A structure clause `close>=support*0.985` is conditionally redundant; it can still bind on MA20 fallback. Future margin interpretation must retain support source/fallback state.
- Frozen margin taxonomy now separates simple thresholds, two-sided bands, OR-composites, conjunctions, nested candle geometry and source-conditioned constraints. Exact Formal masks remain provenance only; failed-check Hamming count is not an independent-dimensional/economic distance.
- Population-before-sample helper now counts complete `scanDate x pool x nearestChannel x exactCheckPattern` populations before deterministic bounded sampling. Semantic membership and sample membership are separate; duplicate parent keys, incomplete strata or incomplete parent frame fail quality closed to UNKNOWN. Absent cells are zero only on a positively complete CLEAN frame.
- Durable branch artifacts: `research/ab_setup_redundancy_falsification_v0_1.json`, `research/ab_setup_sampling_frame_v0_1.mjs`, `research/ab_setup_sampling_frame_spec_v0_1.json`, `research/ab_setup_margin_independence_taxonomy_v0_1.json`, plus adversarial tests and NM-009..NM-011 documentation.
- Minimum prospective A/B receipt is now frozen in `research/ab_setup_evidence_receipt_spec_v0_1.json` and `AB_SETUP_EVIDENCE_RECEIPT_CLASS_B_PROPOSAL.md`. It reuses the existing immutable decision-state/population-receipt/overlapping-membership architecture rather than creating a second Shadow model. Selection-time parent stays outcome-free; future D1/D3/D5/D10/D20/MFE/MAE joins must reference the immutable parent generation.
- Shared Worker/D1 capture remains Class B owner-approval work and was **not implemented**. Any A/B threshold/channel/precedence change remains Class C. No `FORMAL_OPTIMIZATION_CANDIDATE` exists yet.
- Branch lineage warning: PR #146 is materially diverged from fast-moving main (observed ahead 25 / behind 131 from merge base `d0e558899a016107c10c0734b28936c9cfb42df3`). Green CI proves the isolated branch artifacts, not merge/deploy readiness; no rebase/merge/deploy attempted.
- Status: `AB_SETUP_SEQUENTIAL_DENOMINATOR_READY / HAMMING_INDEPENDENCE_FALSE / POPULATION_BEFORE_SAMPLE_READY / EVIDENCE_RECEIPT_DESIGN_READY / CLASS_B_BOUNDARY_REACHED / OUTCOMES_CLOSED / FORMAL_UNCHANGED`.
- Exact next: park A/B shared persistence at the owner-approval boundary. Do not revisit already-complete B-215/B-216 signal-grade structural work or B-214 Target/RR work. Continue the next nonblocked scarcity question only after fresh artifact audit, prioritizing an unclosed gate or quota/cutline opportunity-cost layer rather than duplicating existing lanes. Preserve prospective/OOS and immutable-parent requirements before any outcome inference.


## B-236 — CHIP_CONCENTRATION_PRESENT proven as a source-readiness gate; TDCC symbol/PIT evidence split and Class-B capture parked (2026-09-27 Asia/Taipei)
- Continued B-235 into the next nonblocked scarcity layer without outcomes, threshold tuning, Formal/runtime/storage changes or deployment.
- Current Production semantics are now explicit: no TDCC quality snapshot for the scan date aborts the whole after-market scan as DATA_INCOMPLETE; when a globally validated TDCC snapshot exists, an individual symbol that reaches the chip gate but lacks numeric `chipConcentration` is rejected as `缺集保持股集中度，不補假值`. Numeric zero is an observed value and passes the presence gate. Therefore this is a DATA_READINESS gate, not a low-concentration quality threshold.
- TDCC source semantics were reconciled with current Worker: official endpoint `opendata.tdcc.com.tw/getOD.ashx?id=1-5`; `chipConcentration` is 400-lot-and-above holding share (grades 12–15), weekly ownership concentration, explicitly not institutional identity. Current validator accepts a common TDCC as-of date that is not after scanDate and no more than 14 calendar days old, with >=1500 validated symbols.
- Structural counterexample confirms global dataset readiness is not same-day symbol coverage. A globally valid 1,500-symbol snapshot can legally coexist with a larger same-day Formal market keyset; therefore `count>=1500` cannot be used as the per-symbol coverage denominator.
- Raw-ingest audit found additional provenance loss. For an individual symbol the validator may omit it from validated `stocks` when the 17-grade set is incomplete, grade-17 total ratio is not 100 within tolerance, or grade-17 total shares is nonpositive. After only validated stocks are persisted, a later missing symbol cannot distinguish `NO_SOURCE_ROWS` from these silently omitted source-group states.
- Historical PIT availability is also not proven by `chipAsOfDate<=scanDate`. The quality table is keyed by dataset+marketDate and written with UPSERT; `readQualitySnapshot()` returns only snapshot JSON, not an immutable first-known collection receipt. A historical weekly file may have an economically valid as-of date without proving it was publicly available before the original 18:10 decision cutoff. This does **not** prove live lookahead occurred; it means promotion-grade historical first-known availability is UNKNOWN where no immutable receipt exists.
- Draft PR #161 `Research: chip concentration readiness / PIT scarcity observer` freezes three pure Class-A layers: dataset/freshness/PIT classification, same-generation Formal-reach symbol coverage, and raw source-group omission classification. Branch head `abb19c6655687891144737e28c5283f0c71d70b6`.
- PR #161 CI at that head is green: Chip Concentration Readiness Research `36326968605` SUCCESS; V8 Regression `36326968602` SUCCESS; V8 Repair `36326968654` SUCCESS. Branch was observed mergeable and only one commit behind main, but remains Draft and is not deployment authorization.
- Durable branch artifacts: `research/chip_concentration_readiness_observer_v0_1.mjs`, `research/chip_concentration_readiness_falsification_v0_1.json`, `tests/test_chip_concentration_readiness_observer_v0_1.mjs`, `CHIP_CONCENTRATION_READINESS_RESEARCH.md`.
- `CHIP_CONCENTRATION_CAPTURE_CLASS_B_PROPOSAL.md` freezes the smallest additive prospective repair: immutable server-side firstKnownAt/collectedAt, source/asOf/hash, raw and validated symbol counts, dropped-group reason counts, same-generation market-keyset reconciliation, pool/reach denominators and parent generation/fingerprint. It adds zero source calls and does not change validation/freshness/gate/score/selection.
- Shared quality-ingest/D1 persistence remains Class B owner-approval work and was **not implemented**. Any change making TDCC optional, changing the 14-day operational window, changing missing-data rejection or changing institutional-score weight remains Class C.
- Status: `CHIP_GATE_IS_DATA_READINESS_GATE / GLOBAL_READY_NE_SYMBOL_COMPLETE / RAW_OMISSION_REASON_LOST_AFTER_VALIDATION / HISTORICAL_PIT_AVAILABILITY_UNKNOWN / PROSPECTIVE_CAPTURE_PROPOSAL_READY / OUTCOMES_CLOSED / FORMAL_UNCHANGED`. No `FORMAL_OPTIMIZATION_CANDIDATE`.
- Exact next: park shared TDCC capture at the Class-B owner-approval boundary. Move immediately to `FINANCIAL_SOURCE_COMPLETENESS`, but first fresh-audit existing fundamental/source artifacts to avoid duplicating the completed fundamental-score lane. Determine which bundled subconditions are scan-global versus symbol-specific, whether successful scan-level dataset readiness can still leave per-symbol financial/valuation gaps, and which subconditions are structurally redundant under the canonical runtime path. Outcomes remain closed.


## B-237 — Formal gate-overlap observer v0.1 semantic falsification; v0.2 corrective observer validated (2026-09-27 Asia/Taipei)
- While entering FINANCIAL_SOURCE_COMPLETENESS from B-236, the shared Class-A `formal_gate_overlap_observer_v0_1` was itself falsified before any new scarcity counts were trusted.
- Defect 1 — numeric null coercion: v0.1 `finite(value)` called `Number(value)` directly. In JavaScript `Number(null)=0` and `Number("")=0`, violating the observer spec that missing evidence must remain UNKNOWN. This could convert missing close/history/market-cap/ATR/fundamental-count/RR/setup-quality to false observed zeros, and could even make explicit-null `chipConcentration` PASS the presence observer or make missing RS/change fields appear as observed zero.
- Defect 2 — financialBasis type mismatch: current Formal uses JavaScript truthiness `!f.financialBasis`, while `deriveQuarterlyFinancials()` produces a non-empty descriptive string. v0.1 used a literal-boolean parser and therefore could mark canonical valid financial rows UNKNOWN.
- Defect 3 — announcement empty-set mismatch: after a validated announcement snapshot, current scan assigns `announcementsVerified=true` globally. Symbols with no matching announcements commonly have no per-symbol `officialAnnouncements` array; Formal uses `(f.officialAnnouncements || [])` and treats this as a verified empty set. v0.1 instead required an array and could label these rows ANNOUNCEMENT_RISK UNKNOWN.
- Draft PR #163 freezes `research/formal_gate_overlap_observer_v0_2.mjs` without rewriting v0.1 history. V0.2: null/undefined/empty numeric evidence => UNKNOWN before numeric conversion; explicit zero stays zero; non-empty financialBasis follows Formal truthiness; verified source + missing announcement array follows Formal empty-list semantics.
- Durable artifacts on PR #163: `research/formal_gate_overlap_observer_v0_1_falsification.json`, `research/formal_gate_overlap_observer_spec_v0_2.json`, `tests/test_formal_gate_overlap_observer_v0_2.mjs`.
- PR #163 head `daa59e1b64ece95e700024d9c23ca6aaa99f1516`; CI green: Formal Gate Overlap Observer V0.2 Research `36327315940` SUCCESS; V8 Regression `36327316093` SUCCESS; V8 Repair `36327315990` SUCCESS. PR remains Draft; no merge/deploy.
- Evidence consequence: methodology documents that merely define PASS/FAIL/UNKNOWN/NOT_EVALUABLE remain conceptually usable, but any empirical overlap/scarcity count derived from v0.1 on null-bearing/canonical financial-announcement rows is `OBSERVER_VERSION_GUARDED` until recomputed under v0.2 or equivalent corrected semantics. Historical raw receipts must not be mutated to fake repair.
- Status: `V0_1_SEMANTIC_BUG_CONFIRMED / V0_2_REQUIRED_FOR_FUTURE_SCARCITY_COUNTS / RESEARCH_EVIDENCE_CORRECTION_ONLY / FORMAL_UNCHANGED`. No outcomes and no `FORMAL_OPTIMIZATION_CANDIDATE`.
- Exact next: resume FINANCIAL_SOURCE_COMPLETENESS using v0.2 semantics. Separate scan-level dataset readiness from same-generation per-symbol financial/valuation coverage. Test the structural dependence of the four quarterly-financial checks, the two valuation checks, and the announcement verification clause under the canonical current producer/merge path before creating any outcome sample.


## B-238 — FINANCIAL_SOURCE_COMPLETENESS collapses to two per-symbol source bundles plus one scan-global announcement state (2026-09-27 Asia/Taipei)
- Continued B-237 exact-next without outcomes, threshold tuning, runtime/storage changes or deployment. Fresh audit reused the corrected strict-null semantics from PR #163.
- The seven textual Formal subconditions are not seven independent scarcity dimensions on the canonical producer path.
- Current `deriveQuarterlyFinancials()` emits a symbol only when latest, previous and same-quarter-last-year single-quarter revenue reconstructions all exist; `subtractQuarter()` itself requires reconstructed quarter revenue >0, and `growth()` requires a positive comparison base. Every emitted canonical FINANCIAL row therefore jointly carries positive `quarterRevenue`, truthy descriptive `financialBasis`, numeric `revenueQoQ` and numeric `revenueQuarterYoY`.
- Current VALUATION validation rejects rows with missing/negative PB; every emitted canonical valuation row jointly carries `valuationObserved=true` and numeric `priceBookRatio`.
- ANNOUNCEMENTS behaves differently: once its validated snapshot exists, `announcementsVerified=announcements.sourcesVerified===true` is assigned to every market row. A symbol with no event array is a verified empty set under Formal `(officialAnnouncements || [])` semantics.
- Whole FINANCIAL / VALUATION / ANNOUNCEMENTS snapshot absence aborts the scan as DATA_INCOMPLETE and must not be mixed with stock-level source-completeness rejects. Conversely, globally ready snapshots can still have different per-symbol FINANCIAL/VALUATION membership.
- Existing parallel research was detected before duplication: Draft PR #165 `Research: financial source completeness scarcity observer` already froze the canonical producer-bundle semantics and a pure same-generation pre-gate-reach observer.
- PR #165 head after this lane's continuation is `5e660972f17265cee168756de6108ca0a85d8461`; CI at that head is green: Financial Source Completeness Research `36329055903` SUCCESS, V8 Regression `36329056096` SUCCESS, V8 Repair `36329056019` SUCCESS.
- Status: `SEVEN_CHECKS_COLLAPSE_TO_TWO_PER_SYMBOL_SOURCE_BUNDLES_PLUS_ONE_SCAN_GLOBAL_ANNOUNCEMENT_STATE / GLOBAL_READY_NE_SYMBOL_COMPLETE / OUTCOMES_CLOSED / FORMAL_UNCHANGED`. No `FORMAL_OPTIMIZATION_CANDIDATE`.
- Exact next: distinguish canonical source membership from the actual merged fields seen by Formal, because pre-quality enrichment can already carry same-named fields. Do not treat official-source missingness as a direct estimate of Formal reject incidence.

## B-239 — canonical source membership != Formal merged-field completeness; dual-state prospective receipt frozen (2026-09-27 Asia/Taipei)
- Continued B-238 on PR #165 and audited the complete enrichment/quality overlay order.
- `normalizeEnrichmentPayload()` preserves custom per-stock fields, `fetchEnrichment()` / `mergeEnrichment()` can place arbitrary extra fields onto the row, and later FINANCIAL/VALUATION overlays only overwrite when `stocks[symbol]` exists. A missing official symbol entry does not clear pre-existing same-named fields.
- Fixed structural counterexample: canonical FINANCIAL symbol entry absent + canonical VALUATION symbol entry absent + merged pre-quality row already contains all six required financial/valuation fields + ANNOUNCEMENTS globally verified => the exact Formal seven-field completeness expression can pass.
- This proves technical representability only. It does not prove live Production prevalence, provenance quality or economic harm. The correct frozen estimands are separate: `canonicalSourceCompleteness` versus `formalMergedFieldCompleteness`.
- The reverse state is an invariant guard: under current overlay order, canonical FINANCIAL+VALUATION complete plus announcements verified should imply merged Formal field completeness. A source-complete/field-fail row indicates version/order/observer mismatch until proven otherwise.
- Added to Draft PR #165: `research/financial_source_merge_provenance_observer_v0_1.mjs`, adversarial test, `research/financial_source_merge_provenance_falsification_v0_1.json`, and `FINANCIAL_SOURCE_COMPLETENESS_CAPTURE_CLASS_B_PROPOSAL.md`; research workflow updated. Same head/CI as B-238 is green.
- Minimum prospective receipt freezes pre-quality field presence, canonical source membership, announcement global state, exact post-overlay Formal fields, alignment class, parent generation/fingerprint and immutable first-known semantics. It can reuse already-loaded objects with zero new market calls, but shared runtime/D1 wiring is Class B and was **not implemented**.
- Status: `SOURCE_MEMBERSHIP_NE_FORMAL_FIELD_COMPLETENESS / ALTERNATE_FIELD_PASS_TECHNICALLY_FEASIBLE / LIVE_PREVALENCE_UNKNOWN / PROSPECTIVE_DUAL_STATE_CAPTURE_WARRANTED / FORMAL_UNCHANGED`. No `FORMAL_OPTIMIZATION_CANDIDATE`.
- Exact next: park shared capture at the Class-B boundary and move to the next ordered nonblocked gate, ANNOUNCEMENT_RISK, without duplicating the broad Event-Risk lane.

## B-240 — ANNOUNCEMENT_RISK source-readiness and literal-title-veto falsification frozen (2026-09-27 Asia/Taipei)
- Continued B-239 into the exact current Formal announcement veto; outcomes remained closed.
- Current source path uses TWSE `t187ap04_L` and TPEx `mopsfin_t187ap04_O`. The official sync script requires HTTP success before posting the payload, but the Worker quality validator receives trusted payload arrays and validates endpoint strings/row shape rather than fetching the sources server-side.
- ANNOUNCEMENTS has no minimum event-count/per-market-count floor. Two empty arrays are structurally compatible with `sourcesVerified=true,count=0`. Zero events may be legitimate, so this is not classified as automatic source failure. The evidence gap is that the persisted snapshot does not preserve transport status, raw response hashes and raw per-market counts needed to certify a historical observed zero.
- Only announcements dated within scanDate minus 30 calendar days through scanDate are retained. The persisted per-symbol coverage text explicitly describes this as the current official重大訊息 list, not comprehensive news/history.
- The deployed veto is literal title substring matching: `/停止交易|重大損失|重整|退票|財報不實/`. Fixed adversarial examples prove representation limits before outcomes: `澄清：本公司並無重大損失` and `重整計畫執行完畢，恢復正常營運` still match, while `本公司股票自明日起停止買賣` and `財務報告涉有不實` need not match.
- These examples prove negation/resolution/synonym blindness, not that the current veto is economically harmful. No regex/window/source/Formal change is justified from structural examples alone.
- Draft PR #173 `Research: announcement risk readiness / lexical veto` was opened at head `3fe369187b381ecb9b723a52128d4a096c6d94bd` with pure observer, static/adversarial tests, durable falsification artifact, human note and `ANNOUNCEMENT_RISK_CAPTURE_CLASS_B_PROPOSAL.md`.
- Announcement Risk Readiness Research CI `36329545314` is SUCCESS at that head. V8 Regression `36329545307` and V8 Repair `36329545333` were still in progress at checkpoint time; this checkpoint does not represent them as passed.
- Prospective capture proposal requires transport times/status/hashes, raw market row counts, retained 30-day event rows, exact regex version, per-symbol parent reach and immutable generation linkage. Shared ingestion/D1 persistence is Class B and was **not implemented**.
- Status: `ANNOUNCEMENT_SOURCE_VERIFICATION_IS_SCAN_GLOBAL / VERIFIED_EMPTY_LACKS_PERSISTED_TRANSPORT_WITNESS / TITLE_REGEX_SEMANTICALLY_INCOMPLETE / HISTORICAL_PIT_NOT_CERTIFIED / CLASS_B_CAPTURE_PROPOSAL_READY / FORMAL_UNCHANGED`. No `FORMAL_OPTIMIZATION_CANDIDATE`.
- Exact next: audit `VALUATION_RELATIVE_RISK` using the already-frozen VAL-001..VAL-008 lane. Do not redo valuation theory or threshold sweep. Determine whether the exact current veto state and its high-growth exception are prospectively observable from same-generation pre-gate rows, and identify any structural denominator/producer coupling before outcomes.


## B-241 — VALUATION_RELATIVE_RISK exact semantics repaired; gate-overlap observer v0.3 validated (2026-09-27 Asia/Taipei)
- Continued B-240 exact-next without valuation theory duplication, outcome lookup, threshold tuning, runtime/storage change or deployment. Existing VAL-001..VAL-008 remains the conceptual owner.
- Fresh current-Worker audit confirms deployed veto: `priceEarningsRatio>0 && sectorMedianPe>0 && priceEarningsRatio/sectorMedianPe>2.5 && !(revenueQuarterYoY>25 || epsYoY>25)`.
- Structural observer bug found in Draft PR #163 v0.2: for high relative PE with `revenueQuarterYoY<=25` and `epsYoY=null`, v0.2 returned UNKNOWN. Current JavaScript Formal evaluates `null>25` as false, so missing EPS YoY does **not** make the deployed decision unknown; the row is rejected unless revenue growth itself exceeds 25.
- Research semantics are now explicitly two-layered: exact Formal decision result versus evidence-quality state. A high-PE rejection with missing EPS growth evidence is `FAIL_FORMAL_WITH_EPS_EXCEPTION_UNOBSERVED`, not UNKNOWN. Missing `revenueQuarterYoY` remains UNKNOWN/invariant violation because the earlier FINANCIAL_SOURCE_COMPLETENESS gate should block Formal reach.
- Current `sectorMedianPe` is an **inclusive** median of all positive-PE `featureRows` in the candidate's industry; the candidate's own PE participates whenever positive. The minimum length>=3 is positive-PE constituent count, not three other peers.
- Fixed self-inclusion counterexample: PEs [10,40,100], candidate PE 100. Deployed inclusive median=40 => ratio exactly 2.5 => no veto because comparison is strict >2.5. Leave-one-out median=25 => ratio 4.0 => veto. This proves estimand sensitivity, not that leave-one-out is preferable.
- Draft PR #112 is retained as historical research but is not current semantic truth: it sits on an old main lineage, recomputes a median from an older sector object and uses an old rejection-reason string. No merge/deploy was attempted.
- Draft PR #181 `Research: valuation exact semantics / gate observer v0.3` freezes `research/valuation_relative_risk_observer_v0_1.mjs`, `research/formal_gate_overlap_observer_v0_3.mjs`, adversarial tests, falsification artifact and `VALUATION_RELATIVE_RISK_CAPTURE_CLASS_B_PROPOSAL.md`. Head `f43604e1964f8739b27c2c7908c24cc6b8f10f59`.
- PR #181 CI is green: Valuation Relative Risk Semantics Research `36331206761` SUCCESS; V8 Regression `36331206756` SUCCESS; V8 Repair `36331206859` SUCCESS.
- Separate completion note: PR #173 announcement-risk branch is now fully green at head `3fe369187b381ecb9b723a52128d4a096c6d94bd`: Announcement Risk `36329545314`, V8 Regression `36329545307`, V8 Repair `36329545333` all SUCCESS.
- Status: `FORMAL_VETO_SEMANTICS_REPAIRED_FOR_RESEARCH / MISSING_EPS_IS_FAIL_EVIDENCE_CAVEAT_NOT_UNKNOWN / SECTOR_MEDIAN_IS_INCLUSIVE_SELF / V0_3_REQUIRED_FOR_FUTURE_VALUATION_COUNTS / CLASS_B_CAPTURE_PROPOSAL_READY / OUTCOMES_CLOSED / FORMAL_UNCHANGED`. No `FORMAL_OPTIMIZATION_CANDIDATE`.
- Exact next: park valuation persistence at Class-B boundary and audit SECTOR_GATE exact producer/denominator semantics. Reuse Market Breadth/Rotation theory; do not threshold-sweep.

## B-242 — SECTOR_GATE uses mixed denominators and inclusive candidate contribution; exact Class-A observer validated (2026-09-27 Asia/Taipei)
- Continued B-241 exact-next against current `buildTodaySectorStats(todayRows, featureRows)`; no outcomes or Formal changes.
- The three deployed inputs do not share one denominator:
  - `breadth`: all industry `todayRows`; `(changePercent||0)>0` means missing/nonfinite change remains in denominator as a non-advance.
  - `avgChange`: only finite changePercent rows.
  - `amountVs20DayAverage`: only rows whose matched feature has `historyDays>=20`.
- Fixed missingness counterexample: [+1%, -1%, missing, missing] => deployed breadth 25% while observed-only breadth is 50%; deployed avgChange is 0% from the two finite rows. Missingness therefore affects breadth and avgChange asymmetrically.
- Activity membership is weaker than baseline-value readiness: a `historyDays>=20` row with missing `avgAmount20` contributes zero to the summed baseline but can still contribute current `tradeValue` to coveredAmount, mechanically lifting the activity ratio. This is a denominator/provenance risk, not evidence that such rows are frequent in Production.
- Candidate self-inclusion is confirmed. Unlike `sectorReturn20`, which explicitly subtracts the candidate's own return from peer average, `buildTodaySectorStats` computes one inclusive industry state reused for every candidate. Fixed example candidate +4%, peers +0.1%/-2%/-2%: inclusive breadth 50% and avgChange 0.025% pass; leave-one-out breadth 33.3% and avgChange -1.3% fail.
- Leave-one-out is research-only diagnostic, not deployed truth. No self-exclusion change is implied.
- PR #111 preserves final sector gate values and a bounded reject cohort but not the three denominator counts, change missingness composition, activity-baseline missingness or candidate contribution. It is insufficient for promotion-grade opportunity-cost inference by itself.
- Draft PR #183 `Research: sector gate denominator / self-inclusion semantics` freezes pure observer, adversarial tests, durable artifact and `SECTOR_GATE_DENOMINATOR_CAPTURE_CLASS_B_PROPOSAL.md`. Head `e911c2f10cc6143a6f9e19b0db5cc93aee575115`.
- PR #183 CI is green: Sector Gate Denominator Semantics Research `36331395505` SUCCESS; V8 Regression `36331395501` SUCCESS; V8 Repair `36331395493` SUCCESS.
- Status: `SECTOR_GATE_MIXED_DENOMINATORS_CONFIRMED / CANDIDATE_SELF_INCLUSION_CONFIRMED / ACTIVITY_BASELINE_MEMBERSHIP_WEAKER_THAN_VALUE_READINESS / CLASS_B_CAPTURE_PROPOSAL_READY / OUTCOMES_CLOSED / FORMAL_UNCHANGED`. No `FORMAL_OPTIMIZATION_CANDIDATE`.
- Exact next: move to FUNDAMENTAL_COMPONENT_COUNT / FUNDAMENTAL_QUALITY, reusing the completed fundamental-score structural lane. Determine whether the >=3 component gate is genuinely binding on the canonical official quarterly-financial producer or primarily a partial/alternate-data integrity fallback. Do not redo fundamental event/surprise theory and do not inspect outcomes.


## B-243 — FUNDAMENTAL_COMPONENT_COUNT is canonically redundant as a scarcity gate but remains a partial/alternate-data integrity fallback (2026-09-27 Asia/Taipei)
- Continued B-242 exact-next and reused the completed Fundamental Information Dynamics score audit rather than reopening fundamental/surprise theory. No outcomes, threshold tuning, runtime/storage changes or deployment.
- `financialDataCount()` and `fundamentalScore()` consume the same nine availability slots: revenueYoY; revenueMoM??revenueQoQ; revenueYTDYoY; eps; grossMargin; operatingMargin; epsYoY; grossMarginYoY; operatingMarginYoY. Therefore the >=3 gate is an availability prerequisite for the score, not an independent economic-quality dimension.
- Current canonical MOPS parser admits a company-period row only with positive revenue and numeric EPS/gross/operating values. `deriveQuarterlyFinancials()` then requires reconstructable latest, previous and same-quarter-last-year quarters, each with positive revenue.
- An intact canonical quarterly FINANCIAL row therefore supplies at least six countable slots by itself: revenueQoQ, eps, grossMargin, operatingMargin, grossMarginYoY and operatingMarginYoY. On the canonical official producer path, `fundamentalCount<3` is structurally unreachable.
- The gate is not globally useless. The earlier FINANCIAL_SOURCE_COMPLETENESS bundle checks a different field set, so a permissive alternate/custom/legacy merged row can satisfy that earlier gate while carrying fewer than three of the nine score slots. The >=3 gate is therefore best classified as a secondary data-integrity fallback outside canonical producer shape.
- Additional alias falsification: `revenueMoM ?? revenueQoQ` is chosen before numeric conversion. A non-null invalid `revenueMoM='N/A'` shadows a valid numeric revenueQoQ and removes that slot; null MoM correctly falls back to QoQ. This is a provenance/invariant state, not ordinary weak fundamentals.
- FUNDAMENTAL_QUALITY remains coverage-confounded: score<25 is evaluable only after count>=3, and the non-normalized score scale depends on which of the nine slots are available. Future quality-gate inference must preserve the exact 9-bit availability signature.
- Draft PR #184 `Research: fundamental component-count / quality semantics` freezes pure observer, adversarial tests, durable artifact and `FUNDAMENTAL_COMPONENT_AVAILABILITY_CAPTURE_CLASS_B_PROPOSAL.md`. Head `90c6152c9419fdafbc77f729cfd04fe4fb4c8c21`.
- PR #184 CI is green: Fundamental Component Count Semantics Research `36331699524` SUCCESS; V8 Regression `36331699649` SUCCESS; V8 Repair `36331699555` SUCCESS.
- Status: `COUNT_AND_SCORE_SHARE_SAME_SLOTS / CANONICAL_QUARTERLY_COUNT_FLOOR_SIX / COUNT_LT3_CANONICALLY_UNREACHABLE / PARTIAL_ALTERNATE_ROWS_REMAIN_PROTECTED / QUALITY_SCORE_COVERAGE_CONFOUNDED / CLASS_B_CAPTURE_PROPOSAL_READY / OUTCOMES_CLOSED / FORMAL_UNCHANGED`. No `FORMAL_OPTIMIZATION_CANDIDATE`.
- Exact next: audit ATR_QUALITY exact producer/source semantics and ATR->stop->RR coupling. Reuse existing Technical Indicator / Volatility research; do not create a competing volatility theory lane.
