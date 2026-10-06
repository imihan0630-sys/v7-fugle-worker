# System 2 S2-07 Bounded RAW A1 Lineage V0.10

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / BUILD_LANE / PHYSICAL_EXECUTION_PENDING
Formal Core: LOCKED
Trading authority: NONE

## Purpose

Bind official exact-date RAW A1 provenance around only the four V0.9 bounded-positive
corporate-action schedules: 5381, 6241, 4806 and 3086.

V0.10 does not adjust prices and does not certify technical continuity.

## Session plan

For each certified native schedule:
1. resolve the official market-wide trading session immediately before `stopTradingStart`;
2. enumerate every official market-wide trading session from `stopTradingStart` up to but excluding `resumeTradingDate`;
3. require `resumeTradingDate` to be an official market session;
4. query the official TPEx historical daily A1 source for every required date.

## Bar semantics

- pre-stop boundary session: a tradable RAW OHLC bar must be observed;
- certified suspended market sessions: a tradable OHLC bar must NOT be observed;
- resume session: a tradable RAW OHLC bar must be observed.

A certified suspended market session with no tradable symbol bar is not a missing-data defect.

Every exact-date observation must preserve:
- sourceId;
- sourceUrl;
- sourceDateEvidence and basis;
- transport mode;
- RAW price space;
- source population hash;
- symbol row hash when a symbol row exists.

## Positive grade

`BOUNDED_RAW_A1_LINEAGE_EVIDENCE_READY` requires all required exact-date observations,
exact source-date alignment, RAW price space, provenance, correct boundary bars and zero
unexpected tradable bars during certified suspension sessions.

## Authority firewall

Even when RAW A1 lineage evidence is ready:
- historicalPublicationTimestampProven=false;
- pitHistoricalPublicationClockCertified=false;
- technicalContinuityCertified=false;
- continuityTransformPerformed=false;
- historyMutationPerformed=false;
- strategyEvaluationPerformed=false;
- selection/final-selection/push/capital/order authority=false;
- System1 runtime unused.

This gate proves bounded RAW source/session lineage only.
