# Execution Alpha Prospective Coverage Manifest v0.1

Status: CLASS_A_RESEARCH_ONLY
Formal Core: LOCKED
Purpose: freeze evidence requirements before any policy-value outcome test.

## Parent action
Required:
- parentActionId
- tradeDate
- symbol
- actionType: FIRST | ADD | REDUCE | RE_ADD
- strategy: A | B
- pool
- regime
- liquidityStratum
- decisionKnownAt
- intendedShares
- decisionReferencePrice
- decisionReferenceType
- maturityHorizon
- eventCoverageStatus
- finalLifecycleStatus
- evidenceQuality

## Lot legs
Every intended action decomposes deterministically:
- REGULAR shares = floor(intendedShares / 1000) * 1000
- ODD_LOT shares = intendedShares % 1000

For each non-zero leg require:
- lotLeg
- intendedShares
- benchmarkType
- benchmarkPrice
- benchmarkAt
- benchmarkFreshnessMs
- mechanismMatched
- submitAt
- finalFilledShares
- finalUnfilledShares
- fills[] with fillAt/fillShares/fillPrice/evidenceQuality
- cancelReplaceCount
- explicitCost
- coverageStatus
- missingReason

## Validity gates
Parent execution accounting is VALID only when:
1. event/date coverage proves BUY vs NO-BUY truth;
2. every required lot leg has mechanism-matched benchmark provenance;
3. fill/non-fill lifecycle closes intended quantity without double count;
4. ACTUAL and MODELED evidence are never mixed silently;
5. finalFilledShares + finalUnfilledShares = intendedShares for every leg;
6. replacement orders remain under the same parentActionId unless a new Formal action was created;
7. missing evidence is UNKNOWN/DATA_QUALITY_BLOCKED, never NO_BUY/0.

## Aggregation
Compute NTD components per leg, sum NTD across legs, divide once by total parent decision notional. Never equal-weight leg percentages.

## Synthetic falsification cases
M01 pure regular complete fill -> VALID.
M02 pure odd-lot with regular benchmark -> BLOCKED_MECHANISM_MISMATCH.
M03 mixed 1273 shares, both legs complete -> VALID; parent bps must equal NTD-weighted result, not arithmetic mean.
M04 mixed action with missing odd-lot benchmark -> DATA_QUALITY_BLOCKED.
M05 partial fill then cancel remainder -> VALID only with final unfilled quantity preserved.
M06 partial fill -> cancel -> replace -> fills -> VALID only if replacement does not increase parent intendedShares.
M07 duplicate fill/replacement event -> INVALID_DOUBLE_COUNT.
M08 signal price labelled ACTUAL fill -> INVALID_EVIDENCE_QUALITY.
M09 mature zero rows without exact-date receipt -> UNKNOWN, not NO_BUY.
M10 idle capital with unknown portfolio availability/redeployment -> monetary idle-alpha UNKNOWN.
M11 two simultaneous NO-BUY plans sharing the same cash capacity -> do not double-count portfolio idle capital.
M12 one leg ACTUAL and one leg MODELED -> parent must expose mixed evidence or remain scenario-only; never label ACTUAL.

## Optimization firewall
These tests validate accounting, not the BUY policy. No relaxation/tightening candidate exists until prospective complete-coverage evidence passes the frozen EA-021 counterfactual test across independent dates/regimes/strategy/pool/liquidity/lot strata after costs.
