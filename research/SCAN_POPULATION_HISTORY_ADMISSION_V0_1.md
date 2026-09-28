# Scan Population / History Admission Receipt V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / UPSTREAM_DENOMINATOR_FROZEN / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Preserve the exact upstream denominator before immutable decision-state parents exist.

A symbol can disappear before Formal decision evaluation because:
- history source is incomplete;
- session proof is unknown;
- history freshness is not usable;
- feature construction does not produce a decision row.

Those symbols must remain visible in research coverage accounting.

## TI-521 — Three-layer scan funnel

Layer 1:
NORMALIZED MARKET POPULATION
- symbols present in the normalized same-day market scan.

Layer 2:
HISTORY ADMISSION
- ADMITTED;
- BLOCKED;
- UNKNOWN.

Layer 3:
FEATURE READY / PARENT EXPECTED
- history-admitted symbol successfully produces the same-scan feature row that enters the Formal decision path.

Only Layer 3 becomes an immutable decision-state parent.

## TI-522 — History admission mapping

Current V8.12 semantics map:

usable=true
=> ADMITTED.

status=DATA_INCOMPLETE
=> BLOCKED.

other unusable / missing proof
=> UNKNOWN.

Exact production reason remains preserved, e.g.:
- INSUFFICIENT_PRIOR_BARS;
- MISSING_OFFICIAL_TRADED_BAR;
- OFFICIAL_GAP_PROOF_UNAVAILABLE;
- CALENDAR_UNAVAILABLE;
- MARKET_IDENTITY_UNAVAILABLE;
- HISTORY_ADMISSION_MISSING.

Do not collapse UNKNOWN into BLOCKED or VALID.

## TI-523 — Feature readiness cannot bypass history admission

If a symbol is marked feature-ready while history admission is not ADMITTED:
POPULATION_CONSISTENCY_FAIL.

Reason:
V8.12 requires historyFreshness.usable===true before buildMarketFeatures reaches Formal selection.

A future persistence path must preserve the same ordering.

## TI-524 — Scan population receipt hashes

Frozen generation-level commitments:

scanPopulationReceiptId:
identity of scan date / capture generation / population schema / normalization / source config.

normalizedMarketKeysetHash:
exact normalized symbol population.

historyAdmittedKeysetHash:
exact ADMITTED symbol set.

historyBlockedKeysetHash:
exact BLOCKED symbol set.

historyUnknownKeysetHash:
exact UNKNOWN symbol set.

featureReadyKeysetHash:
exact symbol set expected to become decision-state parents.

All keysets are canonical sorted symbol arrays.
Input enumeration order is not semantic.

## TI-525 — Per-symbol population entries are needed

A date-level count/hash alone proves completeness but is poor for later bias analysis.

Future promotion-grade persistence should preserve one compact upstream entry per normalized symbol with:
- symbol;
- market;
- history admission state/status/reason;
- verified no-trade gap count;
- feature-build state;
- parentExpected.

Do not copy full OHLC/history into these entries.

## TI-526 — Why source-blocked symbols cannot receive fake Formal states

A source-blocked symbol did not reach the Formal decision path.

Therefore it is incorrect to label it:
- Formal fail;
- near miss;
- rejected after base.

Its correct state is upstream admission BLOCKED/UNKNOWN.

Research can later compare coverage bias, but not pretend the selector evaluated the symbol.

## TI-527 — Parent-set relationship

For one generation:

decision-state parent symbol set
must equal
featureReadyKeyset from the certified scan-population receipt.

This is stronger than merely requiring the same count.

The final Formal generation receipt should certify both:
- upstream scan-population commitments;
- downstream parent keyset / decision-set commitments.

## TI-528 — Denominator reporting

Future research coverage must be able to report:

normalized market count
-> history admitted / blocked / unknown
-> feature ready / parent expected
-> Formal first-failure / qualified / selected
-> research child valid / constrained / blocked / unknown / not-evaluable.

This prevents survivorship through any pipeline stage.

## TI-529 — Current runtime evidence

V8.12 already provides useful building blocks:
- buildHistoryAdmissionMap();
- per-symbol historyFreshness;
- historySourceRevalidation summary;
- buildEligibleMarketFeature() fail-closed gate.

But it does not persist the full immutable upstream denominator/keysets.

Therefore:
SCAN_POPULATION_RECEIPT_RUNTIME = NOT_IMPLEMENTED.

## TI-530 — Publication rule

Population entries may be staged in chunks.

They are inference-visible only when the Formal generation receipt certifies:
- normalized keyset hash;
- admission partition hashes/counts;
- featureReady keyset hash;
- exact decision parent keyset correspondence.

No partial upstream population may be treated as complete.

## Current status

SCAN_POPULATION_CONTRACT = FROZEN_V0_1
UPSTREAM_SURVIVORSHIP_FIREWALL = FROZEN
RUNTIME_PERSISTENCE = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.


## Numbering reconciliation

The initial draft used TI-449 through TI-458, which overlapped an earlier shared parent-sizing lane.

The section numbers in this file are renumbered to TI-521 through TI-530.

No semantic rule changed from this renumbering.
