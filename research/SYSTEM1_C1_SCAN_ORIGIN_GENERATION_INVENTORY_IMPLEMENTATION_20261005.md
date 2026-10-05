# System 1 C1 Scan-Origin & Generation Inventory Class-B implementation

Status: OWNER_APPROVED_CLASS_B / IMPLEMENTED_ON_BRANCH / CI_PENDING / MERGE_NOT_AUTHORIZED / PRODUCTION_DEPLOY_NOT_AUTHORIZED  
Date: 2026-10-05 Asia/Taipei  
Branch: `codex/system1-c1-scan-origin-generation-inventory`  
Implementation baseline at branch start: `9d33c05c37cbe050cebe50bd651973451b38cf26` (historical baseline only; latest main must be re-read before PR acceptance).

## Objective

Close the remaining C1 provenance gap between an immutable generation and the runtime path that created it, while making every stored generation for a scan date inspectable as one bounded inventory. This is evidence infrastructure only. It does not change which stock can pass, how stocks rank, how many slots a pool receives, how capital is allocated, or how any trade signal is emitted.

## Implemented contract

Candidate runtime: `8.19.0-c1-scan-origin-generation-inventory`.

Each V8.19+ C1 generation receives `scanOrigin` before immutable persistence. Allowed observed runtime origins are:

- `AFTER_MARKET_SCAN_PIPELINE`: normal `runAfterMarketScanCore` persistence path. The external transport remains `NOT_IDENTIFIED_BY_THIS_CAPTURE`; the implementation does not guess Cron versus manual/admin invocation.
- `STAGE_SELECTION_ROUTE`: the protected `/api/scan/stage-selection` route, including the known dry-run computation path.
- `DIRECT_SAFE_PERSISTENCE_CALLER`: bounded fallback for direct internal/test persistence callers so all V8.19 generations have honest provenance without inventing a route.

The origin object is bound to `generationId`, `sessionDate` and `decisionAt`. Relabeling the same immutable generation to another origin conflicts rather than overwriting provenance.

## Generation inventory

No second inventory table is introduced. The read-only inventory queries the existing canonical `trade_research_c1_generations` table by `scan_date`, preserving one source of truth.

Protected endpoint candidate:

`GET /api/research/c1-generation-inventory?scanDate=YYYY-MM-DD&limit=N`

The response separates:
- total generation denominator from returned rows;
- legacy versus V8.19+ origin coverage;
- immutable generation clocks/digests/counts;
- origin status/kind/path/trigger semantics;
- truncation and data-quality state.

The inventory is explicitly a session snapshot and may grow until the session is complete. It does not claim immutable session completeness merely because a query succeeded.

## Legacy and fail-closed semantics

- Pre-V8.19 generations without scan-origin metadata are `LEGACY_NO_SCAN_ORIGIN`.
- Historical scan-origin is never inferred or backfilled.
- A pre-V8.19 generation bearing the new marker is a legacy conflict.
- A V8.19+ generation missing/mismatching origin metadata is `DATA_QUALITY_BLOCKED` / readback failure.
- Corrupt modern rows remain visible in the inventory as blocked; they are not silently omitted.
- Research provenance failure cannot authorize plan changes, trading or push.

## Formal isolation

No intended change to:
- Strategy A / Strategy B;
- `scoreCandidate`, market-consensus scoring or Formal gate thresholds;
- priority/rank comparator;
- Top6 / 3+3 pool quotas;
- capital sizing;
- BUY / ADD / REDUCE / SELL / STOP;
- 15-minute formal signal confirmation or 10-minute auxiliary meaning;
- monitoring, push, order or holdings semantics;
- provider-call count or provider source selection;
- System 2.

The implementation adds no provider call, no scheduler and no D1 schema/table.

## Files in this tranche

- `research/system1_c1_scan_origin_generation_inventory_v0_1.mjs`
- `scripts/apply_v8_19_0.py`
- `tests/test_system1_c1_scan_origin_generation_inventory_v8_19_0.mjs`
- cumulative C1/C2 offline review wiring
- Regression / Repair / guarded Cloudflare build-chain wiring
- `VERSIONING.md`
- `PROJECT_HISTORY.md`
- this checkpoint

## Validation contract

Before engineering acceptance:
1. reconcile latest main and confirm no runtime conflict;
2. guarded patch must apply after V8.18 exactly once;
3. Node syntax must pass;
4. dedicated origin/inventory adversarial tests must pass;
5. cumulative C1/C2 isolated review must prove only the bounded V8.19 plumbing functions changed;
6. Regression and Repair CI must pass on the exact PR head;
7. provider-call delta remains zero and no new generation-inventory table exists;
8. no merge, auto-merge or Production deployment occurs under this approval.

## Exact continuation point

Open a draft PR only after re-reading latest main and reconciling any concurrent commits. Let PR-triggered Regression, Repair CI and isolated review run. Repair any branch-only failures and repeat exact-head verification until green. Then STOP at the production gate.

`FIRST_GENUINE_V8_19_SCAN_ORIGIN_READBACK=PENDING_PRODUCTION_APPROVAL_AND_GENUINE_SESSION`

`FIRST_GENUINE_V8_19_GENERATION_INVENTORY_READBACK=PENDING_PRODUCTION_APPROVAL_AND_GENUINE_SESSION`

`economicSuperiority=UNKNOWN`  
`formalOptimizationCandidate=NONE`  
`Formal Core=LOCKED`
