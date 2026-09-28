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
