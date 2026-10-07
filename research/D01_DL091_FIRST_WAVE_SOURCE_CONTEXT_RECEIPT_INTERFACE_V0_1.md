# D01 DL-091 — First-Wave Source / Context Receipt Interface V0.1

Updated: 2026-10-07 Asia/Taipei
Status: PREOUTCOME_INTERFACE_FROZEN / FAIL_CLOSED / FORMAL_CORE_LOCKED

## Purpose

Freeze the minimum receipt interface D01 requires from existing data owners before the DL-089 bounded TWSE manifest may open OOS outcomes.

D01 consumes these receipts.
D01 does not become the source authority for them.

## Common receipt envelope

Every receipt family must provide:
- receiptId;
- receiptVersion;
- market;
- symbol;
- effectiveFrom;
- effectiveToExclusive or point date;
- firstObservableAt;
- observedAt;
- sourceId;
- sourceVersion;
- sourceHash;
- replaySafe;
- completenessScope;
- state.

Rules:
- firstObservableAt <= predictorFreezeAt for predictor/context use;
- source absence does not imply a clean/normal state;
- UNKNOWN is preserved;
- later revisions append versions and never rewrite prior first-known state.

## R1 Point-in-time membership receipt

Required:
- registryId;
- registryHash;
- membershipStart;
- membershipEndExclusive;
- membershipStateAtDate;
- replayEligible;
- futureDelistingHidden;
- securityIdentity;
- listingAgeEligibleSessions.

Acceptable:
MEMBER_ON_DATE
NOT_MEMBER_ON_DATE
HISTORY_TOO_SHORT_BY_DESIGN

Blocked:
MEMBERSHIP_UNKNOWN
FUTURE_DELISTING_LEAK
CURRENT_LIST_BACKFILL

## R2 Raw A1 observation receipt

Required:
- marketDate;
- open;
- high;
- low;
- close;
- volume;
- transactions where source supports it;
- observationState;
- sourceRowHash;
- canonicalBarHash;
- availableAt;
- availabilityBasis.

Acceptable price observations require:
VALID_OHLC.

Non-price or missing-close observations remain explicit DATA_BLOCKED states.

## R3 Symbol-session lifecycle receipt

Required:
- officialMarketSession;
- symbolExpectedToTrade;
- lifecycleState;
- eventType;
- eventId;
- effectiveFrom;
- effectiveToExclusive;
- sourceFamily;
- sourceHash;
- coverageCompleteForSymbolDate.

Legal lifecycle classes:
NORMAL_ELIGIBLE_SESSION
NOT_A_MEMBER_ON_DATE
OFFICIAL_REGULATORY_NO_TRADING_INTERVAL
OFFICIAL_LISTING_OR_MIGRATION_BOUNDARY
UNKNOWN_SYMBOL_SESSION_GAP

Only NORMAL_ELIGIBLE_SESSION may certify ordinary adjacency.
UNKNOWN may not be collapsed into normal.

## R4 Corporate-action continuity receipt

Required:
- continuityReceiptId;
- actionType;
- actionEventId;
- actionFirstKnownAt;
- effectiveDate;
- rawExecutionState;
- technicalContinuityState;
- continuityTransformVersion;
- continuityTransformHash;
- eventCoverageState;
- securityIdentityTransitionState.

Acceptable:
CLEAR_NO_ACTION only when event coverage is complete for the exact window;
or VERIFIED_TRANSFORM with replay-safe event lineage.

Blocked:
EVENT_COVERAGE_UNKNOWN
ACTION_CLOCK_UNKNOWN
TRANSFORM_UNKNOWN
IDENTITY_TRANSITION_UNKNOWN

## R5 Price-limit / reference-price receipt

Required:
- ruleVersion;
- referencePrice;
- upperLimitPrice;
- lowerLimitPrice;
- specialReferenceState;
- noLimitState;
- closeBoundaryState;
- sourceId;
- sourceHash;
- firstObservableAt.

Acceptable context states may include:
ORDINARY_LIMIT_REGIME
SPECIAL_REFERENCE_LIMIT_REGIME
NO_LIMIT_SPECIAL_REGIME

Unknown legal reference state blocks D01-09 primary inference.

Daily boundary touch does not prove queue lock or executability.

## R6 Disposition / matching-regime receipt

Required:
- dispositionEventId or certifiedNormalReceiptId;
- dispositionStartDate;
- dispositionEndDate;
- matchingCadenceSeconds;
- changedTradingMethodFlag;
- prepaymentRule;
- marginRestriction;
- firstKnownAt;
- sourceHash;
- coverageCompleteForSymbolDate.

Acceptable:
CERTIFIED_NORMAL_MATCHING
VERIFIED_DISPOSITION_MATCHING

Blocked:
DISPOSITION_MATCHING_REGIME_UNKNOWN

Source non-match may certify normal only when the source coverage scope itself is complete.

## R7 Pattern observability receipt

Owned by D01.

Required:
- moduleId;
- featureVersion;
- requiredSourceBarIds;
- firstObservableAt;
- predictorFreezeAt;
- lifecycleState;
- informationRoot;
- redundancyGroup;
- deterministicFeatureHash.

No pattern feature may be known before its final required source observation.

## R8 Outcome-availability receipt

Owned by D16/data outcome lane.

Required:
- parentDecisionId;
- horizonEligibleSessions;
- outcomeWindowStart;
- outcomeWindowEnd;
- terminal/censoring state;
- source identity;
- outcomeAvailableAt.

This receipt remains inaccessible to D01 feature formation.

## R9 D16 validation-policy receipt

Required:
- experimentId;
- protocolVersion;
- foldPlanHash;
- horizonSetHash;
- commonParentComparatorHash;
- multiplicityPolicyHash;
- searchRegistryHash;
- finalHoldoutYear;
- finalHoldoutLocked;
- noPostHoldoutTuning.

Must match DL-087 and DL-089 fingerprints.

## Bundle readiness

One D01 first-wave observation is OOS-executable only when:
- R1 membership is valid;
- R2 valid price observation exists;
- R3 lifecycle is causally classified;
- R4 continuity is clear or verified;
- R5 price-limit context is known;
- R6 matching regime is known;
- R7 pattern is observable at predictor freeze;
- R8 future outcome window is available only to D16;
- R9 policy fingerprint matches.

Any UNKNOWN mandatory predictor/context receipt:
CAUSAL_OOS_BLOCKED.

## Current decision

RECEIPT_INTERFACE_FROZEN = TRUE.
PHYSICAL_RECEIPT_COMPLETENESS = FALSE.
OOS_EXECUTION_READY = FALSE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Data owners can return physical receipts without changing D01 feature semantics.
2. D16 can bind R8/R9 only after R1-R7 pass.
3. DL-092 should audit whether current repository artifacts can already satisfy any complete R1-R7 exact-window bundle on a bounded positive-control sample without opening returns.
4. If no complete bundle exists, preserve BLOCKED and do not fabricate a clean sample.
