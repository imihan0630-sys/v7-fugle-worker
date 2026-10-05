# D01 DL-046 — Structural Memory vs Price-by-Volume Concentration V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / PRICE_VOLUME_PROFILE_FIREWALL / SDA_001_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-045 separated structural history from round-number / tick-grid salience.

DL-046 addresses another common confluence claim:

> A structural support/resistance zone that also contains heavy historical traded volume is often described as "stronger" because two confirmations agree.

That interpretation is not automatically valid.

Price-by-volume concentration contains an additional VOLUME_TURNOVER primitive, but it is still constructed jointly with price. It may overlap mechanically with:
- time spent near the level;
- price range / consolidation;
- repeated structural interactions;
- liquidity;
- D02 acceptance / persistence;
- session/event concentration.

Volume-at-price must therefore be treated as a residual candidate, not an automatic second vote.

No return outcome is opened in this tranche.

## 2. Canonical owner boundary

D02 owns PRICE_BY_VOLUME_PROFILE semantics.

D01 consumes only D02-certified receipts.

D01 does not redefine:
- point of control;
- high-volume node;
- low-volume node;
- value area;
- binning algorithm;
- bid/ask classification;
- regular-lot / odd-lot profile semantics.

If D02 has not certified a node/profile definition:
PROFILE_SEMANTICS_UNKNOWN.

## 3. Current Taiwan data boundary

D02 has frozen that the current provider supports a current-day intraday price-by-volume profile with:
- transaction price;
- cumulative volume at that price;
- optional provider-classified volumeAtBid / volumeAtAsk;
- odd-lot as a separate market-data type.

Critical limitation:
historical immutable OOS depth for PRICE_BY_VOLUME_PROFILE is NOT established by the current endpoint.

Therefore:
- current/prospective PIT profile study is feasible;
- historical performance inference from exact profiles remains blocked unless an approved historical source is established;
- retrospective approximation from OHLC/minute-bar typical prices cannot be relabeled as canonical price-by-volume profile.

## 4. Profile clock

Every profile snapshot must store:
- profileAsOf;
- sourceFetchedAt;
- featureKnownAt;
- predictorFreezeAt;
- source/version;
- marketType;
- session coverage;
- profileDefinitionVersion.

For predictor eligibility:

featureKnownAt <= predictorFreezeAt
AND
sourceFetchedAt <= predictorFreezeAt
AND
profileAsOf <= predictorFreezeAt.

A full-day profile fetched after the close cannot be used as an opening or intraday predictor for the same day.

## 5. Historical reconstruction prohibition

Prohibited unless separately certified by D02:
- assign an entire 1m/5m/15m candle volume to close;
- assign candle volume to typical price;
- uniformly spread candle volume across high-low;
- infer historical POC from daily OHLCV;
- reconstruct bid/ask volume from candle direction.

Such approximations may be separate simulation objects with explicit names.
They cannot be labeled canonical PRICE_BY_VOLUME_PROFILE.

## 6. Information lineage

Structural geometry:
informationRoot = PRICE_OHLC.

Canonical price-by-volume profile:
informationRoots = PRICE_OHLC + VOLUME_TURNOVER.

Because it contains an additional primitive, it is not forced into SAME_ROOT_REDUNDANT.

But multi-root does not prove independence.

Default:
independenceStatus = PARTIAL_OVERLAP;
residualIncrementalityStatus = NOT_VALIDATED;
independentVoteAllowed = false;
effectiveIndependentEvidenceCount = 1 for stock-selection confluence diagnostics until D16 establishes residual contribution.

This implements the canonical System Alpha Lineage guard.

## 7. Structural/profile coincidence states

D01 consumes D02 owner-supplied node identity and geometry.

Frozen research states:

### V0 — STRUCTURE_WITHOUT_PROFILE_NODE
Certified structural zone, no eligible owner-supplied profile node overlapping the zone at predictor freeze.

### V1 — PROFILE_NODE_WITHOUT_STRUCTURE
Eligible D02 profile node, no certified D01 structure.

### V2 — STRUCTURE_AND_PREEXISTING_PROFILE_NODE
Both exist and the relevant profile node was already known before / no later than structural confirmation under the chosen causal design.

