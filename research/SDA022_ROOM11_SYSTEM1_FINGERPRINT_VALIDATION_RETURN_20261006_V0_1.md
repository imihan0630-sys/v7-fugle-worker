# SDA-022｜Room11 System1 政策指紋驗證回傳 V0.1

更新：2026-10-06 Asia/Taipei
狀態：SYSTEM1_FINGERPRINT_PASS_5_OF_5 / WHOLE_TICKET_PARTIAL_PASS / OUTCOMES_CLOSED
驗證者：11｜統計驗證與策略市場狀態研究室 / D16
閉合權限：00
Formal Core impact：NONE

## 1. 權威基準

正式驗收基準：
`shared-knowledge/sda022_acceptance_oracle_v0_1.json`

本回合只驗：
`S22-T01~T05`.

實體 System1 收據：
`shared-knowledge/system1_policy_fingerprint_receipt_v0_1.json`

合併提交：
`862b8c903e81e0945ba030b396b8a7d661f91f1e`

## 2. S22-T01 PASS

要求：
System1 指紋必須包含 system / policy / version / decision clock / source artifact digests。

驗證：
- `systemId=SYSTEM1`;
- `policyId=V8_FORMAL_SELECTION`;
- `policyVersion=V8_FORMAL_SELECTION_BASELINE_2026-10-06`;
- `effectiveAt` 存在；
- `decisionClockRole=AFTER_MARKET_SELECTION_WITH_FORMAL_15M_ENTRY_CONFIRMATION`;
- 三個 sourceArtifacts 全部帶 path + contentSha。

獨立讀回三個來源檔：
- `shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`;
- `shared-knowledge/SYSTEM1_SYSTEM2_POLICY_FINGERPRINT_BASELINE_20261006_V0_1.md`;
- `scripts/apply_v7_5_30.py`.

三個 main blob SHA 與 receipt contentSha：
`3 / 3 MATCH`.

Disposition：
`PASS_SYSTEM1_POLICY_SOURCE_BINDING`.

## 3. S22-T02 PASS

要求：
System1 必須保存 universe / gates / ranking / capacity / entry / lifecycle。

驗證存在：
- candidateUniverseMode + candidateUniverseSourceRefs；
- gateFamilyIds；
- required/supportive/context evidence families；
- informationRoots；
- rankingPolicy；
- capacityPolicy；
- entryConfirmationPolicy；
- lifecyclePolicy；
- unknownSemantics。

Disposition：
`PASS_SYSTEM1_POLICY_SEMANTIC_OBSERVABILITY`.

## 4. S22-T03 PASS

要求：
目前架構下，System1 必須明確記錄不需要 System2 candidate / rank output。

收據：
- `requiresOtherSystemCandidateOutput=false`;
- `requiresOtherSystemRankOutput=false`;
- `lifecyclePolicy.requiresSystem2State=false`.

Disposition：
`PASS_NO_REQUIRED_SYSTEM2_DECISION_DEPENDENCY`.

## 5. S22-T04 PASS

要求：
ranking identity 必須綁定目前有效 Formal comparator。

收據排序：
1. priorityScore
2. rewardPerRisk
3. marketConsensusScore
4. setupQuality
5. sectorFlow
6. relativeStrength

獨立讀回目前 `scripts/apply_v7_5_30.py`：
- priorityScore -> rewardPerRisk chain present；
- marketConsensusScore tie-break present；
- setupQuality -> sectorFlow -> relativeStrength tail chain present。

且 script blob SHA 與 receipt 綁定 SHA 完全一致。

Disposition：
`PASS_EFFECTIVE_FORMAL_RANKING_BINDING`.

## 6. S22-T05 PASS

要求：
產生 fingerprint 不可改變 Formal behavior。

PR #660 merge file set 僅：
- `.github/workflows/v7-regression.yml`;
- `shared-knowledge/system1_policy_fingerprint_receipt_v0_1.json`;
- `tests/test_sda022_system1_policy_fingerprint_v0_1.mjs`.

沒有 Formal selector / ranking / capital / entry / signal / order production source change。

Receipt：
`formalMutation=false`.

注意：
GitHub connector 本次沒有回傳 merge commit 的 workflow run / combined status；因此不宣稱該 merge commit 有獨立可見 CI run 證據。
但 T05 的 code-diff scope + source SHA readback 足以確認此次合併沒有修改 Formal behavior。

Disposition：
`PASS_OBSERVABILITY_ONLY_NO_FORMAL_MUTATION`.

## 7. 本組結果

`S22-T01 = PASS`
`S22-T02 = PASS`
`S22-T03 = PASS`
`S22-T04 = PASS`
`S22-T05 = PASS`

System1 fingerprint family：
`5 / 5 PASS`.

Whole SDA-022：
仍為 `PARTIAL_PASS`.

已知另外完成：
`S22-T25~T28 = 4 / 4 PASS`.

尚不得宣稱：
- System2 physical independence；
- cross-system independent confirmation；
- diversification；
- predictive incrementality；
- SDA-022 CLOSED。

下一個權威續接：
1. 實際 System2 per-strategy fingerprint receipts -> 驗 `S22-T06~T10`;
2. physical NC-T01 receipt -> 驗 `S22-T11~T16`;
3. 上述完成後才開始 prospective `S22-T17~T24`;
4. outcomes 維持 CLOSED；
5. Room00 唯一閉合。

No maturity change.
Formal Core LOCKED.
