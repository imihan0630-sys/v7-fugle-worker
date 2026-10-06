# D01 DL-052 — Immediate Snapback / Price-Discovery Completion vs Persistent Structural Rejection V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / POST_SHOCK_PERSISTENCE_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-050 separated ordinary continuous transitions from auction / limit / event / microstructure repricing.
DL-051 separated raw zone churn from volatility clustering, realized-volatility bursts and liquidity deterioration.

DL-052 asks the next causal question:

> After a volatility/liquidity/discrete-repricing shock near a structural zone, is the observed reversal only an immediate mechanical snapback / completion of price discovery, or does the structural rejection persist after the shock mechanics have dissipated?

One-bar or one-window reversal is insufficient evidence of durable structural rejection.

No economic alpha outcome is inspected in this tranche.

## 2. Evidence context

Market-microstructure literature documents that liquidity shocks can create temporary price concessions followed by short-term reversal.

Research on thin / after-hours / auction-related price discovery also documents noisy price deviations and subsequent reversals.

Temporary price impact, spread effects, inventory/liquidity provision and price-discovery completion can therefore mimic a support/resistance rejection.

D01 must distinguish:
- immediate reversal after a shock;
- retention of the shock displacement at a new price level;
- re-entry into the structural zone;
- structural-side rejection that persists beyond the immediate repair window.

None of these alone proves alpha.

## 3. Owner boundary

D04 owns:
- volatility shock / realized-volatility state;
- volatility persistence / normalization.

D05 owns:
- spread/depth/liquidity shock;
- quote freshness;
- midquote / transaction-price microstructure primitives;
- temporary-impact / bounce owner diagnostics where available.

D11/D17 own:
- public event instance and event clock.

D03 owns:
- pathEfficiency10 / trend-quality.

D01 owns:
- relation between a frozen structural zone and the post-shock path;
- structural rejection / re-entry / continuation semantics;
- persistence-stage interpretation.

D01 does not redefine shock thresholds, spread/depth thresholds or efficient-price estimators.

## 4. Separate clocks

Freeze at least four clocks.

### T0 — SHOCK_ANCHOR

Owner-certified shock / repricing event:
- shockAt;
- preShockReferenceAt;
- preShockReferencePrice;
- shockObservedPrice;
- shockMechanismReceipt.

This is the causal anchor.

### T1 — IMMEDIATE_REPAIR_WINDOW

A preregistered follow-up window immediately after T0.

Purpose:
detect temporary impact / snapback / early price-discovery adjustment.

D01 does not choose the duration after outcomes.

### T2 — STRUCTURAL_TEST_WINDOW

A later preregistered window in which a valid interaction with the frozen zone may occur.

Purpose:
observe whether a structural rejection / acceptance candidate exists after immediate repair mechanics.

### T3 — PERSISTENCE_FOLLOWUP

One or more preregistered later windows used only to test whether the T2 structural-side state persists.

No single numeric horizon is universally frozen here.

All tested horizons belong to one frozen family.

## 5. Horizon-family firewall

Every study exports:
- followupHorizonFamilyId;
- horizonRegistryFrozenAt;
- ordered horizon IDs;
- horizon definitions;
- family hash.

Prohibited after outcome inspection:
- choosing the best horizon;
- deleting horizons that fail;
- redefining "persistent" at the horizon with the strongest result;
- adding a new later horizon to rescue a transient effect.

If the horizon family changes after outcome access:
NEW_EXPERIMENT_FAMILY_REQUIRED.

## 6. Reference-price semantics

Post-shock path interpretation needs separate reference objects.

### R0 — PRE_SHOCK_REFERENCE

Preferred owner-certified efficient-price proxy:
- two-sided midquote when valid;
- otherwise a lower-confidence owner-approved reference.

### R1 — SHOCK_OBSERVED_PRICE

The first owner-certified observed/clearing/executable price after the shock mechanism.

### R2 — FROZEN_STRUCTURAL_ZONE

The D01 structural boundary active at predictor freeze.

These are not aliases.

A return toward R0 is not automatically a structural-zone rejection.
A return to R2 is not automatically a complete reversal of the shock.

## 7. Signed shock displacement

When reference semantics are valid:

shockDisplacement =
shockObservedPrice - preShockReferencePrice.

Future descriptive follow-up may store signed displacement relative to R0.

No absolute percentage threshold defines a shock in D01.
The shock is supplied by the owner receipt.

## 8. Immediate snapback candidate

An IMMEDIATE_SNAPBACK_CANDIDATE requires:
- valid T0 shock receipt;
- complete T1 follow-up;
- post-shock movement toward the pre-shock reference or owner-certified temporary-impact correction state;
- no claim of durable structural rejection.

