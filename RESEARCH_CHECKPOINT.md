# Research Checkpoint

Checkpoint sequence: B-72.
Updated: 2026-09-23 21:56 Asia/Taipei.

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
- No newer trusted Production plan readback was available through B-72; live plan status remains UNKNOWN rather than assumed zero.

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
- Diagnostic branch tests remain `SOURCE_WRITTEN_NOT_EXECUTED`; do not upgrade to PASS without exact-source execution.

## B-70/B-71 retained — R03/R06 sequence/readiness audit
- Existing `researchRegimePersistenceFromDays()` first removes UNKNOWN regime rows, then sorts remaining rows and computes adjacency. `readResearchRegimePersistence()` silently drops malformed `market_json`. Existing aggregate therefore can bridge across missing/malformed dates and is not a completeness denominator.
- `recordTradeJournalDay()` source-proves zero-pick formal dates are written to `v8_trade_journal_days`; V8.7.0 source-proves `trade_research_days` is also written once per successful journal-day path regardless of selected count. Per-date runtime persistence still requires trusted readback.
- `trade_research_days.market_json` is NOT NULL, but `buildResearchMarketContext()` defaults `regime="MIXED"`; unavailable regime inputs therefore do not naturally produce `UNKNOWN`. Stored MIXED alone is not proof of a genuinely mixed regime.
- `v8_trade_journal_days` is the primary expected prospective formal-date source for readiness. It is independent of `trade_research_days`, though both can share a writer failure mechanism.

## NEW B-72 — exact R03/R06 field-level readiness semantics
### Regime input completeness is provable from immutable `market_json`
- Source audit of V8.7.0 proves the regime algorithm uses exactly two inputs: finite `marketReturn20` and finite `breadth20`, where `breadth20 = aboveMa20 / featureRows.length * 100` when featureRows is non-empty.
- The persisted market object stores `marketReturn20` and `aboveMa20Pct`; `aboveMa20Pct` is the persisted rounded form of the same breadth20 quantity used by the regime classifier. Therefore field availability can be checked from the immutable row without recomputing from present-day market data.
- Freeze readiness rule: `regimeInputCompleteness=PROVEN_COMPLETE` only when both persisted `marketReturn20` and `aboveMa20Pct` are finite numbers. Otherwise `UNKNOWN`. A stored regime label never overrides this rule.
- Rounding of `aboveMa20Pct` does not affect the availability/readiness test; this helper must not recompute or challenge the existing regime label.

### Top5 sector computability is structural, not a score-quality claim
- V8.7.0 persists `topSectors` from scan-time `sectorStats`, sorted by the existing sector score and capped at 20. Each entry includes rank, industry, score, breadth, avgChange and amountVs20DayAverage.
- Existing R06 persistence logic uses only the first five non-empty `industry` strings; it does not require sector score/breadth/amount to be finite at read time.
- Freeze readiness rule: `top5SectorComputable=YES` only when `topSectors` is an array whose first five usable entries contain five unique non-empty industry names. `NO` when a parseable array exists but fewer than five usable unique industries are present. `UNKNOWN` when the field is absent/not an array or the enclosing `market_json` is malformed/missing.
- Do not coerce missing industry to `未分類`, do not use current sector metadata, and do not infer five sectors from fewer stored entries. This is PIT-safe and prevents a partial Top-N list from masquerading as Top5 evidence.

### Expected-date eligibility predicate narrowed
- V8.5 source shows normal `runAfterMarketScanCore()` calls `recordTradeJournalDay()` only on the non-dry-run path after a scan has produced its `stocks`/diagnostics result; zero selections are explicitly recorded as `今日0檔，維持現金`.
- The admin backfill route can also create/update the same journal row, but only from `LAST_SCAN_KEY` when `latest.dryRun !== true` and a `scanDate` exists. Thus backfilled rows still represent a persisted formal non-dry-run scan artifact rather than a research reconstruction.
- For R03/R06 prospective readiness, freeze denominator eligibility to `scan_date >= 2026-09-21` rows present in `v8_trade_journal_days`; do not filter by `selected_count>0`, status wording, regime label, or research-row presence. A journal row is an expected formal date; missing research-day row is itself the coverage gap.
- Historical V8.5.2 reconstruction remains outside this prospective denominator by the 2026-09-21 cutoff.

### Bias / falsification audit
- Selection bias: zero-pick dates remain in denominator; no selected-only conditioning.
- Look-ahead/PIT: readiness uses only persisted scan-time market fields; no present-day sector/market backfill.
- Market-source bias: default MIXED cannot certify regime input completeness.
- Data snooping/Factor Zoo/overfit: no new factor, experiment, threshold, window, regime rule or Top5 ranking rule.
- Date clustering: expected formal scan date remains the independent unit; adjacency may never bridge an expected-date gap.
- Transaction cost: not applicable to structural readiness.

### Engineering classification/status
- Documentation/source audit only; no Worker/schema/runtime/workflow/Formal Core/monitoring/push change; no deployment.
- The now-frozen field semantics are sufficient to implement the previously planned offline supplied-row Class A helper without changing existing runtime aggregates.

## Exact next continuation point
1. Re-read governance/worklist/checkpoint/latest main and re-check checkpoint SHA before any write.
2. If a newer trusted formal scan has >=1 plan, immediately restore primary funnel priority: establish plan date/count from trusted Production readback; verify execution-recorder target-date coverage and 500-row non-truncation before interpreting signals; then add same-date `HUMAN_MOMENTUM_SHADOW` only on formal SELECTED names.
3. Implement an **offline supplied-row Class A descriptive helper** on an isolated branch using the frozen B-72 semantics: expected journal dates vs research-day rows, market JSON parse state, regime-input completeness, Top5 computability, and adjacent-pair readiness that never bridges expected-date gaps. No runtime wiring, alpha, thresholds, or deployment.
4. Add targeted falsification fixtures for: zero-pick expected date, missing research row, malformed market_json, default MIXED with missing inputs, valid MIXED with complete inputs, partial (<5) topSectors, duplicate sector names, and a missing middle expected date. Keep tests `SOURCE_WRITTEN_NOT_EXECUTED` unless exact-source execution becomes available.
5. Re-check main checkpoint SHA before any durable write; if another A/B lane advanced it, merge that newer continuation instead of overwriting.
6. Keep B-62 proposal-only; do not repeat listing-venue discovery. B-67/B-68 semantics remain frozen.
7. Signal != fill; `REDUCED_CONFIRMED` requires trusted actual reduced shares.
