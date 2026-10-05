# SDA-017｜Episode Dependence / Horizon Attribution Validation Addendum V0.1

更新：2026-10-05 Asia/Taipei  
狀態：RESEARCH_ONLY / VALIDATION_OWNER_ADDENDUM_FROZEN / NO_MATURITY_CHANGE  
主責研究室：11｜統計驗證與策略市場狀態研究室  
基礎契約：`research/SDA017_REGIME_SUPPORT_EPISODE_VALIDATION_CONTRACT_20261005_V0_1.md`  
正式核心影響：NONE

## 1. 第二輪盲點

既有 SDA-017 V0.1 已正確要求：
- immutable episode lineage；
- UNKNOWN gap split；
- vector-version boundary split；
- episode N / effective date N；
- prospective policy evidence。

第二輪驗證再凍結兩個容易被誤讀的點：

1. **episode 是結構性支援單位，不等於統計獨立樣本。**
2. **decision-time Regime 與 outcome horizon 後續是否跨 Regime transition，必須分清 estimand，不能用未來狀態篩選贏家。**

## 2. Episode identity must be prospective

當日 `regimeStateReceipt` 可使用：
- current official session；
- prior official-session receipt；
- current/prior frozen state；
- current/prior vector/source/universe version；
建立或延續 `episodeId`。

當日 receipt 不得預先知道：
- episode 最終結束日；
- episode 最終長度；
- 未來 transition；
- 未來 state persistence。

### Episode continuation

只有下列全部成立才可延續原 episode：
- prior receipt 是相鄰 official session；
- prior/current discrete state 均 KNOWN；
- state value 相同；
- regimeVectorVersion 相同；
- source/universe semantic lineage相容；
- 中間沒有 UNKNOWN / missing / clock-invalid gap。

否則建立新 episode。

`episodeOrdinal` 可在當日遞增。
最終 episode end / final length 只能由 later summary append，不得回寫改變原 decision receipt。

## 3. Structural episode N != inferential independent N

必須分開報：

- `structuralEpisodeN`;
- `maturedOutcomeEpisodeN`;
- `completedEpisodeN`;
- `activeEpisodeN`;
- `effectiveIndependentDateN`；
- `transitionN`;
- `interEpisodeGapSessions`;
- `episodeOccupancy`;
- `maxEpisodeDateShare`.

禁止：
- 用 episode N 直接當 degrees of freedom；
- 三個彼此緊鄰 episode 就自動稱三次獨立重現；
- 一個長 episode 的很多 dates 冒充多次 regime evidence。

D16-06 的 dependence-aware inference 仍是統計不確定性的 owner。
Episode count 只回答「是否跨多個狀態段落重現」，不替代 dependence correction。

## 4. Freeze the primary policy estimand

SDA-017 的 primary prospective policy estimand 凍結為：

`DECISION_STATE_CONDITIONAL`

意思：
- policy 只使用 decision time 已知的 Regime state；
- outcome 依 frozen D+N horizon 照常成熟；
- 後續 Regime 是否改變，不影響該 decision 當時是否屬於此 state；
- outcome 跨 Regime transition 仍保留；
- 必須額外標記 transition crossing，但不得因後續轉態不利就刪除。

這才是 decision-time 可執行問題。

## 5. Future-persistence conditioning is a different estimand

以下問題不是 primary decision-time policy estimand：

> 「只有當這個 Regime 未來持續滿 N 天時，策略是否有效？」

它使用未來 state persistence 作條件，屬：

`PERSISTENCE_CONDITIONAL_EX_POST`

規則：
- 可作 ex-post descriptive/falsification analysis；
- 不得冒充 decision-time policy evidence；
- 若在看 outcome 後才新增，必須建立新 Regime hypothesis family；
- 原 holdout 依 SDA-016 進入 development-consumed；
- 若未來要讓 persistence 可交易，必須另建 decision-time persistence forecast，不可直接使用 realized future persistence。

## 6. Horizon transition crossing

對每個 decision × horizon 至少報：

- `outcomeCrossesRegimeTransition`;
- `transitionCountWithinOutcomeHorizon`;
- `futureRegimePathKnownFraction`;
- `futureRegimePathUnknown`;
- `decisionEpisodeId`;
- `outcomeMaturedAt`.

### Primary decision-state analysis

即使 `outcomeCrossesRegimeTransition=true`：
- row 仍保留；
- 不可因 transition 後績效差而排除；
- 可做 sensitivity，不能改 primary inclusion。

### Episode-persistence analysis

若要求「horizon 全程 stay in same state」：
- 這是新 estimand；
- 必須事前註冊；
- 不能取代 decision-state primary；
- 不得用它把跨 transition 的失敗樣本刪掉。