A snapback can occur:
- with no structural-zone test;
- before the structural zone is revisited;
- through microstructure normalization;
- after auction/VI reopening;
- after temporary liquidity pressure.

Therefore:
IMMEDIATE_SNAPBACK != STRUCTURAL_REJECTION.

## 9. Price-discovery completion candidate

A PRICE_DISCOVERY_COMPLETION_CANDIDATE may occur when:
- the shock moves price to a new level;
- immediate noise / spread / liquidity effects normalize;
- later prices retain a substantial part of the shock displacement under owner-defined follow-up semantics.

D01 does not define a retention threshold.

This state is different from:
- full snapback;
- structural rejection at the old zone;
- trend continuation.

It remains a mechanism candidate.

## 10. Structural rejection candidate

A STRUCTURAL_REJECTION_CANDIDATE requires:
- a valid structural-zone interaction after the shock;
- predictor state frozen before the response;
- no post-hoc zone construction;
- zone-side transition/rejection semantics from D01;
- DL-050 market-mechanism state;
- DL-051 volatility/liquidity context;
- complete follow-up receipt.

The first rejection response itself is an outcome state for the interaction and cannot be used to define an earlier predictor.

## 11. Persistent structural rejection candidate

A PERSISTENT_STRUCTURAL_REJECTION_CANDIDATE requires:
- valid structural rejection candidate at T2;
- at least one preregistered later persistence receipt;
- no intervening new shock / auction reset / price-limit episode / event clock that makes the persistence path non-comparable;
- no missing/reconnect path that makes state continuity unknown;
- later state compatible with the original rejection orientation.

This remains a research candidate.

It is not alpha and not independent evidence by default.

## 12. One-bar rejection is transient by default

If only the immediate post-shock bar/window rejects the zone but later preregistered persistence receipts are unavailable or inconsistent:

TRANSIENT_REJECTION_OR_SNAPBACK.

Do not relabel it as durable support/resistance.

## 13. Repeated-shock contamination

If a second owner-certified volatility/liquidity/event/mechanism shock occurs between T0 and a later persistence horizon:

REPEATED_SHOCK_CONTAMINATED.

Do not attribute the later state solely to the original structural rejection.

Future D16 may stratify or censor according to a preregistered protocol.

D01 does not choose the estimator.

## 14. Snapback fraction and displacement retention

Allowed descriptive outputs when denominators are valid:

shockDisplacementPrice;

followupDisplacementFromPreShock;

reversionTowardPreShockPrice;

displacementRetentionRatio =
followupDisplacementFromPreShock / shockDisplacementPrice.

These are descriptive.

If shockDisplacementPrice = 0 or unknown:
ratio = UNKNOWN.

No retention cutoff defines permanent vs temporary impact in D01.

## 15. Midquote / transaction-price boundary

Where direct quotes exist:
- use owner-certified midquote / efficient-price proxy for persistence interpretation;
- keep last-trade movement separately.

A last-trade snapback with stable midquote may be microstructure bounce rather than structural rejection.

If only transaction prices exist:
PRICE_DISCOVERY_SEPARATION_INCOMPLETE.

## 16. Zone rejection vs return to pre-shock reference

These questions are different:

Q-A:
Did price revert toward pre-shock reference?

Q-B:
Did price reject the frozen structural zone?

Q-C:
Did the rejection persist after immediate repair?

Q-D:
Did the shock displacement remain at a new price level?

All must be stored separately.

Do not infer one from another.

## 17. Post-shock state classes

P0 SHOCK_NO_VALID_ZONE_TEST

P1 IMMEDIATE_SNAPBACK_CANDIDATE

P2 PRICE_DISCOVERY_COMPLETION_CANDIDATE

P3 TRANSIENT_ZONE_REJECTION_CANDIDATE

P4 PERSISTENT_STRUCTURAL_REJECTION_CANDIDATE

P5 SHOCK_CONTINUATION_THROUGH_ZONE

P6 REPEATED_SHOCK_OR_MIXED_MECHANISM

P7 NOT_EVALUABLE

These are research labels only.

## 18. Causal timing / no-lookahead

At predictor freeze:
- later T1/T2/T3 states are future;
- future snapback / rejection / persistence cannot be features of the earlier parent.

A later completed shock-response episode may be used as historical context for a later independent decision only if:
- episode closed;
- all timestamps are replay-safe;
- no future data are rewritten backward.

## 19. Information lineage

Most post-shock path descriptors share PRICE_OHLC ancestry.

