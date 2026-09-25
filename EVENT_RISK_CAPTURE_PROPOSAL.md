# Event Risk Point-in-Time Capture Proposal

Updated: 2026-09-25 Asia/Taipei
Status: PROPOSAL_ONLY
Formal Core: LOCKED
Decision impact: FALSE

## Problem

Current data can support some date-level event and opening-gap descriptions, but it cannot fully support the prospective Event-Risk protocol because:
- normalized ANNOUNCEMENTS snapshots preserve date/title, not intraday first-known time;
- current V8.8.1 execution snapshots preserve previousClose/openPrice but not referencePrice/openTime;
- recorder milestone cadence is not an exhaustive all-symbol opening panel;
- historical current-feed recovery is not equivalent to immutable point-in-time event vintage.

## Objective

Create research evidence sufficient to study:
- gap-through-stop;
- scheduled/unscheduled event tail risk;
- corporate-action-adjusted opening gaps;
- opening-auction to first-15m path;
- event-aware portfolio stress;
without changing any Formal selection or trading behavior.

## Proposed minimum event record

- event_key
- symbol
- market
- title
- event_category_research
- disclosure_date
- disclosure_time
- first_known_at
- captured_at
- source_url
- source_row_hash
- revision_parent_key
- schedule_certainty
- scheduled_event_at
- provenance_quality
- unknown_reasons
- research_only = true
- decision_impact = false

## Proposed minimum opening record

- trade_date
- symbol
- expected_open_capture
- captured_at
- previous_close
- reference_price
- open_price
- open_time
- limit_up_price
- limit_down_price
- position_stage
- planned_stop
- source
- unknown_reasons
- research_only = true
- decision_impact = false

## Corporate-action firewall

Do not use raw open/previous-close gap as the primary event gap when referencePrice differs materially from previousClose.

Store both:
- rawOvernightGap = open / previousClose - 1
- referenceGap = open / referencePrice - 1

The first is an economic close-to-open wealth-change measure only when corporate-action treatment is correctly handled.
The second helps identify opening movement relative to the exchange's current-day reference framework.

Never silently substitute one for the other.

## Capture architecture preference

Preferred:
- isolated research collection/sink;
- bounded monitored-symbol universe;
- explicit expected-vs-observed coverage;
- append-only or immutable-vintage semantics where feasible;
- no read dependency from Formal scanner/monitor/signal/push;
- fail-open if research capture fails.

Avoid:
- new synchronous provider calls in latency-sensitive Formal decision path;
- mutable “latest announcement list” as historical truth;
- backfilling missing firstKnownAt from eventual publication metadata;
- coercing missing opening/event rows to zero/no-event.

## Research coverage contract

For each target trade date:
- expected_symbols
- observed_opening_symbols
- event_source_poll_expected
- event_source_poll_observed
- missing_symbols
- source_errors
- truncated = true/false
- complete_for_inference = true/false

No inferential result if completeness cannot be established.

## Governance

Documentation/proposal: research-safe.
Implementation that changes Worker/schema/shared scheduled workflows: requires governance review; treat as Class B unless proven isolated Class A.
Any use that changes Formal position, entry, ADD, REDUCE, RE-ADD, SELL, stop or allocation: Class C and owner approval required.

## Acceptance tests before any future merge/deploy

1. Formal regression output identical with research capture enabled/disabled.
2. Research capture failure does not block Formal monitor/scan/push.
3. No extra provider calls on Formal latency path unless explicitly approved.
4. Event time preserves timezone and source provenance.
5. referencePrice/openTime are null-safe.
6. Missing/truncated capture remains UNKNOWN.
7. Historical reconstruction cannot overwrite earlier immutable event vintage.
8. Coverage metadata is queryable by exact target date.

No implementation or deployment is authorized by this document.
