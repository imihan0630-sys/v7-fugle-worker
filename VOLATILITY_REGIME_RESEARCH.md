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


## VR-022 — ATR geometry has channel-specific kinks; one global ATR optimum is structurally suspect

The frozen Formal formulas imply different marginal ATR effects before any empirical outcome is observed.

### B channel: explicit kink

B stop:
`breakout - max(0.65*ATR, breakout*0.012)`.

The ATR branch becomes binding when:
`0.65*ATR >= 0.012*breakout`.

Using `ATR = atrPercent/100 * close`, the crossover is:

`atrPercent >= 0.012*breakout/(0.65*close)*100`.

If close is near breakout, this is about 1.85%.
Examples:
- close/breakout=0.995 -> ~1.855%;
- 1.000 -> ~1.846%;
- 1.003 -> ~1.841%;
- 1.010 -> ~1.828%;
- 1.030 -> ~1.792%.

Thus a large part of the Formal 1%-10% ATR interval is in the ATR-binding regime for B. Above the crossover, higher ATR mechanically widens risk and lowers RR for fixed target geometry.

### A channel: binding depends on structureLow relative to support

A stop:
`min(support*0.98, structureLow-0.12*ATR)`.

The support stop remains binding while:
`support*0.98 <= structureLow-0.12*ATR`.

Approximate crossover, with close near support:

`atrPercent ~= ((structureLow/support)-0.98)/0.12*100`.

Illustrative structural ratios:
- structureLow/support=0.980 -> crossover ~0%;
- 0.985 -> ~4.17%;
- 0.990 -> ~8.33%;
- 0.995 -> ~12.5%;
- 1.000 -> ~16.67%.

Therefore when structureLow is close to support, the 2% support stop can remain binding throughout the whole Formal ATR range and A-channel RR can be largely ATR-insensitive. When structureLow is already below support, the structure-minus-ATR branch can bind much earlier.

### Consequence

A pooled empirical claim such as "ATR 3%-5% is best" can be an artifact of:
- channel mixture;
- different stop-binding states;
- target-distance distribution;
- different price tiers / tick geometry;
- later RR selection.

Any future ATR analysis must stratify A/B and stopBinding before fitting or even describing an apparent optimum.

Status:
`GLOBAL_ATR_OPTIMUM = STRUCTURALLY_MISSPECIFIED_UNLESS_CHANNEL_AND_BINDING_CONTROLLED`.

Machine spec:
`research/volatility_atr_conditioning_decomposition_v0_1.json`.


## VR-023 — RV5/RV20 is useful context but is an overlapping-window ratio, not a pure acceleration measure

Current market-volatility V0 uses:
- RV5;
- RV20;
- RV5/RV20.

This is intentionally simple and source-feasible, but the ratio has an important statistical interpretation limit:
the five returns entering RV5 are also contained inside RV20.

Therefore a recent volatility shock:
- raises the numerator;
- also raises the denominator;
- makes the ratio a damped, overlapping-window contrast rather than a clean "recent versus old" acceleration estimate.

This does NOT invalidate RV5/RV20 as a descriptive state variable. It means:
- do not treat RV5/RV20 as independent from RV5 and RV20;
- do not count the three as three separate positive/negative votes;
- do not infer causal acceleration from the ratio alone.

Outcome-free robustness comparator:
- `RV5_recent` versus `RV15_prior`, where the prior 15 returns explicitly exclude the recent five;
- both can be constructed from the same 20-return / 21-close official TAIEX window;
- no extra historical horizon is required;
- comparator is research-only and must not be added as a fourth permanent factor unless it proves incremental value.

Preferred test:
1. use the existing RV5/RV20 contract as the primary preregistered state;
2. use non-overlapping RV5_recent/RV15_prior only as robustness/decomposition;
3. if both lead to the same practical conclusion, confidence increases;
4. if only the overlapping ratio works, investigate mechanical overlap / denominator effects before promotion.

No threshold search is authorized.


## VR-024 — volatility source clocks must separate market RV from stock continuity risk

Market-level TAIEX close-to-close RV and stock-level volatility do not share the same provenance problem.

