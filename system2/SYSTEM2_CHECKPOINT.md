# System 2 Checkpoint

Updated: 2026-09-26 Asia/Taipei
Status: P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS

## Completed

- System 2 mission defined.
- Shared knowledge governance defined.
- Shared research master map defined.
- System 1 <-> System 2 bridge defined.
- Initial architecture, factor inventory, strategy catalog and performance spec defined.
- V8 Formal Core remains untouched.
- System 1 centralized Shared Knowledge read routing is active on main.
- Initial System 2 data-source feasibility matrix completed.
- Research-only storage schema designed with isolated `s2_` namespace.
- First three Shadow strategy hypotheses preregistered before outcome tuning.
- ChatGPT Project created, instructions saved, and this design chat moved into the new Project; migration status recorded in `system2/CHATGPT_PROJECT_MIGRATION.md`.

## Current design decisions

- Design gap explicitly opened: System 2 has referenced TECHNICAL / KLINE_PATTERN（技術面／K線型態） across strategies, and Shared Knowledge already contains active K-line/pattern research, but a dedicated System 2 TECHNICAL_STRUCTURE_ENGINE（技術結構引擎） has not yet been fully specified. Before freezing strategy identity cards, define candlestick signals, chart-pattern topology, support/resistance, trend/volatility structure, Fibonacci confluence, pattern lifecycle/confirmation/failure, and strategy-specific consumption rules. This is a shared module, not automatically a standalone strategy.

- VALUE_REVERSION（價值回歸策略）core logic owner-approved as research-only: distinguish mispricing from structural deterioration, require discount reason + catalyst/repair path + valuation context + reversal confirmation, prohibit blind averaging down, and retain VALUE_THESIS_INVALIDATED（價值投資邏輯失效）. Promotion remains blocked pending PIT/Shadow/OOS evidence versus simple low-valuation/rebound baselines.

- EVENT_DRIVEN（事件驅動策略）core logic owner-approved: verified source/timing, event-to-industry/company transmission, company exposure, surprise/price-in assessment, half-life/expiry/invalidation, event-to-structural-trend transition, and direct integration with POSITION_MONITOR（持股監控）. Exact scoring/thresholds remain unfrozen.

- Owner added CONTRACT_LIABILITY（合約負債） as a required fundamental research dimension. System 2 will study QoQ/YoY trend, acceleration and normalized ratios, with industry-applicability, margin/cash-flow/contract-quality guards and PIT timing. Rising contract liabilities are NOT automatically bullish. Current repository audit found no normalized contract-liability field, so source extension + PIT validation is required before scoring.

- INDUSTRY_TREND（產業趨勢策略）core logic owner-approved: cycle-stage first, company-level earnings transmission, leader-vs-high-beta-beneficiary comparison, technical timing rather than thesis substitution, cycle-peak warning, and explicit industry-thesis invalidation. Exact thresholds remain unfrozen.

- Owner-facing terminology rule: whenever English professional/financial/system terms are used, append the Traditional Chinese meaning on first use; avoid unexplained English jargon/acronyms.

- New owner-suggested hypothesis recorded: when a sector/industry thesis is bullish, test whether sector leaders deserve first-pass selection priority because of stronger fundamentals/industry position and potential institutional preference. This is NOT yet a rule; leader definition and leader-vs-follower performance must be falsified with PIT/Shadow/OOS evidence, including overvaluation/crowding/early-cycle follower counterexamples.

- Owner approval confirmed for the full symmetric position-management architecture, including ADD_ON_STRENGTH, ADD_ON_PULLBACK, RE_ADD_AFTER_REDUCE, ADD_ON_NEW_INFORMATION, dedicated POSITION_MONITOR, recovery conditions after every reduction, and anti-whipsaw hysteresis. Exact thresholds remain unfrozen pending Shadow validation.

- Exact re-add/sizing thresholds are not frozen and require prospective Shadow/falsification/cost validation.

- Re-add is evaluated from current recovery evidence, thesis and reward/risk; prior reduce price or average cost cannot by itself label a valid restoration as chasing.

- Exposure control must be symmetric: actual exposure is compared with desired exposure, supporting HOLD / REDUCE / EXIT as well as ADD / RE-ADD / RESTORE.

- Position-management architecture approved: actual holdings are always monitored outside candidate/active-entry caps.

- Candidate lifecycle approved: the 12-symbol pool persists across days; every post-close run revalidates each existing name, retains it while at least one strategy thesis still has observation value, removes it when the surviving thesis is invalidated/turns materially bearish, and fills vacancies with newly qualified names. State-change reasons must be frozen.

- Capacity rule approved: global System 2 candidate/watch pool max 12 unique symbols; each strategy max 3 ACTIVE_INTRADAY_MONITOR symbols; no forced filling; multi-strategy overlap counts once globally but remains strategy-specific for monitoring/performance.

- Same overall website/platform can host multiple isolated engines.
- System 2 is a multi-strategy discovery/selection platform, not a relaxed clone of V8.
- Market/global regime is an upper-layer context.
- Strategy weights/floors are context-specific and not fixed yet.
- Daily outputs must be frozen and performance-tracked.
- Shared knowledge is reusable; system-specific decision logic remains isolated.
- System 2 decision authority is fully independent: System 1/V8 cannot approve, reject or gate System 2 selection, entry, exit, monitoring or notifications.

## Next tasks

1. ✅ Inventory existing research into shared domain tags without relocating history — completed in `shared-knowledge/SHARED_RESEARCH_INVENTORY.md`.
2. ✅ Audit Tier A/B source fields for exact machine-readable contracts and historical PIT availability — `system2/SYSTEM2_SOURCE_CONTRACT_AUDIT.md`.
3. ✅ Define factor-engine TypeScript interfaces and normalization/UNKNOWN contracts — `system2/SYSTEM2_FACTOR_ENGINE_CONTRACT.md` + `system2/src/contracts.ts`.
4. ✅ Define market-regime V0 inputs using Tier A / prospectively derivable fields only — `system2/SYSTEM2_MARKET_REGIME_V0.md`.
5. ✅ Define execution simulator assumptions for Taiwan fees/tax/slippage/gaps/limits — `system2/SYSTEM2_EXECUTION_SIMULATOR_SPEC.md`.
6. ✅ Implement first research-only factor snapshot + frozen decision archive + isolated `s2_` schema prototype. Node/SQLite verification recorded in `system2/SYSTEM2_P1_IMPLEMENTATION_VERIFICATION.md`.
7. ⏳ Start prospective Shadow accumulation after an isolated physical System 2 persistence/capture path is provisioned; do not attach the prototype schema to V8 production D1 by default.

## Current boundary

Research/design/code prototype is not blocked. Prospective always-on Shadow accumulation now requires an isolated physical persistence + scheduled capture path. Preferred architecture is a separate System 2 D1/database binding. No production-shared storage change is authorized or needed for the completed P1 prototype.
