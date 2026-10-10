# S2 Cross-Account Read-Only Inventory: Physical Evidence 2026-10-10 V0.1

**Evidence class:** REAL CLOUDFLARE ACCOUNT METADATA / GET ONLY  
**Execution:** GitHub Action [Run #38022384514](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38022384514)  
**Timestamp:** 2026-10-10 03:57:45–03:58:00 UTC (11:57:45–11:58:00 Taipei)  
**Executed against:** main `a85f041b9a05ea811b4e9dd9fc08cd1ddeed73cc`  
**Run outcome:** SUCCESS. Source full account metadata; destination **PARTIAL** (R2 not entitled).  
**Auth artifact:** ID `11658558673`, SHA256 `4fd555e36aeaeaf41bca0bd1f4717073b1af87bf3c0f31b7e3bd0eb00ed34d7f`.  
**Service artifact:** ID `11658598468`, SHA256 `d7ed8c604d8b2867045f5de30b4d7950431ccecf8026698bd2a6a3b61515cfea`.  
**Account inventory artifact:** ID `11658558682`, SHA256 `6b1f60e674e6a759f53ef3907a755e9fcd55fb25186de7769e3e8c526a1213dc`.  
**Artifacts downloaded/read:** `source-inventory.json`, `destination-inventory.json`, `preflight.json`, `service-diagnostic.json`, `auth-diagnostic.json`. Cloudflare IDs, API tokens and bearer headers **must not be published**.

## Actual inventory — sources proven by artifact

| Item | SOURCE account | DESTINATION (new System2-Stock-Research) |
|---|---|---|
| Token verify | active / HTTP200 | active / HTTP200 |
| D1 list | READ_GRANTED HTTP200 | READ_GRANTED HTTP200 |
| Workers list | READ_GRANTED HTTP200 | READ_GRANTED HTTP200 |
| KV list | READ_GRANTED HTTP200 | READ_GRANTED HTTP200 |
| R2 list | READ_GRANTED HTTP200 | HTTP403 numeric 10042 = NOT ENTITLED |
| D1 database count | 2 (`system2-research`, `v7-live`) | 0 |
| Worker count | 2 (`system2-shadow-research`, `fugle-test`) | 0 |
| KV namespace count | 1 (`fugle-stock-config`) | 0 |
| R2 bucket count | 1 (`system2-historical-research`) | **UNKNOWN / R2 not enabled**, not zero |
| Cron relevant to System2 Worker | one: `*/5 0-5,11 * * MON-FRI` | none (no Worker) |
| Source isolated D1 file_size | **316,968,960 bytes** | no DB to measure |

Current **500,000,000-byte Free D1 single-DB cap**: 316,968,960 / 500,000,000 = **63.393792%**. Raw unused headroom **183,031,040 bytes**, approx **183.03 MB**, *not* a safe-import allowance. Data migration, indexes, schema differences, active writes and next-day growth have not been measured. Full 2017+ hot/cold record count unknown and original 100k daily rows-written quota still applies to the new Free account.

SOURCE Worker settings metadata verified that it binds `SYSTEM2_DB` (D1), `SYSTEM2_HISTORY_BUCKET` (R2), `FUGLE_API_KEY` (secret type only), capture/resonance environment flags (values not read). This is not proof that entire daily System2 Shadow can run without cold R2. Source `fugle-stock-config` KV is not automatically System2-owned; DO NOT copy/modify until actual dependency and ownership audit.

## Safety and acceptance limits

- Account preflight receipt = **BLOCKED** due to `DESTINATION_RESOURCE_INVENTORY_UNVERIFIED` and `IMMUTABLE_SOURCE_MANIFEST_MISSING_OR_INVALID`.
- Destination inventory is intentionally `complete=false`, `r2BucketsVerified=false`, `r2Status=NOT_ENTITLED`.
- Unchecked / NOT PROVEN: exact D1 `s2_` table counts, SQLite schema and index checksums, physical row counts, frozen snapshot SHA, source R2 object count/bytes/hashes, Cloudflare account read/write quota headroom, Worker route/subdomain readback, an independent destination run, actual backup/restore, PIT/OOS and formal Shadow gates.
- Actual Cloudflare resource mutations **0**; destination new databases **0**; destination new Workers **0**; D1 rows copied **0**; R2 objects copied **0**; source monitoring changed **NO**; cutover **NOT AUTHORIZED**.
- These API metadata GET requests do NOT prove successful physical data persistence or full migrated System2 operations.
- 13 migration gates: **0/13 fully passed**, although real evidence now materially satisfies portions of the first two *inventory* tasks.
- Original System 2 15 formal Shadow acceptance gates: **0/15 fully accepted** in canonical baseline; infrastructure inventory alone cannot promote them.

## Fastest defensible staged deployment path (candidate, not execution authority)

1. **S0 / completed:** two-account access authenticated; source D1 size, binding and Cron identified; target D1/Worker/KV empty and target R2 not entitled.
2. **S1 / offline only:** isolated `system2/migration/d1_only_shadow_staging_feasibility_v0_1.mjs` reads sanitized evidence, blocks missing PIT-frozen source backup; generate a staging-only Worker config with `workers_dev=false`, `SYSTEM2_CAPTURE_ENABLED=false`, `SYSTEM2_RESONANCE_ENABLED=false`, and no R2/KV/Cron/route. NO deployment.
3. **S2 / DATA_LANE:** read-only schema, `s2_` table-count and real backup hashes; decide which hot tables are actually essential for limited Shadow; study per-day Free write quota and new database import overhead. Preserve source cold R2 archive intact, no cross-account old R2 write or runtime reliance by default.
4. **S3 / OWNER GATE:** explicit separate approval required for creating new Free destination D1, importing data, GitHub destination-only write credentials and provisioning/staging isolated Worker. Must validate cost and limited source quota. Do not reuse existing `system2-research` GitHub Environment (bound to old account).
5. **S4 / AUDIT GATE:** source frozen-readback and destination table/hash PIT compare, then possible disabled Worker smoke checks; no Cron activation until after independent audit and owner cutover authorization, single-writer proof and rollback.
6. **S5 / FULL HISTORICAL:** current new account R2 NotEntitled requires *separate* user billing/entitlement decision. R2-free account doesn't automatically authorize R2 subscription. Alternatively verify lawful bounded read-only cross-account cold-archive bridge, required dataset retention and actual cost; this is not implemented/accepted.

## Official boundaries and references
- Repo path `system2/deploy/worker.mjs` resonance endpoints use `SYSTEM2_DB` in their visible code, whereas current `system2/deploy/wrangler.system2.example.toml` declares a required R2 binding and enabled Cron. New-account staging must **not reuse** the old active deploy recipe.
- Source Cloudflare account continues hosting System1 production `fugle-test` untouched.
- Delegated low-risk auto-merge policy: `system2/migration/DELEGATED_LOW_RISK_MERGE_POLICY_V0_1.md`. Creation, data-copy, billing, new grants, Cron, cutover remain owner-gated.
- D1 Free limits: https://developers.cloudflare.com/d1/platform/limits/
- R2 entitlement error 10042: https://developers.cloudflare.com/r2/api/error-codes/