TAIEX market RV:
- the official FMTQIK path plus same-date scan-time availability contract materially supports prospective RV5/RV20 construction;
- the current 21-session contract is sufficient for 20 close-to-close returns.

Stock-level path volatility:
- V8.12 HISTORY_SOURCE_REVALIDATION materially validates raw unadjusted session presence and detects true missing traded bars;
- but RAW_HISTORY_ADMISSION is not the same as TECHNICAL_CONTINUITY across corporate-action resets;
- an ex-right/ex-dividend mechanical reset can contaminate raw close-to-close stock volatility unless the PIT-valid continuity transform is certified.

Therefore:
- market TAIEX RV can proceed prospectively under its own source contract;
- stock realized-vol / Yang-Zhang / overnight decomposition crossing relevant corporate-action boundaries must wait for the shared TECHNICAL_CONTINUITY contract or exclude unresolved windows;
- missing continuity evidence = UNKNOWN, never high-volatility evidence.

This asymmetry is important for incremental tests: a clean market-vol state must not be compared against a contaminated stock-vol control and then declared incremental.

Status:
`MARKET_RV_SOURCE_FEASIBLE / STOCK_CONTINUITY_CONDITIONAL`.


## VR-025 — external horizon evidence supports decomposition, not a new trading signal

Recent volatility-forecasting evidence in another Asian equity market finds that overnight information can improve future range-based volatility forecasts, with the benefit strongest at shorter horizons and weakening as the forecast horizon extends.

Use in this lane is limited:
- mechanism evidence that overnight and intraday volatility components can carry different information;
- motivation to keep overnight/intraday decomposition separate when a PIT-safe Taiwan source exists;
- NOT evidence that China-market coefficients or signs transfer to Taiwan;
- NOT authorization to use next-session opening gap in an after-close decision, because that gap is future information at the selection clock.

Source:
- Zhang (2025), Journal of Forecasting, DOI 10.1002/for.70011.

Status:
`OVERNIGHT_COMPONENT = RESEARCH_MOTIVATION_ONLY / TAIWAN_PIT_SOURCE_REQUIRED`.


## VR-026 — ATR conditioning observability audit: formulas are ready; denominator provenance is not

The outcome-free audit of the frozen L0-L4 ATR-conditioning decomposition is complete.

### What can already be computed from same-scan inputs

Existing research-only observers can compute without any new market-data calls:
- ordered gate state and whether ATR_QUALITY was actually reached;
- ATR gate PASS/FAIL/UNKNOWN;
- valid A/B channel assignment when earlier gates are clear;
- channel-specific entry/stop geometry and stopBinding;
- target availability and resistance candidates;
- TARGET_NULL versus LOW_RR versus RR_PASS;
- final signal-grade reach/pass/fail;
- original Formal result.

Reusable validated components:
- `research/formal_gate_overlap_observer_v0_1.mjs`;
- `research/channel_stage_denominator_observer_v0_1.mjs`;
- `research/target_rr_audit_observer_v0_1.mjs`;
- `research/formal_gate_replay_v0_1.mjs`.

Thus the mathematical/computational decomposition is not the blocker.

### Why outcome inference is still blocked

The legacy Shadow archive is not a promotion-grade denominator for ATR opportunity-cost research:
- `REJECTED_AFTER_BASE` is bounded and reason-sorted rather than prevalence-complete;
- `BROAD_CONTROL` is bounded sampled coverage and has its own admission conditions;
- `exclusion_reason` is first failure under fail-fast ordering, not an independent ATR contribution;
- the legacy primary key stores one cohort per symbol/date, preventing clean overlapping semantic memberships;
- same-date delete/rewrite semantics are mutable rather than immutable first-known decision generations;
- some research controls can recompute a pre-consensus score that is not identical to the actual post-consensus Formal ranking state;
- target value presence does not prove target PIT provenance;
- bounded readers can truncate the requested keyspace.

Therefore comparing outcomes of "ATR rejects" versus selected rows from the current legacy cohorts would compound selection bias, first-failure bias, sampling bias and provenance bias.

### Architecture decision

Do NOT create an ATR-specific persistence stack.

Reuse the already-designed shared immutable per-symbol decision-state parent from:
`SHADOW_COHORT_SEMANTICS_CLASS_B_PROPOSAL.md`.

