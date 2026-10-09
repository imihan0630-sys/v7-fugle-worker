# System 2 Checkpoint

Updated: 2026-09-28 Asia/Taipei
Status: MVP_AND_SHADOW_P0_IMPLEMENTATION_IN_PROGRESS

## Completed

- System 2 mission defined.
- Shared knowledge governance defined.
- Shared research master map defined.
- System 1 <-> System 2 bridge defined.
- Initial architecture, factor inventory, strategy catalog and performance spec defined.
- V8 Formal Core remains untouched.
- System 1 centralized Shared Knowledge read routing is active on main.
- Initial System 2 data-source feasibility matrix completed.
- Research-only storage schema designed with isolated `s2_` namespace.
- First three Shadow strategy hypotheses preregistered before outcome tuning.
- ChatGPT Project created, instructions saved, and this design chat moved into the new Project; migration status recorded in `system2/CHATGPT_PROJECT_MIGRATION.md`.

## Current design decisions

- First Sample Operational Preflight（首筆樣本作業前檢查）V0.1 merged to main in commit `ef153982003d36840e2074f3ad2d7b2308de2590` via PR #220. A separate read-only GitHub Actions preflight now runs at 12:45 Asia/Taipei on weekdays, 40 minutes before the 13:25 prospective Decision Clock collector.

- The preflight checks the official TWSE trading-day gate, reruns Collector Freeze Guard V0.1, reruns the prospective collector schedule-contract guard, and queries GitHub Actions metadata with built-in `github.token` / `actions: read` to require the exact collector workflow path/name with `state=active`.

- The preflight produces only a 30-day operational receipt. It creates no A1/A5/B2 evidence, no daily Decision Clock bundle, and cannot increment any prospective readiness counter. Exact Decision Clock authorization, Worker Cron authorization and capture remain false.

- System2 Research CI now also triggers when `.github/workflows/system2-first-sample-preflight-readonly.yml` changes, so the preflight itself cannot be silently edited without the System2 test suite.

- PR #220 initially exposed a static-guard self-reference issue in the new workflow guard; it was diagnosed and corrected without weakening isolation semantics. Final-head System2 Research CI `36380708647` PASS and V8 Regression `36380708682` PASS. Post-merge System2 Research CI `36380783676` PASS and V8 Regression `36380783651` PASS.

- Prospective promotion-grade trading-date count remains 0. The first ordinary eligible prospective trading date remains 2026-09-29. The collector contract and frozen baseline remain unchanged by this preflight work.


- Finalized-Date Acceptance（最終化日期驗收）V0.1 received a pre-first-sample semantic correction in main commit `21a0be5f83145bb6cf8d701d5230e3f1c4d03792` via PR #219. A coverage-qualified scheduled artifact is now correctly treated as an immutable independent observed date even when required evidence is incomplete; complete-date and precision-date membership are tracked separately.

- The acceptance receipt now exposes three distinct counters: `countsTowardIndependentDate`, `countsTowardCompleteTradingDate`, and `countsTowardPrecisionEligibleDate`. This matches Decision Clock readiness V0.2 semantics (`independentTradingDates`, `completeTradingDates`, `precisionEligibleDates`) and prevents the next-day acceptance audit from falsely throwing on a legitimate incomplete first sample.

- `A5_NOT_AVAILABLE_BY_CANDIDATE` is now only assigned when same-session A1/B2 readiness is already satisfied and A5 specifically misses the candidate boundary. Broader A1/B2 incompleteness remains `INCOMPLETE_REQUIRED_EVIDENCE`. An incomplete or A5-blocked coverage-qualified date remains in the immutable independent observed-date set but does not count as complete or precision-eligible.

- Acceptance also explicitly honors the finalized coverage window before classifying a date; dates outside the finalized window remain `NOT_IN_FINALIZED_WINDOW` even if diagnostic rows are present.

- PR #219 pre-merge verification PASS: System2 Research CI `36380202348`; V8 Regression `36380202350`. Post-merge System2 Research CI `36380280224` PASS and V8 Regression `36380280225` PASS. No Decision Clock collector-contract file was changed, so Collector Freeze Guard V0.1 baseline remains intact.

- Prospective promotion-grade trading-date count remains 0. The correction was completed before the first eligible 2026-09-29 prospective sample, with no historical evidence substitution and no outcome data used. Exact Decision Clock, System2 Worker Cron authorization and capture remain false.


- First Prospective Decision Clock Day Drill（首個前瞻交易日整合演練）V0.1 merged to main in commit `a639981d1621f61bab8a6e2a894aa0c67bf2f8c7` via PR #212. Synthetic 2026-09-29 timestamps exercise A1 TWSE/TPEx, B2, A5 candidate-boundary, daily evidence V0.2.1, V0.3 provenance bundle, coverage-qualified aggregation, owner-review packet and finalized-date acceptance as one chain. Both `COMPLETE_PRECISE` and first-observation-already-READY => `COMPLETE_IMPRECISE` paths are covered. Synthetic drill evidence never increments prospective readiness counters.

- PR #212 was rebased onto the latest concurrent main with no overlapping files and reverified. Final-head System2 Research CI `36361673385` PASS and V8 Regression `36361673378` PASS. Post-merge System2 Research CI `36361735838` PASS.

- Decision Clock Collector Freeze Guard（擷取器凍結防護）V0.1 merged to main in commit `ec171d94f5b05e281b9b5598dc51e21adfee369b` via PR #218 before the first prospective sample. A machine-readable baseline now freezes Git blob hashes for exactly the same 13 files in `DECISION_CLOCK_COLLECTOR_CONTRACT_FILES_V0_3`.

- The freeze-guard test requires the manifest path set to equal the collector-contract path set exactly, then verifies every current collector file with `git hash-object`. Silent collector drift therefore fails System2 Research CI. The existing V0.3 SHA-256 collector fingerprint remains the artifact-level provenance mechanism; the Git-blob guard is an independent repository immutability layer.

- System2 Research CI path triggers now explicitly include `.github/workflows/system2-prospective-clock-evidence-readonly.yml` on both push and pull request. A collector-workflow-only edit can no longer bypass the freeze test simply because the workflow file lives outside `system2/**`.

- PR #218 pre-merge verification PASS: System2 Research CI `36379496896`; V8 Regression `36379496886`. Post-merge verification PASS: System2 Research CI `36379561026`; V8 Regression `36379561006`. No collector runtime semantics, strategy logic, D1, Worker, Worker Cron, capture, or System1/V8 Formal Core were changed.

- Prospective Decision Clock promotion-grade trading-date count remains 0. The first ordinary eligible prospective trading date remains 2026-09-29. Collector contents are now mechanically frozen against accidental drift before that first sample; after evidence begins, a material collector change requires a separately preregistered evidence epoch/contract version rather than silent hash refresh.


- Finalized-Date Acceptance（最終化日期驗收）V0.1 merged to main in commit `6221eb9fddf5f57c356925a73284eae4b8a55d30` via PR #211. The read-only readiness workflow now emits a separate acceptance receipt for the latest finalized market date and classifies it as `COMPLETE_PRECISE`, `COMPLETE_IMPRECISE`, `COVERAGE_REJECTED`, `PROMOTION_ARTIFACT_MISSING`, `COVERAGE_ANCHOR_RUN_MISMATCH`, `NON_ATTEMPT_ONE_SELECTED`, `INCOMPLETE_REQUIRED_EVIDENCE`, `A5_NOT_AVAILABLE_BY_CANDIDATE`, `NON_TRADING_DAY_SKIP`, or `NOT_IN_FINALIZED_WINDOW`.

- The acceptance audit independently recomputes whether the finalized date counts toward the independent-date sample and precision-eligible sample, then cross-checks that result against `aggregation.promotionGradeMarketDates`. Any disagreement is a hard audit failure rather than a soft warning.

- PIT（Point-in-Time，時點）semantics are explicit in the acceptance receipt: first observed READY is an upper bound, not official publication time; capture time is not relabeled as `available_at`; same-day date-only availability cannot prove a cutoff; historical substitution remains forbidden.

- The readiness workflow uploads a separate 90-day artifact named `system2-decision-clock-finalized-date-audit-<run_id>` and shows the latest finalized date, acceptance state, independent-date eligibility and precision-date eligibility in the GitHub Actions summary.

- PR #211 was rebased onto the latest concurrent main with no overlapping files and reverified. Final-head System2 Research CI `36361181708` PASS and V8 Regression `36361181622` PASS. Post-merge System2 Research CI `36361268681` PASS with 58 System2 test files, 26-table SQLite schema validation and production-isolation guard; V8 Regression `36361268667` PASS.

- Prospective Decision Clock promotion-grade trading-date count remains 0. The first ordinary eligible prospective trading date remains 2026-09-29. The next evidence action is genuine same-day collection on that official session, followed by next-calendar-day finalization and acceptance audit. Exact Decision Clock authorization, System2 Worker Cron authorization and capture remain false.


- Decision Clock（決策時間點）Promotion Qualification（升級資格）V0.1 merged to main in commit `e638f4d84f446ae4b9874ac506732e4cf574449d` via PR #210. Promotion-grade readiness now counts only coverage-qualified attempt-one artifacts whose run ID exactly matches the successful immutable coverage anchor. Later valid-looking artifacts from a failed-anchor date remain diagnostics and cannot inflate `independentTradingDates` or the 10/20-date gates.

- Promotion accounting now exposes `coverageExcludedScheduledArtifacts` and hard-fails an eligible coverage row without a matching selected anchor artifact as `COVERAGE_ARTIFACT_PROVENANCE_MISMATCH`. Collector-contract consistency and A5 boundary checks are computed over the same coverage-qualified sample. PR #210 final-head System2 Research CI `36360795678` PASS; V8 Regression `36360795594` PASS; post-merge System2 Research CI `36360847936` PASS and V8 Regression `36360847932` PASS.

- Finalized-Date Acceptance（最終化日期驗收）V0.1 merged to main in commit `6221eb9fddf5f57c356925a73284eae4b8a55d30` via PR #211. The read-only readiness workflow now produces a separate per-finalized-date acceptance receipt with explicit states including `COMPLETE_PRECISE`, `COMPLETE_IMPRECISE`, `COVERAGE_REJECTED`, `PROMOTION_ARTIFACT_MISSING`, `COVERAGE_ANCHOR_RUN_MISMATCH`, `INCOMPLETE_REQUIRED_EVIDENCE`, `A5_NOT_AVAILABLE_BY_CANDIDATE`, `NON_TRADING_DAY_SKIP`, and `NOT_IN_FINALIZED_WINDOW`.

- The acceptance audit independently recomputes whether the latest finalized date should count toward the independent-date and precision-eligible samples, then cross-checks those results against `aggregation.promotionGradeMarketDates`; any disagreement is a hard audit error. It preserves PIT（Point-in-Time，時點）semantics: first observed READY is only an observed upper bound, not proof of official publication time; capture time is not relabeled as `available_at`; same-day date-only timing does not prove a cutoff; historical substitution remains forbidden.

- The readiness workflow publishes `system2-decision-clock-finalized-date-audit-<run_id>` as a separate 90-day GitHub artifact and surfaces the latest finalized date, acceptance state, independent-date eligibility and precision-date eligibility in the workflow summary. PR #211 final-head System2 Research CI `36361181708` PASS and V8 Regression `36361181622` PASS. Post-merge System2 Research CI `36361268681` PASS with 58 System2 test files, 26-table SQLite schema validation and production-isolation guard; V8 Regression `36361268667` PASS.

- Prospective Decision Clock promotion-grade trading-date count remains 0. The first ordinary eligible prospective trading date remains 2026-09-29. The next genuine evidence step is same-day collection on that official session followed by next-calendar-day finalization/acceptance; no historical or manual substitute is permitted. Exact Decision Clock authorization, System2 Worker Cron authorization and capture remain false.


- Decision Clock（決策時間點）Promotion Qualification（升級資格）V0.1 merged to main in commit `e638f4d84f446ae4b9874ac506732e4cf574449d` via PR #210 before the first prospective trading-date sample. Promotion-grade readiness counts are now coverage-qualified rather than merely artifact-qualified.

- A scheduled attempt-one artifact enters `promotionGradeDateCount`, `promotionGradeMarketDates` and `readiness.independentTradingDates` only when the official trading-day coverage row is promotion-eligible, the immutable anchor concluded successfully with exactly one artifact, and the selected artifact run ID exactly matches that coverage anchor. A later valid-looking scheduled artifact can no longer inflate the 10-date / 20-date gates after an earlier immutable anchor failed.

- Attempt-one artifacts excluded by coverage remain auditable as `coverageExcludedScheduledArtifacts`. An eligible coverage row without a matching selected anchor artifact fails closed as `COVERAGE_ARTIFACT_PROVENANCE_MISMATCH`, forces `promotionCoverageComplete=false`, and appears as an explicit owner-review blocker.

- Collector-contract consistency and A5 boundary-integrity checks now operate on the same coverage-qualified promotion sample, so already-excluded diagnostic artifacts cannot contaminate the active sample's collector-fingerprint set.

- PR #210 was rebased onto the latest concurrent main with no overlapping files and reverified. Final-head System2 Research CI `36360795678` PASS; V8 Regression `36360795594` PASS. Post-merge System2 Research CI `36360847936` PASS and V8 Regression `36360847932` PASS. System1/V8 Formal Core remained untouched.

- Prospective Decision Clock promotion-grade trading-date count remains 0. The first ordinary eligible date remains 2026-09-29; no historical artifact or later duplicate was used to increase the readiness counters. Exact Decision Clock, System2 Worker Cron and capture remain unauthorized/false.


- Decision Clock（決策時間點）Attempt-One Provenance（第一次執行來源證明）V0.4 merged to main in commit `9d576aaabe22e33c96f6c9e9178af333009bc61b` via PR #197. GitHub Actions reruns that share a run ID can no longer replace attempt-one metadata: only `run_attempt=1` is promotion-grade; later attempts are `RERUN_ATTEMPT_DIAGNOSTIC_ONLY` and can neither repair an attempt-one failure nor invalidate a valid attempt-one artifact.

- PR #197 pre-merge verification PASS: System2 Research CI `36352092488`; V8 Regression `36352092607`. Post-merge verification PASS: System2 Research CI `36352192438`; V8 Regression `36352192374`. System1/V8 Formal Core remained untouched.

- A1 Daily Close Integrity（A1 每日收盤完整性）V0.2 merged to main in commit `d612c46c76d414da9608cbf6b135c4773d6bab46` via PR #198. Required A1 TWSE/TPEx READY now counts unique target-date ordinary symbols with usable positive close values; duplicate target-date symbols invalidate the payload; undated rows never count toward the target date. Existing market-wide minimums remain TWSE 600 / TPEx 450.

- The scheduled prospective A1 polling loop now uses `--required-daily-only true`, so promotion-grade 5-minute polling queries only `A1_TWSE_DAILY_CLOSE` and `A1_TPEX_DAILY_CLOSE`. Optional/context A2/A3/A6 sources remain available for separate research but cannot add transport-failure surface to the required Decision Clock gate.

- PR #198 final-head verification PASS: System2 Research CI `36352504523` executed 56 System2 test files, 26-table SQLite schema and production-isolation guard; V8 Regression `36352504457` PASS. Post-merge verification PASS: System2 Research CI `36352557593`; V8 Regression `36352557626`.

- Decision Clock Coverage Finalization（覆蓋最終化）V0.3 merged to main in commit `3d1460894fc14ff05edecc2f05a6e8a809f9dd49` via PR #202. Promotion-grade coverage now finalizes with a one-calendar-day lag: by default `coverageThroughDate` is the previous Taipei calendar date. Current/future-date runs and artifacts are pending diagnostics only, cannot create finalized gaps, and cannot enter readiness early.

- The read-only readiness aggregation schedule is now 08:30 Asia/Taipei every calendar day (`cron: "30 0 * * *"`). This audits the previous date after the prospective collector window is safely over, while the official TWSE trading-calendar gate still distinguishes trading days from weekends/holidays. Friday evidence can therefore be finalized on Saturday rather than waiting until Monday.

- PR #202 was rebased onto the then-latest main with no file overlap, rerun on the rebased head, and verified before merge: System2 Research CI `36357413919` PASS; V8 Regression `36357413917` PASS. Post-merge verification PASS: System2 Research CI `36357465388` executed 57 System2 test files, 26-table SQLite schema and production-isolation guard; V8 Regression `36357465389` PASS.

- Prospective Decision Clock promotion-grade trading-date count remains 0. Earliest ordinary eligible prospective trading date remains 2026-09-29. Coverage Integrity V0.2, Collector Provenance V0.3, A5 Boundary Integrity V0.1, Attempt-One Provenance V0.4, A1 Daily Close Integrity V0.2 and Coverage Finalization V0.3 are now frozen before the first sample. Exact Decision Clock authorization, System2 Worker Cron authorization and capture remain false.


- Decision Clock（決策時間點）dependency readiness integrity was hardened before the first prospective trading-date sample. PR #191 merged as `7f0ebda907d008ce3c3d944b252a9c4e13ac7799`: B2 contract V0.2 cannot become READY before 13:30 Asia/Taipei close finality, undated daily rows cannot be assigned to the target date, and classified-join coverage must meet the existing TWSE 600 / TPEx 450 market-wide minimums.

- A5/B2 dependency polling now records explicit `READY / NOT_READY / SOURCE_ERROR / INVALID_PAYLOAD / NOT_APPLICABLE` states. Precision bracketing uses only an explicit `NOT_READY -> READY` transition; `SOURCE_ERROR` can never masquerade as NOT_READY. Dependency-family transport is isolated so a B2 transport error does not erase a valid A5 observation. PR #191 pre-merge System2 Research CI `36351189831` PASS (55 test files, syntax, 26-table SQLite schema, production-isolation guard) and V8 Regression `36351189836` PASS; post-merge System2 Research CI `36351252363` PASS.

- Decision Clock A5 Boundary Integrity（A5 邊界完整性）V0.1 merged before the first prospective trading-date sample in commit `59c7104194857111626cbb0ee07752deec75fe58` via PR #194. Same-session candidate time is still determined only by A1 TWSE + A1 TPEx + B2; A5 remains periodic but must have been prospectively READY no later than the computed candidate timestamp.

- Daily evidence now records `evidenceSemanticsVersion=S2_DECISION_CLOCK_DAILY_EVIDENCE_SEMANTICS_V0_2_1`, `sameSessionClockReady`, `a5ObservedAtDecisionBoundary`, `a5AvailableByCandidate`, and `candidateTimestamp`. A5 observed after the candidate leaves the same-session candidate visible diagnostically but forces `requiredReady=false` and `precisionEligible=false`.

- Aggregation preserves `a5BoundaryFailureDates`; owner review exposes them and adds `A5_NOT_AVAILABLE_BY_CANDIDATE`. PR #194 pre-merge System2 Research CI `36351576948` PASS (55 test files) and V8 Regression `36351576944` PASS; post-merge System2 Research CI `36351630013` PASS and V8 Regression `36351629962` PASS.

- Prospective Decision Clock promotion-grade trading-date count remains 0. Earliest ordinary eligible prospective date remains 2026-09-29. All readiness/finality/provenance hardening above was frozen before that first sample; no historical observation or outcome data was used.


- Decision Clock（決策時間點）Collector Provenance（擷取器來源證明）V0.3 merged to main in commit `84b7e40c2c6ee8f2294b65e16383925f2990b443` via PR #169 before the first prospective trading-date evidence. Promotion-grade scheduled artifacts now use `S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3`; the embedded readiness evidence remains `S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2`.

- Every V0.3 scheduled bundle freezes GitHub workflow run ID, run attempt, workflow SHA/ref, plus a deterministic SHA-256 collector-contract fingerprint over the preregistered 13-file collection contract. Aggregation fails closed if embedded run provenance does not match the GitHub Actions metadata from which the artifact was downloaded.

- Promotion-grade dates must share exactly one collector-contract fingerprint. Mixed fingerprints set `collectorContractConsistent=false`, block promotion as `COLLECTOR_CONTRACT_DRIFT`, and cannot be pooled to reach the 10-date or 20-date readiness gates. The system may not cherry-pick a preferred collector version or silently reset the sample after seeing outcomes.

- A material collector change after prospective evidence begins requires a separately documented/preregistered evidence epoch or contract version. Historical dates under another fingerprint remain auditable but are not silently mixed into the active freeze sample.

- PR #169 final-head verification PASS before merge: System2 Research CI run `36328899840` executed 55 test files, module syntax, 26-table SQLite schema and production-isolation guard successfully; V8 Regression run `36328899818` PASS. Post-merge verification also PASS: System2 Research CI run `36328997508`; V8 Regression run `36328997525`.

- Prospective Decision Clock promotion-grade trading-date count remains 0. First ordinary eligible prospective date remains 2026-09-29. Collector Provenance V0.3 and Coverage Integrity V0.2 are now frozen before that first sample arrives; no retrospective substitution was used.


- Decision Clock（決策時間點）Coverage Integrity（證據覆蓋完整性）V0.2 merged to main in commit `04cd1436931101b2ae8bc0f87d9295de24bd6105` via PR #166. Coverage is now generated from the full preregistered prospective date window beginning 2026-09-29 rather than only dates that happened to produce runs/artifacts.

- The first scheduled run, attempt 1 only, is the immutable daily coverage anchor. Later scheduled runs or GitHub Actions rerun attempts cannot repair an earlier failed/missing anchor or convert that date into promotion-grade evidence.

- Coverage failure classification is explicit: `NO_COMPLETED_SCHEDULED_RUN`, `SCHEDULED_RUN_NOT_SUCCESS`, `SCHEDULED_RUN_RERUN_ATTEMPT`, `DAILY_ARTIFACT_MISSING`, and `DAILY_ARTIFACT_COUNT_INVALID`. Official non-trading days remain legitimate skips rather than failures.

- The Decision Clock owner-review packet now carries the coverage-integrity extension version, audited start/through dates, failure-class counts and trading-day gap dates. Any such gap continues to block `OWNER_REVIEW_ELIGIBLE`; exact clock, Worker Cron and capture remain unauthorized.

- PR-time System2 Research CI is now active for `system2/**` changes. Pre-merge verification on PR #166: System2 Research CI run `36327997480` PASS (52 test files, syntax, 26-table SQLite schema and production-isolation guard); V8 Regression run `36327997477` PASS. Post-merge verification: System2 Research CI run `36328161415` PASS; V8 Regression run `36328161546` PASS.


- Review-packet integration verification PASS: System2 Research CI run `36325049835`, job `108636106573`.

- Read-only readiness aggregation now emits the review state automatically; `OWNER_REVIEW_ELIGIBLE` still keeps exact clock, Worker Cron and capture unauthorized.

- The future owner-review packet is outcome-free: it must disclose the full included-date list, worst required-source upper bound, 15-minute safety buffer, candidate Taipei time, duplicate/manual artifact counts and any coverage blockers. No nicer clock may be substituted after observing outcomes.

- Decision Clock（決策時間點）owner-review packet V0.1 is preregistered before evidence maturity. It cannot become `OWNER_REVIEW_ELIGIBLE` until deterministic artifact selection, complete trading-day coverage, `FREEZE_ELIGIBLE`, >=20 independent dates and all-precise evidence are simultaneously true.

- No historical or retrospective arrival evidence was substituted. Earliest ordinary prospective evidence date remains 2026-09-29; the system must wait for real same-day scheduled artifacts to accumulate.

- Aggregation end-to-end fixture + guard verification PASS. System2 Research CI run `36324912254`, job `108635698802`: SUCCESS.

- A separate read-only readiness workflow now aggregates GitHub Actions artifacts at 16:30 Asia/Taipei on weekdays using only `github.token` with `actions: read`; it uses no Cloudflare secret, performs no D1/Worker/Cron mutation, and cannot authorize an exact clock.

- Scheduled-run coverage audit is now explicit: official non-trading-day no-bundle runs are legitimate skips, while an official trading-day scheduled run without a daily bundle becomes `SCHEDULED_TRADING_DAY_ARTIFACT_GAPS` and blocks promotion-grade readiness.

- Decision Clock（決策時間點）artifact aggregation V0.1 implemented and verified. Promotion-grade readiness uses only scheduled prospective daily bundles; manual runs are diagnostics only; same-date scheduled duplicates use the earliest scheduled run deterministically, preventing favorable rerun cherry-picking.

- Prospective V0.2 trading-date evidence count remains 0. 2026-09-28 is an official TWSE holiday; earliest ordinary prospective trading session is 2026-09-29.

- System2 Research CI run `36324105323`, job `108633421570` PASS after V0.2 code/guard correction; V8 regression run `36324056669`, job `108633282565` PASS. Engineering pass is not source-latency evidence or strategy alpha evidence.

- V0.2 readiness remains 10 independent complete dates => at most PROVISIONAL_ELIGIBLE; 20 complete precise dates => may become FREEZE_ELIGIBLE. Exact Decision Clock/Cron authorization remain false pending owner review.

- V0.2 precision rule: a required same-session source needs prior NOT_READY -> READY within <=5 minutes. If scheduling is delayed and the first probe is already READY, that date is availability evidence but `precisionEligible=false`.

- A dedicated GitHub Actions Research Schedule（GitHub Actions研究排程） is now armed at intended 13:25 Asia/Taipei weekdays for read-only evidence collection. Official TWSE calendar gates trading dates; actual probe timestamps are authoritative. This is NOT the System2 Worker Cron and cannot arm capture.

- Decision-clock evidence contract advanced to V0.2: same-session clock constraints are A1 TWSE close + A1 TPEx close + B2 derived snapshot; A5 must be prospectively observed before the boundary but is periodic rather than a same-session close latency constraint.

- A5/B2 real-source non-trading smoke PASS in run `36323358775`, job `108631337257`: all transport OK; A5 `OBSERVED_COVERAGE_PASS`; B2 `DERIVED_SNAPSHOT_INCOMPLETE` as expected without a same-date trading close; prospective evidence eligible=false; no mutation.

- B2_INDUSTRY_THESIS_PROSPECTIVE（前瞻產業狀態） observer implemented: official current company profiles + same-date TWSE/TPEx close produce descriptive industry breadth/participation snapshots. It assigns no industry thesis direction/strategy score and never backfills today's classification into history.

- A5_QUARTERLY_FINANCIALS（季度財務） prospective observer implemented: official TWSE/TPEx EPS + profitability, market-wide quarterly-vintage coverage, first-observed provenance; exact company filing/publication timestamp remains unproven and historical pre-observer vintage timing remains UNKNOWN.

- Source-arrival measurement repository verification PASS on GitHub: System2 Research CI run `36321299702`, job `108625521377`; automatically triggered V8 Regression run `36321299718` also PASS. No Worker deploy/D1 provisioning/capture-arm/Cron workflow ran.

- Source Arrival Latency（資料來源到達延遲）/ Decision Clock（決策時間點）measurement contract V0.1 is implemented repository-side. Exact clock remains UNFROZEN; capture remains disabled; Cron remains 0.

- The read-only measurement workflow is manual `workflow_dispatch` only. It uses official GET endpoints, stores only a GitHub Actions artifact/summary, has no Cloudflare secret, does not write D1/KV, and does not call System 1/V8.

- Prospective latency evidence must be observed on the same Taipei market date. Later historical retrieval cannot be relabeled as arrival evidence. First observed READY is an upper bound, not a publication timestamp; SOURCE_ERROR is not NOT_READY.

- Decision-clock preregistration requires 10 complete independent trading dates for provisional eligibility and 20 for freeze eligibility, both A1 TWSE/TPEx daily gates complete, <=5-minute observation intervals, and a 15-minute rounded safety buffer. Eligibility never auto-authorizes a clock or Cron.

- Full decision-clock freeze remains blocked by two explicitly preserved dependencies: A5 quarterly filing-vintage/publication-event measurement and B2 prospective derived industry-thesis snapshot measurement.

- Next phase is source-arrival latency measurement + after-close decision-clock freeze. Cron activation remains a separate explicit owner authorization boundary.

- The temporary push-based Worker smoke authorization trigger was disarmed. The Worker is now an inert isolated runtime resource; it is not scheduled and cannot begin prospective capture.

- Post-smoke lock-down verified read-only in run `36314678044`, job `108607025869`: `system2-shadow-research` exists exactly once, `SYSTEM2_DB` binding present, capture=false, Cron count=0, workers.dev=false, Preview/Version URLs=false, and no mutation performed.

- The first smoke attempt `36314452669` correctly stopped because `wrangler deploy` with `workers_dev=false` and no traffic target did not expose a Version URL. This was diagnosed and recovered with a temporary Version URL; no security gate was weakened.

- Owner explicitly authorized isolated Worker Smoke Test（冒煙測試）. Recovery run `36314596516`, job `108606794301` verified `/health` against the real `system2-research` D1: schema `0.5`, `CAPTURE_DISABLED`, scheduled capture blocked, and System 1 runtime not used.

- Next cloud-runtime boundary is explicit owner authorization to create/deploy the isolated `system2-shadow-research` Worker for smoke/health validation. Cron activation remains a separate later authorization after source-latency measurement and decision-clock freeze.

- Repository verification PASS after capture-runtime work: GitHub Actions run `36312760393`, job `108601721057`; tests, module syntax, SQLite schema and production-isolation guard all PASS.

- Prospective capture plan freezes source expectations without imputing gaps: SHORT_MOMENTUM requires A1 daily OHLCV/derived fields; SWING_GROWTH requires A5 quarterly financials plus a prospective B2 industry-thesis snapshot. Missing required evidence remains INCOMPLETE.

- Separate `system2-shadow-research` Worker skeleton is implemented but NOT DEPLOYED. Deployment template defaults to `workers_dev=false`, no routes, no Cron, and `SYSTEM2_CAPTURE_ENABLED=false`; scheduled capture fails closed until source adapters and exact decision-clock semantics are ready.

- Prospective Shadow capture contract V0.1 implemented repository-side: first stage is AFTER_CLOSE_DECISION_CAPTURE only for SHORT_MOMENTUM and SWING_GROWTH Limited Shadow lanes; intraday, notifications, outcomes and historical backfill remain off.

- Physical isolated persistence blocker is RESOLVED. Next phase is repository-side design of a separate System 2 prospective Shadow capture Worker/scheduler; actual Worker/Cron creation/deployment remains a new-runtime authorization boundary.

- The temporary push-based provisioning authorization path was disarmed after successful creation/replay. The provisioning workflow is manual-only again.

- Physical replay verification PASS: run `36312460524`, job `108600904592` reused the existing `system2-research` database (`created=false`, `reusedExisting=true`) with the same database ID digest `9768891c9583`, schema V0.5, 26 tables and write/read PASS.

- Owner explicitly authorized creation of the isolated System 2 D1. Guarded run `36312415771`, job `108600779602` created `system2-research`; database ID digest `9768891c9583`; schema V0.5; 26 `s2_` tables; required-table and write/read verification PASS; production database/Worker/Cron unchanged.

- The permission/secret blocker is resolved. Remaining boundary is explicit authorization to CREATE the isolated `system2-research` D1 and apply schema V0.5 via the guarded manual provisioning path.

- Post-secret audit bug diagnosed and corrected: `/user/tokens/verify` was wrong for the newly created account-owned token; `/accounts/{account_id}/tokens/verify` is now used. Resource permissions were already valid; no security gate was weakened.

- Read-only D1 audit confirms the exact isolated target `system2-research` does not currently exist among visible databases; provisioning is required. `system2-shadow-research` Worker also does not exist. No cloud mutation has occurred yet.

- Dedicated `SYSTEM2_CLOUDFLARE_API_TOKEN` is now installed and verified with the correct account-owned-token endpoint. Read-only audit run `36312108492`, job `108599936927`: token verify HTTP 200, D1 list HTTP 200, Workers list HTTP 200.

- V0.5 repository verification PASS: GitHub Actions run `36305786450`, job `108582061023`; 27 System 2 test files PASS, runtime/deploy syntax PASS, SQLite creates 26 `s2_` tables, and production-isolation guard PASS.

- Current genuine blocker is NEW D1 ACCOUNT PERMISSION/SECRET. Existing production Workers token must not be broadened or the production D1 reused as a shortcut. See `SYSTEM2_CLOUD_PERSISTENCE_READINESS_V0_1.md`.

- Guarded manual isolated-D1 workflow prepared: `.github/workflows/system2-isolated-d1-provision.yml` requires exact confirmation `CREATE_SYSTEM2_ISOLATED_D1` and dedicated secret `SYSTEM2_CLOUDFLARE_API_TOKEN`; target is only `system2-research`. It creates/reuses the isolated D1, applies V0.5, verifies required tables, and performs write/read sentinel validation without touching production Worker/root Wrangler/Cron.

- Research schema advanced to V0.5 with `s2_schema_meta` and append-only `s2_infrastructure_checks` for physical persistence verification. Still NOT DEPLOYED.

- Physical Cloudflare readiness audit completed read-only: current legacy token is valid and can list Worker scripts, but D1 database listing returns HTTP 401. Because D1 list permission is missing, `system2-research` database existence is UNKNOWN, not absent.

- Research storage design advanced to V0.4 and remains NOT DEPLOYED. Physical prospective Shadow accumulation is now blocked by isolated cloud resource provisioning rather than missing repository-side audit/persistence semantics.

- Deterministic persistence batch planner + isolated executor implemented and verified: whitelist `s2_` tables only, run fingerprint last, identical replay idempotent, same identity/different immutable payload => IMMUTABLE_CONFLICT fail-closed, non-isolated binding rejected, and decision-time batches do not accept outcome rows.

- Isolated persistence plan V0.1 completed: future physical target is a separate System2 service/database with binding `SYSTEM2_DB`; no production database/KV/Worker/Cron fallback is allowed. Example Wrangler config contains placeholders only and is not deployed.

- System2 Research CI（研究持續整合） is active for `system2/**` only. Initial run exposed a RANK-03 test-fixture provenance omission; the PIT gate was NOT weakened. Fixture fixed, then GitHub Actions run 36301289399 passed all 26 System2 tests, in-memory SQLite schema validation (24 `s2_` tables), and the production-isolation guard.

- All pre-persistence audit tasks listed in `SYSTEM2_LIMITED_SHADOW_VERIFICATION_V0_1.md` are now complete. Remaining operational blocker is isolated physical System 2 persistence + scheduled capture; no V8 production storage/runtime has been touched.

- Shadow Run Fingerprint（執行批次指紋） implemented and verified: source-session hash + full-universe accounting + decision/order/experiment/capacity/lifecycle hashes are frozen into a deterministic run identity; outcomes may join only when provenance/accounting are complete.

