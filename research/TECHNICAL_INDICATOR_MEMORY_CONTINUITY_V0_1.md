# Technical Indicator Memory / Lag / Continuity Audit V0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME-BLIND / DATA-SEMANTICS_GOVERNANCE
Formal Core: LOCKED

## Purpose
Study how technical indicators remember bad data, repaired corporate-action boundaries, pseudo-bars, and initialization choices.

A corrected source history does not imply every recursively stored indicator state becomes instantly clean.
Indicator memory architecture must be explicit.

## TI-080 — Four memory classes

### Class F — finite-window
A bar stops affecting the indicator after a known finite eligible-session horizon.

Examples:
- SMA20;
- Bollinger20 if built from finite SMA/std window;
- Aroon/extremeRecency20;
- Donchian20;
- CMF21;
- finite-window CMO/MFI variants.

### Class I — recursive IIR state
State error decays geometrically but does not become exactly zero at a fixed bar count.

Examples:
- EMA;
- Wilder RSI;
- Wilder ATR;
- Wilder DMI/ADX;
- recursively smoothed KD;
- MACD/PPO;
- TRIX;
- TSI.

### Class C — cumulative
A level permanently retains history unless explicitly rebased/windowed.

Examples:
- raw OBV;
- raw Accumulation/Distribution Line.

### Class P — path-state
A contaminated event can alter later state transitions, not merely decay smoothly.

Examples:
- Parabolic SAR extreme-point / acceleration state;
- some trailing-stop/supertrend state machines;
- Pattern state machines if a false pivot is admitted.

These classes require different repair semantics.

## TI-081 — Finite-window contamination is bounded but session-aware

For an N-eligible-session finite window:
- one contaminated bar can affect outputs only while it remains inside the window;
- after N subsequent eligible-session positions have rolled the bar out, direct arithmetic contamination is gone.

But:
- calendar days are irrelevant;
- verified suspension/non-symbol sessions do not advance the eligible-bar count;
- a corporate-action boundary can contaminate multiple derived bars if the source transformation itself is wrong.

Example:
Bollinger20 with one bad close:
direct window contamination ends only after that close leaves the 20 eligible-bar window.

EXTREME_RECENCY_20 similarly depends on the exact eligible-session window and cannot age across suspended calendar days.

## TI-082 — Recursive indicator state has geometric memory

Generic one-state smoother:
S_t = alpha*x_t + (1-alpha)*S_(t-1)

If two histories differ only in prior state by error e_0, then absent further input differences:
e_k = (1-alpha)^k * e_0

Define lambda = 1-alpha.

Single-stage state-error half-life:
h_1/2 = ln(0.5) / ln(lambda)

This half-life describes state-error decay only.
It is NOT an alpha horizon or a trading parameter.

## TI-083 — Reference state-error half-lives

Using common baseline formulas:

EMA9:
alpha = 2/(9+1) = 0.2
lambda = 0.8
state-error half-life ~= 3.11 eligible bars

EMA12:
alpha = 2/13
lambda = 11/13
half-life ~= 4.15 bars

EMA18:
alpha = 2/19
lambda = 17/19
half-life ~= 6.23 bars

EMA20:
alpha = 2/21
lambda = 19/21
half-life ~= 6.93 bars

EMA26:
alpha = 2/27
lambda = 25/27
half-life ~= 9.01 bars

Wilder14:
alpha = 1/14
lambda = 13/14
half-life ~= 9.35 bars

KD recursive K with 1/3 new RSV:
lambda = 2/3
single-stage state-error half-life ~= 1.71 bars

These are mathematical reference values, not a rule that an indicator is "clean" after one half-life.

After one half-life 50% of the state error remains.
After multiple half-lives some error still remains.

## TI-084 — Cascaded indicators persist longer than a single stage

MACD:
- fast EMA state;
- slow EMA state;
- optional signal EMA;
- histogram derived from DIF-signal.

A source/state error becomes a combination of multiple exponential modes.
Asymptotically the slowest pole often dominates, but cancellation can make exact behavior path-dependent.

TRIX:
- three cascaded EMAs;
- then one-period ROC.

Triple smoothing produces a longer effective memory than one EMA with the same period.
Do not use the single EMA18 half-life as the full TRIX contamination horizon.

TSI:
- double-smoothed signed price change;
- double-smoothed absolute price change;
- ratio of the two.

RSI:
- Wilder-smoothed gains and losses;
- nonlinear ratio.

ADX:
- Wilder-smoothed TR / +DM / -DM;
- nonlinear DI/DX transformation;
- another smoothed ADX stage.

Therefore nested recursive indicators require exact replay from clean history for certification.
A fixed "wait 14 bars" rule is not generally valid.

## TI-085 — KD has finite range input plus recursive output memory

KD is hybrid:
1. RSV uses a finite rolling high/low window;
2. K recursively smooths RSV;
3. D recursively smooths K.

