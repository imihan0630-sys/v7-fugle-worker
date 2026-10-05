# D01 DL-045 — D16 Round-Number / Tick-Grid Salience Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED / SDA_001_REMEDIATION

## 1. Purpose

D01 freezes round/tick salience context.

D16 owns future incrementality.

The central question is:

> Does historical structural lineage add information beyond simple round-price / tick-grid / reference-price salience?

## 2. Required comparator families

R0 ROUND_SALIENT_NONSTRUCTURAL
- salient registered round/tick reference;
- no certified structural root.

R1 STRUCTURAL_NONROUND
- certified structural root away from registered exact round/tick-transition coincidence.

R2 STRUCTURAL_ROUND_COINCIDENT
- certified structure plus round/tick salience.

Ask:
- R2 vs R0: structural increment beyond salience;
- R2 vs R1: salience increment beyond structure;
- R1 vs matched nonstructural: structure away from round effects.

## 3. Tick provenance

Use point-in-time D04/D05 owner receipts.

Do not backfill current tick size/tier into historical structure formation.

## 4. Round-grid multiplicity

Any tested set of round grids is one preregistered multiple-testing family.

No best grid after outcomes.

## 5. Mechanism caution

Daily OHLC can establish distance to round prices.

It cannot establish actual order-book clustering.

Order clustering requires microstructure data.
Psychological anchoring requires behavior-specific evidence.

## 6. Information lineage

Structural zone, round-price coincidence, prior close and auction reference remain correlated price-system representations.

Default effectiveIndependentEvidenceCount = 1.

No "three confirmations" narrative.

## 7. Future ladder

G0 RAW_STRUCTURAL_PATTERN
G1 ROUND_REFERENCE_CONTEXT_CONTROLLED
G2 TICK_BAND_CONTEXT_CONTROLLED
G3 PRIOR_CLOSE_AUCTION_REFERENCE_CONTROLLED
G4 MICROSTRUCTURE_CONTEXT_CONTROLLED
G5 STRUCTURAL_NONROUND_REPLICATION
G6 STRUCTURAL_VS_ROUND_NEGATIVE_CONTROL
G7 ROUND_TICK_ROBUST_REPLICATION

## 8. Common support

Require overlap in:
price, tick tier, relative tick, liquidity, volatility, session state, reference-price context, market/sector regime, age and opportunity geometry.

## 9. Audit boundary

SDA-001 remains REMEDIATION_IN_PROGRESS.

This handoff does not close duplicate-vote governance.

## 10. Promotion boundary

No round/tick descriptor changes Formal eligibility, ranking, Top6, weights, capital or execution.

Formal Core remains LOCKED.
