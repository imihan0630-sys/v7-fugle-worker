# Research Checkpoint

Checkpoint sequence: B-71.
Updated: 2026-09-23 21:14 Asia/Taipei.

> Canonical cursor for both A/B research schedules. Earlier detailed evidence remains durable in Git history. Do not re-run completed work; continue from Exact next continuation point.

## Governance / immutable boundary
- Formal Core **LOCKED**: no autonomous A/B, ranking, threshold, Top6/3+3, capital, entry/add/reduce/sell/stop, monitoring or push changes.
- R01-R08 and I01-I07 frozen; no R09/I08. Prospective Shadow starts 2026-09-21; no fabricated historical Shadow. Missing evidence = UNKNOWN, never BAD/0.
- Independent scan/signal date is the evidence unit. Continue selection-bias, look-ahead, data-snooping, market-source-bias, Factor-Zoo, overfit, coverage/zero-pick, transaction-cost, date-cluster and redundancy checks.
- GitHub/runtime evidence overrides chat memory.

## Production/research baseline retained
- Verified production/research infrastructure baseline: V8.8.2 `8.8.2-zero-selection-push-guard`, schema `execution-shadow-v2`; pre-change backup V8.8.1.
- Last verified prospective Shadow evidence remains 31 rows / one prospective scan date / zero mature D1/D3/D5/D10/D20 outcomes unless newer trusted read proves otherwise.
- 2026-09-22 scheduled health positively verified selectedCount=0, planCount=0, signalCount=0; preserve as formal zero-pick date, not Execution Alpha failure. `SHADOW_SCAN_STATUS(2026-09-22)=UNKNOWN`.
- No newer trusted Production plan readback was available through B-71; live plan status remains UNKNOWN rather than assumed zero.

## Primary research lane retained
- Root funnel: `universe -> base/liquidity -> A/B formation -> quality/RR -> SELECTED -> BUY-observed -> confirmed fill -> ADD/FULL -> REDUCE-observed -> confirmed reduced shares -> restoration`.
- 2026-09-16: 1,873 scanned -> 3 selected.
- 2026-09-17: 1,875 scanned -> 2 selected; 513 baseEligible; 9 rrEligible; 1,124 liquidity rejects, 335 no A/B formation, 71 RR<2.
- Current Shadow excludes the largest liquidity-reject gate because those rows fail basePassed; evidence-coverage gap, not proof gate is wrong.
- Signal observation != brokerage fill. Confirmed fills/reduced shares remain UNKNOWN absent trusted reconciliation.

## Retained readiness/control findings through B-69
- Legacy counterfactual null horizons conflate provenance failures with immature outcomes; missing remains UNKNOWN.
- R01 uses frozen priorHigh20 + future 3-close hold/fail; R05 next-day Overnight/Intraday; R07/R08 same-date medians of residualSectorRs20 and volumeTodayVsPrev5. No new thresholds/windows/composites.
- `readShadowCounterfactualResearch()` may read up to 5000 Shadow rows but exposes only last 80 row-level recentOutcomes; never treat 80 as full archive.
- B-62 `PRE_BASE_LIQUIDITY_CONTROL` remains Class B proposal-only; current Shadow cannot falsify the largest liquidity-reject gate.
- BROAD_CONTROL is deterministic eligible-survivor control, max 6 GENERAL + 6 THOUSAND, not full-universe random control. Durable pool + scan-time industry exist; immutable listing venue remains UNKNOWN. Branch `research/b67-broad-control-concentration` stays branch-only; duplicate scan_date+symbol is a data-quality anomaly excluded from effective denominators.
- R03/R06 sequence structure is the clean pre-maturity lane; all directional alpha claims remain gated by their frozen maturity requirements.
- Diagnostic branch tests remain `SOURCE_WRITTEN_NOT_EXECUTED`; do not upgrade to PASS without exact-source execution.

## B-70 retained — R03/R06 reader-path defect
- `researchRegimePersistenceFromDays(days)` filters to rows with a non-UNKNOWN regime before sorting/adjacency; known-regime-only conditioning can bridge across an intervening missing/UNKNOWN/malformed date.
- `readResearchRegimePersistence()` silently drops malformed `market_json` parse failures. Existing aggregate is descriptive only over usable known-regime rows; it is not a readiness denominator.
- Readiness must preserve date states and must not bridge adjacent pairs across missing/UNKNOWN/malformed expected dates.

## NEW B-71 — R03/R06 writer path and expected-date source audit
### Source-proven writer semantics
- V8.5 `recordTradeJournalDay(scanDate,stocks,...)` normalizes `stocks` to `list=[]` when empty, **always inserts/upserts `v8_trade_journal_days` before iterating plans**, deletes same-date plan rows, and verifies `selected_count === plan row count`. Therefore a successful Production zero-pick scan is designed to persist a formal journal-day row with `selected_count=0`; zero picks are not omitted merely because the plan list is empty.
- `runAfterMarketScanCore()` calls `recordTradeJournalDay(marketDate,stocks,...)` whenever `!dryRun`, with status explicitly set to `"今日0檔，維持現金"` when `stocks.length===0`. This call is outside any `stocks.length>0` guard. Thus the zero-pick formal-date writer path is source-proven.
- V8.7.0 extended that same `recordTradeJournalDay()` function: after the per-stock research-snapshot loop, it **always inserts/upserts one `trade_research_days` row** using the same `scanDate`, regardless of `list.length`. Therefore `ZERO_PICK_DATE_INCLUDED_IN_RESEARCH_DAY_SEQUENCE` is now **SOURCE_PROVEN_BY_WRITER_PATH = YES**, subject to the journal write actually succeeding at runtime.
- The research-day write occurs inside the same try/catch as the journal-day write. If any write/verification in that function fails, the function returns `stored:false`; source proof does not equal runtime proof for a particular date. Runtime row existence for 2026-09-22 remains unverified unless a trusted D1/readback is obtained.