A bad bar can:
- contaminate rolling H/L while inside the RSV window;
- then leave residual K/D state after it exits the rolling window.

Therefore:
"bad bar has left the 9-day RSV window"
does NOT prove K/D state equality with a clean replay.

## TI-086 — Cumulative indicators can retain one bad event forever

Raw OBV:
OBV_t = OBV_(t-1) +/- Volume_t

Raw ADL:
ADL_t = ADL_(t-1) + CLV_t*Volume_t

A one-time erroneous volume or sign event permanently shifts the cumulative level unless:
- the series is recomputed from corrected history;
- or the research representation is rebased/windowed.

This is a major reason the lane prefers:
- signedVolumeBalance20 over raw OBV level;
- CMF window ratio over raw ADL level.

Cumulative absolute levels must not be treated as provenance-free technical truth.

## TI-087 — Path-state indicators can have non-decaying structural contamination

Parabolic SAR and similar state machines update:
- current side;
- extreme point;
- acceleration factor;
- reversal state.

A wrong high/low can change the state transition path.
Future outputs may remain different even after the original bad bar is far in the past.

The same general warning applies to:
- pivot-driven Pattern state;
- trailing stops;
- stop-and-reverse systems.

Repair requirement:
replay state from a trusted pre-boundary state or recompute from sufficiently complete corrected history.

Do not assume geometric decay unless the state machine mathematically has it.

## TI-088 — Correct continuity repair is recomputation, not arbitrary waiting

Preferred certification after a source/corporate-action repair:
1. obtain canonical continuity-corrected OHLC history;
2. exclude invalid pseudo/non-session bars;
3. recompute the complete indicator state from a documented initialization point;
4. compare exact replay hash/values;
5. preserve formulaVersion and source/provenance.

Do NOT declare clean solely because:
- 9 bars passed;
- 14 bars passed;
- one half-life passed;
- the chart visually "looks normal."

If a full clean replay is unavailable:
state remains UNKNOWN / DATA_BLOCKED for promotion-grade inference.

## TI-089 — Warm-up and replay provenance fields

Any future research snapshot for recursive indicators should preserve:
- formulaVersion;
- initializationMethod;
- initializationDate / firstEligibleBar;
- sourceContinuitySpace;
- sourceHistoryHash;
- eligibleBarsUsed;
- replayExact;
- prefixInvariant;
- warmupComplete;
- lastUnresolvedContinuityBoundary;
- stateCertificationMethod = FULL_REPLAY / TRUSTED_PRIOR_STATE / UNKNOWN.

A current numeric indicator value without these fields can be numerically valid but inference-provenance weak.

## TI-090 — Lag/noise is a representation trade-off, not free alpha

Smoothing reduces high-frequency variation but delays state change.

Examples:
- TRIX triple smoothing removes more short-term noise but adds more lag;
- MACD signal-line smoothing can stabilize crossovers while delaying them;
- TSI double smoothing produces a steadier signed-momentum ratio;
- Wilder RSI/ADX retain longer memory than a simple finite-window sum.

Therefore:
"fewer false signals" cannot be evaluated without:
- missed/late-entry cost;
- maxChase;
- existing 15m confirmation;
- execution opportunity cost.

A slower indicator may look cleaner precisely because it reacts later.

Selection and execution timing must remain separate.

## TI-091 — Technical-continuity blocker is indicator-specific

The current shared blocker "TECHNICAL_CONTINUITY unresolved" should not later be resolved with one universal warm-up count.

Certification can differ by memory class:

Finite window:
exact clean window can certify directly.

Recursive:
requires clean replay or trusted prior state.

Cumulative:
requires rebasing/recomputation or windowed representation.

Path-state:
requires state-machine replay.

This distinction should be reused by Pattern, Price-Volume and System 2 if/when runtime data semantics mature.

## Current status

INDICATOR_MEMORY_TAXONOMY = FROZEN
RECURSIVE_STATE_HALF_LIFE_REFERENCES = FROZEN_AS_MATH_DIAGNOSTICS
ARBITRARY_WAIT_N_BARS_REPAIR = REJECTED
FULL_CLEAN_REPLAY = PREFERRED_CERTIFICATION
FORMAL_OPTIMIZATION_CANDIDATE = NONE

Formal Core remains LOCKED.

## Exact next continuation

1. Create machine-readable memory-kernel registry for existing/pruned indicator families.
2. Do not turn half-life values into production thresholds.
3. Reuse memory class in future data-quality receipts and replay tests.
4. For any future research implementation, prove exact clean replay rather than "enough bars probably passed."
5. Study whether current research core initialization methods match platform/provider conventions before cross-platform numeric comparisons.
6. Keep outcome inference blocked until provenance/coverage gates mature.
7. Formal Core unchanged.
