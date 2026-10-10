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


## 2026-10-10 12:45 Taipei — NEW ACCOUNT bootstrap risk isolated (offline-only)

Current main baseline `4d739c6d3ab35d4d0efbc7d4a2e09583d2a5d00b`. Latest account inventory physical Run #38022384514: SOURCE `system2-research` D1 316,968,960 bytes; DESTINATION still physically not yet provisioned in that receipt (D1/Workers/KV 0, R2 NotEntitled code10042). No new live account read or mutation this milestone.

**New critical static finding:** Existing `.github/workflows/system2-isolated-d1-provision.yml` is bound to the *legacy/source* GitHub Environment `system2-research`, and calls `system2/deploy/provision_system2_d1.mjs` with `secrets.CLOUDFLARE_ACCOUNT_ID` from there. That script POSTs database creation and SQL migrations. It MUST NOT be reused/repointed for NEW-account staging. Likewise the old system2 Wrangler example has `workers_dev=true`, R2 binding and active Cron; never deploy it on target. These risks have now been explicitly captured in an offline fail-closed blocker test that inspects the real existing source workflow/script and disabled staging config, while changing none of them.

New safe-only docs: `system2/migration/DESTINATION_D1_ONLY_BOOTSTRAP_DECISION_AND_ISOLATION_V0_1.md`. Offline blocker validator: `system2/migration/destination_d1_bootstrap_isolation_gate_v0_1.mjs`. Negative tests: `system2/tests/destination_d1_bootstrap_isolation_gate_v0_1.test.mjs`. Every output sets `physicalDBCreationAllowed=false`, no side effects or API call; it does **not** empower provisioning.

Fastest separately approvable next *physical* gate, **not executed**: create one empty `system2-research` D1 in the DESTINATION Free account ONLY with a new destination-scoped and protected permission boundary. No schema import, no data copy, no Worker/Cron/public endpoint, no R2 subscription; owner must grant explicit Cloudflare resource/credential permission. Even an empty target does not satisfy source DATA_LANE Issue #1068 backup/PIT evidence or original migration 13 acceptance requirements.

Source D1 real read reserve remains unauthorized: formal `readReserveNumberAuthorized=false`; thus physical entire DB SQL backup cannot be run just because earlier GET-only inventory succeeded. Next safe artifact should be an independent destination account permission/cost assessment, or DATA_LANE physical DEFER until approved budget.


## 2026-10-10 13:11 Taipei — owner manually created intended empty target D1; API readback pending

Owner provided Cloudflare D1 Overview screenshot immediately after pressing `Create` for intended `system2-research` in new `System2-Stock-Research` account, with data location hint Asia Pacific. Screenshot observed `Number of Tables=0`, `Rows read=0`, `Rows written=0`, `Storage used (current)=12.29 kB`. The image does not itself display the account identity or DB UUID; **physical status = USER_UI_CREATED_PROVISIONAL / AUTHENTICATED_POSTCREATE_ACCOUNT_D1_RECEIPT_PENDING**; never claim authenticated verification of new D1 from UI alone. Owner has not authorized schema/data import, staging Worker deployment, R2 subscription or Cron.

