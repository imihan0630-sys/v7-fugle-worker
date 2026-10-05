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


## Physical execution freeze — run 37330025545


## 2026-10-05 S2-07 linkage diagnostics V0.4 physical result

Authoritative physical execution after transport retry + diagnostic-variable fix:
- merge commit: `664fc36ab2a35dfd7e930e1bd0d05f37d4bb3fdc`;
- workflow: `System2 S2-07 Linkage Diagnostics V0.4 Readonly`;
- run: `37330025545`;
- job: `111830481109`;
- conclusion: PASS;
- System2 Research CI run `37330025009`: PASS.

Physical summary:
- eventCount = 17;
- v03ExactCount = 10;
- discrepancyEventCount = 7;
- discrepancyOnlyAllTotal = 0;
- discrepancyOnlyMonthTotal = 9;
- officialSubtypePresentCount = 12;
- officialDetailPresentCount = 17;
- promotionLinkageEstablishedCount = 0.

Important diagnostic finding:
- the V0.3 whole-company year-vs-month mismatch is too broad to be treated as corporate-action history incompleteness;
- the 9 month-only rows include unrelated issuer-name-change notices and par-value recurring notice rows;
- symbol 3591 reconciled 40=40 on the V0.4 rerun although V0.3 had shown 40 vs 30, demonstrating that source-query snapshots can change across observation times;
- therefore the next query-integrity gate must reconcile issuer + target action-family rows, retain observation-time provenance, and fail closed for target-family discrepancies instead of treating unrelated company disclosures as blockers.

Official-event evidence is richer than title stems: all 17 have official detail, 12/17 have subtype, and the detail carries stop/resume dates or par-value conversion terms. These fields can support event-specific disambiguation together with issuer-scope action-family chronology; normalized subject stem remains insufficient by itself.

All completeness, NO_EVENT, exact-knownAt, cancellation-completeness, technical-continuity, session-completeness and trading-authority flags remain false.
