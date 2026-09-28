# Shared Research Master Map

Updated: 2026-09-28 Asia/Taipei
Status: CANONICAL_SHARED_INDEX
Scope: Cross-system research knowledge
Formal Core impact: NONE

## Purpose

Central cross-project entrypoint for reusable Taiwan-equity knowledge. System 1 and System 2 read this before their own project-specific maps.

Existing detailed research remains in its current files; this map indexes it rather than relocating history.

## Domain map

1. Price / K-line / chart-pattern topology
2. Price-volume relationships
3. Trend / momentum / reversal
4. Volatility / volatility regime
5. Market microstructure / execution
6. Institutions / ownership / margin / SBL / crowding
7. Fundamentals / financial statements / monthly revenue
8. Valuation
9. Industry / sector / residual RS / breadth
10. Supply-chain / capacity / inventory / commodity transmission
11. Corporate actions / event risk / material information
12. Derivatives / futures / options / Taiwan VIX
13. Macro / cross-market / global regime transmission
14. Trading frictions / slippage / opportunity cost
15. Portfolio/capital-utilization research methodology
16. Statistical validation / PIT / Shadow / OOS / Factor Zoo / overfit
17. News/event half-life and beneficiary/victim transmission
18. Strategy-regime interaction research

## Cross-industry analysis framework（跨產業通用分析框架）

This framework is a reusable research method, **not a memory-industry-specific rule and not a new standalone domain/module**. It must be applicable to any industry/theme, including but not limited to CPO、PCB、ABF、AI Server、memory、semiconductor equipment、networking and future sectors.

Primary ownership:
- **D09** Industry / sector / breadth / rotation
- **D10** Supply-chain / capacity / inventory / commodity transmission

Required cross-domain links when relevant:
- **D07** fundamentals / earnings / margin / growth acceleration
- **D08** valuation / forward expectations
- **D13** global bellwether / cross-market transmission
- **D17** news / event half-life / beneficiary-victim propagation
- **D18** regime-dependent interpretation / strategy interaction

For every industry analysis, do not stop at naming a hot theme or describing one company. The reusable chain should examine, when data permits:

1. **Global bellwether / industry leader**
   - Identify the global or regional leader(s), their earnings calls, guidance, orders, product roadmap, pricing, utilization, inventory and market reaction.
   - Test whether the leader is actually a leading indicator for Taiwan names instead of assuming causality.

2. **Demand / supply / inventory / capacity**
   - Demand growth, end-market mix, supply constraints, utilization, capacity expansion, inventory days, lead times, backlog and pricing power.
   - Distinguish structural demand from short-lived shortage, restocking or speculative demand.

3. **Product mix → margin / earnings sensitivity**
   - Map product mix, ASP（平均售價）, shipment volume, gross margin, operating leverage and EPS sensitivity.
   - Do not treat all products inside one industry as economically equivalent.

4. **Upstream / downstream / asymmetric transmission**
   - Map the supply chain and identify which layer captures value, which layer bears cost pressure, where bottlenecks sit, and where substitution is possible.
   - Separate first-order beneficiaries from second-order or narrative-only beneficiaries.

5. **Global leader → Taiwan supply-chain lead-lag**
   - Test the timing and magnitude of transmission from global bellwethers to Taiwan sectors/stocks.
   - Include earnings/guidance surprise, overnight market reaction, Taiwan opening gap, subsequent continuation/reversal and residual strength after controlling for the broad market/sector.

6. **Fundamentals × valuation × price position**
   - Separate “good industry/company” from “good entry point”.
   - Evaluate whether strong fundamentals are already priced in, whether valuation has expanded, and whether price extension/RR makes the setup unattractive despite improving fundamentals.

7. **Regime-dependent interpretation**
   - The same evidence can have different implications under growth-dominant, inflation-dominant, liquidity-driven, shortage, overcapacity or recession-fear regimes.
   - Never reduce analysis to “good data = bullish / bad data = bearish”.

8. **Falsification / PIT / replay**
   - Record the positive mechanism, competing explanation, failure conditions, first-known timestamp, PIT eligibility, replayability, missing-data UNKNOWN semantics, transaction-cost relevance and factor redundancy.
   - A famous leader/company example is evidence only after falsification and Taiwan PIT validation; anecdotal narrative alone cannot promote maturity.

System-use rule:
- Use this framework to generate research hypotheses and cross-domain dependencies for System 1 / System 2.
- Do not hard-code any industry example into Formal Core solely because a video, analyst or single cycle appears convincing.
- Prefer reusable features and transmission relationships over one-off sector stories.

## Shared inventory

- `shared-knowledge/SHARED_RESEARCH_INVENTORY.md` is the cross-system domain/tag inventory. It points to original evidence without relocating it.
- `shared-knowledge/STOCK_MARKET_KNOWLEDGE_LEARNING_MAP.md` is the canonical 18-domain / 226-module learning curriculum and chatroom routing dashboard.
- `research/stock_market_learning_tracker_v0_1.json` is the machine-readable maturity tracker for that curriculum.
- `shared-knowledge/LEARNING_ROOM_ROUTER.md` is the mandatory public routing file every learning chat reads to know its assigned domains, modules, learning scope, progress and checkpoints.

## Existing canonical anchors

The current System 1 research corpus is the initial evidence base. Important anchors include:
- `RESEARCH_MASTER_MAP.md`
- `RESEARCH_CHECKPOINT.md`
- `DEEP_LEARNING_CHECKPOINT.md`
- `TREND_MOMENTUM_REVERSAL_RESEARCH.md`
- `VOLATILITY_REGIME_RESEARCH.md`
- `SUPPLY_CHAIN_LEAD_LAG_RESEARCH.md`
- `CORPORATE_ACTIONS_CAPITAL_SUPPLY_RESEARCH.md`
- `TRADING_FRICTIONS_RESEARCH.md`
- dedicated price-volume and pattern research/checkpoints registered by the System 1 master map
- `research/research_master_map.json`

These files are not duplicated into this folder. Their evidence remains authoritative.

## System pointers

- System 1 master: `RESEARCH_MASTER_MAP.md`
- System 1 governance: `RESEARCH_ENGINEERING_GOVERNANCE.md`
- System 2 master: `system2/SYSTEM2_MASTER.md`
- System 2 bridge: `system2/SYSTEM2_BRIDGE_FROM_V8.md`

## Shared routing rule

A new finding enters this shared map only when it is reusable market knowledge. System-specific implementation details stay in the owning system.

## Current bootstrap status

SHARED_NETWORK_VERSION = 0.1
SYSTEM1_CONNECTED = true
SYSTEM2_CONNECTED = true
HISTORICAL_RELOCATION_REQUIRED = false
FORMAL_CORE_CHANGED = false

Inventory task completed in `shared-knowledge/SHARED_RESEARCH_INVENTORY.md`.

Next task: map reusable lanes to exact machine-readable fields, missing fields, PIT availability and candidate System 2 factor IDs.

- Event/news transmission anchor: `NEWS_EVENT_TRANSMISSION_RESEARCH.md` (D17 sentiment, novelty, duplicate-event clustering, PIT semantics).
