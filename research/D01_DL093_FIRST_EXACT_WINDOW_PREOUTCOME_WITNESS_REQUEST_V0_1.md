# D01 DL-093 — First Exact-Window Pre-Outcome Witness Request V0.1

Updated: 2026-10-07 Asia/Taipei
Status: PREOUTCOME_WITNESS_FROZEN / SOURCE_BINDING_PENDING / FORMAL_CORE_LOCKED

## Purpose

Freeze one real TWSE historical symbol/date/window request for DL-091 R1-R6 physical provenance before any future-return outcome is opened.

The witness is for interface composability only.
It does not need to contain a successful Pattern.
It does not authorize OOS inference, strategy selection, ranking, push, capital, or orders.

## Frozen witness identity

- market: TWSE
- symbol: 1101
- targetDate: 2021-06-15
- interfaceCutoffAt: 2021-06-15T23:59:59+08:00
- requiredHistory: exact 60 prior eligible symbol-sessions plus targetDate
- priceSpace: RAW_EXECUTION for source identity; TECHNICAL_CONTINUITY only if separately certified
- outcomeJoin: CLOSED

## Why this witness was selected

Selection is source-composability-driven, not performance-driven.

1. TWSE 2021 is already physically accepted for raw A1 data coverage.
2. The canonical 2021 TWSE historical universe is PASS_OFFICIAL_CURRENT_NEWLISTING_DELISTING_UNION.
3. The existing D01 price-limit source contract had already frozen 2021-06-15 as one of its historical TWT84U witness dates before DL-093.
4. 1101 is a long-standing ordinary TWSE stock and is repeatedly used in current exact-session engineering only as a source/history witness, not as a presumed winning Pattern name.
5. No D1/D5/D20 return, MFE, MAE, Pattern success, later price path, or strategy outcome was used to choose this symbol/date.

This witness must not be replaced merely because later R3-R6 evidence makes it inconvenient.

If the exact window contains a real corporate action, suspension, disposition, or other non-ordinary state:
- retain the witness;
- classify the real state;
- do not search for a cleaner target after observing the state;
- a second witness, if ever needed, must be frozen by a new deterministic pre-outcome rule.

## Exact-window rule

Do not hard-code a calendar start date.

The data owner must derive the ordered date set from:
- official TWSE sessions;
- point-in-time 1101 membership;
- certified symbol-session lifecycle boundaries.

The returned bundle must contain:
- targetDate;
- exactly 60 prior eligible symbol-session dates if available;
- ordered 61-date set including targetDate;
- expectedSessionHash;
- observedSessionHash;
- exact source/revision identity for every admitted A1 row.

Older observations may not substitute for one missing required recent eligible session.

## R1 request — point-in-time membership

Owner:
System2 historical-universe source.

Return:
- registryId;
- registryHash;
- security identity;
- membershipStart;
- membershipEndExclusive;
- membershipState for every window boundary;
- replayEligible;
- futureDelistingHidden=true;
- listingAgeEligibleSessions.

Acceptance:
1101 must be IN_SCOPE across the exact required window, or the witness fails closed.

## R2 request — canonical raw A1

Owner:
System2 DATA_LANE.

Current year-level evidence:
2021 TWSE raw A1 data coverage PASS.

Return for exact 61-session window:
- ordered marketDate;
- sourceId;
- sourceRowHash;
- canonicalBarHash;
- availableAt;
- availabilityBasis;
- open/high/low/close/volume;
- observationState;
- revision identity;
- rawHistoryAdmissionReceiptId;
- sourceHistoryHash.

Acceptance:
all required price observations must be admitted under the exact expected-session set.
No older-row substitution.

## R3 request — symbol-session lifecycle

Owner:
System2 DATA/BUILD lifecycle source.

Return:
- officialMarketSession;
- symbolExpectedToTrade;
- lifecycleState;
- normalized listing/stop/resume/delisting/share-conversion/migration events;
- source family and hash;
- coverageCompleteForSymbolDate;
- unresolvedMissingSessions;
- unresolvedBoundaryConflicts.

Acceptance:
exact date set must be deterministically classified.
Source absence alone cannot become NORMAL_ELIGIBLE_SESSION.

## R4 request — corporate-action continuity

