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


## VR-013 — TAIEX official realized-vol source audit

Current Production already has a materially stronger prospective realized-volatility source contract than the earlier broad blocker implied.

The official INDEX quality contract:
- accepts only TWSE FMTQIK monthly payloads from the exact official endpoint;
- requires the official fields `日期` and `發行量加權股價指數`;
- rejects duplicate, future and abnormal index points;
- requires the selection-date close to be present;
- requires the most recent 21 official market sessions to be present through `recentWeekdays()`, which itself uses the loaded TWSE official holiday calendar via `isTradingDate()`;
- returns the point-in-time scan input `history[]`, `return20`, `dailyReturn` and an explicit official TAIEX definition.

The normal after-market scan reads the same-date INDEX snapshot before candidate selection and fails closed when it is absent. A successful scan therefore proves that the same-session official index snapshot was available before Formal selection ran.

This materially resolves prospective SOURCE_FEASIBILITY for TAIEX realized volatility.

### Important remaining PIT boundary

The current D1 quality snapshot is upserted by (dataset_key, market_date), and `readQualitySnapshot()` returns the stored JSON rather than an immutable first-known vintage ledger.

Therefore:
- future scan-time capture can be point-in-time eligible;
- current/latest snapshots must NOT be used to fabricate an exact historical first-known volatility state;
- historical volatility research without immutable decision-time provenance remains UNKNOWN for promotion purposes.

Status:
`TAIEX_REALIZED_VOL_PROSPECTIVE_SOURCE = MATERIAL_PASS`
`TAIEX_REALIZED_VOL_HISTORICAL_FIRST_KNOWN_VINTAGE = NOT_PROVEN`

## VR-014 — minimal prospective TAIEX realized-volatility primitives

The smallest non-tuned capture is frozen as raw continuous features only:

- `marketRealizedVol5`
- `marketRealizedVol20`
- `marketVolRatio5to20 = marketRealizedVol5 / marketRealizedVol20`
- `marketVolSource = TWSE_FMTQIK_OFFICIAL_TAIEX`
- `marketVolHistoryThrough = scanDate`
- `marketVolPointInTimeEligible = true` only when the same-date official INDEX snapshot is the one consumed by the successful scan
- `marketVolDefinition = STDDEV_SIMPLE_DAILY_CLOSE_TO_CLOSE_RETURN_PCT`

V0.1 rules:
- use close-to-close simple daily percentage returns;
- no annualization is needed for the first within-system comparison;
- no HIGH/NORMAL/LOW thresholds;
- no z-score lookback selected from outcome performance;
- no RV60 claim: the current INDEX quality contract guarantees the recent 21 official sessions, not 61;
- insufficient exact history => UNKNOWN, never low volatility.

This intentionally aligns with System 2 `SYSTEM2_MARKET_REGIME_V0.md`, which already preregisters realizedVol5, realizedVol20 and volRatio5to20. The two systems should share the raw market-state primitives rather than invent separate volatility taxonomies.

## VR-015 — transition × volatility × return-origin falsification

Taiwan evidence makes a one-dimensional volatility penalty especially suspect.

Lin, Ko, Feng & Yang (2016) finds Taiwan momentum continuation is strongly conditional on whether the market state continues or transitions.

Ho et al. (2023), studying Taiwan intraday versus overnight momentum, reports that market dynamics and market volatility help explain traditional/overnight momentum variation but do not account for the persistent intraday-momentum effect.

The resulting preregistered question is therefore not “is high volatility bad?” It is:

Does market realized-volatility level/change add incremental information to the reliability or downside of current A/B selections after controlling for:
- current market regime level;
- proven consecutive-session regime continuation/transition state;
- stock ATR/volatility20;
- ret20/ret60, Residual RS and sector state;
- overheat/lateStage;
- liquidity;
- Quiet/Attention;
- next-session overnight versus intraday outcome decomposition where valid?

Critical falsifications:
- if volatility loses effect after R06 transition state, treat it as a transition proxy;
- if volatility affects only overnight path while intraday continuation remains stable, do not apply a universal A/B penalty;
- if stock-level ATR/volatility20 absorbs the result, market volatility is redundant;
- if the result is crisis-date driven, remove the extreme dates and reject fragility;
- if effect exists only in one A/B channel, retain channel-conditional evidence rather than a universal rule.

No new R09 is created. Reuse existing R05/R06 outcome clocks and the existing validation firewall when prospective fields become available.

## VR-016 — prospective capture engineering boundary

A future runtime implementation is Class A only if it:
- reuses the already-loaded `V7_OFFICIAL_INDEX` snapshot;
- adds zero external market-data calls;
- writes only research/Shadow market context;
- sets `decisionImpact=false`;
- cannot alter scoreCandidate, strategySetupState, ranking comparator, pool quotas, capital, monitor, signals or push;
- never backfills old Shadow rows with current index data;
- is regression-tested against frozen Formal outputs.