### V3 — STRUCTURE_AND_POSTFORMATION_PROFILE_NODE
Profile concentration accumulated after the structural root/role became established and before a later test opportunity.

This can be a post-treatment mediator / path state.

### V4 — PROFILE_CONFIRMED_AFTER_TEST
Relevant profile node is only known after the tested predictor/opportunity.

Post hoc for that test.

### V5 — PROFILE_CONTEXT_UNKNOWN
Profile source, clock, node definition or coverage is incomplete.

## 8. Spatial overlap does not define causality

Allowed descriptors:
- node center price;
- node lower / upper;
- overlap width with structural zone;
- center distance in price / ATR / ticks;
- node share of observed profile volume if D02 owner supplies it;
- profile entropy / concentration only if D02 owner defines it.

A node overlapping the structure does not tell whether:
- volume caused the apparent barrier;
- structure caused traders to spend time/volume there;
- both share a third cause.

No causal claim follows from overlap alone.

## 9. Time-at-price / dwell confound

High price-by-volume concentration can arise because price simply spent more time near a level.

Therefore future inference must control, where available, for:
- time / bars spent in the price neighborhood;
- number of structural interactions;
- eligible-session age;
- range / volatility;
- turnover/liquidity;
- session state.

A high-volume node may otherwise be a disguised dwell-time feature.

## 10. Interaction-count confound

Repeated tests of a structural zone naturally create more transactions near that zone.

Therefore:
priorInteractionCount / priorBounceCount / opportunity count from DL-031 cannot be omitted.

If the profile node disappears as an incremental predictor after those controls:
PROFILE_CONCENTRATION_REDUNDANT_WITH_INTERACTION_HISTORY.

## 11. Round/tick/reference confounds

DL-044 and DL-045 remain required.

A high-volume node may occur:
- at a round number;
- at prior close;
- at auction reference;
- at a tick-band transition;
- in the opening auction.

These contexts may themselves attract volume.

Do not attribute the concentration automatically to structural memory.

## 12. Session / event confounds

D02 already warns:
- opening volume can reflect auction/information concentration;
- closing volume can reflect benchmark/rebalance flow;
- current full-session profile coverage may be incomplete under existing capture.

DL-042 and DL-043 event/session controls therefore remain mandatory.

## 13. Provider bid/ask classification caveat

Provider volumeAtBid / volumeAtAsk coverage may be less than total volume by design, including opening-auction treatment.

Unclassified volume remains explicit.

Do not allocate missing classified volume to buyers or sellers.

D01 does not infer aggressor intent from the profile.

## 14. Node-definition multiplicity

Different profile bin widths / value-area rules / node algorithms can produce different "important levels."

Any such algorithm family must be preregistered by D02 and handed to D16 as one multiple-testing family.

D01 does not outcome-select:
- best bin width;
- best node threshold;
- best value-area percentage;
- best lookback window.

## 15. Preexisting vs post-treatment profile

This is a critical causal split.

For a structural confirmation at T0:

PREEXISTING_PROFILE:
profile concentration measured only from data whose information clock precedes T0.

POSTFORMATION_PROFILE:
volume accumulated after T0.

If future structural response is tested at T1 > T0:
POSTFORMATION_PROFILE is known at T1 if captured, but it may mediate the effect of the existing structure.

Therefore future D16 must distinguish:
- total structural effect;
- path/profile-conditional effect.

Do not casually control away a post-treatment mediator and call the estimand unchanged.

## 16. Future comparator families

P0 STRUCTURE_ONLY

P1 PROFILE_ONLY

P2 STRUCTURE_PLUS_PREEXISTING_PROFILE

P3 STRUCTURE_PLUS_POSTFORMATION_PROFILE

P4 ROUND_REFERENCE_PROFILE_CONTROLLED

P5 DWELL_INTERACTION_CONTROLLED

P6 PRICE_ONLY_VS_PRICE_VOLUME_RESIDUAL

P7 PROSPECTIVE_PROFILE_REPLICATION

Future interpretations:

C0 STRUCTURE_EXPLANATION

C1 PROFILE_CONCENTRATION_EXPLANATION

