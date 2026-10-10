# Cloudflare Cross-Account Migration Checkpoint V0.1

Date: 2026-10-10 Asia/Taipei
Status: PREPARED / NEW_FREE_ACCOUNT_UI_VERIFIED / PHYSICAL_MIGRATION_NOT_STARTED
Base main: `5cb4aa8503adbf30fb9f18a37af492e562e9b030`
Scope: Infrastructure research and migration only. No System 1 Formal Core or production changes.

## User-confirmed new account (screenshot evidence; not live API verification)
- Account display name: `System2-Stock-Research`
- Billing UI: Workers Free, Active, no payment method on file.
- D1 UI: no database; 0/10 databases; 0/5,000,000 rowsRead today; 0/100,000 rowsWritten today; 0 B/5 GB.
- Account ID: UNKNOWN; do not copy IDs, passwords, or tokens into Git.
- Existing account preserves System1 `fugle-test`; production bindings/cron/routes unchanged.
- The screenshots do not prove R2/KV/Worker inventory, account API access, free eligibility permanence or future charges.

## Verified repo-level implementation
- Root `wrangler.toml`: `fugle-test` entrypoint `Worker.js`, no System2 binding.
- `.github/workflows/system2-isolated-d1-provision.yml` (existing): requires confirmation, quota reservation, `environment: system2-research`, then invokes `system2/deploy/provision_system2_d1.mjs`.
- Provision script targets D1 logical name `system2-research`, requires `CLOUDFLARE_ACCOUNT_ID` and `SYSTEM2_CLOUDFLARE_API_TOKEN`.
- Existing shared D1 quota gate and writer registry are designed for SAME_ACCOUNT. They MUST NOT simply be reused with an account ID flip without account-specific verification and migration-mode CI.
- Historical DATA_LANE has D1/R2 provenance and PIT receipts; a GitHub manifest alone does not prove all physical objects migrated.

## MUST-PASS gates, in order
1. READ_ONLY source-account inventory: all System2 Worker, D1, R2, KV, cron, routes, GitHub deployment environments, binding maps, store sizes, actual owner account, and backups, with evidence timestamps; no secret contents.
2. READ_ONLY destination-account inventory: new account ID masked, Workers Free, D1/R2/KV zero/nonzero and quotas, authenticated least-privilege access after owner approval.
3. DATA_LANE writes a migration manifest of all S2-owned D1 schemas/rows and R2 keys/bytes, record-count/hash/PIT/frozen-decision invariants. No assumed coverage.
4. Migration-target design: isolated new GitHub Environment `system2-migration` (PROPOSED, not created), per-account scoped tokens, explicit source/destination account indicators and safe fail-closed resource classifier. Never reuse production secrets or auto-retarget existing `system2-research` environment.
5. CI guard: reject identical source/destination account ID, V7_DB or fugle-test binding, production cron/routes, unknown resource ownership, absent manifest; verify System1 Formal Core unaffected.
6. READ_ONLY export with immutable SHA256 and manifest; versioned backups; storage checksum and snapshot reproducibility.
7. OWNER APPROVAL gate for Cloudflare resource provisioning, new permissions/secrets, storage charges and deployment.
8. Create destination D1 with explicit target account AND exact logical name only, then schema dry-run/readback. No production Worker.
9. Restore into destination only after verified source backup; idempotent and append-only preservation of `s2_` frozen snapshots; fail closed on hash mismatch.
10. Copy destination R2 only for verified required objects; validate key count, bytes, hashes and source/available timestamps. KV if and only if verified used.
11. API/shadow read-only tests, exact reference dataset agreement, multi-writer quota checks performed per-account, and separate full-run evidence (real source, no synthetic PASS).
12. Independent audit + owner-authorized cutover; only one S2 business writer active per decision namespace; no duplicate pushes; rollback controls preapproved.
13. Observe operation for the approved window and keep source historical data intact until separately authorized retirement.