Because V8.15 is already reserved by the concurrent Valuation Provenance Shadow branch, the volatility capture version must use the next available version only after that branch lineage is resolved. Do not race or overwrite the concurrent branch.

Current status:
`PROSPECTIVE_CAPTURE_SPEC_READY / RUNTIME_NOT_YET_WIRED / HISTORICAL_VINTAGE_BLOCKED / NOT_OPTIMIZATION_READY`.

## VR-017 — exact next evidence gate

Before any return/outcome lookup:
1. prospectively preserve the three raw TAIEX volatility primitives in the selection-day research context;
2. prove parent coverage and source-date exactness on every eligible clean scan date;
3. keep historical pre-capture dates UNKNOWN for this feature;
4. accumulate independent clean scan dates before directional interpretation;
5. only then run incremental controls against R06 transition, stock ATR/volatility, regime, Residual RS, overheat and liquidity;
6. report return and risk/path outcomes separately;
7. do not propose a volatility throttle unless the effect survives crisis removal, PIT/OOS, date clustering, redundancy and coverage/zero-pick tests.


## VR-018 — Formal ATR-to-RR channel coupling

Current Formal does more with ATR than the simple 1–10% volatility gate suggests.

Decision path:
1. reject atrPercent <1 or >10;
2. convert ATR% into price ATR;
3. use ATR inside channel-specific stop construction;
4. stop distance determines RR;
5. RR<2 rejects;
6. RR then contributes 14% of PriorityScore and raw RR remains a later comparator.

Thus ATR has indirect multi-layer influence even though ATR is not itself a PriorityScore term.

### Channel asymmetry

A:
`stop=min(support*0.98, structureLow-0.12*ATR)`.

B:
`stop=breakout-max(0.65*ATR, breakout*0.012)`.

B has a 1.2% minimum stop floor; once 0.65*ATR exceeds that floor, further ATR increases directly widen risk and reduce RR for fixed entry/target.

A can remain pinned to the 2% support stop over a wide ATR range when the structure low is near support, making its RR much less ATR-sensitive.

### Fixed structural witness

With B breakout=100, close=101, entry=100.3 and fixed target=110.3:
- ATR 1% => stop 98.8, RR 6.67;
- ATR 3% => stop 98.03, RR 4.41;
- ATR 5% => stop 96.72, RR 2.79;
- ATR 7% => RR 2.04;
- ATR 8% => RR 1.80 => rejected by RR<2;
- ATR 10% => RR 1.46.

This is not an empirical distribution and does not imply the 8% threshold is universally meaningful. It proves only the structural coupling.

Machine artifact:
`research/atr_rr_channel_coupling_v0_1.json`.

### Research consequence

Volatility studies must separate:
- explicit ATR gate effect;
- stop-geometry effect;
- RR gate effect;
- RR rank/sizing effect.

Otherwise an observed “high ATR underperforms among selected stocks” can be heavily selection-conditioned by the fact that many high-ATR B setups never survive to selection.

No ATR/stop/RR change is authorized.


## VR-019 — Cross-lane handoff from Technical Indicators: OHLC range estimators

The Technical Indicator lane audited Parkinson / Garman-Klass / Rogers-Satchell / Yang-Zhang as one VOLATILITY/RISK family rather than four technical votes.

Key retained finding:
- Yang-Zhang is not algebraically redundant with current stock close-to-close volatility20 or ATR because it explicitly separates overnight Close->Open variance, Open->Close variance and Rogers-Satchell intraday OHLC range geometry.
- Parkinson/GK/RS remain robustness/decomposition comparators only.
- first common-horizon system-native comparator is YZ20, not a parameter sweep and not XQ's 14-day default.
- no directional sign is assumed; first questions concern MAE/range/stop-first/gap risk and volatility composition.

### Current data feasibility

Fresh repository audit materially improves source feasibility:
- current history persists open/high/low/close;
- V8.12 history-source revalidation explicitly requests open/high/low/close from historical source.

But current normalization can synthesize missing OHLC values, including open fallback to close. Yang-Zhang cannot distinguish an observed Open from an imputed Open unless origin provenance is persisted.

Therefore:
- RAW_OHLC_SOURCE_FEASIBILITY = MATERIAL_PASS;
- PER_BAR_OBSERVED_OHLC_PROVENANCE = NOT_PROVEN;
- YZ_RUNTIME_INFERENCE_READY = NO.

### Cross-lane semantic requirement

