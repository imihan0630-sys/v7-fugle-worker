# VALUATION_RELATIVE_RISK — Exact Semantics / Denominator Repair

Updated: 2026-09-27 Asia/Taipei  
Status: CLASS-A STRUCTURAL FALSIFICATION / OUTCOMES CLOSED  
Formal Core: LOCKED

## VR-001 — Do not redo valuation theory

VAL-001..VAL-008 remain the conceptual owner. This continuation only repairs exact deployed semantics and future scarcity denominators.

Current Formal veto:
`PE>0 AND sectorMedianPe>0 AND PE/sectorMedianPe>2.5 AND NOT(revenueQuarterYoY>25 OR epsYoY>25)`.

No 2.5 / 25 threshold sweep is allowed here.

## VR-002 — Missing EPS YoY is not a deployed UNKNOWN

A legitimate current row may have `epsYoY=null`.

Under JavaScript comparison semantics:
`null > 25` is false.

Therefore:
- relative PE >2.5;
- quarterly revenue YoY <=25;
- EPS YoY missing

still produces the deployed valuation rejection.

The evidence is incomplete for the EPS growth exception, but the Formal result is not unknown.

This falsifies the valuation section of `formal_gate_overlap_observer_v0_2`, which marks that state UNKNOWN.

Research must keep two layers:
1. exact deployed decision result;
2. evidence-quality state.

## VR-003 — sectorMedianPe is inclusive, not leave-one-out

Current Worker builds `sectorPe` from every positive-PE `featureRows` member in the industry, then assigns the same median to every row.

The candidate's own PE is therefore included whenever it is positive.

`pe.length>=3` means at least three positive-PE constituents in that industry frame; it is not a three-other-peer requirement.

Fixed boundary counterexample:
- industry positive PEs = [10, 40, 100];
- candidate PE = 100;
- deployed inclusive median = 40;
- deployed ratio = 2.5 => no reject because rule is strictly >2.5;
- leave-one-out median = 25;
- counterfactual ratio = 4.0.

So self-inclusion can change the veto state near the boundary. That does not prove leave-one-out is better; it proves recomputation must not silently change the deployed estimand.

## VR-004 — PR #112 is not current semantic truth

Draft PR #112 was valuable early work, but it is based on an older main and recomputes a valuation median from an older sector representation. Its dedicated reject reason also no longer matches the current Worker reason.

It remains historical research evidence, not a current promotion-grade receipt contract.

## VR-005 — Future denominator

A clean valuation denominator requires:
- immutable same-generation parent;
- every earlier Formal gate through ANNOUNCEMENT_RISK positively clear;
- exact deployed `priceEarningsRatio`;
- exact deployed `sectorMedianPe`;
- positive-PE constituent count and whether the candidate is included;
- `revenueQuarterYoY`;
- `epsYoY` plus whether EPS growth evidence was actually observed;
- valuation source/date and parent industry identity/version.

Do not use firstFailure alone, bounded Shadow, current-data historical recomputation or leave-one-out PE as deployed truth.

## VR-006 — Shared observer repair

`formal_gate_overlap_observer_v0_3` preserves v0.2's strict-null / financialBasis / verified-empty-announcement fixes and repairs only the valuation missing-EPS semantics.

Machine artifacts:
- `research/valuation_relative_risk_observer_v0_1.mjs`;
- `research/valuation_relative_risk_semantic_falsification_v0_1.json`;
- `research/formal_gate_overlap_observer_v0_3.mjs`;
- associated adversarial tests.

Decision:
`FORMAL_VETO_SEMANTICS_REPAIRED_FOR_RESEARCH / MISSING_EPS_IS_FAIL_EVIDENCE_CAVEAT_NOT_UNKNOWN / SECTOR_MEDIAN_IS_INCLUSIVE_SELF / FORMAL_UNCHANGED`.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists.
