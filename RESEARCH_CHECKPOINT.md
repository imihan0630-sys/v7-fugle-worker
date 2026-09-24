# Research Checkpoint

Checkpoint sequence: B-95.
Updated: 2026-09-24 08:40 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-94 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

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

## B-93/B-94 retained — runtime governance discrepancy
- V8.9.2 regression/deployment workflow success is proven by GitHub Actions, but `V8_9_2_PUSH_OWNER_AUTHORIZATION=UNKNOWN`.
- B-94 proved main advanced to V8.9.5-related code while direct Production `/api/version` remained UNKNOWN in the research evidence available then.
- V8.9.5 changes Hybrid WATCH directional consensus / MA20 repair-zone behavior; under governance, signal semantics / monitoring eligibility are Class C. `V8_9_5_OWNER_AUTHORIZATION=UNKNOWN` remains unless durable owner authorization is found.

## B-95 — Hybrid WATCH moving-target classification
### Fresh evidence
- Re-read governance, worklist and B-94 checkpoint. Checkpoint blob SHA immediately before this write was `7ed7e7944254b429471e1534efe0c10bd309b7ca`.
- Re-checked latest main before this write. Main advanced beyond B-94 to `c322c13163016a76b77c0a7d0e19ee0d0caa82f7`, `Deploy V8.9.6 Hybrid WATCH audit`.
- V8.9.3 (`73b752f42cbcb1181347fe82e15f9324dc825b9f`) introduced the Hybrid WATCH two-layer state machine, new WATCH eligibility rules, D1/KV lifecycle state, 15-minute upgrade evaluation, and promotion into the Hybrid Shadow pool. This changes signal/monitoring eligibility and state transitions: **Class C semantics**, regardless of Shadow naming.
- V8.9.4 (`3be8d415fca32c7d53de4ff35fd5867909c5fd7c`) broadened/changed WATCH eligibility to include forming Smart Money consensus and changed trigger construction/policy. This is **Class C signal/monitoring semantics**. Its added `hybridWatchAudit` rows are observability, but they are attached to a Class-C semantic rewrite and do not make the release research-only.
- V8.9.5 (`87428f5ecc291be31e5a676ad183a473b0ba0c71`) again changed WATCH eligibility: directional/early Smart Money definitions and MA20 repair tolerance from ~3% below MA20 to ~6% below MA20. This is **Class C signal/monitoring semantics**.
- V8.9.6 code commit (`b21cf8926e87047a39f35fd667ab61e9de6f6006`) adds audit/output fields only: industry, MA20 distance, sector breadth/avgChange/score, nearest resistance and upside. No eligibility threshold/state-transition change is visible in that patch. Semantically this is observability; however it patches shared Worker runtime, so engineering classification is at least **Class B shared-runtime observability**, not autonomous Class A.
- V8.9.6 deploy commit (`c322c13163016a76b77c0a7d0e19ee0d0caa82f7`) changes the production workflow to apply V8.9.6 and expect version `8.9.6-hybrid-watch-audit`; deployment-pipeline changes are **Class B** by governance. This commit alone is not direct Production readback and not owner authorization.

### Interpretation / falsification
- The Hybrid WATCH prospective definition is demonstrably a moving target across V8.9.3 -> V8.9.4 -> V8.9.5. Therefore observations generated under those versions must not be pooled as one frozen prospective cohort without version-stratified provenance. Doing so would create moving-target/data-snooping bias.
- V8.9.6 is materially different from V8.9.3-8.9.5: the inspected patch adds diagnostics but does not change WATCH eligibility. Falsified inference: every version bump in this chain necessarily changes signal semantics.
- Conversely, falsified inference: calling a pool `Shadow` makes eligibility/upgrade semantics Class A. Governance explicitly makes monitoring eligibility and signal semantics Class C.
- No performance conclusion about Hybrid WATCH is valid yet from the chain alone; exact runtime version, owner authorization provenance, cohort version tags, and mature prospective outcomes remain prerequisites.

### R01-R08 / I01-I07 impact and bias controls
- No R01-R08/I01-I07 definition changed. This turn is provenance/governance classification only.
- Primary risks identified: moving-target bias, data snooping, cohort contamination, version confounding, and false attribution of performance to one frozen rule set.
- Selection bias, look-ahead, market-source bias, Factor Zoo, overfit, coverage, zero-pick, transaction-cost and date-cluster controls remain in force.
- Missing direct Production readback / authorization remains UNKNOWN; it is not coerced to BAD/0.

### Engineering / deployment
- Research action classification: evidence inspection + checkpoint only.
- No Worker, D1/KV schema, workflow, dashboard, selection, monitoring, notification or Production deployment changed by B-95.
- No branch/code/test/deploy was required for this evidence-classification turn. Latest repository head observed: `c322c13163016a76b77c0a7d0e19ee0d0caa82f7`.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; if another A/B turn advanced the cursor, merge from that newer checkpoint instead of overwriting.
2. Seek trusted authorized read-only Production evidence for literal `/api/version` plus latest Formal plan date/count. Repository/deploy commit is not sufficient. Preserve V8.9.3-8.9.5 Class-C authorization as UNKNOWN absent durable owner authorization; do not alter/rollback/extend WATCH semantics.
3. If >=1 Formal plan exists, restore primary funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; same-date `HUMAN_MOMENTUM_SHADOW` remains research-only on Formal SELECTED names.
4. For any Hybrid WATCH research, require version-stratified cohort provenance at least across V8.9.3, V8.9.4 and V8.9.5 semantic regimes. V8.9.6 may share V8.9.5 eligibility only if source/runtime evidence confirms no later semantic patch. Do not pool moving-target cohorts as one experiment.
5. If no newer formal-plan evidence is available, resume R03/R06 prospective supplied-row work: quantify whether `未分類` appears in persisted Top5 and its frequency/coverage. Preserve structural membership and separately report semantic-classification quality; no threshold, no date dropping.
6. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; freeze malformed rules and historical raw-tie UNKNOWN semantics.
7. Do not implement validator/helper on main; workflow-path change remains Class B proposal-first. Do not modify shared calendar runtime/cache/date resolution or retroactively upgrade B-73/B-74 pairs.
8. Keep B-62 proposal-only; signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
