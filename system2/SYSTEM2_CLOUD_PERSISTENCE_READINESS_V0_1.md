# System 2 Cloud Persistence Readiness V0.1

Updated: 2026-09-27 Asia/Taipei
Status: REPOSITORY READY / PHYSICAL D1 BLOCKED BY D1 TOKEN PERMISSION / NO PRODUCTION CHANGE

## Purpose

Record the exact remaining blocker before System 2 can begin physical prospective Shadow（影子模擬） persistence.

## Read-only cloud capability evidence

Workflow:
`.github/workflows/system2-cloud-readiness-audit.yml`

Latest audited run:
- GitHub Actions run: `36305698372`
- job: `108581802799`
- mode: READ-ONLY
- token source: `LEGACY_WORKERS`

Observed:
- Cloudflare token verification: HTTP 200 / valid;
- Workers Scripts list: HTTP 200 / readable;
- visible Worker scripts: 1;
- `system2-shadow-research` Worker: not present in the visible Worker list;
- D1 database list: HTTP 401 `Authentication error`;
- dedicated `SYSTEM2_CLOUDFLARE_API_TOKEN`: not configured.

Interpretation:
the existing repository Cloudflare token is valid for its current Workers-oriented duties but does not provide the D1 account capability needed by the System 2 physical persistence path.

Important:
because D1 listing itself is unauthorized, the existence or non-existence of a `system2-research` D1 database is UNKNOWN.
A zero visible count under HTTP 401 is NOT evidence that no D1 database exists.

## Repository-side readiness completed

Prepared and verified:
- research schema V0.5;
- isolated `s2_` namespace;
- `s2_schema_meta`;
- `s2_infrastructure_checks`;
- source-session receipts;
- full-universe Shadow accounting;
- run fingerprint;
- fail-closed immutable persistence batch;
- isolated persistence executor;
- schema/module CI;
- production-isolation guard;
- read-only Cloudflare capability audit;
- guarded manual D1 provisioning/migration workflow.

## Guarded provisioning path

Manual-only workflow:
`.github/workflows/system2-isolated-d1-provision.yml`

Provisioning script:
`system2/deploy/provision_system2_d1.mjs`

Required explicit input:
`CREATE_SYSTEM2_ISOLATED_D1`

Required dedicated secret:
`SYSTEM2_CLOUDFLARE_API_TOKEN`

The workflow is designed to:
1. verify the dedicated token;
2. list D1 databases;
3. refuse duplicate exact-name resources;
4. create `system2-research` only if absent;
5. apply only `system2/sql/0001_research_core.sql`;
6. verify required `s2_` tables and schema version 0.5;
7. write/read an isolated infrastructure sentinel;
8. leave `Worker.js`, root `wrangler.toml`, production routes and production Cron untouched.

## Required Cloudflare permission

The dedicated token must include account-scoped D1 write/edit permission sufficient to:
- list D1 databases;
- create the isolated D1 database if absent;
- execute schema/query writes against that isolated database.

Do not broaden the existing production Workers token merely for convenience if a dedicated System 2 token can be used instead.

## Human-intervention boundary

This is now a genuine new-permission/secret boundary.

No safe repository-only fallback can create an isolated D1 without an account credential that is authorized for D1.

Do NOT:
- reuse the V8 production database;
- store the secret in GitHub files;
- paste the token into chat;
- weaken isolation to avoid the permission step.

## Continuation after permission is available

1. re-run the read-only audit and confirm D1 list access;
2. run the guarded manual provisioning workflow;
3. verify schema/write/read evidence;
4. freeze database-ID digest and schema receipt in checkpoint;
5. only then design a separate scheduled prospective Shadow capture service.


## Research CI verification after V0.5

GitHub Actions run `36305786450`, job `108582061023`:
- 27 System 2 test files: PASS;
- System 2 runtime/deploy module syntax: PASS;
- SQLite schema V0.5: PASS;
- 26 `s2_` tables created in the verification database;
- production-isolation guard: PASS.
