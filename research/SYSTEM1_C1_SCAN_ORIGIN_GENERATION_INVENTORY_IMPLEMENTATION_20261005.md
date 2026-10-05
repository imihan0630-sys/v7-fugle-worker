# System 1 C1 Scan-Origin & Generation Inventory Class-B implementation

Status: OWNER_APPROVED_IMPLEMENTATION / ENGINEERING_IN_PROGRESS / PRODUCTION_MERGE_DEPLOY_NOT_AUTHORIZED  
Date: 2026-10-05 Asia/Taipei  
Branch: `codex/system1-c1-scan-origin-inventory`  
Base at branch creation: `d35d5ba97038a6a168b282b655e805a43e89c8dc`  
Formal Core: LOCKED

## Objective

Close the C1 observability gap without changing selection economics: establish which request entrypoint produced each new C1 generation, expose the persisted generation inventory, and distinguish a genuinely absent generation from an existing generation that ordinary latest-only readback did not surface.

This tranche does not claim that older C1 generations can be assigned an origin. Pre-V8.19 rows remain `LEGACY_ORIGIN_NOT_CAPTURED`; timestamps, Cron rows, plan dates, or current runtime state must not be used to manufacture a historical origin.

## Additive contract

Runtime candidate: `8.19.0-c1-scan-origin-inventory`.

New request-local origin kinds:

- `CLOUDFLARE_CRON`: scheduled after-market entrypoint, retaining Cron expression and scheduled clock.
- `AUTHORIZED_MANUAL_API`: authenticated `POST /api/scan`.
- `TEST_FINALIZE`: TEST_MODE-only finalize path.
- `READ_ONLY_DRY_RUN`: preview/test capture that is never persisted as a production C1 generation.
- `INTERNAL_UNCLASSIFIED`: explicit fallback for an otherwise uncategorized runtime caller; it is not silently inferred into another category.

Each invocation receives an opaque `scanAttemptId`. New C1 generation headers retain the request origin, attempt id, invocation/scheduled clocks, requested date, only-if-missing state, test mode, generation id, session date and decision clock. The same origin root is anchored into the first C1 row, therefore existing immutable C1 contentDigest/readback binds the header origin to stored row evidence. V8.19+ readback rejects a missing or mismatched origin anchor.

## Generation inventory

New protected read-only endpoint:

`GET /api/research/c1-generation-inventory`

It lists actual rows from `trade_research_c1_generations`, optionally filtered by `scanDate`, with bounded offset pagination. It returns generation id, scan/decision/capture clocks, runtime/source SHA, universe/content digests, population/capture/feature/chunk counts, completeness and captured scan-origin fields. It never exports population rows and never initiates selection or provider calls.

The response also exposes a sanitized current `V7_LAST_SCAN_ATTEMPT` only when relevant to the requested date. The legacy attempt-KV write contract is deliberately left byte-identical; it may therefore lack origin fields. The immutable C1 generation header/row anchor is the authoritative origin evidence, while latest-attempt KV remains auxiliary diagnosis only. Overwritten pre-V8.19 attempts are not reconstructed.

No new D1 table, binding, schedule, provider call or historical migration is introduced.

## Protected invariants

The V8.19 patch may alter only C1 plumbing/entrypoint observability functions plus the new inventory reader. Formal scoring and execution functions must remain byte-identical to the V8.18 candidate. In particular:

- A/B setup and thresholds unchanged.
- ranking/comparator, Top6 and pool quotas unchanged.
- capital/allocation unchanged.
- 15-minute confirmation, BUY/ADD/REDUCE/SELL/STOP semantics unchanged.
- push/order/external write behavior unchanged.
- System2 unchanged.
- no second selection and no extra market/provider fetch.

Research capture failures remain fail-open for Formal execution. The inventory endpoint is ADMIN_TOKEN protected and read-only.

## Verification plan

Required before PR engineering acceptance:

1. guarded patch builds immediately after V8.18 in Regression, Repair CI and Production build chain;
2. pure-module tests cover origin normalization, identity/clock binding, tamper rejection and legacy classification;
3. final Worker test proves only the approved plumbing functions changed and the new inventory reader was added;
4. V8.18 source-vintage review remains pinned to the pre-V8.19 artifact;
5. full regression and isolated C1/C2 repair review pass at the exact PR head;
6. no Cloudflare deployment is triggered from the PR.

Merge and Production deployment are a separate owner gate because merging the guarded script into `main` activates the existing Production workflow.

## Rollback

Before any separately approved deployment, rollback is simply closing/reverting this branch/PR. After a future deployment, use the existing code-only Worker rollback to the previously verified runtime while preserving KV, D1, configuration, Cron and immutable historical evidence. Do not delete C1 generations and do not backfill origin.

`FIRST_PROSPECTIVE_C1_SCAN_ORIGIN_READBACK=PENDING_PRODUCTION_APPROVAL_AND_GENUINE_SCAN`

Economic superiority: UNKNOWN. Formal optimization candidate: NONE.
