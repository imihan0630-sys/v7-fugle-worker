# System 2｜PIT 原始證據 × 選股接入：DATA／BUILD 固定分工與交接契約 V0.1

Status: **OWNER-APPROVED CROSS-ROOM ROUTING / Class A GOVERNANCE ONLY**  
Effective: 2026-10-16 Asia/Taipei  
Repository authority: **latest GitHub `main`**; never treat a chat summary, old snapshot, Issue comment or unmerged PR as authoritative implementation.  
Room identities: **DATA_LANE = System 2｜歷史資料工程室**; **BUILD_LANE = System 2｜建置總控室**.  
Precedence: `AGENTS.md`, `RESEARCH_ENGINEERING_GOVERNANCE.md`, `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`, existing security gates and owner decisions retain priority. This document allocates work; it does not grant new Cloudflare/production privileges, lower PIT thresholds, or edit System1.

## 1. Routing rule on every future owner request containing PIT

**DATA_LANE = PIT ORIGINAL EVIDENCE PRODUCER.** Own original information source acquisition, PIT availability and class/continuity evidence, historic storage/migration and independently auditable source packages. DATA does **not** author, activate or tune strategy-ranking/Frozen/Shadow final selection.

**BUILD_LANE = PIT EVIDENCE CONSUMER & SELECTION-RECOVERY ENGINEER.** Own read-only handoff adapters, verified evidence binding to existing `SHORT_MOMENTUM` Stage1 policy, per-symbol eligibility and UNKNOWN reasons, full-universe denominator, candidate ranking/decision pipeline, create-only Frozen preparation and Shadow replay. BUILD does **not** re-fetch/reconstruct issuer historical native original documents, redo DATA PIT original archives/migrations, or self-certify historical official CFI/CA evidence.

If the owner says merely **「繼續 PIT」「解決 PIT」「恢復選股」**:
- in **歷史資料工程室**, default to the next unblocked **DATA** native CFI/CA/PIT original-evidence task; never switch to developing strategy selection.
- in **建置總控室**, default to the next unblocked **BUILD** read-only consumer/integration task using the latest *actually verified* DATA receipts; never duplicate the original historical PIT data collection.
- for an explicitly cross-lane ask, each room implements **only its owned half**, writes handoff/proposal for the counterpart in GitHub; no cross-room auto-start claim.
- ambiguities or one file shared by two lanes: follow **one conflict unit → one active modification owner** in Execution Lane Governance, with explicit ownership transfer documented **before editing**. Do not silently overwrite parallel PRs.

## 2. Non-overlapping deliverables

| Authority | Exclusive main tasks / modification family | Output |
|---|---|---|
| **DATA** | TWSE/TPEx native historical source GET/storage, 61 official trading-session calendar, historical per-symbol **ordinary-equity class CFI** original effective-period and native-version proof, firstKnownAt/availableAt, full historic company action CA correction/retraction/suspension/NO_EVENT negative coverage, source R2/D1 history copy, record hashes and identity parity, source receipts and indexes; `system2/migration/**` and source-only `system2/scripts/**` and PIT evidence gates where specifically assigned to DATA | **source-only**, PIT original proof, completeness matrix, signed producer receipt with original ZIP/Artifact/Run/hash; owner checkpoint `system2/SYSTEM2_HISTORICAL_DATA_CHECKPOINT.md` + `system2/migration/ISSUE1068_DATA_LANE_CHECKPOINT_V0_1.md` |
| **BUILD** | consume (never fabricate) original DATA proof in `system2/runtime/shared_official_a1_stage1_admission_v0_1.mjs` and selection readiness, versioned PIT-to-assessor adapters, `SHORT_MOMENTUM` / strategy scoring against actually eligible symbols, complete universe accounting, ranked candidate/Shadow pipeline, evidence and date lineage, authorized Frozen prewrite/preflight logic; `system2/runtime/**` strategy/selection/Frozen-owned modules and BUILD tests | per-symbol READY/UNKNOWN/blockers and original-data link, eligible/assessed counts, `selectedCount=null` unless legitimately authorized, strictly versioned strategy/decision results; checkpoint `system2/SYSTEM2_CHECKPOINT.md`, #1132 / #1234 |
| **AUDIT** | Independent native original ZIP and SHA/source timestamp/CA-negative/CFI period verification; independently verify DATA artifacts and BUILD output separately | independently accepted/rejected receipts, never infer PIT from a producer hash alone |
| **REMEDIATION** | Owner-bounded account-wide D1 writer interlock, source/destination quota headroom and recurrent multi-lane safety breakage | validated writer capacity controls #1238; may not promote selection |
| **OWNER** | Class B/C/production permissions, extra Secret, paid service, new Worker/Cron, source D1 write quota, formal trading or high-risk Frozen deployment | separate explicit authorization only |

Historical original-source functions that currently reside inside BUILD-oriented paths remain under the **original source semantics owner** until a lane-specific explicit ownership transfer; responsibility follows the *component*, not just the directory name. Changes to a shared file require one named owner for that PR.

## 3. DATA → BUILD handoff is a contract, not a green CI badge

