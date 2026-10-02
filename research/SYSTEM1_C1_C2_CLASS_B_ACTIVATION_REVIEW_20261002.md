# C1-only Class-B activation review — PR #306

Status: OWNER APPROVED 2026-10-02 / INTEGRATION IN PROGRESS / NOT YET DEPLOYED.
Engineering commit: c452642dcccad6f0d7608629889e69b18661393b.
Linux isolated candidate regression: 57/57 PASS (36976181250).

## Requested scope

Approve only the C1 receipt/integrity repair candidate and its read-only C2 pairing path. A/B, ranking, 3+3+3, capital, 15m entry/exit, signals, push and System2 stay locked. No historical reselection, fabricated WATCH, phone resend, broker mutation or strategy switch.

## Concrete integration remaining after approval

1. In v7-cloudflare.yml, v7-regression.yml and v7-repair-ci.yml, append `python3 scripts/apply_v8_15_1.py` immediately after 8.15.0 and change expected-version markers to `8.15.1-c1-capture-integrity`. Register the patch in matching workflow path filters. These existing production workflows have not been edited in this PR.
2. Re-run standard and isolated regressions at the exact deployment head. Use existing guarded code-only deployment, backup, configuration preservation and rollback. Keep current bindings, four Cron expressions, targets, actual positions and capital.
3. Production activation only adds C1 persistence/export integrity and the current-session staged handoff. No extra market-data requests; extra D1 content verification/UTF-8 hashing costs remain a live acceptance risk. The 2,000-row synthetic input is 3,478,161 bytes, 40 chunks, max chunk 86,955 bytes; this is not Cloudflare CPU/memory acceptance.
4. Observe the normal next complete current-session scan. If upstream data or resource limits fail, preserve blockers and diagnose; never force a successful receipt or repeatedly invoke business POSTs.
5. The new paired CLI is not connected to any scheduler. Connect it only after destination approval and only with the existing administrator authorization; never export or request the token itself.

## Explicit data-destination decision

Proposed research output contains generation/session/source commit and clocks, content/universe hashes, ordinary equity symbols, original Formal qualification/selection/first failure, gate PASS/FAIL/UNKNOWN, missing-safety reasons and paired diagnostic tallies. C1 diagnosis also contains offline sampled gate/symbol membership.
It contains no raw administrator/deployment/API tokens, webhook targets, actual broker holdings/cash/fills or account identifiers; account-risk evidence stays UNKNOWN. No full source pages are added to the artifact.
Public GitHub Actions artifacts are not approved for this new payload. Obtain explicit owner approval for this payload and public destination, or design and authorize a private destination before any live collector activation. Existing scheduled collector and its existing upload remain unchanged by this PR.

## Acceptance/rollback

Require version/bindings/TEST_MODE/Cron/target readback; protected Formal invariants; same completed scan-to-C1 generation linkage; full pagination and digest coverage; a C2 ledger from that exact generation; no missing-as-zero or backdated WATCH. Engineering CI alone does not meet live acceptance.
If research capture fails, Formal output remains unaffected but research status is DATA_QUALITY_BLOCKED with null unverified counts. Runtime performance is measured on the first authorized normal capture. Roll back code through the existing path; retain immutable stored evidence. A Formal strategy switch is outside this packet.

## Owner authorization, 2026-10-02

The owner replied "批准" to the concrete C1-only deployment and the listed public GitHub Actions artifact destination. This authorizes the three build-chain integrations and activation of the read-only paired collector described above. Earlier NOT APPROVED statements describe the pre-approval snapshot. Formal strategy changes remain outside authorization. Exact-head CI, deployment/readback, and genuine-generation acceptance are still required.

## Approved activation completed — 2026-10-02 16:00 Asia/Taipei

