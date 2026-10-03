# Curriculum H13-H20 Specialist Validation Packets 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: READY_FOR_SPECIALIST_EXECUTION
Parent contract:
`shared-knowledge/CURRICULUM_H13_H20_ANTI_DOUBLE_COUNT_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

No packet authorizes merge, retirement, maturity promotion or Formal Core changes.

## H13 — 06｜基本面與估值研究室 + 15｜信用市場與資本結構研究室

Target: D07-06 vs D22-03

Required:
- map accounting leverage primitives vs credit/funding residual fields;
- identify unique D22 debt-structure/market-credit evidence;
- produce divergent-state cases;
- define one shared accounting receipt;
- test incremental credit information beyond D07-06;
- return terminal classification.

## H14 — 05｜法人與籌碼研究室 + 08｜事件與新聞研究室

Target: D06-11 vs D11-14

Required:
- D11 owns index-event announcement/effective lifecycle;
- D06 owns realized passive/index flow;
- separate event expectation from realized flow;
- show event-known/flow-weak and flow-observed/no-new-event cases;
- freeze single event receipt + downstream flow receipt;
- return terminal classification.

## H15 — 08｜事件與新聞研究室 + 04｜波動與市場微結構研究室

Target: D11-10 / D04-09 / D17-12

Required:
- freeze initial gap event identity;
- map transformation into tail/gap volatility state;
- map subsequent continuation/reversal path;
- prohibit triple voting at the gap timestamp;
- define when post-gap observations become genuinely new evidence;
- return terminal classification.

## H16 — 04｜波動與市場微結構研究室 + 08｜事件與新聞研究室 + 01｜K線與型態研究室

Target: D05-02 / D11-11 / D01-09 / D04-10

Required:
- freeze exchange price-limit event as shared primitive;
- map factual exit/orderability risk;
- map pattern/gap semantics;
- map volatility-estimator contamination;
- identify any strategy-specific hard-invalidation condition without creating a generic directional gate;
- return terminal classification.

## H17 — 09｜衍生品與國際總經研究室 + 15｜信用市場與資本結構研究室 + 06｜基本面與估值研究室

Target: D13-06 / D22-04 / D07-18

Required:
- freeze risk-free yield-curve input;
- isolate issuer credit spread/refinancing component;
- build WACC composition map;
- produce divergent-state examples;
- residualize repeated rate information;
- prohibit one rate shock from becoming three votes;
- return terminal classification.

## H18 — 06｜基本面與估值研究室 + 14｜公司治理與內部人研究室

Target: D07-19 vs D21-07

Required:
- freeze project-economics outputs (NPV/IRR/real options);
- freeze management incentive/allocation-quality observables;
- distinguish opportunity-set quality from managerial decision quality;
- produce divergent-state cases;
- prevent duplicated use of the same NPV/return outcome;
- return terminal classification.

## H19 — 03｜技術指標與趨勢動能研究室 + 12｜資產定價與因子研究室

Target: D03-04 / D19-04 / D19-09

Required:
- freeze time-series momentum baseline;
- freeze cross-sectional rank/factor construction;
- freeze residual/factor-neutral momentum;
- use common PIT return history once;
- test D19-04 incremental role after D03 baseline;
- test D19-09 residual information after neutralization;
- include costs/capacity/common-support;
- return terminal classification.

## H20 — 01｜K線與型態研究室 + 02｜價量研究室 + 04｜波動與市場微結構研究室

Target: D01-05 / D02-03 / D04-07

Required:
- freeze breakout event anchor;
- price-only breakout/failure baseline;
- volume-confirmation incremental test;
- volatility interaction incremental test;
- produce disagreement/failure cases;
- enforce one breakout event receipt;
- return terminal classification.

## Common return format

Every packet returns:
- exact module IDs;
- primitive evidence owner;
- downstream transformation owner;
- PIT/replay and source clocks;
- divergent-state examples;
- incremental-value test;
- anti-double-count implementation;
- maturity implication;
- terminal classification;
- Formal Core unchanged confirmation.

00｜研究總控室 performs final Dependency Audit and owner review.
