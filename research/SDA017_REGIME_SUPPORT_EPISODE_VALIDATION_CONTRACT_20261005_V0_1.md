# SDA-017｜D18 市場狀態挖礦防火牆與支援／事件段落驗證契約 V0.1

更新：2026-10-05 Asia/Taipei  
狀態：RESEARCH_ONLY / VALIDATION_OWNER_CONTRACT_FROZEN / ENGINEERING_HANDOFF_READY  
主責研究室：11｜統計驗證與策略市場狀態研究室  
獨立結案：00｜研究總控室  
正式核心影響：NONE

## 1. 問題定義

SDA-017 防止「先看策略在哪些日期賺錢，再回頭發明一個 Regime 解釋它」。

既有 D18 ex-ante taxonomy、decision clock、attribution-vs-policy split、D18-01 observable vector、D18-08 activation preregistration、D18-14 walk-forward contract 全部保留，不重做。

本契約只補：
- exact support semantics；
- episode semantics；
- unsupported state handling；
- Regime family expansion 與 SDA-016 holdout consumption 的聯動；
- engineering acceptance。

## 2. Ex-ante regime identity

每一個可用於策略互動的離散 Regime 必須在 outcome 前凍結：

- `regimeFamilyId`;
- `regimeVectorVersion`;
- dimension；
- state labels；
- exact raw inputs；
- transform / threshold；
- source / universe / history lineage；
- decisionTimestamp；
- availableAt rule；
- UNKNOWN rule；
- policy mapping if any。

沒有凍結 threshold 的 `CONTEXT_RAW` 不得事後切成「高／低」再稱既有 Regime。

## 3. Regime episode definition

一個 episode 是：

> 同一 discrete state 在相鄰 official Taiwan trading sessions 上連續成立的一段日期。

Episode 必須遵守：
- official-session adjacency；
- state 改變 => 新 episode；
- UNKNOWN / missing / clock-invalid => 終止 episode；
- UNKNOWN gap 之後即使回到相同 state，也算新 episode；
- 不得跨資料缺口 bridge；
- regimeVectorVersion 改變 => 強制新 episode lineage；
- source/universe semantics 重大改版 => 不得默認延續同一 episode。

很多股票列或很多同一 episode 日期，不等於很多獨立 Regime episodes。

## 4. Support units

每個策略 × Regime × horizon × policy challenger 必須至少同時報：

- row N；
- independent decision-date N；
- effective independent-date N（依 D16-06）；
- episode N；
- transition N；
- regime occupancy fraction；
- UNKNOWN / CONTEXT_RAW fraction；
- paired baseline/challenger date N；
- policy-disabled / enabled / natural-zero / data-unknown N；
- source-complete / source-blocked N。

禁止只報股票 row N。

## 5. Conservative governance floors

以下為本研究系統的保守治理門檻，不宣稱為普世統計定理。

### `INSUFFICIENT_SUPPORT`
任一成立：
- effective independent-date N < 10；
- episode N < 2；
- 只有單一 episode；
- paired baseline/challenger support 不足；
- UNKNOWN / blocked coverage 未報；
- outcome join 不完整到無法識別缺失機制。

不得作方向性政策結論。

### `EXPLORATORY_SUPPORT`
全部成立：
- effective independent-date N >= 10；
- episode N >= 2；
- 至少兩個不同時間段的 episode；
- paired baseline/challenger 可比較；
- UNKNOWN / coverage 完整揭露。

可作探索性描述，不得升 L4 或授權策略。

### `PRIMARY_VALIDATION_ELIGIBLE`
全部成立：
- effective independent-date N >= 20；
- episode N >= 3；
- 至少一個非單一連續市場階段的重現；
- static baseline + challenger 完全 paired；
- cost semantics identical；
- exposure-matched control 可用時必須納入；
- no single episode explains > 50% of independent supported dates，否則至少標 `EPISODE_DOMINANCE_WARNING` 且不得單獨通過；
- D16 dependence-aware inference 可執行；
- experiment / holdout 使用符合 SDA-016。

即使達到以上條件，也只是有資格進入主要驗證，不代表策略有效。

## 6. Simple-baseline-first rule

Regime policy 必須先與最簡單基準比較：

1. static no-regime strategy；
2. single-dimension preregistered Regime challenger；
3. only then multi-dimension / richer policy challenger。

若單一 dimension 已能解釋效果，多維 Regime 不得因增加切片後表現更漂亮就取得獨立 Alpha credit。

複雜 Regime 只能主張增量價值，不得把 baseline 已有的 trend / volatility / breadth 訊息重複算一次。

## 7. Unsupported-state rule

### Observer layer
若某 dimension 不成熟：
- `UNKNOWN` 或 `CONTEXT_RAW`;
- 不得 coerced 成 neutral；
- 不得自動歸到最接近 state。

### Policy evaluation layer
若 policy 所需 state：
- UNKNOWN；
- CONTEXT_RAW；
- support state 未達 preregistered minimum；
- provenance / clock 不合格；

則 action 必須是：
- `DATA_UNKNOWN` 或 `ABSTAIN`。

不得：
- 當作 policy enabled；
- 當作 policy disabled；
- 丟掉該日期後只在有利子樣本算績效。

## 8. Post-hoc split firewall

