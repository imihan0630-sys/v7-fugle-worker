# Supply-Chain Lead-Lag Research

Updated: 2026-09-26 07:53 Asia/Taipei

Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED

## SC-001 / SC-002 — source and edge contract

Canonical edge types: CUSTOMER_OF, SUPPLIER_OF, RELATED_PARTY_TRADE, MAJOR_COUNTERPARTY_STOP, CONCENTRATION_ONLY, MANAGEMENT_CLAIM.

A named edge requires a source that names or unambiguously resolves both parties. CONCENTRATION_ONLY and generic supplier-management disclosures cannot synthesize a named edge. Every usable historical edge/event must carry sourcePublishedAt, knownAt, effectiveFrom, effectiveTo/expiry or revalidation state, source identity, confidence and identity-resolution status. Missing or unresolved evidence is UNKNOWN.

Taiwan PIT feasibility is PARTIAL. Timestamped material-information termination events and some periodic counterparty disclosures can support bounded edges/events; they do not provide a complete historical market-wide graph and cannot prove an original relationship start merely from a later termination disclosure.

## SC-003 — preregistered lag and falsification matrix

No outcome search is permitted until SC-004 provenance/coverage diagnostics pass.

### Event clock
- T0 = first market-actionable timestamp: first trading session whose decision timestamp occurs after knownAt.
- If knownAt is after the relevant market decision cutoff, T0 moves to the next eligible trading session.
- effectiveFrom may be later than knownAt; tests must separately identify information-arrival and economic-effective clocks.
- No event may be moved backward to relationship start unless a contemporaneous source proves that start.

### Frozen outcomes
- Security response: D1, D3, D5, D10 residual return.
- Path risk: D5/D10 MFE and MAE.
- Fundamental propagation, when PIT-eligible: next first-known monthly-revenue/fundamental update after T0.
- No alternative horizon is added after observing results; a new horizon is a new registered experiment.

### Directional hypotheses
1. CUSTOMER_SHOCK_TO_SUPPLIER: named customer adverse/positive event may propagate to verified supplier.
2. SUPPLIER_SHOCK_TO_CUSTOMER: verified supply/capacity disruption may propagate to customer.
3. MAJOR_COUNTERPARTY_STOP: >=10% relationship cessation may create direct firm-specific information shock.
4. PEER_COMMON_SHOCK: same-industry/theme movement without a verified bilateral edge is a control/common-factor case, not supply-chain propagation.

### Required controls / residualization order
1. broad market and market regime;
2. industry/sector return and sector breadth;
3. existing Residual RS / price-volume / K-line state;
4. own monthly revenue and fundamentalScore available at T0;
5. attention/event-risk state;
6. only then the supply-chain edge/event variable.

A candidate that loses incremental information after these controls is REDUNDANT, not a new factor.

### Negative controls
- same industry but no verified bilateral edge;
- relationship edge with no new event at T0;
- CONCENTRATION_ONLY records with no resolved counterparty;
- event dates shifted to a pre-knownAt placebo date are forbidden as evidence and may only be used to detect leakage;
- unrelated matched securities with similar liquidity/size/regime where feasible.

### Independent inference and clustering
- Primary independent unit = event date / first-known information date, not stock row.
- Cluster by event date; additionally report industry and source-family concentration.
- Multiple suppliers exposed to one customer event are one common shock cluster, not N independent discoveries.
- If direction is driven by one date, one industry, one major customer, one source family or one regime, label FRAGILE_* and do not generalize.

### Falsification
Reject or downgrade the lead-lag hypothesis when:
- edge identity is unresolved or only inferred from theme membership;
- effect begins before knownAt, indicating leakage/common anticipation;
- residual effect disappears after market/industry/PV/fundamental controls;
- negative-control peers show comparable effect;
- only one lag/horizon, date cluster, industry or famous AI/ABF chain works;
- relation was stale at T0;
- transaction costs erase any eventual tradable interpretation.

## SC-004 — minimal prospective schema and diagnostics

### SUPPLY_CHAIN_EDGE_VINTAGE
- edgeId
- sourceEntityId / sourceSymbol
- targetEntityId / targetSymbol
- edgeType
- direction
- relationshipMagnitudePct (nullable)
- magnitudeBasis (sales/purchases/other/UNKNOWN)
- sourcePublishedAt
- knownAt
- effectiveFrom
- effectiveTo
- lastRevalidatedAt
- sourceClass / sourceId / sourceUrl
- identityResolution = VERIFIED / PARTIAL / UNKNOWN
- confidence = HIGH / MEDIUM / LOW / UNKNOWN
- evidenceScope
- expiryReason
- capturedAt
- pointInTimeEligible

### SUPPLY_CHAIN_EVENT_LEDGER
- eventId
- edgeId
- eventType
- eventKnownAt
- eventEffectiveAt
- T0Session
- sourceId
- eventDirection = POSITIVE / NEGATIVE / MIXED / UNKNOWN
- eventMagnitude
- magnitudeUnit
- pointInTimeEligible
- missingReason

### Coverage receipt
For each prospective period record:
- eligibleOfficialEvents
- capturedEvents
- resolvedNamedEdges
- concentrationOnlyEvents
- unresolvedIdentityEvents
- staleEdgeEvents
- missingKnownAt
- missingEffectiveFrom
- sourceFamilyCounts
- TWSE/TPEx counts
- industry counts
- independentEventDates
- coveragePct and identityResolutionPct only when denominator is explicitly known.

