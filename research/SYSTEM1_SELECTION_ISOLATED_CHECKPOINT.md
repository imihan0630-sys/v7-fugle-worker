# System 1 selection redesign — isolated engineering checkpoint

Date: 2026-10-01 Asia/Taipei. Cursor: S1-C1-001.
Classification: Class A offline only. Formal Core LOCKED. No deployment authorization.
Base main: 7ae8df72ea178e3fc5c19828424d515ad1df42f3.
Branch: research/system1-selection-isolated-20261001.
Engineering commit: 2914f5a0ca1742ee994cd2e4cde0da19d81d6ec6, pushed and
remote-readback verified. This checkpoint's later commit is its Git history.
Saved at 2026-10-01 22:04 Asia/Taipei.

## Readback and source diagnosis

Live GET /api/version: 8.14.4-history-memory-compaction; testMode=false;
KV/D1=true; requirements30Complete=false. Monitor:
https://fugle-test.imihan0630.workers.dev/ .
Live GET /api/recommendations: attempt requestedDate=2026-09-30,
status=INCOMPLETE; isCurrent=false, resultType=HISTORICAL. Persisted result
scanDate=2026-09-29, version=8.14.3, selectedCount=2, pipeline.complete=false,
daily delivery PENDING. Its displayed plans still contain 2026-09-24 reasons.
Date/plan provenance conflict is unresolved: this does not prove a clean 9/29
research cohort, no-trigger, no-fill or successful 9/30 zero-pick.

Governance proposal's RR-first comparator is superseded by the effective
apply_v7_5_30.py chain: post-consensus priorityScore, RR, consensus score,
setup quality, sector flow, RS. No governance or parallel research file was
overwritten. Latest formal Cron is 23:35 Taipei, not the old 18:10 text.

Read continuity: AGENTS, REQUIREMENTS_30, PROJECT_HISTORY, VERSIONING,
Shared Map/Governance, engineering governance, research master/checkpoint/
worklist, portfolio risk and checkpoint, selection redesign proposal,
Worker scoreCandidate/selectTomorrowCandidates, actual regression/build/deploy
workflow, wrangler configuration, gate overlap/replay and liquidity/funnel specs.

## Funnel inventory and evidence limits

1. Universe normalization and price floor precede the strategy. Current
   diagnostics.scanned is normalized rows, not exchange listing population.
2. History/source admission precedes feature construction. Missing early rows
   must remain in an externally attested universe denominator as UNKNOWN.
3. scoreCandidate is fail-fast: price, history, RS, cap, abnormality,
   liquidity/exception, small/mid-cap conditions, ownership presence, financial
   completeness, severe announcement risk, relative valuation, sector,
   A/B setup, fundamental count/quality, ATR, target, RR, grade.
4. Actual ranking then independent formal 3+3 quotas. Hybrid third pool,
   Aideen and System2 are separate; none is changed or used as a denominator.
5. Selected plan is waiting authority, not BUY. Complete 15m signal, actual
   trigger and broker fill are distinct. Existing execution query bounds do
   not prove absence; actual fill/cash evidence remains UNKNOWN.
6. Planned selected-count deployment 0/35/60/85%, max 35%, quantization,
   and 60/40 tranches explain plan reserves; they do not prove actual cash.

Existing rejected-after-base and sector rejection samples are bounded at six
per pool; primary low-liquidity rejects are absent from broad control. These
cannot estimate whole-population opportunity loss. Existing C1 prototype
coerces explicit null/blank/boolean numeric inputs via Number(); all-missing
undefined fixtures did not expose this defect. New module sanitizes inputs
without changing the existing owner prototype.

## Completed isolated engineering

research/system1_selection_isolated_v0_1.mjs reuses the existing gate observer
with strict numeric handling, tri-state output and independent downstream
quality/sector/A/B states. Every numeric gate requires its own authenticated
same-session parent receipt known no later than decisionAt. Missing or
dependent-invalid observations are UNKNOWN with reasons, never zero.

Population input explicitly lists every symbol. Missing rows are emitted,
duplicates/foreign dates rejected, all gate states retained. Exact pool x gate
counts and FAIL overlaps are separate from immutable original first failure.
Hash sampling is outcome-independent and separately bounded for every
pool x failed gate, UNKNOWN gate and first reason, including early liquidity.
PopulationN/sampleN/fractions and universe digest are retained. Overlapping
samples must not be added as disjoint cohorts or used to claim causal lift.

SHORT and SWING are preregistered exploratory challenger contracts. Both keep
price>=10, original 1000/300-lot liquidity and exception, history/RS, abnormality,
sector, ATR, severe event and independently attested source/session/CA,
execution feasibility/account risk safeguards. SHORT fundamental/valuation/
ownership fields are supportive UNKNOWN; SWING retains their hard gates.
Thesis and structural stop must be same-parent PIT evidence. WATCH expires
within seven calendar days and requires revalidation within 24 hours; it is
recomputed, never inherited automatically. ENTRY_READY additionally requires
verified A/B, target, RR>=2, grade and consistent entry/stop/target geometry.
Every output fixes formalSelected=false, buyAuthorized=false, allocation=0,
signal=null. No Worker import, network, binding, schema, push or scheduler.

The first experiment preserves sector gates and original A/B timing. No
no-retest continuation or alternative confirmation is activated. Virtual
trigger/fill/HOLD/EXIT, ranking or allocation experiments are deferred.

## Validation and counterevidence

