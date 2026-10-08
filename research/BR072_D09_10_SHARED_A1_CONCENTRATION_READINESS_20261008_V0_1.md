# BR-072 — D09-10 Shared A1 Parent / Concentration Readiness V0.1

Status: RESEARCH_ONLY / SHARED_PARENT_DATA_ROOT / COMPUTATION_READY_DATA_EXPORT_BLOCKED / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-10
Date: 2026-10-08 Asia/Taipei
Observed main before write: a9238af031d58fd6c1226686b1e8f470d5a8041a

Purpose: bind D09-10 to the same immutable 2026-10-07 A1+B5 parent requested by BR-043 instead of creating a second export path.

Verified parent existence: TWSE 1,086 rows + TPEx 887 rows = 1,973 rows. Current B5 industry metadata is usable for the live receipt. Blocker = row payload exposure, not source existence.

Shared dependency: research/BR043_D09_09_A1_ROW_EXPORT_DATA_LANE_DEPENDENCY_20261008.md
Rule: ONE_A1_B5_PARENT / MULTIPLE_RESEARCH_CONSUMERS. D09-09 and D09-10 must preserve the same parent digest/hash.

D09-10 computation after export:
- sectorTradeValue, top1AmountShare, top3AmountShare;
- amountHHI, effectiveActiveNames, equalShareHHIBaseline, normalizedAmountHHI, effectiveActiveNameRatio;
- returnLeaderGap1, returnLeaderGap3;
- breadthExTop1/top3, avgChangeExTop1/top3, leaderRemovalSignStable;
- memberReturnDispersion and mandatory known/unknown/member denominators.

Fail closed: no concentration inference from aggregate market totals; no raw-HHI cross-sector comparison without size normalization; missing trade value is UNKNOWN not zero; one-member sector is structurally single-member; current B5 classification is not backfilled historically.

D09-10 remains L3 / 60%. No L4 promotion.
Current state: DATA_EXISTS_AND_READBACK_VERIFIED / SHARED_ROW_PAYLOAD_NOT_EXPOSED / COMPUTATION_CONTRACT_READY.

Exact next: when DATA_LANE returns the immutable BR-043 A1+B5 export, Room07 computes D09-09 and D09-10 from the same parent digest outcome-blind, then accumulates independent clean dates. Do not create a duplicate parent capture.

Formal Core unchanged.
