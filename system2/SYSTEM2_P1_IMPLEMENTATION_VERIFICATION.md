# System 2 P1 Implementation Verification

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH-ONLY CORE VERIFIED / NOT DEPLOYED

## Implemented

- factor/PIT/UNKNOWN validation runtime:
  - `system2/runtime/factor_snapshot.mjs`
- immutable decision/hash builder:
  - `system2/runtime/decision_archive.mjs`
- TypeScript contracts:
  - `system2/src/contracts.ts`
- isolated research schema design:
  - `system2/sql/0001_research_core.sql`
- research core tests:
  - `system2/tests/research_core.test.mjs`

## Storage optimization before deployment

The initial one-row-per-factor physical design was rejected before deployment because full-market capture could create roughly:
- 9.5M factor rows/year at 20 factors;
- 14.25M factor rows/year at 30 factors;
- 28.5M factor rows/year at 60 factors.

V0.2 uses one immutable symbol/day factor bundle with JSON factor observations plus indexed core metadata.

Approximate symbol-day count at 1,900 stocks x 250 sessions is about 475,000 rows/year before strategy-decision rows.

## Tests performed

### Node research-core test
Result: PASS.

Validated:
- KNOWN factor construction;
- deep freezing;
- UNKNOWN cannot carry a fake normalized 0;
- future availableAt cannot be marked PIT-eligible;
- market-regime snapshot construction;
- deterministic decision SHA-256;
- SELECTED cannot contain missing required factors.

A test bug using synchronous `assert.throws` against an async decision builder was detected and fixed to `assert.rejects` before final verification.

### SQLite schema validation
Result: PASS.

The V0.2 SQL executed against an in-memory SQLite database and created 13 `s2_` tables successfully.

This validates SQL syntax/schema construction only; it is not a Cloudflare D1 production deployment.

## Isolation verification

- `Worker.js` was not modified by this System 2 implementation.
- No V8 Formal A/B, 3+3, capital, BUY/ADD/REDUCE/SELL/STOP, monitoring, signal or push behavior changed.
- No System 2 SQL was applied to the V8 production D1 database.
- No System 2 Worker/runtime was deployed.

## Next safe step

Choose/prepare isolated physical System 2 persistence and capture path, then start prospective Shadow data accumulation.

Preferred design: separate System 2 D1/database binding if practical, even if UI/site remains shared.

Any integration that touches V8 production storage/runtime is Class B and requires owner review before deployment.


## Limited Shadow extension verification (2026-09-27)

Status: PASS / RESEARCH-ONLY / NOT DEPLOYED.

Added after the original P1 core verification:
- StrategyContract（策略契約） validator and owner-approved registry;
- StrategyValidity（策略有效性） / EntryReadiness（進場準備度） evaluator;
- source-readiness receipts;
- S2-SM-LS-001 and S2-SG-LS-001 Limited Shadow preregistry;
- Limited Shadow decision builder;
- family-assessment receipts with REQUIRED-factor PIT checks;
- full-universe Shadow run completeness receipts;
- storage row serializers;
- storage design V0.3 + `s2_shadow_runs`.

Verified research-only invariants:
- no numeric score/weight/threshold frozen;
- REQUIRED UNKNOWN fails closed;
- hard invalidation outranks supportive evidence;
- valid-but-overextended remains WATCH;
- BUY_ELIGIBLE is now correctly preserved as QUALIFIED_NOT_SELECTED until a separate ranking/capacity layer enforces global max-12 / per-strategy max-3;
- incomplete/source-gap records are preserved;
- run receipt detects silent universe omissions;
- family receipt refuses to treat PIT-ineligible REQUIRED inputs as KNOWN;
- storage serializers preserve null rank/score and explicit validity/readiness/source states.

Incremental SQLite syntax check for the new `s2_shadow_runs` table and extended `s2_decisions` columns: PASS.

Important:
The code is still not scheduled or connected to physical System 2 persistence. No production D1 migration/deployment was performed.


## Candidate capacity / ranking infrastructure verification (2026-09-27)

Status: PASS / RESEARCH-ONLY / NO RANKING FORMULA FROZEN / NOT DEPLOYED.

Implemented:
- `SYSTEM2_CANDIDATE_CAPACITY_CONTRACT_V0_1.md`;
- `SYSTEM2_RANKING_RESEARCH_PLAN_V0_1.md`;
- `runtime/candidate_capacity.mjs`;
- `runtime/candidate_capacity_receipt.mjs`;
- `runtime/strategy_ordering_receipt.mjs`;
- extended storage serializers;
- research-only `s2_strategy_ordering_receipts` and `s2_capacity_runs`.

