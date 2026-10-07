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


## SC-007 — Taiwan official physical-cycle source lane

### Source finding
Taiwan has an official monthly physical-cycle evidence lane through MOEA industrial production / sales / inventory statistics. The official survey framework publishes, by industry/product where applicable:
- production index;
- sales-volume index;
- inventory-volume index;
- production / sales / inventory values;
- inventory ratio;
- major product production / sales / inventory quantities.

The official interactive taxonomy reaches detailed manufacturing groups including integrated-circuit manufacturing, semiconductor packaging/testing and printed-circuit-board manufacturing, which is materially more useful than a single economy-wide index for D10.

### PIT / revision contract
The survey is monthly and has a defined publication cadence in the following month. Research must preserve:
- observationMonth;
- sourceReleaseDateTime / knownAt;
- preliminary / final / revised status;
- industry/product code and taxonomy version;
- source series definition;
- capturedAt;
- revision link where a value is later revised.

A later final value must never be rewritten backward as if known at the preliminary release.

### Automation boundary
A canonical human-readable official source and release schedule are established, but a stable documented machine-readable API / download contract for every required series has not yet been verified. Therefore:
- official-source feasibility = YES;
- PIT semantic feasibility = YES;
- automated canonical ingestion = PARTIAL / INTERFACE_UNVERIFIED.

Status: `D10-11 -> L2 SOURCE_CONTRACT_DEFINED / MACHINE_INTERFACE_PENDING`.

---

## SC-008 — Inventory cycle: absolute inventory direction is not the signal

### Core mechanism
Inventory only has meaning relative to demand, sales and position in the chain. Absolute inventory falling can be healthy destocking or destructive demand collapse; absolute inventory rising can be constructive restocking or oversupply.

A minimum state matrix therefore uses sales direction together with inventory direction / inventory-to-sales condition:

| State | Sales / demand | Inventory / inventory ratio | Interpretation to test |
|---|---|---|---|
| DEMAND_ABSORPTION | rising | falling or growing slower than sales | constructive demand absorption |
| RESTOCKING_CONFIRMATION | rising / stabilizing | rising from low base | potentially constructive only if sell-through / margin holds |
| OVERHANG | flat / falling | rising or inventory ratio rising | oversupply / demand miss risk |
| DESTOCKING | falling | falling | not bullish by itself; wait for demand stabilization |
| BULLWHIP_RISK | downstream unclear | upstream orders / inventory spike | may reflect batching, shortage gaming or forecast amplification |
| UNKNOWN | insufficient PIT data | insufficient PIT data | no forced interpretation |

### Supporting evidence and counterevidence
- Bullwhip-effect research shows order variance can amplify upstream even when final demand has not changed proportionately. Upstream order / backlog growth therefore cannot be treated as end-demand proof.
- Operations/accounting research links abnormal inventory growth relative to sales with weaker future outcomes, consistent with operational demand-supply mismatch.
- Semiconductor-cycle research finds inventory change, fab utilization and chip sales jointly informative for cycle-turning probabilities. This supports a multivariate cycle state, not a universal "inventory down = buy" rule.

### Taiwan implementation implication
MOEA monthly production / sales / inventory / inventory-ratio series make this concept PIT-feasible for bounded Taiwan industry groups. Exact stock-level benefit still requires a company-transmission map and must not be inferred from industry data alone.

Status: `D10-03 -> L3 TAIWAN_PIT_FEASIBLE / PROSPECTIVE_VALIDATION_PENDING`.

---

## SC-009 — Capacity / expansion / utilization: supply response can invalidate the thesis

Capacity is not a bullish noun. Expansion is useful only when demand, pricing and future utilization can absorb the supply response.

### Distinguish the variables
- CAPACITY: theoretical / rated output potential;
- PRODUCTION: actual output;
- UTILIZATION: actual output relative to available capacity, only when explicitly defined by a source;
- CAPEX: investment spending, not identical to new usable capacity;
- CAPACITY_EFFECTIVE_DATE: when new capacity can actually contribute;
- YIELD / MIX: usable economic output may differ from nameplate capacity.

### Supportive state
`CAPACITY_GAP_SUPPORTIVE` requires evidence such as demand/sales strength, tight lead time or pricing, and constrained existing capacity before the new supply becomes effective.

### Falsification state
`CAPACITY_OVERSHOOT_RISK` is raised when expansion / capex continues while:
- sales / demand weaken;
- inventory ratio rises;
- lead time normalizes sharply;
- selling price / margin deteriorates;
- peer capacity enters simultaneously.

### Source result
Current research verified official Taiwan fixed-asset investment / production statistics, but has not verified a clean standardized current public capacity-utilization time series with the same breadth and PIT contract. Do not infer utilization numerically from capex or production.

Status: `D10-04 remains L2 / UTILIZATION_SOURCE_PARTIAL`.

---

## SC-010 — Raw materials and pricing power: pass-through, not price direction

An input-price increase has opposite implications for different nodes of the chain. It can help an upstream producer with scarcity pricing while hurting a downstream manufacturer that cannot pass the cost through.

### Required transmission chain
`INPUT_COST_CHANGE -> SELLING_PRICE_CHANGE -> GROSS_MARGIN / OPERATING_MARGIN -> VOLUME / SHARE RESPONSE`

A "price increase" headline is incomplete unless the research identifies:
- which node sets the price;
- contract / spot / lag structure;
- pass-through lag;
- buyer concentration and supplier concentration;
- substitution / switching cost;
- volume elasticity;
- gross-margin outcome.

Empirical pass-through research shows cost changes are often only partially passed through, and firm-to-firm bargaining structure matters. Therefore raw-material inflation is never assigned a permanently positive/negative sign at the company level.

Candidate states:
- COST_PASS_THROUGH_CONFIRMED;
- PARTIAL_PASS_THROUGH;
- COST_SQUEEZE;
- UPSTREAM_PRICING_POWER;
- DEMAND_DESTRUCTION_RISK;
- UNKNOWN.

Status: `D10-06 -> L2 MECHANISM_PLUS_FALSIFICATION_DEFINED / TAIWAN_PIT_SOURCE_CONTRACT_PENDING`.

---

## SC-011 — Orders / lead time / backlog require conversion evidence

Backlog can contain information about future sales, but it is not booked earnings.

### Confirmation chain
A backlog thesis becomes stronger only when it survives:
- cancellation / push-out / double-booking checks;
- shipment or revenue conversion;
- capacity / component availability;
- stable or improving margin;
- customer concentration / product relevance;
- knownAt and delivery-window semantics.

### Main false-positive patterns
- customers place duplicate orders during shortage;
- backlog expands because lead times lengthen, not because sustainable demand improves;
- low-margin mix fills the backlog;
- capacity bottleneck prevents conversion;
- cancellations appear after supply normalizes.

Thus `BACKLOG_UP` alone is a research descriptor, not a bullish factor.

Status: `D10-07 -> L2 MECHANISM_PLUS_FALSIFICATION_DEFINED / STANDARDIZED_TAIWAN_SOURCE_PENDING`.

---

## SC-012 — Integrated Industry Cycle Confirmation Stack

### Goal
Join market-confirmation research (D09) with real-economy / supply-chain confirmation (D10) without creating an overfit super-score.

### Six-layer stack
0. **CLASSIFICATION_VINTAGE** — was the company actually in this industry at decision time?
1. **PRICE_PARTICIPATION** — Sector RS, residual RS, rank persistence, breadth, concentration.
2. **PHYSICAL_CYCLE** — production, sales, inventory, inventory ratio.
3. **SUPPLY_RESPONSE** — capacity, capex, utilization where explicitly available, effective-date lag.
4. **PRICING_TRANSMISSION** — input cost, selling price, pass-through, margin.
5. **COMPANY_TRANSMISSION** — exposure, customer/product mix, revenue / earnings sensitivity.

Every layer has `KNOWN / PARTIAL / UNKNOWN` provenance and a decision-time `knownAt`. Missing layers are never coerced to zero.

### Why state vector before scalar score
A weighted sum can hide economically opposite configurations. Example:
- strong Sector RS + rising production + rising inventory + falling margin
may receive a superficially high score despite an emerging oversupply / cost-squeeze state.

Therefore first store a state vector and test interactions prospectively. Only after independent evidence may a compact factor be proposed.

### Candidate interaction states
- PRICE_ONLY;
- PRICE_PLUS_PHYSICAL_CONFIRMATION;
- PHYSICAL_EARLY_PRICE_NOT_CONFIRMED;
- LEADER_ONLY_CONCENTRATION;
- DEMAND_ABSORPTION;
- RESTOCKING_CONFIRMATION;
- OVERHANG;
- DESTOCKING;
- CAPACITY_GAP_SUPPORTIVE;
- CAPACITY_OVERSHOOT_RISK;
- COST_PASS_THROUGH_CONFIRMED;
- COST_SQUEEZE;
- BACKLOG_CONFIRMED;
- BULLWHIP_RISK;
- UNKNOWN.

No state receives permanent buy/sell meaning in this phase.

### System 1 redundancy firewall
Validate after:
1. existing sector hard-gate inputs and sector score;
2. stock trend / ret20 / ret60 / Residual RS;
3. Price-Volume / K-line / overheat;
4. market Regime;
5. fundamentals available at T0.

If physical-cycle state adds no incremental information after those controls, classify it REDUNDANT.

### System 2 direct mapping
This stack maps naturally to the already owner-approved Industry Trend research contract:
- `IND.CYCLE_STAGE` <- physical-cycle state + phase;
- `IND.SUPPLY_DEMAND` <- sales / production / shortage / lead-time state;
- `IND.INVENTORY` <- inventory and inventory-to-sales state;
- `IND.CAPACITY` <- supply response / effective capacity state;
- `IND.PRICING` <- pass-through / margin state;
- `IND.COMPANY_TRANSMISSION` <- verified exposure / earnings path.

This is a research-data bridge only. It does not authorize scoring weights, eligibility thresholds or Formal promotion.

### Exact next continuation
SC-013: outcome-blind machine-interface audit for MOEA monthly production / sales / inventory / inventory-ratio series, including pagination/download, series IDs, revisions and release timestamps.
SC-014: build an effective-dated bridge between MOEA industry/product codes and TWSE/TPEx company classification without forcing one-to-one mappings.
SC-015: run a source-only pilot on at least one semiconductor/PCB lane and one non-tech lane to verify state reproducibility; do not inspect forward returns until provenance/coverage passes.
SC-016: separately identify Taiwan PIT sources for raw-material prices and company selling-price/margin transmission.
SC-017: only after source readiness, preregister prospective interaction outcomes and negative controls.

Status: `CONCEPT_COMPLETE / PIT_SOURCE_PARTIAL / PROSPECTIVE_EVIDENCE_PENDING / FORMAL_CORE_LOCKED`.

### External evidence anchors
- Lee, Padmanabhan & Whang (1997), *The Bullwhip Effect in Supply Chains*, Management Science.
- Capkun, Hameri & Weiss / later operations-finance literature on inventory dynamics and returns; inventory must be normalized to demand/sales.
- *Inventory change, capacity utilization and semiconductor industry cycle* (Economic Modelling, 2013).
- Ganapati, Shapiro & Walker, NBER, *Energy Cost Pass-Through in U.S. Manufacturing*.
- recent NBER firm-to-firm bargaining / pass-through research.
- order-backlog disclosure research in Journal of Accounting and Public Policy (2021).
- Taiwan MOEA Industrial Production / Sales / Inventory official statistics and release calendar.



## SC-013 — MOEA machine-interface audit: downloadable CSV exists; PIT archive is still our responsibility

### Outcome-blind source audit result
The first source-readiness gate materially improved.

Taiwan's Government Open Data platform exposes official Ministry of Economic Affairs datasets as downloadable CSV resources, including:
- industrial / manufacturing production index;
- manufacturing sales-volume index / sales value;
- manufacturing inventory-volume index;
- manufacturing inventory value;
- manufacturing inventory ratio;
- manufacturing investment / operations data.

The resource links resolve to `service.moea.gov.tw/EE520/opendata/*.csv` style endpoints. The government platform separately publishes M2M（Machine to Machine，機器對機器） metadata standards and a documented `GET /api/v2/rest/dataset/{datasetId}` metadata contract.

This falsifies the earlier conservative assumption that the MOEA physical-cycle lane may be limited to a human-only interactive query. There is a documented machine-readable file-distribution path.

### What remains unproven
The open-data dataset pages label update frequency as "irregular" even though the underlying Industrial Production / Sales / Inventory survey has a monthly publication timetable. Therefore a static endpoint alone does NOT prove historical first-known vintages.

The current research environment could identify the documented CSV URLs but could not ingest the octet-stream bytes through the web text fetcher; this is a tool/content-type limitation, not evidence that the public CSV resource is unavailable.

Still UNKNOWN:
- whether each monthly CSV is immutable or overwritten in place;
- whether historical preliminary/revised vintages are directly downloadable;
- exact revision-history retention;
- whether every detailed industry/product series uses identical resource semantics.

