# Curriculum H09-H12 Specialist Validation Packets 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: READY_FOR_SPECIALIST_EXECUTION
Parent contract:
`shared-knowledge/CURRICULUM_H09_H12_SCOPE_DEDUP_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

No packet authorizes merge, retirement, maturity promotion or Formal Core changes.

## H09 packet — 11｜統計驗證與策略市場狀態研究室

Target:
D16-19 Machine Learning／Calibration
vs
D16-25 Probabilistic Decision／Bayesian Updating／Uncertainty-aware Selection

Required work:
1. Freeze producer-consumer interface.
2. Separate calibration implementation/diagnostics from decision utility/ABSTAIN policy.
3. Assign ownership for Brier/log loss/reliability/model drift vs risk-coverage/utility/decision drift.
4. Define immutable prediction receipt ownership.
5. Produce divergent-state examples:
   - well-calibrated model but no-trade/ABSTAIN decision;
   - imperfect calibration causing model-quality warning without changing decision layer semantics.
6. Remove duplicate calibration responsibilities.
7. Return terminal classification.

## H10 packet — 07｜產業與供應鏈研究室 + 08｜事件與新聞研究室

Target:
D10-12 structural issuer exposure
vs
D17-04 direct beneficiary/victim
vs
D17-05 indirect/second-order transmission

Required work:
1. Freeze canonical structural exposure schema under D10-12.
2. Freeze D17 event overlay: source, clock, surprise, direction, half-life and direct/second-order path.
3. Prove D17 modules consume rather than rebuild D10-12 exposure.
4. Produce cases where structural exposure exists but current event attribution is UNKNOWN/zero.
5. Produce cases where event attribution differs despite similar structural exposure.
6. Build shared evidence receipt and anti-double-count linkage.
7. Return terminal classification.

## H11 packet — 09｜衍生品與國際總經研究室

Target:
D12-07 Skew／Term Structure
vs
D12-16 Volatility Surface／Smile

Required work:
1. Ingest common option-chain parent rows once.
2. Freeze D12-07 simple low-dimensional features.
3. Freeze D12-16 surface fitting, curvature and richer shape features.
4. Compare D12-16 residuals after D12-07 controls on identical common-support rows.
5. Record sparse quote/interpolation/no-static-arbitrage quality.
6. Produce divergent-state examples.
7. Test incremental OOS/cost value before any independent Alpha claim.
8. Return terminal classification.

## H12 packet — 05｜法人與籌碼研究室 + 10｜投組風控與交易執行研究室 + 13｜行為金融與市場心理研究室

Target:
D06-09 / D06-18 / D14-19 / D20-13

Required work:
1. Build four-layer data/decision schema:
   - observed lending/short activity;
   - borrow economics;
   - short execution lifecycle;
   - limits-to-arbitrage context.
2. Assign one canonical owner for every raw field and derived state.
3. Separate directional inference from borrow/execution feasibility.
4. Build short feasibility state machine: establish / maintain / recall / forced buy-in / exit.
5. Define when D14-19 may emit a strategy-specific HARD_INVALIDATION due to factual non-orderability.
6. Prove D20-13 remains context/falsification, not a directional signal.
7. Produce divergent-state examples across layers.
8. Freeze one primitive evidence receipt per lending observation.
9. Return terminal classification per layer.

## Common return format

- exact module IDs;
- source/data owner;
- producer-consumer interface;
- PIT/replay contract;
- shared vs residual scope;
- divergent-state examples;
- anti-double-count test;
- capability inventory;
- maturity implication;
- terminal classification;
- Formal Core unchanged confirmation.

00｜研究總控室 performs Dependency Audit and owner review after specialist return.
