# D14 Prospective Mixed-Lot Execution Receipt Contract v0.1
Date: 2026-09-30 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## Purpose
Freeze a prospective evidence schema for D14 execution research. No Formal signal, sizing, order, broker, monitoring or push behavior changes.

## Parent action
Required: receiptVersion, signalEventId, planScanDate, symbol, actionType, intendedShares, decisionKnownAt, legs.
Execution attribution requires positive signalEventId linkage. A ledger-valid fill without it is holdings-accounting evidence only.

## Lot decomposition
For Q intended shares:
- regularShares=floor(Q/1000)*1000
- oddLotShares=Q mod 1000
- omit zero-share legs
- sum leg intendedShares must equal Q.

Each leg independently stores mechanism REGULAR|ODD_LOT, intendedShares, mechanismEligibleAt+provenance, mechanism-matched benchmark time/price/source, submit events, cancel/replace lineage, broker fills and explicit-cost provenance.

## Fill and replacement identity
Each actual fill needs immutable broker fill identity. Deduplicate by brokerFillId. replacementOfOrderId stays inside the same parent/leg. Replacement is order lineage, not new parent demand. Cumulative fills cannot exceed leg intendedShares.

## Mechanism clock
decisionKnownAt -> mechanismEligibleAt -> submitAt -> fillAt.
Reject fill before eligibility, mechanism-mismatched benchmark, and simulated disclosure presented as broker fill.
Preserve rawLatency, preEligibilityWait, decisionToSubmitLatency, postEligibilityLatency and submitToFillLatency separately. No weighted latency composite.

## Cost semantics
ACTUAL requires broker-confirmed fill price/shares and actual provenance for fields labeled actual. MODELED never fills missing ACTUAL.
Do not double count slippage: actual fill price already contains execution-price difference versus benchmark; modeled slippage applies only to modeled execution.
Parent NTD implementation shortfall aggregates only validated legs; incomplete evidence is PARTIAL/UNKNOWN, never zero.

## Non-fill
NO_FILL or PARTIAL requires positive complete-coverage evidence through a frozen horizon. Absence of a fill row is UNKNOWN.

## Fail-closed validation
Hard invalid: parent quantity mismatch; mechanism mismatch; duplicate fill identity; overfill; fill before eligibility; simulated event as fill; replacement crossing parent/leg; negative shares; malformed causal timestamps.
Attribution-ineligible UNKNOWN: missing broker cost; missing eligibility provenance; missing immutable fill identity; missing complete-coverage proof; missing signalEventId linkage.

## Falsification
Do not assume odd-lot is costlier, fast fill is better, or mixed-lot splitting improves outcomes. The contract only makes these hypotheses testable without mechanism leakage, survivorship or double counting.

## Promotion
D14-07/08/14 remain L2/40. Schema existence is not PIT evidence. L3 requires deterministic prospective capture/replay on independent live dates with controlled UNKNOWN denominators. L4 requires multi-date empirical validation and falsification.

## Exact next continuation
Implement a pure isolated validator plus fixtures for 77-share odd lot, 1273-share mixed lot, parent mismatch, mechanism mismatch, duplicate fill, cancel/replace, partial fill with incomplete coverage, and simulated odd-lot disclosure rejected as fill. Then accumulate independent prospective dates.