### Required prospective capture protocol
For a research-only collector:
1. use the official release calendar as the trigger, not the open-data page's generic update-frequency label;
2. discover/confirm resource URL from official metadata;
3. fetch the CSV after release;
4. preserve `fetchedAt`, HTTP metadata where available, source URL, datasetId, resource filename, byte hash and parser version;
5. never overwrite an older captured file; append a new vintage;
6. compare hashes / observations across vintages and record revisions explicitly;
7. set `knownAt = fetchedAt` conservatively unless the official release timestamp is independently proven earlier;
8. mark missing/failed capture UNKNOWN, never forward-fill a later vintage backward.

### D10-11 maturity decision
The combination of official downloadable CSV resources + official M2M metadata contract + known monthly source publication process establishes Taiwan prospective PIT capture feasibility.

`D10-11 官方資料自動化擷取: L2 -> L3`.

Scope of this upgrade:
- machine-readable source feasibility: YES;
- prospective PIT archive feasibility: YES;
- complete historical vintage recovery: UNKNOWN;
- production collector implementation: NOT DONE;
- Formal Core impact: NONE.

### Next
SC-014: effective-dated crosswalk between MOEA industry/product taxonomies and TWSE/TPEx company classifications.
SC-015: source-only multi-industry pilot with stored vintages/hashes; no forward-return outcomes until coverage and revision semantics pass.

Status: `MACHINE_SOURCE_FEASIBLE / PROSPECTIVE_VINTAGE_CAPTURE_REQUIRED / HISTORICAL_VINTAGE_UNKNOWN`.


## SC-014 — Industry-specific transmission templates must be taxonomy-aware

### Principle
A reusable supply-chain template must specify the economic mechanism, source taxonomy and falsification route. It cannot be "industry is hot -> member stocks benefit".

### Common template grammar
For each industry/theme define:
1. **END_DEMAND** — end-market quantities / orders / adoption.
2. **UPSTREAM_INPUTS** — key materials / components / equipment and price state.
3. **PHYSICAL_OUTPUT** — production / shipment / sales.
4. **INVENTORY** — absolute and demand-normalized inventory.
5. **CAPACITY_RESPONSE** — installed capacity, effective additions, utilization where sourced, yield/mix.
6. **PRICING_POWER** — selling price, cost pass-through, margin.
7. **CHAIN_POSITION** — supplier/customer/substitution role and bargaining power.
8. **COMPANY_EXPOSURE** — disclosed revenue/product/customer/capacity exposure with knownAt/effective dates.
9. **MARKET_CONFIRMATION** — sector RS / breadth / leadership concentration.
10. **INVALIDATION** — demand miss, overhang, oversupply, substitution, margin squeeze, stale exposure, source failure.

### Template A — Semiconductor / PCB family
Statistical source nodes may include detailed MOEA manufacturing codes such as:
- 2611 integrated-circuit manufacturing;
- 2613 semiconductor packaging/testing;
- 2630 printed-circuit-board manufacturing.

But these statistical codes do not automatically equal an exchange issuer's formal industry or an investment theme such as ABF / AI server / advanced packaging.

Required chain tests:
- end-demand / customer adoption before declaring capacity shortage;
- sales + inventory state before interpreting production growth;
- capacity effective date and yield/mix before calling expansion accretive;
- material/input cost vs selling price/margin;
- product-specific exposure before transferring industry state to a stock;
- peer/common-factor negative control for alleged supply-chain lead-lag.

Typical falsification:
- capacity grows faster than demand;
- inventory accumulates despite output growth;
- price strength is concentrated in one mega-cap;
- upstream order spike is bullwhip / double booking;
- company has technical capability but no verified material revenue exposure.

### Template B — Commodity / process-manufacturing family
Required chain:
`RAW_MATERIAL / ENERGY -> PRODUCER COST -> SELLING PRICE -> INVENTORY / VOLUME -> MARGIN -> DOWNSTREAM DEMAND`.

Key distinction:
- upstream raw-material producer can benefit from scarcity;
- downstream processor can be squeezed by the same price move;
- final demand destruction can reverse an apparent pricing-power phase.

Typical falsification:
- selling-price increase lags cost increase;
- inventory value rises only because unit prices rise while physical volume weakens;
- producer price strength is caused by temporary outage or policy shock that normalizes;
- margin / cash flow fails to confirm.

### No forced one-to-one crosswalk
TWSE issuer industries, MOEA/DGBAS statistical industries and theme/supply-chain groups remain separate namespaces connected by effective-dated evidence edges. This prevents false precision and protects PIT semantics.

### D10-12 maturity decision
The reusable grammar plus two distinct mechanism/falsification families are now defined.

`D10-12 產業別專用傳導模板: L1 -> L2`.

PIT source coverage for each concrete industry remains pending and must be validated separately.

---

## SC-015 — Source-only pilot design before any return test

The next pilot will select at least:
- one semiconductor/PCB statistical lane;
- one non-tech / commodity-process lane.

For each monthly information date, freeze only source state:
- production / sales / inventory / inventory ratio;
- available investment/capacity proxy;
- classification/exposure vintage;
- source release / capturedAt / revision hash.

Pilot success criteria:
- source retrieval is reproducible;
- observation month and knownAt are unambiguous;
- revisions can be detected rather than overwritten;
- industry code remains stable or versioned;
- mapping to issuer/theme is evidence-backed;
- UNKNOWN rate is reported rather than imputed.

Forward returns remain hidden until the source-readiness receipt passes. This prevents outcome-driven taxonomy/mapping choices.

Status: `PILOT_PREREGISTERED / OUTCOME_BLIND / NO_FORMAL_CHANGE`.


## SC-015A — Source-only pilot falsified the single-freshness assumption

Receipt: `research/industry_physical_cycle_source_pilot_v0_1.json`

### Pilot result
Direct machine-readable MOEA CSV retrieval was verified through an alternate read-only fetch path, but freshness is not uniform across series.

Observed source coverage in the pilot:
- manufacturing production index: through ROC 11508, but only four broad groups I1-I4;
- manufacturing inventory ratio: through ROC 11507, about 30 major/mid industry codes;
- tested manufacturing inventory-volume-index CSV: only through ROC 11203;
- tested manufacturing sales-value CSV: only through ROC 11203;
- dedicated electronic-components production/sales/inventory-value CSV: through ROC 11507.

Therefore the hypothesis "all official EE520 open-data files can be joined as one current monthly panel" is FALSIFIED.

### Mandatory data firewall
Every industry metric must pass independently:
1. `SOURCE_FRESHNESS_GATE` — latest observation must be compatible with the expected release cadence;
2. `SERIES_ALIGNMENT_GATE` — metrics from materially different observation vintages cannot be merged into one state;
3. `SERIES_GRANULARITY_GATE` — required industry code must actually exist; parent-industry substitution after seeing outcomes is forbidden;
4. `VINTAGE_CAPTURE_GATE` — prospective raw snapshot/hash/parser version required;
5. `NO_FORWARD_FILL_GATE` — later/revised observations cannot be carried backward;
6. `NO_ALPHA_BEFORE_SOURCE_READY` — return testing stays closed until the source receipt passes.

Stale data are `UNKNOWN`, not the last known value.

### Electronic-components current source-only example
For ROC 11507, the dedicated code-26 electronic-components file showed:
- production value YoY about +50.98%;
- sales value YoY about +50.53%;
- inventory value YoY about +78.02%;
- inventory ratio 70.12 versus 59.25 one year earlier (+10.87 percentage points);
- inventory-value / sales-value ratio about 0.652 versus 0.552 one year earlier.

Research-only state:
`DEMAND_STRONG_WITH_INVENTORY_BUILD`.

This deliberately receives no bullish/bearish label. Strong sales and production coexist with faster inventory accumulation, so subsequent inventory absorption, pricing, margin, capacity and product mix are required before any economic direction is assigned.

This concrete case supports the state-vector approach and falsifies a naive "industry growth = automatically better" score.

### Broad-group cross-industry pilot
An outcome-blind I2 information-electronics vs I3 chemicals alignment test failed for current 2026 research because the tested sales-volume file stopped at ROC 11203 while production and inventory-ratio files extended into ROC 115.

Result:
`FRESHNESS_MISMATCH_BLOCKED`.

Do not solve this by silently comparing nonaligned dates.

### Maturity interpretation
- D10-11 L3 remains justified as `PIT_FEASIBLE_PARTIAL`: current machine-readable official sources exist and prospective capture is feasible, but readiness is dataset-by-dataset, not family-wide.
- D10-03 L3 remains justified because current official inventory-ratio / dedicated industry source lanes are available, but detailed physical-cycle coverage is incomplete.
- No L4 promotion: no prospective archived cohort / OOS evidence yet.

### Exact next continuation
SC-016A: find or rule out a supported current machine-readable detailed sales/inventory interface for 4-digit codes (2611/2613/2630) without brittle hidden-endpoint scraping.
SC-016B: establish at least one current non-tech aligned panel; otherwise record a durable SOURCE_GAP.
SC-017: after source readiness only, preregister prospective industry-state outcomes and negative controls.

Status: `PARTIAL_PASS / FRESHNESS_FIREWALL_REQUIRED / FORMAL_CORE_LOCKED`.


## SC-016A — Granularity mismatch: four-digit production is not four-digit inventory

### Official scope finding
The MOEA Industrial Production, Shipment & Inventory Statistics query explicitly distinguishes available granularity:
- industry query supports major/mid industry generally;
- production index / production value additionally expose four-digit detailed industries;
- product statistics expose a separate product hierarchy with production, sales and inventory quantities/values.

For example, the industry taxonomy exposes 2611 integrated-circuit manufacturing, 2613 semiconductor packaging/testing and 2630 printed-circuit-board manufacturing for production-side measures. The product-statistics taxonomy then drills further into product items such as IC design/chips and foundry wafer categories.

### Falsification
It is invalid to build a supposedly "2611 integrated-circuit cycle" by combining:
- four-digit 2611 production;
with
- two-digit 26 electronic-components inventory/sales
and treating them as identical scope.

The denominator/universe differs. A strong subindustry can coexist with weak sibling industries, so parent-level inventory can materially misstate the subindustry state.

### New hard gate
`SCOPE_COMPATIBILITY_GATE`:
- each joined metric must carry `scopeType = INDUSTRY | PRODUCT`;
- `scopeCode`, taxonomyVersion and aggregation rule are mandatory;
- metrics can be joined directly only when the statistical scopes are identical or when a pre-registered aggregation maps product children to the exact parent;
- parent-to-child substitution is forbidden after seeing outcomes;
- mixed-granularity state is `PARTIAL` / `UNKNOWN`, not a complete physical-cycle confirmation.

### Detailed semiconductor / PCB path
Two safe paths are permitted:
1. stay at code-26 / code-27 medium-industry level using aligned current production/sales/inventory sources;
2. build a product-level basket from the official product-statistics hierarchy, with product membership frozen before outcome testing.

Do not manufacture a four-digit sales/inventory series from a two-digit parent.

### Source-access boundary
The official interactive query demonstrates the detailed taxonomy and metric availability, but a documented machine query/download contract for arbitrary four-digit/product selections has not yet been established in this research lane. Brittle hidden-endpoint scraping remains prohibited.

### Next
SC-016B: determine whether the official query offers a supported export/download action whose request contract can be recorded without reverse-engineering hidden private endpoints.
SC-016C: if not, use only published standalone CSV datasets for prospective automation and classify detailed four-digit state as SOURCE_GAP until a supported interface exists.

Status: `SCOPE_MISMATCH_IDENTIFIED / HARD_GATE_ADDED / DETAILED_AUTOMATION_PARTIAL`.


## SC-016B — Current official source matrix: machine-readable does not mean scope-complete

### Verified machine-readable lanes

#### 1. MOEA `d.csv` — industrial production index
Official government open-data metadata points to a machine-readable MOEA CSV. Direct source audit verified:
- 124,752 data rows at audit time;
- monthly history from ROC 07101;
- latest period ROC 11508 (2026-08);
- 4-digit production coverage is present, including 2611 integrated-circuit manufacturing, 2613 semiconductor packaging/testing and 2630 printed-circuit-board manufacturing;
- code 24 basic metals and code 26 electronic components are also present.

This is a strong production/output lane, not a sales/inventory/capacity lane.

#### 2. Dedicated code-26 electronic-components CSV
A separate official file contains current production value, sales value and inventory value for the electronic-components industry through ROC 11507 in the source-only pilot.

#### 3. Manufacturing inventory-ratio CSV
Official open data reaches ROC 11507 for major/mid industry codes, including code 24 basic metals and code 26 electronic components.

#### 4. MOEA `ec.csv` — manufacturing investment/operations
Direct audit verified a quarterly machine-readable file with:
- manufacturing revenue;
- fixed-asset additions;
- 2026 Q1/Q2 observations.

But the tested file's industry field is only **製造業** aggregate. It does not provide sector-level capex in this open file.

### Capacity falsification
`fixedAssetAdditions` is not equivalent to:
- installed productive capacity;
- effective capacity date;
- utilization;
- yield;
- industry-specific expansion.

Therefore:
- MOEA aggregate manufacturing fixed-asset additions = MACRO_SUPPLY_RESPONSE_CONTEXT only;
- it cannot populate `IND.CAPACITY` for semiconductor/PCB/basic metals at sector level;
- D10-04 remains L2 until an industry/company PIT capacity/utilization source contract is established.

