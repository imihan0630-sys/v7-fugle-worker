# System 2 Checkpoint

Updated: 2026-09-26 Asia/Taipei
Status: P0_BOOTSTRAP_IN_PROGRESS

## Completed

- System 2 mission defined.
- Shared knowledge governance defined.
- Shared research master map defined.
- System 1 <-> System 2 bridge defined.
- Initial architecture, factor inventory, strategy catalog and performance spec defined.
- V8 Formal Core remains untouched.

## Current design decisions

- Same overall website/platform can host multiple isolated engines.
- System 2 is a multi-strategy discovery/selection platform, not a relaxed clone of V8.
- Market/global regime is an upper-layer context.
- Strategy weights/floors are context-specific and not fixed yet.
- Daily outputs must be frozen and performance-tracked.
- Shared knowledge is reusable; system-specific decision logic remains isolated.

## Next tasks

1. Connect System 1 research read order to the Shared Master Map.
2. Inventory existing research into shared domain tags without relocating history.
3. Build System 2 data-source/field feasibility matrix.
4. Define factor-engine interfaces and PIT data contracts.
5. Pre-register the first 3 strategy prototypes for Shadow:
   - SHORT_MOMENTUM
   - SWING_GROWTH
   - INSTITUTIONAL/BLACK_HORSE accumulation (may split after falsification)
6. Design System 2 storage schema for frozen decisions, simulated orders/fills and strategy performance.
7. Only after data feasibility: implement research-only engine code.

## Blockers

No protected blocker at bootstrap.
ChatGPT Project creation/moving a chat is a UI/account action and is not performed by repository tooling.
