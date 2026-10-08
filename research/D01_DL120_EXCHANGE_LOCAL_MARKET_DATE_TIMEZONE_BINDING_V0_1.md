# D01 DL-120 — Exchange-Local Market-Date and Timezone Binding Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / MARKET_DATE_BINDING_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent UTC/provider ingestion dates and batch timestamps from silently changing the trading-session date used by D01.

For TWSE/TPEx research, the canonical market timezone is Asia/Taipei.

## Market-date hierarchy

### Preferred
EXCHANGE_REPORTED_MARKET_DATE
- an official/exchange-bound source explicitly supplies the market/session date.

### Derived fallback
TIMESTAMP_DERIVED_MARKET_DATE
Allowed only when:
- event timestamp contains an explicit timezone/offset;
- exchange timezone contract is known;
- conversion to Asia/Taipei is deterministic;
- timestamp semantic meaning is trade/session observation, not batch delivery.

### Not acceptable as session identity
PROVIDER_BATCH_DATE_ONLY
FILE_NAME_DATE_ONLY
INGESTION_DATE_ONLY
LOCAL_MACHINE_DATE_ONLY

These may be provenance metadata but cannot define the market session.

## Midnight/UTC firewall

A UTC timestamp may belong to the next Asia/Taipei calendar date.

Therefore:
- never use UTC date truncation as TWSE/TPEx session date;
- never use provider ingestion date when an exchange market date exists;
- preserve original timestamp and derived local market date together.

## Batch-after-midnight case

A provider may publish/download a file after local midnight for the previous trading session.

The batch/download date is not the market date.

The market-date binding must remain tied to:
- official session date; or
- certified event/session timestamp semantics.

## Common-support identity

Any D01 parent/child or old/new-vintage comparison must share:
- market;
- exchange timezone contract;
- canonical market date;
- calendar identity;
- symbol lifecycle identity where relevant;
- semantic price space.

If timezone/source-date attribution differs, the observations are not on common support until reconciled.

## Timezone revision

A corrected timezone parser may change market-date assignment while leaving raw numerical OHLC unchanged.

That is:
VENDOR_TIMEZONE_ATTRIBUTION_REVISION.

It requires:
- versioned remapping;
- new source/session identity;
- affected R7 replay;
- old receipt preserved.

It does not create an extra evidence vote.

## Current decision

UTC_DATE_TRUNCATION_FOR_TWSE_SESSION = PROHIBITED.
BATCH_DATE_AS_SESSION_DATE = PROHIBITED.
EXCHANGE_REPORTED_DATE_HAS_PRECEDENCE = TRUE.
TIMEZONE_REMAP_REQUIRES_VERSIONED_REPLAY = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
