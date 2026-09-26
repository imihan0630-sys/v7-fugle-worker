# ChatGPT Project Migration — System 2

Updated: 2026-09-26 Asia/Taipei
Status: READY_FOR_UI_MIGRATION

## Formal project name

台股多策略智慧選股平台

## Project Instructions source

Use the full contents of:
`system2/CHATGPT_PROJECT_INSTRUCTIONS.md`

## Canonical read order after migration

1. `shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md`
2. `shared-knowledge/SHARED_KNOWLEDGE_GOVERNANCE.md`
3. `RESEARCH_ENGINEERING_GOVERNANCE.md`
4. `system2/SYSTEM2_MASTER.md`
5. `system2/SYSTEM2_CHECKPOINT.md`
6. task-specific evidence/checkpoint files

## Migration objective

Move the current design discussion into the new ChatGPT Project without losing the link to System 1 research.

The new Project does not replace System 1. It becomes the home for System 2 strategy, code, Shadow testing, performance analysis and future UI work.

## Shared-network rule

Reusable market research learned in either project is written/routed through Shared Knowledge.

System 1-only Formal/runtime logic stays in System 1.
System 2-only strategy/scoring/performance logic stays under `system2/`.

## Protected boundary

Creating/moving the ChatGPT Project must not change:
- V8 Worker
- A/B Formal definitions
- 3+3 pool rules
- capital rules
- BUY/ADD/REDUCE/SELL/STOP logic
- signal/push/monitoring behavior

## UI migration steps

1. In ChatGPT sidebar, choose **New project**.
2. Name it **台股多策略智慧選股平台**.
3. Open the project's **••• > Project settings**.
4. Paste the contents of `system2/CHATGPT_PROJECT_INSTRUCTIONS.md` into Project Instructions.
5. Return to this chat, open its **•••** menu, choose **Move to project**, and select **台股多策略智慧選股平台**.
6. After moving, continue from `system2/SYSTEM2_CHECKPOINT.md`; do not restart research from scratch.

If **Move to project** is unavailable, start a new chat in the new Project and instruct it to read this file and the canonical read order above.

## Current engineering state

- Shared Knowledge network: ACTIVE
- System 1 connection: ACTIVE
- System 2 connection: ACTIVE
- System 2 architecture/factors/strategies/performance specs: PRESENT
- Data-source feasibility matrix: PRESENT
- Storage schema: PRESENT
- Initial Shadow strategy preregistry: PRESENT
- V8 Formal Core changed: NO
- Next phase: P1_DATA_AND_SHADOW_DESIGN
