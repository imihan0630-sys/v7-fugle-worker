# Volatility Regime Research

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## VR-001 — scope
Volatility regime is a context/state problem, not a new stock score. The primary question is whether a PIT volatility state changes the reliability/risk of existing after-market A/B selections after existing trend, liquidity, breadth and overheat controls.

No Formal throttle, rank weight or BUY rule is authorized.

## VR-002 — separate level, change and shock
Do not collapse volatility into one number.
- LEVEL: trailing realized volatility / ATR-like state.
- CHANGE: acceleration/deceleration versus its own prior state.
- SHOCK: unusually large realized move/range relative to a frozen trailing baseline.
- IMPLIED: TAIFEX VIX/option-implied state, separately sourced.
- GAP/OVERNIGHT: next-open information is an outcome for after-market selection unless the overnight input was known before the relevant decision clock.

A high level can coexist with falling volatility; a low level can experience a positive shock. These mechanisms must be tested separately.

## VR-003 — avoid redundant ATR repackaging
Existing Formal/research already contains ATR/price-path/overheat/regime context. A volatility candidate is incremental only if it adds information after:
1. existing ATR/realized-volatility context;
2. trend/residual RS;
3. breadth/liquidity;
4. existing overheat/late-stage controls.

If a candidate is nearly a monotone transform of ATR or drawdown, mark REDUNDANT rather than adding Factor Zoo.

## VR-004 — targets
Pre-register separate targets:
- selection survival: D1/D3/D5 residual return;
- downside: D1/D5 MAE/max drawdown;
- path violence: D1/D5 range/realized volatility;
- selection funnel: zero-pick/selected count and later BUY participation when coverage exists.

Volatility may be useful for downside/path quality without predicting return sign. Do not require directional alpha to call risk-context evidence useful.

## VR-005 — candidate state matrix
Minimal non-overlapping candidate families:
A. trailing realized range/variance state;
B. realized-vol acceleration/shock;
C. implied-vs-realized spread when PIT TAIFEX VIX is available;
D. implied-vol change/shock;
E. cross-sectional dispersion/breadth-vol interaction.

No threshold search yet. Initial states use frozen quantile/rank or continuous standardized values computed only from data known by scan time.

## VR-006 — falsification
Reject/downgrade a candidate if:
- effect vanishes after ATR/trend/breadth/liquidity controls;
- only one crisis/date cluster drives it;
- same-day close information was not actually known by scan time;
- threshold/window was chosen from outcome performance;
- only directional return improves while downside/path evidence contradicts it;
- result fails across independent dates/regimes;
- TPEx/TWSE coverage asymmetry drives the effect.

Negative controls:
- date-shift placebo;
- within-regime shuffled volatility state;
- ATR-only baseline;
- market-return-only baseline;
- exclude top crisis days and retest.

## VR-007 — first optimization bridge
A possible after-market optimization is not "high volatility = reject".
A candidate can be proposed only if a volatility state robustly identifies when existing A/B selections have worse downside/path quality or materially different continuation probability beyond existing controls, and the effect survives crisis-day removal, independent dates, PIT/OOS and redundancy tests.

Possible eventual behavior changes, only after evidence:
- context flag;
- confidence/risk annotation;
- selection veto/throttle only if stronger evidence supports it.

Current optimization status: FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY.

## VR-008 — data feasibility
Current project already has:
- D1 OHLCV/history for realized volatility candidates, subject to the known stale-history/session-continuity gate;
- TAIFEX derivatives research protocol with VIX/IV feasibility but evidence pending;
- market/breadth/global context in existing research/runtime.

Therefore realized-volatility research is feasible only on dates whose history continuity is proven. Implied-volatility research remains separate and must preserve TAIFEX source/session/rules-vintage provenance.

Missing or stale history = UNKNOWN, never low volatility.


## VR-009 — regime interaction must be conditional, not a universal penalty

A stock-level volatility feature and a market-level volatility regime answer different questions.

Pre-register interaction cells:
- market vol LOW/NORMAL/HIGH x stock relative vol LOW/NORMAL/HIGH;
- trend state positive/neutral/negative;
- A versus B selection channel.

Key falsification:
- if high stock volatility is harmful only when market volatility is also high, a universal stock-vol penalty is over-broad;
- if high relative volatility inside a calm market identifies genuine momentum leaders, a blanket penalty can destroy continuation alpha;
- if high volatility only proxies lateStage/overheat, it is redundant.

This makes heterogeneity an explicit test before any Formal proposal.

## VR-010 — crisis contamination and base-rate guard

Volatility research is especially vulnerable to a few extreme dates dominating averages.

Every evidence table must report:
- independent scan dates;
- top-1/top-3 event-date contribution;
- with/without extreme-market days;
- median as well as mean;
- sample count by A/B and market;
- UNKNOWN/stale-history count.

A candidate fails robustness if its sign or practical conclusion depends on a tiny crisis cluster.

## VR-011 — PIT close-clock constraint

The after-market selection scan occurs after Taiwan cash close, so same-session official OHLCV can be eligible only when the source publication/capture is known to precede the scan. Historical reconstruction must not assume that because a daily bar has date t it was already available at the exact decision clock.

Prospective receipts should preserve sourceDate, capturedAt/knownAt and session-continuity proof. Historical bars without such provenance may support descriptive mechanics but cannot automatically become PIT Formal evidence.

## VR-012 — relationship to derivatives lane

TAIFEX VIX/IV can test whether forward-looking risk pricing adds information beyond realized volatility. Validation order is frozen:
existing ATR/realized state -> trend/RS -> breadth/liquidity -> global context -> realized-vol change/shock -> TAIFEX implied candidate.

If implied features add no incremental value, keep them descriptive. If realized shock adds no value beyond existing ATR/overheat, reject it.

No new combined regime score is authorized.
