# Research Checkpoint

Checkpoint sequence: B-161.
Updated: 2026-09-26 12:49 Asia/Taipei.

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