ATR/volatility evidence should attach as a child/overlay containing:
- atrPercent / ATR gate state;
- channel;
- entry / stop / stopDistance / stopBinding;
- target state + target provenance;
- reward / risk / rewardPerRisk / RR state;
- actual post-consensus priority/rank/selected state.

This preserves one canonical parent for all research lanes and prevents cross-lane evidence drift.

### Research decision

`ATR_OUTCOME_ANALYSIS_ON_LEGACY_CONVENIENCE_COHORTS = BLOCKED`.

This is not a failure of ATR research. It is a successful falsification of an invalid empirical path.

Machine receipt:
`research/volatility_atr_conditioning_observability_audit_v0_1.json`.

Status:
`COMPUTATION_FEASIBLE / PROMOTION_GRADE_DENOMINATOR_NOT_YET_PERSISTED / NO_FORMAL_CHANGE`.


## VR-027 — revised exact continuation after observability audit

The next D04 evidence step is no longer another ATR formula audit.

Priority order:
1. verify prospective clean-date capture/persistence of TAIEX RV5, RV20 and RV5/RV20 under the existing official index decision-clock contract;
2. do not reconstruct historical first-known market-vol states from mutable latest snapshots;
3. once independent prospective dates exist, compare the preregistered overlapping RV5/RV20 state with non-overlapping recent-5/prior-15 only as a robustness decomposition;
4. attach stock-level volatility controls only when their history window is TECHNICAL_CONTINUITY-safe or explicitly excludes unresolved corporate-action windows;
5. ATR opportunity-cost/outcome analysis waits for the shared immutable decision-state parent rather than using legacy bounded cohorts;
6. no volatility throttle, ATR gate, stop, RR, rank or sizing change is authorized.

Current promotion status remains:
`FALSIFICATION_IN_PROGRESS / NOT_OPTIMIZATION_READY`.


## VR-028 — prospective market-RV persistence wiring audit

The next D04 blocker is now localized to the persistence/wiring layer rather than source availability or formula definition.

### What already exists

System 2 already has all of the structural pieces needed to persist market-volatility evidence:
- `SYSTEM2_MARKET_REGIME_V0.md` preregisters `realizedVol5`, `realizedVol20` and `volRatio5to20`;
- `s2_market_regime_snapshots` has `factor_observations_json` and source-receipt storage;
- `buildLimitedShadowRunBundleV0_1` accepts `regimeFactorObservations`;
- `buildFactorObservation` supports MARKET-scope raw values with explicit PIT provenance;
- the official A2 TAIEX/FMTQIK source-probe path exists for decision-clock availability evidence.

### What is not wired

Fresh repository search on 2026-09-28 found:
- no runtime implementation containing the literal raw factors `realizedVol5`, `realizedVol20` or `volRatio5to20` outside research/design documents;
- `regimeFactorObservations` appears only in the assembler/orchestrator definitions, with a default empty array;
- no repository caller currently supplies populated `regimeFactorObservations`;
- `runDailyLimitedShadowOrchestratorV0_1` itself is currently referenced only by its module/tests, not by an active production scheduling caller.

Therefore:
`SCHEMA_READY = YES`
`OFFICIAL_SOURCE_PROBE_READY = YES`
`RAW_MARKET_RV_FACTOR_WIRING = NOT_IMPLEMENTED_IN_CURRENT_REPO`
`PROSPECTIVE_MARKET_RV_EVIDENCE_ACCUMULATING = NOT_PROVEN`.

This is a research-evidence gap, not a volatility-theory gap.

### System 1 parallel observation

System 1 already loads official `V7_OFFICIAL_INDEX` history with at least 21 official sessions and same-date close validation. That source is computationally sufficient for RV5/RV20 without another external market-data request.

But repository search likewise found no durable research field named `marketRealizedVol5`, `marketRealizedVol20`, `marketVolRatio5to20`, `marketVolPointInTimeEligible` or `marketVolHistoryThrough` outside this research specification.

So "can compute" must not be confused with "was durably captured at the decision clock."

Status:
`COMPUTE_FEASIBLE / PERSISTENCE_WIRING_GAP / NO_FORMAL_CHANGE`.


