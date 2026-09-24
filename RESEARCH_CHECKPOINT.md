# Research Checkpoint

Checkpoint sequence: B-100.
Updated: 2026-09-24 11:11 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Detailed B-01..B-99 evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**. No autonomous A/B, ranking, thresholds, Top6/3+3/3+3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- GitHub/runtime evidence overrides chat memory. Production readback overrides repository/version strings.

## Durable retained state through B-99
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

## B-100 — TPEx zero-coverage mechanism narrowed; existing summary cannot distinguish root cause
### Fresh evidence
- Re-read governance, worklist and B-99 checkpoint first. Latest main research commit before this write was B-99 `54e52d36d6dfe69a510af634ac63f9a79a2ffc55`; no newer A/B cursor appeared. Immediately before write, checkpoint blob SHA was `01608d1656bf1847ab7100a10bc1216b5d1e4b4c`.
- Audited `research/cross_market_evidence_v8_7_11.js` rather than inferring from the B-99 aggregate. V8.7.11 does fetch TWSE and TPEx monthly-revenue providers independently, builds separate symbol maps, then defines each evidence row's `sourceMarket` from the merged revenue match only.
- The merge semantics are exact and important: TWSE-only symbol match => `sourceMarket=TWSE`; TPEx-only match => `sourceMarket=TPEX`; both => `AMBIGUOUS`; neither with both providers AVAILABLE => `MISSING_FOR_SYMBOL` + `sourceMarket=UNKNOWN`; provider failure => `UNKNOWN_PROVIDER_UNAVAILABLE` + `sourceMarket=UNKNOWN`.
- Therefore `byMarket.TPEX=0` does **not** by itself prove there were no OTC candidates. It can also arise if archived OTC symbols failed to match the TPEx monthly-revenue map, or if the TPEx provider was unavailable. Conversely, a successfully persisted TPEx match would necessarily appear as TPEX because `persistResearchExternalEvidence` stores the row JSON including `sourceMarket`; there is no later summary-time remapping.
- The persisted summary endpoint/query only returns aggregates (`total`, `dates`, `byMarket`, revenue counts, etc.). It reads all `evidence_json` rows internally but does not expose row-level symbols, per-row revenue status, or provider status. Thus the existing durable read-only dashboard output cannot distinguish the three B-99 hypotheses at row level.
- Audited the V8.7.11 deploy patch: it explicitly swaps the collector to `collectResearchExternalEvidenceV8711`, coverage to V8711, and summary to `readResearchExternalEvidenceSummaryV8711`; so the cross-market collector is not merely dead helper source in the intended deployed build chain.
- Audited current workflow readback: deployment verification prints only the same aggregate `externalEvidence` fields (`byMarket`, TWSE/TPEx revenue counts, SBL counts). It does not emit providers or row-level evidence. No existing workflow artifact from the latest scheduled health run exposes those rows; that run had zero artifacts.

### Interpretation / falsification
- Falsified the simplistic hypothesis `TPEX=0 => archived cohort contained no TPEx candidates`. The implementation does not classify market from the archive candidate itself; it infers market from current monthly-revenue symbol membership. Candidate-market absence therefore remains only one possible explanation.
- Also falsified a different concern: there is no evidence that summary aggregation itself silently converts persisted TPEX rows to TWSE/UNKNOWN. It counts persisted `sourceMarket` literally. If a row was persisted as TPEX, the summary would count it.
- Root cause remains `UNKNOWN` because current durable read-only surfaces omit exactly the discriminating fields: candidate symbol list joined to per-row `sourceMarket`, `revenue.status`, `revenue.sourceMarket`, and provider statuses for the archived dates.
- This is a market-source-bias issue, not evidence that TPEx stocks underperform or fail selection. No research outcome may treat TPEX=0 as BAD/0 or as a negative TPEx factor.

### Bias / governance controls
- Market-source bias: active and now more precisely localized to classification/evidence coverage, not trading outcome.
- Selection bias: do not compare TWSE 53 vs TPEx 0 performance because the TPEx denominator/classification is unresolved.
- Look-ahead/PIT: monthly-revenue evidence remains CURRENT_SNAPSHOT_ONLY and cannot be used to reconstruct historical first-known vintage; no historical evidence rows were fabricated.
- Data snooping / Factor Zoo / overfit / date clustering / redundancy / transaction costs / zero-pick controls unchanged. No threshold or factor was added.
- Coverage semantics: UNKNOWN rows stay UNKNOWN; do not infer that the 9 UNKNOWN rows are TPEx without row-level proof.

### R01-R08 / I01-I07 impact
- No experiment or contrast definition changed. R01-R08/I01-I07 remain frozen and research-only.
- R03/R06 readiness remains DATA_QUALITY_BLOCKED; this audit does not upgrade Top5 provenance or TPEx parity.
- R08 and external-evidence studies must not claim cross-market neutrality while persisted TPEx coverage is unresolved.

### Engineering / deployment
- Evidence inspection + checkpoint only. No Worker, workflow, D1/KV schema, source routing, Formal selection, Hybrid WATCH, monitoring, notification, or Production deployment changed.
- A row-level read-only research endpoint/log would be research observability in intent, but because it touches deployed Worker/workflow/shared D1 access it must be classified before implementation; do not add it on main automatically under the current deployment coupling.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write; merge a newer A/B cursor if present.
2. Wait for a completed later Formal scan before updating zero-pick coverage. Never count intraday `monitoredCount=0` as a completed daily zero-pick.
3. If a later trusted scan has >=1 Formal plan, immediately restore funnel priority: verify execution-recorder target-date coverage and 500-row non-truncation before signal interpretation; same-date `HUMAN_MOMENTUM_SHADOW` stays research-only on Formal SELECTED names.
4. Otherwise continue TPEx parity/PIT from the narrowed root-cause question. Seek existing durable evidence that exposes, for 2026-09-21/22, either (a) archived candidate symbols/market classification, (b) per-row `trade_research_external_evidence.evidence_json`, or (c) provider status captured at persistence time. Prefer existing deploy logs/artifacts/endpoints; do not reconstruct with today's provider data.
5. Specifically test whether any existing `/api/research/*` route already returns raw external-evidence rows or provider statuses even though the dashboard summary does not. If none exists, record `TPEX_ZERO_ROOT_CAUSE=UNKNOWN` and treat a new row-level observability surface as a separately classified engineering proposal rather than silently changing main.
6. Keep the three hypotheses distinct: H1=no TPEx candidate in archived cohort; H2=TPEx candidate(s) existed but symbol did not match TPEx monthly-revenue map and became UNKNOWN; H3=TPEx provider unavailable/fetch failed at capture. Do not collapse H2/H3 into H1.
7. Continue R03/R06 persisted Top5/`未分類` frequency only from durable prospective rows; structural membership and semantic classification remain separate; no repair/re-sort/de-dup/raw-tie inference.
8. Keep `CURRENT_DAY_ROW_ORIGIN(2026-09-18)=UNKNOWN`; do not retroactively upgrade B-73/B-74 pairs.
9. Do not implement workflow/version logging, validator/helper, shared calendar/cache/date-resolution or source-routing changes on main without the applicable Class B decision.
