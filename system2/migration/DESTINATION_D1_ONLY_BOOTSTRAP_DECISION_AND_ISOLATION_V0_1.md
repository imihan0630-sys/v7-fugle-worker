# System 2 destination account: D1-only bootstrap decision and isolation evidence V0.1

**Date:** 2026-10-10 Asia/Taipei  
**Scope:** offline source/target account safety, NO resource creation, deployment, secrets or paid billing.  
**Owner-approved low-risk PR scope:** documentary/static verification only. **An actual new D1 database needs a separate user approval**, along with account-restricted write credential provisioning or direct user UI action.

## Authenticated physical baseline
- [Cross-account GET-only inventory #38022384514](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38022384514), verified on main `a85f041b`: SOURCE D1 `system2-research` `file_size=316,968,960 bytes`, source includes live `fugle-test` and existing System2 Worker/Cron, original R2 archive. New DESTINATION `System2-Stock-Research`: **0 D1**, 0 Workers, 0 KV, 0 Cron; destination R2 not entitled HTTP403 code10042. D1/Workers/KV read granted on both.
- Repository migration SQL: 11 files / 56 defined `s2_` tables. Actual applied source migrations, row counts, frozen hashes and backup are UNKNOWN until DATA_LANE Issue #1068 attestation. System1 read reserve still `readReserveNumberAuthorized=false`; user-authorized READ-only account metadata is not a grant for a whole-database SQL scan.
- Bounded Worker static source analysis PR #1071: 37 reachable modules, zero explicit R2, one WebCrypto-first dynamic Node SHA256 fallback and one static Node crypto import, source compatibility date candidate >= 2026-08-04. Existing offline disabled-Worker UI/scheduled smoke PASS. **Cloudflare runtime, source deployed SHA and real isolated staging Worker are NOT physically tested.**

## Critical trap: legacy D1 provision workflow is SOURCE-BOUND
The existing `.github/workflows/system2-isolated-d1-provision.yml` has:
- `environment: system2-research` (legacy/source Cloudflare Environment, **not** new `System2-Stock-Research`);
- `secrets.CLOUDFLARE_ACCOUNT_ID` and `secrets.SYSTEM2_CLOUDFLARE_API_TOKEN` from that legacy environment;
- a call to `node system2/deploy/provision_system2_d1.mjs` which on missing D1 executes **POST /d1/database** and also **POST /d1/database/<id>/query** to apply SQL migration statements and verify read/write.

**Do not manually run or repoint that existing workflow for cross-account migration.** Repointing could write to the original production account or create schema with the wrong account identity. Merely passing an isolated Script ID does not change those Environment secrets.

The existing `system2/deploy/wrangler.system2.example.toml` likewise enables `workers_dev=true`, an active `[triggers]` Cron, and R2 binding. **Do not use it to deploy new-account staging**. It may start a second monitoring writer unexpectedly.

## Minimal practical staging sequencing (all owner-gated where cloud changes)
1. **Current / offline:** verify existing SOURCE and DESTINATION read-only resource inventory remains as attested; gather latest main and available real account quota evidence. If service metadata changes, revalidate, do not assume a previously empty target stays empty.
2. **Next owner decision, limited:** create **one empty D1 database named `system2-research` in the NEW account only**, using a dedicated `system2-destination-provision` GitHub Environment and a destination-account-restricted D1 WRITE credential. No schema/data import, no Worker, no Cron, no route, no R2 billing/subscription, no use of source secrets. Explicit approval must specify this exact scope.
3. **After owner decision / engineering:** a *separate* manual-only, fail-closed target provisioning workflow would need strict source != destination account identity proof; protected Environment; exact `CREATION_ONLY` confirmation; GET list and deny existing/duplicate; POST only a single new D1 in target; sanitized result. No reuse of the legacy source-bound provisioner. Avoid disclosure of account IDs/tokens to ChatGPT/issue/CI logs.
4. **Subsequent separate owner decision:** schema installation to newly isolated D1 only after verified rowsWritten Free allowance, actual SQL version selection and DATA_LANE checkpoint, one-time non-overwriting migration. The source system does not get a second budget reservation merely by splitting cloud accounts.
5. **Separate owner decision:** after D1 exists and scheme is stable, deploy a *disabled* D1-only Worker using proposal `system2/migration/d1_only_disabled_staging_config_v0_1.mjs`: `workers_dev=false`, `preview_urls=false`, `capture=false`, `resonance=false`, **no** `[triggers]`, **no** KV/R2, **no** route. Runtime smoke cannot be claimed just from GitHub Node tests.
6. **Full functional/economic acceptance:** independent readback source→target frozen decisions, row count/hash/PIT, restore tests, index-cost and per-UTC day quotas, single writer/cutover, source R2 archive policy and System2 15 Shadow gates. Only then authorize active cron, public endpoints or formal Shadow.

## Cost / tradeoff
Cloudflare Free D1 normally lists 10 databases/account and up to 500 MB per individual database, 5 GB aggregate, 100k rows written/day **per account**. Empty D1 creation itself is not a paid-plan upgrade; **actual Cloudflare billing/eligibility must be checked live** and owner must authorize. D1 data restore is NOT guaranteed fit from 317 MB file_size: indexes, retries, schema and concurrent writers may exceed the 500 MB single-DB cap, and Free daily row write budget can require multiple days.

**Positive for blank D1 first:** it does not require reading/copying the source 317 MB D1 and lets destination identity be verified while source budget reserve is pending. **Negative:** it proves ZERO migrated frozen decisions, offers no useful System2 Shadow results yet, and introduces credential/identity/accidental-writing risk. Hence account scoped blank creation is a separate explicit owner decision, not an automatic effect of previous PR merge approval.

## Offline safety gate
`system2/migration/destination_d1_bootstrap_isolation_gate_v0_1.mjs` and `system2/tests/destination_d1_bootstrap_isolation_gate_v0_1.test.mjs` check actual existing workflow/script names and negative cases. They **always return `physicalDBCreationAllowed=false`**, even when a synthetic fixture supplies ownerApproval and a token flag. The status is **NOT** a provisioning API command and should not be promoted to readiness or formal audit PASS.

DATA_LANE: [Issue #1068](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1068). CORR-003 original 19 criteria and migration 13 physical gates remain separately independent and non-complete.
