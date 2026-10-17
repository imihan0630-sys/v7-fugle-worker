# System 2｜2026-10-17 Owner 同意 PIT 三軌並行：DATA 執行與准入邊界 V0.1

- **Owner decision:** 2026-10-17 Asia/Taipei 對「Scheme C 研究預覽優先、PIT-A 只驗證策略實際使用資料、PIT-B 歷史回測平行」三項建議明確回覆「同意」。
- **Decision scope:** 優先順序、資料研究範圍及 Class A 非交易研究工程獲准持續；**不是**既有 Stage1 正式准入條件／七因子／權重／策略版本、Cloudflare D1 Frozen 寫入、Cron/正式交易、System1 V8 Formal Core 的無條件改動或放行。
- **Canonical intake main SHA:** `a49ebe4911239e4a485697371b71b4b7605276a7`；後續任何執行一律重新讀取最新 main。
- **Change class:** Class A documentation / source-only lane priority receipt; effective Stage1 gate changes are Class B/C **另行逐案正式核准**。
- **Owners:** DATA #1068；BUILD #1132/#1234；AUDIT 獨立簽核；REMEDIATION 只處理帳戶 quota/權限。
- **Precedence:** [DATA/BUILD contract](../SYSTEM2_PIT_DATA_BUILD_OWNERSHIP_AND_HANDOFF_V0_1.md)、[PIT-A used-input correction](PIT_A_USED_INPUT_SCOPE_CORRECTION_PROPOSAL_V0_1.md)、[Scheme C existing fast-launch handoff](../evidence/S2_SCHEME_C_DATA_BUILD_FAST_LAUNCH_HANDOFF_20261017_V0_1.md)、System1 Formal governance 均維持效力。本檔**不替代**已保存的原始 source/AUDIT receipts。

## 目標一｜P0 Scheme C 每日非 PIT 研究預覽先真正可用

**DATA_LANE** 只供應同一新市場日 T、既有官方 source collector 原始 61-session calendar × TWSE/TPEx 122/122 pairs、原始 Run/Artifact/body SHA、獨立 source audit receipts 及第一觀測時間；不重複執行已驗證的官方全市場 GET、不重新建立來源 Cron／D1 writer。

**BUILD_LANE** 維持已合併的三層研究路由、`workflow_run` 下游與只讀手動補跑入口；把真實 T 的 `NON_PIT_PREVIEW` 候選觀察、描述性理由、來源品質、觀測時間、已知 CA 正向風險及 UNKNOWN 清楚呈現，**不是**正式 Stage1 七因子綜合排名或 BUY。任意 post-cut T+1 仍可如實輸出 **LATE_SOURCE research preview**，不可回填 T23:45 決策。

**P0 實際完成定義**：在新的真正市場日上，原始 122/122 + 獨立 audit + 自然 main 下游 `workflow_run` + 可讀 derived report/Artifact 實際驗收；以 exact source/audit/build Run/Artifact/SHA 認證。GH `workflow_dispatch` 人工補跑、PR fixture replay、workflow success 空 Artifact 均**不等於**自然每日自動化通關。來源不足時明示 `SOURCE_NOT_READY` 而非「零檔」。

## 目標二｜P1 PIT-A 採每個策略版本實際使用資料，逐檔實證

