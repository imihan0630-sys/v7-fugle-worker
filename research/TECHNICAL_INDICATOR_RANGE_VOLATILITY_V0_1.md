# Technical Indicator OHLC Range-Based Volatility Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / VOLATILITY_CROSS-LANE
Formal Core: LOCKED

## Purpose

Continue the technical-indicator lane after TI-151 by auditing OHLC range-based volatility estimators.

This is NOT a new directional-indicator family.

Primary question:
Does OHLC-based realized-volatility composition contain risk information beyond the current close-to-close volatility20 and ATR%, especially because Taiwan equities can have meaningful overnight gaps?

Reviewed families:
- Parkinson;
- Garman-Klass;
- Rogers-Satchell;
- Yang-Zhang.

Ownership:
VOLATILITY/RISK lane, not technical-majority voting.

## TI-152 — Current-system baseline

Current system already has:
- volatility20 from close-to-close daily returns;
- ATR / atrPercent;
- gapPct;
- Pattern/candlestick research with OPEN requirements;
- Event/Price-Volume research separating overnight vs intraday effects.

These measurements are not identical.

Close-to-close volatility uses close-to-close returns only. It includes the net overnight plus intraday result but discards intraday high/low path.

ATR% uses True Range in price units normalized by price. It includes high-low range and gap reach and is useful for stop/risk geometry, but it is not a variance estimator and is already strongly coupled into Formal stop/RR logic.

Therefore a range-based variance estimator can be a legitimate VOLATILITY comparator without being a new selection factor.

## TI-153 — Parkinson is high-low range volatility

Single-session primitive in log-price terms:

p_i = [ln(H_i/L_i)]^2 / (4 ln 2)

Window estimator:
mean(p_i), then square root for volatility scale.

Information used:
HIGH and LOW.

Information omitted:
- Open;
- Close direction;
- previous close;
- overnight gap.

Status:
PARKINSON_VOL = VOLATILITY_ROBUSTNESS_COMPARATOR

Not primary for Taiwan overnight-risk research because opening gaps are invisible.

## TI-154 — Garman-Klass uses intraday OHLC but still misses prior-close gap

Single-session variance primitive:

gk_i =
0.5 * [ln(H_i/L_i)]^2
- (2 ln 2 - 1) * [ln(C_i/O_i)]^2

Information used:
O/H/L/C of the same session.

It improves on high-low-only representation by using open-to-close movement.

But it contains no previous-close anchor, so the overnight Close_(i-1) to Open_i jump is not directly represented.

Status:
GARMAN_KLASS_VOL = VOLATILITY_ROBUSTNESS_COMPARATOR

## TI-155 — Rogers-Satchell is drift-robust intraday OHLC geometry

Define:
u_i = ln(H_i/O_i)
d_i = ln(L_i/O_i)
c_i = ln(C_i/O_i)

Rogers-Satchell contribution:

rs_i =
u_i * (u_i - c_i)
+
d_i * (d_i - c_i)

It is designed to handle non-zero drift better than zero-drift range estimators.

But it remains an INTRADAY OHLC estimator.
It does not directly include the overnight previous-close-to-open jump.

Status:
ROGERS_SATCHELL_VOL = VOLATILITY_ROBUSTNESS_COMPARATOR / YZ_COMPONENT

## TI-156 — Yang-Zhang explicitly separates overnight and intraday components

For each eligible session i:

overnight return:
o_i = ln(O_i / C_(i-1))

open-to-close return:
c_i = ln(C_i / O_i)

intraday range contribution:
rs_i = Rogers-Satchell contribution.

Over a window:
- V_O = variance of overnight returns;
- V_C = variance of open-to-close returns;
- V_RS = mean Rogers-Satchell contribution.

Reference Yang-Zhang combination:

V_YZ =
V_O
+ k * V_C
+ (1-k) * V_RS

with the standard sample-size-dependent k convention.

Volatility scale:
sqrt(V_YZ).

Why potentially distinct:
- close-to-close volatility does not retain intraday high/low path;
- ATR is range magnitude, not this variance decomposition;
- Parkinson/GK/RS do not all incorporate opening jumps.

Therefore Yang-Zhang is NOT algebraically redundant with current volatility20 or ATR.

