# System 2 Confluence Engine

Updated: 2026-09-27 Asia/Taipei
Status: DESIGN DRAFT V0.1 / OWNER REVIEW PENDING / RESEARCH-ONLY

## Purpose

Define how System 2 combines multiple factor domains without naive additive scoring or duplicate-counting.

CONFLUENCE（共振） means that distinct evidence families support the same strategy thesis through different mechanisms. It does NOT mean that many correlated indicators happen to point in the same direction.

## Core principles

1. Strategy-specific, not universal-score.
2. Evidence families first, raw indicators second.
3. Correlated derivatives from the same source cannot be treated as independent votes.
4. Hard invalidation can override multiple supportive auxiliary factors.
5. Missing evidence remains UNKNOWN（未知） and cannot become a zero or negative vote.
6. Contradictory valid evidence may produce WAIT（等待）, LOWER_READINESS（降低進場準備度） or strategy-specific conflict states.
7. Exact weights, floors, caps and interactions are research hypotheses until PIT（時點正確性）/Shadow（影子模擬）/OOS（樣本外） validation.

## Evidence-family architecture

Candidate families:
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

Indicators inside one family may be highly redundant.

Examples:
- KD/MACD/RSI/MA slope are all price-derived and cannot each count as independent bullish votes.
- 5/20/60-day relative volume, same-slot RVOL and cumulative-volume pace are related participation measures and require redundancy testing.
- revenue growth, EPS growth and margin expansion may share the same operating improvement mechanism.
- foreign/trust flows and ownership-concentration trends are related but not semantically identical; incremental value must be proven.

## Within-family aggregation

Before cross-family confluence:
1. validate data quality;
2. normalize features within their intended context;
3. remove/discount redundant variables;
4. produce a family state and confidence rather than summing every raw feature.

Example TECHNICAL_STRUCTURE family output:
- trendState;
- patternState;
- support/resistance;
- indicatorAuxiliaryState;
- technicalConfidence;
- technicalWarnings.

Example PRICE_VOLUME family output:
- participationState;
- responseState;
- acceptanceState;
- persistenceState;
- pvConfidence;
- pvWarnings.

## Cross-family confluence

Confluence is stronger when evidence comes from economically distinct mechanisms.

Example:
INDUSTRY_THESIS supportive
+ FUNDAMENTAL_QUALITY improving
+ CHIP_OWNERSHIP concentrating
+ TECHNICAL_STRUCTURE mature
+ PRICE_VOLUME accepted

is more meaningful than:
KD bullish
+ MACD bullish
+ RSI bullish
+ MA bullish

because the former spans independent mechanisms while the latter is mostly repeated price information.

## Interaction terms

Important combinations may be represented explicitly rather than as raw-score addition.

Candidate interactions:
- ACCUMULATION_CONFLUENCE（吸籌共振）:
  institutional persistence + ownership concentration + retail reduction + controlled price/volume + limited price extension.
- GROWTH_REPRICING_CONFLUENCE（成長重新評價共振）:
  earnings acceleration + industry tailwind + catalyst + valuation still supportable + technical timing.
- BREAKOUT_ACCEPTANCE_CONFLUENCE（突破接受共振）:
  mature structure + valid breakout + participation + strong price response + supportive market/sector context.
- VALUE_REPAIR_CONFLUENCE（價值修復共振）:
  valuation dislocation + durable fundamentals + repair catalyst + selling exhaustion + reversal confirmation.
- EVENT_TRANSMISSION_CONFLUENCE（事件傳導共振）:
  verified event + company exposure + economic materiality + persistence + price acceptance.

Interactions must be preregistered and falsified against their component factors. If the interaction adds no incremental information, reject it.

## Floors, caps and vetoes

Future strategy definitions may use:
- REQUIRED_FLOOR（必要最低條件） for primary thesis families;
- SUPPORTIVE（加強） for secondary families;
- CONTEXT_ONLY（僅脈絡） for weak/optional evidence;
- HARD_INVALIDATION（硬失效） for thesis-breaking states;
- FAMILY_CAP（因子家族上限） to prevent one correlated family from dominating.

No numeric thresholds are frozen in V0.1.

## Factor conflict

Do not use majority voting.

Conflict examples:
- strong fundamentals + poor technical timing => thesis valid, entry WAIT;
- bullish chart pattern + price-volume rejection => breakout quality downgraded or failed;
- strong momentum + material negative event => event/thesis risk cannot be rescued by indicators;
- cheap valuation + deteriorating structural fundamentals => potential value trap, not automatic opportunity.

## Strategy confluence vs factor confluence

Keep these separate.

FACTOR_CONFLUENCE（因子共振）:
multiple evidence families support one strategy thesis.

MULTI_STRATEGY_CONFLUENCE（多策略共振）:
one stock independently qualifies under more than one strategy.

A stock qualifying for SWING_GROWTH and INDUSTRY_TREND is not automatically twice as strong if both strategies rely on the same industry-growth evidence.

Future strategy-confluence logic must estimate overlap/redundancy between strategy theses before giving any priority benefit.

## Strategy-specific examples

SHORT_MOMENTUM（短線動能）:
primary families likely TECHNICAL_STRUCTURE + PRICE_VOLUME + MARKET_REGIME/CAPITAL_FLOW.
Fundamental/valuation mainly risk/context unless extreme.

SWING_GROWTH（波段成長）:
primary likely INDUSTRY_THESIS + FUNDAMENTAL_QUALITY + EVENT_CATALYST/EXPECTATION.
TECHNICAL_STRUCTURE + PRICE_VOLUME mainly timing/acceptance.

INSTITUTIONAL_ACCUMULATION（法人累積）:
primary CHIP_OWNERSHIP + institutional CAPITAL_FLOW.
PRICE_VOLUME and industry/fundamental evidence provide confirmation/context.

INDUSTRY_TREND（產業趨勢）:
primary INDUSTRY_THESIS.
Company earnings sensitivity, fundamentals, valuation and technical/PV timing are separate supporting mechanisms.

FUNDAMENTAL_GROWTH（基本面成長）:
primary FUNDAMENTAL_QUALITY.
Industry, valuation and technical/PV timing support but do not replace company-quality thesis.

EVENT_DRIVEN（事件驅動）:
primary EVENT_CATALYST + transmission/materiality.
PRICE_VOLUME is important for price discovery/acceptance.

VALUE_REVERSION（價值回歸）:
primary VALUATION + FUNDAMENTAL_DURABILITY + repair catalyst.
TECHNICAL_STRUCTURE + PRICE_VOLUME help avoid falling knives.

## Research controls

Mandatory:
- factor correlation and mutual-information diagnostics where appropriate;
- incremental-value tests within and across families;
- ablation tests（消融測試）: remove one family and measure what changes;
- interaction vs component-only comparison;
- date/regime/industry concentration;
- PIT/no-lookahead;
- OOS/holdout;
- transaction costs/slippage where actionable;
- multiple-testing/Factor-Zoo control.

## V0.1 output concept

Per strategy / symbol / decision timestamp:
- thesisPrimaryFamilies[];
- familyStates{};
- familyConfidence{};
- supportiveFamilies[];
- conflicts[];
- hardInvalidations[];
- interactions[];
- redundancyWarnings[];
- overallReadinessState;
- explanation;
- provenance;
- engineVersion.

Do not produce a universal cross-strategy total score from these fields.

## Current status

DESIGN_DRAFT_V0_1 / OWNER REVIEW PENDING.
No strategy weight, threshold, floor, cap, veto or interaction is formal yet.
