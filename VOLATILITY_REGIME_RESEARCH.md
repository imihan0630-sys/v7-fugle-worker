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
