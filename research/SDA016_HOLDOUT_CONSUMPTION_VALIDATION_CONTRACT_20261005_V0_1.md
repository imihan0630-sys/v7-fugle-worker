# SDA-016｜D16 樣本外消費與驗證獨立性契約 V0.1

更新：2026-10-05 Asia/Taipei  
狀態：RESEARCH_ONLY / VALIDATION_OWNER_CONTRACT_FROZEN / ENGINEERING_HANDOFF_READY  
主責研究室：11｜統計驗證與策略市場狀態研究室  
獨立結案：00｜研究總控室  
正式核心影響：NONE

## 1. 問題定義

SDA-016 防止「驗證者自己把驗證資料逐步變成訓練資料」。

以下任何行為只要發生在看過 holdout 結果之後，都屬於 adaptive reuse：
- 改 target；
- 改 benchmark；
- 改 horizon；
- 改 population；
- 改 primary metric；
- 改 MDE；
- 改 feature / regime / policy family；
- 改 stop rule；
- 因結果不漂亮而新增 challenger；
- 反覆查看同一 holdout，直到某版本通過；
- 只保留贏家、刪掉失敗版本。

既有 preregistration 原則保留。本契約只補 generic holdout consumption semantics，不重做既有 D16 研究。

## 2. Canonical experiment family identity

每個研究假說必須先凍結 `experimentFamilyId`。同一家族至少綁定：

- `targetId` / `targetHash`;
- `benchmarkId` / `benchmarkHash`;
- `horizonId`;
- `populationId` / universe semantics;
- `strategyId` / `strategyVersion`;
- predictor / factor / regime / policy family;
- cost semantics;
- primary metric + direction;
- MDE;
- stopping rule;
- sequential-testing policy;
- multiple-testing family id.

### 家族不可藉改版本洗白

看過 outcome 之後：
- 改 target / benchmark / horizon / metric / regime split / feature set / threshold / stop rule，必須建立新 experiment version；
- 但仍保留在原本的 adaptive family lineage；
- 不得因建立新 version 就把已看過的 holdout 重新稱為 untouched OOS。

新版本可以在已看過的資料上開發，但該資料狀態必須是 `DEVELOPMENT_CONSUMED`。

## 3. Holdout identity

`holdoutId` 必須同時綁：
- exact independent decision-date set;
- date-set hash;
- population/universe version;
- outcome target + horizon;
- matured-outcome cutoff;
- source/provenance version;
- cost semantics where applicable.

只改 logical name 不得創造新 holdout。

若兩個 holdout 的日期集合有重疊：
- 必須回報 overlap dates / overlap ratio；
- 重疊日期不得在同一家族被重複計為新的獨立 confirmation evidence；
- 新增非重疊日期可形成 rolling prospective evidence，但有效獨立日期只計一次。

## 4. Holdout lifecycle

### `RESERVED_UNSEEN`
已凍結，但任何 outcome-derived primary result 尚未返回給研究者。

### `CONFIRMATORY_EVALUATED`
已依 preregistered analysis 完成第一次 confirmatory evaluation。
此 holdout 可保存該次結果，但不得再作為新版假說的 untouched confirmation set。

### `DEVELOPMENT_CONSUMED`
任一情形成立即進入：
- 看過完整結果後修改假說；
- 非預註冊額外切分／新 benchmark／新 horizon；
- outcome-guided parameter search；
- fixed-N 設計下提前偷看並依結果決定續停；
- 反覆查詢以選模型／門檻／版本。

### `SEQUENTIAL_ACTIVE`
只有在第一次查看 outcome 前已凍結 sequential policy 才允許。
每次 look 必須登錄預定資訊時間、統計量與 error-control 規則。

### `RETIRED`
不再允許任何新的 confirmatory claim。

狀態只可朝更消耗資料的方向移動，不得逆轉。

## 5. Default stopping rule

預設為 fixed-sample / fixed-information confirmation。

若沒有事前 sequential policy：
- 任何 outcome-derived interim look 都使該 holdout 對新假說進入 `DEVELOPMENT_CONSUMED`;
- 不得看到接近顯著後再延長樣本、看到不顯著就提早停止，再使用普通固定樣本 p-value 冒充有效推論。

若事前選用 sequentially-valid 方法：
- 方法與界線必須在第一次 outcome look 前凍結；
- 每一次 look 必須寫入 ledger；
- 不得在 look 之間更改 target、family、benchmark 或方向；
- sequential validity 只解決 optional stopping，不解決 post-hoc hypothesis mutation 或 family expansion。

## 6. Minimum holdout-use ledger

System 1 / System 2 應共用同一 canonical schema，至少包含：

