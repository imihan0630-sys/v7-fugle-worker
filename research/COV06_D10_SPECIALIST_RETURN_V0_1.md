# COV-06 D10 Specialist Return V0.1

Status: SPECIALIST_VALIDATION_COMPLETE / EXTEND_EXISTING_SCOPE
Updated: 2026-10-04 Asia/Taipei
Owner room: 07｜產業與供應鏈研究室
Domain: D10
Candidate: COV-06 — Supply-chain Network Centrality / Single-point Failure / Resilience
Observed authoritative main before write: `1763e905fd9f1affb951643920c767c2108adcd4`

## Terminal recommendation

`EXTEND_EXISTING_SCOPE`

Extend `D10-01`（上下游供應鏈圖譜） to explicitly own effective-dated supply-network topology, node/edge criticality, articulation/single-point-failure, qualified alternate-path redundancy and topology-resilience state.

Do **not** add a new module.

`D10-12` remains the consumer/bridge for industry-specific transmission and issuer exposure mapping. It may reference the topology state from `D10-01`, but must not independently recompute or double-count topology criticality.

No maturity promotion is authorized by this return. Formal Core remains unchanged.

---

## 1. Exact knowledge definition

COV-06 is the effective-dated structural state of a supply network, not merely a supplier list or concentration ratio.

Minimum graph object:

- node: issuer, supplier, customer, production site, logistics hub, material/product class or other explicitly typed supply-chain entity;
- directed edge: a dated supply/production/transport/qualification relation from upstream to downstream;
- edge weight: only a source-supported quantity such as procurement share, capacity share, shipment share, revenue exposure or bounded ordinal importance; otherwise `UNKNOWN`;
- `knownAt`: first-known/captured evidence clock;
- `effectiveFrom` / `effectiveTo`: effective-dated relation interval when source-supported;
- `substitutionState`: `QUALIFIED_ACTIVE`, `QUALIFIED_STANDBY`, `UNQUALIFIED_CANDIDATE`, `NOT_SUBSTITUTABLE`, or `UNKNOWN`;
- `qualificationConstraint`: technology, specification, customer approval, geography, lead-time, capacity, regulation, tooling, quality or other explicit switching constraint;
- `evidenceCompleteness`: complete/bounded/incomplete and the reason.

Topology-specific states:

1. articulation / single-point failure:
   removal of a node or edge disconnects an otherwise source-supported path from an upstream input to the focal production/output node;
2. alternate-path redundancy:
   two or more independently qualified paths remain after removal of one node/edge;
3. resilience:
   a structural property of retained connectivity plus substitution feasibility, not a synonym for low supplier concentration;
4. incomplete graph:
   topology metrics that require hidden identities or hidden qualification links are `UNKNOWN`, never inferred from absence.

The graph layer is descriptive/research context until prospective/OOS evidence proves incremental stock-selection value.

---

## 2. Existing-module overlap matrix

| Existing owner | Current semantic owner | COV-06 overlap | Required boundary |
|---|---|---|---|
| `D10-01` | upstream/downstream supply-chain mapping | direct and primary | Extend here: graph topology, node/edge criticality, alternate qualified paths, substitution constraints, effective dating |
| `D10-12` | industry-specific transmission and issuer-exposure mapping | downstream consumer | Consume one parent topology receipt; do not create a second topology vote |
| `D07` concentration/fundamental lanes | customer/supplier/economic concentration | partial but distinct | Concentration measures exposure magnitude/distribution; it does not prove network connectivity or substitutability |
| `D17` propagation/event lanes | realized disruption/news propagation | related but distinct | D17 owns observed event propagation clocks; D10-01 owns pre-event structural vulnerability/topology state |
| `D10-08` | shortage/supply-gap events | event-state input | Shortage can test topology consequences but is not itself a topology score |
| `D10-10` | supply-chain PIT timestamps | clock dependency | Reuse clock contract; do not duplicate PIT logic |

---

## 3. Why current scope is insufficient

The current D10 curriculum already covers mapping, issuer exposure, shortages and asymmetric transmission, but does not explicitly distinguish:

- a high-share supplier from an articulation node;
- two nominal suppliers from two truly qualified alternate paths;
- multiple plants owned by one supplier from independent supplier redundancy;
- alternate supplier existence from immediately switchable qualified capacity;
- absence of an observed edge from evidence that no edge exists.

