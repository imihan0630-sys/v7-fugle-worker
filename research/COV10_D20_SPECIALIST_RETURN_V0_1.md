# COV-10｜D20 信念更新偏誤專科回件 V0.1

- Candidate ID: COV-10
- Domain: D20
- Specialist room: 13｜行為金融與市場心理研究室
- Return artifact path: research/COV10_D20_SPECIALIST_RETURN_V0_1.md
- Evidence cutoff: 2026-10-04 20:17 Asia/Taipei
- Specialist room checkpoint / source artifacts: BEHAVIORAL_FINANCE_CHECKPOINT.md; BEHAVIORAL_FINANCE_RESEARCH.md; research/d20_social_sampling_coverage_contract_v0_1.json; research/d20_social_content_fingerprint_contract_v0_2.json; research/d20_l4_prospective_shadow_prereg_v0_1.json; research/COV10_D20_BELIEF_UPDATE_OBSERVABLE_CONTRACT_V0_1.json
- Current candidate class: TRUE_GAP_CANDIDATE
- Proposed terminal recommendation: ADD_MODULE

Formal Core impact: NONE / LOCKED
System1 / System2 Formal impact: NONE
Canonical curriculum impact from this return alone: NONE

## 1. Exact Knowledge Definition（精確知識定義）

本知識家族研究「可觀測信念如何因新資訊而更新」，不是由價格或成交量反推心理。

三個子機制分開定義：
1. Confirmation bias（確認偏誤）：在已證明接觸新資訊的前提下，對符合既有立場的證據給較高權重，或對衝突證據給較低權重。單純立場不變不足以成立。
2. Belief perseverance（信念固著）：原始信念依據已被正式撤回、修正或推翻，而且已證明接觸該修正後，原信念仍持續。
3. Conservatism（保守更新）：信念確實朝新資訊方向更新，但幅度小於事前凍結、非結果調參的更新基準。價格反應不足本身不能證明保守更新。

最低可觀測序列：
事前立場首次可知時間 → 新資訊首次可知時間 → 新資訊與舊立場的相容／衝突狀態 → 接觸證據 → 事後立場首次可知時間。

UNKNOWN 規則：
- 未證明接觸資訊：確認偏誤／信念固著維持 UNKNOWN。
- 新資訊方向不明：相容性維持 UNKNOWN。
- 無事前立場：整個信念更新序列 UNKNOWN。
- 只有價格／成交量：心理機制 UNKNOWN。
- 無事前定義的更新基準：保守更新幅度 UNKNOWN。

支援契約：
`research/COV10_D20_BELIEF_UPDATE_OBSERVABLE_CONTRACT_V0_1.json`.

## 2. Existing-module Overlap Matrix（既有模組重疊矩陣）

| Existing module（既有模組） | Shared observable（共享可觀測） | Distinct observable（獨特可觀測） | Shared source（共享來源） | Double-count risk（重複風險） | Owner boundary（主責邊界） |
|---|---|---|---|---|---|
| D20-03 過度自信 | 明示信心 | 新資訊後如何修正信念 | 公開預測 | 高 | D20-03 擁有信心校準；新 owner 擁有更新序列 |
| D20-04 錨定／參考點 | 既有狀態黏著 | prior belief × signal congruence × update | 社群／事件憑證 | 高 | D20-04 擁有參考點；新 owner 擁有證據條件化更新 |
| D20-05 代表性／近因 | 信念形成 | 相容／衝突資訊權重差 | 事件／社群／調查 | 高 | D20-05 擁有型態／近因；新 owner 擁有更新不對稱 |
| D20-06 從眾 | 論壇立場 | 同一事件窗、接觸新資訊後的更新 | PTT 社群憑證 | 極高 | D20-06 擁有跨參與者收斂；新 owner 擁有證據條件化更新 |
| D20-07 注意力 | 是否看見資訊 | 看見之後如何更新 | 注意力／事件憑證 | 極高 | 注意力未證明時，新 owner 必須 UNKNOWN |
| D20-08 反應不足／漂移 | 事件時鐘 | 信念修正而非價格漂移 | 官方事件憑證 | 極高 | D20-08 擁有後續價格路徑；新 owner 擁有信念更新機制 |
| D20-11 敘事擴散 | 題材／立場文字 | 證據條件化修正，不是跨文章擴散 | 同一 PTT 來源家族 | 極高 | D20-11 擁有擴散；同一底層憑證不能算第二票 |
| D20-12 行為／結構反證 | 反事實 | 被反證的目標機制 | 上述各來源 | 高 | D20-12 擁有防火牆；新 owner 擁有目標假說 |

重疊結論：
目前沒有既有模組完整擁有「既有信念 → 新資訊相容性 → 已證明接觸 → 更新方向／幅度」這個序列。D20-08 的價格漂移和 D20-07 的注意力都不能單獨取代。

## 3. Why Current Scope Is Insufficient（現有範圍不足原因）

