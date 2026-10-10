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
