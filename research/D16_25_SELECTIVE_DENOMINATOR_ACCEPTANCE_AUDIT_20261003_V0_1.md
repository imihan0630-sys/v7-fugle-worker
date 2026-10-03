# D16-25 決策母體／成熟標籤母體分離驗收

Date: 2026-10-03 Asia/Taipei
Status: RESEARCH_ONLY / SYNTHETIC_FALSIFICATION_REPRODUCED / L2_40_UNCHANGED
Formal Core impact: NONE
Base main read and re-read: eb6ca3b655740559a2a9ca9cad051d151f725efb

## 續接範圍

最新 main 的 D16-25 已 L2／40%，D15-19 已核對仍 L0／0%。既有十項機率決策契約與 D16/D15 能力矩陣不重做。此次只處理可重現反證與真實證據驗收缺口；不調政策、不新增機率模型、不提升成熟度。

已核對 Shared Master／Router／Shared Governance、tracker、Research Governance／Worklist／Checkpoint、D16/D18 checkpoint、D16-25 research／contract／evaluator／tests／merge matrix、probabilistic governance、hybrid directive、curriculum audit／retirement ledger／D15 specialist packet、System2 master／checkpoint／strategy與limited-shadow preregistry、immutable parent／publication、C1 export／readiness／repair／cross-midnight closure、outcome tracker／persistence。

## 實質反證：兩種 coverage（覆蓋率）不能混用

既有 `evaluateBinaryPredictionsV01` 先選擇成熟且已知的 binary outcome（雙元結果），再對這個 eligible 子母體計算 selective decision（選擇式決策）。因此 acceptedCoverage 的分母是成熟標籤筆數，stateByPrediction 也只含成熟標籤。這是可接受的「成熟子母體條件指標」，但不能冒充完整決策母體的操作覆蓋率。

可重播純合成案例：四筆同日、同目標預測，凍結淨效用分別 +0.01／-0.01／+0.02／+0.02；政策固定 `netUtility > 0`。前兩筆已成熟，第三筆未成熟，第四筆 UNKNOWN（未知）。

| 觀測狀態 | 完整決策接受比例 | evaluator 的成熟子母體接受比例 |
| --- | --- | --- |
| 起始：2 matured／1 immature／1 unknown | 3/4 = 75% | 1/2 = 50% |
| 第四筆補上已成熟標籤，預測／政策不變 | 3/4 = 75% | 2/3 = 66.7% |
| 所有結果尚未成熟 | 3/4 = 75% | NO_MATURED_OUTCOMES，沒有 selective 報表 |

支持證據：`d16_25_selective_denominator_falsification_20261003_v0_1.mjs` 直接呼叫最新 main 原評估器，assertions（斷言）通過；同名 JSON 保存結果。既有 D16-25 probability tests 也通過。合成測試不屬台股 PIT（時點一致性）證據，不證明 ABSTAIN 有經濟價值。

失效／限制：若消費者已明確使用成熟子母體語意且另保存完整操作 ledger（帳冊），此結果不構成錯誤。若所有標籤都完整成熟，兩者在同一支持集上相同。即使完整成熟，日期／市場狀態相依性仍存在。

真正風險：非隨機缺失可能只留下容易成熟／可觀測的結果，造成 selective risk（選擇式風險）、false acceptance（錯誤接受）及 opportunity capture（機會捕捉）偏誤。現有 realizedValueCoverage 分母仍是成熟標籤母體，不足以代表完整母體成本資料完整度。缺失不等於虧損，也不能以刪除缺失後的好績效通過晉級。

## L3 前的最小驗收補件

