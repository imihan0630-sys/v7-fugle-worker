# Curriculum H05-H08 Specialist Validation Packets 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: READY_FOR_SPECIALIST_EXECUTION
Parent contract:
`shared-knowledge/CURRICULUM_H05_H08_SEMANTIC_SPLIT_ACCEPTANCE_CONTRACT_20261003_V0_1.md`

No packet authorizes merge, retirement, maturity promotion or Formal Core changes.

## H05 packet — 06｜基本面與估值研究室 + 14｜公司治理與內部人研究室

Target:
D07-25 Forensic Accounting Red Flags
vs
D21-10 Audit／Restatement／Internal Control

Required work:
1. Build a statement-anomaly vs governance/control ownership matrix.
2. List exact PIT-observable fields/events for each module.
3. Freeze restatement/audit/internal-control event clocks separately from financial-statement vintage clocks.
4. Produce cases:
   - forensic red flag without audit/control event;
   - audit/control event without abnormal forensic ratio.
5. Design one shared evidence receipt for overlapping restatement/accounting events.
6. Define falsifiers and alternative explanations.
7. Return terminal classification.
8. If narrowing/merge is supported, propose capability-preservation map.

## H06 packet — 05｜法人與籌碼研究室 + 13｜行為金融與市場心理研究室

Target:
D06-06 Crowding
vs
D20-06 Herding／Social Proof

Required work:
1. Freeze D06-06 crowding observables.
2. Identify behavior-specific herding proxies that are not just the same holdings/flow concentration.
3. Control common-information response, passive rebalancing, liquidity shocks, factor exposure and correlated mandates.
4. Design residual-herding or leader/follower tests.
5. Produce divergent-state examples:
   - high crowding / herding UNKNOWN or low;
   - behavioral herding evidence without high static crowding.
6. Freeze anti-double-count rules.
7. Return terminal classification.

Hard rule:
Crowding alone never proves herding/social proof.

## H07 packet — 03｜技術指標與趨勢動能研究室 + 13｜行為金融與市場心理研究室

Target:
D03-05 Pullback／Short-term Reversal
vs
D20-09 Overreaction／Reversal

Required work:
1. Freeze D03-05 observable price-reversal definition.
2. Define D20-09 behavioral overreaction mechanism and observable prerequisites.
3. Test microstructure and structural alternatives: bid-ask bounce, inventory, liquidity provision, forced flow, event correction, volatility normalization, price-limit effects.
4. Define temporal ordering: behavioral evidence must not be inferred only after reversal is observed.
5. Produce divergent-state cases.
6. Test residual/incremental value of behavioral evidence after D03-05.
7. Return terminal classification.

Hard rule:
Prior extreme return + later reversal alone is not sufficient evidence of behavioral overreaction.

## H08 packet — 07｜產業與供應鏈研究室 + 08｜事件與新聞研究室 + 13｜行為金融與市場心理研究室

Target:
D09-11 Theme-stock <-> Formal-industry Bridge
vs
D17-11 Sector Propagation
vs
D20-11 Narrative／Theme Diffusion

Required work:
1. Build a three-layer ontology:
   - membership/taxonomy;
   - dated event propagation;
   - behavioral narrative diffusion.
2. Freeze source/clock requirements for each layer.
3. Provide examples where:
   - membership exists but no propagation;
   - event propagation exists without behavioral narrative evidence;
   - narrative/attention diffusion exists beyond static membership.
4. Identify behavioral narrative observables beyond headlines and theme labels.
5. Build one evidence-lineage graph preventing triple counting.
6. Preserve D09-11 L3 PIT bridge evidence only within taxonomy/membership scope.
7. Return terminal classification for each layer and pair.
8. If D20-11 cannot prove independent behavioral evidence, propose narrowing/merge destination.

## Common return format

Every packet must include:
- exact module IDs;
- evidence file paths;
- semantic ownership;
- PIT/source/replay contract;
- shared vs unique observables;
- divergent-state examples;
- competing mechanisms/falsifiers;
- anti-double-count rule;
- capability-preservation inventory;
- maturity implication;
- terminal classification;
- explicit Formal Core unchanged statement.

00｜研究總控室 will perform Dependency Audit and owner review afterward.
