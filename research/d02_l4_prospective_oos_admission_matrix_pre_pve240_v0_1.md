# D02 L4 prospective/OOS admission matrix — pre-PVE-240

Updated: 2026-10-04 Asia/Taipei
Scope: D02 price-volume only
Status: RESEARCH_ONLY / PREREGISTERED / NO_MATURITY_CHANGE
Formal Core impact: NONE

## Purpose
D02 is now 12/12 modules at L3. No further maturity may be created by specification, synthetic fixtures, unit tests, or retrospective reconstruction. This document freezes the minimum genuine prospective/OOS evidence needed for any L4 claim and prevents post-outcome test shopping.

## Shared admission gates for every D02 L4 test
1. Decision-time PIT lineage must be complete. Missing evidence is UNKNOWN, never zero/BAD.
2. Cohort membership must be generation-linked and outcome-independent.
3. Common support must be identical across compared specifications.
4. Feature firstKnownAt must be <= decision cutoff.
5. Corporate-action/trading-unit/session continuity must pass for every volume-magnitude feature that spans sessions.
6. Missing expected symbol-session data cannot be replaced by older rows.
7. No retrospective Shadow reconstruction.
8. Date/session clustering must be respected; raw row count is not an independent-sample count.
9. Transaction cost/slippage/liquidity stratification is required before economic promotion.
10. Market/sector/liquidity/event/regime dependence must be reported, not pooled away.
11. Multiple-testing family and frozen primary comparator must be declared before outcome inspection.
12. Formal Core stays LOCKED; passing evidence can only create a research candidate.

## Module-specific frozen L4 questions

### D02-01 volume unit/data semantics
L4 claim: unit/continuity governance materially prevents false signal classification in genuine prospective/OOS data.
Primary evidence: prospective provenance defects and counterfactual classification delta under frozen unit adapter.
Falsifier: governance never changes eligibility/classification, or changes only rows already unusable for unrelated reasons.
No alpha claim is implied.

### D02-02 RVOL / same-slot normalization
Primary test: historical same-slot RVOL adds incremental discrimination beyond local previous-five volume ratio on matched slot>=10:15 support.
Controls: price path, local ratio, liquidity, trend, event/regime.
Falsifier: incremental effect disappears after controls or is unstable across dates/regimes.

### D02-03 breakout volume confirmation
Primary shared-event test: on D01-owned repaint-safe breakout events compare:
A price-only;
B + local previous-five ratio;
C + same-slot RVOL;
D + cumulative pace.
Falsifier for necessity: successful normal/low-volume breakouts.
Promotion requires incremental quality, not "high volume is required."

### D02-04 volume dry-up
Primary test: contraction state must improve subsequent setup quality beyond price consolidation geometry, volatility contraction and liquidity.
Falsifier: dry-up is fully explained by volatility/liquidity decline or demand disappearance and adds no residual value.

### D02-05 extreme/climax volume
Observable construct is EXTREME_PARTICIPATION_STATE only.
Primary test: extreme participation x response has stable incremental path information after volatility/event/liquidity controls.
Falsifier: effect is event/volatility/liquidity proxy.
Never infer distribution/absorption motive from OHLCV/RVOL alone.

### D02-06 Effort-vs-Result
Primary test: response conditional on participation adds information beyond participation and raw price geometry separately.
Falsifier: state compression adds no value once its primitive inputs are controlled.
This is a representation-incrementality test, not source novelty.

### D02-07 OBV comparator
Primary compact comparator: signedVolumeBalance20.
Sequence:
A price path;
B + direct volume/RVOL/turnover;
C + response/persistence/acceptance;
D + signedVolumeBalance20.
Only D-vs-C is residual OBV-family value.
Falsifier: no residual value. Raw OBV and signedVolumeBalance20 must not be double-counted.

### D02-08 provider trade-pressure proxy
Primary test: providerTradePressureProxy adds value beyond OHLCV/RVOL/response with classificationCoverage explicitly modeled.
Required controls: spread/depth/liquidity when PIT-valid.
Falsifier: value vanishes with coverage/liquidity controls.
Never label true OFI, accumulation/distribution, smart-money intent, passive absorption, iceberg or spoofing.

### D02-09 price-volume divergence
Only two typed families:
PIVOT_SIGNED_VOLUME;
PARTICIPATION_TRAJECTORY.
Must reuse repaint-safe confirmed-pivot chronology.
Falsifier: divergence adds no value beyond the underlying price and volume trajectories.
No generic divergence boolean, visual pivot selection, all-pair scan or best-window search.

### D02-10 volume-state x trend interaction
Same-support sequence:
A direct trend;
B direct participation;
C trend + participation;
D C + explicit interaction transform.
Only D-vs-C is interaction value.
Falsifier: interaction adds no residual information or is regime-specific without stability.
D03 trend is a dependency, not D02 maturity.

### D02-11 liquidity volume thresholds/exceptions
Primary question is not threshold optimization.
Use reason-stratified rejected controls and execution-cost evidence to test whether volume-capacity context improves eligibility/risk classification.
Falsifier: apparent benefit is entirely spread/depth/price-level or post-outcome threshold selection.
No threshold sweep is authorized.

### D02-12 intraday volume curve / price-by-volume profile
Separate families:
TIME_OF_DAY_VOLUME_CURVE;
PRICE_BY_VOLUME_PROFILE.
Time curve primary window remains bounded to currently observable 09:00~13:00 until full-session coverage exists.
Price-by-volume profile is prospective-only; no historical backfill claim.
Falsifier: profile effect disappears after same-slot RVOL/cumulative pace/price-location controls.
No closing-auction completeness claim without source coverage.

## Familywise testing budget
Primary prospective families are frozen as:
F1 participation normalization: D02-02/03/04;
F2 participation-response representation: D02-05/06;
F3 residual directional/comparator transforms: D02-07/09;
F4 independent provider-pressure proxy: D02-08;
F5 interaction/liquidity/profile context: D02-10/11/12;
F0 data-semantic governance: D02-01 (non-alpha).

Within each family, the named primary test above is evaluated before any secondary challenger. Secondary variants are descriptive until separately preregistered. This limits data snooping and multiple-testing inflation.

## Promotion rule
No module reaches L4 from this preregistration. L4 requires genuine prospective Shadow or OOS observations satisfying the frozen admission gates and module-specific falsifiers. A positive result on one date or one regime is insufficient. Evidence must report support, counterevidence, stability, costs, redundancy and failure conditions.

## Current state
D02 maturity remains 60.0%.
12/12 modules remain L3.
Clean prospective date count remains 0.
PVE evidence cursor remains 239.
Formal next evidence remains PVE-240 on the first genuine completed post-repair market session.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE: NONE.
Formal Core: LOCKED.
