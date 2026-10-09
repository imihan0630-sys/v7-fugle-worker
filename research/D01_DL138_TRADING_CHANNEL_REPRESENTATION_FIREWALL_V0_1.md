# D01 DL-138 — Same-Security Trading-Channel Representation Firewall V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / TRADING_CHANNEL_REPRESENTATION_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent the same ordinary-share price event from being double-counted across regular-lot, odd-lot, after-hours or other trading channels, while also preventing channel-specific prices from being silently fused into a synthetic D01 bar.

## Channel classes

REGULAR_LOT
INTRADAY_ODD_LOT
AFTER_HOURS_ODD_LOT
AFTER_HOURS_FIXED_PRICE
BLOCK_TRADE
OTHER_OFFICIAL_CHANNEL
CHANNEL_UNKNOWN

## Same security, different mechanism

The security identity may be identical across channels.

But channel observations can differ in:
- matching mechanism;
- liquidity;
- order size;
- timing;
- price formation;
- availability history.

Therefore:
same security != same price observation.

## Canonical D01 bar rule

Every D01 price bar must bind:
- canonicalBarSourceId;
- channelCompositionVersion;
- includedTradingChannels;
- excludedTradingChannels;
- marketSessionDate;
- sourceHistoryHash.

D01 may not merge channel-specific trades into one bar unless the canonical owner/source contract explicitly defines that aggregation.

## Duplicate-vote firewall

If the same security/date event is observed in multiple channels:
- preserve channel observations;
- link them under one security/date dependency root;
- do not count each channel as independent pattern evidence.

## Intraday odd-lot boundary

Intraday odd-lot availability begins only from its actual market-regime start.

Pre-regime absence is:
CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN.

It is not:
DATA_MISSING.

## Current decision

SAME_SECURITY_MULTI_CHANNEL_EQUALS_MULTIPLE_ALPHA_VOTES = FALSE.
CHANNEL_SPECIFIC_PRICES_MAY_BE_SILENTLY_FUSED = FALSE.
CHANNEL_COMPOSITION_MUST_BE_VERSIONED = TRUE.
PRE_REGIME_CHANNEL_ABSENCE_EQUALS_MISSING_DATA = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