1. 操作 ledger：對全部凍結且可重播預測，於 decision time（決策時點）保存 ACCEPT／ABSTAIN／DATA_BLOCKED、原因、policyVersion及prediction receipt。UNKNOWN required input（必要輸入未知）保持 DATA_BLOCKED；不得讀 outcome 決定狀態。
2. 分開保存 N_population、N_prediction_frozen、N_matured、N_label_unknown、N_immature、N_cost_known，以及各決策狀態內相同分母。C1母體中沒有合法預測的列留在 coverage audit（覆蓋稽核），不能偷偷消失。
3. 操作 acceptedCoverage = N_accept / N_frozen；母體 predictionCoverage = N_frozen / N_population。成熟子母體 acceptedCoverage 明確改名／註解；不可把兩者當相同 estimand（估計目標）。
4. Brier／log loss（布萊爾分數／對數損失）僅用成熟可知且有效的標籤；風險／utility（效用）指標另報 accepted label coverage 與 accepted cost coverage。成本／成交／CA（公司行動）未知不補0。
5. 報全部母體與各Regime（市場狀態）／日期／接受狀態的missingness（缺失）差異；作leave-one-date／episode（逐日期／事件段落排除）及相依區塊敏感度。補標籤不得改變凍結決策。
6. 若要missing-outcome bounds（缺失結果界限），另預註冊其假設；不能填假標籤。例：已知 accepted 中 k 個正結果，m 個未知，成功率界限為 k/(n+m) 到 (k+m)/(n+m)，n為已知accepted標籤數。連續報酬若無可信上下界，不宣稱有限效用界限。
7. 目前評估器程式保持原樣；後續隔離 evaluator patch（评估器修補）需上述反例／全未成熟／隨機與非隨機缺失／label-arrival invariance（標籤到達不變性）驗收後再提案。不能把這份規格稱為已修復。

## PIT calibration dataset（時點一致性校準資料集）接線

唯一母體沿用真正 C1 complete-population generation（完整母體世代），以 parentDecisionReceiptId／symbol／generation／strategyStage 綁定預測；保存parent hash與完整keyset（鍵集合）核對。C1 的完整 price>=10 普通股母體並不保證每列可形成同一策略的合法預測，strategy eligibility（策略適用性）與missingness 必須另列。

Calibration training（校準訓練）只能用當時已成熟的前期標籤；base-rate prior（基準率先驗）、方法、window（窗口）、Regime split、uncertainty／ABSTAIN／utility均算同一家族嘗試，失敗版本也保留。資料分為 chronological train → calibration → untouched OOS（依時序訓練→校準→未觸碰樣本外），各outer fold（外層折）冻结模型／政策；D+N重疊窗purge（剔除），依預註冊規則處理embargo（隔離窗），不直接使用隨機CV。Walk-forward（逐步前推）只用當時成熟資料重估；prospective Shadow（前瞻影子）必須真正當時凍結，歷史重建另標示reconstructed OOS（重建樣本外）。

Outcome later join（後續結果關聯）沿用既有System2 outcome identity與D+1/3/5/10/20；D+N是交易日。MFE／MAE（最大有利／不利變動）的觀測終點必須同horizon，不能把全觀測期excursion直接作D5标签。reference-close return（參考收盤報酬）、simulated fill（模擬成交）、actual fill（實際成交）分開；觸發／成交／target-first（先達目標）使用不同條件母體。相同bar（價格棒）無法判斷stop/target順序則AMBIGUOUS（順序不明）。Corporate-action continuity／費稅／滑價／漲跌停可成交性未證明則相關效用UNKNOWN。

## 最新 C1 真實證據狀態

GitHub Actions API重新核對 main C1 workflow 最近五次（目前返回四次），最新run為 [37067696964](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/37067696964)，createdAt 2026-10-02 21:35:03 UTC（台北10/03 05:35:03），completed/failure。API摘要不證明其唯一根因，未取得該run的完整artifact，不重述旧run错误作新run診斷。

最新 main cross-midnight review 的末節已記錄 #318 獲批准、合併與部署成功；檔頭仍是舊draft狀態，不能只讀檔頭。修復成功不會創造10/02當時缺失的C1；文件明确禁止回補成prospective。当前檢視未找到可驗收的 genuine完整母體＋凍結機率＋成熟結果組合，L3仍不成立。下一步是下一個真正完成交易session（交易時段）的receipt驗收，而非推測某日必然成功。

## 方法論正反證增補

