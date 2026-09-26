# Trend / Momentum / Reversal Checkpoint

Updated: 2026-09-26 Asia/Taipei
Status: FALSIFICATION_IN_PROGRESS / RESEARCH_ONLY
Formal Core: LOCKED

## Current cursor
- DL-003A Market-state continuation vs transition: mechanism and current-system gap defined.
- DL-003B Momentum Gap: Taiwan-specific negative evidence => rejected from current research priority.
- DL-003C Extreme Absolute Strength: Taiwan evidence positive, but high redundancy with existing lateStage/overheat; incremental test required.

## Durable findings
- Official-session continuity is technically feasible using existing Worker TWSE calendar machinery; no new provider is needed. Current R06 simply does not apply this proof yet.
- Taiwan momentum is not safely modeled as monotonic past-return strength.
- Historical Taiwan evidence reports positive momentum in market-state continuations and reversal in transitions, but that evidence is monthly and cannot be directly imported into the current daily selector.
- Current R06 exists but primarily counts regime transitions; it does not yet attach causal as-of continuation/transition context to each Shadow parent and compare outcomes.
- Adjacent observed research dates are not necessarily adjacent official trading sessions. Transition inference across a gap is UNKNOWN.
- Current Formal selection does not consume research regime/transition state.
- Momentum Gap is explicitly rejected as a priority factor because Taiwan-specific evidence finds no significant predictive power.
- Extreme Absolute Strength is mechanism-relevant but overlaps existing Formal lateStage and research overheat/ATR controls.

## Status vocabulary
- Regime Transition Lifecycle: FALSIFICATION_IN_PROGRESS.
- Momentum Gap: REJECTED_OR_REDUNDANT / TAIWAN_NEGATIVE_EVIDENCE.
- Extreme Absolute Strength: FALSIFICATION_IN_PROGRESS / REDUNDANCY_HIGH.
- FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next continuation
1. Consecutive-session source feasibility is proven. Next freeze/implement an isolated research-only adjacency classifier using the existing official calendar; do not alter shared calendar semantics.
2. Define CONTINUATION / TRANSITION / GAP_UNKNOWN / UNKNOWN and sameRegimeStreakSessions without filling missing dates.
3. Require outcome analysis to control current regime level; otherwise transition and regime are confounded.
4. Wait for sufficient independent prospective transition dates before directional conclusion.
5. Deepen market-volatility/illiquidity moderator evidence only after checking the dedicated Volatility-Regime domain to avoid duplicate research.
