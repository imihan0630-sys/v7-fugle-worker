# D19 Stage 15 research receipt — 2026-10-07

Status: RESEARCH_ONLY
Formal Core impact: NONE
Maturity impact: NONE

## D19-13 relative-value cost falsification
Taiwan evidence is not uniformly supportive of pairs trading. A Taiwan Top-50 component study over 2005-2013 reported positive average return before transaction costs but materially negative average return after costs. Treat this as counterevidence, not as a universal no-alpha claim.

Preregistration gate: candidate-generation breadth, pair/model/version, formation window, hedge ratio, structural-break rule, two-leg tradability, borrowability, component-wise costs, pair overlap, and multiple-testing family. Search breadth is part of the testing family. D19-13 remains L2/40.

## D19-16 liquidity factor role separation
Taiwan literature reports illiquidity-premium evidence, but earlier evidence is sensitive to size/beta controls. Other Taiwan evidence finds down-market liquidity more strongly priced than up-market liquidity. A 2024 Taiwan study proposes an ex-overnight and recency-aware illiquidity measure.

Preregistered comparator family: baseline Amihud, ex-overnight, recency-aware, and up/down-market decomposition. Liquidity-as-signal must be separated from liquidity-as-execution-friction. Candidate residual alpha must survive neutralization and component-wise cost/capacity evidence. D19-16 remains L2/40.

## Factor-layer PIT chain selection
Select the first complete chain by upstream receipt readiness, not observed historical performance:
universeReceipt -> returnReceipt -> factorInputReceipt -> neutralizationReceipt -> costReceipt -> replayReceipt.
Missing mandatory evidence remains UNKNOWN.

## Decision
D19 remains 41.3%. D19-12 remains bounded L3/60; fourteen other active modules remain L2/40. No L3/L4 promotion. FORMAL_OPTIMIZATION_CANDIDATE=NONE.

## Exact next
1. Freeze machine-readable D19-13 pairs/cointegration preregistration receipt.
2. Freeze machine-readable D19-16 PIT liquidity input receipt with signal/friction separation and metric variants.
3. Build D19-15 benchmark PIT receipt with methodology and constituent/weight vintage plus sourceHash.
4. Choose first executable factor-layer PIT chain only by upstream receipt completeness before outcome inspection.