Verified:
- global max-12 mechanics;
- multi-strategy overlap consumes one global symbol slot;
- the same overlap can consume one active-monitor slot inside each relevant strategy;
- per-strategy active-monitor max-3 mechanics;
- no forced filling with WAIT / TOO_EXTENDED / ineligible names;
- retained-pool overflow fails closed instead of silently evicting a valid incumbent;
- qualified capacity overflow stays distinct from strategy rejection;
- strategy ordering receipt rejects duplicate symbols and preserves exact ordinals/policy versions;
- candidate-capacity receipt is deterministic under identical inputs;
- storage serializers preserve ordering/capacity metadata;
- incremental SQLite syntax validation for `s2_shadow_runs`, `s2_strategy_ordering_receipts`, and `s2_capacity_runs`: PASS.

Important:
The allocator does not calculate a universal score. It only consumes an already-versioned ordering sequence and enforces capacity.
The actual strategy-local ranking formula and global displacement policy remain research questions.


## Candidate lifecycle verification (2026-09-27)

Status: PASS / RESEARCH-ONLY / NOT DEPLOYED.

Implemented:
- `SYSTEM2_CANDIDATE_LIFECYCLE_CONTRACT_V0_1.md`;
- `runtime/candidate_lifecycle.mjs`;
- lifecycle/re-entry tests;
- research-only lifecycle/re-entry storage tables.

Verified:
- one failed strategy membership does not force global symbol removal when another membership retains observation value;
- a pool state cannot survive when no membership has observation value;
- SIM_FILLED（模擬成交） transitions into POSITION_MONITOR（持股監控）, which is outside candidate capacity;
- terminal candidate episodes cannot be silently reopened;
- re-entry requires a new candidateEpisodeId;
- lifecycle/re-entry receipts are immutable/hashable;
- incremental SQLite syntax validation for the lifecycle/re-entry tables: PASS.

No strategy-specific invalidation threshold was invented; those remain versioned strategy semantics.


## RANK-01 strategy-local baseline verification (2026-09-27)

Status: PASS / RESEARCH-ONLY / NO OUTCOME TUNING / NOT DEPLOYED.

Implemented:
- `SYSTEM2_STRATEGY_LOCAL_RANKING_BASELINES_V0_1.md`;
- `runtime/strategy_local_ranking_baseline.mjs`;
- `runtime/strategy_local_ranking_pipeline.mjs`;
- `runtime/candidate_capacity_priority_gate.mjs`.

Baseline design:
- SHORT_MOMENTUM: TECHNICAL_STRUCTURE + PRICE_VOLUME + RISK_FRICTION;
- SWING_GROWTH: FUNDAMENTAL_QUALITY + INDUSTRY_THESIS;
- Pareto dominance only; no family weights or summed total score;
- EntryReadiness, Regime and Confluence deliberately excluded for later incremental tests;
- incomplete family inputs remain unranked;
- deterministic neutral hash breaks within-tier machine ties without claiming economic superiority.

Verified:
- Pareto dominance creates expected tiers;
- cross-family tradeoffs can remain in the same non-dominated tier;
- missing/UNKNOWN baseline-family input => RANKING_INPUT_INCOMPLETE;
- identical inputs produce deterministic within-tier order;
- strategy ordering receipt integration preserves policy/version;
- when global slots are scarce and no cross-strategy global policy exists, allocation fails closed as GLOBAL_PRIORITY_UNRESOLVED instead of using accidental input order;
- if all new candidates fit, all may be admitted without cross-strategy ranking.

No production/runtime deployment occurred.


## RANK-02 entry-readiness challenger verification (2026-09-27)

Status: PASS / PREREGISTERED RESEARCH CHALLENGER / OUTCOMES NOT USED / NOT DEPLOYED.

Implemented:
- `SYSTEM2_RANK02_ENTRY_READINESS_EXPERIMENT_V0_1.md`;
- `runtime/strategy_local_ranking_entry_readiness.mjs`;
- RANK-01/RANK-02 ordering-receipt pipeline;
- `runtime/ranking_experiment_receipt.mjs`;
- research-only `s2_ranking_experiment_receipts` storage design + serializer.

Challengers:
- GLOBAL_ADMISSION: preserve Pareto tier first, then binary PROXIMATE vs NON_PROXIMATE;
- ACTIVE_INTRADAY_MONITOR: preserve Pareto tier first, then preregister BUY_ELIGIBLE > ACTIVE_ENTRY_MONITOR > NEAR_ENTRY as a falsifiable hypothesis.

