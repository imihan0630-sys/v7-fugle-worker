# Curriculum Coverage Specialist Return Readiness Matrix 2026-10-03 V0.1

Status: `RETURN_READINESS_MATRIX_FROZEN`
Scope: 12 個 COV（課綱覆蓋候選）的正式回件契約就緒度。
As-of main: `daf27114a8e53c54e67d93baf3e7e01cdfc35e95`

## 重要語義

這份矩陣衡量的是 **specialist return contract readiness（專科正式回件契約就緒度）**，不是學習成熟度，也不是 COV 終局判定。

狀態只使用：
- `STRONG_PARTIAL`：已有強部分證據，但正式回件欄位仍未完成。
- `PARTIAL`：已有部分證據或主責邊界，但仍缺關鍵契約。
- `MISSING`：正式回件所需內容尚未被接受為可用證據。

任何一格不是 `MISSING`，都不代表可跳過 Intake（收件審查）。

## 10 欄位就緒矩陣

| COV | 領域 | 研究室 | 目前狀態 | 1 定義 | 2 重疊 | 3 不足原因 | 4 台灣資料 | 5 PIT/重播 | 6 決策角色 | 7 防重複 | 8 主責 | 9 成熟度起點 | 10 終局建議 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| COV-01 | D01 | 01｜K線與型態研究室 | PARTIAL_EVIDENCE_RECEIVED | STRONG_PARTIAL | PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | PARTIAL | MISSING | MISSING |
| COV-02 | D05 | 04｜波動與市場微結構研究室 | PARTIAL_EVIDENCE_RECEIVED | PARTIAL | PARTIAL | PARTIAL | MISSING | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING | MISSING |
| COV-03 | D06 | 05｜法人與籌碼研究室 | PENDING_SPECIALIST_RETURN | MISSING | PARTIAL | STRONG_PARTIAL | MISSING | MISSING | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING |
| COV-04 | D07 | 06｜基本面與估值研究室 | PENDING_SPECIALIST_RETURN | MISSING | PARTIAL | STRONG_PARTIAL | MISSING | MISSING | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING |
| COV-05 | D08 | 06｜基本面與估值研究室 | PENDING_SPECIALIST_RETURN | MISSING | PARTIAL | STRONG_PARTIAL | MISSING | MISSING | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING |
| COV-06 | D10 | 07｜產業與供應鏈研究室 | PARTIAL_EVIDENCE_RECEIVED | PARTIAL | STRONG_PARTIAL | PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | PARTIAL | MISSING | MISSING |
| COV-07 | D12 | 09｜衍生品與國際總經研究室 | PARTIAL_EVIDENCE_RECEIVED | PARTIAL | PARTIAL | PARTIAL | MISSING | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING | MISSING |
| COV-08 | D16 | 11｜統計驗證與策略市場狀態研究室 | PARTIAL_EVIDENCE_RECEIVED | STRONG_PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | PARTIAL | MISSING | MISSING |
| COV-09 | D19 | 12｜資產定價與因子研究室 | PARTIAL_EVIDENCE_RECEIVED | STRONG_PARTIAL | PARTIAL | PARTIAL | PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | PARTIAL | MISSING | MISSING |
| COV-10 | D20 | 13｜行為金融與市場心理研究室 | PARTIAL_EVIDENCE_RECEIVED | STRONG_PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | PARTIAL | MISSING | MISSING |
| COV-11 | D21 | 14｜公司治理與內部人研究室 | PARTIAL_EVIDENCE_RECEIVED | PARTIAL | PARTIAL | PARTIAL | STRONG_PARTIAL | PARTIAL | STRONG_PARTIAL | STRONG_PARTIAL | PARTIAL | MISSING | MISSING |
| COV-12 | D22 | 15｜信用市場與資本結構研究室 | PENDING_SPECIALIST_RETURN | MISSING | PARTIAL | STRONG_PARTIAL | MISSING | MISSING | PARTIAL | PARTIAL | PARTIAL | MISSING | MISSING |

## 精確下一缺口

- **COV-01 / D01**：明確比較 D01-05／D01-07 主責，決定 umbrella（傘型）型態家族是擴充既有範圍或獨立主責，並提交唯一終局建議。
- **COV-02 / D05**：驗證台灣收盤集合競價 imbalance（不平衡量）可觀測性、歷史可重播性與 D05-06 主責吸收關係。
- **COV-03 / D06**：找到直接識別散戶／自然人活動的台灣資料欄位與 PIT（時點一致性）來源契約；禁止用總量減法人殘差冒充散戶意圖。
- **COV-04 / D07**：凍結 payout ratio（支付率）、dividend coverage（股利覆蓋率）、FCF coverage（自由現金流覆蓋率）、retention（保留盈餘）與 sustainability（永續性）及其 PIT 時鐘。
- **COV-05 / D08**：正式凍結 P/S（股價營收比）或 EV/Sales（企業價值營收比）的公式、企業價值分子、營收分母、財報 vintage（版本）與 owner（主責）。
- **COV-06 / D10**：定義 centrality（中心性）、articulation/single-point failure（關節點／單點失效）、alternate-path redundancy（替代路徑冗餘）與 incomplete graph UNKNOWN（不完整圖未知）規則。
- **COV-07 / D12**：證明 TAIFEX（臺灣期貨交易所）合約層級歷史價格／未平倉／成交量／到期資料可做 PIT 重播，並釐清 basis（基差）／OI（未平倉量）／expiry（到期）重疊。
- **COV-08 / D16**：直接比較 D16-06；凍結何時 cluster-robust inference（叢集穩健推論）已足夠、何時需要 block bootstrap（區塊重抽樣），再給唯一終局建議。
- **COV-09 / D19**：比較 D19-01／D19-10；區分 benchmark-model construction（基準模型建構）與一般因子研究，並決定是否需台灣重建基準投組。
- **COV-10 / D20**：把 confirmation bias（確認偏誤）、belief perseverance（信念固著）、conservatism（保守偏誤）與既有 D20 主責逐一比對，凍結 observable proxy（可觀測代理）與 UNKNOWN。
- **COV-11 / D21**：定義 shareholder rights（股東權利）、stewardship（盡職治理）、activism（股東行動）與 voting（表決）的同一知識家族邊界，並驗證台灣歷史 first-known（首次可知時間）。
- **COV-12 / D22**：凍結 seniority（順位）、collateral（擔保）、guarantee（保證）、structural subordination（結構性次順位）與 recovery waterfall（回收瀑布），並證明至少一條台灣 PIT 文件路徑。

## 當前總結

- `PARTIAL_EVIDENCE_RECEIVED`：8 / 12。
- `PENDING_SPECIALIST_RETURN`：4 / 12。
- `RETURN_ACCEPTED_FOR_INTAKE`：0 / 12。
- 正式回件檔存在：0 / 12。
- Canonical curriculum（正式課綱）：22 領域／354 模組。
- Weighted maturity（加權成熟度）：38.2%。

## 治理防火牆

1. 這張矩陣不會自行把任何候選升成 `RETURN_ACCEPTED_FOR_INTAKE`。
2. 第 9 欄「成熟度起點」在沒有正式結構建議前保持 `MISSING`，避免自動繼承成熟度。
3. 第 10 欄必須由專科正式回件提供唯一終局建議。
4. 任何結構性建議仍須經 Dependency Audit（依賴審查）、Overlap Recheck（重疊複核）、Anti-Orphan（防孤兒化）與 Owner Approval（主責核准）。
5. Formal Core（正式核心）維持 `LOCKED`。
