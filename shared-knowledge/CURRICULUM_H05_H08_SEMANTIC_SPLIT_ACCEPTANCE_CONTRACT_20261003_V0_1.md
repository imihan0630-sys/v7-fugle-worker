# Curriculum H05-H08 Semantic Split Acceptance Contract 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: OWNER_APPROVED_CONTINUATION / SEMANTIC_SPLIT_ACCEPTANCE_CONTRACT_FROZEN
Scope: Third-round hidden-overlap clusters H05-H08
Formal Core impact: NONE
Curriculum count impact: NONE

## Purpose

Freeze the conditions under which H05-H08 may remain separate, be narrowed, or become merge-eligible.

These candidates are especially vulnerable to **narrative duplication**:
the same observable phenomenon can be re-described as an accounting, governance, behavioral, theme or technical story and accidentally become multiple votes.

Allowed terminal classifications:
- `KEEP_SEPARATE`
- `SCOPE_DEDUP_ONLY`
- `MERGE_ELIGIBLE`
- `EVIDENCE_INSUFFICIENT`

No retirement is executed by this contract.

## Common semantic-identifiability gates

### S1 Distinct observable requirement
A second module cannot survive merely by applying a different interpretation to the same observations. It must either:
- own materially distinct observable data; or
- own a clearly distinct transformation/decision role with explicit non-double-count linkage.

### S2 Cause-vs-phenomenon firewall
An observable price/flow/accounting/event pattern does not by itself identify the behavioral, governance or causal mechanism claimed by another module.

### S3 Divergent-state requirement
A claim of `KEEP_SEPARATE` must provide examples in which module A and module B can legitimately disagree on the same PIT date.

### S4 Competing-mechanism falsification
Behavioral/governance narratives must be tested against structural, microstructure, information, accounting and mechanical alternatives.

### S5 Shared evidence receipt
If both modules consume the same source row/event/statement, that evidence is recorded once and linked to multiple interpretations; it cannot become multiple independent votes.

### S6 Capability preservation
Any future merge/narrowing must preserve source lineage, PIT/replay, schemas, research artifacts, explanations and historical counterexamples.

### S7 Maturity firewall
Maturity remains module/scope specific. No merge or narrowing transfers maturity automatically.

### S8 Formal isolation
No semantic cleanup may change Formal Core behavior by itself.

---

# H05 — D07-25 vs D21-10

## Modules
- D07-25 Forensic Accounting Red Flags（鑑識會計與財報紅旗） — L0 / 0%.
- D21-10 Audit／Restatement／Internal Control（審計／重編／內控） — L0 / 0%.

## Frozen ownership boundary

### D07-25 owns statement-level accounting anomaly evidence
Examples:
- accrual/cash-flow inconsistencies;
- unusual revenue/expense recognition patterns;
- receivable/inventory/cash-flow anomalies;
- accounting-policy changes and footnote inconsistencies;
- forensic ratios or anomaly combinations;
- financial-statement-level red flags that can exist without an audit event.

### D21-10 owns governance/control-process evidence
Examples:
- audit opinion;
- auditor change where governance-relevant;
- restatement event and first-known chronology;
- material internal-control weakness;
- control-process remediation;
- audit/internal-control governance quality.

## KEEP_SEPARATE
Keep both only if:
1. D07-25 can generate a statement-level red-flag state without any audit/restatement/internal-control event.
2. D21-10 can generate a governance/control warning from audit/internal-control evidence even when statement-level forensic ratios are not abnormal.
3. Shared restatement/accounting data is linked once, not counted as both a forensic and governance vote.
4. Each has distinct falsifiers and PIT clocks.

## MERGE_ELIGIBLE / SCOPE_DEDUP_ONLY
If D07-25 ends up being defined mainly by restatements/audit/internal-control events already owned by D21-10, narrow or merge that overlap.
If D21-10 is implemented only as financial-statement anomaly scoring, it must be narrowed back to governance/control evidence.

## Required packet
Rooms 06 + 14:
- accounting-anomaly field map;
- audit/control event map;
- first-known clock comparison;
- divergent-state examples;
- shared-event receipt design;
- falsification matrix;
- terminal classification.

---

# H06 — D20-06 vs D06-06

## Modules
- D20-06 Herding／Social Proof（從眾／社會證明） — L0 / 0%.
- D06-06 Crowding（擁擠交易） — L2 / 40%.

## Frozen ownership boundary

### D06-06 owns observable crowding state
- holdings concentration;
- investor-position concentration;
- crowded flow/stock;
- financing/borrowing/ownership concentration where applicable;
- liquidity-sensitive unwind risk.

### D20-06 may own behavioral herding only if behavior is identifiable
Potential behavioral evidence must go beyond the same crowding state, for example:
- correlated trading beyond common public-information/factor exposure explanations;
- imitation/leader-follower behavior with temporal ordering;
- social/attention/network evidence when PIT/replayable;
- excess synchronized action after controlling common fundamentals, index rebalancing and mechanical flows.

## KEEP_SEPARATE
D20-06 survives only if:
1. it has at least one independent behavior-specific observable or residual test;
2. it can distinguish herding from common-information response, passive rebalancing, liquidity shocks and correlated mandates;
3. D06-06 crowding can be high while D20-06 herding is UNKNOWN/low, and vice versa;
4. crowding is not automatically interpreted as social proof.

