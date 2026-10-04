# D01 DL-032 — Structural Aging vs Regime / Volatility-Scale Migration V0.1

Updated: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / SCALE_MIGRATION_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-031 separated structural age from detector observability and interaction history.

DL-032 freezes another confound:

> A structural level may appear weaker at an older age because the market's volatility, price scale, liquidity or regime changed, not because structural memory itself decayed.

The structural boundary must remain the same causal object.
Current market context may change the meaning of that boundary without rewriting it.

No return outcome is opened in this tranche.

## 2. Core distinction

Freeze three different objects:

A. IMMUTABLE_STRUCTURAL_GEOMETRY
- persisted root/version boundary in canonical TECHNICAL_CONTINUITY price space;
- source-anchor lineage;
- no post-outcome widening/narrowing.

B. FORMATION_CONTEXT
- volatility scale;
- normalized volatility;
- liquidity state;
- relative tick / price-grid state;
- D02 acceptance/persistence;
- market/sector regime;
- all measured as of first confirmation or current version effectiveAt.

C. CURRENT_OPPORTUNITY_CONTEXT
- the same context families measured immediately before a future interaction opportunity.

A structural object does not become a new object merely because context changes.

## 3. Structural boundary is not volatility-adaptive after the fact

A persisted zone is not retroactively widened because ATR later rises.

Prohibited:
- replace old lower/upper with current ATR-expanded values;
- tighten old boundary because volatility fell;
- choose the width that restores a failed bounce;
- use current volatility to rewrite first-confirmation geometry.

Allowed:
- describe the frozen boundary in current normalized units;
- create a new causal structural version only under existing D01 version/anchor rules.

## 4. Scale descriptors

D01 consumes canonical receipts from relevant owners and does not redefine their algorithms.

Formation snapshot may contain:
- formationReferencePrice;
- formationATR;
- formationAtrPct or equivalent normalized volatility;
- formationRealizedVolatility;
- formationRelativeTick;
- formationLiquidityState;
- formationVolatilityRegime;
- formationMarketRegime;
- formationSectorRegime.

Current opportunity snapshot may contain the same fields with current prefixes.

Derived outcome-blind descriptors:

ZONE_WIDTH_PRICE = upper - lower.

FORMATION_ZONE_WIDTH_ATR = ZONE_WIDTH_PRICE / formationATR.

CURRENT_ZONE_WIDTH_ATR = ZONE_WIDTH_PRICE / currentATR.

FORMATION_ZONE_WIDTH_PCT = ZONE_WIDTH_PRICE / formationReferencePrice.

CURRENT_ZONE_WIDTH_PCT = ZONE_WIDTH_PRICE / currentReferencePrice.

VOLATILITY_SCALE_RATIO =
currentNormalizedVolatility / formationNormalizedVolatility
when the normalization contract is identical.

RELATIVE_TICK_RATIO =
currentRelativeTick / formationRelativeTick
when both are valid.

These are descriptors, not scores or votes.

## 5. Price-continuity firewall

All persisted boundaries and reference prices must use the same canonical semantic price space.

Corporate-action discontinuity may not masquerade as scale migration.

If formation/current semantic-space receipts differ or continuity is unresolved:
SCALE_MIGRATION_DATA_BLOCKED.

D01 does not repair corporate-action history here.

## 6. Volatility-owner boundary

D01 does not invent a new volatility regime taxonomy.

Canonical volatility states belong to existing D04/D05 research ownership.

D01 may consume:
- current/formation normalized volatility;
- volatility regime identity;
- source/version/asOf receipts.

If those receipts are incomplete:
VOLATILITY_CONTEXT_UNKNOWN.

No fallback hard-coded ATR threshold is allowed.

## 7. Market-regime owner boundary

D18 owns canonical market-regime research semantics.

D01 may consume the frozen as-of regime identifier / vector if available.

D01 does not:
- create a new bull/bear regime classifier;
- choose regime thresholds after outcomes;
- relabel a result to rescue Pattern performance.

Missing owner receipts remain UNKNOWN.

## 8. Liquidity / tick-scale migration

Changes in liquidity or relative tick can alter:
- overshoot size;
- crossing probability;
- noise around a boundary;
- apparent bounce cleanliness.

Therefore retain:
- formation/current relative tick;
- formation/current liquidity state;
- constrained-session state;
- spread/depth receipts where owner data support them.

No microstructure variable becomes an independent Pattern vote.

## 9. Regime migration does not reset structural age

A market regime transition:
- does NOT reset ROOT_AGE;
- does NOT reset VERSION_AGE by itself;
- does NOT create a new structural root.

Only an existing causal structural-version event may reset VERSION_AGE.

This prevents "new regime" from artificially rejuvenating an old level.

## 10. Same-boundary / different-scale interpretation

