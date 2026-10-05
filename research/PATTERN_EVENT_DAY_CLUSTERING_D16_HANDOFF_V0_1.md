# D01 DL-042 — D16 Event-Day / Scheduled-Information Cluster Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes:
- decision-relative event state;
- event family / instance / common-cluster identity;
- calendar-vintage and surprise no-lookahead rules;
- event replication counts.

D16 owns future economic inference.

## 2. Owner dependencies

Consume:
- D08 event / news / issuer-event receipts;
- D13 macro schedule, initial release, consensus and surprise clocks;
- D17 disclosure timing where routed;
- DL-041 market/beta controls;
- DL-040 sector controls.

Do not rebuild calendars or surprises in D01.

## 3. Required comparison ladder

A0 RAW_MARKET_RESIDUAL_PATTERN

A1 EVENT_STATE_STRATIFIED

A2 EVENT_INSTANCE_CLUSTERED

A3 EVENT_FAMILY_CLUSTERED

A4 NON_EVENT_DATE_RESIDUAL

A5 CROSS_EVENT_FAMILY_REPLICATION

A6 EVENT_AND_NON_EVENT_REPLICATION

## 4. Replication units

Report separately:
- stock observations;
- symbols;
- roots;
- market dates;
- event instances;
- event families;
- common-event clusters;
- non-event market dates;
- unknown event-context rows.

Many symbols or dates attached to one event instance remain one event dependence family.

## 5. Event clock

Never collapse:
- scheduled known state;
- release;
- surprise;
- post-release market reaction.

A release after predictor freeze is future for that predictor even when its schedule was known.

## 6. Calendar vintage

Historical schedule state requires captured/archived vintage evidence.

Current calendars may not reconstruct historical first-known schedules.

Reschedule/cancellation lineage remains UNKNOWN without receipt history.

## 7. Event-day premium

Macro/FOMC/earnings announcement days can have distinct return behavior.

Future Pattern inference must therefore show whether results:
- vanish on event controls;
- are event-family-specific;
- remain on non-event dates;
- replicate across event families and non-event periods.

## 8. Common support

Event vs non-event comparisons require overlap in:
- size/liquidity;
- sector;
- beta/market regime;
- opportunity geometry;
- pre-event volatility;
- tradability.

No extrapolation outside support.

## 9. No outcome-selected deletion

Any event-excluded sensitivity, leave-one-event-instance-out or leave-one-family-out policy must be frozen before outcome inspection.

## 10. Promotion boundary

No event-cluster diagnostic changes Formal eligibility, score, Top6, capital or runtime.

Formal Core remains LOCKED.
