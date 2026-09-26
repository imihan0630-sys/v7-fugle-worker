# Trend / Momentum / Reversal Checkpoint

Updated: 2026-09-26 Asia/Taipei
Status: FALSIFICATION_IN_PROGRESS / RESEARCH_ONLY
Formal Core: LOCKED

## Current cursor
- DL-003A Market-state continuation vs transition: mechanism and current-system gap defined.
- DL-003B Momentum Gap: Taiwan-specific negative evidence => rejected from current research priority.
- DL-003C Extreme Absolute Strength: Taiwan evidence positive, but high redundancy with existing lateStage/overheat; incremental test required.
- DL-003D/F Momentum Persistency construct audit: existing persistenceScoreResearch is own-path trend consistency, not Chen-Hsieh-Lee cross-sectional rank duration. Prospective ret60 rank-retention spec frozen; no historical backfill.

## Durable findings
- Rank-persistency construct mismatch is confirmed: Chen/Hsieh/Lee (2023) measures consecutive winner/loser portfolio membership; current persistenceScoreResearch is a weighted own-path trend-consistency heuristic.
- The current full same-scan feature universe already has ret60 when 61 valid bars exist, so prospective ~3-month cross-sectional rank capture is technically feasible without extra market-data calls. Historical rank-duration is not preserved and remains UNKNOWN.
- A system-native daily ret60 rank-retention design is not a canonical replication of the paper's monthly 3/6/9/12-month design; effect sizes and thresholds are not portable.
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
- Rank Persistency: SPEC_FROZEN / PROSPECTIVE_ONLY / ALPHA_UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE: NONE.

## Exact next continuation
1. Keep R06 GAP_UNKNOWN semantics; wait for sufficient clean transition dates.
2. Keep rank persistency prospective-only. Do not reconstruct pre-capture winner/loser membership.
3. First future persistence test must control current ret60 rank, existing persistenceScoreResearch and Residual RS.
4. Universe count/coverage is first-class provenance; membership changes cannot silently become economic exits.
5. After active V8.15 lineage resolves, Class-A rank capture may be considered only if zero-extra-call, Shadow-only and Formal-invariant.
6. Continue independent under-reconciled questions while evidence accumulates.