Status:
YANG_ZHANG_VOL = WORTH_VOLATILITY_FALSIFICATION / DIRECTIONAL_ALPHA_NOT_ASSUMED

## TI-157 — Freeze a system-native comparison horizon, not a platform default

XQ currently exposes YZVolatility with a 14-day default.

That is a platform parameter choice, not evidence that 14 is optimal for this system.

Current system already has volatility20.

Therefore the first research comparison should use:
YZ_VOL_20

to create common-horizon comparison against:
- close-to-close volatility20;
- ATR/atrPercent context;
- BBW20;
- rangeCompression20.

Do NOT immediately sweep 10 / 14 / 20 / 30 / 60.

One common 20-session baseline first.

## TI-158 — XQ formula provenance is only partial

Current XQ documentation describes YZVolatility as combining gap variance and intraday variance and exposes period/coefficient parameters.

The reviewed public description is not enough to certify exact equality with the academic Yang-Zhang implementation. Exact component formulas, denominator conventions, coefficient mapping, initialization and missing-session behavior are not fully proven from the summarized interface.

Therefore:

XQ_YZ_PLATFORM_PARITY = UNKNOWN

Research reference implementation must use an explicit academic formulaVersion.
Do not silently label it same-as-XQ without fixture parity.

## TI-159 — Current repository OPEN feasibility materially improved, but provenance is insufficient

Fresh repository audit finds current history rows now preserve:
- open;
- high;
- low;
- close.

V8.12 history-source revalidation also explicitly requests historical fields:
open, high, low, close, volume, turnover, change.

This means:
RAW_OHLC_SOURCE_FEASIBILITY = MATERIAL_PASS.

However current normalization paths can use fallbacks such as:
open = open if present, otherwise close;
high = high if present, otherwise close;
low = low if present, otherwise close;
and history merge can reuse an old open before falling back to close.

This is NOT acceptable for Yang-Zhang.

Critical failure example:
If a missing Open is silently replaced by Close:
- open-to-close return becomes zero;
- overnight return uses an invented open;
- Rogers-Satchell geometry changes;
- YZ component decomposition is fabricated.

A numeric output would exist but be semantically false.

Required state:
each OHLC bar used by YZ must prove OHLC_ORIGIN = OBSERVED_VALIDATED.

Synthetic fallback:
OHLC_ORIGIN = SYNTHETIC_FALLBACK
=> YZ DATA_BLOCKED for that window.

## TI-160 — TECHNICAL_CONTINUITY remains a first-order blocker

Raw traded OHLC around corporate actions can contain mechanical price resets.

Yang-Zhang overnight component is especially sensitive because ln(Open_t / Close_(t-1)) will interpret an unneutralized ex-right/ex-dividend reset as overnight volatility.

Therefore YZ research must consume TECHNICAL_CONTINUITY for volatility continuity, not blindly use RAW_EXECUTION across corporate-action boundaries.

At the same time, true residual market gaps after neutralizing the mechanical reset must remain market information.

Do not suppress an entire corporate-action session.

Current status:
CURRENT_CACHE_YZ_INFERENCE_READINESS =
SOURCE_FEASIBLE / OPEN_PROVENANCE_NOT_STRICT / TECHNICAL_CONTINUITY_RUNTIME_NOT_PROVEN

## TI-161 — Symbol-session / suspension semantics

A verified suspension/no-trade day is NOT:
- zero overnight return;
- zero intraday volatility;
- a flat OHLC observation.

It is no eligible observation.

The next legitimate trading session's open may contain real resumption information.

Therefore:
- window counts eligible symbol sessions;
- do not insert synthetic flat days;
- previous close for overnight return is the previous eligible traded session under canonical continuity semantics.

## TI-162 — Taiwan price-limit censoring

Taiwan's current daily price-limit mechanism can constrain observed H/L/C.

On a limit-up/down session:
- observed range may be truncated by the exchange boundary;
- lack of wider H/L movement does not prove low latent price pressure;
- consecutive constrained sessions can delay price discovery.

Therefore YZ/Parkinson/GK/RS values remain descriptive realized OHLC variance but interpretation state must be:

PRICE_LIMIT_CONSTRAINED

Such rows/windows must not be pooled silently with ordinary unconstrained volatility evidence.

## TI-163 — Proposed research-only component receipt

If future schema review authorizes a research snapshot, preserve raw components rather than only final YZ:

