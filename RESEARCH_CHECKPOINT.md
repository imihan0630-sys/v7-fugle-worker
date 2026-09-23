# Research Checkpoint

Checkpoint sequence: B-93.
Updated: 2026-09-24 07:40 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-92 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Baseline retained
- Latest trusted owner-approved production architecture retained from B-90/B-91 is 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot be silently promoted into Formal BUY eligibility.
- Last trusted owner-approved Production readback remains V8.9.1 exactly `8.9.1-three-pool-dashboard`; V8.9.0/V8.9.1 deploy/regression evidence succeeded. B-93 proves a later V8.9.2 deployment workflow completed, but does not retroactively establish owner authorization for its Class-C-sensitive push semantics.
- Last trusted prospective Shadow evidence retained: 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 remains a formal zero-pick date; `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill.
- B-73..B-75 isolated sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency is not exchange-session adjacency; no historical calendar/Shadow backfill.
- Deployment coupling from B-81/B-82 remains: no purpose-fit non-deploy-triggered research harness proven; workflow-path changes are Class B proposal-first.

## Top5 provenance retained through B-91
- `buildResearchMarketContext(...)` sorts available full-precision `sectorStats.score` descending, slices Top20, then persists rounded score/breadth/avgChange and assigns `rank=index+1` after sorting.
- No explicit secondary tie-break exists. Exact raw-score ties inherit incidental upstream insertion order, not a durable semantic tie-break. Raw pre-round score is not separately durable; historical raw-tie status remains UNKNOWN.
- R03/R06 consumer takes `(market.topSectors||[]).slice(0,5)` and uses array names; persisted rank is an integrity check, not a repair source.
- V8.7.0 formal persistence serializes `researchMarket` directly to `trade_research_days.market_json`; current-snapshot backfill is semantically different. No visible V8.7.2..V8.8.1 migration rewrite was found, but row-level origin remains unresolved.
- `TOP5_SET_MEMBERSHIP` requires parseable market JSON, at least five entries, and five unique non-empty first-five industry names. Rank/score defects alone do not erase an otherwise valid five-name set.
- `TOP5_ORDERING` is stricter: membership prerequisites plus valid rank-position integrity and sufficient score/tie provenance. Persisted score zero is ambiguous because writer uses `round(toNumber(score)||0,2)`; exact raw ties cannot be reconstructed.
- `未分類` is a deliberate non-empty fallback bucket (`row.industry || "未分類"`), so its presence does not by itself fail structural membership. Separately, it is semantically coarse and cannot be assumed to represent a coherent economic sector. Preserve it in coverage; do not drop it or create an acceptance threshold.
- No repair/re-sort/de-dup/backfill is allowed. Malformed evidence remains UNKNOWN/DATA_QUALITY_BLOCKED.
- `/api/research/backfill-current` invocation for 2026-09-18 is PROVEN from prior GitHub Actions evidence, but `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because the day row is UPSERT-able and lacks immutable origin provenance.

## B-92 — V8.9.2 repository drift / governance gate
- Latest main at B-92 included commit `52b542b58c0541bfc7a1316ec1247bef5f8ef26c`, `V8.9.2: include Hybrid pool in daily push`.
- V8.9.2 changes daily push presentation/notification content around a Shadow pool, which is Class-C-sensitive under governance. B research did not authorize, modify, promote or roll it back.
- At B-92, regression/deployment/readback were not yet proven; Production baseline was therefore not upgraded from V8.9.1.