- Shadow Source Session Receipt（資料來源批次收據） implemented and verified: REQUIRED missing/stale/invalid/PIT-ineligible/future-known sources fail closed; OPTIONAL/CONTEXT gaps remain explicit without becoming zero/negative evidence.

- Ranking research infrastructure now spans RANK-01 baseline, RANK-02 EntryReadiness challenger, RANK-03 confluence gate, RANK-04 regime-readiness gate, RANK-05 retention/replacement Shadow comparison, RANK-06 strategy-overlap redundancy measurement, and RANK-07 concentration measurement. None of RANK-03 through RANK-07 currently changes actual candidate ordering or capacity policy.

- RANK-07 concentration experiment preregistered as measurement-only. Industry counts/coverage/known-only HHI and strategy-membership concentration are recorded; UNKNOWN industry stays UNKNOWN; no industry/strategy hard cap, eviction or sizing effect is authorized. Verification PASS.

- RANK-06 multi-strategy overlap experiment preregistered and overlap receipt implemented. Shared/distinct PRIMARY/REQUIRED family structure is measured, but strategy count creates no bonus and overlap priority effect remains unauthorized. Verification PASS.

- RANK-05 verification PASS: shadow displacement eligibility is isolated to strict same-strategy Pareto-tier improvement; action remains SHADOW_COMPARE_ONLY and outcomeAttached=false. Candidate age is recorded but not penalized.

- RANK-05 incumbent-retention vs replacement experiment preregistered. Current real baseline remains RETAIN_VALID_INCUMBENT; same-strategy strictly better Pareto-tier challengers are Shadow comparison only. Same-tier neutral hash, candidate age, cross-strategy and multi-strategy cases cannot evict an incumbent in V0.1.

- RANK-04 missing fields produce REGIME_INCOMPLETE rather than neutral/negative evidence. This preserves the source-first rule and leaves the ranking challenger blocked until prospective coverage is adequate.

- RANK-04 readiness gate implemented and verified: SHORT_MOMENTUM requires TAIEX trend+breadth+sector rotation+volatility; SWING_GROWTH requires trend+sector rotation+volatility; TPEx candidates additionally fail closed if TPEx regime state is UNKNOWN. TAIEX is never used as a TPEx proxy.

- RANK-04 Market Regime（市場環境） priority research preregistered, but no regime ranking bonus/activation weight is active. Current source incompleteness makes any universal Risk-on/Risk-off score premature.

- This is an explicit evidence-first stop: BREAKOUT_ACCEPTANCE_CONFLUENCE and GROWTH_REPRICING_CONFLUENCE remain candidate interactions, not bonuses. No confluence ranking effect has been assumed.

- Interaction observation receipt implemented and verified: PIT-ineligible/missing components prevent KNOWN state; non-KNOWN forces INDETERMINATE; redundancyState=NOT_TESTED is not ranking-eligible; only KNOWN + determinate + CONTROLLED_FOR_RESEARCH can become research ranking-eligible.

- RANK-03 CONFLUENCE（共振） research question preregistered, but ranking challenger intentionally NOT ACTIVATED. A confluence interaction may not receive ranking priority before PIT-valid component receipt + redundancy control exists.

- Ranking experiment receipts implemented: baseline/challenger policy hashes, common-support symbols, candidate-set equality and rank deltas are frozen before outcomes; outcomeAttached=false at preregistration. Research-only storage/serializer added.

- RANK-02 challenger verification PASS. EntryReadiness cannot change StrategyValidity, cannot make non-proximate names active-monitor eligible, and is tested only as incremental ordering information beyond RANK-01.

- RANK-02 EntryReadiness（進場準備度） experiment preregistered before outcomes: Global Admission challenger keeps Pareto tier primary then tests binary PROXIMATE vs NON_PROXIMATE; Active Monitor challenger keeps Pareto tier primary then tests BUY_ELIGIBLE > ACTIVE_ENTRY_MONITOR > NEAR_ENTRY as a hypothesis, not a fact.

- Cross-strategy scarcity gate implemented: if eligible new symbols exceed remaining global vacancies and no versioned global priority policy exists, allocation fails closed as GLOBAL_PRIORITY_UNRESOLVED and retains incumbents only. This prevents accidental strategy-iteration/symbol-order selection. Verification PASS.

- RANK-01 neutral tie handling uses deterministic hash only to make within-Pareto-tier machine order reproducible; within-tier ordinal is explicitly not an economic superiority claim. Verification PASS.

- RANK-01 strategy-local baseline preregistered and implemented for SHORT_MOMENTUM and SWING_GROWTH using Pareto dominance（帕累托支配） across small approved evidence-family sets; no weighted sum, total score or outcome tuning. Missing ranking inputs remain unranked rather than receiving a fake low rank.

- Research-only storage design now includes candidate lifecycle/re-entry receipts; incremental SQLite syntax validation passed. No strategy-specific invalidation threshold or live behavior was changed.

- Candidate lifecycle verification PASS: a surviving strategy membership can retain a symbol; no surviving observation-value membership fails closed for pool states; SIM_FILLED -> POSITION_MONITOR separation works; terminal episodes cannot reopen; re-entry requires a new candidateEpisodeId.

- Candidate lifecycle contract V0.1 implemented from owner-approved persistence rules: membership-aware daily retention, terminal episode immutability, new episode on re-entry, and POSITION_MONITOR separation from candidate capacity.

- Research-only storage design now includes `s2_strategy_ordering_receipts` and `s2_capacity_runs`; serializers and incremental SQLite syntax checks passed. No production database/runtime deployment occurred.

- Ranking research plan V0.1 preregistered: strategy-local baseline -> entry-readiness increment -> confluence increment -> regime priority -> incumbent replacement -> multi-strategy overlap -> concentration. CAPACITY_OVERFLOW names are mandatory control cohorts.

- Strategy-local ordering receipt implemented so upstream ordering must carry strategy/policy/version/decision provenance. Cross-strategy ranks are not assumed numerically comparable.

- Candidate-capacity allocator verification PASS: overlap dedupe, per-strategy slot accounting, no-forced-fill behavior, capacity-overflow preservation and retained-pool invariant fail-closed all passed.

- Candidate capacity contract V0.1 implemented from owner-approved invariants: global max 12 unique symbols, per-strategy max 3 ACTIVE_INTRADAY_MONITOR, no forced filling, overlap counts once globally and once in each actively monitored strategy. Capacity layer does not compute a universal score.

- Research-only storage schema V0.3 now includes `s2_shadow_runs`; incremental SQLite syntax validation for the new run table and extended decision columns passed. Schema remains NOT DEPLOYED.

- Shadow storage row serializers implemented and verified for `s2_decisions` and `s2_shadow_runs`; null rank/score and explicit strategy-validity/entry-readiness/source-readiness metadata are preserved.

- PIT-safe family-assessment receipt implemented and verified: missing, stale, invalid or PIT-ineligible REQUIRED factor inputs prevent a family from being KNOWN and force thesisState to INDETERMINATE.

- Full-universe Shadow run receipt implemented and verified: base universe must partition into excluded + eligible; every eligible symbol must receive an accounting state or the run is INCOMPLETE. This prevents selected-only/survivorship capture.

- Pre-ranking semantic correction completed: BUY_ELIGIBLE（符合進場條件） in Limited Shadow maps to QUALIFIED_NOT_SELECTED（符合策略但尚未完成最終選擇）, not SELECTED, until a separate ranking/capacity layer enforces global max-12 and per-strategy max-3. Verification PASS.

- Always-on Shadow accumulation remains NOT ACTIVE. Physical blocker remains isolated System 2 persistence + scheduled capture; do not attach to V8 production D1/runtime without Class B review.

- Storage design advanced to V0.3 (still research-only / not deployed) to persist strategy_validity, entry_readiness, source_readiness, shadow_spec_id and evaluation_mode without collapsing non-selected states.

- Limited Shadow decision builder implemented and verification passed: VALID+BUY_ELIGIBLE => QUALIFIED_NOT_SELECTED until ranking/capacity completes; missing REQUIRED evidence => INCOMPLETE+BLOCKED and still archived; VALID+TOO_EXTENDED => WATCH; source-blocked strategy cannot create a Limited Shadow decision. This verifies state semantics, not alpha.

- First two Limited Shadow（有限影子模擬） specs preregistered before outcome tuning: S2-SM-LS-001 and S2-SG-LS-001. V0.1 freezes no numeric rank/score/weight/threshold; rank and totalScore remain NULL.

- Machine-readable strategy source-readiness receipts implemented and verified. Current receipt states: SHORT_MOMENTUM=SOURCE_LIMITED, SWING_GROWTH=SOURCE_LIMITED, INDUSTRY_TREND=SOURCE_BLOCKED, EVENT_DRIVEN=SOURCE_BLOCKED, VALUE_REVERSION=SOURCE_LIMITED. These states describe source feasibility only and do not authorize weights/thresholds or live behavior.

- Research suggestion handling is now persisted in `system2/CHATGPT_PROJECT_INSTRUCTIONS.md`: every newly proposed factor/rule is a hypothesis and must pass mechanism, counterexample/failure-mode, redundancy, PIT/quantifiability and incremental-value checks; unsupported ideas are rejected or omitted.

- Contract/evaluator verification passed in-tool: five contract registry entries validated, immutable contracts confirmed, numeric-scoring guard passed, REQUIRED-UNKNOWN fail-closed passed, hard-invalidation precedence passed, and conflict downgrade passed.

- Generic StrategyValidity（策略有效性） / EntryReadiness（進場準備度） evaluator implemented research-only. REQUIRED evidence missing => INCOMPLETE + BLOCKED; hard invalidation => INVALIDATED + BLOCKED; adverse PRIMARY evidence can yield WEAKENING; valid contradictory evidence can downgrade BUY_ELIGIBLE to CONFLICT instead of forcing a directional decision.

- Strategy source-readiness map V0.1 added. SHORT_MOMENTUM is limited-Shadow eligible with explicit gaps; SWING_GROWTH is limited prospective-Shadow eligible after source freeze; INDUSTRY_TREND and full EVENT_DRIVEN are source-blocked for full Shadow; VALUE_REVERSION remains limited research-only Shadow.

- Machine-readable StrategyContract（策略契約） registry V0.1 implemented for the five currently owner-approved strategy identities: SHORT_MOMENTUM, SWING_GROWTH, INDUSTRY_TREND, EVENT_DRIVEN and research-only VALUE_REVERSION. No numeric weights, floors, caps or thresholds are frozen.

- StrategyContract（策略契約）machine-readable design phase started: `system2/SYSTEM2_STRATEGY_CONTRACT_V0.md` plus new research-only TypeScript interfaces separate evidence-family roles, data readiness, strategy validity and entry readiness. Only owner-approved strategy identities may be marked approved; IA/FG remain review-pending and Black Horse remains a research lane. No numeric weights/thresholds or System 1 behavior changed.

- ROA（資產報酬率）review completed: retain as FUNDAMENTAL_GROWTH（基本面成長） research candidate in SUPPORTIVE（加強） / QUALITY_CHECK（品質檢查） role, not a required hard gate. Test level/trend/peer/self-history context and redundancy versus ROE/ROIC, gross-profitability-to-assets and asset turnover before any score. Industry capital intensity/accounting asset structure are mandatory controls.

- Discussion proposals are hypotheses, not conclusions: every suggested factor/rule must be independently checked for counterevidence, failure modes, redundancy and incremental value. Ideas that add no value should be rejected or omitted rather than justified into the system.

- Owner explicitly requires an anti-agreement rule: do not accept a proposed factor/idea just because the owner suggested it. Every suggestion must receive mechanism + counterevidence + redundancy/incremental-value review, and may be rejected, downgraded to research-only/context-only, or accepted only when evidence justifies it. Do not manufacture reasons to keep weak ideas.

- FUNDAMENTAL_GROWTH（基本面成長）identity review advanced: quality-growth dimensions now explicitly include growth persistence/acceleration, margin quality, cash conversion/FCF, working-capital quality, ROE/ROIC where reliable, balance-sheet fragility, growth durability/customer concentration and capital allocation. Contract liabilities remain context-specific. Status remains OWNER REVIEW PENDING until explicit approval.

- Owner-observed STATE_OWNED_BANK_FLOW（公股行庫資金流） hypothesis accepted for research as AUXILIARY_CONTEXT_ONLY（輔助脈絡） / WARNING_MODIFIER（警告修正）, not as a buy/sell factor. Research focus: countercyclical support during market stress and later normalization selling after rebounds. Public-bank broker flow is not assumed identical to government/National Financial Stabilization Fund activity or informed conviction; current System 2 has no canonical source contract, so source/member-code/PIT validation is required before scoring.

- SWING_GROWTH（波段成長）strategy identity core logic owner-approved: focus on earnings repricing/acceleration, earnings quality, PIT-valid catalysts and industry/company transmission; technical/K-line evidence is timing support rather than proof of growth; THESIS_WEAKENING（投資邏輯轉弱） is distinct from THESIS_INVALIDATED（投資邏輯失效）. Exact thresholds/weights remain unfrozen.

- Technical-pattern intent firewall added: OHLCV can describe pattern/price behavior but cannot prove whether a large participant intentionally created or manipulated the pattern. Strategic trading/manipulation is treated as a possible mechanism/counterexample, not an inferred fact.

- SHORT_MOMENTUM（短線動能）strategy identity core logic owner-approved. Technical/K-line/chart patterns are explicitly non-unique evidence and never sole entry/exit authority; valid action requires cross-checks with price-volume acceptance, market/sector context, risk/reward and other available evidence families.

- Strategy-identity phase started. `system2/SYSTEM2_STRATEGY_IDENTITY_CARDS.md` Draft V0.1 created with unified PRIMARY / REQUIRED / SUPPORTIVE / CONTEXT_ONLY / HARD_INVALIDATION roles, setup/entry/add/reduce/exit semantics, intraday roles and falsification notes for all eight strategy families. Owner-approved statuses are preserved; previously discussed-but-not-explicitly-approved strategies remain OWNER REVIEW PENDING.

- CONFLUENCE_ENGINE（共振引擎）core logic owner-approved: aggregate within evidence families before cross-family confluence; prohibit majority voting and duplicate-counting; preserve hard invalidation/conflict states; separate FACTOR_CONFLUENCE（因子共振） from MULTI_STRATEGY_CONFLUENCE（多策略共振）. Numeric weights/floors/caps/interactions remain unfrozen.

- SYSTEM2_CONFLUENCE_ENGINE.md Design Draft V0.1 created for owner review: factor-family aggregation before cross-family confluence, no indicator majority voting, explicit redundancy controls, preregistered interaction terms, and separation of FACTOR_CONFLUENCE（因子共振） from MULTI_STRATEGY_CONFLUENCE（多策略共振）.

- Volume-baseline research direction owner-approved: retain relativeVolume5/20/60（日級5/20/60日相對量）, prev5IntradayBarRatio（前5根盤中K棒量比）, sameSlotRVOL（同時段相對量） and cumulativeVolumePace（累積成交量進度） as separate research comparators. No comparator is assumed superior before common-support redundancy/Shadow/OOS validation.

- PRICE_VOLUME_ENGINE（價量引擎）core architecture owner-approved: independent from TECHNICAL_STRUCTURE_ENGINE（技術結構引擎）, no majority-vote logic, data validity and hard invalidation outrank auxiliary indicators, and conflicts may resolve to WAIT / LOWER_READINESS rather than forced bullish/bearish scoring.

- SYSTEM2_PRICE_VOLUME_ENGINE.md Design Draft V0.1 created (owner review pending): keeps PRICE_VOLUME_ENGINE（價量引擎） independent from TECHNICAL_STRUCTURE_ENGINE（技術結構引擎）, defines participation/response/acceptance/persistence layers, and establishes conflict handling: no majority vote, data validity first, strategy hard invalidation outranks auxiliary indicators, technical structure and price-volume remain orthogonal, and contradictions become CONFLICT/WAIT/LOWER_READINESS instead of forced bullish/bearish scoring.

- SYSTEM2_TECHNICAL_STRUCTURE_ENGINE.md design draft V0.1 created: separates trend/levels/pattern topology/lifecycle/candlesticks/technical indicators/volatility/multi-timeframe/failure states; KD（KD隨機指標）, MACD（指數平滑異同移動平均線）, RSI（相對強弱指標）, ATR（平均真實波幅）, MA/EMA（移動平均線／指數移動平均線）, DMI/ADX（趨向指標／平均趨向指數）, Bollinger Bands（布林通道）, ROC/Momentum（變動率／動能） are auxiliary signals subject to redundancy checks. Engine describes structure and does not emit BUY/SELL.

- TECHNICAL_INDICATOR_AUXILIARY_LAYER（技術指標輔助層） explicitly added under the System 2 technical engine. Core support includes KD（KD隨機指標）, MACD（指數平滑異同移動平均線）, RSI（相對強弱指標）, ATR（平均真實波幅）, MA/EMA（移動平均線／指數移動平均線）, DMI/ADX（趨向指標／平均趨向指數）, Bollinger Bands（布林通道） and ROC/Momentum（變動率／動能指標）. These are auxiliary/context signals, not standalone BUY/SELL rules, and must pass redundancy/PIT/Shadow/OOS checks.

- Design gap explicitly opened: System 2 has referenced TECHNICAL / KLINE_PATTERN（技術面／K線型態） across strategies, and Shared Knowledge already contains active K-line/pattern research, but a dedicated System 2 TECHNICAL_STRUCTURE_ENGINE（技術結構引擎） has not yet been fully specified. Before freezing strategy identity cards, define candlestick signals, chart-pattern topology, support/resistance, trend/volatility structure, Fibonacci confluence, pattern lifecycle/confirmation/failure, and strategy-specific consumption rules. This is a shared module, not automatically a standalone strategy.

- VALUE_REVERSION（價值回歸策略）core logic owner-approved as research-only: distinguish mispricing from structural deterioration, require discount reason + catalyst/repair path + valuation context + reversal confirmation, prohibit blind averaging down, and retain VALUE_THESIS_INVALIDATED（價值投資邏輯失效）. Promotion remains blocked pending PIT/Shadow/OOS evidence versus simple low-valuation/rebound baselines.

- EVENT_DRIVEN（事件驅動策略）core logic owner-approved: verified source/timing, event-to-industry/company transmission, company exposure, surprise/price-in assessment, half-life/expiry/invalidation, event-to-structural-trend transition, and direct integration with POSITION_MONITOR（持股監控）. Exact scoring/thresholds remain unfrozen.

- Owner added CONTRACT_LIABILITY（合約負債） as a required fundamental research dimension. System 2 will study QoQ/YoY trend, acceleration and normalized ratios, with industry-applicability, margin/cash-flow/contract-quality guards and PIT timing. Rising contract liabilities are NOT automatically bullish. Current repository audit found no normalized contract-liability field, so source extension + PIT validation is required before scoring.

- INDUSTRY_TREND（產業趨勢策略）core logic owner-approved: cycle-stage first, company-level earnings transmission, leader-vs-high-beta-beneficiary comparison, technical timing rather than thesis substitution, cycle-peak warning, and explicit industry-thesis invalidation. Exact thresholds remain unfrozen.

- Owner-facing terminology rule: whenever English professional/financial/system terms are used, append the Traditional Chinese meaning on first use; avoid unexplained English jargon/acronyms.

- New owner-suggested hypothesis recorded: when a sector/industry thesis is bullish, test whether sector leaders deserve first-pass selection priority because of stronger fundamentals/industry position and potential institutional preference. This is NOT yet a rule; leader definition and leader-vs-follower performance must be falsified with PIT/Shadow/OOS evidence, including overvaluation/crowding/early-cycle follower counterexamples.

- Owner approval confirmed for the full symmetric position-management architecture, including ADD_ON_STRENGTH, ADD_ON_PULLBACK, RE_ADD_AFTER_REDUCE, ADD_ON_NEW_INFORMATION, dedicated POSITION_MONITOR, recovery conditions after every reduction, and anti-whipsaw hysteresis. Exact thresholds remain unfrozen pending Shadow validation.

- Exact re-add/sizing thresholds are not frozen and require prospective Shadow/falsification/cost validation.

- Re-add is evaluated from current recovery evidence, thesis and reward/risk; prior reduce price or average cost cannot by itself label a valid restoration as chasing.

- Exposure control must be symmetric: actual exposure is compared with desired exposure, supporting HOLD / REDUCE / EXIT as well as ADD / RE-ADD / RESTORE.

- Position-management target architecture approved: verified actual holdings, once an owner-authorized holdings source/reconciliation path is wired, remain outside candidate/active-entry caps. Current implemented `POSITION_MONITOR` lifecycle is virtual/simulated only (`VIRTUAL_POSITION_READY`); actual-holdings ingestion/reconciliation is `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED` and `ACTUAL_POSITION_MONITOR_VERIFIED=false`.

- Candidate lifecycle approved: the 12-symbol pool persists across days; every post-close run revalidates each existing name, retains it while at least one strategy thesis still has observation value, removes it when the surviving thesis is invalidated/turns materially bearish, and fills vacancies with newly qualified names. State-change reasons must be frozen.

- Capacity rule approved: global System 2 candidate/watch pool max 12 unique symbols; each strategy max 3 ACTIVE_INTRADAY_MONITOR symbols; no forced filling; multi-strategy overlap counts once globally but remains strategy-specific for monitoring/performance.

- Same overall website/platform can host multiple isolated engines.
- System 2 is a multi-strategy discovery/selection platform, not a relaxed clone of V8.
- Market/global regime is an upper-layer context.
- Strategy weights/floors are context-specific and not fixed yet.
- Daily outputs must be frozen and performance-tracked.
- Shared knowledge is reusable; system-specific decision logic remains isolated.
- System 2 decision authority is fully independent: System 1/V8 cannot approve, reject or gate System 2 selection, entry, exit, monitoring or notifications.

## 2026-10-04 S2-CORR-20261004-002 position-monitor semantic remediation

Correction state at implementation start:
- target/design rule and current operational capability were previously conflated in canonical wording;
- `s2_positions` and current `SIM_FILLED -> POSITION_MONITOR` runtime are virtual/simulated System 2 position lifecycle;
- no authorized System 2 actual-holdings source, broker-holdings adapter, reconciliation path or physical quantity/cost/fill/ownership provenance readback has been verified;
- signal price, suggested/requested shares, plan snapshots and simulated fills cannot establish actual ownership;
- System 1/V8 holdings must not be imported without explicit owner authorization.

Canonical readiness terms:
- `TARGET_ONLY`
- `DESIGN_APPROVED`
- `VIRTUAL_POSITION_READY`
- `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED`
- `ACTUAL_POSITION_MONITOR_VERIFIED=false`

Any future broker/shared-live holdings integration is `OWNER_DECISION_REQUIRED`. This correction changes semantic/readiness truth only; it does not change strategy logic, capital/order authority, System 1 runtime or production push.

## MVP + Shadow implementation transition (2026-09-28)

- Owner explicitly moved System 2 into MVP（最小可用版本） + Shadow（影子實盤） engineering. The project must not wait for all 226 learning modules; engineering, prospective Shadow records, performance measurement and learning-room research proceed in parallel.
- Canonical implementation inventory is now `system2/SYSTEM2_MVP_SHADOW_STATUS_V0_1.md`. Future chats must use it together with this checkpoint and GitHub main to distinguish implemented code from design-only work.
- PR #221 merged as `b4a433a56da29426da6c4155449490542b518b87`: Shadow run accounting now supports `SELECTED`; Prediction Snapshot（預測快照） V0.1 projection archives Selected / Near-miss / Important Rejected while preserving immutable decision/factor/regime evidence and zero-pick days. It does not invent or enable an upstream final-selection rule.
- PR #222 merged as `4d7e8f5d0538cd0f67eb03cd1d962287e4972e18`: A1 per-symbol daily adapter now normalizes TWSE/TPEx ordinary-equity OHLC（開高低收）, volume, amount, transaction count, change, company name and source provenance with fail-closed PIT / duplicate / OHLC / coverage guards. The frozen Decision Clock collector was not modified.
- PR #223 merged as `714f560a4ed6ae150b3ed623ea88574041730e4b`: outcome tracker V0.1 now computes D1/D3/D5/D10/D20 signal returns, MFE（最大有利幅度）, MAE（最大不利幅度）, benchmark/industry-relative returns, target-first/stop-first/AMBIGUOUS_SAME_BAR observations, explicit cost scenarios and monotonic outcome-update validation. Simulated realized return after cost remains separate and is populated only by an explicit execution-simulator result.
- All three PR heads passed System2 Research CI and V8 Regression before merge. No System 1/V8 Formal Core, production runtime, System 2 strategy threshold/weight, D1 schema, Worker Cron or capture flag was changed.
- Remaining nearest P0 is no longer base storage/provenance design. It is the executable daily chain: verified historical A1 lookback -> versioned factor observations -> family/strategy evaluation -> full-market accounting -> ranking/capacity -> authorized final cohort -> frozen decision/Prediction Snapshot -> isolated D1 -> post-decision outcome/execution updates.
- Two owner gates remain explicit: (1) the initial final-selection policy that is allowed to emit `SELECTED`; (2) exact Decision Clock / Worker Cron / capture activation after the preregistered prospective evidence gates. Engineering can prepare and test everything around those gates without silently crossing them.

## MVP + Shadow P0 execution/outcome continuation (2026-09-28)

- Latest-main audit found two completed P0 merges that the older status paragraph had not yet incorporated: PR #225 (`ba8d05444dce42d84edfc6b79bb68e2e459938aa`) implements source-injected A1 historical primitives; PR #226 (`b3001d6`) implements the one-strategy Limited Shadow run assembler through immutable persistence while refusing final-selection activation.
- Minimum Taiwan daily execution simulator V0.1 is now implemented research-only. It consumes explicit strategy plan inputs and supports `BUY_STOP` / `BUY_LIMIT`, next-session firewall, explicit entry expiry, adverse gaps, official price-limit validation, halt/liquidity blocking, target/stop/max-holding exits, configurable slippage/commission/tax, and all-or-none fills.
- Daily OHLC never creates a fabricated exact fill timestamp. Same-bar or entry-bar order ambiguity remains `AMBIGUOUS_SAME_BAR`; possible stop-first/target-first paths are preserved and no favorable realized return is selected.
- A separate outcome persistence V0.1 path now keeps simulated orders/fills immutable, allows only monotonic `s2_outcomes` updates, uses the prior `updated_at` as an optimistic write guard, and verifies persisted rows after the batch. It accepts only isolated `SYSTEM2_DB`.
- Targeted execution/outcome tests PASS. Local System2 run passed 65 non-zip-dependent test files; four existing Decision Clock archive tests require the Linux CI `zip` tool absent from this Windows host. GitHub Actions remains the complete-suite authority.
- Local direct `tests/test_requirements_repair.mjs` against the checked-in Worker failed an old Requirement 11 expectation because the official V8 regression first rebuilds Worker through the guarded patch chain. This branch changes only `system2/**`; full V8 verification remains delegated to the existing GitHub Actions regression workflow.
- No strategy score/weight/threshold, final-selection policy, System2 capture flag, Worker Cron, D1 schema, System1/V8 Formal Core, monitoring, notification or production route changed.

## Next tasks

1. ✅ Inventory existing research into shared domain tags without relocating history — completed in `shared-knowledge/SHARED_RESEARCH_INVENTORY.md`.
2. ✅ Audit Tier A/B source fields for exact machine-readable contracts and historical PIT availability — `system2/SYSTEM2_SOURCE_CONTRACT_AUDIT.md`.
3. ✅ Define factor-engine TypeScript interfaces and normalization/UNKNOWN contracts — `system2/SYSTEM2_FACTOR_ENGINE_CONTRACT.md` + `system2/src/contracts.ts`.
4. ✅ Define market-regime V0 inputs using Tier A / prospectively derivable fields only — `system2/SYSTEM2_MARKET_REGIME_V0.md`.
5. ✅ Define execution simulator assumptions for Taiwan fees/tax/slippage/gaps/limits — `system2/SYSTEM2_EXECUTION_SIMULATOR_SPEC.md`.
6. ✅ Implement first research-only factor snapshot + frozen decision archive + isolated `s2_` schema prototype. Node/SQLite verification recorded in `system2/SYSTEM2_P1_IMPLEMENTATION_VERIFICATION.md`.
7. ✅ Complete repository-side isolated persistence/provenance preparation — source session, full-universe accounting, run fingerprint, persistence batch/executor, research CI and isolated deployment template are complete.
8. ✅ Dedicated D1 token installed and verified with account-owned token endpoint.
9. ✅ Isolated `system2-research` D1 created, schema V0.5 applied, 26 tables verified, write/read and replay reuse checks PASS; production unchanged.
10. ✅ Repository-side prospective Shadow capture Worker/scheduler contract implemented and CI-verified; code defaults capture-disabled and scheduled capture remains unauthorized.
11. ✅ Isolated `system2-shadow-research` Worker smoke deployment verified against `SYSTEM2_DB`; capture remains disabled, workers.dev/Preview URLs are off, Cron count is 0, and System 1 is unchanged.
12. ✅ Source-arrival/decision-clock measurement contract, tests and manual read-only workflow implemented repository-side; no clock/Cron activated.
13. ✅ Implement A5 filing-vintage + B2 derived-industry-snapshot observers, independent TWSE trading-calendar gate, V0.2 daily evidence bundle/readiness contracts, and isolated read-only scheduled research collection.
14. ⏳ Accumulate same-day V0.2 evidence on independent official trading dates. Artifact aggregation/coverage audit is now automated read-only with deterministic anti-cherry-picking selection. 10 complete dates may reach PROVISIONAL_ELIGIBLE; 20 complete precise dates may reach FREEZE_ELIGIBLE. No retrospective substitution.
15. ⏳ After evidence gates pass, propose the first exact after-close Decision Clock（決策時間點） for explicit owner review. System2 Worker Cron activation remains a separate later explicit owner gate.\n16. ✅ Implement SELECTED-compatible full-market accounting + Prediction Snapshot V0.1 archive projection — PR #221.\n17. ✅ Implement A1 per-symbol daily snapshot adapter and decision outcome tracker V0.1 — PR #222 / #223.\n18. ✅ Repository-side A1 historical-window/factor adapter + limited daily Shadow orchestrator foundation implemented and CI-verified (PR #228/#230). Historical source population and physical D1 execution remain separate next steps.\n19. ⏳ Minimum execution simulator and monotonic outcome persistence are implemented in PR #227; connect automatic future-session/benchmark/industry/corporate-action collection and scheduled invocation without conflating signal returns with fills.\n20. ⏳ Prepare initial final-selection policy candidates/evidence for explicit owner approval; do not enable SELECTED generation before that gate.
21. 🟡 CORE P0/P1 BACKTEST ENGINE（核心回測工程） foundation implemented on main: Historical Store + PIT Replay（時點重播） + partitioned Bulk Backtest Runner（大量回測執行器） + checkpoint/resume + Historical Base Dataset（歷史基礎研究樣本庫） + limited daily Shadow orchestrator are CI-verified. Remaining P0 is official historical source population, physical isolated-D1 backfill execution, first real full-market replay, outcome attachment, and later owner-authorized SELECTED policy.
    - P0: Historical Data Store（歷史資料庫）, bulk/partitioned runner（大量分批執行器）, PIT Replay（時點重播）, checkpoint/resume（斷點續跑）, reusable factor cache（因子快取）, full-universe accounting, versioned strategy/policy replay, Base Dataset（基礎研究樣本庫） generation and D1/D3/D5/D10/D20 + MFE/MAE outcome linkage.
    - P0 must support whole eligible Taiwan-equity universes across multi-year windows through batch/stream execution; it must not be architected around manual per-symbol runs.
    - Historical replay is research evidence, not prospective Shadow evidence. It must preserve survivorship/delisting/listing-date boundaries, corporate-action state, source availableAt/firstKnownAt and PIT UNKNOWN semantics; no retrospective data may be relabeled as prospective Shadow.
    - P1: reusable condition-comparison API, parameter sweeps, Regime/industry/year stratification, execution-cost comparison, strategy-version A/B comparison, research-facing query/report surfaces and optional UI comparable to an XQ-style interval/condition backtest workflow.
    - Fugle may be used contract-by-contract for data gaps or intraday needs, but bulk historical replay should preferentially reuse official/history stores and cached normalized data so repeated research does not consume live API quota unnecessarily.

## 2026-09-28 ordered 1→6 implementation verification

Owner authorized the six-step build order: A1 Historical Window（歷史視窗） → Historical Store（歷史資料庫） → PIT Replay（時點重播） → Bulk Backtest Runner（大量回測執行器） → Historical Base Dataset（歷史基礎研究樣本庫） → Daily Shadow Orchestrator（每日影子編排器）.

Repository readback confirms:
- PR #228 / main `1a3f98750e811bf548a25216f24fbc16e813b70b`: Historical Store + PIT Replay foundation; System2 Research CI `36403535050` PASS; V8 Regression `36403535032` PASS.
- PR #229 / main `446f67b4198474d93f6023c88d2f05488123c2fe`: partitioned Bulk Backtest Runner + checkpoint/resume + Historical Base Dataset; System2 Research CI `36404951784` PASS; V8 Regression `36404951801` PASS.
- PR #230 / main `c442442edea9601fe6f959977b800beba87b04c3`: daily limited Shadow orchestrator V0.1; System2 Research CI `36405406419` PASS. Final selection remains disabled.
- Incremental Historical Backfill Coordinator V0.1 added in `720af100115dd8aeb8450cc766d9094b99e0408a`; CI PASS. Dedicated test added in `fbbaa008c1626d4dd78b0475bb9591e190137000`; System2 Research CI `36415120193` PASS.
- Backfill semantics now explicitly support an initial Core Base from 2017-01-01 and incremental continuation from the day after each market's last stored date. The fixture proves lastStoredDate=2026-09-24 produces effectiveStart=2026-09-25 rather than a full reload.
- No real historical market data has yet been bulk-populated into isolated System2 D1 by this step; current historical/backtest tests are synthetic fixtures. Do not describe the 2017→present Base Dataset as populated until physical source ingestion/readback is verified.
- Nearest engineering action: freeze source-specific official TWSE/TPEx historical fetch adapters, execute isolated incremental backfill, verify row/date/symbol coverage and PIT/continuity states, then run the first real full-market historical replay.

## 2026-09-28 official historical A1 physical-ingest verification

System 2 historical engineering has crossed from synthetic-only tests into real official-source + isolated-D1 validation.

