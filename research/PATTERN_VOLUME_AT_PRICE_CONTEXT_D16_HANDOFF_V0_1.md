# D01 DL-046 — D16 Volume-at-Price Incrementality Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED / PROSPECTIVE_PROFILE_ONLY

## 1. Purpose

D01 freezes structural-vs-volume-at-price semantics.

D02-12 owns PRICE_BY_VOLUME_PROFILE data semantics.
D16 owns future common-support / residual inference.

The central questions are:
- structural history beyond historical trading density;
- historical trading density beyond structural history;
- whether apparent confluence survives de-duplication against simpler price/volume context.

## 2. Evidence constraint

Historical price-by-volume replay is currently not established.

Therefore:
- do not synthesize historical profiles from OHLCV;
- do not use retrospective synthetic Shadow;
- only prospectively captured / genuinely replayable D02 profiles are admissible.

Until sufficient prospective evidence exists:
economic outcome inference remains CLOSED.

## 3. Required comparison classes

Preserve:
- V0 STRUCTURAL_ONLY;
- V1 VOLUME_NODE_NONSTRUCTURAL;
- V2 STRUCTURE_VOLUME_COINCIDENT;
- V3 ROUND_REFERENCE_VOLUME_NODE;
- V4 PROFILE_NOT_EVALUABLE.

No successful-case-only denominator.

## 4. Baseline controls

Future analysis should control / report:
- structural age/history;
- D02 abnormal participation / turnover;
- time-at-price where available;
- DL-044 prior-close / auction-reference context;
- DL-045 round / tick salience;
- volatility/liquidity/regime;
- event flow;
- session phase.

## 5. Information lineage

Volume-at-price contains:
- PRICE_OHLC ancestry;
- TRADED_VOLUME ancestry.

It is not automatically independent of either D01 or D02.

Required output:
- rawRepresentationCount;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus.

Default:
effectiveIndependentEvidenceCount = 1;
residualIncrementalityStatus = NOT_VALIDATED.

## 6. Mechanism boundaries

Do not equate historical traded volume with:
- current order-book depth;
- hidden liquidity;
- remaining investor inventory;
- trapped-holder count;
- institutional cost basis.

Those require separate D05 / D20 / ownership observables.

## 7. Time-at-price

Volume concentration may partly reflect dwell time.

Future D16 analysis should distinguish:
- raw volume-at-price density;
- time-at-price;
- volume intensity conditional on dwell time.

If dwell-time support is absent:
classify mechanism as PARTIALLY_IDENTIFIED.

## 8. Prospective coverage

Report:
- eligible profile count;
- captured count;
- late count;
- data-blocked count;
- unsupported-session count;
- incomplete-profile count;
- V0/V1/V2/V3/V4 counts.

UNKNOWN remains visible.

## 9. Multiple testing

If multiple binning/grouping/node definitions are evaluated:
- freeze one parameter family before outcome access;
- account for all variants;
- no best-node definition after outcomes.

## 10. Promotion boundary

No volume-profile descriptor changes:
- Formal eligibility;
- ranking;
- Top6;
- weight;
- capital;
- runtime.

Formal Core remains LOCKED.
