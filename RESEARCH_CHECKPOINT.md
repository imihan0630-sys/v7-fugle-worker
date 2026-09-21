# Research Checkpoint

Updated: 2026-09-21T20:48+08:00

## Continuity / baseline
- Formal Core: LOCKED.
- Repository: `imihan0630-sys/v7-fugle-worker`.
- Production Worker: `fugle-test` / `https://fugle-test.imihan0630.workers.dev/`.
- Actual Production readback must override remembered/chat version strings.
- Prospective Shadow begins 2026-09-21; no fabricated historical Shadow.
- Missing evidence remains UNKNOWN, never BAD/0.

## Repository state recovered this cycle
- Read main `RESEARCH_ENGINEERING_GOVERNANCE.md`, `RESEARCH_WORKLIST.md`, and this checkpoint before continuing.
- Governance still classifies isolated research/Shadow evidence and provenance as Class A only when formal outputs cannot change.
- Worklist still records R01-R08 research governance and Formal Core LOCKED.
- Production HTTP readback remains unverified in this cycle; no Production version/health claim is made.

## Research advanced this cycle — Priority 5 Supply-Chain Lead-Lag PIT coverage feasibility

### Research question
Is Taiwan official/reliable disclosure coverage sufficiently identified and timestampable to justify engineering a prospective stock-to-stock customer/supplier edge ingestion layer, rather than merely an industry/value-chain taxonomy?

### New supporting evidence
- TWSE annual-report disclosure format explicitly provides tables for major sales customers for the latest two years and current-year-to-prior-quarter, including name, amount, share of sales, and relationship. This confirms that a relationship-strength field can exist when the counterparty is actually identified.
- TPEx/TWSE industry value-chain platforms provide broad upstream/midstream/downstream membership and are useful as taxonomy/context controls.

### New counterevidence / feasibility finding
- Official industry value-chain pages identify firms by value-chain segment but do not establish bilateral customer→supplier edges. They therefore cannot safely populate `customer_id -> supplier_id` relationships.
- Annual-report major-customer disclosure is thresholded and can contain coded/unidentified counterparties. Consequently observed stock-to-stock edges are structurally sparse and non-random; absence of a named edge is UNKNOWN, not evidence of no relationship.
- Search/retrieval this cycle did not reveal a reliable official bulk endpoint that yields point-in-time bilateral identified customer/supplier edges with publication timestamps and sufficient cross-sectional coverage for automated prospective ingestion.

### Direction convergence
- Do NOT implement `supplyChainEdgeAsOf` ingestion yet. The coverage gate is not passed.
- Separate two concepts: (1) `valueChainTaxonomyAsOf` = broad official industry-chain membership, potentially useful only as research context/control; (2) `bilateralSupplyChainEdgeAsOf` = identified customer/supplier relationship with source publication time and strength. Never substitute (1) for (2).
- Supply-Chain Lead-Lag remains a research hypothesis, not a factor and not an R09.

### Redundancy / bias firewall
- Industry/value-chain membership risks duplicating `residualSectorRs20`; it must not become an additional vote/score without incremental evidence.
- Named-edge samples are subject to disclosure-threshold bias, confidentiality/coding bias, firm-size bias, survivorship/availability bias and publication-date clustering.
- Current web/news supply-chain maps remain prohibited for historical backfill.
- Any future bilateral edge must satisfy `known_at <= signal_time`.
- `positiveDayRatio20` / information discreteness may only be tested as a preregistered interaction after a valid edge exists; no double counting.

### UNKNOWN / data quality
- Coded customer/supplier identity = UNKNOWN counterparty.
- Below-disclosure-threshold relationship = UNKNOWN, not zero.
- Industry-chain co-membership = taxonomy evidence only, not bilateral edge evidence.
- Missing source publication timestamp or unverified relationship period = not PIT-eligible.

### R01-R08 / I01-I07 impact
- R01-R08 and I01-I07 unchanged.
- No new experiment definition, score, threshold, gate or formal output is created.
- Supply-Chain does not yet pass the data-readiness gate required to justify a new experiment family.

## Engineering classification / actions this cycle
- Class A documentation/checkpoint update only: record the failed coverage gate and prevent premature implementation.
- Runtime code changed: none.
- Formal invariants: unchanged by construction; no A/B, Top6, 3+3, capital, monitoring, signal or push code touched.
- Deployment: none; no Worker code changed.
- Rollback: revert this checkpoint commit if needed.

## Tests / deployment
- Code tests: not applicable because no runtime code changed.
- Production readback/health: not verified this cycle; no deployment occurred.

## Unfinished items
1. A statistically defensible identified-vs-coded-vs-UNKNOWN percentage cannot yet be claimed because no official bulk bilateral-edge dataset was found; do not fabricate a coverage percentage.
2. Production runtime readback remains unverified in this cycle.

## Exact next continuation point
Supply-Chain PIT engineering gate is **NOT PASSED**; do not add bilateral-edge ingestion complexity now. Proceed to Priority 6 **Execution Alpha**, beginning with point-in-time execution-state design for the formal 15-minute confirmation and auxiliary 10-minute structure: establish timestamp semantics, opening-gap/VWAP/first-30-minute diagnostics, market-mechanism exclusions/states, and transaction-cost/slippage observability strictly as Research/Shadow. First test redundancy with existing Selection factors and ensure Execution Alpha cannot alter Selection Core. If future official/reliable bilateral-edge coverage becomes available, reopen Supply-Chain as a separate preregistered research task rather than silently backfilling it.
