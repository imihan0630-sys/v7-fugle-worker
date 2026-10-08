# D01 DL-116~118 — Exchange Calendar / Timezone / Partial Higher-Timeframe Bar Firewall
Date: 2026-10-08 Asia/Taipei
Scope: D01-01, D01-09, D01-10; research-only, outcome-blind, Formal Core LOCKED.
Parent: KLINE_PATTERN_CHECKPOINT.md through DL-115.

## DL-116 — Historical calendar identity
Hypothesis: Weekly/monthly candles are deterministic aggregations over historically knowable, exchange-local eligible symbol sessions, not a fixed five-day/twenty-day count. A holiday, trading-session correction or exchange-calendar vintage revision can change aggregation membership without any new market price information.
Support: Versioned exchange session set + local period identity + aggregation policy makes replay possible.
Falsification: Rebuild under the original PIT calendar and the revised calendar; compare session-set identity, constituent hashes, derived OHLC and pattern state before outcomes.
Alternatives: vendor UTC ingestion-date rollover, cross-market calendar mix, symbol-specific suspension, corporate-action continuity and source correction.
Failure: calendar knownAt after predictorFreezeAt; no certified exchange-local session date; duplicate/missing due session; unknown close time; mixed TWSE/TPEX or raw/technical-continuity price space. Preserve UNKNOWN, not 0/BAD.
Frozen receipt: market, exchangeTimezone, calendarVersion, calendarFirstObservableAt, scale, local period key, expected eligible sessions, due sessions, source roots, aggregationVersion, calendarIdentityHash, derivedIdentityHash, derivedValueHash.

## DL-117 — Partial vs finalized bar
Hypothesis: Thursday weekly OHLC is PARTIAL_AS_OF if Friday remains an expected future session; it cannot be retrospectively replaced with Friday's finalized weekly OHLC at Thursday's predictor freeze.
Falsification: Compare true prefix with full-history replay restricted to the same predictor freeze. Future bar payloads must not change even the earlier prefix's validation outcome.
Alternatives: incomplete provider delivery, holiday-shortened week, an unfinished daily constituent, or a due session that is absent.
Frozen states: FINALIZED_AS_OF (all eligible sessions due and present); PARTIAL_AS_OF (all due present, future session remains); WAITING_PROSPECTIVE (none due); DATA_BLOCKED (due session missing/unfinalized); UNKNOWN_BLOCKED (provenance/clock invalid). Never forward-fill missing bars or invent support touches.
Failure: finalizedAt or firstObservableAt later than freeze; historical weekly/monthly bar used before period end; data-driven choice of calendar boundary after outcomes.

## DL-118 — Revision-root fanout and non-independent evidence
Hypothesis: One calendar or primitive price correction may propagate to daily/weekly/monthly/rolling derived objects; these are linked revisions, not independent Alpha confirmations.
Falsification: A calendar-version change with unchanged OHLC is CALENDAR_DEFINITION_REVISION; changed source identity with unchanged OHLC is PROVENANCE_ONLY_REVISION; changed derived OHLC is DERIVED_VALUE_REVISION; exact same replay is IDENTICAL_REPLAY; missing receipt is UNKNOWN_BLOCKED.
Alternatives: aggregation policy change, symbol membership correction, adjusted/raw continuity transform, vendor clock error, or a genuinely different price observation.
Invariant: calendar/source revisions add zero independent Alpha votes. Primitive price revision roots and calendar revision roots remain separate. Cross-scale representation count cannot increase effective independent information-root count. Old R7 is append-only; source correction never restores consumed final holdout to untouched.

## Adversarial execution (synthetic only)
Isolated Node-compatible oracle and test files are maintained separately as research artifacts:
- pattern_dl116_118_calendar_boundary_oracle_v0_1.mjs
- pattern_dl116_118_calendar_boundary_oracle_v0_1.test.mjs
36/36 synthetic deterministic cases PASS. An initial prefix-invariance defect was found and corrected: a future-period bar was validated before cutoff filtering and could contaminate an earlier prefix's validation state. Final implementation restricts candidate observations to due sessions before validating source/market/semantic-space consistency.
Covered: partial/finalized week, local ISO-week year boundary, calendar vintage, timezone offset, due-vs-future denominator, duplicate/missing sessions, invalid OHLC, unfinalized bar, market and semantic-space mix, future-data prefix invariance, calendar revision, provenance-only and price revisions, outcome-field exclusion.
These tests are NOT genuine historical TWSE replay, native production parity, prospective Shadow or OOS performance. Do not claim L4.

## Bias/validation contract
PIT: calendar/price/clock vintages must be first-observable by predictor freeze.
OOS/walk-forward: outcome join remains CLOSED; later corrections cannot rewrite prior predictor snapshots.
Selection bias: preserve blocked/no-structure/nontrading denominators.
Look-ahead: no finalized future weekly/monthly OHLC in earlier prefix.
Data snooping/multiple testing: all calendar, anchor, scale and detector variants share an experiment family.
Overfitting: do not choose the calendar policy by future returns.
Factor redundancy: same primitive price/calendar information roots cannot become multiple votes.
Sample/date clustering: derived-bar count is not independent event count.
Transaction cost/liquidity/market regime: UNKNOWN until D04/D05/D15/D16 owner evidence; never zero by default.

## Physical gate / exact next
The frozen 1101 TWSE 2021-06-15 exact 61-eligible-session R1-R6 physical bundle remains unverified here; do not emit real R7 or open D16 outcomes.
Next: re-read latest main; check physical R1-R6; if present validate DL-095 and DL-108~118 before real R7. If absent, next genuinely new D01 outcome-blind work is to separate official calendar revision, vendor timezone misalignment and symbol-specific nontrading with immutable attribution and common support. Do not build duplicate source collectors. Formal Core LOCKED, Pattern Alpha UNKNOWN, D01 60.0% / all 11 L3 unchanged.