DATA publishes a GitHub-main-bound **PIT_SOURCE_HANDOFF** evidence link (no obligation to create a new D1 table or source GET solely for the handoff) with:
1. `marketDate` T, actual `evaluationAtUtc` / decision cutoff, `windowStartDate`, **original official tradingDates** and market/symbol scope (TWSE/TPEX); exact official sample denominator + missing/unresolved counts.
2. Original source family IDs/provider URLs and native `Run/Job/Artifact` links, original body ZIP/row SHA256 and signed `receiptHash`; where applicable batch/manifest IDs, source version & documented independence of separate readback.
3. Source clock: `firstKnownAt` / `availableAt` / `observedAt` and actual issuer-native `effectiveFromDate/effectiveThroughDate` with original historical version (not inferred by backdating today's CFI); CA actual corrections, withdrawals, suspended/reinstated events and **negative NO_EVENT scope completeness**. Explicit UNKNOWN where not provable.
4. Independent `AUDIT_LANE` verdict and exact tested subject scope. A DATA-produced signed receipt alone is `SOURCE_EVIDENCE_SUBMITTED`, **not** `INDEPENDENT_PIT_ACCEPTED`. If an original artifact is missing/late, mark `SOURCE_NOT_READY`, not fabricated `NO_EVENT`.
5. Machine-readable list of **eligible vs unresolved symbols**, exact reason codes and any missing native families; list of executable `BUILD` read-only consumer tests with exact original producer SHA.
6. False-authority flags always `selectionAuthorized=false`, `frozenD1Written=false`, no retrospective `zeroPickDay` or `selectedCount=0` derived from missing input.

**Acceptance states (never interchange):**
- `SOURCE_OBSERVED`: original bytes found, does **not** prove period-aware PIT.
- `SOURCE_INDEPENDENTLY_REHASHED`: independent exact identity/bytes verified; still may have missing historical effective coverage.
- `PIT_SCOPE_INDEPENDENTLY_ACCEPTED`: independent examiner has confirmed **that specified symbols, market dates and CFI/CA native versions** were available by exact decision clock, includes negative-event completeness and effective windows. Not a blanket 1,972-name signoff.
- `BUILD_CONSUMER_EVALUATED`: Stage1 verified input and actual per-symbol assessor summary; **does not** imply Frozen, formal selection, or trade authority.
- `FROZEN_PHYSICALLY_ACCEPTED`: separately authorized create-only actual D1 insert + independent D1 readback, never implied by local SQLite/CI tests.

For SOURCE-only or partially verified documents, BUILD may write **diagnostic readiness/UNKNOWN** receipts and tests, but cannot promote selection. A previously late `T+1 01:59` readback may be a valid source diagnostic but cannot be backdated into T's decision.

## 4. Build consumer handshake and no duplicate work

1. **Both** rooms start from latest `main` and registry/this contract, then their own checkpoint; compare SHA, active PRs and last DATA/BUILD evidence first. A 2026-10-15/16 published receipt is not automatically current for later sessions.
2. **DATA** acquires/verifies sources and publishes a PR → CI → merge → independent original readback. If only producer-native evidence is available, label OPEN/PENDING independent audit. DATA returns a single issue link in [#1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068) (or a successor source-PIT Issue) naming the exact data set and blockers.
3. **BUILD** consumes **that exact merged main SHA** and receipts, without duplicated original provider GET or bulk D1 SELECT. Run offline/no-write consumer tests for `SOURCE → PIT classification → existing SHORT_MOMENTUM assessor → full universe state accounting → ranking/frozen readiness`. One subset of eligible stocks may be tested without pretending the full universe is qualified; report `1,972` denominator (or verified newest actual denominator) explicitly. A partial qualified diagnostic cannot become a complete market selection.
4. **BUILD** records verified per-symbol `PIT_READY/UNKNOWN` counts, factor families, blockers, candidate/rank state and frozen authority in [#1132](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1132) / [#1234](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1234). **Never** redefine historical issuer class/CA source admissibility inside the scorer to bypass DATA blockers.
5. **AUDIT** independently confirms any upgrade; D1 actual writes, extra writer slots or real Shadow automation remain separately governed, including [#1238](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1238).
6. No GitHub Issue comments or repository file changes automatically wake a different ChatGPT conversation. On the other room's next `繼續/PIT` turn, GitHub `main` and its registry/checkpoint **must** be re-read.

## 5. No-go / protection

- No original source fetched twice unless DATA justifies new version, altered effective window, original unavailable/failed SHA or explicitly requested independent auditor re-fetch.
- Current CFI cannot be assumed valid throughout 61 sessions; corporate-action silence is **not** verified `NO_EVENT`; `122/122` source A1 is not PIT-ready; 59,311/84,688 DEST rows and original source-linked SHA are **not** historical issuer PIT.
- Never use post-outcome material, retrospectively assign `firstKnownAt`, or call unavailable/late evidence a timely decision.
- Do not change System1 V8 Formal Core/A-B/Top6/monitoring/push or runtime. No secrets, Cloudflare writes/deployments/new Cron by these instructions.
- Modifying strategic weights, global rank, actual trading or other formal changes requires separate approved version. Existing M09 S0–S5 and any currently open safety gates remain OPEN until truly accepted independent original Run/Artifact/D1 evidence.
- If DATA has no handoff yet, BUILD does **not** idle or seize DATA; implement read-only consumer interoperability, fail-closed negative tests, legitimate partial-denominator reporting and gated Frozen pipeline in parallel.

## 6. Permanent prompt references

- DATA room: `system2/prompts/PIT_DATA_LANE_CONTINUATION_V0_1.md`
- BUILD room: `system2/prompts/PIT_BUILD_LANE_CONTINUATION_V0_1.md`

**Routing entrypoints:** `shared-knowledge/ROOM_BOOTSTRAP_REGISTRY.json` checkpoints for `SYSTEM2` and `SYSTEM2_DATA`; `system2/SYSTEM2_EXECUTION_LANE_GOVERNANCE_V0_1.md`; both room checkpoints. The source of truth is this document at the actual latest GitHub `main`, not a copied chat prompt.
