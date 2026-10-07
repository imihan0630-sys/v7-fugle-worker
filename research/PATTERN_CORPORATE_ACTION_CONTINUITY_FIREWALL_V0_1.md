# D01 DL-065 — Structural Response vs Corporate-Action Price Discontinuity / Continuity Spaces V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / CORPORATE_ACTION_CONTINUITY_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-064 separated structural response from daily price-limit and cross-session queue mechanics.

DL-065 freezes another attribution firewall:

> A raw-price gap, apparent support break, resistance breakout or zone relocation around ex-dividend, ex-right, capital reduction, par-value change or related corporate-action dates may be a mechanical reference-price reset rather than genuine market traversal through the structural zone.

D01 must preserve executable raw price and technical continuity as different semantic spaces.

No future outcome is opened in this tranche.

## 2. Canonical ownership

Corporate Actions lane is the canonical owner of:
- RAW_EXECUTION;
- TECHNICAL_CONTINUITY;
- PRICE_INDEX_COMPARABLE;
- TOTAL_RETURN_COMPARABLE;
- corporate-action factor derivation;
- action lifecycle/version provenance;
- symbol suspension/resumption interaction.

D01 consumes those receipts fail-closed.

D01 MUST NOT:
- build a second adjustment engine;
- infer split/dividend factors from later price behavior;
- silently use provider-adjusted history without replay-safe vintage semantics.

## 3. Four semantic spaces are not interchangeable

### A. RAW_EXECUTION

Observed traded/open/high/low/close prices.
Use for:
- executable price;
- actual auction/trade path;
- slippage/cost context.

### B. TECHNICAL_CONTINUITY

Research price space that removes verified mechanical price resets while preserving causal technical continuity.

Use for:
- K-line geometry;
- swing identity;
- support/resistance continuity;
- gap/breakout classification across verified corporate actions.

### C. PRICE_INDEX_COMPARABLE

Price-return comparison space compatible with the selected benchmark price-index semantics.

Not automatically identical to TECHNICAL_CONTINUITY.

### D. TOTAL_RETURN_COMPARABLE

Total-return comparison space including distributions as defined by the canonical owner.

Not a chart geometry substitute.

Hard rule:
ONE SPACE MAY NOT SILENTLY SUBSTITUTE FOR ANOTHER.

## 4. Corporate-action event families

At minimum preserve:
- CASH_DIVIDEND_EX_DATE;
- STOCK_DIVIDEND_EX_RIGHT_DATE;
- CASH_CAPITAL_INCREASE_EX_RIGHT_DATE;
- MIXED_RIGHT_DIVIDEND_EVENT;
- CAPITAL_REDUCTION_LOSS_OFFSET;
- CAPITAL_REDUCTION_CASH_REFUND;
- DEMERGER_CAPITAL_REDUCTION;
- PAR_VALUE_CHANGE;
- NEW_SHARES_LISTED;
- SUSPENSION_RESUMPTION;
- OTHER_VERIFIED_PRICE_RESET;
- EVENT_COVERAGE_UNKNOWN.

Event stages within one economic action remain separate.

## 5. Point-in-time event receipt

Each event version needs:
- actionFamilyId;
- eventKey;
- eventStage;
- actionType;
- eventVersion;
- effectiveDate;
- firstKnownAt;
- finalScheduleKnownAt;
- sourceQuality;
- factorQuality;
- source/version/hash;
- replaySafe;
- supersedes / revision lineage;
- readiness flags.

A historical replay may consume only the latest version known by predictorFreezeAt.

Later corrections never rewrite an earlier predictor snapshot.

## 6. Technical factor receipt

For a price-reset event crossing the research window, TECHNICAL_CONTINUITY requires:
- verified technicalPriceFactor;
- factor > 0;
- factor provenance;
- factor derivation known by the applicable decision clock;
- event effectiveDate;
- explicit mode identity.

Missing factor:
CORPORATE_ACTION_CONTINUITY_DATA_BLOCKED.

factor = 1 is legal only when explicitly justified.
It is never the missing-data default.

## 7. Raw gap vs economic gap

Suppose:
prior raw close = 100;
verified ex-dividend reference reset = 95;
event-day open = 95.

RAW gap = -5.

But if TECHNICAL_CONTINUITY maps the pre-event structural geometry onto the ex-date basis, there may be no economic traversal through the old zone.

Freeze:

RAW_MECHANICAL_GAP
- discontinuity explained by verified corporate-action reference reset.

CONTINUITY_GAP
- residual gap after canonical continuity transform.

Only CONTINUITY_GAP may enter technical gap/breakout interpretation.

## 8. Structural boundary continuity

A structural root that existed before a verified price-reset event does not automatically die.

