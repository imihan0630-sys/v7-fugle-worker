# System 2｜方案 C「既有稽核成功，但自動下游漏觸發」唯一稽核 ZIP 手動補跑 V0.1

日期：2026-10-17（台北）  
Scope: System2 BUILD_LANE Class A / NON_PIT_PREVIEW research-only manual fallback; does **not** change already owner-decided schedule or 23:45 PIT reference. DATA / AUDIT / V8 owner boundaries unchanged.

## 需求與優先順序

已合併 #1448/#1449/#1452：GitHub S2 Shared A1 scheduled collector → independent readback audit → Scheme C source-bound research preview (user-readable GitHub Actions Summary, signed derived ZIP), physical 2026-10-16 122/122 single audit ZIP real replay and T+1 late warning PASS. Remaining operational risk: GitHub `workflow_run` delivery may be delayed/missed even if an independent source audit has already successfully produced the same-run signed `audit-receipt.json` + `preliminary-pv-watch.json`. Without a safe backup, user can only read raw A1 upstream and wait for the event.

This is a **recovery button for ALREADY EXISTING proof**. It never triggers new TWSE/TPEx data fetching, cannot manufacture missing A1 source or improve already-late physical cut, and does not replace/disable existing automatic consumer.

## Exact safety contract

- The same existing `.github/workflows/system2-scheme-c-daily-audit-preview-consumer.yml` also accepts `workflow_dispatch` with **required single `source_audit_run_id`**. Runs **only on `refs/heads/main` in official `imihan0630-sys/v7-fugle-worker`**. No `schedule:`, no additional GitHub app credential or Cloudflare Worker/Cron.
- Validate input digits and `gh api repos/$GITHUB_REPOSITORY/actions/runs/$SOURCE_AUDIT_RUN_ID` **before** downloading. Pure testable BUILD validator accepts **only** exact run ID and authentic GitHub-returned `name=System2 Shared Official A1 Independent Source Audit (READ ONLY)`, `event=workflow_run`, `head_branch=main`, source+repo `full_name` equal official repo, `path=.github/workflows/system2-shared-official-a1-independent-audit.yml` optionally suffixed `@main`/ `@refs/heads/main`, and **`status=completed, conclusion=success`**. Reject upstream scheduled source-collector run IDs, audit PR/push/manual self-tests, attacker forks or other workflow. `head_sha` 40-digit valid hex required. This enforces *GitHub workflow provenance*, not only self-reported hash fields.
- Consume the **only one exact same-AUDIT Run Artifact** named `system2-shared-official-a1-independent-audit-$ID`; exactly one signed original audit and one signed V0.2 preview receipt in same ZIP. Existing BUILD SHA cross-binding, 122/122, 61 dates, cut times, CA-known positive warnings, source-ready and PIT denial unchanged. No alternate last-known daily report, no missing-artifact "0 picked" workaround.
- `MANUAL_RECOVERY_REPLAY` displayed on GitHub Actions Summary; source trading T must come from original exact signed receipt, never the wall-clock date when operator clicks or the nominal source Cron. `selectedCount=null`, `zeroPickDay=null`, PIT-A/B unapproved, Frozen/Shadow/push/trading off; late T+1 always explicitly late. Existing successful natural `workflow_run` flow retained unchanged.
- `system2/runtime/scheme_c_manual_recovery_audit_run_v0_1.mjs` pure read-only identity validator, `system2/scripts/validate_scheme_c_manual_recovery_audit_run_readonly_v0_1.mjs` execution command, targeted negative suite `system2/tests/scheme_c_manual_recovery_audit_run_v0_1.test.mjs`; workflow static integration negative tests added to `scheme_c_actions_summary_visibility_v0_1.test.mjs`.
- Retain existing 2026-10-13 physical two-run PR historical special case and extra 2026-10-16 real SAME-run signed ZIP PR job for actual lineage regressions. Never promote those historical replays to genuine Oct19 automatic operation.

## How to recover in GitHub Actions (only if natural downstream was missed)

Open Actions → **System2 Scheme C Daily Independent-Audit Preview Consumer (NO NEW CRON)** → **Run workflow** → select `main`, paste **exact completed SUCCESS independent-A1-audit Run ID**, NOT collector source run ID, and execute. GitHub requires repository Action write privilege for manual dispatch by the human; the workflow's token stays `contents:read, actions:read`, with additional read-only metadata lookup but no secrets. After completion, inspect native Summary and its derived-only `daily-nonpit-preview.md`/JSON/meta artifact; fail-closed if signed proof is invalid/expired. If a genuine main natural workflow_run did deliver, no manual recovery is needed and rerunning is intentionally only an explicitly dated replay.

**Limits:** manual fallback cannot fix GH source-cron scheduler dispatch lag, official source publication, expiring 7-day audit Artifacts, first PIT-A/CFI/CA incomplete inputs, or guarantee T23:45 timely decision. Never describe this replay as "automated on-time complete". Newly dated natural T at/after 2026-10-19 must still complete actual scheduled source→audit→consumer physical acceptance before daily auto-production status changes.
