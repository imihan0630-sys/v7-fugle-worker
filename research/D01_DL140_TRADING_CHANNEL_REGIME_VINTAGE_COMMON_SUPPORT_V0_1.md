# D01 DL-140 — Trading-Channel Regime Vintage / Common-Support Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / CHANNEL_REGIME_VINTAGE_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent modern trading-channel data or market rules from being backfilled into historical periods in which the channel/mechanism did not yet exist or was governed by a different rule set.

## Required regime fields

- market;
- securityIdentity;
- marketSessionDate;
- channelClass;
- channelRuleVersion;
- channelEffectiveFrom;
- channelEffectiveToExclusive if known;
- channelAvailableOnDate;
- sourceChannelCompositionVersion;
- sourceHash;
- firstObservableAt.

## Channel availability

If a mechanism did not exist on a historical date:
CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN.

Do not classify:
MISSING_CHANNEL_DATA.

## Source-composition drift

A canonical daily/intraday source may change its inclusion/exclusion of:
- regular trades;
- odd-lot trades;
- after-hours trades;
- block trades.

Cross-vintage D01 comparisons require sourceChannelCompositionVersion.

If composition is unknown:
CHANNEL_COMPOSITION_UNKNOWN_BLOCKED.

## Common support

Parent/child or old/new-vintage comparison must share:
- same channel composition;
- compatible mechanism regime;
- same security/date identity;
- same blocked-row policy.

A post-2020 odd-lot enriched representation cannot be compared as though the same feature existed before the channel began.

## Channel dependence graph

Channel-specific observations for the same security/date are linked through:
sameSecurityDateChannelClusterId.

The cluster preserves:
- descriptive differences;
- mechanism-specific context.

It does not create an independent vote count.

## Denominator states

CHANNEL_OBSERVED
CHANNEL_NOT_YET_AVAILABLE_BY_DESIGN
CHANNEL_SOURCE_MISSING
CHANNEL_COMPOSITION_UNKNOWN_BLOCKED
MECHANISM_RULE_UNKNOWN_BLOCKED

All are retained.

## Current decision

MODERN_CHANNEL_MAY_BE_BACKFILLED_BEFORE_EFFECTIVE_DATE = FALSE.
UNKNOWN_CHANNEL_COMPOSITION_MAY_BE_ASSUMED_STABLE = FALSE.
MULTI_CHANNEL_OBSERVATION_COUNT_EQUALS_INDEPENDENT_VOTES = FALSE.
CHANNEL_REGIME_METADATA_REQUIRED_FOR_D16 = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