## Cross-account data contract (proposal)
Share SHARED_KNOWLEDGE through GitHub main. Use independent source acquisition for S2. Optional V8 benchmark export is READ_ONLY HTTPS with short-lived least-privilege authorization, and payload provenance `sourceSystem, marketDate, observedAt, availableAt, version, SHA256, PITStatus, expiresAt`. Never send formal signal states, holdings, capital or live push payloads to S2. A source outage must not block either system's decision runtime. Missing data = UNKNOWN; keep original event-time timestamps.

## CORR-003 / acceptance boundary
Cross-account separation solves ONLY *same-account* D1 collision after verified actual routing. Each account still has its own read/write thresholds and must fail closed on unknown account usage. Keep original 19 requirements; AUDIT_LANE decides closure, REMEDIATION_LANE coordinates. System1 #1024 P01/P02/P04 and System2 #1026 P03/P05 remain separate physical evidence requirements. No synthetic PASS.

## Quantified status
- Migration gates: 0/13 fully accepted.
- New account screenshots: billing Free and empty D1 observed, but no API attestation yet.
- Provisioning: 0; destination DB created: 0; data copied: 0; live traffic switched: 0.
- Cloudflare cost commitment: 0 newly authorized by this checkpoint.
- Blockers: new account authenticated inventory/permissions, full source physical inventory, immutable backup manifest, explicit production/cost authorization.
- Responsible: this infrastructure lane = spec/preflight; DATA_LANE = history; System1 operations = V8 runtime; REMEDIATION_LANE = CORR intake; AUDIT_LANE = independent verification; owner = Cloudflare account/secret/paid/cutover approval.

## Hard STOP conditions
Never mutate production account, never modify `wrangler.toml` or `Worker.js`, never launch physical provisioning against unspecified account, never place token/account private values in PR, never claim source resources missing from an outdated planning document. This checkpoint is a DRAFT PROPOSAL awaiting lane review.

## 2026-10-10 staged engineering continuation (same Draft PR #1058)

State: OFFLINE_ENGINEERING_IMPLEMENTED / PHYSICAL_MIGRATION_UNSTARTED / PERMISSION_GATE_PENDING.

Implementation on dedicated PR branch (not main, not a Cloudflare deploy):
- `system2/migration/cross_account_preflight_v0_1.mjs`: rejects same source/destination account, ambiguous D1/R2/Worker IDs, shared V7_DB/STOCKS_KV, unverified inventories, existing destination targets and absent source manifests; never authorizes mutation.
- `system2/migration/cloudflare_inventory_readonly_v0_1.mjs`: authenticated metadata-only GET of source/dest D1, Workers, R2 buckets, KV and System2 Worker Cron/binding names, with pagination, opaque SHA fingerprints and strict artifact redaction. NOT a route inspection, D1 table census, or R2 object byte proof.
- `system2/migration/run_readonly_inventory_v0_1.mjs`: two-account runner, requires distinct account IDs and exact read-only acknowledgment; outputs sanitized JSON only.
- `.github/workflows/system2-cross-account-inventory-readonly.yml`: manual dispatch only, new dedicated `system2-migration` environment with **four dedicated secrets**, no production secret reuse or mutating Cloudflare call. Owner must set up environment + two READ tokens; workflow unavailable for production until reviewed/merged. No automatic invocation.
- `system2/migration/cross_account_storage_reconciliation_v0_1.mjs`: offline physical receipt comparator for immutable D1 tables, frozen snapshot SHA, schema/export hashes and R2 key/bytes/SHA; matching returns MATCHED_REVIEW_REQUIRED not cutover permission.
- `system2/migration/CROSS_ACCOUNT_OWNER_SETUP_AND_CUTOVER_RUNBOOK_V0_1.md`: owner one-time setup, quota-safe data export, staged destination schema/mirror/readback, no dual-cron and rollback protections.
- Added focused tests: `cross_account_preflight_v0_1.test.mjs`, `cloudflare_inventory_readonly_v0_1.test.mjs`, `cross_account_storage_reconciliation_v0_1.test.mjs`, `cross_account_inventory_workflow_guard_v0_1.test.mjs`.

