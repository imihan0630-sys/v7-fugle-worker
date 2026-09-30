# D13-11 macro event clock audit

Updated: 2026-10-01 Asia/Taipei
Status: OUTCOME_BLIND_EVENT_CLOCK_SEMANTICS_FROZEN / NO_PROMOTION
Formal Core impact: NONE

## Finding
For a Taiwan 18:10 research decision, a known U.S. release schedule and the later realized release are different PIT objects. A release scheduled after 18:10 but before the next Taiwan cash open is event-risk context only; its realization and surprise remain UNKNOWN until released and captured.

Official schedules known before this audit include BLS Employment Situation on 2026-10-02 08:30 ET, CPI on 2026-10-14 08:30 ET, ISM Manufacturing on 2026-10-01 10:00 ET, FOMC statement on 2026-10-28 14:00 ET, and BEA Personal Income and Outlays on 2026-10-29 08:30 ET.

## Frozen states
- REALIZED_PRE_DECISION
- SCHEDULED_POST_DECISION_PRE_NEXT_OPEN
- SCHEDULED_AFTER_NEXT_OPEN
- SCHEDULE_UNKNOWN_OR_CHANGED

## Guards
- Never backfill a realized surprise onto the prior 18:10 row.
- Scheduled future events are not bullish/bearish votes.
- Preserve event family/clustering and schedule revisions.
- Convert time with timezone rules, not fixed offsets.
- If event-risk adds nothing beyond realized volatility, VIX and NIGHT_PRE_SCAN, treat it as redundant.
- Outcomes remain closed until independent PIT event-clock receipts accumulate.

## Maturity
D13-11 remains L2 / 40%. FORMAL_OPTIMIZATION_CANDIDATE = NO.

## Exact next
Extend the research-only schedule receipt with authoritative scheduledAt, source timezone, firstObservedAt, revision lineage and derived Taipei decision-window state. Then accumulate independent event dates before any risk-outcome test.
