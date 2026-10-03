# System 1 C3 live-depth baseline readiness checkpoint — 2026-10-03

Status: CLASS-A RESEARCH / FORMAL CORE LOCKED / ARTIFACT-ONLY / NO PRODUCTION API CHANGE

Parent preregistry:
- research/SYSTEM1_C3_LIVE_DEPTH_PREREG_CHECKPOINT_20261003.md
- research/system1_c3_live_depth_prereg_v0_1.mjs

## Purpose

Measure whether the preregistered live-depth normalization has enough strictly
prior same-symbol same-15m-slot observations to be usable, without inventing
history or adding a Production query endpoint.

Frozen preregistry requirements:
- same symbol;
- same 15m slot;
- strictly prior sessions;
- minimum 10 prior sessions;
- maximum latest 20 prior sessions;
- no duplicate session rows;
- no same-day/future rows;
- no outcome labels.

## Artifact-only architecture

No D1/Worker/API change is required.

Future post-session evidence receipts now explicitly preserve:
- startAt
- endAt
- slot
- raw live depth fields
- liveQuoteTimestamp

New module:
research/system1_c3_live_depth_readiness_v0_1.mjs

It consumes:
- one current SYSTEM1_POSTSESSION_EVIDENCE_PACKET_V0_1;
- zero or more strictly prior post-session packets.

It extracts only complete raw live-depth observations and applies the frozen:
SAME_SYMBOL_SAME_15M_SLOT_PRIOR_SESSION_ECDF_MIDRANK_V0_1 method.

## Outputs

Schema:
SYSTEM1_C3_LIVE_DEPTH_BASELINE_READINESS_V0_1

Per current symbol-slot:
- status
- baselineN
- minPriorSessions
- maxPriorSessions
- missingPriorSessionsToMin
- baselineStart / baselineEnd
- normalized vector when ready
- compositeDepthScore = null
- triggerEligible = false
- outcomeLabelsUsed = false

Aggregate:
- currentObservationN
- rawCompleteCurrentN
- normalizedReadyN
- insufficientBaselineN
- rawIncompleteN
- normalizedReadyPct
- priorPacketN
- priorCompleteRawRowN
- priorIncompleteRawRowN
- minObservedBaselineN / maxObservedBaselineN
- symbolSummary

## Fail-closed semantics

- current raw depth incomplete -> RAW_LIVE_DEPTH_INCOMPLETE;
- <10 prior same-symbol same-slot sessions -> UNKNOWN_INSUFFICIENT_BASELINE;
- same-day/future packet -> rejected;
- duplicate prior trade date -> rejected;
- duplicate symbol/date/slot -> rejected;
- bar date not matching packet targetTradeDate -> rejected;
- no missing-data imputation;
- no readiness-date forecast.

## Important research implication

C3 capture is bounded to the selected Shadow cohort. Therefore same-symbol
recurrence may be sparse.

This module intentionally measures that fact rather than assuming that every
symbol will accumulate 10 comparable sessions quickly.

If prospective recurrence proves too sparse, any alternative normalization
population (cross-sectional, sector, liquidity bucket, etc.) requires a new
outcome-blind preregistration before use.

## Non-authorizations

- no live compositeDepthScore;
- no trigger threshold;
- no no-retest permission;
- no WATCH/BUY;
- no Formal admission/ranking change;
- no Production capture expansion;
- no historical backfill.

Economic superiority remains UNKNOWN.
Formal Core remains locked.
