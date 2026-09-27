# FINANCIAL_SOURCE_COMPLETENESS — Scarcity / Readiness Research

Updated: 2026-09-27 Asia/Taipei  
Status: STRUCTURAL_FALSIFICATION / CLASS-A OBSERVER / OUTCOMES CLOSED  
Formal Core: LOCKED

## Scope

This lane is about the upstream Formal source-completeness gate, not the already-completed
`fundamentalScore` information-dynamics research.

Formal currently rejects when any of seven checks fails:

- quarterRevenue > 0;
- financialBasis truthy;
- revenueQoQ observed;
- revenueQuarterYoY observed;
- valuationObserved === true;
- priceBookRatio observed;
- announcementsVerified === true.

The seven booleans are **not seven independent data sources**.

## Scan-level versus per-symbol readiness

Before `scoreCandidate()` runs, `runAfterMarketScan()` requires the whole
FINANCIAL, VALUATION and ANNOUNCEMENTS quality snapshots to exist.

If any whole snapshot is missing, the scan aborts as DATA_INCOMPLETE.

Therefore scan-level snapshot absence must not be counted as a normal stock-level
FINANCIAL_SOURCE_COMPLETENESS reject.

Once all three snapshots exist, stock-level completeness is driven primarily by
same-generation symbol coverage.

## Four financial checks are one canonical producer bundle

Current `deriveQuarterlyFinancials()` emits a stock only after it can construct:

- latest quarter;
- previous quarter;
- same quarter last year.

Each reconstruction requires positive quarter revenue.

For every emitted canonical stock it then writes:

- positive `quarterRevenue`;
- non-empty descriptive `financialBasis`;
- numeric `revenueQoQ`;
- numeric `revenueQuarterYoY`.

Thus those four Formal checks are one source-membership / producer-integrity
bundle under the current canonical producer.

A row with `financialBasis` present but `revenueQoQ=null`, for example, is not
a normal independent failure mode of the current producer. It is an invariant
violation / legacy-or-alternate-lineage state that must be labeled separately.

## Two valuation checks are one canonical producer bundle

Current VALUATION validation rejects a source row with missing/negative PB.

Every emitted stock receives:

- `valuationObserved=true`;
- numeric `priceBookRatio`.

Therefore these two Formal checks collapse to one valuation-symbol
membership/integrity state on the canonical producer.

## Announcement verification is scan-global

Current ANNOUNCEMENTS validation returns `sourcesVerified=true` after successful
source validation.

The scan then assigns:

`announcementsVerified = announcements.sourcesVerified === true`

to **every market row**.

So on the current canonical validated path, `announcementsVerified` is not a
per-symbol completeness dimension. A stock with no announcement rows still has a
verified empty event set; the next Formal event-risk gate uses
`(officialAnnouncements || [])`.

This does not make event-risk evidence PIT-complete. It only describes the
current completeness-gate dependency.

## Correct scarcity denominator

Promotion-grade source scarcity needs:

1. the exact same-generation universe that truly reached this gate;
2. FINANCIAL symbol membership/integrity;
3. VALUATION symbol membership/integrity;
4. scan-global ANNOUNCEMENTS verification lineage;
5. GENERAL/THOUSAND pool;
6. immutable parent generation/fingerprint.

Global source counts such as >=1500 do not prove complete same-day market-symbol
coverage.

The new pure observer is:

`research/financial_source_completeness_readiness_observer_v0_1.mjs`.

It uses no outcomes, no market calls and changes no Formal decision.

## Observer-version guard

Future counts must use `formal_gate_overlap_observer_v0_2` semantics or an
equivalent strict-null implementation.

V0.1 can convert null/empty numeric values to zero and is not acceptable for new
empirical scarcity counts.

## Decision

`SEVEN_CHECKS_COLLAPSE_TO_TWO_PER_SYMBOL_SOURCE_BUNDLES_PLUS_ONE_SCAN_GLOBAL_ANNOUNCEMENT_STATE / GLOBAL_READY_NE_SYMBOL_COMPLETE / PROSPECTIVE_DENOMINATOR_WARRANTED / FORMAL_UNCHANGED`.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists.
