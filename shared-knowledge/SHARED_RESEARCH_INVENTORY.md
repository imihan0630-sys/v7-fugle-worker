# Shared Research Inventory

Updated: 2026-09-26 Asia/Taipei
Status: CANONICAL_CROSS_SYSTEM_INVENTORY V0.1
Purpose: index reusable research without relocating or duplicating the original evidence.

## Rules

- Original evidence files remain authoritative.
- This inventory is navigation + ownership tagging, not a replacement summary.
- SHARED means reusable market/research knowledge.
- SYSTEM1_IMPL means implementation/runtime details stay owned by V8.
- SYSTEM2_IMPL means future strategy/scoring/performance implementation stays owned by System 2.
- Formal Core remains LOCKED.

## Domain inventory

| Shared tag | Main evidence / checkpoint anchors | Current durable status | Reuse note |
|---|---|---|---|
| SHARED:KLINE_PATTERN | `KLINE_PATTERN_CHECKPOINT.md`, `KLINE_PATTERN_RESEARCH.md`, `research/PATTERN_*.md` | ACTIVE / multi-stage topology and lifecycle research | Reusable pattern geometry, maturity, false-break, multi-timeframe and ambiguity semantics. Do not copy V8 Formal thresholds. |
| SHARED:PRICE_VOLUME | `PRICE_VOLUME_CHECKPOINT.md`, `PRICE_VOLUME_RESEARCH.md`, `PRICE_VOLUME_EVIDENCE.md`, `PRICE_VOLUME_HYPOTHESIS_LEDGER.md` | ACTIVE / FALSIFICATION + SHADOW design | Reusable RVOL, effort-vs-result, volume dry-up, climax, same-slot normalization and interaction research. |
| SHARED:TREND_MOMENTUM_REVERSAL | `TREND_MOMENTUM_REVERSAL_CHECKPOINT.md`, `TREND_MOMENTUM_REVERSAL_RESEARCH.md` | FALSIFICATION_IN_PROGRESS | Regime-continuation/transition knowledge reusable. Momentum Gap currently negative/rejected; extreme strength has redundancy risk. |
| SHARED:VOLATILITY_REGIME | `VOLATILITY_REGIME_RESEARCH.md` | RESEARCH / evidence-gated | Reusable realized-vol/regime logic; maintain PIT continuity constraints. |
| SHARED:MARKET_BREADTH_ROTATION | `MARKET_BREADTH_ROTATION_CHECKPOINT.md`, `MARKET_BREADTH_ROTATION_RESEARCH.md` | CONCEPT_COMPLETE / EVIDENCE_PENDING | Strong System 2 input for market regime, participation, sector rotation and leadership lifecycle. Existing V8 sector hard-gate values remain SYSTEM1_IMPL. |
| SHARED:MICROSTRUCTURE | `MICROSTRUCTURE_CHECKPOINT.md`, `MICROSTRUCTURE_RESEARCH.md`, `MICROSTRUCTURE_COLLECTOR_PROPOSAL.md` | CONCEPT_COMPLETE / EVIDENCE_PENDING | Reusable spread/depth/pressure/price-response concepts; true OFI cannot be reconstructed from candles. |
| SHARED:INSTITUTIONAL_CROWDING | `INSTITUTIONAL_CROWDING_RESEARCH.md` | ACTIVE RESEARCH | Reusable actor separation, flow-vs-stock, liquidity normalization and crowding semantics. |
| SHARED:LEVERAGE_SHORTING | `LEVERAGE_SHORTING_CHECKPOINT.md`, `LEVERAGE_SHORTING_RESEARCH.md`, `LEVERAGE_SHORTING_DATA_SPEC.md` | ACTIVE / DATA SEMANTICS DEFINED | Keep margin short, securities borrowing and actual SBL short-sale concepts separate. |
| SHARED:PASSIVE_FLOW | `PASSIVE_FLOW_INDEX_REBALANCING_CHECKPOINT.md`, `PASSIVE_FLOW_INDEX_REBALANCING_RESEARCH.md` | CONCEPT_COMPLETE / SOURCE_MAP_COMPLETE / EVIDENCE_BUILD_PENDING | Reusable index-event, announcement/effective-date and passive-flow contamination research. |
| SHARED:FUNDAMENTALS | `FUNDAMENTAL_INFORMATION_DYNAMICS_CHECKPOINT.md`, `FUNDAMENTAL_INFORMATION_DYNAMICS_RESEARCH.md`, `INFORMATION_DISCRETENESS_SHADOW_SPEC.md` | ACTIVE / PIT-sensitive | Reusable information timing, monthly revenue, earnings/margin dynamics and first-known semantics. |
| SHARED:VALUATION | V8 official valuation data path + System 2 source matrix; no dedicated mature lane yet | GAP / RESEARCH_REQUIRED | PE/PB current data experience is reusable; historical percentile, forward valuation and peer-normalized PIT research need dedicated work. |
| SHARED:INDUSTRY_SECTOR | `MARKET_BREADTH_ROTATION_*.md`, `SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md`, sector/Residual-RS work in research registry | ACTIVE / mixed maturity | Reusable industry cycle, sector RS, breadth and classification-risk knowledge. |
| SHARED:SUPPLY_CHAIN | `SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md` | PARTIAL / SOURCE_ACCESS_BLOCKED in some lanes | Reusable upstream/downstream lead-lag, capacity, inventory and price-transmission framework. |
| SHARED:CORPORATE_ACTIONS | `CORPORATE_ACTIONS_CAPITAL_SUPPLY_CHECKPOINT.md`, `CORPORATE_ACTIONS_CAPITAL_SUPPLY_RESEARCH.md`, related `CORPORATE_ACTION_*.md` and research JSON receipts | EXTENSIVE / evidence-specific | Reusable denominator, vintage, contamination, event-clock and adjustment semantics. |
| SHARED:EVENT_RISK | `EVENT_RISK_CHECKPOINT.md`, `EVENT_RISK_RESEARCH.md`, `EVENT_RISK_CAPTURE_PROPOSAL.md` | ACTIVE / CAPTURE DESIGN FROZEN | Reusable gap risk, overnight information, event windows, event-time provenance and corporate-action firewall. |
| SHARED:DERIVATIVES | `DERIVATIVES_VOLATILITY_CHECKPOINT.md`, `DERIVATIVES_VOLATILITY_RESEARCH.md` | CONCEPT_COMPLETE / EVIDENCE_PENDING | Reusable PCR/VIX/basis/OI/skew/term-structure context. Treat derivatives first as market/risk context. |
| SHARED:MACRO_CROSS_MARKET | `MACRO_CROSS_MARKET_RESEARCH.md`, `research/cross_market_evidence_v8_7_11.js` | DATA_QUALITY_BLOCKED for historical durable receipts | Reusable mechanism and prospective receipt design; do not fabricate historical first-known timing. |
| SHARED:TRADING_FRICTIONS | `TRADING_FRICTIONS_CHECKPOINT.md`, `TRADING_FRICTIONS_RESEARCH.md`, `EXECUTION_ALPHA_RESEARCH.md` | CONCEPT_COMPLETE / EVIDENCE_PENDING | Reusable fees/tax/slippage/fill-vs-signal/opportunity-cost semantics. |
| SHARED:PORTFOLIO_RISK | `PORTFOLIO_RISK_CHECKPOINT.md`, `PORTFOLIO_RISK_RESEARCH.md` | CONCEPT_COMPLETE / EVIDENCE_PENDING | Reusable correlation, clustering, heat, capital-utilization and diversification research. |
| SHARED:VALIDATION | `RESEARCH_WORKLIST.md`, `research/EXPERIMENT_REGISTRY.md`, `research/FACTOR_EVIDENCE.md`, `research/research_master_map.json`, `research/RESEARCH_FIREWALL.md` | CONTINUOUS GOVERNANCE | PIT, prospective Shadow, purged holdout, date clustering, redundancy, cost and multiple-testing controls are mandatory across systems. |

