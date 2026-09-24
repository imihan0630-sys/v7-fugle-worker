# Research Checkpoint

Checkpoint sequence: B-102.
Updated: 2026-09-24 12:12 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-101 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-101
- Latest trusted owner-approved architecture remains 3+3+3: `FORMAL_GENERAL`, `FORMAL_THOUSAND`, `HYBRID_THOUSAND_SHADOW`, each ring-fenced NT$200,000; Hybrid is Shadow-only and cannot silently become Formal BUY eligibility.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only. Signal observation != brokerage fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
- B-73..B-75 sequence-readiness helper remains SOURCE_WRITTEN_NOT_EXECUTED; journal adjacency != exchange-session adjacency; no historical calendar/Shadow backfill.
- Top5 provenance rules remain frozen: set-membership and ordering are separate; exact raw-score ties are UNKNOWN; `未分類` is structurally non-empty but semantically coarse; no repair/re-sort/de-dup/backfill.
- `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN` because day rows are UPSERT-able and lack immutable origin provenance.
- Hybrid WATCH definitions changed materially across V8.9.3 -> V8.9.4 -> V8.9.5. These are Class-C signal/monitoring semantics even though the pool is named Shadow. Any performance cohort must be version-stratified.
- 2026-09-22 and 2026-09-23 remain two adjacent observed completed Formal zero-pick dates; descriptive only. 2026-09-24 intraday monitoredCount=0 is not a completed daily zero-pick.
- V8.9.6 Production activation is durably proven: V8.9.5 at 2026-09-24T00:13:05Z and V8.9.6 at 00:13:21Z; the 16-second transition window remains UNKNOWN for observations without self-versioning.
- B-99 live research readback: Shadow total=62 across 2 archived dates; external evidence total=62, TWSE=53, TPEX=0, UNKNOWN=9; TPEx revenue available=0; shadow integrity RESEARCH_DATA_GAP; all R01-R08 readiness DATA_QUALITY_BLOCKED.
- B-100: `sourceMarket` is inferred from monthly-revenue symbol-map matching, so TPEX=0 cannot distinguish H1=no OTC candidates, H2=OTC candidate(s) unmatched -> UNKNOWN, H3=TPEx provider unavailable/fetch failed.
- B-101: no existing durable `/api/research/*` raw-row surface was found to expose `evidence_json`, per-row provider status or archived candidate market classification. `TPEX_ZERO_ROOT_CAUSE=UNKNOWN`; no current-provider reconstruction is permitted.

## B-102 — Non-route evidence audit: scheduled Actions/mirror do not resolve TPEx capture-time state
### Fresh evidence
- Re-read governance, worklist and B-101 checkpoint first. Latest main research commit at run start was B-101 `d5117e997fbec1424befe526164b2ebe3485cb23`.
- Queried GitHub Actions after the B-101 write time; there were no newer workflow runs, so no later completed Formal scan exists yet to extend the zero-pick denominator or restore >=1 Formal-plan funnel priority.
- Audited scheduled Actions for 2026-09-22. A representative scheduled health run `35751075627` completed successfully but has **zero workflow artifacts**. Therefore it provides no archived row-level `sourceMarket`, revenue provider status, or `evidence_json` payload that can distinguish H1/H2/H3.
- That scheduled run points at mirror commit `895d07a2f076ae911ea27d3c6982dd536277247b`. The commit changed only encrypted plan mirror files (`external-mirror/history/<sha>.enc.json` and `external-mirror/latest.enc.json`) using AES-256-GCM ciphertext. The visible commit diff contains no plaintext candidate symbols, market classification, TPEx provider status, or external-evidence row payload.
- The encrypted plan mirror is not treated as proof of market/source state. No decryption secret was requested or inferred, and no secret-bearing workflow path was modified.

### Interpretation / falsification
- The first non-route evidence path tested after B-101 is negative: the inspected scheduled health run/artifact path and its visible encrypted mirror do **not** resolve `TPEX_ZERO_ROOT_CAUSE` for the prospective 2026-09-21/22 cohort.
- H1/H2/H3 remain live alternatives. TPEX=0 still cannot be interpreted as absence of OTC candidates.
- The existence of an encrypted plan mirror does not justify assuming its plaintext would contain research external-evidence provenance; that is UNKNOWN unless a durable authorized capture-time export proves it.
- No newer completed Formal scan exists in Actions after B-101, so 2026-09-24 remains outside the daily zero-pick denominator at this checkpoint.

### Bias / governance controls
- Market-source bias remains unresolved; TWSE-vs-TPEx performance comparisons remain invalid.
- Selection bias: aggregate 53/0/9 remains coverage telemetry only.
- Look-ahead/PIT: no current provider data was used to relabel historical rows; encrypted payload was not guessed/decrypted.
- Data snooping/Factor Zoo/overfit/date clustering/redundancy/transaction costs/coverage/zero-pick controls unchanged. No factor/threshold/window added.
- UNKNOWN remains UNKNOWN; no historical Shadow was fabricated.

### R01-R08 / I01-I07 impact
- No experiment or contrast changed. R01-R08/I01-I07 remain frozen and research-only.
- R03/R06 remain DATA_QUALITY_BLOCKED where TPEx parity/PIT provenance is required.
- R08/external-evidence cannot claim cross-market neutrality from the current persisted cohort.

### Engineering / deployment
- Evidence inspection + checkpoint only. No Worker/workflow/D1/KV/source routing/Formal selection/Hybrid WATCH/monitoring/notification change and no Production deployment.
- No Class B/C change attempted.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. Check for a newly completed later Formal scan. Never count intraday `monitoredCount=0` as a completed daily zero-pick.
3. If a trusted later scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` remains research-only on Formal SELECTED names.
4. Otherwise continue TPEx parity/PIT without re-running route or the inspected health-artifact/mirror path. Audit other existing capture-time evidence classes for 2026-09-21/22: after-market scan workflow logs, regression/deploy diagnostic logs that may print research dashboard payloads, scan response payloads, or committed/exported plaintext research snapshots. Require capture-time provenance.
5. Keep `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` unless durable evidence distinguishes H1, H2 or H3. Do not use today's provider data as a historical substitute.
6. If remaining durable evidence classes are exhausted with no discriminator, draft a **Class B proposal only** for future row-level observability: minimum research-only fields (`scanDate`, symbol, persisted `sourceMarket`, revenue provider/status/sourceDate/capturedAt/pointInTimeEligible, capture/runtime version), admin-authenticated read-only access, no formal consumer, bounded rows, UNKNOWN preserved. Do not merge/deploy without owner approval.
7. Continue R03/R06 persisted Top5/`未分類` frequency only from durable prospective rows; structural membership and semantic classification remain separate; no repair/re-sort/de-dup/raw-tie inference.
8. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.
9. Do not implement workflow/version logging, validator/helper, shared calendar/cache/date-resolution or source-routing changes on main without the applicable Class B decision.