### Interactive database boundary
The official MOEA industrial production/sales/inventory query currently exposes dates through ROC 11508 and detailed industry selections. It explicitly says production index/value can reach 4-digit detailed industries, while sales/inventory industry measures have different granularity.

The human query surface is therefore current and semantically useful. However, no documented stable public request/export contract for arbitrary detailed selections has yet been verified in this research lane.

Until that is verified:
- interactive query result = `MANUAL_OFFICIAL_SOURCE`;
- standalone published CSV/XML = `AUTOMATABLE_OFFICIAL_SOURCE`;
- do not reverse-engineer brittle hidden form endpoints.

### D10 source-readiness conclusion
The source family is **partially machine-ready, not uniformly machine-ready**.

Status: `CURRENT_PRODUCTION_SOURCE_READY / INVENTORY_PARTIAL / SALES_PARTIAL / CAPACITY_SOURCE_GAP / NO_FORMAL_CHANGE`.

---

## SC-016C — Raw-material / output-price transmission gets a Taiwan PIT source contract

### Official Taiwan price lanes
The Directorate-General of Budget, Accounting and Statistics (DGBAS) publishes monthly official datasets for:
- Producer Price Index (PPI) basic classifications;
- Import Price Index (IPI) basic classifications in NTD;
- corresponding USD-basis import/export price series;
- domestic-sales price indices;
- processing-stage price indices.

Government Open Data metadata documents monthly update frequency for PPI and IPI datasets and machine-readable XML resources. July 2026 Price Statistics Monthly is already published, and the official release calendar provides the timing semantics needed for prospective PIT capture.

The classification includes economically relevant groups such as basic metals, metal products, semiconductors/electronic components and other manufacturing product groups.

### Transmission contract
Do not treat one price index as "raw material price".

Freeze separate layers:

1. `INPUT_IMPORT_USD` — external/raw-material price pressure before NTD FX translation where category coverage is valid.
2. `INPUT_IMPORT_NTD` — Taiwan buyer's local-currency import-cost pressure.
3. `OUTPUT_PPI` — producer/output-price movement for the relevant category.
4. `DOMESTIC_SALES_PRICE` — domestic selling-price proxy where available.
5. `COMPANY_MARGIN` — company gross/operating margin, handled by fundamental PIT data rather than price-index data.

### FX decomposition rule
A rise in NTD import-price index can come from:
- USD commodity/product price;
- TWD depreciation;
- both.

Therefore `INPUT_IMPORT_NTD` and `INPUT_IMPORT_USD` must remain separate. The spread/change between them is an FX-transmission diagnostic, not automatically an alpha factor.

### Mapping rule
Price-index categories must connect to an issuer/theme only through an effective-dated exposure bridge:
- input material/product category;
- cost share or material relevance when disclosed;
- source knownAt;
- substitution/contract structure;
- currency / hedging context where known.

A generic PPI move is not a company ASP (Average Selling Price，平均售價).

### Pricing-power test
Potential pass-through state requires temporal ordering:
`INPUT_COST -> OUTPUT/SELLING_PRICE -> MARGIN -> VOLUME/SHARE`.

Candidate descriptors:
- `INPUT_UP_OUTPUT_UP_MARGIN_STABLE`;
- `INPUT_UP_OUTPUT_LAG_MARGIN_DOWN`;
- `INPUT_DOWN_OUTPUT_STICKY_MARGIN_UP`;
- `OUTPUT_UP_VOLUME_DOWN_DEMAND_DESTRUCTION_RISK`;
- `FX_DRIVEN_INPUT_SHOCK`;
- `UNKNOWN`.

No state is permanently bullish/bearish.

### Falsification
Reject a claimed pricing-power signal when:
- output-price movement only mirrors input cost with no margin protection;
- NTD import inflation is mostly FX and the firm is hedged / naturally offset;
- category mapping is too broad;
- company exposure is stale or inferred from theme membership;
- volume/share deteriorates enough to offset price;
- price-index base/reclassification changes are ignored.

### D10-05 maturity decision
Official Taiwan monthly PPI/IPI sources plus release-time semantics establish bounded/prospective PIT feasibility for raw-material/output-price transmission.

`D10-05 原物料／報價傳導: L2 -> L3`.

This does **not** promote D10-06 Pricing Power above L2 because firm-level pass-through still requires company-specific margin/volume/exposure evidence.

Status: `PIT_SOURCE_FEASIBLE / COMPANY_PASS_THROUGH_PENDING / FORMAL_CORE_LOCKED`.

---

## SC-017 — Source-readiness firewall before prospective outcome testing

A sector/month can enter physical-cycle Shadow research only when every required component carries:
- sourceId / datasetId;
- scopeType and scopeCode;
- taxonomyVersion;
- observationMonth;
- releaseTimestamp or conservative capturedAt;
- sourceFreshnessState;
- revision/vintage identifier or raw hash;
- machineReadable / manualOfficial flag;
- KNOWN / PARTIAL / UNKNOWN;
- mapping confidence to issuer/theme.

### Readiness states
- `READY_ALIGNED`: required source clocks/scopes align.
- `READY_PARTIAL`: useful state but at least one noncritical layer UNKNOWN.
- `STALE_BLOCKED`: required series misses freshness rule.
- `SCOPE_BLOCKED`: attempted join mixes incompatible industry/product scopes.
- `VINTAGE_BLOCKED`: historical value lacks decision-time vintage provenance.
- `SOURCE_ACCESS_BLOCKED`: official source exists but canonical machine retrieval is unavailable.
- `MAPPING_BLOCKED`: industry/theme/company exposure bridge is not evidenced.

Only READY_ALIGNED / pre-registered READY_PARTIAL can enter prospective outcome testing. Blocked states remain research evidence about data quality, never negative market signals.

### Exact next continuation
SC-018: build a current source-only non-tech panel if the official interactive result can be cleanly extracted; otherwise freeze MANUAL_SOURCE_ONLY and do not fabricate a machine panel.
SC-019: define an industry/company capacity evidence hierarchy (official industry data -> company filing/capex -> capacity effective date -> utilization/yield), explicitly separating plan, construction, tool-in, qualification and mass production.
SC-020: define product-level raw-material mappings for at least semiconductor/PCB and basic-metals/process manufacturing with negative controls.


## SC-018 — Non-tech aligned official panel exists; automation contract is still incomplete

Receipt: `research/nontech_physical_cycle_source_pilot_v0_1.json`

### Outcome-blind official query result
A bounded browser query on the official MOEA industrial production/sales/inventory statistics surface successfully retrieved one aligned current non-tech panel:

Observation month: ROC 11507 (2026-07)  
Industry: `24 基本金屬製造業`

- production value: 128,744,522 thousand NTD;
- sales value: 79,712,871 thousand NTD;
- inventory value: 106,749,192 thousand NTD;
- inventory ratio: 143.75%.

All four observations came from the same official query surface, same month and same industry code.

No stock-return outcome was inspected.

### Important interpretation boundary
The query used `統計值` mode only. Therefore this pilot establishes **source alignment**, not cycle direction.

Do NOT label the industry bullish/bearish from the levels alone.

In particular:
- do not infer YoY direction without explicitly querying a comparable historical/YoY mode;
- do not substitute `inventoryValue / salesValue` for the official inventory-ratio series unless the official definition proves equivalence;
- do not compare nominal value growth across long periods without considering price-level changes.

### Export finding
The official result page visibly supports:
- `下載報表 -> XLS`;
- `下載報表 -> ODS`;
- print.

This falsifies the stronger claim that the current detailed database is human-display-only.

The narrower, still unresolved claim is:
**a stable documented canonical machine request/download contract for arbitrary query selections has not yet been verified.**

Therefore source state becomes:
`MANUAL_EXPORTABLE_OFFICIAL_SOURCE / MACHINE_CONTRACT_UNVERIFIED`.

### Automation rule
A browser-created XLS/ODS export may be used for bounded manual research with provenance, but a production/research collector should not depend on fragile UI coordinates or reverse-engineered hidden endpoints.

If future work verifies a stable export request contract, prospectively preserve:
- query parameters;
- observation period and industry scope;
- selected statistic/calculation mode;
- downloaded-file hash;
- capturedAt;
- official release/knownAt;
- parser version;
- revision/supersession state.

### Maturity implication
This strengthens D10-03 / D10-11 source readiness but does not justify another maturity promotion:
- D10-03 already L3;
- D10-11 already L3;
- no prospective vintage archive exists yet;
- D10-04 capacity remains L2.

### Exact next continuation
SC-019: capacity evidence hierarchy — distinguish announcement, approved capex, construction, tool-in, qualification, effective capacity, yield and utilization.
SC-020: product/material mapping — semiconductor/PCB and basic-metals/process lanes, with input-price negative controls.
SC-021: prospective source receipt design for official XLS/ODS and standalone CSV/XML vintages.


## SC-019 — Capacity is a lifecycle, not a headline

### Core falsification
The phrase "擴產" collapses multiple economically different states. Research must separate at least:

1. `PLAN_ANNOUNCED` — management/public plan exists.
2. `CAPEX_APPROVED` — board/budget/financing approval where evidenced.
3. `CONSTRUCTION_STARTED`.
4. `EQUIPMENT_ORDERED`.
5. `TOOL_MOVE_IN / EQUIPMENT_INSTALLED`.
6. `PROCESS_QUALIFICATION`.
7. `CUSTOMER_QUALIFICATION` when economically required.
8. `HIGH_VOLUME_MANUFACTURING_START`.
9. `RAMPING`.
10. `STEADY_STATE_AVAILABLE_CAPACITY`.
11. `DELAYED / SUSPENDED / CANCELLED`.

These states have different knownAt and effectiveAt clocks. A plan announcement cannot be backfilled as usable capacity.

### Capacity vocabulary
Freeze distinct variables:

- `nameplateCapacity`: theoretical/rated maximum output.
- `availableCapacity`: capacity technically available for production.
- `qualifiedCapacity`: capacity qualified for the relevant process/customer/product.
- `economicCapacity`: capacity that can produce saleable output at the required yield/mix.
- `actualProduction`: observed output.
- `utilization`: actual production relative to a clearly defined capacity denominator.
- `yield`: saleable output share.
- `productMix / nodeMix`: economically relevant composition.
- `capex`: investment spending; never synonymous with any capacity term.

### Taiwan / semiconductor evidence
A real company example confirms why the lifecycle matters: TSMC's 2025 annual report separately describes an investment/expansion plan, construction, high-volume manufacturing entry, yield, ramp schedule and annual wafer capacity. These are reported as separate facts rather than one "capacity" field.

The report states, among other distinctions:
- first Arizona fab already entered high-volume manufacturing with good yield;
- second fab production schedule was being pulled forward, with HVM expected later;
- third fab construction had begun;
- N2 entered high-volume manufacturing with good yield, while later technologies had future production schedules;
- total annual wafer-equivalent capacity is reported separately from those project milestones.

This supports a generic research rule: announcement -> construction -> qualification -> HVM -> ramp -> usable capacity are not interchangeable.

Academic semiconductor-cycle research also finds inventory, fab utilization and chip sales jointly informative, and earlier industry-cycle work links overcapacity to downturn dynamics. This is mechanism evidence, not a Taiwan stock-return result.

### CAPACITY_EVENT_VINTAGE schema
For company/industry evidence preserve:
- eventId;
- issuer / industry / facility;
- product / process / node / technology / geography;
- eventState from the lifecycle above;
- sourcePublishedAt / knownAt;
- plannedEffectiveAt;
- actualEffectiveAt;
- nameplateCapacity and unit if disclosed;
- available/qualified/economic capacity if explicitly disclosed;
- utilization and denominator definition if disclosed;
- yield/mix if disclosed;
- customerQualification state if relevant;
- capexAmount / currency / period if disclosed;
- expansionPurpose = GROWTH / REPLACEMENT / AUTOMATION / MIGRATION / REDUNDANCY / UNKNOWN;
- revision/supersession;
- confidence / identityResolution;
- PIT eligibility.

Missing values stay UNKNOWN.

### Demand-absorption test
Expansion is potentially supportive only when separately evidenced demand can absorb supply.

Research state:
`CAPACITY_GAP_SUPPORTIVE` requires a conjunction such as:
- demand/sales/order evidence strong or structurally credible;
- inventory not signaling unresolved overhang;
- pricing/margin not deteriorating from oversupply;
- capacity becomes effective within the thesis horizon;
- company/product exposure is verified.

Research state:
`CAPACITY_OVERSHOOT_RISK` is raised when:
- peer capacity is entering simultaneously;
- demand/sales weaken;
- inventory ratio or unsold inventory rises;
- lead times normalize sharply;
- output prices/margins weaken;
- capacity enters before qualification/demand is ready.

Neither state is an automatic buy/sell rule.

### Capex negative controls
A capex increase can represent:
- replacement / maintenance;
- automation;
- technology migration;
- environmental/safety compliance;
- geographic redundancy;
- long-lead construction;
- capacity growth.

Therefore no `capex -> capacity growth` inference is allowed without purpose/effective-date evidence.

The current MOEA `ec.csv` fixed-asset-additions lane is manufacturing-wide aggregate context only. It cannot be used as semiconductor/PCB/basic-metal sector capacity.

