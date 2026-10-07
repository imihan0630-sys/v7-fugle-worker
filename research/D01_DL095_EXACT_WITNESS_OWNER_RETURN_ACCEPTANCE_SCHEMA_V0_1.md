# D01 DL-095 — Exact-Witness Owner Return Acceptance Schema V0.1

Updated: 2026-10-07 Asia/Taipei
Status: PREOUTCOME_ACCEPTANCE_SCHEMA_FROZEN / FAIL_CLOSED / FORMAL_CORE_LOCKED

## Purpose

Freeze one canonical owner-return envelope for the DL-093 witness:
TWSE / 1101 / 2021-06-15 / exact 60 prior eligible symbol-sessions plus target date.

The schema prevents source owners from returning individually plausible receipts that do not refer to the same symbol, date set, revision generation, decision cutoff, or source-history identity.

D01 does not redefine the source taxonomies. It consumes owner-certified evidence under this common binding contract.

## Witness identity

Every owner return must bind:
- witnessRequestId;
- market = TWSE;
- symbol = 1101;
- targetDate = 2021-06-15;
- interfaceCutoffAt = 2021-06-15T23:59:59+08:00;
- receiptObservedAt;
- ownerId;
- ownerReceiptId;
- ownerReceiptVersion;
- sourceMainSha;
- outcomeFieldsPresent = false.

Any identity drift:
OWNER_RETURN_WITNESS_MISMATCH.

## Exact symbol-session window binding

Canonical date-set identity must include:
- orderedExpectedSessionDates;
- orderedObservedSessionDates;
- expectedSessionCount = 61;
- observedSessionCount = 61;
- expectedSessionHash;
- observedSessionHash;
- unresolvedMissingSessions = 0;
- unresolvedUnexpectedSessions = 0;
- symbolSessionContractVersion;
- sessionCalendarVersion.

Required:
ordered expected dates == ordered observed dates.

A count of 61 is insufficient if one required recent session is missing and an older date substitutes for it.

## Shared history identity

Reuse System2/D03 continuity lineage:
- rawHistoryAdmissionReceiptId;
- sourceHistoryHash;
- continuityReceiptId;
- continuityTransformHash;
- continuityEngineVersion;
- corporateActionRegistryVersion;
- ordered source-bar identities;
- per-row sourceRowHash;
- per-row availableAt/revision identity.

sourceHistoryHash must be a canonical hash over the actual ordered raw window consumed by D01.

It must not be a label supplied independently of the selected rows.

## Evidence clock rule

For every predictor/context receipt:
firstObservableAt <= interfaceCutoffAt.

A later observation can be retained as diagnostic evidence but cannot be backdated into the witness state.

Post-cutoff evidence result:
LATE_EVIDENCE_NOT_PIT_ELIGIBLE.

## R1 membership acceptance

Required:
- registryId/hash;
- membership state IN_SCOPE for every required session/boundary;
- replayEligible=true;
- futureDelistingHidden=true;
- security identity stable or explicitly versioned.

Fail closed on:
- unknown membership boundary;
- current-list backfill;
- future delisting leakage;
- security identity ambiguity.

## R2 raw A1 acceptance

Required:
- 61 exact admitted rows;
- observationState=VALID_OHLC for every price-dependent row;
- sourceRowHash per row;
- canonicalBarHash per row;
- exact availability/revision identity;
- sourceHistoryHash;
- no duplicate date;
- no expected-date omission.

No row may be forward-filled or synthesized.

## R3 lifecycle acceptance

Required:
- coverageCompleteForWindow=true;
- unresolvedMissingSessions=0;
- unresolvedBoundaryConflicts=0;
- all relevant listing/stop/resume/delisting/share-conversion/migration states normalized;
- exact source families and hashes.

A source lookup returning zero events is not sufficient unless source coverage and empty-range semantics are independently certified.

## R4 corporate-action continuity acceptance

Required for a CLEAR_NO_ACTION_ELIGIBLE return:
- eventCoverageComplete=true;
- noEventMayBeClaimed=true;
- suspensionCoverageComplete=true;
- symbolSessionCompletenessEvidenceReady=true;
- symbolClassification=NO_EVENT;
- revisionCoverageComplete=true;
- ambiguityCount=0;
- continuityReceiptId;
- receiptHash;
- sourceHistoryHash matches R2 exact raw window;
- receipt decision cutoff is compatible with DL-093.

If an actual event is found:
- retain the witness;
- return ADJUSTED_CONTINUITY_REQUIRED or CONTINUITY_UNKNOWN;
- do not replace the witness;
- do not label raw history CLEAR_NO_ACTION.

## R5 price-limit/reference acceptance

Required target-date fields:
- openingAuctionReferencePrice;
- upperLimitPrice;
- lowerLimitPrice;
- ruleVersion;
- exemption/no-limit state;
- sourceId/version/hash;
- firstObservableAt;
- replaySafe=true.

Factual reconstructed values without source hash/clock remain PARTIAL.

The observed target-date values 56.50 / 51.40 / 46.30 are not themselves an admission certificate.

## R6 disposition/matching acceptance

Required exact-window query identity:
- requested start/end date equal the canonical 61-session range bounds;
- security code 1101;
- source coverage complete;
- source hash;
- publication/knownAt semantics;
- changed-trading-method state resolved.

If disposition applies:
- state=VERIFIED_DISPOSITION_MATCHING;
- matchingCadenceSeconds > 0;
- disposition period and measures preserved.

If no disposition applies:
- state=CERTIFIED_NORMAL_MATCHING is legal only if the official historical query coverage is complete, empty/non-match semantics are certified, and changed-trading-method state is resolved.

No-row alone is not a normal-state receipt.

## Zero-row source firewall

For any corporate-action, suspension, or disposition source:
zeroRows may support absence only if:
- requestedRangeMatchesExactly=true;
- paginationComplete=true;
- parserComplete=true;
- revisionCoverageComplete=true where applicable;
- emptyRangeSemanticsCertified=true;
- sourceCoverageComplete=true;
- sourceHash exists;
- evidence clock is PIT-valid.

Otherwise:
ZERO_ROWS_UNCERTIFIED_ABSENCE.

## Cross-receipt consistency

R1-R6 must agree on:
- market;
- symbol;
- target date;
- exact date-set/window identity;
- decision/interface cutoff;
- source-history generation where relevant.

If individually PASS receipts refer to different windows:
BUNDLE_CROSS_RECEIPT_IDENTITY_MISMATCH.

No majority vote can override this.

## R7 admission

D01 may generate R7 only when:
- R1-R6 all PASS under this schema;
- cross-receipt identity PASS;
- outcomeFieldsPresent=false;
- no post-cutoff predictor/context evidence was used.

R7 may validly output:
- NO_STRUCTURE;
- STRUCTURE_EMITTED;
- DATA_BLOCKED if its own deterministic feature requirements fail.

R7 does not need a positive signal.

## Current state

OWNER_RETURN_SCHEMA_FROZEN = TRUE.
PHYSICAL_R1_R6_RETURN = PENDING.
R7 = BLOCKED.
OUTCOME_JOIN = CLOSED.
L4_PROMOTION = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Use this schema as the DL-093 owner-return contract.
2. Search latest main for any newly materialized System2 1101 exact-window continuity receipt before requesting duplicate work.
3. If none exists, route the exact missing R1-R6 physical bundle to the canonical owners.
4. D01 must not implement System2 history, continuity, D05 price-limit, or D05 disposition source collectors itself.
5. Only after the physical bundle passes may D01 generate the first R7 composability witness.
