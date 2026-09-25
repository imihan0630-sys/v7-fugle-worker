# Research Checkpoint

Checkpoint sequence: B-128.
Updated: 2026-09-25 08:55 Asia/Taipei.

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

## Exact next continuation point
1. Treat 2026-09-24 as a completed Formal date with 2 selections, not prerequisite-failed/UNKNOWN and not a zero-pick date.
2. Restore funnel priority on the recovered selected names: verify execution-recorder target-date coverage and 500-row non-truncation before interpreting BUY/NO-BUY outcomes.
3. Preserve same-date `HUMAN_MOMENTUM_SHADOW` as research-only on Formal SELECTED names; no look-ahead or post-hoc promotion.
4. Continue R03/R06 only with new independent completed dates. Zero-pick denominator remains exactly 2 dates (9/22, 9/23); 9/24 does not extend it.
5. For future historical recovery, use staged persistence -> delivery/readback with idempotency; do not reintroduce a single long HTTP transaction.
6. Keep phone receipt separate from server acceptance. Do not mark phone delivery verified until an independent device/user receipt signal exists.
7. If a new durable prospective Top5 day row exists, continue frequency work with valid set count, `未分類` rate and malformed/UNKNOWN count; no repair/re-sort/de-dup/tie inference.
8. Keep `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` unless genuinely new row-level provenance evidence appears.
9. Preserve B-104 Class B row-level observability proposal only; no implementation/merge/deploy without approval.
10. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.