### Utilization negative controls
Utilization itself is not monotonic:
- high utilization can mean strong demand, but can also mean a supply bottleneck near the top of the cycle;
- low utilization can mean weak demand, planned maintenance, technology migration, or early ramp;
- utilization across different process nodes/products is not directly comparable;
- yield/mix changes can alter economic output without a proportional utilization move.

### D10-04 maturity decision
Keep `D10-04 產能／擴產／稼動率` at **L2**.

Reason:
- mechanism, lifecycle, schema and falsification are now stronger;
- Taiwan/company PIT evidence is clearly possible on a bounded issuer basis;
- but a canonical industry-wide Taiwan capacity/utilization source with stable cross-company semantics is not yet established;
- promoting to L3 now would overstate coverage.

Status: `MECHANISM_STRONG / BOUNDED_COMPANY_PIT_FEASIBLE / INDUSTRY_WIDE_SOURCE_GAP / NO_PROMOTION`.

### Exact continuation
SC-020: product/material transmission mapping for semiconductor/PCB and basic-metals/process manufacturing.
SC-021: prospective vintage receipt design for official CSV/XML/XLS/ODS.
SC-022: bounded company-capacity pilot requiring at least one positive ramp and one delay/oversupply counterexample before any outcome test.


## SC-020 — Product/material transmission must preserve economic direction

### Why a supply-chain map is not enough
A graph edge such as `MATERIAL -> MANUFACTURER` does not specify whether a price move helps or hurts the target.

For every material/product edge preserve:
- `economicRole = INPUT_COST | SELLING_PRODUCT | BOTTLENECK_INPUT | SUBSTITUTABLE_INPUT | COMPLEMENT | CAPACITY_ENABLER | UNKNOWN`;
- quantity/exposure basis when disclosed;
- pricing basis = SPOT / CONTRACT / INDEXED / NEGOTIATED / UNKNOWN;
- currency;
- typical repricing lag if evidenced;
- sourceKnownAt/effective dates;
- substitution and inventory-buffer state;
- company pass-through evidence;
- confidence and source class.

A material price increase has no universal sign.

---

### Template A — ABF / PCB / IC-substrate material chain

#### Physical structure
Academic packaging literature supports the basic physical distinction:
- ABF build-up film is an epoxy-resin/silica composite dielectric used in IC package substrates;
- copper plating/interconnect is formed on the ABF build-up layer;
- other organic substrate structures can use glass-cloth/resin prepreg and copper-related layers.

Therefore the research graph must distinguish at least:
1. **build-up dielectric material** (ABF or equivalent);
2. **core / laminate materials** such as resin/glass-reinforced CCL where the substrate design uses them;
3. **copper / copper plating / copper foil-related conductive layers**;
4. **process chemicals / plating / desmear / lithography-related materials** where company exposure is verified;
5. **substrate manufacturer**;
6. **OSAT / packaging / chip customer**;
7. **end application** such as AI accelerator/server, networking, CPU/GPU/ASIC, etc., only when product/customer evidence exists.

Do not collapse "ABF substrate" into "ABF film". The film is one material component; the substrate is a multi-layer manufactured product.

#### Economic direction
Examples of research states:
- `ABF_FILM_TIGHTNESS`: possible bottleneck input; can constrain substrate output and raise input costs.
- `COPPER_INPUT_UP`: cost pressure unless selling price/pass-through offsets it.
- `GLASS/RESIN_INPUT_UP`: cost pressure on CCL/core-related nodes unless pass-through exists.
- `SUBSTRATE_ASP_UP_WITH_MARGIN_HOLD`: stronger evidence of pricing power than material price alone.
- `MATERIAL_TIGHTNESS_WITH_CUSTOMER_ALLOCATION`: may indicate demand strength but can cap shipment volume.
- `INPUT_PRICE_UP_MARGIN_DOWN`: negative pass-through evidence.
- `INPUT_PRICE_UP_OUTPUT_PRICE_UP_MARGIN_STABLE`: pass-through evidence.

#### Falsification
Reject a simplistic "material price up = substrate bullish" story when:
- the substrate maker is the buyer of that material;
- pass-through lags or fails;
- customer qualification prevents material substitution;
- higher material cost reduces yield or pushes demand to alternatives;
- inventory buffering delays the economic impact;
- reported substrate demand is concentrated in a product the issuer does not materially supply.

A physical bottleneck can simultaneously signal strong chain demand and hurt the immediate downstream buyer's margin. Preserve both.

---

### Template B — Basic metals / steel process chain

#### Current official Taiwan source feasibility
The Taiwan basic-metals monitoring platform provides current quantity/price series such as:
- Taiwan crude-steel output;
- domestic scrap purchase prices;
- billet prices;
- rebar / section-steel / wire-rod prices;
- international finished/semi-finished steel benchmarks.

The MOEA industrial production/product statistics also provide:
- code 24 basic metals;
- detailed production industries such as 2411 iron/steel smelting and 2413 rolling/extrusion;
- product hierarchy including billets and other steel products.

This is a materially different chain from ABF/PCB because raw materials, semi-finished output and finished output can each have observable market prices.

#### Economic chain
Preserve separate nodes:
`IRON_ORE / COKING_COAL / SCRAP / ENERGY -> MOLTEN/CRUDE_STEEL -> BILLET/SLAB -> HOT-ROLLED / BAR / WIRE / REBAR / SECTIONS -> DOWNSTREAM FABRICATION / CONSTRUCTION / AUTO / MACHINERY`.

Not every producer uses the same route:
- blast-furnace route has different raw-material exposure than electric-arc-furnace route;
- scrap is much more directly relevant to EAF economics;
- iron ore/coking coal exposure is more direct for BF/BOF economics.

Therefore route identity is mandatory before mapping raw-material prices to a company.

#### Spread logic
For process industries, price level alone is inferior to an economically matched spread.

Research descriptor:
`PRODUCT_PRICE - WEIGHTED_INPUT_BASKET`
only when:
- input basket composition is evidenced;
- units/currency are normalized;
- contract/spot lags are respected;
- energy and yield effects are not material UNKNOWNs.

Do NOT create a synthetic "steel margin" by subtracting arbitrary commodity series.

#### Current example is descriptive only
The Taiwan basic-metals monitoring platform currently reports 2026-08 average domestic scrap purchase price, billet price and finished steel price series, and current Taiwan crude-steel output. These prove timely source availability; they do not prove stock-return direction.

#### Falsification
- scrap up can benefit scrap sellers but hurt EAF steelmakers before pass-through;
- finished steel price up can be positive only if input cost / volume / margin confirm;
- low production can be demand weakness or deliberate maintenance/supply discipline;
- high production with rising inventory can signal overhang;
- global steel price rise can be caused by temporary supply disruption rather than Taiwan end-demand;
- anti-dumping/tariff/policy events can break ordinary input-output transmission.

---

### Cross-industry common schema
`PRODUCT_MATERIAL_EDGE_VINTAGE`
- upstreamScopeType / code / product;
- downstreamScopeType / code / product/company;
- economicRole;
- productionRoute / technology;
- exposureMagnitude / basis;
- unit/currency;
- priceBasis;
- repricingLag;
- inventoryBufferDays if disclosed;
- substitutionState;
- qualificationConstraint;
- sourcePublishedAt / knownAt;
- effectiveFrom / effectiveTo;
- sourceId/sourceClass;
- confidence;
- PIT eligibility.

### Negative-control requirement
Every material-price experiment needs at least one control:
1. same sector company with materially different input route;
2. company with low/no verified exposure;
3. price move with no downstream selling-price/margin response;
4. common macro/FX price move after residualizing sector/market context.

If exposed and unexposed controls move similarly, the alleged material transmission is likely common-factor/redundant rather than supply-chain alpha.

### Maturity decision
No tracker promotion from SC-020 alone.

- D10-05 already L3 because Taiwan PIT price-source feasibility is established.
- D10-12 remains L2 because concrete company/theme exposure mapping is not yet a complete PIT database.
- D10-09 remains L2 until asymmetric upstream/downstream transmission is prospectively observed, not merely specified.

Status: `TWO_INDUSTRY_TEMPLATES_DEFINED / DIRECTIONAL_EDGE_SCHEMA_FROZEN / COMPANY_PIT_MAPPING_PENDING`.

### Exact continuation
SC-021: prospective source-vintage receipt for CSV/XML/XLS/ODS.
SC-022: bounded capacity lifecycle pilot with positive and negative counterexamples.
SC-023: map one ABF/PCB material-price chain and one steel-route chain to actual Taiwan issuers using contemporaneous filings, preserving UNKNOWN instead of theme inference.


## SC-021 — Source-vintage receipt separates publication time, effective time and capture time

Canonical machine spec:
`research/industry_source_vintage_receipt_spec_v0_1.json`

### Three clocks must never be collapsed
For industry/supply-chain research preserve separately:

1. `sourcePublishedAt / knownAt` — when the information became available to the market/research process.
2. `effectiveAt` — when the economic event actually starts/stops affecting production, customer/supplier relation, capacity, etc.
3. `capturedAt` — when our research system obtained and froze the source.

Observation month is not knownAt.

### Supply-chain event PIT feasibility
Taiwan official material-information semantics provide a bounded event lane with genuine time meaning.

Official TWSE/TPEx rules include the major-purchaser/supplier cessation event when a purchaser/supplier accounts for at least 10% of prior-year sales/purchases. The disclosure template preserves:
- date of occurrence;
- counterparty name when disclosed;
- prior-year concentration percentage;
- reason and date of suspension;
- company response.

The official ezSearch surface classifies this as M25 and supports announcement/date filtering.

This is sufficient to establish **bounded Taiwan PIT feasibility** for D10-10 even though:
- a complete supply-chain graph is unavailable;
- automated canonical M25 ingestion is still source-access blocked;
- anonymous counterparties remain UNKNOWN;
- no alpha/outcome conclusion exists.

### D10-10 maturity decision
`D10-10 供應鏈事件PIT時間戳: L2 -> L3`.

Reason:
L3 requires Taiwan point-in-time feasibility and time semantics, not full automation. The official event lane contains decision-time publication/event clocks.

Automation readiness remains separately:
`AUTOMATED_M25_SOURCE = SOURCE_ACCESS_BLOCKED`.

### Revision / export rule
For standalone CSV/XML or official XLS/ODS export:
- store raw hash and parser version;
- append revisions rather than overwrite;
- use official release timestamp only when the captured vintage is proven to correspond to it;
- otherwise use capturedAt conservatively as knownAt;
- stale / failed retrieval = UNKNOWN.

### Formal boundary
This is provenance infrastructure only. It changes no Formal candidate, score, threshold, rank, quota, capital, signal, monitoring or push behavior.

Status: `D10-10_L3_PIT_FEASIBLE / AUTOMATION_PARTIAL / NO_ALPHA_CONCLUSION`.


## SC-022 — Capacity lifecycle source-only pilot supports the model but not L3 promotion

Receipt:
`research/capacity_lifecycle_source_pilot_v0_1.json`

### Positive lifecycle example
TSMC's 2025 annual report independently distinguishes:
- investment/expansion plan;
- construction start;
- HVM（High Volume Manufacturing，高量產） entry;
- yield quality;
- future HVM/ramp schedule;
- aggregate annual wafer-equivalent capacity.

This is direct evidence that a trustworthy capacity model needs a status timeline rather than one binary `expanding=true` flag.

### Counterexample / reverse mechanism
Taiwan MOEA industrial-production evidence provides the opposite capacity behavior:
- when steel/basic-metals demand was weak and customer pickup conservative, producers scheduled maintenance or planned production cuts to adjust capacity/output;
- 2026 Q1 reporting likewise notes traditional-industry production restraint/maintenance amid weak demand and overseas competition.

This shows that low output/utilization can be an **endogenous response** to demand weakness rather than an independent supply shock. Conversely, deliberate supply discipline can later support price even while physical output falls.

### Why no L3 yet
These examples establish bounded PIT source feasibility, but the observations are not standardized enough across issuers/industries:
- capacity units differ;
- technologies/nodes/products differ;
- yield and qualification are inconsistently disclosed;
- utilization denominators differ or are absent;
- company plan, industry output and aggregate capex have different scopes.

Therefore D10-04 remains L2.

A future L3 promotion requires a reusable Taiwan source contract with comparable semantics across a bounded multi-company/industry sample, not one famous issuer plus aggregate macro data.

Status: `LIFECYCLE_MODEL_SUPPORTED / CROSS_COMPANY_SEMANTICS_NOT_READY / KEEP_L2`.

### Next
SC-023: actual Taiwan issuer exposure mapping for one ABF/PCB input chain and one steel-process route.
SC-024: evaluate whether issuer capacity disclosures can be normalized into comparable status clocks without inventing utilization.


## SC-024 — Capacity disclosure normalization: status clocks are comparable; utilization is not

### Research question
Can issuer capacity disclosures be normalized into comparable PIT status clocks without inventing utilization?

### Bounded Taiwan issuer evidence
Two Taiwan foundry issuers provide a useful positive/negative semantic pair.

**TSMC / Arizona and N3 expansion**
- 2025 annual-report and 2026 earnings-call disclosures distinguish HVM already achieved, construction complete, tool move-in/installation, future volume-production dates, construction start, technology conversion and aggregate annual wafer-equivalent capacity.
- The same project can therefore move through multiple states over time; a previously announced production year is not immutable truth. Later disclosures may pull schedules forward/back, so revisions must append a new vintage rather than overwrite the old expectation.
- Aggregate annual capacity and project milestone are different denominators/scopes. They must not be joined as though a project-specific utilization rate were disclosed.

