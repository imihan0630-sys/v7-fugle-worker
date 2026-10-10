# D1-Only System2 Worker Dependency Audit V0.1

Date: 2026-10-10 (Asia/Taipei)  
Type: OFFLINE, SOURCE-ONLY DIAGNOSTIC — NOT DEPLOYMENT APPROVAL

## Why
The existing `system2/deploy/wrangler.system2.example.toml` declares an R2 binding and active scheduled Cron, whereas the visible bounded resonance `system2/deploy/worker.mjs` uses D1 for persistence. The new Free destination Cloudflare account lacks R2 entitlement (GET 403 code10042), proven by GitHub physical run #38021761468 and inventory success #38022384514. To test whether D1-only staging is technically plausible without Cloudflare changes, we audit the **transitive import graph** rather than looking only at the Worker root.

## Offline command
```bash
node system2/migration/run_d1_only_worker_dependency_audit_v0_1.mjs
```
Source-only module: `system2/migration/d1_only_worker_dependency_audit_v0_1.mjs`.  
Negative and real-graph tests: `system2/tests/d1_only_worker_dependency_audit_v0_1.test.mjs`.

This tool recursively examines local static ES imports from `system2/deploy/worker.mjs`. It reports file count and paths of modules containing explicit R2 dependency references. Dynamic imports, require, any module outside `system2/`, unavailable file, external module or unexpected size = unresolved / fail-closed. It neither runs the Worker nor calls Cloudflare; never reads secrets, live bindings, routes or account state.

## Correct interpretation
- `SOURCE_IMPORT_GRAPH_NO_R2_REFERENCE_CANDIDATE_ONLY`: NO explicit R2 symbol found among statically reachable Git HEAD modules. **Not proof** that a destination Worker will run, that the deployed source Worker matches Git HEAD or that the full historical/frozen Shadow suite is available without R2.
- `SOURCE_DEPENDENCY_REVIEW_BLOCKED`: one or more explicit references or unresolved graph edges need an independent review; do not skip dependencies based on a guess.
- Always `sourceWorkerDeployedShaVerified=false`, `destinationDeployAuthorized=false`, `destinationCronAuthorized=false`, `publicRoutesAuthorized=false`, `activeTradingAuthorized=false`.
- Worker `scheduled()` can attempt real D1 writes when enabled. The existing production `system2-resonance-deploy.yml` AUTO deploys on some paths and sets active Cron, so it must NOT be reused for new-account staging. Previously merged config generator emits a disabled Worker proposal only; the Cloudflare destination currently has zero Worker and zero D1.
- D1-only cannot replace source historical R2, and 15 Shadow on-line gates remain separately acceptance-gated. Do not change source S2 cron until owner-approved single-writer cutover.

## Next
If source import graph has no R2 references, BUILD_LANE and AUDIT_LANE must still verify exact deployed source Worker version, complete runtime/API read-only behavior, data dependency and PIT, then separate owner approval for physical Cloudflare provision and disabled deployment. If graph blocks, preserve path-specific reason and repair in isolated branch under the delegated low-risk boundary.


## 2026-10-10 actual source graph finding

Exact-head System2 Research CI run [#38023998224](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38023998224) traversed **37** Git HEAD modules from `system2/deploy/worker.mjs`. Explicit `SYSTEM2_HISTORY_BUCKET` / R2 module references discovered: **0**. Yet status `SOURCE_DEPENDENCY_REVIEW_BLOCKED` because import graph has at least one unresolved dynamic import.

Direct source inspection found `system2/runtime/decision_archive.mjs` function `sha256Hex`: first uses `globalThis.crypto.subtle.digest`, then conditionally falls back to `await import("node:crypto")` if WebCrypto is not available. Thus the dynamic import is a conditional **Node crypto fallback**, not direct R2 usage, but the statically possible branch remains an environment-compatibility uncertainty. Do **NOT** remove/change it under the migration lane or assert the live Cloudflare Worker executes it only in the WebCrypto branch without an independent smoke.

Additional offline-only test `system2/tests/d1_only_disabled_worker_offline_smoke_v0_1.test.mjs` now loads current Worker source in Node 22 and calls /health, UI GET and scheduled() with capture/resonance arms disabled, **no D1, R2, KV or FUGLE_API_KEY** bindings. Such a PASS is code-only isolation proof, not destination Worker deployment, source SHA parity, hot-data readback, PIT acceptance or authority to enable Cron.

Separate owner approval is still mandatory for creating destination D1, staging Worker deployment, secrets/write grants and live scheduling.