Official source validation:
- accepted TWSE historical source: `MI_INDEX?response=json&date=YYYYMMDD&type=ALLBUT0999`;
- accepted TPEx historical source: `afterTrading/dailyQuotes?response=json&date=YYYY/MM/DD`;
- legacy TPEx `stk_quote_result.php?d=...` is rejected because live testing showed it can ignore the requested historical date and return the latest date;
- read-only source smoke run `36417360621` PASS with exact source-date matching:
  - 2017-01-03 TWSE 898 ordinary four-digit equities;
  - 2017-01-03 TPEx 729;
  - 2026-09-24 TWSE 1,085;
  - 2026-09-24 TPEx 890.

Physical isolated-D1 verification:
- cloud read-only audit `36418324013` found `system2-research` at schema 0.5 with 26 tables before historical migration; no historical/backtest tables existed yet.
- guarded physical smoke `36418811303` upgraded only isolated `system2-research` to schema 0.7 and persisted 2017-01-03 official A1 data:
  - TWSE 898 + TPEx 729 = 1,627 historical bars;
  - all bars accounted;
  - completion receipts written last;
  - ambiguous canonical revisions = 0;
  - observed D1 usage: 8,140 rows read, 9,770 rows written, database size_after ≈ 2.02 MiB;
  - System1 production database/runtime/Cron unchanged.
- first 2026-09-24 attempt encountered a transient upstream TLS/socket termination after the TWSE side had completed. This was diagnosed as transport failure, not quota/schema/content failure.
- source adapter was hardened with bounded retry/backoff for transport/retryable HTTP errors; source-date/schema/OHLC integrity failures remain non-retryable.
- retry run resumed from durable completion state: TWSE 1,085 was `ALREADY_COMPLETE`, only TPEx 890 was added, and final 2026-09-24 coverage became TWSE 1,085 + TPEx 890 with zero ambiguous canonical revisions.
- after the two measured dates, D1 `size_after` was ≈ 3.91 MiB. The retry segment observed 12,050 rows read / 5,344 rows written while inserting only the missing TPEx side.
- this validates incremental/resumable physical ingestion, but also demonstrates that row-wise D1 storage/write amplification is material.

Current scale constraint:
- Cloudflare's current published Workers Free D1 limits are 500 MB per database and 100,000 rows written/day; Workers Paid allows 10 GB per database and materially higher included writes.
- therefore **do not launch the full 2017→present row-wise D1 backfill blindly** until the historical raw-storage mode is frozen. Engineering should evaluate a packed/cold historical representation (or another isolated historical store) while keeping D1 for indexes, receipts, recent windows, Base Dataset and Shadow results as appropriate.
- this is a storage-scale engineering gate, not a strategy/formal-selection gate. No final SELECTED policy, Decision Clock, Worker Cron or real trading behavior was changed.

## 2026-09-28 official historical source adapter progress

- Added `system2/runtime/official_monthly_history_adapter_v0_1.mjs` in commit `358d16e3d247d1fc96073350ecee3cfabb7dad75`.
- Added fixture/normalization tests in commit `ed11cf3c362115c5fb7dfddfd767e8d674c365e0`; System2 Research CI run `36422600827` PASS.
- TWSE monthly per-security source contract uses the official TWSE STOCK_DAY monthly query host and normalizes date / volume / turnover / OHLC / change / transactions.
- TPEx monthly per-security source contract uses the official TPEx historical individual-stock monthly query host and normalizes ROC dates to Gregorian dates.
- The adapter is source-format only; it does not itself authorize historical availability semantics beyond the configured conservative session-close basis.
- Official-source research confirms TWSE/TPEx historical individual-stock pages cover the 2017 Core Base horizon.
- Survivorship control is now explicit: historical backfill must seed from both currently listed securities and delisted/de-TPEx securities, not from today's live symbol list alone. TWSE/TPEx official delisting registries are available; TWSE current ISIN registry exposes listing dates.
- Next implementation unit: historical universe registry/adapters (current + delisted union), then source-backed backfill smoke against a bounded date/symbol slice before large D1 population.

## 2026-09-28 packed historical cold-store verification

The row-wise historical D1 scale gate has been addressed with a packed cold-history research path.

Implemented:
- schema V0.9 migration `system2/sql/0005_historical_packs.sql` with yearly per-symbol A1 packs and pack-ingest receipts;
- `system2/runtime/historical_pack_store_v0_1.mjs` for immutable pack persistence, idempotent reruns, conflict rejection and date-range unpack/query;
- remote D1 adapter `run()` support required by the pack persistence path;
- isolated D1 provision upgraded to schema 0.9 with 35 System2 tables and read/write sentinel verification;
- existing bounded/physical historical smoke scripts aligned to schema 0.9 without changing System1/V8 production resources.

Real-source pack smoke:
- workflow: `System2 Historical Pack Real-Source Smoke`, run `36427386634`, PASS;
- source period: 2026-08-03 through 2026-08-31, 21 official trading dates;
- bounded symbols: TWSE 2330/2454; TPEx 3105/6488;
- official full-market rows read before symbol filtering: TWSE 22,810; TPEx 18,646;
- packed round-trip rows: 42 TWSE + 42 TPEx;
- TWSE payload 3,909 JSON bytes -> 1,587 gzip bytes -> 2,116 Base64 bytes (gzip ratio 0.4060; Base64/storage ratio 0.5413);
- TPEx payload 3,825 JSON bytes -> 1,606 gzip bytes -> 2,144 Base64 bytes (gzip ratio 0.4199; Base64/storage ratio 0.5605);
- all four packs inserted and unpacked back to identical date/OHLC/volume/value/transaction/change rows with PIT eligibility preserved;
- D1 metrics for the smoke: 18 requests, 8 rows read, 30 rows written including provisioning/sentinels/receipts, size_after 4,182,016 bytes;
- System1 production isolation check PASS; V8 Regression run `36427386650` PASS; System2 Research CI for the smoke script `36427356631` PASS.

Interpretation:
- packed yearly-per-symbol storage is materially more space/write efficient than one D1 row per stock-day;
- the bounded four-symbol month proves correctness but is not sufficient by itself to authorize a ten-year bulk load;
- a read-only full-market month compression benchmark is the next scale test. Full 2017→present backfill remains intentionally not started until that benchmark bounds projected storage.

## 2026-09-28 full-market pack scale benchmark

Read-only full-market compression benchmark is complete and PASS.

- workflow: `System2 Historical Pack Full-Market Benchmark`;
- corrected run head `432f590e0f0df308dd9f1852609e22e98e905bfd`; benchmark job PASS;
- period: 2026-08-03 through 2026-08-31, 21 official trading dates;
- TWSE: 22,810 stock-day rows, average 1,086.19 ordinary equities/day;
- TPEx: 18,646 stock-day rows, average 887.90 ordinary equities/day;
- combined: 41,456 bars -> 1,977 market+symbol+year packs;
- canonical JSON: 3,587,823 bytes;
- gzip: 1,389,468 bytes (ratio 0.3873);
- Base64 storage payload: 1,855,256 bytes (ratio 0.5171);
- per-bar observed payload: JSON 86.55 bytes / gzip 33.52 bytes / Base64 44.75 bytes;
- conservative 4.7M-bar projection: gzip ≈150.2 MiB, Base64 payload ≈200.6 MiB before SQLite/index/receipt overhead;
- month-sized packs overstate fixed pack overhead relative to full-year packs, so the full-year representation is expected to compress at least as well, subject to direct yearly verification;
- benchmark performed no D1 writes and no System1 mutation; isolation PASS.

Scale decision:
- row-wise multi-million-bar D1 storage remains rejected for the historical cold archive;
- yearly per-symbol packed storage is promoted from bounded experiment to the preferred P0 historical cold-store representation;
- full 2017→present ingestion must still be staged by year with durable completion receipts and coverage checks, not executed as one unbounded job;
- first production-scale research backfill unit is calendar year 2017, executed in isolated System2 infrastructure only. This is historical research storage, not strategy/final-selection authorization.

## 2026-09-28 external cold-object storage V1.0 implementation

The accepted packed-history design is now implemented as an external object-store path rather than continuing to place Base64 payloads in D1.

Repository implementation:
- migration `system2/sql/0006_historical_cold_store.sql` advances the isolated System2 schema to V1.0 and adds D1-only manifests, resumable checkpoints, immutable completion receipts and historical-universe registry receipts;
- yearly per-symbol `.json.gz` bytes use deterministic content-addressed R2 keys and separate payload SHA-256 / compressed-object SHA-256 verification;
- object write is create-only; identical reruns reuse the object/manifest, while a differing object, manifest, checkpoint, receipt or universe membership fails closed as `IMMUTABLE_CONFLICT`;
- object commit precedes D1 manifest commit; a failure between the two leaves at most an orphan object, and retry safely reuses it before writing the manifest;
- final receipt is written only after all expected objects and manifests are accounted for; chunk checkpoints make partial annual runs resumable; a completed-receipt fast path recomputes its manifest rolling hash and verifies every referenced R2 object before accepting `ALREADY_COMPLETE`;
- old V0.9 inline D1 packs remain read-compatible for bounded smoke evidence, but the annual backfill script no longer calls the inline bulk-persistence path;
- unpack now produces deterministic `barHash`, keeps the true backfill capture time as `observedAt`, retains conservative per-session `availableAt`, and restores source provenance;
- the cold loader is directly usable by PIT Replay and the partitioned Bulk Backtest Runner;
- the backtest loader reads only the requested historical registry ID and exposes active membership fields without future delisting dates, preserving survivorship control;
- historical-universe registry persistence is immutable, rerun-safe and receipt-last.

Safety/operations:
- the 2017 workflow is now `workflow_dispatch` only, not push-triggered;
- it targets isolated `system2-research` plus an isolated R2 bucket and requires separate least-privilege R2 object credentials;
- repository tests cover object/manifest/receipt immutability, retry with a later capture timestamp, object corruption, PIT replay, Bulk Backtest integration, registry persistence, AWS SigV4 R2 access and workflow isolation;
- System1 `Worker.js`, root `wrangler.toml`, Formal Core, SELECTED policy, Decision Clock, Worker Cron and trading behavior are unchanged.
- PR #245 validation evidence: System2 Research CI run `36434552698` PASS, V8 Regression run `36434552278` PASS, and bounded official-source packed readback run `36434541564` PASS against isolated `system2-research` schema V1.0.
- An earlier PR smoke run `36434206488` correctly failed closed when default source-row enrichment changed an already frozen V0.9 payload hash. The fix makes provenance enrichment explicit only for the new external-cold annual path; the bounded legacy rerun then passed without rewriting existing packs.

Superseded inline-backfill evidence:
- GitHub runs `36429244651` and `36429895255` applied schema V0.9 successfully but both TWSE and TPEx jobs failed in the inline annual backfill step before completion;
- no annual completion receipt from those runs is accepted as evidence, and the automatic inline-D1 workflow has been replaced by the manual-only external cold-object path rather than retried blindly.

Physical status:
- GitHub run `36434206278` applied/reverified isolated `system2-research` schema V1.0 with 39 tables, write/read verification PASS and production-database/runtime isolation PASS;
- no isolated R2 bucket/credential readback is yet recorded;
- therefore the 2017→present external cold backfill and first real full-market replay remain not started on this new path;
- exact next action is isolated R2 provisioning/credential setup, bounded object+manifest smoke, then 2017 TWSE/TPEx annual backfill and coverage/readback verification.

## 2026-09-29 R2 physical smoke qualification

The external cold-object path is now physically qualified against the isolated R2 bucket `system2-historical-research`.

- owner provisioned the private Standard-class bucket and least-privilege account object read/write credentials, stored only in the GitHub `system2-research` environment;
- PR #246 merged to main as `3623241fc5c2578360bb75c96f047b4fce56ebc9`;
- bounded R2 physical smoke run `36488764511` PASS using official 2026-09-24 data:
  - TWSE 2330: 353-byte gzip object, source-date evidence exact, object SHA-256 readback PASS, unpack PASS, create-only rerun guard PASS;
  - TPEx 6488: 358-byte gzip object, source-date evidence exact, object SHA-256 readback PASS, unpack PASS, create-only rerun guard PASS;
  - D1 annual manifest writes = 0; full backfill = false; System1 runtime unchanged;
- the first physical attempt correctly exposed an HTTP object-metadata bug: storing gzip bytes with `Content-Encoding: gzip` caused Node/undici to transparently decompress GET responses before byte-level SHA verification;
- fixed semantics now store `.json.gz` as opaque `application/gzip` bytes without default `Content-Encoding`; both remote S3 adapter and Worker R2 binding adapter use the same exact-byte policy;
- latest PR head `473e12ac38718a9db6122d1359a1371694539c0b` passed System2 Research CI run `36488965872` and V8 Regression run `36488965742`;
- the two tiny smoke objects live only under `smoke/r2-physical-v0.2/` and cannot collide with annual production research keys under `a1/v0.1/`.

R2 provisioning/readback is no longer a blocker. The exact next P0 action is the manual-only 2017 TWSE annual external-cold backfill, followed by coverage/hash/manifest/receipt verification; only after TWSE passes should the 2017 TPEx annual backfill run.

## 2026-09-29 first 2017 TWSE annual backfill attempt + calendar-source repair

The first manual-only 2017 TWSE external-cold annual backfill was launched and failed closed before any annual market-data ingest.

Evidence:
- workflow run `36545375167`, event `workflow_dispatch`, market `TWSE`, year `2017`;
- isolated D1 migration job PASS;
- annual backfill job failed while resolving the historical trading calendar, before the daily A1 range or annual R2 pack write path began;
- failure: both Gregorian and ROC `holidaySchedule?queryYear=...` requests returned payloads whose year did not match 2017, so the strict parser rejected them rather than relabeling current-year data as historical evidence.

Root cause and official-source revalidation:
- the live TWSE holidaySchedule endpoint currently ignores historical `queryYear` values and returns the current-year schedule;
- the TWSE official `FMTQIK` monthly market report remains historically queryable and directly enumerates actual market-session dates for a requested historical month;
- 2017-01 was externally revalidated against the live official endpoint: the payload reports `date=20170101`, title `106年01月市場成交資訊`, and exact January session rows beginning 2017-01-03.

Repair:
- PR #250 merged as `26764ed3c6950b96d4ab43132b57b5808423a27c`;
- historical calendar resolution keeps strict holidaySchedule year validation, then falls back to 12 official TWSE FMTQIK monthly reports for historical years when holidaySchedule is unusable;
- FMTQIK payload month/year must exactly match the requested month, dates cannot escape the month, duplicate session dates fail closed, and transient transport failures retry without converting integrity errors into success;
- exact `tradingDates` are used directly when available, preserving any official exceptional sessions rather than reconstructing sessions from generic weekday assumptions;
- backfill provenance now records the actual calendar source;
- PR head `b0f56f077fd54f1aacb8414515531b6202384215` passed System2 Research CI run `36546387616` and V8 Regression run `36546387647`.

No 2017 annual completion receipt is claimed from the failed run. The next action remains a manual TWSE-only rerun from current main. TPEx must not start until the repaired TWSE annual backfill completes and its object hashes, D1 manifests, completion receipt and coverage are verified.

## Current boundary

Research/design/code prototype is not blocked. Isolated D1 and inert Worker already exist, but prospective always-on Shadow accumulation remains intentionally inactive. A5/B2 observer engineering is complete; the immediate boundary is accumulation of independent same-day V0.2 evidence beginning no earlier than the 2026-09-29 official session. No exact Decision Clock is frozen; capture is false; Worker Cron is 0. The GitHub Actions research schedule is read-only evidence collection and is not the Worker Cron. No production-shared storage or System 1/V8 change is authorized or needed.


## 2026-09-29 bounded daily resonance monitor V0.1

Owner-requested System 2 intraday monitoring research module is implemented and merged through PR #252 as main commit `9b1cdfea376f322a1777bd25afe1034439a6b1f5`.

Frozen V0.1 scope:
- intraday monitoring is **bounded/preselected only**; it does not scan the full Taiwan market;
- monitor active-cap is 9 unique symbols, matching the requested 3+3+3 set; this is narrower than the existing 12-symbol global System 2 candidate/watch capacity;
- the monitored trend/momentum timeframe is **daily K**;
- EMA16 / EMA64 are daily-K calculations;
- Impulse MACD uses the internal research formula contract documented in `SYSTEM2_DAILY_RESONANCE_MONITOR_V0_1.md`;
- the still-open current daily bar can produce a **PROVISIONAL** 3/3 resonance; it is not relabeled CONFIRMED unless the current-date daily bar is FINAL after the official close and all three conditions still hold;
- missing current-date daily bar blocks the current-date monitor instead of silently reusing the prior day's state;
- 15-minute K is auxiliary execution/timing context only and cannot change the daily resonance state;
- the three EMA/price/Impulse conditions remain one correlated price-derived family state, not three independent factor-family votes;
- chart-ready series now includes daily OHLCV, EMA16, EMA64, Impulse MD/signal/histogram, cross states, condition counts and visual/display signals;
- current module is research/shadow only: `decisionImpact=false`, `notificationImpact=false`, `orderImpact=false`, `fullMarketScan=false`;
- no Worker Cron, live push, live quote adapter, persistence, order routing or System 1/V8 Formal logic was enabled or modified.

Verification:
- System2 Research CI run `36573657584` PASS on final PR head;
- V8 Regression run `36573657588` PASS;
- PR #252 merged with System 1/V8 isolation preserved.

Next integration unit for this monitor:
1. isolated live-market adapter/current-day daily-OHLC aggregator for only the bounded selected symbols;
2. persistent signal-episode/dedup semantics so provisional 1/3 -> 2/3 -> 3/3 transitions can be replayed without notification spam;
3. chart/read API surface for K candles + EMA16/64 + Impulse MACD + ENTRY/EXIT markers;
4. Prospective Shadow validation across trend/range/regime/repaint/whipsaw/cost conditions before any live notification authority is armed.

This monitor does not change the separate P0 historical cold-backfill continuation point.


## 2026-09-29 resonance live pipeline V0.1

The next bounded intraday integration unit is now implemented and merged through PR #256 as main commit `f1e84e28451e082b895a4cf99bcf52bb5729c09c`.

Implemented repository-side:
- `system2/runtime/daily_resonance_live_adapter_v0_1.mjs`: normalizes an already-fetched quote snapshot into the current-date daily OHLC bar for at most 9 preselected symbols; no network calls are performed inside the module.
- confirmation firewall requires source `FINAL` + independent official-session-close confirmation + observation at/after 13:30 Asia/Taipei + no semantic/trial/halt/suspension/continuity blocker before a bar can be treated as FINAL.
- no-trade current-date state, unverified quote semantics, trial quotes, halt/suspension and unresolved price continuity fail closed instead of borrowing prior-day state.
- `system2/runtime/daily_resonance_episode_v0_1.mjs`: replayable PROVISIONAL_ACTIVE / CONFIRMED_ACTIVE / RETRACTED / RELEASED episode state with OPEN_PROVISIONAL / OPEN_CONFIRMED / CONFIRM / RETRACT / RELEASE events for future dedup.
- episode state is research-only and explicitly keeps `shouldNotify=false`, `notificationImpact=false` and `orderImpact=false`.
- `system2/runtime/daily_resonance_read_model_v0_1.mjs`: combines adapter quality, daily resonance state, episode state and the existing chart model into a read-only UI/API payload without exposing an HTTP route yet.
- durable design contract: `system2/SYSTEM2_DAILY_RESONANCE_LIVE_PIPELINE_V0_1.md`.

Verification:
- PR #256 System2 Research CI run `36575131274` PASS;
- PR #256 V8 Regression run `36575131256` PASS;
- post-merge System2 Research CI run `36575253408` PASS;
- System 1/V8 Formal Core and production runtime remain unchanged.

Current safety boundary:
- bounded/preselected only; no full-market intraday scan;
- no live market network call inside the new modules;
- no D1 persistence;
- no Worker Cron;
- no live push;
- no order routing;
- 15-minute K remains execution/timing context only and cannot rewrite the daily resonance state.

Exact next continuation for this monitor:
1. freeze a source-specific normalized quote contract using verified field/unit/timestamp semantics;
2. add isolated research-only persistence for resonance episodes/snapshots without enabling capture;
3. add a read-only System 2 API/page consuming the frozen read model;
4. only after prospective Shadow evidence covers repaint, whipsaw, Trend-vs-Range, Regime, costs, MFE/MAE and redundancy may live notification authority be proposed.

This continuation remains independent from the separate historical cold-backfill P0 lane.


## 2026-09-29 Fugle resonance quote source contract V0.1

The first source-specific input contract for the bounded daily resonance monitor is implemented and merged through PR #259 as main commit `b5f14586847c3fa8fa724b78b2f4dbfabfb6f225`.

Implemented:
- `system2/runtime/fugle_resonance_quote_normalizer_v0_1.mjs`: pure Fugle MarketData v1 Quote + Ticker normalizer; performs no HTTP call and stores no secret.
- only regular `EQUITY` ordinary stocks are eligible for semantic certification; Ticker must identify `securityType=01`, `securityStatus=NORMAL`, TWD and a valid board lot.
- current daily OHLC uses Fugle `openPrice/highPrice/lowPrice/closePrice`; trial-capable `lastPrice` is not used as the OHLC close.
- numeric provider times are treated as Unix microseconds, converted independently from local `fetchedAt`, and checked against the requested Asia/Taipei market date and capture order.
- quote/Ticker symbol, date, exchange and market identity are cross-checked.
- cumulative quote volume is promoted to share units only after the candidate `tradeVolume * boardLot` denominator reconciles `tradeValue / shares` with the provider `avgPrice`; otherwise the normalized semantic contract is not certified.
- `isClose` supplies only provider finality. Downstream confirmation still requires independent official-session-close confirmation at/after 13:30 Asia/Taipei.
- delayed close and temporary price-limit matching interruption are now explicit downstream blockers in `daily_resonance_live_adapter_v0_1.mjs`.

Official documentation anchors used:
- Fugle Intraday Quote: `https://developer.fugle.tw/docs/data/http-api/intraday/quote/`
- Fugle Intraday Ticker: `https://developer.fugle.tw/docs/data/http-api/intraday/ticker/`
- Fugle Intraday Candles: `https://developer.fugle.tw/docs/data/http-api/intraday/candles/`
- Fugle Intraday Trades: `https://developer.fugle.tw/docs/data/http-api/intraday/trades/`

Verification:
- PR #259 System2 Research CI run `36577069527` PASS;
- PR #259 V8 Regression run `36577069814` PASS;
- post-merge System2 Research CI run `36577213150` PASS;
- System 1 / V8 Formal Core and production runtime remain unchanged.

Current safety boundary remains:
- bounded/preselected monitor only, max 9 unique active symbols;
- no full-market intraday scanner;
- no live fetch loop in the new source normalizer;
- no D1 persistence;
- no Worker Cron;
- no live notification;
- no order routing;
- 15-minute K remains execution/timing context only.

Exact next continuation:
1. add isolated research-only persistence for resonance snapshots/episodes/source receipts under additive `s2_` tables;
2. add a read-only System 2 API/page that consumes the frozen read model;
3. keep capture unarmed while prospective Shadow evidence is accumulated;
4. only after repaint/whipsaw/Trend-vs-Range/Regime/cost/MFE-MAE/redundancy gates pass may notification authority be proposed.

The historical cold-backfill P0 lane remains separate and unchanged.

## 2026-09-29 Daily Resonance global integration V0.1

The 00.1 global control room has implemented the owner-authorized bounded Daily Resonance integration from current main. Repository implementation is complete; physical post-merge deployment evidence is not yet claimed in this checkpoint entry.

Implemented:
- additive isolated D1 migration `0007_daily_resonance_integration.sql`, advancing expected schema to V1.1 with seven resonance tables;
- next-session pool activation from immutable `s2_capacity_runs.active_assignments_json`, deduplicated to max 9 unique symbols and max 3 per strategy, with zero-pick/fail-closed behavior and no full-market scan;
- live Fugle Ticker + adjusted daily-history session cache, continuity verification and per-cycle Intraday Quote refresh;
- reuse of the frozen daily EMA16 / EMA64 / Impulse MACD monitor, live-adapter confirmation firewall, episode state machine, chart and read-model modules;
- WATCH/HOLD lifecycle resolution from isolated System 2 simulated positions, preserving existing BUY_RESONANCE and EXIT_RESONANCE semantics without changing the resonance formula;
- D1 run/snapshot/latest/episode/event history with episode dedup;
- read-only `/api/system2/resonance`, pool and per-symbol routes plus the auto-refreshing `/resonance` UI;
- isolated Worker Cron configuration for 5-minute bounded monitoring and 19:00 pool refresh; runtime-local filters enforce 08:55–13:40 Asia/Taipei and the independent 13:30 close gate;
- guarded main-branch deployment workflow with D1 migration, secret presence checks, schedule/API/UI readback and System 1 boundary checks.
- all repository workflows that mutate isolated System 2 D1 share the `system2-isolated-d1-writer` concurrency group, preventing overlapping full migration replays from temporarily exposing an older schema-version marker.

Safety boundary:
- general System 2 selection capture remains false;
- notification and order impact remain false;
- live push remains a later owner gate;
- final selection policy is not invented or enabled;
- an absent upstream capacity receipt produces `NO_ACTIVE_PRESELECTED_POOL` rather than a fabricated watchlist;
- 15-minute K remains execution/timing only;
- System 1/V8 production files and Formal Core are unchanged.

Verification at this repository stage:
- 92 System 2 tests pass locally;
- four unrelated Decision Clock packaging tests require the Linux `zip` executable absent on the Windows host and are delegated to GitHub CI;
- all System 2 runtime/deploy/script modules pass syntax checks;
- System 1 `Worker.js` and root `wrangler.toml` have no working-tree diff.

Exact next continuation:
1. merge only after System2 Research CI and V8 Regression pass;
2. apply isolated D1 V1.1 and deploy the bounded Worker/Cron through the guarded workflow;
3. record physical health/API/UI/schedule readback and actual active-pool state;
4. accumulate prospective resonance evidence before proposing live notification or any strategy/capital promotion.

## 2026-09-30 Daily Resonance physical deployment complete

The owner-authorized bounded Daily Resonance integration is now physically deployed and verified.

Evidence:
- PR #278 / main `7e51190bdf0e51d55917c091462068a90724f211`: read-only Cloudflare Cron inventory.
- Inventory run `36646278083` PASS found exactly four pre-existing Cron triggers, all on System 1 `fugle-test`; none were changed or removed.
- PR #279 / main `6d6b4d5aafff55179397187fa69acefed428cd6e`: consolidated System 2 Daily Resonance to one Cloudflare trigger so the Free-plan fifth slot is sufficient.
- PR #279 System2 Research CI `36646479007` PASS.
- PR #279 V8 Regression `36646479081` PASS.
- Deployment run `36646552183` PASS end-to-end.
- D1 schema V1.1: 46 System 2 tables; physical write/read verification PASS.
- Worker: `system2-shadow-research`.
- Active System 2 Cron: `*/5 0-5,11 * * 1-5`; runtime admits 08:55–13:40 Asia/Taipei monitoring and exactly 19:00 pool refresh.
- `FUGLE_API_KEY` is bound as a Worker secret; live health readback reports `fugleQuoteConfigured=true`.
- Health/read API/UI readback PASS; `system1RuntimeUsed=false`.
- Immediate pool readback for 2026-09-30 is `NO_ACTIVE_PRESELECTED_POOL`, which is fail-closed. The runtime does not invent symbols or scan the full market.
- System 1 `Worker.js` / root `wrangler.toml` remained unchanged.

Current boundary:
- Daily Resonance schedule + Worker + D1 + Fugle live source binding + read API/UI are ACTIVE for the bounded research/shadow lane.
- General System 2 selection capture remains disabled.
- Live push remains disabled.
- Real order routing remains prohibited.
- Formal strategy/capital authority remains gated by PIT/OOS/Prospective Shadow/Trend-vs-Range/Regime/repaint/whipsaw/cost/MFE-MAE/redundancy evidence.
- The next runtime evidence point is the first real 19:00 pool refresh followed by an eligible next-session intraday cycle using an actual frozen upstream capacity receipt.

## 2026-10-02 Daily Resonance V0.1.1 source-freshness / operations checkpoint

The global System 2 controller completed and physically deployed the next bounded Daily Resonance integrity tranche.

Formal evidence:
- PR #295, main commit `03b9dd824d1efa85eee86b04ee68171563e9e523`;
- final-head System2 Research CI `36930742222` PASS;
- final-head V8 Regression `36930742371` PASS;
- post-merge deployment `36930843423` PASS, including physical D1 V1.1/46 tables, the existing one Cron, Fugle Worker Secret, public health/API/UI and System 1 files unchanged;
- live operations readback early on 2026-10-02: `UPSTREAM_CAPACITY_RECEIPT_MISSING`, `upstreamCapacity=null`, `latestPool=null`, `lastPoolRefresh=null`, `activeSymbolCount=0`.

Implemented:
- same-market-date and capture/decision-time freshness gate at each 19:00 capacity read;
- idempotent D1 run receipt for active, zero-pick or absent-capacity refresh, without a new table/migration/Cron;
- latest-prior-refresh anchoring for intraday pool lookup so an empty refresh invalidates older stock lists;
- read-only `/api/system2/resonance/operations`, showing actual upstream and schedule diagnostics directly on the UI.

Do not misclassify this deployment as a live populated strategy/monitor success. The **proven next block** is the upstream PIT-qualified, pre-registered System 2 daily Shadow source -> factor/strategy -> ordering/capacity -> immutable `s2_capacity_runs` path. Preserve `SYSTEM2_CAPTURE_ENABLED=false` and existing final-selection/policy owner gates until their required evidence and approval exist. The first post-deployment new-format 19:00 audit and subsequent genuine bounded intraday cycle are next prospective observations. System 1/V8 Formal Core and its four Cron triggers remain unchanged.

## 2026-10-02 System 2 build-map update — paired resonance Challenger lane

Owner requested the alternate System 2 resonance logic be explicitly included in the engineering roadmap with comparable records rather than remaining an informal chat idea.

Canonical map: `system2/SYSTEM2_BUILD_PROGRESS_MAP.md`.

Registered lane:
- deployed Baseline remains `USER_VIDEO_RESONANCE_V0_1` (EMA16 / EMA64 / Impulse MACD, daily 0/3–3/3, PROVISIONAL/CONFIRMED semantics);
- research-only Challenger is registered as `SYSTEM2_RESONANCE_CHALLENGER_V0_1`, initially defined only at the architecture level as Trend + Momentum + Price/Structure Confirmation;
- exact Challenger indicators/parameters must be preregistered before prospective capture and versioned thereafter;
- comparison must be same pool / same timestamps / same source vintage / same bar-finality / same costs / same outcome windows;
- minimum paired evidence includes component states, first trigger, retraction/whipsaw, forward 1/3/5/10/20-day returns, MFE/MAE, cost-adjusted outcome, Regime and relative timing/disagreement;
- Challenger starts Shadow-only and cannot replace, veto or tighten the owner Baseline without PIT/OOS/Forward, Regime, repaint/whipsaw, cost, redundancy/incremental-value, overfit controls and explicit owner approval.

Engineering order remains: first close the upstream Daily Shadow Orchestrator / `s2_capacity_runs` gap; then attach the paired Challenger capture to the exact same truthful bounded pool. No System 1/V8 Formal change, live push, order routing or capital authority is authorized by this roadmap registration.

## 2026-10-02 S2-07 daily Shadow capacity orchestration V0.1

Implemented on the current System 2 build branch:
- daily strategy orchestrator now exposes immutable ranking handoff inputs after strategy assessment;
- new `daily_shadow_capacity_orchestrator_v0_1.mjs` validates same-date/same-clock completed Limited Shadow runs;
- creates strategy-local RANK-01 GLOBAL_ADMISSION and ACTIVE_INTRADAY_MONITOR receipts without numeric strategy weights;
- revalidates prior pool memberships daily;
- retains INCOMPLETE prior memberships without active monitoring rather than treating UNKNOWN as bearish;
- removes INVALIDATED memberships and honors explicit universe exclusions;
- treats a missing prior-membership revalidation as a fail-closed blocker;
- admits only current VALID + BUY_ELIGIBLE + RANK-01-rankable new memberships in V0.1;
- enforces owner-approved global max 12 / per-strategy active max 3 / no forced fill / overlap dedupe;
- unresolved scarcity without a global cross-strategy priority policy produces no `s2_capacity_runs` receipt;
- safe zero-pick runs do create an immutable capacity receipt;
- returns an isolated persistence batch for `s2_strategy_ordering_receipts` and, when resolvable, `s2_capacity_runs`.

Still not activated: source fetch, daily schedule, D1 execution, final selection, push, capital or order routing. Exact next dependency is real PIT-safe source + assessor wiring into this repository-complete middle layer, followed by isolated D1 execution and physical readback.

## 2026-10-02 S2-07 input preflight V0.1

Repository implementation added the next upstream layer without creating strategy thresholds:
- `daily_shadow_a1_source_v0_1.mjs`: read-only official TWSE/TPEx same-day A1 adapter using the existing snapshot contract;
- `daily_shadow_history_reader_v0_1.mjs`: isolated D1 prior-history reader + current-universe PIT-history/continuity coverage probe;
- `daily_shadow_assessor_readiness_v0_1.mjs`: explicit fail-closed registry; SHORT_MOMENTUM and SWING_GROWTH remain `ASSESSOR_POLICY_NOT_FROZEN`;
- `daily_shadow_input_preflight_v0_1.mjs`: separates source/history blockers from assessor-policy blockers and forbids a fake zero-pick classification when assessor authority is absent;
- read-only physical preflight script/workflow uses only public official GET sources and isolated `system2-research` D1 reads.

Current policy boundary: the system may measure whether data are ready, but it may not invent MA/volume/fundamental thresholds to emit SUPPORTIVE/ADVERSE or BUY_ELIGIBLE. Physical source/history readback is the next evidence point; any real daily `s2_capacity_runs` write remains blocked until an assessor policy is preregistered/authorized and isolated D1 write wiring is separately verified.

## 2026-10-02 S2-07 immutable daily diagnostic wiring V0.1

The authorized source/history/factor-observation portion is now wired to an isolated daily diagnostic writer and public read API. See `system2/SYSTEM2_DAILY_SHADOW_DIAGNOSTIC_V0_1.md` for the complete contract and acceptance state.