## B-93 — V8.9.2 deploy evidence resolution / governance discrepancy preserved
### Fresh evidence
- Re-read governance, worklist and B-92 checkpoint before continuing. Checkpoint blob SHA immediately before this write was `dd5c3d9e437ad92f6591e504eb195d306948663a`.
- Re-checked latest main immediately before this write: `767fcaa1cac263c56e66fc0ca0ce75a092a52902` (`Health: keep webhook acceptance check at durable outbox layer`). This is newer than B-92 and descends through the V8.9.2 deployment-related commits.
- Regression run `35932150625` for V8.9.2 head `52b542b...` is now completed SUCCESS. Its job shows build, syntax/offline behavior regression, read-only production authorization preflight, and latest after-market read-only diagnostic all completed successfully.
- Main history now contains commit `966b8243e982e348aa9e053c6aadde3bb0d56ccb`, message `Deploy V8.9.2 three-pool push [resend-daily-report]`, followed by health fixes and latest head `767fcaa...`.
- For latest head `767fcaa...`, GitHub Actions exposes both regression run `35933203952` SUCCESS and Cloudflare deploy run `35933203968` SUCCESS.
- Deploy run `35933203968` explicitly shows `Apply V8.9.2 three-pool daily push` SUCCESS, `Deploy Worker code only` SUCCESS, `Verify deployed version and preserved configuration` SUCCESS, and `Verify research-only counterfactual readback` SUCCESS. A predeploy artifact `v7-predeploy-35933203968` was preserved with digest `sha256:9de5465483ef3f134a2dcac21786bcd3363b7a270ef87cf9a33c5bb18b1bd31e`.
- This is strong trusted workflow evidence that V8.9.2 code was deployed and version/config verification passed. However the available GitHub response does not expose the literal `/api/version` response body, so the exact live version string remains `WORKFLOW_VERIFIED_V8_9_2_DEPLOY` rather than independently direct-read as `8.9.2-three-pool-push`.
- No durable owner-authorization artifact for the Class-C-sensitive Hybrid daily-push semantic change was established in this B turn. Therefore `V8_9_2_PUSH_OWNER_AUTHORIZATION=UNKNOWN`. Do not infer authorization from deployment success.

### Interpretation / falsification
- B-92 uncertainty `regression/deployment not yet proven` is resolved: both regression and Cloudflare deployment are now proven SUCCESS by GitHub Actions evidence.
- Falsified inference: a successful deployment proves governance authorization. It does not. Technical deployment evidence and strategy/notification authorization provenance are separate dimensions.
- Falsified inference: because the deploy workflow verified deployed version/configuration, B research may autonomously normalize or extend Hybrid push semantics. It may not; notification semantics remain Class C.
- Production technical baseline may now record `V8.9.2 DEPLOYMENT WORKFLOW VERIFIED`, while exact direct public `/api/version` payload remains not independently captured by this turn.
- No newer trusted formal scan date/count was established from the available evidence, so primary funnel priority is not yet restored.

### Bias / safety
- No historical Shadow fabricated; no look-ahead/backfill.
- No new factor, threshold, score, tie-break, experiment, denominator exclusion or Formal rule.
- R01-R08/I01-I07 unchanged; selection bias, data snooping, Factor Zoo, overfit, coverage, zero-pick, transaction cost, date-cluster and market-source-bias controls remain in force.
- No Worker, D1/KV schema, workflow, dashboard, selection, monitoring, notification or Production deployment was changed by this B turn. This turn only inspected evidence and updated the durable research checkpoint.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. Preserve the governance discrepancy: V8.9.2 deploy is technically proven, but owner authorization for the Class-C-sensitive Hybrid push change remains UNKNOWN unless a durable authorization artifact is found. Do not autonomously alter/rollback/extend notification behavior.
3. Seek a trusted direct Production `/api/version` or equivalent readback only if available through existing authorized tooling; do not substitute repository strings. Also establish the latest formal plan date/count. If >=1 Formal plan exists, restore primary funnel priority and verify execution-recorder target-date coverage plus 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` stays research-only on Formal SELECTED names.
4. If no newer formal-plan evidence is available, continue R03/R06 prospective supplied-row work: quantify whether `未分類` appears in persisted Top5 and its frequency/coverage. Preserve it in structural membership while separately reporting semantic-classification quality; no threshold, no date dropping.
5. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` absent complete durable writer-history evidence. Do not infer origin from chronology.
6. Freeze malformed rules: five unique non-empty names required for structural Top5 set membership; rank/score/tie defects separately block ordering. Historical raw-tie status stays UNKNOWN.
7. Do not implement validator/helper on main; workflow-path change remains Class B proposal-first. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
8. Keep B-62 proposal-only; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
