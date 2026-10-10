# Owner-approved System 2 NEW account D1 Schema-only deployment procedure V0.1

Date: 2026-10-10 Asia/Taipei. Approval: owner said **「批准 Schema-only 建置」**. This specifically approves engineering of the destination account's **already-created** D1 schema stage; it never authorizes rebuilding the DB, historical-data copy, R2 subscription, Worker/Cron, formal trading or new billing.

## Read this first
Cloudflare main source account must NOT be used for deployment. The correct target is the new **System2-Stock-Research** account, its D1 named **system2-research**, API-hashed account ID `27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55` and D1 UUID SHA256 `95f48f4d37b8eb4c16919d037259a5ebc30a8057e1933db39a6e8f759b9874b9`. Those hashes were independently evidenced by Run #38027260602 and cannot be replaced by user-selected account strings. Original SOURCE account hash is `3a6732b4f599575098949e818ef9266c324929cf38644387bddc09e05497243b`, and any match is a STOP.

No Cloudflare resource is created in this phase. Existing schema stage is **zero tables by owner Dashboard** and target D1 API metadata physical verification PASS. Fresh physical D1 SQL schema query will be performed only when manually dispatched with a newly authorized destination-only D1 credential.

## One-time owner-only cloud credential setup (necessary before real VERIFY_ONLY)
1. In Cloudflare Dashboard, select **System2-Stock-Research** NEW account. Go to **Manage account / Account API tokens** and create a dedicated new token restricted to **Account: D1 Edit** on **System2-Stock-Research ONLY**; do not choose All accounts or old `Imihan0630@gmail.com's Account`. It should NOT include Workers Scripts, KV, R2, DNS, billing or any System1 scopes. Copy token into GitHub secret only; **never paste it to ChatGPT**.
2. In `imihan0630-sys/v7-fugle-worker` GitHub repository open **Settings → Environments → New environment**. Use exact name `system2-schema-only`. Configure required reviewers / deployment branch restriction `main` if available for repository plan (if unavailable, rely on manual-only main guards; do not falsely claim it is protected).
3. Inside the NEW GitHub Environment set two **Environment secrets**: `S2_SCHEMA_DEST_D1_WRITE_TOKEN` = dedicated destination-only token; `S2_SCHEMA_DEST_ACCOUNT_ID` = new Cloudflare Account ID (32 hexadecimal characters). GitHub encrypts secrets; do not expose them in issues, screenshots or replies.
4. Both are unique to `system2-schema-only`; **DO NOT EDIT** existing `system2-migration`, `system2-research`, source account API keys or any System1 production secret.

## Dispatch sequence (only after PR tests, review and workflow merged)
GitHub Actions workflow: `.github/workflows/system2-destination-schema-only-manual.yml`. It is **manual workflow_dispatch only**; nothing happens automatically on merge.

### Run #1 — VERIFY_ONLY (safe)
- Branch: `main`
- Action: `VERIFY_ONLY`
- confirm: `APPLY_EXISTING_DEST_D1_SCHEMA_ONLY_55`
- boundary: `NO_SOURCE_NO_DATA_NO_WORKER_NO_CRON_NO_PAID`
- plan_hash: empty

The script must GET/list EXACTLY ONE target D1 and GET its metadata with sha256 matches, then execute **only a read-only SELECT** of SQLite metadata (`sqlite_schema`) to prove zero schema objects. Any nonempty D1, missing token, changed metadata, wrong account/DB hash or unsupported SQL response stops. No CREATE TABLE SQL in this run. Owner must inspect sanitized Artifact and job result `PREWRITE_EMPTY_TARGET_VERIFIED_ONLY`. It emits `REVIEWED_PLAN_SHA256` to logs.

### Run #2 — APPLY_ONCE (actual schema writes, already owner-scoped)
Requires owner visually confirming Run #1 succeeded and new D1 Free plan write usage/headroom. Do not repeat an ambiguous or partially successful previous run; physical review required.

- Branch: `main`
- Action: `APPLY_ONCE`
- confirm and boundary: same exact values as Run #1
- plan_hash: paste exact `REVIEWED_PLAN_SHA256` returned from successful same-SQL-HEAD Run #1.

The code rechecks exact new-account/D1 fingerprints and physically empty `sqlite_schema`; then POSTs precisely **125** separately hashed SQL statements from `0001..0010`: 55 `CREATE TABLE`, 63 `CREATE INDEX`, 7 `s2_schema_meta` version upserts, **not** staged `0011`; it then SQL-selects 55 table/63 named index objects and version `1.1`. One statement at a time, persist sanitized successful-statement receipts. On any network/Cloudflare/SQL failure: `PARTIAL_OR_UNKNOWN_DO_NOT_RETRY`. Never click Re-run until AUDIT_LANE separately proves which objects exist. No source database, historic row or immutable decision is queried or copied.

### Acceptance distinctions
- `VERIFY_ONLY` success is **empty target DB physical schema-readback**, not schema installation.
- `APPLY_ONCE` `TARGET_D1_SCHEMA_ONLY_55_PHYSICAL_SQL_READBACK_PASS` is still subject to independent audit and account budget/cost verification. It is only the schema stage, NOT source backup/PIT, historical row import, disabled Worker runtime or trading system go-live.
- Cloudflare Free per-UTC-day D1 written-row limit is shared within one **account**. The destination account is separate from the source; the old System1 P0 quota is not used by this stage. No paid upgrade will be performed. The script logs that real-time aggregate quota freshness is **not independently guaranteed**; the manual owner must check new account's D1 Free usage immediately before APPLY_ONCE. If high or unknown, defer instead of assuming zero.

## Engineering gates
- New workflow has no schedule, push or pull_request dispatch, no Worker or Wrangler invocation, no R2/KV/Billing requests, and requires `main`, the exact 2 confirmations, plan hash for APPLY_ONCE, a new GitHub Environment and two destination-scoped secrets.
- No imported data whatsoever; source Formal Core, old production Worker, Cron and source D1/R2 are not called.
- Source whole-database backup, frozen/PIT, historical archive remain DATA_LANE Issue #1068. Original 13 migration + 15 Shadow acceptance gates remain independent.
- Final PR/CI checks and separate protected cloud credential creation must be completed before attempting any physical schema run. **At authoring time, neither VERIFY_ONLY nor APPLY_ONCE has run.**