- Official calendar and current A1 sources -> PIT-history coverage -> existing unweighted factor primitives -> immutable source/diagnostic shards -> completion marker last -> exact D1 readback.
- Existing isolated schema V1.1/46 tables; no migration. GitHub daily diagnostic observation at 18:35 Taipei, using existing isolated writer concurrency. No additional Cloudflare Cron.
- `ASSESSOR_POLICY_NOT_FROZEN` remains authoritative. UNKNOWN regime/families are not scored, and diagnostic runs do not create frozen strategy decisions, prediction snapshots or capacity. `zeroPickDay`, `selectedCount` and `capacityRunId` stay null.
- Read-only `/api/system2/shadow/diagnostic` distinguishes no completed invocation from completed but blocked input/policy diagnostics. The 19:00 resonance path still requires real authorized `s2_capacity_runs`; diagnostics cannot populate its pool.
- General capture/final selection/push/capital/orders remain disabled; System1/V8 and Baseline/Challenger formulas remain unchanged.

Repository targeted tests PASS. Physical post-merge writer/deployment readback is pending and must be recorded from actual Actions/API evidence. Local 13:53 Taipei official source observation returned HTTP 200 with 2026-10-01 data, zero target-date rows: INPUTS_NOT_READY, not zero-pick. Today's 19:00 new-format audit has not occurred.

Exact continuation: physically verify the daily diagnostic writer/read API; preregister/authorize assessor policies and validated regime/fundamental/industry/current-continuity inputs before connecting authorized strategy evaluations/ranking/immutable capacity persistence. Do not invent policy to fill the pool.

## 2026-10-02 S2-07 daily diagnostic physical acceptance

PR #303 merged as `632f1f47a189c7c5f6d51b21b847bb1abf7935c6`.

- Final PR head `800458338e01d22d579fea7c224b6f8c8db5dcf8`: System2 Research CI `36971394695` PASS; V8 Regression `36971394765` PASS.
- Main System2 Research CI `36971466568` PASS; main V8 Regression `36971466579` PASS.
- Isolated daily diagnostic writer `36971466598` PASS. Actual receipt: `S2-DAILY-DIAGNOSTIC:2026-10-02:36971466598:1`, observed clock `2026-10-02T06:00:28.662Z` (14:00:28 Taipei), state `INPUTS_NOT_READY`, exact immutable D1 readback verified. Source-session hash `3192c5bd2203c77610aae6f7fd0348dc762441a1e9b38eb7a26baf2c3c46eb86`; completion manifest contains one verified source/history metadata shard. Cloudflare reports 11 requests / 23,727 rows read / 12 rows written (includes index accounting; not 12 logical diagnostic records).
- Existing read-only preflight `36971466557` PASS; no source/history readiness promotion is claimed.
- Isolated Worker deployment `36971466584` PASS, including V1.1/46 tables, unchanged single System2 Cron, configured Fugle secret, public API/UI/schedule checks and unchanged System1 production files.
- Physical GET `/api/system2/shadow/diagnostic?marketDate=2026-10-02` returned HTTP 200, the exact writer run/revision above, `INPUTS_NOT_READY`, `capacityRunId=null`, `zeroPickDay=null`, and both assessors `ASSESSOR_POLICY_NOT_FROZEN`.
- Physical dated read for 2026-10-01 returned `DIAGNOSTIC_NOT_YET_OBSERVED`, not a fabricated historical run.
- Physical `/health`: `schemaVersion=1.1`, `captureState=CAPTURE_DISABLED`. Resonance operations remain `UPSTREAM_CAPACITY_RECEIPT_MISSING`, `upstreamCapacity=null`, `activeSymbolCount=0`, `lastPoolRefresh=null`.

Physical daily diagnostic persistence/read API are now VERIFIED. The 18:35 scheduled invocation is configured but has not yet occurred at this acceptance. The 2026-10-02 19:00 new-format audit also has not occurred; neither is counted as observed evidence. S2-07 selection-to-capacity remains INCOMPLETE pending authorized assessor mappings, validated regime/fundamental/industry/current-continuity sources and genuine daily evaluations. No diagnostic receipt is relabeled as zero-pick, frozen decision/prediction, or `s2_capacity_runs`.

## 2026-10-02 S2-07 prospective daily history wiring

Class A / isolated System2 research only. The daily diagnostic writer now persists READY same-date TWSE and TPEx observations into existing immutable historical A1 tables, before diagnostic completion. `PROSPECTIVE_OBSERVATION` means `availableAt = first saved observedAt`, classified `OBSERVED_AVAILABLE_UPPER_BOUND`; it is not proof of official publication time. Exact repeated official content reuses its original first-known time and bar identity. Changed source content creates an independent immutable revision; existing history replay ambiguity guards remain active. Both markets are validated before writes and every historical bar is read back before diagnostic completion. Missing/stale inputs do not populate this lane. Continuity remains UNVERIFIED; no schema migration, strategy scores, authority, capacity or zero-pick is introduced.

Targeted tests cover repeat observations, corrections, stale/future first-known clocks, missing source, historical readback loss and absent diagnostic completion. Remote CI and physical readback acceptance are pending for this increment; S2-07 remains incomplete. Assessor policies, validated regime and current continuity remain separate gates. The 2026-10-02 19:00 audit has not yet occurred at implementation time.


## 2026-10-02 prospective-history physical acceptance

PR #307 merged `011cc6b300ac99b350c187e7d7f3a2ca447780e2`. PR System2 CI 36978923523 and V8 Regression 36978923517 PASS; main System2 CI 36980736245 and V8 36980736227 PASS. Main diagnostic writer 36980736267 PASS with exact immutable D1 readback, run `S2-DAILY-DIAGNOSTIC:2026-10-02:36980736267:1`, observation `2026-10-02T07:51:13.036Z`. Actual A1 state SOURCE_ERROR, prospective history SKIPPED_SOURCE_NOT_READY with 0 rows; positive live historical ingest is NOT yet verified. Capacity/zero-pick/selected remain null. Source transport error codes are added to aggregate receipts; writer adds read-only public diagnostic/health/operations verification and readback artifacts. Existing generic Worker receipt reader requires no deployment or schema change. At 15:53 Taipei the 19:00 audit has not occurred. S2-07 remains incomplete with selection authority disabled.


## 2026-10-02 16:00 Taipei public readback VERIFIED

PR #308 merged `b5148bd121a1db1f9061e354afbd5513434be047`. PR System2 CI 36981377643 (rerun after concurrency cancellation) and V8 36981377677 PASS; main System2 CI 36981526267, V8 36981526271 and diagnostic writer 36981526309 PASS. Exact D1 receipt and all three public GETs (diagnostic, health, operations) verified HTTP 200. Run `S2-DAILY-DIAGNOSTIC:2026-10-02:36981526309:1`, actual observation `2026-10-02T08:00:02.600Z`.

TWSE and TPEx both returned HTTP 200 with reported date `1151001` (2026-10-01); raw counts 1380 and 11871 respectively. Today's normalized ordinary count is 0 because stale rows are correctly rejected, not because an assessor produced zero picks. Prospective history `SKIPPED_SOURCE_NOT_READY`; positive live historical ingest remains unverified. Operations `UPSTREAM_CAPACITY_RECEIPT_MISSING`, upstreamCapacity=null, activeSymbolCount=0; health CAPTURE_DISABLED, schema 1.1. Source, immutable persistence, public diagnostic readback and fail-closed skip are physically verified. S2-07 remains incomplete pending real same-date inputs, authorized assessors, validated regime and continuity; no capacity/zero-pick/selection claim. Full evidence: `system2/evidence/daily_prospective_history_physical_acceptance_20261002.json`. 19:00 audit has not yet happened at this observation.


## 2026-10-02 S2-12 common-input comparison core

Repository core implemented in `resonance_comparison_frame_v0_1.mjs`; contract `SYSTEM2_RESONANCE_COMPARISON_FRAME_V0_1.md`. One existing bounded pool/clock/source vintage/adjustment/finality/input payload binds unchanged user-video Baseline and future preregistered Challenger transport. Immutable frames, formula-version registration records and pair readback use existing isolated infrastructure tables; no migration. Missing real Challenger is CHALLENGER_NOT_PREREGISTERED. Hash-bound pairing is not verified Challenger execution or promotion evidence; outcomeEvaluationReady=false and all authorities false. Unknown cost/regime remains explicit; no indicator/threshold/weight is authored. Synthetic tests cover unfair pairings, future inputs, post-observation registration, outcome exclusion, identity/version conflicts and lost readback. Live paired capture/API/formula/preregistration remain NOT DEPLOYED / NOT FROZEN. System1, Baseline and Worker/Cron remain unchanged. Remote CI acceptance pending. This advances S2-12 independently of S2-07's current-source/assessor gates; 19:00 audit not yet observed.


## 2026-10-02 S2-12 repository core acceptance VERIFIED

PR #313 merged `22baa1dbe0ad45da99072c784e524994f45f693c`. Final PR head `3181c43652de9c060866db7e7311c6f31ef195ae`: System2 Research CI 36985165883 and V8 Regression 36985165926 PASS. Main System2 Research CI 36985338857 PASS. Common input/version/PIT/finality gates and immutable mock persistence/readback are repository-verified. Evidence: `system2/evidence/resonance_comparison_core_acceptance_20261002.json`.

This is a technical comparison kernel, not deployed paired capture: no real Challenger formula/parameters/preregistration, no verified Challenger execution, no physical comparison persistence and zero actual paired samples. Baseline and System1 unchanged; all authorities and promotion evidence flags remain false. Continue with a reviewed real Challenger contract/implementation and same-cache capture adapter before physical paired persistence; do not relabel synthetic transport fixtures as research results. S2-07 current-source/assessor/continuity gates remain separate. The 19:00 audit has not yet occurred at this acceptance.

## 2026-10-03 System 2 Cron weekday semantics correction — PHYSICALLY VERIFIED

A real scheduling defect was identified from the missing Friday 2026-10-02 19:00 pool-refresh audit. The prior single System 2 Cron was `*/5 0-5,11 * * 1-5`. Under Cloudflare Workers Cron weekday semantics, numeric weekdays map from Sunday, so `1-5` covered Sunday-Thursday and excluded Friday. The runtime-local Friday/weekday classification was correct; the Cloudflare envelope was not invoked on Friday.

Correction:
- PR #329 merged as `5abf334015f2d37c27a3e9b53e9021d38a06472a`;
- physical Cron is now exactly `*/5 0-5,11 * * MON-FRI`;
- System2 Research CI `37089765932` PASS;
- V8 Regression `37089765935` PASS;
- isolated Worker deployment `37089823064` PASS;
- post-deploy Worker State Audit rerun `37089823066` PASS with `cronCount=1` and the exact `MON-FRI` expression;
- D1 remains schema V1.1 / 46 tables; Fugle secret remains configured; `CAPTURE_DISABLED`; System 1 production files and four System 1 Cron triggers were not changed.

No manual historical refresh is fabricated for the missed 2026-10-02 invocation. The next prospective acceptance point is the next real weekday 19:00 Asia/Taipei run, which must leave a durable `POOL_REFRESH_*` receipt even when upstream capacity is absent.

Evidence: `system2/evidence/resonance_cron_weekday_physical_acceptance_20261003.json`.

## 2026-10-03 S2-07 official corporate-action continuity milestone — SOURCE/PARSER PHYSICALLY VERIFIED, CERTIFICATION STILL LOCKED

S2-07 advanced from unknown corporate-action source transport to a physically verified official-source parser lane without changing System1 or enabling System2 selection authority.

### Official source capability
- PR #375 established keyless read-only TWSE / TPEx continuity-source capability.
- PR #376 added defensive legacy TPEx HTML-envelope parsing after the legacy transport initially returned HTTP 200; a later physical HTTP 520 made that route unstable, so it was retired rather than hidden behind retries.
- PR #378 replaced the active legacy TPEx reduction route with modern official range JSON endpoints and added strict response-range identity.
- Physical run 37120129869: 8/8 active official source lanes STRUCTURE_READY; 6/6 historical actual-result range lanes matched the exact requested 2026-04-05..2026-10-02 interval. This proves transport/structure/range identity only, not event completeness or technical continuity.

### Immutable continuity archive core
- PR #393 merged as `9453279dfaf4141477fb312c7f3f31a37c0ead53`.
- Added `corporate_action_continuity_archive_v0_1.mjs` with immutable source captures and event versions, append-only revision/cancellation semantics, duplicate-observation reconciliation, explicit prospective/verified/historical-UNKNOWN knowledge clocks, and fail-closed NO_EVENT rules.
- Historical firstKnownAt / availableAt are never fabricated.
- NO_EVENT requires complete PIT universe + every required exact-range source contract + parser completeness + revision coverage + no missing source dates + certified empty-range semantics where applicable + unambiguous event versions.
- No D1 schema migration was introduced because existing generic tables are not semantically correct for raw corporate-action event archival.
- PR System2 Research CI 37131834282 PASS; V8 Regression 37131834291 PASS.

### Real official event parser
- PR #396 merged as `71f95e08bbafedc5da8012f8ae4f23ae77d1bc95`.
- Six historical official result lanes now normalize to immutable corporate-action event versions:
  - TWSE TWT49U ex-right/ex-dividend actual;
  - TWSE TWTAUU capital-reduction resume/reference;
  - TWSE TWTB8U par-value-change resume/reference;
  - TPEx exDailyQ ex-right/ex-dividend actual;
  - TPEx revivt capital-reduction resume/reference;
  - TPEx pvChgRslt par-value-change resume/reference.
- PR checks: System2 Research CI 37132693815 PASS; V8 Regression 37132693770 PASS; Official Continuity Event Parser Readonly 37132693820 PASS.
- Physical frozen-range result: 6/6 parsers ready, 0 parse failures, 1,465 normalized ordinary-equity events, and all 1,465 had usable official pre-action-close/reference-price pairs for continuity evidence.
- Historical event-signal PIT remains protected: all 1,465 normalized historical events kept firstKnownAt=null / availableAt=null / pitEventReplayEligible=false.

### Still not certified
The following remain deliberately false:
- revisionCoverageComplete;
- emptyRangeSemanticsCertified;
- noEventMayBeClaimed;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified;
- continuityTransformPerformed;
- historyMutationPerformed;
- strategyEvaluationPerformed;
- capacityRunProduced;
- zeroPickClaimed;
- selectionAuthority / finalSelectionEnabled / livePushEnabled;
- capitalImpact / orderImpact;
- system1RuntimeUsed.

### Exact continuation
1. verify endpoint-specific empty-range semantics before any zero-event inference;
2. establish revision/correction coverage;
3. add exchange-complete suspension/resumption evidence;
4. design isolated append-only persistence only after the immutable record contract is stable;
5. bind verified event/suspension evidence to expected symbol sessions and RAW A1 lineage without mutating RAW bars;
6. only after history + continuity are READY address the separate `ASSESSOR_POLICY_NOT_FROZEN` gate and then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 stage remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.



## 2026-10-03 S2-07 official empty-range semantics — PHYSICALLY CERTIFIED / NO_EVENT STILL LOCKED

The endpoint-specific empty-response semantics gate is now physically verified on top of the existing official corporate-action source/parser lane.

- PR #404 merged as `a1e2e2a065dce9f82f73d0f1b7e1681781a1666b`.
- Final PR checks after evidence write-back:
  - Official Continuity Empty Range Readonly `37133887169`: PASS;
  - System2 Research CI `37133887214`: PASS;
  - V8 Regression `37133887175`: PASS.
- Frozen empty target: 2026-10-03.
- Source-level result: `certifiedEmptySourceCount=6/6`.
- `emptyRangeSemanticsCertified=true` is now valid for the six frozen official historical source contracts when their endpoint-specific signatures match.

Certification is intentionally endpoint-specific:
- TWSE par-value-change and all three TPEx historical lanes require exact requested-range identity + the frozen official success status + the expected row envelope + zero rows.
- TWSE ex-right/ex-dividend actual and TWSE capital-reduction actual return only the official no-data status when empty, so they additionally require same-endpoint positive controls:
  - ex-right/ex-dividend: 2026-04-08, exact range verified, 1 row;
  - capital reduction: 2026-06-29, exact range verified, 1 row.
- Any signature drift fails closed.

This closes only the source-level empty-range semantics blocker. The following remain false:
- `sourceCoverageComplete=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `suspensionCoverageComplete=false`;
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`;
- `historyMutationPerformed=false`;
- `strategyEvaluationPerformed=false`;
- `capacityRunProduced=false`;
- `selectionAuthority=false`;
- `finalSelectionEnabled=false`;
- `livePushEnabled=false`;
- `capitalImpact=false`;
- `orderImpact=false`;
- `system1RuntimeUsed=false`.

### Exact continuation
1. establish revision/correction coverage for the required corporate-action lanes;
2. add exchange-complete suspension/resumption evidence;
3. design isolated append-only persistence only after the record/coverage contract is stable;
4. bind event/suspension evidence to expected symbol sessions and RAW A1 lineage without mutating RAW bars;
5. only after history + continuity are READY address the independent `ASSESSOR_POLICY_NOT_FROZEN` gate, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.


## 2026-10-03 S2-07 revision/correction coverage — NEGATIVE GATE PHYSICALLY VERIFIED

The revision/correction completeness boundary is now machine-enforced and physically verified.

- PR #409 merged as `9dfdedfe908db529dad0b0b2558ab73d626e879e`.
- Final checks after evidence write-back:
  - Official Continuity Revision Coverage Readonly `37134615903`: PASS_NEGATIVE_GATE;
  - System2 Research CI `37134615895`: PASS;
  - V8 Regression `37134615891`: PASS.
- Frozen interval: 2026-04-05 through 2026-10-02.
- requiredLaneCount=6.
- finalResultReadyCount=6.
- supplementalRevisionReadyCount=0.
- revisionCoverageComplete=false.

All six TWSE/TPEx historical actual-result lanes were physically readable with exact range identity and complete parsers, but all six are now explicitly classified as `FINAL_RESULT_RANGE_ONLY`.

No lane exposed a complete immutable correction/cancellation/version history or historical knownAt version clock. Every lane therefore remains blocked by:

`SUPPLEMENTAL_REVISION_HISTORY_CHANNEL_INCOMPLETE`

This is an accepted negative result, not an implementation failure. It prevents a complete current/final result page from being silently upgraded into historical revision completeness.

The supplemental channel contract is now frozen. A lane can become revision-complete only when an official supplemental source for the same exchange/action family and exact interval proves all of:
- revision/correction/cancellation history coverage;
- exact interval identity;
- parser completeness;
- immutable versions preserved;
- knownAt version clock coverage;
- correction history complete;
- cancellation history complete;
- no missing source dates.

Independent gates remain false:
- `noEventMayBeClaimed=false`;
- `suspensionCoverageComplete=false`;
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`;
- `historyMutationPerformed=false`;
- `strategyEvaluationPerformed=false`;
- `capacityRunProduced=false`;
- `selectionAuthority=false`;
- `finalSelectionEnabled=false`;
- `livePushEnabled=false`;
- `capitalImpact=false`;
- `orderImpact=false`;
- `system1RuntimeUsed=false`.

### Exact continuation
1. discover and physically validate supplemental official revision/correction/cancellation version-history channels; Shared research already identifies MOPS filings/corrections and exchange official-document announcements as candidates, but no endpoint is accepted before physical contract verification;
2. add exchange-complete suspension/resumption evidence;
3. design isolated append-only persistence only after the record/coverage contracts are stable;
4. bind verified event/revision/suspension evidence to expected symbol sessions and RAW A1 lineage without mutating RAW bars;
5. only after history + continuity are READY address `ASSESSOR_POLICY_NOT_FROZEN`, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.


## 2026-10-03 S2-07 MOPS revision-source capability — PHYSICALLY OBSERVED

A supplemental official revision-history candidate is now physically verified at capability level.

- PR #415 merged as `42142a4278dadbe8fb8b9fc9b72b9e7aee04c2b2`.
- Final checks after evidence write-back:
  - MOPS Revision Source Capability Readonly `37135267184`: PASS_CAPABILITY_OBSERVED;
  - System2 Research CI `37135267177`: PASS;
  - V8 Regression `37135267247`: PASS.
- Official MOPS gateway returned HTTP 200 / code 200 and an allowlisted official history URL.
- Frozen positive control: 2467 志聖, ROC 115/05, event date 2026-05-22.
- Official history response preserved two distinct records for the same ex-dividend subject family:
  - 16:34:06 / seqNo=2 / original;
  - 17:42:13 / seqNo=4 / correction.
- `revisionHistoryCapabilityObserved=true`.

This proves the MOPS historical material-information lane can preserve an original disclosure and a later correction as separate historical records instead of overwriting the original.

It does **not** yet satisfy the supplemental revision-history completeness contract:
- `boundedIntervalCoverageComplete=false`;
- `actionFamilyCoverageComplete=false`;
- `cancellationHistoryComplete=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `technicalContinuityCertified=false`;
- `selectionAuthority=false`.

### Exact continuation
1. expand MOPS validation from one positive control to bounded multi-company / multi-action-family coverage;
2. add explicit cancellation/revocation controls and verify their historical representation;
3. validate source-reported date/time/sequence semantics before using them as version knownAt clocks;
4. join exchange official-document announcements as exchange-side evidence where MOPS alone is insufficient;
5. only after the supplemental contract is complete may the six-lane revision coverage receipt be reconsidered.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.


## 2026-10-04 D19 factor-layer receipt adapter V0.1
- Research-only PR #439 merged as `76f5ef80dbf0654a033a0a780b065ebfabbf0e30`.
- Added deterministic D19 factor-layer receipt builders: universe -> return -> factorInput -> neutralization -> cost -> replay.
- Receipt-chain completeness is explicitly separate from D19 L3 research eligibility; explicit blockers prevent engineering completeness from becoming an automatic maturity promotion.
- System2 Research CI `37165603677` PASS and V8 Regression `37165603710` PASS.
- Real official-source smoke `37165603790` PASS_NEGATIVE_L3_GATE with production isolation PASS. TWSE 2026-08-03..2026-08-31 produced a complete bounded 2330/2454 receipt chain; TPEx primary and legacy historical transports both returned HTTP 520 and were preserved as source-unavailable rather than imputed.
- Remaining D19 L3 blockers: historical-registry universe denominator, corporate-action continuity, industry neutralization, D03/D09 redundancy, cost provenance, and current TPEx source availability.
- No selection authority, Formal Core, System1 runtime, production, capital, push, Cron or live behavior changed.


## 2026-10-04 S2-07 MOPSOV month-shard reconciliation — PHYSICALLY VERIFIED

The next MOPS supplemental revision-source transport/completeness guard is physically verified for a frozen high-volume company control.

- PR #446 merged as `636305f79ecde412b27177dc677578d6116bc7d6`.
- MOPSOV Month Shard Reconciliation Readonly `37168363208`: PASS.
- System2 Research CI `37168363156`: PASS.
- V8 Regression `37168363125`: PASS.
- Frozen control: 2330 / ROC 115 / month shards 1–9 / cutoff 2026-09-30.
- Full-query prefix rows = 151.
- Monthly-shard union rows = 151.
- only-full-query keys = 0.
- only-month-shard keys = 0.
- duplicate month-shard keys = 0.
- exactKeysetReconciliation=true.
- No visible pagination hints were observed for this frozen control.
- Read-only boundary PASS; no D1/R2 mutation, strategy evaluation, capacity, selection, push, capital, order or System1 runtime use.

This proves exact keyset reconciliation only for the frozen company/year window. It does not prove global completeness or safe historical knownAt semantics.

Still false:
- boundedIntervalCoverageComplete;
- actionFamilyCoverageComplete;
- cancellationHistoryComplete;
- knownAtVersionClockCertified;
- revisionCoverageComplete;
- noEventMayBeClaimed;
- symbolSessionCompletenessCertified;
- technicalContinuityCertified;
- selectionAuthority / finalSelectionEnabled / livePushEnabled;
- capitalImpact / orderImpact / system1RuntimeUsed.

### Exact continuation
1. repeat bounded full-query vs month-shard reconciliation on the frozen multi-company/multi-action correction and cancellation controls;
2. characterize empty company-month semantics and higher-row-count pagination/truncation behavior;
3. validate source-reported date/time/sequence semantics before using them as version knownAt clocks;
4. add exchange-side official document cancellation/revocation evidence;
5. only after the supplemental revision-history contract is complete reconsider the six-lane `revisionCoverageComplete` receipt;
6. then continue suspension/resumption completeness -> expected symbol sessions -> RAW A1 lineage -> technical continuity;
7. only after history + continuity are READY address `ASSESSOR_POLICY_NOT_FROZEN`, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.


## 2026-10-04 S2-07 MOPSOV multi-control reconciliation — PHYSICALLY VERIFIED

S2-07 expanded the MOPSOV query-integrity check from one high-volume company to every company in the frozen correction/cancellation control matrix.

- PR #448 merged as `8c1f9746ffe0593797403a5bc45c1cfbd68e0a35`.
- Multi Control Reconciliation Readonly `37168654471`: PASS.
- System2 Research CI `37168654454`: PASS.
- V8 Regression `37168654514`: PASS.
- companyCount=4; controlCount=5; allControlsCovered=true.
- passCompanyCount=4.
- exactKeysetReconciliation=true.
- every company: onlyAll=0, onlyMonthShard=0, duplicateMonthKey=0.
- correction/cancellation control companies: 2467, 1459, 2321, 1342.
- no D1/R2 mutation, no strategy evaluation, no capacity, no selection/push/capital/order authority, no System1 runtime use.

This proves bounded query-shape consistency across the frozen multi-control sample. It does not prove whole-market or revision-history completeness.

### Exact continuation
1. certify empty company-month semantics so an empty shard can be distinguished from missing/invalid transport;
2. stress higher-row-count pagination/truncation semantics;
3. validate MOPS source-reported date/time/sequence as historical version knownAt candidates;
4. add exchange official-document cancellation/revocation evidence where MOPS alone is insufficient;
5. only after the supplemental revision-history contract is complete reconsider the six-lane revision coverage receipt;
6. then complete suspension/resumption -> symbol sessions -> RAW A1 lineage -> technical continuity;
7. after history + continuity are READY, address `ASSESSOR_POLICY_NOT_FROZEN`, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.

## 2026-10-04 S2-07 MOPSOV empty company-month semantics — PHYSICALLY CHARACTERIZED

PR #450 merged as `af1d526cb628ecaba64375a15e99ba0fbaaa6831`.

Physical checks:
- Empty Month Characterization Readonly `37169012904`: PASS.
- System2 Research CI `37169012900`: PASS.
- V8 Regression `37169012896`: PASS.

Frozen empty controls:
- 1459 / 2026-01;
- 1342 / 2026-03;
- 1342 / 2026-08;
- 1342 / 2026-09.

Positive controls:
- 2467 / 2026-05;
- 1459 / 2026-06;
- 1342 / 2026-07.

Observed empty signature across all four controls:
- HTTP 200;
- content-type `text/html; charset=UTF-8`;
- 2540 bytes;
- parsed rowCount=0;
- identical SHA-256 `9d2e63bf800085e3953d9e675f72cd95131758de64546ad898a5beee56a39e5d`;
- normalized visible text `公開資訊觀測站 資料庫中查無需求資料`;
- no observed access/error signature.

All positive controls had non-zero rows and distinct payload hashes.

This narrows the transport ambiguity, but `emptyMonthSemanticsCertified=false` deliberately remains false until a separate frozen certification contract verifies the discovered signature and same-endpoint positive controls.

### Exact continuation
1. implement and physically verify MOPSOV empty-month certification V0.2 using the observed official signature and fail-closed drift rules;
2. stress higher-row-count pagination/truncation behavior;
3. validate source date/time/sequence as historical version knownAt candidates;
4. add exchange-side official-document cancellation/revocation evidence;
5. only after complete supplemental revision-history coverage may `revisionCoverageComplete` be reconsidered;
6. then suspension/resumption -> expected symbol sessions -> RAW A1 lineage -> technical continuity;
7. after history + continuity READY, address `ASSESSOR_POLICY_NOT_FROZEN`, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.

## 2026-10-04 S2-07 MOPSOV empty-month semantics — PHYSICALLY CERTIFIED V0.2

PR #452 merged as `35c7448baf7ef5790b0d5798e23d0ee4653207d1`.

Checks:
- MOPSOV Empty Month Certification Readonly `37169332743`: PASS.
- System2 Research CI `37169332659`: PASS.
- V8 Regression `37169332638`: PASS.

Physical certification:
- state=`MOPSOV_EMPTY_MONTH_SEMANTICS_CERTIFIED`;
- 4/4 frozen empty controls PASS;
- 3/3 same-endpoint positive controls PASS;
- fail-closed drift/error tests PASS;
- `emptyMonthSemanticsCertified=true`.

This is a narrow MOPSOV source-contract promotion only. It does not make a whole bounded historical interval complete and does not allow `noEventMayBeClaimed=true`.

### Exact continuation
1. stress high-row-count MOPSOV query/pagination/truncation semantics beyond the frozen correction/cancellation sample;
2. validate MOPS source-reported date/time/sequence as historical version knownAt candidates;
3. add exchange-side official-document cancellation/revocation evidence;
4. assemble the supplemental revision-history completeness receipt only after those gates are satisfied;
5. then suspension/resumption -> expected symbol sessions -> RAW A1 lineage -> technical continuity;
6. only after history + continuity READY address `ASSESSOR_POLICY_NOT_FROZEN`, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

Still authoritative:
`revisionCoverageComplete=false`,
`noEventMayBeClaimed=false`,
`technicalContinuityCertified=false`,
all trading authority false.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.


## 2026-10-04 D19 full-TWSE universe coverage qualification
- Research PR #460 merged as `1a7b6e7e8d8552953f909f4ee1448733a1daf643`.
- Full-TWSE coverage workflow `37172684933` PASS; System2 Research CI `37172684904` PASS; V8 Regression `37172684903` PASS.
- Frozen 2026-08-31 survivorship-controlled TWSE denominator = 1,089; August official daily rows = 22,810.
- D19-04 20-session input coverage = 1,064 KNOWN / 25 explicit UNKNOWN; UNKNOWN causes are preserved rather than imputed.
- PR #459 TPEx live-transport experiment closed unmerged after all three routes returned HTTP 520; historical benchmark evidence remains read-only and does not substitute for persisted replay.
- This improves research infrastructure only. No System1/Formal/selection/capital/push/production behavior changed.


## 2026-10-04 D19 Stage 9 — TWSE session-state research diagnostics
- Research-only D19 evidence advanced without changing System2 selection authority or System1 Production.
- PR #463 merged as `67ff5fca7544954ed12cb59449b6dae046c012b6`; official TWSE historical suspended-trading query for 2026-08-03..2026-08-31 physically captured 1218 and 1909 suspension/resumption states. Raw payload hash `072e88890972ebbfed3d64a82ec0bbeee22044ec21a3146aaac3ca989d50f7c0`.
- PR #464 merged as `c8945c76e2cc4cd72faecaa4cd6d09a0b7077eb1`; 50 invalid-close rows across 15 D19 names split into 11 OFFICIAL_ZERO_TRADE_ROW and 39 UNRESOLVED_INVALID_CLOSE_ROW with positive activity but no OHLC.
- This falsifies a naive one-price-per-market-session assumption. Any future factor replay must distinguish valid price observations, verified non-trading sessions, zero-trade rows and unresolved active/no-OHLC states.
- Forward fill / previous-close substitution is not authorized. Shared symbol-session and continuity semantics remain the authority; D19 must not fork a local adjustment engine.
- Full L3 remains blocked by TPEx replayable history/universe, complete continuity certification, PIT industry vintage, D03/D09 compatible redundancy inputs and D14-compatible cost evidence.

## 2026-10-04 S2-07 MOPSOV high-row pagination/truncation stress — PHYSICALLY VERIFIED

PR #455 merged as `3772f6332465a5912d1ca32314c322b455685d18`.

Physical checks:
- MOPSOV High Row Pagination Stress Readonly `37169619727`: PASS.
- System2 Research CI `37169619744`: PASS.
- V8 Regression `37169619690`: PASS.

Frozen 11-company discovery selected the three highest-row controls:
- 2891: 391 prefix rows;
- 3711: 383 prefix rows;
- 2881: 300 prefix rows.

For all three:
- full-query prefix == Jan-Sep month union;
- onlyAll=0;
- onlyMonthShard=0;
- duplicateMonthKey=0;
- exactKeysetReconciliation=true.

No pagination hints were observed; max frozen row count was 391 and the largest single selected month contained 81 rows.

This completes the currently planned MOPSOV query-shape / empty-month / high-row transport guards for the frozen 2026 sample.

### Exact continuation
1. validate MOPS source-reported date/time/sequence semantics as historical version knownAt candidates;
2. add exchange-side official-document cancellation/revocation evidence where MOPS alone is insufficient;
3. assemble the supplemental revision-history completeness receipt only after those gates are satisfied;
4. integrate the concurrently improved TWSE suspension/resumption evidence into shared session completeness, then complete TPEx/symbol-session coverage;
5. bind expected symbol sessions -> RAW A1 lineage -> technical continuity;
6. only after history + continuity READY address `ASSESSOR_POLICY_NOT_FROZEN`, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

Still authoritative:
`knownAtVersionClockCertified=false`,
`revisionCoverageComplete=false`,
`noEventMayBeClaimed=false`,
`technicalContinuityCertified=false`,
all trading authority false.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.

## 2026-10-04 S2-07 revision provenance / clock milestone — FROZEN CONTROL ROUTING PHYSICALLY VERIFIED

S2-07 advanced through four linked read-only gates without weakening PIT semantics.

### Source-reported clock
PR #471 / `07aac29e0bc239feb8c756c88095837722512fa8`:
- 5/5 MOPS correction/cancellation controls PASS;
- `sourceReportedVersionClockSemanticsCertified=true`;
- `historicalKnownAtCandidateClockAvailable=true`;
- `publicAvailabilityLatencyCertified=false`;
- `knownAtVersionClockCertified=false`.

### Regulator-side provenance
PR #475 / `a9dc408e1303f0470359f77dff6f833379862355`:
- official SFB/FSC 115-year case workbook physically parsed;
- direct 1342 八貫現金增資 `廢止/撤銷` regulator record observed;
- representative regulator provenance PASS;
- `authorityRevisionCoverageComplete=false`.

### Prospective availability observer
PR #480 / `4fd9e3fa0cbb8f0cb20193d74ebb09035d58085d`:
- observer contract + tests + official readback probe PASS;
- 9/9 historical MOPS version rows stayed `RETROSPECTIVE_SOURCE_CLOCK_ONLY`;
- zero retrospective rows were promoted to first-observed availability;
- prospective adapter is implemented but no prospective event sample has yet been collected;
- no new schedule / Worker Cron / D1 write was introduced.

