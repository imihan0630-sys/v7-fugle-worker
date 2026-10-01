# D13-11 macro schedule vintage and decision-window audit v0.2

Updated: 2026-10-01 Asia/Taipei
Status: OUTCOME_BLIND_SCHEDULE_VINTAGE_CONTRACT_FROZEN / NO_PROMOTION
Formal Core impact: NONE

## Why this delta exists
A macro event calendar is not a timeless truth table. The research object must preserve what schedule was actually known before each Taiwan decision. Current official calendars can be revised, and a later calendar snapshot must not overwrite the earlier decision-time state.

## Official-source observations frozen in this audit
- BLS currently lists Employment Situation for September 2026 at 2026-10-02 08:30 America/New_York; the October calendar says it is updated as needed and shows last modified 2026-02-18.
- BEA current release schedule lists Personal Income and Outlays for September 2026 at 2026-10-29 08:30 and shows page last modified 2026-09-29.
- Federal Reserve current calendar lists the 2026-10-27/28 FOMC meeting, with the policy event at 14:00 America/New_York on 2026-10-28 and press conference at 14:30.
- ISM official 2026 calendar lists Manufacturing PMI on 2026-10-01 and Services PMI on 2026-10-05, normally at 10:00 Eastern.

These observations are schedule evidence only. They are not macro realizations, consensus expectations, surprises, or bullish/bearish votes.

## Schedule receipt contract
Every schedule observation should preserve, when available:
- eventId and eventFamily;
- referencePeriod;
- scheduledAtSource;
- sourceTimezone;
- scheduledAtTaipei derived with timezone rules;
- firstObservedAt by this research capture path;
- capturedAt;
- sourceCalendarLastModifiedAt or equivalent source-vintage marker;
- priorScheduleReceiptId if a prior vintage exists;
- revisionType: INITIAL_OBSERVED / UNCHANGED_REOBSERVATION / RESCHEDULED / CANCELLED / UNKNOWN;
- sourceUrlOrContract;
- provider;
- nextTaiwanCashOpenAt;
- decisionTimestamp;
- decisionWindowState.

## Decision-window state
For each Taiwan decision timestamp, derive only from information already known:
1. REALIZED_PRE_DECISION
2. SCHEDULED_POST_DECISION_PRE_NEXT_OPEN
3. SCHEDULED_AFTER_NEXT_OPEN
4. SCHEDULE_UNKNOWN_OR_CHANGED

The same event may legitimately change state across successive Taiwan decisions. Do not collapse event identity and decision-relative state.

## Critical PIT firewall
- firstObservedAt is not the same as the agency's original publication date.
- sourceCalendarLastModifiedAt is not proof that the research system observed that version on that date.
- A current calendar page can establish today's schedule state but cannot reconstruct an unobserved historical vintage.
- Historical schedule revisions must be supported by archived/captured receipts; otherwise revision lineage is UNKNOWN.
- A release value or consensus that becomes known after a decision must never be attached to the earlier decision row.
- DST conversion uses IANA timezone rules, not a fixed ET-to-Taipei offset.
- Government shutdowns, holidays, emergency rescheduling and agency revisions are first-class schedule-regime events, not data errors.

## Event-risk hypothesis
A known high-information release after Taiwan 18:10 but before the next Taiwan cash open may add information about next-session gap/range/MAE/tail risk even before its realization is known. This is an event-risk hypothesis, not a directional forecast.

## Falsification and redundancy
Before any promotion:
- compare against Taiwan realized volatility / ATR;
- compare against TAIWAN VIX / IV state;
- compare against TX NIGHT_PRE_SCAN;
- preserve event-family clustering rather than treating CPI/NFP/FOMC/PMI as independent votes;
- test crisis/shutdown/reschedule periods separately;
- use independent event dates as the inference unit;
- apply date-shift placebo and leave-one-event-cluster-out;
- if event-risk adds no incremental risk information after domestic volatility/derivatives controls, classify it REDUNDANT.

## Evidence boundary
The 2026-09-30 source-only pilot is valid prospective evidence that selected BLS schedule metadata was known by its capturedAt timestamp. It is not evidence of realized macro surprise and does not establish historical revision frequency.

Current 2026-10-01 official web observations can extend source understanding, but they become prospective research evidence only when stored with actual capturedAt/firstObservedAt semantics. No historical first-known timestamp may be fabricated.

## Maturity
D13-11 remains L2 / 40%.
FORMAL_OPTIMIZATION_CANDIDATE = NO.
Outcomes remain CLOSED.

## Exact next continuation
1. Create append-only schedule-vintage receipts for BLS, BEA, Fed and ISM using the unified global-market receipt envelope where compatible.
2. Preserve repeated observations even when unchanged so future reschedules can be detected without overwriting earlier vintages.
3. Add nextTaiwanCashOpenAt and decisionWindowState derived by exchange calendar + IANA timezone rules.
4. Keep consensus-vintage and realization receipts separate from schedule receipts.
5. Accumulate independent event dates before preregistering the risk-outcome join with D04 realized volatility, D12-05 TAIWAN VIX and D12-10 NIGHT_PRE_SCAN.