目前 D20 可描述參考點、近因、從眾、注意力、事件後漂移、明示信心與結構反證，但缺少一個主責模組回答：
「同一既有信念，在接觸到支持或反駁的新資訊後，是否呈現系統性的非對稱更新？原始依據被撤回／修正後是否仍固著？若有更新，幅度是否系統性不足？」

這是 operational capability（可執行能力）缺口，不只是多三個心理名詞。

## 4. Taiwan Data Feasibility（台灣資料可行性）

| Source（來源） | Authority（權威性） | Granularity（粒度） | History（歷史） | first-known semantics（首次可知） | Replay status（重播狀態） | Limitation（限制） |
|---|---|---|---|---|---|---|
| PTT Stock 固定排程主要快照 | 公開社群來源 | 文章／回覆×捕捉時點 | 本專案僅承認凍結後前瞻版本 | 固定 :10 實際成功排程的 capturedAt | PROSPECTIVE_REPLAY_FEASIBLE | 摘要窗有限；需相鄰快照連續性 |
| PTT 文章頁版本 | 公開社群來源 | 討論串／回覆版本 | 前瞻捕捉版本 | capturedAt + edit marker | PROSPECTIVE_REPLAY_FEASIBLE | 不宣稱完整歷史 |
| D11／D17／D20-08 官方事件憑證 | 官方／既有 owner | 公司×事件×來源版本 | 依事件家族 | owner-certified knownAt | REPLAY_FEASIBLE_WHEN_VALID | 未解 first-known 仍 UNKNOWN |
| D20-03 明示信心親本 | D20 衍生公開證據 | 預測／文章／日期聚合 | 前瞻 | 凍結分類版本下 capturedAt | PROSPECTIVE_REPLAY_FEASIBLE | 不建立具名心理／能力檔案 |
| 台灣分析師預測／修正資料家族 | 學術／商業資料 | 分析師×公司×預測版本 | 台灣歷史研究已存在 | 視資料產品 | SOURCE_FAMILY_EXISTS / OPEN_PIT_CONTRACT_UNVERIFIED | 完整性、授權與公開 first-known 尚未凍結 |
| 台灣公司盈餘／重大訊息 | 官方 | 公司×事件 | 歷史＋前瞻 | 官方申報／發布時鐘 | EVENT_REPLAY_FEASIBLE | 訊息強度／市場預期可能 UNKNOWN |

至少一條非價格 proxy 已可前瞻重播：
「公開論壇事前立場 + 官方事件／修正 + 已證明接觸 + 事後立場」，最後只保存聚合轉移統計，不建立具名心理檔案。

台灣研究背景亦支持這不是純抽象概念：
- 台灣已有分析師預測修正與不同投資人反應研究。
- 台灣市場已有 conservatism-consistent（與保守更新一致）的盈餘訊息反應研究。
- 台灣分析師目標價／推薦偏差已有可觀測研究。

這些只作外部機制證據，不取代本專案 PIT 契約。

## 5. PIT / Replay Implication（時點一致性／重播影響）

必須凍結：
- `preEventStanceKnownAt`
- `eventKnownAt`
- `eventDirectionRelativeToPriorBelief`
- `exposureEvidence`
- `postEventStanceKnownAt`
- `contentHash`
- source version／correction chain

規則：
- 事件方向分類必須在 outcome join 前凍結。
- 後來修正只能 append-only，不能覆寫舊親本。
- 現在看到舊文章不能倒填歷史 Shadow。
- 沒有證明接觸新資訊時，確認偏誤與信念固著維持 UNKNOWN。

## 6. Decision Role（決策角色）

Primary role：validation（驗證）。
Secondary roles：explanatory（解釋）、context（情境）。

第一階段不得成為獨立方向票。主要用途：
- 驗證 D20-08 的反應不足是否伴隨可觀測信念更新機制；
- 驗證 D20-07 的注意力之後是否仍存在非對稱更新；
- 在 D20-12 反證防火牆中和錨定、近因、共同資訊、慢速擴散做機制辨識。

## 7. Anti-double-count Rule（防重複計算規則）

1. 確認偏誤、信念固著、保守更新屬同一信念更新家族，不得形成三張獨立票。
2. 同一 PTT 社群憑證若已被 D20-06／D20-11 使用，新模組只能建立 child transform；任何決策層同一 primitive 最多貢獻一次。
3. 同一官方事件憑證由 D11／D17／D20-08 保存，新模組只引用。
4. 未注意／未證明接觸不能同時算注意力失敗與確認偏誤。
5. 一般價格反應不足／反轉若沒有信念更新序列，回到 D20-08／D20-09／D03，新模組維持 UNKNOWN。
6. D20-03 的明示信心只能作先驗強度情境，不得再算一次信心訊號。

## 8. Proposed Owner（建議主責）

Proposed domain：D20 行為金融／市場心理。

若總控收件、Dependency Audit、overlap recheck、anti-orphan 與 owner approval 全數通過，建議新增：
**D20-14｜Belief Updating Biases / Confirmation–Perseverance–Conservatism（信念更新偏誤／確認偏誤－信念固著－保守更新）**