Default:
effectiveIndependentEvidenceCount = 1;
independentVoteAllowed = false;
residualIncrementalityStatus = NOT_VALIDATED.

Direct quote/spread/depth owner primitives can provide additional information roots but do not automatically become separate alpha votes.

## 20. Future D16 ladder

S0 RAW_IMMEDIATE_REVERSAL

S1 MICROSTRUCTURE_REFERENCE_CONTROLLED
- midquote vs transaction-price / spread / bounce controls.

S2 SHOCK_MECHANISM_CONTROLLED
- DL-050 auction/limit/event/VI state.

S3 VOL_LIQUIDITY_CONTEXT_CONTROLLED
- DL-051 pre-window / within-window context.

S4 FIRST_ZONE_TEST_SEPARATED
- separate no-zone-test, snapback-before-zone, valid zone test.

S5 PERSISTENCE_HORIZON_FAMILY
- retain all preregistered follow-up horizons.

S6 REPEATED_SHOCK_EXCLUDED_OR_STRATIFIED

S7 PERSISTENT_REJECTION_RESIDUAL_CANDIDATE

S8 MULTI_DATE_MULTI_REGIME_REPLICATION

## 21. Future interpretation states

Q0 TEMPORARY_IMPACT_SNAPBACK_EXPLANATION

Q1 PRICE_DISCOVERY_COMPLETION_EXPLANATION

Q2 MICROSTRUCTURE_BOUNCE_EXPLANATION

Q3 SHOCK_MECHANISM_EXPLANATION

Q4 TRANSIENT_ZONE_REJECTION_ONLY

Q5 REPEATED_SHOCK_SENSITIVE

Q6 PERSISTENT_STRUCTURAL_REJECTION_RESIDUAL

Q7 HORIZON_SENSITIVE

Q8 NOT_EVALUABLE

None proves structural memory or alpha.

## 22. Required manifest fields

Per shock / structural opportunity:
- parentDecisionId;
- symbol;
- marketDate;
- structuralRootId;
- structuralVersionId;
- semanticSpace;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- predictorFreezeAt;
- shockReceiptId;
- shockAt;
- shockMechanismClass;
- preShockReferenceAt;
- preShockReferenceType;
- preShockReferencePrice;
- shockObservedPrice;
- shockDisplacementPrice;
- immediateRepairWindowId;
- immediateRepairReceipt;
- firstZoneTestOpportunityAt;
- firstZoneTestReceipt;
- persistenceHorizonFamilyId;
- horizonRegistryFrozenAt;
- persistenceReceipts;
- repeatedShockReceipt;
- midquoteReceipt;
- transactionPriceReceipt;
- spreadDepthReceipt;
- dl050MechanismReceipt;
- dl051VolLiquidityReceipt;
- displacementRetentionDiagnostics;
- postShockStateClass;
- evaluabilityState;
- informationRoots;
- effectiveIndependentEvidenceCount;
- residualIncrementalityStatus;
- manifestVersion/hash.

No future response belongs in the predictor snapshot.

## 23. Current decision

ONE_BAR_SNAPBACK_EQUALS_STRUCTURAL_REJECTION =
FALSE.

IMMEDIATE_REVERSAL_EQUALS_DURABLE_REJECTION =
FALSE.

RETURN_TOWARD_PRE_SHOCK_REFERENCE_EQUALS_ZONE_REJECTION =
FALSE.

PRICE_DISCOVERY_COMPLETION_EQUALS_PATTERN_FAILURE =
FALSE.

BEST_PERSISTENCE_HORIZON_AFTER_OUTCOMES =
PROHIBITED.

REPEATED_SHOCK_PATH_EQUALS_SINGLE_SHOCK_PATH =
FALSE.

TRANSACTION_PRICE_SNAPBACK_WITHOUT_MIDQUOTE_CONTROL =
INSUFFICIENT.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 24. Exact next continuation

1. Build deterministic post-shock timing/state helper and persistence-horizon-family guard.
2. Add adversarial cases for one-window snapback, stable-midquote last-trade bounce, new-level retention, valid later zone rejection, repeated shock contamination and horizon cherry-picking.
3. Preserve T0/T1/T2/T3 clocks and R0/R1/R2 reference identities.
4. Hand S0-S8 / Q0-Q8 familywise/common-support inference to D16.
5. Keep D04/D05/D11/D17/D03 owner boundaries intact.
6. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
7. Next D01 science: separate persistent rejection from market/sector common reversal so a broad-market snapback is not credited to symbol-specific structure.
8. No runtime wiring / no Formal change.
