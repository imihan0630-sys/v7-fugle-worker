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


## SC-025 / SC-026 — Material transmission PIT receipt and negative controls

Canonical artifacts: `research/material_transmission_receipt_v0_1.json` and `research/material_transmission_negative_controls_v0_1.json`.

SC-025 freezes the chain `INPUT_PRICE -> PRODUCTION_ROUTE_EXPOSURE -> OUTPUT_SELLING_PRICE -> VOLUME -> MARGIN`. Every node keeps its own observation period, sourcePublishedAt, capturedAt, knownAt and effectiveAt. Missing intermediate evidence remains UNKNOWN. Input-price increases have no universal stock sign; output-price increases are not realized margin capture; current production routes cannot be backfilled historically.

Bounded Taiwan evidence establishes PIT feasibility for the grammar without opening stock-return outcomes. Therefore `D10-12 產業別專用傳導模板` advances L2 -> L3 for data feasibility only. D10-09 and D10-04 remain L2. This is not an alpha claim.

SC-026 freezes two mandatory negative-control families before outcomes: `LOW_OR_NO_EXPOSURE_CONTROL` and `FAILED_PASS_THROUGH_CONTROL`. UNKNOWN exposure cannot be relabeled no exposure; announced price increase != realized ASP != margin capture. Before any outcome join, freeze benchmark/grade, economic role, clocks, lag windows, control eligibility, matching variables, horizons, costs and regime strata. Falsify the proposed transmission if the same effect appears in low/no-exposure controls, disappears after pass-through/mix controls, is dominated by one date/mega-cap, depends on ex-post lag choice, or is redundant with sector RS/market regime/price trend.

Status: `SC025_PIT_FEASIBLE / SC026_NEGATIVE_CONTROLS_FROZEN / OUTCOMES_CLOSED / FORMAL_UNCHANGED`.

### Exact continuation
SC-027: accumulate prospective immutable `MATERIAL_TRANSMISSION_RECEIPT` rows on independent dates; do not fabricate historical Shadow. Keep outcome joins closed until PIT eligibility, preregistered lag/control matching and native reporting clocks pass. D09 BR-030 may open only on valid post-V8.14 prospective sector-gate receipts; otherwise continue source/readiness work without outcome peeking.
