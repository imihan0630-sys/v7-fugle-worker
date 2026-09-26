# System 2 Strategy Library

Updated: 2026-09-26
Status: HYPOTHESIS CATALOG V0.1

Weights below are intentionally NOT fixed yet. They are research hypotheses.

## SHORT_MOMENTUM
Primary: market/capital flow, technical, price-volume, chips.
Secondary: industry/event.
Fundamental/valuation mainly serve risk filters unless extreme.
Horizon: days to a few weeks.
Must avoid using long-horizon thesis to excuse failed short-term price action.

## SWING_GROWTH
Primary: industry future, fundamentals, catalysts/expectations.
Secondary: chips, technical timing, market regime, valuation.
Horizon: weeks to months.
Focus: improving earnings trajectory before/while market reprices it.

## INSTITUTIONAL_ACCUMULATION
Primary: institutional flow persistence/quality, ownership concentration trend.
Secondary: price-volume absorption, industry/fundamental support, market regime.
Goal: detect positioning before obvious price expansion.

## BLACK_HORSE_ACCUMULATION
Primary: subtle accumulation interactions.
Examples to test:
- trust/foreign gradual buying;
- 400+/1000+ holder share rising;
- retail participation falling;
- low price extension;
- higher lows / controlled volume;
- emerging catalyst/industry improvement.
Must explicitly test false positives where institutions buy but price subsequently falls.

## INDUSTRY_TREND
Primary: industry cycle, demand/supply, inventory, capacity, pricing, earnings sensitivity and capital flow.
Secondary: company fundamentals, leader-vs-high-beta-beneficiary comparison, valuation and technical entry.
Requires explicit cycle-stage, beneficiary/victim transmission, thesis lifecycle and invalidation conditions.

Status: CORE LOGIC OWNER-APPROVED / THRESHOLDS NOT FROZEN.

Owner-approved core:
- determine industry cycle stage before stock selection;
- distinguish fundamental cycle from price cycle;
- map supply/demand/inventory/capacity/pricing through to company earnings;
- compare sector leaders with higher-beta beneficiaries rather than assuming leaders always win;
- treat sector-leader priority as a research hypothesis requiring falsification;
- use technicals mainly for timing/risk rather than to replace the industry thesis;
- support early-cycle entry, trend pullback and second-leg breakout setups;
- support ADD_ON_NEW_INFORMATION when the industry thesis strengthens;
- introduce CYCLE_PEAK_WARNING and INDUSTRY_THESIS_INVALIDATED states;
- preserve multi-strategy attribution when INDUSTRY_TREND overlaps with other strategies.

INDUSTRY_TREND core logic owner-approved on 2026-09-27.

## FUNDAMENTAL_GROWTH
Primary: revenue/earnings/margin/cash-flow quality and acceleration.
Secondary: industry, valuation, market interest and technical timing.
A technically overbought condition should not erase company quality; it can lower timing attractiveness.

New owner-approved research dimension:
- CONTRACT_LIABILITY（合約負債） trend should be studied as a forward-visibility factor where the business model makes it economically meaningful.
- Prefer changes/acceleration and normalized ratios over absolute amount.
- Pair with revenue, margin, cash flow, industry cycle and contract quality; never treat rising contract liabilities alone as automatic bullish evidence.
- NOT_APPLICABLE（不適用） is a valid state for industries where contract liabilities are structurally uninformative.

Potential cross-strategy relevance:
- SWING_GROWTH（波段成長策略）: early evidence of improving future revenue visibility;
- INDUSTRY_TREND（產業趨勢策略）: project/capex-cycle confirmation for applicable industries;
- FUNDAMENTAL_GROWTH（基本面成長策略）: growth quality / future-revenue visibility context.

Exact factor weights and thresholds remain unfrozen pending PIT/Shadow/OOS validation.

