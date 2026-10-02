# D04/D05 overlapping-window dependence falsification — 2026-10-02

Status: MECHANISM_AND_INFERENCE_GUARD_FROZEN / RESEARCH_ONLY
Formal Core: LOCKED

## Problem

Exact common support solves sample comparability. It does not create independent observations.

Two overlap mechanisms matter here.

### D04 rolling-volatility overlap

Daily RV5/dispersion5 at t and t+1 share 4 of 5 close-to-close returns.
Daily RV20/dispersion20 at t and t+1 share 19 of 20 returns.

Even under a simple stationary return process, the rolling state series is mechanically persistent because most inputs are reused. A run of `VOL_CONTRACTING` labels is therefore not automatically evidence of a distinct persistent latent regime.

Required guards:
- preserve one observation per marketDate;
- report occupancy/transition descriptively;
- do not count consecutive daily rolling windows as statistically independent;
- retain a non-overlap recent5/prior15 robustness view;
- for inference, preregister block/date-cluster or suitable overlapping-observation methods before outcomes;
- maturity counts remain independent trading dates, not the number of rolling windows.

### D05 forward-horizon overlap

If a microstructure state is sampled every 15 seconds or 1 minute and every observation receives a +10m/+15m/+30m future markout, adjacent outcomes share most of the same future price path.

Example:
- 15-minute forward return measured every minute;
- neighboring outcomes share roughly 14 of 15 minutes.

That creates pseudo-replication:
- many rows;
- far fewer independent path realizations.

Common-support filtering does not solve this.

## Frozen promotion inference unit

For D05 promotion/readiness:
- raw/event windows = mechanism observations;
- symbol-day summaries = first aggregation layer;
- marketDate = primary independent evidence unit for maturity/date robustness;
- multiple symbols or thousands of intraday windows on one day do NOT add independent-date count.

Any inferential test using overlapping forward horizons must preregister one of:
1. non-overlapping/thinned horizon samples;
2. event episodes with one fixed anchor per episode;
3. dependence-aware block/bootstrap or HAC-style inference with small-sample diagnostics.

Do not choose the method that yields the best p-value after seeing outcomes.

## Date-cluster robustness

Required reporting:
- number of raw buckets;
- common-support buckets;
- unique signal episodes;
- unique symbol-days;
- unique marketDates;
- contribution by top 1/3/5 dates;
- effect with top date clusters removed.

If a result is driven by one high-volatility date containing thousands of buckets, classify it as DATE_CLUSTER_CONCENTRATED, not broad evidence.

## Cross-symbol dependence

Multiple symbols on one Taiwan trading day share:
- index/macro news;
- matching-engine/session mechanisms;
- liquidity shocks;
- sector flows.

Therefore symbol count cannot automatically substitute for date count.

A cross-sectional panel may improve mechanism estimation, but promotion robustness still requires multiple independent dates/regimes.

## Literature anchors

- Hansen & Hodrick (1980), Journal of Political Economy 88(5): k-step-ahead forecasting with observations sampled more finely than the forecast interval requires serial-dependence-aware inference.
- Valkanov (2003), Journal of Financial Economics: overlapping long-horizon variables create serious small-sample/inference problems beyond merely adding conventional autocorrelation corrections.
- Boudoukh, Israel & Richardson (2022), Journal of Financial Economics 145(3): long-horizon overlapping predictive regressions have horizon/sample-size/predictor-persistence-related bias; HAC standard-error behavior also requires caution.
- Hedegaard & Hodrick (2016), Journal of Banking & Finance 67: non-overlapping starting samples can give materially different estimates, motivating explicit overlapping-data inference.

## System consequence

No new factor, threshold or action.

D04:
- a rolling-volatility state can be used as descriptive context only after genuine prospective capture;
- consecutive state days must not inflate effective evidence count.

D05:
- 1s/5s/15s common-support QA is necessary but insufficient;
- E1/E2/E3 effect estimates require temporal-dependence handling;
- a large bucket N cannot promote OFI/pressure into 15m BUY context.

Status:
`OVERLAPPING_WINDOW_DEPENDENCE = FIRST_CLASS_FALSIFICATION_GUARD`
`INDEPENDENT_EVIDENCE_UNIT_FOR_PROMOTION = MARKET_DATE`