Without this layer, a conventional supply-chain map can overstate resilience and a concentration metric can overstate or understate structural criticality.

Example falsification:

- Network A: supplier S1 = 60%, S2 = 40%, but S2 is fully qualified and has spare capacity. Concentration is high, topology may still retain a viable alternate path.
- Network B: five first-tier suppliers appear diversified, but all depend on the same sole-source upstream chemical plant. First-tier concentration is low, yet the hidden upstream plant can be a single point of failure.

Therefore concentration and topology must be separate research objects.

---

## 4. Taiwan source/data feasibility

### Taiwan witness A — UMC, 2025 critical-material multi-source state

Official UMC Business Continuity Management page reports for 2025:

- critical-material multiple-source supply ratio reached 90.1%;
- new suppliers were introduced to raise the multiple-source ratio to 90.1%;
- raw-material shortage is explicitly treated as a business-continuity risk.

Official UMC supplier-management material further states that alternative sources are investigated across alternative suppliers, regions/countries and alternative raw materials, and that alternative suppliers have been identified in non-conflict-affected/high-risk areas.

This is a genuine Taiwan issuer-native witness that alternate-source semantics exist and are managed as a resilience property.

PIT limitation:
- the source supports a 2025 achievement/state;
- unless a native publication timestamp is independently preserved, historical `knownAt` before the current capture must remain `UNKNOWN`;
- the public source does not reveal a complete per-material supplier-identity graph, so exact articulation nodes for all critical materials cannot be computed.

Therefore the witness proves **topology semantics/data feasibility**, not a complete issuer graph.

### Taiwan witness B — TSMC raw-wafer multi-source procurement

TSMC's official 2024 annual-report web page states that raw wafers are procured from multiple sources, suppliers are subject to quality certification, and the procurement strategy explicitly uses multiple sourcing to manage supply risk. It also states that many suppliers operate across multiple geographic locations.

This independently confirms that source count, qualification and geographic redundancy can be disclosed by Taiwan issuers, while supplier identities may remain anonymized.

### Feasibility conclusion

`TAIWAN_PIT_TOPOLOGY_STATE_FEASIBLE_BOUNDED`

Feasible fields include:
- explicit multiple-source state;
- material/product class;
- supplier qualification requirement;
- geography/source diversification;
- disclosed alternative-source existence;
- issuer-native resilience target/achievement;
- publication/capture clocks when observable.

Commonly unavailable:
- exact supplier identity by material;
- exact edge weights;
- spare capacity;
- switching time;
- customer requalification constraints;
- tier-2/tier-3 hidden dependencies.

Unavailable fields remain `UNKNOWN`.

---

## 5. PIT / replay implications

Every topology receipt must be append-only and vintage-aware.

Required minimum receipt:
- `issuer`
- `nodeId` / `nodeType`
- `edgeId`
- `fromNode`
- `toNode`
- `relationType`
- `materialOrProductScope`
- `edgeWeight`
- `weightUnit`
- `substitutionState`
- `qualificationConstraint`
- `effectiveFrom`
- `effectiveTo`
- `sourcePublishedAt`
- `capturedAt`
- `sourceUrl`
- `sourceHash`
- `evidenceCompleteness`
- `missingReason`

Replay rule:
- compute topology only from edges known by the decision clock;
- never backfill a later-disclosed alternate supplier into an earlier graph;
- never convert an anonymous “multiple source” statement into fabricated supplier nodes;
- if a graph is incomplete, articulation/path-redundancy state that depends on missing identities is `UNKNOWN`.

---

## 6. Decision role

Primary role: `CONTEXT_AND_RISK_STRUCTURE`.

Potential future role, only after preregistered incremental validation:
- strategy interaction / veto context during explicit disruption regimes;
- risk penalty for verified single-point-failure exposure;
- resilience context for supply-chain event propagation.

Not authorized now:
- standalone buy score;
- generic bullish score for “more suppliers”;
- fixed timing signal;
- Formal Core promotion.

---

## 7. Recommended action

Exactly one terminal action:

`EXTEND_EXISTING_SCOPE`

Proposed canonical scope extension:
- expand `D10-01` from “上下游供應鏈圖譜” to include effective-dated network topology / critical-node / alternate-path / resilience semantics;
- retain `D10-12` as the issuer-exposure/transmission consumer rather than a second owner;
- module count does not increase.