## VR-029 — semantic guard: volatilityState is evidence state, not volatility direction

System 2's `buildMarketRegimeSnapshot()` currently constrains `volatilityState` to the generic observation-state vocabulary:
- KNOWN
- UNKNOWN
- STALE
- INVALID
- NOT_APPLICABLE

Therefore `volatilityState` in this runtime object means **whether volatility evidence is valid/available**, not:
- VOL_EXPANDING
- VOL_CONTRACTING
- HIGH_VOLATILITY
- LOW_VOLATILITY.

This distinction is easy to lose because the design document also uses "volatility state" in the economic sense.

Frozen semantic separation:
1. `regime.volatilityState` = evidence-quality state only;
2. raw RV values belong in MARKET-scope `regimeFactorObservations`;
3. economic labels such as VOL_EXPANDING/VOL_CONTRACTING belong in the regime label layer only after their required raw factors are PIT-ready;
4. no scalar market-risk score is created.

Minimum raw observations for V0.1:
- MARKET_RV5_CC_SIMPLE
- MARKET_RV20_CC_SIMPLE
- MARKET_RV_RATIO_5_20

Each observation must preserve:
- marketDate;
- decisionTimestamp;
- rawValue;
- sourceId/sourceName/sourceUrl/sourceDate;
- observedAt;
- availableAt;
- capturedAt;
- pointInTimeEligible;
- payload/source receipt reference.

The ratio is a derived descriptor from RV5 and RV20, not a third independent vote.

Status:
`SEMANTIC_COLLISION_PREVENTED / FACTOR_OBSERVATION_CONTRACT_FROZEN`.


## VR-030 — first valid market-RV evidence is prospective-only

The A2/FMTQIK observer and System 1 official-index quality path establish that same-date TAIEX data can be observed prospectively. They do not create immutable first-known historical market-RV vintages.

Therefore:
- pre-capture historical dates remain UNKNOWN for promotion-grade RV evidence;
- current/latest mutable snapshots cannot be retrospectively relabeled as exact decision-time RV observations;
- the first valid sample date is the first date on which raw RV5/RV20/ratio are actually persisted with the decision-clock receipt.

First research sequence after wiring:
1. verify exact same-date TAIEX source receipt;
2. persist raw RV5/RV20/ratio;
3. verify factor observations are referenced by the same regime snapshot and immutable run fingerprint;
4. accumulate independent clean dates;
5. only then evaluate VOL_EXPANDING/VOL_CONTRACTING and non-overlap recent5/prior15 robustness;
6. do not inspect strategy outcomes before the raw capture contract is frozen.

No new sample-count threshold is invented here. Reuse D16/D18 and the repository-wide independent-date/OOS maturity gates.

Status:
`MARKET_RV_CAPTURE_GATE = DEFINED / EVIDENCE_COUNT_ZERO_UNTIL_REAL_PERSISTENCE`.


## VR-031 — ATR% normalizes price scale, but not Taiwan tick-grid granularity

ATR% solves one important cross-sectional problem:
a NT$10 range means something different on a NT$100 stock versus a NT$2,000 stock.

But ATR% does not remove price-grid discreteness.

Current TWSE stock ticks are price-band dependent:
- <10: 0.01
- 10-50: 0.05
- 50-100: 0.10
- 100-500: 0.50
- 500-1000: 1
- >=1000: 5

This creates discontinuous relative-tick jumps at price-band boundaries.

### Structural examples

Using the official tick schedule:

- price 99.9, tick 0.1:
  - relative tick ~= 10 bps;
  - ATR 1% ~= 9.99 ticks;
  - 1.2% price distance ~= 11.99 ticks.

- price 100, tick 0.5:
  - relative tick = 50 bps;
  - ATR 1% = 2 ticks;
  - 1.2% price distance = 2.4 ticks.

- price 999, tick 1:
  - relative tick ~= 10 bps;
  - ATR 1% ~= 9.99 ticks;
  - 1.2% price distance ~= 11.99 ticks.

- price 1000, tick 5:
  - relative tick = 50 bps;
  - ATR 1% = 2 ticks;
  - 1.2% price distance = 2.4 ticks.