**UMC / Singapore Fab 12i P3**
- UMC's April 2025 official release identifies an opened expansion fab, first-phase investment, planned 30,000 wafers/month and production beginning in 2026.
- UMC's 2025 Form 20-F later narrows expected production commencement to 2H26 while preserving design capacity of 30,000 wafers/month.
- This proves that `DESIGN_CAPACITY`, `FAB_OPENED`, `PRODUCTION_EXPECTED` and `HVM/ACTUAL_OUTPUT` are separate facts. An opening ceremony or design capacity is not evidence that saleable production is already online.

### Normalizable clock
Across bounded issuer disclosures, the following event states are reusable:
`PLAN_ANNOUNCED -> CAPEX/PROJECT_COMMITTED -> CONSTRUCTION_STARTED -> CONSTRUCTION_COMPLETE -> TOOL_MOVE_IN/INSTALLATION -> PROCESS_OR_CUSTOMER_QUALIFICATION -> VOLUME_PRODUCTION/HVM -> RAMPING -> STEADY_STATE_AVAILABLE_CAPACITY`.

Each observation must preserve:
- issuer/facility/product/process/geography;
- eventState;
- sourcePublishedAt/knownAt and capturedAt;
- plannedEffectiveAt versus actualEffectiveAt;
- capacityValue/unit and capacityType = DESIGN | NAMEPLATE | AVAILABLE | QUALIFIED | ECONOMIC | ACTUAL_OUTPUT | UNKNOWN;
- revision/supersession link;
- source scope and confidence.

### Strong negative controls
1. `FAB_OPENED != PRODUCTION_STARTED`.
2. `DESIGN_CAPACITY != AVAILABLE_CAPACITY != ACTUAL_OUTPUT`.
3. `CAPEX != CAPACITY`.
4. `HVM_START != FULL_RAMP`.
5. Aggregate issuer capacity cannot be used as the denominator for one facility unless the source explicitly supplies that mapping.
6. Utilization remains UNKNOWN unless both numerator and denominator are explicitly compatible in product/process/time scope.
7. Schedule changes are information events; current schedules must not be backfilled into prior vintages.

### Falsification / bias controls
- No stock returns or post-event performance were inspected.
- No capacity threshold or bullish/bearish sign was fitted.
- Famous-issuer evidence is used only to test semantic normalization, not to infer universal alpha.
- Cross-company unit comparability remains limited: wafer equivalents are not interchangeable with PCB area, substrate panels, tons, MW, units or qualified economic output.
- Qualification/yield disclosure is uneven; missing evidence stays UNKNOWN.
- Expansion can still be replacement, migration, geographic redundancy or demand growth, so purpose remains a separate field.

### Maturity decision
Keep `D10-04 產能／擴產／稼動率` at **L2**.

SC-024 establishes a reusable **status-clock grammar** on bounded Taiwan issuer evidence, but L3 would still overstate cross-company coverage because standardized utilization denominators, qualification/yield and economic-capacity semantics are not broadly available.

Status: `STATUS_CLOCK_NORMALIZATION_FEASIBLE / UTILIZATION_NOT_NORMALIZABLE_YET / REVISION_VINTAGE_REQUIRED / NO_OUTCOME_TEST / FORMAL_UNCHANGED`.

### System implication
Potential System 1/System 2 value is not a new score yet. The concrete improvement target is to prevent false positives such as treating “fab opened”, “capex up” or “design capacity announced” as immediately usable supply. A future research feature should be categorical state + time-to-effective-capacity, never a single binary expansion flag.

This is **not** a `FORMAL_OPTIMIZATION_CANDIDATE`: no prospective/OOS outcome increment, redundancy test or transaction-cost evidence exists.

### Exact continuation
SC-025: define `MATERIAL_TRANSMISSION_RECEIPT` joining input price -> production route -> output/selling price -> volume -> margin with separate knownAt clocks and UNKNOWN semantics.
SC-026: require negative controls for low/no exposure and failed pass-through before any material-transmission outcome test.


## SC-023 — Actual Taiwan issuer material-exposure bridge: route-specific exposure beats theme labels

Machine receipt:
`research/sc023_issuer_material_exposure_bridge_v0_1.json`

### Objective
Instantiate the earlier `PRODUCT_MATERIAL_EDGE_VINTAGE` schema on actual Taiwan issuers without using stock outcomes.

The exercise deliberately uses two very different chains:
- IC substrate / ABF / PCB;
- steel, contrasting integrated BF/BOF with EAF.

The purpose is data and semantic feasibility, not a bullish/bearish ranking.

### ABF / IC-substrate bridge

#### 8046 南亞電路板
Current official company and technology pages establish:
- ABF substrate is an active business line;
- the ABF technology roadmap separately identifies Core/PP and Dielectric material families and material-performance requirements;
- current ABF development is tied to high-performance computing / AI / networking applications.

Safe state:
`ABF_PRODUCT_EXPOSURE = KNOWN`.

Not safe:
- exact ABF material cost share;
- exact ABF-film procurement share;
- realized material pass-through;
- customer-specific revenue;
- current gross-margin sensitivity by material.

Those stay UNKNOWN unless separately disclosed.

#### 3189 景碩科技
Current official pages establish:
- FCBGA and other IC substrates are active products;
- official management messaging refers to large-area, high-layer-count ABF substrates and capacity deployment/customer certification;
- PBGA specifically uses resin-impregnated glass-fiber copper-clad laminate.

Important falsification:
`PBGA_MATERIAL_STRUCTURE != ALL_ABF/FCBGA_MATERIAL_STRUCTURE`.

The PBGA material statement is product-specific and must not be generalized to all high-end substrates.

### Steel route bridge

#### 2002 中國鋼鐵
Official manufacturing-process documentation establishes an integrated route:
- imported coal, iron ore and limestone feed raw-material preparation;
- iron ore/coke/flux feed blast-furnace ironmaking;
- blast-furnace hot metal plus scrap enter converter steelmaking.

Therefore iron ore and metallurgical coal/coke are primary direct route inputs; scrap is also a direct converter input but is not the primary upstream ironmaking feed.

#### 2006 東和鋼鐵
Current official sustainability disclosure establishes:
- 2025 main raw material was 98% scrap;
- EAF electric-arc furnaces melt scrap for structural-steel production;
- domestic scrap purchasing responds to the monthly production plan.

Therefore scrap is a much more direct primary route exposure than for an integrated BF/BOF producer.

### High-value negative control
For a future scrap-price transmission test:

`2006 東和鋼鐵` = HIGH_DIRECT_EAF_SCRAP_EXPOSURE  
`2002 中國鋼鐵` = DIFFERENT_ROUTE / LOWER_PRIMARY_SCRAP_EXPOSURE

But 中鋼 is **not** a zero-scrap control because its converter also consumes scrap.

Required controls:
- steel selling price;
- product mix;
- demand / shipment volume;
- inventory;
- energy;
- market/sector regime;
- contract/spot repricing lag.

This is economically stronger than a generic "same sector company" control.

### Why this matters for ABF too
The same logic applies inside IC substrates:
- 8046 / 3189 can both be called high-end substrate beneficiaries;
- that does not prove identical material recipes, supplier constraints, qualification rules, cost shares or repricing lags.

Theme membership is therefore not an exposure magnitude.

### Maturity reconciliation
SC-025 already recorded:
`D10-12 產業別專用傳導模板: L2 -> L3 DATA_FEASIBILITY_ONLY`.

The canonical tracker had remained L2, while SC-026 already referred to D10-12 as L3. That is a synchronization inconsistency, not new predictive evidence.

SC-023 supplies the missing bounded issuer-level demonstration across two different Taiwan industries and confirms the SC-025 data-feasibility decision.

Decision:
`D10-12 -> L3 PIT_FEASIBLE_BOUNDED`.

Meaning:
- actual Taiwan issuer/product/route mapping is prospectively feasible;
- effective-dated UNKNOWN-safe edges can be constructed;
- universe completeness = NOT proven;
- material-price alpha = NOT proven;
- D10-09 upstream/downstream asymmetry remains L2;
- D10-06 Pricing Power remains L2.

### Exact next continuation
SC-027: create first prospective immutable material-transmission receipt on a new information event, outcome-blind.
SC-028: bind one actual material benchmark to the route-specific issuer edge and preregister lag windows before opening outcomes.
SC-029: accumulate low/different-exposure and failed-pass-through controls across independent dates.

Status: `BOUNDED_ISSUER_PIT_BRIDGE_PASS / D10-12_L3_DATA_FEASIBILITY_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED`.


## SC-027 / SC-028 — First immutable material receipt and lag preregistration

Artifacts:
- `research/sc027_first_material_transmission_receipt_20260930_v0_1.json`
- `research/sc028_material_transmission_lag_prereg_v0_1.json`

### First captured steel transmission state
A prospective-from-capture, outcome-blind EAF material receipt is now frozen for 2006 東和鋼鐵.

Route evidence:
- issuer disclosure identifies EAF production;
- 2025 main raw material was 98% scrap.

Public Taiwan material/output context for 2026-08:
- North Taiwan scrap purchase benchmark: NT$9.8/kg, +2.1% MoM, +18.1% YoY;
- mid-grade billet ex-factory benchmark: NT$15,460/t, -3.5% MoM, +7.8% YoY;
- Tung Ho H-beam distribution benchmark: NT$37,500/t, flat MoM, +12.9% YoY.

Frozen source descriptor:
`INPUT_PRESSURE_WITHOUT_SAME_MONTH_OUTPUT_PRICE_CONFIRMATION`.

Economic sign remains `UNRESOLVED`.

This is **not** a realized margin squeeze claim because the receipt does not yet know:
- actual purchased scrap inventory cost;
- electricity/energy cost;
- yield/conversion cost;
- freight;
- product/customer mix;
- contract repricing;
- realized shipment/ASP;
- issuer margin.

### Pre-registered lags before outcomes
To prevent lag shopping:
- output-price transmission: month 0 / +1 / +2 only;
- issuer fundamentals: first and second issuer-reported quarters whose publication knownAt occurs after material knownAt;
- stock-path horizons, if/when the outcome gate opens: D5 / D20 / D60 only.

No lag may be added after inspecting outcomes without registering a new experiment/version.

### Route contrast
Primary contrast:
- `2006 東和鋼鐵`: high direct EAF scrap exposure;
- `2002 中國鋼鐵`: integrated BF/BOF route with primary iron-ore/coking-coal exposure plus secondary converter scrap.

The latter is a `DIFFERENT_ROUTE` control, not a zero-exposure control.

### Falsification
Material-transmission value is rejected/reclassified if:
- route contrast disappears after market/sector/demand/product-mix controls;
- output price follows input but realized margin does not;
- margin changes are explained by volume/mix/energy/inventory instead;
- the result depends on post-outcome lag changes;
- one episode drives the entire effect.

### Maturity
No new promotion from SC-027/028:
- D10-12 remains L3 data-feasibility;
- D10-09 remains L2;
- D10-06 remains L2;
- outcomes remain closed.

Status: `FIRST_PROSPECTIVE_MATERIAL_RECEIPT_FROZEN / LAGS_PREREGISTERED / WAITING_INDEPENDENT_EVENTS / FORMAL_CORE_LOCKED`.

### Exact next continuation
SC-029: capture the next independent material/output-price vintage and instantiate a failed-pass-through or different-exposure control without outcome peeking.
SC-030: build an ABF/PCB material receipt only after a material benchmark can be mapped to a specific issuer/product scope without assigning generic cost weights.


## SC-030 — Copper is physically relevant to ABF substrates but not a direct issuer cost factor

Artifact:
`research/sc030_abf_copper_benchmark_mapping_v0_1.json`

### Physical role: confirmed
Current issuer/product and packaging evidence support:
- ABF substrate construction has distinct core/PP and dielectric material families;
- ABF itself is an epoxy-resin/inorganic-filler insulating film;
- fine copper interconnections/plating are formed on ABF dielectric layers.

Therefore copper is physically relevant to the substrate structure.

### Public benchmark: available
Taiwan's basic-metals monitoring platform provides current copper market context:
- LME copper spot August 2026 average: US$14,352.5/t, +6.1% MoM, +48.8% YoY;
- Taiwan refined-copper/copper-alloy import unit value June 2026 average: NT$426.7/kg, +3.3% MoM, +47.3% YoY.

### Direct-cost mapping: falsified
The following inference is **not authorized**:

`LME_COPPER_CHANGE -> ABF_SUBSTRATE_COMPANY_COST_CHANGE_X_PERCENT`.

Why:
1. LME copper is not the same economic object as realized copper-foil, plating-metal or chemical-process procurement cost.
2. Physical use does not identify cost weight.
3. Copper is only one material/process family inside an ABF/FCBGA substrate.
4. Issuer procurement contract, inventory buffer, currency/hedge, product mix and yield are unknown.
5. Issuer selling-price pass-through and realized margin are unknown.

### Research semantics
Safe state:
`COPPER_BENCHMARK_CONTEXT = KNOWN`.

