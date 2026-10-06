# System 2 S2-07 Corporate-Action Native Schedule Integration V0.9

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / BUILD_LANE / PHYSICAL_EXECUTION_PENDING
Formal Core: LOCKED
Trading authority: NONE

## Purpose

Convert only self-describing corporate-action-native stop/resume schedule evidence into a bounded
symbol-session evidence grade. V0.9 follows V0.8, where generic halt/resumption sources produced
0/17 exact resume-date matches.

## Source semantics

### TPEx
The verified capital-reduction / par-value-change `詳細資料` payload is self-describing HTML with
explicit `停止買賣日期` and `恢復買賣日期` labels. V0.9 may parse those labels directly.

### TWSE
The current verified `詳細資料` payload is compact and unlabeled (for example
`1563,20260826`). V0.9 preserves it but does not infer that a compact prior date is the stop date.
TWSE remains fail-closed under `NATIVE_SCHEDULE_DETAIL_NOT_SELF_DESCRIBING` until separate
source-semantic proof exists.

## Positive bounded grade

`BOUNDED_NATIVE_SYMBOL_SESSION_EVIDENCE_READY` requires all of:
1. V0.7 promotion evidence is ready;
2. source-native schedule is self-describing;
3. stop and resume dates parse successfully;
4. native resume date equals event effectiveDate;
5. source eventVersionId and sourceRowHash are present;
6. resume/effective date is an official market trading session.

No nearest-prior-date inference is allowed.

## Authority firewall

Even a positive V0.9 grade keeps:
- noSuspensionMayBeClaimed=false;
- suspensionCoverageComplete=false;
- symbolSessionCompletenessCertified=false;
- rawA1LineageBound=false;
- technicalContinuityCertified=false;
- continuityTransformPerformed=false;
- selection/final-selection/push/capital/order authority=false;
- System1 runtime unused.

## Physical hypothesis

Based on V0.9a diagnostics, the expected bounded positives are the V0.7-ready TPEx events:
5381, 6241, 4806 and 3086.

This is a physical-test hypothesis, not a completion claim. The readonly workflow must prove it.
