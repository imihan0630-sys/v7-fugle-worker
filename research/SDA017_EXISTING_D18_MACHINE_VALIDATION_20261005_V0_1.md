# SDA-017｜現行 D18 Machine Guard 對抗式語意驗證 V0.1

更新：2026-10-05 Asia/Taipei
狀態：RESEARCH_ONLY / PARTIAL_PASS / SUPPORT_EPISODE_MACHINE_GUARD_PENDING
驗證主責：11｜統計驗證與策略市場狀態研究室
依據契約：`research/SDA017_REGIME_SUPPORT_EPISODE_VALIDATION_CONTRACT_20261005_V0_1.md`
被驗證實作：
- `system2/runtime/d18_observable_regime_vector_v0_1.mjs`
- `system2/runtime/d18_strategy_activation_frame_v0_1.mjs`
正式核心影響：NONE

## 1. 結論

`PARTIAL_PASS / EX_ANTE_AND_UNKNOWN_FIREWALL_STRONG / EPISODE_SUPPORT_ENFORCEMENT_PENDING`

現行 D18 machine layer 已足以證明：
- decision-time Regime vector 可以 immutable replay；
- UNKNOWN / CONTEXT_RAW 不會被硬轉成 bullish/bearish；
- activation policy 必須 preregister；
- unknown policy input 會 DATA_UNKNOWN；
- natural zero / policy disabled / data unknown 已分離；
- baseline/challenger cost contract 相同。

但它尚未機器化 SDA-017 最重要的「episode + support + family-consumption」三個防火牆。

## 2. 已驗證 PASS

### A. Decision-clock identity
Observable vector 驗證 marketDate / decisionTimestamp 一致。
hard prerequisite mismatch => whole vector UNKNOWN。

PASS。

### B. PIT-ready prerequisite
TAIEX context 與 direction breadth 不符合 PIT readiness 時 fail closed。

PASS。

### C. Partial dimensions preserve epistemic state
- Breadth 未取得完整 continuity => CONTEXT_RAW。
- Concentration 無 outcome-independent threshold => CONTEXT_RAW。
- Institutional flow => CONTEXT_RAW。
- Size/global blocked => UNKNOWN。

PASS。

### D. No scalar hindsight score
現行 vector 不產生 universal scalar risk score，也不產生 composite Risk-On/Off。

PASS。

### E. Deterministic replay
相同 inputs => same receipt hash；upstream receipt/value change => receipt hash change。

PASS。

### F. Preregistered activation mapping
D18-08 activation frame 驗證：
- policy class；
- strategy/version；
- regime dimension；
- disabled values；
- parameter hash；
- registeredAt / availableAt <= decisionTimestamp。

PASS。

### G. UNKNOWN/CONTEXT policy firewall
只有 dimension.state = KNOWN 才能執行 policy mapping。
UNKNOWN => DATA_UNKNOWN。

PASS。

### H. Natural-zero separation
完整 baseline 無機會 => NATURAL_ZERO_PICK，而不是 POLICY_DISABLED。

PASS。

### I. Cost parity
static baseline 與 challenger 綁同一 cost hash。

PASS。

### J. Mutated parent accounting rejection
Shadow accounting hash 不一致直接拒絕。

PASS。

## 3. 尚未通過／未覆蓋

### G1. Episode identity — BLOCKER

現行 observable vector 是「單日 receipt」。
沒有：
- episodeId；
- prior official-session receipt link；
- contiguous-state run；
- UNKNOWN gap split；
- vector-version boundary split；
- source/universe semantic boundary split。

因此目前不能由 machine layer 可靠回答「這 20 天到底是 20 個獨立市場狀態證據，還是同一個長 episode」。

### G2. Minimum-support state — BLOCKER

現行 builder / activation frame 不會計算：
- effective independent date N；
- episode N；
- occupancy；
- transition N；
- paired baseline/challenger N；
- episode dominance；
- support state = INSUFFICIENT / EXPLORATORY / PRIMARY_ELIGIBLE。

目前 research docs 有 L4 blockers，但 machine layer 尚未 enforce。