## System ownership boundaries

### SYSTEM1_IMPL
Keep these under V8/System 1:
- A/B Formal definitions;
- 3+3 / Top6 behavior;
- V8 Formal ranking/thresholds;
- BUY/ADD/REDUCE/SELL/STOP;
- capital allocation;
- monitoring/push/signal state;
- Cloudflare production runtime and live storage semantics.

### SYSTEM2_IMPL
Keep these under `system2/`:
- strategy family definitions and versions;
- regime-driven strategy activation;
- factor weights/floors/interactions;
- System 2 frozen decision archive;
- simulated execution and per-strategy virtual portfolios;
- strategy performance and attribution;
- System 2 UI/API/storage.

## Priority reuse for System 2 P1/P2

Highest-priority existing shared lanes for the first System 2 prototypes:
1. MARKET_BREADTH_ROTATION -> Market Regime V0.
2. PRICE_VOLUME + KLINE_PATTERN + TREND_MOMENTUM_REVERSAL -> SHORT_MOMENTUM.
3. INSTITUTIONAL_CROWDING + LEVERAGE_SHORTING + TDCC evidence -> INSTITUTIONAL_ACCUMULATION.
4. FUNDAMENTALS + INDUSTRY_SECTOR + SUPPLY_CHAIN + VALUATION gap work -> SWING_GROWTH.
5. EVENT_RISK + MACRO_CROSS_MARKET + SUPPLY_CHAIN -> EVENT_DRIVEN and regime context.
6. TRADING_FRICTIONS + MICROSTRUCTURE -> execution simulator assumptions and later entry-quality research.

## Important negative / non-promotable findings already carried forward

- Momentum Gap: Taiwan-specific evidence negative; do not elevate merely because it is popular elsewhere.
- Extreme Absolute Strength: high redundancy risk with existing overheat/late-stage controls.
- Breadth: participation/context, not standalone direction.
- High volume: not monotonically bullish; can be continuation, disagreement, exhaustion or distribution.
- Institutional buying: not automatically informed directional demand.
- TAIEX VIX/PCR/basis/OI: context/risk information first, not direct stock-picking labels.
- Current snapshots are not historical vintages.
- UNKNOWN must never be coerced to neutral/zero.

## Next inventory task

Map each reusable lane to:
- exact machine-readable fields already available;
- exact fields missing;
- PIT availability;
- System 2 factor IDs that may consume it.

That mapping belongs in the System 2 Tier A/B source-contract audit, not by rewriting original research files.
