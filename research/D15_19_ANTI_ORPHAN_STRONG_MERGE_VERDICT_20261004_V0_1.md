# D15-19｜Anti-Orphan and Strong-Merge Verdict V0.1

Updated: 2026-10-04 Asia/Taipei
Status: SPECIALIST_VERDICT_COMPLETE / OWNER_GOVERNANCE_DECISION_NOT_EXECUTED
Formal Core impact: NONE

## Question
Should Kelly / Fractional Kelly remain a standalone D15 module, merge into D16-25, merge into D15-16 Portfolio Optimization, or be split across owners?

## Specialist verdict
Option B is the strongest structural destination if curriculum simplification is desired:
absorb Kelly / Fractional Kelly into D15-16 Portfolio Optimization while D16-25 remains the sole upstream probability / calibration / uncertainty authority.

Option A, keeping D15-19 standalone with an explicit D16-25 handoff, remains valid while empirical Taiwan PIT evidence is incomplete.

Option C, direct merge into D16-25, is rejected as the least natural structure because it would mix statistical belief validation with downstream portfolio capital allocation and duplicate D15-16.

Option D, split-transfer, is semantically safe only if every Kelly-specific sizing capability receives an explicit surviving D15-16 owner. It is more complex than B without a clear capability gain.

No merge is executed by this verdict.

## Anti-orphan capability map
D16-25 must retain:
- target / horizon semantics;
- prior / base rate;
- calibrated probability or predictive distribution;
- uncertainty provenance;
- distribution-shift / Regime calibration;
- ABSTAIN and decision-utility semantics.

D15-16 must retain if B is later approved:
- expected-log-wealth objective;
- binary Kelly sanity comparator;
- scenario / continuous Kelly optimization;
- Fractional Kelly;
- uncertainty-shrunk sizing as a downstream consumer of D16 uncertainty;
- drawdown-constrained Kelly;
- distributionally robust Kelly challenger;
- portfolio dependence / covariance / joint-distribution constraints;
- concentration, liquidity, lot, capital and leverage constraints;
- cost / execution implementation layer;
- comparison against equal capital, fixed risk, risk budget / risk parity, Mean-Variance and Black-Litterman families;
- tail / ruin / survival diagnostics;
- model-risk kill switch and degradation ladder.

No capability may disappear merely because D15-19 ID is retired.

## Why D15-16 is the natural comparison family
Kelly, Mean-Variance, Risk Budgeting / Risk Parity and Black-Litterman are alternative capital-allocation methods. They differ in objective function and required inputs, but all must answer the same implementation questions:
- what information set is PIT-valid;
- how estimation error changes weights;
- how constraints alter theoretical optimum;
- whether diversification claims survive dependence;
- whether costs / liquidity / lot quantization erase gains;
- whether a simpler baseline performs equally well OOS.

Therefore a unified method-family benchmark prevents Kelly from receiving a privileged evidence standard.

## Strong-merge gate
Do not execute B until:
1. D15-16 has at least an L2 mechanism/falsification framework capable of owning the transferred semantics.
2. The D15-19 artifact inventory is mapped to surviving D15-16 sections.
3. D16-25 remains canonical probability/calibration authority.
4. Tracker/router/master-map references are updated atomically.
5. Owner explicitly approves curriculum retirement/merge.
6. Formal Core remains unchanged unless separately approved.

## Current recommendation
KEEP D15-19 ACTIVE TEMPORARILY / PREPARE B AS STRONG-MERGE TARGET.

This avoids premature retirement while making the eventual curriculum simplification path explicit.

No FORMAL_OPTIMIZATION_CANDIDATE.
