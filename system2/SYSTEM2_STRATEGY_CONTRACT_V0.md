# System 2 Strategy Contract V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH-ONLY / MACHINE-READABLE CONTRACT DESIGN / NO WEIGHTS OR THRESHOLDS FROZEN

## Purpose

Convert owner-approved strategy identity cards into a machine-readable StrategyContract（策略契約） without prematurely freezing numeric weights or thresholds.

This contract is System 2 only and is not imported by Worker.js.

## Core rule

A StrategyContract must distinguish:
- strategy thesis from entry timing;
- evidence family from raw factor;
- REQUIRED（必要） from SUPPORTIVE（加強）;
- CONTEXT_ONLY（僅脈絡） from HARD_INVALIDATION（硬失效）;
- strategy validity from entry readiness;
- missing evidence from negative evidence.

No universal cross-strategy total score is required.

## Evidence families

Canonical V0.1 families:
- MARKET_REGIME（市場環境）
- INDUSTRY_THESIS（產業投資邏輯）
- FUNDAMENTAL_QUALITY（基本面品質）
- VALUATION（估值）
- EVENT_CATALYST（事件／催化劑）
- TECHNICAL_STRUCTURE（技術結構）
- PRICE_VOLUME（價量）
- CHIP_OWNERSHIP（籌碼／持股結構）
- CAPITAL_FLOW（資金流）
- RISK_FRICTION（風險／交易摩擦）

## Evidence roles

- PRIMARY（主要）: defines the profit/thesis mechanism.
- REQUIRED（必要）: must satisfy a setup-specific floor; UNKNOWN can make the evaluation INCOMPLETE.
- SUPPORTIVE（加強）: raises confidence/readiness but cannot create the thesis alone.
- CONTEXT_ONLY（僅脈絡）: descriptive / risk interpretation only.
- HARD_INVALIDATION（硬失效）: thesis-breaking state; cannot be rescued by auxiliary indicators.
- WARNING（警告）: lowers readiness or desired exposure without necessarily invalidating.

## Strategy validity vs entry readiness

These must be stored separately.

Strategy validity:
- VALID（策略有效）
- WEAKENING（策略邏輯轉弱）
- INVALIDATED（策略邏輯失效）
- INCOMPLETE（資料不足）

Entry readiness:
- WATCH（觀察）
- NEAR_ENTRY（接近進場）
- ACTIVE_ENTRY_MONITOR（盤中主動監控）
- BUY_ELIGIBLE（符合進場條件）
- WAIT（等待）
- TOO_EXTENDED（過度延伸）
- CONFLICT（證據衝突）
- BLOCKED（阻擋）

A stock may remain strategy-valid while entry readiness is WAIT or TOO_EXTENDED.

## Setup contract

Each setup must specify:
- setupId;
- setupVersion;
- thesisMechanism;
- requiredFamilies[];
- supportiveFamilies[];
- contextFamilies[];
- hardInvalidationIds[];
- entryReadinessInputs[];
- intradayRole;
- expectedHorizon;
- maxHolding semantics if defined;
- add families;
- reduce families;
- exit families.

No setup may infer a BUY merely because a named chart pattern exists.

## Data readiness

Each required evidence/factor maps to:
- READY_CURRENT（目前可用）
- DERIVABLE_CURRENT（目前可推導）
- PIT_AUDIT_REQUIRED（需時點稽核）
- SOURCE_EXTENSION_REQUIRED（需擴充資料源）
- SEMANTIC_GAP（語意不足）
- NOT_APPLICABLE（不適用）

UNKNOWN is not BAD.

## Versioning

New strategy version required if any of these change result semantics:
- PRIMARY/REQUIRED family composition;
- factor formula or normalization;
- setup eligibility;
- interaction definition;
- hard invalidation;
- entry/exit/add/reduce semantics;
- holding horizon;
- regime gate;
- score/floor/cap if later introduced.

## Approved strategy status for contract conversion

As of 2026-09-27:
- SHORT_MOMENTUM（短線動能）: core logic owner-approved.
- SWING_GROWTH（波段成長）: core logic owner-approved.
- INDUSTRY_TREND（產業趨勢）: core logic owner-approved.
- EVENT_DRIVEN（事件驅動）: core logic owner-approved.
- VALUE_REVERSION（價值回歸）: owner-approved research-only.

Not yet approved for frozen contract semantics:
- INSTITUTIONAL_ACCUMULATION（法人累積／法人布局）: owner review pending.
- FUNDAMENTAL_GROWTH（基本面成長）: owner review pending.
- BLACK_HORSE_ACCUMULATION（黑馬潛伏）: research lane; distinctness not proven.

## V0.1 contract-conversion principle

Only approved strategy identities may be labeled owner-approved in machine-readable contracts.
Pending/research strategies may be represented as DRAFT but must not be mistaken for approved eligibility logic.

No System 1 Formal behavior changes.
