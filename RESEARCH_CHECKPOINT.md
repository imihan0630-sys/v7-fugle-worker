# Research Checkpoint

Checkpoint sequence: B-94.
Updated: 2026-09-24 08:10 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-93 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Baseline retained
- Latest trusted owner-approved production architecture retained from B-90/B-91 is 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot be silently promoted into Formal BUY eligibility.
- Last trusted owner-approved direct Production readback remains V8.9.1 exactly `8.9.1-three-pool-dashboard`. B-93 proved V8.9.2 deployment workflow success but did not establish owner authorization for its Class-C-sensitive push semantics.
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

## B-93 retained — V8.9.2 governance discrepancy
- V8.9.2 regression/deployment workflow success is proven by GitHub Actions.
- Exact live `/api/version` body was not independently captured in B-93.
- `V8_9_2_PUSH_OWNER_AUTHORIZATION=UNKNOWN`; deployment success does not prove Class-C authorization.

## B-94 — V8.9.5 repository/runtime drift gate
### Fresh evidence
- Re-read governance, worklist and B-93 checkpoint before continuing. Checkpoint blob SHA immediately before this write was `44df87d7753cc789d908d3439f0293a91cf5bab5`.
- Re-checked latest main before this write: `204bd0c72c44d55b961baf2ac6636ee3eb95f1d3`, commit message `Deploy V8.9.5 Hybrid WATCH directional [hybrid-watch-bootstrap]`.
- The immediately preceding commits include `87428f5ecc291be31e5a676ad183a473b0ba0c71` (`V8.9.5: fix Hybrid WATCH directional consensus and MA20 repair zone`) and `f2c147217e54b153ad7f2e0a0e84a4534eb5da55` (`Test V8.9.5 Hybrid WATCH directional refinement`).
- Commit `204bd0c...` modifies `.github/workflows/v7-cloudflare.yml` to apply `scripts/apply_v8_9_5.py`, expects version string `8.9.5-hybrid-watch-directional`, and explicitly validates `smartMoneyDirectional` plus `entry<ma20*0.94` in the generated Worker.
- Regression run `35937058340` for head `204bd0c...` completed SUCCESS. Build, syntax/offline behavior regression, read-only production authorization preflight, and latest after-market read-only diagnostic all succeeded. The V8.9.4 Hybrid WATCH candidate audit step was skipped.
- The commit wording and workflow contract show V8.9.5 changes Hybrid WATCH directional consensus / MA20 repair-zone behavior. Under governance, signal semantics / monitoring eligibility are Class C. B research therefore did not authorize, modify, roll back, extend, or normalize these semantics.
- Available evidence in this turn does not independently expose a literal Production `/api/version` response body or a trusted latest formal-plan date/count. Therefore `V8_9_5_DIRECT_PRODUCTION_READBACK=UNKNOWN` and primary funnel priority is not yet restored from this evidence alone.
- No durable owner-authorization artifact for the V8.9.5 Class-C-sensitive Hybrid WATCH semantic change was established in this B turn. Therefore `V8_9_5_OWNER_AUTHORIZATION=UNKNOWN`. Do not infer authorization from commit/deploy naming or regression success.

### Interpretation / falsification
- Main has advanced materially beyond B-93 (V8.9.2) to V8.9.5-related code. Repository version drift is proven; direct Production version equivalence is not.
- Falsified inference: successful regression/preflight proves owner strategy authorization. It does not; technical validation and Class-C authorization provenance remain separate.
- Falsified inference: because Hybrid is Shadow-only, any change to its WATCH/signal semantics is automatically Class A. Governance explicitly classifies monitoring eligibility and signal semantics as Class C regardless of whether the pool is called Shadow.
- Do not evaluate V8.9.5 WATCH performance as if it were a frozen prospective research experiment until its authorization/provenance and exact runtime baseline are resolved; doing so risks data snooping and moving-target bias.

### Bias / safety
- No historical Shadow fabricated; no look-ahead/backfill.
- No new factor, threshold, score, tie-break, experiment, denominator exclusion or Formal rule introduced by B.
- R01-R08/I01-I07 unchanged; selection bias, look-ahead, data snooping, market-source bias, Factor Zoo, overfit, coverage, zero-pick, transaction-cost and date-cluster controls remain in force.
- No Worker, D1/KV schema, workflow, dashboard, selection, monitoring, notification or Production deployment was changed by B-94. Only evidence inspection and checkpoint update were performed.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. Treat V8.9.5 as repository-proven but direct-Production-readback UNKNOWN until trusted authorized runtime evidence establishes the live version. Preserve `V8_9_5_OWNER_AUTHORIZATION=UNKNOWN` unless a durable owner-authorization artifact is found; do not autonomously alter/rollback/extend Hybrid WATCH semantics.
3. Inspect V8.9.3/V8.9.4/V8.9.5 commit chain and relevant patch scripts only to classify which changes are presentation/observability versus Class-C signal/monitoring semantics. Do not promote or repair them. Record moving-target risk for any prospective Hybrid research cohort whose definition changed after observation began.
4. Seek trusted latest formal-plan date/count through existing authorized read-only evidence. If >=1 Formal plan exists, restore primary funnel priority and verify execution-recorder target-date coverage plus 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` remains research-only on Formal SELECTED names.
5. If no newer formal-plan evidence is available, continue R03/R06 prospective supplied-row work: quantify whether `未分類` appears in persisted Top5 and its frequency/coverage. Preserve it in structural membership while separately reporting semantic-classification quality; no threshold, no date dropping.
6. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` absent complete durable writer-history evidence. Freeze malformed rules and historical raw-tie UNKNOWN semantics.
7. Do not implement validator/helper on main; workflow-path change remains Class B proposal-first. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
8. Keep B-62 proposal-only; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
