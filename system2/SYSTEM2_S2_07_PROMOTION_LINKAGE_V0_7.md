# System 2 S2-07 Promotion Linkage V0.7

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / BUILD_LANE / PHYSICAL_EXECUTION_PENDING
Formal Core: LOCKED
Trading authority: NONE

## Purpose

Promote only the **event-linkage evidence grade** of bounded S2-07 corporate-action candidates when the evidence is strong enough. This is not strategy promotion and not trading authority.

V0.7 evaluates all 17 frozen V0.5 events. The four V0.6 source-divergence events remain eligible only if their current action-family query integrity is exact; otherwise they fail closed.

## Promotion requirements

A row is `PROMOTION_EVIDENCE_READY_BOUNDED` only when all are true:

1. official transport is ready and no pagination risk is observed;
2. issuer + target action-family year/month keysets reconcile exactly;
3. V0.5 event-specific anchor candidate exists;
4. official event identity is explicit and internally consistent:
   sourceId + symbol + effectiveDate + `S2-CA-EVENT:<hash>`;
5. official detail supplies dated chronology not after the effective date;
6. the semantic episode is non-empty;
7. CAPITAL_REDUCTION has subtype-aligned semantic seed evidence;
8. PAR_VALUE_CHANGE has a non-empty aligned episode under exact query integrity;
9. every observed correction row remains inside the aligned semantic episode;
10. no cancellation disclosure is observed inside the candidate episode.

Normalized subject stem is not a promotion criterion.

## Cancellation boundary

No cancellation disclosure observed remains:
`CANCELLATION_DISCLOSURE_NOT_OBSERVED_HISTORY_INCOMPLETE`.

V0.7 never converts absence into NO_CANCELLATION.

## Meaning of promotion

`promotionLinkageEstablished=true` means only that the bounded official-event-to-issuer-history linkage meets this V0.7 evidence contract.

It does not establish:
- event-linkage coverage completeness across the market;
- bounded revision-history completeness;
- correction-history completeness;
- cancellation-history completeness;
- exact knownAt;
- revision coverage completeness;
- technical continuity;
- symbol-session completeness;
- strategy authority;
- final/live selection authority;
- notification/order/capital authority.

## Physical execution acceptance

The readonly workflow must run on latest main and report:
- all 17 frozen events;
- ready/blocked counts;
- blocker decomposition;
- cancellation observed count;
- noCancellationCertifiedCount=0;
- all completeness / knownAt / continuity / trading flags remain false.

The expected research hypothesis from V0.5/V0.6 is that the 13 exact candidates may satisfy the bounded promotion-evidence contract while the four source-divergence cases remain blocked. This is a hypothesis to test, not an assertion.
