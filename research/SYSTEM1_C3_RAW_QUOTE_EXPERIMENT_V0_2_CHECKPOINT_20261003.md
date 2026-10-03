# System 1 C3 raw-quote experiment V0.2 checkpoint — 2026-10-03

Status: CLASS-A PREREGISTERED RESEARCH / DRAFT PR #328 / NOT MERGED / NOT DEPLOYED

Purpose:
- define what raw C3 Quote evidence may and may not prove before prospective outcomes are observed;
- keep V0.1 strict entry experiment as baseline;
- add a parallel V0.2 arm, not a replacement.

V0.2 semantics:
- selection-time depthScore, lateStage, close, A/B channel and geometry come only from verified C2 selectionContext;
- completed 15m OHLCV/volumeRatio come only from immutable C3 candle rows;
- execution-market mechanism comes only from immutable raw C3 Quote rows;
- V0.2 requires executionMarketState=CONTINUOUS;
- raw bidDepth5/askDepth5/depthImbalance remain descriptive evidence only;
- raw depth is never converted into a new 0-100 depthScore;
- isLimitUpHalt is never re-labelled as a generic at-limit-up state;
- generic limit-up state therefore remains UNKNOWN unless a separate authoritative semantic is later defined.

Entry/fill controls remain conservative:
- NEXT_COMPLETED_BAR_OPEN fill;
- STOP_FIRST when stop and target are both hit within one bar;
- explicit fee/tax/slippage contract;
- incomplete bar or quote coverage -> INPUT_BLOCKED;
- non-continuous market mechanism -> INPUT_BLOCKED;
- no candidate-count lift claim is treated as performance.

No Formal selection, ranking, threshold, 3+3+3, capital, signal, push, order or System2 authority is changed.
