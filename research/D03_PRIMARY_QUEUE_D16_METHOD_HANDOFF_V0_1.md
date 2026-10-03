# D03 Primary Queue -> D16 Statistical Validation Handoff V0.1

Updated: 2026-10-04 Asia/Taipei
Producer: D03｜技術指標與趨勢動能研究室
Inference owner: D16｜統計驗證／PIT／Shadow／OOS／Anti-overfit
Status: OUTCOME_CLOSED / METHOD_HANDOFF_FROZEN / D16_METHOD_NOT_YET_RETURNED
Formal Core: LOCKED

## Purpose

D03 has frozen the feature semantics, nested comparison ladders, outcome family and rejection firewalls for:
- TI-005 KD vs RSI;
- TI-006 MACD vs direct trend.

D03 does **not** own the final inferential estimator.

This handoff tells D16 what must remain invariant and what methodological decisions D16 must return before T5 outcome access.

No outcome data are inspected here.

## TI-551 — D03 estimand ownership boundary

D03 owns:
- feature definitions and aliases;
- K0-K4 / M0-M3 nested model identities;
- exact common-support requirement;
- primary/secondary outcome family;
- multiple-testing family membership;
- rejection conditions;
- experiment order TI-005 then TI-006.

D16 owns:
- dependence-aware estimator;
- finite-sample uncertainty method;
- clustering/resampling procedure;
- purging/holdout implementation;
- small-cluster treatment;
- model-comparison test implementation;
- calibration of inferential uncertainty.

D16 must not change D03 indicator formulas, periods, thresholds, feature family, primary endpoint family or experiment order in response to outcomes.

If D16 concludes the preregistered design is statistically unidentified or inadequately powered, return METHOD_BLOCKED / POWER_INSUFFICIENT rather than alter the experiment after seeing outcomes.

## TI-552 — frozen dependence graph

A Technical Indicator parent row is not IID.

Dependence sources include:

1. **scanDate**
   - symbols share market, Regime, liquidity and news shocks.

2. **symbol**
   - the same security may appear on many dates.

3. **episode / parent lifecycle**
   - repeated setup/persistence/divergence states may span adjacent dates.

4. **overlapping outcomes**
   - adjacent scan dates can share D5/D10/D20 realization windows.

5. **shared feature history**
   - neighboring dates have overlapping ret/MA/RSI/KD/MACD lookbacks.

6. **sector/industry**
   - names can share common shocks beyond market-date dependence.

Therefore:
- row-pooled IID standard errors are prohibited;
- stock-row count is not independent N;
- raw number of indicator snapshots is never reported as independent replication count.

Primary reporting must always include:
- row count;
- independent scanDate count;
- unique symbol count;
- date cluster-size distribution;
- repeated-symbol share;
- outcome-window overlap diagnostics.

## TI-553 — required D16 return receipt

Before T5 outcome access, D16 must return a machine-readable receipt containing at least:

### Identity
- methodReceiptVersion;
- d03ExperimentVersion;
- preregistrationHash;
- featureContractHashes;
- parentContractVersion;
- continuityContractVersion;
- outcomeContractVersion.

### Population/common support
- expected parent population definition;
- common-support inclusion rule;
- BLOCKED/UNKNOWN/CONSTRAINED handling;
- selected-only inference explicitly false;
- date-level population accounting.

### Split
- chronological split rule;
- training scanDates;
- purged training scanDates;
- holdout scanDates;
- purge gap derived from max registered forward horizon;
- no holdout reuse for feature/method selection.

### Dependence
- primary dependence method;
- scanDate treatment;
- symbol/repeated-name treatment;
- overlapping-outcome treatment;
- small-cluster treatment;
- finite-sample / resampling method if used;
- assumptions and failure states.

### Estimands
For each registered nested comparison:
- exact outcome endpoint;
- exact contrast;
- weighting rule;
- uncertainty interval;
- effect-size metric.

### Robustness
- leave-one-date-out;
- non-overlapping-date sensitivity;
- date-balance vs row-balance diagnostic;
- Regime/industry/price-tier/liquidity concentration;
- repeated-symbol sensitivity;
- coverage/UNKNOWN sensitivity.

### Multiple testing
- full D03 family identifier;
- all H005/H006 cells retained;
- all primary/secondary endpoints retained;
- correction/reporting approach;
- failed/inconclusive cells remain in family.

### Terminal method states
Allowed:
- METHOD_READY;
- METHOD_BLOCKED;
- POWER_INSUFFICIENT;
- DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE;
- COMMON_SUPPORT_INSUFFICIENT;
- COVERAGE_BIASED;
- VERSION_INCOMPATIBLE.

No method receipt may directly output BUY/SELL or Formal promotion.

## TI-554 — inference output labels frozen before outcomes

D03 accepts the following research conclusions after D16 execution:

- NO_INCREMENTAL_VALUE;
- MECHANISM_PRESENT_BUT_PREDICTIVE_VALUE_INCONCLUSIVE;
- SPEED_NOISE_TRADEOFF;
- CONTEXT_PROXY_RISK;
- COVERAGE_BIASED;
- FRAGILE_DATE_DEPENDENCE;
- REGIME_OR_INDUSTRY_CONCENTRATED;
- VERSION_INCOMPATIBLE;
- PREDICTIVE_INCREMENTALITY_CANDIDATE.

`PREDICTIVE_INCREMENTALITY_CANDIDATE` requires survival of:
- preregistered primary D5 family;
- direct-price/trend controls;
- common-support controls;
- date dependence;
- holdout;
- relevant Regime/liquidity diagnostics;
- coverage/UNKNOWN/zero-pick checks;
- cost/risk burden where applicable.

It remains research-only.

## Required execution order

1. D03 S0 raw source-version gate.
2. D03 Technical observer T1-T4.
3. D16 method receipt returned and frozen.
4. T5 forward outcome join.
5. TI-005 KD vs RSI.
6. TI-006 MACD vs direct trend.
7. D16 T6 incremental inference / robustness.
8. only later optimization bridge review if evidence qualifies.

No step may be reordered because a later comparison looks more promising.

## Current state

`D16_METHOD_HANDOFF = FROZEN_V0_1`
`D16_METHOD_RECEIPT = NOT_YET_RETURNED`
`OUTCOMES = CLOSED`
`RAW_SOURCE_VERSION_GATE = 2_OF_3`
`TECHNICAL_OBSERVER_R1 = BLOCKED`
`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.