Thus two stocks with nearly identical price and identical ATR% can differ by roughly 5x in the number of legal price increments represented by that volatility.

### Why this matters to the current Formal geometry

The current B channel uses:
`stop = breakout - max(0.65*ATR, breakout*0.012)`.

The 1.2% floor is continuous-price geometry.
Near NT$1,000:
- just below the price band boundary, 1.2% spans roughly 12 ticks;
- at NT$1,000, it spans only 2.4 ticks.

This does NOT prove the stop is wrong.
It proves the same percentage risk geometry can have materially different execution granularity.

The A channel has the same general issue because support/structure/ATR-derived prices may land between legal ticks.

### Research-only descriptors

Freeze only descriptive fields first:
- `relativeTickBps = tick(close)/close*10000`;
- `atrTicksApprox = ATR_price/tick(close)`;
- `stopDistanceTicksApprox = abs(entry-stop)/tick(entry_or_close)`.

The suffix `Approx` is mandatory because a wide range can cross a TWSE tick band, and the legal tick at the actual order price may differ from the close-price tick.

A future execution-precision study should use the exact legal tick at each plan/order price.

### Falsification

This becomes useful only if, after controlling:
- price tier;
- liquidity;
- spread/depth;
- channel A/B;
- ATR%;
- stop distance %;
tick granularity still explains fill/slippage/stop behavior or path quality.

If not, keep it as execution semantics only.

Cross-lane handoff:
- D04 owns volatility/tick interpretation;
- D05 owns relative-tick microstructure state;
- D14/D15 own any eventual executable-price / stop-order implementation.

Status:
`ATR_TICK_GRANULARITY = STRUCTURAL_CONFOUND_CONFIRMED / RESEARCH_DESCRIPTOR_ONLY`.

Sources:
- TWSE Operating Rules Article 62.
- Tang, Peng & Zhang (2022), Trading information, price discreteness, and volatility estimation, Journal of Statistical Planning and Inference 220, 49-70.


## VR-032 — daily market RV and intraday local RV are different estimands

The project must not use one generic label "realized volatility" for two different clocks.

### Daily market-regime RV

`MARKET_RV5_CC_SIMPLE` / `MARKET_RV20_CC_SIMPLE` use official TAIEX close-to-close returns across sessions.

They answer:
- how variable the market has been across recent official sessions;
- whether recent session-to-session variability is expanding or contracting relative to a longer window.

They intentionally include:
- overnight information between official closes;
- opening/closing repricing that survives into the official close.

They do NOT estimate the latent continuous intraday integrated variance of a frictionless price process.

### Intraday local RV

Future D05 collector research may need a short-window volatility control around:
- a breakout;
- a pressure episode;
- a spread/depth shock;
- an execution window.

That object is a local intraday path-variation measure and has different measurement problems:
- bid-ask bounce;
- discrete ticks;
- irregular event spacing;
- asynchronous trade/book updates;
- auction/VI mechanism changes;
- missing/reconnect intervals.

Therefore:
- daily market RV and intraday local RV are separate factor families/controls;
- they must never be averaged or summed into one volatility score;
- passing the D04 market-RV persistence contract does not validate an intraday estimator;
- a future intraday estimator cannot replace the official daily RV regime contract.

Status:
`DAILY_REGIME_RV != INTRADAY_LOCAL_RV / ESTIMANDS_SEPARATED`.


## VR-033 — ultra-high-frequency naive RV is vulnerable to microstructure noise

Classical high-frequency volatility research establishes a crucial measurement boundary.

When observed prices contain market-microstructure noise, simply summing squared returns at ever-finer sampling frequencies can become biased/inconsistent for the latent integrated variance. The problem can persist when the noise is serially dependent.

Relevant evidence:
- Zhang, Mykland & Aït-Sahalia (2005): two-time-scale realized volatility was developed specifically because the usual highest-frequency realized-volatility estimator fails with noisy high-frequency data.
- Aït-Sahalia, Mykland & Zhang (2005/2011): dependent microstructure noise remains material and motivates multi-scale corrections.
- Bandi & Russell (2008): in the presence of microstructure noise, realized variance at very high frequency does not identify frictionless integrated variance; there is a bias-versus-sampling-variance tradeoff.
- Barndorff-Nielsen, Hansen, Lunde & Shephard (2008): realized kernels provide noise-robust inference for ex-post variation in equity prices.