### `market_json` semantics — important negative finding
- `trade_research_days.market_json` is written as `JSON.stringify(researchMarket)`, where `researchMarket = diagnostics.researchMarketContext || first researchSnapshot.market || {}`. The column is NOT NULL, so the writer does not intentionally omit the row because regime is unavailable.
- `buildResearchMarketContext()` initializes `regime="MIXED"` and only changes it when both marketReturn20 and breadth20 are finite enough for the regime rules. It does **not** emit `regime="UNKNOWN"` when those regime inputs are unavailable.
- Therefore the earlier readiness state `ROW_AVAILABLE_UNKNOWN_REGIME` is not normally produced by the current writer. More importantly, a persisted `MIXED` value can mean either a genuine mixed regime **or fallback/default classification when regime inputs were insufficient**. This is a provenance ambiguity, not evidence that the market was genuinely MIXED.
- Do not reinterpret legacy/current `MIXED` rows as UNKNOWN without the original scan-time inputs. Do not backfill. For readiness, distinguish `ROW_AVAILABLE_REGIME_LABEL` from `REGIME_INPUT_PROVEN_COMPLETE`; if required regime inputs cannot be proven finite from the immutable `market_json`, classification quality is UNKNOWN.

### Independent expected formal-date source
- `v8_trade_journal_days` is an already-persisted formal scan-day table and is written for zero-pick scans. It can serve as the primary expected prospective formal-date source for R03/R06 completeness checks.
- It is separate from `trade_research_days`, so a journal day with no corresponding research-day row is a measurable research coverage gap. Because both are written by the same function/try block, absence patterns may share a failure mechanism; this limits causal diagnosis but does not prevent date-completeness comparison.
- `V7_LAST_SCAN_KEY` / successful scan summary is an additional source-level formal scan artifact, but historical retention/readback coverage is not yet proven sufficient to replace `v8_trade_journal_days` as the canonical expected-date denominator.

### Safe descriptive readiness table now defined
For each prospective expected date from `v8_trade_journal_days`, report only:
- `expectedDate`
- `formalSelectedCount`
- `researchDayRowPresent`
- `marketJsonParseStatus = PARSEABLE | MALFORMED | MISSING`
- `regimeLabel` as stored, without correction/backfill
- `regimeInputCompleteness = PROVEN_COMPLETE | UNKNOWN`
- `top5SectorComputable = YES | NO | UNKNOWN`
- `adjacentPairComputable` only when this date and the immediately preceding expected formal date both have parseable rows and required fields; never bridge gaps
- observed transition/Top5-overlap counts only as descriptive counts, with no stability pass/fail threshold.

### Bias / governance audit
- Selection bias: zero-pick dates are retained in the expected-date denominator; no selected-only conditioning.
- Look-ahead: expected dates come from prospective formal journal rows; no present-day metadata backfill.
- Data snooping / Factor Zoo / overfit: no new factor, experiment, threshold, regime definition, Top5 rule or window.
- Coverage: source proves zero-pick writer inclusion, but per-date runtime persistence remains UNKNOWN without trusted readback.
- Market-source bias: default `MIXED` under insufficient inputs is now explicitly treated as provenance ambiguity, not a valid market-state observation.
- Date clustering: independent formal scan date remains the unit.
- Transaction cost: not applicable to structural readiness.

### Engineering status
- Documentation/checkpoint audit only. No Worker/schema/runtime/workflow/Formal Core/monitoring/push change. No deployment.
- Existing aggregate must not be modified in place merely to fix readiness semantics; shared runtime changes are Class B proposal-first. An offline supplied-row Class A helper remains the preferred next engineering shape if needed.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Continue R03/R06 readiness by source-auditing the exact fields inside `buildResearchMarketContext()` needed to prove `regimeInputCompleteness` and `top5SectorComputable`; define field-level UNKNOWN semantics without changing the existing regime algorithm.
4. Source-audit whether `v8_trade_journal_days` can contain non-success/partial scan rows or only completed formal scan days. Freeze the exact eligibility predicate for the expected-date denominator; do not count failed scan attempts as formal research dates.
5. If 3-4 are proven, implement only an **offline supplied-row Class A descriptive helper** on an isolated branch: expected journal dates vs research-day rows, parse state, regime-input completeness, Top5 computability, and non-bridging adjacent-pair readiness. No runtime wiring, alpha, thresholds, or deployment.
6. Keep B-62 proposal-only; do not repeat listing-venue discovery. B-67/B-68 semantics remain frozen.
7. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