Verified GitHub CI evidence on implementation head `39ef9ee5a36909e65a9ff1032c4fc03c3c1f04dd`:
- System2 Research CI `38013583385` SUCCESS.
- V8 Regression `38013583412` SUCCESS.
- Later branch commits require their own final-head CI acceptance; do not extrapolate previous PASS.

Quantitative acceptance (different denominators; never combine):
- Offline implementation planned components: 6 modules/runner/workflow/verification/runbook + 4 focused test files documented; merged into main 0 until owner/Lane review.
- Physical migration must-pass gates: **0/13 accepted**.
- New target D1 created: **0**. Historical D1 tables copied: **0**. R2 objects copied: **0**. Cutover activated: **0**.
- New account D1 empty/Workers Free: user UI observed only; authenticated Cloudflare API attestation pending.
- System2 Shadow 15 formal gates: canonical accepted count **0/15** at latest verified ledger baseline; 75-subcheck progress tracked separately by BUILD/DATA/AUDIT, never inferred from infrastructure PR.

Additional verified official vendor limit (2026-10-10): Workers Free D1 has a single-database 500 MB capacity, separate from aggregate 5 GB/account; source `system2-research` D1 metadata `file_size` is now queried by GET and UNKNOWN/size >= 500,000,000 bytes blocks one-DB Free migration. Physical source size not yet obtained; no free-capacity acceptance assumed. Source: https://developers.cloudflare.com/d1/platform/limits/ and https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/get/ .

Exact next continuation: re-read main and #1058; verify final-head System2 CI/V8 regression; obtain owner-approved `system2-migration` environment secrets via secure GitHub UI; invoke **only owner-approved manual read-only inventory**, collect source/destination receipt SHA and actual D1/R2 resource counts; have DATA_LANE create genuine source backup manifest and avoid D1 quota collisions; then request separate resource provisioning approval. Keep `system2-resonance-deploy.yml` and `system2-isolated-d1-provision.yml` unchanged until new-account lane review.

## 2026-10-10 10:47 Taipei first owner-run inventory failure

- Actual GitHub workflow dispatch: `System2 Cross-Account Inventory (READ ONLY)` run `38018220653`, on main `9f54c122849e615e0aa42bdab0564e0d70703e57`, **FAILED**, 14 seconds; no artifact.
- `Guard manual read-only authorization`: SUCCESS.
- `Collect both accounts metadata using dedicated scoped READ tokens`: FAIL; first *SOURCE* `GET /accounts/{sourceAccountId}/d1/database` returned **HTTP 401**. No source inventory, destination inventory, data export, Cloudflare resource mutation, or copy took place. `Verify no production files were changed`: SUCCESS.
- Do not infer invalid token, source/dest IDs transposition or permission mismatch solely from HTTP 401. The relevant Cloudflare API authorizes D1 Read or D1 Write; missing/wrong token and wrong account scope are separately investigated. Official docs: https://developers.cloudflare.com/api/resources/user/subresources/tokens/methods/verify/ and https://developers.cloudflare.com/api/resources/d1/subresources/database/methods/list/ .
- New isolated repair branch `infra/s2-cross-account-readonly-auth-diagnosis-20261010` adds two-account GET-only `/user/tokens/verify` plus D1-list auth diagnosis, sanitized role-specific outcomes and a fail-closed gate. The diagnostic artifact is written before blocking the inventory, even when the source is denied. No Token, token ID, account ID, Authorization header or Cloudflare response body may enter logs or artifacts.
- This is a **Draft PR change**, not live, not re-run and not authoritative until owner-reviewed merge and exact-head CI PASS.
- Physical migration acceptance remains **0/13**. Hard stop: never switch `system2-research` secrets, never request write permissions to troubleshoot GET 401.
- Exact next step after CI and approved merge: user reruns only the existing manual GET-only workflow; inspect SOURCE and DESTINATION sanitized token/D1 read statuses; update only the failing Environment secret with owner action if needed, not via chat.


## 2026-10-10 11:26 Taipei — first authenticated inventory, R2 destination gate

