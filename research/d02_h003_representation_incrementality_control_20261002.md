# D02 pre-PVE-228 — H003 representation incrementality control
Date: 2026-10-02
Scope: D02 price-volume research only
Status: RESEARCH_ONLY / OUTCOME_CLOSED / NO_MATURITY_UPLIFT / FORMAL_CORE_LOCKED

## Source-level finding
Current V8.11 research implementation shows that pvResponseState and pvAcceptanceState are deterministic state/representation transforms of already-observed inputs rather than new raw information sources.

pvResponseState is constructed from pvSlotRvol20, same-slot range expansion, signed open-to-close progress normalized by historical slot range, close position, body/wick geometry, and Guard interpretability. Response may provide nonlinear representation value, but it is not an independent source-family vote beyond its component OHLCV/guard inputs.

pvAcceptanceState is constructed from frozen Formal plan geometry (breakout, buyLow, buyHigh, stop), OHLC bar path and prior bar, existing localVolumeRatio, prior Acceptance state, and fixed session-expiry logic. B_INITIAL_ACCEPTANCE requires localVolumeRatio>=1.3 plus price/close-position/wick conditions. A_INITIAL_ACCEPTANCE requires localVolumeRatio<=0.9 plus price/close-position/lower-shadow conditions. Later retest/reacceleration/failure states are path/state transforms of the same frozen plan geometry and subsequent bars.

Therefore Acceptance is not an independent volume signal. Its possible value is path compression / interaction representation conditional on the same underlying Formal and OHLCV primitives.

pvGuardState is primarily an interpretability/confounder gate. It can protect inference and define valid/guarded/invalid support, but must not be counted as directional alpha merely because it is included in model E.

## H003 consequence
The old model-D-vs-E comparison is necessary but not sufficient to claim incremental information if E bundles deterministic transforms.

Future H003 must distinguish:
1. SOURCE NOVELTY: new raw information family — not established for Response/Acceptance/Guard.
2. REPRESENTATION NOVELTY: nonlinear/path compression not trivially identical to a single primitive — structurally plausible for the state machines.
3. PREDICTIVE INCREMENTALITY: outcome value after controlling the exact component primitives and Formal context — UNKNOWN until clean prospective/OOS evidence.

Required comparator ladder on identical common support:
- base Formal context + raw price geometry + existing localVolumeRatio;
- plus same-slot RVOL / cumulative pace where applicable;
- plus decomposed Response primitives;
- plus Response state;
- plus decomposed Acceptance transition inputs / prior state;
- plus Acceptance state/path;
- Guard used as eligibility/stratification first; any predictive use must be separately justified.

If a state loses value once its deterministic components and prior-state/path controls are included, classify it REPRESENTATION_REDUNDANT rather than a new factor.
If it adds value, classify it REPRESENTATION_INCREMENTAL until independent source novelty is separately demonstrated.

No outcomes inspected. No threshold changed. No state promoted/rejected economically. No clean prospective cohort created. No maturity uplift. No FORMAL_OPTIMIZATION_CANDIDATE. Formal Core remains LOCKED.

This is a pre-PVE-228 structural falsification addendum only. PVE cursor remains 227 until the genuine 2026-10-02 ordinary after-market generation audit becomes observable.
