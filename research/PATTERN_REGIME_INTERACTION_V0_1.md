# Pattern x Regime Interaction v0.1 — Pre-registered Shadow Design

Status: FROZEN_FOR_PROSPECTIVE_TEST / RESEARCH_ONLY / decisionImpact=false

## Why this exists
External technical-analysis evidence is not stable enough to justify an unconditional "pattern works" assumption.

Relevant evidence:
- Lo, Mamaysky & Wang (Journal of Finance, 2000) show that some automatically recognized chart patterns contain incremental conditional-return information, but this is not evidence that every named pattern is profitable in every regime.
- Taiwan candlestick evidence (Lu, Pacific-Basin Finance Journal, 2014; 1992-2009 sample) reports a small subset of patterns surviving transaction-cost, bootstrap and out-of-sample checks, but the sample predates the 2015 price-limit widening and 2020 continuous-trading regime.
- Chen, Huang & Lai (Journal of Asian Economics, 2009) show that data snooping, non-synchronous trading and transaction costs materially weaken broad technical-rule profitability across Asian markets.
- Sullivan, Timmermann & White show that an in-sample best technical rule can fail in subsequent post-sample data even after formal data-snooping analysis.
- Taiwan moving-average research over 1992-2018 finds technical profitability can vary with firm life-cycle / information uncertainty, while also testing bull/bear and high/low volatility states. This supports context testing, not direct transfer to chart-pattern alpha.

Conclusion: regime/context belongs in validation stratification, not in detector definitions.

## Frozen principle
Pattern geometry must be identical for the same price history regardless of future market regime labels.

Regime can:
- stratify outcomes;
- identify portability failures;
- explain heterogeneity.

Regime cannot:
- move pivots;
- change zone width;
- choose a favorable swing scale;
- re-label a failed geometry as valid;
- tune thresholds after returns are known.

## Reuse existing regime infrastructure
Do not invent a second market-state engine.

Reuse point-in-time states already stored by the research system where available:
- existing market regime / breadth state;
- sector persistence / breadth context;
- volatility context;
- 2015-06-01 price-limit structural break;
- 2020-03-23 continuous-trading structural break.

Missing regime evidence remains UNKNOWN.

## Four pre-registered interactions only

### PATTERN-RG1 — Breakout acceptance x market regime
Question:
Does the same frozen breakout/maturity state have different R01 hold/fail and MFE/MAE behavior across existing broad-market regimes?

Primary pattern fields:
- localBreakout20;
- pivot/neckline breakout state;
- acceptance lifecycle;
- breakout residual distance.

Controls:
- current R01 breakout quality;
- ret20;
- priorHigh60;
- overheat;
- liquidity.

Falsification:
If apparent interaction is one-date dominated or disappears after current breakout/overheat controls, reject the interaction.

### PATTERN-RG2 — Nested resistance x market regime
Question:
Is a local breakout below/inside a frozen MAJOR zone more consequential in weak/narrow regimes than in broad trend regimes?

Primary fields:
- nestedConflictState;
- availableAirPct;
- majorZoneAgeSessions;
- repeatedTouchProgression.

Controls:
- priorHigh60;
- MA60 distance;
- ret20;
- overheat;
- simple 260-session-high distance.

Falsification:
If a hard resistance interpretation merely rejects strong leaders in broad regimes, do not promote it.

### PATTERN-RG3 — Compression/VCP topology x volatility regime
Question:
Does a frozen contraction topology have different continuation/failure characteristics in high vs low existing volatility context?

Primary fields:
- contractionCount;
- depthMonotonicity;
- lowProgression;
- range/volume contraction primitives;
- scaleAgreement.

Controls:
- atrPercent;
- volatility20;
- volumeContraction5to20;
- platformRange20Pct.

Falsification:
If VCP fields add nothing after current contraction/volatility variables, reject as a relabeling.

### PATTERN-RG4 — Reversal topology x prior-trend context
Question:
Do W / inverse-H&S / candlestick reversal labels require an actual prior downtrend to carry information?

Primary fields:
- confirmed reversal topology;
- true neckline geometry;
- undercut/reclaim state;
- priorTrendState.

Controls:
- Formal MA structure;
- ret20;
- residual RS;
- market regime.

Falsification:
If the named label has no incremental information beyond prior trend and neckline location, keep only latent geometry.

## Explicitly deferred interactions
To prevent combinatorial data snooping, v0.1 does NOT cross every pattern with:
- every industry;
- every market-cap bucket;
- every institutional-flow state;
- every attention state;
- every firm-life-cycle bucket.

Those may be introduced only as separately pre-registered hypotheses after the four primary interactions have adequate prospective evidence.

## Structural-regime portability
For current-system decisions, primary evidence is the modern Taiwan microstructure:
- 10% daily price-limit regime;
- continuous-trading regular session.

Pre-2015 / pre-2020 data may be used for detector mechanics and stress testing, but cannot be pooled blindly as directly representative of 2026.

## Validation order
1. detector/data QA;
2. prospective snapshot coverage;
3. unconditioned descriptive outcome distribution;
4. the four pre-registered interactions;
5. within-scan-date / date-cluster robustness;
6. controls for existing Formal/research variables;
7. purged forward holdout;
8. untouched confirmation block.

No interaction is allowed to change Formal Core automatically.

## Sample honesty
Report:
- snapshot N;
- independent episode N;
- unique scan-date N;
- unique regime/date N.

Same-day multiple symbols are clustered by scan date.
A visually impressive regime split with too few independent dates remains INSUFFICIENT_SAMPLE.

## Multiple-testing accounting
PATTERN-RG1..RG4 are four distinct pre-registered definitions.
Any change to:
- regime split;
- pattern field;
- outcome horizon;
- zone-width version;
- swing-scale rule;
creates a new experiment definition and must be counted.

## Promotion status
This document authorizes only prospective Shadow validation.
It does not create a Pattern score, veto, rank adjustment, BUY rule or sell/reduce rule.

Formal Core remains LOCKED.