The exact same persisted zone can move across normalized states.

Example:
- formation: zone width = 1.5 ATR;
- current: same zone width = 0.4 ATR.

The market now traverses that frozen zone more easily in volatility units.

If future bounce probability falls, this could be:
- true age decay;
- scale migration;
- interaction-history depletion;
- regime change;
- some combination.

DL-032 requires these alternatives to be visible separately.

## 11. No dynamic rescue boundary

A future analysis may report a sensitivity view such as:
"what would one formation-ATR or current-ATR band look like?"

But that is a comparator, not the original object.

It must have a different identity and cannot replace the canonical structural zone.

Any adaptive-boundary challenger belongs to a preregistered robustness family and cannot be chosen after returns.

## 12. Future comparison ladder

Future D16 analysis should preserve this nested logic:

C0:
age + interaction history under canonical geometry.

C1:
C0 + current scale/context.

C2:
C1 + formation-to-current migration descriptors.

C3:
C2 + canonical regime-owner context.

Interpretation:

M0_AGE_SURVIVES:
age representation remains after scale/regime controls.

M1_SCALE_CONFOUND:
age representation disappears after current-scale controls.

M2_MIGRATION_CONFOUND:
age representation disappears after formation-to-current migration controls.

M3_REGIME_SPECIFIC:
age representation exists only in one preregistered regime/common-support stratum.

M4_NOT_EVALUABLE:
insufficient common support or provenance.

No state proves causal memory or alpha.

## 13. Common-support firewall

Do not compare:
- very old high-volatility roots with young low-volatility roots,
then call the difference age decay.

Future analysis must report overlap/common support for:
- age;
- normalized volatility;
- liquidity;
- relative tick;
- regime;
- interaction history.

Where common support fails:
EXTRAPOLATION_PROHIBITED.

## 14. No arbitrary migration bins

D01 does not define:
- volatility doubled;
- ATR above 2%;
- high/low migration thresholds;
- age-by-regime buckets.

Continuous descriptors remain continuous unless D16 preregisters a justified representation.

Canonical owner regime labels may be used as provided.

## 15. External evidence context

Taiwan evidence confirms that technical-rule behavior and market volatility interact, while recent Taiwan volatility research shows that volatility-model specification materially changes volatility-targeting behavior and can differ by sector.

This supports treating volatility/regime as real context rather than assuming stationary scale.

It does not identify D01 structural alpha.

Henderson et al. (2026) also note that their tractable support/resistance model uses fixed levels even though real path dependencies can be more complex. DL-032 therefore preserves fixed causal geometry while allowing context to vary around it.

## 16. Required manifest fields

Per root/opportunity:
- structuralRootId;
- structuralVersionId;
- symbol;
- semanticSpace;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- formationAsOf;
- currentAsOf;
- formationReferencePrice;
- currentReferencePrice;
- formationATR;
- currentATR;
- formationNormalizedVolatility;
- currentNormalizedVolatility;
- formationRelativeTick;
- currentRelativeTick;
- formationLiquidityState;
- currentLiquidityState;
- formationVolatilityRegime;
- currentVolatilityRegime;
- formationMarketRegime;
- currentMarketRegime;
- formationSectorRegime;
- currentSectorRegime;
- zoneWidthPrice;
- formationZoneWidthAtr;
- currentZoneWidthAtr;
- formationZoneWidthPct;
- currentZoneWidthPct;
- volatilityScaleRatio;
- relativeTickRatio;
- age clocks from DL-031;
- interaction history;
- opportunity receipt;
- source/version/asOf receipts;
- evaluability reason;
- manifestVersion/hash.

No future-return field.

## 17. Current decision

RETROACTIVE_ATR_BOUNDARY_ADAPTATION =
PROHIBITED.

REGIME_CHANGE_RESETS_ROOT_AGE =
FALSE.

REGIME_CHANGE_RESETS_VERSION_AGE =
FALSE.

SCALE_NORMALIZATION_MUTATES_OBJECT_IDENTITY =
FALSE.

AGE_ONLY_WITHOUT_SCALE_CONTEXT =
INSUFFICIENT_FOR_DECAY_CLAIM.

EXTRAPOLATION_OUTSIDE_COMMON_SUPPORT =
PROHIBITED.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 18. Exact next continuation

1. Build deterministic formation/current scale-context helper and adversarial tests.
2. Preserve the frozen boundary while computing normalized descriptors.
3. Hand common-support and nested C0-C3 inference to D16.
4. Consume volatility/regime/liquidity owner receipts without duplicating their taxonomies.
5. Execute DL-022..DL-032 research Node tests only through a reproducible approved research-test path.
6. Next D01 science: separate structural aging from absolute price displacement / long excursion path so "far away for a long time" is not conflated with "old."
7. No outcome join / no runtime wiring / no Formal change.
