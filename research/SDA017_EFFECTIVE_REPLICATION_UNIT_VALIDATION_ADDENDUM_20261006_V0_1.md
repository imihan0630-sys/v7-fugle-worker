# SDA-017｜有效重現單位與多軸支援證據補充契約 V0.1

更新：2026-10-06 Asia/Taipei  
狀態：RESEARCH_ONLY / FOURTH_ROUND_VALIDATION_ADDENDUM_FROZEN / NO_MATURITY_CHANGE  
主責研究室：11｜統計驗證與策略市場狀態研究室  
前置契約：
- `research/SDA017_REGIME_SUPPORT_EPISODE_VALIDATION_CONTRACT_20261005_V0_1.md`
- `research/SDA017_EPISODE_HORIZON_DEPENDENCE_VALIDATION_ADDENDUM_20261005_V0_1.md`
- `research/SDA017_REALTIME_FIT_FRAGMENTATION_VALIDATION_ADDENDUM_20261005_V0_1.md`
正式核心影響：NONE

## 1. 第四層風險：不存在一個萬用 effective replication N

D18 support 不得把下列任一數字單獨當成「獨立證據量」：
- row N；
- decision-date N；
- structural episode N；
- replication episode N；
- transition N；
- autocorrelation-derived ESS；
- cluster count。

原因：
每一個數字都只描述 dependence structure 的一個切面。

Cluster-robust / time-series literature均顯示 inference reliability 還取決於：
- cluster size imbalance；
- leverage / influence；
- treated/exposed cluster scarcity；
- serial dependence；
- block structure；
- estimator / bootstrap choice。

因此 D18 promotion 使用 **support vector**，不是 single magic N。

## 2. Canonical support vector

每個 Regime × policy claim 最少同時報：

### Coverage axis
- calendarCandidateN；
- prospectiveAdmissibleDateN；
- KNOWN date N；
- UNKNOWN date N；
- state-specific admissibility fraction。

### Date axis
- rawDecisionDateN；
- effectiveIndependentDateN；
- contiguousSegmentN；
- calendarSpanSessions；
- longestContinuousSegmentN。

### Episode axis
- structuralEpisodeN；
- replicationEpisodeN；
- mechanicalFragmentN；
- completedEpisodeN；
- activeEpisodeN；
- rightCensoredEpisodeN。

### Replication-cluster axis
- replicationClusterN；
- clusterSizeDistribution；
- maxClusterDateShare；
- clusterLeverage / influence diagnostics；
- leave-one-replication-cluster-out stability。

### Transition-path axis
- predecessorState distribution；
- successorState distribution（secondary / ex-post only when future state is needed）；
- transitionPathConcentration；
- transitionCrossingOutcomeN。

### Outcome-footprint axis
- SDA-016 fresh/consumed state；
- overlapping outcome-session footprint；
- purge/embargo rule；
- effective block / HAC / cluster diagnostic chosen by D16-06.

## 3. Replication cluster definition

Structural episode 是 observation segmentation。
Replication cluster 是 evidence-independence governance unit。

預設：
- UNKNOWN / source / version / clock mechanical split 前後的 same-state structural episodes仍屬同一 replication cluster；
- threshold chatter cluster內同 state recurrences不取得新 replication credit；
- outcome footprint高度重疊的 adjacent episodes不能只因 episodeId 不同就算獨立；
- 是否能拆成不同 replication cluster，需依 preregistered separation / washout contract + D16 dependence diagnostics。

本契約不凍結一個 universal washout session count。
它要求 washout rule:
- outcome-independent；
- target-horizon-aware；
- before-result frozen；
- sensitivity-tested。

## 4. Claim scale 必須匹配 replication scale

若結論聲稱：
「策略在 Regime S 普遍有效」，
就需要跨 replication clusters / separated periods 的 recurrence。

若證據其實只來自單一 cluster / single market phase：
合法結論只能縮成：
`PHASE_CONDITIONAL_OBSERVATION`.

不得把：
single-phase evidence
→ generic Regime policy claim。

## 5. Primary weighting

D18 primary policy estimand仍是：
`DECISION_STATE_CONDITIONAL`.

因此 primary aggregation 預設維持 decision-date weighting / paired decision support。

Episode-equal weighting 是另一個 estimand：
- 短 episode 會獲得較高相對權重；
- 長 episode 會被降權。

可以報 secondary episode-balanced sensitivity，但不能在看 result 後替換 primary。

