# Research Checkpoint

Checkpoint sequence: B-103.
Updated: 2026-09-24 12:43 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-102 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-102
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

## B-103 — Capture-time official-market logs falsify a broad TPEx-outage explanation, but do not resolve monthly-revenue evidence
### Fresh evidence
- Re-read governance, worklist and B-102 checkpoint first; checkpoint SHA was re-read immediately before this write and remained `8c28cdde5a2524b11e4e970b9d51a53f9354dc31`, so no newer A/B cursor was overwritten.
- Re-checked Actions: no newly completed later Formal scan was found after B-102, so 2026-09-24 remains outside the completed daily zero-pick denominator.
- Audited the 2026-09-22 scheduled `V7 Official Market Data Sync` run `35716596207` and full job log `106709424387` as a capture-time evidence class not previously exhausted.
- At 2026-09-22 18:33-18:36 Taipei, the run successfully cached **both** official markets for the same trading date: TWSE count=1038 and TPEx count=847, both `verified=true`.
- The same run then cached institutional data with TWSE=1067, TPEx=787, total=1854 and verified the 2026-09-22/21/18 streak; it also successfully parsed TPEx quarterly financial data (for example 2026 Q2 count=884) and TPEx announcement schema alongside TWSE.
- The workflow itself is explicitly a market-data/quality sync and does not expose research external-evidence rows or monthly-revenue provider status; `recover_after_market.mjs` skipped because this invocation was outside the 23:35-23:59 recovery window.

### Interpretation / falsification
- This is meaningful negative evidence against an overly broad H3 interpretation: **TPEx official-market infrastructure was not generally unavailable on 2026-09-22**. Multiple independent TPEx official datasets were successfully fetched and verified in a capture-time Action.
- It does **not** prove the separate TPEx monthly-revenue collector used by `trade_research_external_evidence` succeeded at Shadow capture time. Therefore H3 is narrowed to `TPEx monthly-revenue research provider/path unavailable or failed`, not eliminated.
- H1=no OTC Shadow candidates and H2=OTC candidate(s) existed but failed monthly-revenue symbol-map matching remain live. `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` remains the correct state.
- The 53/0/9 persisted external-evidence split still cannot be used as TWSE-vs-TPEx performance evidence.

### Bias / governance controls
- Market-source bias remains unresolved, but a broad exchange-wide outage hypothesis is now falsified for 2026-09-22.
- Look-ahead/PIT: only capture-time 2026-09-22 Action logs were used; no current provider response was substituted into historical rows.
- Selection bias: no UNKNOWN row was relabeled as TPEx/TWSE and no candidate market was inferred from today's metadata.
- Data snooping/Factor Zoo/overfit/date clustering/redundancy/transaction costs/coverage/zero-pick controls unchanged. No factor/threshold/window added.
- UNKNOWN remains UNKNOWN; no historical Shadow fabricated.

### R01-R08 / I01-I07 impact
- No experiment/contrast changed. R01-R08/I01-I07 remain frozen and research-only.
- R03/R06 remain DATA_QUALITY_BLOCKED where TPEx parity/PIT provenance is required.
- R08/external evidence still cannot claim cross-market neutrality; however future falsification should distinguish general TPEx exchange availability from the narrower monthly-revenue evidence path.

### Engineering / deployment
- Evidence inspection + checkpoint only. No Worker/workflow/D1/KV/source routing/Formal selection/Hybrid WATCH/monitoring/notification change and no Production deployment.
- No Class B/C change attempted.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. Check for a newly completed later Formal scan. Never count intraday `monitoredCount=0` as a completed daily zero-pick.
3. If a trusted later scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` remains research-only on Formal SELECTED names.
4. Otherwise continue TPEx parity/PIT without re-running route, health/mirror, or general official-market availability checks. Audit remaining capture-time evidence classes for 2026-09-21/22 specifically for the **monthly-revenue research path**: after-market scan logs near the Shadow writes, regression/deploy diagnostics that printed research dashboard/provider summaries, scan response payloads, or committed/exported plaintext research snapshots.
5. Keep `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` unless durable row/provider evidence distinguishes H1/H2/H3. Broad TPEx exchange availability is now proven for 2026-09-22, but monthly-revenue provider success remains UNKNOWN. Do not use today's provider data as historical substitute.
6. If remaining durable evidence classes are exhausted with no discriminator, draft a **Class B proposal only** for future row-level observability: minimum research-only fields (`scanDate`, symbol, persisted `sourceMarket`, revenue provider/status/sourceDate/capturedAt/pointInTimeEligible, capture/runtime version), admin-authenticated read-only access, no formal consumer, bounded rows, UNKNOWN preserved. Do not merge/deploy without owner approval.
7. Continue R03/R06 persisted Top5/`未分類` frequency only from durable prospective rows; structural membership and semantic classification remain separate; no repair/re-sort/de-dup/raw-tie inference.
8. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.
9. Do not implement workflow/version logging, validator/helper, shared calendar/cache/date-resolution or source-routing changes on main without the applicable Class B decision.
