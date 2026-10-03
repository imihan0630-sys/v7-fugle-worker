# System1 TARGET_AVAILABLE Four-State Falsification Contract 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: RESEARCH_CONTRACT_FROZEN / P2_SEMANTIC_FALSIFICATION / FORMAL_CORE_LOCKED
Parent:
`shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`

## Problem

Current observer collapses target state into:
- FOUND -> PASS;
- NONE -> FAIL with `NO_VERIFIABLE_RESISTANCE`;
- other -> UNKNOWN.

This is insufficient because "no verified resistance exists" and "resistance cannot be evaluated" are not the same economic state.

Current Formal also rejects when a verifiable target is unavailable because RR cannot proceed.

The audit must separate information failure from genuinely open price geometry.

## Frozen four-state ontology

### TARGET_FOUND
A valid resistance/target exists and was known at decision time.

Required:
- source/replay authenticity;
- search scope/version;
- target price;
- target provenance;
- decision-time availability.

Then RR may be evaluated normally.

### TARGET_NONE_SEARCH_COMPLETE
The frozen target-search algorithm completed successfully across its required search space and found no qualifying resistance.

Interpretation:
- not negative Alpha by definition;
- not positive Alpha by definition;
- RR based on nearest resistance is not directly computable;
- requires separate Shadow treatment.

This is the key "open-sky" falsification state.

### TARGET_UNKNOWN_SOURCE
The target cannot be evaluated because required source/provenance/history inputs are missing, stale, unauthenticated or not replayable.

Role:
`CONFIDENCE_UNCERTAINTY`.

Never convert to TARGET_NONE.

### TARGET_UNKNOWN_GEOMETRY
Required source data exist, but the geometry/search algorithm cannot produce a trustworthy conclusion because of ambiguous structure, unsupported topology, insufficient validated range, or algorithm-state failure.

Role:
`CONFIDENCE_UNCERTAINTY`.

Never convert to TARGET_NONE.

## Additional derived state

### TARGET_FOUND_TOO_CLOSE
A valid target exists, but computed RR is below the frozen RR threshold.

This is a risk-geometry failure and remains distinct from all four target-availability states.

## Required provenance fields

Every target observation must preserve:
- `targetStateV2`
- `targetPrice`
- `searchComplete`
- `searchAlgorithmVersion`
- `searchLookbackStart`
- `searchLookbackEnd`
- `sourceReceiptIds[]`
- `knownAt`
- `decisionAt`
- `geometryQuality`
- `failureReason`
- `researchOnly:true`
- `decisionImpact:false`

## Falsification questions

### F1 — Is TARGET_NONE_SEARCH_COMPLETE truly bad?
Compare mature future outcomes of:
- TARGET_FOUND + RR>=2;
- TARGET_NONE_SEARCH_COMPLETE.

Match/stratify by:
- A/B setup;
- setup quality;
- price;
- liquidity;
- ATR/volatility;
- sector;
- Regime;
- date cluster.

Do not infer superiority from raw returns alone.

### F2 — Does open-sky geometry matter differently for A vs B?
Hypothesis:
B breakout names may be disproportionately affected by absence of nearby historical resistance.

Test A and B separately.
No pooled conclusion may override setup-specific results.

### F3 — Is current NONE actually contaminated by UNKNOWN?
Audit historical/current target rows to estimate how many `NONE` states lack explicit:
- searchComplete=true;
- authenticated source;
- frozen search version.

Any contaminated row is reclassified to UNKNOWN in research only.
Never rewrite historical Formal decisions.

### F4 — What substitutes for RR when no target exists?
No substitute is authorized in V0.1.

Candidate research alternatives may include:
- volatility-normalized horizon return;
- trailing/open-ended payoff geometry;
- fixed-R multiple target;
- structural resistance beyond the current lookback.

But each alternative is a separate preregistered Shadow experiment and cannot be chosen after observing outcomes.

## Outcome contract

For TARGET_NONE_SEARCH_COMPLETE rows report:
- candidate reach;
- trigger/fill if a separate entry experiment exists;
- D+N return;
- MFE;
- MAE;
- stop-first rate;
- after-cost outcome;
- tail loss;
- date-cluster distribution;
- Regime distribution;
- A vs B split.

The baseline comparison must preserve the same date/universe/source snapshot.

## Evidence states

### TARGET_NONE_NOT_MATERIAL
Very few genuine search-complete/no-resistance rows exist.

### TARGET_NONE_OUTCOME_UNKNOWN
Rows exist but outcome maturity is insufficient.

### TARGET_NONE_NO_INCREMENT
Open-sky rows do not show incremental opportunity after controls or have worse risk.

### TARGET_NONE_POSITIVE_EVIDENCE
Open-sky rows show robust incremental opportunity across independent dates/Regimes with acceptable risk.

This does not automatically define a replacement target or authorize Formal admission.

### TARGET_SEMANTICS_DATA_INSUFFICIENT
Historical/current target-state provenance cannot reliably separate NONE from UNKNOWN.

## Formal firewall

No change to:
- `nearestRealResistance()`;
- RR >= 2;
- A/B;
- Grade;
- ranking;
- entry;
- allocation;
- 3+3/Top6;
- BUY/ADD/REDUCE/SELL;
- production target semantics.

Formal Core remains LOCKED.