任何 date-weight -> episode-weight mutation after outcome access：
new analysis family / SDA-016 consumption accounting。

## 6. Leave-one-replication-cluster-out fragility

達到至少多 cluster support 後，必須報：
- 每次移除一個 replication cluster 的 effect / score delta；
- sign stability；
- rank/order stability；
- support-state stability。

若主要方向只由單一 cluster 支撐，或移除一個 cluster 即翻號：
`REPLICATION_FRAGILE`.

`REPLICATION_FRAGILE` 可以是研究結果，
但不能 standalone promotion。

這與 cluster influence diagnostics 一致：cluster N 多不代表每個 cluster 貢獻均衡。

## 7. Transition-path concentration

同一 Regime S 可能主要由一種 predecessor path 形成，例如：
- DOWN -> S；
- RANGE -> S；
- HIGH_VOL -> S。

Primary DECISION_STATE_CONDITIONAL 不需事後重切 primary sample，
但必須揭露 transition-path concentration。

若幾乎所有 positive evidence 都集中在單一 predecessor path：
`STATE_EFFECT_HETEROGENEITY_WARNING`.

不得直接宣稱 state-generic policy value。

若之後決定把 predecessor path正式加入 policy：
new Regime/policy family；
SDA-016 consumption rules apply。

## 8. Calendar breadth

三個 episode 全發生在同一短期市場震盪，不等於跨期重現。

所以另外報：
- first / last prospective evidence date；
- span sessions；
- separatedPeriodN under frozen separation rule；
- episode-to-episode gap distribution。

沒有 universal「隔幾天才算新 phase」。
但沒有實質 calendar breadth 時，不得用 episode count包裝成多期驗證。

## 9. 第四輪對抗驗收

41. outcome 後把 primary aggregation由 equal decision-date 改成 equal episode：estimand mutation + SDA-016 accounting。
42. mechanical UNKNOWN/version fragments各自算 independent replication：合併 replication cluster。
43. structuralEpisodeN>=3 但全部屬同一 replicationCluster：不得 PRIMARY_VALIDATION_ELIGIBLE。
44. leave-one-replication-cluster-out 任一刪除即翻主要方向：`REPLICATION_FRAGILE`.
45. date occupancy看似平衡，但一個 replication cluster主導 effect / leverage：cluster-dominance warning，不能 standalone promotion。
46. positive evidence高度集中在單一 predecessor transition path卻宣稱 generic state effect：`STATE_EFFECT_HETEROGENEITY_WARNING`.
47. episode數足夠但全部集中於狹窄 calendar span，separatedPeriodN不足：recurrence breadth insufficient。
48. 只輸出單一 ESS / N_eff，未揭露 date / episode / cluster / block / influence diagnostics：support accounting fail。

## 10. Support-state refinement

新增：
- `STRUCTURAL_SUPPORT_INSUFFICIENT`;
- `STRUCTURAL_SUPPORT_READY_REPLICATION_PENDING`;
- `REPLICATION_SUPPORT_READY_STATISTICAL_DEPENDENCE_PENDING`;
- `PRIMARY_VALIDATION_ELIGIBLE`;
- `REPLICATION_FRAGILE`;
- `STATE_EFFECT_HETEROGENEITY_WARNING`.

Warning state 不一定抹掉所有研究價值，但不能被自動轉成 promotion。

## 11. 方法論錨點

Cluster inference research支持：
- small / unbalanced clusters與高 leverage / influence可能造成傳統 cluster inference不可靠；
- effective number of clusters 不能只看 nominal cluster count；
- jackknife / bootstrap / influence diagnostics可用來評估脆弱度，但沒有一個方法在所有結構都可靠。

Recurrent-event research亦指出同一單位內重複事件具有內在相關性，忽略相關會讓 uncertainty過窄。

因此 D18應保留多軸 support，而不是發明一個單一「事件段落有效樣本數」。

## 12. Exact next

SDA-017 validation oracle 下一版納入 T41~T48。

System2 future support engine minimum outputs新增：
- replicationClusterId；
- replicationClusterN；
- clusterSizeDistribution；
- maxClusterDateShare；
- leaveOneReplicationClusterOut diagnostics；
- primaryWeightingRule；
- predecessorStateDistribution；
- transitionPathConcentration；
- evidenceCalendarSpanSessions；
- separatedPeriodN；
- supportVectorVersion。

不更改任何 Formal selection / ranking / Top6 / capital / push / policy weight。

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED
