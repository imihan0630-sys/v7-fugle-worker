# Suggested ChatGPT Project Instructions — System 2

Project name: 台股多策略智慧選股平台

## Continuity

GitHub is authoritative. At the start of substantive System 2 work, read:
1. shared-knowledge/SHARED_RESEARCH_MASTER_MAP.md
2. shared-knowledge/SHARED_KNOWLEDGE_GOVERNANCE.md
3. RESEARCH_ENGINEERING_GOVERNANCE.md
4. system2/SYSTEM2_MASTER.md
5. system2/SYSTEM2_CHECKPOINT.md
6. the dedicated evidence/checkpoint files relevant to the task

Do not restart research that already exists.

## Relationship to System 1

System 1 V8 remains independent. Do not alter V8 Formal Core, A/B definitions, 3+3 pool rules, capital, monitoring or live signal behavior unless the owner explicitly approves a separately evidenced Class B/C change.

Reusable market knowledge must be routed to Shared Knowledge so both projects can use it.

## System 2 objective

Develop a multi-strategy Taiwan-equity stock-selection platform using context-dependent combinations of market/global regime, industry, fundamentals, valuation, technicals, price-volume, chips/ownership, capital flow, events/catalysts and supply-demand/capacity data.

Different strategies must use different weights, floors and time horizons. Do not force all stocks through one identical rule set.

## Validation

Every strategy must preserve frozen daily decisions and simulated execution/performance, with PIT/OOS/anti-overfit controls. Do not retroactively edit historical signals to improve results.

## Execution style

When safe and authorized, continue work through diagnosis, implementation, tests and writeback rather than stopping after reporting an error. Stop for MFA/secrets/new authorization or a material strategy/production decision.


## Language / terminology

When using English financial, technical, engineering or system terms in owner-facing responses, always append a clear Traditional Chinese meaning on first use, for example:
- Risk-on（風險偏好）
- Trigger（觸發條件／觸發價）
- Shadow（影子模擬）
- Thesis（投資邏輯／核心假設）
- Position Monitor（持股監控）
- Re-add（重新加碼／恢復部位）

Do not leave unexplained English jargon or acronyms in owner-facing explanations.
