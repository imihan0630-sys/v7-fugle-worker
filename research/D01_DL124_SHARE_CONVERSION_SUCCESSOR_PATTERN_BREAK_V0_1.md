# D01 DL-124 — Share-Conversion / Successor-Security Pattern Break Contract V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / SUCCESSOR_PATTERN_BREAK_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Prevent predecessor and successor securities from being represented as one continuous D01 pattern merely because exchange rules publish a successor reference price derived from the predecessor close and exchange ratio.

## Identity break

For:
- share conversion into a newly established company;
- share exchange into another existing company;
- merger into a different surviving security;
- demerger into one or more successor securities;
- delisting followed by successor listing;

the predecessor security episode ends at the certified identity boundary.

The successor begins a new security identity and new D01 episode namespace.

## Prohibited inheritance

A successor security may not inherit the predecessor:
- episodeId;
- opportunityId;
- sourceHistoryHash;
- exactSessionHash;
- requiredSourceBarIds;
- firstObservableAt;
- confirmedAt;
- redundancyGroup;
- deterministicFeatureHash.

A relation may be stored as:
predecessorEventContextId / successorEventContextId
for event linkage only.

## Reference-price distinction

A successor initial listing reference can be based on predecessor close and conversion ratio.

That does not make the successor bar:
- a continuation bar of the predecessor;
- a same-security close-to-close return;
- the next bar of a cup/base/sequence;
- an ordinary gap over the predecessor close.

## D01 module implications

D01-02:
successor first bar is evaluated only inside successor identity.

D01-03:
multi-candle sequences cannot cross predecessor/successor identity.

D01-07:
cup/base/handle lifecycle terminates on predecessor identity break.
A successor may form a new base but cannot inherit predecessor anchors.

D01-09:
predecessor-close to successor-open distance is classified:
IDENTITY_TRANSITION_REFERENCE_DISTANCE
not an ordinary same-security gap.

## Multi-successor transitions

When one predecessor maps to multiple successor securities:
- no successor inherits the predecessor episode;
- each successor begins an independent security lineage;
- all remain linked to the same corporate-action event dependency cluster.

No event-linked successor count may be interpreted as multiple independent confirmations of the predecessor pattern.

## Cash / fractional / mixed consideration

If shareholder payoff also includes:
- cash;
- fractional settlement;
- rights;
- multiple securities;

D01 does not construct an economic-return transform.

That belongs outside the D01 price-pattern object.

## Current decision

SUCCESSOR_SECURITY_STARTS_NEW_D01_IDENTITY = TRUE.
PREDECESSOR_EPISODE_TERMINATES_AT_IDENTITY_BREAK = TRUE.
SUCCESSOR_REFERENCE_PRICE_CREATES_PATTERN_CONTINUITY = FALSE.
CROSS_IDENTITY_DISTANCE_IS_ORDINARY_GAP = FALSE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
