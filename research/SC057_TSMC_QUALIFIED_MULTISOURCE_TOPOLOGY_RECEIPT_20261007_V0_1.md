# SC-057 — TSMC Qualified Multi-Source Topology Receipt V0.1

Status: RESEARCH_ONLY / APPEND_ONLY_TOPOLOGY_WITNESS / ARTICULATION_UNKNOWN / FORMAL_CORE_UNCHANGED
Date: 2026-10-07 Asia/Taipei
Owner: 07｜產業與供應鏈研究室
Domain: D10-01
Parent: research/COV06_D10_SPECIALIST_RETURN_V0_1.md
Observed main before write: `512ccbf882fe6e76a4911013baac00cfeceb079b`

## Objective

Freeze one Taiwan issuer-native topology witness that contains:
1. an explicitly disclosed alternate-source state;
2. an explicit supplier qualification constraint;
3. an append-only evidence boundary that does not overclaim articulation or full-path completeness.

This is anti-self-deception research. No stock outcome is opened.

## Official issuer evidence

### TSMC annual-report raw-wafer procurement

TSMC official annual-report material states:
- raw wafers are procured from multiple sources to ensure adequate volume supply and manage supply risk;
- silicon-wafer suppliers are required to pass stringent quality certification procedures;
- supplier quality/delivery/cost/sustainability/service performance is periodically reviewed and affects subsequent purchasing decisions;
- supplied products are reviewed against TSMC specifications and quality requirements.

The 2025 annual report also presents multiple anonymized raw-wafer supplier slots (A/B/C/D/E Company) and continues the multiple-source plus certification semantics.

Official source family:
- https://investor.tsmc.com/static/annualReports/2024/english/ebook/files/basic-html/page109.html
- https://investor.tsmc.com/sites/ir/annual-report/2025/2025%20Annual%20Report_E.pdf

## Frozen graph receipt

```json
{
  "receiptId": "SC057_TSMC_RAW_WAFER_TOPOLOGY_20261007_V0_1",
  "issuer": "TSMC",
  "issuerSymbol": "2330",
  "materialOrProductScope": "RAW_WAFERS",
  "graphScope": "BOUNDED_ANONYMIZED_FIRST_TIER_PROCUREMENT",
  "topologyState": {
    "multipleSourceDisclosed": true,
    "qualifiedAlternateSourceState": "SUPPORTED_AT_CLASS_LEVEL",
    "substitutionState": "QUALIFIED_ACTIVE_MULTISOURCE",
    "qualificationConstraint": "STRINGENT_SUPPLIER_QUALITY_CERTIFICATION_AND_SPECIFICATION_CONFORMANCE",
    "supplierIdentityResolution": "ANONYMIZED_PARTIAL",
    "edgeWeights": "UNKNOWN",
    "spareCapacity": "UNKNOWN",
    "switchingTime": "UNKNOWN",
    "customerRequalification": "UNKNOWN",
    "tier2Tier3Dependencies": "UNKNOWN",
    "articulationState": "UNKNOWN"
  },
  "evidenceCompleteness": "BOUNDED_INCOMPLETE",
  "formalCoreChanged": false,
  "stockOutcomesOpened": false
}
```

## Interpretation

This receipt proves that a Taiwan issuer can disclose both:
- more than one procurement source for the same material class; and
- a qualification barrier that every usable source must clear.

That is enough to represent a qualified multi-source resilience state at a bounded anonymous supplier-class level.

It is NOT enough to prove:
- two fully independent physical paths;
- spare capacity at alternate suppliers;
- zero switching delay;
- no shared upstream bottleneck;
- no common geographic/common-mode failure;
- absence of an articulation node.

Therefore articulation remains UNKNOWN.

## Counterfactual / falsification guard

A naive rule "multiple suppliers => resilient" is rejected.

A valid alternate-path state requires source-supported qualification. Even then:
- anonymized identities prevent tier-2/tier-3 disjointness tests;
- unspecified capacity prevents immediate-substitution claims;
- common qualification does not prove equivalent yield, technology, geography or ramp speed.

If later evidence identifies supplier nodes and shared upstream dependencies, the topology state must be recomputed only from information known at that later decision clock; the later graph cannot be backfilled into this receipt.

## D10 maturity decision

D10-01 remains L2 / 40%.

Reason:
SC-057 closes the narrow evidence gap "alternate source + qualification constraint can coexist in a Taiwan issuer-native disclosure", but does not yet provide a sufficiently identified effective-dated issuer graph for replayable articulation/alternate-path computation.

No D10 aggregate maturity promotion.
No Formal optimization candidate.

## Exact next continuation point

SC-058:
seek one Taiwan issuer-native receipt that identifies enough distinct supplier/site/path identities to test whether two disclosed alternatives are actually disjoint after one node/edge removal.

Acceptance requires:
- effective-dated source/capture clocks;
- at least two distinguishable source/path identities OR an explicit issuer statement establishing independent alternate routes;
- one explicit qualification/switching constraint;
- no fabricated hidden tiers;
- articulation remains UNKNOWN if path completeness is insufficient.

If repeated issuer-native disclosures remain anonymized, freeze the structural conclusion:
PUBLIC_DISCLOSURE_SUPPORTS_QUALIFIED_MULTISOURCE_STATE_BUT_NOT_REPLAYABLE_ARTICULATION_TOPOLOGY.

Formal Core unchanged.
