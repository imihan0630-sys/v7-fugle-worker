# D18 Direction Breadth Semantics V0.1

Updated: 2026-09-30 Asia/Taipei
Status: CLASS_A_EXECUTABLE_RESEARCH / REGRESSION_PASS / NO_POLICY_IMPACT
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Freeze the first executable, PIT-safe semantic sublane for D18-04 Breadth × Strategy without pretending that all breadth components are equally mature.

This work owns **direction breadth only**:
- UP;
- DOWN;
- FLAT;
- NOT_COMPARABLE;
- UNKNOWN.

It does not yet promote:
- true percentage-return distribution;
- MA participation;
- breadth threshold;
- breadth regime policy;
- strategy activation/weighting.

## Core exchange-semantic finding

Official exchange conventions distinguish:
- positive / negative direction;
- flat;
- **X = not comparable**.

Therefore `X0` / `X0.00` must NOT be counted as FLAT.

The existing A1 symbol snapshot numeric parser can normalize a raw X-prefixed change string into numeric zero. That numeric field is valid as a generic numeric payload but is insufficient to determine direction-breadth semantics.

D18 Direction Breadth must inspect the frozen raw source field and preserve:
- raw X marker => NOT_COMPARABLE;
- no usable close => UNKNOWN;
- missing/unparseable change => UNKNOWN;
- true numeric zero without X/non-comparable marker => FLAT.

## Why this matters statistically

If X rows are coerced to FLAT:
- flat count is inflated;
- direction denominator is wrong;
- advance/decline shares shrink mechanically;
- Regime labels can move toward "mixed/neutral";
- event-heavy dates can look artificially calm.

Ex-right/ex-dividend, resumption/reference-price and other not-comparable situations can be state-dependent. Therefore X is not merely a parser nuisance.

Mandatory diagnostics:
- notComparableCount;
- notComparablePct;
- unknownCount;
- unknownPct;
- reason counts;
- per-market TWSE/TPEx breakdown.

Removing X from the direction denominator does not make the issue disappear; the excluded share itself must remain visible for missingness/regime-dependence research.

## Two breadth universes must remain separate

### MARKET_DIRECTION_BREADTH
Purpose:
external market-state context.

Universe:
PIT-ready TWSE + TPEx ordinary-share A1 market snapshot.

This is the admissible direction-breadth input for D18 market context.

### OPPORTUNITY_SET_BREADTH
Purpose:
describe the stocks surviving a strategy/formal eligibility pipeline.

Existing V8 research context already identifies its breadth universe as:
`TWSE_TPEX_COMBINED_FORMAL_NORMALIZED`

It applies formal price/instrument filters and is explicitly not official whole-market breadth.

This object must NOT silently substitute for MARKET_DIRECTION_BREADTH in a Regime policy.

Reason:
using strategy/formal-filtered breadth to control the same strategy can create circularity/endogeneity:
formal eligibility -> opportunity-set breadth -> regime gate -> formal opportunity.

Opportunity-set breadth may remain a diagnostic/control and may itself be studied as a separate state variable, but its estimand is different.

## Executable Class A observer

Merged implementation:
`research/d18_direction_breadth_semantics_v0_1.mjs`

Merged falsification test:
`tests/test_d18_direction_breadth_semantics_v0_1.mjs`

Regression wiring:
`tests/test_v8_14_0_sector_gate_provenance.mjs`

PR:
#274

Merge commit:
`31f7c1819b9acf807f2942b63884733889ad814d`

Pre-merge verified head:
`fd3d3e92dac08f6f77390b8876e621d3a600dab9`

Verification:
- V8 Regression Tests run 36645020491 PASS;
- V8 Repair CI run 36645020534 PASS.

No Worker.js production logic was changed by PR #274.

## Observer contract

Input:
a READY + PIT-eligible A1 Symbol Snapshot Batch.

Fail closed:
- batch not READY;
- batch not PIT;
- no usable close;
- missing/unparseable raw direction.

Classification:
- X / explicit not-comparable marker => NOT_COMPARABLE;
- positive marker / numeric positive => UP;
- negative marker / numeric negative => DOWN;
- true comparable numeric zero => FLAT;
- missing/no-usable-price/unparseable => UNKNOWN.

Output preserves:
- total base count;
- UP/DOWN/FLAT;
- NOT_COMPARABLE;
- UNKNOWN;
- comparable denominator;
- advance/decline/flat/net breadth shares;
- comparable coverage;
- not-comparable share;
- unknown share;
- reason counts;
- TWSE/TPEx sub-receipts;
- source batch identity/hash;
- deterministic feature hash.

Input ordering is canonicalized by market + symbol before hashing.

## Falsification cases verified

1. Raw `X0.00` can coexist with normalized numeric `change=0`; D18 still returns NOT_COMPARABLE.
2. TPEx raw `X0` also returns NOT_COMPARABLE.
3. No usable close with zero trade values remains UNKNOWN, not FLAT.
4. True comparable zero remains FLAT.
5. Positive/negative rows preserve direction.
6. Input row order changes do not change the semantic feature hash.
7. A batch observed after the decision clock becomes UNKNOWN/fail-closed.

## B2 shared-observer risk

`system2/runtime/b2_industry_snapshot_observer.mjs` currently normalizes leading X away in its numeric helper and may classify a resulting numeric zero as FLAT.

This is an important falsification finding, NOT an authorization to patch shared runtime automatically.

Because B2 participates in System 2 shared prospective dependency/context infrastructure, any direct shared-runtime semantic correction must be separately classified under governance. Prefer:
- isolated evidence first;
- targeted B2 semantic proposal;
- regression/invariant proof;
- owner review if the change is Class B.

Do not silently claim historical B2 breadth is repaired by this D18 Class A observer.

## Missingness / not-comparable dependence

Before any coverage threshold or Breadth Regime policy:
test whether NOT_COMPARABLE / UNKNOWN share depends on:
- market trend;
- volatility;
- market stress;
- corporate-action intensity;
- liquidity;
- size/listing age where PIT-safe;
- TWSE vs TPEx.

If missing/not-comparable rates are state-dependent, complete-case breadth can be biased.

No fixed acceptable percentage is authorized yet.

## D18-04 maturity interpretation

This work validates **Direction Breadth semantic PIT feasibility** as a sublane.

It does NOT by itself promote the whole D18-04 module to L3 because D18-04 also covers broader participation/return-distribution semantics and prospective coverage is not yet accumulated.

Recommended module status:
`DIRECTION_BREADTH_EXECUTABLE_PIT_SEMANTICS_VALIDATED / RETURN_DISTRIBUTION_AND_PROSPECTIVE_COVERAGE_PENDING`

Module level remains L2 for now.

## Regime-policy boundary

No threshold is introduced.
No:
- BROAD_POSITIVE/BROAD_NEGATIVE action gate;
- 50% threshold promotion;
- strategy activation;
- capital scaling;
- dynamic weighting.

First prospective objective:
occupancy and data-quality structure, not alpha.

## Exact next continuation

1. Accumulate context-only Direction Breadth receipts prospectively when an authorized capture path exists.
2. Study NOT_COMPARABLE/UNKNOWN dependence before defining a coverage gate.
3. Keep Market Direction Breadth separate from Formal/Opportunity-Set Breadth in every experiment receipt.
4. Build True Return Distribution as a separate PIT/continuity sublane.
5. Prepare a B2 semantic-risk proposal if/when shared observer correction is required; do not patch silently.
6. Only after clean occupancy/coverage exists, preregister one Breadth × Strategy policy experiment with static and exposure-matched controls.
