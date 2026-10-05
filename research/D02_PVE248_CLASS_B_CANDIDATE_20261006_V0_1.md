# D02 PVE-248 — Class-B runtime remediation candidate

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_B_CANDIDATE_PREPARED / ISOLATED_CI_PASS / FULL_CI_BLOCKED_BY_PREEXISTING_BASE_FAILURE / DRAFT_PR_OPEN / UNMERGED / NOT_DEPLOYED

## Purpose

Prepare the bounded System 1 Class-B repair candidate authorized by engineering governance for proposal/testing only.

No merge or Production deployment is authorized.

## Candidate branch and PR

Branch:
`research/d02-pve248-class-b-candidate-20261006`

Active candidate head:
`302f6739b7c28c077f955b070c63332a7b59b61b`

Draft PR:
`#651 — D02 PVE-248: Class-B PV runtime remediation candidate v2`

PR #650 is superseded. It was automatically closed when the candidate branch was temporarily reset to the then-current base during a safe reconstruction. It was never merged or deployed.

## Candidate scope

The candidate changes only the bounded shared-runtime/evidence path required by PVE-246/PVE-247.

### 1. After-market schedule identity

`isAfterMarketSchedule` recognizes:
- `35 15 * * mon-fri`;
- `35,55 15 * * mon-fri`.

Existing `runAfterMarketScan(...,{onlyIfMissing:true})` and D1 lease semantics are retained.

Cron audit detail records `result.reason` when no status exists, making `ALREADY_SCANNED`-type recovery idempotence physically observable.

### 2. PV baseline warmup sidecar

A fail-open research sidecar attempts PV baseline bootstrap on governed after-market events using currently monitored Formal stocks.

The sidecar does not convert a Formal scan failure into success and does not modify selection logic.

The existing `v7_pv_intraday_baselines.slot_stats_json` payload is extended with a research bootstrap receipt rather than adding a new D1 table/schema.

Receipt fields include:
- bootstrapAttemptAt;
- symbol;
- from/to;
- providerStatus;
- rawRowCount;
- normalizedSessionCount;
- rejectedSessionCount;
- rejectedSessionReasons;
- finalValidSessions.

### 3. 15m fetch-boundary provenance

The candidate reads the exact HTTP response text before JSON parsing.

For 15m capture it computes SHA-256 over that exact response text and carries:
- provider;
- endpoint without credentials;
- rawPayloadHash;
- rawPayloadHashBasis=`EXACT_PROVIDER_RESPONSE_SHA256`;
- capturedAt;
- normalizationVersion.

These remain distinct from the existing semantic fingerprint.

## Candidate-only validation

Dedicated workflow:
`.github/workflows/d02-pve248-candidate.yml`.

It reconstructs Worker from the repository regression build-chain, syntax-checks Worker, and runs the PVE-248 runtime candidate guard.

Successful runs:
- push run `37386567610` — SUCCESS;
- PR #651 run `37386696263` — SUCCESS.

Thus the candidate itself builds and passes its targeted runtime guard on the repository build-chain.

## Full CI blocker attribution

PR #651 full checks:
- V8 Regression Tests `37386695299` — FAILURE;
- V8 Repair CI `37386695246` — FAILURE.

Both fail at:
`tests/test_system1_zero_pick_evidence_collector_v0_1.mjs`
with:
`collector CLI failed`.

Both terminate before the newly added PVE-248 runtime test executes.

Independent counter-evidence from main:
- main V8 Regression run `37382689408` also fails at the same existing collector test;
- that run contains no PVE-248 candidate.

Therefore the full-CI red state is classified:
`PREEXISTING_BASE_CI_BLOCKER_NOT_PVE248`.

PVE-248 does not modify that unrelated System 1 collector merely to manufacture a green PR.

## Governance consequence

Candidate state:
- prepared: YES;
- targeted candidate CI: PASS;
- full repository CI: BLOCKED by pre-existing base failure;
- owner approval: NOT GRANTED;
- merged: NO;
- deployed: NO;
- Production readback: NOT APPLICABLE.

No engineering candidate state implies H001 evidence readiness.

## Research consequence

Still:
- remediationReady=false;
- h001ReceiptEligible=false;
- clean prospective selection dates=0;
- D02 maturity=60.0%;
- Gate 7 CLOSED;
- FORMAL_OPTIMIZATION_CANDIDATE=NONE;
- Formal Core LOCKED.

2026-10-05 remains permanently non-retroactive.

## Exact next continuation point

PVE-249 — System 1 resolves the pre-existing `test_system1_zero_pick_evidence_collector_v0_1.mjs` base-CI blocker and returns a durable green main/regression receipt. Then rerun PR #651 full Regression + Repair CI. Only after the candidate and repository-wide applicable checks are green may the owner be asked for explicit Class-B merge/deploy approval. Without that approval, remain draft/unmerged/un-deployed.