1. **BUILD 已做且不得重做：** `SHORT_MOMENTUM V0.1-CONTRACT` 的原 Stage1 **7/7 實際必備因素**、`CURRENT_LAUNCH_FACTORS` 與真正使用的 A1 61日行情／CFI 現時身分／相關 CA 價格連續性／交易狀態／同日市場資料／獨立 AUDIT，已明確記錄於 `system2/runtime/pita_short_momentum_used_input_manifest_v0_1.mjs`。完整策略其他版本不得套用本限定範圍來剔除原必需因子。
2. **DATA 負責補原始證據：** 每個 `market|symbol|T|decisionCut|strategyVersion|usedInput` 都對應真正官方原始 SHA、source version/觀測時間、可確認之 `firstKnownAt/availableAt`；仍查無的保留 `UNKNOWN`，不得用後來抓到的原始資料倒推舊日可得。
3. **PIT-A 不做與「實際使用資料」無關的 PIT-B 完全版本覆蓋：** 現時普通股身分要在真正 cut 有效；只有策略確實需要歷史類別的欄位才額外要求歷史 CFI 版本。六類 CA 要涵蓋實際使用的因子可能受影響之正向事件、歷史更正撤銷及相關無事件負證，**未知影響仍 BLOCKED**；不得刪必要因子換取通關。
4. **實例 2330/TWSE：** 2026-10-16 原始 61/61 daily bar source-only + 2026-09-16 已知正向除息，尚未證原 61 日價格轉換合格、as-of 交易狀態、全部 7 因子 source/audit；原日局部 PIT-A `0/1`。
5. **實例 3287/TPEX：** 2026-10-16 原始 61/61 official bar + 2026-08-26 正向除息已實證；已有來源診斷 19 個 metric source-window，其中 `ma60`、`ret60`、`priorHigh60` 跨已知價格斷點。T 最新官方行情實際 2026-10-17 00:44 才觀測（晚於 T 23:45），原日局部 PIT-A `0/1`，不可追認；尚未認證其他 CA NO_EVENT。
6. **重要政策矛盾：** BUILD 目前 `stage1_ca_pit_evidence_gate_v0_1.mjs` 將 CA 事件全阻擋，即使後級 assessor 已能表達 `ADJUSTED_CONTINUITY`；另有 `stage1_instrument_class_pit_gate_v0_1.mjs` 強制歷史 61-session CFI 完整版本。DATA/AUDIT 先證明實際 used-input 範圍與正反例；BUILD **只製作獨立 versioned 改動提案、impact diff、負例、Shadow 隔離及 regressions**，不得將此 owner 對「方向」同意解釋成已同意任何具體新准入演算法，**逐案 Class B/C 核准後才可變更有效關卡**。

**P1 實際完成定義**：首檔真實新 T、原決策 cutoff 之前各實際使用輸入可得、相關事件價格連續性已證、現在股別/交易狀態有原始原生證據、完整來源與獨立 AUDIT exact scope 簽署、相應准入版本已核准且實際執行。只有那時該檔於該 T 的 `PIT_A_ACCEPTED=1/1`，但不推論全市場合格或准許 D1 Frozen。

## 目標三｜P2 PIT-B 歷史研究與 D1/R2 搬遷平行

以歷史資料當時真實版本、公布時間、CA 修正撤回、成本滑價及 OOS 做完整 replay；不因後來知道結果重寫舊 snapshot。既有歷史 D1 搬遷截至先前已驗證收據 `59,311/84,688`（70.04%）**不得當成 2026-10-17 新實體查詢現況**。目的端 R2 `NOT_ENTITLED`、Cloudflare quota/writer interlock 要獨立處理；PIT-B 未完成不得卡住已批准的只讀 Scheme C。

## 否證／驗收卡

| Gate | 允許稱為成功的證據 | 目前禁止宣稱 |
|---|---|---|
| P0 可用研究預覽 | 新交易日真正實際 A1→AUDIT→main 下游自動 Artifact，明示真實時計 | 2026-10-16 PR-only 回放就是新日自動成功 |
| P1 單檔 daily PIT-A | 全部實際使用資料的原始公佈/available clocks、事件連續性、class/tradeability、AUDIT 簽章與正式版本核准 | 122/122 A1、CFI 現時觀察、6/6 CA source-only 自動構成 PIT PASS |
| P2 PIT-B 回測 | 歷史各 T as-of 真實可得與合法版本、獨立 OOS/成本檢查 | 事後整理成「當時已可知」 |
| Frozen/Shadow | 另案合規 create-only 真 D1 寫入+readback/獨立驗收 | `selectedCount=0`、`zeroPickDay=true`、或已上線正式交易 |

**當前決策欄位**：`fullMarketOrdinaryShareDenominator=UNKNOWN`、`selectedCount=null`、`zeroPickDay=null`、`frozenD1Written=false`、`formalTradeSignalsAuthorized=false`、`system1FormalCoreChanged=false`。

**接力入口**：DATA 在 #1068 固定本授權與 source 原始證據；BUILD 在 #1132/#1234 承接真實下一 T 的 Scheme C 物理驗收及 versioned PIT-A gate proposal；AUDIT 只認實際原始與截點，不能以 CI 成功取代 PIT。
