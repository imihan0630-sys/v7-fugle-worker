# D03 ADX / Bollinger Comparator Availability Matrix V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Status: RESEARCH_ONLY / OUTCOME_BLIND / ZERO_NEW_PROVIDER_CALL_DESIGN
Formal Core: LOCKED

## Purpose

Accelerate D03-09 ADX and D03-10 Bollinger validation by separating:
1. comparators already computable from existing canonical market-history inputs;
2. comparators already present in some System1/System2 research/runtime paths;
3. comparators already proven to be persisted on the immutable C1 parent;
4. comparators still requiring same-parent provenance/persistence proof.

This is an availability and lineage audit, not an alpha test.

## Current repository evidence

### Existing raw/direct market features

Current System1 feature construction already computes or has durable evidence for:
- ret5 / ret10 / ret20 / ret60;
- ma20 / ma60 and MA-distance geometry;
- atrPercent;
- volatility20;
- gapPct;
- priorHigh20 and breakout/setup geometry;
- lateStage / overheat-related context.

Therefore future ADX/Bollinger residual tests do not require new ordinary daily-market provider calls merely to reconstruct these price-derived controls, provided the exact source/continuity/cutoff parent is valid.

### Current C1 parent projection already evidenced

The V8.15.3 C1 projection explicitly persists:
- atrPercent;
- ret20;
- maDistance20Pct;
- lateStage;
plus core observed/selection-context fields.

These are immediately reusable once a genuine cutoff-bearing C1 parent exists.

### Available elsewhere but not yet proven as complete same-parent D03 controls

Repository evidence shows availability of:
- ret60;
- volatility20;
- rangeCompressionSlope;
- trueRangeDryUp;
- realizedVolatility20/60 concepts;
- VCP / Platform compression geometry;
- trendPersistence research/system semantics.

However, current D03 evidence does not yet prove that all of these are persisted with the exact same immutable C1 generation, decision cutoff, source lineage and continuity state required for the D03-09/D03-10 promotion-grade comparison.

Therefore:
AVAILABLE_IN_REPOSITORY != SAME_PARENT_ADMITTED.

## D03-09 ADX minimum comparator ladder

Tier A — already closest to same-parent reuse:
1. ret20;
2. maDistance20Pct;
3. atrPercent;
4. lateStage / existing setup context.

Tier B — existing system features but same-parent admission still needs proof:
1. ret60;
2. volatility20;
3. MA20/MA60 slope/alignment;
4. trendPersistence;
5. directional/path efficiency;
6. HH/HL/LH/LL progression.

Admission rule:
ADX cannot claim independent trend-quality information until Tier A and the promotion-relevant subset of Tier B are bound to the same causal parent/common support.

## D03-10 Bollinger minimum comparator ladder

Tier A — existing direct controls:
1. atrPercent;
2. ret20;
3. maDistance20Pct;
4. lateStage/setup state.

Tier B — repository-available but same-parent admission still needs proof:
1. volatility20 / realized close-return volatility;
2. trueRangeDryUp;
3. rangeCompressionSlope;
4. VCP contraction geometry;
5. Platform width/boundary geometry;
6. gap/corporate-action/limit-state continuity.

Admission rule:
- BBW first competes against volatility20 + ATR;
- then against direct compression/VCP/Platform geometry;
- %B/touch competes against MA-distance + ret/trend + pattern lifecycle.
No majority-vote interpretation is allowed.

## Zero-new-call conclusion

The dominant future blocker is not lack of formulas or lack of ordinary OHLC history.
The dominant blocker is same-parent causal provenance and complete common-support persistence.

Accordingly:
- no new ordinary daily price provider call is justified for ADX/Bollinger comparator reconstruction at this stage;
- first preference is to project/reuse already-computed fields under the genuine cutoff-bearing immutable parent;
- any proposed new provider call must prove that the required comparator cannot be reconstructed from already-authorized canonical inputs.

## Evidence / falsification implications

Positive:
- substantial comparator coverage already exists in repository/runtime semantics;
- future promotion testing can be materially accelerated after PR #600 path is resolved.

Counterevidence / blocker:
- field existence in Worker/System2 is not equivalent to promotion-grade same-parent availability;
- some richer controls are currently research/system-level only;
- a missing same-parent field must stay UNKNOWN rather than be silently recomputed from a later or differently versioned source.

## Maturity decision

No promotion.
- D03 remains 56.7%.
- D03-09 remains L2/40.
- D03-10 remains L2/40.
- rawSourceVersionGate remains 2_OF_3.
- technicalObserverR1 remains BLOCKED.
- outcomes remain CLOSED.
- Formal Core remains LOCKED.

## Exact next continuation

1. When the protected cutoff-bearing parent path lands, inventory the actual persisted field set from the genuine generation, not from source-code expectations.
2. Bind all reused comparators to generationId, decisionCutoffAt, source/continuity lineage and common support.
3. For D03-10, first attempt the minimal residual ladder using existing fields before requesting any new data source.
4. For D03-09, require canonical Wilder H/L/C FULL_REPLAY/trusted-state certification before L3.
5. Keep TI-005 and TI-006 ahead of ADX/Bollinger predictive incrementality.