C2 DWELL_TIME_EXPLANATION

C3 INTERACTION_HISTORY_EXPLANATION

C4 ROUND_REFERENCE_SESSION_EXPLANATION

C5 PRICE_VOLUME_RESIDUAL_CANDIDATE

C6 MEDIATED_PROFILE_PATH

C7 NOT_EVALUABLE

None proves alpha.

## 17. Prospective-only boundary

Because current canonical historical profile depth is not established:

Any future performance claim requiring exact historical PRICE_BY_VOLUME_PROFILE must remain:
HISTORICAL_PROFILE_DATA_BLOCKED

until D02 provides an approved historical source.

Prospective current-day profile receipts may be accumulated going forward.

No historical Shadow rows may be fabricated.

## 18. Common support

Future comparison requires overlap in:
- structural age;
- interaction history;
- dwell/time-at-price;
- price range / volatility;
- turnover / liquidity;
- session state;
- event state;
- round/tick/reference context;
- market/sector regime;
- profile coverage.

Failure:
PRICE_VOLUME_PROFILE_EXTRAPOLATION_PROHIBITED.

## 19. Required manifest fields

Per parent / opportunity:
- parentDecisionId;
- symbol;
- predictorFreezeAt;
- structuralRootId;
- structuralVersionId;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- structuralConfirmedAt;
- d02ProfileReceiptId;
- profileDefinitionVersion;
- profileAsOf;
- sourceFetchedAt;
- featureKnownAt;
- profileMarketType;
- profileSessionCoverage;
- profileCoverageState;
- nodeId;
- nodeType;
- nodeLower;
- nodeUpper;
- nodeCenter;
- nodeVolume;
- nodeVolumeShare if owner-supplied;
- structuralNodeOverlapWidth;
- structuralNodeCenterDistancePrice;
- structuralNodeCenterDistanceAtr;
- structuralNodeCenterDistanceTicks;
- profileTimingClass;
- priorInteractionCount;
- dwellReceipt;
- turnoverLiquidityReceipt;
- roundTickReceipt;
- priorCloseAuctionReferenceReceipt;
- sessionReceipt;
- eventReceipt;
- informationRoots;
- independenceStatus;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- historicalProfileSourceState;
- manifestVersion/hash.

No future-response outcome belongs in this manifest.

## 20. Current decision

PROFILE_NODE_EQUALS_STRUCTURE =
FALSE.

PROFILE_VOLUME_EQUALS_INDEPENDENT_VOTE =
FALSE.

MULTI_ROOT_EQUALS_INDEPENDENCE =
FALSE.

MINUTE_BAR_APPROXIMATION_EQUALS_CANONICAL_PROFILE =
FALSE.

FULL_DAY_PROFILE_CAN_BACKFILL_INTRADAY_PREDICTOR =
FALSE.

POSTFORMATION_PROFILE_IS_BASELINE_CONFOUNDER =
FALSE.

HISTORICAL_PROFILE_SOURCE_STATE =
NOT_ESTABLISHED.

INDEPENDENCE_STATUS =
PARTIAL_OVERLAP.

RESIDUAL_INCREMENTALITY_STATUS =
NOT_VALIDATED.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

SDA_001_STATUS =
REMEDIATION_IN_PROGRESS.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 21. Exact next continuation

1. Build deterministic profile-clock eligibility, structural-node overlap and lineage diagnostics.
2. Add adversarial tests for full-day backfill, minute-bar fake reconstruction, post-treatment profile control and missing provider classification.
3. Hand P0-P7 / C0-C7 price-vs-price-volume residual inference to D16.
4. Consume D02 owner-defined node/profile semantics without redefining POC/HVN/LVN in D01.
5. Preserve historical performance as DATA_BLOCKED until D02 establishes an approved historical profile source.
6. Preserve SDA-001 as REMEDIATION_IN_PROGRESS until residual/system/00 closure evidence exists.
7. Next D01 science: separate price-by-volume concentration from simple time-at-price / market-profile occupancy so high-volume and high-dwell zones are not treated as two independent confirmations.
8. No outcome join / no runtime wiring / no Formal change.