- [scikit-learn probability calibration](https://scikit-learn.org/stable/modules/calibration.html)：proper scores（適當評分規則）同時受reliability／resolution／uncertainty影響；較低Brier不能單獨證明校準較好。沿用fixed reliability table（固定可信度表）與OOS比較。
- [Kull et al. 2017 Beta calibration](https://proceedings.mlr.press/v54/kull17a.html)：Platt/logistic（邏輯曲線）映射在偏斜score分布可惡化機率，該映射家族未包含identity（恆等映射）；Beta（貝塔）映射是比較候選，不是台股有效性證明。isotonic（保序）小樣本容易過擬合。保留uncalibrated identity baseline（未校準原始機率基準）；一般raw score仍不可當機率。
- [CalibratedClassifierCV官方文件](https://scikit-learn.org/stable/modules/generated/sklearn.calibration.CalibratedClassifierCV)：提醒少於足夠校準樣本時isotonic不宜。文件約1000筆的經驗提示不可當成我們的最低獨立日期數；同日股票列並非獨立試驗。
- [Park et al. 2020 calibration under covariate shift](https://proceedings.mlr.press/v108/park20b.html)：分布漂移會破壞校準；方法假設與資料支持需額外驗證。台股Regime／label shift（標籤分布漂移）不能僅靠重加權自動解決。

Platt／isotonic／Beta是同一校準比較家族；不能用holdout選最好方法又把同一holdout宣稱獨立驗證。實作方法owner（持有人）依最新H09契約屬D16-19；D16-25要求品質並消費校準後信念，不重複生成第二張校準／Alpha票。本段只是遵從既有producer-consumer（產生者／使用者）契約，不宣告H09專科驗收完成或轉移成熟度。

## D16-25 vs D15-19 能力矩陣增補

| 維度 | D16-25 | D15-19 |
| --- | --- | --- |
| 輸入 | PIT預測、校準品質、不確定性、payoff（報酬分布）、資料角色 | 經驗收的同一receipt＋資金／投組約束 |
| 輸出 | calibrated belief（校準信念）、uncertainty、ACCEPT/ABSTAIN、net utility | fraction（資金比例）、capped/fractional Kelly（上限／分數凱利）、配置 |
| 新增失效 | 成熟標籤子母體被誤讀為操作覆蓋率 | 用有偏子母體校準belief估計edge（優勢），造成過度下注 |
| 驗證 | 完整操作ledger＋成熟條件評分＋日期／Regime穩定性 | log-growth（對數成長）、估計誤差、相關部位、回撤／破產、成本容量 |
| 完成度 | L2／40%；本側能力比較已備妥，經驗證據待補 | 最新tracker L0／0%；K1–K8專科任務待完成 |

結構判斷：`INSUFFICIENT_EVIDENCE_FOR_FINAL_MERGE`（最終合併證據不足）；暫時維持分立介面。支持依賴、部分語意重疊，不支持直接完整合併。A保留分立／B併入D15-16／C擴張D16-25／D拆分移轉，仍等待D15專科與總控anti-orphan（防能力孤兒）審查及owner決定。D15不得繼承D16成熟度。

Kelly input（凱利輸入）仍NOT_READY／UNKNOWN；OOS校準、Regime稳定、uncertainty治理、PIT payoff、費稅滑價、樣本支持、機率誤差敏感度、投組相關性、真正Shadow任何一項未證明，sizingEligible=false。不輸出預設p或資金比例。

## 對System1／System2、候選與交接

System1：C1作唯一母體權威；缺generation不等於zero-pick（零選股），不放寬Formal gate（正式門檻）。System2：全universe（全集）決策状态先冻结，结果后接；策略有效不代表進場／執行就緒，不啟用final selection（最終選擇）。兩者都必須拆開prediction／label／cost completeness（預測／標籤／成本完整度）。

FORMAL_OPTIMIZATION_CANDIDATE：NONE（無）。此反證是驗證可靠性補件，不是選股收益改善證據。

Exact next：先取得真實C1 generation與freezeable合法預測；補完整操作ledger／雙分母報表並驗證標籤到達不變性，再做因果outcome join及first chronological OOS校準。D15-19同步按已存在K1–K8任務獨立研究，但本室不代替10室宣告完成。

寫回分類：隔離Class-A研究包；最新cloudflare workflow對 `research/**`（排除Markdown）會觸發部署，因此含tracker／JSON／MJS的套件只推研究branch／draft PR；未獲production路徑review前不合併main，不改workflow繞過限制。Rollback（回復）：關閉PR即可；Formal Core全程LOCKED。