Unsafe / UNKNOWN:
- issuer copper cost share;
- substrate material-basket weight;
- immediate procurement-cost change;
- ABF-film price change;
- realized margin effect;
- stock-return sign.

Therefore the correct mapping state is:
`BENCHMARK_PROXY_ONLY / COMPANY_COST_FACTOR_NOT_ESTABLISHED`.

### Negative lesson
A material benchmark can be economically real and still be unusable as a company factor.

This is exactly the type of false precision that D10 must reject before System 1/System 2 integration.

### Maturity
No promotion:
- D10-05 stays L3;
- D10-06 stays L2;
- D10-09 stays L2;
- D10-12 stays L3.

### Exact next continuation
SC-029 remains time-dependent: capture the next independent material/output-price vintage without opening outcomes.
SC-031: seek issuer-disclosed procurement/pass-through evidence that can convert one material benchmark from `PROXY_ONLY` to a bounded exposure state; if cost share/pricing basis remains absent, preserve UNKNOWN rather than estimate it.

Status: `ABF_COPPER_MAPPING_PARTIAL / COST_WEIGHT_UNKNOWN / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED`.


## SC-031 — Pricing power is observable as selective product-level pass-through, not a binary company trait

Artifact:
`research/sc031_pricing_power_selective_pass_through_v0_1.json`

### Official Taiwan issuer evidence
China Steel's current official October / Q4 pricing announcement explicitly links:
- iron ore around USD100/t;
- metallurgical coal rising USD50-65/t to about USD275/t;
- higher steelmaking costs;
- product pricing decisions that also consider international steel prices, downstream conditions and product-specific demand.

The observed pricing matrix is deliberately non-uniform:
- several October monthly products: +NT$500 to +NT$600/t;
- several Q4 quarterly products: +NT$500 to +NT$600/t;
- wire rod, selected hot/cold rolled grades, automotive material and other products: 0 adjustment.

### Mechanism
This creates a direct issuer-level PIT research object:
`INPUT_COST_CONTEXT -> MANAGEMENT_PRICING_DECISION -> PRODUCT_LEVEL_POSTED_PRICE_RESPONSE`.

It is stronger than treating a commodity quote as a company factor because the issuer itself identifies cost pressure and publishes the product-level response.

### Counterevidence
The same announcement falsifies binary pricing-power logic.

Under one common cost backdrop:
- some products increased;
- some stayed flat.

Therefore:
`PRICING_POWER != ONE_COMPANY_ONE_NUMBER`.

Pricing power/pass-through is product-, customer-, contract-, demand- and quote-cycle-specific.

The issuer also cites international market conditions and downstream demand, so the cost shock cannot be isolated as the sole cause of the price changes.

### What remains UNKNOWN
Posted prices do not prove:
- realized transaction ASP;
- discounts/rebates;
- shipment mix;
- inventory-cost vintage;
- energy cost;
- realized gross margin;
- stock-return direction.

A +600 posted-price response can still coexist with margin compression, and a 0 adjustment can coexist with stable margin if input inventory or mix offsets the shock.

### PIT semantics
The current official HTML source is captured prospectively now. A contemporaneous republication dates the announcement to 2026-09-04, but the present official page fetch does not expose a machine-readable publication timestamp. Therefore this receipt does not backfill an authenticated historical firstKnownAt for outcome research.

Future pricing receipts must preserve:
- sourcePublishedAt if explicitly exposed;
- capturedAt;
- firstEligibleDecision;
- product-price matrix;
- input-cost context;
- follow-up realized ASP/margin clocks.

### Maturity
`D10-06 Pricing Power定價能力: L2 -> L3`.

Reason:
a Taiwan issuer's official product-level price announcement proves that pricing/pass-through state can be captured prospectively with product granularity and explicit cost/demand context.

This is **PIT data-feasibility only**:
- no L4 prospective/OOS outcome claim;
- no realized margin-protection claim;
- no permanent positive/negative stock sign.

D10-09 upstream/downstream asymmetry remains L2 pending paired upstream/downstream common-event receipts.

Formal Core unchanged.

### Exact next
SC-032: define `PRICING_POWER_RECEIPT_V0_1` with FULL/PARTIAL/NONE/UNKNOWN pass-through states, product-level matrices and realized-ASP/margin follow-up clocks.
SC-033: accumulate >=3 independent issuer pricing events outcome-blind before testing any pricing-power effect.


## SC-032 — Pricing power requires a multidimensional state vector

Artifact:
`research/sc032_pricing_power_receipt_schema_v0_1.json`

### Design correction
A single `FULL / PARTIAL / NONE` pricing-power label is too lossy before realized outcomes exist.

The state is now decomposed into independent clocks:
1. `costContext`;
2. `postedPriceResponse`;
3. `realizedAspResponse`;
4. `realizedMarginResponse`;
5. `volumeMixResponse`.

Only after compatible evidence exists may the research layer classify an inference as:
- PASS_THROUGH_CANDIDATE;
- FAILED_PASS_THROUGH_CANDIDATE;
- CONFOUNDED;
- NOT_COMPARABLE.

Until then, it remains DESCRIPTIVE_ONLY.

### Key falsification cases
- all posted prices rise but realized ASP is UNKNOWN -> not full pass-through;
- some products rise and some remain 0 -> SELECTIVE, not failure;
- posted price rises while margin compresses -> direct counterevidence against equating posted pricing with margin protection;
- no posted increase while margin stays stable -> cannot infer no pricing power because inventory/mix/input-cost relief may dominate.

### PIT clocks
Separate:
- sourcePublishedAt;
- capturedAt;
- firstEligibleTaiwanDecision;
- input-cost observation time;
- posted-price effective time;
- realized ASP knownAt;
- realized margin knownAt.

No later realized margin can be backfilled into the earlier pricing decision state.

### Maturity
D10-06 remains L3.
The schema improves causal discipline but does not add a new independent event or prospective outcome.

D10-09 remains L2 until paired upstream/downstream common-event receipts exist.

Formal Core unchanged.

### Exact next
SC-033: collect >=3 independent issuer pricing-event receipts outcome-blind using the frozen state vector.
SC-034: only after native publication clocks mature, compare posted-price response with realized ASP/margin on compatible product scope.


## SC-033 / SC-034 — Three-event pricing calibration and cross-industry source-access control

Artifacts:
- `research/sc033_pricing_power_three_event_calibration_v0_1.json`
- `research/sc034_fpcc_pricing_source_access_note_v0_1.json`

### SC-033 — same issuer, three distinct pricing states
China Steel official pricing notices provide a useful source-only calibration sequence:

1. **2026-08 monthly pricing**
   - steelmaking cost remained high;
   - end demand / Asian market were weak;
   - listed monthly products were broadly cut by NT$800/t.

2. **2026-09 monthly pricing**
   - iron ore/metallurgical-coal cost remained high;
   - downstream inventory was healthier and restocking was expected, but traditional demand remained soft;
   - all listed monthly products were unchanged.

3. **2026-10 / Q4 pricing**
   - metallurgical coal rose materially and steelmaking cost pressure increased;
   - global steel prices/supply-demand improved;
   - October monthly products rose NT$500-600/t, while the Q4 matrix remained selective with both +500/+600 and 0 adjustments.

### Falsification
This same-issuer sequence directly rejects a cost-only pricing rule:

`HIGH_INPUT_COST != AUTOMATIC_PRICE_UP`.

Under one issuer:
- high cost + weak demand -> BROAD_DOWN;
- high cost + mixed/soft demand -> FLAT;
- stronger cost pressure + firmer market -> UP, with product heterogeneity.

Therefore Pricing Power is a state interaction, not a fixed company trait.

But this set has an important limitation:
`EVENT_INDEPENDENT != ISSUER_INDEPENDENT`.

It calibrates the state schema; it does not prove cross-company or cross-industry generality.

No stock-return, realized ASP or future margin was used to classify these events.

### SC-034 — cross-industry control candidate deliberately not counted
A 2026 Formosa Petrochemical gasoline/diesel pricing notice was discovered on the issuer's official domain, with search evidence of an effective gasoline wholesale adjustment and explicit references to:
- international oil prices;
- TWD/USD;
- domestic market competition;
- Asian-neighbor lowest-price constraints.

However:
- direct page access triggered browser verification;
- structured fetch failed;
- the complete official product matrix, including exact diesel adjustment, was not captured.

Research decision:
`SOURCE_ACCESS_PARTIAL`.

A search snippet is insufficient to construct a complete issuer pricing receipt.

The event therefore does **not** count toward the different-issuer pricing calibration denominator, and missing exact fields remain UNKNOWN.

### Maturity
D10-06 remains L3.
SC-033 strengthens the state semantics but is same-issuer and historical current-page capture does not authenticate original firstKnownAt.
SC-034 is a source-access control, not positive evidence.

No L4 promotion. D10-09 remains L2.

Formal Core unchanged.

### Exact next
- SC-034: obtain one different-issuer official full pricing event under the SC-032 state vector.
- SC-035: prospectively preserve native sourcePublishedAt/capturedAt on future pricing events.
- Only after compatible product scope and native publication clocks mature may realized ASP/margin be joined.


## SC-036 — Two monthly steel-chain vintages prove asymmetric transmission is PIT-observable

Artifact:
`research/sc036_steel_asymmetric_transmission_two_vintage_v0_1.json`

### Same-chain evidence
Using the Taiwan basic-metals monitoring platform under the previously verified 2006 東和鋼鐵 EAF/scrap route anchor:

2026-08:
- scrap +2.1% MoM;
- billet -3.5% MoM;
- Tung Ho H-beam 0.0% MoM.

State:
`INPUT_UP / INTERMEDIATE_DOWN / DOWNSTREAM_FLAT`.

2026-09:
- scrap NT$10.2/kg, +4.1% MoM, +32.5% YoY;
- billet NT$16,050/t, +3.8% MoM, +15.6% YoY;
- Tung Ho H-beam NT$37,500/t, 0.0% MoM, +12.9% YoY.

State:
`INPUT_UP / INTERMEDIATE_UP / DOWNSTREAM_FLAT`.

### Main conclusion
The upstream shock direction does not mechanically determine same-month downstream price direction.

The intermediate layer also changes behavior across vintages:
- August billet moved opposite scrap;
- September billet moved with scrap;
- downstream H-beam stayed flat in both.

Therefore D10-09 must preserve a vector:
`INPUT / INTERMEDIATE / DOWNSTREAM`,
not one scalar pass-through coefficient.

### Counterfactual firewall
This is not a company-margin claim.

The market benchmarks do not prove:
- issuer realized scrap inventory cost;
- internal billet transfer economics;
- realized H-beam ASP;
- electricity/yield/freight;
- customer/product mix;
- contract lag.

Never compute synthetic gross margin by directly subtracting these differently-scaled benchmarks.

### PIT contract
Each monthly layer is stored under the same observation month, but `capturedAt` remains the conservative research-known clock unless native publication timing is authenticated.

Later revisions append a new vintage and do not rewrite the earlier state.

### Maturity
`D10-09 上游與下游不對稱傳導: L2 -> L3`.

Reason:
two independent Taiwan monthly chain vintages support replayable upstream/intermediate/downstream direction states and already show distinct transmission configurations.

This is Taiwan PIT/source feasibility only:
- no stable elasticity;
- no realized margin conclusion;
- no stock-return sign;
- no L4 prospective/OOS effect.

### Exact next
SC-037: append the next independent steel-chain monthly vintage.
SC-038: add a second three-layer Taiwan industry chain to test whether downstream stickiness is steel-specific.

Formal Core unchanged.


## SC-039 — Taiwan PMI makes orders, lead times and backlog PIT-observable as a multivariate state

Artifact:
`research/sc039_taiwan_pmi_order_leadtime_pit_v0_1.json`

### Official Taiwan source
The 2026-09 Taiwan PMI release, published 2026-10-01 by NDC/CIER, exposes dated industry states for:
- new orders;
- production;
- supplier delivery time;
- unfinished orders;
- inventory;
- customer inventory;
- input prices;
- six-month outlook.

### Electronics counterexample
Electronics/optical September 2026:
- PMI 62.6;
- new orders 56.7, down 10.8 points;
- unfinished orders 54.3, slowest expansion since 2025-12;
- inventory 64.8;
- customer inventory 51.0;
- supplier delivery time 73.8;
- input prices 83.3;
- six-month outlook 62.4, down 6.9 points.

Therefore:
`LONGER_DELIVERY != STRONGER_FRESH_DEMAND`.

Long lead time can coexist with slowing new orders, backlog deceleration, inventory accumulation, customer-inventory normalization and input-cost stress.

### Basic-material contrast
September basic materials:
- PMI 56.7;
- new orders 61.9 (+8.6 points);
- production 61.9;
- supplier delivery 58.3;
- unfinished orders 59.5 (+12.8 points);
- inventory 51.2;
- outlook 59.5;
- input prices 73.8.

This is a distinct state:
`ORDERS_ACCELERATING / BACKLOG_RISING / DELIVERY_RISING / INPUT_COST_PRESSURE`.

The same delivery-time direction can therefore have different economic meaning.

### State-vector rule
Preserve jointly:
`NEW_ORDERS / UNFINISHED_ORDERS / SUPPLIER_DELIVERY / INVENTORY / CUSTOMER_INVENTORY / INPUT_PRICE / OUTLOOK`.