Research consequence for this project:
- do not define local volatility as "sum every received trade-tick squared return";
- do not treat finer sampling as automatically superior;
- do not choose sampling frequency by whichever horizon improves strategy returns;
- if an intraday volatility control is needed, estimator/cadence selection is a measurement-quality problem first.

Status:
`TICK_BY_TICK_NAIVE_RV = NOT_APPROVED_AS_PRIMARY_LOCAL_VOLATILITY_CONTROL`.

Sources:
- Zhang, Mykland & Aït-Sahalia (2005), JASA 100(472), 1394-1411.
- Aït-Sahalia, Mykland & Zhang (2011), Journal of Econometrics 160(1), 160-175.
- Bandi & Russell (2008), Review of Economic Studies 75(2), 339-369.
- Barndorff-Nielsen et al. (2008), Econometrica 76(6), 1481-1536.


## VR-034 — mid-quote is the primary simple local-volatility price basis; trade RV is a noise diagnostic

For the first prospective D05 pilot, the simplest defensible local-volatility hierarchy is:

Primary simple basis:
- mid-quote derived from best bid/ask, only during normal continuous-market states with valid two-sided quotes.

Diagnostic comparator:
- transaction-price RV over the same causal window/cadence.

Why:
- transaction prices mechanically alternate between bid and ask and can embed bid-ask bounce;
- midpoint prices remove that direct trade-side bounce, although they still contain discreteness, stale-quote and other microstructure effects.

Do NOT interpret:
`tradeRV > midQuoteRV`
as automatically "true volatility is high."

It may be evidence of:
- bid-ask bounce;
- transaction-price noise;
- rapid information arrival;
- quote/trade timing mismatch;
- different sampling support.

Primary research output is the discrepancy itself as a data-quality/noise diagnostic, not a trading factor.

If a valid two-sided mid-quote is unavailable:
- local-midquote volatility = UNKNOWN;
- do not silently substitute last trade and preserve the same factor name.

Status:
`MIDQUOTE_PRIMARY_SIMPLE_BASIS / TRADE_RV_DIAGNOSTIC_ONLY`.


## VR-035 — volatility signature plot becomes an outcome-blind collector QA tool

A volatility signature plot compares realized variance computed from the same underlying period at different sampling cadences.

Empirical microstructure work uses this diagnostic to show that very fine transaction-price sampling can produce materially higher realized variance than coarser sampling because microstructure noise accumulates.

Project use:
- use the already-frozen engineering pilot cadences first: 1s / 5s / 15s;
- compare transaction and mid-quote local RV on identical causal windows;
- retain tick band, spread state, liquidity/activity state and session mechanism;
- use event-time intensity alongside clock time.

Interpretation:
- strong fine-scale RV inflation relative to coarser mid-quote RV => MICROSTRUCTURE_NOISE_CANDIDATE;
- stable estimates across 1s/5s/15s => sampling-frequency robustness candidate;
- divergence only in one price/tick/liquidity stratum => conditional measurement issue, not universal cadence.

Critical anti-overfit rule:
the cadence choice is based on:
1. state-reconstruction fidelity;
2. missingness/coverage;
3. estimator stability;
4. storage/operational burden;

NOT on which cadence predicts returns best.

Do not add 30s/60s/other frequencies after observing outcomes merely to search for a better effect. Any new cadence is a new preregistered measurement experiment.

Status:
`VOLATILITY_SIGNATURE_QA = FROZEN / OUTCOME_BLIND`.

Sources:
- Hansen & Lunde (2006), Journal of Business & Economic Statistics 24(2), 127-161.
- Bandi & Russell (2008), Review of Economic Studies 75(2), 339-369.


## VR-036 — auction and VI jumps are not continuous-session local volatility

Current TWSE regular-market mechanism is:
- opening call auction;
- continuous trading 09:00-13:25;
- call-auction mechanism during volatility interruption;
- closing call auction 13:25-13:30.

Therefore a local continuous-session volatility estimator must not pool:
- previous close -> opening auction price;
- continuous-session returns;
- VI/trial repricing;
- closing-auction displacement;
as if they came from one stationary continuous mechanism.

