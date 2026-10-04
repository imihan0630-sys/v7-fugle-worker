# AOKD-05 Owner Scope Reconciliation 2026-10-04 V0.1

Status: OWNER_SCOPE_RECONCILED / NO_NEW_MODULE / DATA_GATE_REMAINS
Scope: AOKD-05 economically material longitudinal disclosure-change / filing-delta information
Formal Core impact: NONE
Curriculum impact: NONE
Owner reassignment: NONE

## Decision

AOKD-05 does **not** currently justify a new curriculum module or a new standalone economic owner.

The candidate is a cross-module derived research lane. Its economic meaning must be routed to the existing D07 content owner that corresponds to the changed disclosure, while the document clock, text-comparison method and behavioral interpretation remain separate dependencies.

This is not a claim that AOKD-05 has stock-selection alpha. Taiwan historical corpus feasibility, replayability and incremental ranking value remain unproven.

## Ownership decomposition

### D07-08 — filing/document vintage and first-known clock

D07-08 owns PIT availability semantics for issuer financial/disclosure vintages:
- firstObservedAt / public-known boundary where proven;
- immutable source/document vintage identity;
- correction/restatement/version lineage;
- fail-closed treatment when exact company publication time is unavailable.

D07-08 does **not** own the economic meaning of a changed paragraph.

### D07 economic-content owners — producer layer

A filing delta must be attributed by economic content rather than by text distance alone.

Examples:
- D07-12 Business Model / Revenue Engine: business-model or revenue-engine disclosure change.
- D07-13 Competitive Advantage / Moat: competitive-position disclosure change.
- D07-15 Customer / Product / Geography Concentration: concentration and mix disclosure change.
- D07-16 Product Lifecycle / TAM / Penetration: product-cycle / market-size / penetration disclosure change.
- D07-17 Management Guidance Quality: management outlook / guidance disclosure change.
- D07-24 Revenue Recognition / Accounting Policy Quality: accounting-policy / revenue-recognition disclosure change.
- D07-25 Forensic Accounting Red Flags: cross-signal forensic anomaly context only; it consumes accounting primitives and must not duplicate their vote.

Other D07 modules remain owners when the changed disclosure maps to their already-defined accounting or operating semantics.

Therefore there is no single generic "filing text" economic owner inside D07.

### D16-22 — text-method validation only

D16-22 owns:
- longitudinal text comparison method;
- OCR/language/template contamination tests;
- model/prompt/version reproducibility;
- leakage and data-contamination controls;
- semantic-delta feature validation.

D16-22 is not an economic alpha owner. Cosine distance, embeddings, LLM labels, sentiment and paragraph-diff magnitude are representations of the same source content, not independent votes.

### D20-07 / D20-08 — behavioral consumer / moderator only

D20-07 may test whether salience/attention moderates processing of a disclosure delta.
D20-08 may test underreaction / post-event drift after a valid D07-produced disclosure event.

These are child interpretations. They cannot re-count the same disclosure as separate independent evidence.

### D17 dependency

When the disclosure is also a dated corporate/news event, D17 event-clock / information-transmission receipts may be consumed. D17 does not replace the D07 economic producer for issuer disclosure content.

## Anti-double-count firewall

One underlying issuer disclosure change may produce multiple descriptive fields, but only one economic-source family.

Rejected independent-vote pattern:
- document distance score;
- sentiment score;
- risk-paragraph count;
- forensic flag;
- attention flag;
- drift flag;

all counted as six confirmations from the same filing.

Required pattern:
1. one immutable issuer-document vintage;
2. one content-owner interpretation per economic concept;
3. optional D20/D17 moderators linked as dependent child receipts;
4. D16 validation metadata attached to the same source event.

## Scope conclusion

AOKD-05 classification is narrowed from an unresolved generic SCOPE_EXTENSION_CANDIDATE to:

**EXISTING_MULTI_OWNER_SCOPE / DERIVED_DISCLOSURE_DELTA_LANE / DATA_FEASIBILITY_REQUIRED**

No ADD_MODULE, owner reassignment, maturity promotion or COV ID is authorized.

The only plausible future curriculum change would be a narrow scope clarification if a real corpus reveals an economic disclosure family that cannot be routed to an existing D07 content owner. That decision is not supported today.

## Remaining data gate

Before any specialist alpha/incrementality test, Taiwan corpus feasibility must establish:
- original raw document bytes or cryptographic hash;
- issuer/security/entity as-of mapping;
- fiscal/reporting period;
- source URL/source identity;
- publicKnownAt if provable, otherwise firstObservedAt upper bound;
- captureAt;
- version/revision/correction chain;
- delisted/inactive issuer coverage;
- missing-document denominator;
- language/OCR/template/schema flags;
- section-level comparability across vintages;
- immutable replay path.

Legal filing deadline, fiscal year or current corrected PDF must never be substituted for historical first-known availability.

## Exact next action

Execute `shared-knowledge/AOKD05_CORPUS_FEASIBILITY_CONTRACT_20261004_V0_1.md` in the D07 owner room.

Until that receipt passes:
- AOKD-05 remains NOT_SPECIALIST_READY;
- no historical Shadow reconstruction;
- no new broad external sweep;
- no Formal/Core/System1/System2 behavior change.