## EVENT_DRIVEN
Primary: event mechanism, beneficiary/victim transmission, market reaction and event half-life.
Secondary: liquidity, technical structure, chips.
Horizon determined by event persistence. One-off shocks are short-lived; structural supply/demand shifts may become swing/trend theses.

Status: CORE LOGIC OWNER-APPROVED / THRESHOLDS NOT FROZEN.

Owner-approved core:
- events must be processed through source verification, firstKnownAt/availableAt timing, transmission mapping, company exposure and price-in assessment;
- distinguish company, industry, supply, demand, policy, macro and corporate-action events;
- preserve event half-life, expiry and invalidation;
- do not equate news intensity with new information or economic materiality;
- support event pullback and second-wave entry, not only immediate reaction;
- allow event state to transition into persistent/structural industry trend when evidence accumulates;
- let verified events affect POSITION_MONITOR（持股監控）, including recovery/re-add and risk-warning paths;
- retain all verified non-winning events to control selection bias;
- event dimensions remain separate until evidence justifies any combined score.

EVENT_DRIVEN core logic owner-approved on 2026-09-27.

## VALUE_REVERSION
Research-only hypothesis.
Primary: valuation dislocation and fundamental durability.
Requires proof that value factor is useful in the relevant Taiwan regimes and does not become a value trap.

## Strategy activation

Each strategy will eventually have regime gating. Examples:
- short momentum gains priority in strong breadth/capital-flow regimes;
- black-horse/institutional strategies may work during early rotation/accumulation;
- growth/industry strategies require stronger structural evidence;
- risk-off may reduce aggressive strategy allocation.

No regime gate is formal until validated.


## Cross-strategy research hypothesis — SECTOR_LEADER_PRIORITY

Status: OWNER-SUGGESTED / RESEARCH REQUIRED / NOT YET A FORMAL RULE

Hypothesis:
When an industry/sector thesis is bullish and company fundamentals/industry conditions are supportive, the sector's leading companies may deserve first-pass priority because they may attract institutional capital more readily and may express the industry thesis more efficiently than weaker followers.

This must **not** be assumed true by narrative. It must be tested against counterexamples.

### Leader definition must be multidimensional

Do not define "leader" by market capitalization alone. Candidate leader dimensions include:
- industry revenue / profit share;
- pricing power;
- technology/product leadership;
- customer quality / market position;
- liquidity / institutional investability;
- institutional ownership / flow;
- earnings revision leadership;
- relative strength / price leadership;
- balance-sheet/fundamental quality;
- supply-chain importance.

Different strategies may require different leader definitions.

### Strategies where this may matter

- INDUSTRY_TREND: leader-first screening may be a primary routing rule if validated.
- SWING_GROWTH: prefer companies with both industry tailwind and superior earnings-revision sensitivity.
- SHORT_MOMENTUM: price leader may differ from fundamental leader; do not conflate them.
- INSTITUTIONAL_ACCUMULATION: institutional preference for liquidity/scale may favor leaders, but early accumulation can occur in second-tier names.

### Mandatory counter-tests

Compare leaders vs non-leaders / second-tier beneficiaries on:
- D1/D3/D5/D10/D20 return;
- MFE/MAE;
- drawdown;
- trigger rate;
- institutional-flow persistence;
- valuation premium;
- late-stage/overextension frequency;
- sector-cycle stage;
- market regime;
- industry concentration;
- transaction costs/liquidity.

Explicitly test whether leaders:
- are already fully priced;
- lag during early-cycle/high-beta catch-up;
- underperform niche suppliers with higher earnings elasticity;
- become crowded institutional holdings;
- are less responsive to incremental industry upside due to diversified businesses.

### Promotion rule

Only promote leader-first priority into a live System 2 strategy after PIT-valid Shadow/OOS evidence shows incremental value versus:
1. sector-wide ranking without leader preference;
2. pure relative-strength ranking;
3. pure fundamental ranking;
4. valuation-adjusted beneficiary ranking.

If evidence is mixed, use leader status as context rather than a hard priority.
