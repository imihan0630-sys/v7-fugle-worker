# D01 DL-041 — D16 Market Common-Shock / Beta Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED / SDA_001_REMEDIATION

## 1. Purpose

D01 freezes:
- market-common-shock claim-scope semantics;
- market-date replication units;
- beta / benchmark PIT receipt requirements;
- candidate self-inclusion handling.

D16 owns future economic inference.

## 2. Owner dependencies

Consume:
- D19 benchmark / beta / residual model receipts;
- D18 market-regime / domestic common-state receipts;
- D13 global-shock receipts where relevant;
- D09 sector controls from DL-040.

Do not rebuild owner models in D01.

## 3. Required comparison ladder

M0 RAW_CROSS_SECTOR_PATTERN

M1 MARKET_DATE_MATCHED

M2 EX_CANDIDATE_MARKET_CONTEXT

M3 BETA_MARKET_RESIDUAL_CONTROLLED

M4 SECTOR_PLUS_MARKET_RESIDUAL

M5 CROSS_MARKET_DATE_RESIDUAL_REPLICATION

Do not jump from many stock/sector rows directly to a generic Pattern claim.

## 4. Replication units

Report separately:
- stock observations;
- unique symbols;
- structural roots;
- sectors;
- sector-date clusters;
- market-date clusters;
- common-shock clusters.

Cross-sector replication on one market date remains one market-date dependence family.

## 5. Beta / benchmark freeze

Record:
- benchmark id/version/knownAt;
- beta model id/version;
- estimation window;
- beta knownAt;
- observation count.

No outcome-selected beta estimator, benchmark or window.

No historical backfill using a later beta estimate.

## 6. Candidate self-inclusion

If the benchmark contains the candidate:
- prefer D19 ex-candidate context where supported;
- otherwise SELF_INCLUSION_UNRESOLVED.

Even an ex-candidate market statistic is a context/control, not a new alpha vote.

## 7. Common support

Pattern vs controls must overlap in:
- beta;
- market regime;
- sector context;
- size/liquidity;
- opportunity geometry.

Lack of overlap:
MARKET_BETA_EXTRAPOLATION_PROHIBITED.

## 8. Model sensitivity

Residual response is benchmark-model relative.

Report sensitivity across preregistered D19 model variants only.

If conclusions vary materially:
MODEL_SENSITIVE.

Do not choose the favorable residualization after outcomes.

## 9. Interpretation

Future classes:
- market common shock explains raw Pattern;
- beta exposure explains raw Pattern;
- market-regime conditional;
- sector + market explanation;
- residual Pattern increment;
- cross-market-date residual candidate;
- model sensitive;
- not evaluable.

None proves alpha.

## 10. SDA-001 boundary

Pattern plus market/sector context remains correlated price-derived information.

SDA-001 remains REMEDIATION_IN_PROGRESS until D16 residual evidence, system lineage and independent 00 closure exist.

## 11. Promotion boundary

No beta, market-shock or residual diagnostic changes Formal eligibility, score, Top6, weight, capital or runtime.

Formal Core remains LOCKED.