---

## 8. Proposed owner room

07｜產業與供應鏈研究室

Canonical owner:
- `D10-01`

Dependencies:
- `D10-10` for PIT clocks;
- `D10-12` for issuer exposure consumption;
- `D17` for realized disruption/event propagation;
- relevant `D07` concentration lanes for economic concentration controls.

---

## 9. Anti-double-count rule

1. One parent topology receipt per effective-dated graph state.
2. Concentration is not topology:
   procurement/revenue/share concentration remains a separate exposure primitive.
3. Multiple sourcing is not automatically redundancy:
   only qualified/substitutable alternate paths count as resilience evidence.
4. D17 disruption propagation cannot become a second topology vote.
5. D10-12 may use D10-01 topology as a dependency, but may not duplicate its criticality score.
6. If the same disclosure supplies concentration, topology and event fields, each child state points to the same parent evidence receipt.
7. Missing supplier identities or qualification constraints force topology metrics to `UNKNOWN`; no “no edge” or “safe network” inference from incomplete disclosure.

---

## 10. Maturity starting point / curriculum effect

No new module is created, so there is no new L0 module.

Existing maturity remains unchanged by this specialist return:
- `D10-01`: L2 / 40%;
- `D10-12`: L3 / 60%;
- D10 domain maturity unchanged.

If 00 governance accepts the scope extension, D10-01 must still earn any future promotion through Taiwan PIT graph receipts and independent-date/OOS/prospective evidence. The existence of this definition and one bounded issuer witness does not by itself justify L3.

---

## Evidence and counter-evidence

### Supporting mechanism

Network research distinguishes local node/edge failures from network-level disruption and shows that connectivity, critical nodes and alternative paths can materially alter resilience. An articulation point is structurally important because removing it increases network disconnection. Redundant nodes/links and rewiring can improve robustness.

### Counter-evidence / limitations

- Public issuer disclosures are structurally incomplete.
- Named first-tier suppliers do not reveal shared hidden tier-2/tier-3 bottlenecks.
- “Multiple source” does not prove spare capacity or immediate substitutability.
- Qualification/customer approval can make a nominal alternate source unusable at the decision clock.
- A structurally redundant network can still fail under common-mode shocks affecting all alternatives.
- Topology variables may be strongly redundant with size, geography, supplier concentration or industry state.
- No stock-selection alpha is established by this packet.

---

## Source set

Official Taiwan issuer sources:
- UMC Business Continuity Management: https://www.umc.com/en/Html/business_continuity_management
- UMC Supplier and Contractor Management: https://www.umc.com/en/Html/supplier_and_contractor_management
- TSMC 2024 Annual Report web page, raw-material supply section: https://investor.tsmc.com/static/annualReports/2024/english/ebook/files/basic-html/page109.html

Method references:
- Kim, Chen & Linderman, 2015, Journal of Operations Management, “Supply network disruption and resilience: A network structural perspective”, DOI 10.1016/j.jom.2014.10.006.
- Tian et al., 2017, Nature Communications, “Articulation points in complex networks”, DOI 10.1038/ncomms14223.
- Li et al., 2020, International Journal of Production Economics, “Network characteristics and supply chain resilience under conditions of risk propagation”, DOI 10.1016/j.ijpe.2019.107529.
- Roshani, Walker-Davies & Parry, 2024, Annals of Operations Research, systematic review of resilient supply-chain network design.
- 2025 complex-network supply-chain resilience work supports critical-node/connectivity evaluation and redundant-node/network-reconstruction mitigation; it is used as mechanism support only, not Taiwan evidence.

---

## Exact next continuation point

For 00 governance:
- ingest this specialist return;
- if accepted, atomically extend the canonical `D10-01` learning scope without adding a module and preserve the D10-12 dependency boundary.

For 07 research:
- do not wait for COV-06 governance;
- continue the existing D09/D10 exact-next research lanes;
- SC-056 Playwright engineering remains locally verified but cloud-CI source-blocked and does not promote maturity;
- the next topology-specific evidence task after governance acceptance is to freeze an append-only Taiwan issuer graph receipt with at least one explicitly qualified alternate path and one explicit qualification constraint; until identities/path completeness are sufficient, articulation state remains `UNKNOWN`.

Formal Core unchanged.
