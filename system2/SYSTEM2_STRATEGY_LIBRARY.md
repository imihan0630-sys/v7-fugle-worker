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
Primary: industry cycle, demand/supply, capacity, pricing, capital flow.
Secondary: company fundamentals, leaders/laggards, valuation and technical entry.
Requires thesis lifecycle and invalidation conditions.

## FUNDAMENTAL_GROWTH
Primary: revenue/earnings/margin/cash-flow quality and acceleration.
Secondary: industry, valuation, market interest and technical timing.
A technically overbought condition should not erase company quality; it can lower timing attractiveness.

## EVENT_DRIVEN
Primary: event mechanism, beneficiary/victim transmission, market reaction and event half-life.
Secondary: liquidity, technical structure, chips.
Horizon determined by event persistence. One-off shocks are short-lived; structural supply/demand shifts may become swing/trend theses.

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
