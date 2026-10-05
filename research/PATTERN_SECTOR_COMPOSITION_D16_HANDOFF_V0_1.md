# D01 DL-040 — D16 Sector / Industry Composition Handoff V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED / SDA_001_REMEDIATION

## 1. Purpose

D01 freezes sector-composition, classification-vintage and candidate-self-inclusion semantics.

D16 owns future economic inference.

The key question is:

> Does Pattern add representation within and across sectors, or does the raw result merely reflect sector momentum / breadth / composition?

## 2. D09 owner boundary

Consume D09:
- point-in-time classification;
- sector return / RS;
- breadth / leadership / concentration;
- leave-one-out context where available.

Do not rebuild D09 taxonomies or scores in D01.

## 3. Required comparison ladder

S0 RAW_PATTERN_COHORT

S1 SECTOR_COMPOSITION_MATCHED

S2 LOO_SECTOR_CONTEXT_CONTROLLED

S3 WITHIN_SECTOR_INCREMENT

S4 CROSS_SECTOR_REPLICATION

Do not jump from S0 stock-row count directly to a generic Pattern claim.

## 4. Candidate self-inclusion

Candidate stock returns can mechanically lift sector return/breadth.

Prefer candidate-excluded sector controls.

If LOO is unavailable:
SELF_INCLUSION_UNRESOLVED.

A self-included sector statistic cannot establish independent confirmation.

## 5. Classification vintage

Freeze:
- taxonomy;
- classification level;
- version;
- knownAt;
- effective dating.

Do not:
- backfill current classifications;
- outcome-select taxonomy levels;
- drop unclassified names.

## 6. Sector concentration

Report:
- unique sectors;
- roots/opportunities by sector;
- top1/top3 sector opportunity shares;
- concentration statistic;
- classification unknown rate.

High sector concentration limits claim scope.

## 7. Dependence units

Stock rows are not independent sector replications.

Report:
- stock observations;
- unique symbols;
- structural roots;
- sectors;
- independent sector-date clusters;
- market-date clusters.

D16 chooses dependence-aware estimator.

## 8. Interpretation

Possible future conclusions:
- sector composition explains raw Pattern;
- sector momentum explains it;
- breadth/leadership explains it;
- Pattern remains within sector;
- Pattern is sector-specific;
- Pattern replicates across sectors;
- not evaluable.

Sector-specific evidence is a scoped result, not generic Pattern evidence.

## 9. Common support

Cross-sector comparisons require overlap in:
- size/liquidity/listing age;
- price/tick tier;
- market;
- regime;
- detector history;
- opportunity geometry;
- sector context.

No outcome-driven trimming.

## 10. SDA-001 boundary

Pattern plus sector context is not two independent price votes by default.

LOO removes direct candidate self-inclusion but does not itself prove residual independent alpha.

SDA-001 remains REMEDIATION_IN_PROGRESS.

## 11. Promotion boundary

No sector-composition diagnostic changes the existing Formal sector gate, ranking, Top6, weights, capital or runtime.

Formal Core remains LOCKED.
