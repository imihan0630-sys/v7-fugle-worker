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