## 7. UNKNOWN inside future horizon

Decision state 在 t 已 KNOWN，但 t+1...t+N 的 Regime path 後來出現 UNKNOWN：

對 `DECISION_STATE_CONDITIONAL`：
- 不因 future Regime UNKNOWN 自動刪除 decision；
- 只要 outcome price/continuity target 本身仍可合法成熟，primary outcome 可保留；
- regime-path completeness 另報。

對 persistence/transition-specific estimand：
- path UNKNOWN => 해당 path analysis UNKNOWN / INELIGIBLE；
- 不得補成 state unchanged。

## 8. Episode support and horizon overlap

多個 decisions 的 D+N outcomes 可跨 episode 並共享 primitive market sessions。

因此 SDA-017 的 support engine 必須接 SDA-016 outcome-information-footprint guard：

- regime episode diversity ≠ fresh holdout diversity；
- episode N 達標但 outcome footprints 高度重疊，仍不可自動 promotion；
- walk-forward / holdout boundary 必須依 horizon purge；
- transition event附近 decisions 可能共享 outcome sessions，需 D16 dependence correction。

## 9. Expanded support states

Machine layer至少區分：

### `STRUCTURAL_SUPPORT_INSUFFICIENT`
episode / date / coverage 未達 SDA-017 V0.1 floors。

### `STRUCTURAL_SUPPORT_READY_STATISTICAL_DEPENDENCE_PENDING`
episode diversity達標，但 D16 effective-dependence / footprint-overlap 尚未通過。

### `PRIMARY_VALIDATION_ELIGIBLE`
只有當：
- V0.1 support floors通過；
- D16-06 dependence-aware validation可執行；
- SDA-016 consumption/footprint state合格；
- primary estimand 未被 future persistence conditioning污染；
才可使用。

這仍不是「策略有效」。

## 10. Adversarial acceptance extensions

新增 SDA-017 第二輪驗收：

16. 三個 episode 彼此只隔一個 session：structuralEpisodeN=3，但不得自動宣稱三個獨立重現。
17. decision state=KNOWN，D+5 中途轉態：primary decision-state row 必須保留並標 transition crossing。
18. 只保留 D+5 全程未轉態 rows 後績效變好：若未事前註冊 persistence estimand，reject。
19. t 時 KNOWN、t+2 Regime UNKNOWN、D+5 price outcome仍合法：decision-state primary 不得因 future Regime UNKNOWN 被刪除。
20. episodeId 在同 state + official-session gap 後延續：reject。
21. episodeId 在 vector version change 後延續：reject。
22. current receipt 包含 finalEpisodeLength / futureEndDate：look-ahead，reject。
23. active episode 被當 completed independent episode：support report mismatch。
24. episodeN 達 3，但全部成熟 outcomes 只來自 1 個 episode：不得達 primary eligibility。
25. episodeN 達標但 outcome information footprints 與已消費 holdout重疊：不得 promotion。
26. future persistence 被直接拿來作 live policy action：reject；需另有 decision-time forecast contract。
27. transition-specific結果比 decision-state primary漂亮而被改成 primary：new family + SDA-016 consumption。
28. state threshold在看 outcome後微調造成 episode重切：new family，原 holdout development-consumed。
29. one episode dominates >50% supported dates：維持 V0.1 dominance warning；不得靠 raw episode count掩蓋。
30. episode support PASS 但 D16 dependence state UNKNOWN：不得標 primary validation eligible。

## 11. Engineering handoff

System 2 episode/support observer 應新增：
- prospective episode continuation only；
- no future end/length in decision receipt；
- decision-state primary estimand identity；
- horizon transition-crossing diagnostics；
- support-state separation；
- SDA-016 footprint/consumption reference。

不需要、也不得趁此新增：
- live Regime weight；
- ranking bonus；
- Top6 改動；
- capital allocation；
- push/notification action。

## 12. Validation conclusion

SDA-017 的 closure 不能只驗：
「episodeId 有沒有正確切段」。

還必須驗：
1. episodeId 沒偷看未來；
2. episode count 沒被當獨立樣本數；
3. future persistence 沒被拿來篩選 primary policy outcome；
4. overlapping horizon / holdout consumption 沒被忽略；
5. statistical dependence 仍回到 D16-06。

FORMAL_OPTIMIZATION_CANDIDATE: NONE  
Formal Core: LOCKED

## 13. Exact next

System 2 補 episode/support observer 後，11 室以 V0.1 原 15 項 + 本 addendum 16–30 項執行第二輪 adversarial validation。
未通過 episode dependence / horizon attribution，不得送 00 作 SDA-017 closure。
