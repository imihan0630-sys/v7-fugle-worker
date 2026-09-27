# System 2 Isolated Persistence Plan V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH-ONLY IMPLEMENTATION PLAN / NOT DEPLOYED / NO CLOUD RESOURCE CREATED

## Purpose

Provision a future physical persistence path for System 2 without sharing the System 1/V8 production database, bindings, Worker runtime or Cron（排程）.

The repository currently proves the research schema and provenance contracts, but no isolated System 2 database resource is defined in the root production configuration.

## Isolation target

Preferred logical resources:

- Worker / service name: `system2-shadow-research`
- D1（Cloudflare SQL資料庫）binding: `SYSTEM2_DB`
- Database logical name: `system2-research`
- Migration source: `system2/sql/`
- Runtime source: `system2/runtime/`

Actual Cloudflare database ID is intentionally UNKNOWN until a separate resource is provisioned.

## Explicit prohibitions

The System 2 persistence path must not:

- bind to the existing System 1 production database;
- reuse the System 1 production database binding;
- reuse the production KV（鍵值儲存）binding;
- change the production Worker entry point;
- change production routes;
- change production Cron;
- write to non-`s2_` tables;
- silently share a transaction with System 1 runtime state.

Any proposal that requires a shared production database/runtime becomes Class B（共享執行環境／間接正式風險） and must stop before promotion for owner review.

## Deployment stages

### PERSIST-A — repository-only preparation

Allowed autonomously:
- isolated schema;
- row serializers;
- deterministic persistence batch contract;
- local/in-memory SQLite verification;
- example deployment configuration containing placeholders only;
- CI（持續整合） isolation tests.

No Cloudflare resource, secret or production binding is touched.

### PERSIST-B — isolated cloud resource provisioning

Requires a real separate database resource and its database ID.

Safe target:
- create separate D1 database;
- bind it only as `SYSTEM2_DB` to a separate System 2 Worker;
- apply only `system2/sql/` migrations;
- no production route;
- no public mutation endpoint;
- no production Cron yet.

If the existing credentials cannot create/bind an isolated resource, this becomes an account permission/authorization blocker rather than a reason to fall back to the production database.

### PERSIST-C — prospective scheduled Shadow capture

Only after isolated persistence passes:
- schema/version check;
- write/read-back integrity;
- idempotency/replay check;
- source-session completeness;
- full-universe accounting;
- run fingerprint verification.

Then add a separate System 2 schedule.

## Persistence unit

One prospective decision clock is a logical immutable run group.

Recommended write order:

1. Source Session Receipt（資料來源批次收據）
2. Market/industry/factor snapshots
3. Strategy decisions
4. Shadow Run Receipt（影子模擬批次收據）
5. Strategy ordering / ranking experiment receipts
6. Capacity / lifecycle / overlap / concentration research receipts
7. Run Fingerprint（執行批次指紋） last

The fingerprint is last because it proves which preceding immutable objects belong to the completed run.

## Atomicity and failure model

Do not claim a run COMPLETE merely because some rows were written.

If a write fails:
- preserve the failed run state;
- do not fabricate missing rows;
- do not join future outcomes;
- retry only with identical immutable identities/hashes or create a correction/new run identity as required by the contract.

A complete fingerprint requires:
- SOURCE_SESSION_READY;
- full-universe run accounting COMPLETE;
- all referenced immutable objects present and hash-consistent.

## Idempotency contract

A repeated write is safe only when:
- the same primary identity already exists; and
- its immutable hash/payload is identical.

Same identity + different immutable payload is:
`IMMUTABLE_CONFLICT（不可變資料衝突）`

It must fail closed.
Do not use a blind `INSERT OR IGNORE` policy that could hide a conflicting payload.

## Allowed table namespace

The persistence adapter may write only explicitly whitelisted `s2_` tables.

Unknown table names, non-`s2_` names, or runtime binding names outside the isolated System 2 contract must be rejected before any SQL is issued.

## Startup gates for the future isolated Worker

Before accepting a write batch:
- binding name exactly `SYSTEM2_DB`;
- schema version supported;
- table namespace whitelist loaded;
- run/decision timestamps valid;
- source-session and accounting receipts internally consistent;
- no production binding aliases present;
- no outcome data included in a preregistration/decision-time write.

## Scheduling boundary

No schedule is defined in V0.1.

Reason:
the physical database does not exist yet, and scheduling a recorder before persistence integrity is proven would create incomplete or misleading Shadow history.

## Current conclusion

System 2 is now ready for repository-only isolated persistence preparation.

It is NOT yet ready to claim live prospective accumulation.

The remaining physical step is a genuinely separate cloud database/service, not another strategy-rule decision.


## Cloud capability audit result

Read-only audit on 2026-09-27 established:
- current legacy Cloudflare token is valid;
- Workers Scripts list access works;
- D1 list access returns HTTP 401 Authentication error;
- dedicated `SYSTEM2_CLOUDFLARE_API_TOKEN` is not configured;
- therefore D1 resource existence is UNKNOWN, not "absent".

Repository-side provisioning code is complete, but physical D1 creation/migration is now blocked by a genuine account-permission/secret boundary.

Prepared guarded path:
- `.github/workflows/system2-isolated-d1-provision.yml`
- `system2/deploy/provision_system2_d1.mjs`
- exact confirmation string `CREATE_SYSTEM2_ISOLATED_D1`
- isolated target database name `system2-research`
- schema V0.5
- write/read sentinel verification
- no production Worker/root Wrangler/Cron change.

See `SYSTEM2_CLOUD_PERSISTENCE_READINESS_V0_1.md`.


## Physical provisioning completed

Completed on 2026-09-27:
- separate D1 `system2-research` created;
- schema V0.5 applied;
- 26 `s2_` tables verified;
- write/read sentinel PASS;
- replay provisioning reused the same database and preserved the same database ID digest;
- production D1/Worker/Cron remained untouched.

Physical persistence blocker is therefore RESOLVED.

The next boundary is a separate System 2 capture Worker/schedule. Repository-side design may continue, but cloud Worker/Cron deployment requires explicit authorization because it creates new runtime behavior.
