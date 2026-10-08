# D01 DL-127 — Relisting / Long-Absence Reentry Stale-Anchor Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / RELISTING_REENTRY_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent a security that returns after a long no-trade/delisting/relisting interval from automatically inheriting a fresh pre-absence structural anchor.

Identity continuity and anchor freshness are separate questions.

## Identity first

If relisted/reentered instrument is a different successor security:
DL-124 identity break applies and no predecessor episode continues.

If immutable evidence proves the same security identity:
the old episode is still not automatically fresh.

## Reentry states

SAME_SECURITY_SHORT_INTERRUPTION
SAME_SECURITY_LONG_ABSENCE_STALE_ANCHOR
SAME_SECURITY_REENTRY_RECONFIRMED
SAME_SECURITY_REENTRY_BREACHED
SUCCESSOR_SECURITY_NEW_IDENTITY
IDENTITY_UNKNOWN_BLOCKED
DATA_BLOCKED

## Stale-anchor rule

A same-security identity can survive while its prior structural anchor becomes stale.

Do not choose an arbitrary calendar-day half-life after outcomes.

Freshness must be assessed by preregistered causal definitions such as:
- eligible-session count;
- information arrival;
- volatility-scaled displacement;
- explicit lifecycle/reopening evidence.

## First reentry bar

The first eligible bar after a long absence is a price-discovery observation.

It may:
- breach the old structural zone;
- reconfirm it later;
- remain unresolved.

It may not by itself backdate a confirmed continuation of the old episode.

## Reconfirmation

An old episode may regain structural relevance only under a preregistered post-reentry rule.

The reconfirmation time is new evidence.
It cannot be written into the old pre-absence receipt.

## Current decision

SAME_SECURITY_IDENTITY_EQUALS_FRESH_ANCHOR = FALSE.
FIRST_REENTRY_PRINT_EQUALS_RECONFIRMATION = FALSE.
RELISTING_SUCCESSOR_INHERITS_OLD_EPISODE = FALSE.
RECONFIRMATION_REQUIRES_NEW_OBSERVABLE_CLOCK = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