For each pre-event structural boundary preserve:
- preEventBoundaryRaw;
- transform factor/version;
- postEventBoundaryContinuityEquivalent;
- structuralRootId;
- structuralVersionId;
- actionEventId.

If corporate action changes only the price unit/reference and causal structural identity remains valid:
CORPORATE_ACTION_CONTINUITY_VERSION.

This is a new structural version of the same root, not a new independent root.

## 9. Raw execution is still needed

TECHNICAL_CONTINUITY does not erase the traded tape.

On the ex-date:
- actual open/high/low/close remain RAW_EXECUTION facts;
- execution/slippage uses raw tradable prices;
- technical geometry may use continuity space.

Both spaces are retained with explicit labels.

Do not execute a hypothetical adjusted price.

## 10. Corporate-action discontinuity cannot be pattern evidence

Prohibited:
- count cash-dividend mechanical drop as bearish gap;
- count capital-reduction reference jump as bullish breakout;
- count par-value unit change as V-shaped reversal;
- count mechanically relocated prior high/low as a new support/resistance level;
- use the mechanical discontinuity as a volume-price confirmation.

State:
CORPORATE_ACTION_MECHANICAL_DISCONTINUITY.

## 11. Ex-dividend/ex-right opening reference

TWSE publishes/derives dedicated ex-right/ex-dividend reference information, including:
- prior closing price;
- ex-right/ex-dividend reference price;
- rights/dividend value;
- upper/lower limits;
- opening reference / auction reference.

D01 consumes this official/canonical receipt.

Do not reconstruct the exchange reference from a simplified formula when the official receipt is available.

## 12. Capital reduction / par-value change

Capital reduction and par-value changes can mechanically rescale the reference price by share-count/unit changes.

These events require explicit canonical transformation receipts.

A large raw jump on resumed trading is not a trend breakout until continuity semantics are resolved.

## 13. Suspension/resumption interaction

Some corporate actions include symbol-specific suspension and later resumption.

Expected symbol-session continuity must exclude only VERIFIED suspension sessions.

Unknown suspension provenance:
SYMBOL_SESSION_OR_ACTION_DATA_BLOCKED.

D01 does not fill suspension dates with pseudo-bars.

## 14. Volume semantics do not inherit price factors

A price factor does not automatically define volume transformation.

Corporate Actions owner distinguishes:
- NONE;
- UNIT_SCALE;
- SUPPLY_CHANGE;
- UNKNOWN.

D01 consumes the declared volume semantics.

Do not mechanically divide/multiply historical volume just because price was adjusted.

## 15. Fill-right / fill-dividend behavior is outcome, not adjustment truth

After ex-date, price may:
- fill the dividend/right;
- partially fill;
- fail to fill;
- move for unrelated market reasons.

Those later outcomes may be research endpoints.

They may NOT:
- determine the technicalPriceFactor;
- decide whether the action was mechanically adjusted;
- retroactively choose the continuity transform.

## 16. Reference conflicts

Do not collapse:
- previousRawClose;
- economicAdjustmentReference;
- exchangeOpeningReference;
- providerAdjustedAnchor;
- dailyChangeReference.

If sources disagree:
REFERENCE_CONFLICT_DATA_BLOCKED
for any claim requiring the disputed semantic.

Preserve all receipts and conflict reasons.

## 17. Blind provider adjustment is prohibited

A provider may rewrite historical bars onto a later adjustment basis.

Without point-in-time adjustment vintage:
PROVIDER_ADJUSTED_HISTORY_REPLAY_UNSAFE.

Historical research must not use a later-known adjustment basis as if it were available at the original decision timestamp.

## 18. Dual-space sample identity / SDA-001

RAW_EXECUTION and TECHNICAL_CONTINUITY views of one event are not two independent confirmations.

They are two semantic views of the same parent price history.

Default:
informationRoot = PRICE_OHLC;
effectiveIndependentEvidenceCount = 1.

## 19. No-lookahead / SDA-002

Every transform receipt requires:
- firstKnownAt;
- finalScheduleKnownAt;
- effectiveDate;
- predictorFreezeAt;
- eventVersion;
- factorVersion;
- replaySafe.

A revision known after predictorFreezeAt cannot be backfilled.

## 20. Primary future comparator

G0 CORPORATE_ACTION_EVENT_AWAY_FROM_STRUCTURAL_ZONE
- verified action / continuity transform;
- no structural opportunity near the transformed zone.

G1 CORPORATE_ACTION_EVENT_AT_STRUCTURAL_ZONE
- matched action/context;
- valid continuity-space structural opportunity.

If G1 adds no residual representation, corporate-action/reference mechanics are sufficient.

## 21. Raw-vs-continuity falsifier

