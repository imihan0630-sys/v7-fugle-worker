# System 1 Valuation Source Vintage Class-B implementation

Status: IMPLEMENTED / LOCAL_REVIEW_100_OF_100_PASS / EXACT_HEAD_CI_PACKET_IN_PR_604 / PRODUCTION_DEPLOY_NOT_AUTHORIZED
Date: 2026-10-05 Asia/Taipei
Branch: `codex/system1-valuation-source-vintage`
PR: https://github.com/imihan0630-sys/v7-fugle-worker/pull/604 (OPEN; merge/deploy NOT AUTHORIZED).
Authority: latest main and owner approval in `SYSTEM1_VALUATION_SOURCE_VINTAGE_CLASS_B_PROPOSAL_20261005_V0_1.md`.

## Scope and runtime lineage

Verified Production baseline: `8.17.0-shadow-cohort-membership`, TEST_MODE=false, KV/D1=true.
Candidate: `8.18.0-valuation-source-vintage`. This adds a research capture capability, so VERSIONING.md requires a feature version. The guarded patch follows V8.17.0; repository Worker.js is unchanged.

The after-market request passes its already-read VALUATION, FINANCIAL and QUARTER_EPS normalized snapshots to an isolated research helper before the existing synchronous selector. It clones/freezes canonical plain JSON and computes domain-separated SHA-256 over each entire normalized payload, including its original metadata, stocks and values. No provider call, re-fetch, schedule, API route, new D1 table or historical migration is introduced.

`captureObservedAt` is the instant this request starts freezing the already-loaded payload, before its C1 `decisionAt`. It is neither the provider event timestamp nor a globally earliest observation. `officialFirstKnownAt=null`, `officialFirstKnownState=NOT_PROVEN`, and `systemFirstObservedContinuity=NOT_PROVEN` remain explicit. A later request with the same asOfDate and changed content gets a different digest; it cannot replace an existing generation.

## Compact immutable contract

C1 header `valuationSourceVintage` contains common snapshot metadata, capture time, content digests/counts, decision clock and generation/request identity. Each row carries compact `valuationProvenance` and `sectorMedianPeProvenance` references:

- `V1` resolves to this immutable generation's common root. The row retains valuationDate/source, available EPS source/year/quarter, EPS origin, and sourceKnownByDecisionAt true or null. Shared FINANCIAL/VALUATION/EPS dates, quarters, digests, official-first-known state and decision clock live once in the header.
- `S1` resolves to the common `SAME_SCAN_POSITIVE_PE_MEDIAN_V0_1` derivation and valuation snapshot. The row retains its actual feature industry, same-feature positive-PE peer count and whether peer inputs match that valuation snapshot. Existing C1 feature.sectorMedianPe is preserved, never recalculated/repaired for persistence.
- QUARTER_EPS is preserved even if present but not applied (wrong financial period or epsReviewOnly). Its scope is reviewed symbols, not the whole universe. Missing per-symbol EPS data preserves FINANCIAL fallback lineage; absent metadata stays null.
- The first C1 row stores SHA-256 of the complete shared provenance root. Existing C1 contentDigest hashes all rows, including that anchor and every per-row child. The existing immutable header equality/conflict guard plus whole-generation readback binds the shared header to the rows. Mutating shared metadata is detected on readback.
- Snapshot payload digests identify the exact normalized input consumed by this request; this tranche does not archive a second full source payload or assert independent official source authenticity. C1 stores the actual gate values and compact metadata, not a duplicate full-population store.

The module is SHA-pinned by the patch. No sync hash substitution and no async conversion of the selector.

## Failure and interpretation

Capture exceptions/future timestamps/request-date mismatch produce `DATA_QUALITY_BLOCKED`, never fabricated provenance. Finalization/digest or capture-budget failure drops only the additive child and leaves an explicit blocked marker. C1/D1 failure remains contained by existing persistCompletedC1Safe; Formal execution proceeds. The existing 90,000 UTF-8-byte row/chunk guard remains, with a 9,990,000-byte draft capture budget (10 KB reserved for final C1 header fields under the 10 MB receipt bound) and 90 KB shared-root guard.