New adversarial tests: 67 assertions PASS, fixture-only. Existing gate overlap
and replay tests PASS. Production patch chain rebuilt through V8.14.4 in a
separate disposable validation directory. Windows lacked patch: only the
validation copy used git apply -p0 for the embedded V7.5.33 diff; source
pipeline is unchanged. Copied missing dependencies and normalized validation
Worker CRLF to LF for Linux-style source assertions.

Required test_requirements_repair.mjs PASS against effective Worker. Regression
workflow's other 50 commands: 49 PASS after dependency/newline repair; one
pre-existing test_v8_10_0_aideen_independent_pool.mjs FAIL because it requires
exact V8.11.0 version while current build is V8.14.4. Formal code/test not
rewritten to conceal this failure. No claim of fully green CI or deployment.

Positive engineering evidence: all gates are represented, low-liquidity
rejections have their own stratum, permutation-stable sampling, UNKNOWN/PIT
and isolation guards pass. Counterevidence: synthetic fixtures prove code
behavior only; existing production archive lacks complete universe/derived
receipts; authenticated booleans are an ingestion contract, not independent
cryptographic verification. Economic superiority, additional effective
opportunities, costs, fills and utilization remain UNKNOWN. No maturity uplift
and no FORMAL_OPTIMIZATION_CANDIDATE.

## Exact continuation

1. Refresh main and Production; compare this branch with parallel changes.
2. Obtain an already-authorized immutable complete normalized universe plus
   early history-rejection rows and independent derived gate receipts for the
   same completed session. Include source/parent/safety/decision clocks. Do
   not reconstruct old PIT rows from today's enriched data.
3. Feed diagnosePopulation and challenge offline. Archive non-secret input
   hashes and output receipts; first live complete-population run remains
   PENDING. No admin token has been extracted or bypassed.
4. Class B packet prepared in SYSTEM1_C1_RECEIPT_EXPORT_CLASS_B_REVIEW.md.
   If current APIs cannot export these receipts, use this concrete Class B
   additive export/persistence proposal for owner review; existing cohort
   membership proposal remains unapproved. Do not silently wire this module
   into Formal Worker, D1 or workflow. research/** and tests/** changes on
   main trigger deployment, so publish this branch only, never merge main.
5. Freeze matched baseline/C2 comparison dates, costs/fill assumptions, purged
   holdout, multiple-test ledger and date-cluster/regime controls before any
   outcomes. Record positive and negative cases. Until valid prospective data,
   the diagnostic engineering is source-ready but live stage one unfinished.

Rollback: remove/revert only the four additive files in this branch. No
Production rollback is necessary because nothing was deployed.

## S1-C1-002 — owner-approved Class B implementation candidate

Saved 2026-10-01 22:39 Asia/Taipei. Owner approval supersedes the earlier
proposal-only boundary for the additive C1 receipt/export path only. Formal
A/B, score thresholds, comparator, 3+3+3 quotas, capital, 15-minute signals,
push and System2 remain locked. No Formal switch is authorized.

V8.15.0 adds a complete normalized-universe receipt before history admission,
strict PASS/FAIL/UNKNOWN offline adaptation, all-gate overlap diagnosis,
deterministic reason/gate/pool sampling, immutable D1 generations, protected
pagination and a read-only prospective evidence workflow. It performs zero
additional market calls and persists after the existing Formal path with a
fail-open research firewall. Rows blocked by history remain in the denominator
with explicit UNKNOWN; no missing value becomes zero.

Validation: clean guarded patch chain 62/62; regression commands 52/52;
isolated assertions 71/71; Worker syntax PASS; D1 insert/read/idempotence and
conflict test PASS. Synthetic 2,000-row resource receipt: 3,478,161 bytes,
40 chunks, maximum 86,955 bytes/chunk, local build 18.3 ms. Cloudflare live
CPU, D1 writes and the first complete prospective receipt are still UNKNOWN
until deployment and a completed 23:35 scan.

Formal switch design is recorded in
`SYSTEM1_SELECTION_FORMAL_SWITCH_PROPOSAL_V0_1.md`. It is a Class-C review plan,
not a `FORMAL_OPTIMIZATION_CANDIDATE`: C1 has no forward outcomes, costs,
fills, drawdown or multi-date evidence. Exact continuation is deploy/read back
V8.15 under the approved Class-B scope, collect the first immutable generation,
verify Production configuration and evidence artifact, then accumulate frozen
C2/C3 paired prospective evidence. Rollback is the V8.15 commit plus existing
automatic deployment rollback; immutable research rows are preserved.

## S1-C1-003 — Production activation and guarded readback

Saved 2026-10-01 22:44 Asia/Taipei. Main and isolated branch both point to
`b56b84fce765d8f7319125e6d325b5d8e7233686`. V8 Regression run 36878372976
succeeded in 40 seconds; V8 Cloudflare Deploy run 36878372790 succeeded in
62 seconds, including pre-deploy backup, configuration preservation and the
existing automatic rollback gate.

Production `/api/version` reads `8.15.0-c1-population-receipts`, testMode false,
KV/D1 true. The C1 endpoint denies an unauthenticated request with HTTP 401.
The existing Formal plans remain 2006/4977 with the pre-existing 2026-09-29
plan date and 2026-09-24 close provenance. No re-selection, 3Min write, signal,
push or System2 mutation was invoked for acceptance.

Status: `CLASS_B_ACTIVE / FORMAL_UNCHANGED / LIVE_RECEIPT_WAITING_23_35`.
The first scheduled generation, complete-population digest and live funnel
counts remain pending; failures must remain DATA_QUALITY_BLOCKED rather than a
zero-pick observation. The 00:10 Taipei read-only evidence workflow is the
next verifier. Formal optimization remains ineligible.
