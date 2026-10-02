# D01 DL-009 — PATTERN-RG2 巢狀壓力語意凍結 V0.1

Updated: 2026-10-02 Asia/Taipei  
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / RG2_SPEC_FROZEN / FORMAL_CORE_LOCKED

## 1. 目的

PATTERN-RG2 是既有四個 Pattern x Regime（型態×市場狀態）假說之一：

RG2 = nested resistance（巢狀壓力）。

本輪不新增 R09、不新增新型態家族，也不調整 Formal（正式）阻力／RR（報酬風險比）規則。

唯一目的：
在任何 outcome（結果）資料開啟前，凍結 local boundary（局部邊界）與 major parent zone（大型父層區域）的 identity（身分）、distance（距離）、lifecycle（生命週期）與 redundancy comparators（冗餘對照）。

## 2. 繼承既有尺度，不重新調參

沿用已凍結的 outcome-free（不看結果）尺度：

- MICRO: lagged-ATR（落後 ATR）Directional-Change k=1；
- BASE: k=2 / 120 eligible symbol sessions（有效個股交易日）；
- MAJOR: k=3 / 260 eligible symbol sessions；
- comparator（對照）: simple 260-session high（單純 260 交易日高點）；
- Formal comparator: priorHigh20；
- redundancy controls: priorHigh60 / MA60 / ret20 / overheat / R01。

不得因 RG2 結果改 k、120、260。

## 3. Local boundary（局部邊界）身分

Primary local boundary（主要局部邊界）：
使用當時已確認 Pattern object（型態物件）的 immutable trigger boundary（不可變觸發邊界），例如：
- W neckline（W 底頸線）；
- Cup rim（杯緣）；
- Platform upper zone（平台上緣區）；
- VCP trigger boundary（VCP 觸發邊界）。

必存：
- localBoundaryId；
- localBoundaryVersion；
- localLower；
- localUpper；
- localConfirmedAt；
- localFamily；
- localSemanticSpaceId；
- localFirstBreakAt。

若 Pattern boundary（型態邊界）不存在：
只能使用 comparator（對照）欄位，例如 priorHigh20；
不得把 priorHigh20 冒充 true Pattern neckline（真正型態頸線）。

## 4. Major parent zone（大型父層區域）身分

Primary parent（主要父層）：
MAJOR k=3 / 260 eligible symbol sessions 的 confirmed structural zone（已確認結構區）。

必存：
- parentZoneId；
- parentZoneVersion；
- parentLower；
- parentUpper；
- parentCenter；
- parentConfirmedAt；
- parentScale = MAJOR；
- parentSemanticSpaceId；
- parentSourceWindowStart / End；
- parentZoneAgeEligibleSessions。

parentConfirmedAt > asOf：
FUTURE_PARENT_BLOCKED。

semantic space（價格語意空間）不同：
SEMANTIC_SPACE_CONFLICT。

同 zoneId + same zoneVersion 但座標改變：
PROVENANCE_CONFLICT。

## 5. RG2 relation geometry（關係幾何）

不產生 resistanceScore（壓力分數）。

保存連續 descriptor（描述子）：

availableAirToParentLowerPct =
(parentLower - localUpper) / localUpper

distanceLocalToParentCenterPct =
(parentCenter - localUpper) / localUpper

若 ATR（平均真實波幅）在同一 asOf（時點）且語意有效，可另存：

availableAirToParentLowerATR =
(parentLower - localUpper) / ATR_asOf

所有值：
- 可正；
- 可零；
- 可負；
- 不 clip（截斷）；
- 不預設方向 sign（正負號含義）。

負值表示 local boundary 已與 parent zone 重疊／超過，不等於自動 bullish（多頭）或 bearish（空頭）。

## 6. Relation states（關係狀態）

不新增任意「接近=2%」閾值。

幾何狀態：
- NO_CONFIRMED_PARENT;
- LOCAL_BELOW_PARENT_POSITIVE_AIR;
- LOCAL_BOUNDARY_OVERLAPS_PARENT_ZONE;
- LOCAL_BOUNDARY_ABOVE_PARENT_ZONE;
- UNKNOWN.

事件／生命週期狀態另外引用既有 major-zone lifecycle：
- BELOW_MAJOR_ZONE;
- APPROACH_MAJOR_ZONE;
- FIRST_BREAK_ABOVE_MAJOR_ZONE;
- HOLDING_ABOVE_MAJOR_ZONE;
- REENTERED_MAJOR_ZONE;
- FAILED_MAJOR_ZONE_BREAK.

RG2 compound state（複合狀態）可描述：
- LOCAL_BREAK_STILL_BELOW_PARENT;
- LOCAL_BREAK_ENTERED_PARENT_ZONE;
- LOCAL_BREAK_AND_PARENT_FIRST_BREAK;
- LOCAL_BREAK_PARENT_HOLDING_ABOVE;
- LOCAL_BREAK_PARENT_REENTERED;
- LOCAL_BREAK_PARENT_FAILED;
- UNKNOWN.

這些是描述，不是 BUY / SELL（買／賣）訊號。

## 7. Local breakout vs major parent 的因果時間

在 asOf（當時時點）：

parentConfirmedAt <= asOf
localConfirmedAt <= asOf
localFirstBreakAt <= asOf（若聲稱已突破）

