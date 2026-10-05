# System 2 Bounded Revision-History Census — Low-Volume Lanes V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / BOUNDED EVENT-UNIVERSE CENSUS
System 1 Formal Core: LOCKED

## Purpose

Begin bounded revision-history completeness work after representative-routing research was formally dispositioned at 5/6.

Representative controls answer:
"Can this authority/revision mechanism be physically observed?"

They do not answer:
"Did the exact bounded event universe receive complete issuer revision-history coverage?"

This census starts answering the second question without conflating it with exact knownAt.

## Frozen interval

2026-04-05 through 2026-10-02.

## First census scope

The four low-volume final-result lanes:

- TWSE capital reduction;
- TWSE par-value change;
- TPEx capital reduction;
- TPEx par-value change.

The already-verified final-result event counts for this interval are expected to total 23:
- TWSE capital reduction = 9;
- TWSE par-value change = 1;
- TPEx capital reduction = 9;
- TPEx par-value change = 4.

The two high-volume ex-right/dividend lanes are deliberately deferred until the census semantics are physically validated.

## Issuer-history observation window

For each unique symbol in the bounded event universe:
- query MOPSOV company-year history for 2025 and 2026 using `month=all`;
- retain only source rows dated on/before 2026-10-02;
- classify strict action-family rows;
- preserve correction/cancellation hints and source-reported version identity.

2025 is included because a 2026 effective corporate action may have been announced before the effective year.

## Census dimensions

For every final-result event preserve:

- source lane;
- symbol;
- exact official effective date;
- official event version id;
- issuer query years;
- issuer transport readiness;
- action-family issuer-row count;
- pre/on-effective issuer-row count;
- correction-hint row count;
- cancellation-hint row count;
- observability state.

The receipt freezes an `eventUniverseHash` over the exact final-result event set.

## What a positive census means

The census may establish:

- bounded event universe frozen;
- issuer-history transport assessed;
- issuer-family history observability measured;
- pre-effective issuer evidence measured.

It does **not** yet establish:

- exhaustive correction history;
- exhaustive cancellation history;
- exact public availability;
- exact knownAt;
- bounded revision-history completeness;
- authorityRevisionCoverageComplete;
- revisionCoverageComplete.

A MOPS row can be a source-reported historical version without being exact PIT `availableAt`.

## Next gate

After physical census:
1. inspect uncovered/ambiguous final events;
2. add per-symbol query-integrity checks only where needed;
3. define exact event-to-issuer-version linkage and no-revision evidence semantics;
4. promote bounded revision-history completeness lane-by-lane only with complete evidence;
5. then shard the two high-volume ex-right/dividend lanes.

No data mutation, strategy evaluation, push, capital, order or System1 runtime is authorized.

## 2026-10-05 physical low-volume census acceptance

PR #610 merged as `7e8a7415064bb1f1c5d23c3b1bbd6570c1df8274`.

Physical checks:
- Bounded Revision History Census Low Volume Readonly `37281410197`: PASS.
- System2 Research CI `37281410209`: PASS.
- V8 Regression `37281410123`: PASS.

Frozen interval:
2026-04-05..2026-10-02.

Exact bounded event universe:
- finalEventCount=23;
- uniqueSymbolCount=23;
- eventUniverseHash=`3e31779c36582bd70378d4b393ce0d4b2510bb84fe557686a0e51d3a2f604049`.

Issuer-history observability:
- issuerTransportReadyEventCount=23/23;
- issuerFamilyObservedEventCount=23/23;
- preEffectiveIssuerEvidenceEventCount=23/23;
- `issuerTransportCoverageComplete=true`;
- `issuerFamilyObservabilityCoverageComplete=true`;
- `preEffectiveIssuerEvidenceCoverageComplete=true`.

Lane results:
- TWSE capital reduction: 9/9 observable; 6/9 events have correction/revision hints; 0 cancellation hints.
- TWSE par-value change: 1/1 observable; 0 revision hints; 0 cancellation hints.
- TPEx capital reduction: 9/9 observable; 6/9 events have correction/revision hints; 0 cancellation hints.
- TPEx par-value change: 4/4 observable; 0 revision hints; 0 cancellation hints.

This is the first full bounded event-universe census for these four low-volume lanes.

It still does not promote:
- `boundedRevisionHistoryCoverageComplete`;
- `correctionHistoryComplete`;
- `cancellationHistoryComplete`;
- exact public knownAt;
- `authorityRevisionCoverageComplete`;
- `revisionCoverageComplete`.

Next: classify event-to-version chains and verify no-revision/cancellation semantics with per-symbol query-integrity evidence before any lane-level completeness promotion.