The existing daily evidence collector adds `valuationSourceVintage`, verifying the complete C1 digest/keyset, shared root digest, clock/generation identity, peer counts and pagination metadata. Invalid provenance is blocked independently of established C1/C2/C3 and R2 structural behavior. Legacy receipts are `LEGACY_NO_SOURCE_VINTAGE`, not repaired. A pre-V8.18 receipt bearing the new marker is rejected.

No new Alpha factor/vote is added. The information roots are the existing price-derived valuation and FUNDAMENTAL_ACCOUNTING inputs; peer median shares that same parent, not an independent vote. This addresses part of SDA-008's engineering provenance requirement only. Official filing clocks, historical-universe replay, genuine capture continuity, D16 promotion evidence and 00 closure remain outstanding; no audit ticket is closed.

Even a valid capture is at most `SELECTION_TIME_SOURCE_VINTAGE_CAPTURED`. `promotionGradeOutcomeJoin=false`, `economicSuperiority=UNKNOWN`, `formalOptimizationCandidate=NONE` remain unconditional. R1/R2 Class-A research was not redesigned.

## Validation and resource packet

Changed existing runtime functions only:
`runAfterMarketScanCore`, `selectTomorrowCandidates`, `buildC1PopulationReceipt`, `persistC1PopulationReceipt`, `verifyC1StoredGeneration`.
The first two have exact normalized-body parity after removing the additive capture call/argument; all other runtime outside the five plumbing functions and new isolated module/version is byte-identical. In particular scoreCandidate/applyMarketConsensus, valuation 2.5x/25%, A/B, liquidity, ATR, RR, grade, sector gate, rankFn, Top6/3+3, capital and signal/15m/push/order remain unchanged. System2 is untouched.

Dedicated tests cover digest determinism/content revision, snapshot immutability, wrong-period/absent EPS, zero values, missing/future provenance, header tampering, generation conflicts, legacy no backfill, real SQLite D1 readback/pagination, shared cohort compatibility, fail-open capture, and actual six/zero selector output parity. Provider tripwire delta=0.

Measured fixtures (complete zero-pick tuple, full-precision qualified tuple, Chinese names and EPS source metadata):

| Rows | Total C1 bytes | New provenance bytes | Maximum chunk |
|---|---:|---:|---:|
| 500 | 2,492,204 | 194,795 | 89,616 |
| 1,000 | 4,982,460 | 388,798 | 89,634 |
| 2,000 | 9,961,961 | 775,798 | 89,634 |

Three input SHA hashes plus a shared-root hash, extra canonicalization/memory, slightly more existing C1 chunks, and readback validation add CPU/D1/storage cost. Local timing (~1.7 seconds for the 2000-row fixture including SQLite persistence/readback/collector) is not a Cloudflare resource guarantee. No new D1 schema/bindings or external requests. Production CPU/latency and actual first generation remain unverified.

Rollback after any separately authorized future deployment: existing code-only backup/rollback to verified V8.17.0; retain KV/D1/config/targets/four Cron and all immutable C1 evidence. Do not delete or rewrite the new rows and do not rescan history. Old runtime may ignore additive metadata; the new collector continues to validate stored roots.

## Exact next action / authorization gate

Full local isolated review is 100/100 PASS (451 protected legacy functions in the cumulative review). Concurrent main through `49f52984` was reconciled without runtime changes. PR #604 is published. Read its current head and exact-head CI packet; require exact-head V8 Regression, V8 Repair CI and System1 C1 C2 isolated offline review all PASS. The PR description records the final exact-head CI packet without self-referential commit hashes. Then STOP: owner has authorized engineering/PR verification only, not merge or Production deployment. Do not enable auto-merge or dispatch any workflow deployment.

`FIRST_PROSPECTIVE_VALUATION_SOURCE_VINTAGE_READBACK=PENDING_PRODUCTION_APPROVAL_AND_GENUINE_TRADING_SESSION`
Formal Core LOCKED. Monitor: https://fugle-test.imihan0630.workers.dev/

Initial exact-head isolated CI 37246876698 PASS. Regression 37246876792 and Repair 37246876731 stopped at stale V8.17.0 version grep guards before behavioral tests; both guards are updated and a three-workflow exact-version assertion prevents recurrence. Use the current PR head CI packet for final acceptance.
