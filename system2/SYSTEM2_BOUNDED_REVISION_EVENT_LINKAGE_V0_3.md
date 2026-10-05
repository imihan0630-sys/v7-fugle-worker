# System 2 Bounded Revision Event-to-Version Linkage V0.3

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / AMBIGUOUS-EVENT NARROWING
System 1 Formal Core: LOCKED
Lane: BUILD_LANE

## Purpose

Continue from the physical V0.2 result (23 events, 6 bounded revision chains observed, 17 ambiguous) without resetting the evidence state.

V0.3 targets only the 17 unresolved events and adds two gates before any linkage claim:
1. per-symbol bounded query-integrity by exact company-history vs month-shard keyset reconciliation over a 400-day pre-effective window;
2. event-specific anchoring using issuer scope + action family + an explicit effective-date token in the issuer disclosure.

Normalized subject text is only used after those gates to organize rows. It is never sufficient by itself to prove that two disclosures belong to the same corporate-action episode.

## Safety boundary

V0.3 must not claim:
- revision completeness;
- NO_EVENT;
- exact knownAt;
- cancellation completeness;
- technical continuity;
- session completeness;
- trading authority.

A missing cancellation row is not negative proof of no cancellation.

## Anti-false-merge rule

Rows from a subsidiary disclosure are excluded from an issuer-level event anchor. Similar normalized titles from different corporate-action episodes remain separate unless an explicit event-specific anchor is present. Promotion linkage evidence must retain the event key, issuer, family, effective date and query-integrity receipt.

## Continuation after V0.3

Any events still unresolved proceed to event-specific authority-side disambiguation and cancellation/no-cancellation evidence. After that, S2-07 proceeds to shared suspension/resumption + symbol-session integration, then RAW A1 lineage.
