# System 1 C3 depth semantics audit checkpoint — 2026-10-03

Status: CLASS-A RESEARCH / FORMAL CORE LOCKED / NOT DEPLOYED

## Problem found

The C3 research path already captures raw intraday top-five quote depth in V8.15.3:
- bidDepth5
- askDepth5
- depthImbalance
- spreadPct
- execution market / limit state

However the C3 entry simulator's existing depth threshold still receives the
selection-time depthScore copied from the immutable C2 selection context.

Therefore the current no-retest continuation experiment must not be described as
using a live intraday order-book depth score.

## Audit V0.4

research/system1_evidence_automation_v0_1.mjs now emits
SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_4.

Each adapted bar preserves both semantic families:

Selection-time context:
- depthScore
- selectionDepthScore
- depthScoreSemantics =
  SELECTION_TIME_CONTEXT_REUSED_NOT_LIVE_ORDER_BOOK

Raw live quote context:
- liveBidDepth5
- liveAskDepth5
- liveDepthImbalance
- liveSpreadPct
- liveDepthRawComplete
- liveDepthScore = null
- liveDepthScoreDerived = false

The existing C3 trigger still consumes depthScore for backward-compatible
research replay. No trigger threshold or entry behavior is changed in this
branch.

## Dedicated semantic report

New module:
research/system1_c3_depth_semantics_v0_1.mjs

Output:
SYSTEM1_C3_DEPTH_SEMANTICS_AUDIT_V0_1

It reports:
- raw live-depth coverage;
- whether ready receipts contain complete raw depth;
- triggerDepthSource;
- selectionDepthStillUsedByTrigger;
- rawLiveDepthUsedForTrigger=false;
- liveDepthScoreMappingStatus=NOT_PREREGISTERED;
- noRetestLiveDepthValidationReady=false;
- mustNotClaimPoorLiveDepthFilter=true.

Even 100% raw live-depth coverage does not upgrade the raw quote fields into a
live score.

## Post-session integration

SYSTEM1_POSTSESSION_EVIDENCE_PACKET_V0_1 now includes c3DepthSemantics and
interpretation guards:
- c3DepthGuardIsSelectionContextNotLiveOrderBook=true
- rawLiveDepthNotConvertedToScore=true

This makes future evidence packages self-describing and prevents a report from
claiming that the current no-retest challenger filtered on live depth when it
did not.

## Historical compatibility

Maturity ledger accepts both:
- SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_3
- SYSTEM1_C3_LIVE_INPUT_AUDIT_V0_4

Historical prospective packets therefore remain valid. New packets can use V0.4
without invalidating prior evidence.

## What is NOT done

No raw-depth normalization formula is invented.
No live depthScore is derived.
No outcome-based threshold tuning is performed.
No C3 support/no-retest trigger is changed.
No Worker/runtime/D1/provider-call/Cron/signal/push/order/allocation/System2
path is changed.

The next research step, if live-depth gating is desired, is a separate
preregistered outcome-blind normalization or a versioned C3 entry contract.

Economic superiority remains UNKNOWN.
Formal Core remains locked.
