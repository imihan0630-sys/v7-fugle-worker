# D01 DL-119 — Immutable Session-Attribution Causality Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / SESSION_ATTRIBUTION_CAUSALITY_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Separate three superficially similar reasons for a missing or shifted daily observation:

1. OFFICIAL_CALENDAR_STATE
- the exchange itself is closed/open under the historical calendar.

2. SYMBOL_SPECIFIC_TRADING_STATE
- the exchange is open, but the symbol is not expected to trade because of listing lifecycle, suspension/resumption, migration/share conversion, or another certified symbol-session state.

3. SOURCE_ATTRIBUTION_STATE
- the market/symbol session exists, but the data provider assigns the observation to the wrong local date, wrong timezone, wrong batch date, or fails to deliver the official trade observation.

These causes must never be collapsed into one generic "missing bar" state.

## Canonical session states

EXCHANGE_CLOSED
- official exchange calendar says no market session.

SYMBOL_NOT_EXPECTED_TO_TRADE
- exchange open;
- certified symbol lifecycle/suspension state says no tradable symbol-session.

SYMBOL_TRADED
- exchange open;
- symbol expected to trade;
- official trade observation exists;
- admitted raw observation is present.

SYMBOL_EXPECTED_NO_TRADE_CONFIRMED
- exchange open;
- symbol expected to trade;
- authoritative source confirms zero/no trade;
- no pseudo OHLC is fabricated.

DATA_MISSING
- authoritative trade occurred but admitted raw observation is absent.

CONTRADICTION_BLOCKED
- source rows and authoritative trade/non-trade state conflict.

UNKNOWN_BLOCKED
- calendar, lifecycle, suspension, or trade-status provenance is incomplete.

## Attribution precedence

1. official exchange session identity;
2. certified symbol-session lifecycle;
3. authoritative trade/no-trade observation;
4. admitted raw source row;
5. provider metadata.

Provider batch/file date never overrides the official exchange-local session date.

## Immutable attribution roots

Each session attribution preserves independent roots:
- calendarAttributionRootId;
- symbolLifecycleRootId;
- timezoneAttributionRootId;
- rawObservationRootId.

A later correction identifies which root changed.

Do not convert a timezone error into a calendar revision.
Do not convert a symbol suspension into exchange closure.
Do not convert a missing raw row into confirmed zero trading.

## Revision causes

OFFICIAL_CALENDAR_REVISION
VENDOR_TIMEZONE_ATTRIBUTION_REVISION
SYMBOL_LIFECYCLE_REVISION
RAW_DATA_PIPELINE_REVISION
TRADE_STATUS_REVISION
IDENTICAL_ATTRIBUTION
MULTI_ROOT_REVISION
UNKNOWN_ATTRIBUTION_REVISION

Each cause is append-only and outcome-blind.

## Impact on D01

Official calendar revision:
- may change expected session set and higher-timeframe aggregation membership.

Symbol lifecycle revision:
- may change eligible lookback session set and stale-anchor/suspension semantics.

Timezone attribution revision:
- may move a raw observation between local dates without any new market price information.

Raw data pipeline revision:
- may expose a missing price observation already present in the official market history.

None is an independent Alpha source.

## Current decision

GENERIC_MISSING_BAR_STATE = PROHIBITED.
PROVIDER_BATCH_DATE_EQUALS_MARKET_DATE = FALSE.
EXCHANGE_CLOSED_EQUALS_SYMBOL_SUSPENDED = FALSE.
RAW_ROW_ABSENCE_EQUALS_NO_TRADE = FALSE.
ATTRIBUTION_REVISION_COUNTS_AS_ALPHA = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
