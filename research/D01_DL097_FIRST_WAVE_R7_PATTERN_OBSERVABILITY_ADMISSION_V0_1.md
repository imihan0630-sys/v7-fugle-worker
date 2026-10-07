# D01 DL-097 — First-Wave R7 Pattern Observability Admission V0.1

Updated: 2026-10-07 Asia/Taipei
Status: R7_SCHEMA_FROZEN / EMISSION_BLOCKED_PENDING_R1_R6 / FORMAL_CORE_LOCKED

## Purpose

Complete the D01-owned side of the first historical composability witness before owner receipts arrive.

R7 is not a source-data receipt.
It is the deterministic proof that a D01 pattern representation was observable at predictor freeze from the exact admitted source bars.

Supported first-wave modules:
- D01-02 single-candle morphology;
- D01-03 multi-candle sequence;
- D01-07 cup/base/handle lifecycle;
- D01-09 gap/price-limit pattern.

## Mandatory upstream gate

R7 may be admitted only when R1-R6 are all PASS for the same witness identity and exact window.

No partial-credit path exists.

If any upstream family is UNKNOWN/PENDING/BLOCKED:
R7_EMISSION_BLOCKED.

## Common R7 fields

- moduleId;
- featureVersion;
- witnessRequestId;
- market;
- symbol;
- targetDate;
- predictorFreezeAt;
- firstObservableAt;
- requiredSourceBarIds;
- exactSessionHash;
- sourceHistoryHash;
- informationRoot;
- redundancyGroup;
- featureState;
- deterministicFeatureHash;
- replaySafe;
- outcomeFieldsPresent=false.

## Clock semantics

firstObservableAt may equal predictorFreezeAt.

It may not be later than predictorFreezeAt.

For multi-bar or lifecycle patterns:
firstObservableAt is the availability time of the final required source observation / state transition needed for that exact representation, not the start of the pattern.

## Module-specific minimum semantics

### D01-02
- one or more exact source bars;
- continuous normalized OHLC geometry;
- named candlestick label is optional metadata only;
- informationRoot = PRICE_OHLC.

### D01-03
- ordered N-bar sourceBarIds;
- final required bar sets firstObservableAt;
- overlapping aliases do not create extra independent evidence;
- informationRoot = PRICE_OHLC.

### D01-07
- lifecycle state must be as-of observable;
- no retrospective backpainting;
- candidate/valid/mature/break/failure/expiry state retained;
- informationRoot remains rooted in PRICE_OHLC plus explicitly bound admissible context.

### D01-09
- raw gap geometry must be separated from legal price-limit/reference context;
- R5 must already be PASS;
- price-limit or corporate-action ambiguity cannot be hidden inside the feature label.

## Valid feature states

NO_STRUCTURE
STRUCTURE_EMITTED
DATA_BLOCKED

NO_STRUCTURE is a valid completed R7 result.
R7 does not need a positive signal.

DATA_BLOCKED is required when D01's own deterministic source requirements fail even after upstream owner receipts pass.

## Hash semantics

deterministicFeatureHash must bind the canonical feature payload:
- moduleId/version;
- witness identity;
- ordered requiredSourceBarIds;
- exactSessionHash;
- sourceHistoryHash;
- predictor/observable clocks;
- informationRoot/redundancyGroup;
- featureState;
- deterministic feature values/labels.

The hash cannot be a caller-supplied decorative label.
The producing runtime must use the canonical payload and a repository-standard cryptographic digest.

This tranche freezes validation semantics but does not fabricate a physical hash before the 2021 source bars are returned.

## Outcome firewall

R7 payload must not contain:
- future return;
- MFE;
- MAE;
- later fill/revisit result;
- later pattern success;
- later strategy selection;
- D16 inference.

Any such field:
R7_OUTCOME_CONTAMINATED.

## Current decision

R7_SCHEMA_FROZEN = TRUE.
R7_VALIDATOR_READY = TRUE.
R7_PHYSICAL_EMISSION = BLOCKED_PENDING_R1_R6.
FIRST_WAVE_MODULES = D01-02 / D01-03 / D01-07 / D01-09.
OUTCOME_JOIN = CLOSED.
L4_PROMOTION = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Wait for/cross-check exact 2021 R1-R6 owner bundle.
2. On PASS, form one R7 for each first-wave module that is evaluable from the exact admitted bars.
3. Keep NO_STRUCTURE in the denominator.
4. Only after at least one complete R1-R7 witness exists may interface composability become PASS.
5. Still do not open outcomes until D16 receives the frozen DL-087/DL-089 handoff.
