# System 1 / System 2 Policy Fingerprint Baseline 2026-10-06 V0.1

Updated: 2026-10-06 Asia/Taipei
Status: SDA022_ARCHITECTURE_BASELINE_FROZEN
Owner: 00｜研究總控／稽核
Formal Core impact: NONE
Contract: shared-knowledge/CROSS_SYSTEM_POLICY_FINGERPRINT_CONTRACT_V0_1.md

## Source authorities

System 1:
- shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md
- content SHA: 900acaa3dfafab4f8f46d8dd4f608276716590ef

System 2:
- system2/runtime/strategy_contracts_v0_1.mjs
- content SHA: 2a5038ce2310aa18035e691db1a3bee7d5b22ae5
- system2/SYSTEM2_STRATEGY_LOCAL_RANKING_BASELINES_V0_1.md
- content SHA: 396c0616ce167c525323c22bcce26c1321962392
- system2/SYSTEM2_CANDIDATE_CAPACITY_CONTRACT_V0_1.md
- content SHA: dd357b70297340f018c79b9bec7eb0ce61ce8ac8

## System 1 baseline fingerprint

System identity:
- SYSTEM1 / V8 Formal selection.

Candidate dependency:
- does not require System2 candidates or ranks.
- current audit classification: INDEPENDENT_AUTHORIZED_UNIVERSE relative to System2.

Core strategy identity:
- A/B setup family remains current Formal strategy identity.
- failing A/B means not a current Formal candidate, not globally bad stock.

Admission:
- current scoreCandidate path contains 21 fail-fast branches.
- current gate semantics mix owner/safety, confidence/missingness, primary-alpha and context/supportive roles.
- Formal behavior remains locked even where research identifies role-hardening problems.

Effective ranking authority:
1. PriorityScore
2. rewardPerRisk
3. marketConsensusScore
4. setupQuality
5. sectorFlow
6. relativeStrength

Selection/capacity:
- price floor NT$10;
- general pool max 3;
- thousand-dollar pool max 3;
- thousand threshold NT$1,000;
- no cross-pool slot transfer;
- total 0-6; empty slots valid.

Important current influence families:
- A/B setup;
- reward/risk;
- market consensus;
- sector;
- fundamentals;
- institutional/chip;
- relative strength;
- liquidity/risk constraints.

Entry/lifecycle:
- protected 15-minute Formal confirmation semantics;
- protected capital and BUY/ADD/REDUCE/SELL/STOP lifecycle.

## System 2 baseline fingerprint

System identity:
- SYSTEM2 multi-strategy research/shadow platform.

Candidate dependency:
- architecture says the decision engine is independent from System1.
- full-market orchestration is a target/current build path.
- current physical selection-to-capacity is still incomplete.
- audit classification:
  - designCandidateUniverseMode = INDEPENDENT_FULL_MARKET;
  - physicalIndependentDiscovery = NOT_PHYSICALLY_PROVEN.
- System1 Top6/rank is not a documented prerequisite.

Capacity/lifecycle:
- global candidate/watch pool max 12 unique symbols;
- per-strategy ACTIVE_INTRADAY_MONITOR max 3;
- no forced filling;
- persistent candidate episodes;
- strategy memberships remain separate;
- no universal cross-strategy score by default;
- scarcity without a valid global priority policy => GLOBAL_PRIORITY_UNRESOLVED.

### SHORT_MOMENTUM

Contract version:
- V0.1-CONTRACT.

Primary horizon:
- 1 / 3 / 5 / 10 sessions.

Policy families:
- PRIMARY: TECHNICAL_STRUCTURE, PRICE_VOLUME, MARKET_REGIME;
- REQUIRED: RISK_FRICTION;
- SUPPORTIVE: CAPITAL_FLOW;
- CONTEXT_ONLY: FUNDAMENTAL_QUALITY.

RANK-01:
- SM-PARETO-BASELINE / 0.1;
- TECHNICAL_STRUCTURE + PRICE_VOLUME + RISK_FRICTION;
- Pareto dominance;
- no weighted total score.

Overlap assessment vs System1:
- HIGHEST STRUCTURAL OVERLAP SURFACE among current System2 strategies;
- overlap mechanism is technical structure + price/volume + reward/risk / friction;
- Market Regime and Capital Flow roles are not identical to System1 Formal use;
- this is a convergence-risk flag, NOT proof the two policies are identical.

