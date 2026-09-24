# Research Checkpoint

Checkpoint sequence: B-104.
Updated: 2026-09-24 13:10 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-103 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-103
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified.
- 2026-09-22 and 2026-09-23 remain two adjacent observed completed Formal zero-pick dates; descriptive only. 2026-09-24 intraday monitoredCount=0 is not a completed daily zero-pick.
- V8.9.6 Production activation is durably proven: V8.9.5 at 2026-09-24T00:13:05Z and V8.9.6 at 00:13:21Z; the 16-second transition window remains UNKNOWN for observations without self-versioning.
- B-99 live research readback: Shadow total=62 across 2 archived dates; external evidence total=62, TWSE=53, TPEX=0, UNKNOWN=9; TPEx revenue available=0; shadow integrity RESEARCH_DATA_GAP; all R01-R08 readiness DATA_QUALITY_BLOCKED.
- B-100: `sourceMarket` is inferred from monthly-revenue symbol-map matching, so TPEX=0 cannot distinguish H1=no OTC candidates, H2=OTC candidate(s) unmatched -> UNKNOWN, H3=TPEx monthly-revenue provider unavailable/fetch failed.
- B-101: no existing durable `/api/research/*` raw-row surface exposes `evidence_json`, per-row provider status or archived candidate market classification.
- B-102: inspected scheduled health artifact/mirror path did not resolve capture-time TPEx research evidence; encrypted plan mirror is not proof of market/source state.
- B-103: capture-time 2026-09-22 official-market Action proved TPEx infrastructure generally available (market/institutional/financial datasets succeeded), narrowing H3 to the specific monthly-revenue research provider/path; H1/H2/H3 remain unresolved.

## B-104 — Remaining plaintext diagnostic surfaces do not expose monthly-revenue capture provenance
### Fresh evidence
- Re-read governance, worklist, B-103 checkpoint and latest main first. Latest main research commit was B-103 (`f80b0d4cc1a3bfdf7c7df907db0222e9c35af5ef`); no newer A/B cursor existed.
- Re-checked Actions and found no newly completed later Formal daily scan suitable for adding 2026-09-24 to the zero-pick denominator.
- Audited the V8.9.3 regression diagnostic run `35936071471` / job `107433285509`. The workflow had explicit steps for a production `/api/scan-preview` dry-run, read-only production authorization preflight and latest after-market read-only diagnostic.
- Inspected the commit that added the diagnostic (`d853eb154f7a4aca45c6acf6ee94975ecc0431b5`). Its printed scan-preview payload is deliberately bounded to Hybrid selected/watch symbols, watch reasons, missing conditions, Hybrid pool/exclusions and final-pool merge diagnostics. It does **not** print research external-evidence rows, persisted `sourceMarket`, monthly-revenue provider/status/sourceDate/capturedAt, or point-in-time eligibility.
- Repository code search for the research external-evidence table/provider wording produced no additional committed plaintext export surface. The available Actions job metadata confirms the diagnostics ran successfully, but job metadata itself contains only step status/timing, not the JSON stdout needed to distinguish H1/H2/H3; the connector does not expose raw job-log download for this endpoint.

### Interpretation / falsification
- The hypothesis that an existing V8.9.x regression/scan-preview diagnostic already preserved enough plaintext research provenance to resolve TPEx=0 is **not supported** by its committed payload contract.
- This does not prove the monthly-revenue provider failed or succeeded. It only shows this diagnostic surface cannot discriminate H1/H2/H3.
- Combined with B-101..B-103, currently reachable durable plaintext surfaces are exhausted without row-level monthly-revenue provenance. Therefore `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` remains mandatory.
- The broad exchange-outage hypothesis remains falsified for 2026-09-22, but the narrower monthly-revenue path H3 remains live alongside H1/H2.

### Bias / governance controls
- No current provider response was substituted into historical rows; no look-ahead repair.
- No UNKNOWN row was relabeled; no market inferred from present-day listing metadata.
- No new factor, threshold, window or experiment was introduced. R01-R08/I01-I07 remain frozen.
- Market-source bias remains unresolved; 53/0/9 cannot be used as TWSE-vs-TPEx performance evidence.
- Selection bias, data snooping, Factor Zoo, overfit, coverage, zero-pick, transaction-cost, date-cluster and redundancy controls unchanged.

### Engineering classification
- A future row-level observability surface would touch shared runtime/API/storage plumbing even if read-only and research-only, so conservatively classify the proposal as **Class B** under governance. Proposal only; no code/branch/merge/deploy this round.
- Minimum proposed fields: `scanDate`, symbol, persisted `sourceMarket`, monthly-revenue `provider`, `status`, `sourceDate`, `capturedAt`, `pointInTimeEligible`, and capture/runtime version.
- Safety contract: admin-authenticated read-only endpoint/export; bounded rows/date filter; no formal consumer; no source routing/caching/date-resolution changes; UNKNOWN preserved verbatim; no historical reconstruction/backfill; regression must prove protected Formal outputs unchanged.

### Engineering / deployment
- Evidence inspection + checkpoint only. No Worker/workflow/D1/KV/source routing/Formal selection/Hybrid WATCH/monitoring/notification change and no Production deployment.
- No Class B/C implementation attempted.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. Check for a newly completed later Formal scan. Never count intraday `monitoredCount=0` as a completed daily zero-pick.
3. If a trusted later scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` remains research-only on Formal SELECTED names.
4. Otherwise treat the existing durable plaintext TPEx monthly-revenue evidence search as exhausted unless a genuinely new artifact/log/export class appears. Do not repeat route, health/mirror, general official-market, or V8.9.x scan-preview diagnostic audits.
5. Keep `TPEX_ZERO_ROOT_CAUSE=UNKNOWN`; H1/H2/H3 remain unresolved. Do not use today's provider/listing data as historical substitute.
6. Preserve the B-104 **Class B proposal only** for future row-level observability. Do not implement/merge/deploy without owner approval. If owner approval is later obtained, isolate the smallest read-only research surface and prove no protected Formal output changes.
7. Continue R03/R06 persisted Top5/`未分類` frequency only from durable prospective rows; structural membership and semantic classification remain separate; no repair/re-sort/de-dup/raw-tie inference.
8. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.
9. Do not implement workflow/version logging, validator/helper, shared calendar/cache/date-resolution or source-routing changes on main without the applicable Class B decision.
