# D01 DL-135 — Point-in-Time Security-Class Eligibility Firewall V0.1

Updated: 2026-10-10 Asia/Taipei
Status: OUTCOME_BLIND / SECURITY_CLASS_PIT_FIREWALL_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Make the D01 first-wave security-class filter point-in-time.

The frozen first-wave bounded universe is historically valid ordinary common equities.
Eligibility must be evaluated from the security class that was valid on the predictor date, not from today's instrument classification.

## Membership and class are separate gates

LISTED_MEMBER
does not automatically mean:
D01_ELIGIBLE_ORDINARY_COMMON_EQUITY.

R1 must distinguish:

MARKET_MEMBERSHIP_STATE
- whether the security belongs to the historical exchange/listing universe.

SECURITY_CLASS_STATE
- what instrument/share class the listed object was at that time.

D01 eligibility requires both.

## Canonical class states

ORDINARY_COMMON_EQUITY
PREFERRED_EQUITY
FUND_OR_ETF
ETN_OR_NOTE
WARRANT_OR_RIGHT
DEPOSITARY_OR_LINKED_INSTRUMENT
OTHER_EQUITY_CLASS
SECURITY_CLASS_UNKNOWN

The exact owner taxonomy may be richer.
D01 consumes owner-certified classification and maps it to these research states without replacing the source taxonomy.

## First-wave eligibility

Eligible:
ORDINARY_COMMON_EQUITY.

Not eligible by design:
PREFERRED_EQUITY;
FUND_OR_ETF;
ETN_OR_NOTE;
WARRANT_OR_RIGHT;
DEPOSITARY_OR_LINKED_INSTRUMENT;
OTHER_EQUITY_CLASS unless separately preregistered.

Unknown:
SECURITY_CLASS_UNKNOWN -> DATA_BLOCKED / class eligibility unresolved.

## Point-in-time class receipt

Required fields:
- classReceiptId;
- classReceiptVersion;
- securityIdentity;
- membershipIntervalId;
- market;
- symbol;
- sourceSecurityType;
- normalizedSecurityClass;
- classEffectiveFrom;
- classEffectiveToExclusive;
- firstObservableAt;
- sourceId;
- sourceVersion;
- sourceHash;
- coverageCompleteForDate;
- replaySafe.

## Current-class backfill firewall

A present-day security master may describe the current class.

It may not be projected backward to certify the historical class unless:
- owner evidence proves no class transition occurred across the entire requested historical interval;
- coverage is complete for that interval.

CURRENT_CLASS == ORDINARY_COMMON
does not imply:
HISTORICAL_CLASS_ALWAYS_ORDINARY_COMMON.

## Class transition

If the same security identity changes research-eligibility class:
- preserve security identity if owner-certified;
- create a classEligibilityBoundary;
- do not silently carry an eligible D01 episode through an ineligible interval;
- research opportunity eligibility ends at the boundary;
- a later eligible interval must satisfy fresh same-security historical eligibility/warmup semantics.

Security continuity and research-universe eligibility are separate concepts.

## Unknown class

If market membership is known but historical class is unknown:
CLASS_UNKNOWN_BLOCKED.

Do not:
- infer ordinary common from numeric symbol shape;
- infer from current class;
- infer from company name;
- infer from price behavior.

## Pure name/code changes

A proven pure rename or same-security code change does not change security class by itself.

Class state changes only from owner-certified class evidence.

## Current decision

LISTED_EQUALS_D01_ELIGIBLE = FALSE.
CURRENT_SECURITY_CLASS_MAY_BACKFILL_HISTORY = FALSE.
UNKNOWN_CLASS_MAY_DEFAULT_TO_COMMON = FALSE.
SAME_SECURITY_CLASS_CHANGE_CAN_CREATE_RESEARCH_ELIGIBILITY_BOUNDARY = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