Verified:
- Pareto tier remains primary in RANK-02;
- proximity can change order only inside the same Pareto tier;
- non-proximate names are not smuggled into active-monitor ordering;
- baseline and challenger ordering receipts preserve separate policy/version hashes;
- ranking-experiment receipt freezes common support, candidate-set equality and rank deltas before outcomes are attached;
- ranking-experiment storage serializer preserves outcomeAttached=false at preregistration time.

No claim of ranking alpha is made.


## RANK-03 confluence gate verification (2026-09-27)

Status: INTERACTION RECEIPT PASS / RANKING CHALLENGER INTENTIONALLY NOT ACTIVATED.

Implemented:
- `SYSTEM2_RANK03_CONFLUENCE_EXPERIMENT_V0_1.md`;
- `runtime/interaction_observation.mjs`;
- extended InteractionObservation research contract.

Verified:
- interaction state derives from component factor availability/PIT state;
- a PIT-ineligible component prevents the interaction from being KNOWN;
- non-KNOWN interaction forces confluenceState=INDETERMINATE;
- redundancyState=NOT_TESTED does not permit ranking use;
- only state=KNOWN + determinate confluence + CONTROLLED_FOR_RESEARCH sets rankingEligible=true.

Important:
No RANK-03 confluence bonus/order was implemented.
This is deliberate: component redundancy/incremental value must be tested before confluence may influence ranking.


## RANK-04 regime readiness verification (2026-09-27)

Status: READINESS GATE PASS / REGIME PRIORITY CHALLENGER NOT ACTIVATED.

Implemented:
- `SYSTEM2_RANK04_REGIME_PRIORITY_EXPERIMENT_V0_1.md`;
- `runtime/rank04_regime_readiness.mjs`.

Verified:
- SHORT_MOMENTUM requires TAIEX trend + breadth + sector rotation + volatility to be KNOWN before a RANK-04 challenger is eligible;
- SWING_GROWTH requires TAIEX trend + sector rotation + volatility; breadth is not silently made universal;
- TPEx candidates fail closed when TPEx regime state is UNKNOWN; TAIEX cannot substitute for TPEx;
- missing regime inputs produce REGIME_INCOMPLETE, not a neutral/negative score.

No regime ranking bonus, activation weight or Risk-on/Risk-off gate was implemented.


## RANK-05 incumbent replacement shadow verification (2026-09-27)

Status: PASS / SHADOW COMPARISON ONLY / NO LIVE DISPLACEMENT.

Implemented:
- `SYSTEM2_RANK05_INCUMBENT_REPLACEMENT_EXPERIMENT_V0_1.md`;
- `runtime/rank05_displacement_shadow.mjs`;
- research-only `s2_rank05_displacement_receipts` design + serializer.

Verified:
- same-strategy challenger with strictly better RANK-01 Pareto tier can be labeled SHADOW_DISPLACEMENT_COMPARISON eligible;
- same-tier neutral-hash ordering cannot justify replacement;
- multi-strategy incumbent/challenger pairs are blocked in V0.1 to avoid overlap-confounding;
- cross-strategy/version-mismatch pairs are not displacement-eligible;
- action remains SHADOW_COMPARE_ONLY and outcomeAttached=false;
- incumbent candidate age is recorded but does not create an arbitrary age penalty.

Current real research baseline remains RETAIN_VALID_INCUMBENT.


## RANK-06 multi-strategy overlap verification (2026-09-27)

Status: PASS / DESCRIPTIVE OVERLAP ONLY / NO PRIORITY BONUS.

Implemented:
- `SYSTEM2_RANK06_MULTI_STRATEGY_OVERLAP_EXPERIMENT_V0_1.md`;
- `runtime/strategy_overlap_receipt.mjs`;
- research-only overlap storage/serializer.

Verified:
- PRIMARY/REQUIRED core-family overlap and distinct-family sets are preserved;
- SWING_GROWTH vs INDUSTRY_TREND correctly exposes shared INDUSTRY_THESIS plus distinct FUNDAMENTAL_QUALITY on Swing Growth;
- overlap ratios are diagnostics only;
- naive strategy-count bonus remains explicitly unauthorized;
- same-clock dual validity is recorded separately from overlap structure.

No global admission, active-monitor or exposure bonus was implemented.


## RANK-07 concentration measurement verification (2026-09-27)

