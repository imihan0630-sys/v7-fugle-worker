# D01 DL-136 — Issuer-Event Context vs Security-Opportunity Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / ISSUER_EVENT_SECURITY_OPPORTUNITY_SPLIT_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Separate one issuer-level event from multiple security-level D01 observations.

An issuer event can affect several securities without becoming several independent information roots.

## Issuer event context

Examples:
- earnings;
- merger announcement;
- capital action;
- governance event;
- issuer suspension;
- major disclosure.

One event receives:
issuerEventContextId.

Every affected security-level R7 observation may reference that ID.

## Security-level opportunity

Each security still has its own:
- securityIdentity;
- securityClass;
- market/symbol membership;
- price history;
- exactSessionHash;
- sourceHistoryHash;
- pattern episode.

Thus two securities of one issuer are not aliases.

But if their apparent signals are driven by one issuer event:
they share an event dependency cluster.

## Vote firewall

One issuer event affecting:
- common share;
- preferred share;
- warrant;

does not create three independent confirmations of the issuer information.

D01 does not compute issuer-level vote multiplication.

## Cross-security parent/child prohibition

A common-share named pattern cannot use:
- warrant geometry;
- preferred-share geometry;
- CB price movement;
as its common price parent.

Cross-security relationships, if studied, require a separate lead-lag/cross-asset module and D16 validation.

## Current decision

ONE_ISSUER_EVENT_EQUALS_MULTIPLE_INDEPENDENT_ALPHA_ROOTS = FALSE.
MULTIPLE_SECURITIES_OF_ISSUER_ARE_ALIASES = FALSE.
ISSUER_EVENT_DEPENDENCY_CLUSTER_REQUIRED = TRUE.
CROSS_SECURITY_PRICE_PARENT_IN_D01 = PROHIBITED.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