Freeze separate descriptors:
- overnightOpenAuctionGap;
- continuousSessionLocalRV;
- viCallAuctionDisplacement;
- closeAuctionDisplacement.

This is especially important for event studies:
an opening gap can carry legitimate overnight information but is not evidence that the 09:00-09:05 continuous book itself was volatile.

Similarly, a VI jump is a mechanism-state transition and must remain in a separate cohort.

Status:
`SESSION_SEGMENTED_VOLATILITY = MANDATORY_SEMANTICS`.

Source:
- Taiwan Stock Exchange, Trading Mechanism Introduction (current regular-trading mechanism).


## VR-037 — terminology falsification: D04 RV5/RV20 are rolling close-to-close dispersion, not academic intraday realized variance

A naming ambiguity is now explicitly resolved before the executable builder is promoted.

In the high-frequency econometrics literature, realized variance is conventionally constructed as the sum of squared high-frequency intraday returns over a fixed interval and targets quadratic variation.

The current System 2 daily-history primitive `volatility20`, by contrast, is:
- daily close-to-close SIMPLE returns;
- population standard deviation across the rolling window;
- demeaned by the rolling-window average return;
- not annualized.

The D04 market factors `MARKET_RV5_CC_SIMPLE` and `MARKET_RV20_CC_SIMPLE` were intended to align with this existing project statistical language, not to reconstruct intraday quadratic variation from official daily closes.

Therefore the existing factor IDs are retained for contract continuity, but their frozen semantic name is:

`ROLLING_CLOSE_TO_CLOSE_RETURN_DISPERSION_POPSTD_SIMPLE`

and NOT:
`INTRADAY_REALIZED_VARIANCE`.

### Why this matters

With daily returns r:
- rolling population variance uses mean((r - mean(r))^2);
- quadratic-return sum uses sum(r^2);
- they are related but are not identical;
- the difference becomes material when the window mean is non-negligible and the scaling convention differs.

Thus future documents must not compare the numerical magnitude of D04 RV5/RV20 directly with an intraday realized-variance series as if they were the same estimator.

### Contract consequence

Keep the existing IDs for backward compatibility:
- MARKET_RV5_CC_SIMPLE
- MARKET_RV20_CC_SIMPLE
- MARKET_RV_RATIO_5_20

But every persisted observation/builder must carry:
- estimatorFamily = ROLLING_RETURN_DISPERSION;
- returnType = SIMPLE_CLOSE_TO_CLOSE;
- dispersionEstimator = POPULATION_STD;
- annualized = false;
- intradayRealizedVariance = false.

If a future intraday realized-variance factor is introduced, it requires a distinct factor ID and source/cadence contract.

Status:
`FACTOR_ID_RETAINED / ESTIMATOR_SEMANTICS_DISAMBIGUATED / NO_FACTOR_EXPANSION`.

Sources:
- Andersen/Bollerslev realized-volatility convention as summarized in the modern realized-volatility literature.
- Bollerslev et al. (2018), Review of Financial Studies, realized variation as sum of high-frequency squared log returns.


## VR-038 — price-limit hits censor observed price discovery; constrained low range is not latent low volatility

Taiwan stock daily price limits create a structural identification problem for stock-level volatility measures.

Current TWSE rules generally constrain stock prices to +/-10% around the opening-auction reference price. When a stock reaches a binding limit, the observed session path is mechanically prevented from moving beyond that legal boundary even if demand/supply imbalance remains unresolved.

Therefore an observed limit-hit session may contain:
- valid realized OHLC observations inside the legal grid;
- unresolved price pressure beyond the observed boundary;
- delayed price discovery that can appear in later sessions;
- abnormal liquidity/depth behavior near the boundary.

The correct interpretation is:
`OBSERVED_CONSTRAINED_VOLATILITY`,
not:
`TRUE_LOW_LATENT_VOLATILITY`.

### Taiwan evidence and counter-evidence