Status: PASS / MEASUREMENT ONLY / NO HARD CAP.

Implemented:
- `SYSTEM2_RANK07_CONCENTRATION_EXPERIMENT_V0_1.md`;
- `runtime/candidate_concentration_receipt.mjs`;
- research-only concentration storage/serializer.

Verified:
- industry concentration, known-industry coverage and known-only HHI are measurable;
- UNKNOWN industry classification remains UNKNOWN and is not coerced into an "Other" industry;
- multi-strategy membership counts remain separate from unique-symbol count;
- concentration admission/eviction/sizing effects are explicitly unauthorized.

Size concentration remains source-blocked until PIT-safe size/market-cap semantics exist.


## Shadow source-session and run-fingerprint verification (2026-09-27)

Status: PASS / RESEARCH-ONLY / NOT DEPLOYED.

Implemented:
- `SYSTEM2_SHADOW_RUN_PROVENANCE_V0_1.md`;
- `runtime/shadow_source_session_receipt.mjs`;
- `runtime/shadow_run_fingerprint.mjs`;
- source-session and run-fingerprint storage serializers/tables.

Verified:
- REQUIRED source missing => SOURCE_SESSION_INCOMPLETE;
- OPTIONAL source gap is preserved but does not block when REQUIRED sources are ready;
- PIT future-availability violation blocks the source session;
- run fingerprint canonicalizes hash arrays so irrelevant input ordering is deterministic;
- complete source session + complete universe accounting => outcomeJoinEligible=true;
- incomplete source session or run accounting => RUN_FINGERPRINT_INCOMPLETE + outcomeJoinEligible=false;
- storage serializers preserve the join-eligibility and provenance hashes.

No daily schedule, physical D1 or live runtime was changed.


## System2 research CI and isolated persistence preparation (2026-09-27)

Status: PASS / REPOSITORY-ONLY / NO CLOUD RESOURCE CREATED / NOT DEPLOYED.

Implemented:
- `.github/workflows/system2-research-ci.yml`;
- `SYSTEM2_ISOLATED_PERSISTENCE_PLAN_V0_1.md`;
- `runtime/persistence_batch.mjs`;
- `runtime/persistence_executor.mjs`;
- `deploy/wrangler.system2.example.toml`.

Research CI boundary:
- triggers only for `system2/**` or its own workflow file;
- does not deploy Worker code;
- uses no Cloudflare secret;
- runs all System2 Node tests;
- executes the research SQL in in-memory SQLite;
- checks that System2 runtime/sql/src contain no production database/KV/runtime references.

CI diagnostic history:
- first observed run on commit `39d746f835b19e357dc73c4c620db13f53ccaab0` failed in the RANK-03 interaction test fixture because a derived receipt was reused without re-supplying its raw factor observations;
- the failure was diagnosed as a test-fixture provenance omission, not a reason to weaken the PIT gate;
- fixed in commit `75968279b4beb26a48d3bd6f5c5a926857081317`;
- GitHub Actions run `36301289399`, job `108569280780`: SUCCESS;
- 26 System2 test files: PASS;
- SQLite research schema: PASS, 24 `s2_` tables;
- production-isolation guard: PASS.

Persistence batch invariants verified:
- binding contract is `SYSTEM2_DB` only;
- only explicitly whitelisted `s2_` tables are accepted;
- run fingerprint is persisted last;
- duplicate identical records are idempotent;
- same identity + different immutable payload => `IMMUTABLE_CONFLICT` and fails closed;
- decision-time persistence batch excludes outcome rows;
- executor accepts an isolated prepare()/batch() database adapter and rejects a different binding name.

Important:
No separate Cloudflare D1 database has been created yet.
No production binding, root Wrangler configuration, production Worker, route or Cron was changed.


## Physical D1 readiness and permission audit (2026-09-27)

Status: REPOSITORY PREPARATION PASS / CLOUD D1 PERMISSION BLOCKED / NO PRODUCTION CHANGE.

Added:
- research schema V0.5 with `s2_schema_meta` and `s2_infrastructure_checks`;
- `deploy/d1_admin_core.mjs` + unit tests;
- `deploy/provision_system2_d1.mjs`;
- manual-only `.github/workflows/system2-isolated-d1-provision.yml`;
- `SYSTEM2_CLOUD_PERSISTENCE_READINESS_V0_1.md`.

System2 Research CI was extended to:
- run syntax checks for runtime/deploy modules;
- require infrastructure/schema metadata tables in SQLite validation.