## MERGE_ELIGIBLE / NARROWING
If D20-06 uses only holdings/flow concentration already owned by D06-06 and cannot identify imitation/herding, it becomes merge/narrowing eligible rather than a second behavioral vote.

## Required packet
Rooms 05 + 13:
- crowding observable inventory;
- behavior-specific proxy inventory;
- structural counterfactuals;
- residual-herding test design;
- divergent-state examples;
- anti-double-count rule;
- terminal classification.

---

# H07 — D03-05 vs D20-09

## Modules
- D03-05 Pullback／Short-term Reversal（回檔／短期反轉） — L2 / 40%.
- D20-09 Overreaction／Reversal（過度反應／反轉） — L0 / 0%.

## Frozen ownership boundary

### D03-05 owns the observable price phenomenon
- pullback geometry;
- short-horizon reversal;
- trend context;
- price/volume/volatility observable state;
- PIT-safe replay of reversal behavior.

### D20-09 may own behavioral overreaction only if the mechanism is identifiable
It must distinguish overreaction from:
- bid-ask bounce;
- liquidity provision;
- inventory effects;
- forced flow;
- event correction;
- volatility normalization;
- mechanical price-limit or microstructure effects.

## KEEP_SEPARATE
D20-09 survives only if:
1. overreaction has independent behavioral/event expectation evidence beyond price reversal alone;
2. a reversal can occur without behavioral overreaction;
3. behavioral overreaction can be detected before/without a completed reversal outcome;
4. competing microstructure/structural explanations are explicitly falsified.

## MERGE_ELIGIBLE / NARROWING
If D20-09 is operationalized only as prior extreme return followed by reversal, it is a narrative relabel of D03-05 and should be merged/narrowed.

## Required packet
Rooms 03 + 13:
- price-phenomenon definition;
- behavioral mechanism/proxy definition;
- alternative-explanation matrix;
- PIT sequence;
- divergent-state examples;
- incremental-value test;
- terminal classification.

---

# H08 — D09-11 / D17-11 / D20-11

## Modules
- D09-11 Theme-stock <-> Formal-industry Bridge（題材股與正式產業分類橋接） — L3 / 60%.
- D17-11 Sector Propagation（族群擴散） — L2 / 40%.
- D20-11 Narrative／Theme Diffusion（敘事／題材擴散） — L0 / 0%.

## Frozen three-layer ontology

### Layer 1 — D09-11 taxonomy/membership bridge
Owns:
- theme-to-industry/company mapping;
- many-to-many membership;
- effective-dated exposure;
- classification/version semantics;
- bridge confidence/UNKNOWN.

It does **not** claim that a theme is currently propagating.

### Layer 2 — D17-11 event/news propagation
Owns:
- a dated event/news source;
- first-known/publication clock;
- propagation from direct to related companies/sectors;
- event half-life and event-linked propagation path.

It does **not** infer investor psychology solely from propagation.

### Layer 3 — D20-11 behavioral narrative diffusion
May own:
- attention/social/narrative transmission;
- language/topic propagation beyond simple membership;
- behavioral persistence/amplification after controlling event fundamentals and structural supply-chain links.

It requires evidence beyond D09 mapping and D17 event propagation.

## KEEP_SEPARATE
All three survive only if:
1. D09-11 remains a static/effective-dated taxonomy bridge, not a signal.
2. D17-11 uses event-time propagation with explicit source/clock.
3. D20-11 has independent attention/social/narrative observables or residual behavior after controlling D09/D17.
4. one theme/event can produce different states across the three layers.
5. evidence lineage prevents the same headline/theme membership from becoming three votes.

## MERGE_ELIGIBLE / SCOPE_DEDUP_ONLY
- If D20-11 uses only D17 event propagation, merge/narrow D20-11.
- If D20-11 uses only D09 theme membership, merge/narrow D20-11.
- If D17-11 merely reuses static D09 membership without a dated propagation process, narrow D17-11.
- D09-11 mature PIT bridge capability must remain preserved under any future restructuring.

## Maturity firewall specific to H08
D09-11 L3 evidence is valid only for taxonomy/membership bridge semantics.
It may not promote D17-11 or D20-11.

## Required packet
Rooms 07 + 08 + 13:
- three-layer field/observable matrix;
- clock comparison;
- membership vs propagation vs narrative examples;
- independent behavioral proxy list;
- three-way divergent-state cases;
- shared evidence lineage;
- maturity mapping;
- terminal classification for each pair/layer.

---

## Execution sequence

1. Relevant specialist rooms read this contract.
2. They return the specified evidence packets.
3. 00｜研究總控室 checks completeness.
4. Dependency Audit and anti-orphan review are performed.
5. Each cluster receives one terminal classification.
6. Owner reviews any merge/retirement proposal.
7. No ID removal before explicit approval.
8. Maturity is recomputed only if structural changes are approved.

## Current state

- H05: semantic split contract frozen; specialist validation pending.
- H06: behavioral identifiability firewall frozen; specialist validation pending.
- H07: phenomenon-vs-cause firewall frozen; specialist validation pending.
- H08: three-layer ontology frozen; specialist validation pending.
- No module count change.
- No maturity change.
- Formal Core remains LOCKED.
