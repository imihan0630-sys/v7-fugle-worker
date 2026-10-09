# D06｜首批策略 A1 證據契約 V0.1（Shadow-only）

## 正式界線

基於已存在的 `SHORT_MOMENTUM V0.1-CONTRACT`／`SWING_GROWTH V0.1-CONTRACT`，提供獨立、可執行、不可偷補缺漏的證據整合層；未更改原契約之策略核心假設、主因子、必要來源或硬排除，亦未將來源不足當成零入選或反證。

- A1 技術面只從既有 `TECH.TREND`、`TECH.STRUCTURE`、價量 `PV.RELATIVE_VOLUME`、`PV.ACCEPTANCE`、`PV.RESPONSE` 取證。
- 風險族群有 `RISK.LIQUIDITY`、`RISK.EXTENSION`，但 **`RISK.REWARD_RISK` 尚沒有可獨立證明的來源**；對 SHORT_MOMENTUM 必須留為 UNKNOWN / INCOMPLETE，不能自行認定 BUY_ELIGIBLE。
- SWING_GROWTH 的 **`FUNDAMENTAL_QUALITY`、`INDUSTRY_THESIS`** 不可由 A1 OHLCV 代替；兩者缺 PIT 來源時維持 INCOMPLETE。
- `KNOWN` 只表示記錄中的描述性因子來源一致、在當下可用，不代表 Alpha、有效突破、報酬、進場訊號。必要族群須依原契約設為 `unknownBlocksEligibility`。
- 必須核對：策略 ID／版本、有限 Shadow spec、決策日期與時點、A1 bundle 雜湊及 factor/source/date/availableAt/provenance。一律 fail closed。
- 禁止自訂數值型策略權重、優化門檻、偷偷補入未觀測的大盤資料、授予正式選股／排名或產生交易推播。此實作只供現有 daily Shadow orchestrator 的 **選擇性 assessor 回呼**；未自動排程。
- 自動稽核範圍：缺 `RISK.REWARD_RISK`、SWING 兩個必要族群、偽造來源可用時點、公司／日期錯配、重複或缺因子、bundle/來源竄改、策略契約不符、來源未證明連續性。Synthetic tests 不證明實體 PIT、真實資料覆蓋或最終策略績效。

## 與 15 關驗收的關係

`D06` 由 `POLICY_PREREG_PARTIAL` 推至 `A1_SOURCE_HONEST_EVIDENCE_POLICY_CODED`，仍 **NOT VERIFIED**：精確策略 Alpha／reward-risk 來源及 OOS/Shadow 等尚待資料與評估完成。`D07` 仍需 B10 實體最新資料、完整母體 PIT、已證實可知資訊與完整的 evaluator，以正反驗證後的策略版本才可授權。

**此文件不宣稱 D06／D07 已完成或允許真正選股。**
