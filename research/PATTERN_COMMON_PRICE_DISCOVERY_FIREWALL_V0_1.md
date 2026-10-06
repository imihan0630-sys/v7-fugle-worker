# D01 DL-060 — Structural Response vs Leader/Follower Propagation and Common Price Discovery V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / COMMON_PRICE_DISCOVERY_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-059 separated structural response from correlated external order flow and crowding.

DL-060 freezes the next falsification:

> A stock may appear to react cleanly at its own support/resistance simply because a market leader, industry, index, ETF, futures contract or related asset moved first and the stock followed common price discovery.

Same-bar co-movement is not proof of lead/lag direction.

No future return outcome is opened in this tranche.

## 2. Owner boundaries

D03 owns canonical lead-lag / timing-placebo methodology.
D08/D13/D18 own event/common-factor/regime context as routed.
Breadth/rotation research owns sector participation and leadership-state semantics.
D07 owns supply-chain lead-lag where a verified economic edge exists.
D05 owns microstructure event clocks and cross-impact context where available.

D01 only asks:
Does zone-specific representation remain after owner-certified leader/sector/index price-discovery context?

D01 does not build a new lead-lag model.

## 3. Hard timing rule

Consume D03 timing invariant:

leaderSignalKnownAt <= followerDecisionCutoff < followerEndpointWindowStart.

If leader and follower moves are only known at the same completed bar:
CONTEMPORANEOUS_SYNCHRONIZATION_ONLY.

If the purported leader state becomes known after follower predictor freeze:
POST_HOC_LEADER_NOT_ELIGIBLE.

If lead-lag direction is unresolved:
LEAD_LAG_DIRECTION_UNKNOWN.

## 4. Context classes

Frozen research states:

P0 SELF_STRUCTURE_CONTEXT_ONLY
P1 MARKET_INDEX_PRIOR_MOVE_PRESENT
P2 SECTOR_PRIOR_MOVE_PRESENT
P3 VERIFIED_LEADER_PRIOR_MOVE_PRESENT
P4 FUTURES_OR_ETF_PRICE_DISCOVERY_PRIOR_MOVE_PRESENT
P5 SUPPLY_CHAIN_PRIOR_MOVE_PRESENT
P6 CONTEMPORANEOUS_SYNCHRONIZATION_ONLY
P7 MULTIPLE_COMMON_DISCOVERY_CHANNELS
P8 LEAD_LAG_DIRECTION_UNKNOWN
P9 PRICE_DISCOVERY_DATA_BLOCKED

These are context states, not Pattern votes.

## 5. Leader identity

A "leader" cannot be chosen because it happened to move first on the successful examples.

Leader identity must come from a preregistered owner contract:
- sector leadership registry;
- size/liquidity leadership state;
- supply-chain relation;
- index/futures/ETF price-discovery relation;
- other deterministic pre-outcome relation.

Outcome-selected leaders are prohibited.

## 6. Same-bar synchronization

Same 15m/day return direction can reflect:
- common information;
- common factor beta;
- passive/index flow;
- synchronized reaction;
- non-synchronous trading artifacts;
- one asset leading another.

Without valid earlier knownAt:
same-bar synchronization contributes zero lead evidence.

It may remain as contemporaneous common-context diagnostic.

## 7. Nonsynchronous-trading firewall

Small/illiquid stocks can appear to lag large/liquid names mechanically.

Required context where owner data support it:
- liquidity tier;
- trading intensity;
- stale-price state;
- session gap;
- suspension/auction/limit state;
- last-trade freshness.

A lead-lag relation that disappears after these controls is:
NONSYNCHRONOUS_TRADING_EXPLANATION.

## 8. Sector/index synchronization

Preserve separately:
- broad index prior move;
- sector index prior move;
- sector breadth/participation;
- equal-weight vs cap-weight state;
- leader concentration;
- market/sector regime.

A stock move coincident with sector expansion may be common price discovery rather than stock-specific structural rejection.

## 9. Futures / ETF / basket channel

Where owner-certified:
- index futures can lead cash index;
- ETF/basket flow can transmit common movement;
- derivative/underlying discovery can be asymmetric by regime/liquidity.

D01 does not infer the direction from same-bar correlation.
Use owner-certified price-discovery receipt only.

## 10. Supply-chain / economic leader channel

A verified customer/supplier/industry leader may transmit information to followers.

D07 owner relation and knownAt rules apply.

Theme membership without verified relation:
not a causal leader receipt.

## 11. Generic comparator

Future comparison:

G0 COMMON_DISCOVERY_EVENT_AWAY_FROM_ZONE
- follower stock experiences owner-certified leader/sector/index prior move;
- no target structural-zone interaction.

G1 COMMON_DISCOVERY_EVENT_AT_ZONE
- comparable common discovery context at the structural zone.

If G1 adds no residual representation:
common price discovery is sufficient.

## 12. Zone event stratification

Z0 ZONE_NO_PRIOR_COMMON_DISCOVERY_RECEIPT
Z1 ZONE_WITH_MARKET_OR_SECTOR_PRIOR_MOVE
Z2 ZONE_WITH_VERIFIED_LEADER_PRIOR_MOVE
Z3 ZONE_WITH_FUTURES_ETF_PRIOR_DISCOVERY
Z4 ZONE_WITH_MULTIPLE_PRIOR_CHANNELS
Z5 ZONE_CONTEMPORANEOUS_ONLY
Z6 ZONE_DIRECTION_UNKNOWN

No prior receipt != no common influence.
UNKNOWN remains UNKNOWN.

## 13. Baseline vs post-treatment

Only price-discovery states known before predictorFreezeAt are baseline eligible.

Leader/sector/index movement that begins after follower structural opportunity is:
POST_OPPORTUNITY_COMMON_DISCOVERY.

It may mediate/amplify the response but cannot rewrite baseline attribution.

## 14. Direct-price ancestry

D03 warns that leader/follower relationships can reflect shared price trends.

Future D16 controls must include:
- follower direct return/trend;
- leader direct return/trend;
- market/sector return;
- D01 structure;
- D02 price-volume;
- D03 trend/momentum;
- D18 regime;
- liquidity/nonsynchronous trading.

No leader receipt automatically becomes independent evidence.

## 15. Independence / SDA-001

Leader price, sector price, market price and follower structure are often correlated PRICE_OHLC-derived representations.

Default:
effectiveIndependentEvidenceCount = 1 inside one parent unless D16 validates residual incrementality/dependence.

Different symbols do not automatically mean independent information.

## 16. No-lookahead / SDA-002

Each price-discovery receipt preserves:
- relationId;
- relationFrozenAt;
- leaderSignalFirstObservableAt;
- leaderSignalKnownAt;
- followerPredictorFreezeAt;
- replaySafe;
- relationVersion.

Any relation or leader identity selected after outcome:
POST_HOC_RELATION_NOT_ELIGIBLE.

## 17. Future D16 ladder

L0 RAW_ZONE_RESPONSE
L1 DL057_OWN_IMPACT_CONTROLLED
L2 DL058_INITIATING_INFORMATION_CONTROLLED
L3 DL059_EXTERNAL_FLOW_CONTROLLED
L4 MARKET_INDEX_PRIOR_MOVE_CONTROLLED
L5 SECTOR_PRIOR_MOVE_BREADTH_CONTROLLED
L6 VERIFIED_LEADER_PRIOR_MOVE_CONTROLLED
L7 FUTURES_ETF_PRICE_DISCOVERY_CONTROLLED
L8 NONSYNCHRONOUS_TRADING_CONTROLLED
L9 GENERIC_COMMON_DISCOVERY_COMPARATOR_CONTROLLED
L10 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
L11 MULTI_DATE_MULTI_SYMBOL_MULTI_RELATION_REPLICATION

Interpretation:

Q0 MARKET_COMMON_MOVE_EXPLANATION
Q1 SECTOR_SYNCHRONIZATION_EXPLANATION
Q2 LEADER_FOLLOWER_PROPAGATION_EXPLANATION
Q3 FUTURES_ETF_PRICE_DISCOVERY_EXPLANATION
Q4 NONSYNCHRONOUS_TRADING_EXPLANATION
Q5 MULTIPLE_COMMON_CHANNELS
Q6 STRUCTURAL_RESPONSE_RESIDUAL
Q7 DIRECTION_UNKNOWN
Q8 NOT_EVALUABLE

None authorizes Formal alpha.

## 18. Required manifest fields

- parentDecisionId;
- structuralRootId;
- symbol;
- sectorId;
- predictorFreezeAt;
- structuralOpportunityAt;
- relationId;
- relationType;
- relationFrozenAt;
- leaderSymbolOrIndex;
- leaderSignalFirstObservableAt;
- leaderSignalKnownAt;
- leaderDirection;
- marketPriorMoveState;
- sectorPriorMoveState;
- breadthState;
- futuresEtfDiscoveryState;
- supplyChainPriorMoveState;
- contemporaneousSynchronizationState;
- liquidityTier;
- stalePriceState;
- lastTradeFreshness;
- sessionConstraintState;
- leadLagDirectionState;
- replaySafe;
- ownerDomain;
- independentEvidenceStatus;
- dataBlockReason;
- manifestVersion/hash.

No future follower-return field belongs in this manifest.

## 19. Current decision

SAME_BAR_COMOVEMENT_EQUALS_LEAD =
FALSE.

OUTCOME_SELECTED_LEADER_ALLOWED =
FALSE.

DIFFERENT_SYMBOL_EQUALS_INDEPENDENT_EVIDENCE =
FALSE.

CONTEMPORANEOUS_SYNCHRONIZATION_IS_PREDICTIVE_EVIDENCE =
FALSE.

POST_OPPORTUNITY_LEADER_MOVE_IS_BASELINE =
FALSE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 20. Exact next continuation

1. Build deterministic lead-context eligibility / timing / nonsynchronous-trading helper and adversarial tests.
2. Preserve market, sector, leader, futures/ETF and supply-chain channels separately.
3. Consume D03/D07/breadth/rotation/D05 owner relations rather than creating D01 leader models.
4. Hand L0-L11 / Q0-Q8 common-price-discovery residual inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural response from index-weight / mega-cap mechanical contribution and constituent-arbitrage effects around market/sector moves.
7. No runtime wiring / no Formal change.
