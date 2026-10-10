# Owner-gated destination D1 CREATE-ONLY draft — NOT AUTHORIZED / NOT DEPLOYED

Date: 2026-10-10 (Asia/Taipei)  
Ticket: [Issue #1073](https://github.com/imihan0630-sys/v7-fugle-worker/issues/1073)  
Status: **DRAFT PR ONLY**, owner must explicitly approve new-account resource creation, new environment/credentials and merge/one manual run. No cloud changes happened by authoring this draft.

## Exactly what the proposed code would do, only after separate owner approval
- New workflow `.github/workflows/system2-destination-empty-d1-owner-gated.yml`, `workflow_dispatch` on `main` only, with exact confirmations `CREATE_ONE_EMPTY_DESTINATION_D1` and `FREE_TIER_NO_BILLING_CHANGE_ACKNOWLEDGED`.
- New GitHub Environment **`system2-destination-provision`**, created/protected by the owner with required reviewer. The workflow MUST NEVER be given `system2-research` old source environment secrets.
- Required distinct destination-scoped Environment secrets: `S2_DESTINATION_ACCOUNT_ID`, `S2_DESTINATION_D1_CREATE_TOKEN`, and deny-only source account ID `S2_SOURCE_ACCOUNT_ID_DENY`. Do not paste any values in ChatGPT, GitHub Issues or logs. The *source* deny ID is a reference only, not a permission or source access token.
- The implementation checks destination vs source account IDs, token verification GET and **fresh GET D1 list with exact total_count 0** before any write.
- If approved and run: **exactly one** `POST /accounts/<destination>/d1/database` with `{"name":"system2-research","primary_location_hint":"apac"}`; this avoids letting the US GitHub Actions runner decide a default database primary location. The APAC region is a preference/hint, not a guarantee of Taiwan or fixed residency; verify actual placement independently; followed by GET D1 list to verify exact UUID and one DB. No SQL at all: no `/query`, schema, rows, data import, R2, KV, Worker, Cron, route, billing/API entitlement change, or retry of the POST.
- Sanitized only result artifact, count 1, no account/DB ID, tokens, raw Cloudflare response or payload. If the POST times out or readback fails, result becomes **UNKNOWN, never auto-retry**; owner must check Dashboard/manual readback for partial creation.
- Restated limitation: LIST-verify an empty-new D1 resource does not prove zero tables after SQL. It performs no SQL because even read-only D1 SQL requires a separate scoped/authorized quota plan. Subsequent schema phase is a separately approved D1 write operation.

## Explicit blockers
1. **User has NOT yet specifically approved D1 target resource creation and target-only write credential.** Creating this draft PR and running mock CI is not consent. The standing low-risk GitHub PR auto-merge delegation **does not apply**: this PR adds a path that would make cloud writes possible after merge.
2. Owner has NOT yet created `system2-destination-provision` protected GitHub Environment, a least-privilege target D1 create/edit token or the required protected secrets. Do not infer that source READ-only token can create D1. Existing `system2-migration` Environment READ secrets must stay unchanged.
3. Cloudflare Free limits/entitlement for the target should be revalidated in Dashboard. The workflow itself performs no subscription or payment operation. A one-time D1 metadata create is not a claim that large table imports are free or single-day.
4. DATA_LANE #1068 source physical backup and frozen/PIT evidence, P01/P02 reserves and original CORR-003 19 criteria remain pending. Creating a blank D1 does not waive them. Production System1 and original S2 source account continue unchanged.

## Why not reuse existing provisioning workflow
`.github/workflows/system2-isolated-d1-provision.yml` references source `system2-research` Environment and `secrets.CLOUDFLARE_ACCOUNT_ID` from that context. Its script `system2/deploy/provision_system2_d1.mjs` also POSTS all SQL schema. The new workflow is isolated and creates NO tables, to prevent accidental writes or quota sharing with System1.

## Approval checklist before any merge
- [ ] Owner explicit approval: only one new Free target-account empty D1, no new subscription/paid upgrade
- [ ] Account ID cross-check and destination-only permissions, owner-created protected GitHub Environment with required reviewer
- [ ] CODEOWNER/infra review and exact current main + PR HEAD diff
- [ ] CI: System2 Research + V8 Regression PASS; negative mock tests prove one POST max, no source/env/cron/SQL/R2
- [ ] Owner explicitly approves **merging** owner-gated cloud-write-capable workflow PR
- [ ] Owner manually dispatches ONE run with exact confirmations on main; inspect sanitized artifact and independently verify target D1
- [ ] If unknown/failed POST, no second run until the existing D1 inventory is checked
- [ ] Owner/AUDIT accepts `EMPTY_D1_CREATED_ONLY`; **NOT** 13 migration gates or 15 live Shadow gates

Run-free test entrypoint (safe; no network): `node system2/tests/create_empty_destination_d1_once_v0_1.test.mjs`.
