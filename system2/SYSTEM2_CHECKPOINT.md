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