Do not reduce these into one backlog/lead-time score before incremental-value testing.

### PIT semantics
Observation month is not first-known.
For 2026-09:
- source publication date = 2026-10-01;
- prospective decision use begins no earlier than release/capture;
- later revisions append a new vintage.

PMI diffusion indices are industry survey states, not physical order quantities and not company-specific order books.

### Maturity
`D10-07 訂單／交期／Backlog: L2 -> L3`.

Reason:
NDC/CIER monthly Taiwan PMI releases provide dated new-order, unfinished-order, supplier-delivery, inventory and outlook observations with explicit release dates and replayable industry semantics.

This is PIT/source feasibility only:
- no company backlog inference without exposure mapping;
- no bullish sign for longer delivery;
- no predictive/OOS alpha.

D10-08 remains L2 because shortage/supply-gap event classification still needs a dedicated event/source contract rather than being inferred from PMI alone.

### Exact next
SC-040: append monthly ORDER_LEADTIME receipts across independent releases.
SC-041: map one industry state to listed issuers only with independently evidenced product/revenue scope.
SC-042: define a dedicated shortage/supply-gap event contract rather than using high supplier-delivery time as a shortcut.

Formal Core unchanged.


## SC-040 — Three independent Taiwan PMI release vintages freeze order/lead-time states without backfilling

Artifact:
`research/sc040_order_leadtime_multi_release_receipt_202607_202609_v0_1.json`

Three independent official NDC/CIER monthly releases (2026-07, 2026-08, 2026-09) are now frozen as append-only source vintages. The receipt preserves exact release clocks where authenticated and keeps unavailable sector fields as `UNKNOWN` rather than interpolating or forward filling.

Key falsification:
- A high composite PMI does not imply fresh sector demand is accelerating.
- 2026-07 electronics/optical PMI remained high while new orders and production were both 47.7.
- 2026-09 supplier delivery reached 73.8 while new-order momentum slowed, unfinished-order expansion decelerated and inventory rose to 64.8.
- Therefore supplier delivery, backlog and inventory must remain a joint state vector, never a single bullish score.

PIT controls:
- no observation-month backdating;
- no seasonal-adjustment mixing;
- no missing-field imputation;
- revisions append a new vintage.

Maturity: `D10-07 KEEP L3`. This is stronger replayability and common falsification, not L4 outcome evidence.

## SC-041 — Broad industry PMI can map to issuer product exposure, but not directly to issuer backlog or stock score

Artifact:
`research/sc041_pmi_industry_to_issuer_exposure_bridge_v0_1.json`

A bounded issuer bridge is frozen for 8046 南亞電路板 and 3189 景碩 using independently evidenced IC-substrate/electronics product scope. The bridge deliberately keeps revenue exposure magnitude and PMI survey membership as `UNKNOWN`.

Important negative control:
- 8046 is formally classified by TWSE as electronic components while 3189 is semiconductor, despite both having IC-substrate exposure.
- This demonstrates that PMI survey categories, TWSE formal industries and investment themes are different taxonomies.
- The industry state may be used only as broad context until issuer-native revenue/order/backlog evidence exists.

Forbidden inference:
`electronics PMI long delivery -> issuer backlog up -> revenue up -> margin up -> stock bullish` is invalid without issuer-native clocks and exposure denominators.

Maturity: `D10-07 KEEP L3`; `D10-01 KEEP L2`; `D10-12 KEEP L3`.

### Exact next
SC-042: define a dedicated shortage/supply-gap event contract requiring independent demand, constrained-supply, allocation/lead-time, price and inventory evidence.
Prospectively append the next PMI release with native publication/capture clocks. Keep issuer order/backlog and stock outcomes closed until issuer-native disclosures are available.

Formal Core unchanged.


## SC-042 — Shortage / supply-gap events require an explicit multi-dimensional PIT contract

Artifact:
`research/sc042_shortage_supply_gap_event_contract_v0_1.json`

A dedicated Taiwan shortage/supply-gap contract is now frozen. Supplier-delivery time alone is insufficient. A confirmed source-state requires explicit shortage/allocation/capacity-constraint evidence plus at least one operational consequence such as lead-time stress, production-schedule impact, inventory response or input-price pressure. Demand is stored separately and may be strong, weak or mixed.

Official Taiwan evidence makes the contract executable:
- 2026-07: capacity-limited key-material suppliers used selective order acceptance / quota allocation, while electronics/optical new orders and production were both 47.7. This is a direct warning against equating supply stress with uniformly strong end demand.
- 2026-08: official release explicitly records material shortage, allocation, long lead times and rising key-material prices affecting production scheduling.
- 2026-H1 outlook survey: raw-material/key-component shortage and defensive buffering actions are directly observable.
- 2026-09 negative control: delivery time and input prices stayed high while new-order momentum slowed and inventory/customer inventory rose.

This establishes `D10-08 L2 -> L3` for Taiwan PIT/source feasibility only. It does not establish issuer backlog, realized margin or predictive stock alpha.

### Exact next
Accumulate independent future supply-gap events under the same contract; add issuer-native allocation/capacity/order evidence before any company mapping; only then consider prospective/OOS effect tests.

Formal Core unchanged.


## SC-043 — Trade policy needs rule lifecycle plus issuer exposure, not headline tagging

Artifact:
`research/sc043_trade_policy_export_control_transmission_contract_v0_1.json`

D10-13 now has a policy lifecycle:
proposal -> official announcement -> rule publication -> effective date -> transition/license phase -> enforcement -> amendment/exception -> suspension/rescission -> issuer-specific exposure confirmation.

The 2025 U.S. AI Diffusion Rule is retained as a negative-control pattern: a formally issued rule with a future compliance date was later rescinded before enforcement. Therefore policy headline, publication and realized exposure are different clocks.

Required scope dimensions include controlled item/ECCN or product scope, destination, end-use/end-user, ownership/parent-country tests, FDP/de-minimis reach, license policy, exceptions and transition periods.

Maturity: `D10-13 L0 -> L2` for mechanism + falsification only.

## SC-044 — Industrial policy/subsidy must be traced from authorization to physical capacity

Artifact:
`research/sc044_industrial_policy_geopolitical_bottleneck_contract_v0_1.json`

D10-14 freezes a policy-to-capacity lifecycle:
proposal -> authorization -> eligibility -> award -> conditions -> disbursement/tax realization -> capex -> construction/equipment/qualification -> production ramp -> guardrail compliance -> retaliation/countermeasure -> revision/expiry.

Key falsification:
- subsidy authorization/award != operating capacity;
- more subsidized capacity can worsen overcapacity and price competition;
- local labor/power/permitting/compliance constraints can offset benefits;
- retaliation/counter-subsidy can reverse first-order trade effects;
- a subsidized sector is not automatically a good equity return.

Maturity: `D10-14 L0 -> L2` for mechanism + falsification only.

### Exact next
- SC-045: first Taiwan semiconductor export-control exposure receipt using rule text plus issuer-native product/location/customer evidence and a low-exposure/exception negative control.
- SC-046: first Taiwan strategic-industry policy-to-capacity receipt with official program/award plus issuer/facility physical-ramp evidence.
- SC-034/035, SC-037/038 and future SC-040 monthly append lanes remain open and are not overwritten.

Formal Core unchanged.


## SC-045 — Taiwan semiconductor export-control exposure is PIT-feasible

Artifact:
`research/sc045_taiwan_semiconductor_export_control_exposure_v0_1.json`

Current U.S. BIS rule text plus issuer-native Taiwan semiconductor evidence now supports an effective-dated issuer exposure receipt:
- foundry/packaging due-diligence and licensing pathways are transaction/product/end-use/end-user specific;
- Taiwan appears in the relevant authorization-country list, while approved designer/OSAT status creates additional compliance pathways rather than blanket exemption;
- TSMC discloses that January 2025 rules can require licenses for specified shipments using 16nm-or-below processes;
- TSMC Nanjing moved from VEU treatment to an annual export license after the prior authorization expired;
- TSMC's own control process requires ECCN/end-use information and uses a No-ECCN-No-Shipment rule.

Negative controls:
- the AI Diffusion Rule was published with a future compliance date and then rescinded before compliance;
- tighter rules did not mechanically shut TSMC Nanjing because an annual license preserved supply continuity;
- TSMC disclosed no material current operating impact as of the 2025 report date, despite direct policy exposure.

Maturity: `D10-13 L2 -> L3` for Taiwan PIT/replay feasibility only. No issuer outcome or stock Alpha claim.

## SC-046 — Industrial-policy award must be separated from disbursement and operating capacity

Artifact:
`research/sc046_tsmc_arizona_policy_to_capacity_pit_v0_1.json`

TSMC Arizona provides a complete policy-to-capacity clock:
- 2024-04 preliminary non-binding CHIPS terms;
- 2024-11 final award up to US$6.6bn direct funding plus up to US$5bn loans;
- funding is milestone-based rather than instantly realized;
- first Arizona fab entered HVM in 4Q24;
- second fab remained installation/future-HVM;
- third fab construction began in 2025;
- later expansion remains earlier-stage.

Permanent firewall:
`AWARDED_MAX != DISBURSED != SPENT != QUALIFIED_CAPACITY != HVM_OUTPUT`.

Actual disbursement, loan draw and tax-credit realization remain UNKNOWN unless separately disclosed.

Maturity: `D10-14 L2 -> L3` for Taiwan-issuer PIT/replay feasibility only.

Formal Core unchanged.


## SC-049 — Lead-lag identifiability: two sequential vintages are not enough to promote D10-02

Artifact:
`research/sc049_supply_chain_lead_lag_identifiability_audit_v0_1.json`

SC-036 creates a plausible one-month steel-chain lag witness:
- 2026-08: scrap UP / billet DOWN / H-beam FLAT.
- 2026-09: scrap UP / billet UP / H-beam FLAT.

However, two monthly points cannot distinguish true upstream lead-lag from common shocks, inventory timing, contract repricing, sticky downstream prices, electricity/freight/yield changes or independent demand. Monthly averages also do not reveal within-month causal ordering.

SC-039/040 add multi-month order/delivery states but are survey diffusion measures, not bilateral issuer/product propagation clocks.

Decision:
`D10-02 KEEP L2`.

Promotion requires multiple independent sequential vintages/chains, ex-ante lag candidates, compatible clocks, common-shock and contract-reset controls, and negative controls. No post-hoc "best lag" selection is allowed.

Exact next:
SC-050 append another steel-chain vintage and pre-freeze 1M/2M/3M lag candidates; add a second non-steel three-layer chain.

Formal Core unchanged.


## SC-047 — Current BIS policy vintages add parentage and entity-authorization semantics

Artifact:
`research/sc047_bis_policy_vintage_append_20261004_v0_1.json`

Current 2026 BIS vintages add two important exposure dimensions:
- May guidance confirms certain advanced-computing controls follow headquarters / ultimate-parent identity, not only physical destination.
- July EAR changes provide favorable treatment to specified UAE entities and named U.S.-headquartered AI companies, showing that restriction intensity can loosen selectively.

This receipt is explicitly NOT prospective because these policy vintages predate the current research capture. Future policy changes from this point must be appended prospectively.

D10-13 remains L3.

## SC-048 — GlobalWafers is the second Taiwan policy-to-capacity issuer control

Artifact:
`research/sc048_globalwafers_policy_to_capacity_control_v0_1.json`

GlobalWafers provides an independent issuer case:
- 2024 preliminary CHIPS terms: up to US$400m direct funding.
- 2024 final award: up to US$406m, milestone-based disbursement, supporting Texas/Missouri wafer projects.
- 2026 U.S. Commerce summary: company U.S. capital commitment reported at US$7.94bn versus US$3.94bn previously.

Critical negative control:
the current official GlobalWafers locations page still carries stale "Coming in 2024" wording for the Sherman 300mm facility. That page can verify facility/product identity, but it cannot authenticate current HVM timing.

Therefore:
capital commitment increase != direct award increase != actual disbursement != qualified/HVM capacity.

D10-14 remains L3; second-issuer robustness improves but L4 is not justified.

Formal Core unchanged.


## SC-052 — Cross-industry issuer-native capacity contract clears bounded D10-04 L3

Artifact:
`research/sc052_cross_industry_capacity_source_contract_v0_1.json`

The previous blocker was not "capacity is impossible to study"; it was that one issuer plus aggregate macro evidence did not establish a reusable Taiwan issuer-capacity source contract.

SC-052 now has three deliberately different controls:

1. TSMC:
   - 2025 annual managed manufacturing capacity exceeded 17 million 12-inch-equivalent wafers;
   - actual 2025 wafer shipments were 15.0 million 12-inch-equivalent wafers;
   - shipment / capacity therefore supplies only a bounded throughput-to-capacity upper-bound context, NOT official utilization;
   - Arizona Fab 1 HVM and later-fab construction/installation states preserve lifecycle timing separately.

2. China Steel:
   - CSC four blast furnaces are disclosed at about 9.9 million tonnes crude-steel annual capacity;
   - 2025Q1 CSC stand-alone crude-steel production was about 1.993 million tonnes;
   - annualizing the quarter gives an approximately 80.5% nominal-output-to-capacity proxy, but this remains explicitly synthetic and seasonality/maintenance sensitive;
   - issuer disclosures separately state low-utilization/aged lines are being consolidated, sealed or retired, with No.1 blast furnace retirement planned no later than 2029Q1.