No absence-of-edge claim is allowed from an incomplete source universe. Missing = UNKNOWN.

### Collector readiness gate
A Class-A prospective collector is justified only if it can be isolated from Formal runtime and records evidence without affecting candidate selection, ranking, monitoring, capital, signals or push. Before collector implementation, run a bounded source sample to estimate event availability, named-edge resolution, exchange/industry coverage and UNKNOWN rate without looking at forward returns.

## Current conclusion
SC-003 and SC-004 are definition-complete. Outcome testing remains NOT_AUTHORIZED_BY_EVIDENCE because PIT source coverage and identity resolution have not yet passed a bounded prospective feasibility sample. Next: SC-005 outcome-blind bounded source/identity coverage pilot across TWSE/TPEx and multiple industries; decide collector feasibility from coverage, not returns.


## SC-005 / SC-006 — bounded event lane and collector gate

### SC-005 result
The outcome-blind bounded source pilot falsified periodic/issuer reports as a sufficient named historical graph source, but the official major-counterparty cessation event lane is materially better for one narrow event class. When issuers name the counterparty, the disclosure can carry a publication clock, concentration basis/percentage and a distinct cessation/effective clock. Anonymous disclosures remain identity UNKNOWN.

Decision:
- MAJOR_COUNTERPARTY_STOP official event lane = OPERATIONALLY_USABLE_FOR_BOUNDED_EVENT_RESEARCH.
- Complete historical supply-chain graph = DATA_SOURCE_BLOCKED.
- No-event from an incomplete universe means NO_OBSERVED_QUALIFYING_BREAK_EVENT only; it never means NO_EDGE.

### SC-006 official-source / machine-interface gate
Official TWSE material confirms MOPS ezSearch is a first-party search surface spanning listed/OTC companies, supports market/category/date filters, orders results by announcement time, and defines M25 as the major-customer/supplier business-cessation category. TPEx official material independently defines the >=10% principal purchaser/supplier cessation disclosure semantics.

This is sufficient to establish a first-party discoverable source universe for the narrow event class, but not yet a stable machine-readable ingestion contract. Direct non-browser access to the documented ezSearch deep link currently redirects to the MOPS error surface in the research environment. No documented first-party JSON/CSV/API contract for M25 has yet been verified.

Therefore collector status = PROPOSAL_READY / MACHINE_INTERFACE_UNVERIFIED. Do not implement a brittle UI scraper and do not fall back to third-party search as canonical ingestion.

Minimal isolated Class-A prospective collector proposal, contingent on verifying a stable first-party machine interface:
- ingest only official timestamped M25 / equivalent TWSE-TPEx major-counterparty cessation/change disclosures;
- preserve raw source receipt/hash where permitted plus source URL/id, issuer market/symbol, publishedAt/knownAt, effectiveAt, counterparty raw name, identityResolution, concentrationPct/basis, source rule/category, capturedAt and pointInTimeEligible;
- anonymous counterparty stays UNKNOWN; no entity guessing;
- append-only event ledger plus explicit revision/supersession link; never rewrite knownAt backward;
- coverage receipt counts eligible official events only when the official query denominator is reproducible; otherwise coverage denominator = UNKNOWN;
- no historical Shadow backfill, no outcome lookup in feasibility collection, no Formal selection/ranking/monitor/capital/signal/push dependency.

Implementation gate:
1. verify a stable first-party machine-readable M25/equivalent query or downloadable response and its pagination/time semantics;
2. prove TWSE/TPEx market coverage and reproducible denominator;
3. targeted parser/provenance tests including named, anonymous, revision and malformed cases;
4. only then isolated Class-A prospective implementation. If (1) fails, mark SOURCE_ACCESS_BLOCKED and move on rather than scraping UI.

No alpha/outcome conclusion is authorized by SC-005/006.


## SC-006A — bounded machine-interface discovery result

A bounded first-party interface pass did not verify a stable documented machine-readable M25/equivalent ingestion contract.

Evidence:
- TWSE first-party materials document MOPS/ezSearch as a free cross-market announcement search surface with announcement category/date filters and announcement-time ordering.
- The official MOPS landing surface exposes real-time material information, but the research pass did not identify a documented M25 JSON/CSV/OpenAPI endpoint with pagination and reproducible denominator semantics.
- TWSE separately documents historical/custom information as information-service products. A free human search UI must not be reverse-engineered into an assumed supported archival API without an explicit contract.
- Repository audit found existing supported first-party machine endpoints for other research evidence (TWSE OpenAPI monthly revenue/attention/disposition, TPEx OpenAPI monthly revenue, TWSE RWD margin/SBL), but no existing MOPS M25 fetch path or archived M25 machine contract to reuse.

Decision:
- MAJOR_COUNTERPARTY_STOP_SOURCE_ACCESS = SOURCE_ACCESS_BLOCKED_FOR_AUTOMATED_CANONICAL_INGESTION.
- The semantic/event research remains valid and the collector proposal remains frozen, but implementation is deferred.
- Do not scrape ezSearch HTML, discover hidden endpoints by brittle UI coupling, or promote third-party search to canonical evidence.
- Human-readable official M25 evidence may still be used for bounded manual research with provenance, but absence cannot establish a complete denominator/no-event universe.

This closes the SC-006 interface gate without an outcome test. Supply-Chain Lead-Lag remains EVENT_LANE_SEMANTICALLY_FEASIBLE / AUTOMATED_SOURCE_BLOCKED / COMPLETE_GRAPH_BLOCKED.
