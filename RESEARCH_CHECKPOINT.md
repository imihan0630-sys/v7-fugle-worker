# Research Checkpoint

Checkpoint sequence: B-101.
Updated: 2026-09-24 11:42 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-100 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-100
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified; do not pool them as one frozen experiment.
- V8.9.6 source adds audit/output fields without a visible WATCH eligibility change; shared-runtime/deployment classification remains at least Class B. V8.9.3-8.9.5 owner authorization remains UNKNOWN absent durable owner evidence.
- 2026-09-22 and 2026-09-23 remain two adjacent observed completed Formal zero-pick dates; descriptive only. 2026-09-24 intraday monitoredCount=0 is not a completed daily zero-pick and stays outside the denominator.
- V8.9.6 Production activation is durably proven: V8.9.5 was observed at 2026-09-24T00:13:05Z and V8.9.6 at 00:13:21Z. The 16-second transition window is UNKNOWN for observations without self-versioning.
- B-99 live research readback: Shadow total=62 across 2 archived dates; external evidence total=62, TWSE=53, TPEX=0, UNKNOWN=9; TPEx revenue available=0; shadow integrity RESEARCH_DATA_GAP; all R01-R08 readiness DATA_QUALITY_BLOCKED.
- B-100 localized the TPEx zero-coverage ambiguity: `sourceMarket` is inferred from monthly-revenue symbol-map matching, so TPEX=0 cannot distinguish no OTC candidates vs unmatched OTC candidates vs provider failure. Existing dashboard/workflow summaries expose aggregates only.

## B-101 — Existing research route audit closed; no durable raw external-evidence surface found
### Fresh evidence
- Re-read governance, worklist and B-100 checkpoint first. Latest main was B-100 `acc4c154b8abce25ded1aabd31cb09fb70a54459`; immediately before write checkpoint blob SHA was `6f78cafe60b093ef57900413f2bf81f5fd39676e`, so no competing A/B checkpoint appeared during this run.
- Audited the route creation history rather than guessing endpoint names. V8.7.0 introduced exactly two research API routes in its patch: authenticated `GET /api/research/dashboard` and authenticated `POST /api/research/backfill-current`, plus the `/research` HTML page.
- The research dashboard client calls only `/api/research/dashboard?days=...`; it does not call a second raw-row endpoint.
- V8.7.9 added `trade_research_external_evidence`, persistence, joins into counterfactual outcomes, aggregate `externalEvidenceCoverage`, and aggregate dashboard loading. Its patch did not add a raw external-evidence route.
- V8.7.11 replaced collector/coverage/summary helpers with cross-market-aware V8711 versions and changed UI aggregate fields, but likewise did not add a route exposing `evidence_json`, per-row provider status, or archived candidate market classification.
- Repository-wide GitHub code search for literal `/api/research/` was index-incomplete and returned no hits, so it is not used as sole proof. The stronger source evidence is the actual route-introducing V8.7.0 patch plus the later V8.7.9/V8.7.11 patches that modify the dashboard data path without introducing a raw endpoint.
- Direct unauthenticated web reads to guessed `/api/research*` Production URLs were unavailable through the current web reader, so no claim is made from HTTP probing. The conclusion is source-level: no existing durable route found that exposes the discriminating row-level fields.

### Interpretation / falsification
- The B-100 requested test is closed negatively: no existing durable `/api/research/*` surface was found that can separate H1/H2/H3 for the already-persisted 2026-09-21/22 evidence rows.
- Therefore set `TPEX_ZERO_ROOT_CAUSE=UNKNOWN`. Do not infer H1 from TPEX=0; H2 and H3 remain live alternatives.
- A new row-level read-only surface could resolve future diagnostics, but it would touch deployed Worker/shared D1 and the coupled deployment chain. Under governance this is at least Class B unless redesigned into an isolated offline artifact that can consume already-exported evidence without touching runtime.
- No current-provider fetch may be used to reconstruct provider status at historical capture time; that would violate PIT provenance.

### Bias / governance controls
- Market-source bias remains active and unresolved; TWSE-vs-TPEx performance comparisons remain invalid.
- Selection bias: 53 TWSE / 0 TPEX / 9 UNKNOWN is coverage telemetry, not a performance denominator.
- Look-ahead/PIT: no historical provider state, candidate market, or evidence row was reconstructed from today's data.
- Data snooping / Factor Zoo / overfit / date clustering / redundancy / transaction costs / zero-pick controls unchanged. No threshold/factor added.
- UNKNOWN remains UNKNOWN; the nine UNKNOWN rows are not relabeled TPEx.

### R01-R08 / I01-I07 impact
- No experiment/contrast changed. R01-R08/I01-I07 remain frozen and research-only.
- R03/R06 remain DATA_QUALITY_BLOCKED where TPEx parity/PIT provenance is required.
- R08/external-evidence work cannot claim cross-market neutrality from the current persisted cohort.

### Engineering / deployment
- Evidence inspection + checkpoint only. No Worker/workflow/D1/KV/source routing/Formal selection/Hybrid WATCH/monitoring/notification changes. No Production deployment.
- No Class A implementation attempted because the obvious runtime observability fix is deployment-coupled/shared-runtime and therefore not safely autonomous under current governance.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. Wait for a completed later Formal scan before updating zero-pick coverage. Never count intraday `monitoredCount=0` as a completed daily zero-pick.
3. If a later trusted scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` stays research-only on Formal SELECTED names.
4. Otherwise continue TPEx parity/PIT without re-running the route audit. Seek existing durable non-route evidence for 2026-09-21/22: Actions logs/artifacts, scan response payloads, archived Shadow rows, or any persisted/exported file that captured candidate symbols/market or provider status at capture time. Do not use today's provider data as a historical substitute.
5. Keep `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` unless durable capture-time evidence distinguishes H1=no TPEx candidate, H2=TPEx candidate(s) unmatched and UNKNOWN, or H3=TPEx provider unavailable/fetch failed.
6. If no such durable evidence exists, prepare a Class B proposal for future row-level observability only; do not merge/deploy it. Prefer a design that exposes minimum necessary research fields, is read-only, requires admin auth, has no formal consumer, and preserves UNKNOWN/PIT semantics.
7. Continue R03/R06 persisted Top5/`未分類` frequency only from durable prospective rows; structural membership and semantic classification remain separate; no repair/re-sort/de-dup/raw-tie inference.
8. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.
9. Do not implement workflow/version logging, validator/helper, shared calendar/cache/date-resolution or source-routing changes on main without the applicable Class B decision.
