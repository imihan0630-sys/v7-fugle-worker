# Research Checkpoint

Checkpoint sequence: B-135.
Updated: 2026-09-25 16:58 Asia/Taipei.

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