Historical Taiwan evidence is not consistent with the simplistic claim that price limits always reduce volatility:
- Chen (1993) reports no significant volatility reduction from tighter limits and evidence consistent with delayed adjustment / serial-correlation effects.
- Huang, Fu & Ke (2001) report overnight continuation after limit moves and subsequent trading-time reversal, consistent with delayed overreaction resolution.
- Cho, Russell, Tiao & Tsay (2003) document a ceiling magnet effect in TWSE high-frequency data and discuss delayed price discovery, volatility spillover and trading interference.
- Later evidence on Taiwan's 2015 widening from 7% to 10% finds market-quality dimensions changed jointly: spreads and intraday volatility increased, depth decreased, while execution duration/fill rate improved.

These findings do not establish a universal directional trading rule. They establish that the limit mechanism changes the measurement and path of price discovery.

### Frozen state taxonomy for stock-volatility studies

Keep separate:
- LIMIT_NOT_NEAR;
- NEAR_UPPER_LIMIT;
- TOUCHED_UPPER_LIMIT_NOT_CLOSE;
- CLOSED_AT_UPPER_LIMIT;
- NEAR_LOWER_LIMIT;
- TOUCHED_LOWER_LIMIT_NOT_CLOSE;
- CLOSED_AT_LOWER_LIMIT;
- LIMIT_RULE_EXCEPTION_OR_UNKNOWN.

Do not pool these with ordinary sessions when estimating:
- ATR behavior;
- close-to-close volatility persistence;
- high-low range compression;
- contraction/expansion transitions;
- local intraday volatility.

### Censoring guard for contraction research

A narrow high-low range or low realized path immediately after a binding limit must not be classified as clean volatility contraction without a limit-state guard.

Likewise:
- a session pinned at limit-up can have a small late-session range while demand remains extreme;
- a session pinned at limit-down can show little further downside movement only because lower prices are illegal.

Thus:
`CONTRACTION + LIMIT_CONSTRAINED`
is a separate state, not ordinary contraction.

### No latent-price imputation

Prohibited:
- inventing a hypothetical unconstrained close beyond the price limit;
- fitting a "true" hidden equilibrium price from later returns and backfilling it into the limit-hit day;
- treating next-day continuation as information that was numerically known at the prior decision clock.

Allowed robustness:
- preserve the observed constrained day exactly;
- separately record post-limit D1/D2 path for outcome analysis;
- test whether apparent low/high volatility conclusions survive when limit-constrained sessions are excluded or stratified.

Status:
`PRICE_LIMIT_CENSORING = STRUCTURAL_MEASUREMENT_GUARD / NO_LATENT_PRICE_IMPUTATION`.

Sources:
- TWSE Operating Rules Article 63.
- Chen (1993), Pacific-Basin Finance Journal 1(2), 139-153.
- Huang, Fu & Ke (2001), International Review of Economics & Finance 10(3), 263-288.
- Cho, Russell, Tiao & Tsay (2003), Journal of Empirical Finance 10(1-2), 133-168.
- Lien, Hung, Zhu & Chen (2019), Pacific-Basin Finance Journal 55, 239-258.


## VR-039 — limit-hit contamination differs by volatility clock

The limit-censoring problem does not affect every D04 measure identically.

Stock daily ATR / range:
- directly constrained by legal high/low/close boundaries on a limit-hit session;
- can under-represent unresolved within-session price pressure at the boundary.

Stock close-to-close dispersion:
- the hit-day return is bounded by the rule;
- delayed price discovery can move variance into subsequent sessions;
- a 5/20-day rolling statistic may therefore redistribute, rather than eliminate, measured volatility.

TAIEX market close-to-close dispersion:
- the index itself is not interpreted as a single stock subject to the same per-security bound;
- however constituent-level constraints can alter aggregate price discovery indirectly;
- do not relabel an index-volatility move as "uncensored truth" about every constituent.

Intraday microstructure:
- limit proximity can saturate imbalance/depth and break approximately linear pressure-to-price response;
- D05 must use limit-constrained cohorts separately.

Research consequence:
stock-level volatility controls must carry the stock's limit-state provenance.
Market-level TAIEX RV remains a separate regime descriptor and cannot repair a censored stock-level volatility observation.

Status:
`LIMIT_CENSORING_IS_CLOCK_SPECIFIC / CROSS_SCALE_SUBSTITUTION_PROHIBITED`.
