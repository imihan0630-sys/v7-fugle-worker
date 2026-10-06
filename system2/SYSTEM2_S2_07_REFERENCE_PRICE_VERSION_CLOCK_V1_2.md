# System 2 S2-07 Reference-Price Version Clock V1.2

Updated: 2026-10-07 Asia/Taipei  
Status: RESEARCH_ONLY / BUILD_LANE / PHYSICAL_EXECUTION_PENDING  
Scope: 4806 / TPEX / CAPITAL_REDUCTION only  
Formal Core: LOCKED  
Trading authority: NONE

## Purpose

V1.1 physically proved the bounded mechanical price bridge for 4806 but remained PIT-blocked because the official TPEx historical reference-price event has no certified historical knowledge clock.

V1.2 asks one narrower question:

> Does an independently timestamped historical official disclosure row prove that the exact official reference-price pair (10.4 pre-action close and 14.87 resume reference price) was available at a specific historical source-reported time?

Event identity, schedule chronology, or a current retrieval timestamp are not enough.

## Evidence classes

Historical MOPS rows are classified as:

- EVENT_IDENTITY_ONLY
- SCHEDULE_EVIDENCE
- REFERENCE_PRICE_EVIDENCE
- REFERENCE_PAIR_EVIDENCE

A row is a reference-pair timestamp candidate only when the same source-reported row contains symbol 4806, capital-reduction context, explicit reference-price context, exact reference price 14.87, close context, exact pre-action close 10.4, and a valid MOPS date/time.

## Anti-backdating firewall

V1.2 never promotes a timestamp automatically.

Even if an exact timestamped reference-pair row is observed, V1.2 returns only:

`REFERENCE_PAIR_TIMESTAMP_CANDIDATE_OBSERVED_REVIEW_REQUIRED`

and keeps:

- historicalAvailabilityProven=false
- knownAtVersionClockCertified=false
- firstKnownAt=null
- availableAt=null
- pitEventReplayEligible=false
- pitTechnicalContinuityReplayEligible=false

A separate revision/supersession and source-timestamp verification gate would be required before any `VERIFIED_SOURCE_TIMESTAMP` promotion.

If no exact timestamped pair is observed, state is:

`REFERENCE_PRICE_VERSION_CLOCK_NOT_PROVEN`

## Physical probe

`system2/scripts/probe_s2_07_reference_price_clock_readonly_v1_2.mjs`

The probe:

1. reads the durable V1.1 physical receipt;
2. queries 4806 MOPS historical material-information rows for ROC 115 annual + monthly views through October;
3. requires annual/month keyset reconciliation for the inspected interval;
4. evaluates full source-reported row text against the frozen 10.4 / 14.87 pair;
5. prints classified rows and the fail-closed result;
6. writes nothing and grants no strategy/trading authority.

## Protected boundaries

V1.2 does not modify official V1.1 bridge geometry, RAW A1 bars, adjusted history, event archive knowledge timestamps, S2-07 candidate authority, strategy/ranking/capacity, push/notification, capital/orders, or System1 Formal Core.