### Cross-authority provenance matrix
PR #483 / `4c8ecd468632d51e25e93beab2eb9e50ef5d29a6`:
- 5/5 frozen authority controls PASS;
- `frozenAuthorityRoutingCoverageComplete=true`;
- 2467 issuer revision + TWSE operational effective date 2026-06-18;
- 1459 issuer revision + TWSE capital-reduction operational effective date 2026-08-03;
- 2321 issuer board-decision revision preserved as issuer-owned fact;
- 1342 issuer cash-capital-increase correction preserved as issuer-owned fact;
- 1342 cancellation joined to direct SFB/FSC `廢止/撤銷` regulator evidence.

### Current semantic boundary

The remaining knownAt blocker cannot be honestly solved from historical pages. A historical MOPS row can supply certified `sourceReportedAt`, but exact public availability requires genuinely prospective observation.

Therefore the following remain authoritative:
- `publicAvailabilityLatencyCertified=false`;
- `knownAtVersionClockCertified=false`;
- `pitReplayUseAsAvailableAtAuthorized=false`;
- `authorityRevisionCoverageComplete=false`;
- `revisionCoverageComplete=false`;
- `noEventMayBeClaimed=false`;
- `suspensionCoverageComplete=false`;
- `symbolSessionCompletenessCertified=false`;
- `technicalContinuityCertified=false`;
- `historyMutationPerformed=false`;
- `strategyEvaluationPerformed=false`;
- `capacityRunProduced=false`;
- `selectionAuthority=false`;
- `finalSelectionEnabled=false`;
- `livePushEnabled=false`;
- `capitalImpact=false`;
- `orderImpact=false`;
- `system1RuntimeUsed=false`.

### Exact continuation

1. freeze a bounded supplemental revision provenance receipt that combines final-result lanes, MOPS revision/source-clock integrity, authority routing and explicit knownAt evidence blockers;
2. do **not** claim revision completeness merely because the frozen authority controls pass;
3. keep exact MOPS knownAt blocked until a preregistered prospective event sample exists;
4. independently integrate the already-improved TWSE suspension/resumption evidence into shared session completeness and close the TPEx suspension/session gap;
5. bind verified event/revision/suspension evidence to expected symbol sessions and RAW A1 lineage without mutating RAW bars;
6. only after history + continuity are READY address `ASSESSOR_POLICY_NOT_FROZEN`, then Strategy -> Ranking -> Capacity -> real `s2_capacity_runs`.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.

## 2026-10-04 S2-07 supplemental revision receipt — SIX-LANE BLOCKERS PHYSICALLY DECOMPOSED

PR #487 merged as `b75376bb4741ea6ca7eec6c7f09bd32056dcf162`.

Physical workflow receipts:
- Supplemental Revision Provenance Receipt Readonly `37181058446`: PASS;
- System2 Research CI `37181058355`: PASS;
- V8 Regression `37181058477`: PASS.

Six required historical final-result lanes are all physically READY for 2026-04-05..2026-10-02:
- TWSE EX_RIGHT_DIVIDEND = 831 events;
- TWSE CAPITAL_REDUCTION = 9;
- TWSE PAR_VALUE_CHANGE = 1;
- TPEx EX_RIGHT_DIVIDEND = 611;
- TPEx CAPITAL_REDUCTION = 9;
- TPEx PAR_VALUE_CHANGE = 4.

The receipt proves the remaining revision blocker is no longer transport/final-result readability.

Current blocker counts:
- 6/6 lanes: public availability latency not certified;
- 6/6 lanes: exact knownAt / PIT availability not certified;
- 6/6 lanes: bounded authority revision coverage incomplete;
- 6/6 lanes: bounded revision-history coverage incomplete;
- 4/6 lanes: representative authority routing not observed.

Representative authority routing is already physically observed for:
- TWSE ex-right/dividend;
- TWSE capital reduction.

Still missing representative authority routing:
- TWSE par-value change;
- TPEx ex-right/dividend;
- TPEx capital reduction;
- TPEx par-value change.

### Exact continuation
1. close representative authority-routing controls for the four missing lanes using official issuer/regulator/exchange evidence;
2. define bounded revision-history coverage separately from representative-control success;
3. keep `knownAtVersionClockCertified=false` until genuine prospective MOPS availability samples exist;
4. integrate TWSE and TPEx suspension/resumption into shared session completeness;
5. bind event/revision/suspension evidence to expected symbol sessions and RAW A1 lineage;
6. only then reconsider technical continuity and later assessor/ranking/capacity work.

Still authoritative:
`revisionCoverageComplete=false`,
`noEventMayBeClaimed=false`,
`suspensionCoverageComplete=false`,
`symbolSessionCompletenessCertified=false`,
`technicalContinuityCertified=false`,
all trading authority false.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.

## 2026-10-04 S2-07 representative authority breadth — 3 OF 6 PHYSICALLY VERIFIED

Three linked milestones are now formal:

### Discovery correction — PR #497
- 7 frozen candidate symbols across four missing lanes were physically screened;
- a 4207 false positive caused by overly broad action-family matching was detected and removed before acceptance;
- only 3152 璟德 remained a valid revision-chain candidate;
- the other three lane families were valid negative results in this frozen candidate set.

### TPEx 3152 representative control — PR #502
- MOPS revision control matrix V0.3: 6/6 PASS;
- V0.3 added fail-closed cross-month chain semantics;
- 3152 Jan original + May correction PASS;
- source-reported clock semantics 6/6 PASS;
- authority provenance matrix V0.2: 6/6 PASS;
- 3152 matched official TPEx capital-reduction effective/resume date 2026-06-30;
- representative exchange lane count advanced to 3.

### Canonical six-lane receipt — PR #503
- all six final-result lanes remain READY;
- representativeAuthorityReadyCount advanced 2 -> 3;
- supplementalRevisionReadyCount remains 0;
- representative gaps reduced 4 -> 3.

Current representative gaps:
1. TWSE par-value change;
2. TPEx ex-right/dividend;
3. TPEx par-value change.

Common blockers on all six lanes remain:
- public-availability latency not certified;
- exact knownAt not certified;
- bounded authority revision coverage incomplete;
- bounded revision-history coverage incomplete.

### Exact continuation
1. expand official-event-derived candidate discovery for the three remaining representative lanes;
2. require true action-family original+correction/cancellation chains before promotion;
3. join any positive candidate to the exact exchange operational/effective event before freezing;
4. version the canonical supplemental receipt again only after representative breadth physically advances;
5. keep exact knownAt as a separate prospective-evidence debt;
6. after representative revision routing work, continue bounded revision completeness and shared suspension/session integration.

Still authoritative:
`knownAtVersionClockCertified=false`,
`revisionCoverageComplete=false`,
`noEventMayBeClaimed=false`,
`suspensionCoverageComplete=false`,
`symbolSessionCompletenessCertified=false`,
`technicalContinuityCertified=false`,
all trading authority false.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.


## 2026-10-04 System 2 independent correction governance — ACTIVATED

Owner approved a durable independent correction / troubleshooting / audit role for System 2.

New canonical artifacts:
- `system2/SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md`
- `system2/SYSTEM2_CORRECTION_QUEUE.md`
- `system2/SYSTEM2_CORRECTION_QUEUE.json`

Governance semantics:
- severity = CRITICAL / HIGH / MEDIUM / LOW;
- lifecycle = OPEN -> ACKNOWLEDGED -> FIX_IN_PROGRESS -> FIX_IMPLEMENTED -> VERIFYING -> VERIFIED_CLOSED, with OWNER_DECISION_REQUIRED / REJECTED_WITH_EVIDENCE branches;
- CRITICAL/HIGH cannot be self-closed by the implementation role;
- false completion, silent abandonment, validation omissions, cross-module orphaning, authority leaks and North-Star drift are explicit correction classes;
- active blocking directives must be read before affected System 2 milestones are declared complete;
- owner approval remains mandatory for protected Class B/Class C, Formal Core, production, capital, order or push changes.

Initial correction queue contains no fabricated issues; directives will be added only when supported by evidence.

This is governance/process infrastructure only. System 2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. No trading authority was enabled. System 1 Formal Core remains untouched.


## 2026-10-04 parallel execution lane governance — ACTIVATED

Owner approved a four-role System 2 operating structure to increase parallel throughput without over-fragmenting ownership:

- BUILD_LANE — System 2｜建置總控室.
- DATA_LANE — System 2｜歷史資料工程室.
- REMEDIATION_LANE — System 2｜補強修復室.
- AUDIT_LANE — independent correction/adviser room.

Canonical lane governance:
`system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`

Dedicated durable cursors:
- `system2/SYSTEM2_HISTORICAL_DATA_CHECKPOINT.md`
- `system2/SYSTEM2_REMEDIATION_CHECKPOINT.md`

Routing classes:
`LOCAL_FIX / BUILD_LANE / DATA_LANE / REMEDIATION_LANE / OWNER_DECISION_REQUIRED`.

Key rule: severity and routing are separate. HIGH/CRITICAL does not automatically mean REMEDIATION_LANE. Ordinary local defects remain with the active module owner when handoff would increase context/merge cost.

Concurrency rule:
one conflict unit -> one active modification owner.

Current correction routing:
`S2-CORR-20261004-001` -> `DATA_LANE` -> `System 2｜歷史資料工程室`.

The System 2 build room no longer owns every OPEN/HIGH correction by default. It must read the queue, respect blockers, execute only BUILD_LANE/LOCAL_FIX work assigned to it, and continue non-conflicting construction.

No System 1 Formal Core, System 2 final-selection authority, capital/order behavior, production push or live trading authority is changed by this governance.

## 2026-10-04 S2-07 representative authority breadth — 4 OF 6 PHYSICALLY VERIFIED

Two linked milestones advanced the representative revision-source coverage.

### Expanded discovery — PR #518
- TWSE par-value official candidates 2020..2026: 9 queried, no revision-chain positive.
- TPEx ex-right/dividend 2026: 621 unique official candidates existed; bounded first 24 queried, no positive chain.
- TPEx par-value official candidates 2020..2026: 11 queried; 6548 長科* was the sole positive.
- 6548 had three exact-stem original/correction chains; the direct換發基準日 chain was selected for promotion.

### TPEx 6548 representative control — PR #520
- MOPS revision control matrix V0.4: 7/7 PASS.
- 6548 original 2022-08-05 17:17:38 / seqNo=2.
- 6548 correction 2022-08-08 17:26:39 / seqNo=2.
- source-reported clock controls: 7/7 PASS.
- official TPEx par-value effective date: 2022-09-05 exact match.
- authority provenance matrix V0.3: 7/7 PASS.
- representative exchange lane count advanced 3 -> 4.
- supplemental revision receipt V0.3: representativeAuthorityReadyCount=4.

Current representative-routing gaps:
1. TWSE par-value change;
2. TPEx ex-right/dividend.

Common blockers on all six lanes remain:
- public-availability latency not certified;
- exact knownAt not certified;
- bounded authority revision coverage incomplete;
- bounded revision-history coverage incomplete.

### Exact continuation
1. continue bounded search for a true TWSE par-value revision/cancellation representative control; current 2020..2026 official candidate set is negative;
2. expand TPEx ex-right/dividend candidate discovery beyond the first 24 of the 621 unique 2026 official candidates, preserving deterministic ordering and strict action-family filtering;
3. promote only exact issuer revision chain + exact exchange operational event pairs;
4. version the six-lane receipt only if representative breadth advances;
5. separately keep the prospective knownAt debt open;
6. after representative routing, continue bounded revision completeness and shared suspension/session integration.

HIGH correction `S2-CORR-20261004-001` remains separately ACKNOWLEDGED and blocks historical-backfill completion claims until the repaired 2017 TWSE manual workflow is physically rerun and verified. It does not invalidate this read-only S2-07 evidence lane.

Still authoritative:
`knownAtVersionClockCertified=false`,
`revisionCoverageComplete=false`,
`noEventMayBeClaimed=false`,
`suspensionCoverageComplete=false`,
`symbolSessionCompletenessCertified=false`,
`technicalContinuityCertified=false`,
all trading authority false.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.

## 2026-10-04 S2-07 representative authority breadth — 5 OF 6 PHYSICALLY VERIFIED

S2-07 advanced from 4/6 to 5/6.

### Final-two discovery — PR #528
- TWSE par-value 2010..2019 endpoint: 0 official events;
- TWSE par-value 2020..2026 had already been fully negative;
- TPEx ex-right/dividend additional deterministic 48-candidate year-wide sample: negative;
- no criteria were weakened.

### Wrong-exchange rejection — PR #531
- 6184 大豐電 had a valid issuer-side dividend correction chain;
- exchange join failed because 6184 is TWSE-listed rather than TPEx;
- candidate was rejected and PR closed unmerged.

### TPEx dividend candidate validation — PR #533
5356 協益 physically verified:
- original 2026-06-02 17:51:32 / seqNo=1;
- correction 2026-06-18 18:55:49 / seqNo=2;
- second correction 2026-06-18 19:17:38 / seqNo=3;
- TPEx actual ex-dividend date exactly 2026-07-08.

### 5/6 promotion — PR #535
- MOPS revision control matrix V0.5: 8/8 PASS;
- source-reported clock: 8/8 PASS;
- authority provenance matrix V0.4: 8/8 PASS;
- representative exchange lane count=5;
- supplemental revision receipt V0.4: representativeAuthorityReadyCount=5;
- supplementalRevisionReadyCount remains 0.

Only representative-routing gap:
1. TWSE par-value change.

### Exact continuation
1. stop blind repetition of the exhausted TWSE par-value final-result candidate path;
2. discover alternate official issuer/regulator/exchange evidence for a true TWSE par-value correction/cancellation chain;
3. if no representative historical revision event can be established, document structural unavailability rather than weakening evidence rules;
4. keep prospective knownAt debt separate;
5. after representative-routing disposition, continue bounded revision completeness and shared suspension/session integration.

Still authoritative:
`publicAvailabilityLatencyCertified=false`,
`knownAtVersionClockCertified=false`,
`authorityRevisionCoverageComplete=false`,
`revisionCoverageComplete=false`,
`noEventMayBeClaimed=false`,
`suspensionCoverageComplete=false`,
`symbolSessionCompletenessCertified=false`,
`technicalContinuityCertified=false`,
all trading authority false.

HIGH correction `S2-CORR-20261004-001` remains assigned to DATA_LANE and is not closed by this S2-07 milestone.

System2 remains `P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS`. Formal Core remains LOCKED.

## 2026-10-04 S2-07 TWSE par-value U04 alternate-source search — NEGATIVE / PRESERVED

PR #577 merged as `8d4193acd57405b7ba4f6fe2c778850e3bbf0a0a`.

The final representative-routing gap remains `TWSE_PAR_VALUE_CHANGE_REFERENCE`.

U04 alternate issuer evidence was physically queried for the four frozen 2025 TWSE par-value final-result events (4763, 6919, 2327, 8422) using both company and listed-market scopes.

Physical result:
- transport and serializer diagnostics PASS;
- candidateCount=4;
- issuerEvidenceCandidateCount=0;
- revisionParValueCandidateCount=0;
- no representative control promoted.

This adds another valid negative path after:
- 2020..2026 final-result-derived MOPS candidate search: negative;
- 2010..2019 historical endpoint: zero official par-value events;
- 2025 U04 issuer-announcement search: negative.

### Exact continuation
1. do not repeat the exhausted final-result or U04 paths without new evidence;
2. inventory alternate official issuer/regulator/exchange announcement families for TWSE par-value/share-exchange revisions;
3. preregister bounded candidate windows before querying;
4. if all materially distinct official historical routes are negative, document structural historical unavailability rather than fabricating a 6/6 representative control;
5. regardless of representative routing disposition, keep public availability/knownAt and bounded revision-completeness debts separate;
6. after this representative-routing disposition, continue bounded revision completeness and shared suspension/session integration.

Still authoritative:
`representativeAuthorityReadyCount=5`,
`publicAvailabilityLatencyCertified=false`,
`knownAtVersionClockCertified=false`,
`authorityRevisionCoverageComplete=false`,
`revisionCoverageComplete=false`,
`noEventMayBeClaimed=false`,
`suspensionCoverageComplete=false`,
`symbolSessionCompletenessCertified=false`,
`technicalContinuityCertified=false`,
all trading authority false.

HIGH correction `S2-CORR-20261004-001` remains assigned to DATA_LANE and is not affected by this S2-07 result.

## 2026-10-05 S2-07 representative-routing research — DISPOSITIONED AT 5 OF 6

The representative-routing search phase is now formally dispositioned without weakening evidence criteria.

### Additional final-gap evidence

PR #594 / `8270b254f1232df98d97792d4fba4b5b27b00882`:
- TWSE TWTB7U explicit historical date requests physically returned current 6949/2026-09-07 semantic data;
- request `params.date` echo was rejected as historical evidence;
- state=`TWTB7U_HISTORICAL_DATE_NOT_OBSERVED`.

PR #596 / `c631eb5519d432b7d2659499d4ea34b94d44633d`:
- mechanically derived the TWSE 公文公告 machine query contract from official page/runtime configuration;
- stable endpoint=`/rwd/zh/announcement/announcement`;
- known positive control 2025-06-06 / document 1140010257 / symbol 4763 physically returned HTTP 200 JSON.

PR #597 / `b0926c880ae8fb8900a3d8f0a62cc0591d568e60`:
- full 2025 bounded official-document search for 4763, 6919, 2327, 8422;
- all known normal operational document references physically recovered;
- all query responses reconciled by `data.length == total`;
- additional full-year keyword searches included 股票面額 / 換發新股 / 更正 / 修正 / 撤銷 / 取消 / 改期 / 調整;
- all four frozen candidates had `revisionParValueRowCount=0`;
- state=`OFFICIAL_DOCUMENT_BOUNDED_NEGATIVE`.

PR #598 / `1ec7e3be4581b722ef5cbc2ab66e8d8d163365e2`:
- six required evidence routes PASS;
- final TWSE par-value representative search formally dispositioned;
- representative coverage intentionally remains 5/6;
- sixth control was not fabricated.

### Authoritative semantic state

`representativeAuthorityReadyCount=5`.
`representativeRoutingResearchDispositionComplete=true`.
`representativeRoutingCoverageComplete=false`.
Remaining gap:
`TWSE_PAR_VALUE_CHANGE_REFERENCE`.
Disposition:
`HISTORICAL_CONTROL_NOT_ESTABLISHED_WITHIN_EXHAUSTED_OFFICIAL_PATHS`.

Do not blindly repeat exhausted routes. Reopen only when a genuinely new official source, changed source semantics, or newly verified historical revision event appears.

This does not claim absolute historical nonexistence.

### Exact continuation

Representative-routing discovery is no longer the active S2-07 search loop.

Next BUILD_LANE targets:
1. bounded authority/revision-history completeness;
2. shared suspension/resumption + symbol-session integration;
3. bind expected sessions to RAW A1 lineage without mutating RAW bars;
4. only after revision/session evidence is READY reconsider technical continuity;
5. exact public knownAt remains separate prospective evidence debt.

Still false:
`publicAvailabilityLatencyCertified=false`,
`knownAtVersionClockCertified=false`,
`authorityRevisionCoverageComplete=false`,
`revisionCoverageComplete=false`,
`noEventMayBeClaimed=false`,
`suspensionCoverageComplete=false`,
`symbolSessionCompletenessCertified=false`,
`technicalContinuityCertified=false`,
all trading authority false.

DATA_LANE / REMEDIATION_LANE corrections remain independently owned under execution-lane governance. System 1 Formal Core remains LOCKED.


## 2026-10-05 SDA engineering intake

Canonical routing:
`shared-knowledge/STOCK_SELECTION_AUDIT_ENGINEERING_ROUTING_20261005_V0_1.md`.

System 2 engineering assignments currently relevant:
- SDA-001 / SDA-004 resonance lineage and effective-independent-evidence diagnostics for EMA16 / EMA64 / Impulse MACD and related price-derived conditions;
- SDA-016 canonical holdout/experiment-consumption guard, preferably shared with System 1 rather than forked;
- SDA-017 executable immutable Regime observer/builder under the already preregistered D18 semantics.

Rules:
- preserve the current Correction Queue / Execution Lane Governance; SDA work must not steal DATA_LANE or REMEDIATION_LANE ownership;
- Class A Shadow diagnostics may proceed when isolated;
- shared runtime/schema production risk is Class B;
- live strategy gating/weights/ranking changes are Class C and require explicit owner approval;
- do not infer historical regime evidence from specification alone.

Mode guidance for actual cross-file implementation/tests: Codex / GPT-6 Astra / High.

## 2026-10-05 S2-07 bounded revision-history census — LOW-VOLUME 23/23 OBSERVABLE

PR #610 / `7e8a7415064bb1f1c5d23c3b1bbd6570c1df8274` physically froze and censused the exact 2026-04-05..2026-10-02 low-volume corporate-action event universe.

Scope:
- TWSE capital reduction = 9;
- TWSE par-value change = 1;
- TPEx capital reduction = 9;
- TPEx par-value change = 4;
- total = 23 events / 23 unique symbols.

Physical result:
- MOPS issuer transport ready = 23/23;
- same action-family issuer history observed = 23/23;
- issuer evidence on/before official effective date = 23/23;
- eventUniverseHash=`3e31779c36582bd70378d4b393ce0d4b2510bb84fe557686a0e51d3a2f604049`.

Revision-hint distribution:
- TWSE capital reduction: 6/9;
- TWSE par-value change: 0/1;
- TPEx capital reduction: 6/9;
- TPEx par-value change: 0/4.
No cancellation hint was observed in these 23 final-event symbol histories.

### Semantic boundary

23/23 observability is not revision completeness.

The next gate must distinguish:
1. events with explicit version-chain hints;
2. events with no revision hint but complete query evidence;
3. ambiguous action-family rows;
4. cancellation/no-cancellation evidence;
5. source-reported version time vs exact public knownAt.

### Exact continuation

1. build event-to-version linkage for the 23 frozen events;
2. add per-symbol query-integrity evidence needed for negative no-revision claims;
3. certify lane-level bounded correction/cancellation history only where every event is resolved;
4. preserve exact knownAt as a separate prospective-evidence debt;
5. after low-volume lane semantics are proven, shard the two high-volume ex-right/dividend lanes;
6. then integrate suspension/resumption + symbol-session evidence and RAW A1 lineage.

Still false:
`publicAvailabilityLatencyCertified=false`,
`knownAtVersionClockCertified=false`,
`authorityRevisionCoverageComplete=false`,
`revisionCoverageComplete=false`,
`noEventMayBeClaimed=false`,
`suspensionCoverageComplete=false`,
`symbolSessionCompletenessCertified=false`,
`technicalContinuityCertified=false`,
all trading authority false.

DATA_LANE correction ownership is unchanged. System 1 Formal Core remains LOCKED.


## 2026-10-05 S2-07 bounded revision event linkage V0.2 physical result

Authoritative physical execution:
- commit: `fc3eac9e35fe6eacf8fef9805e6578ed91fe1701`;
- workflow: `System2 Bounded Revision Event Linkage V0.2 Readonly`;
- run: `37287352394`;
- job: `111689298076`;
- conclusion: PASS.

Observed result:
- eventCount = 23;
- `REVISION_CHAIN_OBSERVED = 6`;
- `AMBIGUOUS_MULTIPLE_ACTION_GROUPS = 15`;
- `AMBIGUOUS_MULTIPLE_VERSION_CHAINS = 2`;
- resolvedCount = 6;
- ambiguousCount = 17;
- `eventLinkageCoverageComplete=false`;
- `boundedRevisionHistoryCoverageComplete=false`;
- `correctionHistoryComplete=false`;
- `cancellationHistoryComplete=false`;
- `knownAtVersionClockCertified=false`;
- `revisionCoverageComplete=false`.

Interpretation boundary:
- the 6 observed revision chains are bounded diagnostic evidence only;
- 17 events remain unresolved / ambiguous;
- this does not prove revision completeness, NO_EVENT, exact knownAt, technical continuity, session completeness, or any trading authority;
- cancellation absence is not inferred from lack of a cancellation row;
- normalized subject stem is not sufficient promotion linkage evidence because distinct corporate-action episodes for the same issuer can share a similar normalized stem.

Exact BUILD_LANE continuation:
1. narrower follow-up for the 17 ambiguous events;
2. per-symbol query-integrity;
3. event-specific linkage disambiguation using explicit event anchors, with subject stem only as supporting evidence;
4. cancellation / no-cancellation evidence;
5. shared suspension/resumption + symbol-session integration;
6. RAW A1 lineage.

This is BUILD_LANE checkpoint/evidence progression, not a REMEDIATION_LANE correction.


## 2026-10-05 S2-07 ambiguous-event narrowing V0.3 physical result

Authoritative physical execution:
- merge commit: `8252a0b8417cf63fd317bb645c3f835a55d7e976`;
- workflow: `System2 Bounded Revision Event Linkage V0.3 Readonly`;
- run: `37328246286`;
- job: `111824389195`;
- conclusion: PASS.

The 17 V0.2 ambiguous events narrowed into:
- `AMBIGUOUS_NO_EVENT_SPECIFIC_ANCHOR = 10`;
- `PER_SYMBOL_QUERY_INTEGRITY_NOT_CERTIFIED = 7`;
- queryIntegrityCertifiedCount = 10;
- eventAnchoredCount = 0.

The 10 query-integrity-certified events reconciled company-history keys exactly against month shards over their bounded 400-day pre-effective windows. Seven events exposed year-vs-month shard discrepancies and therefore remain fail-closed before any negative or linkage claim.

All promotion/completeness flags remain false, including event linkage completeness, bounded revision-history completeness, correction history completeness, cancellation history completeness, exact knownAt clock certification, revision coverage, technical continuity and trading authority.

Interpretation: V0.3 disproves the sufficiency of normalized subject stem as an event key. No ambiguous event obtained a direct effective-date title anchor. The next diagnostic must inspect the seven keyset discrepancies at row level and use official-event subtype/detail plus issuer disclosure chronology/stage as candidate event-specific anchors; no promotion linkage may be made from subject normalization alone.


## 2026-10-05 S2-07 linkage diagnostics V0.4 physical result

Authoritative physical execution after transport retry + diagnostic-variable fix:
- merge commit: `664fc36ab2a35dfd7e930e1bd0d05f37d4bb3fdc`;
- workflow: `System2 S2-07 Linkage Diagnostics V0.4 Readonly`;
- run: `37330025545`;
- job: `111830481109`;
- conclusion: PASS;
- System2 Research CI run `37330025009`: PASS.

Physical summary:
- eventCount = 17;
- v03ExactCount = 10;
- discrepancyEventCount = 7;
- discrepancyOnlyAllTotal = 0;
- discrepancyOnlyMonthTotal = 9;
- officialSubtypePresentCount = 12;
- officialDetailPresentCount = 17;
- promotionLinkageEstablishedCount = 0.

Important diagnostic finding:
- the V0.3 whole-company year-vs-month mismatch is too broad to be treated as corporate-action history incompleteness;
- the 9 month-only rows include unrelated issuer-name-change notices and par-value recurring notice rows;
- symbol 3591 reconciled 40=40 on the V0.4 rerun although V0.3 had shown 40 vs 30, demonstrating that source-query snapshots can change across observation times;
- therefore the next query-integrity gate must reconcile issuer + target action-family rows, retain observation-time provenance, and fail closed for target-family discrepancies instead of treating unrelated company disclosures as blockers.

Official-event evidence is richer than title stems: all 17 have official detail, 12/17 have subtype, and the detail carries stop/resume dates or par-value conversion terms. These fields can support event-specific disambiguation together with issuer-scope action-family chronology; normalized subject stem remains insufficient by itself.

All completeness, NO_EVENT, exact-knownAt, cancellation-completeness, technical-continuity, session-completeness and trading-authority flags remain false.


## 2026-10-05 S2-07 event-specific linkage V0.5 physical result

Authoritative physical execution:
- merge commit: `50aac2717c47f6e1bc6fd29d29dd867267d09887`;
- workflow: `System2 S2-07 Event-Specific Linkage V0.5 Readonly`;
- run: `37331662930`;
- job: `111836005547`;
- conclusion: PASS.

Regression evidence around the same BUILD_LANE sequence:
- V8 Regression Tests run `37331377958`: PASS;
- V0.4 diagnostic rerun `37331377874`: PASS.

Physical summary:
- eventCount = 17;
- actionFamilyQueryIntegrityExactCount = 13;
- periodicNoticeOnlyDivergenceCount = 3;
- eventSpecificAnchorCandidateCount = 13;
- correctionObservedCount = 5;
- cancellationObservedCount = 0;
- promotionLinkageEstablishedCount = 0.

The four remaining action-family query-integrity divergences are all PAR_VALUE_CHANGE events: 6949 / 2026-09-07, 8937 / 2026-04-13, 5904 / 2026-08-10, and 4747 / 2026-08-31.

The 13 exact events have issuer + target-action-family keyset reconciliation and diagnostic event-specific anchors based on official event identity/detail plus issuer chronology. These remain bounded research candidates, not promotion-grade linkage and not trading authority.

Positive correction evidence is observed for five events: 3356, 3591, 1441, 6241, 4806. No cancellation disclosure was observed inside the V0.5 semantic episode candidates, but absence is not negative proof: `cancellationHistoryComplete=false` and no-cancellation may not be claimed.

All completeness / exact-clock / technical-continuity / trading-authority flags remain false.

Next exact BUILD_LANE continuation:
1. resolve the four PAR_VALUE_CHANGE source-divergence semantics at row/provenance level;
2. formalize cancellation state as positive-observed vs not-certified, never NO_CANCELLATION by absence;
3. determine which bounded event-specific candidates meet promotion evidence requirements without subject-stem dependence;
4. then continue shared suspension/resumption + symbol-session integration;
5. then RAW A1 lineage.


## 2026-10-06 S2-07 V0.3 ambiguous-event narrowing physical result

Authoritative execution:
- main commit: `8252a0b8417cf63fd317bb645c3f835a55d7e976`;
- workflow: `System2 Bounded Revision Event Linkage V0.3 Readonly`;
- run: `37328246286`;
- job: `111824389195`;
- conclusion: PASS.

Physical result over the 17 V0.2 ambiguous events:
- eventCount = 17;
- `AMBIGUOUS_NO_EVENT_SPECIFIC_ANCHOR = 10`;
- `PER_SYMBOL_QUERY_INTEGRITY_NOT_CERTIFIED = 7`;
- queryIntegrityCertifiedCount = 10;
- eventAnchoredCount = 0.

The 10 exact per-symbol company-history vs month-shard reconciliations are: 6176, 1563, 3356, 1441, 6550, 6129, 3710, 8277, 4806, 3086.

The 7 query-integrity mismatches requiring direct diagnostic follow-up are:
- 3591: all=40 / monthUnion=30 / onlyAll=10 / onlyMonth=0;
- 6949: all=72 / monthUnion=73 / onlyAll=0 / onlyMonth=1;
- 5381: all=58 / monthUnion=60 / onlyAll=0 / onlyMonth=2;
- 6241: all=57 / monthUnion=60 / onlyAll=0 / onlyMonth=3;
- 8937: all=49 / monthUnion=50 / onlyAll=0 / onlyMonth=1;
- 5904: all=44 / monthUnion=45 / onlyAll=0 / onlyMonth=1;
- 4747: all=42 / monthUnion=43 / onlyAll=0 / onlyMonth=1.

Interpretation:
- V0.3 successfully separated query-integrity from event-linkage ambiguity;
- no event acquired promotion-grade event anchoring;
- an effective-date token in the issuer subject is too strict and produced zero anchored events, so it must not be treated as a completeness gate;
- normalized subject stem remains supporting evidence only and must never be the sole corporate-action episode key.

All authority flags remain false: eventLinkageCoverageComplete, boundedRevisionHistoryCoverageComplete, correctionHistoryComplete, cancellationHistoryComplete, knownAtVersionClockCertified, revisionCoverageComplete, technicalContinuityCertified, and tradingAuthority.

Next BUILD_LANE continuation:
1. diagnose the 7 per-symbol all-query vs month-shard mismatches, including repeated-snapshot stability;
2. replace title-only effective-date anchoring with event-specific disambiguation evidence tied to source event identity / issuer / action family / effective date and, where available, official detail fields;
3. cancellation / no-cancellation evidence;
4. shared suspension/resumption + symbol-session integration;
5. RAW A1 lineage.


## 2026-10-06 standing SDA validation pointer

This is an audit dependency pointer only. It does not replace the active S2-07 BUILD_LANE continuation.

Latest canonical validation:
- SDA-016: research/SDA016_VALIDATION_ORACLE_20261006_V0_5.json — 58 blocking tests;
- SDA-017: research/SDA017_VALIDATION_ORACLE_20261006_V0_4.json — 56 blocking tests;
- D18 support schema: research/D18_REPLICATION_SUPPORT_RECEIPT_CONTRACT_20261006_V0_1.json;
- shared routing: shared-knowledge/STOCK_SELECTION_AUDIT_ENGINEERING_ROUTING_20261005_V0_1.md.

System 2 has not yet been credited with the SDA-017 episode/support observer implementation. Existing S2-07 revision/query-integrity work is valid but must not be counted as SDA-016/017 remediation.

When the assigned SDA lane is serviced:
- preserve structuralEpisodeN / replicationEpisodeN / mechanicalFragmentN separately;
- preserve learned-fit knowledge cutoff;
- use the shared SDA-016 consumption authority rather than forking incompatible holdout semantics;
- pass the latest 48-test contracts before specialist/00 closure.

No change to current correction/build ownership, trading authority, Formal Core or capture authorization is made by this pointer.


## 2026-10-06 S2-07 V0.4 per-symbol query-integrity physical result

Authoritative execution:
- commit: `bf94fcd267c0f87ca42df24935a4be5052247ac6`;
- workflow: `System2 Bounded Revision Query Integrity V0.4 Readonly`;
- run: `37376748993`;
- job: `111987637837`;
- conclusion: PASS.

Physical classification of the seven V0.3 query-integrity mismatches:
- `EXACT_KEYSET_RECONCILIATION = 1` (3591);
- `MONTH_SHARD_SUPERSET = 6` (6949, 5381, 6241, 8937, 5904, 4747).

Repeated `month=all` snapshots were stable. Therefore the six residual mismatches are not transient all-query nondeterminism in this run; the bounded month-shard union exposed additional rows that the stable all-query omitted. These six remain query-integrity unresolved for negative-history claims.

