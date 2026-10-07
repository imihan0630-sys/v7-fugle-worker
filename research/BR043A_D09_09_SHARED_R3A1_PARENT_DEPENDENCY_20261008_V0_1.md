# BR-043A — D09-09 Shared R3A1 Parent Dependency V0.1

Status: RESEARCH_ONLY / LIVE_RECEIPT_PARENT_DEPENDENCY / SHARED_WITH_SDA009 / GENUINE_R3A1_RECEIPT_0 / KEEP_L3 / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-09
CapturedAt: 2026-10-08 Asia/Taipei
Observed main before write: c0d8f76afcbdede3107764381f8437098aae9cf9

## Purpose

Clarify why BR-043's first live/source-only Taiwan sector-dispersion receipt cannot yet be frozen without creating a second, competing parent-data path.

## BR-041 frozen live inputs

The first live dispersion receipt requires one same-decision-clock member universe carrying:
- symbol;
- effective industry identity;
- currentChangePercent;
- currentTradeValue;
- exact member-universe identity / coverage.

BR-041 already established that no new conceptual metric source is required; BR-042 already passed isolated synthetic falsification for CSSD/CSAD/IQR/MAD.

The unresolved question is parent-lineage persistence, not formula design.

## Shared upstream dependency

Canonical SDA-009 readiness currently states:
`R3_V06_ACCEPTANCE_ORACLE_READY_SYSTEM1_R3A1_CAPTURE_PENDING_GENUINE_RECEIPT_0`.

SDA-009 remaining R3A1 delta explicitly requires:
- currentChangePercent;
- currentTradeValue;
- exact membership identity;
- production sector decision-state projection/digest.

These are the exact parent fields BR-043 needs for a clean live sector-dispersion receipt.

Therefore:
`BR043_PARENT_DATA ⊆ SDA009_R3A1_PARENT_DATA`.

Creating a separate Room07 live-parent capture would duplicate authority and risk membership-clock divergence.

## Frozen dependency rule

Until a genuine R3A1 receipt exists:
- do not reconstruct a selected-only or partial member universe;
- do not use current industry membership to backfill an earlier date;
- do not copy synthetic fixtures into a live receipt;
- do not infer missing members as zero return;
- do not create a second parent authority outside the frozen System1 R3A1 path.

Permanent rule:
`ONE_PARENT_DATA_ROOT / MULTIPLE_RESEARCH_CONSUMERS`.

## What happens when R3A1 arrives

BR-043 remains reserved for the first genuine live dispersion receipt.

After a R3A1 receipt passes `sda009_r3a1_acceptance_oracle_v0_6.mjs`, Room07 may consume the same immutable member set to compute, outcome-blind:
- CSSD;
- CSAD;
- IQR under the already frozen quantile convention;
- MAD;
- median return;
- coverage;
- trade-value Top1 removal;
- trade-value Top3 removal when remaining N is sufficient.

Leader removal must be selected only by pre-return/current same-clock tradeValue, never by realized return magnitude.

## Maturity

D09-09 remains L3 / 60%.

The module already has Taiwan PIT feasibility. This dependency clarification does not create additional prospective N and therefore cannot justify L4.

## Exact next

Wait for the first genuine System1 R3A1 parity receipt. Do not redesign BR-043.

On genuine R3A1 PASS:
1. reuse the exact immutable member universe;
2. freeze BR-043 source-only dispersion metrics;
3. preserve coverage/UNKNOWN states;
4. keep forward outcomes closed;
5. accumulate independent dates before D16 prospective/OOS interaction testing.

Formal Core unchanged.