Future analysis must report how often:
- RAW says breakout / CONTINUITY says no breakout;
- RAW says gap / CONTINUITY says mechanical reset;
- RAW says support break / CONTINUITY preserves zone;
- both spaces agree.

This is semantic contamination evidence, not alpha.

## 22. Common support

Future D16 inference should preserve overlap in:
- action family;
- dividend/right magnitude;
- raw gap;
- continuity residual gap;
- liquidity;
- volatility/regime;
- prior structural age/history;
- suspension/resumption state;
- opening auction state;
- news/event context.

Do not compare unrelated corporate-action families as if adjustment magnitude were exchangeable.

## 23. Future D16 ladder

C0 RAW_PRICE_ZONE_RESPONSE

C1 CORPORATE_ACTION_EVENT_IDENTIFIED

C2 POINT_IN_TIME_EVENT_VERSION_CONTROLLED

C3 TECHNICAL_CONTINUITY_FACTOR_VERIFIED

C4 RAW_VS_CONTINUITY_GEOMETRY_SEPARATED

C5 SYMBOL_SESSION_SUSPENSION_CONTROLLED

C6 VOLUME_SEMANTICS_CONTROLLED

C7 REFERENCE_CONFLICTS_EXCLUDED_OR_STRATIFIED

C8 GENERIC_CORPORATE_ACTION_COMPARATOR_CONTROLLED

C9 PROVIDER_ADJUSTMENT_VINTAGE_CONTROLLED

C10 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE

C11 MULTI_ACTION_MULTI_DATE_MULTI_SYMBOL_REPLICATION

## 24. Interpretation states

Q0 MECHANICAL_REFERENCE_RESET_EXPLANATION

Q1 CORPORATE_ACTION_GAP_EXPLANATION

Q2 CAPITAL_UNIT_RESCALE_EXPLANATION

Q3 SUSPENSION_RESUMPTION_EXPLANATION

Q4 PROVIDER_ADJUSTMENT_LOOKAHEAD_EXPLANATION

Q5 VOLUME_SEMANTIC_CONTAMINATION

Q6 REFERENCE_CONFLICT

Q7 STRUCTURAL_RESPONSE_RESIDUAL

Q8 EVENT_COVERAGE_UNKNOWN

Q9 NOT_EVALUABLE

None proves alpha.

## 25. Required manifest fields

Per parent/opportunity:
- parentDecisionId;
- symbol;
- sessionDate;
- predictorFreezeAt;
- structuralRootId;
- structuralVersionId;
- preEventBoundaryRaw;
- postEventBoundaryContinuityEquivalent;
- semanticSpace;
- actionFamilyId;
- eventKey;
- eventStage;
- actionType;
- eventVersion;
- effectiveDate;
- firstKnownAt;
- finalScheduleKnownAt;
- technicalPriceFactor;
- factorVersion;
- previousRawClose;
- economicAdjustmentReference;
- exchangeOpeningReference;
- rawOpen/high/low/close;
- continuityOpen/high/low/close;
- rawGap;
- continuityGap;
- volumeTransformMode;
- suspensionReceipt;
- referenceConflictReasons;
- providerAdjustmentVintage;
- replaySafe;
- informationRoot;
- effectiveIndependentEvidenceCount;
- evaluabilityReason;
- manifestVersion/hash.

No future return / fill-dividend outcome belongs in predictor state.

## 26. Current decision

RAW_EXECUTION_EQUALS_TECHNICAL_CONTINUITY =
FALSE.

CORPORATE_ACTION_MECHANICAL_GAP_EQUALS_PATTERN_GAP =
FALSE.

PRICE_FACTOR_AUTOMATICALLY_TRANSFORMS_VOLUME =
FALSE.

FILL_DIVIDEND_OUTCOME_DEFINES_ADJUSTMENT =
FALSE.

LATER_PROVIDER_ADJUSTMENT_CAN_BACKFILL_HISTORY =
FALSE.

DUAL_PRICE_SPACE_EQUALS_TWO_CONFIRMATIONS =
FALSE.

D01_BUILDS_INDEPENDENT_ADJUSTMENT_ENGINE =
FALSE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 27. Exact next continuation

1. Build deterministic semantic-space / transform-receipt / raw-vs-continuity classifier and adversarial tests.
2. Consume Corporate Actions lane receipts; do not implement a second adjustment engine in D01.
3. Preserve raw execution and technical continuity simultaneously.
4. Hand C0-C11 / Q0-Q9 continuity-attribution inference to D16.
5. Keep SDA-001/SDA-002 open until canonical closure evidence exists.
6. Next D01 science: separate structural response from suspension/resumption stale-price anchoring and reopening price discovery after multi-session no-trade intervals.
7. No outcome join / no runtime wiring / no Formal change.
