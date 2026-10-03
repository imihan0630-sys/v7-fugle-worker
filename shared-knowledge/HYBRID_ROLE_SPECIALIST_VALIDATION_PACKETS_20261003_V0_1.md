# Hybrid Role Specialist Validation Packets 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: READY_FOR_SPECIALIST_EXECUTION
Parent audit:
`shared-knowledge/HYBRID_ROLE_ELIGIBILITY_AUDIT_20261003_V0_1.md`

These packets validate **role eligibility**, not live production roles.
No packet authorizes Formal Core changes.

## R01 — Data Integrity / PIT / Provenance

Primary room:
11｜統計驗證與策略市場狀態研究室

Cross-room dependencies:
01 / 02 / 04 / 06 / 07 / 08 / 09 as source owners.

Required work:
1. Freeze canonical provenance/first-known/replay schema.
2. Identify which failures are truly factual and strategy-blocking.
3. Separate HARD_INVALIDATION from mere lower confidence.
4. Confirm data completeness/quality itself never becomes PRIMARY_ALPHA.
5. Define UNKNOWN handling.
6. Return module-level exception list only where generic domain defaults are insufficient.

## R02 — Execution / Orderability

Primary rooms:
04｜波動與市場微結構研究室
10｜投組風控與交易執行研究室
08｜事件與新聞研究室 for suspension/exit-event dependencies.

Required work:
1. Freeze executable vs non-executable states.
2. Separate fill/cost/confidence from stock-selection alpha.
3. Define exact factual states eligible for HARD_INVALIDATION.
4. Verify high slippage/cost does not silently become a directional vote.
5. Preserve strategy-specific exceptions such as required short orderability.
6. Return role map and anti-double-count rules.

## R03 — Portfolio Risk / Sizing

Primary room:
10｜投組風控與交易執行研究室

Required work:
1. Separate alpha evidence from sizing/risk/capital allocation.
2. Prove D15 modules do not reward the same thesis twice.
3. Define explicit risk-authority states eligible for HARD_INVALIDATION.
4. Freeze sizing/portfolio roles for D15-14, D15-19 and optimization family.
5. Return stock-selection role exclusions and portfolio-policy ownership.

## R04 — Macro / Regime

Primary rooms:
09｜衍生品與國際總經研究室
11｜統計驗證與策略市場狀態研究室

Required work:
1. Classify macro/regime evidence as context by default.
2. Identify explicit strategies where a macro/regime feature may become PRIMARY_ALPHA.
3. Prohibit generic stock-level pass/fail from macro weakness.
4. Define strategy activation/deactivation role vs stock selection role.
5. Test whether zero-pick can be caused by accidental macro hard gates.
6. Return strategy-specific exceptions only.

## R05 — Behavioral / Governance Identifiability

Primary rooms:
13｜行為金融與市場心理研究室
14｜公司治理與內部人研究室

Cross-room dependencies:
03 / 05 / 06 / 08 for underlying observable phenomena.

Required work:
1. Require distinct observables for behavioral/governance claims.
2. Separate symptom from cause.
3. Prohibit narrative-only HARD_INVALIDATION.
4. Define when evidence may remain CONTEXT/CONFIDENCE vs become SUPPORTIVE.
5. PRIMARY_ALPHA requires independent long-horizon/strategy-specific validation.
6. Return identifiability firewall by module family.

## R06 — Flow / Lending / Crowding

Primary rooms:
05｜法人與籌碼研究室
10｜投組風控與交易執行研究室
12｜資產定價與因子研究室
13｜行為金融與市場心理研究室

Required work:
1. Freeze raw position/flow/lending receipt ownership.
2. Separate crowding, borrow economics, execution feasibility, factor crowding and behavioral interpretation.
3. Prohibit directional HARD_INVALIDATION from borrowing/flow alone.
4. Prohibit multiple votes from the same receipt.
5. Identify strategy-specific PRIMARY_ALPHA candidates only after residual tests.
6. Return four-layer or factor-layer ownership map.

## R07 — Corporate Actions / Event Continuity

Primary rooms:
08｜事件與新聞研究室
10｜投組風控與交易執行研究室

Required work:
1. Separate event alpha/context from factual continuity/tradability safety.
2. Define exact corporate-action states eligible for HARD_INVALIDATION.
3. Confirm event labels alone do not reject a stock.
4. Preserve reference-price, suspension, exit/orderability and unresolved continuity safeguards.
5. Return role map and firstFailureReason taxonomy for Shadow use.

## R08 — Validation / Decision Architecture

Primary room:
11｜統計驗證與策略市場狀態研究室

Required work:
1. Freeze validation-method roles for D16.
2. Confirm method complexity/calibration quality is not PRIMARY_ALPHA.
3. D16-25 may combine evidence into decisions but cannot manufacture evidence.
4. Separate model quality, evidence quality, decision uncertainty and decision utility.
5. Define machine-readable interface for System1 A2 and System2 B1 to consume role eligibility without modifying production.
6. Return role-eligibility schema and exception list.

## Common return format

Every packet returns:
- module IDs / evidence family;
- candidate role(s);
- forbidden automatic role(s);
- strategy/horizon dependency;
- HARD_INVALIDATION burden-of-proof state if applicable;
- PRIMARY_ALPHA burden-of-proof state if applicable;
- UNKNOWN handling;
- redundancy family;
- shared evidence receipt ownership;
- maturity implication;
- explicit Formal Core unchanged statement.

00｜研究總控室 validates completeness and updates the role eligibility overlay only.