### G3. Unsupported known-but-thin state — BLOCKER

現行 activation frame 對：
- KNOWN state；
- preregistered disabled value；

就可以形成 POLICY_DISABLED frame。

這在 research feasibility L3 是合理的，但 SDA-017 要求：
**KNOWN 不等於 support-sufficient。**

未來 policy-value evaluation 必須在 aggregate support gate 前：
- 保留 frame；
- 但不得 promotion；
- unsupported state 應在 evaluation 層標 ABSTAIN / INSUFFICIENT_SUPPORT，而非被當成可驗證政策優勢。

### G4. Regime family expansion ↔ SDA-016 consumption — BLOCKER

現行 D18 preregistration可防 post-decision policy registration，但沒有 shared machine link 去識別：
- outcome 後改 threshold；
- outcome 後拆 state；
- outcome 後換 horizon / policy mapping；
- 是否因此消費原 holdout。

必須與 SDA-016 canonical experiment/holdout ledger 接線。

### G5. Complete intended state family — PARTIAL

D18-01 vector intentionally allows immature dimensions as UNKNOWN/CONTEXT_RAW；這是正確設計。

因此「complete intended state family」不是要求現在把未知值補齊，而是要求：
- 每個 intended dimension 有 machine-visible maturity/support semantics；
- policy consumer 不得把未成熟 dimension 當離散 state；
- family/version lineage 能跨日追蹤。

### G6. Prospective multi-episode evidence — DATA PENDING

目前 D18-08 只有 feasibility builder/test。
沒有足夠 genuine prospective strategy-date frames + matured outcomes + multiple episodes。

這是資料時間門檻，不能用合成 fixture 補。

## 4. 對抗測試映射

依 11 室 SDA-017 契約：

1. outcome 後新 Regime => machine family/holdout cross-link 未實作。
2. outcome 後 threshold mutation => prereg policy hash 可擋 same registration mutation，但新版 family 消費規則未接 SDA-016。
3. drop UNKNOWN for performance =>現有 frame會保留 DATA_UNKNOWN；aggregate promotion guard 尚待。
4. one long episode many dates => episode machine state未實作。
5. UNKNOWN gap splits episode =>未實作。
6. vectorVersion change splits episode =>未實作。
7. CONTEXT_RAW policy action =>現有 activation consumer 不符合 KNOWN 即 DATA_UNKNOWN；PASS。
8. unsupported thin KNOWN state => support gate未實作。
9. different cost baseline/challenger => PASS。
10. POLICY_DISABLED opportunity-cost required => flag 已存在；matured outcome enforcement仍待 prospective evaluator。
11. huge row N / tiny date N => existing research contracts禁止；machine aggregate gate未實作。
12. best-state-only reporting => family/accounting guard未實作。
13. smoothed/future latent decision state =>現行 observable vector不使用此路徑；若 future builder加入必須測。
14. historical spec reconstruction as prospective =>現行研究契約禁止；automatic builder still需 receipt provenance。
15. duplicate primitive multiple votes => D18 vector本身不做 majority vote；跨 consumer lineage仍需 SDA-001/013 等共同治理。

## 5. Validation decision

SDA-017 不可關票。

目前可判：
`EX_ANTE_REGIME_MACHINE_FIREWALL_VALIDATED_PARTIAL_PASS`

剩餘正式 delta：
1. immutable episode lineage；
2. aggregate minimum-support engine；
3. unsupported-state research ABSTAIN/INSUFFICIENT enforcement；
4. regime-family mutation 接 SDA-016 holdout consumption；
5. genuine prospective multi-episode policy evidence；
6. 00 independent readback。

## 6. Next

System 2 BUILD_LANE 應只新增：
- episode/support observer；
- immutable lineage；
- research-only aggregate support state；
- SDA-016 experiment-family/holdout reference。

不得趁機修改：
- live strategy weighting；
- ranking；
- Top6；
- capital；
- notification。

若需 shared runtime/schema，依既有治理升 Class B 並停在 owner approval 前。

FORMAL_OPTIMIZATION_CANDIDATE: NONE
Formal Core: LOCKED