Important boundary:
- 3591 may advance only its per-symbol query-integrity gate;
- the six MONTH_SHARD_SUPERSET symbols do not support a negative no-revision/no-cancellation inference from `month=all`;
- none of this proves event linkage, revision completeness, cancellation completeness, NO_EVENT, exact knownAt, technical continuity, session completeness, or trading authority.

Next BUILD_LANE step: event-specific linkage disambiguation packets must use source event identity + issuer + action family + effective date + authority/detail evidence and preserve candidate rows separately. Normalized subject stem may be retained only as supporting text and must never be the sole episode key.


## 2026-10-06 SDA-022 cross-system non-convergence intake

Canonical guard:
shared-knowledge/SYSTEM1_SYSTEM2_NON_CONVERGENCE_GUARD_V0_1.md

System2 must preserve architectural independence from System1:
- System1 A/B, Top6/3+3, Formal ranking and 15m confirmation are not System2 prerequisites;
- strategy-local candidate generation/ranking must remain independently executable where its own required inputs are available;
- shared raw evidence/PIT/lineage is allowed and preferred;
- same stock may be selected by both systems, but the policy path must remain independently traceable;
- no claim of "two independent confirmations" from the same source/root without D16 dependence analysis.

This pointer does not replace the active S2 BUILD_LANE or authorize any live ranking/strategy mutation.


## 2026-10-06 SDA-022 fingerprint / NC-T01 intake

Canonical artifacts:
- shared-knowledge/CROSS_SYSTEM_POLICY_FINGERPRINT_CONTRACT_V0_1.md
- shared-knowledge/SYSTEM1_SYSTEM2_POLICY_FINGERPRINT_BASELINE_20261006_V0_1.md
- shared-knowledge/SDA022_D16_VALIDATION_REQUEST_V0_1.md

System2 exact SDA-022 responsibility:
1. emit strategy-specific policy fingerprints without changing strategy logic;
2. preserve current multi-strategy identities and no-universal-score boundary;
3. execute NC-T01 when the relevant lane is available: strategy candidate generation with System1 Top6/rank unavailable but shared raw source receipts still available;
4. physical proof must distinguish DESIGN_INDEPENDENT from PHYSICALLY_INDEPENDENT;
5. do not force different picks and do not use System1 output as a hidden fallback.

This intake does not replace the active BUILD_LANE and authorizes no live selection/ranking mutation.


## 2026-10-06 SDA-022 acceptance oracle pointer

Latest acceptance authority:
- shared-knowledge/SDA022_ACCEPTANCE_ORACLE_V0_1.md
- shared-knowledge/sda022_acceptance_oracle_v0_1.json

System2 fingerprint work must satisfy S22-T06~T10.
NC-T01 physical independence work must satisfy S22-T11~T16.

Important:
- design text cannot upgrade physicalIndependentDiscovery;
- synthetic fixtures may validate schema/contract only;
- hidden fallback to cached/persisted System1 Top6/rank fails NC-T01;
- a legitimate zero-pick remains valid if distinguishable from dependency/data/runtime failure.

This pointer does not reorder the active BUILD_LANE and authorizes no strategy/ranking mutation.


## 2026-10-06 SDA-022 machine receipt schema pointer

Machine schemas:
- shared-knowledge/cross_system_policy_fingerprint_receipt_schema_v0_1.json
- shared-knowledge/sda022_nc_t01_receipt_schema_v0_1.json

Next System2 SDA-022 outputs:
1. one strategy-policy fingerprint receipt per audited strategy, conforming to the fingerprint schema and S22-T06~T10;
2. NC-T01 physical independence receipt conforming to the NC-T01 schema and S22-T11~T16.

Synthetic fixtures may test schema behavior but cannot set PHYSICALLY_INDEPENDENT_PATH_OBSERVED.
This pointer authorizes no ranking/strategy/live behavior change.


## 2026-10-06 S2-16 institutional terminal shell V0.1

BUILD_LANE implemented the first complete System 2 operating-interface shell from the existing Institutional Monitoring UI North-Star contract.

New read-only terminal surfaces:
- Market Command Center;
- Candidate Board;
- Decision Workspace;
- Virtual Positions;
- Resonance Center;
- Strategy Center;
- Performance Center;
- Event / Industry;
- Evidence / System.

Routes:
- `/` and `/terminal` -> new institutional terminal;
- `/resonance` -> existing dedicated resonance page preserved.

The shell binds only existing verified read APIs: health, bounded resonance, active pool, operations audit and daily Shadow diagnostic. Pending Regime, actual holdings, performance and event/industry data remain visibly UNKNOWN / LOCKED rather than being synthesized.

Authority boundary remains unchanged: no strategy/assessor change, no capacity mutation, no push, no orders, no actual holdings claim, no final-selection authority and no System 1 Formal Core change.

Next S2-16 wiring order follows S2-07 frozen candidate/read API -> Regime/market context -> virtual positions -> frozen decision/history -> performance -> PIT-safe event/industry.


## 2026-10-06 S2-16 institutional terminal shell V0.1 — PHYSICALLY VERIFIED