3. GlobalWafers:
   - policy/facility identity is known;
   - current qualified capacity, HVM and utilization remain UNKNOWN because source freshness is insufficient;
   - this is the missing-denominator negative control.

Reusable contract:
`CapEx != nameplate capacity != available capacity != qualified capacity != actual production != shipment != official utilization`.

Maturity decision:
`D10-04 L2 -> L3` for bounded Taiwan PIT/source feasibility only.

Why no L4:
- no prospective/OOS capacity-state outcome evidence;
- official utilization denominators are still incomplete;
- cross-industry numeric ratios are not one comparable factor;
- no revenue/margin/market-share/stock-return join is opened.

Exact next:
SC-053 prospectively append issuer-native capacity/production/HVM vintages; obtain at least one issuer-reported true utilization-rate case and one delay/cancellation/low-utilization control before any L4 test.

Formal Core unchanged.


## SC-050 / SC-054 — Prefrozen lag replay falsifies the attractive short-window steel lead-lag

Artifacts:
- `research/sc050_supply_chain_lead_lag_three_vintage_cross_chain_falsification_v0_1.json`
- `research/sc054_steel_prefrozen_lag_six_vintage_falsification_v0_1.json`

### Why this stage matters

SC-049 froze 1M / 2M / 3M lag candidates before this stage. The new evidence therefore cannot choose a prettier lag after seeing the result.

SC-050 first added:
- a third Taiwan EAF steel-chain vintage (2026-07) from MIRDC Basic Metals report issue 60;
- a second non-steel monthly demand-transmission candidate using MOEA export orders and industrial production;
- explicit common-shock, inventory and publication-clock controls.

The initial three-month steel view looked tempting:
- July scrap DOWN -> August billet DOWN;
- August scrap UP -> September billet UP.

That was 2/2 concordance at 1M, but it was explicitly kept as suggestive only.

SC-054 then read previously unused April-June steel vintages without changing the frozen lag set.

### Six-vintage steel chain

| Month | North-Taiwan scrap MoM | Billet MoM | Tung Ho H-beam MoM |
|---|---:|---:|---:|
| 2026-04 | +5.2% | -2.5% | +2.3% |
| 2026-05 | +2.0% | +1.7% | +2.2% |
| 2026-06 | -3.9% | -1.4% | +2.2% |
| 2026-07 | -4.0% | +1.2% | 0.0% |
| 2026-08 | +2.1% | -3.5% | 0.0% |
| 2026-09 | +4.1% | +3.8% | 0.0% |

Frozen scrap -> later billet direction replay:
- 1M: 3/5 concordant = 60%;
- 2M: 2/4 concordant = 50%;
- 3M: 1/3 concordant = 33.3%.

The original 2/2 one-month pattern therefore fails robustness immediately once the earlier held-back vintages are added.

This is not a failed research round. It is a successful falsification of short-window pattern seduction.

### Downstream stickiness is material

H-beam:
- UP in April, May and June;
- FLAT in July, August and September.

A scrap/billet move therefore does not mechanically propagate into the downstream monthly H-beam price. Contract/posting cadence, inventory, demand and price discipline remain necessary explanations.

### Second non-steel candidate: electronics demand transmission

MOEA monthly chain candidate:
electronic-product export orders
-> electronic-components production
-> computer/electronic/optical production.

June / July / August export-order MoM:
+8.7% / +2.0% / +10.7%.

Electronic-components production MoM:
+1.08% / -0.73% / +10.36%.

Computer/electronic/optical production MoM:
+5.88% / +12.79% / -13.46%.

Therefore a simple same-month or obvious fixed one-month direction is not present.

More importantly, MOEA narratives explicitly identify AI/HPC/cloud demand as a common driver across several electronics layers. Export orders also include overseas production and product-order taxonomies are not a one-to-one physical supplier graph.

This candidate is useful as falsification/common-shock evidence, but is not accepted as the required second physical three-layer chain.

### PIT / source-clock rule

MOEA order and production releases are separately timestamped. A production release published after an order release may not be backfilled into the earlier order-decision state.

MIRDC monthly steel reports are available after their reference months. Existing SC-036 remains conservative where native first-publication time is not frozen: use capturedAt unless a native knownAt/publication clock is separately preserved.

### Maturity decision

D10-02 remains L2.

Why no L3:
- all three prefrozen steel lags are unstable in six-vintage replay;
- adjacent monthly pairs are serially dependent, not independent episodes;
- the second electronics candidate falsifies a universal fixed-lag story but is not a clean physical supplier graph;
- comparable first-known clocks are not uniformly frozen across all steel vintages;
- common-demand, inventory, seasonality and contract-reset alternatives remain material.

D10-09 remains L3. The new data strengthen asymmetric-transmission/data-feasibility evidence but do not create L4 prospective outcome evidence.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core unchanged.

### Exact next

SC-055:
- build a genuinely physical non-steel three-layer chain;
- require effective-dated product/exposure semantics and compatible monthly source clocks;
- continue future steel vintages with the unchanged 1M/2M/3M set;
- if no chain-specific relation survives inventory, seasonality, contract-reset and common-shock controls, reject the generic fixed-lag hypothesis rather than endlessly adding data.

## SC-055 — Physical non-steel chain falsifies a generic fixed monthly lead-lag

Artifact:
`research/sc055_physical_nonsteel_three_layer_chain_replay_v0_1.json`

### Why this closes the SC-054 physical-graph gap

SC-055 replaces the prior aggregate electronics demand candidate with a genuinely physical Taiwan product-family chain:

copper foil (2433-020)
-> copper-clad laminate / CCL (2630-010)
-> printed circuit board / PCB excluding IC substrate (2630-040).

TPCA member descriptions identify copper foil as a principal CCL raw material and CCL as material supplied to PCB manufacturers; ITRI independently describes CCL as a principal PCB material. This clears a bounded product-family physical-flow gate, not issuer-level supplier/customer identity.

All three monthly series are available from the MOEA Industrial Production, Shipment & Inventory Statistics Survey. The 2025 annual report provides production, shipment and inventory histories, but is an ex-post historical replay: native first-known publication clocks for each 2025 month are not frozen by the annual report.

### Prefrozen replay rule

SC-049 had already frozen 1M / 2M / 3M lag candidates. SC-055 keeps that set unchanged and uses month-over-month production direction as the primary edge-wise metric. The two physical edges must be reported separately; a lag may not be promoted because it looks best on only one edge.

### 2025 primary replay

Copper foil -> CCL production-direction concordance:
- 1M: 4/10 = 40.0%.
- 2M: 6/9 = 66.7%.
- 3M: 4/8 = 50.0%.

CCL -> PCB production-direction concordance:
- 1M: 5/10 = 50.0%.
- 2M: 4/9 = 44.4%.
- 3M: 5/8 = 62.5%.

No single prefrozen lag is stable across both physical edges. The 2M candidate looks strongest only on copper foil -> CCL while weakening on CCL -> PCB; the 3M candidate looks stronger on CCL -> PCB while copper foil -> CCL is only 50%.

A secondary upstream-shipment -> downstream-production sensitivity check also flips the best-looking lag across edges, so it does not rescue a generic fixed-lag interpretation.

### Falsification / controls

- Cross-layer levels are not ratio-comparable because copper foil uses metric tons while CCL/PCB use square feet.
- Inventory can absorb or release upstream production before downstream production changes.
- Common end-demand can move multiple layers together; monthly concordance is not causal proof.
- Product-family data do not establish issuer-matched supplier/customer quantities.
- Adjacent monthly pairs are serially dependent and the 2025 window remains small.
- The annual report is ex-post; prospective PIT use still requires native sourcePublishedAt/capturedAt.
- No stock return, revenue, margin or company-score outcome is opened.

### Maturity decision

D10-02 remains L2.

SC-055 removes the prior physical-graph blocker, but the relation itself still fails the promotion gate: no common stable 1M/2M/3M lag survives both physical edges, native monthly PIT clocks are not frozen, and inventory/common-demand alternatives remain material.

D10-09 remains L3. The physical cross-chain falsification strengthens the asymmetric-transmission research contract but does not create L4 prospective/OOS outcome evidence.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core unchanged.

### Exact next

SC-056:
- prospectively append the same copper-foil -> CCL -> PCB chain from native monthly MOEA releases with sourcePublishedAt/capturedAt frozen before later outcomes;
- keep 1M/2M/3M and production-direction primary semantics unchanged;
- continue future steel-chain vintages under the same frozen lag set;
- if independent future physical chains continue to show edge-specific or unstable lag behavior, reject generic fixed-lag supply-chain timing and retain only chain-specific contextual states.



## 00 routed COV-06 exact remaining delta — 2026-10-04

COV-06 remains PARTIAL. Do not repeat supply-chain map / lead-lag / issuer-exposure research.

Exact remaining topology delta:
1. define topology-specific graph schema: node, directed edge, edge weight and effective-dated relation;
2. define articulation/single-point-failure and alternate-path redundancy/resilience;
3. distinguish concentration from topology;
4. preserve substitutionState / qualificationConstraint / incomplete-graph UNKNOWN;
5. produce at least one Taiwan effective-dated graph witness where alternate-source semantics are known;
6. compare topology information against D10-01 mapping, D07 concentration and D17 propagation;
7. choose exactly one terminal recommendation;
8. commit `research/COV06_D10_SPECIALIST_RETURN_V0_1.md`.

No maturity or Formal change is authorized by this routing.


## SC-057 — TSMC qualified multi-source topology receipt (2026-10-07)

Artifact:
- `research/SC057_TSMC_QUALIFIED_MULTISOURCE_TOPOLOGY_RECEIPT_20261007_V0_1.md`

Result:
- official TSMC annual-report evidence supports raw-wafer multiple sourcing plus stringent supplier quality certification/specification conformance;
- this is sufficient for a bounded `QUALIFIED_ACTIVE_MULTISOURCE` state at anonymized supplier-class level;
- anonymized identities, unknown spare capacity/switch time and hidden tier-2/tier-3 dependencies prevent a replayable articulation-point claim;
- therefore `D10-01` remains L2/40 and articulation remains `UNKNOWN`;
- no stock outcome, ranking, Formal gate, capital or signal behavior is changed.

Exact next:
- SC-058 seek an issuer-native graph with distinguishable supplier/site/path identities sufficient to test whether alternatives are actually disjoint after one node/edge removal;
- require one explicit qualification/switching constraint and effective-dated capture clocks;
- if public disclosure remains anonymized, freeze the negative conclusion that qualified multi-source state is observable but replayable articulation topology is not.


## SC-058 — TSMC named raw-wafer first-tier node-removal topology (2026-10-07)

Artifact:
- `research/SC058_TSMC_NAMED_WAFER_FIRST_TIER_NODE_REMOVAL_TOPOLOGY_20261007_V0_1.md`

Official TSMC 2022 annual-report evidence identifies six major raw-wafer suppliers and simultaneously requires stringent wafer-supplier quality certification/specification conformance.

Bounded conclusion:
- distinct first-tier supplier identities are observable;
- multiple qualified first-tier procurement routes are source-supported;
- removal of any one named first-tier supplier does not remove all disclosed first-tier connectivity;
- therefore `FIRST_TIER_REDUNDANCY_SUPPORTED`.

Critical firewall:
- hidden common upstream dependencies, spare capacity, allocation, switching time and tier-2/tier-3 topology remain unknown;
- therefore `FULL_NETWORK_ARTICULATION_UNKNOWN`;
- `FIRST_TIER_NODE_REDUNDANCY != FULL_NETWORK_RESILIENCE`.

Maturity:
- `D10-01` remains L2/40;
- exact original publication/knownAt clock is not yet verified for historical PIT replay;
- no Formal change and no outcome opening.

Exact next:
- SC-059 seek a deeper-layer/common-mode Taiwan witness that can falsify naive first-tier redundancy: shared material/site/geography/utility/logistics/process dependency, or an alternate-source qualification/switching-delay constraint.


## SC-059 — TSMC common-mode dependency firewall (2026-10-07)

Artifact:
- `research/SC059_TSMC_COMMON_MODE_DEPENDENCY_FIREWALL_20261007_V0_1.md`

Issuer-native risk disclosures establish that first-tier supplier count cannot close topology risk:
- supplier assessment explicitly considers supplier location and single procurement source / market-share concentration;
- business-continuity risk separately includes water, electricity, natural gas, critical facilities/equipment, natural hazards and supply-chain disruption.

Frozen rule:
`FIRST_TIER_REDUNDANCY_SUPPORTED + COMMON_MODE_UNKNOWN => FULL_NETWORK_RESILIENCE_UNKNOWN`.

The evidence does not identify one exact shared hidden node across all named raw-wafer suppliers; therefore full-network articulation remains `UNKNOWN`.

Maturity:
- `D10-01` remains L2/40;
- no aggregate promotion;
- no stock outcome or Formal change.

Exact next:
- SC-060 seek one official Taiwan issuer disruption event where an alternate source/path is actually attempted and qualification/capacity/geography/switching delay determines whether redundancy works;
- preserve event clocks and keep stock outcomes closed.