Real run [#38020519397](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38020519397), main `5360d7e92e333eb3c5d8776853fd1dbe4d49c7a4`, read-only, FAILED. Downloaded sanitized authorization artifact #11657981745 (SHA256 `da3b7c4345ffacfcc2ec68dd07970d6c438b54de84cb1f2f56b2827baed27379`):
- SOURCE Token verify 200 / D1 listing 200, active TRUE, `D1_READ_GRANTED`.
- DESTINATION Token verify 200 / D1 listing 200, active TRUE, `D1_READ_GRANTED`.
- Explicit authorization preflight `D1_READ_PREFLIGHT_PASS`.
- Full SOURCE metadata inventory function returned successfully, but was **not persisted as a standalone artifact** because subsequent DESTINATION phase failed.
- DESTINATION `GET /accounts/{destination}/r2/buckets?per_page=100`: **HTTP 403** at `r2Buckets` line 51, `Promise.all` index 2, runner line 16. Full inventory not serialized. No Cloudflare writes, data copy, new resource or formal cutover.
- 403 by itself cannot discriminate `Workers R2 Storage Read` permission denial (Cloudflare R2 code 10003) versus an account lacking R2 subscription/entitlement (code 10042) or another failure. Owner screenshot previously displayed new Workers Free and *no payment method on file*. Do NOT assert R2 subscription is active, encourage a billing checkout, or suggest the destination is R2-ready without explicit owner authorization.
- Vendor: https://developers.cloudflare.com/api/resources/r2/subresources/buckets/methods/list/ and https://developers.cloudflare.com/r2/get-started/ ; https://developers.cloudflare.com/r2/api/error-codes/ .

Isolation-safe PR branch `infra/s2-cross-account-r2-entitlement-diagnostics-20261010` adds a GET-only four-service-per-account probe with allowed numeric Cloudflare error code only, a sanitized artifact even on failure, and a fail-closed gate before full inventory. This avoids blindly reissuing valid tokens for non-token R2 403 and tests all four scopes independently. Code/CI do NOT prove subscription. Required owner decision if R2 unentitled: whether to activate subscription after full fee review or design an approved D1-only Phase-1 Shadow profile preserving cold archive source read-only; no unauthorized cost.

Migration acceptance still **0/13** until physical copy and evidence. Next action: CI/independent review, then owner approves merge of diagnostic PR; owner runs one manual GET-only diagnostic, assistant retrieves sanitized receipt. No new Token creation unless code explicitly identifies permission denial. 


## 2026-10-10 11:47 Taiwan owner run — R2 not entitled confirmed

Physical, owner-manually-authorized, GET-only GitHub Run [#38021761468](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38021761468) on main `f3127262b7b442045686032da72f9b086a680fb5`, FAILED ONLY at the explicit service-read guard. The failure is correct fail-closed behavior. Official immutable sanitized service artifact ID `11658562378`, artifact SHA256 `55216243d9917d065213a719dee0af08260848b8fc0af1dc2da95dc8ab714b62`, downloaded and inspected as `service-diagnostic.json`.

| Resource | SOURCE | DESTINATION |
|---|---|---|
| D1 | HTTP200 / READ_GRANTED | HTTP200 / READ_GRANTED |
| Workers | HTTP200 / READ_GRANTED | HTTP200 / READ_GRANTED |
| KV | HTTP200 / READ_GRANTED | HTTP200 / READ_GRANTED |
| R2 | HTTP200 / READ_GRANTED | HTTP403, Cloudflare numeric error 10042, R2_ACCOUNT_NOT_ENTITLED |

Vendor confirms 10042 = `NotEntitled`, requires R2 subscription: https://developers.cloudflare.com/r2/api/error-codes/ and https://developers.cloudflare.com/r2/get-started/ . **No subscription may be enabled without owner consent.** R2 free allowance does not mean subscription activation cannot enable usage billing; current official Standard storage included: 10 GB-month / month, 1M Class A, 10M Class B (https://developers.cloudflare.com/r2/pricing/).

Owner additionally issued standing LIMITED permission on 2026-10-10: merge low-risk isolated/offline PRs without repeatedly requesting per-PR confirmation iff architecture, formal business functionality, finances/billing, credentials, data writes, production deployment remain unaffected. Concrete restrictive conditions recorded in `system2/migration/DELEGATED_LOW_RISK_MERGE_POLICY_V0_1.md`. This does **NOT** authorize physical Cloudflare migration or R2 subscription.

This PR's repair is **read-only partial inventory**, rather than lying about a complete destination:
- SOURCE complete D1/Workers/KV/R2 metadata required.
- DESTINATION must have D1/Workers/KV READ_GRANTED and R2 exact **HTTP403 code10042**, and an attested receipt created in the same run. Only then may the destination R2 bucket list be skipped.
- DESTINATION has `complete=false`, `r2BucketsVerified=false`, `r2Status=NOT_ENTITLED`. No R2 count claim or full migration PASS. Full physical preflight remains blocked.
- For all other 401/403/429/unknown errors the workflow continues to fail closed and store diagnosis.
- No D1 SQL, no R2 object fetch, no write, no Worker deployment, no subscription enablement, no new permissions.

Outcome of Run #38021761468: neither DB nor archive transferred; physical migration acceptance 0/13. Goal of partial safe-only follow-up: capture resource metadata and actual source D1 file size to decide if independent Free D1-only Shadow is practical. No System1 Formal runtime modification.


## 2026-10-10 11:58 Taipei — both-account physical metadata inventory SUCCESS

Actual owner-manual GET-only [Run #38022384514](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38022384514), main `a85f041b9a05ea811b4e9dd9fc08cd1ddeed73cc`, **SUCCESS**. Downloaded and inspected sanitized GitHub Actions artifacts auth #11658558673, service #11658598468, inventory #11658558682; artifact digests and full precise resource scope recorded at `system2/migration/evidence/CROSS_ACCOUNT_REAL_READONLY_INVENTORY_20261010_V0_1.md`.

**Physical source-account discovery:**
- `system2-research` D1 database measured `file_size = 316,968,960 bytes`. Free single-DB limit 500,000,000 bytes: initial file-only fit 63.4% with 183,031,040 bytes raw slack; actual import row count, index amplification, future data and account daily rowsWritten still UNKNOWN.
- SOURCE has D1 `system2-research` and `v7-live`, Workers `system2-shadow-research` and `fugle-test`, R2 bucket `system2-historical-research`, KV namespace `fugle-stock-config`, and a scheduled System2 Cron `*/5 0-5,11 * * MON-FRI`. The System2 Worker has `SYSTEM2_DB` and `SYSTEM2_HISTORY_BUCKET` bindings. Do NOT mistake KV for S2-only.
- DESTINATION has **zero D1, zero Worker, zero KV, zero Cron**, but R2 is **NOT ENTITLED** (403 numeric code10042). Destination R2 count UNKNOWN, not zero.
- TOKEN and D1 scope READ PASS for both; all source service READ PASS; DESTINATION D1/Workers/KV pass. Remote invoice, routes, D1 table hashes, frozen snapshot integrity and cold R2 bytes NOT obtained.
- Preflight state remains **BLOCKED**, reasons `DESTINATION_RESOURCE_INVENTORY_UNVERIFIED`, `IMMUTABLE_SOURCE_MANIFEST_MISSING_OR_INVALID`. Physical migration acceptance still 0/13; no data copied, no destination D1 provision, no bills or Cloudflare mutations.
- Practical offline engineering next: add explicit `D1_ONLY_STAGING_NO_R2_NO_CRON_NO_LIVE_WRITES` proposal guarded by actual data manifests. Existing `system2/deploy/wrangler.system2.example.toml` includes R2 and active Cron and MUST NOT be reused as-is. Existing bounded resonance Worker GET/scheduled handlers rely on D1, but full daily Shadow and cold historical replay still need independent PIT/source review.
- User standing bounded approval for GitHub-only low-risk work does NOT grant any resource creation, destination write creds, schema/app data mutation, R2 subscription, duplicate Cron, Shadow formal acceptance or cutover; all remain owner authorization decisions.


## 2026-10-10 — Source schema attestation handoff (OFFLINE ONLY)

The first real 2026-10-10 account inventory #38022384514 measured source `system2-research` D1 `file_size=316,968,960` bytes and verified both-account metadata, but still supplied **zero actual D1 table row-counts / frozen-archive content hashes**. No physical database copy authorized.

New direct SQL DDL discovery on current GitHub `system2/sql/`: **11** sequential migration SQL files define **56** distinct `s2_` tables (repository definitions). Existing deployed documentation mentions **46** tables; notably the *first seven* SQL files define 46 tables. This is a plausible explanation but **NOT physical evidence** of the actual applied schema. Never infer physical migration state from file count. The SQL schema attestor demands a physically read-back applied-migration prefix and exact table-set consistency; a malformed/missing receipt fails closed.

Versioned offline tooling:
- `system2/migration/source_d1_export_attestation_v0_1.mjs`: deterministic SQL file hash/table index, applied migration evidence, table counts and hash shape checks, frozen-decision cardinality and backup retention checks, System1 read reserve/Cloudflare account usage proof requirement, rough minimum rowsWritten days.
- `system2/migration/run_source_d1_export_attestation_v0_1.mjs`: CLI local-only, never reads API tokens or Cloudflare.
- `system2/migration/SOURCE_D1_PHYSICAL_EXPORT_EVIDENCE_CONTRACT_V0_1.md`: exact DATA_LANE physical source receipt and AUDIT_LANE verification responsibilities. No PIT acceptance from source hashes alone.
- `system2/tests/source_d1_export_attestation_v0_1.test.mjs`: full/partial applied SQL prefix, missing/extra table, stale fingerprint, wrong frozen hash/cardinality, quota unknown, duplicate and malformed secret-free mocks.

Historical DATA_LANE / issue #1026 remains separate owner of real Hot D1 reads and historical R2 archive receipts. **Original System1 account read reserve is not currently authorized**; this migration lane must not launch full-table physical SQL scans itself. Safe next: DATA_LANE generates an independently approved bounded source D1 readback/backup manifest *after real reserve*, or durable quota DEFER if unsafe. ACTUAL SOURCE CONTENT BACKUP 0, DEST D1 0, DEST DATA 0, DEST R2 UNENTITLED. Migration full acceptance **0/13** unchanged. Owner authorization required for D1 creation, new write permissions, physical import and cutover.


## 2026-10-10 — Worker transitive source dependency refined (GitHub-only)

Main `d0667422ae934b99e753424c1057320928820b25` (PR #1069) introduced an offline reachable import graph analyzer. Real PR-head research test scanned **37** Worker-dependent Git HEAD modules, 0 explicit R2 runtime binding references, but correctly returned `SOURCE_DEPENDENCY_REVIEW_BLOCKED` because `system2/runtime/decision_archive.mjs::sha256Hex(value)` contains conditional `await import("node:crypto")`.

The module uses `globalThis.crypto?.subtle.digest("SHA-256", bytes)` and returns first; Node crypto is a fallback for environments without WebCrypto. This is not an R2 dependency, but the actual deployed Worker hash/Cloudflare runtime remain UNKNOWN. A new additive-only module `system2/migration/d1_only_webcrypto_fallback_source_audit_v0_1.mjs` independently classifies **only this exact source code** as a reviewed static candidate if the underlying strict scanner has no additional blocker, preserving the original fail-closed scanner without modification. It does not change `decision_archive.mjs`, hashes, PIT or strategy. Documentation: `system2/migration/D1_ONLY_WEBCRYPTO_FALLBACK_REVIEW_V0_1.md`.

New formal DATA_LANE issue [#1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068) requests a real quota-authorized physical D1 schema/table rows/frozen/backup manifest. No broad D1 scans, source R2 transfers or destination provisioning were authorized or executed here. **Physical migration acceptance remains 0/13.** Before any new database or Worker deployment, require explicit owner resource/permission approval, independent backup check, runtime smoke evidence, no Cron/route and actual deployed SHA verification.