Owner:
Corporate Actions / System2 continuity archive.

For the first TWSE witness, reuse the existing narrowed source family:
- TWSE ex-right/ex-dividend historical actual-result range;
- TWSE capital-reduction historical actual-result range;
- TWSE par-value-change historical actual-result range;
- TWSE suspension/session lifecycle;
- PIT universe membership.

Return:
- eventCoverageComplete;
- noEventMayBeClaimed;
- revisionCoverageComplete;
- event-version reconciliation result;
- symbol classification;
- continuityReceiptId;
- continuityTransformHash;
- receiptHash.

Allowed dispositions:
- CLEAR_NO_ACTION_ELIGIBLE;
- ADJUSTED_CONTINUITY_REQUIRED;
- CONTINUITY_UNKNOWN.

D01 does not self-promote any of these to production authority.

## R5 request — legal price-limit / reference state

Owner:
D05 / official exchange source.

Pre-existing owner source contract:
TWSE TWT84U is historically date-queryable and 2021-06-15 was already a frozen historical witness date.

Official target-date factual row observed for 1101:
- upperLimitPrice = 56.50;
- openingAuctionReferencePrice = 51.40;
- lowerLimitPrice = 46.30;
- previous reference price = 51.50;
- previous close = 51.40;
- most recent prior trade date reported = 2021-06-11.

These factual fields prove source feasibility only.

Still required for DL-091 R5:
- ruleVersion;
- exemption/no-limit state;
- firstObservableAt/knownAt compatible with interfaceCutoffAt;
- source/version/hash or archived raw receipt;
- replaySafe classification.

Historical page reconstruction without a bound first-known/provenance receipt does not by itself complete R5.

## R6 request — disposition / matching regime

Owner:
D05 market-integrity / exchange-microstructure source.

Pre-existing source feasibility:
- official TWSE Disposition database provides historical date-range queries from January 2001;
- CSV export exists;
- public page is updated daily;
- disposition records carry period/measures and can specify altered periodic matching.

For this exact witness, return:
- complete query range covering the exact 61-session window;
- securityCode=1101;
- all disposition rows whose effective period intersects the window;
- disposition state by symbol-session;
- matchingCadenceSeconds when disposition applies;
- changedTradingMethodFlag;
- prepayment/margin restrictions;
- source URL/hash;
- firstKnownAt;
- coverageCompleteForSymbolDate.

If no disposition row is returned, CERTIFIED_NORMAL_MATCHING is legal only after the query/source coverage itself is complete and any separate changed-trading-method dependency is resolved.

No-match != normal by default.

## R7 generation rule

D01 may generate R7 only after R1-R6 are exact-window bound.

R7 must include:
- moduleId;
- featureVersion;
- requiredSourceBarIds;
- predictor/interface cutoff;
- informationRoot;
- redundancyGroup;
- deterministicFeatureHash;
- firstObservableAt;
- replaySafe.

The witness does not need to emit a Pattern.
A deterministic NO_STRUCTURE result is acceptable after upstream provenance passes.

## Anti-selection-bias rules

- Do not inspect future returns before the R1-R7 bundle is frozen.
- Do not replace the witness because it is blocked or non-ordinary.
- Do not choose another date because its Pattern is stronger.
- Do not choose another symbol because its data are cleaner after inspecting this witness.
- Do not convert UNKNOWN to NO_EVENT/NORMAL.
- Do not use 2024 final holdout for interface debugging while this training-period witness exists.

## Current disposition

WITNESS_IDENTITY_FROZEN = TRUE.
EXACT_DATE_SET_DERIVATION = PENDING_OWNER_RECEIPT.
R1_R6_PHYSICAL_BUNDLE = PENDING.
R7_GENERATION = BLOCKED_ON_R1_R6.
OUTCOME_JOIN = CLOSED.
L4_PROMOTION = NONE.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Audit current repository/source evidence against R1-R6 for 1101 / 2021-06-15.
2. Credit only exact-window physically bound evidence.
3. Produce a missing-receipt delta list.
4. If R1-R6 all pass, generate R7 without opening outcomes.
5. If any mandatory family remains UNKNOWN, preserve WITNESS_BLOCKED and route the exact missing receipt to its existing owner.
