# D04 Volatility Contraction→Expansion Incremental Protocol v0.1

Updated: 2026-09-30 01:34 Asia/Taipei
Status: HYPOTHESIS_AND_FALSIFICATION_PROTOCOL_FROZEN
Formal Core impact: NONE

## Research question
Test whether pre-existing volatility contraction followed by causally observed expansion adds information to breakout/follow-through quality beyond existing price structure, trend, ATR, volume, overheat, liquidity and market-regime variables.

## Semantic guardrails
- Contraction is a volatility-state descriptor and has no bullish/bearish sign.
- Expansion is an increase in volatility; direction is measured separately.
- Volatility clustering concerns persistence of magnitude, not persistence of return direction.
- The estimand is incremental reliability/path quality conditional on an already-defined breakout candidate. This lane does not redefine breakout.
- Same-bar information unavailable at the decision timestamp is prohibited from the pre-signal contraction state.
- Use one challenger first; no percentile/threshold sweep.

## Required controls
A/B channel; ATR admission; ATR stop geometry; RR survival/ranking; ret20/ret60; Residual RS; volume/attention; overheat/lateStage/maxChase family; market/sector regime; liquidity; relativeTickBps; session/mechanism state for intraday work.

## Outcomes
D1/D3/D5 follow-through; breakout hold/failure under the owning definition; MFE/MAE; stop-first under frozen stop geometry; after-cost return only where cost evidence is valid; coverage/zero-pick impact in research-only simulation.

## Positive hypothesis
After exact-common-support controls, a pre-existing contraction state followed by causally observed expansion may improve follow-through or reduce false-breakout frequency.

## Counter-hypotheses
1. Effect disappears after trend/location/volume/ATR controls => REDUNDANT_WITH_EXISTING_PRICE_VOLATILITY.
2. Expansion only restates the breakout return => TAUTOLOGICAL_RESPONSE.
3. Same-bar future range is required => LOOKAHEAD_CONTAMINATED.
4. Result is driven by crisis/event dates => CRISIS_CLUSTER_DRIVEN.
5. Sign differs across A/B, tick/price or liquidity strata => CHANNEL_OR_REGIME_CONDITIONAL_ONLY.
6. Lower false-breakout rate is offset by later entry, slippage or lower coverage => COST_OR_COVERAGE_NEGATES_BENEFIT.

## Evidence boundary
Published work supports volatility clustering and strategy-by-volatility-state interaction as research mechanisms, but does not establish a Taiwan-equity contraction-breakout rule. External ATR adaptive-exit evidence is asset/strategy conditional and cannot authorize a universal ATR multiple or sizing rule.

## Promotion gate
PIT-safe immutable decision-state parent; independent dates/multiple regimes; OOS or prospective Shadow; frozen walk-forward; multiple-testing control; transaction/opportunity costs; redundancy comparison on exact common support. Formal Core stays locked.

## Exact next continuation
1. Do not inspect outcomes until the immutable per-symbol decision-state parent exists.
2. Then compare one baseline without contraction/expansion against one frozen challenger on exact common support.
3. D04-03/D04-04 remain L2; this protocol alone does not raise maturity.
4. Continue D04-RV-PERSIST-01 independently; prospective market-RV persistence remains the nearer evidence gate.
