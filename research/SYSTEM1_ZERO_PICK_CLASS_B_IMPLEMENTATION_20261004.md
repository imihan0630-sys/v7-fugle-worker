# System 1 Class-B zero-pick prospective capture — V8.16.0

Status: IMPLEMENTED_ON_BRANCH / PRODUCTION_APPROVAL_REQUIRED / FORMAL_CORE_LOCKED

## Authority and approval

- Repository baseline freshly fetched: `1e5a7ac975d2902e27351c2921dc888d7acd32af`.
- Production `/api/version` readback: `8.15.4-c4-priority-provenance`, TEST_MODE=false, KV/D1=true.
- Owner explicitly authorized implementation in the current Codex session: **「我批准 Class-B zero-pick rank-input prospective capture 實裝」**.
- This records implementation authorization. It does not infer production authorization from test results.
- `RESEARCH_ENGINEERING_GOVERNANCE.md` requires owner review and explicit approval of the material production change before merge/deploy. This PR changes the existing production build chain; merging triggers production deployment.
- Version rationale: additive research evidence functionality with no selection architecture change, hence V8.16.0 under `VERSIONING.md`.

## Implementation

`apply_v8_16_0.py` follows V8.15.4. The root `Worker.js` remains unchanged.
The script verifies SHA-256 of the existing frozen canonicalization, runtime source adapter and rank observer, then scopes their unchanged code inside the generated Worker. No Class-A formula or comparator is redesigned.

The selector captures each pool's feature insertion ordinal before Formal scoring/sorting. Pool assignment uses that scan's official close (`<1000` GENERAL, `>=1000` THOUSAND). C1 construction attaches `rows[].zeroPickRankObservation` to feature-admitted rows, including Formal-rejected rows, independently of future outcomes. No feature means a null child, not a fabricated tuple. Missing required numeric inputs produce `INCOMPLETE` with `rankInput=null`; real numeric zero remains valid.

The child retains the six-field counterfactual tuple, stable ordinal, comparator lineage, formula version and source-time provenance. `knownAt=decisionAt` means `REQUEST_LOCAL_KNOWN_BY_DECISION_AT_UPPER_BOUND`; feature/sector raw event times remain null. Exact-date consensus preserves `updatedAt` and rejects a timestamp after decisionAt. Missing/wrong-date consensus contributes zero sources and remains explicitly absent. Capture reads only the same request's memory.

The synchronous receipt has `fingerprintState=PENDING_ASYNC_FINALIZE` and a null fingerprint. In the existing async persistence boundary, `finalizeC1ZeroPickReceipt` hashes canonical tuple fields with the existing SHA-256 helper, on a copy of the receipt. It verifies receipt/child/tuple identity and PIT time. Only `SHA256_FINALIZED` persisted receipts are authoritative. No selector async conversion, provider call, new table, schema migration, scan endpoint, or research-to-Formal feedback is introduced.

Existing D1 atomic batch, generation conflict/idempotency guard, complete content/universe digest verification and protected paginated C1 GET readback remain in use. Legacy generations are never retrofitted. Existing same-day post-close `persistCompletedC1Safe` admission and outer failure handling preserve the prospective boundary and fail open to Formal execution. Hash/storage failure marks research DATA_QUALITY_BLOCKED.

## Formal firewall and validation

The only changed existing runtime functions versus V8.15.4 are:

- `buildC1PopulationReceipt`
- `persistC1PopulationReceipt`
- `selectTomorrowCandidates`

New helpers: `c1ZeroPickOrdinals`, `buildC1ZeroPickChild`, `finalizeC1ZeroPickReceipt`.

The new integration test normalizes exactly these plumbing additions and the version label, then checks the entire remaining Worker source for byte equality against the guarded pre-patch build. This protects scoring, consensus, rankFn, capital, signal state, 15m, push, order, routes and all unrelated runtime code. Isolated review additionally enforces the exact three-function allowlist against V8.15.4; its historical V8.15.0 review remains intact.

Deterministic feature-boundary fixtures run actual Formal scoring/sorting/allocation for six selected symbols and a zero-selection population. All selected plans, capital, diagnostics and shadow outputs match baseline, including injected capture and ordinal failures. A fetch tripwire records zero calls. Complete rejected-row tuples match the frozen pure observer and independent Node SHA-256 output. Tests cover numeric zero/missing values, exact/wrong/future consensus, stable ties/no cross-fill, tuple identity, immutable replay/conflict, corrupted D1 readback, no legacy backfill and async hash failure.

Initial local SQLite/D1 scale results (all rows have COMPLETE tuples, with Chinese names):

| Rows | Whole receipt UTF-8 bytes | Max chunk UTF-8 bytes | Chunks |
|---|---:|---:|---:|
| 500 | 2,150,662 | 85,989 | 25 |
| 1000 | 4,300,464 | 85,993 | 50 |
| 2000 | 8,600,665 | 86,009 | 100 |

These are fixture measurements, not production resource guarantees. The hard per-chunk limit remains 90,000 bytes. Oversized individual rows fail research persistence and cannot alter Formal plans. Existing capped announcement fields and variable production payloads can change totals; production resource/readback observation remains required.

Required CI: V8 Regression Tests, V8 Repair CI, System1 C1 C2 isolated offline repair review. The build writes an uncommitted pre-patch artifact solely for the source comparison. Test results are written to `artifacts/system1-zero-pick-runtime-capture.json` and `artifacts/system1-c1-c2-repair-review.json`.

## Production review and exact continuation

1. Check all three required CI runs on the PR's exact head; re-fetch main and inspect concurrent runtime changes.
2. Present the PR, technical gate result and bounded storage/CPU risk for owner production approval. Do not equate Class-B acceptance with deploy authorization.
3. After explicit production approval, merge using the expected PR head SHA, through the existing code-only Cloudflare workflow. Preserve bindings, existing Cron, configuration and targets.
4. Confirm `/api/version=8.16.0-zero-pick-prospective-capture` and normal deployment readback. Do not run a business scan, historical preview/reselection, push or 3Min POST to manufacture acceptance.
5. After the first genuine subsequent trading-day scan, read the protected existing `/api/research/c1-population` endpoint with normal admin authorization, pin all pages to one generation, verify content/universe digests, finalized fingerprints, pool/ordinal identity and same-request timestamp semantics. Post-session eligibility must join the matching C1-derived C5 population; never use a later repaired consensus or unrelated generation.
6. For a genuine zero-pick date, take only matched P1-A F9 rows with complete stored rankInput, apply the frozen full comparator, max 3 per pool/no cross-fill, then use the existing frozen economic comparison protocol. Never average every F9 row against cash.

The session occurs over the weekend. All engineering samples are fixtures. No new prospective market evidence is claimed.

`economicSuperiority=UNKNOWN`; `formalOptimizationCandidate=NONE`; System 2 untouched; Formal Core LOCKED.

Monitor: https://fugle-test.imihan0630.workers.dev/
