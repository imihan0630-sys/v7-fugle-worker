# ATR_QUALITY — Source / Gate Semantics Audit

Updated: 2026-09-27 Asia/Taipei  
Status: FALSIFICATION_IN_PROGRESS / CLASS-A OBSERVER / OUTCOMES CLOSED  
Formal Core: LOCKED

## AQ-001 — Scope

Generic ATR/volatility theory remains owned by Technical Indicators and Volatility Regime research.

This lane audits only the current System 1 path:
- ATR% producer;
- 1%–10% eligibility gate;
- ATR -> stop -> reward/risk coupling;
- source/missingness semantics.

No ATR threshold or stop formula change is authorized.

## AQ-002 — Patch-chain runtime boundary

The repository's raw `Worker.js` is a 7.5.x baseline. V8 runtime behavior is produced by applying `scripts/apply_v8_*` in CI/deploy.

V8.12 explicitly changes the historical request to:
`adjusted=false&fields=open,high,low,close,volume,turnover,change`.

Therefore the bare baseline URL must not be mistaken for the deployed source contract.

## AQ-003 — History admission validates sessions, not H/L numeric completeness

HISTORY_SOURCE_REVALIDATION_V2.3 is valuable and remains authoritative for:
- date order;
- 60 prior bars;
- future bars;
- official session gaps;
- verified suspension/no-trade gaps.

But `historyStructuralShape()` inspects dates, not whether high/low are numeric.

`fetchHistoricalDaily()` normalizes high/low through `marketNumber()`, so null/empty/`--` becomes null.

Thus a symbol can be history-date-usable while an ATR bar's range inputs are not numerically observed.

## AQ-004 — The ATR range path does not use the apparent close fallback

`buildMarketFeatures()` creates:
- `highs = Number(item.high ?? item.close)`;
- `lows = Number(item.low ?? item.close)`.

But ATR true range is later computed directly from:
`item.high` and `item.low`.

That distinction matters.

For null high/low, JavaScript arithmetic coerces null to 0. A stock near 100 can receive a true range near 100.

Fixed synthetic case:
- 18 clean bars each range=2;
- 2 bars high=null, low=null;
- close=100.

Deployed ATR20 = (18*2 + 2*100)/20 = 11.8.
ATR%=11.8 -> current upper gate rejects.

A research-only explicit close-fallback comparator gives 1.8% -> passes.

This proves a representation-driven classification flip. It does not prove live frequency.

## AQ-005 — Another missing representation shrinks the denominator

If H/L is undefined or a nonnumeric non-null value, the raw true range becomes NaN.

`average()` silently removes nonfinite values.

So ATR may become an average over fewer than 20 valid true ranges while still being named atr20.

Null and undefined missingness can therefore lead to opposite distortions:
- null -> huge zero-coerced range;
- undefined/invalid -> range dropped.

## AQ-006 — Missing ATR Formal semantics

Current Formal uses:
`(f.atrPercent || 0)`.

Therefore missing/null ATR is a deployed lower-bound FAIL, not a decision UNKNOWN.

The research gate-overlap observer v0.3 labels missing ATR UNKNOWN and is semantically stale for this gate.

`formal_gate_overlap_observer_v0_4` preserves v0.3 valuation fixes and changes only this ATR decision/evidence split:
- Formal state = FAIL;
- evidence state = ATR not observed;
- formal coerced value = 0.

## AQ-007 — ATR is not an isolated gate

The same ATR% is converted to price units after passing the gate and contributes to stop geometry. Stop distance then affects reward/risk.

Future ATR studies must therefore separate:
1. ATR eligibility effect;
2. ATR stop effect among passers;
3. downstream RR effect.

Removing the gate alone is not equivalent to removing ATR from the system.

## AQ-008 — Optimization boundary

A likely data-quality repair would be an `ATR_OHLC_NUMERIC_ADMISSION_GUARD` that refuses to treat missing H/L as valid ATR evidence.

It is **not yet** a `FORMAL_OPTIMIZATION_CANDIDATE` because live/prospective missing-H/L incidence is not established.

Promotion requires:
- positive current-source witness;
- same-generation affected-symbol decision difference;
- clean-row no-diff proof;
- fail-closed behavior;
- rollback plan;
- owner approval as Class B data-quality work.

Machine artifacts:
- `research/atr_quality_source_observer_v0_1.mjs`;
- `research/atr_quality_source_semantic_falsification_v0_1.json`;
- `research/formal_gate_overlap_observer_v0_4.mjs`;
- adversarial tests.

No Formal change is made.
