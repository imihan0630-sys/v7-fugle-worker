# S2 D1-only Worker WebCrypto Fallback Review V0.1

Date: 2026-10-10 Asia/Taipei  
Scope: GitHub source audit ONLY. No Cloudflare API, Worker deployment, secrets, R2 subscription, data writes or Cron.

## Specific finding
The original transitive source graph scan (PR #1069 / main `d0667422`) visited **37** static modules, observed **0 explicit R2-binding references**, but returned `SOURCE_DEPENDENCY_REVIEW_BLOCKED` due to dynamic import. The concrete reviewed dynamic import is in `system2/runtime/decision_archive.mjs`, function `sha256Hex(value)`:

- Preferred `globalThis.crypto?.subtle` path computes SHA-256 and returns.
- Node-only fallback uses `await import("node:crypto")` if WebCrypto is absent.
- The fallback does **not** itself reference R2. Worker runtime code SHA and actual Cloudflare Web Crypto availability remain unverified from GitHub source alone.
- Because the actual function underpins decision/immutable hashes, **do not modify** `decision_archive.mjs` just to silence a static scan; that would alter an important runtime path without authorizing evidence.

## Safeguarded independent source audit
`system2/migration/d1_only_webcrypto_fallback_source_audit_v0_1.mjs` composes the existing stricter import graph checker. It permits an *informational* candidate finding ONLY when:
1. The baseline scan has exactly the known `DYNAMIC_IMPORT_OR_REQUIRE_UNVERIFIED` blocker and no other blockers.
2. Exactly one reachable file has any dynamic import or require operation: `system2/runtime/decision_archive.mjs`.
3. The sole dynamic import is the literal `node:crypto` fallback, inside the exact WebCrypto-first SHA-256 branch with a return before the fallback.
4. Every static import is available, no explicit R2-binding names appear anywhere in the statically reachable files, and no unrelated dynamic module loader is present.
5. Source graph result does **not** authorize deployment: `SOURCE_WEBCRYPTO_FALLBACK_REVIEWED_NOT_RUNTIME_PROVEN`; `realWorkerRuntimeTested=false`, `deployedWorkerShaVerified=false`, `stagingDeployAuthorized=false`, `cronAuthorized=false`. The original baseline strict scanner **remains unchanged**.

`system2/tests/d1_only_webcrypto_fallback_source_audit_v0_1.test.mjs` directly reads the real Worker graph and tests a SHA-256 known vector. Adversarial cases remove the WebCrypto branch, alter digest algorithm, replace node fallback, inject second dynamic imports, require, unknown files, and add R2 tokens. All remain blocked.

## Practical consequence / next owner gate
- Git HEAD bounded Worker source is an evidence-backed D1-only **candidate**, not a staged Worker or proof all market-data/PIT/history paths work without R2. No second Cron may activate.
- Source D1 currently holds 316,968,960 bytes; destination new Free account still has zero D1/Worker, and R2 is NotEntitled (Run #38022384514). D1-only staging requires approval for resource creation/permissions, and a separate DATA_LANE physical backup/readback as specified in Issue #1068.
- The first safe runtime test would be a local Cloudflare Workers-compatible environment with `crypto.subtle` and disabled D1 mock bindings, **not a live Worker write or Cron**. Any production deployment / data import / charges require owner decision and independent audit.

This module does not downgrade source hashes, PIT, strategy, frozen snapshots or live trading behavior. It merely prevents a known conditional Node crypto fallback from hiding the actual status of the D1-only static import graph.
