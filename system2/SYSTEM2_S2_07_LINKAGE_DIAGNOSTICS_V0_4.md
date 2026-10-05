# System 2 S2-07 Linkage Diagnostics V0.4

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / DIAGNOSTIC
Lane: BUILD_LANE
System 1 Formal Core: LOCKED

## Purpose

Continue directly from V0.3 physical evidence:
- 10/17 ambiguous events have exact bounded company-history vs month-shard keyset reconciliation;
- 7/17 fail query-integrity reconciliation;
- 0/17 have an issuer-title effective-date anchor.

V0.4 is diagnostic only. It does two things:
1. for the seven fail-closed query-integrity events, expose the exact year-only / month-only version keys and row text instead of collapsing the mismatch into a count;
2. for all 17 events, preserve official-event subtype/detail/reference-price facts and classify bounded issuer disclosures into chronology/stage buckets such as exchange plan, registration, base date, creditor notice and corporate decision.

## Event-specific linkage rule

No promotion linkage is established by this diagnostic.

Normalized subject text is never a sufficient episode key. Future linkage must combine explicit event identity with stronger evidence such as official event subtype/detail, issuer-scope filtering, corporate-action stage chronology, source version identity and authority-side evidence.

## Safety boundary

All completeness, NO_EVENT, exact knownAt, cancellation completeness, technical continuity, session completeness and trading authority remain false.