依賴：
D20-03、04、05、06、07、08、11、12，以及 D11／D17 官方事件時鐘。

不應放進 D20-08，因價格漂移不是信念更新物件；也不應放進 D20-07，因資訊曝光是必要條件／反證，不是更新機制本體。

## 9. Maturity Starting Point（成熟度起點）

若 owner-approved 新增模組：
**L0 / 0%**。

理由：
本回件證明了獨立知識物件與台灣前瞻資料契約可成立，也有金融研究支持三種機制可分開操作化；但目前沒有 D20-14 歷史 PIT 資料集、沒有正式主要前瞻親本、沒有 OOS／增量價值證據，因此不得繼承 D20-03／06／07／08／12 的 L3 成熟度。

## 10. Terminal Recommendation（終局建議）

**ADD_MODULE**

COV-10 是 true capability gap（真實能力缺口），但只能新增成一個 umbrella owner（傘狀主責），不能拆成三個心理偏誤模組。最強正向證據是：金融研究能把確認偏誤與保守更新實證區分；信念固著也可用反覆預測／修正設計獨立測量；而本專案已具備台灣公開論壇版本鏈與官方事件時鐘，可建立非價格的「既有信念 → 資訊接觸／相容性 → 更新」序列。最強反證是：若資訊接觸、訊息品質或原始信念不可驗證，表面慢更新可以完全由注意力、錨定、慢速資訊擴散、事件修正或其他結構機制解釋。因此新主責必須從 L0 起步，主要做驗證／解釋，不得直接成為策略方向票。

Strongest positive evidence（最強正向證據）：
- 金融市場確認偏誤研究可用 prior belief × new signal 的權重不對稱辨識。
- 分析師研究明確區分 confirmation bias 與 conservative bias。
- 金融預測實驗可獨立辨識 belief-perseverance-style insufficient revision。
- 台灣市場存在分析師修正反應與保守更新一致的研究證據。
- 本專案已有前瞻社群＋官方事件的來源／版本時鐘，可支援非價格重播。

Strongest counterevidence（最強反證）：
- 立場持續可能來自未接觸資訊、訊息模糊、合理私有資訊、慢速擴散、事件後續修正或分析師誘因。
- 價格反應不足本身不能證明保守更新。
- 沒有接觸證據的社群文字不能證明確認偏誤。
- 沒有原始依據撤回／修正，不能乾淨辨識信念固著。

Unresolved blocker（未解阻塞）：
第一批凍結後主要「事件曝光」親本尚未累積；公開且完整的台灣 analyst×firm×forecast-vintage PIT contract 尚未凍結，因此保守更新的高品質數值子線仍 SOURCE_PARTIAL / UNKNOWN。這限制成熟度與效果主張，但不否定 owner gap。

### C. Counterevidence table（反證表）

| Claim（主張） | Countermechanism（反機制） | Falsification test（反證測試） | Current status（目前狀態） |
|---|---|---|---|
| 立場不變 = 確認偏誤 | 沒看到新資訊、資訊模糊 | 必須有 exposure evidence | PROHIBITED_WITHOUT_EXPOSURE |
| 壞消息後仍看多 = 信念固著 | 原信念依據未被撤回 | 必須有明示修正／撤回鏈 | STRICT_GATE |
| 價格漂移 = 保守更新 | 資訊擴散／流動性／套利限制 | 使用信念／預測修正，不以價格單獨辨識 | PRICE_ONLY_REJECTED |
| 更新小 = 非理性 | 訊號弱、雜訊高、私有資訊 | 同事件家族＋資訊品質控制 | CAUSE_UNKNOWN_UNTIL_CONTROLLED |
| 社群立場收斂 = 確認偏誤 | 從眾／共同新聞 | D20-06／D17 控制＋事件暴露更新序列 | OWNER_SEPARATED |
| 高信心＋固執 = 多張行為票 | 同一底層先驗／曝光憑證 | one-family one-vote | DOUBLE_COUNT_FORBIDDEN |

## Evidence references（證據參照）

- Choi & Pritchard, “Mind Is a Terrible Thing to Change: Confirmatory Bias in Financial Markets,” Review of Financial Studies, 2017.
- Cai, Yao & Zhang, “Confirmation Bias in Analysts’ Response to Consensus Forecasts,” Journal of Behavioral Finance, 2024.
- Park et al., “Information Valuation and Confirmation Bias in Virtual Communities: Evidence from Stock Message Boards,” Information Systems Research, 2013.
- Kauko & Palmroos, “The Delphi method in forecasting financial markets—An experimental study,” International Journal of Forecasting, 2014.
- Wu, Wu & Liu, “The conservatism bias in an emerging stock market: Evidence from Taiwan,” Pacific-Basin Finance Journal, 2009.
- Taiwan thesis evidence: investor order-flow reaction to analyst forecast revisions, 2004.

External evidence supports construct separability and research feasibility only. No foreign effect size is transplanted into Taiwan 2026, and nothing here authorizes Formal Core change.