三者皆必須滿足。

未來才形成的 MAJOR zone（大型區域）不可回填到過去，說當時「上方已有壓力」。

這是 RG2 最重要的 PIT（時點正確性）防火牆之一。

## 8. 不把大型壓力當 hard veto（硬否決）

正面機制假說：
局部突破若緊接一個穩定大型供給／心理區，可能：
- 降低短期 availableAir（可用上行空間）；
- 增加 reentry / failed-break risk（跌回／突破失敗風險）；
- 降低近端 MFE（最大有利變動）。

反面機制：
真正突破 salient high（顯著高點）後可能切換到 attention / underreaction / momentum（注意力／反應不足／動能）狀態。

2025 Taiwan historical-high evidence：
Lee & Chou, Pacific-Basin Finance Journal 93, 102853,
DOI 10.1016/j.pacfin.2025.102853。

因此：
small availableAir（小可用空間） != automatic reject（自動剔除）；
parent first break（父區首次突破） != bearish（看空）；
holding above parent（站穩父區）與 failed parent break（父區突破失敗）必須分開。

## 9. Round-number（整數價位）混淆

台灣市場存在 order-price clustering（委託價格群聚）。

Lien, Hung & Hung (2019), Journal of Empirical Finance,
DOI 10.1016/j.jempfin.2019.03.005，
顯示 TWSE（台灣證券交易所）價格／數量群聚普遍存在，且與波動、投資人類型與市場競爭相關。

所以若 MAJOR zone（大型區域）靠近整數／顯著 tick（升降單位）：
不能把所有效果歸因於 Pattern structural memory（型態結構記憶）。

Future RG2 outcome control（未來 RG2 結果控制）至少納入 frozen round-price proximity（凍結整數價位距離）診斷。

不新增 round-number score（整數價位分數）。

## 10. Support / resistance（支撐／壓力）反證

Zapranis & Tsinaslanidis (2012), Applied Financial Economics,
DOI 10.1080/09603107.2012.663469：
rule-based horizontal support / resistance（規則式水平支撐壓力）在其美國樣本可協助辨識部分 trend interruption（趨勢中斷），但相對 buy-and-hold（買進持有）沒有產生超額報酬。

D01 解讀：
structural resistance（結構壓力）可有 risk/context value（風險／脈絡價值），但不能預設 selection alpha（選股超額報酬）。

## 11. Redundancy ladder（冗餘階梯）

RG2 未來不能只跟「無控制」比較。

依序比較：

R0 — priorHigh20 only  
R1 — priorHigh20 + priorHigh60  
R2 — R1 + MA60 + ret20 / ret60 + overheat  
R3 — R2 + simple 260-session-high distance  
R4 — R3 + BASE / MAJOR structural-zone distance  
R5 — R4 + zone age / repeated-test progression / lifecycle  
R6 — R5 + round-price proximity + D02 acceptance + regime + liquidity

真正值得保留的 Pattern topology（型態拓樸）是：
R4/R5/R6 相對較簡單 comparator（對照）仍有 stable residual value（穩定殘差價值）。

如果 MAJOR zone（大型區域）效果在加入 simple 260-high（單純 260 日高點）後消失：
=> topology is REDUNDANT（拓樸冗餘）。

如果只在 round-price（整數價位）附近存在：
=> psychological / microstructure confounding（心理／微結構混淆）。

如果 k=2 vs k=3 鄰近尺度方向任意翻轉且無機制：
=> scale fragility（尺度脆弱）。

## 12. Primary estimands（主要估計量）

未來 outcome（結果）開放後，RG2 優先研究：

1. D5 / D10 MFE（最大有利變動）；
2. D5 / D10 MAE（最大不利變動）；
3. structural reentry / failure chronology（結構跌回／失敗時間）；
4. no-follow-through continuous descriptors（無延續連續描述）；
5. opportunity cost（機會成本）：被「壓力」判定風險較高但後續強勢延續的案例。

不以「勝率」單一指標決定。

## 13. Sample identity（樣本身分）

同一 parentZoneId + version
與同一 localBoundaryId + version
的多日快照屬同一 structural relation episode（結構關係事件）。

每日 snapshot（快照）可以看 lifecycle evolution（生命週期演變），不能當多個獨立樣本。

## 14. Governance（治理）

No threshold tuning（不調門檻）。
No outcome inspection（不看結果）。
No hard resistance veto（不硬否決）。
No R09。
No Formal RR / target / selection change（不改正式報酬風險比／目標／選股）。

PATTERN-RG2 status:
SPEC_FROZEN / OUTCOME_CLOSED / ALPHA_UNKNOWN.

FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 15. Exact next continuation

1. 建立 machine-readable RG2 contract（機器可讀 RG2 契約）。
2. 將 RG2 relation fields（關係欄位）映射到既有 major-zone lifecycle / round-price control / Target-RR lane，避免重複定義。
3. 製作 outcome-blind adversarial fixtures（不看結果的對抗案例）：
   - local break far below parent;
   - local boundary overlaps parent;
   - local break enters parent;
   - parent first break;
   - parent holds;
   - parent fails/reenters;
   - future parent not yet confirmed;
   - same-version coordinate mutation;
   - semantic-space conflict.
4. 不執行 outcome join，直到 prospective parent/run coverage COMPLETE。
5. Formal Core unchanged.
