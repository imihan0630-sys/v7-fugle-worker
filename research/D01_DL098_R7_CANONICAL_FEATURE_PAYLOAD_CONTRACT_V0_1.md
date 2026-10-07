# D01 DL-098 — R7 Canonical Feature Payload Contract V0.1

Updated: 2026-10-07 Asia/Taipei
Status: OUTCOME_BLIND / R7_CANONICAL_PAYLOAD_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze the exact D01-owned payload that may be hashed into an R7 pattern-observability receipt after the owner R1-R6 bundle passes.

The payload must preserve transparent raw geometry and lifecycle state.
Named chart/candlestick labels remain metadata and may not create independent evidence.

## Canonical hash semantics

R7 uses the repository-standard canonical JSON / SHA-256 semantics already used by System2 decision/archive code:
- object keys sorted recursively;
- array order preserved;
- exact numeric values preserved;
- canonical JSON serialized;
- SHA-256 applied to that canonical payload.

A caller-provided decorative hash is invalid.

The physical producer is not opened in this tranche because the 2021 R1-R6 source bundle is still pending.

## Common payload

Required:
- schemaVersion;
- moduleId;
- featureVersion;
- witnessRequestId;
- market;
- symbol;
- targetDate;
- predictorFreezeAt;
- firstObservableAt;
- ordered requiredSourceBarIds;
- exactSessionHash;
- sourceHistoryHash;
- informationRoot;
- redundancyGroup;
- featureState;
- featureValues;
- aliasLabels;
- lifecycleState;
- contextRefs;
- replaySafe=true;
- outcomeFieldsPresent=false.

Allowed feature states:
- NO_STRUCTURE;
- STRUCTURE_EMITTED;
- DATA_BLOCKED.

NO_STRUCTURE is a complete research observation.
It must not be dropped from the denominator.

## D01-02 single-candle payload

Continuous geometry is primary:
- signedBodyToRange;
- bodyToRange;
- upperWickToRange;
- lowerWickToRange;
- closeLocationInRange;
- rangeOverReferencePrice;
- openToReferencePrice;
- closeToReferencePrice.

Named labels such as hammer/doji/engulfing-derived aliases are metadata only.

informationRoot:
PRICE_OHLC.

One source bar may carry many aliases but still contributes one independent geometry root.

## D01-03 multi-candle sequence payload

Primary fields:
- ordered per-bar normalized OHLC geometry;
- ordered inter-bar open-gap relation;
- high/low containment/overlap relation;
- body overlap/engulfment relation;
- close progression;
- exact ordered sourceBarIds;
- sequence length.

The last required bar availability sets firstObservableAt.

Named sequences are metadata over the same ordered geometry and do not create extra votes.

informationRoot:
PRICE_OHLC.

## D01-07 cup/base/handle payload

Primary online geometry/lifecycle fields:
- baseEpisodeId;
- lifecycleState;
- baseStartBarId;
- leftRimBarId if observable;
- troughBarId if observable;
- rightRimBarId if observable;
- handleStartBarId if observable;
- widthEligibleSessions;
- depthRatio;
- recoveryRatio;
- rimSymmetryRatio;
- troughResidenceRatio;
- handleDepthRatio if observable;
- breakoutDistanceRatio if observable;
- priorTrendGeometry;
- rangeCompressionGeometry;
- genericBreakoutGeometry.

No retrospective backpainting is permitted.
Unavailable future anchor IDs remain null rather than being filled later into an earlier receipt.

Volume dry-up is not silently added here; cross-domain volume context belongs to D02 and must arrive as a separate context receipt if later tested.

## D01-09 gap / price-limit payload

Primary fields:
- priorEligibleClose;
- currentOpen;
- rawGap;
- rawGapPct;
- gapCauseClass;
- referencePrice;
- upperLimitPrice;
- lowerLimitPrice;
- openingDistanceFromReferencePct;
- openingDistanceToUpperLimitPct;
- openingDistanceToLowerLimitPct;
- priceLimitContextState;
- suspensionContextState;
- corporateActionContextState.

R5 must already be PASS.
A legal-limit/reference-state ambiguity forces DATA_BLOCKED for price-limit-dependent interpretation.

## Numerical semantics

Ratios are deterministic numeric features, not hand-bucketed bullish/bearish labels.

Hard thresholds used only for display aliases do not become extra alpha features unless separately preregistered as experiments.

Zero-range/invalid OHLC remains DATA_BLOCKED or the explicit zero-range state defined by the underlying detector.

## Outcome firewall

The R7 canonical payload may not contain:
- D1/D5/D20 return;
- MFE/MAE;
- later fill;
- later revisit;
- later confirmation not observable at freeze;
- later success/failure used to rewrite the earlier state;
- strategy selection/rank/capital/order result.

## Current decision

R7_CANONICAL_PAYLOAD_FROZEN = TRUE.
NAMED_LABELS_ARE_METADATA = TRUE.
CONTINUOUS_GEOMETRY_IS_PRIMARY = TRUE.
PHYSICAL_R7_HASH = PENDING_R1_R6.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
