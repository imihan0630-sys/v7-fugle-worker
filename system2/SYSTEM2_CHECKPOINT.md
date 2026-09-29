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

- Position-management architecture approved: actual holdings are always monitored outside candidate/active-entry caps.

- Candidate lifecycle approved: the 12-symbol pool persists across days; every post-close run revalidates each existing name, retains it while at least one strategy thesis still has observation value, removes it when the surviving thesis is invalidated/turns materially bearish, and fills vacancies with newly qualified names. State-change reasons must be frozen.

- Capacity rule approved: global System 2 candidate/watch pool max 12 unique symbols; each strategy max 3 ACTIVE_INTRADAY_MONITOR symbols; no forced filling; multi-strategy overlap counts once globally but remains strategy-specific for monitoring/performance.

- Same overall website/platform can host multiple isolated engines.
- System 2 is a multi-strategy discovery/selection platform, not a relaxed clone of V8.
- Market/global regime is an upper-layer context.
- Strategy weights/floors are context-specific and not fixed yet.
- Daily outputs must be frozen and performance-tracked.
- Shared knowledge is reusable; system-specific decision logic remains isolated.
- System 2 decision authority is fully independent: System 1/V8 cannot approve, reject or gate System 2 selection, entry, exit, monitoring or notifications.

## MVP + Shadow implementation transition (2026-09-28)

- Owner explicitly moved System 2 into MVP（最小可用版本） + Shadow（影子實盤） engineering. The project must not wait for all 226 learning modules; engineering, prospective Shadow records, performance measurement and learning-room research proceed in parallel.
- Canonical implementation inventory is now `system2/SYSTEM2_MVP_SHADOW_STATUS_V0_1.md`. Future chats must use it together with this checkpoint and GitHub main to distinguish implemented code from design-only work.
- PR #221 merged as `b4a433a56da29426da6c4155449490542b518b87`: Shadow run accounting now supports `SELECTED`; Prediction Snapshot（預測快照） V0.1 projection archives Selected / Near-miss / Important Rejected while preserving immutable decision/factor/regime evidence and zero-pick days. It does not invent or enable an upstream final-selection rule.
- PR #222 merged as `4d7e8f5d0538cd0f67eb03cd1d962287e4972e18`: A1 per-symbol daily adapter now normalizes TWSE/TPEx ordinary-equity OHLC（開高低收）, volume, amount, transaction count, change, company name and source provenance with fail-closed PIT / duplicate / OHLC / coverage guards. The frozen Decision Clock collector was not modified.
- PR #223 merged as `714f560a4ed6ae150b3ed623ea88574041730e4b`: outcome tracker V0.1 now computes D1/D3/D5/D10/D20 signal returns, MFE（最大有利幅度）, MAE（最大不利幅度）, benchmark/industry-relative returns, target-first/stop-first/AMBIGUOUS_SAME_BAR observations, explicit cost scenarios and monotonic outcome-update validation. Simulated realized return after cost remains separate and is populated only by an explicit execution-simulator result.
- All three PR heads passed System2 Research CI and V8 Regression before merge. No System 1/V8 Formal Core, production runtime, System 2 strategy threshold/weight, D1 schema, Worker Cron or capture flag was changed.
- Remaining nearest P0 is no longer base storage/provenance design. It is the executable daily chain: verified historical A1 lookback -> versioned factor observations -> family/strategy evaluation -> full-market accounting -> ranking/capacity -> authorized final cohort -> frozen decision/Prediction Snapshot -> isolated D1 -> post-decision outcome/execution updates.
- Two owner gates remain explicit: (1) the initial final-selection policy that is allowed to emit `SELECTED`; (2) exact Decision Clock / Worker Cron / capture activation after the preregistered prospective evidence gates. Engineering can prepare and test everything around those gates without silently crossing them.

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
15. ⏳ After evidence gates pass, propose the first exact after-close Decision Clock（決策時間點） for explicit owner review. System2 Worker Cron activation remains a separate later explicit owner gate.\n16. ✅ Implement SELECTED-compatible full-market accounting + Prediction Snapshot V0.1 archive projection — PR #221.\n17. ✅ Implement A1 per-symbol daily snapshot adapter and decision outcome tracker V0.1 — PR #222 / #223.\n18. ✅ Repository-side A1 historical-window/factor adapter + limited daily Shadow orchestrator foundation implemented and CI-verified (PR #228/#230). Historical source population and physical D1 execution remain separate next steps.\n19. ⏳ Implement automatic outcome persistence + minimum execution-simulator runtime without conflating signal returns with fills.\n20. ⏳ Prepare initial final-selection policy candidates/evidence for explicit owner approval; do not enable SELECTED generation before that gate.
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
