# H07 Room13 Counterpart V0.1 — D20-09 vs D03-05

Updated: 2026-10-04 Asia/Taipei
Owner: 13｜行為金融與市場心理研究室
Classification: KEEP_SEPARATE_CONDITIONAL_ON_BEHAVIOR_IDENTIFIABILITY / COUNTERPART_COMPLETE
Formal Core: LOCKED

## Accepted ownership
- D03-05 owns observable pullback / short-horizon reversal geometry and its causal price replay.
- D20-09 owns behavioral overreaction only when event/expectation evidence exists before the later reversal and survives structural alternatives.
- Prior extreme return + later reversal alone is ineligible as a second behavioral vote.

## Independent D20-09 observable
A bounded event-conditioned initial-response lane is now source-feasible:
1. D20-08 / D17-13 supply valid event first-known and replay clocks.
2. Event surprise/information content is frozen before outcomes or remains UNKNOWN.
3. Completed Taiwan 15-minute bars supply the initial 15m / 30m market-sector residual response.
4. Later reversal is excluded from the parent and joins only after the horizon closes.

Canonical contract:
research/d20_09_event_conditioned_overreaction_pit_contract_v0_1.json

Decision-time parent may include:
- event identity / eventKnownAt;
- surprise definition/version and surprise value or UNKNOWN;
- pre-event path;
- first 15m / 30m residual response;
- liquidity / volatility / price-limit state;
- optional attention/sentiment context known at the cutoff.

## Structural counterfactuals
Mandatory alternatives:
- bid-ask bounce;
- opening-auction imbalance;
- temporary liquidity impact;
- inventory/liquidity provision;
- forced flow;
- price-limit mechanics;
- volatility normalization;
- market/sector shock;
- new information arriving after the initial event.

If these alternatives are not separable, behavioral cause remains UNKNOWN.

## Divergent states
A. D03 reversal active / D20 overreaction UNKNOWN:
Temporary liquidity impact is mechanically corrected with no valid event-expectation evidence.

B. D20 overreaction candidate before completed reversal:
A valid event surprise is followed by an unusually large initial residual response relative to controls; later reversal has not yet occurred and is not used in the parent.

C. Initial overshoot + short reversal + medium drift:
The same event may show short-horizon correction and later underreaction/drift. Therefore D20-09 cannot label the entire path with one sign.

## PIT sequence
event first-known -> frozen surprise/context -> completed initial 15m/30m response -> immutable parent -> later D03 reversal/outcome join.

No backdating to event occurrence, opening low/high or later reversal.

## Terminal specialist return
KEEP_SEPARATE_CONDITIONAL_ON_BEHAVIOR_IDENTIFIABILITY.

D20-09 has an independent event-conditioned causal parent distinct from D03-05 reversal geometry.
Behavioral overreaction is still a hypothesis until prospective structural-discrimination evidence exists.

D20-09 = L3 data feasibility only.
No alpha/OOS/Formal claim.