Physical deployment acceptance:
- UI implementation merge: `95c85a4dfea513394caa265cb13b56fcabcbcc1f` (PR #654);
- D1 read-only deploy fast-path merge: `b2ae3488309df83bf9a6399c81ec5b1321ce2be2` (PR #655);
- terminal verification repair merge: `92b565c0effe217d0bf10188b2409728e727673c` (PR #656);
- deployment workflow: `System2 Daily Resonance Deploy` run `37389121118` / job `112029719361` = PASS.

Verified runtime facts:
- public Worker: `https://system2-shadow-research.imihan0630.workers.dev`;
- `/` and `/terminal` serve the institutional System 2 terminal shell;
- `/resonance` remains the dedicated resonance page;
- health, resonance, operations, daily diagnostic and terminal UI checks passed in the deployment workflow;
- System 2 D1 readiness used `READ_ONLY_FAST_PATH` with schemaVersion `1.1`, tableCount `46`, requiredTablesPresent=true, schemaMutationPerformed=false and writeReadVerification=`SKIPPED_ALREADY_READY`;
- one System 2 Cron remains `*/5 0-5,11 * * MON-FRI`;
- `captureState=CAPTURE_DISABLED` and `resonanceState=BOUNDED_RESONANCE_SCHEDULED`;
- `system1RuntimeUsed=false`;
- System 1 production files were verified unchanged.

Current UI truth boundary:
- complete operating shell / navigation / responsive layout is physically deployed;
- existing verified read APIs are live-bound;
- Market Regime, full daily candidate/frozen-decision population, virtual-position read API, performance cohorts, and PIT-safe event/industry read APIs remain pending and must display UNKNOWN / LOCKED / PENDING rather than synthetic data;
- actual holdings remain locked under `ACTUAL_HOLDINGS_SOURCE_NOT_WIRED` and `ACTUAL_POSITION_MONITOR_VERIFIED=false`;
- no strategy, selection, capital, push, order or Formal Core authority was promoted.


## 2026-10-06 systemwide readiness reconciliation pointer

Canonical audit:
shared-knowledge/SYSTEMWIDE_LAUNCH_READINESS_GOVERNANCE_AUDIT_20261006_V0_1.md

Current cross-system validation authority:
- SDA-016 = V0.5 / 58 blocking tests;
- SDA-017 = V0.4 / 56 blocking tests.

Current System2 product readiness must remain split:
- infrastructure/terminal = substantially ready;
- terminal governance = S2-CORR-20261006-002 FIX_IMPLEMENTED, independent verification pending;
- DATA_LANE = active/partial; 2021 TPEx blocked by canonical A1 revision/as-of semantics while independent later-year population may continue;
- selection-to-capacity = INCOMPLETE;
- resonance = research/shadow monitor only;
- actual holdings/live trading = not wired/disabled.

SDA-022 current upstream state:
- System1 fingerprint S22-T01~T05 PASS;
- D16 prereg S22-T25~T28 PASS;
- System2 fingerprints S22-T06~T10 PENDING;
- physical NC-T01 S22-T11~T16 PENDING.

This pointer does not reorder BUILD_LANE/DATA_LANE/REMEDIATION_LANE ownership and authorizes no strategy, ranking, final-selection, push, order or System1 Formal mutation.


## 2026-10-06 post-audit correction drift pointer — CORR-003

Latest Correction Queue:
- S2-CORR-20261006-002 = VERIFIED_CLOSED.
- S2-CORR-20261006-003 = OPEN / BUILD_LANE.

CORR-003 exact boundary:
- formal Candidate Board rows must remain distinct from monitor-only resonance/pool fallback rows;
- UNRESOLVED_STRATEGY must not be promoted into resolved candidate identity;
- strategy filtering must use canonical candidate strategy identity;
- Decision Workspace must not upgrade a monitor row into formal candidate/frozen-decision readiness;
- protected strategy logic, assessor policy, ranking/capacity, final-selection, push/orders and System1 Formal Core remain unchanged.

System2 SDA-022 remains:
T06~T10 PENDING / NC-T01 T11~T16 PENDING.
No physical fingerprint or NC-T01 receipt has been accepted by 00 yet.

This correction remains BUILD_LANE-owned and does not authorize other lanes to mutate its conflict unit.


## 2026-10-06 CORR-003 closed / CORR-004 active pointer

- S2-CORR-20261006-003 = VERIFIED_CLOSED.
- Independent receipt: system2/evidence/s2_corr_20261006_003_independent_verification.json.
- S2-CORR-20261006-004 = OPEN / BUILD_LANE.

CORR-004 must bind current terminal resonance to the current Taipei marketDate or explicitly classify prior-session rows as stale/historical and exclude them from current active surfaces/counts. Same-day success and explicit historical-query behavior must remain supported.

This pointer changes no resonance formula, bounded-pool logic, S2-07 candidate authority, strategy logic, ranking/capacity, push/orders or System1 Formal Core.


## 2026-10-06 S2-07 Par-Value Divergence V0.6 physical result

Authoritative execution:
- merge commit: `97cd68011fd6a938d39a23b77e1eafb43404b269`;
- workflow: `System2 S2-07 Par-Value Divergence V0.6 Readonly`;
- run: `37479166318`;
- job: `112322457257`;
- conclusion: PASS.

Physical summary:
- eventCount = 4;
- yearAllSubsetOfMonthUnionCount = 4;
- monthOnlyRowCount = 4;
- `MONTH_ONLY_RECURRING_NOTICE_COPY = 3`;
- `MONTH_ONLY_STOP_DATE_FACE_VALUE_NOTICE = 1`;
- cancellationDisclosureObservedCount = 0;
- noCancellationCertifiedCount = 0;
- sourceSemanticsCertified = false;
- monthShardCoverageComplete = false;
- promotionLinkageEstablishedCount = 0;
- knownAtVersionClockCertified = false;
- technicalContinuityCertified = false;
- tradingAuthority = false.

Row-level disposition:
- 6949 / 2026-09-07 -> one month-only recurring face-value notice;
- 8937 / 2026-04-13 -> one month-only stop-date face-value notice;
- 5904 / 2026-08-10 -> one month-only recurring face-value notice;
- 4747 / 2026-08-31 -> one month-only recurring face-value notice.

Boundary:
the four V0.5 source divergences are now explained at bounded row/provenance classification level, but the extra rows remain lineage and cannot be discarded. Absence of cancellation disclosure is still history-incomplete, not NO_CANCELLATION.

Next exact BUILD_LANE continuation:
1. freeze promotion-evidence requirements that do not depend on normalized subject stem;
2. evaluate the 13 V0.5 exact event-specific candidates against that contract;
3. exclude the four V0.6 divergence cases from promotion-grade linkage until separately source-certified;
4. shared suspension/resumption + symbol-session integration;
5. RAW A1 lineage.


## 2026-10-06 S2-07 Promotion Linkage V0.7 physical result

Authoritative execution:
- repair merge: `84c0bc0c66a68eb3f01b5f2fddd3e658dd3cf81a` (PR #698);
- workflow: `System2 S2-07 Promotion Linkage V0.7 Readonly`;
- run: `37481645101`;
- job: `112330996478`;
- conclusion: PASS.

Physical summary:
- eventCount = 17;
- promotionEvidenceReadyCount = 7;
- promotionEvidenceBlockedCount = 10;
- promotionLinkageEstablishedCount = 7;
- cancellationObservedCount = 0;
- noCancellationCertifiedCount = 0;
- blockerCounts: TRANSPORT_NOT_READY=8, PAGINATION_NOT_CERTIFIED=8, SOURCE_QUERY_INTEGRITY_NOT_EXACT=6, EVENT_SPECIFIC_ANCHOR_NOT_ESTABLISHED=6, SEMANTIC_EPISODE_NOT_CERTIFIED=2.

Ready bounded events:
1563, 1441, 6550, 5381, 6241, 4806, 3086.

Important boundary:
`promotionLinkageEstablished=true` is only bounded event-linkage evidence grade. It does not establish full history completeness, exact knownAt, technical/session continuity, strategy/candidate authority, push/order/capital or trading authority. All corresponding authority/completeness flags remain false.

The initial V0.7 push failed because a PAR_VALUE_CHANGE unit fixture omitted chronology/aligned-episode fields while expecting promotion=true; the evaluator correctly failed closed. PR #698 repaired the fixture and tightened the chronology gate. The authoritative V0.7 physical workflow then passed.

Next exact BUILD_LANE continuation:
1. shared suspension/resumption + symbol-session integration;
2. preserve event-linkage vs continuity separation;
3. RAW A1 lineage after continuity provenance is explicit.


## 2026-10-06 S2-07 Symbol-Session Integration V0.8 physical result

Authoritative execution:
- implementation merge: `d7e7a99a032b99a1b6ba9911886912e89b6f0797` (PR #708);
- workflow: `System2 S2-07 Symbol Session Integration V0.8 Readonly`;
- run: `37488505236`;
- job: `112354734503`;
- conclusion: PASS;
- System2 Research CI `37488505308` PASS;
- V8 Regression `37488505279` PASS.

Physical result:
- eventCount = 17;
- promotionReadyCount = 7;
- boundedSymbolSessionEvidenceReadyCount = 0;
- blockedCount = 17;
- resumeDateObservedCount = 0;
- EVENT_LINKAGE_PROMOTION_NOT_READY = 10;
- SUSPENSION_RESUMPTION_MATCH_NOT_OBSERVED = 17;
- noSuspensionCertifiedCount = 0;
- suspensionCoverageComplete = false;
- symbolSessionCompletenessCertified = false;
- technicalContinuityCertified = false.

Source evidence:
- official market trading dates = 125 over 2026-04-05..2026-10-02;
- TWSE TWTAWU bounded population = 383 rows, artifact hash `10a78954777b94f838ad4996bad02891ef1e97597f684434b4c7b36d5a659857`;
- TPEx sprcHis bounded population = 30/30 rows, artifact hash `184c07e8cfd61f20a8cbf65ab49d2ab86ddac276da450eeed3938ec08c2ffe18`;
- neither source lane certifies all-history absence.

Interpretation:
the generic exchange halt/resumption population does not provide an exact resume-date match for any of the 17 frozen corporate-action events. This is negative source-family evidence, not NO_SUSPENSION evidence and not a reason to relax matching.

Next exact BUILD_LANE continuation:
1. extract corporate-action-native stop/resume schedule evidence from the already verified official continuity reference/detail lanes;
2. retain source-family identity instead of relabeling it as generic halt evidence;
3. bind only positive provenance-bearing schedule intervals to official market sessions;
4. unmatched cases remain `SUSPENSION_PROVENANCE_UNKNOWN`;
5. RAW A1 lineage only after bounded symbol-session evidence is positive.


## 2026-10-07 S2-07 Corporate-Action Native Schedule Integration V0.9 physical result

Authoritative execution:
- V0.9a diagnostic merge: `f9235e35de0fee5fb8f3296f59588cd81b8824fe` (PR #712);
- V0.9 implementation merge: `44212a6f3d8556d2ffc98a0f85b7d0e97b65f269` (PR #713);
- readonly workflow: `System2 S2-07 Native Schedule Integration V0.9 Readonly`;
- run `37492646263` / job `112369057180` = PASS;
- System2 Research CI `37492646329` = PASS;
- V8 Regression `37492646417` = PASS.

Physical summary:
- eventCount = 17;
- promotionReadyCount = 7;
- nativeScheduleCertifiedCount = 10;
- boundedNativeSymbolSessionEvidenceReadyCount = 4;
- blockedCount = 13;
- EVENT_LINKAGE_PROMOTION_NOT_READY = 10;
- NATIVE_SCHEDULE_DETAIL_NOT_SELF_DESCRIBING = 7;
- noSuspensionCertifiedCount = 0.

Positive bounded cases:
- 5381 / CAPITAL_REDUCTION: stop 2026-04-01 -> resume 2026-04-13;
- 6241 / CAPITAL_REDUCTION: stop 2026-08-18 -> resume 2026-08-25;
- 4806 / CAPITAL_REDUCTION: stop 2026-09-23 -> resume 2026-10-02;
- 3086 / PAR_VALUE_CHANGE: stop 2026-04-09 -> resume 2026-04-20.

Important source semantic split:
- TPEx `詳細資料` physically exposes explicit `停止買賣日期` / `恢復買賣日期` labels and can support bounded positive schedule evidence.
- TWSE current compact detail is not self-describing; its date tokens are preserved but are not promoted into stop-date semantics.

Authority boundary remains:
`rawA1LineageBound=false`, `technicalContinuityCertified=false`, selection/final-selection/push/capital/order=false, System1 unused.

Next exact BUILD_LANE continuation:
1. bind RAW A1 source lineage only for 5381, 6241, 4806, 3086;
2. prove expected-session / observed-bar provenance around each certified stop/resume interval without mutating history;
3. keep suspended sessions distinct from missing-data defects;
4. only after source-row lineage and session coverage pass may a later gate evaluate technical continuity;
5. all other 13 events remain blocked and must not inherit these four positives.


## 2026-10-07 S2-07 RAW A1 Lineage V1.0 physical result

Authoritative execution:
- implementation merge: `4c2350b499f3412b6a2be650c5d601ace2eea760` (PR #718);
- workflow: `System2 S2-07 RAW A1 Lineage V1.0 Readonly`;
- run `37496251790` / job `112381430570` = PASS;
- System2 Research CI `37496251753` = PASS;
- V8 Regression `37496251698` = PASS.

Physical result:
- bounded case count = 4;
- `rawA1LineageReadyCount = 1`;
- READY = 4806;
- BLOCKED = 5381, 6241, 3086;
- blocker counts: `PRE_SUSPENSION_RAW_A1_BAR_MISSING=3`, `RESUME_RAW_A1_BAR_MISSING=3`;
- D1 read-only metrics: requestCount=6, rowsRead=12, rowsWritten=0.

4806:
- previous official session = 2026-09-22;
- native stop/resume interval = 2026-09-23 -> 2026-10-02;
- exactly two provenance-bearing RAW A1 rows exist at the bounded endpoints;
- zero RAW A1 rows exist on the certified suspended official sessions;
- both endpoint rows remain `continuityState=UNVERIFIED`;
- `rawA1LineageBound=true` only for this bounded case.

5381 / 6241 / 3086:
- current isolated D1 contains zero RAW A1 rows in each bounded pre-suspension-to-resume query window;
- these are persisted-history coverage blockers, not proof of technical-continuity failure;
- BUILD_LANE must not ad-hoc backfill them; historical population remains DATA_LANE-owned.

Authority boundary remains:
`rawBarsMutated=false`, `adjustedPriceGenerated=false`, `continuityTransformPerformed=false`, `technicalContinuityCertified=false`, selection/final-selection/push/capital/order=false, System1 unused.

Next exact BUILD_LANE continuation:
1. freeze a bounded technical-continuity contract for 4806 only;
2. require independent adjustment/reference-price provenance rather than inferring continuity from price shape;
3. keep 5381 / 6241 / 3086 blocked until canonical DATA_LANE RAW A1 coverage exists;
4. do not generalize 4806 to the remaining event population.


## 2026-10-07 S2-07 Technical Continuity Bridge V1.1 physical result

Authoritative execution:
- implementation/trigger merge: `2250ba518e4e6b0e64d2df31406ffe51a9b752df` (PR #724);
- workflow: `System2 S2-07 Technical Continuity Bridge V1.1 Readonly`;
- merged-main run `37534597007` / job `112512227519` = PASS;
- merged-main System2 Research CI `37534597078` = PASS;
- PR V8 Regression `37534399074` = PASS.

Physical result for the only V1.0-ready case, 4806:
- official pre-action close = 10.4;
- official reference price = 14.87;
- official reference ratio = 1.4298076923076921;
- RAW pre-suspension close = 10.4;
- transformed pre-suspension close = 14.87;
- RAW resume open / close = 13.7 / 13.4;
- residual open gap = -7.86819098856758%;
- residual close move = -9.885675857431064%;
- bridge state = `BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED`;
- bridge blockers = none.

PIT boundary:
- official `knowledgeTimeMode=HISTORICAL_UNKNOWN`;
- `firstKnownAt=null`;
- `availableAt=null`;
- `pitEventReplayEligible=false`;
- `pitReplayBlocker=OFFICIAL_EVENT_KNOWLEDGE_CLOCK_HISTORICAL_UNKNOWN`.

Read-only / authority boundary:
- D1 requestCount=3 / rowsRead=9 / rowsWritten=0;
- raw history mutated=false;
- adjusted history persisted=false;
- continuity transform performed=false;
- `technicalContinuityCertified=false`;
- all-history continuity=false;
- selection/final-selection/push/capital/order=false;
- System1 runtime unused.

5381 / 6241 / 3086 remain DATA_LANE RAW A1 coverage-blocked and do not inherit 4806's positive result.

Next exact BUILD_LANE continuation:
1. investigate official reference-event historical availability/version-clock provenance only;
2. do not infer or backdate `firstKnownAt` / `availableAt`;
3. if historical availability cannot be independently proven, keep PIT replay blocked;
4. no strategy/ranking/candidate authority may consume this bridge before the PIT gate is resolved.


## 2026-10-07 S2-07 Reference Event Historical Availability V1.2 physical acceptance

Physical receipt:
- PR #729 merged V1.2 runtime into main as `777b5876917774a5ad4c32eac3e563df2b3acfe5`.
- Receipt PR #732 rebased the physical check on that merged main state.
- Dedicated workflow run `37538390532`, job `112525069738`: PASS.
- System1 isolation guard: PASS.
- exact stable reference identity uses `semanticHash + sourceRowHash`, not capture-specific `eventVersionId`.
- stable semantic hash: `b6a4c97fdf3ded2bdae7048852540e4f58c1a64da4cbc012e350d5227e20d869`.
- stable source-row hash: `518fcdf6b0f3d5dc8ffaafba59556c86da3cda76dd0e46c528217740c33ae92b`.
- observed eventVersionId for this run: `S2-CA-EVENT:82da757e780d7be2c3474f5ca505d385b55705d44b520f291dc7383f88c391ca`; this is receipt provenance only.
- MOPS capital-reduction family rows: 18.
- 2026 event semantic seed: `2026-02-24|16:28:25|3`.
- semantic-aligned 2026 episode rows: 8 / 8 source-clock eligible / 8 retrospective-only.
- independent historical public-availability evidence: 0.
- state: `REFERENCE_EVENT_HISTORICAL_AVAILABILITY_NOT_PROVEN`.
- PIT blocker: `OFFICIAL_REFERENCE_EVENT_HISTORICAL_AVAILABILITY_UNPROVEN`.
- `firstKnownAt=null`, `availableAt=null`, `pitEventReplayEligible=false`.
- no history mutation, no adjusted-history persistence, no selection/push/capital/order authority, System1 unused.

Accepted conclusion:
V1.2 closes the **investigation ambiguity**, not the PIT gate. Current official/MOPS evidence does not authorize reconstructing a historical public-availability clock for the exact TPEx 4806 reference-price row. 4806 therefore remains bounded research geometry only; PIT replay continuity stays blocked unless new independent exact-source availability evidence appears.

Next BUILD_LANE rule:
- do not repeat blind historical-clock promotion attempts for 4806 without new evidence class;
- continue non-conflicting S2-07/build work;
- 5381 / 6241 / 3086 remain DATA_LANE RAW A1 coverage-owned blockers;
- all trading/selection authority remains false.


## 2026-10-07 S2-07 Official Reference Availability Observer V1.3 physical acceptance

Physical acceptance:
- PR #733 dedicated workflow run `37539208003`, job `112527770695`: PASS.
- System2 Research CI run `37539207913`: PASS.
- no-scheduler/read-only/System1 isolation: PASS.
- exact reference: 4806 / TPEX / CAPITAL_REDUCTION / effective 2026-10-02.
- stable semantic hash: `b6a4c97fdf3ded2bdae7048852540e4f58c1a64da4cbc012e350d5227e20d869`.
- stable source-row hash: `518fcdf6b0f3d5dc8ffaafba59556c86da3cda76dd0e46c528217740c33ae92b`.
- genuine current prospective observation: `2026-10-06T22:13:44.304Z` (2026-10-07 06:13:44.304 Asia/Taipei).
- evidence class: `PROSPECTIVE_EXACT_VERSION_OBSERVER`.
- current-row public availability is proven by that observation time only; exact publication latency remains uncertified.
- applying this late observation to the historical 4806 replay cutoff 2026-10-02 15:30 Asia/Taipei returns `REFERENCE_PUBLIC_AVAILABILITY_NOT_PROVEN_BY_CUTOFF`.
- applying the same receipt at its actual observation cutoff returns `REFERENCE_PUBLICLY_OBSERVED_BY_CUTOFF`.
- this proves the adapter preserves causal time and refuses backdating.

Boundary:
- `eventVersionId` is still receipt provenance only; stable identity remains `semanticHash + sourceRowHash`.
- no high-frequency polling is required merely for by-cutoff causality.
- no selected-only post-parent capture is authorized.
- no Cron/scheduler was added.
- full market-wide/full-eligible source cut is not yet implemented.
- `noRevisionGapThroughCut=false` / not certified.
- symbol-session completeness and TECHNICAL_CONTINUITY remain uncertified.
- no strategy/ranking/candidate/push/capital/order authority; System1 untouched.

Next exact BUILD_LANE continuation:
1. bind V1.3 exact-reference observations into a shared-owner pre-parent evidence-cut manifest;
2. preserve market-wide/exchange-wide or full-eligible scope; selected-only remains forbidden;
3. reconcile expected vs observed exact-version keysets with append-only provenance;
4. implement late-discovered-pre-cut version falsification for `noRevisionGapThroughCut`;
5. only after that, bind symbol-session completeness and continuity receipts to genuine parent generations.


## 2026-10-07 S2-07 Pre-Parent Evidence Cut V1.4 physical acceptance

Authoritative implementation:
- PR #734 merged as `deb426f5611a500826b212346c7f846bfe72b568`.
- dedicated `System2 S2-07 Pre-Parent Evidence Cut V1.4 Readonly` run `37542639896` / job `112539041612`: PASS.
- System2 Research CI run `37542639932`: PASS.
- base..head comparison changed only five new System2 V1.4 files; System1/Formal files changed = 0.

Current physical diagnostic intentionally fails closed:
- V1.3 exact-reference observation stable key = `ef283de5c542e277e42105f12115cffe4d35a5a3b85fcb4c2f3db5c66fb5ba94`;
- evidence cut state = `PRE_PARENT_EVIDENCE_CUT_BLOCKED`;
- blockers = `EVIDENCE_CUT_SCOPE_INVALID`, `SELECTED_ONLY_CAPTURE_FORBIDDEN`, `MARKET_SCOPE_COVERAGE_MISMATCH`, `EXPECTED_VERSION_KEYSET_NOT_CERTIFIED_COMPLETE`;
- evidenceCutId = `S2-ECUT:b202ee83c3919878238a802c28c0e599b6032ae00e1fd5ef227a9d2a844a36f5`;
- sourceCutManifestHash = `609acccecf41544cb841eda3b64d0148348bdbd30bc26d89b4890d048902e1ec`;
- `preCutManifestReady=false`;
- `noRevisionGapThroughCut=false`.

The two-point reconciler is physically exercised and remains blocked on the current single-sample input. Unit tests separately prove the positive complete-scope contract, late-observation rejection, late-discovered-pre-cut falsification, allowed genuinely later versions, and payload-mutation rejection. Historical `sourceReportedAt` is permitted only as a falsification clock, never for positive historical admission.

V8 Regression run `37542639814` fails only at the pre-existing main test `tests/test_sda016_formal_c1_binding_governance_sync_v0_1.mjs`: it still expects `V0_5_58_TEST_ORACLE` while current main SDA-016 readiness is already `V820_PRODUCTION_VERIFIED_FIRST_SCHEDULED_DATE_INELIGIBLE_GENUINE_BINDING_PENDING_T48_OPEN_SHARED_AUTHORITY_PENDING`. `PRICE_VOLUME_CHECKPOINT.md` already records this exact stale baseline assertion and instructs other lanes not to mutate SDA-016 merely to force green CI. V1.4 does not modify that System1 conflict unit.

Authority boundary:
- no scheduler/Cron added;
- history mutation=false;
- symbol-session completeness=false;
- technical continuity=false;
- selection/final-selection/push/capital/order=false;
- System1 runtime unused;
- Formal Core unchanged.

Next exact BUILD_LANE continuation:
1. implement a genuine market-wide / exchange-wide / full-eligible pre-parent capture from verified official source lanes;
2. freeze the complete expected exact-version population before the parent cutoff;
3. persist immutable evidence-cut identity and source hashes;
4. run post-parent bounded-complete reconciliation;
5. only after `noRevisionGapThroughCut` passes bind symbol-session completeness and continuity receipts to genuine parent generations.


## 2026-10-07 S2-07 Pre-Parent Evidence Cut V1.4.1 identity-domain correction — PHYSICAL PASS

V1.4 post-merge integration audit found an identity-domain mismatch: V1.3 official reference-row `stableReferenceKey` had been accepted into a generic exact-version keyset while downstream `noRevisionGapThroughCut` uses MOPS disclosure-version `versionKey/sourceReportedAt` semantics. These identities are not interchangeable.

PR #736 merged as `4748b4dd6e3a9c91cfa1567c0c6c0bf21d3eca69` and supersedes V1.4 for pre-parent identity semantics. No authority was ever granted by V1.4 and its physical cut was blocked, so no replay, selection, push, capital or order result was contaminated.

Physical verification:
- dedicated V1.4.1 run `37543866544`: PASS;
- System2 Research CI `37543866598`: PASS;
- physical diagnostic retains one accepted V1.3 reference observation but zero MOPS observations;
- `referenceIdentityDomainCountsTowardMopsKeyset=false`;
- `mopsIdentityDomainCountsTowardNoRevisionGap=true`;
- current cut remains `PRE_PARENT_EVIDENCE_CUT_BLOCKED`;
- blockers: `REQUIRED_MARKET_WIDE_LANE_COUNT_MISMATCH`, `EXPECTED_MOPS_KEYSET_NOT_CERTIFIED_COMPLETE`;
- `preCutManifestReady=false`;
- `noRevisionGapThroughCut=false`.

V1.4.1 now freezes three separate evidence domains:
1. exactly eight required market-wide source lanes;
2. prospective MOPS exact disclosure versions, including exact-version payload hash, `sourceReportedAt` and first-observed clock;
3. V1.3 official reference-row availability observations, retained only as bounded reference evidence.

Only domain (2) may enter the MOPS expected/observed keyset and later no-revision-gap reconciliation. Historical `sourceReportedAt` remains falsification-only and cannot positively backfill a missing historical version.

V8 Regression `37543866464` reproduces the already documented pre-existing SDA-016 stale assertion and is outside BUILD_LANE ownership; no System1/Formal file changed.

Next exact BUILD_LANE continuation:
1. build the genuine eight-lane market-wide source cut;
2. prospectively capture MOPS exact versions for the frozen event population;
3. use exact-version row/content hashes, not page-level hashes, for version mutation detection;
4. freeze the complete expected MOPS keyset before parent cutoff;
5. post-parent run bounded-complete MOPS reconciliation;
6. only after `noRevisionGapThroughCut` passes bind symbol-session and technical-continuity receipts.

## 2026-10-07 S2-07 Eight-Lane Market-Wide Source Cut V1.5 — PHYSICAL PASS

Authoritative implementation:
- PR #738 merged as `34455da7f47016ee149ffeaa963f798251e9fe3d`;
- dedicated `System2 S2-07 Eight-Lane Market-Wide Source Cut V1.5 Readonly` run `37545155428` / job `112547281624`: PASS;
- System2 Research CI run `37545155258`: PASS;
- physical artifact `11450381019`, digest `sha256:24f955376900366f929ec9739f42ea07fa6db1fc102ec5ce7ae7f00a265e6157`;
- V8 Regression `37545155314` reproduced only the already documented SDA-016 stale assertion and did not implicate any V1.5/System2 file.

Physical source cut:
- interval = 2026-04-05..2026-10-07;
- evidenceCutoffAt = `2026-10-06T23:12:23.799Z` (2026-10-07 07:12:23.799 Asia/Taipei);
- state = `EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_READY`;
- sourceCutId = `S2-8LANE:55289262efdd48b2004494d86979873207e256ef645bea2a5d358b9fafed606d`;
- sourceLaneManifestHash = `1e8e4db2699a0e214123087c08ce390af85c547be71229b53ff6ea552f57b863`;
- 8/8 lanes eligible; TWSE=4 / TPEx=4; blockers=[].

Frozen lane results:
- TWSE ex-right/dividend actual: 1,131 rows / 836 ordinary symbols / exact range PASS;
- TWSE capital-reduction reference: 10 / 10 / exact range PASS;
- TWSE par-value-change reference: 1 / 1 / exact range PASS;
- TPEx ex-right/dividend actual: 936 / 614 / exact range PASS;
- TPEx capital-reduction reference: 11 / 11 / exact range PASS;
- TPEx par-value-change reference: 4 / 4 / exact range PASS;
- TWSE daily material information: 54 rows / 46 ordinary symbols / whole-snapshot parser PASS;
- TPEx daily material information: 29 rows / 21 ordinary symbols / whole-snapshot parser PASS.

Boundary:
- this closes the eight-lane whole-source snapshot gate only;
- `expectedMopsKeysetComplete=false`;
- `noRevisionGapThroughCut=false`;
- `preParentEvidenceCutReady=false`;
- symbol-session completeness=false;
- technical continuity=false;
- no scheduler/Cron, history mutation, selection/final-selection, push, capital or order authority;
- System1 runtime unused and Formal Core unchanged.

Durable evidence:
`system2/evidence/S2_07_EIGHT_LANE_MARKET_WIDE_SOURCE_CUT_V1_5_PHYSICAL_20261007.json`.

Next exact BUILD_LANE continuation:
1. prospectively capture MOPS exact disclosure versions for the frozen event population;
2. use exact-version row/content hashes, source-reported clock and first-observed clock;
3. freeze the complete expected MOPS version-key set before the parent cutoff;
4. bind V1.5 source-lane manifest + V1.4.1 MOPS version domain into the pre-parent evidence cut;
5. after the parent, run bounded-complete MOPS reconciliation and require `noRevisionGapThroughCut=true`;
6. only then bind symbol-session and technical-continuity receipts to genuine parent generations.

## 2026-10-07 S2-07 MOPS Exact-Version Population V1.6 — PHYSICAL PASS / MEMBERSHIP STABILITY BLOCKED

Implementation:
- PR #749 merged as `bc405245870d6e986cbbf709562ce93c320bb327`;
- superseded PR #742 was closed after its successful physical result was retained as an earlier prospective observation;
- latest-main dedicated V1.6 run `37548011614` / job `112556594405`: PASS;
- System2 Research CI `37548011621`: PASS;
- V8 Regression `37548011620`: PASS;
- latest artifact `11451716945`, digest `sha256:691e66ec3f279ef969b605ff8361052f4bc8c85d5b95655876b643d23786341a`.

Latest physical capture:
- frozen event scope = 23 events / 23 unique symbols;
- stable semantic event-universe hash = `b7941323ed1969a17697bc58be3d549b7e244f4dfc45b81a0bc6d5645fc305b0`;
- global MOPS version identity includes stock code + source-reported clock + seqNo;
- 161 unique global exact-version keys observed;
- all 23 frozen symbols covered;
- annual/month-shard exact keyset = 21/23 events;
- year-only versions = 7;
- month-only versions = 0;
- source-clock key collision count = 0;
- divergent latest-run events: 1441 (1 year-only) and 3086 (6 year-only);
- common annual/month versions have no payload-hash mismatch.

Repeated-capture falsification:
- prior successful V1.6 run `37547303476` / artifact `11451296954` observed 159 versions, 17/23 exact events, 9 month-only and 8 year-only;
- latest successful run observed 161 versions, 21/23 exact events, 0 month-only and 7 year-only;
- between successful runs, latest gained 9 exact-version identities and lost 7;
- common version payload mutation count = 0;
- therefore exact-version content identity is stable where the version is returned, but historical query membership is not stable enough to freeze the complete expected MOPS keyset from one capture.

Identity clarification:
- legacy V0.1 eventUniverseHash `3e31779c36582bd70378d4b393ce0d4b2510bb84fe557686a0e51d3a2f604049` included capture-specific `eventVersionId`;
- V1.6 `stableEventUniverseHash` intentionally hashes stable semantic event fields only and is not expected to equal the legacy receipt-bound hash.

Authority boundary remains locked:
- `sourceSemanticsCertified=false`;
- `monthShardCoverageComplete=false`;
- `expectedMopsKeysetComplete=false`;
- `noRevisionGapThroughCut=false`;
- `preParentEvidenceCutReady=false`;
- symbol-session completeness=false;
- technical continuity=false;
- no scheduler/Cron, history mutation, selection/final-selection, push, capital or order authority;
- System1 runtime unused; Formal Core unchanged.

Durable evidence:
`system2/evidence/S2_07_MOPS_EXACT_VERSION_POPULATION_V1_6_PHYSICAL_20261007.json`.

Next exact BUILD_LANE continuation:
1. implement repeated-capture exact-version union/stability reconciliation;
2. preserve the earliest observed-at upper bound across immutable receipts, never overwrite it with a later run;
3. classify membership drift by source query path and exact version;
4. require bounded repeated-capture stabilization before any complete expected MOPS keyset freeze;
5. only then bind the MOPS keyset with the accepted V1.5 eight-lane source manifest into the V1.4.1 pre-parent cut;
6. post-parent reconcile and require `noRevisionGapThroughCut=true` before symbol-session / technical-continuity binding.

## 2026-10-07 Owner decision — Actual Holdings via uploaded broker screenshot

Owner supersedes the prior actual-holdings-source uncertainty with this explicit System 2 source decision:

- authorized source = `USER_UPLOADED_BROKER_SCREENSHOT`;
- Owner uploads broker inventory/holdings image into ChatGPT;
- ChatGPT/vision assists extraction into a structured payload;
- deterministic validation preserves UNKNOWN and routes ambiguity/low confidence to `REVIEW_REQUIRED`;
- explicit confirmation is required before a snapshot can be written;
- confirmed data enters dedicated immutable `s2_actual_holdings_*` storage;
- every new snapshot reconciles against the prior snapshot without inventing intermediate fills/orders.

Permanent current broker/order boundary:
- broker holdings API = `NOT AUTHORIZED`;
- broker adapter/token/certificate = `NOT AUTHORIZED / NOT REQUIRED`;
- System 1 holdings import = `NOT AUTHORIZED`;
- real orders = `DISABLED`;
- live capital authority = `DISABLED`;
- broker order routing = `NOT AUTHORIZED`.

Implementation unit:
- `SYSTEM2_ACTUAL_HOLDINGS_SCREENSHOT_IMPORT_V0_1.md`;
- additive migration `0009_actual_holdings_screenshot_import.sql`;
- validation / snapshot / reconciliation / persistence / read-model runtimes;
- UI wording and regression tests.

Readiness truth:
- source contract is Owner-authorized;
- code/schema validation may become implementation-ready after CI;
- no real Owner holdings snapshot has yet been physically imported in this checkpoint;
- therefore `ACTUAL_POSITION_MONITOR_VERIFIED=false` remains authoritative.

After this bounded Owner-directed change is completed and merged, BUILD_LANE returns to the pre-existing S2-07 continuation cursor without discarding it.

## 2026-10-07 Physical implementation acceptance

Implementation:
- PR #775 merged as `28a42d5d49dce00a42dacf18797b45a904fc6dc3`.
- Dedicated Actual Holdings workflow run `37587329198` / job `112680392792`: PASS.
- System2 Research CI run `37587329275`: PASS.
- V8 Regression run `37587329189`: PASS.
- physical contract artifact `11466623799`, digest `sha256:ba59fa9a0d0a23ebf42f52f493a11da2c4193f03876ba5b0fdf3e7350e08404b`.
- additive SQLite migration verification: PASS; 52 isolated `s2_` tables; global schema remains 1.1.

Accepted implementation truth:
- `USER_UPLOADED_BROKER_SCREENSHOT` is the Owner-authorized current Actual Holdings source.
- validation / confirmation / immutable snapshot / idempotency / reconciliation / read-model separation are code-tested.
- `s2_positions` remains virtual/simulated only.
- low confidence / ambiguity remains `REVIEW_REQUIRED`; invalid core values can fail as `REJECTED`; unresolved review issues cannot be persisted as Actual Holdings.
- snapshot reconciliation never invents exact trade price, trade time or broker order ID.

Important physical limitation:
- verification used synthetic structured fixtures only;
- no real Owner broker screenshot was imported;
- guarded isolated-D1 provisioning was not invoked by this acceptance workflow, so migration 0009 is code/schema validated and wired into the provisioner but not claimed physically applied here;
- therefore `ACTUAL_OWNER_SNAPSHOT_IMPORTED=false` and `ACTUAL_POSITION_MONITOR_VERIFIED=false`.

Permanent current authority boundary:
- broker API = NOT AUTHORIZED;
- broker adapter/token/certificate = NOT AUTHORIZED / NOT REQUIRED;
- real orders = DISABLED;
- live capital authority = DISABLED;
- broker order routing = NOT AUTHORIZED;
- System 1 holdings auto-import = NOT AUTHORIZED.

Durable evidence:
`system2/evidence/S2_ACTUAL_HOLDINGS_SCREENSHOT_IMPORT_V0_1_PHYSICAL_20261007.json`.

Next holdings-specific physical gate:
`FIRST_REAL_OWNER_SCREENSHOT_CONFIRM_PERSIST_READBACK`.


## 2026-10-07 Physical implementation acceptance — final merged head

PR #772 merged as `14f67ddba88604e73a2488d4a561a571393f026b`. Final merged implementation head `5ce2c1bffc514405dd5ce5129f436e0933c37830` passed dedicated workflow run `37579261319` / job `112654963433`, artifact `11463608550`, digest `sha256:4552781daf18eddfb9cd8595a941a144be9c64d394cefd962ee2f7b594280f16`. Earlier run `37578018310` belonged to a superseded PR head that still performed a fourth live recapture and is retained only as historical provenance, not final-code acceptance.

Accepted physical result:
- state = `MOPS_APPEND_ONLY_UNION_READY_STABILIZATION_PENDING`;
- captureCount = 3;
- unionVersionKeyCount = 168;
- latestCaptureVersionKeyCount = 163;
- unionMissingFromLatestCount = 5;
- earliestObservedPreserved = true;
- latestObservedPreserved = true;
- payloadConflictCount = 0;
- monthOnlyDriftVersionCount = 21;
- trailingIdenticalTransitions = 0;
- boundedStabilizationCandidate = false;
- unionHash = `2f599d5599f383eedc71de8f3b0ec039e6dbac3689a43bd7dd620153120521ff`.

Interpretation: append-only provenance repair is physically accepted, but bounded stabilization is not yet satisfied. `expectedMopsKeysetComplete=false` and `noRevisionGapThroughCut=false` remain locked. Source semantics / month-shard completeness remain separate gates. No scheduler, selection, push, capital, order or System 1 Formal Core authority changed.

Durable evidence:
`system2/evidence/S2_07_MOPS_REPEATED_CAPTURE_UNION_STABILITY_V1_7_PHYSICAL_20261007.json`.

Next exact BUILD_LANE continuation:
1. continue bounded repeated capture stabilization from the durable 168-version union seed;
2. independently resolve month-shard/source semantics;
3. do not freeze a complete expected MOPS keyset until both provenance stability and source semantics pass;
4. only then bind the MOPS keyset with the accepted V1.5 eight-lane source manifest into the V1.4.1 pre-parent cut;
5. post-parent reconcile and require `noRevisionGapThroughCut=true` before symbol-session / technical-continuity promotion.


## 2026-10-08 05:52 BUILD_LANE launch-critical cursor supersession — NC-T01 CORR-005/006

Observed main before write:
`e6c2a8186e95fd8961da1cead56db3dfd92396ad`.

This block supersedes the prior S2-07 continuation **for current Stage-1 launch-critical BUILD scheduling only**.
The S2-07 cursor remains durable and must resume after the NC-T01 launch gate is cleared; none of its accepted evidence is discarded.

Canonical blockers:
- `S2-CORR-20261007-005` — HIGH / OPEN / BUILD_LANE:
  hidden-fallback evidence missing can default to false; S22-T12/T16 cannot physically pass.
- `S2-CORR-20261007-006` — HIGH / OPEN / BUILD_LANE:
  continuity-ready W0 can be promoted while strategy-required evidence is incomplete; S22-T13/T14/T16 cannot physically pass.

Latest independent reconfirmation:
`system2/evidence/S2_CORR_005_006_LATEST_MAIN_RECONFIRMATION_20261008_V0_1.json`
@ `8770e51a023439ecadd7cf289f82fd056dff1f27`.

00 combined implementation contract:
`system2/evidence/S2_CORR_005_006_COMBINED_BUILD_HANDOFF_20261008_V0_1.json`
@ `97cac22a24f28593679092b03819a47fa3d89752`.

Physical acceptance matrix:
`system2/evidence/S2_STAGE1_NCT01_PHYSICAL_ACCEPTANCE_MATRIX_20261008_V0_2.json`
@ `9b38a4583c04dea42fb4ee9759f019a9d2fc7070`.

Important optimization:
- minimal CORR-005/006 hardening does not overlap the 11 canonical SDA-022 policy-fingerprint hard-bound sources;
- therefore S22-T06..T10 fingerprints must NOT be regenerated unless BUILD actually changes one of those 11 bound artifacts.

### Current exact BUILD_LANE continuation

1. Implement CORR-005 + CORR-006 in **one bounded exact-head patch** because they share the NC-T01 receipt/runner conflict units.
2. Required core units:
   - `system2/runtime/nct01_physical_receipt_v0_1.mjs`;
   - `system2/runtime/nct01_artifact_runner_v0_1.mjs`;
   - `system2/runtime/daily_shadow_orchestrator_v0_1.mjs`;
   - exact-head hidden-fallback static/runtime audit helper;
   - NC-T01 regressions + physical wrapper/workflow.
3. CORR-005:
   - no default-false audit semantics;
   - exact-head static transitive audit + runtime forbidden-access evidence;
   - bind `HIDDEN_FALLBACK_AUDIT_SHA256`;
   - missing/UNKNOWN evidence remains EVIDENCE_INCOMPLETE.
4. CORR-006:
   - distinguish W0 continuity-ready from W1 strategy-executable;
   - W1 requires explicit required-evidence completeness;
   - W0-only / strategy-INCOMPLETE cannot promote execution or legitimate zero-pick.
5. Run exact-head correction regressions + System2 Research CI + applicable V8 Regression.
6. Merge only after exact-head PASS.
7. Wait for DATA_LANE real source-honest CLEAR_NO_ACTION receipt, then execute one read-only/artifact-only real SHORT_MOMENTUM NC-T01.
8. 00 independently recomputes S22-T11..T16 before any physical-independence credit.
9. Only after physical NC-T01 does CORR-003 become the dominant persistence blocker before genuine SHORT_MOMENTUM -> RANK-01 -> `s2_capacity_runs`.
10. After this launch-critical chain is cleared, return to the preserved S2-07 MOPS stabilization cursor.

No strategy thresholds/weights/ranking, capacity policy, System1 Formal Core/runtime, final selection, live push, capital or order authority are changed.


## 2026-10-08 06:02 BUILD_LANE cursor advance — CORR-005/006 closed; CORR-007 is the remaining pre-physical promotion firewall

Observed main before write:
`29c72720abf7baae27da2b7269626836cf548579`.

Independent closure:
- `S2-CORR-20261007-005 = VERIFIED_CLOSED`;
- `S2-CORR-20261007-006 = VERIFIED_CLOSED`;
- durable verification:
  `system2/evidence/S2_CORR_005_006_INDEPENDENT_CLOSURE_VERIFICATION_20261008_V0_1.json`
  @ `ae31dcc258469a3200926d4a8ba8942635379879`.
- PR #841 merged as `d56f05fbc5986d00adbc81392b9dc0711de5043e`;
- exact-head and merged-main Research / NC-T01 / continuity / V8 / fingerprint checks PASS.
- this closure fixes code firewalls only; physical NC-T01 remains pending.

New HIGH correction:
`S2-CORR-20261008-007` — BUILD_LANE.

Reason:
CLEAR_NO_ACTION promotion currently checks `suspensionCoverageByExchange.TWSE=COMPLETE` but does not require the exact bounded suspension/TWTAWU completeness receipt digest to be source-ref-bound.
A status string alone must not be promotable as negative-suspension evidence.

Durable audit:
`system2/evidence/S2_STAGE1_NCT01_SUSPENSION_PROVENANCE_BINDING_AUDIT_20261008_V0_1.json`
@ `cef80ec06e9ea9448f98dfdbadec4e0915b1be43`.

### Current exact BUILD_LANE continuation

1. Implement CORR-007 as a bounded promotion/provenance firewall.
2. Make exchange-scoped suspension completeness evidence first-class:
   - exact interval;
   - immutable receipt/artifact digest;
   - source family/version;
   - observation/availability timing.
3. Bind the suspension evidence identity into the corporate-action completeness receipt hash.
4. Require a matching TWSE suspension sourceEvidenceRef in
   `buildNct01TwseClearNoActionPromotionReceiptV0_1`;
   missing/mismatch/late => `CONTINUITY_UNKNOWN`.
5. Preserve the three existing corporate-action historical range refs separately.
6. Regress string-only COMPLETE, missing digest, interval mismatch, ref missing/mismatch, late evidence, and positive complete control.
7. Run exact-head System2 Research CI + applicable continuity/V8 tests; merge after PASS.
8. In parallel, DATA_LANE produces the real bounded TWTAWU receipt.
9. After both converge, execute one real read-only/artifact-only NC-T01 and let 00 recompute S22-T11..T16.
10. Preserve the older S2-07 MOPS cursor for post-NC-T01 continuation.

No strategy/ranking/capacity/System1 Formal/final-selection/live-push/capital/order semantics change.


## 2026-10-08 06:22 BUILD_LANE exact cursor refinement — CORR-007 first, then PR #844 physical guard

CORR-005/006 remain VERIFIED_CLOSED at the code-firewall layer. Do not reopen or redo them unless new contradicting evidence appears.

Active launch-critical BUILD chain:

1. **S2-CORR-20261008-007 — HIGH / OPEN**
   - implement first-class TWSE bounded suspension evidence identity in the corporate-action completeness receipt;
   - status-only `TWSE=COMPLETE` must fail closed;
   - require exact interval + immutable suspension receipt digest + source/version/timing;
   - require one matching suspension `sourceEvidenceRef` in CLEAR_NO_ACTION promotion;
   - preserve all three existing corporate-action range refs separately.
   - minimal contract:
     `system2/evidence/S2_CORR_007_SUSPENSION_PROVENANCE_BINDING_HANDOFF_20261008_V0_1.json`
     @ `eaa0e609eb48727b6047100d9848ccbc4b921594`.

2. **PR #844 — same-cut NC-T01 physical read-only workflow**
   - current wrapper architecture is directionally accepted;
   - merge remains blocked by:
     a. CORR-007 canonical provenance binding;
     b. runner-local pre-transport D1 read-only prevention;
     c. same-cut runtime guard ledger whose counters derive runtimeForbiddenAccessCount instead of a literal zero.
   - acceptance refinement:
     `system2/evidence/S2_STAGE1_NCT01_PHYSICAL_WRAPPER_RUNTIME_GUARD_AUDIT_20261008_V0_1.json`
     @ `37dc3020f43c3a0fb0e19f44570a44f11eec073d`.

3. Recommended conflict-safe order:
   - merge CORR-007 as its own bounded continuity/archive patch;
   - harden #844's runner-local runtime guard in parallel without changing continuity semantics;
   - rebase #844 onto post-CORR-007 latest main;
   - rerun exact-head NC-T01 / Research / applicable V8 and all physical-wrapper guard regressions;
   - merge #844 only after both prerequisites are present.

4. First post-merge physical smoke may legitimately remain `EVIDENCE_INCOMPLETE` when no real continuity receipt is supplied. That is expected fail-closed behavior, not failure.

5. DATA_LANE owns the real TWTAWU/parity receipt. BUILD must not fabricate or infer bounded completeness from empty rows.

6. Only a later coherent real run consuming the real DATA receipt may be offered to 00 for S22-T11..T16 physical acceptance.

Preserved post-NC-T01 cursor:
S2-07 MOPS stabilization remains durable and resumes after the Stage-1 physical gate.
Formal Core remains LOCKED.


## 2026-10-08 11:40 BUILD_LANE handoff — CORR-007 implementation complete, independent closure pending

Observed main:
`d0ba47a084cfc35c503b817e277bcfb8b04ced10`.

CORR-007 implementation is present on main through merge commit
`836184f98726449107cdbd0ed83e2746bbbcf965`.

Exact-head validation PASS:
- System2 Research CI `37720705098`;
- NC-T01 Continuity Replay Binding `37720705101`;
- NC-T01 Artifact Runner `37720705126`;
- V8 Regression `37720705066`.

BUILD_LANE disposition:
- `S2-CORR-20261008-007 = FIX_IMPLEMENTED`;
- durable handoff: `system2/evidence/S2_CORR_007_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`;
- HIGH correction remains blocked for independent AUDIT_LANE verification and may not be self-closed by BUILD_LANE.

Launch-critical order:
1. AUDIT_LANE independently verifies CORR-007 and advances to `VERIFIED_CLOSED` if accepted.
2. CORR-008 remains blocked by CORR-007; do not mutate its conflict unit before blocker removal.
3. DATA_LANE independently supplies the real bounded TWTAWU suspension-completeness receipt plus three corporate-action refs.
4. After 007 closure, harden/merge the same-cut physical wrapper guard, then execute a coherent real artifact-only NC-T01.
5. 00 independently recomputes S22-T11..T16 before any physical-independence claim.
6. Preserve S2-07 MOPS stabilization as the non-conflicting fallback cursor.

No strategy/ranking/capacity/System1 Formal/final-selection/live-push/capital/order authority changed.

## 2026-10-08 13:34 BUILD_LANE handoff — CORR-009 FIX_IMPLEMENTED

Implementation:
- PR #859 merged as `c7afee03aec24d1c5a3a79e71cb4c8250a67b61e`.
- Canonical decision evidence firewall now binds exact factor version, PIT eligibility, availableAt<=decision clock, source identity/hash and family-to-factor observation hashes.
- Unsafe/non-PIT/future evidence forces the frozen decision to `INCOMPLETE`, clears rank/score, blocks strategy readiness and prevents outcome join.
- AP-01 is reproduced and fail-closed.

Exact-head PASS:
- CORR-009 Decision PIT Firewall `37732779734`;
- System2 Research CI `37732779722`;
- NC-T01 Continuity `37732779809`;
- NC-T01 Artifact Runner `37732779729`;
- V8 Regression `37732779747`.

Merged-main PASS on `c7afee03aec24d1c5a3a79e71cb4c8250a67b61e`:
- CORR-009 `37732958236`;
- System2 Research CI `37732958273`;
- NC-T01 Continuity `37732958318`;
- V8 Regression `37732958351`.

Disposition:
- `S2-CORR-20261008-009 = FIX_IMPLEMENTED`;
- CRITICAL correction remains pending independent AUDIT_LANE verification before `VERIFIED_CLOSED`;
- durable evidence: `system2/evidence/S2_CORR_009_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`.

Next BUILD priority:
1. continue the next unblocked CRITICAL correction from the canonical queue;
2. CORR-008 remains blocked by CORR-007 independent closure;
3. preserve physical NC-T01 and System1 Formal Core boundaries.



## 2026-10-08 15:10 BUILD_LANE handoff — CORR-010 FIX_IMPLEMENTED

Implementation:
- PR #864 merged as `d0a0554960883aad3d5f85989148ef044f9e135c`.
- Closed-set outcome-join lineage now recomputes and reconciles source-session, run-accounting, decision, decision-evidence and run-fingerprint digests.
- Exact market date / decision clock / strategy id+version / shadow spec / universe identity must match across linked receipts.
- Decision-hash coverage must be one-to-one and closed; foreign/missing/duplicate/extra fingerprints fail closed.
- Empty decision-hash coverage is allowed only for a separately proved zero-eligible-universe accounting case.
- AP-02/AP-03 fail closed.

Exact-head PASS:
- CORR-010 `37741546228`;
- CORR-009 regression `37741546094`;
- System2 Research CI `37741546128`;
- V8 Regression `37741546086`.

Merged-main PASS on `d0a0554960883aad3d5f85989148ef044f9e135c`:
- CORR-010 `37741728923`;
- CORR-009 regression `37741728744`;
- System2 Research CI `37741728771`;
- V8 Regression `37741728752`.

Disposition:
- `S2-CORR-20261008-010 = FIX_IMPLEMENTED`;
- CRITICAL correction remains pending independent AUDIT_LANE verification before `VERIFIED_CLOSED`;
- durable evidence: `system2/evidence/S2_CORR_010_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`.

Next BUILD priority:
1. continue the next unblocked CRITICAL correction from the canonical queue;
2. CORR-008 remains blocked by CORR-007 independent closure;
3. preserve physical NC-T01 and System1 Formal Core boundaries.

## 2026-10-08 19:15 BUILD_LANE handoff — CORR-015 FIX_IMPLEMENTED

Implementation:
- PR #877 merged as `591728bfc1a2569e0bd5eb0d10ce71f8dd3e8055`.
- D18 Regime vector now uses per-dimension PIT / availableAt / source-identity / component-hash / evidence-hash validation for KNOWN and CONTEXT_RAW evidence.
- Invalid optional context remains dimension-local `UNKNOWN`; valid core evidence cannot certify a future or non-PIT optional dimension.
- Activation, attribution and transition consumers recompute Regime evidence before use and fail closed on contamination.
- Cross-strategy dependence/common-support comparison treats contaminated Regime attribution as `MISSING`, never zero or known performance evidence.
- AP-07 future/non-PIT GlobalTransmission becomes UNKNOWN and cannot produce POLICY_ENABLED / POLICY_DISABLED.
- 36 optional-dimension adversarial cases cover future-date, wrong-clock, non-PIT, missing availableAt, missing hash and tampered receipt.

Exact-head PASS on `51115b843d987b03e661f5ebcea4032e6d6849d6`:
- CORR-015 `37768619935`;
- System2 Research CI `37768619939`;
- V8 Regression `37768620380`;
- V8 Repair CI `37768620096`.

Merged-main PASS on `591728bfc1a2569e0bd5eb0d10ce71f8dd3e8055`:
- CORR-015 `37768765685`;
- System2 Research CI `37768765738`;
- V8 Regression `37768765666`.

Disposition:
- `S2-CORR-20261008-015 = FIX_IMPLEMENTED`;
- CRITICAL correction remains pending independent AUDIT_LANE verification before `VERIFIED_CLOSED`;
- durable evidence: `system2/evidence/S2_CORR_015_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`.

Protected boundaries:
- System1 Formal Core/runtime unchanged;
- D18 remains research-only;
- no dynamic strategy weight/activation authority;
- no strategy threshold/ranking/final-selection/live-push/capital/order authority change.

Next BUILD priority:
1. continue the highest-severity unblocked correction from the canonical queue;
2. do not redo CORR-009 / CORR-010 / CORR-014 / CORR-015 code-firewall work unless new contradicting evidence appears;
3. preserve CORR-007 / CORR-008 blocker governance and DATA_LANE physical-evidence ownership.

## 2026-10-08 19:20 BUILD_LANE reconciliation — CORR-014 FIX_IMPLEMENTED

Implementation:
- PR #868 merged as `4dfa01cb3dd47845ed768e261f6a3d3d9191a9f7`.
- Bulk-backtest plan identity now binds dataset manifest, policy registration, evaluator code, factor bundle, Regime version, execution assumptions and cost model.
- Each replay date requires a hash-bound PIT universe receipt tied to exact plan/run/date/decision-clock and historical membership.
- Checkpoint, partition, date-summary, sample/state counts and rolling digest are recomputed/reconciled before resume.
- Zero-sample completion requires a separately proved empty PIT universe.
- AP-04 forged-completion checkpoint is rejected before loaders/evaluators run.

Exact-head PASS:
- CORR-014 `37743894631`;
- System2 Research CI `37743894530`;
- V8 Regression `37743894466`.

Merged-main PASS on `4dfa01cb3dd47845ed768e261f6a3d3d9191a9f7`:
- CORR-014 `37744022901`;
- System2 Research CI `37744022808`;
- V8 Regression `37744023076`.

Disposition:
- `S2-CORR-20261008-014 = FIX_IMPLEMENTED`;
- CRITICAL correction remains pending independent AUDIT_LANE verification before `VERIFIED_CLOSED`;
- durable evidence: `system2/evidence/S2_CORR_014_BUILD_IMPLEMENTATION_HANDOFF_20261008_V0_1.json`;
- old PR #869 is stale and must not replay its older queue/checkpoint/progress snapshots.

Next BUILD priority:
1. continue the highest-severity unblocked correction from current canonical queue;
2. do not redo CORR-014 code firewall unless contradicting evidence appears;
3. preserve System1 Formal Core/runtime and all final-selection/live-push/capital/order boundaries.

## 2026-10-09 00:29 BUILD_LANE handoff — CORR-008 FIX_IMPLEMENTED

Implementation:
- PR #895 merged as `53b15e0731be0948f89f8bc08c90661703276905`; stale PR #844 was closed as superseded.
- NC-T01 physical wrapper now creates a measured runtime guard before remote D1 construction or official-source network access.
- D1 uses a runner-local pre-transport read-only guard: SELECT / WITH / PRAGMA only; mutation and multi-statement SQL fail before Cloudflare transport.
- Network access is constrained to the frozen Cloudflare / TWSE / TPEx origin contract, including redirect-hop enforcement.
- Same-cut runtime evidence is derived from measured D1 / network / capability ledgers; `runtimeForbiddenAccessCount` is no longer declarative.
- Runtime ledger identity is bound through `runtimeEvidenceDigest -> hidden-fallback auditDigest -> HIDDEN_FALLBACK_AUDIT_SHA256 -> final NC-T01 receiptHash`.
- Hidden-fallback audit finalizes only after SHORT_MOMENTUM orchestration; any guarded activity after the audit cut invalidates the cut.
- Post-run `rowsWritten=0` remains a second-line readback.
- Real physical workflow V0.2 is manual `workflow_dispatch` only and requires a repo-local real continuity receipt path.

Exact-head PASS on `c904b904100a95bac653ef45a287c1c9c1c9cef5`:
- CORR-008 Runtime Guard `37808737377`;
- NC-T01 Artifact Runner `37808737264`;
- System2 Research CI `37808737224`;
- V8 Regression `37808737229`.

Merged-main PASS on `53b15e0731be0948f89f8bc08c90661703276905`:
- CORR-008 Runtime Guard `37808924586`;
- NC-T01 Artifact Runner `37808924734`;
- System2 Research CI `37808924695`;
- V8 Regression `37808924693`.

Disposition:
- `S2-CORR-20261008-008 = FIX_IMPLEMENTED`;
- HIGH correction remains pending independent AUDIT_LANE verification before `VERIFIED_CLOSED`;
- durable evidence: `system2/evidence/S2_CORR_008_BUILD_IMPLEMENTATION_HANDOFF_20261009_V0_1.json`.

Non-claims:
- code CI does not credit SDA-022 S22-T12 / S22-T16 physical acceptance;
- a source-honest DATA_LANE continuity receipt plus one coherent manual physical run and independent 00/AUDIT review remain required;
- no System1 Formal Core/runtime, strategy threshold/weight/ranking/capacity, final-selection/live-push/capital/order authority changed.

Incidental readback:
- System1 C1 Prospective Evidence run `37808995747` failed independently with `C1_GENERATION_NOT_FOUND / UPSTREAM_ARTIFACT_MISSING`;
- its own artifact reports `formalCoreImpact=false / noPlanChanges=true / noTrade=true / noPush=true`;
- all required CORR-008 / Research / V8 gates passed.

Next BUILD priority:
1. continue the highest-severity unblocked BUILD_LANE correction from the canonical queue;
2. do not reopen CORR-008 code-firewall work unless independent audit finds contradictory evidence;
3. preserve DATA_LANE ownership of real continuity evidence and 00/AUDIT ownership of physical acceptance.

## 2026-10-09 00:49 BUILD_LANE corrective handoff — CORR-008 FIX_IMPLEMENTED after independent bypass audit

Corrective implementation:
- PR #899 merged as `7f6a888c55720be6b8df049146a042f70e63f24e`.
- AP-008-A repaired: generic PRAGMA prefix permission was replaced by an explicit read-only metadata allowlist; writable/side-effect PRAGMAs are rejected before D1 transport.
- AP-008-B repaired: accessor/getter-backed batch statements are rejected; validated SQL/params are copied into fresh frozen adapter-native statements before `db.batch`.
- Negative tests prove rejected mutation attempts increment measured counters while underlying D1 request/batch counts remain zero.
- The original independent negative audit remains preserved as pre-patch evidence.

Exact-head PASS on `573faeda844803036730db436dae326094416564`:
- CORR-008 runtime guard `37811513968`;
- NC-T01 Artifact Runner `37811514005`;
- System2 Research CI `37811513963`;
- V8 Regression `37811513986`.

Merged-main PASS on `7f6a888c55720be6b8df049146a042f70e63f24e`:
- CORR-008 runtime guard `37811723886`;
- NC-T01 Artifact Runner `37811723860`;
- System2 Research CI `37811723871`;
- V8 Regression `37811723958`.

Disposition:
- `S2-CORR-20261008-008 = FIX_IMPLEMENTED`;
- independent AUDIT_LANE re-verification is still mandatory before `VERIFIED_CLOSED`;
- durable corrective evidence: `system2/evidence/S2_CORR_008_BUILD_CORRECTIVE_ADDENDUM_20261009_V0_1.json`.

Protected boundaries remain unchanged:
- System1 Formal Core/runtime;
- System2 strategy/ranking/capacity semantics;
- no live final-selection/push/capital/order authority;
- no physical D1 mutation;
- no SDA-022 S22-T11..T16 physical credit.

Exact next:
1. AUDIT_LANE independently re-runs AP-008-A/AP-008-B against merged main.
2. DATA_LANE real continuity completeness remains separate.
3. Only after code closure + real continuity evidence may one coherent manual physical NC-T01 be offered to 00 for S22-T11..T16.

## 2026-10-09 00:52 BUILD_LANE handoff — CORR-011 FIX_IMPLEMENTED

Implementation:
- PR #901 merged as `98fa1f0d562a4e479d9a0e0eaa2e6dfd8f06a882`.
- Generic immutable persistence now treats caller batches as untrusted and rebuilds canonical table/column contracts, identities, identity digests, row digests, operation count, SQL plans and batch hash before database transport.
- Only regenerated INSERT statements may reach the isolated System2 writer.
- Every immutable insert receives exact post-write readback; a measured statement ledger records read/write/transport/readback counts and statement hashes.
- Decision -> factor/regime and correction -> decision lineage is guarded in the generic archive writer.
- Order -> decision, fill -> order and outcome -> decision lineage is guarded in outcome persistence.
- Decision corrections remain append-only through `s2_decision_corrections`; no `s2_decisions` rewrite path was introduced.
- AP-08 caller UPDATE-as-insert is rejected before `db.batch`.

Exact-head PASS on `2f8eb9a042154668c740a56cefa02c41fa61d65a`:
- CORR-011 `37814281548`;
- System2 Research CI `37814281345`;
- V8 Regression `37814281392`.

Merged-main PASS on `98fa1f0d562a4e479d9a0e0eaa2e6dfd8f06a882`:
- CORR-011 `37814464487`;
- System2 Research CI `37814464192`;
- V8 Regression `37814464250`.

Disposition:
- `S2-CORR-20261008-011 = FIX_IMPLEMENTED`;
- HIGH correction remains pending independent AUDIT_LANE verification before `VERIFIED_CLOSED`;
- durable evidence: `system2/evidence/S2_CORR_011_BUILD_IMPLEMENTATION_HANDOFF_20261009_V0_1.json`.

Protected boundaries:
- System1 Formal Core/runtime unchanged;
- no destructive migration or immutable-history rewrite;
- no final-selection/live-push/capital/order authority change;
- CORR-012 outcome-maturation semantics intentionally remain separate.

Next BUILD priority:
1. continue CORR-012, then CORR-013, unless a newer higher-severity canonical queue item appears;
2. do not redo CORR-011 unless independent verification finds a concrete regression;
3. preserve DATA_LANE / REMEDIATION_LANE ownership for their active directives.

## 2026-10-09 01:11 BUILD_LANE handoff — CORR-011 FIX_IMPLEMENTED

Implementation:
- PR #901 merged as `98fa1f0d562a4e479d9a0e0eaa2e6dfd8f06a882`.
- Generic immutable persistence now treats caller batches as untrusted and canonically rebuilds whitelisted table/column contracts, identities, digests, operation count and SQL plans before any database prepare/transport.
- Only regenerated INSERT statements can reach isolated System2 D1; AP-08 caller UPDATE-as-insert fails before `db.batch`.
- Exact post-write readback verifies every inserted immutable row and measured statement/write ledgers are emitted.
- Decision/factor/regime and execution order/fill/outcome parent lineage are fail-closed.
- Decision corrections remain append-only in `s2_decision_corrections`.
- CORR-012 monotonic outcome maturation rules are intentionally outside this correction.

Exact-head PASS on `2f8eb9a042154668c740a56cefa02c41fa61d65a`:
- CORR-011 `37814281548`;
- System2 Research CI `37814281345`;
- V8 Regression `37814281392`.

Merged-main PASS on `98fa1f0d562a4e479d9a0e0eaa2e6dfd8f06a882`:
- CORR-011 `37814464487`;
- System2 Research CI `37814464192`;
- V8 Regression `37814464250`.

Disposition:
- `S2-CORR-20261008-011 = FIX_IMPLEMENTED`;
- HIGH correction remains pending independent AUDIT_LANE verification before `VERIFIED_CLOSED`;
- durable evidence: `system2/evidence/S2_CORR_011_BUILD_IMPLEMENTATION_HANDOFF_20261009_V0_1.json`.

Protected boundaries:
- System1 Formal Core/runtime unchanged;
- no destructive migration or existing-history rewrite;
- no final-selection/live-push/capital/order authority;
- no CORR-012 outcome-policy overreach.

Exact next:
1. AUDIT_LANE independently reruns AP-08 and tampered SQL/hash/identity/table/column/concurrent-write lineage probes.
2. BUILD_LANE continues `S2-CORR-20261008-012`.
3. Preserve CORR-008 physical NC-T01 and DATA_LANE continuity gates as separate launch-critical work.

## 2026-10-09 BUILD_LANE owner decision — post-market source readiness / next-session pool clock

Owner-approved policy contract: `system2/SYSTEM2_POST_MARKET_DATA_READINESS_AND_POOL_CLOCK_V0_1.md`.

- 19:00 Asia/Taipei is only a PRELIMINARY_SOURCE_REVIEW target: not proof of complete after-market inputs and never a new final-pick authority by itself.
- 23:45 Asia/Taipei is a proposed conditional FINAL_FREEZE_ATTEMPT when each strategy's preregistered mandatory source set passes exact-date, receipt, source-vintage, PIT, coverage, corporate-action, ranking/capacity and immutable-readback checks.
- 00:15 on the next calendar date is a conditional recovery observation for the **same explicit trading date T** if 23:45 is incomplete. No midnight drift, retroactive eligibility or rewriting the frozen historical record.
- Fixed wall-clock times and HTTP 200 do not prove freshness. Any missing mandatory input remains UNKNOWN/NOT_READY, not an invented zero-pick; different authorized strategies may have different required datasets. Paid/unavailable sources are not automatically enabled.
- Existing deployed bounded 19:00 refresh behavior and `SYSTEM2_CAPTURE_ENABLED=false` are unchanged. Future late freezes and recovery require separate isolated System 2 implementation, new tests, CI, real source and D1 readback, and appropriate authorization; this docs commit does not do that.
- DATA_LANE owns physical source/PIT readiness, REMEDIATION_LANE owns shared free-tier D1 budget, BUILD_LANE owns the future isolated selection/capacity/Worker integration, AUDIT_LANE validates closure.
- **System 1 Formal Core, formal 23:35/23:55 windows, four production Crons, push, capital and order paths remain untouched.**

BUILD next: deliver/accept the already active CORR-012/013 and data-readiness prerequisites without modifying a protected runtime; schedule implementation is a separate tracked integration after readiness.

## 2026-10-09 BUILD_LANE implementation — post-market clock gate V0.1 merged (offline only)

- PR #929 merged to `main` as `47b67feee348b70d7f344b8881d10ca1140486a1`. Parent owner-approved policy remains `system2/SYSTEM2_POST_MARKET_DATA_READINESS_AND_POOL_CLOCK_V0_1.md`.
- New standalone offline guard: `system2/runtime/post_market_clock_gate_v0_1.mjs`; adversarial test: `system2/tests/post_market_clock_gate_v0_1.test.mjs`; exact scope/limitations: `system2/SYSTEM2_POST_MARKET_CLOCK_GATE_IMPLEMENTATION_V0_1.md`.
- Gate covers fixed 19:00 preliminary-only, 23:45 eligible-to-revalidate attempt, conditional 00:15 retaining the original marketDate across midnight, exact provider-reported market date, first-observed/response clocks, PIT, source hash/attestation shape, calendar, full-universe requirements and strategy-specific required vs optional source readiness.
- Source and strategy negative probes fail closed, and downstream selection/capacity/trade/push flags are always false. Any READY result is `READY_FOR_DOWNSTREAM_REVALIDATION` only: caller-supplied attestations are **not** independent verification of physical provider bytes or source availability.
- PR-head System2 Research CI and V8 Regression PASS; main file readback confirmed after merge. No Worker/Cron, D1, migration, API, secret, paid data source or System1 files were changed. No actual physical source, next-day monitor/capacity freeze or D1 write success is certified.
- Exact next BUILD work remains the HIGH `S2-CORR-20261008-012` and then `-013` (both OPEN at observed canonical queue), together with non-conflicting downstream clock integration only after DATA_LANE PIT/source and REMEDIATION_LANE quota gates. The existing draft CORR-012 PR #912 is not completed or authorized for merge by this checkpoint.
- 23:45/00:15 production schedule deployment remains **NOT AUTHORIZED / NOT DEPLOYED**. Existing System2 19:00 bounded reader and System1 formal 23:35/23:55 schedule unchanged.

## 2026-10-09 BUILD_LANE — CORR-012 first protective tranche merged; HIGH still OPEN

- PR #939 merged into main as `96b971e2db2ce365a2dccc10a42819a7853ec2f3`. The stale draft #912 was *not* merged as-is.
- Rebased original draft's monotonic guard onto latest main, then extended protection for historic session/source immutability, cost-model lineage, projected cost scenario/horizon consistency and JSON-to-scalar consistency.
- In the isolated outcome persistence executor, complete snapshot SHA256 is recomputed and numeric projections are checked **before any D1 write**; attempts to forge a fresh outer batch hash cannot authenticate altered underlying outcome data.
- PR-head CI: System2 Research `37870100698` PASS; V8 Regression `37870100654` PASS; CORR-011 immutable persistence regression `37870100655` PASS; independent CORR-012/013 edge probe `37870100675` PASS.
- The edge probe classified 5/5 original CORR-012 tamper attempts SAFE (rejected), while 4/4 CORR-013 date/no-fill probes remain UNSAFE and are **not** repaired by this PR.
- The corrective tranche is **PARTIAL_IMPLEMENTED / canonical S2-CORR-20261008-012 stays OPEN**, pending full decision/strategy/version/Regime/exec/cost hash binding, append-only separately versioned outcome records for assumption changes and independent AUDIT_LANE proof before VERIFIED_CLOSED.
- No Cloudflare D1 reads/writes, no real worker/Cron, no System1 Formal Core, no live final selections, no push or orders. Historical-data continuity still remains DATA_LANE owned.
- Durable evidence: `system2/evidence/S2_CORR_012_BUILD_PARTIAL_GUARD_HANDOFF_20261009_V0_1.json`. Next BUILD: finish CORR-012 producer-to-persistence provenance and maturation versioning; then CORR-013 official-session/unknown-NO_FILL repairs. Correction Queue remains source of truth; do not silently promote by checkpoint text.


## 2026-10-09 BUILD_LANE — CORR-013 first session/UNKNOWN fail-closed tranche merged (HIGH remains OPEN)

- PR [#945](https://github.com/imihan0630-sys/v7-fugle-worker/pull/945) merged main as `4b5a140a73e5e4437eff1178d4b250325ee0a4ae`. New `system2/runtime/market_session_date_guard_v0_1.mjs` is consumed only by System2 shadow execution/outcome modules; `Worker.js` and `wrangler.toml` unchanged.
- Both simulation and outcome session normalizers reject nonexistent/noncanonical/weekend/unordered/duplicate dates and unverified gaps greater than three calendar days; **even shorter gaps and weekdays are NOT official-session proof**.
- Simulated expiration with an UNKNOWN entry interval becomes `DATA_INCOMPLETE`, never a proved `NO_FILL`. Earlier UNKNOWN/blocked entry/exit intervals stop later apparent CLOSED trades from contributing to net simulated performance and suppress tentative rows from `s2_sim_fills`. Missing OHLC in outcome sessions excludes performance eligibility.
- Legacy clean synthetic NO_FILL is compatibility-only, with `proofCompleteNoFill=false` and `noFillDenominatorEligible=false`. Do NOT count it as certified no-fill without independently verified calendar/source PIT evidence. Clean fully observed simulation CLOSE remains a code-level positive control, not physical trading proof.
- Exact final PR head `a08d4c191fdc8a3321e9e8ef068e3b856ee14b5d`: System2 Research CI `37876471366` PASS; V8 Regression `37876471320` PASS; independent CORR013 date/NO_FILL V0.2 `37876471322` PASS with 9/9 SAFE; unknown-then-close V0.3 `37876471348` PASS with 4/4 SAFE; legacy CORR012/013 edge probe `37876471411` PASS as workflow execution (one old exception-only classifier still labels DATA_INCOMPLETE UNSAFE; its predicate is not the updated acceptance standard). Source logs remain independently retained.
- `S2-CORR-20261008-013` remains **OPEN / PARTIAL_CODE_GUARD**, because authenticated exact TWSE/TPEx official exchange calendar, short-gap completeness/PIT, source-level revisions, full no-fill denominator consumer bindings and independent AUDIT_LANE closure are missing.
- Evidence: `system2/evidence/S2_CORR013_BUILD_PARTIAL_FAIL_CLOSED_20261009_V0_2.json`. Next BUILD_LANE: bind authoritative calendar/source receipts to every observation, update downstream denominator consumers to reject unproven NO_FILL, independently verify historical continuity with DATA_LANE, then request AUDIT_LANE closure review.
- No live trading, money, orders, push, production Cloudflare Worker/Cron, paid upgrade, D1/R2 read/write, or System1 V8 Formal Core changes.


## 2026-10-09 BUILD_LANE — CORR-013 downstream D18 unverified execution denominator fenced, partial (PR #949)

- PR [#949](https://github.com/imihan0630-sys/v7-fugle-worker/pull/949) merged as `3939e348c39e426531034ae81436f63f8a69d810`. The data and audit lanes remain separate. No D1/R2 consumption, schema migrations, System1 V8 or production Worker/Cron modifications.
- New `system2/runtime/execution_denominator_guard_v0_1.mjs` rejects treating caller-supplied `proofCompleteNoFill`, `noFillDenominatorEligible`, an apparent `CLOSED` state or modeled net P/L as independent proof of executable fills. Missing official calendar, source PIT, vintage and physical fill evidence remain UNKNOWN, not a proven zero.
- `system2/runtime/d18_regime_attribution_v0_1.mjs` now exports a V0.2 research attribution receipt with separate *observational signal horizon* returns and explicitly uncertified execution: modeled `realizedReturnAfterCost` masked to null, confirmed selected->triggered and NO_FILL denominators null, with source-proof blockers and certification flags. Existing historical receipt hashes are not rewritten. The V0.1 function name remains as a compatibility entrypoint emitting new V0.2 schema; readers must recognize V0.2 rather than silently interpreting as V0.1.
- Defensive CI on exact PR head `5dd6283387e64c692fb4a12eaefdeaf2ebc33616`: System2 Research `37877277761` PASS, V8 Regression `37877277718` PASS, System2 CORR-015 Regime PIT Firewall `37877277842` PASS. Main readback confirmed source guards.
- This is **partial code protection only**, not proof of data/selection/strategy performance or end-to-end denominator safety. Canonical `S2-CORR-20261008-013 = OPEN`. It requires independent actual exchange session calendar and source receipts, complete downstream consumer scan, per-window PIT and execution cost proof, independent AUDIT_LANE re-verification.
- `S2-CORR-20261008-012` stays OPEN pending full parent lineage and append-only outcome versioning.
- Evidence: `system2/evidence/S2_CORR013_D18_DOWNSTREAM_DENOMINATOR_GUARD_20261009_V0_1.json`. Next BUILD: complete real official-session and versioned outcome contracts without changing protected System1 formal outputs. DATA_LANE original TWSE 2026 Jul–Sep physical audit remains separate and must not be inferred from this module.


## 2026-10-09 BUILD_LANE — CORR-012 simulator execution/cost projection provenance guard (partial)

- PR [#951](https://github.com/imihan0630-sys/v7-fugle-worker/pull/951) merged main `96b72bee7be9aa9a48bed35431909bb2aacfceac`. This is a restricted continuation of overlapping old PRs #910/#911, **not** a forced merger of conflicting legacy schema or branches.
- `toOutcomeSimulatedExecutionV0_1` carries the simulator executionHash, executionVersion, canonical fee/slippage/tax costModel, costModelVersion and taxRuleId. `buildDecisionOutcomeSnapshotV0_1` preserves and validates them; `validateMonotonicOutcomeUpdateV0_1` rejects within-version execution/cost lineage rewrites. Legal maturity still works and negative tests cover changed execution SHA/cost rate/tax identity.
- Exact head `3a52665b240577557303fd93445137eb0991ebb3`: System2 Research CI `37877834604` PASS, V8 `37877834646` PASS, independent CORR012/013 matrix `37877834603` PASS, independent CORR013 date/no-fill `37877834633` PASS, unknown-before-later-close `37877834721` PASS.
- A shape-valid execution hash carried from an in-memory simulator **is not** independent physical source proof. A later assumption change requires a distinct outcome version; the additive V0.2 table, full decision/regime parent revalidation, performance consumer wiring and independently audited D1 readback are not completed. `S2-CORR-20261008-012` stays **OPEN**, not closed by passing CI.
- No System1 Formal Core/Worker/production Cron, funding, orders, push, Cloudflare D1/R2 I/O or paid services changed.
- Durable evidence: `system2/evidence/S2_CORR012_EXECUTION_COST_PROJECTION_HANDOFF_20261009_V0_1.json`. Next BUILD priority remains versioned append-only outcome lineage and independent acceptance; CORR-013 calendar and denominator physical evidence remain independently OPEN.


## 2026-10-09 BUILD_LANE — CORR-012 append-only maturation revision archive V0.1 merged, physical D1 pending

- PR [#954](https://github.com/imihan0630-sys/v7-fugle-worker/pull/954) merged to main as `2c571e7d86f4870c7edae83e052d82c7cf2b4911`. Reuse of earlier overlapping #910/#911 is intentionally **not** a blind merge: their V0.2 UPDATE-in-place pattern would lose prior evidence for each maturational revision.
- New isolated pure module `system2/runtime/outcome_revision_archive_v0_1.mjs` creates a new deterministic receipt for **each** same-lineage maturity step. It verifies snapshot/execution hashes, strategy/version, regime and decision parent references, corporate action context, costs/tax/source lineage and prior-revision SHA256; illegal erasure/backdating/assumption changes are rejected. Different cost/Regime/execution assumptions start a distinct genesis lineage; historical revisions are never edited.
- Staged SQL `system2/sql/0011_outcome_revision_archive_staged.sql` implements unique revision IDs + (decision ID,lineage hash,revision number), plus hard `BEFORE UPDATE/DELETE RAISE(ABORT)` SQLite triggers; certification flags are constrained to zero. It is read and run **only in CI's in-memory SQLite** at this stage. The physical D1 provisioner retains only its existing ten migrations and Cloudflare D1 schema remains unchanged.
- CI exact PR head `a0dee4afe1b9b10b4c76f25cb7a6e22b8bcc9c67`: System2 Research run `37878858723` PASS, 256 test modules, 11 in-memory SQL migrations / 56 tables / schema 1.1; V8 Regression run `37878858613` PASS. Offline adversarial regression observed three successful INSERTs and blocked six attempts to mutate/delete, duplicate revision ordinal or forge certified performance.
- **Only partial implementation.** Caller-supplied decision/regime/corporate-action SHA shapes are not independent parent D1/source proof. Account-wide D1 quota contract, actual isolated append-only writer and readback, verified PIT/firstKnownAt/NC-T01 and separate AUDIT_LANE acceptance remain pending. `S2-CORR-20261008-012=OPEN`, do not silently promote to FIX_IMPLEMENTED or VERIFIED_CLOSED. CORR-013 calendar/no-fill and CORR-003 budget remain OPEN in their lanes.
- Frozen proof: `system2/evidence/S2_CORR012_APPEND_ONLY_REVISION_ARCHIVE_HANDOFF_20261009_V0_1.json`. Next BUILD step: atomic, reserved-budget isolated physical append writer with parent readback and immutable chain-position verification, then version-aware shadow performance consumers. No live Worker/Cron, System1 Formal Core, capital, orders, push, R2/D1 physical writes or paid plan changes.


## 2026-10-09 BUILD_LANE — 15-gate D06 source-honest A1 Shadow assessor partial implemented

- PR [#960](https://github.com/imihan0630-sys/v7-fugle-worker/pull/960) merged main as `2c712ab656cf2592272e7dd1889583d60e77bec8`. New pure `system2/runtime/d06_a1_limited_shadow_evidence_policy_v0_1.mjs` with optional `assessSymbol` adapter and `SYSTEM2_D06_A1_EVIDENCE_POLICY_V0_1.md`. This is not activated in scheduled daily selection/production Worker.
- Policy is bound to **existing** owner-approved `SHORT_MOMENTUM V0.1-CONTRACT` and `SWING_GROWTH V0.1-CONTRACT`, verifies explicit decision date/timestamp, strategy/version, source A1 bundle hash, factor family IDs, source provenance/PIT clocks, deduplication and continuity. `KNOWN` here means descriptive source observed, NOT alpha validated or true physical proof.
- SHORT_MOMENTUM may read existing daily TECH/PV descriptive factors; independent `RISK.REWARD_RISK` source is not yet present and therefore RISK_FRICTION must remain **UNKNOWN**, strategy `INCOMPLETE/BLOCKED`. SWING_GROWTH required `FUNDAMENTAL_QUALITY` and `INDUSTRY_THESIS` cannot be proxied by A1 price data; also `INCOMPLETE/BLOCKED` until PIT evidence exists. No weights/thresholds invented, no `BUY_ELIGIBLE`, ranking, selection, capital or push.
- Exact PR head `20d7600f3c9e4a3dadb335abcfd62223d7c2d87b`: System2 Research CI `37882891186` PASS and V8 Regression `37882891207` PASS. Tests cover wrong versions/dates, tampered hash, future timestamps, factor duplication, missing required families and unknown continuity.
- `D06` remains **PARTIAL**, `D07` incomplete and `15-gate passed=0/15`. To continue: independently PIT-verify complete A1/TWSE+TPEx and entry reward/risk, preregister non-optimized testable assessor policy, wire existing daily orchestrator to exact contemporaneous evidence and conduct independent OOS/Shadow. `A07` remains REMEDIATION_LANE owned, `B10/B11` DATA_LANE; no cross-lane writes or quota use.
- No System1 Formal Core, Worker/Cron production changes, live funds/orders/push, paid plan, physical D1/R2 reads or writes.


## 2026-10-09 BUILD_LANE — 15-gate D07 dual-market universe preflight V0.1 merged (partial)

- PR [#962](https://github.com/imihan0630-sys/v7-fugle-worker/pull/962) merged main `bc37b3881a4614c82a2ef58ebdbbd8eb3e35a762`: `system2/runtime/d07_dual_market_universe_preflight_v0_1.mjs` plus adversarial tests and `SYSTEM2_D07_DUAL_MARKET_UNIVERSE_PREFLIGHT_V0_1.md`.
- Recomputed canonical A1 batch/source-session SHA and per-stock raw-field SHA; verified per-source PIT/date/identity and deterministic dual-market ordinary equity denominator. Research fixture's lowered minimum may NEVER bypass baseline TWSE 600 / TPEx 450 ordinary-symbol protections. A green fixture still returns `READY_FOR_INDEPENDENT_PHYSICAL_PIT_REVALIDATION`, never physicalPITVerified or fullUniverseCertified; minimum counts are not a physically authenticated exact official security universe.
- Exact PR head `74eaaaf120bcb29d7e71e8a8fc1758f7e9409e1f`: System2 Research CI `37883312633` PASS, V8 Regression `37883312640` PASS. Full positive 600+450 synthetic coverage plus floor-override, 449 TPEx, missing required TPEx, stale source, changed raw fields/receipt/batch negatives PASS.
- D07 15-gate ledger remains **PARTIAL**, overall 0/15 formally passed. Real B10/B11 physical source byte/time, D1 PIT, exact exchange/lifecycle/NC-T01, D06 missing trade reward-risk and fundamentals, and D08 selected-capacity readback still blocked. No automatic daily selection or production action enabled.
- Does not change System1 Formal Core, Worker/Cron, physical D1/R2 reads/writes, real orders/capital/push, paid plan.

## 2026-10-09 BUILD_LANE — D08 D07-to-capacity full-universe lineage and false-zero-pick firewall merged (partial)

- PR [#965](https://github.com/imihan0630-sys/v7-fugle-worker/pull/965) merged main as `6bc75abab5cd696c84c50c378d4c14010e45f875`. New isolated `system2/runtime/d08_capacity_universe_lineage_gate_v0_1.mjs` and adversarial `system2/tests/d08_capacity_universe_lineage_gate_v0_1.test.mjs`; documented in `system2/SYSTEM2_D08_MARKET_TO_CAPACITY_LINEAGE_GUARD_V0_1.md`.
- Pure offline inspector binds exact same-day D07 A1 full TWSE+TPEx universe and source SHA256 receipts to all participating strategy run IDs/versions/hashes, per-symbol excluded-or-ranked accounting, run diagnostics and incompleteness counts, then cross-checks D08 capacity/denominator/contributing hashes, 12-global/3-per-strategy caps and absence of out-of-universe symbols. It also rejects synthetic `CAPACITY_ZERO_PICK_READY` promotion when incomplete evidence could masquerade as a clean zero-pick day.
- Even the complete 600 TWSE + 450 TPEx synthetic fixture returns **`canonicalZeroPickDay=null`**, **`zeroPickCertified=false`**, `d1WriteAuthorized=false`, `finalSelectionEnabled=false`. This module is NOT a source authenticator, physical database writer, production selection gate or real market completeness certification.
- Exact PR head `8bc78aebb2247b2a55ed2b15be7010ca12bbabaf`: System2 Research CI `37884540617` PASS; V8 Regression `37884540527` PASS. Negative examples: missing ranked symbol, exclusion/rank double count, stale strategy timestamp, incomplete essential evidence with false zero, unknown pool symbol, missing TPEx required source, swapped A1 hash.
- D08 canonical 15-gate status **PARTIAL, not verified**; all 15 independent full-acceptance gates remain UNVERIFIED (0/15 PASS). Blocked on A07 D1 shared quota coordination, B10 real TWSE+TPEx D1/official records, B11 official PIT/NC-T01/calendar, D06 authentic essential alpha/reward-risk/fundamental inputs, D08 real frozen capacity D1 atomic append/readback and independent AUDIT.
- Permanent machine-readable evidence: `system2/evidence/S2_D08_CAPACITY_FULL_UNIVERSE_LINEAGE_HANDOFF_20261009_V0_1.json`. No System1 Formal Core, Worker/Cron runtime, production selections, Cloudflare D1/R2 I/O, capital, broker orders, push or paid tier modified.


## 2026-10-09 BUILD_LANE — quantified 15-gate H05-C3 deterministic extreme fill counterexample accepted

- [PR #973](https://github.com/imihan0630-sys/v7-fugle-worker/pull/973) merged `0c1e5c964c9d907ecbdcb7b277120ec63dde5a75`. Added 17-case deterministic adverse matrix `system2/tests/h05_extreme_execution_adversarial_matrix_v0_1.test.mjs` and evidence document. `System2 Research CI 37890214312` PASS, `V8 Regression 37890214343` PASS; log contains `H05_C3_EXTREME_EXECUTION_MATRIX_PASS` with 17 scenarios.
- The narrow **H05-C3** acceptance criterion (daily bar same-stop-and-target, limit-up/down, halts, gap exits, unknown OHLC, corporate actions, source availability, slippage/tax counterexamples) now has test evidence and counts **1/5 → 2/5** for H05. All 17 synthetic simulations remain *uncertified* under downstream execution denominator guard, including model state `NO_FILL` or `CLOSED`.
- Canonical quantified total progresses **21/75 → 22/75 (29.3%)**, remaining **53/75**. Fully accepted Shadow launch gates stay **0/15**. H05-C2 (exchange official calendar), H05-C4 (denominator independent audit), H05-C5 (CORR-013 VERIFIED_CLOSED) remain open; no false classification as physical source acceptance.
- Evidence: `system2/evidence/S2_H05_C3_EXTREME_EXECUTION_17CASE_ACCEPTANCE_20261009_V0_1.json`; main ledger `system2/SYSTEM2_SHADOW_15_CRITICAL_GATE_LEDGER_V0_1.json`. CORR-013 stays OPEN, no production D1/R2 I/O, Worker/Cron, System1 Formal Core, orders, capital, push or paid-tier changes.


## 2026-10-09 BUILD_LANE — F08 offline CAS append SQL plan, physical D1 unverified

- PR [#1002](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1002) merged `ef5d28251c195368be60b2ef1958fbec3fc06b03`. New isolated `system2/runtime/f08_outcome_atomic_cas_append_plan_v0_1.mjs`, two-connection SQLite adversarial test and contract document.
- Each prepared `INSERT ... SELECT ... RETURNING` statement checks original decision hash/version, Regime hash/date, prior lineage and predecessor revision record/JSON, and forbids overwriting/forking existing revisions. Missing predecessor, stale parent or replay returns zero rows, **not certified success**. SQL plan generation never invokes D1 and does not authorize cloud writes.
- Exact PR head `ccce0abdfcd73d8e349201c6bdc3d6b86cd829d4`: System2 Research CI run `37925023054` PASS (277 test files), V8 Regression `37925023052` PASS. Test confirms local SQLite two-connection replay and parent/regime/missing predecessor fail-closed.
- Critical gate F08 stays **2/5**; overall quantified score stays **22/75 (29.3%), 53 incomplete, 0/15 fully accepted**. A07 quota/state remains awaiting independent physical multiwriter verification; F07 schema has not been applied to physical D1. Physical writer, exact return/readback and independent PIT audit are not complete.
- Evidence: `system2/evidence/S2_F08_CAS_APPEND_20261009_V0_1.json`. No System1 Formal Core, Worker/Cron production, actual D1/R2 reads/writes, capital/orders/push, or paid plan changed.

## 2026-10-09 BUILD_LANE — F08 exact CAS RETURNING/readback payload verifier merged, physical not certified

- PR [#1005](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1005) merged to main as `6cb0202eb6c53eddef294dcb1cb61ab8e86b5cff`. This extends the existing isolated F08 offline CAS proposal, not the production D1 writer/Cloudflare Worker.
- A new pure `verifyS2F08ConditionalAppendReadbackPayloadV0_1` rebuilds the canonical SQL plan from immutable outcome receipts, checks exact 5-column `INSERT ... RETURNING` identity plus all 22 expected persisted row fields, and rejects zero/duplicate rows, substituted SQL/params, cost hash/receipt JSON tampering and extra columns. Emits the exact readback SELECT query.
- Exact PR head `781eea4e72d6ead6b71a445c3ec467c9e29d2c0c`: System2 Research CI [37928686294](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37928686294) PASS (278 test files and `F08_CAS_EXACT_READBACK_PAYLOAD_11_CASES_PASS_UNCERTIFIED_PHYSICAL` marker); V8 Regression [37928686377](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37928686377) PASS; in-memory SQL migrations=11/tables=56.
- A caller-provided matching mock readback is **NOT** independently witnessed physical D1, PIT, account-wide quota authorization or actual writer evidence. The inspector always reports `physicalExecutionVerified=false`, `physicalReadbackVerified=false`, `accountQuotaGranted=false`, `f08C3Accepted=false`. No D1/R2 SQL I/O, 0011 physical migration, System1 Formal Core/Worker/Cron, money/orders/push/capital or paid plan changes were performed.
- **Quantified gate remains 22/75 (29.3%), 53 incomplete, fully accepted 0/15; F08 remains 2/5.** `S2-CORR-20261008-012` and `-013` remain OPEN, `S2-CORR-20261007-003` quota repair remains REMEDIATION_LANE owned with AUDIT_LANE closure authority.
- Evidence: `system2/evidence/S2_F08_EXACT_READBACK_PAYLOAD_CI_HANDOFF_20261009_V0_1.json`.
- Exact continuation: BUILD_LANE may build a separated quota-gated D1 writer/readback execution adapter **without dispatching it**, but actual F07/F08 D1 persistence, execution and independent acceptance wait for A07 audited account read/write reserves and DATA_LANE original-source PIT/market calendar. Do not promote synthetic PASS into any other gate.

## 2026-10-09 BUILD_LANE — F08 full revision-chain readback negative guard merged; quota/physical still blocked

- [PR #1010](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1010) merged as `d35cfc2bd4565414030ac378984988394185e6e4`. Extends offline `f08_outcome_atomic_cas_append_plan_v0_1.mjs` with `auditS2F08RevisionChainReadbackV0_1`; no production bindings, scheduled jobs or D1 calls.
- Whole-chain inspection refuses a missing genesis, nonconsecutive/reordered/duplicate revisions, a changed parent/lineage, out-of-order or extraneous physical-shaped rows, 22-field JSON/hash/cost-model modification, nonmonotonic timestamp or oversized bounded response. It regenerates each immutable CAS proposal with exact previous receipt, requiring valid revision-by-revision maturation and row equality rather than checking just one tail record.
- Exact PR-head System2 Research CI [37930794443](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37930794443) SUCCESS (279 test files; marker `F08_CHAIN_READBACK_15_NEGATIVE_AND_2_POSITIVE_OFFLINE_PASS_NO_PHYSICAL_AUTHORITY`), V8 Regression [37930794435](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37930794435) SUCCESS. Isolation guard SUCCESS.
- The returned query is a planned bounded `SELECT` with `maxRevisions+1` overflow protection; the auditor itself has **not issued a real D1 SQL SELECT**. It cannot prove the caller supplied the complete physical chain, a valid System1-first D1 quota grant, authentic source PIT, actual execution or certified simulated profit.
- Gate F08 remains **2/5** and official 15-gate ledger remains **22/75 (29.3%), 53 remaining, 0/15 fully accepted**. `S2-CORR-20261008-012` and `-013` stay OPEN; A07 / CORR-003 remains REMEDIATION_LANE owned. No schema migration or D1/R2 physical operation, System1 Formal Core, Worker/Cron, paid plan, push, order or capital change.
- Evidence `system2/evidence/S2_F08_FULL_REVISION_CHAIN_READBACK_20261009_V0_1.json`. Next BUILD: a version-aware downstream research consumer should require this chain inspector and separate physical proof before enabling denominators; physical F07/F08 integration waits for A07 account read/write budget and independent DATA/AUDIT verification.

## 2026-10-09 BUILD_LANE — F08 version-aware research-only outcome read model merged; no performance promotion

- [PR #1019](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1019) merged as `680cf3bbe1ad57e0976d83ff0727f43bee0e0300`. Added isolated `system2/runtime/f08_versioned_outcome_research_view_v0_1.mjs` and adversarial tests. The new consumer invokes the existing full F08 revision-chain inspector and retains all original outcome revisions with exact decision/strategy/version/regime/execution/cost lineage.
- Each revision is projected only into explicitly unqualified signal-horizon observations, with unknown and immature values masked to null. NO_FILL/triggered/profitable counts, certified trade returns, win rate, profit factor and after-cost execution performance remain null. No caller-supplied synthetic receipt, `performanceEligible`, no-fill claim or physical-shaped row can elevate the view to PIT/physical/strategy performance certification.
- Exact PR head `5a5ff247dc1f118a0ff072d24f2e800c21f18b71`: System2 Research CI [37934181637](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37934181637) PASS (282 files, `F08_VERSIONED_RESEARCH_VIEW_2_POSITIVE_13_NEGATIVE_SOURCE_UNCERTIFIED_PASS`); V8 Regression [37934181682](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37934181682) PASS. Production isolation guard PASS.
- This is an OFFLINE consumer only: no Cloudflare D1/R2 SQL operation, no staged SQL 0011 physical migration, no actual independent source PIT or calendar readback, no quota grant, no System1 Formal Core/Worker/Cron, orders, push, capital or paid-plan change.
- **Official 15-gate acceptance remains 22/75 (29.3%), remaining 53 and 0/15 fully accepted; F08 remains 2/5.** `S2-CORR-20261008-012` and `-013` remain OPEN. A07 account quota remediation remains under REMEDIATION_LANE and independent AUDIT_LANE closure; System1 read/write reserve is not authorized.
- Durable evidence: `system2/evidence/S2_F08_VERSIONED_RESEARCH_VIEW_CI_HANDOFF_20261009_V0_1.json`. Next BUILD: prepare physical-writer-safe integration only without dispatch, while awaiting A07 quota, F07 D1 schema, B10/B11 PIT/source and independent AUDIT; never convert modeled return into certified strategy performance.