- Owner explicitly replied 「批准」 for the C1-only Class-B deployment and listed public GitHub Actions research artifact destination.
- Approved candidate 23047336981f337a6abf2cf405b93f3ec7ea4549; latest main D01 contracts retained. PR #306 merge commit 892e1a3d6fffea38ac6681b586ac18e56dd94f01.
- Exact-head isolated CI 57/57 PASS (36978917820 / job 110748767170); Regression PASS (36978917810); Repair CI PASS (36978917829). Post-merge Regression PASS (36981111091). Engineering checks do not establish genuine-market acceptance.
- Guarded deployment PASS (36981111040 / job 110755607961). Runtime readback at 15:55:38–15:55:45 Taipei: 8.15.1-c1-capture-integrity. KV/D1 retained; TEST_MODE, configUpdatedAt and monitoring targets equal predeploy baseline; verified previous 8.15.0 Worker backup retained. Research dashboard readback PASS; rollback unnecessary.
- Cron readback changed=false: all four expressions unchanged: 0-24 5 * * MON-FRI; * 1-4 * * MON-FRI; 35,55 15 * * mon-fri; * 9 * * MON-FRI. Normal scan/fallback remain 23:35/23:55 Taipei. Bootstrap/history reconstruction/resend/business scan/cache/import/3Min recovery steps were skipped.
- system1-c1-evidence.yml now uses the paired read-only CLI at 00:10 Taipei for the prior session, with explicit date override. Always preserve verified C1+C2 or the non-secret readiness blocker. No token/full source pages/broker cash/holdings/fills are exported. Collector-only workflow updates also trigger a read-only main verification without deploying Worker code.
- Genuine full C1 and live paired C2 acceptance remain PENDING. Existing scan/status at 15:55 still reported 2026-09-29; no fresh full generation is established. The preflight during deployment reported historyReady=false; this does not prove the unique cause of the earlier failed scan. Missing generation does not mean zero picks.
- Exact next cursor: inspect the normal 2026-10-02 23:35 scan and existing 23:55 fallback, then collector run at 2026-10-03 00:10 Taipei. Require current-session Formal pipeline complete/config verified/researchC1Population saveOk+readbackVerified; same generation/date/source SHA/header; full pagination, unique population symbols, count and content/universe hash verification; then C2 from precisely that generation. If blocked, diagnose the saved system1-c1-readiness.json and GET-only scan/status/institution/quality evidence, repair with tests, rerun read-only validation. Do not reconstruct historical receipts or WATCH.
- Open: actual runtime CPU/memory/latency acceptance, first genuine C1 and C2, corporate-action/execution/account-risk evidence. Preserve PASS/FAIL/UNKNOWN/PIT and null missing fields. Formal A/B/ranking/3+3+3/capital/15m/signals/push/System2 remain locked.

## First activated collector readback — 2026-10-02 16:23 Taipei

- Receipt/update PR #311: MERGED at 3a398137dd7901e2981cc59b1e4540039eab0641; candidate 4060b68c1af5f28570fe52a7cc08ffaa6b620817. Regression 36983650109 and Repair CI 36983650189 PASS; post-merge Regression 36983767469 PASS. No Cloudflare deployment was triggered by the collector-only/doc update.
- Real GET-only collector run 36983767480 / job 110764009881 executed the activated paired CLI and intentionally failed closed: scanDate=2026-10-01, verificationFailure=C1_GENERATION_NOT_FOUND, category=FORMAL_SCAN_NOT_CONFIRMED, mayCountAsZeroPick=false, noPlanChanges=true. It did not produce C1/C2 success artifacts or fabricate a historical receipt. This validates the negative live path, not a successful new generation.
- Always-upload step PASS. Saved one readiness artifact: system1-c1-evidence-36983767480, artifact ID 11216068363, 552 bytes, ZIP SHA256 d36a5fd52914e711189187a282e6c870f30844cfabbf991c3da95e02a8b253a3, 90-day retention. Run: https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/36983767480 . Failure therefore remains reviewable instead of silently becoming zero picks.
- Remaining acceptance cursor unchanged: genuine 2026-10-02 normal 23:35/23:55 scan, then scheduled collector 2026-10-03 00:10 Taipei. Determine any new upstream/capture failure from that session's preserved facts; never retroactively manufacture 10/01 WATCH/C1. No strategy switch is authorized.
