# SDA-016｜System 1 現行 Holdout Guard 對抗式語意驗證 V0.1

更新：2026-10-05 Asia/Taipei
狀態：RESEARCH_ONLY / PARTIAL_PASS / ENGINEERING_VALIDATION_NOT_CLOSURE
驗證主責：11｜統計驗證與策略市場狀態研究室
依據契約：`research/SDA016_HOLDOUT_CONSUMPTION_VALIDATION_CONTRACT_20261005_V0_1.md`
被驗證實作：`research/experiment_holdout_guard_v0_1.mjs`
工程收據：`research/SYSTEM1_SDA_SHADOW_REMEDIATION_CHECKPOINT_20261005.md`
正式核心影響：NONE

## 1. 結論

`PARTIAL_PASS / SYSTEM1_CLASS_A_GUARD_VALIDATED_WITH_REMAINING_DELTAS`

目前 System 1 Class-A offline guard 已正確建立第一層 canonical anti-reuse firewall，但尚不足以關閉 SDA-016。

## 2. 已驗證 PASS

### A. Immutable experiment version
同一 `experimentId + experimentVersion` 的 spec 改動會被拒絕。

PASS。

### B. Target / benchmark mutation rejection
`targetHash` / `benchmarkHash` 由 definition replay 驗證；同版本靜默 mutation 被拒絕。

PASS。

### C. Repeated inspection consumption
第一次 INSPECT 記錄 use count。
第二次 inspection 將 shared holdout 標為 development-consumed。

PASS。

### D. Cosmetic holdout rename cannot reset exact same dataset
同一 `holdoutDatasetHash` 即使更換 `holdoutId`，也不能恢復 OOS eligibility。

PASS。

### E. Outcome lock
同一 experiment 的 outcome 只能 lock 一次；需要先有 inspection；POSITIVE / NEGATIVE / NULL / FAILED / INCONCLUSIVE 都可以保留。

PASS。

### F. Negative-result preservation
negative / failed outcome 被 ledger 保存，familyTrials 亦保留 family attempt count。

PASS for append-only ledger scope。

### G. Append-only integrity
hash-linked previous head、sequence、monotonic clock、expected-head compare-and-swap 能拒絕：
- truncation；
- mutation；
- reordering；
- stale append。

PASS within the stated local-ledger trust model。

### H. Fixed-inspection default
目前只允許 `SINGLE_INSPECTION_THEN_DEVELOPMENT`，未經 D16 契約的 sequential exception 直接拒絕。

PASS as conservative default。

### I. Protected outputs
工程收據明確記錄：
- runtime / Formal ranking / Top6 / capital / plans / signals / 15m / push / orders unchanged；
- provider-call delta = 0；
- Production/D1 resource delta = 0；
- System 2 unchanged。

PASS for Class-A isolation。

## 3. 尚未通過／未覆蓋

### G1. Partial-overlap holdout detection — BLOCKER

目前 dedup 主要靠 exact `holdoutDatasetHash`。

若：
- H1 = 日期 A,B,C,D；
- H2 = 日期 C,D,E,F；

因內容 digest 不同，現行 guard 無法自動知道 C,D 已經被消費。

需要新增：
- canonical independent-date-set hash / explicit date ids；
- overlap count；
- overlap ratio；
- prior consumed date lineage；
- effective new independent-date count。

這是 SDA-016 的重要剩餘缺口。

### G2. Cross-System canonical ledger — BLOCKER

目前是 System 1 local offline ledger。

若 System 2 另外建立第二套 logical ledger，就可能：
- System 1 看過 H1；
- System 2 不知道；
- System 2 又把同一 physical dates 當 untouched。

因此 System 2 必須 reuse canonical contract / externally authoritative head or shared immutable consumption authority。

### G3. Generic outcome-lock binding completeness — PARTIAL

現行 `outcomeDigest` 能防 outcome lock 後被換結果，但 generic schema 尚未明確機器化綁定：
- population/universe semantics；
- exact independent decision-date set；
- primary metric hash；
- cost semantics；
- corporate-action / continuity semantics；
- missing/UNKNOWN rule；
- maturity cutoff。

現階段可由 dataset digest 間接包含，但不是機器可稽核欄位。

### G4. Sequential-valid policy — INTENTIONALLY PENDING

現行 guard 正確地 fail closed。

若未來要允許 multiple looks，需新 contract version 明確指定：
- alpha-spending / always-valid / e-value 等 sequential framework；
- information times；
- family freeze；
- look ledger。

在此之前不得放寬。

### G5. Out-of-band peeking — LIMITATION

目前 CLI ledger 無法知道研究者是否在 ledger 外手動看 outcome。

因此自動化 consumer 必須：
- outcome access 經由 canonical gate；
- 或至少把 promotion-grade evidence 限定為可稽核管線產生。

這是 operational governance，不是單靠 hash ledger 可解決。

### G6. External head trust — LIMITATION

本地 append-only ledger 依賴 externally retained trusted head。
控制 ledger 與 trusted head 的同一惡意 writer 仍可重寫歷史。

後續 shared authority 可考慮：
- repository-committed receipt head；
- immutable object/D1 append-only head；
- signed publication checkpoint；
但任何 Production/shared-schema change 需照 Class B governance。

## 4. 對抗測試映射

依 11 室契約 12 項：

1. same holdout replay not new evidence — PASS。
2. same-version target mutation — PASS。
3. same-version benchmark mutation — PASS。
4. post-result new version on same exact dataset => development-consumed — PASS。
5. cosmetic rename same dataset — PASS。
6. partial date overlap — NOT IMPLEMENTED。
7. fixed-N interim peeking — conservative policy rejects extra inspection semantics，但 out-of-band peek 無法偵測；PARTIAL。
8. preregistered sequential method — NOT IMPLEMENTED BY DESIGN。
9. negative variant preservation — PASS in ledger；external registry deletion cross-check 尚未 generic 化。
10. cross-System duplicate logical id — NOT IMPLEMENTED。
11. D18 outcome-driven regime split linked to holdout consumption — research contract frozen；machine cross-link 尚未實作。
12. outcome arrival cannot mutate prediction/preregistration — experiment spec immutable PASS；prediction-receipt domain需各 consumer 另驗證。

## 5. Validation decision

SDA-016 不可關票。

目前可將 System 1 子項判定：
`CLASS_A_BASE_GUARD_VALIDATED_PARTIAL_PASS`

剩餘正式 delta：
1. partial-overlap date lineage；
2. System 1/System 2 shared consumption authority；
3. machine-visible complete outcome-lock identity；
4. future sequential policy only via explicit new contract；
5. 00 independent readback。

## 6. Next

System 1 / System 2 工程只需補上述 delta，不得重做已通過的 exact-dataset / mutation / repeat-inspection guards。

完成後 11 室再跑第二輪 adversarial validation。
最終 closure 仍屬 00。

FORMAL_OPTIMIZATION_CANDIDATE: NONE
Formal Core: LOCKED