Yang-Zhang must consume canonical TECHNICAL_CONTINUITY across corporate-action boundaries. Raw ex-right/ex-dividend resets must not become overnight volatility, while residual non-mechanical gaps remain market information.

Verified suspension/no-trade dates are absent observations, not zero-volatility bars.

Price-limit-constrained sessions remain valid realized OHLC observations but must be stratified as constrained price discovery; truncated range cannot be interpreted as low latent pressure.

### Frozen research artifact

- research/TECHNICAL_INDICATOR_RANGE_VOLATILITY_V0_1.md
- research/technical_indicator_range_volatility_fixtures_v0_1.json

Fixtures freeze:
same close/different range; same current OHLC/different previous close; gap-only flat intraday; missing-open fallback; corporate-action reset; suspension; consecutive price limit; price-scale invariance; same ATR/different risk composition.

No outcome inspection and no volatility throttle is authorized.


## VR-020 — external falsification: volatility scaling is not a universal improvement rule

External evidence is deliberately treated as two-sided rather than as support for a monotone "high volatility = reduce risk" rule.

Positive evidence:
- Moreira & Muir (2017), *Volatility-Managed Portfolios*, Journal of Finance 72(4), report that portfolios which take less risk when volatility is high can improve Sharpe ratios and utility in several factor settings.
- This supports the mechanism that conditional risk scaling can matter when volatility changes faster than expected returns.

Counter-evidence:
- Cederburg, O'Doherty, Wang & Yan (2020), *On the performance of volatility-managed portfolios*, Journal of Financial Economics 138(1), test 103 equity strategies and find no systematic direct outperformance of volatility-managed versions; reasonable real-time / out-of-sample implementations generally have lower certainty-equivalent returns and Sharpe ratios than the unmanaged strategies because the estimated spanning relations are structurally unstable.

System implication:
- The external literature does NOT justify a universal volatility throttle or a monotone stock penalty.
- Volatility remains a conditional risk/context variable whose incremental value must be tested inside the actual A/B channel, market regime, and existing ATR/RR geometry.
- Any future scaling rule belongs behind PIT/OOS/Walk-forward/Shadow gates and should be judged on downside/path quality as well as return.

Frozen falsification design:
1. no outcome-tuned HIGH/NORMAL/LOW thresholds;
2. use continuous market RV5, RV20 and RV5/RV20 ratio where prospectively valid;
3. separate A versus B;
4. control existing stock ATR/volatility20, trend/Residual RS, liquidity, sector/regime, overheat/lateStage and R06 transition state;
5. report D1/D3/D5 residual return, MAE, MFE and realized path volatility separately;
6. remove top crisis dates and repeat;
7. compare unmanaged baseline versus any research-only scaling simulation;
8. reject any apparent benefit that disappears after existing ATR/RR controls or only survives one crisis cluster.

Status:
`VOLATILITY_SCALING = CONDITIONAL_RESEARCH_ONLY / UNIVERSAL_THROTTLE_REJECTED_AS_UNPROVEN`.

Sources:
- Moreira & Muir (2017), DOI 10.1111/jofi.12513.
- Cederburg et al. (2020), DOI 10.1016/j.jfineco.2020.04.015.


## VR-021 — ATR selection-conditioning must be separated before judging volatility alpha

Current Formal architecture already conditions the sample through:
- an ATR-percent admission band;
- channel-specific ATR-based stop geometry;
- RR rejection;
- RR contribution to PriorityScore / later ordering.

Therefore a post-selection comparison such as "selected high-ATR names underperform selected low-ATR names" is not a clean estimate of volatility effect. The selected sample has already been truncated and reshaped by ATR itself.

Required decomposition for every future ATR / realized-volatility study:
A. pre-ATR eligible universe;
B. after explicit ATR gate;
C. after channel-specific stop construction;
D. after RR>=2 survival;
E. final selected cohort.

For each layer preserve:
- sample count;
- A/B channel;
- ATR% distribution;
- stop-distance distribution;
- RR distribution;
- rejected count and reason;
- later return / MAE / MFE only when PIT outcome matching is valid.

Primary falsification:
- if a volatility effect is strong only after ATR/RR conditioning but weak before those gates, treat it first as selection-geometry interaction rather than independent alpha;
- if a new volatility feature is monotone with existing ATR/volatility20 or simply predicts the same RR rejection, mark REDUNDANT;
- if it adds downside/path information after the full decomposition, retain it as a risk-context candidate.

Cross-lane handoff:
- D04 owns volatility-state evidence;
- D15 owns any eventual position-sizing or risk-budget implementation;
- no D04 result alone authorizes a capital-sizing change.

Status:
`ATR_CONDITIONING_DECOMPOSITION = PREREGISTERED / NO_FORMAL_CHANGE`.