- `experimentFamilyId`;
- `experimentVersion`;
- `holdoutId`;
- `holdoutDateSetHash`;
- `targetHash`;
- `benchmarkHash`;
- `horizonId`;
- `populationHash`;
- `primaryMetricHash`;
- `multipleTestingFamilyId`;
- `stopRuleHash`;
- `sequentialPolicyHash`;
- `outcomeLockHash`;
- `holdoutUseCount`;
- `firstInspectedAt`;
- `lastInspectedAt`;
- `accessPurpose`;
- `fieldsReturnedHash`;
- `resultDigest`;
- `consumptionState`;
- `consumedAsDevelopmentData`;
- overlap lineage to prior holdouts.

## 7. Outcome lock

第一次合法 evaluation 前先建立 `outcomeLockHash`，綁定：
- exact decision dates / rows；
- target；
- horizon；
- maturity cutoff；
- corporate-action / continuity semantics；
- benchmark；
- cost semantics；
- missing / UNKNOWN rules。

同一 experiment version 下：
- targetHash mutation => REJECT；
- benchmarkHash mutation => REJECT；
- horizon mutation => REJECT；
- outcome-set mutation => REJECT；
- UNKNOWN -> 0 / loss coercion => REJECT。

## 8. Negative-result preservation

所有真正 evaluation 都必須留下：
- experiment version；
- result digest；
- PASS / FAIL / INCONCLUSIVE；
- support；
- coverage；
- tested metric；
- termination reason。

不得刪除失敗版本後只讓成功版本留在 registry。

同一家族嘗試次數與 ledger 實際 evaluation 次數必須可核對。

## 9. Adversarial acceptance tests

工程驗收至少必須通過：

1. 同一 experiment + 同一 holdout 重播：結果 deterministic，但 `holdoutUseCount` 不能被當成新增獨立證據。
2. 同 experiment version 改 target：拒絕。
3. 同 experiment version 改 benchmark：拒絕。
4. 看過結果後建立新 version 並沿用同 holdout：允許 development replay，但狀態必須 `DEVELOPMENT_CONSUMED`，不得標 untouched OOS。
5. 只換 holdout 名稱但 date-set hash 相同：不得視為新 holdout。
6. 新 holdout 與舊 holdout 部分日期重疊：必須顯示 overlap，獨立日期不得重複計數。
7. fixed-N 未預註冊 interim look 後再繼續：普通固定樣本 confirmatory claim 失效。
8. preregistered sequential method：允許按凍結規則多次 look，但 family / target / benchmark mutation 仍拒絕。
9. negative variant 被 registry 刪除：family-count / ledger-count mismatch，驗收失敗。
10. System 1 與 System 2 對同一 physical holdout 使用不同 logical id：以 date-set/outcome lock 識別重複消費。
11. D18 outcome-driven regime split：必須同時觸發 SDA-017 family expansion 與 SDA-016 holdout consumption。
12. outcome arrival 只能 append outcome，不得改 prediction / preregistration / decision receipt。

## 10. Validation claim taxonomy

### `EXPLORATORY`
可以使用 development-consumed data；不可稱 untouched OOS。

### `OOS_CONFIRMATORY`
要求：
- holdout 在 evaluation 前為 `RESERVED_UNSEEN`;
- family / target / benchmark / metric / stop rule 均事前凍結；
- evaluation 後立即變為 `CONFIRMATORY_EVALUATED`;
- 同一資料不得再次為新版假說提供 untouched confirmation。

### `PROSPECTIVE_CONFIRMATORY`
除了上述條件，還要求 receipt 在真實 decision time 生成，不能歷史回填。

### `SEQUENTIAL_CONFIRMATORY`
只有 preregistered sequential policy 且每次 look 完整留痕才成立。

## 11. External methodology anchors

- Dwork et al. (2015): adaptive reuse of holdout can overfit the holdout itself.
- Nakkiran & Błasiok (2018): limited exposure to holdout information is central to generic holdout validity.
- Johari, Pekelis & Walsh (2015): continuous monitoring under ordinary fixed-sample inference is invalid; always-valid methods require a dedicated sequential framework.
- Financial data-snooping literature such as White/Hansen/SPA families motivates family-wise accounting when many trading rules are searched.

這些方法論只支持治理原則，不直接證明任何台股策略有效。

## 12. Closure boundary

11 室可以：
- 定義 semantics；
- 驗證工程是否符合本契約；
- 回報 specialist-complete。

11 室不得自行將 SDA-016 標為 CLOSED。

最終 closure 必須由 00 獨立 readback，且要求：
- canonical ledger 已實裝；
- mutation rejection tests PASS；
- repeated-OOS adversarial tests PASS；
- System 1 / System 2 未 fork 成不相容 schema。

FORMAL_OPTIMIZATION_CANDIDATE: NONE
Formal Core: LOCKED

## 13. Exact next

交給 System 1 / System 2 experiment infrastructure 實作 canonical holdout-use ledger / outcome lock。
完成後由 11 室依本文件執行 adversarial validation，再送 00 獨立結案。
