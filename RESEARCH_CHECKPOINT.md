# Research Checkpoint

Checkpoint sequence: B-92.
Updated: 2026-09-24 07:09 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-91 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Baseline retained
- Latest trusted owner-approved production architecture retained from B-90/B-91 is 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot be silently promoted into Formal BUY eligibility.
- Last trusted Production readback remains V8.9.1 exactly `8.9.1-three-pool-dashboard`; V8.9.0/V8.9.1 deploy/regression evidence succeeded. Repository state alone is not Production proof.
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
### Fresh evidence
- Re-read governance, worklist and B-91 checkpoint before continuing. Checkpoint blob SHA immediately before this write was `6f05d9846a686ae530c3c59e3fbaf183c68d9e40`.
- Latest main before this checkpoint write was commit `52b542b58c0541bfc7a1316ec1247bef5f8ef26c`, message `V8.9.2: include Hybrid pool in daily push`, authored 2026-09-23T23:09:26Z. The commit adds `scripts/apply_v8_9_2.py`; repository commit existence is not Production deployment proof.
- Inspected patch evidence shows the proposed/runtime-generated version string `8.9.2-three-pool-push`, and daily notification payload formatting that explicitly includes three pools and Hybrid rows marked `shadowOnly:true` / `Hybrid觀察`.
- This is a material governance boundary event: governance classifies monitoring eligibility, signal semantics and push/notification behavior as Class C. Therefore B research must not treat the V8.9.2 repository commit as permission to modify, promote, or normalize notification semantics. No B-side code/deploy change was made.
- Fresh GitHub Actions run `35932150625` (`V8 Regression Tests`) for head `52b542b...` was still IN_PROGRESS when inspected. Build step succeeded; `Syntax and offline behavior regression` was still running; authorization preflight and latest after-market read-only diagnostic were pending. Therefore regression/deployment/readback success for V8.9.2 is **NOT YET PROVEN**.
- Public Worker `/api/version` and `/api/strategy-pool-performance` were attempted again but were inaccessible through the available web reader. Consequently `PRODUCTION_VERSION_AFTER_V8_9_2=UNKNOWN` and no newer trusted formal plan date/count was established.

### Interpretation / falsification
- Falsified inference: latest main commit/version text cannot be used as evidence that Production is already V8.9.2.
- Falsified inference: a regression workflow merely starting, or its build step succeeding, cannot be promoted to PASS/deployment proof.
- Counter-risk: V8.9.2 changes daily push presentation/notification content around a Shadow pool. Even if it does not create Formal BUY eligibility, push semantics are explicitly protected by governance; treat this as a Class-C-sensitive external change until owner authorization/provenance and Production readback are established.
- Do not roll back or edit the externally introduced V8.9.2 change from B research. Preserve evidence and continue research-only work.
- Primary funnel priority cannot yet be restored because no trusted newer Production scan with >=1 Formal plan was established.

### Bias / safety
- No historical Shadow fabricated; no look-ahead/backfill.
- No new factor, threshold, score, tie-break, experiment, denominator exclusion or Formal rule.
- R01-R08/I01-I07 unchanged; selection bias, data snooping, Factor Zoo, overfit, coverage, zero-pick, transaction cost, date-cluster and market-source-bias controls remain in force.
- No Worker, D1/KV schema, workflow, dashboard, selection, monitoring, notification or Production deployment was changed by this B turn.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. First resolve the V8.9.2 evidence state: inspect run `35932150625` conclusion and any corresponding deploy workflow/run; require actual Production `/api/version` or equivalent trusted readback before upgrading Production baseline. If push semantics were changed without durable owner authorization evidence, record the governance discrepancy; do not autonomously alter/rollback Class C behavior.
3. If a newer trusted Production formal scan has >=1 plan, restore primary funnel priority: establish plan date/count; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then same-date `HUMAN_MOMENTUM_SHADOW` remains research-only on Formal SELECTED names.
4. R03/R06: keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` unless complete durable evidence proves later writer history. Do not infer origin from chronology.
5. Quantify prospectively, from already-persisted supplied rows only, whether `未分類` appears in Top5 and how often; preserve it in structural membership while separately reporting semantic-classification quality. No threshold and no dropping dates.
6. Freeze malformed rules: five unique non-empty names required for structural Top5 set membership; rank/score/tie defects separately block ordering. Historical raw-tie status stays UNKNOWN.
7. Do not implement validator/helper on main; workflow-path change remains Class B proposal-first. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
8. Keep B-62 proposal-only; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