### SWING_GROWTH

Contract version:
- V0.1-CONTRACT.

Primary horizon:
- 10 / 20 / 40 / 60 sessions.

Policy families:
- PRIMARY: INDUSTRY_THESIS, FUNDAMENTAL_QUALITY, EVENT_CATALYST;
- REQUIRED: VALUATION;
- SUPPORTIVE: TECHNICAL_STRUCTURE, PRICE_VOLUME, CHIP_OWNERSHIP.

RANK-01:
- SG-PARETO-BASELINE / 0.1;
- FUNDAMENTAL_QUALITY + INDUSTRY_THESIS;
- Pareto dominance;
- no weighted total score.

Overlap assessment vs System1:
- meaningful shared evidence exists because System1 also uses sector/fundamental/valuation/technical inputs;
- thesis ownership and ranking mechanism remain materially different today;
- current structural convergence risk is lower than SHORT_MOMENTUM but non-zero.

### INDUSTRY_TREND

Primary horizon:
- 20 / 40 / 60 / 120 sessions.

Primary family:
- INDUSTRY_THESIS.

Support:
- FUNDAMENTAL_QUALITY, VALUATION, CAPITAL_FLOW, TECHNICAL_STRUCTURE, PRICE_VOLUME.

Ranking:
- no RANK-01 local ranking baseline is frozen in the audited baseline.

Assessment:
- materially different thesis horizon from System1 A/B Formal;
- D09/sector evidence is a shared root and requires SDA lineage controls.

### EVENT_DRIVEN

Primary horizon:
- setup-dependent 1 through 40 sessions.

Primary family:
- EVENT_CATALYST.

Required:
- RISK_FRICTION for immediate/event-pullback setups.

Assessment:
- materially different thesis mechanism from System1 A/B Formal;
- must preserve firstKnownAt/event identity and avoid using System1 technical confirmation as a universal prerequisite.

### VALUE_REVERSION

Owner state:
- RESEARCH_ONLY_APPROVED.

Primary horizon:
- 10 / 20 / 40 / 60 / 120 sessions.

Primary families:
- VALUATION;
- FUNDAMENTAL_QUALITY;
- EVENT_CATALYST.

Support:
- TECHNICAL_STRUCTURE, PRICE_VOLUME, CHIP_OWNERSHIP.

Assessment:
- materially different thesis mechanism from System1 A/B Formal;
- not production authority.

## Current cross-system audit verdict

CURRENT_SYSTEMS_IDENTICAL = FALSE.

PHYSICAL_INDEPENDENCE_FULLY_PROVEN = FALSE.

Why not identical:
- different strategy architecture;
- different ranking mechanism;
- different capacity policy;
- different horizon structure;
- multiple System2 thesis families have no System1 equivalent as formal strategy identity;
- System2 does not currently require A/B, Top6/3+3 or System1 comparator.

Why physical independence is not yet fully proven:
- System2 full-market selection-to-capacity path is still incomplete;
- no frozen cross-system policy-fingerprint runtime receipts exist yet;
- NC-T01 has not yet produced a physical receipt proving System2 discovery remains executable with System1 Top6/rank absent.

## Highest convergence-risk surface

Current highest-risk pair:
SYSTEM1 Formal A/B short-horizon selection
vs
SYSTEM2 SHORT_MOMENTUM.

Reason:
both rely heavily on technical structure, price/volume and reward/risk-style evidence.

Required protection:
- separate policy IDs and versions;
- separate candidate-generation receipts;
- no System1 Top6/rank as hidden upstream prerequisite;
- shared primitive lineage preserved;
- overlap outcomes analyzed by D16 rather than treated as double confirmation.

## No forced divergence

This baseline does not set:
- maximum allowed overlap;
- minimum disagreement rate;
- minimum System2-only pick rate;
- numeric independence score.

Those thresholds are intentionally absent until preregistered evidence supports them.

## Exact next

1. Define machine-readable fingerprint receipt schema.
2. System1 emits a research-only policy fingerprint without changing Formal.
3. System2 emits per-strategy policy fingerprints without changing strategy logic.
4. Execute NC-T01 architecture test:
   System2 strategy candidate generation with System1 Top6/rank unavailable.
5. Start prospective cross-system overlap/divergence receipts only after both fingerprints are available.
6. D16 preregisters dependence/incrementality evaluation before opening outcome comparisons.