看過 outcome 後以下任何動作，都視為新 Regime hypothesis family：

- 改 threshold；
- 新增 state；
- 合併／拆分 state；
- 換 horizon；
- 換 strategy；
- 改 policy mapping；
- 改 minimum-duration；
- 改 transition rule；
- 從多個 dimension 中只保留表現最好者；
- 從多個 episode 中排除不利 episode。

此時：
1. 新版本必須進入同一 multiple-testing lineage；
2. 原 holdout 對新版 family 依 SDA-016 標 `DEVELOPMENT_CONSUMED`；
3. 新版不得用同一資料宣稱 untouched OOS；
4. 必須取得新的 prospective / untouched holdout 才能 confirm。

## 9. Regime receipt minimum contract

Executable immutable `regimeStateReceipt` 至少要有：

- `receiptId`;
- `regimeFamilyId`;
- `regimeVectorVersion`;
- `marketDate`;
- `decisionTimestamp`;
- `finalizedAt`;
- component receipt ids / hashes；
- source / universe / history versions；
- each dimension state；
- each dimension support state；
- UNKNOWN reason；
- evidenceCompleteness；
- episodeId；
- episodeOrdinal / firstDate；
- priorSessionReceiptHash；
- transitionFrom / transitionTo；
- receipt hash；
- researchOnly / no live policy authority。

不可由規格回推整段歷史 receipt。

## 10. Prospective policy validation

任何 D18 policy claim 至少必須綁：
- frozen strategy/version；
- frozen Regime/vector version；
- frozen policy/version；
- static baseline；
- cost contract；
- outcome horizon；
- MDE；
- experiment family；
- holdout id；
- SDA-016 consumption state。

主要估計單位優先為 decision date / episode，而非 stock rows。

`POLICY_DISABLED` 必須計 missed-opportunity cost。
`NATURAL_ZERO_PICK` 不得當 policy success。
`DATA_UNKNOWN` 不得被刪除。
`POLICY_ENABLED` 與 baseline 必須同日同策略比較。

## 11. Adversarial acceptance tests

工程與研究驗收至少包含：

1. outcome 高的日期被事後定義為新 Regime：新 family，原 holdout development-consumed，不能 confirm。
2. outcome 後改 threshold：same version reject；new version 仍需新 untouched holdout。
3. UNKNOWN 日期被丟棄後績效變好：coverage mismatch，reject。
4. 一個長 episode 有很多日期：episode N 仍為 1，`INSUFFICIENT_SUPPORT`。
5. UNKNOWN gap 前後相同 state：必須是兩個 episodes。
6. regimeVectorVersion 改變但 episodeId 延續：reject。
7. `CONTEXT_RAW` 被直接映射成 policy action：reject。
8. unsupported discrete state 被視為 KEEP / DISABLE：reject，應 `ABSTAIN` / `DATA_UNKNOWN`。
9. baseline 與 challenger 使用不同 cost：reject。
10. policy-disabled 日期沒有 opportunity-cost outcome：不能 promotion。
11. stock-row N 很大但獨立日期／episode 很少：不得通過 support gate。
12. 只在最佳 Regime state 報結果、未登錄其他 state：family/accounting mismatch。
13. 使用 smoothed / future-informed latent state 做 decision-time policy：reject。
14. historical spec reconstruction 被標 prospective：reject。
15. 同一 Regime primitive 同時透過 trend / composite / policy 多次算獨立票：需 redundancy / lineage 警示，不得增加有效獨立證據數。

## 12. Counterevidence requirement

Regime 是 explanatory context，不預設能提高選股或策略報酬。

若：
- static baseline 同樣好；
- Regime 增量在 exposure-matched control 消失；
- 成本後無改善；
- 多 episode 不重現；
- benefit 只在單一 episode；
- Regime inputs 與既有 stock-level trend / volatility / breadth 高度冗餘；

則應簡化或放棄 Regime policy，而不是增加更多 state。

2026 年近期公開研究亦提供直接反例：加入 HMM regime features / regime-specific models / regime-dependent optimization 不必然改善 OOS stock ranking；Regime 可能較適合解釋「何時有效」，不代表能提升選股本身。此類外部結果只作反證錨點，不是台股證據。

## 13. Ownership boundary

11 室：
- 凍結支援、episode、UNKNOWN、family-expansion、反證規則；
- 驗證 System 2 builder / observer；
- 驗證 prospective policy evidence；
- 不自行關票。

System 2：
- 依本契約與既有 D18 preregistration 實作 immutable observer/builder；
- 不自動 live gating / weight。

System 1：
- 在 evidence / owner approval 前只可消費 context，不得自動新增 ranking / Top6 / capital authority。

00：
- 獨立 readback 並決定 SDA-017 closure。

FORMAL_OPTIMIZATION_CANDIDATE: NONE
Formal Core: LOCKED

## 14. Exact next

1. System 2 依既有 D18 semantics 實作／補齊完整 intended state family 的 immutable `regimeStateReceipt`。
2. 機器層必須實作 support / episode / UNKNOWN / ABSTAIN 規則。
3. 11 室用本文件 adversarial tests 驗收。
4. 真正 prospective receipts 累積後，才允許 policy-value evaluation。
5. 最終由 00 獨立結案。
