# D01 DL-061 — Structural Response vs Index-Weight / Mega-Cap Mechanical Contribution V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / INDEX_WEIGHT_MECHANICS_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-060 separated structural response from common price discovery and leader/follower propagation.

DL-061 freezes a narrower but important attribution problem:

> A cap-weighted market or sector index can move because a small number of mega-cap constituents dominate index contribution, while index rebalancing / ETF / benchmark-linked flows can mechanically move those names and related constituents.

Therefore "market confirmation" near a stock's support/resistance cannot be interpreted without decomposing index concentration and passive-mechanical flow.

No future return outcome is opened in this tranche.

## 2. Owner boundaries

Passive Flow / Index Rebalancing research owns:
- index event taxonomy;
- announcement/effective clocks;
- weight changes;
- passive-flow proxies;
- ETF benchmark mechanics;
- closing-auction benchmark execution;
- event deduplication.

Breadth/Rotation research owns:
- cap-weight vs equal-weight decomposition;
- participation breadth;
- leadership concentration;
- sector breadth / leadership states.

D01 owns only:
- whether structural-zone interpretation survives these owner-certified contexts.

D01 does not build an index provider model or passive-flow estimator.

## 3. Five contexts remain separate

A. SELF_STRUCTURAL_STATE
B. CAP_WEIGHTED_INDEX_MOVE
C. EQUAL_WEIGHT / BREADTH PARTICIPATION
D. MEGA_CAP_CONTRIBUTION_CONCENTRATION
E. PASSIVE / INDEX-MECHANICAL FLOW

No composite "market confirms pattern" score is defined.

## 4. Index move is not breadth

A positive cap-weighted index return can coexist with:
- weak median stock;
- weak advance share;
- weak equal-weight return;
- one or few mega-cap leaders.

Required owner receipts where available:
- capWeightedReturn;
- equalWeightedReturn;
- medianMemberReturn;
- advanceShare;
- top1ContributionShare;
- top3ContributionShare;
- top10ContributionShare;
- leadershipConcentrationState.

If only cap-weighted index return exists:
MARKET_CONFIRMATION_BREADTH_UNKNOWN.

## 5. Contribution identity

Index contribution should be conceptually separated:

indexContribution_i = indexWeight_i * constituentReturn_i

D01 does not recompute official index methodology when owner receipts exist.

Event-date / as-of weights are required.
Current weights cannot backfill historical contribution.

Missing historical weight:
INDEX_WEIGHT_UNKNOWN.

## 6. Mega-cap mechanical dominance

Frozen context states:

W0 BROAD_MARKET_CONFIRMATION
W1 NARROW_MEGA_CAP_LED_CONFIRMATION
W2 MIXED_PARTICIPATION
W3 CAP_WEIGHTED_UP_EQUAL_WEIGHT_WEAK
W4 INDEX_CONTRIBUTION_UNKNOWN
W5 INDEX_WEIGHT_DATA_BLOCKED

These are diagnostics, not directional signals.

## 7. Passive-flow / rebalance context

Consume owner states such as:
- NO_INDEX_EVENT;
- ANNOUNCED_PRE_EFFECTIVE;
- EFFECTIVE_REBALANCE;
- POST_EFFECTIVE_NORMALIZATION;
- INDEX_WEIGHT_UP/DOWN;
- MULTI_INDEX_OVERLAP;
- EXPIRY_OVERLAP;
- EVENT_DATA_INCOMPLETE.

No state maps directly to BUY/SELL.

## 8. Mechanical contribution vs independent confirmation

If a target stock is itself a large index constituent:
- its own price move contributes to the index;
- using the index move as independent confirmation creates self-inclusion.

Required state:
CANDIDATE_SELF_INCLUDED_IN_INDEX_CONTEXT.

Such context cannot count as an independent Pattern vote.

## 9. Ex-candidate context

Where methodologically valid, future D16 analysis may use:
- ex-candidate index return;
- ex-candidate sector return;
- ex-top1 / ex-top3 contribution context;
- equal-weight and breadth states.

These are controls/sensitivity views, not automatic new signals.

## 10. Index event timing

Announcement, anticipation, effective close and normalization are different clocks.

Required fields from owner:
- announcedAt;
- firstKnownAt;
- effectiveAt;
- eventPhase;
- oldWeight;
- newWeight;
- eventVersion.

No retrospective "obvious future inclusion" labels.

## 11. Mechanical flow does not equal zero economic impact

Passive/index demand can:
- consume liquidity;
- move clearing price;
- attract anticipatory trading;
- change closing-auction imbalance;
- reverse later.

Mechanical does not mean irrelevant.

It means the causal channel is not stock-specific structural memory.

## 12. Generic comparator

Future comparison:

G0 INDEX_CONCENTRATION_OR_PASSIVE_EVENT_AWAY_FROM_ZONE
G1 SAME_CONTEXT_AT_STRUCTURAL_ZONE

If G1 adds no residual representation:
index mechanics/common participation context is sufficient.

## 13. Market confirmation stratification

M0 ZONE_WITH_BROAD_MARKET_CONFIRMATION
M1 ZONE_WITH_NARROW_MEGA_CAP_CONFIRMATION
M2 ZONE_WITH_CAP_WEIGHTED_ONLY_CONFIRMATION
M3 ZONE_WITH_PASSIVE_REBALANCE_CONTEXT
M4 ZONE_WITH_CANDIDATE_SELF_INCLUDED_INDEX
M5 ZONE_WITH_INDEX_CONTEXT_UNKNOWN

Unknown remains unknown.

## 14. Same-information / SDA-001 firewall

Target stock price, index price and sector price can share:
- the target stock itself;
- mega-cap common drivers;
- passive flows;
- common information.

Therefore:
index confirmation != independent evidence by default.

effectiveIndependentEvidenceCount remains 1 inside the same parent unless D16 validates residual information after self-inclusion/common-factor controls.

## 15. SDA-002 timing

Every index/passive receipt must preserve:
- firstObservableAt;
- knownAt;
- predictorFreezeAt;
- eventPhaseKnownAt;
- historicalWeightKnownAt;
- replaySafe.

Later published or revised index weights cannot backfill earlier predictors.

## 16. Future D16 ladder

I0 RAW_ZONE_RESPONSE
I1 DL060_COMMON_PRICE_DISCOVERY_CONTROLLED
I2 CAP_WEIGHT_VS_EQUAL_WEIGHT_DECOMPOSED
I3 LEADERSHIP_CONCENTRATION_CONTROLLED
I4 EX_CANDIDATE_INDEX_CONTEXT_CONTROLLED
I5 PASSIVE_REBALANCE_CONTEXT_CONTROLLED
I6 CLOSING_AUCTION_EXPIRY_OVERLAP_CONTROLLED
I7 GENERIC_INDEX_MECHANICS_COMPARATOR_CONTROLLED
I8 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
I9 MULTI_DATE_MULTI_INDEX_MULTI_CONCENTRATION_REPLICATION

Interpretation:

Q0 BROAD_MARKET_CONTEXT_EXPLANATION
Q1 MEGA_CAP_CONCENTRATION_EXPLANATION
Q2 SELF_INCLUSION_EXPLANATION
Q3 PASSIVE_REBALANCE_EXPLANATION
Q4 AUCTION_EXPIRY_MECHANICAL_EXPLANATION
Q5 STRUCTURAL_RESPONSE_RESIDUAL
Q6 INDEX_CONTEXT_UNKNOWN
Q7 NOT_EVALUABLE

None authorizes Formal alpha.

## 17. Required manifest fields

- parentDecisionId;
- structuralRootId;
- symbol;
- predictorFreezeAt;
- structuralOpportunityAt;
- indexId;
- sectorIndexId;
- historicalIndexWeight;
- historicalIndexWeightKnownAt;
- capWeightedReturn;
- equalWeightedReturn;
- medianMemberReturn;
- advanceShare;
- top1ContributionShare;
- top3ContributionShare;
- leadershipConcentrationState;
- candidateSelfIncluded;
- exCandidateReturnReceipt;
- passiveEventState;
- announcedAt;
- effectiveAt;
- eventPhase;
- oldWeight;
- newWeight;
- expiryOverlapState;
- closingAuctionContext;
- ownerDomain;
- replaySafe;
- dataBlockReason;
- manifestVersion/hash.

No future stock-return field belongs in this manifest.

## 18. Current decision

CAP_WEIGHTED_INDEX_UP_EQUALS_BROAD_CONFIRMATION =
FALSE.

INDEX_CONFIRMATION_EQUALS_INDEPENDENT_PATTERN_VOTE =
FALSE.

CURRENT_INDEX_WEIGHT_CAN_BACKFILL_HISTORY =
FALSE.

CANDIDATE_SELF_INCLUDED_INDEX_IS_INDEPENDENT_CONFIRMATION =
FALSE.

PASSIVE_FLOW_EQUALS_FUNDAMENTAL_OR_STRUCTURAL_ALPHA =
FALSE.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 19. Exact next continuation

1. Build deterministic contribution/self-inclusion/participation-context helper and adversarial tests.
2. Preserve cap-weighted, equal-weight, breadth, contribution concentration and passive-flow states separately.
3. Consume Passive Flow / Breadth owners without duplicate models.
4. Hand I0-I9 / Q0-Q7 residual inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural response from closing-auction / opening-auction price formation so auction-clearing mechanics are not mislabeled as pattern confirmation.
7. No runtime wiring / no Formal change.
