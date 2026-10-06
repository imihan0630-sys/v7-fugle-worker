# D16｜SDA-022 D5 增量研究停止與開封規則 V0.1

更新：2026-10-06 Asia/Taipei
狀態：PRE-OUTCOME STOPPING RULE FROZEN / SINGLE PRIMARY LOOK / NO MATURITY CHANGE
實驗：`D16-SDA022-01`
研究流：`ROOM11_CROSS_SYSTEM_INCREMENTALITY_STREAM_20261006_V0_1`

## 1. 原則

本研究不採每日、每週或每達一個新樣本就重新查看主要經濟結果。

Primary inference 只允許在所有前置條件滿足後進行一次主要開封。

在此之前允許檢查：
- schema completeness；
- receipt integrity；
- policy fingerprints；
- decision-clock compatibility；
- coverage counts；
- UNKNOWN / missing counts；
- support readiness；
- dependence-design readiness。

禁止檢查：
- 哪個 arm 報酬比較高；
- Brier difference 的方向；
- p-value / confidence interval；
- D1/D3/D10 是否比 D5 好看；
- 哪個 Regime / sector 看起來最漂亮。

## 2. Primary opening gate

只有全部滿足才允許第一次 primary economic-outcome inference：

1. System1 fingerprint family `S22-T01~T05` PASS；
2. System2 SHORT_MOMENTUM fingerprint relevant family `S22-T06~T10` PASS；
3. physical NC-T01 relevant family `S22-T11~T16` PASS；
4. prospective pair receipts available and immutable；
5. common information cutoff verified；
6. exact model-state encoding frozen；
7. ModelMethodReceipt frozen；
8. MDE or precision target frozen；
9. effective independent decision dates >= 40 under D16 dependence accounting；
10. both outcome classes have usable support；
11. multiple replication clusters / episodes exist；
12. no single cluster dominates under frozen diagnostic；
13. coverage / missing / UNKNOWN denominators complete；
14. SDA-016 outcome-footprint consumption valid；
15. outer-stream state is either:
   - confirmatory method frozen and valid, or
   - explicitly exploratory-only.

## 3. No efficacy early stopping

Before first primary opening:
- no early success stop；
- no early futility stop based on economic outcome；
- no threshold lowering；
- no horizon switching；
- no predictor-family switching。

Operational stop is allowed only for:
- schema failure；
- data-quality failure；
- source discontinuity；
- policy-version mutation；
- clock incompatibility；
- invalid lineage；
- safety/governance violation。

Operational stop does not count as statistical evidence against or for the hypothesis.

## 4. After first primary opening

V0.1 permits one primary inferential read.

If the result is inconclusive:
- do not repeatedly reopen every new date under the same fixed-sample interpretation；
- either preserve it as inconclusive and accumulate under a newly preregistered sequential design,
  or define a new experiment/version with a fresh prospective boundary。

The original first-look result remains permanently preserved.

## 5. Support floor interpretation

`40 effective independent decision dates` is the current D16 governance floor for primary eligibility.

It is not:
- an effect-size guarantee；
- a power calculation；
- proof that dependence has disappeared；
- permission to ignore class imbalance or cluster dominance。

Numerical MDE / precision target remains separately required before opening outcomes.

## 6. Exact current state

System1 fingerprint:
PASS 5/5.

D16 prereg boundary:
PASS 4/4.

System2 fingerprint:
PENDING.

NC-T01 physical proof:
PENDING.

Prospective overlap/divergence:
NOT_STARTED.

Primary outcome access:
CLOSED.

Formal Core:
LOCKED.
