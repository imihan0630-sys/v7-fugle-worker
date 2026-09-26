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
- ChatGPT Project UI migration handoff prepared in `system2/CHATGPT_PROJECT_MIGRATION.md`.

## Current design decisions

- Same overall website/platform can host multiple isolated engines.
- System 2 is a multi-strategy discovery/selection platform, not a relaxed clone of V8.
- Market/global regime is an upper-layer context.
- Strategy weights/floors are context-specific and not fixed yet.
- Daily outputs must be frozen and performance-tracked.
- Shared knowledge is reusable; system-specific decision logic remains isolated.

## Next tasks

1. Inventory existing research into shared domain tags without relocating history.
2. Audit Tier A/B source fields for exact machine-readable contracts and historical PIT availability.
3. Define factor-engine TypeScript interfaces and normalization/UNKNOWN contracts.
4. Define market-regime V0 inputs using Tier A data only.
5. Define execution simulator assumptions for Taiwan fees/tax/slippage/gaps/limits.
6. Implement the first research-only factor snapshot and decision archive behind an isolated System 2 path/table namespace.
7. Start prospective Shadow accumulation for the preregistered strategies only after storage and PIT checks pass.

## Blockers

No protected blocker at bootstrap.
ChatGPT Project creation/moving a chat is a UI/account action and is not performed by repository tooling.