- yzVol20;
- yzVariance20;
- overnightVariance20;
- openCloseVariance20;
- rogersSatchellVariance20;
- closeToCloseVol20;
- atrPercent;
- bollingerWidth20;
- observedOhlcCoverage20;
- fallbackOhlcCount20;
- priceLimitConstrainedCount20;
- continuityState;
- formulaVersion;
- source/provenance.

No directional HIGH_VOL / LOW_VOL thresholds are frozen.

Optional diagnostic, not score:

overnightVarianceShare20 =
overnightVariance20 / yzVariance20
when denominator > 0.

This may distinguish event/gap-heavy risk from intraday/range-heavy risk.

It is a diagnostic hypothesis only.

## TI-164 — Incremental-value questions

First questions are RISK questions, not expected-return direction.

A. Does YZ20 explain future MAE/range/stop-first risk beyond:
- close-to-close volatility20;
- ATR%;
- gapPct;
- BBW;
- liquidity;
- regime?

B. Does overnightVarianceShare20 explain:
- next-session gap risk;
- stop slippage/open risk;
- event sensitivity
beyond current one-day gapPct and event context?

C. Does YZ20 add anything once ATR, realized volatility, limit-state and market regime are controlled?

D. Is any apparent effect caused only by crisis/event dates?

If no stable incremental risk information:
retain YZ for explanation only.

## TI-165 — Estimator family governance

Do NOT score Parkinson + GK + RS + YZ as four volatility votes.

Family hierarchy:

Primary research comparator:
- Yang-Zhang20.

Robustness/decomposition:
- Parkinson20;
- Garman-Klass20;
- Rogers-Satchell20.

Existing baseline:
- close-to-close volatility20;
- ATR%;
- BBW20.

Within-family residualization is mandatory before any strategy use.

## Current status

PARKINSON = VOLATILITY_ROBUSTNESS_ONLY
GARMAN_KLASS = VOLATILITY_ROBUSTNESS_ONLY
ROGERS_SATCHELL = VOLATILITY_ROBUSTNESS / YZ_COMPONENT
YANG_ZHANG_20 = WORTH_VOLATILITY_FALSIFICATION
OVERNIGHT_VARIANCE_SHARE20 = DIAGNOSTIC_HYPOTHESIS
RAW_OHLC_SOURCE_FEASIBILITY = MATERIAL_PASS
OBSERVED_OPEN_PROVENANCE = NOT_PROVEN_PER_BAR
TECHNICAL_CONTINUITY_RUNTIME = NOT_READY_FOR_YZ_INFERENCE
DIRECTIONAL_ALPHA = NOT_ASSUMED
FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

## Exact next continuation

1. Hand off Yang-Zhang/range-estimator ownership to VOLATILITY_REGIME research; technical-indicator lane should not create a competing volatility taxonomy.
2. Before any implementation, require per-bar OHLC-origin provenance so fallback values cannot masquerade as observed data.
3. Require TECHNICAL_CONTINUITY OHLC across corporate actions and verified symbol-session membership.
4. Freeze one academic YZ20 formulaVersion before code; do not claim XQ exact parity.
5. Build outcome-blind fixtures:
   - same close-to-close return, different intraday range;
   - same H/L range, different overnight gap;
   - missing Open fallback;
   - ex-right mechanical reset;
   - suspension/resumption;
   - consecutive limit-up/down.
6. Only after data semantics pass, compare YZ20 versus close-vol20/ATR/BBW as risk descriptors.
7. No directional scoring, no Formal change.

## Evidence anchors

- Yang-Zhang volatility literature: drift-independent OHLC estimator combining overnight, open-to-close and Rogers-Satchell components.
- 2024 Software Impacts implementation paper: Yang-Zhang stock realized-volatility estimator, jump-aware and drift-independent in its stated design.
- Range-estimator literature: Parkinson high-low; Garman-Klass OHLC without overnight previous-close term; Rogers-Satchell drift-robust intraday OHLC.
- XQ 2026 YZVolatility factor: described as combining gap and intraday variance; public interface defaults include 14-day and coefficient parameters, exact platform parity not yet proven.
- Repository audit: current history stores OHLC and V8.12 requests open/high/low/close, but fallback semantics can synthesize missing Open/High/Low and therefore cannot certify YZ without explicit origin provenance.