Cloudflare read-only audit evidence:
- run `36305698372`, job `108581802799`;
- legacy token verification HTTP 200;
- Workers Scripts list HTTP 200;
- D1 list HTTP 401 Authentication error;
- dedicated System2 D1 token secret absent;
- therefore physical D1 existence remains UNKNOWN.

Safety conclusion:
the current token must not be treated as D1-capable and the System 2 implementation must not fall back to V8 production D1.
The exact remaining blocker is a dedicated D1-authorized Cloudflare token/secret.


## Dedicated System2 D1 token verification (2026-09-27)

Status: PASS / READ-ONLY AUDIT / NO CLOUD MUTATION.

After `SYSTEM2_CLOUDFLARE_API_TOKEN` was configured:
- account-owned token verify endpoint: HTTP 200;
- D1 list: HTTP 200;
- Workers Scripts list: HTTP 200;
- exact `system2-research` D1 not found;
- exact `system2-shadow-research` Worker not found;
- provisioning is therefore required before prospective Shadow persistence.

The initial post-secret audit incorrectly used `/user/tokens/verify` against an account-owned token. That produced a false authentication failure while resource reads were already succeeding. The workflow was corrected to `/accounts/{account_id}/tokens/verify`, preserving all isolation and permission checks.


## Physical System2 D1 provisioning verification (2026-09-27)

Status: PASS / ISOLATED D1 CREATED / PRODUCTION UNCHANGED.

First provisioning:
- run `36312415771`, job `108600779602`;
- `system2-research` created;
- database ID digest `9768891c9583`;
- schema V0.5;
- 26 `s2_` tables;
- required tables PASS;
- write/read sentinel PASS;
- production database/Worker/Cron unchanged.

Replay:
- run `36312460524`, job `108600904592`;
- same database ID digest;
- created=false;
- reusedExisting=true;
- schema/table/write-read verification PASS;
- production isolation PASS.

The temporary push authorization trigger was removed after completion.


## Prospective Shadow capture runtime preparation (2026-09-27)

Status: PASS / REPOSITORY-ONLY / WORKER NOT DEPLOYED / CRON NOT ARMED.

Implemented:
- `SYSTEM2_PROSPECTIVE_SHADOW_CAPTURE_CONTRACT_V0_1.md`;
- `runtime/prospective_capture_plan.mjs`;
- `deploy/worker_core.mjs`;
- `deploy/worker.mjs`;
- hardened `deploy/wrangler.system2.example.toml`.

V0.1 capture scope:
- AFTER_CLOSE_DECISION_CAPTURE only;
- SHORT_MOMENTUM + SWING_GROWTH Limited Shadow lanes;
- no intraday execution;
- no notifications;
- no outcome joining;
- no historical backfill;
- no exact Cron frozen yet.

Fail-closed runtime:
- `workers_dev=false` in deployment template;
- no routes;
- no Cron triggers;
- `SYSTEM2_CAPTURE_ENABLED=false` by default;
- even if capture-enabled is requested, scheduled capture remains disallowed until source adapters and exact decision-clock semantics are configured.

Verification:
- GitHub Actions run `36312760393`, job `108601721057`: SUCCESS;
- research-only tests PASS;
- deployment/runtime module syntax PASS;
- SQLite schema verification PASS;
- production-isolation guard PASS.

No Worker or Cron cloud resource was created.


## Isolated System2 Worker smoke verification (2026-09-27)

Status: PASS / WORKER EXISTS / CAPTURE DISABLED / CRON ABSENT / SYSTEM1 UNCHANGED.

Authorized scope:
- Worker `system2-shadow-research`;
- D1 `system2-research` bound as `SYSTEM2_DB`;
- health/read-only smoke only;
- no Cron;
- no production route;
- capture disabled.

Initial run `36314452669` / job `108606394382`:
- Worker version and binding were created successfully;
- no traffic target existed, so ordinary `wrangler deploy` exposed no Version URL;
- workflow refused a false-positive health claim.

Recovery run `36314596516` / job `108606794301`:
- temporary Version URL used only for health verification;
- health PASS against real D1 schema V0.5;
- capture state = CAPTURE_DISABLED;
- scheduledCaptureAllowed=false;
- System1 runtime used=false;
- Version URLs disabled again after test;
- workers.dev remained disabled;
- production files unchanged.

Read-only state audit `36314678044` / job `108607025869`:
- Worker exactly once;
- correct D1 binding;
- capture false;
- Cron count 0;
- workers.dev false;
- Preview URLs false;
- no mutation.

The one-shot push trigger was disarmed after completion.
