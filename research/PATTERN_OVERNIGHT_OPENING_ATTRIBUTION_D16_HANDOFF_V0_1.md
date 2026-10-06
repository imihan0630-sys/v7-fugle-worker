# D01 DL-063 — D16 Overnight / Opening Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes structural carry-forward and opening-gap opportunity semantics.
D16 owns future residual inference.

Core distinction:
- prior-day structural reference;
- overnight information repricing;
- opening-auction price discovery;
- first continuous-session structural opportunity.

## Gap-through is not an intraday retest

If price closes below resistance and opens above the entire zone, there is no observed continuous-session trade path through the zone during market closure.

Likewise for support skipped downward.

Do not count a fill/touch at the skipped zone without execution evidence.

## Required owner context

Consume:
- D01-09 gap/limit semantics;
- D05-06 opening auction;
- D11-10 overnight-gap risk / corporate action;
- D12-10 night futures;
- D13 global/session context;
- D17 event clocks and post-event path;
- D04-09 tail/gap volatility.

Unknown remains UNKNOWN.

## Prior-close contamination

Carry forward DL-062 prior-close auction state.

A prior-day structure confirmed only at closing auction is a different evidence state from one already established during continuous trading.

## Opening trial

Historical pre-open trial path is UNKNOWN unless archived.

Opening final price cannot backfill trial trajectory.

## Future ladder

O0 raw next-open zone classification;
O1 prior structure timing;
O2 prior close auction;
O3 corporate action;
O4 opening auction phase;
O5 certified overnight event;
O6 night futures/global lead;
O7 gap size/direction;
O8 generic overnight comparator;
O9 first continuous opportunity;
O10 gap-through vs continuous cross;
O11 structural residual candidate;
O12 prospective replication.

## Generic comparator

Compare the same overnight shock:
- away from a prior zone;
- at/through a prior zone.

If zone-specific residual vanishes:
OVERNIGHT_INFORMATION_SUFFICIENT.

## Dependence

Prior structure, night futures, global markets, issuer news and opening print may share one initiating information event.

Default effectiveIndependentEvidenceCount remains 1 until D16 validates residual/dependence structure.

## Promotion boundary

No runtime or Formal change is authorized.

Formal Core remains LOCKED.