To prevent duplicate creation, original proposed target D1-create [PR #1074](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1074) was CLOSED UNMERGED; do NOT dispatch, revive or merge that write-capable Workflow. GitHub [Issue #1073](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1073) records the owner screenshot status, pending one fresh GET-only cross-account inventory, and future independent audit. Old source physical D1 remains 316,968,960 bytes in prior GET-only Run #38022384514.

New repo-only safe verifier: `system2/migration/destination_d1_postcreate_metadata_attestation_v0_1.mjs`. Accepts sanitized signed-out-of-band BEFORE and AFTER Cloudflare GET-only API account resource inventories and owner UI observations, fail-closed on account change, duplicate D1, unexpected Cron/Worker/KV, source asset change or stale reports. Even if D1 target metadata matches, it returns `API_RESOURCE_READBACK_PASS_TABLES_UI_ONLY` and explicitly `destinationTablesSqlVerified=false`; this never authorizes physical data copying, Worker deploy, Cron or billable changes. Grounded UI/next steps: `system2/migration/evidence/OWNER_UI_TARGET_D1_CREATED_20261010_V0_1.md`.

**Next owner action when ready**: run the existing `System2 Cross-Account Inventory (READ ONLY)` manual GitHub Action on main, exact confirmation `INVENTORY_ONLY_NO_MUTATION`, ONCE. Prior source+destination GitHub Environment read tokens remain available; do not make new token. No new physical source D1 row scan. DATA_LANE #1068 frozen backup/PIT and System1 quota authorization still PENDING; 13 physical migration gates NOT all accepted.


## 2026-10-10 13:22 Taipei — Post-create real Cloudflare GET-only account isolation VERIFIED

Owner-manual GitHub Action [Run #38027260602](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38027260602) succeeded on main `b62c83a83e9772f0e0e60b75ec76603fc4e53108`. Evidence Artifact `11661270384` SHA256 `738b923b7ef142f15b45f623b7c99ecd73fcd7d9d29aaf650b73e26a5c24c671`; baseline owner-run [#38022384514](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38022384514) Artifact `11658558682` SHA256 `6b1f60e674e6a759f53ef3907a755e9fcd55fb25186de7769e3e8c526a1213dc`. Both artifact ZIP digests independently recomputed and match GitHub recorded values; full sanitized before/after inventory JSON compared **20/20 checks PASS**. Formal evidence: `system2/migration/evidence/S2_DEST_D1_POSTCREATE_REAL_GETONLY_RECONCILIATION_20261010_V0_1.json`.

**Actual independently authenticated resource inventory**:
- Same distinct source/destination Cloudflare account fingerprints before and after, source resource set unchanged (old `fugle-test`, `system2-shadow-research`, source `system2-research` and `v7-live` D1, old R2 `system2-historical-research`, `fugle-stock-config` KV, original `*/5 0-5,11 * * MON-FRI` S2 Cron).
- **Destination had 0 D1 BEFORE**, and at `2026-10-10T05:22:13.689Z` D1 list has **exactly 1 DB `system2-research`, API file_size=12,288 bytes** with a DB identity fingerprint distinct from SOURCE D1. Destination Worker=0, KV=0, Cron=0. R2 remains `HTTP403 code10042 NOT_ENTITLED`; destination inventory partial *solely due to absent R2 subscription*. Both D1 READ token verifications 200; original System1 Worker code/cron were not changed.
- Owner UI screenshot at ~13:11 Taipei separately showed **0 tables / 0 rowsRead / 0 rowsWritten / 12.29 kB**, but this is **UI evidence only**, not an API SQL table-count/row digest. DO NOT claim full migrated schema.
- The earlier `DESTINATION_RESOURCE_INVENTORY_UNVERIFIED` from generic R2-required preflight is a consequence of its old full-inventory R2 expectation; do NOT interpret as the new D1 metadata READ failed. New D1 metadata has **REAL API PASS**; R2 itself remains unavailable.
- Superseded write-capable [PR #1074](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1074) **CLOSED UNMERGED**, because owner already built the target database and duplicate resource creation must never be retried.

**Milestone:** `OWNER_CREATED_EMPTY_TARGET_D1 / AUTHENTICATED_GET_ONLY_IDENTITY_AND_ISOLATION_PASS / TABLES_UI_ONLY`. This completes isolated *empty resource setup* evidence, NOT the 13 physical migration gates as a whole. No source physical backup/immutable frozen snapshot, source table row hashes, destination SQL schema/data, destination Worker, R2 archive, Cron change or PIT audit can be marked PASS. Original DATA_LANE [Issue #1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068) remains owner of source backup and quota-safe PIT evidence. New cloud action (e.g. target D1 schema import/Worker deployment) still requires the owner's **separate** explicit approval, account-scoped write credentials, independent CI/audit, and capacity/rowsWritten budget.


## 2026-10-10 14:10 Taipei — source-provisioner SQL prefix audit (NO CLOUD MUTATION)

Latest main at task start `0e4e6129db499019af930c4b8e7a20b8d281c109`, target D1 verified through GET-only Resource Inventory Run #38027260602 and PR #1076. Current source post-market D1 read and write reserves remain `false/null` in `system2/evidence/S2_CORR_20261007_003_SYSTEM1_AFTER_MARKET_RESERVE_POLICY_V0_1.json`; do NOT run source wide-table SQL scans or import into destination without separate quota/owner approval.

**Observed source-code schema discrepancy**: `system2/deploy/provision_system2_d1.mjs` contains only SQL `0001..0010` (10 migration files; 55 tables; 63 explicit indexes), while main's complete `system2/sql` has 11 files, 56 defined tables, 66 explicit indexes, 2 triggers. `0011_outcome_revision_archive_staged.sql` is explicitly staged, not included in existing source provisioner. Early bounded `0001..0007` defines 46 tables and 49 indexes, numerically consistent with older references to 46 — **NOT physical proof source has exactly 7 migrations**. Do not infer live source migrations from GitHub intent.

A new offline-only schema prefix verifier and in-memory SQLite suite `system2/migration/destination_schema_prefix_offline_v0_1.mjs` and `system2/tests/destination_schema_prefix_offline_v0_1.test.mjs` check source provisioner prefix, actual SQL file hashes, table/index/schema-version invariants, frozen/historical/resonance tables and staged exclusion, plus adversarial illegal statements and target D1 metadata mismatch. Proven program output can only qualify `OFFLINE_APPROVED_PREFIX_CANDIDATE_ONLY`, never CLOUD SQL permissions, staging Worker deployment or actual source applied schema.

Details: `system2/migration/DESTINATION_SQL_PREFIX_OFFLINE_COMPATIBILITY_V0_1.md`. Physical status unchanged: target new **empty** D1 GET-only inventory PASS; target schema SQL 0, data rows 0, Worker/Cron 0. DATA_LANE #1068 real physical source backup/PIT/schema and System1 read reserve remain blocking actual import.


## 2026-10-10 ~14:50 Taipei — OWNER APPROVED NEW-ACCOUNT SCHEMA-ONLY; MANUAL WORKFLOW MERGED, CLOUD SQL NOT YET RUN

Owner explicitly approved `批准 Schema-only 建置`. This authorization applies ONLY to setting up the existing new-account `System2-Stock-Research` D1 `system2-research` with approved schema (first `0001..0010` SQL), not creating another D1, moving actual historical/frozen rows, opening R2 entitlement, deploying Worker/Cron/routes, activating real strategies/push/trading or changing System1 Formal Core. No paid plan upgrade authorized.

**Latest main at update:** `ba4d8eed8ba8843240880792b2a9e8813d5e4023`. PR [#1078](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1078) was formally approved and merged as `0cb549dd0d760dbaf03ab55de4c3b4ebcf53887c` (offline 125-statement sealed SQL hashes only, no Cloudflare mutation). New [PR #1082](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1082) merged `ba4d8eed8ba8843240880792b2a9e8813d5e4023` with **owner-only workflow_dispatch** `.github/workflows/system2-destination-schema-only-manual.yml`; no automatic workflow trigger, Cloudflare resource or D1 SQL writes on merge. Both exact-head CI PASS: System2 Research [Run #38032127395](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38032127395), V8 Regression [Run #38032127415](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38032127415); postmerge both PASS [System2 #38032234668](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38032234668), [V8 #38032234606](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38032234606).

**Executable design (future owner manually dispatched only):**
- Source account fingerprint explicitly DENIED, destination account fingerprint `27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55` and new D1 UUID SHA256 pinned from actual Run #38027260602; target resource GET must show EXACTLY one D1, same hash and <=32KiB, `sqlite_schema` SELECT empty before SQL. Both account/database identifiers are dynamically SHA256-hashed, not logged.
- First `VERIFY_ONLY` manual run checks D1 empty schema, returns plan SHA256 with zero SQL DDL. Owner must then manually `APPLY_ONCE` with same SHA256, two exact confirmations on `main`. The second run writes at most 125 statements sequentially: 55 tables, 63 named `idx_s2_*` indexes, 7 `s2_schema_meta` upserts, final schema version 1.1; staged `0011` explicitly excluded. Failure, partial write or ambiguous result permanently `DO_NOT_RETRY` pending independent audit. Runtime postwrite counts **both `s2_*` tables and `idx_s2_*` indexes** (specific bug fixed before any physical writes).
- Repository-only fake Cloudflare HTTP tests 125 POST calls, wrong source/target account identity, nonempty DB, wrong approval, unverified plan hash, partial SQL failure and unexpected version, all PASS. No true Cloudflare SQL call has occurred.

**Physical blocker requiring OWNER action (no secrets or IDs in chat):** independently provision Cloudflare **destination-only Account API Token, D1 Edit permission** on new `System2-Stock-Research` account; create separate GitHub Environment `system2-schema-only`; add exactly two new Environment secrets `S2_SCHEMA_DEST_ACCOUNT_ID` and `S2_SCHEMA_DEST_D1_WRITE_TOKEN`. Original `system2-migration` and `system2-research` Environment Secrets remain untouched. Current token/env live existence NOT VERIFIED; the GitHub connector used in this room does not provide account credential creation or Environment secret writer. Full instructions: `system2/migration/DESTINATION_SCHEMA_ONLY_OWNER_RUNBOOK_V0_1.md`.

**Next exact continuation:** await owner confirmation that TWO GitHub Environment secrets have been saved; do NOT ask token values. Then have owner manually dispatch the [Schema-only workflow](https://github.com/imihan0630-sys/v7-fugle-worker/actions/workflows/system2-destination-schema-only-manual.yml) on main, action `VERIFY_ONLY`, confirm `APPLY_EXISTING_DEST_D1_SCHEMA_ONLY_55`, boundary `NO_SOURCE_NO_DATA_NO_WORKER_NO_CRON_NO_PAID`, empty plan_hash. Independently inspect Run/Job/Artifact/SHA. Only if successful and owner confirms new account Free D1 daily headroom, guide a second manual `APPLY_ONCE` using exactly the verified plan SHA256. NEVER self-dispatch or auto-rerun an ambiguous partial failure. After real SQL install, record physical table/index/version readback and AUDIT_LANE proof separately. Until then destination SQL tables **0/55**, historical/frozen rows copied **0**, destination Workers/Cron **0**; source backup/PIT DATA_LANE #1068 still OPEN, original 13 migration/15 Shadow gates NOT accepted. 


## 2026-10-10 ~15:10 Taipei — Read-token destination SQL physical preflight (no new Write token)

Latest formal main at prep `84973e3ae562290bdf0b426a88921778c076d860`. Owner previously explicitly approved **Schema-only engineering** for new existing D1, not extra D1 creation/source data copying/R2/billing/Worker/Cron. Pre-existing physical metadata evidence (GitHub Run #38027260602) confirmed exactly one new-account `system2-research` D1, 12,288 bytes, original source resources unchanged; however physical `sqlite_schema` had only owner UI evidence and no SQL GET/readback.

**New, already merged read-only alternative:** [PR #1085](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1085) introduced separate manual-only [`System2 Destination D1 SQL Empty Preflight (READ ONLY)`](https://github.com/imihan0630-sys/v7-fugle-worker/actions/workflows/system2-destination-schema-sql-readonly-preflight.yml) using **existing destination D1 READ token** from `system2-migration` GitHub Environment: only two D1 metadata GET and one hard-coded `POST /query` **SELECT sqlite_schema**, no SQL DDL/writes or source-token access. Cloudflare official API permits D1 Read token for SQL query (POST is required even for read-only SELECT). Exact source account hash denied, destination account + D1 ID hashes pinned; ambiguous/unknown/nonempty DB fail closed; no source, historical PIT/frozen, R2/Worker/Cron/billing operations. Mock tests cover empty/nonempty SQL and ten adversarial cases. Both PR-head CIs PASS: System2 [#38033596034](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38033596034), V8 Regression [#38033596052](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38033596052). Postmerge main CI pending at documentation time.

**Exact next owner action, NOW, with existing secrets — no new API Token required yet**: manually dispatch the above workflow on `main`, input `confirm = DEST_SCHEMA_EMPTY_SQL_READONLY_ONLY`, once; owner shares Run URL or says `已執行`. This assistant must inspect real Run/Job/Artifact before claiming `DESTINATION_D1_PHYSICAL_EMPTY_SQL_VERIFIED`. Important: the job does NOT run just because merged; status **READY_TO_MANUALLY_VERIFY / NOT_YET_PHYSICALLY_DISPATCHED**.

**Only after** genuine readback PASS: owner sets new-account-exclusive D1 Edit Token in protected GitHub Environment `system2-schema-only` (secrets `S2_SCHEMA_DEST_ACCOUNT_ID` and `S2_SCHEMA_DEST_D1_WRITE_TOKEN`); then the prior owner-approved manual schema installer `.github/workflows/system2-destination-schema-only-manual.yml` has its own VERIFY_ONLY / APPLY_ONCE (exact plan hash, independent Cloudflare SQL prewrite check, 125 schema SQL statements, 55 tables, 63 indexes, schema_version 1.1, staged #0011 excluded). Do not automatically dispatch/copy/data-import. Old source D1/PIT backup DATA_LANE #1068 remains unmet and irrelevant to empty-target SELECT; physical destination Schema SQL still **0/55**, no Worker/Cron deployed, actual migrated historical and frozen rows **0**, full migration/Shadow acceptance not complete.


## 2026-10-10 20:24 Taipei — Real destination D1 SQL empty state PHYSICALLY VERIFIED after strict _cf_KV correction

This supersedes only the older **NOT_YET_PHYSICALLY_DISPATCHED / TABLES_UI_ONLY** status for the SQL-empty read-only gate; all separate source/backup/schema-write/Worker/Shadow gates stay pending.

- Owner manually dispatched `System2 Destination D1 SQL Empty Preflight (READ ONLY)` [Run #38051816632](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38051816632) on **exact main `77fea746d280c5fc6df4d588f89d8d625933ab5e`**, workflow_dispatch, preflight Job `114212314312` **SUCCESS**, including authenticated destination-only D1 metadata GET and fixed hard-coded `SELECT sqlite_schema`. No DDL or Cloudflare storage mutation.
- Sanitized downloadable [Artifact #11669069406](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38051816632/artifacts/11669069406) ZIP digest independently recomputed: SHA256 `6677eeb2679f3baa9242e4469ffd6b00e7238e2622ef63ba03e4a8bfd07d56fc`. Actual `receipt.json`: **`DESTINATION_D1_PHYSICAL_EMPTY_SQL_VERIFIED`**, target account+DB fingerprint matched, `tables=0`, `indexes=0`, `schemaObjects=0` after exact vendor-reserved exception, `cloudflareReservedTables=1`, `totalRawSchemaObjects=1`, D1 size 12,288 bytes; `cloudReadsPerformed=3`, `cloudWritesPerformed=0`, `sourceCloudCalls=0`, `sourceRowsCopied=0`.
- Real receipt seals `planSequenceSha256=99a74747cbd3220afb84608c1ed8a9cf72e8eff71f2f23859227dbf7c56afe4f`, which corresponds to 125 offline SQL statements from `0001..0010` (55 tables + 63 indexes + 7 version-meta upserts); staged `0011` excluded. The plan hash is **NOT authorization to execute**.
- This reconciles prior false-positive [Run #38049368343](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38049368343), which reported one raw D1 schema table and blocked the entire import; strict `_cf_KV` recognition was introduced in owner-approved [PR #1087](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1087), main `77fea746`, postmerge System2 Research CI [#38051603121](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38051603121) PASS, premerge V8 Regression [#38049728760](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38049728760) PASS.
- **Draft [PR #1088](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1088) is UNMERGED / owner-gated**: separate production-capable Schema-only executor correction; cannot be promoted via low-risk read-only delegated merge or used to write until independent audit and scoped owner permission. Mocked PR-head System2 CI #38049793911 PASS / V8 Regression #38049793915 PASS does not certify physical SQL write.
- **Hard remaining gate:** Owner-created destination-only Account D1 Edit Token + new `system2-schema-only` GitHub Environment Secrets (`S2_SCHEMA_DEST_ACCOUNT_ID`, `S2_SCHEMA_DEST_D1_WRITE_TOKEN`) and protected review/Free D1 budget checks; then a distinct manual `VERIFY_ONLY` (returns plan hash and writes no DDL). Actual `APPLY_ONCE` must remain blocked until fresh audited empty-check, plan SHA, no partial execution, quota headroom, one-time manual owner approval and exact-target proof. Existing source System1 reserve and DATA_LANE [#1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068) PIT/frozen physical backup are separate still-pending requirements before *data* migration.
- **Physical new-account Schema tables: 0/55; imported historical/frozen rows: 0; new Worker/Cron: 0.** No R2 subscription, paid upgrade, live trading, push, new resource, or source System1 Formal Core edit. The original 13 physical migration and 15 Shadow acceptance gates are **not** accepted solely from this preflight.

Durable machine-readable owner-run evidence: `system2/migration/evidence/S2_DEST_D1_REAL_SQL_EMPTY_POST_FIX_20261010_V0_1.json`.


## 2026-10-10 — owner preapproves bounded low-risk merges after independent audit, PR #1088 scoped authorization

Owner directly approved the **GitHub code-only merger** of Draft [PR #1088](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1088) **after independent review**, and gave standing permission for similarly low-risk engineering merges without repeated per-PR consent. Canonical narrow gate: `system2/migration/DELEGATED_LOW_RISK_MERGE_POLICY_V0_1.md`, 2026-10-10 addendum. This is NOT consent to schema SQL execution, secrets/permissions, physical migration, Worker/Cron or paid services.

Observed baseline at the time: main `e749d10d621684b84e7c5923dac16e8c31b0315e`, #1088 exact HEAD `602c2822437148d8f9da6618551f9c2b4067cb4b`, existing PR-head System2 CI [#38049793911](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38049793911) PASS and V8 Regression [#38049793915](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38049793915) PASS. Live Cloudflare D1 SELECT-only [#38051816632](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38051816632) previously verified raw `_cf_KV`=1 / user tables=0, not a physical schema import.

**Pending independent AUDIT_LANE signoff**: GitHub PR review list was empty, and #1088 remains DRAFT/UNMERGED. Requested independent negative-scope verification [PR #1088 comment](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1088). Do not self-certify audit completion. Once independent evidence is attached and exact-head CI still passes, the owner has already authorized merging this exact bounded patch without a repeated prompt. New D1 destination still 0/55 user tables, 0 historical/frozen rows copied, new Worker/Cron 0; source DATA_LANE #1068 physical backup/PIT, destination secret/effective privilege/rowsWritten headroom and owner-run `VERIFY_ONLY`/`APPLY_ONCE` remain separate.


## 2026-10-10 22:36 Taipei — Post-audit current source and physical-schema handoff

Formal main readback: `797a7d57e2124737cd4bfac29881a1df633cb562`. This update supersedes only the older checkpoint claim that PR #1088 remains unmerged.

- PR [#1088](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1088) merged code-only as `ac66c1fc1e49e7a410cd0d8770a6d25c8c9c9095`. Security HIGH Issue [#1092](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1092) closed after separate AUDIT_LANE source-level retest. Independent acceptance artifact: `system2/migration/evidence/S2_PR1088_ISSUE1092_INDEPENDENT_POSTFIX_ACCEPTANCE_20261010_V0_1.json` (PR #1095). Independent 10 malformed response cases, 6 bad schema objects, 125 distinct invalid DDL positions, 4 disconnect cases all rejected in mock CI. PR #1088 exact-head System2 CI #38055517767 PASS; V8 CI #38055517798 PASS; latest main push Research CI #38060035155 PASS.
- GitHub Actions listed all 81 manual workflow runs at observation time; **no run** for `system2-destination-schema-only-manual.yml`. Actual manual `VERIFY_ONLY` and `APPLY_ONCE` are **not physically witnessed**. The last authenticated destination D1 SQL-only witness #38051816632 confirmed application tables 0 and one reserved `_cf_KV` only. **Physical Schema install remains last-known 0/55; imported frozen/history rows 0; new Worker/Cron 0**.
- The connected GitHub API cannot read Environment metadata. The destination-only GitHub Environment, scoped credential and Free D1 write budget are **NOT VERIFIED**, not necessarily absent.
- Next owner-dependent setup follows `system2/migration/DESTINATION_SCHEMA_ONLY_OWNER_RUNBOOK_V0_1.md`: new-account-only D1 Edit permission and GitHub protected `system2-schema-only` Environment credentials (do not expose secrets). After owner confirmation, run **manual main `VERIFY_ONLY` with blank plan hash** and inspect authenticated Run/Artifact before proceeding.
- No `APPLY_ONCE` or any schema/data write, Worker/Cron deployment, billing, new resource creation, source System 1 changes or R2 enablement is authorized by this code-only merge. Any actual database schema write needs its own explicit approval and quota/headroom review. DATA_LANE source backup/PIT issue #1068 remains open; full migration/Shadow gates not promoted.



## 2026-10-11 00:41 Taipei — Destination Schema-only VERIFY_ONLY physically succeeded (no DDL)

This section supersedes only older statements saying destination Schema-only `VERIFY_ONLY` had never run. The physical writing stage remains NOT EXECUTED.

- Owner manually ran [System2 Destination Schema Only (OWNER APPROVED SCOPE) #38068559602](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38068559602) from canonical `main`, exact run HEAD `a85fffc04043a7f3af15582048219e500e255fe7`. GitHub workflow_dispatch job #114261103226 **SUCCESS** and all job steps PASS. Logs: `TARGET_SCHEMA_ONLY=PREWRITE_EMPTY_TARGET_VERIFIED_ONLY` and `REVIEWED_PLAN_SHA256=99a74747cbd3220afb84608c1ed8a9cf72e8eff71f2f23859227dbf7c56afe4f`; System1 production manifests unchanged.
- Independently downloaded actual [sanitized Artifact #11676361012](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38068559602/artifacts/11676361012), ZIP SHA256 `3364b28aca9b877d4d038e5a89fcdc7ff6301b37b64640b48df09cf60587d1d4` recomputed and matched GitHub. `sanitized-receipt.json` confirms mode `VERIFY_ONLY`, target `system2-research`, 125 planned statements, `appliedStatements=0`, `sourceRowsCopied=0`, `sourceCloudMutations=0`, zero new Workers/Cron/D1, no paid upgrade, no physical schema installed, `futureCloudSchemaWritesAuthorized=false`, quota freshness `false`. Application table/index counts after write remain `null` as no write occurred; last-known installed tables **0/55**.
- Owner GUI showed new-account-specific Cloudflare D1 Write token and GitHub Environment `system2-schema-only` with exact two Secret **names** (`S2_SCHEMA_DEST_ACCOUNT_ID`, `S2_SCHEMA_DEST_D1_WRITE_TOKEN`), with branch rule `main`. Secret values were never collected, read or posted. Successful authenticated SELECT confirms effective credential sufficiency to **query** on this run, not account-wide 125-statement DDL budget nor physical future APPLY permission.
- Next **HOLD**: owner checks current *new account* Free D1 usage and available rowsWritten quota, independently approves a one-time physical Schema-only `APPLY_ONCE` on the same approved SQL plan and exact target. Do not presume authorization from VERIFY_ONLY or low-risk GitHub merge policy. Physical write may cause partial / UNKNOWN; NEVER click Re-run before independent audit. Source System1 backup/PIT DATA_LANE #1068 remains a separate blocker for history/frozen migration.
- Machine-readable sealed evidence: `system2/migration/evidence/S2_DEST_D1_VERIFY_ONLY_REAL_20261011_V0_1.json`. No Cloudflare DDL, source Formal Core, Worker/Cron or paid R2 changed in this evidence write.



## 2026-10-11 00:58 Taipei — Owner-authorized ONE-TIME destination Schema-only APPLY_ONCE PHYSICAL READBACK PASS

Supersedes only prior entries stating Schema-only DDL was not yet run; preserves every distinct source/PIT/data migration, budget, Worker/Cron, R2, formal production and Shadow gate.

- Explicit owner confirmation `批准正式建表` applied only to existing new-account `System2-Stock-Research` / D1 `system2-research`; no historical/PIT/frozen/Worker/Cron/R2/billing/System1 scope. Owner manually dispatched [Run #38069750915](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38069750915) from canonical main HEAD `791d965e4f88f83d7cb6caac8f34e1e25e34ba21` exactly **once**; Job #114264577475 and all steps **SUCCESS**. It started UTC 2026-10-10 16:57:19 (Taipei 2026-10-11 00:57:19) and completed 16:58:08 (Taipei 00:58:08).
- Actual job log shows `TARGET_SCHEMA_ONLY=TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS`, `VERIFIED_SQL_STATEMENTS=125`, `REVIEWED_PLAN_SHA256=99a74747cbd3220afb84608c1ed8a9cf72e8eff71f2f23859227dbf7c56afe4f`, `SYSTEM1_SOURCE_RUNTIME_NOT_CHANGED`.
- Actual sanitized [Artifact #11675494971](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38069750915/artifacts/11675494971) ZIP **SHA256 `9ab4da826f679a757a27966fda51b4a569667ce28fd409bdca4f5d3ad277117e`**, locally recomputed matching GitHub digest. `sanitized-receipt.json` independently opened: `mode=APPLY_ONCE`, `plannedStatements=125`, `appliedStatements=125`, `actualTables=55`, `actualIndexes=63`, `actualSchemaVersion="1.1"`, `status=TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS`. Plan SHA exactly matches prior approved successful real `VERIFY_ONLY` [Run #38068559602](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38068559602).
- Receipt explicitly confirms `sourceRowsCopied=0`, `sourceCloudMutations=0`, `newD1ResourcesCreated=0`, `newWorkersOrCronsCreated=0`, `paidUpgrade=false`, `sourcePhysicalFrozenBackupVerified=false`, `fullMigrationAccepted=false`, `quotaRealtimeFreshnessIndependentlyGuaranteed=false`, `futureCloudSchemaWritesAuthorized=false`.
- **Physical Schema status: 55/55 tables + 63/63 named indexes + D1 Schema 1.1**, based on successful actual target D1 post-DDL SQL readback and authenticated run receipt. This is not evidence that historical records, frozen snapshots, System 2 jobs or trading monitoring are live.
- **Independent physical audit remains pending**; authoring/verification lane must not award its own independent certification. Ask AUDIT_LANE to cross-check run/artifact and new-account Free daily rowsWritten, source isolation and unchanged 125-statement plan. Owner Cloudflare dashboard before APPLY displayed destination account 0/100,000 written rows; **post-APPLY budget/consumption must be physically checked**, not predicted from 125 statements.
- **NEVER click APPLY_ONCE or Re-run again** under this one-use grant; any failure/UNKNOWN would demand separate forensic review and fresh authority. Source DATA_LANE PIT/backup Issue #1068 remains pending. No history/frozen copy/Worker/Cron/R2/paid/Source System1 change authorized.

Durable sanitized machine-readable evidence: `system2/migration/evidence/S2_DEST_D1_APPLY_ONCE_REAL_20261011_V0_1.json`.


## 2026-10-11 06:57 Taipei — Owner Cloudflare D1 post-APPLY account quota screenshot

Owner supplied a Cloudflare mobile D1 list/usage screenshot after the authenticated one-time [APPLY_ONCE Run #38069750915](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38069750915); dashboard header labels daily consumption **October 10–October 10** (Cloudflare calendar label; observed on 2026-10-11 morning Taipei).

- Existing database `system2-research`, database quota **1/10**, read rows **537/5,000,000**, **written rows 285/100,000 (0.285%, 99,715 left at time of screenshot)**, D1 total storage **987.14 KB/5 GB**. Not near account Free plan limits as displayed. This is aggregate UI consumption, **NOT** proof that 125 CREATE/INSERT SQL statements exactly cost 285 rows written, nor a guarantee that future actual usage stays unchanged.
- Mobile D1 list page **does not expose table count** in this screenshot; the separately authenticated post-SQL GitHub Artifact #11675494971 already records `actualTables=55`, `actualIndexes=63`, `actualSchemaVersion=1.1`. Requested next safe owner UI view: click existing `system2-research` DB, inspect its overview table count, no more SQL execution.
- This evidence upgrades **post-APPLY observed D1 Free-account resource headroom** only. It **does not** upgrade independent AUDIT_LANE acceptance, DATA_LANE Issue #1068 PIT/backup/historical/frozen migration, Worker/Cron go-live, production strategy changes, 13/15 migration/Shadow gates.
- Only one `APPLY_ONCE` observed in latest GitHub workflow_dispatch list; do not click Run or Re-run again. No new account, token, secret, billing, DDL or Cloudflare calls by the assistant in this evidence write.

Machine-readable owner-UI observation: `system2/migration/evidence/S2_DEST_D1_POSTAPPLY_OWNER_UI_USAGE_20261011_V0_1.json`. Do not include the raw owner's dashboard screenshots, partial account UUID, or API credentials in GitHub.

