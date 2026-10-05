# D16｜既有實驗登錄表外層研究流稽核 V0.1

更新：2026-10-06 Asia/Taipei  
狀態：RESEARCH_ONLY / EXISTING_REGISTRY_AUDIT_COMPLETE / NO_MATURITY_CHANGE  
主責：11｜統計驗證與策略市場狀態研究室  
Formal Core：LOCKED

## 1. Audit question

第六輪 SDA-016 發現 outer sequential hypothesis stream 風險後，直接核對目前 repository 既有 experiment registries，確認這是純未來風險，還是現行治理缺口。

## 2. Central experiment registry

`research/EXPERIMENT_REGISTRY.md` 目前包含：

Base R families：
- R01
- R02
- R03
- R04
- R05
- R06
- R07
- R08

Versioned subdefinitions：
- R01 v1.1
- R02 v1.1
- R04 v1.1
- R05 v1.1
- R07 v1.1

Additional preregistered family：
- D16-CAL-01

Count interpretation：
- base R families = 8；
- versioned R subdefinitions = 5；
- D16-CAL-01 = 1；
- total explicitly named study definitions in this central file = 14。

Current central-registry field audit：
- `researchStreamId`: absent；
- `multipleTestingFamilyId`: absent。

This does NOT mean every local experiment lacks multiplicity control.
It means the central registry does not yet model one cross-room / continually-growing outer research stream.

## 3. D02 local multiplicity evidence

`research/d02_l4_effect_target_registry_v0_4.json` contains 14 registered entries.

Local family distribution：
- F0: 1；
- F1: 3；
- F2: 2；
- F3: 3；
- F4: 1；
- F5: 4。

This is useful local protection:
D02 does not treat every target as an unrelated fresh test.

But these F0-F5 ids do not by themselves establish:
- a cross-room `researchStreamId`;
- a whole-program error objective;
- outer stream budget transitions;
- a mapping to D03 / D16 / D18 hypothesis births;
- a shared System1/System2 consumption authority.

Therefore:
`LOCAL_MULTIPLICITY_GOVERNANCE_PRESENT / GLOBAL_STREAM_CONTROL_NOT_PROVEN`.

## 4. D03 local multiplicity evidence

`research/d03_primary_queue_d16_method_handoff_v0_1.json` contains two explicit experiments:
- `TI_005_KD_VS_RSI`;
- `TI_006_MACD_VS_DIRECT_TREND`.

Its D16 method receipt explicitly requires:
`multipleTestingFamilyId`.

Current D16 method receipt state:
`NOT_YET_RETURNED`.

Again this is a good local handoff requirement, but it is not an outer-program stream ledger.

## 5. D16-CAL-01 special opportunity

`D16-CAL-01` remains:
`PREREGISTERED_BEFORE_FIRST_GENUINE_C1_OUTCOME`.

Therefore it is still possible to bind outer-stream governance before the first genuine outcome inspection.

Required next state before any confirmatory outcome interpretation:
`STREAM_ENROLLMENT_REQUIRED_BEFORE_FIRST_GENUINE_OUTCOME_INSPECTION`.

This audit deliberately does NOT choose:
- FWER vs FDR vs mFDR；
- LORD / SAFFRON / ADDIS；
- alpha-investing；
- e-value framework；
- any numeric stream error level。

Those are methodology decisions that must be frozen before relevant outcome access and matched to dependence assumptions.

## 6. Historical R01-R08 boundary

Some R-family definitions explicitly preserve historical/descriptive versions and later preregistered v1.1 definitions.

The absence of a historical outer-stream id means:
- do not retroactively claim whole-stream confirmatory error control；
- do not erase historical descriptive findings；
- do not invent historical stream-state transitions；
- any already inspected data remains governed by its existing descriptive/development/holdout-consumption state。

Fresh future confirmation can still be valid if it enters a properly frozen future stream and uses fresh evidence.

## 7. Cross-room risk

Without a shared outer stream, a subtle failure is possible:

D02 local F1 passes  
+ D03 local family passes  
+ D16-CAL-01 passes  
+ D18 policy family passes

and each room treats its own family as well controlled,
while the overall system has tested many adaptive hypotheses and promotes only successes.

Local correctness does not algebraically imply program-level multiplicity control.

## 8. Audit disposition

`LOCAL_MULTIPLICITY_PARTIAL / CROSS_ROOM_OUTER_STREAM_NOT_MODELED`.

This is a governance gap, not evidence that existing local methods are statistically invalid.

No current experiment is newly labeled failed solely because this cross-room layer was previously absent.

## 9. Exact next

1. Before D16-CAL-01 first genuine outcome inspection, bind a `researchStreamId` or explicitly keep it exploratory.
2. Future D16 promotion receipts should reference both local `multipleTestingFamilyId` and outer `researchStreamId`.
3. Do not retroactively allocate favorable error budgets to historical hypotheses.
4. System1/System2 shared SDA-016 consumption authority should eventually carry outer stream lineage.
5. Room00 remains independent closure authority.

No maturity change.
